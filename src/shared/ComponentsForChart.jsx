import React from "react";
import ReactDOM from "react-dom";
import { css, styled } from "goober";
import { axisBottom, axisLeft, axisTop } from "d3-axis";
import { select } from "d3-selection";
import { area as d3area, line as d3line } from "d3-shape";

import CaretDown from "@/inline-assets/caret-down.svg";
import CaretUp from "@/inline-assets/caret-up.svg";
import { IS_NODE } from "@/util/dev.mjs";
import globals from "@/util/global-whitelist.mjs";

const TooltipContainerWithArrow = css`
  font-family: "Inter", Arial, Helvetica, sans-serif;
  position: absolute;
  z-index: 999999;
  color: #fff;
  background-color: var(--shade10);
  padding: var(--sp-2_5);
  border-radius: var(--br);
  font-size: var(--sp-3_5);
  font-family: "Inter", Arial, Helvetica, sans-serif;
  pointer-events: none;
  transform: translate(-105%, -50%);
  white-space: nowrap;

  &::after {
    content: " ";
    border: 8px solid var(--shade10);
    position: absolute;
    top: 100%; /* At the bottom of the tooltip */
    left: 50%;
    border-left-width: 8px;
    border-right-width: 8px;
    border-bottom-width: 0px;
    /* transform: translate(50%, 0%); */
    margin-left: -6px;
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
  }
`;

const TooltipContainer = css`
  font-family: "Inter", Arial, Helvetica, sans-serif;
  position: absolute;
  z-index: 999999;
  color: #fff;
  background-color: var(--shade10);
  padding: var(--sp-2_5);
  border-radius: var(--br);
  font-size: var(--sp-3_5);
  font-family: "Inter", Arial, Helvetica, sans-serif;
  pointer-events: none;
  transform: translate(-105%, -50%);
  white-space: nowrap;
`;
const CaretContainer = styled("foreignObject")`
  pointerevents: none;
  cursor: pointer;

  svg {
    width: 1rem;
  }
`;

const useD3 = (renderChartFn, dependencies) => {
  const ref = React.useRef();

  React.useEffect(() => {
    renderChartFn(select(ref.current));
    return () => {};
  }, [renderChartFn, dependencies]);
  return ref;
};

function Tooltip({
  children,
  position = {},
  showArrow = true,
  placement,
  offsetY = 0,
  offsetX = 3,
}) {
  return (
    <div
      className={showArrow ? TooltipContainerWithArrow : TooltipContainer}
      style={{
        left: position.left + globals.scrollX + offsetX,
        top: position.top + globals.scrollY + offsetY,
        transform:
          placement === "left"
            ? "translate(-110%, -50%)"
            : "translate(-50%, -120%)",
      }}
    >
      <div className="tooltip-content">{children}</div>

      <div className="tooltip-arrow"></div>
    </div>
  );
}

function AreaWithGradient({
  data,
  xScale,
  yScale,
  xField,
  yField,
  className,
  clipPathId,
  css,
}) {
  const area = d3area()
    .x((d) => xScale(d[xField]))
    .y1((d) => yScale(d[yField]))
    .y0(() => yScale(0));

  return (
    <g
      className={className}
      clipPath={clipPathId ? `url(#${clipPathId})` : ""}
      css={css}
    >
      <defs>
        {data[0] && (
          <linearGradient
            id={`areaGradient`}
            key={`areaGradient`}
            gradientTransform="rotate(90)"
          >
            <stop offset="0%" stopColor={data[0].color} stopOpacity="1" />
            <stop offset="100%" stopColor={data[0].color} stopOpacity="0" />
          </linearGradient>
        )}
      </defs>
      <path
        d={area(data)}
        style={{ fill: `url(#areaGradient)`, fillOpacity: 0.15 }}
      ></path>
    </g>
  );
}

