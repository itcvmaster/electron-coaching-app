import { readData } from "@/__main__/get-data.mjs";
import UserSettingsChangeListener from "@/feature-auth/user-settings-change-listener.mjs";
import routes, { defaultRoute } from "@/routes/routes.mjs";

const authRoute = {
  path: "/account",
  component: "feature-auth/Auth.jsx",
};

const originals = {};

export function setup() {
  routes.push(authRoute);
  originals.defaultFetchData = defaultRoute.fetchData;

  // Monkey-patch the default route to also read user. 🐒
  defaultRoute.fetchData = async function () {
    await originals.defaultFetchData.apply(this, arguments);
    await readData(["user"]);

    // initialize the settings onChange middleware after initial settings were loaded
    UserSettingsChangeListener.setup();
  };
}

export function teardown() {
  const i = routes.indexOf(authRoute);
  routes.splice(i, 1);
  defaultRoute.fetchData = originals.defaultFetchData;

  UserSettingsChangeListener.teardown();
}
