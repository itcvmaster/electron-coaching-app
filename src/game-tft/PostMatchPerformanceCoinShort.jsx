import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import SimpleLineChart from "@/shared/SimpleLineChart.jsx";

/**
 * Display a player's gold history if they're performing well
 * @param {Array} matches
 * @returns {JSX.Element}
 * @constructor
 */
function PostMatchPerformanceCoinShort({ matches = [] }) {
  let goldOnDeath = matches.reduce((acc, cur) => acc + cur?.value || 0, 0);
  if (goldOnDeath > 0) goldOnDeath = Math.floor(goldOnDeath / matches.length);
  // Hooks
  const { t } = useTranslation();
  // Render
  return (
    <Container>
      <div>
        <Title>
          {t("tft:postmatchInsights.avgGoldOnDeath", "Avg Gold on Death")}
        </Title>
        <SubTitle>{goldOnDeath}</SubTitle>
      </div>
      <SimpleLineChart
        margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
        data={matches.slice(0, Math.min(matches.length, 10)).reverse()}
        xField="x"
        yField="y"
        height={54}
        width={254}
        yAxisConf={{ visible: true, ticks: 7, tickRenderer: () => {} }}
        color="var(--turq)"
        circleRadius={4}
        showGridLines={false}
      />
      <Matches>
        {matches.map(({ y }, idx) => (
          <Match key={idx} $value={y || 0}>
            {y || 0}
          </Match>
        ))}
      </Matches>
    </Container>
  );
}

export default PostMatchPerformanceCoinShort;

const matchDimension = 24;
const Matches = styled("div")(() => {
  const gap = 6;
  const matchPerRow = 10;
  const width = matchDimension * matchPerRow + gap * (matchPerRow - 1);
  return `
  display: flex;
  flex-flow: row wrap;
  gap: ${gap}px;
  width: ${width}px;
  box-sizing: border-box;
`;
});
const matchColors = {
  gold: `
    background: #cda65c;
    color: var(--shade0);
  `,
  bronze: `
    background: #966e4c;
    color: var(--shade0);
  `,
  silver: `
    background: #949baa;
    color: var(--shade0);
  `,
  empty: `
    background: var(--shade5);
    color: var(--shade1);
  `,
};
const Match = styled("div")`
  width: ${matchDimension}px;
  height: ${matchDimension}px;
  font-size: ${matchDimension / 2}px;
  font-weight: bold;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  ${({ $value }) => {
    if ($value <= 5) return matchColors.gold;
    if ($value >= 6 && $value <= 10) return matchColors.silver;
    if ($value >= 11 && $value <= 20) return matchColors.bronze;
    return matchColors.empty;
  }}
`;
const Container = styled("div")`
  display: flex;
  align-items: center;
  gap: 38px;
  width: 100%;
`;
const Title = styled("div")`
  color: var(--shade1);
  font-size: 12px;
`;
const SubTitle = styled("div")`
  color: var(--turq);
  font-size: 24px;
  letter-spacing: 0.25px;
`;
