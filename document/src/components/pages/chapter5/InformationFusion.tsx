import {useState} from "react";
import {Arrow, Line, Text} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import {fmt, makePlane} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {ellipse, inv2, Sym2} from "./gauss";

// 5.9 는 Λ = Σ⁻¹ 를 정의하고 블록 역행렬 공식을 늘어놓는다. 왜 굳이 역수를 들고 다니는지는
// 측정 하나를 융합해 보면 즉시 답이 나온다. 공분산에서는 K 를 거쳐야 하는 갱신이
// 정보 행렬에서는 덧셈 한 번이다. 한 방향만 재는 센서의 정보는 rank 1 이라 띠로 보인다.
const HALF = 5;
const MEAS = "#f59e0b";

interface Props {
    width?: number;
    height?: number;
}

const PRIORS: Array<[en: string, ko: string, Sym2]> = [
    ["correlated prior", "상관 있는 사전", {xx: 4, xy: 1.6, yy: 1.4}],
    ["round prior", "등방 사전", {xx: 2.2, xy: 0, yy: 2.2}],
    ["elongated prior", "길쭉한 사전", {xx: 6, xy: 0, yy: 0.6}],
];

const InformationFusion = ({width: fixedWidth, height = 400}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;

    const [prior, setPrior] = useState<Sym2>({xx: 4, xy: 1.6, yy: 1.4});
    const [degrees, setDegrees] = useState(60);
    const [q, setQ] = useState(0.5);

    const plane = makePlane(width, height, HALF, HALF);
    const phi = (degrees * Math.PI) / 180;
    const cx = Math.cos(phi);
    const cy = Math.sin(phi);

    // 측정 y = cᵀx + v. 칼만 갱신을 그대로 밟는다: S = cᵀPc + q, K = Pc/S, P⁺ = P − K cᵀP.
    const v = {x: prior.xx * cx + prior.xy * cy, y: prior.xy * cx + prior.yy * cy};
    const s = cx * v.x + cy * v.y + q;
    const post: Sym2 = {
        xx: prior.xx - (v.x * v.x) / s,
        xy: prior.xy - (v.x * v.y) / s,
        yy: prior.yy - (v.y * v.y) / s,
    };

    // 같은 답을 정보 행렬 쪽에서 다시 계산한다. Λ⁺ = Λ⁻ + cᵀq⁻¹c 는 덧셈뿐이다.
    const lamPrior = inv2(prior);
    const lamMeas: Sym2 = {xx: (cx * cx) / q, xy: (cx * cy) / q, yy: (cy * cy) / q};
    const lamPost: Sym2 = {
        xx: lamPrior.xx + lamMeas.xx,
        xy: lamPrior.xy + lamMeas.xy,
        yy: lamPrior.yy + lamMeas.yy,
    };
    const postFromInfo = inv2(lamPost);
    // 두 경로가 실제로 같은 행렬을 내놓는지 이 자리에서 잰다. 본문의 주장을 그림이 확인한다.
    const mismatch = Math.max(
        Math.abs(post.xx - postFromInfo.xx),
        Math.abs(post.xy - postFromInfo.xy),
        Math.abs(post.yy - postFromInfo.yy),
    );

    const ellipsePts = (m: Sym2, k: number) =>
        ellipse(0, 0, m, k).flatMap((p) => {
            const pt = plane.px(p.x, p.y);
            return [pt.x, pt.y];
        });

    // {x : |cᵀx| ≤ √q} 는 c 에 수직인 두 직선 사이의 띠다. 한 방향만 재는 센서가 실제로
    // 제약하는 영역이 그것이고, 나머지 방향으로는 아무 말도 하지 않는다.
    const half = Math.sqrt(q);
    const dirX = -cy;
    const dirY = cx;
    const reach = 2 * HALF;
    const slab = (sign: number) => {
        const a = plane.px(sign * half * cx - reach * dirX, sign * half * cy - reach * dirY);
        const b = plane.px(sign * half * cx + reach * dirX, sign * half * cy + reach * dirY);
        return [a.x, a.y, b.x, b.y];
    };

    const arrowEnd = plane.px(cx * (HALF - 1), cy * (HALF - 1));
    const origin = plane.px(0, 0);

    const mat = (m: Sym2) =>
        `[${fmt(m.xx, 2)} ${fmt(m.xy, 2)}; ${fmt(m.xy, 2)} ${fmt(m.yy, 2)}]`;

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                <Line points={slab(1)} stroke={MEAS} strokeWidth={1.6} dash={[6, 4]} listening={false}/>
                <Line points={slab(-1)} stroke={MEAS} strokeWidth={1.6} dash={[6, 4]} listening={false}/>

                <Line points={ellipsePts(prior, 1)} closed stroke={colors.muted} strokeWidth={2}
                      dash={[5, 4]} listening={false}/>
                <Line points={ellipsePts(post, 1)} closed stroke={colors.accent} strokeWidth={2.6}
                      listening={false}/>

                <Arrow points={[origin.x, origin.y, arrowEnd.x, arrowEnd.y]} stroke={MEAS} fill={MEAS}
                       strokeWidth={2} pointerLength={9} pointerWidth={8} listening={false}/>
                <Text text="c" x={arrowEnd.x + 6} y={arrowEnd.y - 16} fontSize={13} fontStyle="bold"
                      fontFamily="monospace" fill={MEAS} listening={false}/>
                <Text text={t("prior 1σ", "사전 1σ")} x={12} y={12} fontSize={11} fontFamily="monospace"
                      fill={colors.muted} listening={false}/>
                <Text text={t("posterior 1σ", "사후 1σ")} x={12} y={27} fontSize={11}
                      fontFamily="monospace" fill={colors.accent} listening={false}/>
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {PRIORS.map(([en, ko, p]) => (
                    <button key={en} type="button" onClick={() => setPrior(p)}
                            className={cn("px-2.5 py-1 rounded border",
                                p.xx === prior.xx && p.xy === prior.xy && p.yy === prior.yy
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {t(en, ko)}
                    </button>
                ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-24">c ∠ {degrees}°</span>
                    <input type="range" min={0} max={180} step={5} value={degrees}
                           aria-label={t("measurement direction", "측정 방향")}
                           onChange={(e) => setDegrees(Number(e.target.value))}
                           className="w-32 accent-[var(--accent)]"/>
                </label>
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-24">Q = {fmt(q, 2)}</span>
                    <input type="range" min={0.05} max={4} step={0.05} value={q}
                           aria-label={t("measurement noise covariance Q", "측정 잡음 공분산 Q")}
                           onChange={(e) => setQ(Number(e.target.value))}
                           className="w-24 accent-[var(--accent)]"/>
                </label>
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: colors.accent}}>
                Λ⁻ {mat(lamPrior)} + CᵀQ⁻¹C {mat(lamMeas)} = Λ⁺ {mat(lamPost)}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                P⁺ {t("via K", "K 경유")} {mat(post)} · P⁺ = (Λ⁺)⁻¹ {mat(postFromInfo)} ·{" "}
                {t("largest disagreement", "최대 불일치")} {mismatch.toExponential(1)}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {t("One sensor reads a single direction of the state, so the region it rules out is a band, not an ellipse: perpendicular to c it says a lot, along c it says nothing at all. Watch the posterior ellipse get squeezed only across the band while the other axis is untouched. That rank-one contribution is invisible in the covariance recursion, where the update runs through a gain and an inverse, and completely obvious in the information matrix, where it is a single addition. The two lines of numbers below are the same posterior computed both ways, and the last figure is how far apart they landed in double precision.",
                    "센서 하나는 상태의 한 방향만 읽으므로 그것이 걷어 내는 영역은 타원이 아니라 띠다. c에 수직인 방향으로는 많은 말을 하고 c를 따라서는 아무 말도 하지 않는다. 사후 타원이 띠를 가로지르는 방향으로만 눌리고 다른 축은 건드려지지 않는 것을 보라. 이 rank 1 기여는 공분산 점화식에서는 이득과 역행렬 뒤에 숨어 보이지 않지만, 정보 행렬에서는 덧셈 한 번이라 완전히 드러난다. 아래 두 줄은 같은 사후 공분산을 두 경로로 계산한 것이고, 마지막 수는 배정밀도에서 둘이 얼마나 벌어졌는지다.")}
            </p>
        </div>
    );
};

export default InformationFusion;
