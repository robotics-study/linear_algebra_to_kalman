import {useMemo, useState} from "react";
import {Context} from "konva/lib/Context";
import {Shape as KonvaShape} from "konva/lib/Shape";
import {Arrow, Circle, Line, Shape, Text} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import {contour} from "../../2d/contour";
import {DragDot, fmt, makePlane} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {clipPolygon, dot2, eig2, feasiblePolygon, HalfPlane, mul2, quad, solveQp, Sym2, Vec2} from "./optimize";

// QP 는 "제약 없는 최소제곱에 반평면을 얹은 것"이다. 제약을 다 끄면 3장의 정상성 조건이
// 그대로 남고, 제약을 끌어 최적점 위로 밀면 해가 경계로 옮겨 가 그 위를 미끄러진다.
// Q 를 indefinite 로 바꾸면 최소점이 존재하기를 그만두는데, positive definite 가정이
// 편의가 아니라 존재 조건이라는 뜻이다.
const OK = "#10b981";
const BAD = "#ef4444";
const LEVEL_OFFSETS = [0.3, 1.2, 3, 6, 10];
const MIN_OFFSET = 0.35;

interface Props {
    width?: number;
    height?: number;
}

const PRESETS: Array<[en: string, ko: string, Sym2]> = [
    ["positive definite", "positive definite", {a: 2, b: 0.5, c: 1}],
    ["semidefinite", "semidefinite", {a: 1, b: 1, c: 1}],
    ["indefinite", "indefinite", {a: 1, b: 2, c: 1}],
];

