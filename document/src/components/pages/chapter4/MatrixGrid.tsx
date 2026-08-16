import {Group, Line, Rect, Text} from "react-konva";
import {CanvasColors} from "../../../libs/useTheme";

// LU 와 Cholesky 그림은 둘 다 "행렬을 칸 단위로 뜯어 고치는" 과정을 보여 준다.
// 칸 하나가 방금 바뀌었는지, 피벗인지, 아직 손대지 않은 자리인지를 색으로 구분하는 것이
// 그림의 전부이므로, 그 렌더링을 한 군데에 모아 둔다.
export type Tone = "plain" | "dim" | "pivot" | "multiplier" | "changed" | "bad";

export interface Cell {
    text: string;
    tone?: Tone;
}

// 두 테마 공통 강조색. useCanvasColors 의 accent 계열과 부딪히지 않는 색만 쓴다.
const PIVOT = "#f59e0b";
const CHANGED = "#10b981";
const BAD = "#f43f5e";

const toneColor = (tone: Tone | undefined, colors: CanvasColors) => {
    switch (tone) {
        case "pivot":
            return PIVOT;
        case "multiplier":
            return colors.accent;
        case "changed":
            return CHANGED;
        case "bad":
            return BAD;
        case "dim":
            return colors.muted;
        default:
            return colors.text;
    }
};

interface MatrixGridProps {
    x: number;
    y: number;
    rows: number;
    cols: number;
    cell: (i: number, j: number) => Cell;
    colors: CanvasColors;
    label?: string;
    cellW?: number;
    cellH?: number;
    fontSize?: number;
}

// 좌우 대괄호 + 칸 격자로 행렬 하나를 그린다. 좌표는 왼쪽 위 모서리 기준이다.
const MatrixGrid = ({
                        x, y, rows, cols, cell, colors, label,
                        cellW = 54, cellH = 26, fontSize = 12,
                    }: MatrixGridProps) => {
    const w = cols * cellW;
    const h = rows * cellH;
    const arm = Math.min(8, cellW / 4);

    return (
        <Group x={x} y={y} listening={false}>
            {label && (
                <Text text={label} x={0} y={-19} width={w} align="center" fontSize={12}
                      fontStyle="bold" fontFamily="monospace" fill={colors.muted}/>
            )}

            {/* 대괄호. 행렬 하나가 어디서 끝나는지 눈으로 끊어 준다. */}
            <Line points={[-6 + arm, -4, -6, -4, -6, h + 4, -6 + arm, h + 4]}
                  stroke={colors.muted} strokeWidth={1.5}/>
            <Line points={[w + 6 - arm, -4, w + 6, -4, w + 6, h + 4, w + 6 - arm, h + 4]}
                  stroke={colors.muted} strokeWidth={1.5}/>

            {Array.from({length: rows}, (_, i) =>
                Array.from({length: cols}, (_, j) => {
                    const c = cell(i, j);
                    const fill = toneColor(c.tone, colors);
                    const highlighted = c.tone && c.tone !== "plain" && c.tone !== "dim";
                    return (
                        <Group key={`${i}-${j}`} x={j * cellW} y={i * cellH}>
                            {highlighted && (
                                <Rect x={1} y={1} width={cellW - 2} height={cellH - 2} cornerRadius={4}
                                      fill={fill} opacity={0.14}/>
                            )}
                            <Text text={c.text} width={cellW} height={cellH} align="center"
                                  verticalAlign="middle" fontSize={fontSize} fontFamily="monospace"
                                  fontStyle={highlighted ? "bold" : "normal"}
                                  fill={c.tone === "dim" ? colors.muted : fill}/>
                        </Group>
                    );
                }))}
        </Group>
    );
};

export default MatrixGrid;
