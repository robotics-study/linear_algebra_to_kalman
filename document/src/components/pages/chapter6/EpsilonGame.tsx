import {useMemo, useState} from "react";
import {Circle, Layer, Line, Rect, Stage, Text} from "react-konva";
import {fmt} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {
    CONT_X0, FUNCTIONS, FunctionId, SEQUENCES, SequenceId, witnessFor,
} from "./analysis";

// 수렴과 연속은 같은 게임이다. 상대가 eps 를 부르면 이쪽이 N 이나 delta 를 내놓아야 한다.
// 교재 Theorem 6.49 가 둘을 잇는 이유도 그것이다. 그래서 한 그림에 두 판으로 담았다.
// eps 를 줄이면 요구되는 N 이 오른쪽으로 밀리고 delta 가 좁아지는 것이 눈으로 보인다.
const PAD = {left: 46, right: 16, top: 14, bottom: 30};
const N_TERMS = 40;
const OK = "#10b981";
const BAD = "#ef4444";

export type GameMode = "sequence" | "function";

interface Props {
    width?: number;
    height?: number;
    defaultMode?: GameMode;
}

// 수식 라벨은 언어와 무관하다. 전부 monospace 로 렌더되는 자리라 유니코드 기호를 그대로 쓴다.
const SEQ_LABEL: Record<SequenceId, string> = {
    harmonic: "2 + 3/n",
    alternating: "2 + 3(−1)ⁿ/n",
    oscillate: "2 + (−1)ⁿ",
    diverge: "2 + n/6",
};

