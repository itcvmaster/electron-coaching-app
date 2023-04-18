import routes from "@/routes/routes.mjs";

const authRoute = {
  path: /^\/auth/,
  component: "feature-china-auth/Auth.jsx",
};

export function setup() {
  routes.push(authRoute);
}

export function teardown() {
  const i = routes.indexOf(authRoute);
  routes.splice(i, 1);
}
