// TODO: WTF?? remove this...
const reduce = (collection, iteratee, accumulator) => {
  if (Array.isArray(collection)) {
    return collection.reduce(iteratee, accumulator);
  }
  const reduced = accumulator;
  for (const key of Object.keys(collection)) {
    iteratee(reduced, collection[key], key);
  }
  return reduced;
};

export default reduce;
