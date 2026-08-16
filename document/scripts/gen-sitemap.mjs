// 빌드 전에 public/sitemap.xml 을 생성한다. 챕터 목록은 pages/chapters/index.ts 에서
// 읽으므로, 챕터를 추가하면 sitemap 도 자동으로 따라온다. 아직 본문이 없는 챕터
// (contents 필드가 없는 항목)는 빈 페이지가 색인되지 않도록 제외한다.
// 각 URL 에 en/ko hreflang 대체 링크를 함께 적는다.
import {readFileSync, writeFileSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://robotics-study.github.io";
const BASE = "/linear_algebra_to_kalman/";

const indexTs = readFileSync(join(root, "src/pages/chapters/index.ts"), "utf-8");
const chapters = indexTs
    .split(/\n\s*\{\s*\n\s*chapter:/)
    .slice(1)
    .filter((block) => /\bcontents:/.test(block))
    .map((block) => parseInt(block.match(/^\s*(\d+)/)[1]));

const url = (lang, chapter) => {
    const path = chapter !== undefined ? `chapter/${chapter}/` : "";
    const qs = lang === "ko" ? "?lang=ko" : "";
    return `${ORIGIN}${BASE}${path}${qs}`;
};

const esc = (s) => s.replaceAll("&", "&amp;");
const today = new Date().toISOString().slice(0, 10);

const entry = (lang, chapter, priority) => `  <url>
    <loc>${esc(url(lang, chapter))}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${esc(url("en", chapter))}"/>
    <xhtml:link rel="alternate" hreflang="ko" href="${esc(url("ko", chapter))}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(url("en", chapter))}"/>
  </url>`;

const entries = [
    entry("en", undefined, "1.0"),
    entry("ko", undefined, "1.0"),
    ...chapters.flatMap((n) => [entry("en", n, "0.8"), entry("ko", n, "0.8")]),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml);
console.log(`sitemap.xml: ${entries.length} URLs (chapters: ${chapters.join(", ") || "none yet"})`);
