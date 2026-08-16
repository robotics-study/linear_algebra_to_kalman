import {useEffect, useRef, useState} from "react";
import {Group, Layer, Line, Rect, Stage, Text} from "react-konva";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";

// 귀납법은 도미노 비유로 배우지만, 정작 학생이 틀리는 지점은 비유가 아니라 두 조건 중
// 하나가 빠졌을 때다. 그래서 base case 와 induction step 을 각각 끌 수 있게 만들고,
// "모든 말은 같은 색"의 실제 고장 지점(P(1) ⟹ P(2))을 그대로 재현한다.
const COUNT = 8;
const FALL_MS = 260;
const STAGGER = 180;
const FALLEN_ANGLE = 74;

type StepMode = "holds" | "breaks-at-1" | "breaks-at-5";

// step 이 깨지는 지점 이후의 도미노는 영원히 서 있다. 반환값은 넘어질 수 있는 마지막 인덱스.
const lastFalling = (mode: StepMode): number => {
    if (mode === "breaks-at-1") return 0;      // P(1) ⟹ P(2) 가 거짓
    if (mode === "breaks-at-5") return 4;      // P(5) ⟹ P(6) 이 거짓
    return COUNT - 1;
};

interface Props {
    width?: number;
    height?: number;
}

const InductionDominoes = ({width: fixedWidth, height = 210}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 560);
    const width = fixedWidth ?? measured;

    const [base, setBase] = useState(true);
    const [mode, setMode] = useState<StepMode>("holds");
    const [elapsed, setElapsed] = useState(Infinity);   // Infinity = 아직 실행 전(전부 서 있음)
    const raf = useRef(0);
    const started = useRef(0);

    // 설정을 바꾸면 다시 세운다. 이전 애니메이션이 남아 있으면 결과를 오독하게 된다.
    useEffect(() => {
        cancelAnimationFrame(raf.current);
        setElapsed(Infinity);
    }, [base, mode]);

    useEffect(() => () => cancelAnimationFrame(raf.current), []);

    const run = () => {
        cancelAnimationFrame(raf.current);
        started.current = performance.now();
        const tick = (now: number) => {
            const dt = now - started.current;
            setElapsed(dt);
            if (dt < STAGGER * COUNT + FALL_MS) raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
    };

    const limit = lastFalling(mode);
    const angleOf = (i: number): number => {
        if (!base || i > limit || elapsed === Infinity) return 0;
        const local = elapsed - i * STAGGER;
        if (local <= 0) return 0;
        return Math.min(1, local / FALL_MS) * FALLEN_ANGLE;
    };

    const pad = 26;
    const usable = Math.max(1, width - pad * 2);
    const spacing = usable / (COUNT - 1);
    const dw = Math.max(9, Math.min(16, spacing * 0.3));
    const dh = Math.min(96, spacing * 1.7);
    const groundY = height - 46;

    const caption = !base
        ? t("Without the base case nothing starts, no matter how good the step is.",
            "base case가 없으면 step이 아무리 좋아도 시작 자체가 없다.")
        : mode === "breaks-at-1"
            ? t("P(1) ⟹ P(2) fails, so only the first domino falls. This is exactly the hole in the \"all horses are the same color\" argument.",
                "P(1) ⟹ P(2)가 거짓이라 첫 도미노만 넘어진다. \"모든 말은 같은 색\" 논증이 뚫린 지점이 정확히 여기다.")
            : mode === "breaks-at-5"
                ? t("The step holds up to k = 5 and fails there, so the chain stops at P(5).",
                    "step이 k = 5까지만 성립하고 거기서 깨지므로 사슬은 P(5)에서 멈춘다.")
                : t("Base case plus a step that holds for every k: the whole chain falls.",
                    "base case와 모든 k에서 성립하는 step이 함께 있으면 사슬 전체가 넘어진다.");

    return (
        <div ref={ref} className="w-full">
            <Stage width={width} height={height}>
                <Layer>
                    <Line points={[pad - 16, groundY, width - pad + 16, groundY]}
                          stroke={colors.border} strokeWidth={2}/>
                    {Array.from({length: COUNT}, (_, i) => {
                        const x = pad + i * spacing;
                        const standing = angleOf(i) === 0;
                        const reachable = base && i <= limit;
                        return (
                            <Group key={i}>
                                <Group x={x} y={groundY} rotation={angleOf(i)}>
                                    <Rect x={-dw / 2} y={-dh} width={dw} height={dh}
                                          cornerRadius={2}
                                          fill={reachable ? colors.accent : colors.surface}
                                          stroke={reachable ? colors.accent : colors.border}
                                          strokeWidth={1.5}
                                          opacity={standing ? (reachable ? 0.9 : 1) : 0.45}/>
                                </Group>
                                <Text x={x - spacing / 2} y={groundY + 10} width={spacing}
                                      align="center" text={`P(${i + 1})`} fontSize={11}
                                      fill={reachable ? colors.text : colors.muted}/>
                            </Group>
                        );
                    })}
                    {/* step 이 깨지는 자리에 끊긴 고리를 표시한다 — 어디서 멈추는지가 이 그림의 요지다. */}
                    {base && limit < COUNT - 1 && (
                        <Line points={[pad + (limit + 0.5) * spacing, groundY - dh - 6,
                            pad + (limit + 0.5) * spacing, groundY + 4]}
                              stroke="#f59e0b" strokeWidth={2} dash={[5, 4]}/>
                    )}
                </Layer>
            </Stage>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <button type="button" onClick={() => setBase((b) => !b)}
                        className={cn("px-2.5 py-1 rounded border",
                            base ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                : "border-border text-muted")}>
                    {t("base case P(1)", "base case P(1)")}: {base ? "T" : "F"}
                </button>
                {([
                    ["holds", t("step holds for all k", "step이 모든 k에서 성립")],
                    ["breaks-at-1", t("step fails at k = 1", "step이 k = 1에서 깨짐")],
                    ["breaks-at-5", t("step fails at k = 5", "step이 k = 5에서 깨짐")],
                ] as Array<[StepMode, string]>).map(([value, label]) => (
                    <button key={value} type="button" onClick={() => setMode(value)}
                            className={cn("px-2.5 py-1 rounded border",
                                mode === value ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {label}
                    </button>
                ))}
                <button type="button" onClick={run}
                        className="px-3 py-1 rounded border border-border bg-surface font-semibold hover:border-[var(--accent)]">
                    {t("Run", "실행")}
                </button>
            </div>
            <p className="mt-2 text-sm text-muted text-center px-2">{caption}</p>
        </div>
    );
};

export default InductionDominoes;
