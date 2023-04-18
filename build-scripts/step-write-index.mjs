import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

import { CSS_FONTS, JS_FILE_EXTENSION, LINK_ICON } from "./constants.mjs";

const args = process.argv.slice(2);
const IS_DEV = args.includes("--dev");

// If desktop, it will use the prefix path.
const IS_DESKTOP = args.includes("--desktop");

const SHOULD_PRELOAD = !IS_DEV && IS_DESKTOP;

const pkg = JSON.parse(readFileSync(path.resolve("package.json")));
const URL_PREFIX = IS_DESKTOP ? `/app/${pkg.version}/` : "/";

const META_STRING = "<!--@SSR_META-->";
const STYLE_STRING = "/*@SSR_GLOBAL_STYLES*/";
const PRELOAD_STRING = "<!--@SSR_PRELOAD-->";
const INLINE_SCRIPT_STRING = "<!--@SSR_INLINE_SCRIPT-->";
const APP_MARKUP_STRING = "<!--@SSR_APP_MARKUP-->";
const SCRIPT_ENTRY_POINT_STRING = "SCRIPT_ENTRY_POINT";
const NONCE_REGEXP = /NONCE/g;
const LOADING_ELEMENT = `
<video
  style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.5);"
  src="https://blitz-cdn-plain.blitz.gg/blitz/ui/video/loading-400x400.webm"
  loop autoplay muted
></video>
`;
const INLINE_SCRIPT = `
<script nonce="NONCE">
  window.addEventListener("DOMContentLoaded", function () {
    if (
      typeof String.prototype.replaceAll !== "undefined" &&
      typeof IntersectionObserver !== "undefined" &&
      typeof Proxy !== "undefined" &&
      typeof Reflect !== "undefined" &&
      CSS.supports("inset", "unset")
    ) return;
    var app = document.getElementById("app");
    var elem = document.createElement("div");
    elem.style.background = "#dd364d";
    elem.style.padding = "16px";
    elem.style.textAlign = "center";
    elem.style.color = "white";

    if (navigator?.language?.startsWith("zh")) {
      elem.innerText = "您当前的浏览器版本太低，站内部分功能无法正常运行。";
    } else {
      elem.innerText = "Your browser is unsupported or too old.";
    }
    app.parentNode.insertBefore(elem, app);
  });
</script>`;

const INDEX_TEMPLATE_PATH = `www/index-template.html`;
const INDEX_PATH = `www/index.html`;

const writeIndexStep = async () => {
  const walk = async (base, dir, memo = []) => {
    const list = await fs.readdir(path.join(base, dir), {
      withFileTypes: true,
    });
    for (const entry of list) {
      if (!entry.name.endsWith(JS_FILE_EXTENSION)) continue;
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(base, p, memo); // eslint-disable-line no-await-in-loop
        continue;
      }
      memo.push(p);
    }
    return memo;
  };
  const filePaths = await walk("www", "js");

  const getLinkMarkup = (filePath) => {
    // Kleanup for Windows
    filePath = filePath.replace(/\\/g, "/");
    return `<link rel="prefetch" href="${URL_PREFIX}${filePath}" as="script">`;
  };

  let html = await fs.readFile(INDEX_TEMPLATE_PATH, "utf8");
  const indexOfMeta = html.indexOf(META_STRING);
  const TITLE =
    IS_DEV || IS_DESKTOP ? `<title>${pkg.name} v${pkg.version}</title>` : "";

  // Append favicon and title
  html = `${html.slice(0, indexOfMeta)}${TITLE}${LINK_ICON}\n${html.slice(
    indexOfMeta
  )}`;

  // Append global css
  html = html.replace(STYLE_STRING, CSS_FONTS);

  // Append global css
  html = html.replace(INLINE_SCRIPT_STRING, INLINE_SCRIPT);

  // Replace entry point
  const ENTRY_POINT = `${URL_PREFIX}js/src/root${JS_FILE_EXTENSION}`;
  html = html.replace(SCRIPT_ENTRY_POINT_STRING, ENTRY_POINT);

  // Replace nonce with random value
  const nonce = crypto.randomBytes(6).toString("base64");
  html = html.replaceAll(NONCE_REGEXP, nonce);

  const preloadLinks = filePaths
    .map((filePath) => getLinkMarkup(filePath))
    .join("\n");

  if (IS_DEV || IS_DESKTOP) {
    html = html.replace(APP_MARKUP_STRING, LOADING_ELEMENT);
  }

  const markup = html.replace(
    PRELOAD_STRING,
    SHOULD_PRELOAD ? preloadLinks : ""
  );

  await fs.writeFile(INDEX_PATH, markup, "utf8");
};

export default writeIndexStep;
