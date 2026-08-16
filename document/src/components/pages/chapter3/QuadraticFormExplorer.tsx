import {useMemo, useState} from "react";
import {Context} from "konva/lib/Context";
import {Shape as KonvaShape} from "konva/lib/Shape";
import {Shape} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import {contour} from "../../2d/contour";
import {DragDot, fmt, makePlane, SpanLine} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";

// xᵀMx 의 부호는 M 의 고윳값 부호가 전부다. 등고선을 그려 두면 그 사실이 모양으로 나타난다.
// 타원이면 두 고윳값이 같은 부호, 쌍곡선이면 부호가 갈리고, 평행선이면 하나가 0 이다.
const POS = "#10b981";  // 양의 레벨 (xᵀMx > 0). 두 테마 공통.
const NEG = "#f43f5e";  // 음의 레벨 (xᵀMx < 0).

const LEVELS = [0.5, 1, 2, 4];

interface Props {
    width?: number;
    height?: number;
}

interface Mat {
    a: number;
    b: number;
    c: number;
}

const PRESETS: Array<[en: string, ko: string, Mat]> = [
    ["positive definite", "positive definite", {a: 2, b: 0.5, c: 1}],
    ["semidefinite", "semidefinite", {a: 1, b: 1, c: 1}],
    ["indefinite", "indefinite", {a: 1, b: 2, c: 1}],
    ["negative definite", "negative definite", {a: -2, b: 0.5, c: -1}],
];

