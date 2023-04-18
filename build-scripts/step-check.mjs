import fs from "node:fs/promises";
import path from "node:path";

import {
  CODE_EXT_REGEXP,
  DIR_FEATURE_REGEXP,
  EXEMPT_REGEXP,
  expandDirectoriesPromise,
  FEATURE_IMPORT_REGEXP,
  GAME_IMPORT_REGEXP,
  HARDCODE_URL_REGEXP,
  NAUGHTY_REGEXP,
  SYMBOL_REGEXP,
  WHITELIST_DIRECTORIES,
} from "./constants.mjs";

async function checkStrings() {
  const getFileContents = async (dirname, cb) => {
    const listing = await fs.readdir(`src/${dirname}`, {
      withFileTypes: true,
    });
    await Promise.all(
      listing.map(async (dirent) => {
        const content = await fs.readFile(
          `src/${dirname}/${dirent.name}`,
          "utf8"
        );
        cb(content, dirent);
      })
    );
  };
  await Promise.all(
    [...WHITELIST_DIRECTORIES].map((dirname) => {
      return getFileContents(dirname, (content, dirent) => {
        if (dirname === "vendor") return null;

        checkGenericFile(dirname, content, dirent);

        if (["shared", "util", "__main__", "app"].includes(dirname))
          return checkSharedFile(dirname, content, dirent);

        if (dirname.startsWith("feature-")) return null;
        if (dirname.startsWith("game-"))
          checkGameFile(dirname, content, dirent);
        return checkBaseFile(dirname, content, dirent);
      });
    })
  );
}

function checkGenericFile(dirname, content, dirent) {
  if (SYMBOL_REGEXP.test(content) && dirent.name !== "symbol-name.mjs")
    throw new Error(
      `The file "${dirent.name}" in "${dirname}" may not contain Symbol. ` +
        `Use util/symbol-name.mjs instead.`
    );
}

function checkGameFile(dirname, content, dirent) {
  const matches = content.matchAll(GAME_IMPORT_REGEXP);
  for (const match of matches) {
    // Exception: TFT is practically the same game as LoL.
    const fromTFTtoLoL = dirname === "game-tft" && match[2] === "lol";
    const fromLoLtoTFT = dirname === "game-lol" && match[2] === "tft";
    if (fromTFTtoLoL || fromLoLtoTFT) continue;

    // Check matching game directory.
    if (dirname !== `game-${match[2]}`)
      throw new Error(
        `The file "${dirent.name}" in "${dirname}" may not import from "game-${match[2]}". ` +
          `If this is a shared file, move it into "shared".`
      );
  }
}

function checkSharedFile(dirname, content, dirent) {
  if (NAUGHTY_REGEXP.test(content) && !EXEMPT_REGEXP.test(content))
    throw new Error(
      `The file "${dirent.name}" in "${dirname}" may not contain game-specific code.`
    );
}

function checkBaseFile(dirname, content, dirent) {
  if (
    CODE_EXT_REGEXP.test(dirent.name) &&
    HARDCODE_URL_REGEXP.test(content) &&
    !EXEMPT_REGEXP.test(content)
  )
    throw new Error(
      `The file "${dirent.name}" in "${dirname}" may not contain hard-coded URLs.`
    );
  if (!DIR_FEATURE_REGEXP.test(dirname) && FEATURE_IMPORT_REGEXP.test(content))
    throw new Error(
      `The file "${dirent.name}" in "${dirname}" may not import any feature-flagged modules.`
    );
}

async function checkStep() {
  await expandDirectoriesPromise;
  const listing = await fs.readdir("src/", { withFileTypes: true });
  const dirs = Array.prototype.filter.call(listing, (dirent) =>
    dirent.isDirectory()
  );
  for (const dir of dirs) {
    if (!WHITELIST_DIRECTORIES.has(dir.name))
      throw new Error(`Directory "${dir.name}" is not whitelisted.`);

    /* eslint-disable no-await-in-loop */
    const subListing = await fs.readdir(`src/${dir.name}`, {
      /* eslint-enable no-await-in-loop */
      withFileTypes: true,
    });
    const subDirs = Array.prototype.filter.call(subListing, (dirent) =>
      dirent.isDirectory()
    );
    if (subDirs.length) {
      throw new Error(
        `Deeply nested directories not allowed: ${subDirs.map(
          (_) => `"${_.name}"`
        )}`
      );
    }
    const subFiles = Array.prototype.filter.call(subListing, (dirent) =>
      dirent.isFile()
    );
    for (const file of subFiles) {
      checkFileName(file);
    }
  }
  await checkStrings();
}

function checkFileName(file) {
  const { name } = file;
  const ext = path.extname(name);

  if (name.startsWith("index"))
    throw new Error(
      `"index" is invalid because imports must refer to a filename not a directory.`
    );

  if (/(old|new)(.*?)\.(m?jsx?)$/i.test(name))
    throw new Error(
      `"${name}" may not contain restricted keywords, like old, new.`
    );

  switch (ext) {
    case ".jsx": {
      const firstChar = name.charAt(0);
      if (!name.startsWith("use") && firstChar.toUpperCase() !== firstChar)
        throw new Error(
          `JSX filename "${name}" must start with capital letter, and contain ComponentName, OR start with use.`
        );
      const dotMatch = name.match(/\.(.*)?\./);
      if (dotMatch && dotMatch[1] !== "style")
        throw new Error(`JSX filename "${name}" can only contain ".style".`);
      break;
    }
    case ".mjs": {
      if (name.startsWith("__")) return;
      if (name.toLowerCase() !== name)
        throw new Error(
          `MJS filename "${name}" must-be-dasherized and may not contain UPPERCASE.`
        );
      break;
    }
    case ".js": {
      throw new Error(
        `Invalid "${name}": use either MJS for plain ES module, or JSX if parsing is required.`
      );
    }
  }
}

export default checkStep;
