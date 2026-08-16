// 6장 그림들이 공유하는 해석학 계산. 그림은 그리기만 하고 수치는 전부 여기서 만든다.
// 같은 수열/사상을 그림마다 다시 구현하면 본문이 인용한 숫자와 화면의 숫자가 갈라지므로
// 한 군데에 모아 두고, 본문에 적은 값은 모두 이 함수들이 실제로 내놓는 값이다.

// ---------------------------------------------------------------------------
// 6.3 수열과 극한 (epsilon-N)

export type SequenceId = "harmonic" | "alternating" | "oscillate" | "diverge";

export interface SequenceFamily {
    id: SequenceId;
    term: (n: number) => number;
    // 극한이 존재하는 수열이면 그 값. 존재하지 않으면 "독자가 극한이라고 찍어 볼 후보"다.
    candidate: number;
    converges: boolean;
    // 주어진 epsilon 에 대해 정의를 만족시키는 가장 작은 N. 그런 N 이 없으면 null.
    // 화면에 보이는 구간만 훑어서 "없다"고 판정하면 거짓말이 되므로, 각 수열의 성질에서
    // 닫힌 꼴로 계산한다.
    smallestN: (eps: number) => number | null;
}

export const SEQUENCES: Record<SequenceId, SequenceFamily> = {
    // x_n = 2 + 3/n. 한쪽에서만 다가간다.
    harmonic: {
        id: "harmonic",
        term: (n) => 2 + 3 / n,
        candidate: 2,
        converges: true,
        // |x_n - 2| = 3/n < eps  <=>  n > 3/eps
        smallestN: (eps) => Math.floor(3 / eps) + 1,
    },
    // x_n = 2 + 3(-1)^n/n. 양쪽을 오가면서도 수렴한다 (진동 != 발산).
    alternating: {
        id: "alternating",
        term: (n) => 2 + (3 * (n % 2 === 0 ? 1 : -1)) / n,
        candidate: 2,
        converges: true,
        smallestN: (eps) => Math.floor(3 / eps) + 1,
    },
    // x_n = 2 + (-1)^n. 두 값 사이를 영원히 오간다.
    oscillate: {
        id: "oscillate",
        term: (n) => 2 + (n % 2 === 0 ? 1 : -1),
        candidate: 2,
        converges: false,
        // |x_n - 2| = 1 이 모든 n 에서 성립하므로 eps <= 1 에서는 어떤 N 도 통하지 않는다.
        // eps > 1 이면 띠가 수열 전체를 삼키므로 N = 1 이 통한다. 정의가 깨지는 곳은
        // "작은 eps" 쪽이고, 작은 eps 가 정의의 전부다.
        smallestN: (eps) => (eps > 1 ? 1 : null),
    },
    // x_n = 2 + n/6. 유계가 아니다.
    diverge: {
        id: "diverge",
        term: (n) => 2 + n / 6,
        candidate: 2,
        converges: false,
        // |x_n - 2| = n/6 는 커지기만 하므로 어떤 eps 에서도 꼬리가 띠 안에 들어오지 않는다.
        smallestN: () => null,
    },
};

// ---------------------------------------------------------------------------
// 6.6 연속성 (epsilon-delta)

export type FunctionId = "smooth" | "jump";

export const CONT_X0 = 1;
// 불연속 예제의 도약 폭. 교재 Figure 6.4 처럼 eps 를 이 값보다 작게 잡으면 어떤 delta 도 통하지 않는다.
export const JUMP = 1.2;

export interface FunctionSample {
    id: FunctionId;
    at: (x: number) => number;
    continuous: boolean;
    // 주어진 eps 에서 정의를 만족시키는 가장 큰 delta. 그런 delta 가 없으면 null.
    largestDelta: (eps: number) => number | null;
}

