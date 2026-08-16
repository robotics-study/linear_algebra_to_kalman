import {useState} from "react";
import {Line, Rect} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {DragDot, fmt, makePlane, norm, SpanLine, VecArrow} from "./plane";

// 선형 독립은 "0을 만드는 자명하지 않은 조합이 있는가"라는 대수 조건이지만, R² 에서는
// 평행사변형이 납작해지는 순간으로 보인다. det → 0 과 span 이 직선으로 무너지는 것이 같은 사건이다.
const WARN = "#f59e0b";
const FLAT = 0.06;   // 평행사변형 넓이가 이보다 작으면 무너진 것으로 본다 (픽셀 단위 오차 몫)
const ZERO = 0.08;

interface Vec {
    x: number;
    y: number;
}

interface Props {
    width?: number;
    height?: number;
}

const cross = (a: Vec, b: Vec) => a.x * b.y - a.y * b.x;

const IndependenceExplorer = ({width: fixedWidth, height = 330}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;
    const plane = makePlane(width, height, 4.6, 3.1);

    const [v1, setV1] = useState<Vec>({x: 2, y: 0.6});
    const [v2, setV2] = useState<Vec>({x: -1, y: 2});
    const [v3, setV3] = useState<Vec>({x: 1.4, y: -1.8});
    const [third, setThird] = useState(false);

    const det = cross(v1, v2);
    const vectors: Vec[] = third ? [v1, v2, v3] : [v1, v2];
    const flat = vectors.every((a, i) => vectors.every((b, j) => i >= j || Math.abs(cross(a, b)) < FLAT));
    const allZero = vectors.every((a) => norm(a.x, a.y) < ZERO);
    const rank = allZero ? 0 : flat ? 1 : 2;
    const dependent = third || rank < vectors.length;

    // 계수 앞의 부호는 항 사이 연산자로 흡수한다 ("+ -0.97" 같은 표기를 만들지 않는다).
    const term = (c: number, name: string, first = false) =>
        `${c < 0 ? "− " : first ? "" : "+ "}${fmt(Math.abs(c))}·${name}`;

    // 종속일 때는 0을 만드는 계수를 실제로 계산해 보여 준다. 정의가 요구하는 것이 바로 그 계수다.
    const certificate = (): string | null => {
        if (!dependent) return null;
        if (third && Math.abs(det) >= FLAT) {
            const c1 = (v2.y * v3.x - v2.x * v3.y) / det;
            const c2 = (v1.x * v3.y - v1.y * v3.x) / det;
            return `${term(c1, "v¹", true)} ${term(c2, "v²")} − v³ = 0`;
        }
        const base = norm(v1.x, v1.y) >= ZERO ? v1 : norm(v2.x, v2.y) >= ZERO ? v2 : null;
        if (!base) return "1·v¹ = 0";
        const other = base === v1 ? v2 : v1;
        const c = (base.x * other.x + base.y * other.y) / (base.x * base.x + base.y * base.y);
        return base === v1
            ? `${term(c, "v¹", true)} − v² = 0`
            : `v¹ ${term(-c, "v²")} = 0`;
    };

    const clampTip = (u: Vec): Vec => ({
        x: Math.min(plane.halfX - 0.3, Math.max(-plane.halfX + 0.3, Math.round(u.x * 10) / 10)),
        y: Math.min(plane.halfY - 0.3, Math.max(-plane.halfY + 0.3, Math.round(u.y * 10) / 10)),
    });

    const o = plane.px(0, 0);
    const a = plane.px(v1.x, v1.y);
    const b = plane.px(v1.x + v2.x, v1.y + v2.y);
    const c = plane.px(v2.x, v2.y);

    const spanText = rank === 2 ? "span{S} = ℝ²" : rank === 1 ? t("span{S} = a line", "span{S} = 직선") : "span{S} = {0}";
    const caption = third
        ? t("Three vectors in a two-dimensional space are dependent no matter where you drag them. That is exactly what \"dimension 2\" means.",
            "2차원 공간에서 벡터 셋은 어디로 끌어도 종속이다. \"차원이 2\"라는 말의 뜻이 정확히 이것이다.")
        : rank === 2
            ? t("The parallelogram has positive area, so the only combination giving 0 is the trivial one and the span fills the plane.",
                "평행사변형의 넓이가 0이 아니므로 0을 만드는 조합은 자명한 것뿐이고, span은 평면 전체를 채운다.")
            : rank === 1
                ? t("The parallelogram has collapsed to a segment. One vector is a multiple of the other, so the set is dependent and the span shrinks to a line.",
                    "평행사변형이 선분으로 무너졌다. 한 벡터가 다른 벡터의 배수이므로 집합은 종속이고 span은 직선으로 줄어든다.")
                : t("Both vectors sit at the origin. The zero vector alone already makes a set dependent: 1·0 = 0.",
                    "두 벡터가 모두 원점에 있다. 영벡터 하나만 있어도 집합은 종속이다. 1·0 = 0이기 때문이다.");

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                {/* span 자체를 칠한다 — 평면 전체인지 직선 하나인지가 이 그림의 결론이다. */}
                {rank === 2 && (
                    <Rect x={0} y={0} width={width} height={height}
                          fill={colors.accent} opacity={0.08} listening={false}/>
                )}
                {rank === 1 && (
                    <SpanLine plane={plane} color={colors.accent} strokeWidth={4} opacity={0.45}
                              x={norm(v1.x, v1.y) >= ZERO ? v1.x : v2.x}
                              y={norm(v1.x, v1.y) >= ZERO ? v1.y : v2.y}/>
                )}

                <Line points={[o.x, o.y, a.x, a.y, b.x, b.y, c.x, c.y]} closed listening={false}
                      fill={rank === 2 ? colors.accent : WARN} opacity={0.16}
                      stroke={rank === 2 ? colors.accent : WARN} strokeWidth={1} dash={[5, 4]}/>

                <VecArrow plane={plane} x={v1.x} y={v1.y} color={colors.accent} label="v¹"/>
                <VecArrow plane={plane} x={v2.x} y={v2.y} color={colors.accent2} label="v²"/>
                {third && <VecArrow plane={plane} x={v3.x} y={v3.y} color={WARN} label="v³"/>}

                <DragDot plane={plane} x={v1.x} y={v1.y} color={colors.accent} fill={colors.bg}
                         constrain={clampTip} onMove={(u) => setV1(clampTip(u))}/>
                <DragDot plane={plane} x={v2.x} y={v2.y} color={colors.accent2} fill={colors.bg}
                         constrain={clampTip} onMove={(u) => setV2(clampTip(u))}/>
                {third && (
                    <DragDot plane={plane} x={v3.x} y={v3.y} color={WARN} fill={colors.bg}
                             constrain={clampTip} onMove={(u) => setV3(clampTip(u))}/>
                )}
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <button type="button" onClick={() => setThird((v) => !v)}
                        className={cn("px-2.5 py-1 rounded border",
                            third ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                : "border-border text-muted hover:bg-surface")}>
                    {third ? t("drop v³", "v³ 빼기") : t("add v³", "v³ 추가")}
                </button>
                <button type="button"
                        onClick={() => setV2({x: Math.round(-1.5 * v1.x * 10) / 10, y: Math.round(-1.5 * v1.y * 10) / 10})}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {t("make v² a multiple of v¹", "v²를 v¹의 배수로")}
                </button>
                <button type="button"
                        onClick={() => {
                            setV1({x: 2, y: 0.6});
                            setV2({x: -1, y: 2});
                            setV3({x: 1.4, y: -1.8});
                        }}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {t("reset", "되돌리기")}
                </button>
            </div>

            <p className="mt-2 text-sm text-center font-mono">
                {`det[v¹ v²] = ${fmt(det)} · rank = ${rank} · ${spanText}`}
            </p>
            <p className="mt-1 text-sm text-center font-mono" style={{color: dependent ? WARN : colors.accent}}>
                {certificate() ?? t("only α₁ = α₂ = 0 gives α₁v¹ + α₂v² = 0",
                    "α₁v¹ + α₂v² = 0을 만드는 것은 α₁ = α₂ = 0뿐이다")}
            </p>
            <p className="mt-1 text-sm text-muted text-center px-2">{caption}</p>
        </div>
    );
};

export default IndependenceExplorer;
