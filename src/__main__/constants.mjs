import symbolName from "@/util/symbol-name.mjs";

// Internal delimiter when converting array paths to string.
export const PATH_DELIMITER = "$";

// An object containing the `isPersistent` symbol will be persisted.
// The value corresponding to the symbol can be a timestamp, to set a custom
// expiry time.
// `isVolatile` will do the opposite.
export const isPersistent = symbolName("is-persistent");
export const isVolatile = symbolName("is-volatile");

// This symbol is mainly for internal use: it prevents unnecessary double writes.
export const isPopulatedFromDB = symbolName("is-populated-from-db");

// So what is this symbol for? This is mainly used if we expect a part of the
// initial state to be hydrated from local DB only. If it's the initial object,
// using `readData` on it will trigger a DB read.
export const isInitial = symbolName("initial");

// Time To Live (TTL) 💀🪦
const HUMAN_LIFE_EXPECTANCY_YEARS = 70;
export const EXPECTED_LIFETIME =
  Date.now() + 1000 * 60 * 60 * 24 * 365 * HUMAN_LIFE_EXPECTANCY_YEARS;

// The end of time, according to JavaScript:
// Sat, 13 Sep 275760 00:00:00 GMT
export const END_OF_TIME = 8640000000000000;
