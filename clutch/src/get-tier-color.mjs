export default (tier) => {
  const tierMap = {
    1: "var(--tier1)",
    2: "var(--tier2)",
    3: "var(--tier3)",
    4: "var(--tier4)",
    5: "var(--tier5)",
  };

  return tierMap[tier] || "";
};
