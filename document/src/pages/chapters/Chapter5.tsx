import CanvasFigure from "../../components/CanvasFigure";
import BlueVsMve from "../../components/pages/chapter5/BlueVsMve";
import ConditioningExplorer from "../../components/pages/chapter5/ConditioningExplorer";
import EkfLinearization from "../../components/pages/chapter5/EkfLinearization";
import InformationFusion from "../../components/pages/chapter5/InformationFusion";
import KalmanFilter1D from "../../components/pages/chapter5/KalmanFilter1D";
import Tracking2D from "../../components/pages/chapter5/Tracking2D";
import {BlockMath, InlineMath} from "../../components/math/Tex";
import {Definition, Example, Lemma, Proof, Proposition, Remark, Theorem} from "../../components/math/Statement";
import Terms from "../../components/math/Terms";
import {T, useTr} from "../../libs/i18n";

const COURSE = "https://grizzle.robotics.umich.edu/education/rob501";
const NOTES_REPO = "https://github.com/michiganrobotics/rob501";
const KALMAN1960 = "https://www.cs.unc.edu/~welch/kalman/media/pdf/Kalman1960.pdf";
const PROB_ROBOTICS = "https://mitpress.mit.edu/9780262201629/probabilistic-robotics/";
const ANDERSON_MOORE = "https://users.cecs.anu.edu.au/~john/papers/BOOK/B02.PDF";
const HMC_CONDITIONING = "http://fourier.eng.hmc.edu/e161/lectures/gaussianprocess/node7.html";
const OXFORD_GAUSS = "http://www.stats.ox.ac.uk/~steffen/teaching/bs2HT9/gauss.pdf";
const EKF_PAPER = "http://ece.umich.edu/faculty/grizzle/papers/ekf.pdf";
const UKF_WIKI = "https://en.wikipedia.org/wiki/Kalman_filter#Unscented_Kalman_filter";

