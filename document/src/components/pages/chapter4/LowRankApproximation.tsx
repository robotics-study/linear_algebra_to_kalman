import {useMemo, useState} from "react";
import {Circle, Group, Layer, Line, Rect, Stage, Text} from "react-konva";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {CanvasColors, useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {fmt} from "../../2d/plane";
import {rankKApprox, svd} from "./svd";

// A = Σ σᵢuᵢvᵢᵀ 에서 뒤쪽 항을 잘라 버리면 정확히 무엇을 잃는가. 숫자로만 보면
// "‖A − A_k‖ = σ_{k+1}" 한 줄이지만, 그림으로 보면 버린 항들이 무엇을 나르고 있었는지가 보인다.
// 그래서 원본 · 근사 · 차이 세 장을 나란히 놓는다. 차이 그림이 곧 버려진 σ 들의 내용물이다.
const N = 24;
const GAP = 18;
const LABEL_H = 16;
const CURVE_H = 96;

interface Props {
    width?: number;
    height?: number;
}

// 로봇의 거리 영상처럼 생긴 합성 장면. 바닥의 완만한 그라데이션과 가로 띠, 직사각형 블록은
// 값이 일정하거나 한 축으로만 변해서 각각 rank 1 이면 끝난다. 반면 원판은 중심에서의 거리로
// 음영이 변하는 방사 대칭 함수라 외적 몇 개로 적히지 않는다. 그래서 k 를 올릴 때 마지막까지
// 다듬어지는 부분이 원판이 되고, 버린 항이 무엇을 나르고 있었는지가 눈에 보인다.
const DISK = {row: 14.5, col: 16.5, radius: 5.5};

function scene(): number[][] {
    const out: number[][] = [];
    for (let i = 0; i < N; i++) {
        const row: number[] = [];
        for (let j = 0; j < N; j++) {
            let val = 0.12 + 0.42 * (j / (N - 1));
            if (i >= 3 && i <= 5) val = 0.86;
            if (i >= 10 && i <= 16 && j >= 2 && j <= 8) val = 0.92;
            const d = Math.hypot(i - DISK.row, j - DISK.col);
            if (d <= DISK.radius) val = 0.08 + 0.62 * (d / DISK.radius);
            // 화면 전체에 걸친 완만한 비네팅. 거리 함수는 두 축으로 분리되지 않으므로
            // 특이값이 한 자리에서 끊기지 않고 꼬리를 그리며 줄어든다 (실제 영상과 같은 모습).
            val += 0.13 * (1 - Math.hypot(i - 4, j - 20) / 34);
            row.push(val);
        }
        out.push(row);
    }
    return out;
}

const hexToRgb = (hex: string): [number, number, number] => {
    const h = hex.replace("#", "").trim();
    const full = h.length === 3 ? h.split("").map((ch) => ch + ch).join("") : h;
    const n = parseInt(full.slice(0, 6) || "000000", 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

// 배경색에서 본문색으로 보간한다. 밝은 테마에서는 흰 → 검정, 어두운 테마에서는 검정 → 흰
// 회색조가 되므로 두 테마 모두에서 같은 "값이 클수록 진하다" 규칙이 지켜진다.
const shade = (v: number, colors: CanvasColors) => {
    const lo = hexToRgb(colors.bg);
    const hi = hexToRgb(colors.text);
    const k = Math.min(1, Math.max(0, v));
    const mix = lo.map((c, i) => Math.round(c + (hi[i] - c) * k));
    return `rgb(${mix[0]},${mix[1]},${mix[2]})`;
};

const Heatmap = ({x, y, cell, data, label, colors, scale}: {
    x: number;
    y: number;
    cell: number;
    data: number[][];
    label: string;
    colors: CanvasColors;
    // 차이 그림은 값이 작아 그대로 그리면 새까맣게 나온다. 배율을 따로 준다.
    scale: (v: number) => number;
}) => (
    <Group x={x} y={y} listening={false}>
        <Text text={label} x={0} y={0} width={cell * N} align="center" fontSize={11}
              fontFamily="monospace" fill={colors.muted}/>
        {data.map((row, i) =>
            row.map((v, j) => (
                <Rect key={`${i}-${j}`} x={j * cell} y={LABEL_H + i * cell} width={cell} height={cell}
                      fill={shade(scale(v), colors)}/>
            )))}
        <Rect x={0} y={LABEL_H} width={cell * N} height={cell * N} stroke={colors.border} strokeWidth={1}/>
    </Group>
);

const LowRankApproximation = ({width: fixedWidth, height}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;

    const [k, setK] = useState(3);

    const A = useMemo(scene, []);
    const factored = useMemo(() => svd(A), [A]);
    const s = factored.s;

    const Ak = useMemo(() => rankKApprox(factored, k), [factored, k]);
    const diff = A.map((row, i) => row.map((v, j) => v - Ak[i][j]));

    // ‖A − A_k‖ = σ_{k+1} 은 정리가 보장하는 값이다. 굳이 다시 재는 이유는
    // 화면의 그림과 그 한 줄이 같은 수를 가리키는지 독자가 확인할 수 있게 하려는 것이다.
    const err = k < s.length ? s[k] : 0;
    const maxAbsDiff = Math.max(1e-9, ...diff.flat().map(Math.abs));

    const cell = Math.max(3, Math.floor((width - 2 * GAP - 12) / (3 * N)));
    const panelW = cell * N;
    const panelsW = 3 * panelW + 2 * GAP;
    const left = Math.max(6, (width - panelsW) / 2);
    const mapH = LABEL_H + panelW;
    const stageH = height ?? mapH + CURVE_H + 34;

    // 오차 곡선 (k 대 σ_{k+1}). 로그 눈금이라야 뒤쪽 항들이 얼마나 작은지 보인다.
    const curveTop = mapH + 26;
    const curveLeft = left + 26;
    const curveW = Math.max(80, panelsW - 26);
    const floorVal = Math.max(s[0] * 1e-6, 1e-12);
    const hi = Math.log10(s[0]) + 0.3;
    const lo = Math.log10(floorVal) - 0.3;
    const yOf = (val: number) =>
        curveTop + ((hi - Math.log10(Math.max(val, floorVal))) / (hi - lo)) * CURVE_H;
    const xOf = (idx: number) => curveLeft + (idx / N) * curveW;

    const curve: number[] = [];
    for (let i = 0; i <= N; i++) {
        curve.push(xOf(i), yOf(i < s.length ? s[i] : 0));
    }

    const stored = k * (2 * N + 1);
    const full = N * N;

    return (
        <div ref={ref} className="w-full">
            <Stage width={width} height={stageH} className="overflow-hidden w-fit h-fit">
                <Layer>
                    <Heatmap x={left} y={0} cell={cell} data={A} colors={colors}
                             label={t("A (original)", "A (원본)")} scale={(v) => v}/>
                    <Heatmap x={left + panelW + GAP} y={0} cell={cell} data={Ak} colors={colors}
                             label={`A_${k}  (rank ${k})`} scale={(v) => v}/>
                    <Heatmap x={left + 2 * (panelW + GAP)} y={0} cell={cell} data={diff} colors={colors}
                             label={t("A - A_k (discarded)", "A - A_k (버린 부분)")}
                             scale={(v) => Math.abs(v) / maxAbsDiff}/>

                    {/* 오차 곡선 */}
                    <Line points={[curveLeft, curveTop, curveLeft, curveTop + CURVE_H,
                        curveLeft + curveW, curveTop + CURVE_H]}
                          stroke={colors.text} strokeWidth={1} listening={false}/>
                    <Line points={curve} stroke={colors.accent} strokeWidth={2} listening={false}/>
                    <Circle x={xOf(k)} y={yOf(err)} radius={5} fill={colors.accent} listening={false}/>
                    <Text text={`|A-A_k| = ${err.toExponential(2)}`} x={curveLeft + 8} y={curveTop + 2}
                          fontSize={11} fontFamily="monospace" fill={colors.accent} listening={false}/>
                    <Text text="k" x={curveLeft + curveW - 14} y={curveTop + CURVE_H + 6} fontSize={11}
                          fontFamily="monospace" fill={colors.muted} listening={false}/>
                </Layer>
            </Stage>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {[1, 2, 3, 6, N].map((v) => (
                    <button key={v} type="button" onClick={() => setK(v)}
                            className={cn("px-2.5 py-1 rounded border font-mono",
                                k === v
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        k = {v}
                    </button>
                ))}
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-12">k = {k}</span>
                    <input type="range" min={1} max={N} step={1} value={k}
                           aria-label={t("number of terms kept", "남기는 항의 개수")}
                           onChange={(e) => setK(Number(e.target.value))}
                           className="w-32 accent-[var(--accent)]"/>
                </label>
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: colors.accent}}>
                σ<sub>k+1</sub> = {err.toExponential(3)} · ‖A - A<sub>k</sub>‖/‖A‖ = {fmt(err / s[0], 4)}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                {t("numbers stored", "저장하는 수")}: {stored} / {full} = {fmt((100 * stored) / full, 1)}%
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {t("Raise k and watch the third panel empty out. The flat background and the two rectangles are gone after a handful of terms, because a constant block is exactly a rank-one matrix. The round object is the last thing to arrive: a curved edge cannot be written as a few outer products, and every term you cut is stored in that panel. The dot on the curve is the error, and the theorem says it equals the first singular value you threw away.",
                    "k를 올리면서 세 번째 판이 비어 가는 것을 보라. 평평한 배경과 직사각형 둘은 몇 항 만에 사라진다. 값이 일정한 블록은 정확히 rank 1 행렬이기 때문이다. 마지막까지 남는 것은 둥근 물체다. 굽은 경계는 외적 몇 개로 적히지 않으며, 잘라 낸 항은 전부 저 판에 담긴다. 곡선 위의 점이 오차이고, 정리는 그것이 버린 첫 특이값과 같다고 말한다.")}
            </p>
        </div>
    );
};

export default LowRankApproximation;