function Area({
  data,
  xScale,
  yScale,
  xField,
  yField,
  className,
  clipPathId,
  css,
  style,
}) {
  const area = d3area()
    .x((d) => xScale(d[xField]))
    .y1((d) => yScale(d[yField]))
    .y0(() => yScale(0));

  return (
    <g
      className={className}
      clipPath={clipPathId ? `url(#${clipPathId})` : ""}
      css={css}
      style={style}
    >
      <path d={area(data)}></path>
    </g>
  );
}

function Circle({
  data,
  xScale,
  yScale,
  radius,
  xField,
  yField,
  className,
  onMouseOver = () => {},
  onMouseOut = () => {},
  clipPathId,
  color,
  css,
  style,
}) {
  return (
    <g className={className} clipPath={clipPathId ? `url(#${clipPathId})` : ""}>
      {data.map((d, index) => {
        return (
          <circle
            cx={xScale(d[xField])}
            cy={yScale(d[yField])}
            r={radius}
            key={index}
            onMouseOver={(event) => {
              onMouseOver({ event, data: d });
            }}
            onMouseOut={onMouseOut}
            css={css}
            style={color ? { fill: color(d) } : style ? style : {}}
          />
        );
      })}
    </g>
  );
}

function VerticalCrossHair({ xStart, xEnd, yStart, yEnd, className }) {
  return (
    <path
      className={className}
      d={`M ${xStart} ${yStart} L ${xEnd} ${yStart} L ${xEnd} ${yEnd} L ${xStart} ${yEnd} Z`}
    ></path>
  );
}

function HorizontalGridLines({ xScale, yScale, className, ticks }) {
  const range = xScale.range();
  return (
    <g className={className}>
      {ticks.map((tickValue, index) => {
        const yPx = yScale(tickValue);
        return (
          <path
            key={index}
            d={`M ${range[0]} ${yPx} L ${range[1]} ${yPx}`}
          ></path>
        );
      })}
    </g>
  );
}

function XAxisWithImage({
  xScale,
  offset,
  orientation,
  className,
  images,
  imageWidth,
  imageHeight,
}) {
  const imageInfo = xScale.domain().map((d, i) => {
    return {
      image: images[i],
      x: xScale(d),
      y: 0,
    };
  });

  return (
    <g className={className} transform={`translate(0,${offset})`}>
      <React.Fragment>
        {imageInfo.map((tick, index) => {
          return (
            <g transform={`translate(${tick.x}, ${tick.y})`} key={index}>
              <clipPath id={`clip${orientation}${tick.x}`}>
                <circle cx={0} cy={imageHeight / 2} r={20}></circle>
              </clipPath>
              <image
                href={tick.image}
                x={-imageWidth / 2}
                y={0}
                width={imageWidth}
                height={imageHeight}
                clipPath={`url(#clip${orientation}${tick.x})`}
              ></image>
              <circle
                cx={0}
                cy={imageHeight / 2}
                r={20}
                style={{ strokeWidth: "2px", stroke: "blue", fillOpacity: 0 }}
              ></circle>
            </g>
          );
        })}
      </React.Fragment>
    </g>
  );
}

function YAxisWithImage({
  yScale,
  offset,
  className,
  images,
  imageWidth,
  imageHeight,
  yAxisConf,
}) {
  const imageInfo = [0, 1, 2].map((d, i) => {
    return {
      image: images[i],
      x: 0,
      y: yScale(yAxisConf.tickValues[i]),
    };
  });

  return (
    <g className={className} transform={`translate(${offset}, 0)`}>
      {imageInfo.map((tick, index) => {
        return (
          <g transform={`translate(${tick.x}, ${tick.y})`} key={index}>
            <foreignObject
              x={-imageWidth / 2}
              y={-imageHeight / 2}
              width={imageWidth}
              height={imageHeight}
            >
              {tick.image}
            </foreignObject>
          </g>
        );
      })}
    </g>
  );
}

