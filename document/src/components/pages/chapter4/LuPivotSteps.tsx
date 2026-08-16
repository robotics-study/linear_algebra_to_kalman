import {useMemo, useState} from "react";
import {Arrow, Layer, Stage, Text} from "react-konva";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {fmt} from "../../2d/plane";
import MatrixGrid, {Cell, Tone} from "./MatrixGrid";

// Theorem 4.22 는 P·A = L·U 가 늘 존재한다고만 말한다. 실제로 계산할 때 P 가 어디서
// 나오는지, L 에 들어가는 수가 무엇인지는 소거 과정을 한 걸음씩 따라가야 보인다.
// 그래서 피벗 선택 → 행 교환 → 배수 저장의 세 동작을 각각 한 프레임으로 끊어 놓는다.
const N = 3;
const GAP = 26;
const TOP = 24;
const TOL = 1e-12;

interface Props {
    width?: number;
    height?: number;
}

type FrameKind = "start" | "pivot" | "swap" | "eliminate" | "done";

interface Frame {
    kind: FrameKind;
    col: number;
    perm: number[];
    l: number[][];
    u: number[][];
    // 이번 열에서 고른 피벗 행과, 그것이 원래 있던 자리에서 옮겨 온 여부.
    pivotRow: number;
    swapped: boolean;
    // 이번 소거에서 L 에 적어 넣은 배수들의 행 번호.
    filled: number[];
    singular: boolean;
}

const clone = (m: number[][]) => m.map((r) => [...r]);

// 부분 피벗을 쓰는 가우스 소거. 각 동작이 끝날 때마다 상태를 통째로 복사해 프레임으로 남긴다.
function eliminate(a: number[][]): Frame[] {
    const u = clone(a);
    const l: number[][] = Array.from({length: N}, (_, i) =>
        Array.from({length: N}, (_, j) => (i === j ? 1 : 0)));
    const perm = Array.from({length: N}, (_, i) => i);
    let singular = false;

    const frames: Frame[] = [];
    const snap = (kind: FrameKind, col: number, pivotRow: number, swapped: boolean, filled: number[]) =>
        frames.push({kind, col, perm: [...perm], l: clone(l), u: clone(u), pivotRow, swapped, filled, singular});

    snap("start", -1, -1, false, []);

    for (let k = 0; k < N - 1; k++) {
        // 부분 피벗: 남은 행 중 절댓값이 가장 큰 것을 고른다. 0 으로 나누는 것을 피할 뿐 아니라
        // 배수의 크기를 1 이하로 묶어 반올림 오차가 증폭되지 않게 한다.
        let piv = k;
        for (let i = k + 1; i < N; i++) if (Math.abs(u[i][k]) > Math.abs(u[piv][k])) piv = i;
        snap("pivot", k, piv, false, []);

        if (piv !== k) {
            [u[k], u[piv]] = [u[piv], u[k]];
            [perm[k], perm[piv]] = [perm[piv], perm[k]];
            // 이미 확정된 배수들도 함께 따라가야 한다. L 의 k 열 앞부분만 교환하는 이유다.
            for (let j = 0; j < k; j++) [l[k][j], l[piv][j]] = [l[piv][j], l[k][j]];
        }
        // pivotRow 로 교환 상대를 그대로 남긴다. 화살표와 강조가 "어느 두 행이 바뀌었는지"를
        // 가리켜야 하므로 교환 후의 위치(k)가 아니라 끌어온 행의 원래 위치가 필요하다.
        snap("swap", k, piv, piv !== k, []);

        const filled: number[] = [];
        if (Math.abs(u[k][k]) < TOL) {
            singular = true;
        } else {
            for (let i = k + 1; i < N; i++) {
                const mult = u[i][k] / u[k][k];
                l[i][k] = mult;
                for (let j = k; j < N; j++) u[i][j] -= mult * u[k][j];
                filled.push(i);
            }
        }
        snap("eliminate", k, k, false, filled);
    }

    if (Math.abs(u[N - 1][N - 1]) < TOL) singular = true;
    snap("done", -1, -1, false, []);
    return frames;
}

const PRESETS: Array<[en: string, ko: string, number[][]]> = [
    ["Example 4.23", "Example 4.23", [[-2, -4, -6], [-2, 1, -4], [-2, 11, -4]]],
    ["Example 4.18", "Example 4.18", [[1, 4, 5], [2, 9, 17], [3, 18, 58]]],
    ["zero pivot", "피벗이 0", [[0, 1, 1], [1, 0, 1], [1, 1, 0]]],
    ["singular", "특이 행렬", [[1, 2, 3], [2, 4, 6], [1, 1, 1]]],
];

const cellText = (v: number) => (Math.abs(v) < 5e-4 ? "0" : fmt(v, 2));

