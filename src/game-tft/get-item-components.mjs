export default function getItemComponents(itemKey, itemStatic, set) {
  if (!set || !itemStatic || !itemKey) return "";
  if (itemStatic[set] && itemKey in itemStatic[set]) {
    return Object.values(itemStatic[set]).filter(
      (item) => item.key === itemKey
    )[0].buildsFrom;
  }
  return "";
}