const Chapter5 = () => {
    const t = useTr();
    return (
        <>
            <T
                en={<p>
                    Chapters 3 and 4 solved <InlineMath math={"Ax = b"}/> when no exact solution existed,
                    and the answer they gave never once mentioned noise. The least squares estimate is a
                    geometric object: the projection of <InlineMath math={"b"}/> onto the span of the
                    columns. This chapter asks a question geometry cannot answer. If the measurement is
                    corrupted by something random, which estimate is <em>best</em>, and what does best even
                    mean?
                </p>}
                ko={<p>
                    3장과 4장은 정확한 해가 없는 <InlineMath math={"Ax = b"}/>를 풀었고, 그 답에는 잡음이
                    한 번도 등장하지 않았다. 최소제곱 추정은 기하학적 대상이다. 열들이 만드는 공간 위로{" "}
                    <InlineMath math={"b"}/>를 사영한 것이다. 이 장은 기하학이 답할 수 없는 질문을 던진다.
                    측정이 무작위한 무언가에 오염되어 있다면, 어떤 추정이 <em>가장 좋은가</em>? 그리고
                    가장 좋다는 말은 대체 무슨 뜻인가?
                </p>}
            />
            <T
                en={<p>
                    Answering it needs just enough probability to say what a covariance is. The payoff is
                    the Kalman filter: minimum variance estimation run recursively, one measurement at a
                    time, on a system that is moving while you measure it. Two models carry the whole
                    chapter, one static and one that runs.
                </p>}
                ko={<p>
                    답하려면 공분산이 무엇인지 말할 수 있을 만큼의 확률이 필요하다. 그 대가로 얻는 것이
                    칼만 필터다. 최소 분산 추정을 재귀적으로, 측정 하나씩, 그것도 재는 동안 움직이고 있는
                    시스템 위에서 돌리는 것이다. 장 전체를 떠받치는 모델은 둘이다. 하나는 멈춰 있고 하나는
                    돌아간다.
                </p>}
            />
            <BlockMath math={"y = Cx + \\varepsilon, \\qquad\\quad \\begin{aligned} x_{k+1} &= A_k x_k + G_k w_k \\\\ y_k &= C_k x_k + v_k \\end{aligned}"}/>
            <Terms items={[
                ["y", <T en={<>the measurement, <InlineMath math={"y \\in \\mathbb{R}^m"}/>: the only thing you actually get to see</>}
                         ko={<>측정. <InlineMath math={"y \\in \\mathbb{R}^m"}/>이고, 실제로 볼 수 있는 것은 이것뿐이다</>}/>],
                ["x", <T en={<>the quantity you want, <InlineMath math={"x \\in \\mathbb{R}^n"}/>: a calibration parameter on the left, the state of a moving robot on the right</>}
                         ko={<>알고 싶은 값. <InlineMath math={"x \\in \\mathbb{R}^n"}/>이고, 왼쪽에서는 캘리브레이션 파라미터, 오른쪽에서는 움직이는 로봇의 상태다</>}/>],
                ["C", <T en={<>the measurement model: how the thing you want shows up in the thing you see</>}
                         ko={<>측정 모델. 알고 싶은 값이 보이는 값 속에 어떻게 나타나는지를 적은 것이다</>}/>],
                ["\\varepsilon, v_k", <T en={<>measurement noise, zero mean, covariance <InlineMath math={"Q"}/></>}
                                        ko={<>측정 잡음. 평균이 0이고 공분산이 <InlineMath math={"Q"}/>다</>}/>],
                ["A_k", <T en={<>the state transition: where the state goes in one time step if nothing random happens</>}
                           ko={<>상태 전이. 무작위한 일이 없다면 한 시간 걸음 동안 상태가 가는 자리다</>}/>],
                ["w_k", <T en={<>process noise, zero mean, covariance <InlineMath math={"R_k"}/>: everything the model <em>fails</em> to predict</>}
                           ko={<>과정 잡음. 평균이 0이고 공분산이 <InlineMath math={"R_k"}/>다. 모델이 예측하지 <em>못하는</em> 것 전부가 여기에 들어간다</>}/>],
                ["G_k", <T en={<>how the process noise enters the state, often a column of <InlineMath math={"\\Delta t"}/> terms for an unmodelled acceleration</>}
                           ko={<>과정 잡음이 상태로 들어오는 통로. 모델에 없는 가속도라면 보통 <InlineMath math={"\\Delta t"}/> 항들로 된 열 하나다</>}/>],
            ]}/>
            <T
                en={<p>
                    The chapter is long because the vocabulary has to be built before the filter can be
                    stated. The route is: densities, then random vectors and their covariance, then two
                    estimators that differ by exactly one assumption, then conditioning, then Gaussians,
                    where conditioning turns out to have a closed form. The Kalman filter is that closed
                    form applied over and over.
                </p>}
                ko={<p>
                    이 장이 긴 이유는 필터를 적기 전에 어휘를 먼저 세워야 하기 때문이다. 경로는 이렇다.
                    밀도, 확률 벡터와 그 공분산, 가정 하나만 다른 두 추정기, 조건부 분포, 그리고 조건부
                    분포가 닫힌 꼴로 나오는 가우시안. 칼만 필터는 그 닫힌 꼴을 계속 되풀이해 적용한 것이다.
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
                    <td>5.1.3 {t("probability spaces", "확률 공간")}</td>
                    <td>{t("Densities and Random Vectors", "밀도 함수와 확률 벡터")}</td>
                    <td>{t("skip", "건너뛰어도 된다")}</td>
                </tr>
                <tr>
                    <td>5.2, 5.4.1</td>
                    <td>{t("Densities and Random Vectors", "밀도 함수와 확률 벡터")}</td>
                    <td>{t("read", "읽는다")}</td>
                </tr>
                <tr>
                    <td>5.3.1, 5.3.2</td>
                    <td>BLUE, MVE</td>
                    <td>{t("read", "읽는다")}</td>
                </tr>
                <tr>
                    <td>5.10 {t("MVE the BLUE way", "BLUE 방식의 MVE")}</td>
                    <td>{t("Minimum Variance Estimator (MVE)", "Minimum Variance Estimator (MVE)")}</td>
                    <td>{t("skip", "건너뛰어도 된다")}</td>
                </tr>
                <tr>
                    <td>5.4.3 {t("conditional density derivation", "조건부 밀도 유도")}</td>
                    <td>{t("Independence, Correlation, and Conditioning", "독립, 상관, 조건부 확률")}</td>
                    <td>{t("skip", "건너뛰어도 된다")}</td>
                </tr>
                <tr>
                    <td>5.5, 5.6</td>
                    <td>{t("Gaussian Random Vectors and conditioning", "가우시안 확률 벡터와 조건부 분포")}</td>
                    <td>{t("read twice", "두 번 읽는다")}</td>
                </tr>
                <tr>
                    <td>5.9 {t("information matrix", "정보 행렬")}</td>
                    <td>{t("Conditioning with Gaussian Random Vectors", "가우시안 확률 벡터의 조건부 분포")}</td>
                    <td>{t("skip", "건너뛰어도 된다")}</td>
                </tr>
                <tr>
                    <td>5.7.1 {t("to", "~")} 5.7.5</td>
                    <td>{t("The Discrete-time Kalman Filter", "이산시간 칼만 필터")}</td>
                    <td>{t("the whole point", "이 장의 목적지")}</td>
                </tr>
                <tr>
                    <td>5.7.6, 5.8</td>
                    <td>EKF, {t("Luenberger Observer", "Luenberger 관측기")}</td>
                    <td>{t("skip, then come back", "건너뛰었다가 돌아온다")}</td>
                </tr>
                </tbody>
            </table>
            <Remark title={<T en={<>Notation, and one trap</>} ko={<>기호, 그리고 함정 하나</>}/>}>
                <T
                    en={<ul>
                        <li><strong>These notes use <InlineMath math={"R_k"}/> for the{" "}
                            <em>process</em> noise covariance and <InlineMath math={"Q_k"}/> for
                            the <em>measurement</em> noise covariance.</strong> Most other books, and
                            most library APIs, use the two letters the other way round. Nothing here is
                            wrong, but copying a formula between this page and a textbook without
                            checking which letter is which will produce a filter that tunes backwards.</li>
                        <li><InlineMath math={"\\hat{x}_{k|k-1}"}/> is the estimate of{" "}
                            <InlineMath math={"x_k"}/> using measurements up to time{" "}
                            <InlineMath math={"k-1"}/>, and <InlineMath math={"\\hat{x}_{k|k}"}/> uses{" "}
                            <InlineMath math={"y_k"}/> as well. They are different objects and the whole
                            filter is about the step from one to the other. Where it is unambiguous, this
                            page writes <InlineMath math={"P^-"}/> and <InlineMath math={"P^+"}/> for the
                            two covariances at the same instant.</li>
                        <li><InlineMath math={"\\bar{x}"}/> with a bar is a mean, an ordinary number or
                            vector. <InlineMath math={"\\hat{x}"}/> with a hat is an estimate computed
                            from data. <InlineMath math={"x"}/> bare is the true value, which nobody
                            ever sees.</li>
                        <li><InlineMath math={"\\mathcal{E}\\{\\cdot\\}"}/> is expectation, written{" "}
                            <InlineMath math={"E\\{\\cdot\\}"}/> in places. Everything is real, so{" "}
                            <InlineMath math={"\\top"}/> is a plain transpose.</li>
                        <li>Positive definiteness is written <InlineMath math={"Q > 0"}/> in the notes,
                            meaning <InlineMath math={"v^\\top Q v > 0"}/> for every{" "}
                            <InlineMath math={"v \\ne 0"}/>, exactly as in Chapter 3.</li>
                    </ul>}
                    ko={<ul>
                        <li><strong>이 교재는 <em>과정</em> 잡음의 공분산을{" "}
                            <InlineMath math={"R_k"}/>로, <em>측정</em> 잡음의 공분산을{" "}
                            <InlineMath math={"Q_k"}/>로 쓴다.</strong> 다른 책 대부분과 라이브러리
                            API 대부분은 두 글자를 반대로 쓴다. 어느 쪽도 틀린 것은 아니지만, 어느
                            글자가 무엇인지 확인하지 않고 이 페이지와 교과서 사이에서 식을 옮겨 적으면
                            튜닝이 거꾸로 도는 필터가 나온다.</li>
                        <li><InlineMath math={"\\hat{x}_{k|k-1}"}/>은 시각{" "}
                            <InlineMath math={"k-1"}/>까지의 측정으로 만든{" "}
                            <InlineMath math={"x_k"}/>의 추정이고,{" "}
                            <InlineMath math={"\\hat{x}_{k|k}"}/>는 여기에{" "}
                            <InlineMath math={"y_k"}/>까지 쓴 것이다. 서로 다른 대상이고, 필터 전체가
                            바로 이 둘 사이의 한 걸음에 관한 것이다. 헷갈릴 일이 없는 자리에서는 같은
                            시각의 두 공분산을 <InlineMath math={"P^-"}/>와{" "}
                            <InlineMath math={"P^+"}/>로 적는다.</li>
                        <li>막대를 쓴 <InlineMath math={"\\bar{x}"}/>는 평균이고 그냥 수나 벡터다.
                            모자를 쓴 <InlineMath math={"\\hat{x}"}/>는 데이터로 계산한 추정이다.
                            아무것도 붙지 않은 <InlineMath math={"x"}/>는 참값이고, 그것을 본 사람은
                            아무도 없다.</li>
                        <li><InlineMath math={"\\mathcal{E}\\{\\cdot\\}"}/>는 기댓값이고 자리에 따라{" "}
                            <InlineMath math={"E\\{\\cdot\\}"}/>로도 적힌다. 전부 실수 위에서 돌아가므로{" "}
                            <InlineMath math={"\\top"}/>는 그냥 transpose다.</li>
                        <li>positive definite는 교재 표기대로 <InlineMath math={"Q > 0"}/>으로 적는다.
                            3장과 똑같이 <InlineMath math={"v \\ne 0"}/>인 모든{" "}
                            <InlineMath math={"v"}/>에 대해 <InlineMath math={"v^\\top Q v > 0"}/>라는
                            뜻이다.</li>
                    </ul>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Densities and Random Vectors</h2>} ko={<h2>밀도 함수와 확률 벡터</h2>}/>
            <T
                en={<p>
                    Probability is the most technical subject in this course, and the notes say so out
                    loud. The reason is that the honest definition of "the probability of an event" needs
                    measure theory, which is a semester by itself. The section below states the honest
                    definition, shows the one example that makes it unavoidable, and then puts it away.
                </p>}
                ko={<p>
                    확률은 이 과목에서 가장 기술적인 주제이고, 교재도 그렇다고 대놓고 말한다. 이유는
                    "사건의 확률"을 정직하게 정의하려면 측도론이 필요하고, 그것만으로 한 학기가 가기
                    때문이다. 아래에서는 정직한 정의를 적고, 그 정의를 피할 수 없게 만드는 예제 하나를
                    보이고, 그다음에는 치워 둔다.
                </p>}
            />
            <Remark title={<T en={<>Optional read: probability spaces (notes 5.1.3)</>}
                              ko={<>선택 읽기: 확률 공간 (교재 5.1.3)</>}/>}>
                <T
                    en={<p>
                        Everything from here to the end of the Cantor set example can be skipped on a
                        first pass. Nothing in BLUE, MVE, or the Kalman filter depends on it. Come back
                        when you want to know why "compute the probability by integrating the density"
                        is a choice rather than a definition.
                    </p>}
                    ko={<p>
                        여기부터 Cantor 집합 예제 끝까지는 첫 독에서 건너뛰어도 된다. BLUE도 MVE도 칼만
                        필터도 여기에 기대지 않는다. "밀도를 적분해서 확률을 계산한다"는 것이 정의가
                        아니라 선택이라는 사실이 궁금해질 때 돌아오면 된다.
                    </p>}
                />
            </Remark>
            <Definition n="5.4" title={<T en={<>Probability space</>} ko={<>확률 공간</>}/>}>
                <T
                    en={<p>
                        <InlineMath math={"(\\Omega, \\mathscr{F}, P)"}/> is a{" "}
                        <strong>probability space</strong> when
                    </p>}
                    ko={<p>
                        다음을 만족할 때 <InlineMath math={"(\\Omega, \\mathscr{F}, P)"}/>를{" "}
                        <strong>확률 공간</strong>이라 한다.
                    </p>}
                />
                <T
                    en={<ul>
                        <li><InlineMath math={"\\Omega"}/> is the <strong>sample space</strong>, the set
                            of all possible outcomes of an experiment, and{" "}
                            <InlineMath math={"E \\subset \\Omega"}/> is an <strong>event</strong>.</li>
                        <li><InlineMath math={"\\mathscr{F}"}/> is the collection of{" "}
                            <strong>allowed events</strong>. It contains at least{" "}
                            <InlineMath math={"\\emptyset"}/> and <InlineMath math={"\\Omega"}/>, and it
                            is closed under set complement, countable unions, and countable
                            intersections. Such a collection is called a sigma algebra.</li>
                        <li><InlineMath math={"P : \\mathscr{F} \\to [0, 1]"}/> is a{" "}
                            <strong>probability measure</strong> satisfying the three axioms below.</li>
                    </ul>}
                    ko={<ul>
                        <li><InlineMath math={"\\Omega"}/>는 <strong>표본 공간</strong>이다. 실험에서
                            나올 수 있는 모든 결과의 집합이고,{" "}
                            <InlineMath math={"E \\subset \\Omega"}/>가 <strong>사건</strong>이다.</li>
                        <li><InlineMath math={"\\mathscr{F}"}/>는 <strong>허용된 사건</strong>들의
                            모임이다. 적어도 <InlineMath math={"\\emptyset"}/>과{" "}
                            <InlineMath math={"\\Omega"}/>를 담고, 여집합과 가산 합집합, 가산
                            교집합에 대해 닫혀 있다. 이런 모임을 sigma algebra라 부른다.</li>
                        <li><InlineMath math={"P : \\mathscr{F} \\to [0, 1]"}/>는 아래 세 공리를
                            만족하는 <strong>확률 측도</strong>다.</li>
                    </ul>}
                />
                <BlockMath math={"P(\\emptyset) = 0, \\quad P(\\Omega) = 1, \\qquad 0 \\le P(E) \\le 1, \\qquad P\\Big(\\bigcup_{i=1}^{\\infty} E_i\\Big) = \\sum_{i=1}^{\\infty} P(E_i)"}/>
                <Terms items={[
                    ["E_i", <T en={<>pairwise disjoint events, meaning <InlineMath math={"E_i \\cap E_j = \\emptyset"}/> whenever <InlineMath math={"i \\ne j"}/></>}
                              ko={<>서로소인 사건들. <InlineMath math={"i \\ne j"}/>이면 <InlineMath math={"E_i \\cap E_j = \\emptyset"}/>이라는 뜻이다</>}/>],
                    ["\\bigcup_{i=1}^{\\infty}", <T en={<>a countable union: the axiom says probability adds over disjoint pieces, even infinitely many of them</>}
                                                   ko={<>가산 합집합. 서로소인 조각들 위에서는 확률이 더해진다는 공리이고, 조각이 무한히 많아도 그렇다</>}/>],
                    ["P(\\Omega) = 1", <T en={<>something happens; this is what makes the numbers comparable across experiments</>}
                                         ko={<>무슨 일이든 일어난다는 뜻이다. 서로 다른 실험의 수를 비교할 수 있게 만드는 조항이 이것이다</>}/>],
                ]}/>
            </Definition>
            <Example n="5.2" title={<T en={<>A fair die, all the way down</>} ko={<>공정한 주사위, 끝까지</>}/>}>
                <T
                    en={<p>
                        Take <InlineMath math={"\\Omega = \\{1,2,3,4,5,6\\}"}/>. Because{" "}
                        <InlineMath math={"\\Omega"}/> is finite, <InlineMath math={"\\mathscr{F}"}/> can
                        be the set of <em>all</em> subsets, all <InlineMath math={"2^6 = 64"}/> of them,
                        with no difficulty at all. The die is fair when{" "}
                        <InlineMath math={"P(\\{i\\}) = P(\\{j\\})"}/> for all{" "}
                        <InlineMath math={"i, j"}/>, which with the axioms forces{" "}
                        <InlineMath math={"P(\\{i\\}) = 1/6"}/>. Then for{" "}
                        <InlineMath math={"E := \\{1, 4, 6\\}"}/>, which is the disjoint union of three
                        singletons,
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\Omega = \\{1,2,3,4,5,6\\}"}/>으로 두자.{" "}
                        <InlineMath math={"\\Omega"}/>가 유한하므로{" "}
                        <InlineMath math={"\\mathscr{F}"}/>를 <em>모든</em> 부분집합의 모임,{" "}
                        <InlineMath math={"2^6 = 64"}/>개 전부로 잡아도 아무 문제가 없다. 모든{" "}
                        <InlineMath math={"i, j"}/>에 대해 <InlineMath math={"P(\\{i\\}) = P(\\{j\\})"}/>일
                        때 주사위가 공정하다고 하고, 공리와 합치면{" "}
                        <InlineMath math={"P(\\{i\\}) = 1/6"}/>이 강제된다. 이제 서로소인 홑원소 집합
                        셋의 합집합인 <InlineMath math={"E := \\{1, 4, 6\\}"}/>에 대해 다음이 성립한다.
                    </p>}
                />
                <BlockMath math={"P(E) = P(\\{1\\}) + P(\\{4\\}) + P(\\{6\\}) = \\tfrac{1}{6} + \\tfrac{1}{6} + \\tfrac{1}{6} = \\tfrac{1}{2}"}/>
                <Terms items={[
                    ["E", <T en={<>the event "the roll is 1, 4, or 6", an allowed event because <InlineMath math={"\\mathscr{F}"}/> here holds every subset</>}
                             ko={<>"1, 4, 6 중 하나가 나온다"는 사건. 여기서는 <InlineMath math={"\\mathscr{F}"}/>가 모든 부분집합을 담으므로 허용된 사건이다</>}/>],
                    ["\\tfrac{1}{2}", <T en={<>obtained by the third axiom, not by counting: the axiom is what licenses adding the three pieces</>}
                                        ko={<>세는 것이 아니라 셋째 공리로 얻은 값이다. 세 조각을 더해도 된다고 허락하는 것이 그 공리다</>}/>],
                ]}/>
            </Example>
            <Remark title={<T en={<>Why the careful version is needed at all</>}
                              ko={<>조심스러운 정의가 왜 필요한가</>}/>}>
                <T
                    en={<p>
                        Replace the die with a dial: <InlineMath math={"\\Omega = [0, 2\\pi)"}/>, spun so
                        that <InlineMath math={"P([a,b)) = (b-a)/2\\pi"}/>. Now taking{" "}
                        <InlineMath math={"\\mathscr{F}"}/> to be all subsets is <em>impossible</em>:
                        there are subsets of <InlineMath math={"\\Omega"}/> to which no consistent
                        probability can be assigned, so some sets must be disallowed as events. The
                        standard witness is the Cantor set,
                    </p>}
                    ko={<p>
                        주사위 대신 다이얼을 놓아 보자. <InlineMath math={"\\Omega = [0, 2\\pi)"}/>이고{" "}
                        <InlineMath math={"P([a,b)) = (b-a)/2\\pi"}/>가 되도록 돌린다. 이제{" "}
                        <InlineMath math={"\\mathscr{F}"}/>를 모든 부분집합으로 잡는 것은{" "}
                        <em>불가능</em>하다. 일관된 확률을 붙일 수 없는 부분집합이 존재하므로, 어떤
                        집합들은 사건에서 빼야 한다. 표준적인 증인이 Cantor 집합이다.
                    </p>}
                />
                <BlockMath math={"C = \\left\\{ x \\in [0,1] \\;\\Big|\\; x = \\sum_{i=1}^{\\infty} \\frac{\\epsilon_i}{3^i}, \\; \\epsilon_i \\in \\{0, 2\\} \\right\\}"}/>
                <Terms items={[
                    ["C", <T en={<>the numbers in <InlineMath math={"[0,1]"}/> whose base-3 expansion never uses the digit 1: uncountable, yet of total length zero</>}
                             ko={<>3진 전개에 숫자 1이 한 번도 나오지 않는 <InlineMath math={"[0,1]"}/> 안의 수들. 비가산인데 전체 길이는 0이다</>}/>],
                    ["\\epsilon_i", <T en={<>the <InlineMath math={"i"}/>-th base-3 digit, allowed to be 0 or 2 only, which is what removes the open middle third at every stage</>}
                                       ko={<><InlineMath math={"i"}/>번째 3진 자릿수. 0 또는 2만 허용되고, 그것이 매 단계에서 가운데 열린 삼분의 일을 걷어 내는 조항이다</>}/>],
                    ["I_C(x)", <T en={<>the indicator of <InlineMath math={"C"}/>, which has unbounded variation, so <InlineMath math={"\\int_C dx"}/> is not defined as a Riemann or Riemann-Stieltjes integral at all</>}
                                 ko={<><InlineMath math={"C"}/>의 지시 함수. 변동이 유계가 아니라서 <InlineMath math={"\\int_C dx"}/>는 Riemann 적분으로도 Riemann-Stieltjes 적분으로도 아예 정의되지 않는다</>}/>],
                ]}/>
                <T
                    en={<p>
                        So "just integrate the density over the set" fails for this set, and the repair is
                        Lebesgue measure, which is a week of a measure theory course. The working
                        compromise for engineering, and the one used for the rest of this chapter, is to
                        only ever compute probabilities of sets simple enough that a Riemann integral
                        exists: countable disjoint unions of intervals. That is general enough for every
                        robot.
                    </p>}
                    ko={<p>
                        그러니 "집합 위에서 밀도를 적분하면 된다"가 이 집합에서는 통하지 않고, 고치려면
                        Lebesgue 측도가 필요한데 그것만으로 측도론 강의 한 주가 간다. 공학에서 쓰는
                        타협, 그리고 이 장 나머지가 쓰는 타협은 Riemann 적분이 존재할 만큼 단순한
                        집합의 확률만 계산하는 것이다. 구간들의 가산 서로소 합집합이면 된다. 어떤
                        로봇에게도 그 정도면 충분히 넉넉하다.
                    </p>}
                />
            </Remark>
            <Definition n="5.7" title={<T en={<>Probability density</>} ko={<>확률 밀도</>}/>}>
                <T
                    en={<p>
                        A piecewise continuous function{" "}
                        <InlineMath math={"f : \\mathbb{R} \\to [0, \\infty)"}/> is a{" "}
                        <strong>probability density</strong> if it integrates to one. A random variable{" "}
                        <InlineMath math={"X"}/> is <strong>continuous with density{" "}
                        <InlineMath math={"f"}/></strong>, written{" "}
                        <InlineMath math={"X \\sim f"}/>, when
                    </p>}
                    ko={<p>
                        조각별 연속인 함수 <InlineMath math={"f : \\mathbb{R} \\to [0, \\infty)"}/>의
                        적분이 1이면 <strong>확률 밀도</strong>라 한다. 확률 변수{" "}
                        <InlineMath math={"X"}/>가 다음을 만족하면{" "}
                        <strong>밀도 <InlineMath math={"f"}/>를 갖는 연속 확률 변수</strong>라 하고{" "}
                        <InlineMath math={"X \\sim f"}/>로 적는다.
                    </p>}
                />
                <BlockMath math={"\\int_{-\\infty}^{\\infty} f(\\bar{x})\\,d\\bar{x} = 1, \\qquad P(\\{X \\le x\\}) = \\int_{-\\infty}^{x} f(\\bar{x})\\,d\\bar{x} \\quad \\forall\\, x \\in \\mathbb{R}"}/>
                <Terms items={[
                    ["f", <T en={<>the density. It is not a probability: <InlineMath math={"f(x)"}/> can exceed one. Only its integral over a set is a probability</>}
                             ko={<>밀도. 확률이 아니다. <InlineMath math={"f(x)"}/>는 1을 넘을 수 있다. 집합 위에서 적분한 값만이 확률이다</>}/>],
                    ["\\{X \\le x\\}", <T en={<>shorthand for the event <InlineMath math={"\\{\\omega \\in \\Omega \\mid X(\\omega) \\le x\\}"}/>, which the density lets you evaluate without ever looking at <InlineMath math={"\\Omega"}/></>}
                                        ko={<>사건 <InlineMath math={"\\{\\omega \\in \\Omega \\mid X(\\omega) \\le x\\}"}/>의 줄임 표기. 밀도가 있으면 <InlineMath math={"\\Omega"}/>를 한 번도 보지 않고 이 값을 낼 수 있다</>}/>],
                    ["\\bar{x}", <T en={<>the integration variable, kept distinct from the limit <InlineMath math={"x"}/></>}
                                   ko={<>적분 변수. 적분의 끝점 <InlineMath math={"x"}/>와 구별해 둔다</>}/>],
                ]}/>
            </Definition>
            <Example n="5.8" title={<T en={<>Three densities, with numbers</>} ko={<>밀도 셋, 숫자와 함께</>}/>}>
                <BlockMath math={"\\underbrace{f(x) = \\tfrac{1}{b-a} \\text{ on } [a,b]}_{\\text{uniform}}, \\qquad \\underbrace{f(x) = \\tfrac{1}{2b}e^{-|x-\\mu|/b}}_{\\text{Laplace}}, \\qquad \\underbrace{f(x) = \\tfrac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}}_{\\text{Gaussian}}"}/>
                <Terms items={[
                    ["a, b", <T en={<>the endpoints of the uniform density, which is zero outside <InlineMath math={"[a,b]"}/>; the height <InlineMath math={"1/(b-a)"}/> is whatever makes the area one</>}
                               ko={<>균등 밀도의 양 끝. <InlineMath math={"[a,b]"}/> 밖에서는 0이고, 높이 <InlineMath math={"1/(b-a)"}/>는 넓이를 1로 만드는 값일 뿐이다</>}/>],
                    ["b", <T en={<>in the Laplace density, a scale parameter: bigger <InlineMath math={"b"}/> means fatter tails, which is why the 1-norm fit of Chapter 3 is the natural estimator for it</>}
                             ko={<>Laplace 밀도에서는 크기 파라미터다. <InlineMath math={"b"}/>가 클수록 꼬리가 두껍고, 3장의 1-norm 맞춤이 이 밀도에 어울리는 추정인 이유가 그것이다</>}/>],
                    ["\\mu", <T en={<>the mean, the centre of both the Laplace and the Gaussian</>}
                              ko={<>평균. Laplace와 가우시안 모두의 중심이다</>}/>],
                    ["\\sigma", <T en={<>the standard deviation, in the same units as <InlineMath math={"x"}/>, so <InlineMath math={"\\sigma^2"}/> is in squared units</>}
                                  ko={<>표준편차. 단위가 <InlineMath math={"x"}/>와 같으므로 <InlineMath math={"\\sigma^2"}/>의 단위는 제곱이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Concretely, uniform on <InlineMath math={"[2, 5]"}/> has{" "}
                        <InlineMath math={"f \\equiv 1/3"}/> there, so{" "}
                        <InlineMath math={"P(\\{X \\le 3\\}) = \\int_2^3 \\tfrac13 dx = \\tfrac13"}/> and{" "}
                        <InlineMath math={"P(\\{2.9 < X \\le 3.1\\}) = 0.2/3 \\approx 0.0667"}/>. The
                        density value <InlineMath math={"1/3"}/> is not a probability of anything; the
                        two integrals are.
                    </p>}
                    ko={<p>
                        구체적으로, <InlineMath math={"[2, 5]"}/> 위의 균등 분포는 그 구간에서{" "}
                        <InlineMath math={"f \\equiv 1/3"}/>이므로{" "}
                        <InlineMath math={"P(\\{X \\le 3\\}) = \\int_2^3 \\tfrac13 dx = \\tfrac13"}/>이고{" "}
                        <InlineMath math={"P(\\{2.9 < X \\le 3.1\\}) = 0.2/3 \\approx 0.0667"}/>이다.
                        밀도 값 <InlineMath math={"1/3"}/>은 무엇의 확률도 아니다. 확률인 것은 두
                        적분값이다.
                    </p>}
                />
            </Example>
            <Definition n="5.14" title={<T en={<>Moments of a random variable</>} ko={<>확률 변수의 적률</>}/>}>
                <BlockMath math={"\\mu := \\mathcal{E}\\{X\\} = \\int_{-\\infty}^{\\infty} x f(x)\\,dx, \\qquad \\sigma^2 := \\mathcal{E}\\{(X-\\mu)^2\\} = \\int_{-\\infty}^{\\infty} (x-\\mu)^2 f(x)\\,dx"}/>
                <Terms items={[
                    ["\\mu", <T en={<>the mean: the density's centre of mass, and the number a long run of samples averages to</>}
                              ko={<>평균. 밀도의 질량 중심이고, 표본을 길게 뽑아 평균 낸 값이 다가가는 수다</>}/>],
                    ["\\sigma^2", <T en={<>the variance: the mean squared distance from the mean, always non-negative, zero only for a random variable that is not random</>}
                                    ko={<>분산. 평균으로부터의 제곱 거리의 평균이다. 언제나 0 이상이고, 0이 되는 것은 사실 무작위하지 않은 확률 변수뿐이다</>}/>],
                    ["\\sigma", <T en={<>the standard deviation <InlineMath math={"\\sqrt{\\sigma^2}"}/>, quoted instead of the variance because it has the units of the thing measured</>}
                                  ko={<>표준편차 <InlineMath math={"\\sqrt{\\sigma^2}"}/>. 재는 대상과 단위가 같아서 분산 대신 이 값을 말한다</>}/>],
                ]}/>
                <T
                    en={<p>
                        For uniform on <InlineMath math={"[0,1]"}/>:{" "}
                        <InlineMath math={"\\mu = \\int_0^1 x\\,dx = 1/2"}/> and{" "}
                        <InlineMath math={"\\sigma^2 = \\int_0^1 (x - 1/2)^2 dx = 1/12 \\approx 0.0833"}/>,
                        so <InlineMath math={"\\sigma \\approx 0.289"}/>. A uniform random number
                        generator scattered over a unit interval has a standard deviation of under a
                        third of that interval, which is worth remembering when someone models a
                        quantization error.
                    </p>}
                    ko={<p>
                        <InlineMath math={"[0,1]"}/> 위의 균등 분포라면{" "}
                        <InlineMath math={"\\mu = \\int_0^1 x\\,dx = 1/2"}/>이고{" "}
                        <InlineMath math={"\\sigma^2 = \\int_0^1 (x - 1/2)^2 dx = 1/12 \\approx 0.0833"}/>이라{" "}
                        <InlineMath math={"\\sigma \\approx 0.289"}/>다. 단위 구간에 흩뿌려진 균등
                        난수의 표준편차가 그 구간의 삼분의 일도 안 된다는 뜻이고, 누군가 양자화 오차를
                        모델링할 때 기억해 둘 만한 값이다.
                    </p>}
                />
            </Definition>
            <T
                en={<p>
                    Now stack random variables into a vector. Everything above repeats componentwise
                    except the variance, which grows a second index and becomes a matrix.
                </p>}
                ko={<p>
                    이제 확률 변수를 쌓아 벡터로 만든다. 위의 내용은 성분마다 그대로 되풀이되는데,
                    분산 하나만 예외다. 분산은 첨자를 하나 더 얻어 행렬이 된다.
                </p>}
            />
            <Definition n="5.15" title={<T en={<>Random vector and its moments</>} ko={<>확률 벡터와 그 적률</>}/>}>
                <T
                    en={<p>
                        <InlineMath math={"X : \\Omega \\to \\mathbb{R}^p"}/> is a{" "}
                        <strong>random vector</strong> when every component{" "}
                        <InlineMath math={"X_i"}/> is a random variable. Its mean and covariance are
                    </p>}
                    ko={<p>
                        성분 <InlineMath math={"X_i"}/>가 전부 확률 변수일 때{" "}
                        <InlineMath math={"X : \\Omega \\to \\mathbb{R}^p"}/>를{" "}
                        <strong>확률 벡터</strong>라 한다. 평균과 공분산은 다음과 같다.
                    </p>}
                />
                <BlockMath math={"\\mu = \\mathcal{E}\\{X\\} = \\begin{bmatrix} \\mathcal{E}\\{X_1\\} \\\\ \\vdots \\\\ \\mathcal{E}\\{X_p\\}\\end{bmatrix}, \\qquad \\Sigma := \\operatorname{cov}(X) = \\mathcal{E}\\{(X - \\mu)(X-\\mu)^\\top\\}"}/>
                <Terms items={[
                    ["\\mu", <T en={<>a vector in <InlineMath math={"\\mathbb{R}^p"}/>: the expectation is taken one component at a time</>}
                              ko={<><InlineMath math={"\\mathbb{R}^p"}/>의 벡터. 기댓값을 성분마다 하나씩 취한 것이다</>}/>],
                    ["\\Sigma", <T en={<>a <InlineMath math={"p \\times p"}/> matrix, because <InlineMath math={"(X-\\mu)"}/> is <InlineMath math={"p \\times 1"}/> and <InlineMath math={"(X-\\mu)^\\top"}/> is <InlineMath math={"1 \\times p"}/></>}
                                  ko={<><InlineMath math={"p \\times p"}/> 행렬이다. <InlineMath math={"(X-\\mu)"}/>가 <InlineMath math={"p \\times 1"}/>이고 <InlineMath math={"(X-\\mu)^\\top"}/>가 <InlineMath math={"1 \\times p"}/>이기 때문이다</>}/>],
                    ["\\Sigma_{ii}", <T en={<>the variance of <InlineMath math={"X_i"}/> on the diagonal, so the units of the diagonal are squared units</>}
                                       ko={<>대각에 놓이는 <InlineMath math={"X_i"}/>의 분산. 그래서 대각의 단위는 제곱 단위다</>}/>],
                    ["\\Sigma_{ij}", <T en={<>off the diagonal, how <InlineMath math={"X_i"}/> and <InlineMath math={"X_j"}/> move together; zero means they carry no linear information about each other</>}
                                       ko={<>대각 밖의 성분. <InlineMath math={"X_i"}/>와 <InlineMath math={"X_j"}/>가 함께 움직이는 정도다. 0이면 서로에 대한 선형 정보를 전혀 갖고 있지 않다는 뜻이다</>}/>],
                    ["\\operatorname{Var}(X)", <T en={<>defined in the notes as <InlineMath math={"\\operatorname{tr}\\Sigma = \\sum_i \\Sigma_{ii}"}/>, a single number summarizing a whole matrix. This is the quantity BLUE and MVE minimize</>}
                                                 ko={<>교재는 이것을 <InlineMath math={"\\operatorname{tr}\\Sigma = \\sum_i \\Sigma_{ii}"}/>로 정의한다. 행렬 하나를 수 하나로 요약한 값이고, BLUE와 MVE가 최소화하는 대상이 바로 이것이다</>}/>],
                ]}/>
            </Definition>
            <Example title={<T en={<>One specific covariance, and one matrix that is not one</>}
                              ko={<>구체적인 공분산 하나, 그리고 공분산이 아닌 행렬 하나</>}/>}>
                <BlockMath math={"\\Sigma = \\begin{bmatrix} 4 & 2 \\\\ 2 & 2\\end{bmatrix}, \\qquad S = \\begin{bmatrix} 1 & 2 \\\\ 2 & 1 \\end{bmatrix}"}/>
                <Terms items={[
                    ["\\Sigma", <T en={<>a genuine covariance: <InlineMath math={"X_1"}/> has variance 4, <InlineMath math={"X_2"}/> has variance 2, and they are positively correlated</>}
                                  ko={<>진짜 공분산이다. <InlineMath math={"X_1"}/>의 분산이 4, <InlineMath math={"X_2"}/>의 분산이 2이고, 둘은 양의 상관을 갖는다</>}/>],
                    ["S", <T en={<>symmetric but not a covariance: it fails exactly one clause, positive semidefiniteness</>}
                             ko={<>대칭이지만 공분산이 아니다. 조항 하나, positive semidefinite만 정확히 깨진다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The correlation coefficient of <InlineMath math={"\\Sigma"}/> is{" "}
                        <InlineMath math={"\\rho = 2/\\sqrt{4 \\cdot 2} = 1/\\sqrt{2} \\approx 0.707"}/>,
                        its total variance is <InlineMath math={"\\operatorname{tr}\\Sigma = 6"}/>, and{" "}
                        <InlineMath math={"\\det \\Sigma = 8 - 4 = 4 > 0"}/>. For{" "}
                        <InlineMath math={"S"}/>, take <InlineMath math={"v = (1, -1)^\\top"}/>:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\Sigma"}/>의 상관계수는{" "}
                        <InlineMath math={"\\rho = 2/\\sqrt{4 \\cdot 2} = 1/\\sqrt{2} \\approx 0.707"}/>이고,
                        전체 분산은 <InlineMath math={"\\operatorname{tr}\\Sigma = 6"}/>,{" "}
                        <InlineMath math={"\\det \\Sigma = 8 - 4 = 4 > 0"}/>이다.{" "}
                        <InlineMath math={"S"}/>에는 <InlineMath math={"v = (1, -1)^\\top"}/>을 넣어 본다.
                    </p>}
                />
                <BlockMath math={"v^\\top S v = \\begin{bmatrix}1 & -1\\end{bmatrix}\\begin{bmatrix} 1 & 2 \\\\ 2 & 1\\end{bmatrix}\\begin{bmatrix}1 \\\\ -1\\end{bmatrix} = \\begin{bmatrix}1 & -1\\end{bmatrix}\\begin{bmatrix}-1 \\\\ 1\\end{bmatrix} = -2 < 0"}/>
                <Terms items={[
                    ["v^\\top S v", <T en={<>the variance that <InlineMath math={"S"}/> would assign to the scalar random variable <InlineMath math={"v^\\top X = X_1 - X_2"}/></>}
                                      ko={<><InlineMath math={"S"}/>가 스칼라 확률 변수 <InlineMath math={"v^\\top X = X_1 - X_2"}/>에 매기게 되는 분산</>}/>],
                    ["-2", <T en={<>a negative variance, which is meaningless. No random vector has covariance <InlineMath math={"S"}/></>}
                             ko={<>음수 분산이고 그런 것은 없다. 공분산이 <InlineMath math={"S"}/>인 확률 벡터는 존재하지 않는다</>}/>],
                ]}/>
            </Example>
            <Proposition n="5.19" title={<T en={<>Every covariance is positive semidefinite (Exercise 5.19 in the notes)</>}
                                            ko={<>모든 공분산은 positive semidefinite다 (교재에서는 Exercise 5.19)</>}/>}>
                <T
                    en={<p>
                        <InlineMath math={"\\Sigma := \\operatorname{cov}(X)"}/> satisfies{" "}
                        <InlineMath math={"v^\\top \\Sigma v \\ge 0"}/> for every{" "}
                        <InlineMath math={"v \\in \\mathbb{R}^p"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\Sigma := \\operatorname{cov}(X)"}/>는 모든{" "}
                        <InlineMath math={"v \\in \\mathbb{R}^p"}/>에 대해{" "}
                        <InlineMath math={"v^\\top \\Sigma v \\ge 0"}/>를 만족한다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            Push <InlineMath math={"v"}/> inside the expectation, which is legal because{" "}
                            <InlineMath math={"v"}/> is a constant vector, and then notice that what is
                            left is a squared length.
                        </p>}
                        ko={<p>
                            <InlineMath math={"v"}/>를 기댓값 안으로 밀어 넣는다.{" "}
                            <InlineMath math={"v"}/>가 상수 벡터라 허용되는 조작이다. 그러고 나면 남는
                            것이 길이의 제곱이라는 사실이 보인다.
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} v^\\top \\Sigma v &= v^\\top \\mathcal{E}\\{(X-\\mu)(X-\\mu)^\\top\\} v \\\\ &= \\mathcal{E}\\{v^\\top (X-\\mu)(X-\\mu)^\\top v\\} \\\\ &= \\mathcal{E}\\{\\big((X-\\mu)^\\top v\\big)^\\top \\big((X-\\mu)^\\top v\\big)\\} \\\\ &= \\mathcal{E}\\{\\|(X-\\mu)^\\top v\\|^2\\} \\\\ &= \\int_{\\mathbb{R}^p} \\|(x-\\mu)^\\top v\\|^2 f_X(x)\\,dx \\;\\ge\\; 0 \\end{aligned}"}/>
                    <Terms items={[
                        ["v^\\top(X-\\mu)", <T en={<>a scalar, so it equals its own transpose <InlineMath math={"(X-\\mu)^\\top v"}/>; that identity is the whole third line</>}
                                              ko={<>스칼라라서 자기 transpose <InlineMath math={"(X-\\mu)^\\top v"}/>와 같다. 셋째 줄은 그 사실이 전부다</>}/>],
                        ["\\|\\cdot\\|^2", <T en={<>a squared norm, non-negative pointwise</>}
                                             ko={<>norm의 제곱. 점마다 0 이상이다</>}/>],
                        ["f_X \\ge 0", <T en={<>a density is non-negative, so the integrand is non-negative, so the integral is non-negative</>}
                                         ko={<>밀도는 0 이상이므로 피적분 함수가 0 이상이고, 따라서 적분도 0 이상이다</>}/>],
                    ]}/>
                </Proof>
            </Proposition>
            <Definition n="5.20" title={<T en={<>Information matrix</>} ko={<>정보 행렬</>}/>}>
                <T
                    en={<p>
                        If <InlineMath math={"\\Sigma > 0"}/>, then{" "}
                        <InlineMath math={"\\Lambda := \\Sigma^{-1}"}/> is the{" "}
                        <strong>information matrix</strong>. High variance means low information and low
                        variance means high information, which is exactly the relation an inverse
                        encodes. For the example above,
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\Sigma > 0"}/>이면{" "}
                        <InlineMath math={"\\Lambda := \\Sigma^{-1}"}/>를 <strong>정보 행렬</strong>이라
                        한다. 분산이 크면 정보가 적고 분산이 작으면 정보가 많다는 관계인데, 역행렬이
                        담아내는 관계가 정확히 그것이다. 위 예제라면 이렇게 된다.
                    </p>}
                />
                <BlockMath math={"\\Sigma = \\begin{bmatrix} 4 & 2 \\\\ 2 & 2\\end{bmatrix} \\quad\\Longrightarrow\\quad \\Lambda = \\Sigma^{-1} = \\frac{1}{4}\\begin{bmatrix} 2 & -2 \\\\ -2 & 4 \\end{bmatrix} = \\begin{bmatrix} 0.5 & -0.5 \\\\ -0.5 & 1 \\end{bmatrix}"}/>
                <Terms items={[
                    ["\\Lambda", <T en={<>the information matrix, also called the precision matrix. Adding independent measurements adds information matrices, which is why it reappears at the end of this chapter</>}
                                   ko={<>정보 행렬. precision 행렬이라고도 한다. 독립인 측정을 더하는 일이 정보 행렬을 더하는 일이 되고, 이 장 끝에서 다시 등장하는 이유가 그것이다</>}/>],
                    ["1/4", <T en={<><InlineMath math={"1/\\det\\Sigma"}/>, the usual <InlineMath math={"2\\times 2"}/> inverse formula</>}
                              ko={<><InlineMath math={"1/\\det\\Sigma"}/>. 늘 쓰는 <InlineMath math={"2\\times 2"}/> 역행렬 공식이다</>}/>],
                    ["\\Lambda_{12} = -0.5", <T en={<>negative although <InlineMath math={"\\Sigma_{12}"}/> is positive: the signs of the two matrices carry different meanings and should never be read as the same thing</>}
                                               ko={<><InlineMath math={"\\Sigma_{12}"}/>는 양수인데 이쪽은 음수다. 두 행렬의 부호는 서로 다른 것을 뜻하므로 같은 것으로 읽으면 안 된다</>}/>],
                ]}/>
            </Definition>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Best Linear Unbiased Estimator (BLUE)</h2>}
               ko={<h2>Best Linear Unbiased Estimator (BLUE)</h2>}/>
            <T
                en={<p>
                    The first estimator assumes as little as possible. There is an unknown{" "}
                    <InlineMath math={"x"}/>, it is a <em>deterministic</em> vector and not a random one,
                    and the only random thing in the problem is the measurement noise. Read the model
                    carefully: <InlineMath math={"y"}/> is random because{" "}
                    <InlineMath math={"\\varepsilon"}/> is, while <InlineMath math={"x"}/> is just a
                    number nobody knows.
                </p>}
                ko={<p>
                    첫 번째 추정기는 가정을 최대한 적게 한다. 알려지지 않은{" "}
                    <InlineMath math={"x"}/>가 있는데 그것은 확률 벡터가 아니라{" "}
                    <em>결정론적</em> 벡터이고, 이 문제에서 무작위한 것은 측정 잡음뿐이다. 모델을
                    조심해서 읽어야 한다. <InlineMath math={"\\varepsilon"}/>이 무작위라{" "}
                    <InlineMath math={"y"}/>도 무작위이지만, <InlineMath math={"x"}/>는 아무도 모르는
                    수일 뿐이다.
                </p>}
            />
            <BlockMath math={"y = Cx + \\varepsilon, \\qquad \\mathcal{E}\\{\\varepsilon\\} = 0, \\qquad \\operatorname{cov}(\\varepsilon) = \\mathcal{E}\\{\\varepsilon\\varepsilon^\\top\\} = Q > 0, \\qquad \\operatorname{rank} C = n"}/>
            <Terms items={[
                ["Q > 0", <T en={<>the noise covariance, assumed invertible: no measurement is noise free, which is what makes <InlineMath math={"Q^{-1}"}/> exist</>}
                            ko={<>잡음의 공분산이고 가역이라 가정한다. 잡음이 전혀 없는 측정은 없다는 뜻이고, 그래서 <InlineMath math={"Q^{-1}"}/>가 존재한다</>}/>],
                ["\\operatorname{rank} C = n", <T en={<>the columns of <InlineMath math={"C"}/> are independent, so <InlineMath math={"m \\ge n"}/>: at least as many measurements as unknowns</>}
                                                 ko={<><InlineMath math={"C"}/>의 열이 독립이라는 뜻이라 <InlineMath math={"m \\ge n"}/>이다. 미지수만큼은 측정이 있어야 한다</>}/>],
                ["x", <T en={<>deterministic and unknown. It has no density, no mean, and no covariance, and that single assumption is the entire difference between this section and the next</>}
                         ko={<>결정론적이고 알려지지 않은 값이다. 밀도도 평균도 공분산도 없다. 이 가정 하나가 이 절과 다음 절의 차이 전부다</>}/>],
            ]}/>
            <T
                en={<p>The estimate has to satisfy three requirements, and the name spells them out.</p>}
                ko={<p>추정은 요구 조건 셋을 만족해야 하고, 이름이 그 셋을 그대로 적어 놓았다.</p>}
            />
            <BlockMath math={"\\underbrace{\\hat{x} = Ky}_{\\textbf{Linear}}, \\qquad \\underbrace{\\mathcal{E}\\{\\hat{x} - x\\} = 0 \\;\\; \\forall\\, x \\in \\mathbb{R}^n}_{\\textbf{Unbiased}}, \\qquad \\underbrace{\\min_K \\; \\mathcal{E}\\{(\\hat{x}-x)^\\top(\\hat{x}-x)\\}}_{\\textbf{Best}}"}/>
            <Terms items={[
                ["K", <T en={<>an <InlineMath math={"n \\times m"}/> matrix, the only thing being designed. The estimator <em>is</em> the matrix</>}
                         ko={<><InlineMath math={"n \\times m"}/> 행렬이고, 설계 대상은 이것 하나뿐이다. 추정기가 곧 이 행렬<em>이다</em></>}/>],
                ["\\forall\\, x", <T en={<>unbiasedness has to hold for every possible <InlineMath math={"x"}/>, because <InlineMath math={"x"}/> is unknown: an estimator tuned to one value of <InlineMath math={"x"}/> is not an estimator</>}
                                    ko={<><InlineMath math={"x"}/>가 알려지지 않았으므로 unbiased는 가능한 모든 <InlineMath math={"x"}/>에 대해 성립해야 한다. 특정 <InlineMath math={"x"}/> 값에 맞춰 놓은 추정기는 추정기가 아니다</>}/>],
                ["\\mathcal{E}\\{(\\hat{x}-x)^\\top(\\hat{x}-x)\\}", <T en={<>the total error variance <InlineMath math={"\\sum_{i=1}^n \\mathcal{E}\\{|\\hat{x}_i - x_i|^2\\}"}/>, one scalar to minimize</>}
                                                                       ko={<>전체 오차 분산 <InlineMath math={"\\sum_{i=1}^n \\mathcal{E}\\{|\\hat{x}_i - x_i|^2\\}"}/>. 최소화할 스칼라 하나다</>}/>],
            ]}/>
            <Lemma n="5.21" title={<T en={<>Unbiased is exactly <InlineMath math={"KC = I"}/> (Claim 5.21 in the notes)</>}
                                      ko={<>unbiased는 정확히 <InlineMath math={"KC = I"}/>다 (교재에서는 Claim 5.21)</>}/>}>
                <T
                    en={<p>
                        A linear estimate <InlineMath math={"\\hat{x} = Ky"}/> is unbiased for all{" "}
                        <InlineMath math={"x \\in \\mathbb{R}^n"}/> if and only if{" "}
                        <InlineMath math={"KC = I"}/>.
                    </p>}
                    ko={<p>
                        선형 추정 <InlineMath math={"\\hat{x} = Ky"}/>가 모든{" "}
                        <InlineMath math={"x \\in \\mathbb{R}^n"}/>에 대해 unbiased인 것은{" "}
                        <InlineMath math={"KC = I"}/>와 동치다.
                    </p>}
                />
                <Proof>
                    <BlockMath math={"\\begin{aligned} 0 = \\mathcal{E}\\{\\hat{x} - x\\} \\;\\forall x &\\iff 0 = \\mathcal{E}\\{Ky - x\\} \\;\\forall x \\\\ &\\iff 0 = \\mathcal{E}\\{K(Cx + \\varepsilon) - x\\} \\;\\forall x \\\\ &\\iff 0 = \\mathcal{E}\\{(KC - I)x\\} - \\mathcal{E}\\{K\\varepsilon\\} \\;\\forall x \\\\ &\\iff 0 = (KC - I)x \\;\\forall x \\end{aligned}"}/>
                    <Terms items={[
                        ["\\mathcal{E}\\{K\\varepsilon\\} = 0", <T en={<>because <InlineMath math={"\\mathcal{E}\\{\\varepsilon\\} = 0"}/> and <InlineMath math={"K"}/> is constant. This is where the zero mean assumption is spent</>}
                                                                 ko={<><InlineMath math={"\\mathcal{E}\\{\\varepsilon\\} = 0"}/>이고 <InlineMath math={"K"}/>가 상수이기 때문이다. 평균이 0이라는 가정을 쓰는 자리가 여기다</>}/>],
                        ["\\mathcal{E}\\{(KC-I)x\\} = (KC-I)x", <T en={<>because <InlineMath math={"x"}/> is deterministic, so the expectation passes over it unchanged</>}
                                                                  ko={<><InlineMath math={"x"}/>가 결정론적이라 기댓값이 그대로 통과하기 때문이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The last line says the matrix <InlineMath math={"KC - I"}/> kills every vector
                            in <InlineMath math={"\\mathbb{R}^n"}/>. The notes finish in one step; here
                            is the step. Take <InlineMath math={"x = e^i"}/>, the{" "}
                            <InlineMath math={"i"}/>-th standard basis vector. Then{" "}
                            <InlineMath math={"(KC - I)e^i"}/> is the <InlineMath math={"i"}/>-th{" "}
                            <em>column</em> of <InlineMath math={"KC - I"}/>, and it is zero. Doing this
                            for <InlineMath math={"i = 1, \\ldots, n"}/> zeroes every column, so{" "}
                            <InlineMath math={"KC - I = 0_{n \\times n}"}/>.
                        </p>}
                        ko={<p>
                            마지막 줄은 행렬 <InlineMath math={"KC - I"}/>가{" "}
                            <InlineMath math={"\\mathbb{R}^n"}/>의 모든 벡터를 죽인다는 말이다. 교재는
                            한 걸음에 끝내는데, 그 한 걸음이 이것이다. 표준 기저 벡터{" "}
                            <InlineMath math={"x = e^i"}/>를 넣으면{" "}
                            <InlineMath math={"(KC - I)e^i"}/>는 <InlineMath math={"KC - I"}/>의{" "}
                            <InlineMath math={"i"}/>번째 <em>열</em>이고 그것이 0이다.{" "}
                            <InlineMath math={"i = 1, \\ldots, n"}/>에 대해 되풀이하면 모든 열이 0이
                            되므로 <InlineMath math={"KC - I = 0_{n \\times n}"}/>이다.
                        </p>}
                    />
                </Proof>
            </Lemma>
            <T
                en={<p>
                    With the constraint identified, the cost collapses. Expand{" "}
                    <InlineMath math={"\\hat{x} - x = KCx - x + K\\varepsilon"}/> and use the aside that{" "}
                    <InlineMath math={"(v + w)^\\top(v+w) = v^\\top v + w^\\top w + 2v^\\top w"}/>, valid
                    because <InlineMath math={"v^\\top w"}/> is a scalar:
                </p>}
                ko={<p>
                    제약을 알아냈으니 비용이 주저앉는다.{" "}
                    <InlineMath math={"\\hat{x} - x = KCx - x + K\\varepsilon"}/>으로 펼치고,{" "}
                    <InlineMath math={"v^\\top w"}/>가 스칼라라서 성립하는{" "}
                    <InlineMath math={"(v + w)^\\top(v+w) = v^\\top v + w^\\top w + 2v^\\top w"}/>를 쓴다.
                </p>}
            />
            <BlockMath math={"\\begin{aligned} \\mathcal{E}\\{(\\hat{x}-x)^\\top(\\hat{x}-x)\\} &= \\mathcal{E}\\{x^\\top(KC-I)^\\top(KC-I)x + 2(K\\varepsilon)^\\top(KC-I)x + \\varepsilon^\\top K^\\top K \\varepsilon\\} \\\\ &= \\mathcal{E}\\{\\varepsilon^\\top K^\\top K\\varepsilon\\} \\\\ &= \\operatorname{tr}\\mathcal{E}\\{K\\varepsilon\\varepsilon^\\top K^\\top\\} = \\operatorname{tr}(KQK^\\top)\\end{aligned}"}/>
            <Terms items={[
                ["(KC - I)x = 0", <T en={<>by Lemma 5.21, so the first term vanishes identically and the middle term loses its right factor</>}
                                    ko={<>Lemma 5.21에 의해 0이다. 그래서 첫 항은 통째로 사라지고 가운데 항은 오른쪽 인자를 잃는다</>}/>],
                ["\\operatorname{tr}", <T en={<>the trace, used because <InlineMath math={"\\varepsilon^\\top K^\\top K \\varepsilon"}/> is a scalar and <InlineMath math={"\\operatorname{tr}(AB) = \\operatorname{tr}(BA)"}/> moves the <InlineMath math={"\\varepsilon"}/> factors together</>}
                                         ko={<>trace. <InlineMath math={"\\varepsilon^\\top K^\\top K \\varepsilon"}/>이 스칼라이고 <InlineMath math={"\\operatorname{tr}(AB) = \\operatorname{tr}(BA)"}/>가 <InlineMath math={"\\varepsilon"}/> 인자 둘을 나란히 붙여 주기 때문에 쓴다</>}/>],
                ["\\operatorname{tr}(KQK^\\top)", <T en={<>the cost, now a function of <InlineMath math={"K"}/> alone: the unknown <InlineMath math={"x"}/> has left the problem entirely</>}
                                                    ko={<>이제 <InlineMath math={"K"}/>만의 함수가 된 비용. 알려지지 않은 <InlineMath math={"x"}/>는 문제에서 완전히 빠져나갔다</>}/>],
            ]}/>
            <T
                en={<p>
                    Partition <InlineMath math={"K"}/> into rows{" "}
                    <InlineMath math={"k_1, \\ldots, k_n"}/>. Then{" "}
                    <InlineMath math={"\\operatorname{tr}(KQK^\\top) = \\sum_{i=1}^n k_i Q k_i^\\top"}/>{" "}
                    and, transposing the constraint,{" "}
                    <InlineMath math={"KC = I \\iff C^\\top k_i^\\top = e^i"}/> for each{" "}
                    <InlineMath math={"i"}/>. So one <InlineMath math={"n \\times m"}/> design problem is
                    really <InlineMath math={"n"}/> separate ones, each of them a minimum norm problem
                    with an <em>underdetermined</em> constraint. Chapter 3 solved exactly that:
                </p>}
                ko={<p>
                    <InlineMath math={"K"}/>를 행 <InlineMath math={"k_1, \\ldots, k_n"}/>으로 쪼갠다.
                    그러면{" "}
                    <InlineMath math={"\\operatorname{tr}(KQK^\\top) = \\sum_{i=1}^n k_i Q k_i^\\top"}/>이고,
                    제약을 transpose하면 각 <InlineMath math={"i"}/>에 대해{" "}
                    <InlineMath math={"KC = I \\iff C^\\top k_i^\\top = e^i"}/>다. 그러니{" "}
                    <InlineMath math={"n \\times m"}/> 설계 문제 하나가 실은{" "}
                    <InlineMath math={"n"}/>개의 별개 문제이고, 각각이{" "}
                    <em>underdetermined</em> 제약을 가진 최소 norm 문제다. 3장이 푼 것이 정확히
                    그것이다.
                </p>}
            />
            <BlockMath math={"\\hat{k}_i^\\top = \\underset{C^\\top k_i^\\top = e^i}{\\arg\\min}\\; k_i Q k_i^\\top = Q^{-1}C\\left(C^\\top Q^{-1} C\\right)^{-1} e^i \\qquad\\Longrightarrow\\qquad \\hat{K}^\\top = Q^{-1}C\\left(C^\\top Q^{-1}C\\right)^{-1}"}/>
            <Terms items={[
                ["k_i", <T en={<>the <InlineMath math={"i"}/>-th row of <InlineMath math={"K"}/>, a <InlineMath math={"1 \\times m"}/> vector, so <InlineMath math={"k_i^\\top"}/> is a column</>}
                           ko={<><InlineMath math={"K"}/>의 <InlineMath math={"i"}/>번째 행이고 <InlineMath math={"1 \\times m"}/> 벡터다. 그래서 <InlineMath math={"k_i^\\top"}/>는 열이다</>}/>],
                ["k_i Q k_i^\\top", <T en={<>the squared length of <InlineMath math={"k_i^\\top"}/> in the norm weighted by <InlineMath math={"Q"}/>, which is what makes the minimum norm formula apply</>}
                                      ko={<><InlineMath math={"Q"}/>로 가중된 norm에서 잰 <InlineMath math={"k_i^\\top"}/>의 길이 제곱. 최소 norm 공식이 적용되는 이유가 이것이다</>}/>],
                ["e^i", <T en={<>the <InlineMath math={"i"}/>-th standard basis vector, appearing because the <InlineMath math={"i"}/>-th row of <InlineMath math={"KC"}/> must be the <InlineMath math={"i"}/>-th row of the identity</>}
                           ko={<><InlineMath math={"i"}/>번째 표준 기저 벡터. <InlineMath math={"KC"}/>의 <InlineMath math={"i"}/>번째 행이 항등 행렬의 <InlineMath math={"i"}/>번째 행이어야 해서 등장한다</>}/>],
            ]}/>
            <Theorem n="5.22" title={<T en={<>BLUE</>} ko={<>BLUE</>}/>}>
                <T
                    en={<p>
                        Under the model above, the best linear unbiased estimator is{" "}
                        <InlineMath math={"\\hat{x} = \\hat{K}y"}/> with
                    </p>}
                    ko={<p>
                        위 모델에서 best linear unbiased estimator는{" "}
                        <InlineMath math={"\\hat{x} = \\hat{K}y"}/>이고 다음이 성립한다.
                    </p>}
                />
                <BlockMath math={"\\hat{K} = \\left(C^\\top Q^{-1} C\\right)^{-1} C^\\top Q^{-1}, \\qquad \\mathcal{E}\\{(\\hat{x}-x)(\\hat{x}-x)^\\top\\} = \\left(C^\\top Q^{-1}C\\right)^{-1}"}/>
                <Terms items={[
                    ["\\hat{K}", <T en={<>the gain. Note it is the weighted pseudo-inverse of <InlineMath math={"C"}/> with weight <InlineMath math={"Q^{-1}"}/></>}
                                   ko={<>이득. <InlineMath math={"Q^{-1}"}/>을 가중치로 쓴 <InlineMath math={"C"}/>의 가중 유사역행렬이라는 점을 눈여겨볼 만하다</>}/>],
                    ["(C^\\top Q^{-1} C)^{-1}", <T en={<>the error covariance, an <InlineMath math={"n \\times n"}/> matrix. Its inverse <InlineMath math={"C^\\top Q^{-1}C"}/> is the information the measurements carry about <InlineMath math={"x"}/></>}
                                                  ko={<>오차 공분산이고 <InlineMath math={"n \\times n"}/> 행렬이다. 그 역행렬 <InlineMath math={"C^\\top Q^{-1}C"}/>가 측정이 <InlineMath math={"x"}/>에 대해 갖고 있는 정보다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            The gain was derived above; only the error covariance is left. Because{" "}
                            <InlineMath math={"KC = I"}/>, the error is pure noise:
                        </p>}
                        ko={<p>
                            이득은 위에서 유도했고 남은 것은 오차 공분산뿐이다.{" "}
                            <InlineMath math={"KC = I"}/>이므로 오차는 순수한 잡음이다.
                        </p>}
                    />
                    <BlockMath math={"\\hat{x} - x = Ky - x = KCx + K\\varepsilon - x = K\\varepsilon"}/>
                    <Terms items={[
                        ["K\\varepsilon", <T en={<>the entire error: an unbiased linear estimator's error is the noise seen through the gain, nothing else</>}
                                            ko={<>오차의 전부. unbiased 선형 추정기의 오차는 이득을 통과한 잡음이고 그 밖에는 아무것도 없다</>}/>],
                    ]}/>
                    <BlockMath math={"\\begin{aligned} \\mathcal{E}\\{(\\hat{x}-x)(\\hat{x}-x)^\\top\\} &= \\mathcal{E}\\{K\\varepsilon\\varepsilon^\\top K^\\top\\} = KQK^\\top \\\\ &= \\left(C^\\top Q^{-1}C\\right)^{-1} C^\\top Q^{-1} \\, Q \\, Q^{-1} C \\left(C^\\top Q^{-1}C\\right)^{-1} \\\\ &= \\left(C^\\top Q^{-1}C\\right)^{-1} \\left[C^\\top Q^{-1}C\\right] \\left(C^\\top Q^{-1}C\\right)^{-1} \\\\ &= \\left(C^\\top Q^{-1}C\\right)^{-1}\\end{aligned}"}/>
                    <Terms items={[
                        ["Q^{-1}QQ^{-1} = Q^{-1}", <T en={<>the middle collapse, which is why the answer is so clean</>}
                                                     ko={<>가운데가 접히는 자리. 답이 이렇게 깔끔한 이유다</>}/>],
                    ]}/>
                </Proof>
            </Theorem>
            <Remark n="5.23" title={<T en={<>This is weighted least squares</>} ko={<>이것이 가중 최소제곱이다</>}/>}>
                <T
                    en={<ul>
                        <li>BLUE and weighted least squares are <strong>identical</strong> when the
                            weight is <InlineMath math={"W = Q^{-1}"}/>, the information matrix of the
                            noise.</li>
                        <li>Turned around: if you solve a least squares problem with{" "}
                            <InlineMath math={"W > 0"}/>, you have <em>already</em> assumed the
                            measurement noise has zero mean and covariance{" "}
                            <InlineMath math={"Q = W^{-1}"}/>, whether you meant to or not.</li>
                        <li>A large entry of <InlineMath math={"Q"}/> means an uncertain measurement, and{" "}
                            <InlineMath math={"W = Q^{-1}"}/> then weights that component down. The
                            weighting people pick by feel is the one the noise model prescribes.</li>
                        <li>Weighted least squares came from <em>over</em>determined systems, but
                            deriving BLUE needed the <em>under</em>determined minimum norm solution. The
                            two halves of Chapter 3 meet here.</li>
                    </ul>}
                    ko={<ul>
                        <li>가중치를 잡음의 정보 행렬 <InlineMath math={"W = Q^{-1}"}/>로 잡으면 BLUE와
                            가중 최소제곱은 <strong>같은 것</strong>이다.</li>
                        <li>뒤집어 말하면, <InlineMath math={"W > 0"}/>으로 최소제곱을 푸는 사람은
                            의도했든 아니든 측정 잡음의 평균이 0이고 공분산이{" "}
                            <InlineMath math={"Q = W^{-1}"}/>이라고 <em>이미</em> 가정한 것이다.</li>
                        <li><InlineMath math={"Q"}/>의 성분이 크다는 것은 그 측정이 불확실하다는
                            뜻이고, <InlineMath math={"W = Q^{-1}"}/>은 그 성분의 가중치를 낮춘다.
                            사람들이 감으로 잡는 가중치가 실은 잡음 모델이 지정해 주는 값이다.</li>
                        <li>가중 최소제곱은 <em>over</em>determined 계에서 나왔는데 BLUE를 유도하는
                            데에는 <em>under</em>determined 최소 norm 해가 필요했다. 3장의 두 반쪽이
                            여기서 만난다.</li>
                    </ul>}
                />
            </Remark>
            <Example title={<T en={<>Two sensors, one number</>} ko={<>센서 둘, 수 하나</>}/>}>
                <T
                    en={<p>
                        A single scalar <InlineMath math={"x"}/> is measured twice, by a good sensor and
                        a bad one. Take
                    </p>}
                    ko={<p>
                        스칼라 <InlineMath math={"x"}/> 하나를 좋은 센서와 나쁜 센서로 두 번 잰다.
                        이렇게 두자.
                    </p>}
                />
                <BlockMath math={"C = \\begin{bmatrix}1\\\\1\\end{bmatrix}, \\qquad Q = \\begin{bmatrix}1 & 0\\\\ 0 & 4\\end{bmatrix}, \\qquad Q^{-1} = \\begin{bmatrix}1 & 0\\\\ 0 & \\tfrac14\\end{bmatrix}"}/>
                <Terms items={[
                    ["C = (1,1)^\\top", <T en={<>both sensors measure the same quantity directly</>}
                                          ko={<>두 센서가 같은 값을 직접 잰다</>}/>],
                    ["Q", <T en={<>diagonal, so the two noises are uncorrelated; the second sensor has four times the variance, meaning twice the standard deviation</>}
                             ko={<>대각이라 두 잡음은 무상관이다. 둘째 센서는 분산이 네 배이고, 표준편차로는 두 배라는 뜻이다</>}/>],
                ]}/>
                <BlockMath math={"\\begin{aligned} C^\\top Q^{-1} C &= 1 + \\tfrac14 = \\tfrac54 \\\\[2pt] \\hat{K} &= \\left(\\tfrac54\\right)^{-1}\\begin{bmatrix}1 & \\tfrac14\\end{bmatrix} = \\begin{bmatrix}\\tfrac45 & \\tfrac15\\end{bmatrix} = \\begin{bmatrix}0.8 & 0.2\\end{bmatrix} \\\\[2pt] \\hat{x} &= 0.8\\,y_1 + 0.2\\,y_2, \\qquad \\operatorname{cov}(\\hat{x} - x) = \\tfrac45 = 0.8\\end{aligned}"}/>
                <Terms items={[
                    ["0.8, 0.2", <T en={<>the weights, in the ratio <InlineMath math={"1 : \\tfrac14"}/>, which is the ratio of the inverse variances. Four times the variance buys a quarter of the vote</>}
                                   ko={<>가중치. 비가 <InlineMath math={"1 : \\tfrac14"}/>인데 이것이 분산 역수의 비다. 분산이 네 배면 발언권은 사분의 일이다</>}/>],
                    ["0.8", <T en={<>the error variance, smaller than the good sensor's own variance of 1. Even a bad measurement adds information, as long as its noise is independent</>}
                              ko={<>오차 분산. 좋은 센서 하나의 분산 1보다도 작다. 잡음이 독립이기만 하면 나쁜 측정도 정보를 보탠다</>}/>],
                    ["y_1, y_2", <T en={<>the two readings. If the bad sensor is deleted entirely the variance is 1, and if the good one is deleted it is 4</>}
                                   ko={<>두 판독값. 나쁜 센서를 아예 버리면 분산이 1이고, 좋은 센서를 버리면 4다</>}/>],
                ]}/>
            </Example>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Minimum Variance Estimator (MVE)</h2>}
               ko={<h2>Minimum Variance Estimator (MVE)</h2>}/>
            <T
                en={<p>
                    Now change exactly one assumption. Let <InlineMath math={"x"}/> be a random vector
                    too, with a known covariance, uncorrelated with the noise. Every robot has this
                    information and throws it away at its peril: a wheel radius is known to be near its
                    nominal value, a robot is known to be somewhere in the building.
                </p>}
                ko={<p>
                    이제 가정을 정확히 하나만 바꾼다. <InlineMath math={"x"}/>도 확률 벡터로 두고,
                    공분산을 알고 있으며 잡음과 무상관이라 하자. 어떤 로봇이든 이 정보를 갖고 있고,
                    그것을 버리는 데에는 대가가 따른다. 바퀴 반지름이 공칭값 근처라는 것도, 로봇이
                    건물 안 어딘가에 있다는 것도 알려진 사실이다.
                </p>}
            />
            <BlockMath math={"\\begin{aligned} y &= Cx + \\varepsilon \\\\ \\mathcal{E}\\{x\\} &= 0, \\quad \\mathcal{E}\\{\\varepsilon\\} = 0 \\\\ \\mathcal{E}\\{xx^\\top\\} &= P, \\quad \\mathcal{E}\\{\\varepsilon\\varepsilon^\\top\\} = Q, \\quad \\mathcal{E}\\{\\varepsilon x^\\top\\} = 0 \\end{aligned}"}/>
            <Terms items={[
                ["P", <T en={<>the prior covariance of <InlineMath math={"x"}/>: what you believed about <InlineMath math={"x"}/> before any measurement arrived</>}
                         ko={<><InlineMath math={"x"}/>의 사전 공분산. 측정이 도착하기 전에 <InlineMath math={"x"}/>에 대해 믿고 있던 것이다</>}/>],
                ["\\mathcal{E}\\{\\varepsilon x^\\top\\} = 0", <T en={<>state and noise are uncorrelated. Uncorrelated does <em>not</em> mean independent in general, but for Gaussians it does</>}
                                                                ko={<>상태와 잡음이 무상관이다. 일반적으로 무상관은 독립을 뜻하지 <em>않지만</em> 가우시안에서는 뜻한다</>}/>],
                ["CPC^\\top + Q > 0", <T en={<>the standing assumption. It is implied by <InlineMath math={"Q > 0"}/>, and it is weaker: with it, <InlineMath math={"C"}/> need not have independent columns and may even be zero</>}
                                        ko={<>계속 유지되는 가정. <InlineMath math={"Q > 0"}/>이면 따라 나오고, 그보다 약하다. 이 가정만 있으면 <InlineMath math={"C"}/>의 열이 독립일 필요가 없고 <InlineMath math={"C"}/>가 0이어도 된다</>}/>],
            ]}/>
            <Remark n="5.25" title={<T en={<>The unbiasedness constraint evaporates</>}
                                       ko={<>unbiased 제약이 사라진다</>}/>}>
                <T
                    en={<p>
                        Any linear estimate is automatically unbiased now, with no constraint imposed at
                        all:
                    </p>}
                    ko={<p>
                        이제 어떤 선형 추정이든 아무 제약 없이 저절로 unbiased가 된다.
                    </p>}
                />
                <BlockMath math={"\\mathcal{E}\\{\\hat{x} - x\\} = \\mathcal{E}\\{Ky - x\\} = \\mathcal{E}\\{KCx + K\\varepsilon - x\\} = (KC - I)\\underbrace{\\mathcal{E}\\{x\\}}_{= \\,0} + K\\underbrace{\\mathcal{E}\\{\\varepsilon\\}}_{=\\, 0} = 0"}/>
                <Terms items={[
                    ["\\mathcal{E}\\{x\\} = 0", <T en={<>the new assumption. In BLUE this expectation was <InlineMath math={"x"}/> itself, an unknown non-zero vector, which is why <InlineMath math={"KC = I"}/> had to be forced</>}
                                                  ko={<>새로 들어온 가정. BLUE에서는 이 기댓값이 <InlineMath math={"x"}/> 자신, 곧 0이 아닌 미지의 벡터였고, 그래서 <InlineMath math={"KC = I"}/>를 강제해야 했다</>}/>],
                    ["KC \\ne I", <T en={<>allowed here. MVE will exploit this freedom to shrink the estimate towards the prior mean, which BLUE was forbidden to do</>}
                                    ko={<>여기서는 허용된다. MVE는 이 자유를 써서 추정을 사전 평균 쪽으로 당기는데, BLUE에게는 금지되어 있던 일이다</>}/>],
                ]}/>
            </Remark>
            <T
                en={<p>
                    The derivation is the prettiest argument in the chapter. Components of random vectors
                    are random variables, and random variables are functions, so they can be the vectors
                    of a vector space. Define
                </p>}
                ko={<p>
                    유도 과정은 이 장에서 가장 예쁜 논증이다. 확률 벡터의 성분은 확률 변수이고 확률
                    변수는 함수이므로, 그것들을 벡터 공간의 벡터로 삼을 수 있다. 이렇게 정의한다.
                </p>}
            />
            <BlockMath math={"\\mathcal{X} = \\operatorname{span}\\{x_1, \\ldots, x_n, \\varepsilon_1, \\ldots, \\varepsilon_m\\}, \\qquad \\langle z_1, z_2 \\rangle := \\mathcal{E}\\{z_1 z_2\\}"}/>
            <Terms items={[
                ["\\mathcal{X}", <T en={<>a vector space over <InlineMath math={"\\mathbb{R}"}/> whose vectors are random variables, not columns of numbers</>}
                                   ko={<><InlineMath math={"\\mathbb{R}"}/> 위의 벡터 공간이고, 그 벡터는 수의 열이 아니라 확률 변수다</>}/>],
                ["\\langle z_1, z_2\\rangle", <T en={<>the inner product. It is bilinear, symmetric, and <InlineMath math={"\\langle z,z\\rangle = \\mathcal{E}\\{z^2\\} \\ge 0"}/>, so it satisfies Chapter 3's axioms</>}
                                                ko={<>내적. 쌍선형이고 대칭이며 <InlineMath math={"\\langle z,z\\rangle = \\mathcal{E}\\{z^2\\} \\ge 0"}/>이므로 3장의 공리를 만족한다</>}/>],
                ["\\|z\\|^2 = \\operatorname{var}(z)", <T en={<>because every <InlineMath math={"z \\in \\mathcal{X}"}/> has <InlineMath math={"\\mathcal{E}\\{z\\} = 0"}/>. <strong>Length in this space is standard deviation.</strong> Minimizing variance <em>is</em> minimizing distance</>}
                                                         ko={<>모든 <InlineMath math={"z \\in \\mathcal{X}"}/>가 <InlineMath math={"\\mathcal{E}\\{z\\} = 0"}/>이기 때문이다. <strong>이 공간에서 길이는 표준편차다.</strong> 분산을 최소화하는 일이 곧 거리를 최소화하는 일<em>이다</em></>}/>],
            ]}/>
            <T
                en={<p>
                    With that one definition, the projection theorem of Chapter 3 applies verbatim.
                    Let <InlineMath math={"M = \\operatorname{span}\\{y_1, \\ldots, y_m\\} \\subset \\mathcal{X}"}/>{" "}
                    be the subspace spanned by the measurements. Then the minimum variance estimate of{" "}
                    <InlineMath math={"x_i"}/> is the point of <InlineMath math={"M"}/> closest to{" "}
                    <InlineMath math={"x_i"}/>, and its coefficients come from the normal equations
                    with the Gram matrix of the measurements.
                </p>}
                ko={<p>
                    이 정의 하나로 3장의 사영 정리가 글자 그대로 적용된다. 측정이 생성하는 부분 공간을{" "}
                    <InlineMath math={"M = \\operatorname{span}\\{y_1, \\ldots, y_m\\} \\subset \\mathcal{X}"}/>라
                    하자. 그러면 <InlineMath math={"x_i"}/>의 최소 분산 추정은{" "}
                    <InlineMath math={"M"}/> 안에서 <InlineMath math={"x_i"}/>에 가장 가까운 점이고,
                    그 계수는 측정들의 Gram 행렬로 세운 normal equation에서 나온다.
                </p>}
            />
            <BlockMath math={"\\hat{x}_i = \\underset{m \\in M}{\\arg\\min}\\;\\|x_i - m\\|^2 = \\hat{\\alpha}_1 y_1 + \\cdots + \\hat{\\alpha}_m y_m, \\qquad G^\\top \\hat{\\alpha} = \\beta"}/>
            <Terms items={[
                ["M", <T en={<>everything that can be built linearly out of the measurements. An estimator that is linear in <InlineMath math={"y"}/> is exactly a point of <InlineMath math={"M"}/></>}
                         ko={<>측정으로 선형적으로 만들어 낼 수 있는 것 전부. <InlineMath math={"y"}/>에 대해 선형인 추정기가 정확히 <InlineMath math={"M"}/>의 한 점이다</>}/>],
                ["G_{ij} = \\langle y_i, y_j\\rangle", <T en={<>the Gram matrix of the measurements, computed below to be <InlineMath math={"CPC^\\top + Q"}/></>}
                                                         ko={<>측정들의 Gram 행렬. 아래에서 <InlineMath math={"CPC^\\top + Q"}/>로 계산된다</>}/>],
                ["\\beta_j = \\langle x_i, y_j\\rangle", <T en={<>the correlation between the thing wanted and each measurement, computed below to be <InlineMath math={"C_j P_i"}/></>}
                                                           ko={<>알고 싶은 값과 각 측정의 상관. 아래에서 <InlineMath math={"C_j P_i"}/>로 계산된다</>}/>],
            ]}/>
            <BlockMath math={"\\begin{aligned} G_{ij} = \\mathcal{E}\\{y_i y_j\\} &= \\mathcal{E}\\{[C_i x + \\varepsilon_i][x^\\top C_j^\\top + \\varepsilon_j]\\} \\\\ &= C_i \\mathcal{E}\\{xx^\\top\\}C_j^\\top + \\underbrace{\\mathcal{E}\\{C_i x \\varepsilon_j\\}}_{=\\,0} + \\underbrace{\\mathcal{E}\\{\\varepsilon_i x^\\top C_j^\\top\\}}_{=\\,0} + \\mathcal{E}\\{\\varepsilon_i \\varepsilon_j\\} \\\\ &= C_i P C_j^\\top + Q_{ij} = [CPC^\\top + Q]_{ij}\\end{aligned}"}/>
            <Terms items={[
                ["C_i", <T en={<>the <InlineMath math={"i"}/>-th <em>row</em> of <InlineMath math={"C"}/>, so <InlineMath math={"y_i = C_i x + \\varepsilon_i"}/> is a scalar</>}
                           ko={<><InlineMath math={"C"}/>의 <InlineMath math={"i"}/>번째 <em>행</em>이라 <InlineMath math={"y_i = C_i x + \\varepsilon_i"}/>는 스칼라다</>}/>],
                ["\\text{cross terms}", <T en={<>zero by the assumption <InlineMath math={"\\mathcal{E}\\{\\varepsilon x^\\top\\} = 0"}/>. This is the only place that assumption is used, and the formula would be a mess without it</>}
                                          ko={<><InlineMath math={"\\mathcal{E}\\{\\varepsilon x^\\top\\} = 0"}/> 가정으로 0이 된다. 이 가정을 쓰는 곳은 여기 한 군데뿐이고, 이것이 없으면 공식이 엉망이 된다</>}/>],
                ["G = CPC^\\top + Q", <T en={<>the measurement covariance. The measurements are linearly independent as random variables if and only if this is positive definite, which is the standing assumption</>}
                                        ko={<>측정의 공분산. 측정들이 확률 변수로서 선형 독립인 것은 이것이 positive definite인 것과 동치이고, 그것이 계속 유지되는 가정이다</>}/>],
            ]}/>
            <T
                en={<p>
                    The same computation for <InlineMath math={"\\beta"}/> gives{" "}
                    <InlineMath math={"\\beta_j = \\mathcal{E}\\{x_i y_j\\} = C_j \\mathcal{E}\\{x x^\\top\\} e^i = C_j P_i"}/>,{" "}
                    where <InlineMath math={"P_i"}/> is the <InlineMath math={"i"}/>-th column of{" "}
                    <InlineMath math={"P"}/>. Solving{" "}
                    <InlineMath math={"[CPC^\\top + Q]\\hat{\\alpha} = CP_i"}/> row by row and stacking
                    the rows back into a matrix gives the theorem.
                </p>}
                ko={<p>
                    <InlineMath math={"\\beta"}/>에 같은 계산을 하면{" "}
                    <InlineMath math={"\\beta_j = \\mathcal{E}\\{x_i y_j\\} = C_j \\mathcal{E}\\{x x^\\top\\} e^i = C_j P_i"}/>이고,
                    여기서 <InlineMath math={"P_i"}/>는 <InlineMath math={"P"}/>의{" "}
                    <InlineMath math={"i"}/>번째 열이다.{" "}
                    <InlineMath math={"[CPC^\\top + Q]\\hat{\\alpha} = CP_i"}/>를 행마다 풀고 그 행들을
                    다시 행렬로 쌓으면 정리가 나온다.
                </p>}
            />
            <Theorem n="5.27" title={<T en={<>Minimum Variance Estimator</>} ko={<>최소 분산 추정기</>}/>}>
                <BlockMath math={"\\hat{x} = \\hat{K}y, \\qquad \\hat{K} = PC^\\top\\left[CPC^\\top + Q\\right]^{-1}"}/>
                <BlockMath math={"\\mathcal{E}\\{(\\hat{x}-x)(\\hat{x}-x)^\\top\\} = P - PC^\\top\\left[CPC^\\top+Q\\right]^{-1}CP"}/>
                <Terms items={[
                    ["PC^\\top", <T en={<>the covariance between <InlineMath math={"x"}/> and <InlineMath math={"y"}/>: how much the measurement knows about the state</>}
                                   ko={<><InlineMath math={"x"}/>와 <InlineMath math={"y"}/>의 공분산. 측정이 상태에 대해 아는 양이다</>}/>],
                    ["[CPC^\\top + Q]^{-1}", <T en={<>the inverse of the measurement covariance: dividing by how uncertain the measurement itself is</>}
                                               ko={<>측정 공분산의 역행렬. 측정 자신이 얼마나 불확실한지로 나누는 것이다</>}/>],
                    ["P - PC^\\top[\\cdot]^{-1}CP", <T en={<>the posterior covariance. The subtracted term is the <em>value</em> of the measurement, and it is positive semidefinite, so measuring never makes you less certain</>}
                                                      ko={<>사후 공분산. 빼는 항이 측정의 <em>가치</em>이고 positive semidefinite이므로, 측정한다고 해서 더 불확실해지는 일은 없다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            The gain came from the normal equations above. For the covariance, write the
                            error with no constraint on <InlineMath math={"KC"}/>:
                        </p>}
                        ko={<p>
                            이득은 위의 normal equation에서 나왔다. 공분산을 보려면{" "}
                            <InlineMath math={"KC"}/>에 아무 제약도 걸지 않은 채 오차를 적는다.
                        </p>}
                    />
                    <BlockMath math={"\\hat{x} - x = (KC - I)x + K\\varepsilon"}/>
                    <BlockMath math={"\\begin{aligned} \\mathcal{E}\\{(\\hat{x}-x)(\\hat{x}-x)^\\top\\} &= (KC-I)P(KC-I)^\\top + KQK^\\top \\\\ &= KCPC^\\top K^\\top - KCP - PC^\\top K^\\top + P + KQK^\\top \\\\ &= P + K\\left[CPC^\\top + Q\\right]K^\\top - KCP - PC^\\top K^\\top\\end{aligned}"}/>
                    <Terms items={[
                        ["(KC-I)P(KC-I)^\\top", <T en={<>the part of the error caused by not reproducing <InlineMath math={"x"}/> exactly, which BLUE had forced to zero</>}
                                                  ko={<><InlineMath math={"x"}/>를 정확히 재현하지 못해서 생기는 오차. BLUE는 이것을 0으로 강제했다</>}/>],
                        ["KQK^\\top", <T en={<>the part caused by the noise, with no cross term because state and noise are uncorrelated</>}
                                        ko={<>잡음이 만드는 오차. 상태와 잡음이 무상관이라 교차항이 없다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Now substitute <InlineMath math={"K = PC^\\top[CPC^\\top + Q]^{-1}"}/>. The
                            middle term becomes{" "}
                            <InlineMath math={"PC^\\top[CPC^\\top+Q]^{-1}CP"}/>, and each of the two
                            subtracted terms is the same matrix, so
                        </p>}
                        ko={<p>
                            이제 <InlineMath math={"K = PC^\\top[CPC^\\top + Q]^{-1}"}/>을 대입한다.
                            가운데 항은 <InlineMath math={"PC^\\top[CPC^\\top+Q]^{-1}CP"}/>가 되고, 빼는
                            두 항도 각각 같은 행렬이므로 다음이 남는다.
                        </p>}
                    />
                    <BlockMath math={"P + PC^\\top[\\cdot]^{-1}CP - 2\\,PC^\\top[\\cdot]^{-1}CP = P - PC^\\top\\left[CPC^\\top+Q\\right]^{-1}CP"}/>
                    <Terms items={[
                        ["[\\cdot]", <T en={<>shorthand for <InlineMath math={"CPC^\\top + Q"}/>, which is symmetric, so its inverse is symmetric and <InlineMath math={"KCP"}/> and <InlineMath math={"PC^\\top K^\\top"}/> really are the same matrix rather than transposes of each other</>}
                                       ko={<><InlineMath math={"CPC^\\top + Q"}/>의 줄임. 대칭이라 역행렬도 대칭이고, 그래서 <InlineMath math={"KCP"}/>와 <InlineMath math={"PC^\\top K^\\top"}/>가 서로 transpose인 정도가 아니라 아예 같은 행렬이다</>}/>],
                    ]}/>
                </Proof>
            </Theorem>
            <Remark n="5.28" title={<T en={<>BLUE against MVE, side by side</>} ko={<>BLUE와 MVE를 나란히</>}/>}>
                <T
                    en={<p>
                        Stack <InlineMath math={"x"}/> and <InlineMath math={"y"}/> into one vector and
                        the whole picture becomes a single block matrix:
                    </p>}
                    ko={<p>
                        <InlineMath math={"x"}/>와 <InlineMath math={"y"}/>를 한 벡터로 쌓으면 전체
                        그림이 블록 행렬 하나가 된다.
                    </p>}
                />
                <BlockMath math={"\\operatorname{cov}\\left(\\begin{bmatrix}x\\\\y\\end{bmatrix}\\right) = \\begin{bmatrix} P & PC^\\top \\\\ CP & CPC^\\top + Q\\end{bmatrix}"}/>
                <Terms items={[
                    ["P", <T en={<>the top left block: what is known about <InlineMath math={"x"}/> before measuring</>}
                             ko={<>왼쪽 위 블록. 재기 전에 <InlineMath math={"x"}/>에 대해 아는 것이다</>}/>],
                    ["CPC^\\top + Q", <T en={<>the bottom right block: the covariance of what you see</>}
                                        ko={<>오른쪽 아래 블록. 보이는 것의 공분산이다</>}/>],
                    ["PC^\\top", <T en={<>the coupling. If it is zero the measurement is useless, which happens exactly when <InlineMath math={"C = 0"}/> or the prior is degenerate</>}
                                   ko={<>둘을 잇는 항. 이것이 0이면 측정이 쓸모없고, 그런 일은 <InlineMath math={"C = 0"}/>이거나 사전 분포가 퇴화했을 때만 생긴다</>}/>],
                    ["P - PC^\\top[\\cdot]^{-1}CP", <T en={<>the error covariance, which is precisely the <strong>Schur complement</strong> of the bottom right block, exactly as in Chapter 3</>}
                                                      ko={<>오차 공분산. 3장에서와 똑같이, 오른쪽 아래 블록의 <strong>Schur complement</strong> 바로 그것이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        When <InlineMath math={"P > 0"}/> and <InlineMath math={"Q > 0"}/>, the matrix
                        inversion lemma rewrites the gain in a form that makes the comparison immediate:
                    </p>}
                    ko={<p>
                        <InlineMath math={"P > 0"}/>이고 <InlineMath math={"Q > 0"}/>이면 matrix
                        inversion lemma가 이득을 다시 써 주는데, 그 꼴에서는 비교가 즉시 된다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} \\textbf{BLUE:}&\\quad \\hat{x} = \\left[C^\\top Q^{-1}C\\right]^{-1}C^\\top Q^{-1}y \\\\ \\textbf{MVE:}&\\quad \\hat{x} = \\left[C^\\top Q^{-1}C + P^{-1}\\right]^{-1}C^\\top Q^{-1}y\\end{aligned}"}/>
                <Terms items={[
                    ["C^\\top Q^{-1} C", <T en={<>the information the measurements carry, identical in both lines</>}
                                           ko={<>측정이 담고 있는 정보. 두 줄에서 동일하다</>}/>],
                    ["P^{-1}", <T en={<>the information the prior carries. It is the <strong>only</strong> difference between the two estimators</>}
                                 ko={<>사전 분포가 담고 있는 정보. 두 추정기의 차이는 <strong>이것 하나뿐</strong>이다</>}/>],
                    ["P^{-1} = 0", <T en={<>the limit <InlineMath math={"P = \\infty I"}/>, meaning no prior belief at all. There BLUE and MVE coincide</>}
                                     ko={<><InlineMath math={"P = \\infty I"}/>인 극한. 사전 믿음이 전혀 없다는 뜻이고, 그 자리에서 BLUE와 MVE가 일치한다</>}/>],
                ]}/>
                <T
                    en={<ul>
                        <li>BLUE needs <InlineMath math={"\\dim y \\ge \\dim x"}/>, because{" "}
                            <InlineMath math={"C^\\top Q^{-1}C"}/> must be invertible.</li>
                        <li>MVE tolerates <InlineMath math={"\\dim y < \\dim x"}/>, and even{" "}
                            <InlineMath math={"C = 0"}/>. With no measurement at all it returns{" "}
                            <InlineMath math={"\\hat{x} = 0"}/>, the prior mean, with covariance{" "}
                            <InlineMath math={"P"}/>. That is the correct answer to being told nothing.</li>
                        <li>MVE is not unbiased in BLUE's sense of the word. It is biased towards the
                            prior mean on purpose, and it buys a smaller error variance with that bias.</li>
                    </ul>}
                    ko={<ul>
                        <li>BLUE는 <InlineMath math={"C^\\top Q^{-1}C"}/>가 가역이어야 하므로{" "}
                            <InlineMath math={"\\dim y \\ge \\dim x"}/>가 필요하다.</li>
                        <li>MVE는 <InlineMath math={"\\dim y < \\dim x"}/>도, 심지어{" "}
                            <InlineMath math={"C = 0"}/>도 견딘다. 측정이 아예 없으면 사전 평균{" "}
                            <InlineMath math={"\\hat{x} = 0"}/>을 공분산 <InlineMath math={"P"}/>와
                            함께 돌려준다. 아무 말도 듣지 못했을 때의 정답이 그것이다.</li>
                        <li>MVE는 BLUE가 말하는 뜻에서 unbiased가 아니다. 일부러 사전 평균 쪽으로
                            치우쳐 있고, 그 치우침으로 더 작은 오차 분산을 산다.</li>
                    </ul>}
                />
                <Proof label={<T en={<>the matrix inversion lemma step</>} ko={<>matrix inversion lemma 단계</>}/>}>
                    <T
                        en={<p>
                            The lemma states that{" "}
                            <InlineMath math={"(A + BCD)^{-1} = A^{-1} - A^{-1}B(C^{-1} + DA^{-1}B)^{-1}DA^{-1}"}/>.
                            Apply it to <InlineMath math={"[C^\\top Q^{-1}C + P^{-1}]^{-1}"}/> with{" "}
                            <InlineMath math={"A = P^{-1}"}/>, <InlineMath math={"B = C^\\top"}/>,{" "}
                            <InlineMath math={"C = Q^{-1}"}/>, <InlineMath math={"D = C"}/> to get{" "}
                            <InlineMath math={"P - PC^\\top[Q + CPC^\\top]^{-1}CP"}/>, and then
                        </p>}
                        ko={<p>
                            보조정리는{" "}
                            <InlineMath math={"(A + BCD)^{-1} = A^{-1} - A^{-1}B(C^{-1} + DA^{-1}B)^{-1}DA^{-1}"}/>를
                            말한다. <InlineMath math={"A = P^{-1}"}/>,{" "}
                            <InlineMath math={"B = C^\\top"}/>, <InlineMath math={"C = Q^{-1}"}/>,{" "}
                            <InlineMath math={"D = C"}/>로 두고{" "}
                            <InlineMath math={"[C^\\top Q^{-1}C + P^{-1}]^{-1}"}/>에 적용하면{" "}
                            <InlineMath math={"P - PC^\\top[Q + CPC^\\top]^{-1}CP"}/>가 나오고, 이어서
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} \\left[C^\\top Q^{-1}C + P^{-1}\\right]^{-1}C^\\top Q^{-1} &= PC^\\top Q^{-1} - PC^\\top[Q + CPC^\\top]^{-1}CPC^\\top Q^{-1} \\\\ &= PC^\\top\\left[I - [Q + CPC^\\top]^{-1}CPC^\\top\\right]Q^{-1} \\\\ &= PC^\\top[Q + CPC^\\top]^{-1}\\left[(Q + CPC^\\top) - CPC^\\top\\right]Q^{-1} \\\\ &= PC^\\top[Q + CPC^\\top]^{-1}\\,Q\\,Q^{-1} \\\\ &= PC^\\top\\left[CPC^\\top + Q\\right]^{-1}\\end{aligned}"}/>
                    <Terms items={[
                        ["I = [Q + CPC^\\top]^{-1}[Q + CPC^\\top]", <T en={<>inserted in the third line so that a common factor can be pulled out to the left</>}
                                                                      ko={<>셋째 줄에서 끼워 넣는다. 공통 인자를 왼쪽으로 뽑아내기 위한 조작이다</>}/>],
                        ["Q Q^{-1} = I", <T en={<>the last cancellation, which lands exactly on Theorem 5.27's gain</>}
                                           ko={<>마지막으로 지워지는 자리. 정확히 Theorem 5.27의 이득 위에 떨어진다</>}/>],
                    ]}/>
                </Proof>
            </Remark>
            <Example title={<T en={<>The same two sensors, now with a prior</>}
                               ko={<>같은 센서 둘, 이번에는 사전 분포와 함께</>}/>}>
                <T
                    en={<p>
                        Keep <InlineMath math={"C = (1,1)^\\top"}/> and{" "}
                        <InlineMath math={"Q = \\operatorname{diag}(1, 4)"}/> from the BLUE example, and
                        add the knowledge that <InlineMath math={"x"}/> has mean zero and variance{" "}
                        <InlineMath math={"P = 2"}/>.
                    </p>}
                    ko={<p>
                        BLUE 예제의 <InlineMath math={"C = (1,1)^\\top"}/>과{" "}
                        <InlineMath math={"Q = \\operatorname{diag}(1, 4)"}/>를 그대로 두고,{" "}
                        <InlineMath math={"x"}/>의 평균이 0이고 분산이 <InlineMath math={"P = 2"}/>라는
                        지식을 더한다.
                    </p>}
                />
                <BlockMath math={"CPC^\\top + Q = \\begin{bmatrix}2 & 2\\\\2&2\\end{bmatrix} + \\begin{bmatrix}1&0\\\\0&4\\end{bmatrix} = \\begin{bmatrix}3&2\\\\2&6\\end{bmatrix}, \\qquad \\left[CPC^\\top+Q\\right]^{-1} = \\frac{1}{14}\\begin{bmatrix}6&-2\\\\-2&3\\end{bmatrix}"}/>
                <Terms items={[
                    ["CPC^\\top", <T en={<>the part of the measurement covariance that comes from <InlineMath math={"x"}/> itself moving around: both readings share it, hence the off-diagonal 2</>}
                                    ko={<>측정 공분산 가운데 <InlineMath math={"x"}/> 자신이 움직여서 생기는 부분. 두 판독이 그것을 공유하므로 비대각에 2가 생긴다</>}/>],
                    ["14", <T en={<><InlineMath math={"\\det = 18 - 4"}/></>} ko={<><InlineMath math={"\\det = 18 - 4"}/></>}/>],
                ]}/>
                <BlockMath math={"\\hat{K} = PC^\\top\\left[CPC^\\top+Q\\right]^{-1} = \\begin{bmatrix}2&2\\end{bmatrix}\\frac{1}{14}\\begin{bmatrix}6&-2\\\\-2&3\\end{bmatrix} = \\frac{1}{14}\\begin{bmatrix}8&2\\end{bmatrix} = \\begin{bmatrix}\\tfrac47 & \\tfrac17\\end{bmatrix}"}/>
                <Terms items={[
                    ["\\tfrac47, \\tfrac17", <T en={<>the MVE weights, still in the ratio <InlineMath math={"4:1"}/> like BLUE's <InlineMath math={"0.8 : 0.2"}/>, but summing to <InlineMath math={"5/7 < 1"}/></>}
                                               ko={<>MVE의 가중치. BLUE의 <InlineMath math={"0.8 : 0.2"}/>처럼 비는 여전히 <InlineMath math={"4:1"}/>인데 합이 <InlineMath math={"5/7 < 1"}/>이다</>}/>],
                    ["5/7", <T en={<>the total weight on the data. The missing <InlineMath math={"2/7"}/> is the weight on the prior mean, which is zero, so the estimate is pulled towards zero</>}
                              ko={<>데이터에 실린 총 가중치. 모자란 <InlineMath math={"2/7"}/>은 사전 평균에 실린 가중치이고 그 값이 0이라, 추정이 0 쪽으로 당겨진다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The error variance is{" "}
                        <InlineMath math={"P - \\hat{K}CP = 2 - \\left(\\tfrac47 + \\tfrac17\\right)\\cdot 2 = 2 - \\tfrac{10}{7} = \\tfrac47 \\approx 0.571"}/>,
                        against BLUE's <InlineMath math={"0.8"}/>. Check it the other way, through the
                        information form of Remark 5.28:
                    </p>}
                    ko={<p>
                        오차 분산은{" "}
                        <InlineMath math={"P - \\hat{K}CP = 2 - \\left(\\tfrac47 + \\tfrac17\\right)\\cdot 2 = 2 - \\tfrac{10}{7} = \\tfrac47 \\approx 0.571"}/>이고,
                        BLUE의 <InlineMath math={"0.8"}/>과 견줄 값이다. Remark 5.28의 정보 형태로
                        반대편에서 검산해 본다.
                    </p>}
                />
                <BlockMath math={"\\left[C^\\top Q^{-1}C + P^{-1}\\right]^{-1} = \\left[\\tfrac54 + \\tfrac12\\right]^{-1} = \\left[\\tfrac74\\right]^{-1} = \\tfrac47 \\;\\checkmark"}/>
                <Terms items={[
                    ["\\tfrac54", <T en={<>the measurement information, the same number that appeared in the BLUE example</>}
                                    ko={<>측정의 정보. BLUE 예제에 나왔던 바로 그 수다</>}/>],
                    ["\\tfrac12", <T en={<>the prior information <InlineMath math={"P^{-1}"}/>: knowing the prior is worth as much as a third sensor with variance 2</>}
                                    ko={<>사전 정보 <InlineMath math={"P^{-1}"}/>. 사전 분포를 아는 것이 분산 2짜리 센서 하나를 더 가진 것과 같은 값어치다</>}/>],
                    ["\\tfrac47", <T en={<>the two computations agree exactly, which is the matrix inversion lemma doing its job on a case small enough to check by hand</>}
                                    ko={<>두 계산이 정확히 일치한다. 손으로 확인할 수 있을 만큼 작은 경우에서 matrix inversion lemma가 제 일을 한 것이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Push the prior to <InlineMath math={"P = 10"}/> and the gain becomes{" "}
                        <InlineMath math={"(0.741, 0.185)"}/>; at <InlineMath math={"P = 10^6"}/> it is{" "}
                        <InlineMath math={"(0.79999, 0.19999)"}/>. The prior fades and BLUE is what is
                        left.
                    </p>}
                    ko={<p>
                        사전 분산을 <InlineMath math={"P = 10"}/>으로 키우면 이득이{" "}
                        <InlineMath math={"(0.741, 0.185)"}/>이 되고,{" "}
                        <InlineMath math={"P = 10^6"}/>에서는{" "}
                        <InlineMath math={"(0.79999, 0.19999)"}/>다. 사전 정보가 옅어지고 남는 것이
                        BLUE다.
                    </p>}
                />
            </Example>
            <CanvasFigure label={t("The same measurements, fed to both estimators",
                "같은 측정을 두 추정기에 나란히 먹인 결과")}
                          modal={<BlueVsMve width={880} height={400}/>}
                          bodyClassName="w-[min(94vw,920px)]">
                <BlueVsMve/>
            </CanvasFigure>
            <Remark title={<T en={<>Optional read: deriving MVE the BLUE way (notes 5.10)</>}
                              ko={<>선택 읽기: BLUE 방식으로 MVE 유도하기 (교재 5.10)</>}/>}>
                <T
                    en={<p>
                        The notes close the chapter with a multiple choice exercise that re-derives MVE
                        without the inner product space, by turning it into a deterministic least squares
                        problem. The answers are (b) and (d). Statement (a) is false because{" "}
                        <InlineMath math={"KC = I"}/> is not required once{" "}
                        <InlineMath math={"\\mathcal{E}\\{x\\} = 0"}/>, and (c) is false because it drops
                        the cross terms in the expansion of{" "}
                        <InlineMath math={"\\mathcal{E}\\{(\\hat{x}_i - x_i)^2\\}"}/>. The route that
                        works is (b) and then (d): write the error variance as a single quadratic form,
                    </p>}
                    ko={<p>
                        교재는 이 장을 객관식 연습 하나로 닫는다. 내적 공간을 쓰지 않고, 결정론적
                        최소제곱 문제로 바꿔서 MVE를 다시 유도하는 문제다. 답은 (b)와 (d)다. (a)는{" "}
                        <InlineMath math={"\\mathcal{E}\\{x\\} = 0"}/>이면{" "}
                        <InlineMath math={"KC = I"}/>가 요구되지 않으므로 거짓이고, (c)는{" "}
                        <InlineMath math={"\\mathcal{E}\\{(\\hat{x}_i - x_i)^2\\}"}/>를 전개할 때 나오는
                        교차항을 빠뜨렸으므로 거짓이다. 통하는 경로는 (b)에서 (d)로 가는 길이다. 오차
                        분산을 이차 형식 하나로 적으면 이렇게 된다.
                    </p>}
                />
                <BlockMath math={"\\mathcal{E}\\{(\\hat{x}_i - x_i)^2\\} = \\begin{bmatrix} C^\\top k_i^\\top - e^i \\\\ k_i^\\top\\end{bmatrix}^\\top \\begin{bmatrix} P & 0 \\\\ 0 & Q\\end{bmatrix}\\begin{bmatrix} C^\\top k_i^\\top - e^i \\\\ k_i^\\top \\end{bmatrix}"}/>
                <Terms items={[
                    ["C^\\top k_i^\\top - e^i", <T en={<>how far the <InlineMath math={"i"}/>-th row of <InlineMath math={"KC"}/> is from the identity, weighted by the prior <InlineMath math={"P"}/></>}
                                                  ko={<><InlineMath math={"KC"}/>의 <InlineMath math={"i"}/>번째 행이 항등 행렬에서 얼마나 떨어져 있는지. 사전 공분산 <InlineMath math={"P"}/>로 가중된다</>}/>],
                    ["k_i^\\top", <T en={<>the gain row itself, weighted by the noise covariance <InlineMath math={"Q"}/></>}
                                    ko={<>이득의 행 그 자체. 잡음 공분산 <InlineMath math={"Q"}/>로 가중된다</>}/>],
                    ["\\operatorname{diag}(P, Q)", <T en={<>a weighted norm on <InlineMath math={"\\mathbb{R}^{n+m}"}/>, which turns the problem into an ordinary overdetermined least squares fit with design matrix <InlineMath math={"[C^\\top; I]"}/></>}
                                                     ko={<><InlineMath math={"\\mathbb{R}^{n+m}"}/> 위의 가중 norm. 문제를 설계 행렬이 <InlineMath math={"[C^\\top; I]"}/>인 보통의 overdetermined 최소제곱으로 바꿔 놓는다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Chapter 3's weighted normal equations then return{" "}
                        <InlineMath math={"\\hat{K}^\\top = (CPC^\\top+Q)^{-1}CP"}/>, the same answer.
                        The notes themselves judge this route inferior to the projection argument, since
                        the projection needs only <InlineMath math={"CPC^\\top + Q > 0"}/> while this one
                        needs both <InlineMath math={"P > 0"}/> and <InlineMath math={"Q > 0"}/>. Skip it
                        on a first pass.
                    </p>}
                    ko={<p>
                        여기에 3장의 가중 normal equation을 쓰면{" "}
                        <InlineMath math={"\\hat{K}^\\top = (CPC^\\top+Q)^{-1}CP"}/>가 나온다. 같은
                        답이다. 교재 스스로도 이 경로가 사영 논증보다 못하다고 평가한다. 사영은{" "}
                        <InlineMath math={"CPC^\\top + Q > 0"}/>만 있으면 되는데 이쪽은{" "}
                        <InlineMath math={"P > 0"}/>과 <InlineMath math={"Q > 0"}/>을 둘 다 요구하기
                        때문이다. 첫 독에서는 건너뛰어도 된다.
                    </p>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Independence, Correlation, and Conditioning</h2>}
               ko={<h2>독립, 상관, 조건부 확률</h2>}/>
            <T
                en={<p>
                    Both estimators so far consumed all the measurements at once. To get a recursive
                    filter, the question has to change from "what is the best linear function of{" "}
                    <InlineMath math={"y"}/>" to "what do I believe about <InlineMath math={"x"}/>{" "}
                    <em>given</em> that I have seen <InlineMath math={"y"}/>". That is conditioning, and
                    it needs the joint distribution of the two.
                </p>}
                ko={<p>
                    지금까지의 두 추정기는 측정을 한꺼번에 받아먹었다. 재귀 필터로 가려면 질문이 바뀌어야
                    한다. "<InlineMath math={"y"}/>의 가장 좋은 선형 함수는 무엇인가"에서{" "}
                    "<InlineMath math={"y"}/>를 보았다는 <em>조건 아래</em>에서{" "}
                    <InlineMath math={"x"}/>에 대해 무엇을 믿는가"로. 그것이 조건부 분포이고, 그러려면
                    둘의 결합 분포가 필요하다.
                </p>}
            />
            <T
                en={<p>
                    Partition a random vector into two blocks,{" "}
                    <InlineMath math={"X_1 \\in \\mathbb{R}^n"}/> and{" "}
                    <InlineMath math={"X_2 \\in \\mathbb{R}^m"}/>. The density{" "}
                    <InlineMath math={"f_{X_1X_2}(x_1, x_2)"}/> is called the <strong>joint
                    density</strong>, and the covariance breaks into blocks along the same partition.
                </p>}
                ko={<p>
                    확률 벡터를 두 블록 <InlineMath math={"X_1 \\in \\mathbb{R}^n"}/>과{" "}
                    <InlineMath math={"X_2 \\in \\mathbb{R}^m"}/>으로 쪼갠다. 밀도{" "}
                    <InlineMath math={"f_{X_1X_2}(x_1, x_2)"}/>를 <strong>결합 밀도</strong>라 하고,
                    공분산도 같은 분할을 따라 블록으로 나뉜다.
                </p>}
            />
            <BlockMath math={"\\Sigma = \\begin{bmatrix}\\Sigma_{11} & \\Sigma_{12} \\\\ \\Sigma_{21} & \\Sigma_{22}\\end{bmatrix} = \\mathcal{E}\\left\\{\\begin{bmatrix} (X_1-\\mu_1)(X_1-\\mu_1)^\\top & (X_1-\\mu_1)(X_2-\\mu_2)^\\top \\\\ (X_2-\\mu_2)(X_1-\\mu_1)^\\top & (X_2-\\mu_2)(X_2-\\mu_2)^\\top\\end{bmatrix}\\right\\}"}/>
            <Terms items={[
                ["\\Sigma_{11}", <T en={<><InlineMath math={"n \\times n"}/>, the covariance of <InlineMath math={"X_1"}/> on its own</>}
                                   ko={<><InlineMath math={"n \\times n"}/>. <InlineMath math={"X_1"}/> 혼자의 공분산이다</>}/>],
                ["\\Sigma_{12}", <T en={<><InlineMath math={"n \\times m"}/>, also called the <strong>correlation</strong> of <InlineMath math={"X_1"}/> and <InlineMath math={"X_2"}/>. Everything interesting in this chapter lives in this block</>}
                                   ko={<><InlineMath math={"n \\times m"}/>이고 <InlineMath math={"X_1"}/>과 <InlineMath math={"X_2"}/>의 <strong>상관</strong>이라고도 부른다. 이 장에서 흥미로운 것은 전부 이 블록에 산다</>}/>],
                ["\\Sigma_{21} = \\Sigma_{12}^\\top", <T en={<>forced by the symmetry of <InlineMath math={"\\Sigma"}/>, so the bottom left block carries no new information</>}
                                                        ko={<><InlineMath math={"\\Sigma"}/>의 대칭성이 강제한다. 그래서 왼쪽 아래 블록에는 새 정보가 없다</>}/>],
            ]}/>
            <Remark title={<T en={<>Two slips in the printed expansion</>} ko={<>인쇄된 전개의 오기 두 곳</>}/>}>
                <T
                    en={<p>
                        The notes print the bottom row of that matrix as{" "}
                        <InlineMath math={"(X_1-\\mu_1)(X_2-\\mu_2)^\\top"}/> and{" "}
                        <InlineMath math={"(X_2-\\mu_1)(X_2-\\mu_2)^\\top"}/>. The first repeats the entry
                        directly above it, which would make <InlineMath math={"\\Sigma"}/> have two equal
                        rows of blocks, and the second subtracts <InlineMath math={"\\mu_1"}/> from{" "}
                        <InlineMath math={"X_2"}/>, whose dimensions need not even match. The correct
                        entries are the ones written above, and they follow from multiplying the column{" "}
                        <InlineMath math={"(X-\\mu)"}/> by the row{" "}
                        <InlineMath math={"(X-\\mu)^\\top"}/> block by block.
                    </p>}
                    ko={<p>
                        교재는 그 행렬의 아랫줄을{" "}
                        <InlineMath math={"(X_1-\\mu_1)(X_2-\\mu_2)^\\top"}/>과{" "}
                        <InlineMath math={"(X_2-\\mu_1)(X_2-\\mu_2)^\\top"}/>으로 인쇄했다. 앞의 것은 바로
                        위 성분을 그대로 되풀이한 것이라 그대로 두면{" "}
                        <InlineMath math={"\\Sigma"}/>의 블록 두 줄이 같아지고, 뒤의 것은{" "}
                        <InlineMath math={"X_2"}/>에서 <InlineMath math={"\\mu_1"}/>을 빼는데 차원조차
                        맞지 않을 수 있다. 옳은 성분은 위에 적은 것들이고, 열{" "}
                        <InlineMath math={"(X-\\mu)"}/>에 행{" "}
                        <InlineMath math={"(X-\\mu)^\\top"}/>를 블록 단위로 곱하면 그대로 나온다.
                    </p>}
                />
            </Remark>
            <Definition n="5.31" title={<T en={<>Marginal densities</>} ko={<>주변 밀도</>}/>}>
                <T
                    en={<p>
                        The densities <InlineMath math={"f_{X_1}(x_1)"}/> and{" "}
                        <InlineMath math={"f_{X_2}(x_2)"}/> of the two blocks on their own are the{" "}
                        <strong>marginal densities</strong>. They are obtained by integrating the other
                        block away:
                    </p>}
                    ko={<p>
                        두 블록 각각의 밀도 <InlineMath math={"f_{X_1}(x_1)"}/>과{" "}
                        <InlineMath math={"f_{X_2}(x_2)"}/>를 <strong>주변 밀도</strong>라 한다. 다른
                        블록을 적분으로 지워서 얻는다.
                    </p>}
                />
                <BlockMath math={"f_{X_1}(x_1) := \\int_{-\\infty}^{\\infty}\\!\\!\\cdots\\!\\int_{-\\infty}^{\\infty} f_{X_1X_2}(x_1, \\bar{x}_2)\\,d\\bar{x}_{n+1}\\cdots d\\bar{x}_{n+m}"}/>
                <Terms items={[
                    ["d\\bar{x}_{n+1}\\cdots d\\bar{x}_{n+m}", <T en={<><InlineMath math={"m"}/> nested integrals, one per component of <InlineMath math={"X_2"}/>. Fact 5.32 of the notes puts it bluntly: in general these are a nightmare to compute</>}
                                                                 ko={<><InlineMath math={"X_2"}/>의 성분마다 하나씩, 중첩 적분 <InlineMath math={"m"}/>개. 교재 Fact 5.32는 대놓고 말한다. 일반적으로 이것은 계산하기 악몽이다</>}/>],
                    ["f_{X_1}", <T en={<>a density on <InlineMath math={"\\mathbb{R}^n"}/> again, with <InlineMath math={"X_2"}/> completely forgotten</>}
                                  ko={<>다시 <InlineMath math={"\\mathbb{R}^n"}/> 위의 밀도. <InlineMath math={"X_2"}/>는 완전히 잊혔다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Remember that word "nightmare". For Gaussians, two sections from now, the
                        marginal is read straight off the mean vector and the covariance matrix with no
                        integral at all, and that single fact is why the entire estimation literature
                        runs on Gaussians.
                    </p>}
                    ko={<p>
                        "악몽"이라는 말을 기억해 두자. 두 절 뒤에서 보겠지만 가우시안이라면 주변 분포를
                        평균 벡터와 공분산 행렬에서 적분 없이 그대로 읽어 낸다. 추정 문헌 전체가
                        가우시안 위에서 돌아가는 이유가 이 사실 하나다.
                    </p>}
                />
            </Definition>
            <Definition n="5.33" title={<T en={<>Independent and uncorrelated</>} ko={<>독립과 무상관</>}/>}>
                <BlockMath math={"\\begin{aligned} &\\underbrace{f_{X_1X_2}(x_1,x_2) = f_{X_1}(x_1)f_{X_2}(x_2)}_{\\textbf{independent}} \\\\[8pt] &\\underbrace{\\operatorname{cov}(X_1, X_2) = \\mathcal{E}\\{(X_1-\\mu_1)(X_2-\\mu_2)^\\top\\} = 0_{n \\times m}}_{\\textbf{uncorrelated}}\\end{aligned}"}/>
                <Terms items={[
                    ["\\text{independent}", <T en={<>a statement about the whole density: knowing <InlineMath math={"X_2"}/> changes nothing whatsoever about <InlineMath math={"X_1"}/></>}
                                              ko={<>밀도 전체에 대한 진술. <InlineMath math={"X_2"}/>를 알아도 <InlineMath math={"X_1"}/>에 대해 아무것도 달라지지 않는다</>}/>],
                    ["\\text{uncorrelated}", <T en={<>a statement about second moments only: no <em>linear</em> relationship. It is a much weaker claim</>}
                                               ko={<>2차 적률에 대한 진술일 뿐이다. <em>선형</em> 관계가 없다는 말이고, 훨씬 약한 주장이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Independent implies uncorrelated. <strong>The converse is false in general</strong>,
                        and the notes say so in red without giving an instance, so here is one. Let{" "}
                        <InlineMath math={"X"}/> take the values <InlineMath math={"-1, 0, 1"}/> with
                        probability <InlineMath math={"1/3"}/> each, and set{" "}
                        <InlineMath math={"Y = X^2"}/>.
                    </p>}
                    ko={<p>
                        독립이면 무상관이다. <strong>역은 일반적으로 거짓</strong>인데, 교재는 그것을
                        빨간 글씨로 적어 두고 예는 주지 않는다. 그러니 하나 만들어 보자.{" "}
                        <InlineMath math={"X"}/>가 <InlineMath math={"-1, 0, 1"}/>을 각각{" "}
                        <InlineMath math={"1/3"}/>의 확률로 갖고,{" "}
                        <InlineMath math={"Y = X^2"}/>이라 하자.
                    </p>}
                />
                <BlockMath math={"\\mathcal{E}\\{X\\} = 0, \\qquad \\mathcal{E}\\{Y\\} = \\tfrac{2}{3}, \\qquad \\mathcal{E}\\{XY\\} = \\mathcal{E}\\{X^3\\} = \\tfrac{-1 + 0 + 1}{3} = 0"}/>
                <Terms items={[
                    ["\\mathcal{E}\\{XY\\} - \\mathcal{E}\\{X\\}\\mathcal{E}\\{Y\\} = 0", <T en={<>so <InlineMath math={"X"}/> and <InlineMath math={"Y"}/> are uncorrelated</>}
                                                                                             ko={<>그래서 <InlineMath math={"X"}/>와 <InlineMath math={"Y"}/>는 무상관이다</>}/>],
                    ["Y = X^2", <T en={<>yet <InlineMath math={"Y"}/> is a <em>function</em> of <InlineMath math={"X"}/>: knowing <InlineMath math={"X"}/> determines <InlineMath math={"Y"}/> completely. <InlineMath math={"P(Y = 0 \\mid X = 0) = 1"}/> while <InlineMath math={"P(Y=0) = 1/3"}/></>}
                                  ko={<>그런데 <InlineMath math={"Y"}/>는 <InlineMath math={"X"}/>의 <em>함수</em>다. <InlineMath math={"X"}/>를 알면 <InlineMath math={"Y"}/>가 완전히 정해진다. <InlineMath math={"P(Y = 0 \\mid X = 0) = 1"}/>인데 <InlineMath math={"P(Y=0) = 1/3"}/>이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        As dependent as two variables can be, and the covariance sees none of it. The
                        covariance is a linear instrument, and <InlineMath math={"X \\mapsto X^2"}/> is a
                        curve. Keep this example in mind for the EKF section, where a curve is exactly
                        what goes wrong.
                    </p>}
                    ko={<p>
                        두 변수가 종속일 수 있는 최대한으로 종속인데 공분산은 그것을 하나도 보지 못한다.
                        공분산은 선형 도구이고 <InlineMath math={"X \\mapsto X^2"}/>은 곡선이다. 이 예제를
                        EKF 절까지 기억해 두자. 거기서 잘못되는 것이 바로 곡선이다.
                    </p>}
                />
            </Definition>
            <Definition n="5.35" title={<T en={<>Conditional probability</>} ko={<>조건부 확률</>}/>}>
                <BlockMath math={"P(A \\mid B) := \\frac{P(A \\cap B)}{P(B)}, \\qquad P(B) > 0"}/>
                <Terms items={[
                    ["A, B", <T en={<>two allowed events. Think of <InlineMath math={"A"}/> as "the robot is here" and <InlineMath math={"B"}/> as "the camera reported seeing it there"</>}
                               ko={<>허용된 사건 둘. <InlineMath math={"A"}/>는 "로봇이 여기 있다", <InlineMath math={"B"}/>는 "카메라가 거기서 봤다고 보고했다" 정도로 생각하면 된다</>}/>],
                    ["P(A \\cap B)", <T en={<>the probability that both happen</>} ko={<>둘 다 일어날 확률</>}/>],
                    ["P(B) > 0", <T en={<>required, since dividing by the probability of something impossible is meaningless. For continuous random vectors this is exactly the technical difficulty the density formula sidesteps</>}
                                   ko={<>필요한 조건이다. 일어날 수 없는 일의 확률로 나누는 것은 뜻이 없다. 연속 확률 벡터에서는 바로 이 지점이 기술적 난점이고, 밀도 공식이 그것을 비켜 간다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The notes' own example, with its numbers filled in. Spread a uniform probability
                        over all floors of a building of area{" "}
                        <InlineMath math={"12{,}000\\,\\mathrm{m}^2"}/>. Let{" "}
                        <InlineMath math={"A"}/> be "the robot is in the self service section of the
                        cafe", of area <InlineMath math={"8\\,\\mathrm{m}^2"}/>, and{" "}
                        <InlineMath math={"B"}/> be "the robot was measured to be in the cafe", of area{" "}
                        <InlineMath math={"30\\,\\mathrm{m}^2"}/>. Since{" "}
                        <InlineMath math={"A \\subset B"}/>, we have{" "}
                        <InlineMath math={"A \\cap B = A"}/> and
                    </p>}
                    ko={<p>
                        교재의 예제에 숫자를 채워 넣어 보자. 넓이가{" "}
                        <InlineMath math={"12{,}000\\,\\mathrm{m}^2"}/>인 건물의 모든 층에 균등 확률을
                        뿌린다. <InlineMath math={"A"}/>를 넓이{" "}
                        <InlineMath math={"8\\,\\mathrm{m}^2"}/>인 "로봇이 카페 셀프서비스 구역에 있다",{" "}
                        <InlineMath math={"B"}/>를 넓이 <InlineMath math={"30\\,\\mathrm{m}^2"}/>인
                        "로봇이 카페에 있다고 측정되었다"로 두자.{" "}
                        <InlineMath math={"A \\subset B"}/>이므로{" "}
                        <InlineMath math={"A \\cap B = A"}/>이고 다음과 같다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} P(A) &= \\frac{8}{12000} \\approx 6.66 \\times 10^{-4}, \\qquad P(B) = \\frac{30}{12000} = 2.5 \\times 10^{-3} \\\\[4pt] P(A \\mid B) &= \\frac{P(A)}{P(B)} = \\frac{8}{30} \\approx 0.266 \\end{aligned}"}/>
                <Terms items={[
                    ["6.66\\times10^{-4}", <T en={<>the prior: with no measurement, the robot is almost certainly somewhere else</>}
                                             ko={<>사전 확률. 측정이 없으면 로봇은 거의 확실히 다른 곳에 있다</>}/>],
                    ["0.266", <T en={<>the posterior, four hundred times larger. One measurement changed the belief by two and a half orders of magnitude, and that is the entire business of this chapter</>}
                                ko={<>사후 확률이고 사백 배다. 측정 하나가 믿음을 두 자릿수 반만큼 바꿔 놓았고, 이 장이 하는 일이 그것 전부다</>}/>],
                    ["A \\subset B", <T en={<>the special case <InlineMath math={"P(A\\mid B) = P(A)/P(B) \\ge P(A)"}/> from Remark 5.37: a measurement consistent with a hypothesis can only raise its probability</>}
                                       ko={<>Remark 5.37의 특수한 경우 <InlineMath math={"P(A\\mid B) = P(A)/P(B) \\ge P(A)"}/>. 가설과 어긋나지 않는 측정은 그 확률을 올리기만 한다</>}/>],
                ]}/>
            </Definition>
            <Definition n="5.38" title={<T en={<>Conditional density, mean, and covariance</>}
                                           ko={<>조건부 밀도, 평균, 공분산</>}/>}>
                <BlockMath math={"f_{X_1|X_2}(x_1 \\mid x_2) := \\frac{f_{X_1X_2}(x_1,x_2)}{f_{X_2}(x_2)}"}/>
                <Terms items={[
                    ["f_{X_1|X_2}", <T en={<>a density in <InlineMath math={"x_1"}/> for each fixed <InlineMath math={"x_2"}/>. <strong><InlineMath math={"X_1"}/> given <InlineMath math={"X_2 = x_2"}/> is still a random vector</strong>, with its own mean and covariance</>}
                                      ko={<><InlineMath math={"x_2"}/>를 고정할 때마다 <InlineMath math={"x_1"}/>에 대한 밀도 하나. <strong><InlineMath math={"X_2 = x_2"}/>가 주어진 <InlineMath math={"X_1"}/>은 여전히 확률 벡터</strong>이고, 자기 평균과 자기 공분산을 갖는다</>}/>],
                    ["f_{X_2}(x_2)", <T en={<>the marginal, acting as the normalizer that makes the ratio integrate to one over <InlineMath math={"x_1"}/></>}
                                       ko={<>주변 밀도. 이 비가 <InlineMath math={"x_1"}/>에 대해 적분하면 1이 되도록 만드는 정규화 인자 노릇을 한다</>}/>],
                ]}/>
                <BlockMath math={"\\begin{aligned} \\mu_{X_1|X_2 = x_2} &:= \\mathcal{E}\\{X_1 \\mid X_2 = x_2\\} = \\int_{-\\infty}^{\\infty} x_1 f_{X_1|X_2}(x_1 \\mid x_2)\\,dx_1 \\\\ \\Sigma_{X_1|X_2=x_2} &:= \\mathcal{E}\\{(X_1 - \\mu_{X_1|X_2=x_2})(X_1 - \\mu_{X_1|X_2=x_2})^\\top \\mid X_2 = x_2\\}\\end{aligned}"}/>
                <Terms items={[
                    ["\\mu_{X_1|X_2=x_2}", <T en={<>a <em>function of</em> <InlineMath math={"x_2"}/>. Think of it as a function of the number your sensor reads: a different reading gives a different estimate</>}
                                             ko={<><InlineMath math={"x_2"}/>의 <em>함수</em>다. 센서가 읽어 주는 수의 함수라고 생각하면 된다. 판독값이 달라지면 추정도 달라진다</>}/>],
                    ["\\Sigma_{X_1|X_2=x_2}", <T en={<>also a function of <InlineMath math={"x_2"}/> in general. For Gaussians it will turn out not to be, which is the fact that makes the Kalman filter's covariance recursion run without data</>}
                                                ko={<>일반적으로는 이것도 <InlineMath math={"x_2"}/>의 함수다. 가우시안에서는 아닌 것으로 밝혀지고, 칼만 필터의 공분산 점화식이 데이터 없이 돌아가게 만드는 사실이 그것이다</>}/>],
                ]}/>
            </Definition>
            <Remark title={<T en={<>Optional read: where the conditional density formula comes from (notes 5.4.3)</>}
                              ko={<>선택 읽기: 조건부 밀도 공식의 출처 (교재 5.4.3)</>}/>}>
                <T
                    en={<p>
                        Definition 5.38 is written as a definition, but it is forced. Conditioning on{" "}
                        <InlineMath math={"X_2 = x_2"}/> exactly is conditioning on an event of
                        probability zero, so it has to be reached as a limit of events with positive
                        probability. Skip this on a first pass.
                    </p>}
                    ko={<p>
                        Definition 5.38은 정의처럼 적혀 있지만 실은 강제된 것이다. 정확히{" "}
                        <InlineMath math={"X_2 = x_2"}/>를 조건으로 거는 일은 확률이 0인 사건을 조건으로
                        거는 일이라, 확률이 양수인 사건들의 극한으로 도달해야 한다. 첫 독에서는 건너뛰어도
                        된다.
                    </p>}
                />
                <Proof label={<T en={<>the limiting argument</>} ko={<>극한 논증</>}/>}>
                    <T
                        en={<p>
                            Fix <InlineMath math={"A := \\{X_1 \\le x_1\\}"}/> and thicken the
                            conditioning event to{" "}
                            <InlineMath math={"B_\\epsilon := \\{x_2 - \\epsilon \\le X_2 \\le x_2+\\epsilon\\}"}/>,
                            which has positive probability. Then take{" "}
                            <InlineMath math={"\\epsilon \\to 0"}/>, differentiating top and bottom by
                            l'Hopital's rule.
                        </p>}
                        ko={<p>
                            <InlineMath math={"A := \\{X_1 \\le x_1\\}"}/>을 고정하고 조건 사건을 확률이
                            양수인{" "}
                            <InlineMath math={"B_\\epsilon := \\{x_2 - \\epsilon \\le X_2 \\le x_2+\\epsilon\\}"}/>으로
                            두껍게 만든다. 그리고 l'Hopital 정리로 분자와 분모를 미분하면서{" "}
                            <InlineMath math={"\\epsilon \\to 0"}/>으로 보낸다.
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} F_{X_1|X_2}(x_1 \\mid x_2) &= \\lim_{\\epsilon \\to 0}\\frac{P(A \\cap B_\\epsilon)}{P(B_\\epsilon)} = \\lim_{\\epsilon\\to 0}\\frac{\\int_{-\\infty}^{x_1}\\int_{x_2-\\epsilon}^{x_2+\\epsilon} f_{X_1X_2}(\\bar{x}_1,\\bar{x}_2)\\,d\\bar{x}_2 d\\bar{x}_1}{\\int_{x_2-\\epsilon}^{x_2+\\epsilon} f_{X_2}(\\bar{x}_2)\\,d\\bar{x}_2} \\\\ &= \\int_{-\\infty}^{x_1}\\lim_{\\epsilon\\to 0}\\frac{\\int_{x_2-\\epsilon}^{x_2+\\epsilon} f_{X_1X_2}(\\bar{x}_1,\\bar{x}_2)d\\bar{x}_2}{\\int_{x_2-\\epsilon}^{x_2+\\epsilon}f_{X_2}(\\bar{x}_2)d\\bar{x}_2}\\,d\\bar{x}_1 = \\int_{-\\infty}^{x_1}\\frac{f_{X_1X_2}(\\bar{x}_1,x_2)}{f_{X_2}(x_2)}\\,d\\bar{x}_1\\end{aligned}"}/>
                    <Terms items={[
                        ["\\frac{2\\epsilon f_{X_1X_2}}{2\\epsilon f_{X_2}}", <T en={<>what the inner limit becomes: both integrals over a window of width <InlineMath math={"2\\epsilon"}/> are <InlineMath math={"2\\epsilon"}/> times the integrand, and the widths cancel</>}
                                                                               ko={<>안쪽 극한이 되는 값. 폭 <InlineMath math={"2\\epsilon"}/>짜리 창 위의 두 적분은 각각 피적분 함수의 <InlineMath math={"2\\epsilon"}/>배이고, 폭이 서로 지워진다</>}/>],
                        ["F", <T en={<>the cumulative distribution function. Differentiating it in <InlineMath math={"x_1"}/> gives the density, which is Definition 5.38</>}
                                 ko={<>누적 분포 함수. 이것을 <InlineMath math={"x_1"}/>로 미분하면 밀도가 나오고, 그것이 Definition 5.38이다</>}/>],
                    ]}/>
                </Proof>
            </Remark>
            <CanvasFigure label={t("Conditioning is slicing a joint density, and the slice is a density again",
                "조건을 건다는 것은 결합 밀도를 자르는 일이고, 자른 단면은 다시 밀도다")}
                          modal={<ConditioningExplorer width={720} height={520}/>}
                          bodyClassName="w-[min(92vw,760px)]">
                <ConditioningExplorer/>
            </CanvasFigure>
            <T
                en={<p>
                    The two formulas in that figure's readout are the Gaussian closed forms, proved two
                    sections below. Everything else in it is the definitions above: a joint density, its
                    two marginals, and a conditional density obtained by slicing and renormalizing.
                </p>}
                ko={<p>
                    그림의 판독 줄에 있는 두 공식은 가우시안의 닫힌 꼴이고 두 절 뒤에서 증명한다. 나머지는
                    전부 위의 정의다. 결합 밀도, 그 주변 분포 둘, 그리고 잘라서 다시 정규화해 얻은 조건부
                    밀도.
                </p>}
            />

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Gaussian Random Vectors</h2>} ko={<h2>가우시안 확률 벡터</h2>}/>
            <T
                en={<p>
                    Everything above holds for any density. Gaussians are worth a section of their own
                    because for them every operation this chapter needs, marginalizing, conditioning,
                    passing through a linear map, adding, stays inside the family and costs only matrix
                    algebra.
                </p>}
                ko={<p>
                    위의 내용은 어떤 밀도에 대해서도 성립한다. 가우시안에 절 하나를 따로 주는 이유는, 이
                    장에 필요한 모든 연산이 가우시안에서는 집안을 벗어나지 않고 행렬 대수만으로 끝나기
                    때문이다. 주변화도, 조건부도, 선형 사상 통과도, 덧셈도 그렇다.
                </p>}
            />
            <Definition n="5.43" title={<T en={<>Multivariate normal distribution</>} ko={<>다변량 정규분포</>}/>}>
                <T
                    en={<p>
                        <InlineMath math={"X \\in \\mathbb{R}^p"}/> is{" "}
                        <strong>multivariate normal</strong> with mean{" "}
                        <InlineMath math={"\\mu"}/> and covariance{" "}
                        <InlineMath math={"\\Sigma > 0"}/> when its joint density is
                    </p>}
                    ko={<p>
                        <InlineMath math={"X \\in \\mathbb{R}^p"}/>의 결합 밀도가 다음과 같을 때 평균{" "}
                        <InlineMath math={"\\mu"}/>, 공분산 <InlineMath math={"\\Sigma > 0"}/>인{" "}
                        <strong>다변량 정규분포</strong>를 따른다고 한다.
                    </p>}
                />
                <BlockMath math={"f_X(x) = \\frac{1}{\\sqrt{(2\\pi)^p |\\Sigma|}}\\,e^{-\\frac{1}{2}(x-\\mu)^\\top \\Sigma^{-1}(x-\\mu)}"}/>
                <Terms items={[
                    ["(x-\\mu)^\\top\\Sigma^{-1}(x-\\mu)", <T en={<>a quadratic form in the information matrix. Its level sets are the ellipses drawn in every figure on this page, and the exponent is the only place <InlineMath math={"x"}/> appears</>}
                                                             ko={<>정보 행렬로 만든 이차 형식. 그 등위 집합이 이 페이지의 모든 그림에 나오는 타원이고, <InlineMath math={"x"}/>가 등장하는 자리는 이 지수뿐이다</>}/>],
                    ["|\\Sigma| = \\det\\Sigma", <T en={<>must be non-zero for the density to exist, which is what "non-degenerate" means. A degenerate Gaussian lives on a lower dimensional subspace and needs moment generating functions instead</>}
                                                   ko={<>밀도가 존재하려면 0이 아니어야 하고, 그것이 "non-degenerate"의 뜻이다. 퇴화한 가우시안은 더 낮은 차원의 부분 공간에 살고, 대신 적률 생성 함수가 필요하다</>}/>],
                    ["\\sqrt{(2\\pi)^p|\\Sigma|}", <T en={<>the normalizer, the only thing the dimension <InlineMath math={"p"}/> affects</>}
                                                     ko={<>정규화 상수. 차원 <InlineMath math={"p"}/>가 영향을 주는 곳은 여기뿐이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        <strong>Fact 5.44.</strong> Each component is univariate normal with mean{" "}
                        <InlineMath math={"\\mu_i"}/> and variance <InlineMath math={"\\Sigma_{ii}"}/>.
                        No iterated integrals: the marginal is read off the diagonal. Watch the notation
                        though, because <InlineMath math={"\\sigma_i = \\sqrt{\\Sigma_{ii}}"}/>, so the
                        lower case sigma is a standard deviation while the capital one holds variances.
                    </p>}
                    ko={<p>
                        <strong>Fact 5.44.</strong> 각 성분은 평균 <InlineMath math={"\\mu_i"}/>, 분산{" "}
                        <InlineMath math={"\\Sigma_{ii}"}/>인 일변량 정규분포를 따른다. 중첩 적분은 없다.
                        주변 분포를 대각에서 그냥 읽는다. 다만 기호에 주의해야 한다.{" "}
                        <InlineMath math={"\\sigma_i = \\sqrt{\\Sigma_{ii}}"}/>라서 소문자 시그마는
                        표준편차이고 대문자 쪽은 분산을 담고 있다.
                    </p>}
                />
            </Definition>
            <Remark n="5.45" title={<T en={<>For Gaussians, uncorrelated means independent</>}
                                       ko={<>가우시안에서는 무상관이 곧 독립이다</>}/>}>
                <T
                    en={<p>
                        <InlineMath math={"X_i"}/> and <InlineMath math={"X_j"}/> are independent if and
                        only if <InlineMath math={"\\Sigma_{ij} = 0"}/>. Compare that with the{" "}
                        <InlineMath math={"Y = X^2"}/> counterexample two sections up, which was
                        uncorrelated and maximally dependent. Gaussians are the family where a
                        second-moment statement upgrades itself into a statement about the whole density,
                        and every "uncorrelated, hence independent" step in the Kalman derivation is
                        spending this fact.
                    </p>}
                    ko={<p>
                        <InlineMath math={"X_i"}/>와 <InlineMath math={"X_j"}/>가 독립인 것은{" "}
                        <InlineMath math={"\\Sigma_{ij} = 0"}/>과 동치다. 두 절 위의{" "}
                        <InlineMath math={"Y = X^2"}/> 반례와 견주어 보라. 그쪽은 무상관이면서 최대한
                        종속이었다. 가우시안은 2차 적률에 대한 진술이 저 혼자 밀도 전체에 대한 진술로
                        올라서는 집안이고, 칼만 필터 유도에 나오는 "무상관이므로 독립" 단계는 전부 이
                        사실을 쓰는 것이다.
                    </p>}
                />
            </Remark>
            <Theorem n="5.46" title={<T en={<>Linear combinations stay Gaussian</>} ko={<>선형 결합은 가우시안으로 남는다</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"Y = AX + b"}/> with the rows of{" "}
                        <InlineMath math={"A"}/> linearly independent. Then{" "}
                        <InlineMath math={"Y"}/> is Gaussian with
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>의 행이 선형 독립일 때{" "}
                        <InlineMath math={"Y = AX + b"}/>라 하자. 그러면{" "}
                        <InlineMath math={"Y"}/>는 가우시안이고 다음이 성립한다.
                    </p>}
                />
                <BlockMath math={"\\mu_Y = A\\mu + b, \\qquad \\Sigma_{YY} = \\operatorname{cov}(Y,Y) = A\\Sigma A^\\top"}/>
                <Terms items={[
                    ["A\\mu + b", <T en={<>the mean moves by the same map, offset included</>}
                                    ko={<>평균은 같은 사상으로 옮겨 간다. 평행 이동까지 포함해서다</>}/>],
                    ["A\\Sigma A^\\top", <T en={<>the covariance is sandwiched, and <InlineMath math={"b"}/> drops out entirely: shifting a distribution does not change its spread</>}
                                           ko={<>공분산은 양쪽에서 끼워지고 <InlineMath math={"b"}/>는 아예 사라진다. 분포를 옮겨도 퍼진 정도는 변하지 않는다</>}/>],
                    ["A\\Sigma A^\\top > 0", <T en={<>guaranteed when <InlineMath math={"A"}/> has full row rank and <InlineMath math={"\\Sigma > 0"}/>; without full row rank the image is degenerate</>}
                                               ko={<><InlineMath math={"A"}/>의 행 rank가 꽉 차 있고 <InlineMath math={"\\Sigma > 0"}/>이면 보장된다. 행 rank가 모자라면 상이 퇴화한다</>}/>],
                ]}/>
                <Proof>
                    <BlockMath math={"\\begin{aligned} Y - \\mu_Y &= AX + b - (A\\mu + b) = A(X - \\mu) \\\\ \\operatorname{cov}(Y,Y) &= \\mathcal{E}\\{[A(X-\\mu)][A(X-\\mu)]^\\top\\} \\\\ &= A\\,\\mathcal{E}\\{(X-\\mu)(X-\\mu)^\\top\\}\\,A^\\top = A\\Sigma A^\\top\\end{aligned}"}/>
                    <Terms items={[
                        ["A", <T en={<>constant, so it comes out of the expectation on both sides</>}
                                 ko={<>상수라 양쪽에서 기댓값 밖으로 나온다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Remark 5.47 notes that taking{" "}
                            <InlineMath math={"A = [0, \\ldots, 1, \\ldots, 0]"}/> and{" "}
                            <InlineMath math={"b = 0"}/> recovers Fact 5.44: a marginal density is just a
                            linear combination that keeps one component.
                        </p>}
                        ko={<p>
                            Remark 5.47은 <InlineMath math={"A = [0, \\ldots, 1, \\ldots, 0]"}/>과{" "}
                            <InlineMath math={"b = 0"}/>으로 두면 Fact 5.44가 나온다고 짚는다. 주변
                            밀도란 성분 하나만 남기는 선형 결합일 뿐이다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Example title={<T en={<>The sum and the difference of two correlated Gaussians</>}
                               ko={<>상관 있는 가우시안 둘의 합과 차</>}/>}>
                <T
                    en={<p>
                        Take the running example{" "}
                        <InlineMath math={"X \\sim N\\!\\left(0, \\begin{bmatrix}4&2\\\\2&2\\end{bmatrix}\\right)"}/>,
                        and put it through two different <InlineMath math={"1\\times 2"}/> maps.
                    </p>}
                    ko={<p>
                        계속 쓰고 있는 예제{" "}
                        <InlineMath math={"X \\sim N\\!\\left(0, \\begin{bmatrix}4&2\\\\2&2\\end{bmatrix}\\right)"}/>를
                        서로 다른 두 <InlineMath math={"1\\times 2"}/> 사상에 통과시킨다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} \\operatorname{var}(X_1 + X_2) &= \\begin{bmatrix}1&1\\end{bmatrix}\\begin{bmatrix}4&2\\\\2&2\\end{bmatrix}\\begin{bmatrix}1\\\\1\\end{bmatrix} = \\begin{bmatrix}1&1\\end{bmatrix}\\begin{bmatrix}6\\\\4\\end{bmatrix} = 10 \\\\[3pt] \\operatorname{var}(X_1 - X_2) &= \\begin{bmatrix}1&-1\\end{bmatrix}\\begin{bmatrix}4&2\\\\2&2\\end{bmatrix}\\begin{bmatrix}1\\\\-1\\end{bmatrix} = \\begin{bmatrix}1&-1\\end{bmatrix}\\begin{bmatrix}2\\\\0\\end{bmatrix} = 2\\end{aligned}"}/>
                <Terms items={[
                    ["10", <T en={<>the sum's variance: <InlineMath math={"4 + 2 + 2\\cdot 2"}/>, where the last piece is the correlation reinforcing itself</>}
                             ko={<>합의 분산 <InlineMath math={"4 + 2 + 2\\cdot 2"}/>. 마지막 조각이 상관이 스스로를 키우는 몫이다</>}/>],
                    ["2", <T en={<>the difference's variance: <InlineMath math={"4 + 2 - 2\\cdot 2"}/>. It is smaller than either component's own variance</>}
                             ko={<>차의 분산 <InlineMath math={"4 + 2 - 2\\cdot 2"}/>. 어느 쪽 성분의 분산보다도 작다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The difference of two positively correlated quantities is more certain than
                        either one of them. This is the whole reason a differential measurement helps: two
                        encoders sharing a drift, two GPS receivers sharing an ionospheric delay, two
                        clocks sharing a temperature. Subtracting removes what they share.
                    </p>}
                    ko={<p>
                        양의 상관을 가진 두 값의 차는 그 둘 어느 쪽보다도 확실하다. 차동 측정이 도움이
                        되는 이유가 전부 이것이다. 드리프트를 공유하는 엔코더 둘, 전리층 지연을 공유하는
                        GPS 수신기 둘, 온도를 공유하는 시계 둘. 빼기가 공유분을 걷어 낸다.
                    </p>}
                />
            </Example>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Conditioning with Gaussian Random Vectors</h2>}
               ko={<h2>가우시안 확률 벡터의 조건부 분포</h2>}/>
            <T
                en={<p>
                    This is the technical heart of the chapter. Four facts are stated here, and the
                    Kalman filter is nothing but these four facts applied in a loop. Partition{" "}
                    <InlineMath math={"X"}/> into <InlineMath math={"X_1 \\in \\mathbb{R}^n"}/> and{" "}
                    <InlineMath math={"X_2 \\in \\mathbb{R}^m"}/>, with{" "}
                    <InlineMath math={"\\mu"}/> and <InlineMath math={"\\Sigma"}/> partitioned to match.
                    From the Schur complement results of Chapter 3,{" "}
                    <InlineMath math={"\\Sigma > 0"}/> if and only if{" "}
                    <InlineMath math={"\\Sigma_{22} > 0"}/> and{" "}
                    <InlineMath math={"\\Sigma_{11} - \\Sigma_{12}\\Sigma_{22}^{-1}\\Sigma_{21} > 0"}/>.
                    Hold on to that second expression.
                </p>}
                ko={<p>
                    여기가 이 장의 기술적 심장이다. 사실 넷을 적어 두는데, 칼만 필터는 그 넷을 반복문
                    안에서 적용한 것일 뿐이다. <InlineMath math={"X"}/>를{" "}
                    <InlineMath math={"X_1 \\in \\mathbb{R}^n"}/>과{" "}
                    <InlineMath math={"X_2 \\in \\mathbb{R}^m"}/>으로 쪼개고,{" "}
                    <InlineMath math={"\\mu"}/>와 <InlineMath math={"\\Sigma"}/>도 같은 분할로 나눈다.
                    3장의 Schur complement 결과에 따르면{" "}
                    <InlineMath math={"\\Sigma > 0"}/>인 것은{" "}
                    <InlineMath math={"\\Sigma_{22} > 0"}/>이고{" "}
                    <InlineMath math={"\\Sigma_{11} - \\Sigma_{12}\\Sigma_{22}^{-1}\\Sigma_{21} > 0"}/>인
                    것과 동치다. 두 번째 식을 붙잡아 두자.
                </p>}
            />
            <Theorem title={<T en={<>Key Fact 1: conditional distribution of a Gaussian</>}
                               ko={<>Key Fact 1: 가우시안의 조건부 분포</>}/>}>
                <T
                    en={<p>
                        The conditional distribution of <InlineMath math={"X_1"}/> given{" "}
                        <InlineMath math={"X_2 = x_2"}/> is again multivariate normal, with
                    </p>}
                    ko={<p>
                        <InlineMath math={"X_2 = x_2"}/>가 주어진 <InlineMath math={"X_1"}/>의 조건부
                        분포는 다시 다변량 정규분포이고 다음과 같다.
                    </p>}
                />
                <BlockMath math={"\\mu_{1|2} := \\mu_1 + \\Sigma_{12}\\Sigma_{22}^{-1}(x_2 - \\mu_2), \\qquad \\Sigma_{1|2} := \\Sigma_{11} - \\Sigma_{12}\\Sigma_{22}^{-1}\\Sigma_{21}"}/>
                <Terms items={[
                    ["\\Sigma_{12}\\Sigma_{22}^{-1}", <T en={<>the <strong>gain</strong>: correlation divided by the measured block's own uncertainty. Compare it with <InlineMath math={"PC^\\top[CPC^\\top+Q]^{-1}"}/> from MVE and with <InlineMath math={"K_k"}/> in the filter. They are the same object three times</>}
                                                        ko={<><strong>이득</strong>이다. 상관을 잰 쪽 블록의 불확실성으로 나눈 것이다. MVE의 <InlineMath math={"PC^\\top[CPC^\\top+Q]^{-1}"}/>, 그리고 필터의 <InlineMath math={"K_k"}/>와 견주어 보라. 셋은 같은 대상이다</>}/>],
                    ["x_2 - \\mu_2", <T en={<>the <strong>innovation</strong>: how surprising the measurement was. If the measurement is exactly what was expected, the mean does not move at all</>}
                                       ko={<><strong>innovation</strong>이다. 측정이 얼마나 뜻밖이었는지를 재는 값이다. 기대한 그대로가 나왔다면 평균은 조금도 움직이지 않는다</>}/>],
                    ["\\Sigma_{1|2}", <T en={<>the Schur complement from the paragraph above, and <strong>it does not contain <InlineMath math={"x_2"}/></strong>. How much you learn does not depend on what you read</>}
                                        ko={<>바로 위 문단의 Schur complement이고, <strong><InlineMath math={"x_2"}/>가 들어 있지 않다</strong>. 얼마나 알게 되는지는 무엇을 읽었는지에 좌우되지 않는다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The notes call the general proof "rather painful" and suggest working out the
                        scalar case if you are ambitious. Here it is in full, since the scalar case shows
                        exactly where the two formulas come from.
                    </p>}
                    ko={<p>
                        교재는 일반적인 증명을 "꽤 고통스럽다"고 부르며 의욕이 있으면 스칼라 경우를 해
                        보라고 권한다. 여기 그것을 끝까지 적는다. 두 공식이 어디서 나오는지를 스칼라
                        경우가 정확히 보여 주기 때문이다.
                    </p>}
                />
                <Proof label={<T en={<>the scalar case, in full</>} ko={<>스칼라 경우, 끝까지</>}/>}>
                    <T
                        en={<p>
                            Let <InlineMath math={"X_1, X_2"}/> be scalars with zero mean and
                        </p>}
                        ko={<p>
                            <InlineMath math={"X_1, X_2"}/>가 평균이 0인 스칼라이고 다음과 같다고 하자.
                        </p>}
                    />
                    <BlockMath math={"\\Sigma = \\begin{bmatrix}a & b \\\\ b & c\\end{bmatrix}, \\qquad d := \\det\\Sigma = ac - b^2 > 0, \\qquad \\Sigma^{-1} = \\frac{1}{d}\\begin{bmatrix}c & -b\\\\ -b & a\\end{bmatrix}"}/>
                    <Terms items={[
                        ["a, c", <T en={<>the two variances, both positive</>} ko={<>두 분산이고 모두 양수다</>}/>],
                        ["b", <T en={<>the covariance, with <InlineMath math={"b^2 < ac"}/> forced by <InlineMath math={"d > 0"}/></>}
                                 ko={<>공분산. <InlineMath math={"d > 0"}/>이 <InlineMath math={"b^2 < ac"}/>를 강제한다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The conditional density is the ratio{" "}
                            <InlineMath math={"f_{X_1X_2}(x_1,x_2)/f_{X_2}(x_2)"}/>. Since both are
                            exponentials, the exponent of the ratio is the difference of the exponents.
                            Work on that difference:
                        </p>}
                        ko={<p>
                            조건부 밀도는 비{" "}
                            <InlineMath math={"f_{X_1X_2}(x_1,x_2)/f_{X_2}(x_2)"}/>다. 둘 다 지수 함수라
                            비의 지수는 지수의 차다. 그 차를 다뤄 보자.
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} \\frac{1}{d}\\left(c x_1^2 - 2b x_1 x_2 + a x_2^2\\right) - \\frac{x_2^2}{c} &= \\frac{1}{d}\\left(cx_1^2 - 2bx_1x_2 + x_2^2\\Big(a - \\frac{d}{c}\\Big)\\right) \\\\ &= \\frac{1}{d}\\left(cx_1^2 - 2bx_1x_2 + \\frac{b^2}{c}x_2^2\\right) \\\\ &= \\frac{c}{d}\\left(x_1^2 - 2\\frac{b}{c}x_1x_2 + \\frac{b^2}{c^2}x_2^2\\right) \\\\ &= \\frac{c}{d}\\left(x_1 - \\frac{b}{c}x_2\\right)^2\\end{aligned}"}/>
                    <Terms items={[
                        ["a - d/c", <T en={<>equal to <InlineMath math={"(ac - ac + b^2)/c = b^2/c"}/>: the whole trick is that this leftover is a perfect square's third term</>}
                                      ko={<><InlineMath math={"(ac - ac + b^2)/c = b^2/c"}/>와 같다. 이 남은 항이 완전제곱의 셋째 항이라는 것이 요령의 전부다</>}/>],
                        ["\\frac{c}{d}", <T en={<>equal to <InlineMath math={"1/(a - b^2/c)"}/>, since <InlineMath math={"d/c = a - b^2/c"}/></>}
                                           ko={<><InlineMath math={"d/c = a - b^2/c"}/>이므로 <InlineMath math={"1/(a - b^2/c)"}/>와 같다</>}/>],
                        ["\\left(x_1 - \\tfrac{b}{c}x_2\\right)^2", <T en={<>a completed square, which is what makes the ratio a Gaussian density in <InlineMath math={"x_1"}/> again</>}
                                                                      ko={<>완성된 제곱. 비가 다시 <InlineMath math={"x_1"}/>에 대한 가우시안 밀도가 되는 이유다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            So the exponent is{" "}
                            <InlineMath math={"-\\tfrac12 (x_1 - \\tfrac{b}{c}x_2)^2 / (a - \\tfrac{b^2}{c})"}/>.
                            The constant out front matches too:
                        </p>}
                        ko={<p>
                            그래서 지수는{" "}
                            <InlineMath math={"-\\tfrac12 (x_1 - \\tfrac{b}{c}x_2)^2 / (a - \\tfrac{b^2}{c})"}/>이다.
                            앞에 붙는 상수도 맞아떨어진다.
                        </p>}
                    />
                    <BlockMath math={"\\frac{1}{2\\pi\\sqrt{d}} \\Big/ \\frac{1}{\\sqrt{2\\pi c}} = \\frac{1}{\\sqrt{2\\pi}}\\sqrt{\\frac{c}{d}}^{\\,-1} = \\frac{1}{\\sqrt{2\\pi\\,(a - b^2/c)}}"}/>
                    <Terms items={[
                        ["d/c = a - b^2/c", <T en={<>the same quantity yet again. The normalizer is the square root of the conditional variance, exactly as a one dimensional Gaussian requires</>}
                                              ko={<>또 같은 값이다. 정규화 상수가 조건부 분산의 제곱근이고, 일차원 가우시안이 요구하는 그대로다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Therefore <InlineMath math={"X_1 \\mid X_2 = x_2"}/> is normal with mean{" "}
                            <InlineMath math={"\\tfrac{b}{c}x_2 = \\Sigma_{12}\\Sigma_{22}^{-1}x_2"}/> and
                            variance{" "}
                            <InlineMath math={"a - \\tfrac{b^2}{c} = \\Sigma_{11} - \\Sigma_{12}\\Sigma_{22}^{-1}\\Sigma_{21}"}/>,
                            which is Key Fact 1. The matrix case is the same completion of a square with{" "}
                            <InlineMath math={"b/c"}/> replaced by{" "}
                            <InlineMath math={"\\Sigma_{12}\\Sigma_{22}^{-1}"}/> throughout.
                        </p>}
                        ko={<p>
                            따라서 <InlineMath math={"X_1 \\mid X_2 = x_2"}/>는 평균{" "}
                            <InlineMath math={"\\tfrac{b}{c}x_2 = \\Sigma_{12}\\Sigma_{22}^{-1}x_2"}/>,
                            분산{" "}
                            <InlineMath math={"a - \\tfrac{b^2}{c} = \\Sigma_{11} - \\Sigma_{12}\\Sigma_{22}^{-1}\\Sigma_{21}"}/>인
                            정규분포이고, 그것이 Key Fact 1이다. 행렬 경우도{" "}
                            <InlineMath math={"b/c"}/> 자리에 전부{" "}
                            <InlineMath math={"\\Sigma_{12}\\Sigma_{22}^{-1}"}/>을 넣은 같은 완전제곱
                            만들기다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Example title={<T en={<>Conditioning, with numbers</>} ko={<>조건 걸기, 숫자와 함께</>}/>}>
                <T
                    en={<p>
                        Take the running example one more time,{" "}
                        <InlineMath math={"\\mu = 0"}/> and{" "}
                        <InlineMath math={"\\Sigma = \\begin{bmatrix}4&2\\\\2&2\\end{bmatrix}"}/>, and
                        suppose the sensor reports <InlineMath math={"x_2 = 3"}/>.
                    </p>}
                    ko={<p>
                        계속 쓰는 예제를 한 번 더 꺼낸다. <InlineMath math={"\\mu = 0"}/>이고{" "}
                        <InlineMath math={"\\Sigma = \\begin{bmatrix}4&2\\\\2&2\\end{bmatrix}"}/>인데
                        센서가 <InlineMath math={"x_2 = 3"}/>을 보고했다고 하자.
                    </p>}
                />
                <BlockMath math={"\\mu_{1|2} = 0 + \\frac{2}{2}(3 - 0) = 3, \\qquad \\Sigma_{1|2} = 4 - \\frac{2 \\cdot 2}{2} = 2"}/>
                <Terms items={[
                    ["3", <T en={<>the conditional mean, which happens to equal the reading here because the gain <InlineMath math={"\\Sigma_{12}/\\Sigma_{22}"}/> is exactly 1</>}
                             ko={<>조건부 평균. 이득 <InlineMath math={"\\Sigma_{12}/\\Sigma_{22}"}/>가 정확히 1이라 여기서는 판독값과 같아진다</>}/>],
                    ["2", <T en={<>the conditional variance, half of the prior 4. One measurement of a correlated quantity halved the uncertainty, and it would have halved it for a reading of <InlineMath math={"-17"}/> just the same</>}
                             ko={<>조건부 분산이고 사전 분산 4의 절반이다. 상관된 값을 한 번 재서 불확실성이 반으로 줄었고, 판독값이 <InlineMath math={"-17"}/>이었어도 똑같이 반이 되었을 것이다</>}/>],
                    ["\\rho^2 = 1/2", <T en={<>the fraction of variance explained: <InlineMath math={"\\Sigma_{1|2} = \\Sigma_{11}(1 - \\rho^2)"}/> in the scalar case, so the correlation alone predicts the shrinkage</>}
                                        ko={<>설명된 분산의 비율. 스칼라에서는 <InlineMath math={"\\Sigma_{1|2} = \\Sigma_{11}(1 - \\rho^2)"}/>이므로 상관계수만으로 줄어드는 양이 정해진다</>}/>],
                ]}/>
            </Example>
            <Remark n="5.51" title={<T en={<>The two limits worth knowing</>} ko={<>알아 둘 만한 극한 둘</>}/>}>
                <T
                    en={<ul>
                        <li>If <InlineMath math={"X_1"}/> and <InlineMath math={"X_2"}/> are
                            uncorrelated then <InlineMath math={"\\Sigma_{12} = 0"}/>, so{" "}
                            <InlineMath math={"\\mu_{1|2} = \\mu_1"}/> and{" "}
                            <InlineMath math={"\\Sigma_{1|2} = \\Sigma_{11}"}/>. Measuring{" "}
                            <InlineMath math={"X_2"}/> taught you nothing.</li>
                        <li>If <InlineMath math={"\\Sigma_{22} = \\rho I"}/> with{" "}
                            <InlineMath math={"\\rho \\to \\infty"}/>, the same thing happens in the
                            limit. A sensor with infinite noise is a sensor you do not have. The term{" "}
                            <InlineMath math={"\\Sigma_{12}\\Sigma_{22}^{-1}\\Sigma_{21}"}/> is precisely
                            the value of the information gained.</li>
                    </ul>}
                    ko={<ul>
                        <li><InlineMath math={"X_1"}/>과 <InlineMath math={"X_2"}/>가 무상관이면{" "}
                            <InlineMath math={"\\Sigma_{12} = 0"}/>이라{" "}
                            <InlineMath math={"\\mu_{1|2} = \\mu_1"}/>,{" "}
                            <InlineMath math={"\\Sigma_{1|2} = \\Sigma_{11}"}/>이다.{" "}
                            <InlineMath math={"X_2"}/>를 재서 알게 된 것이 없다.</li>
                        <li><InlineMath math={"\\Sigma_{22} = \\rho I"}/>에서{" "}
                            <InlineMath math={"\\rho \\to \\infty"}/>일 때도 극한에서 같은 일이 벌어진다.
                            잡음이 무한한 센서는 없는 센서다. 항{" "}
                            <InlineMath math={"\\Sigma_{12}\\Sigma_{22}^{-1}\\Sigma_{21}"}/>이 바로 얻은
                            정보의 가치다.</li>
                    </ul>}
                />
            </Remark>
            <Theorem title={<T en={<>Key Fact 2: conditional independence</>} ko={<>Key Fact 2: 조건부 독립</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"X_1, X_2, X_3"}/> be jointly normal with{" "}
                        <InlineMath math={"X_2"}/> independent of both{" "}
                        <InlineMath math={"X_1"}/> and <InlineMath math={"X_3"}/>, so the covariance has
                        the shape below. Then <InlineMath math={"X_{1|X_3}"}/> and{" "}
                        <InlineMath math={"X_{2|X_3}"}/> are independent.
                    </p>}
                    ko={<p>
                        <InlineMath math={"X_1, X_2, X_3"}/>가 결합 정규분포를 따르고{" "}
                        <InlineMath math={"X_2"}/>가 <InlineMath math={"X_1"}/>과{" "}
                        <InlineMath math={"X_3"}/> 양쪽 모두와 독립이라 공분산이 아래 모양이라 하자.
                        그러면 <InlineMath math={"X_{1|X_3}"}/>과{" "}
                        <InlineMath math={"X_{2|X_3}"}/>은 독립이다.
                    </p>}
                />
                <BlockMath math={"\\Sigma = \\begin{bmatrix}\\Sigma_{11} & 0 & \\Sigma_{13} \\\\ 0 & \\Sigma_{22} & 0 \\\\ \\Sigma_{13}^\\top & 0 & \\Sigma_{33}\\end{bmatrix} \\;\\Longrightarrow\\; \\operatorname{cov}\\left(\\begin{bmatrix}X_{1|X_3}\\\\X_{2|X_3}\\end{bmatrix}\\right) = \\begin{bmatrix}\\Sigma_{11} - \\Sigma_{13}\\Sigma_{33}^{-1}\\Sigma_{13}^\\top & 0 \\\\ 0 & \\Sigma_{22}\\end{bmatrix}"}/>
                <Terms items={[
                    ["\\Sigma_{12} = \\Sigma_{23} = 0", <T en={<>the hypothesis: <InlineMath math={"X_2"}/> is independent of the other two</>}
                                                          ko={<>가정. <InlineMath math={"X_2"}/>가 나머지 둘과 독립이라는 뜻이다</>}/>],
                    ["\\text{off-diagonal } 0", <T en={<>the conclusion, obtained by applying Key Fact 1 with <InlineMath math={"[X_1; X_2]"}/> as the first block and <InlineMath math={"X_3"}/> as the second. Uncorrelated plus normal gives independent</>}
                                                  ko={<>결론. <InlineMath math={"[X_1; X_2]"}/>를 첫 블록, <InlineMath math={"X_3"}/>를 둘째 블록으로 두고 Key Fact 1을 적용하면 나온다. 무상관에 정규를 더하면 독립이다</>}/>],
                    ["\\Sigma_{22}", <T en={<>untouched: conditioning on <InlineMath math={"X_3"}/> tells you nothing about <InlineMath math={"X_2"}/>, exactly as Remark 5.51 predicts</>}
                                       ko={<>손대지 않은 채로 남는다. <InlineMath math={"X_3"}/>를 조건으로 걸어도 <InlineMath math={"X_2"}/>에 대해서는 아무것도 알게 되지 않는다. Remark 5.51 그대로다</>}/>],
                ]}/>
                <T
                    en={<p>
                        In the filter this is what licenses sentences like "the measurement noise{" "}
                        <InlineMath math={"v_k"}/> is independent of the state, therefore{" "}
                        <InlineMath math={"v_k"}/> conditioned on all past measurements is still
                        independent of the state conditioned on them, and is still just{" "}
                        <InlineMath math={"v_k"}/>". Without Key Fact 2 the derivation cannot take a
                        single step.
                    </p>}
                    ko={<p>
                        필터에서는 이것이 "측정 잡음 <InlineMath math={"v_k"}/>가 상태와 독립이므로,
                        과거 측정 전부를 조건으로 건 <InlineMath math={"v_k"}/>도 같은 조건을 건 상태와
                        여전히 독립이고, 여전히 그냥 <InlineMath math={"v_k"}/>다" 같은 문장을 허락해
                        준다. Key Fact 2가 없으면 유도는 한 걸음도 나아가지 못한다.
                    </p>}
                />
            </Theorem>
            <Theorem title={<T en={<>Key Fact 3: covariance of a sum of independent normals</>}
                               ko={<>Key Fact 3: 독립인 정규 확률 벡터 합의 공분산</>}/>}>
                <T
                    en={<p>
                        For independent <InlineMath math={"X_1, X_2"}/> and{" "}
                        <InlineMath math={"Y = AX_1 + BX_2"}/>,
                    </p>}
                    ko={<p>
                        <InlineMath math={"X_1, X_2"}/>가 독립이고{" "}
                        <InlineMath math={"Y = AX_1 + BX_2"}/>일 때 다음이 성립한다.
                    </p>}
                />
                <BlockMath math={"\\mu_Y = A\\mu_1 + B\\mu_2, \\qquad \\operatorname{cov}(Y,Y) = A\\Sigma_{11}A^\\top + B\\Sigma_{22}B^\\top"}/>
                <Terms items={[
                    ["A\\Sigma_{11}A^\\top", <T en={<>the first source's contribution, pushed through <InlineMath math={"A"}/> as in Theorem 5.46</>}
                                               ko={<>첫 번째 원천의 몫. Theorem 5.46처럼 <InlineMath math={"A"}/>를 통과시킨 것이다</>}/>],
                    ["\\text{no cross terms}", <T en={<>because <InlineMath math={"\\mathcal{E}\\{(X_1-\\mu_1)(X_2-\\mu_2)^\\top\\} = 0"}/> and its transpose are both zero. Independence is what removes them</>}
                                                 ko={<><InlineMath math={"\\mathcal{E}\\{(X_1-\\mu_1)(X_2-\\mu_2)^\\top\\} = 0"}/>과 그 transpose가 둘 다 0이기 때문이다. 교차항을 지우는 것이 독립성이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The printed derivation states the two vanishing cross terms as{" "}
                        <InlineMath math={"\\mathcal{E}\\{(X_1-\\mu_1)(X_2-\\mu_2)^\\top\\} = 0"}/> and{" "}
                        <InlineMath math={"\\mathcal{E}\\{(X_2-\\mu_2)(X_2-\\mu_2)^\\top\\} = 0"}/>. The
                        second is <InlineMath math={"\\Sigma_{22}"}/>, which is certainly not zero. What
                        is meant is{" "}
                        <InlineMath math={"\\mathcal{E}\\{(X_2-\\mu_2)(X_1-\\mu_1)^\\top\\} = 0"}/>, the
                        transpose of the first.
                    </p>}
                    ko={<p>
                        인쇄된 유도는 사라지는 교차항 둘을{" "}
                        <InlineMath math={"\\mathcal{E}\\{(X_1-\\mu_1)(X_2-\\mu_2)^\\top\\} = 0"}/>과{" "}
                        <InlineMath math={"\\mathcal{E}\\{(X_2-\\mu_2)(X_2-\\mu_2)^\\top\\} = 0"}/>으로
                        적는다. 뒤의 것은 <InlineMath math={"\\Sigma_{22}"}/>이고 그것이 0일 리 없다.
                        의도한 것은 앞의 것의 transpose인{" "}
                        <InlineMath math={"\\mathcal{E}\\{(X_2-\\mu_2)(X_1-\\mu_1)^\\top\\} = 0"}/>이다.
                    </p>}
                />
            </Theorem>
            <Theorem title={<T en={<>Key Fact 4: conditioning can be done in stages</>}
                               ko={<>Key Fact 4: 조건은 나눠서 걸 수 있다</>}/>}>
                <T
                    en={<p>
                        For jointly distributed <InlineMath math={"X, Y, Z"}/> with a density,
                    </p>}
                    ko={<p>
                        밀도를 갖는 결합 분포의 <InlineMath math={"X, Y, Z"}/>에 대해 다음이 성립한다.
                    </p>}
                />
                <BlockMath math={"(X|Z)\\big|(Y|Z) \\;\\sim\\; \\frac{f_{(X|Z)(Y|Z)}}{f_{(Y|Z)}} = \\frac{f_{XYZ}/f_Z}{f_{YZ}/f_Z} = \\frac{f_{XYZ}}{f_{YZ}} \\;\\sim\\; X\\Big|\\begin{bmatrix}Y\\\\Z\\end{bmatrix}"}/>
                <Terms items={[
                    ["(X|Z)|(Y|Z)", <T en={<>condition on <InlineMath math={"Z"}/> first, then condition the result on the similarly conditioned <InlineMath math={"Y"}/>: two small steps</>}
                                      ko={<>먼저 <InlineMath math={"Z"}/>로 조건을 걸고, 그 결과에 같은 조건을 건 <InlineMath math={"Y"}/>로 다시 조건을 건다. 작은 두 걸음이다</>}/>],
                    ["X|(Y,Z)", <T en={<>condition on everything at once: one big step</>}
                                  ko={<>전부 한꺼번에 조건으로 건다. 큰 한 걸음이다</>}/>],
                    ["f_Z", <T en={<>cancels top and bottom, which is the entire proof. Note this fact needs no normality at all</>}
                               ko={<>분자와 분모에서 지워진다. 증명은 그것이 전부다. 이 사실에는 정규성이 전혀 필요 없다는 점을 눈여겨보자</>}/>],
                ]}/>
                <T
                    en={<p>
                        <strong>This is the fact that makes a filter possible.</strong> The left hand side
                        is recursive, since it reuses a distribution already conditioned on the past. The
                        right hand side is a batch computation over all data. They are equal, so the
                        recursion loses nothing.
                    </p>}
                    ko={<p>
                        <strong>필터를 가능하게 만드는 사실이 이것이다.</strong> 왼쪽은 이미 과거를
                        조건으로 걸어 둔 분포를 재사용하므로 재귀적이다. 오른쪽은 데이터 전체를 한꺼번에
                        처리하는 배치 계산이다. 둘이 같으므로 재귀로 바꿔도 잃는 것이 없다.
                    </p>}
                />
            </Theorem>
            <Remark title={<T en={<>Optional read: the information matrix (notes 5.9)</>}
                              ko={<>선택 읽기: 정보 행렬 (교재 5.9)</>}/>}>
                <T
                    en={<p>
                        A normal distribution can be carried around as{" "}
                        <InlineMath math={"(\\mu, \\Sigma)"}/> or as{" "}
                        <InlineMath math={"(\\eta, \\Lambda)"}/> with{" "}
                        <InlineMath math={"\\Lambda := \\Sigma^{-1}"}/> and{" "}
                        <InlineMath math={"\\eta := \\Lambda\\mu"}/>. The two are equivalent, related by
                        inversion, and each makes a different operation trivial. Nothing in the Kalman
                        filter requires this, so it can be skipped, but it explains why large SLAM
                        problems are written this way.
                    </p>}
                    ko={<p>
                        정규분포는 <InlineMath math={"(\\mu, \\Sigma)"}/>로 들고 다닐 수도 있고{" "}
                        <InlineMath math={"\\Lambda := \\Sigma^{-1}"}/>,{" "}
                        <InlineMath math={"\\eta := \\Lambda\\mu"}/>를 써서{" "}
                        <InlineMath math={"(\\eta, \\Lambda)"}/>로 들고 다닐 수도 있다. 둘은 역행렬로
                        연결된 동등한 표현이고, 각각 서로 다른 연산을 쉽게 만든다. 칼만 필터에는 필요
                        없으니 건너뛰어도 되지만, 큰 SLAM 문제를 왜 이렇게 적는지가 여기서 설명된다.
                    </p>}
                />
                <BlockMath math={"\\Lambda_{1|2} = \\Lambda_{11}, \\qquad \\eta_{1|2} = \\eta_1 - \\Lambda_{12}x_2"}/>
                <Terms items={[
                    ["\\Lambda_{1|2} = \\Lambda_{11}", <T en={<>Fact 5.65: conditioning in the information form is <em>deleting a block</em>. Compare with <InlineMath math={"\\Sigma_{11} - \\Sigma_{12}\\Sigma_{22}^{-1}\\Sigma_{21}"}/>, which needs an inverse</>}
                                                         ko={<>Fact 5.65. 정보 형태에서 조건 걸기는 <em>블록 하나를 지우는 일</em>이다. 역행렬이 필요한 <InlineMath math={"\\Sigma_{11} - \\Sigma_{12}\\Sigma_{22}^{-1}\\Sigma_{21}"}/>과 견주어 보라</>}/>],
                    ["\\eta_{1|2}", <T en={<>the scaled mean, updated by one matrix-vector product</>}
                                      ko={<>배율이 걸린 평균. 행렬 벡터 곱 한 번으로 갱신된다</>}/>],
                    ["\\Lambda_{11}", <T en={<>note this is <em>not</em> <InlineMath math={"\\Sigma_{11}^{-1}"}/>. Blockwise inversion gives <InlineMath math={"\\Lambda_{11} = (\\Sigma_{11} - \\Sigma_{12}\\Sigma_{22}^{-1}\\Sigma_{21})^{-1}"}/>, which is exactly the inverse of the conditional covariance</>}
                                        ko={<><InlineMath math={"\\Sigma_{11}^{-1}"}/>이 <em>아니라는</em> 점에 주의. 블록 역행렬 공식이 <InlineMath math={"\\Lambda_{11} = (\\Sigma_{11} - \\Sigma_{12}\\Sigma_{22}^{-1}\\Sigma_{21})^{-1}"}/>을 주는데, 이것이 정확히 조건부 공분산의 역행렬이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Marginalizing is the hard direction in this form, and conditioning is the hard one
                        in the covariance form. The pair below is the same statement written twice, and
                        the right hand version is a single addition:
                    </p>}
                    ko={<p>
                        이 형태에서는 주변화가 어려운 방향이고, 공분산 형태에서는 조건 걸기가 어려운
                        방향이다. 아래 짝은 같은 진술을 두 번 적은 것인데, 오른쪽 판본은 덧셈 한 번이다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} P^+ &= P^- - P^-C^\\top\\left[CP^-C^\\top + Q\\right]^{-1}CP^- \\\\[4pt] \\Longleftrightarrow \\quad (P^+)^{-1} &= (P^-)^{-1} + C^\\top Q^{-1}C \\end{aligned}"}/>
                <Terms items={[
                    ["P^-, P^+", <T en={<>the covariance before and after absorbing one measurement</>}
                                   ko={<>측정 하나를 흡수하기 전과 후의 공분산</>}/>],
                    ["C^\\top Q^{-1}C", <T en={<>the information the measurement adds. It has rank at most <InlineMath math={"m"}/>, so a single scalar sensor adds a rank one term and constrains exactly one direction</>}
                                          ko={<>측정이 보태는 정보. rank가 많아야 <InlineMath math={"m"}/>이라, 스칼라 센서 하나는 rank 1짜리 항을 더하고 정확히 한 방향만 조인다</>}/>],
                    ["\\Longleftrightarrow", <T en={<>the matrix inversion lemma again, the same identity proved in Remark 5.28</>}
                                               ko={<>또 matrix inversion lemma다. Remark 5.28에서 증명한 바로 그 항등식이다</>}/>],
                ]}/>
                <CanvasFigure label={t("A measurement adds information, and information adds",
                    "측정은 정보를 보태고, 정보는 더해진다")}
                              modal={<InformationFusion width={640} height={470}/>}
                              bodyClassName="w-[min(92vw,680px)]">
                    <InformationFusion/>
                </CanvasFigure>
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>The Discrete-time Kalman Filter</h2>} ko={<h2>이산시간 칼만 필터</h2>}/>
            <T
                en={<p>
                    Everything so far estimated a quantity that sat still. Now the thing being estimated
                    moves between measurements, and the measurements arrive forever. Running MVE as a
                    batch would mean re-solving a linear system whose size grows with time, which fails
                    on a robot within seconds. The filter computes the same answer recursively, at a cost
                    per step that never grows.
                </p>}
                ko={<p>
                    지금까지는 가만히 있는 값을 추정했다. 이제 추정 대상이 측정 사이에 움직이고, 측정은
                    끝없이 들어온다. MVE를 배치로 돌린다는 것은 크기가 시간에 따라 자라는 선형 계를 매번
                    다시 푼다는 뜻이고, 로봇 위에서는 몇 초 만에 무너진다. 필터는 같은 답을 재귀적으로,
                    한 걸음의 비용이 결코 자라지 않는 채로 계산한다.
                </p>}
            />
            <BlockMath math={"\\begin{aligned} x_{k+1} &= A_k x_k + G_k w_k, \\qquad x_0 \\;\\text{ given as } \\; \\bar{x}_0, P_0 \\\\ y_k &= C_k x_k + v_k \\end{aligned}"}/>
            <Terms items={[
                ["x_k \\in \\mathbb{R}^n", <T en={<>the state at time <InlineMath math={"k"}/>: everything about the system you would need to predict its future</>}
                                             ko={<>시각 <InlineMath math={"k"}/>의 상태. 미래를 예측하는 데 필요한 이 시스템의 모든 것이다</>}/>],
                ["w_k \\in \\mathbb{R}^p", <T en={<>process noise, zero mean, <InlineMath math={"\\operatorname{cov}(w_k, w_l) = R_k\\delta_{kl}"}/></>}
                                             ko={<>과정 잡음. 평균이 0이고 <InlineMath math={"\\operatorname{cov}(w_k, w_l) = R_k\\delta_{kl}"}/>이다</>}/>],
                ["v_k \\in \\mathbb{R}^m", <T en={<>measurement noise, zero mean, <InlineMath math={"\\operatorname{cov}(v_k, v_l) = Q_k\\delta_{kl}"}/></>}
                                             ko={<>측정 잡음. 평균이 0이고 <InlineMath math={"\\operatorname{cov}(v_k, v_l) = Q_k\\delta_{kl}"}/>이다</>}/>],
                ["\\delta_{kl}", <T en={<>one when <InlineMath math={"k = l"}/> and zero otherwise. This is what <strong>white</strong> means: noise at one instant says nothing about noise at any other</>}
                                   ko={<><InlineMath math={"k = l"}/>일 때 1이고 아니면 0이다. <strong>백색</strong>이라는 말의 뜻이 이것이다. 어느 순간의 잡음도 다른 순간의 잡음에 대해 아무것도 말해 주지 않는다</>}/>],
                ["\\bar{x}_0, P_0", <T en={<>the mean and covariance of the initial condition, the prior you start the filter with</>}
                                      ko={<>초기 조건의 평균과 공분산. 필터를 시작할 때 들고 들어가는 사전 분포다</>}/>],
            ]}/>
            <T
                en={<p>
                    The assumptions are worth reading one at a time, because the derivation spends each
                    of them exactly once. All of{" "}
                    <InlineMath math={"x_0, w_k, v_l"}/> are jointly Gaussian; both noises are white and
                    zero mean; <InlineMath math={"\\operatorname{cov}(w_k, v_l) = 0"}/>; and{" "}
                    <InlineMath math={"x_0"}/> is uncorrelated with both noise sequences. In one matrix,
                </p>}
                ko={<p>
                    가정은 하나씩 읽어 둘 만하다. 유도가 각각을 정확히 한 번씩 쓰기 때문이다.{" "}
                    <InlineMath math={"x_0, w_k, v_l"}/>은 모두 결합 가우시안이고, 두 잡음은 백색이며
                    평균이 0이고, <InlineMath math={"\\operatorname{cov}(w_k, v_l) = 0"}/>이며,{" "}
                    <InlineMath math={"x_0"}/>는 두 잡음열 모두와 무상관이다. 행렬 하나로 적으면 이렇다.
                </p>}
            />
            <BlockMath math={"\\operatorname{cov}\\left(\\begin{bmatrix}w_k\\\\v_k\\\\x_0\\end{bmatrix}, \\begin{bmatrix}w_l\\\\v_l\\\\x_0\\end{bmatrix}\\right) = \\begin{bmatrix} R_k\\delta_{kl} & 0 & 0 \\\\ 0 & Q_k\\delta_{kl} & 0 \\\\ 0 & 0 & P_0\\end{bmatrix}"}/>
            <Terms items={[
                ["R_k", <T en={<>process noise covariance. Large <InlineMath math={"R_k"}/> means "my model is a lie", which makes the filter trust measurements more</>}
                           ko={<>과정 잡음 공분산. <InlineMath math={"R_k"}/>가 크다는 것은 "내 모델은 거짓말"이라는 뜻이고, 그러면 필터가 측정을 더 믿는다</>}/>],
                ["Q_k", <T en={<>measurement noise covariance. Large <InlineMath math={"Q_k"}/> means "my sensor is a liar", which makes the filter trust the model more</>}
                           ko={<>측정 잡음 공분산. <InlineMath math={"Q_k"}/>가 크다는 것은 "내 센서는 거짓말쟁이"라는 뜻이고, 그러면 필터가 모델을 더 믿는다</>}/>],
                ["\\text{all zero blocks}", <T en={<>every pair of distinct sources is uncorrelated, and since everything is jointly Gaussian, Fact 5.45 upgrades that to independent</>}
                                              ko={<>서로 다른 원천끼리는 전부 무상관이다. 전부 결합 가우시안이므로 Fact 5.45가 그것을 독립으로 격상시킨다</>}/>],
            ]}/>
            <Lemma n="5.52" title={<T en={<>What the model structure gives for free</>}
                                       ko={<>모델 구조가 거저 주는 것</>}/>}>
                <T
                    en={<ul>
                        <li>For <InlineMath math={"k \\ge 1"}/>, <InlineMath math={"x_k"}/> is a linear
                            combination of <InlineMath math={"x_0, w_0, \\ldots, w_{k-1}"}/>. In
                            particular <InlineMath math={"x_k"}/> is uncorrelated with{" "}
                            <InlineMath math={"w_k"}/>.</li>
                        <li>For <InlineMath math={"k \\ge 1"}/>, <InlineMath math={"y_k"}/> is a linear
                            combination of <InlineMath math={"x_0, w_0, \\ldots, w_{k-1}"}/> and{" "}
                            <InlineMath math={"v_0, \\ldots, v_k"}/>. In particular{" "}
                            <InlineMath math={"y_k"}/> is uncorrelated with{" "}
                            <InlineMath math={"w_k"}/>.</li>
                        <li>For <InlineMath math={"k \\ge 0"}/>, <InlineMath math={"v_k"}/> is
                            uncorrelated with <InlineMath math={"x_k"}/>.</li>
                    </ul>}
                    ko={<ul>
                        <li><InlineMath math={"k \\ge 1"}/>일 때 <InlineMath math={"x_k"}/>는{" "}
                            <InlineMath math={"x_0, w_0, \\ldots, w_{k-1}"}/>의 선형 결합이다. 특히{" "}
                            <InlineMath math={"x_k"}/>는 <InlineMath math={"w_k"}/>와 무상관이다.</li>
                        <li><InlineMath math={"k \\ge 1"}/>일 때 <InlineMath math={"y_k"}/>는{" "}
                            <InlineMath math={"x_0, w_0, \\ldots, w_{k-1}"}/>과{" "}
                            <InlineMath math={"v_0, \\ldots, v_k"}/>의 선형 결합이다. 특히{" "}
                            <InlineMath math={"y_k"}/>는 <InlineMath math={"w_k"}/>와 무상관이다.</li>
                        <li><InlineMath math={"k \\ge 0"}/>일 때 <InlineMath math={"v_k"}/>는{" "}
                            <InlineMath math={"x_k"}/>와 무상관이다.</li>
                    </ul>}
                />
                <Proof label={<T en={<>the induction the notes skip</>} ko={<>교재가 건너뛴 귀납법</>}/>}>
                    <T
                        en={<p>
                            The notes say "we skip it, the reader can easily fill it in". Filling it in
                            takes four lines. <strong>Base case.</strong>{" "}
                            <InlineMath math={"x_1 = A_0x_0 + G_0w_0"}/> is a linear combination of{" "}
                            <InlineMath math={"x_0"}/> and <InlineMath math={"w_0"}/>, as claimed.{" "}
                            <strong>Induction step.</strong> Suppose{" "}
                            <InlineMath math={"x_k = \\Phi x_0 + \\sum_{j=0}^{k-1}\\Gamma_j w_j"}/> for
                            some matrices <InlineMath math={"\\Phi, \\Gamma_j"}/>. Then
                        </p>}
                        ko={<p>
                            교재는 "건너뛴다, 독자가 쉽게 채울 수 있다"고 적는다. 채우는 데 네 줄이면
                            된다. <strong>기저 단계.</strong>{" "}
                            <InlineMath math={"x_1 = A_0x_0 + G_0w_0"}/>은 주장대로{" "}
                            <InlineMath math={"x_0"}/>과 <InlineMath math={"w_0"}/>의 선형 결합이다.{" "}
                            <strong>귀납 단계.</strong> 어떤 행렬{" "}
                            <InlineMath math={"\\Phi, \\Gamma_j"}/>에 대해{" "}
                            <InlineMath math={"x_k = \\Phi x_0 + \\sum_{j=0}^{k-1}\\Gamma_j w_j"}/>라
                            하자. 그러면
                        </p>}
                    />
                    <BlockMath math={"x_{k+1} = A_k x_k + G_k w_k = \\underbrace{A_k\\Phi}_{\\text{new } \\Phi} x_0 + \\sum_{j=0}^{k-1}\\underbrace{A_k\\Gamma_j}_{\\text{new }\\Gamma_j} w_j + \\underbrace{G_k}_{\\text{new }\\Gamma_k} w_k"}/>
                    <Terms items={[
                        ["\\Phi, \\Gamma_j", <T en={<>the coefficient matrices, whatever they happen to be. Their values never matter, only that they exist</>}
                                               ko={<>계수 행렬들. 그것이 무엇이든 상관없다. 값은 한 번도 쓰이지 않고 존재한다는 사실만 쓰인다</>}/>],
                        ["w_k", <T en={<>appears in <InlineMath math={"x_{k+1}"}/> but not in <InlineMath math={"x_k"}/>, which is the whole point</>}
                                  ko={<><InlineMath math={"x_{k+1}"}/>에는 나타나고 <InlineMath math={"x_k"}/>에는 나타나지 않는다. 요점이 그것이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            So the form is preserved and the claim holds for all{" "}
                            <InlineMath math={"k \\ge 1"}/>. Now{" "}
                            <InlineMath math={"w_k"}/> is uncorrelated with{" "}
                            <InlineMath math={"x_0"}/> by assumption and with{" "}
                            <InlineMath math={"w_j"}/> for <InlineMath math={"j < k"}/> by whiteness, so
                            it is uncorrelated with every term of the sum, hence with{" "}
                            <InlineMath math={"x_k"}/>. The statement for{" "}
                            <InlineMath math={"y_k = C_kx_k + v_k"}/> follows because{" "}
                            <InlineMath math={"w_k"}/> is also uncorrelated with{" "}
                            <InlineMath math={"v_k"}/>. The third item is the same argument with the
                            roles of the two noises exchanged.
                        </p>}
                        ko={<p>
                            그러니 꼴이 보존되고 주장은 모든 <InlineMath math={"k \\ge 1"}/>에 대해
                            성립한다. 이제 <InlineMath math={"w_k"}/>는 가정에 의해{" "}
                            <InlineMath math={"x_0"}/>과 무상관이고 백색성에 의해{" "}
                            <InlineMath math={"j < k"}/>인 <InlineMath math={"w_j"}/>와도 무상관이므로,
                            합의 모든 항과 무상관이고 따라서 <InlineMath math={"x_k"}/>와도 무상관이다.{" "}
                            <InlineMath math={"y_k = C_kx_k + v_k"}/>에 대한 진술은{" "}
                            <InlineMath math={"w_k"}/>가 <InlineMath math={"v_k"}/>와도 무상관이라
                            따라 나온다. 셋째 항목은 두 잡음의 역할을 바꾼 같은 논증이다.
                        </p>}
                    />
                </Proof>
            </Lemma>
            <Definition n="5.53" title={<T en={<>The four objects the filter carries</>}
                                           ko={<>필터가 들고 다니는 네 가지</>}/>}>
                <T
                    en={<p>
                        Write <InlineMath math={"Y_k = (y_k, y_{k-1}, \\ldots, y_0)"}/> for all
                        measurements up to and including time <InlineMath math={"k"}/>, and note that{" "}
                        <InlineMath math={"Y_k = (y_k, Y_{k-1})"}/>. That splitting is the one Key Fact 4
                        will act on.
                    </p>}
                    ko={<p>
                        시각 <InlineMath math={"k"}/>까지의 측정 전부를{" "}
                        <InlineMath math={"Y_k = (y_k, y_{k-1}, \\ldots, y_0)"}/>으로 적자.{" "}
                        <InlineMath math={"Y_k = (y_k, Y_{k-1})"}/>이라는 점을 눈여겨보라. Key Fact 4가
                        작용할 자리가 바로 이 쪼개기다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} \\hat{x}_{k|k} &:= \\mathcal{E}\\{x_k \\mid Y_k\\}, & P_{k|k} &:= \\mathcal{E}\\{(x_k - \\hat{x}_{k|k})(x_k-\\hat{x}_{k|k})^\\top \\mid Y_k\\} \\\\ \\hat{x}_{k+1|k} &:= \\mathcal{E}\\{x_{k+1} \\mid Y_k\\}, & P_{k+1|k} &:= \\mathcal{E}\\{(x_{k+1} - \\hat{x}_{k+1|k})(x_{k+1}-\\hat{x}_{k+1|k})^\\top \\mid Y_k\\}\\end{aligned}"}/>
                <Terms items={[
                    ["\\hat{x}_{k|k}", <T en={<>the best estimate of the current state using everything measured so far. Sometimes called the <em>corrected</em> or <em>a posteriori</em> estimate</>}
                                         ko={<>지금까지 잰 전부를 써서 만든 현재 상태의 최선 추정. <em>보정된</em> 추정 또는 <em>사후</em> 추정이라고도 한다</>}/>],
                    ["\\hat{x}_{k+1|k}", <T en={<>the best estimate of the <em>next</em> state, before its measurement arrives. The <em>predicted</em> or <em>a priori</em> estimate</>}
                                           ko={<>측정이 도착하기 전에 만든 <em>다음</em> 상태의 최선 추정. <em>예측된</em> 추정 또는 <em>사전</em> 추정이다</>}/>],
                    ["P_{k|k}, P_{k+1|k}", <T en={<>the corresponding covariances. Because the whole model is jointly Gaussian, the pair (mean, covariance) <em>is</em> the entire conditional distribution: nothing is being thrown away by tracking only two moments</>}
                                             ko={<>각각에 대응하는 공분산. 모델 전체가 결합 가우시안이므로 (평균, 공분산) 짝이 조건부 분포 그 자체<em>다</em>. 적률 둘만 들고 다녀도 버려지는 것이 없다</>}/>],
                ]}/>
            </Definition>
            <Theorem title={<T en={<>The discrete-time Kalman filter</>} ko={<>이산시간 칼만 필터</>}/>}>
                <T
                    en={<p>
                        Start from{" "}
                        <InlineMath math={"\\hat{x}_{0|-1} := \\bar{x}_0"}/> and{" "}
                        <InlineMath math={"P_{0|-1} := P_0"}/>, then for{" "}
                        <InlineMath math={"k \\ge 0"}/> alternate two steps.{" "}
                        <strong>Measurement update</strong>, which folds in{" "}
                        <InlineMath math={"y_k"}/>:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\hat{x}_{0|-1} := \\bar{x}_0"}/>과{" "}
                        <InlineMath math={"P_{0|-1} := P_0"}/>에서 출발해{" "}
                        <InlineMath math={"k \\ge 0"}/>에 대해 두 단계를 번갈아 밟는다.{" "}
                        <InlineMath math={"y_k"}/>를 접어 넣는 <strong>측정 갱신</strong>은 이렇다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} K_k &= P_{k|k-1}C_k^\\top\\left(C_kP_{k|k-1}C_k^\\top + Q_k\\right)^{-1} \\\\ \\hat{x}_{k|k} &= \\hat{x}_{k|k-1} + K_k\\left(y_k - C_k\\hat{x}_{k|k-1}\\right) \\\\ P_{k|k} &= P_{k|k-1} - K_kC_kP_{k|k-1}\\end{aligned}"}/>
                <Terms items={[
                    ["K_k", <T en={<>the <strong>Kalman gain</strong>. It is Key Fact 1's <InlineMath math={"\\Sigma_{12}\\Sigma_{22}^{-1}"}/> and MVE's <InlineMath math={"PC^\\top[CPC^\\top+Q]^{-1}"}/>, with <InlineMath math={"P_{k|k-1}"}/> playing the role of the prior</>}
                               ko={<><strong>칼만 이득</strong>. Key Fact 1의 <InlineMath math={"\\Sigma_{12}\\Sigma_{22}^{-1}"}/>이자 MVE의 <InlineMath math={"PC^\\top[CPC^\\top+Q]^{-1}"}/>이고, 사전 분포 자리에 <InlineMath math={"P_{k|k-1}"}/>이 들어간 것이다</>}/>],
                    ["y_k - C_k\\hat{x}_{k|k-1}", <T en={<>the <strong>innovation</strong>: measured minus predicted. If the model already predicted the reading, the estimate does not move</>}
                                                    ko={<><strong>innovation</strong>. 잰 값에서 예측한 값을 뺀 것이다. 모델이 이미 그 판독값을 예측했다면 추정은 움직이지 않는다</>}/>],
                    ["C_kP_{k|k-1}C_k^\\top + Q_k", <T en={<>the covariance of the innovation: how surprised you are entitled to be, counting both state uncertainty and sensor noise</>}
                                                      ko={<>innovation의 공분산. 상태의 불확실성과 센서 잡음을 함께 세어, 얼마나 놀라도 되는지를 말해 준다</>}/>],
                    ["K_kC_kP_{k|k-1}", <T en={<>the reduction in covariance. Remark 5.57 notes it is symmetric positive semidefinite, so a measurement can never increase uncertainty</>}
                                          ko={<>줄어드는 공분산의 양. Remark 5.57은 이것이 대칭이고 positive semidefinite이라고 짚는다. 측정이 불확실성을 늘리는 일은 결코 없다</>}/>],
                ]}/>
                <T
                    en={<p>
                        <strong>Time update</strong>, which pushes the estimate one step forward through
                        the model:
                    </p>}
                    ko={<p>
                        <strong>시간 갱신</strong>은 추정을 모델을 통해 한 걸음 앞으로 민다.
                    </p>}
                />
                <BlockMath math={"\\hat{x}_{k+1|k} = A_k\\hat{x}_{k|k}, \\qquad P_{k+1|k} = A_kP_{k|k}A_k^\\top + G_kR_kG_k^\\top"}/>
                <Terms items={[
                    ["A_k\\hat{x}_{k|k}", <T en={<>the model run forward with the noise set to its mean, which is zero</>}
                                            ko={<>잡음을 평균값인 0으로 두고 모델을 한 걸음 굴린 것</>}/>],
                    ["A_kP_{k|k}A_k^\\top", <T en={<>the old uncertainty, transported by Theorem 5.46. For an unstable <InlineMath math={"A_k"}/> this term alone grows</>}
                                              ko={<>기존 불확실성을 Theorem 5.46으로 실어 나른 것. <InlineMath math={"A_k"}/>가 불안정하면 이 항만으로도 자란다</>}/>],
                    ["G_kR_kG_k^\\top", <T en={<>new uncertainty injected by the process noise. <strong>Prediction always adds.</strong> It is the only term in the whole filter that can make <InlineMath math={"P"}/> grow when the model is stable</>}
                                          ko={<>과정 잡음이 새로 주입하는 불확실성. <strong>예측은 언제나 더한다.</strong> 모델이 안정할 때 <InlineMath math={"P"}/>를 키울 수 있는 항은 필터 전체에서 이것 하나뿐이다</>}/>],
                ]}/>
            </Theorem>
            <CanvasFigure label={t("Predict widens, update narrows, and K is where the two meet",
                "예측은 넓히고 갱신은 좁힌다. K는 그 둘이 만나는 자리다")}
                          modal={<KalmanFilter1D width={860} height={560}/>}
                          bodyClassName="w-[min(94vw,900px)]">
                <KalmanFilter1D/>
            </CanvasFigure>
            <Remark title={<T en={<>The covariance recursion never looks at the data</>}
                              ko={<>공분산 점화식은 데이터를 보지 않는다</>}/>}>
                <T
                    en={<p>
                        Read the two boxes again and notice what is <em>not</em> in them.{" "}
                        <InlineMath math={"K_k"}/>, <InlineMath math={"P_{k|k}"}/> and{" "}
                        <InlineMath math={"P_{k+1|k}"}/> depend only on{" "}
                        <InlineMath math={"A_k, C_k, G_k, Q_k, R_k, P_0"}/>. No measurement appears. So
                        the entire gain schedule can be computed before the robot is switched on, or
                        before it is even built, and the covariance is a statement about the{" "}
                        <em>experiment design</em> rather than about the data. Substituting the
                        measurement update into the time update gives the recursion in one line:
                    </p>}
                    ko={<p>
                        두 상자를 다시 읽고 거기에 <em>없는</em> 것을 보라.{" "}
                        <InlineMath math={"K_k"}/>, <InlineMath math={"P_{k|k}"}/>,{" "}
                        <InlineMath math={"P_{k+1|k}"}/>은 오직{" "}
                        <InlineMath math={"A_k, C_k, G_k, Q_k, R_k, P_0"}/>에만 의존한다. 측정은 어디에도
                        나타나지 않는다. 그러니 이득 스케줄 전체를 로봇을 켜기 전에, 심지어 만들기
                        전에도 계산할 수 있고, 공분산은 데이터가 아니라 <em>실험 설계</em>에 대한
                        진술이다. 측정 갱신을 시간 갱신에 대입하면 점화식이 한 줄로 나온다.
                    </p>}
                />
                <BlockMath math={"P_{k+1|k} = A_k\\left[P_{k|k-1} - P_{k|k-1}C_k^\\top\\left(C_kP_{k|k-1}C_k^\\top+Q_k\\right)^{-1}C_kP_{k|k-1}\\right]A_k^\\top + G_kR_kG_k^\\top"}/>
                <Terms items={[
                    ["\\text{the bracket}", <T en={<>exactly <InlineMath math={"P_{k|k}"}/>, the Schur complement noted in Remark 5.55</>}
                                              ko={<>정확히 <InlineMath math={"P_{k|k}"}/>이고, Remark 5.55가 짚은 Schur complement다</>}/>],
                    ["\\text{this recursion}", <T en={<>the <strong>discrete Riccati difference equation</strong>. For time invariant models it usually converges to a fixed point, and then <InlineMath math={"K_k"}/> converges to a constant steady state gain</>}
                                                 ko={<><strong>이산 Riccati 차분 방정식</strong>이다. 시불변 모델에서는 보통 고정점으로 수렴하고, 그러면 <InlineMath math={"K_k"}/>도 상수인 정상 상태 이득으로 수렴한다</>}/>],
                ]}/>
            </Remark>
            <Example title={<T en={<>The whole filter on one scalar, by hand</>}
                               ko={<>스칼라 하나 위에서 손으로 돌리는 필터 전체</>}/>}>
                <T
                    en={<p>
                        Take the smallest interesting case: a scalar random walk measured directly, with{" "}
                        <InlineMath math={"A = G = C = 1"}/>, process noise{" "}
                        <InlineMath math={"R = 1"}/>, measurement noise{" "}
                        <InlineMath math={"Q = 1"}/>, and <InlineMath math={"P_0 = 1"}/>. The gain and
                        the two covariances reduce to
                    </p>}
                    ko={<p>
                        흥미로운 것 가운데 가장 작은 경우를 잡자. 스칼라 random walk를 직접 재는데{" "}
                        <InlineMath math={"A = G = C = 1"}/>, 과정 잡음{" "}
                        <InlineMath math={"R = 1"}/>, 측정 잡음 <InlineMath math={"Q = 1"}/>,{" "}
                        <InlineMath math={"P_0 = 1"}/>이다. 이득과 두 공분산은 이렇게 줄어든다.
                    </p>}
                />
                <BlockMath math={"K_k = \\frac{P^-_k}{P^-_k + 1}, \\qquad P^+_k = P^-_k - K_kP^-_k = \\frac{P^-_k}{P^-_k+1}, \\qquad P^-_{k+1} = P^+_k + 1"}/>
                <Terms items={[
                    ["P^-_k", <T en={<>shorthand for <InlineMath math={"P_{k|k-1}"}/>, the covariance before the measurement</>}
                                ko={<><InlineMath math={"P_{k|k-1}"}/>의 줄임. 측정 전의 공분산이다</>}/>],
                    ["P^+_k = K_k", <T en={<>a coincidence of this particular example, since <InlineMath math={"Q = 1"}/>. It makes the table below shorter</>}
                                      ko={<><InlineMath math={"Q = 1"}/>이라 생기는 이 예제만의 우연이다. 덕분에 아래 표가 짧아진다</>}/>],
                ]}/>
                <table className="table-center">
                    <thead>
                    <tr>
                        <th><InlineMath math={"k"}/></th>
                        <th><InlineMath math={"P^-_k"}/></th>
                        <th><InlineMath math={"K_k"}/></th>
                        <th><InlineMath math={"P^+_k"}/></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>0</td>
                        <td><InlineMath math={"1"}/></td>
                        <td><InlineMath math={"1/2 = 0.5"}/></td>
                        <td><InlineMath math={"1/2"}/></td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td><InlineMath math={"3/2"}/></td>
                        <td><InlineMath math={"3/5 = 0.6"}/></td>
                        <td><InlineMath math={"3/5"}/></td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td><InlineMath math={"8/5"}/></td>
                        <td><InlineMath math={"8/13 \\approx 0.6154"}/></td>
                        <td><InlineMath math={"8/13"}/></td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td><InlineMath math={"21/13"}/></td>
                        <td><InlineMath math={"21/34 \\approx 0.6176"}/></td>
                        <td><InlineMath math={"21/34"}/></td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td><InlineMath math={"55/34"}/></td>
                        <td><InlineMath math={"55/89 \\approx 0.6180"}/></td>
                        <td><InlineMath math={"55/89"}/></td>
                    </tr>
                    </tbody>
                </table>
                <T
                    en={<p>
                        Those are ratios of consecutive Fibonacci numbers, and they are converging. The
                        limit is the fixed point of the Riccati recursion, so set{" "}
                        <InlineMath math={"P^-_{k+1} = P^-_k =: p"}/> and solve:
                    </p>}
                    ko={<p>
                        연속한 피보나치 수의 비이고, 수렴하고 있다. 극한은 Riccati 점화식의 고정점이므로{" "}
                        <InlineMath math={"P^-_{k+1} = P^-_k =: p"}/>로 두고 풀면 된다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} p = \\frac{p}{p+1} + 1 \\;&\\iff\\; p^2 + p = 2p + 1 \\\\[3pt] &\\iff\\; p^2 - p - 1 = 0 \\;\\iff\\; p = \\frac{1+\\sqrt5}{2} = \\varphi \\end{aligned}"}/>
                <Terms items={[
                    ["\\varphi \\approx 1.6180", <T en={<>the golden ratio, the steady state prediction covariance of this filter</>}
                                                   ko={<>황금비. 이 필터의 정상 상태 예측 공분산이다</>}/>],
                    ["K_\\infty = \\tfrac{\\varphi}{\\varphi+1}", <T en={<>which equals <InlineMath math={"1/\\varphi \\approx 0.6180"}/>, since <InlineMath math={"\\varphi^2 = \\varphi + 1"}/>. The filter settles on weighting each new measurement by <InlineMath math={"0.618"}/> and its own prediction by <InlineMath math={"0.382"}/></>}
                                                                   ko={<><InlineMath math={"\\varphi^2 = \\varphi + 1"}/>이므로 <InlineMath math={"1/\\varphi \\approx 0.6180"}/>과 같다. 필터는 새 측정에 <InlineMath math={"0.618"}/>, 자기 예측에 <InlineMath math={"0.382"}/>의 가중치를 주는 자리에 자리를 잡는다</>}/>],
                    ["p^2 - p - 1 = 0", <T en={<>the algebraic Riccati equation for this model, which here is a quadratic anyone can solve</>}
                                          ko={<>이 모델의 대수적 Riccati 방정식. 여기서는 누구나 풀 수 있는 이차 방정식이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Run the figure above with its default settings and read the gain: it prints{" "}
                        <InlineMath math={"0.5, 0.6, 0.6154, 0.6176"}/>, the same table, computed by the
                        same code that draws the bells. The numbers in this example and the numbers in
                        that figure come from two independent implementations and agree to every digit
                        shown.
                    </p>}
                    ko={<p>
                        위 그림을 기본 설정으로 돌리고 이득을 읽어 보라.{" "}
                        <InlineMath math={"0.5, 0.6, 0.6154, 0.6176"}/>이 찍힌다. 같은 표이고, 종 모양을
                        그리는 바로 그 코드가 계산한 값이다. 이 예제의 수와 그림의 수는 서로 독립인 두
                        구현에서 나왔고 표시된 자리까지 전부 일치한다.
                    </p>}
                />
            </Example>
            <Proof label={<T en={<>Where the filter equations come from (notes 5.7.4)</>}
                             ko={<>필터 식은 어디서 나오는가 (교재 5.7.4)</>}/>}>
                <T
                    en={<p>
                        The derivation is an induction on <InlineMath math={"k"}/>, and every step is one
                        of the four Key Facts. <strong>Base step:</strong>{" "}
                        <InlineMath math={"\\hat{x}_{0|-1} = \\bar{x}_0"}/>,{" "}
                        <InlineMath math={"P_{0|-1} = P_0"}/>, which is the prior, conditioned on nothing.{" "}
                        <strong>Induction step:</strong> assume{" "}
                        <InlineMath math={"(\\hat{x}_{k|k-1}, P_{k|k-1})"}/> are known and derive the
                        other two pairs.
                    </p>}
                    ko={<p>
                        유도는 <InlineMath math={"k"}/>에 대한 귀납법이고, 모든 단계가 Key Fact 넷 가운데
                        하나다. <strong>기저 단계:</strong>{" "}
                        <InlineMath math={"\\hat{x}_{0|-1} = \\bar{x}_0"}/>,{" "}
                        <InlineMath math={"P_{0|-1} = P_0"}/>이고, 아무 조건도 걸지 않은 사전 분포다.{" "}
                        <strong>귀납 단계:</strong>{" "}
                        <InlineMath math={"(\\hat{x}_{k|k-1}, P_{k|k-1})"}/>을 안다고 두고 나머지 두
                        짝을 유도한다.
                    </p>}
                />
                <T
                    en={<p>
                        <strong>Step 1: split the conditioning.</strong> Key Fact 4 with{" "}
                        <InlineMath math={"x_k \\leftrightarrow X"}/>,{" "}
                        <InlineMath math={"y_k \\leftrightarrow Y"}/>,{" "}
                        <InlineMath math={"Y_{k-1}\\leftrightarrow Z"}/> gives
                    </p>}
                    ko={<p>
                        <strong>1단계: 조건을 쪼갠다.</strong>{" "}
                        <InlineMath math={"x_k \\leftrightarrow X"}/>,{" "}
                        <InlineMath math={"y_k \\leftrightarrow Y"}/>,{" "}
                        <InlineMath math={"Y_{k-1}\\leftrightarrow Z"}/>로 Key Fact 4를 쓰면 다음이
                        나온다.
                    </p>}
                />
                <BlockMath math={"x_k|Y_k = x_k|(y_k, Y_{k-1}) = \\big(x_k|Y_{k-1}\\big)\\Big|\\big(y_k|Y_{k-1}\\big)"}/>
                <Terms items={[
                    ["x_k|Y_{k-1}", <T en={<>known by the induction hypothesis: it is <InlineMath math={"N(\\hat{x}_{k|k-1}, P_{k|k-1})"}/></>}
                                      ko={<>귀납 가정으로 알고 있다. <InlineMath math={"N(\\hat{x}_{k|k-1}, P_{k|k-1})"}/>이다</>}/>],
                    ["y_k|Y_{k-1}", <T en={<>computed in step 2. Everything on the right is expressed in quantities already carried by the filter</>}
                                      ko={<>2단계에서 계산한다. 오른쪽의 모든 것이 필터가 이미 들고 있는 값으로 표현된다</>}/>],
                ]}/>
                <T
                    en={<p>
                        <strong>Step 2: the predicted measurement.</strong> Since{" "}
                        <InlineMath math={"y_k = C_kx_k + v_k"}/> and{" "}
                        <InlineMath math={"v_k"}/> is independent of both{" "}
                        <InlineMath math={"x_k"}/> and <InlineMath math={"Y_{k-1}"}/>, Key Fact 2 says{" "}
                        <InlineMath math={"v_k|Y_{k-1} = v_k"}/> and that it stays independent of{" "}
                        <InlineMath math={"x_k|Y_{k-1}"}/>. Then linearity gives the mean and Key Fact 3
                        gives the covariance:
                    </p>}
                    ko={<p>
                        <strong>2단계: 예측된 측정.</strong>{" "}
                        <InlineMath math={"y_k = C_kx_k + v_k"}/>이고{" "}
                        <InlineMath math={"v_k"}/>가 <InlineMath math={"x_k"}/>와{" "}
                        <InlineMath math={"Y_{k-1}"}/> 양쪽 모두와 독립이므로, Key Fact 2가{" "}
                        <InlineMath math={"v_k|Y_{k-1} = v_k"}/>이고 그것이{" "}
                        <InlineMath math={"x_k|Y_{k-1}"}/>과 여전히 독립이라고 말해 준다. 그다음 평균은
                        선형성이, 공분산은 Key Fact 3이 준다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} \\hat{y}_{k|k-1} &= \\mathcal{E}\\{C_kx_k + v_k \\mid Y_{k-1}\\} = C_k\\hat{x}_{k|k-1} \\\\ \\operatorname{cov}(y_k|Y_{k-1}) &= C_kP_{k|k-1}C_k^\\top + Q_k \\\\ \\operatorname{cov}(x_k|Y_{k-1},\\, y_k|Y_{k-1}) &= P_{k|k-1}C_k^\\top\\end{aligned}"}/>
                <Terms items={[
                    ["C_k\\hat{x}_{k|k-1}", <T en={<>what the filter expects to read, before reading it</>}
                                              ko={<>읽기 전에 필터가 읽으리라 기대하는 값</>}/>],
                    ["C_kP_{k|k-1}C_k^\\top", <T en={<>uncertainty in the reading caused by uncertainty in the state</>}
                                                ko={<>상태의 불확실성 때문에 판독값에 생기는 불확실성</>}/>],
                    ["Q_k", <T en={<>uncertainty caused by the sensor. The two add because they are independent</>}
                               ko={<>센서 때문에 생기는 불확실성. 독립이라 둘이 더해진다</>}/>],
                    ["P_{k|k-1}C_k^\\top", <T en={<>the cross covariance, computed from <InlineMath math={"\\operatorname{cov}(x_k, C_kx_k) = P_{k|k-1}C_k^\\top"}/> since the <InlineMath math={"v_k"}/> part contributes nothing</>}
                                             ko={<>교차 공분산. <InlineMath math={"v_k"}/> 몫이 아무것도 보태지 않으므로 <InlineMath math={"\\operatorname{cov}(x_k, C_kx_k) = P_{k|k-1}C_k^\\top"}/>에서 나온다</>}/>],
                ]}/>
                <T
                    en={<p>
                        <strong>Step 3: apply Key Fact 1.</strong> Stack the two conditioned random
                        vectors. They are jointly normal with
                    </p>}
                    ko={<p>
                        <strong>3단계: Key Fact 1을 적용한다.</strong> 조건이 걸린 두 확률 벡터를 쌓는다.
                        둘은 다음의 평균과 공분산으로 결합 정규분포를 따른다.
                    </p>}
                />
                <BlockMath math={"\\begin{bmatrix}\\hat{x}_{k|k-1}\\\\ C_k\\hat{x}_{k|k-1}\\end{bmatrix}, \\qquad \\begin{bmatrix} P_{k|k-1} & P_{k|k-1}C_k^\\top \\\\ C_kP_{k|k-1} & C_kP_{k|k-1}C_k^\\top + Q_k\\end{bmatrix}"}/>
                <Terms items={[
                    ["\\Sigma_{11}", <T en={<><InlineMath math={"P_{k|k-1}"}/>, so Key Fact 1's <InlineMath math={"\\Sigma_{11} - \\Sigma_{12}\\Sigma_{22}^{-1}\\Sigma_{21}"}/> is exactly <InlineMath math={"P_{k|k-1} - K_kC_kP_{k|k-1}"}/></>}
                                       ko={<><InlineMath math={"P_{k|k-1}"}/>이다. 그래서 Key Fact 1의 <InlineMath math={"\\Sigma_{11} - \\Sigma_{12}\\Sigma_{22}^{-1}\\Sigma_{21}"}/>이 정확히 <InlineMath math={"P_{k|k-1} - K_kC_kP_{k|k-1}"}/>이다</>}/>],
                    ["\\Sigma_{12}\\Sigma_{22}^{-1}", <T en={<>equal to <InlineMath math={"K_k"}/>. The gain was never designed; it fell out of a conditional distribution</>}
                                                        ko={<><InlineMath math={"K_k"}/>와 같다. 이득은 설계된 적이 없다. 조건부 분포에서 떨어져 나온 것이다</>}/>],
                    ["x_2 - \\mu_2", <T en={<>equal to <InlineMath math={"y_k - C_k\\hat{x}_{k|k-1}"}/>, the innovation. Key Fact 1's mean formula <em>is</em> the measurement update</>}
                                       ko={<><InlineMath math={"y_k - C_k\\hat{x}_{k|k-1}"}/>, 곧 innovation과 같다. Key Fact 1의 평균 공식이 곧 측정 갱신<em>이다</em></>}/>],
                ]}/>
                <T
                    en={<p>
                        <strong>Step 4: predict.</strong> Now use the state equation instead of the
                        output equation. Both <InlineMath math={"x_k"}/> and{" "}
                        <InlineMath math={"Y_k"}/> are independent of{" "}
                        <InlineMath math={"w_k"}/> by Lemma 5.52, so Key Fact 2 makes{" "}
                        <InlineMath math={"x_k|Y_k"}/> and <InlineMath math={"w_k|Y_k = w_k"}/>{" "}
                        independent, and Key Fact 3 adds their covariances:
                    </p>}
                    ko={<p>
                        <strong>4단계: 예측한다.</strong> 이번에는 출력 식 대신 상태 식을 쓴다. Lemma
                        5.52에 의해 <InlineMath math={"x_k"}/>와 <InlineMath math={"Y_k"}/>가 둘 다{" "}
                        <InlineMath math={"w_k"}/>와 독립이므로 Key Fact 2가{" "}
                        <InlineMath math={"x_k|Y_k"}/>와 <InlineMath math={"w_k|Y_k = w_k"}/>를 독립으로
                        만들고, Key Fact 3이 두 공분산을 더한다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} \\hat{x}_{k+1|k} &= \\mathcal{E}\\{A_kx_k + G_kw_k \\mid Y_k\\} = A_k\\hat{x}_{k|k} + G_k\\underbrace{\\mathcal{E}\\{w_k\\}}_{=\\,0} = A_k\\hat{x}_{k|k} \\\\ P_{k+1|k} &= A_kP_{k|k}A_k^\\top + G_kR_kG_k^\\top\\end{aligned}"}/>
                <Terms items={[
                    ["\\mathcal{E}\\{w_k\\} = 0", <T en={<>the zero mean assumption, spent here. A non-zero mean disturbance would add a known offset and change nothing structurally</>}
                                                    ko={<>평균이 0이라는 가정을 여기서 쓴다. 평균이 0이 아닌 외란이라면 알려진 offset이 하나 붙을 뿐 구조는 달라지지 않는다</>}/>],
                    ["A_k", <T en={<>constant given <InlineMath math={"Y_k"}/>, so it comes out of the conditional expectation</>}
                               ko={<><InlineMath math={"Y_k"}/>가 주어지면 상수이므로 조건부 기댓값 밖으로 나온다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The induction is closed: the pair{" "}
                        <InlineMath math={"(\\hat{x}_{k+1|k}, P_{k+1|k})"}/> has the same form the step
                        began with. That is the whole proof. The famous filter is four applications of
                        four facts, three of which are about conditional Gaussians and one of which holds
                        for any density.
                    </p>}
                    ko={<p>
                        귀납이 닫혔다. 짝 <InlineMath math={"(\\hat{x}_{k+1|k}, P_{k+1|k})"}/>이 단계를
                        시작할 때와 같은 꼴이다. 증명은 그것이 전부다. 저 유명한 필터는 사실 네 개를 네
                        번 적용한 것이고, 그 가운데 셋은 조건부 가우시안에 대한 것이며 하나는 어떤
                        밀도에서나 성립한다.
                    </p>}
                />
            </Proof>
            <Remark n="5.56" title={<T en={<>The combined form, and an input</>} ko={<>합친 꼴, 그리고 입력</>}/>}>
                <T
                    en={<p>
                        Real systems are driven. Add a known input{" "}
                        <InlineMath math={"u_k"}/> to the model, giving{" "}
                        <InlineMath math={"x_{k+1} = A_kx_k + B_ku_k + G_kw_k"}/>, and the two steps can
                        be merged into one:
                    </p>}
                    ko={<p>
                        실제 시스템에는 구동 입력이 있다. 알려진 입력{" "}
                        <InlineMath math={"u_k"}/>를 모델에 더해{" "}
                        <InlineMath math={"x_{k+1} = A_kx_k + B_ku_k + G_kw_k"}/>로 두면 두 단계를 하나로
                        합칠 수 있다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} K_k &= P_{k|k-1}C_k^\\top\\left[C_kP_{k|k-1}C_k^\\top+Q_k\\right]^{-1} \\\\ \\hat{x}_{k+1|k} &= A_k\\hat{x}_{k|k-1} + B_ku_k + A_kK_k\\left(y_k - C_k\\hat{x}_{k|k-1}\\right) \\\\ P_{k+1|k} &= A_k\\left[P_{k|k-1} - K_kC_kP_{k|k-1}\\right]A_k^\\top + G_kR_kG_k^\\top\\end{aligned}"}/>
                <Terms items={[
                    ["B_ku_k", <T en={<>the known input. It moves the mean and touches no covariance, because it is not random</>}
                                 ko={<>알려진 입력. 평균만 옮기고 공분산은 건드리지 않는다. 무작위가 아니기 때문이다</>}/>],
                    ["A_kK_k", <T en={<>the gain of the combined form, which is the ordinary gain pushed through one step of the model</>}
                                 ko={<>합친 꼴의 이득. 보통의 이득을 모델의 한 걸음에 통과시킨 것이다</>}/>],
                    ["\\hat{x}_{1|0}", <T en={<>if you prefer to index from <InlineMath math={"k=1"}/>, as MATLAB code often does, set <InlineMath math={"\\hat{x}_{1|0} := \\bar{x}_0"}/> and <InlineMath math={"P_{1|0} := P_0"}/> instead</>}
                                         ko={<>MATLAB 코드가 흔히 그러듯 <InlineMath math={"k=1"}/>부터 세고 싶다면 대신 <InlineMath math={"\\hat{x}_{1|0} := \\bar{x}_0"}/>, <InlineMath math={"P_{1|0} := P_0"}/>으로 두면 된다</>}/>],
                ]}/>
            </Remark>
            <CanvasFigure label={t("Two dimensions, position measured, velocity inferred",
                "2차원에서 위치만 재고 속도는 추론한다")}
                          modal={<Tracking2D width={720} height={560}/>}
                          bodyClassName="w-[min(92vw,760px)]">
                <Tracking2D/>
            </CanvasFigure>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Extended Kalman Filter</h2>} ko={<h2>확장 칼만 필터(EKF)</h2>}/>
            <Remark title={<T en={<>Optional read (notes 5.7.6)</>} ko={<>선택 읽기 (교재 5.7.6)</>}/>}>
                <T
                    en={<p>
                        This section and the next are marked optional in the notes. Skip them on a first
                        pass and come back, because on a real robot the EKF is the filter you will
                        actually write: almost nothing outside a textbook is linear.
                    </p>}
                    ko={<p>
                        이 절과 다음 절은 교재에서 선택 읽기로 표시되어 있다. 첫 독에서는 건너뛰었다가
                        돌아오면 된다. 실제 로봇에서 직접 짜게 되는 필터는 EKF이기 때문이다. 교과서
                        바깥에 선형인 것은 거의 없다.
                    </p>}
                />
            </Remark>
            <T
                en={<p>
                    The reason the Kalman filter was built for <em>time varying</em> linear systems is
                    that it can then be applied to the linearization of a nonlinear system along an
                    estimated trajectory. That is the extended Kalman filter. The model is
                </p>}
                ko={<p>
                    칼만 필터를 <em>시변</em> 선형 시스템까지 다루도록 만든 이유는, 그래야 비선형
                    시스템을 추정 궤적을 따라 선형화한 것에 적용할 수 있기 때문이다. 그것이 확장 칼만
                    필터다. 모델은 이렇다.
                </p>}
            />
            <BlockMath math={"x_{k+1} = f(x_k, u_k) + Gw_k, \\qquad y_k = h(x_k) + v_k"}/>
            <Terms items={[
                ["f", <T en={<>the nonlinear state transition: wheel odometry, a rigid body integrator, anything with a rotation in it</>}
                         ko={<>비선형 상태 전이. 바퀴 오도메트리, 강체 적분기, 회전이 들어가는 것이면 무엇이든 여기 해당한다</>}/>],
                ["h", <T en={<>the nonlinear measurement: range and bearing, a camera projection, a magnetometer</>}
                         ko={<>비선형 측정. 거리와 방위, 카메라 투영, 지자기 센서 같은 것들이다</>}/>],
                ["Gw_k, v_k", <T en={<>still additive Gaussian noise. The EKF does not attempt nonlinear noise</>}
                                ko={<>여전히 더해지는 가우시안 잡음이다. EKF는 비선형 잡음까지 손대지 않는다</>}/>],
            ]}/>
            <T
                en={<p>
                    The filter is line for line the same as before, with two Jacobians replacing the two
                    constant matrices and the nonlinear functions used wherever a prediction is actually
                    computed:
                </p>}
                ko={<p>
                    필터는 앞의 것과 줄 단위로 같다. 상수 행렬 둘이 야코비안 둘로 바뀌고, 예측을 실제로
                    계산하는 자리에는 비선형 함수를 그대로 쓴다.
                </p>}
            />
            <BlockMath math={"\\begin{aligned} C_k &:= \\left.\\frac{\\partial h(x)}{\\partial x}\\right|_{\\hat{x}_{k|k-1}}, & \\hat{x}_{k|k} &= \\hat{x}_{k|k-1} + K_k\\left(y_k - h(\\hat{x}_{k|k-1})\\right) \\\\ A_k &:= \\left.\\frac{\\partial f(x, u_k)}{\\partial x}\\right|_{\\hat{x}_{k|k}}, & \\hat{x}_{k+1|k} &= f(\\hat{x}_{k|k}, u_k)\\end{aligned}"}/>
            <Terms items={[
                ["C_k", <T en={<>the measurement Jacobian, evaluated at the <em>predicted</em> estimate, since that is the best guess available when the measurement arrives</>}
                           ko={<>측정 야코비안. <em>예측된</em> 추정에서 계산한다. 측정이 도착한 시점에 손에 있는 최선의 추측이 그것이기 때문이다</>}/>],
                ["A_k", <T en={<>the dynamics Jacobian, evaluated at the <em>updated</em> estimate, and taken with respect to <InlineMath math={"x"}/> only, not <InlineMath math={"u"}/></>}
                           ko={<>동역학 야코비안. <em>갱신된</em> 추정에서 계산하고, <InlineMath math={"u"}/>가 아니라 <InlineMath math={"x"}/>에 대해서만 미분한다</>}/>],
                ["h(\\hat{x}_{k|k-1})", <T en={<>the innovation uses the true nonlinear <InlineMath math={"h"}/>, not <InlineMath math={"C_k\\hat{x}"}/>. Using the linearization here as well is a common and expensive bug</>}
                                          ko={<>innovation에는 <InlineMath math={"C_k\\hat{x}"}/>가 아니라 참 비선형 함수 <InlineMath math={"h"}/>를 쓴다. 여기에도 선형화를 쓰는 것은 흔하고 비싼 버그다</>}/>],
                ["K_k, P_{k|k}, P_{k+1|k}", <T en={<>computed by the very same formulas as the linear filter, with these Jacobians in place of <InlineMath math={"C_k"}/> and <InlineMath math={"A_k"}/></>}
                                              ko={<>선형 필터와 똑같은 공식으로 계산한다. <InlineMath math={"C_k"}/>와 <InlineMath math={"A_k"}/> 자리에 이 야코비안을 넣을 뿐이다</>}/>],
            ]}/>
            <Remark title={<T en={<>The one symbol that changed</>} ko={<>바뀐 기호 하나</>}/>}>
                <T
                    en={<p>
                        In the notes' definition of terms for the EKF, every{" "}
                        <InlineMath math={":="}/> becomes <InlineMath math={":\\approx"}/>. That is the
                        entire difference and it is not a small one. For a linear model the filter{" "}
                        <em>computes</em> the conditional mean. For a nonlinear one it computes an{" "}
                        <strong>approximation</strong> of it, with no guarantee attached, and the
                        approximation is a first order Taylor expansion of a curve. The printed text also
                        calls it the "EFK" once, which is a typo for EKF.
                    </p>}
                    ko={<p>
                        교재의 EKF 용어 정의에서는 모든 <InlineMath math={":="}/>가{" "}
                        <InlineMath math={":\\approx"}/>로 바뀐다. 차이는 그것이 전부인데 작은 차이가
                        아니다. 선형 모델에서 필터는 조건부 평균을 <em>계산</em>한다. 비선형 모델에서는
                        그것의 <strong>근사</strong>를 계산하고, 아무 보장도 붙지 않으며, 그 근사는 곡선의
                        1차 Taylor 전개다. 인쇄된 본문은 한 곳에서 이것을 "EFK"라고 적는데 EKF의 오타다.
                    </p>}
                />
            </Remark>
            <CanvasFigure label={t("A Gaussian pushed through a curve is not a Gaussian",
                "곡선을 통과한 가우시안은 가우시안이 아니다")}
                          modal={<EkfLinearization width={780} height={520}/>}
                          bodyClassName="w-[min(92vw,820px)]">
                <EkfLinearization/>
            </CanvasFigure>
            <Example title={<T en={<>Range and bearing, and how far the linearization is off</>}
                               ko={<>거리와 방위, 그리고 선형화가 빗나가는 정도</>}/>}>
                <T
                    en={<p>
                        A lidar returns range <InlineMath math={"r"}/> and bearing{" "}
                        <InlineMath math={"\\theta"}/>, and the filter wants Cartesian coordinates. Take{" "}
                        <InlineMath math={"r \\sim N(r_0, \\sigma_r^2)"}/> and{" "}
                        <InlineMath math={"\\theta \\sim N(0, \\sigma_\\theta^2)"}/>, independent. The
                        EKF reports mean <InlineMath math={"f(\\mu) = (r_0, 0)"}/>. The true mean is
                    </p>}
                    ko={<p>
                        라이다는 거리 <InlineMath math={"r"}/>과 방위{" "}
                        <InlineMath math={"\\theta"}/>를 돌려주는데 필터는 직교좌표를 원한다.{" "}
                        <InlineMath math={"r \\sim N(r_0, \\sigma_r^2)"}/>과{" "}
                        <InlineMath math={"\\theta \\sim N(0, \\sigma_\\theta^2)"}/>이 독립이라 하자.
                        EKF는 평균을 <InlineMath math={"f(\\mu) = (r_0, 0)"}/>이라고 보고한다. 참 평균은
                        이것이다.
                    </p>}
                />
                <BlockMath math={"\\mathcal{E}\\{r\\cos\\theta\\} = \\mathcal{E}\\{r\\}\\,\\mathcal{E}\\{\\cos\\theta\\} = r_0\\,e^{-\\sigma_\\theta^2/2}"}/>
                <Terms items={[
                    ["\\mathcal{E}\\{\\cos\\theta\\} = e^{-\\sigma_\\theta^2/2}", <T en={<>the real part of <InlineMath math={"\\mathcal{E}\\{e^{i\\theta}\\}"}/>, the characteristic function of a zero mean Gaussian. It is strictly less than one for any non-zero noise</>}
                                                                                    ko={<>평균이 0인 가우시안의 특성 함수 <InlineMath math={"\\mathcal{E}\\{e^{i\\theta}\\}"}/>의 실수부다. 잡음이 0이 아니면 언제나 1보다 작다</>}/>],
                    ["r_0e^{-\\sigma_\\theta^2/2}", <T en={<>always <em>closer</em> to the sensor than <InlineMath math={"r_0"}/>. Bearing noise makes a point look nearer than it is, and the EKF never sees this</>}
                                                      ko={<>언제나 <InlineMath math={"r_0"}/>보다 센서에 <em>가깝다</em>. 방위 잡음은 점을 실제보다 가까워 보이게 만드는데, EKF는 이것을 전혀 보지 못한다</>}/>],
                ]}/>
                <T
                    en={<p>
                        At <InlineMath math={"r_0 = 8"}/> and{" "}
                        <InlineMath math={"\\sigma_\\theta = 5^\\circ"}/> the true mean is{" "}
                        <InlineMath math={"7.970"}/>, an error of <InlineMath math={"0.03"}/> that nobody
                        will ever notice. At <InlineMath math={"28^\\circ"}/> it is{" "}
                        <InlineMath math={"7.100"}/>, and at <InlineMath math={"45^\\circ"}/> it is{" "}
                        <InlineMath math={"5.877"}/>: the filter is now claiming a position two units
                        beyond where the measurement actually centres, and claiming it confidently, since
                        the linearized covariance{" "}
                        <InlineMath math={"J\\Sigma J^\\top"}/> puts variance{" "}
                        <InlineMath math={"\\sigma_r^2"}/> along the range axis no matter how large{" "}
                        <InlineMath math={"\\sigma_\\theta"}/> gets. Sweep the slider in the figure and
                        compare the two ellipses.
                    </p>}
                    ko={<p>
                        <InlineMath math={"r_0 = 8"}/>이고{" "}
                        <InlineMath math={"\\sigma_\\theta = 5^\\circ"}/>이면 참 평균이{" "}
                        <InlineMath math={"7.970"}/>이라 오차가 <InlineMath math={"0.03"}/>이고 아무도
                        눈치채지 못한다. <InlineMath math={"28^\\circ"}/>에서는{" "}
                        <InlineMath math={"7.100"}/>, <InlineMath math={"45^\\circ"}/>에서는{" "}
                        <InlineMath math={"5.877"}/>이다. 이제 필터는 측정이 실제로 몰려 있는 자리보다
                        두 단위나 먼 위치를 주장하고 있고, 그것도 자신 있게 주장한다. 선형화된 공분산{" "}
                        <InlineMath math={"J\\Sigma J^\\top"}/>이 거리 축 방향의 분산을{" "}
                        <InlineMath math={"\\sigma_\\theta"}/>가 아무리 커져도{" "}
                        <InlineMath math={"\\sigma_r^2"}/>으로 두기 때문이다. 그림의 슬라이더를 끝까지
                        밀고 두 타원을 견주어 보라.
                    </p>}
                />
                <T
                    en={<p>
                        The repairs are well known: keep the linearization point fresh (iterate the
                        update), or stop linearizing and push sample points through{" "}
                        <InlineMath math={"f"}/> and <InlineMath math={"h"}/> instead, which is the
                        unscented Kalman filter the notes recommend reading about. The EKF above has also
                        been analyzed as a deterministic observer for a nonlinear system, in the paper
                        linked in the references.
                    </p>}
                    ko={<p>
                        고치는 방법은 잘 알려져 있다. 선형화 지점을 계속 갱신하거나(갱신을 반복한다),
                        아예 선형화를 그만두고 표본점들을 <InlineMath math={"f"}/>와{" "}
                        <InlineMath math={"h"}/>에 직접 통과시키는 것이다. 후자가 교재가 읽어 보라고
                        권하는 unscented Kalman filter다. 위의 EKF는 비선형 시스템의 결정론적 관측기로
                        분석되기도 했는데, 그 논문은 References에 걸어 두었다.
                    </p>}
                />
            </Example>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Luenberger Observer</h2>} ko={<h2>Luenberger 관측기</h2>}/>
            <Remark title={<T en={<>Optional read (notes 5.8)</>} ko={<>선택 읽기 (교재 5.8)</>}/>}>
                <T
                    en={<p>
                        Also optional. It is worth twenty minutes anyway, because it answers a question
                        the Kalman filter quietly assumed: when is the state recoverable from the outputs
                        at all? No amount of optimal filtering can estimate something the sensors cannot
                        see.
                    </p>}
                    ko={<p>
                        이쪽도 선택이다. 그래도 이십 분은 쓸 만하다. 칼만 필터가 슬쩍 가정하고 지나간
                        질문에 답해 주기 때문이다. 애초에 출력만으로 상태를 되찾을 수 있기는 한가? 센서가
                        볼 수 없는 것은 아무리 최적으로 걸러도 추정되지 않는다.
                    </p>}
                />
            </Remark>
            <T
                en={<p>
                    Drop the noise entirely and take the time invariant model{" "}
                    <InlineMath math={"x_{k+1} = Ax_k"}/>,{" "}
                    <InlineMath math={"y_k = Cx_k"}/>. Since{" "}
                    <InlineMath math={"y_k = CA^kx_0"}/>, stacking the outputs gives a linear system
                    for the initial condition.
                </p>}
                ko={<p>
                    잡음을 아예 버리고 시불변 모델{" "}
                    <InlineMath math={"x_{k+1} = Ax_k"}/>,{" "}
                    <InlineMath math={"y_k = Cx_k"}/>를 잡는다.{" "}
                    <InlineMath math={"y_k = CA^kx_0"}/>이므로 출력을 쌓으면 초기 조건에 대한 선형 계가
                    나온다.
                </p>}
            />
            <BlockMath math={"\\begin{bmatrix}y_0\\\\y_1\\\\\\vdots\\\\y_k\\end{bmatrix} = \\begin{bmatrix}C\\\\CA\\\\\\vdots\\\\CA^k\\end{bmatrix}x_0 =: \\mathcal{O}_k\\,x_0"}/>
            <Terms items={[
                ["\\mathcal{O}_k", <T en={<>the observability matrix. <InlineMath math={"x_0"}/> is uniquely recoverable exactly when its null space is trivial, that is when <InlineMath math={"\\operatorname{rank}\\mathcal{O}_k = n"}/></>}
                                     ko={<>관측 가능성 행렬. <InlineMath math={"x_0"}/>를 유일하게 되찾을 수 있는 것은 이 행렬의 null space가 0뿐일 때, 곧 <InlineMath math={"\\operatorname{rank}\\mathcal{O}_k = n"}/>일 때다</>}/>],
                ["k = n-1", <T en={<>far enough. By the Cayley-Hamilton theorem <InlineMath math={"A^n"}/> is a combination of lower powers, so no row after <InlineMath math={"CA^{n-1}"}/> can raise the rank. Waiting longer than <InlineMath math={"n"}/> samples never helps</>}
                              ko={<>여기까지면 충분하다. Cayley-Hamilton 정리에 의해 <InlineMath math={"A^n"}/>이 낮은 거듭제곱들의 결합이므로, <InlineMath math={"CA^{n-1}"}/> 다음의 행은 rank를 올릴 수 없다. <InlineMath math={"n"}/>개보다 오래 기다려도 소용없다</>}/>],
            ]}/>
            <T
                en={<p>
                    The notes print this theorem's name as "Caley Hamilton" and write the last block of
                    the matrix as <InlineMath math={"CA^n - 1"}/> in one place. The name is
                    Cayley-Hamilton and the block is <InlineMath math={"CA^{n-1}"}/>. Solving for{" "}
                    <InlineMath math={"x_0"}/> in a batch is not what a robot wants, though. The
                    recursive version is the <strong>observer</strong>:
                </p>}
                ko={<p>
                    교재는 이 정리의 이름을 "Caley Hamilton"으로 인쇄하고, 행렬의 마지막 블록을 한
                    곳에서 <InlineMath math={"CA^n - 1"}/>로 적는다. 이름은 Cayley-Hamilton이고 블록은{" "}
                    <InlineMath math={"CA^{n-1}"}/>이다. 어쨌든 <InlineMath math={"x_0"}/>를 배치로
                    푸는 것은 로봇이 원하는 방식이 아니다. 재귀 판본이 <strong>관측기</strong>다.
                </p>}
            />
            <BlockMath math={"\\hat{x}_{k+1} = A\\hat{x}_k + L\\left(y_k - C\\hat{x}_k\\right) \\qquad\\Longrightarrow\\qquad e_{k+1} = (A - LC)e_k, \\quad e_k := x_k - \\hat{x}_k"}/>
            <Terms items={[
                ["L", <T en={<>the <strong>Luenberger gain</strong>, to be chosen. Structurally it sits exactly where <InlineMath math={"A_kK_k"}/> sits in the combined Kalman filter</>}
                         ko={<>고를 대상인 <strong>Luenberger 이득</strong>. 구조적으로는 합친 꼴 칼만 필터에서 <InlineMath math={"A_kK_k"}/>가 앉는 자리에 그대로 앉는다</>}/>],
                ["y_k - C\\hat{x}_k", <T en={<>the same innovation as before: measured minus predicted</>}
                                        ko={<>앞과 같은 innovation. 잰 값에서 예측한 값을 뺀 것이다</>}/>],
                ["e_{k+1} = (A-LC)e_k", <T en={<>the error dynamics, which contain no state and no measurement. The estimate converges for every initial error if and only if every eigenvalue of <InlineMath math={"A - LC"}/> lies strictly inside the unit circle</>}
                                          ko={<>오차 동역학. 상태도 측정도 들어 있지 않다. 모든 초기 오차에 대해 추정이 수렴하는 것은 <InlineMath math={"A - LC"}/>의 모든 고윳값이 단위원 안에 엄격히 놓이는 것과 동치다</>}/>],
            ]}/>
            <Example title={<T en={<>Placing the poles of a constant velocity observer</>}
                               ko={<>등속 모델 관측기의 극점 배치</>}/>}>
                <T
                    en={<p>
                        Take position and velocity with{" "}
                        <InlineMath math={"A = \\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}"}/>,{" "}
                        <InlineMath math={"C = \\begin{bmatrix}1&0\\end{bmatrix}"}/>: position measured,
                        velocity not. Observability first:
                    </p>}
                    ko={<p>
                        위치와 속도를{" "}
                        <InlineMath math={"A = \\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}"}/>,{" "}
                        <InlineMath math={"C = \\begin{bmatrix}1&0\\end{bmatrix}"}/>으로 잡는다. 위치는
                        재고 속도는 재지 않는다. 관측 가능성부터 본다.
                    </p>}
                />
                <BlockMath math={"\\mathcal{O} = \\begin{bmatrix}C\\\\CA\\end{bmatrix} = \\begin{bmatrix}1&0\\\\1&1\\end{bmatrix}, \\qquad \\det\\mathcal{O} = 1 \\ne 0"}/>
                <Terms items={[
                    ["CA = (1, 1)", <T en={<>the second row: one step later the reading has picked up the velocity, which is how an unmeasured state becomes visible</>}
                                      ko={<>둘째 행. 한 걸음 뒤의 판독에는 속도가 섞여 들어와 있고, 재지 않은 상태가 보이게 되는 방식이 그것이다</>}/>],
                    ["\\det = 1", <T en={<>full rank, so velocity is recoverable from two position readings. If <InlineMath math={"A"}/> were the identity, <InlineMath math={"\\mathcal{O}"}/> would have rank 1 and velocity would be invisible forever</>}
                                    ko={<>rank가 꽉 찼으므로 위치 판독 둘이면 속도를 되찾을 수 있다. <InlineMath math={"A"}/>가 항등 행렬이었다면 <InlineMath math={"\\mathcal{O}"}/>의 rank가 1이라 속도는 영원히 보이지 않는다</>}/>],
                ]}/>
                <BlockMath math={"A - LC = \\begin{bmatrix}1 - \\ell_1 & 1 \\\\ -\\ell_2 & 1\\end{bmatrix}, \\qquad \\det(\\lambda I - (A-LC)) = \\lambda^2 - (2-\\ell_1)\\lambda + (1 - \\ell_1 + \\ell_2)"}/>
                <Terms items={[
                    ["\\ell_1, \\ell_2", <T en={<>the two entries of <InlineMath math={"L"}/>, free to choose</>}
                                           ko={<><InlineMath math={"L"}/>의 두 성분. 마음대로 고를 수 있다</>}/>],
                    ["\\text{characteristic polynomial}", <T en={<>its coefficients are the trace and determinant of <InlineMath math={"A - LC"}/>, and both are affine in <InlineMath math={"L"}/>, which is why placement is easy here</>}
                                                            ko={<>계수가 <InlineMath math={"A - LC"}/>의 trace와 determinant이고 둘 다 <InlineMath math={"L"}/>에 대해 affine이다. 여기서 극점 배치가 쉬운 이유다</>}/>],
                ]}/>
                <T
                    en={<p>
                        To put both poles at <InlineMath math={"0.5"}/>, match{" "}
                        <InlineMath math={"\\lambda^2 - \\lambda + 0.25"}/>: from the linear coefficient{" "}
                        <InlineMath math={"2 - \\ell_1 = 1"}/> so{" "}
                        <InlineMath math={"\\ell_1 = 1"}/>, and from the constant{" "}
                        <InlineMath math={"1 - 1 + \\ell_2 = 0.25"}/> so{" "}
                        <InlineMath math={"\\ell_2 = 0.25"}/>. The error then decays by half each step
                        regardless of how it started.
                    </p>}
                    ko={<p>
                        극점 둘을 <InlineMath math={"0.5"}/>에 두려면{" "}
                        <InlineMath math={"\\lambda^2 - \\lambda + 0.25"}/>에 맞추면 된다. 일차항에서{" "}
                        <InlineMath math={"2 - \\ell_1 = 1"}/>이라{" "}
                        <InlineMath math={"\\ell_1 = 1"}/>, 상수항에서{" "}
                        <InlineMath math={"1 - 1 + \\ell_2 = 0.25"}/>라{" "}
                        <InlineMath math={"\\ell_2 = 0.25"}/>다. 그러면 오차는 어떻게 시작했든 매 걸음
                        절반으로 줄어든다.
                    </p>}
                />
                <T
                    en={<p>
                        Now compare. Run the Kalman filter on the same model with process noise{" "}
                        <InlineMath math={"R = 0.01"}/> entering as acceleration and measurement noise{" "}
                        <InlineMath math={"Q = 4"}/>. Its steady state gain is{" "}
                        <InlineMath math={"K_\\infty = (0.2709, 0.0427)^\\top"}/>, which places the
                        eigenvalues of <InlineMath math={"A - AK_\\infty C"}/> at{" "}
                        <InlineMath math={"0.843 \\pm 0.135i"}/>, of magnitude{" "}
                        <InlineMath math={"0.854"}/>. The Kalman filter deliberately chose a{" "}
                        <em>slower</em> observer than the hand placed one, because with{" "}
                        <InlineMath math={"Q = 4"}/> the measurements are too noisy to be worth
                        converging on quickly. That trade is what the noise model buys, and it is the
                        only real difference between the two designs.
                    </p>}
                    ko={<p>
                        이제 견주어 보자. 같은 모델에 가속도로 들어오는 과정 잡음{" "}
                        <InlineMath math={"R = 0.01"}/>과 측정 잡음{" "}
                        <InlineMath math={"Q = 4"}/>를 두고 칼만 필터를 돌리면 정상 상태 이득이{" "}
                        <InlineMath math={"K_\\infty = (0.2709, 0.0427)^\\top"}/>이고,{" "}
                        <InlineMath math={"A - AK_\\infty C"}/>의 고윳값이 크기{" "}
                        <InlineMath math={"0.854"}/>인{" "}
                        <InlineMath math={"0.843 \\pm 0.135i"}/>에 놓인다. 칼만 필터는 손으로 배치한
                        것보다 <em>느린</em> 관측기를 일부러 골랐다. <InlineMath math={"Q = 4"}/>에서는
                        측정이 너무 시끄러워서 빨리 수렴할 값어치가 없기 때문이다. 잡음 모델이 사 주는
                        것이 그 절충이고, 두 설계의 진짜 차이는 그것뿐이다.
                    </p>}
                />
            </Example>
            <Remark n="5.62" title={<T en={<>Which gain to use</>} ko={<>어느 이득을 쓸 것인가</>}/>}>
                <T
                    en={<ul>
                        <li>When the model and the noise statistics are time invariant and the system is
                            observable, the Kalman gain itself converges to a constant{" "}
                            <InlineMath math={"K_{ss}"}/>. At that point the filter <em>is</em> a
                            Luenberger observer, one whose gain was derived rather than tuned.</li>
                        <li>Use the Kalman gain when you know the noise statistics, because then it is
                            optimal. Use pole placement when you do not, because inventing a covariance
                            you cannot justify buys nothing.</li>
                        <li>The Kalman filter still wins whenever the model is time varying: it handles{" "}
                            <InlineMath math={"A_k, C_k, G_k"}/> changing every step, which pole
                            placement does not.</li>
                    </ul>}
                    ko={<ul>
                        <li>모델과 잡음 통계가 시불변이고 시스템이 관측 가능하면 칼만 이득 자체가 상수{" "}
                            <InlineMath math={"K_{ss}"}/>로 수렴한다. 그 지점에서 필터는 Luenberger
                            관측기<em>다</em>. 이득을 튜닝이 아니라 유도로 얻었을 뿐이다.</li>
                        <li>잡음 통계를 안다면 칼만 이득을 쓴다. 그때는 최적이기 때문이다. 모른다면 극점
                            배치를 쓴다. 정당화할 수 없는 공분산을 지어내 봐야 얻는 것이 없다.</li>
                        <li>모델이 시변이면 언제나 칼만 필터가 이긴다. 매 걸음 바뀌는{" "}
                            <InlineMath math={"A_k, C_k, G_k"}/>를 감당하는데 극점 배치는 그러지
                            못한다.</li>
                    </ul>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Why Robotics</h2>} ko={<h2>로봇에서 왜 필요한가</h2>}/>
            <T
                en={<p>
                    The other chapters end with a section arguing that the mathematics shows up in
                    robotics somewhere. This one does not have to argue. A robot never knows where it is.
                    It has a model that is wrong and sensors that are noisy, and the entire job of
                    turning those two into a number a controller can act on is the content of this
                    chapter. Below is what that looks like once it is running on hardware.
                </p>}
                ko={<p>
                    다른 장들은 그 수학이 로봇 어딘가에 나타난다고 설득하는 절로 끝난다. 이 장은 설득할
                    필요가 없다. 로봇은 자기가 어디 있는지 결코 알지 못한다. 틀린 모델과 시끄러운 센서를
                    갖고 있을 뿐이고, 그 둘을 제어기가 쓸 수 있는 수 하나로 바꾸는 일 전체가 이 장의
                    내용이다. 아래는 그것이 하드웨어 위에서 돌아갈 때의 모습이다.
                </p>}
            />
            <T
                en={<ul>
                    <li>
                        <strong>The predict and update split is the software architecture, not a
                            teaching device.</strong> On a walking robot the IMU arrives at 1 kHz and the
                        lidar or camera at 10 to 30 Hz. The prediction step runs on every IMU sample,
                        growing <InlineMath math={"P"}/> by{" "}
                        <InlineMath math={"G_kR_kG_k^\\top"}/> each time, and the update step runs only
                        when a measurement shows up. They are two separate functions because the
                        derivation produced two separate steps, and a filter written as one fused
                        function cannot handle sensors at different rates or a sensor that drops out for
                        a second.
                    </li>
                    <li>
                        <strong><InlineMath math={"R"}/> and <InlineMath math={"Q"}/> are physical
                            quantities, and tuning them by watching <InlineMath math={"K"}/> is tuning
                            the wrong end.</strong> <InlineMath math={"Q"}/> is on the sensor's
                        datasheet or measurable on a bench in an afternoon: clamp the sensor down, log an
                        hour, take the sample covariance. <InlineMath math={"R"}/> is the honest answer
                        to "how badly does my model lie", in the units of the thing it feeds. For a
                        constant velocity model it is the variance of the acceleration you refused to
                        model, so if the robot can accelerate at{" "}
                        <InlineMath math={"2\\,\\mathrm{m/s^2}"}/> and the model says it cannot, that
                        number belongs in <InlineMath math={"R"}/>. The figures on this page let you
                        drive both and watch the gain respond, which is the right way round: pick the two
                        covariances from physics, then <em>check</em> that the resulting{" "}
                        <InlineMath math={"K"}/> is sane.
                    </li>
                    <li>
                        <strong>The covariance is an output, not bookkeeping.</strong> Downstream code
                        needs it. The innovation covariance{" "}
                        <InlineMath math={"S_k = C_kP_{k|k-1}C_k^\\top + Q_k"}/> gives an outlier test
                        for free: a reading whose{" "}
                        <InlineMath math={"(y_k - C_k\\hat{x}_{k|k-1})^\\top S_k^{-1}(y_k - C_k\\hat{x}_{k|k-1})"}/>{" "}
                        sits far above <InlineMath math={"m"}/> is a reflection, a multipath return, or a
                        mismatched landmark, and should be dropped rather than fused. Planners use the
                        same ellipse to decide how much clearance to leave, and a supervisor uses{" "}
                        <InlineMath math={"\\operatorname{tr}P"}/> growing without bound to decide it is
                        time to stop and relocalize.
                    </li>
                    <li>
                        <strong>The covariance recursion needs no data, so the filter can be evaluated
                            before the robot exists.</strong> Because{" "}
                        <InlineMath math={"P_{k|k-1}"}/> depends only on{" "}
                        <InlineMath math={"A, C, G, Q, R, P_0"}/>, you can iterate the Riccati recursion
                        on a laptop with a candidate sensor suite and read off the steady state
                        uncertainty before ordering anything. If the steady state{" "}
                        <InlineMath math={"P"}/> says the heading is uncertain to five degrees, no amount
                        of clever software will fix it, and a second sensor or a different mounting is
                        the answer.
                    </li>
                    <li>
                        <strong>Observability decides what can be estimated at all.</strong> The
                        Luenberger section is where this is stated precisely, and it is not an academic
                        point. Accelerometer bias is unobservable while the robot sits still and becomes
                        observable once it rotates. Scale is unobservable to a single camera and arrives
                        only with an IMU or a known baseline. A calibration sequence that never rotates
                        about the vertical axis leaves that column of the parameter vector
                        unidentifiable, and the filter will happily return a number for it, driven
                        entirely by noise, with a covariance that never shrinks. Check the rank before
                        blaming the estimator.
                    </li>
                    <li>
                        <strong>EKF divergence is the linearization figure, in the field.</strong> Every
                        range and bearing sensor pushes a Gaussian through a curve, and the filter's
                        reported mean sits where the samples are not. Once the covariance is confidently
                        wrong, the innovation gate starts rejecting the good measurements that would have
                        corrected it, and the estimate walks away. The standard defences all appear in
                        this chapter's vocabulary: iterate the update so the linearization point is the
                        posterior rather than the prior, propagate sample points instead of a Jacobian
                        (the unscented filter), or choose coordinates in which the model is closer to
                        linear, which is what invariant filtering on Lie groups does.
                    </li>
                    <li>
                        <strong>Chapter 4's Cholesky factor is here for a reason.</strong> The update{" "}
                        <InlineMath math={"P^+ = P^- - K C P^-"}/> is a subtraction, and subtraction in
                        floating point can push a nearly singular <InlineMath math={"P"}/> to indefinite,
                        at which point the filter is claiming negative variance in some direction and
                        the next Cholesky fails. Square root filters propagate a factor{" "}
                        <InlineMath math={"S"}/> with <InlineMath math={"SS^\\top = P"}/> instead, so the
                        covariance is positive semidefinite by construction whatever the arithmetic does.
                        Correlated process noise is sampled with that same factor, which is the{" "}
                        <InlineMath math={"x = \\mu + Sz"}/> of Chapter 4.
                    </li>
                    <li>
                        <strong>Large scale SLAM is the information matrix, which is why it is optional
                            here and central there.</strong> A landmark constrains only the poses that
                        saw it, so <InlineMath math={"\\Lambda"}/> is mostly zeros while{" "}
                        <InlineMath math={"\\Sigma = \\Lambda^{-1}"}/> is dense: every pose is correlated
                        with every other. Modern back ends keep the sparse one and solve, using exactly
                        the identity{" "}
                        <InlineMath math={"\\Lambda^+ = \\Lambda^- + C^\\top Q^{-1}C"}/>. Dropping an old
                        pose from the graph is marginalization, and marginalization in information form
                        is the Schur complement of this chapter, which fills in edges between everything
                        that pose used to touch. That fill-in is why marginalizing carelessly destroys
                        sparsity and slows a back end to a crawl.
                    </li>
                    <li>
                        <strong>Fusion weights are inverse variances, with one clause people
                            forget.</strong> BLUE says the good sensor gets{" "}
                        <InlineMath math={"1/\\sigma^2"}/> of the vote, and that adding a worse sensor
                        still helps: variance 1 and variance 4 fuse to <InlineMath math={"0.8"}/>. The
                        clause is <em>independent noise</em>. Two cameras sharing a calibration error,
                        two GNSS receivers sharing an ionospheric delay, and two encoders sharing a
                        temperature drift all violate it, and fusing them as if{" "}
                        <InlineMath math={"Q"}/> were diagonal produces an estimate overconfident by
                        exactly the amount of correlation ignored. Either model the correlation in{" "}
                        <InlineMath math={"Q"}/> or difference the two signals, which is what the sum and
                        difference example in the Gaussian section was showing.
                    </li>
                    <li>
                        <strong>Watch the gain, because both of its failure modes are diagnostic.</strong>{" "}
                        A gain sitting near one means the filter has stopped believing its model and is
                        copying the sensor, so the output is as noisy as the raw signal and the smoothing
                        you paid for is not happening. A gain near zero means the filter has stopped
                        listening, and it will coast confidently through a real change in the state, such
                        as a wheel that has just started slipping. The first is usually{" "}
                        <InlineMath math={"R"}/> set too large, the second usually{" "}
                        <InlineMath math={"R"}/> set too small, and a plot of{" "}
                        <InlineMath math={"K_k"}/> over time answers the question faster than reading the
                        estimate does.
                    </li>
                </ul>}
                ko={<ul>
                    <li>
                        <strong>예측과 갱신의 분리는 교육용 장치가 아니라 소프트웨어 구조다.</strong>{" "}
                        보행 로봇에서 IMU는 1 kHz로, 라이다나 카메라는 10에서 30 Hz로 들어온다. 예측
                        단계는 IMU 샘플마다 돌면서 매번 <InlineMath math={"P"}/>를{" "}
                        <InlineMath math={"G_kR_kG_k^\\top"}/>만큼 키우고, 갱신 단계는 측정이 나타날
                        때만 돈다. 유도가 두 단계를 따로 내놓았기 때문에 함수도 둘이다. 하나로 합쳐 짠
                        필터는 속도가 다른 센서들도, 1초쯤 끊기는 센서도 감당하지 못한다.
                    </li>
                    <li>
                        <strong><InlineMath math={"R"}/>과 <InlineMath math={"Q"}/>는 물리량이고,{" "}
                            <InlineMath math={"K"}/>를 보면서 그것을 맞추는 것은 반대쪽 끝을 만지는
                            일이다.</strong> <InlineMath math={"Q"}/>는 센서 데이터시트에 적혀 있거나
                        오후 한나절이면 실험대에서 잰다. 센서를 고정해 두고 한 시간 로깅한 뒤 표본
                        공분산을 내면 된다. <InlineMath math={"R"}/>은 "내 모델이 얼마나 거짓말하는가"에
                        대한 정직한 답이고, 단위는 그것이 들어가는 자리의 단위다. 등속 모델이라면 모델링을
                        거부한 가속도의 분산이다. 로봇이{" "}
                        <InlineMath math={"2\\,\\mathrm{m/s^2}"}/>로 가속할 수 있는데 모델은 그럴 수
                        없다고 말한다면, 그 수가 <InlineMath math={"R"}/>에 들어가야 한다. 이 페이지의
                        그림들은 둘을 직접 몰아 보고 이득이 어떻게 반응하는지 볼 수 있게 해 두었다.
                        순서는 이쪽이 맞다. 두 공분산을 물리에서 고르고, 그 결과로 나온{" "}
                        <InlineMath math={"K"}/>가 제정신인지 <em>확인</em>하는 것이다.
                    </li>
                    <li>
                        <strong>공분산은 장부가 아니라 출력이다.</strong> 뒤에 붙는 코드가 그것을
                        필요로 한다. innovation의 공분산{" "}
                        <InlineMath math={"S_k = C_kP_{k|k-1}C_k^\\top + Q_k"}/>는 이상치 판정을 공짜로
                        준다.{" "}
                        <InlineMath math={"(y_k - C_k\\hat{x}_{k|k-1})^\\top S_k^{-1}(y_k - C_k\\hat{x}_{k|k-1})"}/>이{" "}
                        <InlineMath math={"m"}/>보다 한참 큰 판독은 반사이거나 multipath이거나 잘못
                        매칭된 랜드마크이므로 융합하지 말고 버려야 한다. 플래너는 같은 타원으로 여유
                        간격을 얼마나 둘지 정하고, 감시 로직은{" "}
                        <InlineMath math={"\\operatorname{tr}P"}/>가 끝없이 자라는 것을 보고 멈춰서 다시
                        위치를 잡을 때가 되었다고 판단한다.
                    </li>
                    <li>
                        <strong>공분산 점화식에는 데이터가 필요 없으므로, 로봇이 존재하기 전에 필터를
                            평가할 수 있다.</strong> <InlineMath math={"P_{k|k-1}"}/>이 오직{" "}
                        <InlineMath math={"A, C, G, Q, R, P_0"}/>에만 의존하므로, 후보 센서 구성으로
                        노트북에서 Riccati 점화식을 돌려 정상 상태 불확실성을 아무것도 주문하기 전에
                        읽어 낼 수 있다. 정상 상태 <InlineMath math={"P"}/>가 방위 불확실성이 5도라고
                        말한다면 아무리 영리한 소프트웨어로도 고쳐지지 않는다. 답은 센서를 하나 더 달거나
                        장착 위치를 바꾸는 것이다.
                    </li>
                    <li>
                        <strong>애초에 무엇을 추정할 수 있는지는 관측 가능성이 정한다.</strong>{" "}
                        Luenberger 절이 그것을 정확히 적어 두는 자리이고, 학술적인 이야기가 아니다.
                        가속도계 bias는 로봇이 가만히 있는 동안에는 관측 불가능하고 회전을 시작해야
                        관측 가능해진다. 스케일은 카메라 하나로는 관측 불가능하고 IMU나 알려진 baseline이
                        있어야 온다. 수직축으로 한 번도 돌지 않는 캘리브레이션 시퀀스는 파라미터 벡터의
                        그 열을 식별 불가능한 채로 남기는데, 필터는 그 자리에도 기꺼이 수를 하나 돌려준다.
                        전적으로 잡음이 만들어 낸 수이고 공분산은 줄어들지 않는다. 추정기를 탓하기 전에
                        rank를 확인해야 한다.
                    </li>
                    <li>
                        <strong>EKF 발산은 현장에 나타난 선형화 그림이다.</strong> 거리와 방위를 재는
                        센서는 예외 없이 가우시안을 곡선에 통과시키고, 필터가 보고하는 평균은 표본이 없는
                        자리에 앉는다. 공분산이 자신 있게 틀려 버리고 나면 innovation 게이트가 그것을
                        고쳐 줄 좋은 측정들을 거절하기 시작하고, 추정은 걸어 나간다. 표준적인 방어책은
                        전부 이 장의 어휘로 적힌다. 선형화 지점을 사전이 아니라 사후로 두도록 갱신을
                        반복하거나, 야코비안 대신 표본점을 통과시키거나(unscented filter), 모델이 선형에
                        더 가까운 좌표를 고르는 것이다. Lie group 위의 invariant filtering이 마지막
                        방식이다.
                    </li>
                    <li>
                        <strong>4장의 Cholesky 인자가 여기 있는 데에는 이유가 있다.</strong> 갱신{" "}
                        <InlineMath math={"P^+ = P^- - K C P^-"}/>은 뺄셈이고, 부동소수점에서의 뺄셈은
                        거의 특이한 <InlineMath math={"P"}/>를 indefinite로 밀어 버릴 수 있다. 그 순간
                        필터는 어떤 방향에서 분산이 음수라고 주장하고 있는 것이고, 다음 Cholesky가
                        실패한다. square root filter는 대신{" "}
                        <InlineMath math={"SS^\\top = P"}/>인 인자 <InlineMath math={"S"}/>를 전파해서,
                        연산이 무슨 짓을 하든 공분산이 구성상 positive semidefinite이도록 만든다. 상관된
                        과정 잡음을 뽑는 것도 같은 인자로 하는데, 그것이 4장의{" "}
                        <InlineMath math={"x = \\mu + Sz"}/>다.
                    </li>
                    <li>
                        <strong>대규모 SLAM은 정보 행렬이고, 그래서 여기서는 선택 읽기인 것이 거기서는
                            중심이다.</strong> 랜드마크 하나는 그것을 본 pose들만 구속하므로{" "}
                        <InlineMath math={"\\Lambda"}/>는 대부분 0인데{" "}
                        <InlineMath math={"\\Sigma = \\Lambda^{-1}"}/>은 빽빽하다. 모든 pose가 다른 모든
                        pose와 상관되어 있기 때문이다. 요즘 back end는 성긴 쪽을 들고 풀며, 쓰는 항등식이
                        정확히 <InlineMath math={"\\Lambda^+ = \\Lambda^- + C^\\top Q^{-1}C"}/>다.
                        그래프에서 오래된 pose를 떼어 내는 일이 주변화이고, 정보 형태에서의 주변화가 이
                        장의 Schur complement다. 그 pose가 닿아 있던 모든 것 사이에 간선을 채워 넣는다.
                        주변화를 함부로 하면 성김이 무너지고 back end가 기어가게 되는 이유가 그 채움이다.
                    </li>
                    <li>
                        <strong>융합 가중치는 분산의 역수이고, 사람들이 잊는 조항이 하나 있다.</strong>{" "}
                        BLUE는 좋은 센서가 <InlineMath math={"1/\\sigma^2"}/>만큼의 발언권을 갖는다고
                        말하고, 더 나쁜 센서를 보태도 여전히 도움이 된다고 말한다. 분산 1과 분산 4가{" "}
                        <InlineMath math={"0.8"}/>로 융합된다. 조항은 <em>잡음이 독립</em>이라는 것이다.
                        캘리브레이션 오차를 공유하는 카메라 둘, 전리층 지연을 공유하는 GNSS 수신기 둘,
                        온도 드리프트를 공유하는 엔코더 둘이 모두 이 조항을 어긴다. 그것들을{" "}
                        <InlineMath math={"Q"}/>가 대각인 양 융합하면 무시한 상관만큼 정확히 과신하는
                        추정이 나온다. 상관을 <InlineMath math={"Q"}/>에 모델링하든지, 두 신호를 빼든지
                        해야 한다. 가우시안 절의 합과 차 예제가 보여 준 것이 그것이다.
                    </li>
                    <li>
                        <strong>이득을 지켜보라. 두 가지 실패 양상 모두가 진단이 된다.</strong>{" "}
                        이득이 1 근처에 앉아 있다면 필터가 자기 모델을 믿기를 그만두고 센서를 베끼고 있는
                        것이다. 출력이 원 신호만큼 시끄럽고, 돈을 주고 산 평활화가 일어나지 않고 있다.
                        이득이 0 근처라면 필터가 듣기를 그만둔 것이고, 상태에 실제로 일어난 변화, 예컨대
                        방금 미끄러지기 시작한 바퀴를 자신 있게 지나쳐 미끄러져 간다. 앞의 것은 보통{" "}
                        <InlineMath math={"R"}/>이 너무 크고, 뒤의 것은 보통{" "}
                        <InlineMath math={"R"}/>이 너무 작다. 시간에 따른{" "}
                        <InlineMath math={"K_k"}/> 그래프가 추정값을 읽는 것보다 빠르게 답을 준다.
                    </li>
                </ul>}
            />

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>References</h2>} ko={<h2>References</h2>}/>
            <ul>
                <li>
                    Jessy W. Grizzle, <em>ROB 501: Mathematics for Robotics</em>, University of Michigan,
                    2022. Chapter 5.{" "}
                    <a href={COURSE} target="_blank" rel="noopener noreferrer">{t("Course page", "코스 페이지")}</a>
                    {" · "}
                    <a href={NOTES_REPO} target="_blank" rel="noopener noreferrer">michiganrobotics/rob501</a>
                </li>
                <li>
                    <a href={KALMAN1960} target="_blank" rel="noopener noreferrer">
                        R. E. Kalman, <em>A New Approach to Linear Filtering and Prediction Problems</em>, 1960
                    </a>
                    {" · "}
                    {t("the original paper, still readable, and shorter than most summaries of it",
                        "원논문. 지금 읽어도 읽히고, 그것을 요약한 대부분의 글보다 짧다")}
                </li>
                <li>
                    <a href={ANDERSON_MOORE} target="_blank" rel="noopener noreferrer">
                        Brian D. O. Anderson and John B. Moore, <em>Optimal Filtering</em>
                    </a>
                    {" · "}
                    {t("the reference for the Riccati recursion, steady state behaviour, and convergence conditions",
                        "Riccati 점화식과 정상 상태 거동, 수렴 조건에 대한 표준 참고서")}
                </li>
                <li>
                    <a href={PROB_ROBOTICS} target="_blank" rel="noopener noreferrer">
                        Sebastian Thrun, Wolfram Burgard and Dieter Fox, <em>Probabilistic Robotics</em>
                    </a>
                    {" · "}
                    {t("chapters 2 and 3 for the same filter written from the robotics side, including the information form used in SLAM",
                        "2장과 3장이 같은 필터를 로봇 쪽에서 다시 적는다. SLAM에서 쓰는 정보 형태도 여기 있다")}
                </li>
                <li>
                    <a href={HMC_CONDITIONING} target="_blank" rel="noopener noreferrer">
                        Conditional distribution of Gaussian random vectors (Harvey Mudd)
                    </a>
                    {" · "}
                    <a href={OXFORD_GAUSS} target="_blank" rel="noopener noreferrer">
                        Steffen Lauritzen, <em>The multivariate Gaussian</em> (Oxford)
                    </a>
                    {" · "}
                    {t("the two proofs of Key Fact 1 that the notes link, for the matrix case done in full",
                        "교재가 걸어 둔 Key Fact 1의 두 증명. 행렬 경우를 끝까지 다룬다")}
                </li>
                <li>
                    <a href={EKF_PAPER} target="_blank" rel="noopener noreferrer">
                        J. W. Grizzle and P. E. Moraal, <em>Newton, observers and nonlinear discrete-time control</em>
                    </a>
                    {" · "}
                    {t("linked by the notes: the EKF analyzed as a deterministic observer rather than as an estimator",
                        "교재가 걸어 둔 링크. EKF를 추정기가 아니라 결정론적 관측기로 분석한다")}
                </li>
                <li>
                    <a href={UKF_WIKI} target="_blank" rel="noopener noreferrer">Unscented Kalman filter</a>
                    {" · "}
                    {t("the notes recommend reading this one: propagate sample points through the nonlinearity instead of a Jacobian",
                        "교재가 특히 권하는 것. 야코비안 대신 표본점을 비선형 함수에 통과시킨다")}
                </li>
            </ul>
        </>
    );
};

export default Chapter5;
