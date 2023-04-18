import React, { useEffect, useCallback, useRef, useState } from "react";
import lottie from "lottie-web";

const useLottie = (props, style) => {
  const { animationData, loop, autoplay } = props;

  const [animationLoaded, setAnimationLoaded] = useState(false);
  const animationInstanceRef = useRef(null);
  const animationContainer = useRef(null);

  const loadAnimation = useCallback(() => {
    if (!animationContainer.current) {
      return;
    }

    // default rendererSettings
    const defaultConfig = {
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    // Destroy any previous instance
    animationInstanceRef.current?.destroy();

    // Build the animation configuration
    const config = {
      ...props,
      ...defaultConfig,
      container: animationContainer.current,
    };

    // Save the animation instance
    animationInstanceRef.current = lottie.loadAnimation(config);

    setAnimationLoaded(!!animationInstanceRef.current);
  }, [props, setAnimationLoaded, animationInstanceRef, animationContainer]);

  // load animation
  useEffect(() => {
    loadAnimation();
  }, [loadAnimation, animationData, loop, autoplay]);

  // Lottie container
  const View = <div style={style} ref={animationContainer} />;

  return {
    View,
    animationLoaded,
    animationItem: animationInstanceRef.current,
  };
};

export default useLottie;
