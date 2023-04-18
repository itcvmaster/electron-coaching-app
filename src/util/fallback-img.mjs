import { FALLBACK_IMAGE_URL } from "@/app/constants.mjs";
import globals from "@/util/global-whitelist.mjs";

function getFallbackImage(event) {
  if (event.target.src === FALLBACK_IMAGE_URL) return;
  event.target.src = FALLBACK_IMAGE_URL;
}

const attachedSet = new WeakSet();

const obs =
  typeof MutationObserver !== "undefined"
    ? new MutationObserver((mutations) => {
        for (const { addedNodes } of mutations) {
          for (const node of addedNodes) {
            if (node.nodeType !== Node.ELEMENT_NODE) continue;
            const imgs = Array.from(node.querySelectorAll("img"));
            if (node.tagName === "IMG") imgs.push(node);

            for (const img of imgs) {
              if (attachedSet.has(img)) continue;
              attachedSet.add(img);
              img.addEventListener("error", getFallbackImage);
            }
          }
        }
      })
    : null;

export function observe(root = globals.document?.body) {
  obs.observe(root, {
    childList: true,
    subtree: true,
  });
}

export function unobserve() {
  obs.disconnect();
}
