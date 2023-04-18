import React, { useEffect, useRef } from "react";

const useLottieVisibility = (props) => {
  const { animationItem, View } = props;
  const wrapperRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper || !animationItem) {
      return;
    }

    // visibility observer
    const observer = new IntersectionObserver((entries) => {
      const visibility = entries[0]["isIntersecting"];

      if (visibility) {
        if (animationItem.isPaused) {
          animationItem.resetSegments(true);
          animationItem.play();
        }
      } else {
        animationItem.stop();
      }
    });
    // observe the visibility of the wrapper.
    observer.observe(wrapper);

    return () => {
      observer.unobserve(wrapper);
    };
  }, [animationItem]);

  return <div ref={wrapperRef}>{View}</div>;
};

export default useLottieVisibility;
