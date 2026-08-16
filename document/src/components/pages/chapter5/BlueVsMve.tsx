import {useMemo, useState} from "react";
import {Circle, Layer, Line, Stage, Text} from "react-konva";
import {fmt} from "../../2d/plane";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {makeNormal} from "./gauss";

// Remark 5.28 은 BLUE 와 MVE 를 두 줄 나란히 적고 "P⁻¹ = 0 이면 같다"로 끝낸다.
// 두 식의 차이는 사전 정보 하나뿐인데, 그 하나가 측정이 적을 때 추정을 어디로 끌어당기는지는
// 식만 봐서는 보이지 않는다. 같은 측정열을 두 추정기에 동시에 먹여 보면 그것이 그대로 드러난다.
const M = 30;
const PAD = {left: 46, right: 14, top: 16, bottom: 30};
const MVE = "#f59e0b";

interface Props {
    width?: number;
    height?: number;
}

const BlueVsMve = ({width: fixedWidth, height = 320}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;

    const [xTrue, setXTrue] = useState(2);
    const [priorStd, setPriorStd] = useState(1);
    const [noiseStd, setNoiseStd] = useState(1.5);
    const [m, setM] = useState(6);
    const [seed, setSeed] = useState(20250815);

    const q = noiseStd * noiseStd;
    const p = priorStd * priorStd;

    // 측정열은 seed 로 고정한다. 슬라이더를 움직일 때 잡음까지 새로 뽑히면
    // 두 곡선의 차이가 잡음 탓인지 사전 정보 탓인지 구별할 수 없다.
    const ys = useMemo(() => {
        const n = makeNormal(seed);
        return Array.from({length: M}, () => xTrue + noiseStd * n());
    }, [seed, xTrue, noiseStd]);

    // BLUE: 잡음 모델만 안다. C = 1ₘ, Q = qI 이므로 (CᵀQ⁻¹C)⁻¹CᵀQ⁻¹y 는 그냥 표본 평균이다.
    // MVE: 여기에 사전 분포 x ~ N(0, p) 를 더한다. 정보가 더해지므로 오차 분산이 반드시 더 작다.
    const stats = useMemo(() => {
        let sum = 0;
        return ys.map((y, i) => {
            sum += y;
            const k = i + 1;
            const blue = sum / k;
            const blueVar = q / k;
            const mve = ((k * p) / (q + k * p)) * blue;
            const mveVar = 1 / (k / q + 1 / p);
            return {blue, blueVar, mve, mveVar};
        });
    }, [ys, q, p]);

    const cur = stats[m - 1];

    const span = Math.max(
        3,
        Math.abs(xTrue) + 0.6,
        ...ys.slice(0, Math.max(m, 8)).map((y) => Math.abs(y) + 0.4),
    );
    const plotW = Math.max(120, width - PAD.left - PAD.right);
    const plotH = Math.max(90, height - PAD.top - PAD.bottom);
    const bottom = PAD.top + plotH;
    const xOf = (k: number) => PAD.left + ((k - 1) / (M - 1)) * plotW;
    const yOf = (v: number) => PAD.top + ((span - v) / (2 * span)) * plotH;

    const path = (pick: (s: typeof stats[number]) => number) =>
        stats.flatMap((s, i) => [xOf(i + 1), yOf(pick(s))]);

    // ±1 오차 표준편차 띠. 두 추정기의 "확신"을 나란히 놓으면 어느 쪽이 좁은지 즉시 보인다.
    const band = (mean: (s: typeof stats[number]) => number, v: (s: typeof stats[number]) => number) => {
        const up = stats.flatMap((s, i) => [xOf(i + 1), yOf(mean(s) + Math.sqrt(v(s)))]);
        const down: number[] = [];
        for (let i = stats.length - 1; i >= 0; i--) {
            down.push(xOf(i + 1), yOf(mean(stats[i]) - Math.sqrt(v(stats[i]))));
        }
        return [...up, ...down];
    };

    const ticks = [-Math.round(span), 0, Math.round(span)].filter((v, i, a) => a.indexOf(v) === i);

    return (
        <div ref={ref} className="w-full">
            <Stage width={width} height={height} className="overflow-hidden w-fit h-fit">
                <Layer>
                    {ticks.map((v) => (
                        <Line key={v} points={[PAD.left, yOf(v), PAD.left + plotW, yOf(v)]}
                              stroke={colors.border} strokeWidth={1} listening={false}/>
                    ))}
                    {ticks.map((v) => (
                        <Text key={`l${v}`} text={String(v)} x={0} y={yOf(v) - 6} width={PAD.left - 8}
                              align="right" fontSize={10} fontFamily="monospace" fill={colors.muted}
                              listening={false}/>
                    ))}

                    <Line points={band((s) => s.mve, (s) => s.mveVar)} closed fill={MVE} opacity={0.13}
                          listening={false}/>
                    <Line points={band((s) => s.blue, (s) => s.blueVar)} closed fill={colors.accent}
                          opacity={0.13} listening={false}/>

                    {/* 참값과 사전 평균. MVE 는 측정이 적을 때 사전 평균 쪽에 붙어 있다. */}
                    <Line points={[PAD.left, yOf(xTrue), PAD.left + plotW, yOf(xTrue)]}
                          stroke={colors.text} strokeWidth={1.4} dash={[7, 4]} listening={false}/>
                    <Line points={[PAD.left, yOf(0), PAD.left + plotW, yOf(0)]} stroke={colors.muted}
                          strokeWidth={1} dash={[2, 4]} listening={false}/>

                    {ys.slice(0, m).map((y, i) => (
                        <Circle key={i} x={xOf(i + 1)} y={yOf(y)} radius={2.6} fill={colors.muted}
                                opacity={0.75} listening={false}/>
                    ))}

                    <Line points={path((s) => s.mve)} stroke={MVE} strokeWidth={2.4} listening={false}/>
                    <Line points={path((s) => s.blue)} stroke={colors.accent} strokeWidth={2.4}
                          listening={false}/>

                    <Line points={[xOf(m), PAD.top, xOf(m), bottom]} stroke={colors.muted}
                          strokeWidth={1} dash={[4, 4]} listening={false}/>
                    <Circle x={xOf(m)} y={yOf(cur.blue)} radius={5} fill={colors.accent} listening={false}/>
                    <Circle x={xOf(m)} y={yOf(cur.mve)} radius={5} fill={MVE} listening={false}/>

                    <Line points={[PAD.left, PAD.top, PAD.left, bottom, PAD.left + plotW, bottom]}
                          stroke={colors.text} strokeWidth={1} listening={false}/>
                    <Text text="BLUE" x={PAD.left + 8} y={PAD.top + 2} fontSize={11}
                          fontFamily="monospace" fill={colors.accent} listening={false}/>
                    <Text text="MVE" x={PAD.left + 8} y={PAD.top + 17} fontSize={11}
                          fontFamily="monospace" fill={MVE} listening={false}/>
                    <Text text={t("number of measurements", "측정 개수")} x={PAD.left} y={bottom + 12}
                          width={plotW} align="center" fontSize={10} fontFamily="monospace"
                          fill={colors.muted} listening={false}/>
                </Layer>
            </Stage>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-16">m = {m}</span>
                    <input type="range" min={1} max={M} step={1} value={m}
                           aria-label={t("number of measurements", "측정 개수")}
                           onChange={(e) => setM(Number(e.target.value))}
                           className="w-28 accent-[var(--accent)]"/>
                </label>
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-20">x = {fmt(xTrue, 1)}</span>
                    <input type="range" min={-3} max={3} step={0.25} value={xTrue}
                           aria-label={t("true value of x", "x의 참값")}
                           onChange={(e) => setXTrue(Number(e.target.value))}
                           className="w-24 accent-[var(--accent)]"/>
                </label>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-20">P = {fmt(p, 2)}</span>
                    <input type="range" min={0.25} max={4} step={0.25} value={priorStd}
                           aria-label={t("prior standard deviation", "사전 표준편차")}
                           onChange={(e) => setPriorStd(Number(e.target.value))}
                           className="w-24 accent-[var(--accent)]"/>
                </label>
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-20">Q = {fmt(q, 2)}</span>
                    <input type="range" min={0.25} max={3} step={0.25} value={noiseStd}
                           aria-label={t("measurement standard deviation", "측정 표준편차")}
                           onChange={(e) => setNoiseStd(Number(e.target.value))}
                           className="w-24 accent-[var(--accent)]"/>
                </label>
                <button type="button" onClick={() => setSeed((v) => v + 1)}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {t("new noise", "잡음 다시 뽑기")}
                </button>
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: colors.accent}}>
                BLUE {fmt(cur.blue, 3)} ± {fmt(Math.sqrt(cur.blueVar), 3)} · MVE {fmt(cur.mve, 3)} ±{" "}
                {fmt(Math.sqrt(cur.mveVar), 3)}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                |{t("error", "오차")}| BLUE {fmt(Math.abs(cur.blue - xTrue), 3)} · MVE{" "}
                {fmt(Math.abs(cur.mve - xTrue), 3)} · Σ_MVE/Σ_BLUE = {fmt(cur.mveVar / cur.blueVar, 3)}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {t("Both estimators see exactly the same measurements. BLUE is the sample mean: it knows the noise model and nothing else, so it starts wherever the first measurement landed. MVE also knows that x was drawn from a prior with mean zero, so it starts near zero and is pulled towards the data only as the measurements pile up. Its error band is always the narrower of the two, and that is not a free lunch: drag the true x far from the prior mean and watch MVE stay confidently wrong for longer. Widen the prior and the two curves merge, which is the statement that BLUE is MVE with no prior at all.",
                    "두 추정기가 보는 측정은 완전히 같다. BLUE는 표본 평균이다. 잡음 모델만 알 뿐이라 첫 측정이 떨어진 자리에서 시작한다. MVE는 x가 평균 0인 사전 분포에서 뽑혔다는 것까지 알고 있어서 0 근처에서 출발하고, 측정이 쌓이는 만큼만 데이터 쪽으로 끌려간다. 오차 띠는 언제나 MVE 쪽이 더 좁은데, 공짜는 아니다. 참값을 사전 평균에서 멀리 끌어 두면 MVE가 더 오래 자신 있게 틀린다. 사전 분산을 키우면 두 곡선이 겹친다. BLUE가 사전 정보 없는 MVE라는 말이 그 뜻이다.")}
            </p>
        </div>
    );
};

export default BlueVsMve;
