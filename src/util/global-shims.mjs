// Currently unused! If Buffer from Node.js is needed...
// import BufferShim from "buffer";
// export const Buffer = BufferShim.Buffer;

if (process.env.NODE_ENV === "development") {
  // Must use require here as import statements are only allowed
  // to exist at top-level.
  // DISABLED because the warnings are not relevant to us.
  // require("preact/debug");
}
