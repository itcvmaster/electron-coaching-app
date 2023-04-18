import React, { useEffect, useRef, useState } from "react";
import * as PropTypes from "prop-types";

const Sentinel = (props) => {
  const { margin, setRoot, onVisible } = props;
  const intersectionRef = useRef(null);
  const [rootElement, setRootElement] = useState();

  useEffect(() => {
    if (setRoot) {
      setRoot(setRootElement);
    }
  }, [setRoot]);

  // Callback visibility with intersection observer
  useEffect(() => {
    const intersectionNode = intersectionRef.current;
    if (intersectionNode) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visibility = entries[0]["isIntersecting"];
          onVisible(visibility);
        },
        { root: rootElement, rootMargin: `${margin}px 0px ${margin}px 0px` }
      );

      observer.observe(intersectionNode);

      return () => {
        if (intersectionNode) {
          observer.unobserve(intersectionNode);
        }
      };
    }
  }, [intersectionRef, rootElement, margin, onVisible]);

  return (
    <div ref={intersectionRef}>
      <template style={{ height: 1, minWidth: 1, display: "block" }} />
    </div>
  );
};

Sentinel.propTypes = {
  margin: PropTypes.number,
  root: PropTypes.element,
  children: PropTypes.node,
};

Sentinel.defaultProps = {
  margin: 100,
};

export default Sentinel;
