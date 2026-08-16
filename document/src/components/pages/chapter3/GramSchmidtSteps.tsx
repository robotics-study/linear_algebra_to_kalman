import {useState} from "react";
import {Circle} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import {DragDot, fmt, makePlane, VecArrow} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";

// Gram-Schmidt 의 한 걸음은 "v¹ 방향 성분을 빼기"가 전부다. 그 성분을 화살표로 그려서
// 빼기 전과 후를 나란히 보여 주면, 식 (3.2)가 무엇을 하는지 손으로 확인할 필요가 없어진다.
const DEP = "#f59e0b";  // 두 벡터가 거의 같은 직선 위에 놓여 절차가 무너지는 순간을 알리는 색.

interface Props {
    width?: number;
    height?: number;
}

interface Vec {
    x: number;
    y: number;
}

const STEP_COUNT = 4;

const NEAR_DEPENDENT = 0.06;

const GramSchmidtSteps = ({width: fixedWidth, height = 360}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;
    const plane = makePlane(width, height, 2.4, 1.9);

    const [y1, setY1] = useState<Vec>({x: 1.6, y: 0.6});
    const [y2, setY2] = useState<Vec>({x: 0.5, y: 1.4});
    const [step, setStep] = useState(0);

    const v1 = y1;
    const n1sq = v1.x * v1.x + v1.y * v1.y;
    const dot = y2.x * v1.x + y2.y * v1.y;
    const coef = n1sq < 1e-9 ? 0 : dot / n1sq;
    // y² 에서 덜어 낼 성분. 이 화살표가 곧 식 (3.2)의 합 항이다.
    const proj = {x: coef * v1.x, y: coef * v1.y};
    const v2 = {x: y2.x - proj.x, y: y2.y - proj.y};

    const len1 = Math.hypot(v1.x, v1.y);
    const len2 = Math.hypot(v2.x, v2.y);
    const unit = (v: Vec, l: number) => (l < 1e-9 ? {x: 0, y: 0} : {x: v.x / l, y: v.y / l});
    const e1 = unit(v1, len1);
    const e2 = unit(v2, len2);
    // 넓이가 0 에 가까우면 두 벡터가 사실상 같은 직선 위에 있고, v² 가 0 으로 무너진다.
    const area = Math.abs(v1.x * y2.y - v1.y * y2.x);
    const degenerate = area < NEAR_DEPENDENT;

    const o = plane.px(0, 0);

    // 캔버스 라벨과 달리 이 문단은 본문 서체라 수식 기호를 쓰지 않는다. 기호가 필요한 값은 아래
    // monospace 판독 줄이 보여 준다.
    const CAPTIONS: Array<[string, string]> = [
        ["Two independent vectors. Neither one is orthogonal to the other, and neither has length 1.",
            "독립인 벡터 둘. 서로 직교하지도 않고 길이가 1도 아니다."],
        ["Keep the first direction untouched. Gram-Schmidt never rotates the first vector, which is why the span it generates is unchanged.",
            "첫 방향은 그대로 둔다. Gram-Schmidt는 첫 벡터를 절대 돌리지 않고, 그래서 그것이 만드는 span도 그대로다."],
        ["Measure how much of the second vector already points along the first. That amount is the orange arrow, and the readout below gives its coefficient.",
            "둘째 벡터가 첫 방향으로 얼마나 가 있는지 잰다. 그 양이 주황색 화살표이고, 아래 판독 줄이 그 계수를 보여 준다."],
        ["Subtract it. What is left has no component along the first direction at all, so the inner product of the two is zero.",
            "그것을 뺀다. 남은 것에는 첫 방향 성분이 하나도 없으므로 둘의 내적이 0이다."],
        ["Divide each by its own length. The pair is now orthonormal and spans exactly what the two inputs spanned.",
            "각각을 자기 길이로 나눈다. 이제 두 벡터는 orthonormal이고, 입력 둘이 만들던 것과 똑같은 공간을 만든다."],
    ];

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                {step >= STEP_COUNT && (
                    <Circle x={o.x} y={o.y} radius={plane.unit} stroke={colors.border} strokeWidth={1.5}
                            listening={false}/>
                )}

                {/* 원본 y 는 절차가 진행되어도 옅게 남겨 둔다. 무엇이 무엇으로 바뀌었는지 보이게 하려고. */}
                <VecArrow plane={plane} x={y1.x} y={y1.y} color={colors.muted} opacity={step === 0 ? 1 : 0.35}
                          label={step === 0 ? "y¹" : undefined} strokeWidth={2}/>
                <VecArrow plane={plane} x={y2.x} y={y2.y} color={colors.muted}
                          opacity={step >= 3 ? 0.35 : 1}
                          label={step >= 3 ? undefined : "y²"} strokeWidth={2}/>

                {step >= 1 && (
                    <VecArrow plane={plane} x={v1.x} y={v1.y} color={colors.accent} label="v¹" strokeWidth={3}/>
                )}

                {step === 2 && (
                    <>
                        <VecArrow plane={plane} x={proj.x} y={proj.y} color={DEP} label="proj" strokeWidth={3}/>
                        {/* y² 의 끝에서 proj 의 끝으로 내린 수선. 빼기가 무엇을 남기는지 미리 보여 준다. */}
                        <VecArrow plane={plane} x={y2.x} y={y2.y} from={proj} color={colors.muted}
                                  strokeWidth={1.5} dash={[5, 4]} opacity={0.8}/>
                    </>
                )}

                {step === 3 && (
                    <>
                        <VecArrow plane={plane} x={proj.x} y={proj.y} color={DEP} strokeWidth={2}
                                  opacity={0.5} dash={[5, 4]}/>
                        <VecArrow plane={plane} x={y2.x} y={y2.y} from={proj} color={colors.accent2}
                                  strokeWidth={2} opacity={0.6} dash={[5, 4]}/>
                        <VecArrow plane={plane} x={v2.x} y={v2.y}
                                  color={degenerate ? DEP : colors.accent2} label="v²" strokeWidth={3}/>
                    </>
                )}

                {step >= STEP_COUNT && (
                    <>
                        <VecArrow plane={plane} x={v2.x} y={v2.y} color={colors.accent2} strokeWidth={1.5}
                                  opacity={0.35}/>
                        <VecArrow plane={plane} x={e1.x} y={e1.y} color={colors.accent} label="ṽ¹"
                                  strokeWidth={3.5}/>
                        <VecArrow plane={plane} x={e2.x} y={e2.y}
                                  color={degenerate ? DEP : colors.accent2} label="ṽ²" strokeWidth={3.5}/>
                    </>
                )}

                <DragDot plane={plane} x={y1.x} y={y1.y} color={colors.accent} fill={colors.bg}
                         onMove={(u) => setY1(u)}/>
                <DragDot plane={plane} x={y2.x} y={y2.y} color={colors.accent2} fill={colors.bg}
                         onMove={(u) => setY2(u)}/>
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))}
                        disabled={step === 0}
                        className="px-3 py-1 rounded border border-border bg-surface font-semibold
                                   hover:border-[var(--accent)] disabled:opacity-40">
                    {t("back", "이전")}
                </button>
                <span className="px-2.5 py-1 rounded border border-border font-mono text-muted">
                    {t("step", "단계")} {step} / {STEP_COUNT}
                </span>
                <button type="button" onClick={() => setStep((s) => Math.min(STEP_COUNT, s + 1))}
                        disabled={step === STEP_COUNT}
                        className="px-3 py-1 rounded border border-border bg-surface font-semibold
                                   hover:border-[var(--accent)] disabled:opacity-40">
                    {t("next step", "다음 단계")}
                </button>
                <button type="button" onClick={() => setStep(0)}
                        className={cn("px-2.5 py-1 rounded border border-border text-muted hover:bg-surface")}>
                    {t("restart", "처음으로")}
                </button>
            </div>

            <p className="mt-2 text-sm text-center font-mono text-muted">
                ⟨y², v¹⟩ = {fmt(dot)} · ‖v¹‖² = {fmt(n1sq)} · {t("coefficient", "계수")} = {fmt(coef)}
                {" · "}⟨v², v¹⟩ = {fmt(v2.x * v1.x + v2.y * v1.y, 3)}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {degenerate
                    ? t("The two vectors are nearly parallel, so the second direction collapses toward zero. Gram-Schmidt needs the input set to be linearly independent, and this is what failing that looks like.",
                        "두 벡터가 거의 평행해서 둘째 방향이 0으로 무너진다. Gram-Schmidt는 입력이 선형 독립이어야 하고, 그 조건이 깨지면 이렇게 된다.")
                    : t(...CAPTIONS[step])}
            </p>
        </div>
    );
};

export default GramSchmidtSteps;