function Line({
  data,
  xScale,
  yScale,
  xField,
  yField,
  className,
  clipPathId,
  css,
}) {
  const line = d3line()
    .x((d) => xScale(d[xField]))
    .y((d) => yScale(d[yField]))
    .defined((d) => d[yField] !== null);

  return (
    <g
      className={className}
      clipPath={clipPathId ? `url(#${clipPathId})` : ""}
      css={css}
    >
      <path d={line(data)} style={{ fillOpacity: 0 }}></path>
    </g>
  );
}

class TooltipPortal extends React.Component {
  constructor(props) {
    super(props);
    if (typeof globals.document !== "undefined") {
      this.el = globals.document.createElement("div");
    }
  }

  componentDidMount() {
    let portalRoot = globals.document.getElementById("tooltip-root");
    if (!portalRoot) {
      const div = globals.document.createElement("div");
      div.id = "tooltip-root";
      globals.document.body.appendChild(div);
      portalRoot = div;
    }
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    portalRoot.appendChild(this.el);
  }

  render() {
    if (IS_NODE) return null;
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

function Triangle({
  data,
  xScale,
  yScale,
  xField,
  yField,
  className,
  clipPathId,
  imageSize = 16,
  dy = 10,
}) {
  return (
    <g className={className} clipPath={clipPathId ? `url(#${clipPathId})` : ""}>
      {data.map((d, index) => {
        const x = xScale(d[xField]);
        const y = yScale(d[yField]);

        if (!d.promotion) return null;

        return (
          <CaretContainer
            key={index}
            transform={`translate(${x},${d.promotion === 2 ? y - dy : y + dy})`}
            x={-imageSize / 2}
            y={-imageSize / 2}
            width={imageSize}
            height={imageSize}
            style={{
              color: d.promotion === 2 ? "var(--turq)" : "var(--red)",
            }}
          >
            {d.promotion === 2 ? <CaretUp /> : <CaretDown />}
          </CaretContainer>
        );
      })}
    </g>
  );
}

const xAxis = (
  container,
  scale,
  offset,
  { tickCount, orientation, tickFormat, tickValues }
) => {
  const axisCls = orientation === "top" ? axisTop : axisBottom;
  const axis = axisCls(scale)
    .ticks(tickCount)
    .tickSizeOuter(0)
    .tickSizeInner(0);

  if (tickFormat) axis.tickFormat(tickFormat);
  if (tickValues) axis.tickValues(tickValues);
  container
    .attr("transform", `translate(0,${offset})`)
    .call(axis)
    .call((g) => g.select(".domain").remove());
};

function XAxis({ xScale, offset, xAxisConf, className }) {
  const ref = useD3(
    (group) => {
      xAxis(group, xScale, offset, xAxisConf);
    },
    [xScale, xAxisConf.show]
  );

  return <g ref={ref} className={className}></g>;
}

const yAxis = (
  container,
  scale,
  offset,
  { tickCount, tickFormat, tickValues }
) => {
  const axis = axisLeft(scale)
    .ticks(tickCount)
    .tickSizeOuter(0)
    .tickSizeInner(0);
  if (tickFormat) axis.tickFormat(tickFormat);
  if (tickValues) axis.tickValues(tickValues);
  return container
    .attr("transform", `translate(${offset},0)`)
    .call(axis)
    .call((g) => g.select(".domain").remove());
};

function YAxis({ yScale, yAxisConf, offset, tickValues, className }) {
  const ref = useD3(
    (group) => {
      yAxis(group, yScale, offset, { ...yAxisConf, tickValues });
    },
    [yAxisConf.show, yAxisConf.tickCount, yScale]
  );
  return <g ref={ref} className={className}></g>;
}

export {
  Area,
  AreaWithGradient,
  Circle,
  HorizontalGridLines,
  Line,
  Tooltip,
  TooltipPortal,
  Triangle,
  useD3,
  VerticalCrossHair,
  XAxis,
  XAxisWithImage,
  YAxis,
  YAxisWithImage,
};
