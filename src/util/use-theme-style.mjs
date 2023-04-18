import { useEffect } from "react";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { THEME_DARK } from "@/app/constants.mjs";
import globals from "@/util/global-whitelist.mjs";
import themes from "@/util/themes.mjs";

function useThemeStyle() {
  const {
    settings: { theme },
  } = useSnapshot(readState);

  useEffect(() => {
    const { cssClass } = themes[theme || THEME_DARK];
    if (cssClass) globals.document.body.classList.add(cssClass);
    return () => {
      if (cssClass) globals.document.body.classList.remove(cssClass);
    };
  }, [theme]);
}

export default useThemeStyle;
