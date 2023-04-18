function meanBy(data, item) {
  return data.reduce((total, next) => total + item(next), 0) / data.length;
}

export default meanBy;
