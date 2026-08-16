import {Suspense, useCallback, useEffect, useMemo, useState} from "react";
import chapters from "./pages/chapters";
import {applyPageMeta, chapterMeta} from "./libs/seo";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Toc from "./components/Toc";
import Footer from "./components/Footer";
import Home from "./pages/home/Home";
import ChapterContents from "./components/ChapterContents";
import {BASE_PATH} from "./libs/url";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {useChapterNav} from "./libs/nav";
import cn from "./libs/cn";
import {LangProvider, useLang} from "./libs/i18n";

const PageSelector = () => {
    const {lang} = useLang()
    const {current: chapter} = useChapterNav()
    const [menuOpen, setMenuOpen] = useState(false)
    const closeMenu = useCallback(() => setMenuOpen(false), [])

    const current = useMemo(
        () => chapters.find((item) => item.chapter === chapter && item.contents),
        [chapter],
    )

    // 챕터 전환·언어 전환마다 제목·메타를 현재 뷰에 맞춘다 (SPA 이므로 크롤러/프리뷰용 갱신).
    useEffect(() => {
        applyPageMeta(chapterMeta(lang, current))
    }, [current, lang])

    return (
        <>
            <Header onMenu={() => setMenuOpen((o) => !o)} showMenu={!!current}/>
            {current ? (
                <>
                    <div className="layout">
                        <Sidebar open={menuOpen} onNavigate={closeMenu}/>
                        <Suspense fallback={
                            <main className="content">
                                <div className="grid place-items-center py-24 text-muted text-sm">Loading…</div>
                            </main>
                        }>
                            <ChapterContents {...current}/>
                        </Suspense>
                        <Toc chapter={current.chapter}/>
                    </div>
                    <div className={cn("backdrop", menuOpen && "open")} onClick={closeMenu}/>
                </>
            ) : (
                <Home/>
            )}
            <Footer/>
        </>
    )
}

const App = () => {
    return <BrowserRouter basename={BASE_PATH || "/"}
                          future={{v7_startTransition: true, v7_relativeSplatPath: true}}>
        <LangProvider>
            <Routes>
                <Route path={"/chapter/:n"} element={<PageSelector/>}/>
                {/* 그 밖의 모든 경로는 홈으로 (GitHub Pages 404 셸도 이 앱으로 부팅한다). */}
                <Route path={"*"} element={<PageSelector/>}/>
            </Routes>
        </LangProvider>
    </BrowserRouter>
}

export default App
