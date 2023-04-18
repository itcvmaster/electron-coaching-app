import { useCallback, useEffect, useState } from "react";

import globals from "@/util/global-whitelist.mjs";

const useContextMenu = (ref) => {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [shouldShow, setShouldShow] = useState(false);

  const handleOpenMenu = useCallback(
    (e) => {
      const parent = ref.current;
      if (parent && parent.contains(e.target)) {
        const { pageX: x, pageY: y } = e;
        e.preventDefault();
        setAnchorPoint({ x, y });
        setShouldShow(true);
      }
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [setAnchorPoint, setShouldShow, ref.current, ref]
    /* eslint-enable react-hooks/exhaustive-deps */
  );

  const handleCloseMenu = useCallback(
    () => (shouldShow ? setShouldShow(false) : null),
    [shouldShow]
  );
  /* eslint-disable no-restricted-properties */
  useEffect(() => {
    globals.addEventListener("click", handleCloseMenu);
    globals.addEventListener("contextmenu", handleOpenMenu);
    window.addEventListener("blur", handleCloseMenu);
    return () => {
      globals.removeEventListener("click", handleCloseMenu);
      globals.removeEventListener("contextmenu", handleOpenMenu);
      window.removeEventListener("blur", handleCloseMenu);
    };
  });
  /* eslint-enable no-restricted-properties */
  return { anchorPoint, shouldShow };
};

export default useContextMenu;
