import {Localized} from "../../../types/global";
import chapters from "../chapters";
import {CHAPTER_BLURBS, PARTS} from "../chapters/roadmap";
import BrandLogo from "../../components/BrandLogo";
import {useChapterNav} from "../../libs/nav";
import {useLang, useTr, pick} from "../../libs/i18n";

const REPO = "https://github.com/robotics-study/linear_algebra_to_kalman"

const ChapterCard = ({chapter, title, blurb, onOpen}: {
    chapter: number
    title: Localized
    blurb?: Localized
    onOpen: () => void
}) => {
    const {lang} = useLang()
    return (
        <div className="doc-card clickable" role="button" tabIndex={0}
             onClick={onOpen}
             onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}>
            <div className="dc-head">
                <span className="dc-num">{String(chapter).padStart(2, "0")}</span>
                <span className="dc-title">{pick(lang, title)}</span>
            </div>
            {blurb && <p className="dc-blurb">{pick(lang, blurb)}</p>}
        </div>
    )
}

const Home = () => {
    const {go} = useChapterNav()
    const {lang} = useLang()
    const t = useTr()
    const ready = chapters.filter((c) => c.contents)
    const first = ready[0]?.chapter ?? 1
    const blurbOf = (n: number) => CHAPTER_BLURBS.find((b) => b.n === n)?.blurb

    return (
        <main className="lander">
            <div className="lander-top">
                <BrandLogo size={54} gradId="lakLanderLogo"/>
                <h1>linear algebra<span className="wm-dim"> → kalman</span></h1>
                <p className="lander-sub">
                    {t("Mathematics for Robotics · ROB 501 study notes",
                        "Mathematics for Robotics · ROB 501 학습 노트")}
                </p>
                <div className="lander-chips">
                    <span className="chip">Proofs</span>
                    <span className="chip">Vector Spaces</span>
                    <span className="chip">Inner Products</span>
                    <span className="chip">Least Squares</span>
                    <span className="chip">SVD</span>
                    <span className="chip">Kalman Filter</span>
                    <span className="chip">Real Analysis</span>
                    <span className="chip">Optimization</span>
                </div>
                <div className="lander-btns">
                    <button className="btn btn-primary" onClick={() => go(first)}>{t("Start reading", "학습 시작")}</button>
                    <a className="btn btn-ghost" href={REPO} target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
            </div>

            <div className="lander-cats">
                {PARTS.map((part, pi) => {
                    const inPart = ready.filter(
                        (c) => c.chapter >= part.range[0] && c.chapter <= part.range[1])
                    // 집필된 챕터가 하나도 없는 파트는 빈 제목만 남으므로 아예 내보내지 않는다.
                    if (inPart.length === 0) return null
                    return (
                        <div key={part.title.en} className="lander-cat">
                            <div className="part-head">
                                <h3>
                                    <span className="part-index">{["I", "II", "III", "IV", "V"][pi]}</span>
                                    {pick(lang, part.title)}
                                </h3>
                                <p className="part-desc">{pick(lang, part.desc)}</p>
                            </div>
                            <div className="card-grid">
                                {inPart.map((c) => (
                                    <ChapterCard key={c.chapter} chapter={c.chapter} title={c.title}
                                                 blurb={blurbOf(c.chapter)}
                                                 onOpen={() => go(c.chapter)}/>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </main>
    )
}

export default Home
