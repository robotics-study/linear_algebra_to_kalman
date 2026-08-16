// 5장 그림들이 공유하는 확률/행렬 계산. 정규분포 샘플러와 공분산 타원을 그림마다 따로 두면
// 같은 공분산이 그림마다 다른 모양으로 보이게 되므로 한 군데에 모은다.
// 난수는 전부 seed 를 받는다 — 새로고침할 때마다 그림이 달라지면 본문이 인용한 숫자가 거짓말이 된다.

// mulberry32. 짧고 결정적이며 이 그림들에 필요한 품질은 충분하다.
export function makeRng(seed: number): () => number {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Box-Muller. 한 번 계산하면 표준정규 두 개가 나오므로 남는 쪽을 다음 호출에 쓴다.
export function makeNormal(seed: number): () => number {
    const rng = makeRng(seed);
    let spare: number | null = null;
    return () => {
        if (spare !== null) {
            const v = spare;
            spare = null;
            return v;
        }
        // u = 0 이면 log 가 발산하므로 열린 구간으로 민다.
        const u = Math.max(rng(), 1e-12);
        const v = rng();
        const r = Math.sqrt(-2 * Math.log(u));
        spare = r * Math.sin(2 * Math.PI * v);
        return r * Math.cos(2 * Math.PI * v);
    };
}

// 2×2 대칭 행렬. 공분산은 언제나 대칭이므로 성분 셋이면 충분하다.
export interface Sym2 {
    xx: number;
    xy: number;
    yy: number;
}

// 하삼각 Cholesky 인자. Σ = L Lᵀ 이고, 표준정규 z 에 대해 Lz 는 공분산 Σ 를 갖는다.
// 슬라이더 조작 중 잠깐 semidefinite 로 떨어져도 NaN 이 화면에 나오지 않도록 바닥을 깐다.
export function chol2(s: Sym2): {l11: number; l21: number; l22: number} {
    const l11 = Math.sqrt(Math.max(s.xx, 1e-12));
    const l21 = s.xy / l11;
    const l22 = Math.sqrt(Math.max(s.yy - l21 * l21, 1e-12));
    return {l11, l21, l22};
}

// k-시그마 공분산 타원. 단위원을 Cholesky 인자로 보낸 상이 곧 타원이므로 고윳값 분해가 필요 없다.
export function ellipse(
    mx: number, my: number, s: Sym2, k = 1, steps = 96,
): Array<{x: number; y: number}> {
    const {l11, l21, l22} = chol2(s);
    const pts: Array<{x: number; y: number}> = [];
    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * 2 * Math.PI;
        const c = Math.cos(t);
        const sn = Math.sin(t);
        pts.push({x: mx + k * l11 * c, y: my + k * (l21 * c + l22 * sn)});
    }
    return pts;
}

export const det2 = (s: Sym2) => s.xx * s.yy - s.xy * s.xy;

// 2×2 대칭 행렬의 역행렬. 정보 행렬 Λ = Σ⁻¹ 을 그릴 때 쓴다.
export function inv2(s: Sym2): Sym2 {
    const d = det2(s);
    const safe = Math.abs(d) < 1e-12 ? (d < 0 ? -1e-12 : 1e-12) : d;
    return {xx: s.yy / safe, xy: -s.xy / safe, yy: s.xx / safe};
}

export const normalPdf = (x: number, mu: number, variance: number) => {
    const v = Math.max(variance, 1e-12);
    return Math.exp(-((x - mu) * (x - mu)) / (2 * v)) / Math.sqrt(2 * Math.PI * v);
};

// ---------------------------------------------------------------------------
// 일반 행렬 연산. 2D 추적 그림의 4-상태 필터는 2×2 로 손으로 풀 수 없어 필요하다.
// 크기가 작아(≤ 4×4) 성능은 문제가 되지 않으므로 읽기 쉬운 쪽을 택했다.

export type Mat = number[][];

export const mul = (a: Mat, b: Mat): Mat =>
    a.map((row) => b[0].map((_, j) => row.reduce((acc, v, k) => acc + v * b[k][j], 0)));

export const transpose = (a: Mat): Mat => a[0].map((_, j) => a.map((row) => row[j]));

export const add = (a: Mat, b: Mat): Mat => a.map((row, i) => row.map((v, j) => v + b[i][j]));

export const sub = (a: Mat, b: Mat): Mat => a.map((row, i) => row.map((v, j) => v - b[i][j]));

// 2×2 실행렬(비대칭 허용)의 역행렬. 칼만 이득의 [C P Cᵀ + Q]⁻¹ 가 이 크기다.
export function invMat2(a: Mat): Mat {
    const d = a[0][0] * a[1][1] - a[0][1] * a[1][0];
    const safe = Math.abs(d) < 1e-12 ? 1e-12 : d;
    return [[a[1][1] / safe, -a[0][1] / safe], [-a[1][0] / safe, a[0][0] / safe]];
}

// 대칭성 강제. P 는 이론상 대칭이지만 부동소수점 곱셈을 거치면 미세하게 어긋나고,
// 그 비대칭이 타원 계산에서 눈에 보이는 흔들림으로 자란다.
export const symmetrize = (a: Mat): Mat =>
    a.map((row, i) => row.map((v, j) => (v + a[j][i]) / 2));
