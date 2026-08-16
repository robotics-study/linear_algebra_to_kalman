import {useEffect, useState} from "react";
import {Circle, Line} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {DragDot, fmt, makePlane, SpanLine, VecArrow} from "../../2d/plane";

// e-vector 의 정의는 "Av 가 v 와 같은 직선 위에 놓이는 방향"이다. 단위원을 한 바퀴 돌면서
// Av 를 같이 그려 보면, 두 화살표가 겹치는 각이 곧 e-vector 이고 그때의 배율이 e-value 다.
const OK = "#10b981";     // 정렬(Av ∥ v)을 알리는 상태색. 두 테마 공통.
const SWEEP_DEG_PER_MS = 0.06;
const ALIGN_TOL = 0.03;   // |sin∠(v, Av)| 허용치 ≈ 1.7°

interface Mat {
    a: number;
    b: number;
    c: number;
    d: number;
}

interface Props {
    width?: number;
    height?: number;
}

const PRESETS: Array<[string, string, Mat]> = [
    ["symmetric", "대칭", {a: 2, b: 1, c: 1, d: 2}],
    ["diagonal", "대각", {a: 2, b: 0, c: 0, d: 0.5}],
    ["shear", "전단", {a: 1, b: 1, c: 0, d: 1}],
    ["rotation", "회전", {a: 0, b: 1, c: -1, d: 0}],
    ["reflection", "반사", {a: 1, b: 2, c: 2, d: -2}],
];

