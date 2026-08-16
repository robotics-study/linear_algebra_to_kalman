import {useMemo, useState} from "react";
import {Circle, Group, Layer, Line, Stage, Text} from "react-konva";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {fmt} from "../../2d/plane";
import {svd} from "./svd";

// Example 4.4 는 AᵀAx̂ = Aᵀb 를 세워 놓고 곧바로 A = QR 로 갈아탄다. 왜 그래야 하는지는
// 교재가 말하지 않고 지나가는데, 이유는 하나다. AᵀA 를 만드는 순간 조건수가 제곱된다.
// 여기서 재는 오차는 흉내가 아니라 브라우저의 배정밀도 연산이 실제로 내놓는 값이다.
const NE = "#f59e0b";
const PAD = {left: 54, right: 16, top: 20, bottom: 34};
const CURVE_STEPS = 46;
// 배정밀도의 상대 오차 하한. 이보다 정확할 수는 없으므로 로그 축 바닥으로 쓴다.
const FLOOR = 1e-17;
const LOG_MIN = -11;
const LOG_MAX = -1;

interface Props {
    width?: number;
    height?: number;
}

// t 값이 서로 거의 붙어 있는 세 시점에서 직선 y = a + b·t 를 맞추는 문제.
// b 는 정확히 열공간 안에 있으므로 참값은 (1, 1) 이고, 어긋난 자릿수가 곧 알고리즘의 오차다.
const design = (eps: number): number[][] => [[1, 1], [1, 1 + eps], [1, 1 + 2 * eps]];
const rhs = (eps: number): number[] => [2, 2 + eps, 2 + 2 * eps];
const EXACT: [number, number] = [1, 1];

// AᵀA 를 실제로 만들고 2×2 를 Cramer 로 푼다. 교과서 그대로의 순진한 구현이며,
// 무너지는 지점을 보여 주는 것이 목적이므로 어떤 보정도 넣지 않는다.
function solveNormalEquations(a: number[][], b: number[]): [number, number] | null {
    let g11 = 0, g12 = 0, g22 = 0, r1 = 0, r2 = 0;
    for (let i = 0; i < a.length; i++) {
        g11 += a[i][0] * a[i][0];
        g12 += a[i][0] * a[i][1];
        g22 += a[i][1] * a[i][1];
        r1 += a[i][0] * b[i];
        r2 += a[i][1] * b[i];
    }
    const det = g11 * g22 - g12 * g12;
    if (det === 0) return null;
    return [(r1 * g22 - g12 * r2) / det, (g11 * r2 - r1 * g12) / det];
}

// Householder 반사로 만드는 QR. Theorem 4.2 의 증명은 Gram-Schmidt 로 존재성을 보이지만,
// 실제로 돌리는 것은 이쪽이다. 반사는 직교 변환이라 열의 길이를 건드리지 않고,
// AᵀA 를 한 번도 만들지 않으므로 조건수가 제곱되지 않는다.
function solveQr(a: number[][], b: number[]): [number, number] | null {
    const n = a.length;
    const m = a[0].length;
    const r = a.map((row) => [...row]);
    const c = [...b];

    for (let k = 0; k < m; k++) {
        let nrm = 0;
        for (let i = k; i < n; i++) nrm += r[i][k] * r[i][k];
        nrm = Math.sqrt(nrm);
        if (nrm === 0) continue;
        const v = Array<number>(n).fill(0);
        for (let i = k; i < n; i++) v[i] = r[i][k];
        v[k] += (r[k][k] >= 0 ? 1 : -1) * nrm;
        let vv = 0;
        for (let i = k; i < n; i++) vv += v[i] * v[i];
        if (vv === 0) continue;
        for (let j = k; j < m; j++) {
            let dot = 0;
            for (let i = k; i < n; i++) dot += v[i] * r[i][j];
            const f = (2 * dot) / vv;
            for (let i = k; i < n; i++) r[i][j] -= f * v[i];
        }
        let dotB = 0;
        for (let i = k; i < n; i++) dotB += v[i] * c[i];
        const fb = (2 * dotB) / vv;
        for (let i = k; i < n; i++) c[i] -= fb * v[i];
    }

    if (r[1][1] === 0 || r[0][0] === 0) return null;
    const x2 = c[1] / r[1][1];
    const x1 = (c[0] - r[0][1] * x2) / r[0][0];
    return [x1, x2];
}