const LuPivotSteps = ({width: fixedWidth, height}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;

    const [a, setA] = useState<number[][]>(PRESETS[0][2]);
    const [step, setStep] = useState(0);

    const frames = useMemo(() => eliminate(a), [a]);
    const at = Math.min(step, frames.length - 1);
    const f = frames[at];

    const cellW = Math.max(30, Math.min(52, Math.floor((width - 2 * GAP - 40) / (3 * N))));
    const cellH = 26;
    const gridW = N * cellW;
    const left = Math.max(10, (width - (3 * gridW + 2 * GAP)) / 2);
    const stageH = height ?? TOP + N * cellH + 26;

    const pCell = (i: number, j: number): Cell => ({
        text: f.perm[i] === j ? "1" : "0",
        tone: f.perm[i] === j ? (f.kind === "swap" && f.swapped ? "changed" : "plain") : "dim",
    });

    const lCell = (i: number, j: number): Cell => {
        if (j > i) return {text: "0", tone: "dim"};
        if (j === i) return {text: "1", tone: "dim"};
        const justFilled = f.kind === "eliminate" && j === f.col && f.filled.includes(i);
        return {text: cellText(f.l[i][j]), tone: justFilled ? "multiplier" : "plain"};
    };

    const uCell = (i: number, j: number): Cell => {
        let tone: Tone = "plain";
        if (j < i && Math.abs(f.u[i][j]) < 5e-4) tone = "dim";
        if (f.kind === "pivot" && j === f.col && i >= f.col) tone = i === f.pivotRow ? "pivot" : "dim";
        if (f.kind === "swap" && f.swapped && (i === f.col || i === f.pivotRow)) tone = "changed";
        if (f.kind === "eliminate" && f.filled.includes(i) && j >= f.col) tone = "changed";
        if (f.singular && f.kind === "done" && i === j && Math.abs(f.u[i][j]) < TOL) tone = "bad";
        return {text: cellText(f.u[i][j]), tone};
    };

    // 검산: P·A 와 L·U 가 같아야 한다. 마지막 프레임에서만 의미가 있다.
    const residual = useMemo(() => {
        const last = frames[frames.length - 1];
        let worst = 0;
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                let lu = 0;
                for (let p = 0; p < N; p++) lu += last.l[i][p] * last.u[p][j];
                worst = Math.max(worst, Math.abs(a[last.perm[i]][j] - lu));
            }
        }
        return worst;
    }, [frames, a]);

    const CAPTIONS: Record<FrameKind, [string, string]> = {
        start: ["The row order is the identity and nothing has been eliminated. L starts as the identity, U as a copy of A.",
            "행 순서는 항등이고 아직 아무것도 소거하지 않았다. L은 단위 행렬로, U는 A의 복사본으로 시작한다."],
        pivot: ["Look down the current column and pick the entry of largest magnitude. That is partial pivoting. It is not only about avoiding a zero divisor: choosing the largest keeps every multiplier at most one in size, so rounding errors do not get amplified on the way down.",
            "지금 열을 아래로 훑어 절댓값이 가장 큰 성분을 고른다. 이것이 partial pivoting이다. 0으로 나누는 것을 피하려는 것만이 아니다. 가장 큰 것을 고르면 배수가 전부 크기 1 이하로 묶여 반올림 오차가 아래로 내려가며 증폭되지 않는다."],
        swap: ["Swap that row up. The swap is recorded in the permutation on the left, and the multipliers already stored in the lower factor travel with their row. That bookkeeping is the whole reason the theorem carries a permutation at all.",
            "그 행을 위로 올려 교환한다. 교환은 왼쪽의 순열 행렬에 기록되고, 아래 삼각 인자에 이미 저장된 배수들도 자기 행을 따라 함께 움직인다. 정리에 순열이 붙어 있는 이유가 통째로 이 장부 정리다."],
        eliminate: ["Divide each entry below the pivot by the pivot. Those quotients are the multipliers, and they are not thrown away: each one is written into L at exactly the position it just cleared. Subtracting the scaled pivot row zeroes the column.",
            "피벗 아래의 각 성분을 피벗으로 나눈다. 그 몫이 배수이며, 버려지지 않는다. 방금 지운 그 자리에 그대로 L에 적힌다. 배수를 곱한 피벗 행을 빼면 열이 0이 된다."],
        done: ["The right factor is upper triangular, the middle one is uni-lower triangular, and the left one records which rows moved. Solving a linear system is now two triangular solves: forward substitution against the lower factor, then back substitution against the upper one.",
            "오른쪽 인자는 upper triangular, 가운데는 uni-lower triangular이고, 왼쪽은 어느 행이 움직였는지를 기록한다. 이제 선형 계를 푸는 일은 삼각 풀이 두 번이다. 아래 삼각 인자에 forward substitution을 하고, 이어서 위 삼각 인자에 back substitution을 한다."],
    };

    const setEntry = (i: number, j: number, raw: string) => {
        const n = Number(raw);
        if (raw.trim() === "" || !Number.isFinite(n)) return;
        setA((prev) => prev.map((row, ri) => row.map((v, ci) => (ri === i && ci === j ? n : v))));
        setStep(0);
    };

    return (
        <div ref={ref} className="w-full">
            <Stage width={width} height={stageH} className="overflow-hidden w-fit h-fit">
                <Layer>
                    <MatrixGrid x={left} y={TOP} rows={N} cols={N} cell={pCell} colors={colors}
                                label="P" cellW={cellW} cellH={cellH}/>
                    <MatrixGrid x={left + gridW + GAP} y={TOP} rows={N} cols={N} cell={lCell}
                                colors={colors} label="L" cellW={cellW} cellH={cellH}/>
                    <MatrixGrid x={left + 2 * (gridW + GAP)} y={TOP} rows={N} cols={N} cell={uCell}
                                colors={colors} label="U" cellW={cellW} cellH={cellH}/>

                    {/* 교환이 일어난 프레임에서만 두 행 사이에 화살표를 그려 무엇이 무엇과 바뀌었는지 보인다. */}
                    {f.kind === "swap" && f.swapped && (
                        <Arrow points={[
                            left + 2 * (gridW + GAP) - 12, TOP + f.col * cellH + cellH / 2,
                            left + 2 * (gridW + GAP) - 12, TOP + f.pivotRow * cellH + cellH / 2,
                        ]} stroke="#10b981" fill="#10b981" strokeWidth={2} pointerLength={7}
                               pointerWidth={7} pointerAtBeginning listening={false}/>
                    )}

                    {f.kind !== "start" && f.kind !== "done" && (
                        <Text text={`${t("column", "열")} ${f.col + 1}`} x={left} y={4} fontSize={11}
                              fontFamily="monospace" fill={colors.muted} listening={false}/>
                    )}
                </Layer>
            </Stage>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <button type="button" onClick={() => setStep((v) => Math.max(0, v - 1))}
                        disabled={at === 0}
                        className="px-3 py-1 rounded border border-border bg-surface font-semibold
                                   hover:border-[var(--accent)] disabled:opacity-40">
                    {t("back", "이전")}
                </button>
                <span className="px-2.5 py-1 rounded border border-border font-mono text-muted">
                    {t("step", "단계")} {at} / {frames.length - 1}
                </span>
                <button type="button" onClick={() => setStep((v) => Math.min(frames.length - 1, v + 1))}
                        disabled={at === frames.length - 1}
                        className="px-3 py-1 rounded border border-border bg-surface font-semibold
                                   hover:border-[var(--accent)] disabled:opacity-40">
                    {t("next step", "다음 단계")}
                </button>
                <button type="button" onClick={() => setStep(0)}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {t("restart", "처음으로")}
                </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {PRESETS.map(([en, ko, preset]) => (
                    <button key={en} type="button"
                            onClick={() => {
                                setA(preset);
                                setStep(0);
                            }}
                            className={cn("px-2.5 py-1 rounded border",
                                JSON.stringify(a) === JSON.stringify(preset)
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {t(en, ko)}
                    </button>
                ))}
                <span className="grid grid-cols-3 gap-1 border-l-2 border-r-2 border-border rounded-[3px] px-1.5 py-1">
                    {a.map((row, i) => row.map((v, j) => (
                        <input key={`${i}-${j}`} type="number" step={1} value={v}
                               aria-label={`A row ${i + 1} col ${j + 1}`}
                               onChange={(e) => setEntry(i, j, e.target.value)}
                               className="w-12 px-1 py-0.5 rounded border border-border bg-surface
                                          text-center font-mono text-xs tabular-nums"/>
                    )))}
                </span>
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: colors.accent}}>
                {t("row order", "행 순서")} = ({f.perm.map((p) => p + 1).join(", ")})
                {" · "}det A = {fmt(determinant(a), 3)}
                {" · "}max|PA - LU| = {residual.toExponential(1)}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {frames[frames.length - 1].singular && f.kind === "done"
                    ? t("A pivot came out zero, so U has a zero on its diagonal and A is singular. The factorization still exists, which is the point of Theorem 4.22: it asks nothing of A. What fails is the solve afterwards, not the factoring.",
                        "피벗 하나가 0으로 나와 U의 대각에 0이 남았고, A는 특이 행렬이다. 그래도 분해 자체는 존재한다. Theorem 4.22가 A에 아무 조건도 걸지 않는다는 것이 이 뜻이다. 무너지는 것은 그다음의 풀이이지 분해가 아니다.")
                    : t(...CAPTIONS[f.kind])}
            </p>
        </div>
    );
};

// 3×3 행렬식. 소거가 끝난 U 의 대각곱과 부호가 맞는지 독자가 대조할 수 있도록 함께 보여 준다.
function determinant(m: number[][]): number {
    return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
        - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
        + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
}

export default LuPivotSteps;
