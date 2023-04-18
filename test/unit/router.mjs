import run from "tapdance";

import MockComponent from "../../test/unit/mocks/MockMeta.mjs";
import { router as routerModule } from "../../www/js/src/test.mjs";
import { deepEqual } from "./util.mjs";

const { default: router, setRoute, routesRef, NotFoundError } = routerModule;

const callStack = [];

const mockMetaInfo = { title: [, "foo"], description: [, "bar"] };

function flush() {
  callStack.splice(0, callStack.length);
}

// For testing, we use mock routes
routesRef.routes = [
  {
    path: /.*/,
    fetchData() {
      callStack.push("default");
    },
  },
  {
    path: "/",
    fetchData() {
      callStack.push("home");
    },
  },
  {
    path: "/page",
    fetchData() {
      callStack.push("page");
    },
  },
  {
    path: "/not-page",
    redirect: "/page",
  },
  {
    path: /^\/game\/(.*)/,
    fetchData([arg]) {
      callStack.push(`game-${arg}`);
    },
  },
  {
    path: "/page/meta",
    component: "../../../test/unit/mocks/MockMeta.mjs",
    fetchData() {
      callStack.push("page/meta");
    },
  },
  {
    path: "/data-not-found",
    component: "../../../test/unit/mocks/MockMeta.mjs",
    fetchData() {
      callStack.push("data-not-found");
      throw new NotFoundError();
    },
  },
];

run(async (assert, comment) => {
  comment("router");

  const promise = setRoute("/");
  assert(!router.isLoaded, "isLoaded false");
  await promise;
  assert(router.isLoaded, "isLoaded true");
  assert(
    callStack.every((_, i) => callStack[i] === ["default", "home"][i]),
    "home route"
  );
  assert(router.meta()?.title?.[0] === "common:blitz", "is default meta");
  flush();

  await setRoute("/page");
  assert(router.previousRoute.path === "/", "previous route");
  assert(
    callStack.every((_, i) => callStack[i] === ["default", "page"][i]),
    "static page"
  );
  flush();

  await setRoute("/game/asdf");
  assert(
    callStack.every((_, i) => callStack[i] === ["default", "game-asdf"][i]),
    "dynamic route"
  );
  flush();

  await Promise.all([setRoute("/page"), setRoute("/game/asdf")]);
  assert(
    callStack.every(
      (_, i) => callStack[i] === ["default", "default", "page", "game-asdf"][i]
    ),
    "fetchData called in parallel"
  );
  flush();

  try {
    await setRoute("/data-not-found");
  } catch (e) {
    assert(e instanceof NotFoundError, "is NotFoundError");
    assert(e.statusCode === 404, "404 status code");
    assert(router.error === e, "error is set");
  }
  assert(
    callStack.every(
      (_, i) => callStack[i] === ["default", "data-not-found"][i]
    ),
    "routes with data fetch error"
  );
  assert(router.RouteComponent() === MockComponent, "still renders component");
  flush();

  await setRoute("/page/meta");
  assert(deepEqual(router.meta(), mockMetaInfo), "route meta function set");
  flush();
});

run(async (assert, comment) => {
  comment("router redirect");
  try {
    await setRoute("/not-page");
    assert(false, "did not redirect");
  } catch (error) {
    assert(error.statusCode === 303, "redirect status code");
    assert(error.redirect === "/page", "redirect route");
  }
});
