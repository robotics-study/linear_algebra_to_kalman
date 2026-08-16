import {useState} from "react";
import cn from "../../../libs/cn";
import {useTr} from "../../../libs/i18n";
import {InlineMath} from "../../math/Tex";

// 이 장에서 가장 받아들이기 어려운 등식은 (p ⟹ q) ⟺ ¬(p ∧ ¬q) 다. 네 행을 한꺼번에
// 보여 주고 행을 직접 골라 보게 하면, 마지막 두 열이 언제나 같은 값이라는 사실이
// 설명보다 먼저 눈에 들어온다.
const ROWS: Array<{p: boolean; q: boolean}> = [
    {p: true, q: true},
    {p: true, q: false},
    {p: false, q: true},
    {p: false, q: false},
];

const TF = ({value}: {value: boolean}) => (
    <span className={value ? "text-[var(--accent-2)]" : "text-[var(--muted)]"}>
        {value ? "T" : "F"}
    </span>
);

const TruthTableExplorer = () => {
    const t = useTr();
    const [active, setActive] = useState(1);

    const columns: Array<{head: string; of: (r: {p: boolean; q: boolean}) => boolean}> = [
        {head: "p", of: (r) => r.p},
        {head: "q", of: (r) => r.q},
        {head: "\\lnot q", of: (r) => !r.q},
        {head: "p \\land \\lnot q", of: (r) => r.p && !r.q},
        {head: "\\lnot(p \\land \\lnot q)", of: (r) => !(r.p && !r.q)},
        {head: "p \\implies q", of: (r) => !r.p || r.q},
    ];

    const row = ROWS[active];
    // p 가 거짓인 행에서 implication이 참이 되는 것이 "vacuous truth" — 학생이 가장 많이 걸리는 지점이라
    // 현재 행에 맞춰 그 이유를 한 문장으로 붙인다.
    const reading = row.p
        ? (row.q
            ? t("The promise was made and kept, so the implication holds.",
                "약속을 했고 지켰다. implication은 참이다.")
            : t("The promise was made and broken. This is the only way an implication can fail.",
                "약속을 했는데 어겼다. implication이 거짓이 되는 경우는 이것 하나뿐이다."))
        : t("The premise never happened, so nothing was promised and nothing was broken. The implication holds vacuously.",
            "전제가 일어나지 않았으니 약속한 것도, 어긴 것도 없다. implication은 vacuously 참이다.");

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <table className="table-center text-sm">
                    <thead>
                    <tr>
                        {columns.map((c) => (
                            <th key={c.head} className="px-3 py-2 font-normal">
                                <InlineMath math={c.head}/>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {ROWS.map((r, i) => (
                        <tr key={i}
                            onClick={() => setActive(i)}
                            className={cn(
                                "cursor-pointer transition-colors",
                                i === active
                                    ? "bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]"
                                    : "hover:bg-surface",
                            )}>
                            {columns.map((c) => (
                                <td key={c.head}
                                    className={cn(
                                        "px-3 py-1.5 font-mono",
                                        // 마지막 두 열이 항상 일치한다는 점이 이 표의 요지다.
                                        c.head.startsWith("\\lnot(") || c.head.startsWith("p \\implies")
                                            ? "font-semibold"
                                            : undefined,
                                    )}>
                                    <TF value={c.of(r)}/>
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <p className="mt-3 text-sm text-muted text-center px-2">{reading}</p>
            <p className="mt-1 text-xs text-muted text-center px-2">
                {t("The last two columns agree on every row: that is the identity behind proof by contradiction.",
                    "마지막 두 열은 네 행 모두에서 값이 같다. 귀류법이 성립하는 근거가 바로 이 등식이다.")}
            </p>
        </div>
    );
};

export default TruthTableExplorer;
