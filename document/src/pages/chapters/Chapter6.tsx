import CanvasFigure from "../../components/CanvasFigure";
import CauchyCompleteness from "../../components/pages/chapter6/CauchyCompleteness";
import CompactExtrema from "../../components/pages/chapter6/CompactExtrema";
import ContractionCobweb from "../../components/pages/chapter6/ContractionCobweb";
import EpsilonGame from "../../components/pages/chapter6/EpsilonGame";
import NewtonBasins from "../../components/pages/chapter6/NewtonBasins";
import OpenClosedExplorer from "../../components/pages/chapter6/OpenClosedExplorer";
import {BlockMath, InlineMath} from "../../components/math/Tex";
import {Corollary, Definition, Example, Lemma, Proof, Proposition, Remark, Theorem} from "../../components/math/Statement";
import Terms from "../../components/math/Terms";
import {T, useTr} from "../../libs/i18n";

const COURSE = "https://grizzle.robotics.umich.edu/education/rob501";
const NOTES_REPO = "https://github.com/michiganrobotics/rob501";
const RUDIN = "https://archive.org/details/principlesofmath00rudi";
const TAO_ANALYSIS = "https://terrytao.wordpress.com/books/analysis-i/";
const CAUCHY_WIKI = "https://en.wikipedia.org/wiki/Cauchy_sequence";
const BANACH_WIKI = "https://en.wikipedia.org/wiki/Banach_space#Examples";
const BW_WIKI = "https://en.wikipedia.org/wiki/Bolzano%E2%80%93Weierstrass_theorem";
const NEWTON_FRACTAL = "https://en.wikipedia.org/wiki/Newton_fractal";
const ROB101 = "https://github.com/michiganrobotics/rob101";

