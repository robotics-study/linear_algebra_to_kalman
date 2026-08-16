import {useMemo, useState} from "react";
import {Circle, Layer, Line, Rect, Stage, Text} from "react-konva";
import {fmt} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {
    basinOf, CRITICAL, cubic, cubicPrime, newtonOrbit, newtonStep, RootLabel, TWO_CYCLE,
} from "./analysis";

// Newton-Raphson 은 "빠르다"로 소개되지만 정작 중요한 말은 "국소적"이다. f(x) = x^3 - x 처럼
// 뿌리가 셋인 함수에서 시작점을 조금만 옮기면 도착하는 뿌리가 바뀐다. 아래 띠는 시작점을
// 도착한 뿌리의 색으로 칠한 것이고, 1/sqrt(5) 근처에서 색이 잘게 갈라진다.
const PAD = {left: 40, right: 14, top: 12, bottom: 16};
const BASIN_H = 34;
const X_MIN = -2;
const X_MAX = 2;
const Y_MIN = -1.6;
const Y_MAX = 1.6;
const STEPS = 8;

const ROOT_COLOR: Record<RootLabel, string> = {
    "-1": "#f59e0b",
    "0": "#8b5cf6",
    "+1": "#06b6d4",
    none: "#ef4444",
};

interface Props {
    width?: number;
    height?: number;
}

