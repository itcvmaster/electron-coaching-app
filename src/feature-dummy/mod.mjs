import * as Dummy from "@/feature-dummy/Dummy.jsx";
import routes from "@/routes/routes.mjs";

const dummyRoute = {
  path: /^\/dummy/,
  component: Dummy, // "feature-dummy/Dummy.jsx"
};

export const featureDummy = {};

export function setup() {
  featureDummy.didSetup = true;
  routes.push(dummyRoute);
}

export function teardown() {
  featureDummy.didTeardown = true;
  const i = routes.indexOf(dummyRoute);
  routes.splice(i, 1);
}