const QuadraticFormExplorer = ({width: fixedWidth, height = 360}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;
    const plane = makePlane(width, height, 2.6, 2.0);

    const [m, setM] = useState<Mat>({a: 2, b: 0.5, c: 1});
    const [x, setX] = useState({x: 1.2, y: 0.8});

    const {a, b, c} = m;
    const tr = a + c;
    const det = a * c - b * b;
    const disc = Math.sqrt(Math.max(0, tr * tr - 4 * det));
    const l1 = (tr + disc) / 2;
    const l2 = (tr - disc) / 2;

    // (M − λI)v = 0 의 해. b 가 0 이면 이미 대각이라 표준 기저가 곧 고유 방향이다.
    const eigVec = (lam: number) =>
        Math.abs(b) > 1e-9 ? {x: b, y: lam - a} : Math.abs(lam - a) < 1e-9 ? {x: 1, y: 0} : {x: 0, y: 1};

    const f = (px: number, py: number) => a * px * px + 2 * b * px * py + c * py * py;

    const layers = useMemo(() => {
        const out: Array<{level: number; segs: number[][]}> = [];
        for (const k of LEVELS) {
            out.push({level: k, segs: contour(f, k, plane.halfX, plane.halfY)});
            out.push({level: -k, segs: contour(f, -k, plane.halfX, plane.halfY)});
        }
        return out;
    }, [a, b, c, plane.halfX, plane.halfY]);

    const EPS = 1e-9;
    const kind: [en: string, ko: string] =
        l2 > EPS ? ["positive definite", "positive definite"]
            : l1 < -EPS ? ["negative definite", "negative definite"]
                : l1 > EPS && l2 < -EPS ? ["indefinite", "indefinite"]
                    : l1 > EPS ? ["positive semidefinite", "positive semidefinite"]
                        : l2 < -EPS ? ["negative semidefinite", "negative semidefinite"]
                            : ["the zero form", "영 이차 형식"];

    const setEntry = (key: keyof Mat, raw: string) => {
        const n = Number(raw);
        // 입력 도중 빈 칸이나 "-" 만 남는 순간이 있어 숫자가 아니면 이전 값을 유지한다.
        if (raw.trim() !== "" && Number.isFinite(n)) setM((prev) => ({...prev, [key]: n}));
    };

    const value = f(x.x, x.y);

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                {layers.map(({level, segs}) => (
                    <Shape key={level}
                           listening={false}
                           stroke={level > 0 ? POS : NEG}
                           strokeWidth={Math.abs(level) === 1 ? 2 : 1.2}
                           opacity={Math.abs(level) === 1 ? 0.95 : 0.5}
                           sceneFunc={(ctx: Context, shape: KonvaShape) => {
                               ctx.beginPath();
                               for (const s of segs) {
                                   const p0 = plane.px(s[0], s[1]);
                                   const p1 = plane.px(s[2], s[3]);
                                   ctx.moveTo(p0.x, p0.y);
                                   ctx.lineTo(p1.x, p1.y);
                               }
                               ctx.strokeShape(shape);
                           }}/>
                ))}

                {/* 고유 방향은 등고선의 축이다. 타원의 장단축이 여기에 정확히 얹힌다. */}
                <SpanLine plane={plane} {...eigVec(l1)} color={colors.muted} strokeWidth={1.2} dash={[6, 5]}/>
                <SpanLine plane={plane} {...eigVec(l2)} color={colors.muted} strokeWidth={1.2} dash={[6, 5]}/>

                <DragDot plane={plane} x={x.x} y={x.y} color={colors.accent} fill={colors.bg} radius={7}
                         onMove={(u) => setX(u)}/>
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {PRESETS.map(([en, ko, preset]) => (
                    <button key={en} type="button" onClick={() => setM(preset)}
                            className={cn("px-2.5 py-1 rounded border",
                                a === preset.a && b === preset.b && c === preset.c
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {t(en, ko)}
                    </button>
                ))}
                <span className="grid grid-cols-2 gap-1 border-l-2 border-r-2 border-border rounded-[3px] px-1.5 py-1">
                    <input type="number" step={0.5} value={a} aria-label="M a"
                           onChange={(e) => setEntry("a", e.target.value)}
                           className="w-14 px-1 py-0.5 rounded border border-border bg-surface
                                      text-center font-mono text-xs tabular-nums"/>
                    <input type="number" step={0.5} value={b} aria-label="M b"
                           onChange={(e) => setEntry("b", e.target.value)}
                           className="w-14 px-1 py-0.5 rounded border border-border bg-surface
                                      text-center font-mono text-xs tabular-nums"/>
                    <input type="number" step={0.5} value={b} aria-label="M b mirrored" readOnly tabIndex={-1}
                           className="w-14 px-1 py-0.5 rounded border border-border bg-surface
                                      text-center font-mono text-xs tabular-nums opacity-60"/>
                    <input type="number" step={0.5} value={c} aria-label="M c"
                           onChange={(e) => setEntry("c", e.target.value)}
                           className="w-14 px-1 py-0.5 rounded border border-border bg-surface
                                      text-center font-mono text-xs tabular-nums"/>
                </span>
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: colors.accent}}>
                λ₁ = {fmt(l1, 3)} · λ₂ = {fmt(l2, 3)} · {t("M is", "M은")} {t(...kind)}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                x = ({fmt(x.x)}, {fmt(x.y)}) · xᵀMx = {fmt(value, 3)} · det M = {fmt(det, 3)}
                {" · "}tr M = {fmt(tr, 3)}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {t("Green level sets are where the quadratic form is positive, red where it is negative. Both eigenvalues positive gives nested ellipses and no red at all. One of each sign gives hyperbolas with a red family too. A zero eigenvalue flattens the ellipse into a pair of parallel lines.",
                    "초록 등고선은 이차 형식이 양인 곳, 빨강은 음인 곳이다. 고윳값이 둘 다 양이면 타원만 겹겹이 나오고 빨강은 아예 없다. 부호가 하나씩 갈리면 쌍곡선이 되고 빨강 무리도 함께 나타난다. 고윳값 하나가 0이 되면 타원이 납작해져 평행한 두 직선이 된다.")}
            </p>
        </div>
    );
};

export default QuadraticFormExplorer;
