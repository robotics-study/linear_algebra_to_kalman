import {useMemo, useState} from "react";
import {Context} from "konva/lib/Context";
import {KonvaEventObject} from "konva/lib/Node";
import {Shape as KonvaShape} from "konva/lib/Shape";
import {Circle, Layer, Line, Shape, Stage, Text} from "react-konva";
import {fmt} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {chordGap, CURVES, CurveId, tangentGap, Vec2} from "./optimize";

// 정의 7.4(현이 그래프 위에 있다)와 1차 조건(접선이 그래프 아래에 있다)과 "epigraph 가 볼록
// 집합이다"는 서로 다른 세 정의처럼 읽히지만 같은 성질의 세 얼굴이다. 같은 곡선 위에서 판을
// 바꿔 가며 재 보면 세 판이 동시에 통과하거나 동시에 깨진다.
const OK = "#10b981";
const BAD = "#ef4444";
const PAD = {left: 40, right: 18, top: 18, bottom: 30};
const XLO = -3;
const XHI = 3;
const SAMPLES = 240;
// 위반 구간을 색으로 가르는 데 필요한 해상도. 곡선 자체보다 성기게 잡아도 눈에 차이가 없다.
const SPLIT = 96;

type Mode = "chord" | "tangent" | "epigraph";

interface Props {
    width?: number;
    height?: number;
}

const ORDER: CurveId[] = ["square", "abs", "exp", "cubic", "wave"];

