import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { mobile } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import ChampionAbilities from "@/game-lol/ChampionAbilities.jsx";
import ChampionHeaderImage from "@/game-lol/ChampionHeaderImage.jsx";
import ChampionImg from "@/game-lol/ChampionImg.jsx";
import Static from "@/game-lol/static.mjs";
import {
  getChampionLink,
  getCurrentPatchForStaticData,
  getStaticChampionById,
  getWinRateColor,
} from "@/game-lol/util.mjs";
import Tier1 from "@/inline-assets/tier-1.svg";
import Tier2 from "@/inline-assets/tier-2.svg";
import Tier3 from "@/inline-assets/tier-3.svg";
import Tier4 from "@/inline-assets/tier-4.svg";
import Tier5 from "@/inline-assets/tier-5.svg";
import PageHeader from "@/shared/PageHeader.jsx";
import { getLocaleString } from "@/util/i18n-helper.mjs";

const TIER_ICONS = {
  1: Tier1,
  2: Tier2,
  3: Tier3,
  4: Tier4,
  5: Tier5,
};

const Caption = styled("p")`
  text-align: right;
  color: var(--shade1);
`;
const WinRate = styled("span")`
  color: ${(props) => props.color || "var(--shade1)"};
  text-align: center;
`;
const Champion = styled("div")`
  display: flex;
  align-items: center;
  gap: var(--sp-4);

  &.matchup {
    text-align: right;

    .vs {
      color: var(--shade2);
      margin-right: var(--sp-2);
    }

    ${mobile} {
      display: none;
    }
  }
`;
const Matchups = styled("div")`
  display: flex;
  flex-direction: column;

  ${mobile} {
    display: none;
  }
`;

const ChampionHeader = (props) => {
  const {
    tab,
    champion,
    championStats,
    matchupChampion,
    matchupChampionStats,
    matchups,
    filters,
  } = props;
  const { t } = useTranslation();
  const patch = getCurrentPatchForStaticData();
  const isMatchupsAvailable = matchups?.length > 0;
  const championTier = championStats?.tierListTier?.tierRank;
  const TierIcon = TIER_ICONS[championTier];
  const matchupChampionTier = matchupChampionStats?.tier_ranks?.[0];

  const links = [
    {
      url: `/lol/champions/${champion.key}`,
      text: t("lol:championsPage.tabs.overview", "Overview"),
    },
    {
      url: `/lol/champions/${champion.key}/probuilds`,
      text: t("lol:championsPage.tabs.probuilds", "Pro Builds"),
    },
    {
      url: `/lol/champions/${champion.key}/trends`,
      text: t("lol:championsPage.tabs.trends", "Trends"),
    },
    {
      url: `/lol/champions/${champion.key}/counters`,
      text: t("lol:championsPage.tabs.counters", "Counters"),
    },
  ];

  const aside = (
    <>
      {matchupChampion && (
        <Champion className="matchup">
          <div>
            <h2 className="type-h5">
              <span className="vs">{t("lol:vs", "vs")}</span>
              <span>{matchupChampion?.name}</span>
            </h2>
            <ChampionAbilities champion={matchupChampion} />
          </div>
          <a href={getChampionLink(champion?.key, tab, undefined, filters)}>
            <div>
              <ChampionHeaderImage
                champion={matchupChampion}
                tier={matchupChampionTier}
                isMatchupChampion={true}
              />
            </div>
          </a>
        </Champion>
      )}
      {isMatchupsAvailable && !matchupChampion && (
        <Matchups className="gap-sp-1">
          <Caption className="type-caption">
            {t("lol:championsPage.toughestMatchups", "Toughest Matchups:")}
          </Caption>
          <ol className="flex justify-end gap-sp-1">
            {matchups.map(({ opponentChampionId, wins, games }) => {
              const matchupChampion = getStaticChampionById(
                opponentChampionId,
                patch,
                readState
              );
              const winrate = wins / (games || 1);

              return (
                <li key={opponentChampionId} className="flex column">
                  <ChampionImg
                    size={32}
                    championId={matchupChampion?.id}
                    round={false}
                  />
                  <WinRate
                    color={getWinRateColor(winrate * 100)}
                    className="type-caption"
                  >
                    {getLocaleString(winrate, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                      style: "percent",
                    })}
                  </WinRate>
                </li>
              );
            })}
          </ol>
        </Matchups>
      )}
    </>
  );

  return (
    <PageHeader
      title={champion.name}
      image={Static.getChampionImage(champion?.key)}
      accentIcon={TierIcon && <TierIcon />}
      borderColor={championTier && `var(--tier${championTier})`}
      underTitle={<ChampionAbilities champion={champion} />}
      links={links}
      aside={aside}
    />
  );
};

export default ChampionHeader;
