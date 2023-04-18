import { IS_APP } from "@/util/dev.mjs";
import globals from "@/util/global-whitelist.mjs";
import isChinaVersion from "@/util/is-china-version.mjs";

export const IS_CHINA = isChinaVersion();

// XXX: is there any security concern?
export function inject(url) {
  return new Promise((resolve, reject) => {
    const script = globals.document?.createElement("script");
    script.src = url;
    script.addEventListener("load", eventScriptLoaded);
    script.addEventListener("error", eventScriptError);
    globals.document?.body.appendChild(script);

    function eventScriptLoaded() {
      eventFinally();
      resolve(script);
    }

    function eventScriptError() {
      eventFinally();
      reject(new Error(`LOAD ANALYTICS SCRIPT ERROR: ${url}`));
    }

    function eventFinally() {
      script.removeEventListener("load", eventScriptLoaded);
      script.removeEventListener("error", eventScriptLoaded);
    }
  });
}

/*
  interface IProvider {
    name, url: string;
    web, app: boolean;
    initialize, finalize: () => {},
    promise: Promise<HTMLScriptElement>,
    script: HTMLScriptElement,
  }
*/

function isEnabled(provider) {
  if (IS_APP) {
    return provider.app;
  }
  return provider.web;
}

export function initializeProviders(providers) {
  for (const p of providers) {
    if (!isEnabled(p)) continue;
    if (typeof p.initialize === "function") {
      p.initialize();
    }
    p.promise = inject(p.url);
    p.promise.then((scriptElem) => {
      p.script = scriptElem;
    });
  }
  return Promise.all(providers.map((p) => p.promise));
}

export function finalizeProviders(providers) {
  for (const p of providers) {
    if (!isEnabled(p)) continue;
    if (typeof p.finalize === "function") {
      p.finalize();
    }
    const node = p.script;
    if (!node) continue;
    const parentNode = node.parentNode;
    if (!parentNode) continue;
    parentNode.removeChild(node);
  }
}
