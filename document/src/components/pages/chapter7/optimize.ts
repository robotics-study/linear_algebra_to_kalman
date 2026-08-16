import {makeRng} from "../chapter5/gauss";

// 7장 그림들이 공유하는 최적화 계산. 그림은 그리기만 하고 수치는 전부 여기서 만든다.
// 본문이 인용하는 숫자(최적점, 활성 제약, 세 norm 의 적합선)는 모두 이 함수들이 실제로
// 내놓는 값이므로, 그림마다 따로 풀면 본문과 화면이 갈라진다.

export interface Vec2 {
    x: number;
    y: number;
}

// 대칭 2x2 [[a, b], [b, c]]. QP 의 Hessian Q 로 쓴다.
export interface Sym2 {
    a: number;
    b: number;
    c: number;
}

export const dot2 = (u: Vec2, v: Vec2) => u.x * v.x + u.y * v.y;

export const quad = (Q: Sym2, v: Vec2) => Q.a * v.x * v.x + 2 * Q.b * v.x * v.y + Q.c * v.y * v.y;

export const mul2 = (Q: Sym2, v: Vec2): Vec2 => ({
    x: Q.a * v.x + Q.b * v.y,
    y: Q.b * v.x + Q.c * v.y,
});

// 대칭 2x2 의 고윳값. 판별식이 음수로 새는 것은 반올림뿐이므로 0 에서 자른다.
export function eig2(Q: Sym2): [lo: number, hi: number] {
    const tr = Q.a + Q.c;
    const det = Q.a * Q.c - Q.b * Q.b;
    const disc = Math.sqrt(Math.max(0, tr * tr - 4 * det));
    return [(tr - disc) / 2, (tr + disc) / 2];
}

// ---------------------------------------------------------------------------
// 7.1 볼록 집합: 영역을 레벨 집합 {f <= 0} 으로 정의한다.
// 경계선은 등고선 추출이 그려 주고, 점이 안에 있는지는 f 의 부호 하나로 판정된다.
// (경계 다각형을 따로 들고 다니면 "안에 있는가"와 "어디에 그리는가"가 어긋날 수 있다.)

export type RegionId = "disk" | "polygon" | "crescent" | "annulus" | "twoDisks";

export interface Region {
    id: RegionId;
    convex: boolean;
    // 영역은 {(x, y) : f(x, y) <= 0}.
    f: (x: number, y: number) => number;
    // 화면에 띄우는 집합의 정의식 (Konva 캔버스라 KaTeX 를 쓸 수 없어 monospace 로 적는다).
    formula: string;
}

const PENTAGON_R = 2.0;
// 정오각형의 내접 반지름. 꼭짓점이 반지름 PENTAGON_R 인 원 위에 놓인다.
const PENTAGON_APOTHEM = PENTAGON_R * Math.cos(Math.PI / 5);
const PENTAGON_NORMALS = Array.from({length: 5}, (_, i) => {
    const th = Math.PI / 2 + (2 * Math.PI * i) / 5;
    return {x: Math.cos(th), y: Math.sin(th)};
});

export const REGIONS: Record<RegionId, Region> = {
    disk: {
        id: "disk",
        convex: true,
        f: (x, y) => x * x + y * y - 4,
        formula: "C = { x : ||x|| <= 2 }",
    },
    polygon: {
        id: "polygon",
        convex: true,
        // 반평면 다섯 개의 교집합. 교집합이 볼록성을 보존한다는 것이 이 판의 요점이다.
        f: (x, y) => Math.max(...PENTAGON_NORMALS.map((n) => n.x * x + n.y * y - PENTAGON_APOTHEM)),
        formula: "C = { x : a_i' x <= b_i, i = 1..5 }",
    },
    crescent: {
        id: "crescent",
        convex: false,
        // 큰 원판에서 오른쪽으로 밀린 원판을 도려낸다. 위아래 뿔을 잇는 선분이 파인 곳을 지난다.
        f: (x, y) => Math.max(x * x + y * y - 4, 2.25 - ((x - 1) * (x - 1) + y * y)),
        formula: "C = disk(0, 2) \\ disk((1,0), 1.5)",
    },
    annulus: {
        id: "annulus",
        convex: false,
        f: (x, y) => Math.max(x * x + y * y - 4, 1 - (x * x + y * y)),
        formula: "C = { x : 1 <= ||x|| <= 2 }",
    },
    twoDisks: {
        id: "twoDisks",
        convex: false,
        // 합집합. 교집합과 달리 볼록성을 보존하지 않는다는 반례다.
        f: (x, y) => Math.min((x + 1.5) * (x + 1.5) + y * y - 1,
            (x - 1.5) * (x - 1.5) + y * y - 1),
        formula: "C = disk((-1.5,0), 1) U disk((1.5,0), 1)",
    },
};

