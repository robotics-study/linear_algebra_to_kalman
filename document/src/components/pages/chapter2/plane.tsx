import {KonvaEventObject} from "konva/lib/Node";
import {Arrow, Circle, Line, Text} from "react-konva";
import {globalToMap, mapToGlobal} from "../../../libs/konvaUtils";

// 2장 그림은 모두 같은 R² 평면 위에서 논다. 축과 눈금은 CoordinateCanvas 가 그리므로
// 여기서는 그 resolution 과 정확히 같은 배율로 단위 좌표 ↔ 픽셀 변환만 제공한다.
// (배율을 각 그림이 따로 계산하면 축 눈금과 벡터가 어긋난다.)
export interface Plane {
    width: number;
    height: number;
    // CoordinateCanvas 에 그대로 넘기는 값. 1 단위당 픽셀의 역수다.
    res: number;
    // 1 단위의 픽셀 길이.
    unit: number;
    px: (x: number, y: number) => {x: number; y: number};
    units: (px: number, py: number) => {x: number; y: number};
    // 화면에 들어오는 반경(단위). 직선을 화면 끝까지 늘릴 때 쓴다.
    halfX: number;
    halfY: number;
}

// minHalfX/minHalfY 는 "최소한 이만큼의 단위는 보여야 한다"는 요구다. 캔버스가 좁아지면
// 배율이 줄어들 뿐 보이는 범위는 유지되므로 모바일에서도 그림이 잘리지 않는다.
export function makePlane(width: number, height: number, minHalfX: number, minHalfY: number): Plane {
    const unit = Math.max(10, Math.min(width / (2 * minHalfX), height / (2 * minHalfY)));
    const res = 1 / unit;
    return {
        width,
        height,
        res,
        unit,
        px: (x, y) => globalToMap(width, height, x, y, res),
        units: (px, py) => mapToGlobal(width, height, px, py, res),
        halfX: width / (2 * unit),
        halfY: height / (2 * unit),
    };
}

export const norm = (x: number, y: number) => Math.hypot(x, y);

export const fmt = (v: number, digits = 2) => {
    const r = Number(v.toFixed(digits));
    // -0 이 화면에 그대로 찍히면 읽는 사람이 부호를 의심하게 된다.
    return Object.is(r, -0) ? "0" : String(r);
};

interface ArrowProps {
    plane: Plane;
    x: number;
    y: number;
    // 화살표의 시작점(생략하면 원점).
    from?: {x: number; y: number};
    color: string;
    label?: string;
    labelColor?: string;
    strokeWidth?: number;
    opacity?: number;
    dash?: number[];
}

// 단위 좌표로 그리는 벡터 화살표. 길이가 0에 가까우면 촉을 없앤다 (촉만 남아 방향을 오독하게 된다).
export const VecArrow = ({
                             plane, x, y, from, color, label, labelColor,
                             strokeWidth = 2.5, opacity = 1, dash,
                         }: ArrowProps) => {
    const o = plane.px(from?.x ?? 0, from?.y ?? 0);
    const p = plane.px(x, y);
    const len = Math.hypot(p.x - o.x, p.y - o.y);
    const tiny = len < 7;
    const ux = tiny ? 0 : (p.x - o.x) / len;
    const uy = tiny ? 0 : (p.y - o.y) / len;
    return (
        <>
            <Arrow points={[o.x, o.y, p.x, p.y]} stroke={color} fill={color}
                   strokeWidth={strokeWidth} opacity={opacity} dash={dash}
                   pointerLength={tiny ? 0 : 9} pointerWidth={tiny ? 0 : 8}
                   listening={false}/>
            {label && (
                <Text text={label} fontSize={12} fontStyle="bold" listening={false}
                      fill={labelColor ?? color} opacity={opacity}
                      x={p.x + ux * 14 - 30} y={p.y + uy * 14 - 7}
                      width={60} align="center"/>
            )}
        </>
    );
};

// 단위 좌표로 놓는 드래그 핸들. constrain 으로 허용 위치를 제한하면 (직선 위, 원 위 등)
// 드래그 중에도 그 제약이 그대로 유지된다.
export const DragDot = ({plane, x, y, color, fill, radius = 7, constrain, onMove}: {
    plane: Plane;
    x: number;
    y: number;
    color: string;
    fill?: string;
    radius?: number;
    constrain?: (u: {x: number; y: number}) => {x: number; y: number};
    onMove: (u: {x: number; y: number}) => void;
}) => {
    const p = plane.px(x, y);
    const hover = (cursor: string) => (e: KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = cursor;
    };
    return (
        <Circle x={p.x} y={p.y} radius={radius} fill={fill ?? color} stroke={color} strokeWidth={2}
                draggable
                dragBoundFunc={(pos) => {
                    const raw = plane.units(pos.x, pos.y);
                    const u = constrain ? constrain(raw) : raw;
                    return plane.px(u.x, u.y);
                }}
                onDragMove={(e) => onMove(plane.units(e.target.x(), e.target.y()))}
                onMouseEnter={hover("grab")}
                onMouseLeave={hover("default")}/>
    );
};

// 원점을 지나는 직선(= span{(x, y)})을 화면 끝까지 늘려 그린다. offset 을 주면 평행 이동한다.
export const SpanLine = ({plane, x, y, color, offset, strokeWidth = 2, dash, opacity = 1}: {
    plane: Plane;
    x: number;
    y: number;
    color: string;
    offset?: {x: number; y: number};
    strokeWidth?: number;
    dash?: number[];
    opacity?: number;
}) => {
    const len = norm(x, y);
    if (len < 1e-9) return null;
    const reach = (plane.halfX + plane.halfY + 2) / len;
    const ox = offset?.x ?? 0;
    const oy = offset?.y ?? 0;
    const a = plane.px(ox - x * reach, oy - y * reach);
    const b = plane.px(ox + x * reach, oy + y * reach);
    return <Line points={[a.x, a.y, b.x, b.y]} stroke={color} strokeWidth={strokeWidth}
                 dash={dash} opacity={opacity} listening={false}/>;
};
