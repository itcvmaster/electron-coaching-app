import React from "react";
import { useTranslation } from "react-i18next";
import { css, styled } from "goober";

import ChampionImg from "@/game-lol/ChampionImg.jsx";
import {
  Body2 as CardHeaderTitle,
  CardContainer,
  CardHeader,
  CardInner,
  Link,
  View,
} from "@/game-lol/CommonComponents.jsx";
import MatchupRowStats from "@/game-lol/MatchupRowStats.jsx";
import { getChampionLink } from "@/game-lol/util.mjs";
import ChevronRight from "@/inline-assets/chevron-right.svg";

const VersusSymbol = styled("div")`
  box-sizing: border-box;
  color: var(--shade0);
  font-size: 0.875rem;
  height: var(--sp-8);
  line-height: var(--sp-9);
  margin: 0 auto;
  position: relative;
  text-align: center;
  width: var(--sp-8);

  &::after {
    background: var(--shade10);
    border: 2px solid var(--shade4);
    box-sizing: border-box;
    content: "";
    height: var(--sp-8);
    left: 0;
    position: absolute;
    top: 0;
    transform: rotate(45deg);
    width: var(--sp-8);
    z-index: 1;
  }

  span {
    position: relative;
    z-index: 2;
  }
`;

const CssChampionLink = css`
  display: flex;
  align-items: center;

  :hover {
    svg {
      transform: translateX(2px);
    }
  }
`;

const CssMatchupRowStats = css`
  font-size: var(--sp-3);
  padding: 10px 8px;
`;

const CssMatchupHeader = css`
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-4);
  padding: 0 var(--sp-6);
`;

const labels = ["kda", "winRate", "pickRate", "damageDealt", "banRate"];

const ChampionMatchupAppliedStats = (props) => {
  const { champion, filters, matchupChampion, specificMatchupStats } = props;

  const { t } = useTranslation();

  const translatedLabels = [
    t("common:kda", "KDA"),
    t("lol:winRate", "Win Rate"),
    t("lol:pickRate", "Pick Rate"),
    t("lol:damageDealt", "Damage Dealt"),
    t("lol:banRate", "Ban Rate"),
  ];

  const winRate = specificMatchupStats?.winRate?.[0];
  const blueHigher = winRate && winRate > 50;
  const redHigher = winRate && 100 - winRate > 50;

  return (
    <CardContainer>
      <CardHeader>
        <Link
          className={CssChampionLink}
          href={getChampionLink(
            champion?.key,
            matchupChampion?.key,
            "counters",
            filters
          )}
        >
          <CardHeaderTitle>
            {champion?.name} {t("lol:vs", "vs")} {matchupChampion?.name}
          </CardHeaderTitle>
          <ChevronRight
            style={{
              height: "var(--sp-6)",
              width: "var(--sp-6)",
              marginLeft: "var(--sp-3)",
              color: "var(--shade0)",
              transition: "var(--transition)",
            }}
          />
        </Link>
      </CardHeader>
      <CardInner>
        <View className={CssMatchupHeader}>
          <ChampionImg
            disabled
            size={40}
            championId={champion.id}
            style={{
              border: `2px ${blueHigher ? "solid" : "none"} ${
                blueHigher ? "var(--blue)" : ""
              }`,
              display: "block",
            }}
          />
          <VersusSymbol>
            <span>{t("lol:vs", "vs")}</span>
          </VersusSymbol>
          <ChampionImg
            disabled
            size={40}
            championId={matchupChampion.id}
            style={{
              border: `2px ${redHigher ? "solid" : "none"} ${
                redHigher ? "var(--red)" : ""
              }`,
              display: "block",
            }}
          />
        </View>
        {Object.entries(specificMatchupStats)
          .filter(([label]) => labels.includes(label))
          .map(([label, stats], index) => {
            return (
              <MatchupRowStats
                key={label}
                statsLabel={translatedLabels[index]}
                stats={stats}
                row={index % 2 === 0 ? "even" : "odd"}
                className={CssMatchupRowStats}
              />
            );
          })}
      </CardInner>
    </CardContainer>
  );
};

export default ChampionMatchupAppliedStats;
