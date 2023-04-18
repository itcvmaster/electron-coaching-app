import color from "ansi-colors";
import detectPort from "detect-port";
import esbuild from "esbuild";
import EventEmitter from "node:events";
import { readFileSync } from "node:fs";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";

import aliasPlugin from "./alias-plugin.mjs";
import {
  BANNED_PACKAGES,
  BANNER,
  JS_FILE_EXTENSION,
  ROUTE_DIR_REGEXP,
  STATIC_REGEXP,
  WHITELIST_DIRECTORIES,
} from "./constants.mjs";
import i18nStep from "./fetch-i18n.mjs";
import mediaPlugin from "./media-plugin.mjs";
import resolvePlugin from "./resolve-plugin.mjs";
import checkStep from "./step-check.mjs";
import modStep from "./step-mod.mjs";
import setupGitStep from "./step-setup-git.mjs";
import writeIndexStep from "./step-write-index.mjs";
import svgPlugin from "./svg-plugin.mjs";
import wasmPlugin from "./wasm-plugin.mjs";

const bus = new EventEmitter();
const args = process.argv.slice(2);
const IS_DEV = args.includes("--dev");
const IS_RELOAD = args.includes("--reload");
const IS_QUICK = args.includes("--quick");
const IS_CHINA = args.includes("--china");
const OUT_DIR = "www/js";
const DEV_PORT = 3000;
let isDone = false;

const pkg = JSON.parse(readFileSync(path.resolve("package.json")));

// simple workaround for eslint rule lol
const c = console;

const buildOptions = {
  // Entry points are basically any file that may be dynamically imported.
  entryPoints: [
    "src/root.mjs",
    "src/test.mjs",
    "clutch/src/index.mjs",
    "src/standalone/root.mjs",
  ],
  bundle: true,
  splitting: true,
  outdir: OUT_DIR,
  outExtension: {
    ".js": JS_FILE_EXTENSION,
  },
  inject: ["src/util/global-shims.mjs"],
  banner: {
    js: ["/*!", ...BANNER.split("\n").map((line) => ` * ${line}`), " */"].join(
      "\n"
    ),
  },
  // The values in `define` MUST be typed as a String or undefined.
  define: {
    // This is needed for third-party libs like React...
    "process.env.NODE_ENV": IS_DEV ? '"development"' : '"production"',
    __BLITZ_FEATURES__: "[]",
    __BLITZ_RELOAD__: IS_RELOAD ? "true" : "false",
    __BLITZ_CN__: IS_CHINA || undefined,
  },
  format: "esm",
  target: "esnext", // this is default, enables all latest specs
  minify: !IS_DEV && !IS_QUICK,
  plugins: [
    aliasPlugin({
      // Swapping out React for Preact 😎
      // react: path.resolve("node_modules/preact/compat/dist/compat.js"),
      // "react-dom": path.resolve("node_modules/preact/compat/dist/compat.js"),
      // "react-dom/server": path.resolve("node_modules/preact/compat/server.js"),
    }),
    resolvePlugin,
    wasmPlugin,
    svgPlugin,
    mediaPlugin,
  ],
  sourcemap: true,
};

for (const dep of [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.devDependencies),
]) {
  if (BANNED_PACKAGES.hasOwnProperty(dep)) {
    throw new Error(
      `Package "${dep}" has been banned. Reason: ${BANNED_PACKAGES[dep]}`
    );
  }
}

for (const dirname of WHITELIST_DIRECTORIES) {
  if (dirname.toLowerCase() !== dirname) {
    throw new Error(`Uppercase not allowed in directory name (${dirname}).`);
  }
}

