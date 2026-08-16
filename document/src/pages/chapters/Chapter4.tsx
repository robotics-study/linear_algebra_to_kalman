import CanvasFigure from "../../components/CanvasFigure";
import CholeskySteps from "../../components/pages/chapter4/CholeskySteps";
import LowRankApproximation from "../../components/pages/chapter4/LowRankApproximation";
import LuPivotSteps from "../../components/pages/chapter4/LuPivotSteps";
import QrVsNormalEquations from "../../components/pages/chapter4/QrVsNormalEquations";
import SingularValueSpectrum from "../../components/pages/chapter4/SingularValueSpectrum";
import SvdGeometry from "../../components/pages/chapter4/SvdGeometry";
import {BlockMath, InlineMath} from "../../components/math/Tex";
import {Corollary, Definition, Example, Lemma, Proof, Proposition, Remark, Theorem} from "../../components/math/Statement";
import Terms from "../../components/math/Terms";
import {T, useTr} from "../../libs/i18n";

const COURSE = "https://grizzle.robotics.umich.edu/education/rob501";
const NOTES_REPO = "https://github.com/michiganrobotics/rob501";
const ROB101 = "https://github.com/michiganrobotics/rob101";
const TREFETHEN = "https://epubs.siam.org/doi/book/10.1137/1.9780898719574";
const GOLUB = "https://jhupbooks.press.jhu.edu/title/matrix-computations";
const CHOLESKY_WIKI = "https://en.wikipedia.org/wiki/Cholesky_decomposition";