export const inRegion = (r: Region, p: Vec2) => r.f(p.x, p.y) <= 0;

// 선분 [p, q] 중 집합을 벗어나는 비율. 0 이면 볼록 결합이 전부 안에 있다는 뜻이고,
// 0 보다 크면 그 자체가 정의 7.1 의 반례다.
export function chordEscape(r: Region, p: Vec2, q: Vec2, samples = 200): {
    outside: number;
    // 벗어나는 구간이 있으면 가장 깊이 벗어나는 lambda. 없으면 null.
    worstLambda: number | null;
} {
    let out = 0;
    let worst = -Infinity;
    let worstLambda: number | null = null;
    for (let i = 0; i <= samples; i++) {
        const lam = i / samples;
        const z = {x: lam * p.x + (1 - lam) * q.x, y: lam * p.y + (1 - lam) * q.y};
        const v = r.f(z.x, z.y);
        if (v > 0) {
            out++;
            if (v > worst) {
                worst = v;
                worstLambda = lam;
            }
        }
    }
    return {outside: out / (samples + 1), worstLambda};
}

// ---------------------------------------------------------------------------
// 7.1 볼록 함수: 정의 7.4(현이 그래프 위)와 1차 조건(접선이 그래프 아래)은 같은 성질의
// 두 얼굴이다. 두 판 모두 같은 곡선 위에서 재야 비교가 성립하므로 한 목록으로 둔다.

export type CurveId = "square" | "abs" | "exp" | "cubic" | "wave";

export interface Curve {
    id: CurveId;
    convex: boolean;
    f: (x: number) => number;
    // 미분값. |x| 의 0 처럼 미분이 없는 점에서는 subgradient 하나를 고른다.
    df: (x: number) => number;
    smooth: boolean;
    formula: string;
}

export const CURVES: Record<CurveId, Curve> = {
    square: {
        id: "square", convex: true, smooth: true,
        f: (x) => 0.4 * x * x, df: (x) => 0.8 * x,
        formula: "f(x) = 0.4 x^2",
    },
    abs: {
        id: "abs", convex: true, smooth: false,
        f: (x) => Math.abs(x),
        // 0 에서는 미분이 없다. [-1, 1] 의 subgradient 중 0 을 고르면 그 접선도 여전히 하계다.
        df: (x) => (Math.abs(x) < 1e-9 ? 0 : Math.sign(x)),
        formula: "f(x) = |x|",
    },
    exp: {
        id: "exp", convex: true, smooth: true,
        f: (x) => 0.35 * Math.exp(0.8 * x), df: (x) => 0.28 * Math.exp(0.8 * x),
        formula: "f(x) = 0.35 e^(0.8x)",
    },
    cubic: {
        id: "cubic", convex: false, smooth: true,
        f: (x) => x * x * x / 6 - x, df: (x) => x * x / 2 - 1,
        formula: "f(x) = x^3/6 - x",
    },
    wave: {
        id: "wave", convex: false, smooth: true,
        f: (x) => 0.3 * x * x + Math.cos(2 * x), df: (x) => 0.6 * x - 2 * Math.sin(2 * x),
        formula: "f(x) = 0.3 x^2 + cos 2x",
    },
};

// 정의 7.4 의 위반량: max over lambda of f(lam*p + (1-lam)*q) - (lam*f(p) + (1-lam)*f(q)).
// 볼록이면 0 이하다.
export function chordGap(cv: Curve, p: number, q: number, samples = 240): {
    worst: number;
    worstX: number;
} {
    let worst = -Infinity;
    let worstX = p;
    for (let i = 0; i <= samples; i++) {
        const lam = i / samples;
        const z = lam * p + (1 - lam) * q;
        const gap = cv.f(z) - (lam * cv.f(p) + (1 - lam) * cv.f(q));
        if (gap > worst) {
            worst = gap;
            worstX = z;
        }
    }
    return {worst, worstX};
}

// 1차 조건의 위반량: min over the window of f(z) - (f(a) + f'(a)(z - a)).
// 볼록이면 0 이상이라, 접선이 그래프 전체의 하계가 된다.
export function tangentGap(cv: Curve, a: number, lo: number, hi: number, samples = 320): {
    worst: number;
    worstX: number;
} {
    let worst = Infinity;
    let worstX = a;
    const fa = cv.f(a);
    const ga = cv.df(a);
    for (let i = 0; i <= samples; i++) {
        const z = lo + ((hi - lo) * i) / samples;
        const gap = cv.f(z) - (fa + ga * (z - a));
        if (gap < worst) {
            worst = gap;
            worstX = z;
        }
    }
    return {worst, worstX};
}

