import {useState} from "react";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {BlockMath} from "../../math/Tex";

// 부정은 "안쪽 관계식만 뒤집는 것"이 아니라 앞의 quantifier까지 전부 뒤집는 일이다.
// 두 quantifier를 직접 바꿔 보게 하면, ¬∀ ⟺ ∃ 와 ¬∃ ⟺ ∀ 가 규칙이 아니라 관찰이 된다.
type Q = "forall" | "exists";

const flip = (q: Q): Q => (q === "forall" ? "exists" : "forall");

const epsPart = (q: Q) =>
    q === "forall" ? "\\forall\\, \\varepsilon > 0,\\;" : "\\exists\\, \\varepsilon > 0 \\text{ s.t. }";

const xPart = (q: Q) =>
    q === "forall" ? "\\forall\\, x \\in \\mathbb{Q},\\;" : "\\exists\\, x \\in \\mathbb{Q} \\text{ s.t. }";

const QuantifierNegator = () => {
    const t = useTr();
    const [qEps, setQEps] = useState<Q>("forall");
    const [qX, setQX] = useState<Q>("exists");

    const original = `${epsPart(qEps)}${xPart(qX)} |x - y| < \\varepsilon`;
    const negated = `${epsPart(flip(qEps))}${xPart(flip(qX))} |x - y| \\ge \\varepsilon`;

    const symbol = (q: Q) => (q === "forall" ? "∀" : "∃");

    const wordOriginal = t(
        `${qEps === "forall" ? "for every ε > 0" : "for some ε > 0"}, ` +
        `${qX === "forall" ? "every rational x" : "some rational x"} satisfies |x − y| < ε`,
        `${qEps === "forall" ? "모든 ε > 0에 대해" : "어떤 ε > 0이 있어서"}, ` +
        `${qX === "forall" ? "모든 유리수 x가" : "어떤 유리수 x가"} |x − y| < ε를 만족한다`,
    );

    const wordNegated = t(
        `${qEps === "forall" ? "for some ε > 0" : "for every ε > 0"}, ` +
        `${qX === "forall" ? "some rational x" : "every rational x"} satisfies |x − y| ≥ ε`,
        `${qEps === "forall" ? "어떤 ε > 0이 있어서" : "모든 ε > 0에 대해"}, ` +
        `${qX === "forall" ? "어떤 유리수 x가" : "모든 유리수 x가"} |x − y| ≥ ε를 만족한다`,
    );

    // 각 조합이 실제로 참인지 거짓인지까지 붙여 준다. 부정 규칙만 익히고 의미를 놓치는 것을 막는다.
    const meaning = qEps === "forall"
        ? (qX === "exists"
            ? t("True for every real y: the rationals are dense in the reals. This is the statement worth remembering.",
                "모든 실수 y에 대해 참이다. 유리수가 실수 안에 dense하다는 뜻이며, 기억해 둘 문장은 이것이다.")
            : t("False: shrink ε and almost every rational falls outside.",
                "거짓이다. ε를 줄이면 거의 모든 유리수가 범위 밖으로 밀려난다."))
        : (qX === "exists"
            ? t("Trivially true: pick a huge ε and any rational at all.",
                "자명하게 참이다. ε를 크게 잡고 유리수 아무거나 고르면 된다.")
            : t("False for every real y: no single ε can hold every rational at once.",
                "모든 실수 y에 대해 거짓이다. 어떤 ε 하나로 모든 유리수를 한꺼번에 담을 수는 없다."));

    const Toggle = ({value, onChange, label}: {value: Q; onChange: (q: Q) => void; label: string}) => (
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
                <Toggle value={qEps} onChange={setQEps} label="ε > 0"/>
                <Toggle value={qX} onChange={setQX} label="x ∈ ℚ"/>
            </div>

            <p className="text-xs text-muted text-center mt-3 mb-0">p</p>
            <BlockMath math={original}/>
            <p className="text-sm text-muted text-center -mt-2">{wordOriginal}</p>

            <p className="text-xs text-muted text-center mt-4 mb-0">¬p</p>
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
