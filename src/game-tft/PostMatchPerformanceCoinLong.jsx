import React, { useCallback, useState } from "react";
import { styled } from "goober";

import SimpleLineChart from "@/shared/SimpleLineChart.jsx";

// Static values
const commentWidth = 220;
const avatarSize = 40;

/**
 * Display a player's gold history and show improvements
 * @param {Array} matches
 * @returns {JSX.Element}
 * @constructor
 */
function PostMatchPerformanceCoinLong({ rounds = [] }) {
  const [width, setWidth] = useState(0);
  const [chart, setChart] = useState({ x: 0, y: 0 });
  // SimpleLineChart requires a hard pixel value to render the graph
  const boxRef = useCallback((node) => {
    if (node) setWidth(node.clientWidth);
  }, []);
  // TFT specific chart overrides
  const chartRef = useCallback((node) => {
    if (node) {
      const circles = node.querySelectorAll("circle");
      if (circles.length >= 3) {
        // Set x, y position for our sticky comment
        const target = circles[circles.length - 3]; // Always 3rd last item
        setChart({
          x: Number(target.getAttribute("cx")),
          y: Number(target.getAttribute("cy")),
        });
        // Forcibly change the fill color of the circle
        target.style.fill = "var(--red)";
      }
    }
  }, []);
  // TFT data transformation to supply data to SimpleLineChart
  const graph = rounds.map(({ value: y }, x) => ({
    x: x + 1,
    y,
  }));
  return (
    <Box ref={boxRef}>
      {width === 0 ? null : (
        <div ref={chartRef}>
          <SimpleLineChart
            margin={{
              // To make the avatar look centered for each plot
              left: avatarSize / 2,
              right: avatarSize / 2,
              top: 0,
              bottom: 0,
            }}
            data={graph}
            xField="x"
            yField="y"
            height={250}
            width={width}
            yAxisConf={{ visible: true, ticks: 7, tickRenderer: () => {} }}
            color="var(--turq)"
            circleRadius={6}
            showGridLines
          />
          <Rounds>
            {rounds.map(({ round, avatar, comment, isWinner }) => (
              <Round key={round} $isComment={!!comment}>
                {round}
                <Avatar url={avatar} $isWin={isWinner} $isLoss={!isWinner} />
                {comment ? (
                  <Comment $x={avatarSize / 2} $y={chart.y + avatarSize / 2}>
                    {comment}
                  </Comment>
                ) : null}
              </Round>
            ))}
          </Rounds>
        </div>
      )}
    </Box>
  );
}

export default PostMatchPerformanceCoinLong;

const Box = styled("div", React.forwardRef)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--sp-6);
`;

const Rounds = styled("div")`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  position: relative;
`;

const Round = styled("div")`
  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: var(--shade0);
  position: relative;
  opacity: ${(props) => (props.$isComment ? 1 : 0.3)};
`;

const Avatar = styled("div")`
  width: ${avatarSize}px;
  height: ${avatarSize}px;
  background-color: var(--shade3);
  background-image: url(${({ url }) => url});
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 50%;
  flex-shrink: 0;
  box-sizing: border-box;
  border-width: 2px;
  border-style: solid;
  border-color: ${({ $isWin, $isLoss }) =>
    $isWin ? "var(--blue)" : $isLoss ? "var(--red)" : "transparent"};
`;

const Comment = styled("div")`
  ${({ $x, $y }) => {
    return `
      z-index: 1;
      position: absolute;
      bottom: ${$y}px;
      left: ${
        // center the comment
        $x - commentWidth / 2
      }px;
      width: ${commentWidth}px;
      box-sizing: border-box;
      font-weight: 500;
      font-size: 16px;
      color: var(--shade0);
      padding: 20px;
      background-color: var(--shade10);
      border-radius: 8px;
      &:before {
        content: "";
        position: absolute;
        width: 12px;
        height: 12px;
        background-color: var(--shade10);
        bottom: -6px;
        left: ${
          // rotated box to represent a pseudo down arrow
          commentWidth / 2 - 6
        }px;
        transform: rotate(45deg);
      }
    `;
  }}
`;
