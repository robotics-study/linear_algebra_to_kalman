import {ReactNode, useMemo} from "react";

// 의존성 없는 최소 syntax highlighter. 정확한 파서가 아니라 읽기 보조가 목적이라
// comment / string / keyword / number / 데코레이터만 구분한다.
// 색은 전역 CSS의 --tok-* 변수를 그대로 쓴다 (라이트/다크 자동 대응).
export type CodeLang = "python" | "matlab";

const KEYWORDS: Record<CodeLang, Set<string>> = {
    python: new Set([
        "def", "class", "return", "if", "elif", "else", "for", "while", "in", "not",
        "and", "or", "import", "from", "as", "with", "try", "except", "finally",
        "raise", "pass", "break", "continue", "lambda", "yield", "None", "True",
        "False", "is", "global", "nonlocal", "assert", "del", "async", "await", "self",
    ]),
    matlab: new Set([
        "function", "end", "if", "elseif", "else", "for", "while", "switch", "case",
        "otherwise", "break", "continue", "return", "try", "catch", "global",
        "persistent", "classdef", "properties", "methods", "arguments", "parfor",
        "spmd", "nargin", "nargout", "varargin", "varargout", "true", "false",
    ]),
};

// 언어별 마스터 토큰 정규식 — 순서가 우선순위다 (comment > string > number > word).
// MATLAB 의 작은따옴표는 char array 이자 transpose 연산자라, 식별자/닫는 괄호/숫자
// 바로 뒤에 오는 따옴표는 문자열 시작으로 보지 않는다 (A' 를 문자열로 삼키지 않도록).
const PATTERNS: Record<CodeLang, RegExp> = {
    python: /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?''')|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(@\w+)|(\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)|([A-Za-z_]\w*)/g,
    matlab: /(%\{[\s\S]*?%\}|%[^\n]*)|("(?:[^"\\\n]|\\.)*"|(?<![\w\])}.'])'(?:[^'\n]|'')*')|(\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)|([A-Za-z_]\w*)/g,
};

const STYLE: Record<string, string> = {
    comment: "var(--tok-comment)",
    string: "var(--tok-string)",
    keyword: "var(--tok-tag)",
    number: "var(--tok-expr)",
    meta: "var(--tok-attr)",       // 데코레이터
    func: "var(--tok-attr)",       // 호출/정의되는 함수 이름
    type: "var(--tok-expr)",       // PascalCase 타입
}

// 식별자 그룹 값 (python은 6번째, matlab은 4번째 캡처).
const wordOf = (match: RegExpExecArray, lang: CodeLang): string | undefined =>
    lang === "python" ? match[6] : match[4]

function classify(match: RegExpExecArray, lang: CodeLang, code: string): string | null {
    if (lang === "python") {
        const [, comment, triString, string, deco, num] = match
        if (comment) return "comment"
        if (triString) return "comment"   // docstring은 주석 취급이 읽기에 자연스럽다
        if (string) return "string"
        if (deco) return "meta"
        if (num) return "number"
    } else {
        const [, comment, string, num] = match
        if (comment) return "comment"
        if (string) return "string"
        if (num) return "number"
    }
    const word = wordOf(match, lang)
    if (!word) return null
    if (KEYWORDS[lang].has(word)) return "keyword"
    // 문맥 lookahead: 뒤가 '(' 면 함수 호출/정의로 본다.
    const rest = code.slice(match.index + match[0].length)
    if (/^\s*\(/.test(rest)) return "func"
    // PascalCase 타입 관례는 python 에만 적용한다 (MATLAB 은 대문자 변수명이 흔하다).
    if (lang === "python" && /^[A-Z]/.test(word)) return "type"
    return null
}

export function highlight(code: string, lang: CodeLang): ReactNode[] {
    const out: ReactNode[] = []
    const re = new RegExp(PATTERNS[lang].source, PATTERNS[lang].flags)
    let last = 0
    let key = 0
    for (let m = re.exec(code); m !== null; m = re.exec(code)) {
        if (m.index > last) out.push(code.slice(last, m.index))
        const cls = classify(m, lang, code)
        out.push(cls
            ? <span key={key++} style={{color: STYLE[cls]}}>{m[0]}</span>
            : m[0])
        last = m.index + m[0].length
    }
    if (last < code.length) out.push(code.slice(last))
    return out
}

const CodeHighlight = ({code, lang}: {code: string; lang: CodeLang}) => {
    const nodes = useMemo(() => highlight(code, lang), [code, lang])
    return <>{nodes}</>
}

export default CodeHighlight
