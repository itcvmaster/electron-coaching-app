import orderBy from "@/util/order-array-by.mjs";

const getTraits = (traits, max) => {
  const hasTraitStyle = Number.isInteger(traits?.length && traits[0].style);

  let sortedTraits;
  if (hasTraitStyle) {
    sortedTraits = orderBy(traits, "style", "desc")
      .filter((trait) => trait.style !== 0)
      .slice(0, max);
  } else {
    sortedTraits = orderBy(
      traits,
      (trait) => trait.tier_current / trait.tier_total,
      "desc"
    )
      .filter((trait) => trait.tier_current !== 0)
      .slice(0, max);
  }
  return sortedTraits;
};

export default getTraits;