const EigenvectorHunt = ({width: fixedWidth, height = 340}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;
    const plane = makePlane(width, height, 3.6, 2.6);

    const [m, setM] = useState<Mat>({a: 2, b: 1, c: 1, d: 2});
    const [deg, setDeg] = useState(20);
    const [playing, setPlaying] = useState(false);
    const [reveal, setReveal] = useState(false);

    useEffect(() => {
        if (!playing) return;
        let raf = 0;
        let last = performance.now();
        const tick = (now: number) => {
            const dt = now - last;
            last = now;
            setDeg((prev) => (prev + dt * SWEEP_DEG_PER_MS) % 360);
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [playing]);

    const rad = (deg * Math.PI) / 180;
    const v = {x: Math.cos(rad), y: Math.sin(rad)};
    const apply = (p: {x: number; y: number}) => ({x: m.a * p.x + m.b * p.y, y: m.c * p.x + m.d * p.y});
    const av = apply(v);
    const avLen = Math.hypot(av.x, av.y);
    const sinAngle = avLen < 1e-9 ? 0 : (v.x * av.y - v.y * av.x) / avLen;
    const aligned = Math.abs(sinAngle) < ALIGN_TOL;
    const lambda = v.x * av.x + v.y * av.y;

    const tr = m.a + m.d;
    const det = m.a * m.d - m.b * m.c;
    const disc = tr * tr - 4 * det;
    const scalarMatrix = Math.abs(m.b) < 1e-9 && Math.abs(m.c) < 1e-9 && Math.abs(m.a - m.d) < 1e-9;
    const realEvals = disc >= -1e-9;
    const l1 = realEvals ? (tr + Math.sqrt(Math.max(0, disc))) / 2 : 0;
    const l2 = realEvals ? (tr - Math.sqrt(Math.max(0, disc))) / 2 : 0;

    // (A − λI)v = 0 의 해. b 나 c 가 0 이 아니면 그 행에서 바로 읽히고, 둘 다 0 이면 대각행렬이라
    // 표준 기저 벡터가 그대로 e-vector 다.
    const eigVec = (lam: number) => {
        if (Math.abs(m.b) > 1e-9) return {x: m.b, y: lam - m.a};
        if (Math.abs(m.c) > 1e-9) return {x: lam - m.d, y: m.c};
        return Math.abs(lam - m.a) < 1e-9 ? {x: 1, y: 0} : {x: 0, y: 1};
    };
    const repeated = realEvals && Math.abs(disc) < 1e-6;
    const fullSet = realEvals && (!repeated || scalarMatrix);

    // 단위원의 상(像). 타원이 원과 만나는 방향이 |λ| = 1 인 곳이고, 타원의 축이 곧 늘어난 방향이다.
    const image: number[] = [];
    for (let i = 0; i < 96; i++) {
        const ang = (i / 96) * 2 * Math.PI;
        const q = apply({x: Math.cos(ang), y: Math.sin(ang)});
        const p = plane.px(q.x, q.y);
        image.push(p.x, p.y);
    }

    const o = plane.px(0, 0);
    const vp = plane.px(v.x, v.y);
    const ap = plane.px(av.x, av.y);
    // 입력 도중 빈 칸이나 "-" 만 남는 순간이 있어 숫자가 아니면 이전 값을 유지한다.
    const setEntry = (key: keyof Mat, raw: string) => {
        const n = Number(raw);
        if (raw.trim() !== "" && Number.isFinite(n)) setM((prev) => ({...prev, [key]: n}));
    };

    const caption = !realEvals
        ? t("The characteristic polynomial has no real root, so Av never lines up with v. This is Example 2.51: the eigenvalues are ±j.",
            "특성 다항식에 실근이 없어서 Av는 v와 끝내 겹치지 않는다. Example 2.51이 바로 이 경우이고 고윳값은 ±j다.")
        : scalarMatrix
            ? t("A is a multiple of the identity, so every nonzero vector is an eigenvector and every angle aligns.",
                "A가 단위 행렬의 상수배라 0이 아닌 모든 벡터가 고유벡터이고 모든 각에서 겹친다.")
            : repeated
                ? t("The two eigenvalues have merged and only one eigen-direction survives, so there is no basis of eigenvectors and A is not similar to a diagonal matrix.",
                    "고윳값 둘이 붙어 버려 고유 방향이 하나만 남는다. 고유벡터로 basis를 만들 수 없으므로 A는 대각 행렬과 닮지 않았다.")
                : t("Two directions survive the sweep. Take them as a basis and A turns into diag(λ₁, λ₂): that is what diagonalization buys you.",
                    "한 바퀴를 돌면 두 방향이 살아남는다. 그 둘을 basis로 잡으면 A는 diag(λ₁, λ₂)가 된다. 대각화가 주는 것이 이것이다.");

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                <Circle x={o.x} y={o.y} radius={plane.unit} stroke={colors.border} strokeWidth={1.5}
                        listening={false}/>
                <Line points={image} closed stroke={colors.accent2} strokeWidth={1.5} opacity={0.45}
                      listening={false}/>

                {reveal && realEvals && !scalarMatrix && (
                    <>
                        <SpanLine plane={plane} {...eigVec(l1)} color={OK} strokeWidth={1.5} dash={[6, 5]}/>
                        {!repeated && (
                            <SpanLine plane={plane} {...eigVec(l2)} color={OK} strokeWidth={1.5} dash={[6, 5]}/>
                        )}
                    </>
                )}

                {/* v 의 끝에서 Av 의 끝으로 잇는 선. 이 선이 원점을 향할 때가 정렬된 순간이다. */}
                <Line points={[vp.x, vp.y, ap.x, ap.y]} stroke={colors.muted} strokeWidth={1}
                      dash={[4, 4]} listening={false}/>
                <VecArrow plane={plane} x={av.x} y={av.y} color={aligned ? OK : colors.accent2}
                          label="Av" strokeWidth={aligned ? 3.5 : 2.5}/>
                <VecArrow plane={plane} x={v.x} y={v.y} color={aligned ? OK : colors.accent}
                          label="v" strokeWidth={aligned ? 3.5 : 2.5}/>
                <DragDot plane={plane} x={v.x} y={v.y} color={aligned ? OK : colors.accent} fill={colors.bg}
                         radius={6}
                         constrain={(u) => {
                             const l = Math.hypot(u.x, u.y);
                             return l < 1e-6 ? {x: 1, y: 0} : {x: u.x / l, y: u.y / l};
                         }}
                         onMove={(u) => {
                             setPlaying(false);
                             setDeg(((Math.atan2(u.y, u.x) * 180) / Math.PI + 360) % 360);
                         }}/>
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {PRESETS.map(([en, ko, preset]) => (
                    <button key={en} type="button" onClick={() => setM(preset)}
                            className={cn("px-2.5 py-1 rounded border",
                                m.a === preset.a && m.b === preset.b && m.c === preset.c && m.d === preset.d
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {t(en, ko)}
                    </button>
                ))}
                <button type="button" onClick={() => setPlaying((p) => !p)}
                        className="px-3 py-1 rounded border border-border bg-surface font-semibold hover:border-[var(--accent)]">
                    {playing ? t("pause", "멈춤") : t("sweep", "한 바퀴")}
                </button>
                <button type="button" onClick={() => setReveal((r) => !r)}
                        className={cn("px-2.5 py-1 rounded border",
                            reveal ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                : "border-border text-muted hover:bg-surface")}>
                    {t("reveal eigen-directions", "고유 방향 보기")}
                </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-xs">
                <span className="grid grid-cols-2 gap-1 border-l-2 border-r-2 border-border rounded-[3px] px-1.5 py-1">
                    {(["a", "b", "c", "d"] as Array<keyof Mat>).map((key) => (
                        <input key={key} type="number" step={0.5} value={m[key]}
                               aria-label={`A ${key}`}
                               onChange={(e) => setEntry(key, e.target.value)}
                               className="w-14 px-1 py-0.5 rounded border border-border bg-surface
                                          text-center font-mono text-xs tabular-nums"/>
                    ))}
                </span>
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono">θ {Math.round(deg)}°</span>
                    <input type="range" min={0} max={359} step={1} value={Math.round(deg)}
                           aria-label={t("angle of v", "v의 각도")}
                           onChange={(e) => {
                               setPlaying(false);
                               setDeg(Number(e.target.value));
                           }}
                           className="w-32 accent-[var(--accent)]"/>
                </label>
            </div>

            <p className="mt-2 text-sm text-center font-mono"
               style={{color: aligned ? OK : colors.muted}}>
                {aligned
                    ? `Av = ${fmt(lambda)}·v`
                    : `|sin∠(v, Av)| = ${fmt(Math.abs(sinAngle))}`}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                {realEvals
                    ? `λ₁ = ${fmt(l1)}, λ₂ = ${fmt(l2)} · ${fullSet
                        ? t("full set of e-vectors", "고유벡터가 basis를 이룬다")
                        : t("no full set of e-vectors", "고유벡터가 basis를 이루지 못한다")}`
                    : `λ = ${fmt(tr / 2)} ± ${fmt(Math.sqrt(-disc) / 2)}j`}
            </p>
            <p className="mt-1 text-sm text-muted text-center px-2">{caption}</p>
        </div>
    );
};

export default EigenvectorHunt;
