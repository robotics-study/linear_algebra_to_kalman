import {useMemo, useState} from "react";
import {Circle, Group, Layer, Line, Rect, Stage, Text} from "react-konva";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {fmt} from "../../2d/plane";
import {svd} from "./svd";

// 4.2.3 절의 요점은 "rank 가 판정이 아니라 판단이 된다"는 것이다. 특이값을 세로 막대로
// 세우고 문턱을 손으로 끌게 하면, 어디를 자르느냐에 따라 rank 가 4 도 되고 5 도 된다는
// 사실을 읽는 사람이 직접 만들어 보게 된다.
// 이 그림은 R² 평면이 아니라 로그 눈금 막대 그래프라 CoordinateCanvas 의 대칭 격자가 맞지 않는다.
// 축을 여기서 직접 그리는 이유가 그것이다.

// 정확히 0 인 특이값도 막대로 보이게 만드는 바닥. σ₁ 대비 이 비율 아래는 한 칸에 눌러 그린다.
const FLOOR = 1e-9;
const PAD = {left: 56, right: 18, top: 18, bottom: 36};

interface Props {
    width?: number;
    height?: number;
}

interface Preset {
    en: string;
    ko: string;
    matrix: number[][];
}

// 교재 4.2.3 의 5×5 예시 행렬. 인쇄된 숫자를 그대로 옮겼고, 계산된 특이값이
// 교재가 싣고 있는 [1.325e+02, 3.771e+01, 3.342e+01, 1.934e+01, 7.916e−01] 과 일치한다.
const NOTES_5X5 = [
    [-32.57514, -3.89996, -6.30185, -5.67305, -26.21851],
    [-36.21632, -11.13521, -38.80726, -16.86330, -1.42786],
    [-5.07732, -21.86599, -38.27045, -36.61390, -33.95078],
    [-36.51955, -38.28404, -19.40680, -31.67486, -37.34390],
    [-25.28365, -38.57919, -31.99765, -38.36343, -27.13790],
];

const PRESETS: Preset[] = [
    {en: "the notes' matrix", ko: "교재의 행렬", matrix: NOTES_5X5},
    {en: "Example 4.12", ko: "Example 4.12", matrix: [[1, 1e4], [0, 1]]},
    {en: "almost dependent", ko: "거의 종속", matrix: [[1, 0.999], [1, 1]]},
    {
        en: "exactly rank 2", ko: "정확히 rank 2",
        matrix: [[1, 2, 3, 4], [2, 4, 6, 8], [1, 0, -1, -2], [3, 2, 1, 0]],
    },
    {en: "well conditioned", ko: "조건수가 좋은 행렬", matrix: [[3, 0], [0, 2]]},
];

