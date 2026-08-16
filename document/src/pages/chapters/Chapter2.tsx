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
                    a 2 × 2 matrix or a polynomial, so when a proof feels slippery you can always drop back
                    to an example and see what went wrong. Nothing later in the course offers that comfort.
                </p>}
                ko={<p>
                    원 교재에서 이 장의 제목에는 괄호가 붙어 있다. "안전한 환경에서 증명 연습하기"다. 정확한
                    설명이다. 여기 나오는 주장은 전부 2 × 2 행렬이나 다항식으로 손수 확인할 수 있어서, 증명이
                    미끄러진다 싶으면 언제든 예로 내려가 무엇이 어긋났는지 볼 수 있다. 이 과목의 뒷부분은 그런
                    편의를 주지 않는다.
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
            <BlockMath math={"L(x) = y \\quad \\Longleftrightarrow \\quad A\\,[x]_u = [y]_v"}/>
            <Terms items={[
                ["L", <T en={<>a linear operator from one vector space to another, defined without reference to any basis</>}
                        ko={<>한 벡터 공간에서 다른 벡터 공간으로 가는 선형 연산자. 기저와 무관하게 정의된다</>}/>],
                ["x, y", <T en={<>abstract vectors: possibly matrices, polynomials, or functions</>}
                           ko={<>추상적인 벡터. 행렬일 수도, 다항식일 수도, 함수일 수도 있다</>}/>],
                ["u, v", <T en={<>a chosen basis for the domain and for the codomain</>}
                           ko={<>정의역과 공역에 각각 하나씩 골라 둔 기저</>}/>],
                ["[x]_u", <T en={<>the column of coefficients that writes <InlineMath math={"x"}/> in the basis <InlineMath math={"u"}/></>}
                            ko={<><InlineMath math={"x"}/>를 기저 <InlineMath math={"u"}/>로 적었을 때의 계수 열</>}/>],
                ["A", <T en={<>the matrix representation of <InlineMath math={"L"}/> with respect to <InlineMath math={"u"}/> and <InlineMath math={"v"}/>: the object your code actually stores</>}
                        ko={<><InlineMath math={"u"}/>와 <InlineMath math={"v"}/>에 대한 <InlineMath math={"L"}/>의 행렬 표현. 코드가 실제로 들고 있는 물건이다</>}/>],
            ]}/>
            <T
                en={<p>
                    Everything in this chapter is built so that the equivalence above is true and so that you
                    know exactly how much freedom you had in choosing <InlineMath math={"u"}/> and{" "}
                    <InlineMath math={"v"}/>. Change the basis and <InlineMath math={"A"}/> changes, while{" "}
                    <InlineMath math={"L"}/> does not.
                </p>}
                ko={<p>
                    이 장의 내용은 전부 위 동치가 성립하도록, 그리고 <InlineMath math={"u"}/>와{" "}
                    <InlineMath math={"v"}/>를 고를 때 우리에게 얼마나 자유가 있었는지 알도록 쌓아 올린 것이다.
                    기저를 바꾸면 <InlineMath math={"A"}/>는 바뀌지만 <InlineMath math={"L"}/>은 그대로다.
                </p>}
            />

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Fields and Vector Spaces</h2>} ko={<h2>체와 벡터 공간</h2>}/>
            <T
                en={<p>
                    Almost everywhere in this course the scalars are real or complex numbers. Here we name
                    the general object anyway, because the definition of a vector space needs to say what a
                    scalar is before it can say what scalar multiplication does. Keep{" "}
                    <InlineMath math={"\\mathbb{F} = \\mathbb{R}"}/> in mind as the canonical example while
                    reading the axioms.
                </p>}
                ko={<p>
                    이 과목에서 스칼라는 거의 항상 실수 아니면 복소수다. 그래도 여기서 일반적인 대상에 이름을
                    붙여 두는 이유는, 벡터 공간의 정의가 스칼라 곱을 말하기 전에 스칼라가 무엇인지부터 말해야
                    하기 때문이다. axiom을 읽는 동안에는 <InlineMath math={"\\mathbb{F} = \\mathbb{R}"}/>을
                    대표 예로 잡아 두면 된다.
                </p>}
            />
            <Definition n="2.1" title={t("Field", "체 (field)")}>
                <T
                    en={<p>
                        A <strong>field</strong> consists of a set <InlineMath math={"\\mathbb{F}"}/> of
                        elements called scalars together with two operations, addition{" "}
                        <InlineMath math={"+"}/> and multiplication <InlineMath math={"\\cdot"}/>, satisfying:
                    </p>}
                    ko={<p>
                        <strong>체</strong>는 스칼라라 부르는 원소들의 집합{" "}
                        <InlineMath math={"\\mathbb{F}"}/>와 그 위의 두 연산, 덧셈{" "}
                        <InlineMath math={"+"}/>와 곱셈 <InlineMath math={"\\cdot"}/>으로 이루어지며 다음을
                        만족한다.
                    </p>}
                />
                <T
                    en={<ol>
                        <li><strong>Closure.</strong> For every <InlineMath math={"\\vartheta, \\varpi \\in \\mathbb{F}"}/>,
                            both <InlineMath math={"\\vartheta + \\varpi"}/> and{" "}
                            <InlineMath math={"\\vartheta \\cdot \\varpi"}/> are in <InlineMath math={"\\mathbb{F}"}/>.</li>
                        <li><strong>Commutativity.</strong> <InlineMath math={"\\vartheta + \\varpi = \\varpi + \\vartheta"}/> and{" "}
                            <InlineMath math={"\\vartheta \\cdot \\varpi = \\varpi \\cdot \\vartheta"}/>.</li>
                        <li><strong>Associativity.</strong> <InlineMath math={"(\\vartheta + \\varpi) + \\varrho = \\vartheta + (\\varpi + \\varrho)"}/> and{" "}
                            <InlineMath math={"(\\vartheta \\cdot \\varpi) \\cdot \\varrho = \\vartheta \\cdot (\\varpi \\cdot \\varrho)"}/>.</li>
                        <li><strong>Distributivity.</strong> <InlineMath math={"\\vartheta \\cdot (\\varpi + \\varrho) = \\vartheta \\cdot \\varpi + \\vartheta \\cdot \\varrho"}/>.</li>
                        <li><strong>Identities.</strong> There are elements <InlineMath math={"0"}/> and{" "}
                            <InlineMath math={"1"}/> with <InlineMath math={"\\vartheta + 0 = \\vartheta"}/> and{" "}
                            <InlineMath math={"1 \\cdot \\vartheta = \\vartheta"}/> for every{" "}
                            <InlineMath math={"\\vartheta"}/>.</li>
                        <li><strong>Additive inverse.</strong> For every <InlineMath math={"\\vartheta"}/> there
                            is a <InlineMath math={"\\varpi"}/> with <InlineMath math={"\\vartheta + \\varpi = 0"}/>.</li>
                        <li><strong>Multiplicative inverse.</strong> For every{" "}
                            <InlineMath math={"\\vartheta \\neq 0"}/> there is a{" "}
                            <InlineMath math={"\\varrho"}/> with <InlineMath math={"\\vartheta \\cdot \\varrho = 1"}/>.</li>
                    </ol>}
                    ko={<ol>
                        <li><strong>닫힘.</strong> 모든 <InlineMath math={"\\vartheta, \\varpi \\in \\mathbb{F}"}/>에
                            대해 <InlineMath math={"\\vartheta + \\varpi"}/>와{" "}
                            <InlineMath math={"\\vartheta \\cdot \\varpi"}/>가 다시{" "}
                            <InlineMath math={"\\mathbb{F}"}/>에 있다.</li>
                        <li><strong>교환.</strong> <InlineMath math={"\\vartheta + \\varpi = \\varpi + \\vartheta"}/>이고{" "}
                            <InlineMath math={"\\vartheta \\cdot \\varpi = \\varpi \\cdot \\vartheta"}/>이다.</li>
                        <li><strong>결합.</strong> <InlineMath math={"(\\vartheta + \\varpi) + \\varrho = \\vartheta + (\\varpi + \\varrho)"}/>이고{" "}
                            <InlineMath math={"(\\vartheta \\cdot \\varpi) \\cdot \\varrho = \\vartheta \\cdot (\\varpi \\cdot \\varrho)"}/>이다.</li>
                        <li><strong>분배.</strong> <InlineMath math={"\\vartheta \\cdot (\\varpi + \\varrho) = \\vartheta \\cdot \\varpi + \\vartheta \\cdot \\varrho"}/>이다.</li>
                        <li><strong>항등원.</strong> 모든 <InlineMath math={"\\vartheta"}/>에 대해{" "}
                            <InlineMath math={"\\vartheta + 0 = \\vartheta"}/>,{" "}
                            <InlineMath math={"1 \\cdot \\vartheta = \\vartheta"}/>인 원소{" "}
                            <InlineMath math={"0"}/>과 <InlineMath math={"1"}/>이 있다.</li>
                        <li><strong>덧셈의 역원.</strong> 모든 <InlineMath math={"\\vartheta"}/>에 대해{" "}
                            <InlineMath math={"\\vartheta + \\varpi = 0"}/>인{" "}
                            <InlineMath math={"\\varpi"}/>가 있다.</li>
                        <li><strong>곱셈의 역원.</strong> <InlineMath math={"\\vartheta \\neq 0"}/>인 모든{" "}
                            <InlineMath math={"\\vartheta"}/>에 대해{" "}
                            <InlineMath math={"\\vartheta \\cdot \\varrho = 1"}/>인{" "}
                            <InlineMath math={"\\varrho"}/>가 있다.</li>
                    </ol>}
                />
            </Definition>
            <T
                en={<p>
                    The asymmetry between proving and disproving is the first place Chapter 1 pays off. To
                    show a set is a field you must check all seven axioms, because the definition is a{" "}
                    <InlineMath math={"\\forall"}/> over the list. To show it is not a field you exhibit one
                    failure, because the negation of that <InlineMath math={"\\forall"}/> is an{" "}
                    <InlineMath math={"\\exists"}/>.
                </p>}
                ko={<p>
                    증명과 반증의 비대칭이 1장이 처음으로 값을 하는 자리다. 어떤 집합이 체임을 보이려면 axiom
                    일곱 개를 전부 확인해야 한다. 정의가 목록 전체에 걸린{" "}
                    <InlineMath math={"\\forall"}/>이기 때문이다. 체가 아님을 보이려면 무너지는 것 하나만
                    제시하면 된다. 그 <InlineMath math={"\\forall"}/>의 부정이{" "}
                    <InlineMath math={"\\exists"}/>이기 때문이다.
                </p>}
            />
            <table className="table-center">
                <thead>
                <tr>
                    <th>{t("Set", "집합")}</th>
                    <th>{t("Field?", "체인가?")}</th>
                    <th>{t("Why", "이유")}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><InlineMath math={"\\mathbb{R}, \\; \\mathbb{C}, \\; \\mathbb{Q}"}/></td>
                    <td>{t("yes", "그렇다")}</td>
                    <td>{t("all seven axioms hold", "axiom 일곱 개가 모두 성립한다")}</td>
                </tr>
                <tr>
                    <td>{t("the irrationals", "무리수")}</td>
                    <td>{t("no", "아니다")}</td>
                    <td>{t("axiom 1 fails: √2 · √2 = 2 is rational", "axiom 1이 깨진다. √2 · √2 = 2는 유리수다")}</td>
                </tr>
                <tr>
                    <td>{t("2 × 2 real matrices", "2 × 2 실행렬")}</td>
                    <td>{t("no", "아니다")}</td>
                    <td>{t("axiom 2 fails: multiplication does not commute", "axiom 2가 깨진다. 곱셈이 교환되지 않는다")}</td>
                </tr>
                <tr>
                    <td>{t("2 × 2 real diagonal matrices", "2 × 2 실대각행렬")}</td>
                    <td>{t("no", "아니다")}</td>
                    <td>{t("axiom 7 fails: diag(1, 0) has no inverse", "axiom 7이 깨진다. diag(1, 0)에는 역원이 없다")}</td>
                </tr>
                </tbody>
            </table>
            <Definition n="2.2" title={t("Vector space", "벡터 공간")}>
                <T
                    en={<p>
                        A <strong>vector space</strong> over a field <InlineMath math={"\\mathbb{F}"}/>,
                        written <InlineMath math={"(X, \\mathbb{F})"}/>, consists of a set{" "}
                        <InlineMath math={"X"}/> of elements called vectors, the field{" "}
                        <InlineMath math={"\\mathbb{F}"}/>, and two operations, vector addition and scalar
                        multiplication, such that:
                    </p>}
                    ko={<p>
                        체 <InlineMath math={"\\mathbb{F}"}/> 위의 <strong>벡터 공간</strong>{" "}
                        <InlineMath math={"(X, \\mathbb{F})"}/>은 벡터라 부르는 원소들의 집합{" "}
                        <InlineMath math={"X"}/>, 체 <InlineMath math={"\\mathbb{F}"}/>, 그리고 벡터 덧셈과
                        스칼라 곱이라는 두 연산으로 이루어지며 다음을 만족한다.
                    </p>}
                />
                <T
                    en={<ol>
                        <li>Addition is closed: <InlineMath math={"v^1 + v^2 \\in X"}/> for all{" "}
                            <InlineMath math={"v^1, v^2 \\in X"}/>.</li>
                        <li>Addition is commutative.</li>
                        <li>Addition is associative.</li>
                        <li>There is a vector <InlineMath math={"0 \\in X"}/>, the <strong>origin</strong>,
                            with <InlineMath math={"0 + v = v"}/> for all <InlineMath math={"v"}/>.</li>
                        <li>Every <InlineMath math={"v \\in X"}/> has a <InlineMath math={"\\bar v \\in X"}/> with{" "}
                            <InlineMath math={"v + \\bar v = 0"}/>.</li>
                        <li>Scalar multiplication is closed: <InlineMath math={"\\vartheta \\cdot v \\in X"}/> for
                            all <InlineMath math={"\\vartheta \\in \\mathbb{F}"}/> and{" "}
                            <InlineMath math={"v \\in X"}/>.</li>
                        <li>Scalar multiplication is associative:{" "}
                            <InlineMath math={"\\vartheta \\cdot (\\varpi \\cdot v) = (\\vartheta \\cdot \\varpi) \\cdot v"}/>.</li>
                        <li>Scalar multiplication distributes over vector addition:{" "}
                            <InlineMath math={"\\vartheta \\cdot (v^1 + v^2) = \\vartheta \\cdot v^1 + \\vartheta \\cdot v^2"}/>.</li>
                        <li>Scalar multiplication distributes over scalar addition:{" "}
                            <InlineMath math={"(\\vartheta + \\varpi) \\cdot v = \\vartheta \\cdot v + \\varpi \\cdot v"}/>.</li>
                        <li><InlineMath math={"1 \\cdot v = v"}/>, where <InlineMath math={"1"}/> is the unit
                            of <InlineMath math={"\\mathbb{F}"}/>.</li>
                    </ol>}
                    ko={<ol>
                        <li>덧셈이 닫혀 있다. 모든 <InlineMath math={"v^1, v^2 \\in X"}/>에 대해{" "}
                            <InlineMath math={"v^1 + v^2 \\in X"}/>이다.</li>
                        <li>덧셈이 교환된다.</li>
                        <li>덧셈이 결합된다.</li>
                        <li>모든 <InlineMath math={"v"}/>에 대해 <InlineMath math={"0 + v = v"}/>인 벡터{" "}
                            <InlineMath math={"0 \\in X"}/>, 곧 <strong>원점</strong>이 있다.</li>
                        <li>모든 <InlineMath math={"v \\in X"}/>에 대해 <InlineMath math={"v + \\bar v = 0"}/>인{" "}
                            <InlineMath math={"\\bar v \\in X"}/>가 있다.</li>
                        <li>스칼라 곱이 닫혀 있다. 모든 <InlineMath math={"\\vartheta \\in \\mathbb{F}"}/>,{" "}
                            <InlineMath math={"v \\in X"}/>에 대해{" "}
                            <InlineMath math={"\\vartheta \\cdot v \\in X"}/>이다.</li>
                        <li>스칼라 곱이 결합된다.{" "}
                            <InlineMath math={"\\vartheta \\cdot (\\varpi \\cdot v) = (\\vartheta \\cdot \\varpi) \\cdot v"}/>이다.</li>
                        <li>스칼라 곱이 벡터 덧셈에 분배된다.{" "}
                            <InlineMath math={"\\vartheta \\cdot (v^1 + v^2) = \\vartheta \\cdot v^1 + \\vartheta \\cdot v^2"}/>이다.</li>
                        <li>스칼라 곱이 스칼라 덧셈에 분배된다.{" "}
                            <InlineMath math={"(\\vartheta + \\varpi) \\cdot v = \\vartheta \\cdot v + \\varpi \\cdot v"}/>이다.</li>
                        <li><InlineMath math={"\\mathbb{F}"}/>의 단위원 <InlineMath math={"1"}/>에 대해{" "}
                            <InlineMath math={"1 \\cdot v = v"}/>이다.</li>
                    </ol>}
                />
            </Definition>
            <Remark title={t("Superscripts are labels, not powers", "위첨자는 지수가 아니라 이름표다")}>
                <T
                    en={<p>
                        Following the notes, <InlineMath math={"v^1, v^2, v^3"}/> name different vectors.
                        Nothing is being raised to a power. Subscripts are reserved for the entries of a
                        column, as in <InlineMath math={"\\vartheta_i"}/>.
                    </p>}
                    ko={<p>
                        원 교재를 따라 <InlineMath math={"v^1, v^2, v^3"}/>은 서로 다른 벡터의 이름이다.
                        거듭제곱이 아니다. 아래첨자는 <InlineMath math={"\\vartheta_i"}/>처럼 열의 성분에
                        쓴다.
                    </p>}
                />
            </Remark>
            <Example n="2.3" title={t("Vector spaces you already use", "이미 쓰고 있는 벡터 공간들")}>
                <T
                    en={<ul>
                        <li>Every field over itself: <InlineMath math={"(\\mathbb{R}, \\mathbb{R})"}/>,{" "}
                            <InlineMath math={"(\\mathbb{C}, \\mathbb{C})"}/>,{" "}
                            <InlineMath math={"(\\mathbb{Q}, \\mathbb{Q})"}/>.</li>
                        <li><InlineMath math={"(\\mathbb{C}, \\mathbb{R})"}/>: a real scalar times a complex
                            number is a complex number, so the axioms go through.</li>
                        <li><InlineMath math={"(\\mathbb{F}^n, \\mathbb{F})"}/>, columns of <InlineMath math={"n"}/> scalars,
                            with entrywise addition and scalar multiplication.</li>
                        <li><InlineMath math={"(\\mathbb{F}^{n \\times m}, \\mathbb{F})"}/>: matrices are
                            vectors too.</li>
                        <li><InlineMath math={"X = \\{f : D \\to \\mathbb{R}\\}"}/> over{" "}
                            <InlineMath math={"\\mathbb{R}"}/>, with{" "}
                            <InlineMath math={"(f+g)(t) := f(t) + g(t)"}/> and{" "}
                            <InlineMath math={"(\\vartheta \\cdot f)(t) := \\vartheta \\cdot f(t)"}/>.</li>
                        <li><InlineMath math={"(\\mathbb{R}, \\mathbb{Q})"}/>: the vectors are real numbers
                            and the scalars are rationals. It is useless in robotics and worth ten seconds of
                            your attention anyway, for reasons that appear under dimension.</li>
                    </ul>}
                    ko={<ul>
                        <li>모든 체는 자기 자신 위의 벡터 공간이다.{" "}
                            <InlineMath math={"(\\mathbb{R}, \\mathbb{R})"}/>,{" "}
                            <InlineMath math={"(\\mathbb{C}, \\mathbb{C})"}/>,{" "}
                            <InlineMath math={"(\\mathbb{Q}, \\mathbb{Q})"}/>.</li>
                        <li><InlineMath math={"(\\mathbb{C}, \\mathbb{R})"}/>. 실수 스칼라와 복소수의 곱이
                            복소수이므로 axiom이 그대로 통과한다.</li>
                        <li><InlineMath math={"(\\mathbb{F}^n, \\mathbb{F})"}/>. 스칼라{" "}
                            <InlineMath math={"n"}/>개를 쌓은 열이고, 덧셈과 스칼라 곱은 성분별로 한다.</li>
                        <li><InlineMath math={"(\\mathbb{F}^{n \\times m}, \\mathbb{F})"}/>. 행렬도 벡터다.</li>
                        <li><InlineMath math={"\\mathbb{R}"}/> 위의{" "}
                            <InlineMath math={"X = \\{f : D \\to \\mathbb{R}\\}"}/>. 연산은{" "}
                            <InlineMath math={"(f+g)(t) := f(t) + g(t)"}/>,{" "}
                            <InlineMath math={"(\\vartheta \\cdot f)(t) := \\vartheta \\cdot f(t)"}/>로 정의한다.</li>
                        <li><InlineMath math={"(\\mathbb{R}, \\mathbb{Q})"}/>. 벡터가 실수이고 스칼라가
                            유리수다. 로봇에는 쓸모가 없지만 차원 절에서 드러날 이유로 십 초쯤 볼 값어치는 있다.</li>
                    </ul>}
                />
                <T
                    en={<p>
                        Proving that the function space is a vector space means checking all ten axioms. Here
                        is axiom 8, to show what the work looks like: the whole method is to evaluate both
                        sides at a point <InlineMath math={"t"}/> and then use what we already know about real
                        numbers.
                    </p>}
                    ko={<p>
                        함수 공간이 벡터 공간임을 보이려면 axiom 열 개를 다 확인해야 한다. 그 일이 어떤
                        모양인지 보여 주려고 axiom 8을 확인해 본다. 방법은 하나다. 양변을 점{" "}
                        <InlineMath math={"t"}/>에서 값매김하고, 실수에 대해 이미 아는 것을 쓴다.
                    </p>}
                />
                <Proof label={t("Proof of axiom 8", "axiom 8 확인")}>
                    <T en={<p>We must show that the two functions below are equal:</p>}
                       ko={<p>아래 두 함수가 같음을 보여야 한다.</p>}/>
                    <BlockMath math={"\\vartheta \\cdot (f + g) = \\vartheta \\cdot f + \\vartheta \\cdot g"}/>
                    <Terms items={[
                        ["f, g", <T en={<>elements of <InlineMath math={"X"}/>, that is, functions from <InlineMath math={"D"}/> to <InlineMath math={"\\mathbb{R}"}/></>}
                                   ko={<><InlineMath math={"X"}/>의 원소. 즉 <InlineMath math={"D"}/>에서 <InlineMath math={"\\mathbb{R}"}/>로 가는 함수</>}/>],
                        ["\\vartheta", <T en={<>a scalar in <InlineMath math={"\\mathbb{F} = \\mathbb{R}"}/></>}
                                         ko={<><InlineMath math={"\\mathbb{F} = \\mathbb{R}"}/>의 스칼라</>}/>],
                        ["f + g", <T en={<>the function defined pointwise by <InlineMath math={"(f+g)(t) := f(t) + g(t)"}/></>}
                                    ko={<>점마다 <InlineMath math={"(f+g)(t) := f(t) + g(t)"}/>로 정의한 함수</>}/>],
                    ]}/>
                    <T en={<p>Two functions are equal when they agree at every point, so fix{" "}
                        <InlineMath math={"t \\in D"}/> and expand the left side:</p>}
                       ko={<p>두 함수가 같다는 것은 모든 점에서 값이 같다는 뜻이므로{" "}
                           <InlineMath math={"t \\in D"}/>를 하나 고정하고 좌변을 전개한다.</p>}/>
                    <BlockMath math={"[\\vartheta \\cdot (f + g)](t) := \\vartheta \\cdot [f+g](t) = \\vartheta \\cdot [f(t) + g(t)] = \\vartheta \\cdot f(t) + \\vartheta \\cdot g(t)"}/>
                    <Terms items={[
                        ["t", <T en={<>an arbitrary point of the domain <InlineMath math={"D"}/>, fixed for the rest of the argument</>}
                                ko={<>정의역 <InlineMath math={"D"}/>의 임의의 점. 이 논증 동안 고정한다</>}/>],
                        ["[\\,\\cdot\\,](t)", <T en={<>evaluation of a function at <InlineMath math={"t"}/>, which turns vectors into real numbers</>}
                                                ko={<>함수를 <InlineMath math={"t"}/>에서 값매김하는 연산. 벡터를 실수로 바꾼다</>}/>],
                        ["\\vartheta \\cdot [f(t) + g(t)]", <T en={<>now an identity about real numbers, where distributivity is already known</>}
                                                              ko={<>이제부터는 실수에 대한 식이고, 분배법칙은 이미 아는 사실이다</>}/>],
                    ]}/>
                    <T en={<p>Now the right side, by the same two definitions:</p>}
                       ko={<p>같은 두 정의로 우변도 전개한다.</p>}/>
                    <BlockMath math={"[\\vartheta \\cdot f + \\vartheta \\cdot g](t) := [\\vartheta \\cdot f](t) + [\\vartheta \\cdot g](t) = \\vartheta \\cdot f(t) + \\vartheta \\cdot g(t)"}/>
                    <Terms items={[
                        ["\\vartheta \\cdot f", <T en={<>the function defined pointwise by <InlineMath math={"(\\vartheta \\cdot f)(t) := \\vartheta \\cdot f(t)"}/></>}
                                                  ko={<>점마다 <InlineMath math={"(\\vartheta \\cdot f)(t) := \\vartheta \\cdot f(t)"}/>로 정의한 함수</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The two right-hand sides are the same real number, and{" "}
                            <InlineMath math={"t"}/> was arbitrary, so the two functions agree everywhere and
                            axiom 8 holds. The other nine go the same way.
                        </p>}
                        ko={<p>
                            두 전개의 끝이 같은 실수이고 <InlineMath math={"t"}/>는 임의로 잡았으므로 두 함수는
                            모든 점에서 같고 axiom 8이 성립한다. 나머지 아홉 개도 같은 방식이다.
                        </p>}
                    />
                </Proof>
            </Example>
            <Example n="2.4" title={t("Non-examples", "벡터 공간이 아닌 것들")}>
                <T
                    en={<ul>
                        <li><InlineMath math={"(\\mathbb{R}, \\mathbb{C})"}/>: a complex scalar times a real
                            vector leaves the set, so scalar multiplication is not even defined into{" "}
                            <InlineMath math={"X"}/>.</li>
                        <li><InlineMath math={"X = \\{x \\in \\mathbb{R} \\mid x \\ge 0\\}"}/> over{" "}
                            <InlineMath math={"\\mathbb{R}"}/>: multiply by{" "}
                            <InlineMath math={"-1"}/> and you are outside <InlineMath math={"X"}/>.</li>
                        <li><InlineMath math={"(\\mathbb{Q}, \\mathbb{R})"}/>: sums of rationals are fine, but
                            an irrational scalar times a rational vector is not rational.</li>
                    </ul>}
                    ko={<ul>
                        <li><InlineMath math={"(\\mathbb{R}, \\mathbb{C})"}/>. 복소 스칼라와 실벡터의 곱이
                            집합을 벗어나므로 스칼라 곱이 <InlineMath math={"X"}/> 안으로 정의되지도 않는다.</li>
                        <li><InlineMath math={"\\mathbb{R}"}/> 위의{" "}
                            <InlineMath math={"X = \\{x \\in \\mathbb{R} \\mid x \\ge 0\\}"}/>.{" "}
                            <InlineMath math={"-1"}/>을 곱하면 <InlineMath math={"X"}/> 밖으로 나간다.</li>
                        <li><InlineMath math={"(\\mathbb{Q}, \\mathbb{R})"}/>. 유리수끼리의 합은 괜찮지만
                            무리수 스칼라와 유리수 벡터의 곱은 유리수가 아니다.</li>
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
            <Definition n="2.5" title={t("Subset and set equality", "부분집합과 집합의 같음")}>
                <BlockMath math={"(A \\subset B) \\iff (a \\in A \\implies a \\in B), \\qquad (A = B) \\iff (A \\subset B \\ \\text{and} \\ B \\subset A)"}/>
                <Terms items={[
                    ["A, B", <T en={<>any two sets</>} ko={<>임의의 두 집합</>}/>],
                    ["\\subset", <T en={<>"is a subset of", allowing <InlineMath math={"A = B"}/>: this course never uses a strict-subset symbol</>}
                                   ko={<>"부분집합이다". <InlineMath math={"A = B"}/>도 허용한다. 이 과목에서는 진부분집합 기호를 쓰지 않는다</>}/>],
                    ["\\implies", <T en={<>logical implication, as in Chapter 1</>} ko={<>1장에서 쓴 논리적 implication</>}/>],
                    ["A = B", <T en={<>set equality, proved as two inclusions: this is the standard two-part proof</>}
                               ko={<>집합의 같음. 포함 관계 두 개로 증명한다. 흔히 쓰는 두 갈래 증명이다</>}/>],
                ]}/>
            </Definition>
            <Definition n="2.6" title={t("Subspace", "부분 공간")}>
                <T
                    en={<p>
                        Let <InlineMath math={"(X, \\mathbb{F})"}/> be a vector space and{" "}
                        <InlineMath math={"Y \\subset X"}/>. Then <InlineMath math={"Y"}/> is a{" "}
                        <strong>subspace</strong> if <InlineMath math={"(Y, \\mathbb{F})"}/> is itself a
                        vector space under the addition and scalar multiplication of{" "}
                        <InlineMath math={"(X, \\mathbb{F})"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(X, \\mathbb{F})"}/>이 벡터 공간이고{" "}
                        <InlineMath math={"Y \\subset X"}/>라 하자.{" "}
                        <InlineMath math={"(X, \\mathbb{F})"}/>의 덧셈과 스칼라 곱을 그대로 써서{" "}
                        <InlineMath math={"(Y, \\mathbb{F})"}/>이 벡터 공간이 되면{" "}
                        <InlineMath math={"Y"}/>를 <strong>부분 공간</strong>이라 한다.
                    </p>}
                />
            </Definition>
            <Remark n="2.7" title={t("Check the origin first", "원점부터 확인한다")}>
                <T
                    en={<p>
                        Proving a set is a subspace from the definition means the ten axioms again. Proving
                        it is not means finding one violation, and the fastest place to look is{" "}
                        <InlineMath math={"0 \\in Y"}/>. A set that misses the origin is disqualified
                        immediately, and in practice that is how most candidates fail.
                    </p>}
                    ko={<p>
                        정의만으로 부분 공간임을 보이려면 또 axiom 열 개다. 아님을 보이려면 위반 하나를 찾으면
                        되고, 가장 빨리 볼 곳은 <InlineMath math={"0 \\in Y"}/>다. 원점을 놓친 집합은 그
                        자리에서 탈락이고, 실제로 후보들이 무너지는 방식도 대개 이것이다.
                    </p>}
                />
            </Remark>
            <Proposition n="2.8" title={t("Tools to check that something is a subspace",
                "부분 공간인지 확인하는 도구")}>
                <T
                    en={<p>
                        Let <InlineMath math={"(X, \\mathbb{F})"}/> be a vector space and{" "}
                        <InlineMath math={"Y \\subset X"}/> be nonempty. The following are equivalent.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(X, \\mathbb{F})"}/>이 벡터 공간이고{" "}
                        <InlineMath math={"Y \\subset X"}/>가 공집합이 아니라 하자. 다음은 서로 동치다.
                    </p>}
                />
                <T
                    en={<ol>
                        <li><InlineMath math={"(Y, \\mathbb{F})"}/> is a subspace of{" "}
                            <InlineMath math={"(X, \\mathbb{F})"}/>.</li>
                        <li><InlineMath math={"\\forall v^1, v^2 \\in Y, \\; v^1 + v^2 \\in Y"}/> and{" "}
                            <InlineMath math={"\\forall y \\in Y, \\forall \\vartheta \\in \\mathbb{F}, \\; \\vartheta y \\in Y"}/>.</li>
                        <li><InlineMath math={"\\forall v^1, v^2 \\in Y, \\forall \\vartheta \\in \\mathbb{F}, \\; \\vartheta \\cdot v^1 + v^2 \\in Y"}/>.</li>
                        <li><InlineMath math={"\\forall v^1, v^2 \\in Y, \\forall \\vartheta_1, \\vartheta_2 \\in \\mathbb{F}, \\; \\vartheta_1 \\cdot v^1 + \\vartheta_2 \\cdot v^2 \\in Y"}/>.</li>
                    </ol>}
                    ko={<ol>
                        <li><InlineMath math={"(Y, \\mathbb{F})"}/>이{" "}
                            <InlineMath math={"(X, \\mathbb{F})"}/>의 부분 공간이다.</li>
                        <li><InlineMath math={"\\forall v^1, v^2 \\in Y, \\; v^1 + v^2 \\in Y"}/>이고{" "}
                            <InlineMath math={"\\forall y \\in Y, \\forall \\vartheta \\in \\mathbb{F}, \\; \\vartheta y \\in Y"}/>이다.</li>
                        <li><InlineMath math={"\\forall v^1, v^2 \\in Y, \\forall \\vartheta \\in \\mathbb{F}, \\; \\vartheta \\cdot v^1 + v^2 \\in Y"}/>이다.</li>
                        <li><InlineMath math={"\\forall v^1, v^2 \\in Y, \\forall \\vartheta_1, \\vartheta_2 \\in \\mathbb{F}, \\; \\vartheta_1 \\cdot v^1 + \\vartheta_2 \\cdot v^2 \\in Y"}/>이다.</li>
                    </ol>}
                />
                <Proof>
                    <T
                        en={<p>
                            <strong>(a) ⟹ (b).</strong> A vector space is closed under its own addition and
                            scalar multiplication, which is exactly (b).
                        </p>}
                        ko={<p>
                            <strong>(a) ⟹ (b).</strong> 벡터 공간은 자기 덧셈과 스칼라 곱에 대해 닫혀 있고,
                            그것이 바로 (b)다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>(b) ⟹ (c).</strong> Given <InlineMath math={"v^1, v^2 \\in Y"}/> and{" "}
                            <InlineMath math={"\\vartheta \\in \\mathbb{F}"}/>, scalar closure puts{" "}
                            <InlineMath math={"\\vartheta v^1"}/> in <InlineMath math={"Y"}/>, and additive
                            closure then puts the sum in <InlineMath math={"Y"}/>.
                        </p>}
                        ko={<p>
                            <strong>(b) ⟹ (c).</strong> <InlineMath math={"v^1, v^2 \\in Y"}/>,{" "}
                            <InlineMath math={"\\vartheta \\in \\mathbb{F}"}/>가 주어지면 스칼라 곱의 닫힘이{" "}
                            <InlineMath math={"\\vartheta v^1"}/>을 <InlineMath math={"Y"}/> 안에 넣고, 이어서
                            덧셈의 닫힘이 그 합을 <InlineMath math={"Y"}/> 안에 넣는다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>(c) ⟹ (d).</strong> First apply (c) with both vectors equal to{" "}
                            <InlineMath math={"v^2"}/> and the scalar <InlineMath math={"\\vartheta_2 - 1"}/>:
                        </p>}
                        ko={<p>
                            <strong>(c) ⟹ (d).</strong> 먼저 두 벡터를 모두{" "}
                            <InlineMath math={"v^2"}/>로, 스칼라를{" "}
                            <InlineMath math={"\\vartheta_2 - 1"}/>로 놓고 (c)를 쓴다.
                        </p>}
                    />
                    <BlockMath math={"(\\vartheta_2 - 1) \\cdot v^2 + v^2 = \\vartheta_2 \\cdot v^2 \\in Y"}/>
                    <Terms items={[
                        ["v^2", <T en={<>any element of <InlineMath math={"Y"}/>, used twice in the same application of (c)</>}
                                  ko={<><InlineMath math={"Y"}/>의 임의의 원소. (c)를 한 번 쓰면서 두 자리에 같이 넣었다</>}/>],
                        ["\\vartheta_2", <T en={<>the scalar we want in front of <InlineMath math={"v^2"}/></>}
                                           ko={<><InlineMath math={"v^2"}/> 앞에 붙이고 싶은 스칼라</>}/>],
                        ["\\vartheta_2 - 1", <T en={<>the scalar handed to (c), chosen so that adding <InlineMath math={"v^2"}/> back gives <InlineMath math={"\\vartheta_2 v^2"}/></>}
                                               ko={<>(c)에 넘긴 스칼라. <InlineMath math={"v^2"}/>를 다시 더하면 <InlineMath math={"\\vartheta_2 v^2"}/>가 되도록 고른 값이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Now apply (c) once more, to <InlineMath math={"v^1"}/> with scalar{" "}
                            <InlineMath math={"\\vartheta_1"}/> and to the vector{" "}
                            <InlineMath math={"\\vartheta_2 v^2 \\in Y"}/> just produced, giving{" "}
                            <InlineMath math={"\\vartheta_1 v^1 + \\vartheta_2 v^2 \\in Y"}/>, which is (d).
                        </p>}
                        ko={<p>
                            이제 (c)를 한 번 더, <InlineMath math={"v^1"}/>과 스칼라{" "}
                            <InlineMath math={"\\vartheta_1"}/>, 그리고 방금 얻은{" "}
                            <InlineMath math={"\\vartheta_2 v^2 \\in Y"}/>에 쓰면{" "}
                            <InlineMath math={"\\vartheta_1 v^1 + \\vartheta_2 v^2 \\in Y"}/>이고 이것이 (d)다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>(d) ⟹ (a).</strong> Because <InlineMath math={"Y"}/> is nonempty, pick
                            any <InlineMath math={"v \\in Y"}/> and take{" "}
                            <InlineMath math={"\\vartheta_1 = \\vartheta_2 = 0"}/>:
                        </p>}
                        ko={<p>
                            <strong>(d) ⟹ (a).</strong> <InlineMath math={"Y"}/>가 공집합이 아니므로{" "}
                            <InlineMath math={"v \\in Y"}/>를 아무거나 하나 잡고{" "}
                            <InlineMath math={"\\vartheta_1 = \\vartheta_2 = 0"}/>으로 두면 된다.
                        </p>}
                    />
                    <BlockMath math={"0 \\cdot v + 0 \\cdot v = 0 \\in Y, \\qquad (-1) \\cdot v + 0 \\cdot v = \\bar v \\in Y"}/>
                    <Terms items={[
                        ["v", <T en={<>any element of <InlineMath math={"Y"}/>, which exists because <InlineMath math={"Y"}/> is nonempty</>}
                                ko={<><InlineMath math={"Y"}/>의 원소 아무거나. <InlineMath math={"Y"}/>가 공집합이 아니므로 존재한다</>}/>],
                        ["0", <T en={<>the zero vector of <InlineMath math={"X"}/>, now shown to lie in <InlineMath math={"Y"}/>: axiom 4</>}
                                ko={<><InlineMath math={"X"}/>의 영벡터. 이제 <InlineMath math={"Y"}/> 안에 있음이 밝혀졌다. axiom 4다</>}/>],
                        ["\\bar v", <T en={<>the additive inverse of <InlineMath math={"v"}/>: axiom 5</>}
                                      ko={<><InlineMath math={"v"}/>의 덧셈 역원. axiom 5다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Taking <InlineMath math={"\\vartheta_2 = 0"}/> or{" "}
                            <InlineMath math={"\\vartheta_1 = \\vartheta_2 = 1"}/> gives the two closure
                            axioms 1 and 6. The remaining axioms, commutativity, associativity and the two
                            distributive laws, are identities that hold for <em>all</em> vectors of{" "}
                            <InlineMath math={"X"}/>, so they hold in particular for those in{" "}
                            <InlineMath math={"Y"}/>. Hence <InlineMath math={"(Y, \\mathbb{F})"}/> is a
                            vector space.
                        </p>}
                        ko={<p>
                            <InlineMath math={"\\vartheta_2 = 0"}/>이나{" "}
                            <InlineMath math={"\\vartheta_1 = \\vartheta_2 = 1"}/>로 두면 닫힘 axiom 1과 6이
                            나온다. 남은 axiom, 곧 교환, 결합, 두 분배 법칙은{" "}
                            <InlineMath math={"X"}/>의 <em>모든</em> 벡터에서 성립하는 항등식이므로{" "}
                            <InlineMath math={"Y"}/>의 벡터에서도 당연히 성립한다. 따라서{" "}
                            <InlineMath math={"(Y, \\mathbb{F})"}/>은 벡터 공간이다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Remark title={t("Why nonempty is not a technicality", "공집합이 아니라는 조건은 형식이 아니다")}>
                <T
                    en={<p>
                        The condition <InlineMath math={"Y \\neq \\emptyset"}/> is what lets us produce{" "}
                        <InlineMath math={"0"}/> at all. Drop it and (b), (c), (d) are vacuously true for{" "}
                        <InlineMath math={"Y = \\emptyset"}/>, which is not a vector space, since axiom 4
                        demands a zero vector. In practice you satisfy the condition by exhibiting{" "}
                        <InlineMath math={"0 \\in Y"}/>, which is Remark 2.7 again.
                    </p>}
                    ko={<p>
                        <InlineMath math={"Y \\neq \\emptyset"}/>이라는 조건이 있어야 애초에{" "}
                        <InlineMath math={"0"}/>을 만들어 낼 수 있다. 이 조건을 빼면{" "}
                        <InlineMath math={"Y = \\emptyset"}/>에 대해 (b), (c), (d)가 공허하게 참이 되는데,
                        공집합은 axiom 4가 영벡터를 요구하므로 벡터 공간이 아니다. 실전에서는{" "}
                        <InlineMath math={"0 \\in Y"}/>를 보이는 것으로 이 조건을 채우고, 그것이 결국 Remark
                        2.7이다.
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
            <Example n="2.9" title={t("A line through the origin is a subspace",
                "원점을 지나는 직선은 부분 공간이다")}>
                <T
                    en={<p>
                        Take <InlineMath math={"(X, \\mathbb{F}) = (\\mathbb{R}^2, \\mathbb{R})"}/> and the
                        candidate set
                    </p>}
                    ko={<p>
                        <InlineMath math={"(X, \\mathbb{F}) = (\\mathbb{R}^2, \\mathbb{R})"}/>과 후보 집합을
                        다음과 같이 잡는다.
                    </p>}
                />
                <BlockMath math={"Y := \\left\\{ \\begin{bmatrix} \\varpi \\\\ 2\\varpi \\end{bmatrix} \\;\\middle|\\; \\varpi \\in \\mathbb{R} \\right\\} \\subset X"}/>
                <Terms items={[
                    ["\\varpi", <T en={<>the free parameter that sweeps out the set, one point per real number</>}
                                  ko={<>집합을 훑는 자유 매개변수. 실수 하나마다 점 하나가 대응한다</>}/>],
                    ["Y", <T en={<>the line of slope 2 through the origin, written as a set of columns</>}
                            ko={<>원점을 지나는 기울기 2인 직선. 열벡터의 집합으로 적었다</>}/>],
                ]}/>
                <Proof>
                    <T en={<p>Use Proposition 2.8 (b). For two elements of <InlineMath math={"Y"}/>,</p>}
                       ko={<p>Proposition 2.8 (b)를 쓴다. <InlineMath math={"Y"}/>의 두 원소에 대해</p>}/>
                    <BlockMath math={"\\begin{bmatrix} \\varpi_1 \\\\ 2\\varpi_1 \\end{bmatrix} + \\begin{bmatrix} \\varpi_2 \\\\ 2\\varpi_2 \\end{bmatrix} = \\begin{bmatrix} \\varpi_1 + \\varpi_2 \\\\ 2(\\varpi_1 + \\varpi_2) \\end{bmatrix} \\in Y"}/>
                    <Terms items={[
                        ["\\varpi_1, \\varpi_2", <T en={<>the parameters of the two chosen elements</>}
                                                   ko={<>고른 두 원소의 매개변수</>}/>],
                        ["\\varpi_1 + \\varpi_2", <T en={<>a real number, so the sum has the required form and lies in <InlineMath math={"Y"}/></>}
                                                    ko={<>실수이므로 합이 요구되는 꼴을 갖추고 <InlineMath math={"Y"}/>에 든다</>}/>],
                    ]}/>
                    <T en={<p>and for a scalar <InlineMath math={"\\vartheta \\in \\mathbb{R}"}/>,</p>}
                       ko={<p>스칼라 <InlineMath math={"\\vartheta \\in \\mathbb{R}"}/>에 대해서는</p>}/>
                    <BlockMath math={"\\vartheta \\begin{bmatrix} \\varpi \\\\ 2\\varpi \\end{bmatrix} = \\begin{bmatrix} \\vartheta\\varpi \\\\ 2(\\vartheta\\varpi) \\end{bmatrix} \\in Y"}/>
                    <Terms items={[
                        ["\\vartheta", <T en={<>an arbitrary real scalar</>} ko={<>임의의 실수 스칼라</>}/>],
                        ["\\vartheta\\varpi", <T en={<>again a real number, so the product stays in <InlineMath math={"Y"}/></>}
                                                ko={<>역시 실수이므로 곱이 <InlineMath math={"Y"}/> 안에 남는다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Both closures hold, so <InlineMath math={"Y"}/> is a subspace. Setting{" "}
                            <InlineMath math={"\\vartheta = 0"}/> in the second line also confirms{" "}
                            <InlineMath math={"0 \\in Y"}/>.
                        </p>}
                        ko={<p>
                            두 닫힘이 모두 성립하므로 <InlineMath math={"Y"}/>는 부분 공간이다. 둘째 줄에{" "}
                            <InlineMath math={"\\vartheta = 0"}/>을 넣으면 <InlineMath math={"0 \\in Y"}/>도
                            확인된다.
                        </p>}
                    />
                </Proof>
            </Example>
            <Example n="2.10" title={t("Two sets that fail for the same reason",
                "같은 이유로 탈락하는 두 집합")}>
                <T
                    en={<p>
                        Shift the previous line off the origin and it stops being a subspace:
                    </p>}
                    ko={<p>
                        앞의 직선을 원점에서 밀어내면 부분 공간이기를 그만둔다.
                    </p>}
                />
                <BlockMath math={"Y := \\left\\{ \\begin{bmatrix} \\varpi \\\\ 2\\varpi \\end{bmatrix} + \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} \\;\\middle|\\; \\varpi \\in \\mathbb{R} \\right\\} \\quad \\Longrightarrow \\quad 0 \\notin Y"}/>
                <Terms items={[
                    ["\\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}", <T en={<>the offset that moves the whole line one unit to the right</>}
                                                                   ko={<>직선 전체를 오른쪽으로 한 칸 옮기는 이동량</>}/>],
                    ["0 \\notin Y", <T en={<>no choice of <InlineMath math={"\\varpi"}/> gives the zero vector, so axiom 4 already fails</>}
                                      ko={<>어떤 <InlineMath math={"\\varpi"}/>로도 영벡터가 나오지 않으므로 axiom 4에서 이미 무너진다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The same argument kills{" "}
                        <InlineMath math={"Y := \\{f : \\mathbb{R} \\to \\mathbb{R} \\mid f(2) = 1.0\\}"}/>,
                        because the zero vector of that space is the function that is zero at every{" "}
                        <InlineMath math={"t"}/>, and it does not satisfy{" "}
                        <InlineMath math={"f(2) = 1.0"}/>. Contrast this with{" "}
                        <InlineMath math={"\\{f \\mid f(2) = 0\\}"}/>, which is a subspace.
                    </p>}
                    ko={<p>
                        같은 논증이{" "}
                        <InlineMath math={"Y := \\{f : \\mathbb{R} \\to \\mathbb{R} \\mid f(2) = 1.0\\}"}/>도
                        잡는다. 그 공간의 영벡터는 모든 <InlineMath math={"t"}/>에서 0인 함수인데 그것은{" "}
                        <InlineMath math={"f(2) = 1.0"}/>을 만족하지 않는다. 반면{" "}
                        <InlineMath math={"\\{f \\mid f(2) = 0\\}"}/>은 부분 공간이다.
                    </p>}
                />
            </Example>
            <Remark title={t("The same test in a function space", "함수 공간에서의 같은 검사")}>
                <T
                    en={<p>
                        With <InlineMath math={"X = \\{f : \\mathbb{R} \\to \\mathbb{R}\\}"}/> over{" "}
                        <InlineMath math={"\\mathbb{R}"}/>, the polynomials{" "}
                        <InlineMath math={"P(t)"}/> form a subspace: a sum of two polynomials with real
                        coefficients is such a polynomial, and so is a real multiple of one. The same check
                        works for <InlineMath math={"\\{f \\mid f \\text{ differentiable}, \\; \\tfrac{d}{dt}f \\equiv 0\\}"}/>,
                        the constant functions.
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathbb{R}"}/> 위의{" "}
                        <InlineMath math={"X = \\{f : \\mathbb{R} \\to \\mathbb{R}\\}"}/>에서 다항식 집합{" "}
                        <InlineMath math={"P(t)"}/>는 부분 공간이다. 실계수 다항식 둘의 합도 실계수
                        다항식이고, 그것의 실수배도 마찬가지다.{" "}
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
            <Definition n="2.11" title={t("Linear combination", "선형 결합")}>
                <T
                    en={<p>
                        Let <InlineMath math={"(X, \\mathbb{F})"}/> be a vector space. A{" "}
                        <strong>linear combination</strong> is a <em>finite</em> sum
                    </p>}
                    ko={<p>
                        <InlineMath math={"(X, \\mathbb{F})"}/>이 벡터 공간이라 하자.{" "}
                        <strong>선형 결합</strong>은 <em>유한</em> 합
                    </p>}
                />
                <BlockMath math={"\\vartheta_1 v^1 + \\vartheta_2 v^2 + \\cdots + \\vartheta_n v^n, \\qquad n \\ge 1"}/>
                <Terms items={[
                    ["n", <T en={<>the number of terms, a finite natural number fixed before the sum is written</>}
                            ko={<>항의 개수. 합을 적기 전에 정해지는 유한한 자연수</>}/>],
                    ["\\vartheta_i", <T en={<>scalars in <InlineMath math={"\\mathbb{F}"}/></>}
                                       ko={<><InlineMath math={"\\mathbb{F}"}/>의 스칼라</>}/>],
                    ["v^i", <T en={<>vectors in <InlineMath math={"X"}/>, indexed by superscripts that are labels</>}
                              ko={<><InlineMath math={"X"}/>의 벡터. 위첨자는 이름표다</>}/>],
                ]}/>
                <T
                    en={<p>
                        To be extra clear, <InlineMath math={"\\sum_{i=1}^{\\infty} \\vartheta_i v^i"}/> is{" "}
                        <strong>not</strong> a linear combination, because it is not finite. That restriction
                        looks pedantic until Example 2.22.
                    </p>}
                    ko={<p>
                        분명히 해 두면 <InlineMath math={"\\sum_{i=1}^{\\infty} \\vartheta_i v^i"}/>는 선형
                        결합이 <strong>아니다</strong>. 유한하지 않기 때문이다. 이 제한은 Example 2.22를 보기
                        전까지는 깐깐한 트집처럼 보인다.
                    </p>}
                />
            </Definition>
            <Definition n="2.12" title={t("Linear dependence and independence", "선형 종속과 선형 독립")}>
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
                <BlockMath math={"\\exists\\, \\vartheta_1, \\ldots, \\vartheta_k \\in \\mathbb{F} \\ \\text{not all zero} \\ \\text{ s.t. } \\ \\vartheta_1 v^1 + \\cdots + \\vartheta_k v^k = 0"}/>
                <Terms items={[
                    ["\\exists", <T en={<>"there exist": one witness is enough to make the set dependent</>}
                                   ko={<>"존재한다". 증거 하나만 있으면 그 집합은 종속이다</>}/>],
                    ["\\text{not all zero}", <T en={<>the entire content of the definition: <InlineMath math={"\\vartheta_i = 0"}/> always works and proves nothing</>}
                                                ko={<>정의의 핵심 전부. <InlineMath math={"\\vartheta_i = 0"}/>은 언제나 되므로 아무것도 증명하지 못한다</>}/>],
                    ["0", <T en={<>the zero vector of <InlineMath math={"X"}/>, not the scalar zero</>}
                            ko={<><InlineMath math={"X"}/>의 영벡터. 스칼라 0이 아니다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Otherwise the set is <strong>linearly independent</strong>: the only combination that
                        produces the zero vector is the trivial one.
                    </p>}
                    ko={<p>
                        그렇지 않으면 <strong>선형 독립</strong>이다. 영벡터를 만드는 조합이 자명한 것뿐이라는
                        뜻이다.
                    </p>}
                />
            </Definition>
            <Remark n="2.13" title={t("What dependence buys you", "종속이면 무엇을 얻는가")}>
                <T
                    en={<p>
                        Suppose <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/> is dependent, with witnesses{" "}
                        <InlineMath math={"\\vartheta_1, \\ldots, \\vartheta_k"}/> not all zero. Relabel so
                        that <InlineMath math={"\\vartheta_k \\neq 0"}/>. Then
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/>이 종속이고 증거 계수{" "}
                        <InlineMath math={"\\vartheta_1, \\ldots, \\vartheta_k"}/>가 전부 0은 아니라 하자.
                        번호를 다시 붙여 <InlineMath math={"\\vartheta_k \\neq 0"}/>이라 두면
                    </p>}
                />
                <BlockMath math={"\\vartheta_k v^k = -\\vartheta_1 v^1 - \\cdots - \\vartheta_{k-1} v^{k-1} \\quad \\Longrightarrow \\quad v^k = -\\frac{\\vartheta_1}{\\vartheta_k} v^1 - \\cdots - \\frac{\\vartheta_{k-1}}{\\vartheta_k} v^{k-1}"}/>
                <Terms items={[
                    ["\\vartheta_k \\neq 0", <T en={<>the coefficient we may divide by, which is why the relabeling was needed</>}
                                               ko={<>나눗셈이 가능한 계수. 번호를 다시 붙인 이유가 이것이다</>}/>],
                    ["v^k", <T en={<>the vector now exhibited as a linear combination of the others</>}
                              ko={<>이제 나머지의 선형 결합으로 드러난 벡터</>}/>],
                    ["-\\vartheta_i / \\vartheta_k", <T en={<>scalars in <InlineMath math={"\\mathbb{F}"}/>, available because a field has multiplicative inverses</>}
                                                       ko={<><InlineMath math={"\\mathbb{F}"}/>의 스칼라. 체에 곱셈 역원이 있어서 쓸 수 있다</>}/>],
                ]}/>
                <T
                    en={<p>
                        So "dependent" and "one of them is redundant" say the same thing. Note where the
                        field axioms were used: without multiplicative inverses this step is not available.
                    </p>}
                    ko={<p>
                        결국 "종속이다"와 "그중 하나는 군더더기다"는 같은 말이다. 체의 axiom이 어디서 쓰였는지
                        보아 두자. 곱셈 역원이 없으면 이 단계를 밟을 수 없다.
                    </p>}
                />
            </Remark>
            <Proposition n="2.14" title={t("Three readings of independence", "선형 독립의 세 가지 읽기")}>
                <T
                    en={<p>
                        For a finite set <InlineMath math={"S := \\{v^1, \\ldots, v^k\\}"}/>, the following
                        are equivalent.
                    </p>}
                    ko={<p>
                        유한 집합 <InlineMath math={"S := \\{v^1, \\ldots, v^k\\}"}/>에 대해 다음은 서로
                        동치다.
                    </p>}
                />
                <T
                    en={<ol>
                        <li><InlineMath math={"S"}/> is linearly independent.</li>
                        <li><InlineMath math={"\\{v^1, \\ldots, v^{k-1}\\}"}/> is linearly independent and{" "}
                            <InlineMath math={"v^k"}/> cannot be written as a linear combination of it.</li>
                        <li>Every finite subset of <InlineMath math={"S"}/> is linearly independent.</li>
                    </ol>}
                    ko={<ol>
                        <li><InlineMath math={"S"}/>가 선형 독립이다.</li>
                        <li><InlineMath math={"\\{v^1, \\ldots, v^{k-1}\\}"}/>이 선형 독립이고{" "}
                            <InlineMath math={"v^k"}/>를 그것의 선형 결합으로 쓸 수 없다.</li>
                        <li><InlineMath math={"S"}/>의 모든 유한 부분집합이 선형 독립이다.</li>
                    </ol>}
                />
                <T
                    en={<p>
                        Remark 2.13 is the engine: a dependent set always exposes one member as a combination
                        of the rest, and (c) says the property cannot be repaired by throwing vectors away.
                    </p>}
                    ko={<p>
                        Remark 2.13이 동력이다. 종속인 집합은 언제나 구성원 하나를 나머지의 결합으로
                        드러내고, (c)는 벡터를 덜어 낸다고 성질이 고쳐지지 않는다는 말이다.
                    </p>}
                />
            </Proposition>
            <Definition n="2.15" title={t("Independence of an infinite set", "무한 집합의 선형 독립")}>
                <T
                    en={<p>
                        An arbitrary set <InlineMath math={"S \\subset X"}/> is <strong>linearly
                        independent</strong> if every finite subset of it is linearly independent. This is
                        the only sensible extension, since Definition 2.11 admits no infinite sums.
                    </p>}
                    ko={<p>
                        임의의 집합 <InlineMath math={"S \\subset X"}/>는 그것의 모든 유한 부분집합이 선형
                        독립일 때 <strong>선형 독립</strong>이라 한다. Definition 2.11이 무한 합을 허용하지
                        않으므로 이것이 유일하게 말이 되는 확장이다.
                    </p>}
                />
            </Definition>
            <CanvasFigure
                label={t("Drag until the parallelogram flattens: det → 0, rank drops, and the span collapses to a line",
                    "평행사변형이 납작해질 때까지 끌어 보자. det → 0, rank 하락, span의 직선 붕괴가 한 사건이다")}
                bodyClassName="w-[min(92vw,900px)]"
                modal={<IndependenceExplorer height={420}/>}>
                <IndependenceExplorer/>
            </CanvasFigure>
            <Example n="2.16" title={t("The monomials are linearly independent",
                "단항식들은 선형 독립이다")}>
                <T
                    en={<p>
                        Let <InlineMath math={"\\mathbb{F} = \\mathbb{R}"}/> and{" "}
                        <InlineMath math={"X = P(t)"}/>, the polynomials with real coefficients. For each{" "}
                        <InlineMath math={"n \\ge 0"}/>, the set{" "}
                        <InlineMath math={"\\{1, t, \\ldots, t^n\\}"}/> is linearly independent. Two proofs
                        follow, and they are worth comparing: the first is a direct computation, the second
                        is an induction whose step is itself a proof by contradiction.
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathbb{F} = \\mathbb{R}"}/>, 그리고{" "}
                        <InlineMath math={"X = P(t)"}/>를 실계수 다항식 전체라 하자. 각{" "}
                        <InlineMath math={"n \\ge 0"}/>에 대해 집합{" "}
                        <InlineMath math={"\\{1, t, \\ldots, t^n\\}"}/>은 선형 독립이다. 증명을 두 가지 적는데
                        서로 견주어 볼 값어치가 있다. 첫째는 직접 계산이고, 둘째는 step 자체가 귀류법인
                        귀납법이다.
                    </p>}
                />
                <Proof label={t("Direct proof", "직접 증명")}>
                    <T
                        en={<p>
                            Suppose <InlineMath math={"p(t) := \\vartheta_0 + \\vartheta_1 t + \\cdots + \\vartheta_n t^n = 0"}/> is
                            the zero polynomial. We must show every coefficient vanishes. From calculus, a
                            polynomial is identically zero if and only if its value and all its derivatives
                            vanish at <InlineMath math={"t = 0"}/>, so evaluate them one at a time:
                        </p>}
                        ko={<p>
                            <InlineMath math={"p(t) := \\vartheta_0 + \\vartheta_1 t + \\cdots + \\vartheta_n t^n = 0"}/>이
                            영다항식이라 하자. 모든 계수가 0임을 보이면 된다. 미적분에서 다항식이 항등적으로
                            0인 것은 <InlineMath math={"t = 0"}/>에서의 값과 모든 도함수가 0인 것과 동치이므로,
                            하나씩 값매김한다.
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} 0 &= p(0) &&\\implies \\vartheta_0 = 0 \\\\ 0 &= \\left.\\tfrac{dp}{dt}\\right|_{t=0} = \\left.(\\vartheta_1 + 2\\vartheta_2 t + \\cdots)\\right|_{t=0} &&\\implies \\vartheta_1 = 0 \\\\ &\\;\\;\\vdots \\\\ 0 &= \\left.\\tfrac{d^n p}{dt^n}\\right|_{t=0} = n!\\,\\vartheta_n &&\\implies \\vartheta_n = 0 \\end{aligned}"}/>
                    <Terms items={[
                        ["p(t)", <T en={<>the polynomial assumed to be the zero vector of <InlineMath math={"P(t)"}/></>}
                                   ko={<><InlineMath math={"P(t)"}/>의 영벡터라고 가정한 다항식</>}/>],
                        ["\\vartheta_i", <T en={<>its coefficients, the scalars in the linear combination being tested</>}
                                           ko={<>그 계수. 지금 검사 중인 선형 결합의 스칼라다</>}/>],
                        ["\\left.\\tfrac{d^k p}{dt^k}\\right|_{t=0}", <T en={<>the <InlineMath math={"k"}/>-th derivative evaluated at zero, which isolates <InlineMath math={"\\vartheta_k"}/></>}
                                                                        ko={<>0에서 값매김한 <InlineMath math={"k"}/>계 도함수. <InlineMath math={"\\vartheta_k"}/>만 남긴다</>}/>],
                        ["n!", <T en={<>the factor left in front of <InlineMath math={"\\vartheta_n"}/>, nonzero, so it can be divided out</>}
                                 ko={<><InlineMath math={"\\vartheta_n"}/> 앞에 남는 인수. 0이 아니므로 나눠 없앨 수 있다</>}/>],
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
                            <InlineMath math={"P(k)"}/> be: <InlineMath math={"\\{1, t, \\ldots, t^k\\}"}/> is
                            linearly independent.</p>}
                        ko={<p><strong>Step 0.</strong> <InlineMath math={"k \\ge 0"}/>에 대해{" "}
                            <InlineMath math={"P(k)"}/>를 "<InlineMath math={"\\{1, t, \\ldots, t^k\\}"}/>이
                            선형 독립이다"로 둔다.</p>}
                    />
                    <T
                        en={<p><strong>Step 1.</strong> Base case <InlineMath math={"P(0)"}/>: the set{" "}
                            <InlineMath math={"\\{1\\}"}/> is independent, since{" "}
                            <InlineMath math={"\\vartheta \\cdot 1 = 0"}/> forces{" "}
                            <InlineMath math={"\\vartheta = 0"}/>.</p>}
                        ko={<p><strong>Step 1.</strong> base case <InlineMath math={"P(0)"}/>:{" "}
                            <InlineMath math={"\\vartheta \\cdot 1 = 0"}/>이면{" "}
                            <InlineMath math={"\\vartheta = 0"}/>이므로 집합{" "}
                            <InlineMath math={"\\{1\\}"}/>은 선형 독립이다.</p>}
                    />
                    <T
                        en={<p><strong>Step 2.</strong> Assume <InlineMath math={"P(k)"}/>. By Proposition
                            2.14 (b) it is enough to show that <InlineMath math={"t^{k+1}"}/> is not a linear
                            combination of <InlineMath math={"\\{1, t, \\ldots, t^k\\}"}/>. Suppose to the
                            contrary that it is:</p>}
                        ko={<p><strong>Step 2.</strong> <InlineMath math={"P(k)"}/>를 가정한다. Proposition
                            2.14 (b)에 의해 <InlineMath math={"t^{k+1}"}/>이{" "}
                            <InlineMath math={"\\{1, t, \\ldots, t^k\\}"}/>의 선형 결합이 아님만 보이면 된다.
                            반대로 그런 결합이 있다고 하자.</p>}
                    />
                    <BlockMath math={"t^{k+1} = \\vartheta_0 + \\vartheta_1 t + \\cdots + \\vartheta_k t^k \\quad \\xrightarrow{\\ \\frac{d^{k+1}}{dt^{k+1}}\\ } \\quad (k+1)! = 0"}/>
                    <Terms items={[
                        ["t^{k+1}", <T en={<>the new monomial, assumed for contradiction to be reachable from the earlier ones</>}
                                      ko={<>새로 들어온 단항식. 모순을 노리고 앞의 것들로 만들 수 있다고 가정했다</>}/>],
                        ["\\frac{d^{k+1}}{dt^{k+1}}", <T en={<>differentiating both sides <InlineMath math={"k+1"}/> times, which annihilates every term of degree <InlineMath math={"\\le k"}/></>}
                                                        ko={<>양변을 <InlineMath math={"k+1"}/>번 미분하는 연산. 차수가 <InlineMath math={"k"}/> 이하인 항을 모두 없앤다</>}/>],
                        ["(k+1)!", <T en={<>what is left on the left side, a strictly positive number</>}
                                     ko={<>좌변에 남는 값. 0보다 큰 수다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The identity <InlineMath math={"(k+1)! = 0"}/> is false, so no such combination
                            exists and <InlineMath math={"P(k+1)"}/> holds. Since{" "}
                            <InlineMath math={"P(0)"}/> is true and{" "}
                            <InlineMath math={"P(k) \\implies P(k+1)"}/>, induction gives the claim for
                            every <InlineMath math={"n"}/>. Definition 2.15 then upgrades it to the full
                            infinite set <InlineMath math={"\\{1, t, t^2, \\ldots\\}"}/>.
                        </p>}
                        ko={<p>
                            <InlineMath math={"(k+1)! = 0"}/>은 거짓이므로 그런 결합은 없고{" "}
                            <InlineMath math={"P(k+1)"}/>이 성립한다. <InlineMath math={"P(0)"}/>이 참이고{" "}
                            <InlineMath math={"P(k) \\implies P(k+1)"}/>이므로 귀납법에 의해 모든{" "}
                            <InlineMath math={"n"}/>에서 주장이 성립한다. 여기에 Definition 2.15를 얹으면
                            무한 집합 <InlineMath math={"\\{1, t, t^2, \\ldots\\}"}/> 전체로 올라간다.
                        </p>}
                    />
                </Proof>
            </Example>
            <Example n="2.17" title={t("Matrices as vectors", "벡터로서의 행렬")}>
                <T
                    en={<p>
                        Let <InlineMath math={"\\mathbb{F} = \\mathbb{R}"}/> and{" "}
                        <InlineMath math={"X = \\mathbb{R}^{2 \\times 3}"}/>, with
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathbb{F} = \\mathbb{R}"}/>,{" "}
                        <InlineMath math={"X = \\mathbb{R}^{2 \\times 3}"}/>이라 하고
                    </p>}
                />
                <BlockMath math={"v^1 = \\begin{bmatrix} 1 & 0 & 0 \\\\ 2 & 0 & 0 \\end{bmatrix}, \\quad v^2 = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 0 & 0 \\end{bmatrix}, \\quad v^4 = \\begin{bmatrix} 0 & 0 & 0 \\\\ 1 & 0 & 0 \\end{bmatrix}"}/>
                <Terms items={[
                    ["v^1, v^2, v^4", <T en={<>three elements of <InlineMath math={"X"}/>: each 2 × 3 matrix is a single vector here</>}
                                        ko={<><InlineMath math={"X"}/>의 원소 셋. 여기서는 2 × 3 행렬 하나가 벡터 하나다</>}/>],
                    ["0", <T en={<>the zero vector of <InlineMath math={"X"}/> is the 2 × 3 matrix of zeros</>}
                            ko={<><InlineMath math={"X"}/>의 영벡터는 성분이 모두 0인 2 × 3 행렬이다</>}/>],
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
                    <BlockMath math={"\\vartheta_1 v^1 + \\vartheta_2 v^2 = \\begin{bmatrix} \\vartheta_1 + \\vartheta_2 & 0 & 0 \\\\ 2\\vartheta_1 & 0 & 0 \\end{bmatrix} = 0 \\iff \\vartheta_1 = \\vartheta_2 = 0"}/>
                    <Terms items={[
                        ["\\vartheta_1, \\vartheta_2", <T en={<>the unknown scalars of the combination</>}
                                                         ko={<>결합의 미지 스칼라</>}/>],
                        ["2\\vartheta_1", <T en={<>the (2,1) entry: it forces <InlineMath math={"\\vartheta_1 = 0"}/>, and then the (1,1) entry forces <InlineMath math={"\\vartheta_2 = 0"}/></>}
                                            ko={<>(2,1) 성분. <InlineMath math={"\\vartheta_1 = 0"}/>을 강제하고, 이어서 (1,1) 성분이 <InlineMath math={"\\vartheta_2 = 0"}/>을 강제한다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            So <InlineMath math={"\\{v^1, v^2\\}"}/> is independent. Adding{" "}
                            <InlineMath math={"v^4"}/> destroys that, and the definition asks for one
                            witness, so exhibit one:
                        </p>}
                        ko={<p>
                            따라서 <InlineMath math={"\\{v^1, v^2\\}"}/>은 선형 독립이다.{" "}
                            <InlineMath math={"v^4"}/>를 더하면 그것이 깨지는데, 정의는 증거 하나를 요구하므로
                            하나만 제시하면 된다.
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
            <Example n="2.18" title={t("Write out every equation", "방정식을 전부 적어 보기")}>
                <T
                    en={<p>
                        Still in <InlineMath math={"\\mathbb{R}^{2 \\times 3}"}/>, are{" "}
                        <InlineMath math={"A^1 = \\begin{bmatrix} 1 & 0 & 4 \\\\ 3 & -1 & 2 \\end{bmatrix}"}/> and{" "}
                        <InlineMath math={"A^2 = \\begin{bmatrix} 4 & 1 & 0 \\\\ 6 & 0 & 6 \\end{bmatrix}"}/>{" "}
                        linearly independent?
                    </p>}
                    ko={<p>
                        여전히 <InlineMath math={"\\mathbb{R}^{2 \\times 3}"}/> 안에서{" "}
                        <InlineMath math={"A^1 = \\begin{bmatrix} 1 & 0 & 4 \\\\ 3 & -1 & 2 \\end{bmatrix}"}/>과{" "}
                        <InlineMath math={"A^2 = \\begin{bmatrix} 4 & 1 & 0 \\\\ 6 & 0 & 6 \\end{bmatrix}"}/>은
                        선형 독립인가?
                    </p>}
                />
                <Proof>
                    <T en={<p>Setting the combination to zero gives six scalar equations, one per entry:</p>}
                       ko={<p>결합을 0으로 두면 성분마다 하나씩, 스칼라 방정식 여섯 개가 나온다.</p>}/>
                    <BlockMath math={"\\vartheta_1 A^1 + \\vartheta_2 A^2 = \\begin{bmatrix} \\vartheta_1 + 4\\vartheta_2 & \\vartheta_2 & 4\\vartheta_1 \\\\ 3\\vartheta_1 + 6\\vartheta_2 & -\\vartheta_1 & 2\\vartheta_1 + 6\\vartheta_2 \\end{bmatrix} = 0"}/>
                    <Terms items={[
                        ["\\vartheta_2", <T en={<>the (1,2) entry: it alone forces <InlineMath math={"\\vartheta_2 = 0"}/></>}
                                           ko={<>(1,2) 성분. 이것만으로 <InlineMath math={"\\vartheta_2 = 0"}/>이 강제된다</>}/>],
                        ["-\\vartheta_1", <T en={<>the (2,2) entry: it alone forces <InlineMath math={"\\vartheta_1 = 0"}/></>}
                                            ko={<>(2,2) 성분. 이것만으로 <InlineMath math={"\\vartheta_1 = 0"}/>이 강제된다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Two of the six equations already force both scalars to vanish, so the set is
                            linearly independent. The point of writing all six is that setting a matrix equal
                            to the zero matrix means setting <em>every entry</em> to zero, which is where
                            students lose marks.
                        </p>}
                        ko={<p>
                            여섯 중 둘만으로 두 스칼라가 모두 0이 되므로 이 집합은 선형 독립이다. 여섯 개를 다
                            적어 보는 이유는, 행렬을 영행렬과 같다고 두는 것이 <em>모든 성분</em>을 0으로
                            둔다는 뜻임을 놓치기 쉽기 때문이다.
                        </p>}
                    />
                </Proof>
            </Example>
            <Remark n="2.19" title={t("Independence depends on the field", "선형 독립은 체에 달려 있다")}>
                <T
                    en={<p>
                        Let <InlineMath math={"X = \\mathbb{C}"}/>,{" "}
                        <InlineMath math={"v^1 = 1"}/> and <InlineMath math={"v^2 = j := \\sqrt{-1}"}/>. Over{" "}
                        <InlineMath math={"\\mathbb{F} = \\mathbb{R}"}/> the two are independent: no real{" "}
                        <InlineMath math={"\\vartheta"}/> makes <InlineMath math={"\\vartheta \\cdot 1 = j"}/>.
                        Over <InlineMath math={"\\mathbb{F} = \\mathbb{C}"}/> they are dependent, since{" "}
                        <InlineMath math={"j \\cdot 1 - 1 \\cdot j = 0"}/> with coefficients{" "}
                        <InlineMath math={"j"}/> and <InlineMath math={"-1"}/>. The same vectors, a different
                        answer. Always say which field you are working over.
                    </p>}
                    ko={<p>
                        <InlineMath math={"X = \\mathbb{C}"}/>,{" "}
                        <InlineMath math={"v^1 = 1"}/>,{" "}
                        <InlineMath math={"v^2 = j := \\sqrt{-1}"}/>이라 하자.{" "}
                        <InlineMath math={"\\mathbb{F} = \\mathbb{R}"}/> 위에서는 둘이 선형 독립이다. 실수{" "}
                        <InlineMath math={"\\vartheta"}/>로는 <InlineMath math={"\\vartheta \\cdot 1 = j"}/>를
                        만들 수 없기 때문이다. <InlineMath math={"\\mathbb{F} = \\mathbb{C}"}/> 위에서는
                        계수를 <InlineMath math={"j"}/>와 <InlineMath math={"-1"}/>로 잡아{" "}
                        <InlineMath math={"j \\cdot 1 - 1 \\cdot j = 0"}/>이므로 종속이다. 벡터는 같은데 답이
                        다르다. 어느 체 위에서 이야기하는지 항상 밝혀야 한다.
                    </p>}
                />
            </Remark>
            <Definition n="2.20" title={t("Span", "span")}>
                <T
                    en={<p>
                        Let <InlineMath math={"S"}/> be a subset of a vector space{" "}
                        <InlineMath math={"(X, \\mathbb{F})"}/>. The <strong>span</strong> of{" "}
                        <InlineMath math={"S"}/> is the set of all linear combinations of elements of{" "}
                        <InlineMath math={"S"}/>:
                    </p>}
                    ko={<p>
                        <InlineMath math={"S"}/>를 벡터 공간 <InlineMath math={"(X, \\mathbb{F})"}/>의
                        부분집합이라 하자. <InlineMath math={"S"}/>의 <strong>span</strong>은{" "}
                        <InlineMath math={"S"}/>의 원소들로 만드는 모든 선형 결합의 집합이다.
                    </p>}
                />
                <BlockMath math={"\\operatorname{span}\\{S\\} := \\{x \\in X \\mid \\exists\\, n \\ge 1, \\; \\vartheta_i \\in \\mathbb{F}, \\; v^i \\in S \\text{ s.t. } x = \\vartheta_1 v^1 + \\cdots + \\vartheta_n v^n\\}"}/>
                <Terms items={[
                    ["S", <T en={<>any subset of <InlineMath math={"X"}/>, possibly infinite</>}
                            ko={<><InlineMath math={"X"}/>의 임의의 부분집합. 무한해도 된다</>}/>],
                    ["n", <T en={<>the length of the combination, chosen per element <InlineMath math={"x"}/> and always finite</>}
                            ko={<>결합의 길이. 원소 <InlineMath math={"x"}/>마다 고르며 언제나 유한하다</>}/>],
                    ["\\vartheta_i, v^i", <T en={<>the scalars and the vectors of <InlineMath math={"S"}/> used to build <InlineMath math={"x"}/></>}
                                            ko={<><InlineMath math={"x"}/>를 만드는 데 쓰는 스칼라와 <InlineMath math={"S"}/>의 벡터</>}/>],
                ]}/>
            </Definition>
            <Remark n="2.21" title={t("A span is always a subspace", "span은 언제나 부분 공간이다")}>
                <T
                    en={<p>
                        A combination of two linear combinations of elements of{" "}
                        <InlineMath math={"S"}/> is again a finite linear combination of elements of{" "}
                        <InlineMath math={"S"}/>, so <InlineMath math={"\\operatorname{span}\\{S\\}"}/>{" "}
                        satisfies Proposition 2.8 (d). It is nonempty whenever{" "}
                        <InlineMath math={"S"}/> is, and taking all scalars zero puts{" "}
                        <InlineMath math={"0"}/> in it. This is the cheapest way to manufacture subspaces,
                        and it is how every subspace in the rest of the course will be described.
                    </p>}
                    ko={<p>
                        <InlineMath math={"S"}/>의 원소로 만든 선형 결합 둘을 다시 결합해도 여전히{" "}
                        <InlineMath math={"S"}/> 원소들의 유한 선형 결합이므로{" "}
                        <InlineMath math={"\\operatorname{span}\\{S\\}"}/>는 Proposition 2.8 (d)를 만족한다.{" "}
                        <InlineMath math={"S"}/>가 비어 있지 않으면 span도 비어 있지 않고, 스칼라를 전부 0으로
                        두면 <InlineMath math={"0"}/>이 들어온다. 부분 공간을 만드는 가장 값싼 방법이며, 이
                        과목의 남은 부분에서 부분 공간은 전부 이렇게 서술된다.
                    </p>}
                />
            </Remark>
            <Example n="2.22" title={t("Why \"finite\" was not pedantry", "\"유한\"이 트집이 아니었던 이유")}>
                <T
                    en={<p>
                        Let <InlineMath math={"\\mathbb{F} = \\mathbb{R}"}/> and{" "}
                        <InlineMath math={"X = \\{f : \\mathbb{R} \\to \\mathbb{R}\\}"}/>, and take{" "}
                        <InlineMath math={"S = \\{1, t, t^2, \\ldots\\}"}/>. Then{" "}
                        <InlineMath math={"\\operatorname{span}\\{S\\} = P(t)"}/>, the polynomials. Is{" "}
                        <InlineMath math={"e^t"}/> in the span?
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathbb{F} = \\mathbb{R}"}/>,{" "}
                        <InlineMath math={"X = \\{f : \\mathbb{R} \\to \\mathbb{R}\\}"}/>,{" "}
                        <InlineMath math={"S = \\{1, t, t^2, \\ldots\\}"}/>이라 하자. 그러면{" "}
                        <InlineMath math={"\\operatorname{span}\\{S\\} = P(t)"}/>, 곧 다항식 전체다.{" "}
                        <InlineMath math={"e^t"}/>는 이 span 안에 있는가?
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            No. The Taylor series of <InlineMath math={"e^t"}/> has infinitely many nonzero
                            terms, and by Definition 2.11 that is not a linear combination. It remains to
                            rule out some other, finite way of writing it. Suppose{" "}
                            <InlineMath math={"e^t = p(t)"}/> for a polynomial <InlineMath math={"p"}/>.
                            Differentiation gives
                        </p>}
                        ko={<p>
                            아니다. <InlineMath math={"e^t"}/>의 테일러 급수는 0이 아닌 항이 무한히 많고,
                            Definition 2.11에 의해 그것은 선형 결합이 아니다. 남은 일은 다른 유한한 표현이
                            없음을 보이는 것이다. 어떤 다항식 <InlineMath math={"p"}/>에 대해{" "}
                            <InlineMath math={"e^t = p(t)"}/>라 하자. 미분하면
                        </p>}
                    />
                    <BlockMath math={"\\tfrac{d}{dt} e^t = e^t \\quad \\Longrightarrow \\quad \\tfrac{d}{dt} p(t) = p(t)"}/>
                    <Terms items={[
                        ["e^t", <T en={<>the function in question, which is its own derivative</>}
                                  ko={<>지금 따지는 함수. 자기 자신이 도함수다</>}/>],
                        ["p(t)", <T en={<>a hypothetical polynomial equal to <InlineMath math={"e^t"}/>, assumed for contradiction</>}
                                   ko={<><InlineMath math={"e^t"}/>와 같다고 가정한 다항식. 모순을 노린 가정이다</>}/>],
                        ["\\tfrac{d}{dt}p", <T en={<>a polynomial of degree one lower than <InlineMath math={"p"}/>, unless <InlineMath math={"p"}/> is the zero polynomial</>}
                                              ko={<><InlineMath math={"p"}/>가 영다항식이 아닌 한 차수가 하나 낮은 다항식</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Differentiation drops the degree by one, so a nonzero polynomial can never equal
                            its own derivative, and the zero polynomial is not{" "}
                            <InlineMath math={"e^t"}/>. Hence{" "}
                            <InlineMath math={"e^t \\notin \\operatorname{span}\\{S\\}"}/>.
                        </p>}
                        ko={<p>
                            미분은 차수를 하나 떨어뜨리므로 0이 아닌 다항식이 자기 도함수와 같아질 수 없고,
                            영다항식은 <InlineMath math={"e^t"}/>가 아니다. 따라서{" "}
                            <InlineMath math={"e^t \\notin \\operatorname{span}\\{S\\}"}/>다.
                        </p>}
                    />
                </Proof>
            </Example>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Basis Vectors and Dimension</h2>} ko={<h2>기저와 차원</h2>}/>
            <T
                en={<p>
                    A basis is a set that is large enough to reach every vector and small enough that the
                    way of reaching it is unique. Those two halves are the two conditions in the definition,
                    and it is worth remembering which is which: spanning is about coverage, independence is
                    about uniqueness.
                </p>}
                ko={<p>
                    기저는 모든 벡터에 닿을 만큼 크면서, 닿는 방법이 유일할 만큼 작은 집합이다. 그 두 쪽이
                    정의의 두 조건이고, 어느 쪽이 무엇인지 기억해 둘 값어치가 있다. span은 빠짐없음에 대한
                    조건이고 선형 독립은 유일함에 대한 조건이다.
                </p>}
            />
            <Definition n="2.23" title={t("Basis", "기저")}>
                <T
                    en={<p>
                        A set <InlineMath math={"B"}/> in <InlineMath math={"(X, \\mathbb{F})"}/> is a{" "}
                        <strong>basis</strong> for <InlineMath math={"X"}/> if (a){" "}
                        <InlineMath math={"B"}/> is linearly independent and (b){" "}
                        <InlineMath math={"\\operatorname{span}\\{B\\} = X"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(X, \\mathbb{F})"}/> 안의 집합 <InlineMath math={"B"}/>가 (a) 선형
                        독립이고 (b) <InlineMath math={"\\operatorname{span}\\{B\\} = X"}/>이면{" "}
                        <InlineMath math={"X"}/>의 <strong>기저</strong>다.
                    </p>}
                />
            </Definition>
            <Example n="2.24" title={t("Bases", "기저의 예")}>
                <T
                    en={<p>
                        (a) In <InlineMath math={"(\\mathbb{F}^n, \\mathbb{F})"}/>, the{" "}
                        <strong>natural basis</strong> <InlineMath math={"\\{e^1, \\ldots, e^n\\}"}/> has a
                        one in position <InlineMath math={"i"}/> and zeros elsewhere. One display settles
                        both conditions at once:
                    </p>}
                    ko={<p>
                        (a) <InlineMath math={"(\\mathbb{F}^n, \\mathbb{F})"}/>에서{" "}
                        <strong>표준 기저</strong> <InlineMath math={"\\{e^1, \\ldots, e^n\\}"}/>는{" "}
                        <InlineMath math={"i"}/>번째 자리만 1이고 나머지는 0인 열이다. 아래 식 하나로 두 조건이
                        동시에 해결된다.
                    </p>}
                />
                <BlockMath math={"\\vartheta_1 e^1 + \\vartheta_2 e^2 + \\cdots + \\vartheta_n e^n = \\begin{bmatrix} \\vartheta_1 \\\\ \\vartheta_2 \\\\ \\vdots \\\\ \\vartheta_n \\end{bmatrix}"}/>
                <Terms items={[
                    ["e^i", <T en={<>the <InlineMath math={"i"}/>-th natural basis vector: a one in row <InlineMath math={"i"}/>, zeros elsewhere</>}
                              ko={<><InlineMath math={"i"}/>번째 표준 기저 벡터. <InlineMath math={"i"}/>행만 1이고 나머지는 0이다</>}/>],
                    ["\\vartheta_i", <T en={<>arbitrary scalars in <InlineMath math={"\\mathbb{F}"}/></>}
                                       ko={<><InlineMath math={"\\mathbb{F}"}/>의 임의의 스칼라</>}/>],
                    ["\\begin{bmatrix} \\vartheta_1 \\\\ \\vdots \\end{bmatrix}", <T en={<>the resulting column: it is zero only when every <InlineMath math={"\\vartheta_i"}/> is zero (independence) and it can be any column at all (spanning)</>}
                                                                                    ko={<>결과로 나오는 열. 모든 <InlineMath math={"\\vartheta_i"}/>가 0일 때만 영벡터이고(선형 독립), 어떤 열이든 만들어 낼 수 있다(span)</>}/>],
                ]}/>
                <T
                    en={<ul>
                        <li>(b) <InlineMath math={"\\{je^1, \\ldots, je^n\\}"}/> is also a basis for{" "}
                            <InlineMath math={"(\\mathbb{C}^n, \\mathbb{C})"}/>.</li>
                        <li>(c) So is <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> with{" "}
                            <InlineMath math={"v^i"}/> the column of <InlineMath math={"i"}/> ones followed by
                            zeros, since <InlineMath math={"e^1 = v^1"}/>,{" "}
                            <InlineMath math={"e^2 = v^2 - v^1"}/>, and so on recover the natural basis.</li>
                        <li>(d) <InlineMath math={"\\{e^1, \\ldots, e^n, je^1, \\ldots, je^n\\}"}/> is a basis
                            for <InlineMath math={"(\\mathbb{C}^n, \\mathbb{R})"}/>.</li>
                        <li>(e) The infinite set <InlineMath math={"\\{1, t, t^2, \\ldots\\}"}/> is a basis
                            for <InlineMath math={"(P(t), \\mathbb{R})"}/>: independent by Example 2.16, and
                            spanning by the definition of a polynomial.</li>
                    </ul>}
                    ko={<ul>
                        <li>(b) <InlineMath math={"\\{je^1, \\ldots, je^n\\}"}/>도{" "}
                            <InlineMath math={"(\\mathbb{C}^n, \\mathbb{C})"}/>의 기저다.</li>
                        <li>(c) <InlineMath math={"v^i"}/>를 앞의 <InlineMath math={"i"}/>개가 1이고 나머지가
                            0인 열이라 할 때 <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>도 기저다.{" "}
                            <InlineMath math={"e^1 = v^1"}/>,{" "}
                            <InlineMath math={"e^2 = v^2 - v^1"}/>처럼 표준 기저를 되찾을 수 있기 때문이다.</li>
                        <li>(d) <InlineMath math={"\\{e^1, \\ldots, e^n, je^1, \\ldots, je^n\\}"}/>은{" "}
                            <InlineMath math={"(\\mathbb{C}^n, \\mathbb{R})"}/>의 기저다.</li>
                        <li>(e) 무한 집합 <InlineMath math={"\\{1, t, t^2, \\ldots\\}"}/>은{" "}
                            <InlineMath math={"(P(t), \\mathbb{R})"}/>의 기저다. 선형 독립은 Example 2.16이고,
                            span은 다항식의 정의 그 자체다.</li>
                    </ul>}
                />
            </Example>
            <Example n="2.25" title={t("Two non-bases", "기저가 아닌 두 예")}>
                <T
                    en={<ul>
                        <li><InlineMath math={"\\{e^1, \\ldots, e^n\\}"}/> is <strong>not</strong> a basis for{" "}
                            <InlineMath math={"(\\mathbb{C}^n, \\mathbb{R})"}/>, because with real scalars its
                            span misses <InlineMath math={"je^1"}/>. Spanning fails.</li>
                        <li><InlineMath math={"\\{e^1, \\ldots, e^n, je^1, \\ldots, je^n\\}"}/> is not a basis
                            for <InlineMath math={"(\\mathbb{C}^n, \\mathbb{C})"}/>, because{" "}
                            <InlineMath math={"j \\cdot e^i - 1 \\cdot (je^i) = 0"}/> is a nontrivial
                            combination. Independence fails.</li>
                    </ul>}
                    ko={<ul>
                        <li><InlineMath math={"\\{e^1, \\ldots, e^n\\}"}/>은{" "}
                            <InlineMath math={"(\\mathbb{C}^n, \\mathbb{R})"}/>의 기저가{" "}
                            <strong>아니다</strong>. 실수 스칼라만으로는 span이{" "}
                            <InlineMath math={"je^1"}/>을 놓친다. span 조건이 깨진다.</li>
                        <li><InlineMath math={"\\{e^1, \\ldots, e^n, je^1, \\ldots, je^n\\}"}/>은{" "}
                            <InlineMath math={"(\\mathbb{C}^n, \\mathbb{C})"}/>의 기저가 아니다.{" "}
                            <InlineMath math={"j \\cdot e^i - 1 \\cdot (je^i) = 0"}/>이 자명하지 않은
                            결합이기 때문이다. 선형 독립이 깨진다.</li>
                    </ul>}
                />
            </Example>
            <Definition n="2.26" title={t("Finite dimension", "유한 차원")}>
                <T
                    en={<p>
                        <InlineMath math={"(X, \\mathbb{F})"}/> has <strong>dimension</strong>{" "}
                        <InlineMath math={"n > 0"}/> if there is a set of{" "}
                        <InlineMath math={"n"}/> linearly independent vectors, and every set with{" "}
                        <InlineMath math={"n+1"}/> or more vectors is linearly dependent.
                    </p>}
                    ko={<p>
                        선형 독립인 벡터 <InlineMath math={"n"}/>개짜리 집합이 존재하고,{" "}
                        <InlineMath math={"n+1"}/>개 이상인 집합은 모두 선형 종속이면{" "}
                        <InlineMath math={"(X, \\mathbb{F})"}/>의 <strong>차원</strong>이{" "}
                        <InlineMath math={"n > 0"}/>이다.
                    </p>}
                />
            </Definition>
            <Definition n="2.27" title={t("Infinite dimension", "무한 차원")}>
                <T
                    en={<p>
                        <InlineMath math={"(X, \\mathbb{F})"}/> is <strong>infinite dimensional</strong> if
                        for every <InlineMath math={"n > 0"}/> there is a linearly independent set with{" "}
                        <InlineMath math={"n"}/> or more elements.
                    </p>}
                    ko={<p>
                        모든 <InlineMath math={"n > 0"}/>에 대해 원소가 <InlineMath math={"n"}/>개 이상인 선형
                        독립 집합이 존재하면 <InlineMath math={"(X, \\mathbb{F})"}/>은{" "}
                        <strong>무한 차원</strong>이다.
                    </p>}
                />
            </Definition>
            <Remark n="2.28" title={t("Dimension of a subspace", "부분 공간의 차원")}>
                <T
                    en={<p>
                        Subspaces are vector spaces in their own right, so the definitions above assign them
                        dimensions too. By convention <InlineMath math={"\\dim \\{0\\} = 0"}/>.
                    </p>}
                    ko={<p>
                        부분 공간도 그 자체로 벡터 공간이므로 위 정의가 부분 공간의 차원도 정해 준다. 관례상{" "}
                        <InlineMath math={"\\dim \\{0\\} = 0"}/>이다.
                    </p>}
                />
            </Remark>
            <Example n="2.29" title={t("Dimensions worth memorizing", "외워 둘 만한 차원들")}>
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
                        <td><InlineMath math={"(\\mathbb{F}^n, \\mathbb{F})"}/></td>
                        <td><InlineMath math={"n"}/></td>
                        <td><InlineMath math={"\\{e^1, \\ldots, e^n\\}"}/></td>
                    </tr>
                    <tr>
                        <td><InlineMath math={"(\\mathbb{C}^n, \\mathbb{R})"}/></td>
                        <td><InlineMath math={"2n"}/></td>
                        <td><InlineMath math={"\\{e^i\\} \\cup \\{je^i\\}"}/></td>
                    </tr>
                    <tr>
                        <td><InlineMath math={"(P(t), \\mathbb{R})"}/></td>
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
            <Remark n="2.30" title={t("The one that should bother you", "마음에 걸려야 정상인 예")}>
                <T
                    en={<p>
                        Dimension is usually defined as the cardinality of a basis, and for the first three
                        rows we exhibited one. For <InlineMath math={"(\\mathbb{R}, \\mathbb{Q})"}/> no
                        explicit basis can be written down, yet{" "}
                        <a href={DIM_R_OVER_Q} target="_blank" rel="noopener noreferrer">other arguments</a>{" "}
                        show the dimension is infinite. The vectors are the real numbers, objects your
                        intuition insists are one dimensional. That is the point of the example: dimension is
                        a statement about a pair <InlineMath math={"(X, \\mathbb{F})"}/>, never about{" "}
                        <InlineMath math={"X"}/> alone.
                    </p>}
                    ko={<p>
                        차원은 보통 기저의 크기로 정의하고, 위 표의 앞 세 줄에서는 기저를 실제로 적었다.{" "}
                        <InlineMath math={"(\\mathbb{R}, \\mathbb{Q})"}/>에는 기저를 명시적으로 적을 방법이
                        없지만{" "}
                        <a href={DIM_R_OVER_Q} target="_blank" rel="noopener noreferrer">다른 논증</a>으로
                        차원이 무한임을 보일 수 있다. 여기서 벡터는 실수, 곧 직관이 1차원이라고 우기는
                        대상이다. 이 예의 요점이 그것이다. 차원은 쌍{" "}
                        <InlineMath math={"(X, \\mathbb{F})"}/>에 대한 진술이지{" "}
                        <InlineMath math={"X"}/> 하나에 대한 진술이 아니다.
                    </p>}
                />
            </Remark>
            <Theorem n="2.31" title={t("n independent vectors in an n-dimensional space form a basis",
                "n차원 공간의 독립인 n개는 기저다")}>
                <T
                    en={<p>
                        Let <InlineMath math={"(X, \\mathbb{F})"}/> be <InlineMath math={"n"}/>-dimensional,
                        with <InlineMath math={"n"}/> finite. Then any linearly independent set of{" "}
                        <InlineMath math={"n"}/> vectors is a basis.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(X, \\mathbb{F})"}/>이 <InlineMath math={"n"}/>차원이고{" "}
                        <InlineMath math={"n"}/>이 유한하다고 하자. 그러면 선형 독립인{" "}
                        <InlineMath math={"n"}/>개짜리 집합은 모두 기저다.
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
                    <BlockMath math={"\\forall x \\in X, \\; \\exists\\, \\vartheta_1, \\ldots, \\vartheta_n \\in \\mathbb{F} \\text{ s.t. } x = \\vartheta_1 v^1 + \\cdots + \\vartheta_n v^n"}/>
                    <Terms items={[
                        ["x", <T en={<>an arbitrary vector of <InlineMath math={"X"}/>, fixed at the start of the argument</>}
                                ko={<><InlineMath math={"X"}/>의 임의의 벡터. 논증 시작에서 하나 고정한다</>}/>],
                        ["\\vartheta_i", <T en={<>the coefficients whose existence is being claimed</>}
                                           ko={<>존재를 주장하는 계수들</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Fix <InlineMath math={"x"}/>. The set{" "}
                            <InlineMath math={"\\{x, v^1, \\ldots, v^n\\}"}/> has{" "}
                            <InlineMath math={"n+1"}/> elements, so by Definition 2.26 it is dependent:
                            there are <InlineMath math={"\\varpi_0, \\ldots, \\varpi_n"}/>, not all zero,
                            with
                        </p>}
                        ko={<p>
                            <InlineMath math={"x"}/>를 고정하자. 집합{" "}
                            <InlineMath math={"\\{x, v^1, \\ldots, v^n\\}"}/>은 원소가{" "}
                            <InlineMath math={"n+1"}/>개이므로 Definition 2.26에 의해 종속이다. 즉 전부 0은
                            아닌 <InlineMath math={"\\varpi_0, \\ldots, \\varpi_n"}/>이 있어서
                        </p>}
                    />
                    <BlockMath math={"\\varpi_0 x + \\varpi_1 v^1 + \\cdots + \\varpi_n v^n = 0"}/>
                    <Terms items={[
                        ["\\varpi_0", <T en={<>the coefficient sitting in front of <InlineMath math={"x"}/>, the one everything depends on</>}
                                        ko={<><InlineMath math={"x"}/> 앞에 붙은 계수. 모든 것이 여기에 달려 있다</>}/>],
                        ["\\varpi_1, \\ldots, \\varpi_n", <T en={<>the coefficients on the independent vectors</>}
                                                            ko={<>독립인 벡터들에 붙은 계수</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>Claim 2.32:</strong> <InlineMath math={"\\varpi_0 \\neq 0"}/>. Suppose
                            not. Then at least one of{" "}
                            <InlineMath math={"\\varpi_1, \\ldots, \\varpi_n"}/> is nonzero and{" "}
                            <InlineMath math={"\\varpi_1 v^1 + \\cdots + \\varpi_n v^n = 0"}/>, which makes{" "}
                            <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> dependent, contradicting the
                            hypothesis. So <InlineMath math={"\\varpi_0 = 0"}/> cannot hold.
                        </p>}
                        ko={<p>
                            <strong>Claim 2.32:</strong> <InlineMath math={"\\varpi_0 \\neq 0"}/>이다. 아니라고
                            하자. 그러면 <InlineMath math={"\\varpi_1, \\ldots, \\varpi_n"}/> 중 적어도
                            하나가 0이 아니면서{" "}
                            <InlineMath math={"\\varpi_1 v^1 + \\cdots + \\varpi_n v^n = 0"}/>이 되어{" "}
                            <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>이 종속이 되고, 이는 가정에
                            어긋난다. 따라서 <InlineMath math={"\\varpi_0 = 0"}/>일 수 없다.
                        </p>}
                    />
                    <T en={<p>Divide by <InlineMath math={"\\varpi_0"}/>:</p>}
                       ko={<p><InlineMath math={"\\varpi_0"}/>으로 나눈다.</p>}/>
                    <BlockMath math={"x = \\left(\\frac{-\\varpi_1}{\\varpi_0}\\right) v^1 + \\cdots + \\left(\\frac{-\\varpi_n}{\\varpi_0}\\right) v^n"}/>
                    <Terms items={[
                        ["-\\varpi_i / \\varpi_0", <T en={<>the required coefficients <InlineMath math={"\\vartheta_i"}/>, which lie in <InlineMath math={"\\mathbb{F}"}/> because <InlineMath math={"\\varpi_0 \\neq 0"}/></>}
                                                     ko={<>구하던 계수 <InlineMath math={"\\vartheta_i"}/>. <InlineMath math={"\\varpi_0 \\neq 0"}/>이므로 <InlineMath math={"\\mathbb{F}"}/> 안에 있다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Since <InlineMath math={"x"}/> was arbitrary, the set spans{" "}
                            <InlineMath math={"X"}/> and is therefore a basis.
                        </p>}
                        ko={<p>
                            <InlineMath math={"x"}/>를 임의로 잡았으므로 이 집합은{" "}
                            <InlineMath math={"X"}/>를 span하고, 따라서 기저다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Proposition n="2.33" title={t("Coordinates are unique", "좌표는 유일하다")}>
                <T
                    en={<p>
                        Let <InlineMath math={"(X, \\mathbb{F})"}/> have basis{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> and let{" "}
                        <InlineMath math={"x \\in X"}/>. Then the coefficients{" "}
                        <InlineMath math={"\\vartheta_1, \\ldots, \\vartheta_n"}/> with{" "}
                        <InlineMath math={"x = \\vartheta_1 v^1 + \\cdots + \\vartheta_n v^n"}/> exist and
                        are unique.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(X, \\mathbb{F})"}/>이 기저{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>을 갖고{" "}
                        <InlineMath math={"x \\in X"}/>라 하자. 그러면{" "}
                        <InlineMath math={"x = \\vartheta_1 v^1 + \\cdots + \\vartheta_n v^n"}/>인 계수{" "}
                        <InlineMath math={"\\vartheta_1, \\ldots, \\vartheta_n"}/>이 존재하고 유일하다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            Existence is the spanning property. For uniqueness, suppose{" "}
                            <InlineMath math={"x"}/> also equals{" "}
                            <InlineMath math={"\\varpi_1 v^1 + \\cdots + \\varpi_n v^n"}/> and subtract the
                            two expressions:
                        </p>}
                        ko={<p>
                            존재는 span 조건 그 자체다. 유일성은 <InlineMath math={"x"}/>가{" "}
                            <InlineMath math={"\\varpi_1 v^1 + \\cdots + \\varpi_n v^n"}/>과도 같다고 두고 두
                            식을 빼면 된다.
                        </p>}
                    />
                    <BlockMath math={"0 = x - x = (\\vartheta_1 - \\varpi_1) v^1 + \\cdots + (\\vartheta_n - \\varpi_n) v^n"}/>
                    <Terms items={[
                        ["\\vartheta_i, \\varpi_i", <T en={<>the coefficients of two candidate expansions of the same vector</>}
                                                      ko={<>같은 벡터를 적은 두 후보 전개의 계수</>}/>],
                        ["\\vartheta_i - \\varpi_i", <T en={<>the coefficients of a combination that produces the zero vector</>}
                                                       ko={<>영벡터를 만드는 조합의 계수</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The basis is linearly independent, so the only combination giving{" "}
                            <InlineMath math={"0"}/> is the trivial one. Hence{" "}
                            <InlineMath math={"\\vartheta_i - \\varpi_i = 0"}/> for every{" "}
                            <InlineMath math={"i"}/>, that is, the two expansions were the same one. This is
                            the result that makes the next section possible: a basis turns a vector into an
                            address, and the address is unambiguous.
                        </p>}
                        ko={<p>
                            기저는 선형 독립이므로 <InlineMath math={"0"}/>을 만드는 조합은 자명한 것뿐이다.
                            따라서 모든 <InlineMath math={"i"}/>에 대해{" "}
                            <InlineMath math={"\\vartheta_i - \\varpi_i = 0"}/>이고 두 전개는 애초에 같은
                            것이었다. 다음 절이 가능해지는 근거가 이 결과다. 기저는 벡터를 주소로 바꾸고, 그
                            주소에는 모호함이 없다.
                        </p>}
                    />
                </Proof>
            </Proposition>
            <Proposition n="2.34" title={t("An independent set that is too small can grow",
                "모자란 독립 집합은 키울 수 있다")}>
                <T
                    en={<p>
                        Let <InlineMath math={"(X, \\mathbb{F})"}/> be <InlineMath math={"n"}/>-dimensional
                        and <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/> linearly independent with{" "}
                        <InlineMath math={"k < n"}/>. Then there exists{" "}
                        <InlineMath math={"v^{k+1} \\in X"}/> such that{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^{k+1}\\}"}/> is linearly independent.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(X, \\mathbb{F})"}/>이 <InlineMath math={"n"}/>차원이고{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/>이 선형 독립이며{" "}
                        <InlineMath math={"k < n"}/>이라 하자. 그러면{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^{k+1}\\}"}/>이 선형 독립이 되는{" "}
                        <InlineMath math={"v^{k+1} \\in X"}/>가 존재한다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            By contradiction. Suppose no such <InlineMath math={"v^{k+1}"}/> exists. Then
                            every <InlineMath math={"x \\in X"}/> makes{" "}
                            <InlineMath math={"\\{v^1, \\ldots, v^k, x\\}"}/> dependent, and by Remark 2.13
                            that forces <InlineMath math={"x \\in \\operatorname{span}\\{v^1, \\ldots, v^k\\}"}/>.
                            Therefore
                        </p>}
                        ko={<p>
                            귀류법으로 간다. 그런 <InlineMath math={"v^{k+1}"}/>이 없다고 하자. 그러면 모든{" "}
                            <InlineMath math={"x \\in X"}/>에 대해{" "}
                            <InlineMath math={"\\{v^1, \\ldots, v^k, x\\}"}/>이 종속이고, Remark 2.13에 의해{" "}
                            <InlineMath math={"x \\in \\operatorname{span}\\{v^1, \\ldots, v^k\\}"}/>가
                            강제된다. 따라서
                        </p>}
                    />
                    <BlockMath math={"X \\subset \\operatorname{span}\\{v^1, \\ldots, v^k\\} \\quad \\Longrightarrow \\quad n = \\dim(X) \\le k"}/>
                    <Terms items={[
                        ["X", <T en={<>the whole space, now trapped inside the span of only <InlineMath math={"k"}/> vectors</>}
                                ko={<>공간 전체. 이제 <InlineMath math={"k"}/>개의 span 안에 갇혔다</>}/>],
                        ["\\dim(X)", <T en={<>the dimension <InlineMath math={"n"}/>, which cannot exceed the dimension of a space containing it</>}
                                       ko={<>차원 <InlineMath math={"n"}/>. 자신을 품는 공간의 차원을 넘을 수 없다</>}/>],
                        ["k", <T en={<>the size of the independent set, assumed strictly less than <InlineMath math={"n"}/></>}
                                ko={<>독립 집합의 크기. <InlineMath math={"n"}/>보다 작다고 가정했다</>}/>],
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
            <Corollary n="2.35" title={t("Every independent set completes to a basis",
                "독립 집합은 언제나 기저로 완성된다")}>
                <T
                    en={<p>
                        In a finite dimensional space, if <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/> is
                        linearly independent and <InlineMath math={"k < n = \\dim(X)"}/>, then there exist{" "}
                        <InlineMath math={"v^{k+1}, \\ldots, v^n"}/> making{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> a basis. Apply Proposition 2.34 and
                        induct until the set has <InlineMath math={"n"}/> elements, then apply Theorem 2.31.
                    </p>}
                    ko={<p>
                        유한 차원 공간에서 <InlineMath math={"\\{v^1, \\ldots, v^k\\}"}/>이 선형 독립이고{" "}
                        <InlineMath math={"k < n = \\dim(X)"}/>이면{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>이 기저가 되도록 하는{" "}
                        <InlineMath math={"v^{k+1}, \\ldots, v^n"}/>이 존재한다. Proposition 2.34를 쓰고 원소가{" "}
                        <InlineMath math={"n"}/>개가 될 때까지 귀납한 뒤 Theorem 2.31을 적용하면 된다.
                    </p>}
                />
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
                    Proposition 2.33은 기저가 모든 벡터에 스칼라 열 하나씩을 정확히 배정한다고 말한다. 프로그램이
                    들고 있는 것이 그 열이다. 이 절의 나머지는 기저를 다시 고르면 그 열이 어떻게 되는가에 대한
                    이야기이고, 이것은 좌표계를 바꿀 때 로봇의 좌표가 어떻게 되는가와 같은 질문이다.
                </p>}
            />
            <Definition n="2.36" title={t("Representation with respect to a basis", "기저에 대한 표현")}>
                <T
                    en={<p>
                        Let <InlineMath math={"(X, \\mathbb{F})"}/> have basis{" "}
                        <InlineMath math={"v := \\{v^1, \\ldots, v^n\\}"}/> and write{" "}
                        <InlineMath math={"x = \\vartheta_1 v^1 + \\cdots + \\vartheta_n v^n"}/>, which
                        Proposition 2.33 says can be done in exactly one way. Then
                    </p>}
                    ko={<p>
                        <InlineMath math={"(X, \\mathbb{F})"}/>이 기저{" "}
                        <InlineMath math={"v := \\{v^1, \\ldots, v^n\\}"}/>을 갖는다고 하고,{" "}
                        <InlineMath math={"x = \\vartheta_1 v^1 + \\cdots + \\vartheta_n v^n"}/>으로 적자.
                        Proposition 2.33에 의해 이 방법은 정확히 하나뿐이다. 이때
                    </p>}
                />
                <BlockMath math={"[x]_v := \\begin{bmatrix} \\vartheta_1 \\\\ \\vartheta_2 \\\\ \\vdots \\\\ \\vartheta_n \\end{bmatrix} \\in \\mathbb{F}^n"}/>
                <Terms items={[
                    ["x", <T en={<>the abstract vector: a matrix, a polynomial, whatever <InlineMath math={"X"}/> contains</>}
                            ko={<>추상적인 벡터. 행렬이든 다항식이든 <InlineMath math={"X"}/>가 담은 무엇이든</>}/>],
                    ["v", <T en={<>the chosen basis, an ordered list: reorder it and the column reorders too</>}
                            ko={<>골라 둔 기저. 순서가 있는 목록이며 순서를 바꾸면 열의 순서도 바뀐다</>}/>],
                    ["[x]_v", <T en={<>the representation of <InlineMath math={"x"}/> with respect to <InlineMath math={"v"}/>, an element of <InlineMath math={"\\mathbb{F}^n"}/></>}
                                ko={<><InlineMath math={"v"}/>에 대한 <InlineMath math={"x"}/>의 표현. <InlineMath math={"\\mathbb{F}^n"}/>의 원소다</>}/>],
                    ["\\vartheta_i", <T en={<>the unique coefficients supplied by Proposition 2.33</>}
                                       ko={<>Proposition 2.33이 제공하는 유일한 계수</>}/>],
                ]}/>
                <T
                    en={<p>
                        Read the definition in both directions:{" "}
                        <InlineMath math={"[x]_v = (\\vartheta_1, \\ldots, \\vartheta_n)^\\top"}/> if and only
                        if <InlineMath math={"x = \\vartheta_1 v^1 + \\cdots + \\vartheta_n v^n"}/>. Once the
                        basis is fixed you may work with <InlineMath math={"n"}/>-tuples as if they were the
                        vectors, which is the whole point.
                    </p>}
                    ko={<p>
                        정의를 양방향으로 읽자.{" "}
                        <InlineMath math={"[x]_v = (\\vartheta_1, \\ldots, \\vartheta_n)^\\top"}/>인 것은{" "}
                        <InlineMath math={"x = \\vartheta_1 v^1 + \\cdots + \\vartheta_n v^n"}/>인 것과
                        동치다. 기저를 고정하고 나면 <InlineMath math={"n"}/>-튜플을 벡터인 양 다뤄도 되고,
                        그것이 이 정의의 목적 전부다.
                    </p>}
                />
            </Definition>
            <Example n="2.38" title={t("The same matrix in two bases", "같은 행렬을 두 기저로")}>
                <T
                    en={<p>
                        Take <InlineMath math={"\\mathbb{F} = \\mathbb{R}"}/>,{" "}
                        <InlineMath math={"X = \\mathbb{R}^{2 \\times 2}"}/>, and
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathbb{F} = \\mathbb{R}"}/>,{" "}
                        <InlineMath math={"X = \\mathbb{R}^{2 \\times 2}"}/>, 그리고
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
                        In the natural basis{" "}
                        <InlineMath math={"v := \\{v^1, v^2, v^3, v^4\\}"}/> of matrix units, inspection
                        gives <InlineMath math={"[x]_v = (5, 3, 1, 4)^\\top"}/>. In the basis{" "}
                        <InlineMath math={"w"}/> we have to solve:
                    </p>}
                    ko={<p>
                        행렬 단위로 이루어진 표준 기저{" "}
                        <InlineMath math={"v := \\{v^1, v^2, v^3, v^4\\}"}/>에서는 눈으로 읽어{" "}
                        <InlineMath math={"[x]_v = (5, 3, 1, 4)^\\top"}/>이다. 기저{" "}
                        <InlineMath math={"w"}/>에서는 풀어야 한다.
                    </p>}
                />
                <BlockMath math={"\\vartheta_1 w^1 + \\vartheta_2 w^2 + \\vartheta_3 w^3 + \\vartheta_4 w^4 = \\begin{bmatrix} \\vartheta_1 & \\vartheta_2 + \\vartheta_3 \\\\ \\vartheta_2 - \\vartheta_3 & \\vartheta_3 + \\vartheta_4 \\end{bmatrix} = \\begin{bmatrix} 5 & 3 \\\\ 1 & 4 \\end{bmatrix}"}/>
                <Terms items={[
                    ["\\vartheta_i", <T en={<>the four unknown coordinates of <InlineMath math={"x"}/> in the basis <InlineMath math={"w"}/></>}
                                       ko={<>기저 <InlineMath math={"w"}/>에서 <InlineMath math={"x"}/>의 좌표 넷. 아직 모른다</>}/>],
                    ["\\vartheta_2 + \\vartheta_3", <T en={<>the (1,2) entry, giving one of four scalar equations</>}
                                                      ko={<>(1,2) 성분. 스칼라 방정식 넷 중 하나를 준다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Four equations in four unknowns give{" "}
                        <InlineMath math={"\\vartheta = (5, 2, 1, 3)"}/>, so{" "}
                        <InlineMath math={"[x]_w = (5, 2, 1, 3)^\\top"}/>. Same vector, different address.
                        Neither column is more correct than the other.
                    </p>}
                    ko={<p>
                        미지수 넷에 방정식 넷을 풀면 <InlineMath math={"\\vartheta = (5, 2, 1, 3)"}/>이므로{" "}
                        <InlineMath math={"[x]_w = (5, 2, 1, 3)^\\top"}/>이다. 같은 벡터, 다른 주소다. 어느
                        열이 더 옳은 것은 아니다.
                    </p>}
                />
            </Example>
            <Proposition n="2.39" title={t("Representation respects the operations", "표현은 연산을 보존한다")}>
                <BlockMath math={"[x + y]_v = [x]_v + [y]_v, \\qquad [\\vartheta x]_v = \\vartheta [x]_v"}/>
                <Terms items={[
                    ["x, y", <T en={<>vectors in <InlineMath math={"X"}/></>} ko={<><InlineMath math={"X"}/>의 벡터</>}/>],
                    ["\\vartheta", <T en={<>a scalar in <InlineMath math={"\\mathbb{F}"}/></>}
                                     ko={<><InlineMath math={"\\mathbb{F}"}/>의 스칼라</>}/>],
                    ["[\\,\\cdot\\,]_v", <T en={<>the representation map into <InlineMath math={"\\mathbb{F}^n"}/>, one-to-one and onto once <InlineMath math={"v"}/> is fixed</>}
                                           ko={<><InlineMath math={"\\mathbb{F}^n"}/>으로 가는 표현 사상. <InlineMath math={"v"}/>를 고정하면 일대일 대응이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Adding vectors in <InlineMath math={"X"}/> is the same as adding their columns in{" "}
                        <InlineMath math={"\\mathbb{F}^n"}/>, and scaling behaves the same way. So once a
                        basis <InlineMath math={"v"}/> is chosen, an <InlineMath math={"n"}/>-dimensional
                        space is <InlineMath math={"(\\mathbb{F}^n, \\mathbb{F})"}/> for every purpose in
                        this course.
                    </p>}
                    ko={<p>
                        <InlineMath math={"X"}/>에서 벡터를 더하는 일과{" "}
                        <InlineMath math={"\\mathbb{F}^n"}/>에서 열을 더하는 일이 같고, 스칼라배도
                        마찬가지다. 그래서 기저 <InlineMath math={"v"}/>를 하나 고르고 나면{" "}
                        <InlineMath math={"n"}/>차원 공간은 이 과목의 모든 목적에서{" "}
                        <InlineMath math={"(\\mathbb{F}^n, \\mathbb{F})"}/>이다.
                    </p>}
                />
            </Proposition>
            <Theorem n="2.40" title={t("Change of basis matrix", "기저 변환 행렬")}>
                <T
                    en={<p>
                        Let <InlineMath math={"u := \\{u^1, \\ldots, u^n\\}"}/> and{" "}
                        <InlineMath math={"\\bar u := \\{\\bar u^1, \\ldots, \\bar u^n\\}"}/> be two bases for{" "}
                        <InlineMath math={"(X, \\mathbb{F})"}/>. There is an invertible matrix{" "}
                        <InlineMath math={"P"}/> with coefficients in <InlineMath math={"\\mathbb{F}"}/> such
                        that
                    </p>}
                    ko={<p>
                        <InlineMath math={"u := \\{u^1, \\ldots, u^n\\}"}/>과{" "}
                        <InlineMath math={"\\bar u := \\{\\bar u^1, \\ldots, \\bar u^n\\}"}/>을{" "}
                        <InlineMath math={"(X, \\mathbb{F})"}/>의 두 기저라 하자. 그러면 계수가{" "}
                        <InlineMath math={"\\mathbb{F}"}/>에 있는 가역 행렬 <InlineMath math={"P"}/>가 있어서
                    </p>}
                />
                <BlockMath math={"\\forall x \\in X, \\quad [x]_u = P\\,[x]_{\\bar u}, \\qquad P = \\begin{bmatrix} P_1 & P_2 & \\cdots & P_n \\end{bmatrix}, \\quad P_i := [\\bar u^i]_u"}/>
                <Terms items={[
                    ["u, \\bar u", <T en={<>the old and the new basis, both ordered lists of <InlineMath math={"n"}/> vectors</>}
                                     ko={<>이전 기저와 새 기저. 둘 다 벡터 <InlineMath math={"n"}/>개의 순서 있는 목록이다</>}/>],
                    ["P_i", <T en={<>the <InlineMath math={"i"}/>-th column of <InlineMath math={"P"}/>: the new basis vector <InlineMath math={"\\bar u^i"}/> written in the old basis</>}
                              ko={<><InlineMath math={"P"}/>의 <InlineMath math={"i"}/>번째 열. 새 기저 벡터 <InlineMath math={"\\bar u^i"}/>를 이전 기저로 적은 것이다</>}/>],
                    ["[x]_{\\bar u}", <T en={<>the coordinates of <InlineMath math={"x"}/> in the new basis</>}
                                        ko={<>새 기저에서 <InlineMath math={"x"}/>의 좌표</>}/>],
                    ["P", <T en={<>the change of basis matrix, which maps new coordinates to old ones</>}
                            ko={<>기저 변환 행렬. 새 좌표를 이전 좌표로 옮긴다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Symmetrically there is a matrix <InlineMath math={"\\bar P"}/> with{" "}
                        <InlineMath math={"\\bar P_i := [u^i]_{\\bar u}"}/> and{" "}
                        <InlineMath math={"[x]_{\\bar u} = \\bar P [x]_u"}/>, and{" "}
                        <InlineMath math={"P \\bar P = \\bar P P = I"}/>.
                    </p>}
                    ko={<p>
                        대칭적으로 <InlineMath math={"\\bar P_i := [u^i]_{\\bar u}"}/>이고{" "}
                        <InlineMath math={"[x]_{\\bar u} = \\bar P [x]_u"}/>인 행렬{" "}
                        <InlineMath math={"\\bar P"}/>도 있으며{" "}
                        <InlineMath math={"P \\bar P = \\bar P P = I"}/>이다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            Write the same <InlineMath math={"x"}/> in both bases, and name the two columns
                            of coefficients:
                        </p>}
                        ko={<p>
                            같은 <InlineMath math={"x"}/>를 두 기저로 적고, 계수 열 두 개에 이름을 붙인다.
                        </p>}
                    />
                    <BlockMath math={"x = \\sum_{i=1}^{n} \\vartheta_i u^i = \\sum_{i=1}^{n} \\bar\\vartheta_i \\bar u^i, \\qquad \\vartheta := [x]_u, \\quad \\bar\\vartheta := [x]_{\\bar u}"}/>
                    <Terms items={[
                        ["\\vartheta", <T en={<>the column of coordinates in the old basis</>}
                                         ko={<>이전 기저에서의 좌표 열</>}/>],
                        ["\\bar\\vartheta", <T en={<>the column of coordinates in the new basis</>}
                                              ko={<>새 기저에서의 좌표 열</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Apply <InlineMath math={"[\\,\\cdot\\,]_u"}/> to the second expression and use
                            Proposition 2.39 twice, once for the sum and once for each scalar:
                        </p>}
                        ko={<p>
                            둘째 표현에 <InlineMath math={"[\\,\\cdot\\,]_u"}/>를 적용하고 Proposition 2.39를
                            두 번 쓴다. 합에 한 번, 스칼라마다 한 번이다.
                        </p>}
                    />
                    <BlockMath math={"\\vartheta = [x]_u = \\Big[\\sum_{i=1}^n \\bar\\vartheta_i \\bar u^i\\Big]_u = \\sum_{i=1}^n \\bar\\vartheta_i \\, [\\bar u^i]_u = \\sum_{i=1}^n \\bar\\vartheta_i P_i = P \\bar\\vartheta"}/>
                    <Terms items={[
                        ["[\\bar u^i]_u", <T en={<>the old-basis coordinates of a new basis vector, which is exactly column <InlineMath math={"i"}/> of <InlineMath math={"P"}/></>}
                                            ko={<>새 기저 벡터를 이전 기저 좌표로 적은 것. 바로 <InlineMath math={"P"}/>의 <InlineMath math={"i"}/>번째 열이다</>}/>],
                        ["\\sum_i \\bar\\vartheta_i P_i", <T en={<>a linear combination of the columns of <InlineMath math={"P"}/>, which is the definition of the product <InlineMath math={"P\\bar\\vartheta"}/></>}
                                                            ko={<><InlineMath math={"P"}/>의 열들의 선형 결합. 이것이 곱 <InlineMath math={"P\\bar\\vartheta"}/>의 정의다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The same computation with the roles exchanged gives{" "}
                            <InlineMath math={"\\bar\\vartheta = \\bar P \\vartheta"}/>. Substituting one into
                            the other,
                        </p>}
                        ko={<p>
                            역할을 바꿔 같은 계산을 하면{" "}
                            <InlineMath math={"\\bar\\vartheta = \\bar P \\vartheta"}/>가 나온다. 하나를 다른
                            하나에 대입하면
                        </p>}
                    />
                    <BlockMath math={"\\vartheta = P \\bar P \\vartheta \\ \\text{ and } \\ \\bar\\vartheta = \\bar P P \\bar\\vartheta \\quad \\text{for every } x \\quad \\Longrightarrow \\quad P \\bar P = \\bar P P = I"}/>
                    <Terms items={[
                        ["\\text{for every } x", <T en={<>as <InlineMath math={"x"}/> ranges over <InlineMath math={"X"}/>, <InlineMath math={"\\vartheta"}/> ranges over all of <InlineMath math={"\\mathbb{F}^n"}/>, which is what forces the matrix identity</>}
                                                   ko={<><InlineMath math={"x"}/>가 <InlineMath math={"X"}/>를 훑으면 <InlineMath math={"\\vartheta"}/>가 <InlineMath math={"\\mathbb{F}^n"}/> 전체를 훑는다. 행렬 등식이 강제되는 이유가 이것이다</>}/>],
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
            <Example n="2.41" title={t("Computing the easy one and inverting", "쉬운 쪽을 구하고 역행렬을 취한다")}>
                <T
                    en={<p>
                        With <InlineMath math={"\\mathbb{F} = \\mathbb{R}"}/> and{" "}
                        <InlineMath math={"X = \\mathbb{R}^{2 \\times 2}"}/>, let{" "}
                        <InlineMath math={"u"}/> be the natural basis of matrix units and
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\mathbb{F} = \\mathbb{R}"}/>,{" "}
                        <InlineMath math={"X = \\mathbb{R}^{2 \\times 2}"}/>에서{" "}
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
                        The columns of <InlineMath math={"P"}/> are{" "}
                        <InlineMath math={"[\\bar u^i]_u"}/>, and each of those is read off by inspection,
                        which is why we compute this direction first:
                    </p>}
                    ko={<p>
                        <InlineMath math={"P"}/>의 열은 <InlineMath math={"[\\bar u^i]_u"}/>이고 그것들은 눈으로
                        읽힌다. 이 방향을 먼저 계산하는 이유가 그것이다.
                    </p>}
                />
                <BlockMath math={"P = \\begin{bmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 1 & 0 \\\\ 0 & 1 & -1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}, \\qquad \\bar P = P^{-1} = \\begin{bmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 0.5 & 0.5 & 0 \\\\ 0 & 0.5 & -0.5 & 0 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}"}/>
                <Terms items={[
                    ["P", <T en={<>columns <InlineMath math={"[\\bar u^i]_u"}/>, obtained by inspection</>}
                            ko={<>열이 <InlineMath math={"[\\bar u^i]_u"}/>인 행렬. 눈으로 읽어 얻었다</>}/>],
                    ["\\bar P", <T en={<>columns <InlineMath math={"[u^i]_{\\bar u}"}/>, obtained here by inverting rather than by re-deriving</>}
                                  ko={<>열이 <InlineMath math={"[u^i]_{\\bar u}"}/>인 행렬. 여기서는 다시 유도하지 않고 역행렬로 얻었다</>}/>],
                    ["0.5", <T en={<>the coefficients that turn <InlineMath math={"u^2"}/> into a half-symmetric, half-skew combination</>}
                              ko={<><InlineMath math={"u^2"}/>를 대칭 절반, 반대칭 절반의 결합으로 만드는 계수</>}/>],
                ]}/>
                <T
                    en={<p>
                        Deriving <InlineMath math={"\\bar P"}/> directly means writing each{" "}
                        <InlineMath math={"u^i"}/> in the basis <InlineMath math={"\\bar u"}/>, for
                        instance <InlineMath math={"u^2 = 0.5\\,\\bar u^2 + 0.5\\,\\bar u^3"}/>. It agrees
                        with the inverse, as Theorem 2.40 promises. Typically you compute whichever of the
                        two is available by inspection and invert.
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\bar P"}/>를 직접 유도한다는 것은 각{" "}
                        <InlineMath math={"u^i"}/>를 기저 <InlineMath math={"\\bar u"}/>로 적는다는 뜻이다.
                        예를 들어 <InlineMath math={"u^2 = 0.5\\,\\bar u^2 + 0.5\\,\\bar u^3"}/>이다. 결과는
                        Theorem 2.40이 약속한 대로 역행렬과 일치한다. 실전에서는 둘 중 눈으로 읽히는 쪽을
                        계산하고 역행렬을 취한다.
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
                    differentiation of polynomials becomes a 4 × 4 array you can multiply.
                </p>}
                ko={<p>
                    선형 연산자는 좌표를 말하지 않고 정의된다. 행렬은 기저 둘을 고른 뒤에야 나타나며, 추상화가
                    수고를 들일 값어치가 있었던 이유가 그것이다. 다항식의 미분이 곱셈할 수 있는 4 × 4 배열이
                    된다.
                </p>}
            />
            <Definition n="2.42" title={t("Linear operator", "선형 연산자")}>
                <T
                    en={<p>
                        Let <InlineMath math={"(X, \\mathbb{F})"}/> and{" "}
                        <InlineMath math={"(Y, \\mathbb{F})"}/> be vector spaces over the{" "}
                        <em>same</em> field. Then <InlineMath math={"L : X \\to Y"}/> is a{" "}
                        <strong>linear operator</strong> if
                    </p>}
                    ko={<p>
                        <InlineMath math={"(X, \\mathbb{F})"}/>과{" "}
                        <InlineMath math={"(Y, \\mathbb{F})"}/>이 <em>같은</em> 체 위의 벡터 공간이라 하자.
                        이때 <InlineMath math={"L : X \\to Y"}/>가 다음을 만족하면{" "}
                        <strong>선형 연산자</strong>다.
                    </p>}
                />
                <BlockMath math={"\\forall x, z \\in X, \\; \\forall \\vartheta, \\varpi \\in \\mathbb{F}, \\quad L(\\vartheta x + \\varpi z) = \\vartheta L(x) + \\varpi L(z)"}/>
                <Terms items={[
                    ["L", <T en={<>the operator, a map between vector spaces, defined with no reference to a basis</>}
                            ko={<>연산자. 벡터 공간 사이의 사상이며 기저를 언급하지 않고 정의된다</>}/>],
                    ["x, z", <T en={<>arbitrary vectors of the domain <InlineMath math={"X"}/></>}
                               ko={<>정의역 <InlineMath math={"X"}/>의 임의의 벡터</>}/>],
                    ["\\vartheta, \\varpi", <T en={<>arbitrary scalars of the common field</>}
                                              ko={<>공통 체의 임의의 스칼라</>}/>],
                ]}/>
                <T
                    en={<p>
                        Equivalently, check <InlineMath math={"L(x + z) = L(x) + L(z)"}/> and{" "}
                        <InlineMath math={"L(\\vartheta x) = \\vartheta L(x)"}/> separately.
                    </p>}
                    ko={<p>
                        같은 말로 <InlineMath math={"L(x + z) = L(x) + L(z)"}/>와{" "}
                        <InlineMath math={"L(\\vartheta x) = \\vartheta L(x)"}/>를 따로 확인해도 된다.
                    </p>}
                />
            </Definition>
            <Example n="2.43" title={t("Two linear operators", "선형 연산자 둘")}>
                <T
                    en={<ul>
                        <li>Let <InlineMath math={"A"}/> be <InlineMath math={"n \\times m"}/> with
                            coefficients in <InlineMath math={"\\mathbb{F}"}/>. Then{" "}
                            <InlineMath math={"L(x) := Ax"}/> is linear, since{" "}
                            <InlineMath math={"A(\\vartheta x + \\varpi z) = \\vartheta Ax + \\varpi Az"}/>.</li>
                        <li>Let <InlineMath math={"X = Y"}/> be the polynomials of degree{" "}
                            <InlineMath math={"\\le 3"}/> over <InlineMath math={"\\mathbb{R}"}/>. Then{" "}
                            <InlineMath math={"L(p) := \\tfrac{d}{dt} p"}/> is linear, because
                            differentiation distributes over sums and pulls constants out.</li>
                    </ul>}
                    ko={<ul>
                        <li><InlineMath math={"A"}/>를 계수가 <InlineMath math={"\\mathbb{F}"}/>에 있는{" "}
                            <InlineMath math={"n \\times m"}/> 행렬이라 하자.{" "}
                            <InlineMath math={"A(\\vartheta x + \\varpi z) = \\vartheta Ax + \\varpi Az"}/>이므로{" "}
                            <InlineMath math={"L(x) := Ax"}/>는 선형이다.</li>
                        <li><InlineMath math={"X = Y"}/>를 <InlineMath math={"\\mathbb{R}"}/> 위의 차수{" "}
                            <InlineMath math={"\\le 3"}/>인 다항식 전체라 하자. 미분은 합에 분배되고 상수를
                            밖으로 빼내므로 <InlineMath math={"L(p) := \\tfrac{d}{dt} p"}/>는 선형이다.</li>
                    </ul>}
                />
            </Example>
            <Definition n="2.44" title={t("Matrix representation of an operator", "연산자의 행렬 표현")}>
                <T
                    en={<p>
                        Let <InlineMath math={"X"}/> and <InlineMath math={"Y"}/> be finite dimensional with
                        bases <InlineMath math={"u := \\{u^1, \\ldots, u^m\\}"}/> for{" "}
                        <InlineMath math={"X"}/> and <InlineMath math={"v := \\{v^1, \\ldots, v^n\\}"}/> for{" "}
                        <InlineMath math={"Y"}/>. A <strong>matrix representation</strong> of{" "}
                        <InlineMath math={"L"}/> is an <InlineMath math={"n \\times m"}/> matrix{" "}
                        <InlineMath math={"A"}/> with
                    </p>}
                    ko={<p>
                        <InlineMath math={"X"}/>와 <InlineMath math={"Y"}/>가 유한 차원이고 기저가 각각{" "}
                        <InlineMath math={"u := \\{u^1, \\ldots, u^m\\}"}/>,{" "}
                        <InlineMath math={"v := \\{v^1, \\ldots, v^n\\}"}/>이라 하자.{" "}
                        <InlineMath math={"L"}/>의 <strong>행렬 표현</strong>은 다음을 만족하는{" "}
                        <InlineMath math={"n \\times m"}/> 행렬 <InlineMath math={"A"}/>다.
                    </p>}
                />
                <BlockMath math={"\\forall x \\in X, \\quad [L(x)]_v = A\\,[x]_u"}/>
                <Terms items={[
                    ["A", <T en={<>the matrix representation, which depends on <InlineMath math={"L"}/>, on <InlineMath math={"u"}/>, and on <InlineMath math={"v"}/></>}
                            ko={<>행렬 표현. <InlineMath math={"L"}/>과 <InlineMath math={"u"}/>, <InlineMath math={"v"}/>에 함께 의존한다</>}/>],
                    ["[x]_u", <T en={<>the input written as a column of <InlineMath math={"m"}/> scalars</>}
                                ko={<>입력을 스칼라 <InlineMath math={"m"}/>개의 열로 적은 것</>}/>],
                    ["[L(x)]_v", <T en={<>the output written as a column of <InlineMath math={"n"}/> scalars</>}
                                   ko={<>출력을 스칼라 <InlineMath math={"n"}/>개의 열로 적은 것</>}/>],
                ]}/>
            </Definition>
            <Theorem n="2.45" title={t("The columns are the images of the basis vectors",
                "열은 기저 벡터의 상이다")}>
                <T
                    en={<p>
                        With the notation of Definition 2.44, <InlineMath math={"L"}/> has the matrix
                        representation whose <InlineMath math={"i"}/>-th column is{" "}
                        <InlineMath math={"A_i := [L(u^i)]_v"}/> for{" "}
                        <InlineMath math={"1 \\le i \\le m"}/>.
                    </p>}
                    ko={<p>
                        Definition 2.44의 기호를 그대로 쓰면, <InlineMath math={"L"}/>의 행렬 표현은{" "}
                        <InlineMath math={"1 \\le i \\le m"}/>에 대해 <InlineMath math={"i"}/>번째 열이{" "}
                        <InlineMath math={"A_i := [L(u^i)]_v"}/>인 행렬이다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            Write <InlineMath math={"x = \\vartheta_1 u^1 + \\cdots + \\vartheta_m u^m"}/>, so
                            that <InlineMath math={"[x]_u = (\\vartheta_1, \\ldots, \\vartheta_m)^\\top"}/>.
                            Linearity moves <InlineMath math={"L"}/> inside the sum, and Proposition 2.39
                            moves the representation inside as well:
                        </p>}
                        ko={<p>
                            <InlineMath math={"x = \\vartheta_1 u^1 + \\cdots + \\vartheta_m u^m"}/>으로 적으면{" "}
                            <InlineMath math={"[x]_u = (\\vartheta_1, \\ldots, \\vartheta_m)^\\top"}/>이다.
                            선형성이 <InlineMath math={"L"}/>을 합 안으로 넣고, Proposition 2.39가 표현도 합
                            안으로 넣는다.
                        </p>}
                    />
                    <BlockMath math={"[L(x)]_v = \\Big[\\sum_{i=1}^m \\vartheta_i L(u^i)\\Big]_v = \\sum_{i=1}^m \\vartheta_i [L(u^i)]_v = \\sum_{i=1}^m \\vartheta_i A_i = A\\,[x]_u"}/>
                    <Terms items={[
                        ["L(u^i)", <T en={<>the image of the <InlineMath math={"i"}/>-th basis vector, an element of <InlineMath math={"Y"}/></>}
                                     ko={<><InlineMath math={"i"}/>번째 기저 벡터의 상. <InlineMath math={"Y"}/>의 원소다</>}/>],
                        ["A_i", <T en={<>its representation <InlineMath math={"[L(u^i)]_v"}/>, a column of <InlineMath math={"n"}/> scalars</>}
                                  ko={<>그 표현 <InlineMath math={"[L(u^i)]_v"}/>. 스칼라 <InlineMath math={"n"}/>개의 열이다</>}/>],
                        ["\\sum_i \\vartheta_i A_i", <T en={<>a linear combination of the columns of <InlineMath math={"A"}/>, which is the matrix-vector product</>}
                                                       ko={<><InlineMath math={"A"}/>의 열들의 선형 결합. 곧 행렬과 벡터의 곱이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Since <InlineMath math={"x"}/> was arbitrary, this <InlineMath math={"A"}/>{" "}
                            satisfies Definition 2.44. To build a matrix representation you therefore never
                            solve a system: you push each basis vector through{" "}
                            <InlineMath math={"L"}/> and read off its coordinates.
                        </p>}
                        ko={<p>
                            <InlineMath math={"x"}/>를 임의로 잡았으므로 이 <InlineMath math={"A"}/>는
                            Definition 2.44를 만족한다. 그래서 행렬 표현을 만들 때는 연립방정식을 풀 일이
                            없다. 기저 벡터를 하나씩 <InlineMath math={"L"}/>에 통과시키고 좌표를 읽으면 된다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Example n="2.46" title={t("Differentiation as a 4 × 4 matrix", "4 × 4 행렬이 된 미분")}>
                <T
                    en={<p>
                        Let <InlineMath math={"X = Y = P_3(t)"}/>, polynomials of degree{" "}
                        <InlineMath math={"\\le 3"}/>, with{" "}
                        <InlineMath math={"u = v = \\{1, t, t^2, t^3\\}"}/> and{" "}
                        <InlineMath math={"L(p) := \\tfrac{d}{dt}p"}/>. Theorem 2.45 says to differentiate
                        each basis vector and write down what you get:{" "}
                        <InlineMath math={"L(1) = 0"}/>, <InlineMath math={"L(t) = 1"}/>,{" "}
                        <InlineMath math={"L(t^2) = 2t"}/>, <InlineMath math={"L(t^3) = 3t^2"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"X = Y = P_3(t)"}/>를 차수 <InlineMath math={"\\le 3"}/>인 다항식
                        전체라 하고 <InlineMath math={"u = v = \\{1, t, t^2, t^3\\}"}/>,{" "}
                        <InlineMath math={"L(p) := \\tfrac{d}{dt}p"}/>라 하자. Theorem 2.45는 기저 벡터를
                        하나씩 미분해 그 결과를 적으라고 말한다.{" "}
                        <InlineMath math={"L(1) = 0"}/>, <InlineMath math={"L(t) = 1"}/>,{" "}
                        <InlineMath math={"L(t^2) = 2t"}/>, <InlineMath math={"L(t^3) = 3t^2"}/>이다.
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
            </Example>
            <Example n="2.47" title={t("The identity operator is the change of basis matrix",
                "항등 연산자가 곧 기저 변환 행렬이다")}>
                <T
                    en={<p>
                        Let <InlineMath math={"L = \\mathrm{Id}"}/> on <InlineMath math={"X"}/>, with basis{" "}
                        <InlineMath math={"u"}/> on the input side and{" "}
                        <InlineMath math={"v"}/> on the output side. Theorem 2.45 gives{" "}
                        <InlineMath math={"A_i = [\\mathrm{Id}(u^i)]_v = [u^i]_v"}/>, which is exactly the
                        recipe for a change of basis matrix in Theorem 2.40. So
                    </p>}
                    ko={<p>
                        <InlineMath math={"X"}/> 위의 <InlineMath math={"L = \\mathrm{Id}"}/>를 생각하고 입력
                        쪽 기저를 <InlineMath math={"u"}/>, 출력 쪽 기저를 <InlineMath math={"v"}/>라 하자.
                        Theorem 2.45가 주는{" "}
                        <InlineMath math={"A_i = [\\mathrm{Id}(u^i)]_v = [u^i]_v"}/>는 Theorem 2.40의 기저
                        변환 행렬 만드는 법 그 자체다. 따라서
                    </p>}
                />
                <BlockMath math={"[x]_v = [\\mathrm{Id}(x)]_v = A\\,[x]_u \\quad \\Longrightarrow \\quad A = \\text{the change of basis matrix from } u \\text{ to } v"}/>
                <Terms items={[
                    ["\\mathrm{Id}", <T en={<>the identity operator, <InlineMath math={"\\mathrm{Id}(x) = x"}/> for every <InlineMath math={"x"}/></>}
                                       ko={<>항등 연산자. 모든 <InlineMath math={"x"}/>에 대해 <InlineMath math={"\\mathrm{Id}(x) = x"}/>다</>}/>],
                    ["A", <T en={<>its matrix representation, which turns out to depend only on the two bases</>}
                            ko={<>그 행렬 표현. 결국 두 기저에만 의존한다</>}/>],
                ]}/>
                <T
                    en={<p>
                        There is really only one idea in this chapter's last three sections, seen from two
                        directions: change the operator and keep the bases, or keep the operator and change
                        the bases.
                    </p>}
                    ko={<p>
                        이 장의 마지막 세 절에는 사실 아이디어가 하나뿐이고, 그것을 두 방향에서 볼 뿐이다.
                        기저를 두고 연산자를 바꾸거나, 연산자를 두고 기저를 바꾸는 것이다.
                    </p>}
                />
            </Example>
            <Example n="2.49" title={t("The same operator in two bases", "같은 연산자를 두 기저로")}>
                <T
                    en={<p>
                        Let <InlineMath math={"(X, \\mathbb{F}) = (\\mathbb{R}^2, \\mathbb{R})"}/> and define{" "}
                        <InlineMath math={"L"}/> by <InlineMath math={"L(e^1) = 3e^1 + 4e^2"}/> and{" "}
                        <InlineMath math={"L(e^2) = -e^1 + 6e^2"}/>. In the natural basis, Theorem 2.45 reads
                        the columns straight off:
                    </p>}
                    ko={<p>
                        <InlineMath math={"(X, \\mathbb{F}) = (\\mathbb{R}^2, \\mathbb{R})"}/>에서{" "}
                        <InlineMath math={"L(e^1) = 3e^1 + 4e^2"}/>,{" "}
                        <InlineMath math={"L(e^2) = -e^1 + 6e^2"}/>으로 <InlineMath math={"L"}/>을 정의하자.
                        표준 기저에서는 Theorem 2.45가 열을 그대로 읽어 준다.
                    </p>}
                />
                <BlockMath math={"A = \\begin{bmatrix} 3 & -1 \\\\ 4 & 6 \\end{bmatrix}, \\qquad v^1 = e^1 + e^2, \\quad v^2 = 3e^1 - 4e^2, \\qquad P = \\begin{bmatrix} 1 & 3 \\\\ 1 & -4 \\end{bmatrix}"}/>
                <Terms items={[
                    ["A", <T en={<>the representation of <InlineMath math={"L"}/> in the natural basis <InlineMath math={"e"}/></>}
                            ko={<>표준 기저 <InlineMath math={"e"}/>에서 <InlineMath math={"L"}/>의 표현</>}/>],
                    ["v^1, v^2", <T en={<>the second basis, given in terms of the natural one</>}
                                   ko={<>둘째 기저. 표준 기저로 적어 두었다</>}/>],
                    ["P", <T en={<>the change of basis matrix, columns <InlineMath math={"[v^i]_e"}/>, so <InlineMath math={"[x]_e = P[x]_v"}/></>}
                            ko={<>기저 변환 행렬. 열이 <InlineMath math={"[v^i]_e"}/>이므로 <InlineMath math={"[x]_e = P[x]_v"}/>다</>}/>],
                ]}/>
                <Proof label={t("Finding the representation in the second basis", "둘째 기저에서의 표현 구하기")}>
                    <T
                        en={<p>
                            Chase the three arrows: take <InlineMath math={"v"}/>-coordinates to{" "}
                            <InlineMath math={"e"}/>-coordinates with <InlineMath math={"P"}/>, apply{" "}
                            <InlineMath math={"A"}/> there, and come back with{" "}
                            <InlineMath math={"P^{-1}"}/>.
                        </p>}
                        ko={<p>
                            화살표 셋을 따라간다. <InlineMath math={"P"}/>로{" "}
                            <InlineMath math={"v"}/> 좌표를 <InlineMath math={"e"}/> 좌표로 옮기고, 거기서{" "}
                            <InlineMath math={"A"}/>를 적용한 뒤, <InlineMath math={"P^{-1}"}/>로 돌아온다.
                        </p>}
                    />
                    <BlockMath math={"\\bar A = P^{-1} A P = \\frac{1}{7}\\begin{bmatrix} 4 & 3 \\\\ 1 & -1 \\end{bmatrix} \\begin{bmatrix} 3 & -1 \\\\ 4 & 6 \\end{bmatrix} \\begin{bmatrix} 1 & 3 \\\\ 1 & -4 \\end{bmatrix} = \\frac{1}{7}\\begin{bmatrix} 38 & 16 \\\\ -8 & 25 \\end{bmatrix}"}/>
                    <Terms items={[
                        ["\\bar A", <T en={<>the representation of the same operator <InlineMath math={"L"}/> in the basis <InlineMath math={"v"}/></>}
                                      ko={<>같은 연산자 <InlineMath math={"L"}/>을 기저 <InlineMath math={"v"}/>로 적은 표현</>}/>],
                        ["P^{-1}", <T en={<>equal to <InlineMath math={"\\tfrac{1}{7}\\begin{bmatrix} 4 & 3 \\\\ 1 & -1 \\end{bmatrix}"}/>, since <InlineMath math={"\\det P = -7"}/></>}
                                     ko={<><InlineMath math={"\\det P = -7"}/>이므로 <InlineMath math={"\\tfrac{1}{7}\\begin{bmatrix} 4 & 3 \\\\ 1 & -1 \\end{bmatrix}"}/>과 같다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The long way confirms it. <InlineMath math={"L(v^1) = L(e^1) + L(e^2) = 2e^1 + 10e^2"}/>,
                            and solving <InlineMath math={"a_{11} v^1 + a_{21} v^2 = 2e^1 + 10e^2"}/> gives{" "}
                            <InlineMath math={"\\tfrac{1}{7}(38, -8)^\\top"}/>, which is the first column of{" "}
                            <InlineMath math={"\\bar A"}/>. Similarly{" "}
                            <InlineMath math={"L(v^2) = 13e^1 - 12e^2"}/> gives{" "}
                            <InlineMath math={"\\tfrac{1}{7}(16, 25)^\\top"}/>.
                        </p>}
                        ko={<p>
                            먼 길로 가도 같은 답이 나온다.{" "}
                            <InlineMath math={"L(v^1) = L(e^1) + L(e^2) = 2e^1 + 10e^2"}/>이고{" "}
                            <InlineMath math={"a_{11} v^1 + a_{21} v^2 = 2e^1 + 10e^2"}/>을 풀면{" "}
                            <InlineMath math={"\\tfrac{1}{7}(38, -8)^\\top"}/>이 나오는데, 이것이{" "}
                            <InlineMath math={"\\bar A"}/>의 첫째 열이다. 마찬가지로{" "}
                            <InlineMath math={"L(v^2) = 13e^1 - 12e^2"}/>에서{" "}
                            <InlineMath math={"\\tfrac{1}{7}(16, 25)^\\top"}/>이 나온다.
                        </p>}
                    />
                </Proof>
            </Example>
            <Remark title={t("Matching the notes: check columns, not names",
                "원 교재와 대조할 때는 이름이 아니라 열을 본다")}>
                <T
                    en={<p>
                        The notes put the bar on the other matrix in Example 2.49 than in Theorem 2.40, so
                        the safe way to line up a formula with the PDF is to ask what the columns of a matrix
                        are. Here <InlineMath math={"P"}/> has columns{" "}
                        <InlineMath math={"[v^i]_e"}/> and therefore maps{" "}
                        <InlineMath math={"v"}/>-coordinates to <InlineMath math={"e"}/>-coordinates, which
                        fixes every other symbol in the computation.
                    </p>}
                    ko={<p>
                        원 교재는 Example 2.49에서 Theorem 2.40과 반대쪽 행렬에 bar를 붙여 두었다. 그래서
                        PDF의 식과 맞춰 볼 때 안전한 방법은 행렬의 열이 무엇인지를 묻는 것이다. 여기서{" "}
                        <InlineMath math={"P"}/>의 열은 <InlineMath math={"[v^i]_e"}/>이고 따라서{" "}
                        <InlineMath math={"v"}/> 좌표를 <InlineMath math={"e"}/> 좌표로 옮기며, 그것이
                        계산에 나오는 나머지 기호를 전부 결정한다.
                    </p>}
                />
            </Remark>
            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Eigenvalues, Eigenvectors, and Diagonalization</h2>}
               ko={<h2>고윳값, 고유벡터, 대각화</h2>}/>
            <T
                en={<p>
                    Example 2.49 showed that changing the basis changes the matrix. The obvious question is
                    how simple you can make it, and the answer, when it exists, is a diagonal matrix. The
                    basis that achieves it is made of eigenvectors.
                </p>}
                ko={<p>
                    Example 2.49는 기저를 바꾸면 행렬이 바뀐다는 것을 보였다. 그러면 얼마나 단순하게 만들 수
                    있느냐가 자연스러운 질문이고, 답은 그것이 가능할 때 대각 행렬이다. 그렇게 만들어 주는
                    기저가 고유벡터로 이루어진 기저다.
                </p>}
            />
            <Definition n="2.50" title={t("Eigenvalue and eigenvector", "고윳값과 고유벡터")}>
                <T
                    en={<p>
                        Let <InlineMath math={"A"}/> be <InlineMath math={"n \\times n"}/> with complex
                        coefficients. A scalar <InlineMath math={"\\lambda \\in \\mathbb{C}"}/> is an{" "}
                        <strong>eigenvalue</strong> of <InlineMath math={"A"}/> if there is a nonzero{" "}
                        <InlineMath math={"v \\in \\mathbb{C}^n"}/> with{" "}
                        <InlineMath math={"Av = \\lambda v"}/>, and any such{" "}
                        <InlineMath math={"v"}/> is an <strong>eigenvector</strong> for{" "}
                        <InlineMath math={"\\lambda"}/>. Finding eigenvalues means asking when a nonzero{" "}
                        <InlineMath math={"v"}/> exists at all:
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>를 복소수 계수의 <InlineMath math={"n \\times n"}/> 행렬이라
                        하자. <InlineMath math={"Av = \\lambda v"}/>인 0이 아닌{" "}
                        <InlineMath math={"v \\in \\mathbb{C}^n"}/>이 존재하면 스칼라{" "}
                        <InlineMath math={"\\lambda \\in \\mathbb{C}"}/>를 <InlineMath math={"A"}/>의{" "}
                        <strong>고윳값</strong>이라 하고, 그런 <InlineMath math={"v"}/>를{" "}
                        <InlineMath math={"\\lambda"}/>에 딸린 <strong>고유벡터</strong>라 한다. 고윳값을
                        찾는 일은 애초에 0이 아닌 <InlineMath math={"v"}/>가 언제 존재하는지를 묻는 일이다.
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
                        <InlineMath math={"A(\\vartheta v) = \\lambda(\\vartheta v)"}/> for every{" "}
                        <InlineMath math={"\\vartheta \\neq 0"}/>. What is unique is the direction, or more
                        precisely the subspace <InlineMath math={"\\operatorname{null}(A - \\lambda I)"}/>.
                    </p>}
                    ko={<p>
                        고유벡터는 결코 유일하지 않다. <InlineMath math={"Av = \\lambda v"}/>이면 모든{" "}
                        <InlineMath math={"\\vartheta \\neq 0"}/>에 대해{" "}
                        <InlineMath math={"A(\\vartheta v) = \\lambda(\\vartheta v)"}/>이기 때문이다. 유일한
                        것은 방향, 더 정확히는 부분 공간{" "}
                        <InlineMath math={"\\operatorname{null}(A - \\lambda I)"}/>이다.
                    </p>}
                />
            </Definition>
            <Example n="2.51" title={t("A real matrix with no real eigen-direction",
                "실수 고유 방향이 없는 실행렬")}>
                <BlockMath math={"A = \\begin{bmatrix} 0 & 1 \\\\ -1 & 0 \\end{bmatrix} \\implies \\det(\\lambda I - A) = \\lambda^2 + 1 = 0 \\implies \\lambda_1 = j, \\; \\lambda_2 = -j"}/>
                <Terms items={[
                    ["A", <T en={<>rotation by 90 degrees, which maps no real direction to a multiple of itself</>}
                            ko={<>90도 회전. 어떤 실수 방향도 자기 자신의 배수로 보내지 않는다</>}/>],
                    ["\\lambda^2 + 1", <T en={<>the characteristic polynomial, whose roots are not real</>}
                                         ko={<>특성 다항식. 근이 실수가 아니다</>}/>],
                    ["j", <T en={<>the imaginary unit, <InlineMath math={"j^2 = -1"}/></>}
                            ko={<>허수 단위. <InlineMath math={"j^2 = -1"}/>이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Solving <InlineMath math={"(A - \\lambda_i I) v^i = 0"}/> gives{" "}
                        <InlineMath math={"v^1 = (1, j)^\\top"}/> and{" "}
                        <InlineMath math={"v^2 = (1, -j)^\\top"}/>. Both the eigenvalues and the eigenvectors
                        come in complex conjugate pairs, which is why Definition 2.50 works over{" "}
                        <InlineMath math={"\\mathbb{C}"}/> even when <InlineMath math={"A"}/> is real.
                    </p>}
                    ko={<p>
                        <InlineMath math={"(A - \\lambda_i I) v^i = 0"}/>을 풀면{" "}
                        <InlineMath math={"v^1 = (1, j)^\\top"}/>,{" "}
                        <InlineMath math={"v^2 = (1, -j)^\\top"}/>이다. 고윳값도 고유벡터도 켤레 쌍으로
                        나오고, <InlineMath math={"A"}/>가 실행렬이어도 Definition 2.50이{" "}
                        <InlineMath math={"\\mathbb{C}"}/> 위에서 정의된 이유가 이것이다.
                    </p>}
                />
            </Example>
            <CanvasFigure
                label={t("Sweep the circle: the angles where Av lies on top of v are the eigen-directions, and the stretch there is λ",
                    "원을 한 바퀴 돌려 보자. Av가 v 위에 포개지는 각이 고유 방향이고, 그때의 배율이 λ다")}
                bodyClassName="w-[min(92vw,900px)]"
                modal={<EigenvectorHunt height={430}/>}>
                <EigenvectorHunt/>
            </CanvasFigure>
            <Remark title={t("What the figure cannot show", "그림이 보여 줄 수 없는 것")}>
                <T
                    en={<p>
                        The sweep only visits real directions, so the rotation preset finds nothing. That is
                        the honest picture of Example 2.51: the eigenvectors exist, but they live in{" "}
                        <InlineMath math={"\\mathbb{C}^2"}/> and no arrow in the real plane points along
                        them.
                    </p>}
                    ko={<p>
                        한 바퀴 도는 동안 훑는 것은 실수 방향뿐이라 회전 preset에서는 아무것도 잡히지 않는다.
                        그것이 Example 2.51의 정직한 그림이다. 고유벡터는 존재하지만{" "}
                        <InlineMath math={"\\mathbb{C}^2"}/> 안에 살고, 실평면의 어떤 화살표도 그 방향을
                        가리키지 않는다.
                    </p>}
                />
            </Remark>
            <Definition n="2.52" title={t("Characteristic polynomial and multiplicities",
                "특성 다항식과 중복도")}>
                <BlockMath math={"\\Delta(\\lambda) := \\det(\\lambda I - A) = (\\lambda - \\lambda_1)^{m_1} (\\lambda - \\lambda_2)^{m_2} \\cdots (\\lambda - \\lambda_p)^{m_p}, \\qquad \\gamma_i := \\dim \\operatorname{null}(A - \\lambda_i I)"}/>
                <Terms items={[
                    ["\\Delta(\\lambda)", <T en={<>the characteristic polynomial; <InlineMath math={"\\Delta(\\lambda) = 0"}/> is the characteristic equation</>}
                                            ko={<>특성 다항식. <InlineMath math={"\\Delta(\\lambda) = 0"}/>이 특성 방정식이다</>}/>],
                    ["\\lambda_i", <T en={<>the <InlineMath math={"p"}/> distinct roots, guaranteed to exist in <InlineMath math={"\\mathbb{C}"}/> by the fundamental theorem of algebra</>}
                                     ko={<>서로 다른 근 <InlineMath math={"p"}/>개. 대수학의 기본 정리가 <InlineMath math={"\\mathbb{C}"}/> 안에서의 존재를 보장한다</>}/>],
                    ["m_i", <T en={<>the algebraic multiplicity of <InlineMath math={"\\lambda_i"}/>, with <InlineMath math={"m_1 + \\cdots + m_p = n"}/></>}
                              ko={<><InlineMath math={"\\lambda_i"}/>의 대수적 중복도. <InlineMath math={"m_1 + \\cdots + m_p = n"}/>이다</>}/>],
                    ["\\gamma_i", <T en={<>the geometric multiplicity: how many independent eigenvectors <InlineMath math={"\\lambda_i"}/> actually supplies</>}
                                    ko={<>기하적 중복도. <InlineMath math={"\\lambda_i"}/>가 실제로 내놓는 독립인 고유벡터의 개수다</>}/>],
                    ["\\operatorname{null}(A - \\lambda_i I)", <T en={<>the null space, a subspace of <InlineMath math={"\\mathbb{C}^n"}/>, whose nonzero elements are the eigenvectors</>}
                                                                ko={<>null space. <InlineMath math={"\\mathbb{C}^n"}/>의 부분 공간이고 그 안의 0이 아닌 원소가 고유벡터다</>}/>],
                ]}/>
            </Definition>
            <Theorem n="2.53" title={t("Distinct eigenvalues give independent eigenvectors",
                "고윳값이 서로 다르면 고유벡터는 독립이다")}>
                <T
                    en={<p>
                        Let <InlineMath math={"A"}/> be <InlineMath math={"n \\times n"}/> over{" "}
                        <InlineMath math={"\\mathbb{R}"}/> or <InlineMath math={"\\mathbb{C}"}/>. If the
                        eigenvalues <InlineMath math={"\\{\\lambda_1, \\ldots, \\lambda_n\\}"}/> are distinct,
                        then eigenvectors <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> for them are linearly
                        independent in <InlineMath math={"(\\mathbb{C}^n, \\mathbb{C})"}/>, and hence a basis
                        by Theorem 2.31.
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>를 <InlineMath math={"\\mathbb{R}"}/> 또는{" "}
                        <InlineMath math={"\\mathbb{C}"}/> 위의 <InlineMath math={"n \\times n"}/> 행렬이라
                        하자. 고윳값 <InlineMath math={"\\{\\lambda_1, \\ldots, \\lambda_n\\}"}/>이 서로 다르면
                        그에 딸린 고유벡터 <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>은{" "}
                        <InlineMath math={"(\\mathbb{C}^n, \\mathbb{C})"}/>에서 선형 독립이고, Theorem 2.31에
                        의해 기저가 된다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            We prove the contrapositive: if{" "}
                            <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> is dependent, some eigenvalue
                            repeats. Dependence supplies coefficients, not all zero, and after relabeling we
                            may assume <InlineMath math={"\\vartheta_1 \\neq 0"}/>:
                        </p>}
                        ko={<p>
                            대우를 증명한다. <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>이 종속이면 고윳값
                            중에 겹치는 것이 있다는 쪽이다. 종속이면 전부 0은 아닌 계수가 나오고, 번호를 다시
                            붙여 <InlineMath math={"\\vartheta_1 \\neq 0"}/>이라 두어도 된다.
                        </p>}
                    />
                    <BlockMath math={"\\vartheta_1 v^1 + \\vartheta_2 v^2 + \\cdots + \\vartheta_n v^n = 0"}/>
                    <Terms items={[
                        ["\\vartheta_i", <T en={<>the coefficients supplied by dependence, not all zero</>}
                                           ko={<>종속이라는 사실이 제공하는 계수. 전부 0은 아니다</>}/>],
                        ["\\vartheta_1 \\neq 0", <T en={<>arranged by reordering the eigenvalue and eigenvector pairs, which costs nothing</>}
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
                        ["\\lambda_i - \\lambda_j", <T en={<>the resulting scale factor, zero exactly when <InlineMath math={"i = j"}/> or the eigenvalues coincide</>}
                                                      ko={<>그 결과로 붙는 배율. <InlineMath math={"i = j"}/>이거나 고윳값이 겹칠 때만 0이 된다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Apply the whole product{" "}
                            <InlineMath math={"(A - \\lambda_2 I)(A - \\lambda_3 I)\\cdots(A - \\lambda_n I)"}/>{" "}
                            to the dependence relation. Every term with{" "}
                            <InlineMath math={"i \\ge 2"}/> dies, because its own factor{" "}
                            <InlineMath math={"(\\lambda_i - \\lambda_i)"}/> appears in the product:
                        </p>}
                        ko={<p>
                            종속 관계식 전체에{" "}
                            <InlineMath math={"(A - \\lambda_2 I)(A - \\lambda_3 I)\\cdots(A - \\lambda_n I)"}/>를
                            적용한다. <InlineMath math={"i \\ge 2"}/>인 항은 곱 안에 자기 인수{" "}
                            <InlineMath math={"(\\lambda_i - \\lambda_i)"}/>가 들어 있으므로 전부 죽는다.
                        </p>}
                    />
                    <BlockMath math={"0 = \\prod_{j=2}^{n}(A - \\lambda_j I) \\Big(\\sum_{i=1}^{n} \\vartheta_i v^i\\Big) = \\vartheta_1 (\\lambda_1 - \\lambda_2)(\\lambda_1 - \\lambda_3)\\cdots(\\lambda_1 - \\lambda_n) v^1"}/>
                    <Terms items={[
                        ["\\prod_{j=2}^n (A - \\lambda_j I)", <T en={<>the product of the <InlineMath math={"n-1"}/> factors, applied to both sides of a relation that already equals zero</>}
                                                                ko={<>인수 <InlineMath math={"n-1"}/>개의 곱. 이미 0인 관계식의 양변에 적용한다</>}/>],
                        ["\\vartheta_1", <T en={<>nonzero by the relabeling</>} ko={<>번호를 다시 붙여 0이 아니게 만든 계수</>}/>],
                        ["v^1", <T en={<>nonzero by the definition of an eigenvector</>}
                                  ko={<>고유벡터의 정의에 의해 0이 아닌 벡터</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            A product of scalars times a nonzero vector is zero only if the scalar part is
                            zero. Since <InlineMath math={"\\vartheta_1 \\neq 0"}/> and{" "}
                            <InlineMath math={"v^1 \\neq 0"}/>, some factor{" "}
                            <InlineMath math={"(\\lambda_1 - \\lambda_k)"}/> with{" "}
                            <InlineMath math={"k \\ge 2"}/> must vanish, that is,{" "}
                            <InlineMath math={"\\lambda_1 = \\lambda_k"}/>. The eigenvalues are not distinct,
                            which is the contrapositive we wanted.
                        </p>}
                        ko={<p>
                            스칼라들의 곱에 0이 아닌 벡터를 곱해 0이 되려면 스칼라 쪽이 0이어야 한다.{" "}
                            <InlineMath math={"\\vartheta_1 \\neq 0"}/>이고{" "}
                            <InlineMath math={"v^1 \\neq 0"}/>이므로 <InlineMath math={"k \\ge 2"}/>인 어떤{" "}
                            <InlineMath math={"(\\lambda_1 - \\lambda_k)"}/>가 0이어야 하고, 곧{" "}
                            <InlineMath math={"\\lambda_1 = \\lambda_k"}/>다. 고윳값이 서로 다르지 않다는
                            뜻이고, 그것이 우리가 노린 대우다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Definition n="2.55" title={t("Similar matrices", "닮은 행렬")}>
                <T
                    en={<p>
                        Two <InlineMath math={"n \\times n"}/> matrices{" "}
                        <InlineMath math={"A"}/> and <InlineMath math={"B"}/> are <strong>similar</strong> if
                        there is an invertible <InlineMath math={"P"}/> with{" "}
                        <InlineMath math={"B = P A P^{-1}"}/>. By Example 2.49 that is the same as saying{" "}
                        <InlineMath math={"A"}/> and <InlineMath math={"B"}/> represent the same operator in
                        two bases.
                    </p>}
                    ko={<p>
                        <InlineMath math={"n \\times n"}/> 행렬 <InlineMath math={"A"}/>와{" "}
                        <InlineMath math={"B"}/>에 대해 <InlineMath math={"B = P A P^{-1}"}/>인 가역 행렬{" "}
                        <InlineMath math={"P"}/>가 있으면 둘이 <strong>닮았다</strong>고 한다. Example
                        2.49에 비추어 보면 같은 연산자를 두 기저로 적은 것이 <InlineMath math={"A"}/>와{" "}
                        <InlineMath math={"B"}/>라는 말과 같다.
                    </p>}
                />
            </Definition>
            <Definition n="2.56" title={t("A full set of eigenvectors", "고유벡터가 기저를 이루는 경우")}>
                <T
                    en={<p>
                        An <InlineMath math={"n \\times n"}/> matrix <InlineMath math={"A"}/> has a{" "}
                        <strong>full set of eigenvectors</strong> if there is a basis{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/> of{" "}
                        <InlineMath math={"(\\mathbb{C}^n, \\mathbb{C})"}/> with{" "}
                        <InlineMath math={"Av^i = \\lambda_i v^i"}/> for{" "}
                        <InlineMath math={"1 \\le i \\le n"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"1 \\le i \\le n"}/>에 대해{" "}
                        <InlineMath math={"Av^i = \\lambda_i v^i"}/>인{" "}
                        <InlineMath math={"(\\mathbb{C}^n, \\mathbb{C})"}/>의 기저{" "}
                        <InlineMath math={"\\{v^1, \\ldots, v^n\\}"}/>이 존재하면{" "}
                        <InlineMath math={"n \\times n"}/> 행렬 <InlineMath math={"A"}/>가{" "}
                        <strong>고유벡터를 온전히 갖췄다</strong>고 한다.
                    </p>}
                />
            </Definition>
            <Theorem n="2.57" title={t("Diagonalizable if and only if a full set exists",
                "대각화 가능은 고유벡터를 온전히 갖춘 것과 동치다")}>
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
                            Now <InlineMath math={"M\\vartheta = \\vartheta_1 v^1 + \\cdots + \\vartheta_n v^n"}/>,
                            so <InlineMath math={"M\\vartheta = 0"}/> forces{" "}
                            <InlineMath math={"\\vartheta = 0"}/> exactly when the columns are independent.
                            That is the case here, since they form a basis, so{" "}
                            <InlineMath math={"M"}/> is invertible and
                        </p>}
                        ko={<p>
                            한편 <InlineMath math={"M\\vartheta = \\vartheta_1 v^1 + \\cdots + \\vartheta_n v^n"}/>이므로{" "}
                            <InlineMath math={"M\\vartheta = 0"}/>이 <InlineMath math={"\\vartheta = 0"}/>을
                            강제하는 것은 열이 독립일 때뿐이다. 지금은 열이 기저이므로 그러하고, 따라서{" "}
                            <InlineMath math={"M"}/>은 가역이다.
                        </p>}
                    />
                    <BlockMath math={"A = M \\Lambda M^{-1}, \\qquad \\Lambda = M^{-1} A M"}/>
                    <Terms items={[
                        ["M^{-1}", <T en={<>the inverse, available because the eigenvectors are a basis</>}
                                     ko={<>역행렬. 고유벡터가 기저이므로 존재한다</>}/>],
                        ["\\Lambda = M^{-1}AM", <T en={<>the statement that <InlineMath math={"A"}/> is similar to a diagonal matrix, with <InlineMath math={"M"}/> as the similarity matrix</>}
                                                  ko={<><InlineMath math={"A"}/>가 대각 행렬과 닮았다는 진술. <InlineMath math={"M"}/>이 닮음 행렬이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            For the converse, suppose <InlineMath math={"A = M \\Lambda M^{-1}"}/> with{" "}
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
                            고유벡터라는 말이 된다. 가역 행렬의 열은 독립이므로 기저를 이루고, 고유벡터가 온전히
                            갖춰진다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Remark title={t("Distinct eigenvalues are sufficient, not necessary",
                "고윳값이 다른 것은 충분조건이지 필요조건이 아니다")}>
                <T
                    en={<p>
                        Theorem 2.53 plus Theorem 2.57 give the usable rule: <em>distinct eigenvalues imply
                        diagonalizable</em>. The converse fails, as{" "}
                        <InlineMath math={"I"}/> shows. What actually decides the question is whether{" "}
                        <InlineMath math={"\\gamma_i = m_i"}/> for every eigenvalue. The shear{" "}
                        <InlineMath math={"\\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\end{bmatrix}"}/> has{" "}
                        <InlineMath math={"m_1 = 2"}/> and <InlineMath math={"\\gamma_1 = 1"}/>, so it is not
                        diagonalizable. Try both in the figure above.
                    </p>}
                    ko={<p>
                        Theorem 2.53과 Theorem 2.57을 합치면 실전에서 쓰는 규칙이 나온다. <em>고윳값이 서로
                        다르면 대각화 가능</em>이다. 역은 성립하지 않으며 <InlineMath math={"I"}/>가 그
                        반례다. 실제로 판정을 짓는 것은 모든 고윳값에서{" "}
                        <InlineMath math={"\\gamma_i = m_i"}/>인가이다. 전단 행렬{" "}
                        <InlineMath math={"\\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\end{bmatrix}"}/>은{" "}
                        <InlineMath math={"m_1 = 2"}/>, <InlineMath math={"\\gamma_1 = 1"}/>이라 대각화되지
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
            <Proposition n="2.58" title={t("Similarity preserves the spectrum", "닮음은 스펙트럼을 보존한다")}>
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
            </Proposition>
            <Definition n="2.59" title={t("Rank", "rank")}>
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
            </Definition>
            <Proposition n="2.60" title={t("Rank and non-zero eigenvalues", "rank와 0이 아닌 고윳값")}>
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
                <BlockMath math={"M = \\begin{bmatrix} 0 & 1 \\\\ 0 & 0 \\end{bmatrix}: \\quad \\operatorname{rank}(M) = 1, \\quad \\lambda_1 = \\lambda_2 = 0"}/>
                <Terms items={[
                    ["M", <T en={<>a matrix with no full set of eigenvectors: <InlineMath math={"\\gamma_1 = 1 < 2 = m_1"}/></>}
                            ko={<>고유벡터를 온전히 갖추지 못한 행렬. <InlineMath math={"\\gamma_1 = 1 < 2 = m_1"}/>이다</>}/>],
                    ["\\operatorname{rank}(M)", <T en={<>one, because the second column is independent of the first, which is zero</>}
                                                  ko={<>1이다. 첫 열이 0이고 둘째 열은 그것과 독립이기 때문이다</>}/>],
                    ["\\lambda_i", <T en={<>both zero, so the count of non-zero eigenvalues is 0 while the rank is 1</>}
                                     ko={<>둘 다 0이다. 그래서 0이 아닌 고윳값의 개수는 0인데 rank는 1이다</>}/>],
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
            <Proposition n="2.61" title={t("Rank survives multiplication by the transpose",
                "전치를 곱해도 rank는 살아남는다")}>
                <BlockMath math={"\\operatorname{rank}(A) = \\operatorname{rank}(A^\\top A) = \\operatorname{rank}(A A^\\top) = \\operatorname{rank}(A^\\top)"}/>
                <Terms items={[
                    ["A", <T en={<>a real <InlineMath math={"n \\times m"}/> matrix</>}
                            ko={<>실수 <InlineMath math={"n \\times m"}/> 행렬</>}/>],
                    ["A^\\top A", <T en={<>the <InlineMath math={"m \\times m"}/> matrix appearing in the normal equations of Chapter 3</>}
                                    ko={<>3장의 normal equation에 나타나는 <InlineMath math={"m \\times m"}/> 행렬</>}/>],
                    ["A A^\\top", <T en={<>the <InlineMath math={"n \\times n"}/> counterpart, a different size with the same rank</>}
                                    ko={<>크기가 다른 <InlineMath math={"n \\times n"}/> 짝. rank는 같다</>}/>],
                ]}/>
                <T
                    en={<p>
                        This is why least squares can ask for{" "}
                        <InlineMath math={"A^\\top A"}/> to be invertible and get an answer in terms of{" "}
                        <InlineMath math={"A"}/> alone: <InlineMath math={"A^\\top A"}/> is invertible
                        exactly when <InlineMath math={"A"}/> has independent columns.
                    </p>}
                    ko={<p>
                        최소제곱이 <InlineMath math={"A^\\top A"}/>의 가역성을 요구하면서 답을{" "}
                        <InlineMath math={"A"}/>만으로 말할 수 있는 이유가 이것이다.{" "}
                        <InlineMath math={"A^\\top A"}/>가 가역인 것은 <InlineMath math={"A"}/>의 열이
                        독립일 때뿐이다.
                    </p>}
                />
            </Proposition>
            <Corollary n="2.62" title={t("Rows and columns agree", "행과 열은 일치한다")}>
                <T
                    en={<p>
                        The number of independent rows equals the number of independent columns, and{" "}
                        <InlineMath math={"\\operatorname{rank}(A) \\le \\min(n, m)"}/>. A matrix with more
                        columns than rows always has dependent columns, which is Definition 2.26 applied to{" "}
                        <InlineMath math={"\\mathbb{F}^n"}/>.
                    </p>}
                    ko={<p>
                        독립인 행의 개수와 독립인 열의 개수가 같고{" "}
                        <InlineMath math={"\\operatorname{rank}(A) \\le \\min(n, m)"}/>이다. 행보다 열이 많은
                        행렬은 언제나 열이 종속인데, 이는 <InlineMath math={"\\mathbb{F}^n"}/>에 Definition
                        2.26을 적용한 것이다.
                    </p>}
                />
            </Corollary>
            <Lemma n="2.63" title={t("Transferring eigenvectors between AᵀA and AAᵀ",
                "AᵀA와 AAᵀ 사이의 고유벡터 옮기기")}>
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
                        <InlineMath math={"A^\\top A"}/>의 고윳값이면, <InlineMath math={"\\lambda"}/>는
                        고유벡터 <InlineMath math={"Av"}/>를 갖는 <InlineMath math={"A A^\\top"}/>의
                        고윳값이다. 반대 방향은 <InlineMath math={"A^\\top v"}/>로 대칭이다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            Assume <InlineMath math={"(A^\\top A)v = \\lambda v"}/> with{" "}
                            <InlineMath math={"\\lambda \\neq 0"}/> and{" "}
                            <InlineMath math={"v \\neq 0"}/>. First, <InlineMath math={"Av \\neq 0"}/>:
                            otherwise <InlineMath math={"\\lambda v = A^\\top (Av) = 0"}/>, forcing{" "}
                            <InlineMath math={"\\lambda = 0"}/> or <InlineMath math={"v = 0"}/>. Then simply
                            regroup the product:
                        </p>}
                        ko={<p>
                            <InlineMath math={"\\lambda \\neq 0"}/>,{" "}
                            <InlineMath math={"v \\neq 0"}/>이고{" "}
                            <InlineMath math={"(A^\\top A)v = \\lambda v"}/>라 하자. 먼저{" "}
                            <InlineMath math={"Av \\neq 0"}/>이다. 아니라면{" "}
                            <InlineMath math={"\\lambda v = A^\\top (Av) = 0"}/>이 되어{" "}
                            <InlineMath math={"\\lambda = 0"}/>이거나 <InlineMath math={"v = 0"}/>이어야
                            한다. 그다음은 곱을 다시 묶기만 하면 된다.
                        </p>}
                    />
                    <BlockMath math={"(A A^\\top)(Av) = A (A^\\top A) v = A(\\lambda v) = \\lambda (Av)"}/>
                    <Terms items={[
                        ["(A A^\\top)(Av)", <T en={<>the claim being checked: <InlineMath math={"Av"}/> is an eigenvector of <InlineMath math={"AA^\\top"}/></>}
                                              ko={<>확인 중인 주장. <InlineMath math={"Av"}/>가 <InlineMath math={"AA^\\top"}/>의 고유벡터라는 것</>}/>],
                        ["A(A^\\top A)v", <T en={<>the same product, regrouped by associativity: no new fact is used</>}
                                            ko={<>결합법칙으로 다시 묶은 같은 곱. 새로운 사실은 하나도 쓰지 않았다</>}/>],
                        ["\\lambda(Av)", <T en={<>the definition of <InlineMath math={"Av"}/> being an eigenvector for <InlineMath math={"\\lambda"}/>, and <InlineMath math={"Av \\neq 0"}/> was checked first</>}
                                           ko={<><InlineMath math={"Av"}/>가 <InlineMath math={"\\lambda"}/>의 고유벡터라는 정의 그 자체. <InlineMath math={"Av \\neq 0"}/>은 먼저 확인해 두었다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            So <InlineMath math={"A A^\\top"}/> and <InlineMath math={"A^\\top A"}/> have the
                            same non-zero eigenvalues. Being of different sizes, they can differ only in how
                            many zero eigenvalues they carry. Chapter 4 builds the SVD on exactly this.
                        </p>}
                        ko={<p>
                            따라서 <InlineMath math={"A A^\\top"}/>과 <InlineMath math={"A^\\top A"}/>는 0이
                            아닌 고윳값이 같다. 크기가 다르므로 차이가 날 수 있는 것은 0인 고윳값의 개수뿐이다.
                            4장의 SVD가 바로 이 위에 세워진다.
                        </p>}
                    />
                </Proof>
            </Lemma>
            <Definition n="2.65" title={t("Trace", "trace")}>
                <BlockMath math={"\\operatorname{tr}(C) := \\sum_{i=1}^{n} C_{ii}, \\qquad \\operatorname{tr}(A \\cdot B) = \\operatorname{tr}(B \\cdot A)"}/>
                <Terms items={[
                    ["C", <T en={<>an <InlineMath math={"n \\times n"}/> matrix</>}
                            ko={<><InlineMath math={"n \\times n"}/> 행렬</>}/>],
                    ["C_{ii}", <T en={<>its diagonal entries, the only ones the trace looks at</>}
                                 ko={<>대각 성분. trace가 보는 것은 이것뿐이다</>}/>],
                    ["A, B", <T en={<>sizes <InlineMath math={"n \\times m"}/> and <InlineMath math={"m \\times n"}/>, so both products are square but of different sizes</>}
                               ko={<>크기가 각각 <InlineMath math={"n \\times m"}/>, <InlineMath math={"m \\times n"}/>이라 두 곱 모두 정사각이지만 크기는 다르다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The identity on the right is Exercise 2.66 in the notes, and it falls out of writing
                        both sides as the same double sum{" "}
                        <InlineMath math={"\\sum_i \\sum_j A_{ij} B_{ji}"}/>. It is used constantly in
                        Chapter 5, where the quantity being minimized is the trace of a covariance matrix.
                    </p>}
                    ko={<p>
                        오른쪽 등식은 원 교재의 Exercise 2.66이고, 양변을 같은 이중 합{" "}
                        <InlineMath math={"\\sum_i \\sum_j A_{ij} B_{ji}"}/>로 적으면 바로 떨어진다. 5장에서는
                        최소화 대상이 공분산 행렬의 trace라서 이 등식을 쉼 없이 쓴다.
                    </p>}
                />
            </Definition>
            <Proposition n="2.67" title={t("Matrix multiplication as a sum of outer products",
                "외적의 합으로 보는 행렬 곱")}>
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
                        The usual rule builds the product entry by entry, as rows of{" "}
                        <InlineMath math={"A"}/> times columns of <InlineMath math={"B"}/>. Pulling the sum
                        out of the matrix instead gives the formula above, and it is worth carrying because
                        it exhibits a product as a sum of rank-one pieces, which is what the SVD in Chapter 4
                        and the rank-one measurement updates in Chapter 5 are made of.
                    </p>}
                    ko={<p>
                        보통은 <InlineMath math={"A"}/>의 행과 <InlineMath math={"B"}/>의 열을 곱해 성분마다
                        곱을 만든다. 대신 합을 행렬 밖으로 빼내면 위 식이 나온다. 이 형태를 들고 다닐 값어치가
                        있는 이유는 곱을 rank 1짜리 조각들의 합으로 드러내기 때문이다. 4장의 SVD와 5장의 rank
                        1 측정 갱신이 바로 그 조각들로 되어 있다.
                    </p>}
                />
            </Proposition>
            <Proposition n="2.68" title={t("Matrix inversion lemma", "행렬 역행렬 보조정리")}>
                <T
                    en={<p>
                        Suppose <InlineMath math={"A"}/>, <InlineMath math={"C"}/>, and{" "}
                        <InlineMath math={"(C^{-1} + D A^{-1} B)"}/> are square and invertible, with the
                        sizes chosen so the products below make sense. Then{" "}
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
                    <BlockMath math={"A = \\operatorname{diag}(1, 0.5, 0.5, 1, 0.5), \\quad B = \\begin{bmatrix} 1 \\\\ 0 \\\\ 2 \\\\ 0 \\\\ 3 \\end{bmatrix}, \\quad C = 0.2, \\quad D = B^\\top"}/>
                    <Terms items={[
                        ["A", <T en={<>diagonal, so <InlineMath math={"A^{-1} = \\operatorname{diag}(1, 2, 2, 1, 2)"}/> by inspection</>}
                                ko={<>대각 행렬이므로 <InlineMath math={"A^{-1} = \\operatorname{diag}(1, 2, 2, 1, 2)"}/>가 눈으로 읽힌다</>}/>],
                        ["B", <T en={<>a single column, so <InlineMath math={"BCD"}/> is a rank-one 5 × 5 matrix</>}
                                ko={<>열 하나. 그래서 <InlineMath math={"BCD"}/>는 rank 1인 5 × 5 행렬이다</>}/>],
                        ["C", <T en={<>a 1 × 1 matrix, so <InlineMath math={"C^{-1} = 5"}/></>}
                                ko={<>1 × 1 행렬. <InlineMath math={"C^{-1} = 5"}/>다</>}/>],
                    ]}/>
                    <T en={<p>Everything the formula needs is a scalar:</p>}
                       ko={<p>이 식이 필요로 하는 것은 전부 스칼라다.</p>}/>
                    <BlockMath math={"A^{-1}B = \\begin{bmatrix} 1 & 0 & 4 & 0 & 6 \\end{bmatrix}^\\top, \\quad D A^{-1} B = 27, \\quad (C^{-1} + D A^{-1} B)^{-1} = \\tfrac{1}{32}"}/>
                    <Terms items={[
                        ["A^{-1}B", <T en={<>a single column, computed by scaling the entries of <InlineMath math={"B"}/></>}
                                      ko={<>열 하나. <InlineMath math={"B"}/>의 성분에 배율을 곱해 얻는다</>}/>],
                        ["DA^{-1}B", <T en={<>the scalar <InlineMath math={"B^\\top A^{-1} B = 1 + 8 + 18"}/></>}
                                       ko={<>스칼라 <InlineMath math={"B^\\top A^{-1} B = 1 + 8 + 18"}/></>}/>],
                        ["\\tfrac{1}{32}", <T en={<>the reciprocal of <InlineMath math={"5 + 27"}/>: the only division in the whole computation</>}
                                             ko={<><InlineMath math={"5 + 27"}/>의 역수. 이 계산 전체에서 나눗셈은 이것 하나다</>}/>],
                    ]}/>
                    <T en={<p>Assembling the correction, which is one outer product,</p>}
                       ko={<p>보정 항은 외적 하나이고, 그것을 조립하면</p>}/>
                    <BlockMath math={"(A + BCD)^{-1} = \\operatorname{diag}(1, 2, 2, 1, 2) - \\tfrac{1}{32}\\begin{bmatrix} 1 \\\\ 0 \\\\ 4 \\\\ 0 \\\\ 6 \\end{bmatrix}\\begin{bmatrix} 1 & 0 & 4 & 0 & 6 \\end{bmatrix} = \\begin{bmatrix} \\tfrac{31}{32} & 0 & -\\tfrac{1}{8} & 0 & -\\tfrac{3}{16} \\\\ 0 & 2 & 0 & 0 & 0 \\\\ -\\tfrac{1}{8} & 0 & \\tfrac{3}{2} & 0 & -\\tfrac{3}{4} \\\\ 0 & 0 & 0 & 1 & 0 \\\\ -\\tfrac{3}{16} & 0 & -\\tfrac{3}{4} & 0 & \\tfrac{7}{8} \\end{bmatrix}"}/>
                    <Terms items={[
                        ["\\operatorname{diag}(1,2,2,1,2)", <T en={<><InlineMath math={"A^{-1}"}/>, the part that was free</>}
                                                              ko={<><InlineMath math={"A^{-1}"}/>. 거저 얻은 부분이다</>}/>],
                        ["\\tfrac{1}{32} u u^\\top", <T en={<>the rank-one correction, with <InlineMath math={"u = A^{-1}B"}/></>}
                                                       ko={<>rank 1짜리 보정 항. <InlineMath math={"u = A^{-1}B"}/>이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            A 5 × 5 inverse computed with one scalar division. In Chapter 5 the same move
                            turns the covariance update of the Kalman filter, nominally an inverse the size
                            of the state, into an inverse the size of the measurement.
                        </p>}
                        ko={<p>
                            5 × 5 역행렬을 스칼라 나눗셈 한 번으로 얻었다. 5장에서는 같은 수가 칼만 필터의
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
                        <InlineMath math={"\\vartheta^i_{k+1} = \\lambda_i \\vartheta^i_k"}/>. Every claim
                        about stability is a claim about <InlineMath math={"|\\lambda_i|"}/>, and Theorem
                        2.57 is what licenses the decoupling.
                    </li>
                    <li>
                        <strong>Vectors that are not columns.</strong> A trajectory, a spline, a
                        cost-to-go function, and a covariance matrix are all vectors in the sense of
                        Definition 2.2. That is what lets Chapters 6 and 7 talk about convergence of
                        sequences of functions with the same vocabulary used for points in{" "}
                        <InlineMath math={"\\mathbb{R}^n"}/>.
                    </li>
                    <li>
                        <strong>The inversion lemma is the Kalman filter's speed.</strong> Proposition 2.68
                        turns an inverse the size of the state into an inverse the size of the measurement.
                        For a robot with a 15-state IMU filter and a scalar range update, that is the
                        difference between a 15 × 15 inverse per sample and a division.
                    </li>
                </ul>}
                ko={<ul>
                    <li>
                        <strong>좌표계가 곧 기저다.</strong> 플래너가 내보내는 pose와 카메라 드라이버가
                        내보내는 pose는 주소가 둘인 같은 벡터이고, 둘 사이의 변환이 Theorem 2.40의 기저 변환
                        행렬이다. 부호 규약이 틀렸을 때 틀린 것은 물리가 아니라{" "}
                        <InlineMath math={"P"}/>다.
                    </li>
                    <li>
                        <strong>rank가 곧 관측 가능성이다.</strong> 캘리브레이션이나 SLAM 문제가 퇴화하는
                        것은 측정 행렬의 열이 종속일 때뿐이다. 어떤 측정도 닿지 못하는 상태 공간의 방향이
                        생겼다는 뜻이다. Proposition 2.61은 그것을{" "}
                        <InlineMath math={"A^\\top A"}/>에서 확인할 수 있다고 말하는데, 그 행렬은 문제를
                        풀려고 이미 만들어 둔 것이다.
                    </li>
                    <li>
                        <strong>고윳값이 곧 수렴 속도다.</strong> 관측기나 제어기는{" "}
                        <InlineMath math={"x_{k+1} = A x_k"}/>를 반복하는데, 고유벡터로 이루어진 기저에서는
                        그것이 서로 독립인 스칼라 점화식{" "}
                        <InlineMath math={"\\vartheta^i_{k+1} = \\lambda_i \\vartheta^i_k"}/>{" "}
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
                        얹는 로봇이라면, 표본마다 15 × 15 역행렬을 푸느냐 나눗셈 한 번을 하느냐의 차이다.
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
                    {t("an argument that ℝ over ℚ is infinite dimensional",
                        "ℚ 위의 ℝ가 무한 차원임을 보이는 논증")}
                </li>
            </ul>
        </>
    );
};

export default Chapter2;
