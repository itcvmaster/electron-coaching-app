import { IS_APP } from "@/util/dev.mjs";

const routes = !IS_APP
  ? [
      {
        path: "/",
        component: "marketing/Home.jsx",
      },
    ]
  : [];

export default routes;
