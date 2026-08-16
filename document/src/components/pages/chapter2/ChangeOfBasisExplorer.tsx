import {useState} from "react";
import {Line} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {DragDot, fmt, makePlane, SpanLine, VecArrow} from "../../2d/plane";

// 벡터는 하나인데 좌표는 기저마다 다르다. 두 기저의 격자를 같은 화면에 겹쳐 두면
// "표현이 바뀐 것이지 벡터가 바뀐 것이 아니다"가 눈으로 확인된다.
const WARN = "#f59e0b";
const SINGULAR = 0.15;   // |det P̄| 가 이보다 작으면 기저로 보지 않는다
const GRID = 5;

interface Vec {
    x: number;
    y: number;
}

interface Props {
    width?: number;
    height?: number;
}

const snap = (v: number) => Math.round(v * 2) / 2;

// 작은 2×2 행렬 표시. 캔버스가 아니라 아래쪽 HTML 로 두어 글자가 선명하게 보이게 한다.
const Mat2 = ({label, m, color}: {label: string; m: number[][]; color: string}) => (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs">
        <span style={{color}}>{label}</span>
        <span className="grid grid-cols-2 gap-x-2 border-l-2 border-r-2 rounded-[3px] px-1.5 py-0.5"
              style={{borderColor: color}}>
            {m.map((row, i) => row.map((value, j) => (
                <span key={`${i}-${j}`} className="text-right tabular-nums">{fmt(value)}</span>
            )))}
        </span>
    </span>
);

