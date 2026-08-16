import {useEffect, useMemo, useState} from "react";
import {Circle, Layer, Line, Stage, Text} from "react-konva";
import {fmt} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {makeNormal, normalPdf} from "./gauss";

// 5.7.2 의 필터는 여섯 줄이고, 그 여섯 줄은 두 동작을 번갈아 한다. 예측은 분산을 키우고
// 측정 갱신은 분산을 줄인다. 한 걸음씩 끊어서 밟아 보면 K 가 그 두 동작 사이의 저울이라는 것이
// 눈으로 보인다. 계수는 A = G = C = 1 로 잡아 본문의 손계산과 같은 수가 나오게 했다.
const N = 24;
const PAD = {left: 44, right: 14, top: 14, bottom: 26};
const MEAS = "#f59e0b";
const PRIOR = "#8b5cf6";
const TICK_MS = 700;

interface Props {
    width?: number;
    height?: number;
}

interface Step {
    xTrue: number;
    y: number;
    xPrior: number;
    pPrior: number;
    xPost: number;
    pPost: number;
    k: number;
}

// 스칼라 칼만 필터 한 판. A = G = C = 1 이므로 예측은 P + R, 갱신은 Schur complement 그대로다.
// 교재 표기를 따라 R 이 과정 잡음, Q 가 측정 잡음의 공분산이다.
function runFilter(processVar: number, measVar: number, seed: number): Step[] {
    const nProcess = makeNormal(seed);
    const nMeas = makeNormal(seed + 7919);
    const out: Step[] = [];
    let xTrue = 0;
    let xPrior = 0;      // x̂₀|₋₁ = x̄₀
    let pPrior = 1;      // P₀|₋₁ = P₀
    for (let i = 0; i < N; i++) {
        const y = xTrue + Math.sqrt(measVar) * nMeas();
        const k = pPrior / (pPrior + measVar);
        const xPost = xPrior + k * (y - xPrior);
        const pPost = pPrior - k * pPrior;
        out.push({xTrue, y, xPrior, pPrior, xPost, pPost, k});
        xTrue = xTrue + Math.sqrt(processVar) * nProcess();
        xPrior = xPost;
        pPrior = pPost + processVar;
    }
    return out;
}