// ---------------------------------------------------------------------------
// 반평면 자르기 (Sutherland-Hodgman). 실행 가능 다각형을 그리는 데에도, LP 의 꼭짓점을
// 뽑는 데에도 같은 연산이 필요하다.

export interface HalfPlane {
    // a' x <= b.
    a: Vec2;
    b: number;
}

export function clipPolygon(poly: Vec2[], h: HalfPlane): Vec2[] {
    if (poly.length === 0) return [];
    const val = (p: Vec2) => dot2(h.a, p) - h.b;
    const out: Vec2[] = [];
    for (let i = 0; i < poly.length; i++) {
        const cur = poly[i];
        const nxt = poly[(i + 1) % poly.length];
        const vc = val(cur);
        const vn = val(nxt);
        if (vc <= 0) out.push(cur);
        if ((vc < 0 && vn > 0) || (vc > 0 && vn < 0)) {
            const s = vc / (vc - vn);
            out.push({x: cur.x + (nxt.x - cur.x) * s, y: cur.y + (nxt.y - cur.y) * s});
        }
    }
    return out;
}

// 큰 상자에서 시작해 반평면을 차례로 잘라 실행 가능 집합을 만든다. 상자가 화면보다 훨씬 커야
// 실제로는 무한히 뻗은 영역을 화면 안에서만 잘라 낸 것처럼 보이지 않는다.
export function feasiblePolygon(cons: HalfPlane[], box = 1e3): Vec2[] {
    let poly: Vec2[] = [
        {x: -box, y: -box}, {x: box, y: -box}, {x: box, y: box}, {x: -box, y: box},
    ];
    for (const h of cons) {
        poly = clipPolygon(poly, h);
        if (poly.length === 0) return [];
    }
    return poly;
}

// ---------------------------------------------------------------------------
// 7.3 Quadratic Program: min 1/2 x'Qx + q'x subject to a_i' x <= b_i.
// R^2 이므로 활성 집합을 전부 나열할 수 있다 (크기 0, 1, 2). 각 후보에서 KKT 를 풀고,
// 실행 가능한 후보 중 비용이 가장 낮은 것을 고른다.

export type QpStatus = "optimal" | "unbounded" | "infeasible";

export interface QpResult {
    status: QpStatus;
    x: Vec2 | null;
    value: number | null;
    // 최적점에서 등식으로 만족되는 제약의 인덱스.
    active: number[];
    // Q 가 positive definite 면 최소점이 유일하다.
    unique: boolean;
    // 비용이 아래로 무한히 내려가는 방향 (status 가 unbounded 일 때만).
    ray: Vec2 | null;
}

const QP_TOL = 1e-7;

const qpCost = (Q: Sym2, q: Vec2, x: Vec2) => 0.5 * quad(Q, x) + dot2(q, x);

const feasible = (cons: HalfPlane[], x: Vec2) =>
    cons.every((h) => dot2(h.a, x) - h.b <= 1e-6);

