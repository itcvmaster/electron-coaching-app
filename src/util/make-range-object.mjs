export default function makeRangeObject(settings) {
  return Object.entries(settings).reduce((acc, [rangeStr, color]) => {
    if (!rangeStr.includes("-")) {
      acc[Number(rangeStr)] = color;
      return acc;
    }
    const [start, end] = rangeStr.split("-").map(Number);
    let i = start;
    while (i >= start && i <= end) {
      acc[i] = color;
      i++;
    }
    return acc;
  }, []);
}
