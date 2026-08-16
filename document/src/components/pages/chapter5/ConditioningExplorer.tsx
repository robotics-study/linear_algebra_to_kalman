import {useState} from "react";
import {Line, Text} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import {DragDot, fmt, makePlane} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {ellipse, normalPdf, Sym2} from "./gauss";

// Key Fact 1 은 조건부 평균과 조건부 공분산을 두 줄로 적고 지나간다. 그 두 줄이 실제로 하는 일은
// "결합 분포를 가로로 한 번 자르는 것"이고, 자른 단면이 다시 정규분포라는 것이다.
// 자르는 높이를 끌어 보면 평균이 x₂ 를 따라 미끄러지고 폭은 x₂ 와 무관하게 고정된다는 사실이
// 수식보다 먼저 보인다.
const CURVE_STEPS = 120;
const HALF = 6;

interface Props {
    width?: number;
    height?: number;
}

const PRESETS: Array<[en: string, ko: string, Sym2]> = [
    ["worked example", "본문 예제", {xx: 4, xy: 2, yy: 2}],
    ["uncorrelated", "무상관", {xx: 4, xy: 0, yy: 2}],
    ["nearly deterministic", "거의 결정적", {xx: 4, xy: 2.75, yy: 2}],
];

const ConditioningExplorer = ({width: fixedWidth, height = 440}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;

    const [s, setS] = useState<Sym2>({xx: 4, xy: 2, yy: 2});
    const [c, setC] = useState(1.5);

    const plane = makePlane(width, height, HALF, HALF);

    // Σ₁₂ 는 |Σ₁₂| < √(Σ₁₁Σ₂₂) 를 넘으면 공분산이 아니게 된다. 슬라이더가 그 밖으로 나가면
    // 조건부 분산이 음수가 되어 그림이 아예 뜻을 잃으므로 경계 안쪽으로 붙여 둔다.
    const cap = 0.98 * Math.sqrt(s.xx * s.yy);
    const s12 = Math.max(-cap, Math.min(cap, s.xy));
    const sigma: Sym2 = {xx: s.xx, xy: s12, yy: s.yy};

    const rho = s12 / Math.sqrt(sigma.xx * sigma.yy);
    // Key Fact 1: μ₁|₂ = μ₁ + Σ₁₂Σ₂₂⁻¹(x₂ − μ₂), Σ₁|₂ = Σ₁₁ − Σ₁₂Σ₂₂⁻¹Σ₂₁. 여기서는 μ = 0.
    const gain = sigma.xy / sigma.yy;
    const condMean = gain * c;
    const condVar = sigma.xx - gain * sigma.xy;

    const peakMarginal = normalPdf(0, 0, sigma.xx);
    const peakCond = normalPdf(0, 0, condVar);
    // 두 곡선에 같은 배율을 쓴다. 조건부 곡선이 더 좁고 더 높다는 사실(면적은 같다)이
    // 배율이 다르면 그림에서 지워진다.
    const scale = 2.0 / Math.max(peakMarginal, peakCond);

    // 곡선과 벽은 캔버스에 실제로 보이는 범위에 맞춘다. 고정 상수로 그리면 넓은 화면에서
    // 주변 밀도가 벽이 아니라 허공에 떠 있게 된다.
    const spanX = plane.halfX;
    const spanY = plane.halfY;

    const curve = (mu: number, variance: number, base: number) => {
        const pts: number[] = [];
        for (let i = 0; i <= CURVE_STEPS; i++) {
            const x = -spanX + (2 * spanX * i) / CURVE_STEPS;
            const p = plane.px(x, base + normalPdf(x, mu, variance) * scale);
            pts.push(p.x, p.y);
        }
        return pts;
    };

    // 왼쪽 벽에 세워 두는 x₂ 의 주변 밀도. 가로로 눕힌 것과 같은 계산이다.
    const sideCurve = () => {
        const pts: number[] = [];
        const sideScale = 1.6 / normalPdf(0, 0, sigma.yy);
        for (let i = 0; i <= CURVE_STEPS; i++) {
            const y = -spanY + (2 * spanY * i) / CURVE_STEPS;
            const p = plane.px(-spanX + normalPdf(y, 0, sigma.yy) * sideScale, y);
            pts.push(p.x, p.y);
        }
        return pts;
    };

    const ellipsePts = (k: number) =>
        ellipse(0, 0, sigma, k).flatMap((p) => {
            const q = plane.px(p.x, p.y);
            return [q.x, q.y];
        });

    const slice = plane.px(0, c);
    const left = plane.px(-spanX, c);
    const right = plane.px(spanX, c);
    const meanTop = plane.px(condMean, c + 2.1);

    const setEntry = (key: keyof Sym2, v: number) => setS((prev) => ({...prev, [key]: v}));

    const active = (p: Sym2) => p.xx === s.xx && p.xy === s.xy && p.yy === s.yy;

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                {/* 결합 분포. 2σ 를 함께 그려 두면 "이 안에 대부분이 있다"는 감각이 생긴다. */}
                <Line points={ellipsePts(2)} closed stroke={colors.accent} strokeWidth={1.2}
                      dash={[5, 5]} opacity={0.55} listening={false}/>
                <Line points={ellipsePts(1)} closed stroke={colors.accent} strokeWidth={2.4}
                      listening={false}/>

                <Line points={curve(0, sigma.xx, -spanY)} stroke={colors.muted} strokeWidth={1.8}
                      listening={false}/>
                <Line points={sideCurve()} stroke={colors.muted} strokeWidth={1.8} listening={false}/>

                {/* 조건 x₂ = c 로 결합 분포를 자른 선과, 그 단면의 밀도. */}
                <Line points={[left.x, left.y, right.x, right.y]} stroke={colors.accent2}
                      strokeWidth={1.5} dash={[6, 4]} listening={false}/>
                <Line points={curve(condMean, condVar, c)} stroke={colors.accent2} strokeWidth={2.4}
                      listening={false}/>
                <Line points={[plane.px(condMean, c).x, plane.px(condMean, c).y, meanTop.x, meanTop.y]}
                      stroke={colors.accent2} strokeWidth={1} dash={[3, 3]} opacity={0.8}
                      listening={false}/>

                <Text text="f(x₁)" x={plane.px(spanX - 1.8, -spanY + 0.9).x}
                      y={plane.px(spanX - 1.8, -spanY + 0.9).y} fontSize={12} fontFamily="monospace"
                      fill={colors.muted} listening={false}/>
                <Text text="f(x₂)" x={plane.px(-spanX + 0.3, spanY - 0.6).x}
                      y={plane.px(-spanX + 0.3, spanY - 0.6).y} fontSize={12} fontFamily="monospace"
                      fill={colors.muted} listening={false}/>
                <Text text={`f(x₁ | x₂ = ${fmt(c, 1)})`} x={right.x - 128} y={right.y - 16}
                      width={120} align="right" fontSize={12} fontFamily="monospace"
                      fill={colors.accent2} listening={false}/>

                <DragDot plane={plane} x={0} y={c} color={colors.accent2} fill={colors.bg}
                         constrain={(p) => ({x: 0, y: Math.max(-spanY + 0.5, Math.min(spanY - 2.6, p.y))})}
                         onMove={(p) => setC(Math.round(p.y * 10) / 10)}/>
                <Text text="drag" x={slice.x + 12} y={slice.y - 6} fontSize={11} fontFamily="monospace"
                      fill={colors.accent2} listening={false}/>
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {PRESETS.map(([en, ko, preset]) => (
                    <button key={en} type="button" onClick={() => setS(preset)}
                            className={cn("px-2.5 py-1 rounded border",
                                active(preset)
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {t(en, ko)}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {([["xx", "Σ11", 0.5, 6], ["xy", "Σ12", -3, 3], ["yy", "Σ22", 0.5, 6]] as const).map(
                    ([key, label, lo, hi]) => (
                        <label key={key}
                               className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                            <span className="font-mono w-16">{label} = {fmt(sigma[key], 2)}</span>
                            <input type="range" min={lo} max={hi} step={0.25} value={s[key]}
                                   aria-label={label}
                                   onChange={(e) => setEntry(key, Number(e.target.value))}
                                   className="w-24 accent-[var(--accent)]"/>
                        </label>
                    ))}
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: colors.accent}}>
                ρ = {fmt(rho, 3)} · μ₁|₂ = {fmt(condMean, 3)} · Σ₁|₂ = {fmt(condVar, 3)}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                Σ₁₁ = {fmt(sigma.xx, 2)} → Σ₁|₂ = {fmt(condVar, 2)} ·{" "}
                {t("variance left", "남은 분산")} = {fmt((100 * condVar) / sigma.xx, 1)}%
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {t("The solid ellipse is the joint distribution of x1 and x2; the grey curves on the two walls are its marginals. Drag the dot up the vertical axis to condition on a measured value of x2. The teal bump is the conditional density of x1: its centre slides along with the measurement, and its width does not move at all, because the conditional covariance has no x2 in it. Set the correlation to zero and the bump stops moving and stops narrowing, which is the whole content of the statement that conditioning on an uncorrelated variable tells you nothing.",
                    "실선 타원이 x1과 x2의 결합 분포이고, 양쪽 벽의 회색 곡선이 그 주변 분포다. 세로축의 점을 끌어 x2가 측정된 값을 조건으로 걸어 보라. 청록색 봉우리가 x1의 조건부 밀도다. 중심은 측정값을 따라 미끄러지지만 폭은 전혀 움직이지 않는다. 조건부 공분산 식에 x2가 들어 있지 않기 때문이다. 상관을 0으로 두면 봉우리는 움직이지도 좁아지지도 않는다. 무상관인 변수를 조건으로 걸어도 아무것도 알게 되지 않는다는 말이 정확히 이 그림이다.")}
            </p>
        </div>
    );
};

export default ConditioningExplorer;