export function solveQp(Q: Sym2, q: Vec2, cons: HalfPlane[]): QpResult {
    const [lo] = eig2(Q);
    const unique = lo > QP_TOL;

    if (feasiblePolygon(cons).length === 0) {
        return {status: "infeasible", x: null, value: null, active: [], unique, ray: null};
    }

    // 아래로 무한히 내려가는 실행 가능한 반직선이 있으면 최소점 자체가 없다. 방향만 훑으면
    // 되는 이유는, 비용이 방향 d 를 따라 1/2 t^2 (d'Qd) + t(q'd + ...) 라 d'Qd 의 부호가
    // 결정적이기 때문이다.
    for (let i = 0; i < 720; i++) {
        const th = (2 * Math.PI * i) / 720;
        const d = {x: Math.cos(th), y: Math.sin(th)};
        if (!cons.every((h) => dot2(h.a, d) <= 1e-9)) continue;
        const dQd = quad(Q, d);
        const Qd = mul2(Q, d);
        if (dQd < -QP_TOL || (Math.hypot(Qd.x, Qd.y) < 1e-9 && dot2(q, d) < -QP_TOL)) {
            return {status: "unbounded", x: null, value: null, active: [], unique: false, ray: d};
        }
    }

    const candidates: Array<{x: Vec2; active: number[]}> = [];

    // 활성 제약 없음: 정상성 조건 Qx + q = 0. 3장의 normal equation 이 정확히 이 식이다.
    const det = Q.a * Q.c - Q.b * Q.b;
    if (Math.abs(det) > QP_TOL) {
        const x = {
            x: (-Q.c * q.x + Q.b * q.y) / det,
            y: (Q.b * q.x - Q.a * q.y) / det,
        };
        candidates.push({x, active: []});
    }

    // 제약 하나가 활성: Qx + q + mu*a = 0, a'x = b 를 함께 푼다.
    cons.forEach((h, i) => {
        const t = {x: -h.a.y, y: h.a.x};      // 제약 직선의 접선 방향.
        const tQt = quad(Q, t);
        // 접선 방향으로 비용이 위로 볼록해야 그 직선 위의 정지점이 최소점이다.
        if (tQt <= QP_TOL) return;
        const na = dot2(h.a, h.a);
        if (na < 1e-12) return;
        // x = x_p + s*t 로 두면 (x_p 는 직선 위의 한 점) s 는 1 변수 이차식의 최소점이다.
        const xp = {x: (h.b * h.a.x) / na, y: (h.b * h.a.y) / na};
        const s = -(dot2(mul2(Q, xp), t) + dot2(q, t)) / tQt;
        candidates.push({x: {x: xp.x + s * t.x, y: xp.y + s * t.y}, active: [i]});
    });

    // 두 제약이 동시에 활성: 꼭짓점.
    for (let i = 0; i < cons.length; i++) {
        for (let j = i + 1; j < cons.length; j++) {
            const d = cons[i].a.x * cons[j].a.y - cons[i].a.y * cons[j].a.x;
            if (Math.abs(d) < 1e-9) continue;
            const x = {
                x: (cons[i].b * cons[j].a.y - cons[j].b * cons[i].a.y) / d,
                y: (cons[i].a.x * cons[j].b - cons[j].a.x * cons[i].b) / d,
            };
            candidates.push({x, active: [i, j]});
        }
    }

    let best: {x: Vec2; active: number[]; value: number} | null = null;
    for (const cand of candidates) {
        if (!feasible(cons, cand.x)) continue;
        const value = qpCost(Q, q, cand.x);
        if (!best || value < best.value - 1e-9) best = {...cand, value};
    }
    if (!best) return {status: "infeasible", x: null, value: null, active: [], unique, ray: null};

    // 후보 열거는 활성 집합만 보므로, 실제로 등식이 되는 제약을 최적점에서 다시 읽는다.
    const active = cons
        .map((h, i) => (Math.abs(dot2(h.a, best!.x) - h.b) < 1e-6 ? i : -1))
        .filter((i) => i >= 0);
    return {status: "optimal", x: best.x, value: best.value, active, unique, ray: null};
}

// ---------------------------------------------------------------------------
// 7.4 Linear Program: min f'x over a polygon. 최적값은 꼭짓점에서 잡히고, 목적 방향이
// 한 변에 수직이면 그 변 전체가 최적이 된다. 두 경우를 한 함수가 함께 보고한다.

export interface LpResult {
    best: number;
    // 최적값을 달성하는 꼭짓점의 인덱스. 둘이면 그 사이 변 전체가 최적이다.
    argmin: number[];
    values: number[];
    degenerate: boolean;
}

export function lpOverPolygon(poly: Vec2[], f: Vec2, tol = 1e-7): LpResult {
    const values = poly.map((v) => dot2(f, v));
    const best = Math.min(...values);
    const argmin = values.map((v, i) => (v <= best + tol ? i : -1)).filter((i) => i >= 0);
    return {best, argmin, values, degenerate: argmin.length > 1};
}

// ---------------------------------------------------------------------------
// 7.4 세 norm 으로 직선 맞추기. y = m x + c 의 잔차 r_i = y_i - (m x_i + c) 에 대해
// 2-norm 은 normal equation 으로 닫힌 꼴이 나오지만, 1-norm 과 max-norm 은 그렇지 않다.
// 아래 두 함수는 각 LP 의 basic feasible solution 을 전부 세어 보는 방식이다.
// simplex 가 걸어 다니는 꼭짓점이 바로 이 후보들이고, 자료가 작으니 전부 세면 정확하다.

export interface Pt {
    x: number;
    y: number;
}

export interface Fit {
    m: number;
    c: number;
}

export const residuals = (pts: Pt[], fit: Fit) => pts.map((p) => p.y - (fit.m * p.x + fit.c));

export const cost1 = (pts: Pt[], fit: Fit) =>
    residuals(pts, fit).reduce((s, r) => s + Math.abs(r), 0);

export const cost2 = (pts: Pt[], fit: Fit) =>
    Math.sqrt(residuals(pts, fit).reduce((s, r) => s + r * r, 0));

