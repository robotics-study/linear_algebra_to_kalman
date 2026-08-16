import {useEffect, useMemo, useState} from "react";
import {Circle, Line, Text} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import {DragDot, fmt, makePlane} from "../../2d/plane";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {feasiblePolygon, HalfPlane, lpOverPolygon, Vec2} from "./optimize";

// LP 의 최적해가 언제나 꼭짓점에 있다는 것은 증명하기 전에 눈으로 먼저 확인할 수 있다.
// 목적 방향을 돌리면 최적점이 변을 따라 미끄러지는 것이 아니라 꼭짓점에서 꼭짓점으로 건너뛴다.
// 방향이 한 변에 정확히 수직이 되는 순간에만 그 변 전체가 동시에 최적이 된다.
const OK = "#10b981";
const TIE = "#f59e0b";
const SWEEP_LINES = 7;

interface Props {
    width?: number;
    height?: number;
}

// K = {x : A_in x <= b_in}. 상자 넷에 대각선 하나를 얹어 꼭짓점 다섯 개를 만든다.
const CONSTRAINTS: HalfPlane[] = [
    {a: {x: 1, y: 0}, b: 2.6},
    {a: {x: -1, y: 0}, b: 1.8},
    {a: {x: 0, y: 1}, b: 2.0},
    {a: {x: 0, y: -1}, b: 1.6},
    {a: {x: 1, y: 1}, b: 3.0},
];

// 목적 방향이 어떤 변의 바깥 법선과 정반대가 되면 그 변 전체가 최적이 된다. 우연히 만나기를
// 기다릴 필요가 없도록 그 각도들을 미리 적어 둔다.
const TIE_ANGLES = CONSTRAINTS.map((h) => {
    const deg = (Math.atan2(-h.a.y, -h.a.x) * 180) / Math.PI;
    return Math.round((deg + 360) % 360);
});

