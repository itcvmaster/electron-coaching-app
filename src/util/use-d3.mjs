import React from "react";
import { select } from "d3-selection";

export const useD3 = (renderChartFn, dependencies) => {
  const ref = React.useRef();

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    // This isn't very generic, but the name implies it is... it should not be in the util dir.
    renderChartFn(select(ref.current));
    return () => {};
  }, dependencies);
  /* eslint-enable react-hooks/exhaustive-deps */

  return ref;
};
