import {useMemo, useState} from "react";
import {Circle, Line} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import {DragDot, fmt, makePlane, VecArrow} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {svd} from "./svd";

// Theorem 4.7 은 A = U·Σ·Vᵀ 라고만 적고 지나간다. 그런데 그 한 줄이 말하는 것은
// "어떤 행렬이든 돌리고, 축 방향으로 늘이고, 다시 돌리는 것이 전부"라는 사실이다.
// 단위원을 세 단계로 나누어 통과시키면 그 문장이 그림 한 장으로 끝난다.
const SAMPLES = 180;
const DOTS = 12;

interface Props {
    width?: number;
    height?: number;
}

interface Mat {
    a: number;
    b: number;
    c: number;
    d: number;
}

const PRESETS: Array<[en: string, ko: string, Mat]> = [
    ["worked example", "본문 예제", {a: 3, b: 0, c: 4, d: 5}],
    ["pure rotation", "회전만", {a: 0, b: -1, c: 1, d: 0}],
    ["near singular", "거의 특이", {a: 1, b: 1, c: 1, d: 1.05}],
    ["singular", "특이 행렬", {a: 1, b: 2, c: 2, d: 4}],
];

const STAGE_COUNT = 3;

const SvdGeometry = ({width: fixedWidth, height = 380}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;

    const [m, setM] = useState<Mat>({a: 3, b: 0, c: 4, d: 5});
    const [stage, setStage] = useState(0);
    const [theta, setTheta] = useState(Math.PI / 5);

    const {a, b, c, d} = m;
    const {u, s, v} = useMemo(() => svd([[a, b], [c, d]]), [a, b, c, d]);
    const [s1, s2] = s;

    // 가장 긴 반지름이 σ₁ 이므로, 그것이 화면에 들어오도록 배율을 잡는다.
    const half = Math.max(1.8, s1 * 1.18);
    const plane = makePlane(width, height, half, half);

    // 단계별 사상. 0 은 입력, 1 은 Vᵀ 까지, 2 는 Σ 까지, 3 은 U 까지 (= A 그 자체).
    const apply = (x: number, y: number, upTo: number): {x: number; y: number} => {
        if (upTo === 0) return {x, y};
        // Vᵀx 의 성분은 x 를 각 오른쪽 특이벡터에 사영한 값이다.
        const p1 = v[0][0] * x + v[1][0] * y;
        const p2 = v[0][1] * x + v[1][1] * y;
        if (upTo === 1) return {x: p1, y: p2};
        const q1 = s1 * p1;
        const q2 = s2 * p2;
        if (upTo === 2) return {x: q1, y: q2};
        return {x: u[0][0] * q1 + u[0][1] * q2, y: u[1][0] * q1 + u[1][1] * q2};
    };

    const shape = useMemo(() => {
        const pts: number[] = [];
        for (let i = 0; i <= SAMPLES; i++) {
            const ang = (i / SAMPLES) * 2 * Math.PI;
            const img = apply(Math.cos(ang), Math.sin(ang), stage);
            const p = plane.px(img.x, img.y);
            pts.push(p.x, p.y);
        }
        return pts;
    }, [a, b, c, d, stage, plane.unit, plane.width, plane.height]);

    // 원 위에 고르게 박은 점들. 회전 단계에서는 이 점들이 통째로 돌고,
    // 늘이는 단계에서는 한쪽으로 몰린다. 두 동작의 차이가 여기서 드러난다.
    const dots = useMemo(() => {
        const out: Array<{x: number; y: number}> = [];
        for (let i = 0; i < DOTS; i++) {
            const ang = (i / DOTS) * 2 * Math.PI;
            const img = apply(Math.cos(ang), Math.sin(ang), stage);
            out.push(plane.px(img.x, img.y));
        }
        return out;
    }, [a, b, c, d, stage, plane.unit, plane.width, plane.height]);

    // 단계마다 화살표 두 개가 무엇을 가리키는지가 달라진다.
    // 0: v¹, v² → 1: e¹, e² (V ᵀ 가 특이 방향을 축으로 옮겨 놓았다) → 2: σ 만큼 늘어난 축 → 3: σ u.
    const arrows: Array<{x: number; y: number; label: string; color: string}> = (() => {
        if (stage === 0) {
            return [
                {x: v[0][0], y: v[1][0], label: "v¹", color: colors.accent},
                {x: v[0][1], y: v[1][1], label: "v²", color: colors.accent2},
            ];
        }
        if (stage === 1) {
            return [
                {x: 1, y: 0, label: "e¹", color: colors.accent},
                {x: 0, y: 1, label: "e²", color: colors.accent2},
            ];
        }
        if (stage === 2) {
            return [
                {x: s1, y: 0, label: "σ₁e¹", color: colors.accent},
                {x: 0, y: s2, label: "σ₂e²", color: colors.accent2},
            ];
        }
        return [
            {x: s1 * u[0][0], y: s1 * u[1][0], label: "σ₁u¹", color: colors.accent},
            {x: s2 * u[0][1], y: s2 * u[1][1], label: "σ₂u²", color: colors.accent2},
        ];
    })();

    const inputX = {x: Math.cos(theta), y: Math.sin(theta)};
    const image = apply(inputX.x, inputX.y, stage);
    const imagePx = plane.px(image.x, image.y);
    const originPx = plane.px(0, 0);

    const setEntry = (key: keyof Mat, raw: string) => {
        const n = Number(raw);
        // 입력 중간에 빈 칸이나 "-" 만 남는 순간이 있으므로 숫자가 아니면 직전 값을 지킨다.
        if (raw.trim() !== "" && Number.isFinite(n)) setM((prev) => ({...prev, [key]: n}));
    };

    // 캔버스 라벨과 달리 이 문단은 본문 서체라 수식 기호를 쓰지 않는다. 기호가 필요한 값은
    // 아래 monospace 판독 줄이 보여 준다.
    const CAPTIONS: Array<[string, string]> = [
        ["The unit circle, with the two right singular vectors marked. Nothing has happened yet: these are the input directions the factorization singles out.",
            "단위원과 오른쪽 특이벡터 둘. 아직 아무 일도 일어나지 않았다. 분해가 골라낸 입력 방향일 뿐이다."],
        ["Apply the first orthogonal factor. Orthogonal means the circle stays a circle and no length changes. All it does is turn the two marked directions onto the coordinate axes.",
            "첫 번째 직교 인자를 적용한다. 직교라는 말은 원이 원 그대로이고 어떤 길이도 변하지 않는다는 뜻이다. 표시된 두 방향을 좌표축 위로 돌려놓는 일만 한다."],
        ["Apply the diagonal factor. Now the axes stretch by different amounts, so the circle becomes an axis-aligned ellipse whose two semi-axes are the singular values in the readout below. Every bit of the shape change lives in this one step.",
            "대각 인자를 적용한다. 두 축이 서로 다른 배율로 늘어나 원이 축에 나란한 타원이 되고, 두 반축의 길이가 아래 판독 줄의 특이값이다. 모양이 바뀌는 일은 전부 이 단계에서 일어난다."],
        ["Apply the second orthogonal factor. The ellipse just turns into place, and what you see is the image of the whole unit circle. Its longest radius is the first singular value and its shortest is the second, and that is the entire geometry of the matrix.",
            "두 번째 직교 인자를 적용한다. 타원이 제자리로 돌아앉을 뿐이고, 지금 보이는 것이 단위원 전체의 상이다. 가장 긴 반지름이 첫 특이값, 가장 짧은 것이 둘째 특이값이며, 이 행렬의 기하는 이것이 전부다."],
    ];

    const cond = s2 > 1e-12 ? fmt(s1 / s2, 2) : "∞";

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                {/* 입력 단위원은 늘 옅게 남겨 둔다. 늘어난 정도를 눈으로 잴 기준이 필요하다. */}
                <Circle x={originPx.x} y={originPx.y} radius={plane.unit} stroke={colors.border}
                        strokeWidth={1.5} dash={[5, 5]} listening={false}/>

                <Line points={shape} closed stroke={colors.accent} strokeWidth={2.5} listening={false}/>

                {dots.map((p, i) => (
                    <Circle key={i} x={p.x} y={p.y} radius={3} fill={colors.muted} listening={false}/>
                ))}

                {arrows.map((ar) => (
                    <VecArrow key={ar.label} plane={plane} x={ar.x} y={ar.y} color={ar.color}
                              label={ar.label} strokeWidth={2.5}/>
                ))}

                {/* 끌고 있는 입력 벡터와 그 상. 둘을 점선으로 이어 두면 어디가 어디로 가는지 보인다. */}
                {stage > 0 && (
                    <Line points={[plane.px(inputX.x, inputX.y).x, plane.px(inputX.x, inputX.y).y,
                        imagePx.x, imagePx.y]}
                          stroke={colors.muted} strokeWidth={1} dash={[4, 4]} opacity={0.6}
                          listening={false}/>
                )}
                <Line points={[originPx.x, originPx.y, imagePx.x, imagePx.y]}
                      stroke={colors.accent2} strokeWidth={1.5} listening={false}/>
                <Circle x={imagePx.x} y={imagePx.y} radius={6} fill={colors.accent2} listening={false}/>

                <DragDot plane={plane} x={inputX.x} y={inputX.y} color={colors.accent2} fill={colors.bg}
                         radius={7}
                         constrain={(p) => {
                             const len = Math.hypot(p.x, p.y);
                             return len < 1e-9 ? {x: 1, y: 0} : {x: p.x / len, y: p.y / len};
                         }}
                         onMove={(p) => setTheta(Math.atan2(p.y, p.x))}/>
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <button type="button" onClick={() => setStage((v0) => Math.max(0, v0 - 1))}
                        disabled={stage === 0}
                        className="px-3 py-1 rounded border border-border bg-surface font-semibold
                                   hover:border-[var(--accent)] disabled:opacity-40">
                    {t("back", "이전")}
                </button>
                <span className="px-2.5 py-1 rounded border border-border font-mono text-muted">
                    {["x", "Vᵀx", "ΣVᵀx", "UΣVᵀx"][stage]}
                </span>
                <button type="button" onClick={() => setStage((v0) => Math.min(STAGE_COUNT, v0 + 1))}
                        disabled={stage === STAGE_COUNT}
                        className="px-3 py-1 rounded border border-border bg-surface font-semibold
                                   hover:border-[var(--accent)] disabled:opacity-40">
                    {t("next stage", "다음 단계")}
                </button>
                <button type="button" onClick={() => setStage(0)}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {t("restart", "처음으로")}
                </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {PRESETS.map(([en, ko, preset]) => (
                    <button key={en} type="button" onClick={() => setM(preset)}
                            className={cn("px-2.5 py-1 rounded border",
                                a === preset.a && b === preset.b && c === preset.c && d === preset.d
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {t(en, ko)}
                    </button>
                ))}
                <span className="grid grid-cols-2 gap-1 border-l-2 border-r-2 border-border rounded-[3px] px-1.5 py-1">
                    {(["a", "b", "c", "d"] as const).map((key) => (
                        <input key={key} type="number" step={0.5} value={m[key]} aria-label={`A ${key}`}
                               onChange={(e) => setEntry(key, e.target.value)}
                               className="w-14 px-1 py-0.5 rounded border border-border bg-surface
                                          text-center font-mono text-xs tabular-nums"/>
                    ))}
                </span>
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: colors.accent}}>
                σ₁ = {fmt(s1, 3)} · σ₂ = {fmt(s2, 3)} · σ₁/σ₂ = {cond} · det A = {fmt(a * d - b * c, 3)}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                x = ({fmt(inputX.x)}, {fmt(inputX.y)}) · {["x", "Vᵀx", "ΣVᵀx", "Ax"][stage]} = ({fmt(image.x)},{" "}
                {fmt(image.y)}) · ‖Ax‖ = {fmt(Math.hypot(apply(inputX.x, inputX.y, 3).x,
                apply(inputX.x, inputX.y, 3).y), 3)}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {t(...CAPTIONS[stage])}
            </p>
        </div>
    );
};

export default SvdGeometry;
