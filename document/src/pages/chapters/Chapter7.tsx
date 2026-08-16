import CanvasFigure from "../../components/CanvasFigure";
import ConvexFunctionLab from "../../components/pages/chapter7/ConvexFunctionLab";
import ConvexSetLab from "../../components/pages/chapter7/ConvexSetLab";
import LinearProgramLab from "../../components/pages/chapter7/LinearProgramLab";
import NormFittingLab from "../../components/pages/chapter7/NormFittingLab";
import QuadraticProgramLab from "../../components/pages/chapter7/QuadraticProgramLab";
import {BlockMath, InlineMath} from "../../components/math/Tex";
import {Corollary, Definition, Example, Proof, Proposition, Remark, Theorem} from "../../components/math/Statement";
import Terms from "../../components/math/Terms";
import {T, useTr} from "../../libs/i18n";

const COURSE = "https://grizzle.robotics.umich.edu/education/rob501";
const NOTES_REPO = "https://github.com/michiganrobotics/rob501";
const BOYD_BOOK = "https://web.stanford.edu/~boyd/cvxbook/";
const BOYD_SOFTWARE = "https://stanford.edu/~boyd/software.html";
const OSQP_PAPER = "https://web.stanford.edu/~boyd/papers/pdf/osqp.pdf";
const OSQP_JL = "https://github.com/osqp/OSQP.jl";
const CPLEX_QP = "https://www.ibm.com/docs/en/icos/20.1.0?topic=qp-optimizing-qps";
const QUADPROG = "https://www.mathworks.com/help/optim/ug/quadprog.html";
const MPC_QP = "https://www.mathworks.com/help/mpc/ug/qp-solver.html";
const CVXPY = "https://www.cvxpy.org/";
const SIMPLEX_WIKI = "https://en.wikipedia.org/wiki/Simplex_algorithm";
const LAD_WIKI = "https://en.wikipedia.org/wiki/Least_absolute_deviations";
const CARATHEODORY = "https://en.wikipedia.org/wiki/Carath%C3%A9odory%27s_theorem_(convex_hull)";

