import React from "react";
import { useTranslation } from "react-i18next";
import { css, styled } from "goober";

import { mobile, tablet } from "clutch";

import ChampionImg from "@/game-lol/ChampionImg.jsx";
import { Body2, Caption, View } from "@/game-lol/CommonComponents.jsx";
import ChevronLeft from "@/inline-assets/chevron-left.svg";
import ChevronRight from "@/inline-assets/chevron-right.svg";
import { calcRate } from "@/util/helpers.mjs";

const VersusSymbol = styled("div")`
  box-sizing: border-box;
  display: grid;
  place-content: center;
  color: var(--shade0);
  height: var(--sp-8);
  margin: 0 auto;
  position: relative;
  text-align: center;
  width: var(--sp-8);

  > * {
    position: relative;
  }

  &:before {
    content: "";
    position: absolute;
    background: var(--shade8);
    border: 2px solid var(--shade6);
    box-sizing: border-box;
    width: var(--sp-8);
    height: var(--sp-8);
    left: 0;
    top: 0;
    transform: rotate(45deg);
  }

  span {
    position: relative;
    z-index: 2;
  }
`;

const ChampionContainer = styled("div")`
  flex-grow: 1;
  width: 234px;
  text-align: center;
`;

const ChampionImage = styled("div")`
  border-radius: 50%;
  display: inline-block;
  position: relative;
  overflow: hidden;
`;

const ChampionName = styled("div")`
  font-size: var(--sp-5);
  font-weight: 700;
  line-height: var(--sp-8);
  margin-top: var(--sp-3);
`;

const ChevronContainer = styled("div")`
  display: flex;
  font-size: var(--sp-10);
  height: 40px;
  position: relative;
  width: 50px;
`;

const CssChampionMatchupStatsHeader = css`
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-4);
  padding: 48px 24px var(--sp-3);
  ${tablet} {
    padding: 46px var(--sp-4) var(--sp-3);
  }
  ${mobile} {
    align-items: flex-start;
    justify-content: space-around;
  }
`;

const CssChevronContainer = (color) => css`
  color: ${color};
`;

const CssMatchupContainer = css`
  width: 164px;
  ${mobile} {
    width: auto;
  }
`;

const CssVsContainer = css`
  align-items: center;
  margin-top: var(--sp-6);
  ${mobile} {
    margin-top: var(--sp-4);
  }
`;

const CssChampionImage = (color) => css`
  border: 2px solid ${color};
`;

const ChampionMatchupStatsHeader = (props) => {
  const {
    champion,
    matchupChampion,
    specificMatchupStats,
    filterKey,
    viewMode,
    ...restProps
  } = props;

  const { t } = useTranslation();
  const winRate = calcRate(
    specificMatchupStats?.championStats[filterKey] * 100,
    specificMatchupStats?.championStats?.games,
    1
  );
  const championColor = winRate >= 50 ? "var(--turq)" : "var(--shade2)";
  const matchupChampionColor = winRate < 50 ? "var(--red)" : "var(--shade2)";

  return (
    <View className={CssChampionMatchupStatsHeader} {...restProps}>
      <ChampionContainer>
        <ChampionImage className={CssChampionImage(championColor)}>
          <ChampionImg
            disabled
            size={viewMode === "mobile" ? 64 : 96}
            championId={champion.id}
            style={{
              display: "block",
              transform: "scale(1.15)",
            }}
          />
        </ChampionImage>
        <ChampionName style={{ color: `${championColor}` }}>
          {champion?.name}
        </ChampionName>
        <Body2 style={{ color: `${championColor}` }}>
          {t("lol:percentWinrate", "{{winrate}}% Win Rate", {
            winrate: winRate,
          })}
        </Body2>
      </ChampionContainer>
      <div className={CssMatchupContainer}>
        <View className={CssVsContainer}>
          <ChevronContainer
            className={`flex align-center flex-start ${CssChevronContainer(
              championColor
            )}`}
          >
            <ChevronLeft />
          </ChevronContainer>
          <VersusSymbol>
            <Caption>{t("lol:vs", "vs")}</Caption>
          </VersusSymbol>
          <ChevronContainer
            className={`flex align-center flex-end ${CssChevronContainer(
              matchupChampionColor
            )}`}
          >
            <ChevronRight />
          </ChevronContainer>
        </View>
      </div>
      <ChampionContainer>
        <ChampionImage className={CssChampionImage(matchupChampionColor)}>
          <ChampionImg
            disabled
            size={viewMode === "mobile" ? 64 : 96}
            round
            championId={matchupChampion.id}
            style={{
              display: "block",
              transform: "scale(1.15)",
            }}
          />
        </ChampionImage>
        <ChampionName style={{ color: `${matchupChampionColor}` }}>
          {matchupChampion?.name}
        </ChampionName>
        <Body2 style={{ color: `${matchupChampionColor}` }}>
          {t("lol:percentWinrate", "{{winrate}}% Win Rate", {
            winrate: (100 - winRate).toPrecision(3),
          })}
        </Body2>
      </ChampionContainer>
    </View>
  );
};

export default ChampionMatchupStatsHeader;
