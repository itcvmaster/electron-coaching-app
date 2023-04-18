import React, { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { Button, Card } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import { winRatecolorRange } from "@/app/util.mjs";
import Static from "@/game-lol/static.mjs";
import { getDerivedId } from "@/game-lol/util.mjs";
import { getLocale } from "@/util/i18n-helper.mjs";

const List = styled("div")`
  padding: var(--sp-3) 0;

  li {
    list-style: none;

    > a {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--sp-2) var(--sp-6);
      transition: background var(--transition);

      &:hover {
        background: var(--shade6);
      }
    }

    .col {
      display: flex;
      align-items: center;
    }

    .summoner-icon {
      width: var(--sp-10);
      height: var(--sp-10);
      margin-right: var(--sp-3);
      border-radius: 50%;
    }

    .summoner-name {
      max-width: 13ch;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .record {
      color: var(--shade2);
    }

    .stat-col {
      text-align: right;
    }
  }
`;

const BtnFrame = styled("div")`
  padding: var(--sp-6);
  padding-top: 0;
`;

const Winrate = styled("span")`
  color: ${({ winrate }) => (winrate ? winrate : "inherit")};
`;

const ContentLoader = styled("div")`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.8);
`;

const ChampionStatsLoader = () => (
  <ContentLoader height={60} width={320}>
    <circle cx="42" cy="30" r="18" />
    <rect x="74" y="14" rx="0" ry="0" width="104" height="12" />
    <rect x="74" y="34" rx="0" ry="0" width="65" height="12" />
    <rect x="231" y="14" rx="0" ry="0" width="65" height="12" />
    <rect x="252" y="34" rx="0" ry="0" width="44" height="12" />
  </ContentLoader>
);

const RecentlyPlayedWithRow = ({ data, region }) => {
  const { t } = useTranslation();
  const localizedWinrate = useMemo(() => {
    return data.winrate.toLocaleString(getLocale(), {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }, [data.winrate]);

  return (
    <li>
      <a href={`/lol/profile/${region}/${data.name}`}>
        <div className="col">
          <img
            width="40"
            height="40"
            className="summoner-icon"
            src={Static.getProfileIcon(data.icon_id)}
            loading="lazy"
          />
          <span className="type-subtitle2 summoner-name">{data.name}</span>
        </div>

        <div>
          <Winrate
            className="type-caption--bold stat-col"
            winrate={winRatecolorRange(data.winrate)}
          >
            <Trans i18nKey="lol:styledWinrate">
              <span>{{ localizedWinrate }}%</span> <span>WR</span>
            </Trans>
          </Winrate>
          <p className="type-caption record stat-col">
            {t("lol:winsAndLosses", "{{wins}}W {{losses}}L", {
              wins: data.wins,
              losses: data.games - data.wins,
            })}
          </p>
        </div>
      </a>
    </li>
  );
};

// queue param will be add for header links for the future: { name, region, queue }
const ChampionRecentPlayed = ({ name, region }) => {
  const state = useSnapshot(readState);
  const { t } = useTranslation();

  const playerStyleData = state?.lol?.playerStyle?.[getDerivedId(region, name)];
  const playerStyleError =
    playerStyleData instanceof Error ? playerStyleData : null;
  const recentPlayedData = playerStyleData?.recentlyPlayedWith;

  const recentPlayerStats = useMemo(() => {
    if (!recentPlayedData || Object.keys(recentPlayedData).length === 0)
      return [];

    return recentPlayedData
      .map((entry) => {
        return {
          games: entry.games,
          wins: entry.wins,
          summonerId: entry.accountId,
          name: entry.summonerName,
          icon_id: entry.profileIconId,
          winrate: (entry.wins / entry.games) * 100,
        };
      })
      .filter((e) => e.name !== undefined && e.name !== null)
      .sort((a, b) => {
        return b.games - a.games;
      });
  }, [recentPlayedData]);

  if (recentPlayerStats && recentPlayerStats.length === 0) return null;
  if (playerStyleError) return null;

  const champions_stats = recentPlayerStats && recentPlayerStats.slice(0, 5);
  const hasMore = recentPlayerStats.length > 5;

  return (
    <Card
      title={t("lol:recentlyPlayedWith", "Recently Played")}
      // This will be add when the feature are implemented for the future
      // titleLink={`/lol/profile/${region}/${name}/champions/champion_pool?queue=${queue}`}
      padding="0"
    >
      <List>
        {!recentPlayerStats ? (
          <>
            {[...Array(5)].map((e, i) => (
              <ChampionStatsLoader key={i} />
            ))}
          </>
        ) : (
          champions_stats.map((stat) => (
            <RecentlyPlayedWithRow
              key={stat.summonerId}
              data={stat}
              region={region}
            />
          ))
        )}
      </List>
      {recentPlayerStats && hasMore && (
        <BtnFrame>
          <Button href="#0" text={t("common:more", "More")} block />
        </BtnFrame>
      )}
    </Card>
  );
};
export default ChampionRecentPlayed;
