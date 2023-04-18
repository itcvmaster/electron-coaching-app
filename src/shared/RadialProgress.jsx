import React from "react";

const styles = {
  transformOrigin: "center",
};

export default function RadialComponent({
  size = 200,
  background = "orange",
  strokeWidth = 4,
  data = [],
  colors = [],
  animation,
}) {
  const roundEndSize = +strokeWidth / 2; // round strokeLinecaps add to the size of the line
  const r = 100 / 2 - roundEndSize;
  const circumference = 2 * Math.PI * r;

  return (
    <svg
      width={size}
      height={size}
      style={{ display: "block" }}
      viewBox="0 0 100 100"
    >
      <circle
        r={r}
        cx="50%"
        cy="50%"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={1}
        strokeWidth={strokeWidth / 1.5}
        stroke={background}
        shapeRendering="geometricPrecision"
      />
      {animation ? (
        <circle
          r={r}
          cx="50%"
          cy="50%"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={0}
          strokeWidth={strokeWidth}
          stroke={colors[0]}
          style={{ transform: `rotate(270deg)`, ...styles, animation }}
          shapeRendering="geometricPrecision"
        />
      ) : (
        data.map((d, i) => {
          const radialStart =
            i > 0
              ? 360 * data[i - 1] - 90 + strokeWidth / 2
              : -90 + roundEndSize;
          const strokeDashoffset =
            Math.abs(circumference * d - circumference) + strokeWidth || 0;
          return (
            <circle
              key={d}
              r={r}
              cx="50%"
              cy="50%"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              stroke={colors[i] ? colors[i] : "#a29294"}
              style={{ transform: `rotate(${radialStart}deg)`, ...styles }}
              shapeRendering="geometricPrecision"
            />
          );
        })
      )}
    </svg>
  );
}
