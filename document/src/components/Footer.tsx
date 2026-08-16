import {T} from "../libs/i18n";

const LICENSE_URL = "https://github.com/robotics-study/linear_algebra_to_kalman/blob/main/LICENSE"
const COURSE_URL = "https://grizzle.robotics.umich.edu/education/rob501"

const Footer = () => (
    <footer className="site-footer">
        <T
            en={<p>
                Study notes on Jessy Grizzle's <em>ROB 501 · Mathematics for Robotics</em>
                {" "}(University of Michigan) ·{" "}
                <a href={COURSE_URL} target="_blank" rel="noopener noreferrer">course page</a>
            </p>}
            ko={<p>
                Jessy Grizzle의 <em>ROB 501 · Mathematics for Robotics</em> (University of Michigan)를
                공부하며 만든 노트 ·{" "}
                <a href={COURSE_URL} target="_blank" rel="noopener noreferrer">코스 페이지</a>
            </p>}
        />
        <T
            en={<p>
                © 2026 robotics-study ·{" "}
                <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer">MIT License</a>
                {" "}· Unofficial study notes
            </p>}
            ko={<p>
                © 2026 robotics-study ·{" "}
                <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer">MIT License</a>
                {" "}· 비공식 학습 노트
            </p>}
        />
    </footer>
)

export default Footer
