import {useMemo, useState} from "react";
import {Context} from "konva/lib/Context";
import {Shape as KonvaShape} from "konva/lib/Shape";
import {Circle, Shape, Text} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import {contour} from "../../2d/contour";
import {DragDot, fmt, makePlane} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {chordEscape, inRegion, REGIONS, RegionId, Vec2} from "./optimize";

// 정의 7.1 은 "두 점을 이은 선분이 집합을 벗어나지 않는다"는 한 문장이고, 그 한 문장은
// 끌어 보면 바로 보인다. 두 점은 언제나 집합 안에 머물게 묶어 두었으므로, 빨갛게 새는
// 구간이 나타난다면 그것은 곧 반례다.
const OK = "#10b981";
const BAD = "#ef4444";
const CHORD_SAMPLES = 160;

interface Props {
    width?: number;
    height?: number;
}

// 볼록하지 않은 집합마다 "선분이 새는" 점 쌍을 하나씩 준비해 둔다. 독자가 우연히 찾기를
// 기다리지 않고 버튼 한 번으로 반례를 보여 주기 위한 것이다.
const WITNESS: Partial<Record<RegionId, [Vec2, Vec2]>> = {
    crescent: [{x: 0, y: 1.7}, {x: 0, y: -1.7}],
    annulus: [{x: -1.5, y: 0}, {x: 1.5, y: 0}],
    twoDisks: [{x: -1.5, y: 0}, {x: 1.5, y: 0}],
};

const START: Record<RegionId, [Vec2, Vec2]> = {
    disk: [{x: -1.3, y: -0.8}, {x: 1.2, y: 0.9}],
    polygon: [{x: -1.1, y: -0.7}, {x: 0.9, y: 0.8}],
    crescent: [{x: -1.6, y: 0.7}, {x: 0.2, y: 1.7}],
    annulus: [{x: -1.5, y: 0.4}, {x: 1.4, y: 0.6}],
    twoDisks: [{x: -1.7, y: 0.3}, {x: 1.3, y: -0.4}],
};

const ORDER: RegionId[] = ["disk", "polygon", "crescent", "annulus", "twoDisks"];

const LABEL: Record<RegionId, [en: string, ko: string]> = {
    disk: ["ball", "공"],
    polygon: ["polyhedron", "다면체"],
    crescent: ["crescent", "초승달"],
    annulus: ["annulus", "고리"],
    twoDisks: ["union of two balls", "공 두 개의 합집합"],
};

