import {useState} from "react";
import {Circle, Layer, Line, Rect, Stage, Text} from "react-konva";
import {fmt} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {ramp, rampL1Diff, rampL1ToStep, sqrt2Truncation} from "./analysis";

// Cauchy 조건은 극한을 모르고도 확인할 수 있다. 항들을 극한이 아니라 서로에게 견주기 때문이다.
// 그런데 그렇게 서로 몰려드는 수열의 도착지가 공간 안에 없을 수 있다. 아래 세 판은
// 같은 질문의 세 가지 답이다: 몰려든다 → 그래서 어디로? → 그 자리가 공간에 있는가?
const PAD = {left: 46, right: 16, top: 14, bottom: 28};
const N_TERMS = 30;
const OK = "#10b981";
const BAD = "#ef4444";
const MAX_ZOOM = 8;

type Mode = "tail" | "rationals" | "ramps";

interface Props {
    width?: number;
    height?: number;
}

const CauchyCompleteness = ({width: fixedWidth, height = 390}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;

    const [mode, setMode] = useState<Mode>("tail");
    const [eps, setEps] = useState(0.5);
    const [zoom, setZoom] = useState(2);
    const [nRamp, setNRamp] = useState(4);
    const [mRamp, setMRamp] = useState(12);

    const plotW = Math.max(140, width - PAD.left - PAD.right);
    const plotH = Math.max(110, height - PAD.top - PAD.bottom);

    // ---- 판 1: 꼬리의 지름 -------------------------------------------------
    // x_n = 2 + 3/n 은 줄어들기만 하므로 N 부터의 꼬리 지름은 sup - inf = x_N - 2 = 3/N 이다.
    // sup 도 inf 도 꼬리 자신에서 읽는 값이라 극한을 미리 알 필요가 없다. 그것이 Cauchy 조건의 요점이다.
    const seqTerm = (n: number) => 2 + 3 / n;
    const cauchyN = Math.floor(3 / eps) + 1;
    const tailDiam = (N: number) => 3 / N;
    const tLo = 1.6;
    const tHi = 5.4;
    const sxN = (n: number) => PAD.left + ((n - 1) / (N_TERMS - 1)) * plotW;
    const syT = (v: number) => PAD.top + ((tHi - v) / (tHi - tLo)) * plotH;

    // ---- 판 2: 유리수의 소수 절단 -----------------------------------------
    const a = sqrt2Truncation(zoom);
    const b = a + 10 ** -zoom;
    const sxQ = (v: number) => PAD.left + ((v - a) / (b - a)) * plotW;
    const inWindow = (v: number) => v >= a && v <= b;
    const nextA = sqrt2Truncation(zoom + 1);
    const nextB = nextA + 10 ** -(zoom + 1);

    // ---- 판 3: C[0,1] 의 경사 함수열 ---------------------------------------
    const sxR = (t0: number) => PAD.left + t0 * plotW;
    const syR = (v: number) => PAD.top + (1.15 - v) * (plotH / 1.3);
    const rampPts = (n: number) => {
        const pts: number[] = [];
        for (let i = 0; i <= 240; i++) {
            const t0 = i / 240;
            pts.push(sxR(t0), syR(ramp(t0, n)));
        }
        return pts;
    };
    // 두 경사 사이의 넓이가 곧 1-norm 거리다. 닫힌 다각형으로 칠해 그 넓이를 눈에 보이게 한다.
    const betweenPts = (() => {
        const up: number[] = [];
        const down: number[] = [];
        for (let i = 0; i <= 240; i++) {
            const t0 = i / 240;
            up.push(sxR(t0), syR(ramp(t0, nRamp)));
        }
        for (let i = 240; i >= 0; i--) {
            const t0 = i / 240;
            down.push(sxR(t0), syR(ramp(t0, mRamp)));
        }
        return [...up, ...down];
    })();

    return (
        <div ref={ref} className="w-full">
            <Stage width={width} height={height} className="overflow-hidden w-fit h-fit">
                <Layer>
                    {mode === "tail" && (
                        <>
                            {/* 꼬리가 들어앉는 띠. 위아래 경계는 꼬리 자신의 sup 과 inf 다. */}
                            <Rect x={sxN(cauchyN)} y={syT(seqTerm(cauchyN))} width={plotW - (sxN(cauchyN) - PAD.left)}
                                  height={Math.abs(syT(2) - syT(seqTerm(cauchyN)))}
                                  fill={OK} opacity={0.16} listening={false}/>
                            <Line points={[sxN(cauchyN), PAD.top, sxN(cauchyN), PAD.top + plotH]}
                                  stroke={OK} strokeWidth={2} listening={false}/>
                            <Text text={`N = ${cauchyN}`} x={sxN(cauchyN) + 4} y={PAD.top + 2} fontSize={11}
                                  fontFamily="monospace" fill={OK} listening={false}/>
                            {Array.from({length: N_TERMS}, (_, i) => i + 1).map((n) => (
                                <Circle key={n} x={sxN(n)} y={syT(seqTerm(n))} radius={3.2}
                                        fill={n >= cauchyN ? OK : colors.muted}
                                        opacity={n >= cauchyN ? 1 : 0.55} listening={false}/>
                            ))}
                            {/* 꼬리의 지름을 세로 화살표 대신 두 수평선으로 표시한다. */}
                            <Line points={[sxN(cauchyN), syT(seqTerm(cauchyN)), PAD.left + plotW, syT(seqTerm(cauchyN))]}
                                  stroke={OK} strokeWidth={1} dash={[4, 3]} listening={false}/>
                            <Line points={[sxN(cauchyN), syT(2), PAD.left + plotW, syT(2)]}
                                  stroke={OK} strokeWidth={1} dash={[4, 3]} listening={false}/>
                            <Text text={`diam = ${fmt(tailDiam(cauchyN), 4)} < ε`}
                                  x={PAD.left + plotW - 150} y={syT(2) + 6} width={146} align="right"
                                  fontSize={11} fontFamily="monospace" fill={OK} listening={false}/>
                            <Text text={t("inf of the tail", "꼬리의 inf")} x={sxN(cauchyN) + 6}
                                  y={syT(2) + 6} fontSize={10} fontFamily="monospace" fill={colors.muted}
                                  listening={false}/>
                            <Text text={t("sup of the tail", "꼬리의 sup")} x={sxN(cauchyN) + 6}
                                  y={syT(seqTerm(cauchyN)) - 15} fontSize={10} fontFamily="monospace"
                                  fill={colors.muted} listening={false}/>
                            <Line points={[PAD.left, PAD.top + plotH, PAD.left + plotW, PAD.top + plotH]}
                                  stroke={colors.text} strokeWidth={1} listening={false}/>
                            <Text text="xₙ = 2 + 3/n" x={PAD.left + 6} y={PAD.top + 2} fontSize={11}
                                  fontFamily="monospace" fill={colors.text} listening={false}/>
                        </>
                    )}

                    {mode === "rationals" && (
                        <>
                            {/* 확대되는 수직선. 매 걸음 구간이 10배 좁아지지만 sqrt(2) 는 늘 안쪽에 있다. */}
                            <Line points={[PAD.left, PAD.top + plotH / 2, PAD.left + plotW, PAD.top + plotH / 2]}
                                  stroke={colors.text} strokeWidth={1.5} listening={false}/>
                            {Array.from({length: 11}, (_, i) => a + ((b - a) * i) / 10).map((v, i) => (
                                <Line key={i} points={[sxQ(v), PAD.top + plotH / 2 - 6, sxQ(v), PAD.top + plotH / 2 + 6]}
                                      stroke={colors.border} strokeWidth={1} listening={false}/>
                            ))}
                            {/* 다음 단계의 구간. 이 안으로 또 들어간다. */}
                            <Rect x={sxQ(nextA)} y={PAD.top + plotH / 2 - 26}
                                  width={Math.max(2, sxQ(nextB) - sxQ(nextA))} height={52}
                                  fill={colors.accent} opacity={0.16} listening={false}/>
                            <Circle x={sxQ(a)} y={PAD.top + plotH / 2} radius={6} fill={colors.accent2}
                                    listening={false}/>
                            <Text text={`x = ${a}`} x={sxQ(a) - 70} y={PAD.top + plotH / 2 + 16} width={140}
                                  align="center" fontSize={11} fontFamily="monospace" fill={colors.accent2}
                                  listening={false}/>
                            {inWindow(Math.SQRT2) && (
                                <>
                                    <Line points={[sxQ(Math.SQRT2), PAD.top + 10, sxQ(Math.SQRT2), PAD.top + plotH - 10]}
                                          stroke={BAD} strokeWidth={2} dash={[5, 4]} listening={false}/>
                                    <Text text="√2 ∉ ℚ" x={sxQ(Math.SQRT2) - 60} y={PAD.top + 12} width={120}
                                          align="center" fontSize={12} fontFamily="monospace" fill={BAD}
                                          listening={false}/>
                                </>
                            )}
                            <Text text={`${a}`} x={PAD.left - 30} y={PAD.top + plotH / 2 - 30} width={80}
                                  align="left" fontSize={10} fontFamily="monospace" fill={colors.muted}
                                  listening={false}/>
                            <Text text={`${fmt(b, zoom + 1)}`} x={PAD.left + plotW - 80}
                                  y={PAD.top + plotH / 2 - 30} width={80} align="right" fontSize={10}
                                  fontFamily="monospace" fill={colors.muted} listening={false}/>
                            <Text text={t(`interval width 10⁻${zoom}, every endpoint rational`,
                                `구간 폭 10⁻${zoom}, 양 끝은 모두 유리수`)}
                                  x={PAD.left} y={PAD.top + plotH - 6} width={plotW} align="center"
                                  fontSize={11} fontFamily="monospace" fill={colors.muted} listening={false}/>
                        </>
                    )}

                    {mode === "ramps" && (
                        <>
                            <Line points={betweenPts} closed fill={BAD} opacity={0.22} listening={false}/>
                            {/* 극한이라고 부를 만한 계단 함수. 연속이 아니므로 이 공간의 원소가 아니다. */}
                            <Line points={[sxR(0), syR(0), sxR(0.5), syR(0)]} stroke={colors.muted}
                                  strokeWidth={2} dash={[6, 4]} listening={false}/>
                            <Line points={[sxR(0.5), syR(1), sxR(1), syR(1)]} stroke={colors.muted}
                                  strokeWidth={2} dash={[6, 4]} listening={false}/>
                            <Line points={rampPts(nRamp)} stroke={colors.accent} strokeWidth={2.4}
                                  listening={false}/>
                            <Line points={rampPts(mRamp)} stroke={colors.accent2} strokeWidth={2.4}
                                  listening={false}/>
                            <Line points={[sxR(0), syR(0), sxR(1), syR(0)]} stroke={colors.text}
                                  strokeWidth={1} listening={false}/>
                            <Line points={[sxR(0.5), syR(-0.06), sxR(0.5), syR(1.08)]} stroke={colors.border}
                                  strokeWidth={1} dash={[3, 3]} listening={false}/>
                            <Text text={`f${nRamp}`} x={sxR(0.5) - 60} y={syR(0.55)} fontSize={11}
                                  fontFamily="monospace" fill={colors.accent} listening={false}/>
                            <Text text={`f${mRamp}`} x={sxR(0.5) - 22} y={syR(0.28)} fontSize={11}
                                  fontFamily="monospace" fill={colors.accent2} listening={false}/>
                            <Text text={t("step limit (not continuous)", "계단 극한 (연속 아님)")}
                                  x={sxR(0.52)} y={syR(1.0) - 16} fontSize={11} fontFamily="monospace"
                                  fill={colors.muted} listening={false}/>
                            <Text text="1/2" x={sxR(0.5) - 20} y={syR(0) + 6} fontSize={10}
                                  fontFamily="monospace" fill={colors.muted} listening={false}/>
                        </>
                    )}
                </Layer>
            </Stage>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {([["tail", t("Cauchy in ℝ", "ℝ에서 Cauchy")],
                    ["rationals", t("Cauchy in ℚ", "ℚ에서 Cauchy")],
                    ["ramps", t("Cauchy in C[0,1]", "C[0,1]에서 Cauchy")]] as Array<[Mode, string]>)
                    .map(([m, label]) => (
                        <button key={m} type="button" onClick={() => setMode(m)}
                                className={cn("px-2.5 py-1 rounded border font-mono",
                                    mode === m
                                        ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                        : "border-border text-muted hover:bg-surface")}>
                            {label}
                        </button>
                    ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {mode === "tail" && (
                    <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                        <span className="font-mono w-20">ε = {fmt(eps, 2)}</span>
                        <input type="range" min={0.05} max={2} step={0.01} value={eps}
                               aria-label={t("tolerance epsilon", "허용 오차 엡실론")}
                               onChange={(e) => setEps(Number(e.target.value))}
                               className="w-32 accent-[var(--accent)]"/>
                    </label>
                )}
                {mode === "rationals" && (
                    <>
                        <button type="button" onClick={() => setZoom((v) => Math.min(MAX_ZOOM, v + 1))}
                                disabled={zoom >= MAX_ZOOM}
                                className="px-3 py-1 rounded border border-border bg-surface font-mono font-semibold
                                           hover:border-[var(--accent)] disabled:opacity-40">
                            {t("zoom in 10×", "10배 확대")}
                        </button>
                        <button type="button" onClick={() => setZoom(2)}
                                className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                            {t("restart", "처음으로")}
                        </button>
                    </>
                )}
                {mode === "ramps" && (
                    <>
                        <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                            <span className="font-mono w-16">n = {nRamp}</span>
                            <input type="range" min={2} max={40} step={1} value={nRamp}
                                   aria-label={t("index n", "지수 n")}
                                   onChange={(e) => setNRamp(Number(e.target.value))}
                                   className="w-24 accent-[var(--accent)]"/>
                        </label>
                        <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                            <span className="font-mono w-16">m = {mRamp}</span>
                            <input type="range" min={2} max={40} step={1} value={mRamp}
                                   aria-label={t("index m", "지수 m")}
                                   onChange={(e) => setMRamp(Number(e.target.value))}
                                   className="w-24 accent-[var(--accent)]"/>
                        </label>
                    </>
                )}
            </div>

            {mode === "tail" && (
                <>
                    <p className="mt-2 text-sm text-center font-mono" style={{color: OK}}>
                        N = {cauchyN} · diam{"{"}xₙ : n ≥ N{"}"} = 3/N = {fmt(tailDiam(cauchyN), 5)} {"<"} ε = {fmt(eps, 2)}
                    </p>
                    <p className="mt-2 text-sm text-muted text-center px-2">
                        {t("The band is the spread of the tail: its top and bottom are the sup and inf of the terms from N on, and its height is the largest gap any two of them can have. Reading it needs the terms and nothing else, so the test runs on a sequence whose destination you have never computed. That is the only reason it is useful in practice.",
                            "띠는 꼬리가 퍼져 있는 폭이다. 위아래 경계는 N부터의 항들의 sup과 inf이고, 높이는 그 항들 둘이 벌어질 수 있는 최대 간격이다. 읽는 데 필요한 것은 항들뿐이라서, 도착지를 한 번도 계산해 본 적 없는 수열에도 그대로 돌아간다. 실전에서 쓸모가 있는 이유는 그것뿐이다.")}
                    </p>
                </>
            )}

            {mode === "rationals" && (
                <>
                    <p className="mt-2 text-sm text-center font-mono" style={{color: BAD}}>
                        x = {a} = {Math.round(a * 10 ** zoom)}/{10 ** zoom} · x² = {fmt(a * a, 10)}
                        {" · "}(x + 10⁻{zoom})² = {fmt(b * b, 10)}
                    </p>
                    <p className="mt-1 text-xs text-center font-mono text-muted">
                        x² {"<"} 2 {"<"} (x + 10⁻{zoom})² {t("for every zoom level", "모든 확대 단계에서")}
                    </p>
                    <p className="mt-2 text-sm text-muted text-center px-2">
                        {t("Every term is a fraction with denominator a power of ten, and the terms bunch together as tightly as you like, so the sequence is Cauchy in the rationals. The point they close in on squares to 2, and Chapter 1 proved no fraction does that. The rationals have a hole exactly where this sequence was heading, and completeness is the axiom that says the reals do not.",
                            "모든 항이 분모가 10의 거듭제곱인 분수이고, 항들은 원하는 만큼 촘촘히 몰려든다. 그러니 이 수열은 유리수 안에서 Cauchy다. 그런데 그 항들이 조여드는 점은 제곱해서 2가 되고, 1장은 그런 분수가 없음을 증명했다. 이 수열이 향하던 바로 그 자리에 유리수는 구멍을 갖고 있고, 실수에는 그 구멍이 없다고 말하는 것이 완비성이다.")}
                    </p>
                </>
            )}

            {mode === "ramps" && (
                <>
                    <p className="mt-2 text-sm text-center font-mono" style={{color: BAD}}>
                        ‖f<sub>n</sub> − f<sub>m</sub>‖₁ = ½|1/n − 1/m| = {fmt(rampL1Diff(nRamp, mRamp), 6)}
                    </p>
                    <p className="mt-1 text-xs text-center font-mono text-muted">
                        ‖f<sub>n</sub> − f<sub>step</sub>‖₁ = 1/(2n) = {fmt(rampL1ToStep(nRamp), 6)}
                        {" · "}‖f<sub>m</sub> − f<sub>step</sub>‖₁ = {fmt(rampL1ToStep(mRamp), 6)}
                    </p>
                    <p className="mt-2 text-sm text-muted text-center px-2">
                        {t("The shaded area between the two ramps is their distance, and pushing both sliders right drives it to zero, so this sequence of continuous functions is Cauchy. What it closes in on is the dashed step, which is not continuous and therefore not in the space at all. Here the hole is not a missing number but a missing function, and this is why the notes insist that every counterexample to completeness is infinite dimensional.",
                            "두 경사 사이의 색칠된 넓이가 그대로 두 함수의 거리이고, 슬라이더 둘을 오른쪽으로 밀면 0으로 간다. 그러니 이 연속 함수열은 Cauchy다. 그런데 이들이 조여드는 대상은 점선으로 그린 계단이고, 계단은 연속이 아니므로 애초에 이 공간의 원소가 아니다. 여기서 구멍은 빠진 수가 아니라 빠진 함수다. 완비성의 반례가 모두 무한 차원인 이유가 이것이다.")}
                    </p>
                </>
            )}
        </div>
    );
};

export default CauchyCompleteness;
