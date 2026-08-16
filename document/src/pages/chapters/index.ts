import {lazy} from "react";
import {IChapterData} from "../../../types/global";

// 챕터 메타데이터는 여기서만 관리한다. 본문 모듈은 lazy import 로 분리해 홈/목록 화면에서는
// 불러오지 않는다 (초기 번들 축소). contents 가 없는 항목은 아직 집필 전 챕터라
// 홈 카드·사이드바·검색·sitemap 어디에도 노출되지 않는다.
// sections 의 en/ko 문자열은 각 언어로 렌더된 본문 h2 헤딩과 정확히 일치해야
// 사이드바/TOC/검색 앵커(slug)가 맞는다.
const data: IChapterData[] = [
    {
        chapter: 1,
        title: {en: "Introduction to Mathematical Arguments", ko: "수학적 논증 입문"},
        contents: lazy(() => import("./Chapter1")),
        sections: [
            {en: "Mathematical Notation", ko: "수학 기호"},
            {en: "Vocabulary", ko: "용어"},
            {en: "Review of Proof Techniques", ko: "증명 기법 정리"},
            {en: "Truth Tables", ko: "진리표"},
            {en: "Negating Logical Statements", ko: "논리 명제의 부정"},
            {en: "Key Properties of Real Numbers", ko: "실수의 핵심 성질"},
            {en: "Why Robotics", ko: "로봇에서 왜 필요한가"},
            {en: "References", ko: "References"},
        ],
    },
    {
        chapter: 2,
        title: {en: "Highlights of Abstract Linear Algebra", ko: "추상 선형대수의 핵심"},
        contents: lazy(() => import("./Chapter2")),
        sections: [
            {en: "Fields and Vector Spaces", ko: "체와 벡터 공간"},
            {en: "Subspaces", ko: "부분 공간"},
            {en: "Linear Combinations and Linear Independence", ko: "선형 결합과 선형 독립"},
            {en: "Basis Vectors and Dimension", ko: "기저와 차원"},
            {en: "Representations of Vectors and the Change of Basis Matrix", ko: "벡터의 표현과 기저 변환 행렬"},
            {en: "Linear Operators and Matrix Representations", ko: "선형 연산자와 행렬 표현"},
            {en: "Eigenvalues, Eigenvectors, and Diagonalization", ko: "고윳값, 고유벡터, 대각화"},
            {en: "A Few Additional Properties of Matrices", ko: "행렬의 추가 성질"},
            {en: "Why Robotics", ko: "로봇에서 왜 필요한가"},
            {en: "References", ko: "References"},
        ],
    },
    {
        chapter: 3,
        title: {en: "Inner Product Spaces and Least Squares", ko: "내적 공간과 최소제곱"},
        contents: lazy(() => import("./Chapter3")),
        sections: [
            {en: "Norms and Normed Spaces", ko: "norm과 normed space"},
            {en: "Inner Product Spaces", ko: "내적 공간"},
            {en: "The Gram-Schmidt Process", ko: "Gram-Schmidt 과정"},
            {en: "Projection Theorem and the Normal Equations", ko: "사영 정리와 normal equation"},
            {en: "Symmetric and Orthogonal Matrices", ko: "대칭 행렬과 직교 행렬"},
            {en: "Quadratic Forms, Positive Definiteness, and Schur Complements", ko: "이차 형식, positive definite, Schur complement"},
            {en: "Least Squares Problems", ko: "최소제곱 문제"},
            {en: "Why Robotics", ko: "로봇에서 왜 필요한가"},
            {en: "References", ko: "References"},
        ],
    },
    {
        chapter: 4,
        title: {en: "Three Useful Matrix Factorizations", ko: "유용한 세 가지 행렬 분해"},
        sections: [
            {en: "QR Factorization", ko: "QR 분해"},
            {en: "Singular Value Decomposition", ko: "특이값 분해(SVD)"},
            {en: "Numerical Linear Independence", ko: "수치적 선형 독립"},
            {en: "LU Factorization", ko: "LU 분해"},
            {en: "Cholesky Factorization", ko: "Cholesky 분해"},
        ],
    },
    {
        chapter: 5,
        title: {en: "Probability, Estimation, and the Kalman Filter", ko: "확률, 추정, 칼만 필터"},
        sections: [
            {en: "Densities and Random Vectors", ko: "밀도 함수와 확률 벡터"},
            {en: "Best Linear Unbiased Estimator (BLUE)", ko: "Best Linear Unbiased Estimator (BLUE)"},
            {en: "Minimum Variance Estimator (MVE)", ko: "Minimum Variance Estimator (MVE)"},
            {en: "Independence, Correlation, and Conditioning", ko: "독립, 상관, 조건부 확률"},
            {en: "Gaussian Random Vectors", ko: "가우시안 확률 벡터"},
            {en: "Conditioning with Gaussian Random Vectors", ko: "가우시안 확률 벡터의 조건부 분포"},
            {en: "The Discrete-time Kalman Filter", ko: "이산시간 칼만 필터"},
            {en: "Extended Kalman Filter", ko: "확장 칼만 필터(EKF)"},
            {en: "Luenberger Observer", ko: "Luenberger 관측기"},
        ],
    },
    {
        chapter: 6,
        title: {en: "Real Analysis: Limits and Extrema", ko: "실해석: 극한과 극값"},
        sections: [
            {en: "Open and Closed Sets in Normed Spaces", ko: "normed space의 열린 집합과 닫힌 집합"},
            {en: "The Newton-Raphson Algorithm", ko: "Newton-Raphson 알고리즘"},
            {en: "Sequences", ko: "수열"},
            {en: "Cauchy Sequences and Completeness", ko: "Cauchy 수열과 완비성"},
            {en: "The Contraction Mapping Theorem", ko: "Contraction Mapping 정리"},
            {en: "Continuous Functions", ko: "연속 함수"},
            {en: "Compact Sets and the Existence of Extrema", ko: "컴팩트 집합과 극값의 존재"},
        ],
    },
    {
        chapter: 7,
        title: {en: "Brief Remarks on Optimization", ko: "최적화 개요"},
        sections: [
            {en: "Convex Sets and Convex Functions", ko: "볼록 집합과 볼록 함수"},
            {en: "What Is a Quadratic Program?", ko: "Quadratic Program이란?"},
            {en: "Linear Programs for the 1-Norm and the Max-Norm", ko: "1-norm과 max-norm을 위한 Linear Program"},
        ],
    },
];

export default data.sort((a, b) => a.chapter - b.chapter)