// f(x) = x^2 을 [0, 2] 에서 본다. x0 = 1 에서 f(x0) = 1.
const smoothAt = (x: number) => x * x;
// f(x) < 1 + eps 이고 f(x) > 1 - eps 인 x 구간은 (sqrt(1-eps), sqrt(1+eps)) 이므로
// 양쪽 여유 중 작은 쪽이 가장 큰 delta 다. eps >= 1 이면 왼쪽 제약이 사라지고 x0 까지의 거리 1 이 한계다.
const smoothDelta = (eps: number) => {
    const lo = eps < 1 ? Math.sqrt(1 - eps) : 0;
    return Math.min(CONT_X0 - lo, Math.sqrt(1 + eps) - CONT_X0);
};

// x0 에서 위로 JUMP 만큼 뛰는 함수. x0 자리의 값은 왼쪽 가지를 따른다.
const jumpAt = (x: number) => (x <= CONT_X0 ? x / 2 : x / 2 + JUMP);

export const FUNCTIONS: Record<FunctionId, FunctionSample> = {
    smooth: {id: "smooth", at: smoothAt, continuous: true, largestDelta: smoothDelta},
    jump: {
        id: "jump",
        at: jumpAt,
        continuous: false,
        // x0 오른쪽 점은 delta 를 아무리 줄여도 값이 최소 JUMP 만큼 떨어져 있다.
        // 따라서 eps <= JUMP 에서는 delta 가 존재하지 않는다.
        largestDelta: (eps) => (eps > JUMP ? Math.min(2 * (eps - JUMP), 1) : null),
    },
};

// 후보 delta 가 통하지 않을 때, 정의를 깨는 점을 하나 실제로 찾아 돌려준다.
// 교재는 도약 예제에서 x = x0 + delta/2 를 집어 주지만, 위반이 어느 쪽에서 일어나는지는
// 함수마다 다르므로 창 전체를 훑어 가장 크게 벗어나는 점을 고른다. 통하는 delta 면 null.
export function witnessFor(fn: FunctionSample, eps: number, delta: number): number | null {
    const y0 = fn.at(CONT_X0);
    let worst = CONT_X0;
    let gap = 0;
    const n = 400;
    for (let i = 0; i <= n; i++) {
        // 열린 공 B_delta(x0) 이므로 양 끝은 살짝 안쪽으로 당긴다.
        const x = CONT_X0 - delta + (2 * delta * i) / n;
        if (Math.abs(x - CONT_X0) >= delta) continue;
        const d = Math.abs(fn.at(x) - y0);
        if (d > gap) {
            gap = d;
            worst = x;
        }
    }
    return gap >= eps ? worst : null;
}

// ---------------------------------------------------------------------------
// 6.2 Newton-Raphson: f(x) = x^3 - x

export const CUBIC_ROOTS = [-1, 0, 1] as const;
export type RootLabel = "-1" | "0" | "+1" | "none";

export const cubic = (x: number) => x ** 3 - x;
export const cubicPrime = (x: number) => 3 * x * x - 1;

// N(x) = x - f(x)/f'(x) = 2x^3/(3x^2 - 1). f'(x) = 0 인 x = +-1/sqrt(3) 에서 접선이 수평이라
// 다음 점이 정의되지 않는다.
export function newtonStep(x: number): number | null {
    const d = cubicPrime(x);
    if (Math.abs(d) < 1e-13) return null;
    return (2 * x ** 3) / d;
}

// 1/sqrt(5) 는 정확한 2-주기점이다: N(1/sqrt5) = -1/sqrt5, N(-1/sqrt5) = 1/sqrt5.
// 반발성(|N'| = 13.4)이라 주변 점들이 세 뿌리로 잘게 갈라지고, 그 갈라짐이 basin 그림의 줄무늬다.
export const TWO_CYCLE = 1 / Math.sqrt(5);
// f'(x) = 0 인 임계점. basin 경계가 여기서도 갈라진다.
export const CRITICAL = 1 / Math.sqrt(3);

