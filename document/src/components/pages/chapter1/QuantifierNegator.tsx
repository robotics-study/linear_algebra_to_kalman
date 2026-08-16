import {ReactNode, useState} from "react";
import cn from "../../../libs/cn";
import {T, useTr} from "../../../libs/i18n";
import {BlockMath, InlineMath} from "../../math/Tex";

// 부정은 "안쪽 관계식만 뒤집는 것"이 아니라 앞의 quantifier까지 전부 뒤집는 일이다.
// 두 quantifier를 직접 바꿔 보게 하면, ¬∀ ⟺ ∃ 와 ¬∃ ⟺ ∀ 가 규칙이 아니라 관찰이 된다.
type Q = "forall" | "exists";

const flip = (q: Q): Q => (q === "forall" ? "exists" : "forall");

const epsPart = (q: Q) =>
    q === "forall" ? "\\forall\\, \\epsilon > 0,\\;" : "\\exists\\, \\epsilon > 0 \\text{ s.t. }";

const xPart = (q: Q) =>
    q === "forall" ? "\\forall\\, x \\in \\mathbb{Q},\\;" : "\\exists\\, x \\in \\mathbb{Q} \\text{ s.t. }";

const QuantifierNegator = () => {
    const t = useTr();
    const [qEps, setQEps] = useState<Q>("forall");
    const [qX, setQX] = useState<Q>("exists");

    const original = `${epsPart(qEps)}${xPart(qX)} |x - y| < \\epsilon`;
    const negated = `${epsPart(flip(qEps))}${xPart(flip(qX))} |x - y| \\ge \\epsilon`;

    const symbol = (q: Q) => (q === "forall" ? "∀" : "∃");

    // 말풀이 줄은 바로 위 KaTeX 줄과 나란히 읽히므로, 기호는 여기서도 KaTeX 를 거쳐야 한다.
    // 유니코드로 적으면 같은 ε 가 두 서체로 나와 두 줄이 서로 다른 문장처럼 보인다.
    const eps = <InlineMath math={"\\epsilon > 0"}/>;
    const rel = (r: "lt" | "ge") =>
        <InlineMath math={r === "lt" ? "|x - y| < \\epsilon" : "|x - y| \\ge \\epsilon"}/>;

    const wordFor = (qe: Q, qx: Q, r: "lt" | "ge"): ReactNode => (
        <T
            en={<>{qe === "forall" ? "for every " : "for some "}{eps},{" "}
                {qx === "forall" ? "every" : "some"} rational <InlineMath math={"x"}/> satisfies {rel(r)}</>}
            ko={<>{qe === "forall" ? <>모든 {eps}에 대해</> : <>어떤 {eps}이 있어서</>},{" "}
                {qx === "forall" ? "모든" : "어떤"} 유리수 <InlineMath math={"x"}/>가 {rel(r)}를 만족한다</>}
        />
    );

    const wordOriginal = wordFor(qEps, qX, "lt");
    const wordNegated = wordFor(flip(qEps), flip(qX), "ge");

    // 각 조합이 실제로 참인지 거짓인지까지 붙여 준다. 부정 규칙만 익히고 의미를 놓치는 것을 막는다.
    const e = <InlineMath math={"\\epsilon"}/>;
    const meaning: ReactNode = qEps === "forall"
        ? (qX === "exists"
            ? <T en={<>True for every real <InlineMath math={"y"}/>: the rationals are dense in the reals.
                This is the statement worth remembering.</>}
                 ko={<>모든 실수 <InlineMath math={"y"}/>에 대해 참이다. 유리수가 실수 안에 dense하다는
                     뜻이며, 기억해 둘 문장은 이것이다.</>}/>
            : <T en={<>False: shrink {e} and almost every rational falls outside.</>}
                 ko={<>거짓이다. {e}를 줄이면 거의 모든 유리수가 범위 밖으로 밀려난다.</>}/>)
        : (qX === "exists"
            ? <T en={<>Trivially true: pick a huge {e} and any rational at all.</>}
                 ko={<>자명하게 참이다. {e}를 크게 잡고 유리수 아무거나 고르면 된다.</>}/>
            : <T en={<>False for every real <InlineMath math={"y"}/>: no single {e} can hold every
                rational at once.</>}
                 ko={<>모든 실수 <InlineMath math={"y"}/>에 대해 거짓이다. 어떤 {e} 하나로 모든 유리수를
                     한꺼번에 담을 수는 없다.</>}/>);

    const Toggle = ({value, onChange, label}: {value: Q; onChange: (q: Q) => void; label: ReactNode}) => (
        <div className="flex items-center gap-1.5">
            <span className="text-muted">{label}</span>
            {(["forall", "exists"] as Q[]).map((q) => (
                <button key={q} type="button" onClick={() => onChange(q)}
                        className={cn("px-2.5 py-1 rounded border font-mono",
                            value === q ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                : "border-border text-muted hover:bg-surface")}>
                    {symbol(q)}
                </button>
            ))}
        </div>
    );

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs mb-1">
                <Toggle value={qEps} onChange={setQEps} label={<InlineMath math={"\\epsilon > 0"}/>}/>
                <Toggle value={qX} onChange={setQX} label={<InlineMath math={"x \\in \\mathbb{Q}"}/>}/>
            </div>

            <p className="text-xs text-muted text-center mt-3 mb-0"><InlineMath math={"p"}/></p>
            <BlockMath math={original}/>
            <p className="text-sm text-muted text-center -mt-2">{wordOriginal}</p>

            <p className="text-xs text-muted text-center mt-4 mb-0"><InlineMath math={"\\lnot p"}/></p>
            <BlockMath math={negated}/>
            <p className="text-sm text-muted text-center -mt-2">{wordNegated}</p>

            <p className="mt-4 text-sm text-center px-2">{meaning}</p>
            <p className="mt-1 text-xs text-muted text-center px-2">
                {t("Both quantifiers flip and the inner relation flips with them. Nothing else changes.",
                    "quantifier 둘이 모두 뒤집히고, 안쪽 관계식도 함께 뒤집힌다. 그 밖에는 아무것도 변하지 않는다.")}
            </p>
        </div>
    );
};

export default QuantifierNegator;
