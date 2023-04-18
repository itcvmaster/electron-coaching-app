import { useCallback, useEffect, useRef } from "react";

/**
 * When user hovers over the referenced DOM node it will have its vertical
 * scroll swapped to a horizontal scroll.
 * @returns {React.MutableRefObject<null>}
 */
function useScrollSwap() {
  // Hooks
  const ref = useRef(null);
  const storeRef = useRef(false);
  const handleScroll = useCallback((event) => {
    event.preventDefault();
    ref.current.scrollLeft += event.deltaY;
  }, []);
  const handleMouseOver = useCallback(() => {
    if (ref.current && !storeRef.current) {
      storeRef.current = true;
      ref.current.addEventListener("wheel", handleScroll);
    }
    /* eslint-disable-next-line */
  }, [handleScroll, ref.current]);
  const handleMouseLeave = useCallback(() => {
    if (ref.current && storeRef.current) {
      storeRef.current = false;
      ref.current.removeEventListener("wheel", handleScroll);
    }
  }, [handleScroll]);
  // Effects
  useEffect(() => {
    const r = ref?.current;
    if (r) {
      r.addEventListener("mouseover", handleMouseOver);
      r.addEventListener("mouseleave", handleMouseLeave);
    }
    return () => {
      if (r) {
        r.removeEventListener("mouseover", handleMouseOver);
        r.removeEventListener("mouseleave", handleMouseLeave);
        r.removeEventListener("wheel", handleScroll);
      }
    };
  }, [handleMouseLeave, handleMouseOver, handleScroll]);
  return ref;
}

export default useScrollSwap;
