import { useEffect } from "react";

import globals from "@/util/global-whitelist.mjs";

export default function useKeypress(key, action) {
  useEffect(() => {
    function handler(e) {
      if (e.key === key) action();
    }
    globals.addEventListener("keydown", handler);
    return () => globals.removeEventListener("keydown", handler);
  }, [action, key]);
}