const LinearProgramLab = ({width: fixedWidth, height = 400}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 640);
    const width = fixedWidth ?? measured;
    const plane = makePlane(width, height, 3.4, 2.8);

    const [deg, setDeg] = useState(35);
    const [playing, setPlaying] = useState(false);
    const [tieIdx, setTieIdx] = useState(0);

    useEffect(() => {
        if (!playing) return;
        const id = window.setInterval(() => setDeg((d) => (d + 1) % 360), 40);
        return () => window.clearInterval(id);
    }, [playing]);

    const poly = useMemo(() => feasiblePolygon(CONSTRAINTS), []);
    const th = (deg * Math.PI) / 180;
    const fVec: Vec2 = {x: Math.cos(th), y: Math.sin(th)};
    const lp = lpOverPolygon(poly, fVec);

    // 목적함수의 등위선은 f 에 수직인 평행선 무리다. 쓸어 나가는 방향이 곧 f 다.
    const dir = {x: -fVec.y, y: fVec.x};
    const reach = plane.halfX + plane.halfY + 2;
    const sweep = Array.from({length: SWEEP_LINES}, (_, i) => {
        const level = lp.best + i * 1.1;
        const base = {x: fVec.x * level, y: fVec.y * level};
        const a = plane.px(base.x - dir.x * reach, base.y - dir.y * reach);
        const b = plane.px(base.x + dir.x * reach, base.y + dir.y * reach);
        return {key: i, points: [a.x, a.y, b.x, b.y], first: i === 0};
    });

    const optimum = lp.argmin.length === 1
        ? poly[lp.argmin[0]]
        : {
            x: (poly[lp.argmin[0]].x + poly[lp.argmin[1]].x) / 2,
            y: (poly[lp.argmin[0]].y + poly[lp.argmin[1]].y) / 2,
        };

    const snapToTie = () => {
        setPlaying(false);
        setDeg(TIE_ANGLES[tieIdx]);
        setTieIdx((i) => (i + 1) % TIE_ANGLES.length);
    };

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                <Line points={poly.flatMap((p) => {
                    const px = plane.px(p.x, p.y);
                    return [px.x, px.y];
                })} closed fill={OK} opacity={0.14} stroke={colors.muted} strokeWidth={1.6}
                      listening={false}/>

                {sweep.map(({key, points, first}) => (
                    <Line key={key} points={points} stroke={first ? (lp.degenerate ? TIE : OK) : colors.accent}
                          strokeWidth={first ? 2.6 : 1.1} opacity={first ? 1 : 0.45}
                          dash={first ? undefined : [5, 5]} listening={false}/>
                ))}

                {/* 최적이 변 하나 전체인 경우에는 그 변을 굵게 덮어 "꼭짓점 하나"가 아님을 보인다. */}
                {lp.degenerate && (() => {
                    const a = plane.px(poly[lp.argmin[0]].x, poly[lp.argmin[0]].y);
                    const b = plane.px(poly[lp.argmin[1]].x, poly[lp.argmin[1]].y);
                    return <Line points={[a.x, a.y, b.x, b.y]} stroke={TIE} strokeWidth={6}
                                 opacity={0.85} listening={false}/>;
                })()}

                {poly.map((v, i) => {
                    const px = plane.px(v.x, v.y);
                    const best = lp.argmin.includes(i);
                    return (
                        <Circle key={i} x={px.x} y={px.y} radius={best ? 7 : 4.5}
                                fill={best ? (lp.degenerate ? TIE : OK) : colors.muted}
                                listening={false}/>
                    );
                })}
                {poly.map((v, i) => {
                    const px = plane.px(v.x, v.y);
                    return (
                        <Text key={i} text={fmt(lp.values[i], 2)} x={px.x - 26} y={px.y - 22}
                              width={52} align="center" fontSize={10} fontFamily="monospace"
                              fill={lp.argmin.includes(i) ? (lp.degenerate ? TIE : OK) : colors.muted}
                              listening={false}/>
                    );
                })}

                {/* 방향 손잡이. 끌면 각도가 따라오고, 크기는 화면에 맞춰 고정한다. */}
                <DragDot plane={plane} x={fVec.x * 2.4} y={fVec.y * 2.4} color={colors.accent}
                         fill={colors.bg} radius={6}
                         constrain={(u) => {
                             const n = Math.hypot(u.x, u.y) || 1;
                             return {x: (u.x / n) * 2.4, y: (u.y / n) * 2.4};
                         }}
                         onMove={(u) => {
                             setPlaying(false);
                             setDeg((Math.round((Math.atan2(u.y, u.x) * 180) / Math.PI) + 360) % 360);
                         }}/>
                <Text text="min f'x over K" x={10} y={10} fontSize={11} fontFamily="monospace"
                      fill={colors.muted} listening={false}/>
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-20">θ = {deg}°</span>
                    <input type="range" min={0} max={359} step={1} value={deg}
                           aria-label={t("objective direction", "목적 방향")}
                           onChange={(e) => {
                               setPlaying(false);
                               setDeg(Number(e.target.value));
                           }}
                           className="w-40 accent-[var(--accent)]"/>
                </label>
                <button type="button" onClick={() => setPlaying((v) => !v)}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {playing ? t("pause", "멈춤") : t("rotate", "회전")}
                </button>
                <button type="button" onClick={snapToTie}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {t("jump to a tie", "동점 각도로")}
                </button>
            </div>

            <p className="mt-2 text-sm text-center font-mono"
               style={{color: lp.degenerate ? TIE : OK}}>
                f = ({fmt(fVec.x, 3)}, {fmt(fVec.y, 3)}) · min f′x = {fmt(lp.best, 3)}{" "}
                {t("at", "지점")} ({fmt(optimum.x, 2)}, {fmt(optimum.y, 2)})
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                {lp.degenerate
                    ? `${t("a whole edge is optimal", "변 하나가 통째로 최적")}: ${lp.argmin.length} ${t("vertices tie", "꼭짓점 동점")}`
                    : `${t("a single vertex is optimal", "꼭짓점 하나가 최적")} · ${t("vertex", "꼭짓점")} #${lp.argmin[0] + 1}`}
                {" · "}{poly.length} {t("vertices", "꼭짓점")}, {CONSTRAINTS.length} {t("constraints", "제약")}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {t("Rotate the objective and watch the answer: it does not creep along an edge, it jumps from one vertex to the next. That is why a linear program can be solved by walking a finite list of vertices rather than searching a continuum, and it is the whole idea behind the simplex method. The tie button lands on the one situation where an entire edge is optimal, which is exactly when the objective is perpendicular to that edge. The set of minimizers is still a convex set, so this is where writing arg min with an equals sign becomes a lie.",
                    "목적 방향을 돌리면서 답을 보라. 변을 따라 스멀스멀 움직이는 것이 아니라 꼭짓점에서 다음 꼭짓점으로 건너뛴다. linear program을 연속체를 뒤지는 대신 유한한 꼭짓점 목록을 걸어 다니며 풀 수 있는 이유가 이것이고, simplex 방법의 발상 전부가 이것이다. 동점 버튼은 변 하나가 통째로 최적이 되는 단 하나의 상황으로 데려가는데, 그때가 정확히 목적 방향이 그 변에 수직인 순간이다. 최소점들의 모임은 여전히 볼록 집합이고, 그래서 여기가 arg min을 등호로 적으면 거짓말이 되는 지점이다.")}
            </p>
        </div>
    );
};

export default LinearProgramLab;