const scanStep = async () => {
  // Read routes first using a shitty RegExp instead of AST traversal!
  const src = await fs.readdir("src", { withFileTypes: true });
  const dirs = src.filter(
    (dirEnt) => dirEnt.isDirectory() && ROUTE_DIR_REGEXP.test(dirEnt.name)
  );
  const routeFiles = (
    await Promise.all(
      dirs.map(async (dir) => {
        const dirListing = await fs.readdir(`src/${dir.name}`, {
          withFileTypes: true,
        });
        return dirListing
          .filter((dirEnt) => dirEnt.isFile())
          .map((file) => `src/${dir.name}/${file.name}`);
      })
    )
  ).reduce((a, v) => {
    a.push(...v);
    return a;
  }, []);
  const routes = [];
  for (const filePath of routeFiles) {
    const content = await fs.readFile(filePath, "utf8"); // eslint-disable-line no-await-in-loop
    const matches = content.matchAll(/component:\s*"(.*?)"/g);
    for (const match of matches) {
      const [, componentPath] = match;
      routes.push(`src/${componentPath}`);
    }
  }
  buildOptions.entryPoints.push(...routes);

  // Feature flagged modules
  const srcDir = await fs.readdir("src/", { withFileTypes: true });
  const srcDirs = Array.prototype.filter.call(srcDir, (dirent) =>
    dirent.isDirectory()
  );
  const camelNames = [];
  for (const dir of srcDirs) {
    if (!dir.name.startsWith("feature-")) continue;
    const camelName = dir.name
      .slice(8)
      .replaceAll(/-(\S)/g, (m, p) => p.toUpperCase());
    camelNames.push(camelName);
    buildOptions.entryPoints.push(`src/${dir.name}/mod.mjs`);
  }
  buildOptions.define["__BLITZ_FEATURES__"] = `[${camelNames
    .map((n) => `"${n}"`)
    .join(",")}]`;
};

const buildStep = async () => {
  await fs.rm(OUT_DIR, { force: true, recursive: true });
  const {
    default: { languages },
  } = await import("../src/i18n/__init.mjs");
  buildOptions.entryPoints.push(
    ...languages.map((language) => `src/i18n/__resources.${language}.mjs`)
  );
  return esbuild.build(buildOptions);
};

const serveStep = async () => {
  const result = await esbuild.serve(
    {
      servedir: "www",
    },
    buildOptions
  );

  const { host: hostname, port } = result;
  const devServer = http.createServer(async (req, res) => {
    const { url, method, headers } = req;

    if (method === "GET" && url.startsWith("/dev-events")) {
      const { handleSSE } = await import("./watch-server.mjs");

      return handleSSE(req, res);
    }

    // Rewrite most paths in the dev server to the index :)
    const path = STATIC_REGEXP.test(url) ? url : "/";

    const options = {
      hostname,
      port,
      path,
      method,
      headers,
    };

    // Forward each incoming request to esbuild
    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    // Forward the body of the request to esbuild
    req.pipe(proxyReq, { end: true });
  });

  const availablePort = await detectPort(DEV_PORT);
  if (availablePort !== DEV_PORT) {
    throw new Error(`Port ${DEV_PORT} is already in use.`);
  }

  devServer.listen(DEV_PORT, () => {
    const log = () => {
      c.log(
        color.cyan(
          `dev server listening on ${color.underline(
            `${hostname}:${DEV_PORT}`
          )}...`
        )
      );
    };
    if (isDone) log();
    else bus.once("done", log);
  });
};

const steps = [
  setupGitStep,
  !IS_QUICK && i18nStep,
  modStep,
  checkStep,
  scanStep,
  buildStep,
  writeIndexStep,
];

const stepsToNotLog = ["setupGitStep"];

if (IS_DEV) {
  steps.splice(steps.indexOf(i18nStep), 1);
  steps.splice(steps.indexOf(buildStep), 1, serveStep);
}

(async () => {
  let t0;
  let isFirst = true;
  process.stdout.write(`${color.bold(color.red(BANNER))}\n\n`);
  for (const step of steps) {
    t0 = Date.now();
    try {
      /* eslint-disable no-await-in-loop */
      if (typeof step === "function") await step();
      /* eslint-enable no-await-in-loop */ else continue;
    } catch (e) {
      c.error(e);
      return process.exit(1);
    }
    if (stepsToNotLog.includes(step.name)) continue;
    process.stdout.write(
      `${isFirst ? "" : color.dim(" | ")}${color.bold(
        step.name.replace(/step/i, "")
      )} ${color.green(`${Date.now() - t0}ms`)}`
    );
    isFirst = false;
  }
  process.stdout.write("\n");
  isDone = true;
  bus.emit("done");
})();
