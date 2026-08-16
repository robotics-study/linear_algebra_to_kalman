import CanvasFigure from "../../components/CanvasFigure";
import InductionDominoes from "../../components/pages/chapter1/InductionDominoes";
import QuantifierNegator from "../../components/pages/chapter1/QuantifierNegator";
import SupInfExplorer from "../../components/pages/chapter1/SupInfExplorer";
import TruthTableExplorer from "../../components/pages/chapter1/TruthTableExplorer";
import {BlockMath, InlineMath} from "../../components/math/Tex";
import {Definition, Example, Proof, Remark, Theorem} from "../../components/math/Statement";
import Terms from "../../components/math/Terms";
import {T, useTr} from "../../libs/i18n";

const COURSE = "https://grizzle.robotics.umich.edu/education/rob501";
const NOTES_REPO = "https://github.com/michiganrobotics/rob501";
const MSU_NOTES = "https://users.math.msu.edu/users/duncan42/AxiomNotes.pdf";
const FOUR_COLOR = "https://en.wikipedia.org/wiki/Four_color_theorem";
const ALL_HORSES = "https://en.wikipedia.org/wiki/All_horses_are_the_same_color";

const Chapter1 = () => {
    const t = useTr();
    return (
        <>
            <T
                en={<p>
                    A robotics course that opens with proofs looks like a detour. It is not. Everything
                    later in these notes is stated in the language built here: a least squares solution is
                    characterized by an orthogonality condition, an estimator is called unbiased because an
                    expectation satisfies an identity, an algorithm is said to converge because a quantified
                    statement holds. If the statement is unreadable, the result is unusable.
                </p>}
                ko={<p>
                    로보틱스 과목이 증명으로 시작하면 우회로처럼 보인다. 그렇지 않다. 이 노트의 뒷부분은
                    전부 여기서 만드는 언어로 쓰인다. 최소제곱 해는 직교 조건으로 특징지어지고, 추정기가
                    unbiased라 불리는 것은 기댓값이 어떤 등식을 만족하기 때문이며, 알고리즘이 수렴한다는
                    말은 quantifier가 붙은 명제가 성립한다는 뜻이다. 명제를 읽지 못하면 결과도 쓸 수 없다.
                </p>}
            />
            <T
                en={<p>
                    The concrete goal of this chapter is to make a statement like this one readable, and
                    then negatable:
                </p>}
                ko={<p>
                    이 장의 구체적인 목표는 아래 같은 문장을 읽을 수 있게 만들고, 이어서 부정할 수 있게
                    만드는 것이다.
                </p>}
            />
            <BlockMath math={"\\forall\\, \\epsilon > 0,\\; \\exists\\, \\delta > 0 \\text{ s.t. } \\forall\\, x \\in B_\\delta(x_0),\\; \\lVert f(x) - f(x_0) \\rVert < \\epsilon"}/>
            <Terms items={[
                ["\\epsilon", <T en={<>the output tolerance we are asked to meet, chosen first by an adversary</>}
                                ko={<>지켜야 할 출력 오차 한계. 상대가 먼저 고른다</>}/>],
                ["\\delta", <T en={<>the input tolerance we get to choose in response, allowed to depend on <InlineMath math={"\\epsilon"}/></>}
                              ko={<>그에 맞춰 우리가 고르는 입력 오차 한계. <InlineMath math={"\\epsilon"}/>에 의존해도 된다</>}/>],
                ["x_0", <T en={<>the point at which the property is being asserted</>}
                          ko={<>성질을 주장하는 대상 점</>}/>],
                ["B_\\delta(x_0)", <T en={<>the ball of radius <InlineMath math={"\\delta"}/> around <InlineMath math={"x_0"}/>, that is, all <InlineMath math={"x"}/> with <InlineMath math={"\\lVert x - x_0 \\rVert < \\delta"}/></>}
                                     ko={<><InlineMath math={"x_0"}/> 둘레의 반지름 <InlineMath math={"\\delta"}/>인 공. 즉 <InlineMath math={"\\lVert x - x_0 \\rVert < \\delta"}/>인 모든 <InlineMath math={"x"}/></>}/>],
                ["f", <T en={<>the function whose behavior near <InlineMath math={"x_0"}/> is in question</>}
                        ko={<><InlineMath math={"x_0"}/> 근처에서의 거동이 문제가 되는 함수</>}/>],
                ["\\lVert \\cdot \\rVert", <T en={<>a norm, the length of a vector (Chapter 3 defines it properly)</>}
                                             ko={<>norm, 벡터의 길이. 정확한 정의는 3장에서 한다</>}/>],
            ]}/>
            <T
                en={<p>
                    That is the definition of <strong>f being continuous at <InlineMath math={"x_0"}/></strong>.
                    Notice that the order of the quantifiers carries the entire meaning: <InlineMath math={"\\epsilon"}/> is
                    named first and <InlineMath math={"\\delta"}/> second, so <InlineMath math={"\\delta"}/> may depend
                    on <InlineMath math={"\\epsilon"}/> but not the other way around. Swap the two and you have
                    defined something else entirely.
                </p>}
                ko={<p>
                    이것이 <strong><InlineMath math={"x_0"}/>에서 f가 연속</strong>이라는 정의다. 여기서 뜻을
                    통째로 지고 있는 것은 quantifier의 순서다. <InlineMath math={"\\epsilon"}/>이 먼저 나오고{" "}
                    <InlineMath math={"\\delta"}/>가 뒤에 나오므로 <InlineMath math={"\\delta"}/>는{" "}
                    <InlineMath math={"\\epsilon"}/>에 의존할 수 있지만 그 반대는 안 된다. 둘을 바꿔 쓰면 전혀
                    다른 것을 정의한 셈이 된다.
                </p>}
            />

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Mathematical Notation</h2>} ko={<h2>수학 기호</h2>}/>
            <T
                en={<p>
                    These symbols are shorthand for word phrases, nothing more. The only reason to use them
                    is that a statement three lines long in English fits on one line in symbols, and at that
                    length you can see its structure.
                </p>}
                ko={<p>
                    이 기호들은 말로 된 구절의 줄임말일 뿐이다. 쓰는 이유는 하나다. 영어로 세 줄인 문장이
                    기호로는 한 줄에 들어가고, 그 길이가 되어야 구조가 눈에 들어온다.
                </p>}
            />

            <table className="table-center">
                <thead>
                <tr>
                    <th>{t("Set", "집합")}</th>
                    <th>{t("Meaning", "뜻")}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><InlineMath math={"\\mathbb{N}"}/></td>
                    <td>{t("natural (counting) numbers 1, 2, 3, …", "자연수 1, 2, 3, …")}</td>
                </tr>
                <tr>
                    <td><InlineMath math={"\\mathbb{Z}"}/></td>
                    <td>
                        <T en={<>integers <InlineMath math={"\\ldots, -2, -1, 0, 1, 2, \\ldots"}/></>}
                           ko={<>정수 <InlineMath math={"\\ldots, -2, -1, 0, 1, 2, \\ldots"}/></>}/>
                    </td>
                </tr>
                <tr>
                    <td><InlineMath math={"\\mathbb{Q}"}/></td>
                    <td>
                        <T en={<>rationals <InlineMath math={"m/q"}/> with <InlineMath math={"m, q"}/> integers,{" "}
                            <InlineMath math={"q \\neq 0"}/>, in lowest terms</>}
                           ko={<>유리수 <InlineMath math={"m/q"}/>. <InlineMath math={"m, q"}/>는 정수이고{" "}
                               <InlineMath math={"q \\neq 0"}/>이며 기약분수로 적는다</>}/>
                    </td>
                </tr>
                <tr>
                    <td><InlineMath math={"\\mathbb{R}"}/></td>
                    <td>{t("real numbers", "실수")}</td>
                </tr>
                <tr>
                    <td><InlineMath math={"\\mathbb{C}"}/></td>
                    <td>
                        <T en={<>complex numbers <InlineMath math={"\\alpha + j\\beta"}/> with{" "}
                            <InlineMath math={"\\alpha, \\beta"}/> real and <InlineMath math={"j^2 = -1"}/></>}
                           ko={<>복소수 <InlineMath math={"\\alpha + j\\beta"}/>.{" "}
                               <InlineMath math={"\\alpha, \\beta"}/>는 실수이고 <InlineMath math={"j^2 = -1"}/></>}/>
                    </td>
                </tr>
                </tbody>
            </table>

            <table className="table-center">
                <thead>
                <tr>
                    <th>{t("Symbol", "기호")}</th>
                    <th>{t("Read as", "읽는 법")}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><InlineMath math={"\\forall"}/></td>
                    <td>{t("for every, for all, for each", "모든 ~에 대해")}</td>
                </tr>
                <tr>
                    <td><InlineMath math={"\\exists"}/></td>
                    <td>{t("there exists, for some, for at least one", "~가 존재한다, 어떤 ~가 있어서")}</td>
                </tr>
                <tr>
                    <td><InlineMath math={"\\in"}/></td>
                    <td>{t("is an element of", "~의 원소이다")}</td>
                </tr>
                <tr>
                    <td><InlineMath math={"\\lnot"}/>, <InlineMath math={"\\sim"}/></td>
                    <td>{t("logical not", "논리 부정")}</td>
                </tr>
                <tr>
                    <td><InlineMath math={"\\land"}/></td>
                    <td>{t("and: true when both sides are true", "그리고. 양쪽이 모두 참일 때 참")}</td>
                </tr>
                <tr>
                    <td><InlineMath math={"\\lor"}/></td>
                    <td>{t("or: true when at least one side is true (never exclusive here)",
                        "또는. 적어도 한쪽이 참이면 참이다. 이 과목에서 배타적 or는 쓰지 않는다")}</td>
                </tr>
                <tr>
                    <td><InlineMath math={"\\implies"}/></td>
                    <td>{t("if p is true then q is true", "p가 참이면 q도 참이다")}</td>
                </tr>
                <tr>
                    <td><InlineMath math={"\\iff"}/></td>
                    <td>{t("p is true if and only if q is true", "p는 q일 때, 그리고 오직 그때만 참이다")}</td>
                </tr>
                </tbody>
            </table>

            <T
                en={<p>
                    Two derived statements are worth naming, because beginners mix them up constantly and
                    the confusion is expensive. Given <InlineMath math={"p \\implies q"}/>:
                </p>}
                ko={<p>
                    여기서 파생되는 두 문장은 이름을 붙여 둘 값어치가 있다. 처음에는 거의 모두가 이 둘을
                    섞어 쓰고, 그 혼동의 대가가 크기 때문이다. <InlineMath math={"p \\implies q"}/>가 있을 때:
                </p>}
            />
            <BlockMath math={"\\text{contrapositive: } \\lnot q \\implies \\lnot p \\qquad\\qquad \\text{converse: } q \\implies p"}/>
            <Terms items={[
                ["p", <T en={<>the hypothesis, the statement assumed to hold</>}
                        ko={<>가정. 성립한다고 두는 명제</>}/>],
                ["q", <T en={<>the conclusion, the statement to be established</>}
                        ko={<>결론. 보여야 하는 명제</>}/>],
                ["\\lnot p", <T en={<>the negation of <InlineMath math={"p"}/>: true exactly when <InlineMath math={"p"}/> is false</>}
                               ko={<><InlineMath math={"p"}/>의 부정. <InlineMath math={"p"}/>가 거짓일 때 정확히 참이다</>}/>],
                ["\\implies", <T en={<>logical implication</>} ko={<>논리적 implication</>}/>],
            ]}/>
            <T
                en={<p>
                    The contrapositive is <em>logically equivalent</em> to the original: proving one proves
                    the other. The converse is <em>not</em>. In general{" "}
                    <InlineMath math={"(p \\implies q)"}/> does not imply <InlineMath math={"(q \\implies p)"}/>,
                    which is exactly why <InlineMath math={"p \\iff q"}/> needs its own symbol and its own
                    two-part proof.
                </p>}
                ko={<p>
                    대우는 원래 명제와 <em>논리적으로 동치</em>다. 한쪽을 증명하면 다른 쪽도 증명된다. 역은{" "}
                    <em>그렇지 않다</em>. 일반적으로 <InlineMath math={"(p \\implies q)"}/>는{" "}
                    <InlineMath math={"(q \\implies p)"}/>를 implication하지 않는다.{" "}
                    <InlineMath math={"p \\iff q"}/>에 별도의 기호와 두 갈래 증명이 필요한 이유가 바로 이것이다.
                </p>}
            />
            <Remark title={t("A warning that sounds trivial and is not",
                "사소해 보이지만 그렇지 않은 경고")}>
                <T
                    en={<p>
                        Both words start with "con-", which is no help at all. Contrapositive flips
                        <em> and</em> negates both sides. Converse only flips. Get this wrong in a proof and
                        you will have proved a different theorem than the one you were asked for.
                    </p>}
                    ko={<p>
                        영어로는 둘 다 "con-"으로 시작하는데 그게 전혀 도움이 안 된다. 대우는 양변을 뒤집고{" "}
                        <em>동시에</em> 부정한다. 역은 뒤집기만 한다. 증명에서 이걸 틀리면 요구받은 것과 다른
                        정리를 증명하게 된다.
                    </p>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Vocabulary</h2>} ko={<h2>용어</h2>}/>
            <T
                en={<p>
                    These words are not decoration. They tell a reader how much weight a statement carries
                    and what has already been established about it.
                </p>}
                ko={<p>
                    이 단어들은 장식이 아니다. 어떤 명제가 얼마나 무게를 갖는지, 그것에 대해 무엇이 이미
                    확립되었는지를 독자에게 알려 준다.
                </p>}
            />
            <table className="table-center">
                <thead>
                <tr>
                    <th>{t("Term", "용어")}</th>
                    <th>{t("Meaning", "뜻")}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{t("Definition", "Definition (정의)")}</td>
                    <td>{t("an explanation of the mathematical meaning of a word",
                        "어떤 낱말의 수학적 의미를 밝힌 것")}</td>
                </tr>
                <tr>
                    <td>{t("Theorem", "Theorem (정리)")}</td>
                    <td>{t("a statement that has been proven true", "참임이 증명된 명제")}</td>
                </tr>
                <tr>
                    <td>{t("Proposition", "Proposition (명제)")}</td>
                    <td>{t("a less important but still interesting true statement",
                        "덜 중요하지만 그래도 흥미로운 참인 명제")}</td>
                </tr>
                <tr>
                    <td>{t("Lemma", "Lemma (보조정리)")}</td>
                    <td>{t("a true statement whose job is to help prove other statements",
                        "다른 명제를 증명하는 데 쓰이는 참인 명제")}</td>
                </tr>
                <tr>
                    <td>{t("Claim", "Claim")}</td>
                    <td>{t("a true statement raised mid-proof, or used to highlight a property a reader might miss",
                        "증명 중간에 세우는 참인 명제. 독자가 놓치기 쉬운 성질을 짚을 때도 쓴다")}</td>
                </tr>
                <tr>
                    <td>{t("Corollary", "Corollary (따름정리)")}</td>
                    <td>{t("a simple deduction from a theorem or proposition",
                        "정리나 명제에서 간단히 따라 나오는 결과")}</td>
                </tr>
                <tr>
                    <td>{t("Conjecture", "Conjecture (추측)")}</td>
                    <td>{t("believed true, but not proven", "참이라고 믿지만 증명되지 않은 명제")}</td>
                </tr>
                <tr>
                    <td>{t("Axiom", "Axiom (공리)")}</td>
                    <td>{t("a bedrock assumption, taken as true without proof",
                        "증명 없이 참으로 두는 밑바닥 가정")}</td>
                </tr>
                </tbody>
            </table>
            <T
                en={<p>
                    One consequence matters for how you write proofs. Inside a proof, axioms, definitions,
                    theorems, lemmas, propositions, claims, and corollaries all have the <strong>same
                    power</strong>, because they are all true statements. The usual convention is to put the
                    most fundamental description of an idea in the definition, then provide theorems that
                    show how to check, compute, or apply it.
                </p>}
                ko={<p>
                    여기서 증명 쓰는 방식에 직접 영향을 주는 결과가 하나 나온다. 증명 안에서는 axiom,
                    definition, theorem, lemma, proposition, claim, corollary가 모두 <strong>같은 힘</strong>을
                    갖는다. 전부 참인 명제이기 때문이다. 관례상 어떤 개념의 가장 근본적인 서술을 definition에
                    두고, 그것을 확인하거나 계산하거나 적용하는 방법은 theorem으로 제시한다.
                </p>}
            />
            <Remark n="1.2" title={t("\"If\" inside a definition", "definition 안의 \"if\"")}>
                <T
                    en={<p>
                        In a definition, "if" always means "if and only if". Writing "an integer n is even
                        if and only if n = 2k for some integer k" is considered bad form, not because it is
                        wrong, but because the "only if" is already understood. In a theorem, lemma, or
                        corollary the two are completely different, and there the distinction must be
                        written out. This takes a while to become second nature.
                    </p>}
                    ko={<p>
                        definition 안에서 "if"는 언제나 "if and only if"를 뜻한다. "정수 n이 짝수인 것은 어떤
                        정수 k에 대해 n = 2k일 때, 그리고 오직 그때다"라고 쓰는 것은 틀려서가 아니라 이미 다
                        알고 있는 말을 덧붙였기 때문에 나쁜 문장이다. theorem, lemma, corollary에서는 둘이
                        완전히 다르며, 거기서는 반드시 구분해서 적어야 한다. 몸에 배기까지 시간이 걸린다.
                    </p>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Review of Proof Techniques</h2>} ko={<h2>증명 기법 정리</h2>}/>
            <T
                en={<p>
                    A proof is an explanation of why a statement is true, written to convince a skeptical
                    reader. That last part is the working definition: when you wonder whether a step needs
                    spelling out, ask whether a reader who wants to disbelieve you could slip through the
                    gap.
                </p>}
                ko={<p>
                    증명은 어떤 명제가 왜 참인지에 대한 설명이며, 회의적인 독자를 설득하려고 쓰는 글이다.
                    실무에서 쓸 기준은 그 마지막 부분이다. 어떤 단계를 풀어 써야 할지 망설여지면, 나를 믿지
                    않으려는 독자가 그 틈으로 빠져나갈 수 있는지 물어보면 된다.
                </p>}
            />

            <T en={<h3>Direct proof</h3>} ko={<h3>직접 증명</h3>}/>
            <T
                en={<p>
                    A proof is direct if the result follows by applying simple rules of logic to the
                    assumptions, definitions, axioms, and theorems already available.
                </p>}
                ko={<p>
                    가정, definition, axiom, 그리고 이미 확보한 theorem에 간단한 논리 규칙을 적용해 결과가
                    나오면 그 증명은 직접 증명이다.
                </p>}
            />
            <Definition n="1.1" title={t("Even and odd", "짝수와 홀수")}>
                <T
                    en={<p>
                        An integer <InlineMath math={"n"}/> is <strong>even</strong> if{" "}
                        <InlineMath math={"n = 2k"}/> for some integer <InlineMath math={"k"}/>, and{" "}
                        <strong>odd</strong> if <InlineMath math={"n = 2k + 1"}/> for some integer{" "}
                        <InlineMath math={"k"}/>.
                    </p>}
                    ko={<p>
                        정수 <InlineMath math={"n"}/>이 어떤 정수 <InlineMath math={"k"}/>에 대해{" "}
                        <InlineMath math={"n = 2k"}/>이면 <strong>짝수</strong>, 어떤 정수{" "}
                        <InlineMath math={"k"}/>에 대해 <InlineMath math={"n = 2k + 1"}/>이면{" "}
                        <strong>홀수</strong>다.
                    </p>}
                />
            </Definition>
            <Example n="1.3" title={t("The sum of two odd integers is even",
                "두 홀수의 합은 짝수다")}>
                <Proof>
                    <T
                        en={<p>Let <InlineMath math={"n_1"}/> and <InlineMath math={"n_2"}/> be odd. By
                            Definition 1.1 there are integers <InlineMath math={"k_1, k_2"}/> with</p>}
                        ko={<p><InlineMath math={"n_1"}/>, <InlineMath math={"n_2"}/>를 홀수라 하자.
                            Definition 1.1에 의해 정수 <InlineMath math={"k_1, k_2"}/>가 있어서</p>}
                    />
                    <BlockMath math={"n_1 = 2k_1 + 1, \\qquad n_2 = 2k_2 + 1."}/>
                    <Terms items={[
                        ["n_1, n_2", <T en={<>the two odd integers we started with</>}
                                       ko={<>출발점으로 잡은 두 홀수</>}/>],
                        ["k_1, k_2", <T en={<>integers supplied by the definition of odd</>}
                                       ko={<>홀수의 정의가 제공하는 정수</>}/>],
                    ]}/>
                    <T en={<p>Then by the rules of arithmetic,</p>} ko={<p>산술 규칙에 따라</p>}/>
                    <BlockMath math={"n_1 + n_2 = (2k_1 + 1) + (2k_2 + 1) = 2(k_1 + k_2 + 1)."}/>
                    <Terms items={[
                        ["k_1 + k_2 + 1", <T en={<>a sum of three integers, hence an integer</>}
                                            ko={<>정수 셋의 합이므로 정수</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Because <InlineMath math={"k_1 + k_2 + 1"}/> is an integer,{" "}
                            <InlineMath math={"n_1 + n_2"}/> has the form <InlineMath math={"2m"}/> and is
                            therefore even by Definition 1.1.
                        </p>}
                        ko={<p>
                            <InlineMath math={"k_1 + k_2 + 1"}/>이 정수이므로{" "}
                            <InlineMath math={"n_1 + n_2"}/>는 <InlineMath math={"2m"}/> 꼴이고, Definition
                            1.1에 의해 짝수다.
                        </p>}
                    />
                </Proof>
            </Example>

            <T en={<h3>Proof by contrapositive</h3>} ko={<h3>대우를 이용한 증명</h3>}/>
            <T
                en={<p>
                    To establish <InlineMath math={"p \\implies q"}/>, prove its logical equivalent{" "}
                    <InlineMath math={"\\lnot q \\implies \\lnot p"}/>. Once you have written down what{" "}
                    <InlineMath math={"\\lnot p"}/> and <InlineMath math={"\\lnot q"}/> are, the rest usually
                    proceeds like a direct proof. Writing them down explicitly is worth the ten seconds.
                </p>}
                ko={<p>
                    <InlineMath math={"p \\implies q"}/>를 보이려면 논리적 동치인{" "}
                    <InlineMath math={"\\lnot q \\implies \\lnot p"}/>를 증명하면 된다.{" "}
                    <InlineMath math={"\\lnot p"}/>와 <InlineMath math={"\\lnot q"}/>가 무엇인지 적어 두고
                    나면 나머지는 대개 직접 증명처럼 흘러간다. 그 십 초는 쓸 값어치가 있다.
                </p>}
            />
            <Example n="1.4" title={
                <T en={<>If <InlineMath math={"n^2"}/> is even, then <InlineMath math={"n"}/> is even</>}
                   ko={<><InlineMath math={"n^2"}/>이 짝수이면 <InlineMath math={"n"}/>도 짝수다</>}/>}>
                <Proof>
                    <T
                        en={<ul>
                            <li><InlineMath math={"p = (n^2 \\text{ is even})"}/>, so{" "}
                                <InlineMath math={"\\lnot p = (n^2 \\text{ is odd})"}/>.</li>
                            <li><InlineMath math={"q = (n \\text{ is even})"}/>, so{" "}
                                <InlineMath math={"\\lnot q = (n \\text{ is odd})"}/>.</li>
                        </ul>}
                        ko={<ul>
                            <li><InlineMath math={"p = (n^2 \\text{ is even})"}/>이므로{" "}
                                <InlineMath math={"\\lnot p = (n^2 \\text{ is odd})"}/>.</li>
                            <li><InlineMath math={"q = (n \\text{ is even})"}/>이므로{" "}
                                <InlineMath math={"\\lnot q = (n \\text{ is odd})"}/>.</li>
                        </ul>}
                    />
                    <T
                        en={<p>So let <InlineMath math={"n"}/> be odd, meaning{" "}
                            <InlineMath math={"n = 2k + 1"}/> for some integer{" "}
                            <InlineMath math={"k"}/>. Then</p>}
                        ko={<p>따라서 <InlineMath math={"n"}/>을 홀수라 두면 어떤 정수{" "}
                            <InlineMath math={"k"}/>에 대해 <InlineMath math={"n = 2k + 1"}/>이다. 그러면</p>}
                    />
                    <BlockMath math={"n^2 = (2k+1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1."}/>
                    <Terms items={[
                        ["n", <T en={<>the integer assumed odd, since we are proving the contrapositive</>}
                                ko={<>대우를 증명하는 중이므로 홀수라고 가정한 정수</>}/>],
                        ["k", <T en={<>the integer supplied by the definition of odd</>}
                                ko={<>홀수의 정의가 제공하는 정수</>}/>],
                        ["2k^2 + 2k", <T en={<>an integer, so <InlineMath math={"n^2"}/> has the form <InlineMath math={"2m + 1"}/></>}
                                        ko={<>정수이므로 <InlineMath math={"n^2"}/>은 <InlineMath math={"2m + 1"}/> 꼴이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            So <InlineMath math={"n^2"}/> is odd, which is <InlineMath math={"\\lnot p"}/>.
                            Having shown <InlineMath math={"\\lnot q \\implies \\lnot p"}/>, we have
                            shown <InlineMath math={"p \\implies q"}/>.
                        </p>}
                        ko={<p>
                            즉 <InlineMath math={"n^2"}/>은 홀수이고 이것이 <InlineMath math={"\\lnot p"}/>다.{" "}
                            <InlineMath math={"\\lnot q \\implies \\lnot p"}/>를 보였으므로{" "}
                            <InlineMath math={"p \\implies q"}/>를 보인 것이다.
                        </p>}
                    />
                </Proof>
            </Example>

            <T en={<h3>Proof by exhaustion</h3>} ko={<h3>모든 경우 확인 (exhaustion)</h3>}/>
            <T
                en={<p>
                    Reduce the problem to finitely many cases and check each one. The{" "}
                    <a href={FOUR_COLOR} target="_blank" rel="noopener noreferrer">four color theorem</a> was
                    proved this way, with 1,834 map configurations checked by computer over a thousand hours.
                    In this course, four cases will already feel like a lot.
                </p>}
                ko={<p>
                    문제를 유한 개의 경우로 줄이고 하나씩 확인한다.{" "}
                    <a href={FOUR_COLOR} target="_blank" rel="noopener noreferrer">4색 정리</a>가 이 방식으로
                    증명되었다. 지도 배치 1,834가지를 컴퓨터가 천 시간 넘게 검사했다. 이 과목에서는 네 가지
                    경우만 되어도 많게 느껴질 것이다.
                </p>}
            />

            <T en={<h3>Proof by induction</h3>} ko={<h3>귀납법</h3>}/>
            <Theorem title={t("First Principle of Induction (standard induction)",
                "제1 귀납 원리 (보통의 귀납법)")}>
                <T
                    en={<p>
                        Let <InlineMath math={"P(n)"}/> be a statement about the natural numbers such that
                        (a) <InlineMath math={"P(1)"}/> is true, and (b) <InlineMath math={"P(k)"}/> true
                        implies <InlineMath math={"P(k+1)"}/> true. Then <InlineMath math={"P(n)"}/> is
                        true for all <InlineMath math={"n \\ge 1"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"P(n)"}/>을 자연수에 관한 명제라 하고 (a){" "}
                        <InlineMath math={"P(1)"}/>이 참이며 (b) <InlineMath math={"P(k)"}/>가 참이면{" "}
                        <InlineMath math={"P(k+1)"}/>도 참이라 하자. 그러면 모든{" "}
                        <InlineMath math={"n \\ge 1"}/>에 대해 <InlineMath math={"P(n)"}/>이 참이다.
                    </p>}
                />
            </Theorem>
            <T
                en={<p>
                    The two conditions are usually taught as dominoes, and the picture is a good one. What
                    the picture is really for is showing what happens when one of the two conditions is
                    missing, because that is where proofs actually fail. Turn off the base case, or break the
                    step at a particular <InlineMath math={"k"}/>, and watch how far the chain gets.
                </p>}
                ko={<p>
                    두 조건은 보통 도미노로 배우고, 그 비유는 좋다. 정작 그림이 필요한 이유는 둘 중 하나가
                    빠졌을 때 무슨 일이 벌어지는지 보여 주기 때문이다. 실제 증명이 무너지는 곳이 거기다. base
                    case를 끄거나 특정 <InlineMath math={"k"}/>에서 step을 깨뜨려 보고, 사슬이 어디까지 가는지
                    확인해 보자.
                </p>}
            />
            <CanvasFigure
                label={t("Both conditions are needed: turn either one off and see where the chain stops",
                    "두 조건이 모두 필요하다. 하나를 끄면 사슬이 어디서 멈추는지 보인다")}
                bodyClassName="w-[min(92vw,900px)]"
                modal={<InductionDominoes height={300}/>}>
                <InductionDominoes/>
            </CanvasFigure>
            <Example n="1.6" title={
                <T en={<>For all <InlineMath math={"n \\ge 1"}/>,{" "}
                    <InlineMath math={"1 + 3 + 5 + \\cdots + (2n - 1) = n^2"}/></>}
                   ko={<>모든 <InlineMath math={"n \\ge 1"}/>에 대해{" "}
                       <InlineMath math={"1 + 3 + 5 + \\cdots + (2n - 1) = n^2"}/></>}/>}>
                <Proof>
                    <T
                        en={<p><strong>Step 0.</strong> Write down the statement:{" "}
                            <InlineMath math={"P(k): 1 + 3 + \\cdots + (2k-1) = k^2"}/>.</p>}
                        ko={<p><strong>Step 0.</strong> 명제를 적는다.{" "}
                            <InlineMath math={"P(k): 1 + 3 + \\cdots + (2k-1) = k^2"}/>.</p>}
                    />
                    <T
                        en={<p><strong>Step 1.</strong> Base case <InlineMath math={"P(1)"}/>:{" "}
                            <InlineMath math={"1 = 1^2"}/>, true.</p>}
                        ko={<p><strong>Step 1.</strong> base case <InlineMath math={"P(1)"}/>:{" "}
                            <InlineMath math={"1 = 1^2"}/>이므로 참이다.</p>}
                    />
                    <T
                        en={<p><strong>Step 2.</strong> Assume <InlineMath math={"P(k)"}/>. Then{" "}
                            <InlineMath math={"P(k+1)"}/> holds if and only if</p>}
                        ko={<p><strong>Step 2.</strong> <InlineMath math={"P(k)"}/>를 가정한다. 그러면{" "}
                            <InlineMath math={"P(k+1)"}/>은 다음이 성립할 때, 그리고 오직 그때 참이다.</p>}
                    />
                    <BlockMath math={"k^2 + \\bigl(2(k+1) - 1\\bigr) = (k+1)^2."}/>
                    <Terms items={[
                        ["k", <T en={<>the index at which the statement is assumed true</>}
                                ko={<>명제가 참이라고 가정한 지점의 인덱스</>}/>],
                        ["k^2", <T en={<>the sum of the first <InlineMath math={"k"}/> odd numbers, by the induction hypothesis <InlineMath math={"P(k)"}/></>}
                                  ko={<>귀납 가정 <InlineMath math={"P(k)"}/>에 의한, 처음 <InlineMath math={"k"}/>개 홀수의 합</>}/>],
                        ["2(k+1) - 1", <T en={<>the next odd number in the sum</>}
                                         ko={<>합에 새로 더해지는 다음 홀수</>}/>],
                    ]}/>
                    <T en={<p>Expanding the left side,</p>} ko={<p>좌변을 전개하면</p>}/>
                    <BlockMath math={"k^2 + 2k + 2 - 1 = k^2 + 2k + 1 = (k+1)^2,"}/>
                    <T
                        en={<p>
                            so <InlineMath math={"P(k+1)"}/> is true. Since <InlineMath math={"P(1)"}/> holds
                            and <InlineMath math={"P(k) \\implies P(k+1)"}/> for all{" "}
                            <InlineMath math={"k \\ge 1"}/>, the principle of induction gives the claim.
                        </p>}
                        ko={<p>
                            <InlineMath math={"P(k+1)"}/>이 참이다. <InlineMath math={"P(1)"}/>이 성립하고
                            모든 <InlineMath math={"k \\ge 1"}/>에 대해{" "}
                            <InlineMath math={"P(k) \\implies P(k+1)"}/>이므로, 귀납 원리에 의해 주장이 성립한다.
                        </p>}
                    />
                </Proof>
            </Example>
            <Remark n="1.7" title={t("When the base case looks like nothing",
                "base case가 할 게 없어 보일 때")}>
                <T
                    en={<p>
                        If <InlineMath math={"P(1)"}/> seems so trivial that you are unsure there is anything
                        to show, check <InlineMath math={"P(2)"}/> as well: <InlineMath math={"1 + 3 = 2^2"}/>.
                        Doing a little more than strictly required costs nothing while you are building
                        confidence.
                    </p>}
                    ko={<p>
                        <InlineMath math={"P(1)"}/>이 너무 당연해서 보일 게 있기는 한지 의심스러우면{" "}
                        <InlineMath math={"P(2)"}/>도 확인해 보면 된다. <InlineMath math={"1 + 3 = 2^2"}/>.
                        자신감을 쌓는 동안에는 요구된 것보다 조금 더 해도 손해가 없다.
                    </p>}
                />
            </Remark>
            <Remark title={t("The failure mode to memorize", "외워 둘 실패 유형")}>
                <T
                    en={<p>
                        The induction step must work for <em>every</em> <InlineMath math={"k"}/>, including
                        the first one. In the notorious{" "}
                        <a href={ALL_HORSES} target="_blank" rel="noopener noreferrer">"all horses are the
                            same color"</a> argument, the step{" "}
                        <InlineMath math={"P(1) \\implies P(2)"}/> is the one that fails, and it is easy to
                        overlook because every later step looks fine. Set the figure above to "step fails at
                        k = 1" to see the whole chain die after one domino.
                    </p>}
                    ko={<p>
                        귀납 step은 첫 번째를 포함해 <em>모든</em> <InlineMath math={"k"}/>에서 작동해야 한다.
                        악명 높은 <a href={ALL_HORSES} target="_blank" rel="noopener noreferrer">"모든 말은 같은
                            색"</a> 논증에서 무너지는 것은 <InlineMath math={"P(1) \\implies P(2)"}/> 하나이고,
                        그 뒤 step은 전부 멀쩡해 보여서 놓치기 쉽다. 위 그림을 "step이 k = 1에서 깨짐"으로 두면
                        도미노 하나 뒤로 사슬 전체가 죽는 것을 볼 수 있다.
                    </p>}
                />
            </Remark>

            <Theorem title={t("Second Principle of Induction (strong induction)",
                "제2 귀납 원리 (강한 귀납법)")}>
                <T
                    en={<p>
                        Let <InlineMath math={"P(n)"}/> be a statement about the natural numbers such that
                        (a) <InlineMath math={"P(1)"}/> is true, and (b) if{" "}
                        <InlineMath math={"P(j)"}/> is true for all <InlineMath math={"1 \\le j \\le k"}/>,
                        then <InlineMath math={"P(k+1)"}/> is true. Then{" "}
                        <InlineMath math={"P(n)"}/> is true for all <InlineMath math={"n \\ge 1"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"P(n)"}/>을 자연수에 관한 명제라 하고 (a){" "}
                        <InlineMath math={"P(1)"}/>이 참이며 (b) 모든{" "}
                        <InlineMath math={"1 \\le j \\le k"}/>에 대해 <InlineMath math={"P(j)"}/>가 참이면{" "}
                        <InlineMath math={"P(k+1)"}/>도 참이라 하자. 그러면 모든{" "}
                        <InlineMath math={"n \\ge 1"}/>에 대해 <InlineMath math={"P(n)"}/>이 참이다.
                    </p>}
                />
            </Theorem>
            <T
                en={<p>
                    Strong induction hands you every earlier statement, not just the previous one. It is not
                    actually more powerful: applying ordinary induction to{" "}
                    <InlineMath math={"Q(k) := P(1) \\land P(2) \\land \\cdots \\land P(k)"}/> gives exactly
                    strong induction on <InlineMath math={"P"}/>. It is simply more convenient when the proof
                    has to reach back past <InlineMath math={"k"}/>, as the next example does.
                </p>}
                ko={<p>
                    강한 귀납법은 바로 앞 명제만이 아니라 이전의 모든 명제를 손에 쥐여 준다. 실제로 더 강한
                    것은 아니다. <InlineMath math={"Q(k) := P(1) \\land P(2) \\land \\cdots \\land P(k)"}/>에
                    보통의 귀납법을 적용하면 <InlineMath math={"P"}/>에 대한 강한 귀납법과 정확히 같아진다.
                    다만 증명이 <InlineMath math={"k"}/>보다 앞쪽까지 손을 뻗어야 할 때 편하다. 다음 예가 그렇다.
                </p>}
            />
            <Definition n="1.9" title={t("Composite and prime", "합성수와 소수")}>
                <T
                    en={<p>
                        A natural number <InlineMath math={"n \\ge 2"}/> is <strong>composite</strong> if{" "}
                        <InlineMath math={"n = a \\cdot b"}/> for natural numbers with{" "}
                        <InlineMath math={"1 < a, b < n"}/>. Otherwise it is <strong>prime</strong>.
                    </p>}
                    ko={<p>
                        자연수 <InlineMath math={"n \\ge 2"}/>가 <InlineMath math={"1 < a, b < n"}/>인 자연수{" "}
                        <InlineMath math={"a, b"}/>에 대해 <InlineMath math={"n = a \\cdot b"}/>로 인수분해되면{" "}
                        <strong>합성수</strong>이고, 그렇지 않으면 <strong>소수</strong>다.
                    </p>}
                />
            </Definition>
            <Example n="1.11" title={
                <T en={<>Fundamental Theorem of Arithmetic: every <InlineMath math={"n \\ge 2"}/> is a
                    product of primes</>}
                   ko={<>산술의 기본 정리: 모든 <InlineMath math={"n \\ge 2"}/>는 소수들의 곱이다</>}/>}>
                <Proof>
                    <T
                        en={<p><strong>Step 0.</strong> For <InlineMath math={"k \\ge 2"}/>, let{" "}
                            <InlineMath math={"P(k)"}/> be: there exist primes whose product
                            is <InlineMath math={"k"}/>.</p>}
                        ko={<p><strong>Step 0.</strong> <InlineMath math={"k \\ge 2"}/>에 대해{" "}
                            <InlineMath math={"P(k)"}/>를 "곱이 <InlineMath math={"k"}/>가 되는 소수들이
                            존재한다"로 둔다.</p>}
                    />
                    <T
                        en={<p><strong>Step 1.</strong> Base case <InlineMath math={"P(2)"}/>: 2 is
                            itself prime, true.</p>}
                        ko={<p><strong>Step 1.</strong> base case <InlineMath math={"P(2)"}/>: 2는 그 자체로
                            소수이므로 참이다.</p>}
                    />
                    <T
                        en={<p><strong>Step 2.</strong> Assume <InlineMath math={"P(j)"}/> for all{" "}
                            <InlineMath math={"2 \\le j \\le k"}/>. Two cases for{" "}
                            <InlineMath math={"k+1"}/>:</p>}
                        ko={<p><strong>Step 2.</strong> 모든 <InlineMath math={"2 \\le j \\le k"}/>에 대해{" "}
                            <InlineMath math={"P(j)"}/>를 가정한다. <InlineMath math={"k+1"}/>에 대해 두 경우가
                            있다.</p>}
                    />
                    <T
                        en={<ul>
                            <li><strong>Case 1.</strong> <InlineMath math={"k+1"}/> is prime. Done: it is a
                                product of one prime, itself.</li>
                            <li><strong>Case 2.</strong> <InlineMath math={"k+1"}/> is composite, so{" "}
                                <InlineMath math={"k+1 = a \\cdot b"}/> with{" "}
                                <InlineMath math={"2 \\le a, b \\le k"}/>. Both{" "}
                                <InlineMath math={"a"}/> and <InlineMath math={"b"}/> lie in the range
                                covered by the hypothesis, so each is a product of primes, and therefore so
                                is their product.</li>
                        </ul>}
                        ko={<ul>
                            <li><strong>Case 1.</strong> <InlineMath math={"k+1"}/>이 소수인 경우. 자기 자신
                                하나로 이루어진 곱이므로 끝난다.</li>
                            <li><strong>Case 2.</strong> <InlineMath math={"k+1"}/>이 합성수인 경우.{" "}
                                <InlineMath math={"2 \\le a, b \\le k"}/>인 <InlineMath math={"a, b"}/>에 대해{" "}
                                <InlineMath math={"k+1 = a \\cdot b"}/>다. <InlineMath math={"a"}/>와{" "}
                                <InlineMath math={"b"}/> 모두 가정이 덮는 범위 안에 있으므로 각각 소수들의
                                곱이고, 따라서 둘의 곱도 소수들의 곱이다.</li>
                        </ul>}
                    />
                    <T
                        en={<p>
                            Ordinary induction would have been stuck here: <InlineMath math={"a"}/> and{" "}
                            <InlineMath math={"b"}/> are generally nowhere near <InlineMath math={"k"}/>.
                        </p>}
                        ko={<p>
                            보통의 귀납법이었다면 여기서 막힌다. <InlineMath math={"a"}/>와{" "}
                            <InlineMath math={"b"}/>는 일반적으로 <InlineMath math={"k"}/> 근처에 있지 않다.
                        </p>}
                    />
                </Proof>
            </Example>

            <T en={<h3>Proof by contradiction</h3>} ko={<h3>귀류법</h3>}/>
            <Definition n="1.12" title={t("Contradiction", "모순")}>
                <T
                    en={<p>
                        A <strong>contradiction</strong> is a logical statement{" "}
                        <InlineMath math={"R"}/> such that <InlineMath math={"R \\land (\\lnot R)"}/> is true.
                    </p>}
                    ko={<p>
                        <strong>모순</strong>이란 <InlineMath math={"R \\land (\\lnot R)"}/>이 참이 되는 논리
                        명제 <InlineMath math={"R"}/>을 말한다.
                    </p>}
                />
            </Definition>
            <T
                en={<p>
                    Students tend to distrust this technique at first, which is reasonable: it feels like
                    cheating. The justification is simple. If you start from true statements and apply the
                    rules of logic correctly, you cannot produce a contradiction. So if assuming{" "}
                    <InlineMath math={"\\lnot p"}/> produces one, <InlineMath math={"\\lnot p"}/> was false.
                </p>}
                ko={<p>
                    처음에는 이 기법을 못 미더워하는데, 그럴 만하다. 반칙처럼 느껴지기 때문이다. 근거는
                    간단하다. 참인 명제에서 출발해 논리 규칙을 올바르게 적용하면 모순은 나올 수 없다. 그러니{" "}
                    <InlineMath math={"\\lnot p"}/>를 가정해서 모순이 나왔다면 <InlineMath math={"\\lnot p"}/>가
                    거짓이었던 것이다.
                </p>}
            />
            <BlockMath math={"\\bigl(p \\implies (\\exists R \\text{ s.t. } R \\land (\\lnot R) = T)\\bigr) \\iff p = F"}/>
            <Terms items={[
                ["p", <T en={<>the statement whose truth is in question</>} ko={<>참인지 따지는 명제</>}/>],
                ["R", <T en={<>any statement at all, produced along the way, shown to be both true and false</>}
                        ko={<>중간에 나온 아무 명제. 참이면서 동시에 거짓임을 보인 것</>}/>],
                ["T, F", <T en={<>the truth values true and false</>} ko={<>진리값 참과 거짓</>}/>],
            ]}/>
            <Example n="1.13" title={
                <T en={<><InlineMath math={"\\sqrt{2}"}/> is irrational</>}
                   ko={<><InlineMath math={"\\sqrt{2}"}/>는 무리수다</>}/>}>
                <Proof>
                    <T
                        en={<p>
                            Let <InlineMath math={"p"}/> be "<InlineMath math={"\\sqrt{2}"}/> is irrational"
                            and assume <InlineMath math={"\\lnot p"}/>. Then there are natural numbers{" "}
                            <InlineMath math={"m, n"}/> with no common factors and{" "}
                            <InlineMath math={"n \\neq 0"}/> such that
                        </p>}
                        ko={<p>
                            <InlineMath math={"p"}/>를 "<InlineMath math={"\\sqrt{2}"}/>는 무리수다"라 하고{" "}
                            <InlineMath math={"\\lnot p"}/>를 가정한다. 그러면 공약수가 없고{" "}
                            <InlineMath math={"n \\neq 0"}/>인 자연수 <InlineMath math={"m, n"}/>이 있어서
                        </p>}
                    />
                    <BlockMath math={"\\sqrt{2} = \\frac{m}{n}."}/>
                    <Terms items={[
                        ["m, n", <T en={<>natural numbers with no common factor, supplied by the definition of a rational number</>}
                                   ko={<>공약수가 없는 자연수. 유리수의 정의가 제공한다</>}/>],
                    ]}/>
                    <T en={<p>Squaring both sides,</p>} ko={<p>양변을 제곱하면</p>}/>
                    <BlockMath math={"2 = \\frac{m^2}{n^2} \\implies 2n^2 = m^2 \\implies m^2 \\text{ is even} \\implies m \\text{ is even},"}/>
                    <Terms items={[
                        ["m^2 = 2n^2", <T en={<>twice an integer, hence even by Definition 1.1</>}
                                         ko={<>정수의 2배이므로 Definition 1.1에 의해 짝수</>}/>],
                        ["m \\text{ is even}", <T en={<>this last step is Example 1.4, already proved by contrapositive</>}
                                                 ko={<>이 마지막 단계가 Example 1.4다. 대우로 이미 증명했다</>}/>],
                    ]}/>
                    <T
                        en={<p>so <InlineMath math={"m = 2k"}/> for some integer{" "}
                            <InlineMath math={"k"}/>. Substituting back,</p>}
                        ko={<p>따라서 어떤 정수 <InlineMath math={"k"}/>에 대해{" "}
                            <InlineMath math={"m = 2k"}/>다. 다시 대입하면</p>}
                    />
                    <BlockMath math={"2n^2 = (2k)^2 = 4k^2 \\implies n^2 = 2k^2 \\implies n^2 \\text{ is even} \\implies n \\text{ is even}."}/>
                    <Terms items={[
                        ["k", <T en={<>the integer supplied by <InlineMath math={"m"}/> being even</>}
                                ko={<><InlineMath math={"m"}/>이 짝수라는 사실이 제공하는 정수</>}/>],
                        ["n", <T en={<>now shown even by the same appeal to Example 1.4</>}
                                ko={<>같은 Example 1.4에 의해 이제 짝수임이 밝혀진 수</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Let <InlineMath math={"R"}/> be "<InlineMath math={"m"}/> and{" "}
                            <InlineMath math={"n"}/> have no common factor". We assumed{" "}
                            <InlineMath math={"R"}/> is true, and we have just shown both are even, so 2 is a
                            common factor and <InlineMath math={"\\lnot R"}/> is true as well. That is a
                            contradiction, so <InlineMath math={"\\lnot p"}/> is false and{" "}
                            <InlineMath math={"\\sqrt{2}"}/> is irrational.
                        </p>}
                        ko={<p>
                            <InlineMath math={"R"}/>을 "<InlineMath math={"m"}/>과 <InlineMath math={"n"}/>은
                            공약수가 없다"라 하자. 우리는 <InlineMath math={"R"}/>이 참이라고 가정했는데, 방금
                            둘 다 짝수임을 보였으므로 2가 공약수이고 <InlineMath math={"\\lnot R"}/>도 참이다.
                            이것이 모순이므로 <InlineMath math={"\\lnot p"}/>는 거짓이고{" "}
                            <InlineMath math={"\\sqrt{2}"}/>는 무리수다.
                        </p>}
                    />
                </Proof>
            </Example>
            <Remark n="1.14" title={t("Contradiction also proves implications",
                "귀류법으로 implication도 증명한다")}>
                <T
                    en={<p>
                        To prove <InlineMath math={"p \\implies q"}/> by contradiction, start from{" "}
                        <InlineMath math={"p \\land (\\lnot q)"}/>. Assuming the conclusion false usually
                        gives you a concrete handle to work with, which is why this version is often the
                        easiest route.
                    </p>}
                    ko={<p>
                        <InlineMath math={"p \\implies q"}/>를 귀류법으로 증명하려면{" "}
                        <InlineMath math={"p \\land (\\lnot q)"}/>에서 출발한다. 결론이 거짓이라고 두면 대개
                        붙잡고 다룰 구체적인 손잡이가 생기고, 그래서 이 방식이 가장 쉬운 길일 때가 많다.
                    </p>}
                />
            </Remark>
            <Remark title={t("Summary, and one rookie mistake", "요약, 그리고 흔한 실수")}>
                <T
                    en={<ul>
                        <li><strong>Direct.</strong> <InlineMath math={"p \\implies q"}/>.</li>
                        <li><strong>Contrapositive.</strong>{" "}
                            <InlineMath math={"\\lnot q \\implies \\lnot p"}/>.</li>
                        <li><strong>Contradiction I.</strong> Assume{" "}
                            <InlineMath math={"\\lnot p"}/>, derive{" "}
                            <InlineMath math={"R \\land (\\lnot R)"}/>, conclude{" "}
                            <InlineMath math={"p"}/>.</li>
                        <li><strong>Contradiction II.</strong> Assume{" "}
                            <InlineMath math={"p \\land (\\lnot q)"}/>, derive a contradiction,
                            conclude <InlineMath math={"p \\implies q"}/>.</li>
                        <li><strong>Induction</strong> in either form, and{" "}
                            <strong>exhaustion</strong> over finitely many cases.</li>
                        <li>To prove <InlineMath math={"p \\iff q"}/> you must prove both{" "}
                            <InlineMath math={"p \\implies q"}/> and its converse{" "}
                            <InlineMath math={"q \\implies p"}/>.</li>
                    </ul>}
                    ko={<ul>
                        <li><strong>직접 증명.</strong> <InlineMath math={"p \\implies q"}/>.</li>
                        <li><strong>대우.</strong> <InlineMath math={"\\lnot q \\implies \\lnot p"}/>.</li>
                        <li><strong>귀류법 I.</strong> <InlineMath math={"\\lnot p"}/>를 가정해{" "}
                            <InlineMath math={"R \\land (\\lnot R)"}/>을 이끌어 내고{" "}
                            <InlineMath math={"p"}/>를 결론짓는다.</li>
                        <li><strong>귀류법 II.</strong> <InlineMath math={"p \\land (\\lnot q)"}/>를 가정해
                            모순을 이끌어 내고 <InlineMath math={"p \\implies q"}/>를 결론짓는다.</li>
                        <li><strong>귀납법</strong> 두 형태, 그리고 유한 개의 경우에 대한{" "}
                            <strong>exhaustion</strong>.</li>
                        <li><InlineMath math={"p \\iff q"}/>를 증명하려면 <InlineMath math={"p \\implies q"}/>와
                            그 역 <InlineMath math={"q \\implies p"}/>를 모두 증명해야 한다.</li>
                    </ul>}
                />
                <T
                    en={<p>
                        The rookie mistake is to prove <InlineMath math={"p \\implies q"}/> and then
                        "also" prove <InlineMath math={"\\lnot q \\implies \\lnot p"}/>, believing that
                        settles <InlineMath math={"p \\iff q"}/>. Those two are the same statement. You
                        proved one thing twice and the converse not at all.
                    </p>}
                    ko={<p>
                        흔한 실수는 <InlineMath math={"p \\implies q"}/>를 증명한 뒤 "추가로"{" "}
                        <InlineMath math={"\\lnot q \\implies \\lnot p"}/>를 증명하고서{" "}
                        <InlineMath math={"p \\iff q"}/>가 끝났다고 여기는 것이다. 그 둘은 같은 명제다. 한
                        가지를 두 번 증명했을 뿐 역은 손도 대지 않은 것이다.
                    </p>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Truth Tables</h2>} ko={<h2>진리표</h2>}/>
            <T
                en={<p>
                    A truth table lists every combination of input truth values and the resulting output. It
                    settles arguments that intuition cannot. The one worth staring at is the identity behind
                    proof by contradiction:
                </p>}
                ko={<p>
                    진리표는 입력 진리값의 모든 조합과 그에 따른 출력을 나열한 표다. 직관으로 결판나지 않는
                    논쟁을 끝내 준다. 들여다볼 값어치가 있는 것은 귀류법을 떠받치는 다음 등식이다.
                </p>}
            />
            <BlockMath math={"(p \\implies q) \\iff \\lnot(p \\land \\lnot q)"}/>
            <Terms items={[
                ["p", <T en={<>the hypothesis</>} ko={<>가정</>}/>],
                ["q", <T en={<>the conclusion</>} ko={<>결론</>}/>],
                ["p \\land \\lnot q", <T en={<>the only situation an implication forbids: hypothesis holds, conclusion fails</>}
                                        ko={<>implication이 금지하는 유일한 상황. 가정은 성립하는데 결론이 무너진 경우</>}/>],
                ["\\lnot(p \\land \\lnot q)", <T en={<>the assertion that the forbidden situation does not occur</>}
                                                ko={<>그 금지된 상황이 일어나지 않는다는 주장</>}/>],
            ]}/>
            <T
                en={<p>
                    Checking it is easy, since it only involves negation and conjunction. Accepting it is the
                    hard part, so build the table row by row and watch the last two columns.
                </p>}
                ko={<p>
                    확인은 쉽다. 부정과 논리 and만 들어가기 때문이다. 어려운 것은 받아들이는 쪽이니, 표를 한 행씩
                    지어 보면서 마지막 두 열을 지켜보자.
                </p>}
            />
            <CanvasFigure
                label={t("Click a row: the implication fails only when the hypothesis holds and the conclusion does not",
                    "행을 클릭해 보자. implication은 가정이 성립하고 결론이 무너질 때만 거짓이 된다")}
                bodyClassName="w-[min(92vw,760px)]">
                <TruthTableExplorer/>
            </CanvasFigure>
            <Remark n="1.15" title={t("Why the bottom two rows are true",
                "아래 두 행이 참인 이유")}>
                <T
                    en={<p>
                        Let <InlineMath math={"p"}/> be "you score 100% on everything" and{" "}
                        <InlineMath math={"q"}/> be "I give you an A+". Everyone agrees{" "}
                        <InlineMath math={"p \\implies q"}/> is a correct promise. Now suppose you score 85%.
                        Whatever grade I assign, I have not broken the promise, because the promise never
                        applied. So the implication is not false, and with binary logic that leaves only one
                        option: it is true.
                    </p>}
                    ko={<p>
                        <InlineMath math={"p"}/>를 "모든 시험과 과제에서 100점을 받는다",{" "}
                        <InlineMath math={"q"}/>를 "A+를 준다"라 하자. <InlineMath math={"p \\implies q"}/>가
                        올바른 약속이라는 데는 아무도 이견이 없다. 이제 85점을 받았다고 하자. 내가 어떤 학점을
                        주든 약속을 어긴 것은 아니다. 애초에 약속이 적용되지 않았기 때문이다. 그러니 implication은
                        거짓이 아니고, 이진 논리에서 남는 선택지는 하나뿐이다. 참이다.
                    </p>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Negating Logical Statements</h2>} ko={<h2>논리 명제의 부정</h2>}/>
            <T
                en={<p>
                    Several proof techniques require negating a statement, and the quantified ones are where
                    mistakes happen. The reliable method, at least at first, is to translate the statement
                    into words, negate the words, and translate back. The symbols are shorthand for word
                    phrases, so nothing is lost by going through language.
                </p>}
                ko={<p>
                    여러 증명 기법이 명제의 부정을 요구하는데, 실수가 나오는 곳은 quantifier가 붙은 명제다. 적어도
                    처음에는 확실한 방법이 하나 있다. 명제를 말로 옮기고, 말을 부정하고, 다시 기호로 옮기는
                    것이다. 기호는 말로 된 구절의 줄임말이니 언어를 거친다고 잃을 것이 없다.
                </p>}
            />
            <T
                en={<p>The two rules the translation always produces:</p>}
                ko={<p>이 번역이 언제나 만들어 내는 두 규칙은 다음과 같다.</p>}
            />
            <BlockMath math={"\\lnot \\forall \\iff \\exists \\qquad\\qquad \\lnot \\exists \\iff \\forall"}/>
            <Terms items={[
                ["\\forall", <T en={<>"for every": negating it produces a single counterexample</>}
                               ko={<>"모든". 부정하면 반례 하나가 나온다</>}/>],
                ["\\exists", <T en={<>"there exists": negating it rules the possibility out everywhere</>}
                               ko={<>"존재한다". 부정하면 그 가능성이 어디에서도 없다는 뜻이 된다</>}/>],
                ["\\lnot", <T en={<>logical negation, applied to the whole statement that follows</>}
                             ko={<>논리 부정. 뒤따르는 명제 전체에 적용된다</>}/>],
            ]}/>
            <Example n="1.16" title={t("Negating a single quantifier", "quantifier 하나 부정하기")}>
                <T
                    en={<ul>
                        <li>Math: <InlineMath math={"p : \\forall x \\in \\mathbb{R},\\; f(x) > 0"}/></li>
                        <li>Words: for all real x, f(x) is positive</li>
                        <li>Negate: not (for all real x, f(x) is positive)</li>
                        <li>Equivalently: for some real x, f(x) is not positive</li>
                        <li>Math: <InlineMath math={"\\lnot p : \\exists x \\in \\mathbb{R} \\text{ s.t. } f(x) \\le 0"}/></li>
                    </ul>}
                    ko={<ul>
                        <li>기호: <InlineMath math={"p : \\forall x \\in \\mathbb{R},\\; f(x) > 0"}/></li>
                        <li>말: 모든 실수 x에 대해 f(x)는 양수다</li>
                        <li>부정: (모든 실수 x에 대해 f(x)는 양수다)가 아니다</li>
                        <li>바꿔 말하면: 어떤 실수 x에 대해 f(x)는 양수가 아니다</li>
                        <li>기호: <InlineMath math={"\\lnot p : \\exists x \\in \\mathbb{R} \\text{ s.t. } f(x) \\le 0"}/></li>
                    </ul>}
                />
            </Example>
            <T
                en={<p>
                    With two quantifiers the mechanics are identical, but the meaning shifts in ways worth
                    feeling directly. Flip each quantifier below and read what the statement now claims.
                </p>}
                ko={<p>
                    quantifier가 둘이어도 절차는 똑같다. 다만 뜻이 달라지는 방식은 직접 겪어 볼 값어치가 있다.
                    아래에서 quantifier를 하나씩 뒤집어 보고, 문장이 이제 무엇을 주장하는지 읽어 보자.
                </p>}
            />
            <CanvasFigure
                label={t("Negation flips every quantifier and the inner relation, and nothing else",
                    "부정은 모든 quantifier와 안쪽 관계식을 뒤집고, 그 밖에는 아무것도 바꾸지 않는다")}
                bodyClassName="w-[min(92vw,760px)]">
                <QuantifierNegator/>
            </CanvasFigure>
            <Example n="1.19" title={t("Three quantifiers", "quantifier 세 개")}>
                <T
                    en={<p>
                        Given <InlineMath math={"p : \\forall y \\in \\mathbb{R},\\; \\forall \\epsilon > 0,\\; \\exists x \\in \\mathbb{Q} \\text{ s.t. } |x - y| < \\epsilon"}/>,
                        the negation flips all three in place:
                    </p>}
                    ko={<p>
                        <InlineMath math={"p : \\forall y \\in \\mathbb{R},\\; \\forall \\epsilon > 0,\\; \\exists x \\in \\mathbb{Q} \\text{ s.t. } |x - y| < \\epsilon"}/>이
                        주어지면, 부정은 셋을 자리에서 그대로 뒤집는다.
                    </p>}
                />
                <BlockMath math={"\\lnot p : \\exists y \\in \\mathbb{R} \\text{ and } \\exists \\epsilon > 0 \\text{ s.t. } \\forall x \\in \\mathbb{Q},\\; |x - y| \\ge \\epsilon"}/>
                <Terms items={[
                    ["y", <T en={<>a real number, the point being approximated</>} ko={<>근사의 대상이 되는 실수</>}/>],
                    ["\\epsilon", <T en={<>the accuracy demanded of the approximation</>} ko={<>근사에 요구되는 정확도</>}/>],
                    ["x", <T en={<>a rational number, the approximation itself</>} ko={<>근사값 자체인 유리수</>}/>],
                    ["|x - y|", <T en={<>the approximation error</>} ko={<>근사 오차</>}/>],
                ]}/>
                <T
                    en={<p>
                        The original says the rationals are dense in the reals, which is true. The negation
                        says some real number has a gap of width <InlineMath math={"\\epsilon"}/> around it
                        containing no rational at all, which is false.
                    </p>}
                    ko={<p>
                        원래 명제는 유리수가 실수 안에 dense하다는 뜻이고 참이다. 부정은 어떤 실수 둘레에 폭{" "}
                        <InlineMath math={"\\epsilon"}/>짜리 틈이 있어서 그 안에 유리수가 하나도 없다는 뜻이고
                        거짓이다.
                    </p>}
                />
            </Example>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Key Properties of Real Numbers</h2>} ko={<h2>실수의 핵심 성질</h2>}/>
            <T
                en={<p>
                    Let <InlineMath math={"A"}/> be a subset of <InlineMath math={"\\mathbb{R}"}/>. The
                    distinction developed here, between a bound that belongs to the set and one that does
                    not, is what makes existence theorems for optimization possible in Chapters 6 and 7.
                </p>}
                ko={<p>
                    <InlineMath math={"A"}/>를 <InlineMath math={"\\mathbb{R}"}/>의 부분집합이라 하자. 여기서
                    다루는 구분, 즉 경계가 집합에 속하는 경우와 그렇지 않은 경우의 차이가 6장과 7장에서
                    최적화의 존재 정리를 가능하게 만든다.
                </p>}
            />
            <Definition n="1.20" title={t("Maximum", "최댓값")}>
                <T
                    en={<p>
                        An element <InlineMath math={"b \\in A"}/> is a <strong>maximum</strong> of{" "}
                        <InlineMath math={"A"}/> if <InlineMath math={"x \\le b"}/> for all{" "}
                        <InlineMath math={"x \\in A"}/>. Note that <InlineMath math={"b"}/> must belong
                        to <InlineMath math={"A"}/>.
                    </p>}
                    ko={<p>
                        모든 <InlineMath math={"x \\in A"}/>에 대해 <InlineMath math={"x \\le b"}/>인{" "}
                        <InlineMath math={"b \\in A"}/>를 <InlineMath math={"A"}/>의{" "}
                        <strong>최댓값</strong>이라 한다. <InlineMath math={"b"}/>가 반드시{" "}
                        <InlineMath math={"A"}/>에 속해야 한다는 점에 유의한다.
                    </p>}
                />
            </Definition>
            <Definition n="1.21" title={t("Upper bound", "upper bound")}>
                <T
                    en={<p>
                        An element <InlineMath math={"b \\in \\mathbb{R}"}/> is an{" "}
                        <strong>upper bound</strong> of <InlineMath math={"A"}/> if{" "}
                        <InlineMath math={"x \\le b"}/> for all <InlineMath math={"x \\in A"}/>. Here{" "}
                        <InlineMath math={"b"}/> does <em>not</em> have to belong to{" "}
                        <InlineMath math={"A"}/>. We then say <InlineMath math={"A"}/> is bounded from above.
                    </p>}
                    ko={<p>
                        모든 <InlineMath math={"x \\in A"}/>에 대해 <InlineMath math={"x \\le b"}/>인{" "}
                        <InlineMath math={"b \\in \\mathbb{R}"}/>를 <InlineMath math={"A"}/>의{" "}
                        <strong>upper bound</strong>라 한다. 여기서 <InlineMath math={"b"}/>는{" "}
                        <InlineMath math={"A"}/>에 속하지 <em>않아도</em> 된다. 이때{" "}
                        <InlineMath math={"A"}/>가 위로 유계라고 말한다.
                    </p>}
                />
            </Definition>
            <Definition n="1.23" title={t("Least upper bound, or supremum", "least upper bound, 곧 supremum")}>
                <T
                    en={<p>
                        An element <InlineMath math={"b^\\ast \\in \\mathbb{R}"}/> is the{" "}
                        <strong>least upper bound</strong> of <InlineMath math={"A"}/> if (a){" "}
                        <InlineMath math={"b^\\ast"}/> is an upper bound, and (b) every upper bound{" "}
                        <InlineMath math={"b"}/> satisfies <InlineMath math={"b^\\ast \\le b"}/>. It is
                        written <InlineMath math={"\\sup A"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"b^\\ast \\in \\mathbb{R}"}/>가 (a) upper bound이고 (b) 임의의 upper bound{" "}
                        <InlineMath math={"b"}/>에 대해 <InlineMath math={"b^\\ast \\le b"}/>를 만족하면{" "}
                        <InlineMath math={"A"}/>의 <strong>least upper bound</strong>라 하고{" "}
                        <InlineMath math={"\\sup A"}/>로 쓴다.
                    </p>}
                />
            </Definition>
            <T
                en={<p>
                    A maximum can fail to exist while a supremum survives, and the gap between them is
                    exactly one bit of information: whether the endpoint is in the set. Drag the endpoints
                    below and toggle them open or closed.
                </p>}
                ko={<p>
                    최댓값은 없어도 supremum은 살아남을 수 있다. 둘 사이의 차이는 정확히 정보 한 비트, 곧
                    끝점이 집합 안에 있는지 여부다. 아래에서 끝점을 끌어 보고 열림과 닫힘을 바꿔 보자.
                </p>}
            />
            <CanvasFigure
                label={t("Open an endpoint: sup and inf stay put, while max and min disappear",
                    "끝점을 열어 보자. sup과 inf는 그대로 있고 최댓값과 최솟값만 사라진다")}
                bodyClassName="w-[min(92vw,900px)]"
                modal={<SupInfExplorer height={240}/>}>
                <SupInfExplorer/>
            </CanvasFigure>
            <Theorem title={t("Completeness of the reals", "실수의 완비성")}>
                <T
                    en={<p>
                        If <InlineMath math={"A \\subset \\mathbb{R}"}/> is bounded from above, then{" "}
                        <InlineMath math={"\\sup A"}/> exists in <InlineMath math={"\\mathbb{R}"}/>. If{" "}
                        <InlineMath math={"A"}/> is bounded from below, then{" "}
                        <InlineMath math={"\\inf A"}/> exists.
                    </p>}
                    ko={<p>
                        <InlineMath math={"A \\subset \\mathbb{R}"}/>가 위로 유계이면{" "}
                        <InlineMath math={"\\sup A"}/>가 <InlineMath math={"\\mathbb{R}"}/> 안에 존재한다.{" "}
                        <InlineMath math={"A"}/>가 아래로 유계이면 <InlineMath math={"\\inf A"}/>가 존재한다.
                    </p>}
                />
            </Theorem>
            <Remark n="1.25" title={t("This is what makes ℝ different from ℚ",
                "ℝ가 ℚ와 다른 지점이 바로 이것이다")}>
                <T
                    en={<p>
                        The rationals fail this property. Take{" "}
                        <InlineMath math={"A = \\{x \\in \\mathbb{Q} \\mid x^2 \\le 2\\}"}/>. The number 1.42
                        is a rational upper bound, and 1.415 is a smaller one, and the process never
                        terminates inside <InlineMath math={"\\mathbb{Q}"}/>: there is no least rational
                        upper bound. Viewed inside <InlineMath math={"\\mathbb{R}"}/>, the same set has{" "}
                        <InlineMath math={"\\sup A = \\sqrt{2}"}/>. The reals can be constructed from the
                        rationals as precisely the smallest set that repairs this.
                    </p>}
                    ko={<p>
                        유리수는 이 성질을 만족하지 않는다.{" "}
                        <InlineMath math={"A = \\{x \\in \\mathbb{Q} \\mid x^2 \\le 2\\}"}/>를 보자. 1.42는
                        유리수 upper bound이고 1.415는 그보다 작은 upper bound이며, 이 과정은{" "}
                        <InlineMath math={"\\mathbb{Q}"}/> 안에서 끝나지 않는다. 최소 유리수 upper bound가 없다. 같은
                        집합을 <InlineMath math={"\\mathbb{R}"}/> 안에서 보면{" "}
                        <InlineMath math={"\\sup A = \\sqrt{2}"}/>다. 실수는 유리수로부터 바로 이 결함을
                        메우는 가장 작은 집합으로 구성할 수 있다.
                    </p>}
                />
            </Remark>
            <T
                en={<p>The relationship between the two notions is an equivalence, not a vague analogy:</p>}
                ko={<p>두 개념의 관계는 막연한 비유가 아니라 동치다.</p>}
            />
            <BlockMath math={"b^\\ast = \\max A \\iff (b^\\ast = \\sup A) \\land (b^\\ast \\in A)"}/>
            <Terms items={[
                ["A", <T en={<>a subset of the real numbers</>} ko={<>실수의 부분집합</>}/>],
                ["b^\\ast", <T en={<>the candidate bound under discussion</>} ko={<>지금 따지고 있는 경계 후보</>}/>],
                ["\\max A", <T en={<>the largest element <em>of</em> <InlineMath math={"A"}/>, which need not exist</>}
                              ko={<><InlineMath math={"A"}/> <em>안의</em> 가장 큰 원소. 존재하지 않을 수 있다</>}/>],
                ["\\sup A", <T en={<>the least upper bound, which always exists for a set bounded above</>}
                              ko={<>least upper bound. 위로 유계인 집합에는 언제나 존재한다</>}/>],
                ["\\in", <T en={<>set membership: the single condition separating the two notions</>}
                           ko={<>원소 관계. 두 개념을 가르는 유일한 조건이다</>}/>],
            ]}/>
            <T
                en={<p>
                    Everything above repeats downward with minimum for maximum, greatest lower bound for
                    least upper bound, and infimum for supremum. When a set is unbounded we write{" "}
                    <InlineMath math={"\\sup A = +\\infty"}/> or <InlineMath math={"\\inf A = -\\infty"}/>.
                    These symbols are not real numbers, which is why the extended reals{" "}
                    <InlineMath math={"\\mathbb{R}_e := \\{-\\infty\\} \\cup \\mathbb{R} \\cup \\{+\\infty\\}"}/>{" "}
                    get a separate name.
                </p>}
                ko={<p>
                    위의 모든 내용은 최댓값 대신 최솟값, least upper bound 대신 greatest lower bound, supremum 대신 infimum으로
                    그대로 반복된다. 집합이 유계가 아니면 <InlineMath math={"\\sup A = +\\infty"}/> 또는{" "}
                    <InlineMath math={"\\inf A = -\\infty"}/>로 쓴다. 이 기호들은 실수가 아니며, 그래서 확장
                    실수 <InlineMath math={"\\mathbb{R}_e := \\{-\\infty\\} \\cup \\mathbb{R} \\cup \\{+\\infty\\}"}/>가
                    따로 이름을 갖는다.
                </p>}
            />

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Why Robotics</h2>} ko={<h2>로봇에서 왜 필요한가</h2>}/>
            <T
                en={<p>
                    None of this chapter mentions a robot, and every piece of it is load-bearing for the
                    ones that do.
                </p>}
                ko={<p>
                    이 장에는 로봇이 한 번도 나오지 않지만, 여기 있는 것 하나하나가 로봇이 나오는 장들을
                    떠받친다.
                </p>}
            />
            <T
                en={<ul>
                    <li>
                        <strong>Quantifier order is a specification.</strong> "The estimate converges" means{" "}
                        <InlineMath math={"\\forall \\epsilon > 0,\\; \\exists N \\text{ s.t. } \\forall k > N,\\; \\lVert \\hat{x}_k - x \\rVert < \\epsilon"}/>.
                        Whether <InlineMath math={"N"}/> may depend on the trajectory, or must work for all
                        trajectories at once, is the difference between a filter that works on your data and
                        one that works on anyone's. That difference lives entirely in the order of the
                        quantifiers.
                    </li>
                    <li>
                        <strong>Negation is how you read a failure.</strong> When a solver reports no
                        feasible point, it is asserting the negation of an existence claim. Knowing
                        mechanically what that negation says tells you what to go look for.
                    </li>
                    <li>
                        <strong>Induction is how the Kalman filter is derived.</strong> Chapter 5 proves that
                        if the estimate is conditionally Gaussian at step{" "}
                        <InlineMath math={"k"}/>, it stays conditionally Gaussian at{" "}
                        <InlineMath math={"k+1"}/>. That is a base case and a step, nothing more, and the
                        recursion you code up is the chain of dominoes falling.
                    </li>
                    <li>
                        <strong>Supremum is how you state a worst case.</strong> A bound like "the tracking
                        error never exceeds <InlineMath math={"\\epsilon"}/>" is a statement about{" "}
                        <InlineMath math={"\\sup_t \\lVert e(t) \\rVert"}/>, and that supremum exists even
                        when the error never actually attains it. Chapter 6 turns this into conditions under
                        which an optimum is attained, and Chapter 7 uses those conditions on real problems.
                    </li>
                    <li>
                        <strong>Contradiction proves impossibility.</strong> Results such as "no continuous
                        feedback law can globally stabilize this system" are proved by assuming one exists
                        and deriving nonsense. Without this technique, negative results are simply
                        unavailable.
                    </li>
                </ul>}
                ko={<ul>
                    <li>
                        <strong>quantifier 순서가 곧 사양이다.</strong> "추정값이 수렴한다"는{" "}
                        <InlineMath math={"\\forall \\epsilon > 0,\\; \\exists N \\text{ s.t. } \\forall k > N,\\; \\lVert \\hat{x}_k - x \\rVert < \\epsilon"}/>를
                        뜻한다. <InlineMath math={"N"}/>이 궤적마다 달라져도 되는지, 아니면 모든 궤적에 대해
                        한꺼번에 통해야 하는지가 내 데이터에서만 되는 필터와 누구의 데이터에서도 되는 필터를
                        가른다. 그 차이는 전부 quantifier의 순서에 들어 있다.
                    </li>
                    <li>
                        <strong>부정은 실패를 읽는 방법이다.</strong> solver가 실행 가능한 점이 없다고 보고할
                        때, 그것은 존재 주장의 부정을 단언하는 것이다. 그 부정이 무슨 말인지 기계적으로 알면
                        무엇을 찾아봐야 하는지도 알게 된다.
                    </li>
                    <li>
                        <strong>칼만 필터는 귀납법으로 유도된다.</strong> 5장은 <InlineMath math={"k"}/>단계에서
                        추정값이 조건부 가우시안이면 <InlineMath math={"k+1"}/>단계에서도 조건부 가우시안임을
                        증명한다. base case와 step, 그게 전부이며 우리가 코드로 짜는 재귀가 바로 넘어지는
                        도미노 사슬이다.
                    </li>
                    <li>
                        <strong>supremum은 최악의 경우를 말하는 방법이다.</strong> "추종 오차가{" "}
                        <InlineMath math={"\\epsilon"}/>을 절대 넘지 않는다" 같은 한계는{" "}
                        <InlineMath math={"\\sup_t \\lVert e(t) \\rVert"}/>에 관한 진술이고, 그 supremum은
                        오차가 실제로 그 값에 도달하지 않아도 존재한다. 6장은 이것을 최적해가 실제로 달성되는
                        조건으로 바꾸고, 7장은 그 조건을 실제 문제에 쓴다.
                    </li>
                    <li>
                        <strong>귀류법은 불가능성을 증명한다.</strong> "어떤 연속 피드백 법칙도 이 시스템을
                        전역적으로 안정화할 수 없다" 같은 결과는 그런 것이 존재한다고 가정하고 말이 안 되는
                        결론을 이끌어 내서 증명한다. 이 기법이 없으면 부정적 결과는 아예 손에 넣을 수 없다.
                    </li>
                </ul>}
            />

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>References</h2>} ko={<h2>References</h2>}/>
            <ul>
                <li>
                    Jessy W. Grizzle, <em>ROB 501: Mathematics for Robotics</em>, University of Michigan,
                    2022. Chapter 1.{" "}
                    <a href={COURSE} target="_blank" rel="noopener noreferrer">{t("Course page", "코스 페이지")}</a>
                    {" · "}
                    <a href={NOTES_REPO} target="_blank" rel="noopener noreferrer">michiganrobotics/rob501</a>
                </li>
                <li>
                    <a href={MSU_NOTES} target="_blank" rel="noopener noreferrer">
                        Math 299 axiom and proof notes, Michigan State University
                    </a>
                    {" · "}
                    {t("the source the vocabulary section draws on",
                        "용어 절이 근거로 삼은 자료")}
                </li>
                <li>
                    <a href={FOUR_COLOR} target="_blank" rel="noopener noreferrer">Four color theorem</a>
                    {" · "}
                    {t("proof by exhaustion at industrial scale",
                        "산업 규모로 수행된 exhaustion 증명")}
                </li>
                <li>
                    <a href={ALL_HORSES} target="_blank" rel="noopener noreferrer">
                        All horses are the same color
                    </a>
                    {" · "}
                    {t("the standard example of an induction step that fails at k = 1",
                        "귀납 step이 k = 1에서 깨지는 표준 예")}
                </li>
            </ul>
        </>
    );
};

export default Chapter1;
