// 등고선은 marching squares 로 뽑는다. 타원·쌍곡선·평행선·한 점을 경우 나누기 없이 한 코드로 처리한다.
// 3장의 이차 형식 등고선과 7장의 QP 비용 등고선이 같은 계산을 하므로 한 군데에 둔다.
// 반환값은 단위 좌표의 선분 목록 [x1, y1, x2, y2] 이다 (픽셀 변환은 호출부의 plane 이 한다).
export function contour(f: (x: number, y: number) => number, level: number,
                        halfX: number, halfY: number, grid = 56): number[][] {
    const segs: number[][] = [];
    const dx = (2 * halfX) / grid;
    const dy = (2 * halfY) / grid;
    const val: number[][] = [];
    for (let i = 0; i <= grid; i++) {
        val.push([]);
        for (let j = 0; j <= grid; j++) {
            val[i].push(f(-halfX + i * dx, -halfY + j * dy) - level);
        }
    }
    // 셀 변 위에서 부호가 바뀌는 지점을 선형 보간으로 찾고, 그 점들을 이어 한 조각을 만든다.
    const cross = (x1: number, y1: number, v1: number, x2: number, y2: number, v2: number) => {
        const s = v1 / (v1 - v2);
        return [x1 + (x2 - x1) * s, y1 + (y2 - y1) * s];
    };
    for (let i = 0; i < grid; i++) {
        for (let j = 0; j < grid; j++) {
            const x0 = -halfX + i * dx;
            const y0 = -halfY + j * dy;
            const corners: Array<[number, number, number]> = [
                [x0, y0, val[i][j]],
                [x0 + dx, y0, val[i + 1][j]],
                [x0 + dx, y0 + dy, val[i + 1][j + 1]],
                [x0, y0 + dy, val[i][j + 1]],
            ];
            const hits: number[][] = [];
            for (let e = 0; e < 4; e++) {
                const [ax, ay, av] = corners[e];
                const [bx, by, bv] = corners[(e + 1) % 4];
                if ((av < 0) !== (bv < 0)) hits.push(cross(ax, ay, av, bx, by, bv));
            }
            // 안장점 셀에서는 교점이 4 개다. 두 쌍으로 갈라 그으면 잘못 이어 붙는 대각선이 생기지 않는다.
            if (hits.length >= 2) segs.push([...hits[0], ...hits[1]]);
            if (hits.length === 4) segs.push([...hits[2], ...hits[3]]);
        }
    }
    return segs;
}
