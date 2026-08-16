import {useMemo, useState} from "react";
import {Layer, Stage, Text} from "react-konva";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {fmt} from "../../2d/plane";
import MatrixGrid, {Cell} from "./MatrixGrid";

// LDLᵀ 는 LU 의 "양파 껍질 벗기기"를 대칭성이 깨지지 않게 다시 쓴 것이다. 한 걸음이
// M ← M − d·c·cᵀ 라서 벗겨 낸 행과 열이 동시에 0 이 된다. 그리고 그때 나오는 d 의 부호가
// 곧 3장의 positive definite 판정이다. 피벗이 음수로 나오는 순간을 눈으로 잡게 하는 것이
// 이 그림의 목적이다.
const N = 3;
const GAP = 26;
const TOP = 24;
const TOL = 1e-9;

interface Props {
    width?: number;
    height?: number;
}

type FrameKind = "start" | "pivot" | "column" | "peel" | "done";

interface Frame {
    kind: FrameKind;
    k: number;
    m: number[][];
    l: number[][];
    d: number[];
    // 이 단계까지 확정된 대각 성분의 개수. 아직 정해지지 않은 d 는 비워 둔다.
    known: number;
    // 피벗이 양수가 아니어서 positive definite 가 깨진 첫 위치. 없으면 -1.
    failAt: number;
}

const clone = (m: number[][]) => m.map((r) => [...r]);

function factor(input: number[][]): Frame[] {
    const m = clone(input);
    const l: number[][] = Array.from({length: N}, (_, i) =>
        Array.from({length: N}, (_, j) => (i === j ? 1 : 0)));
    const d = Array<number>(N).fill(0);
    let failAt = -1;

    const frames: Frame[] = [];
    const snap = (kind: FrameKind, k: number, known: number) =>
        frames.push({kind, k, m: clone(m), l: clone(l), d: [...d], known, failAt});

    snap("start", -1, 0);

    for (let k = 0; k < N; k++) {
        d[k] = m[k][k];
        if (d[k] <= TOL && failAt < 0) failAt = k;
        snap("pivot", k, k + 1);

        // 열 하나를 피벗으로 나눠 배수를 얻는다. 피벗이 0 이면 나눌 수 없으므로 그 방향은
        // 단위 벡터로 두고 넘어간다 (그 경우 M 은 이미 positive definite 가 아니다).
        const c = Array<number>(N).fill(0);
        c[k] = 1;
        if (Math.abs(d[k]) > TOL) {
            for (let i = k + 1; i < N; i++) c[i] = m[i][k] / d[k];
        }
        for (let i = k; i < N; i++) l[i][k] = c[i];
        snap("column", k, k + 1);

        if (Math.abs(d[k]) > TOL) {
            for (let i = k; i < N; i++) {
                for (let j = k; j < N; j++) m[i][j] -= d[k] * c[i] * c[j];
            }
        } else {
            // 피벗이 0 이면 그 행과 열만 지운다. 남은 성분이 0 이 아니라면 indefinite 다.
            for (let i = k; i < N; i++) {
                m[i][k] = 0;
                m[k][i] = 0;
            }
        }
        snap("peel", k, k + 1);
    }

    snap("done", -1, N);
    return frames;
}

const PRESETS: Array<[en: string, ko: string, number[][]]> = [
    ["worked example", "본문 예제", [[4, 2, -2], [2, 5, -1], [-2, -1, 5]]],
    ["covariance", "공분산", [[2, 1, 0], [1, 2, 1], [0, 1, 2]]],
    ["indefinite", "indefinite", [[1, 2, 0], [2, 1, 0], [0, 0, 1]]],
    ["semidefinite", "semidefinite", [[1, 1, 0], [1, 1, 0], [0, 0, 2]]],
];

const cellText = (v: number) => (Math.abs(v) < 5e-4 ? "0" : fmt(v, 2));

