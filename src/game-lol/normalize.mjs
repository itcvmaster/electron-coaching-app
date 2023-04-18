export default (val, max, min) => {
  const nom = val - min;
  const denom = max - min || 1;
  const result = nom / denom;
  return Number.isNaN(result) ? 0 : result;
};