export const costInf = (pts: Pt[], fit: Fit) =>
    residuals(pts, fit).reduce((s, r) => Math.max(s, Math.abs(r)), 0);

// 2-norm: normal equation A'A x = A'b 를 2 변수에서 손으로 푼 꼴.
export function fitL2(pts: Pt[]): Fit {
    const n = pts.length;
    const sx = pts.reduce((s, p) => s + p.x, 0);
    const sy = pts.reduce((s, p) => s + p.y, 0);
    const sxx = pts.reduce((s, p) => s + p.x * p.x, 0);
    const sxy = pts.reduce((s, p) => s + p.x * p.y, 0);
    const den = n * sxx - sx * sx;
    if (Math.abs(den) < 1e-12) return {m: 0, c: sy / n};
    const m = (n * sxy - sx * sy) / den;
    return {m, c: (sy - m * sx) / n};
}

// 1-norm: LP 의 꼭짓점에서는 잔차 두 개가 정확히 0 이 된다. 즉 최적 직선은 자료점 두 개를
// 지난다. 그래서 모든 점 쌍을 지나는 직선만 세어 보면 최적해가 그 안에 있다.
export function fitL1(pts: Pt[]): Fit {
    let best: Fit = fitL2(pts);
    let bestCost = Infinity;
    for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[j].x - pts[i].x;
            if (Math.abs(dx) < 1e-9) continue;
            const m = (pts[j].y - pts[i].y) / dx;
            const fit = {m, c: pts[i].y - m * pts[i].x};
            const v = cost1(pts, fit);
            if (v < bestCost - 1e-12) {
                bestCost = v;
                best = fit;
            }
        }
    }
    return best;
}

// max-norm: 변수가 (m, c, s) 인 LP 라 꼭짓점에서 제약 세 개가 활성이다. 즉 자료점 세 개가
// 부호를 번갈아 가며 같은 크기의 잔차를 갖는다. 그 세 점과 부호 조합을 전부 세어 본다.
export function fitLinf(pts: Pt[]): Fit {
    let best: Fit = fitL2(pts);
    let bestCost = Infinity;
    const n = pts.length;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            for (let k = j + 1; k < n; k++) {
                for (let mask = 0; mask < 8; mask++) {
                    const sg = [mask & 1, (mask >> 1) & 1, (mask >> 2) & 1].map((v) => (v ? 1 : -1));
                    // m*x + c + sigma*s = y 를 세 점에 대해 푼다.
                    const rows = [i, j, k].map((idx, t) => [pts[idx].x, 1, sg[t], pts[idx].y]);
                    const sol = solve3(rows);
                    if (!sol) continue;
                    const [m, c, s] = sol;
                    if (s < -1e-9) continue;
                    const fit = {m, c};
                    const v = costInf(pts, fit);
                    if (v < bestCost - 1e-12) {
                        bestCost = v;
                        best = fit;
                    }
                }
            }
        }
    }
    return best;
}

// 부분 피벗을 쓴 3x3 가우스 소거. rows[i] = [a_i1, a_i2, a_i3, b_i].
function solve3(rows: number[][]): [number, number, number] | null {
    const a = rows.map((r) => [...r]);
    for (let col = 0; col < 3; col++) {
        let piv = col;
        for (let r = col + 1; r < 3; r++) if (Math.abs(a[r][col]) > Math.abs(a[piv][col])) piv = r;
        if (Math.abs(a[piv][col]) < 1e-12) return null;
        [a[col], a[piv]] = [a[piv], a[col]];
        for (let r = 0; r < 3; r++) {
            if (r === col) continue;
            const f = a[r][col] / a[col][col];
            for (let cc = col; cc < 4; cc++) a[r][cc] -= f * a[col][cc];
        }
    }
    return [a[0][3] / a[0][0], a[1][3] / a[1][1], a[2][3] / a[2][2]];
}

// 적합 그림의 기준 자료. seed 를 고정해 새로고침해도 본문이 인용한 숫자가 그대로 나온다.
export const FIT_TRUE_SLOPE = 0.6;
export const FIT_TRUE_INTERCEPT = 0.3;

export function fitData(seed = 20260815): Pt[] {
    const rng = makeRng(seed);
    return Array.from({length: 9}, (_, i) => {
        const x = -2.4 + (i * 4.8) / 8;
        return {
            x: Number(x.toFixed(2)),
            y: Number((FIT_TRUE_SLOPE * x + FIT_TRUE_INTERCEPT + (rng() - 0.5) * 0.5).toFixed(2)),
        };
    });
}
