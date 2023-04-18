const { readdirSync } = require("fs");
const { parse } = require("path");

const pkg = require("./package.json");

const packageName = pkg.name.replace("eslint-plugin-", "");

const allowedFileExtensions = [".cjs"];
const whitelistedFiles = ["eslint.cjs", "test.cjs"];

const ruleFiles = readdirSync(__dirname).filter(
  (file) =>
    allowedFileExtensions.some((filExtension) => file.endsWith(filExtension)) &&
    !whitelistedFiles.includes(file)
);

const configs = {
  all: {
    plugins: [packageName],
    rules: Object.fromEntries(
      ruleFiles.map((file) => [`${packageName}/${parse(file).name}`, "error"])
    ),
  },
};

const rules = Object.fromEntries(
  ruleFiles.map((file) => [parse(file).name, require("./" + file)])
);

module.exports = { configs, rules };
