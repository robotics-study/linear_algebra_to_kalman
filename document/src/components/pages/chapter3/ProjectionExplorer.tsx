import {useState} from "react";
import {Circle, Line} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import {DragDot, fmt, makePlane, SpanLine, VecArrow} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";

// 사영 정리의 주장은 그림 하나로 끝난다. 최단 거리를 주는 점에서 잔차가 부분 공간과 직각을 이루고,
// 다른 어떤 점을 골라도 그 직각 지점보다 멀다. 두 모드는 같은 주장을 부분 공간과 그 평행 이동에서 본다.
const OK = "#10b981";   // 직각이 성립한 상태를 알리는 색. 두 테마 공통.

type Mode = "subspace" | "variety";

interface Props {
    width?: number;
    height?: number;
}

const ProjectionExplorer = ({width: fixedWidth, height = 360}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;
    const plane = makePlane(width, height, 2.6, 2.0);

    const [mode, setMode] = useState<Mode>("subspace");
    // 방향 핸들은 기본 x̂ 위치보다 바깥에 둔다. 겹치면 두 점이 하나로 보인다.
    const [dir, setDir] = useState({x: 2.1, y: 0.77});
    // 기본값은 x̂ 도 잔차도 눈에 띄게 길어지도록 고른다. x 가 M 과 거의 직교하면 x̂ 이 원점으로
    // 무너져 그림이 아무것도 말해 주지 않는다.
    const [x, setX] = useState({x: 0.6, y: 1.6});
    // 경쟁자 m 의 직선 위 위치(단위 방향 기준 배수). 방향 핸들과 겹치지 않도록 반대쪽에 둔다.
    const [tm, setTm] = useState(-1.4);
    const [offset, setOffset] = useState(0.9); // variety 모드에서 직선이 원점에서 떨어진 거리.

    const dlen = Math.hypot(dir.x, dir.y);
    const u = dlen < 1e-9 ? {x: 1, y: 0} : {x: dir.x / dlen, y: dir.y / dlen};
    // 직선의 법선. variety 모드에서 원점으로부터의 평행 이동 방향으로 쓴다.
    const nrm = {x: -u.y, y: u.x};
    const shift = mode === "variety" ? {x: nrm.x * offset, y: nrm.y * offset} : {x: 0, y: 0};

    // subspace 모드: x 에 가장 가까운 M 위의 점. variety 모드: 원점에 가장 가까운 V 위의 점.
    const target = mode === "subspace" ? x : {x: 0, y: 0};
    const s = (target.x - shift.x) * u.x + (target.y - shift.y) * u.y;
    const hat = {x: shift.x + s * u.x, y: shift.y + s * u.y};
    const resid = {x: target.x - hat.x, y: target.y - hat.y};
    const dist = Math.hypot(resid.x, resid.y);

    const m = {x: shift.x + tm * u.x, y: shift.y + tm * u.y};
    const mDist = Math.hypot(target.x - m.x, target.y - m.y);
    const perp = Math.abs(resid.x * u.x + resid.y * u.y);

    const hp = plane.px(hat.x, hat.y);
    const tp = plane.px(target.x, target.y);

    // 직각 표시. 잔차 방향과 직선 방향으로 각각 한 칸씩 나간 작은 정사각형.
    const sq = 11;
    const rn = dist < 1e-6 ? {x: 0, y: 0} : {x: resid.x / dist, y: resid.y / dist};
    const cornerA = {x: hp.x + u.x * sq, y: hp.y - u.y * sq};
    const cornerB = {x: hp.x + rn.x * sq, y: hp.y - rn.y * sq};

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                {mode === "variety" && (
                    <SpanLine plane={plane} x={u.x} y={u.y} color={colors.border} strokeWidth={1.5}
                              dash={[5, 5]}/>
                )}
                <SpanLine plane={plane} x={u.x} y={u.y} offset={shift} color={colors.accent}
                          strokeWidth={2.5}/>

                {/* 반지름 d 인 원이 직선에 접한다는 사실이 "이보다 가까울 수 없다"의 그림판 증명이다. */}
                <Circle x={tp.x} y={tp.y} radius={plane.unit * dist} stroke={colors.muted} strokeWidth={1}
                        dash={[4, 4]} opacity={0.6} listening={false}/>

                {dist > 1e-6 && (
                    <Line points={[cornerA.x, cornerA.y,
                        cornerA.x + rn.x * sq, cornerA.y - rn.y * sq,
                        cornerB.x, cornerB.y]}
                          stroke={OK} strokeWidth={1.5} listening={false}/>
                )}

                <Line points={[tp.x, tp.y, plane.px(m.x, m.y).x, plane.px(m.x, m.y).y]}
                      stroke={colors.muted} strokeWidth={1.5} dash={[5, 4]} listening={false}/>

                {mode === "subspace" ? (
                    <>
                        {/* 잔차에는 라벨을 달지 않는다. 화살촉이 x 에서 끝나 x 라벨과 겹친다.
                            이름은 아래 판독 줄이 적어 준다. */}
                        <VecArrow plane={plane} x={target.x} y={target.y} from={hat} color={OK}
                                  strokeWidth={3}/>
                        <VecArrow plane={plane} x={hat.x} y={hat.y} color={colors.accent} label="x̂"
                                  strokeWidth={2.5}/>
                        <VecArrow plane={plane} x={x.x} y={x.y} color={colors.accent2} label="x"
                                  strokeWidth={2.5}/>
                    </>
                ) : (
                    <VecArrow plane={plane} x={hat.x} y={hat.y} color={OK} label="v*" strokeWidth={3}/>
                )}

                {/* 직선 위를 미끄러지는 경쟁자. 어디에 두어도 잔차보다 짧아지지 않는다. */}
                <DragDot plane={plane} x={m.x} y={m.y} color={colors.muted} fill={colors.bg} radius={6}
                         constrain={(v) => {
                             const k = (v.x - shift.x) * u.x + (v.y - shift.y) * u.y;
                             return {x: shift.x + k * u.x, y: shift.y + k * u.y};
                         }}
                         onMove={(v) => setTm((v.x - shift.x) * u.x + (v.y - shift.y) * u.y)}/>
                <DragDot plane={plane} x={dir.x} y={dir.y} color={colors.accent}
                         fill={colors.bg} radius={6} onMove={(v) => setDir(v)}/>
                {mode === "subspace" && (
                    <DragDot plane={plane} x={x.x} y={x.y} color={colors.accent2} fill={colors.bg}
                             onMove={(v) => setX(v)}/>
                )}
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {(["subspace", "variety"] as Mode[]).map((v) => (
                    <button key={v} type="button" onClick={() => setMode(v)}
                            className={cn("px-2.5 py-1 rounded border",
                                mode === v
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {v === "subspace"
                            ? t("subspace M", "부분 공간 M")
                            : t("linear variety V", "linear variety V")}
                    </button>
                ))}
                {mode === "variety" && (
                    <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                        <span className="font-mono">{t("offset", "이동")} {fmt(offset)}</span>
                        <input type="range" min={-2} max={2} step={0.05} value={offset}
                               aria-label={t("offset of V from the origin", "원점에서 V까지의 이동량")}
                               onChange={(e) => setOffset(Number(e.target.value))}
                               className="w-28 accent-[var(--accent)]"/>
                    </label>
                )}
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: perp < 1e-6 ? OK : colors.muted}}>
                {mode === "subspace"
                    ? `d(x, M) = ${fmt(dist, 3)} ≤ ‖x − m‖ = ${fmt(mDist, 3)}`
                    : `‖v*‖ = ${fmt(dist, 3)} ≤ ‖v‖ = ${fmt(mDist, 3)}`}
                {" · "}⟨{mode === "subspace" ? "x − x̂" : "v*"}, u⟩ = {fmt(perp, 3)}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {mode === "subspace"
                    ? t("Drag the point anywhere: the residual always meets the subspace at a right angle, and every other point of the subspace is farther away. That right angle is the whole content of the Projection Theorem, and it is what the normal equations solve for.",
                        "점을 아무 데나 끌어 보라. 잔차는 언제나 부분 공간과 직각으로 만나고, 부분 공간 위의 다른 점은 전부 더 멀다. 사영 정리가 말하는 것은 그 직각 하나이고, normal equation이 푸는 것도 그것이다.")
                    : t("V does not pass through the origin, so it is not a subspace. The shortest vector in it is still found by dropping a perpendicular, but now the perpendicular is to the direction of V, not to V itself. This is the minimum-norm solution of an underdetermined system.",
                        "V는 원점을 지나지 않으므로 부분 공간이 아니다. 그래도 그 안의 가장 짧은 벡터는 수선을 내려 찾는다. 다만 수선을 내리는 상대가 V 자체가 아니라 V의 방향이다. 이것이 underdetermined 문제의 최소 norm 해다.")}
            </p>
        </div>
    );
};

export default ProjectionExplorer;