const QuadraticProgramLab = ({width: fixedWidth, height = 400}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 640);
    const width = fixedWidth ?? measured;
    const plane = makePlane(width, height, 3.3, 2.7);

    const [Q, setQ] = useState<Sym2>({a: 2, b: 0.5, c: 1});
    // 제약 없는 정지점을 직접 끌게 하고 q 를 거기서 거꾸로 만든다. q 를 숫자로 넣는 것보다
    // "그릇의 바닥이 어디인가"가 훨씬 읽기 쉽다.
    // 초기 상태는 본문의 손풀이 예제와 같은 QP 다: 제약 없는 정지점 (0, 2) 와 x1 + x2 <= 1.
    // 발 점 (0.5, 0.5) 는 정규화하면 a = (1,1)/sqrt(2), b = sqrt(2)/2 이므로 같은 직선이다.
    const [center, setCenter] = useState<Vec2>({x: 0, y: 2});
    const [feet, setFeet] = useState<[Vec2, Vec2]>([{x: 0.5, y: 0.5}, {x: 1.6, y: -1.2}]);
    const [on, setOn] = useState<[boolean, boolean]>([true, false]);

    // Qx + q = 0 이 center 에서 성립하도록 q 를 정한다.
    const qVec = useMemo(() => {
        const Qc = mul2(Q, center);
        return {x: -Qc.x, y: -Qc.y};
    }, [Q, center]);

    const f = (x: number, y: number) => 0.5 * quad(Q, {x, y}) + dot2(qVec, {x, y});

    const allCons: HalfPlane[] = feet.map((p) => {
        const n = Math.hypot(p.x, p.y);
        return {a: {x: p.x / n, y: p.y / n}, b: n};
    });
    // 켜 둔 제약만 푼다. 인덱스가 어긋나지 않도록 원래 번호를 함께 들고 다닌다.
    const activeIdx = [0, 1].filter((i) => on[i]);
    const cons = activeIdx.map((i) => allCons[i]);

    const result = solveQp(Q, qVec, cons);
    const [lo, hi] = eig2(Q);

    const levels = useMemo(() => {
        const base = f(center.x, center.y);
        return LEVEL_OFFSETS.map((d) => ({
            level: base + d,
            segs: contour(f, base + d, plane.halfX, plane.halfY, 64),
        }));
    }, [Q.a, Q.b, Q.c, center.x, center.y, plane.halfX, plane.halfY]);

    // 실행 가능 집합은 실제로는 화면 밖까지 뻗어 있다. 큰 상자에서 잘라 낸 다음 화면 사각형으로
    // 한 번 더 잘라 그린다 (그리기용 자르기라 판정에는 쓰지 않는다).
    const feasibleView = useMemo(() => {
        let poly = feasiblePolygon(cons);
        const view: HalfPlane[] = [
            {a: {x: 1, y: 0}, b: plane.halfX}, {a: {x: -1, y: 0}, b: plane.halfX},
            {a: {x: 0, y: 1}, b: plane.halfY}, {a: {x: 0, y: -1}, b: plane.halfY},
        ];
        for (const h of view) poly = clipPolygon(poly, h);
        return poly;
    }, [feet[0].x, feet[0].y, feet[1].x, feet[1].y, on[0], on[1], plane.halfX, plane.halfY]);

    const keepOff0 = (u: Vec2) => {
        const n = Math.hypot(u.x, u.y);
        return n < MIN_OFFSET ? {x: (u.x / (n || 1)) * MIN_OFFSET, y: (u.y / (n || 1)) * MIN_OFFSET} : u;
    };

    const statusText = result.status === "optimal"
        ? t("minimum attained", "최솟값 도달")
        : result.status === "unbounded"
            ? t("no minimum: cost runs to −∞", "최솟값 없음: 비용이 −∞로 간다")
            : t("feasible set is empty", "실행 가능 집합이 비어 있다");
    const good = result.status === "optimal";

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                {feasibleView.length >= 3 && (
                    <Line points={feasibleView.flatMap((p) => {
                        const px = plane.px(p.x, p.y);
                        return [px.x, px.y];
                    })} closed fill={OK} opacity={0.13} listening={false}/>
                )}

                {levels.map(({level, segs}) => (
                    <Shape key={level} listening={false} stroke={colors.accent}
                           strokeWidth={1.3} opacity={0.55}
                           sceneFunc={(ctx: Context, shape: KonvaShape) => {
                               ctx.beginPath();
                               for (const s of segs) {
                                   const a = plane.px(s[0], s[1]);
                                   const b = plane.px(s[2], s[3]);
                                   ctx.moveTo(a.x, a.y);
                                   ctx.lineTo(b.x, b.y);
                               }
                               ctx.strokeShape(shape);
                           }}/>
                ))}

                {/* 제약 직선. 발 점에서 원점 반대쪽이 금지 구역이다. */}
                {[0, 1].map((i) => {
                    if (!on[i]) return null;
                    const h = allCons[i];
                    const dir = {x: -h.a.y, y: h.a.x};
                    const reach = plane.halfX + plane.halfY + 2;
                    const foot = {x: h.a.x * h.b, y: h.a.y * h.b};
                    const p0 = plane.px(foot.x - dir.x * reach, foot.y - dir.y * reach);
                    const p1 = plane.px(foot.x + dir.x * reach, foot.y + dir.y * reach);
                    const isActive = result.status === "optimal" && result.active.includes(activeIdx.indexOf(i));
                    return (
                        <Line key={i} points={[p0.x, p0.y, p1.x, p1.y]}
                              stroke={isActive ? OK : colors.muted}
                              strokeWidth={isActive ? 3 : 1.8} listening={false}/>
                    );
                })}

                {/* 비용이 아래로 무한히 내려가는 방향. indefinite 를 고르면 여기로 달아난다. */}
                {result.ray && (() => {
                    const from = plane.px(0, 0);
                    const to = plane.px(result.ray.x * (plane.halfX + plane.halfY) * 0.6,
                        result.ray.y * (plane.halfX + plane.halfY) * 0.6);
                    return <Arrow points={[from.x, from.y, to.x, to.y]} stroke={BAD} fill={BAD}
                                  strokeWidth={2.5} pointerLength={10} pointerWidth={9} listening={false}/>;
                })()}

                {result.x && (() => {
                    const px = plane.px(result.x.x, result.x.y);
                    return (
                        <>
                            <Circle x={px.x} y={px.y} radius={9} stroke={OK} strokeWidth={2.5}
                                    listening={false}/>
                            <Circle x={px.x} y={px.y} radius={4} fill={OK} listening={false}/>
                        </>
                    );
                })()}

                <Text text="½x'Qx + q'x" x={10} y={10} fontSize={11} fontFamily="monospace"
                      fill={colors.muted} listening={false}/>

                {[0, 1].map((i) => on[i] && (
                    <DragDot key={i} plane={plane} x={feet[i].x} y={feet[i].y}
                             color={colors.accent2} fill={colors.bg} radius={6}
                             constrain={keepOff0}
                             onMove={(u) => setFeet(i === 0 ? [u, feet[1]] : [feet[0], u])}/>
                ))}
                <DragDot plane={plane} x={center.x} y={center.y} color={colors.accent} fill={colors.bg}
                         onMove={setCenter}/>
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {PRESETS.map(([en, ko, preset]) => (
                    <button key={en} type="button" onClick={() => setQ(preset)}
                            className={cn("px-2.5 py-1 rounded border",
                                Q.a === preset.a && Q.b === preset.b && Q.c === preset.c
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {t(en, ko)}
                    </button>
                ))}
                {[0, 1].map((i) => (
                    <button key={i} type="button"
                            onClick={() => setOn(i === 0 ? [!on[0], on[1]] : [on[0], !on[1]])}
                            className={cn("px-2.5 py-1 rounded border font-mono",
                                on[i]
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {on[i] ? "✓ " : ""}a{i + 1}′x ≤ b{i + 1}
                    </button>
                ))}
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: good ? OK : BAD}}>
                {result.x
                    ? `x* = (${fmt(result.x.x, 3)}, ${fmt(result.x.y, 3)}) · f(x*) = ${fmt(result.value ?? 0, 3)}`
                    : statusText}
                {result.x && ` · ${result.active.length === 0
                    ? t("no constraint binds", "활성 제약 없음")
                    : `${t("active", "활성")}: ${result.active.map((k) => `a${activeIdx[k] + 1}`).join(", ")}`}`}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                λ(Q) = {fmt(lo, 3)}, {fmt(hi, 3)} ·{" "}
                {lo > 1e-7 ? t("positive definite: unique minimizer", "positive definite: 최소점 유일")
                    : lo > -1e-7 ? t("singular: minimizer not unique", "특이: 최소점이 유일하지 않다")
                        : t("indefinite: not a convex cost", "indefinite: 볼록 비용이 아니다")}
                {" · "}q = ({fmt(qVec.x, 2)}, {fmt(qVec.y, 2)})
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {t("With every constraint off, the solid dot sits on the accent handle: that point is the solution of Qx + q = 0, which for a least squares cost is exactly the normal equations. Drag a constraint line across it and the solution slides onto the boundary and stays there, still at the point where a level set is tangent to the line. Switch Q to indefinite and the picture stops having a bottom, which is what the positive definite hypothesis in the QP fact is buying.",
                    "제약을 모두 끄면 채워진 점이 강조색 손잡이 위에 앉는다. 그 점이 Qx + q = 0의 해이고, 비용이 최소제곱이면 그것이 정확히 normal equation이다. 제약 직선을 그 위로 끌어 넘기면 해가 경계로 미끄러져 그 위에 머무는데, 여전히 등고선이 직선에 접하는 지점이다. Q를 indefinite로 바꾸면 그림에 바닥이 사라진다. QP 사실의 positive definite 가정이 사 오는 것이 바로 그 바닥이다.")}
            </p>
        </div>
    );
};

export default QuadraticProgramLab;