const KalmanFilter1D = ({width: fixedWidth, height = 460}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;

    const [processVar, setProcessVar] = useState(1);
    const [measVar, setMeasVar] = useState(1);
    const [seed, setSeed] = useState(20250501);
    // s 는 반 걸음 단위다. 짝수면 예측만 끝난 상태(사전), 홀수면 측정 갱신까지 끝난 상태(사후).
    const [s, setS] = useState(0);
    const [running, setRunning] = useState(false);

    const steps = useMemo(() => runFilter(processVar, measVar, seed), [processVar, measVar, seed]);
    const last = 2 * N - 1;
    const idx = Math.min(Math.floor(s / 2), N - 1);
    const updated = s % 2 === 1;
    const cur = steps[idx];

    useEffect(() => {
        if (!running) return;
        const id = window.setInterval(() => {
            setS((v) => {
                if (v >= last) {
                    setRunning(false);
                    return v;
                }
                return v + 1;
            });
        }, TICK_MS);
        return () => window.clearInterval(id);
    }, [running, last]);

    const span = useMemo(
        () => Math.max(2, ...steps.map((st) => Math.max(Math.abs(st.xTrue), Math.abs(st.y)))) + 0.6,
        [steps],
    );

    const plotW = Math.max(120, width - PAD.left - PAD.right);
    const topH = Math.max(90, Math.round((height - PAD.top - PAD.bottom) * 0.6));
    const gap = 34;
    const botTop = PAD.top + topH + gap;
    const botH = Math.max(60, height - PAD.bottom - botTop);
    const xOf = (k: number) => PAD.left + (k / (N - 1)) * plotW;
    const yOf = (v: number) => PAD.top + ((span - v) / (2 * span)) * topH;
    // 아래 판은 값을 가로축에 놓는다. 위 판의 세로축과 같은 눈금이라 두 판이 이어서 읽힌다.
    const vOf = (v: number) => PAD.left + ((v + span) / (2 * span)) * plotW;

    const shown = steps.slice(0, idx + 1);
    // 아직 밟지 않은 구간의 참값·측정은 옅게 미리 그려 둔다. 첫 화면이 빈 판이면 그림이 고장 난
    // 것처럼 보이고, 필터가 무엇을 따라갈 예정인지도 보이지 않는다.
    const ghostPath = steps.flatMap((st, i) => [xOf(i), yOf(st.xTrue)]);
    const truePath = shown.flatMap((st, i) => [xOf(i), yOf(st.xTrue)]);
    const estPath = shown.flatMap((st, i) => [
        xOf(i),
        yOf(i === idx && !updated ? st.xPrior : st.xPost),
    ]);
    const bandPath = (() => {
        const up = shown.flatMap((st, i) => {
            const prior = i === idx && !updated;
            const m = prior ? st.xPrior : st.xPost;
            const p = prior ? st.pPrior : st.pPost;
            return [xOf(i), yOf(m + Math.sqrt(p))];
        });
        const down: number[] = [];
        for (let i = shown.length - 1; i >= 0; i--) {
            const prior = i === idx && !updated;
            const m = prior ? shown[i].xPrior : shown[i].xPost;
            const p = prior ? shown[i].pPrior : shown[i].pPost;
            down.push(xOf(i), yOf(m - Math.sqrt(p)));
        }
        return [...up, ...down];
    })();

    // 아래 판의 세 밀도. 예측 단계에서는 사후가 아직 없으므로 두 개만 그린다.
    const densities: Array<{mu: number; v: number; color: string; label: string}> = [
        {mu: cur.xPrior, v: cur.pPrior, color: PRIOR, label: "prediction"},
        {mu: cur.y, v: measVar, color: MEAS, label: "measurement"},
    ];
    if (updated) densities.push({mu: cur.xPost, v: cur.pPost, color: colors.accent, label: "update"});
    const peak = Math.max(...densities.map((d) => normalPdf(d.mu, d.mu, d.v)));

    const bump = (mu: number, v: number) => {
        const pts: number[] = [];
        for (let i = 0; i <= 140; i++) {
            const x = -span + (2 * span * i) / 140;
            pts.push(vOf(x), botTop + botH - (normalPdf(x, mu, v) / peak) * (botH - 12));
        }
        return pts;
    };

    const reset = () => {
        setRunning(false);
        setS(0);
    };
    const nextLabel = updated ? t("predict", "예측") : t("update", "측정 갱신");

    return (
        <div ref={ref} className="w-full">
            <Stage width={width} height={height} className="overflow-hidden w-fit h-fit">
                <Layer>
                    <Line points={[PAD.left, yOf(0), PAD.left + plotW, yOf(0)]} stroke={colors.border}
                          strokeWidth={1} listening={false}/>
                    <Line points={ghostPath} stroke={colors.muted} strokeWidth={1.2} opacity={0.28}
                          listening={false}/>
                    {steps.map((st, i) => (
                        i > idx ? <Circle key={`g${i}`} x={xOf(i)} y={yOf(st.y)} radius={2.4} fill={MEAS}
                                          opacity={0.22} listening={false}/> : null
                    ))}
                    <Line points={bandPath} closed fill={colors.accent} opacity={0.16} listening={false}/>
                    <Line points={truePath} stroke={colors.text} strokeWidth={1.6} dash={[6, 4]}
                          listening={false}/>
                    {shown.map((st, i) => (
                        <Circle key={i} x={xOf(i)} y={yOf(st.y)} radius={2.8} fill={MEAS}
                                opacity={i === idx ? 1 : 0.55} listening={false}/>
                    ))}
                    <Line points={estPath} stroke={colors.accent} strokeWidth={2.4} listening={false}/>
                    <Circle x={xOf(idx)} y={yOf(updated ? cur.xPost : cur.xPrior)} radius={5}
                            fill={colors.accent} listening={false}/>

                    <Line points={[PAD.left, PAD.top, PAD.left, PAD.top + topH, PAD.left + plotW,
                        PAD.top + topH]} stroke={colors.text} strokeWidth={1} listening={false}/>
                    <Text text={`${t("truth", "참값")} ---`} x={PAD.left + 8} y={PAD.top + 2}
                          fontSize={11} fontFamily="monospace" fill={colors.text} listening={false}/>
                    <Text text={t("measurement", "측정")} x={PAD.left + 8} y={PAD.top + 17}
                          fontSize={11} fontFamily="monospace" fill={MEAS} listening={false}/>
                    <Text text={`${t("estimate", "추정")} ± 1σ`} x={PAD.left + 8} y={PAD.top + 32}
                          fontSize={11} fontFamily="monospace" fill={colors.accent} listening={false}/>
                    <Text text={`k = ${idx}`} x={PAD.left} y={PAD.top + topH + 8} width={plotW}
                          align="center" fontSize={11} fontFamily="monospace" fill={colors.muted}
                          listening={false}/>

                    {/* 아래 판: 이번 걸음의 밀도 세 개. 갱신 결과가 두 봉우리 사이에 K 만큼 놓인다. */}
                    <Line points={[PAD.left, botTop + botH, PAD.left + plotW, botTop + botH]}
                          stroke={colors.text} strokeWidth={1} listening={false}/>
                    {densities.map((d) => (
                        <Line key={d.label} points={bump(d.mu, d.v)} stroke={d.color} strokeWidth={2.2}
                              listening={false}/>
                    ))}
                    {densities.map((d) => (
                        <Line key={`m${d.label}`}
                              points={[vOf(d.mu), botTop + botH, vOf(d.mu), botTop + 4]}
                              stroke={d.color} strokeWidth={1} dash={[3, 3]} opacity={0.7}
                              listening={false}/>
                    ))}
                    <Text text={t("prediction", "예측")} x={PAD.left + 8} y={botTop} fontSize={11}
                          fontFamily="monospace" fill={PRIOR} listening={false}/>
                    <Text text={t("measurement", "측정")} x={PAD.left + 8} y={botTop + 15} fontSize={11}
                          fontFamily="monospace" fill={MEAS} listening={false}/>
                    {updated && (
                        <Text text={t("fused estimate", "융합된 추정")} x={PAD.left + 8} y={botTop + 30}
                              fontSize={11} fontFamily="monospace" fill={colors.accent}
                              listening={false}/>
                    )}
                </Layer>
            </Stage>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <button type="button" onClick={() => setS((v) => Math.min(last, v + 1))}
                        disabled={s >= last}
                        className="px-3 py-1 rounded border border-border bg-surface font-semibold
                                   hover:border-[var(--accent)] disabled:opacity-40">
                    {nextLabel}
                </button>
                <button type="button" onClick={() => setRunning((v) => !v)} disabled={s >= last}
                        className={cn("px-3 py-1 rounded border font-semibold disabled:opacity-40",
                            running ? "border-[var(--accent)] text-[var(--accent)]"
                                : "border-border bg-surface hover:border-[var(--accent)]")}>
                    {running ? t("pause", "멈춤") : t("run", "연속 실행")}
                </button>
                <button type="button" onClick={reset}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {t("restart", "처음으로")}
                </button>
                <button type="button" onClick={() => { setSeed((v) => v + 1); reset(); }}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {t("new noise", "잡음 다시 뽑기")}
                </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-24">R = {fmt(processVar, 2)}</span>
                    <input type="range" min={0.05} max={4} step={0.05} value={processVar}
                           aria-label={t("process noise covariance R", "과정 잡음 공분산 R")}
                           onChange={(e) => { setProcessVar(Number(e.target.value)); reset(); }}
                           className="w-24 accent-[var(--accent)]"/>
                </label>
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-24">Q = {fmt(measVar, 2)}</span>
                    <input type="range" min={0.05} max={4} step={0.05} value={measVar}
                           aria-label={t("measurement noise covariance Q", "측정 잡음 공분산 Q")}
                           onChange={(e) => { setMeasVar(Number(e.target.value)); reset(); }}
                           className="w-24 accent-[var(--accent)]"/>
                </label>
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: colors.accent}}>
                K = {fmt(cur.k, 4)} · P⁻ = {fmt(cur.pPrior, 4)} · P⁺ = {fmt(cur.pPost, 4)}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                {updated
                    ? `x̂ = ${fmt(cur.xPrior, 3)} + ${fmt(cur.k, 3)} × (${fmt(cur.y, 3)} − ${fmt(cur.xPrior, 3)}) = ${fmt(cur.xPost, 3)}`
                    : `x̂⁻ = ${fmt(cur.xPrior, 3)} · y = ${fmt(cur.y, 3)} · ${t("innovation", "innovation")} = ${fmt(cur.y - cur.xPrior, 3)}`}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {t("Step it by hand. Predict pushes the estimate forward and widens the purple bell, because one step of the model adds R to the variance and nothing is learned. Update multiplies that bell by the orange measurement bell, and the product is always narrower than either one: the filter ends up between the two, exactly K of the way from prediction to measurement. Push Q down and K climbs towards one, so the estimate jumps onto every measurement. Push R down and K falls towards zero, so the filter stops listening and coasts on the model. At the default R = Q = 1 the gains are 0.5, 0.6, 0.6154, 0.6176, the ratios of consecutive Fibonacci numbers from the worked example, converging on 0.618.",
                    "한 걸음씩 손으로 밟아 보라. 예측은 추정을 앞으로 밀고 보라색 종을 넓힌다. 모델을 한 걸음 굴리면 분산에 R이 더해지고 새로 배운 것은 없기 때문이다. 갱신은 그 종에 주황색 측정 종을 곱하는데, 곱은 언제나 둘 중 어느 쪽보다도 좁다. 필터는 두 봉우리 사이, 예측에서 측정 쪽으로 정확히 K만큼 간 자리에 놓인다. Q를 낮추면 K가 1로 올라가 추정이 측정마다 그 위로 뛰어오른다. R을 낮추면 K가 0으로 내려가 필터가 측정을 듣지 않고 모델만 믿고 미끄러진다. 기본값 R = Q = 1에서 이득은 0.5, 0.6, 0.6154, 0.6176으로, 본문 손계산에 나오는 연속한 피보나치 수의 비이고 0.618로 수렴한다.")}
            </p>
        </div>
    );
};

export default KalmanFilter1D;
