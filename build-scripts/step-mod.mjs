import fs from "node:fs/promises";

// Just for fun :)
async function modStep() {
  const modPath = "node_modules/goober/dist/goober.modern.js";
  const distFile = await fs.readFile(modPath, "utf8");
  const moddedContent = distFile.replaceAll(
    /101\*(.*?)\+(.*?)>>>0;.*?\+.*?}/gm,
    `101*$1+$2>>>0;return "⚡"+$1.toString(36)}`
  );
  await fs.writeFile(modPath, moddedContent, "utf8");
}

export default modStep;
