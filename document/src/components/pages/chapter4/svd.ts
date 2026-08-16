// 4장 그림 셋(SVD 기하, 특이값 스펙트럼, 저계수 근사)이 공유하는 SVD 계산기.
// 브라우저에는 LAPACK 이 없으므로 one-sided Jacobi 를 직접 돌린다. 이 방법을 고른 이유는
// 이 장의 예제가 σ₁/σ₂ = 10⁸ 처럼 극단적으로 벌어진 행렬을 일부러 쓰기 때문이다.
// AᵀA 의 고윳값을 거치는 방식은 그 지점에서 작은 특이값을 통째로 잃는 반면
// (조건수가 제곱되어 10¹⁶ 가 된다), 열 회전만 쓰는 Jacobi 는 작은 특이값도
// 상대 정확도로 남긴다.

export interface Svd {
    // A(n×m) = U · diag(s) · Vᵀ. u 는 n×m, v 는 m×m, s 는 내림차순 m 개.
    u: number[][];
    s: number[];
    v: number[][];
}

const MAX_SWEEPS = 60;
// 열 쌍의 정규화된 내적이 이 값 아래로 내려가면 직교로 본다 (double 의 유효 자릿수 근처).
const ORTHO_TOL = 1e-15;

const zeros = (rows: number, cols: number): number[][] =>
    Array.from({length: rows}, () => Array<number>(cols).fill(0));

const identity = (n: number): number[][] =>
    Array.from({length: n}, (_, i) => Array.from({length: n}, (_, j) => (i === j ? 1 : 0)));

export const transpose = (a: number[][]): number[][] =>
    a[0].map((_, j) => a.map((row) => row[j]));

export function matMul(a: number[][], b: number[][]): number[][] {
    const out = zeros(a.length, b[0].length);
    for (let i = 0; i < a.length; i++) {
        for (let k = 0; k < b.length; k++) {
            const aik = a[i][k];
            if (aik === 0) continue;
            for (let j = 0; j < b[0].length; j++) out[i][j] += aik * b[k][j];
        }
    }
    return out;
}

// σ_k u_k v_kᵀ 를 k = 0..rank-1 까지 더한 것. rank 가 s.length 면 A 를 그대로 복원한다.
export function rankKApprox({u, s, v}: Svd, rank: number): number[][] {
    const n = u.length;
    const m = v.length;
    const out = zeros(n, m);
    for (let k = 0; k < Math.min(rank, s.length); k++) {
        for (let i = 0; i < n; i++) {
            const c = s[k] * u[i][k];
            for (let j = 0; j < m; j++) out[i][j] += c * v[j][k];
        }
    }
    return out;
}

// 유도 행렬 norm ‖A‖ = σ₁ (Definition 4.13). 두 행렬의 차에 쓰면 그것이 곧 근사 오차다.
export const inducedNorm = (a: number[][]): number => svd(a).s[0];

// 이미 직교하는 열 집합에, 표준 기저를 Gram-Schmidt 로 걸러 정규 직교 기저를 채워 넣는다.
// 특이값이 0 인 방향에도 실제 벡터가 있어야 U 가 직교 행렬이 되고, 기하 그림에서
// "U 로 돌린다"는 말이 성립한다.
function completeBasis(cols: number[][], n: number): void {
    for (let e = 0; e < n && cols.length < n; e++) {
        const cand = Array.from({length: n}, (_, i) => (i === e ? 1 : 0));
        for (const c of cols) {
            let dot = 0;
            for (let i = 0; i < n; i++) dot += c[i] * cand[i];
            for (let i = 0; i < n; i++) cand[i] -= dot * c[i];
        }
        const len = Math.hypot(...cand);
        if (len > 1e-8) cols.push(cand.map((x) => x / len));
    }
}

export function svd(a: number[][]): Svd {
    const n = a.length;
    const m = a[0].length;
    // 열을 회전시켜 서로 직교하게 만든다. 수렴하면 W 의 열이 곧 σ_j u_j 다.
    const w = a.map((row) => [...row]);
    const v = identity(m);

    const colDot = (p: number, q: number) => {
        let acc = 0;
        for (let i = 0; i < n; i++) acc += w[i][p] * w[i][q];
        return acc;
    };

    for (let sweep = 0; sweep < MAX_SWEEPS; sweep++) {
        let worst = 0;
        for (let p = 0; p < m - 1; p++) {
            for (let q = p + 1; q < m; q++) {
                const alpha = colDot(p, p);
                const beta = colDot(q, q);
                const gamma = colDot(p, q);
                const scale = Math.sqrt(alpha * beta);
                if (scale === 0 || Math.abs(gamma) <= ORTHO_TOL * scale) continue;
                worst = Math.max(worst, Math.abs(gamma) / scale);

                // 두 열이 이루는 2×2 블록을 정확히 대각화하는 회전각. t = tan θ 는
                // 두 근 중 작은 쪽을 골라야 회전이 작게 유지되어 누적 오차가 커지지 않는다.
                const zeta = (beta - alpha) / (2 * gamma);
                const t = (zeta >= 0 ? 1 : -1) / (Math.abs(zeta) + Math.sqrt(1 + zeta * zeta));
                const c = 1 / Math.sqrt(1 + t * t);
                const s = c * t;

                for (let i = 0; i < n; i++) {
                    const wp = w[i][p];
                    const wq = w[i][q];
                    w[i][p] = c * wp - s * wq;
                    w[i][q] = s * wp + c * wq;
                }
                for (let i = 0; i < m; i++) {
                    const vp = v[i][p];
                    const vq = v[i][q];
                    v[i][p] = c * vp - s * vq;
                    v[i][q] = s * vp + c * vq;
                }
            }
        }
        if (worst === 0) break;
    }

    // 열 길이가 특이값이다. 큰 것부터 오도록 정렬해 σ₁ ≥ σ₂ ≥ … 규약을 맞춘다.
    const order = Array.from({length: m}, (_, j) => j)
        .map((j) => ({j, len: Math.hypot(...w.map((row) => row[j]))}))
        .sort((x, y) => y.len - x.len);

    const s = order.map((o) => o.len);
    const vOut = zeros(m, m);
    order.forEach((o, j) => {
        for (let i = 0; i < m; i++) vOut[i][j] = v[i][o.j];
    });

    // σ 가 0 이면 u = Av/σ 를 쓸 수 없다. 유효한 열만 먼저 모으고 나머지는 채워 넣는다.
    const cutoff = (s[0] ?? 0) * 1e-13;
    const uCols: number[][] = [];
    order.forEach((o, j) => {
        if (s[j] > cutoff) uCols.push(w.map((row) => row[o.j] / s[j]));
    });
    completeBasis(uCols, n);

    const uOut = zeros(n, m);
    for (let j = 0; j < m; j++) {
        const col = uCols[j];
        if (!col) break;
        for (let i = 0; i < n; i++) uOut[i][j] = col[i];
    }

    return {u: uOut, s, v: vOut};
}
