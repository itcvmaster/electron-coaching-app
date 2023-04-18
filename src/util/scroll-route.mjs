import { CONTAINER_ID } from "@/util/exit-transitions.mjs";
import globals from "@/util/global-whitelist.mjs";

let previousPath;

// Handle auto scrolling to top on route change 🥴
export default function scrollOnRouteChange(router, event) {
  previousPath = router.currentPath;

  router.events.on(event, ({ currentPath }) => {
    if (currentPath === previousPath) {
      return;
    }
    previousPath = currentPath;
    const element = globals.document.getElementById(CONTAINER_ID);
    if (!element) return;
    element.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });
}
