const styleToColor = (style) => {
  const styles = {
    1: "bronze",
    2: "silver",
    3: "gold",
    4: "prismatic",
  };

  return styles[style] || "bronze";
};

export default styleToColor;
