import {useEffect, useMemo, useState} from "react";
import {Circle, Line} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import {fmt, makePlane} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {add, chol2, ellipse, invMat2, makeNormal, Mat, mul, sub, Sym2, symmetrize, transpose} from "./gauss";

// 스칼라 필터에서 보이지 않는 것이 하나 있다. 측정하지 않은 성분도 함께 추정된다는 사실이다.
// 여기서는 위치만 재는데 속도까지 좁혀지고, 그 일은 P 의 비대각 성분이 한다.
// 측정 잡음을 일부러 한쪽으로 길게 기울여 두었다. 필터의 타원이 그 방향을 따라 늦게 좁아진다.
const N = 34;
const DT = 1;
const HALF = 9;
const MEAS = "#f59e0b";
const TICK_MS = 420;
// 측정 잡음의 주축을 기울이는 각도. 축에 나란한 잡음만 보면 P 가 늘 대각인 줄 오해하게 된다.
const TILT = (35 * Math.PI) / 180;

interface Props {
    width?: number;
    height?: number;
}

interface Frame {
    truth: [number, number];
    meas: [number, number];
    est: [number, number];
    p: Sym2;
    traceP: number;
    speedErr: number;
}

const A: Mat = [
    [1, 0, DT, 0],
    [0, 1, 0, DT],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
];
const G: Mat = [
    [(DT * DT) / 2, 0],
    [0, (DT * DT) / 2],
    [DT, 0],
    [0, DT],
];
const C: Mat = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
];

function rotatedNoise(scale: number): Mat {
    const c = Math.cos(TILT);
    const s = Math.sin(TILT);
    const rot: Mat = [[c, -s], [s, c]];
    const diag: Mat = [[0.25 * scale, 0], [0, 4 * scale]];
    return symmetrize(mul(mul(rot, diag), transpose(rot)));
}

// 등속 모델 + 위치 측정. 진짜 궤적은 가속도 잡음을 받아 조금씩 휘고, 필터는 그것을 모른 채
// 등속이라고 믿는다. 그 불일치를 감당하는 것이 R 이다.
function runTrack(measScale: number, accelVar: number, seed: number): Frame[] {
    const nProc = makeNormal(seed);
    const nMeas = makeNormal(seed + 4211);
    const Q = rotatedNoise(measScale);
    const R: Mat = [[accelVar, 0], [0, accelVar]];
    const GRG = mul(mul(G, R), transpose(G));
    // 측정 잡음을 상관까지 살려 뽑으려면 Cholesky 인자가 필요하다.
    const {l11, l21, l22} = chol2({xx: Q[0][0], xy: Q[0][1], yy: Q[1][1]});

    let truth: Mat = [[-9], [-6], [0.62], [0.40]];
    let xm: Mat = [[0], [0], [0], [0]];
    let Pm: Mat = [[36, 0, 0, 0], [0, 36, 0, 0], [0, 0, 9, 0], [0, 0, 0, 9]];

    const out: Frame[] = [];
    for (let i = 0; i < N; i++) {
        const z1 = nMeas();
        const z2 = nMeas();
        const y: Mat = [
            [truth[0][0] + l11 * z1],
            [truth[1][0] + l21 * z1 + l22 * z2],
        ];

        const S = add(mul(mul(C, Pm), transpose(C)), Q);
        const K = mul(mul(Pm, transpose(C)), invMat2(S));
        const xp = add(xm, mul(K, sub(y, mul(C, xm))));
        const Pp = symmetrize(sub(Pm, mul(mul(K, C), Pm)));

        out.push({
            truth: [truth[0][0], truth[1][0]],
            meas: [y[0][0], y[1][0]],
            est: [xp[0][0], xp[1][0]],
            p: {xx: Pp[0][0], xy: Pp[0][1], yy: Pp[1][1]},
            traceP: Pp[0][0] + Pp[1][1],
            speedErr: Math.hypot(xp[2][0] - truth[2][0], xp[3][0] - truth[3][0]),
        });

        const ax = Math.sqrt(accelVar) * nProc();
        const ay = Math.sqrt(accelVar) * nProc();
        truth = add(mul(A, truth), mul(G, [[ax], [ay]]));
        xm = mul(A, xp);
        Pm = symmetrize(add(mul(mul(A, Pp), transpose(A)), GRG));
    }
    return out;
}

