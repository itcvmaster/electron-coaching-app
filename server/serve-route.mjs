import { minify } from "html-minifier";
import { IP2Location } from "ip2location-nodejs";
import Negotiator from "negotiator";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

import {
  appInstance,
  extractCss,
  extractMeta,
  i18n,
  ReactDOMServer,
  setRoute,
  waitForFeatureFlags,
} from "../www/js/src/root.mjs";

const ip2l = new IP2Location();
const ipFilePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "IP2LOCATION-LITE-DB1.IPV6.BIN"
);
ip2l.open(ipFilePath);

const indexFile = fs.readFile(`www/index.html`, "utf8");
const LANG_STRING = `lang="en"`;
const META_TAG_STRING = "<!--@SSR_META-->";
const STYLE_TAG_STRING = "<!--@SSR_STYLE_TAG-->";
const APP_MARKUP_STRING = "<!--@SSR_APP_MARKUP-->";

const HTML_MINIFY = {
  collapseWhitespace: true,
  preserveLineBreaks: true,
  removeComments: true,
  ignoreCustomComments: [/^@/],
  minifyCSS: true,
};

const fallbackLng = i18n.options.fallbackLng[0];

// serve react dom
async function serveRoute(req, res) {
  const t0 = Date.now();
  const { url: pathname } = req;
  const negotiator = new Negotiator(req);
  let language = negotiator.language();
  if (language.startsWith("zh")) {
    language = "zh-Hans-CN";
  } else {
    language =
      i18n.options.languages.find(
        (code) => code.slice(0, 2) === language.slice(0, 2)
      ) || fallbackLng;
  }
  const fwdFor = req.headers["x-forwarded-for"];
  const clientIp = fwdFor?.split(",")[0];
  const remoteAddress = clientIp || req.socket.remoteAddress;
  const isChina =
    language === "zh-Hans-CN" ||
    ip2l.getCountryShort(remoteAddress) === "CN" ||
    req.headers["host"] === "blitz.cn";

  try {
    await i18n.changeLanguage(language);
    if (isChina) await waitForFeatureFlags({ china: true });

    const [route, searchParams = ""] = pathname.split("?");
    await setRoute(route, searchParams);
  } catch (error) {
    if (isChina) await waitForFeatureFlags({ china: false });
    const { statusCode, redirect } = error;
    res.statusCode = statusCode || 500;
    if (redirect) {
      res.writeHead(statusCode, {
        location: redirect,
      });
      return res.end();
    }
    process.stderr.write(`${error.stack}\n`);
    // We could prematurely exit here, but it's better to let the client hydrate.
    // return res.end("" + error);
  }

  const appMarkup = ReactDOMServer.renderToString(appInstance);
  let htmlMeta = await extractMeta();
  const css = extractCss();
  // Rendering the app is done after this.

  if (isChina) {
    htmlMeta += `<meta itemprop="china">`;
    await waitForFeatureFlags({ china: false });
  }

  const html = await indexFile;
  const rawMarkup = html
    .replace(LANG_STRING, `lang="${language}"`)
    .replace(META_TAG_STRING, htmlMeta)
    .replace(STYLE_TAG_STRING, `<style>${css}</style>`);
  // App markup can not be minified, React will complain.
  const markup = minify(rawMarkup, HTML_MINIFY).replace(
    APP_MARKUP_STRING,
    appMarkup
  );

  res.setHeader("cache-control", "max-age=3600");
  res.setHeader("x-render-time", `${((Date.now() - t0) / 1000).toFixed(3)}s`);

  // Disabled on localhost 😵‍💫
  // https://stackoverflow.com/questions/43862412/why-is-brotli-not-supported-on-http
  if (
    /\bbr\b/.test(req.headers["accept-encoding"] || "") &&
    !req.headers["host"]?.startsWith("localhost")
  ) {
    res.setHeader("content-encoding", "br");
    return res.end(await compress(markup, "brotliCompress"));
  }

  // Deflate as fallback
  if (/\bdeflate\b/.test(req.headers["accept-encoding"] || "")) {
    res.setHeader("content-encoding", "deflate");
    return res.end(await compress(markup, "deflate"));
  }

  return res.end(markup);
}

function compress(data, method) {
  return new Promise((resolve, reject) => {
    zlib[method](data, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

export default serveRoute;
