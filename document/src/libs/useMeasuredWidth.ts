import {useEffect, useRef, useState} from "react";

// Konva Stage 는 픽셀 크기를 직접 받아야 해서 CSS 만으로는 반응형이 되지 않는다.
// 부모 요소의 폭을 관측해 넘겨주면 모바일에서도 캔버스가 화면을 넘지 않는다.
export function useMeasuredWidth<T extends HTMLElement>(fallback: number, max = Infinity) {
    const ref = useRef<T>(null);
    const [width, setWidth] = useState(fallback);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const update = () => {
            const measured = Math.round(el.getBoundingClientRect().width);
            // 레이아웃 전(0px)에는 fallback 을 유지해 캔버스가 사라지지 않게 한다.
            if (measured > 0) setWidth(Math.min(max, measured));
        };
        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, [max]);

    return {ref, width};
}