const EpsilonGame = ({width: fixedWidth, height = 380, defaultMode = "sequence"}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;

    const [mode, setMode] = useState<GameMode>(defaultMode);
    const [seqId, setSeqId] = useState<SequenceId>("harmonic");
    const [fnId, setFnId] = useState<FunctionId>("smooth");
    const [eps, setEps] = useState(0.6);
    // delta 는 독자가 직접 제시하는 후보다. 정의가 "존재한다"를 말하므로, 하나 내밀고
    // 통하는지 확인하는 경험이 정의 그 자체다.
    const [delta, setDelta] = useState(0.4);

    const plotW = Math.max(140, width - PAD.left - PAD.right);
    const plotH = Math.max(120, height - PAD.top - PAD.bottom);

    // ---- 수열 판 -----------------------------------------------------------
    const seq = SEQUENCES[seqId];
    const terms = useMemo(
        () => Array.from({length: N_TERMS}, (_, i) => seq.term(i + 1)),
        [seqId],
    );
    const needed = seq.smallestN(eps);
    const seqLo = Math.min(...terms, seq.candidate - 1.4);
    const seqHi = Math.max(...terms.slice(0, 12), seq.candidate + 1.4);
    const sxN = (n: number) => PAD.left + ((n - 1) / (N_TERMS - 1)) * plotW;
    const syV = (v: number) => PAD.top + ((seqHi - v) / (seqHi - seqLo)) * plotH;

    // ---- 함수 판 -----------------------------------------------------------
    const fn = FUNCTIONS[fnId];
    const F_LO = 0;
    const F_HI = 2;
    const fy0 = fn.at(CONT_X0);
    const fLo = fy0 - 2.0;
    const fHi = fy0 + 2.2;
    const sxX = (x: number) => PAD.left + ((x - F_LO) / (F_HI - F_LO)) * plotW;
    const syF = (v: number) => PAD.top + ((fHi - v) / (fHi - fLo)) * plotH;

    const branches = useMemo(() => {
        // 도약이 있는 함수는 x0 을 경계로 두 조각으로 그린다. 한 줄로 이으면 수직선이 생겨
        // 마치 연속인 것처럼 보인다.
        const seg = (a: number, b: number) => {
            const pts: number[] = [];
            const n = 200;
            for (let i = 0; i <= n; i++) {
                const x = a + ((b - a) * i) / n;
                pts.push(sxX(x), syF(fn.at(x)));
            }
            return pts;
        };
        return fn.continuous
            ? [seg(F_LO, F_HI)]
            : [seg(F_LO, CONT_X0), seg(CONT_X0 + 1e-9, F_HI)];
    }, [fnId, plotW, plotH]);

    const bestDelta = fn.largestDelta(eps);
    // 후보 delta 가 실제로 통하는가. 통하지 않으면 정의를 깨는 점을 하나 실제로 찾아 보여 준다.
    const witness = witnessFor(fn, eps, delta);
    const deltaWorks = witness === null;
    const witnessGap = witness === null ? 0 : Math.abs(fn.at(witness) - fy0);

    const seqVerdict = needed === null
        ? t("No N works. The definition fails, and it fails for every candidate you could name.",
            "통하는 N이 없다. 정의가 깨지고, 어떤 후보를 대도 마찬가지로 깨진다.")
        : t(`Every term from n = ${needed} onward sits inside the band.`,
            `n = ${needed}부터 뒤로는 모든 항이 띠 안에 있다.`);

    return (
        <div ref={ref} className="w-full">
            <Stage width={width} height={height} className="overflow-hidden w-fit h-fit">
                <Layer>
                    {mode === "sequence" ? (
                        <>
                            {/* eps 띠. 정의가 요구하는 것은 "꼬리 전체가 이 안"이다. */}
                            <Rect x={PAD.left} y={syV(seq.candidate + eps)} width={plotW}
                                  height={Math.abs(syV(seq.candidate - eps) - syV(seq.candidate + eps))}
                                  fill={needed === null ? BAD : OK} opacity={0.13} listening={false}/>
                            <Line points={[PAD.left, syV(seq.candidate), PAD.left + plotW, syV(seq.candidate)]}
                                  stroke={colors.accent} strokeWidth={1.5} dash={[6, 4]} listening={false}/>
                            {needed !== null && needed <= N_TERMS && (
                                <>
                                    <Line points={[sxN(needed), PAD.top, sxN(needed), PAD.top + plotH]}
                                          stroke={OK} strokeWidth={2} listening={false}/>
                                    <Text text={`N = ${needed}`} x={sxN(needed) + 4} y={PAD.top + 2}
                                          fontSize={11} fontFamily="monospace" fill={OK} listening={false}/>
                                </>
                            )}
                            {terms.map((v, i) => {
                                const n = i + 1;
                                const inside = Math.abs(v - seq.candidate) < eps;
                                const clamped = Math.min(seqHi, Math.max(seqLo, v));
                                return (
                                    <Circle key={n} x={sxN(n)} y={syV(clamped)} radius={3.2}
                                            fill={inside ? OK : BAD}
                                            opacity={v === clamped ? 1 : 0.35} listening={false}/>
                                );
                            })}
                            <Line points={[PAD.left, PAD.top + plotH, PAD.left + plotW, PAD.top + plotH]}
                                  stroke={colors.text} strokeWidth={1} listening={false}/>
                            <Text text={`x = ${fmt(seq.candidate, 0)}`} x={PAD.left + 4}
                                  y={syV(seq.candidate) - 14} fontSize={11} fontFamily="monospace"
                                  fill={colors.accent} listening={false}/>
                            <Text text="n" x={PAD.left + plotW - 10} y={PAD.top + plotH + 8} fontSize={11}
                                  fontFamily="monospace" fill={colors.muted} listening={false}/>
                        </>
                    ) : (
                        <>
                            {/* eps 는 세로(값) 쪽, delta 는 가로(정의역) 쪽. 둘의 순서가 정의의 핵심이다. */}
                            <Rect x={PAD.left} y={syF(fy0 + eps)} width={plotW}
                                  height={Math.abs(syF(fy0 - eps) - syF(fy0 + eps))}
                                  fill={colors.accent} opacity={0.12} listening={false}/>
                            <Rect x={sxX(CONT_X0 - delta)} y={PAD.top}
                                  width={Math.abs(sxX(CONT_X0 + delta) - sxX(CONT_X0 - delta))}
                                  height={plotH} fill={deltaWorks ? OK : BAD} opacity={0.14}
                                  listening={false}/>
                            {branches.map((pts, i) => (
                                <Line key={i} points={pts} stroke={colors.text} strokeWidth={2}
                                      listening={false}/>
                            ))}
                            <Line points={[PAD.left, syF(fy0), PAD.left + plotW, syF(fy0)]}
                                  stroke={colors.accent} strokeWidth={1} dash={[5, 4]} listening={false}/>
                            <Line points={[sxX(CONT_X0), PAD.top, sxX(CONT_X0), PAD.top + plotH]}
                                  stroke={colors.accent} strokeWidth={1} dash={[5, 4]} listening={false}/>
                            <Circle x={sxX(CONT_X0)} y={syF(fy0)} radius={5} fill={colors.accent}
                                    listening={false}/>
                            {/* 불연속이면 오른쪽 가지의 끝이 열린 점이다. */}
                            {!fn.continuous && (
                                <Circle x={sxX(CONT_X0)} y={syF(fn.at(CONT_X0 + 1e-9))} radius={5}
                                        fill={colors.bg} stroke={colors.text} strokeWidth={2}
                                        listening={false}/>
                            )}
                            {witness !== null && witness <= F_HI && (
                                <>
                                    <Line points={[sxX(witness), syF(fy0), sxX(witness), syF(fn.at(witness))]}
                                          stroke={BAD} strokeWidth={2} listening={false}/>
                                    <Circle x={sxX(witness)} y={syF(fn.at(witness))} radius={4.5} fill={BAD}
                                            listening={false}/>
                                    <Text text={t("witness", "증인")} x={sxX(witness) + 6}
                                          y={syF(fn.at(witness)) - 6} fontSize={10} fontFamily="monospace"
                                          fill={BAD} listening={false}/>
                                </>
                            )}
                            <Line points={[PAD.left, PAD.top + plotH, PAD.left + plotW, PAD.top + plotH]}
                                  stroke={colors.text} strokeWidth={1} listening={false}/>
                            <Text text={fn.continuous ? "f(x) = x²" : "f(x) = x/2 (+1.2 for x > x₀)"}
                                  x={PAD.left + 6} y={PAD.top + 2} fontSize={11} fontFamily="monospace"
                                  fill={colors.text} listening={false}/>
                            <Text text="x₀ = 1" x={sxX(CONT_X0) + 5} y={PAD.top + plotH - 14} fontSize={11}
                                  fontFamily="monospace" fill={colors.accent} listening={false}/>
                        </>
                    )}
                </Layer>
            </Stage>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {([["sequence", t("ε–N (sequence)", "ε–N (수열)")],
                    ["function", t("ε–δ (continuity)", "ε–δ (연속)")]] as Array<[GameMode, string]>)
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
                {mode === "sequence"
                    ? (Object.keys(SEQUENCES) as SequenceId[]).map((id) => (
                        <button key={id} type="button" onClick={() => setSeqId(id)}
                                className={cn("px-2.5 py-1 rounded border font-mono",
                                    seqId === id
                                        ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                        : "border-border text-muted hover:bg-surface")}>
                            {SEQ_LABEL[id]}
                        </button>
                    ))
                    : (Object.keys(FUNCTIONS) as FunctionId[]).map((id) => (
                        <button key={id} type="button" onClick={() => setFnId(id)}
                                className={cn("px-2.5 py-1 rounded border font-mono",
                                    fnId === id
                                        ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                        : "border-border text-muted hover:bg-surface")}>
                            {id === "smooth" ? t("continuous", "연속") : t("jump", "도약")}
                        </button>
                    ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-20">ε = {fmt(eps, 2)}</span>
                    <input type="range" min={0.05} max={2} step={0.01} value={eps}
                           aria-label={t("tolerance epsilon", "허용 오차 엡실론")}
                           onChange={(e) => setEps(Number(e.target.value))}
                           className="w-32 accent-[var(--accent)]"/>
                </label>
                {mode === "function" && (
                    <>
                        <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                            <span className="font-mono w-20">δ = {fmt(delta, 3)}</span>
                            <input type="range" min={0.01} max={1} step={0.005} value={delta}
                                   aria-label={t("candidate delta", "후보 델타")}
                                   onChange={(e) => setDelta(Number(e.target.value))}
                                   className="w-32 accent-[var(--accent)]"/>
                        </label>
                        <button type="button" disabled={bestDelta === null}
                                onClick={() => bestDelta !== null && setDelta(Math.max(0.01, bestDelta))}
                                className="px-2.5 py-1 rounded border border-border font-mono text-muted
                                           hover:bg-surface disabled:opacity-40">
                            {t("snap to the largest δ that works", "통하는 최대 δ로 맞추기")}
                        </button>
                    </>
                )}
            </div>

            {mode === "sequence" ? (
                <>
                    <p className="mt-2 text-sm text-center font-mono"
                       style={{color: needed === null ? BAD : OK}}>
                        x<sub>n</sub> = {SEQ_LABEL[seqId]} · ε = {fmt(eps, 2)} · N(ε) ={" "}
                        {needed === null ? t("does not exist", "존재하지 않음") : needed}
                    </p>
                    <p className="mt-1 text-xs text-center font-mono text-muted">
                        {t("terms outside the band", "띠 밖의 항")}:{" "}
                        {terms.filter((v) => Math.abs(v - seq.candidate) >= eps).length} / {N_TERMS}
                    </p>
                    <p className="mt-2 text-sm text-muted text-center px-2">{seqVerdict}</p>
                </>
            ) : (
                <>
                    <p className="mt-2 text-sm text-center font-mono" style={{color: deltaWorks ? OK : BAD}}>
                        ε = {fmt(eps, 2)} · δ = {fmt(delta, 3)} ·{" "}
                        {t("largest δ that works", "통하는 최대 δ")} ={" "}
                        {bestDelta === null ? t("none", "없음") : fmt(bestDelta, 3)}
                    </p>
                    <p className="mt-1 text-xs text-center font-mono text-muted">
                        {witness === null
                            ? t("every x within δ lands within ε", "δ 안의 모든 x가 ε 안에 떨어진다")
                            : `x = x₀ + δ/2 = ${fmt(witness, 3)} → |f(x) − f(x₀)| = ${fmt(witnessGap, 3)} ≥ ε`}
                    </p>
                    <p className="mt-2 text-sm text-muted text-center px-2">
                        {deltaWorks
                            ? t("This window works. Now shrink the tolerance and watch it stop working: the answer has to be found again for every new demand.",
                                "이 창은 통한다. 이제 허용 오차를 줄여 보면 통하지 않게 된다. 새 요구가 올 때마다 답을 다시 찾아야 한다.")
                            : t("This window fails, and the red point is the reason: it sits inside the window yet its value lands too far away. On the jump, no window can ever succeed once the tolerance drops below the size of the jump.",
                                "이 창은 통하지 않고, 빨간 점이 그 이유다. 창 안에 있는데 값이 너무 멀리 떨어진 곳에 놓인다. 도약이 있는 쪽에서는 허용 오차가 도약의 크기보다 작아지는 순간 어떤 창도 성공할 수 없다.")}
                    </p>
                </>
            )}

            <p className="mt-1 text-sm text-muted text-center px-2">
                {t("The order of the quantifiers is the whole content: the opponent picks the tolerance first, and only then do you get to answer. Shrink the tolerance and your answer must be found again, further out for a sequence and tighter for a function. A sequence that merely oscillates never gets to answer at all once the tolerance drops below the size of the swing, which is exactly what it means to have no limit.",
                    "quantifier의 순서가 내용의 전부다. 상대가 허용 오차를 먼저 고르고, 그다음에야 이쪽이 답한다. 허용 오차를 줄이면 답을 다시 찾아야 한다. 수열이면 더 뒤에서, 함수면 더 좁게. 그냥 진동하기만 하는 수열은 허용 오차가 흔들리는 폭보다 작아지는 순간 답할 기회조차 없어지는데, 그것이 바로 극한이 없다는 말의 뜻이다.")}
            </p>
        </div>
    );
};

export default EpsilonGame;
