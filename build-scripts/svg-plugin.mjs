import fs from "node:fs/promises";
import path from "node:path";

import { rewritePath } from "./resolve-plugin.mjs";

function fillTemplate(svg, name) {
  // Add back viewbox, because svgo strips it 🥴
  // https://github.com/svg/svgo/issues/1128
  svg = svg.toString("utf-8");
  svg = svg.replace(
    /width="(.*?)" height="(.*?)"/,
    `width="$1" height="$2" viewbox="0 0 $1 $2"`
  );

  // Ensure uniqueness of SVG ids 🤡
  const ids = svg.matchAll(/id="(.*?)"/gm);
  for (const [match, id] of ids) {
    const uniqueID = `${name}-${id}`;
    svg = svg
      .replace(match, `id="${uniqueID}"`)
      .replaceAll(`url(#${id})`, `url(#${uniqueID})`);
  }

  return `import React, { useMemo } from "react";

export const svg = \`${svg}\`;

const contentRegExp = /<svg(.*?)>(.*?)<\\/svg>/s;
const attrRegExp = /(.*?)="(.*?)"/;
const splitAttrExp = /[\\w-]+="[^"]*"/g;

const attributeMap = {
  viewbox: "viewBox",
  class: "className",
};

function Icon(props) {
  const obj = useMemo(() => {
    const [, attrs, content] = svg.match(contentRegExp);
    const svgAttributes = {};
    for (const stringAttr of attrs.trim().match(splitAttrExp)) {
      let [, key, value] = stringAttr.match(attrRegExp);
      if (key in attributeMap) key = attributeMap[key];
      svgAttributes[key] = value;
    }
    return { svgAttributes, __html: content };
  }, []);

  const svgElement = useMemo(() => {
    return (
      <svg
        dangerouslySetInnerHTML={obj}
        {...obj.svgAttributes}
        {...props}
      />
    );
  }, [obj, props]);

  return svgElement;
}

export default Icon;
`;
}

// https://esbuild.github.io/plugins/
const svgPlugin = {
  name: "svg",
  setup(build) {
    build.onResolve({ filter: /\.svg$/ }, (args) => {
      return {
        path: rewritePath(args.path),
        namespace: "file",
      };
    });

    build.onLoad({ filter: /\.svg$/, namespace: "file" }, async (args) => {
      const svg = await fs.readFile(args.path);
      const name = path.basename(args.path, path.extname(args.path));
      const contents = fillTemplate(svg, name);

      return {
        contents,
        loader: "jsx",
      };
    });
  },
};

export default svgPlugin;