const BASIN_ITERS = 80;
const BASIN_TOL = 1e-10;

// 시작점이 어느 뿌리로 가는지 분류한다. 정해진 걸음 안에 어느 뿌리에도 닿지 못하면 "none".
export function basinOf(x0: number, iters = BASIN_ITERS): RootLabel {
    let x = x0;
    for (let i = 0; i < iters; i++) {
        const next = newtonStep(x);
        if (next === null || !Number.isFinite(next) || Math.abs(next) > 1e10) return "none";
        x = next;
        if (Math.abs(x + 1) < BASIN_TOL) return "-1";
        if (Math.abs(x) < BASIN_TOL) return "0";
        if (Math.abs(x - 1) < BASIN_TOL) return "+1";
    }
    return "none";
}

// 한 시작점의 궤도. 접선을 그리려면 각 걸음의 x 가 필요하다.
export function newtonOrbit(x0: number, steps: number): number[] {
    const orbit = [x0];
    let x = x0;
    for (let i = 0; i < steps; i++) {
        const next = newtonStep(x);
        if (next === null || !Number.isFinite(next) || Math.abs(next) > 1e10) break;
        x = next;
        orbit.push(x);
    }
    return orbit;
}

// ---------------------------------------------------------------------------
// 6.5 Contraction mapping: T(x) = c sin(x) + 1

// |T'(x)| = |c cos x| <= |c| 이므로 c 가 곧 Lipschitz 상수다. 슬라이더가 c 를 직접 민다는 뜻이다.
export const contract = (c: number, x: number) => c * Math.sin(x) + 1;

// x = c sin x + 1 의 해. g 는 [0, 6] 에서 부호가 한 번 바뀌므로 이분법이면 충분하다.
export function contractFixedPoint(c: number): number {
    const g = (t: number) => c * Math.sin(t) + 1 - t;
    let lo = 0;
    let hi = 6;
    for (let i = 0; i < 200; i++) {
        const mid = (lo + hi) / 2;
        if (g(lo) * g(mid) <= 0) hi = mid;
        else lo = mid;
    }
    return (lo + hi) / 2;
}

export function contractOrbit(c: number, x0: number, steps: number): number[] {
    const orbit = [x0];
    let x = x0;
    for (let i = 0; i < steps; i++) {
        x = contract(c, x);
        orbit.push(x);
    }
    return orbit;
}

// 정리가 주는 사전 오차 한계. x* 를 몰라도 첫 걸음만으로 계산되는 값이라 실제로 쓸 수 있다.
export const aPrioriBound = (c: number, n: number, firstStep: number) =>
    (c ** n / (1 - c)) * firstStep;

// ---------------------------------------------------------------------------
// 6.4 Cauchy 수열과 완비성

// 유리수 Cauchy 수열: sqrt(2) 의 소수 절단. x_k = floor(sqrt2 * 10^k)/10^k 는 분모가 10^k 인 유리수다.
export const sqrt2Truncation = (k: number) => Math.floor(Math.SQRT2 * 10 ** k) / 10 ** k;

// 교재 Example 6.33 의 함수열. n >= 2 에서 각 f_n 은 연속이고 조각마다 선형이다.
export function ramp(t: number, n: number): number {
    if (t <= 0.5 - 1 / n) return 0;
    if (t <= 0.5) return 1 + n * (t - 0.5);
    return 1;
}

export const rampStep = (t: number) => (t < 0.5 ? 0 : 1);

// ||f_n - f_m||_1 = (1/2)|1/n - 1/m|. 두 경사면 사이 넓이를 손으로 적분한 값이다.
export const rampL1Diff = (n: number, m: number) => 0.5 * Math.abs(1 / n - 1 / m);

// ||f_n - f_step||_1 = 1/(2n). 밑변 1/n, 높이 1 인 삼각형의 넓이다.
export const rampL1ToStep = (n: number) => 1 / (2 * n);
