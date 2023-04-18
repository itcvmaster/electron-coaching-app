import symbolName from "@/util/symbol-name.mjs";

export const SkipGraphQLSerialization = symbolName(
  "skip-graphql-serialization"
);

const isString = (val) => typeof val === "string";
const isObject = (val) => typeof val === "object";
const isArray = (val) => Array.isArray(val);

function gqlIze(model, params) {
  if (typeof model !== "object") return "";
  return Object.entries(model)
    .map(([key, value]) => {
      if (isString(params?.[key])) key = `${key} ${params[key]}`;
      if (isObject(params?.[key])) params = params[key];

      const unwrappedValue = isArray(value) ? value[0] : value;
      if (
        isObject(unwrappedValue) &&
        Object.keys(unwrappedValue).length &&
        !unwrappedValue[SkipGraphQLSerialization]
      ) {
        return `${key} {
          ${gqlIze(unwrappedValue, params)}
        }`;
      }

      return key;
    })
    .join("\n");
}

// https://github.com/jeromecovington/graphql-compress/blob/master/index.js
export default function gql(strings, ...models) {
  const parts = [];
  for (const str of strings) {
    parts.push(str);

    const model = models.shift();
    if (model) {
      if (typeof model === "string") parts.push(model);
      else if (isArray(model)) parts.push(gqlIze(model[0], model[1]));
      else parts.push(gqlIze(model));
    }
  }

  const text = parts.join("");
  const query = text.replace(/\s+/g, " ");
  return query.replace(/\s*(\[|\]|\{|\}|\(|\)|:|\,)\s*/g, "$1").trim(); // eslint-disable-line no-useless-escape
}
