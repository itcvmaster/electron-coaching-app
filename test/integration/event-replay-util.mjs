import { readFile } from "fs/promises";

export async function getEventReplay(filename) {
  try {
    return JSON.parse(
      await readFile(`./test/integration/__event-replay__/${filename}.json`)
    );
  } catch (e) {
    return false;
  }
}