const ConvexSetLab = ({width: fixedWidth, height = 380}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;
    const plane = makePlane(width, height, 2.9, 2.4);

    const [regionId, setRegionId] = useState<RegionId>("disk");
    const [pts, setPts] = useState<[Vec2, Vec2]>(START.disk);
    const [lambda, setLambda] = useState(0.5);
    const region = REGIONS[regionId];

    const pickRegion = (id: RegionId) => {
        setRegionId(id);
        setPts(START[id]);
    };

    // 채우기는 가로줄을 훑으며 f <= 0 인 구간을 모아 만든다. 고리나 합집합처럼 조각이 여럿인
    // 영역도 경우 나누기 없이 칠해진다. 끌 때마다 다시 계산할 필요는 없으므로 영역과 크기에만 묶는다.
    const fillRuns = useMemo(() => {
        const step = 3;
        const runs: number[][] = [];
        for (let py = 0; py < height; py += step) {
            let start = -1;
            for (let px = 0; px <= width; px += step) {
                const u = plane.units(px, py);
                const inside = px < width && region.f(u.x, u.y) <= 0;
                if (inside && start < 0) start = px;
                if (!inside && start >= 0) {
                    runs.push([start, py, px - start, step]);
                    start = -1;
                }
            }
        }
        return runs;
    }, [regionId, width, height]);

    const border = useMemo(
        () => contour(region.f, 0, plane.halfX, plane.halfY, 140),
        [regionId, plane.halfX, plane.halfY],
    );

    const [p, q] = pts;
    const escape = chordEscape(region, p, q);
    const violated = escape.outside > 0;

    // 선분을 잘게 쪼개 안/밖으로 나눈다. 새는 구간만 빨갛게 그리면 어디서 벗어나는지가 보인다.
    const chord = useMemo(() => {
        const insideSegs: number[][] = [];
        const outsideSegs: number[][] = [];
        for (let i = 0; i < CHORD_SAMPLES; i++) {
            const l0 = i / CHORD_SAMPLES;
            const l1 = (i + 1) / CHORD_SAMPLES;
            const at = (l: number) => ({x: l * p.x + (1 - l) * q.x, y: l * p.y + (1 - l) * q.y});
            const a = at(l0);
            const b = at(l1);
            const mid = at((l0 + l1) / 2);
            (inRegion(region, mid) ? insideSegs : outsideSegs).push([a.x, a.y, b.x, b.y]);
        }
        return {insideSegs, outsideSegs};
    }, [regionId, p.x, p.y, q.x, q.y]);

    const marker = {x: lambda * p.x + (1 - lambda) * q.x, y: lambda * p.y + (1 - lambda) * q.y};
    const markerIn = inRegion(region, marker);
    const markerPx = plane.px(marker.x, marker.y);

    // 끌어도 두 점은 집합 안에 남아 있어야 한다. 정의가 "C 안의 두 점"에 대해 말하기 때문이다.
    const keepInside = (current: Vec2) => (u: Vec2) => (inRegion(region, u) ? u : current);

    const drawSegs = (segs: number[][], color: string, strokeWidth: number) => (
        <Shape listening={false} stroke={color} strokeWidth={strokeWidth} lineCap="round"
               sceneFunc={(ctx: Context, shape: KonvaShape) => {
                   ctx.beginPath();
                   for (const s of segs) {
                       const a = plane.px(s[0], s[1]);
                       const b = plane.px(s[2], s[3]);
                       ctx.moveTo(a.x, a.y);
                       ctx.lineTo(b.x, b.y);
                   }
                   ctx.strokeShape(shape);
               }}/>
    );

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                <Shape listening={false} fill={colors.accent} opacity={0.16}
                       sceneFunc={(ctx: Context, shape: KonvaShape) => {
                           ctx.beginPath();
                           for (const [x, y, w, h] of fillRuns) ctx.rect(x, y, w, h);
                           ctx.fillShape(shape);
                       }}/>
                {drawSegs(border, violated ? BAD : OK, 2)}

                {drawSegs(chord.insideSegs, OK, 4)}
                {drawSegs(chord.outsideSegs, BAD, 6)}

                <Circle x={markerPx.x} y={markerPx.y} radius={5.5} listening={false}
                        fill={markerIn ? OK : BAD} stroke={colors.bg} strokeWidth={1.5}/>
                <Text text={region.formula} x={10} y={10} fontSize={11} fontFamily="monospace"
                      fill={colors.muted} listening={false}/>

                <DragDot plane={plane} x={p.x} y={p.y} color={colors.accent} fill={colors.bg}
                         constrain={keepInside(p)} onMove={(u) => setPts([u, q])}/>
                <DragDot plane={plane} x={q.x} y={q.y} color={colors.accent2} fill={colors.bg}
                         constrain={keepInside(q)} onMove={(u) => setPts([p, u])}/>
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {ORDER.map((id) => (
                    <button key={id} type="button" onClick={() => pickRegion(id)}
                            className={cn("px-2.5 py-1 rounded border",
                                regionId === id
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {t(...LABEL[id])}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-24">λ = {fmt(lambda, 2)}</span>
                    <input type="range" min={0} max={1} step={0.01} value={lambda}
                           aria-label={t("convex combination weight", "볼록 결합 가중치")}
                           onChange={(e) => setLambda(Number(e.target.value))}
                           className="w-36 accent-[var(--accent)]"/>
                </label>
                {WITNESS[regionId] && (
                    <button type="button" onClick={() => setPts(WITNESS[regionId]!)}
                            className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                        {t("show a chord that escapes", "새는 선분 보기")}
                    </button>
                )}
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: violated ? BAD : OK}}>
                λx + (1 − λ)y = ({fmt(marker.x)}, {fmt(marker.y)}) ·{" "}
                {markerIn ? t("in C", "C 안") : t("outside C", "C 밖")}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                {t("chord outside C", "선분이 C를 벗어난 비율")}: {fmt(100 * escape.outside, 1)}%
                {escape.worstLambda !== null && ` · ${t("deepest at λ", "가장 깊은 곳 λ")} = ${fmt(escape.worstLambda, 2)}`}
                {" · "}{t("set is convex", "집합의 볼록성")}: {region.convex ? "yes" : "no"}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {region.convex
                    ? t("Both handles are locked inside C, and no matter where you put them the chord stays green. That is the whole of Definition 7.1: convexity is not a shape, it is a promise about every pair of points at once. A ball is convex for any norm, and an intersection of half-spaces is convex because each half-space is.",
                        "두 손잡이는 C 안에 묶여 있고, 어디에 두든 선분은 초록으로 남는다. 정의 7.1의 전부가 이것이다. 볼록성은 모양이 아니라 모든 점 쌍에 대해 한꺼번에 하는 약속이다. 공은 어떤 norm에서도 볼록하고, 반공간의 교집합은 각 반공간이 볼록하기 때문에 볼록하다.")
                    : t("Both endpoints are in C and part of the chord still leaves it, so one pair of points is all it takes to break the definition. The union case is the one to remember: intersections of convex sets stay convex, unions do not, which is why constraints can be piled up freely but alternatives cannot.",
                        "양 끝점이 모두 C 안에 있는데도 선분의 일부가 밖으로 나간다. 정의를 깨는 데는 점 한 쌍이면 충분하다. 기억할 것은 합집합 경우다. 볼록 집합의 교집합은 볼록하게 남지만 합집합은 그렇지 않고, 그래서 제약은 얼마든지 쌓아도 되지만 선택지는 그럴 수 없다.")}
            </p>
        </div>
    );
};

export default ConvexSetLab;