const ConvexFunctionLab = ({width: fixedWidth, height = 380}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;

    const [curveId, setCurveId] = useState<CurveId>("square");
    const [mode, setMode] = useState<Mode>("chord");
    const [chordX, setChordX] = useState<[number, number]>([-2.2, 1.7]);
    const [tanX, setTanX] = useState(1.1);
    const [epiPts, setEpiPts] = useState<[Vec2, Vec2]>([{x: -2.2, y: 2.4}, {x: 1.9, y: 2.2}]);
    const curve = CURVES[curveId];

    const plotW = Math.max(150, width - PAD.left - PAD.right);
    const plotH = Math.max(120, height - PAD.top - PAD.bottom);

    // 세로 범위는 곡선마다 다르므로 표본에서 뽑는다. 위쪽을 조금 더 남겨 epigraph 가 화면 밖으로
    // 밀려 나가 보이지 않는 일이 없게 한다.
    const [yLo, yHi] = useMemo(() => {
        let lo = Infinity;
        let hi = -Infinity;
        for (let i = 0; i <= SAMPLES; i++) {
            const v = curve.f(XLO + ((XHI - XLO) * i) / SAMPLES);
            lo = Math.min(lo, v);
            hi = Math.max(hi, v);
        }
        const pad = 0.14 * (hi - lo || 1);
        return [lo - pad, hi + 1.6 * pad];
    }, [curveId]);

    const sx = (x: number) => PAD.left + ((x - XLO) / (XHI - XLO)) * plotW;
    const sy = (y: number) => PAD.top + plotH - ((y - yLo) / (yHi - yLo)) * plotH;
    const ix = (px: number) => XLO + ((px - PAD.left) / plotW) * (XHI - XLO);
    const iy = (py: number) => yLo + ((PAD.top + plotH - py) / plotH) * (yHi - yLo);
    const clampX = (x: number) => Math.min(XHI, Math.max(XLO, x));

    const curvePts = useMemo(() => {
        const out: number[] = [];
        for (let i = 0; i <= SAMPLES; i++) {
            const x = XLO + ((XHI - XLO) * i) / SAMPLES;
            out.push(sx(x), sy(curve.f(x)));
        }
        return out;
    }, [curveId, width, height, yLo, yHi]);

    // epigraph = {(x, y) : y >= f(x)}. 곡선 위쪽을 통째로 칠하면 "함수의 볼록성"이 곧 "이 집합의
    // 볼록성"이라는 말이 그림 한 장으로 읽힌다.
    const epiFill = useMemo(
        () => [...curvePts, sx(XHI), PAD.top, sx(XLO), PAD.top],
        [curvePts],
    );

    // 판마다 "무엇을 재는가"가 다르다. chord 는 현이 그래프 아래로 내려간 최대 깊이,
    // tangent 는 접선이 그래프 위로 올라간 최대 높이, epigraph 는 선분이 집합을 벗어난 비율이다.
    const [p, q] = chordX;
    const chord = chordGap(curve, p, q);
    const tangent = tangentGap(curve, tanX, XLO, XHI);
    const epi: [Vec2, Vec2] = [
        {x: epiPts[0].x, y: Math.max(epiPts[0].y, curve.f(epiPts[0].x))},
        {x: epiPts[1].x, y: Math.max(epiPts[1].y, curve.f(epiPts[1].x))},
    ];
    const epiEscape = useMemo(() => {
        let out = 0;
        for (let i = 0; i <= SAMPLES; i++) {
            const l = i / SAMPLES;
            const zx = l * epi[0].x + (1 - l) * epi[1].x;
            const zy = l * epi[0].y + (1 - l) * epi[1].y;
            if (zy < curve.f(zx) - 1e-9) out++;
        }
        return out / (SAMPLES + 1);
    }, [curveId, epi[0].x, epi[0].y, epi[1].x, epi[1].y]);

    const failing = mode === "chord" ? chord.worst > 1e-6
        : mode === "tangent" ? tangent.worst < -1e-6
            : epiEscape > 0;

    // 판 위의 선을 잘게 쪼개, 위반이 일어나는 조각만 다른 색으로 그린다.
    const splitLine = (at: (l: number) => {x: number; y: number}, bad: (pt: {x: number; y: number}) => boolean) => {
        const good: number[][] = [];
        const evil: number[][] = [];
        for (let i = 0; i < SPLIT; i++) {
            const a = at(i / SPLIT);
            const b = at((i + 1) / SPLIT);
            const mid = at((i + 0.5) / SPLIT);
            (bad(mid) ? evil : good).push([sx(a.x), sy(a.y), sx(b.x), sy(b.y)]);
        }
        return {good, evil};
    };

    const segs = mode === "chord"
        ? splitLine(
            (l) => ({x: l * p + (1 - l) * q, y: l * curve.f(p) + (1 - l) * curve.f(q)}),
            (pt) => pt.y < curve.f(pt.x) - 1e-9)
        : mode === "tangent"
            ? splitLine(
                (l) => {
                    const x = XLO + l * (XHI - XLO);
                    return {x, y: curve.f(tanX) + curve.df(tanX) * (x - tanX)};
                },
                (pt) => pt.y > curve.f(pt.x) + 1e-9)
            : splitLine(
                (l) => ({x: l * epi[0].x + (1 - l) * epi[1].x, y: l * epi[0].y + (1 - l) * epi[1].y}),
                (pt) => pt.y < curve.f(pt.x) - 1e-9);

    const drawSegs = (list: number[][], color: string, strokeWidth: number) => (
        <Shape listening={false} stroke={color} strokeWidth={strokeWidth} lineCap="round"
               sceneFunc={(ctx: Context, shape: KonvaShape) => {
                   ctx.beginPath();
                   for (const s of list) {
                       ctx.moveTo(s[0], s[1]);
                       ctx.lineTo(s[2], s[3]);
                   }
                   ctx.strokeShape(shape);
               }}/>
    );

    const hover = (cursor: string) => (e: KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = cursor;
    };

    // 곡선 위를 타는 손잡이. 세로 위치는 f 가 정하므로 가로만 끌린다.
    const OnCurve = ({x, color, onMove}: {x: number; color: string; onMove: (x: number) => void}) => (
        <Circle x={sx(x)} y={sy(curve.f(x))} radius={7} fill={colors.bg} stroke={color} strokeWidth={2.5}
                draggable
                dragBoundFunc={(pos) => {
                    const nx = clampX(ix(pos.x));
                    return {x: sx(nx), y: sy(curve.f(nx))};
                }}
                onDragMove={(e) => onMove(clampX(ix(e.target.x())))}
                onMouseEnter={hover("ew-resize")} onMouseLeave={hover("default")}/>
    );

    return (
        <div ref={ref} className="w-full">
            <Stage width={width} height={height} className="overflow-hidden w-fit h-fit">
                <Layer>
                    <Line points={epiFill} closed fill={colors.accent} opacity={0.13} listening={false}/>
                    <Line points={[PAD.left, PAD.top + plotH, PAD.left + plotW, PAD.top + plotH]}
                          stroke={colors.text} strokeWidth={1} listening={false}/>
                    <Line points={[sx(0), PAD.top, sx(0), PAD.top + plotH]}
                          stroke={colors.border} strokeWidth={1} listening={false}/>
                    <Line points={curvePts} stroke={colors.text} strokeWidth={2.4} listening={false}/>

                    {drawSegs(segs.good, OK, 3)}
                    {drawSegs(segs.evil, BAD, 5)}

                    {/* 위반이 가장 심한 지점을 세로 막대로 찍어 준다. 어디가 문제인지 눈이 바로 간다. */}
                    {mode === "chord" && chord.worst > 1e-6 && (
                        <Line points={[sx(chord.worstX), sy(curve.f(chord.worstX)),
                            sx(chord.worstX), sy(curve.f(chord.worstX) - chord.worst)]}
                              stroke={BAD} strokeWidth={2} dash={[4, 3]} listening={false}/>
                    )}
                    {mode === "tangent" && tangent.worst < -1e-6 && (
                        <Line points={[sx(tangent.worstX), sy(curve.f(tangent.worstX)),
                            sx(tangent.worstX), sy(curve.f(tangent.worstX) - tangent.worst)]}
                              stroke={BAD} strokeWidth={2} dash={[4, 3]} listening={false}/>
                    )}

                    <Text text={curve.formula} x={PAD.left + 6} y={PAD.top} fontSize={11}
                          fontFamily="monospace" fill={colors.muted} listening={false}/>
                    <Text text="epi f" x={PAD.left + plotW - 46} y={PAD.top + 2} fontSize={11}
                          fontFamily="monospace" fill={colors.accent} listening={false}/>

                    {mode === "chord" && (
                        <>
                            <OnCurve x={p} color={colors.accent}
                                     onMove={(nx) => setChordX([nx, q])}/>
                            <OnCurve x={q} color={colors.accent2}
                                     onMove={(nx) => setChordX([p, nx])}/>
                        </>
                    )}
                    {mode === "tangent" && <OnCurve x={tanX} color={colors.accent} onMove={setTanX}/>}
                    {mode === "epigraph" && ([0, 1] as const).map((i) => (
                        <Circle key={i} x={sx(epi[i].x)} y={sy(epi[i].y)} radius={7} fill={colors.bg}
                                stroke={i === 0 ? colors.accent : colors.accent2} strokeWidth={2.5}
                                draggable
                                dragBoundFunc={(pos) => {
                                    const nx = clampX(ix(pos.x));
                                    const ny = Math.max(curve.f(nx), iy(pos.y));
                                    return {x: sx(nx), y: sy(ny)};
                                }}
                                onDragMove={(e) => {
                                    const nx = clampX(ix(e.target.x()));
                                    const next: [Vec2, Vec2] = [epi[0], epi[1]];
                                    next[i] = {x: nx, y: Math.max(curve.f(nx), iy(e.target.y()))};
                                    setEpiPts(next);
                                }}
                                onMouseEnter={hover("grab")} onMouseLeave={hover("default")}/>
                    ))}
                </Layer>
            </Stage>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {ORDER.map((id) => (
                    <button key={id} type="button" onClick={() => setCurveId(id)}
                            className={cn("px-2.5 py-1 rounded border font-mono",
                                curveId === id
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {CURVES[id].formula.replace("f(x) = ", "")}
                    </button>
                ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {([["chord", t("chord above graph", "현이 그래프 위")],
                    ["tangent", t("tangent below graph", "접선이 그래프 아래")],
                    ["epigraph", t("epigraph is convex", "epigraph의 볼록성")]] as Array<[Mode, string]>)
                    .map(([m, label]) => (
                        <button key={m} type="button" onClick={() => setMode(m)}
                                className={cn("px-2.5 py-1 rounded border",
                                    mode === m
                                        ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                        : "border-border text-muted hover:bg-surface")}>
                            {label}
                        </button>
                    ))}
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: failing ? BAD : OK}}>
                {mode === "chord" && `max [ f(z) − chord(z) ] = ${fmt(chord.worst, 3)}`}
                {mode === "tangent" && `min [ f(z) − tangent(z) ] = ${fmt(tangent.worst, 3)}`}
                {mode === "epigraph" && `${t("segment outside epi f", "선분이 epi f를 벗어난 비율")} = ${fmt(100 * epiEscape, 1)}%`}
                {" · "}{curve.convex ? t("f is convex", "f는 볼록") : t("f is not convex", "f는 볼록하지 않다")}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                {mode === "chord" && `x = ${fmt(p)} · y = ${fmt(q)} · f(x) = ${fmt(curve.f(p), 3)} · f(y) = ${fmt(curve.f(q), 3)}`}
                {mode === "tangent" && `a = ${fmt(tanX)} · f(a) = ${fmt(curve.f(tanX), 3)} · f'(a) = ${fmt(curve.df(tanX), 3)}`}
                {mode === "epigraph" && `(${fmt(epi[0].x)}, ${fmt(epi[0].y)}) → (${fmt(epi[1].x)}, ${fmt(epi[1].y)})`}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {mode === "chord"
                    ? t("Definition 7.4 read literally: the chord between two points of the graph never dips below it. Switch to a non-convex curve and the red bar marks the z where the inequality fails, which is also a z where a local minimum can hide.",
                        "정의 7.4를 글자 그대로 읽은 것이다. 그래프 위 두 점을 잇는 현이 그래프 아래로 내려가지 않는다. 볼록하지 않은 곡선으로 바꾸면 부등식이 깨지는 z를 빨간 막대가 표시하는데, 그 z는 국소 최솟값이 숨을 수 있는 자리이기도 하다.")
                    : mode === "tangent"
                        ? t("The same property seen from one point instead of two: the tangent at a is a global lower bound for f. This is what makes a convex problem tractable, because a local slope tells you something about the whole function rather than only about its neighbourhood. For the kink at zero, the tangent shown is one subgradient, and it is still a lower bound.",
                            "같은 성질을 두 점이 아니라 한 점에서 본 것이다. a에서의 접선이 f 전체의 하계가 된다. 볼록 문제가 다룰 만해지는 이유가 이것이다. 국소 기울기가 근방에 대해서가 아니라 함수 전체에 대해 무언가를 말해 주기 때문이다. 0의 꺾인 점에서 그려진 접선은 subgradient 하나이고, 그것도 여전히 하계다.")
                        : t("The two definitions are one definition. The region above the graph is a set, and f is convex exactly when that set is convex in the sense of Definition 7.1. Keep this picture: the LP trick at the end of this chapter works by putting a variable on the vertical axis of this very region.",
                            "두 정의는 사실 한 정의다. 그래프 위쪽 영역은 집합이고, f가 볼록하다는 것은 정확히 그 집합이 정의 7.1의 뜻으로 볼록하다는 것이다. 이 그림을 기억해 두자. 이 장 끝의 LP 요령은 바로 이 영역의 세로축에 변수를 하나 얹는 방식으로 작동한다.")}
            </p>
        </div>
    );
};

export default ConvexFunctionLab;
