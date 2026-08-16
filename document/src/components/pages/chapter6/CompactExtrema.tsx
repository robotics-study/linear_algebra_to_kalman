import {useState} from "react";
import {Circle, Layer, Line, Stage, Text} from "react-konva";
import {fmt} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";

// 이 장이 답하려던 질문은 "최솟값이 존재하는가"였고, 답은 집합의 성질이지 함수의 성질이 아니다.
// 왼쪽 판은 덮개를 유한 개로 줄일 수 있는지를 묻고, 오른쪽 판은 같은 함수가 어떤 집합 위에서는
// 최댓값에 닿고 어떤 집합 위에서는 닿지 못하는지를 보인다. 두 판에서 바뀌는 것은 집합뿐이다.
const PAD = {left: 46, right: 20, top: 16, bottom: 30};
const OK = "#10b981";
const BAD = "#ef4444";
const SHOWN_SETS = 9;

type Mode = "cover" | "weierstrass";
type SetId = "compact" | "open" | "unbounded";

interface Props {
    width?: number;
    height?: number;
}

const CompactExtrema = ({width: fixedWidth, height = 390}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;

    const [mode, setMode] = useState<Mode>("cover");
    // a = 0 이면 집합이 (0, 1] 이 되어 닫히지 않는다. 슬라이더로 a 를 0 까지 밀어 보는 것이 이 판의 전부다.
    const [a, setA] = useState(0.22);
    const [k, setK] = useState(3);
    const [setId, setSetId] = useState<SetId>("compact");

    const plotW = Math.max(140, width - PAD.left - PAD.right);
    const plotH = Math.max(110, height - PAD.top - PAD.bottom);

    // ---- 판 1: 열린 덮개와 유한 부분덮개 -----------------------------------
    // U_n = (1/n, 2). 이 족은 (0, 1] 을 덮지만 어떤 유한 부분족도 덮지 못한다.
    const X_HI = 1.25;
    const sxC = (v: number) => PAD.left + (v / X_HI) * plotW;
    const isCompactSet = a > 0;
    // 첫 k 개만 쓸 때 실제로 덮이는 왼쪽 끝은 1/k 다. 집합의 왼쪽 끝이 그보다 오른쪽이면 덮인다.
    const coveredFrom = 1 / k;
    const covered = isCompactSet && coveredFrom < a;
    // 유한 부분덮개가 존재한다면 최소 몇 개까지 가야 하는가.
    const neededK = isCompactSet ? Math.floor(1 / a) + 1 : null;

    // ---- 판 2: Weierstrass ------------------------------------------------
    const W_HI = setId === "unbounded" ? 2.6 : 1.25;
    const sxW = (v: number) => PAD.left + (v / W_HI) * plotW;
    const syW = (v: number) => PAD.top + plotH - (v / W_HI) * plotH;
    const right = setId === "unbounded" ? W_HI : 1;
    const supValue = setId === "unbounded" ? null : 1;
    const attained = setId === "compact";

    const setLabel: Record<SetId, string> = {
        compact: "C = [0, 1]",
        open: "C = (0, 1)",
        unbounded: "C = [0, ∞)",
    };

    return (
        <div ref={ref} className="w-full">
            <Stage width={width} height={height} className="overflow-hidden w-fit h-fit">
                <Layer>
                    {mode === "cover" ? (
                        <>
                            {/* 덮개의 각 원소를 한 줄씩 쌓는다. 아래로 갈수록 왼쪽 끝이 0 에 다가간다. */}
                            {Array.from({length: SHOWN_SETS}, (_, i) => i + 1).map((n) => {
                                const used = n <= k;
                                const y = PAD.top + 18 + (n - 1) * 17;
                                return (
                                    <Line key={n}
                                          points={[sxC(1 / n), y, sxC(Math.min(X_HI, 2)), y]}
                                          stroke={used ? colors.accent : colors.border}
                                          strokeWidth={used ? 4 : 2}
                                          opacity={used ? 0.85 : 0.45} listening={false}/>
                                );
                            })}
                            {Array.from({length: SHOWN_SETS}, (_, i) => i + 1).map((n) => (
                                <Text key={n} text={`U${n}`} x={sxC(1 / n) - 26}
                                      y={PAD.top + 12 + (n - 1) * 17} fontSize={10} fontFamily="monospace"
                                      fill={n <= k ? colors.accent : colors.muted} listening={false}/>
                            ))}

                            {/* 덮으려는 집합. */}
                            <Line points={[sxC(a), PAD.top + plotH - 22, sxC(1), PAD.top + plotH - 22]}
                                  stroke={covered ? OK : BAD} strokeWidth={7} listening={false}/>
                            {/* 첫 k 개로 덮이지 않고 남는 조각. 이것이 0 으로 밀려날 뿐 사라지지 않는다. */}
                            {!covered && (
                                <Line points={[sxC(a), PAD.top + plotH - 22,
                                    sxC(Math.min(1, coveredFrom)), PAD.top + plotH - 22]}
                                      stroke={BAD} strokeWidth={11} opacity={0.5} listening={false}/>
                            )}
                            <Circle x={sxC(a)} y={PAD.top + plotH - 22} radius={5}
                                    fill={isCompactSet ? (covered ? OK : BAD) : colors.bg}
                                    stroke={covered ? OK : BAD} strokeWidth={2.5} listening={false}/>
                            <Circle x={sxC(1)} y={PAD.top + plotH - 22} radius={5}
                                    fill={covered ? OK : BAD} listening={false}/>
                            <Line points={[PAD.left, PAD.top + plotH, PAD.left + plotW, PAD.top + plotH]}
                                  stroke={colors.text} strokeWidth={1} listening={false}/>
                            {[0, 0.5, 1].map((v) => (
                                <Text key={v} text={String(v)} x={sxC(v) - 10} y={PAD.top + plotH + 6}
                                      width={20} align="center" fontSize={10} fontFamily="monospace"
                                      fill={colors.muted} listening={false}/>
                            ))}
                            <Text text={isCompactSet ? `C = [${fmt(a, 3)}, 1]` : "C = (0, 1]"}
                                  x={PAD.left + 6} y={PAD.top + plotH - 44} fontSize={11}
                                  fontFamily="monospace" fill={covered ? OK : BAD} listening={false}/>
                            <Text text="Uₙ = (1/n, 2)" x={PAD.left + 6} y={PAD.top} fontSize={11}
                                  fontFamily="monospace" fill={colors.text} listening={false}/>
                        </>
                    ) : (
                        <>
                            {/* f(x) = x. 함수는 세 경우에서 완전히 같고, 바뀌는 것은 집합뿐이다. */}
                            <Line points={[sxW(0), syW(0), sxW(right), syW(right)]} stroke={colors.text}
                                  strokeWidth={2.4} listening={false}/>
                            {supValue !== null && (
                                <Line points={[PAD.left, syW(supValue), PAD.left + plotW, syW(supValue)]}
                                      stroke={attained ? OK : BAD} strokeWidth={1.5} dash={[6, 4]}
                                      listening={false}/>
                            )}
                            {/* 정의역을 축 위에 굵게 표시하고, 끝점이 포함되면 채운 점, 아니면 빈 점. */}
                            <Line points={[sxW(0), PAD.top + plotH, sxW(right), PAD.top + plotH]}
                                  stroke={colors.accent2} strokeWidth={6} opacity={0.75} listening={false}/>
                            <Circle x={sxW(0)} y={PAD.top + plotH} radius={5}
                                    fill={setId === "open" ? colors.bg : colors.accent2}
                                    stroke={colors.accent2} strokeWidth={2.5} listening={false}/>
                            {setId !== "unbounded" && (
                                <Circle x={sxW(1)} y={PAD.top + plotH} radius={5}
                                        fill={setId === "compact" ? colors.accent2 : colors.bg}
                                        stroke={colors.accent2} strokeWidth={2.5} listening={false}/>
                            )}
                            {/* 최댓값이 실제로 찍히는 점. 열린 집합에서는 빈 점이 되어 닿지 못함을 보인다. */}
                            {supValue !== null && (
                                <Circle x={sxW(1)} y={syW(1)} radius={6}
                                        fill={attained ? OK : colors.bg} stroke={attained ? OK : BAD}
                                        strokeWidth={2.5} listening={false}/>
                            )}
                            {setId === "unbounded" && (
                                <Text text={t("f keeps climbing: no sup at all", "f가 계속 올라간다: sup 자체가 없다")}
                                      x={PAD.left} y={PAD.top + 4} width={plotW} align="center"
                                      fontSize={11} fontFamily="monospace" fill={BAD} listening={false}/>
                            )}
                            <Line points={[PAD.left, PAD.top + plotH, PAD.left + plotW, PAD.top + plotH]}
                                  stroke={colors.text} strokeWidth={1} listening={false}/>
                            <Line points={[PAD.left, PAD.top, PAD.left, PAD.top + plotH]}
                                  stroke={colors.text} strokeWidth={1} listening={false}/>
                            <Text text="f(x) = x" x={PAD.left + 6} y={PAD.top + plotH - 20} fontSize={11}
                                  fontFamily="monospace" fill={colors.text} listening={false}/>
                            {supValue !== null && (
                                <Text text={attained ? t("max attained", "최댓값 도달")
                                    : t("sup = 1, never reached", "sup = 1, 도달 못 함")}
                                      x={PAD.left + plotW - 160} y={syW(1) - 16} width={156} align="right"
                                      fontSize={11} fontFamily="monospace" fill={attained ? OK : BAD}
                                      listening={false}/>
                            )}
                        </>
                    )}
                </Layer>
            </Stage>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {([["cover", t("finite subcover", "유한 부분덮개")],
                    ["weierstrass", t("Weierstrass", "Weierstrass")]] as Array<[Mode, string]>).map(([m, label]) => (
                    <button key={m} type="button" onClick={() => setMode(m)}
                            className={cn("px-2.5 py-1 rounded border font-mono",
                                mode === m
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {label}
                    </button>
                ))}
            </div>

            {mode === "cover" ? (
                <>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                        <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                            <span className="font-mono w-20">a = {fmt(a, 3)}</span>
                            <input type="range" min={0} max={0.5} step={0.001} value={a}
                                   aria-label={t("left endpoint a", "왼쪽 끝점 a")}
                                   onChange={(e) => setA(Number(e.target.value))}
                                   className="w-32 accent-[var(--accent)]"/>
                        </label>
                        <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                            <span className="font-mono w-28">{t("use", "사용")} U₁…U<sub>{k}</sub></span>
                            <input type="range" min={1} max={SHOWN_SETS} step={1} value={k}
                                   aria-label={t("how many cover sets you may use", "쓸 수 있는 덮개 원소 개수")}
                                   onChange={(e) => setK(Number(e.target.value))}
                                   className="w-24 accent-[var(--accent)]"/>
                        </label>
                        <button type="button" onClick={() => setA(0)}
                                className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                            {t("push a to 0", "a를 0으로")}
                        </button>
                    </div>
                    <p className="mt-2 text-sm text-center font-mono" style={{color: covered ? OK : BAD}}>
                        {isCompactSet ? `C = [${fmt(a, 3)}, 1]` : "C = (0, 1]"} ·{" "}
                        {t("first k sets reach down to", "첫 k개가 닿는 왼쪽 끝")} 1/{k} = {fmt(coveredFrom, 4)}
                        {" · "}{covered ? t("covered", "덮임") : t("gap remains", "빈틈 남음")}
                    </p>
                    <p className="mt-1 text-xs text-center font-mono text-muted">
                        {neededK === null
                            ? t("no finite subcover exists", "유한 부분덮개가 존재하지 않는다")
                            : `${t("smallest k that works", "통하는 최소 k")} = ${neededK}`}
                    </p>
                    <p className="mt-2 text-sm text-muted text-center px-2">
                        {isCompactSet
                            ? t("Slide a towards zero and watch the number of sets you need climb without limit. Every position of the slider still admits a finite subcover, so every one of these sets is compact.",
                                "a를 0 쪽으로 밀면 필요한 원소 개수가 끝없이 올라간다. 그래도 슬라이더의 어느 위치에서든 유한 부분덮개는 여전히 존재하고, 그러니 이 집합들은 모두 컴팩트다.")
                            : t("At a = 0 the left endpoint is gone and the count has run off to infinity. Any finite subfamily has a largest index N and reaches only down to 1/N, so the piece from 0 to 1/N is always left over. The cover is a cover, but it has no finite subcover, and losing one endpoint was enough.",
                                "a = 0에서는 왼쪽 끝점이 사라졌고 개수는 무한으로 달아났다. 어떤 유한 부분족이든 가장 큰 지수 N을 갖고 1/N까지만 닿으므로, 0부터 1/N까지의 조각이 언제나 남는다. 덮개이기는 하지만 유한 부분덮개가 없고, 끝점 하나를 잃은 것으로 충분했다.")}
                    </p>
                </>
            ) : (
                <>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                        {(Object.keys(setLabel) as SetId[]).map((id) => (
                            <button key={id} type="button" onClick={() => setSetId(id)}
                                    className={cn("px-2.5 py-1 rounded border font-mono",
                                        setId === id
                                            ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                            : "border-border text-muted hover:bg-surface")}>
                                {setLabel[id]}
                            </button>
                        ))}
                    </div>
                    <p className="mt-2 text-sm text-center font-mono" style={{color: attained ? OK : BAD}}>
                        {setLabel[setId]} · {t("closed", "닫힘")}: {setId === "open" ? "no" : "yes"} ·{" "}
                        {t("bounded", "유계")}: {setId === "unbounded" ? "no" : "yes"} ·{" "}
                        {t("compact", "컴팩트")}: {attained ? "yes" : "no"}
                    </p>
                    <p className="mt-1 text-xs text-center font-mono text-muted">
                        {supValue === null
                            ? `sup f = ∞ · ${t("no maximizer", "최대점 없음")}`
                            : `sup f = 1 · ${attained ? `${t("attained at", "도달 지점")} x = 1` : t("not attained", "도달 못 함")}`}
                    </p>
                    <p className="mt-2 text-sm text-muted text-center px-2">
                        {setId === "compact"
                            ? t("Closed and bounded, so the theorem applies and the maximum is a value the function actually takes at a point of the set.",
                                "닫혔고 유계이므로 정리가 적용되고, 최댓값은 함수가 집합의 어떤 점에서 실제로 갖는 값이다.")
                            : setId === "open"
                                ? t("The same function on a set missing one point. The supremum still exists, but nothing in the set achieves it, so an optimizer asked to return the maximizer has nothing to return.",
                                    "같은 함수인데 집합이 점 하나를 빠뜨렸다. supremum은 여전히 존재하지만 집합 안의 어떤 것도 그것을 달성하지 못하므로, 최대점을 돌려 달라는 최적화기는 돌려줄 것이 없다.")
                                : t("Closed but not bounded, and now there is no supremum to reach in the first place. Closedness alone buys nothing.",
                                    "닫혔지만 유계가 아니고, 이제는 닿을 supremum 자체가 없다. 닫힘만으로는 아무것도 사지 못한다.")}
                    </p>
                </>
            )}

            <p className="mt-1 text-sm text-muted text-center px-2">
                {t("Compactness is a property of the set, not of the function, and that is why it answers the existence question once for every continuous objective at the same time. Drop closedness and the best value can sit just outside; drop boundedness and there may be no best value at all.",
                    "컴팩트성은 함수가 아니라 집합의 성질이고, 그래서 존재 문제를 모든 연속 목적함수에 대해 한 번에 답해 준다. 닫힘을 버리면 최적값이 바로 바깥에 앉아 있을 수 있고, 유계를 버리면 최적값이 아예 없을 수 있다.")}
            </p>
        </div>
    );
};

export default CompactExtrema;
