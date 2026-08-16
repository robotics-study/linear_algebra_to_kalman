import CanvasFigure from "../../components/CanvasFigure";
import GramSchmidtSteps from "../../components/pages/chapter3/GramSchmidtSteps";
import LeastSquaresLab from "../../components/pages/chapter3/LeastSquaresLab";
import NormBallExplorer from "../../components/pages/chapter3/NormBallExplorer";
import ProjectionExplorer from "../../components/pages/chapter3/ProjectionExplorer";
import QuadraticFormExplorer from "../../components/pages/chapter3/QuadraticFormExplorer";
import {BlockMath, InlineMath} from "../../components/math/Tex";
import {Corollary, Definition, Example, Lemma, Proof, Proposition, Remark, Theorem} from "../../components/math/Statement";
import Terms from "../../components/math/Terms";
import {T, useTr} from "../../libs/i18n";

const COURSE = "https://grizzle.robotics.umich.edu/education/rob501";
const NOTES_REPO = "https://github.com/michiganrobotics/rob501";
const ROB101 = "https://github.com/michiganrobotics/rob101";
const BOYD = "https://web.stanford.edu/~boyd/cvxbook/";
const TREFETHEN = "https://epubs.siam.org/doi/book/10.1137/1.9780898719574";

const Chapter3 = () => {
    const t = useTr();
    return (
        <>
            <T
                en={<p>
                    Chapter 2 gave vectors a structure but no size. You could add one matrix to another and
                    scale a polynomial, and nothing in the ten axioms let you say that one vector was longer
                    than another or that two of them were nearly the same. This chapter installs a ruler and
                    a protractor. With those two instruments the main computational problem of the course
                    turns into a picture you can draw: to approximate a vector by something inside a
                    subspace, drop a perpendicular.
                </p>}
                ko={<p>
                    2장은 벡터에 구조를 주었지만 크기는 주지 않았다. 행렬끼리 더하고 다항식에 스칼라를 곱할 수는
                    있어도, axiom 열 개 어디에도 어떤 벡터가 다른 벡터보다 길다거나 둘이 거의 같다고 말할 근거는
                    없었다. 이 장은 거기에 자와 각도기를 들여놓는다. 그 두 도구가 들어오는 순간 이 과목의 핵심
                    계산 문제는 그림 한 장이 된다. 부분 공간 안의 무언가로 벡터를 근사하려면 수선을 내리면 된다.
                </p>}
            />
            <BlockMath math={"\\hat{x} = \\operatorname*{arg\\,min}_{m \\in M} \\|x - m\\| \\qquad \\Longleftrightarrow \\qquad (x - \\hat{x}) \\perp M"}/>
            <Terms items={[
                ["x", <T en={<>the vector we want to approximate: a measurement, a signal, a data column</>}
                         ko={<>근사하려는 벡터. 측정값일 수도, 신호일 수도, 데이터 한 열일 수도 있다</>}/>],
                ["M", <T en={<>a subspace of the space <InlineMath math={"x"}/> lives in: the set of approximations we are allowed to use</>}
                         ko={<><InlineMath math={"x"}/>가 사는 공간의 부분 공간. 우리가 써도 되는 근사들의 집합이다</>}/>],
                ["\\hat{x}", <T en={<>the best approximation, the element of <InlineMath math={"M"}/> closest to <InlineMath math={"x"}/></>}
                               ko={<>최선의 근사. <InlineMath math={"M"}/>의 원소 중 <InlineMath math={"x"}/>에 가장 가까운 것</>}/>],
                ["\\|\\cdot\\|", <T en={<>a norm: the ruler that decides what "closest" means</>}
                                   ko={<>norm. "가장 가깝다"의 뜻을 정하는 자다</>}/>],
                ["\\perp", <T en={<>orthogonality, defined by an inner product: the protractor</>}
                             ko={<>직교. 내적으로 정의되며, 각도기에 해당한다</>}/>],
            ]}/>
            <T
                en={<p>
                    The right-hand side is the surprise. A minimization over an infinite set collapses into
                    one algebraic condition, and that condition is a square linear system called the normal
                    equations. Chapter 4 will factor the matrix in that system, and Chapter 5 will add noise
                    to it and call the result a Kalman filter. Everything downstream is this one picture,
                    decorated.
                </p>}
                ko={<p>
                    놀라운 쪽은 오른쪽이다. 무한 집합 위의 최소화가 대수 조건 하나로 주저앉고, 그 조건이 normal
                    equation이라 불리는 정방 선형계다. 4장은 그 계의 행렬을 분해하고, 5장은 거기에 잡음을 얹어
                    칼만 필터라 부른다. 뒤에 오는 것들은 전부 이 그림 한 장을 꾸민 것이다.
                </p>}
            />
            <Remark title={<T en={<>Notation used throughout</>} ko={<>이 장에서 쓰는 기호</>}/>}>
                <T
                    en={<ul>
                        <li><InlineMath math={"\\mathcal{X}"}/> is a vector space and{" "}
                            <InlineMath math={"\\mathcal{F}"}/> its field, always{" "}
                            <InlineMath math={"\\mathbb{R}"}/> or <InlineMath math={"\\mathbb{C}"}/> here.
                            <InlineMath math={"\\;M"}/> is a subspace of{" "}
                            <InlineMath math={"\\mathcal{X}"}/>, and <InlineMath math={"S"}/> is a subset
                            that need not be one.</li>
                        <li>Superscripts on vectors are <strong>labels, not powers</strong>, the same
                            convention as Chapter 2: <InlineMath math={"y^2"}/> is the second vector of a
                            list. Subscripts index the entries of a column, as in{" "}
                            <InlineMath math={"x_i"}/>, and also index a norm, as in{" "}
                            <InlineMath math={"\\|x\\|_2"}/>.</li>
                        <li><InlineMath math={"\\hat{x}"}/> is reserved for a computed best approximation and{" "}
                            <InlineMath math={"x^*"}/> for a minimizer whose uniqueness has not yet been
                            established. The notes use both; they mean the same object once uniqueness is
                            proved.</li>
                    </ul>}
                    ko={<ul>
                        <li><InlineMath math={"\\mathcal{X}"}/>는 벡터 공간,{" "}
                            <InlineMath math={"\\mathcal{F}"}/>는 그 체이고 여기서는 늘{" "}
                            <InlineMath math={"\\mathbb{R}"}/> 아니면 <InlineMath math={"\\mathbb{C}"}/>다.{" "}
                            <InlineMath math={"M"}/>은 <InlineMath math={"\\mathcal{X}"}/>의 부분 공간,{" "}
                            <InlineMath math={"S"}/>는 부분 공간이 아니어도 되는 부분집합이다.</li>
                        <li>벡터의 위첨자는 2장과 같이 <strong>지수가 아니라 이름표</strong>다.{" "}
                            <InlineMath math={"y^2"}/>는 목록의 두 번째 벡터다. 아래첨자는{" "}
                            <InlineMath math={"x_i"}/>처럼 열의 성분을 가리키고,{" "}
                            <InlineMath math={"\\|x\\|_2"}/>처럼 norm의 종류도 가리킨다.</li>
                        <li><InlineMath math={"\\hat{x}"}/>는 계산해 낸 최선의 근사,{" "}
                            <InlineMath math={"x^*"}/>는 아직 유일성이 확인되지 않은 최소화 벡터에 쓴다. 원
                            교재는 둘 다 쓰는데, 유일성이 증명되고 나면 같은 대상이다.</li>
                    </ul>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Norms and Normed Spaces</h2>} ko={<h2>norm과 normed space</h2>}/>
            <T
                en={<p>
                    A norm is a single number attached to a vector that behaves the way length behaves. Three
                    demands are enough, and they are exactly the three that make the triangle drawings you
                    have in mind come out right.
                </p>}
                ko={<p>
                    norm은 벡터 하나에 붙는 수 하나이고, 길이가 하는 대로 행동한다. 요구 사항은 세 개면 충분하며,
                    그 셋이 정확히 머릿속 삼각형 그림이 맞아떨어지게 만드는 조건이다.
                </p>}
            />
            <Definition n="3.1" title={<T en={<>Norm</>} ko={<>norm</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/> be a vector space with{" "}
                        <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/> or{" "}
                        <InlineMath math={"\\mathcal{F} = \\mathbb{C}"}/>. A function{" "}
                        <InlineMath math={"\\|\\cdot\\| : \\mathcal{X} \\to \\mathbb{R}"}/> is a{" "}
                        <strong>norm</strong> if it satisfies:
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>이 벡터 공간이고{" "}
                        <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/> 또는{" "}
                        <InlineMath math={"\\mathcal{F} = \\mathbb{C}"}/>라 하자. 함수{" "}
                        <InlineMath math={"\\|\\cdot\\| : \\mathcal{X} \\to \\mathbb{R}"}/>이 다음을 만족하면{" "}
                        <strong>norm</strong>이라 한다.
                    </p>}
                />
                <T
                    en={<ol>
                        <li><strong>Positive definiteness.</strong>{" "}
                            <InlineMath math={"\\|x\\| \\ge 0"}/> for all{" "}
                            <InlineMath math={"x \\in \\mathcal{X}"}/>, and{" "}
                            <InlineMath math={"\\|x\\| = 0 \\iff x = 0"}/>.</li>
                        <li><strong>Triangle inequality.</strong>{" "}
                            <InlineMath math={"\\|x + y\\| \\le \\|x\\| + \\|y\\|"}/> for all{" "}
                            <InlineMath math={"x, y \\in \\mathcal{X}"}/>.</li>
                        <li><strong>Absolute homogeneity.</strong>{" "}
                            <InlineMath math={"\\|\\alpha x\\| = |\\alpha| \\cdot \\|x\\|"}/> for all{" "}
                            <InlineMath math={"x \\in \\mathcal{X}"}/> and{" "}
                            <InlineMath math={"\\alpha \\in \\mathcal{F}"}/>, where{" "}
                            <InlineMath math={"|\\alpha|"}/> is the absolute value when{" "}
                            <InlineMath math={"\\alpha \\in \\mathbb{R}"}/> and the magnitude when{" "}
                            <InlineMath math={"\\alpha \\in \\mathbb{C}"}/>.</li>
                    </ol>}
                    ko={<ol>
                        <li><strong>양의 정의성.</strong> 모든{" "}
                            <InlineMath math={"x \\in \\mathcal{X}"}/>에 대해{" "}
                            <InlineMath math={"\\|x\\| \\ge 0"}/>이고,{" "}
                            <InlineMath math={"\\|x\\| = 0 \\iff x = 0"}/>이다.</li>
                        <li><strong>삼각 부등식.</strong> 모든{" "}
                            <InlineMath math={"x, y \\in \\mathcal{X}"}/>에 대해{" "}
                            <InlineMath math={"\\|x + y\\| \\le \\|x\\| + \\|y\\|"}/>이다.</li>
                        <li><strong>절대 동차성.</strong> 모든{" "}
                            <InlineMath math={"x \\in \\mathcal{X}"}/>,{" "}
                            <InlineMath math={"\\alpha \\in \\mathcal{F}"}/>에 대해{" "}
                            <InlineMath math={"\\|\\alpha x\\| = |\\alpha| \\cdot \\|x\\|"}/>이다. 여기서{" "}
                            <InlineMath math={"|\\alpha|"}/>는 <InlineMath math={"\\alpha \\in \\mathbb{R}"}/>이면
                            절댓값, <InlineMath math={"\\alpha \\in \\mathbb{C}"}/>이면 크기다.</li>
                    </ol>}
                />
            </Definition>
            <Example title={<T en={<>The three clauses on one vector</>} ko={<>벡터 하나로 확인하는 세 조항</>}/>}>
                <T
                    en={<p>
                        Take <InlineMath math={"\\mathcal{X} = \\mathbb{R}^2"}/> with the Euclidean norm,{" "}
                        <InlineMath math={"x = (3, -4)^\\top"}/>, <InlineMath math={"y = (1, 0)^\\top"}/> and{" "}
                        <InlineMath math={"\\alpha = -2"}/>. Every clause becomes arithmetic:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{X} = \\mathbb{R}^2"}/>에 유클리드 norm을 얹고{" "}
                        <InlineMath math={"x = (3, -4)^\\top"}/>,{" "}
                        <InlineMath math={"y = (1, 0)^\\top"}/>,{" "}
                        <InlineMath math={"\\alpha = -2"}/>로 두면 모든 조항이 산술이 된다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} \\|x\\|_2 &= \\sqrt{9 + 16} = 5 \\\\ \\|x + y\\|_2 &= \\sqrt{16 + 16} \\approx 5.66 \\;\\le\\; 5 + 1 \\\\ \\|{-2}x\\|_2 &= \\sqrt{36 + 64} = 10 = |-2| \\cdot 5 \\end{aligned}"}/>
                <Terms items={[
                    ["\\|x\\|_2 = 5", <T en={<>clause 1: a strictly positive number, zero only for the zero vector</>}
                                        ko={<>조항 1. 양수이고, 영벡터일 때만 0이 된다</>}/>],
                    ["x + y = (4, -4)^\\top", <T en={<>clause 2: the direct route is shorter than going through the origin, <InlineMath math={"5.66 \\le 6"}/></>}
                                                ko={<>조항 2. 곧장 가는 편이 원점을 거치는 것보다 짧다. <InlineMath math={"5.66 \\le 6"}/>이다</>}/>],
                    ["-2x = (-6, 8)^\\top", <T en={<>clause 3: <InlineMath math={"10 = |-2| \\cdot 5"}/>, and the minus sign does not shorten anything</>}
                                              ko={<>조항 3. <InlineMath math={"10 = |-2| \\cdot 5"}/>이고, 마이너스 부호가 길이를 줄이지는 않는다</>}/>],
                ]}/>
            </Example>
            <Example n="3.2" title={<T en={<>The norms this course actually uses</>} ko={<>이 과목이 실제로 쓰는 norm들</>}/>}>
                <T
                    en={<p>
                        On <InlineMath math={"\\mathcal{X} = \\mathcal{F}^n"}/> with{" "}
                        <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/> or{" "}
                        <InlineMath math={"\\mathbb{C}"}/>:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/> 또는{" "}
                        <InlineMath math={"\\mathbb{C}"}/>에 대해{" "}
                        <InlineMath math={"\\mathcal{X} = \\mathcal{F}^n"}/>에서는
                    </p>}
                />
                <BlockMath math={"\\|x\\|_2 := \\left( \\sum_{i=1}^{n} |x_i|^2 \\right)^{\\frac{1}{2}}, \\qquad \\|x\\|_p := \\left( \\sum_{i=1}^{n} |x_i|^p \\right)^{\\frac{1}{p}}, \\qquad \\|x\\|_\\infty := \\max_{1 \\le i \\le n} |x_i|"}/>
                <Terms items={[
                    ["x_i", <T en={<>the <InlineMath math={"i"}/>-th entry of the column <InlineMath math={"x"}/></>}
                              ko={<>열 <InlineMath math={"x"}/>의 <InlineMath math={"i"}/>번째 성분</>}/>],
                    ["\\|x\\|_2", <T en={<>the Euclidean norm or 2-norm: the one that comes from an inner product, and the only one this chapter can differentiate</>}
                                    ko={<>유클리드 norm, 곧 2-norm. 내적에서 나오는 유일한 norm이고, 이 장에서 미분할 수 있는 것도 이것뿐이다</>}/>],
                    ["\\|x\\|_p", <T en={<>the <InlineMath math={"p"}/>-norm, defined for <InlineMath math={"1 \\le p < \\infty"}/></>}
                                    ko={<><InlineMath math={"1 \\le p < \\infty"}/>에서 정의되는 <InlineMath math={"p"}/>-norm</>}/>],
                    ["\\|x\\|_\\infty", <T en={<>the max-norm, also written sup-norm: the worst single entry</>}
                                          ko={<>max-norm. sup-norm이라고도 쓰며, 성분 중 가장 나쁜 하나다</>}/>],
                ]}/>
                <T
                    en={<p>
                        On <InlineMath math={"\\mathcal{X} = \\{f : [a,b] \\to \\mathbb{R} \\mid f \\text{ continuous}\\}"}/>{" "}
                        over <InlineMath math={"\\mathbb{R}"}/>, the same three definitions survive with the
                        sum replaced by an integral:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathbb{R}"}/> 위의{" "}
                        <InlineMath math={"\\mathcal{X} = \\{f : [a,b] \\to \\mathbb{R} \\mid f \\text{ continuous}\\}"}/>에서는
                        합을 적분으로 바꾸기만 하면 같은 정의 셋이 그대로 살아남는다.
                    </p>}
                />
                <BlockMath math={"\\|f\\|_2 := \\left( \\int_a^b |f(t)|^2 \\, \\mathrm{d}t \\right)^{\\frac{1}{2}}, \\qquad \\|f\\|_\\infty := \\max_{a \\le t \\le b} |f(t)| = \\sup_{a \\le t \\le b} |f(t)|"}/>
                <Terms items={[
                    ["f", <T en={<>one vector of this space: a whole continuous function, not a number</>}
                            ko={<>이 공간의 벡터 하나. 수가 아니라 연속 함수 한 개다</>}/>],
                    ["[a, b]", <T en={<>a closed bounded interval with <InlineMath math={"a < b < \\infty"}/></>}
                                 ko={<><InlineMath math={"a < b < \\infty"}/>인 유계 닫힌 구간</>}/>],
                    ["\\|f\\|_2", <T en={<>the energy of the signal, the norm used when you fit a curve to data</>}
                                    ko={<>신호의 에너지. 데이터에 곡선을 맞출 때 쓰는 norm이다</>}/>],
                    ["\\|f\\|_\\infty", <T en={<>the worst-case deviation: the norm a safety argument uses</>}
                                          ko={<>최악의 편차. 안전성 논증이 쓰는 norm이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        For <InlineMath math={"x = (3, -4)^\\top"}/> the four numbers are genuinely different,
                        and every one of them is a legitimate answer to "how big is <InlineMath math={"x"}/>":
                    </p>}
                    ko={<p>
                        <InlineMath math={"x = (3, -4)^\\top"}/>에서 네 값은 확실히 다르고, 그중 어느 것도{" "}
                        "<InlineMath math={"x"}/>가 얼마나 큰가"에 대한 정당한 답이다.
                    </p>}
                />
                <table className="table-center">
                    <thead>
                    <tr>
                        <th><InlineMath math={"p"}/></th>
                        <th><InlineMath math={"\\|x\\|_p"}/></th>
                        <th>{t("value", "값")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><InlineMath math={"1"}/></td>
                        <td><InlineMath math={"|3| + |-4|"}/></td>
                        <td><InlineMath math={"7"}/></td>
                    </tr>
                    <tr>
                        <td><InlineMath math={"2"}/></td>
                        <td><InlineMath math={"\\sqrt{9 + 16}"}/></td>
                        <td><InlineMath math={"5"}/></td>
                    </tr>
                    <tr>
                        <td><InlineMath math={"3"}/></td>
                        <td><InlineMath math={"(27 + 64)^{1/3}"}/></td>
                        <td><InlineMath math={"\\approx 4.498"}/></td>
                    </tr>
                    <tr>
                        <td><InlineMath math={"\\infty"}/></td>
                        <td><InlineMath math={"\\max\\{3, 4\\}"}/></td>
                        <td><InlineMath math={"4"}/></td>
                    </tr>
                    </tbody>
                </table>
            </Example>
            <Example title={<T en={<>Two non-examples, each failing exactly one clause</>}
                              ko={<>조항 하나씩만 어기는 반례 둘</>}/>}>
                <T
                    en={<p>
                        Both candidates below are defined on <InlineMath math={"\\mathbb{R}^2"}/> and look
                        harmless. Checking the clauses one at a time is what exposes them.
                    </p>}
                    ko={<p>
                        아래 두 후보는 모두 <InlineMath math={"\\mathbb{R}^2"}/> 위에서 정의되고 겉보기에는
                        멀쩡하다. 조항을 하나씩 확인해야 정체가 드러난다.
                    </p>}
                />
                <BlockMath math={"\\rho_1(x) := |x_1|, \\qquad \\rho_2(x) := x_1^2 + x_2^2"}/>
                <Terms items={[
                    ["\\rho_1", <T en={<>reads only the first entry and ignores the second</>}
                                  ko={<>첫 성분만 읽고 둘째는 무시한다</>}/>],
                    ["\\rho_2", <T en={<>the square of the Euclidean norm, with the square root forgotten</>}
                                  ko={<>유클리드 norm의 제곱. 제곱근을 잊은 것이다</>}/>],
                    ["x_1, x_2", <T en={<>the two entries of <InlineMath math={"x \\in \\mathbb{R}^2"}/></>}
                                   ko={<><InlineMath math={"x \\in \\mathbb{R}^2"}/>의 두 성분</>}/>],
                ]}/>
                <T
                    en={<p>
                        <InlineMath math={"\\rho_1"}/> satisfies clauses 2 and 3, and fails the second half of
                        clause 1: <InlineMath math={"\\rho_1((0,1)^\\top) = 0"}/> although{" "}
                        <InlineMath math={"(0,1)^\\top \\neq 0"}/>. A function like this is called a
                        seminorm, and it is not useless, but it cannot tell two vectors apart.{" "}
                        <InlineMath math={"\\rho_2"}/> satisfies clause 1 and fails clause 3:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\rho_1"}/>은 조항 2와 3을 만족하고 조항 1의 뒷부분에서 무너진다.{" "}
                        <InlineMath math={"(0,1)^\\top \\neq 0"}/>인데도{" "}
                        <InlineMath math={"\\rho_1((0,1)^\\top) = 0"}/>이다. 이런 함수를 seminorm이라 부르며
                        쓸모가 없지는 않지만 두 벡터를 구별하지 못한다.{" "}
                        <InlineMath math={"\\rho_2"}/>는 조항 1을 만족하고 조항 3에서 무너진다.
                    </p>}
                />
                <BlockMath math={"\\rho_2(2x) = (2x_1)^2 + (2x_2)^2 = 4\\,\\rho_2(x) \\neq |2| \\cdot \\rho_2(x) \\quad \\text{unless } \\rho_2(x) = 0"}/>
                <Terms items={[
                    ["\\rho_2(2x)", <T en={<>scaling by 2 multiplies this quantity by 4, not by 2</>}
                                      ko={<>2배 하면 이 양은 2배가 아니라 4배가 된다</>}/>],
                    ["4\\,\\rho_2(x)", <T en={<>the failure of clause 3, which is exactly why the square root in <InlineMath math={"\\|x\\|_2"}/> is not decoration</>}
                                         ko={<>조항 3이 깨지는 지점. <InlineMath math={"\\|x\\|_2"}/>의 제곱근이 장식이 아닌 이유가 이것이다</>}/>],
                ]}/>
            </Example>
            <Definition n="3.3" title={<T en={<>Normed space</>} ko={<>normed space</>}/>}>
                <T
                    en={<p>
                        The triple <InlineMath math={"(\\mathcal{X}, \\mathcal{F}, \\|\\cdot\\|)"}/> is called
                        a <strong>normed space</strong>. Note that the norm is part of the data: the same set
                        of vectors carries many different normed spaces, and which one you pick changes what
                        the word "best" means.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F}, \\|\\cdot\\|)"}/>을{" "}
                        <strong>normed space</strong>라 한다. norm이 데이터의 일부라는 점을 놓치면 안 된다.
                        같은 벡터 집합 위에 서로 다른 normed space가 여럿 얹히고, 어느 것을 고르느냐가 "최선"이라는
                        말의 뜻을 바꾼다.
                    </p>}
                />
            </Definition>
            <Definition n="3.4" title={<T en={<>Distance, distance to a set, best approximation</>}
                                          ko={<>거리, 집합까지의 거리, 최선의 근사</>}/>}>
                <T
                    en={<p>
                        For <InlineMath math={"x, y \\in \\mathcal{X}"}/> and a subset{" "}
                        <InlineMath math={"S \\subset \\mathcal{X}"}/>:
                    </p>}
                    ko={<p>
                        <InlineMath math={"x, y \\in \\mathcal{X}"}/>와 부분집합{" "}
                        <InlineMath math={"S \\subset \\mathcal{X}"}/>에 대해
                    </p>}
                />
                <BlockMath math={"d(x, y) := \\|x - y\\|, \\qquad d(x, S) := \\inf_{y \\in S} \\|x - y\\|"}/>
                <Terms items={[
                    ["d(x, y)", <T en={<>the distance from <InlineMath math={"x"}/> to <InlineMath math={"y"}/>; symmetric, since <InlineMath math={"\\|x - y\\| = |-1| \\cdot \\|y - x\\|"}/></>}
                                  ko={<><InlineMath math={"x"}/>에서 <InlineMath math={"y"}/>까지의 거리. <InlineMath math={"\\|x - y\\| = |-1| \\cdot \\|y - x\\|"}/>이므로 대칭이다</>}/>],
                    ["S", <T en={<>any subset of <InlineMath math={"\\mathcal{X}"}/>, not necessarily a subspace</>}
                            ko={<><InlineMath math={"\\mathcal{X}"}/>의 임의의 부분집합. 부분 공간이 아니어도 된다</>}/>],
                    ["\\inf", <T en={<>the greatest lower bound from Chapter 1: it exists whenever the set of distances is nonempty and bounded below, which it always is</>}
                                ko={<>1장의 greatest lower bound. 거리들의 집합이 공집합이 아니고 아래로 유계이면 존재하는데, 여기서는 언제나 그렇다</>}/>],
                ]}/>
                <T
                    en={<p>
                        If there is an <InlineMath math={"x^* \\in S"}/> with{" "}
                        <InlineMath math={"d(x, S) = \\|x - x^*\\|"}/>, then{" "}
                        <InlineMath math={"x^*"}/> is called a <strong>best approximation of{" "}
                        <InlineMath math={"x"}/> by elements of <InlineMath math={"S"}/></strong>. The
                        infimum always exists; the minimizer that achieves it need not.
                    </p>}
                    ko={<p>
                        <InlineMath math={"d(x, S) = \\|x - x^*\\|"}/>인{" "}
                        <InlineMath math={"x^* \\in S"}/>가 있으면 그것을{" "}
                        <strong><InlineMath math={"S"}/>의 원소로 <InlineMath math={"x"}/>를 근사하는 최선의
                        근사</strong>라 한다. infimum은 언제나 존재하지만, 그 값을 실제로 달성하는 최소화 벡터는
                        없을 수도 있다.
                    </p>}
                />
            </Definition>
            <Remark n="3.5" title={<T en={<>The three questions this chapter answers</>}
                                      ko={<>이 장이 답하는 세 질문</>}/>}>
                <T
                    en={<ol>
                        <li>When does a best approximation <InlineMath math={"x^*"}/> exist?</li>
                        <li>How do you characterize, and then actually compute,{" "}
                            <InlineMath math={"x^*"}/> such that{" "}
                            <InlineMath math={"\\|x - x^*\\| = d(x, S)"}/> with{" "}
                            <InlineMath math={"x^* \\in S"}/>?</li>
                        <li>If a solution exists, is it unique?</li>
                    </ol>}
                    ko={<ol>
                        <li>최선의 근사 <InlineMath math={"x^*"}/>는 언제 존재하는가?</li>
                        <li><InlineMath math={"x^* \\in S"}/>이면서{" "}
                            <InlineMath math={"\\|x - x^*\\| = d(x, S)"}/>인{" "}
                            <InlineMath math={"x^*"}/>를 어떻게 특징짓고, 나아가 실제로 계산하는가?</li>
                        <li>해가 있다면 유일한가?</li>
                    </ol>}
                />
                <T
                    en={<p>
                        Each of the three has a norm-dependent answer. The plan is to narrow to norms that
                        come from an inner product, where all three answers are yes, a right angle, and yes.
                    </p>}
                    ko={<p>
                        셋 다 어떤 norm을 쓰느냐에 따라 답이 달라진다. 계획은 내적에서 나오는 norm으로 범위를
                        좁히는 것이고, 그 안에서는 세 답이 각각 "그렇다", "직각", "그렇다"가 된다.
                    </p>}
                />
            </Remark>
            <Remark n="3.6" title={<T en={<>Reading <InlineMath math={"\\operatorname{arg\\,min}"}/>, and naming the error</>}
                                      ko={<><InlineMath math={"\\operatorname{arg\\,min}"}/> 읽는 법과 오차의 이름</>}/>}>
                <BlockMath math={"x^* := \\operatorname*{arg\\,min}_{y \\in S} \\|x - y\\|, \\qquad e := x - y"}/>
                <Terms items={[
                    ["\\operatorname{arg\\,min}", <T en={<>the <em>argument</em> that achieves the minimum, not the minimum value itself: <InlineMath math={"\\min"}/> is a number in <InlineMath math={"\\mathbb{R}"}/>, <InlineMath math={"\\operatorname{arg\\,min}"}/> is a vector in <InlineMath math={"S"}/></>}
                                                    ko={<>최솟값이 아니라 그 최솟값을 달성하는 <em>인자</em>. <InlineMath math={"\\min"}/>은 <InlineMath math={"\\mathbb{R}"}/>의 수이고, <InlineMath math={"\\operatorname{arg\\,min}"}/>은 <InlineMath math={"S"}/>의 벡터다</>}/>],
                    ["e", <T en={<>the error committed by approximating <InlineMath math={"x"}/> with <InlineMath math={"y \\in S"}/></>}
                            ko={<><InlineMath math={"y \\in S"}/>로 <InlineMath math={"x"}/>를 근사할 때 생기는 오차</>}/>],
                    ["\\|e\\|", <T en={<>the size of that error, and <InlineMath math={"\\inf_{y \\in S}\\|e\\|"}/> is the smallest it can be made</>}
                                  ko={<>그 오차의 크기. <InlineMath math={"\\inf_{y \\in S}\\|e\\|"}/>이 만들 수 있는 가장 작은 값이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Writing <InlineMath math={"x^* := \\operatorname{arg\\,min}"}/> with an equals sign
                        quietly claims two things: that the infimum is achieved, so it may be written{" "}
                        <InlineMath math={"\\min"}/>, and that the minimizer is unique. When only the first
                        holds the honest notation is{" "}
                        <InlineMath math={"x^* \\in \\operatorname{arg\\,min}"}/>. Engineering papers rarely
                        take that much care, and the next remark shows what it costs.
                    </p>}
                    ko={<p>
                        <InlineMath math={"x^* := \\operatorname{arg\\,min}"}/>처럼 등호로 적는 것은 두 가지를
                        조용히 주장하는 일이다. infimum이 달성되어 <InlineMath math={"\\min"}/>이라 써도 된다는
                        것, 그리고 최소화 벡터가 유일하다는 것이다. 앞의 것만 성립할 때 정직한 표기는{" "}
                        <InlineMath math={"x^* \\in \\operatorname{arg\\,min}"}/>이다. 공학 논문은 그 정도로
                        조심하는 일이 드문데, 그 대가가 무엇인지는 바로 다음 참고가 보여 준다.
                    </p>}
                />
            </Remark>
            <T
                en={<p>
                    Before proving anything it is worth looking at what the choice of norm does to the shape
                    of the problem. The set <InlineMath math={"\\{x : \\|x\\| \\le 1\\}"}/>, the unit ball,
                    is the whole story: distance is measured by how far you have to inflate that shape to
                    reach a point.
                </p>}
                ko={<p>
                    무엇을 증명하기 전에, norm의 선택이 문제의 모양을 어떻게 바꾸는지 보아 두면 좋다. 집합{" "}
                    <InlineMath math={"\\{x : \\|x\\| \\le 1\\}"}/>, 곧 단위구가 전부다. 거리란 어떤 점에
                    닿기까지 그 모양을 얼마나 부풀려야 하는지다.
                </p>}
            />
            <CanvasFigure label={t("Unit balls of the p-norms, and the two circles that trap them",
                "p-norm의 단위구와 그것을 가두는 두 원")}
                          modal={<NormBallExplorer width={720} height={430}/>}
                          bodyClassName="w-[min(94vw,760px)]">
                <NormBallExplorer/>
            </CanvasFigure>
            <T
                en={<p>
                    Two facts the figure makes visible. First, the balls are all convex and all contain the
                    axes points <InlineMath math={"(\\pm 1, 0)"}/> and{" "}
                    <InlineMath math={"(0, \\pm 1)"}/>, so no p-norm can be wildly different from another.
                    Second, and this is the fact that matters later, each ball sits between two circles, so
                    any two of these norms bound each other up to a constant.
                </p>}
                ko={<p>
                    그림이 보여 주는 사실은 둘이다. 첫째, 단위구는 전부 볼록하고 축 위의 점{" "}
                    <InlineMath math={"(\\pm 1, 0)"}/>과 <InlineMath math={"(0, \\pm 1)"}/>을 모두 지난다.
                    어떤 p-norm도 다른 것과 터무니없이 달라질 수 없다는 뜻이다. 둘째, 뒤에서 중요해지는 사실인데,
                    각 단위구는 두 원 사이에 놓이므로 이 norm들은 서로를 상수배로 가둔다.
                </p>}
            />
            <Remark title={<T en={<>All norms on a finite-dimensional space are equivalent</>}
                              ko={<>유한 차원 공간의 norm은 모두 동치다</>}/>}>
                <T
                    en={<p>
                        Two norms <InlineMath math={"\\|\\cdot\\|_a"}/> and{" "}
                        <InlineMath math={"\\|\\cdot\\|_b"}/> on the same space are{" "}
                        <strong>equivalent</strong> when there are constants{" "}
                        <InlineMath math={"0 < c_1 \\le c_2"}/> with{" "}
                        <InlineMath math={"c_1 \\|x\\|_b \\le \\|x\\|_a \\le c_2 \\|x\\|_b"}/> for every{" "}
                        <InlineMath math={"x"}/>. On <InlineMath math={"\\mathbb{R}^2"}/> the constants can
                        be read straight off the picture:
                    </p>}
                    ko={<p>
                        같은 공간 위의 두 norm <InlineMath math={"\\|\\cdot\\|_a"}/>와{" "}
                        <InlineMath math={"\\|\\cdot\\|_b"}/>가 모든 <InlineMath math={"x"}/>에 대해{" "}
                        <InlineMath math={"c_1 \\|x\\|_b \\le \\|x\\|_a \\le c_2 \\|x\\|_b"}/>를 만족하는 상수{" "}
                        <InlineMath math={"0 < c_1 \\le c_2"}/>를 가지면 <strong>동치</strong>라 한다.{" "}
                        <InlineMath math={"\\mathbb{R}^2"}/>에서는 그 상수를 그림에서 바로 읽을 수 있다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} \\|x\\|_\\infty &\\le \\|x\\|_2 \\le \\sqrt{2}\\,\\|x\\|_\\infty \\\\ \\|x\\|_2 &\\le \\|x\\|_1 \\le \\sqrt{2}\\,\\|x\\|_2 \\\\ \\|x\\|_\\infty &\\le \\|x\\|_1 \\le 2\\,\\|x\\|_\\infty \\end{aligned}"}/>
                <Terms items={[
                    ["\\sqrt{2}", <T en={<>the ratio between the inscribed and circumscribed circles of the diamond and the square in the figure, and the worst case is <InlineMath math={"x = (1,1)^\\top"}/></>}
                                    ko={<>그림에서 마름모와 정사각형의 내접원과 외접원 반지름의 비. 최악의 경우는 <InlineMath math={"x = (1,1)^\\top"}/>이다</>}/>],
                    ["c_1, c_2", <T en={<>the constants the figure draws as the two dashed circles</>}
                                   ko={<>그림에서 점선 원 두 개로 그려지는 상수들</>}/>],
                ]}/>
                <T
                    en={<p>
                        The general statement is that on a <em>finite-dimensional</em> space every pair of
                        norms is equivalent, so a sequence that converges in one norm converges in all of
                        them. These notes state it here and prove it in the real analysis material, where the
                        argument needs compactness of the unit sphere. On infinite-dimensional spaces it is
                        false, which is why Chapter 6 has to be careful about which norm it uses.
                    </p>}
                    ko={<p>
                        일반적인 진술은 <em>유한 차원</em> 공간에서는 어떤 두 norm도 동치라는 것이다. 그래서
                        한 norm에서 수렴하는 수열은 모든 norm에서 수렴한다. 여기서는 진술만 두고, 증명은 단위구면의
                        컴팩트성을 쓰는 실해석 부분으로 미룬다. 무한 차원 공간에서는 거짓이고, 6장이 어떤 norm을
                        쓰는지 조심하는 이유가 그것이다.
                    </p>}
                />
            </Remark>
            <Proposition n="3.9" title={<T en={<>Why <InlineMath math={"\\infty"}/> is the right name for the max-norm</>}
                                           ko={<>max-norm에 <InlineMath math={"\\infty"}/>라는 이름이 붙는 이유</>}/>}>
                <T
                    en={<p>
                        For every <InlineMath math={"x \\in \\mathbb{R}^n"}/>,
                    </p>}
                    ko={<p>
                        모든 <InlineMath math={"x \\in \\mathbb{R}^n"}/>에 대해
                    </p>}
                />
                <BlockMath math={"\\lim_{p \\to \\infty} \\|x\\|_p = \\|x\\|_\\infty = \\max_{1 \\le i \\le n} |x_i|"}/>
                <Terms items={[
                    ["p", <T en={<>the exponent in the <InlineMath math={"p"}/>-norm, sent to infinity</>}
                            ko={<><InlineMath math={"p"}/>-norm의 지수. 무한대로 보낸다</>}/>],
                    ["n", <T en={<>the dimension, held fixed while <InlineMath math={"p"}/> grows</>}
                            ko={<>차원. <InlineMath math={"p"}/>가 커지는 동안 고정한다</>}/>],
                    ["\\|x\\|_\\infty", <T en={<>the largest entry in absolute value: the limit the notation is naming</>}
                                          ko={<>절댓값이 가장 큰 성분. 기호가 가리키는 극한이다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            The notes leave this as an exercise with hints. Here is the argument in full.
                            Write <InlineMath math={"m := \\|x\\|_\\infty"}/> and note that{" "}
                            <InlineMath math={"x = 0"}/> makes both sides zero, so assume{" "}
                            <InlineMath math={"m > 0"}/>. Every term of the sum is at most{" "}
                            <InlineMath math={"m^p"}/>, and at least one of them equals{" "}
                            <InlineMath math={"m^p"}/>, so the sum is squeezed between one copy and{" "}
                            <InlineMath math={"n"}/> copies:
                        </p>}
                        ko={<p>
                            원 교재는 힌트만 주고 연습 문제로 남긴다. 여기 논증 전체를 적는다.{" "}
                            <InlineMath math={"m := \\|x\\|_\\infty"}/>라 두자.{" "}
                            <InlineMath math={"x = 0"}/>이면 양변이 0이므로{" "}
                            <InlineMath math={"m > 0"}/>이라 하자. 합의 각 항은 많아야{" "}
                            <InlineMath math={"m^p"}/>이고 그중 적어도 하나는 정확히{" "}
                            <InlineMath math={"m^p"}/>이므로, 합은 한 개분과{" "}
                            <InlineMath math={"n"}/>개분 사이에 끼인다.
                        </p>}
                    />
                    <BlockMath math={"m^p \\;\\le\\; \\sum_{i=1}^{n} |x_i|^p \\;\\le\\; n \\, m^p"}/>
                    <Terms items={[
                        ["m^p", <T en={<>the contribution of one entry that attains the maximum</>}
                                  ko={<>최댓값을 달성하는 성분 하나가 내는 몫</>}/>],
                        ["n \\, m^p", <T en={<>what the sum would be if every entry were as large as the largest</>}
                                        ko={<>모든 성분이 최대만큼 컸다면 합이 되었을 값</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Raising an inequality between positive numbers to the power{" "}
                            <InlineMath math={"1/p > 0"}/> preserves it, so
                        </p>}
                        ko={<p>
                            양수 사이의 부등식을 <InlineMath math={"1/p > 0"}/>제곱해도 방향이 유지되므로
                        </p>}
                    />
                    <BlockMath math={"m \\;\\le\\; \\|x\\|_p \\;\\le\\; n^{1/p} \\, m"}/>
                    <Terms items={[
                        ["n^{1/p}", <T en={<>the only <InlineMath math={"p"}/>-dependent factor left, and it tends to <InlineMath math={"1"}/> because <InlineMath math={"\\lim_{p \\to \\infty} \\sqrt[p]{a} = 1"}/> for every <InlineMath math={"a > 0"}/></>}
                                      ko={<><InlineMath math={"p"}/>에 의존하는 유일한 인자. 모든 <InlineMath math={"a > 0"}/>에 대해 <InlineMath math={"\\lim_{p \\to \\infty} \\sqrt[p]{a} = 1"}/>이므로 <InlineMath math={"1"}/>로 간다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Both bounds tend to <InlineMath math={"m"}/>, so the squeeze forces{" "}
                            <InlineMath math={"\\|x\\|_p \\to m"}/>. Concretely, for{" "}
                            <InlineMath math={"x = (3, -4)^\\top"}/> the values{" "}
                            <InlineMath math={"7, 5, 4.498, \\ldots"}/> from the table above are walking down
                            to <InlineMath math={"4"}/>, and at <InlineMath math={"p = 20"}/> the value is
                            already <InlineMath math={"\\approx 4.010"}/>.
                        </p>}
                        ko={<p>
                            두 경계가 모두 <InlineMath math={"m"}/>으로 가므로 squeeze에 의해{" "}
                            <InlineMath math={"\\|x\\|_p \\to m"}/>이다. 구체적으로{" "}
                            <InlineMath math={"x = (3, -4)^\\top"}/>에서는 위 표의 값{" "}
                            <InlineMath math={"7, 5, 4.498, \\ldots"}/>이 <InlineMath math={"4"}/>로 내려가고,{" "}
                            <InlineMath math={"p = 20"}/>에서 이미 <InlineMath math={"\\approx 4.010"}/>이다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Remark n="3.8" title={<T en={<>The best approximation need not be unique</>}
                                      ko={<>최선의 근사가 유일하지 않을 수 있다</>}/>}>
                <T
                    en={<p>
                        Nothing so far promises one answer. Take{" "}
                        <InlineMath math={"\\mathcal{X} = \\mathbb{R}^2"}/> with the{" "}
                        <InlineMath math={"1"}/>-norm, the subspace{" "}
                        <InlineMath math={"M = \\{(m_1, -m_1)^\\top \\mid m_1 \\in \\mathbb{R}\\}"}/>, and the
                        point <InlineMath math={"x = (1, 1)^\\top"}/>. Compute the distance to a general
                        element of <InlineMath math={"M"}/>:
                    </p>}
                    ko={<p>
                        지금까지의 어떤 것도 답이 하나라고 약속하지 않는다.{" "}
                        <InlineMath math={"\\mathcal{X} = \\mathbb{R}^2"}/>에{" "}
                        <InlineMath math={"1"}/>-norm을 얹고, 부분 공간{" "}
                        <InlineMath math={"M = \\{(m_1, -m_1)^\\top \\mid m_1 \\in \\mathbb{R}\\}"}/>과 점{" "}
                        <InlineMath math={"x = (1, 1)^\\top"}/>을 잡자.{" "}
                        <InlineMath math={"M"}/>의 일반 원소까지의 거리를 계산해 보면
                    </p>}
                />
                <BlockMath math={"\\|x - m\\|_1 = |1 - m_1| + |1 + m_1| = \\begin{cases} 2 & -1 \\le m_1 \\le 1 \\\\ 2|m_1| & \\text{otherwise} \\end{cases}"}/>
                <Terms items={[
                    ["m = (m_1, -m_1)^\\top", <T en={<>a general element of <InlineMath math={"M"}/>, swept by the single parameter <InlineMath math={"m_1"}/></>}
                                                ko={<><InlineMath math={"M"}/>의 일반 원소. 매개변수 <InlineMath math={"m_1"}/> 하나로 훑는다</>}/>],
                    ["|1 - m_1| + |1 + m_1|", <T en={<>the 1-norm of the error <InlineMath math={"x - m = (1 - m_1,\\, 1 + m_1)^\\top"}/></>}
                                                ko={<>오차 <InlineMath math={"x - m = (1 - m_1,\\, 1 + m_1)^\\top"}/>의 1-norm</>}/>],
                    ["2", <T en={<>the value on the whole segment <InlineMath math={"-1 \\le m_1 \\le 1"}/>, where the two absolute values cancel each other's slope</>}
                            ko={<>구간 <InlineMath math={"-1 \\le m_1 \\le 1"}/> 전체에서의 값. 두 절댓값의 기울기가 서로 상쇄된다</>}/>],
                ]}/>
                <T
                    en={<p>
                        So <InlineMath math={"d(x, M) = 2"}/> and the set of minimizers is the entire segment{" "}
                        <InlineMath math={"\\{(m_1, -m_1)^\\top \\mid |m_1| \\le 1\\}"}/>, an uncountable
                        set. The <InlineMath math={"1"}/>-norm is not <em>strict</em>, and that is the
                        property the rest of this chapter buys by insisting on a norm that comes from an
                        inner product. In the 2-norm the same problem has exactly one answer.
                    </p>}
                    ko={<p>
                        따라서 <InlineMath math={"d(x, M) = 2"}/>이고, 최소화 벡터들의 집합은 구간{" "}
                        <InlineMath math={"\\{(m_1, -m_1)^\\top \\mid |m_1| \\le 1\\}"}/> 전체, 곧 비가산 집합이다.{" "}
                        <InlineMath math={"1"}/>-norm은 <em>strict</em>하지 않으며, 이 장의 나머지가 내적에서
                        나오는 norm을 고집해서 사 오는 성질이 바로 그것이다. 2-norm에서는 같은 문제의 답이 정확히
                        하나다.
                    </p>}
                />
            </Remark>
            <T
                en={<p>
                    That settles what a ruler is and what it cannot do on its own. A norm alone gives no
                    notion of direction, so it cannot say that two vectors are perpendicular, and without
                    that word there is no way to characterize a minimizer by a right angle. The next section
                    adds the missing structure.
                </p>}
                ko={<p>
                    자가 무엇이고 자 혼자서는 무엇을 못 하는지가 여기까지다. norm만으로는 방향이라는 개념이 없어서
                    두 벡터가 수직이라고 말할 수 없고, 그 말이 없으면 최소화 벡터를 직각으로 특징지을 방법도 없다.
                    다음 절이 그 빠진 구조를 채운다.
                </p>}
            />

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Inner Product Spaces</h2>} ko={<h2>내적 공간</h2>}/>
            <T
                en={<p>
                    The dot product on <InlineMath math={"\\mathbb{R}^n"}/> does two jobs at once. It
                    produces lengths, through <InlineMath math={"\\|x\\|^2 = x^\\top x"}/>, and it produces
                    angles, through <InlineMath math={"x^\\top y = \\|x\\| \\|y\\| \\cos \\theta"}/>. An
                    inner product is that operation stripped down to the properties that make both jobs
                    work, so that they keep working on matrices, on polynomials, and on functions.
                </p>}
                ko={<p>
                    <InlineMath math={"\\mathbb{R}^n"}/>의 dot product는 두 가지 일을 동시에 한다.{" "}
                    <InlineMath math={"\\|x\\|^2 = x^\\top x"}/>로 길이를 만들고,{" "}
                    <InlineMath math={"x^\\top y = \\|x\\| \\|y\\| \\cos \\theta"}/>로 각도를 만든다. 내적은 그
                    연산에서 두 일이 성립하게 하는 성질만 남긴 것이고, 그래서 행렬에서도 다항식에서도 함수에서도
                    그대로 작동한다.
                </p>}
            />
            <Remark n="3.10" title={<T en={<>Complex numbers, only what is needed</>} ko={<>복소수에서 필요한 것만</>}/>}>
                <T
                    en={<p>
                        For <InlineMath math={"z = \\alpha + j\\beta \\in \\mathbb{C}"}/> with{" "}
                        <InlineMath math={"\\alpha, \\beta \\in \\mathbb{R}"}/>:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\alpha, \\beta \\in \\mathbb{R}"}/>인{" "}
                        <InlineMath math={"z = \\alpha + j\\beta \\in \\mathbb{C}"}/>에 대해
                    </p>}
                />
                <BlockMath math={"\\overline{z} := \\alpha - j\\beta, \\qquad |z| := \\sqrt{z \\cdot \\overline{z}} = \\sqrt{\\alpha^2 + \\beta^2}, \\qquad z \\in \\mathbb{R} \\iff z = \\overline{z}"}/>
                <Terms items={[
                    ["\\overline{z}", <T en={<>the complex conjugate: flip the sign of the imaginary part</>}
                                        ko={<>켤레 복소수. 허수부의 부호를 뒤집는다</>}/>],
                    ["|z|", <T en={<>the magnitude, a non-negative real number</>}
                              ko={<>크기. 음이 아닌 실수다</>}/>],
                    ["z = \\overline{z}", <T en={<>the test for being real: also <InlineMath math={"z = 0 \\iff |z| = 0"}/></>}
                                            ko={<>실수인지 판정하는 조건. <InlineMath math={"z = 0 \\iff |z| = 0"}/>도 성립한다</>}/>],
                    ["\\operatorname{Re}\\{z\\}", <T en={<>the real part <InlineMath math={"\\alpha"}/>, and always <InlineMath math={"\\operatorname{Re}\\{z\\} \\le |z|"}/></>}
                                                    ko={<>실수부 <InlineMath math={"\\alpha"}/>. 언제나 <InlineMath math={"\\operatorname{Re}\\{z\\} \\le |z|"}/>이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        With <InlineMath math={"z = 3 + 4j"}/>:{" "}
                        <InlineMath math={"\\overline{z} = 3 - 4j"}/>,{" "}
                        <InlineMath math={"z \\overline{z} = 9 + 16 = 25"}/>,{" "}
                        <InlineMath math={"|z| = 5"}/>, and{" "}
                        <InlineMath math={"\\operatorname{Re}\\{z\\} = 3 \\le 5"}/>. Everywhere this course
                        actually computes, <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/> and every bar in
                        the definitions below can be erased.
                    </p>}
                    ko={<p>
                        <InlineMath math={"z = 3 + 4j"}/>이면{" "}
                        <InlineMath math={"\\overline{z} = 3 - 4j"}/>,{" "}
                        <InlineMath math={"z \\overline{z} = 9 + 16 = 25"}/>,{" "}
                        <InlineMath math={"|z| = 5"}/>,{" "}
                        <InlineMath math={"\\operatorname{Re}\\{z\\} = 3 \\le 5"}/>다. 이 과목이 실제로 계산하는
                        곳은 전부 <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/>이고, 아래 정의에 나오는 켤레
                        기호는 전부 지워도 된다.
                    </p>}
                />
            </Remark>
            <Definition n="3.11" title={<T en={<>Inner product</>} ko={<>내적</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\mathbb{C})"}/> be a vector space. A function{" "}
                        <InlineMath math={"\\langle \\cdot, \\cdot \\rangle : \\mathcal{X} \\times \\mathcal{X} \\to \\mathbb{C}"}/>{" "}
                        is an <strong>inner product</strong> if:
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathbb{C})"}/>이 벡터 공간이라 하자. 함수{" "}
                        <InlineMath math={"\\langle \\cdot, \\cdot \\rangle : \\mathcal{X} \\times \\mathcal{X} \\to \\mathbb{C}"}/>이
                        다음을 만족하면 <strong>내적</strong>이라 한다.
                    </p>}
                />
                <T
                    en={<ol>
                        <li><strong>Conjugate symmetry.</strong>{" "}
                            <InlineMath math={"\\langle a, b \\rangle = \\overline{\\langle b, a \\rangle}"}/>.
                            Over <InlineMath math={"\\mathbb{R}"}/> this is plain symmetry,{" "}
                            <InlineMath math={"\\langle a, b \\rangle = \\langle b, a \\rangle"}/>.</li>
                        <li><strong>Linearity in the left argument.</strong>{" "}
                            <InlineMath math={"\\langle \\alpha_1 x^1 + \\alpha_2 x^2, y \\rangle = \\alpha_1 \\langle x^1, y \\rangle + \\alpha_2 \\langle x^2, y \\rangle"}/>.
                            Some books put the linearity on the right instead; the choice is a convention.</li>
                        <li><strong>Positive definiteness.</strong>{" "}
                            <InlineMath math={"\\langle x, x \\rangle \\ge 0"}/> for every{" "}
                            <InlineMath math={"x \\in \\mathcal{X}"}/>, and{" "}
                            <InlineMath math={"\\langle x, x \\rangle = 0 \\iff x = 0"}/>. Clause 1 makes{" "}
                            <InlineMath math={"\\langle x, x \\rangle"}/> real, so comparing it to{" "}
                            <InlineMath math={"0"}/> makes sense.</li>
                    </ol>}
                    ko={<ol>
                        <li><strong>켤레 대칭.</strong>{" "}
                            <InlineMath math={"\\langle a, b \\rangle = \\overline{\\langle b, a \\rangle}"}/>이다.{" "}
                            <InlineMath math={"\\mathbb{R}"}/> 위에서는 그냥 대칭,{" "}
                            <InlineMath math={"\\langle a, b \\rangle = \\langle b, a \\rangle"}/>이 된다.</li>
                        <li><strong>왼쪽 인자에 대한 선형성.</strong>{" "}
                            <InlineMath math={"\\langle \\alpha_1 x^1 + \\alpha_2 x^2, y \\rangle = \\alpha_1 \\langle x^1, y \\rangle + \\alpha_2 \\langle x^2, y \\rangle"}/>이다.
                            선형성을 오른쪽에 두는 책도 있는데, 어느 쪽이든 규약일 뿐이다.</li>
                        <li><strong>양의 정의성.</strong> 모든{" "}
                            <InlineMath math={"x \\in \\mathcal{X}"}/>에 대해{" "}
                            <InlineMath math={"\\langle x, x \\rangle \\ge 0"}/>이고,{" "}
                            <InlineMath math={"\\langle x, x \\rangle = 0 \\iff x = 0"}/>이다. 조항 1 덕분에{" "}
                            <InlineMath math={"\\langle x, x \\rangle"}/>이 실수라서{" "}
                            <InlineMath math={"0"}/>과 비교하는 것이 말이 된다.</li>
                    </ol>}
                />
            </Definition>
            <Remark n="3.12" title={<T en={<>What clause 2 forces on the right argument</>}
                                       ko={<>조항 2가 오른쪽 인자에 강제하는 것</>}/>}>
                <T
                    en={<p>
                        Linearity was declared only on the left. Clauses 1 and 2 together decide what happens
                        on the right, and the answer is not linearity but conjugate linearity:
                    </p>}
                    ko={<p>
                        선형성은 왼쪽에만 선언했다. 조항 1과 2가 함께 오른쪽에서 일어날 일을 결정하는데, 그 답은
                        선형성이 아니라 켤레 선형성이다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} \\langle x, \\beta_1 y^1 + \\beta_2 y^2 \\rangle &= \\overline{\\langle \\beta_1 y^1 + \\beta_2 y^2, x \\rangle} \\\\ &= \\overline{\\beta_1 \\langle y^1, x \\rangle + \\beta_2 \\langle y^2, x \\rangle} \\\\ &= \\overline{\\beta_1}\\,\\overline{\\langle y^1, x \\rangle} + \\overline{\\beta_2}\\,\\overline{\\langle y^2, x \\rangle} \\\\ &= \\overline{\\beta_1} \\langle x, y^1 \\rangle + \\overline{\\beta_2} \\langle x, y^2 \\rangle \\end{aligned}"}/>
                <Terms items={[
                    ["\\beta_1, \\beta_2", <T en={<>scalars in <InlineMath math={"\\mathbb{C}"}/></>}
                                             ko={<><InlineMath math={"\\mathbb{C}"}/>의 스칼라</>}/>],
                    ["y^1, y^2", <T en={<>two vectors, the superscripts being labels</>}
                                   ko={<>벡터 둘. 위첨자는 이름표다</>}/>],
                    ["\\overline{\\beta_1}", <T en={<>the conjugate that clause 1 drags out of the bar: this is why the order of the arguments matters</>}
                                               ko={<>조항 1이 켤레 기호 밖으로 끌어내는 켤레. 인자의 순서가 중요한 이유가 이것이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Over <InlineMath math={"\\mathbb{R}"}/> every bar disappears and the identity reduces
                        to <InlineMath math={"\\langle x, \\beta_1 y^1 + \\beta_2 y^2 \\rangle = \\beta_1 \\langle x, y^1 \\rangle + \\beta_2 \\langle x, y^2 \\rangle"}/>,
                        which is the form used for the rest of the chapter.
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathbb{R}"}/> 위에서는 켤레 기호가 전부 사라져{" "}
                        <InlineMath math={"\\langle x, \\beta_1 y^1 + \\beta_2 y^2 \\rangle = \\beta_1 \\langle x, y^1 \\rangle + \\beta_2 \\langle x, y^2 \\rangle"}/>이
                        된다. 이 장의 나머지가 쓰는 형태가 이것이다.
                    </p>}
                />
            </Remark>
            <Example n="3.13" title={<T en={<>The four inner products this course uses</>}
                                        ko={<>이 과목이 쓰는 네 가지 내적</>}/>}>
                <BlockMath math={"\\langle x, y \\rangle := x^\\top \\overline{y} \\;\\; \\text{on } \\mathbb{C}^n, \\qquad \\langle x, y \\rangle := x^\\top y = \\sum_{i=1}^n x_i y_i \\;\\; \\text{on } \\mathbb{R}^n"}/>
                <Terms items={[
                    ["x^\\top \\overline{y}", <T en={<>the complex version: conjugating the second argument is what keeps <InlineMath math={"\\langle x, x \\rangle = \\sum |x_i|^2"}/> real and non-negative</>}
                                                ko={<>복소수판. 두 번째 인자에 켤레를 씌워야 <InlineMath math={"\\langle x, x \\rangle = \\sum |x_i|^2"}/>이 실수이고 음이 아니게 된다</>}/>],
                    ["x^\\top y", <T en={<>the ordinary dot product, used everywhere below</>}
                                    ko={<>보통의 dot product. 아래에서 계속 쓴다</>}/>],
                    ["n", <T en={<>the dimension of the column</>} ko={<>열의 차원</>}/>],
                ]}/>
                <BlockMath math={"\\langle A, B \\rangle := \\operatorname{tr}(AB^\\top) \\;\\; \\text{on } \\mathbb{R}^{n \\times m}, \\qquad \\langle f, g \\rangle := \\int_a^b f(t) g(t) \\, \\mathrm{d}t \\;\\; \\text{on } C[a,b]"}/>
                <Terms items={[
                    ["\\operatorname{tr}(AB^\\top)", <T en={<>the trace of <InlineMath math={"AB^\\top"}/>, which equals <InlineMath math={"\\sum_{i,j} A_{ij} B_{ij}"}/>: the dot product of the two matrices read as long columns</>}
                                                       ko={<><InlineMath math={"AB^\\top"}/>의 trace. <InlineMath math={"\\sum_{i,j} A_{ij} B_{ij}"}/>와 같으며, 두 행렬을 긴 열로 펴서 잰 dot product다</>}/>],
                    ["C[a,b]", <T en={<>the continuous real functions on <InlineMath math={"[a,b]"}/>, a vector space of infinite dimension</>}
                                 ko={<><InlineMath math={"[a,b]"}/> 위의 연속 실함수들. 무한 차원 벡터 공간이다</>}/>],
                    ["\\int_a^b f g \\, \\mathrm{d}t", <T en={<>the sum over <InlineMath math={"i"}/> replaced by a sum over a continuum of <InlineMath math={"t"}/></>}
                                                         ko={<><InlineMath math={"i"}/>에 대한 합을 <InlineMath math={"t"}/>의 연속체에 대한 합으로 바꾼 것</>}/>],
                ]}/>
                <T
                    en={<p>
                        Numbers make the last two believable. With{" "}
                        <InlineMath math={"A = \\left[\\begin{smallmatrix} 1 & 2 \\\\ 0 & 1 \\end{smallmatrix}\\right]"}/> and{" "}
                        <InlineMath math={"B = \\left[\\begin{smallmatrix} 0 & 1 \\\\ 1 & 1 \\end{smallmatrix}\\right]"}/>, and
                        with <InlineMath math={"f(t) = 1"}/>,{" "}
                        <InlineMath math={"g(t) = t"}/> on <InlineMath math={"[0,1]"}/>:
                    </p>}
                    ko={<p>
                        뒤의 둘은 숫자를 넣어야 믿어진다.{" "}
                        <InlineMath math={"A = \\left[\\begin{smallmatrix} 1 & 2 \\\\ 0 & 1 \\end{smallmatrix}\\right]"}/>,{" "}
                        <InlineMath math={"B = \\left[\\begin{smallmatrix} 0 & 1 \\\\ 1 & 1 \\end{smallmatrix}\\right]"}/>이고,{" "}
                        <InlineMath math={"[0,1]"}/>에서 <InlineMath math={"f(t) = 1"}/>,{" "}
                        <InlineMath math={"g(t) = t"}/>라 하면
                    </p>}
                />
                <BlockMath math={"\\langle A, B \\rangle = \\operatorname{tr}\\!\\begin{bmatrix} 2 & 3 \\\\ 1 & 1 \\end{bmatrix} = 3 = 1\\cdot 0 + 2 \\cdot 1 + 0 \\cdot 1 + 1 \\cdot 1, \\qquad \\langle f, g \\rangle = \\int_0^1 t \\, \\mathrm{d}t = \\tfrac{1}{2}"}/>
                <Terms items={[
                    ["AB^\\top", <T en={<>the product <InlineMath math={"\\left[\\begin{smallmatrix} 2 & 3 \\\\ 1 & 1 \\end{smallmatrix}\\right]"}/>, whose diagonal entries sum to 3</>}
                                   ko={<>곱 <InlineMath math={"\\left[\\begin{smallmatrix} 2 & 3 \\\\ 1 & 1 \\end{smallmatrix}\\right]"}/>. 대각 성분의 합이 3이다</>}/>],
                    ["\\sum_{i,j} A_{ij} B_{ij}", <T en={<>the same 3, computed entry by entry: the trace formula is bookkeeping, not magic</>}
                                                    ko={<>성분별로 계산한 같은 3. trace 공식은 마술이 아니라 장부 정리다</>}/>],
                    ["\\langle f, g \\rangle = \\tfrac{1}{2}", <T en={<>a genuine inner product of two functions, and <InlineMath math={"\\|f\\|^2 = \\int_0^1 1 \\, \\mathrm{d}t = 1"}/></>}
                                                                ko={<>두 함수의 진짜 내적. 그리고 <InlineMath math={"\\|f\\|^2 = \\int_0^1 1 \\, \\mathrm{d}t = 1"}/>이다</>}/>],
                ]}/>
            </Example>
            <Example title={<T en={<>A non-example that fails only clause 3</>} ko={<>조항 3만 어기는 반례</>}/>}>
                <T
                    en={<p>
                        On <InlineMath math={"\\mathbb{R}^2"}/> try{" "}
                        <InlineMath math={"\\langle x, y \\rangle_W := x^\\top W y"}/> with the symmetric
                        matrix below. It is symmetric and bilinear, so clauses 1 and 2 hold for free. Clause
                        3 is where it dies:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathbb{R}^2"}/>에서 아래 대칭 행렬로{" "}
                        <InlineMath math={"\\langle x, y \\rangle_W := x^\\top W y"}/>를 시도해 보자. 대칭이고
                        쌍선형이라 조항 1과 2는 공짜로 성립한다. 무너지는 곳은 조항 3이다.
                    </p>}
                />
                <BlockMath math={"W = \\begin{bmatrix} 1 & 2 \\\\ 2 & 1 \\end{bmatrix}, \\qquad x = \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix} \\;\\Longrightarrow\\; \\langle x, x \\rangle_W = 1 - 2 - 2 + 1 = -2 < 0"}/>
                <Terms items={[
                    ["W", <T en={<>a symmetric matrix whose eigenvalues are <InlineMath math={"3"}/> and <InlineMath math={"-1"}/>: the negative one is the whole problem</>}
                            ko={<>고윳값이 <InlineMath math={"3"}/>과 <InlineMath math={"-1"}/>인 대칭 행렬. 음수 쪽이 문제의 전부다</>}/>],
                    ["\\langle x, x \\rangle_W = -2", <T en={<>a "squared length" that is negative, so <InlineMath math={"\\sqrt{\\langle x, x \\rangle}"}/> is not even a real number</>}
                                                        ko={<>음수인 "길이의 제곱". <InlineMath math={"\\sqrt{\\langle x, x \\rangle}"}/>이 실수도 못 된다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Replace <InlineMath math={"W"}/> by{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 2 & -1 \\\\ -1 & 2 \\end{smallmatrix}\\right]"}/> and
                        the same recipe <em>is</em> an inner product, because that matrix has eigenvalues{" "}
                        <InlineMath math={"3"}/> and <InlineMath math={"1"}/>, both positive. The condition
                        on <InlineMath math={"W"}/> has a name, <em>positive definite</em>, and a whole
                        section of this chapter. Weighted least squares is exactly this construction: choose{" "}
                        <InlineMath math={"W"}/> and you choose which measurements the fit takes seriously.
                    </p>}
                    ko={<p>
                        <InlineMath math={"W"}/>를{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 2 & -1 \\\\ -1 & 2 \\end{smallmatrix}\\right]"}/>로
                        바꾸면 같은 방식이 <em>정말로</em> 내적이 된다. 그 행렬의 고윳값이{" "}
                        <InlineMath math={"3"}/>과 <InlineMath math={"1"}/>로 둘 다 양수이기 때문이다.{" "}
                        <InlineMath math={"W"}/>에 걸리는 이 조건에는 <em>positive definite</em>라는 이름이 있고
                        이 장에 절 하나가 통째로 배정되어 있다. weighted least squares가 정확히 이 구성이다.{" "}
                        <InlineMath math={"W"}/>를 고르는 것이 곧 어떤 측정을 진지하게 받아들일지 고르는 것이다.
                    </p>}
                />
            </Example>
            <Theorem n="3.14" title={<T en={<>Cauchy-Schwarz inequality</>} ko={<>Cauchy-Schwarz 부등식</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\mathcal{F}, \\langle \\cdot, \\cdot \\rangle)"}/> be
                        an inner product space with <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/> or{" "}
                        <InlineMath math={"\\mathbb{C}"}/>. Then for all{" "}
                        <InlineMath math={"x, y \\in \\mathcal{X}"}/>,
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/> 또는{" "}
                        <InlineMath math={"\\mathbb{C}"}/>인 내적 공간{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F}, \\langle \\cdot, \\cdot \\rangle)"}/>에서,
                        모든 <InlineMath math={"x, y \\in \\mathcal{X}"}/>에 대해
                    </p>}
                />
                <BlockMath math={"|\\langle x, y \\rangle| \\;\\le\\; \\langle x, x \\rangle^{1/2} \\langle y, y \\rangle^{1/2} \\;=\\; \\|x\\| \\, \\|y\\|"}/>
                <Terms items={[
                    ["|\\langle x, y \\rangle|", <T en={<>the magnitude of the inner product, a non-negative real number</>}
                                                   ko={<>내적의 크기. 음이 아닌 실수다</>}/>],
                    ["\\langle x, x \\rangle^{1/2}", <T en={<>the induced norm <InlineMath math={"\\|x\\|"}/>, which Corollary 3.15 shows really is a norm</>}
                                                       ko={<>유도된 norm <InlineMath math={"\\|x\\|"}/>. 그것이 실제로 norm임은 Corollary 3.15가 보인다</>}/>],
                    ["\\|x\\| \\, \\|y\\|", <T en={<>the product of the two lengths, so the inequality says <InlineMath math={"|\\cos \\theta| \\le 1"}/></>}
                                              ko={<>두 길이의 곱. 그래서 이 부등식은 <InlineMath math={"|\\cos \\theta| \\le 1"}/>이라는 말이다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            Take <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/>. If{" "}
                            <InlineMath math={"y = 0"}/> both sides are zero, so assume{" "}
                            <InlineMath math={"y \\neq 0"}/>, which gives{" "}
                            <InlineMath math={"\\langle y, y \\rangle > 0"}/> by clause 3. Let{" "}
                            <InlineMath math={"\\lambda \\in \\mathbb{R}"}/> be a scalar to be chosen and
                            expand the one thing we know is non-negative:
                        </p>}
                        ko={<p>
                            <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/>로 두자.{" "}
                            <InlineMath math={"y = 0"}/>이면 양변이 0이므로{" "}
                            <InlineMath math={"y \\neq 0"}/>이라 하자. 조항 3에 의해{" "}
                            <InlineMath math={"\\langle y, y \\rangle > 0"}/>이다. 나중에 고를 스칼라{" "}
                            <InlineMath math={"\\lambda \\in \\mathbb{R}"}/>을 두고, 음이 아님이 확실한 것 하나를
                            전개한다.
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} 0 \\;\\le\\; \\|x - \\lambda y\\|^2 &= \\langle x - \\lambda y,\\; x - \\lambda y \\rangle \\\\ &= \\langle x, x \\rangle - \\lambda \\langle x, y \\rangle - \\lambda \\langle y, x \\rangle + \\lambda^2 \\langle y, y \\rangle \\\\ &= \\langle x, x \\rangle - 2\\lambda \\langle x, y \\rangle + \\lambda^2 \\langle y, y \\rangle \\end{aligned}"}/>
                    <Terms items={[
                        ["\\lambda", <T en={<>a free real scalar; the whole trick is that the inequality holds for every choice, so we may pick the best one</>}
                                       ko={<>자유롭게 둔 실수 스칼라. 부등식이 어떤 값에서도 성립한다는 것이 요령의 전부라, 가장 좋은 값을 골라도 된다</>}/>],
                        ["\\|x - \\lambda y\\|^2", <T en={<>shorthand for <InlineMath math={"\\langle x - \\lambda y, x - \\lambda y \\rangle"}/>, non-negative by clause 3</>}
                                                     ko={<><InlineMath math={"\\langle x - \\lambda y, x - \\lambda y \\rangle"}/>의 줄임. 조항 3에 의해 음이 아니다</>}/>],
                        ["-2\\lambda \\langle x, y \\rangle", <T en={<>the two cross terms merged using symmetry, <InlineMath math={"\\langle y, x \\rangle = \\langle x, y \\rangle"}/></>}
                                                               ko={<>대칭성 <InlineMath math={"\\langle y, x \\rangle = \\langle x, y \\rangle"}/>으로 교차항 둘을 합친 것</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The right side is a quadratic in <InlineMath math={"\\lambda"}/> with positive
                            leading coefficient <InlineMath math={"\\langle y, y \\rangle"}/>, so it has a
                            minimum. Differentiate and set to zero:{" "}
                            <InlineMath math={"-2\\langle x, y \\rangle + 2\\lambda \\langle y, y \\rangle = 0"}/>,
                            so <InlineMath math={"\\lambda = \\langle x, y \\rangle / \\langle y, y \\rangle"}/>.
                            Substituting that value:
                        </p>}
                        ko={<p>
                            우변은 <InlineMath math={"\\lambda"}/>에 대한 이차식이고 최고차 계수{" "}
                            <InlineMath math={"\\langle y, y \\rangle"}/>이 양수라 최솟값을 가진다. 미분해서 0으로
                            두면 <InlineMath math={"-2\\langle x, y \\rangle + 2\\lambda \\langle y, y \\rangle = 0"}/>,
                            곧 <InlineMath math={"\\lambda = \\langle x, y \\rangle / \\langle y, y \\rangle"}/>이다.
                            그 값을 대입하면
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} 0 \\;\\le\\; \\langle x, x \\rangle - 2\\frac{\\langle x, y \\rangle^2}{\\langle y, y \\rangle} + \\frac{\\langle x, y \\rangle^2}{\\langle y, y \\rangle} = \\langle x, x \\rangle - \\frac{\\langle x, y \\rangle^2}{\\langle y, y \\rangle} \\end{aligned}"}/>
                    <Terms items={[
                        ["\\lambda^2 \\langle y, y \\rangle", <T en={<>becomes <InlineMath math={"\\langle x, y \\rangle^2 / \\langle y, y \\rangle"}/>, half of what the cross term subtracts</>}
                                                                ko={<><InlineMath math={"\\langle x, y \\rangle^2 / \\langle y, y \\rangle"}/>이 된다. 교차항이 빼는 값의 절반이다</>}/>],
                        ["\\langle y, y \\rangle", <T en={<>strictly positive, so multiplying the inequality through by it is legal and does not flip it</>}
                                                     ko={<>양수이므로 부등식 전체에 곱해도 되고 방향도 바뀌지 않는다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Multiply through by <InlineMath math={"\\langle y, y \\rangle > 0"}/> to get{" "}
                            <InlineMath math={"\\langle x, y \\rangle^2 \\le \\langle x, x \\rangle \\langle y, y \\rangle"}/>,
                            and take the square root. For{" "}
                            <InlineMath math={"\\mathcal{F} = \\mathbb{C}"}/> the same choice{" "}
                            <InlineMath math={"\\lambda = \\langle x, y \\rangle / \\langle y, y \\rangle"}/> works;
                            the three cross terms all collapse to{" "}
                            <InlineMath math={"|\\langle x, y \\rangle|^2 / \\langle y, y \\rangle"}/> and the
                            conclusion is identical with <InlineMath math={"|\\cdot|"}/> in place of the
                            square.
                        </p>}
                        ko={<p>
                            <InlineMath math={"\\langle y, y \\rangle > 0"}/>을 양변에 곱하면{" "}
                            <InlineMath math={"\\langle x, y \\rangle^2 \\le \\langle x, x \\rangle \\langle y, y \\rangle"}/>이고,
                            제곱근을 취하면 된다.{" "}
                            <InlineMath math={"\\mathcal{F} = \\mathbb{C}"}/>에서도 같은 선택{" "}
                            <InlineMath math={"\\lambda = \\langle x, y \\rangle / \\langle y, y \\rangle"}/>이
                            통한다. 교차항 셋이 모두{" "}
                            <InlineMath math={"|\\langle x, y \\rangle|^2 / \\langle y, y \\rangle"}/>으로 모이고,
                            제곱 자리에 <InlineMath math={"|\\cdot|"}/>이 들어간 같은 결론이 나온다.
                        </p>}
                    />
                    <T
                        en={<p>
                            On numbers: <InlineMath math={"x = (1, 2, 3)^\\top"}/>,{" "}
                            <InlineMath math={"y = (4, -1, 2)^\\top"}/> give{" "}
                            <InlineMath math={"\\langle x, y \\rangle = 8"}/>,{" "}
                            <InlineMath math={"\\|x\\| = \\sqrt{14}"}/>,{" "}
                            <InlineMath math={"\\|y\\| = \\sqrt{21}"}/>, and{" "}
                            <InlineMath math={"8 \\le \\sqrt{294} \\approx 17.15"}/>. The slack is real:
                            equality holds only when the two vectors are parallel.
                        </p>}
                        ko={<p>
                            숫자로 보면 <InlineMath math={"x = (1, 2, 3)^\\top"}/>,{" "}
                            <InlineMath math={"y = (4, -1, 2)^\\top"}/>에서{" "}
                            <InlineMath math={"\\langle x, y \\rangle = 8"}/>,{" "}
                            <InlineMath math={"\\|x\\| = \\sqrt{14}"}/>,{" "}
                            <InlineMath math={"\\|y\\| = \\sqrt{21}"}/>이고{" "}
                            <InlineMath math={"8 \\le \\sqrt{294} \\approx 17.15"}/>다. 여유가 꽤 남는데,
                            등호는 두 벡터가 평행할 때만 성립하기 때문이다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Corollary n="3.15" title={<T en={<>Every inner product induces a norm</>} ko={<>모든 내적은 norm을 낳는다</>}/>}>
                <BlockMath math={"\\|x\\| := \\langle x, x \\rangle^{1/2} = \\sqrt{\\langle x, x \\rangle} \\quad \\text{is a norm on } \\mathcal{X}"}/>
                <Terms items={[
                    ["\\|x\\|", <T en={<>the <strong>induced norm</strong>: from here on, an unlabelled <InlineMath math={"\\|\\cdot\\|"}/> always means this one</>}
                                  ko={<><strong>유도된 norm</strong>. 이후로 아래첨자 없는 <InlineMath math={"\\|\\cdot\\|"}/>은 늘 이것을 뜻한다</>}/>],
                    ["\\langle x, x \\rangle", <T en={<>real and non-negative by clause 3, so the square root is defined</>}
                                                 ko={<>조항 3에 의해 실수이고 음이 아니므로 제곱근이 정의된다</>}/>],
                ]}/>
                <T
                    en={<p>
                        On <InlineMath math={"\\mathbb{R}^n"}/> with the dot product this returns exactly{" "}
                        <InlineMath math={"\\|x\\|_2"}/>. The <InlineMath math={"1"}/>-norm and the max-norm
                        are <em>not</em> induced by any inner product, which is precisely why Remark 3.8 could
                        produce a whole segment of minimizers for the <InlineMath math={"1"}/>-norm.
                    </p>}
                    ko={<p>
                        dot product를 얹은 <InlineMath math={"\\mathbb{R}^n"}/>에서 이것은 정확히{" "}
                        <InlineMath math={"\\|x\\|_2"}/>를 돌려준다. <InlineMath math={"1"}/>-norm과 max-norm은
                        어떤 내적에서도 유도되지 <em>않는다</em>. Remark 3.8이{" "}
                        <InlineMath math={"1"}/>-norm에서 최소화 벡터의 구간 전체를 만들어 낼 수 있었던 이유가 바로
                        그것이다.
                    </p>}
                />
                <Proof label={t("Proof of the triangle inequality", "삼각 부등식 확인")}>
                    <T
                        en={<p>
                            Clauses 1 and 3 of Definition 3.1 are immediate from clause 3 of Definition 3.11
                            and from{" "}
                            <InlineMath math={"\\langle \\alpha x, \\alpha x \\rangle = |\\alpha|^2 \\langle x, x \\rangle"}/>.
                            Only the triangle inequality takes work. Take{" "}
                            <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/> and expand:
                        </p>}
                        ko={<p>
                            Definition 3.1의 조항 1과 3은 Definition 3.11의 조항 3과{" "}
                            <InlineMath math={"\\langle \\alpha x, \\alpha x \\rangle = |\\alpha|^2 \\langle x, x \\rangle"}/>에서
                            바로 나온다. 손이 가는 것은 삼각 부등식뿐이다.{" "}
                            <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/>로 두고 전개하면
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} \\|x + y\\|^2 &= \\langle x + y,\\; x + y \\rangle \\\\ &= \\langle x, x \\rangle + \\langle x, y \\rangle + \\langle y, x \\rangle + \\langle y, y \\rangle \\\\ &= \\|x\\|^2 + \\|y\\|^2 + 2\\langle x, y \\rangle \\\\ &\\le \\|x\\|^2 + \\|y\\|^2 + 2\\,|\\langle x, y \\rangle| \\\\ &\\le \\|x\\|^2 + \\|y\\|^2 + 2\\,\\|x\\| \\, \\|y\\| \\;=\\; (\\|x\\| + \\|y\\|)^2 \\end{aligned}"}/>
                    <Terms items={[
                        ["2\\langle x, y \\rangle", <T en={<>the cross term; it is where the whole inequality lives, and it is the term that vanishes for orthogonal vectors</>}
                                                      ko={<>교차항. 부등식의 전부가 여기에 걸려 있고, 직교하는 벡터에서는 이 항이 사라진다</>}/>],
                        ["|\\langle x, y \\rangle|", <T en={<>a real number is at most its own magnitude, which is the only step in the chain that is not an identity</>}
                                                       ko={<>실수는 자기 크기보다 클 수 없다. 이 사슬에서 항등식이 아닌 유일한 단계다</>}/>],
                        ["\\|x\\| \\, \\|y\\|", <T en={<>Cauchy-Schwarz, applied exactly once</>}
                                                  ko={<>Cauchy-Schwarz. 딱 한 번 쓰인다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Both sides are non-negative, so taking square roots gives{" "}
                            <InlineMath math={"\\|x + y\\| \\le \\|x\\| + \\|y\\|"}/>. Over{" "}
                            <InlineMath math={"\\mathbb{C}"}/> the third line reads{" "}
                            <InlineMath math={"\\|x\\|^2 + \\|y\\|^2 + 2\\operatorname{Re}\\{\\langle x, y \\rangle\\}"}/>,
                            and <InlineMath math={"\\operatorname{Re}\\{z\\} \\le |z|"}/> puts the argument
                            back on the same track.
                        </p>}
                        ko={<p>
                            양변이 음이 아니므로 제곱근을 취하면{" "}
                            <InlineMath math={"\\|x + y\\| \\le \\|x\\| + \\|y\\|"}/>이다.{" "}
                            <InlineMath math={"\\mathbb{C}"}/> 위에서는 셋째 줄이{" "}
                            <InlineMath math={"\\|x\\|^2 + \\|y\\|^2 + 2\\operatorname{Re}\\{\\langle x, y \\rangle\\}"}/>이
                            되고, <InlineMath math={"\\operatorname{Re}\\{z\\} \\le |z|"}/>이 논증을 같은 궤도로
                            되돌린다.
                        </p>}
                    />
                </Proof>
            </Corollary>
            <Definition n="3.16" title={<T en={<>Orthogonal and orthonormal</>} ko={<>직교와 orthonormal</>}/>}>
                <T
                    en={<ol>
                        <li><InlineMath math={"x"}/> and <InlineMath math={"y"}/> are{" "}
                            <strong>orthogonal</strong>, written <InlineMath math={"x \\perp y"}/>, if{" "}
                            <InlineMath math={"\\langle x, y \\rangle = 0"}/>.</li>
                        <li>A set <InlineMath math={"S"}/> is <strong>orthogonal</strong> if{" "}
                            <InlineMath math={"\\langle x, y \\rangle = 0"}/> for all{" "}
                            <InlineMath math={"x, y \\in S"}/> with{" "}
                            <InlineMath math={"x \\neq y"}/>.</li>
                        <li>If in addition <InlineMath math={"\\|x\\| = 1"}/> for every{" "}
                            <InlineMath math={"x \\in S"}/>, then <InlineMath math={"S"}/> is an{" "}
                            <strong>orthonormal</strong> set.</li>
                    </ol>}
                    ko={<ol>
                        <li><InlineMath math={"\\langle x, y \\rangle = 0"}/>이면{" "}
                            <InlineMath math={"x"}/>와 <InlineMath math={"y"}/>가{" "}
                            <strong>직교</strong>한다고 하고 <InlineMath math={"x \\perp y"}/>로 쓴다.</li>
                        <li><InlineMath math={"x \\neq y"}/>인 모든{" "}
                            <InlineMath math={"x, y \\in S"}/>에 대해{" "}
                            <InlineMath math={"\\langle x, y \\rangle = 0"}/>이면 집합{" "}
                            <InlineMath math={"S"}/>를 <strong>직교 집합</strong>이라 한다.</li>
                        <li>거기에 더해 모든 <InlineMath math={"x \\in S"}/>가{" "}
                            <InlineMath math={"\\|x\\| = 1"}/>이면 <InlineMath math={"S"}/>를{" "}
                            <strong>orthonormal</strong> 집합이라 한다.</li>
                    </ol>}
                />
                <T
                    en={<p>
                        Normalizing costs nothing: for <InlineMath math={"x \\neq 0"}/>,{" "}
                        <InlineMath math={"\\left\\| x / \\|x\\| \\right\\| = \\left| 1/\\|x\\| \\right| \\cdot \\|x\\| = 1"}/> by
                        clause 3 of Definition 3.1. So an orthogonal set of nonzero vectors is one division
                        away from being orthonormal.
                    </p>}
                    ko={<p>
                        정규화에는 값이 들지 않는다. <InlineMath math={"x \\neq 0"}/>이면 Definition 3.1의 조항
                        3에 의해{" "}
                        <InlineMath math={"\\left\\| x / \\|x\\| \\right\\| = \\left| 1/\\|x\\| \\right| \\cdot \\|x\\| = 1"}/>이다.
                        0이 아닌 벡터들의 직교 집합은 나눗셈 한 번이면 orthonormal이 된다.
                    </p>}
                />
            </Definition>
            <Theorem n="3.18" title={<T en={<>Pythagorean theorem</>} ko={<>피타고라스 정리</>}/>}>
                <T en={<p>If <InlineMath math={"x \\perp y"}/>, then</p>}
                   ko={<p><InlineMath math={"x \\perp y"}/>이면</p>}/>
                <BlockMath math={"\\|x + y\\|^2 = \\|x\\|^2 + \\|y\\|^2"}/>
                <Terms items={[
                    ["x \\perp y", <T en={<>orthogonality: <InlineMath math={"\\langle x, y \\rangle = 0"}/>, the hypothesis that kills the cross term</>}
                                     ko={<>직교. <InlineMath math={"\\langle x, y \\rangle = 0"}/>이며, 교차항을 죽이는 가정이다</>}/>],
                    ["\\|x + y\\|^2", <T en={<>the squared length of the hypotenuse of the right triangle with legs <InlineMath math={"x"}/> and <InlineMath math={"y"}/></>}
                                        ko={<>변이 <InlineMath math={"x"}/>와 <InlineMath math={"y"}/>인 직각삼각형의 빗변 길이의 제곱</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            The third line of the triangle inequality proof was an identity, not an
                            inequality:
                        </p>}
                        ko={<p>
                            삼각 부등식 증명의 셋째 줄은 부등식이 아니라 항등식이었다.
                        </p>}
                    />
                    <BlockMath math={"\\|x + y\\|^2 = \\|x\\|^2 + \\|y\\|^2 + 2\\underbrace{\\langle x, y \\rangle}_{= \\, 0 \\text{ since } x \\perp y}"}/>
                    <Terms items={[
                        ["2\\langle x, y \\rangle", <T en={<>the only term that distinguishes <InlineMath math={"\\|x+y\\|^2"}/> from <InlineMath math={"\\|x\\|^2 + \\|y\\|^2"}/></>}
                                                      ko={<><InlineMath math={"\\|x+y\\|^2"}/>과 <InlineMath math={"\\|x\\|^2 + \\|y\\|^2"}/>을 가르는 유일한 항</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            With <InlineMath math={"x = (3, 0)^\\top"}/> and{" "}
                            <InlineMath math={"y = (0, 4)^\\top"}/> this is{" "}
                            <InlineMath math={"25 = 9 + 16"}/>. The theorem is worth stating in the abstract
                            because it is the engine of the Projection Theorem: the proof there splits an
                            error into two orthogonal pieces and reads off which one can be made to vanish.
                        </p>}
                        ko={<p>
                            <InlineMath math={"x = (3, 0)^\\top"}/>,{" "}
                            <InlineMath math={"y = (0, 4)^\\top"}/>이면{" "}
                            <InlineMath math={"25 = 9 + 16"}/>이다. 이 정리를 추상적으로 적어 둘 값어치가 있는 것은
                            그것이 사영 정리의 엔진이기 때문이다. 거기서는 오차를 직교하는 두 조각으로 쪼갠 다음
                            어느 쪽을 0으로 만들 수 있는지 읽어 낸다.
                        </p>}
                    />
                </Proof>
            </Theorem>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>The Gram-Schmidt Process</h2>} ko={<h2>Gram-Schmidt 과정</h2>}/>
            <T
                en={<p>
                    An orthonormal basis is worth having because coordinates in it are free. Expand{" "}
                    <InlineMath math={"x = \\sum_i \\alpha_i v^i"}/> in an orthonormal basis, take the inner
                    product with <InlineMath math={"v^j"}/>, and every term but one dies:{" "}
                    <InlineMath math={"\\alpha_j = \\langle x, v^j \\rangle"}/>. No linear system to solve.
                    Gram-Schmidt is the constructive proof that such a basis always exists, and it is
                    nothing more than "subtract off what you already have" applied one vector at a time.
                </p>}
                ko={<p>
                    orthonormal 기저를 갖고 싶은 이유는 그 기저에서 좌표가 공짜이기 때문이다. orthonormal
                    기저로 <InlineMath math={"x = \\sum_i \\alpha_i v^i"}/>라 전개하고{" "}
                    <InlineMath math={"v^j"}/>와 내적을 취하면 한 항만 남고 전부 죽는다.{" "}
                    <InlineMath math={"\\alpha_j = \\langle x, v^j \\rangle"}/>이다. 풀 선형계가 없다.
                    Gram-Schmidt는 그런 기저가 언제나 존재한다는 것의 구성적 증명이고, 하는 일은 "이미 가진 것을
                    덜어 낸다"를 벡터 하나씩 적용하는 것이 전부다.
                </p>}
            />
            <Proposition n="3.19" title={<T en={<>One recursion step</>} ko={<>재귀 한 걸음</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\mathcal{F}, \\langle \\cdot, \\cdot \\rangle)"}/> be
                        an inner product space, let{" "}
                        <InlineMath math={"\\{y^1, \\ldots, y^k\\}"}/> be linearly independent, and let{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^{k-1}\\}"}/> be an orthogonal set with{" "}
                        <InlineMath math={"\\operatorname{span}\\{v^1, \\ldots, v^{k-1}\\} = \\operatorname{span}\\{y^1, \\ldots, y^{k-1}\\}"}/>.
                        Define
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F}, \\langle \\cdot, \\cdot \\rangle)"}/>이
                        내적 공간이고, <InlineMath math={"\\{y^1, \\ldots, y^k\\}"}/>가 선형 독립,{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^{k-1}\\}"}/>이{" "}
                        <InlineMath math={"\\operatorname{span}\\{v^1, \\ldots, v^{k-1}\\} = \\operatorname{span}\\{y^1, \\ldots, y^{k-1}\\}"}/>을
                        만족하는 직교 집합이라 하자.
                    </p>}
                />
                <BlockMath math={"v^k = y^k - \\sum_{j=1}^{k-1} \\frac{\\langle y^k, v^j \\rangle}{\\|v^j\\|^2} \\cdot v^j"}/>
                <Terms items={[
                    ["y^k", <T en={<>the next input vector, not yet orthogonal to anything</>}
                              ko={<>다음 입력 벡터. 아직 어느 것과도 직교하지 않는다</>}/>],
                    ["v^j", <T en={<>an already-orthogonal direction produced by earlier steps</>}
                              ko={<>앞 단계에서 만들어 둔, 이미 직교인 방향</>}/>],
                    ["\\dfrac{\\langle y^k, v^j \\rangle}{\\|v^j\\|^2}", <T en={<>how much of <InlineMath math={"v^j"}/> is hiding inside <InlineMath math={"y^k"}/>; dividing by <InlineMath math={"\\|v^j\\|^2"}/> is what makes the leftover orthogonal</>}
                                                                          ko={<><InlineMath math={"y^k"}/> 안에 <InlineMath math={"v^j"}/>가 얼마나 숨어 있는지. <InlineMath math={"\\|v^j\\|^2"}/>으로 나누는 것이 남는 것을 직교하게 만든다</>}/>],
                    ["\\|v^j\\|^2", <T en={<>shorthand for <InlineMath math={"\\langle v^j, v^j \\rangle"}/>, nonzero because the <InlineMath math={"v^j"}/> span the same space as an independent set</>}
                                      ko={<><InlineMath math={"\\langle v^j, v^j \\rangle"}/>의 줄임. <InlineMath math={"v^j"}/>들이 독립 집합과 같은 공간을 만들므로 0이 아니다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Then <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/> is orthogonal and{" "}
                        <InlineMath math={"\\operatorname{span}\\{v^1, \\ldots, v^k\\} = \\operatorname{span}\\{y^1, \\ldots, y^k\\}"}/>.
                    </p>}
                    ko={<p>
                        그러면 <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/>은 직교 집합이고{" "}
                        <InlineMath math={"\\operatorname{span}\\{v^1, \\ldots, v^k\\} = \\operatorname{span}\\{y^1, \\ldots, y^k\\}"}/>이다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            <strong>Orthogonality.</strong> Write the candidate as{" "}
                            <InlineMath math={"v^k = y^k - \\sum_{i=1}^{k-1} a_{ki} v^i"}/> with the{" "}
                            <InlineMath math={"a_{ki}"}/> still unknown, and ask what they must be. Fix{" "}
                            <InlineMath math={"j"}/> with <InlineMath math={"1 \\le j \\le k-1"}/> and take
                            the inner product with <InlineMath math={"v^j"}/>. Since the earlier set is
                            orthogonal, <InlineMath math={"\\langle v^i, v^j \\rangle = 0"}/> for{" "}
                            <InlineMath math={"i \\neq j"}/>, so the sum keeps one term:
                        </p>}
                        ko={<p>
                            <strong>직교성.</strong> 후보를{" "}
                            <InlineMath math={"v^k = y^k - \\sum_{i=1}^{k-1} a_{ki} v^i"}/>로 두고{" "}
                            <InlineMath math={"a_{ki}"}/>가 무엇이어야 하는지 묻자.{" "}
                            <InlineMath math={"1 \\le j \\le k-1"}/>인 <InlineMath math={"j"}/>를 고정하고{" "}
                            <InlineMath math={"v^j"}/>와 내적을 취한다. 앞 집합이 직교라{" "}
                            <InlineMath math={"i \\neq j"}/>일 때{" "}
                            <InlineMath math={"\\langle v^i, v^j \\rangle = 0"}/>이므로 합에서 한 항만 남는다.
                        </p>}
                    />
                    <BlockMath math={"\\langle v^k, v^j \\rangle = \\langle y^k, v^j \\rangle - \\sum_{i=1}^{k-1} a_{ki} \\langle v^i, v^j \\rangle = \\langle y^k, v^j \\rangle - a_{kj} \\|v^j\\|^2"}/>
                    <Terms items={[
                        ["a_{kj}", <T en={<>the coefficient we are solving for, one for each earlier direction</>}
                                     ko={<>우리가 구하는 계수. 앞선 방향마다 하나씩이다</>}/>],
                        ["\\langle v^i, v^j \\rangle", <T en={<>zero unless <InlineMath math={"i = j"}/>, in which case it is <InlineMath math={"\\|v^j\\|^2"}/></>}
                                                         ko={<><InlineMath math={"i = j"}/>일 때만 <InlineMath math={"\\|v^j\\|^2"}/>이고 나머지는 0이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Setting the left side to zero for every <InlineMath math={"j"}/> forces{" "}
                            <InlineMath math={"a_{kj} = \\langle y^k, v^j \\rangle / \\|v^j\\|^2"}/>, which is
                            the formula in the statement. So the coefficients were not guessed; orthogonality
                            has exactly one solution.
                        </p>}
                        ko={<p>
                            모든 <InlineMath math={"j"}/>에 대해 좌변을 0으로 두면{" "}
                            <InlineMath math={"a_{kj} = \\langle y^k, v^j \\rangle / \\|v^j\\|^2"}/>이 강제되고,
                            그것이 진술의 공식이다. 계수를 찍어서 맞춘 것이 아니다. 직교 조건의 해가 하나뿐이다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>Equality of spans.</strong> Two inclusions. Rearranging the definition
                            gives <InlineMath math={"y^k = v^k + \\sum_j a_{kj} v^j"}/>, so{" "}
                            <InlineMath math={"y^k \\in \\operatorname{span}\\{v^1, \\ldots, v^k\\}"}/>, and
                            with the hypothesis on the earlier spans that gives one inclusion. For the
                            other, each <InlineMath math={"v^j"}/> with{" "}
                            <InlineMath math={"j \\le k-1"}/> lies in{" "}
                            <InlineMath math={"\\operatorname{span}\\{y^1, \\ldots, y^{k-1}\\}"}/> by
                            hypothesis, so the whole sum does, and{" "}
                            <InlineMath math={"y^k"}/> obviously does:
                        </p>}
                        ko={<p>
                            <strong>span이 같음.</strong> 포함 관계 둘이다. 정의를 옮겨 적으면{" "}
                            <InlineMath math={"y^k = v^k + \\sum_j a_{kj} v^j"}/>이므로{" "}
                            <InlineMath math={"y^k \\in \\operatorname{span}\\{v^1, \\ldots, v^k\\}"}/>이고,
                            앞 단계의 span 가정과 합치면 한쪽 포함이 나온다. 반대쪽은,{" "}
                            <InlineMath math={"j \\le k-1"}/>인 각 <InlineMath math={"v^j"}/>가 가정에 의해{" "}
                            <InlineMath math={"\\operatorname{span}\\{y^1, \\ldots, y^{k-1}\\}"}/>에 있으므로 합
                            전체가 거기에 있고, <InlineMath math={"y^k"}/>는 당연히 거기에 있다.
                        </p>}
                    />
                    <BlockMath math={"v^k = y^k - \\sum_{j=1}^{k-1} a_{kj} v^j \\;\\in\\; \\operatorname{span}\\{y^1, \\ldots, y^k\\}"}/>
                    <Terms items={[
                        ["\\operatorname{span}\\{y^1, \\ldots, y^k\\}", <T en={<>a subspace, so it is closed under the subtraction just performed: that closure is the whole argument</>}
                                                                          ko={<>부분 공간이므로 방금 한 뺄셈에 대해 닫혀 있다. 그 닫힘이 논증의 전부다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Both inclusions hold, so the spans are equal. Note where independence was used:
                            it guarantees <InlineMath math={"v^j \\neq 0"}/>, so the division by{" "}
                            <InlineMath math={"\\|v^j\\|^2"}/> is legal. Feed the process a dependent set and
                            some <InlineMath math={"v^k"}/> comes out as the zero vector.
                        </p>}
                        ko={<p>
                            두 포함이 모두 성립하므로 span이 같다. 독립성이 어디에 쓰였는지 보아 두자.{" "}
                            <InlineMath math={"v^j \\neq 0"}/>을 보장해서{" "}
                            <InlineMath math={"\\|v^j\\|^2"}/>으로 나누는 것이 정당해진다. 종속인 집합을 넣으면
                            어떤 <InlineMath math={"v^k"}/>가 영벡터로 나온다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Definition n="3.20" title={<T en={<>The Gram-Schmidt process</>} ko={<>Gram-Schmidt 과정</>}/>}>
                <T
                    en={<p>
                        Initialize with <InlineMath math={"v^1 = y^1"}/> and apply the recursion step for{" "}
                        <InlineMath math={"k = 2, 3, \\ldots, n"}/>. In code it is convenient to normalize as
                        you go, because then <InlineMath math={"\\|v^j\\|^2 = 1"}/> and the division
                        disappears:
                    </p>}
                    ko={<p>
                        <InlineMath math={"v^1 = y^1"}/>로 시작해서{" "}
                        <InlineMath math={"k = 2, 3, \\ldots, n"}/>에 대해 재귀 단계를 적용한다. 코드에서는 진행
                        하면서 바로 정규화하는 편이 편하다. 그러면{" "}
                        <InlineMath math={"\\|v^j\\|^2 = 1"}/>이 되어 나눗셈이 사라진다.
                    </p>}
                />
                <pre><code>{`# given {y1, ..., yn} linearly independent
# produce {v1, ..., vn} orthonormal, with
# span{v1, ..., vk} = span{y1, ..., yk} for every k
v1 = y1
v1 = v1 / norm(v1)
for k = 2 : n
    vk = yk
    for j = 1 : k - 1
        vk = vk - inner(yk, vj) * vj
    end
    vk = vk / norm(vk)
end`}</code></pre>
                <T
                    en={<p>
                        The printed notes drop the trailing <code>* vj</code> on the inner loop, which would
                        subtract a scalar from a vector. The line above is the corrected one. Note also that
                        the coefficient uses <code>yk</code>, the original vector, and not the partially
                        updated <code>vk</code>; that distinction looks pedantic and turns out to matter a
                        great deal in finite precision.
                    </p>}
                    ko={<p>
                        인쇄된 원 교재는 안쪽 루프에서 끝의 <code>* vj</code>를 빠뜨렸는데, 그대로 두면 벡터에서
                        스칼라를 빼는 셈이 된다. 위 줄이 고친 것이다. 계수에 부분적으로 갱신된{" "}
                        <code>vk</code>가 아니라 원래 벡터 <code>yk</code>가 들어간다는 점도 봐 두자. 사소해
                        보이지만 유한 정밀도에서는 아주 큰 차이를 만든다.
                    </p>}
                />
            </Definition>
            <T
                en={<p>
                    The figure runs the two-vector case one step at a time. The orange arrow is the sum in
                    the recursion step, the thing that gets removed.
                </p>}
                ko={<p>
                    아래 그림은 벡터 두 개짜리 경우를 한 단계씩 돌린다. 주황색 화살표가 재귀 단계의 합, 곧 덜어
                    내는 그것이다.
                </p>}
            />
            <CanvasFigure label={t("Gram-Schmidt, one subtraction at a time",
                "Gram-Schmidt, 뺄셈 한 번씩")}
                          modal={<GramSchmidtSteps width={720} height={430}/>}
                          bodyClassName="w-[min(94vw,760px)]">
                <GramSchmidtSteps/>
            </CanvasFigure>
            <Example n="3.21" title={<T en={<>Gram-Schmidt in <InlineMath math={"\\mathbb{R}^3"}/>, every number written out</>}
                                        ko={<><InlineMath math={"\\mathbb{R}^3"}/>에서의 Gram-Schmidt, 숫자를 전부 적는다</>}/>}>
                <T
                    en={<p>
                        Take <InlineMath math={"(\\mathbb{R}^3, \\mathbb{R})"}/> with{" "}
                        <InlineMath math={"\\langle p, q \\rangle = p^\\top q"}/> and the independent set
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\langle p, q \\rangle = p^\\top q"}/>를 얹은{" "}
                        <InlineMath math={"(\\mathbb{R}^3, \\mathbb{R})"}/>에서 독립 집합
                    </p>}
                />
                <BlockMath math={"\\{y^1, y^2, y^3\\} = \\left\\{ \\begin{bmatrix} 1 \\\\ 1 \\\\ 0 \\end{bmatrix}, \\begin{bmatrix} 1 \\\\ 2 \\\\ 3 \\end{bmatrix}, \\begin{bmatrix} 0 \\\\ 1 \\\\ 1 \\end{bmatrix} \\right\\}"}/>
                <Terms items={[
                    ["y^1, y^2, y^3", <T en={<>three independent columns; the superscripts are labels, not powers</>}
                                        ko={<>독립인 열 셋. 위첨자는 지수가 아니라 이름표다</>}/>],
                ]}/>
                <T en={<p>Step 1 takes the first vector unchanged.</p>}
                   ko={<p>1단계는 첫 벡터를 그대로 가져간다.</p>}/>
                <BlockMath math={"v^1 = y^1 = \\begin{bmatrix} 1 \\\\ 1 \\\\ 0 \\end{bmatrix}, \\qquad \\|v^1\\|^2 = 1 + 1 + 0 = 2"}/>
                <Terms items={[
                    ["\\|v^1\\|^2", <T en={<>the denominator every later step divides by</>}
                                      ko={<>이후 모든 단계가 나누게 될 분모</>}/>],
                ]}/>
                <T en={<p>Step 2 removes the <InlineMath math={"v^1"}/> component of{" "}
                    <InlineMath math={"y^2"}/>.</p>}
                   ko={<p>2단계는 <InlineMath math={"y^2"}/>에서 <InlineMath math={"v^1"}/> 성분을 덜어 낸다.</p>}/>
                <BlockMath math={"\\langle y^2, v^1 \\rangle = 1 + 2 + 0 = 3, \\qquad v^2 = \\begin{bmatrix} 1 \\\\ 2 \\\\ 3 \\end{bmatrix} - \\frac{3}{2}\\begin{bmatrix} 1 \\\\ 1 \\\\ 0 \\end{bmatrix} = \\begin{bmatrix} -\\tfrac{1}{2} \\\\ \\tfrac{1}{2} \\\\ 3 \\end{bmatrix}"}/>
                <Terms items={[
                    ["\\tfrac{3}{2}", <T en={<>the coefficient <InlineMath math={"\\langle y^2, v^1 \\rangle / \\|v^1\\|^2"}/></>}
                                        ko={<>계수 <InlineMath math={"\\langle y^2, v^1 \\rangle / \\|v^1\\|^2"}/></>}/>],
                    ["v^2", <T en={<>check it: <InlineMath math={"\\langle v^2, v^1 \\rangle = -\\tfrac{1}{2} + \\tfrac{1}{2} + 0 = 0"}/></>}
                              ko={<>확인해 보라. <InlineMath math={"\\langle v^2, v^1 \\rangle = -\\tfrac{1}{2} + \\tfrac{1}{2} + 0 = 0"}/>이다</>}/>],
                    ["\\|v^2\\|^2", <T en={<><InlineMath math={"\\tfrac{1}{4} + \\tfrac{1}{4} + 9 = \\tfrac{19}{2}"}/></>}
                                      ko={<><InlineMath math={"\\tfrac{1}{4} + \\tfrac{1}{4} + 9 = \\tfrac{19}{2}"}/></>}/>],
                ]}/>
                <T en={<p>Step 3 removes two components at once.</p>}
                   ko={<p>3단계는 성분 둘을 한꺼번에 덜어 낸다.</p>}/>
                <BlockMath math={"\\langle y^3, v^1 \\rangle = 0 + 1 + 0 = 1, \\qquad \\langle y^3, v^2 \\rangle = 0 + \\tfrac{1}{2} + 3 = \\tfrac{7}{2}"}/>
                <Terms items={[
                    ["\\langle y^3, v^1 \\rangle", <T en={<>gives the coefficient <InlineMath math={"1 / 2"}/></>}
                                                     ko={<>계수 <InlineMath math={"1 / 2"}/>을 준다</>}/>],
                    ["\\langle y^3, v^2 \\rangle", <T en={<>gives the coefficient <InlineMath math={"\\tfrac{7}{2} \\big/ \\tfrac{19}{2} = \\tfrac{7}{19}"}/></>}
                                                     ko={<>계수 <InlineMath math={"\\tfrac{7}{2} \\big/ \\tfrac{19}{2} = \\tfrac{7}{19}"}/>을 준다</>}/>],
                ]}/>
                <BlockMath math={"v^3 = \\begin{bmatrix} 0 \\\\ 1 \\\\ 1 \\end{bmatrix} - \\frac{1}{2}\\begin{bmatrix} 1 \\\\ 1 \\\\ 0 \\end{bmatrix} - \\frac{7}{19}\\begin{bmatrix} -\\tfrac{1}{2} \\\\ \\tfrac{1}{2} \\\\ 3 \\end{bmatrix} = \\begin{bmatrix} -\\tfrac{6}{19} \\\\ \\tfrac{6}{19} \\\\ -\\tfrac{2}{19} \\end{bmatrix}"}/>
                <Terms items={[
                    ["-\\tfrac{7}{19} \\cdot v^2", <T en={<>entrywise this is <InlineMath math={"(\\tfrac{7}{38}, -\\tfrac{7}{38}, -\\tfrac{21}{19})^\\top"}/></>}
                                                     ko={<>성분별로는 <InlineMath math={"(\\tfrac{7}{38}, -\\tfrac{7}{38}, -\\tfrac{21}{19})^\\top"}/>이다</>}/>],
                    ["v^3", <T en={<>check both: <InlineMath math={"\\langle v^3, v^1 \\rangle = -\\tfrac{6}{19} + \\tfrac{6}{19} = 0"}/> and <InlineMath math={"\\langle v^3, v^2 \\rangle = \\tfrac{3}{19} + \\tfrac{3}{19} - \\tfrac{6}{19} = 0"}/></>}
                              ko={<>둘 다 확인해 보라. <InlineMath math={"\\langle v^3, v^1 \\rangle = -\\tfrac{6}{19} + \\tfrac{6}{19} = 0"}/>이고 <InlineMath math={"\\langle v^3, v^2 \\rangle = \\tfrac{3}{19} + \\tfrac{3}{19} - \\tfrac{6}{19} = 0"}/>이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Normalizing is the part nobody enjoys doing by hand. With{" "}
                        <InlineMath math={"\\|v^2\\| = \\sqrt{19/2}"}/> and{" "}
                        <InlineMath math={"\\|v^3\\|^2 = (36 + 36 + 4)/361 = 4/19"}/>:
                    </p>}
                    ko={<p>
                        정규화는 손으로 하기 싫은 부분이다.{" "}
                        <InlineMath math={"\\|v^2\\| = \\sqrt{19/2}"}/>,{" "}
                        <InlineMath math={"\\|v^3\\|^2 = (36 + 36 + 4)/361 = 4/19"}/>이므로
                    </p>}
                />
                <BlockMath math={"\\tilde{v}^1 = \\frac{1}{\\sqrt{2}}\\begin{bmatrix} 1 \\\\ 1 \\\\ 0 \\end{bmatrix}, \\qquad \\tilde{v}^2 = \\frac{1}{\\sqrt{38}}\\begin{bmatrix} -1 \\\\ 1 \\\\ 6 \\end{bmatrix}, \\qquad \\tilde{v}^3 = \\frac{1}{\\sqrt{76}}\\begin{bmatrix} -6 \\\\ 6 \\\\ -2 \\end{bmatrix}"}/>
                <Terms items={[
                    ["\\tilde{v}^i", <T en={<>the normalized vectors, <InlineMath math={"v^i / \\|v^i\\|"}/></>}
                                       ko={<>정규화한 벡터들, <InlineMath math={"v^i / \\|v^i\\|"}/></>}/>],
                    ["\\sqrt{38}", <T en={<><InlineMath math={"\\|v^2\\| = \\sqrt{19/2}"}/>, rewritten after pulling <InlineMath math={"\\tfrac{1}{2}"}/> out of the column</>}
                                     ko={<><InlineMath math={"\\|v^2\\| = \\sqrt{19/2}"}/>. 열에서 <InlineMath math={"\\tfrac{1}{2}"}/>을 뽑아낸 뒤 다시 쓴 것이다</>}/>],
                    ["\\sqrt{76}", <T en={<><InlineMath math={"19 \\|v^3\\| = 19 \\cdot 2/\\sqrt{19} = \\sqrt{76}"}/>, after pulling <InlineMath math={"\\tfrac{1}{19}"}/> out</>}
                                     ko={<><InlineMath math={"\\tfrac{1}{19}"}/>을 뽑아낸 뒤의 <InlineMath math={"19 \\|v^3\\| = 19 \\cdot 2/\\sqrt{19} = \\sqrt{76}"}/></>}/>],
                ]}/>
            </Example>
            <Example n="3.22" title={<T en={<>The same algorithm on polynomials</>} ko={<>같은 알고리즘을 다항식에</>}/>}>
                <T
                    en={<p>
                        Nothing in Proposition 3.19 mentioned columns. Take{" "}
                        <InlineMath math={"C[0,1]"}/> with{" "}
                        <InlineMath math={"\\langle f, g \\rangle = \\int_0^1 f(\\tau) g(\\tau) \\, \\mathrm{d}\\tau"}/> and
                        the independent set <InlineMath math={"\\{1, t, t^2\\}"}/>. The arithmetic changes
                        from sums to integrals and the procedure does not change at all.
                    </p>}
                    ko={<p>
                        Proposition 3.19에는 열이라는 말이 없었다.{" "}
                        <InlineMath math={"\\langle f, g \\rangle = \\int_0^1 f(\\tau) g(\\tau) \\, \\mathrm{d}\\tau"}/>를
                        얹은 <InlineMath math={"C[0,1]"}/>에서 독립 집합{" "}
                        <InlineMath math={"\\{1, t, t^2\\}"}/>을 잡자. 산술이 합에서 적분으로 바뀔 뿐 절차는 전혀
                        바뀌지 않는다.
                    </p>}
                />
                <BlockMath math={"v^1 = 1, \\qquad \\|v^1\\|^2 = \\int_0^1 1 \\, \\mathrm{d}\\tau = 1, \\qquad \\langle t, v^1 \\rangle = \\int_0^1 \\tau \\, \\mathrm{d}\\tau = \\tfrac{1}{2}"}/>
                <Terms items={[
                    ["v^1 = 1", <T en={<>the constant function, which is one vector of this space</>}
                                  ko={<>상수 함수. 이 공간의 벡터 하나다</>}/>],
                    ["\\langle t, v^1 \\rangle", <T en={<>the amount of the constant function hiding inside <InlineMath math={"t"}/></>}
                                                   ko={<><InlineMath math={"t"}/> 안에 숨어 있는 상수 함수의 양</>}/>],
                ]}/>
                <BlockMath math={"v^2 = t - \\tfrac{1}{2}, \\qquad \\|v^2\\|^2 = \\int_0^1 \\left(\\tau - \\tfrac{1}{2}\\right)^2 \\mathrm{d}\\tau = \\tfrac{1}{12}"}/>
                <Terms items={[
                    ["t - \\tfrac{1}{2}", <T en={<>the part of <InlineMath math={"t"}/> with zero average on <InlineMath math={"[0,1]"}/>, which is exactly what orthogonal to the constants means</>}
                                            ko={<><InlineMath math={"[0,1]"}/>에서 평균이 0인 <InlineMath math={"t"}/>의 부분. 상수 함수와 직교한다는 말이 정확히 그 뜻이다</>}/>],
                    ["\\tfrac{1}{12}", <T en={<>the variance of a uniform variable on <InlineMath math={"[0,1]"}/>, which is not a coincidence</>}
                                         ko={<><InlineMath math={"[0,1]"}/> 균등 분포의 분산. 우연이 아니다</>}/>],
                ]}/>
                <T
                    en={<p>
                        For the third step the two needed inner products are{" "}
                        <InlineMath math={"\\langle t^2, v^1 \\rangle = \\int_0^1 \\tau^2 \\, \\mathrm{d}\\tau = \\tfrac{1}{3}"}/> and{" "}
                        <InlineMath math={"\\langle t^2, v^2 \\rangle = \\int_0^1 (\\tau - \\tfrac{1}{2})\\tau^2 \\, \\mathrm{d}\\tau = \\tfrac{1}{4} - \\tfrac{1}{6} = \\tfrac{1}{12}"}/>, so
                        the second coefficient is{" "}
                        <InlineMath math={"\\tfrac{1}{12} \\big/ \\tfrac{1}{12} = 1"}/>:
                    </p>}
                    ko={<p>
                        3단계에 필요한 두 내적은{" "}
                        <InlineMath math={"\\langle t^2, v^1 \\rangle = \\int_0^1 \\tau^2 \\, \\mathrm{d}\\tau = \\tfrac{1}{3}"}/>과{" "}
                        <InlineMath math={"\\langle t^2, v^2 \\rangle = \\int_0^1 (\\tau - \\tfrac{1}{2})\\tau^2 \\, \\mathrm{d}\\tau = \\tfrac{1}{4} - \\tfrac{1}{6} = \\tfrac{1}{12}"}/>이므로
                        두 번째 계수는{" "}
                        <InlineMath math={"\\tfrac{1}{12} \\big/ \\tfrac{1}{12} = 1"}/>이다.
                    </p>}
                />
                <BlockMath math={"v^3 = t^2 - \\tfrac{1}{3} \\cdot 1 - 1 \\cdot \\left(t - \\tfrac{1}{2}\\right) = t^2 - t + \\tfrac{1}{6}"}/>
                <Terms items={[
                    ["v^3", <T en={<>a shifted Legendre polynomial: the classical family is nothing but Gram-Schmidt applied to <InlineMath math={"1, t, t^2, \\ldots"}/></>}
                              ko={<>평행 이동한 Legendre 다항식. 그 고전적인 집합은 <InlineMath math={"1, t, t^2, \\ldots"}/>에 Gram-Schmidt를 돌린 것에 지나지 않는다</>}/>],
                    ["\\tfrac{1}{6}", <T en={<>check: <InlineMath math={"\\int_0^1 (\\tau^2 - \\tau + \\tfrac{1}{6}) \\, \\mathrm{d}\\tau = \\tfrac{1}{3} - \\tfrac{1}{2} + \\tfrac{1}{6} = 0"}/>, so <InlineMath math={"v^3 \\perp v^1"}/></>}
                                        ko={<>확인. <InlineMath math={"\\int_0^1 (\\tau^2 - \\tau + \\tfrac{1}{6}) \\, \\mathrm{d}\\tau = \\tfrac{1}{3} - \\tfrac{1}{2} + \\tfrac{1}{6} = 0"}/>이므로 <InlineMath math={"v^3 \\perp v^1"}/>이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Normalized these are <InlineMath math={"1"}/>,{" "}
                        <InlineMath math={"\\sqrt{12}\\,(t - \\tfrac{1}{2})"}/>, and{" "}
                        <InlineMath math={"\\sqrt{5}\\,(6t^2 - 6t + 1)"}/>. Fitting a quadratic to a signal on{" "}
                        <InlineMath math={"[0,1]"}/> in this basis needs no linear solve at all, because the
                        Gram matrix of the next section is the identity.
                    </p>}
                    ko={<p>
                        정규화하면 <InlineMath math={"1"}/>,{" "}
                        <InlineMath math={"\\sqrt{12}\\,(t - \\tfrac{1}{2})"}/>,{" "}
                        <InlineMath math={"\\sqrt{5}\\,(6t^2 - 6t + 1)"}/>이 된다. 이 기저에서{" "}
                        <InlineMath math={"[0,1]"}/> 위의 신호에 이차식을 맞추는 데는 선형계를 풀 일이 아예 없다.
                        다음 절의 Gram 행렬이 단위 행렬이기 때문이다.
                    </p>}
                />
            </Example>
            <Remark n="3.24" title={<T en={<>Classical Gram-Schmidt loses orthogonality in floating point</>}
                                       ko={<>classical Gram-Schmidt는 부동소수점에서 직교성을 잃는다</>}/>}>
                <T
                    en={<p>
                        The version above is easy to understand, which is why it is taught. It also behaves
                        badly under round-off. The standard demonstration uses three nearly parallel vectors
                        in <InlineMath math={"\\mathbb{R}^4"}/>:
                    </p>}
                    ko={<p>
                        위의 판본은 이해하기 쉬워서 가르쳐진다. 그리고 반올림 오차 아래에서 나쁘게 행동한다. 표준
                        시연은 <InlineMath math={"\\mathbb{R}^4"}/>의 거의 평행한 벡터 셋을 쓴다.
                    </p>}
                />
                <BlockMath math={"u^1 = \\begin{bmatrix} 1 \\\\ \\varepsilon \\\\ 0 \\\\ 0 \\end{bmatrix}, \\quad u^2 = \\begin{bmatrix} 1 \\\\ 0 \\\\ \\varepsilon \\\\ 0 \\end{bmatrix}, \\quad u^3 = \\begin{bmatrix} 1 \\\\ 0 \\\\ 0 \\\\ \\varepsilon \\end{bmatrix}, \\quad \\varepsilon > 0"}/>
                <Terms items={[
                    ["\\varepsilon", <T en={<>a small positive number; the demonstration uses <InlineMath math={"\\varepsilon = 10^{-8}"}/>, which is about the square root of double precision</>}
                                       ko={<>작은 양수. 시연에서는 <InlineMath math={"\\varepsilon = 10^{-8}"}/>을 쓰는데, 배정밀도의 제곱근쯤 되는 값이다</>}/>],
                    ["u^1, u^2, u^3", <T en={<>independent for every <InlineMath math={"\\varepsilon \\neq 0"}/>, but only barely: they all point almost exactly along <InlineMath math={"e^1"}/></>}
                                        ko={<><InlineMath math={"\\varepsilon \\neq 0"}/>이면 독립이지만 아슬아슬하다. 셋 다 거의 정확히 <InlineMath math={"e^1"}/> 방향을 가리킨다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Writing <InlineMath math={"\\{e^1, e^2, e^3, e^4\\}"}/> for the standard basis, the
                        differences <InlineMath math={"u^2 - u^1 = \\varepsilon(e^3 - e^2)"}/> and{" "}
                        <InlineMath math={"u^3 - u^2 = \\varepsilon(e^4 - e^3)"}/> give
                    </p>}
                    ko={<p>
                        표준 기저를 <InlineMath math={"\\{e^1, e^2, e^3, e^4\\}"}/>라 쓰면 차{" "}
                        <InlineMath math={"u^2 - u^1 = \\varepsilon(e^3 - e^2)"}/>와{" "}
                        <InlineMath math={"u^3 - u^2 = \\varepsilon(e^4 - e^3)"}/>에서
                    </p>}
                />
                <BlockMath math={"\\operatorname{span}\\{u^1, u^2, u^3\\} = \\operatorname{span}\\{u^1, \\, e^3 - e^2, \\, e^4 - e^3\\}"}/>
                <Terms items={[
                    ["e^i", <T en={<>the columns of the <InlineMath math={"4 \\times 4"}/> identity matrix</>}
                              ko={<><InlineMath math={"4 \\times 4"}/> 단위 행렬의 열들</>}/>],
                    ["e^3 - e^2", <T en={<>a well-scaled direction: nothing about it is nearly parallel to <InlineMath math={"u^1"}/></>}
                                    ko={<>크기가 잘 잡힌 방향. <InlineMath math={"u^1"}/>과 거의 평행한 구석이 전혀 없다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The two input sets span the same subspace, so in exact arithmetic Gram-Schmidt must
                        return the same orthonormal vectors. At{" "}
                        <InlineMath math={"\\varepsilon = 10^{-8}"}/> in double precision it does not. The
                        matrix whose columns are the classical Gram-Schmidt output of the first set is{" "}
                        <InlineMath math={"Q_1"}/>, and of the second set is{" "}
                        <InlineMath math={"Q_2"}/>:
                    </p>}
                    ko={<p>
                        두 입력 집합은 같은 부분 공간을 만들므로, 정확한 산술이라면 Gram-Schmidt가 같은 orthonormal
                        벡터를 돌려주어야 한다. 배정밀도에서{" "}
                        <InlineMath math={"\\varepsilon = 10^{-8}"}/>이면 그러지 않는다. 첫 집합에 classical
                        Gram-Schmidt를 돌린 결과를 열로 갖는 행렬이{" "}
                        <InlineMath math={"Q_1"}/>, 둘째 집합의 것이{" "}
                        <InlineMath math={"Q_2"}/>다.
                    </p>}
                />
                <BlockMath math={"Q_1 = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & -0.7071 & -0.7071 \\\\ 0 & 0.7071 & 0 \\\\ 0 & 0 & 0.7071 \\end{bmatrix}, \\qquad Q_2 = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & -0.7071 & -0.4082 \\\\ 0 & 0.7071 & -0.4082 \\\\ 0 & 0 & 0.8165 \\end{bmatrix}"}/>
                <Terms items={[
                    ["Q_1", <T en={<>the output on <InlineMath math={"\\{u^1, u^2, u^3\\}"}/>; its second and third columns have inner product <InlineMath math={"0.5"}/>, so they are not orthogonal at all</>}
                              ko={<><InlineMath math={"\\{u^1, u^2, u^3\\}"}/>에 대한 결과. 둘째 열과 셋째 열의 내적이 <InlineMath math={"0.5"}/>라 직교와는 거리가 멀다</>}/>],
                    ["Q_2", <T en={<>the output on the rescaled set, which is the correct answer for both</>}
                              ko={<>크기를 다시 잡은 집합에 대한 결과. 두 경우 모두의 정답이다</>}/>],
                    ["0.4082, 0.8165", <T en={<><InlineMath math={"1/\\sqrt{6}"}/> and <InlineMath math={"2/\\sqrt{6}"}/>, the exact values</>}
                                         ko={<>정확한 값 <InlineMath math={"1/\\sqrt{6}"}/>과 <InlineMath math={"2/\\sqrt{6}"}/></>}/>],
                ]}/>
                <T
                    en={<p>
                        Nothing about <InlineMath math={"Q_1"}/> is a rounding wobble in the last digit. Its
                        columns are off by <InlineMath math={"60"}/> degrees. The cause is that{" "}
                        <InlineMath math={"u^2 - \\langle u^2, v^1 \\rangle v^1"}/> is a difference of two
                        nearly equal quantities, so the answer is dominated by whatever error the two inputs
                        carried.
                    </p>}
                    ko={<p>
                        <InlineMath math={"Q_1"}/>의 오차는 마지막 자리가 흔들린 정도가 아니다. 열끼리{" "}
                        <InlineMath math={"60"}/>도만큼 틀어져 있다. 원인은{" "}
                        <InlineMath math={"u^2 - \\langle u^2, v^1 \\rangle v^1"}/>이 거의 같은 두 양의 차라서,
                        답이 입력이 지니고 있던 오차에 지배당하기 때문이다.
                    </p>}
                />
            </Remark>
            <Definition n="3.26" title={<T en={<>Modified Gram-Schmidt</>} ko={<>modified Gram-Schmidt</>}/>}>
                <T
                    en={<p>
                        The fix reorders the same subtractions. Instead of computing all corrections to{" "}
                        <InlineMath math={"v^k"}/> from the original <InlineMath math={"y^k"}/> at the end,
                        each newly finished direction is immediately removed from every vector that has not
                        been processed yet:
                    </p>}
                    ko={<p>
                        해결책은 같은 뺄셈들의 순서를 바꾸는 것이다. 마지막에 원래의{" "}
                        <InlineMath math={"y^k"}/>에서 <InlineMath math={"v^k"}/>에 대한 보정을 전부 계산하는
                        대신, 방향 하나가 끝날 때마다 그것을 아직 처리하지 않은 모든 벡터에서 곧바로 덜어 낸다.
                    </p>}
                />
                <pre><code>{`for k = 1 : n
    vk = uk          # copy the inputs once
end
for k = 1 : n
    vk = vk / norm(vk)
    for j = (k + 1) : n
        vj = vj - inner(vj, vk) * vk   # makes vj orthogonal to vk
    end
end`}</code></pre>
                <T
                    en={<p>
                        At step <InlineMath math={"k"}/> the vector <InlineMath math={"v^k"}/> is normalized
                        and then <InlineMath math={"v^{k+1}, \\ldots, v^n"}/> are made orthogonal to it. They
                        were already orthogonal to{" "}
                        <InlineMath math={"v^1, \\ldots, v^{k-1}"}/> from earlier passes. In exact arithmetic
                        this produces exactly the same vectors as Definition 3.20; the difference is that
                        each inner product is now taken against a vector that has already had the earlier
                        directions removed, so there is no large cancellation left to amplify.
                    </p>}
                    ko={<p>
                        <InlineMath math={"k"}/>단계에서 <InlineMath math={"v^k"}/>를 정규화한 뒤{" "}
                        <InlineMath math={"v^{k+1}, \\ldots, v^n"}/>을 그것과 직교하게 만든다. 이들은 앞선
                        회차에서 이미 <InlineMath math={"v^1, \\ldots, v^{k-1}"}/>과 직교해 있다. 정확한 산술에서는
                        Definition 3.20과 완전히 같은 벡터가 나온다. 차이는 이제 각 내적을 앞선 방향들이 이미
                        제거된 벡터에 대고 잰다는 점이고, 그래서 증폭될 큰 상쇄가 남지 않는다.
                    </p>}
                />
            </Definition>
            <Remark n="3.27" title={<T en={<>Modified Gram-Schmidt on the same data</>} ko={<>같은 데이터에 modified Gram-Schmidt</>}/>}>
                <T
                    en={<p>
                        Run at <InlineMath math={"\\varepsilon = 10^{-8}"}/> on both input sets, the modified
                        process returns the same matrix to every digit shown, and it is the correct one:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\varepsilon = 10^{-8}"}/>에서 두 입력 집합 모두에 돌리면 modified
                        과정은 표시된 자리까지 같은 행렬을 돌려주고, 그것이 정답이다.
                    </p>}
                />
                <BlockMath math={"Q_1 = Q_2 = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & -0.7071 & -0.4082 \\\\ 0 & 0.7071 & -0.4082 \\\\ 0 & 0 & 0.8165 \\end{bmatrix}, \\qquad \\max_{i,j} \\left| [Q^\\top Q - I]_{ij} \\right| \\approx 7 \\times 10^{-9}"}/>
                <Terms items={[
                    ["Q_1 = Q_2", <T en={<>the two runs agree to about <InlineMath math={"7 \\times 10^{-9}"}/>, which is what exact arithmetic predicted and what classical Gram-Schmidt failed to deliver</>}
                                    ko={<>두 실행이 <InlineMath math={"7 \\times 10^{-9}"}/> 수준까지 일치한다. 정확한 산술이 예측한 것이고 classical Gram-Schmidt가 내놓지 못한 것이다</>}/>],
                    ["Q^\\top Q - I", <T en={<>how far the output is from orthonormal: <InlineMath math={"7 \\times 10^{-9}"}/> on the badly scaled set and <InlineMath math={"2 \\times 10^{-16}"}/> on the rescaled one, against <InlineMath math={"0.5"}/> for the classical process</>}
                                        ko={<>결과가 orthonormal에서 얼마나 벗어났는지. 크기가 나쁜 집합에서 <InlineMath math={"7 \\times 10^{-9}"}/>, 다시 잡은 집합에서 <InlineMath math={"2 \\times 10^{-16}"}/>이며, classical 과정은 <InlineMath math={"0.5"}/>다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The printed notes repeat the failed classical matrix in this example, which makes the
                        comparison read as though nothing improved. The matrix above is what the modified
                        algorithm actually returns, reproduced here in double precision. With perfect
                        arithmetic the two algorithms are equivalent; the entire difference is numerical.
                        Chapter 4 revisits this under the name QR factorization.
                    </p>}
                    ko={<p>
                        인쇄된 원 교재는 이 예제에서 실패한 classical 행렬을 그대로 다시 실어, 아무것도 나아지지
                        않은 것처럼 읽힌다. 위 행렬이 modified 알고리즘이 실제로 돌려주는 것이고, 여기서 배정밀도로
                        다시 계산해 실었다. 산술이 완벽하다면 두 알고리즘은 동치이며, 차이는 전부 수치적인 것이다.
                        4장이 이것을 QR 분해라는 이름으로 다시 다룬다.
                    </p>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Projection Theorem and the Normal Equations</h2>}
               ko={<h2>사영 정리와 normal equation</h2>}/>
            <T
                en={<p>
                    Here is the payoff. In an inner product space the best approximation problem has exactly
                    one answer, that answer is characterized by a right angle, and the right angle turns into
                    a square linear system you can hand to a computer. The three questions of Remark 3.5 are
                    answered in that order.
                </p>}
                ko={<p>
                    여기가 결실이다. 내적 공간에서 최선의 근사 문제는 답이 정확히 하나이고, 그 답은 직각으로
                    특징지어지며, 그 직각은 컴퓨터에 넘길 수 있는 정방 선형계로 바뀐다. Remark 3.5의 세 질문이
                    그 순서대로 답해진다.
                </p>}
            />
            <Lemma n="3.29" title={<T en={<>Pre-Projection Theorem</>} ko={<>사영 이전 정리</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"\\mathcal{X}"}/> be a finite-dimensional real inner product
                        space, <InlineMath math={"M"}/> a subspace of{" "}
                        <InlineMath math={"\\mathcal{X}"}/>, and{" "}
                        <InlineMath math={"x \\in \\mathcal{X}"}/> arbitrary.
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{X}"}/>가 유한 차원 실내적 공간,{" "}
                        <InlineMath math={"M"}/>이 <InlineMath math={"\\mathcal{X}"}/>의 부분 공간,{" "}
                        <InlineMath math={"x \\in \\mathcal{X}"}/>가 임의의 벡터라 하자.
                    </p>}
                />
                <T
                    en={<ol>
                        <li>If there is an <InlineMath math={"m_0 \\in M"}/> with{" "}
                            <InlineMath math={"\\|x - m_0\\| \\le \\|x - m\\|"}/> for all{" "}
                            <InlineMath math={"m \\in M"}/>, then <InlineMath math={"m_0"}/> is unique.</li>
                        <li><InlineMath math={"m_0"}/> is a minimizing vector if and only if{" "}
                            <InlineMath math={"x - m_0 \\perp M"}/>.</li>
                    </ol>}
                    ko={<ol>
                        <li>모든 <InlineMath math={"m \\in M"}/>에 대해{" "}
                            <InlineMath math={"\\|x - m_0\\| \\le \\|x - m\\|"}/>인{" "}
                            <InlineMath math={"m_0 \\in M"}/>이 있으면 그{" "}
                            <InlineMath math={"m_0"}/>은 유일하다.</li>
                        <li><InlineMath math={"m_0"}/>이 최소화 벡터일 필요충분조건은{" "}
                            <InlineMath math={"x - m_0 \\perp M"}/>이다.</li>
                    </ol>}
                />
                <T
                    en={<p>
                        Note what the lemma does <em>not</em> say. It never claims a minimizer exists; it
                        says that if one exists it is unique and it is the perpendicular foot. Existence is
                        Theorem 3.36.
                    </p>}
                    ko={<p>
                        이 보조정리가 말하지 <em>않는</em> 것을 보아 두자. 최소화 벡터가 존재한다고는 결코 하지
                        않는다. 존재한다면 유일하고 그것이 수선의 발이라고 말할 뿐이다. 존재는 Theorem 3.36이
                        맡는다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            <strong>Claim 3.30. If <InlineMath math={"\\|x - m_0\\| = d(x, M)"}/> then{" "}
                            <InlineMath math={"x - m_0 \\perp M"}/>.</strong> By contraposition, suppose{" "}
                            <InlineMath math={"x - m_0"}/> is <em>not</em> orthogonal to{" "}
                            <InlineMath math={"M"}/>. Then some{" "}
                            <InlineMath math={"m \\in M"}/> has{" "}
                            <InlineMath math={"\\langle x - m_0, m \\rangle \\neq 0"}/>, and in particular{" "}
                            <InlineMath math={"m \\neq 0"}/>. Build a strictly better competitor from it:
                        </p>}
                        ko={<p>
                            <strong>Claim 3.30. <InlineMath math={"\\|x - m_0\\| = d(x, M)"}/>이면{" "}
                            <InlineMath math={"x - m_0 \\perp M"}/>이다.</strong> 대우로 간다.{" "}
                            <InlineMath math={"x - m_0"}/>이 <InlineMath math={"M"}/>과 직교하지{" "}
                            <em>않는다</em>고 하자. 그러면{" "}
                            <InlineMath math={"\\langle x - m_0, m \\rangle \\neq 0"}/>인{" "}
                            <InlineMath math={"m \\in M"}/>이 있고, 특히{" "}
                            <InlineMath math={"m \\neq 0"}/>이다. 그것으로 더 나은 경쟁자를 만든다.
                        </p>}
                    />
                    <BlockMath math={"\\tilde{m} := \\frac{m}{\\|m\\|} \\in M, \\qquad \\delta := \\langle x - m_0, \\tilde{m} \\rangle \\neq 0, \\qquad m_1 := m_0 + \\delta \\tilde{m} \\in M"}/>
                    <Terms items={[
                        ["\\tilde{m}", <T en={<>the offending direction, normalized so that <InlineMath math={"\\langle \\tilde{m}, \\tilde{m} \\rangle = 1"}/></>}
                                         ko={<>문제를 일으킨 방향. <InlineMath math={"\\langle \\tilde{m}, \\tilde{m} \\rangle = 1"}/>이 되도록 정규화한다</>}/>],
                        ["\\delta", <T en={<>how much of that direction the current error still contains; nonzero by assumption</>}
                                      ko={<>현재 오차가 아직 품고 있는 그 방향의 양. 가정에 의해 0이 아니다</>}/>],
                        ["m_1", <T en={<>the improved candidate; it stays in <InlineMath math={"M"}/> because <InlineMath math={"M"}/> is a subspace</>}
                                  ko={<>개선된 후보. <InlineMath math={"M"}/>이 부분 공간이라 <InlineMath math={"M"}/> 안에 남는다</>}/>],
                    ]}/>
                    <T en={<p>Now measure the new error.</p>} ko={<p>새 오차를 재 보자.</p>}/>
                    <BlockMath math={"\\begin{aligned} \\|x - m_1\\|^2 &= \\langle x - m_0 - \\delta \\tilde{m}, \\; x - m_0 - \\delta \\tilde{m} \\rangle \\\\ &= \\|x - m_0\\|^2 - \\delta \\underbrace{\\langle x - m_0, \\tilde{m} \\rangle}_{= \\, \\delta} - \\delta \\underbrace{\\langle \\tilde{m}, x - m_0 \\rangle}_{= \\, \\delta} + \\delta^2 \\underbrace{\\langle \\tilde{m}, \\tilde{m} \\rangle}_{= \\, 1} \\\\ &= \\|x - m_0\\|^2 - \\delta^2 \\;<\\; \\|x - m_0\\|^2 \\end{aligned}"}/>
                    <Terms items={[
                        ["\\delta^2", <T en={<>strictly positive, so the new error is strictly smaller: <InlineMath math={"m_0"}/> was not optimal</>}
                                        ko={<>양수이므로 새 오차가 확실히 더 작다. <InlineMath math={"m_0"}/>은 최적이 아니었다</>}/>],
                        ["\\langle \\tilde{m}, x - m_0 \\rangle", <T en={<>equal to <InlineMath math={"\\delta"}/> as well, by symmetry of the real inner product</>}
                                                                   ko={<>실내적의 대칭성에 의해 이것도 <InlineMath math={"\\delta"}/>다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            So <InlineMath math={"\\|x - m_0\\| \\neq d(x, M)"}/>, which proves the
                            contrapositive. Geometrically the step is exactly the Gram-Schmidt step: remove
                            the component of the error that still lies along a direction of{" "}
                            <InlineMath math={"M"}/>, and the error gets shorter.
                        </p>}
                        ko={<p>
                            따라서 <InlineMath math={"\\|x - m_0\\| \\neq d(x, M)"}/>이고 대우가 증명된다.
                            기하적으로 이 단계는 Gram-Schmidt 단계 그 자체다. 오차 중 아직{" "}
                            <InlineMath math={"M"}/>의 어떤 방향에 놓인 성분을 덜어 내면 오차가 짧아진다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>Claim 3.31. If <InlineMath math={"x - m_0 \\perp M"}/> then{" "}
                            <InlineMath math={"\\|x - m_0\\| = d(x, M)"}/> and{" "}
                            <InlineMath math={"m_0"}/> is unique.</strong> Let{" "}
                            <InlineMath math={"m \\in M"}/> be arbitrary. Then{" "}
                            <InlineMath math={"m_0 - m \\in M"}/>, so{" "}
                            <InlineMath math={"x - m_0 \\perp m_0 - m"}/> and the Pythagorean theorem
                            applies to the split below:
                        </p>}
                        ko={<p>
                            <strong>Claim 3.31. <InlineMath math={"x - m_0 \\perp M"}/>이면{" "}
                            <InlineMath math={"\\|x - m_0\\| = d(x, M)"}/>이고{" "}
                            <InlineMath math={"m_0"}/>은 유일하다.</strong>{" "}
                            <InlineMath math={"m \\in M"}/>을 임의로 잡자.{" "}
                            <InlineMath math={"m_0 - m \\in M"}/>이므로{" "}
                            <InlineMath math={"x - m_0 \\perp m_0 - m"}/>이고, 아래 분해에 피타고라스 정리를
                            쓸 수 있다.
                        </p>}
                    />
                    <BlockMath math={"\\|x - m\\|^2 = \\big\\| (x - m_0) + \\underbrace{(m_0 - m)}_{\\in \\, M} \\big\\|^2 = \\|x - m_0\\|^2 + \\|m_0 - m\\|^2"}/>
                    <Terms items={[
                        ["m_0 - m", <T en={<>a vector of <InlineMath math={"M"}/>, hence orthogonal to the error <InlineMath math={"x - m_0"}/></>}
                                      ko={<><InlineMath math={"M"}/>의 벡터이므로 오차 <InlineMath math={"x - m_0"}/>과 직교한다</>}/>],
                        ["\\|m_0 - m\\|^2", <T en={<>the only term that depends on <InlineMath math={"m"}/>, and it is never negative</>}
                                              ko={<><InlineMath math={"m"}/>에 의존하는 유일한 항이고, 결코 음수가 아니다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The right side is minimized by making the second term zero, which happens exactly
                            at <InlineMath math={"m = m_0"}/>. So{" "}
                            <InlineMath math={"\\inf_{m \\in M} \\|x - m\\|^2 = \\|x - m_0\\|^2"}/>, the
                            infimum is achieved, and the minimizer is unique because{" "}
                            <InlineMath math={"\\|m_0 - m\\| = 0"}/> forces{" "}
                            <InlineMath math={"m = m_0"}/> by clause 1 of Definition 3.1. The two claims
                            together give both parts of the lemma.
                        </p>}
                        ko={<p>
                            우변은 둘째 항을 0으로 만들 때 최소가 되고, 그것은 정확히{" "}
                            <InlineMath math={"m = m_0"}/>에서 일어난다. 따라서{" "}
                            <InlineMath math={"\\inf_{m \\in M} \\|x - m\\|^2 = \\|x - m_0\\|^2"}/>으로 infimum이
                            달성되고, Definition 3.1의 조항 1에 의해{" "}
                            <InlineMath math={"\\|m_0 - m\\| = 0"}/>이 <InlineMath math={"m = m_0"}/>을
                            강제하므로 최소화 벡터는 유일하다. 두 claim이 합쳐져 보조정리의 두 부분이 모두 나온다.
                        </p>}
                    />
                </Proof>
            </Lemma>
            <Definition n="3.32" title={<T en={<>Orthogonal complement</>} ko={<>직교 여공간</>}/>}>
                <T
                    en={<p>
                        For a subset <InlineMath math={"S \\subset \\mathcal{X}"}/>, which need not be a
                        subspace,
                    </p>}
                    ko={<p>
                        부분 공간이 아니어도 되는 부분집합{" "}
                        <InlineMath math={"S \\subset \\mathcal{X}"}/>에 대해
                    </p>}
                />
                <BlockMath math={"S^{\\perp} := \\{ x \\in \\mathcal{X} \\mid x \\perp S \\} = \\{ x \\in \\mathcal{X} \\mid \\langle x, y \\rangle = 0 \\text{ for all } y \\in S \\}"}/>
                <Terms items={[
                    ["S^{\\perp}", <T en={<>read "S perp": the set of vectors orthogonal to everything in <InlineMath math={"S"}/></>}
                                     ko={<>"S perp"라 읽는다. <InlineMath math={"S"}/>의 모든 것과 직교하는 벡터들의 집합이다</>}/>],
                    ["S", <T en={<>any subset; in <InlineMath math={"\\mathbb{R}^3"}/> the complement of a single vector is a plane</>}
                            ko={<>임의의 부분집합. <InlineMath math={"\\mathbb{R}^3"}/>에서 벡터 하나의 여공간은 평면이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Concretely, in <InlineMath math={"\\mathbb{R}^3"}/> take{" "}
                        <InlineMath math={"S = \\{(1,1,0)^\\top\\}"}/>. Then{" "}
                        <InlineMath math={"S^{\\perp} = \\{x : x_1 + x_2 = 0\\} = \\operatorname{span}\\{(1,-1,0)^\\top, (0,0,1)^\\top\\}"}/>,
                        a plane. Note that <InlineMath math={"S"}/> itself was not a subspace and{" "}
                        <InlineMath math={"S^{\\perp}"}/> is one anyway.
                    </p>}
                    ko={<p>
                        구체적으로 <InlineMath math={"\\mathbb{R}^3"}/>에서{" "}
                        <InlineMath math={"S = \\{(1,1,0)^\\top\\}"}/>이라 하자. 그러면{" "}
                        <InlineMath math={"S^{\\perp} = \\{x : x_1 + x_2 = 0\\} = \\operatorname{span}\\{(1,-1,0)^\\top, (0,0,1)^\\top\\}"}/>,
                        곧 평면이다. <InlineMath math={"S"}/> 자체는 부분 공간이 아니었는데도{" "}
                        <InlineMath math={"S^{\\perp}"}/>은 부분 공간이다.
                    </p>}
                />
            </Definition>
            <Proposition n="3.33" title={<T en={<><InlineMath math={"S^{\\perp}"}/> is always a subspace</>}
                                            ko={<><InlineMath math={"S^{\\perp}"}/>은 언제나 부분 공간이다</>}/>}>
                <T
                    en={<p>
                        For any subset <InlineMath math={"S"}/>, the set{" "}
                        <InlineMath math={"S^{\\perp}"}/> is a subspace of{" "}
                        <InlineMath math={"\\mathcal{X}"}/>. Moreover, if{" "}
                        <InlineMath math={"M = \\operatorname{span}\\{y^1, \\ldots, y^k\\}"}/>, then
                    </p>}
                    ko={<p>
                        임의의 부분집합 <InlineMath math={"S"}/>에 대해{" "}
                        <InlineMath math={"S^{\\perp}"}/>은 <InlineMath math={"\\mathcal{X}"}/>의 부분
                        공간이다. 나아가{" "}
                        <InlineMath math={"M = \\operatorname{span}\\{y^1, \\ldots, y^k\\}"}/>이면
                    </p>}
                />
                <BlockMath math={"x \\in M^{\\perp} \\iff \\langle x, y^i \\rangle = 0, \\quad 1 \\le i \\le k"}/>
                <Terms items={[
                    ["y^i", <T en={<>the spanning vectors; checking <InlineMath math={"k"}/> equations replaces checking infinitely many</>}
                              ko={<>span을 만드는 벡터들. 무한히 많은 조건을 확인하는 대신 <InlineMath math={"k"}/>개의 등식만 확인하면 된다</>}/>],
                    ["k", <T en={<>the number of spanning vectors, typically the dimension of <InlineMath math={"M"}/></>}
                            ko={<>span을 만드는 벡터의 개수. 보통 <InlineMath math={"M"}/>의 차원이다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            The notes leave this as an exercise. <strong>Subspace.</strong>{" "}
                            <InlineMath math={"0 \\in S^{\\perp}"}/> because{" "}
                            <InlineMath math={"\\langle 0, y \\rangle = 0"}/> always, so the set is nonempty.
                            Take <InlineMath math={"x^1, x^2 \\in S^{\\perp}"}/>,{" "}
                            <InlineMath math={"\\alpha_1, \\alpha_2 \\in \\mathbb{R}"}/> and any{" "}
                            <InlineMath math={"y \\in S"}/>. Linearity in the left argument gives
                        </p>}
                        ko={<p>
                            원 교재는 이것을 연습 문제로 남긴다. <strong>부분 공간임.</strong> 언제나{" "}
                            <InlineMath math={"\\langle 0, y \\rangle = 0"}/>이므로{" "}
                            <InlineMath math={"0 \\in S^{\\perp}"}/>이고 집합이 공집합이 아니다.{" "}
                            <InlineMath math={"x^1, x^2 \\in S^{\\perp}"}/>,{" "}
                            <InlineMath math={"\\alpha_1, \\alpha_2 \\in \\mathbb{R}"}/>과 임의의{" "}
                            <InlineMath math={"y \\in S"}/>를 잡으면 왼쪽 인자의 선형성에 의해
                        </p>}
                    />
                    <BlockMath math={"\\langle \\alpha_1 x^1 + \\alpha_2 x^2, \\; y \\rangle = \\alpha_1 \\underbrace{\\langle x^1, y \\rangle}_{= \\, 0} + \\alpha_2 \\underbrace{\\langle x^2, y \\rangle}_{= \\, 0} = 0"}/>
                    <Terms items={[
                        ["\\alpha_1 x^1 + \\alpha_2 x^2", <T en={<>a general linear combination; showing it stays in the set is Proposition 2.8(d) from Chapter 2</>}
                                                            ko={<>일반적인 선형 결합. 그것이 집합 안에 남음을 보이는 것이 2장 Proposition 2.8(d)다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>The span characterization.</strong> One direction is free: if{" "}
                            <InlineMath math={"x \\perp M"}/> then in particular{" "}
                            <InlineMath math={"x \\perp y^i"}/> since each{" "}
                            <InlineMath math={"y^i \\in M"}/>. Conversely, suppose{" "}
                            <InlineMath math={"\\langle x, y^i \\rangle = 0"}/> for every{" "}
                            <InlineMath math={"i"}/> and let{" "}
                            <InlineMath math={"m = \\sum_i \\alpha_i y^i"}/> be any element of{" "}
                            <InlineMath math={"M"}/>. Then
                        </p>}
                        ko={<p>
                            <strong>span 판정.</strong> 한쪽은 공짜다.{" "}
                            <InlineMath math={"x \\perp M"}/>이면 각{" "}
                            <InlineMath math={"y^i \\in M"}/>이므로 특히{" "}
                            <InlineMath math={"x \\perp y^i"}/>다. 반대로 모든{" "}
                            <InlineMath math={"i"}/>에 대해{" "}
                            <InlineMath math={"\\langle x, y^i \\rangle = 0"}/>이라 하고{" "}
                            <InlineMath math={"M"}/>의 임의의 원소{" "}
                            <InlineMath math={"m = \\sum_i \\alpha_i y^i"}/>를 잡으면
                        </p>}
                    />
                    <BlockMath math={"\\langle x, m \\rangle = \\left\\langle x, \\; \\sum_{i=1}^{k} \\alpha_i y^i \\right\\rangle = \\sum_{i=1}^{k} \\alpha_i \\underbrace{\\langle x, y^i \\rangle}_{= \\, 0} = 0"}/>
                    <Terms items={[
                        ["\\sum_i \\alpha_i y^i", <T en={<>a general element of <InlineMath math={"M"}/>: every one of them is reached by some choice of coefficients</>}
                                                    ko={<><InlineMath math={"M"}/>의 일반 원소. 계수를 잘 고르면 어떤 원소든 여기서 나온다</>}/>],
                        ["\\alpha_i", <T en={<>real scalars, pulled out of the right slot with no conjugate because <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/></>}
                                        ko={<>실수 스칼라. <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/>이라 켤레 없이 오른쪽 자리에서 빠져나온다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            This is what makes orthogonality checkable in practice: to test a vector against
                            an entire subspace you only test it against a basis.
                        </p>}
                        ko={<p>
                            직교성을 실제로 확인할 수 있게 만드는 것이 이 사실이다. 벡터 하나를 부분 공간 전체에
                            대고 시험하려면 기저에만 대고 시험하면 된다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Proposition n="3.34" title={<T en={<>Orthogonal decomposition</>} ko={<>직교 분해</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"\\mathcal{X}"}/> be a finite-dimensional inner product space
                        and <InlineMath math={"M"}/> a subspace. Then
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{X}"}/>가 유한 차원 내적 공간이고{" "}
                        <InlineMath math={"M"}/>이 부분 공간이면
                    </p>}
                />
                <BlockMath math={"\\mathcal{X} = M \\oplus M^{\\perp}"}/>
                <Terms items={[
                    ["\\oplus", <T en={<>direct sum: every <InlineMath math={"x"}/> is <InlineMath math={"m + m^{\\perp}"}/> for a <strong>unique</strong> pair, which is equivalent to <InlineMath math={"M \\cap M^{\\perp} = \\{0\\}"}/></>}
                                  ko={<>직합. 모든 <InlineMath math={"x"}/>가 <strong>유일한</strong> 쌍으로 <InlineMath math={"m + m^{\\perp}"}/>이 되며, 이는 <InlineMath math={"M \\cap M^{\\perp} = \\{0\\}"}/>과 동치다</>}/>],
                    ["M^{\\perp}", <T en={<>the orthogonal complement of <InlineMath math={"M"}/>, a subspace by Proposition 3.33</>}
                                     ko={<><InlineMath math={"M"}/>의 직교 여공간. Proposition 3.33에 의해 부분 공간이다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            <strong>The intersection is trivial.</strong> If{" "}
                            <InlineMath math={"x \\in M \\cap M^{\\perp}"}/> then{" "}
                            <InlineMath math={"x"}/> is orthogonal to everything in{" "}
                            <InlineMath math={"M"}/>, including itself, so{" "}
                            <InlineMath math={"\\langle x, x \\rangle = 0"}/> and clause 3 of Definition 3.11
                            gives <InlineMath math={"x = 0"}/>. That single line is where positive
                            definiteness of the inner product earns its keep.
                        </p>}
                        ko={<p>
                            <strong>교집합이 자명하다.</strong>{" "}
                            <InlineMath math={"x \\in M \\cap M^{\\perp}"}/>이면{" "}
                            <InlineMath math={"x"}/>가 <InlineMath math={"M"}/>의 모든 것과, 자기 자신과도
                            직교하므로 <InlineMath math={"\\langle x, x \\rangle = 0"}/>이고 Definition 3.11의
                            조항 3에 의해 <InlineMath math={"x = 0"}/>이다. 내적의 양의 정의성이 값을 하는 자리가
                            이 한 줄이다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>The sum is everything.</strong> Let{" "}
                            <InlineMath math={"\\{y^1, \\ldots, y^k\\}"}/> be a basis of{" "}
                            <InlineMath math={"M"}/>. By Corollary 2.35 of Chapter 2 it extends to a basis{" "}
                            <InlineMath math={"\\{y^1, \\ldots, y^k, y^{k+1}, \\ldots, y^n\\}"}/> of{" "}
                            <InlineMath math={"\\mathcal{X}"}/>. Apply Gram-Schmidt to that list to get an
                            orthonormal basis <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> whose first{" "}
                            <InlineMath math={"k"}/> vectors span <InlineMath math={"M"}/>, the span
                            preservation being exactly what Proposition 3.19 guaranteed. Now expand any{" "}
                            <InlineMath math={"x"}/> and compute an inner product against{" "}
                            <InlineMath math={"v^i"}/> with <InlineMath math={"i \\le k"}/>:
                        </p>}
                        ko={<p>
                            <strong>합이 전체다.</strong>{" "}
                            <InlineMath math={"\\{y^1, \\ldots, y^k\\}"}/>를 <InlineMath math={"M"}/>의
                            기저라 하자. 2장 Corollary 2.35에 의해 이것은{" "}
                            <InlineMath math={"\\mathcal{X}"}/>의 기저{" "}
                            <InlineMath math={"\\{y^1, \\ldots, y^k, y^{k+1}, \\ldots, y^n\\}"}/>으로 확장된다.
                            그 목록에 Gram-Schmidt를 돌리면 앞 <InlineMath math={"k"}/>개가{" "}
                            <InlineMath math={"M"}/>을 만드는 orthonormal 기저{" "}
                            <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>을 얻는다. span이 보존된다는 것이
                            Proposition 3.19가 보장한 바로 그것이다. 이제 임의의{" "}
                            <InlineMath math={"x"}/>를 전개하고 <InlineMath math={"i \\le k"}/>인{" "}
                            <InlineMath math={"v^i"}/>와 내적을 계산하자.
                        </p>}
                    />
                    <BlockMath math={"x = \\sum_{j=1}^{n} \\alpha_j v^j \\quad \\Longrightarrow \\quad \\langle x, v^i \\rangle = \\sum_{j=1}^{n} \\alpha_j \\langle v^j, v^i \\rangle = \\alpha_i"}/>
                    <Terms items={[
                        ["\\alpha_j", <T en={<>the coordinates of <InlineMath math={"x"}/> in the orthonormal basis</>}
                                        ko={<>orthonormal 기저에서 <InlineMath math={"x"}/>의 좌표</>}/>],
                        ["\\langle v^j, v^i \\rangle", <T en={<><InlineMath math={"1"}/> when <InlineMath math={"j = i"}/> and <InlineMath math={"0"}/> otherwise, which is the whole reason the sum collapses</>}
                                                         ko={<><InlineMath math={"j = i"}/>이면 <InlineMath math={"1"}/>, 아니면 <InlineMath math={"0"}/>. 합이 주저앉는 이유의 전부다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            So <InlineMath math={"x \\perp M"}/> holds if and only if{" "}
                            <InlineMath math={"\\alpha_1 = \\cdots = \\alpha_k = 0"}/>, which says{" "}
                            <InlineMath math={"M^{\\perp} = \\operatorname{span}\\{v^{k+1}, \\ldots, v^n\\}"}/>.
                            Splitting the expansion at <InlineMath math={"k"}/> writes any{" "}
                            <InlineMath math={"x"}/> as a member of <InlineMath math={"M"}/> plus a member of{" "}
                            <InlineMath math={"M^{\\perp}"}/>, and the intersection argument makes that
                            splitting unique. A by-product worth keeping:{" "}
                            <InlineMath math={"\\dim M + \\dim M^{\\perp} = n"}/>.
                        </p>}
                        ko={<p>
                            따라서 <InlineMath math={"x \\perp M"}/>일 필요충분조건은{" "}
                            <InlineMath math={"\\alpha_1 = \\cdots = \\alpha_k = 0"}/>이고, 이는{" "}
                            <InlineMath math={"M^{\\perp} = \\operatorname{span}\\{v^{k+1}, \\ldots, v^n\\}"}/>이라는
                            뜻이다. 전개를 <InlineMath math={"k"}/>에서 자르면 임의의{" "}
                            <InlineMath math={"x"}/>가 <InlineMath math={"M"}/>의 원소와{" "}
                            <InlineMath math={"M^{\\perp}"}/>의 원소의 합으로 적히고, 교집합 논증이 그 분해를
                            유일하게 만든다. 챙겨 둘 부산물이 하나 있다.{" "}
                            <InlineMath math={"\\dim M + \\dim M^{\\perp} = n"}/>이다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Theorem n="3.36" title={<T en={<>Classical Projection Theorem</>} ko={<>고전적 사영 정리</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\mathbb{R})"}/> be a finite-dimensional real
                        inner product space and <InlineMath math={"M"}/> a subspace. Then for every{" "}
                        <InlineMath math={"x \\in \\mathcal{X}"}/> there exists a{" "}
                        <strong>unique</strong> <InlineMath math={"\\hat{x} \\in M"}/> with
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathbb{R})"}/>이 유한 차원 실내적 공간이고{" "}
                        <InlineMath math={"M"}/>이 부분 공간이라 하자. 그러면 모든{" "}
                        <InlineMath math={"x \\in \\mathcal{X}"}/>에 대해 다음을 만족하는{" "}
                        <strong>유일한</strong> <InlineMath math={"\\hat{x} \\in M"}/>이 존재한다.
                    </p>}
                />
                <BlockMath math={"\\|x - \\hat{x}\\| = d(x, M) := \\inf_{m \\in M} \\|x - m\\| = \\min_{m \\in M} \\|x - m\\|, \\qquad x - \\hat{x} \\perp M"}/>
                <Terms items={[
                    ["\\hat{x}", <T en={<>the orthogonal projection of <InlineMath math={"x"}/> onto <InlineMath math={"M"}/></>}
                                   ko={<><InlineMath math={"x"}/>를 <InlineMath math={"M"}/>에 내린 직교 사영</>}/>],
                    ["\\min", <T en={<>written instead of <InlineMath math={"\\inf"}/> because the theorem proves the infimum is achieved</>}
                                ko={<>infimum이 달성됨을 정리가 증명하므로 <InlineMath math={"\\inf"}/> 대신 이렇게 쓴다</>}/>],
                    ["x - \\hat{x} \\perp M", <T en={<>the characterization: it is what you check, and what the normal equations impose</>}
                                                ko={<>판정 조건. 실제로 확인하는 것이고, normal equation이 부과하는 것이다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            Lemma 3.29 has already done the hard part: if some{" "}
                            <InlineMath math={"\\hat{x} \\in M"}/> satisfies{" "}
                            <InlineMath math={"(x - \\hat{x}) \\perp M"}/>, then it is the unique minimizer.
                            So only existence is left, and Proposition 3.34 hands it over. Since{" "}
                            <InlineMath math={"\\mathcal{X} = M \\oplus M^{\\perp}"}/>, there are{" "}
                            <InlineMath math={"\\hat{x} \\in M"}/> and{" "}
                            <InlineMath math={"m^{\\perp} \\in M^{\\perp}"}/> with
                        </p>}
                        ko={<p>
                            어려운 부분은 Lemma 3.29가 이미 끝냈다. 어떤{" "}
                            <InlineMath math={"\\hat{x} \\in M"}/>이{" "}
                            <InlineMath math={"(x - \\hat{x}) \\perp M"}/>을 만족하면 그것이 유일한 최소화
                            벡터다. 그러니 남은 것은 존재뿐이고, Proposition 3.34가 그것을 건네준다.{" "}
                            <InlineMath math={"\\mathcal{X} = M \\oplus M^{\\perp}"}/>이므로
                        </p>}
                    />
                    <BlockMath math={"x = \\hat{x} + m^{\\perp} \\quad \\Longrightarrow \\quad x - \\hat{x} = m^{\\perp} \\in M^{\\perp} \\quad \\Longrightarrow \\quad (x - \\hat{x}) \\perp M"}/>
                    <Terms items={[
                        ["m^{\\perp}", <T en={<>the component of <InlineMath math={"x"}/> that no element of <InlineMath math={"M"}/> can reach: the irreducible part of the error</>}
                                         ko={<><InlineMath math={"M"}/>의 어떤 원소도 닿을 수 없는 <InlineMath math={"x"}/>의 성분. 줄일 수 없는 오차다</>}/>],
                        ["\\hat{x}", <T en={<>the <InlineMath math={"M"}/>-component of the same decomposition, which is therefore the minimizer</>}
                                       ko={<>같은 분해의 <InlineMath math={"M"}/> 성분. 그래서 그것이 최소화 벡터다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The finite-dimensional hypothesis is doing real work here, through Proposition
                            3.34. In infinite dimensions the decomposition needs{" "}
                            <InlineMath math={"\\mathcal{X}"}/> complete and{" "}
                            <InlineMath math={"M"}/> closed, both of which come free when{" "}
                            <InlineMath math={"\\dim \\mathcal{X} < \\infty"}/>. Chapter 6 is where those
                            words get defined.
                        </p>}
                        ko={<p>
                            유한 차원이라는 가정이 여기서 Proposition 3.34를 통해 실제로 일을 한다. 무한
                            차원에서는 그 분해에 <InlineMath math={"\\mathcal{X}"}/>가 완비이고{" "}
                            <InlineMath math={"M"}/>이 닫혀 있어야 하는데,{" "}
                            <InlineMath math={"\\dim \\mathcal{X} < \\infty"}/>이면 둘 다 공짜로 따라온다. 그
                            단어들이 정의되는 곳이 6장이다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <T
                en={<p>
                    The figure below is the theorem. Drag the point and the residual stays perpendicular; the
                    dashed circle through the foot of the perpendicular is tangent to the subspace, which is
                    the picture version of "no other point is closer".
                </p>}
                ko={<p>
                    아래 그림이 곧 정리다. 점을 끌어도 잔차는 계속 수직으로 남고, 수선의 발을 지나는 점선 원이
                    부분 공간에 접한다. "다른 어떤 점도 더 가깝지 않다"의 그림판이다.
                </p>}
            />
            <CanvasFigure label={t("The residual meets the subspace at a right angle",
                "잔차는 부분 공간과 직각으로 만난다")}
                          modal={<ProjectionExplorer width={720} height={430}/>}
                          bodyClassName="w-[min(94vw,760px)]">
                <ProjectionExplorer/>
            </CanvasFigure>
            <T
                en={<p>
                    Now turn the right angle into arithmetic. Write the unknown projection in a basis of{" "}
                    <InlineMath math={"M"}/> and impose orthogonality against each basis vector, which
                    Proposition 3.33 says is enough:
                </p>}
                ko={<p>
                    이제 그 직각을 산술로 바꾼다. 모르는 사영을 <InlineMath math={"M"}/>의 기저로 적고, 각 기저
                    벡터에 대해 직교성을 부과한다. Proposition 3.33이 그것으로 충분하다고 말한다.
                </p>}
            />
            <BlockMath math={"\\hat{x} = \\alpha_1 y^1 + \\cdots + \\alpha_k y^k, \\qquad (x - \\hat{x}) \\perp M \\iff \\langle \\hat{x}, y^i \\rangle = \\langle x, y^i \\rangle, \\;\\; 1 \\le i \\le k"}/>
            <Terms items={[
                ["y^1, \\ldots, y^k", <T en={<>any basis of <InlineMath math={"M"}/>, not necessarily orthogonal: that is the point of what follows</>}
                                        ko={<><InlineMath math={"M"}/>의 임의의 기저. 직교하지 않아도 된다. 뒤에 오는 내용의 요점이 그것이다</>}/>],
                ["\\alpha_i", <T en={<>the unknowns, <InlineMath math={"k"}/> real numbers</>}
                                ko={<>미지수. 실수 <InlineMath math={"k"}/>개다</>}/>],
                ["\\langle \\hat{x}, y^i \\rangle = \\langle x, y^i \\rangle", <T en={<>the orthogonality condition after moving <InlineMath math={"\\hat{x}"}/> to the other side of <InlineMath math={"\\langle x - \\hat{x}, y^i \\rangle = 0"}/></>}
                                                                                ko={<><InlineMath math={"\\langle x - \\hat{x}, y^i \\rangle = 0"}/>에서 <InlineMath math={"\\hat{x}"}/>을 반대쪽으로 옮긴 직교 조건</>}/>],
            ]}/>
            <T
                en={<p>
                    Substituting the expansion and using linearity in the left argument gives{" "}
                    <InlineMath math={"k"}/> linear equations in the <InlineMath math={"k"}/> unknowns{" "}
                    <InlineMath math={"\\alpha_i"}/>:
                </p>}
                ko={<p>
                    전개를 대입하고 왼쪽 인자의 선형성을 쓰면 미지수{" "}
                    <InlineMath math={"\\alpha_i"}/> <InlineMath math={"k"}/>개에 대한 일차 방정식{" "}
                    <InlineMath math={"k"}/>개가 나온다.
                </p>}
            />
            <BlockMath math={"\\begin{aligned} \\alpha_1 \\langle y^1, y^1 \\rangle + \\cdots + \\alpha_k \\langle y^k, y^1 \\rangle &= \\langle x, y^1 \\rangle \\\\ &\\;\\;\\vdots \\\\ \\alpha_1 \\langle y^1, y^k \\rangle + \\cdots + \\alpha_k \\langle y^k, y^k \\rangle &= \\langle x, y^k \\rangle \\end{aligned}"}/>
            <Terms items={[
                ["\\langle y^j, y^i \\rangle", <T en={<>the coefficient multiplying <InlineMath math={"\\alpha_j"}/> in the <InlineMath math={"i"}/>-th equation: it depends only on the basis, not on <InlineMath math={"x"}/></>}
                                                 ko={<><InlineMath math={"i"}/>번째 식에서 <InlineMath math={"\\alpha_j"}/>에 곱해지는 계수. <InlineMath math={"x"}/>가 아니라 기저에만 의존한다</>}/>],
                ["\\langle x, y^i \\rangle", <T en={<>the right-hand side: the only place the data <InlineMath math={"x"}/> enters</>}
                                               ko={<>우변. 데이터 <InlineMath math={"x"}/>가 들어오는 유일한 자리다</>}/>],
            ]}/>
            <Definition n="3.39" title={<T en={<>Normal equations and the Gram matrix</>} ko={<>normal equation과 Gram 행렬</>}/>}>
                <T
                    en={<p>
                        The system above is called the <strong>normal equations</strong>. In matrix form:
                    </p>}
                    ko={<p>
                        위 연립방정식을 <strong>normal equation</strong>이라 한다. 행렬로 적으면
                    </p>}
                />
                <BlockMath math={"G^{\\top} \\alpha = \\beta, \\qquad G_{ij} := \\langle y^i, y^j \\rangle, \\qquad \\beta_i := \\langle x, y^i \\rangle"}/>
                <Terms items={[
                    ["G", <T en={<>the <strong>Gram matrix</strong> of the basis, <InlineMath math={"k \\times k"}/>; over <InlineMath math={"\\mathbb{R}"}/> it is symmetric, so <InlineMath math={"G^\\top = G"}/> and the transpose is cosmetic</>}
                            ko={<>기저의 <strong>Gram 행렬</strong>. <InlineMath math={"k \\times k"}/>이고 <InlineMath math={"\\mathbb{R}"}/> 위에서는 대칭이라 <InlineMath math={"G^\\top = G"}/>여서 전치는 형식일 뿐이다</>}/>],
                    ["\\alpha", <T en={<>the column of unknown coefficients <InlineMath math={"(\\alpha_1, \\ldots, \\alpha_k)^\\top"}/></>}
                                  ko={<>모르는 계수들의 열 <InlineMath math={"(\\alpha_1, \\ldots, \\alpha_k)^\\top"}/></>}/>],
                    ["\\beta", <T en={<>the column of data, <InlineMath math={"k"}/> inner products of <InlineMath math={"x"}/> against the basis</>}
                                 ko={<>데이터의 열. <InlineMath math={"x"}/>와 기저의 내적 <InlineMath math={"k"}/>개다</>}/>],
                ]}/>
                <BlockMath math={"G = \\begin{bmatrix} \\langle y^1, y^1 \\rangle & \\cdots & \\langle y^1, y^k \\rangle \\\\ \\vdots & \\ddots & \\vdots \\\\ \\langle y^k, y^1 \\rangle & \\cdots & \\langle y^k, y^k \\rangle \\end{bmatrix}, \\qquad \\beta = \\begin{bmatrix} \\langle x, y^1 \\rangle \\\\ \\vdots \\\\ \\langle x, y^k \\rangle \\end{bmatrix}"}/>
                <Terms items={[
                    ["G_{ii}", <T en={<>the diagonal entries <InlineMath math={"\\|y^i\\|^2"}/>, always strictly positive for a basis</>}
                                 ko={<>대각 성분 <InlineMath math={"\\|y^i\\|^2"}/>. 기저라면 언제나 양수다</>}/>],
                    ["G_{ij}", <T en={<>the off-diagonal entries, zero exactly when the basis is orthogonal: an orthonormal basis makes <InlineMath math={"G = I"}/> and the system trivial</>}
                                 ko={<>비대각 성분. 기저가 직교일 때만 0이며, orthonormal 기저라면 <InlineMath math={"G = I"}/>가 되어 연립방정식이 자명해진다</>}/>],
                ]}/>
            </Definition>
            <Proposition n="3.41" title={<T en={<>Invertibility of the Gram matrix</>} ko={<>Gram 행렬의 가역성</>}/>}>
                <BlockMath math={"\\det G(y^1, \\ldots, y^k) \\neq 0 \\iff \\{y^1, \\ldots, y^k\\} \\text{ is linearly independent}"}/>
                <Terms items={[
                    ["\\det G", <T en={<>the Gram determinant; nonzero exactly when the normal equations have one solution</>}
                                  ko={<>Gram 행렬식. normal equation의 해가 하나일 때만 0이 아니다</>}/>],
                    ["\\{y^1, \\ldots, y^k\\}", <T en={<>the spanning set; if it is dependent, <InlineMath math={"\\hat{x}"}/> still exists but its coefficients do not</>}
                                                  ko={<>span을 만드는 집합. 종속이면 <InlineMath math={"\\hat{x}"}/>은 여전히 존재하지만 그 계수는 존재하지 않는다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            Show instead that <InlineMath math={"G^\\top \\alpha = 0"}/> has only the zero
                            solution. Reading the construction backwards,{" "}
                            <InlineMath math={"G^\\top \\alpha = 0"}/> says precisely that the vector{" "}
                            <InlineMath math={"w := \\alpha_1 y^1 + \\cdots + \\alpha_k y^k"}/> is orthogonal
                            to every <InlineMath math={"y^i"}/>, hence by Proposition 3.33 to all of{" "}
                            <InlineMath math={"M"}/>:
                        </p>}
                        ko={<p>
                            대신 <InlineMath math={"G^\\top \\alpha = 0"}/>의 해가 0뿐임을 보이자. 구성을
                            거꾸로 읽으면 <InlineMath math={"G^\\top \\alpha = 0"}/>은 벡터{" "}
                            <InlineMath math={"w := \\alpha_1 y^1 + \\cdots + \\alpha_k y^k"}/>가 모든{" "}
                            <InlineMath math={"y^i"}/>와, 따라서 Proposition 3.33에 의해{" "}
                            <InlineMath math={"M"}/> 전체와 직교한다는 말이다.
                        </p>}
                    />
                    <BlockMath math={"w \\in M \\;\\text{ and }\\; w \\in M^{\\perp} \\quad \\Longrightarrow \\quad w \\in M \\cap M^{\\perp} = \\{0\\} \\quad \\Longrightarrow \\quad w = 0"}/>
                    <Terms items={[
                        ["w", <T en={<>a linear combination of the <InlineMath math={"y^i"}/>, so it lies in <InlineMath math={"M"}/> by construction</>}
                                ko={<><InlineMath math={"y^i"}/>들의 선형 결합이므로 구성상 <InlineMath math={"M"}/>에 있다</>}/>],
                        ["M \\cap M^{\\perp} = \\{0\\}", <T en={<>from the proof of Proposition 3.34</>}
                                                           ko={<>Proposition 3.34의 증명에서 나온 사실</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            So <InlineMath math={"\\alpha_1 y^1 + \\cdots + \\alpha_k y^k = 0"}/>. If the{" "}
                            <InlineMath math={"y^i"}/> are independent this forces every{" "}
                            <InlineMath math={"\\alpha_i = 0"}/>, so the null space of{" "}
                            <InlineMath math={"G^\\top"}/> is trivial and{" "}
                            <InlineMath math={"\\det G \\neq 0"}/>. If they are dependent, some nonzero{" "}
                            <InlineMath math={"\\alpha"}/> gives that same zero combination, so{" "}
                            <InlineMath math={"G^\\top \\alpha = 0"}/> has a nonzero solution and{" "}
                            <InlineMath math={"\\det G = 0"}/>. That covers both directions.
                        </p>}
                        ko={<p>
                            따라서 <InlineMath math={"\\alpha_1 y^1 + \\cdots + \\alpha_k y^k = 0"}/>이다.{" "}
                            <InlineMath math={"y^i"}/>가 독립이면 모든{" "}
                            <InlineMath math={"\\alpha_i = 0"}/>이 강제되므로{" "}
                            <InlineMath math={"G^\\top"}/>의 null space가 자명하고{" "}
                            <InlineMath math={"\\det G \\neq 0"}/>이다. 종속이면 0이 아닌 어떤{" "}
                            <InlineMath math={"\\alpha"}/>가 같은 영 결합을 주므로{" "}
                            <InlineMath math={"G^\\top \\alpha = 0"}/>에 0이 아닌 해가 있고{" "}
                            <InlineMath math={"\\det G = 0"}/>이다. 양쪽 방향이 모두 덮인다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Remark n="3.42" title={<T en={<>The whole recipe on one line</>} ko={<>전체 절차를 한 줄로</>}/>}>
                <T
                    en={<p>
                        Assume <InlineMath math={"\\{y^1, \\ldots, y^k\\}"}/> is linearly independent and{" "}
                        <InlineMath math={"M := \\operatorname{span}\\{y^1, \\ldots, y^k\\}"}/>. Then{" "}
                        <InlineMath math={"\\hat{x} = \\operatorname{arg\\,min}_{m \\in M} \\|x - m\\|"}/> if
                        and only if
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\{y^1, \\ldots, y^k\\}"}/>이 선형 독립이고{" "}
                        <InlineMath math={"M := \\operatorname{span}\\{y^1, \\ldots, y^k\\}"}/>이라 하자.
                        그러면 <InlineMath math={"\\hat{x} = \\operatorname{arg\\,min}_{m \\in M} \\|x - m\\|"}/>일
                        필요충분조건은
                    </p>}
                />
                <BlockMath math={"\\hat{x} = \\sum_{i=1}^{k} \\alpha_i y^i, \\qquad G^{\\top} \\alpha = \\beta, \\qquad G_{ij} = \\langle y^i, y^j \\rangle, \\qquad \\beta_i = \\langle x, y^i \\rangle"}/>
                <Terms items={[
                    ["\\hat{x}", <T en={<>the best approximation, guaranteed to exist and be unique by Theorem 3.36</>}
                                   ko={<>최선의 근사. Theorem 3.36이 존재와 유일성을 보장한다</>}/>],
                    ["G^{\\top} \\alpha = \\beta", <T en={<>a <InlineMath math={"k \\times k"}/> linear system with an invertible matrix, by Proposition 3.41</>}
                                                     ko={<>Proposition 3.41에 의해 가역 행렬을 가진 <InlineMath math={"k \\times k"}/> 선형계</>}/>],
                    ["\\langle \\cdot, \\cdot \\rangle", <T en={<>the only thing that changes between applications: swap the inner product and the same four lines solve a different problem</>}
                                                           ko={<>응용마다 바뀌는 유일한 것. 내적만 갈아 끼우면 같은 네 줄이 다른 문제를 푼다</>}/>],
                ]}/>
            </Remark>
            <Example title={<T en={<>A projection in <InlineMath math={"\\mathbb{R}^3"}/> with real numbers</>}
                              ko={<>숫자로 하는 <InlineMath math={"\\mathbb{R}^3"}/>의 사영</>}/>}>
                <T
                    en={<p>
                        Project <InlineMath math={"x = (1, 2, 4)^\\top"}/> onto the plane{" "}
                        <InlineMath math={"M = \\operatorname{span}\\{y^1, y^2\\}"}/> with{" "}
                        <InlineMath math={"y^1 = (1,1,0)^\\top"}/> and{" "}
                        <InlineMath math={"y^2 = (0,1,1)^\\top"}/>, under the ordinary dot product. Build the
                        two objects the recipe asks for:
                    </p>}
                    ko={<p>
                        보통의 dot product 아래에서 <InlineMath math={"x = (1, 2, 4)^\\top"}/>을{" "}
                        <InlineMath math={"y^1 = (1,1,0)^\\top"}/>,{" "}
                        <InlineMath math={"y^2 = (0,1,1)^\\top"}/>이 만드는 평면{" "}
                        <InlineMath math={"M = \\operatorname{span}\\{y^1, y^2\\}"}/>에 사영하자. 절차가
                        요구하는 두 대상을 만든다.
                    </p>}
                />
                <BlockMath math={"G = \\begin{bmatrix} 2 & 1 \\\\ 1 & 2 \\end{bmatrix}, \\qquad \\beta = \\begin{bmatrix} \\langle x, y^1 \\rangle \\\\ \\langle x, y^2 \\rangle \\end{bmatrix} = \\begin{bmatrix} 1 + 2 + 0 \\\\ 0 + 2 + 4 \\end{bmatrix} = \\begin{bmatrix} 3 \\\\ 6 \\end{bmatrix}"}/>
                <Terms items={[
                    ["G_{11} = 2", <T en={<><InlineMath math={"\\|y^1\\|^2 = 1 + 1 + 0"}/></>}
                                     ko={<><InlineMath math={"\\|y^1\\|^2 = 1 + 1 + 0"}/></>}/>],
                    ["G_{12} = 1", <T en={<><InlineMath math={"\\langle y^1, y^2 \\rangle = 0 + 1 + 0"}/>; nonzero, so the basis is not orthogonal and the system genuinely couples</>}
                                     ko={<><InlineMath math={"\\langle y^1, y^2 \\rangle = 0 + 1 + 0"}/>. 0이 아니므로 기저가 직교가 아니고 연립방정식이 실제로 얽힌다</>}/>],
                    ["\\det G = 3", <T en={<>nonzero, confirming independence through Proposition 3.41</>}
                                      ko={<>0이 아니다. Proposition 3.41을 통해 독립임이 확인된다</>}/>],
                ]}/>
                <BlockMath math={"\\alpha = G^{-1}\\beta = \\frac{1}{3}\\begin{bmatrix} 2 & -1 \\\\ -1 & 2 \\end{bmatrix}\\begin{bmatrix} 3 \\\\ 6 \\end{bmatrix} = \\frac{1}{3}\\begin{bmatrix} 0 \\\\ 9 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 3 \\end{bmatrix}"}/>
                <Terms items={[
                    ["G^{-1}", <T en={<>the inverse <InlineMath math={"\\tfrac{1}{\\det G}\\left[\\begin{smallmatrix} d & -b \\\\ -c & a \\end{smallmatrix}\\right]"}/> for a <InlineMath math={"2 \\times 2"}/></>}
                                 ko={<><InlineMath math={"2 \\times 2"}/> 역행렬 공식 <InlineMath math={"\\tfrac{1}{\\det G}\\left[\\begin{smallmatrix} d & -b \\\\ -c & a \\end{smallmatrix}\\right]"}/></>}/>],
                    ["\\alpha = (0, 3)^\\top", <T en={<>the coefficients: the projection turns out to use none of <InlineMath math={"y^1"}/></>}
                                                 ko={<>계수. 사영이 <InlineMath math={"y^1"}/>을 전혀 쓰지 않는 것으로 밝혀졌다</>}/>],
                ]}/>
                <BlockMath math={"\\hat{x} = 0 \\cdot y^1 + 3 \\cdot y^2 = \\begin{bmatrix} 0 \\\\ 3 \\\\ 3 \\end{bmatrix}, \\qquad x - \\hat{x} = \\begin{bmatrix} 1 \\\\ -1 \\\\ 1 \\end{bmatrix}, \\qquad d(x, M) = \\sqrt{3}"}/>
                <Terms items={[
                    ["\\hat{x}", <T en={<>the closest point of the plane to <InlineMath math={"x"}/></>}
                                   ko={<>평면에서 <InlineMath math={"x"}/>에 가장 가까운 점</>}/>],
                    ["x - \\hat{x}", <T en={<>the residual; verify the theorem directly: <InlineMath math={"\\langle x - \\hat{x}, y^1 \\rangle = 1 - 1 + 0 = 0"}/> and <InlineMath math={"\\langle x - \\hat{x}, y^2 \\rangle = 0 - 1 + 1 = 0"}/></>}
                                       ko={<>잔차. 정리를 직접 확인해 보라. <InlineMath math={"\\langle x - \\hat{x}, y^1 \\rangle = 1 - 1 + 0 = 0"}/>이고 <InlineMath math={"\\langle x - \\hat{x}, y^2 \\rangle = 0 - 1 + 1 = 0"}/>이다</>}/>],
                    ["\\sqrt{3}", <T en={<>the norm of the residual, which is <InlineMath math={"d(x, M)"}/>; any other point of <InlineMath math={"M"}/> is farther</>}
                                    ko={<>잔차의 norm이자 <InlineMath math={"d(x, M)"}/>. <InlineMath math={"M"}/>의 다른 어떤 점도 더 멀다</>}/>],
                ]}/>
                <T
                    en={<p>
                        As a sanity check, take some other element of{" "}
                        <InlineMath math={"M"}/>, say <InlineMath math={"m = y^1 + 3y^2 = (1,4,3)^\\top"}/>.
                        Then <InlineMath math={"\\|x - m\\|^2 = 0 + 4 + 1 = 5 > 3"}/>, exactly as Claim 3.31
                        predicts: the excess is{" "}
                        <InlineMath math={"\\|\\hat{x} - m\\|^2 = \\|y^1\\|^2 = 2"}/>.
                    </p>}
                    ko={<p>
                        확인 삼아 <InlineMath math={"M"}/>의 다른 원소, 이를테면{" "}
                        <InlineMath math={"m = y^1 + 3y^2 = (1,4,3)^\\top"}/>을 잡아 보자.{" "}
                        <InlineMath math={"\\|x - m\\|^2 = 0 + 4 + 1 = 5 > 3"}/>이고, 이는 Claim 3.31이
                        예측한 그대로다. 초과분이 정확히{" "}
                        <InlineMath math={"\\|\\hat{x} - m\\|^2 = \\|y^1\\|^2 = 2"}/>다.
                    </p>}
                />
            </Example>
            <Definition n="3.45" title={<T en={<>Orthogonal projection operator</>} ko={<>직교 사영 연산자</>}/>}>
                <T
                    en={<p>
                        Theorem 3.36 shows that the following three statements about{" "}
                        <InlineMath math={"x \\in \\mathcal{X}"}/> and{" "}
                        <InlineMath math={"\\hat{x} \\in M"}/> are equivalent:{" "}
                        <InlineMath math={"x - \\hat{x} \\perp M"}/>; there is{" "}
                        <InlineMath math={"m^{\\perp} \\in M^{\\perp}"}/> with{" "}
                        <InlineMath math={"x = \\hat{x} + m^{\\perp}"}/>; and{" "}
                        <InlineMath math={"\\|x - \\hat{x}\\| = d(x, M)"}/>. The map{" "}
                        <InlineMath math={"P : \\mathcal{X} \\to M"}/> with{" "}
                        <InlineMath math={"P(x) = \\hat{x}"}/> is the <strong>orthogonal projection</strong> of{" "}
                        <InlineMath math={"\\mathcal{X}"}/> onto <InlineMath math={"M"}/>.
                    </p>}
                    ko={<p>
                        Theorem 3.36은 <InlineMath math={"x \\in \\mathcal{X}"}/>와{" "}
                        <InlineMath math={"\\hat{x} \\in M"}/>에 대한 다음 세 진술이 동치임을 보인다.{" "}
                        <InlineMath math={"x - \\hat{x} \\perp M"}/>이다.{" "}
                        <InlineMath math={"x = \\hat{x} + m^{\\perp}"}/>인{" "}
                        <InlineMath math={"m^{\\perp} \\in M^{\\perp}"}/>이 있다.{" "}
                        <InlineMath math={"\\|x - \\hat{x}\\| = d(x, M)"}/>이다.{" "}
                        <InlineMath math={"P(x) = \\hat{x}"}/>로 정의되는 사상{" "}
                        <InlineMath math={"P : \\mathcal{X} \\to M"}/>을{" "}
                        <InlineMath math={"\\mathcal{X}"}/>에서 <InlineMath math={"M"}/>으로의{" "}
                        <strong>직교 사영</strong>이라 한다.
                    </p>}
                />
            </Definition>
            <Proposition n="3.46" title={<T en={<>The projection in an orthonormal basis</>} ko={<>orthonormal 기저에서의 사영</>}/>}>
                <T
                    en={<p>
                        <InlineMath math={"P"}/> is a linear operator, and if{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/> is an <em>orthonormal</em> basis of{" "}
                        <InlineMath math={"M"}/>, then
                    </p>}
                    ko={<p>
                        <InlineMath math={"P"}/>는 선형 연산자이고,{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/>가 <InlineMath math={"M"}/>의{" "}
                        <em>orthonormal</em> 기저이면
                    </p>}
                />
                <BlockMath math={"P(x) = \\sum_{i=1}^{k} \\langle x, v^i \\rangle \\, v^i"}/>
                <Terms items={[
                    ["v^i", <T en={<>an orthonormal basis of <InlineMath math={"M"}/>, produced by Gram-Schmidt from any basis</>}
                              ko={<><InlineMath math={"M"}/>의 orthonormal 기저. 아무 기저에나 Gram-Schmidt를 돌려 얻는다</>}/>],
                    ["\\langle x, v^i \\rangle", <T en={<>the <InlineMath math={"i"}/>-th coordinate, computed by one inner product and no linear solve</>}
                                                   ko={<><InlineMath math={"i"}/>번째 좌표. 내적 한 번으로 끝나고 선형계를 풀 일이 없다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            With an orthonormal basis the Gram matrix is{" "}
                            <InlineMath math={"G_{ij} = \\langle v^i, v^j \\rangle = \\delta_{ij}"}/>, that
                            is <InlineMath math={"G = I"}/>, so the normal equations{" "}
                            <InlineMath math={"G^\\top \\alpha = \\beta"}/> read{" "}
                            <InlineMath math={"\\alpha = \\beta"}/>, and{" "}
                            <InlineMath math={"\\beta_i = \\langle x, v^i \\rangle"}/> by definition. That is
                            the formula. Linearity now follows because{" "}
                            <InlineMath math={"x \\mapsto \\langle x, v^i \\rangle"}/> is linear in{" "}
                            <InlineMath math={"x"}/>:
                        </p>}
                        ko={<p>
                            orthonormal 기저에서는 Gram 행렬이{" "}
                            <InlineMath math={"G_{ij} = \\langle v^i, v^j \\rangle = \\delta_{ij}"}/>, 곧{" "}
                            <InlineMath math={"G = I"}/>이므로 normal equation{" "}
                            <InlineMath math={"G^\\top \\alpha = \\beta"}/>는{" "}
                            <InlineMath math={"\\alpha = \\beta"}/>가 되고, 정의에 의해{" "}
                            <InlineMath math={"\\beta_i = \\langle x, v^i \\rangle"}/>다. 그것이 공식이다.
                            선형성은 <InlineMath math={"x \\mapsto \\langle x, v^i \\rangle"}/>이{" "}
                            <InlineMath math={"x"}/>에 대해 선형이므로 따라 나온다.
                        </p>}
                    />
                    <BlockMath math={"P(\\alpha_1 x^1 + \\alpha_2 x^2) = \\sum_{i} \\langle \\alpha_1 x^1 + \\alpha_2 x^2, v^i \\rangle v^i = \\alpha_1 P(x^1) + \\alpha_2 P(x^2)"}/>
                    <Terms items={[
                        ["x^1, x^2", <T en={<>two arbitrary vectors of <InlineMath math={"\\mathcal{X}"}/></>}
                                       ko={<><InlineMath math={"\\mathcal{X}"}/>의 임의의 벡터 둘</>}/>],
                        ["\\delta_{ij}", <T en={<>the Kronecker delta: <InlineMath math={"1"}/> if <InlineMath math={"i = j"}/> and <InlineMath math={"0"}/> otherwise</>}
                                           ko={<>Kronecker 델타. <InlineMath math={"i = j"}/>이면 <InlineMath math={"1"}/>, 아니면 <InlineMath math={"0"}/>이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            On the worked example above, Gram-Schmidt on{" "}
                            <InlineMath math={"\\{y^1, y^2\\}"}/> gives{" "}
                            <InlineMath math={"v^1 = \\tfrac{1}{\\sqrt{2}}(1,1,0)^\\top"}/> and{" "}
                            <InlineMath math={"v^2 = \\tfrac{1}{\\sqrt{6}}(-1,1,2)^\\top"}/>. Then{" "}
                            <InlineMath math={"\\langle x, v^1 \\rangle = 3/\\sqrt{2}"}/> and{" "}
                            <InlineMath math={"\\langle x, v^2 \\rangle = 9/\\sqrt{6}"}/>, and the sum
                            rebuilds <InlineMath math={"(0,3,3)^\\top"}/>. The price of skipping the linear
                            solve is having run Gram-Schmidt first.
                        </p>}
                        ko={<p>
                            위 예제에 적용해 보면 <InlineMath math={"\\{y^1, y^2\\}"}/>에 Gram-Schmidt를 돌려{" "}
                            <InlineMath math={"v^1 = \\tfrac{1}{\\sqrt{2}}(1,1,0)^\\top"}/>,{" "}
                            <InlineMath math={"v^2 = \\tfrac{1}{\\sqrt{6}}(-1,1,2)^\\top"}/>을 얻는다. 그러면{" "}
                            <InlineMath math={"\\langle x, v^1 \\rangle = 3/\\sqrt{2}"}/>,{" "}
                            <InlineMath math={"\\langle x, v^2 \\rangle = 9/\\sqrt{6}"}/>이고, 합이{" "}
                            <InlineMath math={"(0,3,3)^\\top"}/>을 다시 만들어 낸다. 선형계 풀이를 건너뛴 값으로
                            Gram-Schmidt를 먼저 돌린 셈이다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Theorem n="3.51" title={<T en={<>Minimum-norm point of a linear variety</>} ko={<>linear variety의 최소 norm 점</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"\\{y_1, \\ldots, y_p\\}"}/> be linearly independent in a
                        finite-dimensional real inner product space and let{" "}
                        <InlineMath math={"c_1, \\ldots, c_p"}/> be real constants. Define the{" "}
                        <strong>linear variety</strong>{" "}
                        <InlineMath math={"V := \\{x \\in \\mathcal{X} \\mid \\langle x, y_i \\rangle = c_i, \\; 1 \\le i \\le p\\}"}/>.
                        Then there is a unique{" "}
                        <InlineMath math={"v^* \\in V"}/> of minimum norm, it lies in{" "}
                        <InlineMath math={"\\operatorname{span}\\{y_1, \\ldots, y_p\\}"}/>, and its
                        coefficients solve
                    </p>}
                    ko={<p>
                        유한 차원 실내적 공간에서 <InlineMath math={"\\{y_1, \\ldots, y_p\\}"}/>가 선형 독립이고{" "}
                        <InlineMath math={"c_1, \\ldots, c_p"}/>가 실수 상수라 하자.{" "}
                        <strong>linear variety</strong>를{" "}
                        <InlineMath math={"V := \\{x \\in \\mathcal{X} \\mid \\langle x, y_i \\rangle = c_i, \\; 1 \\le i \\le p\\}"}/>로
                        정의한다. 그러면 norm이 최소인{" "}
                        <InlineMath math={"v^* \\in V"}/>가 유일하게 존재하고,{" "}
                        <InlineMath math={"\\operatorname{span}\\{y_1, \\ldots, y_p\\}"}/>에 놓이며, 그
                        계수는 다음을 만족한다.
                    </p>}
                />
                <BlockMath math={"v^* = \\sum_{i=1}^{p} \\beta_i y_i, \\qquad G \\beta = c, \\qquad G_{ij} = \\langle y_i, y_j \\rangle, \\qquad c = (c_1, \\ldots, c_p)^\\top"}/>
                <Terms items={[
                    ["V", <T en={<>a translate of a subspace: it does not contain <InlineMath math={"0"}/> unless every <InlineMath math={"c_i"}/> is zero, so it is not a subspace</>}
                            ko={<>부분 공간의 평행 이동. 모든 <InlineMath math={"c_i"}/>가 0이 아닌 한 <InlineMath math={"0"}/>을 품지 않으므로 부분 공간이 아니다</>}/>],
                    ["v^*", <T en={<>the shortest vector satisfying the constraints, characterized by <InlineMath math={"v^* \\perp M"}/> with <InlineMath math={"M := (\\operatorname{span}\\{y_i\\})^{\\perp}"}/></>}
                              ko={<>제약을 만족하는 가장 짧은 벡터. <InlineMath math={"M := (\\operatorname{span}\\{y_i\\})^{\\perp}"}/>에 대해 <InlineMath math={"v^* \\perp M"}/>으로 특징지어진다</>}/>],
                    ["G \\beta = c", <T en={<>the same Gram system as before, with the data column now being the constraint values instead of inner products against <InlineMath math={"x"}/></>}
                                       ko={<>앞과 같은 Gram 연립방정식. 데이터 열이 <InlineMath math={"x"}/>와의 내적 대신 제약값이 되었을 뿐이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        This is the underdetermined counterpart of the Projection Theorem, and the figure
                        above shows it under the second toggle. Note the subtlety the notes flag: the
                        characterization is <InlineMath math={"v^* \\perp M"}/> where{" "}
                        <InlineMath math={"M"}/> is the <em>direction</em> subspace of{" "}
                        <InlineMath math={"V"}/>, not <InlineMath math={"v^* \\perp V"}/>. The three claims
                        the notes break this into are left to homework there; the geometric content is the
                        one perpendicular in the figure.
                    </p>}
                    ko={<p>
                        이것이 사영 정리의 underdetermined 짝이고, 위 그림의 두 번째 토글이 그것을 보여 준다. 원
                        교재가 짚는 미묘한 점을 놓치지 말자. 판정 조건은{" "}
                        <InlineMath math={"v^* \\perp V"}/>가 아니라, <InlineMath math={"V"}/>의{" "}
                        <em>방향</em> 부분 공간 <InlineMath math={"M"}/>에 대한{" "}
                        <InlineMath math={"v^* \\perp M"}/>이다. 원 교재가 이것을 쪼개 놓은 claim 셋은 거기서
                        숙제로 남는다. 기하적 내용은 그림 속 수선 하나가 전부다.
                    </p>}
                />
                <T
                    en={<p>
                        Equation <InlineMath math={"v^* = \\operatorname{arg\\,min}_{v \\in V} \\|v\\|^2"}/> is
                        the smallest example of a <strong>quadratic program</strong>: a quadratic cost{" "}
                        <InlineMath math={"\\|v\\|^2 = \\langle v, v \\rangle"}/> under linearly independent
                        equality constraints. Chapter 7 picks that thread up.
                    </p>}
                    ko={<p>
                        <InlineMath math={"v^* = \\operatorname{arg\\,min}_{v \\in V} \\|v\\|^2"}/>은{" "}
                        <strong>quadratic program</strong>의 가장 작은 예다. 선형 독립인 등식 제약 아래의 이차
                        비용 <InlineMath math={"\\|v\\|^2 = \\langle v, v \\rangle"}/>다. 7장이 이 실을 다시
                        집는다.
                    </p>}
                />
            </Theorem>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Symmetric and Orthogonal Matrices</h2>} ko={<h2>대칭 행렬과 직교 행렬</h2>}/>
            <T
                en={<p>
                    Chapter 2 ended on a sour note: a matrix need not have a basis of eigenvectors, so it
                    need not be diagonalizable. Real symmetric matrices are the exception, and they are
                    exactly the matrices that show up as Gram matrices, as covariances, and as weights in a
                    least squares cost. Their eigenvectors can always be chosen orthonormal. That is what
                    this section proves, and it is the reason the next chapter's factorizations exist.
                </p>}
                ko={<p>
                    2장은 씁쓸하게 끝났다. 행렬이 고유벡터로 된 기저를 가지리라는 보장이 없어서 대각화도 보장되지
                    않는다. 실대칭 행렬은 예외이고, 하필 그것이 Gram 행렬로, 공분산으로, 최소제곱 비용의 가중치로
                    등장하는 바로 그 행렬이다. 그 고유벡터는 언제나 orthonormal하게 고를 수 있다. 이 절이 증명하는
                    것이 그것이고, 다음 장의 분해들이 존재하는 이유도 그것이다.
                </p>}
            />
            <T
                en={<p>
                    Throughout the section the inner product on{" "}
                    <InlineMath math={"\\mathbb{C}^n"}/> is{" "}
                    <InlineMath math={"\\langle x, y \\rangle = x^\\top \\overline{y}"}/>. The complex
                    setting is unavoidable at the start, because eigenvalues of a real matrix are complex
                    until proven otherwise.
                </p>}
                ko={<p>
                    이 절 내내 <InlineMath math={"\\mathbb{C}^n"}/>의 내적은{" "}
                    <InlineMath math={"\\langle x, y \\rangle = x^\\top \\overline{y}"}/>로 둔다. 시작부터
                    복소수를 피할 수 없는데, 실행렬의 고윳값도 실수임이 증명되기 전까지는 복소수이기 때문이다.
                </p>}
            />
            <Proposition n="3.53" title={<T en={<>Eigenvalues of a real matrix come in conjugate pairs</>}
                                            ko={<>실행렬의 고윳값은 켤레 쌍으로 나온다</>}/>}>
                <T
                    en={<p>
                        If <InlineMath math={"A"}/> is <InlineMath math={"n \\times n"}/> and real, then{" "}
                        <InlineMath math={"Av = \\lambda v"}/> implies{" "}
                        <InlineMath math={"A\\overline{v} = \\overline{\\lambda}\\,\\overline{v}"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>가 <InlineMath math={"n \\times n"}/> 실행렬이면{" "}
                        <InlineMath math={"Av = \\lambda v"}/>에서{" "}
                        <InlineMath math={"A\\overline{v} = \\overline{\\lambda}\\,\\overline{v}"}/>이
                        따라 나온다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            Conjugation distributes over products and sums, so it distributes over matrix
                            multiplication entry by entry. Apply it to both sides of{" "}
                            <InlineMath math={"Av = \\lambda v"}/> in two ways:
                        </p>}
                        ko={<p>
                            켤레는 곱과 합에 대해 분배되므로 행렬 곱에도 성분별로 분배된다.{" "}
                            <InlineMath math={"Av = \\lambda v"}/>의 양변에 두 가지 방식으로 적용해 보자.
                        </p>}
                    />
                    <BlockMath math={"\\overline{A \\cdot v} = \\overline{A} \\cdot \\overline{v} = A \\cdot \\overline{v}, \\qquad \\overline{A \\cdot v} = \\overline{\\lambda \\cdot v} = \\overline{\\lambda} \\cdot \\overline{v}"}/>
                    <Terms items={[
                        ["\\overline{A} = A", <T en={<>because <InlineMath math={"A"}/> is real: this is the only place the hypothesis is used</>}
                                                ko={<><InlineMath math={"A"}/>가 실행렬이기 때문이다. 가정이 쓰이는 유일한 자리다</>}/>],
                        ["\\overline{\\lambda}", <T en={<>the conjugate eigenvalue, paired with the conjugate eigenvector</>}
                                                   ko={<>켤레 고윳값. 켤레 고유벡터와 짝을 이룬다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The two right-hand sides are equal, which is the claim. Chapter 2 met this
                            already: the rotation matrix{" "}
                            <InlineMath math={"\\left[\\begin{smallmatrix} 0 & 1 \\\\ -1 & 0 \\end{smallmatrix}\\right]"}/> has
                            eigenvalues <InlineMath math={"\\pm j"}/>, a conjugate pair.
                        </p>}
                        ko={<p>
                            두 우변이 같고, 그것이 주장이다. 2장에서 이미 만난 적이 있다. 회전 행렬{" "}
                            <InlineMath math={"\\left[\\begin{smallmatrix} 0 & 1 \\\\ -1 & 0 \\end{smallmatrix}\\right]"}/>의
                            고윳값이 <InlineMath math={"\\pm j"}/>로 켤레 쌍이다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Definition n="3.54" title={<T en={<>Symmetric matrix</>} ko={<>대칭 행렬</>}/>}>
                <T
                    en={<p>
                        A matrix <InlineMath math={"A"}/> is <strong>symmetric</strong> if{" "}
                        <InlineMath math={"A^\\top = A"}/>. Concretely,{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 2 & 1 \\\\ 1 & 2 \\end{smallmatrix}\\right]"}/> is
                        symmetric and{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 2 & 1 \\\\ 0 & 2 \\end{smallmatrix}\\right]"}/> is
                        not. Every Gram matrix of Definition 3.39 is symmetric, since{" "}
                        <InlineMath math={"\\langle y^i, y^j \\rangle = \\langle y^j, y^i \\rangle"}/> over{" "}
                        <InlineMath math={"\\mathbb{R}"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"A^\\top = A"}/>인 행렬 <InlineMath math={"A"}/>를{" "}
                        <strong>대칭 행렬</strong>이라 한다. 구체적으로{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 2 & 1 \\\\ 1 & 2 \\end{smallmatrix}\\right]"}/>은
                        대칭이고{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 2 & 1 \\\\ 0 & 2 \\end{smallmatrix}\\right]"}/>은
                        아니다. <InlineMath math={"\\mathbb{R}"}/> 위에서는{" "}
                        <InlineMath math={"\\langle y^i, y^j \\rangle = \\langle y^j, y^i \\rangle"}/>이므로
                        Definition 3.39의 Gram 행렬은 모두 대칭이다.
                    </p>}
                />
            </Definition>
            <Proposition n="3.55" title={<T en={<>A symmetric matrix can be moved across the inner product</>}
                                            ko={<>대칭 행렬은 내적을 건너 이동할 수 있다</>}/>}>
                <T
                    en={<p>
                        If <InlineMath math={"A"}/> is real and symmetric, then for all{" "}
                        <InlineMath math={"x, y \\in \\mathbb{C}^n"}/>,
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>가 실대칭이면 모든{" "}
                        <InlineMath math={"x, y \\in \\mathbb{C}^n"}/>에 대해
                    </p>}
                />
                <BlockMath math={"\\langle Ax, y \\rangle = \\langle x, Ay \\rangle"}/>
                <Terms items={[
                    ["A", <T en={<>real and symmetric; both hypotheses are used, one for each bar that has to be removed</>}
                            ko={<>실행렬이면서 대칭. 지워야 할 켤레 기호 하나씩에 가정 하나씩이 쓰인다</>}/>],
                    ["\\langle x, y \\rangle", <T en={<>the complex inner product <InlineMath math={"x^\\top \\overline{y}"}/></>}
                                                 ko={<>복소 내적 <InlineMath math={"x^\\top \\overline{y}"}/></>}/>],
                ]}/>
                <Proof>
                    <T en={<p>Both sides reduce to the same expression.</p>}
                       ko={<p>양변이 같은 식으로 줄어든다.</p>}/>
                    <BlockMath math={"\\langle Ax, y \\rangle = (Ax)^\\top \\overline{y} = x^\\top A^\\top \\overline{y} = x^\\top A \\overline{y}, \\qquad \\langle x, Ay \\rangle = x^\\top \\overline{Ay} = x^\\top \\overline{A}\\,\\overline{y} = x^\\top A \\overline{y}"}/>
                    <Terms items={[
                        ["A^\\top = A", <T en={<>symmetry, used on the left chain</>} ko={<>대칭성. 왼쪽 사슬에 쓰인다</>}/>],
                        ["\\overline{A} = A", <T en={<>realness, used on the right chain</>} ko={<>실행렬임. 오른쪽 사슬에 쓰인다</>}/>],
                        ["x^\\top A \\overline{y}", <T en={<>the common value, so the two sides are equal</>}
                                                      ko={<>공통의 값. 그래서 양변이 같다</>}/>],
                    ]}/>
                </Proof>
            </Proposition>
            <Proposition n="3.56" title={<T en={<>Eigenvalues of a real symmetric matrix are real</>}
                                            ko={<>실대칭 행렬의 고윳값은 실수다</>}/>}>
                <Proof>
                    <T
                        en={<p>
                            Let <InlineMath math={"v \\neq 0"}/> satisfy{" "}
                            <InlineMath math={"Av = \\lambda v"}/> and apply Proposition 3.55 with{" "}
                            <InlineMath math={"x = y = v"}/>. Both sides can then be evaluated:
                        </p>}
                        ko={<p>
                            <InlineMath math={"Av = \\lambda v"}/>인{" "}
                            <InlineMath math={"v \\neq 0"}/>을 잡고 Proposition 3.55에{" "}
                            <InlineMath math={"x = y = v"}/>를 넣는다. 그러면 양변을 계산할 수 있다.
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} \\langle Av, v \\rangle = \\langle v, Av \\rangle &\\iff \\langle \\lambda v, v \\rangle = \\langle v, \\lambda v \\rangle \\\\ &\\iff \\lambda \\langle v, v \\rangle = \\overline{\\lambda} \\langle v, v \\rangle \\\\ &\\iff \\lambda \\|v\\|^2 = \\overline{\\lambda} \\|v\\|^2 \\;\\iff\\; \\lambda = \\overline{\\lambda} \\end{aligned}"}/>
                    <Terms items={[
                        ["\\lambda \\langle v, v \\rangle", <T en={<>the scalar comes out of the <em>left</em> slot untouched</>}
                                                             ko={<>스칼라가 <em>왼쪽</em> 자리에서는 그대로 나온다</>}/>],
                        ["\\overline{\\lambda} \\langle v, v \\rangle", <T en={<>and out of the <em>right</em> slot conjugated, by Remark 3.12: that asymmetry is the entire proof</>}
                                                                         ko={<>Remark 3.12에 의해 <em>오른쪽</em> 자리에서는 켤레가 씌워져 나온다. 그 비대칭이 증명의 전부다</>}/>],
                        ["\\|v\\|^2", <T en={<>strictly positive since <InlineMath math={"v \\neq 0"}/>, so it can be divided out</>}
                                        ko={<><InlineMath math={"v \\neq 0"}/>이라 양수이므로 나눠 없앨 수 있다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            A complex number equal to its own conjugate is real. Once{" "}
                            <InlineMath math={"\\lambda"}/> is real, the matrix{" "}
                            <InlineMath math={"A - \\lambda I"}/> is real, so its null space contains a real
                            vector and the eigenvector may be taken in{" "}
                            <InlineMath math={"\\mathbb{R}^n"}/>. From here on the inner product is the real
                            one, <InlineMath math={"\\langle x, y \\rangle = x^\\top y"}/>.
                        </p>}
                        ko={<p>
                            자기 켤레와 같은 복소수는 실수다. <InlineMath math={"\\lambda"}/>가 실수가 되면
                            행렬 <InlineMath math={"A - \\lambda I"}/>이 실행렬이므로 그 null space에 실벡터가
                            있고, 고유벡터를 <InlineMath math={"\\mathbb{R}^n"}/>에서 잡아도 된다. 이후로 내적은
                            실내적 <InlineMath math={"\\langle x, y \\rangle = x^\\top y"}/>다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Proposition n="3.58" title={<T en={<>Distinct eigenvalues give orthogonal eigenvectors</>}
                                            ko={<>서로 다른 고윳값은 직교하는 고유벡터를 준다</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"A"}/> be real symmetric with distinct real eigenvalues{" "}
                        <InlineMath math={"\\lambda_1 \\neq \\lambda_2"}/> and corresponding eigenvectors{" "}
                        <InlineMath math={"v^1, v^2"}/>. Then{" "}
                        <InlineMath math={"v^1 \\perp v^2"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>가 실대칭이고 서로 다른 실고윳값{" "}
                        <InlineMath math={"\\lambda_1 \\neq \\lambda_2"}/>에 대응하는 고유벡터가{" "}
                        <InlineMath math={"v^1, v^2"}/>이면{" "}
                        <InlineMath math={"v^1 \\perp v^2"}/>이다.
                    </p>}
                />
                <Proof>
                    <T en={<p>Apply Proposition 3.55 with{" "}
                        <InlineMath math={"x = v^1"}/> and <InlineMath math={"y = v^2"}/>.</p>}
                       ko={<p>Proposition 3.55에 <InlineMath math={"x = v^1"}/>,{" "}
                           <InlineMath math={"y = v^2"}/>를 넣는다.</p>}/>
                    <BlockMath math={"\\begin{aligned} \\langle A v^1, v^2 \\rangle = \\langle v^1, A v^2 \\rangle &\\iff \\lambda_1 \\langle v^1, v^2 \\rangle = \\lambda_2 \\langle v^1, v^2 \\rangle \\\\ &\\iff 0 = (\\lambda_1 - \\lambda_2) \\langle v^1, v^2 \\rangle \\end{aligned}"}/>
                    <Terms items={[
                        ["\\lambda_1 - \\lambda_2", <T en={<>nonzero by hypothesis, so the other factor must vanish</>}
                                                      ko={<>가정에 의해 0이 아니므로 다른 인자가 0이어야 한다</>}/>],
                        ["\\langle v^1, v^2 \\rangle", <T en={<>forced to zero: the eigenvectors are orthogonal, with no normalization needed</>}
                                                         ko={<>0으로 강제된다. 정규화 없이도 고유벡터가 직교한다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            On numbers: <InlineMath math={"A = \\left[\\begin{smallmatrix} 2 & 1 \\\\ 1 & 2 \\end{smallmatrix}\\right]"}/> has{" "}
                            <InlineMath math={"\\lambda = 3, 1"}/> with eigenvectors{" "}
                            <InlineMath math={"(1,1)^\\top"}/> and{" "}
                            <InlineMath math={"(1,-1)^\\top"}/>, whose inner product is{" "}
                            <InlineMath math={"1 - 1 = 0"}/>. Nothing was arranged; symmetry did it.
                        </p>}
                        ko={<p>
                            숫자로 보면 <InlineMath math={"A = \\left[\\begin{smallmatrix} 2 & 1 \\\\ 1 & 2 \\end{smallmatrix}\\right]"}/>의
                            고윳값이 <InlineMath math={"\\lambda = 3, 1"}/>이고 고유벡터가{" "}
                            <InlineMath math={"(1,1)^\\top"}/>과 <InlineMath math={"(1,-1)^\\top"}/>인데
                            내적이 <InlineMath math={"1 - 1 = 0"}/>이다. 맞춰 놓은 것이 아니라 대칭성이 한
                            일이다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Proposition n="3.59" title={<T en={<>A real symmetric matrix always has an orthonormal eigenbasis</>}
                                            ko={<>실대칭 행렬은 언제나 orthonormal 고유기저를 가진다</>}/>}>
                <T
                    en={<p>
                        The eigenvectors of an <InlineMath math={"n \\times n"}/> real symmetric matrix can
                        always be chosen to form an orthonormal basis of{" "}
                        <InlineMath math={"\\mathbb{R}^n"}/>. Proposition 3.58 settles the case of distinct
                        eigenvalues, where the eigenvectors are already orthogonal and only need dividing by
                        their lengths. The repeated case needs more: the notes assign it as homework, and
                        the short version is that a repeated eigenvalue of a symmetric matrix always has an
                        eigenspace of full dimension, and Gram-Schmidt inside that eigenspace produces the
                        missing orthonormal vectors.
                    </p>}
                    ko={<p>
                        <InlineMath math={"n \\times n"}/> 실대칭 행렬의 고유벡터는 언제나{" "}
                        <InlineMath math={"\\mathbb{R}^n"}/>의 orthonormal 기저를 이루도록 고를 수 있다.
                        고윳값이 서로 다른 경우는 Proposition 3.58이 해결한다. 고유벡터가 이미 직교하니 길이로
                        나누기만 하면 된다. 중복 고윳값 쪽은 손이 더 간다. 원 교재는 숙제로 넘기는데, 요지는
                        대칭 행렬의 중복 고윳값은 언제나 그 중복도만큼의 차원을 가진 고유 공간을 가지고, 그
                        고유 공간 안에서 Gram-Schmidt를 돌리면 모자란 orthonormal 벡터가 나온다는 것이다.
                    </p>}
                />
                <T
                    en={<p>
                        This fails for general matrices, and the standard witness is{" "}
                        <InlineMath math={"A = \\left[\\begin{smallmatrix} 0 & 1 \\\\ 0 & 0 \\end{smallmatrix}\\right]"}/>:
                        its only eigenvalue is <InlineMath math={"0"}/>, repeated, and its eigenspace is the
                        single line <InlineMath math={"\\operatorname{span}\\{(1,0)^\\top\\}"}/>. There is no
                        basis of <InlineMath math={"\\mathbb{R}^2"}/> made of its eigenvectors, orthonormal
                        or otherwise. It is not symmetric, and that is exactly the difference.
                    </p>}
                    ko={<p>
                        일반 행렬에서는 이것이 깨지고, 표준 증인은{" "}
                        <InlineMath math={"A = \\left[\\begin{smallmatrix} 0 & 1 \\\\ 0 & 0 \\end{smallmatrix}\\right]"}/>이다.
                        고윳값은 중복된 <InlineMath math={"0"}/> 하나뿐이고 고유 공간은 직선{" "}
                        <InlineMath math={"\\operatorname{span}\\{(1,0)^\\top\\}"}/> 하나다. 이 행렬의
                        고유벡터로는 orthonormal이든 아니든{" "}
                        <InlineMath math={"\\mathbb{R}^2"}/>의 기저를 만들 수 없다. 대칭이 아니고, 차이는 정확히
                        그것이다.
                    </p>}
                />
            </Proposition>
            <Definition n="3.61" title={<T en={<>Orthogonal matrix</>} ko={<>직교 행렬</>}/>}>
                <T
                    en={<p>
                        An <InlineMath math={"n \\times n"}/> real matrix{" "}
                        <InlineMath math={"Q"}/> is <strong>orthogonal</strong> if{" "}
                        <InlineMath math={"Q^\\top Q = I"}/>. Writing{" "}
                        <InlineMath math={"Q = [\\,Q_1 \\; \\cdots \\; Q_n\\,]"}/> by columns, the rule for
                        matrix multiplication says
                    </p>}
                    ko={<p>
                        <InlineMath math={"Q^\\top Q = I"}/>인 <InlineMath math={"n \\times n"}/> 실행렬{" "}
                        <InlineMath math={"Q"}/>를 <strong>직교 행렬</strong>이라 한다.{" "}
                        <InlineMath math={"Q = [\\,Q_1 \\; \\cdots \\; Q_n\\,]"}/>처럼 열로 쪼개면 행렬 곱의
                        규칙이
                    </p>}
                />
                <BlockMath math={"\\langle Q_i, Q_j \\rangle = Q_i^\\top Q_j = [Q^\\top Q]_{ij} = [I]_{ij} = \\begin{cases} 1 & i = j \\\\ 0 & i \\neq j \\end{cases}"}/>
                <Terms items={[
                    ["Q_i", <T en={<>the <InlineMath math={"i"}/>-th column of <InlineMath math={"Q"}/></>}
                              ko={<><InlineMath math={"Q"}/>의 <InlineMath math={"i"}/>번째 열</>}/>],
                    ["[Q^\\top Q]_{ij}", <T en={<>row <InlineMath math={"i"}/> of <InlineMath math={"Q^\\top"}/> times column <InlineMath math={"j"}/> of <InlineMath math={"Q"}/>, which is <InlineMath math={"Q_i^\\top Q_j"}/></>}
                                           ko={<><InlineMath math={"Q^\\top"}/>의 <InlineMath math={"i"}/>행과 <InlineMath math={"Q"}/>의 <InlineMath math={"j"}/>열의 곱, 곧 <InlineMath math={"Q_i^\\top Q_j"}/></>}/>],
                ]}/>
                <T
                    en={<p>
                        So <InlineMath math={"Q"}/> is orthogonal exactly when its columns form an
                        orthonormal basis of <InlineMath math={"\\mathbb{R}^n"}/>. The name is unfortunate:
                        orthogonal columns alone are not enough, they must also be unit length. And since{" "}
                        <InlineMath math={"Q"}/> is square, <InlineMath math={"Q^\\top Q = I"}/> already
                        gives <InlineMath math={"Q^{-1} = Q^\\top"}/>, so the inverse costs a transpose.
                    </p>}
                    ko={<p>
                        따라서 <InlineMath math={"Q"}/>가 직교 행렬일 필요충분조건은 그 열이{" "}
                        <InlineMath math={"\\mathbb{R}^n"}/>의 orthonormal 기저를 이루는 것이다. 이름이 아쉽다.
                        열이 직교하기만 해서는 부족하고 길이도 1이어야 한다. 그리고{" "}
                        <InlineMath math={"Q"}/>가 정방이므로 <InlineMath math={"Q^\\top Q = I"}/>만으로{" "}
                        <InlineMath math={"Q^{-1} = Q^\\top"}/>이 나온다. 역행렬이 전치 한 번 값이다.
                    </p>}
                />
            </Definition>
            <Proposition n="3.63" title={<T en={<>Diagonalization by an orthogonal matrix</>} ko={<>직교 행렬에 의한 대각화</>}/>}>
                <T
                    en={<p>
                        If <InlineMath math={"A"}/> is <InlineMath math={"n \\times n"}/> real symmetric,
                        there is an orthogonal <InlineMath math={"Q"}/> with
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>가 <InlineMath math={"n \\times n"}/> 실대칭이면 다음을
                        만족하는 직교 행렬 <InlineMath math={"Q"}/>가 존재한다.
                    </p>}
                />
                <BlockMath math={"Q^\\top A Q = \\Lambda = \\operatorname{diag}(\\lambda_1, \\ldots, \\lambda_n)"}/>
                <Terms items={[
                    ["Q", <T en={<>the matrix whose columns are the orthonormal eigenvectors of Proposition 3.59</>}
                            ko={<>Proposition 3.59의 orthonormal 고유벡터들을 열로 갖는 행렬</>}/>],
                    ["\\Lambda", <T en={<>the diagonal matrix of eigenvalues, in the same order as the columns of <InlineMath math={"Q"}/></>}
                                   ko={<>고윳값들의 대각 행렬. <InlineMath math={"Q"}/>의 열과 같은 순서다</>}/>],
                    ["Q^\\top A Q", <T en={<>a change of basis, and because <InlineMath math={"Q^{-1} = Q^\\top"}/> it is the change of basis of Theorem 2.57 with the inverse for free</>}
                                      ko={<>기저 변환. <InlineMath math={"Q^{-1} = Q^\\top"}/>이므로 역행렬이 공짜인 Theorem 2.57의 기저 변환이다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            Take the orthonormal eigenvectors{" "}
                            <InlineMath math={"v^1, \\ldots, v^n"}/> from Proposition 3.59 and set{" "}
                            <InlineMath math={"Q := [\\, v^1 \\; \\cdots \\; v^n \\,]"}/>. Then{" "}
                            <InlineMath math={"Q^\\top Q = I"}/> by Definition 3.61, and stacking the{" "}
                            <InlineMath math={"n"}/> relations <InlineMath math={"Av^i = \\lambda_i v^i"}/> side
                            by side gives <InlineMath math={"AQ = Q\\Lambda"}/>. Multiply on the left by{" "}
                            <InlineMath math={"Q^\\top = Q^{-1}"}/>:
                        </p>}
                        ko={<p>
                            Proposition 3.59의 orthonormal 고유벡터{" "}
                            <InlineMath math={"v^1, \\ldots, v^n"}/>을 가져와{" "}
                            <InlineMath math={"Q := [\\, v^1 \\; \\cdots \\; v^n \\,]"}/>이라 두자. Definition
                            3.61에 의해 <InlineMath math={"Q^\\top Q = I"}/>이고, 관계식{" "}
                            <InlineMath math={"Av^i = \\lambda_i v^i"}/> <InlineMath math={"n"}/>개를 옆으로
                            나란히 쌓으면 <InlineMath math={"AQ = Q\\Lambda"}/>다. 왼쪽에서{" "}
                            <InlineMath math={"Q^\\top = Q^{-1}"}/>을 곱하면
                        </p>}
                    />
                    <BlockMath math={"AQ = Q\\Lambda \\quad \\Longrightarrow \\quad \\Lambda = Q^{-1} A Q = Q^\\top A Q"}/>
                    <Terms items={[
                        ["AQ = Q\\Lambda", <T en={<>column <InlineMath math={"i"}/> of the left side is <InlineMath math={"Av^i"}/> and of the right side is <InlineMath math={"\\lambda_i v^i"}/></>}
                                             ko={<>좌변의 <InlineMath math={"i"}/>번째 열이 <InlineMath math={"Av^i"}/>, 우변의 것이 <InlineMath math={"\\lambda_i v^i"}/>다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Concretely, for{" "}
                            <InlineMath math={"A = \\left[\\begin{smallmatrix} 2 & 1 \\\\ 1 & 2 \\end{smallmatrix}\\right]"}/> the
                            normalized eigenvectors give
                        </p>}
                        ko={<p>
                            구체적으로{" "}
                            <InlineMath math={"A = \\left[\\begin{smallmatrix} 2 & 1 \\\\ 1 & 2 \\end{smallmatrix}\\right]"}/>에서
                            정규화한 고유벡터를 쓰면
                        </p>}
                    />
                    <BlockMath math={"Q = \\frac{1}{\\sqrt{2}}\\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix}, \\qquad Q^\\top A Q = \\frac{1}{2}\\begin{bmatrix} 6 & 0 \\\\ 0 & 2 \\end{bmatrix} = \\begin{bmatrix} 3 & 0 \\\\ 0 & 1 \\end{bmatrix}"}/>
                    <Terms items={[
                        ["Q", <T en={<>columns <InlineMath math={"(1,1)^\\top/\\sqrt{2}"}/> and <InlineMath math={"(1,-1)^\\top/\\sqrt{2}"}/>; check <InlineMath math={"Q^\\top Q = I"}/> by hand</>}
                                ko={<>열이 <InlineMath math={"(1,1)^\\top/\\sqrt{2}"}/>과 <InlineMath math={"(1,-1)^\\top/\\sqrt{2}"}/>이다. <InlineMath math={"Q^\\top Q = I"}/>를 손으로 확인해 보라</>}/>],
                        ["\\operatorname{diag}(3, 1)", <T en={<>the eigenvalues, in the order the columns were placed</>}
                                                         ko={<>고윳값. 열을 놓은 순서 그대로다</>}/>],
                    ]}/>
                </Proof>
            </Proposition>
            <Proposition n="3.64" title={<T en={<>Orthogonal matrices preserve length</>} ko={<>직교 행렬은 길이를 보존한다</>}/>}>
                <T
                    en={<p>
                        For <InlineMath math={"Q"}/> orthogonal and{" "}
                        <InlineMath math={"\\mathbb{R}^n"}/> with the Euclidean norm,{" "}
                        <InlineMath math={"\\|Qx\\| = \\|x\\|"}/> for every{" "}
                        <InlineMath math={"x"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"Q"}/>가 직교 행렬이고{" "}
                        <InlineMath math={"\\mathbb{R}^n"}/>에 유클리드 norm이 얹혀 있으면 모든{" "}
                        <InlineMath math={"x"}/>에 대해 <InlineMath math={"\\|Qx\\| = \\|x\\|"}/>이다.
                    </p>}
                />
                <Proof>
                    <T en={<p>Work with the square, as the notes hint.</p>}
                       ko={<p>원 교재의 힌트대로 제곱을 다룬다.</p>}/>
                    <BlockMath math={"\\|Qx\\|^2 = (Qx)^\\top (Qx) = x^\\top \\underbrace{Q^\\top Q}_{= \\, I} x = x^\\top x = \\|x\\|^2"}/>
                    <Terms items={[
                        ["Q^\\top Q = I", <T en={<>the definition of orthogonal, and the only fact used</>}
                                            ko={<>직교 행렬의 정의. 쓰인 사실은 그것 하나다</>}/>],
                        ["\\|Qx\\|", <T en={<>both quantities are non-negative, so equality of squares gives equality</>}
                                       ko={<>두 양이 모두 음이 아니므로 제곱이 같으면 그 자체도 같다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Multiplying by <InlineMath math={"Q"}/> therefore rotates or reflects and never
                            stretches. Chapter 4 leans on this: the QR factorization can move a least squares
                            problem into a friendlier coordinate system without changing the value of{" "}
                            <InlineMath math={"\\|A\\alpha - b\\|"}/> that is being minimized.
                        </p>}
                        ko={<p>
                            그러므로 <InlineMath math={"Q"}/>를 곱하는 것은 회전이나 반사일 뿐 늘이는 일이 없다.
                            4장이 이것에 기댄다. QR 분해는 최소화하려는{" "}
                            <InlineMath math={"\\|A\\alpha - b\\|"}/>의 값을 건드리지 않으면서 최소제곱 문제를 더
                            다루기 쉬운 좌표계로 옮길 수 있다.
                        </p>}
                    />
                </Proof>
            </Proposition>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Quadratic Forms, Positive Definiteness, and Schur Complements</h2>}
               ko={<h2>이차 형식, positive definite, Schur complement</h2>}/>
            <T
                en={<p>
                    Every least squares cost so far has treated all coordinates of the error alike. Real
                    sensors are not alike: a wheel encoder and a GPS fix disagree about how much they should
                    be believed. The way to say that in this language is to replace{" "}
                    <InlineMath math={"e^\\top e"}/> by <InlineMath math={"e^\\top S e"}/> for a matrix{" "}
                    <InlineMath math={"S"}/> of weights. That expression is a quadratic form, and the
                    condition making it a legitimate squared length is positive definiteness.
                </p>}
                ko={<p>
                    지금까지의 최소제곱 비용은 오차의 모든 좌표를 똑같이 대했다. 실제 센서는 똑같지 않다. 휠
                    엔코더와 GPS는 서로를 얼마나 믿어야 하는지에 대해 의견이 다르다. 그 말을 이 언어로 하는
                    방법은 <InlineMath math={"e^\\top e"}/>를 가중치 행렬{" "}
                    <InlineMath math={"S"}/>를 끼운 <InlineMath math={"e^\\top S e"}/>로 바꾸는 것이다. 그
                    식이 이차 형식이고, 그것이 정당한 길이의 제곱이 되게 하는 조건이 positive definite다.
                </p>}
            />
            <Proposition n="3.66" title={<T en={<>Eigenvalues of <InlineMath math={"A^\\top A"}/> are non-negative</>}
                                            ko={<><InlineMath math={"A^\\top A"}/>의 고윳값은 음이 아니다</>}/>}>
                <T
                    en={<p>
                        For a real <InlineMath math={"m \\times n"}/> matrix{" "}
                        <InlineMath math={"A"}/>, both <InlineMath math={"A^\\top A"}/> and{" "}
                        <InlineMath math={"A A^\\top"}/> are symmetric, so Proposition 3.56 already makes
                        their eigenvalues real. In fact they are non-negative.
                    </p>}
                    ko={<p>
                        실 <InlineMath math={"m \\times n"}/> 행렬 <InlineMath math={"A"}/>에 대해{" "}
                        <InlineMath math={"A^\\top A"}/>와 <InlineMath math={"A A^\\top"}/>은 모두 대칭이므로
                        Proposition 3.56이 이미 그 고윳값을 실수로 만들어 준다. 사실은 음이 아니기까지 하다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            Let <InlineMath math={"A^\\top A v = \\lambda v"}/> with{" "}
                            <InlineMath math={"v \\neq 0"}/> and multiply on the left by{" "}
                            <InlineMath math={"v^\\top"}/>:
                        </p>}
                        ko={<p>
                            <InlineMath math={"v \\neq 0"}/>인{" "}
                            <InlineMath math={"A^\\top A v = \\lambda v"}/>를 두고 왼쪽에서{" "}
                            <InlineMath math={"v^\\top"}/>을 곱한다.
                        </p>}
                    />
                    <BlockMath math={"v^\\top A^\\top A v = \\lambda \\, v^\\top v \\quad \\Longleftrightarrow \\quad \\langle Av, Av \\rangle = \\lambda \\langle v, v \\rangle \\quad \\Longleftrightarrow \\quad \\|Av\\|^2 = \\lambda \\|v\\|^2"}/>
                    <Terms items={[
                        ["v^\\top A^\\top A v", <T en={<>regrouped as <InlineMath math={"(Av)^\\top (Av)"}/>, which is a squared length and therefore never negative</>}
                                                  ko={<><InlineMath math={"(Av)^\\top (Av)"}/>으로 묶으면 길이의 제곱이므로 결코 음수가 아니다</>}/>],
                        ["\\|v\\|^2", <T en={<>strictly positive since <InlineMath math={"v \\neq 0"}/></>}
                                        ko={<><InlineMath math={"v \\neq 0"}/>이므로 양수다</>}/>],
                        ["\\lambda", <T en={<>the quotient of a non-negative number by a positive one, hence <InlineMath math={"\\lambda \\ge 0"}/></>}
                                       ko={<>음이 아닌 수를 양수로 나눈 값이므로 <InlineMath math={"\\lambda \\ge 0"}/>이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The Gram matrix of Definition 3.39 is exactly{" "}
                            <InlineMath math={"A^\\top A"}/> when the <InlineMath math={"y^i"}/> are the
                            columns of <InlineMath math={"A"}/>, so this says that the matrix in every
                            normal equation has non-negative eigenvalues, and by Proposition 3.41 strictly
                            positive ones when the columns are independent.
                        </p>}
                        ko={<p>
                            <InlineMath math={"y^i"}/>가 <InlineMath math={"A"}/>의 열일 때 Definition 3.39의
                            Gram 행렬이 정확히 <InlineMath math={"A^\\top A"}/>다. 그러니 이것은 모든 normal
                            equation의 행렬이 음이 아닌 고윳값을 가지며, Proposition 3.41에 의해 열이 독립이면
                            양의 고윳값만 가진다는 말이다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Definition n="3.67" title={<T en={<>Quadratic form</>} ko={<>이차 형식</>}/>}>
                <T
                    en={<p>
                        For a real <InlineMath math={"n \\times n"}/> matrix{" "}
                        <InlineMath math={"M"}/> and <InlineMath math={"x \\in \\mathbb{R}^n"}/>, the scalar{" "}
                        <InlineMath math={"x^\\top M x"}/> is a <strong>quadratic form</strong>. Written out
                        for <InlineMath math={"n = 2"}/>:
                    </p>}
                    ko={<p>
                        실 <InlineMath math={"n \\times n"}/> 행렬 <InlineMath math={"M"}/>과{" "}
                        <InlineMath math={"x \\in \\mathbb{R}^n"}/>에 대해 스칼라{" "}
                        <InlineMath math={"x^\\top M x"}/>을 <strong>이차 형식</strong>이라 한다.{" "}
                        <InlineMath math={"n = 2"}/>일 때 풀어 쓰면
                    </p>}
                />
                <BlockMath math={"x^\\top M x = \\begin{bmatrix} x_1 & x_2 \\end{bmatrix} \\begin{bmatrix} a & b \\\\ b & c \\end{bmatrix} \\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix} = a x_1^2 + 2b \\, x_1 x_2 + c \\, x_2^2"}/>
                <Terms items={[
                    ["a, c", <T en={<>the coefficients of the pure squares, read off the diagonal</>}
                               ko={<>순수 제곱항의 계수. 대각에서 읽는다</>}/>],
                    ["2b", <T en={<>the coefficient of the cross term; the factor of 2 appears because <InlineMath math={"b"}/> sits in two places of a symmetric matrix</>}
                             ko={<>교차항의 계수. <InlineMath math={"b"}/>가 대칭 행렬의 두 자리에 앉아 있어서 2배가 붙는다</>}/>],
                    ["x^\\top M x", <T en={<>a single number, and a homogeneous degree-2 polynomial in <InlineMath math={"x_1, x_2"}/></>}
                                      ko={<>수 하나이며, <InlineMath math={"x_1, x_2"}/>에 대한 이차 동차 다항식</>}/>],
                ]}/>
                <T
                    en={<p>
                        With <InlineMath math={"M = \\left[\\begin{smallmatrix} 2 & 1 \\\\ 1 & 2 \\end{smallmatrix}\\right]"}/> and{" "}
                        <InlineMath math={"x = (1, -1)^\\top"}/> the value is{" "}
                        <InlineMath math={"2 - 2 + 2 = 2"}/>; with{" "}
                        <InlineMath math={"x = (1,1)^\\top"}/> it is{" "}
                        <InlineMath math={"2 + 2 + 2 = 6"}/>. Those are{" "}
                        <InlineMath math={"\\lambda_2 \\|x\\|^2 = 1 \\cdot 2"}/> and{" "}
                        <InlineMath math={"\\lambda_1 \\|x\\|^2 = 3 \\cdot 2"}/>, which is not a coincidence
                        and is the content of Proposition 3.74.
                    </p>}
                    ko={<p>
                        <InlineMath math={"M = \\left[\\begin{smallmatrix} 2 & 1 \\\\ 1 & 2 \\end{smallmatrix}\\right]"}/>에{" "}
                        <InlineMath math={"x = (1, -1)^\\top"}/>을 넣으면 값이{" "}
                        <InlineMath math={"2 - 2 + 2 = 2"}/>이고,{" "}
                        <InlineMath math={"x = (1,1)^\\top"}/>이면{" "}
                        <InlineMath math={"2 + 2 + 2 = 6"}/>이다. 각각{" "}
                        <InlineMath math={"\\lambda_2 \\|x\\|^2 = 1 \\cdot 2"}/>과{" "}
                        <InlineMath math={"\\lambda_1 \\|x\\|^2 = 3 \\cdot 2"}/>인데, 우연이 아니고 Proposition
                        3.74의 내용이다.
                    </p>}
                />
            </Definition>
            <Proposition n="3.72" title={<T en={<>Only the symmetric part of <InlineMath math={"M"}/> matters</>}
                                            ko={<><InlineMath math={"M"}/>의 대칭 부분만이 문제다</>}/>}>
                <T
                    en={<p>
                        Call <InlineMath math={"W"}/> <strong>skew symmetric</strong> if{" "}
                        <InlineMath math={"W^\\top = -W"}/>. Then for any real square{" "}
                        <InlineMath math={"M"}/> and any <InlineMath math={"x"}/>,
                    </p>}
                    ko={<p>
                        <InlineMath math={"W^\\top = -W"}/>인 <InlineMath math={"W"}/>를{" "}
                        <strong>반대칭</strong>이라 하자. 그러면 임의의 실정방행렬{" "}
                        <InlineMath math={"M"}/>과 임의의 <InlineMath math={"x"}/>에 대해
                    </p>}
                />
                <BlockMath math={"M = \\underbrace{\\frac{M + M^\\top}{2}}_{\\text{symmetric}} + \\underbrace{\\frac{M - M^\\top}{2}}_{\\text{skew symmetric}}, \\qquad x^\\top M x = x^\\top \\left( \\frac{M + M^\\top}{2} \\right) x"}/>
                <Terms items={[
                    ["\\dfrac{M + M^\\top}{2}", <T en={<>the <strong>symmetric part</strong> of <InlineMath math={"M"}/>: transposing it changes nothing</>}
                                                  ko={<><InlineMath math={"M"}/>의 <strong>대칭 부분</strong>. 전치해도 그대로다</>}/>],
                    ["\\dfrac{M - M^\\top}{2}", <T en={<>the skew symmetric part, which contributes nothing to the quadratic form</>}
                                                  ko={<>반대칭 부분. 이차 형식에는 아무 기여도 하지 않는다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            The decomposition is arithmetic: the two fractions add to{" "}
                            <InlineMath math={"M"}/>, and transposing them gives{" "}
                            <InlineMath math={"(M^\\top + M)/2"}/> and{" "}
                            <InlineMath math={"(M^\\top - M)/2"}/>, the first unchanged and the second
                            negated. For the second claim, note that{" "}
                            <InlineMath math={"x^\\top W x"}/> is a <InlineMath math={"1 \\times 1"}/> matrix,
                            so it equals its own transpose:
                        </p>}
                        ko={<p>
                            분해 자체는 산술이다. 두 분수를 더하면 <InlineMath math={"M"}/>이고, 전치하면{" "}
                            <InlineMath math={"(M^\\top + M)/2"}/>과{" "}
                            <InlineMath math={"(M^\\top - M)/2"}/>이 되어 앞은 그대로, 뒤는 부호가 뒤집힌다.
                            둘째 주장은, <InlineMath math={"x^\\top W x"}/>이{" "}
                            <InlineMath math={"1 \\times 1"}/> 행렬이라 자기 전치와 같다는 데서 나온다.
                        </p>}
                    />
                    <BlockMath math={"x^\\top W x = \\left( x^\\top W x \\right)^\\top = x^\\top W^\\top x = -x^\\top W x \\quad \\Longrightarrow \\quad 2\\,x^\\top W x = 0"}/>
                    <Terms items={[
                        ["W^\\top = -W", <T en={<>skew symmetry, the only property used</>} ko={<>반대칭성. 쓰인 성질은 그것 하나다</>}/>],
                        ["2\\,x^\\top W x = 0", <T en={<>so <InlineMath math={"x^\\top W x = 0"}/> for every <InlineMath math={"x"}/>: the skew part is invisible to the quadratic form</>}
                                                  ko={<>따라서 모든 <InlineMath math={"x"}/>에 대해 <InlineMath math={"x^\\top W x = 0"}/>이다. 이차 형식에는 반대칭 부분이 보이지 않는다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Concretely,{" "}
                            <InlineMath math={"M = \\left[\\begin{smallmatrix} 2 & 3 \\\\ -1 & 2 \\end{smallmatrix}\\right]"}/> and{" "}
                            <InlineMath math={"\\left[\\begin{smallmatrix} 2 & 1 \\\\ 1 & 2 \\end{smallmatrix}\\right]"}/> give
                            the same quadratic form, because their difference{" "}
                            <InlineMath math={"\\left[\\begin{smallmatrix} 0 & 2 \\\\ -2 & 0 \\end{smallmatrix}\\right]"}/> is
                            skew. This is why "let <InlineMath math={"M"}/> be symmetric" is not a loss of
                            generality when talking about quadratic forms: only the symmetric part was ever
                            visible.
                        </p>}
                        ko={<p>
                            구체적으로{" "}
                            <InlineMath math={"M = \\left[\\begin{smallmatrix} 2 & 3 \\\\ -1 & 2 \\end{smallmatrix}\\right]"}/>과{" "}
                            <InlineMath math={"\\left[\\begin{smallmatrix} 2 & 1 \\\\ 1 & 2 \\end{smallmatrix}\\right]"}/>은
                            같은 이차 형식을 준다. 차인{" "}
                            <InlineMath math={"\\left[\\begin{smallmatrix} 0 & 2 \\\\ -2 & 0 \\end{smallmatrix}\\right]"}/>이
                            반대칭이기 때문이다. 이차 형식을 이야기할 때 "<InlineMath math={"M"}/>이 대칭이라
                            하자"가 일반성을 잃지 않는 이유가 이것이다. 애초에 보이던 것은 대칭 부분뿐이었다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Proposition n="3.74" title={<T en={<>Eigenvalue bounds for a quadratic form</>} ko={<>이차 형식의 고윳값 경계</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"M"}/> be <InlineMath math={"n \\times n"}/> real symmetric.
                        Then for all <InlineMath math={"x \\in \\mathbb{R}^n"}/>,
                    </p>}
                    ko={<p>
                        <InlineMath math={"M"}/>이 <InlineMath math={"n \\times n"}/> 실대칭이면 모든{" "}
                        <InlineMath math={"x \\in \\mathbb{R}^n"}/>에 대해
                    </p>}
                />
                <BlockMath math={"\\lambda_{\\min} \\, x^\\top x \\;\\le\\; x^\\top M x \\;\\le\\; \\lambda_{\\max} \\, x^\\top x"}/>
                <Terms items={[
                    ["\\lambda_{\\min}, \\lambda_{\\max}", <T en={<>the smallest and largest eigenvalues of <InlineMath math={"M"}/>, both real by Proposition 3.56</>}
                                                             ko={<><InlineMath math={"M"}/>의 최소·최대 고윳값. Proposition 3.56에 의해 둘 다 실수다</>}/>],
                    ["x^\\top x", <T en={<><InlineMath math={"\\|x\\|^2"}/>, so the bound says the form is squeezed between two multiples of the squared length</>}
                                    ko={<><InlineMath math={"\\|x\\|^2"}/>. 이 경계는 형식이 길이 제곱의 두 상수배 사이에 끼인다는 말이다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            By Proposition 3.59 pick an orthonormal basis{" "}
                            <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> of eigenvectors and expand{" "}
                            <InlineMath math={"x = \\sum_i \\alpha_i v^i"}/>. Orthonormality collapses both
                            quantities to sums with no cross terms:
                        </p>}
                        ko={<p>
                            Proposition 3.59로 고유벡터로 된 orthonormal 기저{" "}
                            <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>을 잡고{" "}
                            <InlineMath math={"x = \\sum_i \\alpha_i v^i"}/>로 전개한다. orthonormal성이 두
                            양을 모두 교차항 없는 합으로 주저앉힌다.
                        </p>}
                    />
                    <BlockMath math={"x^\\top x = \\sum_{i=1}^{n} \\alpha_i^2, \\qquad Mx = \\sum_{i=1}^{n} \\alpha_i \\lambda_i v^i \\quad \\Longrightarrow \\quad x^\\top M x = \\sum_{i=1}^{n} \\lambda_i \\alpha_i^2"}/>
                    <Terms items={[
                        ["\\alpha_i", <T en={<>the coordinate <InlineMath math={"\\langle x, v^i \\rangle"}/> in the eigenbasis</>}
                                        ko={<>고유기저에서의 좌표 <InlineMath math={"\\langle x, v^i \\rangle"}/></>}/>],
                        ["\\lambda_i \\alpha_i^2", <T en={<>each direction contributes its own eigenvalue, weighted by how much of <InlineMath math={"x"}/> points that way</>}
                                                     ko={<>각 방향이 자기 고윳값을 기여한다. 가중치는 <InlineMath math={"x"}/>가 그 방향으로 얼마나 향하는지다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Replacing every <InlineMath math={"\\lambda_i"}/> by{" "}
                            <InlineMath math={"\\lambda_{\\min}"}/> can only decrease the sum, and by{" "}
                            <InlineMath math={"\\lambda_{\\max}"}/> can only increase it, since every{" "}
                            <InlineMath math={"\\alpha_i^2 \\ge 0"}/>. That is the claim. The bounds are
                            tight: taking <InlineMath math={"x"}/> to be an eigenvector attains each one, as
                            the two numbers <InlineMath math={"2"}/> and{" "}
                            <InlineMath math={"6"}/> computed under Definition 3.67 already showed.
                        </p>}
                        ko={<p>
                            모든 <InlineMath math={"\\alpha_i^2 \\ge 0"}/>이므로 각{" "}
                            <InlineMath math={"\\lambda_i"}/>를 <InlineMath math={"\\lambda_{\\min}"}/>으로
                            바꾸면 합이 줄기만 하고, <InlineMath math={"\\lambda_{\\max}"}/>로 바꾸면 늘기만
                            한다. 그것이 주장이다. 이 경계는 tight하다. <InlineMath math={"x"}/>를 고유벡터로
                            잡으면 각각 정확히 달성되며, Definition 3.67 아래에서 계산한 두 값{" "}
                            <InlineMath math={"2"}/>와 <InlineMath math={"6"}/>이 이미 그것을 보여 주었다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Definition n="3.75" title={<T en={<>Positive definite and positive semidefinite</>}
                                          ko={<>positive definite와 positive semidefinite</>}/>}>
                <BlockMath math={"P > 0 \\;:\\iff\\; \\left( x \\neq 0 \\implies x^\\top P x > 0 \\right), \\qquad P \\ge 0 \\;:\\iff\\; \\left( x^\\top P x \\ge 0 \\;\\; \\forall x \\right)"}/>
                <Terms items={[
                    ["P", <T en={<>a real symmetric matrix; symmetry is part of the definition, and Proposition 3.72 says assuming it costs nothing</>}
                            ko={<>실대칭 행렬. 대칭은 정의의 일부이고, Proposition 3.72가 그 가정에 값이 들지 않는다고 말한다</>}/>],
                    ["P > 0", <T en={<>read "<InlineMath math={"P"}/> is positive definite"</>}
                                ko={<>"<InlineMath math={"P"}/>가 positive definite다"라고 읽는다</>}/>],
                    ["P \\ge 0", <T en={<>positive semidefinite, also written <InlineMath math={"P \\succeq 0"}/>: the value may be zero on some nonzero <InlineMath math={"x"}/></>}
                                   ko={<>positive semidefinite. <InlineMath math={"P \\succeq 0"}/>으로도 쓰며, 0이 아닌 어떤 <InlineMath math={"x"}/>에서 값이 0이 될 수 있다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The notation is a trap worth naming out loud.{" "}
                        <strong><InlineMath math={"P > 0"}/> does not mean that the entries of{" "}
                        <InlineMath math={"P"}/> are positive.</strong> Two examples settle it:{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 2 & -1 \\\\ -1 & 2 \\end{smallmatrix}\\right] > 0"}/> despite
                        having negative entries, while{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 1 & 2 \\\\ 2 & 1 \\end{smallmatrix}\\right]"}/>, whose
                        entries are all positive, is <em>not</em> positive definite, since{" "}
                        <InlineMath math={"(1,-1)^\\top"}/> gives the value{" "}
                        <InlineMath math={"-2"}/>.
                    </p>}
                    ko={<p>
                        이 기호에는 함정이 있어서 소리 내어 짚어 둘 값어치가 있다.{" "}
                        <strong><InlineMath math={"P > 0"}/>은 <InlineMath math={"P"}/>의 성분이 양수라는 뜻이
                        아니다.</strong> 예 둘이면 정리된다.{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 2 & -1 \\\\ -1 & 2 \\end{smallmatrix}\\right]"}/>은
                        음수 성분이 있는데도 <InlineMath math={"> 0"}/>이고,{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 1 & 2 \\\\ 2 & 1 \\end{smallmatrix}\\right]"}/>은
                        성분이 전부 양수인데도 positive definite가 <em>아니다</em>.{" "}
                        <InlineMath math={"(1,-1)^\\top"}/>에서 값이{" "}
                        <InlineMath math={"-2"}/>이기 때문이다.
                    </p>}
                />
            </Definition>
            <Theorem n="3.77" title={<T en={<>Eigenvalue test</>} ko={<>고윳값 판정</>}/>}>
                <T
                    en={<p>
                        A real symmetric <InlineMath math={"P"}/> is positive definite if and only if all of
                        its eigenvalues are strictly positive, and positive semidefinite if and only if all
                        of them are non-negative.
                    </p>}
                    ko={<p>
                        실대칭 <InlineMath math={"P"}/>가 positive definite일 필요충분조건은 고윳값이 전부
                        양수인 것이고, positive semidefinite일 필요충분조건은 전부 음이 아닌 것이다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            <strong>If all eigenvalues are positive.</strong> Proposition 3.74 gives{" "}
                            <InlineMath math={"x^\\top P x \\ge \\lambda_{\\min} \\|x\\|^2 > 0"}/> for{" "}
                            <InlineMath math={"x \\neq 0"}/>, which is the definition.
                        </p>}
                        ko={<p>
                            <strong>고윳값이 전부 양수라면.</strong> Proposition 3.74가{" "}
                            <InlineMath math={"x \\neq 0"}/>에 대해{" "}
                            <InlineMath math={"x^\\top P x \\ge \\lambda_{\\min} \\|x\\|^2 > 0"}/>을 주고, 그것이
                            정의다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>If some eigenvalue is not positive.</strong> Let{" "}
                            <InlineMath math={"Pv = \\lambda v"}/> with{" "}
                            <InlineMath math={"v \\neq 0"}/> and{" "}
                            <InlineMath math={"\\lambda \\le 0"}/>. Testing the definition on that one
                            vector already fails:
                        </p>}
                        ko={<p>
                            <strong>양수가 아닌 고윳값이 하나라도 있으면.</strong>{" "}
                            <InlineMath math={"v \\neq 0"}/>,{" "}
                            <InlineMath math={"\\lambda \\le 0"}/>인{" "}
                            <InlineMath math={"Pv = \\lambda v"}/>를 잡자. 그 벡터 하나로 정의를 시험하면 이미
                            무너진다.
                        </p>}
                    />
                    <BlockMath math={"v^\\top P v = \\lambda \\, v^\\top v = \\lambda \\|v\\|^2 \\le 0"}/>
                    <Terms items={[
                        ["v", <T en={<>an eigenvector for the offending eigenvalue: one counterexample is all a <InlineMath math={"\\forall"}/> statement needs</>}
                                ko={<>문제가 되는 고윳값의 고유벡터. <InlineMath math={"\\forall"}/> 명제를 깨는 데는 반례 하나면 충분하다</>}/>],
                        ["\\lambda \\|v\\|^2", <T en={<>at most zero, so <InlineMath math={"P"}/> is not positive definite</>}
                                                 ko={<>0 이하이므로 <InlineMath math={"P"}/>는 positive definite가 아니다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Replacing every strict inequality by a weak one runs the same argument for the
                            semidefinite case. As a check, take{" "}
                            <InlineMath math={"P_a = \\left[\\begin{smallmatrix} 2 & -1 \\\\ -1 & 2 \\end{smallmatrix}\\right]"}/> with
                            eigenvalues <InlineMath math={"3, 1"}/>, so{" "}
                            <InlineMath math={"P_a > 0"}/>; and{" "}
                            <InlineMath math={"P_b = \\left[\\begin{smallmatrix} 1 & 2 \\\\ 2 & 1 \\end{smallmatrix}\\right]"}/> with
                            eigenvalues <InlineMath math={"3, -1"}/>, so{" "}
                            <InlineMath math={"P_b"}/> is not.
                        </p>}
                        ko={<p>
                            모든 강부등호를 약부등호로 바꾸면 semidefinite 경우에도 같은 논증이 돈다. 확인 삼아
                            고윳값이 <InlineMath math={"3, 1"}/>인{" "}
                            <InlineMath math={"P_a = \\left[\\begin{smallmatrix} 2 & -1 \\\\ -1 & 2 \\end{smallmatrix}\\right]"}/>은{" "}
                            <InlineMath math={"P_a > 0"}/>이고, 고윳값이{" "}
                            <InlineMath math={"3, -1"}/>인{" "}
                            <InlineMath math={"P_b = \\left[\\begin{smallmatrix} 1 & 2 \\\\ 2 & 1 \\end{smallmatrix}\\right]"}/>은
                            그렇지 않다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <T
                en={<p>
                    The sign of a quadratic form is visible in its level sets. Nested ellipses mean both
                    eigenvalues share a sign; a pair of hyperbola families means the signs differ; a pair of
                    parallel lines means one eigenvalue has reached zero. Edit the entries and watch the
                    classification change.
                </p>}
                ko={<p>
                    이차 형식의 부호는 등고선에 그대로 드러난다. 겹겹의 타원이면 두 고윳값의 부호가 같고, 쌍곡선
                    두 무리가 나오면 부호가 다르며, 평행한 두 직선이면 고윳값 하나가 0에 닿은 것이다. 성분을
                    바꾸면서 분류가 어떻게 달라지는지 보라.
                </p>}
            />
            <CanvasFigure label={t("Level sets of a quadratic form, and the eigenvalues behind them",
                "이차 형식의 등고선과 그 뒤의 고윳값")}
                          modal={<QuadraticFormExplorer width={720} height={430}/>}
                          bodyClassName="w-[min(94vw,760px)]">
                <QuadraticFormExplorer/>
            </CanvasFigure>
            <Theorem n="3.85" title={<T en={<>Square root characterization of <InlineMath math={"P \\ge 0"}/></>}
                                        ko={<><InlineMath math={"P \\ge 0"}/>의 제곱근 판정</>}/>}>
                <T
                    en={<p>
                        Call <InlineMath math={"N"}/> a <strong>square root</strong> of a real symmetric{" "}
                        <InlineMath math={"P"}/> if <InlineMath math={"N^\\top N = P"}/>. Then
                    </p>}
                    ko={<p>
                        <InlineMath math={"N^\\top N = P"}/>인 <InlineMath math={"N"}/>을 실대칭{" "}
                        <InlineMath math={"P"}/>의 <strong>제곱근</strong>이라 하자. 그러면
                    </p>}
                />
                <BlockMath math={"P \\ge 0 \\iff \\exists N \\text{ such that } N^\\top N = P"}/>
                <Terms items={[
                    ["N", <T en={<>a square root, not unique: <InlineMath math={"N"}/> and <InlineMath math={"QN"}/> work equally well for any orthogonal <InlineMath math={"Q"}/></>}
                            ko={<>제곱근. 유일하지 않다. 임의의 직교 행렬 <InlineMath math={"Q"}/>에 대해 <InlineMath math={"N"}/>과 <InlineMath math={"QN"}/>이 똑같이 통한다</>}/>],
                    ["N^\\top N", <T en={<>automatically symmetric, since <InlineMath math={"(N^\\top N)^\\top = N^\\top N"}/></>}
                                    ko={<><InlineMath math={"(N^\\top N)^\\top = N^\\top N"}/>이므로 자동으로 대칭이다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            <strong>Left to right is Proposition 3.63 plus arithmetic.</strong> Diagonalize{" "}
                            <InlineMath math={"P = O^\\top \\Lambda O"}/> with{" "}
                            <InlineMath math={"O"}/> orthogonal. Theorem 3.77 makes every{" "}
                            <InlineMath math={"\\lambda_i \\ge 0"}/>, so the real square roots exist and
                        </p>}
                        ko={<p>
                            <strong>왼쪽에서 오른쪽은 Proposition 3.63과 산술이다.</strong> 직교 행렬{" "}
                            <InlineMath math={"O"}/>로 <InlineMath math={"P = O^\\top \\Lambda O"}/>로
                            대각화한다. Theorem 3.77이 모든{" "}
                            <InlineMath math={"\\lambda_i \\ge 0"}/>을 보장하므로 실제곱근이 존재하고
                        </p>}
                    />
                    <BlockMath math={"\\Lambda^{1/2} := \\operatorname{diag}\\!\\left(\\sqrt{\\lambda_1}, \\ldots, \\sqrt{\\lambda_n}\\right), \\qquad N := \\Lambda^{1/2} O \\;\\Longrightarrow\\; N^\\top N = O^\\top \\Lambda O = P"}/>
                    <Terms items={[
                        ["\\Lambda^{1/2}", <T en={<>the entrywise square root of the diagonal, which needs <InlineMath math={"\\lambda_i \\ge 0"}/> to be real</>}
                                             ko={<>대각 성분별 제곱근. 실수이려면 <InlineMath math={"\\lambda_i \\ge 0"}/>이 필요하다</>}/>],
                        ["N = \\Lambda^{1/2} O", <T en={<>note the order; <InlineMath math={"N^\\top N = O^\\top (\\Lambda^{1/2})^\\top \\Lambda^{1/2} O"}/> and the middle collapses to <InlineMath math={"\\Lambda"}/></>}
                                                   ko={<>순서를 보아 두자. <InlineMath math={"N^\\top N = O^\\top (\\Lambda^{1/2})^\\top \\Lambda^{1/2} O"}/>이고 가운데가 <InlineMath math={"\\Lambda"}/>로 주저앉는다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>Right to left is one line.</strong> If{" "}
                            <InlineMath math={"N^\\top N = P"}/> then{" "}
                            <InlineMath math={"x^\\top P x = x^\\top N^\\top N x = \\|Nx\\|^2 \\ge 0"}/> for
                            every <InlineMath math={"x"}/>. This direction is the one used in practice: a
                            covariance matrix is positive semidefinite because it is built as{" "}
                            <InlineMath math={"N^\\top N"}/> from data, and Chapter 4 computes such an{" "}
                            <InlineMath math={"N"}/> under the name Cholesky factor.
                        </p>}
                        ko={<p>
                            <strong>오른쪽에서 왼쪽은 한 줄이다.</strong>{" "}
                            <InlineMath math={"N^\\top N = P"}/>이면 모든{" "}
                            <InlineMath math={"x"}/>에 대해{" "}
                            <InlineMath math={"x^\\top P x = x^\\top N^\\top N x = \\|Nx\\|^2 \\ge 0"}/>이다.
                            실무에서 쓰이는 것은 이쪽이다. 공분산 행렬은 데이터로부터{" "}
                            <InlineMath math={"N^\\top N"}/> 꼴로 만들어지기 때문에 positive semidefinite이고,
                            4장이 그런 <InlineMath math={"N"}/>을 Cholesky 인자라는 이름으로 계산한다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Theorem n="3.87" title={<T en={<>Schur complements</>} ko={<>Schur complement</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"A"}/> be <InlineMath math={"n \\times n"}/> symmetric,{" "}
                        <InlineMath math={"B"}/> be <InlineMath math={"n \\times m"}/>, and{" "}
                        <InlineMath math={"C"}/> be <InlineMath math={"m \\times m"}/> symmetric. For the
                        symmetric block matrix <InlineMath math={"M"}/> below, the three statements are
                        equivalent.
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>가 <InlineMath math={"n \\times n"}/> 대칭,{" "}
                        <InlineMath math={"B"}/>가 <InlineMath math={"n \\times m"}/>,{" "}
                        <InlineMath math={"C"}/>가 <InlineMath math={"m \\times m"}/> 대칭이라 하자. 아래
                        대칭 블록 행렬 <InlineMath math={"M"}/>에 대해 세 진술은 동치다.
                    </p>}
                />
                <BlockMath math={"M = \\begin{bmatrix} A & B \\\\ B^\\top & C \\end{bmatrix} \\qquad \\begin{aligned} &\\text{(a)} \\;\\; M > 0 \\\\ &\\text{(b)} \\;\\; A > 0 \\;\\text{ and }\\; C - B^\\top A^{-1} B > 0 \\\\ &\\text{(c)} \\;\\; C > 0 \\;\\text{ and }\\; A - B C^{-1} B^\\top > 0 \\end{aligned}"}/>
                <Terms items={[
                    ["M", <T en={<>an <InlineMath math={"(n+m) \\times (n+m)"}/> symmetric matrix, split into blocks</>}
                            ko={<>블록으로 쪼갠 <InlineMath math={"(n+m) \\times (n+m)"}/> 대칭 행렬</>}/>],
                    ["C - B^\\top A^{-1} B", <T en={<>the <strong>Schur complement of <InlineMath math={"A"}/> in <InlineMath math={"M"}/></strong>, an <InlineMath math={"m \\times m"}/> matrix</>}
                                               ko={<><strong><InlineMath math={"M"}/>에서 <InlineMath math={"A"}/>의 Schur complement</strong>. <InlineMath math={"m \\times m"}/> 행렬이다</>}/>],
                    ["A - B C^{-1} B^\\top", <T en={<>the Schur complement of <InlineMath math={"C"}/> in <InlineMath math={"M"}/>, an <InlineMath math={"n \\times n"}/> matrix</>}
                                               ko={<><InlineMath math={"M"}/>에서 <InlineMath math={"C"}/>의 Schur complement. <InlineMath math={"n \\times n"}/> 행렬이다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            Show (a) <InlineMath math={"\\iff"}/> (b); the proof of (a){" "}
                            <InlineMath math={"\\iff"}/> (c) is the same with the blocks swapped.
                        </p>}
                        ko={<p>
                            (a) <InlineMath math={"\\iff"}/> (b)를 보인다. (a){" "}
                            <InlineMath math={"\\iff"}/> (c)의 증명은 블록을 바꾼 것뿐이다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>(a) <InlineMath math={"\\implies"}/> (b).</strong> Test{" "}
                            <InlineMath math={"M > 0"}/> on vectors whose lower block is zero. For{" "}
                            <InlineMath math={"x \\neq 0"}/>,
                        </p>}
                        ko={<p>
                            <strong>(a) <InlineMath math={"\\implies"}/> (b).</strong> 아래 블록이 0인
                            벡터로 <InlineMath math={"M > 0"}/>을 시험한다.{" "}
                            <InlineMath math={"x \\neq 0"}/>에 대해
                        </p>}
                    />
                    <BlockMath math={"0 < \\begin{bmatrix} x \\\\ 0 \\end{bmatrix}^\\top \\! M \\begin{bmatrix} x \\\\ 0 \\end{bmatrix} = \\begin{bmatrix} x^\\top & 0 \\end{bmatrix} \\begin{bmatrix} Ax \\\\ B^\\top x \\end{bmatrix} = x^\\top A x"}/>
                    <Terms items={[
                        ["(x, 0)", <T en={<>a restricted test direction; a <InlineMath math={"\\forall"}/> statement may of course be applied to a special case</>}
                                     ko={<>시험 방향을 제한한 것. <InlineMath math={"\\forall"}/> 명제는 특수한 경우에 적용해도 된다</>}/>],
                        ["x^\\top A x", <T en={<>positive for every <InlineMath math={"x \\neq 0"}/>, which is <InlineMath math={"A > 0"}/>; in particular <InlineMath math={"A^{-1}"}/> exists</>}
                                          ko={<>모든 <InlineMath math={"x \\neq 0"}/>에서 양수, 곧 <InlineMath math={"A > 0"}/>이다. 특히 <InlineMath math={"A^{-1}"}/>이 존재한다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Now choose the test vector cleverly. Fix{" "}
                            <InlineMath math={"y \\neq 0"}/> and take{" "}
                            <InlineMath math={"x = -A^{-1} B y"}/>, which is the choice that zeroes the top
                            block of <InlineMath math={"M (x, y)"}/>:
                        </p>}
                        ko={<p>
                            이제 시험 벡터를 영리하게 고른다.{" "}
                            <InlineMath math={"y \\neq 0"}/>을 고정하고{" "}
                            <InlineMath math={"x = -A^{-1} B y"}/>로 두면{" "}
                            <InlineMath math={"M (x, y)"}/>의 위 블록이 0이 된다.
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} 0 < \\begin{bmatrix} x \\\\ y \\end{bmatrix}^\\top \\! M \\begin{bmatrix} x \\\\ y \\end{bmatrix} &= \\begin{bmatrix} -y^\\top B^\\top A^{-1} & y^\\top \\end{bmatrix} \\begin{bmatrix} 0 \\\\ -B^\\top A^{-1} B y + C y \\end{bmatrix} \\\\ &= y^\\top \\left( C - B^\\top A^{-1} B \\right) y \\end{aligned}"}/>
                    <Terms items={[
                        ["Ax + By = 0", <T en={<>the top block, zeroed by construction; this is why <InlineMath math={"A^{-1}"}/> had to exist first</>}
                                          ko={<>위 블록. 구성에 의해 0이 된다. <InlineMath math={"A^{-1}"}/>이 먼저 존재해야 했던 이유가 이것이다</>}/>],
                        ["y", <T en={<>arbitrary and nonzero, so the conclusion is exactly <InlineMath math={"C - B^\\top A^{-1} B > 0"}/></>}
                                ko={<>임의의 0이 아닌 벡터. 그래서 결론이 정확히 <InlineMath math={"C - B^\\top A^{-1} B > 0"}/>이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>(b) <InlineMath math={"\\implies"}/> (a).</strong> Given an arbitrary
                            nonzero <InlineMath math={"(x, y)"}/>, define{" "}
                            <InlineMath math={"\\bar{x} := x + A^{-1} B y"}/>. Then{" "}
                            <InlineMath math={"(x, y) \\neq 0"}/> if and only if{" "}
                            <InlineMath math={"(\\bar{x}, y) \\neq 0"}/>, and expanding the form with{" "}
                            <InlineMath math={"(u + v)^\\top M (u + v) = u^\\top M u + v^\\top M v + 2 u^\\top M v"}/> gives
                        </p>}
                        ko={<p>
                            <strong>(b) <InlineMath math={"\\implies"}/> (a).</strong> 임의의 0이 아닌{" "}
                            <InlineMath math={"(x, y)"}/>에 대해{" "}
                            <InlineMath math={"\\bar{x} := x + A^{-1} B y"}/>라 두자.{" "}
                            <InlineMath math={"(x, y) \\neq 0"}/>일 필요충분조건이{" "}
                            <InlineMath math={"(\\bar{x}, y) \\neq 0"}/>이고,{" "}
                            <InlineMath math={"(u + v)^\\top M (u + v) = u^\\top M u + v^\\top M v + 2 u^\\top M v"}/>로
                            전개하면
                        </p>}
                    />
                    <BlockMath math={"\\begin{bmatrix} x \\\\ y \\end{bmatrix}^\\top \\! M \\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\underbrace{\\bar{x}^\\top A \\bar{x}}_{> \\, 0 \\text{ if } \\bar{x} \\neq 0} + \\underbrace{y^\\top \\left( C - B^\\top A^{-1} B \\right) y}_{> \\, 0 \\text{ if } y \\neq 0}"}/>
                    <Terms items={[
                        ["\\bar{x}", <T en={<>the shifted variable; the cross term <InlineMath math={"2 u^\\top M v"}/> vanishes for exactly this shift</>}
                                       ko={<>평행 이동한 변수. 교차항 <InlineMath math={"2 u^\\top M v"}/>이 정확히 이 이동에서 사라진다</>}/>],
                        ["\\bar{x}^\\top A \\bar{x}", <T en={<>non-negative by <InlineMath math={"A > 0"}/>, and strictly positive unless <InlineMath math={"\\bar{x} = 0"}/></>}
                                                        ko={<><InlineMath math={"A > 0"}/>에 의해 음이 아니고, <InlineMath math={"\\bar{x} = 0"}/>이 아니면 양수다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Both terms are non-negative and at least one is strictly positive, so the sum is
                            positive and <InlineMath math={"M > 0"}/>.
                        </p>}
                        ko={<p>
                            두 항이 모두 음이 아니고 적어도 하나가 양수이므로 합이 양수이고{" "}
                            <InlineMath math={"M > 0"}/>이다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Example n="3.89" title={<T en={<>The <InlineMath math={"2 \\times 2"}/> test</>} ko={<><InlineMath math={"2 \\times 2"}/> 판정</>}/>}>
                <T
                    en={<p>
                        Apply the theorem with <InlineMath math={"A = [a]"}/>,{" "}
                        <InlineMath math={"B = [b]"}/>, <InlineMath math={"C = [c]"}/>, all{" "}
                        <InlineMath math={"1 \\times 1"}/>. Condition (b) becomes two scalar inequalities:
                    </p>}
                    ko={<p>
                        정리에 <InlineMath math={"A = [a]"}/>,{" "}
                        <InlineMath math={"B = [b]"}/>, <InlineMath math={"C = [c]"}/>을 전부{" "}
                        <InlineMath math={"1 \\times 1"}/>로 넣는다. 조건 (b)가 스칼라 부등식 둘이 된다.
                    </p>}
                />
                <BlockMath math={"\\begin{bmatrix} a & b \\\\ b & c \\end{bmatrix} > 0 \\iff a > 0 \\;\\text{ and }\\; c - b a^{-1} b > 0 \\iff a > 0 \\;\\text{ and }\\; \\det M > 0"}/>
                <Terms items={[
                    ["c - b a^{-1} b", <T en={<>the Schur complement, which is <InlineMath math={"(ac - b^2)/a"}/>; since <InlineMath math={"a > 0"}/>, its sign is the sign of <InlineMath math={"\\det M"}/></>}
                                         ko={<>Schur complement. <InlineMath math={"(ac - b^2)/a"}/>이며, <InlineMath math={"a > 0"}/>이므로 그 부호가 <InlineMath math={"\\det M"}/>의 부호와 같다</>}/>],
                    ["\\det M = ac - b^2", <T en={<>the two-condition test you can run in your head on any <InlineMath math={"2 \\times 2"}/></>}
                                             ko={<>어떤 <InlineMath math={"2 \\times 2"}/>에도 암산으로 돌릴 수 있는 두 줄짜리 판정</>}/>],
                ]}/>
                <T
                    en={<p>
                        Checking three matrices with it:{" "}
                        <InlineMath math={"M_1 = \\left[\\begin{smallmatrix} 3 & -2 \\\\ -2 & 3 \\end{smallmatrix}\\right]"}/> has{" "}
                        <InlineMath math={"a = 3 > 0"}/> and{" "}
                        <InlineMath math={"\\det = 5 > 0"}/>, so <InlineMath math={"M_1 > 0"}/>.{" "}
                        <InlineMath math={"M_2 = \\left[\\begin{smallmatrix} 2 & 3 \\\\ 3 & 2 \\end{smallmatrix}\\right]"}/> has{" "}
                        <InlineMath math={"a = 2 > 0"}/> but{" "}
                        <InlineMath math={"\\det = -5 < 0"}/>, so it is not positive definite. Note that the
                        eigenvalue test would have needed a square root; this one needs a multiplication.
                    </p>}
                    ko={<p>
                        이것으로 행렬 셋을 확인해 보면,{" "}
                        <InlineMath math={"M_1 = \\left[\\begin{smallmatrix} 3 & -2 \\\\ -2 & 3 \\end{smallmatrix}\\right]"}/>은{" "}
                        <InlineMath math={"a = 3 > 0"}/>이고{" "}
                        <InlineMath math={"\\det = 5 > 0"}/>이라 <InlineMath math={"M_1 > 0"}/>이다.{" "}
                        <InlineMath math={"M_2 = \\left[\\begin{smallmatrix} 2 & 3 \\\\ 3 & 2 \\end{smallmatrix}\\right]"}/>은{" "}
                        <InlineMath math={"a = 2 > 0"}/>이지만{" "}
                        <InlineMath math={"\\det = -5 < 0"}/>이라 positive definite가 아니다. 고윳값 판정은
                        제곱근을 필요로 했을 텐데 이쪽은 곱셈 하나면 된다.
                    </p>}
                />
            </Example>
            <Example n="3.90" title={<T en={<>A <InlineMath math={"3 \\times 3"}/> with a free parameter</>}
                                        ko={<>매개변수가 하나 있는 <InlineMath math={"3 \\times 3"}/></>}/>}>
                <T
                    en={<p>
                        For which <InlineMath math={"\\alpha \\in \\mathbb{R}"}/> is the matrix below
                        positive definite? Partition it so the invertible block is the easy one, and apply
                        condition (c):
                    </p>}
                    ko={<p>
                        아래 행렬이 positive definite가 되는{" "}
                        <InlineMath math={"\\alpha \\in \\mathbb{R}"}/>은 무엇인가? 가역 블록이 쉬운 쪽이
                        되도록 쪼개고 조건 (c)를 적용한다.
                    </p>}
                />
                <BlockMath math={"M_3 = \\begin{bmatrix} \\alpha & 1 & 1 \\\\ 1 & 2 & 1 \\\\ 1 & 1 & 3 \\end{bmatrix}, \\qquad A = [\\alpha], \\quad B = \\begin{bmatrix} 1 & 1 \\end{bmatrix}, \\quad C = \\begin{bmatrix} 2 & 1 \\\\ 1 & 3 \\end{bmatrix}"}/>
                <Terms items={[
                    ["\\alpha", <T en={<>the unknown, sitting alone in the top-left <InlineMath math={"1 \\times 1"}/> block</>}
                                  ko={<>미지수. 왼쪽 위 <InlineMath math={"1 \\times 1"}/> 블록에 홀로 앉아 있다</>}/>],
                    ["C", <T en={<>the known block; by Example 3.89, <InlineMath math={"2 > 0"}/> and <InlineMath math={"\\det C = 5 > 0"}/> give <InlineMath math={"C > 0"}/></>}
                            ko={<>알려진 블록. Example 3.89에 의해 <InlineMath math={"2 > 0"}/>이고 <InlineMath math={"\\det C = 5 > 0"}/>이라 <InlineMath math={"C > 0"}/>이다</>}/>],
                ]}/>
                <BlockMath math={"C^{-1} = \\frac{1}{5}\\begin{bmatrix} 3 & -1 \\\\ -1 & 2 \\end{bmatrix}, \\qquad A - BC^{-1}B^\\top = \\alpha - \\frac{1}{5}\\begin{bmatrix} 1 & 1 \\end{bmatrix}\\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix} = \\alpha - \\frac{3}{5}"}/>
                <Terms items={[
                    ["C^{-1}B^\\top", <T en={<><InlineMath math={"\\tfrac{1}{5}(3 - 1, -1 + 2)^\\top = \\tfrac{1}{5}(2, 1)^\\top"}/></>}
                                        ko={<><InlineMath math={"\\tfrac{1}{5}(3 - 1, -1 + 2)^\\top = \\tfrac{1}{5}(2, 1)^\\top"}/></>}/>],
                    ["\\alpha - \\tfrac{3}{5}", <T en={<>the Schur complement of <InlineMath math={"C"}/>, a <InlineMath math={"1 \\times 1"}/> matrix, so the whole test is <InlineMath math={"\\alpha > 3/5"}/></>}
                                                  ko={<><InlineMath math={"C"}/>의 Schur complement. <InlineMath math={"1 \\times 1"}/> 행렬이므로 판정 전체가 <InlineMath math={"\\alpha > 3/5"}/>이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        So <InlineMath math={"M_3 > 0"}/> exactly when{" "}
                        <InlineMath math={"\\alpha > 0.6"}/>. Condition (b) with the same partition gives the
                        same answer with more work: it asks for{" "}
                        <InlineMath math={"\\alpha > 0"}/>,{" "}
                        <InlineMath math={"2 - 1/\\alpha > 0"}/>, and{" "}
                        <InlineMath math={"(5\\alpha - 3)/\\alpha > 0"}/>, whose intersection is{" "}
                        <InlineMath math={"(3/5, \\infty)"}/> again. Which partition to use is a matter of
                        which block you would rather invert.
                    </p>}
                    ko={<p>
                        따라서 <InlineMath math={"M_3 > 0"}/>일 필요충분조건은{" "}
                        <InlineMath math={"\\alpha > 0.6"}/>이다. 같은 분할로 조건 (b)를 쓰면 손은 더 가지만
                        답은 같다. <InlineMath math={"\\alpha > 0"}/>,{" "}
                        <InlineMath math={"2 - 1/\\alpha > 0"}/>,{" "}
                        <InlineMath math={"(5\\alpha - 3)/\\alpha > 0"}/>을 요구하고, 그 교집합이 다시{" "}
                        <InlineMath math={"(3/5, \\infty)"}/>다. 어느 분할을 쓸지는 어느 블록을 역행렬 내는 편이
                        나은지의 문제다.
                    </p>}
                />
            </Example>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Least Squares Problems</h2>} ko={<h2>최소제곱 문제</h2>}/>
            <T
                en={<p>
                    Everything above was stated for an abstract inner product space. This section cashes it
                    in on the two shapes of linear system a robot actually produces: too many equations, and
                    too few. Both are the Projection Theorem with different bookkeeping.
                </p>}
                ko={<p>
                    지금까지는 전부 추상적인 내적 공간에서 진술한 것이다. 이 절은 그것을 로봇이 실제로 만들어
                    내는 두 가지 모양의 선형계, 곧 식이 너무 많은 경우와 너무 적은 경우에서 현금화한다. 둘 다
                    장부만 다른 사영 정리다.
                </p>}
            />
            <Remark title={<T en={<>What "overdetermined" means, and what it does not</>}
                              ko={<>"overdetermined"의 뜻과 뜻이 아닌 것</>}/>}>
                <T
                    en={<p>
                        A system <InlineMath math={"A\\alpha = b"}/> is <strong>overdetermined</strong> when{" "}
                        <InlineMath math={"A"}/> has more rows than columns, that is, more equations than
                        unknowns. That is a statement about shape, not about solvability. Having no exact
                        solution is a different statement:
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>의 행이 열보다 많을 때, 곧 식이 미지수보다 많을 때{" "}
                        <InlineMath math={"A\\alpha = b"}/>를 <strong>overdetermined</strong>라 한다. 이는
                        모양에 대한 진술이지 풀림에 대한 진술이 아니다. 정확한 해가 없다는 것은 다른 진술이다.
                    </p>}
                />
                <BlockMath math={"A\\alpha = b \\text{ has an exact solution} \\iff b \\in \\operatorname{col\\,span}\\{A\\}"}/>
                <Terms items={[
                    ["A", <T en={<>an <InlineMath math={"n \\times m"}/> real matrix with <InlineMath math={"n \\ge m"}/></>}
                            ko={<><InlineMath math={"n \\ge m"}/>인 실 <InlineMath math={"n \\times m"}/> 행렬</>}/>],
                    ["\\operatorname{col\\,span}\\{A\\}", <T en={<>the span of the columns of <InlineMath math={"A"}/>, a subspace of <InlineMath math={"\\mathbb{R}^n"}/> of dimension <InlineMath math={"m"}/> when the columns are independent</>}
                                                            ko={<><InlineMath math={"A"}/>의 열들이 만드는 span. 열이 독립이면 차원이 <InlineMath math={"m"}/>인 <InlineMath math={"\\mathbb{R}^n"}/>의 부분 공간이다</>}/>],
                    ["b", <T en={<>the measurement column; if it happens to land inside that subspace, an overdetermined system is solved exactly</>}
                            ko={<>측정값의 열. 우연히 그 부분 공간 안에 떨어지면 overdetermined 문제도 정확히 풀린다</>}/>],
                ]}/>
                <T
                    en={<p>
                        When <InlineMath math={"b"}/> is outside the column span there is nothing to solve,
                        so we change the question and ask for the{" "}
                        <InlineMath math={"\\alpha"}/> that makes the error smallest. Read that way, the
                        problem is verbatim the one Theorem 3.36 answers, with{" "}
                        <InlineMath math={"M = \\operatorname{col\\,span}\\{A\\}"}/> and{" "}
                        <InlineMath math={"x = b"}/>. The printed notes have a slip here and say "more rows
                        than equations"; rows are equations, and the comparison is with the columns.
                    </p>}
                    ko={<p>
                        <InlineMath math={"b"}/>가 열 span 밖에 있으면 풀 것이 없으므로 질문을 바꿔, 오차를 가장
                        작게 만드는 <InlineMath math={"\\alpha"}/>를 찾는다. 그렇게 읽으면 이 문제는{" "}
                        <InlineMath math={"M = \\operatorname{col\\,span}\\{A\\}"}/>,{" "}
                        <InlineMath math={"x = b"}/>로 둔 Theorem 3.36 그 자체다. 인쇄된 원 교재는 여기서 "행이
                        식보다 많을 때"라고 적었는데, 행이 곧 식이고 비교 대상은 열이다.
                    </p>}
                />
            </Remark>
            <Proposition n="3.43" title={<T en={<>Overdetermined equations in the Euclidean norm</>}
                                            ko={<>유클리드 norm에서의 overdetermined 방정식</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"A"}/> be a real{" "}
                        <InlineMath math={"n \\times m"}/> matrix with{" "}
                        <InlineMath math={"n \\ge m"}/> and{" "}
                        <InlineMath math={"\\operatorname{rank}(A) = m"}/>, so the columns are independent.
                        Then
                    </p>}
                    ko={<p>
                        <InlineMath math={"n \\ge m"}/>이고{" "}
                        <InlineMath math={"\\operatorname{rank}(A) = m"}/>인 실{" "}
                        <InlineMath math={"n \\times m"}/> 행렬 <InlineMath math={"A"}/>를 두자. 열이
                        독립이라는 뜻이다. 그러면
                    </p>}
                />
                <BlockMath math={"\\hat{\\alpha} = \\operatorname*{arg\\,min}_{\\alpha \\in \\mathbb{R}^m} \\|A\\alpha - b\\| \\quad \\Longleftrightarrow \\quad (A^\\top A)\\hat{\\alpha} = A^\\top b \\quad \\Longleftrightarrow \\quad \\hat{\\alpha} = (A^\\top A)^{-1} A^\\top b"}/>
                <Terms items={[
                    ["\\hat{\\alpha}", <T en={<>the coefficient column, <InlineMath math={"m"}/> numbers, not the approximation itself</>}
                                         ko={<>계수의 열. 근사값 자체가 아니라 수 <InlineMath math={"m"}/>개다</>}/>],
                    ["A^\\top A", <T en={<>the Gram matrix of the columns of <InlineMath math={"A"}/>, <InlineMath math={"m \\times m"}/> and invertible by Proposition 3.41</>}
                                    ko={<><InlineMath math={"A"}/>의 열들의 Gram 행렬. <InlineMath math={"m \\times m"}/>이고 Proposition 3.41에 의해 가역이다</>}/>],
                    ["A^\\top b", <T en={<>the data column <InlineMath math={"\\beta"}/>, whose <InlineMath math={"i"}/>-th entry is <InlineMath math={"\\langle A_i, b \\rangle"}/></>}
                                    ko={<>데이터 열 <InlineMath math={"\\beta"}/>. <InlineMath math={"i"}/>번째 성분이 <InlineMath math={"\\langle A_i, b \\rangle"}/>다</>}/>],
                ]}/>
                <Proof label={t("Two derivations", "유도 두 가지")}>
                    <T
                        en={<p>
                            <strong>The calculus route.</strong> Minimizing a non-negative quantity is the
                            same as minimizing its square, so drop the outer square root and differentiate:
                        </p>}
                        ko={<p>
                            <strong>미분으로 가는 길.</strong> 음이 아닌 양을 최소화하는 것은 그 제곱을 최소화하는
                            것과 같으므로, 바깥 제곱근을 떼고 미분한다.
                        </p>}
                    />
                    <BlockMath math={"\\frac{\\partial}{\\partial \\alpha}\\left[ (A\\alpha - b)^\\top (A\\alpha - b) \\right] = 2 A^\\top (A\\alpha - b) = 0 \\;\\Longrightarrow\\; A^\\top A \\hat{\\alpha} = A^\\top b"}/>
                    <Terms items={[
                        ["(A\\alpha - b)^\\top(A\\alpha - b)", <T en={<><InlineMath math={"\\|e\\|^2 = \\sum_i e_i^2"}/> with <InlineMath math={"e = A\\alpha - b"}/></>}
                                                                ko={<><InlineMath math={"e = A\\alpha - b"}/>에 대한 <InlineMath math={"\\|e\\|^2 = \\sum_i e_i^2"}/></>}/>],
                        ["A^\\top(A\\alpha - b)", <T en={<>the gradient; setting it to zero is a necessary condition, and convexity of the quadratic makes it sufficient</>}
                                                    ko={<>기울기. 0으로 두는 것이 필요조건이고, 이차식의 볼록성이 그것을 충분조건으로 만든다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            This route works but hides the geometry, and it gives no clue what to do when the
                            norm changes.
                        </p>}
                        ko={<p>
                            이 길은 통하지만 기하를 숨긴다. 그리고 norm이 바뀌었을 때 무엇을 해야 하는지에 대한
                            단서를 주지 않는다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>The projection route.</strong> Partition{" "}
                            <InlineMath math={"A = [\\, A_1 \\; \\cdots \\; A_m \\,]"}/> by columns and note
                            that <InlineMath math={"A\\alpha = \\alpha_1 A_1 + \\cdots + \\alpha_m A_m"}/>.
                            So the problem asks for the linear combination of the columns closest to{" "}
                            <InlineMath math={"b"}/>. That is Summary 3.42 with{" "}
                            <InlineMath math={"y^i = A_i"}/>,{" "}
                            <InlineMath math={"x = b"}/>, and the dot product. Compute the two objects:
                        </p>}
                        ko={<p>
                            <strong>사영으로 가는 길.</strong>{" "}
                            <InlineMath math={"A = [\\, A_1 \\; \\cdots \\; A_m \\,]"}/>으로 열을 쪼개면{" "}
                            <InlineMath math={"A\\alpha = \\alpha_1 A_1 + \\cdots + \\alpha_m A_m"}/>이다.
                            그러니 이 문제는 <InlineMath math={"b"}/>에 가장 가까운 열들의 선형 결합을 묻고 있다.{" "}
                            <InlineMath math={"y^i = A_i"}/>, <InlineMath math={"x = b"}/>, dot product로 둔
                            Remark 3.42다. 두 대상을 계산해 보자.
                        </p>}
                    />
                    <BlockMath math={"G_{ij} = \\langle A_i, A_j \\rangle = A_i^\\top A_j = [A^\\top A]_{ij}, \\qquad \\beta_i = \\langle A_i, b \\rangle = A_i^\\top b = [A^\\top b]_i"}/>
                    <Terms items={[
                        ["[A^\\top A]_{ij}", <T en={<>row <InlineMath math={"i"}/> of <InlineMath math={"A^\\top"}/> is column <InlineMath math={"i"}/> of <InlineMath math={"A"}/> transposed, so "row times column" gives exactly <InlineMath math={"A_i^\\top A_j"}/></>}
                                               ko={<><InlineMath math={"A^\\top"}/>의 <InlineMath math={"i"}/>행이 <InlineMath math={"A"}/>의 <InlineMath math={"i"}/>열을 전치한 것이므로, "행 곱하기 열"이 정확히 <InlineMath math={"A_i^\\top A_j"}/>가 된다</>}/>],
                        ["G = A^\\top A", <T en={<>the Gram matrix appears without being asked for; the normal equations were never anything else</>}
                                            ko={<>Gram 행렬이 부르지도 않았는데 나타난다. normal equation은 애초에 다른 무엇이 아니었다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            So <InlineMath math={"G = A^\\top A"}/> and{" "}
                            <InlineMath math={"\\beta = A^\\top b"}/>, and the normal equations of Definition
                            3.39 read <InlineMath math={"A^\\top A \\hat{\\alpha} = A^\\top b"}/>. The
                            geometric content that calculus lost: the residual{" "}
                            <InlineMath math={"e = A\\hat{\\alpha} - b"}/> satisfies{" "}
                            <InlineMath math={"A^\\top e = 0"}/>, which is exactly{" "}
                            <InlineMath math={"e \\perp A_i"}/> for every column.
                        </p>}
                        ko={<p>
                            따라서 <InlineMath math={"G = A^\\top A"}/>,{" "}
                            <InlineMath math={"\\beta = A^\\top b"}/>이고 Definition 3.39의 normal equation은{" "}
                            <InlineMath math={"A^\\top A \\hat{\\alpha} = A^\\top b"}/>가 된다. 미분이 놓친
                            기하적 내용은 이것이다. 잔차{" "}
                            <InlineMath math={"e = A\\hat{\\alpha} - b"}/>가{" "}
                            <InlineMath math={"A^\\top e = 0"}/>을 만족하고, 그것이 곧 모든 열에 대한{" "}
                            <InlineMath math={"e \\perp A_i"}/>다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <T
                en={<p>
                    The figure fits a line or a parabola to points you can drag. The number to watch is not
                    the fit but <InlineMath math={"A^\\top e"}/>, which stays at zero no matter where the
                    data goes.
                </p>}
                ko={<p>
                    아래 그림은 끌 수 있는 점들에 직선이나 포물선을 맞춘다. 지켜볼 값은 적합 자체가 아니라{" "}
                    <InlineMath math={"A^\\top e"}/>다. 데이터를 어디로 옮겨도 0에 머문다.
                </p>}
            />
            <CanvasFigure label={t("Least squares fitting, with the normal equations updating live",
                "최소제곱 적합과 실시간으로 갱신되는 normal equation")}
                          modal={<LeastSquaresLab width={720} height={430}/>}
                          bodyClassName="w-[min(94vw,760px)]">
                <LeastSquaresLab/>
            </CanvasFigure>
            <Example title={<T en={<>Fitting a line to three points, by hand</>} ko={<>세 점에 직선 맞추기, 손으로</>}/>}>
                <T
                    en={<p>
                        Fit <InlineMath math={"y = \\alpha_1 + \\alpha_2 t"}/> to the data{" "}
                        <InlineMath math={"(t, y) = (0, 1), (1, 3), (2, 2)"}/>. Each data point becomes one
                        row, and the two columns are the two basis functions{" "}
                        <InlineMath math={"1"}/> and <InlineMath math={"t"}/> sampled at the three times:
                    </p>}
                    ko={<p>
                        데이터 <InlineMath math={"(t, y) = (0, 1), (1, 3), (2, 2)"}/>에{" "}
                        <InlineMath math={"y = \\alpha_1 + \\alpha_2 t"}/>를 맞춘다. 데이터 하나가 행 하나가
                        되고, 두 열은 기저 함수 <InlineMath math={"1"}/>과{" "}
                        <InlineMath math={"t"}/>를 세 시각에서 표본한 것이다.
                    </p>}
                />
                <BlockMath math={"A = \\begin{bmatrix} 1 & 0 \\\\ 1 & 1 \\\\ 1 & 2 \\end{bmatrix}, \\quad b = \\begin{bmatrix} 1 \\\\ 3 \\\\ 2 \\end{bmatrix}, \\quad A^\\top A = \\begin{bmatrix} 3 & 3 \\\\ 3 & 5 \\end{bmatrix}, \\quad A^\\top b = \\begin{bmatrix} 6 \\\\ 7 \\end{bmatrix}"}/>
                <Terms items={[
                    ["A", <T en={<>the <InlineMath math={"3 \\times 2"}/> design matrix: three equations, two unknowns, hence overdetermined</>}
                            ko={<><InlineMath math={"3 \\times 2"}/> 설계 행렬. 식 셋에 미지수 둘이라 overdetermined다</>}/>],
                    ["A^\\top A", <T en={<>entries <InlineMath math={"\\sum 1 = 3"}/>, <InlineMath math={"\\sum t_i = 3"}/>, and <InlineMath math={"\\sum t_i^2 = 5"}/></>}
                                    ko={<>성분이 <InlineMath math={"\\sum 1 = 3"}/>, <InlineMath math={"\\sum t_i = 3"}/>, <InlineMath math={"\\sum t_i^2 = 5"}/>이다</>}/>],
                    ["A^\\top b", <T en={<>entries <InlineMath math={"\\sum y_i = 6"}/> and <InlineMath math={"\\sum t_i y_i = 0 + 3 + 4 = 7"}/></>}
                                    ko={<>성분이 <InlineMath math={"\\sum y_i = 6"}/>과 <InlineMath math={"\\sum t_i y_i = 0 + 3 + 4 = 7"}/>이다</>}/>],
                ]}/>
                <BlockMath math={"\\hat{\\alpha} = \\frac{1}{6}\\begin{bmatrix} 5 & -3 \\\\ -3 & 3 \\end{bmatrix}\\begin{bmatrix} 6 \\\\ 7 \\end{bmatrix} = \\frac{1}{6}\\begin{bmatrix} 9 \\\\ 3 \\end{bmatrix} = \\begin{bmatrix} 3/2 \\\\ 1/2 \\end{bmatrix} \\quad \\Longrightarrow \\quad \\hat{y}(t) = \\tfrac{3}{2} + \\tfrac{1}{2} t"}/>
                <Terms items={[
                    ["\\det(A^\\top A) = 6", <T en={<><InlineMath math={"15 - 9"}/>, nonzero, so the columns are independent</>}
                                              ko={<><InlineMath math={"15 - 9"}/>. 0이 아니므로 열이 독립이다</>}/>],
                    ["\\hat{y}(t)", <T en={<>the fitted line; at <InlineMath math={"t = 0, 1, 2"}/> it predicts <InlineMath math={"1.5, 2, 2.5"}/></>}
                                      ko={<>맞춘 직선. <InlineMath math={"t = 0, 1, 2"}/>에서 <InlineMath math={"1.5, 2, 2.5"}/>를 예측한다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The residual is <InlineMath math={"e = A\\hat{\\alpha} - b = (0.5, -1, 0.5)^\\top"}/>,
                        with <InlineMath math={"\\|e\\|^2 = 1.5"}/>. Verify the theorem instead of trusting
                        it: <InlineMath math={"A^\\top e"}/> has first entry{" "}
                        <InlineMath math={"0.5 - 1 + 0.5 = 0"}/> and second entry{" "}
                        <InlineMath math={"0 \\cdot 0.5 + 1 \\cdot (-1) + 2 \\cdot 0.5 = 0"}/>. The residual
                        is orthogonal to both columns, which is why no line does better.
                    </p>}
                    ko={<p>
                        잔차는 <InlineMath math={"e = A\\hat{\\alpha} - b = (0.5, -1, 0.5)^\\top"}/>이고{" "}
                        <InlineMath math={"\\|e\\|^2 = 1.5"}/>다. 정리를 믿는 대신 확인해 보자.{" "}
                        <InlineMath math={"A^\\top e"}/>의 첫 성분이{" "}
                        <InlineMath math={"0.5 - 1 + 0.5 = 0"}/>이고 둘째 성분이{" "}
                        <InlineMath math={"0 \\cdot 0.5 + 1 \\cdot (-1) + 2 \\cdot 0.5 = 0"}/>이다. 잔차가 두
                        열 모두와 직교하며, 그래서 어떤 직선도 이보다 낫지 않다.
                    </p>}
                />
            </Example>
            <Proposition n="3.91" title={<T en={<>Weighted least squares</>} ko={<>weighted least squares</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"S"}/> be an <InlineMath math={"n \\times n"}/> positive
                        definite matrix and equip <InlineMath math={"\\mathbb{R}^n"}/> with{" "}
                        <InlineMath math={"\\langle x, y \\rangle := x^\\top S y"}/>, so that{" "}
                        <InlineMath math={"\\|x\\|^2 = x^\\top S x"}/>. With{" "}
                        <InlineMath math={"A"}/> as in Proposition 3.43,
                    </p>}
                    ko={<p>
                        <InlineMath math={"S"}/>를 <InlineMath math={"n \\times n"}/> positive definite
                        행렬이라 하고 <InlineMath math={"\\mathbb{R}^n"}/>에{" "}
                        <InlineMath math={"\\langle x, y \\rangle := x^\\top S y"}/>를 얹으면{" "}
                        <InlineMath math={"\\|x\\|^2 = x^\\top S x"}/>이다. Proposition 3.43과 같은{" "}
                        <InlineMath math={"A"}/>에 대해
                    </p>}
                />
                <BlockMath math={"\\hat{\\alpha} = \\operatorname*{arg\\,min}_{\\alpha \\in \\mathbb{R}^m} \\|A\\alpha - b\\|^2 \\quad \\Longleftrightarrow \\quad (A^\\top S A)\\hat{\\alpha} = A^\\top S b"}/>
                <Terms items={[
                    ["S", <T en={<>the weight matrix; positive definiteness is exactly what makes <InlineMath math={"x^\\top S y"}/> a legitimate inner product, by Definition 3.75</>}
                            ko={<>가중치 행렬. Definition 3.75에 의해 positive definite라는 조건이 <InlineMath math={"x^\\top S y"}/>을 정당한 내적으로 만드는 바로 그것이다</>}/>],
                    ["A^\\top S A", <T en={<>the Gram matrix of the columns of <InlineMath math={"A"}/> under the new inner product</>}
                                      ko={<>새 내적 아래에서 <InlineMath math={"A"}/> 열들의 Gram 행렬</>}/>],
                    ["\\hat{\\alpha}", <T en={<><InlineMath math={"(A^\\top S A)^{-1}A^\\top S b"}/>; setting <InlineMath math={"S = I"}/> recovers Proposition 3.43</>}
                                         ko={<><InlineMath math={"(A^\\top S A)^{-1}A^\\top S b"}/>. <InlineMath math={"S = I"}/>로 두면 Proposition 3.43이 돌아온다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            No new work is needed. Summary 3.42 was stated for an arbitrary inner product, so
                            recompute the same two objects with the new one:
                        </p>}
                        ko={<p>
                            새로 할 일이 없다. Remark 3.42는 임의의 내적에 대해 진술되었으므로, 같은 두 대상을 새
                            내적으로 다시 계산하기만 하면 된다.
                        </p>}
                    />
                    <BlockMath math={"G_{ij} = \\langle A_i, A_j \\rangle = A_i^\\top S A_j = [A^\\top S A]_{ij}, \\qquad \\beta_i = \\langle b, A_i \\rangle = A_i^\\top S b = [A^\\top S b]_i"}/>
                    <Terms items={[
                        ["A_i", <T en={<>the <InlineMath math={"i"}/>-th column of <InlineMath math={"A"}/>, unchanged; only the way lengths are measured has changed</>}
                                  ko={<><InlineMath math={"A"}/>의 <InlineMath math={"i"}/>번째 열. 그대로다. 바뀐 것은 길이를 재는 방식뿐이다</>}/>],
                        ["S = S^\\top", <T en={<>symmetry of <InlineMath math={"S"}/>, used to write <InlineMath math={"\\langle b, A_i \\rangle"}/> as <InlineMath math={"A_i^\\top S b"}/></>}
                                          ko={<><InlineMath math={"S"}/>의 대칭성. <InlineMath math={"\\langle b, A_i \\rangle"}/>을 <InlineMath math={"A_i^\\top S b"}/>로 적는 데 쓰인다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Independence of the columns makes <InlineMath math={"A^\\top S A"}/> invertible by
                            Proposition 3.41, so <InlineMath math={"\\hat{\\alpha} = (A^\\top S A)^{-1}A^\\top S b"}/>.
                            Continuing the line fit above with{" "}
                            <InlineMath math={"S = \\operatorname{diag}(1, 4, 1)"}/>, which says the middle
                            measurement is four times as trustworthy:
                        </p>}
                        ko={<p>
                            열이 독립이므로 Proposition 3.41에 의해{" "}
                            <InlineMath math={"A^\\top S A"}/>가 가역이고{" "}
                            <InlineMath math={"\\hat{\\alpha} = (A^\\top S A)^{-1}A^\\top S b"}/>이다. 위의 직선
                            적합을 <InlineMath math={"S = \\operatorname{diag}(1, 4, 1)"}/>로 이어 가 보자.
                            가운데 측정을 네 배로 믿는다는 뜻이다.
                        </p>}
                    />
                    <BlockMath math={"A^\\top S A = \\begin{bmatrix} 6 & 6 \\\\ 6 & 8 \\end{bmatrix}, \\quad A^\\top S b = \\begin{bmatrix} 15 \\\\ 16 \\end{bmatrix}, \\quad \\hat{\\alpha} = \\frac{1}{12}\\begin{bmatrix} 24 \\\\ 6 \\end{bmatrix} = \\begin{bmatrix} 2 \\\\ 1/2 \\end{bmatrix}"}/>
                    <Terms items={[
                        ["A^\\top S A", <T en={<>the weighted sums <InlineMath math={"\\sum s_i = 6"}/>, <InlineMath math={"\\sum s_i t_i = 6"}/>, <InlineMath math={"\\sum s_i t_i^2 = 8"}/></>}
                                          ko={<>가중합 <InlineMath math={"\\sum s_i = 6"}/>, <InlineMath math={"\\sum s_i t_i = 6"}/>, <InlineMath math={"\\sum s_i t_i^2 = 8"}/></>}/>],
                        ["\\hat{\\alpha} = (2, 1/2)^\\top", <T en={<>the line <InlineMath math={"2 + t/2"}/>; at <InlineMath math={"t = 1"}/> its error is <InlineMath math={"0.5"}/> instead of the <InlineMath math={"1"}/> the unweighted fit accepted</>}
                                                              ko={<>직선 <InlineMath math={"2 + t/2"}/>. <InlineMath math={"t = 1"}/>에서 오차가 가중 없는 적합이 받아들였던 <InlineMath math={"1"}/> 대신 <InlineMath math={"0.5"}/>다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The weighted residual is{" "}
                            <InlineMath math={"e = (1, -0.5, 1)^\\top"}/>, and the orthogonality that holds
                            now is <InlineMath math={"A^\\top S e = 0"}/>, not{" "}
                            <InlineMath math={"A^\\top e = 0"}/>. Change the ruler and you change what a
                            right angle is.
                        </p>}
                        ko={<p>
                            가중 잔차는 <InlineMath math={"e = (1, -0.5, 1)^\\top"}/>이고, 이제 성립하는 직교는{" "}
                            <InlineMath math={"A^\\top e = 0"}/>이 아니라{" "}
                            <InlineMath math={"A^\\top S e = 0"}/>이다. 자를 바꾸면 직각의 뜻이 바뀐다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Proposition n="3.92" title={<T en={<>Recursive least squares</>} ko={<>recursive least squares</>}/>}>
                <T
                    en={<p>
                        Consider measurements arriving one at a time from a constant unknown{" "}
                        <InlineMath math={"x \\in \\mathbb{R}^n"}/>:
                    </p>}
                    ko={<p>
                        상수인 미지 벡터 <InlineMath math={"x \\in \\mathbb{R}^n"}/>에서 측정이 하나씩 도착하는
                        상황을 보자.
                    </p>}
                />
                <BlockMath math={"y_i = C_i x + e_i, \\quad i = 1, 2, 3, \\ldots, \\qquad \\hat{x}_k = \\operatorname*{arg\\,min}_{x \\in \\mathbb{R}^n} \\sum_{i=1}^{k} (y_i - C_i x)^\\top S_i (y_i - C_i x)"}/>
                <Terms items={[
                    ["y_i", <T en={<>the measurement at time <InlineMath math={"i"}/>, a column in <InlineMath math={"\\mathbb{R}^m"}/></>}
                              ko={<>시각 <InlineMath math={"i"}/>의 측정. <InlineMath math={"\\mathbb{R}^m"}/>의 열이다</>}/>],
                    ["C_i", <T en={<>the <InlineMath math={"m \\times n"}/> matrix saying how the state is seen at time <InlineMath math={"i"}/></>}
                              ko={<>시각 <InlineMath math={"i"}/>에 상태가 어떻게 보이는지를 말하는 <InlineMath math={"m \\times n"}/> 행렬</>}/>],
                    ["S_i", <T en={<>a positive definite weight for that measurement: how much this reading is trusted</>}
                              ko={<>그 측정에 대한 positive definite 가중치. 이 값을 얼마나 믿는지다</>}/>],
                    ["\\hat{x}_k", <T en={<>the weighted least squares estimate using all data up to time <InlineMath math={"k"}/></>}
                                     ko={<>시각 <InlineMath math={"k"}/>까지의 데이터를 전부 쓴 weighted least squares 추정값</>}/>],
                ]}/>
                <T
                    en={<p>
                        Let <InlineMath math={"k_0"}/> be the smallest <InlineMath math={"k"}/> for which
                        stacking <InlineMath math={"C_1, \\ldots, C_k"}/> gives rank{" "}
                        <InlineMath math={"n"}/>. For <InlineMath math={"k \\ge k_0"}/> the estimate can be
                        updated recursively, without ever re-solving from scratch:
                    </p>}
                    ko={<p>
                        <InlineMath math={"C_1, \\ldots, C_k"}/>를 쌓았을 때 rank가{" "}
                        <InlineMath math={"n"}/>이 되는 가장 작은 <InlineMath math={"k"}/>를{" "}
                        <InlineMath math={"k_0"}/>라 하자. <InlineMath math={"k \\ge k_0"}/>부터는 처음부터 다시
                        풀 필요 없이 추정값을 재귀적으로 갱신할 수 있다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} \\hat{x}_{k+1} &= \\hat{x}_k + \\underbrace{P_{k+1} C_{k+1}^\\top S_{k+1}}_{\\text{gain}} \\underbrace{\\left( y_{k+1} - C_{k+1}\\hat{x}_k \\right)}_{\\text{innovation}} \\\\ P_{k+1} &= P_k - P_k C_{k+1}^\\top \\left[ C_{k+1} P_k C_{k+1}^\\top + S_{k+1}^{-1} \\right]^{-1} C_{k+1} P_k \\end{aligned}"}/>
                <Terms items={[
                    ["P_k", <T en={<>the inverse of the accumulated Gram matrix, <InlineMath math={"P_k = \\left( \\sum_{i \\le k} C_i^\\top S_i C_i \\right)^{-1}"}/>, initialized at <InlineMath math={"k = k_0"}/></>}
                              ko={<>누적 Gram 행렬의 역행렬 <InlineMath math={"P_k = \\left( \\sum_{i \\le k} C_i^\\top S_i C_i \\right)^{-1}"}/>. <InlineMath math={"k = k_0"}/>에서 초기화한다</>}/>],
                    ["\\text{innovation}", <T en={<>what the new measurement says minus what the old estimate predicted; if it is zero the estimate does not move</>}
                                             ko={<>새 측정이 말하는 값에서 옛 추정이 예측한 값을 뺀 것. 0이면 추정값이 움직이지 않는다</>}/>],
                    ["\\text{gain}", <T en={<>how far to move in response; the same shape as the Kalman gain of Chapter 5, which is why the notes preview it here</>}
                                       ko={<>그에 반응해 얼마나 움직일지. 5장 Kalman gain과 모양이 같으며, 원 교재가 여기서 미리 보여 주는 이유가 그것이다</>}/>],
                ]}/>
                <Proof label={t("Where the recursion comes from", "재귀가 나오는 자리")}>
                    <T
                        en={<p>
                            <strong>Step 1: the batch solution.</strong> Stack the data into{" "}
                            <InlineMath math={"Y_k, A_k, E_k"}/> and{" "}
                            <InlineMath math={"R_k = \\operatorname{diag}(S_1, \\ldots, S_k)"}/>. Then{" "}
                            <InlineMath math={"Y_k = A_k x + E_k"}/> and Proposition 3.91 applies verbatim,
                            giving <InlineMath math={"(A_k^\\top R_k A_k)\\hat{x}_k = A_k^\\top R_k Y_k"}/>.
                            Written out, the two sides are accumulating sums:
                        </p>}
                        ko={<p>
                            <strong>1단계: batch 해.</strong> 데이터를{" "}
                            <InlineMath math={"Y_k, A_k, E_k"}/>와{" "}
                            <InlineMath math={"R_k = \\operatorname{diag}(S_1, \\ldots, S_k)"}/>로 쌓는다.
                            그러면 <InlineMath math={"Y_k = A_k x + E_k"}/>이고 Proposition 3.91이 그대로 적용되어{" "}
                            <InlineMath math={"(A_k^\\top R_k A_k)\\hat{x}_k = A_k^\\top R_k Y_k"}/>이다. 풀어
                            쓰면 양변이 누적되는 합이다.
                        </p>}
                    />
                    <BlockMath math={"\\underbrace{\\left( \\sum_{i=1}^{k} C_i^\\top S_i C_i \\right)}_{=: \\; Q_k} \\hat{x}_k = \\sum_{i=1}^{k} C_i^\\top S_i y_i"}/>
                    <Terms items={[
                        ["Q_k", <T en={<>the accumulated Gram matrix, <InlineMath math={"n \\times n"}/> no matter how much data arrives; <InlineMath math={"P_k := Q_k^{-1}"}/></>}
                                  ko={<>누적 Gram 행렬. 데이터가 아무리 쌓여도 <InlineMath math={"n \\times n"}/>이다. <InlineMath math={"P_k := Q_k^{-1}"}/>로 둔다</>}/>],
                        ["A_k", <T en={<>the <InlineMath math={"km \\times n"}/> stacked matrix, which is the thing that grows and eventually fills memory</>}
                                  ko={<><InlineMath math={"km \\times n"}/> 누적 행렬. 자라나서 결국 메모리를 채우는 물건이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>Step 2: turn the sums into a recursion.</strong> Both sums gain exactly
                            one term when the measurement at{" "}
                            <InlineMath math={"k+1"}/> arrives:
                        </p>}
                        ko={<p>
                            <strong>2단계: 합을 재귀로 바꾼다.</strong>{" "}
                            <InlineMath math={"k+1"}/>의 측정이 도착하면 두 합에 항이 정확히 하나씩 붙는다.
                        </p>}
                    />
                    <BlockMath math={"Q_{k+1} = Q_k + C_{k+1}^\\top S_{k+1} C_{k+1}, \\qquad Q_{k+1}\\hat{x}_{k+1} = Q_k \\hat{x}_k + C_{k+1}^\\top S_{k+1} y_{k+1}"}/>
                    <Terms items={[
                        ["Q_k \\hat{x}_k", <T en={<>recognized as the old right-hand side, which is why the old estimate is all that must be remembered</>}
                                             ko={<>옛 우변임을 알아본 것. 그래서 기억해 둘 것이 옛 추정값뿐이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Substituting <InlineMath math={"Q_k = Q_{k+1} - C_{k+1}^\\top S_{k+1} C_{k+1}"}/> into
                            the second identity and multiplying by{" "}
                            <InlineMath math={"Q_{k+1}^{-1}"}/> rearranges into the update in the statement,
                            with gain <InlineMath math={"Q_{k+1}^{-1}C_{k+1}^\\top S_{k+1}"}/>. The remaining
                            problem is that this requires inverting the{" "}
                            <InlineMath math={"n \\times n"}/> matrix{" "}
                            <InlineMath math={"Q_{k+1}"}/> at every sample. The Matrix Inversion Lemma from
                            Chapter 2 removes it:
                        </p>}
                        ko={<p>
                            둘째 등식에{" "}
                            <InlineMath math={"Q_k = Q_{k+1} - C_{k+1}^\\top S_{k+1} C_{k+1}"}/>을 대입하고{" "}
                            <InlineMath math={"Q_{k+1}^{-1}"}/>을 곱하면 진술의 갱신식으로 정리되고, gain은{" "}
                            <InlineMath math={"Q_{k+1}^{-1}C_{k+1}^\\top S_{k+1}"}/>이다. 남는 문제는 표본마다{" "}
                            <InlineMath math={"n \\times n"}/> 행렬{" "}
                            <InlineMath math={"Q_{k+1}"}/>의 역행렬을 내야 한다는 점이다. 2장의 역행렬 보조정리가
                            그것을 없앤다.
                        </p>}
                    />
                    <BlockMath math={"(A + BCD)^{-1} = A^{-1} - A^{-1}B\\left( DA^{-1}B + C^{-1} \\right)^{-1} D A^{-1}"}/>
                    <Terms items={[
                        ["A \\leftrightarrow Q_k", <T en={<>the substitution that turns the lemma into the <InlineMath math={"P"}/> recursion</>}
                                                     ko={<>보조정리를 <InlineMath math={"P"}/> 점화식으로 바꾸는 치환</>}/>],
                        ["B \\leftrightarrow C_{k+1}^\\top, \\; C \\leftrightarrow S_{k+1}, \\; D \\leftrightarrow C_{k+1}", <T en={<>the remaining three; the inner inverse is then <InlineMath math={"m \\times m"}/> instead of <InlineMath math={"n \\times n"}/></>}
                                                                                                                              ko={<>나머지 셋. 그러면 안쪽 역행렬이 <InlineMath math={"n \\times n"}/>이 아니라 <InlineMath math={"m \\times m"}/>이 된다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Typically <InlineMath math={"n \\gg m"}/>, a fifteen-state filter absorbing a
                            scalar range reading, so the saving is an{" "}
                            <InlineMath math={"n \\times n"}/> inverse traded for a division.
                        </p>}
                        ko={<p>
                            보통 <InlineMath math={"n \\gg m"}/>이다. 스칼라 거리 측정을 받아들이는 상태 열다섯
                            개짜리 필터가 그렇다. 그러니 절약되는 것은{" "}
                            <InlineMath math={"n \\times n"}/> 역행렬을 나눗셈 하나와 맞바꾼 만큼이다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Example title={<T en={<>The same line fit, one point at a time</>} ko={<>같은 직선 적합을 한 점씩</>}/>}>
                <T
                    en={<p>
                        Take the data <InlineMath math={"(0,1), (1,3), (2,2)"}/> again with{" "}
                        <InlineMath math={"x = (\\alpha_1, \\alpha_2)^\\top"}/>,{" "}
                        <InlineMath math={"C_i = [\\,1 \\;\\; t_i\\,]"}/> and{" "}
                        <InlineMath math={"S_i = 1"}/>. Here{" "}
                        <InlineMath math={"k_0 = 2"}/>, because two rows are needed before the stack has rank
                        2. Initialize with the batch solution on the first two points:
                    </p>}
                    ko={<p>
                        데이터 <InlineMath math={"(0,1), (1,3), (2,2)"}/>를 다시 잡고{" "}
                        <InlineMath math={"x = (\\alpha_1, \\alpha_2)^\\top"}/>,{" "}
                        <InlineMath math={"C_i = [\\,1 \\;\\; t_i\\,]"}/>,{" "}
                        <InlineMath math={"S_i = 1"}/>로 둔다. 쌓은 행렬의 rank가 2가 되려면 행 둘이 필요하므로{" "}
                        <InlineMath math={"k_0 = 2"}/>다. 앞의 두 점에 대한 batch 해로 초기화한다.
                    </p>}
                />
                <BlockMath math={"Q_2 = \\begin{bmatrix} 2 & 1 \\\\ 1 & 1 \\end{bmatrix}, \\quad P_2 = \\begin{bmatrix} 1 & -1 \\\\ -1 & 2 \\end{bmatrix}, \\quad \\hat{x}_2 = P_2 \\begin{bmatrix} 4 \\\\ 3 \\end{bmatrix} = \\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix}"}/>
                <Terms items={[
                    ["Q_2", <T en={<><InlineMath math={"C_1^\\top C_1 + C_2^\\top C_2"}/> with <InlineMath math={"C_1 = [1\\;\\,0]"}/> and <InlineMath math={"C_2 = [1\\;\\,1]"}/></>}
                              ko={<><InlineMath math={"C_1 = [1\\;\\,0]"}/>, <InlineMath math={"C_2 = [1\\;\\,1]"}/>에 대한 <InlineMath math={"C_1^\\top C_1 + C_2^\\top C_2"}/></>}/>],
                    ["(4, 3)^\\top", <T en={<><InlineMath math={"C_1^\\top y_1 + C_2^\\top y_2 = (1,0)^\\top + 3(1,1)^\\top"}/></>}
                                       ko={<><InlineMath math={"C_1^\\top y_1 + C_2^\\top y_2 = (1,0)^\\top + 3(1,1)^\\top"}/></>}/>],
                    ["\\hat{x}_2 = (1, 2)^\\top", <T en={<>the line <InlineMath math={"1 + 2t"}/>, which passes exactly through the first two points, as two points and two unknowns must</>}
                                                    ko={<>직선 <InlineMath math={"1 + 2t"}/>. 점 둘에 미지수 둘이니 당연하게도 앞의 두 점을 정확히 지난다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Now absorb the third point,{" "}
                        <InlineMath math={"C_3 = [\\,1 \\;\\; 2\\,]"}/> and{" "}
                        <InlineMath math={"y_3 = 2"}/>, using only{" "}
                        <InlineMath math={"P_2"}/> and <InlineMath math={"\\hat{x}_2"}/>:
                    </p>}
                    ko={<p>
                        이제 <InlineMath math={"P_2"}/>와 <InlineMath math={"\\hat{x}_2"}/>만 써서 세 번째 점{" "}
                        <InlineMath math={"C_3 = [\\,1 \\;\\; 2\\,]"}/>,{" "}
                        <InlineMath math={"y_3 = 2"}/>를 받아들인다.
                    </p>}
                />
                <BlockMath math={"P_2 C_3^\\top = \\begin{bmatrix} -1 \\\\ 3 \\end{bmatrix}, \\quad C_3 P_2 C_3^\\top + 1 = 6, \\quad P_3 = P_2 - \\frac{1}{6}\\begin{bmatrix} 1 & -3 \\\\ -3 & 9 \\end{bmatrix} = \\begin{bmatrix} 5/6 & -1/2 \\\\ -1/2 & 1/2 \\end{bmatrix}"}/>
                <Terms items={[
                    ["C_3 P_2 C_3^\\top + S_3^{-1} = 6", <T en={<>a <InlineMath math={"1 \\times 1"}/> matrix, so the only inversion in the whole update is <InlineMath math={"1/6"}/></>}
                                                           ko={<><InlineMath math={"1 \\times 1"}/> 행렬. 그래서 갱신 전체에서 역행렬을 내는 일이 <InlineMath math={"1/6"}/> 하나뿐이다</>}/>],
                    ["P_3", <T en={<>equal to <InlineMath math={"(A_3^\\top A_3)^{-1} = \\tfrac{1}{6}\\left[\\begin{smallmatrix} 5 & -3 \\\\ -3 & 3 \\end{smallmatrix}\\right]"}/>, the batch answer, obtained without forming <InlineMath math={"A_3"}/></>}
                              ko={<><InlineMath math={"A_3"}/>을 만들지 않고 얻은 batch 해 <InlineMath math={"(A_3^\\top A_3)^{-1} = \\tfrac{1}{6}\\left[\\begin{smallmatrix} 5 & -3 \\\\ -3 & 3 \\end{smallmatrix}\\right]"}/>과 같다</>}/>],
                ]}/>
                <BlockMath math={"\\hat{x}_3 = \\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix} + \\underbrace{\\begin{bmatrix} -1/6 \\\\ 1/2 \\end{bmatrix}}_{\\text{gain}} \\underbrace{(2 - 5)}_{\\text{innovation}} = \\begin{bmatrix} 3/2 \\\\ 1/2 \\end{bmatrix}"}/>
                <Terms items={[
                    ["2 - 5", <T en={<>the innovation <InlineMath math={"y_3 - C_3 \\hat{x}_2"}/>: the old line predicted <InlineMath math={"5"}/> at <InlineMath math={"t = 2"}/> and the sensor reported <InlineMath math={"2"}/></>}
                                ko={<>innovation <InlineMath math={"y_3 - C_3 \\hat{x}_2"}/>. 옛 직선은 <InlineMath math={"t = 2"}/>에서 <InlineMath math={"5"}/>를 예측했고 센서는 <InlineMath math={"2"}/>를 보고했다</>}/>],
                    ["\\hat{x}_3", <T en={<>identical to the batch answer <InlineMath math={"(3/2, 1/2)^\\top"}/> computed above, as it must be</>}
                                     ko={<>위에서 계산한 batch 해 <InlineMath math={"(3/2, 1/2)^\\top"}/>과 정확히 같다. 그래야만 한다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Nothing was approximated. The recursion is an exact reorganization of the same
                        arithmetic, and the only memory it needs is{" "}
                        <InlineMath math={"\\hat{x}_k"}/> and{" "}
                        <InlineMath math={"P_k"}/>, both of fixed size. A robot logging at a kilohertz can
                        run this forever; the batch form cannot.
                    </p>}
                    ko={<p>
                        근사한 것은 하나도 없다. 이 재귀는 같은 산술을 정확하게 재배치한 것이고, 필요한 기억은
                        크기가 고정된 <InlineMath math={"\\hat{x}_k"}/>와{" "}
                        <InlineMath math={"P_k"}/>뿐이다. 킬로헤르츠로 기록하는 로봇은 이것을 영원히 돌릴 수
                        있다. batch 형태로는 못 한다.
                    </p>}
                />
            </Example>
            <Proposition n="3.95" title={<T en={<>Underdetermined equations: the minimum-norm solution</>}
                                            ko={<>underdetermined 방정식의 최소 norm 해</>}/>}>
                <T
                    en={<p>
                        When <InlineMath math={"A"}/> is <InlineMath math={"p \\times n"}/> with{" "}
                        <InlineMath math={"p < n"}/>, the system{" "}
                        <InlineMath math={"Ax = b"}/> has fewer equations than unknowns. If the rows of{" "}
                        <InlineMath math={"A"}/> are independent it has infinitely many solutions, and
                        picking one requires a criterion. The usual one is smallest norm. With{" "}
                        <InlineMath math={"\\langle x, z \\rangle := x^\\top S z"}/> and{" "}
                        <InlineMath math={"S > 0"}/>,
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>가 <InlineMath math={"p < n"}/>인{" "}
                        <InlineMath math={"p \\times n"}/> 행렬이면{" "}
                        <InlineMath math={"Ax = b"}/>는 식이 미지수보다 적다.{" "}
                        <InlineMath math={"A"}/>의 행이 독립이면 해가 무한히 많고, 그중 하나를 고르려면 기준이
                        필요하다. 흔히 쓰는 기준은 norm이 가장 작다는 것이다.{" "}
                        <InlineMath math={"S > 0"}/>인{" "}
                        <InlineMath math={"\\langle x, z \\rangle := x^\\top S z"}/>에 대해
                    </p>}
                />
                <BlockMath math={"\\hat{x} = \\operatorname*{arg\\,min}_{Ax = b} \\|x\\|^2 = S^{-1}A^\\top \\left( A S^{-1} A^\\top \\right)^{-1} b"}/>
                <Terms items={[
                    ["A S^{-1} A^\\top", <T en={<>a <InlineMath math={"p \\times p"}/> Gram matrix, invertible because the rows of <InlineMath math={"A"}/> are independent</>}
                                           ko={<><InlineMath math={"p \\times p"}/> Gram 행렬. <InlineMath math={"A"}/>의 행이 독립이라 가역이다</>}/>],
                    ["S^{-1}A^\\top", <T en={<>the matrix whose columns are the vectors <InlineMath math={"v_i = S^{-1}a_i^\\top"}/> that turn the row equations into inner products</>}
                                        ko={<>행 방정식을 내적으로 바꾸는 벡터 <InlineMath math={"v_i = S^{-1}a_i^\\top"}/>들을 열로 갖는 행렬</>}/>],
                    ["\\hat{x}", <T en={<>the shortest solution; every other solution differs from it by something in the null space of <InlineMath math={"A"}/></>}
                                   ko={<>가장 짧은 해. 다른 모든 해는 <InlineMath math={"A"}/>의 null space에 있는 무언가만큼 이것과 다르다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The proof is Theorem 3.51 with the constraint set rewritten as a linear variety.
                        Since <InlineMath math={"Ax = b"}/> is equivalent to{" "}
                        <InlineMath math={"A S^{-1} S x = b"}/>, reading it row by row identifies the
                        constraint vectors{" "}
                        <InlineMath math={"v_i := S^{-1}a_i^\\top"}/>, and then{" "}
                        <InlineMath math={"\\langle v_i, x \\rangle = v_i^\\top S x = a_i x = b_i"}/>. The
                        Gram matrix of those <InlineMath math={"v_i"}/> works out to{" "}
                        <InlineMath math={"A S^{-1} A^\\top"}/>.
                    </p>}
                    ko={<p>
                        증명은 제약 집합을 linear variety로 다시 쓴 Theorem 3.51이다.{" "}
                        <InlineMath math={"Ax = b"}/>가 <InlineMath math={"A S^{-1} S x = b"}/>와 동치이므로,
                        이를 행별로 읽으면 제약 벡터{" "}
                        <InlineMath math={"v_i := S^{-1}a_i^\\top"}/>이 식별되고{" "}
                        <InlineMath math={"\\langle v_i, x \\rangle = v_i^\\top S x = a_i x = b_i"}/>가 된다. 그{" "}
                        <InlineMath math={"v_i"}/>들의 Gram 행렬을 계산하면{" "}
                        <InlineMath math={"A S^{-1} A^\\top"}/>이 나온다.
                    </p>}
                />
                <T
                    en={<p>
                        A one-line instance. Take{" "}
                        <InlineMath math={"A = [\\,1 \\;\\; 1 \\;\\; 1\\,]"}/>,{" "}
                        <InlineMath math={"b = 3"}/> and <InlineMath math={"S = I"}/>: find the shortest{" "}
                        <InlineMath math={"x \\in \\mathbb{R}^3"}/> whose entries sum to{" "}
                        <InlineMath math={"3"}/>. Then{" "}
                        <InlineMath math={"A A^\\top = 3"}/> and{" "}
                        <InlineMath math={"\\hat{x} = A^\\top \\cdot \\tfrac{1}{3} \\cdot 3 = (1,1,1)^\\top"}/>,
                        with <InlineMath math={"\\|\\hat{x}\\|^2 = 3"}/>. The solution{" "}
                        <InlineMath math={"(3,0,0)^\\top"}/> satisfies the same constraint and has{" "}
                        <InlineMath math={"\\|x\\|^2 = 9"}/>. Spreading the requirement evenly is the shortest
                        way to meet it, and that sentence is what a minimum-norm controller does with its
                        actuators.
                    </p>}
                    ko={<p>
                        한 줄짜리 사례.{" "}
                        <InlineMath math={"A = [\\,1 \\;\\; 1 \\;\\; 1\\,]"}/>,{" "}
                        <InlineMath math={"b = 3"}/>, <InlineMath math={"S = I"}/>로 두면 성분의 합이{" "}
                        <InlineMath math={"3"}/>인 가장 짧은{" "}
                        <InlineMath math={"x \\in \\mathbb{R}^3"}/>을 찾는 문제다.{" "}
                        <InlineMath math={"A A^\\top = 3"}/>이므로{" "}
                        <InlineMath math={"\\hat{x} = A^\\top \\cdot \\tfrac{1}{3} \\cdot 3 = (1,1,1)^\\top"}/>이고{" "}
                        <InlineMath math={"\\|\\hat{x}\\|^2 = 3"}/>이다. 같은 제약을 만족하는{" "}
                        <InlineMath math={"(3,0,0)^\\top"}/>은 <InlineMath math={"\\|x\\|^2 = 9"}/>다. 요구량을
                        고르게 나누는 것이 그것을 채우는 가장 짧은 길이며, 최소 norm 제어기가 구동기를 가지고
                        하는 일이 그 문장이다.
                    </p>}
                />
            </Proposition>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Why Robotics</h2>} ko={<h2>로봇에서 왜 필요한가</h2>}/>
            <T
                en={<p>
                    This chapter is the one that actually runs on the robot. Almost every estimation and
                    calibration routine in a modern stack is one of the boxes above with different symbols.
                </p>}
                ko={<p>
                    이 장은 로봇 위에서 실제로 돌아가는 장이다. 요즘 스택의 추정과 캘리브레이션 루틴은 거의 전부
                    위의 상자들 가운데 하나에 기호만 바꿔 끼운 것이다.
                </p>}
            />
            <T
                en={<ul>
                    <li>
                        <strong>Sensor fusion is a weighted least squares problem.</strong> Two sensors
                        reporting the same quantity give an overdetermined system, and{" "}
                        <InlineMath math={"S"}/> in Proposition 3.91 is where you say which one to believe.
                        Set <InlineMath math={"S"}/> to the inverse of the noise covariance and the estimate
                        becomes the one Chapter 5 derives on probabilistic grounds. Getting{" "}
                        <InlineMath math={"S"}/> wrong is the most common reason a fusion node quietly
                        produces a biased answer.
                    </li>
                    <li>
                        <strong>Recursive least squares is the Kalman filter without the process model.</strong>{" "}
                        Proposition 3.92 already has the gain, the innovation, and a covariance-shaped{" "}
                        <InlineMath math={"P"}/> recursion. Chapter 5 adds a state that moves between
                        samples and a probabilistic reading of{" "}
                        <InlineMath math={"P"}/>, and almost nothing else changes.
                    </li>
                    <li>
                        <strong>The minimum-norm solution is redundancy resolution.</strong> A seven-joint
                        arm asked for a six-dimensional end effector velocity has one extra degree of
                        freedom, so <InlineMath math={"J\\dot{q} = v"}/> is underdetermined. Proposition
                        3.95 with <InlineMath math={"S = I"}/> gives the joint velocities of least effort,
                        and a diagonal <InlineMath math={"S"}/> lets you charge more for moving the joints
                        near the base.
                    </li>
                    <li>
                        <strong>Orthonormal bases are numerically safe bases.</strong> A path or a signal
                        expanded in the Legendre-style polynomials of Example 3.22 has a Gram matrix equal
                        to the identity, so coefficients are inner products and there is no ill-conditioned
                        matrix to invert. Fitting the same curve with raw powers{" "}
                        <InlineMath math={"1, t, t^2, \\ldots"}/> builds a Hilbert-like Gram matrix that
                        loses digits fast.
                    </li>
                    <li>
                        <strong>Positive definiteness is a runtime assertion.</strong> A covariance that has
                        drifted to indefinite is a filter that has diverged. The Schur complement test of
                        Example 3.89 is cheap enough to run every cycle on the small blocks that matter, and
                        Theorem 3.85 is why a Cholesky factorization failing is a meaningful alarm rather
                        than a numerical annoyance.
                    </li>
                    <li>
                        <strong>The residual is a diagnostic, not just leftovers.</strong> Theorem 3.36 says
                        the residual must be orthogonal to every column of the design matrix. When your
                        solver returns an <InlineMath math={"\\hat{\\alpha}"}/> whose residual is not, the
                        bug is upstream, in how the problem was assembled. Checking{" "}
                        <InlineMath math={"\\|A^\\top e\\|"}/> costs one matrix-vector product and catches a
                        surprising amount.
                    </li>
                </ul>}
                ko={<ul>
                    <li>
                        <strong>센서 융합이 곧 weighted least squares다.</strong> 같은 양을 보고하는 센서 둘은
                        overdetermined 문제를 만들고, 어느 쪽을 믿을지 말하는 자리가 Proposition 3.91의{" "}
                        <InlineMath math={"S"}/>다. <InlineMath math={"S"}/>를 잡음 공분산의 역행렬로 두면
                        5장이 확률적 근거로 유도하는 추정값이 된다. 융합 노드가 조용히 편향된 답을 내놓는 가장
                        흔한 이유가 <InlineMath math={"S"}/>를 잘못 잡은 것이다.
                    </li>
                    <li>
                        <strong>recursive least squares는 프로세스 모델이 빠진 칼만 필터다.</strong>{" "}
                        Proposition 3.92에는 이미 gain도, innovation도, 공분산 모양의{" "}
                        <InlineMath math={"P"}/> 점화식도 있다. 5장은 표본 사이에 움직이는 상태와{" "}
                        <InlineMath math={"P"}/>에 대한 확률적 해석을 얹을 뿐, 나머지는 거의 그대로다.
                    </li>
                    <li>
                        <strong>최소 norm 해가 곧 여유 자유도 해소다.</strong> 관절이 일곱 개인 팔에 6차원
                        말단 속도를 요구하면 자유도가 하나 남으므로{" "}
                        <InlineMath math={"J\\dot{q} = v"}/>가 underdetermined다.{" "}
                        <InlineMath math={"S = I"}/>인 Proposition 3.95가 가장 힘을 덜 쓰는 관절 속도를 주고,{" "}
                        <InlineMath math={"S"}/>를 대각으로 잡으면 밑동 쪽 관절을 움직이는 데 값을 더 매길 수
                        있다.
                    </li>
                    <li>
                        <strong>orthonormal 기저가 수치적으로 안전한 기저다.</strong> Example 3.22의 Legendre
                        계열 다항식으로 경로나 신호를 전개하면 Gram 행렬이 단위 행렬이라 계수가 곧 내적이고,
                        조건수가 나쁜 행렬을 역행렬 낼 일이 없다. 같은 곡선을 날것의 거듭제곱{" "}
                        <InlineMath math={"1, t, t^2, \\ldots"}/>으로 맞추면 Hilbert 행렬을 닮은 Gram 행렬이
                        생겨 유효 숫자가 빠르게 사라진다.
                    </li>
                    <li>
                        <strong>positive definite는 런타임 단언문이다.</strong> indefinite로 흘러간 공분산은
                        발산한 필터다. Example 3.89의 Schur complement 판정은 중요한 작은 블록에 대해 매
                        주기 돌려도 될 만큼 싸고, Cholesky 분해 실패가 수치적 성가심이 아니라 의미 있는
                        경보인 이유가 Theorem 3.85다.
                    </li>
                    <li>
                        <strong>잔차는 찌꺼기가 아니라 진단 도구다.</strong> Theorem 3.36은 잔차가 설계 행렬의
                        모든 열과 직교해야 한다고 말한다. 솔버가 돌려준{" "}
                        <InlineMath math={"\\hat{\\alpha}"}/>의 잔차가 그렇지 않다면 버그는 상류에, 문제를
                        조립한 방식에 있다. <InlineMath math={"\\|A^\\top e\\|"}/>를 확인하는 데는 행렬 벡터
                        곱 한 번이 들고, 잡히는 것은 놀랍도록 많다.
                    </li>
                </ul>}
            />

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>References</h2>} ko={<h2>References</h2>}/>
            <ul>
                <li>
                    Jessy W. Grizzle, <em>ROB 501: Mathematics for Robotics</em>, University of Michigan,
                    2022. Chapter 3.{" "}
                    <a href={COURSE} target="_blank" rel="noopener noreferrer">{t("Course page", "코스 페이지")}</a>
                    {" · "}
                    <a href={NOTES_REPO} target="_blank" rel="noopener noreferrer">michiganrobotics/rob501</a>
                </li>
                <li>
                    David G. Luenberger, <em>Optimization by Vector Space Methods</em>, Wiley, 1969
                    {" · "}
                    {t("the source of Lemma 3.29, where it is called the Pre-Projection Theorem",
                        "Lemma 3.29의 출처. 거기서는 Pre-Projection Theorem이라 부른다")}
                </li>
                <li>
                    <a href={TREFETHEN} target="_blank" rel="noopener noreferrer">
                        Lloyd N. Trefethen and David Bau III, <em>Numerical Linear Algebra</em>
                    </a>
                    {" · "}
                    {t("Lectures 7 and 8 on why modified Gram-Schmidt is the one to implement",
                        "modified Gram-Schmidt를 구현해야 하는 이유를 다루는 7강과 8강")}
                </li>
                <li>
                    <a href={BOYD} target="_blank" rel="noopener noreferrer">
                        Stephen Boyd and Lieven Vandenberghe, <em>Convex Optimization</em>
                    </a>
                    {" · "}
                    {t("Appendix A.5.5 collects the Schur complement identities used here",
                        "여기서 쓴 Schur complement 항등식들을 부록 A.5.5가 모아 둔다")}
                </li>
                <li>
                    <a href={ROB101} target="_blank" rel="noopener noreferrer">ROB 101: Computational Linear Algebra</a>
                    {" · "}
                    {t("Chapters 8 and 9 run least squares numerically before any of this is proved",
                        "이 내용이 증명되기 전에 8장과 9장이 최소제곱을 수치적으로 먼저 돌려 본다")}
                </li>
            </ul>
        </>
    );
};

export default Chapter3;
