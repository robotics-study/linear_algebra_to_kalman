import {useMemo, useState} from "react";
import {Circle, Line, Text} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import {fmt, makePlane} from "../../2d/plane";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";
import {ellipse, makeNormal, Sym2} from "./gauss";

// 5.7.6 은 EKF 를 "KF 와 줄 단위로 같다"고 소개하고 넘어간다. 같지 않은 것이 딱 하나 있는데,
// 비선형 함수를 통과한 정규분포는 더 이상 정규분포가 아니라는 사실이다. EKF 는 그것을
// f(μ) 와 JΣJᵀ 로 우겨 넣는다. 거리·방위 센서는 그 오차가 눈에 보일 만큼 크다.
const SAMPLES = 520;
const HALF = 12;
const TRUE = "#f59e0b";
const ARC_STEPS = 80;

interface Props {
    width?: number;
    height?: number;
}

const EkfLinearization = ({width: fixedWidth, height = 420}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;

    const [degrees, setDegrees] = useState(28);
    const [r0, setR0] = useState(8);
    const sigmaR = 0.25;
    const sigmaT = (degrees * Math.PI) / 180;

    const plane = makePlane(width, height, HALF, HALF * 0.62);

    // 표본은 seed 로 고정한다. 참 분포와 선형화 분포의 차이를 재는 그림에서
    // 표본이 매번 달라지면 그 차이가 잡음에 묻힌다.
    const {pts, mean, cov} = useMemo(() => {
        const n = makeNormal(31337);
        const out: Array<[number, number]> = [];
        let sx = 0;
        let sy = 0;
        for (let i = 0; i < SAMPLES; i++) {
            const r = r0 + sigmaR * n();
            const th = sigmaT * n();
            const x = r * Math.cos(th);
            const y = r * Math.sin(th);
            out.push([x, y]);
            sx += x;
            sy += y;
        }
        const mx = sx / SAMPLES;
        const my = sy / SAMPLES;
        let cxx = 0;
        let cxy = 0;
        let cyy = 0;
        for (const [x, y] of out) {
            cxx += (x - mx) * (x - mx);
            cxy += (x - mx) * (y - my);
            cyy += (y - my) * (y - my);
        }
        const d = SAMPLES - 1;
        return {pts: out, mean: [mx, my] as [number, number], cov: {xx: cxx / d, xy: cxy / d, yy: cyy / d} as Sym2};
    }, [r0, sigmaT]);

    // EKF 가 쓰는 것. 평균은 f(μ) 그대로 두고, 공분산만 야코비안으로 밀어 보낸다.
    // θ 의 평균이 0 이므로 J = [[1, 0], [0, r₀]] 이고 JΣJᵀ 는 축에 나란한 타원이 된다.
    const linCov: Sym2 = {xx: sigmaR * sigmaR, xy: 0, yy: r0 * r0 * sigmaT * sigmaT};
    // θ ~ N(0, σ²) 이면 E{cos θ} = e^{−σ²/2} 이므로 참 평균의 반지름은 정확히 이만큼 줄어든다.
    const exactMeanX = r0 * Math.exp(-(sigmaT * sigmaT) / 2);
    const bias = Math.hypot(mean[0] - r0, mean[1]);

    const project = (p: {x: number; y: number}) => plane.px(p.x, p.y);
    const ellipsePts = (mx: number, my: number, s: Sym2, k: number) =>
        ellipse(mx, my, s, k).flatMap((p) => {
            const q = project(p);
            return [q.x, q.y];
        });

    // 정확한 상의 곡선. r = r₀ 로 고정하고 θ 만 흔들면 원호가 나온다. EKF 는 이 원호를
    // 원점에서 r₀ 만큼 떨어진 곳의 접선으로 바꿔치기한다.
    const arc: number[] = [];
    const tangent: number[] = [];
    for (let i = 0; i <= ARC_STEPS; i++) {
        const th = -2.5 * sigmaT + (5 * sigmaT * i) / ARC_STEPS;
        const q = project({x: r0 * Math.cos(th), y: r0 * Math.sin(th)});
        arc.push(q.x, q.y);
        const l = project({x: r0, y: r0 * th});
        tangent.push(l.x, l.y);
    }

    const meanPx = project({x: mean[0], y: mean[1]});
    const linPx = project({x: r0, y: 0});

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                {pts.map(([x, y], i) => {
                    const q = project({x, y});
                    return <Circle key={i} x={q.x} y={q.y} radius={1.6} fill={TRUE} opacity={0.4}
                                   listening={false}/>;
                })}

                <Line points={arc} stroke={colors.muted} strokeWidth={1.4} listening={false}/>
                <Line points={tangent} stroke={colors.accent} strokeWidth={1.4} dash={[5, 4]}
                      opacity={0.8} listening={false}/>

                <Line points={ellipsePts(mean[0], mean[1], cov, 2)} closed stroke={TRUE}
                      strokeWidth={2.2} listening={false}/>
                <Line points={ellipsePts(r0, 0, linCov, 2)} closed stroke={colors.accent}
                      strokeWidth={2.2} dash={[6, 4]} listening={false}/>

                <Circle x={meanPx.x} y={meanPx.y} radius={4.5} fill={TRUE} listening={false}/>
                <Circle x={linPx.x} y={linPx.y} radius={4.5} fill={colors.accent} listening={false}/>
                <Text text={t("true 2σ", "참 2σ")} x={12} y={12} fontSize={11} fontFamily="monospace"
                      fill={TRUE} listening={false}/>
                <Text text={t("EKF 2σ", "EKF 2σ")} x={12} y={27} fontSize={11} fontFamily="monospace"
                      fill={colors.accent} listening={false}/>
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-24">σθ = {degrees}°</span>
                    <input type="range" min={2} max={55} step={1} value={degrees}
                           aria-label={t("bearing standard deviation", "방위각 표준편차")}
                           onChange={(e) => setDegrees(Number(e.target.value))}
                           className="w-32 accent-[var(--accent)]"/>
                </label>
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-24">r₀ = {fmt(r0, 1)}</span>
                    <input type="range" min={3} max={10} step={0.5} value={r0}
                           aria-label={t("nominal range", "기준 거리")}
                           onChange={(e) => setR0(Number(e.target.value))}
                           className="w-24 accent-[var(--accent)]"/>
                </label>
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: colors.accent}}>
                {t("true mean", "참 평균")} ({fmt(mean[0], 3)}, {fmt(mean[1], 3)}) · EKF ({fmt(r0, 3)}, 0) ·{" "}
                {t("bias", "치우침")} {fmt(bias, 3)}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                r₀·e^(−σθ²/2) = {fmt(exactMeanX, 3)} · var x: {t("true", "참")} {fmt(cov.xx, 4)} ·{" "}
                EKF {fmt(linCov.xx, 4)}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">
                {t("A range and bearing sensor reads a point in polar coordinates and the filter needs it in Cartesian. The orange cloud is the truth: a Gaussian in (range, bearing) pushed through the exact map. The grey arc is where those samples must live, and the dashed blue line is the tangent the EKF substitutes for it. At a few degrees of bearing noise the two agree and the EKF is honest. Turn the noise up and the cloud bends into a banana: its mean pulls in towards the sensor by exactly the factor exp(-sigma-theta squared over two), while the EKF keeps claiming the mean is still at the nominal range, and the true spread along the range axis grows by orders of magnitude while the linearized ellipse does not move at all in that direction. The estimate is now confidently wrong, which is the failure mode that makes an EKF diverge.",
                    "거리와 방위를 재는 센서는 극좌표로 점을 읽어 주는데 필터는 그것을 직교좌표로 원한다. 주황색 구름이 참값이다. (거리, 방위)에서의 정규분포를 정확한 사상으로 통과시킨 것이다. 회색 원호가 그 표본들이 놓일 수밖에 없는 자리이고, 파란 점선이 EKF가 그 자리에 갖다 놓는 접선이다. 방위 잡음이 몇 도일 때는 둘이 겹치고 EKF는 정직하다. 잡음을 키우면 구름이 바나나처럼 휜다. 참 평균은 센서 쪽으로 당겨진다. 그 배율은 아래 판독 줄에 찍히는 지수 함수 값이고, 방위 잡음이 커질수록 작아진다. 그런데 EKF는 평균이 여전히 기준 거리에 있다고 우기고, 거리 축 방향의 참 퍼짐은 자릿수 단위로 커지는데 선형화된 타원은 그 방향으로 꿈쩍도 하지 않는다. 이제 추정은 자신 있게 틀려 있다. EKF가 발산할 때 벌어지는 일이 바로 이것이다.")}
            </p>
        </div>
    );
};

export default EkfLinearization;