const relError = (x: [number, number] | null): number => {
    if (!x) return Infinity;
    const e = Math.hypot(x[0] - EXACT[0], x[1] - EXACT[1]) / Math.hypot(EXACT[0], EXACT[1]);
    return Number.isFinite(e) ? Math.max(e, FLOOR) : Infinity;
};

const QrVsNormalEquations = ({width: fixedWidth, height = 300}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;

    const [logEps, setLogEps] = useState(-7);
    const eps = Math.pow(10, logEps);

    const samples = useMemo(() => {
        const out: Array<{logEps: number; ne: number; qr: number}> = [];
        for (let i = 0; i <= CURVE_STEPS; i++) {
            const le = LOG_MAX + ((LOG_MIN - LOG_MAX) * i) / CURVE_STEPS;
            const e = Math.pow(10, le);
            const a = design(e);
            const b = rhs(e);
            out.push({logEps: le, ne: relError(solveNormalEquations(a, b)), qr: relError(solveQr(a, b))});
        }
        return out;
    }, []);

    const a = design(eps);
    const b = rhs(eps);
    const neNow = solveNormalEquations(a, b);
    const qrNow = solveQr(a, b);
    const s = svd(a).s;
    const kappa = s[1] > 0 ? s[0] / s[1] : Infinity;

    const plotW = Math.max(120, width - PAD.left - PAD.right);
    const plotH = Math.max(90, height - PAD.top - PAD.bottom);
    const bottom = PAD.top + plotH;
    // 세로는 상대 오차(로그), 가로는 ε(로그). 오른쪽으로 갈수록 ε 이 작아지고 문제가 어려워진다.
    const hiY = 1;
    const loY = Math.log10(FLOOR);
    const yOf = (v: number) =>
        PAD.top + ((hiY - Math.log10(Math.min(Math.max(v, FLOOR), 10))) / (hiY - loY)) * plotH;
    const xOf = (le: number) => PAD.left + ((LOG_MAX - le) / (LOG_MAX - LOG_MIN)) * plotW;

    // 값이 Infinity 인 구간(AᵀA 가 정확히 특이해진 지점)은 곡선을 끊는다. 이어 그리면
    // 유한한 오차처럼 보여 거짓말이 된다.
    const segments = (key: "ne" | "qr"): number[][] => {
        const out: number[][] = [];
        let cur: number[] = [];
        for (const p of samples) {
            if (Number.isFinite(p[key])) {
                cur.push(xOf(p.logEps), yOf(p[key]));
            } else if (cur.length) {
                out.push(cur);
                cur = [];
            }
        }
        if (cur.length) out.push(cur);
        return out;
    };

    const yDecades: number[] = [];
    for (let e = 0; e >= Math.ceil(loY); e -= 4) yDecades.push(e);
    const xDecades: number[] = [];
    for (let e = LOG_MAX; e >= LOG_MIN + 1; e -= 2) xDecades.push(e);

    const neErr = relError(neNow);
    const qrErr = relError(qrNow);

    return (
        <div ref={ref} className="w-full">
            <Stage width={width} height={height} className="overflow-hidden w-fit h-fit">
                <Layer>
                    {yDecades.map((e) => (
                        <Group key={`y${e}`} listening={false}>
                            <Line points={[PAD.left, yOf(Math.pow(10, e)), PAD.left + plotW, yOf(Math.pow(10, e))]}
                                  stroke={colors.border} strokeWidth={1}/>
                            <Text text={`1e${e}`} x={0} y={yOf(Math.pow(10, e)) - 6} width={PAD.left - 8}
                                  align="right" fontSize={10} fontFamily="monospace" fill={colors.muted}/>
                        </Group>
                    ))}
                    {xDecades.map((e) => (
                        <Text key={`x${e}`} text={`1e${e}`} x={xOf(e) - 20} y={bottom + 7} width={40}
                              align="center" fontSize={10} fontFamily="monospace" fill={colors.muted}
                              listening={false}/>
                    ))}

                    <Line points={[PAD.left, PAD.top, PAD.left, bottom, PAD.left + plotW, bottom]}
                          stroke={colors.text} strokeWidth={1} listening={false}/>

                    {segments("ne").map((pts, i) => (
                        <Line key={`ne${i}`} points={pts} stroke={NE} strokeWidth={2.2} listening={false}/>
                    ))}
                    {segments("qr").map((pts, i) => (
                        <Line key={`qr${i}`} points={pts} stroke={colors.accent} strokeWidth={2.2}
                              listening={false}/>
                    ))}

                    <Line points={[xOf(logEps), PAD.top, xOf(logEps), bottom]} stroke={colors.muted}
                          strokeWidth={1} dash={[4, 4]} listening={false}/>
                    {Number.isFinite(neErr) && (
                        <Circle x={xOf(logEps)} y={yOf(neErr)} radius={5} fill={NE} listening={false}/>
                    )}
                    <Circle x={xOf(logEps)} y={yOf(qrErr)} radius={5} fill={colors.accent} listening={false}/>

                    <Text text={t("normal equations", "normal equation")} x={PAD.left + 10} y={PAD.top + 2}
                          fontSize={11} fontFamily="monospace" fill={NE} listening={false}/>
                    <Text text="QR" x={PAD.left + 10} y={PAD.top + 18} fontSize={11} fontFamily="monospace"
                          fill={colors.accent} listening={false}/>
                    <Text text={t("relative error of the solution", "해의 상대 오차")} x={PAD.left}
                          y={bottom + 20} width={plotW} align="center" fontSize={10} fontFamily="monospace"
                          fill={colors.muted} listening={false}/>
                </Layer>
            </Stage>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-20">eps = 1e{fmt(logEps, 1)}</span>
                    <input type="range" min={LOG_MIN} max={LOG_MAX} step={0.25} value={logEps}
                           aria-label={t("spacing of the sample times", "표본 시각의 간격")}
                           onChange={(e) => setLogEps(Number(e.target.value))}
                           className="w-40 accent-[var(--accent)] [direction:rtl]"/>
                </label>
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: colors.accent}}>
                cond A = {kappa.toExponential(2)} · cond AᵀA = {(kappa * kappa).toExponential(2)}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                {t("exact", "참값")} (1, 1) · QR ({fmt(qrNow?.[0] ?? NaN, 6)}, {fmt(qrNow?.[1] ?? NaN, 6)}) ·{" "}
                {neNow
                    ? `${t("normal eq", "normal eq")} (${fmt(neNow[0], 6)}, ${fmt(neNow[1], 6)})`
                    : t("normal eq: A^T A came out singular", "normal eq: AᵀA가 특이 행렬로 나왔다")}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {t("Three samples taken eps apart, fitted with a straight line. Both methods solve the same least squares problem, and both run in the same double precision. Forming A-transpose-A squares the condition number, so the orange curve loses two digits for every one the blue curve loses, and past eps = 1e-8 the product rounds to a singular matrix and the method stops returning an answer at all. Nothing is wrong with the normal equations as a theorem. They are a bad way to compute.",
                    "eps 간격으로 찍은 세 표본에 직선을 맞춘다. 두 방법은 같은 최소제곱 문제를 풀고, 같은 배정밀도 위에서 돈다. Gram 행렬을 만드는 순간 조건수가 제곱되므로 주황 곡선은 파랑 곡선이 한 자리 잃을 때 두 자리를 잃고, eps가 1e-8을 지나면 그 곱이 특이 행렬로 반올림되어 아예 답을 내놓지 못한다. 정리로서의 normal equation에는 아무 문제가 없다. 계산 방법으로 나쁠 뿐이다.")}
            </p>
        </div>
    );
};

export default QrVsNormalEquations;
