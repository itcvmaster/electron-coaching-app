const orderArrayBy = (collection, keyOrKeys, order) =>
  Array.isArray(collection)
    ? Array.isArray(keyOrKeys)
      ? keyOrKeys
          .reverse()
          .map((key, index) =>
            orderArrayBy(
              collection,
              key,
              Array.isArray(order) && order.length > index
                ? order[index]
                : order
            )
          )
        ? collection
        : collection
      : collection.sort(
          (a, b) =>
            compare(getSortValue(a, keyOrKeys), getSortValue(b, keyOrKeys)) *
            getOrderOp(order)
        )
    : collection;

const getOrderOp = (order) =>
  -(typeof order === "string"
    ? ["asc", "_", "desc"].findIndex((v) => v.startsWith(order.toLowerCase())) -
      1
    : -1);

const compare = (a, b) => (a > b ? 1 : -1);

const getSortValue = (object, keyOrKeyFunc) =>
  keyOrKeyFunc
    ? typeof keyOrKeyFunc === "function"
      ? keyOrKeyFunc(object)
      : object[keyOrKeyFunc] || 0
    : object;

export default orderArrayBy;
