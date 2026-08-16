import {ReactNode} from "react";
import cn from "../../libs/cn";
import {useTr} from "../../libs/i18n";

// 이 교재는 정의 → 정리 → 증명이 본문의 뼈대다. 산문 안에 섞어 두면 무엇이 가정이고
// 무엇이 결론인지 흐려지므로, 진술 단위를 눈에 보이는 블록으로 분리한다.
export type StatementKind =
    | "definition"
    | "theorem"
    | "lemma"
    | "proposition"
    | "corollary"
    | "example"
    | "remark";

const LABEL: Record<StatementKind, [en: string, ko: string]> = {
    definition: ["Definition", "정의"],
    theorem: ["Theorem", "정리"],
    lemma: ["Lemma", "보조정리"],
    proposition: ["Proposition", "명제"],
    corollary: ["Corollary", "따름정리"],
    example: ["Example", "예제"],
    remark: ["Remark", "참고"],
};

interface StatementProps {
    // 원 교재의 번호를 그대로 적는다 (예: "2.4"). 독자가 교재와 대조할 수 있도록
    // 자동 채번 대신 명시값을 쓴다. 생략하면 번호 없이 렌더한다.
    n?: string;
    title?: ReactNode;
    children: ReactNode;
    className?: string;
}

const Statement = ({kind, n, title, children, className}: StatementProps & {kind: StatementKind}) => {
    const t = useTr();
    const [en, ko] = LABEL[kind];
    return (
        <section className={cn("stmt", `stmt-${kind}`, className)}>
            <p className="stmt-head">
                <span className="stmt-kind">{t(en, ko)}{n ? ` ${n}` : ""}</span>
                {title && <span className="stmt-title">{title}</span>}
            </p>
            <div className="stmt-body">{children}</div>
        </section>
    );
};

export const Definition = (props: StatementProps) => <Statement kind="definition" {...props}/>;
export const Theorem = (props: StatementProps) => <Statement kind="theorem" {...props}/>;
export const Lemma = (props: StatementProps) => <Statement kind="lemma" {...props}/>;
export const Proposition = (props: StatementProps) => <Statement kind="proposition" {...props}/>;
export const Corollary = (props: StatementProps) => <Statement kind="corollary" {...props}/>;
export const Example = (props: StatementProps) => <Statement kind="example" {...props}/>;
export const Remark = (props: StatementProps) => <Statement kind="remark" {...props}/>;

// 증명은 기본으로 접어 둔다. 결과만 훑는 독자가 증명 더미를 스크롤로 넘기지 않아도 되고,
// 따라가려는 독자는 펼쳐서 읽는다. open 으로 처음부터 펼친 상태를 강제할 수 있다.
export const Proof = ({label, children, open}: {
    label?: ReactNode;
    children: ReactNode;
    open?: boolean;
}) => {
    const t = useTr();
    return (
        <details className="proof" open={open}>
            <summary>{label ?? t("Proof", "증명")}</summary>
            <div className="proof-body">
                {children}
                <p className="qed" aria-hidden="true">∎</p>
            </div>
        </details>
    );
};

export default Statement;
