// 배포(GitHub Pages)에서는 /linear_algebra_to_kalman 하위 경로로 서빙된다. dev 에서는 루트.
// vite.config 의 base 설정과 동일한 규칙 — 라우터 basename 이 이 값을 공유한다.
export const BASE_PATH = import.meta.env.PROD ? "/linear_algebra_to_kalman" : ""