const CholeskySteps = ({width: fixedWidth, height}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;

    const [sym, setSym] = useState<number[][]>(PRESETS[0][2]);
    const [step, setStep] = useState(0);

    const frames = useMemo(() => factor(sym), [sym]);
    const at = Math.min(step, frames.length - 1);
    const f = frames[at];
    const last = frames[frames.length - 1];

    const cellW = Math.max(30, Math.min(52, Math.floor((width - 2 * GAP - 40) / (3 * N))));
    const cellH = 26;
    const gridW = N * cellW;
    const left = Math.max(10, (width - (3 * gridW + 2 * GAP)) / 2);
    const stageH = height ?? TOP + N * cellH + 26;

    const mCell = (i: number, j: number): Cell => {
        const peeled = f.kind === "done" ? true
            : f.kind === "peel" ? Math.min(i, j) <= f.k
                : f.k >= 0 && Math.min(i, j) < f.k;
        if (f.kind === "pivot" && i === f.k && j === f.k) {
            return {text: cellText(f.m[i][j]), tone: f.m[i][j] > TOL ? "pivot" : "bad"};
        }
        if (f.kind === "column" && j === f.k && i > f.k) return {text: cellText(f.m[i][j]), tone: "multiplier"};
        if (f.kind === "peel" && i > f.k && j > f.k) return {text: cellText(f.m[i][j]), tone: "changed"};
        return {text: cellText(f.m[i][j]), tone: peeled ? "dim" : "plain"};
    };

    const lCell = (i: number, j: number): Cell => {
        if (j > i) return {text: "0", tone: "dim"};
        if (j === i) return {text: "1", tone: "dim"};
        const justFilled = f.kind === "column" && j === f.k;
        return {text: cellText(f.l[i][j]), tone: justFilled ? "multiplier" : "plain"};
    };

    const dCell = (i: number, j: number): Cell => {
        if (i !== j) return {text: "0", tone: "dim"};
        if (i >= f.known) return {text: "?", tone: "dim"};
        const bad = f.d[i] <= TOL;
        const fresh = f.kind === "pivot" && i === f.k;
        return {text: cellText(f.d[i]), tone: bad ? "bad" : fresh ? "pivot" : "plain"};
    };

    const positiveDefinite = last.failAt < 0;
    const indefinite = last.d.some((v) => v < -TOL);
    // Sylvester 판정과 맞물린다. 선행 주소행렬식은 지금까지 나온 피벗들의 곱이다.
    const minors = last.d.map((_, i) => last.d.slice(0, i + 1).reduce((acc, v) => acc * v, 1));
    // Cholesky 인자 G = L·D^{1/2}. M = G·Gᵀ 는 D 가 모두 양수일 때만 실수 위에서 존재한다.
    const g = positiveDefinite
        ? last.l.map((row) => row.map((v, j) => v * Math.sqrt(last.d[j])))
        : null;

    const setEntry = (i: number, j: number, raw: string) => {
        const n = Number(raw);
        if (raw.trim() === "" || !Number.isFinite(n)) return;
        setSym((prev) => prev.map((row, ri) => row.map((v, ci) => {
            if (ri === i && ci === j) return n;
            // 대칭을 강제한다. 이 절의 정리는 전부 대칭 행렬에만 적용된다.
            if (ri === j && ci === i) return n;
            return v;
        })));
        setStep(0);
    };

    const CAPTIONS: Record<FrameKind, [string, string]> = {
        start: ["A symmetric matrix, nothing peeled yet. LDLT keeps the symmetry at every step, which is why it costs half of what a general LU costs.",
            "대칭 행렬이고 아직 아무것도 벗기지 않았다. LDLT는 매 단계에서 대칭을 유지하며, 그래서 일반 LU의 절반 비용으로 끝난다."],
        pivot: ["Read the top-left entry of the remaining block. That number is the next diagonal entry of D. Its sign is the whole test: positive definite means every one of these comes out positive, and you find out one at a time.",
            "남은 블록의 왼쪽 위 성분을 읽는다. 이 수가 D의 다음 대각 성분이다. 판정은 그 부호가 전부다. positive definite란 이 수들이 하나도 빠짐없이 양수로 나온다는 뜻이고, 한 번에 하나씩 밝혀진다."],
        column: ["Divide the column below the pivot by the pivot. Same move as LU, and the quotients become a column of L. Because the matrix is symmetric, the row above gets the same numbers for free.",
            "피벗 아래의 열을 피벗으로 나눈다. LU와 같은 동작이고 그 몫이 L의 한 열이 된다. 행렬이 대칭이라 위쪽 행은 같은 수를 공짜로 얻는다."],
        peel: ["Subtract the pivot times the outer product of the multiplier column with itself. That single symmetric rank-one piece clears a row and a column at once, and what is left is the Schur complement from Chapter 3. Peeling a symmetric matrix and taking a Schur complement are the same operation.",
            "피벗에 배수 열과 그 자신의 외적을 곱한 것을 뺀다. 이 대칭인 rank 1 조각 하나가 행과 열을 동시에 지우고, 남는 것이 3장의 Schur complement다. 대칭 행렬을 벗겨 내는 일과 Schur complement를 취하는 일은 같은 연산이다."],
        done: ["Everything is peeled, and the three factors on screen multiply back to the matrix you started with. If every entry of the diagonal factor is positive, take square roots and fold them into the triangular factor to get the Cholesky factor shown in the readout below.",
            "전부 벗겨졌고, 화면의 세 인자를 곱하면 출발한 행렬로 돌아온다. 대각 인자의 성분이 전부 양수라면 제곱근을 취해 삼각 인자에 흡수시킬 수 있고, 그것이 아래 판독 줄의 Cholesky 인자다."],
    };

    return (
        <div ref={ref} className="w-full">
            <Stage width={width} height={stageH} className="overflow-hidden w-fit h-fit">
                <Layer>
                    <MatrixGrid x={left} y={TOP} rows={N} cols={N} cell={mCell} colors={colors}
                                label={f.kind === "start" ? "M" : t("M peeled", "벗겨낸 M")}
                                cellW={cellW} cellH={cellH}/>
                    <MatrixGrid x={left + gridW + GAP} y={TOP} rows={N} cols={N} cell={lCell}
                                colors={colors} label="L" cellW={cellW} cellH={cellH}/>
                    <MatrixGrid x={left + 2 * (gridW + GAP)} y={TOP} rows={N} cols={N} cell={dCell}
                                colors={colors} label="D" cellW={cellW} cellH={cellH}/>

                    {f.kind !== "start" && f.kind !== "done" && (
                        <Text text={`${t("pivot", "피벗")} ${f.k + 1}`} x={left} y={4} fontSize={11}
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
                                setSym(preset);
                                setStep(0);
                            }}
                            className={cn("px-2.5 py-1 rounded border",
                                JSON.stringify(sym) === JSON.stringify(preset)
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {t(en, ko)}
                    </button>
                ))}
                <span className="grid grid-cols-3 gap-1 border-l-2 border-r-2 border-border rounded-[3px] px-1.5 py-1">
                    {sym.map((row, i) => row.map((v, j) => (
                        <input key={`${i}-${j}`} type="number" step={1} value={v}
                               aria-label={`M row ${i + 1} col ${j + 1}`}
                               readOnly={j < i} tabIndex={j < i ? -1 : undefined}
                               onChange={(e) => setEntry(i, j, e.target.value)}
                               className={cn(`w-12 px-1 py-0.5 rounded border border-border bg-surface
                                              text-center font-mono text-xs tabular-nums`,
                                   j < i && "opacity-60")}/>
                    )))}
                </span>
            </div>

            <p className="mt-2 text-sm text-center font-mono"
               style={{color: positiveDefinite ? colors.accent : "#f43f5e"}}>
                diag D = ({last.d.map((v) => fmt(v, 2)).join(", ")}) ·{" "}
                {positiveDefinite
                    ? t("M is positive definite", "M은 positive definite")
                    : indefinite
                        ? t("M is indefinite", "M은 indefinite")
                        : t("M is only positive semidefinite", "M은 positive semidefinite일 뿐")}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                {t("leading minors", "선행 주소행렬식")} = ({minors.map((v) => fmt(v, 2)).join(", ")})
                {g && ` · G = L·D^(1/2) = [${g.map((r) => r.map((v) => fmt(v, 2)).join(" ")).join(" ; ")}]`}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {t(...CAPTIONS[f.kind])}
            </p>
        </div>
    );
};

export default CholeskySteps;
