import { useEffect, useRef, useState } from "react";

export default function useResizeObserver() {
  const elRef = useRef();
  const [contentRect, setContentRect] = useState(null);
  const resizeObserver =
    typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver((entries) => {
          const rt = entries[0].contentRect;
          setContentRect(rt);
        });
  const observer = useRef(resizeObserver);

  useEffect(() => {
    const currentObserver = observer.current;
    const el = elRef.current;
    if (el) {
      currentObserver.observe(el);
    }

    return () => {
      if (el) {
        currentObserver.unobserve(el);
      }
    };
  }, [elRef, observer]);

  return [elRef, contentRect];
}