const SingularValueSpectrum = ({width: fixedWidth, height = 320}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;

    const [preset, setPreset] = useState(0);
    // 문턱은 로그 축 위에서 잡는다. 특이값이 몇 자릿수씩 벌어지는 예제가 이 절의 주인공이라
    // 선형 눈금으로는 작은 값이 아예 보이지 않는다.
    const [logDelta, setLogDelta] = useState<number | null>(null);

    const matrix = PRESETS[preset].matrix;
    const s = useMemo(() => svd(matrix).s, [preset]);

    const sMax = s[0];
    const shown = s.map((x) => Math.max(x, sMax * FLOOR));
    const hi = Math.log10(sMax) + 0.6;
    const lo = Math.log10(Math.min(...shown)) - 0.6;

    // 문턱의 기본값은 교재가 쓰는 기준(가장 큰 특이값의 1%)이다.
    const delta = Math.pow(10, logDelta ?? Math.log10(sMax) - 2);
    const rank = s.filter((x) => x > delta).length;

    const plotW = Math.max(120, width - PAD.left - PAD.right);
    const plotH = Math.max(80, height - PAD.top - PAD.bottom);
    const bottom = PAD.top + plotH;
    const yOf = (val: number) => PAD.top + ((hi - Math.log10(val)) / (hi - lo)) * plotH;
    const valueAt = (y: number) => Math.pow(10, hi - ((y - PAD.top) / plotH) * (hi - lo));

    const slot = plotW / s.length;
    const barW = Math.min(46, slot * 0.56);

    const decades: number[] = [];
    for (let e = Math.ceil(lo); e <= Math.floor(hi); e++) decades.push(e);

    const deltaY = yOf(Math.min(Math.max(delta, Math.pow(10, lo)), Math.pow(10, hi)));

    return (
        <div ref={ref} className="w-full">
            <Stage width={width} height={height} className="overflow-hidden w-fit h-fit">
                <Layer>
                    {decades.map((e) => (
                        <Group key={e}>
                            <Line points={[PAD.left, yOf(Math.pow(10, e)), PAD.left + plotW, yOf(Math.pow(10, e))]}
                                  stroke={colors.border} strokeWidth={1} listening={false}/>
                            <Text text={`1e${e}`} x={0} y={yOf(Math.pow(10, e)) - 6} width={PAD.left - 8}
                                  align="right" fontSize={10} fontFamily="monospace" fill={colors.muted}
                                  listening={false}/>
                        </Group>
                    ))}

                    <Line points={[PAD.left, PAD.top, PAD.left, bottom, PAD.left + plotW, bottom]}
                          stroke={colors.text} strokeWidth={1} listening={false}/>

                    {s.map((val, i) => {
                        const kept = val > delta;
                        const x = PAD.left + slot * (i + 0.5) - barW / 2;
                        const y = yOf(shown[i]);
                        return (
                            <Group key={i} listening={false}>
                                <Rect x={x} y={y} width={barW} height={Math.max(1, bottom - y)}
                                      fill={kept ? colors.accent : colors.muted}
                                      opacity={kept ? 0.85 : 0.3} cornerRadius={[3, 3, 0, 0]}/>
                                <Text text={val < 1e-3 ? val.toExponential(1) : fmt(val, 2)}
                                      x={x - slot * 0.22} y={y - 15} width={barW + slot * 0.44} align="center"
                                      fontSize={10} fontFamily="monospace"
                                      fill={kept ? colors.accent : colors.muted}/>
                                <Text text={`σ${i + 1}`} x={x - slot * 0.22} y={bottom + 7}
                                      width={barW + slot * 0.44} align="center" fontSize={11}
                                      fontFamily="monospace" fill={colors.muted}/>
                            </Group>
                        );
                    })}

                    {/* 문턱선. 세로로만 끌리게 묶어 두면 값 하나만 바뀌므로 조작이 헷갈리지 않는다. */}
                    <Group y={deltaY} draggable
                           dragBoundFunc={(pos) => ({
                               x: 0,
                               y: Math.min(bottom, Math.max(PAD.top, pos.y)),
                           })}
                           onDragMove={(e) => setLogDelta(Math.log10(valueAt(e.target.y())))}
                           onMouseEnter={(e) => {
                               const stage = e.target.getStage();
                               if (stage) stage.container().style.cursor = "ns-resize";
                           }}
                           onMouseLeave={(e) => {
                               const stage = e.target.getStage();
                               if (stage) stage.container().style.cursor = "default";
                           }}>
                        <Rect x={PAD.left} y={-9} width={plotW} height={18} opacity={0}/>
                        <Line points={[PAD.left, 0, PAD.left + plotW, 0]} stroke="#f59e0b" strokeWidth={2}
                              dash={[7, 5]}/>
                        <Circle x={PAD.left + plotW - 8} y={0} radius={6} fill="#f59e0b"/>
                        <Text text="δ" x={PAD.left + 6} y={-16} fontSize={12} fontStyle="bold"
                              fontFamily="monospace" fill="#f59e0b"/>
                    </Group>
                </Layer>
            </Stage>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {PRESETS.map((p, i) => (
                    <button key={p.en} type="button"
                            onClick={() => {
                                setPreset(i);
                                setLogDelta(null);
                            }}
                            className={cn("px-2.5 py-1 rounded border",
                                preset === i
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {t(p.en, p.ko)}
                    </button>
                ))}
                <button type="button" onClick={() => setLogDelta(null)}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {t("delta = 1% of the largest", "delta = 최대 특이값의 1%")}
                </button>
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: colors.accent}}>
                δ = {delta.toExponential(2)} · {t("numerical rank", "수치적 rank")} = {rank}
                {" · "}{t("nullity", "nullity")} = {matrix[0].length - rank}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                {/* 정확히 특이한 행렬에서도 Jacobi 는 0 대신 반올림 잔여를 남긴다. 그것을 그대로
                    나누면 1e+156 같은 무의미한 조건수가 찍히므로, 상대 기준 아래는 0 으로 읽는다. */}
                σ₁/σ<sub>min</sub> = {s[s.length - 1] > sMax * 1e-13
                ? (sMax / s[s.length - 1]).toExponential(2) : "∞"}
                {" · "}{t("nearest matrix of lower rank is", "rank가 더 낮은 가장 가까운 행렬까지")}{" "}
                {rank > 0 ? fmt(s[rank - 1], 4) : "0"} {t("away", "떨어져 있다")}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {t("Drag the dashed line. Bars above it count toward the rank, bars below are treated as noise. Nothing about the matrix changed, only where you chose to cut, which is exactly why rank stops being a yes-or-no question in floating point. The height of the last kept bar is how far the matrix sits from one of lower rank.",
                    "점선을 끌어 보라. 그 위의 막대는 rank로 세고, 아래 막대는 잡음으로 친다. 행렬은 하나도 바뀌지 않았고 어디서 자를지만 골랐을 뿐이다. 부동소수점에서 rank가 예/아니오 문제이기를 그만두는 이유가 바로 이것이다. 남긴 마지막 막대의 높이가 이 행렬이 더 낮은 rank의 행렬과 떨어진 거리다.")}
            </p>
        </div>
    );
};

export default SingularValueSpectrum;
