import fetch from "node-fetch";
import run from "tapdance";

import { server } from "../../server/worker.mjs";
import { routes } from "../../www/js/src/root.mjs";
import langFixtures from "./lang-fixtures.mjs";
import routeFixtures from "./route-fixtures.mjs";

let res, text, port, emergencyAssert;

process.on("uncaughtException", (error) => {
  console.error(error); // eslint-disable-line no-console
  emergencyAssert(false, "SSR FAILED");
  process.exit(1);
});

run(async (assert, comment) => {
  comment("ssr setup");
  emergencyAssert = assert;
  await new Promise((resolve) => {
    server.listen(() => {
      resolve();
    });
  });
  ({ port } = server.address());
});

run(async (assert, comment) => {
  comment("ssr homepage");
  res = await fetch(`http://localhost:${port}/`);
  text = await res.text();
  assert(text.match(/<style>/m), "SSR style tag found");
  // should assert for specific content.
  // assert(text.match(/<div id="app">(.*?)<\/div>/s)[1].trim(), "content found");
});

// For these pages, we just need to check if they result in errors.
// These depend on network conditions.
run((assert, comment) => {
  comment("ssr routes");
  const renderableRoutes = routes
    .filter(({ component }) => component)
    .flatMap(({ path }) => {
      if (typeof path === "string") return path;
      const matches = routeFixtures.filter((str) => path.test(str));
      if (matches.length) {
        return matches;
      }
      return path;
    })
    .filter((route) => {
      // Special exception for apex routes since they are a WIP...
      if (route.toString().includes("apex")) {
        return false;
      }
      if (typeof route !== "string") {
        assert(false, `missing route fixture for ${route}`);
        return false;
      }
      return true;
    });

  return renderableRoutes.reduce((chain, route) => {
    return chain
      .then(() => {
        comment(`checking route ${route}`);
        return fetch(`http://localhost:${port}${route}`);
      })
      .then((res) => {
        assert(res.status === 200, `status code ok for ${route}`);
      });
  }, Promise.resolve());
});

run(async (assert, comment) => {
  comment("ssr accept language");

  await Promise.all(
    langFixtures.map(async (lang) => {
      res = await fetch(`http://localhost:${port}/`, {
        headers: {
          "accept-language": lang,
        },
      });
      text = await res.text();
      assert(
        text.match(/<html.*lang="(.*)">/m)[1] === lang,
        `accepted language for ${lang}`
      );
    })
  );

  res = await fetch(`http://localhost:${port}/`, {
    headers: {
      "accept-language": "invalid",
    },
  });
  text = await res.text();
  assert(
    text.match(/<html.*lang="(.*)">/m)[1] === "en",
    "fallback language works"
  );
});
