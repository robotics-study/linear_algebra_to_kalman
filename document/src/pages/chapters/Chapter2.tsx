import CanvasFigure from "../../components/CanvasFigure";
import ChangeOfBasisExplorer from "../../components/pages/chapter2/ChangeOfBasisExplorer";
import EigenvectorHunt from "../../components/pages/chapter2/EigenvectorHunt";
import IndependenceExplorer from "../../components/pages/chapter2/IndependenceExplorer";
import SubspaceExplorer from "../../components/pages/chapter2/SubspaceExplorer";
import {BlockMath, InlineMath} from "../../components/math/Tex";
import {Corollary, Definition, Example, Lemma, Proof, Proposition, Remark, Theorem} from "../../components/math/Statement";
import Terms from "../../components/math/Terms";
import {T, useTr} from "../../libs/i18n";

const COURSE = "https://grizzle.robotics.umich.edu/education/rob501";
const NOTES_REPO = "https://github.com/michiganrobotics/rob501";
const CHEN = "https://global.oup.com/academic/product/linear-system-theory-and-design-9780199959570";
const DIM_R_OVER_Q = "http://www2.math.ou.edu/~aroche/courses/LinAlg-Fall2011/solutions1.pdf";
const ROB101 = "https://github.com/michiganrobotics/rob101";

const Chapter2 = () => {
    const t = useTr();
    return (
        <>
            <T
                en={<p>
                    The original title of this chapter ends with a parenthesis: "Practicing Proofs in a Safe
                    Environment". That is the honest description. Every claim here can be checked by hand on
                    a small matrix or a polynomial, so when a proof feels slippery you can drop back to an
                    example and see exactly what went wrong. Nothing later in the course offers that comfort,
                    so this page runs the examples first and the general statement second.
                </p>}
                ko={<p>
                    원 교재에서 이 장의 제목에는 괄호가 붙어 있다. "안전한 환경에서 증명 연습하기"다. 정확한
                    설명이다. 여기 나오는 주장은 전부 작은 행렬이나 다항식으로 손수 확인할 수 있어서, 증명이
                    미끄러진다 싶으면 예로 내려가 무엇이 어긋났는지 정확히 볼 수 있다. 이 과목의 뒷부분은 그런
                    편의를 주지 않는다. 그래서 이 페이지는 예를 먼저 놓고 일반 명제를 뒤에 둔다.
                </p>}
            />
            <T
                en={<p>
                    The abstraction pays a very concrete dividend. Vectors will turn out to include matrices,
                    polynomials, and functions, and once a basis is fixed each of them becomes a column of
                    numbers. A linear operator becomes a matrix acting on those columns. That correspondence
                    is the reason a computer can run any of the algorithms in Chapters 3 through 5:
                </p>}
                ko={<p>
                    추상화는 아주 구체적인 대가를 돌려준다. 벡터에는 행렬도, 다항식도, 함수도 들어오는데,
                    기저를 하나 고정하는 순간 그것들이 전부 숫자 한 열이 된다. 선형 연산자는 그 열에 작용하는
                    행렬이 된다. 3장부터 5장까지의 알고리즘을 컴퓨터가 돌릴 수 있는 이유가 이 대응이다.
                </p>}
            />
            <BlockMath math={"\\mathcal{L}(x) = y \\quad \\Longleftrightarrow \\quad A\\,[x]_u = [y]_v"}/>
            <Terms items={[
                ["\\mathcal{L}", <T en={<>a linear operator from one vector space to another, defined without reference to any basis</>}
                                   ko={<>한 벡터 공간에서 다른 벡터 공간으로 가는 선형 연산자. 기저와 무관하게 정의된다</>}/>],
                ["x, y", <T en={<>abstract vectors: possibly matrices, polynomials, or functions</>}
                           ko={<>추상적인 벡터. 행렬일 수도, 다항식일 수도, 함수일 수도 있다</>}/>],
                ["u, v", <T en={<>a chosen basis for the domain and for the codomain</>}
                           ko={<>정의역과 공역에 각각 하나씩 골라 둔 기저</>}/>],
                ["[x]_u", <T en={<>the column of coefficients that writes <InlineMath math={"x"}/> in the basis <InlineMath math={"u"}/></>}
                            ko={<><InlineMath math={"x"}/>를 기저 <InlineMath math={"u"}/>로 적었을 때의 계수 열</>}/>],
                ["A", <T en={<>the matrix representation of <InlineMath math={"\\mathcal{L}"}/> with respect to <InlineMath math={"u"}/> and <InlineMath math={"v"}/>: the object your code actually stores</>}
                        ko={<><InlineMath math={"u"}/>와 <InlineMath math={"v"}/>에 대한 <InlineMath math={"\\mathcal{L}"}/>의 행렬 표현. 코드가 실제로 들고 있는 물건이다</>}/>],
            ]}/>
            <T
                en={<p>
                    Everything in this chapter is built so that the equivalence above is true and so that you
                    know exactly how much freedom you had in choosing <InlineMath math={"u"}/> and{" "}
                    <InlineMath math={"v"}/>. Change the basis and <InlineMath math={"A"}/> changes, while{" "}
                    <InlineMath math={"\\mathcal{L}"}/> does not.
                </p>}
                ko={<p>
                    이 장의 내용은 전부 위 동치가 성립하도록, 그리고 <InlineMath math={"u"}/>와{" "}
                    <InlineMath math={"v"}/>를 고를 때 우리에게 얼마나 자유가 있었는지 알도록 쌓아 올린 것이다.
                    기저를 바꾸면 <InlineMath math={"A"}/>는 바뀌지만 <InlineMath math={"\\mathcal{L}"}/>은
                    그대로다.
                </p>}
            />
            <Remark title={<T en={<>Notation used throughout</>} ko={<>이 장에서 쓰는 기호</>}/>}>
                <T
                    en={<ul>
                        <li><InlineMath math={"\\mathcal{F}"}/> is a field, <InlineMath math={"\\mathcal{X}"}/> and{" "}
                            <InlineMath math={"\\mathcal{Y}"}/> are vector spaces, <InlineMath math={"\\mathcal{S}"}/> and{" "}
                            <InlineMath math={"\\mathcal{B}"}/> are sets of vectors, and{" "}
                            <InlineMath math={"\\mathcal{L}"}/> is a linear operator. The script letters are the
                            notes' own convention.</li>
                        <li>Scalars are <InlineMath math={"\\alpha, \\beta, \\gamma"}/>; vectors are{" "}
                            <InlineMath math={"v^1, v^2, v^3"}/>. Those <strong>superscripts are labels, not
                                powers</strong>: <InlineMath math={"v^2"}/> is the second vector, never{" "}
                            <InlineMath math={"v"}/> squared. Subscripts are reserved for the entries of a
                            column, as in <InlineMath math={"\\alpha_i"}/>.</li>
                    </ul>}
                    ko={<ul>
                        <li><InlineMath math={"\\mathcal{F}"}/>는 체, <InlineMath math={"\\mathcal{X}"}/>와{" "}
                            <InlineMath math={"\\mathcal{Y}"}/>는 벡터 공간,{" "}
                            <InlineMath math={"\\mathcal{S}"}/>와 <InlineMath math={"\\mathcal{B}"}/>는 벡터들의
                            집합, <InlineMath math={"\\mathcal{L}"}/>은 선형 연산자다. 필기체는 원 교재의
                            표기를 그대로 따른 것이다.</li>
                        <li>스칼라는 <InlineMath math={"\\alpha, \\beta, \\gamma"}/>, 벡터는{" "}
                            <InlineMath math={"v^1, v^2, v^3"}/>으로 쓴다. 이 <strong>위첨자는 지수가 아니라
                                이름표</strong>다. <InlineMath math={"v^2"}/>는 두 번째 벡터이지{" "}
                            <InlineMath math={"v"}/>의 제곱이 아니다. 아래첨자는{" "}
                            <InlineMath math={"\\alpha_i"}/>처럼 열의 성분에 쓴다.</li>
                    </ul>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Fields and Vector Spaces</h2>} ko={<h2>체와 벡터 공간</h2>}/>
            <T
                en={<p>
                    Almost everywhere in this course the scalars are real or complex numbers. Here we name
                    the general object anyway, because the definition of a vector space has to say what a
                    scalar is before it can say what scalar multiplication does. Keep{" "}
                    <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/> in mind as the canonical example while
                    reading the axioms.
                </p>}
                ko={<p>
                    이 과목에서 스칼라는 거의 항상 실수 아니면 복소수다. 그래도 여기서 일반적인 대상에 이름을
                    붙여 두는 이유는, 벡터 공간의 정의가 스칼라 곱을 말하기 전에 스칼라가 무엇인지부터 말해야
                    하기 때문이다. axiom을 읽는 동안에는 <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/>을
                    대표 예로 잡아 두면 된다.
                </p>}
            />
            <Definition n="2.1" title={<T en={<>Field</>} ko={<>체 (field)</>}/>}>
                <T
                    en={<p>
                        A <strong>field</strong> consists of a set <InlineMath math={"\\mathcal{F}"}/> of
                        elements called scalars together with two operations, addition{" "}
                        <InlineMath math={"+"}/> and multiplication <InlineMath math={"\\cdot"}/>, satisfying:
                    </p>}
                    ko={<p>
                        <strong>체</strong>는 스칼라라 부르는 원소들의 집합{" "}
                        <InlineMath math={"\\mathcal{F}"}/>와 그 위의 두 연산, 덧셈{" "}
                        <InlineMath math={"+"}/>와 곱셈 <InlineMath math={"\\cdot"}/>으로 이루어지며 다음을
                        만족한다.
                    </p>}
                />
                <T
                    en={<ol>
                        <li><strong>Closure.</strong> For every{" "}
                            <InlineMath math={"\\alpha, \\beta \\in \\mathcal{F}"}/>, both{" "}
                            <InlineMath math={"\\alpha + \\beta"}/> and{" "}
                            <InlineMath math={"\\alpha \\cdot \\beta"}/> are in{" "}
                            <InlineMath math={"\\mathcal{F}"}/>.</li>
                        <li><strong>Commutativity.</strong>{" "}
                            <InlineMath math={"\\alpha + \\beta = \\beta + \\alpha"}/> and{" "}
                            <InlineMath math={"\\alpha \\cdot \\beta = \\beta \\cdot \\alpha"}/>.</li>
                        <li><strong>Associativity.</strong>{" "}
                            <InlineMath math={"(\\alpha + \\beta) + \\gamma = \\alpha + (\\beta + \\gamma)"}/> and{" "}
                            <InlineMath math={"(\\alpha \\cdot \\beta) \\cdot \\gamma = \\alpha \\cdot (\\beta \\cdot \\gamma)"}/>.</li>
                        <li><strong>Distributivity.</strong>{" "}
                            <InlineMath math={"\\alpha \\cdot (\\beta + \\gamma) = (\\alpha \\cdot \\beta) + (\\alpha \\cdot \\gamma)"}/>.</li>
                        <li><strong>Identities.</strong> There are elements <InlineMath math={"0"}/> and{" "}
                            <InlineMath math={"1"}/> with <InlineMath math={"\\alpha + 0 = \\alpha"}/> and{" "}
                            <InlineMath math={"1 \\cdot \\alpha = \\alpha"}/> for every{" "}
                            <InlineMath math={"\\alpha"}/>.</li>
                        <li><strong>Additive inverse.</strong> For every <InlineMath math={"\\alpha"}/> there
                            is a <InlineMath math={"\\beta"}/> with{" "}
                            <InlineMath math={"\\alpha + \\beta = 0"}/>.</li>
                        <li><strong>Multiplicative inverse.</strong> For every{" "}
                            <InlineMath math={"\\alpha \\neq 0"}/> there is a{" "}
                            <InlineMath math={"\\gamma"}/> with{" "}
                            <InlineMath math={"\\alpha \\cdot \\gamma = 1"}/>.</li>
                    </ol>}
                    ko={<ol>
                        <li><strong>닫힘.</strong> 모든{" "}
                            <InlineMath math={"\\alpha, \\beta \\in \\mathcal{F}"}/>에 대해{" "}
                            <InlineMath math={"\\alpha + \\beta"}/>와{" "}
                            <InlineMath math={"\\alpha \\cdot \\beta"}/>가 다시{" "}
                            <InlineMath math={"\\mathcal{F}"}/>에 있다.</li>
                        <li><strong>교환.</strong>{" "}
                            <InlineMath math={"\\alpha + \\beta = \\beta + \\alpha"}/>이고{" "}
                            <InlineMath math={"\\alpha \\cdot \\beta = \\beta \\cdot \\alpha"}/>이다.</li>
                        <li><strong>결합.</strong>{" "}
                            <InlineMath math={"(\\alpha + \\beta) + \\gamma = \\alpha + (\\beta + \\gamma)"}/>이고{" "}
                            <InlineMath math={"(\\alpha \\cdot \\beta) \\cdot \\gamma = \\alpha \\cdot (\\beta \\cdot \\gamma)"}/>이다.</li>
                        <li><strong>분배.</strong>{" "}
                            <InlineMath math={"\\alpha \\cdot (\\beta + \\gamma) = (\\alpha \\cdot \\beta) + (\\alpha \\cdot \\gamma)"}/>이다.</li>
                        <li><strong>항등원.</strong> 모든 <InlineMath math={"\\alpha"}/>에 대해{" "}
                            <InlineMath math={"\\alpha + 0 = \\alpha"}/>,{" "}
                            <InlineMath math={"1 \\cdot \\alpha = \\alpha"}/>인 원소{" "}
                            <InlineMath math={"0"}/>과 <InlineMath math={"1"}/>이 있다.</li>
                        <li><strong>덧셈의 역원.</strong> 모든 <InlineMath math={"\\alpha"}/>에 대해{" "}
                            <InlineMath math={"\\alpha + \\beta = 0"}/>인 <InlineMath math={"\\beta"}/>가
                            있다.</li>
                        <li><strong>곱셈의 역원.</strong> <InlineMath math={"\\alpha \\neq 0"}/>인 모든{" "}
                            <InlineMath math={"\\alpha"}/>에 대해{" "}
                            <InlineMath math={"\\alpha \\cdot \\gamma = 1"}/>인{" "}
                            <InlineMath math={"\\gamma"}/>가 있다.</li>
                    </ol>}
                />
            </Definition>
            <Example title={<T en={<>The definition on actual numbers</>} ko={<>실제 수로 확인해 보기</>}/>}>
                <T
                    en={<p>
                        Take <InlineMath math={"\\mathcal{F} = \\mathbb{Q}"}/> with the arithmetic you already
                        know. Every axiom is a statement you can check on a pair of fractions:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{F} = \\mathbb{Q}"}/>에 이미 아는 산술을 얹어 보자. 모든
                        axiom이 분수 한 쌍으로 확인되는 진술이다.
                    </p>}
                />
                <BlockMath math={"\\tfrac{2}{3} + \\tfrac{1}{2} = \\tfrac{7}{6} \\in \\mathbb{Q}, \\qquad \\tfrac{2}{3} \\cdot \\tfrac{1}{2} = \\tfrac{1}{3} \\in \\mathbb{Q}, \\qquad \\tfrac{2}{3} \\cdot \\tfrac{3}{2} = 1"}/>
                <Terms items={[
                    ["\\tfrac{2}{3}, \\tfrac{1}{2}", <T en={<>two specific scalars, playing the roles of <InlineMath math={"\\alpha"}/> and <InlineMath math={"\\beta"}/></>}
                                                       ko={<>구체적인 스칼라 둘. <InlineMath math={"\\alpha"}/>와 <InlineMath math={"\\beta"}/> 자리에 들어간 값이다</>}/>],
                    ["\\tfrac{7}{6}, \\tfrac{1}{3}", <T en={<>the sum and the product, both still rational: axiom 1</>}
                                                       ko={<>합과 곱. 둘 다 여전히 유리수다. axiom 1이다</>}/>],
                    ["\\tfrac{3}{2}", <T en={<>the multiplicative inverse of <InlineMath math={"\\tfrac{2}{3}"}/>: axiom 7</>}
                                        ko={<><InlineMath math={"\\tfrac{2}{3}"}/>의 곱셈 역원. axiom 7이다</>}/>],
                ]}/>
            </Example>
            <T
                en={<p>
                    The asymmetry between proving and disproving is the first place Chapter 1 pays off. To
                    show a set is a field you must check all seven axioms, because the definition is a{" "}
                    <InlineMath math={"\\forall"}/> over the list. To show it is not a field you exhibit one
                    failure, because the negation of that <InlineMath math={"\\forall"}/> is an{" "}
                    <InlineMath math={"\\exists"}/>. The cleanest non-example fails exactly one axiom:
                </p>}
                ko={<p>
                    증명과 반증의 비대칭이 1장이 처음으로 값을 하는 자리다. 어떤 집합이 체임을 보이려면 axiom
                    일곱 개를 전부 확인해야 한다. 정의가 목록 전체에 걸린 <InlineMath math={"\\forall"}/>이기
                    때문이다. 체가 아님을 보이려면 무너지는 것 하나만 제시하면 된다. 그{" "}
                    <InlineMath math={"\\forall"}/>의 부정이 <InlineMath math={"\\exists"}/>이기 때문이다.
                    가장 깔끔한 반례는 axiom 하나만 어기는 것이다.
                </p>}
            />
            <table className="table-center">
                <thead>
                <tr>
                    <th>{t("Set", "집합")}</th>
                    <th>{t("Field?", "체인가?")}</th>
                    <th>{t("Witness", "근거")}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><InlineMath math={"\\mathbb{R}, \\; \\mathbb{C}, \\; \\mathbb{Q}"}/></td>
                    <td>{t("yes", "그렇다")}</td>
                    <td>{t("all seven axioms hold", "axiom 일곱 개가 모두 성립한다")}</td>
                </tr>
                <tr>
                    <td><InlineMath math={"\\mathbb{Z}"}/></td>
                    <td>{t("no", "아니다")}</td>
                    <td>
                        {t("axiom 7 only: ", "axiom 7 하나만 깨진다. ")}
                        <InlineMath math={"2 \\cdot \\gamma = 1"}/>
                        {t(" has no integer solution", "을 만족하는 정수가 없다")}
                    </td>
                </tr>
                <tr>
                    <td>{t("the irrationals", "무리수")}</td>
                    <td>{t("no", "아니다")}</td>
                    <td>
                        {t("axiom 1: ", "axiom 1. ")}
                        <InlineMath math={"\\sqrt{2} \\cdot \\sqrt{2} = 2"}/>
                        {t(" is rational", "는 유리수다")}
                    </td>
                </tr>
                <tr>
                    <td><InlineMath math={"2 \\times 2"}/> {t("real matrices", "실행렬")}</td>
                    <td>{t("no", "아니다")}</td>
                    <td>
                        {t("axiom 2: ", "axiom 2. ")}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 0 & 1 \\\\ 0 & 0 \\end{smallmatrix}\\right]\\left[\\begin{smallmatrix} 0 & 0 \\\\ 1 & 0 \\end{smallmatrix}\\right] \\neq \\left[\\begin{smallmatrix} 0 & 0 \\\\ 1 & 0 \\end{smallmatrix}\\right]\\left[\\begin{smallmatrix} 0 & 1 \\\\ 0 & 0 \\end{smallmatrix}\\right]"}/>
                    </td>
                </tr>
                <tr>
                    <td><InlineMath math={"2 \\times 2"}/> {t("real diagonal matrices", "실대각행렬")}</td>
                    <td>{t("no", "아니다")}</td>
                    <td>
                        {t("axiom 7: ", "axiom 7. ")}
                        <InlineMath math={"\\operatorname{diag}(1, 0)"}/>
                        {t(" has no inverse", "에는 역원이 없다")}
                    </td>
                </tr>
                </tbody>
            </table>
            <Definition n="2.2" title={<T en={<>Vector space</>} ko={<>벡터 공간</>}/>}>
                <T
                    en={<p>
                        A <strong>vector space</strong> over a field{" "}
                        <InlineMath math={"\\mathcal{F}"}/>, written{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>, consists of a set{" "}
                        <InlineMath math={"\\mathcal{X}"}/> of elements called vectors, the field{" "}
                        <InlineMath math={"\\mathcal{F}"}/>, and two operations, vector addition and scalar
                        multiplication, such that:
                    </p>}
                    ko={<p>
                        체 <InlineMath math={"\\mathcal{F}"}/> 위의 <strong>벡터 공간</strong>{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>은 벡터라 부르는 원소들의 집합{" "}
                        <InlineMath math={"\\mathcal{X}"}/>, 체 <InlineMath math={"\\mathcal{F}"}/>, 그리고
                        벡터 덧셈과 스칼라 곱이라는 두 연산으로 이루어지며 다음을 만족한다.
                    </p>}
                />
                <T
                    en={<ol>
                        <li>Addition is closed: <InlineMath math={"v^1 + v^2 \\in \\mathcal{X}"}/> for all{" "}
                            <InlineMath math={"v^1, v^2 \\in \\mathcal{X}"}/>.</li>
                        <li>Addition is commutative:{" "}
                            <InlineMath math={"v^1 + v^2 = v^2 + v^1"}/>.</li>
                        <li>Addition is associative:{" "}
                            <InlineMath math={"(v^1 + v^2) + v^3 = v^1 + (v^2 + v^3)"}/>.</li>
                        <li>There is a vector <InlineMath math={"0 \\in \\mathcal{X}"}/>, the{" "}
                            <strong>origin</strong>, with <InlineMath math={"0 + v = v"}/> for all{" "}
                            <InlineMath math={"v"}/>.</li>
                        <li>Every <InlineMath math={"v \\in \\mathcal{X}"}/> has a{" "}
                            <InlineMath math={"\\bar v \\in \\mathcal{X}"}/> with{" "}
                            <InlineMath math={"v + \\bar v = 0"}/>.</li>
                        <li>Scalar multiplication is closed:{" "}
                            <InlineMath math={"\\alpha \\cdot v \\in \\mathcal{X}"}/> for all{" "}
                            <InlineMath math={"\\alpha \\in \\mathcal{F}"}/> and{" "}
                            <InlineMath math={"v \\in \\mathcal{X}"}/>.</li>
                        <li>Scalar multiplication is associative:{" "}
                            <InlineMath math={"\\alpha \\cdot (\\beta \\cdot v) = (\\alpha \\cdot \\beta) \\cdot v"}/>.</li>
                        <li>Scalar multiplication distributes over vector addition:{" "}
                            <InlineMath math={"\\alpha \\cdot (v^1 + v^2) = \\alpha \\cdot v^1 + \\alpha \\cdot v^2"}/>.</li>
                        <li>Scalar multiplication distributes over scalar addition:{" "}
                            <InlineMath math={"(\\alpha + \\beta) \\cdot v = \\alpha \\cdot v + \\beta \\cdot v"}/>.</li>
                        <li><InlineMath math={"1 \\cdot v = v"}/>, where <InlineMath math={"1"}/> is the unit
                            of <InlineMath math={"\\mathcal{F}"}/>.</li>
                    </ol>}
                    ko={<ol>
                        <li>덧셈이 닫혀 있다. 모든{" "}
                            <InlineMath math={"v^1, v^2 \\in \\mathcal{X}"}/>에 대해{" "}
                            <InlineMath math={"v^1 + v^2 \\in \\mathcal{X}"}/>이다.</li>
                        <li>덧셈이 교환된다.{" "}
                            <InlineMath math={"v^1 + v^2 = v^2 + v^1"}/>이다.</li>
                        <li>덧셈이 결합된다.{" "}
                            <InlineMath math={"(v^1 + v^2) + v^3 = v^1 + (v^2 + v^3)"}/>이다.</li>
                        <li>모든 <InlineMath math={"v"}/>에 대해 <InlineMath math={"0 + v = v"}/>인 벡터{" "}
                            <InlineMath math={"0 \\in \\mathcal{X}"}/>, 곧 <strong>원점</strong>이 있다.</li>
                        <li>모든 <InlineMath math={"v \\in \\mathcal{X}"}/>에 대해{" "}
                            <InlineMath math={"v + \\bar v = 0"}/>인{" "}
                            <InlineMath math={"\\bar v \\in \\mathcal{X}"}/>가 있다.</li>
                        <li>스칼라 곱이 닫혀 있다. 모든{" "}
                            <InlineMath math={"\\alpha \\in \\mathcal{F}"}/>,{" "}
                            <InlineMath math={"v \\in \\mathcal{X}"}/>에 대해{" "}
                            <InlineMath math={"\\alpha \\cdot v \\in \\mathcal{X}"}/>이다.</li>
                        <li>스칼라 곱이 결합된다.{" "}
                            <InlineMath math={"\\alpha \\cdot (\\beta \\cdot v) = (\\alpha \\cdot \\beta) \\cdot v"}/>이다.</li>
                        <li>스칼라 곱이 벡터 덧셈에 분배된다.{" "}
                            <InlineMath math={"\\alpha \\cdot (v^1 + v^2) = \\alpha \\cdot v^1 + \\alpha \\cdot v^2"}/>이다.</li>
                        <li>스칼라 곱이 스칼라 덧셈에 분배된다.{" "}
                            <InlineMath math={"(\\alpha + \\beta) \\cdot v = \\alpha \\cdot v + \\beta \\cdot v"}/>이다.</li>
                        <li><InlineMath math={"\\mathcal{F}"}/>의 단위원 <InlineMath math={"1"}/>에 대해{" "}
                            <InlineMath math={"1 \\cdot v = v"}/>이다.</li>
                    </ol>}
                />
            </Definition>
            <Example title={<T en={<>The ten axioms on <InlineMath math={"(\\mathbb{R}^2, \\mathbb{R})"}/></>}
                              ko={<><InlineMath math={"(\\mathbb{R}^2, \\mathbb{R})"}/>에서 axiom 열 개</>}/>}>
                <T
                    en={<p>
                        Nothing in the list is exotic once you put numbers in it. With{" "}
                        <InlineMath math={"v^1 = (1, 2)^\\top"}/>,{" "}
                        <InlineMath math={"v^2 = (3, -1)^\\top"}/> and{" "}
                        <InlineMath math={"\\alpha = 2"}/>:
                    </p>}
                    ko={<p>
                        숫자를 넣어 보면 목록에 신기한 것은 하나도 없다.{" "}
                        <InlineMath math={"v^1 = (1, 2)^\\top"}/>,{" "}
                        <InlineMath math={"v^2 = (3, -1)^\\top"}/>,{" "}
                        <InlineMath math={"\\alpha = 2"}/>로 두면
                    </p>}
                />
                <BlockMath math={"v^1 + v^2 = \\begin{bmatrix} 4 \\\\ 1 \\end{bmatrix}, \\qquad 2 \\cdot v^1 = \\begin{bmatrix} 2 \\\\ 4 \\end{bmatrix}, \\qquad 0 = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix}, \\qquad \\bar{v}^1 = \\begin{bmatrix} -1 \\\\ -2 \\end{bmatrix}"}/>
                <Terms items={[
                    ["v^1 + v^2", <T en={<>axiom 1: the sum is again a column of two reals</>}
                                    ko={<>axiom 1. 합이 다시 실수 두 개짜리 열이다</>}/>],
                    ["2 \\cdot v^1", <T en={<>axiom 6: scaling stays inside the set</>}
                                       ko={<>axiom 6. 스칼라배를 해도 집합 안에 남는다</>}/>],
                    ["0", <T en={<>axiom 4: the origin, the one vector every subspace must contain</>}
                            ko={<>axiom 4. 원점이며, 모든 부분 공간이 반드시 품어야 하는 벡터다</>}/>],
                    ["\\bar{v}^1", <T en={<>axiom 5: the additive inverse, here <InlineMath math={"(-1) \\cdot v^1"}/></>}
                                     ko={<>axiom 5. 덧셈 역원이고 여기서는 <InlineMath math={"(-1) \\cdot v^1"}/>이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The same check works with <InlineMath math={"\\mathcal{X} = \\mathbb{R}^{2 \\times 2}"}/>,
                        where a single vector is a whole matrix, and its origin is the zero matrix.
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{X} = \\mathbb{R}^{2 \\times 2}"}/>에서도 같은 확인이
                        통한다. 여기서는 행렬 하나가 벡터 하나이고, 원점은 영행렬이다.
                    </p>}
                />
            </Example>
            <Example title={<T en={<>A non-example that fails exactly one axiom</>}
                              ko={<>axiom 하나만 어기는 반례</>}/>}>
                <T
                    en={<p>
                        Keep <InlineMath math={"\\mathcal{X} = \\mathbb{R}^2"}/> and ordinary addition, but
                        redefine scalar multiplication so that it throws away the second entry:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{X} = \\mathbb{R}^2"}/>과 보통의 덧셈은 그대로 두고,
                        스칼라 곱만 둘째 성분을 버리도록 다시 정의해 보자.
                    </p>}
                />
                <BlockMath math={"\\alpha \\odot \\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix} := \\begin{bmatrix} \\alpha x_1 \\\\ 0 \\end{bmatrix} \\quad \\Longrightarrow \\quad 1 \\odot \\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix} = \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} \\neq \\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix}"}/>
                <Terms items={[
                    ["\\odot", <T en={<>the redefined scalar multiplication, which is where the failure hides</>}
                                 ko={<>다시 정의한 스칼라 곱. 결함이 숨어 있는 자리다</>}/>],
                    ["1 \\odot v \\neq v", <T en={<>axiom 10 fails, on the single vector <InlineMath math={"(1,2)^\\top"}/></>}
                                             ko={<>벡터 <InlineMath math={"(1,2)^\\top"}/> 하나에서 axiom 10이 깨진다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Axioms 1 through 9 all still hold, which is worth checking on 7 and 9 to convince
                        yourself. Axiom 10 alone fails, and that is enough:{" "}
                        <InlineMath math={"(\\mathbb{R}^2, \\mathbb{R}, \\odot)"}/> is not a vector space.
                        This is why the tenth axiom, which looks like a triviality, is written down at all.
                    </p>}
                    ko={<p>
                        axiom 1부터 9까지는 그대로 성립하며, 7과 9를 직접 확인해 보면 납득이 된다. 오직 axiom
                        10만 깨지고 그것으로 충분하다.{" "}
                        <InlineMath math={"(\\mathbb{R}^2, \\mathbb{R}, \\odot)"}/>은 벡터 공간이 아니다.
                        당연해 보이는 열 번째 axiom을 굳이 적어 두는 이유가 이것이다.
                    </p>}
                />
            </Example>
            <Example n="2.3" title={<T en={<>Vector spaces you already use</>} ko={<>이미 쓰고 있는 벡터 공간들</>}/>}>
                <T
                    en={<ul>
                        <li>Every field over itself:{" "}
                            <InlineMath math={"(\\mathbb{R}, \\mathbb{R})"}/>,{" "}
                            <InlineMath math={"(\\mathbb{C}, \\mathbb{C})"}/>,{" "}
                            <InlineMath math={"(\\mathbb{Q}, \\mathbb{Q})"}/>.</li>
                        <li><InlineMath math={"(\\mathbb{C}, \\mathbb{R})"}/>: a real scalar times a complex
                            number is a complex number, for instance{" "}
                            <InlineMath math={"2 \\cdot (3 + 4j) = 6 + 8j"}/>, so the axioms go through.</li>
                        <li><InlineMath math={"(\\mathcal{F}^n, \\mathcal{F})"}/>, columns of{" "}
                            <InlineMath math={"n"}/> scalars, with entrywise operations.</li>
                        <li><InlineMath math={"(\\mathcal{F}^{n \\times m}, \\mathcal{F})"}/>: matrices are
                            vectors too.</li>
                        <li><InlineMath math={"\\mathcal{X} = \\{f : D \\to \\mathbb{R}\\}"}/> over{" "}
                            <InlineMath math={"\\mathbb{R}"}/>, with{" "}
                            <InlineMath math={"(f+g)(t) := f(t) + g(t)"}/> and{" "}
                            <InlineMath math={"(\\alpha \\cdot f)(t) := \\alpha \\cdot f(t)"}/>.</li>
                        <li><InlineMath math={"(\\mathbb{R}, \\mathbb{Q})"}/>: the vectors are real numbers
                            and the scalars are rationals. Useless in robotics and worth ten seconds anyway,
                            for reasons that appear under dimension.</li>
                    </ul>}
                    ko={<ul>
                        <li>모든 체는 자기 자신 위의 벡터 공간이다.{" "}
                            <InlineMath math={"(\\mathbb{R}, \\mathbb{R})"}/>,{" "}
                            <InlineMath math={"(\\mathbb{C}, \\mathbb{C})"}/>,{" "}
                            <InlineMath math={"(\\mathbb{Q}, \\mathbb{Q})"}/>.</li>
                        <li><InlineMath math={"(\\mathbb{C}, \\mathbb{R})"}/>. 실수 스칼라와 복소수의 곱은{" "}
                            <InlineMath math={"2 \\cdot (3 + 4j) = 6 + 8j"}/>처럼 복소수라서 axiom이 그대로
                            통과한다.</li>
                        <li><InlineMath math={"(\\mathcal{F}^n, \\mathcal{F})"}/>. 스칼라{" "}
                            <InlineMath math={"n"}/>개를 쌓은 열이고 연산은 성분별로 한다.</li>
                        <li><InlineMath math={"(\\mathcal{F}^{n \\times m}, \\mathcal{F})"}/>. 행렬도 벡터다.</li>
                        <li><InlineMath math={"\\mathbb{R}"}/> 위의{" "}
                            <InlineMath math={"\\mathcal{X} = \\{f : D \\to \\mathbb{R}\\}"}/>. 연산은{" "}
                            <InlineMath math={"(f+g)(t) := f(t) + g(t)"}/>,{" "}
                            <InlineMath math={"(\\alpha \\cdot f)(t) := \\alpha \\cdot f(t)"}/>로 정의한다.</li>
                        <li><InlineMath math={"(\\mathbb{R}, \\mathbb{Q})"}/>. 벡터가 실수이고 스칼라가
                            유리수다. 로봇에는 쓸모가 없지만 차원 절에서 드러날 이유로 십 초쯤 볼 값어치는
                            있다.</li>
                    </ul>}
                />
                <T
                    en={<p>
                        Proving that the function space is a vector space means checking all ten axioms. The
                        notes check axiom 8, and the whole method is to evaluate both sides at a point{" "}
                        <InlineMath math={"t"}/> and then use what we already know about real numbers.
                    </p>}
                    ko={<p>
                        함수 공간이 벡터 공간임을 보이려면 axiom 열 개를 다 확인해야 한다. 원 교재는 axiom
                        8을 확인하는데, 방법은 하나다. 양변을 점 <InlineMath math={"t"}/>에서 값매김하고,
                        실수에 대해 이미 아는 것을 쓴다.
                    </p>}
                />
                <Proof label={t("Proof of axiom 8", "axiom 8 확인")}>
                    <T en={<p>We must show that the two functions below are equal:</p>}
                       ko={<p>아래 두 함수가 같음을 보여야 한다.</p>}/>
                    <BlockMath math={"\\alpha \\cdot (f + g) = \\alpha \\cdot f + \\alpha \\cdot g"}/>
                    <Terms items={[
                        ["f, g", <T en={<>elements of <InlineMath math={"\\mathcal{X}"}/>, that is, functions from <InlineMath math={"D"}/> to <InlineMath math={"\\mathbb{R}"}/></>}
                                   ko={<><InlineMath math={"\\mathcal{X}"}/>의 원소. 즉 <InlineMath math={"D"}/>에서 <InlineMath math={"\\mathbb{R}"}/>로 가는 함수</>}/>],
                        ["\\alpha", <T en={<>a scalar in <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/></>}
                                      ko={<><InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/>의 스칼라</>}/>],
                        ["f + g", <T en={<>the function defined pointwise by <InlineMath math={"(f+g)(t) := f(t) + g(t)"}/></>}
                                    ko={<>점마다 <InlineMath math={"(f+g)(t) := f(t) + g(t)"}/>로 정의한 함수</>}/>],
                    ]}/>
                    <T en={<p>Two functions are equal when they agree at every point, so fix{" "}
                        <InlineMath math={"t \\in D"}/> and expand the left side one definition at a time:</p>}
                       ko={<p>두 함수가 같다는 것은 모든 점에서 값이 같다는 뜻이므로{" "}
                           <InlineMath math={"t \\in D"}/>를 하나 고정하고 좌변을 정의 하나씩 적용해
                           전개한다.</p>}/>
                    <BlockMath math={"[\\alpha \\cdot (f + g)](t) \\;\\overset{(6)}{=}\\; \\alpha \\cdot [f+g](t) \\;\\overset{(1)}{=}\\; \\alpha \\cdot [f(t) + g(t)] \\;\\overset{(\\ast)}{=}\\; \\alpha \\cdot f(t) + \\alpha \\cdot g(t)"}/>
                    <Terms items={[
                        ["t", <T en={<>an arbitrary point of the domain <InlineMath math={"D"}/>, fixed for the rest of the argument</>}
                                ko={<>정의역 <InlineMath math={"D"}/>의 임의의 점. 이 논증 동안 고정한다</>}/>],
                        ["(6)", <T en={<>the definition of <InlineMath math={"\\alpha \\cdot f"}/> in this space</>}
                                  ko={<>이 공간에서 <InlineMath math={"\\alpha \\cdot f"}/>의 정의</>}/>],
                        ["(1)", <T en={<>the definition of <InlineMath math={"f + g"}/> in this space</>}
                                  ko={<>이 공간에서 <InlineMath math={"f + g"}/>의 정의</>}/>],
                        ["(\\ast)", <T en={<>distributivity of <em>real numbers</em>, which is the only outside fact used</>}
                                      ko={<><em>실수</em>의 분배법칙. 바깥에서 끌어 쓴 사실은 이것 하나뿐이다</>}/>],
                    ]}/>
                    <T en={<p>Now the right side, by the same two definitions:</p>}
                       ko={<p>같은 두 정의로 우변도 전개한다.</p>}/>
                    <BlockMath math={"[\\alpha \\cdot f + \\alpha \\cdot g](t) \\;\\overset{(1)}{=}\\; [\\alpha \\cdot f](t) + [\\alpha \\cdot g](t) \\;\\overset{(6)}{=}\\; \\alpha \\cdot f(t) + \\alpha \\cdot g(t)"}/>
                    <Terms items={[
                        ["\\alpha \\cdot f", <T en={<>the function defined pointwise by <InlineMath math={"(\\alpha \\cdot f)(t) := \\alpha \\cdot f(t)"}/></>}
                                               ko={<>점마다 <InlineMath math={"(\\alpha \\cdot f)(t) := \\alpha \\cdot f(t)"}/>로 정의한 함수</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Both expansions end at the same real number, and{" "}
                            <InlineMath math={"t"}/> was arbitrary, so the two functions agree everywhere and
                            axiom 8 holds. The other nine go the same way.
                        </p>}
                        ko={<p>
                            두 전개의 끝이 같은 실수이고 <InlineMath math={"t"}/>는 임의로 잡았으므로 두
                            함수는 모든 점에서 같고 axiom 8이 성립한다. 나머지 아홉 개도 같은 방식이다.
                        </p>}
                    />
                </Proof>
            </Example>
            <Example n="2.4" title={<T en={<>Non-examples</>} ko={<>벡터 공간이 아닌 것들</>}/>}>
                <T
                    en={<ul>
                        <li><InlineMath math={"(\\mathbb{R}, \\mathbb{C})"}/>: the scalar{" "}
                            <InlineMath math={"j"}/> times the vector <InlineMath math={"1"}/> gives{" "}
                            <InlineMath math={"j \\notin \\mathbb{R}"}/>, so scalar multiplication is not
                            even defined into <InlineMath math={"\\mathcal{X}"}/>.</li>
                        <li><InlineMath math={"\\mathcal{X} = \\{x \\in \\mathbb{R} \\mid x \\ge 0\\}"}/> over{" "}
                            <InlineMath math={"\\mathbb{R}"}/>:{" "}
                            <InlineMath math={"(-1) \\cdot 3 = -3 \\notin \\mathcal{X}"}/>.</li>
                        <li><InlineMath math={"(\\mathbb{Q}, \\mathbb{R})"}/>: sums of rationals are fine, but{" "}
                            <InlineMath math={"\\sqrt{2} \\cdot 1 = \\sqrt{2} \\notin \\mathbb{Q}"}/>.</li>
                    </ul>}
                    ko={<ul>
                        <li><InlineMath math={"(\\mathbb{R}, \\mathbb{C})"}/>. 스칼라{" "}
                            <InlineMath math={"j"}/>와 벡터 <InlineMath math={"1"}/>의 곱이{" "}
                            <InlineMath math={"j \\notin \\mathbb{R}"}/>이므로 스칼라 곱이{" "}
                            <InlineMath math={"\\mathcal{X}"}/> 안으로 정의되지도 않는다.</li>
                        <li><InlineMath math={"\\mathbb{R}"}/> 위의{" "}
                            <InlineMath math={"\\mathcal{X} = \\{x \\in \\mathbb{R} \\mid x \\ge 0\\}"}/>.{" "}
                            <InlineMath math={"(-1) \\cdot 3 = -3 \\notin \\mathcal{X}"}/>이다.</li>
                        <li><InlineMath math={"(\\mathbb{Q}, \\mathbb{R})"}/>. 유리수끼리의 합은 괜찮지만{" "}
                            <InlineMath math={"\\sqrt{2} \\cdot 1 = \\sqrt{2} \\notin \\mathbb{Q}"}/>이다.</li>
                    </ul>}
                />
            </Example>
            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Subspaces</h2>} ko={<h2>부분 공간</h2>}/>
            <T
                en={<p>
                    A subspace is a subset that is a vector space on its own, using the operations it
                    inherits. Almost everything estimation does is a statement about a subspace: the set of
                    states consistent with a measurement, the directions a sensor cannot see, the space a
                    least squares solution is projected onto.
                </p>}
                ko={<p>
                    부분 공간은 물려받은 연산을 그대로 써서 그 자체로 벡터 공간이 되는 부분집합이다. 추정에서
                    하는 일은 거의 전부 부분 공간에 대한 진술이다. 측정과 모순되지 않는 상태들의 집합, 센서가
                    볼 수 없는 방향, 최소제곱 해가 사영되는 공간이 모두 그렇다.
                </p>}
            />
            <Definition n="2.5" title={<T en={<>Subset and set equality</>} ko={<>부분집합과 집합의 같음</>}/>}>
                <BlockMath math={"(A \\subset B) \\iff (a \\in A \\implies a \\in B), \\qquad (A = B) \\iff (A \\subset B \\ \\text{and} \\ B \\subset A)"}/>
                <Terms items={[
                    ["A, B", <T en={<>any two sets, for example <InlineMath math={"A = \\{1, 2\\}"}/> and <InlineMath math={"B = \\{1, 2, 3\\}"}/></>}
                             ko={<>임의의 두 집합. 예를 들어 <InlineMath math={"A = \\{1, 2\\}"}/>, <InlineMath math={"B = \\{1, 2, 3\\}"}/></>}/>],
                    ["\\subset", <T en={<>"is a subset of", allowing <InlineMath math={"A = B"}/>: this course never uses a strict-subset symbol</>}
                                   ko={<>"부분집합이다". <InlineMath math={"A = B"}/>도 허용한다. 이 과목에서는 진부분집합 기호를 쓰지 않는다</>}/>],
                    ["\\implies", <T en={<>logical implication, as in Chapter 1</>} ko={<>1장에서 쓴 논리적 implication</>}/>],
                    ["A = B", <T en={<>set equality, proved as two inclusions: the standard two-part proof</>}
                               ko={<>집합의 같음. 포함 관계 두 개로 증명한다. 흔히 쓰는 두 갈래 증명이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        With those two sets, <InlineMath math={"A \\subset B"}/> holds and{" "}
                        <InlineMath math={"B \\subset A"}/> fails, because{" "}
                        <InlineMath math={"3 \\in B"}/> and <InlineMath math={"3 \\notin A"}/>. So{" "}
                        <InlineMath math={"A \\neq B"}/>, and one element was enough to say so.
                    </p>}
                    ko={<p>
                        이 두 집합에서는 <InlineMath math={"A \\subset B"}/>가 성립하고{" "}
                        <InlineMath math={"B \\subset A"}/>는 깨진다. <InlineMath math={"3 \\in B"}/>인데{" "}
                        <InlineMath math={"3 \\notin A"}/>이기 때문이다. 따라서{" "}
                        <InlineMath math={"A \\neq B"}/>이고, 그 판정에는 원소 하나면 충분했다.
                    </p>}
                />
            </Definition>
            <Definition n="2.6" title={<T en={<>Subspace</>} ko={<>부분 공간</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/> be a vector space and{" "}
                        <InlineMath math={"\\mathcal{Y} \\subset \\mathcal{X}"}/>. Then{" "}
                        <InlineMath math={"\\mathcal{Y}"}/> is a <strong>subspace</strong> if{" "}
                        <InlineMath math={"(\\mathcal{Y}, \\mathcal{F})"}/> is itself a vector space under the
                        addition and scalar multiplication of{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>이 벡터 공간이고{" "}
                        <InlineMath math={"\\mathcal{Y} \\subset \\mathcal{X}"}/>라 하자.{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>의 덧셈과 스칼라 곱을 그대로 써서{" "}
                        <InlineMath math={"(\\mathcal{Y}, \\mathcal{F})"}/>이 벡터 공간이 되면{" "}
                        <InlineMath math={"\\mathcal{Y}"}/>를 <strong>부분 공간</strong>이라 한다.
                    </p>}
                />
            </Definition>
            <Example title={<T en={<>The smallest interesting subspace</>} ko={<>가장 작은 흥미로운 부분 공간</>}/>}>
                <T
                    en={<p>
                        In <InlineMath math={"(\\mathbb{R}^2, \\mathbb{R})"}/> take the line through the
                        origin in the direction <InlineMath math={"(1,2)^\\top"}/>, that is,{" "}
                        <InlineMath math={"\\mathcal{Y} = \\{\\beta (1,2)^\\top \\mid \\beta \\in \\mathbb{R}\\}"}/>.
                        Two of its points and a scalar:
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathbb{R}^2, \\mathbb{R})"}/>에서 원점을 지나고 방향이{" "}
                        <InlineMath math={"(1,2)^\\top"}/>인 직선, 곧{" "}
                        <InlineMath math={"\\mathcal{Y} = \\{\\beta (1,2)^\\top \\mid \\beta \\in \\mathbb{R}\\}"}/>을
                        보자. 그 위의 점 둘과 스칼라 하나를 잡으면
                    </p>}
                />
                <BlockMath math={"\\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix} + \\begin{bmatrix} 3 \\\\ 6 \\end{bmatrix} = \\begin{bmatrix} 4 \\\\ 8 \\end{bmatrix} \\in \\mathcal{Y}, \\qquad (-2)\\begin{bmatrix} 3 \\\\ 6 \\end{bmatrix} = \\begin{bmatrix} -6 \\\\ -12 \\end{bmatrix} \\in \\mathcal{Y}, \\qquad 0 \\cdot \\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix} \\in \\mathcal{Y}"}/>
                <Terms items={[
                    ["(1,2)^\\top, (3,6)^\\top", <T en={<>two specific points of <InlineMath math={"\\mathcal{Y}"}/>, at <InlineMath math={"\\beta = 1"}/> and <InlineMath math={"\\beta = 3"}/></>}
                                                  ko={<><InlineMath math={"\\mathcal{Y}"}/>의 구체적인 점 둘. <InlineMath math={"\\beta = 1"}/>과 <InlineMath math={"\\beta = 3"}/>에 해당한다</>}/>],
                    ["(4,8)^\\top", <T en={<>the sum, which is <InlineMath math={"\\beta = 4"}/>: still on the line</>}
                                      ko={<>합. <InlineMath math={"\\beta = 4"}/>에 해당하며 여전히 직선 위에 있다</>}/>],
                    ["(0,0)^\\top", <T en={<>the origin, reached at <InlineMath math={"\\beta = 0"}/>: the first thing to check</>}
                                      ko={<>원점. <InlineMath math={"\\beta = 0"}/>에서 나오며 가장 먼저 확인할 것이다</>}/>],
                ]}/>
            </Example>
            <Remark n="2.7" title={<T en={<>Check the origin first</>} ko={<>원점부터 확인한다</>}/>}>
                <T
                    en={<p>
                        Proving a set is a subspace from the definition means the ten axioms again. Proving
                        it is not means finding one violation, and the fastest place to look is{" "}
                        <InlineMath math={"0 \\in \\mathcal{Y}"}/>. A set that misses the origin is
                        disqualified immediately, and in practice that is how most candidates fail.
                    </p>}
                    ko={<p>
                        정의만으로 부분 공간임을 보이려면 또 axiom 열 개다. 아님을 보이려면 위반 하나를 찾으면
                        되고, 가장 빨리 볼 곳은 <InlineMath math={"0 \\in \\mathcal{Y}"}/>다. 원점을 놓친
                        집합은 그 자리에서 탈락이고, 실제로 후보들이 무너지는 방식도 대개 이것이다.
                    </p>}
                />
            </Remark>
            <Proposition n="2.8" title={<T en={<>Tools to check that something is a subspace</>}
                                          ko={<>부분 공간인지 확인하는 도구</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/> be a vector space and{" "}
                        <InlineMath math={"\\mathcal{Y} \\subset \\mathcal{X}"}/> be nonempty. The following
                        are equivalent.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>이 벡터 공간이고{" "}
                        <InlineMath math={"\\mathcal{Y} \\subset \\mathcal{X}"}/>가 공집합이 아니라 하자.
                        다음은 서로 동치다.
                    </p>}
                />
                <T
                    en={<ol>
                        <li><InlineMath math={"(\\mathcal{Y}, \\mathcal{F})"}/> is a subspace of{" "}
                            <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>.</li>
                        <li><InlineMath math={"\\forall v^1, v^2 \\in \\mathcal{Y}, \\; v^1 + v^2 \\in \\mathcal{Y}"}/> and{" "}
                            <InlineMath math={"\\forall y \\in \\mathcal{Y}, \\forall \\alpha \\in \\mathcal{F}, \\; \\alpha y \\in \\mathcal{Y}"}/>.</li>
                        <li><InlineMath math={"\\forall v^1, v^2 \\in \\mathcal{Y}, \\forall \\alpha \\in \\mathcal{F}, \\; \\alpha \\cdot v^1 + v^2 \\in \\mathcal{Y}"}/>.</li>
                        <li><InlineMath math={"\\forall v^1, v^2 \\in \\mathcal{Y}, \\forall \\alpha_1, \\alpha_2 \\in \\mathcal{F}, \\; \\alpha_1 \\cdot v^1 + \\alpha_2 \\cdot v^2 \\in \\mathcal{Y}"}/>.</li>
                    </ol>}
                    ko={<ol>
                        <li><InlineMath math={"(\\mathcal{Y}, \\mathcal{F})"}/>이{" "}
                            <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>의 부분 공간이다.</li>
                        <li><InlineMath math={"\\forall v^1, v^2 \\in \\mathcal{Y}, \\; v^1 + v^2 \\in \\mathcal{Y}"}/>이고{" "}
                            <InlineMath math={"\\forall y \\in \\mathcal{Y}, \\forall \\alpha \\in \\mathcal{F}, \\; \\alpha y \\in \\mathcal{Y}"}/>이다.</li>
                        <li><InlineMath math={"\\forall v^1, v^2 \\in \\mathcal{Y}, \\forall \\alpha \\in \\mathcal{F}, \\; \\alpha \\cdot v^1 + v^2 \\in \\mathcal{Y}"}/>이다.</li>
                        <li><InlineMath math={"\\forall v^1, v^2 \\in \\mathcal{Y}, \\forall \\alpha_1, \\alpha_2 \\in \\mathcal{F}, \\; \\alpha_1 \\cdot v^1 + \\alpha_2 \\cdot v^2 \\in \\mathcal{Y}"}/>이다.</li>
                    </ol>}
                />
                <Proof>
                    <T
                        en={<p>
                            The notes state this without proof. It is a cycle of four implications, and each
                            one is a single line.
                        </p>}
                        ko={<p>
                            원 교재는 증명 없이 진술만 둔다. implication 네 개를 고리로 잇는 것이고, 각각은
                            한 줄이면 끝난다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>(a) <InlineMath math={"\\implies"}/> (b).</strong> A vector space is
                            closed under its own addition (axiom 1) and scalar multiplication (axiom 6),
                            which is exactly (b).
                        </p>}
                        ko={<p>
                            <strong>(a) <InlineMath math={"\\implies"}/> (b).</strong> 벡터 공간은 자기
                            덧셈(axiom 1)과 스칼라 곱(axiom 6)에 대해 닫혀 있고, 그것이 바로 (b)다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>(b) <InlineMath math={"\\implies"}/> (c).</strong> Given{" "}
                            <InlineMath math={"v^1, v^2 \\in \\mathcal{Y}"}/> and{" "}
                            <InlineMath math={"\\alpha \\in \\mathcal{F}"}/>, scalar closure puts{" "}
                            <InlineMath math={"\\alpha v^1"}/> in <InlineMath math={"\\mathcal{Y}"}/>, and
                            additive closure applied to <InlineMath math={"\\alpha v^1"}/> and{" "}
                            <InlineMath math={"v^2"}/> puts the sum in <InlineMath math={"\\mathcal{Y}"}/>.
                        </p>}
                        ko={<p>
                            <strong>(b) <InlineMath math={"\\implies"}/> (c).</strong>{" "}
                            <InlineMath math={"v^1, v^2 \\in \\mathcal{Y}"}/>,{" "}
                            <InlineMath math={"\\alpha \\in \\mathcal{F}"}/>가 주어지면 스칼라 곱의 닫힘이{" "}
                            <InlineMath math={"\\alpha v^1"}/>을 <InlineMath math={"\\mathcal{Y}"}/> 안에
                            넣고, 이어서 <InlineMath math={"\\alpha v^1"}/>과{" "}
                            <InlineMath math={"v^2"}/>에 덧셈의 닫힘을 쓰면 그 합도{" "}
                            <InlineMath math={"\\mathcal{Y}"}/> 안에 들어온다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>(c) <InlineMath math={"\\implies"}/> (d).</strong> This is the step the
                            notes leave to the reader. Apply (c) first with both vectors equal to{" "}
                            <InlineMath math={"v^2"}/> and the scalar{" "}
                            <InlineMath math={"\\alpha_2 - 1"}/>:
                        </p>}
                        ko={<p>
                            <strong>(c) <InlineMath math={"\\implies"}/> (d).</strong> 원 교재가 독자에게
                            넘기는 단계가 이것이다. 먼저 두 벡터를 모두 <InlineMath math={"v^2"}/>로,
                            스칼라를 <InlineMath math={"\\alpha_2 - 1"}/>로 놓고 (c)를 쓴다.
                        </p>}
                    />
                    <BlockMath math={"(\\alpha_2 - 1) \\cdot v^2 + v^2 = \\big((\\alpha_2 - 1) + 1\\big) \\cdot v^2 = \\alpha_2 \\cdot v^2 \\in \\mathcal{Y}"}/>
                    <Terms items={[
                        ["v^2", <T en={<>any element of <InlineMath math={"\\mathcal{Y}"}/>, used in both slots of the same application of (c)</>}
                                  ko={<><InlineMath math={"\\mathcal{Y}"}/>의 임의의 원소. (c)를 한 번 쓰면서 두 자리에 같이 넣었다</>}/>],
                        ["\\alpha_2 - 1", <T en={<>the scalar handed to (c), chosen so that adding <InlineMath math={"v^2"}/> back rebuilds <InlineMath math={"\\alpha_2 v^2"}/></>}
                                            ko={<>(c)에 넘긴 스칼라. <InlineMath math={"v^2"}/>를 다시 더하면 <InlineMath math={"\\alpha_2 v^2"}/>가 되도록 고른 값이다</>}/>],
                        ["\\big((\\alpha_2 - 1) + 1\\big)", <T en={<>axiom 9 run backwards, collecting two scalar multiples of the same vector</>}
                                                              ko={<>axiom 9를 거꾸로 쓴 것. 같은 벡터의 스칼라배 둘을 하나로 모은다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Now apply (c) a second time, to <InlineMath math={"v^1"}/> with scalar{" "}
                            <InlineMath math={"\\alpha_1"}/> and to the vector{" "}
                            <InlineMath math={"\\alpha_2 v^2"}/> just produced, which gives{" "}
                            <InlineMath math={"\\alpha_1 v^1 + \\alpha_2 v^2 \\in \\mathcal{Y}"}/>, that is,
                            (d).
                        </p>}
                        ko={<p>
                            이제 (c)를 두 번째로, <InlineMath math={"v^1"}/>과 스칼라{" "}
                            <InlineMath math={"\\alpha_1"}/>, 그리고 방금 얻은{" "}
                            <InlineMath math={"\\alpha_2 v^2"}/>에 적용하면{" "}
                            <InlineMath math={"\\alpha_1 v^1 + \\alpha_2 v^2 \\in \\mathcal{Y}"}/>이고
                            이것이 (d)다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>(d) <InlineMath math={"\\implies"}/> (a).</strong> Because{" "}
                            <InlineMath math={"\\mathcal{Y}"}/> is nonempty, pick any{" "}
                            <InlineMath math={"v \\in \\mathcal{Y}"}/> and feed (d) three different pairs of
                            scalars:
                        </p>}
                        ko={<p>
                            <strong>(d) <InlineMath math={"\\implies"}/> (a).</strong>{" "}
                            <InlineMath math={"\\mathcal{Y}"}/>가 공집합이 아니므로{" "}
                            <InlineMath math={"v \\in \\mathcal{Y}"}/>를 아무거나 하나 잡고 (d)에 스칼라
                            쌍을 세 가지로 넣어 본다.
                        </p>}
                    />
                    <BlockMath math={"\\underbrace{0 \\cdot v + 0 \\cdot v = 0}_{\\text{axiom 4}}, \\qquad \\underbrace{(-1) \\cdot v + 0 \\cdot v = \\bar v}_{\\text{axiom 5}}, \\qquad \\underbrace{1 \\cdot v^1 + 1 \\cdot v^2 = v^1 + v^2}_{\\text{axiom 1}}"}/>
                    <Terms items={[
                        ["v", <T en={<>any element of <InlineMath math={"\\mathcal{Y}"}/>, which exists because <InlineMath math={"\\mathcal{Y}"}/> is nonempty</>}
                                ko={<><InlineMath math={"\\mathcal{Y}"}/>의 원소 아무거나. 공집합이 아니므로 존재한다</>}/>],
                        ["0", <T en={<>the zero vector of <InlineMath math={"\\mathcal{X}"}/>, now shown to lie in <InlineMath math={"\\mathcal{Y}"}/></>}
                                ko={<><InlineMath math={"\\mathcal{X}"}/>의 영벡터. 이제 <InlineMath math={"\\mathcal{Y}"}/> 안에 있음이 밝혀졌다</>}/>],
                        ["\\bar v", <T en={<>the additive inverse of <InlineMath math={"v"}/>, equal to <InlineMath math={"(-1) \\cdot v"}/></>}
                                      ko={<><InlineMath math={"v"}/>의 덧셈 역원. <InlineMath math={"(-1) \\cdot v"}/>와 같다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Axiom 6 is (d) with <InlineMath math={"\\alpha_2 = 0"}/>. The remaining axioms,
                            2, 3, 7, 8, 9 and 10, are identities that hold for <em>all</em> vectors of{" "}
                            <InlineMath math={"\\mathcal{X}"}/>, so they hold in particular for those in{" "}
                            <InlineMath math={"\\mathcal{Y}"}/>. Hence{" "}
                            <InlineMath math={"(\\mathcal{Y}, \\mathcal{F})"}/> is a vector space.
                        </p>}
                        ko={<p>
                            axiom 6은 (d)에 <InlineMath math={"\\alpha_2 = 0"}/>을 넣은 것이다. 남은 axiom
                            2, 3, 7, 8, 9, 10은 <InlineMath math={"\\mathcal{X}"}/>의 <em>모든</em> 벡터에서
                            성립하는 항등식이므로 <InlineMath math={"\\mathcal{Y}"}/>의 벡터에서도 당연히
                            성립한다. 따라서 <InlineMath math={"(\\mathcal{Y}, \\mathcal{F})"}/>은 벡터
                            공간이다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Remark title={<T en={<>Why nonempty is not a technicality</>} ko={<>공집합이 아니라는 조건은 형식이 아니다</>}/>}>
                <T
                    en={<p>
                        The condition <InlineMath math={"\\mathcal{Y} \\neq \\emptyset"}/> is what lets us
                        produce <InlineMath math={"0"}/> at all. Drop it and (b), (c), (d) are vacuously true
                        for the empty set, which is not a vector space, since axiom 4 demands a zero vector.
                        In practice you satisfy the condition by exhibiting{" "}
                        <InlineMath math={"0 \\in \\mathcal{Y}"}/>, which is Remark 2.7 again.
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{Y} \\neq \\emptyset"}/>이라는 조건이 있어야 애초에{" "}
                        <InlineMath math={"0"}/>을 만들어 낼 수 있다. 이 조건을 빼면 공집합에 대해 (b), (c),
                        (d)가 공허하게 참이 되는데, 공집합은 axiom 4가 영벡터를 요구하므로 벡터 공간이 아니다.
                        실전에서는 <InlineMath math={"0 \\in \\mathcal{Y}"}/>를 보이는 것으로 이 조건을
                        채우고, 그것이 결국 Remark 2.7이다.
                    </p>}
                />
            </Remark>
            <CanvasFigure
                label={t("Slide the line off the origin: the sum of two of its points leaves it immediately",
                    "직선을 원점에서 밀어 보자. 그 위 두 점의 합이 곧바로 집합을 벗어난다")}
                bodyClassName="w-[min(92vw,900px)]"
                modal={<SubspaceExplorer height={420}/>}>
                <SubspaceExplorer/>
            </CanvasFigure>
            <Example n="2.9" title={<T en={<>A line through the origin is a subspace</>}
                                       ko={<>원점을 지나는 직선은 부분 공간이다</>}/>}>
                <T
                    en={<p>
                        Take <InlineMath math={"(\\mathcal{X}, \\mathcal{F}) = (\\mathbb{R}^2, \\mathbb{R})"}/> and
                        the candidate set
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F}) = (\\mathbb{R}^2, \\mathbb{R})"}/>과
                        후보 집합을 다음과 같이 잡는다.
                    </p>}
                />
                <BlockMath math={"\\mathcal{Y} := \\left\\{ \\begin{bmatrix} \\beta \\\\ 2\\beta \\end{bmatrix} \\;\\middle|\\; \\beta \\in \\mathbb{R} \\right\\} \\subset \\mathcal{X}"}/>
                <Terms items={[
                    ["\\beta", <T en={<>the free parameter that sweeps out the set, one point per real number</>}
                                 ko={<>집합을 훑는 자유 매개변수. 실수 하나마다 점 하나가 대응한다</>}/>],
                    ["\\mathcal{Y}", <T en={<>the line of slope 2 through the origin, written as a set of columns</>}
                                       ko={<>원점을 지나는 기울기 2인 직선. 열벡터의 집합으로 적었다</>}/>],
                ]}/>
                <Proof>
                    <T en={<p>Use Proposition 2.8 (b). For two elements of{" "}
                        <InlineMath math={"\\mathcal{Y}"}/>, with parameters{" "}
                        <InlineMath math={"\\beta_1"}/> and <InlineMath math={"\\beta_2"}/>,</p>}
                       ko={<p>Proposition 2.8 (b)를 쓴다. 매개변수가 <InlineMath math={"\\beta_1"}/>,{" "}
                           <InlineMath math={"\\beta_2"}/>인 <InlineMath math={"\\mathcal{Y}"}/>의 두 원소에
                           대해</p>}/>
                    <BlockMath math={"\\begin{bmatrix} \\beta_1 \\\\ 2\\beta_1 \\end{bmatrix} + \\begin{bmatrix} \\beta_2 \\\\ 2\\beta_2 \\end{bmatrix} = \\begin{bmatrix} \\beta_1 + \\beta_2 \\\\ 2\\beta_1 + 2\\beta_2 \\end{bmatrix} = \\begin{bmatrix} \\beta_1 + \\beta_2 \\\\ 2(\\beta_1 + \\beta_2) \\end{bmatrix} \\in \\mathcal{Y}"}/>
                    <Terms items={[
                        ["\\beta_1, \\beta_2", <T en={<>the parameters of the two chosen elements</>}
                                                ko={<>고른 두 원소의 매개변수</>}/>],
                        ["\\beta_1 + \\beta_2", <T en={<>a real number, so the sum has the required form: it is the point of parameter <InlineMath math={"\\beta_1 + \\beta_2"}/></>}
                                                 ko={<>실수이므로 합이 요구되는 꼴을 갖춘다. 매개변수가 <InlineMath math={"\\beta_1 + \\beta_2"}/>인 점이다</>}/>],
                    ]}/>
                    <T en={<p>and for a scalar{" "}
                        <InlineMath math={"\\alpha \\in \\mathbb{R}"}/>,</p>}
                       ko={<p>스칼라 <InlineMath math={"\\alpha \\in \\mathbb{R}"}/>에 대해서는</p>}/>
                    <BlockMath math={"\\alpha \\begin{bmatrix} \\beta \\\\ 2\\beta \\end{bmatrix} = \\begin{bmatrix} \\alpha\\beta \\\\ \\alpha \\cdot 2\\beta \\end{bmatrix} = \\begin{bmatrix} \\alpha\\beta \\\\ 2(\\alpha\\beta) \\end{bmatrix} \\in \\mathcal{Y}"}/>
                    <Terms items={[
                        ["\\alpha", <T en={<>an arbitrary real scalar</>} ko={<>임의의 실수 스칼라</>}/>],
                        ["\\alpha\\beta", <T en={<>again a real number, so the product is the point of parameter <InlineMath math={"\\alpha\\beta"}/></>}
                                            ko={<>역시 실수이므로 곱은 매개변수가 <InlineMath math={"\\alpha\\beta"}/>인 점이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Both closures hold, so <InlineMath math={"\\mathcal{Y}"}/> is a subspace. Setting{" "}
                            <InlineMath math={"\\alpha = 0"}/> in the second line also confirms{" "}
                            <InlineMath math={"0 \\in \\mathcal{Y}"}/>. Numerically this is the check run
                            just above: <InlineMath math={"(1,2)^\\top + (3,6)^\\top = (4,8)^\\top"}/>.
                        </p>}
                        ko={<p>
                            두 닫힘이 모두 성립하므로 <InlineMath math={"\\mathcal{Y}"}/>는 부분 공간이다.
                            둘째 줄에 <InlineMath math={"\\alpha = 0"}/>을 넣으면{" "}
                            <InlineMath math={"0 \\in \\mathcal{Y}"}/>도 확인된다. 숫자로 하면 바로 위에서
                            해 본 계산, 곧{" "}
                            <InlineMath math={"(1,2)^\\top + (3,6)^\\top = (4,8)^\\top"}/>이 그것이다.
                        </p>}
                    />
                </Proof>
            </Example>
            <Example n="2.10" title={<T en={<>Shift the line and it stops being a subspace</>}
                                        ko={<>직선을 밀면 부분 공간이 아니게 된다</>}/>}>
                <BlockMath math={"\\mathcal{Y} := \\left\\{ \\begin{bmatrix} \\beta \\\\ 2\\beta \\end{bmatrix} + \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} \\;\\middle|\\; \\beta \\in \\mathbb{R} \\right\\} \\quad \\Longrightarrow \\quad 0 \\notin \\mathcal{Y}"}/>
                <Terms items={[
                    ["\\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}", <T en={<>the offset that moves the whole line one unit to the right</>}
                                                                   ko={<>직선 전체를 오른쪽으로 한 칸 옮기는 이동량</>}/>],
                    ["0 \\notin \\mathcal{Y}", <T en={<>the first entry is <InlineMath math={"\\beta + 1"}/> and the second is <InlineMath math={"2\\beta"}/>, and no <InlineMath math={"\\beta"}/> makes both zero</>}
                                                 ko={<>첫 성분이 <InlineMath math={"\\beta + 1"}/>, 둘째가 <InlineMath math={"2\\beta"}/>이고 둘을 동시에 0으로 만드는 <InlineMath math={"\\beta"}/>가 없다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Concretely, <InlineMath math={"\\beta = 0"}/> and{" "}
                        <InlineMath math={"\\beta = 1"}/> give the points{" "}
                        <InlineMath math={"(1,0)^\\top"}/> and <InlineMath math={"(2,2)^\\top"}/>, whose sum{" "}
                        <InlineMath math={"(3,2)^\\top"}/> would need{" "}
                        <InlineMath math={"\\beta = 2"}/> from the first entry and{" "}
                        <InlineMath math={"\\beta = 1"}/> from the second. It is not in{" "}
                        <InlineMath math={"\\mathcal{Y}"}/>. The same argument kills{" "}
                        <InlineMath math={"\\{f : \\mathbb{R} \\to \\mathbb{R} \\mid f(2) = 1.0\\}"}/>,
                        because the zero vector of that space is the function that is zero at every{" "}
                        <InlineMath math={"t"}/>, and it does not satisfy{" "}
                        <InlineMath math={"f(2) = 1.0"}/>. Contrast this with{" "}
                        <InlineMath math={"\\{f \\mid f(2) = 0\\}"}/>, which is a subspace.
                    </p>}
                    ko={<p>
                        구체적으로 <InlineMath math={"\\beta = 0"}/>과 <InlineMath math={"\\beta = 1"}/>은
                        점 <InlineMath math={"(1,0)^\\top"}/>과 <InlineMath math={"(2,2)^\\top"}/>을 주는데,
                        그 합 <InlineMath math={"(3,2)^\\top"}/>은 첫 성분에서{" "}
                        <InlineMath math={"\\beta = 2"}/>를, 둘째 성분에서{" "}
                        <InlineMath math={"\\beta = 1"}/>을 요구한다.{" "}
                        <InlineMath math={"\\mathcal{Y}"}/> 안에 없다는 뜻이다. 같은 논증이{" "}
                        <InlineMath math={"\\{f : \\mathbb{R} \\to \\mathbb{R} \\mid f(2) = 1.0\\}"}/>도
                        잡는다. 그 공간의 영벡터는 모든 <InlineMath math={"t"}/>에서 0인 함수인데 그것은{" "}
                        <InlineMath math={"f(2) = 1.0"}/>을 만족하지 않는다. 반면{" "}
                        <InlineMath math={"\\{f \\mid f(2) = 0\\}"}/>은 부분 공간이다.
                    </p>}
                />
            </Example>
            <Example title={<T en={<>Each clause of Proposition 2.8 (b) can fail on its own</>}
                              ko={<>Proposition 2.8 (b)의 두 조건은 따로따로 깨질 수 있다</>}/>}>
                <T
                    en={<p>
                        Both sets below contain the origin, so Remark 2.7 does not catch them. Each fails
                        exactly one of the two closures, which is why the proposition lists both.
                    </p>}
                    ko={<p>
                        아래 두 집합은 원점을 품고 있어서 Remark 2.7에 걸리지 않는다. 각각 두 닫힘 중 정확히
                        하나씩만 깨지며, 명제가 둘을 함께 적어 둔 이유가 그것이다.
                    </p>}
                />
                <BlockMath math={"\\mathcal{Y}_1 := \\left\\{ \\begin{bmatrix} x_1 \\\\ 0 \\end{bmatrix} \\right\\} \\cup \\left\\{ \\begin{bmatrix} 0 \\\\ x_2 \\end{bmatrix} \\right\\}, \\qquad \\mathcal{Y}_2 := \\left\\{ \\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix} \\;\\middle|\\; x_1 \\ge 0, \\; x_2 \\ge 0 \\right\\}"}/>
                <Terms items={[
                    ["\\mathcal{Y}_1", <T en={<>the union of the two coordinate axes of <InlineMath math={"\\mathbb{R}^2"}/></>}
                                         ko={<><InlineMath math={"\\mathbb{R}^2"}/>의 두 좌표축을 합친 집합</>}/>],
                    ["\\mathcal{Y}_2", <T en={<>the first quadrant, including its two edges</>}
                                         ko={<>제1사분면. 두 변을 포함한다</>}/>],
                    ["\\cup", <T en={<>set union: a point is in <InlineMath math={"\\mathcal{Y}_1"}/> if it lies on either axis</>}
                                 ko={<>합집합. 두 축 중 어느 한쪽에 놓이면 <InlineMath math={"\\mathcal{Y}_1"}/>의 원소다</>}/>],
                ]}/>
                <T
                    en={<p>
                        <InlineMath math={"\\mathcal{Y}_1"}/> is closed under scalar multiplication, since{" "}
                        <InlineMath math={"\\alpha (x_1, 0)^\\top = (\\alpha x_1, 0)^\\top"}/> is still on an
                        axis, but <InlineMath math={"(1,0)^\\top + (0,1)^\\top = (1,1)^\\top"}/> is on
                        neither. <InlineMath math={"\\mathcal{Y}_2"}/> is closed under addition, since two
                        nonnegative entries add to a nonnegative entry, but{" "}
                        <InlineMath math={"(-1) \\cdot (1,1)^\\top = (-1,-1)^\\top"}/> leaves it. Neither is
                        a subspace.
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{Y}_1"}/>은 스칼라 곱에 대해 닫혀 있다.{" "}
                        <InlineMath math={"\\alpha (x_1, 0)^\\top = (\\alpha x_1, 0)^\\top"}/>이 여전히 축
                        위에 있기 때문이다. 그러나{" "}
                        <InlineMath math={"(1,0)^\\top + (0,1)^\\top = (1,1)^\\top"}/>은 어느 축에도 없다.{" "}
                        <InlineMath math={"\\mathcal{Y}_2"}/>는 덧셈에 대해 닫혀 있다. 음이 아닌 값 둘을
                        더하면 다시 음이 아니기 때문이다. 그러나{" "}
                        <InlineMath math={"(-1) \\cdot (1,1)^\\top = (-1,-1)^\\top"}/>은 집합을 벗어난다.
                        둘 다 부분 공간이 아니다.
                    </p>}
                />
            </Example>
            <Remark title={<T en={<>The same test in a function space</>} ko={<>함수 공간에서의 같은 검사</>}/>}>
                <T
                    en={<p>
                        With <InlineMath math={"\\mathcal{X} = \\{f : \\mathbb{R} \\to \\mathbb{R}\\}"}/> over{" "}
                        <InlineMath math={"\\mathbb{R}"}/>, the polynomials{" "}
                        <InlineMath math={"\\mathcal{P}(t)"}/> form a subspace: a sum of two polynomials with
                        real coefficients is such a polynomial, for instance{" "}
                        <InlineMath math={"(1 + t) + (2t^2 - t) = 1 + 2t^2"}/>, and so is a real multiple of
                        one. The same check works for{" "}
                        <InlineMath math={"\\{f \\mid f \\text{ differentiable}, \\; \\tfrac{d}{dt}f \\equiv 0\\}"}/>,
                        the constant functions.
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathbb{R}"}/> 위의{" "}
                        <InlineMath math={"\\mathcal{X} = \\{f : \\mathbb{R} \\to \\mathbb{R}\\}"}/>에서 다항식
                        집합 <InlineMath math={"\\mathcal{P}(t)"}/>는 부분 공간이다. 실계수 다항식 둘의 합은{" "}
                        <InlineMath math={"(1 + t) + (2t^2 - t) = 1 + 2t^2"}/>처럼 다시 실계수 다항식이고,
                        그것의 실수배도 마찬가지다.{" "}
                        <InlineMath math={"\\{f \\mid f \\text{ differentiable}, \\; \\tfrac{d}{dt}f \\equiv 0\\}"}/>,
                        곧 상수 함수들에 대해서도 같은 확인이 통한다.
                    </p>}
                />
            </Remark>
            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Linear Combinations and Linear Independence</h2>}
               ko={<h2>선형 결합과 선형 독립</h2>}/>
            <T
                en={<p>
                    Independence is the property that lets a set of vectors serve as an address system. If
                    one vector in the set can be built from the others, it carries no new information and
                    addresses stop being unique. Everything about bases, dimension, rank, and observability
                    is downstream of this one definition.
                </p>}
                ko={<p>
                    선형 독립은 벡터들의 집합이 주소 체계 노릇을 하게 해 주는 성질이다. 집합 안의 한 벡터를
                    나머지로 만들어 낼 수 있다면 그 벡터는 새로운 정보를 담고 있지 않고, 주소도 유일하지
                    않게 된다. 기저, 차원, rank, 관측 가능성에 대한 이야기가 전부 이 정의 하나에서 흘러나온다.
                </p>}
            />
            <Definition n="2.11" title={<T en={<>Linear combination</>} ko={<>선형 결합</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/> be a vector space. A{" "}
                        <strong>linear combination</strong> is a <em>finite</em> sum
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>이 벡터 공간이라 하자.{" "}
                        <strong>선형 결합</strong>은 <em>유한</em> 합
                    </p>}
                />
                <BlockMath math={"\\alpha_1 v^1 + \\alpha_2 v^2 + \\cdots + \\alpha_n v^n, \\qquad n \\ge 1, \\; \\alpha_i \\in \\mathcal{F}, \\; v^i \\in \\mathcal{X}"}/>
                <Terms items={[
                    ["n", <T en={<>the number of terms, a finite natural number fixed before the sum is written</>}
                            ko={<>항의 개수. 합을 적기 전에 정해지는 유한한 자연수</>}/>],
                    ["\\alpha_i", <T en={<>scalars in <InlineMath math={"\\mathcal{F}"}/></>}
                                    ko={<><InlineMath math={"\\mathcal{F}"}/>의 스칼라</>}/>],
                    ["v^i", <T en={<>vectors in <InlineMath math={"\\mathcal{X}"}/>, indexed by superscripts that are labels, not powers</>}
                              ko={<><InlineMath math={"\\mathcal{X}"}/>의 벡터. 위첨자는 지수가 아니라 이름표다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Two instances, one in <InlineMath math={"\\mathbb{R}^2"}/> and one in the polynomials
                        of degree at most two:
                    </p>}
                    ko={<p>
                        예를 둘 들면, 하나는 <InlineMath math={"\\mathbb{R}^2"}/>에서, 다른 하나는 차수가
                        2 이하인 다항식에서다.
                    </p>}
                />
                <BlockMath math={"2\\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} + 3\\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} 2 \\\\ 3 \\end{bmatrix}, \\qquad 3 \\cdot 1 + 0 \\cdot t + (-2) \\cdot t^2 = 3 - 2t^2"}/>
                <Terms items={[
                    ["2, 3, -2", <T en={<>the scalars <InlineMath math={"\\alpha_i"}/>, real numbers here</>}
                                   ko={<>스칼라 <InlineMath math={"\\alpha_i"}/>. 여기서는 실수다</>}/>],
                    ["1, t, t^2", <T en={<>the vectors in the second example: each monomial is one vector</>}
                                    ko={<>둘째 예의 벡터. 단항식 하나가 벡터 하나다</>}/>],
                    ["3 - 2t^2", <T en={<>the resulting vector, again a polynomial of degree at most two</>}
                                   ko={<>결과로 나오는 벡터. 다시 차수 2 이하의 다항식이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        To be extra clear,{" "}
                        <InlineMath math={"\\sum_{i=1}^{\\infty} \\alpha_i v^i"}/> is <strong>not</strong> a
                        linear combination, because it is not finite. That restriction looks pedantic until
                        Example 2.22.
                    </p>}
                    ko={<p>
                        분명히 해 두면 <InlineMath math={"\\sum_{i=1}^{\\infty} \\alpha_i v^i"}/>는 선형
                        결합이 <strong>아니다</strong>. 유한하지 않기 때문이다. 이 제한은 Example 2.22를 보기
                        전까지는 깐깐한 트집처럼 보인다.
                    </p>}
                />
            </Definition>
            <Definition n="2.12" title={<T en={<>Linear dependence and independence</>} ko={<>선형 종속과 선형 독립</>}/>}>
                <T
                    en={<p>
                        A finite set <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/> is{" "}
                        <strong>linearly dependent</strong> if
                    </p>}
                    ko={<p>
                        유한 집합 <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/>이 다음을 만족하면{" "}
                        <strong>선형 종속</strong>이라 한다.
                    </p>}
                />
                <BlockMath math={"\\exists\\, \\alpha_1, \\ldots, \\alpha_k \\in \\mathcal{F} \\ \\text{not all zero} \\ \\text{ s.t. } \\ \\alpha_1 v^1 + \\cdots + \\alpha_k v^k = 0"}/>
                <Terms items={[
                    ["\\exists", <T en={<>"there exist": one witness is enough to make the set dependent</>}
                                   ko={<>"존재한다". 증거 하나만 있으면 그 집합은 종속이다</>}/>],
                    ["\\text{not all zero}", <T en={<>the entire content of the definition: <InlineMath math={"\\alpha_i = 0"}/> always works and proves nothing</>}
                                                ko={<>정의의 핵심 전부. <InlineMath math={"\\alpha_i = 0"}/>은 언제나 되므로 아무것도 증명하지 못한다</>}/>],
                    ["0", <T en={<>the zero vector of <InlineMath math={"\\mathcal{X}"}/>, not the scalar zero</>}
                            ko={<><InlineMath math={"\\mathcal{X}"}/>의 영벡터. 스칼라 0이 아니다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Otherwise the set is <strong>linearly independent</strong>: the only combination that
                        produces the zero vector is the trivial one. On two concrete pairs in{" "}
                        <InlineMath math={"\\mathbb{R}^2"}/>:
                    </p>}
                    ko={<p>
                        그렇지 않으면 <strong>선형 독립</strong>이다. 영벡터를 만드는 조합이 자명한 것뿐이라는
                        뜻이다. <InlineMath math={"\\mathbb{R}^2"}/>의 구체적인 두 쌍으로 보면
                    </p>}
                />
                <BlockMath math={"2\\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix} - 1\\begin{bmatrix} 2 \\\\ 4 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix}, \\qquad \\alpha_1 \\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix} + \\alpha_2 \\begin{bmatrix} 3 \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix} \\implies \\alpha_1 = \\alpha_2 = 0"}/>
                <Terms items={[
                    ["2, -1", <T en={<>coefficients not all zero, so <InlineMath math={"\\{(1,2)^\\top, (2,4)^\\top\\}"}/> is dependent</>}
                                ko={<>전부 0은 아닌 계수. 따라서 <InlineMath math={"\\{(1,2)^\\top, (2,4)^\\top\\}"}/>은 종속이다</>}/>],
                    ["(3,1)^\\top", <T en={<>a direction not parallel to <InlineMath math={"(1,2)^\\top"}/>: the two equations <InlineMath math={"\\alpha_1 + 3\\alpha_2 = 0"}/> and <InlineMath math={"2\\alpha_1 + \\alpha_2 = 0"}/> force both scalars to vanish</>}
                                      ko={<><InlineMath math={"(1,2)^\\top"}/>과 평행하지 않은 방향. 방정식 <InlineMath math={"\\alpha_1 + 3\\alpha_2 = 0"}/>과 <InlineMath math={"2\\alpha_1 + \\alpha_2 = 0"}/>이 두 스칼라를 모두 0으로 만든다</>}/>],
                ]}/>
            </Definition>
            <Remark n="2.13" title={<T en={<>What dependence buys you</>} ko={<>종속이면 무엇을 얻는가</>}/>}>
                <T
                    en={<p>
                        Suppose <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/> is dependent, with witnesses{" "}
                        <InlineMath math={"\\alpha_1, \\ldots, \\alpha_k"}/> not all zero. Relabel so that{" "}
                        <InlineMath math={"\\alpha_k \\neq 0"}/>. Then move every other term across and
                        divide:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/>이 종속이고 증거 계수{" "}
                        <InlineMath math={"\\alpha_1, \\ldots, \\alpha_k"}/>가 전부 0은 아니라 하자. 번호를
                        다시 붙여 <InlineMath math={"\\alpha_k \\neq 0"}/>이라 두고, 나머지 항을 넘긴 뒤
                        나누면
                    </p>}
                />
                <BlockMath math={"\\alpha_k v^k = -\\alpha_1 v^1 - \\cdots - \\alpha_{k-1} v^{k-1} \\quad \\Longrightarrow \\quad v^k = -\\frac{\\alpha_1}{\\alpha_k} v^1 - \\cdots - \\frac{\\alpha_{k-1}}{\\alpha_k} v^{k-1}"}/>
                <Terms items={[
                    ["\\alpha_k \\neq 0", <T en={<>the coefficient we may divide by, which is why the relabeling was needed</>}
                                            ko={<>나눗셈이 가능한 계수. 번호를 다시 붙인 이유가 이것이다</>}/>],
                    ["v^k", <T en={<>the vector now exhibited as a linear combination of the others</>}
                              ko={<>이제 나머지의 선형 결합으로 드러난 벡터</>}/>],
                    ["-\\alpha_i / \\alpha_k", <T en={<>scalars in <InlineMath math={"\\mathcal{F}"}/>, available because a field has multiplicative inverses. Every term is divided by <InlineMath math={"\\alpha_k"}/>; the notes print <InlineMath math={"\\alpha_1"}/> in the denominator of the last term, which is a typo</>}
                                                 ko={<><InlineMath math={"\\mathcal{F}"}/>의 스칼라. 체에 곱셈 역원이 있어서 쓸 수 있다. 모든 항을 <InlineMath math={"\\alpha_k"}/>로 나누는데, 원 교재는 마지막 항의 분모를 <InlineMath math={"\\alpha_1"}/>로 인쇄했다. 오타다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Numerically, from{" "}
                        <InlineMath math={"2 (1,2)^\\top - 1 (2,4)^\\top = 0"}/> with{" "}
                        <InlineMath math={"\\alpha_2 = -1 \\neq 0"}/> we get{" "}
                        <InlineMath math={"(2,4)^\\top = 2 (1,2)^\\top"}/>. So "dependent" and "one of them
                        is redundant" say the same thing. Note where the field axioms were used: without
                        multiplicative inverses this step is not available.
                    </p>}
                    ko={<p>
                        숫자로 하면 <InlineMath math={"2 (1,2)^\\top - 1 (2,4)^\\top = 0"}/>에서{" "}
                        <InlineMath math={"\\alpha_2 = -1 \\neq 0"}/>이므로{" "}
                        <InlineMath math={"(2,4)^\\top = 2 (1,2)^\\top"}/>이 나온다. 결국 "종속이다"와 "그중
                        하나는 군더더기다"는 같은 말이다. 체의 axiom이 어디서 쓰였는지 보아 두자. 곱셈 역원이
                        없으면 이 단계를 밟을 수 없다.
                    </p>}
                />
            </Remark>
            <Proposition n="2.14" title={<T en={<>Three readings of independence</>} ko={<>선형 독립의 세 가지 읽기</>}/>}>
                <T
                    en={<p>
                        For a finite set{" "}
                        <InlineMath math={"\\mathcal{S} := \\{v^1, \\ldots, v^k\\}"}/>, the following are
                        equivalent.
                    </p>}
                    ko={<p>
                        유한 집합 <InlineMath math={"\\mathcal{S} := \\{v^1, \\ldots, v^k\\}"}/>에 대해 다음은
                        서로 동치다.
                    </p>}
                />
                <T
                    en={<ol>
                        <li><InlineMath math={"\\mathcal{S}"}/> is linearly independent.</li>
                        <li><InlineMath math={"\\{v^1, \\ldots, v^{k-1}\\}"}/> is linearly independent and{" "}
                            <InlineMath math={"v^k"}/> cannot be written as a linear combination of it.</li>
                        <li>Every finite subset of <InlineMath math={"\\mathcal{S}"}/> is linearly
                            independent.</li>
                    </ol>}
                    ko={<ol>
                        <li><InlineMath math={"\\mathcal{S}"}/>가 선형 독립이다.</li>
                        <li><InlineMath math={"\\{v^1, \\ldots, v^{k-1}\\}"}/>이 선형 독립이고{" "}
                            <InlineMath math={"v^k"}/>를 그것의 선형 결합으로 쓸 수 없다.</li>
                        <li><InlineMath math={"\\mathcal{S}"}/>의 모든 유한 부분집합이 선형 독립이다.</li>
                    </ol>}
                />
                <Proof>
                    <T
                        en={<p>
                            The notes say only "using this observation, you can prove the following", so here
                            is the argument. Write <InlineMath math={"\\mathcal{S}'"}/> for{" "}
                            <InlineMath math={"\\{v^1, \\ldots, v^{k-1}\\}"}/>.
                        </p>}
                        ko={<p>
                            원 교재는 "이 관찰을 쓰면 다음을 증명할 수 있다"고만 적어 두었으니 논증을 여기
                            적는다. <InlineMath math={"\\{v^1, \\ldots, v^{k-1}\\}"}/>을{" "}
                            <InlineMath math={"\\mathcal{S}'"}/>이라 쓰자.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>(a) <InlineMath math={"\\implies"}/> (b), by contraposition.</strong> If{" "}
                            <InlineMath math={"\\mathcal{S}'"}/> is dependent, the same nontrivial
                            combination works for <InlineMath math={"\\mathcal{S}"}/> with{" "}
                            <InlineMath math={"\\alpha_k = 0"}/> appended, so{" "}
                            <InlineMath math={"\\mathcal{S}"}/> is dependent. If instead{" "}
                            <InlineMath math={"v^k = \\alpha_1 v^1 + \\cdots + \\alpha_{k-1} v^{k-1}"}/>,
                            move it across:
                        </p>}
                        ko={<p>
                            <strong>(a) <InlineMath math={"\\implies"}/> (b), 대우로.</strong>{" "}
                            <InlineMath math={"\\mathcal{S}'"}/>이 종속이면 같은 자명하지 않은 조합에{" "}
                            <InlineMath math={"\\alpha_k = 0"}/>을 붙여 그대로{" "}
                            <InlineMath math={"\\mathcal{S}"}/>에 쓸 수 있으므로{" "}
                            <InlineMath math={"\\mathcal{S}"}/>도 종속이다. 한편{" "}
                            <InlineMath math={"v^k = \\alpha_1 v^1 + \\cdots + \\alpha_{k-1} v^{k-1}"}/>이라면
                            항을 넘긴다.
                        </p>}
                    />
                    <BlockMath math={"\\alpha_1 v^1 + \\cdots + \\alpha_{k-1} v^{k-1} + (-1) v^k = 0"}/>
                    <Terms items={[
                        ["-1", <T en={<>a coefficient that is certainly not zero, so the combination is nontrivial no matter what the other <InlineMath math={"\\alpha_i"}/> are</>}
                                 ko={<>확실히 0이 아닌 계수. 다른 <InlineMath math={"\\alpha_i"}/>가 무엇이든 이 조합은 자명하지 않다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Either way <InlineMath math={"\\mathcal{S}"}/> is dependent, which is the
                            contrapositive of (a) <InlineMath math={"\\implies"}/> (b).
                        </p>}
                        ko={<p>
                            어느 쪽이든 <InlineMath math={"\\mathcal{S}"}/>는 종속이고, 이것이 (a){" "}
                            <InlineMath math={"\\implies"}/> (b)의 대우다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>(b) <InlineMath math={"\\implies"}/> (a).</strong> Suppose{" "}
                            <InlineMath math={"\\alpha_1 v^1 + \\cdots + \\alpha_k v^k = 0"}/>. If{" "}
                            <InlineMath math={"\\alpha_k \\neq 0"}/>, Remark 2.13 writes{" "}
                            <InlineMath math={"v^k"}/> as a combination of{" "}
                            <InlineMath math={"\\mathcal{S}'"}/>, contradicting (b). So{" "}
                            <InlineMath math={"\\alpha_k = 0"}/>, the relation collapses to one over{" "}
                            <InlineMath math={"\\mathcal{S}'"}/>, and independence of{" "}
                            <InlineMath math={"\\mathcal{S}'"}/> forces the rest to vanish.
                        </p>}
                        ko={<p>
                            <strong>(b) <InlineMath math={"\\implies"}/> (a).</strong>{" "}
                            <InlineMath math={"\\alpha_1 v^1 + \\cdots + \\alpha_k v^k = 0"}/>이라 하자.{" "}
                            <InlineMath math={"\\alpha_k \\neq 0"}/>이면 Remark 2.13이{" "}
                            <InlineMath math={"v^k"}/>를 <InlineMath math={"\\mathcal{S}'"}/>의 결합으로
                            적어 주므로 (b)와 모순이다. 따라서{" "}
                            <InlineMath math={"\\alpha_k = 0"}/>이고 관계식은{" "}
                            <InlineMath math={"\\mathcal{S}'"}/>에 대한 것으로 줄어들며,{" "}
                            <InlineMath math={"\\mathcal{S}'"}/>의 선형 독립이 남은 계수를 모두 0으로 만든다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>(a) <InlineMath math={"\\iff"}/> (c).</strong> A subset of an independent
                            set is independent, since a nontrivial relation on the subset becomes one on the
                            whole set by padding with zeros. Conversely (c) contains the case of the subset{" "}
                            <InlineMath math={"\\mathcal{S}"}/> itself.
                        </p>}
                        ko={<p>
                            <strong>(a) <InlineMath math={"\\iff"}/> (c).</strong> 독립인 집합의 부분집합은
                            독립이다. 부분집합에서의 자명하지 않은 관계식에 0을 채워 넣으면 전체 집합의
                            관계식이 되기 때문이다. 역으로 (c)에는 부분집합으로{" "}
                            <InlineMath math={"\\mathcal{S}"}/> 자기 자신을 잡는 경우가 들어 있다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Definition n="2.15" title={<T en={<>Independence of an infinite set</>} ko={<>무한 집합의 선형 독립</>}/>}>
                <T
                    en={<p>
                        An arbitrary set{" "}
                        <InlineMath math={"\\mathcal{S} \\subset \\mathcal{X}"}/> is{" "}
                        <strong>linearly independent</strong> if every finite subset of it is linearly
                        independent. This is the only sensible extension, since Definition 2.11 admits no
                        infinite sums. For instance{" "}
                        <InlineMath math={"\\{1, t, t^2, \\ldots\\}"}/> qualifies once every finite piece{" "}
                        <InlineMath math={"\\{1, t, \\ldots, t^n\\}"}/> does, which is Example 2.16.
                    </p>}
                    ko={<p>
                        임의의 집합 <InlineMath math={"\\mathcal{S} \\subset \\mathcal{X}"}/>는 그것의 모든
                        유한 부분집합이 선형 독립일 때 <strong>선형 독립</strong>이라 한다. Definition 2.11이
                        무한 합을 허용하지 않으므로 이것이 유일하게 말이 되는 확장이다. 예를 들어{" "}
                        <InlineMath math={"\\{1, t, t^2, \\ldots\\}"}/>은 유한 조각{" "}
                        <InlineMath math={"\\{1, t, \\ldots, t^n\\}"}/>이 전부 독립이면 자격을 얻고, 그것이
                        Example 2.16이다.
                    </p>}
                />
            </Definition>
            <CanvasFigure
                label={t("Drag until the parallelogram flattens: the determinant hits zero, the rank drops, and the span collapses to a line",
                    "평행사변형이 납작해질 때까지 끌어 보자. 행렬식이 0이 되고 rank가 떨어지며 span이 직선으로 무너진다")}
                bodyClassName="w-[min(92vw,900px)]"
                modal={<IndependenceExplorer height={420}/>}>
                <IndependenceExplorer/>
            </CanvasFigure>
            <Example n="2.16" title={<T en={<>The monomials are linearly independent</>}
                                        ko={<>단항식들은 선형 독립이다</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/> and{" "}
                        <InlineMath math={"\\mathcal{X} = \\mathcal{P}(t)"}/>, the polynomials with real
                        coefficients. Start with the smallest case that shows the mechanism,{" "}
                        <InlineMath math={"n = 2"}/>. Suppose{" "}
                        <InlineMath math={"\\alpha_0 + \\alpha_1 t + \\alpha_2 t^2"}/> is the zero polynomial.
                        Evaluating it and its derivatives at <InlineMath math={"t = 0"}/> peels the
                        coefficients off one at a time:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/>, 그리고{" "}
                        <InlineMath math={"\\mathcal{X} = \\mathcal{P}(t)"}/>를 실계수 다항식 전체라 하자.
                        원리가 보이는 가장 작은 경우인 <InlineMath math={"n = 2"}/>부터 본다.{" "}
                        <InlineMath math={"\\alpha_0 + \\alpha_1 t + \\alpha_2 t^2"}/>이 영다항식이라 하자.
                        이 식과 그 도함수를 <InlineMath math={"t = 0"}/>에서 값매김하면 계수가 하나씩 벗겨진다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} p(0) &= \\alpha_0 &&= 0 \\\\ \\left.\\tfrac{dp}{dt}\\right|_{t=0} &= \\left.(\\alpha_1 + 2\\alpha_2 t)\\right|_{t=0} = \\alpha_1 &&= 0 \\\\ \\left.\\tfrac{d^2p}{dt^2}\\right|_{t=0} &= 2\\alpha_2 &&= 0 \\end{aligned}"}/>
                <Terms items={[
                    ["p(t)", <T en={<>the polynomial <InlineMath math={"\\alpha_0 + \\alpha_1 t + \\alpha_2 t^2"}/>, assumed to be the zero vector of <InlineMath math={"\\mathcal{P}(t)"}/></>}
                               ko={<>다항식 <InlineMath math={"\\alpha_0 + \\alpha_1 t + \\alpha_2 t^2"}/>. <InlineMath math={"\\mathcal{P}(t)"}/>의 영벡터라고 가정했다</>}/>],
                    ["p(0)", <T en={<>evaluation at zero, which kills every term carrying a <InlineMath math={"t"}/></>}
                               ko={<>0에서의 값. <InlineMath math={"t"}/>가 붙은 항을 모두 없앤다</>}/>],
                    ["2\\alpha_2", <T en={<>what the second derivative leaves; dividing by 2 gives <InlineMath math={"\\alpha_2 = 0"}/></>}
                                     ko={<>2계 도함수가 남기는 값. 2로 나누면 <InlineMath math={"\\alpha_2 = 0"}/>이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        All three coefficients vanish, so <InlineMath math={"\\{1, t, t^2\\}"}/> is
                        independent. The general claim is that{" "}
                        <InlineMath math={"\\{1, t, \\ldots, t^n\\}"}/> is independent for each{" "}
                        <InlineMath math={"n \\ge 0"}/>. Two proofs follow, and they are worth comparing: the
                        first repeats the computation above in general, the second is an induction whose step
                        is itself a proof by contradiction.
                    </p>}
                    ko={<p>
                        세 계수가 모두 0이므로 <InlineMath math={"\\{1, t, t^2\\}"}/>은 선형 독립이다. 일반
                        명제는 각 <InlineMath math={"n \\ge 0"}/>에 대해{" "}
                        <InlineMath math={"\\{1, t, \\ldots, t^n\\}"}/>이 선형 독립이라는 것이다. 증명을 두
                        가지 적는데 서로 견주어 볼 값어치가 있다. 첫째는 위 계산을 일반적으로 반복하는 것이고,
                        둘째는 step 자체가 귀류법인 귀납법이다.
                    </p>}
                />
                <Proof label={t("Direct proof", "직접 증명")}>
                    <T
                        en={<p>
                            Suppose{" "}
                            <InlineMath math={"p(t) := \\alpha_0 + \\alpha_1 t + \\cdots + \\alpha_n t^n = 0"}/> is
                            the zero polynomial. From calculus, a polynomial is identically zero if and only
                            if its value and all its derivatives vanish at <InlineMath math={"t = 0"}/>, so
                            evaluate them one at a time:
                        </p>}
                        ko={<p>
                            <InlineMath math={"p(t) := \\alpha_0 + \\alpha_1 t + \\cdots + \\alpha_n t^n = 0"}/>이
                            영다항식이라 하자. 미적분에서 다항식이 항등적으로 0인 것은{" "}
                            <InlineMath math={"t = 0"}/>에서의 값과 모든 도함수가 0인 것과 동치이므로 하나씩
                            값매김한다.
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} 0 &= p(0) &&\\implies \\alpha_0 = 0 \\\\ 0 &= \\left.\\tfrac{dp}{dt}\\right|_{t=0} = \\left.(\\alpha_1 + 2\\alpha_2 t + \\cdots + n\\alpha_n t^{n-1})\\right|_{t=0} &&\\implies \\alpha_1 = 0 \\\\ 0 &= \\left.\\tfrac{d^2p}{dt^2}\\right|_{t=0} = \\left.(2\\alpha_2 + 6\\alpha_3 t + \\cdots + n(n-1)\\alpha_n t^{n-2})\\right|_{t=0} &&\\implies \\alpha_2 = 0 \\\\ &\\;\\;\\vdots \\\\ 0 &= \\left.\\tfrac{d^n p}{dt^n}\\right|_{t=0} = n!\\,\\alpha_n &&\\implies \\alpha_n = 0 \\end{aligned}"}/>
                    <Terms items={[
                        ["p(t)", <T en={<>the polynomial assumed to be the zero vector</>}
                                   ko={<>영벡터라고 가정한 다항식</>}/>],
                        ["\\alpha_i", <T en={<>its coefficients, the scalars in the linear combination being tested</>}
                                        ko={<>그 계수. 지금 검사 중인 선형 결합의 스칼라다</>}/>],
                        ["\\left.\\tfrac{d^k p}{dt^k}\\right|_{t=0}", <T en={<>the <InlineMath math={"k"}/>-th derivative at zero: every term of degree below <InlineMath math={"k"}/> has been differentiated away, and every term above still carries a <InlineMath math={"t"}/></>}
                                                                       ko={<>0에서의 <InlineMath math={"k"}/>계 도함수. <InlineMath math={"k"}/>보다 낮은 차수는 미분으로 사라졌고, 높은 차수는 여전히 <InlineMath math={"t"}/>를 달고 있다</>}/>],
                        ["n!", <T en={<>the factor left in front of <InlineMath math={"\\alpha_n"}/>, nonzero, so it can be divided out</>}
                                 ko={<><InlineMath math={"\\alpha_n"}/> 앞에 남는 인수. 0이 아니므로 나눠 없앨 수 있다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Only the trivial combination gives the zero polynomial, so the set is
                            independent.
                        </p>}
                        ko={<p>
                            영다항식을 만드는 조합이 자명한 것뿐이므로 이 집합은 선형 독립이다.
                        </p>}
                    />
                </Proof>
                <Proof label={t("Proof by induction", "귀납법 증명")}>
                    <T
                        en={<p><strong>Step 0.</strong> For <InlineMath math={"k \\ge 0"}/>, let{" "}
                            <InlineMath math={"P(k)"}/> be:{" "}
                            <InlineMath math={"\\{1, t, \\ldots, t^k\\}"}/> is linearly independent.</p>}
                        ko={<p><strong>Step 0.</strong> <InlineMath math={"k \\ge 0"}/>에 대해{" "}
                            <InlineMath math={"P(k)"}/>를 "<InlineMath math={"\\{1, t, \\ldots, t^k\\}"}/>이
                            선형 독립이다"로 둔다.</p>}
                    />
                    <T
                        en={<p><strong>Step 1.</strong> Base case <InlineMath math={"P(0)"}/>: the set{" "}
                            <InlineMath math={"\\{1\\}"}/> is independent, since{" "}
                            <InlineMath math={"\\alpha \\cdot 1 = 0"}/> forces{" "}
                            <InlineMath math={"\\alpha = 0"}/>.</p>}
                        ko={<p><strong>Step 1.</strong> base case <InlineMath math={"P(0)"}/>:{" "}
                            <InlineMath math={"\\alpha \\cdot 1 = 0"}/>이면{" "}
                            <InlineMath math={"\\alpha = 0"}/>이므로 집합{" "}
                            <InlineMath math={"\\{1\\}"}/>은 선형 독립이다.</p>}
                    />
                    <T
                        en={<p><strong>Step 2.</strong> Assume <InlineMath math={"P(k)"}/>. By Proposition
                            2.14 (b) it is enough to show that <InlineMath math={"t^{k+1}"}/> is not a linear
                            combination of <InlineMath math={"\\{1, t, \\ldots, t^k\\}"}/>. Suppose to the
                            contrary that it is, and differentiate both sides{" "}
                            <InlineMath math={"k+1"}/> times:</p>}
                        ko={<p><strong>Step 2.</strong> <InlineMath math={"P(k)"}/>를 가정한다. Proposition
                            2.14 (b)에 의해 <InlineMath math={"t^{k+1}"}/>이{" "}
                            <InlineMath math={"\\{1, t, \\ldots, t^k\\}"}/>의 선형 결합이 아님만 보이면 된다.
                            반대로 그런 결합이 있다고 하고 양변을 <InlineMath math={"k+1"}/>번 미분한다.</p>}
                    />
                    <BlockMath math={"t^{k+1} = \\alpha_0 + \\alpha_1 t + \\cdots + \\alpha_k t^k \\quad \\xrightarrow{\\ \\frac{d^{k+1}}{dt^{k+1}}\\ } \\quad (k+1)! = 0"}/>
                    <Terms items={[
                        ["t^{k+1}", <T en={<>the new monomial, assumed for contradiction to be reachable from the earlier ones</>}
                                      ko={<>새로 들어온 단항식. 모순을 노리고 앞의 것들로 만들 수 있다고 가정했다</>}/>],
                        ["\\frac{d^{k+1}}{dt^{k+1}}", <T en={<>differentiating <InlineMath math={"k+1"}/> times: the right side has degree at most <InlineMath math={"k"}/>, so it is annihilated, while the left side becomes the constant <InlineMath math={"(k+1)!"}/></>}
                                                        ko={<><InlineMath math={"k+1"}/>번 미분. 우변은 차수가 <InlineMath math={"k"}/> 이하라 전부 사라지고, 좌변은 상수 <InlineMath math={"(k+1)!"}/>이 된다</>}/>],
                        ["(k+1)!", <T en={<>a strictly positive number, so the identity is false</>}
                                     ko={<>0보다 큰 수. 따라서 이 등식은 거짓이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The identity is false, so no such combination exists and{" "}
                            <InlineMath math={"P(k+1)"}/> holds. Since <InlineMath math={"P(0)"}/> is true
                            and <InlineMath math={"P(k) \\implies P(k+1)"}/>, induction gives the claim for
                            every <InlineMath math={"n"}/>. Definition 2.15 then upgrades it to the full
                            infinite set <InlineMath math={"\\{1, t, t^2, \\ldots\\}"}/>.
                        </p>}
                        ko={<p>
                            이 등식이 거짓이므로 그런 결합은 없고 <InlineMath math={"P(k+1)"}/>이 성립한다.{" "}
                            <InlineMath math={"P(0)"}/>이 참이고{" "}
                            <InlineMath math={"P(k) \\implies P(k+1)"}/>이므로 귀납법에 의해 모든{" "}
                            <InlineMath math={"n"}/>에서 주장이 성립한다. 여기에 Definition 2.15를 얹으면
                            무한 집합 <InlineMath math={"\\{1, t, t^2, \\ldots\\}"}/> 전체로 올라간다.
                        </p>}
                    />
                </Proof>
            </Example>
            <Example n="2.17" title={<T en={<>Matrices as vectors</>} ko={<>벡터로서의 행렬</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/> and{" "}
                        <InlineMath math={"\\mathcal{X} = \\mathbb{R}^{2 \\times 3}"}/>, with
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/>,{" "}
                        <InlineMath math={"\\mathcal{X} = \\mathbb{R}^{2 \\times 3}"}/>이라 하고
                    </p>}
                />
                <BlockMath math={"v^1 = \\begin{bmatrix} 1 & 0 & 0 \\\\ 2 & 0 & 0 \\end{bmatrix}, \\quad v^2 = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 0 & 0 \\end{bmatrix}, \\quad v^4 = \\begin{bmatrix} 0 & 0 & 0 \\\\ 1 & 0 & 0 \\end{bmatrix}"}/>
                <Terms items={[
                    ["v^1, v^2, v^4", <T en={<>three elements of <InlineMath math={"\\mathcal{X}"}/>: each <InlineMath math={"2 \\times 3"}/> matrix is a single vector here</>}
                                        ko={<><InlineMath math={"\\mathcal{X}"}/>의 원소 셋. 여기서는 <InlineMath math={"2 \\times 3"}/> 행렬 하나가 벡터 하나다</>}/>],
                    ["0", <T en={<>the zero vector of <InlineMath math={"\\mathcal{X}"}/> is the <InlineMath math={"2 \\times 3"}/> matrix of zeros</>}
                            ko={<><InlineMath math={"\\mathcal{X}"}/>의 영벡터는 성분이 모두 0인 <InlineMath math={"2 \\times 3"}/> 행렬이다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            For <InlineMath math={"\\{v^1, v^2\\}"}/>, set a general combination equal to the
                            zero matrix. Every entry must vanish separately:
                        </p>}
                        ko={<p>
                            <InlineMath math={"\\{v^1, v^2\\}"}/>부터 보자. 일반적인 결합을 영행렬과 같다고
                            두면 성분마다 따로 0이 되어야 한다.
                        </p>}
                    />
                    <BlockMath math={"\\alpha_1 v^1 + \\alpha_2 v^2 = \\begin{bmatrix} \\alpha_1 + \\alpha_2 & 0 & 0 \\\\ 2\\alpha_1 & 0 & 0 \\end{bmatrix} = 0 \\iff \\begin{cases} \\alpha_1 + \\alpha_2 = 0 \\\\ 2\\alpha_1 = 0 \\end{cases} \\iff \\alpha_1 = \\alpha_2 = 0"}/>
                    <Terms items={[
                        ["\\alpha_1, \\alpha_2", <T en={<>the unknown scalars of the combination</>}
                                                  ko={<>결합의 미지 스칼라</>}/>],
                        ["2\\alpha_1 = 0", <T en={<>the (2,1) entry: it gives <InlineMath math={"\\alpha_1 = 0"}/>, and substituting into the first equation gives <InlineMath math={"\\alpha_2 = 0"}/></>}
                                             ko={<>(2,1) 성분. <InlineMath math={"\\alpha_1 = 0"}/>을 주고, 그것을 첫 식에 넣으면 <InlineMath math={"\\alpha_2 = 0"}/>이 된다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            So <InlineMath math={"\\{v^1, v^2\\}"}/> is independent. Adding{" "}
                            <InlineMath math={"v^4"}/> destroys that. The general combination is
                        </p>}
                        ko={<p>
                            따라서 <InlineMath math={"\\{v^1, v^2\\}"}/>은 선형 독립이다.{" "}
                            <InlineMath math={"v^4"}/>를 더하면 그것이 깨진다. 일반적인 결합은
                        </p>}
                    />
                    <BlockMath math={"\\alpha_1 v^1 + \\alpha_2 v^2 + \\alpha_4 v^4 = \\begin{bmatrix} \\alpha_1 + \\alpha_2 & 0 & 0 \\\\ 2\\alpha_1 + \\alpha_4 & 0 & 0 \\end{bmatrix} = 0"}/>
                    <Terms items={[
                        ["\\alpha_1 + \\alpha_2", <T en={<>the (1,1) entry, now one equation in three unknowns</>}
                                                   ko={<>(1,1) 성분. 이제 미지수 셋에 방정식 하나다</>}/>],
                        ["2\\alpha_1 + \\alpha_4", <T en={<>the (2,1) entry: two equations, three unknowns, so a nonzero solution must exist</>}
                                                    ko={<>(2,1) 성분. 방정식 둘에 미지수 셋이므로 0이 아닌 해가 반드시 있다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The definition asks for one witness, so pick{" "}
                            <InlineMath math={"\\alpha_1 = 1"}/>. Then{" "}
                            <InlineMath math={"\\alpha_2 = -1"}/> and{" "}
                            <InlineMath math={"\\alpha_4 = -2"}/>, and indeed
                        </p>}
                        ko={<p>
                            정의는 증거 하나를 요구하므로 <InlineMath math={"\\alpha_1 = 1"}/>로 잡자.
                            그러면 <InlineMath math={"\\alpha_2 = -1"}/>,{" "}
                            <InlineMath math={"\\alpha_4 = -2"}/>이고 실제로
                        </p>}
                    />
                    <BlockMath math={"1 \\cdot v^1 + (-1) \\cdot v^2 + (-2) \\cdot v^4 = \\begin{bmatrix} 1 - 1 & 0 & 0 \\\\ 2 - 2 & 0 & 0 \\end{bmatrix} = 0"}/>
                    <Terms items={[
                        ["1, -1, -2", <T en={<>coefficients not all zero, which is exactly what Definition 2.12 asks for</>}
                                        ko={<>전부 0은 아닌 계수. Definition 2.12가 요구하는 것이 바로 이것이다</>}/>],
                        ["v^4", <T en={<>the added vector; there are infinitely many other witnesses, and one suffices</>}
                                  ko={<>새로 더한 벡터. 다른 증거도 무한히 많지만 하나면 충분하다</>}/>],
                    ]}/>
                </Proof>
            </Example>
            <Example n="2.18" title={<T en={<>Write out every equation</>} ko={<>방정식을 전부 적어 보기</>}/>}>
                <T
                    en={<p>
                        Still in <InlineMath math={"\\mathbb{R}^{2 \\times 3}"}/>, are{" "}
                        <InlineMath math={"A_1 = \\left[\\begin{smallmatrix} 1 & 0 & 4 \\\\ 3 & -1 & 2 \\end{smallmatrix}\\right]"}/> and{" "}
                        <InlineMath math={"A_2 = \\left[\\begin{smallmatrix} 4 & 1 & 0 \\\\ 6 & 0 & 6 \\end{smallmatrix}\\right]"}/>{" "}
                        linearly independent?
                    </p>}
                    ko={<p>
                        여전히 <InlineMath math={"\\mathbb{R}^{2 \\times 3}"}/> 안에서{" "}
                        <InlineMath math={"A_1 = \\left[\\begin{smallmatrix} 1 & 0 & 4 \\\\ 3 & -1 & 2 \\end{smallmatrix}\\right]"}/>과{" "}
                        <InlineMath math={"A_2 = \\left[\\begin{smallmatrix} 4 & 1 & 0 \\\\ 6 & 0 & 6 \\end{smallmatrix}\\right]"}/>은
                        선형 독립인가?
                    </p>}
                />
                <Proof>
                    <T en={<p>Setting the combination to zero gives six scalar equations, one per entry:</p>}
                       ko={<p>결합을 0으로 두면 성분마다 하나씩, 스칼라 방정식 여섯 개가 나온다.</p>}/>
                    <BlockMath math={"\\alpha_1 A_1 + \\alpha_2 A_2 = \\begin{bmatrix} \\alpha_1 + 4\\alpha_2 & \\alpha_2 & 4\\alpha_1 \\\\ 3\\alpha_1 + 6\\alpha_2 & -\\alpha_1 & 2\\alpha_1 + 6\\alpha_2 \\end{bmatrix} = \\begin{bmatrix} 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{bmatrix}"}/>
                    <Terms items={[
                        ["\\alpha_2", <T en={<>the (1,2) entry: it alone forces <InlineMath math={"\\alpha_2 = 0"}/></>}
                                        ko={<>(1,2) 성분. 이것만으로 <InlineMath math={"\\alpha_2 = 0"}/>이 강제된다</>}/>],
                        ["-\\alpha_1", <T en={<>the (2,2) entry: it alone forces <InlineMath math={"\\alpha_1 = 0"}/></>}
                                         ko={<>(2,2) 성분. 이것만으로 <InlineMath math={"\\alpha_1 = 0"}/>이 강제된다</>}/>],
                        ["4\\alpha_1, \\; 3\\alpha_1 + 6\\alpha_2", <T en={<>the remaining equations, consistent with <InlineMath math={"\\alpha_1 = \\alpha_2 = 0"}/> and adding nothing new</>}
                                                                     ko={<>남은 방정식들. <InlineMath math={"\\alpha_1 = \\alpha_2 = 0"}/>과 모순되지 않으며 새로운 정보를 더하지 않는다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Two of the six equations already force both scalars to vanish, so the set is
                            linearly independent. The point of writing all six is that setting a matrix equal
                            to the zero matrix means setting <em>every entry</em> to zero, which is where
                            marks get lost.
                        </p>}
                        ko={<p>
                            여섯 중 둘만으로 두 스칼라가 모두 0이 되므로 이 집합은 선형 독립이다. 여섯 개를 다
                            적어 보는 이유는, 행렬을 영행렬과 같다고 두는 것이 <em>모든 성분</em>을 0으로
                            둔다는 뜻임을 놓치기 쉽기 때문이다.
                        </p>}
                    />
                </Proof>
            </Example>
            <Remark n="2.19" title={<T en={<>Independence depends on the field</>} ko={<>선형 독립은 체에 달려 있다</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"\\mathcal{X} = \\mathbb{C}"}/>,{" "}
                        <InlineMath math={"v^1 = 1"}/> and{" "}
                        <InlineMath math={"v^2 = j := \\sqrt{-1}"}/>. Over{" "}
                        <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/> the two are independent: with real{" "}
                        <InlineMath math={"\\alpha_1, \\alpha_2"}/>, the equation{" "}
                        <InlineMath math={"\\alpha_1 + \\alpha_2 j = 0"}/> forces the real part{" "}
                        <InlineMath math={"\\alpha_1"}/> and the imaginary part{" "}
                        <InlineMath math={"\\alpha_2"}/> to vanish separately. Over{" "}
                        <InlineMath math={"\\mathcal{F} = \\mathbb{C}"}/> they are dependent, since{" "}
                        <InlineMath math={"j \\cdot 1 + (-1) \\cdot j = 0"}/> uses the coefficients{" "}
                        <InlineMath math={"j"}/> and <InlineMath math={"-1"}/>, which are now legal scalars.
                        The same vectors, a different answer. Always say which field you are working over.
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{X} = \\mathbb{C}"}/>,{" "}
                        <InlineMath math={"v^1 = 1"}/>,{" "}
                        <InlineMath math={"v^2 = j := \\sqrt{-1}"}/>이라 하자.{" "}
                        <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/> 위에서는 둘이 선형 독립이다. 실수{" "}
                        <InlineMath math={"\\alpha_1, \\alpha_2"}/>에 대해{" "}
                        <InlineMath math={"\\alpha_1 + \\alpha_2 j = 0"}/>이면 실수부{" "}
                        <InlineMath math={"\\alpha_1"}/>과 허수부 <InlineMath math={"\\alpha_2"}/>가 따로
                        0이 되어야 하기 때문이다. <InlineMath math={"\\mathcal{F} = \\mathbb{C}"}/> 위에서는{" "}
                        <InlineMath math={"j \\cdot 1 + (-1) \\cdot j = 0"}/>에서 계수{" "}
                        <InlineMath math={"j"}/>와 <InlineMath math={"-1"}/>이 이제 정당한 스칼라이므로
                        종속이다. 벡터는 같은데 답이 다르다. 어느 체 위에서 이야기하는지 항상 밝혀야 한다.
                    </p>}
                />
            </Remark>
            <Definition n="2.20" title={<T en={<>Span</>} ko={<>span</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"\\mathcal{S}"}/> be a subset of a vector space{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>. The <strong>span</strong> of{" "}
                        <InlineMath math={"\\mathcal{S}"}/> is the set of all linear combinations of elements
                        of <InlineMath math={"\\mathcal{S}"}/>:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{S}"}/>를 벡터 공간{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>의 부분집합이라 하자.{" "}
                        <InlineMath math={"\\mathcal{S}"}/>의 <strong>span</strong>은{" "}
                        <InlineMath math={"\\mathcal{S}"}/>의 원소들로 만드는 모든 선형 결합의 집합이다.
                    </p>}
                />
                <BlockMath math={"\\operatorname{span}\\{\\mathcal{S}\\} := \\{x \\in \\mathcal{X} \\mid \\exists\\, n \\ge 1, \\; \\alpha_1, \\ldots, \\alpha_n \\in \\mathcal{F}, \\; v^1, \\ldots, v^n \\in \\mathcal{S} \\text{ s.t. } x = \\alpha_1 v^1 + \\cdots + \\alpha_n v^n\\}"}/>
                <Terms items={[
                    ["\\mathcal{S}", <T en={<>any subset of <InlineMath math={"\\mathcal{X}"}/>, possibly infinite</>}
                                       ko={<><InlineMath math={"\\mathcal{X}"}/>의 임의의 부분집합. 무한해도 된다</>}/>],
                    ["n", <T en={<>the length of the combination, chosen per element <InlineMath math={"x"}/> and always finite</>}
                            ko={<>결합의 길이. 원소 <InlineMath math={"x"}/>마다 고르며 언제나 유한하다</>}/>],
                    ["\\alpha_i, v^i", <T en={<>the scalars and the vectors of <InlineMath math={"\\mathcal{S}"}/> used to build <InlineMath math={"x"}/></>}
                                         ko={<><InlineMath math={"x"}/>를 만드는 데 쓰는 스칼라와 <InlineMath math={"\\mathcal{S}"}/>의 벡터</>}/>],
                ]}/>
                <T
                    en={<p>
                        Two instances in <InlineMath math={"\\mathbb{R}^2"}/>. The span of a single vector is
                        a line, and the span of two independent vectors is everything:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathbb{R}^2"}/>에서 두 예를 보자. 벡터 하나의 span은 직선이고,
                        독립인 벡터 둘의 span은 전체다.
                    </p>}
                />
                <BlockMath math={"\\operatorname{span}\\left\\{\\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix}\\right\\} = \\left\\{\\begin{bmatrix} \\beta \\\\ 2\\beta \\end{bmatrix}\\right\\}, \\qquad \\begin{bmatrix} 5 \\\\ 3 \\end{bmatrix} = 2\\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} + 3\\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix}"}/>
                <Terms items={[
                    ["\\beta", <T en={<>the single scalar available, so the span is one dimensional</>}
                                 ko={<>쓸 수 있는 스칼라가 하나뿐이라 span이 1차원이 된다</>}/>],
                    ["(5,3)^\\top", <T en={<>an arbitrary target: solving <InlineMath math={"\\alpha_2 = 3"}/> from the second entry and <InlineMath math={"\\alpha_1 + \\alpha_2 = 5"}/> from the first reaches it, so <InlineMath math={"\\operatorname{span}\\{(1,0)^\\top, (1,1)^\\top\\} = \\mathbb{R}^2"}/></>}
                                      ko={<>임의의 목표점. 둘째 성분에서 <InlineMath math={"\\alpha_2 = 3"}/>, 첫 성분에서 <InlineMath math={"\\alpha_1 + \\alpha_2 = 5"}/>를 풀면 닿으므로 <InlineMath math={"\\operatorname{span}\\{(1,0)^\\top, (1,1)^\\top\\} = \\mathbb{R}^2"}/>이다</>}/>],
                ]}/>
            </Definition>
            <Remark n="2.21" title={<T en={<>A span is always a subspace</>} ko={<>span은 언제나 부분 공간이다</>}/>}>
                <T
                    en={<p>
                        Take two elements of <InlineMath math={"\\operatorname{span}\\{\\mathcal{S}\\}"}/>,
                        say <InlineMath math={"x = \\sum_{i} \\alpha_i v^i"}/> and{" "}
                        <InlineMath math={"y = \\sum_{j} \\beta_j w^j"}/> with all{" "}
                        <InlineMath math={"v^i, w^j \\in \\mathcal{S}"}/>. Then{" "}
                        <InlineMath math={"\\gamma_1 x + \\gamma_2 y"}/> is again a finite sum of scalar
                        multiples of elements of <InlineMath math={"\\mathcal{S}"}/>, because concatenating
                        two finite lists gives a finite list. So Proposition 2.8 (d) holds, and the set is
                        nonempty whenever <InlineMath math={"\\mathcal{S}"}/> is. This is the cheapest way to
                        manufacture subspaces, and it is how every subspace in the rest of the course will be
                        described.
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\operatorname{span}\\{\\mathcal{S}\\}"}/>의 원소 둘을{" "}
                        <InlineMath math={"x = \\sum_{i} \\alpha_i v^i"}/>,{" "}
                        <InlineMath math={"y = \\sum_{j} \\beta_j w^j"}/>라 하고 모든{" "}
                        <InlineMath math={"v^i, w^j"}/>가 <InlineMath math={"\\mathcal{S}"}/>에 있다고 하자.
                        그러면 <InlineMath math={"\\gamma_1 x + \\gamma_2 y"}/>도{" "}
                        <InlineMath math={"\\mathcal{S}"}/> 원소들의 스칼라배를 유한히 더한 것이다. 유한한
                        목록 둘을 이어 붙여도 유한하기 때문이다. 따라서 Proposition 2.8 (d)가 성립하고,{" "}
                        <InlineMath math={"\\mathcal{S}"}/>가 비어 있지 않으면 span도 비어 있지 않다. 부분
                        공간을 만드는 가장 값싼 방법이며, 이 과목의 남은 부분에서 부분 공간은 전부 이렇게
                        서술된다.
                    </p>}
                />
            </Remark>
            <Example n="2.22" title={<T en={<>Why "finite" was not pedantry</>} ko={<>"유한"이 트집이 아니었던 이유</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/> and{" "}
                        <InlineMath math={"\\mathcal{X} = \\{f : \\mathbb{R} \\to \\mathbb{R}\\}"}/>, and take{" "}
                        <InlineMath math={"\\mathcal{S} = \\{1, t, t^2, \\ldots\\}"}/>. Then{" "}
                        <InlineMath math={"\\operatorname{span}\\{\\mathcal{S}\\} = \\mathcal{P}(t)"}/>, the
                        polynomials. Is <InlineMath math={"e^t"}/> in the span?
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/>,{" "}
                        <InlineMath math={"\\mathcal{X} = \\{f : \\mathbb{R} \\to \\mathbb{R}\\}"}/>,{" "}
                        <InlineMath math={"\\mathcal{S} = \\{1, t, t^2, \\ldots\\}"}/>이라 하자. 그러면{" "}
                        <InlineMath math={"\\operatorname{span}\\{\\mathcal{S}\\} = \\mathcal{P}(t)"}/>, 곧
                        다항식 전체다. <InlineMath math={"e^t"}/>는 이 span 안에 있는가?
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            No. The Taylor series{" "}
                            <InlineMath math={"e^t = 1 + t + \\tfrac{t^2}{2} + \\tfrac{t^3}{6} + \\cdots"}/>{" "}
                            has infinitely many nonzero terms, and by Definition 2.11 that is not a linear
                            combination. It remains to rule out some other, finite way of writing it. Suppose{" "}
                            <InlineMath math={"e^t = p(t)"}/> for a polynomial <InlineMath math={"p"}/> of
                            degree <InlineMath math={"d"}/>. Differentiating both sides gives
                        </p>}
                        ko={<p>
                            아니다. 테일러 급수{" "}
                            <InlineMath math={"e^t = 1 + t + \\tfrac{t^2}{2} + \\tfrac{t^3}{6} + \\cdots"}/>는
                            0이 아닌 항이 무한히 많고, Definition 2.11에 의해 그것은 선형 결합이 아니다. 남은
                            일은 다른 유한한 표현이 없음을 보이는 것이다. 차수가{" "}
                            <InlineMath math={"d"}/>인 다항식 <InlineMath math={"p"}/>에 대해{" "}
                            <InlineMath math={"e^t = p(t)"}/>라 하자. 양변을 미분하면
                        </p>}
                    />
                    <BlockMath math={"\\tfrac{d}{dt} e^t = e^t \\quad \\Longrightarrow \\quad \\tfrac{d}{dt} p(t) = p(t)"}/>
                    <Terms items={[
                        ["e^t", <T en={<>the function in question, which is its own derivative</>}
                                  ko={<>지금 따지는 함수. 자기 자신이 도함수다</>}/>],
                        ["p(t)", <T en={<>a hypothetical polynomial equal to <InlineMath math={"e^t"}/>, assumed for contradiction</>}
                                   ko={<><InlineMath math={"e^t"}/>와 같다고 가정한 다항식. 모순을 노린 가정이다</>}/>],
                        ["\\tfrac{d}{dt}p", <T en={<>a polynomial of degree <InlineMath math={"d - 1"}/> when <InlineMath math={"d \\ge 1"}/>, and the zero polynomial when <InlineMath math={"d = 0"}/></>}
                                              ko={<><InlineMath math={"d \\ge 1"}/>이면 차수가 <InlineMath math={"d-1"}/>인 다항식이고, <InlineMath math={"d = 0"}/>이면 영다항식이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Compare degrees. If <InlineMath math={"d \\ge 1"}/>, the left side has degree{" "}
                            <InlineMath math={"d - 1"}/> and the right side degree{" "}
                            <InlineMath math={"d"}/>, so they cannot be equal. If{" "}
                            <InlineMath math={"d = 0"}/>, then <InlineMath math={"p"}/> is a constant{" "}
                            <InlineMath math={"c"}/> and the equation reads{" "}
                            <InlineMath math={"0 = c"}/>, so <InlineMath math={"p \\equiv 0 \\neq e^t"}/>.
                            Both cases fail, hence{" "}
                            <InlineMath math={"e^t \\notin \\operatorname{span}\\{\\mathcal{S}\\}"}/>.
                        </p>}
                        ko={<p>
                            차수를 비교하자. <InlineMath math={"d \\ge 1"}/>이면 좌변의 차수가{" "}
                            <InlineMath math={"d - 1"}/>, 우변이 <InlineMath math={"d"}/>라 같을 수 없다.{" "}
                            <InlineMath math={"d = 0"}/>이면 <InlineMath math={"p"}/>는 상수{" "}
                            <InlineMath math={"c"}/>이고 식은 <InlineMath math={"0 = c"}/>가 되므로{" "}
                            <InlineMath math={"p \\equiv 0 \\neq e^t"}/>이다. 두 경우가 모두 무너지므로{" "}
                            <InlineMath math={"e^t \\notin \\operatorname{span}\\{\\mathcal{S}\\}"}/>다.
                        </p>}
                    />
                </Proof>
            </Example>
            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Basis Vectors and Dimension</h2>} ko={<h2>기저와 차원</h2>}/>
            <T
                en={<p>
                    A basis is a set that is large enough to reach every vector and small enough that the way
                    of reaching it is unique. Those two halves are the two conditions in the definition, and
                    it is worth remembering which is which: spanning is about coverage, independence is about
                    uniqueness.
                </p>}
                ko={<p>
                    기저는 모든 벡터에 닿을 만큼 크면서, 닿는 방법이 유일할 만큼 작은 집합이다. 그 두 쪽이
                    정의의 두 조건이고, 어느 쪽이 무엇인지 기억해 둘 값어치가 있다. span은 빠짐없음에 대한
                    조건이고 선형 독립은 유일함에 대한 조건이다.
                </p>}
            />
            <Definition n="2.23" title={<T en={<>Basis</>} ko={<>기저</>}/>}>
                <T
                    en={<p>
                        A set of vectors <InlineMath math={"\\mathcal{B}"}/> in{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/> is a <strong>basis</strong> for{" "}
                        <InlineMath math={"\\mathcal{X}"}/> if (a) <InlineMath math={"\\mathcal{B}"}/> is
                        linearly independent and (b){" "}
                        <InlineMath math={"\\operatorname{span}\\{\\mathcal{B}\\} = \\mathcal{X}"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/> 안의 벡터 집합{" "}
                        <InlineMath math={"\\mathcal{B}"}/>가 (a) 선형 독립이고 (b){" "}
                        <InlineMath math={"\\operatorname{span}\\{\\mathcal{B}\\} = \\mathcal{X}"}/>이면{" "}
                        <InlineMath math={"\\mathcal{X}"}/>의 <strong>기저</strong>다.
                    </p>}
                />
            </Definition>
            <Example title={<T en={<>Checking a basis of <InlineMath math={"\\mathbb{R}^2"}/> by hand</>}
                              ko={<><InlineMath math={"\\mathbb{R}^2"}/>의 기저를 손으로 확인하기</>}/>}>
                <T
                    en={<p>
                        Take <InlineMath math={"\\mathcal{B} = \\{(1,1)^\\top, (1,-1)^\\top\\}"}/>. Both
                        conditions are two-line computations, and this same pair will reappear as the second
                        basis in the change of basis example and as the eigenvectors in the diagonalization
                        example, so it is worth doing carefully.
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{B} = \\{(1,1)^\\top, (1,-1)^\\top\\}"}/>을 잡자. 두 조건
                        모두 두 줄짜리 계산이다. 이 같은 쌍이 뒤에서 기저 변환 예의 둘째 기저로, 또 대각화 예의
                        고유벡터로 다시 나오므로 여기서 꼼꼼히 해 둘 값어치가 있다.
                    </p>}
                />
                <BlockMath math={"\\alpha_1 \\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix} + \\alpha_2 \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix} \\iff \\begin{cases} \\alpha_1 + \\alpha_2 = 0 \\\\ \\alpha_1 - \\alpha_2 = 0 \\end{cases} \\iff \\alpha_1 = \\alpha_2 = 0"}/>
                <Terms items={[
                    ["\\alpha_1 + \\alpha_2 = 0", <T en={<>the first entry of the vector equation</>}
                                                    ko={<>벡터 방정식의 첫 성분</>}/>],
                    ["\\alpha_1 - \\alpha_2 = 0", <T en={<>the second entry; adding the two equations gives <InlineMath math={"2\\alpha_1 = 0"}/></>}
                                                    ko={<>둘째 성분. 두 식을 더하면 <InlineMath math={"2\\alpha_1 = 0"}/>이 된다</>}/>],
                ]}/>
                <T
                    en={<p>
                        That is independence. For spanning, take an arbitrary{" "}
                        <InlineMath math={"(x_1, x_2)^\\top"}/> and solve the same system with a nonzero
                        right side. Adding and subtracting the two equations gives the coefficients outright:
                    </p>}
                    ko={<p>
                        여기까지가 선형 독립이다. span 조건은 임의의{" "}
                        <InlineMath math={"(x_1, x_2)^\\top"}/>에 대해 우변이 0이 아닌 같은 연립방정식을 풀면
                        된다. 두 식을 더하고 빼면 계수가 바로 나온다.
                    </p>}
                />
                <BlockMath math={"\\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix} = \\frac{x_1 + x_2}{2}\\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix} + \\frac{x_1 - x_2}{2}\\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix}, \\qquad \\text{e.g.} \\quad \\begin{bmatrix} 3 \\\\ 1 \\end{bmatrix} = 2\\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix} + 1\\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix}"}/>
                <Terms items={[
                    ["(x_1, x_2)^\\top", <T en={<>an arbitrary target vector in <InlineMath math={"\\mathbb{R}^2"}/></>}
                                           ko={<><InlineMath math={"\\mathbb{R}^2"}/>의 임의의 목표 벡터</>}/>],
                    ["\\tfrac{x_1 + x_2}{2}, \\; \\tfrac{x_1 - x_2}{2}", <T en={<>the coefficients, which exist for every <InlineMath math={"x"}/>: that is the spanning condition</>}
                                                                          ko={<>계수. 모든 <InlineMath math={"x"}/>에 대해 존재하며, 그것이 span 조건이다</>}/>],
                    ["(3,1)^\\top", <T en={<>one concrete target, reached with coefficients 2 and 1</>}
                                      ko={<>구체적인 목표 하나. 계수 2와 1로 닿는다</>}/>],
                ]}/>
            </Example>
            <Example n="2.24" title={<T en={<>Bases</>} ko={<>기저의 예</>}/>}>
                <T
                    en={<p>
                        (a) In <InlineMath math={"(\\mathcal{F}^n, \\mathcal{F})"}/>, the{" "}
                        <strong>natural basis</strong>{" "}
                        <InlineMath math={"\\{e^1, \\ldots, e^n\\}"}/> has a one in position{" "}
                        <InlineMath math={"i"}/> and zeros elsewhere. One display settles both conditions at
                        once:
                    </p>}
                    ko={<p>
                        (a) <InlineMath math={"(\\mathcal{F}^n, \\mathcal{F})"}/>에서{" "}
                        <strong>표준 기저</strong> <InlineMath math={"\\{e^1, \\ldots, e^n\\}"}/>는{" "}
                        <InlineMath math={"i"}/>번째 자리만 1이고 나머지는 0인 열이다. 아래 식 하나로 두
                        조건이 동시에 해결된다.
                    </p>}
                />
                <BlockMath math={"\\alpha_1 e^1 + \\alpha_2 e^2 + \\cdots + \\alpha_n e^n = \\begin{bmatrix} \\alpha_1 \\\\ \\alpha_2 \\\\ \\vdots \\\\ \\alpha_n \\end{bmatrix}"}/>
                <Terms items={[
                    ["e^i", <T en={<>the <InlineMath math={"i"}/>-th natural basis vector: a one in row <InlineMath math={"i"}/>, zeros elsewhere</>}
                              ko={<><InlineMath math={"i"}/>번째 표준 기저 벡터. <InlineMath math={"i"}/>행만 1이고 나머지는 0이다</>}/>],
                    ["\\alpha_i", <T en={<>arbitrary scalars in <InlineMath math={"\\mathcal{F}"}/></>}
                                    ko={<><InlineMath math={"\\mathcal{F}"}/>의 임의의 스칼라</>}/>],
                    ["\\begin{bmatrix} \\alpha_1 \\\\ \\vdots \\end{bmatrix}", <T en={<>the resulting column: it is zero only when every <InlineMath math={"\\alpha_i"}/> is zero (independence) and it can be any column at all (spanning)</>}
                                                                                ko={<>결과로 나오는 열. 모든 <InlineMath math={"\\alpha_i"}/>가 0일 때만 영벡터이고(선형 독립), 어떤 열이든 만들어 낼 수 있다(span)</>}/>],
                ]}/>
                <T
                    en={<ul>
                        <li>(b) <InlineMath math={"\\{je^1, \\ldots, je^n\\}"}/> is also a basis for{" "}
                            <InlineMath math={"(\\mathbb{C}^n, \\mathbb{C})"}/>, since{" "}
                            <InlineMath math={"e^i = (-j)(je^i)"}/> recovers the natural basis.</li>
                        <li>(c) So is <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> with{" "}
                            <InlineMath math={"v^i"}/> the column of <InlineMath math={"i"}/> ones followed by
                            zeros. In <InlineMath math={"\\mathbb{R}^3"}/> that is{" "}
                            <InlineMath math={"(1,0,0)^\\top, (1,1,0)^\\top, (1,1,1)^\\top"}/>, and{" "}
                            <InlineMath math={"e^1 = v^1"}/>,{" "}
                            <InlineMath math={"e^2 = v^2 - v^1"}/>,{" "}
                            <InlineMath math={"e^3 = v^3 - v^2"}/> recover the natural basis.</li>
                        <li>(d) <InlineMath math={"\\{e^1, \\ldots, e^n, je^1, \\ldots, je^n\\}"}/> is a basis
                            for <InlineMath math={"(\\mathbb{C}^n, \\mathbb{R})"}/>: with real scalars you
                            need both halves to build <InlineMath math={"3 + 4j"}/> in the first slot.</li>
                        <li>(e) The infinite set <InlineMath math={"\\{1, t, \\ldots, t^n, \\ldots\\}"}/> is a
                            basis for <InlineMath math={"(\\mathcal{P}(t), \\mathbb{R})"}/>: independent by
                            Example 2.16, and spanning by the definition of a polynomial.</li>
                    </ul>}
                    ko={<ul>
                        <li>(b) <InlineMath math={"\\{je^1, \\ldots, je^n\\}"}/>도{" "}
                            <InlineMath math={"(\\mathbb{C}^n, \\mathbb{C})"}/>의 기저다.{" "}
                            <InlineMath math={"e^i = (-j)(je^i)"}/>로 표준 기저를 되찾을 수 있다.</li>
                        <li>(c) <InlineMath math={"v^i"}/>를 앞의 <InlineMath math={"i"}/>개가 1이고 나머지가
                            0인 열이라 할 때 <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>도 기저다.{" "}
                            <InlineMath math={"\\mathbb{R}^3"}/>에서는{" "}
                            <InlineMath math={"(1,0,0)^\\top, (1,1,0)^\\top, (1,1,1)^\\top"}/>이고,{" "}
                            <InlineMath math={"e^1 = v^1"}/>,{" "}
                            <InlineMath math={"e^2 = v^2 - v^1"}/>,{" "}
                            <InlineMath math={"e^3 = v^3 - v^2"}/>로 표준 기저를 되찾는다.</li>
                        <li>(d) <InlineMath math={"\\{e^1, \\ldots, e^n, je^1, \\ldots, je^n\\}"}/>은{" "}
                            <InlineMath math={"(\\mathbb{C}^n, \\mathbb{R})"}/>의 기저다. 실수 스칼라만으로
                            첫 자리에 <InlineMath math={"3 + 4j"}/>를 만들려면 양쪽 절반이 다 필요하다.</li>
                        <li>(e) 무한 집합 <InlineMath math={"\\{1, t, \\ldots, t^n, \\ldots\\}"}/>은{" "}
                            <InlineMath math={"(\\mathcal{P}(t), \\mathbb{R})"}/>의 기저다. 선형 독립은
                            Example 2.16이고, span은 다항식의 정의 그 자체다.</li>
                    </ul>}
                />
            </Example>
            <Example n="2.25" title={<T en={<>Two non-bases</>} ko={<>기저가 아닌 두 예</>}/>}>
                <T
                    en={<ul>
                        <li><InlineMath math={"\\{e^1, \\ldots, e^n\\}"}/> is <strong>not</strong> a basis for{" "}
                            <InlineMath math={"(\\mathbb{C}^n, \\mathbb{R})"}/>, because with real scalars its
                            span misses <InlineMath math={"je^1"}/>. Spanning fails.</li>
                        <li><InlineMath math={"\\{e^1, \\ldots, e^n, je^1, \\ldots, je^n\\}"}/> is not a basis
                            for <InlineMath math={"(\\mathbb{C}^n, \\mathbb{C})"}/>, because{" "}
                            <InlineMath math={"j \\cdot e^i + (-1) \\cdot (je^i) = 0"}/> is a nontrivial
                            combination. Independence fails.</li>
                    </ul>}
                    ko={<ul>
                        <li><InlineMath math={"\\{e^1, \\ldots, e^n\\}"}/>은{" "}
                            <InlineMath math={"(\\mathbb{C}^n, \\mathbb{R})"}/>의 기저가{" "}
                            <strong>아니다</strong>. 실수 스칼라만으로는 span이{" "}
                            <InlineMath math={"je^1"}/>을 놓친다. span 조건이 깨진다.</li>
                        <li><InlineMath math={"\\{e^1, \\ldots, e^n, je^1, \\ldots, je^n\\}"}/>은{" "}
                            <InlineMath math={"(\\mathbb{C}^n, \\mathbb{C})"}/>의 기저가 아니다.{" "}
                            <InlineMath math={"j \\cdot e^i + (-1) \\cdot (je^i) = 0"}/>이 자명하지 않은
                            결합이기 때문이다. 선형 독립이 깨진다.</li>
                    </ul>}
                />
            </Example>
            <Definition n="2.26" title={<T en={<>Finite dimension</>} ko={<>유한 차원</>}/>}>
                <T
                    en={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/> has{" "}
                        <strong>dimension</strong> <InlineMath math={"n > 0"}/> if there is a set of{" "}
                        <InlineMath math={"n"}/> linearly independent vectors, and every set with{" "}
                        <InlineMath math={"n+1"}/> or more vectors is linearly dependent.
                    </p>}
                    ko={<p>
                        선형 독립인 벡터 <InlineMath math={"n"}/>개짜리 집합이 존재하고,{" "}
                        <InlineMath math={"n+1"}/>개 이상인 집합은 모두 선형 종속이면{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>의 <strong>차원</strong>이{" "}
                        <InlineMath math={"n > 0"}/>이다.
                    </p>}
                />
                <T
                    en={<p>
                        Both halves are visible in <InlineMath math={"\\mathbb{R}^2"}/>. The pair{" "}
                        <InlineMath math={"\\{(1,1)^\\top, (1,-1)^\\top\\}"}/> above is independent, so{" "}
                        <InlineMath math={"\\dim \\ge 2"}/>. And any three vectors are dependent, since
                        three unknowns in two equations always leave a nonzero solution: with{" "}
                        <InlineMath math={"(1,0)^\\top, (0,1)^\\top, (2,3)^\\top"}/> a witness is
                    </p>}
                    ko={<p>
                        두 쪽 모두 <InlineMath math={"\\mathbb{R}^2"}/>에서 눈에 보인다. 위의 쌍{" "}
                        <InlineMath math={"\\{(1,1)^\\top, (1,-1)^\\top\\}"}/>이 독립이므로{" "}
                        <InlineMath math={"\\dim \\ge 2"}/>다. 그리고 벡터 셋은 언제나 종속이다. 방정식 둘에
                        미지수 셋이면 0이 아닌 해가 반드시 남기 때문이다.{" "}
                        <InlineMath math={"(1,0)^\\top, (0,1)^\\top, (2,3)^\\top"}/>에 대한 증거는
                    </p>}
                />
                <BlockMath math={"2\\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} + 3\\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix} + (-1)\\begin{bmatrix} 2 \\\\ 3 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix}"}/>
                <Terms items={[
                    ["2, 3, -1", <T en={<>coefficients not all zero: the third vector was already reachable from the first two</>}
                                   ko={<>전부 0은 아닌 계수. 셋째 벡터는 앞의 둘로 이미 닿을 수 있었다</>}/>],
                    ["(2,3)^\\top", <T en={<>the redundant vector, equal to <InlineMath math={"2e^1 + 3e^2"}/></>}
                                      ko={<>군더더기 벡터. <InlineMath math={"2e^1 + 3e^2"}/>과 같다</>}/>],
                ]}/>
                <T
                    en={<p>
                        So <InlineMath math={"\\dim(\\mathbb{R}^2, \\mathbb{R}) = 2"}/>. The figure above
                        makes the second half tangible: add a third arrow and drag it anywhere you like, the
                        certificate never disappears.
                    </p>}
                    ko={<p>
                        따라서 <InlineMath math={"\\dim(\\mathbb{R}^2, \\mathbb{R}) = 2"}/>다. 위 그림이 두
                        번째 조건을 손에 잡히게 해 준다. 화살표를 하나 더 넣고 아무 데로나 끌어도 증거는
                        사라지지 않는다.
                    </p>}
                />
            </Definition>
            <Definition n="2.27" title={<T en={<>Infinite dimension</>} ko={<>무한 차원</>}/>}>
                <T
                    en={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/> is{" "}
                        <strong>infinite dimensional</strong> if for every{" "}
                        <InlineMath math={"n > 0"}/> there is a linearly independent set with{" "}
                        <InlineMath math={"n"}/> or more elements. Example 2.16 supplies exactly that for{" "}
                        <InlineMath math={"\\mathcal{P}(t)"}/>: the set{" "}
                        <InlineMath math={"\\{1, t, \\ldots, t^n\\}"}/> works for every{" "}
                        <InlineMath math={"n"}/>.
                    </p>}
                    ko={<p>
                        모든 <InlineMath math={"n > 0"}/>에 대해 원소가 <InlineMath math={"n"}/>개 이상인 선형
                        독립 집합이 존재하면 <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>은{" "}
                        <strong>무한 차원</strong>이다. Example 2.16이{" "}
                        <InlineMath math={"\\mathcal{P}(t)"}/>에 대해 바로 그것을 제공한다. 집합{" "}
                        <InlineMath math={"\\{1, t, \\ldots, t^n\\}"}/>이 모든 <InlineMath math={"n"}/>에서
                        통한다.
                    </p>}
                />
            </Definition>
            <Remark n="2.28" title={<T en={<>Dimension of a subspace</>} ko={<>부분 공간의 차원</>}/>}>
                <T
                    en={<p>
                        Subspaces are vector spaces in their own right, so the definitions above assign them
                        dimensions too. The line{" "}
                        <InlineMath math={"\\operatorname{span}\\{(1,2)^\\top\\} \\subset \\mathbb{R}^2"}/> has
                        dimension 1, and by convention{" "}
                        <InlineMath math={"\\dim \\{0\\} = 0"}/>.
                    </p>}
                    ko={<p>
                        부분 공간도 그 자체로 벡터 공간이므로 위 정의가 부분 공간의 차원도 정해 준다. 직선{" "}
                        <InlineMath math={"\\operatorname{span}\\{(1,2)^\\top\\} \\subset \\mathbb{R}^2"}/>의
                        차원은 1이고, 관례상 <InlineMath math={"\\dim \\{0\\} = 0"}/>이다.
                    </p>}
                />
            </Remark>
            <Example n="2.29" title={<T en={<>Dimensions worth memorizing</>} ko={<>외워 둘 만한 차원들</>}/>}>
                <table className="table-center">
                    <thead>
                    <tr>
                        <th>{t("Space", "공간")}</th>
                        <th>{t("Dimension", "차원")}</th>
                        <th>{t("A basis", "기저 하나")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><InlineMath math={"(\\mathcal{F}^n, \\mathcal{F})"}/></td>
                        <td><InlineMath math={"n"}/></td>
                        <td><InlineMath math={"\\{e^1, \\ldots, e^n\\}"}/></td>
                    </tr>
                    <tr>
                        <td><InlineMath math={"(\\mathbb{C}^n, \\mathbb{R})"}/></td>
                        <td><InlineMath math={"2n"}/></td>
                        <td><InlineMath math={"\\{e^i\\} \\cup \\{je^i\\}"}/></td>
                    </tr>
                    <tr>
                        <td><InlineMath math={"(\\mathcal{P}(t), \\mathbb{R})"}/></td>
                        <td><InlineMath math={"\\infty"}/></td>
                        <td><InlineMath math={"\\{1, t, t^2, \\ldots\\}"}/></td>
                    </tr>
                    <tr>
                        <td><InlineMath math={"(\\mathbb{R}, \\mathbb{Q})"}/></td>
                        <td><InlineMath math={"\\infty"}/></td>
                        <td>{t("cannot be written down", "적어 낼 수 없다")}</td>
                    </tr>
                    </tbody>
                </table>
            </Example>
            <Remark n="2.30" title={<T en={<>The one that should bother you</>} ko={<>마음에 걸려야 정상인 예</>}/>}>
                <T
                    en={<p>
                        Dimension is usually defined as the cardinality of a basis, and for the first three
                        rows we exhibited one. For{" "}
                        <InlineMath math={"(\\mathbb{R}, \\mathbb{Q})"}/> no explicit basis can be written
                        down, yet{" "}
                        <a href={DIM_R_OVER_Q} target="_blank" rel="noopener noreferrer">other arguments</a>{" "}
                        show the dimension is infinite. The vectors are the real numbers, objects your
                        intuition insists are one dimensional. That is the point of the example: dimension is
                        a statement about a pair{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>, never about{" "}
                        <InlineMath math={"\\mathcal{X}"}/> alone.
                    </p>}
                    ko={<p>
                        차원은 보통 기저의 크기로 정의하고, 위 표의 앞 세 줄에서는 기저를 실제로 적었다.{" "}
                        <InlineMath math={"(\\mathbb{R}, \\mathbb{Q})"}/>에는 기저를 명시적으로 적을 방법이
                        없지만{" "}
                        <a href={DIM_R_OVER_Q} target="_blank" rel="noopener noreferrer">다른 논증</a>으로
                        차원이 무한임을 보일 수 있다. 여기서 벡터는 실수, 곧 직관이 1차원이라고 우기는
                        대상이다. 이 예의 요점이 그것이다. 차원은 쌍{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>에 대한 진술이지{" "}
                        <InlineMath math={"\\mathcal{X}"}/> 하나에 대한 진술이 아니다.
                    </p>}
                />
            </Remark>
            <Theorem n="2.31" title={<T en={<><InlineMath math={"n"}/> independent vectors in an <InlineMath math={"n"}/>-dimensional space form a basis</>}
                                        ko={<><InlineMath math={"n"}/>차원 공간에서 독립인 <InlineMath math={"n"}/>개는 기저다</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/> be{" "}
                        <InlineMath math={"n"}/>-dimensional, with <InlineMath math={"n"}/> finite. Then any
                        linearly independent set of <InlineMath math={"n"}/> vectors is a basis.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>이{" "}
                        <InlineMath math={"n"}/>차원이고 <InlineMath math={"n"}/>이 유한하다고 하자. 그러면
                        선형 독립인 <InlineMath math={"n"}/>개짜리 집합은 모두 기저다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            Let <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> be linearly independent.
                            Independence is given, so only the spanning property is left to prove:
                        </p>}
                        ko={<p>
                            <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>을 선형 독립이라 하자. 선형 독립은
                            가정에 있으므로 남은 것은 span 조건뿐이다.
                        </p>}
                    />
                    <BlockMath math={"\\forall x \\in \\mathcal{X}, \\; \\exists\\, \\alpha_1, \\ldots, \\alpha_n \\in \\mathcal{F} \\text{ s.t. } x = \\alpha_1 v^1 + \\cdots + \\alpha_n v^n"}/>
                    <Terms items={[
                        ["x", <T en={<>an arbitrary vector of <InlineMath math={"\\mathcal{X}"}/>, fixed at the start of the argument</>}
                                ko={<><InlineMath math={"\\mathcal{X}"}/>의 임의의 벡터. 논증 시작에서 하나 고정한다</>}/>],
                        ["\\alpha_i", <T en={<>the coefficients whose existence is being claimed</>}
                                        ko={<>존재를 주장하는 계수들</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Fix <InlineMath math={"x"}/>. The set{" "}
                            <InlineMath math={"\\{x, v^1, \\ldots, v^n\\}"}/> has{" "}
                            <InlineMath math={"n+1"}/> elements, so by Definition 2.26 it is dependent:
                            there are <InlineMath math={"\\beta_0, \\ldots, \\beta_n"}/>, not all zero, with
                        </p>}
                        ko={<p>
                            <InlineMath math={"x"}/>를 고정하자. 집합{" "}
                            <InlineMath math={"\\{x, v^1, \\ldots, v^n\\}"}/>은 원소가{" "}
                            <InlineMath math={"n+1"}/>개이므로 Definition 2.26에 의해 종속이다. 즉 전부 0은
                            아닌 <InlineMath math={"\\beta_0, \\ldots, \\beta_n"}/>이 있어서
                        </p>}
                    />
                    <BlockMath math={"\\beta_0 x + \\beta_1 v^1 + \\cdots + \\beta_n v^n = 0"}/>
                    <Terms items={[
                        ["\\beta_0", <T en={<>the coefficient sitting in front of <InlineMath math={"x"}/>, the one everything depends on</>}
                                       ko={<><InlineMath math={"x"}/> 앞에 붙은 계수. 모든 것이 여기에 달려 있다</>}/>],
                        ["\\beta_1, \\ldots, \\beta_n", <T en={<>the coefficients on the independent vectors</>}
                                                          ko={<>독립인 벡터들에 붙은 계수</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>Claim 2.32:</strong> <InlineMath math={"\\beta_0 \\neq 0"}/>. Suppose
                            not. Then <InlineMath math={"\\beta_0 x"}/> drops out of the relation, leaving{" "}
                            <InlineMath math={"\\beta_1 v^1 + \\cdots + \\beta_n v^n = 0"}/> with at least
                            one <InlineMath math={"\\beta_i \\neq 0"}/>, since not all of them were zero.
                            That makes <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> dependent, contradicting
                            the hypothesis that it is independent. So{" "}
                            <InlineMath math={"\\beta_0 = 0"}/> cannot hold.
                        </p>}
                        ko={<p>
                            <strong>Claim 2.32:</strong> <InlineMath math={"\\beta_0 \\neq 0"}/>이다.
                            아니라고 하자. 그러면 <InlineMath math={"\\beta_0 x"}/> 항이 관계식에서 빠지고{" "}
                            <InlineMath math={"\\beta_1 v^1 + \\cdots + \\beta_n v^n = 0"}/>만 남는데, 전부
                            0은 아니었으므로 <InlineMath math={"\\beta_i \\neq 0"}/>인 것이 적어도 하나 있다.
                            그러면 <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>이 종속이 되어 독립이라는
                            가정과 모순이다. 따라서 <InlineMath math={"\\beta_0 = 0"}/>일 수 없다.
                        </p>}
                    />
                    <T en={<p>Now divide by <InlineMath math={"\\beta_0"}/>, which is legal precisely because
                        it is nonzero:</p>}
                       ko={<p>이제 <InlineMath math={"\\beta_0"}/>으로 나눈다. 0이 아니기 때문에 정확히 이
                           단계가 허용된다.</p>}/>
                    <BlockMath math={"\\beta_0 x = -\\beta_1 v^1 - \\cdots - \\beta_n v^n \\quad \\Longrightarrow \\quad x = \\left(\\frac{-\\beta_1}{\\beta_0}\\right) v^1 + \\cdots + \\left(\\frac{-\\beta_n}{\\beta_0}\\right) v^n"}/>
                    <Terms items={[
                        ["-\\beta_i / \\beta_0", <T en={<>the required coefficients <InlineMath math={"\\alpha_i"}/>, which lie in <InlineMath math={"\\mathcal{F}"}/> because a field is closed under division by nonzero elements</>}
                                                  ko={<>구하던 계수 <InlineMath math={"\\alpha_i"}/>. 체는 0이 아닌 원소로 나누는 연산에 닫혀 있으므로 <InlineMath math={"\\mathcal{F}"}/> 안에 있다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Since <InlineMath math={"x"}/> was arbitrary, the set spans{" "}
                            <InlineMath math={"\\mathcal{X}"}/> and is therefore a basis.
                        </p>}
                        ko={<p>
                            <InlineMath math={"x"}/>를 임의로 잡았으므로 이 집합은{" "}
                            <InlineMath math={"\\mathcal{X}"}/>를 span하고, 따라서 기저다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Proposition n="2.33" title={<T en={<>Coordinates are unique</>} ko={<>좌표는 유일하다</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/> have basis{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> and let{" "}
                        <InlineMath math={"x \\in \\mathcal{X}"}/>. Then the coefficients{" "}
                        <InlineMath math={"\\alpha_1, \\ldots, \\alpha_n"}/> with{" "}
                        <InlineMath math={"x = \\alpha_1 v^1 + \\cdots + \\alpha_n v^n"}/> exist and are
                        unique.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>이 기저{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>을 갖고{" "}
                        <InlineMath math={"x \\in \\mathcal{X}"}/>라 하자. 그러면{" "}
                        <InlineMath math={"x = \\alpha_1 v^1 + \\cdots + \\alpha_n v^n"}/>인 계수{" "}
                        <InlineMath math={"\\alpha_1, \\ldots, \\alpha_n"}/>이 존재하고 유일하다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            Existence is the spanning property. For uniqueness, suppose{" "}
                            <InlineMath math={"x"}/> also equals{" "}
                            <InlineMath math={"\\beta_1 v^1 + \\cdots + \\beta_n v^n"}/> and subtract the two
                            expressions, collecting each vector's two coefficients:
                        </p>}
                        ko={<p>
                            존재는 span 조건 그 자체다. 유일성은 <InlineMath math={"x"}/>가{" "}
                            <InlineMath math={"\\beta_1 v^1 + \\cdots + \\beta_n v^n"}/>과도 같다고 두고 두
                            식을 뺀 뒤, 벡터마다 두 계수를 묶으면 된다.
                        </p>}
                    />
                    <BlockMath math={"0 = x - x = (\\alpha_1 v^1 + \\cdots + \\alpha_n v^n) - (\\beta_1 v^1 + \\cdots + \\beta_n v^n) = (\\alpha_1 - \\beta_1) v^1 + \\cdots + (\\alpha_n - \\beta_n) v^n"}/>
                    <Terms items={[
                        ["\\alpha_i, \\beta_i", <T en={<>the coefficients of two candidate expansions of the same vector</>}
                                                 ko={<>같은 벡터를 적은 두 후보 전개의 계수</>}/>],
                        ["\\alpha_i - \\beta_i", <T en={<>the coefficients of a combination that produces the zero vector, obtained by axiom 9</>}
                                                  ko={<>영벡터를 만드는 조합의 계수. axiom 9로 묶어 낸 것이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The basis is linearly independent, so the only combination giving{" "}
                            <InlineMath math={"0"}/> is the trivial one. Hence{" "}
                            <InlineMath math={"\\alpha_i - \\beta_i = 0"}/> for every{" "}
                            <InlineMath math={"i"}/>, that is, the two expansions were the same one.
                            Concretely, in the basis{" "}
                            <InlineMath math={"\\{(1,1)^\\top, (1,-1)^\\top\\}"}/> the vector{" "}
                            <InlineMath math={"(3,1)^\\top"}/> is <InlineMath math={"2"}/> and{" "}
                            <InlineMath math={"1"}/>, and no other pair of numbers will do. This is the result
                            that makes the next section possible: a basis turns a vector into an address, and
                            the address is unambiguous.
                        </p>}
                        ko={<p>
                            기저는 선형 독립이므로 <InlineMath math={"0"}/>을 만드는 조합은 자명한 것뿐이다.
                            따라서 모든 <InlineMath math={"i"}/>에 대해{" "}
                            <InlineMath math={"\\alpha_i - \\beta_i = 0"}/>이고 두 전개는 애초에 같은
                            것이었다. 구체적으로 기저{" "}
                            <InlineMath math={"\\{(1,1)^\\top, (1,-1)^\\top\\}"}/>에서 벡터{" "}
                            <InlineMath math={"(3,1)^\\top"}/>의 계수는 <InlineMath math={"2"}/>와{" "}
                            <InlineMath math={"1"}/>이고, 다른 어떤 수 쌍도 되지 않는다. 다음 절이
                            가능해지는 근거가 이 결과다. 기저는 벡터를 주소로 바꾸고, 그 주소에는 모호함이 없다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Proposition n="2.34" title={<T en={<>An independent set that is too small can grow</>}
                                            ko={<>모자란 독립 집합은 키울 수 있다</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/> be{" "}
                        <InlineMath math={"n"}/>-dimensional and{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/> linearly independent with{" "}
                        <InlineMath math={"k < n"}/>. Then there exists{" "}
                        <InlineMath math={"v^{k+1} \\in \\mathcal{X}"}/> such that{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^{k+1}\\}"}/> is linearly independent.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>이{" "}
                        <InlineMath math={"n"}/>차원이고{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/>이 선형 독립이며{" "}
                        <InlineMath math={"k < n"}/>이라 하자. 그러면{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^{k+1}\\}"}/>이 선형 독립이 되는{" "}
                        <InlineMath math={"v^{k+1} \\in \\mathcal{X}"}/>가 존재한다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            By contradiction. Suppose no such{" "}
                            <InlineMath math={"v^{k+1}"}/> exists. Then for every{" "}
                            <InlineMath math={"x \\in \\mathcal{X}"}/> the set{" "}
                            <InlineMath math={"\\{v^1, \\ldots, v^k, x\\}"}/> is dependent, and Proposition
                            2.14 (b) says the offending vector must be{" "}
                            <InlineMath math={"x"}/> itself, because{" "}
                            <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/> is independent by hypothesis. So{" "}
                            <InlineMath math={"x \\in \\operatorname{span}\\{v^1, \\ldots, v^k\\}"}/>, and
                            since <InlineMath math={"x"}/> was arbitrary,
                        </p>}
                        ko={<p>
                            귀류법으로 간다. 그런 <InlineMath math={"v^{k+1}"}/>이 없다고 하자. 그러면 모든{" "}
                            <InlineMath math={"x \\in \\mathcal{X}"}/>에 대해{" "}
                            <InlineMath math={"\\{v^1, \\ldots, v^k, x\\}"}/>이 종속인데,{" "}
                            <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/>은 가정에 의해 독립이므로
                            Proposition 2.14 (b)는 문제의 벡터가 <InlineMath math={"x"}/> 자신이어야 한다고
                            말한다. 즉{" "}
                            <InlineMath math={"x \\in \\operatorname{span}\\{v^1, \\ldots, v^k\\}"}/>이고,{" "}
                            <InlineMath math={"x"}/>를 임의로 잡았으므로
                        </p>}
                    />
                    <BlockMath math={"\\mathcal{X} \\subset \\operatorname{span}\\{v^1, \\ldots, v^k\\} \\quad \\Longrightarrow \\quad n = \\dim(\\mathcal{X}) \\le \\dim(\\operatorname{span}\\{v^1, \\ldots, v^k\\}) = k"}/>
                    <Terms items={[
                        ["\\mathcal{X}", <T en={<>the whole space, now trapped inside the span of only <InlineMath math={"k"}/> vectors</>}
                                           ko={<>공간 전체. 이제 <InlineMath math={"k"}/>개의 span 안에 갇혔다</>}/>],
                        ["\\dim(\\mathcal{X})", <T en={<>the dimension <InlineMath math={"n"}/>, which cannot exceed the dimension of a space containing it</>}
                                                  ko={<>차원 <InlineMath math={"n"}/>. 자신을 품는 공간의 차원을 넘을 수 없다</>}/>],
                        ["k", <T en={<>the dimension of the span, since those <InlineMath math={"k"}/> vectors are independent and therefore a basis of it</>}
                                ko={<>그 span의 차원. 벡터 <InlineMath math={"k"}/>개가 독립이므로 그것이 span의 기저다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            This contradicts <InlineMath math={"k < n"}/>, so a suitable{" "}
                            <InlineMath math={"v^{k+1}"}/> must exist.
                        </p>}
                        ko={<p>
                            이것은 <InlineMath math={"k < n"}/>과 모순이므로 조건에 맞는{" "}
                            <InlineMath math={"v^{k+1}"}/>이 반드시 존재한다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Corollary n="2.35" title={<T en={<>Every independent set completes to a basis</>}
                                          ko={<>독립 집합은 언제나 기저로 완성된다</>}/>}>
                <T
                    en={<p>
                        In a finite dimensional space, if{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/> is linearly independent and{" "}
                        <InlineMath math={"k < n = \\dim(\\mathcal{X})"}/>, then there exist{" "}
                        <InlineMath math={"v^{k+1}, \\ldots, v^n"}/> making{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> a basis.
                    </p>}
                    ko={<p>
                        유한 차원 공간에서 <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/>이 선형 독립이고{" "}
                        <InlineMath math={"k < n = \\dim(\\mathcal{X})"}/>이면{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>이 기저가 되도록 하는{" "}
                        <InlineMath math={"v^{k+1}, \\ldots, v^n"}/>이 존재한다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            The notes say "previous proposition plus induction", so here is the induction.
                            Let <InlineMath math={"P(m)"}/> be: there is an independent set of size{" "}
                            <InlineMath math={"k + m"}/> containing{" "}
                            <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/>.
                        </p>}
                        ko={<p>
                            원 교재는 "앞 명제와 귀납법"이라고만 적어 두었으니 그 귀납법을 여기 적는다.{" "}
                            <InlineMath math={"P(m)"}/>을 "<InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/>을
                            품는 크기 <InlineMath math={"k + m"}/>의 독립 집합이 존재한다"로 두자.
                        </p>}
                    />
                    <T
                        en={<ul>
                            <li><strong>Base case.</strong> <InlineMath math={"P(0)"}/> is the hypothesis
                                itself.</li>
                            <li><strong>Step.</strong> Assume <InlineMath math={"P(m)"}/> with{" "}
                                <InlineMath math={"k + m < n"}/>. Proposition 2.34 applies to that set and
                                produces one more vector, giving <InlineMath math={"P(m+1)"}/>.</li>
                            <li><strong>Stop.</strong> The step is available while{" "}
                                <InlineMath math={"k + m < n"}/>, so it runs until{" "}
                                <InlineMath math={"m = n - k"}/> and the set has{" "}
                                <InlineMath math={"n"}/> elements. Theorem 2.31 turns that independent set of
                                size <InlineMath math={"n"}/> into a basis.</li>
                        </ul>}
                        ko={<ul>
                            <li><strong>base case.</strong> <InlineMath math={"P(0)"}/>은 가정 그
                                자체다.</li>
                            <li><strong>step.</strong> <InlineMath math={"k + m < n"}/>인 상태에서{" "}
                                <InlineMath math={"P(m)"}/>을 가정하면 Proposition 2.34를 그 집합에 적용해
                                벡터를 하나 더 얻고, 그것이 <InlineMath math={"P(m+1)"}/>이다.</li>
                            <li><strong>멈춤.</strong> step은 <InlineMath math={"k + m < n"}/>인 동안
                                가능하므로 <InlineMath math={"m = n - k"}/>까지 돌고 집합의 원소가{" "}
                                <InlineMath math={"n"}/>개가 된다. 크기가 <InlineMath math={"n"}/>인 그 독립
                                집합을 Theorem 2.31이 기저로 만들어 준다.</li>
                        </ul>}
                    />
                    <T
                        en={<p>
                            In <InlineMath math={"\\mathbb{R}^2"}/> with{" "}
                            <InlineMath math={"\\{(1,1)^\\top\\}"}/>, one round of the step adds any vector
                            off that line, for instance <InlineMath math={"(1,0)^\\top"}/>, and{" "}
                            <InlineMath math={"\\{(1,1)^\\top, (1,0)^\\top\\}"}/> is a basis.
                        </p>}
                        ko={<p>
                            <InlineMath math={"\\mathbb{R}^2"}/>에서{" "}
                            <InlineMath math={"\\{(1,1)^\\top\\}"}/>으로 시작하면 step 한 번이 그 직선 밖의
                            벡터를 하나 더한다. 예를 들어 <InlineMath math={"(1,0)^\\top"}/>을 넣으면{" "}
                            <InlineMath math={"\\{(1,1)^\\top, (1,0)^\\top\\}"}/>이 기저가 된다.
                        </p>}
                    />
                </Proof>
            </Corollary>
            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Representations of Vectors and the Change of Basis Matrix</h2>}
               ko={<h2>벡터의 표현과 기저 변환 행렬</h2>}/>
            <T
                en={<p>
                    Proposition 2.33 says a basis assigns every vector exactly one column of scalars. That
                    column is what a program stores. The rest of this section is about what happens to the
                    column when you change your mind about the basis, which is the same question as what
                    happens to a robot's coordinates when you change frames.
                </p>}
                ko={<p>
                    Proposition 2.33은 기저가 모든 벡터에 스칼라 열 하나씩을 정확히 배정한다고 말한다.
                    프로그램이 들고 있는 것이 그 열이다. 이 절의 나머지는 기저를 다시 고르면 그 열이 어떻게
                    되는가에 대한 이야기이고, 이것은 좌표계를 바꿀 때 로봇의 좌표가 어떻게 되는가와 같은
                    질문이다.
                </p>}
            />
            <Definition n="2.36" title={<T en={<>Representation with respect to a basis</>} ko={<>기저에 대한 표현</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/> have basis{" "}
                        <InlineMath math={"v := \\{v^1, \\ldots, v^n\\}"}/> and write{" "}
                        <InlineMath math={"x = \\alpha_1 v^1 + \\cdots + \\alpha_n v^n"}/>, which Proposition
                        2.33 says can be done in exactly one way. Then
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>이 기저{" "}
                        <InlineMath math={"v := \\{v^1, \\ldots, v^n\\}"}/>을 갖는다고 하고,{" "}
                        <InlineMath math={"x = \\alpha_1 v^1 + \\cdots + \\alpha_n v^n"}/>으로 적자.
                        Proposition 2.33에 의해 이 방법은 정확히 하나뿐이다. 이때
                    </p>}
                />
                <BlockMath math={"[x]_v := \\begin{bmatrix} \\alpha_1 \\\\ \\alpha_2 \\\\ \\vdots \\\\ \\alpha_n \\end{bmatrix} \\in \\mathcal{F}^n"}/>
                <Terms items={[
                    ["x", <T en={<>the abstract vector: a matrix, a polynomial, whatever <InlineMath math={"\\mathcal{X}"}/> contains</>}
                            ko={<>추상적인 벡터. 행렬이든 다항식이든 <InlineMath math={"\\mathcal{X}"}/>가 담은 무엇이든</>}/>],
                    ["v", <T en={<>the chosen basis, an ordered list: reorder it and the column reorders too</>}
                            ko={<>골라 둔 기저. 순서가 있는 목록이며 순서를 바꾸면 열의 순서도 바뀐다</>}/>],
                    ["[x]_v", <T en={<>the representation of <InlineMath math={"x"}/> with respect to <InlineMath math={"v"}/>, an element of <InlineMath math={"\\mathcal{F}^n"}/></>}
                                ko={<><InlineMath math={"v"}/>에 대한 <InlineMath math={"x"}/>의 표현. <InlineMath math={"\\mathcal{F}^n"}/>의 원소다</>}/>],
                    ["\\alpha_i", <T en={<>the unique coefficients supplied by Proposition 2.33</>}
                                    ko={<>Proposition 2.33이 제공하는 유일한 계수</>}/>],
                ]}/>
                <T
                    en={<p>
                        Remark 2.37 in the notes stresses that the definition reads in both directions:{" "}
                        <InlineMath math={"[x]_v = (\\alpha_1, \\ldots, \\alpha_n)^\\top"}/> if and only if{" "}
                        <InlineMath math={"x = \\alpha_1 v^1 + \\cdots + \\alpha_n v^n"}/>. Once the basis is
                        fixed you may work with <InlineMath math={"n"}/>-tuples as if they were the vectors,
                        which is the whole point.
                    </p>}
                    ko={<p>
                        원 교재의 Remark 2.37은 이 정의를 양방향으로 읽어야 한다고 강조한다.{" "}
                        <InlineMath math={"[x]_v = (\\alpha_1, \\ldots, \\alpha_n)^\\top"}/>인 것은{" "}
                        <InlineMath math={"x = \\alpha_1 v^1 + \\cdots + \\alpha_n v^n"}/>인 것과 동치다.
                        기저를 고정하고 나면 <InlineMath math={"n"}/>-튜플을 벡터인 양 다뤄도 되고, 그것이 이
                        정의의 목적 전부다.
                    </p>}
                />
            </Definition>
            <Example title={<T en={<>One arrow, two addresses</>} ko={<>화살표 하나에 주소 둘</>}/>}>
                <T
                    en={<p>
                        Take <InlineMath math={"x = (3,1)^\\top \\in \\mathbb{R}^2"}/> and the two bases{" "}
                        <InlineMath math={"u = \\{e^1, e^2\\}"}/> and{" "}
                        <InlineMath math={"\\bar u = \\{(1,1)^\\top, (1,-1)^\\top\\}"}/>. The first column is
                        read off, the second was computed in the basis example above:
                    </p>}
                    ko={<p>
                        <InlineMath math={"x = (3,1)^\\top \\in \\mathbb{R}^2"}/>과 두 기저{" "}
                        <InlineMath math={"u = \\{e^1, e^2\\}"}/>,{" "}
                        <InlineMath math={"\\bar u = \\{(1,1)^\\top, (1,-1)^\\top\\}"}/>을 잡자. 첫 열은 눈으로
                        읽히고, 둘째 열은 앞의 기저 예에서 계산해 두었다.
                    </p>}
                />
                <BlockMath math={"x = 3e^1 + 1e^2 \\iff [x]_u = \\begin{bmatrix} 3 \\\\ 1 \\end{bmatrix}, \\qquad x = 2\\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix} + 1\\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix} \\iff [x]_{\\bar u} = \\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix}"}/>
                <Terms items={[
                    ["x", <T en={<>one single arrow in the plane; it never moves in this example</>}
                            ko={<>평면 위의 화살표 하나. 이 예에서 그것은 전혀 움직이지 않는다</>}/>],
                    ["[x]_u", <T en={<>its address in the natural basis</>} ko={<>표준 기저에서의 주소</>}/>],
                    ["[x]_{\\bar u}", <T en={<>its address in the tilted basis: a different pair of numbers for the same arrow</>}
                                        ko={<>기울어진 기저에서의 주소. 같은 화살표인데 숫자 쌍이 다르다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Neither column is more correct than the other. The rest of this section is the
                        machine that converts between them.
                    </p>}
                    ko={<p>
                        어느 열이 더 옳은 것은 아니다. 이 절의 나머지는 둘 사이를 오가는 장치에 대한 것이다.
                    </p>}
                />
            </Example>
            <Example n="2.38" title={<T en={<>The same matrix in two bases</>} ko={<>같은 행렬을 두 기저로</>}/>}>
                <T
                    en={<p>
                        Take <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/>,{" "}
                        <InlineMath math={"\\mathcal{X} = \\mathbb{R}^{2 \\times 2}"}/>, and
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/>,{" "}
                        <InlineMath math={"\\mathcal{X} = \\mathbb{R}^{2 \\times 2}"}/>, 그리고
                    </p>}
                />
                <BlockMath math={"x = \\begin{bmatrix} 5 & 3 \\\\ 1 & 4 \\end{bmatrix}, \\qquad w^1 = \\begin{bmatrix} 1 & 0 \\\\ 0 & 0 \\end{bmatrix}, \\; w^2 = \\begin{bmatrix} 0 & 1 \\\\ 1 & 0 \\end{bmatrix}, \\; w^3 = \\begin{bmatrix} 0 & 1 \\\\ -1 & 1 \\end{bmatrix}, \\; w^4 = \\begin{bmatrix} 0 & 0 \\\\ 0 & 1 \\end{bmatrix}"}/>
                <Terms items={[
                    ["x", <T en={<>the vector to be represented, a single element of <InlineMath math={"\\mathbb{R}^{2\\times 2}"}/></>}
                            ko={<>표현할 벡터. <InlineMath math={"\\mathbb{R}^{2\\times 2}"}/>의 원소 하나다</>}/>],
                    ["w^i", <T en={<>the second basis, chosen to be inconvenient enough that inspection is not sufficient</>}
                              ko={<>둘째 기저. 눈으로 읽어 낼 수 없을 만큼은 불편하게 골랐다</>}/>],
                ]}/>
                <T
                    en={<p>
                        In the natural basis <InlineMath math={"v"}/> of matrix units, inspection gives{" "}
                        <InlineMath math={"[x]_v = (5, 3, 1, 4)^\\top"}/>. In the basis{" "}
                        <InlineMath math={"w"}/> we have to solve.
                    </p>}
                    ko={<p>
                        행렬 단위로 이루어진 표준 기저 <InlineMath math={"v"}/>에서는 눈으로 읽어{" "}
                        <InlineMath math={"[x]_v = (5, 3, 1, 4)^\\top"}/>이다. 기저 <InlineMath math={"w"}/>에서는
                        풀어야 한다.
                    </p>}
                />
                <Proof label={t("Solving for the second column", "둘째 열 구하기")}>
                    <BlockMath math={"\\alpha_1 w^1 + \\alpha_2 w^2 + \\alpha_3 w^3 + \\alpha_4 w^4 = \\begin{bmatrix} \\alpha_1 & \\alpha_2 + \\alpha_3 \\\\ \\alpha_2 - \\alpha_3 & \\alpha_3 + \\alpha_4 \\end{bmatrix} = \\begin{bmatrix} 5 & 3 \\\\ 1 & 4 \\end{bmatrix}"}/>
                    <Terms items={[
                        ["\\alpha_i", <T en={<>the four unknown coordinates of <InlineMath math={"x"}/> in the basis <InlineMath math={"w"}/></>}
                                        ko={<>기저 <InlineMath math={"w"}/>에서 <InlineMath math={"x"}/>의 좌표 넷. 아직 모른다</>}/>],
                        ["\\alpha_2 + \\alpha_3", <T en={<>the (1,2) entry, since only <InlineMath math={"w^2"}/> and <InlineMath math={"w^3"}/> have a one there</>}
                                                   ko={<>(1,2) 성분. 그 자리에 1을 가진 것은 <InlineMath math={"w^2"}/>와 <InlineMath math={"w^3"}/>뿐이다</>}/>],
                        ["\\alpha_2 - \\alpha_3", <T en={<>the (2,1) entry, where <InlineMath math={"w^3"}/> contributes <InlineMath math={"-1"}/></>}
                                                   ko={<>(2,1) 성분. 여기서 <InlineMath math={"w^3"}/>은 <InlineMath math={"-1"}/>을 기여한다</>}/>],
                    ]}/>
                    <T en={<p>Four equations in four unknowns, in matrix form:</p>}
                       ko={<p>미지수 넷에 방정식 넷이고, 행렬로 적으면</p>}/>
                    <BlockMath math={"\\begin{bmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 1 & 0 \\\\ 0 & 1 & -1 & 0 \\\\ 0 & 0 & 1 & 1 \\end{bmatrix} \\begin{bmatrix} \\alpha_1 \\\\ \\alpha_2 \\\\ \\alpha_3 \\\\ \\alpha_4 \\end{bmatrix} = \\begin{bmatrix} 5 \\\\ 3 \\\\ 1 \\\\ 4 \\end{bmatrix}"}/>
                    <Terms items={[
                        ["\\text{row } 1", <T en={<><InlineMath math={"\\alpha_1 = 5"}/> immediately</>}
                                             ko={<>곧바로 <InlineMath math={"\\alpha_1 = 5"}/></>}/>],
                        ["\\text{rows } 2, 3", <T en={<><InlineMath math={"\\alpha_2 + \\alpha_3 = 3"}/> and <InlineMath math={"\\alpha_2 - \\alpha_3 = 1"}/>: adding gives <InlineMath math={"\\alpha_2 = 2"}/>, subtracting gives <InlineMath math={"\\alpha_3 = 1"}/></>}
                                                 ko={<><InlineMath math={"\\alpha_2 + \\alpha_3 = 3"}/>과 <InlineMath math={"\\alpha_2 - \\alpha_3 = 1"}/>. 더하면 <InlineMath math={"\\alpha_2 = 2"}/>, 빼면 <InlineMath math={"\\alpha_3 = 1"}/>이다</>}/>],
                        ["\\text{row } 4", <T en={<><InlineMath math={"\\alpha_3 + \\alpha_4 = 4"}/>, so <InlineMath math={"\\alpha_4 = 3"}/></>}
                                             ko={<><InlineMath math={"\\alpha_3 + \\alpha_4 = 4"}/>이므로 <InlineMath math={"\\alpha_4 = 3"}/></>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Therefore{" "}
                            <InlineMath math={"x = 5w^1 + 2w^2 + 1w^3 + 3w^4"}/>, that is,{" "}
                            <InlineMath math={"[x]_w = (5, 2, 1, 3)^\\top"}/>. Same vector, different address,
                            and the check is one substitution: the (2,1) entry is{" "}
                            <InlineMath math={"2 - 1 = 1"}/> as required.
                        </p>}
                        ko={<p>
                            따라서 <InlineMath math={"x = 5w^1 + 2w^2 + 1w^3 + 3w^4"}/>, 곧{" "}
                            <InlineMath math={"[x]_w = (5, 2, 1, 3)^\\top"}/>이다. 같은 벡터, 다른 주소이며
                            검산은 대입 한 번이다. (2,1) 성분이 <InlineMath math={"2 - 1 = 1"}/>로 맞는다.
                        </p>}
                    />
                </Proof>
            </Example>
            <Proposition n="2.39" title={<T en={<>Representation respects the operations</>} ko={<>표현은 연산을 보존한다</>}/>}>
                <BlockMath math={"[x + y]_v = [x]_v + [y]_v, \\qquad [\\alpha x]_v = \\alpha [x]_v"}/>
                <Terms items={[
                    ["x, y", <T en={<>vectors in <InlineMath math={"\\mathcal{X}"}/></>}
                               ko={<><InlineMath math={"\\mathcal{X}"}/>의 벡터</>}/>],
                    ["\\alpha", <T en={<>a scalar in <InlineMath math={"\\mathcal{F}"}/></>}
                                  ko={<><InlineMath math={"\\mathcal{F}"}/>의 스칼라</>}/>],
                    ["[\\,\\cdot\\,]_v", <T en={<>the representation map into <InlineMath math={"\\mathcal{F}^n"}/>, one-to-one and onto once <InlineMath math={"v"}/> is fixed</>}
                                           ko={<><InlineMath math={"\\mathcal{F}^n"}/>으로 가는 표현 사상. <InlineMath math={"v"}/>를 고정하면 일대일 대응이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Both follow from collecting coefficients: if{" "}
                        <InlineMath math={"x = \\sum_i \\alpha_i v^i"}/> and{" "}
                        <InlineMath math={"y = \\sum_i \\beta_i v^i"}/>, then{" "}
                        <InlineMath math={"x + y = \\sum_i (\\alpha_i + \\beta_i) v^i"}/> by axiom 9, and
                        uniqueness says that column is the representation. So adding vectors in{" "}
                        <InlineMath math={"\\mathcal{X}"}/> is the same as adding their columns in{" "}
                        <InlineMath math={"\\mathcal{F}^n"}/>, and once a basis is chosen an{" "}
                        <InlineMath math={"n"}/>-dimensional space is{" "}
                        <InlineMath math={"(\\mathcal{F}^n, \\mathcal{F})"}/> for every purpose in this
                        course.
                    </p>}
                    ko={<p>
                        둘 다 계수를 묶으면 나온다. <InlineMath math={"x = \\sum_i \\alpha_i v^i"}/>,{" "}
                        <InlineMath math={"y = \\sum_i \\beta_i v^i"}/>이면 axiom 9에 의해{" "}
                        <InlineMath math={"x + y = \\sum_i (\\alpha_i + \\beta_i) v^i"}/>이고, 유일성이 그
                        열이 곧 표현이라고 말해 준다. 그래서 <InlineMath math={"\\mathcal{X}"}/>에서 벡터를
                        더하는 일과 <InlineMath math={"\\mathcal{F}^n"}/>에서 열을 더하는 일이 같고, 기저를
                        하나 고르고 나면 <InlineMath math={"n"}/>차원 공간은 이 과목의 모든 목적에서{" "}
                        <InlineMath math={"(\\mathcal{F}^n, \\mathcal{F})"}/>이다.
                    </p>}
                />
            </Proposition>
            <Example title={<T en={<>The change of basis matrix, on numbers first</>}
                              ko={<>기저 변환 행렬, 숫자로 먼저</>}/>}>
                <T
                    en={<p>
                        Stay with <InlineMath math={"u = \\{e^1, e^2\\}"}/> and{" "}
                        <InlineMath math={"\\bar u = \\{(1,1)^\\top, (1,-1)^\\top\\}"}/>. Build two matrices
                        by writing each basis in terms of the other. Writing{" "}
                        <InlineMath math={"\\bar u"}/> in <InlineMath math={"u"}/> is free, because the
                        columns are the vectors themselves:
                    </p>}
                    ko={<p>
                        계속 <InlineMath math={"u = \\{e^1, e^2\\}"}/>과{" "}
                        <InlineMath math={"\\bar u = \\{(1,1)^\\top, (1,-1)^\\top\\}"}/>을 쓴다. 각 기저를
                        다른 기저로 적어 행렬 두 개를 만들자.{" "}
                        <InlineMath math={"\\bar u"}/>를 <InlineMath math={"u"}/>로 적는 일은 거저다. 열이
                        벡터 그 자체이기 때문이다.
                    </p>}
                />
                <BlockMath math={"\\bar P = \\begin{bmatrix} [\\bar u^1]_u & [\\bar u^2]_u \\end{bmatrix} = \\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix}, \\qquad \\bar P \\, [x]_{\\bar u} = \\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix}\\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} 3 \\\\ 1 \\end{bmatrix} = [x]_u"}/>
                <Terms items={[
                    ["\\bar P", <T en={<>the matrix whose <InlineMath math={"i"}/>-th column is <InlineMath math={"[\\bar u^i]_u"}/>: it converts <InlineMath math={"\\bar u"}/>-coordinates into <InlineMath math={"u"}/>-coordinates</>}
                                  ko={<><InlineMath math={"i"}/>번째 열이 <InlineMath math={"[\\bar u^i]_u"}/>인 행렬. <InlineMath math={"\\bar u"}/> 좌표를 <InlineMath math={"u"}/> 좌표로 바꿔 준다</>}/>],
                    ["[x]_{\\bar u} = (2,1)^\\top", <T en={<>the address computed earlier</>} ko={<>앞에서 구해 둔 주소</>}/>],
                    ["[x]_u = (3,1)^\\top", <T en={<>the address we started from: the conversion checks out</>}
                                              ko={<>출발점이던 주소. 변환이 맞아떨어진다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The other direction needs each <InlineMath math={"e^i"}/> written in{" "}
                        <InlineMath math={"\\bar u"}/>, which the basis example already solved:{" "}
                        <InlineMath math={"e^1 = \\tfrac12 (1,1)^\\top + \\tfrac12 (1,-1)^\\top"}/> and{" "}
                        <InlineMath math={"e^2 = \\tfrac12 (1,1)^\\top - \\tfrac12 (1,-1)^\\top"}/>. Stacking
                        those as columns:
                    </p>}
                    ko={<p>
                        반대 방향은 각 <InlineMath math={"e^i"}/>를 <InlineMath math={"\\bar u"}/>로 적어야
                        하는데, 앞의 기저 예에서 이미 풀어 두었다.{" "}
                        <InlineMath math={"e^1 = \\tfrac12 (1,1)^\\top + \\tfrac12 (1,-1)^\\top"}/>,{" "}
                        <InlineMath math={"e^2 = \\tfrac12 (1,1)^\\top - \\tfrac12 (1,-1)^\\top"}/>이다. 이를
                        열로 세우면
                    </p>}
                />
                <BlockMath math={"P = \\begin{bmatrix} [u^1]_{\\bar u} & [u^2]_{\\bar u} \\end{bmatrix} = \\frac{1}{2}\\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix}, \\qquad P \\bar P = \\frac{1}{2}\\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix}\\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix} = \\frac{1}{2}\\begin{bmatrix} 2 & 0 \\\\ 0 & 2 \\end{bmatrix} = I"}/>
                <Terms items={[
                    ["P", <T en={<>the matrix whose <InlineMath math={"i"}/>-th column is <InlineMath math={"[u^i]_{\\bar u}"}/>: it converts <InlineMath math={"u"}/>-coordinates into <InlineMath math={"\\bar u"}/>-coordinates</>}
                            ko={<><InlineMath math={"i"}/>번째 열이 <InlineMath math={"[u^i]_{\\bar u}"}/>인 행렬. <InlineMath math={"u"}/> 좌표를 <InlineMath math={"\\bar u"}/> 좌표로 바꿔 준다</>}/>],
                    ["\\tfrac12", <T en={<>the coefficients found by solving the <InlineMath math={"2 \\times 2"}/> system, not by guessing</>}
                                    ko={<><InlineMath math={"2 \\times 2"}/> 연립방정식을 풀어 얻은 계수. 어림짐작이 아니다</>}/>],
                    ["P \\bar P = I", <T en={<>the two conversions undo each other, which Theorem 2.40 proves in general</>}
                                        ko={<>두 변환이 서로를 되돌린다. Theorem 2.40이 이것을 일반적으로 증명한다</>}/>],
                ]}/>
                <T
                    en={<p>
                        And the promised conversion runs the other way too:{" "}
                        <InlineMath math={"P [x]_u = \\tfrac12 (3+1, 3-1)^\\top = (2,1)^\\top = [x]_{\\bar u}"}/>.
                        Everything below is this computation with the numbers removed.
                    </p>}
                    ko={<p>
                        약속한 변환은 반대 방향으로도 돈다.{" "}
                        <InlineMath math={"P [x]_u = \\tfrac12 (3+1, 3-1)^\\top = (2,1)^\\top = [x]_{\\bar u}"}/>이다.
                        아래 내용은 이 계산에서 숫자만 걷어 낸 것이다.
                    </p>}
                />
            </Example>
            <Theorem n="2.40" title={<T en={<>Change of basis matrix</>} ko={<>기저 변환 행렬</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"u := \\{u^1, \\ldots, u^n\\}"}/> and{" "}
                        <InlineMath math={"\\bar u := \\{\\bar u^1, \\ldots, \\bar u^n\\}"}/> be two bases for{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>. There is an invertible matrix{" "}
                        <InlineMath math={"P"}/> with coefficients in{" "}
                        <InlineMath math={"\\mathcal{F}"}/> such that
                    </p>}
                    ko={<p>
                        <InlineMath math={"u := \\{u^1, \\ldots, u^n\\}"}/>과{" "}
                        <InlineMath math={"\\bar u := \\{\\bar u^1, \\ldots, \\bar u^n\\}"}/>을{" "}
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>의 두 기저라 하자. 그러면 계수가{" "}
                        <InlineMath math={"\\mathcal{F}"}/>에 있는 가역 행렬 <InlineMath math={"P"}/>가 있어서
                    </p>}
                />
                <BlockMath math={"\\forall x \\in \\mathcal{X}, \\quad [x]_{\\bar u} = P\\,[x]_u, \\qquad P = \\begin{bmatrix} P_1 & P_2 & \\cdots & P_n \\end{bmatrix}, \\quad P_i := [u^i]_{\\bar u}"}/>
                <Terms items={[
                    ["u, \\bar u", <T en={<>two bases of the same space, both ordered lists of <InlineMath math={"n"}/> vectors</>}
                                     ko={<>같은 공간의 두 기저. 둘 다 벡터 <InlineMath math={"n"}/>개의 순서 있는 목록이다</>}/>],
                    ["P_i", <T en={<>the <InlineMath math={"i"}/>-th column of <InlineMath math={"P"}/>: the old basis vector <InlineMath math={"u^i"}/> written in the new basis</>}
                              ko={<><InlineMath math={"P"}/>의 <InlineMath math={"i"}/>번째 열. 이전 기저 벡터 <InlineMath math={"u^i"}/>를 새 기저로 적은 것이다</>}/>],
                    ["[x]_u", <T en={<>the coordinates being converted</>} ko={<>변환의 입력이 되는 좌표</>}/>],
                    ["P", <T en={<>the change of basis matrix, which maps <InlineMath math={"u"}/>-coordinates to <InlineMath math={"\\bar u"}/>-coordinates</>}
                            ko={<>기저 변환 행렬. <InlineMath math={"u"}/> 좌표를 <InlineMath math={"\\bar u"}/> 좌표로 옮긴다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Symmetrically there is a matrix <InlineMath math={"\\bar P"}/> with{" "}
                        <InlineMath math={"\\bar P_i := [\\bar u^i]_u"}/> and{" "}
                        <InlineMath math={"[x]_u = \\bar P [x]_{\\bar u}"}/>, and{" "}
                        <InlineMath math={"P \\bar P = \\bar P P = I"}/>. In the <InlineMath math={"2 \\times 2"}/> example just above,{" "}
                        <InlineMath math={"\\bar P"}/> was the one you could read off and{" "}
                        <InlineMath math={"P"}/> was the one you had to solve for.
                    </p>}
                    ko={<p>
                        대칭적으로 <InlineMath math={"\\bar P_i := [\\bar u^i]_u"}/>이고{" "}
                        <InlineMath math={"[x]_u = \\bar P [x]_{\\bar u}"}/>인 행렬{" "}
                        <InlineMath math={"\\bar P"}/>도 있으며{" "}
                        <InlineMath math={"P \\bar P = \\bar P P = I"}/>이다. 바로 위 <InlineMath math={"2 \\times 2"}/> 예에서 눈으로
                        읽히던 쪽이 <InlineMath math={"\\bar P"}/>이고 풀어야 했던 쪽이{" "}
                        <InlineMath math={"P"}/>였다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            Write the same <InlineMath math={"x"}/> in both bases, and name the two columns of
                            coefficients:
                        </p>}
                        ko={<p>
                            같은 <InlineMath math={"x"}/>를 두 기저로 적고, 계수 열 두 개에 이름을 붙인다.
                        </p>}
                    />
                    <BlockMath math={"x = \\sum_{i=1}^{n} \\alpha_i u^i = \\sum_{i=1}^{n} \\bar\\alpha_i \\bar u^i, \\qquad \\alpha := [x]_u, \\quad \\bar\\alpha := [x]_{\\bar u}"}/>
                    <Terms items={[
                        ["\\alpha", <T en={<>the column of coordinates in the basis <InlineMath math={"u"}/></>}
                                      ko={<>기저 <InlineMath math={"u"}/>에서의 좌표 열</>}/>],
                        ["\\bar\\alpha", <T en={<>the column of coordinates in the basis <InlineMath math={"\\bar u"}/></>}
                                           ko={<>기저 <InlineMath math={"\\bar u"}/>에서의 좌표 열</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Apply <InlineMath math={"[\\,\\cdot\\,]_{\\bar u}"}/> to the first expression.
                            Proposition 2.39 lets the representation pass through the sum and through each
                            scalar:
                        </p>}
                        ko={<p>
                            첫 표현에 <InlineMath math={"[\\,\\cdot\\,]_{\\bar u}"}/>를 적용한다. Proposition
                            2.39가 표현을 합 안으로, 그리고 스칼라 하나하나를 지나 통과시켜 준다.
                        </p>}
                    />
                    <BlockMath math={"\\bar\\alpha = [x]_{\\bar u} = \\Big[\\sum_{i=1}^n \\alpha_i u^i\\Big]_{\\bar u} = \\sum_{i=1}^n \\alpha_i \\, [u^i]_{\\bar u} = \\sum_{i=1}^n \\alpha_i P_i = P \\alpha"}/>
                    <Terms items={[
                        ["[u^i]_{\\bar u}", <T en={<>the new-basis coordinates of an old basis vector, which is exactly column <InlineMath math={"i"}/> of <InlineMath math={"P"}/></>}
                                              ko={<>이전 기저 벡터를 새 기저 좌표로 적은 것. 바로 <InlineMath math={"P"}/>의 <InlineMath math={"i"}/>번째 열이다</>}/>],
                        ["\\sum_i \\alpha_i P_i", <T en={<>a linear combination of the columns of <InlineMath math={"P"}/>, which is the definition of the product <InlineMath math={"P\\alpha"}/></>}
                                                   ko={<><InlineMath math={"P"}/>의 열들의 선형 결합. 이것이 곱 <InlineMath math={"P\\alpha"}/>의 정의다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The same computation with the roles exchanged gives{" "}
                            <InlineMath math={"\\alpha = \\bar P \\bar\\alpha"}/>. Substituting each into the
                            other,
                        </p>}
                        ko={<p>
                            역할을 바꿔 같은 계산을 하면{" "}
                            <InlineMath math={"\\alpha = \\bar P \\bar\\alpha"}/>가 나온다. 하나를 다른 하나에
                            대입하면
                        </p>}
                    />
                    <BlockMath math={"\\bar\\alpha = P \\bar P \\bar\\alpha \\ \\text{ and } \\ \\alpha = \\bar P P \\alpha \\quad \\text{for every } x \\quad \\Longrightarrow \\quad P \\bar P = \\bar P P = I"}/>
                    <Terms items={[
                        ["\\text{for every } x", <T en={<>as <InlineMath math={"x"}/> ranges over <InlineMath math={"\\mathcal{X}"}/>, <InlineMath math={"\\alpha"}/> ranges over all of <InlineMath math={"\\mathcal{F}^n"}/>; a matrix that fixes every column vector is the identity</>}
                                                   ko={<><InlineMath math={"x"}/>가 <InlineMath math={"\\mathcal{X}"}/>를 훑으면 <InlineMath math={"\\alpha"}/>가 <InlineMath math={"\\mathcal{F}^n"}/> 전체를 훑는다. 모든 열벡터를 그대로 두는 행렬은 단위 행렬이다</>}/>],
                        ["I", <T en={<>the <InlineMath math={"n \\times n"}/> identity matrix</>}
                                ko={<><InlineMath math={"n \\times n"}/> 단위 행렬</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            So <InlineMath math={"P"}/> is invertible with{" "}
                            <InlineMath math={"P^{-1} = \\bar P"}/>.
                        </p>}
                        ko={<p>
                            따라서 <InlineMath math={"P"}/>는 가역이고{" "}
                            <InlineMath math={"P^{-1} = \\bar P"}/>다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <CanvasFigure
                label={t("One arrow, two addresses: drag the basis and watch only the coordinates move",
                    "화살표는 하나, 주소는 둘이다. 기저를 끌면 좌표만 움직인다")}
                bodyClassName="w-[min(92vw,900px)]"
                modal={<ChangeOfBasisExplorer height={430}/>}>
                <ChangeOfBasisExplorer/>
            </CanvasFigure>
            <Example n="2.41" title={<T en={<>Computing the easy one and inverting</>} ko={<>쉬운 쪽을 구하고 역행렬을 취한다</>}/>}>
                <T
                    en={<p>
                        With <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/> and{" "}
                        <InlineMath math={"\\mathcal{X} = \\mathbb{R}^{2 \\times 2}"}/>, let{" "}
                        <InlineMath math={"u"}/> be the natural basis of matrix units and
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{F} = \\mathbb{R}"}/>,{" "}
                        <InlineMath math={"\\mathcal{X} = \\mathbb{R}^{2 \\times 2}"}/>에서{" "}
                        <InlineMath math={"u"}/>를 행렬 단위로 이루어진 표준 기저라 하고
                    </p>}
                />
                <BlockMath math={"\\bar u = \\left\\{ \\begin{bmatrix} 1 & 0 \\\\ 0 & 0 \\end{bmatrix}, \\; \\begin{bmatrix} 0 & 1 \\\\ 1 & 0 \\end{bmatrix}, \\; \\begin{bmatrix} 0 & 1 \\\\ -1 & 0 \\end{bmatrix}, \\; \\begin{bmatrix} 0 & 0 \\\\ 0 & 1 \\end{bmatrix} \\right\\}"}/>
                <Terms items={[
                    ["\\bar u", <T en={<>the second basis: the symmetric and skew-symmetric pieces of the off-diagonal entries, plus the two diagonal units</>}
                                  ko={<>둘째 기저. 비대각 성분의 대칭 부분과 반대칭 부분, 그리고 대각 단위 둘이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The columns of <InlineMath math={"\\bar P"}/> are{" "}
                        <InlineMath math={"[\\bar u^i]_u"}/>, and each is read off by inspection, which is
                        why we compute this direction first:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\bar P"}/>의 열은 <InlineMath math={"[\\bar u^i]_u"}/>이고 그것들은
                        눈으로 읽힌다. 이 방향을 먼저 계산하는 이유가 그것이다.
                    </p>}
                />
                <BlockMath math={"\\bar P = \\begin{bmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 1 & 0 \\\\ 0 & 1 & -1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}, \\qquad P = \\bar P^{-1} = \\begin{bmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 0.5 & 0.5 & 0 \\\\ 0 & 0.5 & -0.5 & 0 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}"}/>
                <Terms items={[
                    ["\\bar P", <T en={<>columns <InlineMath math={"[\\bar u^i]_u"}/>, obtained by inspection: for instance <InlineMath math={"\\bar u^2"}/> has ones in the two off-diagonal slots, giving the column <InlineMath math={"(0,1,1,0)^\\top"}/></>}
                                  ko={<>열이 <InlineMath math={"[\\bar u^i]_u"}/>인 행렬. 눈으로 읽는다. 예를 들어 <InlineMath math={"\\bar u^2"}/>는 비대각 두 자리가 1이므로 열이 <InlineMath math={"(0,1,1,0)^\\top"}/>이다</>}/>],
                    ["P", <T en={<>columns <InlineMath math={"[u^i]_{\\bar u}"}/>, obtained here by inverting rather than by re-deriving</>}
                            ko={<>열이 <InlineMath math={"[u^i]_{\\bar u}"}/>인 행렬. 여기서는 다시 유도하지 않고 역행렬로 얻었다</>}/>],
                    ["0.5", <T en={<>the only nontrivial block is <InlineMath math={"\\left[\\begin{smallmatrix} 1 & 1 \\\\ 1 & -1 \\end{smallmatrix}\\right]"}/>, whose inverse is <InlineMath math={"\\tfrac12 \\left[\\begin{smallmatrix} 1 & 1 \\\\ 1 & -1 \\end{smallmatrix}\\right]"}/></>}
                              ko={<>자명하지 않은 블록은 <InlineMath math={"\\left[\\begin{smallmatrix} 1 & 1 \\\\ 1 & -1 \\end{smallmatrix}\\right]"}/> 하나뿐이고 그 역행렬이 <InlineMath math={"\\tfrac12 \\left[\\begin{smallmatrix} 1 & 1 \\\\ 1 & -1 \\end{smallmatrix}\\right]"}/>이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Deriving <InlineMath math={"P"}/> directly means writing each{" "}
                        <InlineMath math={"u^i"}/> in the basis <InlineMath math={"\\bar u"}/>. The second one
                        is <InlineMath math={"u^2 = 0.5\\,\\bar u^2 + 0.5\\,\\bar u^3"}/>, since adding the
                        symmetric and skew pieces cancels the lower-left entry and leaves a one upper right.
                        It agrees with the inverse, as Theorem 2.40 promises. In practice you compute
                        whichever of the two is available by inspection and invert.
                    </p>}
                    ko={<p>
                        <InlineMath math={"P"}/>를 직접 유도한다는 것은 각 <InlineMath math={"u^i"}/>를 기저{" "}
                        <InlineMath math={"\\bar u"}/>로 적는다는 뜻이다. 둘째 것은{" "}
                        <InlineMath math={"u^2 = 0.5\\,\\bar u^2 + 0.5\\,\\bar u^3"}/>이다. 대칭 부분과 반대칭
                        부분을 더하면 왼쪽 아래 성분이 상쇄되고 오른쪽 위에 1만 남기 때문이다. 결과는 Theorem
                        2.40이 약속한 대로 역행렬과 일치한다. 실전에서는 둘 중 눈으로 읽히는 쪽을 계산하고
                        역행렬을 취한다.
                    </p>}
                />
            </Example>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Linear Operators and Matrix Representations</h2>}
               ko={<h2>선형 연산자와 행렬 표현</h2>}/>
            <T
                en={<p>
                    A linear operator is defined without mentioning coordinates. A matrix appears only after
                    two bases are chosen, and it is the reason the abstraction was worth the trouble:
                    differentiation of polynomials becomes an array you can multiply.
                </p>}
                ko={<p>
                    선형 연산자는 좌표를 말하지 않고 정의된다. 행렬은 기저 둘을 고른 뒤에야 나타나며, 추상화가
                    수고를 들일 값어치가 있었던 이유가 그것이다. 다항식의 미분이 곱셈할 수 있는 배열이 된다.
                </p>}
            />
            <Definition n="2.42" title={<T en={<>Linear operator</>} ko={<>선형 연산자</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/> and{" "}
                        <InlineMath math={"(\\mathcal{Y}, \\mathcal{F})"}/> be vector spaces over the{" "}
                        <em>same</em> field. Then{" "}
                        <InlineMath math={"\\mathcal{L} : \\mathcal{X} \\to \\mathcal{Y}"}/> is a{" "}
                        <strong>linear operator</strong> if
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F})"}/>과{" "}
                        <InlineMath math={"(\\mathcal{Y}, \\mathcal{F})"}/>이 <em>같은</em> 체 위의 벡터
                        공간이라 하자. 이때{" "}
                        <InlineMath math={"\\mathcal{L} : \\mathcal{X} \\to \\mathcal{Y}"}/>가 다음을
                        만족하면 <strong>선형 연산자</strong>다.
                    </p>}
                />
                <BlockMath math={"\\forall x, z \\in \\mathcal{X}, \\; \\forall \\alpha, \\beta \\in \\mathcal{F}, \\quad \\mathcal{L}(\\alpha x + \\beta z) = \\alpha \\mathcal{L}(x) + \\beta \\mathcal{L}(z)"}/>
                <Terms items={[
                    ["\\mathcal{L}", <T en={<>the operator, a map between vector spaces, defined with no reference to a basis</>}
                                       ko={<>연산자. 벡터 공간 사이의 사상이며 기저를 언급하지 않고 정의된다</>}/>],
                    ["x, z", <T en={<>arbitrary vectors of the domain <InlineMath math={"\\mathcal{X}"}/></>}
                               ko={<>정의역 <InlineMath math={"\\mathcal{X}"}/>의 임의의 벡터</>}/>],
                    ["\\alpha, \\beta", <T en={<>arbitrary scalars of the common field</>}
                                          ko={<>공통 체의 임의의 스칼라</>}/>],
                ]}/>
                <T
                    en={<p>
                        Equivalently, check{" "}
                        <InlineMath math={"\\mathcal{L}(x + z) = \\mathcal{L}(x) + \\mathcal{L}(z)"}/> and{" "}
                        <InlineMath math={"\\mathcal{L}(\\alpha x) = \\alpha \\mathcal{L}(x)"}/> separately.
                    </p>}
                    ko={<p>
                        같은 말로{" "}
                        <InlineMath math={"\\mathcal{L}(x + z) = \\mathcal{L}(x) + \\mathcal{L}(z)"}/>와{" "}
                        <InlineMath math={"\\mathcal{L}(\\alpha x) = \\alpha \\mathcal{L}(x)"}/>를 따로
                        확인해도 된다.
                    </p>}
                />
            </Definition>
            <Example title={<T en={<>One operator that is linear and one that is not</>}
                              ko={<>선형인 연산자 하나, 아닌 것 하나</>}/>}>
                <BlockMath math={"\\mathcal{L}\\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix} := \\begin{bmatrix} 2x_1 \\\\ 3x_2 \\end{bmatrix}, \\qquad \\mathcal{M}\\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix} := \\begin{bmatrix} x_1 + 1 \\\\ x_2 \\end{bmatrix}"}/>
                <Terms items={[
                    ["\\mathcal{L}", <T en={<>a scaling of each axis, which is multiplication by <InlineMath math={"\\operatorname{diag}(2,3)"}/></>}
                                       ko={<>축마다 배율을 주는 연산. <InlineMath math={"\\operatorname{diag}(2,3)"}/>을 곱하는 것과 같다</>}/>],
                    ["\\mathcal{M}", <T en={<>a shift by one unit, the kind of map a "linear" fit often means informally</>}
                                       ko={<>한 칸 평행 이동. 일상적으로 "선형"이라 부르는 맞춤이 흔히 이런 사상이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        <InlineMath math={"\\mathcal{L}"}/> passes:{" "}
                        <InlineMath math={"\\mathcal{L}(\\alpha x + \\beta z)"}/> has first entry{" "}
                        <InlineMath math={"2(\\alpha x_1 + \\beta z_1) = \\alpha(2x_1) + \\beta(2z_1)"}/> and
                        likewise for the second. <InlineMath math={"\\mathcal{M}"}/> fails, and the fastest
                        witness is the origin:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{L}"}/>은 통과한다.{" "}
                        <InlineMath math={"\\mathcal{L}(\\alpha x + \\beta z)"}/>의 첫 성분이{" "}
                        <InlineMath math={"2(\\alpha x_1 + \\beta z_1) = \\alpha(2x_1) + \\beta(2z_1)"}/>이고
                        둘째도 마찬가지다. <InlineMath math={"\\mathcal{M}"}/>은 실패하며, 가장 빠른 증거는
                        원점이다.
                    </p>}
                />
                <BlockMath math={"\\mathcal{M}(0) = \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} \\neq 0 = 0 \\cdot \\mathcal{M}(x)"}/>
                <Terms items={[
                    ["\\mathcal{M}(0)", <T en={<>the image of the zero vector, which any linear operator must send to zero, since <InlineMath math={"\\mathcal{L}(0) = \\mathcal{L}(0 \\cdot 0) = 0 \\cdot \\mathcal{L}(0) = 0"}/></>}
                                          ko={<>영벡터의 상. 선형 연산자라면 반드시 0으로 보내야 한다. <InlineMath math={"\\mathcal{L}(0) = \\mathcal{L}(0 \\cdot 0) = 0 \\cdot \\mathcal{L}(0) = 0"}/>이기 때문이다</>}/>],
                ]}/>
            </Example>
            <Example n="2.43" title={<T en={<>Two linear operators</>} ko={<>선형 연산자 둘</>}/>}>
                <T
                    en={<ul>
                        <li>Let <InlineMath math={"A"}/> be <InlineMath math={"n \\times m"}/> with
                            coefficients in <InlineMath math={"\\mathcal{F}"}/>. Then{" "}
                            <InlineMath math={"\\mathcal{L}(x) := Ax"}/> is linear, since{" "}
                            <InlineMath math={"A(\\alpha x + \\beta z) = \\alpha Ax + \\beta Az"}/> is the
                            distributive law for matrix multiplication.</li>
                        <li>Let <InlineMath math={"\\mathcal{X} = \\mathcal{Y}"}/> be the polynomials of
                            degree <InlineMath math={"\\le 3"}/> over{" "}
                            <InlineMath math={"\\mathbb{R}"}/>. Then{" "}
                            <InlineMath math={"\\mathcal{L}(p) := \\tfrac{d}{dt} p"}/> is linear, because{" "}
                            <InlineMath math={"\\tfrac{d}{dt}(\\alpha p + \\beta q) = \\alpha \\tfrac{d}{dt}p + \\beta \\tfrac{d}{dt}q"}/>.</li>
                    </ul>}
                    ko={<ul>
                        <li><InlineMath math={"A"}/>를 계수가 <InlineMath math={"\\mathcal{F}"}/>에 있는{" "}
                            <InlineMath math={"n \\times m"}/> 행렬이라 하자.{" "}
                            <InlineMath math={"A(\\alpha x + \\beta z) = \\alpha Ax + \\beta Az"}/>가 행렬
                            곱의 분배법칙이므로 <InlineMath math={"\\mathcal{L}(x) := Ax"}/>는 선형이다.</li>
                        <li><InlineMath math={"\\mathcal{X} = \\mathcal{Y}"}/>를{" "}
                            <InlineMath math={"\\mathbb{R}"}/> 위의 차수 <InlineMath math={"\\le 3"}/>인
                            다항식 전체라 하자.{" "}
                            <InlineMath math={"\\tfrac{d}{dt}(\\alpha p + \\beta q) = \\alpha \\tfrac{d}{dt}p + \\beta \\tfrac{d}{dt}q"}/>이므로{" "}
                            <InlineMath math={"\\mathcal{L}(p) := \\tfrac{d}{dt} p"}/>는 선형이다.</li>
                    </ul>}
                />
            </Example>
            <Definition n="2.44" title={<T en={<>Matrix representation of an operator</>} ko={<>연산자의 행렬 표현</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"\\mathcal{X}"}/> and{" "}
                        <InlineMath math={"\\mathcal{Y}"}/> be finite dimensional with bases{" "}
                        <InlineMath math={"u := \\{u^1, \\ldots, u^m\\}"}/> for{" "}
                        <InlineMath math={"\\mathcal{X}"}/> and{" "}
                        <InlineMath math={"v := \\{v^1, \\ldots, v^n\\}"}/> for{" "}
                        <InlineMath math={"\\mathcal{Y}"}/>. A <strong>matrix representation</strong> of{" "}
                        <InlineMath math={"\\mathcal{L}"}/> is an{" "}
                        <InlineMath math={"n \\times m"}/> matrix <InlineMath math={"A"}/> with
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{X}"}/>와 <InlineMath math={"\\mathcal{Y}"}/>가 유한
                        차원이고 기저가 각각{" "}
                        <InlineMath math={"u := \\{u^1, \\ldots, u^m\\}"}/>,{" "}
                        <InlineMath math={"v := \\{v^1, \\ldots, v^n\\}"}/>이라 하자.{" "}
                        <InlineMath math={"\\mathcal{L}"}/>의 <strong>행렬 표현</strong>은 다음을 만족하는{" "}
                        <InlineMath math={"n \\times m"}/> 행렬 <InlineMath math={"A"}/>다.
                    </p>}
                />
                <BlockMath math={"\\forall x \\in \\mathcal{X}, \\quad [\\mathcal{L}(x)]_v = A\\,[x]_u"}/>
                <Terms items={[
                    ["A", <T en={<>the matrix representation, which depends on <InlineMath math={"\\mathcal{L}"}/>, on <InlineMath math={"u"}/>, and on <InlineMath math={"v"}/></>}
                            ko={<>행렬 표현. <InlineMath math={"\\mathcal{L}"}/>과 <InlineMath math={"u"}/>, <InlineMath math={"v"}/>에 함께 의존한다</>}/>],
                    ["[x]_u", <T en={<>the input written as a column of <InlineMath math={"m"}/> scalars</>}
                                ko={<>입력을 스칼라 <InlineMath math={"m"}/>개의 열로 적은 것</>}/>],
                    ["[\\mathcal{L}(x)]_v", <T en={<>the output written as a column of <InlineMath math={"n"}/> scalars</>}
                                              ko={<>출력을 스칼라 <InlineMath math={"n"}/>개의 열로 적은 것</>}/>],
                ]}/>
            </Definition>
            <Theorem n="2.45" title={<T en={<>The columns are the images of the basis vectors</>}
                                        ko={<>열은 기저 벡터의 상이다</>}/>}>
                <T
                    en={<p>
                        With the notation of Definition 2.44,{" "}
                        <InlineMath math={"\\mathcal{L}"}/> has the matrix representation whose{" "}
                        <InlineMath math={"i"}/>-th column is{" "}
                        <InlineMath math={"A_i := [\\mathcal{L}(u^i)]_v"}/> for{" "}
                        <InlineMath math={"1 \\le i \\le m"}/>.
                    </p>}
                    ko={<p>
                        Definition 2.44의 기호를 그대로 쓰면,{" "}
                        <InlineMath math={"\\mathcal{L}"}/>의 행렬 표현은{" "}
                        <InlineMath math={"1 \\le i \\le m"}/>에 대해 <InlineMath math={"i"}/>번째 열이{" "}
                        <InlineMath math={"A_i := [\\mathcal{L}(u^i)]_v"}/>인 행렬이다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            Write <InlineMath math={"x = \\alpha_1 u^1 + \\cdots + \\alpha_m u^m"}/>, so that{" "}
                            <InlineMath math={"[x]_u = (\\alpha_1, \\ldots, \\alpha_m)^\\top"}/>. Linearity
                            moves <InlineMath math={"\\mathcal{L}"}/> inside the sum, and Proposition 2.39
                            moves the representation inside as well:
                        </p>}
                        ko={<p>
                            <InlineMath math={"x = \\alpha_1 u^1 + \\cdots + \\alpha_m u^m"}/>으로 적으면{" "}
                            <InlineMath math={"[x]_u = (\\alpha_1, \\ldots, \\alpha_m)^\\top"}/>이다. 선형성이{" "}
                            <InlineMath math={"\\mathcal{L}"}/>을 합 안으로 넣고, Proposition 2.39가 표현도
                            합 안으로 넣는다.
                        </p>}
                    />
                    <BlockMath math={"[\\mathcal{L}(x)]_v = \\Big[\\sum_{i=1}^m \\alpha_i \\mathcal{L}(u^i)\\Big]_v = \\sum_{i=1}^m \\alpha_i [\\mathcal{L}(u^i)]_v = \\sum_{i=1}^m \\alpha_i A_i = A\\,[x]_u"}/>
                    <Terms items={[
                        ["\\mathcal{L}(u^i)", <T en={<>the image of the <InlineMath math={"i"}/>-th basis vector, an element of <InlineMath math={"\\mathcal{Y}"}/></>}
                                                ko={<><InlineMath math={"i"}/>번째 기저 벡터의 상. <InlineMath math={"\\mathcal{Y}"}/>의 원소다</>}/>],
                        ["A_i", <T en={<>its representation <InlineMath math={"[\\mathcal{L}(u^i)]_v"}/>, a column of <InlineMath math={"n"}/> scalars</>}
                                  ko={<>그 표현 <InlineMath math={"[\\mathcal{L}(u^i)]_v"}/>. 스칼라 <InlineMath math={"n"}/>개의 열이다</>}/>],
                        ["\\sum_i \\alpha_i A_i", <T en={<>a linear combination of the columns of <InlineMath math={"A"}/>, which is the matrix-vector product</>}
                                                   ko={<><InlineMath math={"A"}/>의 열들의 선형 결합. 곧 행렬과 벡터의 곱이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Since <InlineMath math={"x"}/> was arbitrary, this{" "}
                            <InlineMath math={"A"}/> satisfies Definition 2.44. To build a matrix
                            representation you therefore never solve a system: you push each basis vector
                            through <InlineMath math={"\\mathcal{L}"}/> and read off its coordinates.
                        </p>}
                        ko={<p>
                            <InlineMath math={"x"}/>를 임의로 잡았으므로 이 <InlineMath math={"A"}/>는
                            Definition 2.44를 만족한다. 그래서 행렬 표현을 만들 때는 연립방정식을 풀 일이
                            없다. 기저 벡터를 하나씩 <InlineMath math={"\\mathcal{L}"}/>에 통과시키고 좌표를
                            읽으면 된다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Example title={<T en={<>Differentiation on <InlineMath math={"\\mathcal{P}_2(t)"}/>, in full</>}
                              ko={<><InlineMath math={"\\mathcal{P}_2(t)"}/>에서의 미분, 끝까지</>}/>}>
                <T
                    en={<p>
                        Before the <InlineMath math={"4 \\times 4"}/> case, run the smallest one. Let{" "}
                        <InlineMath math={"\\mathcal{X} = \\mathcal{Y} = \\mathcal{P}_2(t)"}/> with{" "}
                        <InlineMath math={"u = v = \\{1, t, t^2\\}"}/> and{" "}
                        <InlineMath math={"\\mathcal{L}(p) = \\tfrac{d}{dt}p"}/>. Theorem 2.45 says to
                        differentiate each basis vector and write down its coordinates:
                    </p>}
                    ko={<p>
                        <InlineMath math={"4 \\times 4"}/> 로 가기 전에 가장 작은 경우를 돌려 보자.{" "}
                        <InlineMath math={"\\mathcal{X} = \\mathcal{Y} = \\mathcal{P}_2(t)"}/>,{" "}
                        <InlineMath math={"u = v = \\{1, t, t^2\\}"}/>,{" "}
                        <InlineMath math={"\\mathcal{L}(p) = \\tfrac{d}{dt}p"}/>라 하자. Theorem 2.45는 기저
                        벡터를 하나씩 미분해 그 좌표를 적으라고 말한다.
                    </p>}
                />
                <BlockMath math={"\\mathcal{L}(1) = 0 \\to \\begin{bmatrix} 0 \\\\ 0 \\\\ 0 \\end{bmatrix}, \\quad \\mathcal{L}(t) = 1 \\to \\begin{bmatrix} 1 \\\\ 0 \\\\ 0 \\end{bmatrix}, \\quad \\mathcal{L}(t^2) = 2t \\to \\begin{bmatrix} 0 \\\\ 2 \\\\ 0 \\end{bmatrix} \\quad \\Longrightarrow \\quad A = \\begin{bmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 2 \\\\ 0 & 0 & 0 \\end{bmatrix}"}/>
                <Terms items={[
                    ["\\mathcal{L}(t^2) = 2t", <T en={<>the image of the third basis vector, whose coordinates in <InlineMath math={"\\{1, t, t^2\\}"}/> are <InlineMath math={"(0, 2, 0)^\\top"}/></>}
                                                 ko={<>셋째 기저 벡터의 상. <InlineMath math={"\\{1, t, t^2\\}"}/>에서 좌표가 <InlineMath math={"(0, 2, 0)^\\top"}/>이다</>}/>],
                    ["A", <T en={<>the three columns placed side by side, in the order of the basis</>}
                            ko={<>세 열을 기저 순서대로 나란히 놓은 것</>}/>],
                ]}/>
                <T
                    en={<p>
                        Test it on <InlineMath math={"p(t) = 4 + 5t + 6t^2"}/>, whose coordinates are{" "}
                        <InlineMath math={"(4, 5, 6)^\\top"}/>:
                    </p>}
                    ko={<p>
                        좌표가 <InlineMath math={"(4, 5, 6)^\\top"}/>인{" "}
                        <InlineMath math={"p(t) = 4 + 5t + 6t^2"}/>로 시험해 보자.
                    </p>}
                />
                <BlockMath math={"A \\begin{bmatrix} 4 \\\\ 5 \\\\ 6 \\end{bmatrix} = \\begin{bmatrix} 5 \\\\ 12 \\\\ 0 \\end{bmatrix} \\quad \\longleftrightarrow \\quad 5 + 12t + 0t^2 = \\tfrac{d}{dt}\\left(4 + 5t + 6t^2\\right)"}/>
                <Terms items={[
                    ["(4,5,6)^\\top", <T en={<>the coordinates of <InlineMath math={"p"}/>, that is, <InlineMath math={"[p]_u"}/></>}
                                        ko={<><InlineMath math={"p"}/>의 좌표, 곧 <InlineMath math={"[p]_u"}/></>}/>],
                    ["(5,12,0)^\\top", <T en={<>the product, whose entries are <InlineMath math={"1 \\cdot 5"}/> and <InlineMath math={"2 \\cdot 6"}/>: exactly the derivative's coefficients</>}
                                         ko={<>곱의 결과. 성분이 <InlineMath math={"1 \\cdot 5"}/>와 <InlineMath math={"2 \\cdot 6"}/>으로, 도함수의 계수 그대로다</>}/>],
                ]}/>
            </Example>
            <Example n="2.46" title={<T en={<>Differentiation as a <InlineMath math={"4 \\times 4"}/> matrix</>} ko={<><InlineMath math={"4 \\times 4"}/> 행렬이 된 미분</>}/>}>
                <T
                    en={<p>
                        The notes run the same computation on{" "}
                        <InlineMath math={"\\mathcal{P}_3(t)"}/> with{" "}
                        <InlineMath math={"u = v = \\{1, t, t^2, t^3\\}"}/>. The images are{" "}
                        <InlineMath math={"\\mathcal{L}(1) = 0"}/>,{" "}
                        <InlineMath math={"\\mathcal{L}(t) = 1"}/>,{" "}
                        <InlineMath math={"\\mathcal{L}(t^2) = 2t"}/>,{" "}
                        <InlineMath math={"\\mathcal{L}(t^3) = 3t^2"}/>, so the same recipe gives one more
                        row and column:
                    </p>}
                    ko={<p>
                        원 교재는 같은 계산을 <InlineMath math={"u = v = \\{1, t, t^2, t^3\\}"}/>인{" "}
                        <InlineMath math={"\\mathcal{P}_3(t)"}/>에서 한다. 상이{" "}
                        <InlineMath math={"\\mathcal{L}(1) = 0"}/>,{" "}
                        <InlineMath math={"\\mathcal{L}(t) = 1"}/>,{" "}
                        <InlineMath math={"\\mathcal{L}(t^2) = 2t"}/>,{" "}
                        <InlineMath math={"\\mathcal{L}(t^3) = 3t^2"}/>이므로 같은 방식으로 행과 열이 하나씩
                        늘어난다.
                    </p>}
                />
                <BlockMath math={"A = \\begin{bmatrix} 0 & 1 & 0 & 0 \\\\ 0 & 0 & 2 & 0 \\\\ 0 & 0 & 0 & 3 \\\\ 0 & 0 & 0 & 0 \\end{bmatrix}, \\qquad A \\begin{bmatrix} a_0 \\\\ a_1 \\\\ a_2 \\\\ a_3 \\end{bmatrix} = \\begin{bmatrix} a_1 \\\\ 2a_2 \\\\ 3a_3 \\\\ 0 \\end{bmatrix}"}/>
                <Terms items={[
                    ["A", <T en={<>the matrix representation of <InlineMath math={"\\tfrac{d}{dt}"}/> in the monomial basis</>}
                            ko={<>단항식 기저에서 <InlineMath math={"\\tfrac{d}{dt}"}/>의 행렬 표현</>}/>],
                    ["a_i", <T en={<>the coefficients of <InlineMath math={"p(t) = a_0 + a_1 t + a_2 t^2 + a_3 t^3"}/>, that is, <InlineMath math={"[p]_u"}/></>}
                              ko={<><InlineMath math={"p(t) = a_0 + a_1 t + a_2 t^2 + a_3 t^3"}/>의 계수. 곧 <InlineMath math={"[p]_u"}/>다</>}/>],
                    ["(a_1, 2a_2, 3a_3, 0)^\\top", <T en={<>the coordinates of <InlineMath math={"\\tfrac{d}{dt}p = a_1 + 2a_2 t + 3a_3 t^2"}/>, so the matrix really does differentiate</>}
                                                     ko={<><InlineMath math={"\\tfrac{d}{dt}p = a_1 + 2a_2 t + 3a_3 t^2"}/>의 좌표. 이 행렬이 실제로 미분을 한다는 뜻이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The last row is zero because no polynomial of degree at most three differentiates to
                        something with a <InlineMath math={"t^3"}/> in it. The matrix is nilpotent:{" "}
                        <InlineMath math={"A^4 = 0"}/>, which is the statement that four derivatives kill a
                        cubic.
                    </p>}
                    ko={<p>
                        마지막 행이 0인 이유는 차수 3 이하의 어떤 다항식도 미분해서{" "}
                        <InlineMath math={"t^3"}/> 항을 만들지 못하기 때문이다. 이 행렬은 nilpotent이고{" "}
                        <InlineMath math={"A^4 = 0"}/>인데, 3차식을 네 번 미분하면 사라진다는 말과 같다.
                    </p>}
                />
            </Example>
            <Example n="2.47" title={<T en={<>The identity operator is the change of basis matrix</>}
                                        ko={<>항등 연산자가 곧 기저 변환 행렬이다</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"\\mathcal{L} = \\mathrm{Id}"}/> on{" "}
                        <InlineMath math={"\\mathcal{X}"}/>, with basis <InlineMath math={"u"}/> on the input
                        side and <InlineMath math={"v"}/> on the output side. Theorem 2.45 gives{" "}
                        <InlineMath math={"A_i = [\\mathrm{Id}(u^i)]_v = [u^i]_v"}/>, which is exactly the
                        recipe for a change of basis matrix in Theorem 2.40. So
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathcal{X}"}/> 위의{" "}
                        <InlineMath math={"\\mathcal{L} = \\mathrm{Id}"}/>를 생각하고 입력 쪽 기저를{" "}
                        <InlineMath math={"u"}/>, 출력 쪽 기저를 <InlineMath math={"v"}/>라 하자. Theorem
                        2.45가 주는{" "}
                        <InlineMath math={"A_i = [\\mathrm{Id}(u^i)]_v = [u^i]_v"}/>는 Theorem 2.40의 기저
                        변환 행렬 만드는 법 그 자체다. 따라서
                    </p>}
                />
                <BlockMath math={"[x]_v = [\\mathrm{Id}(x)]_v = A\\,[x]_u \\quad \\Longrightarrow \\quad A = P, \\text{ the change of basis matrix from } u \\text{ to } v"}/>
                <Terms items={[
                    ["\\mathrm{Id}", <T en={<>the identity operator, <InlineMath math={"\\mathrm{Id}(x) = x"}/> for every <InlineMath math={"x"}/></>}
                                       ko={<>항등 연산자. 모든 <InlineMath math={"x"}/>에 대해 <InlineMath math={"\\mathrm{Id}(x) = x"}/>다</>}/>],
                    ["A = P", <T en={<>its matrix representation, which depends only on the two bases and not on any operator</>}
                                ko={<>그 행렬 표현. 연산자와 무관하게 두 기저에만 의존한다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Remark 2.48 in the notes draws this as two commuting diagrams and observes that when{" "}
                        <InlineMath math={"\\mathcal{X} = \\mathcal{Y}"}/> and{" "}
                        <InlineMath math={"\\mathcal{L} = \\mathrm{Id}"}/> they become the same picture.
                        There is really only one idea in this chapter's last three sections, seen from two
                        directions: change the operator and keep the bases, or keep the operator and change
                        the bases.
                    </p>}
                    ko={<p>
                        원 교재의 Remark 2.48은 이것을 가환 다이어그램 두 개로 그리고,{" "}
                        <InlineMath math={"\\mathcal{X} = \\mathcal{Y}"}/>이고{" "}
                        <InlineMath math={"\\mathcal{L} = \\mathrm{Id}"}/>이면 둘이 같은 그림이 된다고 짚는다.
                        이 장의 마지막 세 절에는 사실 아이디어가 하나뿐이고, 그것을 두 방향에서 볼 뿐이다.
                        기저를 두고 연산자를 바꾸거나, 연산자를 두고 기저를 바꾸는 것이다.
                    </p>}
                />
            </Example>
            <Example n="2.49" title={<T en={<>The same operator in two bases</>} ko={<>같은 연산자를 두 기저로</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"(\\mathcal{X}, \\mathcal{F}) = (\\mathbb{R}^2, \\mathbb{R})"}/> and
                        define <InlineMath math={"L"}/> by{" "}
                        <InlineMath math={"L(e^1) = 3e^1 + 4e^2"}/> and{" "}
                        <InlineMath math={"L(e^2) = -e^1 + 6e^2"}/>. In the natural basis, Theorem 2.45 reads
                        the columns straight off:
                    </p>}
                    ko={<p>
                        <InlineMath math={"(\\mathcal{X}, \\mathcal{F}) = (\\mathbb{R}^2, \\mathbb{R})"}/>에서{" "}
                        <InlineMath math={"L(e^1) = 3e^1 + 4e^2"}/>,{" "}
                        <InlineMath math={"L(e^2) = -e^1 + 6e^2"}/>으로 <InlineMath math={"L"}/>을 정의하자.
                        표준 기저에서는 Theorem 2.45가 열을 그대로 읽어 준다.
                    </p>}
                />
                <BlockMath math={"A = \\begin{bmatrix} 3 & -1 \\\\ 4 & 6 \\end{bmatrix}, \\qquad v^1 = e^1 + e^2, \\quad v^2 = 3e^1 - 4e^2, \\qquad \\bar P = \\begin{bmatrix} 1 & 3 \\\\ 1 & -4 \\end{bmatrix}"}/>
                <Terms items={[
                    ["A", <T en={<>the representation of <InlineMath math={"L"}/> in the natural basis <InlineMath math={"e"}/></>}
                            ko={<>표준 기저 <InlineMath math={"e"}/>에서 <InlineMath math={"L"}/>의 표현</>}/>],
                    ["v^1, v^2", <T en={<>the second basis, given in terms of the natural one</>}
                                   ko={<>둘째 기저. 표준 기저로 적어 두었다</>}/>],
                    ["\\bar P", <T en={<>columns <InlineMath math={"[v^i]_e"}/>, so it converts <InlineMath math={"v"}/>-coordinates into <InlineMath math={"e"}/>-coordinates. This is the one available by inspection</>}
                                  ko={<>열이 <InlineMath math={"[v^i]_e"}/>인 행렬. <InlineMath math={"v"}/> 좌표를 <InlineMath math={"e"}/> 좌표로 바꾼다. 눈으로 읽히는 쪽이 이것이다</>}/>],
                ]}/>
                <Proof label={t("Finding the representation in the second basis", "둘째 기저에서의 표현 구하기")}>
                    <T
                        en={<p>
                            First invert the <InlineMath math={"2 \\times 2"}/> matrix, using{" "}
                            <InlineMath math={"\\det \\bar P = 1 \\cdot (-4) - 3 \\cdot 1 = -7"}/>:
                        </p>}
                        ko={<p>
                            먼저 <InlineMath math={"\\det \\bar P = 1 \\cdot (-4) - 3 \\cdot 1 = -7"}/>을 써서
                            <InlineMath math={"2 \\times 2"}/> 행렬의 역행렬을 구한다.
                        </p>}
                    />
                    <BlockMath math={"P = \\bar P^{-1} = \\frac{1}{-7}\\begin{bmatrix} -4 & -3 \\\\ -1 & 1 \\end{bmatrix} = \\frac{1}{7}\\begin{bmatrix} 4 & 3 \\\\ 1 & -1 \\end{bmatrix}"}/>
                    <Terms items={[
                        ["\\frac{1}{\\det}\\left[\\begin{smallmatrix} d & -b \\\\ -c & a \\end{smallmatrix}\\right]", <T en={<>the inverse of <InlineMath math={"\\left[\\begin{smallmatrix} a & b \\\\ c & d \\end{smallmatrix}\\right]"}/>: swap the diagonal, negate the off-diagonal, divide by the determinant</>}
                                                                                                                      ko={<><InlineMath math={"\\left[\\begin{smallmatrix} a & b \\\\ c & d \\end{smallmatrix}\\right]"}/>의 역행렬. 대각을 바꾸고 비대각의 부호를 뒤집은 뒤 행렬식으로 나눈다</>}/>],
                        ["P", <T en={<>the change of basis matrix from <InlineMath math={"e"}/> to <InlineMath math={"v"}/></>}
                                ko={<><InlineMath math={"e"}/>에서 <InlineMath math={"v"}/>로 가는 기저 변환 행렬</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Now chase the three arrows: take <InlineMath math={"v"}/>-coordinates to{" "}
                            <InlineMath math={"e"}/>-coordinates with{" "}
                            <InlineMath math={"\\bar P = P^{-1}"}/>, apply <InlineMath math={"A"}/> there,
                            and come back with <InlineMath math={"P"}/>.
                        </p>}
                        ko={<p>
                            이제 화살표 셋을 따라간다. <InlineMath math={"\\bar P = P^{-1}"}/>로{" "}
                            <InlineMath math={"v"}/> 좌표를 <InlineMath math={"e"}/> 좌표로 옮기고, 거기서{" "}
                            <InlineMath math={"A"}/>를 적용한 뒤, <InlineMath math={"P"}/>로 돌아온다.
                        </p>}
                    />
                    <BlockMath math={"\\bar A = P A P^{-1} = \\frac{1}{7}\\begin{bmatrix} 4 & 3 \\\\ 1 & -1 \\end{bmatrix} \\begin{bmatrix} 3 & -1 \\\\ 4 & 6 \\end{bmatrix} \\begin{bmatrix} 1 & 3 \\\\ 1 & -4 \\end{bmatrix} = \\frac{1}{7}\\begin{bmatrix} 24 & 14 \\\\ -1 & -7 \\end{bmatrix}\\begin{bmatrix} 1 & 3 \\\\ 1 & -4 \\end{bmatrix} = \\frac{1}{7}\\begin{bmatrix} 38 & 16 \\\\ -8 & 25 \\end{bmatrix}"}/>
                    <Terms items={[
                        ["\\bar A", <T en={<>the representation of the same operator <InlineMath math={"L"}/> in the basis <InlineMath math={"\\{v^1, v^2\\}"}/></>}
                                      ko={<>같은 연산자 <InlineMath math={"L"}/>을 기저 <InlineMath math={"\\{v^1, v^2\\}"}/>로 적은 표현</>}/>],
                        ["\\left[\\begin{smallmatrix} 24 & 14 \\\\ -1 & -7 \\end{smallmatrix}\\right]", <T en={<>the intermediate product <InlineMath math={"7 P A"}/>, kept as a separate step so the arithmetic can be checked</>}
                                                                                                          ko={<>중간 곱 <InlineMath math={"7 P A"}/>. 계산을 확인할 수 있도록 단계를 나눠 두었다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The long way confirms it.{" "}
                            <InlineMath math={"L(v^1) = L(e^1) + L(e^2) = 2e^1 + 10e^2"}/>, and solving{" "}
                            <InlineMath math={"\\bar a_{11} v^1 + \\bar a_{21} v^2 = 2e^1 + 10e^2"}/> gives{" "}
                            <InlineMath math={"\\tfrac{1}{7}(38, -8)^\\top"}/>, the first column of{" "}
                            <InlineMath math={"\\bar A"}/>. Similarly{" "}
                            <InlineMath math={"L(v^2) = 13e^1 - 12e^2"}/> gives{" "}
                            <InlineMath math={"\\tfrac{1}{7}(16, 25)^\\top"}/>.
                        </p>}
                        ko={<p>
                            먼 길로 가도 같은 답이 나온다.{" "}
                            <InlineMath math={"L(v^1) = L(e^1) + L(e^2) = 2e^1 + 10e^2"}/>이고{" "}
                            <InlineMath math={"\\bar a_{11} v^1 + \\bar a_{21} v^2 = 2e^1 + 10e^2"}/>을 풀면{" "}
                            <InlineMath math={"\\tfrac{1}{7}(38, -8)^\\top"}/>, 곧{" "}
                            <InlineMath math={"\\bar A"}/>의 첫째 열이 나온다. 마찬가지로{" "}
                            <InlineMath math={"L(v^2) = 13e^1 - 12e^2"}/>에서{" "}
                            <InlineMath math={"\\tfrac{1}{7}(16, 25)^\\top"}/>이 나온다.
                        </p>}
                    />
                    <T
                        en={<p>
                            Two sign slips in the printed notes are worth knowing about if you are reading
                            along: the boxed result there shows{" "}
                            <InlineMath math={"-38"}/> in the first entry, and the long-way column is printed
                            as <InlineMath math={"\\tfrac17(38, -18)^\\top"}/>. Both disagree with the final
                            matrix printed a page later, which matches the computation above.
                        </p>}
                        ko={<p>
                            원 교재를 나란히 놓고 읽는다면 인쇄된 부호 실수 두 곳을 알아 두는 편이 좋다. 거기
                            결과 상자에는 첫 성분이 <InlineMath math={"-38"}/>로, 먼 길 계산의 열은{" "}
                            <InlineMath math={"\\tfrac17(38, -18)^\\top"}/>로 찍혀 있다. 둘 다 한 쪽 뒤에
                            인쇄된 최종 행렬과 어긋나고, 그 최종 행렬이 위 계산과 일치한다.
                        </p>}
                    />
                </Proof>
            </Example>
            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Eigenvalues, Eigenvectors, and Diagonalization</h2>}
               ko={<h2>고윳값, 고유벡터, 대각화</h2>}/>
            <T
                en={<p>
                    Example 2.49 showed that changing the basis changes the matrix. The obvious question is
                    how simple you can make it, and the answer, when it exists, is a diagonal matrix. The
                    basis that achieves it is made of eigenvectors. One <InlineMath math={"2 \\times 2"}/> example, computed in full,
                    carries the whole section.
                </p>}
                ko={<p>
                    Example 2.49는 기저를 바꾸면 행렬이 바뀐다는 것을 보였다. 그러면 얼마나 단순하게 만들 수
                    있느냐가 자연스러운 질문이고, 답은 그것이 가능할 때 대각 행렬이다. 그렇게 만들어 주는
                    기저가 고유벡터로 이루어진 기저다. 끝까지 계산한 <InlineMath math={"2 \\times 2"}/> 예 하나가 이 절 전체를 떠받친다.
                </p>}
            />
            <Definition n="2.50" title={<T en={<>Eigenvalue and eigenvector</>} ko={<>고윳값과 고유벡터</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"A"}/> be <InlineMath math={"n \\times n"}/> with complex
                        coefficients. A scalar <InlineMath math={"\\lambda \\in \\mathbb{C}"}/> is an{" "}
                        <strong>eigenvalue</strong> of <InlineMath math={"A"}/> if there is a nonzero{" "}
                        <InlineMath math={"v \\in \\mathbb{C}^n"}/> with{" "}
                        <InlineMath math={"Av = \\lambda v"}/>, and any such <InlineMath math={"v"}/> is an{" "}
                        <strong>eigenvector</strong> for <InlineMath math={"\\lambda"}/>. Finding eigenvalues
                        means asking when a nonzero <InlineMath math={"v"}/> exists at all:
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>를 복소수 계수의 <InlineMath math={"n \\times n"}/> 행렬이라
                        하자. <InlineMath math={"Av = \\lambda v"}/>인 0이 아닌{" "}
                        <InlineMath math={"v \\in \\mathbb{C}^n"}/>이 존재하면 스칼라{" "}
                        <InlineMath math={"\\lambda \\in \\mathbb{C}"}/>를 <InlineMath math={"A"}/>의{" "}
                        <strong>고윳값</strong>이라 하고, 그런 <InlineMath math={"v"}/>를{" "}
                        <InlineMath math={"\\lambda"}/>에 딸린 <strong>고유벡터</strong>라 한다. 고윳값을 찾는
                        일은 애초에 0이 아닌 <InlineMath math={"v"}/>가 언제 존재하는지를 묻는 일이다.
                    </p>}
                />
                <BlockMath math={"\\exists\\, v \\neq 0 \\text{ s.t. } Av = \\lambda v \\iff \\exists\\, v \\neq 0 \\text{ s.t. } (\\lambda I - A)v = 0 \\iff \\det(\\lambda I - A) = 0"}/>
                <Terms items={[
                    ["v \\neq 0", <T en={<>the requirement that makes the definition non-trivial: <InlineMath math={"A \\cdot 0 = \\lambda \\cdot 0"}/> holds for every <InlineMath math={"\\lambda"}/></>}
                                    ko={<>정의가 자명해지지 않게 막는 조건. <InlineMath math={"A \\cdot 0 = \\lambda \\cdot 0"}/>은 모든 <InlineMath math={"\\lambda"}/>에서 성립한다</>}/>],
                    ["\\lambda I - A", <T en={<>the matrix whose null space contains the eigenvectors for <InlineMath math={"\\lambda"}/></>}
                                         ko={<>그 null space가 <InlineMath math={"\\lambda"}/>의 고유벡터를 담고 있는 행렬</>}/>],
                    ["\\det(\\lambda I - A) = 0", <T en={<>a square matrix kills a nonzero vector exactly when it is singular, which is exactly when its determinant vanishes</>}
                                                    ko={<>정사각 행렬이 0이 아닌 벡터를 0으로 보내는 것은 비가역일 때뿐이고, 그것은 det가 0일 때다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Eigenvectors are never unique: if <InlineMath math={"Av = \\lambda v"}/> then{" "}
                        <InlineMath math={"A(\\alpha v) = \\lambda(\\alpha v)"}/> for every{" "}
                        <InlineMath math={"\\alpha \\neq 0"}/>. What is unique is the direction, or more
                        precisely the subspace{" "}
                        <InlineMath math={"\\operatorname{null}(A - \\lambda I)"}/>.
                    </p>}
                    ko={<p>
                        고유벡터는 결코 유일하지 않다. <InlineMath math={"Av = \\lambda v"}/>이면 모든{" "}
                        <InlineMath math={"\\alpha \\neq 0"}/>에 대해{" "}
                        <InlineMath math={"A(\\alpha v) = \\lambda(\\alpha v)"}/>이기 때문이다. 유일한 것은
                        방향, 더 정확히는 부분 공간{" "}
                        <InlineMath math={"\\operatorname{null}(A - \\lambda I)"}/>이다.
                    </p>}
                />
            </Definition>
            <Example title={<T en={<>A <InlineMath math={"2 \\times 2"}/> eigen-computation, every step</>} ko={<><InlineMath math={"2 \\times 2"}/> 고유 계산, 모든 단계</>}/>}>
                <T
                    en={<p>
                        Take <InlineMath math={"A = \\left[\\begin{smallmatrix} 2 & 1 \\\\ 1 & 2 \\end{smallmatrix}\\right]"}/>.
                        First the characteristic equation, expanded rather than quoted:
                    </p>}
                    ko={<p>
                        <InlineMath math={"A = \\left[\\begin{smallmatrix} 2 & 1 \\\\ 1 & 2 \\end{smallmatrix}\\right]"}/>을
                        잡자. 먼저 특성 방정식을, 인용하지 말고 전개해서 적는다.
                    </p>}
                />
                <BlockMath math={"\\det(\\lambda I - A) = \\det\\begin{bmatrix} \\lambda - 2 & -1 \\\\ -1 & \\lambda - 2 \\end{bmatrix} = (\\lambda-2)^2 - 1 = \\lambda^2 - 4\\lambda + 3 = (\\lambda - 1)(\\lambda - 3)"}/>
                <Terms items={[
                    ["\\lambda I - A", <T en={<>the matrix whose determinant we need, with <InlineMath math={"\\lambda"}/> on the diagonal and the off-diagonal entries negated</>}
                                         ko={<>행렬식을 구할 대상. 대각에 <InlineMath math={"\\lambda"}/>가 오고 비대각의 부호가 뒤집힌다</>}/>],
                    ["(\\lambda-2)^2 - 1", <T en={<>the <InlineMath math={"2 \\times 2"}/> determinant <InlineMath math={"ad - bc"}/>, where <InlineMath math={"bc = (-1)(-1) = 1"}/></>}
                                             ko={<><InlineMath math={"2 \\times 2"}/> 행렬식 <InlineMath math={"ad - bc"}/>. 여기서 <InlineMath math={"bc = (-1)(-1) = 1"}/>이다</>}/>],
                    ["(\\lambda - 1)(\\lambda - 3)", <T en={<>the factored form, so the eigenvalues are <InlineMath math={"\\lambda_1 = 3"}/> and <InlineMath math={"\\lambda_2 = 1"}/></>}
                                                      ko={<>인수분해한 꼴. 고윳값은 <InlineMath math={"\\lambda_1 = 3"}/>과 <InlineMath math={"\\lambda_2 = 1"}/>이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Now the eigenvectors, one linear system per eigenvalue. Both matrices below are
                        singular by construction, so each system has a line of solutions:
                    </p>}
                    ko={<p>
                        다음은 고유벡터이고, 고윳값마다 연립방정식 하나씩이다. 아래 두 행렬은 만들어질 때부터
                        비가역이라 각 방정식의 해가 직선을 이룬다.
                    </p>}
                />
                <BlockMath math={"(A - 3I)v = \\begin{bmatrix} -1 & 1 \\\\ 1 & -1 \\end{bmatrix} v = 0 \\implies v^1 = \\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix}, \\qquad (A - 1I)v = \\begin{bmatrix} 1 & 1 \\\\ 1 & 1 \\end{bmatrix} v = 0 \\implies v^2 = \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix}"}/>
                <Terms items={[
                    ["A - 3I", <T en={<>its first row reads <InlineMath math={"-v_1 + v_2 = 0"}/>, so <InlineMath math={"v_1 = v_2"}/> and any nonzero multiple of <InlineMath math={"(1,1)^\\top"}/> works</>}
                                 ko={<>첫 행이 <InlineMath math={"-v_1 + v_2 = 0"}/>이므로 <InlineMath math={"v_1 = v_2"}/>이고 <InlineMath math={"(1,1)^\\top"}/>의 0이 아닌 배수는 모두 해다</>}/>],
                    ["A - 1I", <T en={<>its first row reads <InlineMath math={"v_1 + v_2 = 0"}/>, so <InlineMath math={"v_1 = -v_2"}/></>}
                                 ko={<>첫 행이 <InlineMath math={"v_1 + v_2 = 0"}/>이므로 <InlineMath math={"v_1 = -v_2"}/>이다</>}/>],
                    ["v^1, v^2", <T en={<>the two eigenvectors, which are the very basis <InlineMath math={"\\bar u"}/> used in the change of basis example</>}
                                   ko={<>두 고유벡터. 기저 변환 예에서 쓴 바로 그 기저 <InlineMath math={"\\bar u"}/>다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Verify both:{" "}
                        <InlineMath math={"A(1,1)^\\top = (3,3)^\\top = 3(1,1)^\\top"}/> and{" "}
                        <InlineMath math={"A(1,-1)^\\top = (1,-1)^\\top"}/>. Two distinct eigenvalues, two
                        independent directions. The diagonalization of this same matrix is finished under
                        Theorem 2.57.
                    </p>}
                    ko={<p>
                        둘 다 검산하면{" "}
                        <InlineMath math={"A(1,1)^\\top = (3,3)^\\top = 3(1,1)^\\top"}/>이고{" "}
                        <InlineMath math={"A(1,-1)^\\top = (1,-1)^\\top"}/>이다. 서로 다른 고윳값 둘에 독립인
                        방향 둘이다. 같은 행렬의 대각화는 Theorem 2.57에서 끝맺는다.
                    </p>}
                />
            </Example>
            <Example n="2.51" title={<T en={<>A real matrix with no real eigen-direction</>}
                                        ko={<>실수 고유 방향이 없는 실행렬</>}/>}>
                <BlockMath math={"A = \\begin{bmatrix} 0 & 1 \\\\ -1 & 0 \\end{bmatrix} \\implies \\det(\\lambda I - A) = \\det\\begin{bmatrix} \\lambda & -1 \\\\ 1 & \\lambda \\end{bmatrix} = \\lambda^2 + 1 = 0 \\implies \\lambda_1 = j, \\; \\lambda_2 = -j"}/>
                <Terms items={[
                    ["A", <T en={<>rotation by 90 degrees, which maps no real direction to a multiple of itself</>}
                            ko={<>90도 회전. 어떤 실수 방향도 자기 자신의 배수로 보내지 않는다</>}/>],
                    ["\\lambda^2 + 1", <T en={<>the characteristic polynomial: <InlineMath math={"\\lambda \\cdot \\lambda - (-1)(1)"}/>, whose roots are not real</>}
                                         ko={<>특성 다항식. <InlineMath math={"\\lambda \\cdot \\lambda - (-1)(1)"}/>이고 근이 실수가 아니다</>}/>],
                    ["j", <T en={<>the imaginary unit, <InlineMath math={"j^2 = -1"}/></>}
                            ko={<>허수 단위. <InlineMath math={"j^2 = -1"}/>이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        For <InlineMath math={"\\lambda_1 = j"}/> the system{" "}
                        <InlineMath math={"(A - jI)v = 0"}/> has first row{" "}
                        <InlineMath math={"-j v_1 + v_2 = 0"}/>, so{" "}
                        <InlineMath math={"v_2 = j v_1"}/> and{" "}
                        <InlineMath math={"v^1 = (1, j)^\\top"}/>. Check:{" "}
                        <InlineMath math={"A(1,j)^\\top = (j, -1)^\\top"}/> and{" "}
                        <InlineMath math={"j (1,j)^\\top = (j, j^2)^\\top = (j, -1)^\\top"}/>. Similarly{" "}
                        <InlineMath math={"v^2 = (1, -j)^\\top"}/>. Both the eigenvalues and the eigenvectors
                        come in complex conjugate pairs, which is why Definition 2.50 works over{" "}
                        <InlineMath math={"\\mathbb{C}"}/> even when <InlineMath math={"A"}/> is real.
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\lambda_1 = j"}/>에 대해 방정식{" "}
                        <InlineMath math={"(A - jI)v = 0"}/>의 첫 행은{" "}
                        <InlineMath math={"-j v_1 + v_2 = 0"}/>이므로{" "}
                        <InlineMath math={"v_2 = j v_1"}/>이고{" "}
                        <InlineMath math={"v^1 = (1, j)^\\top"}/>이다. 검산하면{" "}
                        <InlineMath math={"A(1,j)^\\top = (j, -1)^\\top"}/>,{" "}
                        <InlineMath math={"j (1,j)^\\top = (j, j^2)^\\top = (j, -1)^\\top"}/>로 맞는다.
                        마찬가지로 <InlineMath math={"v^2 = (1, -j)^\\top"}/>이다. 고윳값도 고유벡터도 켤레
                        쌍으로 나오고, <InlineMath math={"A"}/>가 실행렬이어도 Definition 2.50이{" "}
                        <InlineMath math={"\\mathbb{C}"}/> 위에서 정의된 이유가 이것이다.
                    </p>}
                />
            </Example>
            <CanvasFigure
                label={t("Sweep the circle: the angles where the image lands back on the arrow are the eigen-directions, and the stretch factor there is the eigenvalue",
                    "원을 한 바퀴 돌려 보자. 상이 다시 화살표 위로 포개지는 각이 고유 방향이고, 그때의 배율이 고윳값이다")}
                bodyClassName="w-[min(92vw,900px)]"
                modal={<EigenvectorHunt height={430}/>}>
                <EigenvectorHunt/>
            </CanvasFigure>
            <Remark title={<T en={<>What the figure cannot show</>} ko={<>그림이 보여 줄 수 없는 것</>}/>}>
                <T
                    en={<p>
                        The sweep only visits real directions, so the rotation preset finds nothing. That is
                        the honest picture of Example 2.51: the eigenvectors exist, but they live in{" "}
                        <InlineMath math={"\\mathbb{C}^2"}/> and no arrow in the real plane points along
                        them. The symmetric preset is the worked example above, and its two eigen-directions
                        appear at 45 and 135 degrees.
                    </p>}
                    ko={<p>
                        한 바퀴 도는 동안 훑는 것은 실수 방향뿐이라 회전 preset에서는 아무것도 잡히지 않는다.
                        그것이 Example 2.51의 정직한 그림이다. 고유벡터는 존재하지만{" "}
                        <InlineMath math={"\\mathbb{C}^2"}/> 안에 살고, 실평면의 어떤 화살표도 그 방향을
                        가리키지 않는다. 대칭 preset이 위에서 손으로 푼 예이고, 두 고유 방향이 45도와
                        135도에서 나타난다.
                    </p>}
                />
            </Remark>
            <Definition n="2.52" title={<T en={<>Characteristic polynomial and multiplicities</>}
                                          ko={<>특성 다항식과 중복도</>}/>}>
                <BlockMath math={"\\Delta(\\lambda) := \\det(\\lambda I - A) = (\\lambda - \\lambda_1)^{m_1} (\\lambda - \\lambda_2)^{m_2} \\cdots (\\lambda - \\lambda_p)^{m_p}, \\qquad \\eta_i := \\dim \\operatorname{null}(A - \\lambda_i I)"}/>
                <Terms items={[
                    ["\\Delta(\\lambda)", <T en={<>the characteristic polynomial; <InlineMath math={"\\Delta(\\lambda) = 0"}/> is the characteristic equation</>}
                                            ko={<>특성 다항식. <InlineMath math={"\\Delta(\\lambda) = 0"}/>이 특성 방정식이다</>}/>],
                    ["\\lambda_i", <T en={<>the <InlineMath math={"p"}/> distinct roots, guaranteed to exist in <InlineMath math={"\\mathbb{C}"}/> by the fundamental theorem of algebra</>}
                                     ko={<>서로 다른 근 <InlineMath math={"p"}/>개. 대수학의 기본 정리가 <InlineMath math={"\\mathbb{C}"}/> 안에서의 존재를 보장한다</>}/>],
                    ["m_i", <T en={<>the algebraic multiplicity of <InlineMath math={"\\lambda_i"}/>, with <InlineMath math={"m_1 + \\cdots + m_p = n"}/></>}
                              ko={<><InlineMath math={"\\lambda_i"}/>의 대수적 중복도. <InlineMath math={"m_1 + \\cdots + m_p = n"}/>이다</>}/>],
                    ["\\eta_i", <T en={<>the geometric multiplicity: how many independent eigenvectors <InlineMath math={"\\lambda_i"}/> actually supplies</>}
                                  ko={<>기하적 중복도. <InlineMath math={"\\lambda_i"}/>가 실제로 내놓는 독립인 고유벡터의 개수다</>}/>],
                    ["\\operatorname{null}(A - \\lambda_i I)", <T en={<>the null space, a subspace of <InlineMath math={"\\mathbb{C}^n"}/>, whose nonzero elements are the eigenvectors</>}
                                                                ko={<>null space. <InlineMath math={"\\mathbb{C}^n"}/>의 부분 공간이고 그 안의 0이 아닌 원소가 고유벡터다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Three quick instances. For{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 2 & 1 \\\\ 1 & 2 \\end{smallmatrix}\\right]"}/>,{" "}
                        <InlineMath math={"m_1 = m_2 = 1"}/> and{" "}
                        <InlineMath math={"\\eta_1 = \\eta_2 = 1"}/>. For{" "}
                        <InlineMath math={"I"}/>, <InlineMath math={"\\Delta(\\lambda) = (\\lambda-1)^2"}/>,
                        so <InlineMath math={"m_1 = 2"}/>, and{" "}
                        <InlineMath math={"\\operatorname{null}(I - I) = \\mathbb{C}^2"}/> gives{" "}
                        <InlineMath math={"\\eta_1 = 2"}/>. For the shear{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 1 & 1 \\\\ 0 & 1 \\end{smallmatrix}\\right]"}/>,
                        also <InlineMath math={"m_1 = 2"}/>, but{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 0 & 1 \\\\ 0 & 0 \\end{smallmatrix}\\right] v = 0"}/> forces{" "}
                        <InlineMath math={"v_2 = 0"}/>, leaving a single direction and{" "}
                        <InlineMath math={"\\eta_1 = 1"}/>. That gap is what Theorem 2.57 will run into.
                    </p>}
                    ko={<p>
                        빠른 예 셋.{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 2 & 1 \\\\ 1 & 2 \\end{smallmatrix}\\right]"}/>은{" "}
                        <InlineMath math={"m_1 = m_2 = 1"}/>,{" "}
                        <InlineMath math={"\\eta_1 = \\eta_2 = 1"}/>이다. <InlineMath math={"I"}/>는{" "}
                        <InlineMath math={"\\Delta(\\lambda) = (\\lambda-1)^2"}/>이라{" "}
                        <InlineMath math={"m_1 = 2"}/>이고,{" "}
                        <InlineMath math={"\\operatorname{null}(I - I) = \\mathbb{C}^2"}/>이므로{" "}
                        <InlineMath math={"\\eta_1 = 2"}/>다. 전단 행렬{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 1 & 1 \\\\ 0 & 1 \\end{smallmatrix}\\right]"}/>도{" "}
                        <InlineMath math={"m_1 = 2"}/>이지만{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 0 & 1 \\\\ 0 & 0 \\end{smallmatrix}\\right] v = 0"}/>이{" "}
                        <InlineMath math={"v_2 = 0"}/>을 강제해 방향이 하나만 남고{" "}
                        <InlineMath math={"\\eta_1 = 1"}/>이다. 이 간격이 Theorem 2.57에서 문제가 된다.
                    </p>}
                />
            </Definition>
            <Theorem n="2.53" title={<T en={<>Distinct eigenvalues give independent eigenvectors</>}
                                        ko={<>고윳값이 서로 다르면 고유벡터는 독립이다</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"A"}/> be <InlineMath math={"n \\times n"}/> over{" "}
                        <InlineMath math={"\\mathbb{R}"}/> or <InlineMath math={"\\mathbb{C}"}/>. If the
                        eigenvalues <InlineMath math={"\\{\\lambda_1, \\ldots, \\lambda_n\\}"}/> are distinct,
                        then eigenvectors <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> for them are linearly
                        independent in{" "}
                        <InlineMath math={"(\\mathbb{C}^n, \\mathbb{C})"}/>. Remark 2.54 restates this:
                        distinct eigenvalues make <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> a basis, by
                        Theorem 2.31.
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>를 <InlineMath math={"\\mathbb{R}"}/> 또는{" "}
                        <InlineMath math={"\\mathbb{C}"}/> 위의 <InlineMath math={"n \\times n"}/> 행렬이라
                        하자. 고윳값 <InlineMath math={"\\{\\lambda_1, \\ldots, \\lambda_n\\}"}/>이 서로
                        다르면 그에 딸린 고유벡터{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>은{" "}
                        <InlineMath math={"(\\mathbb{C}^n, \\mathbb{C})"}/>에서 선형 독립이다. Remark 2.54는
                        이것을 다시 말한다. 고윳값이 서로 다르면 Theorem 2.31에 의해{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>이 기저가 된다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            We prove the contrapositive: if{" "}
                            <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> is dependent, some eigenvalue
                            repeats. Dependence supplies coefficients, not all zero, and after relabeling we
                            may assume <InlineMath math={"\\alpha_1 \\neq 0"}/>:
                        </p>}
                        ko={<p>
                            대우를 증명한다. <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>이 종속이면 고윳값
                            중에 겹치는 것이 있다는 쪽이다. 종속이면 전부 0은 아닌 계수가 나오고, 번호를 다시
                            붙여 <InlineMath math={"\\alpha_1 \\neq 0"}/>이라 두어도 된다.
                        </p>}
                    />
                    <BlockMath math={"\\alpha_1 v^1 + \\alpha_2 v^2 + \\cdots + \\alpha_n v^n = 0"}/>
                    <Terms items={[
                        ["\\alpha_i", <T en={<>the coefficients supplied by dependence, not all zero</>}
                                        ko={<>종속이라는 사실이 제공하는 계수. 전부 0은 아니다</>}/>],
                        ["\\alpha_1 \\neq 0", <T en={<>arranged by reordering the eigenvalue and eigenvector pairs, which costs nothing</>}
                                                ko={<>고윳값과 고유벡터 쌍의 순서를 바꿔 맞춘 것. 아무 대가도 없다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The engine of the proof is a single identity. For any{" "}
                            <InlineMath math={"i"}/> and <InlineMath math={"j"}/>,
                        </p>}
                        ko={<p>
                            이 증명의 동력은 항등식 하나다. 임의의 <InlineMath math={"i"}/>,{" "}
                            <InlineMath math={"j"}/>에 대해
                        </p>}
                    />
                    <BlockMath math={"(A - \\lambda_j I)v^i = Av^i - \\lambda_j v^i = \\lambda_i v^i - \\lambda_j v^i = (\\lambda_i - \\lambda_j)v^i"}/>
                    <Terms items={[
                        ["(A - \\lambda_j I)", <T en={<>the factor that annihilates eigenvectors of <InlineMath math={"\\lambda_j"}/> and merely rescales the others</>}
                                                 ko={<><InlineMath math={"\\lambda_j"}/>의 고유벡터를 0으로 만들고 나머지는 배율만 바꾸는 인수</>}/>],
                        ["Av^i = \\lambda_i v^i", <T en={<>the defining property of <InlineMath math={"v^i"}/>, used in the middle step</>}
                                                   ko={<><InlineMath math={"v^i"}/>의 정의. 가운데 단계에서 쓴다</>}/>],
                        ["\\lambda_i - \\lambda_j", <T en={<>the resulting scale factor, zero exactly when the two eigenvalues coincide</>}
                                                      ko={<>그 결과로 붙는 배율. 두 고윳값이 같을 때만 0이 된다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The notes call the next line an easy exercise, so here it is. Applying the
                            factors one after another and pulling out one scalar each time gives, by
                            induction on the number of factors,
                        </p>}
                        ko={<p>
                            원 교재는 다음 줄을 쉬운 연습 문제라고 넘기니 여기 적는다. 인수를 하나씩 차례로
                            적용하면서 매번 스칼라를 하나씩 빼내면, 인수 개수에 대한 귀납법으로
                        </p>}
                    />
                    <BlockMath math={"(A - \\lambda_2 I)\\cdots(A - \\lambda_n I)v^i = (\\lambda_i - \\lambda_2)\\cdots(\\lambda_i - \\lambda_n)\\, v^i"}/>
                    <Terms items={[
                        ["(A - \\lambda_n I)v^i", <T en={<>the innermost application, which by the identity above returns <InlineMath math={"(\\lambda_i - \\lambda_n)v^i"}/>: still a multiple of <InlineMath math={"v^i"}/></>}
                                                    ko={<>가장 안쪽 적용. 위 항등식에 의해 <InlineMath math={"(\\lambda_i - \\lambda_n)v^i"}/>를 돌려주며 여전히 <InlineMath math={"v^i"}/>의 배수다</>}/>],
                        ["\\text{induction}", <T en={<>each remaining factor meets a scalar multiple of <InlineMath math={"v^i"}/> again, so the scalars simply accumulate in front</>}
                                                ko={<>남은 인수마다 다시 <InlineMath math={"v^i"}/>의 스칼라배를 만나므로 스칼라가 앞에 차곡차곡 쌓인다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Apply that whole product to the dependence relation. Every term with{" "}
                            <InlineMath math={"i \\ge 2"}/> dies, because its own factor{" "}
                            <InlineMath math={"(\\lambda_i - \\lambda_i)"}/> appears in the product:
                        </p>}
                        ko={<p>
                            그 곱 전체를 종속 관계식에 적용한다. <InlineMath math={"i \\ge 2"}/>인 항은 곱 안에
                            자기 인수 <InlineMath math={"(\\lambda_i - \\lambda_i)"}/>가 들어 있으므로 전부
                            죽는다.
                        </p>}
                    />
                    <BlockMath math={"0 = \\prod_{j=2}^{n}(A - \\lambda_j I) \\Big(\\sum_{i=1}^{n} \\alpha_i v^i\\Big) = \\alpha_1 (\\lambda_1 - \\lambda_2)(\\lambda_1 - \\lambda_3)\\cdots(\\lambda_1 - \\lambda_n)\\, v^1"}/>
                    <Terms items={[
                        ["\\prod_{j=2}^n (A - \\lambda_j I)", <T en={<>the product of the <InlineMath math={"n-1"}/> factors, applied to both sides of a relation that already equals zero</>}
                                                                ko={<>인수 <InlineMath math={"n-1"}/>개의 곱. 이미 0인 관계식의 양변에 적용한다</>}/>],
                        ["\\alpha_1", <T en={<>nonzero by the relabeling</>} ko={<>번호를 다시 붙여 0이 아니게 만든 계수</>}/>],
                        ["v^1", <T en={<>nonzero by the definition of an eigenvector</>}
                                  ko={<>고유벡터의 정의에 의해 0이 아닌 벡터</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            A scalar times a nonzero vector is zero only if the scalar is zero. Since{" "}
                            <InlineMath math={"\\alpha_1 \\neq 0"}/> and{" "}
                            <InlineMath math={"v^1 \\neq 0"}/>, some factor{" "}
                            <InlineMath math={"(\\lambda_1 - \\lambda_k)"}/> with{" "}
                            <InlineMath math={"k \\ge 2"}/> must vanish, that is,{" "}
                            <InlineMath math={"\\lambda_1 = \\lambda_k"}/>. The eigenvalues are not distinct,
                            which is the contrapositive we wanted.
                        </p>}
                        ko={<p>
                            스칼라에 0이 아닌 벡터를 곱해 0이 되려면 스칼라가 0이어야 한다.{" "}
                            <InlineMath math={"\\alpha_1 \\neq 0"}/>이고{" "}
                            <InlineMath math={"v^1 \\neq 0"}/>이므로 <InlineMath math={"k \\ge 2"}/>인 어떤{" "}
                            <InlineMath math={"(\\lambda_1 - \\lambda_k)"}/>가 0이어야 하고, 곧{" "}
                            <InlineMath math={"\\lambda_1 = \\lambda_k"}/>다. 고윳값이 서로 다르지 않다는
                            뜻이고, 그것이 우리가 노린 대우다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Definition n="2.55" title={<T en={<>Similar matrices</>} ko={<>닮은 행렬</>}/>}>
                <T
                    en={<p>
                        Two <InlineMath math={"n \\times n"}/> matrices <InlineMath math={"A"}/> and{" "}
                        <InlineMath math={"B"}/> are <strong>similar</strong> if there is an invertible{" "}
                        <InlineMath math={"P"}/> with{" "}
                        <InlineMath math={"B = P \\cdot A \\cdot P^{-1}"}/>, and{" "}
                        <InlineMath math={"P"}/> is called a <strong>similarity matrix</strong>. By Example
                        2.49 that is the same as saying <InlineMath math={"A"}/> and{" "}
                        <InlineMath math={"B"}/> represent the same operator in two bases. Concretely,{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 3 & -1 \\\\ 4 & 6 \\end{smallmatrix}\\right]"}/> and{" "}
                        <InlineMath math={"\\tfrac17\\left[\\begin{smallmatrix} 38 & 16 \\\\ -8 & 25 \\end{smallmatrix}\\right]"}/> are
                        similar, with the <InlineMath math={"P"}/> computed there.
                    </p>}
                    ko={<p>
                        <InlineMath math={"n \\times n"}/> 행렬 <InlineMath math={"A"}/>와{" "}
                        <InlineMath math={"B"}/>에 대해 <InlineMath math={"B = P \\cdot A \\cdot P^{-1}"}/>인
                        가역 행렬 <InlineMath math={"P"}/>가 있으면 둘이 <strong>닮았다</strong>고 하고,{" "}
                        <InlineMath math={"P"}/>를 <strong>닮음 행렬</strong>이라 한다. Example 2.49에 비추어
                        보면 같은 연산자를 두 기저로 적은 것이 <InlineMath math={"A"}/>와{" "}
                        <InlineMath math={"B"}/>라는 말과 같다. 구체적으로{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 3 & -1 \\\\ 4 & 6 \\end{smallmatrix}\\right]"}/>과{" "}
                        <InlineMath math={"\\tfrac17\\left[\\begin{smallmatrix} 38 & 16 \\\\ -8 & 25 \\end{smallmatrix}\\right]"}/>이
                        거기서 구한 <InlineMath math={"P"}/>로 닮았다.
                    </p>}
                />
            </Definition>
            <Definition n="2.56" title={<T en={<>A full set of eigenvectors</>} ko={<>고유벡터가 기저를 이루는 경우</>}/>}>
                <T
                    en={<p>
                        An <InlineMath math={"n \\times n"}/> matrix <InlineMath math={"A"}/> has a{" "}
                        <strong>full set of eigenvectors</strong> if there is a basis{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> of{" "}
                        <InlineMath math={"(\\mathbb{C}^n, \\mathbb{C})"}/> with{" "}
                        <InlineMath math={"Av^i = \\lambda_i v^i"}/> for{" "}
                        <InlineMath math={"1 \\le i \\le n"}/>. Our running example{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 2 & 1 \\\\ 1 & 2 \\end{smallmatrix}\\right]"}/> does,
                        with <InlineMath math={"\\{(1,1)^\\top, (1,-1)^\\top\\}"}/>. The shear{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 1 & 1 \\\\ 0 & 1 \\end{smallmatrix}\\right]"}/> does
                        not, since <InlineMath math={"\\eta_1 = 1 < 2"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"1 \\le i \\le n"}/>에 대해{" "}
                        <InlineMath math={"Av^i = \\lambda_i v^i"}/>인{" "}
                        <InlineMath math={"(\\mathbb{C}^n, \\mathbb{C})"}/>의 기저{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>이 존재하면{" "}
                        <InlineMath math={"n \\times n"}/> 행렬 <InlineMath math={"A"}/>가{" "}
                        <strong>고유벡터를 온전히 갖췄다</strong>고 한다. 계속 쓰고 있는 예{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 2 & 1 \\\\ 1 & 2 \\end{smallmatrix}\\right]"}/>은{" "}
                        <InlineMath math={"\\{(1,1)^\\top, (1,-1)^\\top\\}"}/>으로 그것을 갖췄다. 전단 행렬{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 1 & 1 \\\\ 0 & 1 \\end{smallmatrix}\\right]"}/>은{" "}
                        <InlineMath math={"\\eta_1 = 1 < 2"}/>이라 갖추지 못했다.
                    </p>}
                />
            </Definition>
            <Theorem n="2.57" title={<T en={<>Diagonalizable if and only if a full set exists</>}
                                        ko={<>대각화 가능은 고유벡터를 온전히 갖춘 것과 동치다</>}/>}>
                <T
                    en={<p>
                        An <InlineMath math={"n \\times n"}/> matrix <InlineMath math={"A"}/> has a full set
                        of eigenvectors if and only if it is similar to a diagonal matrix, and the diagonal
                        entries are then the eigenvalues of <InlineMath math={"A"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"n \\times n"}/> 행렬 <InlineMath math={"A"}/>가 고유벡터를 온전히
                        갖추는 것은 대각 행렬과 닮은 것과 동치이고, 그때 대각 성분은{" "}
                        <InlineMath math={"A"}/>의 고윳값이다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            Assume <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> is a basis of{" "}
                            <InlineMath math={"(\\mathbb{C}^n, \\mathbb{C})"}/> with{" "}
                            <InlineMath math={"Av^i = \\lambda_i v^i"}/>, and collect it into a matrix:
                        </p>}
                        ko={<p>
                            <InlineMath math={"Av^i = \\lambda_i v^i"}/>인{" "}
                            <InlineMath math={"(\\mathbb{C}^n, \\mathbb{C})"}/>의 기저{" "}
                            <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>이 있다고 가정하고 그것을 행렬로
                            모은다.
                        </p>}
                    />
                    <BlockMath math={"M := \\begin{bmatrix} v^1 & v^2 & \\cdots & v^n \\end{bmatrix}, \\qquad \\Lambda := \\operatorname{diag}(\\lambda_1, \\lambda_2, \\ldots, \\lambda_n)"}/>
                    <Terms items={[
                        ["M", <T en={<>the matrix whose columns are the eigenvectors</>}
                                ko={<>열이 고유벡터인 행렬</>}/>],
                        ["\\Lambda", <T en={<>the diagonal matrix of the corresponding eigenvalues, in the same order</>}
                                       ko={<>같은 순서로 대응하는 고윳값을 늘어놓은 대각 행렬</>}/>],
                    ]}/>
                    <T en={<p>Multiplying <InlineMath math={"A"}/> into the columns one at a time,</p>}
                       ko={<p><InlineMath math={"A"}/>를 열마다 하나씩 곱해 보면</p>}/>
                    <BlockMath math={"A M = \\begin{bmatrix} Av^1 & \\cdots & Av^n \\end{bmatrix} = \\begin{bmatrix} \\lambda_1 v^1 & \\cdots & \\lambda_n v^n \\end{bmatrix} = M \\Lambda"}/>
                    <Terms items={[
                        ["AM", <T en={<>column <InlineMath math={"i"}/> of a product is <InlineMath math={"A"}/> applied to column <InlineMath math={"i"}/></>}
                                 ko={<>곱의 <InlineMath math={"i"}/>번째 열은 <InlineMath math={"A"}/>를 <InlineMath math={"i"}/>번째 열에 적용한 것이다</>}/>],
                        ["M\\Lambda", <T en={<>right multiplication by a diagonal matrix scales column <InlineMath math={"i"}/> by <InlineMath math={"\\lambda_i"}/></>}
                                        ko={<>대각 행렬을 오른쪽에 곱하면 <InlineMath math={"i"}/>번째 열이 <InlineMath math={"\\lambda_i"}/>배가 된다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The notes leave the next step as an exercise. It is the observation that a matrix
                            times a column of scalars is a linear combination of its columns:
                        </p>}
                        ko={<p>
                            원 교재는 다음 단계를 연습 문제로 남긴다. 행렬에 스칼라 열을 곱하면 그 열들의 선형
                            결합이 된다는 관찰이다.
                        </p>}
                    />
                    <BlockMath math={"M \\alpha = \\begin{bmatrix} v^1 & \\cdots & v^n \\end{bmatrix} \\begin{bmatrix} \\alpha_1 \\\\ \\vdots \\\\ \\alpha_n \\end{bmatrix} = \\alpha_1 v^1 + \\cdots + \\alpha_n v^n"}/>
                    <Terms items={[
                        ["\\alpha", <T en={<>an arbitrary column of scalars</>} ko={<>임의의 스칼라 열</>}/>],
                        ["M\\alpha = 0", <T en={<>therefore says exactly that a linear combination of the columns vanishes, so <InlineMath math={"M"}/> is invertible if and only if the columns are independent</>}
                                           ko={<>따라서 열들의 선형 결합이 0이라는 말과 정확히 같다. 그래서 <InlineMath math={"M"}/>이 가역인 것은 열이 독립일 때뿐이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Here the columns are a basis, so <InlineMath math={"M"}/> is invertible and{" "}
                            <InlineMath math={"AM = M\\Lambda"}/> can be solved for{" "}
                            <InlineMath math={"A"}/>:
                        </p>}
                        ko={<p>
                            지금은 열이 기저이므로 <InlineMath math={"M"}/>이 가역이고{" "}
                            <InlineMath math={"AM = M\\Lambda"}/>를 <InlineMath math={"A"}/>에 대해 풀 수
                            있다.
                        </p>}
                    />
                    <BlockMath math={"A = M \\Lambda M^{-1}, \\qquad \\Lambda = M^{-1} A M"}/>
                    <Terms items={[
                        ["M^{-1}", <T en={<>the inverse, available because the eigenvectors are a basis</>}
                                     ko={<>역행렬. 고유벡터가 기저이므로 존재한다</>}/>],
                        ["\\Lambda = M^{-1}AM", <T en={<>the statement that <InlineMath math={"A"}/> is similar to a diagonal matrix, with <InlineMath math={"M^{-1}"}/> as the similarity matrix of Definition 2.55</>}
                                                  ko={<><InlineMath math={"A"}/>가 대각 행렬과 닮았다는 진술. Definition 2.55의 닮음 행렬은 <InlineMath math={"M^{-1}"}/>이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            For the converse, suppose{" "}
                            <InlineMath math={"A = M \\Lambda M^{-1}"}/> with{" "}
                            <InlineMath math={"\\Lambda"}/> diagonal. Then{" "}
                            <InlineMath math={"AM = M\\Lambda"}/>, and reading that column by column says
                            each column of <InlineMath math={"M"}/> is an eigenvector with eigenvalue the
                            corresponding diagonal entry. The columns of an invertible matrix are
                            independent, so they form a basis and the set is full.
                        </p>}
                        ko={<p>
                            역방향은 <InlineMath math={"\\Lambda"}/>가 대각일 때{" "}
                            <InlineMath math={"A = M \\Lambda M^{-1}"}/>이라 하자. 그러면{" "}
                            <InlineMath math={"AM = M\\Lambda"}/>이고, 이것을 열마다 읽으면{" "}
                            <InlineMath math={"M"}/>의 각 열이 대응하는 대각 성분을 고윳값으로 갖는
                            고유벡터라는 말이 된다. 가역 행렬의 열은 독립이므로 기저를 이루고, 고유벡터가
                            온전히 갖춰진다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Example title={<T en={<>Diagonalizing the running example</>} ko={<>계속 쓰던 예를 대각화하기</>}/>}>
                <T
                    en={<p>
                        Assemble the eigenvectors of{" "}
                        <InlineMath math={"A = \\left[\\begin{smallmatrix} 2 & 1 \\\\ 1 & 2 \\end{smallmatrix}\\right]"}/> found
                        above. This <InlineMath math={"M"}/> is the matrix called{" "}
                        <InlineMath math={"\\bar P"}/> in the change of basis example, which is the point:
                        diagonalizing is choosing the eigenvector basis.
                    </p>}
                    ko={<p>
                        앞에서 구한{" "}
                        <InlineMath math={"A = \\left[\\begin{smallmatrix} 2 & 1 \\\\ 1 & 2 \\end{smallmatrix}\\right]"}/>의
                        고유벡터를 모은다. 이 <InlineMath math={"M"}/>은 기저 변환 예에서{" "}
                        <InlineMath math={"\\bar P"}/>라 부르던 행렬이고, 요점이 바로 그것이다. 대각화란
                        고유벡터 기저를 고르는 일이다.
                    </p>}
                />
                <BlockMath math={"M = \\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix}, \\quad \\Lambda = \\begin{bmatrix} 3 & 0 \\\\ 0 & 1 \\end{bmatrix}, \\quad M^{-1} = \\frac{1}{2}\\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix}"}/>
                <Terms items={[
                    ["M", <T en={<>columns <InlineMath math={"(1,1)^\\top"}/> and <InlineMath math={"(1,-1)^\\top"}/>, in the order matching <InlineMath math={"\\Lambda"}/></>}
                            ko={<>열이 <InlineMath math={"(1,1)^\\top"}/>과 <InlineMath math={"(1,-1)^\\top"}/>. 순서는 <InlineMath math={"\\Lambda"}/>와 맞춘다</>}/>],
                    ["\\Lambda", <T en={<>the eigenvalues 3 and 1 on the diagonal, in the same order as the columns of <InlineMath math={"M"}/></>}
                                   ko={<>대각에 고윳값 3과 1. <InlineMath math={"M"}/>의 열과 같은 순서다</>}/>],
                    ["M^{-1}", <T en={<>computed with <InlineMath math={"\\det M = -2"}/>: <InlineMath math={"\\tfrac{1}{-2}\\left[\\begin{smallmatrix} -1 & -1 \\\\ -1 & 1 \\end{smallmatrix}\\right]"}/></>}
                                 ko={<><InlineMath math={"\\det M = -2"}/>로 계산한다. <InlineMath math={"\\tfrac{1}{-2}\\left[\\begin{smallmatrix} -1 & -1 \\\\ -1 & 1 \\end{smallmatrix}\\right]"}/>이다</>}/>],
                ]}/>
                <T en={<p>Multiply the three together, left to right:</p>}
                   ko={<p>셋을 왼쪽부터 차례로 곱하면</p>}/>
                <BlockMath math={"M \\Lambda M^{-1} = \\begin{bmatrix} 3 & 1 \\\\ 3 & -1 \\end{bmatrix} \\cdot \\frac{1}{2}\\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix} = \\frac{1}{2}\\begin{bmatrix} 4 & 2 \\\\ 2 & 4 \\end{bmatrix} = \\begin{bmatrix} 2 & 1 \\\\ 1 & 2 \\end{bmatrix} = A"}/>
                <Terms items={[
                    ["M\\Lambda", <T en={<>the first product: column 1 of <InlineMath math={"M"}/> scaled by 3, column 2 by 1</>}
                                    ko={<>첫 번째 곱. <InlineMath math={"M"}/>의 첫 열은 3배, 둘째 열은 1배가 된다</>}/>],
                    ["\\tfrac12\\left[\\begin{smallmatrix} 4 & 2 \\\\ 2 & 4 \\end{smallmatrix}\\right]", <T en={<>the second product, which returns <InlineMath math={"A"}/> exactly</>}
                                                                                                          ko={<>두 번째 곱. 정확히 <InlineMath math={"A"}/>로 돌아온다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Read in the other direction,{" "}
                        <InlineMath math={"\\Lambda = M^{-1} A M"}/> says that in the eigenvector basis the
                        operator is two independent scalings, by 3 along{" "}
                        <InlineMath math={"(1,1)^\\top"}/> and by 1 along{" "}
                        <InlineMath math={"(1,-1)^\\top"}/>. Repeated application is then trivial:{" "}
                        <InlineMath math={"A^k = M \\Lambda^k M^{-1}"}/>, and{" "}
                        <InlineMath math={"\\Lambda^k = \\operatorname{diag}(3^k, 1)"}/>.
                    </p>}
                    ko={<p>
                        반대 방향으로 읽으면 <InlineMath math={"\\Lambda = M^{-1} A M"}/>은 고유벡터 기저에서
                        이 연산자가 서로 독립인 배율 두 개라는 말이다.{" "}
                        <InlineMath math={"(1,1)^\\top"}/> 방향으로 3배,{" "}
                        <InlineMath math={"(1,-1)^\\top"}/> 방향으로 1배다. 그러면 반복 적용도 간단해진다.{" "}
                        <InlineMath math={"A^k = M \\Lambda^k M^{-1}"}/>이고{" "}
                        <InlineMath math={"\\Lambda^k = \\operatorname{diag}(3^k, 1)"}/>이다.
                    </p>}
                />
            </Example>
            <Remark title={<T en={<>Distinct eigenvalues are sufficient, not necessary</>}
                              ko={<>고윳값이 다른 것은 충분조건이지 필요조건이 아니다</>}/>}>
                <T
                    en={<p>
                        Theorem 2.53 plus Theorem 2.57 give the usable rule: <em>distinct eigenvalues imply
                        diagonalizable</em>. The converse fails, as <InlineMath math={"I"}/> shows: it has a
                        repeated eigenvalue and is already diagonal. What actually decides the question is
                        whether <InlineMath math={"\\eta_i = m_i"}/> for every eigenvalue. The shear{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 1 & 1 \\\\ 0 & 1 \\end{smallmatrix}\\right]"}/> has{" "}
                        <InlineMath math={"m_1 = 2"}/> and <InlineMath math={"\\eta_1 = 1"}/>, so it is not
                        diagonalizable. Try both in the figure above.
                    </p>}
                    ko={<p>
                        Theorem 2.53과 Theorem 2.57을 합치면 실전에서 쓰는 규칙이 나온다. <em>고윳값이 서로
                        다르면 대각화 가능</em>이다. 역은 성립하지 않으며 <InlineMath math={"I"}/>가 그
                        반례다. 고윳값이 겹치는데도 이미 대각이다. 실제로 판정을 짓는 것은 모든 고윳값에서{" "}
                        <InlineMath math={"\\eta_i = m_i"}/>인가이다. 전단 행렬{" "}
                        <InlineMath math={"\\left[\\begin{smallmatrix} 1 & 1 \\\\ 0 & 1 \\end{smallmatrix}\\right]"}/>은{" "}
                        <InlineMath math={"m_1 = 2"}/>, <InlineMath math={"\\eta_1 = 1"}/>이라 대각화되지
                        않는다. 위 그림에서 둘 다 눌러 보자.
                    </p>}
                />
            </Remark>
            {/* ------------------------------------------------------------------ */}
            <T en={<h2>A Few Additional Properties of Matrices</h2>} ko={<h2>행렬의 추가 성질</h2>}/>
            <T
                en={<p>
                    The rest of the chapter is a toolbox. Each item here is used somewhere in Chapters 3
                    through 5, and the last one is the algebraic heart of the Kalman filter.
                </p>}
                ko={<p>
                    이 장의 남은 부분은 연장통이다. 여기 있는 것들은 3장부터 5장 사이 어딘가에서 전부 쓰이고,
                    마지막 항목은 칼만 필터의 대수적 심장이다.
                </p>}
            />
            <Proposition n="2.58" title={<T en={<>Similarity preserves the spectrum</>} ko={<>닮음은 스펙트럼을 보존한다</>}/>}>
                <T
                    en={<p>
                        If <InlineMath math={"A"}/> and <InlineMath math={"B"}/> are similar, they have the
                        same eigenvalues with the same algebraic and geometric multiplicities. Eigenvalues
                        therefore belong to the operator, not to the basis you happened to write it in.
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>와 <InlineMath math={"B"}/>가 닮았으면 고윳값이 같고 대수적
                        중복도와 기하적 중복도까지 같다. 그러니 고윳값은 연산자에 속한 것이지 어쩌다 고른
                        기저에 속한 것이 아니다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            The notes state this without proof. For the eigenvalues and their algebraic
                            multiplicities, compare characteristic polynomials, inserting{" "}
                            <InlineMath math={"P P^{-1}"}/> to factor the determinant:
                        </p>}
                        ko={<p>
                            원 교재는 증명 없이 진술만 둔다. 고윳값과 대수적 중복도는 특성 다항식을 비교하면
                            되고, 행렬식을 인수분해하려고 <InlineMath math={"P P^{-1}"}/>을 끼워 넣는다.
                        </p>}
                    />
                    <BlockMath math={"\\det(\\lambda I - P A P^{-1}) = \\det\\big(P (\\lambda I - A) P^{-1}\\big) = \\det(P) \\det(\\lambda I - A) \\det(P)^{-1} = \\det(\\lambda I - A)"}/>
                    <Terms items={[
                        ["\\lambda I - PAP^{-1}", <T en={<>equal to <InlineMath math={"P(\\lambda I)P^{-1} - PAP^{-1}"}/>, since <InlineMath math={"P (\\lambda I) P^{-1} = \\lambda I"}/></>}
                                                    ko={<><InlineMath math={"P (\\lambda I) P^{-1} = \\lambda I"}/>이므로 <InlineMath math={"P(\\lambda I)P^{-1} - PAP^{-1}"}/>과 같다</>}/>],
                        ["\\det(PQ) = \\det(P)\\det(Q)", <T en={<>the multiplicative property of the determinant, applied twice</>}
                                                          ko={<>행렬식의 곱셈 성질. 두 번 적용한다</>}/>],
                        ["\\det(P)\\det(P)^{-1}", <T en={<>cancels to 1, so the two polynomials are identical and hence have the same roots with the same multiplicities</>}
                                                    ko={<>1로 약분된다. 따라서 두 다항식이 완전히 같고 근과 중복도도 같다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            For the geometric multiplicities, note that{" "}
                            <InlineMath math={"v \\in \\operatorname{null}(A - \\lambda I)"}/> if and only if{" "}
                            <InlineMath math={"Pv \\in \\operatorname{null}(B - \\lambda I)"}/>, because{" "}
                            <InlineMath math={"(B - \\lambda I)(Pv) = P(A - \\lambda I)v"}/>. So{" "}
                            <InlineMath math={"P"}/> maps one null space onto the other, and it is invertible,
                            so it carries a basis to a basis. The dimensions agree.
                        </p>}
                        ko={<p>
                            기하적 중복도는{" "}
                            <InlineMath math={"(B - \\lambda I)(Pv) = P(A - \\lambda I)v"}/>이므로{" "}
                            <InlineMath math={"v \\in \\operatorname{null}(A - \\lambda I)"}/>인 것과{" "}
                            <InlineMath math={"Pv \\in \\operatorname{null}(B - \\lambda I)"}/>인 것이 동치임을
                            보면 된다. 즉 <InlineMath math={"P"}/>가 한 null space를 다른 null space 위로
                            보내고, 가역이므로 기저를 기저로 옮긴다. 차원이 같아진다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Definition n="2.59" title={<T en={<>Rank</>} ko={<>rank</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"A"}/> be <InlineMath math={"n \\times m"}/> over{" "}
                        <InlineMath math={"\\mathbb{R}"}/> or <InlineMath math={"\\mathbb{C}"}/>. The{" "}
                        <strong>rank</strong> of <InlineMath math={"A"}/> is the number of linearly
                        independent columns, that is,{" "}
                        <InlineMath math={"\\dim \\operatorname{span}\\{a^{\\mathrm{col}}_1, \\ldots, a^{\\mathrm{col}}_m\\}"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>를 <InlineMath math={"\\mathbb{R}"}/> 또는{" "}
                        <InlineMath math={"\\mathbb{C}"}/> 위의 <InlineMath math={"n \\times m"}/> 행렬이라
                        하자. <InlineMath math={"A"}/>의 <strong>rank</strong>는 선형 독립인 열의 개수, 곧{" "}
                        <InlineMath math={"\\dim \\operatorname{span}\\{a^{\\mathrm{col}}_1, \\ldots, a^{\\mathrm{col}}_m\\}"}/>이다.
                    </p>}
                />
                <BlockMath math={"\\operatorname{rank}\\begin{bmatrix} 1 & 2 \\\\ 2 & 4 \\end{bmatrix} = 1, \\qquad \\operatorname{rank}\\begin{bmatrix} 1 & 0 & 1 \\\\ 0 & 1 & 1 \\end{bmatrix} = 2"}/>
                <Terms items={[
                    ["\\left[\\begin{smallmatrix} 1 & 2 \\\\ 2 & 4 \\end{smallmatrix}\\right]", <T en={<>its second column is twice the first, so the span of the columns is a line</>}
                                                                                                  ko={<>둘째 열이 첫 열의 2배라 열들의 span이 직선이다</>}/>],
                    ["\\left[\\begin{smallmatrix} 1 & 0 & 1 \\\\ 0 & 1 & 1 \\end{smallmatrix}\\right]", <T en={<>three columns in <InlineMath math={"\\mathbb{R}^2"}/>, so they must be dependent; the first two are independent, so the rank is 2</>}
                                                                                                         ko={<><InlineMath math={"\\mathbb{R}^2"}/>의 열 셋이므로 종속일 수밖에 없다. 앞의 둘이 독립이므로 rank는 2다</>}/>],
                ]}/>
            </Definition>
            <Proposition n="2.60" title={<T en={<>Rank and non-zero eigenvalues</>} ko={<>rank와 0이 아닌 고윳값</>}/>}>
                <T
                    en={<p>
                        The notes state that for square <InlineMath math={"M"}/>,{" "}
                        <InlineMath math={"\\operatorname{rank}(M)"}/> equals the number of non-zero
                        eigenvalues. Read that with a full set of eigenvectors in force: if{" "}
                        <InlineMath math={"M = S \\Lambda S^{-1}"}/>, then{" "}
                        <InlineMath math={"\\operatorname{rank}(M) = \\operatorname{rank}(\\Lambda)"}/>, which
                        counts the non-zero diagonal entries. Without that hypothesis the count is only a
                        lower bound:
                    </p>}
                    ko={<p>
                        원 교재는 정사각 <InlineMath math={"M"}/>에 대해{" "}
                        <InlineMath math={"\\operatorname{rank}(M)"}/>이 0이 아닌 고윳값의 개수와 같다고
                        적는다. 고유벡터가 온전히 갖춰진 경우로 읽어야 한다.{" "}
                        <InlineMath math={"M = S \\Lambda S^{-1}"}/>이면{" "}
                        <InlineMath math={"\\operatorname{rank}(M) = \\operatorname{rank}(\\Lambda)"}/>이고,
                        그것이 0이 아닌 대각 성분의 개수다. 이 가정이 없으면 그 개수는 하한일 뿐이다.
                    </p>}
                />
                <BlockMath math={"M = \\begin{bmatrix} 0 & 1 \\\\ 0 & 0 \\end{bmatrix}: \\quad \\Delta(\\lambda) = \\lambda^2, \\quad \\lambda_1 = \\lambda_2 = 0, \\quad \\operatorname{rank}(M) = 1"}/>
                <Terms items={[
                    ["M", <T en={<>a matrix with no full set of eigenvectors: <InlineMath math={"\\eta_1 = 1 < 2 = m_1"}/></>}
                            ko={<>고유벡터를 온전히 갖추지 못한 행렬. <InlineMath math={"\\eta_1 = 1 < 2 = m_1"}/>이다</>}/>],
                    ["\\Delta(\\lambda) = \\lambda^2", <T en={<>both eigenvalues are zero, so the count of non-zero eigenvalues is 0</>}
                                                        ko={<>고윳값이 둘 다 0이므로 0이 아닌 고윳값의 개수는 0이다</>}/>],
                    ["\\operatorname{rank}(M) = 1", <T en={<>the second column is nonzero and the first is zero, so exactly one independent column</>}
                                                      ko={<>둘째 열이 0이 아니고 첫 열은 0이므로 독립인 열이 정확히 하나다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The general statement is{" "}
                        <InlineMath math={"\\operatorname{rank}(M) \\ge \\#\\{\\lambda_i \\neq 0\\}"}/>{" "}
                        counted with algebraic multiplicity, with equality when{" "}
                        <InlineMath math={"M"}/> is diagonalizable. For the symmetric matrices that dominate
                        Chapters 3 to 5 a full set always exists, so the simple version is safe there.
                    </p>}
                    ko={<p>
                        일반적으로는 대수적 중복도를 세어{" "}
                        <InlineMath math={"\\operatorname{rank}(M) \\ge \\#\\{\\lambda_i \\neq 0\\}"}/>이고,{" "}
                        <InlineMath math={"M"}/>이 대각화 가능하면 등호가 된다. 3장부터 5장까지 주로 만나는
                        대칭 행렬은 고유벡터를 언제나 온전히 갖추므로 거기서는 단순한 형태를 그대로 써도 된다.
                    </p>}
                />
            </Proposition>
            <Proposition n="2.61" title={<T en={<>Rank survives multiplication by the transpose</>}
                                          ko={<>전치를 곱해도 rank는 살아남는다</>}/>}>
                <BlockMath math={"\\operatorname{rank}(A) = \\operatorname{rank}(A^\\top A) = \\operatorname{rank}(A A^\\top) = \\operatorname{rank}(A^\\top)"}/>
                <Terms items={[
                    ["A", <T en={<>a real <InlineMath math={"n \\times m"}/> matrix</>}
                            ko={<>실수 <InlineMath math={"n \\times m"}/> 행렬</>}/>],
                    ["A^\\top A", <T en={<>the <InlineMath math={"m \\times m"}/> matrix appearing in the normal equations of Chapter 3</>}
                                    ko={<>3장의 normal equation에 나타나는 <InlineMath math={"m \\times m"}/> 행렬</>}/>],
                    ["A A^\\top", <T en={<>the <InlineMath math={"n \\times n"}/> counterpart, a different size with the same rank</>}
                                    ko={<>크기가 다른 <InlineMath math={"n \\times n"}/> 짝. rank는 같다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            The notes defer this to the ROB 101 textbook. The core is one line, and it is
                            worth seeing. Take <InlineMath math={"x"}/> real. If{" "}
                            <InlineMath math={"Ax = 0"}/> then certainly{" "}
                            <InlineMath math={"A^\\top A x = 0"}/>. Conversely:
                        </p>}
                        ko={<p>
                            원 교재는 이것을 ROB 101 교재로 넘긴다. 핵심은 한 줄이고 볼 값어치가 있다.{" "}
                            <InlineMath math={"x"}/>를 실벡터라 하자.{" "}
                            <InlineMath math={"Ax = 0"}/>이면 당연히{" "}
                            <InlineMath math={"A^\\top A x = 0"}/>이다. 역방향은
                        </p>}
                    />
                    <BlockMath math={"A^\\top A x = 0 \\implies x^\\top A^\\top A x = 0 \\implies (Ax)^\\top (Ax) = \\lVert Ax \\rVert^2 = 0 \\implies Ax = 0"}/>
                    <Terms items={[
                        ["x^\\top A^\\top A x", <T en={<>left-multiplying by <InlineMath math={"x^\\top"}/>, which turns a vector equation into a scalar one</>}
                                                 ko={<>왼쪽에 <InlineMath math={"x^\\top"}/>을 곱한 것. 벡터 방정식이 스칼라 방정식이 된다</>}/>],
                        ["\\lVert Ax \\rVert^2", <T en={<>the sum of the squares of the entries of <InlineMath math={"Ax"}/>, which vanishes only if every entry does</>}
                                                  ko={<><InlineMath math={"Ax"}/> 성분들의 제곱합. 모든 성분이 0일 때만 0이 된다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            So <InlineMath math={"A"}/> and <InlineMath math={"A^\\top A"}/> have the same
                            null space, hence the same nullity, and both have{" "}
                            <InlineMath math={"m"}/> columns, so rank-nullity gives them the same rank. The
                            identity <InlineMath math={"\\operatorname{rank}(A) = \\operatorname{rank}(A^\\top)"}/> is
                            Corollary 2.62, and applying the argument to{" "}
                            <InlineMath math={"A^\\top"}/> gives the remaining equality. Note the step where
                            realness was used: over <InlineMath math={"\\mathbb{C}"}/> the same argument needs{" "}
                            <InlineMath math={"A^\\ast A"}/> with a conjugate transpose.
                        </p>}
                        ko={<p>
                            따라서 <InlineMath math={"A"}/>와 <InlineMath math={"A^\\top A"}/>는 null space가
                            같아 nullity가 같고, 둘 다 열이 <InlineMath math={"m"}/>개이므로 rank-nullity에
                            의해 rank도 같다. <InlineMath math={"\\operatorname{rank}(A) = \\operatorname{rank}(A^\\top)"}/>은
                            Corollary 2.62이고, 같은 논증을 <InlineMath math={"A^\\top"}/>에 적용하면 남은
                            등식이 나온다. 실수라는 조건이 쓰인 자리를 보아 두자.{" "}
                            <InlineMath math={"\\mathbb{C}"}/> 위에서는 켤레 전치를 쓴{" "}
                            <InlineMath math={"A^\\ast A"}/>가 필요하다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Corollary n="2.62" title={<T en={<>Rows and columns agree</>} ko={<>행과 열은 일치한다</>}/>}>
                <T
                    en={<p>
                        The number of independent rows equals the number of independent columns, and{" "}
                        <InlineMath math={"\\operatorname{rank}(A) \\le \\min(n, m)"}/>. The bound is
                        Definition 2.26 applied to <InlineMath math={"\\mathbb{F}^n"}/>: a matrix with more
                        columns than rows has more than <InlineMath math={"n"}/> vectors in{" "}
                        <InlineMath math={"\\mathbb{F}^n"}/>, so its columns are dependent. The <InlineMath math={"2 \\times 3"}/> example
                        above is exactly that case.
                    </p>}
                    ko={<p>
                        독립인 행의 개수와 독립인 열의 개수가 같고{" "}
                        <InlineMath math={"\\operatorname{rank}(A) \\le \\min(n, m)"}/>이다. 이 상한은{" "}
                        <InlineMath math={"\\mathbb{F}^n"}/>에 Definition 2.26을 적용한 것이다. 행보다 열이
                        많은 행렬은 <InlineMath math={"\\mathbb{F}^n"}/> 안에 벡터를{" "}
                        <InlineMath math={"n"}/>개보다 많이 갖고 있으므로 열이 종속이다. 위의 <InlineMath math={"2 \\times 3"}/> 예가
                        정확히 그 경우다.
                    </p>}
                />
            </Corollary>
            <Lemma n="2.63" title={<T en={<>Transferring eigenvectors between <InlineMath math={"A^\\top A"}/> and <InlineMath math={"A A^\\top"}/></>}
                                      ko={<><InlineMath math={"A^\\top A"}/>와 <InlineMath math={"A A^\\top"}/> 사이의 고유벡터 옮기기</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"A"}/> be a real <InlineMath math={"n \\times m"}/> matrix. If{" "}
                        <InlineMath math={"\\lambda \\neq 0"}/> is an eigenvalue of{" "}
                        <InlineMath math={"A^\\top A"}/> with eigenvector <InlineMath math={"v"}/>, then{" "}
                        <InlineMath math={"\\lambda"}/> is an eigenvalue of{" "}
                        <InlineMath math={"A A^\\top"}/> with eigenvector <InlineMath math={"Av"}/>, and
                        symmetrically with <InlineMath math={"A^\\top v"}/> in the other direction.
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>를 실수 <InlineMath math={"n \\times m"}/> 행렬이라 하자.{" "}
                        <InlineMath math={"\\lambda \\neq 0"}/>이 고유벡터 <InlineMath math={"v"}/>를 갖는{" "}
                        <InlineMath math={"A^\\top A"}/>의 고윳값이면,{" "}
                        <InlineMath math={"\\lambda"}/>는 고유벡터 <InlineMath math={"Av"}/>를 갖는{" "}
                        <InlineMath math={"A A^\\top"}/>의 고윳값이다. 반대 방향은{" "}
                        <InlineMath math={"A^\\top v"}/>로 대칭이다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            Assume <InlineMath math={"(A^\\top A)v = \\lambda v"}/> with{" "}
                            <InlineMath math={"\\lambda \\neq 0"}/> and{" "}
                            <InlineMath math={"v \\neq 0"}/>. First check that the candidate eigenvector is
                            not the zero vector, which the definition forbids: if{" "}
                            <InlineMath math={"Av = 0"}/>, then{" "}
                            <InlineMath math={"\\lambda v = A^\\top (Av) = 0"}/>, forcing{" "}
                            <InlineMath math={"\\lambda = 0"}/> or <InlineMath math={"v = 0"}/>, and both are
                            excluded. Then simply regroup the product:
                        </p>}
                        ko={<p>
                            <InlineMath math={"\\lambda \\neq 0"}/>,{" "}
                            <InlineMath math={"v \\neq 0"}/>이고{" "}
                            <InlineMath math={"(A^\\top A)v = \\lambda v"}/>라 하자. 먼저 후보 고유벡터가
                            영벡터가 아님을 확인해야 한다. 정의가 그것을 금지하기 때문이다.{" "}
                            <InlineMath math={"Av = 0"}/>이라면{" "}
                            <InlineMath math={"\\lambda v = A^\\top (Av) = 0"}/>이 되어{" "}
                            <InlineMath math={"\\lambda = 0"}/>이거나 <InlineMath math={"v = 0"}/>이어야
                            하는데 둘 다 배제되어 있다. 그다음은 곱을 다시 묶기만 하면 된다.
                        </p>}
                    />
                    <BlockMath math={"(A A^\\top)(Av) = A (A^\\top A) v = A(\\lambda v) = \\lambda (Av)"}/>
                    <Terms items={[
                        ["(A A^\\top)(Av)", <T en={<>the claim being checked: <InlineMath math={"Av"}/> is an eigenvector of <InlineMath math={"AA^\\top"}/></>}
                                              ko={<>확인 중인 주장. <InlineMath math={"Av"}/>가 <InlineMath math={"AA^\\top"}/>의 고유벡터라는 것</>}/>],
                        ["A(A^\\top A)v", <T en={<>the same product, regrouped by associativity: no new fact is used</>}
                                            ko={<>결합법칙으로 다시 묶은 같은 곱. 새로운 사실은 하나도 쓰지 않았다</>}/>],
                        ["\\lambda(Av)", <T en={<>the definition of <InlineMath math={"Av"}/> being an eigenvector for <InlineMath math={"\\lambda"}/></>}
                                           ko={<><InlineMath math={"Av"}/>가 <InlineMath math={"\\lambda"}/>의 고유벡터라는 정의 그 자체</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Corollary 2.64 follows: <InlineMath math={"A A^\\top"}/> and{" "}
                            <InlineMath math={"A^\\top A"}/> have the same non-zero eigenvalues. Being of
                            different sizes, they can differ only in how many zero eigenvalues they carry.
                            Chapter 4 builds the SVD on exactly this.
                        </p>}
                        ko={<p>
                            여기서 Corollary 2.64가 따라 나온다. <InlineMath math={"A A^\\top"}/>과{" "}
                            <InlineMath math={"A^\\top A"}/>는 0이 아닌 고윳값이 같다. 크기가 다르므로 차이가
                            날 수 있는 것은 0인 고윳값의 개수뿐이다. 4장의 SVD가 바로 이 위에 세워진다.
                        </p>}
                    />
                </Proof>
            </Lemma>
            <Definition n="2.65" title={<T en={<>Trace</>} ko={<>trace</>}/>}>
                <BlockMath math={"\\operatorname{tr}(C) := \\sum_{i=1}^{n} C_{ii}, \\qquad \\operatorname{tr}\\begin{bmatrix} 2 & 1 \\\\ 1 & 2 \\end{bmatrix} = 4 = 3 + 1 = \\lambda_1 + \\lambda_2"}/>
                <Terms items={[
                    ["C", <T en={<>an <InlineMath math={"n \\times n"}/> matrix</>}
                            ko={<><InlineMath math={"n \\times n"}/> 행렬</>}/>],
                    ["C_{ii}", <T en={<>its diagonal entries, the only ones the trace looks at</>}
                                 ko={<>대각 성분. trace가 보는 것은 이것뿐이다</>}/>],
                    ["\\lambda_1 + \\lambda_2", <T en={<>the eigenvalues computed earlier: the trace equals their sum, which follows from <InlineMath math={"\\operatorname{tr}(M \\Lambda M^{-1}) = \\operatorname{tr}(\\Lambda M^{-1} M)"}/> and the identity below</>}
                                                  ko={<>앞에서 구한 고윳값. trace가 그 합과 같은데, 이는 아래 등식과 <InlineMath math={"\\operatorname{tr}(M \\Lambda M^{-1}) = \\operatorname{tr}(\\Lambda M^{-1} M)"}/>에서 따라 나온다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Exercise 2.66 in the notes is the commuting property below. It is used constantly in
                        Chapter 5, where the quantity being minimized is the trace of a covariance matrix,
                        and it falls out of writing both sides as the same double sum.
                    </p>}
                    ko={<p>
                        원 교재의 Exercise 2.66이 아래 교환 성질이다. 5장에서는 최소화 대상이 공분산 행렬의
                        trace라서 이 성질을 쉼 없이 쓴다. 양변을 같은 이중 합으로 적으면 바로 떨어진다.
                    </p>}
                />
                <BlockMath math={"\\operatorname{tr}(A \\cdot B) = \\sum_{i=1}^{n} \\sum_{j=1}^{m} A_{ij} B_{ji} = \\sum_{j=1}^{m} \\sum_{i=1}^{n} B_{ji} A_{ij} = \\operatorname{tr}(B \\cdot A)"}/>
                <Terms items={[
                    ["A, B", <T en={<>sizes <InlineMath math={"n \\times m"}/> and <InlineMath math={"m \\times n"}/>, so both products are square but of different sizes</>}
                               ko={<>크기가 각각 <InlineMath math={"n \\times m"}/>, <InlineMath math={"m \\times n"}/>이라 두 곱 모두 정사각이지만 크기는 다르다</>}/>],
                    ["\\sum_j A_{ij} B_{ji}", <T en={<>the <InlineMath math={"i"}/>-th diagonal entry of <InlineMath math={"AB"}/></>}
                                                ko={<><InlineMath math={"AB"}/>의 <InlineMath math={"i"}/>번째 대각 성분</>}/>],
                    ["\\sum_i B_{ji} A_{ij}", <T en={<>the <InlineMath math={"j"}/>-th diagonal entry of <InlineMath math={"BA"}/>: the same terms, summed in the other order</>}
                                                ko={<><InlineMath math={"BA"}/>의 <InlineMath math={"j"}/>번째 대각 성분. 같은 항들을 반대 순서로 더한 것이다</>}/>],
                ]}/>
            </Definition>
            <Proposition n="2.67" title={<T en={<>Matrix multiplication as a sum of outer products</>}
                                           ko={<>외적의 합으로 보는 행렬 곱</>}/>}>
                <BlockMath math={"A \\cdot B = \\sum_{i=1}^{k} a^{\\mathrm{col}}_i \\cdot b^{\\mathrm{row}}_i"}/>
                <Terms items={[
                    ["A, B", <T en={<>sizes <InlineMath math={"n \\times k"}/> and <InlineMath math={"k \\times m"}/></>}
                               ko={<>크기가 각각 <InlineMath math={"n \\times k"}/>, <InlineMath math={"k \\times m"}/>인 행렬</>}/>],
                    ["a^{\\mathrm{col}}_i", <T en={<>the <InlineMath math={"i"}/>-th column of <InlineMath math={"A"}/>, an <InlineMath math={"n \\times 1"}/> matrix</>}
                                              ko={<><InlineMath math={"A"}/>의 <InlineMath math={"i"}/>번째 열. <InlineMath math={"n \\times 1"}/> 행렬이다</>}/>],
                    ["b^{\\mathrm{row}}_i", <T en={<>the <InlineMath math={"i"}/>-th row of <InlineMath math={"B"}/>, a <InlineMath math={"1 \\times m"}/> matrix</>}
                                              ko={<><InlineMath math={"B"}/>의 <InlineMath math={"i"}/>번째 행. <InlineMath math={"1 \\times m"}/> 행렬이다</>}/>],
                    ["a^{\\mathrm{col}}_i \\cdot b^{\\mathrm{row}}_i", <T en={<>an outer product: a full <InlineMath math={"n \\times m"}/> matrix of rank at most one</>}
                                                                        ko={<>외적. rank가 최대 1인 <InlineMath math={"n \\times m"}/> 행렬 전체다</>}/>],
                ]}/>
                <T
                    en={<p>
                        On a <InlineMath math={"2 \\times 2"}/> pair, with the usual row-times-column rule on the left and the sum of two
                        outer products on the right:
                    </p>}
                    ko={<p>
                        <InlineMath math={"2 \\times 2"}/> 한 쌍으로 보면, 왼쪽이 보통의 행 곱하기 열 규칙이고 오른쪽이 외적 둘의 합이다.
                    </p>}
                />
                <BlockMath math={"\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}\\begin{bmatrix} 5 & 6 \\\\ 7 & 8 \\end{bmatrix} = \\begin{bmatrix} 19 & 22 \\\\ 43 & 50 \\end{bmatrix} = \\begin{bmatrix} 1 \\\\ 3 \\end{bmatrix}\\begin{bmatrix} 5 & 6 \\end{bmatrix} + \\begin{bmatrix} 2 \\\\ 4 \\end{bmatrix}\\begin{bmatrix} 7 & 8 \\end{bmatrix} = \\begin{bmatrix} 5 & 6 \\\\ 15 & 18 \\end{bmatrix} + \\begin{bmatrix} 14 & 16 \\\\ 28 & 32 \\end{bmatrix}"}/>
                <Terms items={[
                    ["\\left[\\begin{smallmatrix} 19 & 22 \\\\ 43 & 50 \\end{smallmatrix}\\right]", <T en={<>the product, for instance <InlineMath math={"19 = 1 \\cdot 5 + 2 \\cdot 7"}/></>}
                                                                                                      ko={<>곱의 결과. 예를 들어 <InlineMath math={"19 = 1 \\cdot 5 + 2 \\cdot 7"}/>이다</>}/>],
                    ["\\left[\\begin{smallmatrix} 5 & 6 \\\\ 15 & 18 \\end{smallmatrix}\\right]", <T en={<>the first outer product, whose rows are multiples of <InlineMath math={"(5, 6)"}/>: rank one</>}
                                                                                                    ko={<>첫 외적. 행이 전부 <InlineMath math={"(5, 6)"}/>의 배수라 rank가 1이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Pulling the sum out of the matrix is the whole derivation, and the formula is worth
                        carrying because it exhibits a product as a sum of rank-one pieces, which is what the
                        SVD in Chapter 4 and the rank-one measurement updates in Chapter 5 are made of.
                    </p>}
                    ko={<p>
                        합을 행렬 밖으로 빼내는 것이 유도의 전부이고, 이 형태를 들고 다닐 값어치가 있는 이유는
                        곱을 rank 1짜리 조각들의 합으로 드러내기 때문이다. 4장의 SVD와 5장의 rank 1 측정
                        갱신이 바로 그 조각들로 되어 있다.
                    </p>}
                />
            </Proposition>
            <Proposition n="2.68" title={<T en={<>Matrix inversion lemma</>} ko={<>행렬 역행렬 보조정리</>}/>}>
                <T
                    en={<p>
                        Suppose <InlineMath math={"A"}/>, <InlineMath math={"C"}/>, and{" "}
                        <InlineMath math={"(C^{-1} + D A^{-1} B)"}/> are square and invertible, with the sizes
                        chosen so the products below make sense. Then{" "}
                        <InlineMath math={"A + BCD"}/> is invertible and
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>, <InlineMath math={"C"}/>,{" "}
                        <InlineMath math={"(C^{-1} + D A^{-1} B)"}/>가 정사각이고 가역이며 아래 곱이 말이
                        되도록 크기가 맞춰져 있다고 하자. 그러면 <InlineMath math={"A + BCD"}/>가 가역이고
                    </p>}
                />
                <BlockMath math={"(A + BCD)^{-1} = A^{-1} - A^{-1} B (C^{-1} + D A^{-1} B)^{-1} D A^{-1}"}/>
                <Terms items={[
                    ["A", <T en={<>the matrix whose inverse you already have, typically a prior covariance</>}
                            ko={<>역행렬을 이미 갖고 있는 행렬. 보통은 사전 공분산이다</>}/>],
                    ["BCD", <T en={<>the update, usually low rank: <InlineMath math={"B"}/> is tall and thin</>}
                              ko={<>갱신 항. 보통 rank가 낮고 <InlineMath math={"B"}/>는 길쭉하다</>}/>],
                    ["C^{-1} + DA^{-1}B", <T en={<>a small matrix, the size of <InlineMath math={"C"}/>, and the only inverse that has to be computed</>}
                                            ko={<><InlineMath math={"C"}/>와 같은 크기의 작은 행렬. 실제로 계산해야 하는 역행렬은 이것뿐이다</>}/>],
                ]}/>
                <Proof label={t("Verification", "검증")}>
                    <T
                        en={<p>
                            The notes give no proof. Verifying one is mechanical: multiply and watch it
                            collapse. Write <InlineMath math={"S := C^{-1} + D A^{-1} B"}/> and expand the
                            product of <InlineMath math={"A + BCD"}/> with the claimed inverse:
                        </p>}
                        ko={<p>
                            원 교재는 증명을 싣지 않는다. 검증은 기계적이다. 곱해 보고 무너지는 것을 보면
                            된다. <InlineMath math={"S := C^{-1} + D A^{-1} B"}/>라 두고{" "}
                            <InlineMath math={"A + BCD"}/>와 주장된 역행렬의 곱을 전개한다.
                        </p>}
                    />
                    <BlockMath math={"(A + BCD)\\big(A^{-1} - A^{-1}B S^{-1} D A^{-1}\\big) = I - B S^{-1} D A^{-1} + BCDA^{-1} - BC(DA^{-1}B)S^{-1}DA^{-1}"}/>
                    <Terms items={[
                        ["S", <T en={<>shorthand for <InlineMath math={"C^{-1} + DA^{-1}B"}/>, the small invertible matrix</>}
                                ko={<><InlineMath math={"C^{-1} + DA^{-1}B"}/>의 줄임말. 작은 가역 행렬이다</>}/>],
                        ["I", <T en={<>from <InlineMath math={"A A^{-1}"}/>, the only term without a trailing <InlineMath math={"DA^{-1}"}/></>}
                                ko={<><InlineMath math={"A A^{-1}"}/>에서 나온 항. 뒤에 <InlineMath math={"DA^{-1}"}/>이 붙지 않는 유일한 항이다</>}/>],
                        ["BCDA^{-1}", <T en={<>from <InlineMath math={"BCD \\cdot A^{-1}"}/></>}
                                        ko={<><InlineMath math={"BCD \\cdot A^{-1}"}/>에서 나온 항</>}/>],
                    ]}/>
                    <T en={<p>Every term except <InlineMath math={"I"}/> ends in{" "}
                        <InlineMath math={"D A^{-1}"}/> and starts with <InlineMath math={"B"}/>, so factor
                        those out:</p>}
                       ko={<p><InlineMath math={"I"}/>를 뺀 모든 항이 <InlineMath math={"B"}/>로 시작해{" "}
                           <InlineMath math={"D A^{-1}"}/>로 끝나므로 그 둘을 밖으로 묶어낸다.</p>}/>
                    <BlockMath math={"= I + B\\big[\\!-S^{-1} + C - C(DA^{-1}B)S^{-1}\\big]DA^{-1} = I + B\\,C\\big[I - (C^{-1} + DA^{-1}B)S^{-1}\\big]DA^{-1}"}/>
                    <Terms items={[
                        ["-S^{-1} + C - C(DA^{-1}B)S^{-1}", <T en={<>the bracket after factoring; the middle term <InlineMath math={"C"}/> comes from <InlineMath math={"BCDA^{-1}"}/></>}
                                                              ko={<>묶어낸 뒤의 대괄호. 가운데 <InlineMath math={"C"}/>는 <InlineMath math={"BCDA^{-1}"}/>에서 온 것이다</>}/>],
                        ["-S^{-1} = -C C^{-1} S^{-1}", <T en={<>the rewriting that lets <InlineMath math={"C"}/> come out in front of the whole bracket</>}
                                                         ko={<><InlineMath math={"C"}/>를 대괄호 전체 앞으로 빼내기 위한 고쳐 쓰기</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The bracket is now{" "}
                            <InlineMath math={"I - S S^{-1} = I - I = 0"}/>, so the whole product is{" "}
                            <InlineMath math={"I"}/>. The same computation on the other side gives{" "}
                            <InlineMath math={"I"}/> as well, so <InlineMath math={"A + BCD"}/> is invertible
                            with the stated inverse.
                        </p>}
                        ko={<p>
                            대괄호는 이제 <InlineMath math={"I - S S^{-1} = I - I = 0"}/>이므로 곱 전체가{" "}
                            <InlineMath math={"I"}/>다. 반대쪽에서 같은 계산을 해도 <InlineMath math={"I"}/>가
                            나오므로 <InlineMath math={"A + BCD"}/>는 가역이고 그 역행렬이 위 식이다.
                        </p>}
                    />
                </Proof>
                <Proof label={t("Worked example (Remark 2.69)", "직접 계산해 보기 (Remark 2.69)")}>
                    <T
                        en={<p>
                            The lemma earns its keep when <InlineMath math={"A^{-1}"}/> is free and{" "}
                            <InlineMath math={"C"}/> is tiny. Take
                        </p>}
                        ko={<p>
                            이 보조정리가 값을 하는 것은 <InlineMath math={"A^{-1}"}/>이 거저 얻어지고{" "}
                            <InlineMath math={"C"}/>가 아주 작을 때다.
                        </p>}
                    />
                    <BlockMath math={"A = \\operatorname{diag}(1,\\, 0.5,\\, 0.5,\\, 1,\\, 0.5), \\quad B = \\begin{bmatrix} 1 \\\\ 0 \\\\ 2 \\\\ 0 \\\\ 3 \\end{bmatrix}, \\quad C = 0.2, \\quad D = B^\\top"}/>
                    <Terms items={[
                        ["A", <T en={<>diagonal, so <InlineMath math={"A^{-1} = \\operatorname{diag}(1, 2, 2, 1, 2)"}/> by inspection</>}
                                ko={<>대각 행렬이므로 <InlineMath math={"A^{-1} = \\operatorname{diag}(1, 2, 2, 1, 2)"}/>가 눈으로 읽힌다</>}/>],
                        ["B", <T en={<>a single column, so <InlineMath math={"BCD"}/> is a rank-one <InlineMath math={"5 \\times 5"}/> matrix</>}
                                ko={<>열 하나. 그래서 <InlineMath math={"BCD"}/>는 rank 1인 <InlineMath math={"5 \\times 5"}/> 행렬이다</>}/>],
                        ["C", <T en={<>a <InlineMath math={"1 \\times 1"}/> matrix, so <InlineMath math={"C^{-1} = 5"}/></>}
                                ko={<><InlineMath math={"1 \\times 1"}/> 행렬. <InlineMath math={"C^{-1} = 5"}/>다</>}/>],
                    ]}/>
                    <T en={<p>Everything the formula needs is a scalar:</p>}
                       ko={<p>이 식이 필요로 하는 것은 전부 스칼라다.</p>}/>
                    <BlockMath math={"A^{-1}B = \\begin{bmatrix} 1 & 0 & 4 & 0 & 6 \\end{bmatrix}^\\top, \\quad D A^{-1} B = 1 + 0 + 8 + 0 + 18 = 27, \\quad (C^{-1} + D A^{-1} B)^{-1} = \\frac{1}{5 + 27} = \\frac{1}{32}"}/>
                    <Terms items={[
                        ["A^{-1}B", <T en={<>a single column, computed by scaling the entries of <InlineMath math={"B"}/> by <InlineMath math={"1, 2, 2, 1, 2"}/></>}
                                      ko={<>열 하나. <InlineMath math={"B"}/>의 성분에 <InlineMath math={"1, 2, 2, 1, 2"}/>를 곱해 얻는다</>}/>],
                        ["DA^{-1}B", <T en={<>the scalar <InlineMath math={"B^\\top (A^{-1}B)"}/>: entrywise products <InlineMath math={"1\\cdot1, \\; 2\\cdot4, \\; 3\\cdot6"}/></>}
                                       ko={<>스칼라 <InlineMath math={"B^\\top (A^{-1}B)"}/>. 성분끼리 곱하면 <InlineMath math={"1\\cdot1, \\; 2\\cdot4, \\; 3\\cdot6"}/>이다</>}/>],
                        ["\\tfrac{1}{32}", <T en={<>the reciprocal of <InlineMath math={"5 + 27"}/>: the only division in the whole computation</>}
                                             ko={<><InlineMath math={"5 + 27"}/>의 역수. 이 계산 전체에서 나눗셈은 이것 하나다</>}/>],
                    ]}/>
                    <T en={<p>Assembling the correction, which is one outer product,</p>}
                       ko={<p>보정 항은 외적 하나이고, 그것을 조립하면</p>}/>
                    <BlockMath math={"(A + BCD)^{-1} = \\operatorname{diag}(1, 2, 2, 1, 2) - \\tfrac{1}{32}\\begin{bmatrix} 1 \\\\ 0 \\\\ 4 \\\\ 0 \\\\ 6 \\end{bmatrix}\\begin{bmatrix} 1 & 0 & 4 & 0 & 6 \\end{bmatrix} = \\begin{bmatrix} \\tfrac{31}{32} & 0 & -\\tfrac{1}{8} & 0 & -\\tfrac{3}{16} \\\\ 0 & 2 & 0 & 0 & 0 \\\\ -\\tfrac{1}{8} & 0 & \\tfrac{3}{2} & 0 & -\\tfrac{3}{4} \\\\ 0 & 0 & 0 & 1 & 0 \\\\ -\\tfrac{3}{16} & 0 & -\\tfrac{3}{4} & 0 & \\tfrac{7}{8} \\end{bmatrix}"}/>
                    <Terms items={[
                        ["\\operatorname{diag}(1,2,2,1,2)", <T en={<><InlineMath math={"A^{-1}"}/>, the part that was free</>}
                                                              ko={<><InlineMath math={"A^{-1}"}/>. 거저 얻은 부분이다</>}/>],
                        ["\\tfrac{1}{32} u u^\\top", <T en={<>the rank-one correction with <InlineMath math={"u = A^{-1}B"}/>: entry <InlineMath math={"(1,1)"}/> is <InlineMath math={"1 - \\tfrac{1}{32}"}/> and entry <InlineMath math={"(3,3)"}/> is <InlineMath math={"2 - \\tfrac{16}{32}"}/></>}
                                                       ko={<><InlineMath math={"u = A^{-1}B"}/>인 rank 1 보정 항. <InlineMath math={"(1,1)"}/> 성분이 <InlineMath math={"1 - \\tfrac{1}{32}"}/>, <InlineMath math={"(3,3)"}/> 성분이 <InlineMath math={"2 - \\tfrac{16}{32}"}/>이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            A <InlineMath math={"5 \\times 5"}/> inverse computed with one scalar division. In Chapter 5 the same move
                            turns the covariance update of the Kalman filter, nominally an inverse the size
                            of the state, into an inverse the size of the measurement.
                        </p>}
                        ko={<p>
                            <InlineMath math={"5 \\times 5"}/> 역행렬을 스칼라 나눗셈 한 번으로 얻었다. 5장에서는 같은 수가 칼만 필터의
                            공분산 갱신을, 이름상 상태 크기의 역행렬이던 것을 측정 크기의 역행렬로 바꿔 놓는다.
                        </p>}
                    />
                </Proof>
            </Proposition>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Why Robotics</h2>} ko={<h2>로봇에서 왜 필요한가</h2>}/>
            <T
                en={<p>
                    This chapter never mentions a robot either, and it is closer to the code than Chapter 1
                    was.
                </p>}
                ko={<p>
                    이 장에도 로봇은 한 번도 나오지 않지만, 1장보다는 코드에 훨씬 가깝다.
                </p>}
            />
            <T
                en={<ul>
                    <li>
                        <strong>A frame is a basis.</strong> The pose your planner publishes and the pose
                        your camera driver publishes are the same vector with two addresses, and the
                        transform between them is the change of basis matrix of Theorem 2.40. When a sign
                        convention is wrong, what you have is the wrong <InlineMath math={"P"}/>, not the
                        wrong physics.
                    </li>
                    <li>
                        <strong>Rank is observability.</strong> A calibration or SLAM problem is degenerate
                        exactly when the columns of its measurement matrix are dependent: a direction of
                        state space that no measurement reaches. Proposition 2.61 says you can detect it on{" "}
                        <InlineMath math={"A^\\top A"}/>, which is the matrix you already formed to solve the
                        problem.
                    </li>
                    <li>
                        <strong>Eigenvalues are convergence rates.</strong> An observer or a controller
                        iterates <InlineMath math={"x_{k+1} = A x_k"}/>, and in a basis of eigenvectors that
                        is <InlineMath math={"n"}/> independent scalar recursions{" "}
                        <InlineMath math={"\\alpha^i_{k+1} = \\lambda_i \\alpha^i_k"}/>. Every claim about
                        stability is a claim about <InlineMath math={"|\\lambda_i|"}/>, and Theorem 2.57 is
                        what licenses the decoupling.
                    </li>
                    <li>
                        <strong>Vectors that are not columns.</strong> A trajectory, a spline, a cost-to-go
                        function, and a covariance matrix are all vectors in the sense of Definition 2.2.
                        That is what lets Chapters 6 and 7 talk about convergence of sequences of functions
                        with the same vocabulary used for points in <InlineMath math={"\\mathbb{R}^n"}/>.
                    </li>
                    <li>
                        <strong>The inversion lemma is the Kalman filter's speed.</strong> Proposition 2.68
                        turns an inverse the size of the state into an inverse the size of the measurement.
                        For a robot with a 15-state IMU filter and a scalar range update, that is the
                        difference between a <InlineMath math={"15 \\times 15"}/> inverse per sample and a division.
                    </li>
                </ul>}
                ko={<ul>
                    <li>
                        <strong>좌표계가 곧 기저다.</strong> 플래너가 내보내는 pose와 카메라 드라이버가
                        내보내는 pose는 주소가 둘인 같은 벡터이고, 둘 사이의 변환이 Theorem 2.40의 기저 변환
                        행렬이다. 부호 규약이 틀렸을 때 틀린 것은 물리가 아니라 <InlineMath math={"P"}/>다.
                    </li>
                    <li>
                        <strong>rank가 곧 관측 가능성이다.</strong> 캘리브레이션이나 SLAM 문제가 퇴화하는
                        것은 측정 행렬의 열이 종속일 때뿐이다. 어떤 측정도 닿지 못하는 상태 공간의 방향이
                        생겼다는 뜻이다. Proposition 2.61은 그것을 <InlineMath math={"A^\\top A"}/>에서
                        확인할 수 있다고 말하는데, 그 행렬은 문제를 풀려고 이미 만들어 둔 것이다.
                    </li>
                    <li>
                        <strong>고윳값이 곧 수렴 속도다.</strong> 관측기나 제어기는{" "}
                        <InlineMath math={"x_{k+1} = A x_k"}/>를 반복하는데, 고유벡터로 이루어진 기저에서는
                        그것이 서로 독립인 스칼라 점화식{" "}
                        <InlineMath math={"\\alpha^i_{k+1} = \\lambda_i \\alpha^i_k"}/>{" "}
                        <InlineMath math={"n"}/>개다. 안정성에 대한 주장은 전부{" "}
                        <InlineMath math={"|\\lambda_i|"}/>에 대한 주장이고, 그 분리를 허락해 주는 것이
                        Theorem 2.57이다.
                    </li>
                    <li>
                        <strong>열이 아닌 벡터들.</strong> 궤적도, 스플라인도, cost-to-go 함수도, 공분산
                        행렬도 Definition 2.2의 의미에서 전부 벡터다. 6장과 7장이 함수열의 수렴을{" "}
                        <InlineMath math={"\\mathbb{R}^n"}/>의 점에 쓰던 어휘 그대로 말할 수 있는 이유가
                        그것이다.
                    </li>
                    <li>
                        <strong>역행렬 보조정리가 칼만 필터의 속도다.</strong> Proposition 2.68은 상태 크기의
                        역행렬을 측정 크기의 역행렬로 바꿔 준다. 상태가 15개인 IMU 필터에 스칼라 거리 측정을
                        얹는 로봇이라면, 표본마다 <InlineMath math={"15 \\times 15"}/> 역행렬을 푸느냐 나눗셈 한 번을 하느냐의 차이다.
                    </li>
                </ul>}
            />

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>References</h2>} ko={<h2>References</h2>}/>
            <ul>
                <li>
                    Jessy W. Grizzle, <em>ROB 501: Mathematics for Robotics</em>, University of Michigan,
                    2022. Chapter 2.{" "}
                    <a href={COURSE} target="_blank" rel="noopener noreferrer">{t("Course page", "코스 페이지")}</a>
                    {" · "}
                    <a href={NOTES_REPO} target="_blank" rel="noopener noreferrer">michiganrobotics/rob501</a>
                </li>
                <li>
                    <a href={CHEN} target="_blank" rel="noopener noreferrer">
                        Chi-Tsong Chen, <em>Linear System Theory and Design</em>
                    </a>
                    {" · "}
                    {t("the source of Definitions 2.1 and 2.2",
                        "Definition 2.1과 2.2의 출처")}
                </li>
                <li>
                    <a href={ROB101} target="_blank" rel="noopener noreferrer">ROB 101: Computational Linear Algebra</a>
                    {" · "}
                    {t("Chapter 10 proves the rank identities quoted here",
                        "여기서 인용한 rank 등식들을 10장에서 증명한다")}
                </li>
                <li>
                    <a href={DIM_R_OVER_Q} target="_blank" rel="noopener noreferrer">
                        Solutions notes, University of Oklahoma
                    </a>
                    {" · "}
                    {t("an argument that the reals over the rationals are infinite dimensional",
                        "유리수 위의 실수가 무한 차원임을 보이는 논증")}
                </li>
            </ul>
        </>
    );
};

export default Chapter2;