const Chapter6 = () => {
    const t = useTr();
    return (
        <>
            <T
                en={<p>
                    Every chapter so far ended with a formula. Least squares had normal equations, the
                    factorizations had algorithms that terminate, and the Kalman filter had six lines that
                    run in fixed time. This chapter is about the problems where none of that happens: you
                    write down the condition a solution must satisfy, and there is no closed form for it.
                    What you get instead is an iteration, and an iteration raises two questions that
                    algebra cannot answer. Does it converge, and is there anything for it to converge to?
                </p>}
                ko={<p>
                    지금까지의 모든 장은 공식으로 끝났다. 최소제곱에는 normal equation이 있었고, 행렬
                    분해에는 유한 번에 끝나는 알고리즘이 있었고, 칼만 필터에는 정해진 시간에 도는 여섯
                    줄이 있었다. 이 장은 그런 일이 하나도 일어나지 않는 문제들에 관한 것이다. 해가
                    만족해야 할 조건은 적을 수 있는데 그것을 푸는 닫힌 꼴이 없다. 대신 손에 남는 것은
                    반복이고, 반복은 대수가 답할 수 없는 질문 둘을 불러온다. 이것은 수렴하는가, 그리고
                    애초에 수렴해 갈 대상이 있기는 한가?
                </p>}
            />
            <T
                en={<p>
                    Both questions turn out to be about sets rather than about formulas. Whether an
                    iteration can converge depends on whether the space has holes in it, and whether a
                    minimum exists depends on whether the feasible set is closed and bounded. The chapter
                    builds the vocabulary for saying that precisely, and then spends it on two payoffs: the
                    contraction mapping theorem, which turns "this iteration converges" into an inequality
                    you can check, and the Weierstrass theorem, which turns "this optimization has a
                    solution" into two properties of the constraint set.
                </p>}
                ko={<p>
                    두 질문 모두 공식이 아니라 집합에 관한 것으로 드러난다. 반복이 수렴할 수 있는지는
                    공간에 구멍이 뚫려 있는지에 달렸고, 최솟값이 존재하는지는 실행 가능 집합이 닫혔고
                    유계인지에 달렸다. 이 장은 그것을 정확히 말하기 위한 어휘를 세우고, 그 어휘를 두
                    곳에 쓴다. 하나는 "이 반복은 수렴한다"를 확인 가능한 부등식으로 바꾸는 contraction
                    mapping 정리이고, 다른 하나는 "이 최적화에는 해가 있다"를 제약 집합의 두 성질로
                    바꾸는 Weierstrass 정리다.
                </p>}
            />
            <BlockMath math={"\\begin{aligned} &\\|T(x) - T(y)\\| \\le c\\,\\|x - y\\|, \\quad 0 \\le c < 1 \\\\ &\\qquad \\implies\\ \\exists!\\ x^* \\text{ with } x^* = T(x^*) \\\\[6pt] &C \\text{ closed and bounded},\\quad f \\text{ continuous} \\\\ &\\qquad \\implies\\ \\exists\\, x^* \\in C \\text{ with } f(x^*) = \\sup_{x \\in C} f(x) \\end{aligned}"}/>
            <Terms items={[
                ["T", <T en={<>the map one iteration applies, <InlineMath math={"x_{n+1} = T(x_n)"}/></>}
                         ko={<>반복 한 걸음이 적용하는 사상. <InlineMath math={"x_{n+1} = T(x_n)"}/>이다</>}/>],
                ["c", <T en={<>the contraction constant: how much closer <InlineMath math={"T"}/> pulls any two points. Everything hinges on it being strictly below <InlineMath math={"1"}/></>}
                         ko={<>contraction 상수. <InlineMath math={"T"}/>가 임의의 두 점을 얼마나 더 가깝게 당기는지다. 이것이 <InlineMath math={"1"}/>보다 진짜로 작다는 데 모든 것이 걸려 있다</>}/>],
                ["x^*", <T en={<>the fixed point, the thing the iteration converges to, and also the root you were looking for</>}
                           ko={<>고정점. 반복이 수렴해 가는 대상이고, 동시에 찾고 있던 근이다</>}/>],
                ["C", <T en={<>the set you are optimizing over: the feasible set, the constraint set, the search region</>}
                         ko={<>최적화하는 집합. 실행 가능 집합, 제약 집합, 탐색 영역이다</>}/>],
                ["f", <T en={<>the objective, a real valued function on <InlineMath math={"C"}/></>}
                         ko={<>목적함수. <InlineMath math={"C"}/> 위의 실수값 함수다</>}/>],
                ["\\sup", <T en={<>the least upper bound from Chapter 1. The theorem's content is that this supremum is attained, so it is a maximum</>}
                             ko={<>1장의 least upper bound. 이 정리의 내용은 그 supremum에 실제로 닿는다는 것이고, 그래서 그것이 최댓값이 된다</>}/>],
            ]}/>
            <T
                en={<p>
                    The route there runs through open and closed sets, sequences and their limits, Cauchy
                    sequences and completeness, and continuity, in that order, because each one is used to
                    define the next. The notes are terse in places and skip the arithmetic; this page fills
                    it in and attaches a picture to every definition that has one.
                </p>}
                ko={<p>
                    거기까지 가는 길은 열린 집합과 닫힌 집합, 수열과 극한, Cauchy 수열과 완비성, 연속성
                    순서로 이어진다. 앞의 것이 뒤의 것을 정의하는 데 쓰이기 때문이다. 교재는 곳곳에서
                    간결하고 계산을 건너뛴다. 이 페이지는 그것을 채워 넣고, 그림을 붙일 수 있는 모든
                    정의에 그림을 붙인다.
                </p>}
            />
            <table className="table-center">
                <thead>
                <tr>
                    <th>{t("in the notes", "교재 절")}</th>
                    <th>{t("lives here", "여기서는")}</th>
                    <th>{t("first pass", "첫 독")}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>6.1</td>
                    <td>{t("Open and Closed Sets in Normed Spaces", "normed space의 열린 집합과 닫힌 집합")}</td>
                    <td>{t("read", "읽는다")}</td>
                </tr>
                <tr>
                    <td>6.2</td>
                    <td>{t("The Newton-Raphson Algorithm", "Newton-Raphson 알고리즘")}</td>
                    <td>{t("read, it motivates the rest", "읽는다. 나머지 전부의 동기다")}</td>
                </tr>
                <tr>
                    <td>6.3</td>
                    <td>{t("Sequences", "수열")}</td>
                    <td>{t("read", "읽는다")}</td>
                </tr>
                <tr>
                    <td>6.4</td>
                    <td>{t("Cauchy Sequences and Completeness", "Cauchy 수열과 완비성")}</td>
                    <td>{t("read twice", "두 번 읽는다")}</td>
                </tr>
                <tr>
                    <td>6.5</td>
                    <td>{t("The Contraction Mapping Theorem", "Contraction Mapping 정리")}</td>
                    <td>{t("the first payoff", "첫 번째 결실")}</td>
                </tr>
                <tr>
                    <td>6.6</td>
                    <td>{t("Continuous Functions", "연속 함수")}</td>
                    <td>{t("read", "읽는다")}</td>
                </tr>
                <tr>
                    <td>6.7 {t("norm equivalence (6.57 to 6.61)", "norm 동치 (6.57~6.61)")}</td>
                    <td>{t("Compact Sets and the Existence of Extrema", "컴팩트 집합과 극값의 존재")}</td>
                    <td>{t("skip, then come back", "건너뛰었다가 돌아온다")}</td>
                </tr>
                <tr>
                    <td>6.7 {t("Bolzano-Weierstrass and Weierstrass", "Bolzano-Weierstrass와 Weierstrass")}</td>
                    <td>{t("Compact Sets and the Existence of Extrema", "컴팩트 집합과 극값의 존재")}</td>
                    <td>{t("the second payoff", "두 번째 결실")}</td>
                </tr>
                </tbody>
            </table>
            <Remark title={<T en={<>Notation</>} ko={<>기호</>}/>}>
                <T
                    en={<ul>
                        <li><InlineMath math={"(\\mathcal{X}, \\mathbb{R}, \\|\\bullet\\|)"}/> is a real
                            normed space, exactly as in Chapter 3. Every definition below is written in
                            terms of the norm and nothing else, which is why they all apply verbatim
                            to <InlineMath math={"\\mathbb{R}^n"}/>, to matrices, and to spaces of
                            functions.</li>
                        <li><InlineMath math={"\\sim P"}/> is the set complement of{" "}
                            <InlineMath math={"P"}/> in <InlineMath math={"\\mathcal{X}"}/>. The notes use
                            this rather than <InlineMath math={"P^c"}/>.</li>
                        <li><InlineMath math={"\\mathring{P}"}/> is the interior,{" "}
                            <InlineMath math={"\\overline{P}"}/> is the closure, and{" "}
                            <InlineMath math={"\\partial P"}/> is the boundary. The ring and the bar are
                            easy to lose when reading quickly, and they are the difference between the
                            two central definitions.</li>
                        <li><InlineMath math={"d(x, y) := \\|x - y\\|"}/> and{" "}
                            <InlineMath math={"d(x, S) := \\inf_{y \\in S} \\|x - y\\|"}/>. The second is
                            an infimum, not a minimum: the distance from a point to a set can be a number
                            that no point of the set actually achieves, and that gap is the whole subject
                            of this chapter.</li>
                        <li>Quantifier order is load bearing. In{" "}
                            <InlineMath math={"\\forall \\epsilon > 0, \\exists N"}/> the{" "}
                            <InlineMath math={"N"}/> is allowed to depend on{" "}
                            <InlineMath math={"\\epsilon"}/>, and it almost always does. The notes write{" "}
                            <InlineMath math={"N(\\epsilon)"}/> and{" "}
                            <InlineMath math={"\\delta(\\epsilon, x_0)"}/> to keep that visible.</li>
                    </ul>}
                    ko={<ul>
                        <li><InlineMath math={"(\\mathcal{X}, \\mathbb{R}, \\|\\bullet\\|)"}/>는 3장과
                            똑같은 실수 normed space다. 아래의 모든 정의는 norm만으로 적히고 다른 것은
                            쓰지 않는다. 그래서 <InlineMath math={"\\mathbb{R}^n"}/>에도, 행렬에도, 함수
                            공간에도 글자 그대로 적용된다.</li>
                        <li><InlineMath math={"\\sim P"}/>는 <InlineMath math={"\\mathcal{X}"}/> 안에서{" "}
                            <InlineMath math={"P"}/>의 여집합이다. 교재는{" "}
                            <InlineMath math={"P^c"}/> 대신 이 기호를 쓴다.</li>
                        <li><InlineMath math={"\\mathring{P}"}/>는 내부,{" "}
                            <InlineMath math={"\\overline{P}"}/>는 closure,{" "}
                            <InlineMath math={"\\partial P"}/>는 경계다. 빨리 읽으면 고리와 막대를 놓치기
                            쉬운데, 그 둘이 이 장의 중심 정의 두 개를 가르는 표시다.</li>
                        <li><InlineMath math={"d(x, y) := \\|x - y\\|"}/>이고{" "}
                            <InlineMath math={"d(x, S) := \\inf_{y \\in S} \\|x - y\\|"}/>이다. 뒤엣것은
                            minimum이 아니라 infimum이다. 점과 집합 사이의 거리가 집합의 어떤 점도 실제로
                            달성하지 못하는 수일 수 있고, 그 틈이 이 장의 주제 전부다.</li>
                        <li>quantifier의 순서가 내용을 나른다.{" "}
                            <InlineMath math={"\\forall \\epsilon > 0, \\exists N"}/>에서{" "}
                            <InlineMath math={"N"}/>은 <InlineMath math={"\\epsilon"}/>에 의존해도 되고,
                            거의 언제나 의존한다. 교재가 <InlineMath math={"N(\\epsilon)"}/>,{" "}
                            <InlineMath math={"\\delta(\\epsilon, x_0)"}/>로 적는 것은 그것을 눈에 띄게
                            두기 위해서다.</li>
                    </ul>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Open and Closed Sets in Normed Spaces</h2>}
               ko={<h2>normed space의 열린 집합과 닫힌 집합</h2>}/>
            <T
                en={<p>
                    Open and closed are not opposites, and they are not about whether a set "has edges".
                    They are about one question asked at every point: does this point have room around it
                    inside the set? A set is open when every one of its points has room. A set is closed
                    when it already contains every point it gets arbitrarily close to. A set can be both,
                    and a set can be neither.
                </p>}
                ko={<p>
                    열림과 닫힘은 반대말이 아니고, 집합에 "가장자리가 있는가"의 문제도 아니다. 모든 점에
                    똑같이 던지는 질문 하나에 관한 것이다. 이 점은 집합 안에서 자기 둘레에 여유를 갖고
                    있는가? 모든 점이 여유를 가질 때 그 집합이 열렸다고 한다. 자기가 얼마든지 가까이
                    다가가는 점을 이미 다 갖고 있을 때 닫혔다고 한다. 둘 다인 집합도 있고 둘 다 아닌
                    집합도 있다.
                </p>}
            />
            <T
                en={<p>
                    Everything is measured with the norm, so start by recalling what a norm gives you. A
                    norm is a function <InlineMath math={"\\|\\bullet\\| : \\mathcal{X} \\to [0, +\\infty)"}/>{" "}
                    satisfying three conditions, and two derived notions of distance are built on top of it.
                </p>}
                ko={<p>
                    모든 것을 norm으로 재므로, norm이 무엇을 주는지부터 다시 적는다. norm은 세 조건을
                    만족하는 함수{" "}
                    <InlineMath math={"\\|\\bullet\\| : \\mathcal{X} \\to [0, +\\infty)"}/>이고, 그 위에
                    거리 개념 둘이 얹힌다.
                </p>}
            />
            <BlockMath math={"\\begin{aligned} \\text{(a)}\\quad & \\|x\\| \\ge 0 \\ \\text{ and } \\ \\|x\\| = 0 \\iff x = 0 \\\\ \\text{(b)}\\quad & \\|\\alpha \\cdot x\\| = |\\alpha| \\cdot \\|x\\| && \\forall\\, \\alpha \\in \\mathbb{R},\\ x \\in \\mathcal{X} \\\\ \\text{(c)}\\quad & \\|x + y\\| \\le \\|x\\| + \\|y\\| && \\forall\\, x,\\, y \\in \\mathcal{X} \\end{aligned}"}/>
            <Terms items={[
                ["\\|\\bullet\\|", <T en={<>the norm, the length of a vector. The bullet is the notes' placeholder for the slot the argument goes into</>}
                                     ko={<>norm. 벡터의 길이다. 점은 인자가 들어갈 자리를 가리키는 교재의 표시다</>}/>],
                ["\\alpha", <T en={<>a real scalar</>} ko={<>실수 스칼라</>}/>],
                ["\\text{(c)}", <T en={<>the triangle inequality. Almost every estimate in this chapter is this line applied once</>}
                                   ko={<>삼각부등식. 이 장의 거의 모든 평가는 이 줄을 한 번 쓴 것이다</>}/>],
            ]}/>
            <BlockMath math={"d(x, y) := \\|x - y\\|, \\qquad d(x, S) := \\inf_{y \\in S} \\|x - y\\|, \\qquad A \\subset B \\iff A \\cap (\\sim B) = \\emptyset"}/>
            <Terms items={[
                ["d(x, y)", <T en={<>distance between two points</>} ko={<>두 점 사이의 거리</>}/>],
                ["d(x, S)", <T en={<>distance from a point to a set: how close you can get to <InlineMath math={"x"}/> while staying in <InlineMath math={"S"}/>. An infimum, so it need not be achieved by any <InlineMath math={"y \\in S"}/></>}
                                ko={<>점과 집합 사이의 거리. <InlineMath math={"S"}/> 안에 머무르면서 <InlineMath math={"x"}/>에 얼마나 다가갈 수 있는지다. infimum이므로 <InlineMath math={"S"}/>의 어떤 <InlineMath math={"y"}/>도 그것을 달성하지 못할 수 있다</>}/>],
                ["\\sim B", <T en={<>the complement of <InlineMath math={"B"}/>. The last identity is just "no element of A is outside B", and it is the form used in the proofs below</>}
                               ko={<><InlineMath math={"B"}/>의 여집합. 마지막 항등식은 "A의 어떤 원소도 B 밖에 있지 않다"는 말이고, 아래 증명들이 쓰는 형태다</>}/>],
            ]}/>
            <Definition n="6.1" title={<T en={<>Open ball of radius <InlineMath math={"a"}/> centered at <InlineMath math={"x_0"}/></>}
                                          ko={<><InlineMath math={"x_0"}/>를 중심으로 반지름이 <InlineMath math={"a"}/>인 열린 공</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"x_0 \\in \\mathcal{X}"}/> and{" "}
                        <InlineMath math={"a \\in \\mathbb{R}"}/>, <InlineMath math={"a > 0"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"x_0 \\in \\mathcal{X}"}/>이고{" "}
                        <InlineMath math={"a \\in \\mathbb{R}"}/>, <InlineMath math={"a > 0"}/>일 때
                    </p>}
                />
                <BlockMath math={"B_a(x_0) = \\{\\, x \\in \\mathcal{X} \\mid \\|x - x_0\\| < a \\,\\}."}/>
                <Terms items={[
                    ["B_a(x_0)", <T en={<>the open ball: every point strictly closer than <InlineMath math={"a"}/> to the center</>}
                                    ko={<>열린 공. 중심에서 거리가 <InlineMath math={"a"}/>보다 진짜로 가까운 점 전부다</>}/>],
                    ["<", <T en={<>strict, so the rim is <em>not</em> included. Changing this one symbol to <InlineMath math={"\\le"}/> gives the closed ball and changes every statement in this section</>}
                            ko={<>강부등호이므로 테두리는 포함되지 <em>않는다</em>. 이 기호 하나를 <InlineMath math={"\\le"}/>로 바꾸면 닫힌 공이 되고 이 절의 모든 진술이 달라진다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The shape of that ball depends on the norm, not only on the radius. In{" "}
                        <InlineMath math={"\\mathbb{R}^2"}/> the unit ball{" "}
                        <InlineMath math={"B_1(0)"}/> is a disk under{" "}
                        <InlineMath math={"\\|\\bullet\\|_2"}/>, a diamond with corners at{" "}
                        <InlineMath math={"(\\pm 1, 0)"}/> and <InlineMath math={"(0, \\pm 1)"}/> under{" "}
                        <InlineMath math={"\\|\\bullet\\|_1"}/>, and the square{" "}
                        <InlineMath math={"(-1, 1) \\times (-1, 1)"}/> under{" "}
                        <InlineMath math={"\\|\\bullet\\|_\\infty"}/>. Chapter 3 has a figure for exactly
                        this. It matters less than it looks: Corollary 6.60 at the end of this chapter
                        proves that on a finite dimensional space all three give the same open sets.
                    </p>}
                    ko={<p>
                        그 공의 모양은 반지름만이 아니라 norm에 따라 달라진다.{" "}
                        <InlineMath math={"\\mathbb{R}^2"}/>에서 단위 공{" "}
                        <InlineMath math={"B_1(0)"}/>은 <InlineMath math={"\\|\\bullet\\|_2"}/> 아래에서
                        원판이고, <InlineMath math={"\\|\\bullet\\|_1"}/> 아래에서는{" "}
                        <InlineMath math={"(\\pm 1, 0)"}/>과 <InlineMath math={"(0, \\pm 1)"}/>에 꼭짓점을
                        둔 마름모이며, <InlineMath math={"\\|\\bullet\\|_\\infty"}/> 아래에서는 정사각형{" "}
                        <InlineMath math={"(-1, 1) \\times (-1, 1)"}/>이다. 3장에 바로 이 그림이 있다.
                        보이는 것만큼 중요하지는 않다. 이 장 끝의 따름정리 6.60이 유한 차원 공간에서는 셋
                        모두 같은 열린 집합을 준다는 것을 증명한다.
                    </p>}
                />
            </Definition>
            <Lemma n="6.2" title={<T en={<>Characterization of distance zero and greater than zero</>}
                                     ko={<>거리가 0인 경우와 0보다 큰 경우</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\|\\bullet\\|)"}/> be a normed space,{" "}
                        <InlineMath math={"x \\in \\mathcal{X}"}/>, and{" "}
                        <InlineMath math={"S \\subset \\mathcal{X}"}/>. Then
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\|\\bullet\\|)"}/>가 normed space이고{" "}
                        <InlineMath math={"x \\in \\mathcal{X}"}/>,{" "}
                        <InlineMath math={"S \\subset \\mathcal{X}"}/>이면
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} d(x, S) = 0 &\\iff \\forall \\epsilon > 0,\\ \\exists\\, y \\in S,\\ \\|x - y\\| < \\epsilon \\\\ &\\iff \\forall \\epsilon > 0,\\ B_\\epsilon(x) \\cap S \\ne \\emptyset \\end{aligned}"}/>
                <Terms items={[
                    ["d(x, S) = 0", <T en={<>you can get as close to <InlineMath math={"x"}/> as you like without leaving <InlineMath math={"S"}/>, though possibly never reaching it</>}
                                       ko={<><InlineMath math={"S"}/>를 벗어나지 않고 <InlineMath math={"x"}/>에 원하는 만큼 다가갈 수 있다는 뜻이다. 다만 끝내 닿지는 못할 수도 있다</>}/>],
                    ["\\epsilon", <T en={<>the tolerance, chosen by the opponent first. The point <InlineMath math={"y"}/> is allowed to depend on it</>}
                                     ko={<>허용 오차. 상대가 먼저 고른다. 점 <InlineMath math={"y"}/>는 그것에 의존해도 된다</>}/>],
                    ["B_\\epsilon(x) \\cap S \\ne \\emptyset", <T en={<>the same statement read as a picture: every ball around <InlineMath math={"x"}/>, no matter how small, catches part of <InlineMath math={"S"}/></>}
                                                                 ko={<>같은 진술을 그림으로 읽은 것이다. <InlineMath math={"x"}/> 둘레의 어떤 공도, 아무리 작아도, <InlineMath math={"S"}/>의 일부를 붙잡는다</>}/>],
                ]}/>
                <BlockMath math={"\\begin{aligned} d(x, S) > 0 &\\iff \\exists\\, \\epsilon > 0,\\ \\forall y \\in S,\\ \\|x - y\\| \\ge \\epsilon \\\\ &\\iff \\exists\\, \\epsilon > 0 \\ \\text{ such that } \\ B_\\epsilon(x) \\cap S = \\emptyset \\\\ &\\iff \\exists\\, \\epsilon > 0 \\ \\text{ such that } \\ B_\\epsilon(x) \\subset (\\sim S) \\end{aligned}"}/>
                <Terms items={[
                    ["d(x, S) > 0", <T en={<>there is a moat of positive width between <InlineMath math={"x"}/> and all of <InlineMath math={"S"}/></>}
                                       ko={<><InlineMath math={"x"}/>와 <InlineMath math={"S"}/> 전체 사이에 폭이 0보다 큰 해자가 있다는 뜻이다</>}/>],
                    ["\\exists\\, \\epsilon > 0", <T en={<>note the quantifier has flipped from the first display. This is the negation of <InlineMath math={"d(x, S) = 0"}/>, done exactly as in Chapter 1</>}
                                                    ko={<>첫 수식과 quantifier가 뒤집혔다. <InlineMath math={"d(x, S) = 0"}/>의 부정이고, 1장에서 하던 그대로다</>}/>],
                    ["B_\\epsilon(x) \\subset (\\sim S)", <T en={<>the ball misses <InlineMath math={"S"}/> entirely, which by the identity above is the same as sitting inside the complement</>}
                                                            ko={<>공이 <InlineMath math={"S"}/>를 통째로 비껴간다. 위의 항등식에 따라 여집합 안에 들어앉는 것과 같은 말이다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            The first line is the definition of the infimum, written out. If{" "}
                            <InlineMath math={"d(x, S) = 0"}/> then <InlineMath math={"0"}/> is the
                            greatest lower bound of{" "}
                            <InlineMath math={"\\{\\|x - y\\| : y \\in S\\}"}/>, so no{" "}
                            <InlineMath math={"\\epsilon > 0"}/> is a lower bound, which is exactly the
                            statement that some <InlineMath math={"y"}/> beats it. Conversely if every{" "}
                            <InlineMath math={"\\epsilon"}/> is beaten then no positive number is a lower
                            bound, so the infimum is <InlineMath math={"0"}/>. The second line rewrites{" "}
                            <InlineMath math={"\\|x - y\\| < \\epsilon"}/> as{" "}
                            <InlineMath math={"y \\in B_\\epsilon(x)"}/>, which is Definition 6.1.
                        </p>}
                        ko={<p>
                            첫 줄은 infimum의 정의를 풀어 쓴 것이다.{" "}
                            <InlineMath math={"d(x, S) = 0"}/>이면 <InlineMath math={"0"}/>이{" "}
                            <InlineMath math={"\\{\\|x - y\\| : y \\in S\\}"}/>의 greatest lower bound이므로
                            어떤 <InlineMath math={"\\epsilon > 0"}/>도 lower bound가 아니고, 그것이 곧
                            어떤 <InlineMath math={"y"}/>가 그 값을 밑돈다는 진술이다. 거꾸로 모든{" "}
                            <InlineMath math={"\\epsilon"}/>이 밑돌린다면 어떤 양수도 lower bound가 아니므로
                            infimum이 <InlineMath math={"0"}/>이다. 둘째 줄은{" "}
                            <InlineMath math={"\\|x - y\\| < \\epsilon"}/>을{" "}
                            <InlineMath math={"y \\in B_\\epsilon(x)"}/>로 다시 쓴 것이고, 그것이 정의
                            6.1이다.
                        </p>}
                    />
                    <T
                        en={<p>
                            The second group is the negation of the first, taken clause by clause:{" "}
                            <InlineMath math={"\\neg(\\forall \\epsilon, \\exists y, \\|x-y\\| < \\epsilon)"}/>{" "}
                            is{" "}
                            <InlineMath math={"\\exists \\epsilon, \\forall y, \\|x-y\\| \\ge \\epsilon"}/>.
                            For the last equivalence the notes give the witness explicitly: take
                        </p>}
                        ko={<p>
                            둘째 묶음은 첫째의 부정을 절 단위로 취한 것이다.{" "}
                            <InlineMath math={"\\neg(\\forall \\epsilon, \\exists y, \\|x-y\\| < \\epsilon)"}/>은{" "}
                            <InlineMath math={"\\exists \\epsilon, \\forall y, \\|x-y\\| \\ge \\epsilon"}/>이다.
                            마지막 동치에 대해서는 교재가 증인을 직접 준다.
                        </p>}
                    />
                    <BlockMath math={"\\epsilon = \\frac{d(x, S)}{2} > 0."}/>
                    <Terms items={[
                        ["\\epsilon = d(x,S)/2", <T en={<>half the moat. Any <InlineMath math={"y \\in S"}/> is at least <InlineMath math={"d(x,S)"}/> away, so it is more than <InlineMath math={"\\epsilon"}/> away and cannot be in the ball</>}
                                                    ko={<>해자의 절반. <InlineMath math={"S"}/>의 어떤 <InlineMath math={"y"}/>든 적어도 <InlineMath math={"d(x,S)"}/>만큼 떨어져 있으므로 <InlineMath math={"\\epsilon"}/>보다 멀고, 공 안에 있을 수 없다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Halving is not fussiness. Taking{" "}
                            <InlineMath math={"\\epsilon = d(x, S)"}/> itself would allow a point of{" "}
                            <InlineMath math={"S"}/> sitting at exactly that distance, and the ball is
                            open, so such a point is still excluded, but the infimum need not be attained
                            and the clean inequality is cheaper than the case analysis.
                        </p>}
                        ko={<p>
                            반으로 나누는 것은 까다로움이 아니다.{" "}
                            <InlineMath math={"\\epsilon = d(x, S)"}/>를 그대로 쓰면 정확히 그 거리에 앉은{" "}
                            <InlineMath math={"S"}/>의 점이 허용되는데, 공이 열려 있으므로 그런 점도 결국
                            배제되기는 한다. 다만 infimum이 달성되지 않을 수도 있어서, 깔끔한 부등식 쪽이
                            경우를 나누는 것보다 싸다.
                        </p>}
                    />
                </Proof>
            </Lemma>
            <Definition n="6.3" title={<T en={<>Interior point and interior</>} ko={<>내부점과 내부</>}/>}>
                <T
                    en={<ul>
                        <li>A point <InlineMath math={"p \\in P"}/> is an{" "}
                            <strong>interior point</strong> of <InlineMath math={"P"}/> if{" "}
                            <InlineMath math={"\\exists \\epsilon > 0"}/> such that{" "}
                            <InlineMath math={"B_\\epsilon(p) \\subset P"}/>.</li>
                        <li>The <strong>interior</strong> of <InlineMath math={"P"}/> is{" "}
                            <InlineMath math={"\\mathring{P} := \\{\\, p \\in P \\mid p \\text{ is an interior point} \\,\\}"}/>.</li>
                    </ul>}
                    ko={<ul>
                        <li><InlineMath math={"B_\\epsilon(p) \\subset P"}/>인{" "}
                            <InlineMath math={"\\epsilon > 0"}/>이 존재하면 점{" "}
                            <InlineMath math={"p \\in P"}/>를 <InlineMath math={"P"}/>의{" "}
                            <strong>내부점</strong>이라 한다.</li>
                        <li><InlineMath math={"P"}/>의 <strong>내부</strong>는{" "}
                            <InlineMath math={"\\mathring{P} := \\{\\, p \\in P \\mid p \\text{ is an interior point} \\,\\}"}/>이다.</li>
                    </ul>}
                />
            </Definition>
            <Remark n="6.4">
                <T
                    en={<p>
                        The interior has a formula in terms of distance, and it is worth deriving because
                        every later proof uses the last line rather than the definition.
                    </p>}
                    ko={<p>
                        내부는 거리로 적은 공식을 갖는다. 뒤의 모든 증명이 정의가 아니라 마지막 줄을 쓰기
                        때문에 유도해 둘 값어치가 있다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} \\mathring{P} &= \\{\\, p \\in P \\mid \\exists \\epsilon > 0,\\ B_\\epsilon(p) \\subset P \\,\\} \\\\ &= \\{\\, p \\in P \\mid d(p, \\sim P) > 0 \\,\\} \\\\ &= \\{\\, x \\in \\mathcal{X} \\mid d(x, \\sim P) > 0 \\,\\} \\end{aligned}"}/>
                <Terms items={[
                    ["\\mathring{P}", <T en={<>the interior of <InlineMath math={"P"}/></>} ko={<><InlineMath math={"P"}/>의 내부</>}/>],
                    ["d(p, \\sim P) > 0", <T en={<>Lemma 6.2 applied with <InlineMath math={"S = \\sim P"}/>: a ball around <InlineMath math={"p"}/> missing the complement is the same as a ball sitting inside <InlineMath math={"P"}/></>}
                                             ko={<>보조정리 6.2를 <InlineMath math={"S = \\sim P"}/>로 쓴 것이다. <InlineMath math={"p"}/> 둘레의 공이 여집합을 비껴간다는 것과 그 공이 <InlineMath math={"P"}/> 안에 들어앉는다는 것은 같은 말이다</>}/>],
                    ["x \\in \\mathcal{X}", <T en={<>the membership test <InlineMath math={"p \\in P"}/> can be dropped: a point outside <InlineMath math={"P"}/> lies in <InlineMath math={"\\sim P"}/>, so its distance to <InlineMath math={"\\sim P"}/> is <InlineMath math={"0"}/> and it fails the condition anyway</>}
                                               ko={<><InlineMath math={"p \\in P"}/>라는 조건은 떼어도 된다. <InlineMath math={"P"}/> 밖의 점은 <InlineMath math={"\\sim P"}/>에 속하므로 <InlineMath math={"\\sim P"}/>까지의 거리가 <InlineMath math={"0"}/>이고, 어차피 조건을 통과하지 못한다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The third line is the one to remember, because it turns a statement with two
                        quantifiers into a single inequality:
                    </p>}
                    ko={<p>
                        기억할 것은 셋째 줄이다. quantifier 두 개가 붙은 진술을 부등식 하나로 바꾸기
                        때문이다.
                    </p>}
                />
                <BlockMath math={"\\boxed{\\ \\mathring{P} = \\{\\, x \\in \\mathcal{X} \\mid d(x, \\sim P) > 0 \\,\\}.\\ }"}/>
                <Terms items={[
                    ["d(x, \\sim P)", <T en={<>the distance from <InlineMath math={"x"}/> to the nearest point not in <InlineMath math={"P"}/>. It is the largest radius that still fits, and the figure below prints its value as you drag</>}
                                         ko={<><InlineMath math={"x"}/>에서 <InlineMath math={"P"}/>에 속하지 않는 가장 가까운 점까지의 거리다. 그것이 곧 들어갈 수 있는 최대 반지름이고, 아래 그림이 끌어 보는 동안 그 값을 찍어 준다</>}/>],
                ]}/>
            </Remark>
            <Definition n="6.5" title={<T en={<>Open set</>} ko={<>열린 집합</>}/>}>
                <T
                    en={<p><InlineMath math={"P"}/> is <strong>open</strong> if{" "}
                        <InlineMath math={"\\mathring{P} = P"}/>, that is, if every point of{" "}
                        <InlineMath math={"P"}/> is an interior point. By Remark 6.6 this is the same as
                        saying <InlineMath math={"P = \\{x \\in \\mathcal{X} \\mid d(x, \\sim P) > 0\\}"}/>.
                    </p>}
                    ko={<p><InlineMath math={"\\mathring{P} = P"}/>일 때, 즉{" "}
                        <InlineMath math={"P"}/>의 모든 점이 내부점일 때 <InlineMath math={"P"}/>가{" "}
                        <strong>열렸다</strong>고 한다. 참고 6.6에 따라{" "}
                        <InlineMath math={"P = \\{x \\in \\mathcal{X} \\mid d(x, \\sim P) > 0\\}"}/>이라고
                        말하는 것과 같다.
                    </p>}
                />
            </Definition>
            <Example n="6.7" title={<T en={<>Checking whether a set is open</>} ko={<>집합이 열렸는지 확인하기</>}/>}>
                <T
                    en={<p>
                        Take <InlineMath math={"P = (0, 1) \\subset (\\mathbb{R}, |\\bullet|)"}/>. The
                        notes check it twice, and both ways are worth seeing because the second one
                        generalizes and the first one is the one you can draw.
                    </p>}
                    ko={<p>
                        <InlineMath math={"P = (0, 1) \\subset (\\mathbb{R}, |\\bullet|)"}/>을 보자. 교재는
                        이것을 두 번 확인하는데, 둘 다 볼 값어치가 있다. 두 번째가 일반화되고 첫 번째가
                        그림으로 그려지는 쪽이다.
                    </p>}
                />
                <T
                    en={<p>
                        <strong>First way, produce the radius.</strong> If{" "}
                        <InlineMath math={"x \\in P"}/> then <InlineMath math={"0 < x < 1"}/>, and the
                        notes define
                    </p>}
                    ko={<p>
                        <strong>첫 번째 방법, 반지름을 직접 만들어 낸다.</strong>{" "}
                        <InlineMath math={"x \\in P"}/>이면 <InlineMath math={"0 < x < 1"}/>이고, 교재는
                        다음을 정의한다.
                    </p>}
                />
                <BlockMath math={"\\epsilon = \\min\\left\\{ \\frac{x}{2},\\ \\frac{1-x}{2} \\right\\} > 0 \\qquad \\implies \\qquad B_\\epsilon(x) \\subset P."}/>
                <Terms items={[
                    ["x/2", <T en={<>half the room on the left. Using it rather than <InlineMath math={"x"}/> keeps the ball clear of the endpoint <InlineMath math={"0"}/></>}
                               ko={<>왼쪽 여유의 절반. <InlineMath math={"x"}/> 대신 이것을 쓰면 공이 끝점 <InlineMath math={"0"}/>에 닿지 않는다</>}/>],
                    ["(1-x)/2", <T en={<>half the room on the right, keeping the ball clear of <InlineMath math={"1"}/></>}
                                   ko={<>오른쪽 여유의 절반. 공이 <InlineMath math={"1"}/>에 닿지 않게 한다</>}/>],
                    ["\\min", <T en={<>the ball has to fit on both sides at once, so take the smaller</>}
                                 ko={<>공이 양쪽에 동시에 들어가야 하므로 작은 쪽을 취한다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Numbers make it concrete. At <InlineMath math={"x = 0.1"}/> the formula gives{" "}
                        <InlineMath math={"\\epsilon = \\min\\{0.05,\\, 0.45\\} = 0.05"}/> and the ball{" "}
                        <InlineMath math={"(0.05,\\, 0.15)"}/> is inside{" "}
                        <InlineMath math={"(0, 1)"}/>. At <InlineMath math={"x = 0.5"}/> it gives{" "}
                        <InlineMath math={"\\epsilon = 0.25"}/> and the ball{" "}
                        <InlineMath math={"(0.25,\\, 0.75)"}/>. At{" "}
                        <InlineMath math={"x = 0.99"}/> it gives{" "}
                        <InlineMath math={"\\epsilon = 0.005"}/> and the ball{" "}
                        <InlineMath math={"(0.985,\\, 0.995)"}/>. The radius shrinks as{" "}
                        <InlineMath math={"x"}/> approaches an endpoint, and that is fine: openness asks
                        only that <em>some</em> positive radius works at each point, never that one radius
                        works at all of them.
                    </p>}
                    ko={<p>
                        수를 넣으면 구체적이 된다. <InlineMath math={"x = 0.1"}/>에서는 공식이{" "}
                        <InlineMath math={"\\epsilon = \\min\\{0.05,\\, 0.45\\} = 0.05"}/>를 주고 공{" "}
                        <InlineMath math={"(0.05,\\, 0.15)"}/>는 <InlineMath math={"(0, 1)"}/> 안에 있다.{" "}
                        <InlineMath math={"x = 0.5"}/>에서는 <InlineMath math={"\\epsilon = 0.25"}/>와 공{" "}
                        <InlineMath math={"(0.25,\\, 0.75)"}/>를 준다.{" "}
                        <InlineMath math={"x = 0.99"}/>에서는{" "}
                        <InlineMath math={"\\epsilon = 0.005"}/>와 공{" "}
                        <InlineMath math={"(0.985,\\, 0.995)"}/>를 준다.{" "}
                        <InlineMath math={"x"}/>가 끝점에 다가갈수록 반지름이 줄어드는데, 그래도 괜찮다.
                        열림이 요구하는 것은 각 점에서 <em>어떤</em> 양의 반지름이 통한다는 것뿐이고, 하나의
                        반지름이 모든 점에서 통하라는 것이 결코 아니다.
                    </p>}
                />
                <T
                    en={<p>
                        <strong>Second way, compute the distance to the complement.</strong> Here{" "}
                        <InlineMath math={"\\sim P = (-\\infty, 0] \\cup [1, \\infty)"}/>, and the distance
                        to a union is the smaller of the two distances.
                    </p>}
                    ko={<p>
                        <strong>두 번째 방법, 여집합까지의 거리를 계산한다.</strong> 여기서{" "}
                        <InlineMath math={"\\sim P = (-\\infty, 0] \\cup [1, \\infty)"}/>이고, 합집합까지의
                        거리는 두 거리 중 작은 쪽이다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} d(x, (-\\infty, 0]) &= x > 0 \\\\ d(x, [1, \\infty)) &= 1 - x > 0 \\\\ d(x, \\sim P) &= \\min\\{x,\\ 1-x\\} > 0 \\end{aligned}"}/>
                <Terms items={[
                    ["d(x, \\sim P)", <T en={<>positive for every <InlineMath math={"x \\in P"}/>, so by Remark 6.6 the set is open. At <InlineMath math={"x = 0.1"}/> it equals <InlineMath math={"0.1"}/>, which is twice the <InlineMath math={"\\epsilon"}/> the first method produced: the first method is not tight, and it does not need to be</>}
                                         ko={<>모든 <InlineMath math={"x \\in P"}/>에서 양수이므로 참고 6.6에 따라 이 집합은 열렸다. <InlineMath math={"x = 0.1"}/>에서 값은 <InlineMath math={"0.1"}/>이고, 첫 방법이 만든 <InlineMath math={"\\epsilon"}/>의 두 배다. 첫 방법은 최선이 아니고, 최선일 필요도 없다</>}/>],
                ]}/>
                <T
                    en={<p>
                        <strong>The non-example that fails one clause.</strong>{" "}
                        <InlineMath math={"P = [0, 1)"}/> is not open. Every point except{" "}
                        <InlineMath math={"0"}/> still has room, and{" "}
                        <InlineMath math={"0"}/> alone ruins it:{" "}
                        <InlineMath math={"0 \\in P"}/>, but{" "}
                        <InlineMath math={"\\forall \\epsilon > 0"}/>,{" "}
                        <InlineMath math={"B_\\epsilon(0) = (-\\epsilon, \\epsilon)"}/> contains negative
                        numbers, so <InlineMath math={"B_\\epsilon(0) \\cap (\\sim P) \\ne \\emptyset"}/>.
                        Equivalently <InlineMath math={"d(0, \\sim P) = 0"}/>. One point out of
                        uncountably many decides the question, which is why openness is checked pointwise
                        and never by looking at the shape.
                    </p>}
                    ko={<p>
                        <strong>절 하나만 어기는 반례.</strong>{" "}
                        <InlineMath math={"P = [0, 1)"}/>은 열려 있지 않다.{" "}
                        <InlineMath math={"0"}/>을 뺀 모든 점은 여전히 여유를 갖고 있고,{" "}
                        <InlineMath math={"0"}/> 하나가 그것을 망친다.{" "}
                        <InlineMath math={"0 \\in P"}/>이지만 모든{" "}
                        <InlineMath math={"\\epsilon > 0"}/>에 대해{" "}
                        <InlineMath math={"B_\\epsilon(0) = (-\\epsilon, \\epsilon)"}/>이 음수를 포함하므로{" "}
                        <InlineMath math={"B_\\epsilon(0) \\cap (\\sim P) \\ne \\emptyset"}/>이다. 같은 말로{" "}
                        <InlineMath math={"d(0, \\sim P) = 0"}/>이다. 셀 수 없이 많은 점 중 하나가 문제를
                        결정한다. 열림을 점마다 확인하고 모양을 보아 판정하지 않는 이유가 이것이다.
                    </p>}
                />
            </Example>
            <CanvasFigure label={t("Open vs closed: drag the point, resize the ball",
                "열림과 닫힘: 점을 끌고 공의 크기를 바꿔 보라")}
                          modal={<OpenClosedExplorer width={760} height={470}/>}
                          bodyClassName="w-[min(92vw,900px)]">
                <OpenClosedExplorer/>
            </CanvasFigure>
            <Definition n="6.8" title={<T en={<>Closure point and closure</>} ko={<>closure point와 closure</>}/>}>
                <T
                    en={<ul>
                        <li>A point <InlineMath math={"x \\in \\mathcal{X}"}/> is a{" "}
                            <strong>closure point</strong> of <InlineMath math={"P"}/> if{" "}
                            <InlineMath math={"\\forall \\epsilon > 0"}/>,{" "}
                            <InlineMath math={"\\exists p \\in P"}/> such that{" "}
                            <InlineMath math={"\\|x - p\\| < \\epsilon"}/>. In other words{" "}
                            <InlineMath math={"d(x, P) = 0"}/>.</li>
                        <li>The <strong>closure</strong> of <InlineMath math={"P"}/> is{" "}
                            <InlineMath math={"\\overline{P} := \\{\\, x \\in \\mathcal{X} \\mid x \\text{ is a closure point} \\,\\}"}/>.</li>
                    </ul>}
                    ko={<ul>
                        <li>모든 <InlineMath math={"\\epsilon > 0"}/>에 대해{" "}
                            <InlineMath math={"\\|x - p\\| < \\epsilon"}/>인{" "}
                            <InlineMath math={"p \\in P"}/>가 존재하면 점{" "}
                            <InlineMath math={"x \\in \\mathcal{X}"}/>를 <InlineMath math={"P"}/>의{" "}
                            <strong>closure point</strong>라 한다. 다시 말해{" "}
                            <InlineMath math={"d(x, P) = 0"}/>이다.</li>
                        <li><InlineMath math={"P"}/>의 <strong>closure</strong>는{" "}
                            <InlineMath math={"\\overline{P} := \\{\\, x \\in \\mathcal{X} \\mid x \\text{ is a closure point} \\,\\}"}/>이다.</li>
                    </ul>}
                />
                <T
                    en={<p>
                        Note that a closure point need not belong to <InlineMath math={"P"}/>. That is
                        the entire point of the definition, and it is what the next one turns into a test.
                    </p>}
                    ko={<p>
                        closure point가 <InlineMath math={"P"}/>에 속할 필요는 없다는 점에 유의하라. 그것이
                        이 정의의 존재 이유이고, 바로 다음 정의가 그것을 판정 조건으로 바꾼다.
                    </p>}
                />
            </Definition>
            <Definition n="6.9" title={<T en={<>Closed set</>} ko={<>닫힌 집합</>}/>}>
                <T
                    en={<p><InlineMath math={"P"}/> is <strong>closed</strong> if{" "}
                        <InlineMath math={"\\overline{P} = P"}/>. Since{" "}
                        <InlineMath math={"P \\subset \\overline{P}"}/> always holds (take{" "}
                        <InlineMath math={"p = x"}/>), the content is the other inclusion:{" "}
                        <InlineMath math={"P"}/> is closed exactly when it contains every point it touches.
                    </p>}
                    ko={<p><InlineMath math={"\\overline{P} = P"}/>일 때 <InlineMath math={"P"}/>가{" "}
                        <strong>닫혔다</strong>고 한다. <InlineMath math={"P \\subset \\overline{P}"}/>는
                        항상 성립하므로 (<InlineMath math={"p = x"}/>로 두면 된다) 내용은 반대쪽 포함에
                        있다. <InlineMath math={"P"}/>가 닫혔다는 것은 자기가 닿는 점을 모두 갖고 있다는
                        뜻이다.
                    </p>}
                />
            </Definition>
            <Example n="6.10" title={<T en={<>Three intervals, with the distances computed</>}
                                        ko={<>구간 셋, 거리를 계산해서</>}/>}>
                <T
                    en={<p>Work in <InlineMath math={"(\\mathcal{X}, \\|\\bullet\\|) = (\\mathbb{R}, |\\bullet|)"}/>.</p>}
                    ko={<p><InlineMath math={"(\\mathcal{X}, \\|\\bullet\\|) = (\\mathbb{R}, |\\bullet|)"}/>에서 본다.</p>}
                />
                <T
                    en={<ol>
                        <li><InlineMath math={"P = [0, 1)"}/> is <strong>not</strong> closed, because{" "}
                            <InlineMath math={"1 \\notin P"}/> and yet{" "}
                            <InlineMath math={"d(1, P) = 0"}/>. The points{" "}
                            <InlineMath math={"0.9,\\, 0.99,\\, 0.999"}/> are all in{" "}
                            <InlineMath math={"P"}/> and get within any tolerance of{" "}
                            <InlineMath math={"1"}/>.</li>
                        <li><InlineMath math={"P = [0, 1]"}/> <strong>is</strong> closed, because{" "}
                            <InlineMath math={"x \\notin P"}/> implies{" "}
                            <InlineMath math={"d(x, P) = \\max\\{-x,\\ x - 1\\} > 0"}/>. At{" "}
                            <InlineMath math={"x = -0.3"}/> that reads{" "}
                            <InlineMath math={"\\max\\{0.3,\\, -1.3\\} = 0.3"}/>, and at{" "}
                            <InlineMath math={"x = 1.7"}/> it reads{" "}
                            <InlineMath math={"\\max\\{-1.7,\\, 0.7\\} = 0.7"}/>. The max picks out
                            whichever side you fell off.</li>
                        <li><InlineMath math={"P = (0, 1)"}/> has{" "}
                            <InlineMath math={"\\overline{P} = [0, 1]"}/>, because{" "}
                            <InlineMath math={"d(0, P) = 0"}/> and{" "}
                            <InlineMath math={"d(1, P) = 0"}/> while{" "}
                            <InlineMath math={"d(x, P) > 0"}/> for{" "}
                            <InlineMath math={"x \\notin [0, 1]"}/>. Taking the closure added exactly the
                            two points the set was missing.</li>
                    </ol>}
                    ko={<ol>
                        <li><InlineMath math={"P = [0, 1)"}/>은 닫혀 있지 <strong>않다</strong>.{" "}
                            <InlineMath math={"1 \\notin P"}/>인데{" "}
                            <InlineMath math={"d(1, P) = 0"}/>이기 때문이다.{" "}
                            <InlineMath math={"0.9,\\, 0.99,\\, 0.999"}/>는 모두{" "}
                            <InlineMath math={"P"}/>에 있고 <InlineMath math={"1"}/>에 어떤 허용 오차
                            안으로든 다가간다.</li>
                        <li><InlineMath math={"P = [0, 1]"}/>은 닫혔다.{" "}
                            <InlineMath math={"x \\notin P"}/>이면{" "}
                            <InlineMath math={"d(x, P) = \\max\\{-x,\\ x - 1\\} > 0"}/>이기 때문이다.{" "}
                            <InlineMath math={"x = -0.3"}/>에서는{" "}
                            <InlineMath math={"\\max\\{0.3,\\, -1.3\\} = 0.3"}/>이고,{" "}
                            <InlineMath math={"x = 1.7"}/>에서는{" "}
                            <InlineMath math={"\\max\\{-1.7,\\, 0.7\\} = 0.7"}/>이다. max가 어느 쪽으로
                            떨어졌는지를 골라낸다.</li>
                        <li><InlineMath math={"P = (0, 1)"}/>은{" "}
                            <InlineMath math={"\\overline{P} = [0, 1]"}/>이다.{" "}
                            <InlineMath math={"d(0, P) = 0"}/>이고{" "}
                            <InlineMath math={"d(1, P) = 0"}/>인 반면{" "}
                            <InlineMath math={"x \\notin [0, 1]"}/>에서는{" "}
                            <InlineMath math={"d(x, P) > 0"}/>이기 때문이다. closure를 취하자 집합이
                            빠뜨리고 있던 두 점이 정확히 더해졌다.</li>
                    </ol>}
                />
                <T
                    en={<p>
                        Item 1 and item 3 together make the pattern visible.{" "}
                        <InlineMath math={"[0, 1)"}/> is neither open (because of{" "}
                        <InlineMath math={"0"}/>) nor closed (because of{" "}
                        <InlineMath math={"1"}/>). Open and closed are two independent questions, and
                        failing both at once is ordinary rather than exotic.
                    </p>}
                    ko={<p>
                        1번과 3번을 나란히 놓으면 구조가 보인다.{" "}
                        <InlineMath math={"[0, 1)"}/>은 열려 있지도 않고 (<InlineMath math={"0"}/> 때문에)
                        닫혀 있지도 않다 (<InlineMath math={"1"}/> 때문에). 열림과 닫힘은 서로 독립인 질문
                        둘이고, 둘 다 아닌 것은 별난 일이 아니라 흔한 일이다.
                    </p>}
                />
            </Example>
            <Remark n="6.11" title={<T en={<>The rationals are neither</>} ko={<>유리수는 둘 다 아니다</>}/>}>
                <T
                    en={<p>
                        <InlineMath math={"\\mathbb{Q} \\subset \\mathbb{R}"}/> is neither closed nor
                        open, and <InlineMath math={"\\overline{\\mathbb{Q}} = \\mathbb{R}"}/>. It is not
                        closed because <InlineMath math={"\\sqrt{2}"}/> is a closure point that is not a
                        member, and it is not open because every ball around a rational contains
                        irrationals, so <InlineMath math={"d(q, \\sim \\mathbb{Q}) = 0"}/> for every{" "}
                        <InlineMath math={"q"}/>. This set will come back in the completeness section as
                        the cleanest example of a space with holes.
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathbb{Q} \\subset \\mathbb{R}"}/>은 닫히지도 열리지도
                        않았고 <InlineMath math={"\\overline{\\mathbb{Q}} = \\mathbb{R}"}/>이다. 닫히지
                        않은 것은 <InlineMath math={"\\sqrt{2}"}/>가 원소가 아닌 closure point이기
                        때문이고, 열리지 않은 것은 유리수 둘레의 어떤 공에도 무리수가 들어 있어 모든{" "}
                        <InlineMath math={"q"}/>에서{" "}
                        <InlineMath math={"d(q, \\sim \\mathbb{Q}) = 0"}/>이기 때문이다. 이 집합은 완비성
                        절에서 구멍 뚫린 공간의 가장 깔끔한 예로 다시 나온다.
                    </p>}
                />
            </Remark>
            <Theorem n="6.12" title={<T en={<>Characterization of open and closed sets using distance</>}
                                        ko={<>거리로 본 열린 집합과 닫힌 집합</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\|\\bullet\\|)"}/> be a normed space and{" "}
                        <InlineMath math={"P \\subset \\mathcal{X}"}/> a subset. Then{" "}
                        <InlineMath math={"P"}/> is open if, and only if,{" "}
                        <InlineMath math={"\\sim P"}/> is closed.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\|\\bullet\\|)"}/>이 normed space이고{" "}
                        <InlineMath math={"P \\subset \\mathcal{X}"}/>가 부분집합일 때,{" "}
                        <InlineMath math={"P"}/>가 열린 것과 <InlineMath math={"\\sim P"}/>가 닫힌 것은
                        동치다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} P \\text{ is closed} &\\iff \\sim P \\text{ is open} \\\\ P \\text{ is open} &\\iff \\sim P \\text{ is closed} \\end{aligned}"}/>
                <Terms items={[
                    ["P", <T en={<>any subset. No assumption is made about it, which is why this is the workhorse for turning statements about one into statements about the other</>}
                             ko={<>임의의 부분집합. 아무 가정도 두지 않는다. 한쪽에 대한 진술을 다른 쪽에 대한 진술로 바꾸는 일꾼이 되는 이유다</>}/>],
                    ["\\sim P", <T en={<>the complement. Taking it twice returns <InlineMath math={"P"}/>, so the two lines are the same statement</>}
                                   ko={<>여집합. 두 번 취하면 <InlineMath math={"P"}/>로 돌아오므로 두 줄은 같은 진술이다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            The notes give it in one line and then unpack it. The one line is
                        </p>}
                        ko={<p>
                            교재는 한 줄로 적고 그다음에 풀어 준다. 그 한 줄은 다음과 같다.
                        </p>}
                    />
                    <BlockMath math={"\\underbrace{\\sim P = \\sim(\\mathring{P})}_{P \\text{ is open}} = \\{\\, x \\in \\mathcal{X} \\mid d(x, \\sim P) = 0 \\,\\} = \\underbrace{\\overline{\\sim P} = \\sim P}_{\\sim P \\text{ is closed}}"}/>
                    <Terms items={[
                        ["\\sim(\\mathring{P})", <T en={<>the complement of the interior. By Remark 6.4 the interior is where <InlineMath math={"d(x, \\sim P) > 0"}/>, so its complement is where that distance is <InlineMath math={"0"}/></>}
                                                    ko={<>내부의 여집합. 참고 6.4에 따라 내부는 <InlineMath math={"d(x, \\sim P) > 0"}/>인 곳이므로, 그 여집합은 그 거리가 <InlineMath math={"0"}/>인 곳이다</>}/>],
                        ["\\overline{\\sim P}", <T en={<>the closure of the complement, which by Definition 6.8 is exactly the set where <InlineMath math={"d(x, \\sim P) = 0"}/></>}
                                                   ko={<>여집합의 closure. 정의 6.8에 따라 정확히 <InlineMath math={"d(x, \\sim P) = 0"}/>인 집합이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Read left to right, the middle expression is reached from the left by
                            assuming <InlineMath math={"P"}/> open, and from the right by assuming{" "}
                            <InlineMath math={"\\sim P"}/> closed. Since both roads end at the same set,
                            the two assumptions are equivalent. Unpacked into single steps:
                        </p>}
                        ko={<p>
                            왼쪽에서 오른쪽으로 읽으면, 가운데 식에는 왼쪽에서{" "}
                            <InlineMath math={"P"}/>가 열렸다고 가정해서 닿고 오른쪽에서{" "}
                            <InlineMath math={"\\sim P"}/>가 닫혔다고 가정해서 닿는다. 두 길이 같은 집합에
                            도달하므로 두 가정은 동치다. 한 걸음씩 풀면 이렇다.
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} P = \\mathring{P} &\\iff P = \\{\\, x \\in \\mathcal{X} \\mid d(x, \\sim P) > 0 \\,\\} \\\\ &\\iff \\sim P = \\{\\, x \\in \\mathcal{X} \\mid d(x, \\sim P) = 0 \\,\\} \\\\ &\\iff \\sim P = \\overline{\\sim P} \\end{aligned}"}/>
                    <Terms items={[
                        ["\\text{line 1}", <T en={<>Remark 6.4: the interior is the set where the distance to the complement is positive</>}
                                              ko={<>참고 6.4. 내부는 여집합까지의 거리가 양수인 집합이다</>}/>],
                        ["\\text{line 2}", <T en={<>take complements of both sides. A point either has positive distance to <InlineMath math={"\\sim P"}/> or distance <InlineMath math={"0"}/>, with no third option, so complementing the set on the right just flips the inequality</>}
                                              ko={<>양변의 여집합을 취한다. 한 점은 <InlineMath math={"\\sim P"}/>까지의 거리가 양수이거나 <InlineMath math={"0"}/>이거나 둘뿐이므로, 오른쪽 집합의 여집합을 취하면 부등호가 뒤집힐 뿐이다</>}/>],
                        ["\\text{line 3}", <T en={<>Definition 6.8 read on the set <InlineMath math={"\\sim P"}/>: its closure is precisely the points at distance <InlineMath math={"0"}/> from it</>}
                                              ko={<>정의 6.8을 집합 <InlineMath math={"\\sim P"}/>에 대해 읽은 것이다. 그 closure는 정확히 그 집합에서 거리가 <InlineMath math={"0"}/>인 점들이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Hence <InlineMath math={"P = \\mathring{P} \\iff \\sim P = \\overline{\\sim P}"}/>,
                            so <InlineMath math={"P"}/> is open if, and only if,{" "}
                            <InlineMath math={"\\sim P"}/> is closed. Applying the result to{" "}
                            <InlineMath math={"\\sim P"}/> in place of <InlineMath math={"P"}/> and using{" "}
                            <InlineMath math={"\\sim(\\sim P) = P"}/> gives the second line of the theorem.
                        </p>}
                        ko={<p>
                            따라서{" "}
                            <InlineMath math={"P = \\mathring{P} \\iff \\sim P = \\overline{\\sim P}"}/>이고,{" "}
                            <InlineMath math={"P"}/>가 열린 것과 <InlineMath math={"\\sim P"}/>가 닫힌 것이
                            동치다. 이 결과를 <InlineMath math={"P"}/> 자리에{" "}
                            <InlineMath math={"\\sim P"}/>를 넣어 적용하고{" "}
                            <InlineMath math={"\\sim(\\sim P) = P"}/>를 쓰면 정리의 둘째 줄이 나온다.
                        </p>}
                    />
                    <T
                        en={<p>
                            The notes unpack this in six lines rather than three, and their middle lines
                            read <InlineMath math={"B_\\epsilon(x) \\cap P"}/> where the argument needs{" "}
                            <InlineMath math={"B_\\epsilon(x) \\cap (\\sim P)"}/>. Following them literally
                            ends at <InlineMath math={"\\sim P = \\overline{P}"}/>, which is false for
                            almost every set. The three lines above are the same proof with the
                            complement kept straight.
                        </p>}
                        ko={<p>
                            교재는 이것을 세 줄이 아니라 여섯 줄로 풀고, 가운데 줄들이 논증에 필요한{" "}
                            <InlineMath math={"B_\\epsilon(x) \\cap (\\sim P)"}/> 자리에{" "}
                            <InlineMath math={"B_\\epsilon(x) \\cap P"}/>로 적혀 있다. 글자 그대로 따라가면{" "}
                            <InlineMath math={"\\sim P = \\overline{P}"}/>에 도착하는데, 이것은 거의 모든
                            집합에서 거짓이다. 위의 세 줄은 여집합을 바로잡은 같은 증명이다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Remark n="6.13" title={<T en={<>Clopen sets</>} ko={<>열리고 닫힌 집합</>}/>}>
                <T
                    en={<p>
                        Can a set be both open and closed? Yes, and such sets are sometimes called{" "}
                        <strong>clopen</strong>. In any normed space{" "}
                        <InlineMath math={"\\mathcal{X}"}/> itself is both, and by convention so is{" "}
                        <InlineMath math={"\\emptyset"}/>. The notes give two reasons for the empty set:
                        it does not violate either condition, since both are statements about points it
                        does not have; and we want the complement of an open set to be closed, which
                        forces it once <InlineMath math={"\\mathcal{X}"}/> is declared open. If that feels
                        like a definition chosen for convenience, it is, and Theorem 6.12 is the
                        convenience being bought.
                    </p>}
                    ko={<p>
                        열리면서 동시에 닫힌 집합이 있을 수 있는가? 있다. 그런 집합을 가끔{" "}
                        <strong>clopen</strong>이라 부른다. 어떤 normed space에서든{" "}
                        <InlineMath math={"\\mathcal{X}"}/> 자신이 둘 다이고, 관례상{" "}
                        <InlineMath math={"\\emptyset"}/>도 그렇다. 교재는 공집합에 두 가지 이유를 든다.
                        어느 조건도 어기지 않는다는 것이다. 둘 다 갖고 있지 않은 점들에 대한 진술이기
                        때문이다. 그리고 열린 집합의 여집합이 닫히기를 바라는데,{" "}
                        <InlineMath math={"\\mathcal{X}"}/>를 열린 것으로 선언한 이상 그것이 강제된다.
                        편의를 위해 고른 정의처럼 느껴진다면 실제로 그렇고, 정리 6.12가 그 편의로 사들인
                        것이다.
                    </p>}
                />
            </Remark>
            <Example n="6.15" title={<T en={<>Why "finite" is in the statement</>} ko={<>진술에 "유한"이 들어 있는 이유</>}/>}>
                <T
                    en={<p>
                        Exercise 6.14 asks you to show four closure properties: an arbitrary union of open
                        sets is open, an arbitrary intersection of closed sets is closed, a{" "}
                        <strong>finite</strong> intersection of open sets is open, and a{" "}
                        <strong>finite</strong> union of closed sets is closed. The word finite appears
                        twice, and this example is why. Take{" "}
                        <InlineMath math={"\\mathcal{X} = \\mathbb{R}"}/> with{" "}
                        <InlineMath math={"\\|x\\| = |x|"}/>. Is the infinite intersection
                    </p>}
                    ko={<p>
                        연습문제 6.14는 닫힘 성질 넷을 보이라고 한다. 열린 집합의 임의의 합집합은
                        열렸고, 닫힌 집합의 임의의 교집합은 닫혔고, 열린 집합의{" "}
                        <strong>유한</strong> 교집합은 열렸고, 닫힌 집합의 <strong>유한</strong> 합집합은
                        닫혔다. 유한이라는 말이 두 번 나오는데, 이 예제가 그 이유다.{" "}
                        <InlineMath math={"\\|x\\| = |x|"}/>인{" "}
                        <InlineMath math={"\\mathcal{X} = \\mathbb{R}"}/>에서 다음 무한 교집합은 열렸는가?
                    </p>}
                />
                <BlockMath math={"\\bigcap_{n=1}^{\\infty} \\left( -1 - \\tfrac{1}{n},\\ 1 \\right)"}/>
                <Terms items={[
                    ["n", <T en={<>the index, running over all positive integers, so this is an intersection of infinitely many open intervals</>}
                             ko={<>지수. 모든 양의 정수를 훑으므로 무한히 많은 열린 구간의 교집합이다</>}/>],
                    ["-1 - 1/n", <T en={<>the left endpoint, creeping up towards <InlineMath math={"-1"}/> from below but never arriving</>}
                                    ko={<>왼쪽 끝점. 아래에서 <InlineMath math={"-1"}/>로 기어 올라가지만 결코 도달하지 않는다</>}/>],
                ]}/>
                <T
                    en={<p>
                        <strong>No.</strong> The intersection is{" "}
                        <InlineMath math={"[-1, 1)"}/>, which Example 6.10 already showed is not open.
                        Here is the argument in both directions. For every{" "}
                        <InlineMath math={"n \\ge 1"}/> we have{" "}
                        <InlineMath math={"[-1, 1) \\subset (-1 - \\tfrac{1}{n}, 1)"}/>, so{" "}
                        <InlineMath math={"[-1, 1)"}/> sits inside the intersection. For the other
                        inclusion, if <InlineMath math={"x < -1"}/> then{" "}
                        <InlineMath math={"-1 - x > 0"}/>, so there exists a finite{" "}
                        <InlineMath math={"K"}/> with{" "}
                        <InlineMath math={"\\tfrac{1}{K} < -1 - x"}/>, that is{" "}
                        <InlineMath math={"x < -1 - \\tfrac{1}{K}"}/>, and therefore
                    </p>}
                    ko={<p>
                        <strong>아니다.</strong> 교집합은 <InlineMath math={"[-1, 1)"}/>이고, 예제 6.10이
                        이미 그것이 열려 있지 않음을 보였다. 양쪽 방향의 논증은 이렇다. 모든{" "}
                        <InlineMath math={"n \\ge 1"}/>에 대해{" "}
                        <InlineMath math={"[-1, 1) \\subset (-1 - \\tfrac{1}{n}, 1)"}/>이므로{" "}
                        <InlineMath math={"[-1, 1)"}/>은 교집합 안에 들어앉는다. 반대쪽 포함에 대해서는,{" "}
                        <InlineMath math={"x < -1"}/>이면 <InlineMath math={"-1 - x > 0"}/>이므로{" "}
                        <InlineMath math={"\\tfrac{1}{K} < -1 - x"}/>인 유한한{" "}
                        <InlineMath math={"K"}/>가 존재한다. 즉{" "}
                        <InlineMath math={"x < -1 - \\tfrac{1}{K}"}/>이고, 따라서
                    </p>}
                />
                <BlockMath math={"x \\notin \\left( -1 - \\tfrac{1}{K},\\ 1 \\right) \\qquad \\implies \\qquad x \\notin \\bigcap_{n=1}^{\\infty} \\left( -1 - \\tfrac{1}{n},\\ 1 \\right)."}/>
                <Terms items={[
                    ["K", <T en={<>one specific index that excludes <InlineMath math={"x"}/>. Membership in an intersection requires membership in every set, so a single failure is enough</>}
                             ko={<><InlineMath math={"x"}/>를 배제하는 지수 하나. 교집합에 속하려면 모든 집합에 속해야 하므로 한 번의 실패로 충분하다</>}/>],
                ]}/>
                <T
                    en={<p>
                        So the intersection contains <InlineMath math={"[-1, 1)"}/> and excludes
                        everything below <InlineMath math={"-1"}/>, hence equals{" "}
                        <InlineMath math={"[-1, 1)"}/>. The left endpoint survived because{" "}
                        <InlineMath math={"-1"}/> is inside <em>every</em> one of the intervals, while no
                        single interval was willing to contain it as an interior point in the limit. Each
                        set in the family gave <InlineMath math={"-1"}/> a little room, the amount of room
                        shrank to nothing, and the intersection kept the point but lost the room. That is
                        exactly the failure that the word finite rules out.
                    </p>}
                    ko={<p>
                        그러므로 교집합은 <InlineMath math={"[-1, 1)"}/>을 포함하고{" "}
                        <InlineMath math={"-1"}/> 아래의 모든 것을 배제하니{" "}
                        <InlineMath math={"[-1, 1)"}/>과 같다. 왼쪽 끝점이 살아남은 것은{" "}
                        <InlineMath math={"-1"}/>이 <em>모든</em> 구간 안에 들어 있기 때문이고, 그러면서도
                        극한에서 그것을 내부점으로 품어 줄 구간은 하나도 없었다. 족의 각 집합이{" "}
                        <InlineMath math={"-1"}/>에게 여유를 조금씩 주었는데 그 여유가 0으로 줄었고,
                        교집합은 점은 지켰지만 여유를 잃었다. 유한이라는 말이 막아 내는 것이 정확히 이
                        실패다.
                    </p>}
                />
            </Example>
            <Definition n="6.17" title={<T en={<>Boundary</>} ko={<>경계</>}/>}>
                <T
                    en={<p>
                        The <strong>boundary</strong> of{" "}
                        <InlineMath math={"S \\subset \\mathcal{X}"}/> is{" "}
                        <InlineMath math={"\\partial S := \\overline{S} \\cap \\overline{(\\sim S)}"}/>,
                        the points that touch both the set and its complement. Exercise 6.18 shows this
                        equals <InlineMath math={"\\overline{S} \\setminus \\mathring{S}"}/>. For{" "}
                        <InlineMath math={"S = (0,1)"}/> and for{" "}
                        <InlineMath math={"S = [0,1]"}/> the boundary is the same two point set{" "}
                        <InlineMath math={"\\{0, 1\\}"}/>, which is the cleanest way to say that open and
                        closed differ only in whether the boundary is included.
                    </p>}
                    ko={<p>
                        <InlineMath math={"S \\subset \\mathcal{X}"}/>의 <strong>경계</strong>는{" "}
                        <InlineMath math={"\\partial S := \\overline{S} \\cap \\overline{(\\sim S)}"}/>이고,
                        집합과 그 여집합 양쪽에 닿는 점들이다. 연습문제 6.18은 이것이{" "}
                        <InlineMath math={"\\overline{S} \\setminus \\mathring{S}"}/>와 같음을 보인다.{" "}
                        <InlineMath math={"S = (0,1)"}/>이든{" "}
                        <InlineMath math={"S = [0,1]"}/>이든 경계는 같은 두 점 집합{" "}
                        <InlineMath math={"\\{0, 1\\}"}/>이다. 열림과 닫힘이 오직 경계를 포함하는지에서만
                        갈린다는 것을 말하는 가장 깔끔한 방법이다.
                    </p>}
                />
            </Definition>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>The Newton-Raphson Algorithm</h2>} ko={<h2>Newton-Raphson 알고리즘</h2>}/>
            <T
                en={<p>
                    This section is placed early for a reason: it is the problem the rest of the chapter
                    exists to solve. Consider{" "}
                    <InlineMath math={"f : \\mathbb{R}^n \\to \\mathbb{R}^n"}/> continuously
                    differentiable, and suppose you want a root, a point{" "}
                    <InlineMath math={"x^*"}/> with <InlineMath math={"f(x^*) = 0"}/>. Domain and range
                    have the same dimension, so this is the nonlinear version of solving the square
                    system <InlineMath math={"Ax - b = 0"}/>. Chapter 4 solved that one exactly, in a
                    known number of operations. Nothing of the kind is available here.
                </p>}
                ko={<p>
                    이 절이 앞쪽에 놓인 데에는 이유가 있다. 이 장의 나머지가 풀려고 존재하는 문제가
                    바로 이것이다. 연속적으로 미분 가능한{" "}
                    <InlineMath math={"f : \\mathbb{R}^n \\to \\mathbb{R}^n"}/>을 놓고,{" "}
                    <InlineMath math={"f(x^*) = 0"}/>인 근 <InlineMath math={"x^*"}/>를 찾고 싶다고
                    하자. 정의역과 공역의 차원이 같으므로 이것은 정방 시스템{" "}
                    <InlineMath math={"Ax - b = 0"}/>을 푸는 문제의 비선형판이다. 4장은 그것을 정해진
                    연산 횟수 안에 정확히 풀었다. 여기서는 그런 것이 하나도 주어지지 않는다.
                </p>}
            />
            <T
                en={<p>
                    The move is to replace <InlineMath math={"f"}/> by the only thing you can solve, its
                    linear approximation about the current guess{" "}
                    <InlineMath math={"x_k"}/>.
                </p>}
                ko={<p>
                    쓸 수 있는 수는 <InlineMath math={"f"}/>를 풀 수 있는 유일한 것, 즉 현재 추측{" "}
                    <InlineMath math={"x_k"}/> 둘레의 선형 근사로 바꾸는 것이다.
                </p>}
            />
            <BlockMath math={"f(x) \\approx f(x_k) + \\frac{\\partial f(x_k)}{\\partial x} \\cdot (x - x_k) \\tag{6.1}"}/>
            <Terms items={[
                ["x_k", <T en={<>the current approximation of the root, the <InlineMath math={"k"}/>-th one</>}
                           ko={<>근의 현재 근사. <InlineMath math={"k"}/>번째 것이다</>}/>],
                ["\\frac{\\partial f(x_k)}{\\partial x}", <T en={<>the Jacobian, an <InlineMath math={"n \\times n"}/> matrix of partial derivatives evaluated at <InlineMath math={"x_k"}/>. It is the local linear model of <InlineMath math={"f"}/>, and it changes at every step</>}
                                                            ko={<>야코비안. <InlineMath math={"x_k"}/>에서 평가한 편미분들의 <InlineMath math={"n \\times n"}/> 행렬이다. <InlineMath math={"f"}/>의 국소 선형 모델이고, 걸음마다 바뀐다</>}/>],
                ["\\approx", <T en={<>the approximation is good only near <InlineMath math={"x_k"}/>. Every failure mode of the algorithm traces back to this symbol</>}
                                ko={<>근사는 <InlineMath math={"x_k"}/> 근처에서만 좋다. 이 알고리즘의 모든 실패 양상이 이 기호로 거슬러 올라간다</>}/>],
            ]}/>
            <T
                en={<p>
                    You would like to choose <InlineMath math={"x_{k+1}"}/> so that{" "}
                    <InlineMath math={"f(x_{k+1}) = 0"}/>, which you cannot do exactly. Setting the
                    approximation to zero instead gives
                </p>}
                ko={<p>
                    <InlineMath math={"f(x_{k+1}) = 0"}/>이 되도록{" "}
                    <InlineMath math={"x_{k+1}"}/>을 고르고 싶지만 정확히는 할 수 없다. 대신 근사를 0으로
                    두면 다음을 얻는다.
                </p>}
            />
            <BlockMath math={"f(x_{k+1}) \\approx 0 \\iff 0 \\approx f(x_k) + \\frac{\\partial f(x_k)}{\\partial x} \\cdot (x_{k+1} - x_k) \\tag{6.2}"}/>
            <Terms items={[
                ["x_{k+1}", <T en={<>the next iterate, defined as the exact root of the approximate model rather than the approximate root of the exact model</>}
                               ko={<>다음 반복점. 정확한 모델의 근사 근이 아니라 근사 모델의 정확한 근으로 정의된다</>}/>],
            ]}/>
            <T
                en={<p>
                    If <InlineMath math={"\\det\\left( \\frac{\\partial f(x_k)}{\\partial x} \\right) \\ne 0"}/>{" "}
                    you can solve for <InlineMath math={"x_{k+1}"}/>, and that is the algorithm.
                </p>}
                ko={<p>
                    <InlineMath math={"\\det\\left( \\frac{\\partial f(x_k)}{\\partial x} \\right) \\ne 0"}/>이면{" "}
                    <InlineMath math={"x_{k+1}"}/>에 대해 풀 수 있고, 그것이 알고리즘이다.
                </p>}
            />
            <BlockMath math={"\\boxed{\\ x_{k+1} = x_k - \\left( \\frac{\\partial f(x_k)}{\\partial x} \\right)^{-1} f(x_k).\\ }"}/>
            <Terms items={[
                ["\\left(\\cdot\\right)^{-1}", <T en={<>written as an inverse for readability. In code you solve a linear system instead, which is the next display</>}
                                                  ko={<>읽기 좋으라고 역행렬로 적었다. 코드에서는 대신 선형 시스템을 푸는데, 그것이 다음 수식이다</>}/>],
                ["f(x_k)", <T en={<>the residual, how far the current guess is from being a root. When it is zero the update is zero and the iteration stops moving</>}
                              ko={<>잔차. 현재 추측이 근에서 얼마나 멀리 있는지다. 이것이 0이면 갱신이 0이고 반복이 움직이지 않는다</>}/>],
            ]}/>
            <Remark title={<T en={<>The form you actually implement</>} ko={<>실제로 구현하는 형태</>}/>}>
                <T
                    en={<p>
                        Writing <InlineMath math={"\\Delta x_k := x_{k+1} - x_k"}/> splits the step into
                        a solve and an update. This is the form to use, because forming an explicit
                        inverse costs more and is less accurate than solving.
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\Delta x_k := x_{k+1} - x_k"}/>로 두면 한 걸음이 풀이와 갱신
                        둘로 갈라진다. 이 형태를 쓰는 것이 맞다. 역행렬을 명시적으로 만드는 것이 푸는
                        것보다 비싸고 덜 정확하기 때문이다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} \\left( \\frac{\\partial f(x_k)}{\\partial x} \\right) \\Delta x_k &= -f(x_k) && \\text{solve for } \\Delta x_k && (6.3) \\\\[2pt] x_{k+1} &= x_k + \\Delta x_k && \\text{then update} && (6.4) \\end{aligned}"}/>
                <Terms items={[
                    ["\\Delta x_k", <T en={<>the Newton step. Its norm is the natural thing to watch for a stopping test</>}
                                       ko={<>Newton 걸음. 정지 판정에서 지켜보기 자연스러운 것이 이것의 norm이다</>}/>],
                    ["\\text{(6.3)}", <T en={<>a square linear system, solved with the LU or QR factorization of Chapter 4 rather than with an inverse</>}
                                         ko={<>정방 선형 시스템. 역행렬이 아니라 4장의 LU나 QR 분해로 푼다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The <strong>damped Newton-Raphson algorithm</strong> replaces (6.4) with a
                        shortened step, for some <InlineMath math={"\\epsilon > 0"}/>:
                    </p>}
                    ko={<p>
                        <strong>damped Newton-Raphson 알고리즘</strong>은 (6.4)를 짧게 줄인 걸음으로
                        바꾼다. 어떤 <InlineMath math={"\\epsilon > 0"}/>에 대해
                    </p>}
                />
                <BlockMath math={"x_{k+1} = x_k + \\epsilon \\Delta x_k \\tag{6.5}"}/>
                <Terms items={[
                    ["\\epsilon", <T en={<>the damping factor, usually in <InlineMath math={"(0, 1]"}/>. Taking a fraction of the step keeps you inside the region where the linear model is trustworthy, at the cost of more iterations. Remark 6.45 is where this parameter earns its place</>}
                                     ko={<>감쇠 계수. 보통 <InlineMath math={"(0, 1]"}/>에 있다. 걸음의 일부만 가면 선형 모델을 믿을 수 있는 영역 안에 머무르게 되고, 대가로 반복이 늘어난다. 참고 6.45가 이 파라미터의 값어치가 드러나는 자리다</>}/>],
                ]}/>
                <T
                    en={<p>The validity of the algorithm rests on three things:</p>}
                    ko={<p>이 알고리즘의 타당성은 세 가지에 기댄다.</p>}
                />
                <T
                    en={<ul>
                        <li><InlineMath math={"f"}/> being differentiable;</li>
                        <li>the Jacobian <InlineMath math={"\\frac{\\partial f(x_k)}{\\partial x}"}/>{" "}
                            having non-zero determinant at every point generated by (6.3) and (6.4); and</li>
                        <li>the linear equation{" "}
                            <InlineMath math={"f_{\\text{lin}}(x) = f(x_k) + \\frac{\\partial f(x_k)}{\\partial x}(x - x_k)"}/>{" "}
                            being a good approximation to the function.</li>
                    </ul>}
                    ko={<ul>
                        <li><InlineMath math={"f"}/>가 미분 가능할 것.</li>
                        <li>야코비안{" "}
                            <InlineMath math={"\\frac{\\partial f(x_k)}{\\partial x}"}/>이 (6.3)과 (6.4)가
                            만들어 내는 모든 점에서 행렬식이 0이 아닐 것.</li>
                        <li>선형 방정식{" "}
                            <InlineMath math={"f_{\\text{lin}}(x) = f(x_k) + \\frac{\\partial f(x_k)}{\\partial x}(x - x_k)"}/>이
                            함수의 좋은 근사일 것.</li>
                    </ul>}
                />
                <T
                    en={<p>
                        The third condition is the one with no number attached to it, and the figure below
                        is what it looks like when it fails.
                    </p>}
                    ko={<p>
                        수가 붙어 있지 않은 조건은 세 번째이고, 아래 그림이 그것이 깨졌을 때의 모습이다.
                    </p>}
                />
            </Remark>
            <Example title={<T en={<>Numbers first: the square root of two</>} ko={<>수부터: 2의 제곱근</>}/>}>
                <T
                    en={<p>
                        Before the <InlineMath math={"\\mathbb{R}^4"}/> example, run the scalar case by
                        hand. Take <InlineMath math={"f(x) = x^2 - 2"}/>, so{" "}
                        <InlineMath math={"f'(x) = 2x"}/> and the update simplifies:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathbb{R}^4"}/> 예제로 가기 전에 스칼라 경우를 손으로 돌려
                        보자. <InlineMath math={"f(x) = x^2 - 2"}/>이면{" "}
                        <InlineMath math={"f'(x) = 2x"}/>이고 갱신식이 간단해진다.
                    </p>}
                />
                <BlockMath math={"x_{k+1} = x_k - \\frac{x_k^2 - 2}{2x_k} = \\frac{x_k}{2} + \\frac{1}{x_k}"}/>
                <Terms items={[
                    ["x_k/2 + 1/x_k", <T en={<>the Babylonian method, roughly four thousand years older than Newton. It averages a guess with the number the guess is too small or too large for</>}
                                         ko={<>바빌로니아 방법. Newton보다 대략 사천 년 앞선다. 추측과, 그 추측이 너무 작거나 큰 상대가 되는 수를 평균 낸다</>}/>],
                ]}/>
                <T
                    en={<p>Starting from <InlineMath math={"x_0 = 1"}/>, every iterate is a fraction:</p>}
                    ko={<p><InlineMath math={"x_0 = 1"}/>에서 시작하면 모든 반복점이 분수다.</p>}
                />
                <table className="table-center">
                    <thead>
                    <tr>
                        <th><InlineMath math={"k"}/></th>
                        <th><InlineMath math={"x_k"}/></th>
                        <th>{t("decimal", "소수")}</th>
                        <th><InlineMath math={"|x_k - \\sqrt{2}|"}/></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr><td>0</td><td><InlineMath math={"1"}/></td><td>1.000000000000</td><td><InlineMath math={"4.1 \\times 10^{-1}"}/></td></tr>
                    <tr><td>1</td><td><InlineMath math={"3/2"}/></td><td>1.500000000000</td><td><InlineMath math={"8.6 \\times 10^{-2}"}/></td></tr>
                    <tr><td>2</td><td><InlineMath math={"17/12"}/></td><td>1.416666666667</td><td><InlineMath math={"2.5 \\times 10^{-3}"}/></td></tr>
                    <tr><td>3</td><td><InlineMath math={"577/408"}/></td><td>1.414215686275</td><td><InlineMath math={"2.1 \\times 10^{-6}"}/></td></tr>
                    <tr><td>4</td><td><InlineMath math={"665857/470832"}/></td><td>1.414213562375</td><td><InlineMath math={"1.6 \\times 10^{-12}"}/></td></tr>
                    </tbody>
                </table>
                <T
                    en={<p>
                        Read the last column: the exponents go{" "}
                        <InlineMath math={"-1, -2, -3, -6, -12"}/>. Each error is roughly the square of
                        the one before, which is what quadratic convergence means and why four steps
                        suffice for double precision. Two other things are worth noticing. Every iterate
                        is rational, and the thing they are converging to is not, which is the entire
                        content of the completeness section three sections from now. And the algorithm
                        never had to know the answer to get there.
                    </p>}
                    ko={<p>
                        마지막 열을 읽어 보라. 지수가{" "}
                        <InlineMath math={"-1, -2, -3, -6, -12"}/>로 간다. 각 오차가 대략 앞 오차의
                        제곱이다. 이것이 이차 수렴이라는 말의 뜻이고, 배정밀도에 네 걸음이면 충분한
                        이유다. 눈여겨볼 것이 둘 더 있다. 모든 반복점이 유리수인데 그것들이 수렴해 가는
                        대상은 유리수가 아니다. 지금부터 세 절 뒤 완비성 절의 내용이 통째로 이것이다.
                        그리고 알고리즘은 거기 닿기까지 답을 알 필요가 한 번도 없었다.
                    </p>}
                />
            </Example>
            <Example n="6.19" title={<T en={<>A root in <InlineMath math={"\\mathbb{R}^4"}/></>}
                                        ko={<><InlineMath math={"\\mathbb{R}^4"}/>에서 근 찾기</>}/>}>
                <T
                    en={<p>
                        Find a root of <InlineMath math={"F : \\mathbb{R}^4 \\to \\mathbb{R}^4"}/> near{" "}
                        <InlineMath math={"x_0 = \\begin{bmatrix} -2.0 & 3.0 & \\pi & -1.0 \\end{bmatrix}"}/> for
                    </p>}
                    ko={<p>
                        <InlineMath math={"x_0 = \\begin{bmatrix} -2.0 & 3.0 & \\pi & -1.0 \\end{bmatrix}"}/> 근처에서{" "}
                        <InlineMath math={"F : \\mathbb{R}^4 \\to \\mathbb{R}^4"}/>의 근을 찾아라.
                    </p>}
                />
                <BlockMath math={"F(x) = \\begin{bmatrix} x_1 + 2x_2 - x_1(x_1 + 4x_2) - x_2(4x_1 + 10x_2) + 3 \\\\ 3x_1 + 4x_2 - x_1(x_1 + 4x_2) - x_2(4x_1 + 10x_2) + 4 \\\\ 0.5\\cos(x_1) + x_3 - (\\sin(x_3))^7 \\\\ -2(x_2)^2 \\sin(x_1) + (x_4)^3 \\end{bmatrix}"}/>
                <Terms items={[
                    ["x_1, \\ldots, x_4", <T en={<>the four components of <InlineMath math={"x"}/>, not four different iterates. The subscript means something different here than it does in <InlineMath math={"x_k"}/></>}
                                             ko={<><InlineMath math={"x"}/>의 네 성분이다. 서로 다른 네 반복점이 아니다. 여기서 아래 첨자는 <InlineMath math={"x_k"}/>에서와 다른 뜻이다</>}/>],
                    ["\\text{rows 1, 2}", <T en={<>identical except for the linear part, so they differ by <InlineMath math={"2x_1 + 2x_2 + 1"}/>. That is what makes the top-left block of the Jacobian nearly singular and the problem worth running</>}
                                             ko={<>선형 항을 빼면 같고, 차이는 <InlineMath math={"2x_1 + 2x_2 + 1"}/>이다. 그것이 야코비안의 왼쪽 위 블록을 거의 특이하게 만들고, 이 문제를 돌려 볼 값어치가 있게 만든다</>}/>],
                    ["\\pi", <T en={<>the third starting component. At <InlineMath math={"x_3 = \\pi"}/> we have <InlineMath math={"\\sin(x_3) = 0"}/>, so the seventh power term and its derivative both vanish at the first step</>}
                              ko={<>세 번째 시작 성분. <InlineMath math={"x_3 = \\pi"}/>에서 <InlineMath math={"\\sin(x_3) = 0"}/>이므로 7제곱 항과 그 미분이 첫 걸음에서 모두 사라진다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The notes program up (6.3) and (6.4) with a symmetric difference approximation for
                        the derivatives, using <InlineMath math={"h = 0.1"}/>. Reproducing that
                        computation gives the first five iterates below, and they agree with the printed
                        table to every digit shown.
                    </p>}
                    ko={<p>
                        교재는 미분을 <InlineMath math={"h = 0.1"}/>인 중심 차분으로 근사해 (6.3)과 (6.4)를
                        프로그램으로 짰다. 그 계산을 다시 돌리면 아래 다섯 반복점이 나오고, 인쇄된 표와
                        보이는 모든 자리에서 일치한다.
                    </p>}
                />
                <BlockMath math={"x_k = \\begin{bmatrix} -2.0000 & -3.0435 & -2.4233 & -2.2702 & -2.2596 & -2.2596 \\\\ 3.0000 & 2.5435 & 1.9233 & 1.7702 & 1.7596 & 1.7596 \\\\ 3.1416 & 0.6817 & 0.4104 & 0.3251 & 0.3181 & 0.3181 \\\\ -1.0000 & -1.8580 & -2.0710 & -1.7652 & -1.6884 & -1.6846 \\end{bmatrix}"}/>
                <Terms items={[
                    ["\\text{columns}", <T en={<>the iterates <InlineMath math={"k = 0"}/> through <InlineMath math={"k = 5"}/>, left to right</>}
                                           ko={<>왼쪽부터 <InlineMath math={"k = 0"}/>에서 <InlineMath math={"k = 5"}/>까지의 반복점</>}/>],
                    ["\\text{rows}", <T en={<>the four components. Rows 1 and 2 settle by <InlineMath math={"k = 4"}/>, row 4 is still moving at <InlineMath math={"k = 5"}/></>}
                                        ko={<>네 성분. 1행과 2행은 <InlineMath math={"k = 4"}/>에서 자리를 잡고, 4행은 <InlineMath math={"k = 5"}/>에서도 여전히 움직이고 있다</>}/>],
                ]}/>
                <BlockMath math={"f(x_k) = \\begin{bmatrix} -39.0000 & -6.9839 & -1.1539 & -0.0703 & -0.0003 & -0.0000 \\\\ -36.0000 & -6.9839 & -1.1539 & -0.0703 & -0.0003 & -0.0000 \\\\ 2.9335 & 0.1447 & 0.0323 & 0.0028 & 0.0000 & -0.0000 \\\\ 15.3674 & -5.1471 & -4.0134 & -0.7044 & -0.0321 & -0.0001 \\end{bmatrix}"}/>
                <Terms items={[
                    ["f(x_k)", <T en={<>the residual at each iterate. This, not the change in <InlineMath math={"x"}/>, is what tells you a root has been found</>}
                                  ko={<>각 반복점에서의 잔차. 근을 찾았다고 말해 주는 것은 <InlineMath math={"x"}/>의 변화가 아니라 이것이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        By iteration five the residual has norm{" "}
                        <InlineMath math={"\\|f(x_5)\\|_2 = 1.089 \\times 10^{-4}"}/>, matching the notes'{" "}
                        <InlineMath math={"\\approx 10^{-4}"}/>. Notice how uneven the progress is. The
                        residual drops by a factor of about six on the first step, then thirty, then
                        two hundred: the quadratic behaviour only switches on once the iterate is close
                        enough for the linear model to be accurate, and the first steps are not that.
                    </p>}
                    ko={<p>
                        다섯 번째 반복에서 잔차의 norm은{" "}
                        <InlineMath math={"\\|f(x_5)\\|_2 = 1.089 \\times 10^{-4}"}/>이고, 교재의{" "}
                        <InlineMath math={"\\approx 10^{-4}"}/>과 맞는다. 진행이 얼마나 고르지 않은지
                        눈여겨보라. 잔차는 첫 걸음에서 약 6배, 그다음 30배, 그다음 200배로 줄어든다. 이차
                        거동은 반복점이 선형 모델이 정확할 만큼 가까워진 뒤에야 켜지고, 처음 걸음들은
                        그렇지 않다.
                    </p>}
                />
                <T
                    en={<p>
                        The Jacobian changes as the iterate moves, and that is the point of printing two
                        of them:
                    </p>}
                    ko={<p>
                        반복점이 움직이면 야코비안도 바뀐다. 그것을 둘 찍어 두는 이유가 그것이다.
                    </p>}
                />
                <BlockMath math={"\\frac{\\partial f(x_0)}{\\partial x} = \\begin{bmatrix} -19.0000 & -42.0000 & 0 & 0 \\\\ -17.0000 & -40.0000 & 0 & 0 \\\\ 0.4539 & 0 & 1.0000 & 0 \\\\ 7.4782 & 10.9116 & 0 & 3.0100 \\end{bmatrix}"}/>
                <Terms items={[
                    ["0.4539", <T en={<>the symmetric difference of <InlineMath math={"0.5\\cos(x_1)"}/> at <InlineMath math={"x_1 = -2"}/>. The exact derivative is <InlineMath math={"-0.5\\sin(-2) = 0.4546"}/>, and the gap is the price of <InlineMath math={"h = 0.1"}/></>}
                                  ko={<><InlineMath math={"x_1 = -2"}/>에서 <InlineMath math={"0.5\\cos(x_1)"}/>의 중심 차분이다. 정확한 미분은 <InlineMath math={"-0.5\\sin(-2) = 0.4546"}/>이고, 그 차이가 <InlineMath math={"h = 0.1"}/>의 대가다</>}/>],
                    ["3.0100", <T en={<>the symmetric difference of <InlineMath math={"x_4^3"}/> at <InlineMath math={"x_4 = -1"}/>, which equals <InlineMath math={"3x_4^2 + h^2 = 3 + 0.01"}/> exactly. Finite differences of a cubic have a clean error term</>}
                                  ko={<><InlineMath math={"x_4 = -1"}/>에서 <InlineMath math={"x_4^3"}/>의 중심 차분이고, 정확히 <InlineMath math={"3x_4^2 + h^2 = 3 + 0.01"}/>이다. 삼차식의 차분은 오차항이 깔끔하다</>}/>],
                    ["\\text{zeros}", <T en={<>rows 1 and 2 do not involve <InlineMath math={"x_3"}/> or <InlineMath math={"x_4"}/> at all, so the matrix is block lower triangular and (6.3) could be solved two components at a time</>}
                                         ko={<>1행과 2행에는 <InlineMath math={"x_3"}/>도 <InlineMath math={"x_4"}/>도 아예 없으므로 이 행렬은 블록 하삼각이고, (6.3)을 두 성분씩 나눠 풀 수 있다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The notes print a second Jacobian labelled{" "}
                        <InlineMath math={"\\partial f(x_5)/\\partial x"}/>. Recomputing both, the printed
                        matrix is the Jacobian at <InlineMath math={"x_4"}/>, not at{" "}
                        <InlineMath math={"x_5"}/>: it matches{" "}
                        <InlineMath math={"\\partial f(x_4)/\\partial x"}/> in all sixteen entries, while
                        the true <InlineMath math={"\\partial f(x_5)/\\partial x"}/> differs in the
                        bottom right, <InlineMath math={"8.5236"}/> against the printed{" "}
                        <InlineMath math={"8.5616"}/>. That entry is{" "}
                        <InlineMath math={"3x_4^2 + h^2"}/>, and the two iterates differ in that component
                        already in the third decimal, which is what makes the off-by-one visible at all.
                        Nothing in the example depends on it.
                    </p>}
                    ko={<p>
                        교재는 두 번째 야코비안을{" "}
                        <InlineMath math={"\\partial f(x_5)/\\partial x"}/>라는 이름으로 찍어 둔다. 둘 다
                        다시 계산해 보면, 인쇄된 행렬은 <InlineMath math={"x_5"}/>가 아니라{" "}
                        <InlineMath math={"x_4"}/>에서의 야코비안이다. 열여섯 성분 전부가{" "}
                        <InlineMath math={"\\partial f(x_4)/\\partial x"}/>와 맞는 반면, 참{" "}
                        <InlineMath math={"\\partial f(x_5)/\\partial x"}/>는 오른쪽 아래에서 갈린다.
                        인쇄된 <InlineMath math={"8.5616"}/>에 대해{" "}
                        <InlineMath math={"8.5236"}/>이다. 그 성분이{" "}
                        <InlineMath math={"3x_4^2 + h^2"}/>이고 두 반복점이 그 성분에서 이미 소수 셋째
                        자리부터 다르기 때문에 이 한 칸 밀림이 눈에 보인다. 예제의 어떤 부분도 여기에
                        기대지 않는다.
                    </p>}
                />
            </Example>
            <T
                en={<p>
                    The hope behind all of this is that each iteration produces a better approximation, so
                    that <InlineMath math={"\\|x^* - x_k\\|"}/> can be made as small as you like by taking{" "}
                    <InlineMath math={"k"}/> large enough. That sentence is not yet a theorem, because
                    nothing so far says the sequence goes anywhere. The next three sections make it one.
                    First, though, look at what "better approximation" hides.
                </p>}
                ko={<p>
                    이 모든 것 뒤에 있는 기대는 반복이 매번 더 나은 근사를 내놓아서{" "}
                    <InlineMath math={"k"}/>를 충분히 크게 잡으면{" "}
                    <InlineMath math={"\\|x^* - x_k\\|"}/>를 원하는 만큼 작게 만들 수 있다는 것이다. 이
                    문장은 아직 정리가 아니다. 지금까지 이 수열이 어디로든 간다고 말해 주는 것이 없기
                    때문이다. 다음 세 절이 그것을 정리로 만든다. 그 전에 "더 나은 근사"가 무엇을 감추고
                    있는지 보자.
                </p>}
            />
            <CanvasFigure label={t("Newton on a cubic, with the basins of attraction underneath",
                "삼차식 위의 Newton, 아래는 끌림 영역")}
                          modal={<NewtonBasins width={800} height={500}/>}
                          bodyClassName="w-[min(92vw,940px)]">
                <NewtonBasins/>
            </CanvasFigure>
            <Remark title={<T en={<>What the figure is showing</>} ko={<>그림이 보이는 것</>}/>}>
                <T
                    en={<p>
                        The function is <InlineMath math={"f(x) = x^3 - x"}/> with roots at{" "}
                        <InlineMath math={"-1, 0, 1"}/>, and the Newton map works out to
                    </p>}
                    ko={<p>
                        함수는 근이 <InlineMath math={"-1, 0, 1"}/>인{" "}
                        <InlineMath math={"f(x) = x^3 - x"}/>이고, Newton 사상은 다음과 같이 정리된다.
                    </p>}
                />
                <BlockMath math={"N(x) = x - \\frac{x^3 - x}{3x^2 - 1} = \\frac{2x^3}{3x^2 - 1}"}/>
                <Terms items={[
                    ["N(x)", <T en={<>one Newton step, written as a map so the iteration is <InlineMath math={"x_{k+1} = N(x_k)"}/>. Section 6.5 studies exactly this kind of object</>}
                                ko={<>Newton 한 걸음을 사상으로 적은 것이다. 반복이 <InlineMath math={"x_{k+1} = N(x_k)"}/>가 된다. 6.5절이 정확히 이런 대상을 다룬다</>}/>],
                    ["3x^2 - 1", <T en={<>the derivative <InlineMath math={"f'(x)"}/>, which vanishes at <InlineMath math={"x = \\pm 1/\\sqrt{3} \\approx \\pm 0.5774"}/>. The dashed vertical lines in the figure mark these: the tangent is horizontal and the next iterate does not exist</>}
                                    ko={<>미분 <InlineMath math={"f'(x)"}/>이고 <InlineMath math={"x = \\pm 1/\\sqrt{3} \\approx \\pm 0.5774"}/>에서 0이 된다. 그림의 점선 수직선이 그 자리다. 접선이 수평이라 다음 반복점이 존재하지 않는다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Two features make this map a good teacher. Just to the right of{" "}
                        <InlineMath math={"1/\\sqrt{3}"}/> the tangent is nearly flat, so the step is
                        enormous: starting at <InlineMath math={"x_0 = 0.6"}/> the first iterate is{" "}
                        <InlineMath math={"5.4"}/>, and the method then crawls back through{" "}
                        <InlineMath math={"3.64,\\ 2.49,\\ 1.75,\\ 1.31,\\ 1.08"}/> to{" "}
                        <InlineMath math={"1"}/>. It converges, but the first step went the wrong
                        direction by any reasonable measure.
                    </p>}
                    ko={<p>
                        이 사상을 좋은 선생으로 만드는 특징이 둘 있다.{" "}
                        <InlineMath math={"1/\\sqrt{3}"}/> 바로 오른쪽에서는 접선이 거의 평평해서 걸음이
                        엄청나게 커진다. <InlineMath math={"x_0 = 0.6"}/>에서 시작하면 첫 반복점이{" "}
                        <InlineMath math={"5.4"}/>이고, 그다음{" "}
                        <InlineMath math={"3.64,\\ 2.49,\\ 1.75,\\ 1.31,\\ 1.08"}/>을 거쳐{" "}
                        <InlineMath math={"1"}/>로 기어 돌아온다. 수렴하기는 하는데, 첫 걸음은 어떤
                        합리적인 잣대로 보아도 틀린 방향으로 갔다.
                    </p>}
                />
                <T
                    en={<p>
                        Worse, the map has an exact two cycle. Setting{" "}
                        <InlineMath math={"c = 1/\\sqrt{5} \\approx 0.4472136"}/>,
                    </p>}
                    ko={<p>
                        더 나쁜 것은 이 사상이 정확한 2-주기를 갖는다는 점이다.{" "}
                        <InlineMath math={"c = 1/\\sqrt{5} \\approx 0.4472136"}/>으로 두면
                    </p>}
                />
                <BlockMath math={"N(c) = \\frac{2c^3}{3c^2 - 1} = \\frac{2 \\cdot \\tfrac{1}{5\\sqrt{5}}}{\\tfrac{3}{5} - 1} = \\frac{\\tfrac{2}{5\\sqrt{5}}}{-\\tfrac{2}{5}} = -\\frac{1}{\\sqrt{5}} = -c"}/>
                <Terms items={[
                    ["c = 1/\\sqrt{5}", <T en={<>a starting point from which Newton bounces to <InlineMath math={"-c"}/>, back to <InlineMath math={"c"}/>, and never anywhere else. There is no root within reach and the iteration never terminates</>}
                                           ko={<>Newton이 <InlineMath math={"-c"}/>로 튕겼다가 <InlineMath math={"c"}/>로 돌아오기만 하고 다른 어디로도 가지 않는 시작점이다. 닿을 수 있는 근이 없고 반복은 끝나지 않는다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The cycle is repelling, since{" "}
                        <InlineMath math={"|N'(c)| = 13.4"}/>, so points near{" "}
                        <InlineMath math={"c"}/> do not stay near it: they get flung outward, and which
                        root they eventually reach depends on the bounce. That is the interleaving you
                        see in the strip. Sampling the starting axis at four thousand points across{" "}
                        <InlineMath math={"[-2, 2]"}/> finds fifteen separate bands, with the switches
                        piling up at <InlineMath math={"\\pm 1/\\sqrt{5}"}/> and{" "}
                        <InlineMath math={"\\pm 1/\\sqrt{3}"}/>. Moving the start from{" "}
                        <InlineMath math={"0.447"}/> to <InlineMath math={"0.450"}/> to{" "}
                        <InlineMath math={"0.460"}/> lands you on{" "}
                        <InlineMath math={"0"}/>, then <InlineMath math={"-1"}/>, then{" "}
                        <InlineMath math={"+1"}/>.
                    </p>}
                    ko={<p>
                        이 주기는 반발성이다. <InlineMath math={"|N'(c)| = 13.4"}/>이기 때문이다. 그래서{" "}
                        <InlineMath math={"c"}/> 근처의 점들은 그 근처에 머무르지 않고 바깥으로 내던져지며,
                        결국 어느 근에 닿는지는 튕김에 달린다. 띠에서 보이는 뒤섞임이 그것이다. 시작점 축을{" "}
                        <InlineMath math={"[-2, 2]"}/>에서 사천 점으로 훑으면 서로 다른 띠 열다섯 개가
                        나오고, 색이 바뀌는 자리가{" "}
                        <InlineMath math={"\\pm 1/\\sqrt{5}"}/>와{" "}
                        <InlineMath math={"\\pm 1/\\sqrt{3}"}/>에 쌓인다. 시작점을{" "}
                        <InlineMath math={"0.447"}/>에서 <InlineMath math={"0.450"}/>,{" "}
                        <InlineMath math={"0.460"}/>으로 옮기면 도착지가{" "}
                        <InlineMath math={"0"}/>, <InlineMath math={"-1"}/>,{" "}
                        <InlineMath math={"+1"}/>로 바뀐다.
                    </p>}
                />
                <T
                    en={<p>
                        So the honest statement about Newton-Raphson is local. There is a ball around each
                        root inside which the method converges quadratically, and outside it there is no
                        promise of any kind. Remark 6.45 will say precisely what that ball is, using the
                        contraction mapping theorem, and the reason the theorem is needed at all is
                        visible in this strip.
                    </p>}
                    ko={<p>
                        그러니 Newton-Raphson에 대한 정직한 진술은 국소적이다. 각 근 둘레에 이차로
                        수렴하는 공이 있고, 그 바깥에는 어떤 종류의 약속도 없다. 참고 6.45가 contraction
                        mapping 정리를 써서 그 공이 정확히 무엇인지 말해 줄 것이고, 애초에 그 정리가
                        필요한 이유가 이 띠에 보인다.
                    </p>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Sequences</h2>} ko={<h2>수열</h2>}/>
            <T
                en={<p>
                    An iteration produces a list of vectors, so the formal object for studying it is a
                    sequence. Once again <InlineMath math={"(\\mathcal{X}, \\|\\bullet\\|)"}/> is a normed
                    space.
                </p>}
                ko={<p>
                    반복은 벡터의 목록을 만들어 내므로, 그것을 다루는 형식적 대상은 수열이다. 여기서도{" "}
                    <InlineMath math={"(\\mathcal{X}, \\|\\bullet\\|)"}/>는 normed space다.
                </p>}
            />
            <Definition n="6.20" title={<T en={<>Sequence</>} ko={<>수열</>}/>}>
                <T
                    en={<p>
                        A set of vectors indexed by the non-negative integers is called a{" "}
                        <strong>sequence</strong>. Common notation includes{" "}
                        <InlineMath math={"(x_n)"}/> or <InlineMath math={"\\{x_n\\}"}/>.
                    </p>}
                    ko={<p>
                        음이 아닌 정수로 첨자를 붙인 벡터들의 모임을 <strong>수열</strong>이라 한다. 흔히{" "}
                        <InlineMath math={"(x_n)"}/>이나 <InlineMath math={"\\{x_n\\}"}/>으로 적는다.
                    </p>}
                />
            </Definition>
            <Definition n="6.21" title={<T en={<>Convergence</>} ko={<>수렴</>}/>}>
                <T
                    en={<p>
                        A sequence of vectors <InlineMath math={"(x_n)"}/>{" "}
                        <strong>converges</strong> to <InlineMath math={"x \\in \\mathcal{X}"}/> if
                    </p>}
                    ko={<p>
                        벡터의 수열 <InlineMath math={"(x_n)"}/>이{" "}
                        <InlineMath math={"x \\in \\mathcal{X}"}/>로 <strong>수렴한다</strong>는 것은
                    </p>}
                />
                <BlockMath math={"\\forall\\, \\epsilon > 0,\\ \\exists\\, N(\\epsilon) < \\infty \\ \\text{ such that } \\ n \\ge N \\implies \\|x_n - x\\| < \\epsilon,"}/>
                <Terms items={[
                    ["\\epsilon", <T en={<>the tolerance. It is chosen first, and it is chosen by whoever is trying to break your claim</>}
                                     ko={<>허용 오차. 먼저 고르고, 당신의 주장을 깨려는 쪽이 고른다</>}/>],
                    ["N(\\epsilon)", <T en={<>the index past which the whole tail is inside the tolerance. It is allowed to depend on <InlineMath math={"\\epsilon"}/>, and the notation keeps that in view</>}
                                        ko={<>그 뒤로 꼬리 전체가 허용 오차 안에 들어오는 지수. <InlineMath math={"\\epsilon"}/>에 의존해도 되고, 이 표기가 그것을 눈에 두게 한다</>}/>],
                    ["< \\infty", <T en={<>the index must be a finite number. Saying "eventually" with an infinite <InlineMath math={"N"}/> would be no condition at all</>}
                                     ko={<>이 지수는 유한한 수여야 한다. <InlineMath math={"N"}/>이 무한한 채로 "언젠가"라고 말하는 것은 아무 조건도 아니다</>}/>],
                    ["n \\ge N", <T en={<>every term from <InlineMath math={"N"}/> on, not just one of them. A sequence that dips inside the band and leaves again has not converged</>}
                                    ko={<><InlineMath math={"N"}/>부터의 모든 항이지 그중 하나가 아니다. 띠 안에 들어왔다가 다시 나가는 수열은 수렴한 것이 아니다</>}/>],
                ]}/>
                <T
                    en={<p>
                        that is, <InlineMath math={"n \\ge N \\implies x_n \\in B_\\epsilon(x)"}/>. One
                        writes
                    </p>}
                    ko={<p>
                        즉 <InlineMath math={"n \\ge N \\implies x_n \\in B_\\epsilon(x)"}/>이다. 이것을
                        다음과 같이 적는다.
                    </p>}
                />
                <BlockMath math={"\\lim_{n \\to \\infty} x_n = x \\quad \\text{ or } \\quad x_n \\to x \\quad \\text{ or } \\quad x_n \\xrightarrow[n \\to \\infty]{} x."}/>
                <Terms items={[
                    ["\\lim", <T en={<>the limit. Proposition 6.22(c) below is what makes the definite article legitimate</>}
                                 ko={<>극한. 아래 명제 6.22(c)가 "그" 극한이라고 말할 수 있게 해 주는 근거다</>}/>],
                ]}/>
            </Definition>
            <CanvasFigure label={t("The epsilon game: pick a tolerance, answer with an index",
                "엡실론 게임: 허용 오차를 고르면 지수로 답한다")}
                          modal={<EpsilonGame width={780} height={470} defaultMode="sequence"/>}
                          bodyClassName="w-[min(92vw,920px)]">
                <EpsilonGame defaultMode="sequence"/>
            </CanvasFigure>
            <Remark n="6.23" title={<T en={<>The handy inequality</>} ko={<>쓸모 있는 부등식</>}/>}>
                <T
                    en={<p>
                        This one gets used constantly, so derive it once. For{" "}
                        <InlineMath math={"\\overline{x},\\, \\overline{y} \\in \\mathcal{X}"}/>, add and
                        subtract inside the norm and apply the triangle inequality:
                    </p>}
                    ko={<p>
                        이것은 계속 쓰이므로 한 번 유도해 둔다.{" "}
                        <InlineMath math={"\\overline{x},\\, \\overline{y} \\in \\mathcal{X}"}/>에 대해
                        norm 안에서 더하고 빼고 삼각부등식을 쓴다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} \\|\\overline{x}\\| &= \\|\\overline{x} - \\overline{y} + \\overline{y}\\| \\\\ &\\le \\|\\overline{x} - \\overline{y}\\| + \\|\\overline{y}\\| \\\\ \\implies \\|\\overline{x}\\| - \\|\\overline{y}\\| &\\le \\|\\overline{x} - \\overline{y}\\| \\end{aligned}"}/>
                <Terms items={[
                    ["\\overline{x} - \\overline{y} + \\overline{y}", <T en={<>adding zero in a useful form. This single trick generates most estimates in the chapter</>}
                                                                        ko={<>0을 쓸모 있는 꼴로 더한 것이다. 이 수 하나가 이 장의 평가 대부분을 만들어 낸다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The same argument with the roles swapped gives{" "}
                        <InlineMath math={"\\|\\overline{y}\\| - \\|\\overline{x}\\| \\le \\|\\overline{x} - \\overline{y}\\|"}/>,
                        and since the right side bounds both differences it bounds the absolute value:
                    </p>}
                    ko={<p>
                        역할을 바꿔 같은 논증을 하면{" "}
                        <InlineMath math={"\\|\\overline{y}\\| - \\|\\overline{x}\\| \\le \\|\\overline{x} - \\overline{y}\\|"}/>이
                        나오고, 오른쪽이 두 차이를 모두 위에서 누르므로 절댓값도 누른다.
                    </p>}
                />
                <BlockMath math={"\\boxed{\\ \\bigl|\\ \\|\\overline{x}\\| - \\|\\overline{y}\\|\\ \\bigr| \\le \\|\\overline{x} - \\overline{y}\\|.\\ }"}/>
                <Terms items={[
                    ["\\bigl|\\cdot\\bigr|", <T en={<>ordinary absolute value of a real number: the two norms are numbers, and their difference is a number</>}
                                                ko={<>실수의 보통 절댓값이다. 두 norm은 수이고 그 차이도 수다</>}/>],
                    ["\\text{reading}", <T en={<>lengths cannot differ by more than the distance between the vectors. Norm is a continuous function of its argument, which is exactly part (a) of the next proposition</>}
                                           ko={<>길이의 차이는 두 벡터 사이의 거리를 넘을 수 없다. norm이 인자에 대해 연속 함수라는 뜻이고, 그것이 바로 다음 명제의 (a)다</>}/>],
                ]}/>
            </Remark>
            <Proposition n="6.22" title={<T en={<>Three consequences of convergence</>} ko={<>수렴이 낳는 세 가지</>}/>}>
                <T
                    en={<p>Suppose <InlineMath math={"x_n \\to x"}/>. Then</p>}
                    ko={<p><InlineMath math={"x_n \\to x"}/>라 하자. 그러면</p>}
                />
                <T
                    en={<ol>
                        <li><InlineMath math={"\\|x_n\\| \\to \\|x\\|"}/>;</li>
                        <li><InlineMath math={"\\sup_n \\|x_n\\| < \\infty"}/> (the sequence is bounded);</li>
                        <li>if <InlineMath math={"x_n \\to y"}/> then{" "}
                            <InlineMath math={"y = x"}/> (limits are unique).</li>
                    </ol>}
                    ko={<ol>
                        <li><InlineMath math={"\\|x_n\\| \\to \\|x\\|"}/>이다.</li>
                        <li><InlineMath math={"\\sup_n \\|x_n\\| < \\infty"}/>이다 (수열이 유계다).</li>
                        <li><InlineMath math={"x_n \\to y"}/>이면 <InlineMath math={"y = x"}/>이다
                            (극한은 유일하다).</li>
                    </ol>}
                />
                <Proof>
                    <T
                        en={<p>
                            <strong>(a)</strong> By Remark 6.23 with{" "}
                            <InlineMath math={"\\overline{x} = x"}/> and{" "}
                            <InlineMath math={"\\overline{y} = x_n"}/>,
                        </p>}
                        ko={<p>
                            <strong>(a)</strong> 참고 6.23을{" "}
                            <InlineMath math={"\\overline{x} = x"}/>,{" "}
                            <InlineMath math={"\\overline{y} = x_n"}/>으로 쓰면
                        </p>}
                    />
                    <BlockMath math={"\\bigl|\\ \\|x\\| - \\|x_n\\|\\ \\bigr| \\le \\|x - x_n\\| \\xrightarrow[n \\to \\infty]{} 0."}/>
                    <Terms items={[
                        ["\\to 0", <T en={<>because <InlineMath math={"x_n \\to x"}/>. A non-negative quantity squeezed below something going to zero goes to zero</>}
                                      ko={<><InlineMath math={"x_n \\to x"}/>이기 때문이다. 0으로 가는 것 아래에 눌린 음이 아닌 양은 0으로 간다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>(b)</strong> Apply the definition with the specific choice{" "}
                            <InlineMath math={"\\epsilon = 1"}/>. There is{" "}
                            <InlineMath math={"N(1) < \\infty"}/> with{" "}
                            <InlineMath math={"n \\ge N \\implies \\|x_n - x\\| \\le 1"}/>. Hence for all{" "}
                            <InlineMath math={"n \\ge N"}/>,
                        </p>}
                        ko={<p>
                            <strong>(b)</strong> 정의를 특정한 선택{" "}
                            <InlineMath math={"\\epsilon = 1"}/>에 대해 쓴다.{" "}
                            <InlineMath math={"n \\ge N \\implies \\|x_n - x\\| \\le 1"}/>인{" "}
                            <InlineMath math={"N(1) < \\infty"}/>가 있다. 따라서 모든{" "}
                            <InlineMath math={"n \\ge N"}/>에 대해
                        </p>}
                    />
                    <BlockMath math={"\\|x_n\\| = \\|x_n - x + x\\| \\le \\|x_n - x\\| + \\|x\\| \\le 1 + \\|x\\|."}/>
                    <Terms items={[
                        ["1 + \\|x\\|", <T en={<>a bound for the tail. The tail is where infinitely many terms live, so bounding it is the only hard part</>}
                                           ko={<>꼬리의 한계. 무한히 많은 항이 사는 곳이 꼬리이므로, 그것을 누르는 것만이 어려운 부분이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The terms before <InlineMath math={"N"}/> are finitely many, and a finite set
                            of real numbers has a maximum, so
                        </p>}
                        ko={<p>
                            <InlineMath math={"N"}/> 앞의 항들은 유한히 많고 유한한 실수 집합에는 최댓값이
                            있으므로
                        </p>}
                    />
                    <BlockMath math={"\\sup_k \\|x_k\\| \\le \\max\\{\\, \\underbrace{\\|x_1\\|, \\|x_2\\|, \\cdots, \\|x_{N-1}\\|}_{\\text{finite}},\\ 1 + \\|x\\| \\,\\} < \\infty."}/>
                    <Terms items={[
                        ["\\max", <T en={<>a maximum over finitely many numbers, which always exists. This is the step that would fail for an infinite collection, and Chapter 1's supremum is what replaces it there</>}
                                     ko={<>유한히 많은 수에 대한 최댓값이고 언제나 존재한다. 무한한 모임에서는 이 단계가 깨지고, 그 자리를 1장의 supremum이 대신한다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>(c)</strong> Suppose both{" "}
                            <InlineMath math={"x_n \\to x"}/> and{" "}
                            <InlineMath math={"x_n \\to y"}/>. Then
                        </p>}
                        ko={<p>
                            <strong>(c)</strong> <InlineMath math={"x_n \\to x"}/>이면서{" "}
                            <InlineMath math={"x_n \\to y"}/>라 하자. 그러면
                        </p>}
                    />
                    <BlockMath math={"\\|x - y\\| = \\|x - x_n + x_n - y\\| \\le \\|x - x_n\\| + \\|x_n - y\\| \\xrightarrow[n \\to \\infty]{} 0."}/>
                    <Terms items={[
                        ["\\|x - y\\|", <T en={<>a fixed number that does not depend on <InlineMath math={"n"}/>. It is bounded above by something that goes to zero, so it must be <InlineMath math={"0"}/>, and norm axiom (a) then forces <InlineMath math={"x = y"}/></>}
                                           ko={<><InlineMath math={"n"}/>에 의존하지 않는 고정된 수다. 0으로 가는 것에 위에서 눌리므로 <InlineMath math={"0"}/>일 수밖에 없고, norm 공리 (a)가 <InlineMath math={"x = y"}/>를 강제한다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The trick in (c) is worth naming: <InlineMath math={"\\|x - y\\|"}/> is a
                            constant, and we showed it is smaller than every positive number. Only zero
                            has that property. Claim 6.44 will use the same move.
                        </p>}
                        ko={<p>
                            (c)의 수는 이름을 붙여 둘 값어치가 있다.{" "}
                            <InlineMath math={"\\|x - y\\|"}/>는 상수인데 그것이 모든 양수보다 작음을
                            보였다. 그런 성질을 갖는 것은 0뿐이다. 주장 6.44가 같은 수를 쓴다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Definition n="6.24" title={<T en={<>Limit point and isolated point</>} ko={<>극한점과 고립점</>}/>}>
                <T
                    en={<ol>
                        <li><InlineMath math={"x"}/> is a <strong>limit point</strong> of{" "}
                            <InlineMath math={"P"}/> if there exists a non-trivial sequence of elements
                            of <InlineMath math={"P"}/> converging to <InlineMath math={"x"}/>. That is,{" "}
                            <InlineMath math={"\\exists (x_n)"}/> with{" "}
                            <InlineMath math={"x_n \\in P"}/>,{" "}
                            <InlineMath math={"x_n \\ne x"}/> for all{" "}
                            <InlineMath math={"n \\ge 1"}/>, and{" "}
                            <InlineMath math={"\\lim_{n \\to \\infty} x_n = x"}/>. Non-trivial means you
                            may not build the sequence as <InlineMath math={"x_n = x"}/>.</li>
                        <li>If <InlineMath math={"x \\in P"}/> is not a limit point of{" "}
                            <InlineMath math={"P"}/>, then <InlineMath math={"x"}/> is called an{" "}
                            <strong>isolated point</strong> of <InlineMath math={"P"}/>.</li>
                    </ol>}
                    ko={<ol>
                        <li><InlineMath math={"P"}/>의 원소들로 이루어진 자명하지 않은 수열이{" "}
                            <InlineMath math={"x"}/>로 수렴하면 <InlineMath math={"x"}/>를{" "}
                            <InlineMath math={"P"}/>의 <strong>극한점</strong>이라 한다. 즉 모든{" "}
                            <InlineMath math={"n \\ge 1"}/>에 대해{" "}
                            <InlineMath math={"x_n \\in P"}/>,{" "}
                            <InlineMath math={"x_n \\ne x"}/>이고{" "}
                            <InlineMath math={"\\lim_{n \\to \\infty} x_n = x"}/>인{" "}
                            <InlineMath math={"(x_n)"}/>이 존재한다. 자명하지 않다는 것은 수열을{" "}
                            <InlineMath math={"x_n = x"}/>로 만들면 안 된다는 뜻이다.</li>
                        <li><InlineMath math={"x \\in P"}/>가 <InlineMath math={"P"}/>의 극한점이 아니면{" "}
                            <InlineMath math={"x"}/>를 <InlineMath math={"P"}/>의{" "}
                            <strong>고립점</strong>이라 한다.</li>
                    </ol>}
                />
                <T
                    en={<p>
                        The clause <InlineMath math={"x_n \\ne x"}/> is the whole definition. Without it
                        every point of <InlineMath math={"P"}/> would be a limit point, via the constant
                        sequence, and the notion would carry no information.
                    </p>}
                    ko={<p>
                        <InlineMath math={"x_n \\ne x"}/>라는 절이 이 정의의 전부다. 그것이 없으면 상수
                        수열을 통해 <InlineMath math={"P"}/>의 모든 점이 극한점이 되고, 이 개념은 아무
                        정보도 나르지 못한다.
                    </p>}
                />
            </Definition>
            <Example title={<T en={<>A set where every point is isolated</>} ko={<>모든 점이 고립점인 집합</>}/>}>
                <T
                    en={<p>
                        Take <InlineMath math={"P = \\{\\, 1/n \\mid n \\ge 1 \\,\\} \\subset \\mathbb{R}"}/>,
                        so <InlineMath math={"P = \\{1,\\ 0.5,\\ 0.333\\ldots,\\ 0.25,\\ 0.2,\\ \\ldots\\}"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"P = \\{\\, 1/n \\mid n \\ge 1 \\,\\} \\subset \\mathbb{R}"}/>을
                        보자.{" "}
                        <InlineMath math={"P = \\{1,\\ 0.5,\\ 0.333\\ldots,\\ 0.25,\\ 0.2,\\ \\ldots\\}"}/>이다.
                    </p>}
                />
                <T
                    en={<ul>
                        <li><strong>Every point of <InlineMath math={"P"}/> is isolated.</strong> The two
                            neighbours of <InlineMath math={"1/n"}/> are{" "}
                            <InlineMath math={"1/(n+1)"}/> and <InlineMath math={"1/(n-1)"}/>, and the
                            nearer gap is{" "}
                            <InlineMath math={"1/n - 1/(n+1) = 1/(n(n+1))"}/>, which is positive. At{" "}
                            <InlineMath math={"n = 3"}/> that gap is{" "}
                            <InlineMath math={"1/12 \\approx 0.0833"}/>, and at{" "}
                            <InlineMath math={"n = 10"}/> it is{" "}
                            <InlineMath math={"1/110 \\approx 0.00909"}/>. Small, but positive, so a ball
                            of that radius catches <InlineMath math={"1/n"}/> and nothing else of{" "}
                            <InlineMath math={"P"}/>.</li>
                        <li><strong><InlineMath math={"0"}/> is the only limit point</strong>, and it is
                            not in <InlineMath math={"P"}/>. The sequence{" "}
                            <InlineMath math={"x_n = 1/n"}/> lies in <InlineMath math={"P"}/>, is never{" "}
                            <InlineMath math={"0"}/>, and converges to <InlineMath math={"0"}/>.</li>
                        <li>Hence <InlineMath math={"\\overline{P} = P \\cup \\{0\\}"}/> and{" "}
                            <InlineMath math={"P"}/> is not closed. Adding one point closes it.</li>
                    </ul>}
                    ko={<ul>
                        <li><strong><InlineMath math={"P"}/>의 모든 점이 고립점이다.</strong>{" "}
                            <InlineMath math={"1/n"}/>의 두 이웃은{" "}
                            <InlineMath math={"1/(n+1)"}/>과 <InlineMath math={"1/(n-1)"}/>이고, 가까운
                            쪽 간격은{" "}
                            <InlineMath math={"1/n - 1/(n+1) = 1/(n(n+1))"}/>으로 양수다.{" "}
                            <InlineMath math={"n = 3"}/>에서 그 간격은{" "}
                            <InlineMath math={"1/12 \\approx 0.0833"}/>이고,{" "}
                            <InlineMath math={"n = 10"}/>에서는{" "}
                            <InlineMath math={"1/110 \\approx 0.00909"}/>다. 작지만 양수이므로 그 반지름의
                            공이 <InlineMath math={"1/n"}/>만 붙잡고 <InlineMath math={"P"}/>의 다른
                            것은 붙잡지 않는다.</li>
                        <li><strong><InlineMath math={"0"}/>이 유일한 극한점이고</strong>{" "}
                            <InlineMath math={"P"}/>에 속하지 않는다. 수열{" "}
                            <InlineMath math={"x_n = 1/n"}/>은 <InlineMath math={"P"}/> 안에 있고 결코{" "}
                            <InlineMath math={"0"}/>이 아니며 <InlineMath math={"0"}/>으로 수렴한다.</li>
                        <li>따라서 <InlineMath math={"\\overline{P} = P \\cup \\{0\\}"}/>이고{" "}
                            <InlineMath math={"P"}/>는 닫혀 있지 않다. 점 하나를 더하면 닫힌다.</li>
                    </ul>}
                />
                <T
                    en={<p>
                        This is the smallest example showing that "every point is isolated" and "the set
                        is closed" are unrelated. Isolation is about each point separately; closedness is
                        about points the set does not contain.
                    </p>}
                    ko={<p>
                        "모든 점이 고립점이다"와 "집합이 닫혔다"가 서로 무관함을 보이는 가장 작은
                        예다. 고립은 점 하나하나에 관한 것이고, 닫힘은 집합이 갖고 있지 않은 점에 관한
                        것이다.
                    </p>}
                />
            </Example>
            <Proposition n="6.25" title={<T en={<>Characterization of isolated points</>} ko={<>고립점의 특징</>}/>}>
                <T
                    en={<p>
                        <InlineMath math={"x"}/> is an isolated point of <InlineMath math={"P"}/> if, and
                        only if, there exists <InlineMath math={"\\epsilon > 0"}/> such that{" "}
                        <InlineMath math={"B_\\epsilon(x) \\cap P = \\{x\\}"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"x"}/>가 <InlineMath math={"P"}/>의 고립점인 것과{" "}
                        <InlineMath math={"B_\\epsilon(x) \\cap P = \\{x\\}"}/>인{" "}
                        <InlineMath math={"\\epsilon > 0"}/>이 존재하는 것은 동치다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            <strong>Suppose such an <InlineMath math={"\\epsilon"}/> exists.</strong> Let{" "}
                            <InlineMath math={"(x_n)"}/> be any sequence with{" "}
                            <InlineMath math={"x_n \\in P"}/> and{" "}
                            <InlineMath math={"x_n \\ne x"}/> for all{" "}
                            <InlineMath math={"n \\ge 1"}/>. Since{" "}
                            <InlineMath math={"x_n \\in P"}/> but{" "}
                            <InlineMath math={"x_n \\notin B_\\epsilon(x) \\cap P = \\{x\\}"}/>, we get{" "}
                            <InlineMath math={"x_n \\notin B_\\epsilon(x)"}/>, which is{" "}
                            <InlineMath math={"d(x_n, x) \\ge \\epsilon"}/> for every{" "}
                            <InlineMath math={"n"}/>. The tolerance <InlineMath math={"\\epsilon"}/> is
                            therefore never met and <InlineMath math={"x_n \\not\\to x"}/>. No
                            non-trivial sequence converges to <InlineMath math={"x"}/>, so{" "}
                            <InlineMath math={"x"}/> is not a limit point.
                        </p>}
                        ko={<p>
                            <strong>그런 <InlineMath math={"\\epsilon"}/>이 존재한다고 하자.</strong> 모든{" "}
                            <InlineMath math={"n \\ge 1"}/>에 대해{" "}
                            <InlineMath math={"x_n \\in P"}/>이고{" "}
                            <InlineMath math={"x_n \\ne x"}/>인 수열{" "}
                            <InlineMath math={"(x_n)"}/>을 아무거나 잡자.{" "}
                            <InlineMath math={"x_n \\in P"}/>인데{" "}
                            <InlineMath math={"x_n \\notin B_\\epsilon(x) \\cap P = \\{x\\}"}/>이므로{" "}
                            <InlineMath math={"x_n \\notin B_\\epsilon(x)"}/>이고, 이것은 모든{" "}
                            <InlineMath math={"n"}/>에서{" "}
                            <InlineMath math={"d(x_n, x) \\ge \\epsilon"}/>이라는 뜻이다. 그러니 허용 오차{" "}
                            <InlineMath math={"\\epsilon"}/>은 결코 충족되지 않고{" "}
                            <InlineMath math={"x_n \\not\\to x"}/>이다. 자명하지 않은 수열 중{" "}
                            <InlineMath math={"x"}/>로 수렴하는 것이 없으므로{" "}
                            <InlineMath math={"x"}/>는 극한점이 아니다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>Conversely, suppose no such <InlineMath math={"\\epsilon"}/> exists</strong>,
                            that is, <InlineMath math={"\\forall \\epsilon > 0"}/>,{" "}
                            <InlineMath math={"B_\\epsilon(x) \\cap P \\ne \\{x\\}"}/>. Apply this with
                            the specific choice <InlineMath math={"\\epsilon = 1/n"}/> for each{" "}
                            <InlineMath math={"n \\ge 1"}/>. Each time there is a point{" "}
                            <InlineMath math={"x_n \\ne x"}/> with{" "}
                            <InlineMath math={"x_n \\in B_{1/n}(x) \\cap P"}/>. This builds a sequence
                            with <InlineMath math={"x_n \\in P"}/>,{" "}
                            <InlineMath math={"x_n \\ne x"}/>, and{" "}
                            <InlineMath math={"\\|x_n - x\\| < 1/n \\to 0"}/>, so{" "}
                            <InlineMath math={"\\lim_{n \\to \\infty} x_n = x"}/>. Hence{" "}
                            <InlineMath math={"x"}/> satisfies every condition of a limit point.
                        </p>}
                        ko={<p>
                            <strong>거꾸로 그런 <InlineMath math={"\\epsilon"}/>이 없다고 하자.</strong> 즉
                            모든 <InlineMath math={"\\epsilon > 0"}/>에 대해{" "}
                            <InlineMath math={"B_\\epsilon(x) \\cap P \\ne \\{x\\}"}/>이다. 이것을 각{" "}
                            <InlineMath math={"n \\ge 1"}/>에 대해 특정한 선택{" "}
                            <InlineMath math={"\\epsilon = 1/n"}/>으로 쓴다. 매번{" "}
                            <InlineMath math={"x_n \\in B_{1/n}(x) \\cap P"}/>인{" "}
                            <InlineMath math={"x_n \\ne x"}/>가 있다. 이것이{" "}
                            <InlineMath math={"x_n \\in P"}/>,{" "}
                            <InlineMath math={"x_n \\ne x"}/>,{" "}
                            <InlineMath math={"\\|x_n - x\\| < 1/n \\to 0"}/>인 수열을 만들어 내므로{" "}
                            <InlineMath math={"\\lim_{n \\to \\infty} x_n = x"}/>이다. 따라서{" "}
                            <InlineMath math={"x"}/>는 극한점의 모든 조건을 만족한다.
                        </p>}
                    />
                    <T
                        en={<p>
                            The choice <InlineMath math={"\\epsilon = 1/n"}/> is the standard way to turn
                            a statement holding for all <InlineMath math={"\\epsilon"}/> into a single
                            sequence. It appears again in Proposition 6.27 and in the proof of the
                            Weierstrass theorem.
                        </p>}
                        ko={<p>
                            <InlineMath math={"\\epsilon = 1/n"}/>이라는 선택은 모든{" "}
                            <InlineMath math={"\\epsilon"}/>에 대해 성립하는 진술을 수열 하나로 바꾸는
                            표준적인 방법이다. 명제 6.27과 Weierstrass 정리의 증명에서 다시 나온다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Proposition n="6.27" title={<T en={<>Closure as isolated points plus limit points</>}
                                            ko={<>고립점과 극한점으로 본 closure</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"P_{\\text{iso}}"}/> be the collection of all isolated
                        points of <InlineMath math={"P"}/> and let{" "}
                        <InlineMath math={"P_\\infty"}/> be the collection of all limit points of{" "}
                        <InlineMath math={"P"}/>. Then
                    </p>}
                    ko={<p>
                        <InlineMath math={"P_{\\text{iso}}"}/>를 <InlineMath math={"P"}/>의 모든 고립점의
                        모임, <InlineMath math={"P_\\infty"}/>를 <InlineMath math={"P"}/>의 모든 극한점의
                        모임이라 하자. 그러면
                    </p>}
                />
                <BlockMath math={"\\overline{P} = P_{\\text{iso}} \\cup P_\\infty."}/>
                <Terms items={[
                    ["P_{\\text{iso}}", <T en={<>always a subset of <InlineMath math={"P"}/>, by definition</>}
                                           ko={<>정의에 따라 언제나 <InlineMath math={"P"}/>의 부분집합이다</>}/>],
                    ["P_\\infty", <T en={<>need <em>not</em> be a subset of <InlineMath math={"P"}/>. In the example above <InlineMath math={"P_\\infty = \\{0\\}"}/> while <InlineMath math={"0 \\notin P"}/></>}
                                     ko={<><InlineMath math={"P"}/>의 부분집합일 필요가 <em>없다</em>. 위 예제에서 <InlineMath math={"P_\\infty = \\{0\\}"}/>인데 <InlineMath math={"0 \\notin P"}/>였다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            <strong>Right to left.</strong> Suppose{" "}
                            <InlineMath math={"x"}/> is a limit point or an isolated point. Either way
                            there is a sequence with{" "}
                            <InlineMath math={"x_n \\in P"}/> and{" "}
                            <InlineMath math={"x_n \\to x"}/>: for a limit point that is the definition,
                            and for an isolated point take the constant sequence{" "}
                            <InlineMath math={"x_n = x"}/>, which is legal here because we are not
                            required to be non-trivial. Because{" "}
                            <InlineMath math={"x_n \\to x"}/>, for every{" "}
                            <InlineMath math={"\\epsilon > 0"}/> there is{" "}
                            <InlineMath math={"x_n \\in P"}/> with{" "}
                            <InlineMath math={"\\|x_n - x\\| < \\epsilon"}/>, which says{" "}
                            <InlineMath math={"d(x, P) = 0"}/>. Hence{" "}
                            <InlineMath math={"x \\in \\overline{P}"}/>.
                        </p>}
                        ko={<p>
                            <strong>오른쪽에서 왼쪽.</strong>{" "}
                            <InlineMath math={"x"}/>가 극한점이거나 고립점이라 하자. 어느 쪽이든{" "}
                            <InlineMath math={"x_n \\in P"}/>이고{" "}
                            <InlineMath math={"x_n \\to x"}/>인 수열이 있다. 극한점이면 그것이 정의이고,
                            고립점이면 상수 수열 <InlineMath math={"x_n = x"}/>를 잡으면 된다. 여기서는
                            자명하지 않을 것을 요구받지 않으므로 그래도 된다.{" "}
                            <InlineMath math={"x_n \\to x"}/>이므로 모든{" "}
                            <InlineMath math={"\\epsilon > 0"}/>에 대해{" "}
                            <InlineMath math={"\\|x_n - x\\| < \\epsilon"}/>인{" "}
                            <InlineMath math={"x_n \\in P"}/>가 있고, 그것이{" "}
                            <InlineMath math={"d(x, P) = 0"}/>이라는 말이다. 따라서{" "}
                            <InlineMath math={"x \\in \\overline{P}"}/>이다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>Left to right.</strong> Suppose{" "}
                            <InlineMath math={"x \\in \\overline{P}"}/>. Then{" "}
                            <InlineMath math={"d(x, P) = 0"}/>, so for all{" "}
                            <InlineMath math={"n \\ge 1"}/> we have{" "}
                            <InlineMath math={"B_{1/n}(x) \\cap P \\ne \\emptyset"}/>. Two cases are
                            possible. If for some finite <InlineMath math={"N"}/> and all{" "}
                            <InlineMath math={"n \\ge N"}/> we have{" "}
                            <InlineMath math={"B_{1/n}(x) \\cap P = \\{x\\}"}/>, then Proposition 6.25
                            applies and <InlineMath math={"x \\in P_{\\text{iso}}"}/>. Otherwise, for
                            every <InlineMath math={"n \\ge 1"}/> there exists{" "}
                            <InlineMath math={"x_n \\in B_{1/n}(x) \\cap P"}/> with{" "}
                            <InlineMath math={"x_n \\ne x"}/>, and that sequence establishes{" "}
                            <InlineMath math={"x \\in P_\\infty"}/>.
                        </p>}
                        ko={<p>
                            <strong>왼쪽에서 오른쪽.</strong>{" "}
                            <InlineMath math={"x \\in \\overline{P}"}/>라 하자. 그러면{" "}
                            <InlineMath math={"d(x, P) = 0"}/>이므로 모든{" "}
                            <InlineMath math={"n \\ge 1"}/>에 대해{" "}
                            <InlineMath math={"B_{1/n}(x) \\cap P \\ne \\emptyset"}/>이다. 두 경우가
                            가능하다. 어떤 유한한 <InlineMath math={"N"}/>이 있어 모든{" "}
                            <InlineMath math={"n \\ge N"}/>에서{" "}
                            <InlineMath math={"B_{1/n}(x) \\cap P = \\{x\\}"}/>라면 명제 6.25가 적용되어{" "}
                            <InlineMath math={"x \\in P_{\\text{iso}}"}/>다. 그렇지 않다면 모든{" "}
                            <InlineMath math={"n \\ge 1"}/>에 대해{" "}
                            <InlineMath math={"x_n \\ne x"}/>인{" "}
                            <InlineMath math={"x_n \\in B_{1/n}(x) \\cap P"}/>가 존재하고, 그 수열이{" "}
                            <InlineMath math={"x \\in P_\\infty"}/>임을 보인다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Corollary n="6.28" title={<T en={<>Closed means it contains its limit points</>}
                                          ko={<>닫힘은 극한점을 품는다는 뜻</>}/>}>
                <BlockMath math={"\\overline{P} = P \\iff P_\\infty \\subset P."}/>
                <Terms items={[
                    ["P_\\infty \\subset P", <T en={<>every limit of a sequence drawn from <InlineMath math={"P"}/> is again in <InlineMath math={"P"}/>. This is the working definition of closed for the rest of the chapter</>}
                                                ko={<><InlineMath math={"P"}/>에서 뽑은 수열의 극한이 모두 다시 <InlineMath math={"P"}/>에 있다는 뜻이다. 이 장의 나머지에서 닫힘의 실질적 정의는 이것이다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            By definition <InlineMath math={"P_{\\text{iso}} \\subset P"}/>. Hence if{" "}
                            <InlineMath math={"P_\\infty \\subset P"}/> then{" "}
                            <InlineMath math={"P_{\\text{iso}} \\cup P_\\infty \\subset P"}/>, which by
                            Proposition 6.27 says <InlineMath math={"\\overline{P} \\subset P"}/>, and
                            since <InlineMath math={"P \\subset \\overline{P}"}/> always holds,{" "}
                            <InlineMath math={"P"}/> is closed. For the other direction, if{" "}
                            <InlineMath math={"P"}/> is closed then{" "}
                            <InlineMath math={"P_\\infty \\subset \\overline{P} = P"}/>.
                        </p>}
                        ko={<p>
                            정의에 따라 <InlineMath math={"P_{\\text{iso}} \\subset P"}/>이다. 따라서{" "}
                            <InlineMath math={"P_\\infty \\subset P"}/>이면{" "}
                            <InlineMath math={"P_{\\text{iso}} \\cup P_\\infty \\subset P"}/>이고, 명제
                            6.27에 따라 그것은{" "}
                            <InlineMath math={"\\overline{P} \\subset P"}/>라는 말이며,{" "}
                            <InlineMath math={"P \\subset \\overline{P}"}/>가 항상 성립하므로{" "}
                            <InlineMath math={"P"}/>는 닫혔다. 반대 방향으로,{" "}
                            <InlineMath math={"P"}/>가 닫혔다면{" "}
                            <InlineMath math={"P_\\infty \\subset \\overline{P} = P"}/>이다.
                        </p>}
                    />
                </Proof>
                <T
                    en={<p>
                        This is the bridge the chapter needed. Closedness was defined with distances, and
                        it has just been re-expressed with sequences. From here on, "the limit stays in
                        the set" and "the set is closed" are interchangeable, and that is what makes
                        closedness usable in a convergence argument.
                    </p>}
                    ko={<p>
                        이 장에 필요했던 다리가 이것이다. 닫힘은 거리로 정의되었는데 방금 수열로 다시
                        표현되었다. 이제부터 "극한이 집합 안에 머문다"와 "집합이 닫혔다"는 서로 바꿔 쓸 수
                        있고, 그래서 닫힘을 수렴 논증에 쓸 수 있게 된다.
                    </p>}
                />
            </Corollary>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Cauchy Sequences and Completeness</h2>} ko={<h2>Cauchy 수열과 완비성</h2>}/>
            <T
                en={<p>
                    Definition 6.21 has a practical defect: to check it you must already have a guess for
                    the limit. For the Newton iteration on the previous page that is exactly what you do
                    not have, since the limit is the root you are looking for. Augustin-Louis Cauchy
                    proposed a condition that removes the limit from the statement, comparing the terms
                    to each other instead.
                </p>}
                ko={<p>
                    정의 6.21에는 실용적인 결함이 있다. 확인하려면 극한에 대한 추측을 이미 갖고 있어야
                    한다. 앞 페이지의 Newton 반복에서는 바로 그것이 없다. 극한이 곧 찾고 있는 근이기
                    때문이다. Augustin-Louis Cauchy는 진술에서 극한을 빼고 대신 항들을 서로에게 견주는
                    조건을 제안했다.
                </p>}
            />
            <Definition n="6.29" title={<T en={<>Cauchy sequence</>} ko={<>Cauchy 수열</>}/>}>
                <T
                    en={<p>A sequence <InlineMath math={"(x_n)"}/> is <strong>Cauchy</strong> if</p>}
                    ko={<p>수열 <InlineMath math={"(x_n)"}/>이 <strong>Cauchy</strong>라는 것은</p>}
                />
                <BlockMath math={"\\forall\\, \\epsilon > 0,\\ \\exists\\, N(\\epsilon) < \\infty \\ \\text{ such that } \\ n \\ge N \\text{ and } m \\ge N \\implies \\|x_n - x_m\\| < \\epsilon."}/>
                <Terms items={[
                    ["\\|x_n - x_m\\|", <T en={<>the distance between two <em>terms</em>. No limit appears anywhere in this statement, which is the entire reason for the definition</>}
                                           ko={<>두 <em>항</em> 사이의 거리. 이 진술 어디에도 극한이 나오지 않고, 그것이 이 정의의 존재 이유 전부다</>}/>],
                    ["n, m \\ge N", <T en={<>both indices past <InlineMath math={"N"}/>, and independently so. Requiring only <InlineMath math={"\\|x_{n+1} - x_n\\| \\to 0"}/> is strictly weaker and does not imply Cauchy: the partial sums of the harmonic series satisfy it and march off to infinity</>}
                                       ko={<>두 지수 모두 <InlineMath math={"N"}/> 뒤에 있고, 서로 독립적으로 그렇다. <InlineMath math={"\\|x_{n+1} - x_n\\| \\to 0"}/>만 요구하는 것은 진짜로 더 약하고 Cauchy를 함의하지 않는다. 조화급수의 부분합이 그것을 만족하면서 무한대로 행진한다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Notation 6.30 writes this as{" "}
                        <InlineMath math={"\\|x_n - x_m\\| \\xrightarrow[n,\\, m \\to \\infty]{} 0"}/>.
                    </p>}
                    ko={<p>
                        기호 6.30은 이것을{" "}
                        <InlineMath math={"\\|x_n - x_m\\| \\xrightarrow[n,\\, m \\to \\infty]{} 0"}/>으로
                        적는다.
                    </p>}
                />
            </Definition>
            <Lemma n="6.31" title={<T en={<>Geometrically shrinking steps give a Cauchy sequence</>}
                                      ko={<>기하적으로 줄어드는 걸음은 Cauchy 수열을 만든다</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"0 \\le c < 1"}/> and let{" "}
                        <InlineMath math={"(a_n)"}/> be a sequence of real numbers satisfying, for all{" "}
                        <InlineMath math={"n \\ge 1"}/>,
                    </p>}
                    ko={<p>
                        <InlineMath math={"0 \\le c < 1"}/>이고 실수열{" "}
                        <InlineMath math={"(a_n)"}/>이 모든{" "}
                        <InlineMath math={"n \\ge 1"}/>에 대해 다음을 만족한다고 하자.
                    </p>}
                />
                <BlockMath math={"|a_{n+1} - a_n| \\le c\\,|a_n - a_{n-1}|."}/>
                <Terms items={[
                    ["c", <T en={<>the shrink factor. Each step is at most <InlineMath math={"c"}/> times the previous step, so steps decay geometrically</>}
                             ko={<>줄어드는 비율. 각 걸음이 앞 걸음의 <InlineMath math={"c"}/>배 이하이므로 걸음이 기하적으로 줄어든다</>}/>],
                    ["c < 1", <T en={<>strict. At <InlineMath math={"c = 1"}/> the steps need not shrink at all and the conclusion is false</>}
                                 ko={<>강부등호다. <InlineMath math={"c = 1"}/>이면 걸음이 전혀 줄지 않아도 되고 결론은 거짓이 된다</>}/>],
                ]}/>
                <T
                    en={<p>Then <InlineMath math={"(a_n)"}/> is Cauchy in{" "}
                        <InlineMath math={"(\\mathbb{R}, |\\bullet|)"}/>.</p>}
                    ko={<p>그러면 <InlineMath math={"(a_n)"}/>은{" "}
                        <InlineMath math={"(\\mathbb{R}, |\\bullet|)"}/>에서 Cauchy다.</p>}
                />
                <Proof>
                    <T
                        en={<p>
                            <strong>Step 1.</strong> For all{" "}
                            <InlineMath math={"n \\ge 1"}/>,{" "}
                            <InlineMath math={"|a_{n+1} - a_n| \\le c^n |a_1 - a_0|"}/>. Observe{" "}
                            <InlineMath math={"|a_2 - a_1| \\le c|a_1 - a_0|"}/> and{" "}
                            <InlineMath math={"|a_3 - a_2| \\le c|a_2 - a_1| \\le c^2 |a_1 - a_0|"}/>,
                            then finish by induction: assuming the claim at{" "}
                            <InlineMath math={"n"}/>, the hypothesis gives{" "}
                            <InlineMath math={"|a_{n+2} - a_{n+1}| \\le c|a_{n+1} - a_n| \\le c^{n+1}|a_1 - a_0|"}/>.
                        </p>}
                        ko={<p>
                            <strong>1단계.</strong> 모든{" "}
                            <InlineMath math={"n \\ge 1"}/>에 대해{" "}
                            <InlineMath math={"|a_{n+1} - a_n| \\le c^n |a_1 - a_0|"}/>이다.{" "}
                            <InlineMath math={"|a_2 - a_1| \\le c|a_1 - a_0|"}/>이고{" "}
                            <InlineMath math={"|a_3 - a_2| \\le c|a_2 - a_1| \\le c^2 |a_1 - a_0|"}/>임을
                            보고, 귀납법으로 마무리한다. <InlineMath math={"n"}/>에서 주장을 가정하면
                            가설이{" "}
                            <InlineMath math={"|a_{n+2} - a_{n+1}| \\le c|a_{n+1} - a_n| \\le c^{n+1}|a_1 - a_0|"}/>을
                            준다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>Step 2.</strong> For all{" "}
                            <InlineMath math={"n \\ge 1"}/> and{" "}
                            <InlineMath math={"k \\ge 1"}/>, telescope and then sum the geometric series.
                        </p>}
                        ko={<p>
                            <strong>2단계.</strong> 모든{" "}
                            <InlineMath math={"n \\ge 1"}/>,{" "}
                            <InlineMath math={"k \\ge 1"}/>에 대해 망원경처럼 펼친 뒤 기하급수를 더한다.
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} |a_{n+k} - a_n| &= |a_{n+k} - a_{n+k-1} + a_{n+k-1} - \\cdots + a_{n+1} - a_n| \\\\ &\\le |a_{n+k} - a_{n+k-1}| + \\cdots + |a_{n+1} - a_n| \\\\ &\\le \\left( c^{n+k-1} + c^{n+k-2} + \\cdots + c^n \\right) |a_1 - a_0| \\\\ &= c^n \\left( \\sum_{i=0}^{k-1} c^i \\right) |a_1 - a_0| \\\\ &\\le c^n \\left( \\sum_{i=0}^{\\infty} c^i \\right) |a_1 - a_0| \\\\ &= \\frac{c^n}{1 - c}\\,|a_1 - a_0| \\end{aligned}"}/>
                    <Terms items={[
                        ["\\text{line 1}", <T en={<>adding and subtracting every intermediate term. Nothing has been assumed yet, this is an identity</>}
                                              ko={<>중간 항을 모두 더하고 뺀 것이다. 아직 아무것도 가정하지 않았고 이것은 항등식이다</>}/>],
                        ["\\text{line 2}", <T en={<>the triangle inequality applied <InlineMath math={"k-1"}/> times</>}
                                              ko={<>삼각부등식을 <InlineMath math={"k-1"}/>번 쓴 것</>}/>],
                        ["\\text{line 5}", <T en={<>extending a finite sum of non-negative terms to an infinite one can only increase it, and this is what removes <InlineMath math={"k"}/> from the bound</>}
                                              ko={<>음이 아닌 항들의 유한 합을 무한 합으로 늘리면 커지기만 한다. 이것이 한계에서 <InlineMath math={"k"}/>를 없애는 단계다</>}/>],
                        ["\\frac{1}{1-c}", <T en={<>the geometric series sum, valid precisely because <InlineMath math={"c < 1"}/>. At <InlineMath math={"c = 1"}/> it is undefined, which is where the hypothesis is spent</>}
                                              ko={<>기하급수의 합이고, 정확히 <InlineMath math={"c < 1"}/>이기 때문에 성립한다. <InlineMath math={"c = 1"}/>에서는 정의되지 않고, 가설이 쓰이는 자리가 여기다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>Step 3.</strong> Consider{" "}
                            <InlineMath math={"m"}/> and <InlineMath math={"n"}/>, and without loss of
                            generality suppose <InlineMath math={"m \\ge n"}/>. If{" "}
                            <InlineMath math={"m = n"}/> then{" "}
                            <InlineMath math={"|a_m - a_n| = 0"}/>, so assume{" "}
                            <InlineMath math={"m = n + k"}/> for some{" "}
                            <InlineMath math={"k \\ge 1"}/>. Then
                        </p>}
                        ko={<p>
                            <strong>3단계.</strong>{" "}
                            <InlineMath math={"m"}/>과 <InlineMath math={"n"}/>을 놓고, 일반성을 잃지 않고{" "}
                            <InlineMath math={"m \\ge n"}/>이라 하자.{" "}
                            <InlineMath math={"m = n"}/>이면{" "}
                            <InlineMath math={"|a_m - a_n| = 0"}/>이므로, 어떤{" "}
                            <InlineMath math={"k \\ge 1"}/>에 대해{" "}
                            <InlineMath math={"m = n + k"}/>라 하자. 그러면
                        </p>}
                    />
                    <BlockMath math={"|a_m - a_n| = |a_{n+k} - a_n| \\le \\frac{c^n}{1 - c}\\,|a_1 - a_0| \\xrightarrow[n \\to \\infty]{} 0,"}/>
                    <Terms items={[
                        ["c^n \\to 0", <T en={<>because <InlineMath math={"0 \\le c < 1"}/>. The bound depends on <InlineMath math={"n"}/> alone, not on <InlineMath math={"k"}/>, so one <InlineMath math={"N"}/> works for all pairs at once, which is what Definition 6.29 demands</>}
                                          ko={<><InlineMath math={"0 \\le c < 1"}/>이기 때문이다. 이 한계는 <InlineMath math={"k"}/>가 아니라 <InlineMath math={"n"}/>에만 의존하므로 하나의 <InlineMath math={"N"}/>이 모든 쌍에 한꺼번에 통한다. 정의 6.29가 요구하는 것이 그것이다</>}/>],
                    ]}/>
                    <T
                        en={<p>and thus <InlineMath math={"(a_n)"}/> is Cauchy.</p>}
                        ko={<p>따라서 <InlineMath math={"(a_n)"}/>은 Cauchy다.</p>}
                    />
                </Proof>
            </Lemma>
            <Proposition n="6.32" title={<T en={<>Convergent implies Cauchy</>} ko={<>수렴하면 Cauchy다</>}/>}>
                <T
                    en={<p>If <InlineMath math={"x_n \\to x"}/>, then{" "}
                        <InlineMath math={"(x_n)"}/> is Cauchy.</p>}
                    ko={<p><InlineMath math={"x_n \\to x"}/>이면{" "}
                        <InlineMath math={"(x_n)"}/>은 Cauchy다.</p>}
                />
                <Proof>
                    <T
                        en={<p>
                            If <InlineMath math={"x_n \\to x"}/> then for every{" "}
                            <InlineMath math={"\\epsilon > 0"}/> there is{" "}
                            <InlineMath math={"N < \\infty"}/> such that{" "}
                            <InlineMath math={"n \\ge N \\implies \\|x_n - x\\| < \\epsilon/2"}/>. Apply
                            the definition with the tolerance{" "}
                            <InlineMath math={"\\epsilon/2"}/> rather than{" "}
                            <InlineMath math={"\\epsilon"}/>, which is legal because the definition holds
                            for <em>every</em> positive number. Then for{" "}
                            <InlineMath math={"n, m \\ge N"}/>,
                        </p>}
                        ko={<p>
                            <InlineMath math={"x_n \\to x"}/>이면 모든{" "}
                            <InlineMath math={"\\epsilon > 0"}/>에 대해{" "}
                            <InlineMath math={"n \\ge N \\implies \\|x_n - x\\| < \\epsilon/2"}/>인{" "}
                            <InlineMath math={"N < \\infty"}/>가 있다. 정의를{" "}
                            <InlineMath math={"\\epsilon"}/>이 아니라 허용 오차{" "}
                            <InlineMath math={"\\epsilon/2"}/>에 대해 쓴 것인데, 정의가{" "}
                            <em>모든</em> 양수에 대해 성립하므로 그래도 된다. 그러면{" "}
                            <InlineMath math={"n, m \\ge N"}/>에 대해
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} \\|x_n - x_m\\| &= \\|x_n - x + x - x_m\\| \\\\ &\\le \\|x_n - x\\| + \\|x - x_m\\| \\\\ &< \\frac{\\epsilon}{2} + \\frac{\\epsilon}{2} = \\epsilon \\end{aligned}"}/>
                    <Terms items={[
                        ["\\epsilon/2", <T en={<>the standard bookkeeping: two errors are each allowed half the budget so that together they fit. Nothing deep, but it is why the proof reads cleanly</>}
                                           ko={<>표준적인 장부 정리다. 오차 둘에 각각 예산의 절반을 주어 합쳐서 들어맞게 한다. 깊은 것은 없지만 증명이 깔끔하게 읽히는 이유다</>}/>],
                        ["x - x_m", <T en={<>the limit acts as a waypoint. It is used inside the proof and has vanished from the conclusion, which is exactly the trade the definition was designed for</>}
                                       ko={<>극한이 경유지 노릇을 한다. 증명 안에서 쓰이고 결론에서는 사라졌다. 이 정의가 노린 거래가 정확히 이것이다</>}/>],
                    ]}/>
                    <T
                        en={<p>for all <InlineMath math={"n, m \\ge N"}/>, so{" "}
                            <InlineMath math={"(x_n)"}/> is Cauchy.</p>}
                        ko={<p>이 성립하므로 <InlineMath math={"(x_n)"}/>은 Cauchy다.</p>}
                    />
                </Proof>
            </Proposition>
            <T
                en={<p>
                    The converse is where it gets interesting. Not all Cauchy sequences converge, and the
                    reason is not a defect in the sequence but a defect in the space it lives in.
                </p>}
                ko={<p>
                    역이 흥미로워지는 지점이다. 모든 Cauchy 수열이 수렴하지는 않고, 그 이유는 수열의
                    결함이 아니라 그 수열이 사는 공간의 결함이다.
                </p>}
            />
            <CanvasFigure label={t("Three Cauchy sequences, two of which have nowhere to land",
                "Cauchy 수열 셋, 그중 둘은 내려앉을 곳이 없다")}
                          modal={<CauchyCompleteness width={780} height={480}/>}
                          bodyClassName="w-[min(92vw,920px)]">
                <CauchyCompleteness/>
            </CanvasFigure>
            <Example title={<T en={<>The rationals have holes</>} ko={<>유리수에는 구멍이 있다</>}/>}>
                <T
                    en={<p>
                        Work in <InlineMath math={"(\\mathbb{Q}, |\\bullet|)"}/>, the rationals with the
                        usual absolute value, which is a perfectly good normed space over{" "}
                        <InlineMath math={"\\mathbb{Q}"}/>. Define{" "}
                        <InlineMath math={"x_k"}/> to be the decimal expansion of{" "}
                        <InlineMath math={"\\sqrt{2}"}/> truncated after{" "}
                        <InlineMath math={"k"}/> places:
                    </p>}
                    ko={<p>
                        보통의 절댓값을 가진 유리수{" "}
                        <InlineMath math={"(\\mathbb{Q}, |\\bullet|)"}/>에서 보자.{" "}
                        <InlineMath math={"\\mathbb{Q}"}/> 위의 훌륭한 normed space다.{" "}
                        <InlineMath math={"x_k"}/>를 <InlineMath math={"\\sqrt{2}"}/>의 소수 전개를{" "}
                        <InlineMath math={"k"}/>자리에서 자른 것으로 정의한다.
                    </p>}
                />
                <BlockMath math={"x_k = \\frac{\\lfloor 10^k \\sqrt{2} \\rfloor}{10^k} : \\quad 1,\\ \\frac{7}{5},\\ \\frac{141}{100},\\ \\frac{707}{500},\\ \\frac{7071}{5000},\\ \\frac{141421}{100000},\\ \\ldots"}/>
                <Terms items={[
                    ["\\lfloor \\cdot \\rfloor", <T en={<>the floor. Every term is an integer over a power of ten, so every term is unambiguously rational</>}
                                                    ko={<>바닥 함수. 모든 항이 정수를 10의 거듭제곱으로 나눈 것이므로 모든 항이 의심의 여지 없이 유리수다</>}/>],
                    ["x_k", <T en={<>the <InlineMath math={"k"}/>-th truncation, and the sequence lives entirely inside <InlineMath math={"\\mathbb{Q}"}/></>}
                               ko={<><InlineMath math={"k"}/>번째 절단이고, 이 수열은 통째로 <InlineMath math={"\\mathbb{Q}"}/> 안에 산다</>}/>],
                ]}/>
                <T
                    en={<p>
                        It is Cauchy: two truncations agreeing to{" "}
                        <InlineMath math={"\\min(n, m)"}/> places differ by at most{" "}
                        <InlineMath math={"10^{-\\min(n,m)}"}/>, so given{" "}
                        <InlineMath math={"\\epsilon > 0"}/> take{" "}
                        <InlineMath math={"N"}/> with{" "}
                        <InlineMath math={"10^{-N} < \\epsilon"}/>. The bound holds for every pair drawn
                        from the first ten terms, checked directly. Yet by Chapter 1 there is no rational
                        whose square is <InlineMath math={"2"}/>, and each term brackets that missing
                        point from below and above:
                    </p>}
                    ko={<p>
                        이것은 Cauchy다. <InlineMath math={"\\min(n, m)"}/>자리까지 같은 두 절단은 차이가
                        많아야 <InlineMath math={"10^{-\\min(n,m)}"}/>이므로,{" "}
                        <InlineMath math={"\\epsilon > 0"}/>이 주어지면{" "}
                        <InlineMath math={"10^{-N} < \\epsilon"}/>인{" "}
                        <InlineMath math={"N"}/>을 잡으면 된다. 이 한계는 처음 열 항에서 뽑은 모든 쌍에
                        대해 직접 확인했다. 그런데 1장에 따르면 제곱해서{" "}
                        <InlineMath math={"2"}/>가 되는 유리수는 없고, 각 항이 그 빠진 점을 아래위로
                        조인다.
                    </p>}
                />
                <BlockMath math={"x_k^2 < 2 < \\left( x_k + 10^{-k} \\right)^2 \\qquad \\text{for every } k."}/>
                <Terms items={[
                    ["x_k^2 < 2", <T en={<>strict, because equality would make <InlineMath math={"x_k"}/> a rational square root of <InlineMath math={"2"}/>. At <InlineMath math={"k = 7"}/> the two sides are <InlineMath math={"1.99999982"}/> and <InlineMath math={"2.00000011"}/></>}
                                     ko={<>강부등호다. 등호가 되면 <InlineMath math={"x_k"}/>가 <InlineMath math={"2"}/>의 유리수 제곱근이 되기 때문이다. <InlineMath math={"k = 7"}/>에서 두 값은 <InlineMath math={"1.99999982"}/>와 <InlineMath math={"2.00000011"}/>이다</>}/>],
                    ["10^{-k}", <T en={<>the width of the bracket, going to zero. The sequence is squeezing onto a point that <InlineMath math={"\\mathbb{Q}"}/> does not contain</>}
                                   ko={<>조임 구간의 폭이고 0으로 간다. 수열은 <InlineMath math={"\\mathbb{Q}"}/>가 갖고 있지 않은 점 하나로 조여들고 있다</>}/>],
                ]}/>
                <T
                    en={<p>
                        So <InlineMath math={"(x_k)"}/> is Cauchy in{" "}
                        <InlineMath math={"\\mathbb{Q}"}/> and has no limit in{" "}
                        <InlineMath math={"\\mathbb{Q}"}/>. This is the payoff of Chapter 1's section on
                        upper bounds. The least upper bound property was stated there as an axiom
                        distinguishing <InlineMath math={"\\mathbb{R}"}/> from{" "}
                        <InlineMath math={"\\mathbb{Q}"}/>, and it looked like a technicality. Here is
                        what it buys: <InlineMath math={"\\sup\\{q \\in \\mathbb{Q} : q^2 < 2\\}"}/> is
                        the point this sequence is heading for, it exists in{" "}
                        <InlineMath math={"\\mathbb{R}"}/>, and it does not exist in{" "}
                        <InlineMath math={"\\mathbb{Q}"}/>. Completeness and the least upper bound
                        property are two ways of saying the real line has no gaps.
                    </p>}
                    ko={<p>
                        그러므로 <InlineMath math={"(x_k)"}/>는{" "}
                        <InlineMath math={"\\mathbb{Q}"}/>에서 Cauchy이면서{" "}
                        <InlineMath math={"\\mathbb{Q}"}/> 안에 극한이 없다. 1장의 upper bound 절이
                        여기서 결실을 맺는다. least upper bound 성질은 거기서{" "}
                        <InlineMath math={"\\mathbb{R}"}/>을 <InlineMath math={"\\mathbb{Q}"}/>와
                        구별하는 공리로 진술되었고, 형식적인 것처럼 보였다. 그것이 사 주는 것이 이것이다.{" "}
                        <InlineMath math={"\\sup\\{q \\in \\mathbb{Q} : q^2 < 2\\}"}/>가 이 수열이 향하는
                        점이고, <InlineMath math={"\\mathbb{R}"}/>에는 존재하며{" "}
                        <InlineMath math={"\\mathbb{Q}"}/>에는 존재하지 않는다. 완비성과 least upper
                        bound 성질은 실수 직선에 틈이 없다는 말의 두 가지 표현이다.
                    </p>}
                />
            </Example>
            <Example n="6.33" title={<T en={<>A Cauchy sequence of continuous functions with no continuous limit</>}
                                        ko={<>연속 극한이 없는 연속 함수의 Cauchy 수열</>}/>}>
                <T
                    en={<p>
                        The rationals example is the intuition; this is the notes' own example, and it
                        matters because it happens in a space you would actually use. Let{" "}
                        <InlineMath math={"\\mathcal{X} := \\{\\, f : [0,1] \\to \\mathbb{R} \\mid f \\text{ is continuous} \\,\\}"}/>{" "}
                        with the one-norm{" "}
                        <InlineMath math={"\\|f\\|_1 := \\int_0^1 |f(\\tau)|\\, d\\tau"}/>. Define, for{" "}
                        <InlineMath math={"n \\ge 2"}/>, a sequence of piecewise linear functions:
                    </p>}
                    ko={<p>
                        유리수 예제가 직관이고, 이것은 교재 자신의 예제다. 실제로 쓸 법한 공간에서
                        일어나기 때문에 중요하다.{" "}
                        <InlineMath math={"\\|f\\|_1 := \\int_0^1 |f(\\tau)|\\, d\\tau"}/>인 one-norm을 준{" "}
                        <InlineMath math={"\\mathcal{X} := \\{\\, f : [0,1] \\to \\mathbb{R} \\mid f \\text{ is continuous} \\,\\}"}/>를
                        놓자. <InlineMath math={"n \\ge 2"}/>에 대해 조각마다 선형인 함수열을 정의한다.
                    </p>}
                />
                <BlockMath math={"f_n(t) = \\begin{cases} 0 & 0 \\le t \\le \\tfrac{1}{2} - \\tfrac{1}{n} \\\\[3pt] 1 + n\\left(t - \\tfrac{1}{2}\\right) & \\tfrac{1}{2} - \\tfrac{1}{n} \\le t \\le \\tfrac{1}{2} \\\\[3pt] 1 & t \\ge \\tfrac{1}{2} \\end{cases}"}/>
                <Terms items={[
                    ["n", <T en={<>the steepness. The ramp climbs from <InlineMath math={"0"}/> to <InlineMath math={"1"}/> over a window of width <InlineMath math={"1/n"}/>, so larger <InlineMath math={"n"}/> means a sharper rise</>}
                             ko={<>가파름. 경사가 폭 <InlineMath math={"1/n"}/>인 창에서 <InlineMath math={"0"}/>에서 <InlineMath math={"1"}/>로 올라가므로, <InlineMath math={"n"}/>이 클수록 급하게 선다</>}/>],
                    ["\\text{breakpoints}", <T en={<>at <InlineMath math={"t = \\tfrac{1}{2} - \\tfrac{1}{n}"}/> both formulas give <InlineMath math={"0"}/>, and at <InlineMath math={"t = \\tfrac{1}{2}"}/> both give <InlineMath math={"1"}/>, so each <InlineMath math={"f_n"}/> really is continuous and really is in <InlineMath math={"\\mathcal{X}"}/></>}
                                               ko={<><InlineMath math={"t = \\tfrac{1}{2} - \\tfrac{1}{n}"}/>에서 두 식이 모두 <InlineMath math={"0"}/>을 주고 <InlineMath math={"t = \\tfrac{1}{2}"}/>에서 모두 <InlineMath math={"1"}/>을 주므로, 각 <InlineMath math={"f_n"}/>은 정말로 연속이고 정말로 <InlineMath math={"\\mathcal{X}"}/>에 속한다</>}/>],
                ]}/>
                <T
                    en={<p>
                        <strong>The sequence is Cauchy.</strong> For{" "}
                        <InlineMath math={"m < n"}/> the function{" "}
                        <InlineMath math={"f_m"}/> starts rising earlier, so{" "}
                        <InlineMath math={"f_m \\ge f_n"}/> everywhere and the integral of the difference
                        is the difference of two triangles, each with height{" "}
                        <InlineMath math={"1"}/> and base the width of its ramp:
                    </p>}
                    ko={<p>
                        <strong>이 수열은 Cauchy다.</strong>{" "}
                        <InlineMath math={"m < n"}/>이면 <InlineMath math={"f_m"}/>이 더 일찍 올라가기
                        시작하므로 어디서나 <InlineMath math={"f_m \\ge f_n"}/>이고, 차이의 적분은 삼각형
                        둘의 차이다. 각 삼각형의 높이는 <InlineMath math={"1"}/>이고 밑변은 그 경사의
                        폭이다.
                    </p>}
                />
                <BlockMath math={"\\|f_n - f_m\\|_1 = \\frac{1}{2}\\cdot\\frac{1}{m} - \\frac{1}{2}\\cdot\\frac{1}{n} = \\frac{1}{2}\\left| \\frac{1}{n} - \\frac{1}{m} \\right| \\xrightarrow[n,\\, m \\to \\infty]{} 0"}/>
                <Terms items={[
                    ["\\tfrac{1}{2}\\cdot\\tfrac{1}{m}", <T en={<>area of a triangle with base <InlineMath math={"1/m"}/> and height <InlineMath math={"1"}/>. Numerically <InlineMath math={"\\|f_2 - f_3\\|_1 = 0.08333"}/> and <InlineMath math={"\\|f_{10} - f_{1000}\\|_1 = 0.0495"}/>, both matching the formula</>}
                                                            ko={<>밑변 <InlineMath math={"1/m"}/>, 높이 <InlineMath math={"1"}/>인 삼각형의 넓이. 수치로 <InlineMath math={"\\|f_2 - f_3\\|_1 = 0.08333"}/>, <InlineMath math={"\\|f_{10} - f_{1000}\\|_1 = 0.0495"}/>이고 둘 다 공식과 맞는다</>}/>],
                ]}/>
                <T
                    en={<p>
                        <strong>It has no limit in <InlineMath math={"\\mathcal{X}"}/>.</strong> Define
                        the step function
                    </p>}
                    ko={<p>
                        <strong><InlineMath math={"\\mathcal{X}"}/> 안에 극한이 없다.</strong> 계단 함수를
                        정의한다.
                    </p>}
                />
                <BlockMath math={"f_{\\text{step}}(t) := \\begin{cases} 0 & 0 \\le t < \\tfrac{1}{2} \\\\ 1 & \\tfrac{1}{2} \\le t \\le 1 \\end{cases} \\qquad \\text{and} \\qquad \\|f_n - f_{\\text{step}}\\|_1 = \\frac{1}{2n}."}/>
                <Terms items={[
                    ["f_{\\text{step}}", <T en={<>discontinuous at <InlineMath math={"t = 1/2"}/>, hence <InlineMath math={"f_{\\text{step}} \\notin \\mathcal{X}"}/></>}
                                            ko={<><InlineMath math={"t = 1/2"}/>에서 불연속이므로 <InlineMath math={"f_{\\text{step}} \\notin \\mathcal{X}"}/>다</>}/>],
                    ["\\tfrac{1}{2n}", <T en={<>the area of the single remaining triangle. Numerically <InlineMath math={"0.25,\\ 0.1,\\ 0.025,\\ 0.005"}/> for <InlineMath math={"n = 2, 5, 20, 100"}/></>}
                                          ko={<>남은 삼각형 하나의 넓이. <InlineMath math={"n = 2, 5, 20, 100"}/>에서 수치로 <InlineMath math={"0.25,\\ 0.1,\\ 0.025,\\ 0.005"}/>다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Work in the larger space{" "}
                        <InlineMath math={"\\mathcal{Y} := \\operatorname{span}\\{\\mathcal{X}, f_{\\text{step}}\\}"}/>,
                        on which <InlineMath math={"\\|\\bullet\\|_1"}/> is still a norm. There{" "}
                        <InlineMath math={"f_n \\to f_{\\text{step}}"}/>, and by uniqueness of limits
                        (Proposition 6.22c) no other element of{" "}
                        <InlineMath math={"\\mathcal{Y}"}/> can be the limit. Since{" "}
                        <InlineMath math={"f_{\\text{step}} \\notin \\mathcal{X}"}/>, the sequence has no
                        limit in <InlineMath math={"\\mathcal{X}"}/>.
                    </p>}
                    ko={<p>
                        더 큰 공간{" "}
                        <InlineMath math={"\\mathcal{Y} := \\operatorname{span}\\{\\mathcal{X}, f_{\\text{step}}\\}"}/>에서
                        보자. 거기서도 <InlineMath math={"\\|\\bullet\\|_1"}/>은 여전히 norm이다. 그
                        안에서 <InlineMath math={"f_n \\to f_{\\text{step}}"}/>이고, 극한의 유일성(명제
                        6.22c)에 따라 <InlineMath math={"\\mathcal{Y}"}/>의 다른 어떤 원소도 극한이 될 수
                        없다. <InlineMath math={"f_{\\text{step}} \\notin \\mathcal{X}"}/>이므로 이 수열은{" "}
                        <InlineMath math={"\\mathcal{X}"}/> 안에 극한이 없다.
                    </p>}
                />
                <T
                    en={<p>
                        Two remarks the notes make in passing and that are worth pausing on. The norm is
                        doing the work: the same sequence is <em>not</em> Cauchy in{" "}
                        <InlineMath math={"(C[0,1], \\|\\bullet\\|_\\infty)"}/>, because{" "}
                        <InlineMath math={"\\|f_n - f_m\\|_\\infty = 1"}/> for{" "}
                        <InlineMath math={"n \\ne m"}/>, so the same set of functions is complete under
                        one norm and not under another. And every counterexample to completeness is
                        infinite dimensional, by Theorem 6.38 below.
                    </p>}
                    ko={<p>
                        교재가 지나가며 하는 말 둘은 멈춰서 볼 값어치가 있다. 일을 하는 것은 norm이다.
                        같은 수열이{" "}
                        <InlineMath math={"(C[0,1], \\|\\bullet\\|_\\infty)"}/>에서는 Cauchy가{" "}
                        <em>아니다</em>. <InlineMath math={"n \\ne m"}/>에서{" "}
                        <InlineMath math={"\\|f_n - f_m\\|_\\infty = 1"}/>이기 때문이다. 같은 함수 집합이
                        한 norm 아래에서는 완비이고 다른 norm 아래에서는 아니다. 그리고 완비성의 반례는
                        아래 정리 6.38에 따라 모두 무한 차원이다.
                    </p>}
                />
            </Example>
            <Definition n="6.34" title={<T en={<>Complete space, Banach space</>} ko={<>완비 공간, Banach space</>}/>}>
                <T
                    en={<p>
                        A normed space{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathbb{R}, \\|\\bullet\\|)"}/> is{" "}
                        <strong>complete</strong> if every Cauchy sequence in{" "}
                        <InlineMath math={"\\mathcal{X}"}/> has a limit in{" "}
                        <InlineMath math={"\\mathcal{X}"}/>. Such spaces are also called{" "}
                        <strong>Banach spaces</strong>. Definition 6.36 says the same for a subset:{" "}
                        <InlineMath math={"S"}/> is complete if every Cauchy sequence in{" "}
                        <InlineMath math={"S"}/> has a limit in <InlineMath math={"S"}/>.
                    </p>}
                    ko={<p>
                        normed space{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathbb{R}, \\|\\bullet\\|)"}/>에서 모든 Cauchy
                        수열이 <InlineMath math={"\\mathcal{X}"}/> 안에 극한을 가지면 그 공간이{" "}
                        <strong>완비</strong>라고 한다. 그런 공간을 <strong>Banach space</strong>라고도
                        한다. 정의 6.36은 부분집합에 대해 같은 말을 한다.{" "}
                        <InlineMath math={"S"}/> 안의 모든 Cauchy 수열이{" "}
                        <InlineMath math={"S"}/> 안에 극한을 가지면 <InlineMath math={"S"}/>가 완비다.
                    </p>}
                />
            </Definition>
            <Remark title={<T en={<>What is and is not complete</>} ko={<>무엇이 완비이고 무엇이 아닌가</>}/>}>
                <T
                    en={<ul>
                        <li><strong>Fact 6.35.</strong> For{" "}
                            <InlineMath math={"a < b"}/> both finite,{" "}
                            <InlineMath math={"(C[a,b], \\|\\bullet\\|_\\infty)"}/> is complete, where{" "}
                            <InlineMath math={"C[a,b] = \\{f : [a,b] \\to \\mathbb{R} \\mid f \\text{ continuous}\\}"}/>.
                            Example 6.33 showed{" "}
                            <InlineMath math={"(C[a,b], \\|\\bullet\\|_1)"}/> is not.</li>
                        <li><strong>Remark 6.37.</strong>{" "}
                            <InlineMath math={"S"}/> complete implies{" "}
                            <InlineMath math={"S"}/> closed. A convergent sequence in{" "}
                            <InlineMath math={"S"}/> is Cauchy by Proposition 6.32, completeness puts its
                            limit in <InlineMath math={"S"}/>, and Corollary 6.28 turns that into
                            closedness.</li>
                        <li><strong>Theorem 6.38.</strong> In any normed space, every finite dimensional
                            subspace is complete, and any closed subset of a complete set is complete.
                            The first half is why every failure of completeness you will ever meet is
                            infinite dimensional; it is proved at the end of this chapter using norm
                            equivalence.</li>
                        <li><strong>Fact 6.39.</strong> Every normed space{" "}
                            <InlineMath math={"(\\mathcal{X}, \\|\\bullet\\|_X)"}/> has a{" "}
                            <strong>completion</strong>: a complete space{" "}
                            <InlineMath math={"(\\mathcal{Y}, \\|\\bullet\\|_Y)"}/> with{" "}
                            <InlineMath math={"\\mathcal{X} \\subset \\mathcal{Y}"}/>,{" "}
                            <InlineMath math={"\\|x\\|_Y = \\|x\\|_X"}/> for all{" "}
                            <InlineMath math={"x \\in \\mathcal{X}"}/>,{" "}
                            <InlineMath math={"\\overline{\\mathcal{X}} = \\mathcal{Y}"}/>, and{" "}
                            <InlineMath math={"\\mathcal{Y} = \\mathcal{X} \\cup L"}/>, where{" "}
                            <InlineMath math={"L"}/> is the set of limit points of Cauchy sequences in{" "}
                            <InlineMath math={"\\mathcal{X}"}/>.
                            You fill the holes by declaring the missing limits to be new points. That is
                            literally how <InlineMath math={"\\mathbb{R}"}/> is constructed from{" "}
                            <InlineMath math={"\\mathbb{Q}"}/>, and the completion of{" "}
                            <InlineMath math={"C[a,b]"}/> under{" "}
                            <InlineMath math={"\\|\\bullet\\|_1"}/> turns out to be the Lebesgue
                            integrable functions.</li>
                    </ul>}
                    ko={<ul>
                        <li><strong>사실 6.35.</strong>{" "}
                            <InlineMath math={"a < b"}/>가 모두 유한하면{" "}
                            <InlineMath math={"(C[a,b], \\|\\bullet\\|_\\infty)"}/>는 완비다. 여기서{" "}
                            <InlineMath math={"C[a,b] = \\{f : [a,b] \\to \\mathbb{R} \\mid f \\text{ continuous}\\}"}/>다.
                            예제 6.33은 <InlineMath math={"(C[a,b], \\|\\bullet\\|_1)"}/>이 완비가 아님을
                            보였다.</li>
                        <li><strong>참고 6.37.</strong>{" "}
                            <InlineMath math={"S"}/>가 완비이면 <InlineMath math={"S"}/>는 닫혔다.{" "}
                            <InlineMath math={"S"}/> 안의 수렴하는 수열은 명제 6.32에 따라 Cauchy이고,
                            완비성이 그 극한을 <InlineMath math={"S"}/> 안에 넣어 주며, 따름정리 6.28이
                            그것을 닫힘으로 바꾼다.</li>
                        <li><strong>정리 6.38.</strong> 어떤 normed space에서든 유한 차원 부분 공간은 모두
                            완비이고, 완비 집합의 닫힌 부분집합도 완비다. 앞의 절반이, 앞으로 만나게 될
                            완비성의 실패가 모두 무한 차원인 이유다. 이 장 끝에서 norm 동치를 써서
                            증명한다.</li>
                        <li><strong>사실 6.39.</strong> 모든 normed space{" "}
                            <InlineMath math={"(\\mathcal{X}, \\|\\bullet\\|_X)"}/>에는{" "}
                            <strong>완비화</strong>가 있다.{" "}
                            <InlineMath math={"\\mathcal{X} \\subset \\mathcal{Y}"}/>이고 모든{" "}
                            <InlineMath math={"x \\in \\mathcal{X}"}/>에서{" "}
                            <InlineMath math={"\\|x\\|_Y = \\|x\\|_X"}/>이며{" "}
                            <InlineMath math={"\\overline{\\mathcal{X}} = \\mathcal{Y}"}/>이고{" "}
                            <InlineMath math={"\\mathcal{Y} = \\mathcal{X} \\cup L"}/>인
                            완비 공간{" "}
                            <InlineMath math={"(\\mathcal{Y}, \\|\\bullet\\|_Y)"}/>다.
                            여기서 <InlineMath math={"L"}/>은 <InlineMath math={"\\mathcal{X}"}/> 안의
                            Cauchy 수열들의 극한점 집합이다. 빠진 극한들을 새 점으로 선언해서 구멍을
                            메우는 것이다. <InlineMath math={"\\mathbb{Q}"}/>에서{" "}
                            <InlineMath math={"\\mathbb{R}"}/>을 만드는 방법이 말 그대로 이것이고,{" "}
                            <InlineMath math={"\\|\\bullet\\|_1"}/> 아래에서{" "}
                            <InlineMath math={"C[a,b]"}/>의 완비화는 Lebesgue 적분 가능한 함수들로
                            드러난다.</li>
                    </ul>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>The Contraction Mapping Theorem</h2>} ko={<h2>Contraction Mapping 정리</h2>}/>
            <T
                en={<p>
                    This is the first of the chapter's two payoffs. It takes an iteration, one inequality
                    about the map, and completeness of the set, and returns existence, uniqueness,
                    convergence from every starting point, and an error bound. Very few theorems in this
                    course give that much for that little.
                </p>}
                ko={<p>
                    이 장의 두 결실 중 첫 번째다. 반복 하나, 사상에 대한 부등식 하나, 그리고 집합의
                    완비성을 받아서 존재성, 유일성, 모든 시작점에서의 수렴, 그리고 오차 한계를 돌려준다.
                    이만큼 적게 받고 이만큼 많이 주는 정리는 이 과목에 몇 없다.
                </p>}
            />
            <Definition n="6.40" title={<T en={<>Contraction mapping and fixed point</>} ko={<>contraction mapping과 고정점</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"S \\subset \\mathcal{X}"}/> be a subset of a normed space{" "}
                        <InlineMath math={"(\\mathcal{X}, \\|\\bullet\\|)"}/>. A function{" "}
                        <InlineMath math={"T : S \\to S"}/> is a{" "}
                        <strong>contraction mapping</strong> if there exists{" "}
                        <InlineMath math={"0 \\le c < 1"}/> such that for all{" "}
                        <InlineMath math={"x, y \\in S"}/>,
                    </p>}
                    ko={<p>
                        <InlineMath math={"S \\subset \\mathcal{X}"}/>가 normed space{" "}
                        <InlineMath math={"(\\mathcal{X}, \\|\\bullet\\|)"}/>의 부분집합이라 하자. 모든{" "}
                        <InlineMath math={"x, y \\in S"}/>에 대해 다음을 만족하는{" "}
                        <InlineMath math={"0 \\le c < 1"}/>이 존재하면 함수{" "}
                        <InlineMath math={"T : S \\to S"}/>를{" "}
                        <strong>contraction mapping</strong>이라 한다.
                    </p>}
                />
                <BlockMath math={"\\|T(x) - T(y)\\| \\le c\\,\\|x - y\\|."}/>
                <Terms items={[
                    ["T : S \\to S", <T en={<>the map sends <InlineMath math={"S"}/> into itself. This is a real hypothesis and the one most often forgotten: an iteration that leaves the set is not covered</>}
                                        ko={<>사상이 <InlineMath math={"S"}/>를 자기 안으로 보낸다. 이것은 진짜 가설이고 가장 자주 잊히는 것이다. 집합을 벗어나는 반복은 이 정리의 대상이 아니다</>}/>],
                    ["c", <T en={<>one constant that works for <em>every</em> pair <InlineMath math={"x, y"}/>. A map that shrinks distances near one point and not elsewhere does not qualify</>}
                             ko={<><em>모든</em> 쌍 <InlineMath math={"x, y"}/>에 통하는 하나의 상수다. 한 점 근처에서만 거리를 줄이고 다른 데서는 그러지 않는 사상은 자격이 없다</>}/>],
                    ["c < 1", <T en={<>strict. At <InlineMath math={"c = 1"}/> the map merely does not expand, and <InlineMath math={"T(x) = x + 1"}/> on <InlineMath math={"\\mathbb{R}"}/> satisfies that with no fixed point at all</>}
                                 ko={<>강부등호다. <InlineMath math={"c = 1"}/>이면 사상이 늘리지 않을 뿐이고, <InlineMath math={"\\mathbb{R}"}/> 위의 <InlineMath math={"T(x) = x + 1"}/>이 그것을 만족하면서 고정점을 아예 갖지 않는다</>}/>],
                ]}/>
                <T
                    en={<p>
                        A point <InlineMath math={"x^* \\in S"}/> is a <strong>fixed point</strong> of{" "}
                        <InlineMath math={"T"}/> if <InlineMath math={"T(x^*) = x^*"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"T(x^*) = x^*"}/>이면 점{" "}
                        <InlineMath math={"x^* \\in S"}/>를 <InlineMath math={"T"}/>의{" "}
                        <strong>고정점</strong>이라 한다.
                    </p>}
                />
            </Definition>
            <Theorem n="6.41" title={<T en={<>Contraction Mapping Theorem</>} ko={<>Contraction Mapping 정리</>}/>}>
                <T
                    en={<p>
                        If <InlineMath math={"T"}/> is a contraction mapping on a{" "}
                        <strong>complete</strong> subset <InlineMath math={"S"}/> of a normed space{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathbb{R}, \\|\\bullet\\|)"}/>, then there
                        exists a unique vector <InlineMath math={"x^* \\in S"}/> such that{" "}
                        <InlineMath math={"T(x^*) = x^*"}/>. Moreover, for every initial point{" "}
                        <InlineMath math={"x_0 \\in S"}/>, the sequence{" "}
                        <InlineMath math={"x_{n+1} = T(x_n)"}/>,{" "}
                        <InlineMath math={"n \\ge 0"}/>, is Cauchy, and{" "}
                        <InlineMath math={"x_n \\to x^*"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"T"}/>가 normed space{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathbb{R}, \\|\\bullet\\|)"}/>의{" "}
                        <strong>완비</strong> 부분집합 <InlineMath math={"S"}/> 위의 contraction
                        mapping이면, <InlineMath math={"T(x^*) = x^*"}/>인 벡터{" "}
                        <InlineMath math={"x^* \\in S"}/>가 유일하게 존재한다. 나아가 모든 시작점{" "}
                        <InlineMath math={"x_0 \\in S"}/>에 대해 수열{" "}
                        <InlineMath math={"x_{n+1} = T(x_n)"}/>,{" "}
                        <InlineMath math={"n \\ge 0"}/>은 Cauchy이고{" "}
                        <InlineMath math={"x_n \\to x^*"}/>이다.
                    </p>}
                />
                <T
                    en={<p>
                        Note what the hypotheses are doing. The contraction condition gives convergence
                        of the differences; completeness is what supplies a destination. Drop
                        completeness and the sequence still bunches up, but there may be nothing there,
                        exactly as in the rationals.
                    </p>}
                    ko={<p>
                        가설들이 무슨 일을 하는지 보라. contraction 조건은 차이들의 수렴을 주고, 목적지를
                        공급하는 것은 완비성이다. 완비성을 빼면 수열은 여전히 몰려들지만 그 자리에 아무것도
                        없을 수 있다. 유리수에서와 똑같다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            Let <InlineMath math={"(x_n)"}/> be defined as in the statement. Because{" "}
                            <InlineMath math={"T"}/> is a contraction, for all{" "}
                            <InlineMath math={"n \\ge 1"}/>,
                        </p>}
                        ko={<p>
                            <InlineMath math={"(x_n)"}/>을 진술대로 정의하자.{" "}
                            <InlineMath math={"T"}/>가 contraction이므로 모든{" "}
                            <InlineMath math={"n \\ge 1"}/>에 대해
                        </p>}
                    />
                    <BlockMath math={"\\|x_{n+1} - x_n\\| = \\|T(x_n) - T(x_{n-1})\\| \\le c\\,\\|x_n - x_{n-1}\\|."}/>
                    <Terms items={[
                        ["\\|x_{n+1} - x_n\\|", <T en={<>the size of the step the iteration just took. The display says each step is at most <InlineMath math={"c"}/> times the last, which is exactly the hypothesis of Lemma 6.31</>}
                                                   ko={<>반복이 방금 밟은 걸음의 크기. 이 수식은 각 걸음이 앞 걸음의 <InlineMath math={"c"}/>배 이하라는 말이고, 그것이 정확히 보조정리 6.31의 가설이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>Claim 6.42.</strong>{" "}
                            <InlineMath math={"(x_n)"}/> is Cauchy, and thus by completeness of{" "}
                            <InlineMath math={"S"}/> there exists{" "}
                            <InlineMath math={"x^* \\in S"}/> with{" "}
                            <InlineMath math={"x_n \\to x^*"}/>. Induction on the display above gives{" "}
                            <InlineMath math={"\\|x_{n+1} - x_n\\| \\le c^n \\|x_1 - x_0\\|"}/>. Now take{" "}
                            <InlineMath math={"m = n + k"}/> with{" "}
                            <InlineMath math={"k > 0"}/>, without loss of generality:
                        </p>}
                        ko={<p>
                            <strong>주장 6.42.</strong>{" "}
                            <InlineMath math={"(x_n)"}/>은 Cauchy이고, 따라서{" "}
                            <InlineMath math={"S"}/>의 완비성에 의해{" "}
                            <InlineMath math={"x_n \\to x^*"}/>인{" "}
                            <InlineMath math={"x^* \\in S"}/>가 존재한다. 위 수식에 귀납법을 쓰면{" "}
                            <InlineMath math={"\\|x_{n+1} - x_n\\| \\le c^n \\|x_1 - x_0\\|"}/>이다. 이제
                            일반성을 잃지 않고 <InlineMath math={"k > 0"}/>인{" "}
                            <InlineMath math={"m = n + k"}/>를 잡는다.
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} \\|x_m - x_n\\| &= \\|x_{n+k} - x_n\\| \\\\ &= \\|x_{n+k} - x_{n+k-1} + x_{n+k-1} - \\cdots + x_{n+1} - x_n\\| \\\\ &\\le \\|x_{n+k} - x_{n+k-1}\\| + \\cdots + \\|x_{n+1} - x_n\\| \\\\ &\\le \\left( c^{n+k-1} + c^{n+k-2} + \\cdots + c^n \\right) \\|x_1 - x_0\\| \\\\ &= c^n \\left( \\sum_{i=0}^{k-1} c^i \\right) \\|x_1 - x_0\\| \\\\ &\\le c^n \\left( \\sum_{i=0}^{\\infty} c^i \\right) \\|x_1 - x_0\\| \\\\ &= \\frac{c^n}{1 - c}\\,\\|x_1 - x_0\\| \\xrightarrow[n \\to \\infty]{} 0 \\end{aligned}"}/>
                    <Terms items={[
                        ["\\|x_1 - x_0\\|", <T en={<>the very first step, computable before you know anything else. The whole bound is built from it</>}
                                               ko={<>맨 첫 걸음이고, 다른 무엇을 알기 전에 계산할 수 있다. 이 한계 전체가 그것으로 지어진다</>}/>],
                        ["\\frac{c^n}{1-c}", <T en={<>the bound depends on <InlineMath math={"n"}/> only, not on <InlineMath math={"k"}/>, so a single <InlineMath math={"N"}/> serves every pair <InlineMath math={"n, m \\ge N"}/></>}
                                                ko={<>이 한계는 <InlineMath math={"k"}/>가 아니라 <InlineMath math={"n"}/>에만 의존하므로 하나의 <InlineMath math={"N"}/>이 모든 쌍 <InlineMath math={"n, m \\ge N"}/>에 통한다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            This is Lemma 6.31 with vectors in place of real numbers, and it is where the
                            geometric series fact for{" "}
                            <InlineMath math={"\\tfrac{1}{1-c}"}/> is spent. So{" "}
                            <InlineMath math={"(x_n)"}/> is a Cauchy sequence in{" "}
                            <InlineMath math={"S"}/>, and by completeness{" "}
                            <InlineMath math={"\\exists x^* \\in S"}/> with{" "}
                            <InlineMath math={"x_n \\to x^*"}/>.
                        </p>}
                        ko={<p>
                            이것은 실수 자리에 벡터를 넣은 보조정리 6.31이고,{" "}
                            <InlineMath math={"\\tfrac{1}{1-c}"}/>에 대한 기하급수 사실이 쓰이는 자리다.
                            그러므로 <InlineMath math={"(x_n)"}/>은 <InlineMath math={"S"}/> 안의 Cauchy
                            수열이고, 완비성에 의해 <InlineMath math={"x_n \\to x^*"}/>인{" "}
                            <InlineMath math={"x^* \\in S"}/>가 존재한다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>Claim 6.43.</strong>{" "}
                            <InlineMath math={"x^* = T(x^*)"}/>, so <InlineMath math={"x^*"}/> is a fixed
                            point. Let <InlineMath math={"n \\ge 1"}/> be arbitrary. Then
                        </p>}
                        ko={<p>
                            <strong>주장 6.43.</strong>{" "}
                            <InlineMath math={"x^* = T(x^*)"}/>이므로{" "}
                            <InlineMath math={"x^*"}/>는 고정점이다.{" "}
                            <InlineMath math={"n \\ge 1"}/>을 임의로 잡자. 그러면
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} \\|x^* - T(x^*)\\| &= \\|x^* - x_n + x_n - T(x^*)\\| \\\\ &= \\|x^* - x_n + T(x_{n-1}) - T(x^*)\\| \\\\ &\\le \\|x^* - x_n\\| + \\|T(x_{n-1}) - T(x^*)\\| \\\\ &\\le \\|x^* - x_n\\| + c\\,\\|x_{n-1} - x^*\\| \\xrightarrow[n \\to \\infty]{} 0 \\end{aligned}"}/>
                    <Terms items={[
                        ["x_n = T(x_{n-1})", <T en={<>the definition of the iteration, substituted in line 2 so the contraction property can be applied</>}
                                                ko={<>반복의 정의다. contraction 성질을 쓸 수 있도록 둘째 줄에 대입했다</>}/>],
                        ["\\|x^* - T(x^*)\\|", <T en={<>a fixed number, independent of <InlineMath math={"n"}/>, shown to be below a quantity going to zero. Hence it is zero</>}
                                                  ko={<><InlineMath math={"n"}/>에 무관한 고정된 수인데 0으로 가는 양보다 작음을 보였다. 따라서 0이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>Claim 6.44.</strong>{" "}
                            <InlineMath math={"x^*"}/> is unique. Suppose{" "}
                            <InlineMath math={"y^* = T(y^*)"}/> as well. Then
                        </p>}
                        ko={<p>
                            <strong>주장 6.44.</strong>{" "}
                            <InlineMath math={"x^*"}/>는 유일하다.{" "}
                            <InlineMath math={"y^* = T(y^*)"}/>이기도 하다고 하자. 그러면
                        </p>}
                    />
                    <BlockMath math={"\\|x^* - y^*\\| = \\|T(x^*) - T(y^*)\\| \\le c\\,\\|x^* - y^*\\|."}/>
                    <Terms items={[
                        ["\\gamma := \\|x^* - y^*\\|", <T en={<>a single non-negative real number satisfying <InlineMath math={"\\gamma \\le c\\gamma"}/> with <InlineMath math={"0 \\le c < 1"}/></>}
                                                          ko={<><InlineMath math={"0 \\le c < 1"}/>에 대해 <InlineMath math={"\\gamma \\le c\\gamma"}/>를 만족하는 음이 아닌 실수 하나</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The only non-negative real number{" "}
                            <InlineMath math={"\\gamma"}/> satisfying{" "}
                            <InlineMath math={"\\gamma \\le c\\gamma"}/> for some{" "}
                            <InlineMath math={"0 \\le c < 1"}/> is{" "}
                            <InlineMath math={"\\gamma = 0"}/>, since{" "}
                            <InlineMath math={"\\gamma > 0"}/> would give{" "}
                            <InlineMath math={"1 \\le c"}/> after dividing. Hence, by the norm axioms,{" "}
                            <InlineMath math={"0 = \\|x^* - y^*\\| \\implies x^* = y^*"}/>.
                        </p>}
                        ko={<p>
                            어떤 <InlineMath math={"0 \\le c < 1"}/>에 대해{" "}
                            <InlineMath math={"\\gamma \\le c\\gamma"}/>를 만족하는 음이 아닌 실수{" "}
                            <InlineMath math={"\\gamma"}/>는 <InlineMath math={"\\gamma = 0"}/>뿐이다.{" "}
                            <InlineMath math={"\\gamma > 0"}/>이면 나눠서{" "}
                            <InlineMath math={"1 \\le c"}/>가 나오기 때문이다. 따라서 norm 공리에 의해{" "}
                            <InlineMath math={"0 = \\|x^* - y^*\\| \\implies x^* = y^*"}/>이다.
                        </p>}
                    />
                    <T
                        en={<p>
                            The printed version of this last step reads "for some{" "}
                            <InlineMath math={"0 \\le\\, \\lesssim 1"}/>", where the typesetting has
                            dropped the constant. The condition being used is{" "}
                            <InlineMath math={"0 \\le c < 1"}/>, the same one assumed throughout.
                        </p>}
                        ko={<p>
                            이 마지막 단계의 인쇄본은 "for some{" "}
                            <InlineMath math={"0 \\le\\, \\lesssim 1"}/>"으로 읽히는데, 조판에서 상수가
                            빠졌다. 쓰이고 있는 조건은 처음부터 가정한 것과 같은{" "}
                            <InlineMath math={"0 \\le c < 1"}/>이다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Remark title={<T en={<>The error bound is the part you use</>} ko={<>실제로 쓰는 부분은 오차 한계다</>}/>}>
                <T
                    en={<p>
                        Claim 6.42 proved more than Cauchy. Letting{" "}
                        <InlineMath math={"m \\to \\infty"}/> in the estimate, with{" "}
                        <InlineMath math={"x_m \\to x^*"}/>, gives a bound on the actual error at step{" "}
                        <InlineMath math={"n"}/>:
                    </p>}
                    ko={<p>
                        주장 6.42는 Cauchy보다 많은 것을 증명했다.{" "}
                        <InlineMath math={"x_m \\to x^*"}/>인 상태에서 그 평가에{" "}
                        <InlineMath math={"m \\to \\infty"}/>를 보내면{" "}
                        <InlineMath math={"n"}/>번째 걸음에서의 실제 오차에 대한 한계가 나온다.
                    </p>}
                />
                <BlockMath math={"\\|x_n - x^*\\| \\le \\frac{c^n}{1 - c}\\,\\|x_1 - x_0\\|"}/>
                <Terms items={[
                    ["\\|x_n - x^*\\|", <T en={<>the true error, which you cannot compute because you do not know <InlineMath math={"x^*"}/></>}
                                           ko={<>참 오차. <InlineMath math={"x^*"}/>를 모르므로 계산할 수 없다</>}/>],
                    ["\\frac{c^n}{1-c}\\|x_1 - x_0\\|", <T en={<>a bound you <em>can</em> compute, from the contraction constant and one step. This is what makes the theorem practical: choose <InlineMath math={"n"}/> before running the loop</>}
                                                           ko={<>계산할 수 <em>있는</em> 한계다. contraction 상수와 걸음 하나로 만들어진다. 이것이 정리를 실용적으로 만든다. 루프를 돌리기 전에 <InlineMath math={"n"}/>을 정할 수 있다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Try it on the simplest possible contraction. Let{" "}
                        <InlineMath math={"T(x) = \\tfrac{x}{2} + 1"}/> on{" "}
                        <InlineMath math={"\\mathbb{R}"}/>, which is complete. Then{" "}
                        <InlineMath math={"|T(x) - T(y)| = \\tfrac{1}{2}|x - y|"}/>, so{" "}
                        <InlineMath math={"c = \\tfrac{1}{2}"}/>, and the fixed point solves{" "}
                        <InlineMath math={"x = \\tfrac{x}{2} + 1"}/>, giving{" "}
                        <InlineMath math={"x^* = 2"}/>. Start at{" "}
                        <InlineMath math={"x_0 = 10"}/>, so{" "}
                        <InlineMath math={"x_1 = 6"}/> and{" "}
                        <InlineMath math={"|x_1 - x_0| = 4"}/>.
                    </p>}
                    ko={<p>
                        가장 단순한 contraction에 써 보자. 완비인{" "}
                        <InlineMath math={"\\mathbb{R}"}/> 위에서{" "}
                        <InlineMath math={"T(x) = \\tfrac{x}{2} + 1"}/>이라 하자.{" "}
                        <InlineMath math={"|T(x) - T(y)| = \\tfrac{1}{2}|x - y|"}/>이므로{" "}
                        <InlineMath math={"c = \\tfrac{1}{2}"}/>이고, 고정점은{" "}
                        <InlineMath math={"x = \\tfrac{x}{2} + 1"}/>을 풀어{" "}
                        <InlineMath math={"x^* = 2"}/>다.{" "}
                        <InlineMath math={"x_0 = 10"}/>에서 시작하면{" "}
                        <InlineMath math={"x_1 = 6"}/>이고{" "}
                        <InlineMath math={"|x_1 - x_0| = 4"}/>다.
                    </p>}
                />
                <table className="table-center">
                    <thead>
                    <tr>
                        <th><InlineMath math={"n"}/></th>
                        <th><InlineMath math={"x_n"}/></th>
                        <th><InlineMath math={"|x_n - x^*|"}/></th>
                        <th><InlineMath math={"\\frac{c^n}{1-c}|x_1 - x_0|"}/></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr><td>0</td><td>10</td><td>8</td><td>8</td></tr>
                    <tr><td>1</td><td>6</td><td>4</td><td>4</td></tr>
                    <tr><td>2</td><td>4</td><td>2</td><td>2</td></tr>
                    <tr><td>3</td><td>3</td><td>1</td><td>1</td></tr>
                    <tr><td>4</td><td><InlineMath math={"5/2"}/></td><td>0.5</td><td>0.5</td></tr>
                    <tr><td>5</td><td><InlineMath math={"9/4"}/></td><td>0.25</td><td>0.25</td></tr>
                    <tr><td>6</td><td><InlineMath math={"17/8"}/></td><td>0.125</td><td>0.125</td></tr>
                    </tbody>
                </table>
                <T
                    en={<p>
                        The last two columns are equal at every step. For a map that contracts by exactly{" "}
                        <InlineMath math={"c"}/> in every direction the geometric bound is attained, not
                        merely valid, so the estimate in Claim 6.42 is as sharp as an estimate of that
                        form can be. For a map whose local contraction varies, as in the figure below, the
                        bound is a genuine overestimate, and that gap is the price of a result that has to
                        hold for every contraction at once.
                    </p>}
                    ko={<p>
                        마지막 두 열이 매 걸음 같다. 모든 방향에서 정확히{" "}
                        <InlineMath math={"c"}/>배로 줄이는 사상에서는 기하 한계가 성립하는 데 그치지 않고
                        달성된다. 그러니 주장 6.42의 평가는 그 형태의 평가가 도달할 수 있는 만큼 날카롭다.
                        아래 그림처럼 국소적 수축이 달라지는 사상에서는 그 한계가 진짜로 과대평가이고, 그
                        간격이 모든 contraction에 한꺼번에 성립해야 하는 결과가 치르는 값이다.
                    </p>}
                />
            </Remark>
            <CanvasFigure label={t("Cobweb plot: slide the contraction constant past one",
                "거미줄 그림: contraction 상수를 1 너머로 밀어 보라")}
                          modal={<ContractionCobweb width={720} height={520}/>}
                          bodyClassName="w-[min(92vw,860px)]">
                <ContractionCobweb/>
            </CanvasFigure>
            <Remark title={<T en={<>Sufficient, not necessary</>} ko={<>충분조건이지 필요조건이 아니다</>}/>}>
                <T
                    en={<p>
                        The figure iterates{" "}
                        <InlineMath math={"T(x) = c\\sin(x) + 1"}/>, chosen because{" "}
                        <InlineMath math={"|T'(x)| = |c\\cos x| \\le |c|"}/>, so the slider is the
                        Lipschitz constant itself. Below <InlineMath math={"1"}/> the theorem applies and
                        the staircase closes onto the fixed point from anywhere.
                    </p>}
                    ko={<p>
                        그림은 <InlineMath math={"T(x) = c\\sin(x) + 1"}/>을 반복한다.{" "}
                        <InlineMath math={"|T'(x)| = |c\\cos x| \\le |c|"}/>이라서 슬라이더가 곧 Lipschitz
                        상수이기 때문에 고른 사상이다. <InlineMath math={"1"}/> 아래에서는 정리가 적용되고
                        계단이 어디서든 고정점으로 조여든다.
                    </p>}
                />
                <T
                    en={<p>
                        Push the slider past <InlineMath math={"1"}/> and watch what does <em>not</em>{" "}
                        happen. The iteration keeps converging. Solving{" "}
                        <InlineMath math={"|T'(x^*)| = 1"}/> numerically puts the actual breakdown at{" "}
                        <InlineMath math={"c \\approx 1.5983"}/>, where the fixed point turns repelling
                        and the cobweb opens into a rectangle cycling between two values. At{" "}
                        <InlineMath math={"c = 2"}/> the orbit settles into the cycle{" "}
                        <InlineMath math={"1.3653 \\leftrightarrow 2.9579"}/> and never approaches{" "}
                        <InlineMath math={"x^* = 2.3801"}/>, which is still sitting there where the curve
                        crosses the diagonal.
                    </p>}
                    ko={<p>
                        슬라이더를 <InlineMath math={"1"}/> 너머로 밀고, 일어나지 <em>않는</em> 일을 보라.
                        반복이 계속 수렴한다. <InlineMath math={"|T'(x^*)| = 1"}/>을 수치로 풀면 실제
                        붕괴는 <InlineMath math={"c \\approx 1.5983"}/>에서 일어난다. 거기서 고정점이
                        반발성이 되고 거미줄이 두 값을 오가는 사각형으로 열린다.{" "}
                        <InlineMath math={"c = 2"}/>에서 궤도는 주기{" "}
                        <InlineMath math={"1.3653 \\leftrightarrow 2.9579"}/>에 정착하고, 곡선이 대각선을
                        지나는 자리에 그대로 앉아 있는{" "}
                        <InlineMath math={"x^* = 2.3801"}/>에는 결코 다가가지 않는다.
                    </p>}
                />
                <T
                    en={<p>
                        The gap between <InlineMath math={"1"}/> and{" "}
                        <InlineMath math={"1.5983"}/> is worth understanding rather than resenting. The
                        theorem must cover every contraction on every complete set, so its constant is
                        global and its conclusion is global: convergence from <em>any</em> starting point,
                        plus uniqueness, plus a computable bound. Losing the hypothesis loses all three
                        guarantees, not the convergence. In practice that distinction is the difference
                        between an algorithm you can ship and one that happens to work on your test cases.
                    </p>}
                    ko={<p>
                        <InlineMath math={"1"}/>과 <InlineMath math={"1.5983"}/> 사이의 간격은 억울해할
                        것이 아니라 이해할 것이다. 이 정리는 모든 완비 집합 위의 모든 contraction을 덮어야
                        하므로 상수도 전역이고 결론도 전역이다. <em>어떤</em> 시작점에서든 수렴, 게다가
                        유일성, 게다가 계산 가능한 한계. 가설을 잃으면 수렴이 아니라 이 보장 셋을 잃는다.
                        실무에서 그 구분이, 내보낼 수 있는 알고리즘과 마침 테스트 케이스에서 돌아가는
                        알고리즘의 차이다.
                    </p>}
                />
            </Remark>
            <Remark n="6.45" title={<T en={<>Newton-Raphson as a contraction</>} ko={<>contraction으로 본 Newton-Raphson</>}/>}>
                <T
                    en={<p>
                        This is where Section 6.2 gets its theorem. The local convergence of
                        Newton-Raphson is established by identifying a closed ball in{" "}
                        <InlineMath math={"\\mathbb{R}^n"}/> on which the function
                    </p>}
                    ko={<p>
                        6.2절이 자기 정리를 받아 가는 자리다. Newton-Raphson의 국소 수렴은{" "}
                        <InlineMath math={"\\mathbb{R}^n"}/> 안에서 다음 함수가 contraction mapping이 되는
                        닫힌 공을 찾아냄으로써 확립된다.
                    </p>}
                />
                <BlockMath math={"\\boxed{\\ T(x) := x - \\epsilon \\left( \\frac{\\partial f}{\\partial x}(x) \\right)^{-1} \\bigl( f(x) - y \\bigr)\\ }"}/>
                <Terms items={[
                    ["\\epsilon", <T en={<>the damping parameter from (6.5). It is a free knob, and shrinking it is one way to force the contraction constant below <InlineMath math={"1"}/></>}
                                     ko={<>(6.5)의 감쇠 파라미터. 자유롭게 돌릴 수 있는 손잡이이고, 그것을 줄이는 것이 contraction 상수를 <InlineMath math={"1"}/> 아래로 밀어 넣는 한 방법이다</>}/>],
                    ["y", <T en={<>the target value. Setting <InlineMath math={"y = 0"}/> recovers root finding; general <InlineMath math={"y"}/> solves <InlineMath math={"f(x) = y"}/></>}
                             ko={<>목표값. <InlineMath math={"y = 0"}/>으로 두면 근 찾기가 되고, 일반적인 <InlineMath math={"y"}/>는 <InlineMath math={"f(x) = y"}/>를 푼다</>}/>],
                    ["c", <T en={<>the estimate of a suitable <InlineMath math={"0 \\le c < 1"}/> is based on a Lipschitz constant for the Jacobian, which is why the notes require <InlineMath math={"f"}/> to be continuously differentiable</>}
                             ko={<>적당한 <InlineMath math={"0 \\le c < 1"}/>의 추정은 야코비안의 Lipschitz 상수에 기반한다. 교재가 <InlineMath math={"f"}/>에 연속 미분 가능성을 요구하는 이유다</>}/>],
                ]}/>
                <T
                    en={<p>
                        A solution of <InlineMath math={"f(x) = y"}/> is a fixed point of{" "}
                        <InlineMath math={"T"}/>, and the chain is reversible at every step:
                    </p>}
                    ko={<p>
                        <InlineMath math={"f(x) = y"}/>의 해는 <InlineMath math={"T"}/>의 고정점이고, 이
                        연쇄는 매 단계에서 되돌릴 수 있다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} x^* = T(x^*) \\quad &\\Updownarrow \\\\ x^* = x^* - \\epsilon \\left( \\frac{\\partial f}{\\partial x}(x^*) \\right)^{-1} \\bigl( f(x^*) - y \\bigr) \\quad &\\Updownarrow \\\\ 0 = -\\epsilon \\left( \\frac{\\partial f}{\\partial x}(x^*) \\right)^{-1} \\bigl( f(x^*) - y \\bigr) \\quad &\\Updownarrow \\\\ 0 = f(x^*) - y \\quad & \\end{aligned}"}/>
                <Terms items={[
                    ["\\text{last step}", <T en={<>valid because <InlineMath math={"\\epsilon \\ne 0"}/> and the Jacobian inverse is nonsingular, so the only way the product vanishes is for the residual to vanish</>}
                                             ko={<><InlineMath math={"\\epsilon \\ne 0"}/>이고 야코비안의 역이 비특이이므로 성립한다. 곱이 0이 되는 유일한 길은 잔차가 0이 되는 것이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        So the fixed point the contraction mapping theorem produces is precisely the root
                        you wanted, and "there is a ball around the root on which Newton converges" is
                        now a statement with a proof rather than a hope. The basins figure showed why the
                        ball cannot be dropped from the statement.
                    </p>}
                    ko={<p>
                        그러므로 contraction mapping 정리가 만들어 내는 고정점이 정확히 원하던 근이고,
                        "근 둘레에 Newton이 수렴하는 공이 있다"는 이제 기대가 아니라 증명이 붙은 진술이다.
                        basin 그림이 그 공을 진술에서 뺄 수 없는 이유를 보였다.
                    </p>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Continuous Functions</h2>} ko={<h2>연속 함수</h2>}/>
            <T
                en={<p>
                    The notes are blunt about this section: you saw the definition in calculus, and for
                    most of us it did not stick. It does not stick because it is usually taught before
                    there is any reason to want it. Here there is a reason. The Weierstrass theorem in
                    the next section needs continuity as a hypothesis, and the only definition strong
                    enough to make that proof work is this one.
                </p>}
                ko={<p>
                    교재는 이 절에 대해 솔직하다. 미적분에서 정의를 봤을 텐데 우리 대부분에게 남지
                    않았다는 것이다. 남지 않는 이유는 그것을 원할 이유가 생기기 전에 배우기 때문이다.
                    여기에는 이유가 있다. 다음 절의 Weierstrass 정리가 연속성을 가설로 요구하고, 그 증명이
                    돌아가게 할 만큼 강한 정의는 이것뿐이다.
                </p>}
            />
            <Definition n="6.46" title={<T en={<>Continuity at a point</>} ko={<>한 점에서의 연속</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\|\\bullet\\|)"}/> and{" "}
                        <InlineMath math={"(\\mathcal{Y}, |\\!|\\!|\\bullet|\\!|\\!|)"}/> be normed
                        spaces.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\|\\bullet\\|)"}/>와{" "}
                        <InlineMath math={"(\\mathcal{Y}, |\\!|\\!|\\bullet|\\!|\\!|)"}/>가 normed
                        space라 하자.
                    </p>}
                />
                <T
                    en={<p>
                        <InlineMath math={"f : \\mathcal{X} \\to \\mathcal{Y}"}/> is{" "}
                        <strong>continuous at <InlineMath math={"x_0 \\in \\mathcal{X}"}/></strong> if
                    </p>}
                    ko={<p>
                        다음이 성립하면{" "}
                        <InlineMath math={"f : \\mathcal{X} \\to \\mathcal{Y}"}/>가{" "}
                        <strong><InlineMath math={"x_0 \\in \\mathcal{X}"}/>에서 연속</strong>이라 한다.
                    </p>}
                />
                <BlockMath math={"\\forall \\epsilon > 0,\\ \\exists\\, \\delta(\\epsilon, x_0) > 0 \\ \\text{ such that } \\ \\|x - x_0\\| < \\delta \\implies |\\!|\\!| f(x) - f(x_0) |\\!|\\!| < \\epsilon."}/>
                <Terms items={[
                    ["\\epsilon", <T en={<>the tolerance in the <em>output</em> space, measured with the norm of <InlineMath math={"\\mathcal{Y}"}/>. Chosen first</>}
                                     ko={<><em>출력</em> 공간에서의 허용 오차이고 <InlineMath math={"\\mathcal{Y}"}/>의 norm으로 잰다. 먼저 고른다</>}/>],
                    ["\\delta(\\epsilon, x_0)", <T en={<>the radius in the <em>input</em> space that answers it. It may depend on both the tolerance and the point, and the notation says so</>}
                                                   ko={<>그것에 답하는 <em>입력</em> 공간에서의 반지름. 허용 오차와 점 양쪽에 의존해도 되고, 표기가 그것을 말한다</>}/>],
                    ["|\\!|\\!|\\bullet|\\!|\\!|", <T en={<>the triple bar is the notes' way of marking the norm on <InlineMath math={"\\mathcal{Y}"}/>, which need not be the norm on <InlineMath math={"\\mathcal{X}"}/>. Two different spaces, two different rulers</>}
                                                      ko={<>삼중 막대는 <InlineMath math={"\\mathcal{Y}"}/>의 norm을 표시하는 교재의 방식이다. <InlineMath math={"\\mathcal{X}"}/>의 norm과 같을 필요가 없다. 공간이 둘이면 자도 둘이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        <InlineMath math={"f"}/> is <strong>continuous</strong> if it is continuous at{" "}
                        <InlineMath math={"x_0"}/> for all{" "}
                        <InlineMath math={"x_0 \\in \\mathcal{X}"}/>.
                    </p>}
                    ko={<p>
                        모든 <InlineMath math={"x_0 \\in \\mathcal{X}"}/>에서 연속이면{" "}
                        <InlineMath math={"f"}/>가 <strong>연속</strong>이라 한다.
                    </p>}
                />
                <T
                    en={<p>
                        The printed version of this definition ends with{" "}
                        <InlineMath math={"|\\!|\\!| f(x) |\\!|\\!| < \\epsilon"}/>, dropping the{" "}
                        <InlineMath math={"- f(x_0)"}/>. As written that would say the output is small
                        rather than close to <InlineMath math={"f(x_0)"}/>, which is a different and
                        wrong condition: it would make{" "}
                        <InlineMath math={"f(x) = 5"}/> discontinuous everywhere. Remark 6.47 states the
                        same definition correctly in ball form, so the intent is clear:
                    </p>}
                    ko={<p>
                        이 정의의 인쇄본은{" "}
                        <InlineMath math={"- f(x_0)"}/>이 빠진 채{" "}
                        <InlineMath math={"|\\!|\\!| f(x) |\\!|\\!| < \\epsilon"}/>으로 끝난다. 적힌
                        대로라면 출력이 <InlineMath math={"f(x_0)"}/>에 가깝다는 것이 아니라 작다는
                        말이 되는데, 다르고 틀린 조건이다. 그러면{" "}
                        <InlineMath math={"f(x) = 5"}/>가 어디서나 불연속이 된다. 참고 6.47이 같은 정의를
                        공 형태로 바르게 적고 있으므로 의도는 분명하다.
                    </p>}
                />
                <BlockMath math={"\\forall \\epsilon > 0,\\ \\exists \\delta > 0 \\ \\text{ such that } \\ x \\in B_\\delta(x_0) \\implies f(x) \\in B_\\epsilon(f(x_0)),"}/>
                <Terms items={[
                    ["B_\\delta(x_0)", <T en={<>a ball in the domain, radius <InlineMath math={"\\delta"}/></>}
                                          ko={<>정의역의 공. 반지름이 <InlineMath math={"\\delta"}/>다</>}/>],
                    ["B_\\epsilon(f(x_0))", <T en={<>a ball in the codomain around the value at <InlineMath math={"x_0"}/>. The centre is <InlineMath math={"f(x_0)"}/>, which is the clause the printed definition lost</>}
                                               ko={<>공역에서 <InlineMath math={"x_0"}/>에서의 값 둘레의 공. 중심이 <InlineMath math={"f(x_0)"}/>이고, 인쇄된 정의가 놓친 것이 그 절이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        or equivalently{" "}
                        <InlineMath math={"f(B_\\delta(x_0)) \\subset B_\\epsilon(f(x_0))"}/>: the image
                        of a small enough ball fits inside the target ball.
                    </p>}
                    ko={<p>
                        같은 말로{" "}
                        <InlineMath math={"f(B_\\delta(x_0)) \\subset B_\\epsilon(f(x_0))"}/>이다. 충분히
                        작은 공의 상이 목표 공 안에 들어간다는 뜻이다.
                    </p>}
                />
            </Definition>
            <Remark n="6.48" title={<T en={<>Discontinuous at a point, by negation</>} ko={<>부정으로 얻는 한 점에서의 불연속</>}/>}>
                <T
                    en={<p>
                        Negate Definition 6.46 clause by clause, exactly as in Chapter 1.{" "}
                        <InlineMath math={"f"}/> is <strong>discontinuous</strong> at{" "}
                        <InlineMath math={"x_0"}/> if
                    </p>}
                    ko={<p>
                        정의 6.46을 1장에서 하던 그대로 절 단위로 부정한다.{" "}
                        <InlineMath math={"f"}/>가 <InlineMath math={"x_0"}/>에서{" "}
                        <strong>불연속</strong>이라는 것은
                    </p>}
                />
                <BlockMath math={"\\exists\\, \\epsilon > 0 \\ \\text{ such that } \\ \\forall \\delta > 0,\\ \\exists\\, x \\in B_\\delta(x_0) \\ \\text{ with } \\ |\\!|\\!| f(x) - f(x_0) |\\!|\\!| \\ge \\epsilon."}/>
                <Terms items={[
                    ["\\exists \\epsilon", <T en={<>one bad tolerance is enough. You do not have to break the definition for every <InlineMath math={"\\epsilon"}/>, just for one</>}
                                              ko={<>나쁜 허용 오차 하나면 충분하다. 모든 <InlineMath math={"\\epsilon"}/>에서 정의를 깰 필요가 없고 하나면 된다</>}/>],
                    ["\\forall \\delta > 0", <T en={<>but that one <InlineMath math={"\\epsilon"}/> must defeat <em>every</em> candidate <InlineMath math={"\\delta"}/>, including the ones you have not thought of</>}
                                                ko={<>다만 그 하나의 <InlineMath math={"\\epsilon"}/>이 <em>모든</em> 후보 <InlineMath math={"\\delta"}/>를 이겨야 한다. 미처 생각하지 못한 것까지 포함해서다</>}/>],
                    ["x", <T en={<>the witness, which is allowed to depend on <InlineMath math={"\\delta"}/>. Producing it as a formula in <InlineMath math={"\\delta"}/> is how these proofs are written</>}
                             ko={<>증인이고 <InlineMath math={"\\delta"}/>에 의존해도 된다. 이런 증명은 그것을 <InlineMath math={"\\delta"}/>에 대한 식으로 만들어 내는 방식으로 적힌다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The notes' Figure 6.4 is exactly this, with a specific number attached: a
                        function with a jump, <InlineMath math={"\\epsilon = 1.0"}/>, and the observation
                        that <InlineMath math={"x = x_0 + \\delta/2"}/> works as the witness for whatever{" "}
                        <InlineMath math={"\\delta"}/> is offered. That is the picture below.
                    </p>}
                    ko={<p>
                        교재의 Figure 6.4가 정확히 이것이고 구체적인 수가 붙어 있다. 도약이 있는 함수,{" "}
                        <InlineMath math={"\\epsilon = 1.0"}/>, 그리고 어떤{" "}
                        <InlineMath math={"\\delta"}/>가 제시되든{" "}
                        <InlineMath math={"x = x_0 + \\delta/2"}/>가 증인으로 통한다는 관찰이다. 아래
                        그림이 그것이다.
                    </p>}
                />
            </Remark>
            <CanvasFigure label={t("The same game, now with delta answering epsilon",
                "같은 게임, 이번에는 델타가 엡실론에 답한다")}
                          modal={<EpsilonGame width={780} height={470} defaultMode="function"/>}
                          bodyClassName="w-[min(92vw,920px)]">
                <EpsilonGame defaultMode="function"/>
            </CanvasFigure>
            <Example title={<T en={<>Producing the delta for <InlineMath math={"f(x) = x^2"}/></>}
                               ko={<><InlineMath math={"f(x) = x^2"}/>에 대해 델타 만들어 내기</>}/>}>
                <T
                    en={<p>
                        Take <InlineMath math={"f : [0, 2] \\to \\mathbb{R}"}/>,{" "}
                        <InlineMath math={"f(x) = x^2"}/>, at{" "}
                        <InlineMath math={"x_0 = 1"}/>, so{" "}
                        <InlineMath math={"f(x_0) = 1"}/>. Since{" "}
                        <InlineMath math={"f"}/> is increasing here, the condition{" "}
                        <InlineMath math={"|x^2 - 1| < \\epsilon"}/> is the same as{" "}
                        <InlineMath math={"\\sqrt{1 - \\epsilon} < x < \\sqrt{1 + \\epsilon}"}/>, and the
                        largest symmetric window around <InlineMath math={"1"}/> inside that is
                    </p>}
                    ko={<p>
                        <InlineMath math={"f : [0, 2] \\to \\mathbb{R}"}/>,{" "}
                        <InlineMath math={"f(x) = x^2"}/>를{" "}
                        <InlineMath math={"x_0 = 1"}/>에서 보자.{" "}
                        <InlineMath math={"f(x_0) = 1"}/>이다. 여기서{" "}
                        <InlineMath math={"f"}/>가 증가하므로 조건{" "}
                        <InlineMath math={"|x^2 - 1| < \\epsilon"}/>은{" "}
                        <InlineMath math={"\\sqrt{1 - \\epsilon} < x < \\sqrt{1 + \\epsilon}"}/>과 같고,
                        그 안에 들어가는 <InlineMath math={"1"}/> 둘레의 최대 대칭 창은 다음과 같다.
                    </p>}
                />
                <BlockMath math={"\\delta(\\epsilon) = \\min\\left\\{\\, 1 - \\sqrt{1 - \\epsilon},\\ \\sqrt{1 + \\epsilon} - 1 \\,\\right\\}"}/>
                <Terms items={[
                    ["1 - \\sqrt{1-\\epsilon}", <T en={<>room on the left, the binding side here because the square function is flatter below <InlineMath math={"1"}/> than above it</>}
                                                   ko={<>왼쪽 여유. 제곱 함수가 <InlineMath math={"1"}/> 아래에서 위보다 완만하므로 여기서 조이는 쪽은 이것이 아니다</>}/>],
                    ["\\sqrt{1+\\epsilon} - 1", <T en={<>room on the right, which is the smaller of the two and therefore the one that decides <InlineMath math={"\\delta"}/></>}
                                                   ko={<>오른쪽 여유. 둘 중 작은 쪽이라 <InlineMath math={"\\delta"}/>를 결정하는 것이 이쪽이다</>}/>],
                ]}/>
                <table className="table-center">
                    <thead>
                    <tr>
                        <th><InlineMath math={"\\epsilon"}/></th>
                        <th><InlineMath math={"\\delta(\\epsilon)"}/></th>
                        <th><InlineMath math={"|f(1+\\delta) - 1|"}/></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr><td>1.00</td><td>0.414214</td><td>1.000000</td></tr>
                    <tr><td>0.50</td><td>0.224745</td><td>0.500000</td></tr>
                    <tr><td>0.25</td><td>0.118034</td><td>0.250000</td></tr>
                    <tr><td>0.10</td><td>0.048809</td><td>0.100000</td></tr>
                    <tr><td>0.01</td><td>0.004988</td><td>0.010000</td></tr>
                    </tbody>
                </table>
                <T
                    en={<p>
                        The third column is the tolerance exactly, confirming the window is as wide as it
                        can be. Two things are worth reading off. The response{" "}
                        <InlineMath math={"\\delta"}/> is roughly <InlineMath math={"\\epsilon/2"}/> here,
                        which is <InlineMath math={"1/f'(1)"}/>, so the derivative is the exchange rate
                        between the two tolerances. And <InlineMath math={"\\delta"}/> genuinely depends
                        on <InlineMath math={"x_0"}/>: at <InlineMath math={"x_0 = 10"}/> the same{" "}
                        <InlineMath math={"\\epsilon = 0.01"}/> would need{" "}
                        <InlineMath math={"\\delta \\approx 0.0005"}/>, twenty times smaller. Continuity
                        at a point never promised one <InlineMath math={"\\delta"}/> for all points, and
                        the definition that does promise that is called uniform continuity.
                    </p>}
                    ko={<p>
                        셋째 열이 정확히 허용 오차와 같아서 창이 가능한 만큼 넓다는 것을 확인해 준다. 읽어
                        둘 것이 둘 있다. 여기서 응답 <InlineMath math={"\\delta"}/>는 대략{" "}
                        <InlineMath math={"\\epsilon/2"}/>이고 그것이{" "}
                        <InlineMath math={"1/f'(1)"}/>이다. 미분이 두 허용 오차 사이의 환율인 셈이다.
                        그리고 <InlineMath math={"\\delta"}/>는 정말로{" "}
                        <InlineMath math={"x_0"}/>에 의존한다.{" "}
                        <InlineMath math={"x_0 = 10"}/>에서라면 같은{" "}
                        <InlineMath math={"\\epsilon = 0.01"}/>에 스무 배 작은{" "}
                        <InlineMath math={"\\delta \\approx 0.0005"}/>가 필요하다. 한 점에서의 연속은
                        모든 점에 통하는 하나의 <InlineMath math={"\\delta"}/>를 약속한 적이 없고, 그것을
                        약속하는 정의는 균등 연속이라 부른다.
                    </p>}
                />
                <T
                    en={<p>
                        <strong>The non-example.</strong> Put{" "}
                        <InlineMath math={"g(x) = x/2"}/> for{" "}
                        <InlineMath math={"x \\le 1"}/> and{" "}
                        <InlineMath math={"g(x) = x/2 + 1.2"}/> for{" "}
                        <InlineMath math={"x > 1"}/>, so{" "}
                        <InlineMath math={"g(1) = 0.5"}/> and the jump is{" "}
                        <InlineMath math={"1.2"}/>. Choose{" "}
                        <InlineMath math={"\\epsilon = 1.0"}/>. Given any{" "}
                        <InlineMath math={"\\delta > 0"}/>, the witness{" "}
                        <InlineMath math={"x = 1 + \\delta/2"}/> lies in{" "}
                        <InlineMath math={"B_\\delta(1)"}/> and has
                    </p>}
                    ko={<p>
                        <strong>반례.</strong>{" "}
                        <InlineMath math={"x \\le 1"}/>에서{" "}
                        <InlineMath math={"g(x) = x/2"}/>,{" "}
                        <InlineMath math={"x > 1"}/>에서{" "}
                        <InlineMath math={"g(x) = x/2 + 1.2"}/>로 두면{" "}
                        <InlineMath math={"g(1) = 0.5"}/>이고 도약은{" "}
                        <InlineMath math={"1.2"}/>다.{" "}
                        <InlineMath math={"\\epsilon = 1.0"}/>을 고르자. 어떤{" "}
                        <InlineMath math={"\\delta > 0"}/>이 주어지든 증인{" "}
                        <InlineMath math={"x = 1 + \\delta/2"}/>가{" "}
                        <InlineMath math={"B_\\delta(1)"}/> 안에 있고
                    </p>}
                />
                <BlockMath math={"|g(1 + \\delta/2) - g(1)| = \\left| \\frac{1 + \\delta/2}{2} + 1.2 - 0.5 \\right| = 1.2 + \\frac{\\delta}{4} \\ \\ge\\ 1.2 \\ >\\ \\epsilon."}/>
                <Terms items={[
                    ["1.2 + \\delta/4", <T en={<>the gap never shrinks below the size of the jump, no matter how small <InlineMath math={"\\delta"}/> is made. Shrinking <InlineMath math={"\\delta"}/> is the only move available and it does not help</>}
                                           ko={<><InlineMath math={"\\delta"}/>를 아무리 작게 만들어도 이 간격은 도약의 크기 아래로 내려가지 않는다. 쓸 수 있는 수는 <InlineMath math={"\\delta"}/>를 줄이는 것뿐인데 그것이 도움이 되지 않는다</>}/>],
                ]}/>
                <T
                    en={<p>
                        So no <InlineMath math={"\\delta"}/> works for this{" "}
                        <InlineMath math={"\\epsilon"}/>, and{" "}
                        <InlineMath math={"g"}/> is discontinuous at{" "}
                        <InlineMath math={"1"}/>. Note that it fails only for{" "}
                        <InlineMath math={"\\epsilon \\le 1.2"}/>; at{" "}
                        <InlineMath math={"\\epsilon = 2"}/> a{" "}
                        <InlineMath math={"\\delta"}/> does exist. The definition breaks where it
                        matters, at small tolerances, which is where all the content of a limit lives.
                    </p>}
                    ko={<p>
                        그러므로 이 <InlineMath math={"\\epsilon"}/>에는 통하는{" "}
                        <InlineMath math={"\\delta"}/>가 없고{" "}
                        <InlineMath math={"g"}/>는 <InlineMath math={"1"}/>에서 불연속이다. 다만{" "}
                        <InlineMath math={"\\epsilon \\le 1.2"}/>에서만 깨진다는 점에 유의하라.{" "}
                        <InlineMath math={"\\epsilon = 2"}/>에서는 통하는{" "}
                        <InlineMath math={"\\delta"}/>가 존재한다. 정의는 중요한 곳에서, 즉 작은 허용
                        오차에서 깨지고, 극한의 내용은 전부 거기에 산다.
                    </p>}
                />
            </Example>
            <Theorem n="6.49" title={<T en={<>Continuity at a point via sequences</>} ko={<>수열로 본 한 점에서의 연속</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\|\\bullet\\|)"}/> and{" "}
                        <InlineMath math={"(\\mathcal{Y}, |\\!|\\!|\\bullet|\\!|\\!|)"}/> be normed
                        spaces and <InlineMath math={"f : \\mathcal{X} \\to \\mathcal{Y}"}/> a function.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\|\\bullet\\|)"}/>와{" "}
                        <InlineMath math={"(\\mathcal{Y}, |\\!|\\!|\\bullet|\\!|\\!|)"}/>가 normed
                        space이고 <InlineMath math={"f : \\mathcal{X} \\to \\mathcal{Y}"}/>가 함수라 하자.
                    </p>}
                />
                <T
                    en={<ol>
                        <li>If <InlineMath math={"f"}/> is continuous at{" "}
                            <InlineMath math={"x_0"}/> and <InlineMath math={"(x_n)"}/> is a sequence in{" "}
                            <InlineMath math={"\\mathcal{X}"}/> converging to{" "}
                            <InlineMath math={"x_0"}/>, then{" "}
                            <InlineMath math={"y_n := f(x_n)"}/> converges to{" "}
                            <InlineMath math={"f(x_0)"}/> in <InlineMath math={"\\mathcal{Y}"}/>.</li>
                        <li>If <InlineMath math={"f"}/> is discontinuous at{" "}
                            <InlineMath math={"x_0"}/>, then there exists a sequence{" "}
                            <InlineMath math={"(x_n)"}/> with{" "}
                            <InlineMath math={"x_n \\to x_0"}/> and{" "}
                            <InlineMath math={"f(x_n) \\not\\to f(x_0)"}/>.</li>
                    </ol>}
                    ko={<ol>
                        <li><InlineMath math={"f"}/>가 <InlineMath math={"x_0"}/>에서 연속이고{" "}
                            <InlineMath math={"(x_n)"}/>이 <InlineMath math={"\\mathcal{X}"}/>에서{" "}
                            <InlineMath math={"x_0"}/>로 수렴하는 수열이면,{" "}
                            <InlineMath math={"y_n := f(x_n)"}/>이{" "}
                            <InlineMath math={"\\mathcal{Y}"}/>에서{" "}
                            <InlineMath math={"f(x_0)"}/>로 수렴한다.</li>
                        <li><InlineMath math={"f"}/>가 <InlineMath math={"x_0"}/>에서 불연속이면,{" "}
                            <InlineMath math={"x_n \\to x_0"}/>이면서{" "}
                            <InlineMath math={"f(x_n) \\not\\to f(x_0)"}/>인 수열{" "}
                            <InlineMath math={"(x_n)"}/>이 존재한다.</li>
                    </ol>}
                />
                <T
                    en={<p>
                        The notes leave the proof to homework. The idea for (a) is to chain the two
                        definitions: given <InlineMath math={"\\epsilon"}/>, continuity hands you{" "}
                        <InlineMath math={"\\delta"}/>, and convergence of{" "}
                        <InlineMath math={"(x_n)"}/> applied with tolerance{" "}
                        <InlineMath math={"\\delta"}/> hands you{" "}
                        <InlineMath math={"N"}/>. For (b), take the bad{" "}
                        <InlineMath math={"\\epsilon"}/> from Remark 6.48 and feed it{" "}
                        <InlineMath math={"\\delta = 1/n"}/>, collecting the witnesses into a sequence.
                        Corollary 6.50 states the combined result:
                    </p>}
                    ko={<p>
                        교재는 증명을 숙제로 남긴다. (a)의 아이디어는 두 정의를 이어 붙이는 것이다.{" "}
                        <InlineMath math={"\\epsilon"}/>이 주어지면 연속성이{" "}
                        <InlineMath math={"\\delta"}/>를 건네주고,{" "}
                        <InlineMath math={"(x_n)"}/>의 수렴을 허용 오차{" "}
                        <InlineMath math={"\\delta"}/>에 대해 쓰면{" "}
                        <InlineMath math={"N"}/>이 나온다. (b)는 참고 6.48의 나쁜{" "}
                        <InlineMath math={"\\epsilon"}/>을 가져와{" "}
                        <InlineMath math={"\\delta = 1/n"}/>을 먹이고 증인들을 모아 수열로 만든다.
                        따름정리 6.50이 합친 결과를 진술한다.
                    </p>}
                />
                <BlockMath math={"\\bigl( f \\text{ is continuous at } x_0 \\bigr) \\iff \\bigl( x_n \\to x_0 \\implies f(x_n) \\to f(x_0) \\bigr)"}/>
                <Terms items={[
                    ["\\iff", <T en={<>an equivalence, so either side may be taken as the definition. The sequence side is usually the easier one to <em>use</em> in a proof, and the <InlineMath math={"\\epsilon"}/>-<InlineMath math={"\\delta"}/> side the easier one to <em>verify</em> for a given formula</>}
                                 ko={<>동치이므로 어느 쪽이든 정의로 삼을 수 있다. 증명에서 <em>쓰기</em>에는 대개 수열 쪽이 쉽고, 주어진 식에 대해 <em>확인</em>하기에는 <InlineMath math={"\\epsilon"}/>-<InlineMath math={"\\delta"}/> 쪽이 쉽다</>}/>],
                ]}/>
                <T
                    en={<p>
                        This is the same pattern as Corollary 6.28. Sequences completely characterize
                        closed sets, and they completely characterize continuity at a point. That is why
                        the Weierstrass proof in the next section can be written almost entirely in
                        sequences, and it is why the definition was worth the trouble.
                    </p>}
                    ko={<p>
                        따름정리 6.28과 같은 구조다. 수열이 닫힌 집합을 완전히 특징짓고, 한 점에서의
                        연속성도 완전히 특징짓는다. 다음 절의 Weierstrass 증명을 거의 전부 수열로 적을 수
                        있는 이유가 그것이고, 이 정의가 수고를 들일 값어치가 있었던 이유가 그것이다.
                    </p>}
                />
            </Theorem>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Compact Sets and the Existence of Extrema</h2>} ko={<h2>컴팩트 집합과 극값의 존재</h2>}/>
            <T
                en={<p>
                    The second payoff. Chapter 7 will set up optimization problems, and every one of them
                    begins by writing <InlineMath math={"\\min_{x \\in C} f(x)"}/> as though that object
                    exists. This section says when it does. The answer is two properties of{" "}
                    <InlineMath math={"C"}/>, closed and bounded, and remarkably it does not depend on{" "}
                    <InlineMath math={"f"}/> beyond continuity.
                </p>}
                ko={<p>
                    두 번째 결실이다. 7장은 최적화 문제를 세울 것이고, 그 하나하나가{" "}
                    <InlineMath math={"\\min_{x \\in C} f(x)"}/>를 마치 그것이 존재하는 양 적는 것으로
                    시작한다. 이 절은 언제 존재하는지를 말한다. 답은 <InlineMath math={"C"}/>의 두 성질,
                    닫힘과 유계이고, 놀랍게도 연속성 말고는{" "}
                    <InlineMath math={"f"}/>에 의존하지 않는다.
                </p>}
            />
            <Definition n="6.51" title={<T en={<>Subsequence</>} ko={<>부분수열</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(x_n)"}/> be a sequence and{" "}
                        <InlineMath math={"1 \\le n_1 < n_2 < n_3 < \\cdots"}/> an infinite set of
                        strictly increasing integers. Then{" "}
                        <InlineMath math={"(x_{n_i})"}/> is a <strong>subsequence</strong> of{" "}
                        <InlineMath math={"(x_n)"}/>. Note in passing that{" "}
                        <InlineMath math={"n_i \\ge i"}/> for all <InlineMath math={"i \\ge 1"}/>.
                        Example 6.52: <InlineMath math={"n_i = 2i + 1"}/> or{" "}
                        <InlineMath math={"n_i = 2^i"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(x_n)"}/>이 수열이고{" "}
                        <InlineMath math={"1 \\le n_1 < n_2 < n_3 < \\cdots"}/>이 순증가하는 정수의 무한
                        집합이면 <InlineMath math={"(x_{n_i})"}/>를{" "}
                        <InlineMath math={"(x_n)"}/>의 <strong>부분수열</strong>이라 한다. 지나가며
                        적어 두면 모든 <InlineMath math={"i \\ge 1"}/>에서{" "}
                        <InlineMath math={"n_i \\ge i"}/>다. 예제 6.52:{" "}
                        <InlineMath math={"n_i = 2i + 1"}/> 또는{" "}
                        <InlineMath math={"n_i = 2^i"}/>.
                    </p>}
                />
                <T
                    en={<p>
                        <strong>Lemma 6.53.</strong> If <InlineMath math={"x_n \\to x"}/> then every
                        subsequence <InlineMath math={"(x_{n_i})"}/> converges to{" "}
                        <InlineMath math={"x"}/>. The proof is the observation{" "}
                        <InlineMath math={"n_i \\ge i"}/>: the <InlineMath math={"N"}/> that works for
                        the sequence works for the subsequence unchanged.
                    </p>}
                    ko={<p>
                        <strong>보조정리 6.53.</strong> <InlineMath math={"x_n \\to x"}/>이면 모든
                        부분수열 <InlineMath math={"(x_{n_i})"}/>가{" "}
                        <InlineMath math={"x"}/>로 수렴한다. 증명은{" "}
                        <InlineMath math={"n_i \\ge i"}/>라는 관찰이다. 수열에 통하는{" "}
                        <InlineMath math={"N"}/>이 부분수열에도 그대로 통한다.
                    </p>}
                />
            </Definition>
            <Definition n="6.54" title={<T en={<>Bounded set</>} ko={<>유계 집합</>}/>}>
                <T
                    en={<p>
                        A set <InlineMath math={"S"}/> is <strong>bounded</strong> if there exists{" "}
                        <InlineMath math={"r < \\infty"}/> such that{" "}
                        <InlineMath math={"S \\subset B_r(0)"}/>. Exercise 6.55 records the equivalent
                        forms:
                    </p>}
                    ko={<p>
                        <InlineMath math={"S \\subset B_r(0)"}/>인{" "}
                        <InlineMath math={"r < \\infty"}/>가 존재하면 집합{" "}
                        <InlineMath math={"S"}/>가 <strong>유계</strong>라고 한다. 연습문제 6.55가 동치
                        형태들을 적어 둔다.
                    </p>}
                />
                <T
                    en={<ol>
                        <li><InlineMath math={"S"}/> is bounded if, and only if,{" "}
                            <InlineMath math={"\\sup_{x \\in S} \\|x\\| < \\infty"}/>.</li>
                        <li>Hence <InlineMath math={"S"}/> is unbounded if, and only if,{" "}
                            <InlineMath math={"\\sup_{x \\in S} \\|x\\| = \\infty"}/>.</li>
                        <li><InlineMath math={"S"}/> is unbounded if, and only if, there exists a
                            sequence <InlineMath math={"(x_k)"}/> with{" "}
                            <InlineMath math={"x_k \\in S"}/> and{" "}
                            <InlineMath math={"\\|x_{k+1}\\| \\ge \\|x_k\\| + 1"}/> for all{" "}
                            <InlineMath math={"k \\ge 1"}/>.</li>
                    </ol>}
                    ko={<ol>
                        <li><InlineMath math={"S"}/>가 유계인 것과{" "}
                            <InlineMath math={"\\sup_{x \\in S} \\|x\\| < \\infty"}/>인 것은 동치다.</li>
                        <li>따라서 <InlineMath math={"S"}/>가 유계가 아닌 것과{" "}
                            <InlineMath math={"\\sup_{x \\in S} \\|x\\| = \\infty"}/>인 것은 동치다.</li>
                        <li><InlineMath math={"S"}/>가 유계가 아닌 것과, 모든{" "}
                            <InlineMath math={"k \\ge 1"}/>에서{" "}
                            <InlineMath math={"x_k \\in S"}/>이고{" "}
                            <InlineMath math={"\\|x_{k+1}\\| \\ge \\|x_k\\| + 1"}/>인 수열{" "}
                            <InlineMath math={"(x_k)"}/>이 존재하는 것은 동치다.</li>
                    </ol>}
                />
            </Definition>
            <Lemma n="6.56" title={<T en={<>Unbounded sets contain a sequence with no convergent subsequence</>}
                                      ko={<>유계가 아닌 집합은 수렴하는 부분수열이 없는 수열을 품는다</>}/>}>
                <Proof>
                    <T
                        en={<p>
                            Take the sequence <InlineMath math={"(x_n)"}/> from Exercise 6.55, part 3,
                            which satisfies{" "}
                            <InlineMath math={"\\|x_{k+1}\\| \\ge \\|x_k\\| + 1"}/> and hence{" "}
                            <InlineMath math={"\\bigl|\\ \\|x_{n_i}\\| - \\|x_{n_j}\\| \\ \\bigr| \\ge |n_i - n_j|"}/>{" "}
                            for any two indices. By Remark 6.23, for any subsequence,
                        </p>}
                        ko={<p>
                            연습문제 6.55의 3번에서 수열 <InlineMath math={"(x_n)"}/>을 가져오자.{" "}
                            <InlineMath math={"\\|x_{k+1}\\| \\ge \\|x_k\\| + 1"}/>을 만족하므로 두 지수에
                            대해{" "}
                            <InlineMath math={"\\bigl|\\ \\|x_{n_i}\\| - \\|x_{n_j}\\| \\ \\bigr| \\ge |n_i - n_j|"}/>이다.
                            참고 6.23에 따라 어떤 부분수열에 대해서든
                        </p>}
                    />
                    <BlockMath math={"\\|x_{n_i} - x_{n_j}\\| \\ \\ge\\ \\bigl|\\ \\|x_{n_i}\\| - \\|x_{n_j}\\| \\ \\bigr| \\ \\ge\\ |n_i - n_j| \\ \\ge\\ 1 \\quad \\text{for } i \\ne j,"}/>
                    <Terms items={[
                        ["|n_i - n_j|", <T en={<>at least <InlineMath math={"1"}/> whenever <InlineMath math={"i \\ne j"}/>, since the indices are strictly increasing integers</>}
                                           ko={<>지수가 순증가하는 정수이므로 <InlineMath math={"i \\ne j"}/>이면 적어도 <InlineMath math={"1"}/>이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            so no subsequence is Cauchy. Because it is not Cauchy, by the contrapositive
                            of Proposition 6.32 it cannot be convergent.
                        </p>}
                        ko={<p>
                            그러므로 어떤 부분수열도 Cauchy가 아니다. Cauchy가 아니므로 명제 6.32의
                            대우에 의해 수렴할 수 없다.
                        </p>}
                    />
                </Proof>
            </Lemma>
            <Remark title={<T en={<>Optional read: norm equivalence (notes 6.57 to 6.61)</>}
                              ko={<>선택 읽기: norm 동치 (교재 6.57~6.61)</>}/>}>
                <T
                    en={<p>
                        The next few results can be skipped on a first pass. They exist to let the
                        Bolzano-Weierstrass proof reduce a statement about an arbitrary finite
                        dimensional normed space to a statement about{" "}
                        <InlineMath math={"\\mathbb{R}"}/>, one coordinate at a time. Come back when you
                        want to know why the choice of norm never appeared in any of the results.
                    </p>}
                    ko={<p>
                        다음 몇 결과는 첫 독에서 건너뛰어도 된다. 이들이 있는 이유는
                        Bolzano-Weierstrass 증명이 임의의 유한 차원 normed space에 대한 진술을 좌표
                        하나씩 <InlineMath math={"\\mathbb{R}"}/>에 대한 진술로 내려보낼 수 있게 하기
                        위해서다. 어느 결과에도 norm의 선택이 나타나지 않은 이유가 궁금해질 때 돌아오면
                        된다.
                    </p>}
                />
                <T
                    en={<p>
                        <strong>Definition 6.57.</strong> Two norms{" "}
                        <InlineMath math={"\\|\\cdot\\|"}/> and{" "}
                        <InlineMath math={"|\\!|\\!|\\cdot|\\!|\\!|"}/> on a vector space{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathbb{R})"}/> are{" "}
                        <strong>equivalent</strong> if there exist positive constants{" "}
                        <InlineMath math={"K_1, K_2"}/> such that for all{" "}
                        <InlineMath math={"x \\in \\mathcal{X}"}/>,
                    </p>}
                    ko={<p>
                        <strong>정의 6.57.</strong> 벡터 공간{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathbb{R})"}/> 위의 두 norm{" "}
                        <InlineMath math={"\\|\\cdot\\|"}/>과{" "}
                        <InlineMath math={"|\\!|\\!|\\cdot|\\!|\\!|"}/>이 <strong>동치</strong>라는 것은
                        모든 <InlineMath math={"x \\in \\mathcal{X}"}/>에 대해 다음을 만족하는 양의 상수{" "}
                        <InlineMath math={"K_1, K_2"}/>가 존재한다는 뜻이다.
                    </p>}
                />
                <BlockMath math={"K_1 |\\!|\\!| x |\\!|\\!| \\le \\|x\\| \\le K_2 |\\!|\\!| x |\\!|\\!|"}/>
                <Terms items={[
                    ["K_1, K_2", <T en={<>fixed constants, independent of <InlineMath math={"x"}/>. Remark 6.58 rearranges this to <InlineMath math={"\\tfrac{1}{K_2}\\|x\\| \\le |\\!|\\!|x|\\!|\\!| \\le \\tfrac{1}{K_1}\\|x\\|"}/>, showing the relation is symmetric</>}
                                    ko={<><InlineMath math={"x"}/>에 무관한 고정 상수. 참고 6.58이 이것을 <InlineMath math={"\\tfrac{1}{K_2}\\|x\\| \\le |\\!|\\!|x|\\!|\\!| \\le \\tfrac{1}{K_1}\\|x\\|"}/>로 옮겨 적어 이 관계가 대칭임을 보인다</>}/>],
                    ["\\text{consequence}", <T en={<>equivalent norms have the same convergent sequences, the same Cauchy sequences, and hence the same open and closed sets. Chapter 3's norm ball figure is this statement drawn</>}
                                               ko={<>동치인 norm들은 수렴하는 수열도, Cauchy 수열도, 따라서 열린 집합과 닫힌 집합도 같다. 3장의 norm 공 그림이 이 진술을 그린 것이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        <strong>Lemma 6.59.</strong> Fix a basis{" "}
                        <InlineMath math={"\\{v\\} = \\{v^1, \\ldots, v^n\\}"}/> of{" "}
                        <InlineMath math={"\\mathcal{X}"}/>, let{" "}
                        <InlineMath math={"M_i := \\operatorname{span}\\{v^j \\mid j \\ne i\\}"}/> be the{" "}
                        <InlineMath math={"(n-1)"}/>-dimensional subspace missing the{" "}
                        <InlineMath math={"i"}/>-th vector, and set{" "}
                        <InlineMath math={"\\delta_i := d(v^i, M_i)"}/>. Because{" "}
                        <InlineMath math={"M_i"}/> is finite dimensional it is complete and hence closed,
                        and <InlineMath math={"v^i \\notin M_i"}/>, so{" "}
                        <InlineMath math={"\\delta_i > 0"}/>. Then for any{" "}
                        <InlineMath math={"x = \\alpha_1 v^1 + \\cdots + \\alpha_n v^n"}/>,
                    </p>}
                    ko={<p>
                        <strong>보조정리 6.59.</strong>{" "}
                        <InlineMath math={"\\mathcal{X}"}/>의 기저{" "}
                        <InlineMath math={"\\{v\\} = \\{v^1, \\ldots, v^n\\}"}/>을 고정하고,{" "}
                        <InlineMath math={"i"}/>번째 벡터만 빠진{" "}
                        <InlineMath math={"(n-1)"}/>차원 부분 공간을{" "}
                        <InlineMath math={"M_i := \\operatorname{span}\\{v^j \\mid j \\ne i\\}"}/>,{" "}
                        <InlineMath math={"\\delta_i := d(v^i, M_i)"}/>라 하자.{" "}
                        <InlineMath math={"M_i"}/>가 유한 차원이라 완비이고 따라서 닫혔으며{" "}
                        <InlineMath math={"v^i \\notin M_i"}/>이므로{" "}
                        <InlineMath math={"\\delta_i > 0"}/>이다. 그러면 임의의{" "}
                        <InlineMath math={"x = \\alpha_1 v^1 + \\cdots + \\alpha_n v^n"}/>에 대해
                    </p>}
                />
                <BlockMath math={"\\kappa_* \\left( \\max_{1 \\le i \\le n} |\\alpha_i| \\right) \\le \\|x\\| \\le \\kappa^* \\left( \\sum_{i=1}^{n} |\\alpha_i| \\right) \\le n\\kappa^* \\left( \\max_{1 \\le i \\le n} |\\alpha_i| \\right)"}/>
                <Terms items={[
                    ["\\kappa_*", <T en={<><InlineMath math={"\\min_{1 \\le i \\le n} \\{\\delta_i\\} > 0"}/>, the smallest distance from a basis vector to the span of the others. It is positive precisely because the basis is independent</>}
                                     ko={<><InlineMath math={"\\min_{1 \\le i \\le n} \\{\\delta_i\\} > 0"}/>. 기저 벡터에서 나머지가 만드는 공간까지의 거리 중 가장 작은 것이다. 기저가 독립이기 때문에 정확히 그 이유로 양수다</>}/>],
                    ["\\kappa^*", <T en={<><InlineMath math={"\\max_{1 \\le i \\le n} \\{ |\\!|\\!| v^i |\\!|\\!| \\} < \\infty"}/>, the length of the longest basis vector</>}
                                     ko={<><InlineMath math={"\\max_{1 \\le i \\le n} \\{ |\\!|\\!| v^i |\\!|\\!| \\} < \\infty"}/>. 가장 긴 기저 벡터의 길이다</>}/>],
                    ["\\alpha", <T en={<><InlineMath math={"[x]_{\\{v\\}}"}/>, the coordinate column of <InlineMath math={"x"}/> in the basis, exactly as in Chapter 2</>}
                                   ko={<><InlineMath math={"[x]_{\\{v\\}}"}/>. 2장에서와 똑같이 그 기저에서의 <InlineMath math={"x"}/>의 좌표 열이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The right hand inequality is the triangle inequality. The left hand one is the
                        work, and the notes leave it as an enumerated exercise; the key step is that{" "}
                        <InlineMath math={"\\|x\\| \\ge d(x, M_i) = |\\alpha_i| \\delta_i"}/> for every{" "}
                        <InlineMath math={"i"}/>. Reading it: any norm on an{" "}
                        <InlineMath math={"n"}/>-dimensional space is trapped between two multiples of
                        the max-norm of the coordinates. Corollary 6.60 concludes that{" "}
                        <strong>all norms on a finite dimensional vector space are equivalent</strong>,
                        and Corollary 6.61 that a sequence is Cauchy in{" "}
                        <InlineMath math={"\\mathcal{X}"}/> if, and only if, each of its{" "}
                        <InlineMath math={"n"}/> coordinate sequences is Cauchy in{" "}
                        <InlineMath math={"\\mathbb{R}"}/>. That last one is the tool the next proof
                        needs.
                    </p>}
                    ko={<p>
                        오른쪽 부등식은 삼각부등식이다. 왼쪽이 일거리이고 교재는 그것을 번호 붙인
                        연습으로 남긴다. 핵심 단계는 모든 <InlineMath math={"i"}/>에서{" "}
                        <InlineMath math={"\\|x\\| \\ge d(x, M_i) = |\\alpha_i| \\delta_i"}/>라는 것이다.
                        읽어 보면, <InlineMath math={"n"}/>차원 공간의 어떤 norm이든 좌표의 max-norm의 두
                        상수배 사이에 갇힌다. 따름정리 6.60이{" "}
                        <strong>유한 차원 벡터 공간의 모든 norm은 동치</strong>라고 결론짓고, 따름정리
                        6.61은 수열이 <InlineMath math={"\\mathcal{X}"}/>에서 Cauchy인 것과 그{" "}
                        <InlineMath math={"n"}/>개 좌표 수열 각각이{" "}
                        <InlineMath math={"\\mathbb{R}"}/>에서 Cauchy인 것이 동치라고 말한다. 마지막
                        것이 다음 증명에 필요한 도구다.
                    </p>}
                />
            </Remark>
            <Theorem n="6.62" title={<T en={<>Bolzano-Weierstrass, or the Sequential Compactness Theorem</>}
                                        ko={<>Bolzano-Weierstrass 정리, 또는 순차 컴팩트성 정리</>}/>}>
                <T
                    en={<p>
                        In a <strong>finite dimensional</strong> normed space{" "}
                        <InlineMath math={"(\\mathcal{X}, \\|\\bullet\\|)"}/>, the following two
                        properties are equivalent for a set{" "}
                        <InlineMath math={"C \\subset \\mathcal{X}"}/>.
                    </p>}
                    ko={<p>
                        <strong>유한 차원</strong> normed space{" "}
                        <InlineMath math={"(\\mathcal{X}, \\|\\bullet\\|)"}/>에서 집합{" "}
                        <InlineMath math={"C \\subset \\mathcal{X}"}/>에 대해 다음 두 성질은 동치다.
                    </p>}
                />
                <T
                    en={<ol>
                        <li><InlineMath math={"C"}/> is closed and bounded;</li>
                        <li>every sequence in <InlineMath math={"C"}/> contains a convergent
                            subsequence, that is, for every sequence{" "}
                            <InlineMath math={"(x_n)"}/> in <InlineMath math={"C"}/> there exists{" "}
                            <InlineMath math={"x_0 \\in C"}/> and a subsequence{" "}
                            <InlineMath math={"(x_{n_i})"}/> with{" "}
                            <InlineMath math={"x_{n_i} \\to x_0"}/>.</li>
                    </ol>}
                    ko={<ol>
                        <li><InlineMath math={"C"}/>가 닫혔고 유계다.</li>
                        <li><InlineMath math={"C"}/> 안의 모든 수열이 수렴하는 부분수열을 갖는다. 즉{" "}
                            <InlineMath math={"C"}/> 안의 모든 수열{" "}
                            <InlineMath math={"(x_n)"}/>에 대해{" "}
                            <InlineMath math={"x_{n_i} \\to x_0"}/>인{" "}
                            <InlineMath math={"x_0 \\in C"}/>와 부분수열{" "}
                            <InlineMath math={"(x_{n_i})"}/>이 존재한다.</li>
                    </ol>}
                />
                <T
                    en={<p>
                        The finite dimensionality hypothesis is not decoration. It is used only in one
                        direction, and the proof marks the exact line where it enters.
                    </p>}
                    ko={<p>
                        유한 차원이라는 가설은 장식이 아니다. 한쪽 방향에서만 쓰이고, 증명이 그것이
                        들어오는 줄을 정확히 표시한다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            <strong>First, not (a) implies not (b).</strong> There are two cases.
                        </p>}
                        ko={<p>
                            <strong>먼저 (a)가 아니면 (b)도 아님을 보인다.</strong> 두 경우가 있다.
                        </p>}
                    />
                    <T
                        en={<p>
                            Suppose <InlineMath math={"C"}/> is <em>not closed</em>. Then by Corollary
                            6.28 there exists a limit point{" "}
                            <InlineMath math={"x_0 \\in \\overline{C}"}/> with{" "}
                            <InlineMath math={"x_0 \\notin C"}/>. Hence there is a sequence{" "}
                            <InlineMath math={"(x_n)"}/> with{" "}
                            <InlineMath math={"x_n \\in C"}/> and{" "}
                            <InlineMath math={"x_n \\to x_0 \\notin C"}/>. By Lemma 6.53 every
                            subsequence also converges to{" "}
                            <InlineMath math={"x_0"}/>, so we have built a sequence of elements of{" "}
                            <InlineMath math={"C"}/> for which no subsequence has a limit in{" "}
                            <InlineMath math={"C"}/>.
                        </p>}
                        ko={<p>
                            <InlineMath math={"C"}/>가 <em>닫히지 않았다</em>고 하자. 따름정리 6.28에
                            의해 <InlineMath math={"x_0 \\notin C"}/>인 극한점{" "}
                            <InlineMath math={"x_0 \\in \\overline{C}"}/>가 존재한다. 따라서{" "}
                            <InlineMath math={"x_n \\in C"}/>이고{" "}
                            <InlineMath math={"x_n \\to x_0 \\notin C"}/>인 수열{" "}
                            <InlineMath math={"(x_n)"}/>이 있다. 보조정리 6.53에 의해 모든 부분수열도{" "}
                            <InlineMath math={"x_0"}/>로 수렴하므로, 어떤 부분수열도{" "}
                            <InlineMath math={"C"}/> 안에 극한을 갖지 않는{" "}
                            <InlineMath math={"C"}/>의 원소 수열을 만든 것이다.
                        </p>}
                    />
                    <T
                        en={<p>
                            Suppose next <InlineMath math={"C"}/> is <em>unbounded</em>. Then Lemma 6.56
                            produces a sequence of elements of{" "}
                            <InlineMath math={"C"}/> for which every subsequence fails to be Cauchy and
                            hence cannot converge. Nothing in either case used finite dimensionality.
                        </p>}
                        ko={<p>
                            다음으로 <InlineMath math={"C"}/>가 <em>유계가 아니라</em>고 하자. 보조정리
                            6.56이 모든 부분수열이 Cauchy가 아니어서 수렴할 수 없는{" "}
                            <InlineMath math={"C"}/>의 원소 수열을 만들어 낸다. 두 경우 어디에서도 유한
                            차원성을 쓰지 않았다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>Now (a) implies (b).</strong> Let{" "}
                            <InlineMath math={"(x_n)"}/> be an arbitrary sequence built from elements of{" "}
                            <InlineMath math={"C"}/>.
                        </p>}
                        ko={<p>
                            <strong>이제 (a)가 (b)를 함의함을 보인다.</strong>{" "}
                            <InlineMath math={"C"}/>의 원소로 만든 임의의 수열{" "}
                            <InlineMath math={"(x_n)"}/>을 잡자.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>Case 1: finitely many distinct elements.</strong> Then at least one
                            value <InlineMath math={"x_N \\in C"}/> is repeated infinitely often, so
                            choose <InlineMath math={"n_1 < n_2 < \\cdots"}/> with{" "}
                            <InlineMath math={"x_{n_i} = x_N"}/> for all{" "}
                            <InlineMath math={"i \\ge 1"}/>. The constant subsequence converges to{" "}
                            <InlineMath math={"x_N \\in C"}/> and we are done.
                        </p>}
                        ko={<p>
                            <strong>경우 1: 서로 다른 원소가 유한개.</strong> 그러면 어떤 값{" "}
                            <InlineMath math={"x_N \\in C"}/>이 무한히 여러 번 되풀이되므로, 모든{" "}
                            <InlineMath math={"i \\ge 1"}/>에서{" "}
                            <InlineMath math={"x_{n_i} = x_N"}/>인{" "}
                            <InlineMath math={"n_1 < n_2 < \\cdots"}/>를 고른다. 그 상수 부분수열이{" "}
                            <InlineMath math={"x_N \\in C"}/>로 수렴하고 끝난다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>Case 2: infinitely many distinct elements.</strong> Here is where{" "}
                            <InlineMath math={"\\mathcal{X}"}/> being finite dimensional is invoked. By
                            Corollary 6.61, a subsequence converges if, and only if, each of its
                            coordinate sequences converges, so it suffices to prove the claim for a real
                            sequence <InlineMath math={"(a_n)"}/> with infinitely many distinct elements
                            inside a closed bounded{" "}
                            <InlineMath math={"C_1 \\subset \\mathbb{R}"}/>. Every bounded subset of{" "}
                            <InlineMath math={"\\mathbb{R}"}/> sits inside some{" "}
                            <InlineMath math={"[-N, N]"}/>, and some closed unit interval{" "}
                            <InlineMath math={"[n, n+1]"}/> with{" "}
                            <InlineMath math={"|n| \\le N"}/> must contain infinitely many elements of{" "}
                            <InlineMath math={"(a_n)"}/>. Without loss of generality take that interval
                            to be <InlineMath math={"[0, 1]"}/>.
                        </p>}
                        ko={<p>
                            <strong>경우 2: 서로 다른 원소가 무한개.</strong>{" "}
                            <InlineMath math={"\\mathcal{X}"}/>가 유한 차원이라는 것이 불려 나오는
                            자리가 여기다. 따름정리 6.61에 의해 부분수열이 수렴하는 것과 그 좌표 수열
                            각각이 수렴하는 것이 동치이므로, 닫히고 유계인{" "}
                            <InlineMath math={"C_1 \\subset \\mathbb{R}"}/> 안에서 서로 다른 원소를 무한히
                            많이 갖는 실수열 <InlineMath math={"(a_n)"}/>에 대해 주장을 증명하면 충분하다.{" "}
                            <InlineMath math={"\\mathbb{R}"}/>의 모든 유계 부분집합은 어떤{" "}
                            <InlineMath math={"[-N, N]"}/> 안에 들어앉고,{" "}
                            <InlineMath math={"|n| \\le N"}/>인 어떤 닫힌 단위 구간{" "}
                            <InlineMath math={"[n, n+1]"}/>이{" "}
                            <InlineMath math={"(a_n)"}/>의 원소를 무한히 많이 품어야 한다. 일반성을 잃지
                            않고 그 구간을 <InlineMath math={"[0, 1]"}/>이라 하자.
                        </p>}
                    />
                    <T
                        en={<p>
                            Now bisect repeatedly. Divide{" "}
                            <InlineMath math={"[0,1] = [0, 1/2] \\cup [1/2, 1]"}/>; at least one half
                            contains infinitely many elements of{" "}
                            <InlineMath math={"(a_n)"}/>. Say it is the right half. Divide{" "}
                            <InlineMath math={"[1/2, 1] = [1/2, 3/4] \\cup [3/4, 1]"}/>, and again at
                            least one half contains infinitely many. Say the left this time, and divide{" "}
                            <InlineMath math={"[1/2, 3/4] = [1/2, 5/8] \\cup [5/8, 3/4]"}/>. Continue. At
                            the <InlineMath math={"k"}/>-th step you hold a closed interval{" "}
                            <InlineMath math={"I_k \\subset [0,1]"}/> of length{" "}
                            <InlineMath math={"1/2^k"}/> containing infinitely many distinct elements, so
                            you can pick <InlineMath math={"n_k > n_{k-1}"}/> with{" "}
                            <InlineMath math={"a_{n_k} \\in I_k"}/>. Then
                        </p>}
                        ko={<p>
                            이제 반복해서 이등분한다.{" "}
                            <InlineMath math={"[0,1] = [0, 1/2] \\cup [1/2, 1]"}/>로 나누면 적어도 한쪽이{" "}
                            <InlineMath math={"(a_n)"}/>의 원소를 무한히 많이 품는다. 오른쪽이라고 하자.{" "}
                            <InlineMath math={"[1/2, 1] = [1/2, 3/4] \\cup [3/4, 1]"}/>로 나누면 또 적어도
                            한쪽이 무한히 많이 품는다. 이번에는 왼쪽이라 하고{" "}
                            <InlineMath math={"[1/2, 3/4] = [1/2, 5/8] \\cup [5/8, 3/4]"}/>로 나눈다.
                            계속한다. <InlineMath math={"k"}/>번째 단계에서 서로 다른 원소를 무한히 많이
                            품는 길이 <InlineMath math={"1/2^k"}/>의 닫힌 구간{" "}
                            <InlineMath math={"I_k \\subset [0,1]"}/>을 쥐고 있으므로{" "}
                            <InlineMath math={"a_{n_k} \\in I_k"}/>인{" "}
                            <InlineMath math={"n_k > n_{k-1}"}/>을 고를 수 있다. 그러면
                        </p>}
                    />
                    <BlockMath math={"|a_{n_i} - a_{n_j}| \\le \\frac{1}{2^k} \\quad \\text{for all } i \\ge k,\\ j \\ge k,"}/>
                    <Terms items={[
                        ["1/2^k", <T en={<>the length of <InlineMath math={"I_k"}/>. Because the intervals are nested, all later picks stay inside <InlineMath math={"I_k"}/>, so two of them cannot be further apart than its length</>}
                                     ko={<><InlineMath math={"I_k"}/>의 길이. 구간들이 겹겹이 들어 있으므로 이후의 선택은 모두 <InlineMath math={"I_k"}/> 안에 머무르고, 그중 둘이 그 길이보다 멀어질 수 없다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            so <InlineMath math={"(a_{n_k})"}/> is Cauchy. Since{" "}
                            <InlineMath math={"\\mathbb{R}"}/> is complete it converges, and since{" "}
                            <InlineMath math={"C_1"}/> is closed the limit lies in{" "}
                            <InlineMath math={"C_1"}/>. Assembling the coordinates back together gives
                            the convergent subsequence in{" "}
                            <InlineMath math={"C"}/>.
                        </p>}
                        ko={<p>
                            그러므로 <InlineMath math={"(a_{n_k})"}/>는 Cauchy다.{" "}
                            <InlineMath math={"\\mathbb{R}"}/>이 완비이므로 수렴하고,{" "}
                            <InlineMath math={"C_1"}/>이 닫혔으므로 극한이{" "}
                            <InlineMath math={"C_1"}/> 안에 있다. 좌표들을 도로 모으면{" "}
                            <InlineMath math={"C"}/> 안의 수렴하는 부분수열이 나온다.
                        </p>}
                    />
                    <T
                        en={<p>
                            Notice that completeness of{" "}
                            <InlineMath math={"\\mathbb{R}"}/> is doing the load bearing work in the last
                            step, and completeness of{" "}
                            <InlineMath math={"\\mathbb{R}"}/> is Chapter 1's least upper bound axiom.
                            The whole chapter routes through that one property.
                        </p>}
                        ko={<p>
                            마지막 단계에서 하중을 받는 것이{" "}
                            <InlineMath math={"\\mathbb{R}"}/>의 완비성이고,{" "}
                            <InlineMath math={"\\mathbb{R}"}/>의 완비성이 1장의 least upper bound
                            공리라는 점에 유의하라. 이 장 전체가 그 성질 하나를 거쳐 간다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Definition n="6.63" title={<T en={<>Compact set</>} ko={<>컴팩트 집합</>}/>}>
                <T
                    en={<p>
                        A set <InlineMath math={"C"}/> satisfying (a) or (b) of Theorem 6.62 is said to
                        be <strong>compact</strong>. Remark 6.64 notes that the version defined here is
                        usually called <em>sequential</em> compactness, and because it is the only form
                        these notes use, the word sequential is dropped.
                    </p>}
                    ko={<p>
                        정리 6.62의 (a)나 (b)를 만족하는 집합 <InlineMath math={"C"}/>를{" "}
                        <strong>컴팩트</strong>라고 한다. 참고 6.64는 여기서 정의한 판을 보통{" "}
                        <em>순차</em> 컴팩트성이라 부른다고 적어 두고, 이 교재가 쓰는 형태가 그것뿐이라
                        순차라는 말을 떼겠다고 한다.
                    </p>}
                />
                <T
                    en={<p>
                        The other standard definition, and the one you will meet if you open a topology
                        book, is about open covers: <InlineMath math={"C"}/> is compact if every
                        collection of open sets whose union contains{" "}
                        <InlineMath math={"C"}/> has a finite subcollection that already does. In{" "}
                        <InlineMath math={"\\mathbb{R}^n"}/> the two definitions agree, and both agree
                        with closed and bounded, which is the Heine-Borel theorem. The figure shows the
                        cover version because it is the one where you can watch compactness fail.
                    </p>}
                    ko={<p>
                        다른 표준 정의, 즉 위상수학 책을 열면 만나게 될 정의는 열린 덮개에 관한 것이다.
                        합집합이 <InlineMath math={"C"}/>를 품는 모든 열린 집합의 모임이 이미{" "}
                        <InlineMath math={"C"}/>를 품는 유한 부분모임을 가지면{" "}
                        <InlineMath math={"C"}/>가 컴팩트다.{" "}
                        <InlineMath math={"\\mathbb{R}^n"}/>에서는 두 정의가 일치하고, 둘 다 닫히고
                        유계라는 것과도 일치한다. 그것이 Heine-Borel 정리다. 아래 그림은 덮개판을 보인다.
                        컴팩트성이 깨지는 것을 지켜볼 수 있는 쪽이기 때문이다.
                    </p>}
                />
            </Definition>
            <CanvasFigure label={t("Compactness failing, and a maximum going missing with it",
                "컴팩트성이 깨지고, 그와 함께 최댓값이 사라진다")}
                          modal={<CompactExtrema width={780} height={480}/>}
                          bodyClassName="w-[min(92vw,920px)]">
                <CompactExtrema/>
            </CanvasFigure>
            <Example title={<T en={<>The cover with no finite subcover</>} ko={<>유한 부분덮개가 없는 덮개</>}/>}>
                <T
                    en={<p>
                        Take <InlineMath math={"C = (0, 1]"}/> and the open cover{" "}
                        <InlineMath math={"U_n = \\left( \\tfrac{1}{n},\\, 2 \\right)"}/> for{" "}
                        <InlineMath math={"n \\ge 1"}/>. It is a cover: any{" "}
                        <InlineMath math={"x \\in (0,1]"}/> has{" "}
                        <InlineMath math={"x > 0"}/>, so some{" "}
                        <InlineMath math={"n"}/> has <InlineMath math={"1/n < x"}/> and{" "}
                        <InlineMath math={"x \\in U_n"}/>. But take any finite subfamily{" "}
                        <InlineMath math={"\\{U_{n_1}, \\ldots, U_{n_k}\\}"}/> and let{" "}
                        <InlineMath math={"N = \\max_j n_j"}/>. The sets are nested, so their union is
                        just <InlineMath math={"U_N = (1/N, 2)"}/>, and every point of{" "}
                        <InlineMath math={"(0, 1/N]"}/> is left uncovered. No finite subcover exists.
                    </p>}
                    ko={<p>
                        <InlineMath math={"C = (0, 1]"}/>과{" "}
                        <InlineMath math={"n \\ge 1"}/>에 대한 열린 덮개{" "}
                        <InlineMath math={"U_n = \\left( \\tfrac{1}{n},\\, 2 \\right)"}/>을 보자. 덮개는
                        맞다. 어떤 <InlineMath math={"x \\in (0,1]"}/>이든{" "}
                        <InlineMath math={"x > 0"}/>이므로 어떤{" "}
                        <InlineMath math={"n"}/>이 <InlineMath math={"1/n < x"}/>를 만족하고{" "}
                        <InlineMath math={"x \\in U_n"}/>이다. 그런데 유한 부분족{" "}
                        <InlineMath math={"\\{U_{n_1}, \\ldots, U_{n_k}\\}"}/>을 아무거나 잡고{" "}
                        <InlineMath math={"N = \\max_j n_j"}/>라 하자. 집합들이 겹겹이 들어 있으므로
                        합집합은 <InlineMath math={"U_N = (1/N, 2)"}/>일 뿐이고,{" "}
                        <InlineMath math={"(0, 1/N]"}/>의 모든 점이 덮이지 않은 채 남는다. 유한
                        부분덮개는 존재하지 않는다.
                    </p>}
                />
                <T
                    en={<p>
                        Now put the left endpoint back. For{" "}
                        <InlineMath math={"C_a = [a, 1]"}/> with{" "}
                        <InlineMath math={"a > 0"}/>, the single set{" "}
                        <InlineMath math={"U_N"}/> with{" "}
                        <InlineMath math={"N = \\lfloor 1/a \\rfloor + 1"}/> covers everything, since{" "}
                        <InlineMath math={"1/N < a"}/>. At{" "}
                        <InlineMath math={"a = 0.25"}/> that is{" "}
                        <InlineMath math={"N = 5"}/>; at{" "}
                        <InlineMath math={"a = 0.02"}/> it is{" "}
                        <InlineMath math={"N = 51"}/>; at{" "}
                        <InlineMath math={"a = 0.005"}/> it is{" "}
                        <InlineMath math={"N = 201"}/>. Every one of these is finite, so every{" "}
                        <InlineMath math={"C_a"}/> is compact, and yet the index needed runs away to
                        infinity as <InlineMath math={"a \\to 0"}/>. Compactness does not degrade
                        gradually. It holds at every positive{" "}
                        <InlineMath math={"a"}/> and fails at{" "}
                        <InlineMath math={"a = 0"}/>, which is exactly the behaviour you would expect of
                        a property defined by "there exists a finite something".
                    </p>}
                    ko={<p>
                        이제 왼쪽 끝점을 되돌려 놓자.{" "}
                        <InlineMath math={"a > 0"}/>인{" "}
                        <InlineMath math={"C_a = [a, 1]"}/>에 대해서는{" "}
                        <InlineMath math={"1/N < a"}/>이므로{" "}
                        <InlineMath math={"N = \\lfloor 1/a \\rfloor + 1"}/>인 집합{" "}
                        <InlineMath math={"U_N"}/> 하나가 전부를 덮는다.{" "}
                        <InlineMath math={"a = 0.25"}/>에서는{" "}
                        <InlineMath math={"N = 5"}/>,{" "}
                        <InlineMath math={"a = 0.02"}/>에서는{" "}
                        <InlineMath math={"N = 51"}/>,{" "}
                        <InlineMath math={"a = 0.005"}/>에서는{" "}
                        <InlineMath math={"N = 201"}/>이다. 모두 유한하므로 모든{" "}
                        <InlineMath math={"C_a"}/>가 컴팩트인데, 필요한 지수는{" "}
                        <InlineMath math={"a \\to 0"}/>일 때 무한으로 달아난다. 컴팩트성은 서서히
                        나빠지지 않는다. 모든 양의 <InlineMath math={"a"}/>에서 성립하고{" "}
                        <InlineMath math={"a = 0"}/>에서 깨진다. "유한한 무언가가 존재한다"로 정의된
                        성질에 딱 어울리는 거동이다.
                    </p>}
                />
            </Example>
            <Theorem n="6.65" title={<T en={<>Weierstrass Theorem</>} ko={<>Weierstrass 정리</>}/>}>
                <T
                    en={<p>
                        If <InlineMath math={"C"}/> is compact and{" "}
                        <InlineMath math={"f : C \\to \\mathbb{R}"}/> is continuous, then{" "}
                        <InlineMath math={"f"}/> achieves its extreme values. That is,
                    </p>}
                    ko={<p>
                        <InlineMath math={"C"}/>가 컴팩트이고{" "}
                        <InlineMath math={"f : C \\to \\mathbb{R}"}/>가 연속이면{" "}
                        <InlineMath math={"f"}/>는 극값에 도달한다. 즉
                    </p>}
                />
                <BlockMath math={"\\exists\\, x^* \\in C \\ \\text{ s.t. } \\ f(x^*) = \\sup_{x \\in C} f(x), \\qquad \\exists\\, x_* \\in C \\ \\text{ s.t. } \\ f(x_*) = \\inf_{x \\in C} f(x)."}/>
                <Terms items={[
                    ["x^*", <T en={<>a maximizer, a point of <InlineMath math={"C"}/>. Its existence is the claim; the supremum's existence was never in doubt once <InlineMath math={"f"}/> is bounded</>}
                               ko={<>최대점이고 <InlineMath math={"C"}/>의 점이다. 주장은 그것의 존재다. supremum의 존재는 <InlineMath math={"f"}/>가 유계이기만 하면 의심된 적이 없다</>}/>],
                    ["\\sup", <T en={<>the least upper bound. The theorem says the sup is attained, turning it into a max</>}
                                 ko={<>least upper bound. 정리는 그 sup에 도달한다고 말하고, 그로써 그것이 max가 된다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            Let <InlineMath math={"f^* := \\sup_{x \\in C} f(x)"}/>. To show: there
                            exists <InlineMath math={"x^* \\in C"}/> with{" "}
                            <InlineMath math={"f(x^*) = f^*"}/>.
                        </p>}
                        ko={<p>
                            <InlineMath math={"f^* := \\sup_{x \\in C} f(x)"}/>라 하자. 보일 것은{" "}
                            <InlineMath math={"f(x^*) = f^*"}/>인{" "}
                            <InlineMath math={"x^* \\in C"}/>의 존재다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>Claim 6.66: <InlineMath math={"f^*"}/> is finite.</strong> Suppose
                            not, so <InlineMath math={"f^* = \\infty"}/>. Then by definition of the
                            supremum, for all{" "}
                            <InlineMath math={"n \\ge 1"}/> there exists{" "}
                            <InlineMath math={"x_n \\in C"}/> with{" "}
                            <InlineMath math={"f(x_n) \\ge n"}/>. Because{" "}
                            <InlineMath math={"C"}/> is compact, there exist{" "}
                            <InlineMath math={"x_0 \\in C"}/> and a subsequence{" "}
                            <InlineMath math={"(x_{n_i})"}/> with{" "}
                            <InlineMath math={"x_{n_i} \\to x_0"}/>. Because{" "}
                            <InlineMath math={"f"}/> is continuous, Corollary 6.50 gives
                        </p>}
                        ko={<p>
                            <strong>주장 6.66: <InlineMath math={"f^*"}/>는 유한하다.</strong> 아니라고,
                            즉 <InlineMath math={"f^* = \\infty"}/>라고 하자. supremum의 정의에 의해 모든{" "}
                            <InlineMath math={"n \\ge 1"}/>에 대해{" "}
                            <InlineMath math={"f(x_n) \\ge n"}/>인{" "}
                            <InlineMath math={"x_n \\in C"}/>가 존재한다.{" "}
                            <InlineMath math={"C"}/>가 컴팩트이므로{" "}
                            <InlineMath math={"x_{n_i} \\to x_0"}/>인{" "}
                            <InlineMath math={"x_0 \\in C"}/>와 부분수열{" "}
                            <InlineMath math={"(x_{n_i})"}/>이 존재한다.{" "}
                            <InlineMath math={"f"}/>가 연속이므로 따름정리 6.50이
                        </p>}
                    />
                    <BlockMath math={"f(x_0) = \\lim_{i \\to \\infty} f(x_{n_i}) \\ge \\lim_{i \\to \\infty} n_i = \\infty."}/>
                    <Terms items={[
                        ["f(x_0)", <T en={<>a real number, because <InlineMath math={"f : C \\to \\mathbb{R}"}/> and <InlineMath math={"x_0 \\in C"}/>. It cannot equal <InlineMath math={"\\infty"}/>, and that contradiction closes the claim</>}
                                      ko={<><InlineMath math={"f : C \\to \\mathbb{R}"}/>이고 <InlineMath math={"x_0 \\in C"}/>이므로 실수다. <InlineMath math={"\\infty"}/>일 수 없고, 그 모순이 이 주장을 닫는다</>}/>],
                        ["n_i \\ge i", <T en={<>from Definition 6.51, which is why the subsequence's values still run off to infinity</>}
                                          ko={<>정의 6.51에서 나온다. 부분수열의 값이 여전히 무한으로 달아나는 이유다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>Now the supremum is attained.</strong> Knowing{" "}
                            <InlineMath math={"f^*"}/> is finite, apply the definition of the supremum
                            again: for all <InlineMath math={"n > 0"}/> there exists{" "}
                            <InlineMath math={"x_n \\in C"}/> with{" "}
                            <InlineMath math={"|f^* - f(x_n)| < 1/n"}/>. Because{" "}
                            <InlineMath math={"C"}/> is compact there exist{" "}
                            <InlineMath math={"x^* \\in C"}/> and a subsequence{" "}
                            <InlineMath math={"(x_{n_i})"}/> with{" "}
                            <InlineMath math={"x_{n_i} \\to x^*"}/>, and because{" "}
                            <InlineMath math={"f"}/> is continuous,{" "}
                            <InlineMath math={"f(x_{n_i}) \\to f(x^*)"}/>. Then
                        </p>}
                        ko={<p>
                            <strong>이제 supremum에 도달함을 보인다.</strong>{" "}
                            <InlineMath math={"f^*"}/>가 유한함을 알았으니 supremum의 정의를 다시 쓴다.
                            모든 <InlineMath math={"n > 0"}/>에 대해{" "}
                            <InlineMath math={"|f^* - f(x_n)| < 1/n"}/>인{" "}
                            <InlineMath math={"x_n \\in C"}/>가 존재한다.{" "}
                            <InlineMath math={"C"}/>가 컴팩트이므로{" "}
                            <InlineMath math={"x_{n_i} \\to x^*"}/>인{" "}
                            <InlineMath math={"x^* \\in C"}/>와 부분수열{" "}
                            <InlineMath math={"(x_{n_i})"}/>이 존재하고,{" "}
                            <InlineMath math={"f"}/>가 연속이므로{" "}
                            <InlineMath math={"f(x_{n_i}) \\to f(x^*)"}/>이다. 그러면
                        </p>}
                    />
                    <BlockMath math={"|f^* - f(x^*)| = \\lim_{i \\to \\infty} |f^* - f(x_{n_i})| \\le \\lim_{i \\to \\infty} \\frac{1}{n_i} = 0."}/>
                    <Terms items={[
                        ["|f^* - f(x^*)|", <T en={<>a fixed non-negative number squeezed to zero, so <InlineMath math={"f^* = f(x^*)"}/>. The same move as Proposition 6.22(c) and Claim 6.44</>}
                                              ko={<>고정된 음이 아닌 수가 0으로 눌리므로 <InlineMath math={"f^* = f(x^*)"}/>다. 명제 6.22(c)와 주장 6.44에서 쓴 것과 같은 수다</>}/>],
                        ["1/n_i \\to 0", <T en={<>because <InlineMath math={"n_i \\ge i \\to \\infty"}/></>}
                                            ko={<><InlineMath math={"n_i \\ge i \\to \\infty"}/>이기 때문이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            And hence <InlineMath math={"f^* = f(x^*)"}/>. The same proof works for the
                            infimum. Strictly, the first equality uses that continuity of{" "}
                            <InlineMath math={"f"}/> implies continuity of{" "}
                            <InlineMath math={"g(x) := |f^* - f(x)|"}/>; alternatively split the estimate
                            as{" "}
                            <InlineMath math={"|f^* - f(x^*)| \\le |f^* - f(x_{n_i})| + |f(x_{n_i}) - f(x^*)| \\le \\tfrac{1}{n_i} + |f(x_{n_i}) - f(x^*)| \\to 0"}/>.
                        </p>}
                        ko={<p>
                            따라서 <InlineMath math={"f^* = f(x^*)"}/>이다. 같은 증명이 infimum에도
                            통한다. 엄밀히 말하면 첫 등식은{" "}
                            <InlineMath math={"f"}/>의 연속성이{" "}
                            <InlineMath math={"g(x) := |f^* - f(x)|"}/>의 연속성을 함의한다는 것을 쓴다.
                            아니면 평가를{" "}
                            <InlineMath math={"|f^* - f(x^*)| \\le |f^* - f(x_{n_i})| + |f(x_{n_i}) - f(x^*)| \\le \\tfrac{1}{n_i} + |f(x_{n_i}) - f(x^*)| \\to 0"}/>으로
                            쪼개면 된다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Remark title={<T en={<>Each hypothesis, dropped</>} ko={<>가설을 하나씩 빼 보면</>}/>}>
                <T
                    en={<p>
                        The figure lets you drop them one at a time with{" "}
                        <InlineMath math={"f(x) = x"}/> held fixed, so the set is the only thing that
                        changes.
                    </p>}
                    ko={<p>
                        그림은 <InlineMath math={"f(x) = x"}/>를 고정해 둔 채 가설을 하나씩 빼 볼 수 있게
                        해 둔다. 바뀌는 것이 집합뿐이 되도록 한 것이다.
                    </p>}
                />
                <T
                    en={<ul>
                        <li><strong>Everything holds.</strong>{" "}
                            <InlineMath math={"C = [0,1]"}/> is closed and bounded,{" "}
                            <InlineMath math={"\\sup f = 1"}/>, and{" "}
                            <InlineMath math={"f(1) = 1"}/>. The maximizer exists.</li>
                        <li><strong>Drop closed.</strong>{" "}
                            <InlineMath math={"C = (0,1)"}/> is bounded but not closed. Still{" "}
                            <InlineMath math={"\\sup f = 1"}/>, but no point of{" "}
                            <InlineMath math={"C"}/> attains it. An optimizer asked to return the
                            maximizer has nothing to return, and a solver will report iterates marching
                            towards <InlineMath math={"1"}/> forever.</li>
                        <li><strong>Drop bounded.</strong>{" "}
                            <InlineMath math={"C = [0, \\infty)"}/> is closed but not bounded, and now{" "}
                            <InlineMath math={"\\sup f = \\infty"}/>. There is not even a value to
                            attain. Claim 6.66 is the step that fails.</li>
                        <li><strong>Drop continuity.</strong> Keep{" "}
                            <InlineMath math={"C = [0,1]"}/> compact but take{" "}
                            <InlineMath math={"f(x) = x"}/> for{" "}
                            <InlineMath math={"x < 1"}/> and <InlineMath math={"f(1) = 0"}/>. Then{" "}
                            <InlineMath math={"\\sup f = 1"}/> and nothing attains it. Compactness alone
                            is not enough.</li>
                    </ul>}
                    ko={<ul>
                        <li><strong>전부 성립할 때.</strong>{" "}
                            <InlineMath math={"C = [0,1]"}/>은 닫혔고 유계이며{" "}
                            <InlineMath math={"\\sup f = 1"}/>이고{" "}
                            <InlineMath math={"f(1) = 1"}/>이다. 최대점이 존재한다.</li>
                        <li><strong>닫힘을 뺄 때.</strong>{" "}
                            <InlineMath math={"C = (0,1)"}/>은 유계이지만 닫히지 않았다. 여전히{" "}
                            <InlineMath math={"\\sup f = 1"}/>인데 <InlineMath math={"C"}/>의 어떤 점도
                            거기 닿지 못한다. 최대점을 돌려 달라는 최적화기는 돌려줄 것이 없고, solver는
                            <InlineMath math={"1"}/>을 향해 영원히 행진하는 반복점을 보고할 것이다.</li>
                        <li><strong>유계를 뺄 때.</strong>{" "}
                            <InlineMath math={"C = [0, \\infty)"}/>는 닫혔지만 유계가 아니고, 이제{" "}
                            <InlineMath math={"\\sup f = \\infty"}/>다. 닿을 값 자체가 없다. 깨지는
                            단계가 주장 6.66이다.</li>
                        <li><strong>연속성을 뺄 때.</strong>{" "}
                            <InlineMath math={"C = [0,1]"}/>은 컴팩트로 두되{" "}
                            <InlineMath math={"x < 1"}/>에서 <InlineMath math={"f(x) = x"}/>,{" "}
                            <InlineMath math={"f(1) = 0"}/>이라 하자. 그러면{" "}
                            <InlineMath math={"\\sup f = 1"}/>인데 아무것도 거기 닿지 못한다. 컴팩트성만으로는
                            충분하지 않다.</li>
                    </ul>}
                />
                <T
                    en={<p>
                        This also finishes Theorem 6.38(a), promised back in the completeness section.
                        A finite dimensional subspace is complete because a Cauchy sequence in it is
                        bounded (Proposition 6.22b applies to Cauchy sequences by the same argument),
                        Bolzano-Weierstrass extracts a convergent subsequence, and a Cauchy sequence with
                        a convergent subsequence converges to that same limit. Every counterexample to
                        completeness therefore has to be infinite dimensional, which is why Example 6.33
                        had to be built out of functions rather than vectors.
                    </p>}
                    ko={<p>
                        이것으로 완비성 절에서 약속했던 정리 6.38(a)도 마무리된다. 유한 차원 부분 공간이
                        완비인 이유는, 그 안의 Cauchy 수열이 유계이고(같은 논증으로 명제 6.22b가 Cauchy
                        수열에도 적용된다) Bolzano-Weierstrass가 수렴하는 부분수열을 뽑아내며, 수렴하는
                        부분수열을 가진 Cauchy 수열은 그 같은 극한으로 수렴하기 때문이다. 그러므로 완비성의
                        반례는 무한 차원일 수밖에 없고, 예제 6.33을 벡터가 아니라 함수로 지어야 했던 이유가
                        그것이다.
                    </p>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Why Robotics</h2>} ko={<h2>로봇에서 왜 필요한가</h2>}/>
            <T
                en={<p>
                    This chapter looks like the most abstract one in the course and is the one whose
                    failures you will actually watch happen, in a log file, on a robot that has stopped
                    moving. Solvers do not usually crash. They return a number, or they spin, and the
                    reason is almost always one of the hypotheses above quietly not holding.
                </p>}
                ko={<p>
                    이 장은 과목에서 가장 추상적으로 보이지만, 그 실패를 실제로 지켜보게 되는 장이기도
                    하다. 로그 파일에서, 멈춰 선 로봇 위에서. solver는 대개 죽지 않는다. 수를 하나
                    돌려주거나 계속 돌 뿐이고, 이유는 거의 언제나 위 가설 중 하나가 조용히 성립하지 않는
                    것이다.
                </p>}
            />
            <T
                en={<ul>
                    <li>
                        <strong>Every iterative solver you call is asking for a contraction, and its
                            tolerance is the theorem's error bound.</strong> Inverse kinematics by
                        Newton-Raphson, bundle adjustment, an MPC solve, an ICP scan match, the EKF
                        update when you iterate it: all are{" "}
                        <InlineMath math={"x_{k+1} = T(x_k)"}/>. The bound{" "}
                        <InlineMath math={"\\|x_n - x^*\\| \\le \\tfrac{c^n}{1-c}\\|x_1 - x_0\\|"}/>{" "}
                        is what lets you convert a required accuracy into an iteration count offline,
                        which is the only way to put an iterative solver inside a fixed control period.
                        A solver that reports "max iterations reached" is telling you it could not find
                        the <InlineMath math={"c"}/>, not that it needs a bigger budget.
                    </li>
                    <li>
                        <strong>Convergence is local, and a bad seed is the most common cause of a bad
                            pose.</strong> The basins figure is not a curiosity. Inverse kinematics near
                        a singularity is exactly the flat tangent that threw{" "}
                        <InlineMath math={"x_0 = 0.6"}/> out to <InlineMath math={"5.4"}/>: the Jacobian
                        loses rank, the step becomes enormous, and the arm flips to a different solution
                        branch, elbow up instead of elbow down. The fix is the one this chapter names.
                        Seed from the previous solution rather than from zero, damp the step as in (6.5)
                        so you stay inside the ball where the linear model is honest, and check the
                        Jacobian's smallest singular value from Chapter 4 before trusting the step.
                    </li>
                    <li>
                        <strong>Floating point is not a complete space, and the gap shows up as a solver
                            that never terminates.</strong> Doubles are a finite set, so a sequence that
                        is Cauchy in theory can oscillate between two adjacent representable numbers
                        forever. Stopping tests written as{" "}
                        <InlineMath math={"\\|x_{k+1} - x_k\\| < \\epsilon"}/> with{" "}
                        <InlineMath math={"\\epsilon"}/> below the local machine epsilon never fire.
                        Worse, the harmonic-series warning after Definition 6.29 is real: consecutive
                        steps going to zero does not mean the sequence converges, so a test on the step
                        alone can also fire early on a sequence that is still drifting. Test the
                        residual as well as the step.
                    </li>
                    <li>
                        <strong>Feasible sets are usually not closed, and that is why solvers return
                            answers on the boundary that violate the constraint.</strong> Writing{" "}
                        <InlineMath math={"v < v_{\\max}"}/> instead of{" "}
                        <InlineMath math={"v \\le v_{\\max}"}/> makes the set open, and Weierstrass no
                        longer applies: the optimum sits exactly at{" "}
                        <InlineMath math={"v_{\\max}"}/>, which is not in the set, and the solver returns
                        something a few ulps outside it. Strict inequalities in an optimization problem
                        are almost always a modelling mistake. Use closed constraints and a margin.
                    </li>
                    <li>
                        <strong>Unbounded feasible sets are why a cost function needs a regularizer.</strong>{" "}
                        Drop boundedness and there may be no optimum at all, as in the third panel of the
                        figure. A calibration problem with an unobservable direction has a cost that is
                        flat along it, so the parameter drifts to whatever the arithmetic favours and the
                        reported covariance never shrinks, which is the same unobservability Chapter 5
                        discussed from the filter side. Adding{" "}
                        <InlineMath math={"\\lambda\\|x\\|^2"}/> makes the sublevel sets bounded and buys
                        existence back. That is what regularization <em>is</em>, before it is anything
                        about overfitting.
                    </li>
                    <li>
                        <strong>Compactness is a property of the constraint set, so it is checked once
                            for all objectives.</strong> This is worth internalizing because it changes
                        where you look when a planner fails. Joint limits give you a closed bounded box,
                        so any continuous cost over configurations has a minimizer, guaranteed, before
                        anyone chooses the cost. If your planner reports no solution, the objective is
                        rarely the problem; the feasible set being empty or not closed usually is.
                    </li>
                    <li>
                        <strong>Continuity is a modelling assumption, and contact breaks it.</strong>{" "}
                        Weierstrass needs continuity, and a legged robot's dynamics are discontinuous at
                        touchdown, a friction model is discontinuous at the stick-slip transition, and a
                        cost with an if-statement in it is discontinuous at the branch. Trajectory
                        optimizers handle this by splitting the problem into continuous phases with
                        explicit switching, which is precisely an admission that the theorem does not
                        apply across the jump. The jump figure is the picture of what the optimizer sees.
                    </li>
                    <li>
                        <strong>Open and closed decide whether a constraint can be active.</strong> An
                        obstacle defined as an open set means the boundary is free space and a plan can
                        graze it; defined as closed, the boundary is blocked. Numerically these differ by
                        one floating point comparison and by whether the plan touches the wall. Say which
                        one you mean, and inflate by the robot radius so the answer does not depend on
                        the choice.
                    </li>
                    <li>
                        <strong>The <InlineMath math={"\\epsilon"}/>-<InlineMath math={"\\delta"}/> game
                            is what a tolerance parameter is.</strong> Every solver exposes tolerances,
                        and they are not interchangeable. An output tolerance is the{" "}
                        <InlineMath math={"\\epsilon"}/>, a step tolerance is the{" "}
                        <InlineMath math={"\\delta"}/>, and the exchange rate between them is the
                        derivative, as the <InlineMath math={"x^2"}/> table showed. On a badly
                        conditioned problem the same output accuracy demands a far tighter input
                        tolerance, which is the numerical statement of a large{" "}
                        <InlineMath math={"1/\\delta"}/> and the reason a solver that converged on the
                        bench spins in the field.
                    </li>
                    <li>
                        <strong>Completeness is why you can trust a fixed point you never computed
                            exactly.</strong> The contraction theorem proves a solution exists before any
                        code runs, which matters for the arguments you make about a system rather than
                        the numbers you get out of it. Proving an observer converges, a controller has an
                        equilibrium, or an MPC problem is recursively feasible are all existence claims,
                        and they are all this theorem or its relatives. Existence first, then computation.
                    </li>
                </ul>}
                ko={<ul>
                    <li>
                        <strong>당신이 호출하는 모든 반복 solver는 contraction을 요구하고 있고, 그
                            tolerance는 정리의 오차 한계다.</strong> Newton-Raphson으로 푸는 역기구학,
                        bundle adjustment, MPC 풀이, ICP 스캔 정합, 반복해서 쓰는 EKF 갱신이 모두{" "}
                        <InlineMath math={"x_{k+1} = T(x_k)"}/>다. 한계{" "}
                        <InlineMath math={"\\|x_n - x^*\\| \\le \\tfrac{c^n}{1-c}\\|x_1 - x_0\\|"}/>이
                        요구 정확도를 오프라인에서 반복 횟수로 바꿔 주고, 그것이 반복 solver를 고정된 제어
                        주기 안에 넣는 유일한 방법이다. "최대 반복 도달"을 보고하는 solver는 예산이 더
                        필요하다는 것이 아니라 <InlineMath math={"c"}/>를 찾지 못했다고 말하고 있는
                        것이다.
                    </li>
                    <li>
                        <strong>수렴은 국소적이고, 나쁜 초기값이 나쁜 자세의 가장 흔한 원인이다.</strong>{" "}
                        basin 그림은 신기한 구경거리가 아니다. 특이점 근처의 역기구학이 바로{" "}
                        <InlineMath math={"x_0 = 0.6"}/>을 <InlineMath math={"5.4"}/>로 내던진 그 평평한
                        접선이다. 야코비안이 rank를 잃고 걸음이 엄청나게 커지며 팔이 다른 해 가지로
                        뒤집힌다. 팔꿈치가 아래가 아니라 위로 간다. 해법은 이 장이 이름 붙인 것들이다.
                        0이 아니라 직전 해에서 출발하고, (6.5)처럼 걸음을 감쇠해 선형 모델이 정직한 공
                        안에 머무르며, 걸음을 믿기 전에 4장의 최소 특이값으로 야코비안을 확인한다.
                    </li>
                    <li>
                        <strong>부동소수점은 완비 공간이 아니고, 그 틈이 끝나지 않는 solver로
                            나타난다.</strong> double은 유한 집합이라, 이론상 Cauchy인 수열이 인접한 두
                        표현 가능한 수 사이를 영원히 오갈 수 있다.{" "}
                        <InlineMath math={"\\epsilon"}/>이 국소 machine epsilon보다 작은{" "}
                        <InlineMath math={"\\|x_{k+1} - x_k\\| < \\epsilon"}/> 형태의 정지 판정은 결코
                        발동하지 않는다. 더 나쁘게는, 정의 6.29 뒤의 조화급수 경고가 실제 상황이다. 연속한
                        걸음이 0으로 간다고 수열이 수렴하는 것은 아니므로, 걸음만 보는 판정은 아직 표류
                        중인 수열에서 일찍 발동할 수도 있다. 걸음과 함께 잔차도 판정하라.
                    </li>
                    <li>
                        <strong>실행 가능 집합이 대개 닫혀 있지 않고, 그래서 solver가 제약을 어기는
                            경계 위의 답을 돌려준다.</strong>{" "}
                        <InlineMath math={"v \\le v_{\\max}"}/> 대신{" "}
                        <InlineMath math={"v < v_{\\max}"}/>로 적으면 집합이 열리고 Weierstrass가 더 이상
                        적용되지 않는다. 최적해가 정확히{" "}
                        <InlineMath math={"v_{\\max}"}/>에 앉는데 그것이 집합 안에 없으니, solver는 그
                        바깥으로 몇 ulp 벗어난 무언가를 돌려준다. 최적화 문제의 강부등식은 거의 언제나
                        모델링 실수다. 닫힌 제약과 여유를 쓰라.
                    </li>
                    <li>
                        <strong>유계가 아닌 실행 가능 집합이 비용 함수에 regularizer가 필요한
                            이유다.</strong> 유계를 빼면 그림의 셋째 판처럼 최적해가 아예 없을 수 있다.
                        관측 불가능한 방향이 있는 캘리브레이션 문제는 그 방향을 따라 비용이 평평해서
                        파라미터가 연산이 좋아하는 아무 데로나 표류하고 보고되는 공분산은 줄지 않는다.
                        5장이 필터 쪽에서 이야기한 것과 같은 관측 불가능성이다.{" "}
                        <InlineMath math={"\\lambda\\|x\\|^2"}/>을 더하면 하위 준위 집합이 유계가 되고
                        존재성을 되사 온다. 과적합에 관한 무엇이기 이전에, regularization이란{" "}
                        <em>바로 그것</em>이다.
                    </li>
                    <li>
                        <strong>컴팩트성은 제약 집합의 성질이므로 모든 목적함수에 대해 한 번만
                            확인한다.</strong> planner가 실패했을 때 어디를 봐야 하는지가 달라지므로
                        몸에 익혀 둘 값어치가 있다. 관절 한계는 닫히고 유계인 상자를 주므로, 자세에 대한
                        어떤 연속 비용이든 최소점을 갖는다. 누가 비용을 고르기도 전에 보장된다. planner가
                        해가 없다고 보고하면 문제는 목적함수인 경우가 드물다. 실행 가능 집합이 비었거나
                        닫히지 않은 것이 대개 원인이다.
                    </li>
                    <li>
                        <strong>연속성은 모델링 가정이고, 접촉이 그것을 깬다.</strong> Weierstrass는
                        연속성을 요구하는데, 다족 로봇의 동역학은 착지에서 불연속이고 마찰 모델은
                        stick-slip 전이에서 불연속이며 if 문이 들어 있는 비용은 그 분기에서 불연속이다.
                        궤적 최적화기는 문제를 명시적 전환을 가진 연속 구간들로 쪼개서 이것을 다루는데,
                        그것이 바로 도약을 가로질러서는 정리가 적용되지 않는다는 인정이다. 도약 그림이
                        최적화기가 보는 것의 그림이다.
                    </li>
                    <li>
                        <strong>열림과 닫힘이 제약이 활성화될 수 있는지를 정한다.</strong> 장애물을 열린
                        집합으로 정의하면 경계가 자유 공간이라 계획이 그것을 스칠 수 있고, 닫힌 집합으로
                        정의하면 경계가 막힌다. 수치적으로 이 둘은 부동소수점 비교 하나와 계획이 벽에
                        닿는지 여부로 갈린다. 어느 쪽을 뜻하는지 말하고, 답이 그 선택에 의존하지 않도록
                        로봇 반지름만큼 부풀려라.
                    </li>
                    <li>
                        <strong><InlineMath math={"\\epsilon"}/>-<InlineMath math={"\\delta"}/> 게임이
                            곧 tolerance 파라미터의 정체다.</strong> 모든 solver가 tolerance를 노출하는데
                        그것들은 서로 바꿔 쓸 수 있는 것이 아니다. 출력 tolerance가{" "}
                        <InlineMath math={"\\epsilon"}/>이고 걸음 tolerance가{" "}
                        <InlineMath math={"\\delta"}/>이며, 둘 사이의 환율은{" "}
                        <InlineMath math={"x^2"}/> 표가 보인 대로 미분이다. 조건이 나쁜 문제에서는 같은
                        출력 정확도가 훨씬 빡빡한 입력 tolerance를 요구하는데, 그것이 큰{" "}
                        <InlineMath math={"1/\\delta"}/>의 수치적 진술이고 실험대에서 수렴하던 solver가
                        현장에서 계속 도는 이유다.
                    </li>
                    <li>
                        <strong>완비성이, 정확히 계산한 적 없는 고정점을 믿을 수 있게 해 준다.</strong>{" "}
                        contraction 정리는 코드가 한 줄도 돌기 전에 해가 존재함을 증명한다. 그것은
                        결과로 나온 수가 아니라 시스템에 대해 펴는 논증에서 중요하다. 관측기가 수렴한다,
                        제어기에 평형점이 있다, MPC 문제가 재귀적으로 실행 가능하다는 것은 모두 존재
                        주장이고, 모두 이 정리이거나 그 친척이다. 존재가 먼저이고 계산이 그다음이다.
                    </li>
                </ul>}
            />

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>References</h2>} ko={<h2>References</h2>}/>
            <ul>
                <li>
                    Jessy W. Grizzle, <em>ROB 501: Mathematics for Robotics</em>, University of Michigan,
                    2022. Chapter 6.{" "}
                    <a href={COURSE} target="_blank" rel="noopener noreferrer">{t("Course page", "코스 페이지")}</a>
                    {" · "}
                    <a href={NOTES_REPO} target="_blank" rel="noopener noreferrer">michiganrobotics/rob501</a>
                </li>
                <li>
                    <a href={RUDIN} target="_blank" rel="noopener noreferrer">
                        Walter Rudin, <em>Principles of Mathematical Analysis</em>
                    </a>
                    {" · "}
                    {t("chapters 2 and 3 for open and closed sets, compactness, and sequences, done in metric spaces rather than normed ones",
                        "2장과 3장이 열린 집합과 닫힌 집합, 컴팩트성, 수열을 다룬다. normed space가 아니라 거리 공간에서 한다")}
                </li>
                <li>
                    <a href={TAO_ANALYSIS} target="_blank" rel="noopener noreferrer">
                        Terence Tao, <em>Analysis I</em>
                    </a>
                    {" · "}
                    {t("builds the reals from the rationals by completing Cauchy sequences, which is Fact 6.39 carried out in full",
                        "Cauchy 수열을 완비화해서 유리수에서 실수를 짓는다. 사실 6.39를 끝까지 수행한 것이다")}
                </li>
                <li>
                    <a href={CAUCHY_WIKI} target="_blank" rel="noopener noreferrer">Cauchy sequence</a>
                    {" · "}
                    <a href={BANACH_WIKI} target="_blank" rel="noopener noreferrer">
                        {t("Banach space examples", "Banach space 예시")}
                    </a>
                    {" · "}
                    {t("both linked by the notes; the second is the list of complete spaces that makes Definition 6.34 usable",
                        "둘 다 교재가 걸어 둔 링크다. 두 번째가 정의 6.34를 쓸 만하게 만들어 주는 완비 공간 목록이다")}
                </li>
                <li>
                    <a href={BW_WIKI} target="_blank" rel="noopener noreferrer">
                        {t("Bolzano-Weierstrass theorem", "Bolzano-Weierstrass 정리")}
                    </a>
                    {" · "}
                    {t("the notes reproduce this page's nested interval illustration as Figure 6.5",
                        "교재가 이 문서의 구간 축소 그림을 Figure 6.5로 실어 두었다")}
                </li>
                <li>
                    <a href={NEWTON_FRACTAL} target="_blank" rel="noopener noreferrer">Newton fractal</a>
                    {" · "}
                    {t("the basins figure on this page is the real-line slice of this; the complex version is where the picture became famous",
                        "이 페이지의 basin 그림은 이것의 실수 직선 단면이다. 그림이 유명해진 것은 복소수판에서다")}
                </li>
                <li>
                    <a href={ROB101} target="_blank" rel="noopener noreferrer">michiganrobotics/rob101</a>
                    {" · "}
                    {t("the notes point to Chapter 11 of the ROB 101 textbook for the scalar Newton algorithm this chapter vectorizes",
                        "교재가 이 장에서 벡터화하는 스칼라 Newton 알고리즘에 대해 ROB 101 교재 11장을 가리킨다")}
                </li>
            </ul>
        </>
    );
};

export default Chapter6;