const ChangeOfBasisExplorer = ({width: fixedWidth, height = 340}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;
    const plane = makePlane(width, height, 4.6, 3.1);

    const [x, setX] = useState<Vec>({x: 2.5, y: 1.5});
    const [b1, setB1] = useState<Vec>({x: 1.5, y: 1});
    const [b2, setB2] = useState<Vec>({x: -1, y: 1.5});

    const det = b1.x * b2.y - b2.x * b1.y;
    const singular = Math.abs(det) < SINGULAR;
    // P̄ 의 열은 [ū_i]_u 이고 [x]_u = P̄[x]_ū 이므로, 새 기저 좌표는 P = P̄⁻¹ 로 얻는다.
    const beta1 = singular ? 0 : (b2.y * x.x - b2.x * x.y) / det;
    const beta2 = singular ? 0 : (b1.x * x.y - b1.y * x.x) / det;
    const comp1 = {x: b1.x * beta1, y: b1.y * beta1};

    const clampTip = (u: Vec): Vec => ({
        x: Math.min(plane.halfX - 0.3, Math.max(-plane.halfX + 0.3, snap(u.x))),
        y: Math.min(plane.halfY - 0.3, Math.max(-plane.halfY + 0.3, snap(u.y))),
    });

    const c1 = plane.px(comp1.x, comp1.y);
    const xp = plane.px(x.x, x.y);

    const caption = singular
        ? t("ū¹ and ū² have gone parallel. P̄ is singular, so this pair is not a basis and x has no representation in it.",
            "ū¹과 ū²가 평행해졌다. P̄가 비가역이므로 이 쌍은 basis가 아니고 x는 그 안에서 표현되지 않는다.")
        : t("Drag x and the two readouts change together. The arrow never moves when you drag ū: only its address does.",
            "x를 끌면 두 좌표가 함께 바뀐다. ū를 끌 때 화살표 자체는 그대로 있고 주소만 달라진다.");

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                {/* ū 기저가 만드는 격자. 표준 격자(축 눈금)와 겹쳐 두 좌표계를 동시에 읽는다. */}
                {!singular && Array.from({length: GRID * 2 + 1}, (_, k) => k - GRID).flatMap((k) => [
                    <SpanLine key={`g1-${k}`} plane={plane} x={b2.x} y={b2.y} color={colors.accent2}
                              offset={{x: b1.x * k, y: b1.y * k}} strokeWidth={1} opacity={k === 0 ? 0.5 : 0.22}/>,
                    <SpanLine key={`g2-${k}`} plane={plane} x={b1.x} y={b1.y} color={colors.accent2}
                              offset={{x: b2.x * k, y: b2.y * k}} strokeWidth={1} opacity={k === 0 ? 0.5 : 0.22}/>,
                ])}

                {!singular && (
                    <>
                        {/* x 를 ū 성분으로 쪼갠 평행사변형 */}
                        <VecArrow plane={plane} x={comp1.x} y={comp1.y} color={colors.accent2}
                                  strokeWidth={1.5} opacity={0.8} dash={[5, 4]}/>
                        <Line points={[c1.x, c1.y, xp.x, xp.y]} stroke={colors.accent2} strokeWidth={1.5}
                              dash={[5, 4]} opacity={0.8} listening={false}/>
                    </>
                )}

                <VecArrow plane={plane} x={b1.x} y={b1.y} color={colors.accent2} label="ū¹" strokeWidth={2}/>
                <VecArrow plane={plane} x={b2.x} y={b2.y} color={colors.accent2} label="ū²" strokeWidth={2}/>
                <VecArrow plane={plane} x={1} y={0} color={colors.muted} label="u¹" strokeWidth={2}/>
                <VecArrow plane={plane} x={0} y={1} color={colors.muted} label="u²" strokeWidth={2}/>
                <VecArrow plane={plane} x={x.x} y={x.y} color={singular ? WARN : colors.accent}
                          label="x" strokeWidth={3}/>

                <DragDot plane={plane} x={b1.x} y={b1.y} color={colors.accent2} fill={colors.bg}
                         constrain={clampTip} onMove={(u) => setB1(clampTip(u))}/>
                <DragDot plane={plane} x={b2.x} y={b2.y} color={colors.accent2} fill={colors.bg}
                         constrain={clampTip} onMove={(u) => setB2(clampTip(u))}/>
                <DragDot plane={plane} x={x.x} y={x.y} color={singular ? WARN : colors.accent} fill={colors.bg}
                         constrain={clampTip} onMove={(u) => setX(clampTip(u))}/>
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {([
                    [t("natural basis", "natural basis"), {x: 1, y: 0}, {x: 0, y: 1}],
                    [t("rotated", "회전"), {x: 1.5, y: 1}, {x: -1, y: 1.5}],
                    [t("sheared", "전단"), {x: 1, y: 0}, {x: 1.5, y: 1}],
                    [t("parallel", "평행"), {x: 2, y: 1}, {x: 1, y: 0.5}],
                ] as Array<[string, Vec, Vec]>).map(([label, n1, n2]) => (
                    <button key={label} type="button"
                            onClick={() => {
                                setB1(n1);
                                setB2(n2);
                            }}
                            className={cn("px-2.5 py-1 rounded border",
                                b1.x === n1.x && b1.y === n1.y && b2.x === n2.x && b2.y === n2.y
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {label}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-2 text-sm font-mono">
                <span style={{color: colors.muted}}>{`[x]ᵤ = (${fmt(x.x)}, ${fmt(x.y)})`}</span>
                <span style={{color: singular ? WARN : colors.accent2}}>
                    {singular ? t("[x]ū undefined", "[x]ū 없음") : `[x]ū = (${fmt(beta1)}, ${fmt(beta2)})`}
                </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-2">
                <Mat2 label="P̄ =" color={colors.accent2} m={[[b1.x, b2.x], [b1.y, b2.y]]}/>
                {!singular && (
                    <Mat2 label="P = P̄⁻¹ =" color={colors.accent}
                          m={[[b2.y / det, -b2.x / det], [-b1.y / det, b1.x / det]]}/>
                )}
                <span className="font-mono text-xs text-muted">det P̄ = {fmt(det)}</span>
            </div>
            <p className="mt-2 text-sm text-muted text-center px-2">{caption}</p>
        </div>
    );
};

export default ChangeOfBasisExplorer;
