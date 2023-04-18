export default function getNormalizeKey(str) {
  return typeof str === "string" ? str.toLowerCase().replace(/\W+/g, "") : "";
}
