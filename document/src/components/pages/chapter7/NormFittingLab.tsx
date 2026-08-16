import {useMemo, useState} from "react";
import {Line} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import {DragDot, fmt, makePlane} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {cost1, cost2, costInf, Fit, fitData, fitL1, fitL2, fitLinf, Pt} from "./optimize";

// 같은 자료에 세 개의 norm 으로 직선을 맞추면 세 개의 다른 직선이 나온다. 한 점을 멀리 끌어
// 보면 2-norm 은 그 점을 쫓아가고, 1-norm 은 거의 꿈쩍하지 않으며, max-norm 은 그 점 하나에
// 끌려간다. 어느 norm 을 쓸지는 취향이 아니라 "이상치를 어떻게 취급할 것인가"의 선언이다.
const L1_COLOR = "#10b981";
const L2_COLOR = "#3b82f6";
const LINF_COLOR = "#f59e0b";

type NormId = "one" | "two" | "max";

interface Props {
    width?: number;
    height?: number;
}

const COLORS: Record<NormId, string> = {one: L1_COLOR, two: L2_COLOR, max: LINF_COLOR};
const ORDER: NormId[] = ["one", "two", "max"];
const NORM_LABEL: Record<NormId, string> = {one: "1-norm", two: "2-norm", max: "max-norm"};

const NormFittingLab = ({width: fixedWidth, height = 400}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 640);
    const width = fixedWidth ?? measured;
    const plane = makePlane(width, height, 3.2, 2.6);

    const initial = useMemo(() => fitData(), []);
    const [pts, setPts] = useState<Pt[]>(initial);
    const [shown, setShown] = useState<NormId>("two");

    const fits = useMemo(
        () => ({one: fitL1(pts), two: fitL2(pts), max: fitLinf(pts)}),
        [pts],
    );
    const costs: Record<NormId, [number, number, number]> = {
        one: [cost1(pts, fits.one), cost2(pts, fits.one), costInf(pts, fits.one)],
        two: [cost1(pts, fits.two), cost2(pts, fits.two), costInf(pts, fits.two)],
        max: [cost1(pts, fits.max), cost2(pts, fits.max), costInf(pts, fits.max)],
    };

    const lineFor = (fit: Fit) => {
        const a = plane.px(-plane.halfX, fit.m * -plane.halfX + fit.c);
        const b = plane.px(plane.halfX, fit.m * plane.halfX + fit.c);
        return [a.x, a.y, b.x, b.y];
    };

    const active = fits[shown];
    const throwOutlier = () => setPts(pts.map((p, i) => (i === pts.length - 1 ? {...p, y: p.y + 2.4} : p)));

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                {/* 잔차 막대는 고른 norm 기준으로 그린다. 어떤 점이 그 norm 의 비용을 지배하는지 보인다. */}
                {pts.map((p, i) => {
                    const yFit = active.m * p.x + active.c;
                    const a = plane.px(p.x, p.y);
                    const b = plane.px(p.x, yFit);
                    return <Line key={i} points={[a.x, a.y, b.x, b.y]} stroke={COLORS[shown]}
                                 strokeWidth={1.6} opacity={0.5} dash={[4, 3]} listening={false}/>;
                })}

                {ORDER.map((id) => (
                    <Line key={id} points={lineFor(fits[id])} stroke={COLORS[id]}
                          strokeWidth={id === shown ? 3.2 : 1.8}
                          opacity={id === shown ? 1 : 0.55} listening={false}/>
                ))}

                {pts.map((p, i) => (
                    <DragDot key={i} plane={plane} x={p.x} y={p.y} color={colors.text}
                             fill={colors.bg} radius={5.5}
                             onMove={(u) => setPts(pts.map((old, j) => (j === i ? u : old)))}/>
                ))}
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {ORDER.map((id) => (
                    <button key={id} type="button" onClick={() => setShown(id)}
                            className={cn("px-2.5 py-1 rounded border font-mono",
                                shown === id ? "font-semibold" : "border-border text-muted hover:bg-surface")}
                            style={shown === id ? {borderColor: COLORS[id], color: COLORS[id]} : undefined}>
                        {NORM_LABEL[id]}
                    </button>
                ))}
                <button type="button" onClick={throwOutlier}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {t("throw an outlier", "이상치 던지기")}
                </button>
                <button type="button" onClick={() => setPts(initial)}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {t("reset data", "자료 되돌리기")}
                </button>
            </div>

            {/* 대각선이 각 열의 최솟값이라는 것이 이 표의 요점이다. 각 적합선은 자기 norm 에서만 이긴다. */}
            <table className="table-center mt-3 text-xs font-mono">
                <thead>
                <tr>
                    <th>{t("fit", "적합")}</th>
                    <th>y = m x + c</th>
                    <th>||r||_1</th>
                    <th>||r||_2</th>
                    <th>||r||_max</th>
                </tr>
                </thead>
                <tbody>
                {ORDER.map((id) => (
                    <tr key={id}>
                        <td style={{color: COLORS[id]}}>{NORM_LABEL[id]}</td>
                        <td>{fmt(fits[id].m, 3)} x + {fmt(fits[id].c, 3)}</td>
                        {[0, 1, 2].map((col) => {
                            const best = Math.min(...ORDER.map((k) => costs[k][col]));
                            const win = costs[id][col] <= best + 1e-9;
                            return (
                                <td key={col} style={win ? {color: COLORS[id], fontWeight: 600} : undefined}>
                                    {fmt(costs[id][col], 3)}
                                </td>
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>

            <p className="mt-2 text-sm text-muted text-center px-2">
                {t("Drag the rightmost point far from the others. The 2-norm line chases it, because squaring makes one large residual worth more than many small ones. The 1-norm line barely moves, because it is pinned by the points it already passes through and a distant point only adds a constant slope to the cost. The max-norm line is dragged hardest of all, because the objective is literally the worst residual and nothing else enters. Same data, three answers, and the choice of norm is the modelling decision.",
                    "가장 오른쪽 점을 다른 점들에서 멀리 끌어 보라. 2-norm 직선이 그 점을 쫓아간다. 제곱을 하면 큰 잔차 하나가 작은 잔차 여럿보다 비싸지기 때문이다. 1-norm 직선은 거의 움직이지 않는다. 이미 지나고 있는 점들에 박혀 있고, 멀리 있는 점 하나는 비용에 상수 기울기만 더하기 때문이다. max-norm 직선이 가장 세게 끌려간다. 목적함수가 말 그대로 최악의 잔차이고 그 외에는 아무것도 들어오지 않기 때문이다. 같은 자료에 답이 셋이고, norm의 선택이 곧 모델링 결정이다.")}
            </p>
        </div>
    );
};

export default NormFittingLab;
