import {useState} from "react";
import {Circle, Line} from "react-konva";
import CoordinateCanvas from "../../2d/CoordinateCanvas";
import {DragDot, fmt, makePlane} from "../../2d/plane";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {useCanvasColors} from "../../../libs/useTheme";
import {useMeasuredWidth} from "../../../libs/useMeasuredWidth";

// 열림과 닫힘의 차이는 오직 경계 한 겹이다. 그런데 그 한 겹이 정의를 통째로 뒤집는다.
// 점 p 를 끌고 다니면서 B_eps(p) 가 P 안에 통째로 들어가는지 보면, 왜 내부점만으로 이루어진
// 집합을 열렸다고 부르는지가 눈으로 확인된다.
const OK = "#10b981";
const BAD = "#ef4444";

interface Props {
    width?: number;
    height?: number;
}

type Mode = "open" | "closed";

const OpenClosedExplorer = ({width: fixedWidth, height = 380}: Props) => {
    const t = useTr();
    const colors = useCanvasColors();
    const {ref, width: measured} = useMeasuredWidth<HTMLDivElement>(fixedWidth ?? 620);
    const width = fixedWidth ?? measured;
    const plane = makePlane(width, height, 2.0, 1.6);

    const [mode, setMode] = useState<Mode>("open");
    // 경계 근처에서 시작한다. 한가운데에 두면 어떤 eps 든 들어맞아 그림이 아무것도 묻지 않는다.
    const [p, setP] = useState({x: 0.72, y: 0.42});
    const [eps, setEps] = useState(0.3);

    const r = Math.hypot(p.x, p.y);
    const inSet = mode === "open" ? r < 1 : r <= 1;
    // 여집합까지의 거리. 이 값이 0 보다 커야 p 가 내부점이고, 그 값이 곧 들어갈 수 있는 eps 의 상한이다.
    // 열린 원판이든 닫힌 원판이든 경계 한 겹은 거리에 기여하지 않으므로 두 모드에서 같은 값이다.
    // 내부점이 완전히 같다는 사실이 바로 이 그림이 보이려는 것이다.
    const distToComplement = Math.max(0, 1 - r);
    const distToSet = Math.max(0, r - 1);
    const fits = inSet && eps <= distToComplement;
    // 경계점은 P 안에 있어도 (닫힌 경우) 내부점이 아니다. 이 구분이 이 그림의 전부다.
    const isInterior = r < 1;
    const isClosurePoint = r <= 1;
    const onBoundary = Math.abs(r - 1) < 1e-3;

    const o = plane.px(0, 0);
    const pc = plane.px(p.x, p.y);
    const ballColor = fits ? OK : BAD;

    const verdict = (() => {
        if (!isClosurePoint) {
            return t("p is outside the closure: d(p, P) > 0, so a whole ball around p misses P.",
                "p는 closure 밖이다. d(p, P) > 0이므로 p 둘레의 공 하나가 통째로 P를 비껴간다.");
        }
        if (onBoundary) {
            return mode === "open"
                ? t("p is on the boundary. It is a closure point but not a member: every ball around it leaks out of P, so P is missing a point it touches.",
                    "p는 경계 위에 있다. closure point이지만 원소는 아니다. 둘레의 어떤 공도 P 밖으로 새므로, P는 자기가 닿는 점 하나를 갖고 있지 않다.")
                : t("p is on the boundary and belongs to P, yet it is still not an interior point: every ball around it leaks out. Closed does not mean every point has room.",
                    "p는 경계 위에 있고 P의 원소이지만, 그래도 내부점은 아니다. 둘레의 어떤 공도 밖으로 샌다. 닫혔다는 것이 모든 점에 여유가 있다는 뜻은 아니다.");
        }
        return t("p is an interior point: there is room to spare, and any ball of radius below the number on the right fits entirely inside P.",
            "p는 내부점이다. 여유가 있고, 오른쪽 숫자보다 작은 반지름의 공은 어떤 것이든 P 안에 통째로 들어간다.");
    })();

    return (
        <div ref={ref} className="w-full">
            <CoordinateCanvas width={width} height={height} resolution={plane.res}>
                {/* P 자체. 닫힌 쪽은 경계를 실선으로 그어 경계가 집합에 속함을 표시한다. */}
                <Circle x={o.x} y={o.y} radius={plane.unit} fill={colors.accent} opacity={0.12}
                        listening={false}/>
                <Circle x={o.x} y={o.y} radius={plane.unit} stroke={colors.accent} strokeWidth={2.5}
                        dash={mode === "open" ? [6, 5] : undefined} listening={false}/>
                {/* p 가 내부점일 때 들어갈 수 있는 최대 공. eps 슬라이더가 이 원을 넘으면 새기 시작한다. */}
                {isInterior && (
                    <Circle x={pc.x} y={pc.y} radius={plane.unit * distToComplement}
                            stroke={colors.muted} strokeWidth={1} dash={[3, 4]} opacity={0.8}
                            listening={false}/>
                )}
                <Circle x={pc.x} y={pc.y} radius={plane.unit * eps} fill={ballColor} opacity={0.18}
                        listening={false}/>
                <Circle x={pc.x} y={pc.y} radius={plane.unit * eps} stroke={ballColor} strokeWidth={2}
                        listening={false}/>
                {/* 여집합까지 가장 가까운 방향. 공이 어디로 새는지를 가리킨다. */}
                {r > 1e-6 && (
                    <Line points={[pc.x, pc.y, plane.px(p.x / r, p.y / r).x, plane.px(p.x / r, p.y / r).y]}
                          stroke={colors.muted} strokeWidth={1} dash={[2, 3]} opacity={0.7}
                          listening={false}/>
                )}
                <DragDot plane={plane} x={p.x} y={p.y} color={colors.accent2} fill={colors.bg}
                         onMove={setP}/>
            </CoordinateCanvas>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                {(["open", "closed"] as Mode[]).map((m) => (
                    <button key={m} type="button" onClick={() => setMode(m)}
                            className={cn("px-2.5 py-1 rounded border font-mono",
                                mode === m
                                    ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                    : "border-border text-muted hover:bg-surface")}>
                        {m === "open" ? t("P = open disk", "P = 열린 원판") : t("P = closed disk", "P = 닫힌 원판")}
                    </button>
                ))}
                <label className="flex items-center gap-2 px-2.5 py-1 rounded border border-border text-muted">
                    <span className="font-mono w-20">ε = {fmt(eps, 2)}</span>
                    <input type="range" min={0.05} max={1.2} step={0.01} value={eps}
                           aria-label={t("ball radius epsilon", "공의 반지름 엡실론")}
                           onChange={(e) => setEps(Number(e.target.value))}
                           className="w-28 accent-[var(--accent)]"/>
                </label>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                <button type="button" onClick={() => setP({x: 0.3, y: 0.2})}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {t("put p inside", "p를 안쪽으로")}
                </button>
                <button type="button" onClick={() => setP({x: 0.6, y: 0.8})}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {t("put p on the boundary", "p를 경계 위로")}
                </button>
                <button type="button" onClick={() => setP({x: 1.15, y: 0.5})}
                        className="px-2.5 py-1 rounded border border-border text-muted hover:bg-surface">
                    {t("put p outside", "p를 바깥으로")}
                </button>
            </div>

            <p className="mt-2 text-sm text-center font-mono" style={{color: fits ? OK : BAD}}>
                ‖p‖ = {fmt(r, 3)} · d(p, ~P) = {fmt(distToComplement, 3)} · d(p, P) = {fmt(distToSet, 3)}
                {" · "}B<sub>ε</sub>(p) ⊂ P ? {fits ? "yes" : "no"}
            </p>
            <p className="mt-1 text-xs text-center font-mono text-muted">
                {t("p ∈ P", "p ∈ P")} : {inSet ? "yes" : "no"} · {t("interior point", "내부점")} : {isInterior ? "yes" : "no"}
                {" · "}{t("closure point", "closure point")} : {isClosurePoint ? "yes" : "no"}
                {" · "}{t("largest ε that fits", "들어가는 최대 ε")} = {fmt(distToComplement, 3)}
            </p>
            <p className="mt-2 text-sm text-muted text-center px-2">{verdict}</p>
            <p className="mt-1 text-sm text-muted text-center px-2">
                {t("Both disks contain exactly the same interior points, so switching the toggle changes nothing about the shading. It changes one thing only: whether the dashed rim belongs. The open disk is open because it threw away the very points that have no room, and the closed disk is closed because it kept every point it touches.",
                    "두 원판의 내부점은 완전히 같아서 토글을 바꿔도 색칠은 달라지지 않는다. 달라지는 것은 하나뿐이다. 점선 테두리가 집합에 속하는가. 열린 원판이 열린 이유는 여유가 없는 바로 그 점들을 버렸기 때문이고, 닫힌 원판이 닫힌 이유는 자기가 닿는 점을 모두 갖고 있기 때문이다.")}
            </p>
        </div>
    );
};

export default OpenClosedExplorer;
