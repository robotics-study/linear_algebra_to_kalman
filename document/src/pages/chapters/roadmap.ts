import {Localized} from "../../../types/global";

// 홈 카드와 Chapter 1 로드맵이 공유하는 챕터 한 줄 소개. 챕터를 추가하면 여기에 함께 적는다.
export interface ChapterBlurb {
    n: number;
    title: Localized<string>;
    blurb: Localized<string>;
}

export const CHAPTER_BLURBS: ChapterBlurb[] = [
    {
        n: 1,
        title: {en: "Introduction to Mathematical Arguments", ko: "수학적 논증 입문"},
        blurb: {
            en: "The notation and the moves: direct proof, contrapositive, exhaustion, induction, " +
                "contradiction, truth tables, negating quantified statements, and what makes the " +
                "real numbers special.",
            ko: "기호와 손기술. 직접 증명, 대우, exhaustion, 귀납법, 귀류법, 진리표, quantifier 명제의 부정, " +
                "그리고 실수를 특별하게 만드는 성질.",
        },
    },
    {
        n: 2,
        title: {en: "Highlights of Abstract Linear Algebra", ko: "추상 선형대수의 핵심"},
        blurb: {
            en: "Practicing proofs where the ground is familiar: vector spaces over a field, " +
                "subspaces, independence, basis and dimension, change of basis, linear operators, " +
                "and diagonalization.",
            ko: "익숙한 땅에서 증명을 연습한다. 체 위의 벡터 공간, 부분 공간, 선형 독립, 기저와 차원, " +
                "기저 변환, 선형 연산자, 대각화.",
        },
    },
    {
        n: 3,
        title: {en: "Inner Product Spaces and Least Squares", ko: "내적 공간과 최소제곱"},
        blurb: {
            en: "Length and angle turn algebra into geometry: norms, inner products, Gram-Schmidt, " +
                "the projection theorem and the normal equations, quadratic forms, and least squares.",
            ko: "길이와 각도가 대수를 기하로 바꾼다. norm과 내적, Gram-Schmidt, 사영 정리와 normal equation, " +
                "이차 형식, 그리고 최소제곱.",
        },
    },
    {
        n: 4,
        title: {en: "Three Useful Matrix Factorizations", ko: "유용한 세 가지 행렬 분해"},
        blurb: {
            en: "The same matrix, rewritten so the answer falls out: QR for least squares, " +
                "SVD for rank and numerical independence, LU and Cholesky for solving fast.",
            ko: "같은 행렬을 다시 써서 답이 굴러 나오게 만든다. 최소제곱을 위한 QR, 랭크와 수치적 독립을 " +
                "보는 SVD, 빠르게 푸는 LU와 Cholesky.",
        },
    },
    {
        n: 5,
        title: {en: "Probability, Estimation, and the Kalman Filter", ko: "확률, 추정, 칼만 필터"},
        blurb: {
            en: "Least squares with noise: densities and random vectors, BLUE and the minimum " +
                "variance estimator, conditioning of Gaussian random vectors, and the discrete-time " +
                "Kalman filter derived by induction.",
            ko: "잡음이 있는 최소제곱. 밀도와 확률 벡터, BLUE와 최소 분산 추정기, 가우시안 확률 벡터의 " +
                "조건부 분포, 그리고 귀납법으로 유도하는 이산시간 칼만 필터.",
        },
    },
    {
        n: 6,
        title: {en: "Real Analysis: Limits and Extrema", ko: "실해석: 극한과 극값"},
        blurb: {
            en: "When does an algorithm converge, and when does a minimum exist? Open and closed " +
                "sets, Cauchy sequences and completeness, the contraction mapping theorem, " +
                "continuity, and compactness.",
            ko: "알고리즘은 언제 수렴하고, 최솟값은 언제 존재하는가. 열린 집합과 닫힌 집합, Cauchy 수열과 " +
                "완비성, Contraction Mapping 정리, 연속성, 컴팩트성.",
        },
    },
    {
        n: 7,
        title: {en: "Brief Remarks on Optimization", ko: "최적화 개요"},
        blurb: {
            en: "Where the course lands: convexity, which makes a local minimum a global one, " +
                "then quadratic programs and the linear programs that minimize the 1-norm and " +
                "the max-norm.",
            ko: "이 과목이 닿는 지점. 국소 최솟값을 전역 최솟값으로 만드는 볼록성, 그다음 quadratic " +
                "program, 그리고 1-norm과 max-norm을 최소화하는 linear program.",
        },
    },
];

// 홈에서 챕터를 묶어 보여 주는 파트 구분.
export const PARTS: Array<{
    range: [number, number];
    title: Localized<string>;
    desc: Localized<string>;
}> = [
    {
        range: [1, 2],
        title: {en: "Proof and Structure", ko: "증명과 구조"},
        desc: {
            en: "Learning to argue, then practicing on linear algebra where every claim can be checked.",
            ko: "논증하는 법을 배우고, 모든 주장을 확인할 수 있는 선형대수에서 연습한다.",
        },
    },
    {
        range: [3, 4],
        title: {en: "Geometry and Least Squares", ko: "기하와 최소제곱"},
        desc: {
            en: "Inner products give length and angle; projection solves least squares, and factorizations compute it.",
            ko: "내적이 길이와 각도를 주고, 사영이 최소제곱을 풀며, 행렬 분해가 그것을 계산한다.",
        },
    },
    {
        range: [5, 5],
        title: {en: "Estimation Under Noise", ko: "잡음 속의 추정"},
        desc: {
            en: "The same projection idea, now with probability: BLUE, minimum variance, and the Kalman filter.",
            ko: "같은 사영 아이디어에 확률을 얹는다. BLUE, 최소 분산, 그리고 칼만 필터.",
        },
    },
    {
        range: [6, 7],
        title: {en: "Convergence and Optimization", ko: "수렴과 최적화"},
        desc: {
            en: "The conditions that make iteration converge and make an optimum exist in the first place.",
            ko: "반복이 수렴하게 만들고, 애초에 최적해가 존재하게 만드는 조건들.",
        },
    },
];
