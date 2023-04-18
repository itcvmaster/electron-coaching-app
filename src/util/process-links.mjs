import {
  APP_ROUTE_VERSION,
  IS_APP_ROUTE,
  matchRoutes,
} from "@/__main__/router.mjs";
import { isCatchAll } from "@/routes/constants.mjs";
import { devError } from "@/util/dev.mjs";
import globals from "@/util/global-whitelist.mjs";

const obs =
  typeof MutationObserver !== "undefined"
    ? new MutationObserver((mutations) => {
        for (const { addedNodes, type, attributeName, target } of mutations) {
          for (const node of addedNodes) {
            if (node.nodeType !== Node.ELEMENT_NODE) continue;
            const links = Array.from(node.querySelectorAll("a"));
            if (node.tagName === "A") links.push(node);
            for (const link of links) {
              processLink(link);
            }
          }
          if (type === "attributes" && attributeName === "href") {
            processLink(target);
          }
        }
      })
    : null;

export function observe(root = globals.document?.body) {
  obs.observe(root, {
    attributeFilter: ["href"],
    childList: true,
    subtree: true,
  });
}

export function unobserve() {
  obs.disconnect();
}

function processLink(link) {
  if (isLinkValid(link)) {
    const href = link.getAttribute("href");

    // rename the link if its relevant for renaming
    if (IS_APP_ROUTE && href.startsWith("/") && !href.startsWith("/app/")) {
      link.setAttribute("href", `/app/${APP_ROUTE_VERSION}${href}`);
    }
  }
}

function isLinkValid(link) {
  const href = link.getAttribute("href");
  if (!href) {
    devError(
      "An <a> element on the page does not have href attribute (invalid).",
      link
    );
    return false;
  }

  // check, if the link is known to the router to find invalid links
  if (href.startsWith("/")) {
    const matches = matchRoutes(href);
    const validMatch = matches.find((match) => !match[isCatchAll]);
    if (!validMatch) {
      devError(
        "An <a> element on the page does not have a matching route.",
        link
      );
      link.style.animation = "0.5s ease-in infinite alternate invalid-link";
      link.style.textDecoration = "line-through";
    }

    return false;
  }

  return true;
}
