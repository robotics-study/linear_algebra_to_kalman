import {IChapterData} from "../../types/global";
import 'katex/dist/katex.min.css';
import chapters from "../pages/chapters";
import {useChapterNav} from "../libs/nav";
import {useLang, useTr, pick} from "../libs/i18n";

const ChapterContents = ({title, chapter, contents: Contents}: IChapterData) => {
    const {go} = useChapterNav()
    const {lang} = useLang()
    const t = useTr()

    const prev = chapters.find((c) => c.chapter === chapter - 1 && c.contents)
    const next = chapters.find((c) => c.chapter === chapter + 1 && c.contents)
    // 첫 챕터의 이전은 홈(랜딩) — chapter 0 을 홈 sentinel 로 쓴다.
    const homeTitle = {en: "Home", ko: "홈"}
    const prevTarget = prev ?? (chapter === 1 ? {chapter: 0, title: homeTitle} : undefined)

    return (
        <main className="content">
            <article className="content-inner">
                <p className="eyebrow">{t(`Chapter ${chapter}`, `${chapter}장`)}</p>
                <h1>{pick(lang, title)}</h1>

                {Contents ? <Contents/> : null}

                <nav className="pager">
                    {prevTarget
                        ? <a onClick={() => go(prevTarget.chapter || null)}>
                            <div className="dir">{t("← Prev", "← 이전")}</div>
                            <div className="ttl">{pick(lang, prevTarget.title)}</div>
                        </a>
                        : <span/>}
                    {next
                        ? <a className="next" onClick={() => go(next.chapter)}>
                            <div className="dir">{t("Next →", "다음 →")}</div>
                            <div className="ttl">{pick(lang, next.title)}</div>
                        </a>
                        : <span/>}
                </nav>
            </article>
        </main>
    )
}

export default ChapterContents
