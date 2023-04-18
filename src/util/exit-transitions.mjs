import router from "@/__main__/router.mjs";
import globals from "@/util/global-whitelist.mjs";

// Why implement exit transitioning animation without using a library?
// We want to make sure that the exiting node is completely inert, it should
// not re-render or be interactive. Most libs will retain the exiting node
// and allow re-render, interaction, etc.
//
// Also this will let use fine-tune the performance, since this is the biggest
// animation.

export const OBSERVE_CLASS = "route-wrapper";
export const CONTAINER_ID = "main-content";
const EXIT_TIME = 120;

if (typeof MutationObserver !== "undefined") {
  const obs = new MutationObserver((mutations) => {
    const enterNodes = [];
    const exitNodes = [];
    for (const { addedNodes, removedNodes } of mutations) {
      for (const node of removedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        if (node.classList.contains(OBSERVE_CLASS)) exitNodes.push(node);
      }
      for (const node of addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        if (node.classList.contains(OBSERVE_CLASS)) enterNodes.push(node);
      }
    }

    const { isBackwards } = router;

    for (const node of enterNodes) {
      node.style.transition = `transform ${EXIT_TIME / 1000}s linear, opacity ${
        EXIT_TIME / 1000
      }s linear`;
      node.style.opacity = 0;
      node.style.transform = `translate3d(calc(var(--sp-8) * ${
        isBackwards ? 1 : -1
      }), 0, 0)`;
      globals.requestAnimationFrame(() => {
        node.style.opacity = 1;
        node.style.transform = `translate3d(0, 0, 0)`;
      });
    }

    // TODO: check if animations are disabled, and no-op if set.
    if (exitNodes.length) {
      const container = globals.document.getElementById(CONTAINER_ID);
      for (const node of exitNodes) {
        node.classList.remove(OBSERVE_CLASS);
        container.appendChild(node);
        handleExitNode(node, isBackwards);
      }
    }
  });
  obs.observe(globals.document.body, {
    childList: true,
    subtree: true,
  });
}

function handleExitNode(node, isBackwards) {
  node.style.pointerEvents = "none";
  globals.requestAnimationFrame(() => {
    node.style.opacity = 0;
    node.style.transform = `translate3d(calc(var(--sp-8) * ${
      isBackwards ? -1 : 1
    }), 0, 0)`;
  });
  setTimeout(() => {
    node.remove();
  }, EXIT_TIME);
}
