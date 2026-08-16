import {useMemo, useState} from "react";
import {Circle, Layer, Line, Stage, Text} from "react-konva";
import {fmt} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {aPrioriBound, contract, contractFixedPoint, contractOrbit} from "./analysis";

// T(x) = c sin(x) + 1 을 쓰면 |T'(x)| = |c cos x| <= |c| 이므로 슬라이더가 곧 Lipschitz 상수 c 다.
// 거미줄 그림에서 c < 1 이면 계단이 한 점으로 조여들고, c 가 커지면 같은 계단이 사각형을 그리며
// 두 값 사이를 영원히 오간다. 정리가 c < 1 을 요구하는 이유가 그 사각형이다.
const PAD = {left: 42, right: 16, top: 14, bottom: 30};
const X_MIN = -0.6;
const X_MAX = 3.8;
const MAX_STEPS = 14;
const OK = "#10b981";
const BAD = "#ef4444";
// |T'(x*)| = 1 이 되는 지점. 이 값보다 작으면 (c > 1 이어도) 실제로는 여전히 수렴한다.
const LOCAL_LIMIT = 1.598277;

interface Props {
    width?: number;
    height?: number;
}

const ContractionCobweb = ({width: fixedWidth, height = 400}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;

    const [c, setC] = useState(0.6);
    const [x0, setX0] = useState(3.4);
    const [steps, setSteps] = useState(MAX_STEPS);

    const size = Math.max(140, Math.min(width - PAD.left - PAD.right, height - PAD.top - PAD.bottom));
    const s = (v: number) => PAD.left + ((v - X_MIN) / (X_MAX - X_MIN)) * size;
    const sy = (v: number) => PAD.top + ((X_MAX - v) / (X_MAX - X_MIN)) * size;

    const graph = useMemo(() => {
        const pts: number[] = [];
        for (let i = 0; i <= 300; i++) {
            const x = X_MIN + ((X_MAX - X_MIN) * i) / 300;
            pts.push(s(x), sy(contract(c, x)));
        }
        return pts;
    }, [c, size]);

    const xStar = useMemo(() => contractFixedPoint(c), [c]);
    const orbit = useMemo(() => contractOrbit(c, x0, MAX_STEPS), [c, x0]);
    const shown = orbit.slice(0, steps + 1);

    // 거미줄: (x_n, x_n) 에서 곡선까지 수직으로, 거기서 대각선까지 수평으로.
    const web = (() => {
        const pts: number[] = [s(x0), sy(x0)];
        for (let i = 0; i < shown.length - 1; i++) {
            pts.push(s(shown[i]), sy(shown[i + 1]));
            pts.push(s(shown[i + 1]), sy(shown[i + 1]));
        }
        return pts;
    })();

    const isContraction = c < 1;
    const firstStep = Math.abs(orbit[1] - orbit[0]);
    const n = shown.length - 1;
    const trueError = Math.abs(shown[n] - xStar);
    const bound = isContraction ? aPrioriBound(c, n, firstStep) : null;
    // c > 1 이면 정리의 가정이 깨진다. 그렇다고 반드시 발산하는 것은 아니라는 점이 중요하다.
    const stillConverges = c < LOCAL_LIMIT;

    return (
        <div ref={ref} className="w-full">
            <Stage width={width} height={height} className="overflow-hidden w-fit h-fit">
                <Layer>
                    {/* y = x. 고정점은 이 대각선과 곡선이 만나는 자리다. */}
                    <Line points={[s(X_MIN), sy(X_MIN), s(X_MAX), sy(X_MAX)]} stroke={colors.border}
                          strokeWidth={1.5} listening={false}/>
                    <Line points={graph} stroke={colors.text} strokeWidth={2.2} listening={false}/>
                    <Line points={web} stroke={stillConverges ? OK : BAD} strokeWidth={1.6}
                          opacity={0.95} listening={false}/>
                    {shown.map((v, i) => (
                        <Circle key={i} x={s(v)} y={sy(v)} radius={i === n ? 4.5 : 2.6}
                                fill={stillConverges ? OK : BAD} opacity={i === n ? 1 : 0.5}
                                listening={false}/>
                    ))}
                    <Circle x={s(xStar)} y={sy(xStar)} radius={5.5} fill={colors.bg}
                            stroke={colors.accent} strokeWidth={2.5} listening={false}/>
                    <Line points={[s(x0), sy(X_MIN), s(x0), sy(x0)]} stroke={colors.accent2}
                          strokeWidth={1} dash={[3, 3]} opacity={0.8} listening={false}/>
                    <Text text="x₀" x={s(x0) - 6} y={sy(X_MIN) - 16} fontSize={11} fontFamily="monospace"
                          fill={colors.accent2} listening={false}/>
                    <Text text="x*" x={s(xStar) + 8} y={sy(xStar) - 16} fontSize={11}
                          fontFamily="monospace" fill={colors.accent} listening={false}/>
                    <Text text={`T(x) = ${fmt(c, 2)}·sin(x) + 1`} x={PAD.left + 6} y={PAD.top + 2}
                          fontSize={11} fontFamily="monospace" fill={colors.text} listening={false}/>
                    <Text text="y = x" x={s(X_MAX) - 46} y={sy(X_MAX) + 6} fontSize={11}
                          fontFamily="monospace" fill={colors.muted} listening={false}/>
                </Layer>
            </Stage>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-16">c = {fmt(c, 2)}</span>
                    <input type="range" min={0.05} max={2} step={0.01} value={c}
                           aria-label={t("contraction constant c", "contraction 상수 c")}
                           onChange={(e) => setC(Number(e.target.value))}
                           className="w-32 accent-[var(--accent)]"/>
                </label>
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-20">x₀ = {fmt(x0, 2)}</span>
                    <input type="range" min={X_MIN} max={X_MAX} step={0.01} value={x0}
                           aria-label={t("starting point", "시작점")}
                           onChange={(e) => setX0(Number(e.target.value))}
                           className="w-28 accent-[var(--accent)]"/>
                </label>
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-16">n = {steps}</span>
                    <input type="range" min={0} max={MAX_STEPS} step={1} value={steps}
                           aria-label={t("number of iterations", "반복 횟수")}
                           onChange={(e) => setSteps(Number(e.target.value))}
                           className="w-24 accent-[var(--accent)]"/>
                </label>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {([["c = 0.6", 0.6], ["c = 0.95", 0.95], ["c = 1.4", 1.4], ["c = 2.0", 2]] as Array<[string, number]>)
                    .map(([label, v]) => (
                        <button key={label} type="button" onClick={() => setC(v)}
                                className={cn("px-2.5 py-1 rounded border font-mono",
                                    Math.abs(c - v) < 1e-9
                                        ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                        : "border-border text-muted hover:bg-surface")}>
                            {label}
                        </button>
                    ))}
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: stillConverges ? OK : BAD}}>
                x* = {fmt(xStar, 6)} · x<sub>{n}</sub> = {fmt(shown[n], 6)} · |x<sub>n</sub> − x*| = {fmt(trueError, 6)}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                {bound === null
                    ? t("c ≥ 1: the theorem gives no bound at all", "c ≥ 1: 정리가 주는 한계가 아예 없다")
                    : `cⁿ/(1−c)·|x₁−x₀| = ${fmt(bound, 6)} ≥ ${fmt(trueError, 6)}`}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {isContraction
                    ? t("Below one, the staircase spirals into the fixed point from wherever you start, and the second line is the theorem's error bound: it uses only c and the very first step, never the answer, so you can decide how many iterations to run before running any of them.",
                        "1 아래에서는 어디서 출발하든 계단이 고정점으로 조여들고, 둘째 줄은 정리가 주는 오차 한계다. c와 첫 걸음만 쓰고 답은 쓰지 않으므로, 반복을 한 번도 돌리기 전에 몇 번 돌릴지 정할 수 있다.")
                    : stillConverges
                        ? t("Above one the hypothesis is gone, and notice what does not happen: the iteration still converges. A contraction constant is sufficient, never necessary. What you have actually lost is the guarantee and the error bound, so you no longer know when to stop.",
                            "1을 넘으면 가정이 사라지는데, 일어나지 않는 일에 주목하라. 반복은 여전히 수렴한다. contraction 상수는 충분조건이지 필요조건이 아니다. 실제로 잃은 것은 보장과 오차 한계이고, 그래서 언제 멈춰야 할지를 더 이상 알 수 없다.")
                        : t("Now the staircase closes into a rectangle and walks it forever, hitting two values and never a fixed point. The fixed point is still there where the curve crosses the diagonal, and the iteration is pushed away from it rather than pulled in.",
                            "이제 계단은 사각형으로 닫혀 그것을 영원히 돈다. 두 값을 오갈 뿐 고정점에는 닿지 않는다. 고정점은 곡선이 대각선을 지나는 자리에 그대로 있고, 반복은 그쪽으로 끌려가는 대신 밀려난다.")}
            </p>
            <p className="mt-1 text-sm text-muted text-center px-2">
                {t("The slider is the Lipschitz constant itself, because the slope of this map never exceeds c. Sweeping it up, the iteration keeps converging until about 1.598, where the slope at the fixed point reaches one and the rectangle opens up. The gap between 1 and 1.598 is the price of a theorem that has to work for every map at once.",
                    "슬라이더가 곧 Lipschitz 상수다. 이 사상의 기울기가 c를 넘지 않기 때문이다. 값을 올려 보면 대략 1.598까지는 반복이 계속 수렴하고, 그 지점에서 고정점의 기울기가 1에 닿으면서 사각형이 열린다. 1과 1.598 사이의 간격은 모든 사상에 한꺼번에 통해야 하는 정리가 치르는 값이다.")}
            </p>
        </div>
    );
};

export default ContractionCobweb;