const Chapter7 = () => {
    const t = useTr();
    return (
        <>
            <T
                en={<p>
                    This is the shortest chapter in the notes and the one the other six were for. Every
                    earlier chapter ended by writing down a problem of the form "find the{" "}
                    <InlineMath math={"x"}/> that makes this quantity smallest", and then answered it in a
                    special case. Least squares was one such problem, the minimum norm solution was
                    another, and the Kalman gain was a third. This chapter names the general shape of
                    those problems, says which ones a computer can be trusted to solve, and shows the two
                    standard forms that a robot actually ships with.
                </p>}
                ko={<p>
                    교재에서 가장 짧은 장이고, 나머지 여섯 장이 이것을 위해 있었다. 앞의 모든 장은 "이 값을
                    가장 작게 만드는 <InlineMath math={"x"}/>를 찾아라" 꼴의 문제를 적는 것으로 끝났고,
                    그다음 특수한 경우에 답을 냈다. 최소제곱이 그런 문제였고, 최소 norm 해가 또 하나였으며,
                    칼만 이득이 세 번째였다. 이 장은 그 문제들의 일반적인 모양에 이름을 붙이고, 그중 어떤
                    것을 컴퓨터에 맡겨도 되는지를 말하고, 로봇에 실제로 실려 나가는 두 표준형을 보인다.
                </p>}
            />
            <T
                en={<p>
                    The property that separates the tractable problems from the rest is{" "}
                    <strong>convexity</strong>. It buys one thing, and that one thing is everything: on a
                    convex problem a local minimum is a global minimum. A solver that stops when it can no
                    longer improve locally has therefore stopped at the answer, not at a false summit, and
                    that is why a convex problem can sit inside a control loop and a non-convex one
                    usually cannot.
                </p>}
                ko={<p>
                    다룰 만한 문제와 나머지를 가르는 성질이 <strong>볼록성</strong>이다. 볼록성이 사 오는
                    것은 하나뿐인데 그 하나가 전부다. 볼록 문제에서는 국소 최솟값이 곧 전역 최솟값이다.
                    국소적으로 더 나아질 수 없을 때 멈추는 solver는 그러므로 가짜 봉우리가 아니라 답에
                    멈춘 것이고, 볼록 문제는 제어 루프 안에 들어갈 수 있고 볼록하지 않은 문제는 대개 그럴
                    수 없는 이유가 이것이다.
                </p>}
            />
            <BlockMath math={"\\begin{aligned} &\\text{(LS)} && \\min_{x} \\ \\tfrac{1}{2}\\|Ax - b\\|_2^2 && \\text{(Ch. 3, no constraints)} \\\\ &\\text{(QP)} && \\min_{x} \\ \\tfrac{1}{2}x^\\top Q x + qx && \\text{s.t. } A_{in}x \\preceq b_{in},\\ A_{eq}x = b_{eq} \\\\ &\\text{(LP)} && \\min_{x} \\ f^\\top x && \\text{s.t. } A_{in}x \\preceq b_{in},\\ A_{eq}x = b_{eq} \\end{aligned}"}/>
            <Terms items={[
                ["x", <T en={<>the decision variable: the thing you get to choose. A torque command, a pose, a set of calibration parameters</>}
                         ko={<>결정 변수. 당신이 고를 수 있는 것이다. 토크 명령, 자세, 캘리브레이션 파라미터 묶음 같은 것</>}/>],
                ["Q", <T en={<>a symmetric <InlineMath math={"m \\times m"}/> matrix, the quadratic part of the cost. Positive definiteness of this matrix is what makes the QP have exactly one answer</>}
                         ko={<>대칭 <InlineMath math={"m \\times m"}/> 행렬로 비용의 이차항이다. 이 행렬의 positive definite 여부가 QP에 답이 정확히 하나 있게 만든다</>}/>],
                ["q", <T en={<>a <InlineMath math={"1 \\times m"}/> row vector, the linear part of the cost. The notes write <InlineMath math={"qx"}/> rather than <InlineMath math={"q^\\top x"}/> for this reason</>}
                         ko={<><InlineMath math={"1 \\times m"}/> 행벡터로 비용의 일차항이다. 교재가 <InlineMath math={"q^\\top x"}/>가 아니라 <InlineMath math={"qx"}/>로 적는 이유가 이것이다</>}/>],
                ["f", <T en={<>the LP cost vector, an element of <InlineMath math={"\\mathbb{R}^n"}/>. Its direction alone decides the answer, since scaling it scales every cost equally</>}
                         ko={<>LP의 비용 벡터로 <InlineMath math={"\\mathbb{R}^n"}/>의 원소다. 크기를 바꾸면 모든 비용이 같은 비율로 바뀌므로 방향만이 답을 정한다</>}/>],
                ["\\preceq", <T en={<>componentwise <InlineMath math={"\\le"}/> between vectors: every row of the left side is at most the corresponding row of the right</>}
                                ko={<>벡터 사이의 성분별 <InlineMath math={"\\le"}/>다. 왼쪽의 각 행이 오른쪽의 대응 행 이하라는 뜻</>}/>],
                ["A_{in}, b_{in}", <T en={<>the inequality constraints, stacked one per row. Joint limits, torque limits, and friction cones all end up here</>}
                                      ko={<>부등식 제약으로 한 행에 하나씩 쌓는다. 관절 한계, 토크 한계, 마찰 원뿔이 모두 여기로 온다</>}/>],
                ["A_{eq}, b_{eq}", <T en={<>the equality constraints. Dynamics that must hold exactly, or a variable defined in terms of others, live here</>}
                                      ko={<>등식 제약. 정확히 성립해야 하는 동역학이나 다른 변수로 정의되는 변수가 여기에 온다</>}/>],
            ]}/>
            <T
                en={<p>
                    Read down that list and the chapter's plan is visible. The three problems have the same
                    constraints and differ only in the cost, and the cost gets simpler as you go down:
                    quadratic without constraints, quadratic with them, linear with them. The surprise at
                    the end is that minimizing the 1-norm or the max-norm of a residual, which looks
                    harder than least squares because it is not differentiable, is actually the last of
                    these three in disguise.
                </p>}
                ko={<p>
                    이 목록을 아래로 읽으면 이 장의 계획이 보인다. 세 문제는 제약이 같고 비용만 다르며,
                    아래로 갈수록 비용이 단순해진다. 제약 없는 이차, 제약 있는 이차, 제약 있는 일차다.
                    끝에 놓인 놀라움은, 미분이 안 되기 때문에 최소제곱보다 어려워 보이는 잔차의 1-norm이나
                    max-norm 최소화가 사실은 이 셋 중 마지막 것을 변장시킨 것이라는 점이다.
                </p>}
            />
            <T en={<h3>What this chapter borrows from the previous six</h3>}
               ko={<h3>이 장이 앞의 여섯 장에서 빌려 오는 것</h3>}/>
            <T
                en={<p>
                    Almost nothing in this chapter is proved from scratch. Each claim below is a result
                    from an earlier chapter, used here for the purpose it was built for.
                </p>}
                ko={<p>
                    이 장에서 맨바닥부터 증명되는 것은 거의 없다. 아래의 주장 하나하나는 앞 장의 결과이고,
                    그것이 만들어진 목적 그대로 여기서 쓰인다.
                </p>}
            />
            <table className="table-center">
                <thead>
                <tr>
                    <th>{t("what this chapter needs", "이 장이 필요로 하는 것")}</th>
                    <th>{t("where it was built", "그것이 세워진 곳")}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{t("a minimum exists at all", "최솟값이 애초에 존재한다")}</td>
                    <td>{t("Ch. 6 Weierstrass: a continuous function on a compact set attains its extrema", "6장 Weierstrass: 컴팩트 집합 위의 연속 함수는 극값에 도달한다")}</td>
                </tr>
                <tr>
                    <td>{t("the feasible set is closed", "실행 가능 집합이 닫혀 있다")}</td>
                    <td>{t("Ch. 6: the preimage of a closed set under a continuous map is closed", "6장: 연속 사상에 의한 닫힌 집합의 원상은 닫혀 있다")}</td>
                </tr>
                <tr>
                    <td>{t("the minimizer is unique", "최소점이 유일하다")}</td>
                    <td>{t("Ch. 3 positive definiteness, restated here as strict convexity", "3장 positive definite. 여기서는 강볼록성으로 다시 적는다")}</td>
                </tr>
                <tr>
                    <td><InlineMath math={"\\nabla f = 0"}/> {t("is the right equation", "이 옳은 식이다")}</td>
                    <td>{t("Ch. 3 projection theorem and the normal equations", "3장 사영 정리와 normal equation")}</td>
                </tr>
                <tr>
                    <td>{t("that equation can be solved fast", "그 식을 빠르게 풀 수 있다")}</td>
                    <td>{t("Ch. 4 Cholesky and QR", "4장 Cholesky와 QR")}</td>
                </tr>
                <tr>
                    <td>{t("the residual model and its weighting", "잔차 모델과 그 가중")}</td>
                    <td>{t("Ch. 5 measurement equation and covariance", "5장 측정 방정식과 공분산")}</td>
                </tr>
                <tr>
                    <td>{t("negating a quantified claim in a proof", "증명에서 quantifier 명제를 부정한다")}</td>
                    <td>{t("Ch. 1 negation rules and the contrapositive", "1장 부정 규칙과 대우")}</td>
                </tr>
                </tbody>
            </table>
            <Remark title={<T en={<>Reading map and notation</>} ko={<>읽기 지도와 기호</>}/>}>
                <T
                    en={<ul>
                        <li>Notes 7.1 becomes <em>Convex Sets and Convex Functions</em> here, 7.2 becomes{" "}
                            <em>Remarks on Notation and Abuse of Notation</em>, 7.3 becomes{" "}
                            <em>What Is a Quadratic Program?</em>, and 7.4 becomes{" "}
                            <em>Linear Programs for the 1-Norm and the Max-Norm</em>. The numbering of
                            every definition and theorem below is the notes' own.</li>
                        <li><InlineMath math={"(\\mathcal{X}, \\mathbb{R}, \\|\\bullet\\|)"}/> is a real
                            normed space, as in Chapters 3 and 6. Convexity itself needs only the vector
                            space structure; the norm appears when balls and local minima do.</li>
                        <li><InlineMath math={"\\lambda"}/> is always a weight in{" "}
                            <InlineMath math={"[0, 1]"}/> in this chapter, never an eigenvalue. Where an
                            eigenvalue is meant it is written{" "}
                            <InlineMath math={"\\lambda_{\\min}(Q)"}/> with the matrix named.</li>
                        <li><InlineMath math={"\\preceq"}/> and{" "}
                            <InlineMath math={"\\succeq"}/> compare vectors componentwise;{" "}
                            <InlineMath math={"\\le"}/> compares scalars. The distinction matters because{" "}
                            <InlineMath math={"u \\npreceq v"}/> does not mean{" "}
                            <InlineMath math={"u \\succ v"}/>: two vectors need not be comparable at all.</li>
                        <li>Three results in this chapter are stated but not proved in the notes, and are
                            marked as such where they appear. Two places where the notes contain a slip
                            are flagged in a Remark rather than copied.</li>
                    </ul>}
                    ko={<ul>
                        <li>교재 7.1이 여기서는 <em>볼록 집합과 볼록 함수</em>, 7.2가{" "}
                            <em>argmin 기호와 그 남용</em>, 7.3이{" "}
                            <em>Quadratic Program이란?</em>, 7.4가{" "}
                            <em>1-norm과 max-norm을 최소화하는 Linear Program</em>이 된다. 아래의 모든
                            정의와 정리 번호는 교재의 번호 그대로다.</li>
                        <li><InlineMath math={"(\\mathcal{X}, \\mathbb{R}, \\|\\bullet\\|)"}/>는 3장, 6장과
                            같은 실수 normed space다. 볼록성 자체는 벡터 공간 구조만 있으면 되고, norm은
                            공과 국소 최솟값이 나올 때 등장한다.</li>
                        <li>이 장에서 <InlineMath math={"\\lambda"}/>는 언제나{" "}
                            <InlineMath math={"[0, 1]"}/>의 가중치이고 고윳값이 아니다. 고윳값을 뜻할
                            때는 행렬을 밝혀 <InlineMath math={"\\lambda_{\\min}(Q)"}/>로 적는다.</li>
                        <li><InlineMath math={"\\preceq"}/>와{" "}
                            <InlineMath math={"\\succeq"}/>는 벡터를 성분별로 비교하고,{" "}
                            <InlineMath math={"\\le"}/>는 스칼라를 비교한다. 이 구별이 중요한 이유는{" "}
                            <InlineMath math={"u \\npreceq v"}/>가{" "}
                            <InlineMath math={"u \\succ v"}/>를 뜻하지 않기 때문이다. 두 벡터는 아예
                            비교 불가능할 수도 있다.</li>
                        <li>이 장의 결과 셋은 교재에서 진술만 되고 증명되지 않으며, 나오는 자리에 그렇게
                            표시해 두었다. 교재에 실수가 있는 두 곳은 그대로 옮기지 않고 참고 블록으로
                            지적해 두었다.</li>
                    </ul>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Convex Sets and Convex Functions</h2>}
               ko={<h2>볼록 집합과 볼록 함수</h2>}/>
            <T
                en={<p>
                    Two definitions carry the chapter, and they turn out to be the same definition seen
                    twice. A set is convex when it contains every segment between its own points. A
                    function is convex when the region above its graph is such a set. Everything else here
                    is a consequence.
                </p>}
                ko={<p>
                    이 장을 떠받치는 정의는 둘이고, 결국 같은 정의를 두 번 본 것으로 드러난다. 집합이
                    볼록하다는 것은 자기 점들 사이의 모든 선분을 품는다는 뜻이다. 함수가 볼록하다는 것은
                    그 그래프 위쪽 영역이 그런 집합이라는 뜻이다. 나머지는 전부 따라 나오는 결과다.
                </p>}
            />
            <Definition n="7.1" title={<T en={<>Convex set</>} ko={<>볼록 집합</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\mathbb{R})"}/> be a real vector space. A
                        subset <InlineMath math={"C \\subset \\mathcal{X}"}/> is{" "}
                        <strong>convex</strong> if for all{" "}
                        <InlineMath math={"x, y \\in C"}/> and all{" "}
                        <InlineMath math={"0 \\le \\lambda \\le 1"}/>, the{" "}
                        <strong>convex combination</strong> satisfies
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathbb{R})"}/>을 실수 벡터 공간이라 하자.
                        부분집합 <InlineMath math={"C \\subset \\mathcal{X}"}/>이{" "}
                        <strong>볼록</strong>하다는 것은, 모든{" "}
                        <InlineMath math={"x, y \\in C"}/>과 모든{" "}
                        <InlineMath math={"0 \\le \\lambda \\le 1"}/>에 대해{" "}
                        <strong>볼록 결합</strong>이 다음을 만족한다는 뜻이다.
                    </p>}
                />
                <BlockMath math={"\\lambda x + (1 - \\lambda) y \\in C."}/>
                <Terms items={[
                    ["x, y", <T en={<>any two points of <InlineMath math={"C"}/>. The definition quantifies over every pair at once, so a single bad pair is a complete disproof</>}
                                ko={<><InlineMath math={"C"}/>의 임의의 두 점. 정의가 모든 쌍을 한꺼번에 훑으므로, 나쁜 쌍 하나면 반증이 끝난다</>}/>],
                    ["\\lambda", <T en={<>a weight in <InlineMath math={"[0, 1]"}/>. As <InlineMath math={"\\lambda"}/> runs over that interval the point sweeps the segment from <InlineMath math={"y"}/> to <InlineMath math={"x"}/>, endpoints included</>}
                                    ko={<><InlineMath math={"[0, 1]"}/>의 가중치. <InlineMath math={"\\lambda"}/>가 이 구간을 훑으면 점이 <InlineMath math={"y"}/>에서 <InlineMath math={"x"}/>까지 선분을 쓸고 지나간다. 양 끝점 포함이다</>}/>],
                    ["\\lambda x + (1-\\lambda)y", <T en={<>the convex combination. At <InlineMath math={"\\lambda = 1"}/> it is <InlineMath math={"x"}/>, at <InlineMath math={"\\lambda = 0"}/> it is <InlineMath math={"y"}/>, and in between it is a point of the segment</>}
                                                     ko={<>볼록 결합. <InlineMath math={"\\lambda = 1"}/>에서 <InlineMath math={"x"}/>, <InlineMath math={"\\lambda = 0"}/>에서 <InlineMath math={"y"}/>이고, 그 사이에서는 선분 위의 한 점이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The notes write the conclusion as{" "}
                        <InlineMath math={"C \\subset V"}/> with <InlineMath math={"V"}/> never
                        introduced; the ambient space is{" "}
                        <InlineMath math={"\\mathcal{X}"}/>, and that is what is written above.
                    </p>}
                    ko={<p>
                        교재는 이 부분을 한 번도 소개하지 않은 <InlineMath math={"V"}/>를 써서{" "}
                        <InlineMath math={"C \\subset V"}/>로 적는다. 바탕 공간은{" "}
                        <InlineMath math={"\\mathcal{X}"}/>이고, 위에는 그렇게 적었다.
                    </p>}
                />
            </Definition>
            <Example n="7.1a" title={<T en={<>One half-plane, and one set that is not convex</>}
                                        ko={<>반평면 하나, 그리고 볼록하지 않은 집합 하나</>}/>}>
                <T
                    en={<p>
                        Take <InlineMath math={"C = \\{x \\in \\mathbb{R}^2 : 3x_1 + x_2 \\le 0\\}"}/>{" "}
                        and the two points{" "}
                        <InlineMath math={"x = (1, -3)"}/> and{" "}
                        <InlineMath math={"y = (-2, 5)"}/>. Both are in{" "}
                        <InlineMath math={"C"}/>, since{" "}
                        <InlineMath math={"3(1) + (-3) = 0 \\le 0"}/> and{" "}
                        <InlineMath math={"3(-2) + 5 = -1 \\le 0"}/>. At{" "}
                        <InlineMath math={"\\lambda = \\tfrac{1}{2}"}/> the combination is{" "}
                        <InlineMath math={"z = (-\\tfrac{1}{2}, 1)"}/> and{" "}
                        <InlineMath math={"3(-\\tfrac{1}{2}) + 1 = -\\tfrac{1}{2} \\le 0"}/>. That is one
                        pair; the general argument is one line, because{" "}
                        <InlineMath math={"a^\\top x"}/> is linear in <InlineMath math={"x"}/>:
                    </p>}
                    ko={<p>
                        <InlineMath math={"C = \\{x \\in \\mathbb{R}^2 : 3x_1 + x_2 \\le 0\\}"}/>과 두 점{" "}
                        <InlineMath math={"x = (1, -3)"}/>,{" "}
                        <InlineMath math={"y = (-2, 5)"}/>을 잡자. 둘 다{" "}
                        <InlineMath math={"C"}/> 안에 있다.{" "}
                        <InlineMath math={"3(1) + (-3) = 0 \\le 0"}/>이고{" "}
                        <InlineMath math={"3(-2) + 5 = -1 \\le 0"}/>이기 때문이다.{" "}
                        <InlineMath math={"\\lambda = \\tfrac{1}{2}"}/>에서 결합은{" "}
                        <InlineMath math={"z = (-\\tfrac{1}{2}, 1)"}/>이고{" "}
                        <InlineMath math={"3(-\\tfrac{1}{2}) + 1 = -\\tfrac{1}{2} \\le 0"}/>이다. 이건 한
                        쌍이고, 일반 논증은 한 줄이다.{" "}
                        <InlineMath math={"a^\\top x"}/>가 <InlineMath math={"x"}/>에 대해 선형이기
                        때문이다.
                    </p>}
                />
                <BlockMath math={"a^\\top(\\lambda x + (1-\\lambda)y) = \\lambda\\, a^\\top x + (1-\\lambda)\\, a^\\top y \\le \\lambda b + (1-\\lambda) b = b."}/>
                <Terms items={[
                    ["a", <T en={<>the row of coefficients, here <InlineMath math={"a = (3, 1)"}/></>}
                             ko={<>계수 행. 여기서는 <InlineMath math={"a = (3, 1)"}/>이다</>}/>],
                    ["b", <T en={<>the right hand side, here <InlineMath math={"b = 0"}/>. Both inequalities used are <InlineMath math={"a^\\top x \\le b"}/> and <InlineMath math={"a^\\top y \\le b"}/>, weighted by nonnegative numbers</>}
                             ko={<>우변. 여기서는 <InlineMath math={"b = 0"}/>이다. 쓴 부등식은 <InlineMath math={"a^\\top x \\le b"}/>과 <InlineMath math={"a^\\top y \\le b"}/> 둘뿐이고, 음이 아닌 수로 가중했다</>}/>],
                    ["\\lambda + (1-\\lambda)", <T en={<>equals <InlineMath math={"1"}/>, which is the only reason the two <InlineMath math={"b"}/> terms add up to <InlineMath math={"b"}/> again</>}
                                                   ko={<><InlineMath math={"1"}/>이다. 두 <InlineMath math={"b"}/> 항이 다시 <InlineMath math={"b"}/>로 합쳐지는 유일한 이유가 이것이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Now the non-example, and it fails the single clause of Definition 7.1 rather than
                        some side condition. Let{" "}
                        <InlineMath math={"C = \\{x \\in \\mathbb{R}^2 : 1 \\le \\|x\\| \\le 2\\}"}/>, an
                        annulus. Both <InlineMath math={"x = (-\\tfrac{3}{2}, 0)"}/> and{" "}
                        <InlineMath math={"y = (\\tfrac{3}{2}, 0)"}/> lie in it, but at{" "}
                        <InlineMath math={"\\lambda = \\tfrac{1}{2}"}/> the combination is the origin,
                        whose norm is <InlineMath math={"0 < 1"}/>. One pair was enough. The union{" "}
                        <InlineMath math={"\\{x_1 \\le -1\\} \\cup \\{x_1 \\ge 1\\}"}/> fails the same way
                        with <InlineMath math={"x = (-1, 0)"}/> and{" "}
                        <InlineMath math={"y = (1, 0)"}/>, which is worth holding on to: each piece is
                        convex, and the union of them is not.
                    </p>}
                    ko={<p>
                        이제 반례인데, 곁가지 조건이 아니라 정의 7.1의 유일한 조항을 어긴다.{" "}
                        <InlineMath math={"C = \\{x \\in \\mathbb{R}^2 : 1 \\le \\|x\\| \\le 2\\}"}/>,
                        고리를 잡자. <InlineMath math={"x = (-\\tfrac{3}{2}, 0)"}/>과{" "}
                        <InlineMath math={"y = (\\tfrac{3}{2}, 0)"}/> 둘 다 안에 있지만{" "}
                        <InlineMath math={"\\lambda = \\tfrac{1}{2}"}/>에서 결합은 원점이고 그 norm은{" "}
                        <InlineMath math={"0 < 1"}/>이다. 한 쌍으로 충분했다. 합집합{" "}
                        <InlineMath math={"\\{x_1 \\le -1\\} \\cup \\{x_1 \\ge 1\\}"}/>도{" "}
                        <InlineMath math={"x = (-1, 0)"}/>과 <InlineMath math={"y = (1, 0)"}/>으로 같은
                        방식으로 깨진다. 이건 기억해 둘 값어치가 있다. 각 조각은 볼록한데 그 합집합은
                        볼록하지 않다.
                    </p>}
                />
            </Example>
            <Remark n="7.2" title={<T en={<>What the definition is saying, and balls</>}
                                      ko={<>정의가 말하는 것, 그리고 공</>}/>}>
                <T
                    en={<ol>
                        <li>For <InlineMath math={"C"}/> to be convex, given any two points{" "}
                            <InlineMath math={"x, y \\in C"}/>, the segment connecting{" "}
                            <InlineMath math={"x"}/> and <InlineMath math={"y"}/> must lie in{" "}
                            <InlineMath math={"C"}/>.</li>
                        <li>Open and closed balls arising from norms are always convex.</li>
                    </ol>}
                    ko={<ol>
                        <li><InlineMath math={"C"}/>가 볼록하려면, 임의의 두 점{" "}
                            <InlineMath math={"x, y \\in C"}/>에 대해{" "}
                            <InlineMath math={"x"}/>와 <InlineMath math={"y"}/>를 잇는 선분이{" "}
                            <InlineMath math={"C"}/> 안에 있어야 한다.</li>
                        <li>norm에서 나오는 열린 공과 닫힌 공은 언제나 볼록하다.</li>
                    </ol>}
                />
                <Proof label={<T en={<>Proof of the second claim</>} ko={<>두 번째 주장의 증명</>}/>}>
                    <T
                        en={<p>
                            Let <InlineMath math={"B_r(x_0) = \\{x : \\|x - x_0\\| < r\\}"}/> and take{" "}
                            <InlineMath math={"x, y \\in B_r(x_0)"}/> and{" "}
                            <InlineMath math={"\\lambda \\in [0, 1]"}/>. Write the displacement of the
                            combination from the centre using{" "}
                            <InlineMath math={"\\lambda + (1-\\lambda) = 1"}/>:
                        </p>}
                        ko={<p>
                            <InlineMath math={"B_r(x_0) = \\{x : \\|x - x_0\\| < r\\}"}/>이라 하고{" "}
                            <InlineMath math={"x, y \\in B_r(x_0)"}/>,{" "}
                            <InlineMath math={"\\lambda \\in [0, 1]"}/>을 잡자.{" "}
                            <InlineMath math={"\\lambda + (1-\\lambda) = 1"}/>을 써서 결합이 중심에서
                            벌어진 양을 적는다.
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} \\|\\lambda x + (1-\\lambda)y - x_0\\| &= \\|\\lambda(x - x_0) + (1-\\lambda)(y - x_0)\\| \\\\ &\\le \\lambda\\|x - x_0\\| + (1-\\lambda)\\|y - x_0\\| \\\\ &< \\lambda r + (1-\\lambda) r = r. \\end{aligned}"}/>
                    <Terms items={[
                        ["\\le", <T en={<>the triangle inequality together with absolute homogeneity, <InlineMath math={"\\|\\alpha v\\| = |\\alpha|\\,\\|v\\|"}/>, both from the norm axioms of Chapter 3. The weights are nonnegative, so the absolute values drop</>}
                                    ko={<>삼각 부등식과 절대 동차성 <InlineMath math={"\\|\\alpha v\\| = |\\alpha|\\,\\|v\\|"}/>이다. 둘 다 3장의 norm 공리에서 온다. 가중치가 음이 아니므로 절댓값은 떨어진다</>}/>],
                        ["<", <T en={<>strict because both <InlineMath math={"x"}/> and <InlineMath math={"y"}/> are strictly inside. For the closed ball the same line runs with <InlineMath math={"\\le"}/> throughout</>}
                                 ko={<><InlineMath math={"x"}/>와 <InlineMath math={"y"}/>가 모두 안쪽에 진짜로 들어 있으므로 강부등호다. 닫힌 공에서는 같은 줄이 처음부터 끝까지 <InlineMath math={"\\le"}/>로 흐른다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Nothing in that argument mentioned which norm, so it holds for the 1-norm ball
                            (a diamond), the 2-norm ball (a disk), and the max-norm ball (a square) alike.
                            Chapter 3's norm ball figure is a picture of three convex sets.
                        </p>}
                        ko={<p>
                            이 논증 어디에서도 어느 norm인지를 말하지 않았으므로, 1-norm 공(마름모)에도,
                            2-norm 공(원판)에도, max-norm 공(정사각형)에도 똑같이 성립한다. 3장의 norm 공
                            그림은 볼록 집합 셋을 그린 것이다.
                        </p>}
                    />
                </Proof>
            </Remark>
            <CanvasFigure label={t("Convex or not: drag two points and watch the chord",
                "볼록한가 아닌가: 두 점을 끌면서 선분을 보라")}
                          modal={<ConvexSetLab width={780} height={470}/>}
                          bodyClassName="w-[min(92vw,920px)]">
                <ConvexSetLab/>
            </CanvasFigure>
            <Definition n="7.3" title={<T en={<>Convex hull</>} ko={<>볼록 껍질</>}/>}>
                <T
                    en={<p>
                        The <strong>convex hull</strong> of a set{" "}
                        <InlineMath math={"S \\subset \\mathcal{X}"}/> is the smallest convex set that
                        contains <InlineMath math={"S"}/>, equivalently the set of all convex
                        combinations of finitely many elements of{" "}
                        <InlineMath math={"S"}/>:
                    </p>}
                    ko={<p>
                        집합 <InlineMath math={"S \\subset \\mathcal{X}"}/>의{" "}
                        <strong>볼록 껍질</strong>은 <InlineMath math={"S"}/>를 포함하는 가장 작은 볼록
                        집합이고, 동치로 <InlineMath math={"S"}/>의 유한 개 원소의 볼록 결합 전체가
                        이루는 집합이다.
                    </p>}
                />
                <BlockMath math={"\\operatorname{co}(S) := \\Bigl\\{ \\textstyle\\sum_{i=1}^{k} \\lambda_i x_i \\ \\Big|\\ k \\ge 1,\\ x_i \\in S,\\ \\lambda_i \\ge 0,\\ \\textstyle\\sum_{i=1}^{k} \\lambda_i = 1 \\Bigr\\}"}/>
                <Terms items={[
                    ["k", <T en={<>how many points of <InlineMath math={"S"}/> the combination uses. It is not fixed in advance, and that is exactly what the notes' version leaves out</>}
                             ko={<>결합이 <InlineMath math={"S"}/>의 점을 몇 개 쓰는지다. 미리 고정되어 있지 않고, 교재의 판본이 빠뜨린 것이 정확히 이것이다</>}/>],
                    ["\\lambda_i", <T en={<>nonnegative weights summing to <InlineMath math={"1"}/>. With <InlineMath math={"k = 2"}/> this is Definition 7.1's convex combination word for word</>}
                                      ko={<>합이 <InlineMath math={"1"}/>인 음이 아닌 가중치. <InlineMath math={"k = 2"}/>이면 정의 7.1의 볼록 결합과 글자 그대로 같다</>}/>],
                    ["\\operatorname{co}(S)", <T en={<>always convex, and contained in every convex set that contains <InlineMath math={"S"}/>. For a finite <InlineMath math={"S"}/> in the plane it is the polygon you get by stretching a rubber band around the points</>}
                                                 ko={<>언제나 볼록하고, <InlineMath math={"S"}/>를 포함하는 모든 볼록 집합에 포함된다. 평면의 유한한 <InlineMath math={"S"}/>에서는 점들 둘레에 고무줄을 두른 다각형이다</>}/>],
                ]}/>
            </Definition>
            <Remark title={<T en={<>The notes' formula for the hull is not the hull</>}
                              ko={<>교재의 껍질 공식은 껍질이 아니다</>}/>}>
                <T
                    en={<p>
                        The notes display{" "}
                        <InlineMath math={"\\operatorname{co}(S) := \\{\\lambda x + (1-\\lambda)y \\mid 0 \\le \\lambda \\le 1,\\ x, y \\in S\\}"}/>,
                        which combines only two points at a time, and then add that the hull can also be
                        described as the smallest convex set containing{" "}
                        <InlineMath math={"S"}/>. In dimension one those agree. In the plane they do not.
                        Take <InlineMath math={"S = \\{(0,0), (1,0), (0,1)\\}"}/>. Every pairwise
                        combination lies on one of the three segments joining two of the points, so the
                        displayed formula produces the triangle's <em>boundary</em>. The centroid{" "}
                        <InlineMath math={"(\\tfrac{1}{3}, \\tfrac{1}{3}) = \\tfrac{1}{3}(0,0) + \\tfrac{1}{3}(1,0) + \\tfrac{1}{3}(0,1)"}/>{" "}
                        needs three points and is not on any of them, yet it is plainly inside the
                        smallest convex set containing{" "}
                        <InlineMath math={"S"}/>. The definition above uses{" "}
                        <InlineMath math={"k"}/> points and agrees with the "smallest convex set"
                        description.
                    </p>}
                    ko={<p>
                        교재는{" "}
                        <InlineMath math={"\\operatorname{co}(S) := \\{\\lambda x + (1-\\lambda)y \\mid 0 \\le \\lambda \\le 1,\\ x, y \\in S\\}"}/>를
                        띄워 놓는데, 이것은 한 번에 두 점만 결합한다. 그러고는 껍질을{" "}
                        <InlineMath math={"S"}/>를 포함하는 가장 작은 볼록 집합으로도 기술할 수 있다고
                        덧붙인다. 1차원에서는 둘이 일치한다. 평면에서는 그렇지 않다.{" "}
                        <InlineMath math={"S = \\{(0,0), (1,0), (0,1)\\}"}/>을 잡자. 두 점씩의 결합은
                        모두 세 점 중 둘을 잇는 세 선분 위에 놓이므로, 띄워 놓은 공식이 내놓는 것은
                        삼각형의 <em>경계</em>다. 무게중심{" "}
                        <InlineMath math={"(\\tfrac{1}{3}, \\tfrac{1}{3}) = \\tfrac{1}{3}(0,0) + \\tfrac{1}{3}(1,0) + \\tfrac{1}{3}(0,1)"}/>은
                        세 점을 필요로 하고 그 어느 선분 위에도 없지만, <InlineMath math={"S"}/>를
                        포함하는 가장 작은 볼록 집합 안에 있는 것은 분명하다. 위의 정의는{" "}
                        <InlineMath math={"k"}/>개의 점을 쓰고 "가장 작은 볼록 집합" 기술과 일치한다.
                    </p>}
                />
                <T
                    en={<p>
                        Carathéodory's theorem sharpens this: in{" "}
                        <InlineMath math={"\\mathbb{R}^n"}/>, taking{" "}
                        <InlineMath math={"k \\le n + 1"}/> always suffices. In the plane, three points per
                        combination is enough, which is exactly what the triangle's centroid used.
                    </p>}
                    ko={<p>
                        Carathéodory 정리가 이것을 더 날카롭게 만든다.{" "}
                        <InlineMath math={"\\mathbb{R}^n"}/>에서는{" "}
                        <InlineMath math={"k \\le n + 1"}/>이면 언제나 충분하다. 평면에서는 결합마다 점
                        셋이면 되는데, 삼각형의 무게중심이 쓴 것이 정확히 그 개수다.
                    </p>}
                />
            </Remark>
            <Definition n="7.4" title={<T en={<>Convex function</>} ko={<>볼록 함수</>}/>}>
                <T
                    en={<p>
                        Suppose <InlineMath math={"C \\subset \\mathcal{X}"}/> is convex. A function{" "}
                        <InlineMath math={"f : C \\to \\mathbb{R}"}/> is <strong>convex</strong> if for
                        all <InlineMath math={"x, y \\in C"}/> and{" "}
                        <InlineMath math={"0 \\le \\lambda \\le 1"}/>,
                    </p>}
                    ko={<p>
                        <InlineMath math={"C \\subset \\mathcal{X}"}/>이 볼록하다고 하자. 함수{" "}
                        <InlineMath math={"f : C \\to \\mathbb{R}"}/>이 <strong>볼록</strong>하다는 것은
                        모든 <InlineMath math={"x, y \\in C"}/>과{" "}
                        <InlineMath math={"0 \\le \\lambda \\le 1"}/>에 대해 다음이 성립한다는 뜻이다.
                    </p>}
                />
                <BlockMath math={"f\\bigl(\\lambda x + (1-\\lambda)y\\bigr) \\le \\lambda f(x) + (1-\\lambda) f(y)."}/>
                <Terms items={[
                    ["\\text{left side}", <T en={<>the function evaluated at a point of the segment. This is what the graph does</>}
                                             ko={<>선분 위의 한 점에서 함수를 잰 값. 그래프가 하는 일이다</>}/>],
                    ["\\text{right side}", <T en={<>the same weights applied to the two function values, which is the height of the chord above that point. This is what the straight line does</>}
                                              ko={<>같은 가중치를 두 함숫값에 적용한 것으로, 그 점 위에서 현의 높이다. 직선이 하는 일이다</>}/>],
                    ["C", <T en={<>required convex, otherwise <InlineMath math={"\\lambda x + (1-\\lambda) y"}/> could fall outside the domain and the left side would be undefined</>}
                             ko={<>볼록해야 한다. 그렇지 않으면 <InlineMath math={"\\lambda x + (1-\\lambda) y"}/>이 정의역 밖으로 떨어져 좌변이 정의되지 않는다</>}/>],
                ]}/>
            </Definition>
            <Remark n="7.5" title={<T en={<>Reading the inequality as a picture</>} ko={<>부등식을 그림으로 읽기</>}/>}>
                <T
                    en={<p>
                        For a function to be convex, the chord over{" "}
                        <InlineMath math={"\\lambda x + (1-\\lambda)y"}/> connecting{" "}
                        <InlineMath math={"x"}/> and <InlineMath math={"y"}/> must lie at or above the
                        graph of the function; it can never go below.
                    </p>}
                    ko={<p>
                        함수가 볼록하려면, <InlineMath math={"x"}/>와 <InlineMath math={"y"}/>를 잇는{" "}
                        <InlineMath math={"\\lambda x + (1-\\lambda)y"}/> 위의 현이 함수 그래프 위에
                        놓이거나 그래프에 닿아야 한다. 절대 아래로 내려갈 수 없다.
                    </p>}
                />
            </Remark>
            <Example n="7.4a" title={<T en={<>Numbers first: one convex, one not</>}
                                        ko={<>숫자 먼저: 하나는 볼록, 하나는 아님</>}/>}>
                <T
                    en={<p>
                        Take <InlineMath math={"f(t) = t^2"}/> with{" "}
                        <InlineMath math={"x = -1"}/>, <InlineMath math={"y = 3"}/>, and{" "}
                        <InlineMath math={"\\lambda = \\tfrac{1}{2}"}/>. Then{" "}
                        <InlineMath math={"z = 1"}/>, the left side is{" "}
                        <InlineMath math={"f(1) = 1"}/>, and the right side is{" "}
                        <InlineMath math={"\\tfrac{1}{2}(1) + \\tfrac{1}{2}(9) = 5"}/>. The chord sits{" "}
                        <InlineMath math={"4"}/> above the graph there.
                    </p>}
                    ko={<p>
                        <InlineMath math={"f(t) = t^2"}/>에{" "}
                        <InlineMath math={"x = -1"}/>, <InlineMath math={"y = 3"}/>,{" "}
                        <InlineMath math={"\\lambda = \\tfrac{1}{2}"}/>을 넣자.{" "}
                        <InlineMath math={"z = 1"}/>이고 좌변은{" "}
                        <InlineMath math={"f(1) = 1"}/>, 우변은{" "}
                        <InlineMath math={"\\tfrac{1}{2}(1) + \\tfrac{1}{2}(9) = 5"}/>다. 그 자리에서
                        현이 그래프보다 <InlineMath math={"4"}/>만큼 위에 있다.
                    </p>}
                />
                <T
                    en={<p>
                        Now <InlineMath math={"g(t) = \\tfrac{1}{6}t^3 - t"}/> with{" "}
                        <InlineMath math={"x = -3"}/>, <InlineMath math={"y = 1"}/>,{" "}
                        <InlineMath math={"\\lambda = \\tfrac{1}{2}"}/>, so{" "}
                        <InlineMath math={"z = -1"}/>:
                    </p>}
                    ko={<p>
                        이제 <InlineMath math={"g(t) = \\tfrac{1}{6}t^3 - t"}/>에{" "}
                        <InlineMath math={"x = -3"}/>, <InlineMath math={"y = 1"}/>,{" "}
                        <InlineMath math={"\\lambda = \\tfrac{1}{2}"}/>을 넣으면{" "}
                        <InlineMath math={"z = -1"}/>이다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} g(-1) &= \\tfrac{5}{6} \\approx 0.833, \\\\ \\tfrac{1}{2}g(-3) + \\tfrac{1}{2}g(1) &= \\tfrac{1}{2}(-\\tfrac{3}{2}) + \\tfrac{1}{2}(-\\tfrac{5}{6}) = -\\tfrac{7}{6} \\approx -1.167. \\end{aligned}"}/>
                <Terms items={[
                    ["g(-3)", <T en={<><InlineMath math={"-\\tfrac{27}{6} + 3 = -\\tfrac{3}{2}"}/></>}
                                 ko={<><InlineMath math={"-\\tfrac{27}{6} + 3 = -\\tfrac{3}{2}"}/>이다</>}/>],
                    ["g(1)", <T en={<><InlineMath math={"\\tfrac{1}{6} - 1 = -\\tfrac{5}{6}"}/></>}
                                ko={<><InlineMath math={"\\tfrac{1}{6} - 1 = -\\tfrac{5}{6}"}/>이다</>}/>],
                    ["\\text{verdict}", <T en={<><InlineMath math={"0.833 > -1.167"}/>, so the inequality of Definition 7.4 fails at this one triple, and that is enough: <InlineMath math={"g"}/> is not convex</>}
                                           ko={<><InlineMath math={"0.833 > -1.167"}/>이므로 이 한 조에서 정의 7.4의 부등식이 깨지고, 그것으로 충분하다. <InlineMath math={"g"}/>는 볼록하지 않다</>}/>],
                ]}/>
            </Example>
            <Definition title={<T en={<>Strictly convex, and the epigraph</>} ko={<>강볼록, 그리고 epigraph</>}/>}>
                <T
                    en={<p>
                        Neither of these is in the notes, and both are needed later, so they are stated
                        here. A function <InlineMath math={"f : C \\to \\mathbb{R}"}/> on a convex{" "}
                        <InlineMath math={"C"}/> is <strong>strictly convex</strong> if the inequality of
                        Definition 7.4 is strict whenever{" "}
                        <InlineMath math={"x \\ne y"}/> and{" "}
                        <InlineMath math={"0 < \\lambda < 1"}/>. The{" "}
                        <strong>epigraph</strong> of <InlineMath math={"f"}/> is the region on and above
                        its graph:
                    </p>}
                    ko={<p>
                        둘 다 교재에는 없고 둘 다 뒤에서 필요하므로 여기서 적어 둔다. 볼록한{" "}
                        <InlineMath math={"C"}/> 위의 함수{" "}
                        <InlineMath math={"f : C \\to \\mathbb{R}"}/>이 <strong>강볼록</strong>하다는
                        것은, <InlineMath math={"x \\ne y"}/>이고{" "}
                        <InlineMath math={"0 < \\lambda < 1"}/>일 때마다 정의 7.4의 부등식이 강부등식이
                        된다는 뜻이다. <InlineMath math={"f"}/>의 <strong>epigraph</strong>는 그래프와
                        그 위쪽 영역이다.
                    </p>}
                />
                <BlockMath math={"\\operatorname{epi} f := \\{(x, t) \\in C \\times \\mathbb{R} \\ :\\ f(x) \\le t\\}"}/>
                <Terms items={[
                    ["t", <T en={<>an extra scalar coordinate, a height. A point of <InlineMath math={"\\operatorname{epi} f"}/> is a point of the domain together with any height at or above the graph</>}
                             ko={<>여분의 스칼라 좌표, 곧 높이다. <InlineMath math={"\\operatorname{epi} f"}/>의 점은 정의역의 점과, 그래프에 닿거나 그 위인 임의의 높이를 짝지은 것이다</>}/>],
                    ["C \\times \\mathbb{R}", <T en={<>one dimension more than the domain. For <InlineMath math={"f : \\mathbb{R} \\to \\mathbb{R}"}/> the epigraph is a region of the plane, which is what the figure below shades</>}
                                                 ko={<>정의역보다 차원이 하나 많다. <InlineMath math={"f : \\mathbb{R} \\to \\mathbb{R}"}/>이면 epigraph는 평면의 한 영역이고, 아래 그림이 칠하는 것이 그것이다</>}/>],
                ]}/>
            </Definition>
            <Proposition title={<T en={<><InlineMath math={"f"}/> is convex if, and only if, <InlineMath math={"\\operatorname{epi} f"}/> is a convex set</>}
                                   ko={<><InlineMath math={"f"}/>가 볼록한 것과 <InlineMath math={"\\operatorname{epi} f"}/>가 볼록 집합인 것은 동치다</>}/>}>
                <Proof>
                    <T
                        en={<p>
                            Take <InlineMath math={"(x, s)"}/> and{" "}
                            <InlineMath math={"(y, u)"}/> in <InlineMath math={"\\operatorname{epi} f"}/>,
                            so <InlineMath math={"f(x) \\le s"}/> and{" "}
                            <InlineMath math={"f(y) \\le u"}/>, and let{" "}
                            <InlineMath math={"\\lambda \\in [0,1]"}/>. Assuming{" "}
                            <InlineMath math={"f"}/> convex,
                        </p>}
                        ko={<p>
                            <InlineMath math={"\\operatorname{epi} f"}/>에서{" "}
                            <InlineMath math={"(x, s)"}/>와{" "}
                            <InlineMath math={"(y, u)"}/>를 잡자. 곧{" "}
                            <InlineMath math={"f(x) \\le s"}/>, <InlineMath math={"f(y) \\le u"}/>이고{" "}
                            <InlineMath math={"\\lambda \\in [0,1]"}/>이라 하자.{" "}
                            <InlineMath math={"f"}/>가 볼록하다고 가정하면
                        </p>}
                    />
                    <BlockMath math={"f\\bigl(\\lambda x + (1-\\lambda)y\\bigr) \\ \\le\\ \\lambda f(x) + (1-\\lambda)f(y) \\ \\le\\ \\lambda s + (1-\\lambda) u,"}/>
                    <Terms items={[
                        ["\\text{first } \\le", <T en={<>Definition 7.4, the convexity of <InlineMath math={"f"}/></>}
                                                   ko={<>정의 7.4, 곧 <InlineMath math={"f"}/>의 볼록성이다</>}/>],
                        ["\\text{second } \\le", <T en={<>the two membership conditions, weighted by nonnegative numbers. Multiplying an inequality by a nonnegative number preserves it</>}
                                                    ko={<>두 소속 조건에 음이 아닌 수를 곱해 더한 것이다. 부등식에 음이 아닌 수를 곱해도 방향은 유지된다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            which says exactly that{" "}
                            <InlineMath math={"\\lambda(x, s) + (1-\\lambda)(y, u) \\in \\operatorname{epi} f"}/>.
                            Conversely, if the epigraph is convex, apply that with the tightest heights{" "}
                            <InlineMath math={"s = f(x)"}/> and <InlineMath math={"u = f(y)"}/>: the
                            combination is in the epigraph, which is the inequality of Definition 7.4.
                        </p>}
                        ko={<p>
                            이것은 정확히{" "}
                            <InlineMath math={"\\lambda(x, s) + (1-\\lambda)(y, u) \\in \\operatorname{epi} f"}/>이라는
                            말이다. 거꾸로 epigraph가 볼록하면 가장 빡빡한 높이{" "}
                            <InlineMath math={"s = f(x)"}/>, <InlineMath math={"u = f(y)"}/>에 그것을
                            적용하면 된다. 결합이 epigraph 안에 있고, 그것이 정의 7.4의 부등식이다.
                        </p>}
                    />
                </Proof>
                <T
                    en={<p>
                        Keep this. The last section of the chapter turns two non-differentiable cost
                        functions into linear programs by introducing exactly the variable{" "}
                        <InlineMath math={"t"}/> of this definition, one per row of the residual.
                    </p>}
                    ko={<p>
                        이것을 기억해 두자. 이 장의 마지막 절은 미분 불가능한 비용 함수 둘을 linear
                        program으로 바꾸는데, 그 방법이 바로 이 정의의 변수{" "}
                        <InlineMath math={"t"}/>를 잔차의 행마다 하나씩 도입하는 것이다.
                    </p>}
                />
            </Proposition>
            <CanvasFigure label={t("Chord, tangent, epigraph: three views of one property",
                "현, 접선, epigraph: 한 성질의 세 가지 모습")}
                          modal={<ConvexFunctionLab width={780} height={470}/>}
                          bodyClassName="w-[min(92vw,920px)]">
                <ConvexFunctionLab/>
            </CanvasFigure>
            <Definition n="7.6" title={<T en={<>Local and global minimum</>} ko={<>국소 최솟값과 전역 최솟값</>}/>}>
                <T
                    en={<p>
                        Suppose <InlineMath math={"(\\mathcal{X}, \\mathbb{R}, \\|\\bullet\\|)"}/> is a
                        normed space, <InlineMath math={"D \\subset \\mathcal{X}"}/> a subset, and{" "}
                        <InlineMath math={"f : D \\to \\mathbb{R}"}/> a function.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathbb{R}, \\|\\bullet\\|)"}/>을 normed
                        space, <InlineMath math={"D \\subset \\mathcal{X}"}/>을 부분집합,{" "}
                        <InlineMath math={"f : D \\to \\mathbb{R}"}/>을 함수라 하자.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} &\\text{(a) } x^* \\text{ is a local minimum: } && \\exists\\, \\delta > 0 \\ \\text{ s.t. } \\ \\forall x \\in B_\\delta(x^*) \\cap D,\\ f(x^*) \\le f(x) \\\\ &\\text{(b) } x^* \\text{ is a global minimum: } && \\forall y \\in D,\\ f(x^*) \\le f(y) \\end{aligned}"}/>
                <Terms items={[
                    ["\\delta", <T en={<>the radius of a neighbourhood the local claim is allowed to hide in. It may be as small as you like, and that is the whole difference between the two lines</>}
                                   ko={<>국소 주장이 숨을 수 있는 근방의 반지름. 원하는 만큼 작아도 되고, 두 줄의 차이가 전부 그것이다</>}/>],
                    ["B_\\delta(x^*)", <T en={<>the open ball of Chapter 6, <InlineMath math={"\\{x : \\|x - x^*\\| < \\delta\\}"}/>. Intersecting with <InlineMath math={"D"}/> keeps the comparison inside the domain</>}
                                          ko={<>6장의 열린 공 <InlineMath math={"\\{x : \\|x - x^*\\| < \\delta\\}"}/>이다. <InlineMath math={"D"}/>와 교집합을 취해 비교를 정의역 안에 붙들어 둔다</>}/>],
                    ["\\forall y \\in D", <T en={<>no neighbourhood at all: the comparison runs over the entire feasible set. Every global minimum is a local one, and the theorem below says convexity buys the converse</>}
                                             ko={<>근방이 아예 없다. 비교가 실행 가능 집합 전체를 훑는다. 전역 최솟값은 모두 국소 최솟값이고, 아래 정리는 볼록성이 그 역을 사 준다고 말한다</>}/>],
                ]}/>
            </Definition>
            <Theorem n="7.7" title={<T en={<>Local equals global for convex functions</>}
                                       ko={<>볼록 함수에서는 국소가 곧 전역</>}/>}>
                <T
                    en={<p>
                        If <InlineMath math={"D"}/> and <InlineMath math={"f"}/> are both convex, then any
                        local minimum of <InlineMath math={"f"}/> is also a global minimum.
                    </p>}
                    ko={<p>
                        <InlineMath math={"D"}/>와 <InlineMath math={"f"}/>가 모두 볼록하면,{" "}
                        <InlineMath math={"f"}/>의 어떤 국소 최솟값도 전역 최솟값이다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            The statement is <InlineMath math={"(a) \\implies (b)"}/> with{" "}
                            <InlineMath math={"(a)"}/> and <InlineMath math={"(b)"}/> as in Definition
                            7.6, and it is proved by the contrapositive{" "}
                            <InlineMath math={"\\lnot(b) \\implies \\lnot(a)"}/>, which is Chapter 1's
                            move. Negating each line with Chapter 1's rules:
                        </p>}
                        ko={<p>
                            진술은 정의 7.6의 <InlineMath math={"(a)"}/>, <InlineMath math={"(b)"}/>에
                            대한 <InlineMath math={"(a) \\implies (b)"}/>이고, 대우{" "}
                            <InlineMath math={"\\lnot(b) \\implies \\lnot(a)"}/>로 증명한다. 1장의
                            수법이다. 1장의 규칙으로 각 줄을 부정하면
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} \\lnot(b): \\quad & \\exists\\, y \\in D \\ \\text{ such that } \\ f(y) < f(x) \\\\ \\lnot(a): \\quad & \\forall\\, \\delta > 0,\\ \\exists\\, z \\in B_\\delta(x) \\cap D \\ \\text{ such that } \\ f(z) < f(x) \\end{aligned}"}/>
                    <Terms items={[
                        ["x", <T en={<>the point whose local minimality is in question. It is fixed for the whole proof</>}
                                 ko={<>국소 최소성이 문제가 되는 점. 증명 내내 고정이다</>}/>],
                        ["y", <T en={<>the witness that <InlineMath math={"x"}/> is not global. Note <InlineMath math={"y \\ne x"}/> automatically, since <InlineMath math={"f(y) < f(x)"}/> rules out <InlineMath math={"y = x"}/></>}
                                 ko={<><InlineMath math={"x"}/>가 전역이 아니라는 증인. <InlineMath math={"f(y) < f(x)"}/>이 <InlineMath math={"y = x"}/>을 배제하므로 <InlineMath math={"y \\ne x"}/>은 자동이다</>}/>],
                        ["z", <T en={<>the witness that <InlineMath math={"x"}/> is not local. It must be produced for every <InlineMath math={"\\delta"}/>, however small, which is what the two claims below do</>}
                                 ko={<><InlineMath math={"x"}/>가 국소가 아니라는 증인. 아무리 작은 <InlineMath math={"\\delta"}/>에 대해서도 만들어 내야 하고, 아래 두 주장이 하는 일이 그것이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>Claim 7.8.</strong> If{" "}
                            <InlineMath math={"f(y) < f(x)"}/> then for every{" "}
                            <InlineMath math={"0 < \\lambda \\le 1"}/> the vector{" "}
                            <InlineMath math={"z := (1-\\lambda)x + \\lambda y"}/> satisfies{" "}
                            <InlineMath math={"f(z) < f(x)"}/>.
                        </p>}
                        ko={<p>
                            <strong>주장 7.8.</strong>{" "}
                            <InlineMath math={"f(y) < f(x)"}/>이면 모든{" "}
                            <InlineMath math={"0 < \\lambda \\le 1"}/>에 대해 벡터{" "}
                            <InlineMath math={"z := (1-\\lambda)x + \\lambda y"}/>이{" "}
                            <InlineMath math={"f(z) < f(x)"}/>을 만족한다.
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} f(z) &= f\\bigl((1-\\lambda)x + \\lambda y\\bigr) \\\\ &\\le (1-\\lambda)f(x) + \\lambda f(y) && [\\text{convexity of } f] \\\\ &< (1-\\lambda)f(x) + \\lambda f(x) && [f(y) < f(x),\\ \\lambda > 0] \\\\ &= f(x). \\end{aligned}"}/>
                    <Terms items={[
                        ["\\le", <T en={<>Definition 7.4 with the weights <InlineMath math={"1-\\lambda"}/> on <InlineMath math={"x"}/> and <InlineMath math={"\\lambda"}/> on <InlineMath math={"y"}/>. It needs <InlineMath math={"D"}/> convex so that <InlineMath math={"z \\in D"}/> and <InlineMath math={"f(z)"}/> is defined</>}
                                    ko={<><InlineMath math={"x"}/>에 <InlineMath math={"1-\\lambda"}/>, <InlineMath math={"y"}/>에 <InlineMath math={"\\lambda"}/>를 준 정의 7.4다. <InlineMath math={"z \\in D"}/>이라야 <InlineMath math={"f(z)"}/>이 정의되므로 <InlineMath math={"D"}/>의 볼록성이 필요하다</>}/>],
                        ["<", <T en={<>strict only because <InlineMath math={"\\lambda > 0"}/>. At <InlineMath math={"\\lambda = 0"}/> the line collapses to <InlineMath math={"f(x) = f(x)"}/> and says nothing, which is why the claim excludes it</>}
                                 ko={<><InlineMath math={"\\lambda > 0"}/>이기 때문에만 강부등호다. <InlineMath math={"\\lambda = 0"}/>에서는 줄이 <InlineMath math={"f(x) = f(x)"}/>로 주저앉아 아무 말도 하지 않고, 주장이 그것을 배제하는 이유가 그것이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>Claim 7.9.</strong> For every{" "}
                            <InlineMath math={"\\delta > 0"}/> there exists{" "}
                            <InlineMath math={"0 < \\lambda < 1"}/> such that{" "}
                            <InlineMath math={"z := (1-\\lambda)x + \\lambda y"}/> lies in{" "}
                            <InlineMath math={"B_\\delta(x) \\cap D"}/>. The distance from{" "}
                            <InlineMath math={"z"}/> to <InlineMath math={"x"}/> is a fixed multiple
                            of <InlineMath math={"\\lambda"}/>:
                        </p>}
                        ko={<p>
                            <strong>주장 7.9.</strong> 모든{" "}
                            <InlineMath math={"\\delta > 0"}/>에 대해{" "}
                            <InlineMath math={"z := (1-\\lambda)x + \\lambda y"}/>이{" "}
                            <InlineMath math={"B_\\delta(x) \\cap D"}/>에 놓이는{" "}
                            <InlineMath math={"0 < \\lambda < 1"}/>이 존재한다.{" "}
                            <InlineMath math={"z"}/>과 <InlineMath math={"x"}/> 사이의 거리는{" "}
                            <InlineMath math={"\\lambda"}/>의 고정된 배수다.
                        </p>}
                    />
                    <BlockMath math={"\\|z - x\\| = \\|(1-\\lambda)x + \\lambda y - x\\| = \\|\\lambda(y - x)\\| = \\lambda\\,\\|y - x\\|."}/>
                    <Terms items={[
                        ["(1-\\lambda)x - x", <T en={<>equals <InlineMath math={"-\\lambda x"}/>, so the whole expression collapses to <InlineMath math={"\\lambda(y-x)"}/>. This is the step the notes leave to the reader</>}
                                                 ko={<><InlineMath math={"-\\lambda x"}/>이므로 식 전체가 <InlineMath math={"\\lambda(y-x)"}/>로 주저앉는다. 교재가 독자에게 넘기는 단계가 이것이다</>}/>],
                        ["\\|\\lambda v\\|", <T en={<><InlineMath math={"= |\\lambda|\\,\\|v\\| = \\lambda\\|v\\|"}/> since <InlineMath math={"\\lambda > 0"}/>: absolute homogeneity from the norm axioms</>}
                                                ko={<><InlineMath math={"\\lambda > 0"}/>이므로 <InlineMath math={"= |\\lambda|\\,\\|v\\| = \\lambda\\|v\\|"}/>이다. norm 공리의 절대 동차성이다</>}/>],
                        ["\\|y - x\\|", <T en={<>strictly positive, because <InlineMath math={"y \\ne x"}/>. Dividing by it below is therefore legal</>}
                                           ko={<><InlineMath math={"y \\ne x"}/>이므로 진짜로 양수다. 그래서 아래에서 이것으로 나누는 것이 정당하다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            So choose any <InlineMath math={"\\lambda"}/> with
                        </p>}
                        ko={<p>
                            그러므로 다음을 만족하는 <InlineMath math={"\\lambda"}/>를 아무거나 고른다.
                        </p>}
                    />
                    <BlockMath math={"0 < \\lambda < \\min\\Bigl\\{\\frac{\\delta}{\\|y - x\\|},\\ 1\\Bigr\\} \\implies \\|z - x\\| = \\lambda\\|y-x\\| < \\delta,"}/>
                    <Terms items={[
                        ["\\min", <T en={<>both bounds must hold at once: <InlineMath math={"\\lambda < \\delta/\\|y-x\\|"}/> puts <InlineMath math={"z"}/> inside the ball, and <InlineMath math={"\\lambda < 1"}/> keeps it a genuine interior point of the segment</>}
                                     ko={<>두 한계가 동시에 성립해야 한다. <InlineMath math={"\\lambda < \\delta/\\|y-x\\|"}/>이 <InlineMath math={"z"}/>을 공 안에 넣고, <InlineMath math={"\\lambda < 1"}/>이 그것을 선분의 진짜 내부 점으로 남긴다</>}/>],
                        ["z \\in D", <T en={<>because <InlineMath math={"D"}/> is convex and <InlineMath math={"z"}/> is a convex combination of <InlineMath math={"x, y \\in D"}/>. Hence <InlineMath math={"z \\in B_\\delta(x) \\cap D"}/></>}
                                        ko={<><InlineMath math={"D"}/>가 볼록하고 <InlineMath math={"z"}/>이 <InlineMath math={"x, y \\in D"}/>의 볼록 결합이기 때문이다. 따라서 <InlineMath math={"z \\in B_\\delta(x) \\cap D"}/>이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The two claims together produce, for an arbitrary{" "}
                            <InlineMath math={"\\delta > 0"}/>, a point{" "}
                            <InlineMath math={"z \\in B_\\delta(x) \\cap D"}/> with{" "}
                            <InlineMath math={"f(z) < f(x)"}/>. That is{" "}
                            <InlineMath math={"\\lnot(a)"}/>, and the contrapositive is established.
                        </p>}
                        ko={<p>
                            두 주장을 합치면 임의의{" "}
                            <InlineMath math={"\\delta > 0"}/>에 대해{" "}
                            <InlineMath math={"f(z) < f(x)"}/>인 점{" "}
                            <InlineMath math={"z \\in B_\\delta(x) \\cap D"}/>이 나온다. 그것이{" "}
                            <InlineMath math={"\\lnot(a)"}/>이고 대우가 세워졌다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Remark title={<T en={<>The notes write max where min is meant</>} ko={<>교재가 min 자리에 max를 적었다</>}/>}>
                <T
                    en={<p>
                        Claim 7.9 in the notes reads{" "}
                        <InlineMath math={"0 < \\lambda < \\max\\{\\delta/\\|y-x\\|,\\ 1\\}"}/>. With a
                        maximum the bound is useless whenever{" "}
                        <InlineMath math={"\\delta"}/> is small: take{" "}
                        <InlineMath math={"\\delta = \\tfrac{1}{10}"}/> and{" "}
                        <InlineMath math={"\\|y - x\\| = 1"}/>, so the ratio is{" "}
                        <InlineMath math={"\\tfrac{1}{10}"}/> and{" "}
                        <InlineMath math={"\\max\\{\\tfrac{1}{10}, 1\\} = 1"}/>. That permits{" "}
                        <InlineMath math={"\\lambda = \\tfrac{9}{10}"}/> and gives{" "}
                        <InlineMath math={"\\|z - x\\| = \\tfrac{9}{10} > \\delta"}/>, so{" "}
                        <InlineMath math={"z \\notin B_\\delta(x)"}/> and the claim fails. With{" "}
                        <InlineMath math={"\\min"}/> the same numbers force{" "}
                        <InlineMath math={"\\lambda < \\tfrac{1}{10}"}/> and{" "}
                        <InlineMath math={"\\|z-x\\| < \\tfrac{1}{10} = \\delta"}/>. The proof above uses{" "}
                        <InlineMath math={"\\min"}/>.
                    </p>}
                    ko={<p>
                        교재의 주장 7.9는{" "}
                        <InlineMath math={"0 < \\lambda < \\max\\{\\delta/\\|y-x\\|,\\ 1\\}"}/>로 적혀
                        있다. 최댓값으로 두면 <InlineMath math={"\\delta"}/>이 작을 때마다 이 한계가
                        쓸모없어진다. <InlineMath math={"\\delta = \\tfrac{1}{10}"}/>,{" "}
                        <InlineMath math={"\\|y - x\\| = 1"}/>이라 하면 비는{" "}
                        <InlineMath math={"\\tfrac{1}{10}"}/>이고{" "}
                        <InlineMath math={"\\max\\{\\tfrac{1}{10}, 1\\} = 1"}/>이다. 이것은{" "}
                        <InlineMath math={"\\lambda = \\tfrac{9}{10}"}/>을 허용하고{" "}
                        <InlineMath math={"\\|z - x\\| = \\tfrac{9}{10} > \\delta"}/>이 되어{" "}
                        <InlineMath math={"z \\notin B_\\delta(x)"}/>, 주장이 깨진다.{" "}
                        <InlineMath math={"\\min"}/>으로 두면 같은 수들이{" "}
                        <InlineMath math={"\\lambda < \\tfrac{1}{10}"}/>을 강제하고{" "}
                        <InlineMath math={"\\|z-x\\| < \\tfrac{1}{10} = \\delta"}/>이 된다. 위 증명은{" "}
                        <InlineMath math={"\\min"}/>을 쓴다.
                    </p>}
                />
            </Remark>
            <Corollary title={<T en={<>A strictly convex function has at most one minimizer</>}
                                 ko={<>강볼록 함수의 최소점은 많아야 하나다</>}/>}>
                <T
                    en={<p>
                        This is not in the notes and it is what makes the equals sign in{" "}
                        <InlineMath math={"x^* = \\arg\\min f(x)"}/> legitimate, so it is proved here.
                        Let <InlineMath math={"D"}/> be convex and{" "}
                        <InlineMath math={"f"}/> strictly convex on it.
                    </p>}
                    ko={<p>
                        교재에는 없지만{" "}
                        <InlineMath math={"x^* = \\arg\\min f(x)"}/>의 등호를 정당하게 만드는 것이
                        이것이라 여기서 증명한다. <InlineMath math={"D"}/>이 볼록하고{" "}
                        <InlineMath math={"f"}/>이 그 위에서 강볼록하다고 하자.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            Suppose <InlineMath math={"x_1 \\ne x_2"}/> are both global minimizers, with
                            the common value{" "}
                            <InlineMath math={"f(x_1) = f(x_2) = f^*"}/>. Their midpoint{" "}
                            <InlineMath math={"z = \\tfrac{1}{2}x_1 + \\tfrac{1}{2}x_2"}/> lies in{" "}
                            <InlineMath math={"D"}/> because <InlineMath math={"D"}/> is convex, and
                            strict convexity applies because{" "}
                            <InlineMath math={"x_1 \\ne x_2"}/> and{" "}
                            <InlineMath math={"\\lambda = \\tfrac{1}{2} \\in (0,1)"}/>:
                        </p>}
                        ko={<p>
                            <InlineMath math={"x_1 \\ne x_2"}/>이 둘 다 전역 최소점이고 공통값이{" "}
                            <InlineMath math={"f(x_1) = f(x_2) = f^*"}/>이라 하자. 중점{" "}
                            <InlineMath math={"z = \\tfrac{1}{2}x_1 + \\tfrac{1}{2}x_2"}/>은{" "}
                            <InlineMath math={"D"}/>이 볼록하므로 <InlineMath math={"D"}/> 안에 있고,{" "}
                            <InlineMath math={"x_1 \\ne x_2"}/>이고{" "}
                            <InlineMath math={"\\lambda = \\tfrac{1}{2} \\in (0,1)"}/>이므로 강볼록성이
                            적용된다.
                        </p>}
                    />
                    <BlockMath math={"f(z) \\ <\\ \\tfrac{1}{2}f(x_1) + \\tfrac{1}{2}f(x_2) \\ =\\ \\tfrac{1}{2}f^* + \\tfrac{1}{2}f^* \\ =\\ f^*."}/>
                    <Terms items={[
                        ["<", <T en={<>strict by the definition of strict convexity. Ordinary convexity would give <InlineMath math={"\\le"}/> here and prove nothing, which is exactly why the strict version had to be introduced</>}
                                 ko={<>강볼록성의 정의에 의해 강부등호다. 보통의 볼록성이면 여기서 <InlineMath math={"\\le"}/>이 되어 아무것도 증명하지 못하고, 강한 판본을 도입해야 했던 이유가 정확히 그것이다</>}/>],
                        ["f^*", <T en={<>the minimum value over all of <InlineMath math={"D"}/>. But <InlineMath math={"z \\in D"}/> and <InlineMath math={"f(z) < f^*"}/>, contradicting minimality</>}
                                   ko={<><InlineMath math={"D"}/> 전체에서의 최솟값이다. 그런데 <InlineMath math={"z \\in D"}/>이고 <InlineMath math={"f(z) < f^*"}/>이라 최소성에 모순이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            So there cannot be two. Note the word "at most": strict convexity gives
                            uniqueness but not existence, and{" "}
                            <InlineMath math={"f(t) = e^{-t}"}/> on{" "}
                            <InlineMath math={"[0, \\infty)"}/> is strictly convex with no minimizer at
                            all. Existence is a separate question, and it is Chapter 6's.
                        </p>}
                        ko={<p>
                            그러므로 둘일 수 없다. "많아야"라는 말에 주의하자. 강볼록성은 유일성을 주지만
                            존재성을 주지는 않는다.{" "}
                            <InlineMath math={"[0, \\infty)"}/> 위의{" "}
                            <InlineMath math={"f(t) = e^{-t}"}/>은 강볼록인데 최소점이 아예 없다.
                            존재성은 별개의 질문이고, 그것은 6장의 것이다.
                        </p>}
                    />
                </Proof>
            </Corollary>
            <Remark n="7.10" title={<T en={<>Fact 7.10: a working list of convex objects</>}
                                       ko={<>사실 7.10: 볼록한 것들의 실용 목록</>}/>}>
                <T
                    en={<p>
                        These are the building blocks. Almost every convex problem in robotics is
                        assembled from this list rather than checked against Definition 7.4 directly.
                    </p>}
                    ko={<p>
                        이것들이 재료다. 로봇에서 나오는 볼록 문제는 대부분 정의 7.4로 직접 확인하는 대신
                        이 목록에서 조립해 만든다.
                    </p>}
                />
                <T
                    en={<ol>
                        <li>All norms <InlineMath math={"\\|\\bullet\\| : \\mathcal{X} \\to [0, \\infty)"}/>{" "}
                            are convex. The proof is the first two lines of Remark 7.2's proof with{" "}
                            <InlineMath math={"x_0 = 0"}/>.</li>
                        <li>For all <InlineMath math={"1 \\le \\beta < \\infty"}/>,{" "}
                            <InlineMath math={"\\|\\bullet\\|^\\beta"}/> is convex. Hence on{" "}
                            <InlineMath math={"\\mathbb{R}^n"}/>,{" "}
                            <InlineMath math={"\\sum_{i=1}^n |x_i|^p"}/> is convex for every{" "}
                            <InlineMath math={"1 \\le p < \\infty"}/>. The reason is that{" "}
                            <InlineMath math={"t \\mapsto t^\\beta"}/> is convex <em>and</em>{" "}
                            nondecreasing on <InlineMath math={"[0, \\infty)"}/>, and a nondecreasing
                            convex function of a convex function is convex.</li>
                        <li>For <InlineMath math={"r > 0"}/> and any norm,{" "}
                            <InlineMath math={"B_r(x_0)"}/> is a convex set; in particular the unit ball{" "}
                            <InlineMath math={"B_1(0)"}/> is convex.</li>
                        <li>Conversely, if <InlineMath math={"C"}/> is open, bounded, convex and contains{" "}
                            <InlineMath math={"0"}/>, then there is a norm with{" "}
                            <InlineMath math={"C = \\{x : \\|x\\| < 1\\} = B_1(0)"}/>. Open unit balls are
                            characterized by being open bounded convex sets containing the origin. The
                            notes state this without proof and so does this page.</li>
                        <li>If <InlineMath math={"K_1"}/> and <InlineMath math={"K_2"}/> are convex then{" "}
                            <InlineMath math={"K_1 \\cap K_2"}/> is convex. By convention the empty set is
                            convex, so no case analysis is needed.</li>
                        <li>On <InlineMath math={"(\\mathbb{R}^n, \\mathbb{R})"}/>, with{" "}
                            <InlineMath math={"A"}/> a real <InlineMath math={"m \\times n"}/> matrix and{" "}
                            <InlineMath math={"b \\in \\mathbb{R}^m"}/>, all three of{" "}
                            <InlineMath math={"K_1 = \\{x : Ax \\preceq b\\}"}/>,{" "}
                            <InlineMath math={"K_2 = \\{x : Ax = b\\}"}/>, and{" "}
                            <InlineMath math={"K_3 = \\{x : A_{eq}x = b_{eq},\\ A_{in}x \\preceq b_{in}\\}"}/>{" "}
                            are convex; the third follows from the first two by (5).</li>
                    </ol>}
                    ko={<ol>
                        <li>모든 norm <InlineMath math={"\\|\\bullet\\| : \\mathcal{X} \\to [0, \\infty)"}/>은
                            볼록하다. 증명은 참고 7.2 증명의 첫 두 줄에{" "}
                            <InlineMath math={"x_0 = 0"}/>을 넣은 것이다.</li>
                        <li>모든 <InlineMath math={"1 \\le \\beta < \\infty"}/>에 대해{" "}
                            <InlineMath math={"\\|\\bullet\\|^\\beta"}/>은 볼록하다. 따라서{" "}
                            <InlineMath math={"\\mathbb{R}^n"}/>에서 모든{" "}
                            <InlineMath math={"1 \\le p < \\infty"}/>에 대해{" "}
                            <InlineMath math={"\\sum_{i=1}^n |x_i|^p"}/>이 볼록하다. 이유는{" "}
                            <InlineMath math={"t \\mapsto t^\\beta"}/>이{" "}
                            <InlineMath math={"[0, \\infty)"}/>에서 볼록하고 <em>동시에</em> 증가하지
                            않는 구간이 없기 때문이고, 볼록 함수에 단조 증가하는 볼록 함수를 합성하면
                            볼록하다.</li>
                        <li><InlineMath math={"r > 0"}/>과 임의의 norm에 대해{" "}
                            <InlineMath math={"B_r(x_0)"}/>은 볼록 집합이다. 특히 단위 공{" "}
                            <InlineMath math={"B_1(0)"}/>이 볼록하다.</li>
                        <li>거꾸로 <InlineMath math={"C"}/>이 열려 있고 유계이며 볼록하고{" "}
                            <InlineMath math={"0"}/>을 품으면,{" "}
                            <InlineMath math={"C = \\{x : \\|x\\| < 1\\} = B_1(0)"}/>이 되는 norm이
                            존재한다. 열린 단위 공은 원점을 품는 열린 유계 볼록 집합이라는 성질로
                            특징지어진다. 교재는 이것을 증명 없이 진술하고 이 페이지도 그렇게 한다.</li>
                        <li><InlineMath math={"K_1"}/>과 <InlineMath math={"K_2"}/>이 볼록하면{" "}
                            <InlineMath math={"K_1 \\cap K_2"}/>도 볼록하다. 관례상 공집합은 볼록하므로
                            경우 나누기가 필요 없다.</li>
                        <li><InlineMath math={"(\\mathbb{R}^n, \\mathbb{R})"}/>에서{" "}
                            <InlineMath math={"A"}/>가 실수 <InlineMath math={"m \\times n"}/> 행렬,{" "}
                            <InlineMath math={"b \\in \\mathbb{R}^m"}/>일 때{" "}
                            <InlineMath math={"K_1 = \\{x : Ax \\preceq b\\}"}/>,{" "}
                            <InlineMath math={"K_2 = \\{x : Ax = b\\}"}/>,{" "}
                            <InlineMath math={"K_3 = \\{x : A_{eq}x = b_{eq},\\ A_{in}x \\preceq b_{in}\\}"}/>이
                            모두 볼록하다. 세 번째는 앞의 둘과 (5)에서 따라 나온다.</li>
                    </ol>}
                />
                <Proof label={<T en={<>Proof of (5), the intersection rule</>} ko={<>(5) 교집합 규칙의 증명</>}/>}>
                    <T
                        en={<p>
                            Take <InlineMath math={"x, y \\in K_1 \\cap K_2"}/> and{" "}
                            <InlineMath math={"\\lambda \\in [0,1]"}/>. Since{" "}
                            <InlineMath math={"x, y \\in K_1"}/> and{" "}
                            <InlineMath math={"K_1"}/> is convex,{" "}
                            <InlineMath math={"\\lambda x + (1-\\lambda)y \\in K_1"}/>. The identical
                            sentence with <InlineMath math={"K_2"}/> gives{" "}
                            <InlineMath math={"\\lambda x + (1-\\lambda)y \\in K_2"}/>. A point in both is
                            in the intersection.
                        </p>}
                        ko={<p>
                            <InlineMath math={"x, y \\in K_1 \\cap K_2"}/>과{" "}
                            <InlineMath math={"\\lambda \\in [0,1]"}/>을 잡자.{" "}
                            <InlineMath math={"x, y \\in K_1"}/>이고{" "}
                            <InlineMath math={"K_1"}/>이 볼록하므로{" "}
                            <InlineMath math={"\\lambda x + (1-\\lambda)y \\in K_1"}/>이다.{" "}
                            <InlineMath math={"K_2"}/>에 대해 똑같은 문장이{" "}
                            <InlineMath math={"\\lambda x + (1-\\lambda)y \\in K_2"}/>을 준다. 둘 다에
                            들어 있는 점은 교집합에 있다.
                        </p>}
                    />
                    <T
                        en={<p>
                            The same argument runs over any family of convex sets, finite or not, which is
                            why constraints can be piled up without limit and the feasible set stays
                            convex. It says nothing about unions, and the figure above shows why: two
                            disjoint balls are each convex and their union is not. That asymmetry is the
                            practical dividing line in robotics between problems a QP solver handles and
                            problems that need a planner.
                        </p>}
                        ko={<p>
                            같은 논증이 유한이든 아니든 임의의 볼록 집합 족에 대해 돌아간다. 그래서 제약을
                            끝없이 쌓아도 실행 가능 집합이 볼록하게 남는다. 합집합에 대해서는 아무 말도
                            하지 않는데, 위 그림이 그 이유를 보인다. 서로 떨어진 두 공은 각각 볼록하고 그
                            합집합은 볼록하지 않다. 이 비대칭이 로봇에서 QP solver가 감당하는 문제와
                            planner가 필요한 문제를 가르는 실질적인 경계선이다.
                        </p>}
                    />
                </Proof>
            </Remark>
            <Example n="7.10a" title={<T en={<>The polyhedron, with numbers</>} ko={<>다면체를 숫자로</>}/>}>
                <T
                    en={<p>
                        Take <InlineMath math={"A = \\begin{bmatrix} 3 & 1 \\\\ 2 & 4\\end{bmatrix}"}/>{" "}
                        and <InlineMath math={"b = \\begin{bmatrix} 0 \\\\ 9\\end{bmatrix}"}/>. Then{" "}
                        <InlineMath math={"Ax \\preceq b"}/> is read one row at a time:
                    </p>}
                    ko={<p>
                        <InlineMath math={"A = \\begin{bmatrix} 3 & 1 \\\\ 2 & 4\\end{bmatrix}"}/>,{" "}
                        <InlineMath math={"b = \\begin{bmatrix} 0 \\\\ 9\\end{bmatrix}"}/>을 잡자.{" "}
                        <InlineMath math={"Ax \\preceq b"}/>은 한 번에 한 행씩 읽는다.
                    </p>}
                />
                <BlockMath math={"\\begin{bmatrix} 3 & 1 \\\\ 2 & 4\\end{bmatrix}\\begin{bmatrix} x_1 \\\\ x_2\\end{bmatrix} \\preceq \\begin{bmatrix} 0 \\\\ 9\\end{bmatrix} \\iff \\begin{aligned} 3x_1 + x_2 &\\le 0 \\\\ 2x_1 + 4x_2 &\\le 9 \\end{aligned}"}/>
                <Terms items={[
                    ["\\preceq", <T en={<>componentwise. As the notes' example records, <InlineMath math={"(3,2,4)^\\top \\preceq (4,3,4)^\\top"}/> holds but <InlineMath math={"(3,2,4)^\\top \\npreceq (1,3,4)^\\top"}/>, because the first row already fails</>}
                                    ko={<>성분별이다. 교재의 예가 적어 두듯 <InlineMath math={"(3,2,4)^\\top \\preceq (4,3,4)^\\top"}/>은 성립하지만 <InlineMath math={"(3,2,4)^\\top \\npreceq (1,3,4)^\\top"}/>이다. 첫 행에서 이미 깨지기 때문이다</>}/>],
                    ["K_1", <T en={<>the set of <InlineMath math={"x"}/> satisfying both rows: the intersection of two half-planes, convex by items (5) and (6)</>}
                               ko={<>두 행을 모두 만족하는 <InlineMath math={"x"}/>의 모임. 반평면 둘의 교집합이고 항목 (5), (6)에 의해 볼록하다</>}/>],
                ]}/>
            </Example>
            <Remark n="7.11" title={<T en={<>Flipping an inequality</>} ko={<>부등호 뒤집기</>}/>}>
                <T
                    en={<p>
                        Solvers accept only <InlineMath math={"\\preceq"}/>, so a{" "}
                        <InlineMath math={"\\succeq"}/> row is negated on both sides:{" "}
                        <InlineMath math={"\\tilde{A}x \\succeq \\tilde{b} \\iff (-\\tilde{A})x \\preceq (-\\tilde{b})"}/>.
                        Concretely, if the second row of the example above were really{" "}
                        <InlineMath math={"2x_1 + 4x_2 \\ge 9"}/>:
                    </p>}
                    ko={<p>
                        solver는 <InlineMath math={"\\preceq"}/>만 받으므로{" "}
                        <InlineMath math={"\\succeq"}/> 행은 양변에 음수를 곱해 뒤집는다.{" "}
                        <InlineMath math={"\\tilde{A}x \\succeq \\tilde{b} \\iff (-\\tilde{A})x \\preceq (-\\tilde{b})"}/>이다.
                        구체적으로, 위 예의 둘째 행이 실은{" "}
                        <InlineMath math={"2x_1 + 4x_2 \\ge 9"}/>이었다면
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} 3x_1 + x_2 &\\le 0 \\\\ 2x_1 + 4x_2 &\\ge 9 \\end{aligned} \\iff \\begin{aligned} 3x_1 + x_2 &\\le 0 \\\\ -2x_1 - 4x_2 &\\le -9 \\end{aligned} \\iff \\begin{bmatrix} 3 & 1 \\\\ -2 & -4\\end{bmatrix} x \\preceq \\begin{bmatrix} 0 \\\\ -9 \\end{bmatrix}."}/>
                <Terms items={[
                    ["-\\tilde{A}", <T en={<>only the rows that pointed the wrong way get negated, not the whole matrix. Negating a row you did not mean to is the most common way to hand a solver an infeasible problem</>}
                                       ko={<>잘못된 방향을 향하던 행만 부호를 뒤집고 행렬 전체를 뒤집는 것이 아니다. 뜻하지 않은 행의 부호를 뒤집는 것이 solver에게 실행 불가능한 문제를 넘기는 가장 흔한 방법이다</>}/>],
                    ["lb \\preceq x \\preceq ub", <T en={<>most solvers accept simple bounds separately rather than as rows of <InlineMath math={"A_{in}"}/>. It is the same constraint, and it is less error prone to write</>}
                                                     ko={<>대부분의 solver는 단순 상하한을 <InlineMath math={"A_{in}"}/>의 행으로 받는 대신 따로 받는다. 같은 제약이고, 그렇게 적는 편이 실수가 덜하다</>}/>],
                ]}/>
            </Remark>
            <Remark n="7.12" title={<T en={<>Fact 7.12: convexity buys continuity, on the interior</>}
                                       ko={<>사실 7.12: 볼록성이 내부에서 연속성을 사 온다</>}/>}>
                <T
                    en={<p>
                        Suppose <InlineMath math={"(\\mathcal{X}, \\mathbb{R}, \\|\\bullet\\|)"}/> is a
                        finite dimensional normed space,{" "}
                        <InlineMath math={"C \\subset \\mathcal{X}"}/> is convex, and{" "}
                        <InlineMath math={"f : C \\to \\mathbb{R}"}/> is convex. Then{" "}
                        <InlineMath math={"f"}/> is continuous on{" "}
                        <InlineMath math={"\\mathring{C}"}/>, the interior of{" "}
                        <InlineMath math={"C"}/>. The notes label this one "not an easy one to prove" and
                        skip the proof; so does this page.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathbb{R}, \\|\\bullet\\|)"}/>이 유한 차원
                        normed space이고 <InlineMath math={"C \\subset \\mathcal{X}"}/>이 볼록,{" "}
                        <InlineMath math={"f : C \\to \\mathbb{R}"}/>이 볼록이라 하자. 그러면{" "}
                        <InlineMath math={"f"}/>은 <InlineMath math={"C"}/>의 내부{" "}
                        <InlineMath math={"\\mathring{C}"}/>에서 연속이다. 교재는 이것에 "증명하기 쉬운
                        것이 아니다"라는 딱지를 붙이고 증명을 건너뛴다. 이 페이지도 그렇게 한다.
                    </p>}
                />
                <T
                    en={<p>
                        <strong>Remark 7.13.</strong> The restriction to the interior is not a technicality.
                        A convex function can jump on the boundary of{" "}
                        <InlineMath math={"C"}/>, that is on{" "}
                        <InlineMath math={"\\partial C := \\overline{C} \\cap \\overline{(\\sim C)} = \\overline{C} \\setminus \\mathring{C}"}/>.
                        Here is one, on <InlineMath math={"C = [0, 1]"}/>:
                    </p>}
                    ko={<p>
                        <strong>참고 7.13.</strong> 내부로 제한하는 것은 형식적인 단서가 아니다. 볼록
                        함수는 <InlineMath math={"C"}/>의 경계, 곧{" "}
                        <InlineMath math={"\\partial C := \\overline{C} \\cap \\overline{(\\sim C)} = \\overline{C} \\setminus \\mathring{C}"}/>에서
                        도약할 수 있다. <InlineMath math={"C = [0, 1]"}/> 위의 예를 하나 들면
                    </p>}
                />
                <BlockMath math={"f(t) = \\begin{cases} 0, & 0 \\le t < 1 \\\\ 1, & t = 1 \\end{cases}"}/>
                <Terms items={[
                    ["\\text{convex?}", <T en={<>yes. If <InlineMath math={"x, y < 1"}/> both sides are <InlineMath math={"0"}/>. If <InlineMath math={"y = 1"}/> and <InlineMath math={"\\lambda > 0"}/> the combination is strictly below <InlineMath math={"1"}/>, so the left side is <InlineMath math={"0"}/> while the right side is <InlineMath math={"1 - \\lambda \\ge 0"}/></>}
                                           ko={<>그렇다. <InlineMath math={"x, y < 1"}/>이면 양변이 <InlineMath math={"0"}/>이다. <InlineMath math={"y = 1"}/>이고 <InlineMath math={"\\lambda > 0"}/>이면 결합이 <InlineMath math={"1"}/>보다 진짜로 작아 좌변은 <InlineMath math={"0"}/>이고 우변은 <InlineMath math={"1 - \\lambda \\ge 0"}/>이다</>}/>],
                    ["\\text{continuous?}", <T en={<>not at <InlineMath math={"t = 1"}/>, which is a boundary point of <InlineMath math={"C"}/>. On <InlineMath math={"\\mathring{C} = (0,1)"}/> it is continuous, exactly as Fact 7.12 promises</>}
                                               ko={<><InlineMath math={"C"}/>의 경계점인 <InlineMath math={"t = 1"}/>에서는 아니다. <InlineMath math={"\\mathring{C} = (0,1)"}/>에서는 연속이고, 사실 7.12가 약속한 그대로다</>}/>],
                ]}/>
                <T
                    en={<p>
                        This closes one loop with Chapter 6. Weierstrass needs a continuous cost on a
                        compact set, and Fact 7.12 says that for a convex cost, continuity is free
                        everywhere except possibly on the boundary. Every cost in the rest of this
                        chapter is a quadratic or a norm, both continuous on all of{" "}
                        <InlineMath math={"\\mathbb{R}^n"}/>, so the continuity hypothesis never has to be
                        checked again. What does have to be checked, every single time, is the feasible
                        set.
                    </p>}
                    ko={<p>
                        여기서 6장과의 고리 하나가 닫힌다. Weierstrass는 컴팩트 집합 위의 연속 비용을
                        요구하는데, 사실 7.12는 볼록 비용이라면 경계를 뺀 곳에서 연속성이 공짜라고 말한다.
                        이 장의 남은 비용은 전부 이차식 아니면 norm이고 둘 다{" "}
                        <InlineMath math={"\\mathbb{R}^n"}/> 전체에서 연속이므로, 연속성 가정은 다시
                        확인할 일이 없다. 매번 확인해야 하는 것은 실행 가능 집합이다.
                    </p>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Remarks on Notation and Abuse of Notation</h2>}
               ko={<h2>argmin 기호와 그 남용</h2>}/>
            <T
                en={<p>
                    This short section is the one place in the course where the notes stop to complain
                    about notation, and the complaint is worth taking seriously, because the thing being
                    abused is exactly the existence question Chapter 6 spent forty pages on.
                </p>}
                ko={<p>
                    이 짧은 절은 교재가 기호에 대해 불평하려고 멈춰 서는 유일한 자리이고, 그 불평은 진지하게
                    받아들일 값어치가 있다. 남용되고 있는 것이 정확히 6장이 마흔 쪽을 들여 다룬 존재
                    문제이기 때문이다.
                </p>}
            />
            <T
                en={<p>
                    Let <InlineMath math={"(\\mathcal{X}, \\mathbb{R}, \\|\\bullet\\|)"}/> be a real
                    normed space, <InlineMath math={"S \\subset \\mathcal{X}"}/>, and{" "}
                    <InlineMath math={"f : S \\to \\mathbb{R}"}/>. It is very common to write
                </p>}
                ko={<p>
                    <InlineMath math={"(\\mathcal{X}, \\mathbb{R}, \\|\\bullet\\|)"}/>을 실수 normed
                    space, <InlineMath math={"S \\subset \\mathcal{X}"}/>,{" "}
                    <InlineMath math={"f : S \\to \\mathbb{R}"}/>이라 하자. 다음처럼 적는 일이 매우 흔하다.
                </p>}
            />
            <BlockMath math={"x^* = \\operatorname*{arg\\,min}_{x \\in S} f(x) \\qquad (7.1)"}/>
            <Terms items={[
                ["x^*", <T en={<>the value of <InlineMath math={"x \\in S"}/> that achieves the minimum, so that <InlineMath math={"f(x^*) = \\min_{x \\in S} f(x)"}/></>}
                           ko={<>최솟값을 달성하는 <InlineMath math={"x \\in S"}/>의 값. 곧 <InlineMath math={"f(x^*) = \\min_{x \\in S} f(x)"}/>이다</>}/>],
                ["f", <T en={<>the <strong>cost function</strong>. The notes' term, and the one solvers use</>}
                         ko={<><strong>비용 함수</strong>. 교재의 용어이고 solver들이 쓰는 말이다</>}/>],
                ["S", <T en={<>the <strong>constraint set</strong>, also called the feasible set. Everything in this chapter is about what <InlineMath math={"S"}/> has to look like</>}
                         ko={<><strong>제약 집합</strong>. 실행 가능 집합이라고도 한다. 이 장 전체가 <InlineMath math={"S"}/>이 어떻게 생겨야 하는가에 관한 것이다</>}/>],
                ["=", <T en={<>the load bearing symbol. An equals sign asserts that the object on the right is one specific element, which requires a minimum to exist <em>and</em> to be unique</>}
                         ko={<>내용을 나르는 기호. 등호는 오른쪽의 대상이 특정한 원소 하나라고 주장하는 것이고, 그러려면 최솟값이 존재해야 하고 <em>동시에</em> 유일해야 한다</>}/>],
            ]}/>
            <T
                en={<p>
                    So (7.1) may only be written when there does exist a minimum value, and it is unique.
                    If a minimum exists but is not unique, the correct statement uses membership, since{" "}
                    <InlineMath math={"\\operatorname*{arg\\,min}"}/> is a set:
                </p>}
                ko={<p>
                    그러므로 (7.1)은 최솟값이 존재하고 그것이 유일할 때에만 적을 수 있다. 최솟값이
                    존재하지만 유일하지 않으면 올바른 진술은 소속 기호를 쓴다.{" "}
                    <InlineMath math={"\\operatorname*{arg\\,min}"}/>은 집합이기 때문이다.
                </p>}
            />
            <BlockMath math={"x^* \\in \\operatorname*{arg\\,min}_{x \\in S} f(x) \\qquad (7.2)"}/>
            <Terms items={[
                ["\\in", <T en={<>says <InlineMath math={"x^*"}/> is one of possibly many minimizers. Correct notation, and not commonly used, which is the notes' own observation</>}
                            ko={<><InlineMath math={"x^*"}/>이 여럿일 수 있는 최소점 중 하나라는 말이다. 올바른 기호이고 흔히 쓰이지는 않는다는 것이 교재 자신의 관찰이다</>}/>],
                ["\\operatorname*{arg\\,min}_{x \\in S} f(x)", <T en={<>the set <InlineMath math={"\\{x \\in S : f(x) \\le f(y)\\ \\forall y \\in S\\}"}/>. It can be empty, a single point, or infinite</>}
                                                                 ko={<>집합 <InlineMath math={"\\{x \\in S : f(x) \\le f(y)\\ \\forall y \\in S\\}"}/>이다. 비어 있을 수도, 한 점일 수도, 무한할 수도 있다</>}/>],
            ]}/>
            <T
                en={<p>
                    And the thing you should never write, marked in red in the notes, is
                </p>}
                ko={<p>
                    그리고 절대 적으면 안 되는 것, 교재가 빨간 글씨로 표시해 둔 것은 다음이다.
                </p>}
            />
            <BlockMath math={"x^* = \\operatorname*{arg\\,inf}_{x \\in S} f(x) \\qquad (7.3)"}/>
            <Terms items={[
                ["\\inf", <T en={<>the greatest lower bound from Chapter 1. It exists for any set of reals that is bounded below, whether or not anything achieves it</>}
                             ko={<>1장의 greatest lower bound. 아래로 유계인 실수 집합이면 언제나 존재하고, 그것을 달성하는 것이 있든 없든 상관없다</>}/>],
                ["\\text{why it is nonsense}", <T en={<>by the very definition of an infimum there may be no value in <InlineMath math={"S"}/> achieving it, so there is nothing for <InlineMath math={"\\operatorname{arg}"}/> to name</>}
                                                  ko={<>infimum의 정의 자체가 그것을 달성하는 값이 <InlineMath math={"S"}/> 안에 없을 수 있다는 것이므로, <InlineMath math={"\\operatorname{arg}"}/>이 이름 붙일 대상 자체가 없다</>}/>],
            ]}/>
            <Example n="7.2a" title={<T en={<>Four sets, four different verdicts</>} ko={<>집합 넷, 판정 넷</>}/>}>
                <T
                    en={<ol>
                        <li><InlineMath math={"f(t) = t^2"}/> on{" "}
                            <InlineMath math={"S = \\mathbb{R}"}/>. The minimum is{" "}
                            <InlineMath math={"0"}/>, attained only at{" "}
                            <InlineMath math={"t = 0"}/>. Exists and is unique, so (7.1) with an equals
                            sign is legitimate.</li>
                        <li><InlineMath math={"f(x) = (x_1 + x_2 - 1)^2"}/> on{" "}
                            <InlineMath math={"S = \\mathbb{R}^2"}/>. The minimum is{" "}
                            <InlineMath math={"0"}/>, attained at every point of the line{" "}
                            <InlineMath math={"x_1 + x_2 = 1"}/>, an infinite set. Exists, not unique, so
                            (7.2) is required. The tie in the linear program figure below is the same
                            situation with a linear cost.</li>
                        <li><InlineMath math={"f(t) = e^{-t}"}/> on{" "}
                            <InlineMath math={"S = [0, \\infty)"}/>. Here{" "}
                            <InlineMath math={"\\inf_{t \\in S} f(t) = 0"}/> but{" "}
                            <InlineMath math={"f(t) > 0"}/> for every{" "}
                            <InlineMath math={"t \\in S"}/>, so the infimum is never attained. Neither
                            (7.1) nor (7.2) may be written. <InlineMath math={"S"}/> is closed but not
                            bounded, so Weierstrass does not apply.</li>
                        <li><InlineMath math={"f(t) = t"}/> on{" "}
                            <InlineMath math={"S = (0, 1)"}/>. Again{" "}
                            <InlineMath math={"\\inf = 0"}/> and it is not attained. This time{" "}
                            <InlineMath math={"S"}/> is bounded but not closed. Losing either hypothesis
                            is enough.</li>
                    </ol>}
                    ko={<ol>
                        <li><InlineMath math={"S = \\mathbb{R}"}/> 위의{" "}
                            <InlineMath math={"f(t) = t^2"}/>. 최솟값은{" "}
                            <InlineMath math={"0"}/>이고 <InlineMath math={"t = 0"}/>에서만 달성된다.
                            존재하고 유일하므로 등호를 쓴 (7.1)이 정당하다.</li>
                        <li><InlineMath math={"S = \\mathbb{R}^2"}/> 위의{" "}
                            <InlineMath math={"f(x) = (x_1 + x_2 - 1)^2"}/>. 최솟값은{" "}
                            <InlineMath math={"0"}/>이고 직선{" "}
                            <InlineMath math={"x_1 + x_2 = 1"}/>의 모든 점에서 달성된다. 무한 집합이다.
                            존재하지만 유일하지 않으므로 (7.2)가 필요하다. 아래 linear program 그림의
                            동점이 비용이 일차인 같은 상황이다.</li>
                        <li><InlineMath math={"S = [0, \\infty)"}/> 위의{" "}
                            <InlineMath math={"f(t) = e^{-t}"}/>.{" "}
                            <InlineMath math={"\\inf_{t \\in S} f(t) = 0"}/>이지만 모든{" "}
                            <InlineMath math={"t \\in S"}/>에서 <InlineMath math={"f(t) > 0"}/>이라
                            infimum에 결코 닿지 못한다. (7.1)도 (7.2)도 적을 수 없다.{" "}
                            <InlineMath math={"S"}/>이 닫혔지만 유계가 아니라 Weierstrass가 적용되지
                            않는다.</li>
                        <li><InlineMath math={"S = (0, 1)"}/> 위의{" "}
                            <InlineMath math={"f(t) = t"}/>. 역시{" "}
                            <InlineMath math={"\\inf = 0"}/>이고 달성되지 않는다. 이번에는{" "}
                            <InlineMath math={"S"}/>이 유계인데 닫히지 않았다. 두 가정 중 하나만 잃어도
                            충분하다.</li>
                    </ol>}
                />
            </Example>
            <Proposition title={<T en={<>When each of the three notations is legitimate</>}
                                   ko={<>세 기호 각각이 정당해지는 조건</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"S \\ne \\emptyset"}/> and{" "}
                        <InlineMath math={"f : S \\to \\mathbb{R}"}/> be bounded below.
                    </p>}
                    ko={<p>
                        <InlineMath math={"S \\ne \\emptyset"}/>이고{" "}
                        <InlineMath math={"f : S \\to \\mathbb{R}"}/>이 아래로 유계라 하자.
                    </p>}
                />
                <T
                    en={<ol>
                        <li>With no further hypotheses,{" "}
                            <InlineMath math={"\\inf_{x \\in S} f(x)"}/> exists as a real number, and
                            nothing more can be said. (7.3) is meaningless.</li>
                        <li>If <InlineMath math={"S"}/> is compact and{" "}
                            <InlineMath math={"f"}/> is continuous, the minimum is attained and (7.2) is
                            legitimate.</li>
                        <li>If in addition <InlineMath math={"S"}/> is convex and{" "}
                            <InlineMath math={"f"}/> is strictly convex, the minimizer is unique and
                            (7.1) is legitimate.</li>
                    </ol>}
                    ko={<ol>
                        <li>추가 가정이 없으면{" "}
                            <InlineMath math={"\\inf_{x \\in S} f(x)"}/>이 실수로 존재한다는 것 이상은
                            말할 수 없다. (7.3)은 무의미하다.</li>
                        <li><InlineMath math={"S"}/>이 컴팩트하고{" "}
                            <InlineMath math={"f"}/>이 연속이면 최솟값에 도달하고 (7.2)가 정당하다.</li>
                        <li>여기에 더해 <InlineMath math={"S"}/>이 볼록하고{" "}
                            <InlineMath math={"f"}/>이 강볼록이면 최소점이 유일하고 (7.1)이 정당하다.</li>
                    </ol>}
                />
                <Proof>
                    <T
                        en={<p>
                            Part 1 is Chapter 1: the set{" "}
                            <InlineMath math={"\\{f(x) : x \\in S\\} \\subset \\mathbb{R}"}/> is nonempty
                            and bounded below, so the greatest lower bound property of the reals gives an
                            infimum. Nothing in that argument produces an{" "}
                            <InlineMath math={"x"}/>, which is precisely the complaint.
                        </p>}
                        ko={<p>
                            1번은 1장이다. 집합{" "}
                            <InlineMath math={"\\{f(x) : x \\in S\\} \\subset \\mathbb{R}"}/>이 비어 있지
                            않고 아래로 유계이므로 실수의 greatest lower bound 성질이 infimum을 준다. 이
                            논증 어디에서도 <InlineMath math={"x"}/>이 나오지 않고, 불평의 핵심이 바로
                            그것이다.
                        </p>}
                    />
                    <T
                        en={<p>
                            Part 2 is Chapter 6's Weierstrass theorem applied to{" "}
                            <InlineMath math={"f"}/> on the compact set{" "}
                            <InlineMath math={"S"}/>: the infimum is attained at some{" "}
                            <InlineMath math={"x^* \\in S"}/>, so the arg min set is nonempty and{" "}
                            <InlineMath math={"\\in"}/> has something to say.
                        </p>}
                        ko={<p>
                            2번은 컴팩트 집합 <InlineMath math={"S"}/> 위의{" "}
                            <InlineMath math={"f"}/>에 6장 Weierstrass 정리를 적용한 것이다. infimum이
                            어떤 <InlineMath math={"x^* \\in S"}/>에서 달성되므로 arg min 집합이 비어
                            있지 않고 <InlineMath math={"\\in"}/>이 할 말이 생긴다.
                        </p>}
                    />
                    <T
                        en={<p>
                            Part 3 is the corollary proved in the previous section: strict convexity on a
                            convex domain admits at most one minimizer, and part 2 already produced at
                            least one. Exactly one, so the equals sign names it.
                        </p>}
                        ko={<p>
                            3번은 앞 절에서 증명한 따름정리다. 볼록 정의역 위의 강볼록성은 최소점을 많아야
                            하나 허용하고, 2번이 이미 적어도 하나를 만들어 냈다. 정확히 하나이므로 등호가
                            그것을 이름 붙인다.
                        </p>}
                    />
                </Proof>
                <T
                    en={<p>
                        Read the three parts in order and the architecture of this chapter is visible.
                        Chapter 6 supplies existence, Chapter 3 supplies uniqueness, and this chapter
                        supplies the convexity that lets a solver actually find the point the other two
                        proved is there.
                    </p>}
                    ko={<p>
                        세 부분을 순서대로 읽으면 이 장의 구조가 보인다. 6장이 존재성을 대고, 3장이
                        유일성을 대며, 이 장이 볼록성을 대서 다른 둘이 있다고 증명한 그 점을 solver가
                        실제로 찾아낼 수 있게 한다.
                    </p>}
                />
            </Proposition>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>What Is a Quadratic Program?</h2>} ko={<h2>Quadratic Program이란?</h2>}/>
            <T
                en={<p>
                    Chapter 3 solved two quadratic minimizations in closed form. Example 3.43 and
                    Proposition 3.95 handled least squares solutions of overdetermined systems, and
                    Theorem 3.51 and Proposition 3.91 handled minimum norm solutions of underdetermined
                    ones:
                </p>}
                ko={<p>
                    3장은 이차 최소화 둘을 닫힌 꼴로 풀었다. 예제 3.43과 명제 3.95가 과결정 연립방정식의
                    최소제곱 해를, 정리 3.51과 명제 3.91이 미결정 연립방정식의 최소 norm 해를 다루었다.
                </p>}
            />
            <BlockMath math={"\\widehat{x} = \\operatorname*{arg\\,min}_{x} (Ax - b)^\\top Q (Ax - b), \\qquad \\widehat{x} := \\operatorname*{arg\\,min}_{Ax = b} x^\\top Q x."}/>
            <Terms items={[
                ["A", <T en={<>the model matrix. Tall with independent columns in the first problem, wide in the second</>}
                         ko={<>모델 행렬. 첫 문제에서는 열이 독립인 세로로 긴 행렬, 둘째에서는 가로로 넓은 행렬이다</>}/>],
                ["b", <T en={<>the measurement vector. In the second problem it is a constraint the answer must satisfy exactly</>}
                         ko={<>측정 벡터. 둘째 문제에서는 답이 정확히 만족해야 하는 제약이다</>}/>],
                ["Q", <T en={<>a positive definite weighting matrix, the inverse covariance in Chapter 5's version. It says which residuals you mind more</>}
                         ko={<>positive definite 가중 행렬. 5장 판본에서는 공분산의 역행렬이다. 어느 잔차를 더 신경 쓰는지를 말한다</>}/>],
                ["\\widehat{x}", <T en={<>the estimate. Both problems admit closed-form solutions, and both are unconstrained or equality constrained only</>}
                                    ko={<>추정값. 두 문제 모두 닫힌 꼴 해를 갖고, 둘 다 제약이 없거나 등식 제약뿐이다</>}/>],
            ]}/>
            <T
                en={<p>
                    A <strong>Quadratic Program</strong> is the same shape of cost with inequality
                    constraints allowed. Before writing the general form, it is worth expanding the first
                    problem, because the notes state that these are quadratic problems and leave the
                    algebra out, and the algebra is where the connection to Chapter 3 actually lives.
                </p>}
                ko={<p>
                    <strong>Quadratic Program</strong>은 같은 모양의 비용에 부등식 제약을 허용한 것이다.
                    일반형을 적기 전에 첫 문제를 전개해 보는 것이 값어치가 있다. 교재는 이것들이 이차
                    문제라고 진술하고 대수를 빼 두는데, 3장과의 연결이 실제로 사는 곳이 그 대수이기
                    때문이다.
                </p>}
            />
            <Proposition title={<T en={<>Least squares is a QP, and the normal equations are its stationarity condition</>}
                                   ko={<>최소제곱은 QP이고, normal equation은 그 정상성 조건이다</>}/>}>
                <Proof label={<T en={<>Expand and compare</>} ko={<>전개해서 견주기</>}/>}>
                    <T
                        en={<p>
                            Multiply out the weighted residual, using{" "}
                            <InlineMath math={"Q^\\top = Q"}/> to fold the two cross terms into one:
                        </p>}
                        ko={<p>
                            가중 잔차를 전개한다.{" "}
                            <InlineMath math={"Q^\\top = Q"}/>을 써서 교차항 둘을 하나로 접는다.
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} (Ax - b)^\\top Q(Ax - b) &= x^\\top A^\\top Q A x - 2 b^\\top Q A x + b^\\top Q b \\\\ &= \\tfrac{1}{2}x^\\top \\underbrace{(2A^\\top Q A)}_{=:\\,Q_{\\mathrm{qp}}} x + \\underbrace{(-2b^\\top Q A)}_{=:\\,q} x + \\underbrace{b^\\top Q b}_{\\text{constant}}. \\end{aligned}"}/>
                    <Terms items={[
                        ["Q_{\\mathrm{qp}}", <T en={<>the QP's quadratic term, <InlineMath math={"2A^\\top Q A"}/>. Symmetric because <InlineMath math={"Q"}/> is, and positive definite exactly when <InlineMath math={"A"}/> has full column rank, which is Chapter 3's condition for the normal equations to have a unique solution</>}
                                                ko={<>QP의 이차항 <InlineMath math={"2A^\\top Q A"}/>이다. <InlineMath math={"Q"}/>이 대칭이라 대칭이고, <InlineMath math={"A"}/>의 열이 full rank일 때 정확히 positive definite다. 그것이 normal equation이 유일한 해를 갖기 위한 3장의 조건이다</>}/>],
                        ["q", <T en={<>the QP's linear term, a <InlineMath math={"1 \\times m"}/> row vector. This is why the notes write <InlineMath math={"qx"}/> without a transpose</>}
                                 ko={<>QP의 일차항으로 <InlineMath math={"1 \\times m"}/> 행벡터다. 교재가 전치 없이 <InlineMath math={"qx"}/>로 적는 이유가 이것이다</>}/>],
                        ["b^\\top Q b", <T en={<>independent of <InlineMath math={"x"}/>, so it shifts the cost but not the minimizer. Dropping it is the reason the two problems have the same answer</>}
                                           ko={<><InlineMath math={"x"}/>에 무관하므로 비용을 위아래로 옮길 뿐 최소점을 옮기지 않는다. 이것을 버려도 두 문제의 답이 같은 이유가 그것이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            So least squares is a QP with no constraints at all. Now set the gradient to
                            zero. For <InlineMath math={"f(x) = \\tfrac{1}{2}x^\\top Q_{\\mathrm{qp}}x + qx"}/>{" "}
                            with <InlineMath math={"Q_{\\mathrm{qp}}"}/> symmetric,{" "}
                            <InlineMath math={"\\nabla f(x) = Q_{\\mathrm{qp}}x + q^\\top"}/>:
                        </p>}
                        ko={<p>
                            그러므로 최소제곱은 제약이 하나도 없는 QP다. 이제 기울기를 0으로 놓는다.{" "}
                            <InlineMath math={"Q_{\\mathrm{qp}}"}/>이 대칭인{" "}
                            <InlineMath math={"f(x) = \\tfrac{1}{2}x^\\top Q_{\\mathrm{qp}}x + qx"}/>에
                            대해 <InlineMath math={"\\nabla f(x) = Q_{\\mathrm{qp}}x + q^\\top"}/>이다.
                        </p>}
                    />
                    <BlockMath math={"\\nabla f(x) = 2A^\\top Q A x - 2A^\\top Q b = 0 \\iff A^\\top Q A x = A^\\top Q b."}/>
                    <Terms items={[
                        ["q^\\top", <T en={<><InlineMath math={"(-2b^\\top Q A)^\\top = -2A^\\top Q^\\top b = -2A^\\top Q b"}/>, again using symmetry of <InlineMath math={"Q"}/></>}
                                       ko={<><InlineMath math={"(-2b^\\top Q A)^\\top = -2A^\\top Q^\\top b = -2A^\\top Q b"}/>이다. 여기서도 <InlineMath math={"Q"}/>의 대칭성을 쓴다</>}/>],
                        ["A^\\top Q A x = A^\\top Q b", <T en={<>the weighted <strong>normal equations</strong> of Chapter 3, arrived at here as nothing more than "the gradient of a QP vanishes". Chapter 3 got the same equation from orthogonality of the residual to the column space; the two derivations agree because they are the same condition</>}
                                                          ko={<>3장의 가중 <strong>normal equation</strong>이다. 여기서는 "QP의 기울기가 사라진다"는 것 이상 아무것도 아닌 방식으로 도달했다. 3장은 잔차가 열공간에 직교한다는 데서 같은 식을 얻었다. 같은 조건이라 두 유도가 일치한다</>}/>],
                    ]}/>
                </Proof>
                <T
                    en={<p>
                        Two more things fall out of that. Existence and uniqueness of the least squares
                        solution is <InlineMath math={"Q_{\\mathrm{qp}} = 2A^\\top Q A \\succ 0"}/>, which
                        is Chapter 3's positive definiteness, which is Chapter 4's condition for a
                        Cholesky factorization to exist. And the moment an inequality constraint is added,{" "}
                        <InlineMath math={"\\nabla f = 0"}/> stops being the answer, because the minimizer
                        may sit on a boundary where the gradient is not zero. That is the whole
                        difference between Chapter 3 and this section.
                    </p>}
                    ko={<p>
                        여기서 둘이 더 떨어져 나온다. 최소제곱 해의 존재성과 유일성은{" "}
                        <InlineMath math={"Q_{\\mathrm{qp}} = 2A^\\top Q A \\succ 0"}/>이고, 그것이 3장의
                        positive definite이며, 그것이 Cholesky 분해가 존재하기 위한 4장의 조건이다.
                        그리고 부등식 제약이 하나라도 붙는 순간{" "}
                        <InlineMath math={"\\nabla f = 0"}/>은 답이기를 그만둔다. 최소점이 기울기가 0이
                        아닌 경계 위에 앉을 수 있기 때문이다. 3장과 이 절의 차이 전부가 그것이다.
                    </p>}
                />
            </Proposition>
            <Example n="7.3a" title={<T en={<>The same fit computed both ways</>} ko={<>같은 적합을 두 방식으로</>}/>}>
                <T
                    en={<p>
                        Fit a line <InlineMath math={"y = c_0 + c_1 t"}/> to the three points{" "}
                        <InlineMath math={"(-1, 0)"}/>, <InlineMath math={"(0, 1)"}/>,{" "}
                        <InlineMath math={"(1, 3)"}/>, with{" "}
                        <InlineMath math={"Q = I"}/> and{" "}
                        <InlineMath math={"x = (c_0, c_1)^\\top"}/>. Then
                    </p>}
                    ko={<p>
                        세 점 <InlineMath math={"(-1, 0)"}/>, <InlineMath math={"(0, 1)"}/>,{" "}
                        <InlineMath math={"(1, 3)"}/>에 직선{" "}
                        <InlineMath math={"y = c_0 + c_1 t"}/>을 맞춘다.{" "}
                        <InlineMath math={"Q = I"}/>,{" "}
                        <InlineMath math={"x = (c_0, c_1)^\\top"}/>이다. 그러면
                    </p>}
                />
                <BlockMath math={"A = \\begin{bmatrix} 1 & -1 \\\\ 1 & 0 \\\\ 1 & 1 \\end{bmatrix}, \\quad b = \\begin{bmatrix} 0 \\\\ 1 \\\\ 3\\end{bmatrix}, \\quad A^\\top A = \\begin{bmatrix} 3 & 0 \\\\ 0 & 2\\end{bmatrix}, \\quad A^\\top b = \\begin{bmatrix} 4 \\\\ 3\\end{bmatrix}."}/>
                <Terms items={[
                    ["A^\\top A", <T en={<>diagonal here only because the <InlineMath math={"t"}/> values are symmetric about zero. That is a convenience of this example, not a general fact</>}
                                     ko={<>여기서 대각인 것은 <InlineMath math={"t"}/> 값들이 0을 중심으로 대칭이기 때문일 뿐이다. 이 예제의 편의이고 일반적인 사실이 아니다</>}/>],
                    ["A^\\top b", <T en={<><InlineMath math={"(0 + 1 + 3,\\ 0 \\cdot(-1) + 1 \\cdot 0 + 3 \\cdot 1) = (4, 3)"}/></>}
                                     ko={<><InlineMath math={"(0 + 1 + 3,\\ 0 \\cdot(-1) + 1 \\cdot 0 + 3 \\cdot 1) = (4, 3)"}/>이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The normal equations give{" "}
                        <InlineMath math={"\\widehat{x} = (\\tfrac{4}{3}, \\tfrac{3}{2})"}/>. Reading the
                        same problem as a QP,{" "}
                        <InlineMath math={"Q_{\\mathrm{qp}} = 2A^\\top A = \\operatorname{diag}(6, 4)"}/>{" "}
                        and <InlineMath math={"q = -2(A^\\top b)^\\top = (-8, -6)"}/>, so{" "}
                        <InlineMath math={"\\nabla f = 0"}/> reads{" "}
                        <InlineMath math={"6c_0 = 8"}/> and{" "}
                        <InlineMath math={"4c_1 = 6"}/>, giving{" "}
                        <InlineMath math={"c_0 = \\tfrac{4}{3}"}/> and{" "}
                        <InlineMath math={"c_1 = \\tfrac{3}{2}"}/>. Same numbers, as they must be.
                    </p>}
                    ko={<p>
                        normal equation은{" "}
                        <InlineMath math={"\\widehat{x} = (\\tfrac{4}{3}, \\tfrac{3}{2})"}/>을 준다. 같은
                        문제를 QP로 읽으면{" "}
                        <InlineMath math={"Q_{\\mathrm{qp}} = 2A^\\top A = \\operatorname{diag}(6, 4)"}/>,{" "}
                        <InlineMath math={"q = -2(A^\\top b)^\\top = (-8, -6)"}/>이므로{" "}
                        <InlineMath math={"\\nabla f = 0"}/>은{" "}
                        <InlineMath math={"6c_0 = 8"}/>, <InlineMath math={"4c_1 = 6"}/>이 되고{" "}
                        <InlineMath math={"c_0 = \\tfrac{4}{3}"}/>,{" "}
                        <InlineMath math={"c_1 = \\tfrac{3}{2}"}/>이다. 같은 수다. 그럴 수밖에 없다.
                    </p>}
                />
            </Example>
            <Definition n="7.4b" title={<T en={<>Quadratic Program</>} ko={<>Quadratic Program</>}/>}>
                <T
                    en={<p>
                        The cost to be minimized is quadratic plus linear, so{" "}
                        <InlineMath math={"f : \\mathbb{R}^m \\to \\mathbb{R}"}/> has the form (7.4), and
                        the search runs over a subset of{" "}
                        <InlineMath math={"\\mathbb{R}^m"}/> defined by the linear constraints (7.5),
                        (7.6) and the bounds (7.7):
                    </p>}
                    ko={<p>
                        최소화할 비용은 이차 더하기 일차이므로{" "}
                        <InlineMath math={"f : \\mathbb{R}^m \\to \\mathbb{R}"}/>이 (7.4)의 꼴이고,
                        탐색은 선형 제약 (7.5), (7.6)과 상하한 (7.7)이 정의하는{" "}
                        <InlineMath math={"\\mathbb{R}^m"}/>의 부분집합 위에서 이루어진다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} &f(x) = \\tfrac{1}{2}x^\\top Q x + qx && (7.4) \\\\ &A_{in}x \\preceq b_{in} && (7.5) \\\\ &A_{eq}x = b_{eq} && (7.6) \\\\ &lb \\preceq x \\preceq ub && (7.7) \\end{aligned}"}/>
                <Terms items={[
                    ["Q", <T en={<>symmetric <InlineMath math={"m \\times m"}/>. The notes' definition asks only for positive <em>semi</em>definite here; the existence fact below asks for positive definite, and the difference is exactly whether the answer is unique</>}
                             ko={<>대칭 <InlineMath math={"m \\times m"}/> 행렬. 교재의 정의는 여기서 positive <em>semi</em>definite만 요구한다. 아래의 존재 사실은 positive definite를 요구하고, 그 차이가 정확히 답이 유일한가 여부다</>}/>],
                    ["q", <T en={<>a <InlineMath math={"1 \\times m"}/> row vector, so <InlineMath math={"qx"}/> is a scalar</>}
                             ko={<><InlineMath math={"1 \\times m"}/> 행벡터라 <InlineMath math={"qx"}/>이 스칼라다</>}/>],
                    ["lb, ub", <T en={<>simple bounds. They could be folded into (7.5), but every solver takes them separately because it is more convenient, more intuitive, and less error prone</>}
                                  ko={<>단순 상하한. (7.5)에 접어 넣을 수도 있지만 모든 solver가 이것을 따로 받는다. 더 편하고 더 직관적이며 실수가 덜하기 때문이다</>}/>],
                    ["S", <T en={<>the feasible set <InlineMath math={"\\{x \\in \\mathbb{R}^m : (7.5),\\ (7.6),\\ (7.7)\\}"}/>, an intersection of half-spaces and hyperplanes, hence convex by Fact 7.10 (5) and (6)</>}
                             ko={<>실행 가능 집합 <InlineMath math={"\\{x \\in \\mathbb{R}^m : (7.5),\\ (7.6),\\ (7.7)\\}"}/>. 반공간과 초평면의 교집합이므로 사실 7.10의 (5), (6)에 의해 볼록하다</>}/>],
                ]}/>
            </Definition>
            <Theorem n="7.8" title={<T en={<>Useful fact about QPs: existence and uniqueness</>}
                                       ko={<>QP에 대한 유용한 사실: 존재성과 유일성</>}/>}>
                <T
                    en={<p>
                        Consider the QP (7.8) of minimizing{" "}
                        <InlineMath math={"\\tfrac{1}{2}x^\\top Qx + qx"}/> over{" "}
                        <InlineMath math={"x \\in \\mathbb{R}^m"}/> subject to (7.5), (7.6), (7.7).
                        Assume <InlineMath math={"Q"}/> is symmetric and <strong>positive definite</strong>{" "}
                        (that is, <InlineMath math={"x \\ne 0 \\implies x^\\top Q x > 0"}/>), and that the
                        feasible set (7.9) is non-empty,{" "}
                        <InlineMath math={"S \\ne \\emptyset"}/>. Then{" "}
                        <InlineMath math={"x^*"}/> exists and is unique.
                    </p>}
                    ko={<p>
                        (7.5), (7.6), (7.7)을 제약으로{" "}
                        <InlineMath math={"x \\in \\mathbb{R}^m"}/>에서{" "}
                        <InlineMath math={"\\tfrac{1}{2}x^\\top Qx + qx"}/>을 최소화하는 QP (7.8)을
                        생각하자. <InlineMath math={"Q"}/>이 대칭이고{" "}
                        <strong>positive definite</strong>이며 (곧{" "}
                        <InlineMath math={"x \\ne 0 \\implies x^\\top Q x > 0"}/>), 실행 가능 집합
                        (7.9)이 비어 있지 않다고 하자. 곧{" "}
                        <InlineMath math={"S \\ne \\emptyset"}/>이다. 그러면{" "}
                        <InlineMath math={"x^*"}/>이 존재하고 유일하다.
                    </p>}
                />
                <Proof label={<T en={<>Proof, assembled entirely from earlier chapters</>}
                                 ko={<>증명. 전부 앞 장들에서 조립한다</>}/>}>
                    <T
                        en={<p>
                            The notes state this fact without proof. It is worth doing, because every
                            single ingredient was built earlier and this is where they are spent.
                        </p>}
                        ko={<p>
                            교재는 이 사실을 증명 없이 진술한다. 해 볼 값어치가 있다. 재료 하나하나가
                            앞에서 만들어졌고, 그것들이 쓰이는 자리가 여기이기 때문이다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>Step 1.</strong>{" "}
                            <InlineMath math={"S"}/> is closed. Each row of (7.5) is{" "}
                            <InlineMath math={"\\{x : a_i^\\top x \\le b_i\\}"}/>, the preimage of the
                            closed set <InlineMath math={"(-\\infty, b_i]"}/> under the continuous map{" "}
                            <InlineMath math={"x \\mapsto a_i^\\top x"}/>, hence closed by Chapter 6. Each
                            row of (7.6) is the preimage of the closed set{" "}
                            <InlineMath math={"\\{b_i\\}"}/>, likewise closed, and (7.7) is a box. A finite
                            intersection of closed sets is closed.
                        </p>}
                        ko={<p>
                            <strong>1단계.</strong>{" "}
                            <InlineMath math={"S"}/>은 닫혀 있다. (7.5)의 각 행은{" "}
                            <InlineMath math={"\\{x : a_i^\\top x \\le b_i\\}"}/>이고, 연속 사상{" "}
                            <InlineMath math={"x \\mapsto a_i^\\top x"}/>에 의한 닫힌 집합{" "}
                            <InlineMath math={"(-\\infty, b_i]"}/>의 원상이므로 6장에 의해 닫혀 있다.
                            (7.6)의 각 행은 닫힌 집합 <InlineMath math={"\\{b_i\\}"}/>의 원상이라 역시
                            닫혀 있고, (7.7)은 상자다. 닫힌 집합의 유한 교집합은 닫혀 있다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>Step 2.</strong> <InlineMath math={"f"}/> is continuous, being a
                            polynomial in the coordinates of <InlineMath math={"x"}/>.
                        </p>}
                        ko={<p>
                            <strong>2단계.</strong> <InlineMath math={"f"}/>은 연속이다.{" "}
                            <InlineMath math={"x"}/>의 좌표에 대한 다항식이기 때문이다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>Step 3.</strong> <InlineMath math={"f"}/> is coercive: it runs to{" "}
                            <InlineMath math={"+\\infty"}/> in every direction. Let{" "}
                            <InlineMath math={"\\lambda_{\\min}(Q) > 0"}/> be the smallest eigenvalue,
                            positive because <InlineMath math={"Q \\succ 0"}/>.
                        </p>}
                        ko={<p>
                            <strong>3단계.</strong> <InlineMath math={"f"}/>은 coercive다. 모든 방향으로{" "}
                            <InlineMath math={"+\\infty"}/>로 달린다.{" "}
                            <InlineMath math={"\\lambda_{\\min}(Q) > 0"}/>을 최소 고윳값이라 하자.{" "}
                            <InlineMath math={"Q \\succ 0"}/>이라 양수다.
                        </p>}
                    />
                    <BlockMath math={"f(x) = \\tfrac{1}{2}x^\\top Q x + qx \\ \\ge\\ \\tfrac{1}{2}\\lambda_{\\min}(Q)\\,\\|x\\|^2 - \\|q\\|\\,\\|x\\| \\ \\xrightarrow[\\ \\|x\\| \\to \\infty\\ ]{} \\ +\\infty."}/>
                    <Terms items={[
                        ["x^\\top Q x \\ge \\lambda_{\\min}\\|x\\|^2", <T en={<>Chapter 3's Rayleigh bound for a symmetric matrix, obtained by expanding <InlineMath math={"x"}/> in an orthonormal eigenbasis</>}
                                                                          ko={<>대칭 행렬에 대한 3장의 Rayleigh 한계다. <InlineMath math={"x"}/>을 정규직교 고유기저로 전개해서 얻는다</>}/>],
                        ["|qx| \\le \\|q\\|\\|x\\|", <T en={<>Cauchy-Schwarz from Chapter 3, applied to the row <InlineMath math={"q"}/> read as a vector</>}
                                                        ko={<>3장의 Cauchy-Schwarz다. 행 <InlineMath math={"q"}/>을 벡터로 읽고 적용한다</>}/>],
                        ["\\text{why it diverges}", <T en={<>the quadratic term grows like <InlineMath math={"\\|x\\|^2"}/> and the linear one only like <InlineMath math={"\\|x\\|"}/>, so the quadratic wins for large <InlineMath math={"\\|x\\|"}/>. This is precisely where positive definiteness is spent: with <InlineMath math={"\\lambda_{\\min} = 0"}/> the bound is vacuous</>}
                                                       ko={<>이차항은 <InlineMath math={"\\|x\\|^2"}/>처럼 자라고 일차항은 <InlineMath math={"\\|x\\|"}/>처럼만 자라므로 <InlineMath math={"\\|x\\|"}/>이 크면 이차항이 이긴다. positive definite가 쓰이는 자리가 정확히 여기다. <InlineMath math={"\\lambda_{\\min} = 0"}/>이면 이 한계는 아무 말도 하지 않는다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>Step 4.</strong> Pick any{" "}
                            <InlineMath math={"x_0 \\in S"}/>, which exists because{" "}
                            <InlineMath math={"S \\ne \\emptyset"}/>, and cut the problem down to
                        </p>}
                        ko={<p>
                            <strong>4단계.</strong>{" "}
                            <InlineMath math={"S \\ne \\emptyset"}/>이므로 존재하는{" "}
                            <InlineMath math={"x_0 \\in S"}/>을 아무거나 잡고 문제를 다음으로 줄인다.
                        </p>}
                    />
                    <BlockMath math={"S_0 := S \\cap \\{x : f(x) \\le f(x_0)\\}, \\qquad \\|x\\| \\le R := \\frac{\\|q\\| + \\sqrt{\\|q\\|^2 + 2\\lambda_{\\min}(Q) f(x_0)}}{\\lambda_{\\min}(Q)} \\ \\ \\text{on } S_0."}/>
                    <Terms items={[
                        ["S_0", <T en={<>nonempty, since <InlineMath math={"x_0 \\in S_0"}/>. Closed, as the intersection of the closed <InlineMath math={"S"}/> with the sublevel set of a continuous function</>}
                                   ko={<><InlineMath math={"x_0 \\in S_0"}/>이므로 비어 있지 않다. 닫힌 <InlineMath math={"S"}/>과 연속 함수의 하위 준위 집합의 교집합이라 닫혀 있다</>}/>],
                        ["R", <T en={<>the larger root of <InlineMath math={"\\tfrac{1}{2}\\lambda_{\\min}r^2 - \\|q\\|r = f(x_0)"}/>. Beyond it, Step 3's lower bound already exceeds <InlineMath math={"f(x_0)"}/>, so no point of <InlineMath math={"S_0"}/> can be there. Hence <InlineMath math={"S_0"}/> is bounded</>}
                                 ko={<><InlineMath math={"\\tfrac{1}{2}\\lambda_{\\min}r^2 - \\|q\\|r = f(x_0)"}/>의 큰 근이다. 그 너머에서는 3단계의 하계가 이미 <InlineMath math={"f(x_0)"}/>을 넘으므로 <InlineMath math={"S_0"}/>의 어떤 점도 거기 있을 수 없다. 따라서 <InlineMath math={"S_0"}/>은 유계다</>}/>],
                        ["\\text{compact}", <T en={<>closed and bounded in a finite dimensional normed space, which is Chapter 6's characterization of compactness</>}
                                               ko={<>유한 차원 normed space에서 닫혔고 유계다. 6장의 컴팩트성 특징 그대로다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>Step 5.</strong> Weierstrass applies to{" "}
                            <InlineMath math={"f"}/> on the compact{" "}
                            <InlineMath math={"S_0"}/>, so there is{" "}
                            <InlineMath math={"x^* \\in S_0"}/> with{" "}
                            <InlineMath math={"f(x^*) \\le f(x)"}/> for every{" "}
                            <InlineMath math={"x \\in S_0"}/>. For{" "}
                            <InlineMath math={"x \\in S \\setminus S_0"}/> we have{" "}
                            <InlineMath math={"f(x) > f(x_0) \\ge f(x^*)"}/> by construction, so{" "}
                            <InlineMath math={"x^*"}/> minimizes over all of{" "}
                            <InlineMath math={"S"}/>. Existence is done.
                        </p>}
                        ko={<p>
                            <strong>5단계.</strong> 컴팩트한{" "}
                            <InlineMath math={"S_0"}/> 위의 <InlineMath math={"f"}/>에 Weierstrass가
                            적용되므로, 모든 <InlineMath math={"x \\in S_0"}/>에 대해{" "}
                            <InlineMath math={"f(x^*) \\le f(x)"}/>인{" "}
                            <InlineMath math={"x^* \\in S_0"}/>이 있다.{" "}
                            <InlineMath math={"x \\in S \\setminus S_0"}/>이면 만든 방식에 의해{" "}
                            <InlineMath math={"f(x) > f(x_0) \\ge f(x^*)"}/>이므로{" "}
                            <InlineMath math={"x^*"}/>이 <InlineMath math={"S"}/> 전체에서 최소를 준다.
                            존재성 완료다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>Step 6.</strong> Uniqueness. Expand the convexity defect of{" "}
                            <InlineMath math={"f"}/> directly; the linear term cancels exactly, leaving
                            only <InlineMath math={"Q"}/>:
                        </p>}
                        ko={<p>
                            <strong>6단계.</strong> 유일성.{" "}
                            <InlineMath math={"f"}/>의 볼록성 결손을 직접 전개한다. 일차항이 정확히
                            상쇄되고 <InlineMath math={"Q"}/>만 남는다.
                        </p>}
                    />
                    <BlockMath math={"f\\bigl(\\lambda x + (1-\\lambda)y\\bigr) - \\lambda f(x) - (1-\\lambda)f(y) = -\\tfrac{1}{2}\\lambda(1-\\lambda)\\,(x-y)^\\top Q (x-y)."}/>
                    <Terms items={[
                        ["\\text{the linear part}", <T en={<><InlineMath math={"q(\\lambda x + (1-\\lambda)y) = \\lambda qx + (1-\\lambda)qy"}/> exactly, so it contributes nothing to the difference. Only the quadratic part survives</>}
                                                       ko={<><InlineMath math={"q(\\lambda x + (1-\\lambda)y) = \\lambda qx + (1-\\lambda)qy"}/>이 정확히 성립하므로 차이에 아무것도 보태지 않는다. 이차항만 살아남는다</>}/>],
                        ["\\lambda(1-\\lambda)", <T en={<>strictly positive for <InlineMath math={"0 < \\lambda < 1"}/>, and <InlineMath math={"(x-y)^\\top Q(x-y) > 0"}/> for <InlineMath math={"x \\ne y"}/> by positive definiteness. So the whole right side is strictly negative and <InlineMath math={"f"}/> is strictly convex</>}
                                                    ko={<><InlineMath math={"0 < \\lambda < 1"}/>에서 진짜로 양수이고, positive definite에 의해 <InlineMath math={"x \\ne y"}/>이면 <InlineMath math={"(x-y)^\\top Q(x-y) > 0"}/>이다. 그러므로 우변 전체가 진짜로 음수이고 <InlineMath math={"f"}/>은 강볼록이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <InlineMath math={"S"}/> is convex and{" "}
                            <InlineMath math={"f"}/> is strictly convex on it, so the corollary of the
                            previous section gives at most one minimizer. Step 5 gave at least one.
                            Exactly one, and the equals sign in (7.1) is earned.
                        </p>}
                        ko={<p>
                            <InlineMath math={"S"}/>이 볼록하고 그 위에서{" "}
                            <InlineMath math={"f"}/>이 강볼록이므로 앞 절의 따름정리가 최소점을 많아야
                            하나 준다. 5단계가 적어도 하나를 주었다. 정확히 하나이고, (7.1)의 등호를
                            벌었다.
                        </p>}
                    />
                </Proof>
                <T
                    en={<p>
                        Notice which hypothesis does which job.{" "}
                        <InlineMath math={"S \\ne \\emptyset"}/> and closedness give a place to look;
                        positive definiteness gives both boundedness of the search (Step 3) and
                        uniqueness (Step 6). Weaken <InlineMath math={"Q"}/> to positive semidefinite and
                        Step 6 fails, so the answer can be a whole face; make it indefinite and Step 3
                        fails, so there may be no answer at all. The figure below lets you do exactly
                        that.
                    </p>}
                    ko={<p>
                        어느 가정이 어느 일을 하는지 보자.{" "}
                        <InlineMath math={"S \\ne \\emptyset"}/>과 닫힘이 찾아볼 자리를 주고, positive
                        definite가 탐색의 유계성(3단계)과 유일성(6단계)을 함께 준다.{" "}
                        <InlineMath math={"Q"}/>을 positive semidefinite로 약화하면 6단계가 깨져 답이 면
                        전체가 될 수 있고, indefinite로 만들면 3단계가 깨져 답이 아예 없을 수 있다. 아래
                        그림이 바로 그것을 해 보게 한다.
                    </p>}
                />
            </Theorem>
            <CanvasFigure label={t("A QP: drag the bowl, drag the constraints, break the Hessian",
                "QP: 그릇을 끌고, 제약을 끌고, Hessian을 깨뜨려 보라")}
                          modal={<QuadraticProgramLab width={780} height={490}/>}
                          bodyClassName="w-[min(92vw,920px)]">
                <QuadraticProgramLab/>
            </CanvasFigure>
            <Example n="7.3b" title={<T en={<>A two-variable QP solved by hand</>} ko={<>손으로 푸는 두 변수 QP</>}/>}>
                <T
                    en={<p>
                        Take the QP that the figure opens with:
                    </p>}
                    ko={<p>
                        그림이 처음 띄우는 QP를 잡자.
                    </p>}
                />
                <BlockMath math={"Q = \\begin{bmatrix} 2 & \\tfrac{1}{2} \\\\[2pt] \\tfrac{1}{2} & 1 \\end{bmatrix}, \\quad q = \\begin{bmatrix} -1 & -2 \\end{bmatrix}, \\quad \\text{subject to } x_1 + x_2 \\le 1."}/>
                <Terms items={[
                    ["Q", <T en={<>positive definite: <InlineMath math={"\\det Q = 2 - \\tfrac{1}{4} = \\tfrac{7}{4} > 0"}/> and <InlineMath math={"\\operatorname{tr} Q = 3 > 0"}/>, so both eigenvalues are positive</>}
                             ko={<>positive definite다. <InlineMath math={"\\det Q = 2 - \\tfrac{1}{4} = \\tfrac{7}{4} > 0"}/>이고 <InlineMath math={"\\operatorname{tr} Q = 3 > 0"}/>이라 고윳값 둘 다 양수다</>}/>],
                    ["x_1 + x_2 \\le 1", <T en={<>one row of (7.5) with <InlineMath math={"a = (1,1)"}/> and <InlineMath math={"b = 1"}/></>}
                                            ko={<><InlineMath math={"a = (1,1)"}/>, <InlineMath math={"b = 1"}/>인 (7.5)의 한 행이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        First ignore the constraint. Stationarity{" "}
                        <InlineMath math={"Qx = -q^\\top"}/> reads{" "}
                        <InlineMath math={"2x_1 + \\tfrac{1}{2}x_2 = 1"}/> and{" "}
                        <InlineMath math={"\\tfrac{1}{2}x_1 + x_2 = 2"}/>, whose solution is{" "}
                        <InlineMath math={"x_u = (0, 2)"}/> with{" "}
                        <InlineMath math={"f(x_u) = -2"}/>. But{" "}
                        <InlineMath math={"0 + 2 = 2 > 1"}/>, so <InlineMath math={"x_u"}/> is not
                        feasible and the constraint must be active. Substitute{" "}
                        <InlineMath math={"x_2 = 1 - x_1"}/>:
                    </p>}
                    ko={<p>
                        먼저 제약을 무시한다. 정상성{" "}
                        <InlineMath math={"Qx = -q^\\top"}/>은{" "}
                        <InlineMath math={"2x_1 + \\tfrac{1}{2}x_2 = 1"}/>,{" "}
                        <InlineMath math={"\\tfrac{1}{2}x_1 + x_2 = 2"}/>이고 해는{" "}
                        <InlineMath math={"x_u = (0, 2)"}/>,{" "}
                        <InlineMath math={"f(x_u) = -2"}/>다. 그런데{" "}
                        <InlineMath math={"0 + 2 = 2 > 1"}/>이므로{" "}
                        <InlineMath math={"x_u"}/>은 실행 가능하지 않고 제약이 활성이어야 한다.{" "}
                        <InlineMath math={"x_2 = 1 - x_1"}/>을 대입한다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} f(x_1) &= \\tfrac{1}{2}\\bigl(2x_1^2 + x_1(1-x_1) + (1-x_1)^2\\bigr) - x_1 - 2(1-x_1) \\\\ &= \\tfrac{1}{2}\\bigl(2x_1^2 - x_1 + 1\\bigr) + x_1 - 2 \\\\ &= x_1^2 + \\tfrac{1}{2}x_1 - \\tfrac{3}{2}. \\end{aligned}"}/>
                <Terms items={[
                    ["\\tfrac{1}{2}x^\\top Q x", <T en={<>equals <InlineMath math={"\\tfrac{1}{2}(2x_1^2 + 2 \\cdot \\tfrac{1}{2}x_1x_2 + x_2^2)"}/>; the cross term appears twice in the quadratic form, which is why the <InlineMath math={"\\tfrac{1}{2}"}/> off-diagonal entry produces a single <InlineMath math={"x_1x_2"}/></>}
                                                    ko={<><InlineMath math={"\\tfrac{1}{2}(2x_1^2 + 2 \\cdot \\tfrac{1}{2}x_1x_2 + x_2^2)"}/>이다. 이차 형식에서 교차항이 두 번 나오고, 그래서 비대각 성분 <InlineMath math={"\\tfrac{1}{2}"}/>이 <InlineMath math={"x_1x_2"}/> 하나를 만든다</>}/>],
                    ["\\text{one variable now}", <T en={<>a scalar quadratic with positive leading coefficient, so <InlineMath math={"2x_1 + \\tfrac{1}{2} = 0"}/> gives the minimum</>}
                                                    ko={<>최고차 계수가 양인 스칼라 이차식이므로 <InlineMath math={"2x_1 + \\tfrac{1}{2} = 0"}/>이 최솟값을 준다</>}/>],
                ]}/>
                <T
                    en={<p>
                        So <InlineMath math={"x^* = (-\\tfrac{1}{4}, \\tfrac{5}{4})"}/> and{" "}
                        <InlineMath math={"f(x^*) = \\tfrac{1}{16} - \\tfrac{1}{8} - \\tfrac{3}{2} = -\\tfrac{25}{16} = -1.5625"}/>.
                        Check the sign of the multiplier, since a QP solution on an active constraint must
                        have <InlineMath math={"\\mu \\ge 0"}/>:{" "}
                        <InlineMath math={"Qx^* = (-\\tfrac{3}{4}, \\tfrac{1}{4})"}/>, so{" "}
                        <InlineMath math={"Qx^* + q^\\top = (-\\tfrac{7}{4}, -\\tfrac{7}{4})"}/> and{" "}
                        <InlineMath math={"\\mu(1,1)^\\top = (\\tfrac{7}{4}, \\tfrac{7}{4})"}/> gives{" "}
                        <InlineMath math={"\\mu = \\tfrac{7}{4} > 0"}/>. Set the figure's handle to{" "}
                        <InlineMath math={"(0, 2)"}/> and read the same numbers off the canvas.
                    </p>}
                    ko={<p>
                        그러므로 <InlineMath math={"x^* = (-\\tfrac{1}{4}, \\tfrac{5}{4})"}/>이고{" "}
                        <InlineMath math={"f(x^*) = \\tfrac{1}{16} - \\tfrac{1}{8} - \\tfrac{3}{2} = -\\tfrac{25}{16} = -1.5625"}/>이다.
                        승수의 부호를 확인하자. 활성 제약 위의 QP 해는{" "}
                        <InlineMath math={"\\mu \\ge 0"}/>이어야 한다.{" "}
                        <InlineMath math={"Qx^* = (-\\tfrac{3}{4}, \\tfrac{1}{4})"}/>이므로{" "}
                        <InlineMath math={"Qx^* + q^\\top = (-\\tfrac{7}{4}, -\\tfrac{7}{4})"}/>이고{" "}
                        <InlineMath math={"\\mu(1,1)^\\top = (\\tfrac{7}{4}, \\tfrac{7}{4})"}/>에서{" "}
                        <InlineMath math={"\\mu = \\tfrac{7}{4} > 0"}/>이다. 그림의 손잡이를{" "}
                        <InlineMath math={"(0, 2)"}/>에 두면 캔버스에서 같은 수를 읽을 수 있다.
                    </p>}
                />
            </Example>
            <Example n="7.3c" title={<T en={<>How QPs arise in robotics: the whole-body controller</>}
                                        ko={<>QP가 로봇에서 나오는 방식: 전신 제어기</>}/>}>
                <T
                    en={<p>
                        The notes give one example and it is the standard one. Start from the robot
                        equations and the ground reaction force model:
                    </p>}
                    ko={<p>
                        교재는 예를 하나 들고 그것이 표준적인 예다. 로봇 방정식과 지면 반력 모델에서
                        시작한다.
                    </p>}
                />
                <BlockMath math={"D(q)\\ddot{q} + C(q, \\dot{q})\\dot{q} + G(q) = Bu, \\qquad F = \\Lambda_0(q, \\dot{q}) + \\Lambda_1(q)u = \\begin{bmatrix} F^h \\\\ F^v \\end{bmatrix}."}/>
                <Terms items={[
                    ["q, \\dot{q}, \\ddot{q}", <T en={<>configuration, velocity, acceleration, with <InlineMath math={"q \\in \\mathbb{R}^n"}/>. Measured or estimated, so treated as known at this instant</>}
                                                  ko={<>자세, 속도, 가속도이고 <InlineMath math={"q \\in \\mathbb{R}^n"}/>이다. 측정하거나 추정한 값이라 이 순간에는 아는 값으로 취급한다</>}/>],
                    ["u", <T en={<>the torque command, <InlineMath math={"u \\in \\mathbb{R}^m"}/>. This is the decision variable</>}
                             ko={<>토크 명령으로 <InlineMath math={"u \\in \\mathbb{R}^m"}/>이다. 이것이 결정 변수다</>}/>],
                    ["F^h, F^v", <T en={<>horizontal and vertical components of the ground reaction force. Both are <em>affine</em> in <InlineMath math={"u"}/>, which is the fact that makes everything below linear</>}
                                    ko={<>지면 반력의 수평 성분과 수직 성분이다. 둘 다 <InlineMath math={"u"}/>에 대해 <em>아핀</em>이고, 아래 전부를 선형으로 만드는 사실이 그것이다</>}/>],
                    ["\\Lambda_0, \\Lambda_1", <T en={<>the offset and the gain of that affine map, both functions of the current state and therefore constants for this control cycle</>}
                                                  ko={<>그 아핀 사상의 오프셋과 이득이다. 둘 다 현재 상태의 함수이므로 이번 제어 주기에서는 상수다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Two physical requirements. The normal force must be at least{" "}
                        <InlineMath math={"20\\%"}/> of the robot's weight, so{" "}
                        <InlineMath math={"F^v \\ge 0.2\\,m_{total}\\,g"}/>, and the horizontal force must
                        stay inside a friction cone, so{" "}
                        <InlineMath math={"|F^h| \\le 0.6\\,F^v"}/>. The notes assert that these become{" "}
                        <InlineMath math={"A_{in}(q)u \\preceq b_{in}(q, \\dot{q})"}/>. Here is that
                        rewriting row by row, using Remark 7.11 to flip the first one and splitting the
                        absolute value into two rows:
                    </p>}
                    ko={<p>
                        물리적 요구가 둘이다. 수직력은 로봇 무게의 적어도{" "}
                        <InlineMath math={"20\\%"}/>이어야 하므로{" "}
                        <InlineMath math={"F^v \\ge 0.2\\,m_{total}\\,g"}/>이고, 수평력은 마찰 원뿔 안에
                        머물러야 하므로 <InlineMath math={"|F^h| \\le 0.6\\,F^v"}/>이다. 교재는 이것들이{" "}
                        <InlineMath math={"A_{in}(q)u \\preceq b_{in}(q, \\dot{q})"}/>이 된다고
                        진술한다. 참고 7.11로 첫 줄을 뒤집고 절댓값을 두 행으로 쪼개, 그 바꿔 쓰기를 한
                        행씩 적으면 이렇다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} -\\Lambda_1^v\\, u &\\ \\le\\ \\Lambda_0^v - 0.2\\,m_{total}\\,g \\\\ (\\Lambda_1^h - 0.6\\,\\Lambda_1^v)\\, u &\\ \\le\\ 0.6\\,\\Lambda_0^v - \\Lambda_0^h \\\\ (-\\Lambda_1^h - 0.6\\,\\Lambda_1^v)\\, u &\\ \\le\\ 0.6\\,\\Lambda_0^v + \\Lambda_0^h \\end{aligned}"}/>
                <Terms items={[
                    ["\\text{row 1}", <T en={<>from <InlineMath math={"-(\\Lambda_0^v + \\Lambda_1^v u) \\le -0.2 m g"}/>, which is <InlineMath math={"F^v \\ge 0.2mg"}/> with both sides negated</>}
                                         ko={<><InlineMath math={"F^v \\ge 0.2mg"}/>의 양변에 음수를 곱한 <InlineMath math={"-(\\Lambda_0^v + \\Lambda_1^v u) \\le -0.2 m g"}/>에서 나온다</>}/>],
                    ["\\text{rows 2 and 3}", <T en={<><InlineMath math={"|F^h| \\le 0.6F^v"}/> is the pair <InlineMath math={"F^h - 0.6F^v \\le 0"}/> and <InlineMath math={"-F^h - 0.6F^v \\le 0"}/>. Splitting an absolute value into two linear rows is the same trick the 1-norm LP uses at the end of this chapter</>}
                                                ko={<><InlineMath math={"|F^h| \\le 0.6F^v"}/>은 <InlineMath math={"F^h - 0.6F^v \\le 0"}/>과 <InlineMath math={"-F^h - 0.6F^v \\le 0"}/> 두 줄이다. 절댓값을 선형 두 행으로 쪼개는 것은 이 장 끝의 1-norm LP가 쓰는 것과 같은 수법이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The torque you actually want is some feedback law{" "}
                        <InlineMath math={"u = \\gamma(q, \\dot{q})"}/>, but it may violate those rows, so
                        a relaxation <InlineMath math={"d"}/> is introduced and penalized:
                    </p>}
                    ko={<p>
                        실제로 내고 싶은 토크는 어떤 피드백 법칙{" "}
                        <InlineMath math={"u = \\gamma(q, \\dot{q})"}/>이지만 그것이 위 행들을 어길 수
                        있으므로, 완화 변수 <InlineMath math={"d"}/>을 도입하고 벌점을 물린다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} u^* = \\operatorname*{arg\\,min}\\ & u^\\top u + p\\, d^\\top d \\\\ \\text{s.t. }\\ & A_{in}(q)u \\preceq b_{in}(q, \\dot{q}) \\\\ & u = \\gamma(q, \\dot{q}) + d \\end{aligned}"}/>
                <Terms items={[
                    ["d", <T en={<>how far the applied torque is allowed to drift from the desired one in order to respect the force constraints. Without it, an infeasible QP means the controller has no answer at all</>}
                             ko={<>힘 제약을 지키기 위해 실제 토크가 원하던 토크에서 얼마나 벗어나도 되는지다. 이것이 없으면 실행 불가능한 QP가 되어 제어기에 답이 아예 없다</>}/>],
                    ["p", <T en={<>a scalar weight. Large <InlineMath math={"p"}/> means "track the feedback law and bend the constraints as little as possible"</>}
                             ko={<>스칼라 가중치. <InlineMath math={"p"}/>가 크면 "피드백 법칙을 따르고 제약은 최대한 덜 구부려라"는 뜻이다</>}/>],
                    ["Q_{\\mathrm{qp}}", <T en={<>reading <InlineMath math={"x = (u, d)"}/>, the cost is <InlineMath math={"\\tfrac{1}{2}x^\\top Qx"}/> with <InlineMath math={"Q = 2\\operatorname{diag}(I, pI)"}/>, positive definite for <InlineMath math={"p > 0"}/>. Theorem 7.8 then guarantees a unique <InlineMath math={"u^*"}/> exists every cycle, before the robot is switched on</>}
                                            ko={<><InlineMath math={"x = (u, d)"}/>으로 읽으면 비용은 <InlineMath math={"Q = 2\\operatorname{diag}(I, pI)"}/>인 <InlineMath math={"\\tfrac{1}{2}x^\\top Qx"}/>이고, <InlineMath math={"p > 0"}/>이면 positive definite다. 그러면 정리 7.8이 로봇에 전원을 넣기도 전에 매 주기 유일한 <InlineMath math={"u^*"}/>이 존재함을 보장한다</>}/>],
                ]}/>
            </Example>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Linear Programs for the 1-Norm and the Max-Norm</h2>}
               ko={<h2>1-norm과 max-norm을 최소화하는 Linear Program</h2>}/>
            <Definition n="7.14" title={<T en={<>Linear Program</>} ko={<>Linear Program</>}/>}>
                <T
                    en={<p>
                        A <strong>Linear Program</strong> means minimizing a scalar-valued linear function
                        subject to linear equality and inequality constraints. For{" "}
                        <InlineMath math={"x \\in \\mathbb{R}^n"}/> and{" "}
                        <InlineMath math={"f \\in \\mathbb{R}^n"}/>:
                    </p>}
                    ko={<p>
                        <strong>Linear Program</strong>이란 선형 등식·부등식 제약 아래에서 스칼라값 선형
                        함수를 최소화하는 것을 말한다.{" "}
                        <InlineMath math={"x \\in \\mathbb{R}^n"}/>,{" "}
                        <InlineMath math={"f \\in \\mathbb{R}^n"}/>에 대해
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} \\text{minimize } \\ & f^\\top x \\\\ \\text{subject to } \\ & A_{in}x \\preceq b_{in} \\\\ & A_{eq}x = b_{eq} \\end{aligned}"}/>
                <Terms items={[
                    ["f^\\top x", <T en={<>the cost, linear rather than quadratic. It has no curvature at all, so its level sets are parallel hyperplanes and its gradient is the constant <InlineMath math={"f"}/></>}
                                     ko={<>비용. 이차가 아니라 일차다. 곡률이 전혀 없어 등위 집합이 평행한 초평면이고 기울기가 상수 <InlineMath math={"f"}/>이다</>}/>],
                    ["K", <T en={<>the feasible set <InlineMath math={"\\{x \\in \\mathbb{R}^n : A_{in}x \\preceq b_{in},\\ A_{eq}x = b_{eq}\\}"}/>, a polyhedron. The only restriction the notes place on <InlineMath math={"A_{in}"}/> and <InlineMath math={"A_{eq}"}/> is that <InlineMath math={"K"}/> be non-empty</>}
                             ko={<>실행 가능 집합 <InlineMath math={"\\{x \\in \\mathbb{R}^n : A_{in}x \\preceq b_{in},\\ A_{eq}x = b_{eq}\\}"}/>, 곧 다면체다. 교재가 <InlineMath math={"A_{in}"}/>, <InlineMath math={"A_{eq}"}/>에 두는 유일한 제한은 <InlineMath math={"K"}/>이 비어 있지 않다는 것뿐이다</>}/>],
                ]}/>
            </Definition>
            <Remark title={<T en={<>Non-empty is not enough for an LP</>} ko={<>LP에서는 비어 있지 않은 것만으로 부족하다</>}/>}>
                <T
                    en={<p>
                        Unlike Theorem 7.8, a non-empty feasible set does not give an LP a minimum. Take{" "}
                        <InlineMath math={"n = 2"}/>,{" "}
                        <InlineMath math={"f = (1, 0)^\\top"}/> and{" "}
                        <InlineMath math={"K = \\{x : -x_2 \\le 0\\}"}/>, the upper half-plane. It is
                        non-empty and closed and convex, and{" "}
                        <InlineMath math={"f^\\top x = x_1"}/> runs to{" "}
                        <InlineMath math={"-\\infty"}/> along{" "}
                        <InlineMath math={"x_1 \\to -\\infty"}/> with{" "}
                        <InlineMath math={"x_2 = 0"}/> throughout. There is no minimum, and no infimum in{" "}
                        <InlineMath math={"\\mathbb{R}"}/> either. The reason Theorem 7.8 did not need this
                        caveat is Step 3: a positive definite quadratic is coercive and a linear function
                        never is.
                    </p>}
                    ko={<p>
                        정리 7.8과 달리, 실행 가능 집합이 비어 있지 않다는 것만으로는 LP에 최솟값이
                        생기지 않는다. <InlineMath math={"n = 2"}/>,{" "}
                        <InlineMath math={"f = (1, 0)^\\top"}/>,{" "}
                        <InlineMath math={"K = \\{x : -x_2 \\le 0\\}"}/>, 곧 위쪽 반평면을 잡자. 비어
                        있지 않고 닫혔고 볼록한데,{" "}
                        <InlineMath math={"x_2 = 0"}/>을 유지한 채{" "}
                        <InlineMath math={"x_1 \\to -\\infty"}/>로 가면{" "}
                        <InlineMath math={"f^\\top x = x_1"}/>이{" "}
                        <InlineMath math={"-\\infty"}/>로 달린다. 최솟값도 없고{" "}
                        <InlineMath math={"\\mathbb{R}"}/> 안의 infimum도 없다. 정리 7.8에 이 단서가
                        필요 없었던 이유는 3단계다. positive definite인 이차식은 coercive이고 일차
                        함수는 결코 그렇지 않다.
                    </p>}
                />
                <T
                    en={<p>
                        The fix is the one Chapter 6 supplies. If{" "}
                        <InlineMath math={"K"}/> is non-empty and <em>bounded</em>, then it is closed (by
                        Step 1 of Theorem 7.8's proof, which never used the cost) and bounded, hence
                        compact, and Weierstrass gives a minimizer for{" "}
                        <InlineMath math={"f^\\top x"}/>, which is continuous. In practice every variable
                        in a robot's LP has physical bounds, so{" "}
                        <InlineMath math={"lb \\preceq x \\preceq ub"}/> is what makes the problem
                        well-posed, not a convenience.
                    </p>}
                    ko={<p>
                        해법은 6장이 대 주는 것이다. <InlineMath math={"K"}/>이 비어 있지 않고{" "}
                        <em>유계</em>이면, 정리 7.8 증명의 1단계에 의해 닫혀 있고(그 단계는 비용을 전혀
                        쓰지 않았다) 유계이므로 컴팩트다. 그러면 Weierstrass가 연속 함수{" "}
                        <InlineMath math={"f^\\top x"}/>의 최소점을 준다. 실제로 로봇의 LP에 나오는
                        변수는 모두 물리적 한계를 가지므로,{" "}
                        <InlineMath math={"lb \\preceq x \\preceq ub"}/>은 편의가 아니라 문제를 잘
                        정의되게 만드는 것이다.
                    </p>}
                />
                <T
                    en={<p>
                        One more property of LPs, visible in the figure and worth naming. Because{" "}
                        <InlineMath math={"f^\\top x"}/> is affine, it is monotone along every line, so
                        from any feasible point you can walk in a descent direction until you hit the
                        boundary without ever increasing the cost, and repeat inside that face. If{" "}
                        <InlineMath math={"K"}/> has vertices, the walk ends at one. That is the
                        fundamental theorem of linear programming and the reason simplex methods search a
                        finite list of vertices instead of a continuum.
                    </p>}
                    ko={<p>
                        그림에서 보이는 LP의 성질이 하나 더 있고 이름을 붙일 값어치가 있다.{" "}
                        <InlineMath math={"f^\\top x"}/>이 아핀이므로 모든 직선을 따라 단조롭다. 그래서
                        실행 가능한 어느 점에서든 비용을 한 번도 올리지 않고 하강 방향으로 경계까지 걸어갈
                        수 있고, 그 면 안에서 같은 일을 반복할 수 있다.{" "}
                        <InlineMath math={"K"}/>에 꼭짓점이 있으면 그 걷기는 꼭짓점에서 끝난다. 그것이
                        linear programming의 기본 정리이고, simplex 방법이 연속체 대신 유한한 꼭짓점
                        목록을 뒤지는 이유다.
                    </p>}
                />
            </Remark>
            <CanvasFigure label={t("Rotate the objective: the optimum hops from vertex to vertex",
                "목적 방향을 돌리면 최적점이 꼭짓점 사이를 건너뛴다")}
                          modal={<LinearProgramLab width={780} height={490}/>}
                          bodyClassName="w-[min(92vw,920px)]">
                <LinearProgramLab/>
            </CanvasFigure>
            <T en={<h3>Why the 2-norm needs no LP and the other two do</h3>}
               ko={<h3>2-norm에는 LP가 필요 없고 나머지 둘에는 필요한 이유</h3>}/>
            <T
                en={<p>
                    This is the contrast the chapter is built around, and the notes state it in a single
                    sentence. Fitting a model to data means making the residual{" "}
                    <InlineMath math={"r = Ax - b"}/> small, and "small" needs a norm. All three norms are
                    convex by Fact 7.10, so all three problems have the local-equals-global guarantee.
                    What differs is whether calculus can find the answer.
                </p>}
                ko={<p>
                    이 장이 그 둘레에 세워진 대비이고, 교재는 이것을 한 문장으로 진술한다. 모델을 자료에
                    맞춘다는 것은 잔차 <InlineMath math={"r = Ax - b"}/>을 작게 만드는 것이고, "작다"에는
                    norm이 필요하다. 세 norm 모두 사실 7.10에 의해 볼록하므로 세 문제 모두 국소가 곧
                    전역이라는 보장을 갖는다. 다른 것은 미적분이 답을 찾아낼 수 있는가다.
                </p>}
            />
            <Example n="7.4a" title={<T en={<>Three numbers, three different answers</>}
                                        ko={<>수 셋, 서로 다른 답 셋</>}/>}>
                <T
                    en={<p>
                        Before any matrices, take the smallest instance there is: find the single number{" "}
                        <InlineMath math={"t"}/> closest to the data{" "}
                        <InlineMath math={"1, 2, 6"}/>. Here{" "}
                        <InlineMath math={"A = (1, 1, 1)^\\top"}/> and{" "}
                        <InlineMath math={"b = (1, 2, 6)^\\top"}/>, so the residual is{" "}
                        <InlineMath math={"r = (t-1,\\ t-2,\\ t-6)"}/>.
                    </p>}
                    ko={<p>
                        행렬을 꺼내기 전에 가장 작은 사례를 잡자. 자료{" "}
                        <InlineMath math={"1, 2, 6"}/>에 가장 가까운 수{" "}
                        <InlineMath math={"t"}/> 하나를 찾는 문제다. 여기서{" "}
                        <InlineMath math={"A = (1, 1, 1)^\\top"}/>,{" "}
                        <InlineMath math={"b = (1, 2, 6)^\\top"}/>이므로 잔차는{" "}
                        <InlineMath math={"r = (t-1,\\ t-2,\\ t-6)"}/>이다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} \\|r\\|_2^2 &= (t-1)^2 + (t-2)^2 + (t-6)^2 && \\tfrac{d}{dt} = 2(3t - 9) = 0 \\ \\Rightarrow\\ t = 3 \\\\ \\|r\\|_1 &= |t-1| + |t-2| + |t-6| && \\text{slope } -3,\\ -1,\\ +1,\\ +3 \\ \\Rightarrow\\ t = 2 \\\\ \\|r\\|_\\infty &= \\max\\{|t-1|, |t-2|, |t-6|\\} && \\text{tie at } t-1 = 6-t \\ \\Rightarrow\\ t = 3.5 \\end{aligned}"}/>
                <Terms items={[
                    ["t = 3", <T en={<>the <strong>mean</strong>. One derivative, one linear equation, one solution. This is the entire content of the normal equations in the smallest possible case</>}
                                 ko={<><strong>평균</strong>이다. 미분 한 번, 일차 방정식 하나, 해 하나. 가장 작은 경우에서 normal equation의 내용 전부가 이것이다</>}/>],
                    ["t = 2", <T en={<>the <strong>median</strong>. The slope of <InlineMath math={"\\|r\\|_1"}/> is <InlineMath math={"-3"}/> below <InlineMath math={"1"}/>, then <InlineMath math={"-1"}/>, then <InlineMath math={"+1"}/>, then <InlineMath math={"+3"}/>. It is never zero. The minimum is at the kink <InlineMath math={"t = 2"}/> where the slope jumps from <InlineMath math={"-1"}/> to <InlineMath math={"+1"}/>, so there is no equation <InlineMath math={"\\nabla h = 0"}/> to solve</>}
                                 ko={<><strong>중앙값</strong>이다. <InlineMath math={"\\|r\\|_1"}/>의 기울기는 <InlineMath math={"1"}/> 아래에서 <InlineMath math={"-3"}/>, 그다음 <InlineMath math={"-1"}/>, <InlineMath math={"+1"}/>, <InlineMath math={"+3"}/>이다. 결코 0이 아니다. 최솟값은 기울기가 <InlineMath math={"-1"}/>에서 <InlineMath math={"+1"}/>로 뛰는 꺾인 점 <InlineMath math={"t = 2"}/>에 있으므로, 풀 <InlineMath math={"\\nabla h = 0"}/> 자체가 없다</>}/>],
                    ["t = 3.5", <T en={<>the <strong>mid-range</strong>, halfway between the extreme data points. Only <InlineMath math={"1"}/> and <InlineMath math={"6"}/> enter; the value <InlineMath math={"2"}/> has no influence whatsoever, since <InlineMath math={"|3.5 - 2| = 1.5 < 2.5"}/></>}
                                   ko={<>극단 자료점 사이의 <strong>중앙</strong>이다. <InlineMath math={"1"}/>과 <InlineMath math={"6"}/>만 들어오고, <InlineMath math={"|3.5 - 2| = 1.5 < 2.5"}/>이므로 값 <InlineMath math={"2"}/>은 아무런 영향도 주지 않는다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Mean, median, mid-range. The choice of norm is not a matter of taste, it is a
                        statement about what you believe your outliers are, and the three answers are as
                        far apart as three answers to the same question can be.
                    </p>}
                    ko={<p>
                        평균, 중앙값, 중앙. norm의 선택은 취향의 문제가 아니라 당신이 이상치를 무엇이라고
                        믿는지에 대한 선언이고, 같은 질문에 대한 세 답이 벌어질 수 있는 만큼 벌어져 있다.
                    </p>}
                />
            </Example>
            <T
                en={<p>
                    The obstacle is now visible.{" "}
                    <InlineMath math={"\\|Ax - b\\|_2^2"}/> is a quadratic with a gradient everywhere,
                    and setting it to zero is a linear system that Chapter 4 factors in{" "}
                    <InlineMath math={"O(n^3)"}/>. Both{" "}
                    <InlineMath math={"\\|Ax - b\\|_1"}/> and{" "}
                    <InlineMath math={"\\|Ax - b\\|_\\infty"}/> are piecewise linear, and the
                    non-differentiable points are precisely the interesting ones: where a residual is zero
                    for the 1-norm, and where two residuals tie for the largest for the max-norm. The
                    optimum sits at exactly such a point, so there is no stationarity equation.
                </p>}
                ko={<p>
                    이제 장애물이 보인다.{" "}
                    <InlineMath math={"\\|Ax - b\\|_2^2"}/>은 어디서나 기울기가 있는 이차식이고, 그것을
                    0으로 놓으면 4장이 <InlineMath math={"O(n^3)"}/>에 분해하는 선형 연립방정식이 된다.{" "}
                    <InlineMath math={"\\|Ax - b\\|_1"}/>과{" "}
                    <InlineMath math={"\\|Ax - b\\|_\\infty"}/>은 둘 다 조각별 일차이고, 미분이 안 되는
                    점이 정확히 흥미로운 점들이다. 1-norm에서는 잔차가 0이 되는 곳, max-norm에서는 잔차
                    둘이 최대에서 동점이 되는 곳이다. 최적점이 정확히 그런 점에 앉으므로 정상성 방정식
                    자체가 없다.
                </p>}
            />
            <T
                en={<p>
                    Convexity survives, though, and that is the opening. The device is the epigraph: put a
                    new variable above each thing you cannot differentiate, constrain it to lie above,
                    and minimize it instead. Bounding an absolute value from above is two linear
                    inequalities, so the whole problem becomes linear. This is the same move that turned{" "}
                    <InlineMath math={"|F^h| \\le 0.6F^v"}/> into two rows in the whole-body QP.
                </p>}
                ko={<p>
                    그래도 볼록성은 살아남고, 그것이 틈이다. 장치는 epigraph다. 미분할 수 없는 것마다 그
                    위에 새 변수를 하나 얹고, 그것이 위에 있도록 제약한 다음, 대신 그것을 최소화한다.
                    절댓값을 위에서 누르는 것은 선형 부등식 둘이므로 문제 전체가 선형이 된다. 전신 QP에서{" "}
                    <InlineMath math={"|F^h| \\le 0.6F^v"}/>을 두 행으로 바꾼 것과 같은 수법이다.
                </p>}
            />
            <Theorem n="7.10b" title={<T en={<>Linear program for the 1-norm</>} ko={<>1-norm을 위한 linear program</>}/>}>
                <T
                    en={<p>
                        Suppose <InlineMath math={"A"}/> is an{" "}
                        <InlineMath math={"m \\times n"}/> real matrix. Minimizing{" "}
                        <InlineMath math={"\\|Ax - b\\|_1"}/> is equivalent to the linear program on{" "}
                        <InlineMath math={"\\mathbb{R}^{n+m}"}/>
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>이 <InlineMath math={"m \\times n"}/> 실행렬이라 하자.{" "}
                        <InlineMath math={"\\|Ax - b\\|_1"}/>의 최소화는{" "}
                        <InlineMath math={"\\mathbb{R}^{n+m}"}/> 위의 다음 linear program과 동치다.
                    </p>}
                />
                <BlockMath math={"\\text{minimize } f^\\top X \\quad \\text{subject to } A_{in}X \\preceq b_{in} \\qquad (7.10)"}/>
                <BlockMath math={"X = \\begin{bmatrix} x \\\\ s\\end{bmatrix}, \\quad f^\\top := \\begin{bmatrix} 0_{1\\times n} & 1_{1 \\times m}\\end{bmatrix}, \\quad A_{in} := \\begin{bmatrix} A & -I_{m\\times m} \\\\ -A & -I_{m \\times m}\\end{bmatrix}, \\quad b_{in} := \\begin{bmatrix} b \\\\ -b\\end{bmatrix}."}/>
                <Terms items={[
                    ["s \\in \\mathbb{R}^m", <T en={<>the <strong>slack variables</strong>, one per row of the residual. Each <InlineMath math={"s_i"}/> is the epigraph height above <InlineMath math={"|r_i|"}/></>}
                                               ko={<><strong>slack 변수</strong>. 잔차의 행마다 하나씩이다. 각 <InlineMath math={"s_i"}/>이 <InlineMath math={"|r_i|"}/> 위의 epigraph 높이다</>}/>],
                    ["f^\\top X", <T en={<>equals <InlineMath math={"\\sum_{i=1}^m s_i"}/>: the zero block ignores <InlineMath math={"x"}/> entirely, so the cost is the sum of the bounds and not of the residuals</>}
                                     ko={<><InlineMath math={"\\sum_{i=1}^m s_i"}/>이다. 영 블록이 <InlineMath math={"x"}/>을 아예 무시하므로, 비용은 잔차의 합이 아니라 상계들의 합이다</>}/>],
                    ["\\text{the two blocks}", <T en={<>the first block row reads <InlineMath math={"Ax - s \\preceq b"}/> and the second reads <InlineMath math={"-Ax - s \\preceq -b"}/>. Together they are <InlineMath math={"|Ax - b| \\preceq s"}/> componentwise</>}
                                                  ko={<>첫 블록 행은 <InlineMath math={"Ax - s \\preceq b"}/>, 둘째는 <InlineMath math={"-Ax - s \\preceq -b"}/>이다. 둘을 합치면 성분별로 <InlineMath math={"|Ax - b| \\preceq s"}/>이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        If <InlineMath math={"\\widehat{X} = [\\widehat{x}^\\top,\\ \\widehat{s}^\\top]^\\top"}/>{" "}
                        solves the linear program, then{" "}
                        <InlineMath math={"\\widehat{x} \\in \\operatorname*{arg\\,min}_{x \\in \\mathbb{R}^n} \\|Ax - b\\|_1"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\widehat{X} = [\\widehat{x}^\\top,\\ \\widehat{s}^\\top]^\\top"}/>이
                        이 linear program을 풀면{" "}
                        <InlineMath math={"\\widehat{x} \\in \\operatorname*{arg\\,min}_{x \\in \\mathbb{R}^n} \\|Ax - b\\|_1"}/>이다.
                    </p>}
                />
                <Proof label={<T en={<>Why the two problems have the same answer</>} ko={<>두 문제의 답이 같은 이유</>}/>}>
                    <T
                        en={<p>
                            Writing out the terms, (7.10) becomes the chain the notes give, each step
                            being one rearrangement of the same two inequalities:
                        </p>}
                        ko={<p>
                            항을 풀어 적으면 (7.10)은 교재가 주는 사슬이 된다. 각 단계는 같은 두 부등식을
                            한 번씩 옮겨 적은 것이다.
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} & \\text{min} \\ \\textstyle\\sum_i s_i \\ \\text{ s.t. } \\ Ax - s \\preceq b,\\ -Ax - s \\preceq -b \\\\ \\iff\\ & \\text{min} \\ \\textstyle\\sum_i s_i \\ \\text{ s.t. } \\ -s \\preceq b - Ax,\\ \\ b - Ax \\preceq s \\\\ \\iff\\ & \\text{min} \\ \\textstyle\\sum_i s_i \\ \\text{ s.t. } \\ -s \\preceq b - Ax \\preceq s \\\\ \\iff\\ & \\text{min} \\ \\textstyle\\sum_i s_i \\ \\text{ s.t. } \\ 0 \\le |b - Ax|_i \\le s_i \\ \\ \\forall i \\end{aligned}"}/>
                    <Terms items={[
                        ["\\text{line 2}", <T en={<>the first row moved <InlineMath math={"s"}/> right and <InlineMath math={"b"}/> left; the second row is <InlineMath math={"-Ax - s \\preceq -b"}/> negated, which flips it to <InlineMath math={"b - Ax \\preceq s"}/> by Remark 7.11</>}
                                              ko={<>첫 행은 <InlineMath math={"s"}/>을 오른쪽으로, <InlineMath math={"b"}/>을 왼쪽으로 옮긴 것이다. 둘째 행은 <InlineMath math={"-Ax - s \\preceq -b"}/>에 음수를 곱한 것이고, 참고 7.11에 의해 <InlineMath math={"b - Ax \\preceq s"}/>으로 뒤집힌다</>}/>],
                        ["\\text{line 4}", <T en={<>for real numbers, <InlineMath math={"(-s_i \\le y_i \\le s_i) \\iff (0 \\le |y_i| \\le s_i)"}/>. Two linear inequalities are exactly one absolute value bound, which is the whole trick</>}
                                              ko={<>실수에서는 <InlineMath math={"(-s_i \\le y_i \\le s_i) \\iff (0 \\le |y_i| \\le s_i)"}/>이다. 선형 부등식 둘이 정확히 절댓값 상계 하나이고, 요령의 전부가 그것이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The notes stop here and conclude{" "}
                            <InlineMath math={"\\text{min}_x \\sum_i |b - Ax|_i"}/>. That last step is
                            worth writing out, because it is where the equivalence is actually proved and
                            it is two short inequalities. Let{" "}
                            <InlineMath math={"p^*"}/> be the LP's optimal value and{" "}
                            <InlineMath math={"d^* := \\min_x \\|b - Ax\\|_1"}/>.
                        </p>}
                        ko={<p>
                            교재는 여기서 멈추고{" "}
                            <InlineMath math={"\\text{min}_x \\sum_i |b - Ax|_i"}/>이라고 결론짓는다. 그
                            마지막 단계를 적어 볼 값어치가 있다. 동치성이 실제로 증명되는 자리이고 짧은
                            부등식 둘이면 되기 때문이다.{" "}
                            <InlineMath math={"p^*"}/>을 LP의 최적값,{" "}
                            <InlineMath math={"d^* := \\min_x \\|b - Ax\\|_1"}/>이라 하자.
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} p^* \\ge d^*: \\quad & \\text{any feasible } (x, s) \\text{ has } \\textstyle\\sum_i s_i \\ \\ge\\ \\sum_i |b - Ax|_i \\ \\ge\\ d^*, \\\\ p^* \\le d^*: \\quad & \\text{for any } x,\\ \\text{ the pair } (x, s) \\text{ with } s_i := |b - Ax|_i \\text{ is feasible, with cost } \\|b - Ax\\|_1. \\end{aligned}"}/>
                    <Terms items={[
                        ["p^* \\ge d^*", <T en={<>uses only the constraint <InlineMath math={"|b-Ax|_i \\le s_i"}/> summed over <InlineMath math={"i"}/>, then the definition of <InlineMath math={"d^*"}/> as a minimum over <InlineMath math={"x"}/></>}
                                            ko={<>제약 <InlineMath math={"|b-Ax|_i \\le s_i"}/>을 <InlineMath math={"i"}/>에 대해 더한 것과, <InlineMath math={"d^*"}/>이 <InlineMath math={"x"}/>에 대한 최솟값이라는 정의만 쓴다</>}/>],
                        ["p^* \\le d^*", <T en={<>exhibits a feasible point of the LP achieving <InlineMath math={"\\|b-Ax\\|_1"}/> for every <InlineMath math={"x"}/>, so the LP's optimum cannot be larger. Together the two give <InlineMath math={"p^* = d^*"}/></>}
                                            ko={<>모든 <InlineMath math={"x"}/>에 대해 <InlineMath math={"\\|b-Ax\\|_1"}/>을 달성하는 LP의 실행 가능한 점을 제시하므로 LP의 최적값이 더 클 수 없다. 둘을 합치면 <InlineMath math={"p^* = d^*"}/>이다</>}/>],
                        ["s_i = |b - Ax|_i", <T en={<>holds at any LP optimum: if some <InlineMath math={"s_i"}/> were strictly above, lowering it stays feasible and lowers the cost, contradicting optimality. So the bound is tight and the slack really is the absolute residual</>}
                                                ko={<>LP의 어느 최적점에서든 성립한다. 어떤 <InlineMath math={"s_i"}/>이 진짜로 위에 있으면 그것을 내려도 실행 가능한 채로 비용이 낮아져 최적성에 모순이다. 그러므로 상계가 빡빡하고 slack이 곧 절댓값 잔차다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Whoever thought this up was pretty clever, as the notes say: it reduces a
                            non-differentiable problem to a linear one, at the price of{" "}
                            <InlineMath math={"m"}/> extra variables and{" "}
                            <InlineMath math={"2m"}/> constraints.
                        </p>}
                        ko={<p>
                            교재의 말대로 이것을 생각해 낸 사람은 꽤 영리했다. 미분 불가능한 문제를 선형
                            문제로 내려보내고, 값으로 치른 것은 변수{" "}
                            <InlineMath math={"m"}/>개와 제약{" "}
                            <InlineMath math={"2m"}/>개다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Theorem n="7.10c" title={<T en={<>Linear program for the max-norm</>} ko={<>max-norm을 위한 linear program</>}/>}>
                <T
                    en={<p>
                        The max-norm is a bit simpler, requiring only a single slack variable. Minimizing{" "}
                        <InlineMath math={"\\|Ax - b\\|_\\infty"}/> is equivalent to the linear program on{" "}
                        <InlineMath math={"\\mathbb{R}^{n+1}"}/> with
                    </p>}
                    ko={<p>
                        max-norm은 조금 더 단순해서 slack 변수 하나만 있으면 된다.{" "}
                        <InlineMath math={"\\|Ax - b\\|_\\infty"}/>의 최소화는{" "}
                        <InlineMath math={"\\mathbb{R}^{n+1}"}/> 위의 다음 linear program과 동치다.
                    </p>}
                />
                <BlockMath math={"X = \\begin{bmatrix} x \\\\ s\\end{bmatrix}, \\quad f^\\top := \\begin{bmatrix} 0_{1\\times n} & 1\\end{bmatrix}, \\quad A_{in} := \\begin{bmatrix} A & -\\mathbf{1}_{m\\times 1} \\\\ -A & -\\mathbf{1}_{m \\times 1}\\end{bmatrix}, \\quad b_{in} := \\begin{bmatrix} b \\\\ -b\\end{bmatrix}."}/>
                <Terms items={[
                    ["s \\in \\mathbb{R}", <T en={<>a single scalar slack: one ceiling for every residual at once. That is what "max" means, and it is why <InlineMath math={"m"}/> variables collapse to one</>}
                                             ko={<>스칼라 slack 하나. 모든 잔차에 대한 천장 하나다. "max"의 뜻이 그것이고, 변수 <InlineMath math={"m"}/>개가 하나로 주저앉는 이유다</>}/>],
                    ["\\mathbf{1}_{m \\times 1}", <T en={<>a column of ones, so the same <InlineMath math={"s"}/> is subtracted from every row. Compare the 1-norm's <InlineMath math={"-I_{m \\times m}"}/>, which gives each row its own budget</>}
                                                     ko={<>1로 채운 열이라 같은 <InlineMath math={"s"}/>이 모든 행에서 빠진다. 각 행에 자기 예산을 주는 1-norm의 <InlineMath math={"-I_{m \\times m}"}/>과 견주어 보라</>}/>],
                    ["\\text{the rows}", <T en={<><InlineMath math={"Ax - s\\mathbf{1} \\preceq b"}/> and <InlineMath math={"-Ax - s\\mathbf{1} \\preceq -b"}/>, which say <InlineMath math={"-s \\le (Ax - b)_i \\le s"}/> for every <InlineMath math={"i"}/>, that is <InlineMath math={"\\max_i |(Ax-b)_i| \\le s"}/></>}
                                            ko={<><InlineMath math={"Ax - s\\mathbf{1} \\preceq b"}/>과 <InlineMath math={"-Ax - s\\mathbf{1} \\preceq -b"}/>이고, 모든 <InlineMath math={"i"}/>에 대해 <InlineMath math={"-s \\le (Ax - b)_i \\le s"}/>, 곧 <InlineMath math={"\\max_i |(Ax-b)_i| \\le s"}/>이라는 말이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        If <InlineMath math={"\\widehat{X} = [\\widehat{x}^\\top,\\ \\widehat{s}\\,]^\\top"}/>{" "}
                        solves the linear program, then{" "}
                        <InlineMath math={"\\widehat{x} \\in \\operatorname*{arg\\,min}_{x \\in \\mathbb{R}^n} \\|Ax - b\\|_\\infty"}/>.
                        The proof is the previous one with{" "}
                        <InlineMath math={"\\sum_i s_i"}/> replaced by{" "}
                        <InlineMath math={"s"}/> and the tightness argument reading{" "}
                        <InlineMath math={"s = \\max_i |b - Ax|_i"}/> at the optimum.
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\widehat{X} = [\\widehat{x}^\\top,\\ \\widehat{s}\\,]^\\top"}/>이
                        이 linear program을 풀면{" "}
                        <InlineMath math={"\\widehat{x} \\in \\operatorname*{arg\\,min}_{x \\in \\mathbb{R}^n} \\|Ax - b\\|_\\infty"}/>이다.
                        증명은 앞의 것에서 <InlineMath math={"\\sum_i s_i"}/>을{" "}
                        <InlineMath math={"s"}/>으로 바꾸고, 빡빡함 논증을 최적점에서{" "}
                        <InlineMath math={"s = \\max_i |b - Ax|_i"}/>으로 읽으면 된다.
                    </p>}
                />
            </Theorem>
            <Example n="7.4b" title={<T en={<>The same three numbers, now written as linear programs</>}
                                        ko={<>같은 수 셋을 이번에는 linear program으로</>}/>}>
                <T
                    en={<p>
                        With <InlineMath math={"A = (1,1,1)^\\top"}/>,{" "}
                        <InlineMath math={"b = (1,2,6)^\\top"}/>,{" "}
                        <InlineMath math={"n = 1"}/> and <InlineMath math={"m = 3"}/>, the 1-norm LP has
                        four variables <InlineMath math={"(t, s_1, s_2, s_3)"}/> and six rows:
                    </p>}
                    ko={<p>
                        <InlineMath math={"A = (1,1,1)^\\top"}/>,{" "}
                        <InlineMath math={"b = (1,2,6)^\\top"}/>,{" "}
                        <InlineMath math={"n = 1"}/>, <InlineMath math={"m = 3"}/>이면 1-norm LP는 변수{" "}
                        <InlineMath math={"(t, s_1, s_2, s_3)"}/> 넷과 행 여섯을 갖는다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} \\text{min } \\ & s_1 + s_2 + s_3 \\\\ \\text{s.t. } \\ & t - s_1 \\le 1, \\quad t - s_2 \\le 2, \\quad t - s_3 \\le 6 \\\\ & -t - s_1 \\le -1, \\quad -t - s_2 \\le -2, \\quad -t - s_3 \\le -6 \\end{aligned}"}/>
                <Terms items={[
                    ["\\text{optimum}", <T en={<><InlineMath math={"t = 2"}/> with <InlineMath math={"s = (1, 0, 4)"}/> and cost <InlineMath math={"5"}/>. Compare <InlineMath math={"t = 3"}/>, which forces <InlineMath math={"s = (2, 1, 3)"}/> and costs <InlineMath math={"6"}/></>}
                                           ko={<><InlineMath math={"t = 2"}/>, <InlineMath math={"s = (1, 0, 4)"}/>, 비용 <InlineMath math={"5"}/>이다. <InlineMath math={"t = 3"}/>과 견주면 그것은 <InlineMath math={"s = (2, 1, 3)"}/>을 강제하고 비용이 <InlineMath math={"6"}/>이다</>}/>],
                    ["s_2 = 0", <T en={<>the second residual is exactly zero at the optimum. That is the LP vertex structure: with two variables in the original problem the optimum interpolates two data points, and here with one variable it interpolates one</>}
                                   ko={<>최적점에서 둘째 잔차가 정확히 0이다. 그것이 LP 꼭짓점의 구조다. 원래 문제의 변수가 둘이면 최적해가 자료점 둘을 지나고, 여기서는 변수가 하나라 하나를 지난다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The max-norm LP has two variables{" "}
                        <InlineMath math={"(t, s)"}/> and the same six rows with{" "}
                        <InlineMath math={"s"}/> shared. Only two rows can bind, since{" "}
                        <InlineMath math={"s \\ge t - 1"}/> dominates{" "}
                        <InlineMath math={"s \\ge t - 2"}/> and{" "}
                        <InlineMath math={"s \\ge 6 - t"}/> dominates{" "}
                        <InlineMath math={"s \\ge 2 - t"}/>. Minimizing{" "}
                        <InlineMath math={"s = \\max\\{t - 1,\\ 6 - t\\}"}/> gives{" "}
                        <InlineMath math={"t - 1 = 6 - t"}/>, so{" "}
                        <InlineMath math={"t = 3.5"}/> and{" "}
                        <InlineMath math={"s = 2.5"}/>. The middle data point never enters the LP's
                        active set, which is the algebraic form of "the max-norm only sees the extremes".
                    </p>}
                    ko={<p>
                        max-norm LP는 변수 <InlineMath math={"(t, s)"}/> 둘과{" "}
                        <InlineMath math={"s"}/>을 공유하는 같은 여섯 행을 갖는다. 활성이 될 수 있는 것은
                        두 행뿐이다. <InlineMath math={"s \\ge t - 1"}/>이{" "}
                        <InlineMath math={"s \\ge t - 2"}/>을 압도하고{" "}
                        <InlineMath math={"s \\ge 6 - t"}/>이{" "}
                        <InlineMath math={"s \\ge 2 - t"}/>을 압도하기 때문이다.{" "}
                        <InlineMath math={"s = \\max\\{t - 1,\\ 6 - t\\}"}/>을 최소화하면{" "}
                        <InlineMath math={"t - 1 = 6 - t"}/>이 되어{" "}
                        <InlineMath math={"t = 3.5"}/>,{" "}
                        <InlineMath math={"s = 2.5"}/>이다. 가운데 자료점은 LP의 활성 집합에 결코 들어오지
                        않는데, "max-norm은 극단만 본다"의 대수적 형태가 그것이다.
                    </p>}
                />
            </Example>
            <CanvasFigure label={t("One data set, three norms, three different lines",
                "자료 하나, norm 셋, 서로 다른 직선 셋")}
                          modal={<NormFittingLab width={780} height={490}/>}
                          bodyClassName="w-[min(92vw,920px)]">
                <NormFittingLab/>
            </CanvasFigure>
            <Remark title={<T en={<>Which norm, and what it costs</>} ko={<>어느 norm을 쓸 것이며 값은 얼마인가</>}/>}>
                <T
                    en={<ul>
                        <li><strong>2-norm</strong>: one linear system, solved by Chapter 4's
                            factorizations. Differentiable, so it composes with everything else in a
                            gradient-based pipeline. Squaring means a single large residual outweighs many
                            small ones, so one bad measurement moves the answer.</li>
                        <li><strong>1-norm</strong>: an LP with{" "}
                            <InlineMath math={"n + m"}/> variables and{" "}
                            <InlineMath math={"2m"}/> rows. Robust, because a distant point contributes a
                            constant slope rather than a growing one, so it cannot dominate. Use it when
                            you expect gross outliers rather than Gaussian noise.</li>
                        <li><strong>max-norm</strong>: an LP with{" "}
                            <InlineMath math={"n + 1"}/> variables and{" "}
                            <InlineMath math={"2m"}/> rows, the cheapest of the three in variable count.
                            It optimizes the worst case and nothing else, so it is the right choice when
                            the specification is a hard bound and the wrong choice when the data has
                            outliers.</li>
                    </ul>}
                    ko={<ul>
                        <li><strong>2-norm</strong>: 선형 연립방정식 하나이고 4장의 분해로 푼다. 미분
                            가능해서 기울기 기반 파이프라인의 나머지와 잘 합성된다. 제곱한다는 것은 큰
                            잔차 하나가 작은 잔차 여럿을 능가한다는 뜻이라, 나쁜 측정 하나가 답을
                            움직인다.</li>
                        <li><strong>1-norm</strong>: 변수{" "}
                            <InlineMath math={"n + m"}/>개, 행{" "}
                            <InlineMath math={"2m"}/>개인 LP다. 멀리 있는 점이 자라나는 기울기가 아니라
                            상수 기울기만 보태므로 지배할 수 없어서 robust하다. 가우시안 잡음이 아니라
                            큰 이상치를 예상할 때 쓴다.</li>
                        <li><strong>max-norm</strong>: 변수{" "}
                            <InlineMath math={"n + 1"}/>개, 행{" "}
                            <InlineMath math={"2m"}/>개인 LP로 변수 수로는 셋 중 가장 싸다. 최악의 경우만
                            최적화하고 그 외에는 아무것도 하지 않으므로, 사양이 강한 한계일 때는 옳은
                            선택이고 자료에 이상치가 있을 때는 틀린 선택이다.</li>
                    </ul>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Why Robotics</h2>} ko={<h2>로봇에서 왜 필요한가</h2>}/>
            <T
                en={<p>
                    Optimization is the layer where a robot's mathematics meets its wall clock. Every item
                    below is a place where one of this chapter's hypotheses is doing work in shipped code,
                    and where its failure has a recognizable symptom.
                </p>}
                ko={<p>
                    최적화는 로봇의 수학이 벽시계와 만나는 층이다. 아래의 항목 하나하나는 이 장의 가정
                    가운데 하나가 실제로 돌아가는 코드에서 일을 하고 있는 자리이고, 그것이 깨졌을 때
                    알아볼 수 있는 증상이 있는 자리다.
                </p>}
            />
            <T
                en={<ul>
                    <li>
                        <strong>The whole-body controller is a QP, and Theorem 7.8 is its real-time
                            guarantee.</strong> A legged robot solves Example 7.3c's problem at
                        every control cycle, a thousand times a second, with new{" "}
                        <InlineMath math={"A_{in}(q)"}/> and{" "}
                        <InlineMath math={"b_{in}(q, \\dot{q})"}/> each time. You cannot inspect the
                        answer before it is applied. What you can do is prove, offline and once, that{" "}
                        <InlineMath math={"Q \\succ 0"}/> and that the constraint set is non-empty, and
                        Theorem 7.8 then says a unique answer exists every cycle. That proof is why the
                        solver is allowed to be inside the loop at all.
                    </li>
                    <li>
                        <strong>Model predictive control is the same QP with a horizon.</strong> Stack the
                        state and input over <InlineMath math={"N"}/> steps, put the dynamics in{" "}
                        <InlineMath math={"A_{eq}x = b_{eq}"}/> and the actuator and safety limits in{" "}
                        <InlineMath math={"A_{in}x \\preceq b_{in}"}/>, and the tracking cost is{" "}
                        <InlineMath math={"\\tfrac{1}{2}x^\\top Qx + qx"}/>. The terminal cost people add
                        is not decoration: it is what keeps <InlineMath math={"Q"}/> positive definite on
                        the last block, so Step 3 of the proof still runs and the horizon problem still
                        has a bounded answer.
                    </li>
                    <li>
                        <strong>A singular <InlineMath math={"Q"}/> is the practical failure, and it looks
                            like chattering.</strong> A redundant manipulator with more actuators than
                        task directions has a cost that is flat along the null space, so{" "}
                        <InlineMath math={"Q"}/> is only positive semidefinite. Step 6 of the proof fails,
                        the minimizer is a whole face rather than a point, and the solver picks a
                        different point on that face each cycle depending on rounding. The joints buzz.
                        Adding <InlineMath math={"\\epsilon\\|u\\|^2"}/> makes{" "}
                        <InlineMath math={"Q \\succ 0"}/> and buys uniqueness back, which is what
                        regularization <em>is</em> here, before it is anything about overfitting.
                    </li>
                    <li>
                        <strong>An infeasible QP is a modelling bug, not a solver bug.</strong> When the
                        friction cone and the desired torque cannot both be satisfied, the feasible set
                        is empty, Theorem 7.8 does not apply, and the solver has nothing to return. The
                        relaxation variable <InlineMath math={"d"}/> in the whole-body QP exists precisely
                        to prevent that: it makes the constraint set non-empty by construction, and moves
                        the conflict into the cost where it can be traded off instead of failing. Any
                        constraint a robot cannot guarantee should be softened this way.
                    </li>
                    <li>
                        <strong>1-norm fitting is what "robust" means in an estimation pipeline.</strong>{" "}
                        Scan matching with a moving object in the frame, pose graph optimization with a
                        wrong loop closure, and visual odometry with a mismatched feature all present the
                        same picture as the fitting figure: most residuals are small and a few are
                        enormous. Least squares chases them because it squares; the 1-norm does not
                        because a distant point only ever contributes a slope of{" "}
                        <InlineMath math={"\\pm 1"}/>. Robust loss functions such as Huber are exactly the
                        interpolation between the two.
                    </li>
                    <li>
                        <strong>The max-norm is how you write a hard specification.</strong> "The tracking
                        error never exceeds two centimetres anywhere on the path" is not an average, it
                        is a max-norm, and Theorem 7.10c turns it into an LP with one extra variable. The
                        same shape appears in controller synthesis with an{" "}
                        <InlineMath math={"\\infty"}/>-norm spec and in calibration where the acceptance
                        test is a worst-case residual. Note the flip side the figure shows: the max-norm
                        fit is dominated by the single worst point, so a specification written this way
                        is a specification that a single outlier can fail.
                    </li>
                    <li>
                        <strong>Robot constraint sets really are polyhedra, which is why any of this
                            applies.</strong> Joint limits are{" "}
                        <InlineMath math={"lb \\preceq q \\preceq ub"}/>, torque limits are the same on{" "}
                        <InlineMath math={"u"}/>, a linearized friction cone is a stack of rows, and an
                        obstacle avoided by a separating hyperplane contributes one row per obstacle.
                        Each is <InlineMath math={"K_1"}/> or{" "}
                        <InlineMath math={"K_2"}/> from Fact 7.10, and the intersection rule says you may
                        keep adding them without ever losing convexity.
                    </li>
                    <li>
                        <strong>Where convexity actually breaks is the union, and that is why planners
                            exist.</strong> Free space around obstacles is not convex: it is a union of
                        convex pieces, exactly the last panel of the convex set figure. No amount of
                        constraint stacking fixes that, which is why obstacle avoidance ends up as a
                        mixed-integer program, a sampling planner, or a convex decomposition into
                        corridors that are each a polyhedron. Recognizing "this is a union" early saves
                        you from trying to hand it to a QP solver.
                    </li>
                    <li>
                        <strong>Local equals global is what makes an early stop safe.</strong> A real-time
                        solver runs out of time. On a convex problem, stopping early gives a feasible
                        point with a bounded gap to the optimum, and every solver reports that gap. On a
                        non-convex problem, stopping early gives a local minimum with no bound at all and
                        no way to tell how bad it is. That difference, and not speed, is the main reason
                        robotics works so hard to convexify.
                    </li>
                    <li>
                        <strong>Do not call a QP solver on an unconstrained least squares problem.</strong>{" "}
                        The QP machinery exists for constraints. Without them, the answer is the normal
                        equations, and Chapter 4's Cholesky or QR gets it in one factorization with better
                        conditioning and no iteration count to tune. Reach for the general tool only when
                        the constraints are real.
                    </li>
                </ul>}
                ko={<ul>
                    <li>
                        <strong>전신 제어기는 QP이고, 정리 7.8이 그 실시간 보증이다.</strong> 다족 로봇은
                        예제 7.3c의 문제를 매 제어 주기마다, 초당 천 번씩, 매번 새로운{" "}
                        <InlineMath math={"A_{in}(q)"}/>과{" "}
                        <InlineMath math={"b_{in}(q, \\dot{q})"}/>으로 푼다. 답을 적용하기 전에 들여다볼
                        수는 없다. 할 수 있는 것은 <InlineMath math={"Q \\succ 0"}/>이고 제약 집합이 비어
                        있지 않다는 것을 오프라인에서 한 번 증명해 두는 것이고, 그러면 정리 7.8이 매
                        주기마다 유일한 답이 존재한다고 말해 준다. solver가 루프 안에 들어가도 되는 이유가
                        그 증명이다.
                    </li>
                    <li>
                        <strong>Model predictive control은 시야를 붙인 같은 QP다.</strong> 상태와 입력을{" "}
                        <InlineMath math={"N"}/>단계에 걸쳐 쌓고 동역학을{" "}
                        <InlineMath math={"A_{eq}x = b_{eq}"}/>에, 구동기와 안전 한계를{" "}
                        <InlineMath math={"A_{in}x \\preceq b_{in}"}/>에 넣으면 추종 비용이{" "}
                        <InlineMath math={"\\tfrac{1}{2}x^\\top Qx + qx"}/>이다. 사람들이 붙이는 종단
                        비용은 장식이 아니다. 마지막 블록에서 <InlineMath math={"Q"}/>을 positive
                        definite로 유지해, 증명의 3단계가 여전히 돌고 시야 문제에 여전히 유계인 답이
                        있게 만드는 것이 그것이다.
                    </li>
                    <li>
                        <strong>특이한 <InlineMath math={"Q"}/>이 실제 실패이고, 그것은 떨림으로
                            보인다.</strong> 작업 방향보다 구동기가 많은 여유 자유도 매니퓰레이터는 영
                        공간을 따라 비용이 평평하므로 <InlineMath math={"Q"}/>이 positive semidefinite에
                        그친다. 증명의 6단계가 깨지고 최소점이 한 점이 아니라 면 전체가 되며, solver는
                        반올림에 따라 매 주기 그 면 위의 다른 점을 고른다. 관절이 웅웅거린다.{" "}
                        <InlineMath math={"\\epsilon\\|u\\|^2"}/>을 더하면{" "}
                        <InlineMath math={"Q \\succ 0"}/>이 되어 유일성을 되사 온다. 과적합에 관한
                        무엇이기 이전에, 여기서 regularization이란 <em>바로 그것</em>이다.
                    </li>
                    <li>
                        <strong>실행 불가능한 QP는 solver의 버그가 아니라 모델링의 버그다.</strong> 마찰
                        원뿔과 원하는 토크를 동시에 만족할 수 없으면 실행 가능 집합이 비고, 정리 7.8이
                        적용되지 않으며, solver는 돌려줄 것이 없다. 전신 QP의 완화 변수{" "}
                        <InlineMath math={"d"}/>은 정확히 그것을 막으려고 있다. 제약 집합을 구조적으로
                        비지 않게 만들고, 충돌을 비용 쪽으로 옮겨 실패 대신 절충이 되게 한다. 로봇이
                        보장할 수 없는 제약은 모두 이런 식으로 물러야 한다.
                    </li>
                    <li>
                        <strong>추정 파이프라인에서 "robust"라는 말의 뜻이 1-norm 적합이다.</strong>{" "}
                        화면에 움직이는 물체가 들어온 스캔 정합, 잘못된 loop closure가 섞인 pose graph
                        최적화, 잘못 대응된 특징점이 있는 visual odometry가 모두 적합 그림과 같은 그림을
                        보인다. 잔차 대부분은 작고 몇 개가 엄청나게 크다. 최소제곱은 제곱하기 때문에 그
                        점들을 쫓아가고, 1-norm은 멀리 있는 점이 기울기{" "}
                        <InlineMath math={"\\pm 1"}/>만 보태므로 쫓아가지 않는다. Huber 같은 robust 손실
                        함수는 정확히 그 둘 사이를 잇는 것이다.
                    </li>
                    <li>
                        <strong>강한 사양을 적는 방법이 max-norm이다.</strong> "경로 어디에서도 추종
                        오차가 2센티미터를 넘지 않는다"는 평균이 아니라 max-norm이고, 정리 7.10c가 그것을
                        변수 하나만 더한 LP로 바꿔 준다.{" "}
                        <InlineMath math={"\\infty"}/>-norm 사양을 쓰는 제어기 합성이나, 합격 판정이
                        최악의 잔차인 캘리브레이션에서도 같은 모양이 나온다. 그림이 보이는 뒷면도 함께
                        기억하자. max-norm 적합은 가장 나쁜 점 하나에 지배되므로, 이렇게 적은 사양은
                        이상치 하나로 떨어질 수 있는 사양이다.
                    </li>
                    <li>
                        <strong>로봇의 제약 집합은 실제로 다면체이고, 그래서 이 모든 것이
                            적용된다.</strong> 관절 한계는{" "}
                        <InlineMath math={"lb \\preceq q \\preceq ub"}/>이고, 토크 한계는{" "}
                        <InlineMath math={"u"}/>에 대해 같은 꼴이며, 선형화한 마찰 원뿔은 행 몇 줄이고,
                        분리 초평면으로 피하는 장애물은 장애물마다 한 행을 보탠다. 각각이 사실 7.10의{" "}
                        <InlineMath math={"K_1"}/> 아니면 <InlineMath math={"K_2"}/>이고, 교집합 규칙이
                        볼록성을 잃지 않으면서 계속 더해도 된다고 말해 준다.
                    </li>
                    <li>
                        <strong>볼록성이 실제로 깨지는 곳은 합집합이고, planner가 존재하는 이유가
                            그것이다.</strong> 장애물 둘레의 자유 공간은 볼록하지 않다. 볼록 조각들의
                        합집합이고, 볼록 집합 그림의 마지막 판이 정확히 그것이다. 제약을 아무리 쌓아도
                        고쳐지지 않으며, 그래서 장애물 회피는 혼합 정수 계획이 되거나 표본 기반 planner가
                        되거나, 각각이 다면체인 통로들로 볼록 분해하는 일이 된다. "이건 합집합이다"를
                        일찍 알아보면 그것을 QP solver에 넘기려는 시도를 아낄 수 있다.
                    </li>
                    <li>
                        <strong>국소가 곧 전역이라는 것이 일찍 멈추는 것을 안전하게 만든다.</strong>{" "}
                        실시간 solver는 시간이 떨어진다. 볼록 문제에서는 일찍 멈춰도 최적값과의 간격이
                        유계인 실행 가능한 점이 나오고, 모든 solver가 그 간격을 보고한다. 볼록하지 않은
                        문제에서는 일찍 멈추면 한계가 전혀 없는 국소 최솟값이 나오고 그것이 얼마나
                        나쁜지 알 방법이 없다. 로봇이 볼록화에 그렇게 공을 들이는 주된 이유는 속도가
                        아니라 그 차이다.
                    </li>
                    <li>
                        <strong>제약 없는 최소제곱 문제에 QP solver를 부르지 마라.</strong> QP 기계는
                        제약을 위해 있다. 제약이 없으면 답은 normal equation이고, 4장의 Cholesky나 QR이
                        조건수도 더 좋고 조율할 반복 횟수도 없이 분해 한 번으로 그것을 얻는다. 제약이
                        진짜로 있을 때에만 범용 도구를 꺼내라.
                    </li>
                </ul>}
            />
            <T
                en={<p>
                    That is where the course lands. Chapter 1 taught how to state a claim and negate it,
                    Chapter 2 built the spaces, Chapter 3 gave them length and angle and solved least
                    squares, Chapter 4 computed it, Chapter 5 added noise, Chapter 6 said when an answer
                    exists at all, and this chapter names the two problem shapes that a robot can carry
                    with it and solve in the time it has.
                </p>}
                ko={<p>
                    이 과목이 닿는 지점이 여기다. 1장이 주장을 진술하고 부정하는 법을 가르쳤고, 2장이
                    공간을 세웠고, 3장이 그 공간에 길이와 각도를 주고 최소제곱을 풀었고, 4장이 그것을
                    계산했고, 5장이 잡음을 얹었고, 6장이 애초에 답이 언제 존재하는지를 말했으며, 이 장이
                    로봇이 몸에 지니고 다니며 주어진 시간 안에 풀 수 있는 두 문제 모양에 이름을 붙였다.
                </p>}
            />

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>References</h2>} ko={<h2>References</h2>}/>
            <ul>
                <li>
                    Jessy W. Grizzle, <em>ROB 501: Mathematics for Robotics</em>, University of Michigan,
                    2022. Chapter 7.{" "}
                    <a href={COURSE} target="_blank" rel="noopener noreferrer">{t("Course page", "코스 페이지")}</a>
                    {" · "}
                    <a href={NOTES_REPO} target="_blank" rel="noopener noreferrer">michiganrobotics/rob501</a>
                </li>
                <li>
                    <a href={BOYD_BOOK} target="_blank" rel="noopener noreferrer">
                        Stephen Boyd and Lieven Vandenberghe, <em>Convex Optimization</em>
                    </a>
                    {" · "}
                    {t("free PDF; chapters 2 and 3 are this page's first section done properly, and chapter 4 is the taxonomy that puts LP and QP in their places",
                        "무료 PDF다. 2장과 3장이 이 페이지의 첫 절을 제대로 한 것이고, 4장이 LP와 QP를 제자리에 놓는 분류다")}
                </li>
                <li>
                    <a href={CARATHEODORY} target="_blank" rel="noopener noreferrer">
                        {t("Carathéodory's theorem for convex hulls", "볼록 껍질에 대한 Carathéodory 정리")}
                    </a>
                    {" · "}
                    {t("the sharpening of Definition 7.3 quoted above: in R^n, combinations of at most n+1 points suffice",
                        "위에서 인용한 정의 7.3의 정밀화다. R^n에서는 많아야 n+1개의 점을 결합하면 충분하다")}
                </li>
                <li>
                    <a href={OSQP_PAPER} target="_blank" rel="noopener noreferrer">
                        OSQP: {t("an operator splitting solver for quadratic programs", "quadratic program을 위한 operator splitting solver")}
                    </a>
                    {" · "}
                    <a href={OSQP_JL} target="_blank" rel="noopener noreferrer">osqp/OSQP.jl</a>
                    {" · "}
                    {t("both linked by the notes; the paper is worth skimming for how a QP is actually solved fast enough to run at 1 kHz",
                        "둘 다 교재가 걸어 둔 링크다. 논문은 QP가 실제로 어떻게 1 kHz에서 돌 만큼 빠르게 풀리는지를 훑어볼 값어치가 있다")}
                </li>
                <li>
                    <a href={BOYD_SOFTWARE} target="_blank" rel="noopener noreferrer">
                        {t("Boyd's software page", "Boyd의 소프트웨어 페이지")}
                    </a>
                    {" · "}
                    <a href={CVXPY} target="_blank" rel="noopener noreferrer">CVXPY</a>
                    {" · "}
                    {t("the second lets you type the problem in the notation of this page and have the LP or QP built for you, including the slack variable trick",
                        "두 번째 것은 이 페이지의 기호 그대로 문제를 적으면 LP나 QP를 대신 만들어 준다. slack 변수 요령까지 포함해서다")}
                </li>
                <li>
                    <a href={QUADPROG} target="_blank" rel="noopener noreferrer">MATLAB quadprog</a>
                    {" · "}
                    <a href={MPC_QP} target="_blank" rel="noopener noreferrer">
                        {t("MATLAB MPC QP solver", "MATLAB MPC QP solver")}
                    </a>
                    {" · "}
                    <a href={CPLEX_QP} target="_blank" rel="noopener noreferrer">IBM CPLEX QP</a>
                    {" · "}
                    {t("the notes' list of special purpose QP solvers; all three take the problem in exactly the form (7.5) to (7.7)",
                        "교재가 적어 둔 전용 QP solver 목록이다. 셋 다 문제를 정확히 (7.5)에서 (7.7)의 형태로 받는다")}
                </li>
                <li>
                    <a href={SIMPLEX_WIKI} target="_blank" rel="noopener noreferrer">
                        {t("Simplex algorithm", "Simplex 알고리즘")}
                    </a>
                    {" · "}
                    {t("the vertex-hopping in the linear program figure, written down as an algorithm",
                        "linear program 그림의 꼭짓점 건너뛰기를 알고리즘으로 적어 놓은 것이다")}
                </li>
                <li>
                    <a href={LAD_WIKI} target="_blank" rel="noopener noreferrer">
                        {t("Least absolute deviations", "최소 절대 편차")}
                    </a>
                    {" · "}
                    {t("the 1-norm fit of the last figure, including the fact used to compute it exactly here: an optimal line passes through two of the data points",
                        "마지막 그림의 1-norm 적합이다. 여기서 그것을 정확히 계산하는 데 쓴 사실도 함께 나온다. 최적 직선은 자료점 두 개를 지난다")}
                </li>
            </ul>
        </>
    );
};

export default Chapter7;
