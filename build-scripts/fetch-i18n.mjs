import color from "ansi-colors";
import { transformNamespace } from "i18next-v4-format-converter";
import fs from "node:fs/promises";
import fetch from "node-fetch";

const API_URL = "https://api.locize.io";
const PROJECT_ID = "8f54d9b0-8142-416f-89b2-ad6db8ccb4c4";

const VERSION = "latest";
const BATCH_MODULO = 3;

const languages = {};
const namespaces = {};
const resources = {};

export default async function i18nStep() {
  const t0 = Date.now();
  const downloads = await fetch(
    `${API_URL}/download/${PROJECT_ID}/${VERSION}`
  ).then((_) => _.json());

  for (const hash of downloads) {
    // eslint-disable-next-line no-unused-vars
    const [_, __, language, namespace] = hash.key.split("/");
    if (!resources[language]) {
      resources[language] = {};
    }
    languages[language] = true;
    namespaces[namespace] = true;
    resources[language][
      namespace
    ] = `${API_URL}/${PROJECT_ID}/${VERSION}/${language}/${namespace}`;
  }

  process.stdout.write(color.magenta(`fetch: `));
  const batches = Object.keys(resources).reduce(
    (a, key, i) => {
      const t = a[i % BATCH_MODULO];
      t.push(key);
      return a;
    },
    new Array(BATCH_MODULO).fill().map(() => [])
  );
  for (const batch of batches) {
    /* eslint-disable no-await-in-loop */
    await Promise.all(
      /* eslint-enable no-await-in-loop */
      batch.map((language) => {
        process.stdout.write(`${color.blue(language)} `);
        return Promise.all(
          Object.entries(resources[language]).map(
            async ([namespace, resourceURL]) => {
              const resource = await fetch(resourceURL).then((_) => _.json());
              const output = `export default ${JSON.stringify(
                flatten(transformNamespace(language, resource)),
                null,
                2
              )};`;
              await fs.writeFile(
                `src/i18n/__${language}.${namespace}.mjs`,
                output
              );
            }
          )
        );
      })
    );
  }
  process.stdout.write(color.green(`${Date.now() - t0}ms\n`));

  await Promise.all(
    Object.keys(languages).map((language) => {
      return fs.writeFile(
        `src/i18n/__resources.${language}.mjs`,
        `${Object.keys(resources[language])
          .map((namespace) => {
            return `import ${language.replace(
              /-/g,
              ""
            )}_${namespace} from '@/i18n/__${language}.${namespace}.mjs';`;
          })
          .join("\n")}
const resources = {};
resources["${language}"] = {
${[
  ...Object.keys(resources[language]).map((namespace) => {
    return `  ["${namespace}"]: ${language.replace(/-/g, "")}_${namespace},`;
  }),
  `};`,
].join("\n")}
export default resources;`
      );
    })
  );

  await fs.writeFile(
    `src/i18n/__init.mjs`,
    `export default {
  keySeparator: false,
  languages: [${Object.keys(languages)
    .map((x) => `'${x}'`)
    .join(", ")}],
  namespaces: [${Object.keys(namespaces)
    .map((x) => `'${x}'`)
    .join(", ")}],
}`
  );
}

function flatten(obj, levels = []) {
  const clone = {};
  for (const key in obj) {
    const value = obj[key];
    if (value && typeof value === "object") {
      Object.assign(clone, flatten(value, levels.concat(key)));
      continue;
    }
    clone[levels.concat(key).join(".")] = value;
  }
  return clone;
}
