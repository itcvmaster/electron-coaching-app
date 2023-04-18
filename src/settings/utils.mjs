import { appURLs } from "@/app/constants.mjs";
import { devWarn } from "@/util/dev.mjs";
import globals from "@/util/global-whitelist.mjs";

export const fetchRef = {
  get fetch() {
    return this._value || globals.fetch;
  },
  set fetch(value) {
    this._value = value;
  },
};

/**
 * Instead if using a large yaml-parsing library, we will
 * just manually parse the version out of the first line of
 * the file. There is some risk that this is fragile if the
 * source changes, but we control the source and that is unlikely.
 */
export function parseWindowsVersion(yamlString) {
  const firstLine = yamlString.split("\n", 1)?.[0];

  const match = "version: ";

  if (firstLine.includes(match)) {
    return firstLine.substring(match.length);
  }

  devWarn(
    "Failed to parse version from yaml string. Confirm the yaml data is valid",
    { yamlString }
  );
}

export async function getLatestWindowsRelease() {
  const { fetch } = fetchRef;
  const response = await fetch(appURLs.BLITZ_STABLE_WINDOWS);

  if (!response.ok) {
    return;
  }

  // stream the file data into a string
  let data = "";
  const decoder = new TextDecoder();
  for await (const chunk of streamAsyncIterator(response.body)) {
    data += decoder.decode(chunk);
  }

  const version = parseWindowsVersion(data);

  return version;
}

/**
 * Instead if using a large rss-parsing library, we will
 * just manually parse the version out of the file. There is
 * some risk that this is fragile if the source changes, but
 * we control the source and that is unlikely.
 */
export function parseMacVersion(xmlString) {
  if (!xmlString.includes("<?xml")) {
    devWarn(
      "Failed to parse mac version from string. Confirm the xml data is valid.",
      { xmlString }
    );
    return;
  }

  const parser = new DOMParser();

  return parser
    .parseFromString(xmlString, "text/xml")
    .querySelector("entry > title")
    ?.firstChild?.wholeText?.trim();
}

export async function getLatestMacRelease() {
  const { fetch } = fetchRef;
  const response = await fetch(appURLs.BLITZ_STABLE_MAC);

  if (!response.ok) {
    return;
  }

  // stream the file data into a string
  let data = "";
  const decoder = new TextDecoder();
  for await (const chunk of streamAsyncIterator(response.body)) {
    data += decoder.decode(chunk);
  }

  const result = parseMacVersion(data);

  return result;
}

async function* streamAsyncIterator(stream) {
  // Get a lock on the stream
  const reader = stream.getReader();

  try {
    while (true) {
      // Read from the stream
      // eslint-disable-next-line no-await-in-loop
      const { done, value } = await reader.read();
      // Exit if we're done
      if (done) return;
      // Else yield the chunk
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