const Tracking2D = ({width: fixedWidth, height = 440}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;

    const [measScale, setMeasScale] = useState(1);
    const [accelVar, setAccelVar] = useState(0.002);
    const [seed, setSeed] = useState(20250607);
    const [k, setK] = useState(N - 1);
    const [running, setRunning] = useState(false);

    const frames = useMemo(() => runTrack(measScale, accelVar, seed), [measScale, accelVar, seed]);
    const cur = frames[k];
    // 화면 범위를 궤적에서 뽑는다. 상수로 고정하면 과정 잡음을 키웠을 때 진짜 궤적이 캔버스
    // 밖으로 걸어 나가고, 정작 보여 주려는 마지막 구간이 사라진다.
    const extent = useMemo(() => {
        let mx = HALF;
        let my = HALF;
        for (const f of frames) {
            for (const p of [f.truth, f.meas, f.est]) {
                mx = Math.max(mx, Math.abs(p[0]) + 1.5);
                my = Math.max(my, Math.abs(p[1]) + 1.5);
            }
        }
        return {mx, my};
    }, [frames]);
    const plane = makePlane(width, height, extent.mx, extent.my);

    useEffect(() => {
        if (!running) return;
        const id = window.setInterval(() => {
            setK((v) => {
                if (v >= N - 1) {
                    setRunning(false);
                    return v;
                }
                return v + 1;
            });
        }, TICK_MS);
        return () => window.clearInterval(id);
    }, [running]);

    const shown = frames.slice(0, k + 1);
    const px = (p: [number, number]) => plane.px(p[0], p[1]);
    const poly = (pick: (f: Frame) => [number, number]) =>
        shown.flatMap((f) => {
            const q = px(pick(f));
            return [q.x, q.y];
        });

    const ellipsePts = (mx: number, my: number, s: Sym2, mult: number) =>
        ellipse(mx, my, s, mult).flatMap((p) => {
            const q = plane.px(p.x, p.y);
            return [q.x, q.y];
        });

    const measCov = rotatedNoise(measScale);
    const measSym: Sym2 = {xx: measCov[0][0], xy: measCov[0][1], yy: measCov[1][1]};

    // 필터가 실제로 이겼는지 확인한다. 원 측정과 추정의 오차를 같은 방식으로 잰다.
    const rms = (pick: (f: Frame) => [number, number]) =>
        Math.sqrt(
            shown.reduce((acc, f) => {
                const d = pick(f);
                return acc + (d[0] - f.truth[0]) ** 2 + (d[1] - f.truth[1]) ** 2;
            }, 0) / shown.length,
        );

    const reset = () => {
        setRunning(false);
        setK(0);
    };

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                <Line points={poly((f) => f.truth)} stroke={colors.text} strokeWidth={1.6} dash={[6, 4]}
                      listening={false}/>
                {shown.map((f, i) => {
                    const q = px(f.meas);
                    return <Circle key={i} x={q.x} y={q.y} radius={2.6} fill={MEAS}
                                   opacity={i === k ? 1 : 0.45} listening={false}/>;
                })}
                <Line points={poly((f) => f.est)} stroke={colors.accent} strokeWidth={2.4}
                      listening={false}/>

                {/* 측정 잡음 타원. 기울어진 방향이 곧 필터가 늦게 좁히는 방향이다. */}
                <Line points={ellipsePts(cur.meas[0], cur.meas[1], measSym, 1)} closed stroke={MEAS}
                      strokeWidth={1.2} dash={[4, 4]} opacity={0.75} listening={false}/>
                <Line points={ellipsePts(cur.est[0], cur.est[1], cur.p, 2)} closed stroke={colors.accent}
                      strokeWidth={1.2} dash={[4, 4]} opacity={0.6} listening={false}/>
                <Line points={ellipsePts(cur.est[0], cur.est[1], cur.p, 1)} closed stroke={colors.accent}
                      strokeWidth={2} listening={false}/>
                <Circle x={px(cur.truth).x} y={px(cur.truth).y} radius={4} fill={colors.text}
                        listening={false}/>
                <Circle x={px(cur.est).x} y={px(cur.est).y} radius={5} fill={colors.accent}
                        listening={false}/>
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <button type="button" onClick={() => setK((v) => Math.min(N - 1, v + 1))}
                        disabled={k >= N - 1}
                        className="px-3 py-1 rounded border border-border bg-surface font-semibold
                                   hover:border-[var(--accent)] disabled:opacity-40">
                    {t("step", "한 걸음")}
                </button>
                <button type="button" onClick={() => setRunning((v) => !v)} disabled={k >= N - 1}
                        className={cn("px-3 py-1 rounded border font-semibold disabled:opacity-40",
                            running ? "border-[var(--accent)] text-[var(--accent)]"
                                : "border-border bg-surface hover:border-[var(--accent)]")}>
                    {running ? t("pause", "멈춤") : t("run", "연속 실행")}
                </button>
                <button type="button" onClick={reset}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {t("restart", "처음으로")}
                </button>
                <button type="button" onClick={() => { setSeed((v) => v + 1); reset(); }}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {t("new noise", "잡음 다시 뽑기")}
                </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-28">Q × {fmt(measScale, 2)}</span>
                    <input type="range" min={0.25} max={3} step={0.25} value={measScale}
                           aria-label={t("measurement noise scale", "측정 잡음 배율")}
                           onChange={(e) => { setMeasScale(Number(e.target.value)); reset(); }}
                           className="w-24 accent-[var(--accent)]"/>
                </label>
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-28">R = {fmt(accelVar, 4)}</span>
                    <input type="range" min={0.0005} max={0.02} step={0.0005} value={accelVar}
                           aria-label={t("process noise covariance R", "과정 잡음 공분산 R")}
                           onChange={(e) => { setAccelVar(Number(e.target.value)); reset(); }}
                           className="w-24 accent-[var(--accent)]"/>
                </label>
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: colors.accent}}>
                k = {k} · tr P = {fmt(cur.traceP, 3)} · |v̂ − v| = {fmt(cur.speedErr, 3)}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                rms {t("measurement", "측정")} {fmt(rms((f) => f.meas), 3)} · rms{" "}
                {t("estimate", "추정")} {fmt(rms((f) => f.est), 3)}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {t("The filter is given position only, and it starts at the origin knowing nothing. Watch the solid ellipse: it collapses within a few steps, and it collapses fastest across the short axis of the dashed measurement ellipse, because that is the direction the sensor is actually good at. Two things are happening that the equations state but do not show. Velocity is never measured, yet the velocity error falls as well, because the off-diagonal entries of P let a position measurement correct a velocity. And the running errors at the bottom say that the estimate is a better guess of the truth than the raw measurement it just consumed.",
                    "필터에게 주는 것은 위치뿐이고, 시작할 때는 원점에서 아무것도 모른다. 실선 타원을 보라. 몇 걸음 만에 주저앉고, 점선 측정 타원의 짧은 축 방향으로 가장 빨리 주저앉는다. 센서가 실제로 잘 재는 방향이 그쪽이기 때문이다. 식이 말은 하지만 보여 주지 않는 일이 두 가지 일어난다. 속도는 한 번도 측정되지 않는데 속도 오차도 함께 줄어든다. P의 비대각 성분이 위치 측정으로 속도를 고칠 수 있게 해 주기 때문이다. 그리고 아래 누적 오차는 추정이 방금 받아먹은 원 측정보다 참값에 더 가깝다고 말한다.")}
            </p>
        </div>
    );
};

export default Tracking2D;