const Chapter4 = () => {
    const t = useTr();
    return (
        <>
            <T
                en={<p>
                    Chapter 3 ended with a formula. The best approximation of{" "}
                    <InlineMath math={"b"}/> from the columns of <InlineMath math={"A"}/> satisfies the
                    normal equations <InlineMath math={"A^\\top A\\hat{x} = A^\\top b"}/>, and if the columns
                    are independent you may invert <InlineMath math={"A^\\top A"}/> and read off the answer.
                    That is a correct theorem and a poor algorithm. This chapter is about the difference.
                </p>}
                ko={<p>
                    3장은 공식 하나로 끝났다. <InlineMath math={"A"}/>의 열들로 <InlineMath math={"b"}/>를
                    가장 잘 근사한 것은 normal equation{" "}
                    <InlineMath math={"A^\\top A\\hat{x} = A^\\top b"}/>을 만족하고, 열이 독립이면{" "}
                    <InlineMath math={"A^\\top A"}/>의 역행렬을 취해 답을 읽으면 된다. 정리로는 맞지만
                    알고리즘으로는 나쁘다. 이 장은 그 차이에 관한 것이다.
                </p>}
            />
            <T
                en={<p>
                    The move is always the same: leave the problem alone and rewrite the matrix. Split{" "}
                    <InlineMath math={"A"}/> into a product of factors so simple that solving with them is
                    substitution rather than inversion, and so structured that the quantities you actually
                    wanted, rank, distance to singularity, definiteness, are sitting on a diagonal where you
                    can read them.
                </p>}
                ko={<p>
                    수법은 늘 같다. 문제는 그대로 두고 행렬을 다시 쓴다.{" "}
                    <InlineMath math={"A"}/>를 아주 단순한 인자들의 곱으로 쪼개서, 그것으로 푸는 일이 역행렬이
                    아니라 대입이 되게 하고, 정작 알고 싶었던 값들, 곧 rank와 특이 행렬까지의 거리와
                    definiteness가 대각선 위에 놓여 그냥 읽히게 만든다.
                </p>}
            />
            <BlockMath math={"A = QR, \\qquad A = U\\Sigma V^\\top, \\qquad PA = LU, \\qquad M = LDL^\\top"}/>
            <Terms items={[
                ["A", <T en={<>any real <InlineMath math={"n \\times m"}/> matrix, usually a design matrix whose columns are model terms and whose rows are measurements</>}
                         ko={<>임의의 실수 <InlineMath math={"n \\times m"}/> 행렬. 보통은 열이 모델 항이고 행이 측정인 설계 행렬이다</>}/>],
                ["Q", <T en={<><InlineMath math={"n \\times m"}/> with orthonormal columns, so <InlineMath math={"Q^\\top Q = I"}/>: a change of view that does not stretch anything</>}
                         ko={<>열이 orthonormal인 <InlineMath math={"n \\times m"}/> 행렬이라 <InlineMath math={"Q^\\top Q = I"}/>이다. 아무것도 늘이지 않는 시점 변경이다</>}/>],
                ["R", <T en={<><InlineMath math={"m \\times m"}/> upper triangular, invertible exactly when the columns of <InlineMath math={"A"}/> are independent</>}
                         ko={<><InlineMath math={"m \\times m"}/> upper triangular 행렬. <InlineMath math={"A"}/>의 열이 독립일 때 정확히 그때만 가역이다</>}/>],
                ["U, V", <T en={<>square orthogonal matrices, <InlineMath math={"n \\times n"}/> and <InlineMath math={"m \\times m"}/>: rotations, possibly with a reflection</>}
                            ko={<><InlineMath math={"n \\times n"}/>과 <InlineMath math={"m \\times m"}/> 정방 직교 행렬. 회전이고, 반사가 섞일 수 있다</>}/>],
                ["\\Sigma", <T en={<><InlineMath math={"n \\times m"}/> rectangular diagonal, entries <InlineMath math={"\\sigma_1 \\ge \\cdots \\ge \\sigma_p \\ge 0"}/>: the only place any stretching happens</>}
                               ko={<><InlineMath math={"n \\times m"}/> 직사각 대각 행렬이고 성분이 <InlineMath math={"\\sigma_1 \\ge \\cdots \\ge \\sigma_p \\ge 0"}/>이다. 늘이는 일은 오직 여기서만 일어난다</>}/>],
                ["P", <T en={<>a permutation matrix: a record of which rows were swapped, nothing more</>}
                         ko={<>순열 행렬. 어느 행을 바꿔치웠는지의 기록일 뿐이다</>}/>],
                ["L", <T en={<>uni-lower triangular, meaning lower triangular with ones on the diagonal</>}
                         ko={<>uni-lower triangular. 대각이 전부 1인 lower triangular 행렬이다</>}/>],
                ["D", <T en={<>diagonal, with non-negative entries when <InlineMath math={"M"}/> is positive semidefinite</>}
                         ko={<>대각 행렬. <InlineMath math={"M"}/>이 positive semidefinite이면 성분이 전부 0 이상이다</>}/>],
                ["M", <T en={<>a symmetric matrix, in practice almost always a covariance or a Gram matrix <InlineMath math={"A^\\top A"}/></>}
                         ko={<>대칭 행렬. 실무에서는 거의 언제나 공분산이거나 Gram 행렬 <InlineMath math={"A^\\top A"}/>다</>}/>],
            ]}/>
            <T
                en={<p>
                    The chapter is titled "Three Useful Matrix Factorizations" and four names appear above.
                    Cholesky is not a fourth idea: it is LU run on a symmetric positive definite matrix, where
                    symmetry lets you do half the work and keep the result symmetric. The count is three
                    because the third one comes in two flavours.
                </p>}
                ko={<p>
                    장 제목은 "유용한 세 가지 행렬 분해"인데 위에는 이름이 넷이다. Cholesky는 네 번째 아이디어가
                    아니다. 대칭이면서 positive definite인 행렬에 LU를 돌린 것이고, 대칭성 덕분에 절반의 일만
                    하고도 결과가 대칭으로 남는다. 셋으로 세는 이유는 세 번째 것이 두 가지 모습으로 나오기
                    때문이다.
                </p>}
            />
            <table className="table-center">
                <thead>
                <tr>
                    <th>{t("factorization", "분해")}</th>
                    <th>{t("needs", "필요 조건")}</th>
                    <th>{t("hands you", "얻는 것")}</th>
                    <th>{t("used for", "쓰이는 곳")}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><InlineMath math={"A = QR"}/></td>
                    <td>{t("columns of A independent", "A의 열이 독립")}</td>
                    <td><InlineMath math={"Q^\\top Q = I"}/>, <InlineMath math={"R"}/>{" "}
                        {t("upper triangular", "upper triangular")}</td>
                    <td>{t("least squares without forming the Gram matrix", "Gram 행렬을 만들지 않는 최소제곱")}</td>
                </tr>
                <tr>
                    <td><InlineMath math={"A = U\\Sigma V^\\top"}/></td>
                    <td>{t("nothing at all", "아무 조건도 없음")}</td>
                    <td><InlineMath math={"\\sigma_1 \\ge \\cdots \\ge \\sigma_p \\ge 0"}/></td>
                    <td>{t("rank, numerical rank, distance to a lower rank, minimum norm solutions",
                        "rank, 수치적 rank, 더 낮은 rank까지의 거리, 최소 norm 해")}</td>
                </tr>
                <tr>
                    <td><InlineMath math={"PA = LU"}/></td>
                    <td>{t("nothing at all", "아무 조건도 없음")}</td>
                    <td><InlineMath math={"L"}/> {t("uni-lower", "uni-lower")},{" "}
                        <InlineMath math={"U"}/> {t("upper", "upper")}</td>
                    <td>{t("solving Ax = b by two substitutions, determinants",
                        "Ax = b를 대입 두 번으로 풀기, 행렬식")}</td>
                </tr>
                <tr>
                    <td><InlineMath math={"M = LDL^\\top"}/></td>
                    <td><InlineMath math={"M"}/> {t("symmetric positive semidefinite",
                        "대칭이고 positive semidefinite")}</td>
                    <td><InlineMath math={"D \\ge 0"}/> {t("diagonal", "대각")}</td>
                    <td>{t("covariance factoring, a positive definiteness test, half the cost of LU",
                        "공분산 분해, positive definite 판정, LU의 절반 비용")}</td>
                </tr>
                </tbody>
            </table>
            <Remark title={<T en={<>Notation used throughout</>} ko={<>이 장에서 쓰는 기호</>}/>}>
                <T
                    en={<ul>
                        <li><InlineMath math={"A_i"}/> is the <InlineMath math={"i"}/>-th{" "}
                            <strong>column</strong> of <InlineMath math={"A"}/>, and{" "}
                            <InlineMath math={"A_{ij}"}/> or <InlineMath math={"a_{ij}"}/> is the entry in
                            row <InlineMath math={"i"}/>, column <InlineMath math={"j"}/>. The notes use
                            both spellings.</li>
                        <li>Superscripts on vectors are <strong>labels, not powers</strong>, the same
                            convention as Chapters 2 and 3: <InlineMath math={"v^2"}/> is the second vector
                            of a list, while <InlineMath math={"\\sigma_2"}/> is the second entry of a
                            list of numbers.</li>
                        <li>The inner product is the real Euclidean one,{" "}
                            <InlineMath math={"\\langle x, y \\rangle = x^\\top y"}/>, and{" "}
                            <InlineMath math={"\\|x\\| = \\sqrt{x^\\top x}"}/>. Everything in this chapter
                            is real, so transposes never become conjugates.</li>
                        <li><InlineMath math={"p := \\min(n, m)"}/> throughout the SVD material, and{" "}
                            <InlineMath math={"r"}/> is the rank, so <InlineMath math={"r \\le p"}/>.</li>
                    </ul>}
                    ko={<ul>
                        <li><InlineMath math={"A_i"}/>는 <InlineMath math={"A"}/>의{" "}
                            <InlineMath math={"i"}/>번째 <strong>열</strong>이고,{" "}
                            <InlineMath math={"A_{ij}"}/> 또는 <InlineMath math={"a_{ij}"}/>는{" "}
                            <InlineMath math={"i"}/>행 <InlineMath math={"j"}/>열의 성분이다. 원 교재는 두
                            표기를 섞어 쓴다.</li>
                        <li>벡터의 위첨자는 2장, 3장과 같이 <strong>지수가 아니라 이름표</strong>다.{" "}
                            <InlineMath math={"v^2"}/>는 목록의 두 번째 벡터이고,{" "}
                            <InlineMath math={"\\sigma_2"}/>는 수 목록의 두 번째 값이다.</li>
                        <li>내적은 실수 유클리드 내적{" "}
                            <InlineMath math={"\\langle x, y \\rangle = x^\\top y"}/>이고{" "}
                            <InlineMath math={"\\|x\\| = \\sqrt{x^\\top x}"}/>다. 이 장은 전부 실수 위에서
                            돌아가므로 transpose가 켤레로 바뀔 일은 없다.</li>
                        <li>SVD 관련 내용에서는 줄곧 <InlineMath math={"p := \\min(n, m)"}/>이고,{" "}
                            <InlineMath math={"r"}/>은 rank라 <InlineMath math={"r \\le p"}/>다.</li>
                    </ul>}
                />
            </Remark>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>QR Factorization</h2>} ko={<h2>QR 분해</h2>}/>
            <T
                en={<p>
                    The first factorization is Gram-Schmidt with the bookkeeping written down. Chapter 3 ran
                    Gram-Schmidt to produce an orthonormal basis and then threw away the coefficients it used
                    along the way. Keep them instead, stack them into a triangular matrix, and you have
                    factored the matrix you started from.
                </p>}
                ko={<p>
                    첫 번째 분해는 Gram-Schmidt에 장부를 적어 둔 것이다. 3장은 Gram-Schmidt를 돌려 orthonormal
                    기저를 만들고, 그 과정에서 쓴 계수들은 버렸다. 그것을 버리지 말고 삼각 행렬에 쌓아 두면
                    출발한 행렬이 분해된다.
                </p>}
            />
            <Definition n="4.1" title={<T en={<>Upper triangular</>} ko={<>Upper triangular</>}/>}>
                <T
                    en={<p>
                        An <InlineMath math={"n \\times m"}/> matrix <InlineMath math={"R"}/> is{" "}
                        <strong>upper triangular</strong> if <InlineMath math={"R_{ij} = 0"}/> for all{" "}
                        <InlineMath math={"i > j"}/>.
                    </p>}
                    ko={<p>
                        <InlineMath math={"n \\times m"}/> 행렬 <InlineMath math={"R"}/>이 모든{" "}
                        <InlineMath math={"i > j"}/>에 대해 <InlineMath math={"R_{ij} = 0"}/>이면{" "}
                        <strong>upper triangular</strong>라 한다.
                    </p>}
                />
            </Definition>
            <Example title={<T en={<>One that is and one that is not</>} ko={<>맞는 예와 아닌 예</>}/>}>
                <BlockMath math={"R = \\begin{bmatrix} 2 & -1 & 4 \\\\ 0 & 3 & 5 \\\\ 0 & 0 & -1 \\end{bmatrix}, \\qquad S = \\begin{bmatrix} 2 & -1 & 4 \\\\ 0 & 3 & 5 \\\\ 0 & \\mathbf{7} & -1 \\end{bmatrix}"}/>
                <Terms items={[
                    ["R", <T en={<>upper triangular: every entry strictly below the diagonal is zero</>}
                             ko={<>upper triangular다. 대각선 아래는 전부 0이다</>}/>],
                    ["S", <T en={<>not upper triangular: <InlineMath math={"S_{32} = 7"}/> and <InlineMath math={"3 > 2"}/>, so exactly one clause of the definition fails</>}
                             ko={<>upper triangular가 아니다. <InlineMath math={"S_{32} = 7"}/>인데 <InlineMath math={"3 > 2"}/>라, 정의의 조항 하나가 정확히 깨진다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The point of the shape is that <InlineMath math={"Rx = c"}/> can be solved from the
                        bottom up with no inversion at all. The last row reads{" "}
                        <InlineMath math={"-x_3 = c_3"}/>, and once <InlineMath math={"x_3"}/> is known the
                        second row has one unknown left. That is back substitution, and it costs about{" "}
                        <InlineMath math={"m^2/2"}/> multiplications instead of the{" "}
                        <InlineMath math={"m^3/3"}/> an inverse would cost.
                    </p>}
                    ko={<p>
                        이 모양이 중요한 이유는 <InlineMath math={"Rx = c"}/>를 역행렬 없이 아래에서부터 풀 수
                        있기 때문이다. 마지막 행은 <InlineMath math={"-x_3 = c_3"}/>이고,{" "}
                        <InlineMath math={"x_3"}/>이 정해지면 둘째 행에는 미지수가 하나만 남는다. 이것이 back
                        substitution이고, 역행렬이 드는 <InlineMath math={"m^3/3"}/> 대신{" "}
                        <InlineMath math={"m^2/2"}/> 번의 곱셈이면 끝난다.
                    </p>}
                />
            </Example>
            <Theorem n="4.2" title={<T en={<>QR Decomposition or Factorization</>} ko={<>QR 분해</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"A"}/> be a real <InlineMath math={"n \\times m"}/> matrix with{" "}
                        <strong>linearly independent columns</strong>. Then there exist an{" "}
                        <InlineMath math={"n \\times m"}/> matrix <InlineMath math={"Q"}/> with{" "}
                        <strong>orthonormal columns</strong> and an <InlineMath math={"m \\times m"}/> upper
                        triangular matrix <InlineMath math={"R"}/> such that
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>가 <strong>열이 선형 독립인</strong> 실수{" "}
                        <InlineMath math={"n \\times m"}/> 행렬이라 하자. 그러면 열이{" "}
                        <strong>orthonormal</strong>인 <InlineMath math={"n \\times m"}/> 행렬{" "}
                        <InlineMath math={"Q"}/>와 upper triangular인{" "}
                        <InlineMath math={"m \\times m"}/> 행렬 <InlineMath math={"R"}/>이 존재하여 다음이
                        성립한다.
                    </p>}
                />
                <BlockMath math={"A = QR"}/>
                <Terms items={[
                    ["A", <T en={<>the <InlineMath math={"n \\times m"}/> matrix being factored, with <InlineMath math={"n \\ge m"}/> in every case of interest</>}
                             ko={<>분해할 <InlineMath math={"n \\times m"}/> 행렬. 관심 있는 경우는 모두 <InlineMath math={"n \\ge m"}/>이다</>}/>],
                    ["Q", <T en={<><InlineMath math={"n \\times m"}/>, columns orthonormal, so <InlineMath math={"Q^\\top Q = I_{m \\times m}"}/>. Note <InlineMath math={"QQ^\\top \\ne I"}/> unless <InlineMath math={"n = m"}/></>}
                             ko={<><InlineMath math={"n \\times m"}/>이고 열이 orthonormal이라 <InlineMath math={"Q^\\top Q = I_{m \\times m}"}/>이다. <InlineMath math={"n = m"}/>이 아니면 <InlineMath math={"QQ^\\top \\ne I"}/>임에 주의</>}/>],
                    ["R", <T en={<><InlineMath math={"m \\times m"}/> upper triangular, and its diagonal entries are the Gram-Schmidt lengths <InlineMath math={"\\|v^k\\|"}/></>}
                             ko={<><InlineMath math={"m \\times m"}/> upper triangular이고, 대각 성분은 Gram-Schmidt에서 나오는 길이 <InlineMath math={"\\|v^k\\|"}/>다</>}/>],
                ]}/>
                <Proof>
                    <T
                        en={<p>
                            The proof is the Gram-Schmidt algorithm with normalization, run on the columns of{" "}
                            <InlineMath math={"A"}/>. Partition{" "}
                            <InlineMath math={"A = \\begin{bmatrix} A_1 & A_2 & \\cdots & A_m\\end{bmatrix}"}/>{" "}
                            with <InlineMath math={"A_i \\in \\mathbb{R}^n"}/>, and use{" "}
                            <InlineMath math={"\\langle x, y\\rangle = x^\\top y"}/>.
                        </p>}
                        ko={<p>
                            증명은 <InlineMath math={"A"}/>의 열에 대해 정규화를 포함한 Gram-Schmidt를 돌리는
                            것이다. <InlineMath math={"A_i \\in \\mathbb{R}^n"}/>로 두어{" "}
                            <InlineMath math={"A = \\begin{bmatrix} A_1 & A_2 & \\cdots & A_m\\end{bmatrix}"}/>{" "}
                            로 쪼개고, 내적은 <InlineMath math={"\\langle x, y\\rangle = x^\\top y"}/>를 쓴다.
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} &\\textbf{for } k = 1 : m \\\\ &\\quad v^k = A_k \\\\ &\\quad \\textbf{for } j = 1 : k-1 \\\\ &\\quad\\quad v^k = v^k - \\langle A_k, v^j\\rangle\\, v^j \\\\ &\\quad \\textbf{end} \\\\ &\\quad v^k = v^k / \\|v^k\\| \\\\ &\\textbf{end} \\end{aligned}"}/>
                    <Terms items={[
                        ["v^k", <T en={<>the <InlineMath math={"k"}/>-th output direction, first built by subtraction and then normalized to length one</>}
                                   ko={<><InlineMath math={"k"}/>번째 출력 방향. 먼저 빼기로 만들고 마지막에 길이 1로 정규화한다</>}/>],
                        ["\\langle A_k, v^j\\rangle", <T en={<>how much of the new column already points along a finished direction, the amount to remove</>}
                                                        ko={<>새 열이 이미 완성된 방향으로 얼마나 가 있는지. 덜어 낼 양이다</>}/>],
                        ["\\|v^k\\|", <T en={<>strictly positive because the columns are independent; this is the only place independence is used</>}
                                        ko={<>열이 독립이라 반드시 양수다. 독립성이 쓰이는 곳은 여기 한 군데뿐이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>The matrix <InlineMath math={"Q"}/>.</strong> Set{" "}
                            <InlineMath math={"Q := \\begin{bmatrix} v^1 & v^2 & \\cdots & v^m\\end{bmatrix}"}/>.
                            By construction the columns are orthonormal, so{" "}
                            <InlineMath math={"[Q^\\top Q]_{ij} = \\langle v^i, v^j\\rangle"}/> is one when{" "}
                            <InlineMath math={"i = j"}/> and zero otherwise, which is to say{" "}
                            <InlineMath math={"Q^\\top Q = I_{m \\times m}"}/>.
                        </p>}
                        ko={<p>
                            <strong>행렬 <InlineMath math={"Q"}/>.</strong>{" "}
                            <InlineMath math={"Q := \\begin{bmatrix} v^1 & v^2 & \\cdots & v^m\\end{bmatrix}"}/>{" "}
                            로 둔다. 만든 방식대로 열은 orthonormal이므로{" "}
                            <InlineMath math={"[Q^\\top Q]_{ij} = \\langle v^i, v^j\\rangle"}/>은{" "}
                            <InlineMath math={"i = j"}/>일 때 1이고 나머지는 0이다. 곧{" "}
                            <InlineMath math={"Q^\\top Q = I_{m \\times m}"}/>이다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>The matrix <InlineMath math={"R"}/>.</strong> The loop only ever subtracts
                            multiples of earlier directions from <InlineMath math={"A_i"}/>, so{" "}
                            <InlineMath math={"A_i \\in \\operatorname{span}\\{v^1, \\ldots, v^i\\}"}/>.
                            Expanding a vector in an orthonormal basis gives the coefficients as inner
                            products, so
                        </p>}
                        ko={<p>
                            <strong>행렬 <InlineMath math={"R"}/>.</strong> 루프는{" "}
                            <InlineMath math={"A_i"}/>에서 앞선 방향들의 배수만 빼므로{" "}
                            <InlineMath math={"A_i \\in \\operatorname{span}\\{v^1, \\ldots, v^i\\}"}/>이다.
                            orthonormal 기저로 벡터를 전개하면 계수가 내적으로 나오므로 다음이 성립한다.
                        </p>}
                    />
                    <BlockMath math={"A_i = \\langle A_i, v^1\\rangle v^1 + \\langle A_i, v^2\\rangle v^2 + \\cdots + \\langle A_i, v^i\\rangle v^i"}/>
                    <Terms items={[
                        ["\\langle A_i, v^j\\rangle", <T en={<>the coefficient of <InlineMath math={"v^j"}/> in the expansion of the <InlineMath math={"i"}/>-th column, which becomes <InlineMath math={"R_{ji}"}/></>}
                                                        ko={<><InlineMath math={"i"}/>번째 열을 전개했을 때 <InlineMath math={"v^j"}/>의 계수. 이것이 <InlineMath math={"R_{ji}"}/>가 된다</>}/>],
                        ["j \\le i", <T en={<>the sum stops at <InlineMath math={"i"}/>: later directions were built after <InlineMath math={"A_i"}/> and are orthogonal to it in the relevant sense</>}
                                       ko={<>합이 <InlineMath math={"i"}/>에서 멈춘다. 뒤의 방향들은 <InlineMath math={"A_i"}/> 다음에 만들어졌다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Now define the <InlineMath math={"i"}/>-th column of{" "}
                            <InlineMath math={"R"}/> to hold exactly those coefficients, padded with zeros:
                        </p>}
                        ko={<p>
                            이제 <InlineMath math={"R"}/>의 <InlineMath math={"i"}/>번째 열이 바로 그 계수들을
                            담고 아래는 0으로 채우도록 정의한다.
                        </p>}
                    />
                    <BlockMath math={"R_i := \\begin{bmatrix} \\langle A_i, v^1\\rangle \\\\ \\vdots \\\\ \\langle A_i, v^i\\rangle \\\\ 0 \\\\ \\vdots \\\\ 0\\end{bmatrix}, \\qquad R_{ji} = 0 \\;\\text{ for } j > i"}/>
                    <Terms items={[
                        ["R_i", <T en={<>the <InlineMath math={"i"}/>-th column of <InlineMath math={"R"}/>, so that <InlineMath math={"A_i = Q R_i"}/></>}
                                  ko={<><InlineMath math={"R"}/>의 <InlineMath math={"i"}/>번째 열. 그래서 <InlineMath math={"A_i = Q R_i"}/>가 된다</>}/>],
                        ["R_{ji} = 0", <T en={<>for <InlineMath math={"j > i"}/>, which is Definition 4.1: <InlineMath math={"R"}/> is upper triangular</>}
                                         ko={<><InlineMath math={"j > i"}/>일 때 0이라는 것이 Definition 4.1이다. 곧 <InlineMath math={"R"}/>은 upper triangular다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Column by column <InlineMath math={"A_i = QR_i"}/>, and stacking the columns
                            gives <InlineMath math={"A = QR"}/>. The coefficients cost nothing extra: the
                            algorithm computed every one of them on its way to building{" "}
                            <InlineMath math={"Q"}/>. Note also that{" "}
                            <InlineMath math={"R_i = [A_i]_{\\{v^1, \\ldots, v^m\\}}"}/> is the representation
                            of <InlineMath math={"A_i"}/> in the new basis, in exactly the sense of Chapter 2.
                        </p>}
                        ko={<p>
                            열마다 <InlineMath math={"A_i = QR_i"}/>이고, 열을 나란히 세우면{" "}
                            <InlineMath math={"A = QR"}/>이다. 계수는 공짜다.{" "}
                            <InlineMath math={"Q"}/>를 만드는 길에 알고리즘이 이미 전부 계산했다. 그리고{" "}
                            <InlineMath math={"R_i = [A_i]_{\\{v^1, \\ldots, v^m\\}}"}/>는 2장이 말하는 바로
                            그 뜻에서 새 기저에 대한 <InlineMath math={"A_i"}/>의 표현이다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <Remark n="4.3" title={<T en={<>Three consequences</>} ko={<>따라 나오는 세 가지</>}/>}>
                <T
                    en={<ol>
                        <li><InlineMath math={"Q^\\top Q = I_{m \\times m}"}/>.</li>
                        <li><InlineMath math={"R"}/> has the shape below, with the Gram-Schmidt lengths on
                            the diagonal.</li>
                        <li>The columns of <InlineMath math={"A"}/> are linearly independent{" "}
                            <InlineMath math={"\\iff"}/> <InlineMath math={"R"}/> is invertible.</li>
                    </ol>}
                    ko={<ol>
                        <li><InlineMath math={"Q^\\top Q = I_{m \\times m}"}/>이다.</li>
                        <li><InlineMath math={"R"}/>은 아래 모양이고, 대각에는 Gram-Schmidt에서 나온 길이가
                            놓인다.</li>
                        <li><InlineMath math={"A"}/>의 열이 선형 독립{" "}
                            <InlineMath math={"\\iff"}/> <InlineMath math={"R"}/>이 가역.</li>
                    </ol>}
                />
                <BlockMath math={"R = \\begin{bmatrix} r_{11} & r_{12} & \\cdots & r_{1m} \\\\ 0 & r_{22} & \\cdots & r_{2m} \\\\ \\vdots & & \\ddots & \\vdots \\\\ 0 & \\cdots & 0 & r_{mm} \\end{bmatrix}"}/>
                <Terms items={[
                    ["r_{kk}", <T en={<>equal to <InlineMath math={"\\|v^k\\|"}/> before normalization, so all of them are strictly positive here</>}
                                 ko={<>정규화 직전의 <InlineMath math={"\\|v^k\\|"}/>와 같다. 그래서 여기서는 전부 양수다</>}/>],
                    ["r_{jk}", <T en={<>equal to <InlineMath math={"\\langle A_k, v^j\\rangle"}/> for <InlineMath math={"j < k"}/>, the amount that was subtracted off</>}
                                 ko={<><InlineMath math={"j < k"}/>일 때 <InlineMath math={"\\langle A_k, v^j\\rangle"}/>와 같다. 덜어 낸 양이다</>}/>],
                    ["\\det R", <T en={<>the product of the diagonal, non-zero exactly when every <InlineMath math={"\\|v^k\\| > 0"}/>, which is item 3</>}
                                  ko={<>대각의 곱. 모든 <InlineMath math={"\\|v^k\\| > 0"}/>일 때 정확히 0이 아니며, 그것이 3번이다</>}/>],
                ]}/>
            </Remark>
            <Remark title={<T en={<>Three slips in the printed proof</>} ko={<>인쇄된 증명의 오기 세 곳</>}/>}>
                <T
                    en={<ul>
                        <li>The loop bound is printed as{" "}
                            <InlineMath math={"1 \\le k \\le n"}/>. It should be{" "}
                            <InlineMath math={"1 \\le k \\le m"}/>: there are{" "}
                            <InlineMath math={"m"}/> columns to orthogonalize, not{" "}
                            <InlineMath math={"n"}/>.</li>
                        <li>The expansion of <InlineMath math={"A_i"}/> is printed with the first factors as{" "}
                            <InlineMath math={"\\langle A_1, v^1\\rangle, \\langle A_2, v^2\\rangle, \\ldots"}/>.
                            Every inner product in that sum has to be taken against{" "}
                            <InlineMath math={"A_i"}/>, the column being expanded, as written above.</li>
                        <li>The triangularity claim is printed as{" "}
                            <InlineMath math={"R_{ij} = 0 \\text{ for } i < j \\le n"}/>, which is the
                            condition for <em>lower</em> triangular and contradicts Definition 4.1 on the
                            page before. The correct statement is{" "}
                            <InlineMath math={"R_{ij} = 0"}/> for <InlineMath math={"i > j"}/>.</li>
                    </ul>}
                    ko={<ul>
                        <li>루프 범위가 <InlineMath math={"1 \\le k \\le n"}/>으로 인쇄되어 있다.{" "}
                            <InlineMath math={"1 \\le k \\le m"}/>이어야 한다. 직교화할 열은{" "}
                            <InlineMath math={"n"}/>개가 아니라 <InlineMath math={"m"}/>개다.</li>
                        <li><InlineMath math={"A_i"}/>의 전개가{" "}
                            <InlineMath math={"\\langle A_1, v^1\\rangle, \\langle A_2, v^2\\rangle, \\ldots"}/>{" "}
                            로 인쇄되어 있다. 그 합의 내적은 전부 전개 대상인 열{" "}
                            <InlineMath math={"A_i"}/>와 취해야 한다. 위에 적은 형태가 맞다.</li>
                        <li>삼각성 주장이{" "}
                            <InlineMath math={"R_{ij} = 0 \\text{ for } i < j \\le n"}/>으로 인쇄되어 있는데,
                            이것은 <em>lower</em> triangular의 조건이고 한 쪽 앞의 Definition 4.1과
                            어긋난다. 옳은 진술은 <InlineMath math={"i > j"}/>에 대해{" "}
                            <InlineMath math={"R_{ij} = 0"}/>이다.</li>
                    </ul>}
                />
            </Remark>
            <Example title={<T en={<>A QR factorization with actual numbers</>} ko={<>숫자로 하는 QR 분해</>}/>}>
                <T
                    en={<p>
                        Take the <InlineMath math={"3 \\times 2"}/> matrix below and run the loop by hand.
                        Its two columns are independent, so the theorem applies.
                    </p>}
                    ko={<p>
                        아래 <InlineMath math={"3 \\times 2"}/> 행렬을 놓고 루프를 손으로 돌려 본다. 두 열이
                        독립이므로 정리가 적용된다.
                    </p>}
                />
                <BlockMath math={"A = \\begin{bmatrix} 1 & 1 \\\\ 1 & 0 \\\\ 0 & 1 \\end{bmatrix}, \\qquad A_1 = \\begin{bmatrix}1\\\\1\\\\0\\end{bmatrix}, \\qquad A_2 = \\begin{bmatrix}1\\\\0\\\\1\\end{bmatrix}"}/>
                <Terms items={[
                    ["A_1, A_2", <T en={<>the two columns, the raw inputs to Gram-Schmidt</>}
                                   ko={<>두 열. Gram-Schmidt에 들어가는 날것의 입력이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        <strong>Step <InlineMath math={"k = 1"}/>.</strong>{" "}
                        <InlineMath math={"v^1 = A_1"}/> with{" "}
                        <InlineMath math={"\\|v^1\\| = \\sqrt{2}"}/>, so{" "}
                        <InlineMath math={"r_{11} = \\sqrt{2}"}/> and{" "}
                        <InlineMath math={"v^1 = (1, 1, 0)^\\top/\\sqrt{2}"}/>.
                    </p>}
                    ko={<p>
                        <strong><InlineMath math={"k = 1"}/> 단계.</strong>{" "}
                        <InlineMath math={"v^1 = A_1"}/>이고{" "}
                        <InlineMath math={"\\|v^1\\| = \\sqrt{2}"}/>이므로{" "}
                        <InlineMath math={"r_{11} = \\sqrt{2}"}/>,{" "}
                        <InlineMath math={"v^1 = (1, 1, 0)^\\top/\\sqrt{2}"}/>이다.
                    </p>}
                />
                <T
                    en={<p>
                        <strong>Step <InlineMath math={"k = 2"}/>.</strong> The overlap is{" "}
                        <InlineMath math={"r_{12} = \\langle A_2, v^1\\rangle = 1/\\sqrt{2}"}/>. Subtract it
                        and measure what is left:
                    </p>}
                    ko={<p>
                        <strong><InlineMath math={"k = 2"}/> 단계.</strong> 겹치는 양은{" "}
                        <InlineMath math={"r_{12} = \\langle A_2, v^1\\rangle = 1/\\sqrt{2}"}/>이다. 그것을
                        빼고 남은 것을 잰다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} v^2 &= \\begin{bmatrix}1\\\\0\\\\1\\end{bmatrix} - \\tfrac{1}{\\sqrt{2}}\\cdot\\tfrac{1}{\\sqrt{2}}\\begin{bmatrix}1\\\\1\\\\0\\end{bmatrix} = \\begin{bmatrix}\\tfrac12\\\\-\\tfrac12\\\\1\\end{bmatrix} \\\\[4pt] r_{22} = \\|v^2\\| &= \\sqrt{\\tfrac14 + \\tfrac14 + 1} = \\tfrac{\\sqrt{6}}{2} \\end{aligned}"}/>
                <Terms items={[
                    ["v^2", <T en={<>what is left of the second column after the first direction is removed; its inner product with <InlineMath math={"v^1"}/> is <InlineMath math={"\\tfrac12 - \\tfrac12 = 0"}/></>}
                              ko={<>첫 방향을 덜어 낸 뒤 둘째 열에 남은 것. <InlineMath math={"v^1"}/>과의 내적이 <InlineMath math={"\\tfrac12 - \\tfrac12 = 0"}/>이다</>}/>],
                    ["r_{22}", <T en={<>its length, which becomes the second diagonal entry of <InlineMath math={"R"}/></>}
                                 ko={<>그 길이. <InlineMath math={"R"}/>의 두 번째 대각 성분이 된다</>}/>],
                ]}/>
                <BlockMath math={"Q = \\frac{1}{\\sqrt{6}}\\begin{bmatrix} \\sqrt{3} & 1 \\\\ \\sqrt{3} & -1 \\\\ 0 & 2 \\end{bmatrix}, \\qquad R = \\begin{bmatrix} \\sqrt{2} & \\tfrac{1}{\\sqrt{2}} \\\\[3pt] 0 & \\tfrac{\\sqrt{6}}{2} \\end{bmatrix}"}/>
                <Terms items={[
                    ["Q", <T en={<>columns <InlineMath math={"(1,1,0)^\\top/\\sqrt{2}"}/> and <InlineMath math={"(1,-1,2)^\\top/\\sqrt{6}"}/>, both unit length and orthogonal to each other</>}
                             ko={<>열이 <InlineMath math={"(1,1,0)^\\top/\\sqrt{2}"}/>과 <InlineMath math={"(1,-1,2)^\\top/\\sqrt{6}"}/>이다. 둘 다 길이 1이고 서로 직교한다</>}/>],
                    ["R", <T en={<>upper triangular with positive diagonal; multiplying <InlineMath math={"QR"}/> returns <InlineMath math={"A"}/> exactly</>}
                             ko={<>대각이 양수인 upper triangular. <InlineMath math={"QR"}/>을 곱하면 정확히 <InlineMath math={"A"}/>가 나온다</>}/>],
                ]}/>
            </Example>

            <Example n="4.4" title={<T en={<>QR for overdetermined equations</>} ko={<>overdetermined 방정식에 쓰는 QR</>}/>}>
                <T
                    en={<p>
                        Suppose <InlineMath math={"Ax = b"}/> is overdetermined with the columns of{" "}
                        <InlineMath math={"A"}/> linearly independent. Write{" "}
                        <InlineMath math={"A = QR"}/> and watch the normal equations collapse:
                    </p>}
                    ko={<p>
                        <InlineMath math={"Ax = b"}/>가 overdetermined이고 <InlineMath math={"A"}/>의 열이
                        선형 독립이라 하자. <InlineMath math={"A = QR"}/>로 쓰면 normal equation이 주저앉는다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} A^\\top A\\hat{x} &= A^\\top b \\\\ \\iff \\quad R^\\top Q^\\top Q R\\hat{x} &= R^\\top Q^\\top b \\\\ \\iff \\quad R^\\top R\\hat{x} &= R^\\top Q^\\top b \\\\ \\iff \\quad R\\hat{x} &= Q^\\top b \\end{aligned}"}/>
                <Terms items={[
                    ["Q^\\top Q = I", <T en={<>used in the third line, which is why the two <InlineMath math={"Q"}/> factors in the middle vanish</>}
                                        ko={<>셋째 줄에서 쓴다. 가운데의 <InlineMath math={"Q"}/> 두 개가 사라지는 이유다</>}/>],
                    ["R^{-1}", <T en={<>exists by Remark 4.3 item 3, which is why the last line may cancel <InlineMath math={"R^\\top"}/> from both sides</>}
                                 ko={<>Remark 4.3의 3번으로 존재한다. 마지막 줄에서 양변의 <InlineMath math={"R^\\top"}/>을 지울 수 있는 이유다</>}/>],
                    ["R\\hat{x} = Q^\\top b", <T en={<>a triangular system: solve it by back substitution, from <InlineMath math={"\\hat{x}_m"}/> up to <InlineMath math={"\\hat{x}_1"}/></>}
                                                ko={<>삼각 계다. <InlineMath math={"\\hat{x}_m"}/>부터 <InlineMath math={"\\hat{x}_1"}/>까지 back substitution으로 푼다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Continue the numeric example with{" "}
                        <InlineMath math={"b = (1, 2, 3)^\\top"}/>. Three equations, two unknowns, and no
                        exact solution. Form <InlineMath math={"Q^\\top b"}/> and solve upward:
                    </p>}
                    ko={<p>
                        앞의 수치 예제를 <InlineMath math={"b = (1, 2, 3)^\\top"}/>으로 이어 간다. 식은 셋,
                        미지수는 둘이고 정확한 해는 없다. <InlineMath math={"Q^\\top b"}/>를 만들고 위로 올라가며
                        푼다.
                    </p>}
                />
                <BlockMath math={"Q^\\top b = \\begin{bmatrix} \\tfrac{1 + 2}{\\sqrt{2}} \\\\[3pt] \\tfrac{1 - 2 + 6}{\\sqrt{6}} \\end{bmatrix} = \\begin{bmatrix} \\tfrac{3}{\\sqrt{2}} \\\\[3pt] \\tfrac{5}{\\sqrt{6}} \\end{bmatrix}"}/>
                <Terms items={[
                    ["Q^\\top b", <T en={<>the coordinates of <InlineMath math={"b"}/> along the two orthonormal directions, one inner product each</>}
                                    ko={<>두 orthonormal 방향에 대한 <InlineMath math={"b"}/>의 좌표. 각각 내적 한 번이다</>}/>],
                ]}/>
                <BlockMath math={"\\begin{aligned} \\tfrac{\\sqrt{6}}{2}\\,\\hat{x}_2 &= \\tfrac{5}{\\sqrt{6}} &&\\implies\\quad \\hat{x}_2 = \\tfrac{10}{6} = \\tfrac{5}{3} \\\\[3pt] \\sqrt{2}\\,\\hat{x}_1 + \\tfrac{1}{\\sqrt{2}}\\cdot\\tfrac{5}{3} &= \\tfrac{3}{\\sqrt{2}} &&\\implies\\quad \\hat{x}_1 = \\tfrac{2}{3} \\end{aligned}"}/>
                <Terms items={[
                    ["\\hat{x}_2", <T en={<>read off first, because the bottom row of a triangular system has only one unknown</>}
                                     ko={<>먼저 읽는다. 삼각 계의 마지막 행에는 미지수가 하나뿐이다</>}/>],
                    ["\\hat{x}_1", <T en={<>then substituted upward; no matrix was inverted anywhere in this example</>}
                                     ko={<>그다음 위로 대입한다. 이 예제 어디에서도 역행렬을 낸 적이 없다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Check it against Chapter 3. The residual is{" "}
                        <InlineMath math={"e = b - A\\hat{x} = \\tfrac{4}{3}(-1, 1, 1)^\\top"}/>, and{" "}
                        <InlineMath math={"A^\\top e = (0, 0)^\\top"}/>. The residual is orthogonal to both
                        columns of <InlineMath math={"A"}/>, which is the projection theorem, reached without
                        ever forming <InlineMath math={"A^\\top A"}/>.
                    </p>}
                    ko={<p>
                        3장과 대조해 보자. 잔차는{" "}
                        <InlineMath math={"e = b - A\\hat{x} = \\tfrac{4}{3}(-1, 1, 1)^\\top"}/>이고{" "}
                        <InlineMath math={"A^\\top e = (0, 0)^\\top"}/>이다. 잔차가{" "}
                        <InlineMath math={"A"}/>의 두 열과 직교한다. 사영 정리 그대로이고,{" "}
                        <InlineMath math={"A^\\top A"}/>를 한 번도 만들지 않고 도달했다.
                    </p>}
                />
            </Example>
            <Example n="4.5" title={<T en={<>QR for underdetermined equations</>} ko={<>underdetermined 방정식에 쓰는 QR</>}/>}>
                <T
                    en={<p>
                        Now suppose <InlineMath math={"Ax = b"}/> is underdetermined with the{" "}
                        <strong>rows</strong> of <InlineMath math={"A"}/> independent. Chapter 3 gives the
                        solution of smallest norm as{" "}
                        <InlineMath math={"\\hat{x} = A^\\top(AA^\\top)^{-1}b"}/>. Since{" "}
                        <InlineMath math={"A^\\top"}/> is the one with independent columns, factor{" "}
                        <InlineMath math={"A^\\top = QR"}/>:
                    </p>}
                    ko={<p>
                        이번에는 <InlineMath math={"Ax = b"}/>가 underdetermined이고{" "}
                        <InlineMath math={"A"}/>의 <strong>행</strong>이 독립이라 하자. 3장은 norm이 가장 작은
                        해를 <InlineMath math={"\\hat{x} = A^\\top(AA^\\top)^{-1}b"}/>로 준다. 열이 독립인 쪽은{" "}
                        <InlineMath math={"A^\\top"}/>이므로 <InlineMath math={"A^\\top = QR"}/>로 분해한다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} \\hat{x} &= A^\\top(AA^\\top)^{-1}b = QR\\left(R^\\top Q^\\top QR\\right)^{-1}b \\\\ &= QR(R^\\top R)^{-1}b = QRR^{-1}(R^\\top)^{-1}b = Q(R^\\top)^{-1}b \\end{aligned}"}/>
                <Terms items={[
                    ["(R^\\top)^{-1}b", <T en={<>never computed as an inverse: solve the lower triangular system <InlineMath math={"R^\\top y = b"}/> by forward substitution</>}
                                          ko={<>역행렬로 계산하지 않는다. lower triangular 계 <InlineMath math={"R^\\top y = b"}/>를 forward substitution으로 푼다</>}/>],
                    ["\\hat{x} = Qy", <T en={<>one matrix-vector product finishes it, so the whole solve is one triangular pass plus one product</>}
                                        ko={<>행렬 벡터 곱 한 번으로 끝난다. 전체 풀이가 삼각 대입 한 번에 곱 한 번이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Take <InlineMath math={"A = \\begin{bmatrix}1 & 1 & 0\\\\ 1 & 0 & 1\\end{bmatrix}"}/>{" "}
                        and <InlineMath math={"b = (1, 2)^\\top"}/>. Then{" "}
                        <InlineMath math={"A^\\top"}/> is the very matrix factored above, so{" "}
                        <InlineMath math={"Q"}/> and <InlineMath math={"R"}/> are already in hand. Forward
                        substitution on <InlineMath math={"R^\\top y = b"}/> gives{" "}
                        <InlineMath math={"y_1 = 1/\\sqrt{2}"}/> and then{" "}
                        <InlineMath math={"y_2 = 3/\\sqrt{6}"}/>, and
                    </p>}
                    ko={<p>
                        <InlineMath math={"A = \\begin{bmatrix}1 & 1 & 0\\\\ 1 & 0 & 1\\end{bmatrix}"}/>과{" "}
                        <InlineMath math={"b = (1, 2)^\\top"}/>을 잡는다. 그러면{" "}
                        <InlineMath math={"A^\\top"}/>이 방금 분해한 바로 그 행렬이라{" "}
                        <InlineMath math={"Q"}/>와 <InlineMath math={"R"}/>이 이미 손에 있다.{" "}
                        <InlineMath math={"R^\\top y = b"}/>에 forward substitution을 하면{" "}
                        <InlineMath math={"y_1 = 1/\\sqrt{2}"}/>, 이어서{" "}
                        <InlineMath math={"y_2 = 3/\\sqrt{6}"}/>이 나오고,
                    </p>}
                />
                <BlockMath math={"\\hat{x} = Qy = \\tfrac{1}{2}\\begin{bmatrix}1\\\\1\\\\0\\end{bmatrix} + \\tfrac{1}{2}\\begin{bmatrix}1\\\\-1\\\\2\\end{bmatrix} = \\begin{bmatrix}1\\\\0\\\\1\\end{bmatrix}"}/>
                <Terms items={[
                    ["\\hat{x}", <T en={<>satisfies <InlineMath math={"A\\hat{x} = (1, 2)^\\top = b"}/> exactly, as an underdetermined system should</>}
                                   ko={<>정확히 <InlineMath math={"A\\hat{x} = (1, 2)^\\top = b"}/>를 만족한다. underdetermined 계라면 당연하다</>}/>],
                    ["\\operatorname{null}(A)", <T en={<>spanned by <InlineMath math={"(1, -1, -1)^\\top"}/>, and <InlineMath math={"\\hat{x}"}/> is orthogonal to it, which is what makes this the shortest solution</>}
                                                  ko={<><InlineMath math={"(1, -1, -1)^\\top"}/>이 생성한다. <InlineMath math={"\\hat{x}"}/>이 여기에 직교하고, 그래서 이것이 가장 짧은 해다</>}/>],
                ]}/>
            </Example>
            <T
                en={<p>
                    Both examples solve their problem without ever building{" "}
                    <InlineMath math={"A^\\top A"}/>. The notes move past that point quickly, but it is the
                    reason the factorization exists. Forming the Gram matrix squares the condition number, and
                    squaring a condition number costs you half of your significant digits before the solve
                    even begins.
                </p>}
                ko={<p>
                    두 예제 모두 <InlineMath math={"A^\\top A"}/>를 만들지 않고 문제를 푼다. 교재는 이 지점을
                    빠르게 지나가지만, 분해가 존재하는 이유가 바로 그것이다. Gram 행렬을 만드는 순간 조건수가
                    제곱되고, 조건수가 제곱된다는 것은 풀이가 시작되기도 전에 유효 숫자의 절반을 잃는다는 뜻이다.
                </p>}
            />
            <BlockMath math={"\\kappa(A) = \\frac{\\sigma_1}{\\sigma_m} \\qquad \\implies \\qquad \\kappa(A^\\top A) = \\kappa(A)^2"}/>
            <Terms items={[
                ["\\kappa(A)", <T en={<>the condition number, the ratio of the largest singular value to the smallest; the next section defines the singular values</>}
                                 ko={<>조건수. 가장 큰 특이값과 가장 작은 특이값의 비다. 특이값은 다음 절에서 정의한다</>}/>],
                ["\\sigma_i", <T en={<>the singular values of <InlineMath math={"A"}/>; those of <InlineMath math={"A^\\top A"}/> are the <InlineMath math={"\\sigma_i^2"}/>, which is where the square comes from</>}
                                ko={<><InlineMath math={"A"}/>의 특이값. <InlineMath math={"A^\\top A"}/>의 것은 <InlineMath math={"\\sigma_i^2"}/>이고, 제곱은 여기서 나온다</>}/>],
                ["\\kappa(A)^2", <T en={<>the factor by which errors in <InlineMath math={"b"}/> can be amplified once the Gram matrix is formed</>}
                                   ko={<>Gram 행렬을 만들고 나면 <InlineMath math={"b"}/>의 오차가 증폭될 수 있는 배율</>}/>],
            ]}/>
            <CanvasFigure label={t("The same least squares problem, solved two ways, in the same double precision",
                "같은 최소제곱 문제를 같은 배정밀도 위에서 두 방법으로 푼 결과")}
                          modal={<QrVsNormalEquations width={860} height={380}/>}
                          bodyClassName="w-[min(94vw,900px)]">
                <QrVsNormalEquations/>
            </CanvasFigure>
            <T
                en={<p>
                    One honest warning about the algorithm in the proof. Gram-Schmidt as written is a proof of
                    existence, not the routine to implement: in floating point the computed columns of{" "}
                    <InlineMath math={"Q"}/> drift out of orthogonality when the columns of{" "}
                    <InlineMath math={"A"}/> are close to dependent. Production QR uses Householder
                    reflections, which is what the figure above runs. The factorization is the same object;
                    only the road to it differs.
                </p>}
                ko={<p>
                    증명에 나온 알고리즘에 대해 솔직한 경고를 하나 붙인다. 적힌 그대로의 Gram-Schmidt는 존재성의
                    증명이지 구현할 루틴이 아니다. 부동소수점에서는 <InlineMath math={"A"}/>의 열이 종속에
                    가까워질수록 계산된 <InlineMath math={"Q"}/>의 열이 직교에서 밀려난다. 실제 QR 루틴은
                    Householder 반사를 쓰고, 위 그림이 돌리는 것도 그것이다. 분해 자체는 같은 대상이고 거기까지
                    가는 길만 다르다.
                </p>}
            />

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Singular Value Decomposition</h2>} ko={<h2>특이값 분해(SVD)</h2>}/>
            <T
                en={<p>
                    In abstract linear algebra a set of vectors is either linearly independent or it is not.
                    There is nothing in between. That is a clean definition and a useless one for engineering,
                    because the two sets below are both independent and only one of them deserves to be
                    treated that way.
                </p>}
                ko={<p>
                    추상 선형대수에서 벡터 집합은 선형 독립이거나 아니거나 둘 중 하나다. 그 사이는 없다. 정의로는
                    깔끔하지만 공학에서는 쓸모가 없다. 아래 두 집합은 둘 다 독립인데, 독립으로 대접받을 자격이
                    있는 것은 하나뿐이기 때문이다.
                </p>}
            />
            <BlockMath math={"\\left\\{ v_1 = \\begin{bmatrix}1\\\\1\\end{bmatrix},\\; v_2 = \\begin{bmatrix}0.999\\\\1\\end{bmatrix} \\right\\} \\qquad \\det\\begin{bmatrix}1 & 0.999\\\\ 1 & 1\\end{bmatrix} = 0.001"}/>
            <Terms items={[
                ["v_1, v_2", <T en={<>linearly independent, since the determinant is not zero</>}
                               ko={<>행렬식이 0이 아니므로 선형 독립이다</>}/>],
                ["0.001", <T en={<>small, so one looks at these and says they are "almost" dependent, and treating them as dependent would be fine</>}
                            ko={<>작다. 그래서 이 둘을 보면 "거의" 종속이라 말하게 되고, 종속으로 쳐도 괜찮겠다 싶다</>}/>],
            ]}/>
            <T
                en={<p>
                    So far so good. Now try the same test on a pair that looks nothing like dependent:
                </p>}
                ko={<p>
                    여기까지는 괜찮다. 이번에는 종속과는 전혀 딴판으로 보이는 짝에 같은 판정을 해 보자.
                </p>}
            />
            <BlockMath math={"\\det\\begin{bmatrix}1 & 10^4\\\\ 0 & 1\\end{bmatrix} = 1, \\qquad \\det\\left(\\begin{bmatrix}1 & 10^4\\\\ 0 & 1\\end{bmatrix} + \\begin{bmatrix}0 & 0\\\\ 10^{-4} & 0\\end{bmatrix}\\right) = 0"}/>
            <Terms items={[
                ["\\det = 1", <T en={<>far from zero, so the determinant test calls this pair comfortably independent</>}
                                ko={<>0에서 멀다. 행렬식 판정은 이 짝을 편안하게 독립이라 부른다</>}/>],
                ["10^{-4}", <T en={<>the size of the perturbation added to one entry, smaller than any measurement noise you will ever have</>}
                              ko={<>성분 하나에 더한 섭동의 크기. 어떤 측정 잡음보다도 작다</>}/>],
                ["\\det = 0", <T en={<>after the perturbation, the pair is exactly dependent. The determinant said nothing useful about how close that was</>}
                                ko={<>섭동 후에는 정확히 종속이다. 그 거리에 대해 행렬식은 아무 쓸모 있는 말도 하지 않았다</>}/>],
            ]}/>
            <T
                en={<p>
                    A quantity that can be moved from 1 to 0 by a perturbation of{" "}
                    <InlineMath math={"10^{-4}"}/> is not measuring anything. What is needed is a number that
                    answers the real question: how far is this matrix from one that is genuinely rank
                    deficient? The singular values are that number, and they come from a factorization that,
                    unlike QR, asks nothing at all of the matrix.
                </p>}
                ko={<p>
                    <InlineMath math={"10^{-4}"}/>짜리 섭동으로 1에서 0까지 갈 수 있는 양은 아무것도 재고 있지
                    않다. 필요한 것은 진짜 질문에 답하는 수다. 이 행렬은 정말로 rank가 모자란 행렬에서 얼마나
                    떨어져 있는가? 특이값이 그 수이고, QR과 달리 행렬에 아무 조건도 걸지 않는 분해에서 나온다.
                </p>}
            />
            <Definition n="4.6" title={<T en={<>Rectangular diagonal matrix</>} ko={<>직사각 대각 행렬</>}/>}>
                <T
                    en={<p>
                        An <InlineMath math={"n \\times m"}/> matrix <InlineMath math={"\\Sigma"}/> is a{" "}
                        <strong>rectangular diagonal matrix</strong> if{" "}
                        <InlineMath math={"\\Sigma_{ij} = 0"}/> for <InlineMath math={"i \\ne j"}/>. Its{" "}
                        <strong>diagonal</strong> is the set of all{" "}
                        <InlineMath math={"\\Sigma_{ii}"}/> with{" "}
                        <InlineMath math={"1 \\le i \\le \\min(n, m)"}/>. Equivalently:
                    </p>}
                    ko={<p>
                        <InlineMath math={"n \\times m"}/> 행렬 <InlineMath math={"\\Sigma"}/>가{" "}
                        <InlineMath math={"i \\ne j"}/>에 대해 <InlineMath math={"\\Sigma_{ij} = 0"}/>이면{" "}
                        <strong>직사각 대각 행렬</strong>이라 한다.{" "}
                        <strong>대각</strong>은 <InlineMath math={"1 \\le i \\le \\min(n, m)"}/>인{" "}
                        <InlineMath math={"\\Sigma_{ii}"}/> 전체다. 동치인 서술은 다음과 같다.
                    </p>}
                />
                <BlockMath math={"\\text{(tall) } n > m:\\;\\; \\Sigma = \\begin{bmatrix} \\Sigma_d \\\\ 0 \\end{bmatrix}, \\qquad \\text{(wide) } n < m:\\;\\; \\Sigma = \\begin{bmatrix} \\Sigma_d & 0 \\end{bmatrix}"}/>
                <Terms items={[
                    ["\\Sigma_d", <T en={<>square diagonal: <InlineMath math={"m \\times m"}/> in the tall case, <InlineMath math={"n \\times n"}/> in the wide case</>}
                                    ko={<>정방 대각 행렬. 세로로 긴 경우에는 <InlineMath math={"m \\times m"}/>, 가로로 긴 경우에는 <InlineMath math={"n \\times n"}/>이다</>}/>],
                    ["0", <T en={<>a block of zeros that pads <InlineMath math={"\\Sigma_d"}/> out to the shape of <InlineMath math={"A"}/></>}
                             ko={<><InlineMath math={"\\Sigma_d"}/>를 <InlineMath math={"A"}/>의 모양까지 채우는 영 블록</>}/>],
                ]}/>
                <T
                    en={<p>
                        Concretely, with <InlineMath math={"n = 3"}/> and{" "}
                        <InlineMath math={"m = 2"}/> the diagonal is{" "}
                        <InlineMath math={"\\{4, 1\\}"}/> and the third row is padding:
                    </p>}
                    ko={<p>
                        구체적으로 <InlineMath math={"n = 3"}/>,{" "}
                        <InlineMath math={"m = 2"}/>이면 대각은 <InlineMath math={"\\{4, 1\\}"}/>이고 셋째
                        행은 채움이다.
                    </p>}
                />
                <BlockMath math={"\\Sigma = \\begin{bmatrix} 4 & 0 \\\\ 0 & 1 \\\\ 0 & 0 \\end{bmatrix}, \\qquad \\Sigma_d = \\begin{bmatrix} 4 & 0 \\\\ 0 & 1 \\end{bmatrix}"}/>
                <Terms items={[
                    ["\\Sigma", <T en={<><InlineMath math={"3 \\times 2"}/> and rectangular diagonal: every off-diagonal entry is zero</>}
                                  ko={<><InlineMath math={"3 \\times 2"}/>이고 직사각 대각이다. 대각이 아닌 성분은 전부 0이다</>}/>],
                    ["\\Sigma_d", <T en={<>the square part that carries the whole diagonal</>}
                                    ko={<>대각 전부를 담고 있는 정방 부분</>}/>],
                ]}/>
            </Definition>
            <Theorem n="4.7" title={<T en={<>Singular Value Decomposition</>} ko={<>특이값 분해</>}/>}>
                <T
                    en={<p>
                        Every <InlineMath math={"n \\times m"}/> real matrix{" "}
                        <InlineMath math={"A"}/> can be factored as
                    </p>}
                    ko={<p>
                        모든 실수 <InlineMath math={"n \\times m"}/> 행렬{" "}
                        <InlineMath math={"A"}/>는 다음과 같이 분해된다.
                    </p>}
                />
                <BlockMath math={"A = U \\cdot \\Sigma \\cdot V^\\top, \\qquad \\operatorname{diag}(\\Sigma) = [\\sigma_1, \\sigma_2, \\ldots, \\sigma_p]"}/>
                <Terms items={[
                    ["U", <T en={<><InlineMath math={"n \\times n"}/> orthogonal; its columns are eigenvectors of <InlineMath math={"AA^\\top"}/></>}
                             ko={<><InlineMath math={"n \\times n"}/> 직교 행렬. 열이 <InlineMath math={"AA^\\top"}/>의 고유벡터다</>}/>],
                    ["V", <T en={<><InlineMath math={"m \\times m"}/> orthogonal; its columns are eigenvectors of <InlineMath math={"A^\\top A"}/></>}
                             ko={<><InlineMath math={"m \\times m"}/> 직교 행렬. 열이 <InlineMath math={"A^\\top A"}/>의 고유벡터다</>}/>],
                    ["\\Sigma", <T en={<><InlineMath math={"n \\times m"}/> rectangular diagonal, in the sense of Definition 4.6</>}
                                   ko={<>Definition 4.6의 뜻으로 <InlineMath math={"n \\times m"}/> 직사각 대각 행렬</>}/>],
                    ["\\sigma_i", <T en={<>the <strong>singular values</strong>, ordered <InlineMath math={"\\sigma_1 \\ge \\sigma_2 \\ge \\cdots \\ge \\sigma_p \\ge 0"}/> with <InlineMath math={"p := \\min(n, m)"}/></>}
                                    ko={<><strong>특이값</strong>. <InlineMath math={"p := \\min(n, m)"}/>에 대해 <InlineMath math={"\\sigma_1 \\ge \\sigma_2 \\ge \\cdots \\ge \\sigma_p \\ge 0"}/> 순으로 놓는다</>}/>],
                    ["\\sigma_i^2", <T en={<>the eigenvalues shared by <InlineMath math={"A^\\top A"}/> and <InlineMath math={"AA^\\top"}/>, both of which are symmetric positive semidefinite</>}
                                      ko={<><InlineMath math={"A^\\top A"}/>와 <InlineMath math={"AA^\\top"}/>이 공유하는 고윳값. 둘 다 대칭이고 positive semidefinite다</>}/>],
                ]}/>
                <T
                    en={<p>
                        There is no hypothesis. Not square, not full rank, not invertible: every real matrix
                        has one. That alone separates the SVD from everything else in this chapter.
                    </p>}
                    ko={<p>
                        가정이 없다. 정방일 필요도, full rank일 필요도, 가역일 필요도 없다. 실수 행렬이면
                        무엇이든 하나씩 가진다. 이 사실 하나만으로도 SVD는 이 장의 다른 것들과 갈린다.
                    </p>}
                />
                <Proof>
                    <T
                        en={<p>
                            <strong>Start from a symmetric matrix.</strong>{" "}
                            <InlineMath math={"A^\\top A"}/> is <InlineMath math={"m \\times m"}/>, real and
                            symmetric, so Chapter 3 supplies an orthonormal set of eigenvectors{" "}
                            <InlineMath math={"\\{v^1, \\ldots, v^m\\}"}/> with real eigenvalues. It is also
                            positive semidefinite, since{" "}
                            <InlineMath math={"x^\\top A^\\top Ax = \\|Ax\\|^2 \\ge 0"}/>, so no eigenvalue is
                            negative. Order them <InlineMath math={"\\lambda_1 \\ge \\cdots \\ge \\lambda_m \\ge 0"}/>,
                            relabelling the <InlineMath math={"v^i"}/> to match.
                        </p>}
                        ko={<p>
                            <strong>대칭 행렬에서 출발한다.</strong>{" "}
                            <InlineMath math={"A^\\top A"}/>는 <InlineMath math={"m \\times m"}/> 실수 대칭
                            행렬이므로, 3장이 실수 고윳값을 갖는 orthonormal 고유벡터 집합{" "}
                            <InlineMath math={"\\{v^1, \\ldots, v^m\\}"}/>을 준다.{" "}
                            <InlineMath math={"x^\\top A^\\top Ax = \\|Ax\\|^2 \\ge 0"}/>이므로 positive
                            semidefinite이기도 하고, 따라서 음의 고윳값은 없다.{" "}
                            <InlineMath math={"\\lambda_1 \\ge \\cdots \\ge \\lambda_m \\ge 0"}/> 순으로
                            놓고 <InlineMath math={"v^i"}/>의 이름도 그에 맞춘다.
                        </p>}
                    />
                    <BlockMath math={"A^\\top A v^j = \\lambda_j v^j, \\qquad \\sigma_j := \\sqrt{\\lambda_j}, \\qquad q^j := \\tfrac{1}{\\sigma_j}Av^j \\in \\mathbb{R}^n \\;\\; (1 \\le j \\le r)"}/>
                    <Terms items={[
                        ["r", <T en={<>the number of strictly positive <InlineMath math={"\\lambda_j"}/>, which will turn out to be the rank of <InlineMath math={"A"}/></>}
                                 ko={<><InlineMath math={"\\lambda_j"}/>가 양수인 개수. 결국 <InlineMath math={"A"}/>의 rank로 드러난다</>}/>],
                        ["\\sigma_j", <T en={<>the square root exists because <InlineMath math={"\\lambda_j \\ge 0"}/>, and it is what makes <InlineMath math={"q^j"}/> a unit vector</>}
                                        ko={<><InlineMath math={"\\lambda_j \\ge 0"}/>이라 제곱근이 존재하고, 이것이 <InlineMath math={"q^j"}/>를 단위 벡터로 만든다</>}/>],
                        ["q^j", <T en={<>defined only for <InlineMath math={"j \\le r"}/>, since dividing by <InlineMath math={"\\sigma_j = 0"}/> is not allowed</>}
                                  ko={<><InlineMath math={"j \\le r"}/>에서만 정의된다. <InlineMath math={"\\sigma_j = 0"}/>으로는 나눌 수 없다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>Claim 4.9: the <InlineMath math={"q^j"}/> are orthonormal.</strong>{" "}
                            For <InlineMath math={"1 \\le i, j \\le r"}/>,
                        </p>}
                        ko={<p>
                            <strong>Claim 4.9: <InlineMath math={"q^j"}/>들은 orthonormal이다.</strong>{" "}
                            <InlineMath math={"1 \\le i, j \\le r"}/>에 대해
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} (q^i)^\\top q^j &= \\tfrac{1}{\\sigma_i}\\tfrac{1}{\\sigma_j}(v^i)^\\top A^\\top A v^j = \\tfrac{\\lambda_j}{\\sigma_i \\sigma_j}(v^i)^\\top v^j \\\\ &= \\begin{cases} \\lambda_i/\\sigma_i^2 = 1 & i = j \\\\ 0 & i \\ne j \\end{cases} \\end{aligned}"}/>
                    <Terms items={[
                        ["(v^i)^\\top v^j", <T en={<>one when <InlineMath math={"i = j"}/> and zero otherwise, because the <InlineMath math={"v^i"}/> were chosen orthonormal</>}
                                              ko={<><InlineMath math={"i = j"}/>일 때 1, 아니면 0이다. <InlineMath math={"v^i"}/>를 orthonormal로 잡았기 때문이다</>}/>],
                        ["\\lambda_i/\\sigma_i^2", <T en={<>equal to one by the definition <InlineMath math={"\\sigma_i = \\sqrt{\\lambda_i}"}/>: the normalization was chosen exactly to make this happen</>}
                                                     ko={<><InlineMath math={"\\sigma_i = \\sqrt{\\lambda_i}"}/>라는 정의로 1이다. 정규화를 그렇게 되도록 골랐다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>Claim 4.10: the <InlineMath math={"q^j"}/> are eigenvectors of{" "}
                                <InlineMath math={"AA^\\top"}/>.</strong> For{" "}
                            <InlineMath math={"1 \\le i \\le r"}/>,
                        </p>}
                        ko={<p>
                            <strong>Claim 4.10: <InlineMath math={"q^j"}/>는{" "}
                                <InlineMath math={"AA^\\top"}/>의 고유벡터다.</strong>{" "}
                            <InlineMath math={"1 \\le i \\le r"}/>에 대해
                        </p>}
                    />
                    <BlockMath math={"AA^\\top q^i = \\tfrac{1}{\\sigma_i}A\\left(A^\\top A\\right)v^i = \\tfrac{\\lambda_i}{\\sigma_i}Av^i = \\lambda_i q^i"}/>
                    <Terms items={[
                        ["\\left(A^\\top A\\right)v^i", <T en={<>replaced by <InlineMath math={"\\lambda_i v^i"}/>, the only step in the chain</>}
                                                          ko={<><InlineMath math={"\\lambda_i v^i"}/>으로 바꾼다. 이 사슬에서 유일한 단계다</>}/>],
                        ["\\lambda_i q^i", <T en={<>so <InlineMath math={"q^i"}/> is an eigenvector of <InlineMath math={"AA^\\top"}/> with the same eigenvalue <InlineMath math={"\\lambda_i"}/></>}
                                             ko={<>따라서 <InlineMath math={"q^i"}/>는 같은 고윳값 <InlineMath math={"\\lambda_i"}/>를 갖는 <InlineMath math={"AA^\\top"}/>의 고유벡터다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            <strong>Fill out the bases and check.</strong> If{" "}
                            <InlineMath math={"r < n"}/>, the remaining eigenvalues of{" "}
                            <InlineMath math={"AA^\\top"}/> are zero, and the{" "}
                            <InlineMath math={"q^i"}/> extend to an orthonormal basis of{" "}
                            <InlineMath math={"\\mathbb{R}^n"}/> with{" "}
                            <InlineMath math={"AA^\\top q^i = 0"}/> for{" "}
                            <InlineMath math={"r + 1 \\le i \\le n"}/>. Define
                        </p>}
                        ko={<p>
                            <strong>기저를 채우고 확인한다.</strong>{" "}
                            <InlineMath math={"r < n"}/>이면 <InlineMath math={"AA^\\top"}/>의 남은 고윳값은
                            전부 0이고, <InlineMath math={"q^i"}/>는{" "}
                            <InlineMath math={"r + 1 \\le i \\le n"}/>에 대해{" "}
                            <InlineMath math={"AA^\\top q^i = 0"}/>을 만족하도록{" "}
                            <InlineMath math={"\\mathbb{R}^n"}/>의 orthonormal 기저로 확장된다. 이제
                        </p>}
                    />
                    <BlockMath math={"U := \\begin{bmatrix} q^1 & \\cdots & q^n\\end{bmatrix}, \\quad V := \\begin{bmatrix} v^1 & \\cdots & v^m\\end{bmatrix}, \\quad \\Sigma_{ij} := \\begin{cases} \\sigma_i \\delta_{ij} & i, j \\le r \\\\ 0 & \\text{otherwise} \\end{cases}"}/>
                    <Terms items={[
                        ["\\delta_{ij}", <T en={<>the Kronecker delta, one when <InlineMath math={"i = j"}/> and zero otherwise</>}
                                           ko={<>Kronecker 델타. <InlineMath math={"i = j"}/>이면 1, 아니면 0이다</>}/>],
                        ["\\operatorname{diag}(\\Sigma)", <T en={<>equal to <InlineMath math={"[\\sigma_1, \\ldots, \\sigma_r, 0, \\ldots, 0]"}/>, so the rank shows up as the count of non-zero entries</>}
                                                           ko={<><InlineMath math={"[\\sigma_1, \\ldots, \\sigma_r, 0, \\ldots, 0]"}/>이다. rank가 0이 아닌 성분의 개수로 나타난다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Since <InlineMath math={"U"}/> and <InlineMath math={"V"}/> are orthogonal,{" "}
                            <InlineMath math={"A = U\\Sigma V^\\top"}/> is equivalent to{" "}
                            <InlineMath math={"U^\\top A V = \\Sigma"}/>, so it is enough to check the entries
                            of the latter. Three cases, and all of them are short.
                        </p>}
                        ko={<p>
                            <InlineMath math={"U"}/>와 <InlineMath math={"V"}/>가 직교 행렬이므로{" "}
                            <InlineMath math={"A = U\\Sigma V^\\top"}/>은{" "}
                            <InlineMath math={"U^\\top A V = \\Sigma"}/>와 동치다. 따라서 뒤쪽의 성분만
                            확인하면 된다. 경우는 셋이고 전부 짧다.
                        </p>}
                    />
                    <T
                        en={<ul>
                            <li><strong><InlineMath math={"j > r"}/>.</strong> Then{" "}
                                <InlineMath math={"\\lambda_j = 0"}/>, so{" "}
                                <InlineMath math={"\\|Av^j\\|^2 = (v^j)^\\top A^\\top A v^j = 0"}/> and{" "}
                                <InlineMath math={"Av^j = 0"}/>. The whole column is zero, as required.</li>
                            <li><strong><InlineMath math={"i > r"}/>.</strong> Then{" "}
                                <InlineMath math={"q^i"}/> was chosen orthogonal to{" "}
                                <InlineMath math={"\\{q^1, \\ldots, q^r\\} = \\{\\tfrac{1}{\\sigma_1}Av^1, \\ldots, \\tfrac{1}{\\sigma_r}Av^r\\}"}/>,
                                so <InlineMath math={"(q^i)^\\top Av^j = 0"}/>.</li>
                            <li><strong><InlineMath math={"i, j \\le r"}/>.</strong> Compute directly.</li>
                        </ul>}
                        ko={<ul>
                            <li><strong><InlineMath math={"j > r"}/>.</strong> 이때{" "}
                                <InlineMath math={"\\lambda_j = 0"}/>이므로{" "}
                                <InlineMath math={"\\|Av^j\\|^2 = (v^j)^\\top A^\\top A v^j = 0"}/>이고{" "}
                                <InlineMath math={"Av^j = 0"}/>이다. 열 전체가 0이 되어 요구와 맞는다.</li>
                            <li><strong><InlineMath math={"i > r"}/>.</strong> 이때{" "}
                                <InlineMath math={"q^i"}/>는{" "}
                                <InlineMath math={"\\{q^1, \\ldots, q^r\\} = \\{\\tfrac{1}{\\sigma_1}Av^1, \\ldots, \\tfrac{1}{\\sigma_r}Av^r\\}"}/>에
                                직교하도록 골랐으므로 <InlineMath math={"(q^i)^\\top Av^j = 0"}/>이다.</li>
                            <li><strong><InlineMath math={"i, j \\le r"}/>.</strong> 직접 계산한다.</li>
                        </ul>}
                    />
                    <BlockMath math={"\\left(U^\\top A V\\right)_{ij} = (q^i)^\\top Av^j = \\tfrac{1}{\\sigma_i}(v^i)^\\top A^\\top Av^j = \\tfrac{\\lambda_j}{\\sigma_i}(v^i)^\\top v^j = \\sigma_i \\delta_{ij}"}/>
                    <Terms items={[
                        ["\\tfrac{\\lambda_j}{\\sigma_i}\\delta_{ij}", <T en={<>non-zero only when <InlineMath math={"i = j"}/>, and then it is <InlineMath math={"\\lambda_i/\\sigma_i = \\sigma_i"}/></>}
                                                                        ko={<><InlineMath math={"i = j"}/>일 때만 0이 아니고, 그때 값은 <InlineMath math={"\\lambda_i/\\sigma_i = \\sigma_i"}/>다</>}/>],
                        ["U^\\top AV = \\Sigma", <T en={<>all three cases match Definition 4.6, so the factorization holds</>}
                                                   ko={<>세 경우 모두 Definition 4.6과 맞는다. 따라서 분해가 성립한다</>}/>],
                    ]}/>
                </Proof>
            </Theorem>

            <T
                en={<p>
                    The statement is three matrices, but the content is one sentence: every linear map is a
                    rotation, then a stretch along axes, then another rotation. Nothing else can happen. Step
                    the figure through the three factors and the sentence stops being a slogan.
                </p>}
                ko={<p>
                    진술은 행렬 셋이지만 내용은 한 문장이다. 모든 선형 사상은 회전, 축 방향으로의 늘임, 그리고
                    다시 회전이다. 그 밖의 일은 일어나지 않는다. 그림을 세 인자에 걸쳐 한 걸음씩 넘겨 보면 이
                    문장이 구호이기를 그만둔다.
                </p>}
            />
            <CanvasFigure label={t("The unit circle through the three factors, one at a time",
                "단위원이 세 인자를 하나씩 차례로 지나간다")}
                          modal={<SvdGeometry width={800} height={480}/>}
                          bodyClassName="w-[min(94vw,840px)]">
                <SvdGeometry/>
            </CanvasFigure>
            <T
                en={<p>
                    Two things are worth watching for. The <strong>pure rotation</strong> preset has{" "}
                    <InlineMath math={"\\sigma_1 = \\sigma_2 = 1"}/> and the ellipse never appears, because
                    an orthogonal matrix has nothing to stretch. The <strong>singular</strong> preset has{" "}
                    <InlineMath math={"\\sigma_2 = 0"}/>, and the circle collapses onto a segment: the whole
                    plane is mapped into a line, which is what rank one looks like.
                </p>}
                ko={<p>
                    눈여겨볼 것이 둘이다. <strong>회전만</strong> 프리셋은{" "}
                    <InlineMath math={"\\sigma_1 = \\sigma_2 = 1"}/>이라 타원이 아예 나타나지 않는다. 직교
                    행렬에는 늘일 것이 없기 때문이다. <strong>특이 행렬</strong> 프리셋은{" "}
                    <InlineMath math={"\\sigma_2 = 0"}/>이라 원이 선분으로 주저앉는다. 평면 전체가 하나의
                    직선으로 옮겨지고, rank 1이란 그런 모습이다.
                </p>}
            />
            <Remark n="4.11" title={<T en={<>The SVD as a sum of rank-one matrices</>} ko={<>rank 1 행렬의 합으로 본 SVD</>}/>}>
                <T
                    en={<p>
                        Multiplying out <InlineMath math={"U\\Sigma V^\\top"}/> column by column gives a
                        second reading of the same factorization, and it is the one the rest of this chapter
                        uses:
                    </p>}
                    ko={<p>
                        <InlineMath math={"U\\Sigma V^\\top"}/>을 열 단위로 곱해 풀면 같은 분해를 다르게 읽는
                        방법이 나온다. 이 장의 나머지가 쓰는 것이 이쪽이다.
                    </p>}
                />
                <BlockMath math={"A = \\sum_{i=1}^{p} \\sigma_i\\, u_i v_i^\\top = \\sigma_1 u_1 v_1^\\top + \\sigma_2 u_2 v_2^\\top + \\cdots + \\sigma_p u_p v_p^\\top"}/>
                <Terms items={[
                    ["u_i, v_i", <T en={<>the <InlineMath math={"i"}/>-th columns of <InlineMath math={"U"}/> and <InlineMath math={"V"}/>, remembering that the columns of <InlineMath math={"V"}/> are the rows of <InlineMath math={"V^\\top"}/></>}
                                   ko={<><InlineMath math={"U"}/>와 <InlineMath math={"V"}/>의 <InlineMath math={"i"}/>번째 열. <InlineMath math={"V"}/>의 열이 <InlineMath math={"V^\\top"}/>의 행이라는 점을 기억하면 된다</>}/>],
                    ["u_i v_i^\\top", <T en={<>an outer product: an <InlineMath math={"n \\times m"}/> matrix of rank exactly one, and nullity <InlineMath math={"m - 1"}/></>}
                                        ko={<>외적. rank가 정확히 1이고 nullity가 <InlineMath math={"m - 1"}/>인 <InlineMath math={"n \\times m"}/> 행렬이다</>}/>],
                    ["\\sigma_i", <T en={<>the weight on the <InlineMath math={"i"}/>-th rank-one piece, and the ordering means the pieces arrive from most important to least</>}
                                    ko={<><InlineMath math={"i"}/>번째 rank 1 조각의 가중치. 순서를 매겨 두었으므로 중요한 것부터 차례로 나온다</>}/>],
                ]}/>
                <T
                    en={<p>
                        To see why <InlineMath math={"u_i v_i^\\top"}/> has rank one, apply it to a basis
                        vector. Since <InlineMath math={"v_i^\\top v_j"}/> is one when{" "}
                        <InlineMath math={"i = j"}/> and zero otherwise,
                    </p>}
                    ko={<p>
                        <InlineMath math={"u_i v_i^\\top"}/>의 rank가 1인 이유는 기저 벡터에 적용해 보면
                        보인다. <InlineMath math={"v_i^\\top v_j"}/>는 <InlineMath math={"i = j"}/>일 때 1,
                        아니면 0이므로
                    </p>}
                />
                <BlockMath math={"\\left(u_i v_i^\\top\\right) v_j = u_i \\left(v_i^\\top v_j\\right) = \\begin{cases} u_i & j = i \\\\ 0 & j \\ne i\\end{cases}"}/>
                <Terms items={[
                    ["v_j", <T en={<>ranges over an orthonormal basis of <InlineMath math={"\\mathbb{R}^m"}/>, so this determines the map completely</>}
                              ko={<><InlineMath math={"\\mathbb{R}^m"}/>의 orthonormal 기저를 훑는다. 그래서 이것으로 사상이 완전히 정해진다</>}/>],
                    ["u_i", <T en={<>the single direction the whole image lives in, so the range is a line and the rank is one</>}
                              ko={<>상 전체가 놓이는 단 하나의 방향. 그래서 range가 직선이고 rank가 1이다</>}/>],
                ]}/>
            </Remark>
            <Example title={<T en={<>An SVD you can do by hand</>} ko={<>손으로 하는 SVD</>}/>}>
                <T
                    en={<p>
                        Take <InlineMath math={"A = \\begin{bmatrix}3 & 0\\\\ 4 & 5\\end{bmatrix}"}/> and
                        follow the proof. First form the symmetric matrix the proof starts from:
                    </p>}
                    ko={<p>
                        <InlineMath math={"A = \\begin{bmatrix}3 & 0\\\\ 4 & 5\\end{bmatrix}"}/>을 잡고 증명을
                        그대로 따라간다. 먼저 증명이 출발점으로 삼는 대칭 행렬을 만든다.
                    </p>}
                />
                <BlockMath math={"A^\\top A = \\begin{bmatrix}25 & 20\\\\ 20 & 25\\end{bmatrix}, \\qquad \\lambda_1 = 45, \\quad \\lambda_2 = 5"}/>
                <Terms items={[
                    ["A^\\top A", <T en={<>symmetric with trace <InlineMath math={"50"}/> and determinant <InlineMath math={"225"}/>, so the eigenvalues solve <InlineMath math={"\\lambda^2 - 50\\lambda + 225 = 0"}/></>}
                                    ko={<>대칭이고 대각합이 <InlineMath math={"50"}/>, 행렬식이 <InlineMath math={"225"}/>다. 고윳값은 <InlineMath math={"\\lambda^2 - 50\\lambda + 225 = 0"}/>을 푼다</>}/>],
                    ["\\lambda_1, \\lambda_2", <T en={<>both positive, so <InlineMath math={"r = 2"}/> and the matrix has full rank</>}
                                                 ko={<>둘 다 양수이므로 <InlineMath math={"r = 2"}/>이고 이 행렬은 full rank다</>}/>],
                ]}/>
                <T
                    en={<p>
                        A matrix of the form{" "}
                        <InlineMath math={"\\begin{bmatrix}a & b\\\\ b & a\\end{bmatrix}"}/> always has{" "}
                        <InlineMath math={"(1,1)^\\top"}/> and <InlineMath math={"(1,-1)^\\top"}/> as
                        eigenvectors, with eigenvalues <InlineMath math={"a + b"}/> and{" "}
                        <InlineMath math={"a - b"}/>. Normalize them, take square roots for{" "}
                        <InlineMath math={"\\sigma"}/>, and get each <InlineMath math={"u"}/> from{" "}
                        <InlineMath math={"u_i = Av_i/\\sigma_i"}/>:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\begin{bmatrix}a & b\\\\ b & a\\end{bmatrix}"}/> 꼴의 행렬은 늘{" "}
                        <InlineMath math={"(1,1)^\\top"}/>과 <InlineMath math={"(1,-1)^\\top"}/>을 고유벡터로
                        갖고 고윳값은 <InlineMath math={"a + b"}/>와 <InlineMath math={"a - b"}/>다. 그것을
                        정규화하고 <InlineMath math={"\\sigma"}/>는 제곱근을 취하며, 각{" "}
                        <InlineMath math={"u"}/>는 <InlineMath math={"u_i = Av_i/\\sigma_i"}/>로 얻는다.
                    </p>}
                />
                <BlockMath math={"U = \\tfrac{1}{\\sqrt{10}}\\begin{bmatrix}1 & 3\\\\ 3 & -1\\end{bmatrix}, \\quad \\Sigma = \\begin{bmatrix}3\\sqrt{5} & 0\\\\ 0 & \\sqrt{5}\\end{bmatrix}, \\quad V = \\tfrac{1}{\\sqrt{2}}\\begin{bmatrix}1 & 1\\\\ 1 & -1\\end{bmatrix}"}/>
                <Terms items={[
                    ["V", <T en={<>the normalized eigenvectors of <InlineMath math={"A^\\top A"}/>, the input directions the map treats specially</>}
                             ko={<><InlineMath math={"A^\\top A"}/>의 정규화된 고유벡터. 사상이 특별하게 다루는 입력 방향이다</>}/>],
                    ["\\Sigma", <T en={<><InlineMath math={"\\sigma_1 = \\sqrt{45} = 3\\sqrt{5} \\approx 6.708"}/> and <InlineMath math={"\\sigma_2 = \\sqrt{5} \\approx 2.236"}/></>}
                                   ko={<><InlineMath math={"\\sigma_1 = \\sqrt{45} = 3\\sqrt{5} \\approx 6.708"}/>이고 <InlineMath math={"\\sigma_2 = \\sqrt{5} \\approx 2.236"}/>이다</>}/>],
                    ["U", <T en={<>columns <InlineMath math={"Av_1/\\sigma_1 = (1,3)^\\top/\\sqrt{10}"}/> and <InlineMath math={"Av_2/\\sigma_2 = (3,-1)^\\top/\\sqrt{10}"}/>, orthogonal as Claim 4.9 promised</>}
                             ko={<>열이 <InlineMath math={"Av_1/\\sigma_1 = (1,3)^\\top/\\sqrt{10}"}/>과 <InlineMath math={"Av_2/\\sigma_2 = (3,-1)^\\top/\\sqrt{10}"}/>이다. Claim 4.9가 약속한 대로 직교한다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Two checks that cost nothing. The product{" "}
                        <InlineMath math={"\\sigma_1 \\sigma_2 = 3\\sqrt{5}\\cdot\\sqrt{5} = 15"}/> equals{" "}
                        <InlineMath math={"|\\det A| = |15 - 0|"}/>, which is always true because{" "}
                        <InlineMath math={"U"}/> and <InlineMath math={"V"}/> have determinant{" "}
                        <InlineMath math={"\\pm 1"}/>. And the condition number is{" "}
                        <InlineMath math={"\\sigma_1/\\sigma_2 = 3"}/>, so this matrix is thoroughly
                        well behaved. Load it as the <strong>worked example</strong> preset in the figure
                        above and the ellipse has semi-axes <InlineMath math={"6.708"}/> and{" "}
                        <InlineMath math={"2.236"}/>.
                    </p>}
                    ko={<p>
                        공짜로 할 수 있는 검산이 둘이다.{" "}
                        <InlineMath math={"\\sigma_1 \\sigma_2 = 3\\sqrt{5}\\cdot\\sqrt{5} = 15"}/>는{" "}
                        <InlineMath math={"|\\det A| = |15 - 0|"}/>과 같다.{" "}
                        <InlineMath math={"U"}/>와 <InlineMath math={"V"}/>의 행렬식이{" "}
                        <InlineMath math={"\\pm 1"}/>이라 늘 성립한다. 그리고 조건수는{" "}
                        <InlineMath math={"\\sigma_1/\\sigma_2 = 3"}/>이므로 이 행렬은 아주 얌전하다. 위
                        그림에서 <strong>본문 예제</strong> 프리셋을 눌러 보면 타원의 반축이{" "}
                        <InlineMath math={"6.708"}/>과 <InlineMath math={"2.236"}/>이다.
                    </p>}
                />
                <T
                    en={<p>
                        Finally, the rank-one truncation from Remark 4.11. Keeping only the first term gives
                    </p>}
                    ko={<p>
                        마지막으로 Remark 4.11의 rank 1 절단이다. 첫 항만 남기면
                    </p>}
                />
                <BlockMath math={"A_1 = \\sigma_1 u_1 v_1^\\top = \\begin{bmatrix}1.5 & 1.5\\\\ 4.5 & 4.5\\end{bmatrix}, \\qquad A - A_1 = \\begin{bmatrix}1.5 & -1.5\\\\ -0.5 & 0.5\\end{bmatrix}"}/>
                <Terms items={[
                    ["A_1", <T en={<>rank one: both columns are multiples of <InlineMath math={"(1, 3)^\\top"}/></>}
                              ko={<>rank 1이다. 두 열이 모두 <InlineMath math={"(1, 3)^\\top"}/>의 배수다</>}/>],
                    ["A - A_1", <T en={<>equal to <InlineMath math={"\\sigma_2 u_2 v_2^\\top"}/>, whose induced norm is exactly <InlineMath math={"\\sigma_2 = \\sqrt{5}"}/>; the next section makes that a theorem</>}
                                  ko={<><InlineMath math={"\\sigma_2 u_2 v_2^\\top"}/>과 같고, 유도 norm이 정확히 <InlineMath math={"\\sigma_2 = \\sqrt{5}"}/>다. 다음 절이 이것을 정리로 만든다</>}/>],
                ]}/>
            </Example>
            <Example n="4.12" title={<T en={<>The matrix that fooled the determinant</>} ko={<>행렬식을 속인 그 행렬</>}/>}>
                <T
                    en={<p>
                        Return to <InlineMath math={"A = \\begin{bmatrix}1 & 10^4\\\\ 0 & 1\\end{bmatrix}"}/>,
                        the one with determinant 1 that a perturbation of{" "}
                        <InlineMath math={"10^{-4}"}/> made singular. Its singular values are
                    </p>}
                    ko={<p>
                        <InlineMath math={"A = \\begin{bmatrix}1 & 10^4\\\\ 0 & 1\\end{bmatrix}"}/>으로
                        돌아가자. 행렬식이 1인데 <InlineMath math={"10^{-4}"}/>짜리 섭동으로 특이 행렬이 된
                        그 행렬이다. 특이값은 다음과 같다.
                    </p>}
                />
                <BlockMath math={"\\sigma_1 \\approx 10^4, \\qquad \\sigma_2 \\approx 10^{-4}, \\qquad \\frac{\\sigma_1}{\\sigma_2} \\approx 10^8"}/>
                <Terms items={[
                    ["\\sigma_2 \\approx 10^{-4}", <T en={<>the distance from <InlineMath math={"A"}/> to the nearest singular matrix, which is exactly the perturbation size that broke it</>}
                                                     ko={<><InlineMath math={"A"}/>에서 가장 가까운 특이 행렬까지의 거리. 이 행렬을 무너뜨린 섭동의 크기와 정확히 같다</>}/>],
                    ["10^8", <T en={<>the condition number, an eight-order-of-magnitude warning that the determinant simply did not give</>}
                               ko={<>조건수. 행렬식이 전혀 주지 않았던 여덟 자릿수짜리 경고다</>}/>],
                ]}/>
                <T
                    en={<p>
                        There are two non-zero singular values, so <InlineMath math={"r = 2"}/>,{" "}
                        <InlineMath math={"\\operatorname{rank}(A) = 2"}/> and{" "}
                        <InlineMath math={"\\operatorname{nullity}(A) = 0"}/>. Numerically, though, one would
                        say <InlineMath math={"r = 1"}/>, and hence{" "}
                        <InlineMath math={"\\operatorname{rank}(A) = 1"}/> and{" "}
                        <InlineMath math={"\\operatorname{nullity}(A) = 2 - 1 = 1"}/>. Both answers are
                        defensible, and choosing between them is the subject of the next section.
                    </p>}
                    ko={<p>
                        0이 아닌 특이값이 둘이므로 <InlineMath math={"r = 2"}/>이고{" "}
                        <InlineMath math={"\\operatorname{rank}(A) = 2"}/>,{" "}
                        <InlineMath math={"\\operatorname{nullity}(A) = 0"}/>이다. 그런데 수치적으로는{" "}
                        <InlineMath math={"r = 1"}/>이라 말하게 되고, 따라서{" "}
                        <InlineMath math={"\\operatorname{rank}(A) = 1"}/>,{" "}
                        <InlineMath math={"\\operatorname{nullity}(A) = 2 - 1 = 1"}/>이 된다. 두 답 모두
                        변호할 수 있고, 그 사이에서 고르는 일이 다음 절의 주제다.
                    </p>}
                />
            </Example>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Numerical Linear Independence</h2>} ko={<h2>수치적 선형 독립</h2>}/>
            <T
                en={<p>
                    In the notes this is a subsection of the SVD material, and it is the reason the SVD is in
                    the course at all. The question it answers is the one the determinant could not:{" "}
                    <strong>suppose <InlineMath math={"\\operatorname{rank}(A) = r"}/>. How far away is{" "}
                        <InlineMath math={"A"}/> from a matrix of rank strictly less than{" "}
                        <InlineMath math={"r"}/>?</strong>
                </p>}
                ko={<p>
                    원 교재에서 이 내용은 SVD 절 안의 소절이고, 애초에 SVD가 이 과목에 들어온 이유다. 여기서
                    답하는 질문이 행렬식이 답하지 못한 그 질문이다.{" "}
                    <strong><InlineMath math={"\\operatorname{rank}(A) = r"}/>이라 하자.{" "}
                        <InlineMath math={"A"}/>는 rank가 <InlineMath math={"r"}/>보다 작은 행렬에서 얼마나
                        떨어져 있는가?</strong>
                </p>}
            />
            <T
                en={<p>
                    The notes open with a <InlineMath math={"5 \\times 5"}/> matrix of unremarkable-looking
                    numbers, all of them around the size of 30, and ask Julia for its singular values. The
                    matrix is the <strong>the notes' matrix</strong> preset in the figure below, and its
                    spectrum is
                </p>}
                ko={<p>
                    교재는 별스러울 것 없어 보이는 수들, 전부 30 언저리인 수들로 채운{" "}
                    <InlineMath math={"5 \\times 5"}/> 행렬을 하나 놓고 Julia에 특이값을 물어보는 것으로
                    시작한다. 그 행렬이 아래 그림의 <strong>교재의 행렬</strong> 프리셋이고, 스펙트럼은
                    다음과 같다.
                </p>}
            />
            <table className="table-center">
                <thead>
                <tr>
                    <th><InlineMath math={"i"}/></th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                    <th>5</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><InlineMath math={"\\sigma_i"}/></td>
                    <td>132.5</td>
                    <td>37.71</td>
                    <td>33.42</td>
                    <td>19.34</td>
                    <td>0.7916</td>
                </tr>
                <tr>
                    <td><InlineMath math={"\\sigma_i/\\sigma_1"}/></td>
                    <td>1</td>
                    <td>0.285</td>
                    <td>0.252</td>
                    <td>0.146</td>
                    <td>0.006</td>
                </tr>
                </tbody>
            </table>
            <T
                en={<p>
                    Because the smallest singular value{" "}
                    <InlineMath math={"\\sigma_5 = 0.7916"}/> is less than 1% of the largest,{" "}
                    <InlineMath math={"\\sigma_1 = 132.5"}/>, in many cases one would say that the numerical
                    rank of this matrix is 4 rather than 5. Note the shape of that sentence. It contains "in
                    many cases" and "one would say". There is no theorem here yet, only a threshold someone
                    has to pick.
                </p>}
                ko={<p>
                    가장 작은 특이값 <InlineMath math={"\\sigma_5 = 0.7916"}/>이 가장 큰{" "}
                    <InlineMath math={"\\sigma_1 = 132.5"}/>의 1%에도 못 미치므로, 많은 경우 이 행렬의 수치적
                    rank는 5가 아니라 4라고 말하게 된다. 이 문장의 모양을 보라. "많은 경우"와 "말하게 된다"가
                    들어 있다. 아직 정리는 없고, 누군가 골라야 하는 문턱만 있다.
                </p>}
            />
            <CanvasFigure label={t("Singular values, and the threshold that decides the rank",
                "특이값과 rank를 정하는 문턱")}
                          modal={<SingularValueSpectrum width={820} height={400}/>}
                          bodyClassName="w-[min(94vw,860px)]">
                <SingularValueSpectrum/>
            </CanvasFigure>
            <T
                en={<p>
                    Now make it a theorem. To say "how far" you need a way to measure the size of a matrix, so
                    far only vectors have had norms.
                </p>}
                ko={<p>
                    이제 이것을 정리로 만든다. "얼마나 멀리"를 말하려면 행렬의 크기를 재는 방법이 있어야 하는데,
                    지금까지 norm을 가진 것은 벡터뿐이었다.
                </p>}
            />
            <Definition n="4.13" title={<T en={<>Induced matrix norm</>} ko={<>유도 행렬 norm</>}/>}>
                <T
                    en={<p>
                        Given a real <InlineMath math={"n \\times m"}/> matrix{" "}
                        <InlineMath math={"A"}/>, the <strong>matrix norm induced by the Euclidean vector
                        norm</strong> is
                    </p>}
                    ko={<p>
                        실수 <InlineMath math={"n \\times m"}/> 행렬 <InlineMath math={"A"}/>에 대해{" "}
                        <strong>유클리드 벡터 norm이 유도하는 행렬 norm</strong>은 다음과 같다.
                    </p>}
                />
                <BlockMath math={"\\|A\\| := \\max_{x^\\top x = 1} \\|Ax\\| = \\sqrt{\\lambda_{\\max}(A^\\top A)} = \\sigma_1"}/>
                <Terms items={[
                    ["\\max_{x^\\top x = 1}", <T en={<>over unit vectors only, so the norm measures the worst stretch the matrix can apply</>}
                                                ko={<>단위 벡터 위에서만 잰다. 그래서 이 norm은 행렬이 줄 수 있는 최악의 늘임을 잰다</>}/>],
                    ["\\lambda_{\\max}(A^\\top A)", <T en={<>real and non-negative because <InlineMath math={"A^\\top A"}/> is symmetric positive semidefinite, so the square root exists</>}
                                                      ko={<><InlineMath math={"A^\\top A"}/>가 대칭이고 positive semidefinite이라 실수이고 0 이상이다. 따라서 제곱근이 존재한다</>}/>],
                    ["\\sigma_1", <T en={<>the largest singular value: this is the same number the SVD figure showed as the longest semi-axis of the ellipse</>}
                                    ko={<>가장 큰 특이값. SVD 그림에서 타원의 가장 긴 반축으로 보였던 바로 그 수다</>}/>],
                ]}/>
            </Definition>
            <Theorem title={<T en={<>Numerical rank</>} ko={<>수치적 rank</>}/>}>
                <T
                    en={<p>
                        Suppose <InlineMath math={"\\operatorname{rank}(A) = r"}/>, so that{" "}
                        <InlineMath math={"\\sigma_r"}/> is the smallest non-zero singular value of{" "}
                        <InlineMath math={"A"}/>. Then:
                    </p>}
                    ko={<p>
                        <InlineMath math={"\\operatorname{rank}(A) = r"}/>이라 하자. 그러면{" "}
                        <InlineMath math={"\\sigma_r"}/>이 <InlineMath math={"A"}/>의 0이 아닌 특이값 중 가장
                        작은 것이다. 이때 다음이 성립한다.
                    </p>}
                />
                <T
                    en={<ol>
                        <li>If an <InlineMath math={"n \\times m"}/> matrix{" "}
                            <InlineMath math={"E"}/> satisfies{" "}
                            <InlineMath math={"\\|E\\| < \\sigma_r"}/>, then{" "}
                            <InlineMath math={"\\operatorname{rank}(A + E) \\ge r"}/>.</li>
                        <li>There exists an <InlineMath math={"n \\times m"}/> matrix{" "}
                            <InlineMath math={"E"}/> with <InlineMath math={"\\|E\\| = \\sigma_r"}/> and{" "}
                            <InlineMath math={"\\operatorname{rank}(A + E) < r"}/>.</li>
                        <li>In fact, for <InlineMath math={"E = -\\sigma_r u_r v_r^\\top"}/>,{" "}
                            <InlineMath math={"\\operatorname{rank}(A + E) = r - 1"}/>.</li>
                        <li>Moreover, for{" "}
                            <InlineMath math={"E = -\\sigma_r u_r v_r^\\top - \\sigma_{r-1}u_{r-1}v_{r-1}^\\top"}/>,{" "}
                            <InlineMath math={"\\operatorname{rank}(A + E) = r - 2"}/>.</li>
                    </ol>}
                    ko={<ol>
                        <li><InlineMath math={"n \\times m"}/> 행렬{" "}
                            <InlineMath math={"E"}/>가 <InlineMath math={"\\|E\\| < \\sigma_r"}/>를
                            만족하면 <InlineMath math={"\\operatorname{rank}(A + E) \\ge r"}/>이다.</li>
                        <li><InlineMath math={"\\|E\\| = \\sigma_r"}/>이면서{" "}
                            <InlineMath math={"\\operatorname{rank}(A + E) < r"}/>인{" "}
                            <InlineMath math={"n \\times m"}/> 행렬 <InlineMath math={"E"}/>가 존재한다.</li>
                        <li>실제로 <InlineMath math={"E = -\\sigma_r u_r v_r^\\top"}/>에 대해{" "}
                            <InlineMath math={"\\operatorname{rank}(A + E) = r - 1"}/>이다.</li>
                        <li>나아가{" "}
                            <InlineMath math={"E = -\\sigma_r u_r v_r^\\top - \\sigma_{r-1}u_{r-1}v_{r-1}^\\top"}/>에
                            대해 <InlineMath math={"\\operatorname{rank}(A + E) = r - 2"}/>이다.</li>
                    </ol>}
                />
                <Terms items={[
                    ["\\sigma_r", <T en={<>the exact distance, in the induced norm, from <InlineMath math={"A"}/> to the set of matrices of rank below <InlineMath math={"r"}/></>}
                                    ko={<>유도 norm으로 잰, <InlineMath math={"A"}/>에서 rank가 <InlineMath math={"r"}/> 미만인 행렬 집합까지의 정확한 거리</>}/>],
                    ["E = -\\sigma_r u_r v_r^\\top", <T en={<>the perturbation that achieves the distance: it deletes exactly one term from the expansion of Remark 4.11</>}
                                                       ko={<>그 거리를 실제로 달성하는 섭동. Remark 4.11의 전개에서 항 하나를 정확히 지운다</>}/>],
                ]}/>
            </Theorem>
            <Corollary>
                <T
                    en={<p>
                        Suppose <InlineMath math={"A"}/> is square and invertible. Then{" "}
                        <InlineMath math={"\\sigma_r"}/> measures the distance from{" "}
                        <InlineMath math={"A"}/> to the nearest singular matrix. This is the number the
                        determinant was supposed to be telling you and never was.
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>가 정방이고 가역이라 하자. 그러면{" "}
                        <InlineMath math={"\\sigma_r"}/>이 <InlineMath math={"A"}/>에서 가장 가까운 특이
                        행렬까지의 거리를 잰다. 행렬식이 알려 준다고 여겨졌지만 실은 한 번도 알려 준 적 없는
                        수가 이것이다.
                    </p>}
                />
            </Corollary>
            <Example title={<T en={<>Knocking the <InlineMath math={"5 \\times 5"}/> down a rank, on purpose</>}
                               ko={<><InlineMath math={"5 \\times 5"}/>의 rank를 일부러 하나 떨어뜨리기</>}/>}>
                <T
                    en={<p>
                        Item 3 is a recipe, so run it. Take the last singular triple of the{" "}
                        <InlineMath math={"5 \\times 5"}/> matrix and build{" "}
                        <InlineMath math={"E = -\\sigma_5 u_5 v_5^\\top"}/>. Its entries are all in the range{" "}
                        <InlineMath math={"\\pm 0.43"}/>, next to matrix entries of size 30, and its induced
                        norm is
                    </p>}
                    ko={<p>
                        3번은 조리법이므로 그대로 돌려 본다.{" "}
                        <InlineMath math={"5 \\times 5"}/> 행렬의 마지막 특이 삼중항을 가져다{" "}
                        <InlineMath math={"E = -\\sigma_5 u_5 v_5^\\top"}/>을 만든다. 성분은 전부{" "}
                        <InlineMath math={"\\pm 0.43"}/> 범위 안이고, 원 행렬의 성분이 30쯤이라는 것과
                        나란히 놓고 보면 작다. 유도 norm은
                    </p>}
                />
                <BlockMath math={"\\|E\\| = \\sigma_5 = 0.7916, \\qquad \\operatorname{diag}\\Sigma(A + E) = [132.5,\\; 37.71,\\; 33.42,\\; 19.34,\\; \\approx 10^{-15}]"}/>
                <Terms items={[
                    ["\\|E\\|", <T en={<>equal to <InlineMath math={"\\sigma_5"}/> because <InlineMath math={"u_5"}/> and <InlineMath math={"v_5"}/> are unit vectors, so <InlineMath math={"u_5 v_5^\\top"}/> has induced norm one</>}
                                  ko={<><InlineMath math={"u_5"}/>와 <InlineMath math={"v_5"}/>가 단위 벡터라 <InlineMath math={"u_5 v_5^\\top"}/>의 유도 norm이 1이고, 따라서 <InlineMath math={"\\sigma_5"}/>와 같다</>}/>],
                    ["\\approx 10^{-15}", <T en={<>zero up to rounding: the perturbed matrix has exact rank 4, one less than before</>}
                                            ko={<>반올림을 빼면 0이다. 섭동된 행렬의 정확한 rank는 4로, 하나 줄었다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The exact rank dropped from 5 to 4, and the price was a matrix of norm 0.7916. The
                        printed notes report this drop as "from 4 to 5", which is the two numbers the wrong way
                        round. Nothing else in the illustration changes. This is what item 3 buys you: the SVD
                        does not merely guess at near-singularity, it hands you the smallest perturbation that
                        realizes it.
                    </p>}
                    ko={<p>
                        정확한 rank가 5에서 4로 떨어졌고, 값은 norm이 0.7916인 행렬 하나였다. 인쇄된 교재는 이
                        변화를 "4에서 5로"라고 적고 있는데, 두 수의 순서가 뒤바뀐 것이다. 그 밖에는 달라지는
                        것이 없다. 3번이 사 주는 것이 이것이다. SVD는 특이 행렬에 가깝다고 짐작만 하는 것이
                        아니라, 그것을 실제로 이루는 가장 작은 섭동을 손에 쥐여 준다.
                    </p>}
                />
            </Example>
            <T
                en={<p>
                    Item 4 generalizes: cut two terms, drop two ranks. Cutting terms from the sum in Remark
                    4.11 is called <strong>low-rank approximation</strong>, and the theorem above says the
                    error you incur is exactly the first singular value you discarded. The figure keeps a
                    picture on one side and the arithmetic on the other.
                </p>}
                ko={<p>
                    4번은 그 일반화다. 항을 둘 자르면 rank가 둘 떨어진다. Remark 4.11의 합에서 항을 잘라 내는
                    것을 <strong>저계수 근사</strong>라 하고, 위 정리는 그때 생기는 오차가 버린 첫 특이값과
                    정확히 같다고 말한다. 아래 그림은 한쪽에 그림을, 다른 쪽에 그 산술을 붙여 둔다.
                </p>}
            />
            <CanvasFigure label={t("Cutting terms from the SVD, and seeing what they were carrying",
                "SVD에서 항을 잘라 내고 그것이 무엇을 나르고 있었는지 보기")}
                          modal={<LowRankApproximation width={860}/>}
                          bodyClassName="w-[min(94vw,900px)]">
                <LowRankApproximation/>
            </CanvasFigure>
            <Proposition title={<T en={<>Range, null space, and their effective versions</>}
                                   ko={<>range, null space, 그리고 그 유효 버전</>}/>}>
                <T
                    en={<p>
                        Suppose <InlineMath math={"A = U\\Sigma V^\\top"}/> with{" "}
                        <InlineMath math={"\\operatorname{rank}(A) = r"}/>. Then the columns of{" "}
                        <InlineMath math={"U"}/> corresponding to non-zero singular values are a basis for
                        the range, and the columns of <InlineMath math={"V"}/> corresponding to zero singular
                        values are a basis for the null space:
                    </p>}
                    ko={<p>
                        <InlineMath math={"A = U\\Sigma V^\\top"}/>이고{" "}
                        <InlineMath math={"\\operatorname{rank}(A) = r"}/>이라 하자. 그러면 0이 아닌 특이값에
                        대응하는 <InlineMath math={"U"}/>의 열들이 range의 기저이고, 0인 특이값에 대응하는{" "}
                        <InlineMath math={"V"}/>의 열들이 null space의 기저다.
                    </p>}
                />
                <BlockMath math={"\\operatorname{range}(A) = \\operatorname{span}\\{u_1, \\ldots, u_r\\}, \\qquad \\operatorname{null}(A) = \\operatorname{span}\\{v_{r+1}, \\ldots, v_m\\}"}/>
                <Terms items={[
                    ["\\operatorname{range}(A)", <T en={<>the set <InlineMath math={"\\{y \\in \\mathbb{R}^n : y = Ax \\text{ for some } x \\in \\mathbb{R}^m\\}"}/>, of dimension <InlineMath math={"r"}/></>}
                                                   ko={<>집합 <InlineMath math={"\\{y \\in \\mathbb{R}^n : \\text{어떤 } x \\in \\mathbb{R}^m \\text{에 대해 } y = Ax\\}"}/>이고 차원은 <InlineMath math={"r"}/>이다</>}/>],
                    ["\\operatorname{null}(A)", <T en={<>the set <InlineMath math={"\\{x \\in \\mathbb{R}^m : Ax = 0\\}"}/>, of dimension <InlineMath math={"m - r"}/></>}
                                                  ko={<>집합 <InlineMath math={"\\{x \\in \\mathbb{R}^m : Ax = 0\\}"}/>이고 차원은 <InlineMath math={"m - r"}/>이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The <strong>effective</strong> versions replace "zero" with "below a threshold".
                        Suppose <InlineMath math={"\\sigma_1 \\ge \\cdots \\ge \\sigma_r > \\delta \\ge \\sigma_{r+1} \\ge \\cdots \\ge \\sigma_p \\ge 0"}/>,
                        so that <InlineMath math={"\\delta"}/> is the break point and{" "}
                        <InlineMath math={"r"}/> is the effective rank. Then{" "}
                        <InlineMath math={"\\operatorname{range}_{\\text{eff}}(A)"}/> and{" "}
                        <InlineMath math={"\\operatorname{null}_{\\text{eff}}(A)"}/> are spanned by the same
                        lists, cut at the same place. That single choice of{" "}
                        <InlineMath math={"\\delta"}/> is the entire difference between the exact theory and
                        what a program does.
                    </p>}
                    ko={<p>
                        <strong>유효</strong> 버전은 "0"을 "문턱 아래"로 바꾼 것이다.{" "}
                        <InlineMath math={"\\sigma_1 \\ge \\cdots \\ge \\sigma_r > \\delta \\ge \\sigma_{r+1} \\ge \\cdots \\ge \\sigma_p \\ge 0"}/>이라
                        하여 <InlineMath math={"\\delta"}/>가 끊는 지점이고{" "}
                        <InlineMath math={"r"}/>이 유효 rank라 하자. 그러면{" "}
                        <InlineMath math={"\\operatorname{range}_{\\text{eff}}(A)"}/>와{" "}
                        <InlineMath math={"\\operatorname{null}_{\\text{eff}}(A)"}/>는 같은 목록을 같은
                        자리에서 자른 것들이 생성한다. <InlineMath math={"\\delta"}/>를 고르는 그 한 번의
                        선택이 정확한 이론과 프로그램이 하는 일 사이의 차이 전부다.
                    </p>}
                />
            </Proposition>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>LU Factorization</h2>} ko={<h2>LU 분해</h2>}/>
            <T
                en={<p>
                    QR needed independent columns and the SVD needed nothing but paid for it with an
                    eigenvalue problem. LU sits between them: it needs nothing, it costs one pass of Gaussian
                    elimination, and what it hands back is two triangular matrices plus a note about which
                    rows were swapped. This material comes from ROB 101, and the trick that drives it has a
                    name.
                </p>}
                ko={<p>
                    QR은 열이 독립이어야 했고, SVD는 아무 조건도 걸지 않는 대신 고윳값 문제를 치렀다. LU는 그
                    사이에 있다. 조건이 없고, 비용은 가우스 소거 한 번이며, 돌려주는 것은 삼각 행렬 둘에 어느
                    행을 바꿔치웠는지 적은 쪽지 하나다. 이 내용은 ROB 101에서 왔고, 이것을 굴리는 수법에는
                    이름이 붙어 있다.
                </p>}
            />
            <Definition n="4.14" title={<T en={<>Permutation matrix</>} ko={<>순열 행렬</>}/>}>
                <T
                    en={<p>
                        An <InlineMath math={"n \\times n"}/> matrix{" "}
                        <InlineMath math={"P"}/> consisting of only zeros and ones and satisfying{" "}
                        <InlineMath math={"P^\\top P = PP^\\top = I"}/> is called a{" "}
                        <strong>permutation matrix</strong>.
                    </p>}
                    ko={<p>
                        0과 1로만 이루어지고 <InlineMath math={"P^\\top P = PP^\\top = I"}/>를 만족하는{" "}
                        <InlineMath math={"n \\times n"}/> 행렬 <InlineMath math={"P"}/>를{" "}
                        <strong>순열 행렬</strong>이라 한다.
                    </p>}
                />
                <BlockMath math={"P = \\begin{bmatrix}1 & 0 & 0\\\\ 0 & 0 & 1\\\\ 0 & 1 & 0\\end{bmatrix}, \\qquad P\\begin{bmatrix}a\\\\ b\\\\ c\\end{bmatrix} = \\begin{bmatrix}a\\\\ c\\\\ b\\end{bmatrix}"}/>
                <Terms items={[
                    ["P", <T en={<>the matrix that swaps rows 2 and 3 and leaves row 1 alone; it is orthogonal, so <InlineMath math={"P^{-1} = P^\\top"}/></>}
                             ko={<>2행과 3행을 바꾸고 1행은 그대로 두는 행렬. 직교 행렬이라 <InlineMath math={"P^{-1} = P^\\top"}/>이다</>}/>],
                    ["\\det P", <T en={<>always <InlineMath math={"\\pm 1"}/>, one sign for each swap, so <InlineMath math={"P"}/> is always invertible</>}
                                  ko={<>늘 <InlineMath math={"\\pm 1"}/>이고 교환마다 부호가 하나씩 바뀐다. 그래서 <InlineMath math={"P"}/>는 늘 가역이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Multiplying on the left permutes rows, on the right permutes columns. Each row and
                        each column has exactly one 1, so a permutation matrix is a relabelling of indices and
                        nothing else. In code it is stored as a list{" "}
                        <InlineMath math={"p = \\{i_1, \\ldots, i_n\\}"}/>, never as a matrix.
                    </p>}
                    ko={<p>
                        왼쪽에서 곱하면 행이, 오른쪽에서 곱하면 열이 뒤바뀐다. 각 행과 각 열에 1이 정확히 하나씩
                        있으므로 순열 행렬은 첨자를 다시 붙이는 일일 뿐 그 이상이 아니다. 코드에서는 목록{" "}
                        <InlineMath math={"p = \\{i_1, \\ldots, i_n\\}"}/>으로 저장하지 행렬로 저장하지 않는다.
                    </p>}
                />
            </Definition>
            <Definition n="4.16" title={<T en={<>Lower, upper, and uni-lower triangular</>}
                                           ko={<>lower, upper, uni-lower triangular</>}/>}>
                <T
                    en={<p>
                        A possibly rectangular matrix <InlineMath math={"L"}/> is{" "}
                        <strong>lower triangular</strong> if all entries above the diagonal are zero, and{" "}
                        <InlineMath math={"U"}/> is <strong>upper triangular</strong> if all entries below
                        the diagonal are zero. The <strong>diagonal</strong> of an{" "}
                        <InlineMath math={"n \\times m"}/> matrix consists of the{" "}
                        <InlineMath math={"m_{ii}"}/> with{" "}
                        <InlineMath math={"1 \\le i \\le \\min\\{n, m\\}"}/>.{" "}
                        <InlineMath math={"L"}/> is <strong>uni-lower triangular</strong> if its diagonal is
                        all ones. An empty matrix counts as uni-lower triangular, since its diagonal has no
                        terms to violate the definition.
                    </p>}
                    ko={<p>
                        직사각일 수도 있는 행렬 <InlineMath math={"L"}/>의 대각 위쪽이 전부 0이면{" "}
                        <strong>lower triangular</strong>라 하고, <InlineMath math={"U"}/>의 대각 아래쪽이
                        전부 0이면 <strong>upper triangular</strong>라 한다.{" "}
                        <InlineMath math={"n \\times m"}/> 행렬의 <strong>대각</strong>은{" "}
                        <InlineMath math={"1 \\le i \\le \\min\\{n, m\\}"}/>인{" "}
                        <InlineMath math={"m_{ii}"}/>들이다. 대각이 전부 1인{" "}
                        <InlineMath math={"L"}/>을 <strong>uni-lower triangular</strong>라 한다. 빈 행렬도
                        uni-lower triangular로 친다. 대각에 항이 없어 정의를 어길 것도 없기 때문이다.
                    </p>}
                />
            </Definition>
            <Proposition n="4.17" title={<T en={<>Why triangular is the shape worth aiming for</>}
                                            ko={<>삼각형을 목표로 삼는 이유</>}/>}>
                <T
                    en={<ul>
                        <li>If <InlineMath math={"M"}/> is square and triangular, then{" "}
                            <InlineMath math={"\\det M"}/> is the product of its diagonal.</li>
                        <li>If <InlineMath math={"L"}/> is square lower triangular with non-zero
                            determinant, <InlineMath math={"Lx = b"}/> is solved by{" "}
                            <strong>forward substitution</strong>.</li>
                        <li>If <InlineMath math={"U"}/> is square upper triangular with non-zero
                            determinant, <InlineMath math={"Ux = b"}/> is solved by{" "}
                            <strong>back substitution</strong>.</li>
                    </ul>}
                    ko={<ul>
                        <li><InlineMath math={"M"}/>이 정방이고 삼각이면{" "}
                            <InlineMath math={"\\det M"}/>은 대각의 곱이다.</li>
                        <li><InlineMath math={"L"}/>이 행렬식이 0이 아닌 정방 lower triangular이면{" "}
                            <InlineMath math={"Lx = b"}/>는 <strong>forward substitution</strong>으로
                            풀린다.</li>
                        <li><InlineMath math={"U"}/>가 행렬식이 0이 아닌 정방 upper triangular이면{" "}
                            <InlineMath math={"Ux = b"}/>는 <strong>back substitution</strong>으로
                            풀린다.</li>
                    </ul>}
                />
                <T
                    en={<p>
                        The notes send the reader to ROB 101 for substitution, so here it is in full on a
                        three by three. Forward substitution starts at the top, where the first row has one
                        unknown, and each row afterwards has one more known quantity than the last:
                    </p>}
                    ko={<p>
                        교재는 대입 이야기를 ROB 101로 넘기므로, 여기서{" "}
                        <InlineMath math={"3 \\times 3"}/>으로 끝까지 적어 둔다. forward
                        substitution은 위에서 시작한다. 첫 행에는 미지수가 하나뿐이고, 뒤로 갈수록 이미 아는
                        값이 하나씩 늘어난다.
                    </p>}
                />
                <BlockMath math={"\\begin{bmatrix}1 & 0 & 0\\\\ 1 & 1 & 0\\\\ 1 & \\tfrac13 & 1\\end{bmatrix}\\begin{bmatrix}y_1\\\\ y_2\\\\ y_3\\end{bmatrix} = \\begin{bmatrix}2\\\\ -7\\\\ 3\\end{bmatrix}"}/>
                <Terms items={[
                    ["y_1", <T en={<>read straight off row 1: <InlineMath math={"y_1 = 2"}/></>}
                              ko={<>1행에서 곧바로 읽는다. <InlineMath math={"y_1 = 2"}/>다</>}/>],
                    ["y_2", <T en={<>row 2 says <InlineMath math={"2 + y_2 = -7"}/>, so <InlineMath math={"y_2 = -9"}/></>}
                              ko={<>2행이 <InlineMath math={"2 + y_2 = -7"}/>이라 하므로 <InlineMath math={"y_2 = -9"}/>다</>}/>],
                    ["y_3", <T en={<>row 3 says <InlineMath math={"2 - 3 + y_3 = 3"}/>, so <InlineMath math={"y_3 = 4"}/></>}
                              ko={<>3행이 <InlineMath math={"2 - 3 + y_3 = 3"}/>이라 하므로 <InlineMath math={"y_3 = 4"}/>다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Back substitution is the same walk in the other direction, starting from the bottom
                        row. Neither one inverts anything, and both cost about{" "}
                        <InlineMath math={"n^2/2"}/> multiplications. That is the payoff the whole
                        factorization is chasing.
                    </p>}
                    ko={<p>
                        back substitution은 같은 걸음을 반대 방향으로, 마지막 행에서 시작해 밟는 것이다. 어느
                        쪽도 역행렬을 내지 않고, 둘 다 곱셈 <InlineMath math={"n^2/2"}/>번쯤이면 끝난다. 분해
                        전체가 노리는 보상이 그것이다.
                    </p>}
                />
            </Proposition>
            <T
                en={<p>
                    If <InlineMath math={"L"}/> is lower triangular and{" "}
                    <InlineMath math={"U"}/> is upper triangular, their product{" "}
                    <InlineMath math={"A := LU"}/> is in general neither. Can that be reversed? Given a
                    generic square matrix, can it be factored as a lower triangular times an upper triangular
                    one? The next example shows the secret sauce, and it has a name: <strong>peeling the
                    onion</strong>. Starting from the top left corner and working down the diagonal, it
                    successively zeros out columns and rows of a matrix.
                </p>}
                ko={<p>
                    <InlineMath math={"L"}/>이 lower triangular이고{" "}
                    <InlineMath math={"U"}/>가 upper triangular일 때 그 곱{" "}
                    <InlineMath math={"A := LU"}/>는 일반적으로 둘 다 아니다. 이 과정을 되돌릴 수 있을까?
                    일반적인 정방 행렬 하나를 lower triangular와 upper triangular의 곱으로 분해할 수 있을까?
                    다음 예제가 그 비법을 보여 주는데, 이름이 붙어 있다. <strong>양파 껍질 벗기기</strong>다.
                    왼쪽 위 모서리에서 시작해 대각선을 따라 내려가며 행렬의 열과 행을 차례로 0으로 만든다.
                </p>}
            />
            <Example n="4.18" title={<T en={<>Peeling the onion</>} ko={<>양파 껍질 벗기기</>}/>}>
                <T
                    en={<p>
                        Consider the square matrix below. The goal is to find a column vector{" "}
                        <InlineMath math={"C_1"}/> and a row vector <InlineMath math={"R_1"}/> whose outer
                        product matches the first row and the first column of{" "}
                        <InlineMath math={"M"}/> exactly, so that subtracting it clears both.
                    </p>}
                    ko={<p>
                        아래 정방 행렬을 보자. 목표는 열 벡터 <InlineMath math={"C_1"}/>과 행 벡터{" "}
                        <InlineMath math={"R_1"}/>을 찾되, 그 외적이 <InlineMath math={"M"}/>의 첫 행과 첫 열과
                        정확히 일치하게 하는 것이다. 그러면 빼는 것만으로 둘이 함께 지워진다.
                    </p>}
                />
                <BlockMath math={"M = \\begin{bmatrix}1 & 4 & 5\\\\ 2 & 9 & 17\\\\ 3 & 18 & 58\\end{bmatrix}, \\qquad M - C_1 R_1 = \\begin{bmatrix}0 & 0 & 0\\\\ 0 & * & *\\\\ 0 & * & *\\end{bmatrix}"}/>
                <Terms items={[
                    ["*", <T en={<>"don't care": the algorithm makes no demand on these entries, they are whatever the subtraction leaves</>}
                             ko={<>"상관없음". 알고리즘은 이 자리에 아무 요구도 하지 않는다. 빼고 남는 대로 둔다</>}/>],
                    ["C_1 R_1", <T en={<>an outer product, so a rank-one matrix; matching one row and one column is the most it could ever do</>}
                                  ko={<>외적이므로 rank 1 행렬이다. 행 하나와 열 하나를 맞추는 것이 이것이 할 수 있는 최대다</>}/>],
                ]}/>
                <T
                    en={<p>
                        In this special case the top left entry is 1, which makes the choice obvious: let{" "}
                        <InlineMath math={"C_1"}/> be the first column of{" "}
                        <InlineMath math={"M"}/> and <InlineMath math={"R_1"}/> its first row. The general
                        case is handled by Lemma 4.21 below.
                    </p>}
                    ko={<p>
                        지금은 왼쪽 위 성분이 1인 특별한 경우라 선택이 뻔하다.{" "}
                        <InlineMath math={"C_1"}/>을 <InlineMath math={"M"}/>의 첫 열,{" "}
                        <InlineMath math={"R_1"}/>을 첫 행으로 두면 된다. 일반적인 경우는 아래 Lemma 4.21이
                        처리한다.
                    </p>}
                />
                <BlockMath math={"C_1 = \\begin{bmatrix}1\\\\ 2\\\\ 3\\end{bmatrix}, \\quad R_1 = \\begin{bmatrix}1 & 4 & 5\\end{bmatrix}, \\quad C_1 R_1 = \\begin{bmatrix}1 & 4 & 5\\\\ 2 & 8 & 10\\\\ 3 & 12 & 15\\end{bmatrix}"}/>
                <Terms items={[
                    ["C_1 R_1", <T en={<>its first row and first column agree with those of <InlineMath math={"M"}/>, because the top left entry is 1 and scaling by it changes nothing</>}
                                  ko={<>첫 행과 첫 열이 <InlineMath math={"M"}/>의 것과 같다. 왼쪽 위 성분이 1이라 그것으로 나누어도 달라지는 것이 없기 때문이다</>}/>],
                ]}/>
                <BlockMath math={"M - C_1 R_1 = \\begin{bmatrix}0 & 0 & 0\\\\ 0 & 1 & 7\\\\ 0 & 6 & 43\\end{bmatrix}"}/>
                <Terms items={[
                    ["\\text{row } 2", <T en={<><InlineMath math={"(2, 9, 17) - (2, 8, 10) = (0, 1, 7)"}/></>}
                                         ko={<><InlineMath math={"(2, 9, 17) - (2, 8, 10) = (0, 1, 7)"}/></>}/>],
                    ["\\text{row } 3", <T en={<><InlineMath math={"(3, 18, 58) - (3, 12, 15) = (0, 6, 43)"}/></>}
                                         ko={<><InlineMath math={"(3, 18, 58) - (3, 12, 15) = (0, 6, 43)"}/></>}/>],
                ]}/>
                <T
                    en={<p>
                        A three by three matrix has essentially become a two by two. Do it again with{" "}
                        <InlineMath math={"C_2 = (0, 1, 6)^\\top"}/> and{" "}
                        <InlineMath math={"R_2 = (0, 1, 7)"}/>, the second column and second row of what
                        remains, and the leftover is{" "}
                        <InlineMath math={"\\begin{bmatrix}0&0&0\\\\0&0&0\\\\0&0&1\\end{bmatrix}"}/>. One more
                        peel with <InlineMath math={"C_3 = (0,0,1)^\\top"}/> and{" "}
                        <InlineMath math={"R_3 = (0,0,1)"}/> and nothing is left at all. Collect the pieces:
                    </p>}
                    ko={<p>
                        <InlineMath math={"3 \\times 3"}/> 행렬이 사실상{" "}
                        <InlineMath math={"2 \\times 2"}/>가 되었다. 남은 것의 둘째 열과 둘째 행인{" "}
                        <InlineMath math={"C_2 = (0, 1, 6)^\\top"}/>,{" "}
                        <InlineMath math={"R_2 = (0, 1, 7)"}/>로 한 번 더 하면 남는 것은{" "}
                        <InlineMath math={"\\begin{bmatrix}0&0&0\\\\0&0&0\\\\0&0&1\\end{bmatrix}"}/>이다.{" "}
                        <InlineMath math={"C_3 = (0,0,1)^\\top"}/>,{" "}
                        <InlineMath math={"R_3 = (0,0,1)"}/>로 한 번 더 벗기면 아무것도 남지 않는다. 조각들을
                        모으면
                    </p>}
                />
                <BlockMath math={"M = C_1R_1 + C_2R_2 + C_3R_3 = \\underbrace{\\begin{bmatrix}1 & 0 & 0\\\\ 2 & 1 & 0\\\\ 3 & 6 & 1\\end{bmatrix}}_{L}\\underbrace{\\begin{bmatrix}1 & 4 & 5\\\\ 0 & 1 & 7\\\\ 0 & 0 & 1\\end{bmatrix}}_{U}"}/>
                <Terms items={[
                    ["L", <T en={<>the columns <InlineMath math={"C_1, C_2, C_3"}/> side by side, uni-lower triangular because each <InlineMath math={"C_k"}/> starts with <InlineMath math={"k-1"}/> zeros and then a 1</>}
                             ko={<><InlineMath math={"C_1, C_2, C_3"}/>을 나란히 세운 것. 각 <InlineMath math={"C_k"}/>가 0 <InlineMath math={"k-1"}/>개로 시작해 1이 오므로 uni-lower triangular다</>}/>],
                    ["U", <T en={<>the rows <InlineMath math={"R_1, R_2, R_3"}/> stacked, upper triangular for the mirror image of the same reason</>}
                             ko={<><InlineMath math={"R_1, R_2, R_3"}/>을 쌓은 것. 같은 이유의 거울상으로 upper triangular다</>}/>],
                    ["C_kR_k", <T en={<>a sum of rank-one matrices, exactly like Remark 4.11; the two factorizations are the same idea with different constraints</>}
                                 ko={<>rank 1 행렬의 합이고, Remark 4.11과 똑같은 모양이다. 두 분해는 제약만 다른 같은 아이디어다</>}/>],
                ]}/>
            </Example>

            <T
                en={<p>
                    That example was rigged: the first non-zero entry of each{" "}
                    <InlineMath math={"C_k"}/> happened to be 1 already. The general case needs two repairs.
                    Divide the column by its leading entry so the 1 appears by construction, and when that
                    leading entry is zero, swap a better row into place first. The definitions below name the
                    state of the matrix partway through so that the induction has something to hold on to.
                </p>}
                ko={<p>
                    방금 예제는 짜여 있었다. 각 <InlineMath math={"C_k"}/>의 첫 0이 아닌 성분이 마침 1이었다.
                    일반적인 경우에는 두 가지를 손봐야 한다. 열을 그 선두 성분으로 나누어 1이 저절로 생기게
                    하고, 그 선두 성분이 0이면 먼저 더 나은 행을 끌어와 바꾼다. 아래 정의들은 중간 상태에 이름을
                    붙여, 귀납법이 붙잡을 것을 만들어 준다.
                </p>}
            />
            <Definition n="4.19" title={<T en={<>Left zeroed of order k</>} ko={<>차수 k의 left zeroed</>}/>}>
                <T
                    en={<p>
                        An <InlineMath math={"n \\times m"}/> matrix{" "}
                        <InlineMath math={"A"}/> is <strong>left zeroed of order{" "}
                        <InlineMath math={"0 \\le k \\le \\min\\{n, m\\}"}/></strong> if it has the form
                    </p>}
                    ko={<p>
                        <InlineMath math={"n \\times m"}/> 행렬 <InlineMath math={"A"}/>가 다음 꼴이면{" "}
                        <strong>차수 <InlineMath math={"0 \\le k \\le \\min\\{n, m\\}"}/>의 left
                            zeroed</strong>라 한다.
                    </p>}
                />
                <BlockMath math={"A = \\begin{bmatrix} 0_{k \\times k} & 0_{k \\times (m-k)} \\\\[3pt] 0_{(n-k) \\times k} & \\tilde{A} \\end{bmatrix}"}/>
                <Terms items={[
                    ["k", <T en={<>how many rows and columns have already been peeled away; the example above reached order 1, then 2, then 3</>}
                             ko={<>이미 벗겨 낸 행과 열의 개수. 위 예제는 차수 1, 2, 3을 차례로 지났다</>}/>],
                    ["\\tilde{A}", <T en={<>the <InlineMath math={"(n-k) \\times (m-k)"}/> block that is left, the only part still to be dealt with</>}
                                     ko={<>남은 <InlineMath math={"(n-k) \\times (m-k)"}/> 블록. 아직 처리할 것이 남은 유일한 부분이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        When <InlineMath math={"k = 0"}/> the zero blocks are empty, so{" "}
                        <strong>every</strong> matrix is left zeroed of order zero, which is what makes it a
                        legal base case. When <InlineMath math={"k = \\min\\{n, m\\}"}/> the block{" "}
                        <InlineMath math={"\\tilde{A}"}/> is empty and{" "}
                        <InlineMath math={"A"}/> is identically zero, which is what makes it a legal
                        stopping point.
                    </p>}
                    ko={<p>
                        <InlineMath math={"k = 0"}/>이면 영 블록들이 비므로 <strong>모든</strong> 행렬이 차수
                        0의 left zeroed다. 그래서 귀납법의 시작점으로 쓸 수 있다.{" "}
                        <InlineMath math={"k = \\min\\{n, m\\}"}/>이면 블록{" "}
                        <InlineMath math={"\\tilde{A}"}/>가 비어 <InlineMath math={"A"}/>는 항등적으로 0이다.
                        그래서 멈추는 지점으로 쓸 수 있다.
                    </p>}
                />
            </Definition>
            <Lemma n="4.21" title={<T en={<>Peeling the onion, general case</>} ko={<>양파 껍질 벗기기, 일반형</>}/>}>
                <T
                    en={<p>
                        Suppose <InlineMath math={"A"}/> is an <InlineMath math={"n \\times m"}/> matrix left
                        zeroed of order <InlineMath math={"0 \\le k < \\min\\{n, m\\}"}/>. Then there exist a
                        permutation matrix <InlineMath math={"P"}/>, a column vector{" "}
                        <InlineMath math={"C"}/>, and a row vector <InlineMath math={"R"}/> such that
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>가 차수{" "}
                        <InlineMath math={"0 \\le k < \\min\\{n, m\\}"}/>의 left zeroed인{" "}
                        <InlineMath math={"n \\times m"}/> 행렬이라 하자. 그러면 순열 행렬{" "}
                        <InlineMath math={"P"}/>, 열 벡터 <InlineMath math={"C"}/>, 행 벡터{" "}
                        <InlineMath math={"R"}/>이 존재하여 다음이 성립한다.
                    </p>}
                />
                <T
                    en={<ol>
                        <li><InlineMath math={"PA - CR"}/> is left zeroed of order{" "}
                            <InlineMath math={"k + 1"}/>,</li>
                        <li><InlineMath math={"C"}/> and <InlineMath math={"R"}/> have zeros in their
                            first <InlineMath math={"k"}/> entries,</li>
                        <li>the <InlineMath math={"(k+1)"}/>-st entry of{" "}
                            <InlineMath math={"C"}/> equals one, and</li>
                        <li>the first <InlineMath math={"k"}/> rows of{" "}
                            <InlineMath math={"P"}/> are the first <InlineMath math={"k"}/> rows of the
                            identity.</li>
                    </ol>}
                    ko={<ol>
                        <li><InlineMath math={"PA - CR"}/>이 차수{" "}
                            <InlineMath math={"k + 1"}/>의 left zeroed이고,</li>
                        <li><InlineMath math={"C"}/>와 <InlineMath math={"R"}/>의 처음{" "}
                            <InlineMath math={"k"}/>개 성분이 0이며,</li>
                        <li><InlineMath math={"C"}/>의 <InlineMath math={"(k+1)"}/>번째 성분이 1이고,</li>
                        <li><InlineMath math={"P"}/>의 처음 <InlineMath math={"k"}/>개 행이 단위 행렬의 처음{" "}
                            <InlineMath math={"k"}/>개 행과 같다.</li>
                    </ol>}
                />
                <Terms items={[
                    ["(3)", <T en={<>the normalization: dividing the column by its leading entry is what puts the 1 there, and it is why <InlineMath math={"L"}/> comes out uni-lower triangular</>}
                              ko={<>정규화 조항. 열을 선두 성분으로 나누어 1을 만드는 일이고, <InlineMath math={"L"}/>이 uni-lower triangular로 나오는 이유다</>}/>],
                    ["(4)", <T en={<>the promise that later swaps never disturb rows already finished, which is what lets the permutations compose cleanly</>}
                              ko={<>나중의 교환이 이미 끝난 행을 건드리지 않는다는 약속. 순열들이 깔끔하게 합성되는 이유다</>}/>],
                ]}/>
                <Proof label={<T en={<>Proof by exhaustion, three cases</>} ko={<>경우를 다 나누는 증명, 세 가지</>}/>}>
                    <T
                        en={<p>
                            Write <InlineMath math={"a_{ij}"}/> for the entries,{" "}
                            <InlineMath math={"a^{\\text{row}}_i"}/> for the{" "}
                            <InlineMath math={"i"}/>-th row and{" "}
                            <InlineMath math={"a^{\\text{col}}_j"}/> for the{" "}
                            <InlineMath math={"j"}/>-th column.
                        </p>}
                        ko={<p>
                            성분을 <InlineMath math={"a_{ij}"}/>,{" "}
                            <InlineMath math={"i"}/>번째 행을{" "}
                            <InlineMath math={"a^{\\text{row}}_i"}/>,{" "}
                            <InlineMath math={"j"}/>번째 열을{" "}
                            <InlineMath math={"a^{\\text{col}}_j"}/>로 적는다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>Case 1: the pivot is non-zero,{" "}
                                <InlineMath math={"a_{k+1,k+1} \\ne 0"}/>.</strong> No swap is needed, so
                            take <InlineMath math={"P = I"}/> and
                        </p>}
                        ko={<p>
                            <strong>경우 1: 피벗이 0이 아니다,{" "}
                                <InlineMath math={"a_{k+1,k+1} \\ne 0"}/>.</strong> 교환이 필요 없으므로{" "}
                            <InlineMath math={"P = I"}/>로 두고
                        </p>}
                    />
                    <BlockMath math={"C := \\frac{a^{\\text{col}}_{k+1}}{a_{k+1,k+1}}, \\qquad R := a^{\\text{row}}_{k+1}"}/>
                    <Terms items={[
                        ["C", <T en={<>the pivot column divided by the pivot, so its <InlineMath math={"(k+1)"}/>-st entry is exactly 1, satisfying clause 3</>}
                                 ko={<>피벗 열을 피벗으로 나눈 것. <InlineMath math={"(k+1)"}/>번째 성분이 정확히 1이라 조항 3을 만족한다</>}/>],
                        ["R", <T en={<>the pivot row untouched; its first <InlineMath math={"k"}/> entries are zero because <InlineMath math={"A"}/> was already left zeroed of order <InlineMath math={"k"}/></>}
                                 ko={<>손대지 않은 피벗 행. <InlineMath math={"A"}/>가 이미 차수 <InlineMath math={"k"}/>의 left zeroed라 처음 <InlineMath math={"k"}/>개 성분이 0이다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Multiplying out shows{" "}
                            <InlineMath math={"[CR]_{ij} = [PA]_{ij}"}/> along the whole of row{" "}
                            <InlineMath math={"k+1"}/> and column{" "}
                            <InlineMath math={"k+1"}/>, so the subtraction clears both and{" "}
                            <InlineMath math={"PA - CR"}/> is left zeroed of order{" "}
                            <InlineMath math={"k+1"}/>.
                        </p>}
                        ko={<p>
                            곱해 보면 <InlineMath math={"k+1"}/>행 전체와{" "}
                            <InlineMath math={"k+1"}/>열 전체에서{" "}
                            <InlineMath math={"[CR]_{ij} = [PA]_{ij}"}/>이므로, 빼면 둘이 함께 지워지고{" "}
                            <InlineMath math={"PA - CR"}/>은 차수 <InlineMath math={"k+1"}/>의 left
                            zeroed가 된다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>Case 2: the whole pivot column is zero,{" "}
                                <InlineMath math={"a^{\\text{col}}_{k+1} = 0"}/>.</strong> There is nothing
                            to swap in, since every candidate row has a zero there. Take{" "}
                            <InlineMath math={"P = I"}/>, let <InlineMath math={"C"}/> be the standard basis
                            vector with a 1 in position <InlineMath math={"k+1"}/>, and{" "}
                            <InlineMath math={"R := a^{\\text{row}}_{k+1}"}/> as before. The column is
                            already zero, and <InlineMath math={"CR"}/> removes the row.
                        </p>}
                        ko={<p>
                            <strong>경우 2: 피벗 열 전체가 0이다,{" "}
                                <InlineMath math={"a^{\\text{col}}_{k+1} = 0"}/>.</strong> 후보 행마다 그
                            자리가 0이므로 끌어올 것이 없다. <InlineMath math={"P = I"}/>로 두고,{" "}
                            <InlineMath math={"C"}/>는 <InlineMath math={"k+1"}/>번째 자리만 1인 표준 기저
                            벡터로, <InlineMath math={"R := a^{\\text{row}}_{k+1}"}/>은 앞과 같이 둔다. 열은
                            이미 0이고, <InlineMath math={"CR"}/>이 행을 지운다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>Case 3: the pivot is zero but the column is not,{" "}
                                <InlineMath math={"a_{k+1,k+1} = 0"}/> and{" "}
                                <InlineMath math={"a^{\\text{col}}_{k+1} \\ne 0"}/>.</strong> Then some{" "}
                            <InlineMath math={"\\rho"}/> with{" "}
                            <InlineMath math={"k + 1 < \\rho \\le n"}/> has{" "}
                            <InlineMath math={"a_{\\rho, k+1} \\ne 0"}/>. Let{" "}
                            <InlineMath math={"p"}/> be the permutation that exchanges{" "}
                            <InlineMath math={"k+1"}/> with <InlineMath math={"\\rho"}/> and fixes
                            everything else, and set <InlineMath math={"P := I[p, :]"}/>. Then{" "}
                            <InlineMath math={"PA"}/> satisfies the hypotheses of Case 1, and its proof
                            applies unchanged.
                        </p>}
                        ko={<p>
                            <strong>경우 3: 피벗은 0인데 열은 0이 아니다,{" "}
                                <InlineMath math={"a_{k+1,k+1} = 0"}/>이고{" "}
                                <InlineMath math={"a^{\\text{col}}_{k+1} \\ne 0"}/>.</strong> 그러면{" "}
                            <InlineMath math={"k + 1 < \\rho \\le n"}/>인 어떤{" "}
                            <InlineMath math={"\\rho"}/>에 대해{" "}
                            <InlineMath math={"a_{\\rho, k+1} \\ne 0"}/>이다.{" "}
                            <InlineMath math={"k+1"}/>과 <InlineMath math={"\\rho"}/>를 맞바꾸고 나머지는
                            그대로 두는 순열을 <InlineMath math={"p"}/>라 하고{" "}
                            <InlineMath math={"P := I[p, :]"}/>로 둔다. 그러면{" "}
                            <InlineMath math={"PA"}/>가 경우 1의 가정을 만족하고, 그 증명이 그대로 적용된다.
                        </p>}
                    />
                    <T
                        en={<p>
                            The three cases are exhaustive, since the pivot is either non-zero or zero, and in
                            the second case the rest of the column is either all zero or not.
                        </p>}
                        ko={<p>
                            세 경우로 전부 덮인다. 피벗은 0이 아니거나 0이고, 0인 경우 그 열의 나머지가 전부
                            0이거나 아니거나 둘 중 하나이기 때문이다.
                        </p>}
                    />
                </Proof>
            </Lemma>
            <Theorem n="4.22" title={<T en={<>LU Factorization</>} ko={<>LU 분해</>}/>}>
                <T
                    en={<p>
                        Let <InlineMath math={"A"}/> be an <InlineMath math={"n \\times m"}/> real matrix and
                        define <InlineMath math={"r = \\min(n, m)"}/>. There always exist an{" "}
                        <InlineMath math={"n \\times n"}/> permutation matrix{" "}
                        <InlineMath math={"P"}/>, an <InlineMath math={"n \\times r"}/> uni-lower triangular
                        matrix <InlineMath math={"L"}/>, and an{" "}
                        <InlineMath math={"r \\times m"}/> upper triangular matrix{" "}
                        <InlineMath math={"U"}/> such that
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>가 실수 <InlineMath math={"n \\times m"}/> 행렬이고{" "}
                        <InlineMath math={"r = \\min(n, m)"}/>이라 하자. 그러면{" "}
                        <InlineMath math={"n \\times n"}/> 순열 행렬{" "}
                        <InlineMath math={"P"}/>와 <InlineMath math={"n \\times r"}/> uni-lower triangular
                        행렬 <InlineMath math={"L"}/>, <InlineMath math={"r \\times m"}/> upper triangular
                        행렬 <InlineMath math={"U"}/>가 <strong>언제나</strong> 존재하여 다음이 성립한다.
                    </p>}
                />
                <BlockMath math={"P \\cdot A = L \\cdot U"}/>
                <Terms items={[
                    ["P", <T en={<>records the row swaps; it is why the statement is not <InlineMath math={"A = LU"}/>, which is false for <InlineMath math={"A = \\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}"}/></>}
                             ko={<>행 교환을 기록한다. 진술이 <InlineMath math={"A = LU"}/>가 아닌 이유이고, <InlineMath math={"A = \\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}"}/>에서는 그 식이 실제로 거짓이다</>}/>],
                    ["\\text{always}", <T en={<>no rank condition, no invertibility, no symmetry; the same generosity the SVD has and QR does not</>}
                                         ko={<>rank 조건도, 가역성도, 대칭성도 요구하지 않는다. SVD가 가졌고 QR은 갖지 못한 그 너그러움이다</>}/>],
                ]}/>
                <Proof label={<T en={<>Proof by induction on the order</>} ko={<>차수에 대한 귀납법 증명</>}/>}>
                    <T
                        en={<p>
                            <strong>Base step.</strong> At <InlineMath math={"k = 0"}/> set{" "}
                            <InlineMath math={"P_0 := I"}/> and let{" "}
                            <InlineMath math={"L_0, U_0"}/> be empty matrices. Every matrix is left zeroed of
                            order zero, so <InlineMath math={"A_0 := P_0A - L_0U_0 = A"}/> satisfies the
                            hypothesis trivially.
                        </p>}
                        ko={<p>
                            <strong>시작 단계.</strong> <InlineMath math={"k = 0"}/>에서{" "}
                            <InlineMath math={"P_0 := I"}/>로 두고{" "}
                            <InlineMath math={"L_0, U_0"}/>은 빈 행렬로 둔다. 모든 행렬이 차수 0의 left
                            zeroed이므로 <InlineMath math={"A_0 := P_0A - L_0U_0 = A"}/>가 가정을 자명하게
                            만족한다.
                        </p>}
                    />
                    <T
                        en={<p>
                            <strong>Induction step.</strong> At step{" "}
                            <InlineMath math={"k \\ge 0"}/>, assume{" "}
                            <InlineMath math={"A_k := P_kA - L_kU_k"}/> is left zeroed of order{" "}
                            <InlineMath math={"k"}/>, with <InlineMath math={"L_k"}/> an{" "}
                            <InlineMath math={"n \\times k"}/> uni-lower triangular matrix and{" "}
                            <InlineMath math={"U_k"}/> a <InlineMath math={"k \\times m"}/> upper triangular
                            one. Lemma 4.21 supplies <InlineMath math={"P, C, R"}/>. Define
                        </p>}
                        ko={<p>
                            <strong>귀납 단계.</strong> <InlineMath math={"k \\ge 0"}/> 단계에서{" "}
                            <InlineMath math={"A_k := P_kA - L_kU_k"}/>가 차수{" "}
                            <InlineMath math={"k"}/>의 left zeroed이고{" "}
                            <InlineMath math={"L_k"}/>가 <InlineMath math={"n \\times k"}/> uni-lower
                            triangular, <InlineMath math={"U_k"}/>가{" "}
                            <InlineMath math={"k \\times m"}/> upper triangular라 하자. Lemma 4.21이{" "}
                            <InlineMath math={"P, C, R"}/>을 준다. 이제
                        </p>}
                    />
                    <BlockMath math={"P_{k+1} := P \\cdot P_k, \\qquad L_{k+1} := \\begin{bmatrix} P\\cdot L_k & C\\end{bmatrix}, \\qquad U_{k+1} := \\begin{bmatrix} U_k \\\\ R\\end{bmatrix}"}/>
                    <Terms items={[
                        ["P \\cdot L_k", <T en={<>the finished multipliers move with their rows; this is the bookkeeping the figure below highlights</>}
                                           ko={<>확정된 배수들이 자기 행을 따라 함께 움직인다. 아래 그림이 강조하는 장부 정리다</>}/>],
                        ["C", <T en={<>appended as a new last column of <InlineMath math={"L"}/>, and by clauses 2 and 3 of the lemma it keeps <InlineMath math={"L_{k+1}"}/> uni-lower triangular</>}
                                 ko={<><InlineMath math={"L"}/>의 새 마지막 열로 붙는다. 보조정리의 조항 2와 3 덕분에 <InlineMath math={"L_{k+1}"}/>이 uni-lower triangular로 남는다</>}/>],
                        ["R", <T en={<>appended as a new last row of <InlineMath math={"U"}/>, and by clause 2 it keeps <InlineMath math={"U_{k+1}"}/> upper triangular</>}
                                 ko={<><InlineMath math={"U"}/>의 새 마지막 행으로 붙는다. 조항 2 덕분에 <InlineMath math={"U_{k+1}"}/>이 upper triangular로 남는다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            Block multiplication gives{" "}
                            <InlineMath math={"L_{k+1}U_{k+1} = P L_k U_k + CR"}/>, so
                        </p>}
                        ko={<p>
                            블록 곱셈으로{" "}
                            <InlineMath math={"L_{k+1}U_{k+1} = P L_k U_k + CR"}/>이므로
                        </p>}
                    />
                    <BlockMath math={"\\begin{aligned} P_{k+1}A - L_{k+1}U_{k+1} &= P P_k A - P L_k U_k - CR \\\\ &= P\\left(P_kA - L_kU_k\\right) - CR = PA_k - CR \\end{aligned}"}/>
                    <Terms items={[
                        ["PA_k - CR", <T en={<>left zeroed of order <InlineMath math={"k+1"}/> by clause 1 of the lemma, which is exactly the induction hypothesis one step further along</>}
                                        ko={<>보조정리의 조항 1로 차수 <InlineMath math={"k+1"}/>의 left zeroed다. 귀납 가정을 한 걸음 앞으로 옮긴 것 그대로다</>}/>],
                    ]}/>
                    <T
                        en={<p>
                            The algorithm stops at <InlineMath math={"k = r = \\min\\{n, m\\}"}/>, where a
                            matrix left zeroed of that order is identically zero by Definition 4.19, so{" "}
                            <InlineMath math={"A_r = 0"}/> and therefore{" "}
                            <InlineMath math={"P_rA = L_rU_r"}/>.
                        </p>}
                        ko={<p>
                            알고리즘은 <InlineMath math={"k = r = \\min\\{n, m\\}"}/>에서 멈춘다. 그 차수의
                            left zeroed 행렬은 Definition 4.19에 의해 항등적으로 0이므로{" "}
                            <InlineMath math={"A_r = 0"}/>이고, 따라서{" "}
                            <InlineMath math={"P_rA = L_rU_r"}/>이다.
                        </p>}
                    />
                </Proof>
            </Theorem>
            <T
                en={<p>
                    In practice the pivot is not merely required to be non-zero, it is chosen to be the
                    largest available. That is <strong>partial pivoting</strong>, and it keeps every entry of{" "}
                    <InlineMath math={"L"}/> at most one in magnitude so that rounding errors are not
                    amplified as the elimination moves down the matrix. Step through it.
                </p>}
                ko={<p>
                    실제로는 피벗이 0만 아니면 되는 것이 아니라, 남은 것 중 가장 큰 것을 고른다. 그것이{" "}
                    <strong>partial pivoting</strong>이고, <InlineMath math={"L"}/>의 성분을 전부 크기 1
                    이하로 묶어 소거가 아래로 내려가는 동안 반올림 오차가 증폭되지 않게 한다. 한 걸음씩
                    따라가 보자.
                </p>}
            />
            <CanvasFigure label={t("Gaussian elimination with partial pivoting, one action at a time",
                "부분 피벗을 쓰는 가우스 소거, 한 동작씩")}
                          modal={<LuPivotSteps width={820}/>}
                          bodyClassName="w-[min(94vw,860px)]">
                <LuPivotSteps/>
            </CanvasFigure>
            <Proposition title={<T en={<>Solving Ax = b via LU factorization</>} ko={<>LU 분해로 Ax = b 풀기</>}/>}>
                <T
                    en={<p>
                        Because <InlineMath math={"P^\\top P = I"}/>, we have{" "}
                        <InlineMath math={"\\det(P) = \\pm 1"}/> and{" "}
                        <InlineMath math={"P"}/> is always invertible. Hence
                    </p>}
                    ko={<p>
                        <InlineMath math={"P^\\top P = I"}/>이므로{" "}
                        <InlineMath math={"\\det(P) = \\pm 1"}/>이고{" "}
                        <InlineMath math={"P"}/>는 늘 가역이다. 따라서
                    </p>}
                />
                <BlockMath math={"Ax = b \\iff P\\!\\cdot\\!Ax = P\\!\\cdot\\!b \\iff L\\!\\cdot\\!Ux = P\\!\\cdot\\!b"}/>
                <Terms items={[
                    ["P \\cdot b", <T en={<>the right-hand side reordered the same way the rows of <InlineMath math={"A"}/> were</>}
                                     ko={<><InlineMath math={"A"}/>의 행이 그랬던 것과 똑같이 순서를 바꾼 우변</>}/>],
                ]}/>
                <T
                    en={<p>
                        Setting <InlineMath math={"Ux = y"}/> splits this into two triangular problems:
                    </p>}
                    ko={<p>
                        <InlineMath math={"Ux = y"}/>로 두면 이것이 삼각 문제 둘로 갈라진다.
                    </p>}
                />
                <BlockMath math={"Ly = P \\cdot b \\quad \\text{(forward substitution)}, \\qquad Ux = y \\quad \\text{(back substitution)}"}/>
                <Terms items={[
                    ["y", <T en={<>an intermediate vector with no meaning of its own; it exists only to split one hard solve into two easy ones</>}
                             ko={<>그 자체로는 뜻이 없는 중간 벡터. 어려운 풀이 하나를 쉬운 둘로 쪼개기 위해서만 존재한다</>}/>],
                    ["\\det A", <T en={<>equal to <InlineMath math={"\\pm\\det(L)\\det(U) = \\pm\\det(U)"}/>, since <InlineMath math={"L"}/> has ones on its diagonal, so the determinant is a by-product</>}
                                  ko={<><InlineMath math={"\\pm\\det(L)\\det(U) = \\pm\\det(U)"}/>과 같다. <InlineMath math={"L"}/>의 대각이 전부 1이기 때문이다. 행렬식은 덤으로 나온다</>}/>],
                ]}/>
                <T
                    en={<p>
                        <InlineMath math={"A"}/> is invertible if and only if both{" "}
                        <InlineMath math={"L"}/> and <InlineMath math={"U"}/> are. The factorization costs
                        about <InlineMath math={"n^3/3"}/> and each substitution about{" "}
                        <InlineMath math={"n^2/2"}/>, so once <InlineMath math={"A"}/> has been factored
                        every additional right-hand side is nearly free. That is why a robot solving the same
                        system every control cycle factors once and substitutes forever.
                    </p>}
                    ko={<p>
                        <InlineMath math={"A"}/>가 가역인 것은 <InlineMath math={"L"}/>과{" "}
                        <InlineMath math={"U"}/>가 둘 다 가역인 것과 동치다. 분해에는{" "}
                        <InlineMath math={"n^3/3"}/>쯤, 대입 한 번에는 <InlineMath math={"n^2/2"}/>쯤이 드니,{" "}
                        <InlineMath math={"A"}/>를 한 번 분해해 두면 우변이 늘어나는 비용은 거의 공짜다. 매
                        제어 주기마다 같은 계를 푸는 로봇이 분해는 한 번만 하고 대입만 반복하는 이유가
                        그것이다.
                    </p>}
                />
            </Proposition>
            <Example n="4.23" title={<T en={<>Solving a system with LU, end to end</>} ko={<>LU로 계를 끝까지 풀기</>}/>}>
                <BlockMath math={"\\begin{bmatrix}-2 & -4 & -6\\\\ -2 & 1 & -4\\\\ -2 & 11 & -4\\end{bmatrix}\\begin{bmatrix}x_1\\\\ x_2\\\\ x_3\\end{bmatrix} = \\begin{bmatrix}2\\\\ 3\\\\ -7\\end{bmatrix}"}/>
                <Terms items={[
                    ["A", <T en={<>square and invertible; load it as the <strong>Example 4.23</strong> preset in the figure above to watch the factorization form</>}
                             ko={<>정방이고 가역이다. 위 그림에서 <strong>Example 4.23</strong> 프리셋을 누르면 분해가 만들어지는 과정을 볼 수 있다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The native LU routine in Julia returns a factorization with{" "}
                        <InlineMath math={"P"}/> swapping rows 2 and 3. This matrix admits an LU
                        factorization without any permutation, but the library inserts one anyway, because on
                        large problems partial pivoting is what keeps the answer accurate. Use it as given:
                    </p>}
                    ko={<p>
                        Julia의 기본 LU 루틴은 2행과 3행을 바꾸는 <InlineMath math={"P"}/>가 붙은 분해를
                        돌려준다. 이 행렬은 순열 없이도 LU 분해가 되지만 라이브러리는 그래도 하나를 끼워
                        넣는다. 큰 문제에서 답을 정확하게 지키는 것이 partial pivoting이기 때문이다. 준 대로
                        쓰자.
                    </p>}
                />
                <BlockMath math={"L = \\begin{bmatrix}1 & 0 & 0\\\\ 1 & 1 & 0\\\\ 1 & \\tfrac13 & 1\\end{bmatrix}, \\qquad U = \\begin{bmatrix}-2 & -4 & -6\\\\ 0 & 15 & 2\\\\ 0 & 0 & \\tfrac43\\end{bmatrix}"}/>
                <Terms items={[
                    ["L", <T en={<>the multipliers: row 2 of <InlineMath math={"PA"}/> needed one copy of row 1 removed, row 3 needed one copy of row 1 and a third of row 2</>}
                             ko={<>배수들. <InlineMath math={"PA"}/>의 2행은 1행 한 배를, 3행은 1행 한 배와 2행 1/3배를 덜어 내야 했다</>}/>],
                    ["U", <T en={<>upper triangular with <InlineMath math={"\\det U = -2 \\cdot 15 \\cdot \\tfrac43 = -40"}/>, so <InlineMath math={"\\det A = \\pm 40"}/></>}
                             ko={<>upper triangular이고 <InlineMath math={"\\det U = -2 \\cdot 15 \\cdot \\tfrac43 = -40"}/>이므로 <InlineMath math={"\\det A = \\pm 40"}/>이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Reorder the right-hand side to{" "}
                        <InlineMath math={"Pb = (2, -7, 3)^\\top"}/> and run forward substitution on{" "}
                        <InlineMath math={"Ly = Pb"}/>. That is the very system worked out under Proposition
                        4.17, giving <InlineMath math={"y = (2, -9, 4)^\\top"}/>. Now back substitute:
                    </p>}
                    ko={<p>
                        우변을 <InlineMath math={"Pb = (2, -7, 3)^\\top"}/>으로 다시 늘어놓고{" "}
                        <InlineMath math={"Ly = Pb"}/>에 forward substitution을 한다. Proposition 4.17
                        아래에서 이미 풀어 둔 바로 그 계이고, 답은{" "}
                        <InlineMath math={"y = (2, -9, 4)^\\top"}/>이다. 이제 back substitution이다.
                    </p>}
                />
                <BlockMath math={"\\begin{aligned} \\tfrac43 x_3 &= 4 &&\\implies\\quad x_3 = 3 \\\\ 15x_2 + 2(3) &= -9 &&\\implies\\quad x_2 = -1 \\\\ -2x_1 - 4(-1) - 6(3) &= 2 &&\\implies\\quad x_1 = -8 \\end{aligned}"}/>
                <Terms items={[
                    ["x_3", <T en={<>from the last row, which has one unknown</>}
                              ko={<>미지수가 하나뿐인 마지막 행에서 나온다</>}/>],
                    ["x = (-8, -1, 3)^\\top", <T en={<>substitute back into the original system to check: the three rows give <InlineMath math={"2, 3, -7"}/></>}
                                                ko={<>원래 계에 대입해 확인하면 세 행이 <InlineMath math={"2, 3, -7"}/>을 준다</>}/>],
                ]}/>
                <T
                    en={<p>
                        No inverse was formed anywhere. Two triangular passes over a three by three system,
                        and the arithmetic is small enough to do on paper.
                    </p>}
                    ko={<p>
                        어디에서도 역행렬을 만들지 않았다. <InlineMath math={"3 \\times 3"}/> 계 위로 삼각
                        대입 두 번이고, 산술은 종이 위에서
                        할 수 있을 만큼 작다.
                    </p>}
                />
            </Example>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Cholesky Factorization</h2>} ko={<h2>Cholesky 분해</h2>}/>
            <T
                en={<p>
                    Run LU on a symmetric matrix and the result is not symmetric, which is a waste: half the
                    work reproduced information the other half already had. The repair is to peel with row and
                    column operations at the same time, so the leftover block stays symmetric all the way
                    down. The notes call the result the LDLT factorization, and it is also called the Cholesky
                    factorization.
                </p>}
                ko={<p>
                    대칭 행렬에 LU를 돌리면 결과는 대칭이 아니다. 낭비다. 절반의 일이 나머지 절반이 이미 가진
                    정보를 다시 만들어 낸다. 고치는 방법은 행 연산과 열 연산을 동시에 걸어 벗기는 것이다. 그러면
                    남는 블록이 끝까지 대칭으로 유지된다. 교재는 그 결과를 LDLT 분해라 부르고, Cholesky 분해라고도
                    한다.
                </p>}
            />
            <Theorem title={<T en={<>LDLT for positive semidefinite matrices</>}
                               ko={<>positive semidefinite 행렬의 LDLT</>}/>}>
                <T
                    en={<p>
                        A real positive semidefinite matrix <InlineMath math={"M"}/> always has an{" "}
                        <strong>LDLT factorization</strong>, also known as a{" "}
                        <strong>Cholesky factorization</strong>:
                    </p>}
                    ko={<p>
                        실수 positive semidefinite 행렬 <InlineMath math={"M"}/>은 언제나{" "}
                        <strong>LDLT 분해</strong>를 갖는다. <strong>Cholesky 분해</strong>라고도 부른다.
                    </p>}
                />
                <BlockMath math={"P \\cdot M \\cdot P^\\top = L \\cdot D \\cdot L^\\top"}/>
                <Terms items={[
                    ["P", <T en={<>a row permutation matrix; <InlineMath math={"P^\\top"}/> on the right permutes the columns the same way, which is what preserves symmetry</>}
                             ko={<>행 순열 행렬. 오른쪽의 <InlineMath math={"P^\\top"}/>이 열을 같은 방식으로 바꾸고, 그것이 대칭성을 지킨다</>}/>],
                    ["L", <T en={<>uni-lower triangular, so <InlineMath math={"L^\\top"}/> is uni-upper triangular</>}
                             ko={<>uni-lower triangular. 따라서 <InlineMath math={"L^\\top"}/>은 uni-upper triangular다</>}/>],
                    ["D", <T en={<>diagonal with non-negative entries; the LDLT name comes from <InlineMath math={"L, D, L"}/> with T short for transpose</>}
                             ko={<>성분이 전부 0 이상인 대각 행렬. LDLT라는 이름은 <InlineMath math={"L, D, L"}/>에 transpose의 T를 붙인 것이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        If <InlineMath math={"M = A^\\top A"}/>, then the number of non-zero entries on the
                        diagonal of <InlineMath math={"D"}/> equals{" "}
                        <InlineMath math={"\\operatorname{rank}(A)"}/>. That is a second route to the rank,
                        much cheaper than an SVD, though with none of its information about how close the
                        rank is to dropping.
                    </p>}
                    ko={<p>
                        <InlineMath math={"M = A^\\top A"}/>이면 <InlineMath math={"D"}/>의 대각에서 0이 아닌
                        성분의 개수가 <InlineMath math={"\\operatorname{rank}(A)"}/>와 같다. rank로 가는 두
                        번째 길이고 SVD보다 훨씬 싸다. 다만 rank가 떨어지기까지 얼마나 가까운지에 대해서는
                        아무것도 말해 주지 않는다.
                    </p>}
                />
            </Theorem>
            <Remark n="4.24" title={<T en={<>When permutations appear, definiteness has already failed</>}
                                       ko={<>순열이 나타났다면 definiteness는 이미 깨진 것이다</>}/>}>
                <T
                    en={<p>
                        Permutations in the LU factorization only arise in Case 3 of Lemma 4.21, the case
                        where the pivot came out zero. Chapter 3's theorem on Schur complements can be used to
                        show that if Case 2 or Case 3 ever occurs, then <InlineMath math={"M"}/> is not
                        positive definite. Hence for positive definite matrices a simpler factorization is
                        possible: no permutation at all.
                    </p>}
                    ko={<p>
                        LU 분해에서 순열은 Lemma 4.21의 경우 3, 곧 피벗이 0으로 나온 경우에만 생긴다. 3장의
                        Schur complement 정리를 쓰면, 경우 2나 경우 3이 한 번이라도 일어나면{" "}
                        <InlineMath math={"M"}/>이 positive definite가 아님을 보일 수 있다. 따라서 positive
                        definite 행렬에는 더 단순한 분해가 가능하다. 순열이 아예 없는 분해다.
                    </p>}
                />
                <BlockMath math={"M = L \\cdot D \\cdot L^\\top, \\qquad D \\text{ diagonal with strictly positive entries}"}/>
                <Terms items={[
                    ["D > 0", <T en={<>every diagonal entry strictly positive, which is both the conclusion and, read the other way, the test</>}
                                ko={<>대각 성분이 전부 양수. 결론이면서, 뒤집어 읽으면 판정 기준이기도 하다</>}/>],
                    ["\\text{no } P", <T en={<>positive definiteness guarantees the pivot is never zero, so the elimination never needs to look elsewhere</>}
                                        ko={<>positive definite이면 피벗이 0이 되는 일이 없으므로, 소거가 다른 곳을 뒤질 필요가 없다</>}/>],
                ]}/>
            </Remark>
            <T
                en={<p>
                    Read the last statement backwards and it becomes an algorithm for testing definiteness.
                    Peel the matrix, and if every pivot comes out positive, the matrix is positive definite. If
                    one comes out negative, it is indefinite, and you know at which step and in which
                    direction. This is far cheaper than computing eigenvalues, and it is the reason a
                    Cholesky factorization failing is a meaningful alarm rather than a numerical annoyance.
                </p>}
                ko={<p>
                    마지막 진술을 거꾸로 읽으면 definiteness 판정 알고리즘이 된다. 행렬을 벗겨 나가면서 피벗이
                    전부 양수로 나오면 positive definite다. 하나가 음수로 나오면 indefinite이고, 어느 단계에서
                    어느 방향으로 그런지까지 알게 된다. 고윳값을 구하는 것보다 훨씬 싸고, Cholesky 분해의 실패가
                    수치적 성가심이 아니라 의미 있는 경보인 이유가 이것이다.
                </p>}
            />
            <CanvasFigure label={t("Peeling a symmetric matrix, and reading definiteness off the pivots",
                "대칭 행렬을 벗기며 피벗에서 definiteness를 읽기")}
                          modal={<CholeskySteps width={820}/>}
                          bodyClassName="w-[min(94vw,860px)]">
                <CholeskySteps/>
            </CanvasFigure>
            <Example title={<T en={<>An LDLT with integers throughout</>} ko={<>끝까지 정수로 떨어지는 LDLT</>}/>}>
                <T
                    en={<p>
                        Take the symmetric matrix below and peel it. The first pivot is{" "}
                        <InlineMath math={"d_1 = 4"}/>, and dividing the first column by it gives the
                        multipliers <InlineMath math={"c = (1, \\tfrac12, -\\tfrac12)^\\top"}/>.
                    </p>}
                    ko={<p>
                        아래 대칭 행렬을 놓고 벗겨 보자. 첫 피벗은 <InlineMath math={"d_1 = 4"}/>이고, 첫 열을
                        그것으로 나누면 배수{" "}
                        <InlineMath math={"c = (1, \\tfrac12, -\\tfrac12)^\\top"}/>이 나온다.
                    </p>}
                />
                <BlockMath math={"M = \\begin{bmatrix}4 & 2 & -2\\\\ 2 & 5 & -1\\\\ -2 & -1 & 5\\end{bmatrix}, \\qquad M - d_1 cc^\\top = \\begin{bmatrix}0 & 0 & 0\\\\ 0 & 4 & 0\\\\ 0 & 0 & 4\\end{bmatrix}"}/>
                <Terms items={[
                    ["d_1 cc^\\top", <T en={<>a symmetric rank-one matrix, so subtracting it clears a row and a column at once and leaves a symmetric block behind</>}
                                       ko={<>대칭인 rank 1 행렬. 빼면 행과 열이 한꺼번에 지워지고 남는 블록도 대칭이다</>}/>],
                    ["\\begin{bmatrix}4 & 0\\\\ 0 & 4\\end{bmatrix}", <T en={<>the Schur complement of the first entry, which Chapter 3 already met under that name</>}
                                                                        ko={<>첫 성분에 대한 Schur complement. 3장이 이미 그 이름으로 만난 것이다</>}/>],
                ]}/>
                <T
                    en={<p>
                        The remaining block is already diagonal, so{" "}
                        <InlineMath math={"d_2 = d_3 = 4"}/> and the next two multiplier columns are
                        standard basis vectors. Assembling:
                    </p>}
                    ko={<p>
                        남은 블록이 이미 대각이므로 <InlineMath math={"d_2 = d_3 = 4"}/>이고, 다음 두 배수 열은
                        표준 기저 벡터다. 모아 보면
                    </p>}
                />
                <BlockMath math={"L = \\begin{bmatrix}1 & 0 & 0\\\\ \\tfrac12 & 1 & 0\\\\ -\\tfrac12 & 0 & 1\\end{bmatrix}, \\qquad D = \\operatorname{diag}(4, 4, 4), \\qquad M = LDL^\\top"}/>
                <Terms items={[
                    ["L", <T en={<>its columns are exactly the multiplier vectors, one per pivot</>}
                             ko={<>열이 정확히 배수 벡터들이다. 피벗 하나에 열 하나</>}/>],
                    ["D", <T en={<>all three entries positive, so <InlineMath math={"M"}/> is positive definite; the eigenvalues are <InlineMath math={"2, 4, 8"}/>, though we never needed them</>}
                             ko={<>세 성분 모두 양수이므로 <InlineMath math={"M"}/>은 positive definite다. 고윳값은 <InlineMath math={"2, 4, 8"}/>인데, 구할 필요가 없었다</>}/>],
                ]}/>
                <T
                    en={<p>
                        When every entry of <InlineMath math={"D"}/> is positive its square root is real, and
                        folding it into <InlineMath math={"L"}/> gives the form most libraries return:
                    </p>}
                    ko={<p>
                        <InlineMath math={"D"}/>의 성분이 전부 양수이면 제곱근이 실수이고, 그것을{" "}
                        <InlineMath math={"L"}/>에 흡수시키면 대부분의 라이브러리가 돌려주는 형태가 된다.
                    </p>}
                />
                <BlockMath math={"G := L D^{1/2} = \\begin{bmatrix}2 & 0 & 0\\\\ 1 & 2 & 0\\\\ -1 & 0 & 2\\end{bmatrix}, \\qquad M = GG^\\top"}/>
                <Terms items={[
                    ["D^{1/2}", <T en={<>the diagonal matrix of square roots, here <InlineMath math={"\\operatorname{diag}(2, 2, 2)"}/>; it is real precisely because <InlineMath math={"M"}/> is positive definite</>}
                                  ko={<>제곱근으로 이루어진 대각 행렬. 여기서는 <InlineMath math={"\\operatorname{diag}(2, 2, 2)"}/>다. <InlineMath math={"M"}/>이 positive definite이기 때문에 실수다</>}/>],
                    ["G", <T en={<>the Cholesky factor, sometimes called a matrix square root of <InlineMath math={"M"}/>; check <InlineMath math={"GG^\\top"}/> entry by entry and it returns <InlineMath math={"M"}/></>}
                             ko={<>Cholesky 인자. <InlineMath math={"M"}/>의 행렬 제곱근이라고도 한다. <InlineMath math={"GG^\\top"}/>을 성분별로 확인하면 <InlineMath math={"M"}/>이 나온다</>}/>],
                ]}/>
                <T
                    en={<p>
                        Now break it. Change the corner entry from{" "}
                        <InlineMath math={"5"}/> to <InlineMath math={"0"}/> in the figure above and the
                        third pivot goes negative: the matrix is indefinite and the peel says so at the exact
                        step where it stops working. The leading minors readout is the same test in Chapter
                        3's language, since the product of the first{" "}
                        <InlineMath math={"k"}/> pivots is the <InlineMath math={"k"}/>-th leading principal
                        minor.
                    </p>}
                    ko={<p>
                        이제 망가뜨려 보자. 위 그림에서 모서리 성분을 <InlineMath math={"5"}/>에서{" "}
                        <InlineMath math={"0"}/>으로 바꾸면 세 번째 피벗이 음수가 된다. 이 행렬은
                        indefinite이고, 벗기기가 바로 그 지점에서 그렇다고 말해 준다. 선행 주소행렬식 판독 줄은
                        같은 판정을 3장의 언어로 적은 것이다. 처음 <InlineMath math={"k"}/>개 피벗의 곱이{" "}
                        <InlineMath math={"k"}/>번째 선행 주소행렬식이기 때문이다.
                    </p>}
                />
            </Example>

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>Why Robotics</h2>} ko={<h2>로봇에서 왜 필요한가</h2>}/>
            <T
                en={<p>
                    Chapter 3 gave the robot its equations. This chapter is what actually runs when they are
                    solved, and the failure modes below are the ones that show up in logs rather than in
                    proofs.
                </p>}
                ko={<p>
                    3장은 로봇에게 방정식을 주었다. 이 장은 그 방정식을 풀 때 실제로 돌아가는 것이고, 아래의
                    실패 양상들은 증명이 아니라 로그에 나타나는 것들이다.
                </p>}
            />
            <T
                en={<ul>
                    <li>
                        <strong>A least squares solver that forms the Gram matrix is a bug waiting for a
                            badly scaled problem.</strong> Calibration and bundle adjustment routinely
                        produce design matrices with condition numbers in the thousands, and the figure in
                        the QR section shows what squaring that does. Solve through{" "}
                        <InlineMath math={"R\\hat{x} = Q^\\top b"}/>, or through the SVD if you also want
                        the rank. The rule of thumb is that a solver reporting a suspiciously clean answer on
                        a nearly dependent problem is not to be trusted.
                    </li>
                    <li>
                        <strong>Singular values are the manipulability of an arm.</strong> Feed the Jacobian{" "}
                        <InlineMath math={"J"}/> to Theorem 4.7 and the singular values say how much end
                        effector velocity each unit of joint velocity buys, direction by direction. A small{" "}
                        <InlineMath math={"\\sigma_{\\min}"}/> is a kinematic singularity approaching, and by
                        the numerical rank theorem it is also the exact distance to one. The damped least
                        squares controller that everyone writes near a singularity is nothing but replacing{" "}
                        <InlineMath math={"1/\\sigma_i"}/> with{" "}
                        <InlineMath math={"\\sigma_i/(\\sigma_i^2 + \\lambda^2)"}/> in the SVD expansion of
                        the pseudo-inverse.
                    </li>
                    <li>
                        <strong>Numerical rank is a decision about sensor geometry.</strong> A calibration
                        rig that never rotates about one axis leaves that direction unobservable, and the
                        matrix does not come back exactly rank deficient, it comes back with one tiny
                        singular value. Where you place <InlineMath math={"\\delta"}/> decides whether the
                        estimator refuses to identify that parameter or fits it to noise and reports a
                        confident wrong number. Both are choices; only one of them is usually made
                        deliberately.
                    </li>
                    <li>
                        <strong>Low-rank truncation is how a map stays small.</strong> Descriptor matrices,
                        occupancy grids, and covariance blocks are all compressible in exactly the sense of
                        Remark 4.11, and the theorem tells you the error before you commit to the
                        truncation. Keeping <InlineMath math={"k"}/> terms of an{" "}
                        <InlineMath math={"n \\times m"}/> matrix stores{" "}
                        <InlineMath math={"k(n + m + 1)"}/> numbers instead of{" "}
                        <InlineMath math={"nm"}/>.
                    </li>
                    <li>
                        <strong>Factor once, substitute every cycle.</strong> A controller that solves the
                        same <InlineMath math={"Ax = b"}/> at 1 kHz with a fixed{" "}
                        <InlineMath math={"A"}/> should pay the <InlineMath math={"n^3/3"}/> once and{" "}
                        <InlineMath math={"n^2"}/> thereafter. Calling a generic solve inside the loop
                        re-factors the same matrix a thousand times a second, and it is one of the most
                        common reasons a control loop misses its deadline for no visible algorithmic reason.
                    </li>
                    <li>
                        <strong>Cholesky is the covariance workhorse in Chapter 5.</strong> Sampling
                        correlated Gaussian noise is <InlineMath math={"x = \\mu + Gz"}/> with{" "}
                        <InlineMath math={"z"}/> standard normal and{" "}
                        <InlineMath math={"GG^\\top = \\Sigma"}/>, which is exactly the factor computed
                        above. Square root filters propagate <InlineMath math={"G"}/> instead of{" "}
                        <InlineMath math={"\\Sigma"}/> precisely so that the covariance cannot go indefinite
                        through rounding, since <InlineMath math={"GG^\\top"}/> is positive semidefinite by
                        construction no matter what <InlineMath math={"G"}/> holds.
                    </li>
                    <li>
                        <strong>A failed Cholesky is a diverged filter, not a numerical hiccup.</strong> A
                        covariance that has drifted to indefinite means the estimator now claims negative
                        variance in some direction. Remark 4.24 says the peel discovers this at a specific
                        step, so the failing pivot names the direction. That is a far more useful alarm than
                        a solver returning NaN three frames later.
                    </li>
                </ul>}
                ko={<ul>
                    <li>
                        <strong>Gram 행렬을 만드는 최소제곱 솔버는 조건이 나쁜 문제를 기다리는 버그다.</strong>{" "}
                        캘리브레이션과 bundle adjustment는 조건수가 수천에 이르는 설계 행렬을 예사로 만들어
                        내고, QR 절의 그림이 그것을 제곱하면 무슨 일이 벌어지는지 보여 준다.{" "}
                        <InlineMath math={"R\\hat{x} = Q^\\top b"}/>를 거쳐 풀거나, rank까지 알고 싶다면
                        SVD로 풀어야 한다. 거의 종속인 문제에서 수상하게 깔끔한 답을 내놓는 솔버는 믿지 않는
                        것이 요령이다.
                    </li>
                    <li>
                        <strong>특이값이 곧 팔의 manipulability다.</strong> 자코비안{" "}
                        <InlineMath math={"J"}/>를 Theorem 4.7에 넣으면, 특이값이 관절 속도 한 단위가 방향마다
                        말단 속도를 얼마나 사 주는지 말해 준다.{" "}
                        <InlineMath math={"\\sigma_{\\min}"}/>이 작다는 것은 kinematic singularity가
                        다가온다는 뜻이고, 수치적 rank 정리에 따르면 그것까지의 정확한 거리이기도 하다.
                        singularity 근처에서 다들 쓰는 damped least squares 제어기는, 유사역행렬의 SVD
                        전개에서 <InlineMath math={"1/\\sigma_i"}/>를{" "}
                        <InlineMath math={"\\sigma_i/(\\sigma_i^2 + \\lambda^2)"}/>로 바꿔 끼운 것에 지나지
                        않는다.
                    </li>
                    <li>
                        <strong>수치적 rank는 센서 기하에 대한 결정이다.</strong> 한 축으로는 한 번도 돌지
                        않는 캘리브레이션 장치는 그 방향을 관측 불가능하게 남긴다. 그때 행렬은 정확히 rank가
                        모자란 채로 돌아오지 않고, 아주 작은 특이값 하나를 달고 돌아온다.{" "}
                        <InlineMath math={"\\delta"}/>를 어디에 두느냐가, 추정기가 그 파라미터의 식별을
                        거부할지 아니면 잡음에 맞춰 놓고 자신 있게 틀린 수를 보고할지를 정한다. 둘 다 선택인데,
                        보통 의도적으로 내려지는 쪽은 하나뿐이다.
                    </li>
                    <li>
                        <strong>저계수 절단이 지도를 작게 유지하는 방법이다.</strong> descriptor 행렬,
                        점유 격자, 공분산 블록은 전부 Remark 4.11이 말하는 바로 그 뜻에서 압축 가능하고,
                        정리는 절단을 결정하기 전에 오차가 얼마인지 알려 준다.{" "}
                        <InlineMath math={"n \\times m"}/> 행렬에서 <InlineMath math={"k"}/>개 항을 남기면{" "}
                        <InlineMath math={"nm"}/> 대신 <InlineMath math={"k(n + m + 1)"}/>개의 수를 저장한다.
                    </li>
                    <li>
                        <strong>분해는 한 번, 대입은 매 주기.</strong> 고정된{" "}
                        <InlineMath math={"A"}/>로 같은 <InlineMath math={"Ax = b"}/>를 1 kHz로 푸는
                        제어기는 <InlineMath math={"n^3/3"}/>을 한 번만 치르고 그다음부터는{" "}
                        <InlineMath math={"n^2"}/>만 치러야 한다. 루프 안에서 범용 solve를 부르면 같은 행렬을
                        초당 천 번 다시 분해하게 되고, 알고리즘상 눈에 띄는 이유 없이 제어 루프가 마감을 놓치는
                        가장 흔한 원인 가운데 하나가 이것이다.
                    </li>
                    <li>
                        <strong>Cholesky는 5장의 공분산 일꾼이다.</strong> 상관된 가우시안 잡음을 뽑는 일은{" "}
                        <InlineMath math={"z"}/>가 표준 정규이고{" "}
                        <InlineMath math={"GG^\\top = \\Sigma"}/>일 때{" "}
                        <InlineMath math={"x = \\mu + Gz"}/>인데, 그 <InlineMath math={"G"}/>가 위에서
                        계산한 인자 그대로다. square root filter가{" "}
                        <InlineMath math={"\\Sigma"}/> 대신 <InlineMath math={"G"}/>를 전파하는 이유도
                        정확히 그것이다. <InlineMath math={"G"}/>에 무엇이 들어 있든{" "}
                        <InlineMath math={"GG^\\top"}/>은 구성상 positive semidefinite이므로, 반올림으로
                        공분산이 indefinite로 흘러갈 수가 없다.
                    </li>
                    <li>
                        <strong>Cholesky 실패는 수치적 딸꾹질이 아니라 발산한 필터다.</strong> indefinite로
                        흘러간 공분산은 추정기가 어떤 방향에서 분산이 음수라고 주장하고 있다는 뜻이다. Remark
                        4.24는 벗기기가 이것을 특정 단계에서 발견한다고 말하므로, 실패한 피벗이 그 방향의
                        이름을 알려 준다. 세 프레임 뒤에 솔버가 NaN을 돌려주는 것보다 훨씬 쓸모 있는 경보다.
                    </li>
                </ul>}
            />

            {/* ------------------------------------------------------------------ */}
            <T en={<h2>References</h2>} ko={<h2>References</h2>}/>
            <ul>
                <li>
                    Jessy W. Grizzle, <em>ROB 501: Mathematics for Robotics</em>, University of Michigan,
                    2022. Chapter 4.{" "}
                    <a href={COURSE} target="_blank" rel="noopener noreferrer">{t("Course page", "코스 페이지")}</a>
                    {" · "}
                    <a href={NOTES_REPO} target="_blank" rel="noopener noreferrer">michiganrobotics/rob501</a>
                </li>
                <li>
                    <a href={TREFETHEN} target="_blank" rel="noopener noreferrer">
                        Lloyd N. Trefethen and David Bau III, <em>Numerical Linear Algebra</em>
                    </a>
                    {" · "}
                    {t("Lectures 4 and 5 for the SVD, 7 to 10 for QR and why Householder replaces Gram-Schmidt, 18 and 19 for conditioning",
                        "SVD는 4강과 5강, QR과 Householder가 Gram-Schmidt를 대신하는 이유는 7강부터 10강, conditioning은 18강과 19강")}
                </li>
                <li>
                    <a href={GOLUB} target="_blank" rel="noopener noreferrer">
                        Gene H. Golub and Charles F. Van Loan, <em>Matrix Computations</em>
                    </a>
                    {" · "}
                    {t("the reference implementation of every algorithm in this chapter, with error analyses",
                        "이 장의 모든 알고리즘에 대한 표준 구현과 오차 해석")}
                </li>
                <li>
                    <a href={ROB101} target="_blank" rel="noopener noreferrer">ROB 101: Computational Linear Algebra</a>
                    {" · "}
                    {t("the source of the LU material, including forward and back substitution in full",
                        "LU 내용의 출처. forward substitution과 back substitution도 빠짐없이 다룬다")}
                </li>
                <li>
                    <a href={CHOLESKY_WIKI} target="_blank" rel="noopener noreferrer">
                        Cholesky decomposition
                    </a>
                    {" · "}
                    {t("linked by the notes for the variants and the in-place algorithms",
                        "교재가 변형들과 제자리 알고리즘을 위해 걸어 둔 링크")}
                </li>
            </ul>
        </>
    );
};

export default Chapter4;
