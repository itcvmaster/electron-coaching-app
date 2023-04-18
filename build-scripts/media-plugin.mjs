import fs from "node:fs/promises";

import { rewritePath } from "./resolve-plugin.mjs";

// https://esbuild.github.io/plugins/
const mediaPlugin = {
  name: "media-dataurl",
  setup(build) {
    const fileRegExp = /\.(png|jpe?g|gif|webp)$/;

    build.onResolve({ filter: fileRegExp }, (args) => {
      return {
        path: rewritePath(args.path),
        namespace: "file",
      };
    });

    build.onLoad({ filter: fileRegExp, namespace: "file" }, async (args) => {
      const contents = await fs.readFile(args.path);

      return {
        contents,
        loader: "dataurl",
      };
    });
  },
};

export default mediaPlugin;
