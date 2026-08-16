import {useState} from "react";
import {Line} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import {DragDot, fmt, makePlane} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";

// 최소제곱은 "잔차를 부분 공간에 직교시키는" 사영과 같은 문제다. 점을 끌면 normal equation 의
// 숫자가 그 자리에서 바뀌고, Aᵀe 가 계속 0 에 머무는 것이 그 사실의 실시간 증거다.
const RESID = "#f59e0b";  // 잔차 선. 두 테마 공통.

interface Props {
    width?: number;
    height?: number;
}

interface Pt {
    x: number;
    y: number;
}

const INITIAL: Pt[] = [
    {x: -1.8, y: -1.0},
    {x: -0.9, y: 0.4},
    {x: 0.1, y: 0.2},
    {x: 1.0, y: 1.1},
    {x: 1.9, y: 0.9},
];

// 정규 방정식 GᵀG… 가 아니라 G = AᵀA 를 직접 만든다. 열은 1, t, t², … 다.
function solveNormalEquations(pts: Pt[], deg: number) {
    const k = deg + 1;
    const G: number[][] = Array.from({length: k}, () => Array(k).fill(0));
    const beta: number[] = Array(k).fill(0);
    for (const p of pts) {
        const row: number[] = [];
        for (let i = 0; i < k; i++) row.push(Math.pow(p.x, i));
        for (let i = 0; i < k; i++) {
            beta[i] += row[i] * p.y;
            for (let j = 0; j < k; j++) G[i][j] += row[i] * row[j];
        }
    }
    // 가우스 소거. k 는 최대 3 이라 피벗 교환만으로 충분하다.
    const aug = G.map((r, i) => [...r, beta[i]]);
    for (let c = 0; c < k; c++) {
        let piv = c;
        for (let r = c + 1; r < k; r++) if (Math.abs(aug[r][c]) > Math.abs(aug[piv][c])) piv = r;
        if (Math.abs(aug[piv][c]) < 1e-12) return {G, beta, alpha: null};
        [aug[c], aug[piv]] = [aug[piv], aug[c]];
        for (let r = 0; r < k; r++) {
            if (r === c) continue;
            const f = aug[r][c] / aug[c][c];
            for (let j = c; j <= k; j++) aug[r][j] -= f * aug[c][j];
        }
    }
    const alpha = aug.map((r, i) => r[k] / aug[i][i]);
    return {G, beta, alpha};
}

const LeastSquaresLab = ({width: fixedWidth, height = 360}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;
    const plane = makePlane(width, height, 2.6, 2.0);

    const [pts, setPts] = useState<Pt[]>(INITIAL);
    const [deg, setDeg] = useState(1);

    const {G, beta, alpha} = solveNormalEquations(pts, deg);
    const evalFit = (x: number) =>
        alpha ? alpha.reduce((acc, a, i) => acc + a * Math.pow(x, i), 0) : 0;

    const curve: number[] = [];
    if (alpha) {
        const steps = 120;
        for (let i = 0; i <= steps; i++) {
            const xv = -plane.halfX + (2 * plane.halfX * i) / steps;
            const px = plane.px(xv, evalFit(xv));
            curve.push(px.x, px.y);
        }
    }

    const resid = pts.map((p) => p.y - evalFit(p.x));
    const sse = resid.reduce((acc, e) => acc + e * e, 0);
    // Aᵀe 의 각 성분. 사영이 맞다면 잔차는 A 의 모든 열과 직교하므로 전부 0 이어야 한다.
    const ate = Array.from({length: deg + 1}, (_, i) =>
        pts.reduce((acc, p, n) => acc + Math.pow(p.x, i) * resid[n], 0));

    const move = (i: number, u: Pt) => setPts((prev) => prev.map((p, n) => (n === i ? u : p)));

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                {alpha && <Line points={curve} stroke={colors.accent} strokeWidth={2.5} listening={false}/>}

                {/* 세로 잔차 막대. 최소제곱이 실제로 줄이는 양이 이 막대들의 제곱합이다. */}
                {alpha && pts.map((p, i) => {
                    const a = plane.px(p.x, p.y);
                    const b = plane.px(p.x, evalFit(p.x));
                    return <Line key={`r${i}`} points={[a.x, a.y, b.x, b.y]} stroke={RESID}
                                 strokeWidth={2} listening={false}/>;
                })}

                {pts.map((p, i) => (
                    <DragDot key={`p${i}`} plane={plane} x={p.x} y={p.y} color={colors.accent2}
                             fill={colors.bg} radius={6} onMove={(u) => move(i, u)}/>
                ))}
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {[1, 2].map((d) => (
                    <button key={d} type="button" onClick={() => setDeg(d)}
                            className={cn("px-2.5 py-1 rounded border font-mono",
                                deg === d
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {d === 1 ? t("line", "직선") : t("parabola", "포물선")}
                    </button>
                ))}
                <button type="button" onClick={() => setPts(INITIAL)}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {t("reset points", "점 되돌리기")}
                </button>
            </div>

            <div className="mt-2 flex flex-wrap items-start justify-center gap-x-6 gap-y-1
                            text-xs font-mono text-muted">
                <span>
                    G = AᵀA = [{G.map((r) => r.map((v) => fmt(v, 2)).join(" ")).join(" ; ")}]
                </span>
                <span>β = Aᵀb = [{beta.map((v) => fmt(v, 2)).join(" ")}]</span>
            </div>
            <p className="mt-1 text-sm text-center font-mono" style={{color: colors.accent}}>
                {alpha
                    ? `α̂ = [${alpha.map((v) => fmt(v, 3)).join("  ")}]  ·  ‖e‖² = ${fmt(sse, 3)}`
                    : t("G is singular: the columns are dependent", "G가 특이 행렬이다. 열이 종속이다")}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                Aᵀe = [{ate.map((v) => fmt(Math.abs(v) < 5e-4 ? 0 : v, 3)).join("  ")}]
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {t("Drag any point and watch two things: the fit moves, and the last readout stays at zero. The second one is the theorem. The best fit is not the curve that looks nicest, it is the one whose residual is orthogonal to every column of the design matrix.",
                    "점을 끌면서 두 가지를 보라. 곡선이 따라 움직이고, 마지막 판독 줄은 0에 머문다. 정리가 말하는 것은 두 번째다. 최선의 적합은 보기 좋은 곡선이 아니라, 잔차가 설계 행렬의 모든 열과 직교하는 곡선이다.")}
            </p>
        </div>
    );
};

export default LeastSquaresLab;