const NewtonBasins = ({width: fixedWidth, height = 400}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;

    // 임계점 1/sqrt(3) 바로 오른쪽에서 시작한다. 접선이 거의 수평이라 첫 걸음이 화면 밖까지
    // 튀어 나갔다가 돌아오는데, 그것이 "국소적"이라는 말의 뜻이다.
    const [x0, setX0] = useState(0.6);
    const [step, setStep] = useState(0);

    const plotW = Math.max(140, width - PAD.left - PAD.right);
    const plotH = Math.max(120, height - PAD.top - PAD.bottom - BASIN_H - 26);
    const basinTop = PAD.top + plotH + 22;

    const sx = (x: number) => PAD.left + ((x - X_MIN) / (X_MAX - X_MIN)) * plotW;
    const sy = (y: number) => PAD.top + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * plotH;

    const curve = useMemo(() => {
        const pts: number[] = [];
        for (let i = 0; i <= 400; i++) {
            const x = X_MIN + ((X_MAX - X_MIN) * i) / 400;
            pts.push(sx(x), sy(cubic(x)));
        }
        return pts;
    }, [plotW, plotH]);

    // 시작점 축을 픽셀 단위로 훑어 색칠한다. 화면 해상도만큼만 계산하므로 줌해도 비용이 일정하다.
    const basins = useMemo(() => {
        const n = Math.max(60, Math.round(plotW));
        const labels: RootLabel[] = [];
        for (let i = 0; i < n; i++) {
            labels.push(basinOf(X_MIN + ((X_MAX - X_MIN) * i) / n));
        }
        // 같은 뿌리로 가는 이웃 픽셀을 한 사각형으로 묶는다. 색이 바뀌는 자리가 곧 basin 경계다.
        const cols: Array<{x: number; w: number; color: string}> = [];
        let runStart = 0;
        for (let i = 1; i <= n; i++) {
            if (i === n || labels[i] !== labels[runStart]) {
                cols.push({
                    x: PAD.left + (runStart / n) * plotW,
                    w: Math.max(1, ((i - runStart) / n) * plotW),
                    color: ROOT_COLOR[labels[runStart]],
                });
                runStart = i;
            }
        }
        return cols;
    }, [plotW]);

    const orbit = useMemo(() => newtonOrbit(x0, STEPS), [x0]);
    const shown = orbit.slice(0, step + 1);
    const current = shown[shown.length - 1];
    const landed = basinOf(x0);
    const slope = cubicPrime(current);
    const nextX = newtonStep(current);

    // 현재 점의 접선. y = f(x_k) + f'(x_k)(x - x_k) 이고 x 절편이 다음 x_k+1 이다.
    const tangent = (() => {
        if (nextX === null) return null;
        const fx = cubic(current);
        const a = X_MIN;
        const b = X_MAX;
        return [sx(a), sy(fx + slope * (a - current)), sx(b), sy(fx + slope * (b - current))];
    })();

    const clampX = (v: number) => Math.min(X_MAX, Math.max(X_MIN, v));

    return (
        <div ref={ref} className="w-full">
            <Stage width={width} height={height} className="overflow-hidden w-fit h-fit">
                <Layer>
                    {/* 축 */}
                    <Line points={[PAD.left, sy(0), PAD.left + plotW, sy(0)]} stroke={colors.border}
                          strokeWidth={1} listening={false}/>
                    <Line points={[sx(0), PAD.top, sx(0), PAD.top + plotH]} stroke={colors.border}
                          strokeWidth={1} listening={false}/>
                    {/* 세 뿌리 */}
                    {[-1, 0, 1].map((r) => (
                        <Circle key={r} x={sx(r)} y={sy(0)} radius={4}
                                fill={ROOT_COLOR[(r === 0 ? "0" : r < 0 ? "-1" : "+1") as RootLabel]}
                                listening={false}/>
                    ))}
                    {/* f'(x) = 0 인 두 임계점. 접선이 수평이라 걸음이 정의되지 않는 자리다. */}
                    {[-CRITICAL, CRITICAL].map((c) => (
                        <Line key={c} points={[sx(c), PAD.top, sx(c), PAD.top + plotH]}
                              stroke={colors.muted} strokeWidth={1} dash={[2, 4]} opacity={0.55}
                              listening={false}/>
                    ))}
                    <Line points={curve} stroke={colors.text} strokeWidth={2} listening={false}/>

                    {tangent && (
                        <Line points={tangent} stroke={colors.accent2} strokeWidth={1.4} dash={[5, 4]}
                              opacity={0.9} listening={false}/>
                    )}
                    {/* 걸어온 자취: 곡선 위의 점에서 수직으로 내려와 접선을 따라 x 축의 다음 점으로. */}
                    {shown.map((x, i) => (
                        <Line key={`v${i}`} points={[sx(x), sy(0), sx(x), sy(cubic(x))]}
                              stroke={colors.accent} strokeWidth={1} dash={[3, 3]} opacity={0.55}
                              listening={false}/>
                    ))}
                    {shown.map((x, i) => (
                        <Circle key={`p${i}`} x={sx(x)} y={sy(cubic(x))} radius={i === shown.length - 1 ? 5 : 3}
                                fill={colors.accent} opacity={i === shown.length - 1 ? 1 : 0.5}
                                listening={false}/>
                    ))}
                    <Circle x={sx(clampX(current))} y={sy(0)} radius={5} fill={colors.bg}
                            stroke={colors.accent} strokeWidth={2.5} listening={false}/>

                    <Text text="f(x) = x³ − x" x={PAD.left + 6} y={PAD.top + 2} fontSize={11}
                          fontFamily="monospace" fill={colors.text} listening={false}/>

                    {/* 시작점 띠. 클릭하면 그 자리에서 다시 시작한다. */}
                    {basins.map((b, i) => (
                        <Rect key={i} x={b.x} y={basinTop} width={b.w} height={BASIN_H} fill={b.color}
                              opacity={0.75} listening={false}/>
                    ))}
                    <Rect x={PAD.left} y={basinTop} width={plotW} height={BASIN_H}
                          onMouseDown={(e) => {
                              const pos = e.target.getStage()?.getPointerPosition();
                              if (!pos) return;
                              setX0(clampX(X_MIN + ((pos.x - PAD.left) / plotW) * (X_MAX - X_MIN)));
                              setStep(0);
                          }}
                          onMouseEnter={(e) => {
                              const stage = e.target.getStage();
                              if (stage) stage.container().style.cursor = "crosshair";
                          }}
                          onMouseLeave={(e) => {
                              const stage = e.target.getStage();
                              if (stage) stage.container().style.cursor = "default";
                          }}/>
                    <Line points={[sx(clampX(x0)), basinTop - 4, sx(clampX(x0)), basinTop + BASIN_H + 4]}
                          stroke={colors.text} strokeWidth={2} listening={false}/>
                    <Text text={t("start x₀ (click to move)", "시작점 x₀ (눌러서 이동)")}
                          x={PAD.left} y={basinTop + BASIN_H + 5} width={plotW} align="center"
                          fontSize={10} fontFamily="monospace" fill={colors.muted} listening={false}/>
                </Layer>
            </Stage>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <button type="button" onClick={() => setStep((v) => Math.min(orbit.length - 1, v + 1))}
                        disabled={step >= orbit.length - 1}
                        className="px-3 py-1 rounded border border-border bg-surface font-semibold
                                   hover:border-[var(--accent)] disabled:opacity-40">
                    {t("one Newton step", "Newton 한 걸음")}
                </button>
                <button type="button" onClick={() => setStep(0)}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {t("restart", "처음으로")}
                </button>
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-20">x₀ = {fmt(x0, 3)}</span>
                    <input type="range" min={X_MIN} max={X_MAX} step={0.001} value={x0}
                           aria-label={t("starting point", "시작점")}
                           onChange={(e) => { setX0(Number(e.target.value)); setStep(0); }}
                           className="w-32 accent-[var(--accent)]"/>
                </label>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {([["0.400", 0.4], ["0.447214", TWO_CYCLE], ["0.450", 0.45], ["0.460", 0.46],
                    ["0.600", 0.6]] as Array<[string, number]>).map(([label, v]) => (
                    <button key={label} type="button"
                            onClick={() => { setX0(v); setStep(0); }}
                            className={cn("px-2.5 py-1 rounded border font-mono",
                                Math.abs(x0 - v) < 1e-6
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {label}
                    </button>
                ))}
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: ROOT_COLOR[landed]}}>
                x<sub>{step}</sub> = {fmt(current, 6)} · f(x<sub>{step}</sub>) = {fmt(cubic(current), 6)}
                {" · "}f′ = {fmt(slope, 4)} · {t("lands on", "도착")} {landed === "none" ? t("no root", "뿌리 없음") : landed}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                {t("orbit", "궤도")}: {orbit.slice(0, 6).map((v) => fmt(v, 4)).join(" → ")}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {t("The colour of the strip is the root you land on, and it is not three clean blocks. Newton sends 0.447214 to its own negative and back forever, a cycle it never escapes, so starting points crowding in on that value get thrown to whichever root the next bounce happens to favour. Move the start from 0.447 to 0.450 to 0.460 and the answer goes 0, then -1, then +1, on steps of three thousandths. Convergence here is local: the theorem promises a ball around a root, and says nothing at all about the point you actually started from.",
                    "띠의 색은 도착하는 뿌리이고, 깔끔한 세 덩어리가 아니다. Newton은 0.447214를 그 음수로 보내고 다시 되돌리기를 영원히 반복한다. 빠져나올 수 없는 주기라서, 그 값으로 몰려드는 시작점들은 다음 튕김이 어느 쪽을 택하느냐에 따라 아무 뿌리로나 던져진다. 시작점을 0.447에서 0.450, 0.460으로 옮겨 보면 답이 0, -1, +1로 바뀐다. 삼천분의 일씩 움직였을 뿐이다. 여기서 수렴은 국소적이다. 정리가 약속하는 것은 뿌리 둘레의 공 하나이고, 당신이 실제로 출발한 점에 대해서는 아무 말도 하지 않는다.")}
            </p>
        </div>
    );
};

export default NewtonBasins;
