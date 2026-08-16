import {useState} from "react";
import {Circle, Layer, Line, Stage, Text} from "react-konva";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";

// max 와 sup 의 차이는 "경계가 집합 안에 있는가" 하나뿐인데, 정의만 읽으면 그 하나가 잘 안 보인다.
// 끝점을 열고 닫아 보면 sup 은 그대로 있는데 max 만 사라지는 장면이 바로 나온다.
const MIN = -1;
const MAX = 3;
const MIN_GAP = 0.3;

const snap = (v: number) => Math.round(v * 10) / 10;
const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

interface Props {
    width?: number;
    height?: number;
}

const SupInfExplorer = ({width: fixedWidth, height = 170}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 560);
    const width = fixedWidth ?? measured;

    const [a, setA] = useState(0);
    const [b, setB] = useState(1);
    const [aClosed, setAClosed] = useState(false);
    const [bClosed, setBClosed] = useState(false);

    const pad = 34;
    const span = Math.max(1, width - pad * 2);
    const axisY = height - 78;
    const toPx = (v: number) => pad + ((v - MIN) / (MAX - MIN)) * span;
    const toVal = (px: number) => MIN + ((px - pad) / span) * (MAX - MIN);

    const bracket = (closed: boolean, side: "left" | "right") =>
        closed ? (side === "left" ? "[" : "]") : (side === "left" ? "(" : ")");

    const setLabel = `A = { x ∈ ℝ | ${fmt(a)} ${aClosed ? "≤" : "<"} x ${bClosed ? "≤" : "<"} ${fmt(b)} }`;
    const interval = `${bracket(aClosed, "left")}${fmt(a)}, ${fmt(b)}${bracket(bClosed, "right")}`;

    const preset = (nextA: number, nextB: number, ac: boolean, bc: boolean) => () => {
        setA(nextA);
        setB(nextB);
        setAClosed(ac);
        setBClosed(bc);
    };

    const Handle = ({value, closed, onMove, lower}: {
        value: number; closed: boolean; onMove: (v: number) => void; lower: boolean;
    }) => (
        <Circle x={toPx(value)} y={axisY} radius={7}
                fill={closed ? colors.accent : colors.bg}
                stroke={colors.accent} strokeWidth={2}
                draggable
                dragBoundFunc={(pos) => ({
                    x: lower
                        ? Math.min(Math.max(pos.x, toPx(MIN)), toPx(b - MIN_GAP))
                        : Math.min(Math.max(pos.x, toPx(a + MIN_GAP)), toPx(MAX)),
                    y: axisY,
                })}
                onDragMove={(e) => onMove(snap(toVal(e.target.x())))}
                onMouseEnter={(e) => {
                    const stage = e.target.getStage();
                    if (stage) stage.container().style.cursor = "ew-resize";
                }}
                onMouseLeave={(e) => {
                    const stage = e.target.getStage();
                    if (stage) stage.container().style.cursor = "default";
                }}/>
    );

    return (
        <div ref={ref} className="w-full">
            <Stage width={width} height={height}>
                <Layer>
                    <Line points={[pad - 14, axisY, width - pad + 14, axisY]}
                          stroke={colors.muted} strokeWidth={1.5}/>
                    {[-1, 0, 1, 2, 3].map((v) => (
                        <Line key={`tick${v}`} points={[toPx(v), axisY - 5, toPx(v), axisY + 5]}
                              stroke={colors.muted} strokeWidth={1}/>
                    ))}
                    {[-1, 0, 1, 2, 3].map((v) => (
                        <Text key={`lab${v}`} x={toPx(v) - 12} y={axisY + 11} width={24} align="center"
                              text={String(v)} fontSize={11} fill={colors.muted}/>
                    ))}

                    {/* 집합 A 자체 */}
                    <Line points={[toPx(a), axisY, toPx(b), axisY]}
                          stroke={colors.accent} strokeWidth={5} opacity={0.55}/>

                    {/* inf/sup 은 항상 존재한다. max/min 은 끝점이 닫혀 있을 때만 생긴다. */}
                    <Line points={[toPx(a), axisY - 34, toPx(a), axisY - 12]}
                          stroke={colors.muted} strokeWidth={1} dash={[3, 3]}/>
                    <Line points={[toPx(b), axisY - 34, toPx(b), axisY - 12]}
                          stroke={colors.muted} strokeWidth={1} dash={[3, 3]}/>
                    <Text x={toPx(a) - 50} y={axisY - 50} width={100} align="center" fontSize={11}
                          fill={colors.text}
                          text={aClosed ? `inf = min = ${fmt(a)}` : `inf = ${fmt(a)}`}/>
                    <Text x={toPx(b) - 50} y={axisY - 50} width={100} align="center" fontSize={11}
                          fill={colors.text}
                          text={bClosed ? `sup = max = ${fmt(b)}` : `sup = ${fmt(b)}`}/>

                    <Handle value={a} closed={aClosed} onMove={setA} lower/>
                    <Handle value={b} closed={bClosed} onMove={setB} lower={false}/>
                </Layer>
            </Stage>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-1 text-xs">
                <button type="button" onClick={() => setAClosed((c) => !c)}
                        className={cn("px-2.5 py-1 rounded border font-mono",
                            aClosed ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                : "border-border text-muted hover:bg-surface")}>
                    {aClosed ? "[ left closed" : "( left open"}
                </button>
                <button type="button" onClick={() => setBClosed((c) => !c)}
                        className={cn("px-2.5 py-1 rounded border font-mono",
                            bClosed ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                : "border-border text-muted hover:bg-surface")}>
                    {bClosed ? "right closed ]" : "right open )"}
                </button>
                <button type="button" onClick={preset(0, 1, false, false)}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface font-mono">
                    (0, 1)
                </button>
                <button type="button" onClick={preset(0, 1, true, true)}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface font-mono">
                    [0, 1]
                </button>
                <button type="button" onClick={preset(0, 1, true, false)}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface font-mono">
                    [0, 1)
                </button>
            </div>

            <p className="mt-2 text-sm text-center font-mono">{interval}</p>
            <p className="mt-1 text-xs text-muted text-center px-2">{setLabel}</p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {aClosed && bClosed
                    ? t("Both endpoints belong to A, so the minimum and the maximum exist and coincide with inf and sup.",
                        "두 끝점이 모두 A에 속하므로 최솟값과 최댓값이 존재하고, inf·sup과 값이 같다.")
                    : !aClosed && !bClosed
                        ? t("Neither endpoint belongs to A. The infimum and supremum still exist; the minimum and maximum do not.",
                            "두 끝점 모두 A에 속하지 않는다. inf와 sup은 그대로 존재하지만 최솟값과 최댓값은 없다.")
                        : aClosed
                            ? t("The left endpoint belongs to A, so the minimum exists. The maximum does not, even though the supremum does.",
                                "왼쪽 끝점이 A에 속하므로 최솟값은 존재한다. sup은 있지만 최댓값은 없다.")
                            : t("The right endpoint belongs to A, so the maximum exists. The minimum does not, even though the infimum does.",
                                "오른쪽 끝점이 A에 속하므로 최댓값은 존재한다. inf는 있지만 최솟값은 없다.")}
            </p>
        </div>
    );
};

export default SupInfExplorer;
