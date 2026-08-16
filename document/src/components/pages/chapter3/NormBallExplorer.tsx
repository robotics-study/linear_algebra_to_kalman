import {useMemo, useState} from "react";
import {Circle, Line} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import {DragDot, fmt, makePlane} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";

// norm 이 여러 개라는 말은 "길이"의 정의가 여러 개라는 말이고, 그 차이는 단위구를 그려 보면
// 한눈에 보인다. p 를 밀면 마름모 → 원 → 정사각형으로 바뀐다.
// 슬라이더는 p 가 아니라 q = 1/p 를 움직인다. p 를 직접 쓰면 무한대가 슬라이더 끝에 닿지 않는다.
const SAMPLES = 360;

interface Props {
    width?: number;
    height?: number;
}

const PRESETS: Array<[label: string, q: number]> = [
    ["p = 1", 1],
    ["p = 1.5", 1 / 1.5],
    ["p = 2", 0.5],
    ["p = 3", 1 / 3],
    ["p = ∞", 0],
];

// q = 0 은 max-norm. 그 외에는 p = 1/q 로 되돌려 표준 p-norm 을 쓴다.
function pNorm(x: number, y: number, q: number) {
    const ax = Math.abs(x);
    const ay = Math.abs(y);
    if (q <= 1e-6) return Math.max(ax, ay);
    const p = 1 / q;
    return Math.pow(Math.pow(ax, p) + Math.pow(ay, p), q);
}

const NormBallExplorer = ({width: fixedWidth, height = 360}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;
    const plane = makePlane(width, height, 2.1, 1.7);

    // p = 1 로 열어 둔다. p = 2 에서 시작하면 단위구가 기준 원과 포개져 그림이 아무 대비도 주지 않는다.
    const [q, setQ] = useState(1);
    const [x, setX] = useState({x: 1.1, y: 0.7});

    const p = q <= 1e-6 ? Infinity : 1 / q;
    const pLabel = p === Infinity ? "∞" : fmt(p, 2);

    // 단위구 {u : ‖u‖_p = 1} 를 각도로 훑는다. 각 방향의 반지름은 1/‖(cos, sin)‖_p 다.
    // 같은 표본에서 유클리드 반지름의 최소·최대를 읽으면 그것이 곧 두 norm 사이의 최적 상수다.
    const {ball, rIn, rOut} = useMemo(() => {
        const pts: number[] = [];
        let lo = Infinity;
        let hi = 0;
        for (let i = 0; i <= SAMPLES; i++) {
            const a = (i / SAMPLES) * 2 * Math.PI;
            const c = Math.cos(a);
            const s = Math.sin(a);
            const r = 1 / pNorm(c, s, q);
            if (r < lo) lo = r;
            if (r > hi) hi = r;
            const px = plane.px(r * c, r * s);
            pts.push(px.x, px.y);
        }
        return {ball: pts, rIn: lo, rOut: hi};
    }, [q, plane.unit, plane.width, plane.height]);

    const xNormP = pNorm(x.x, x.y, q);
    // x 를 지나는 레벨 곡선 {u : ‖u‖_p = ‖x‖_p}. 단위구를 그대로 확대한 것이다.
    const level = useMemo(() => {
        const pts: number[] = [];
        for (let i = 0; i <= SAMPLES; i++) {
            const a = (i / SAMPLES) * 2 * Math.PI;
            const c = Math.cos(a);
            const s = Math.sin(a);
            const r = xNormP / pNorm(c, s, q);
            const px = plane.px(r * c, r * s);
            pts.push(px.x, px.y);
        }
        return pts;
    }, [q, xNormP, plane.unit, plane.width, plane.height]);

    const o = plane.px(0, 0);
    const n1 = Math.abs(x.x) + Math.abs(x.y);
    const n2 = Math.hypot(x.x, x.y);
    const nInf = Math.max(Math.abs(x.x), Math.abs(x.y));

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                {/* 2-norm 원은 눈금자다. p 가 2 를 지날 때 공이 정확히 이 원과 겹친다. */}
                <Circle x={o.x} y={o.y} radius={plane.unit} stroke={colors.border} strokeWidth={1.5}
                        listening={false}/>
                {/* 안팎으로 끼워 넣은 두 원이 norm 동치의 상수를 눈에 보이게 만든다. */}
                <Circle x={o.x} y={o.y} radius={plane.unit * rIn} stroke={colors.muted} strokeWidth={1}
                        dash={[4, 4]} opacity={0.7} listening={false}/>
                <Circle x={o.x} y={o.y} radius={plane.unit * rOut} stroke={colors.muted} strokeWidth={1}
                        dash={[4, 4]} opacity={0.7} listening={false}/>
                <Line points={level} closed stroke={colors.accent2} strokeWidth={1.5} dash={[5, 4]}
                      opacity={0.55} listening={false}/>
                <Line points={ball} closed stroke={colors.accent} strokeWidth={2.5} listening={false}/>
                <Line points={[o.x, o.y, plane.px(x.x, x.y).x, plane.px(x.x, x.y).y]}
                      stroke={colors.accent2} strokeWidth={1.5} listening={false}/>
                <DragDot plane={plane} x={x.x} y={x.y} color={colors.accent2} fill={colors.bg} radius={7}
                         onMove={(u) => setX(u)}/>
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {PRESETS.map(([label, value]) => (
                    <button key={label} type="button" onClick={() => setQ(value)}
                            className={cn("px-2.5 py-1 rounded border font-mono",
                                Math.abs(q - value) < 1e-6
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {label}
                    </button>
                ))}
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-16">p = {pLabel}</span>
                    <input type="range" min={0} max={1} step={0.01} value={q}
                           aria-label={t("exponent p", "지수 p")}
                           onChange={(e) => setQ(Number(e.target.value))}
                           className="w-32 accent-[var(--accent)] [direction:rtl]"/>
                </label>
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: colors.accent2}}>
                x = ({fmt(x.x)}, {fmt(x.y)}) · ‖x‖₁ = {fmt(n1)} · ‖x‖₂ = {fmt(n2)} · ‖x‖<sub>∞</sub> = {fmt(nInf)}
                {" · "}‖x‖<sub>p</sub> = {fmt(xNormP)}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                {fmt(1 / rOut, 3)}·‖x‖₂ ≤ ‖x‖<sub>p</sub> ≤ {fmt(1 / rIn, 3)}·‖x‖₂
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {t("The unit ball changes shape, but it is always trapped between two circles, so every p-norm is squeezed between two multiples of the 2-norm. That is what makes all norms on a finite-dimensional space equivalent.",
                    "단위구의 모양은 바뀌어도 늘 두 원 사이에 갇혀 있다. 그래서 어떤 p-norm이든 2-norm의 두 상수배 사이에 끼인다. 유한 차원 공간에서 모든 norm이 동치인 이유가 이것이다.")}
            </p>
        </div>
    );
};

export default NormBallExplorer;
