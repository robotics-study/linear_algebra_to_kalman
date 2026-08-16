import {useState} from "react";
import {Circle, Line, Text} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {DragDot, fmt, makePlane, norm, SpanLine, VecArrow} from "./plane";

// 부분 공간 정의에서 가장 자주 놓치는 조건이 0 ∈ Y 다. 직선을 원점에서 살짝 밀어 보면
// 합도 스칼라배도 동시에 집합 밖으로 나가는 장면이 한 번에 보인다.
const WARN = "#f59e0b";   // 위반 상태 표시색. 두 테마에서 같은 색을 쓴다.
const MIN_LEN = 0.6;

type Test = "sum" | "scale";

interface Props {
    width?: number;
    height?: number;
}

const SubspaceExplorer = ({width: fixedWidth, height = 330}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;
    const plane = makePlane(width, height, 4.6, 3.1);

    const [v, setV] = useState({x: 2, y: 1});
    const [offset, setOffset] = useState(0);
    const [s1, setS1] = useState(-1.3);
    const [s2, setS2] = useState(1.7);
    const [alpha, setAlpha] = useState(0);
    const [test, setTest] = useState<Test>("sum");

    const len = Math.max(MIN_LEN, norm(v.x, v.y));
    const vh = {x: v.x / len, y: v.y / len};
    const nh = {x: -vh.y, y: vh.x};
    const base = {x: nh.x * offset, y: nh.y * offset};
    const at = (s: number) => ({x: base.x + vh.x * s, y: base.y + vh.y * s});

    const p1 = at(s1);
    const p2 = at(s2);
    const sum = {x: p1.x + p2.x, y: p1.y + p2.y};
    const scaled = {x: p1.x * alpha, y: p1.y * alpha};
    const shifted = offset > 0.02;
    const probe = test === "sum" ? sum : scaled;
    // Y 위의 점은 법선 방향 성분이 정확히 offset 이다. 합은 2·offset, α배는 α·offset 이 된다.
    const probeIn = Math.abs(probe.x * nh.x + probe.y * nh.y - offset) < 1e-6;

    const reach = plane.halfX + plane.halfY;
    const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
    const onLine = (u: {x: number; y: number}) => {
        const s = clamp((u.x - base.x) * vh.x + (u.y - base.y) * vh.y, -reach, reach);
        return at(s);
    };
    const sOf = (u: {x: number; y: number}) =>
        Math.round(((u.x - base.x) * vh.x + (u.y - base.y) * vh.y) * 10) / 10;

    const clampTip = (u: {x: number; y: number}) => {
        const x = clamp(u.x, -plane.halfX + 0.3, plane.halfX - 0.3);
        const y = clamp(u.y, -plane.halfY + 0.3, plane.halfY - 0.3);
        const l = norm(x, y);
        if (l < MIN_LEN) return l < 1e-6 ? {x: MIN_LEN, y: 0} : {x: x / l * MIN_LEN, y: y / l * MIN_LEN};
        return {x, y};
    };

    const originPx = plane.px(0, 0);
    const basePx = plane.px(base.x, base.y);
    const p1Px = plane.px(p1.x, p1.y);
    const p2Px = plane.px(p2.x, p2.y);
    const probePx = plane.px(probe.x, probe.y);
    const probeColor = probeIn ? colors.accent : WARN;

    const caption = !shifted
        ? t("Y = span{v} passes through the origin. Sums and scalar multiples of its points land back on the line, so Y is a subspace.",
            "Y = span{v}는 원점을 지난다. 그 위의 점들을 더하거나 스칼라배해도 다시 직선 위로 떨어지므로 Y는 부분 공간이다.")
        : test === "sum"
            ? t("Y misses the origin, and p¹ + p² sits twice as far from it as Y does. Addition already leaves the set, so Y is not a subspace.",
                "Y가 원점을 비켜 가고, p¹ + p²는 Y보다 두 배 먼 자리에 놓인다. 덧셈에서 이미 집합을 벗어나므로 Y는 부분 공간이 아니다.")
            : Math.abs(alpha) < 1e-6
                ? t("α = 0 sends every point of Y to the origin, and the origin is not in Y. A set that misses 0 can never be a subspace.",
                    "α = 0은 Y의 모든 점을 원점으로 보내는데, 그 원점이 Y 안에 없다. 0을 품지 않는 집합은 부분 공간이 될 수 없다.")
                : t("α·p¹ stays in Y only when α = 1. Every other scalar drags the point off the line.",
                    "α·p¹은 α = 1일 때만 Y 안에 남는다. 다른 스칼라는 점을 직선 밖으로 끌어낸다.")

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                {/* 후보 집합 Y 자체 */}
                <SpanLine plane={plane} x={vh.x} y={vh.y} offset={base}
                          color={colors.accent} strokeWidth={3} opacity={0.5}/>
                {shifted && (
                    <>
                        <Line points={[originPx.x, originPx.y, basePx.x, basePx.y]}
                              stroke={WARN} strokeWidth={1.5} dash={[4, 4]} listening={false}/>
                        <Text text={`${fmt(offset, 1)}`} fontSize={11} fill={WARN} listening={false}
                              x={(originPx.x + basePx.x) / 2 + 6} y={(originPx.y + basePx.y) / 2 - 6}/>
                    </>
                )}

                {/* 원점의 소속 여부가 이 그림의 핵심 판정이다. */}
                <Circle x={originPx.x} y={originPx.y} radius={5.5} listening={false}
                        fill={shifted ? colors.bg : colors.accent}
                        stroke={shifted ? WARN : colors.accent} strokeWidth={2}/>
                <Text text={shifted ? "0 ∉ Y" : "0 ∈ Y"} fontSize={12} fontStyle="bold" listening={false}
                      fill={shifted ? WARN : colors.accent} x={originPx.x + 9} y={originPx.y + 8}/>

                {/* 검사 중인 axiom 의 결과 */}
                {test === "sum" ? (
                    <>
                        <Line points={[p1Px.x, p1Px.y, probePx.x, probePx.y]} listening={false}
                              stroke={colors.muted} strokeWidth={1} dash={[4, 4]}/>
                        <Line points={[p2Px.x, p2Px.y, probePx.x, probePx.y]} listening={false}
                              stroke={colors.muted} strokeWidth={1} dash={[4, 4]}/>
                    </>
                ) : (
                    <SpanLine plane={plane} x={p1.x} y={p1.y} color={colors.muted}
                              strokeWidth={1} dash={[4, 4]} opacity={0.8}/>
                )}
                <VecArrow plane={plane} x={probe.x} y={probe.y} color={probeColor}
                          label={test === "sum" ? "p¹ + p²" : "α·p¹"} strokeWidth={2.5}/>

                <VecArrow plane={plane} x={v.x} y={v.y} color={colors.accent2} label="v" strokeWidth={2}/>
                <DragDot plane={plane} x={v.x} y={v.y} color={colors.accent2} fill={colors.bg}
                         constrain={clampTip} onMove={(u) => setV(clampTip(u))}/>

                <Text text="p¹" fontSize={12} fontStyle="bold" fill={colors.text} listening={false}
                      x={p1Px.x - 22} y={p1Px.y - 20}/>
                <Text text="p²" fontSize={12} fontStyle="bold" fill={colors.text} listening={false}
                      x={p2Px.x - 22} y={p2Px.y - 20}/>
                <DragDot plane={plane} x={p1.x} y={p1.y} color={colors.text} fill={colors.text}
                         radius={6} constrain={onLine} onMove={(u) => setS1(sOf(u))}/>
                <DragDot plane={plane} x={p2.x} y={p2.y} color={colors.text} fill={colors.text}
                         radius={6} constrain={onLine} onMove={(u) => setS2(sOf(u))}/>
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {([
                    ["sum", t("test p¹ + p² ∈ Y", "p¹ + p² ∈ Y 검사")],
                    ["scale", t("test α·p¹ ∈ Y", "α·p¹ ∈ Y 검사")],
                ] as Array<[Test, string]>).map(([value, label]) => (
                    <button key={value} type="button" onClick={() => setTest(value)}
                            className={cn("px-2.5 py-1 rounded border",
                                test === value ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {label}
                    </button>
                ))}
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono">{t("offset", "이동량")} {fmt(offset, 1)}</span>
                    <input type="range" min={0} max={2} step={0.1} value={offset}
                           aria-label={t("distance from the origin to Y", "원점에서 Y까지의 거리")}
                           onChange={(e) => setOffset(Number(e.target.value))}
                           className="w-24 accent-[var(--accent)]"/>
                </label>
                {test === "scale" && (
                    <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                        <span className="font-mono">α {fmt(alpha, 1)}</span>
                        <input type="range" min={-2} max={2} step={0.1} value={alpha}
                               aria-label={t("scalar α", "스칼라 α")}
                               onChange={(e) => setAlpha(Number(e.target.value))}
                               className="w-24 accent-[var(--accent)]"/>
                    </label>
                )}
            </div>

            <p className="mt-2 text-sm text-center font-mono">
                {test === "sum"
                    ? `p¹ + p² = (${fmt(sum.x)}, ${fmt(sum.y)}) ${probeIn ? "∈" : "∉"} Y`
                    : `α·p¹ = (${fmt(scaled.x)}, ${fmt(scaled.y)}) ${probeIn ? "∈" : "∉"} Y`}
            </p>
            <p className="mt-1 text-sm text-muted text-center px-2">{caption}</p>
        </div>
    );
};

export default SubspaceExplorer;
