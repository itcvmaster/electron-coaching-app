import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { css, styled } from "goober";

import { Button, mobile, tabletMedium } from "clutch";

import { updateRoute } from "@/__main__/router.mjs";
import ChampionImg from "@/game-lol/ChampionImg.jsx";
import {
  ROLE_SYMBOL_TO_STR,
  SERVICES_TO_REGIONS,
} from "@/game-lol/constants.mjs";
import DownloadBlitz from "@/game-lol/DownloadBlitz.jsx";
import ItemImg from "@/game-lol/ItemImg.jsx";
import getHextechRoleIcon from "@/game-lol/lol-icons.mjs";
import ProMatchOverview from "@/game-lol/ProMatchOverview.jsx";
import RuneImg from "@/game-lol/RuneImg.jsx";
import TreeImg from "@/game-lol/TreeImg.jsx";
import { getStaticData, mapRoleToSymbol } from "@/game-lol/util.mjs";
import { TimeAgo } from "@/shared/Time.jsx";
import { getLocale } from "@/util/i18n-helper.mjs";
import { useIsLoaded, useTransientRoute } from "@/util/router-hooks.mjs";

const CssDownloadBlitz = css`
  ${mobile} {
    flex-wrap: wrap;
    & > div {
      margin-left: 0;
      margin-top: var(--sp-5);
    }
  }
`;

const ProMatchesListContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);

  .load-more > button {
    width: 100%;
    justify-content: center;
    background: var(--shade6);
    color: var(--shade1);

    &:hover {
      background: var(--shade5);
      color: var(--shade1);
    }
  }
`;

const ProMatchesList = ({ matches }) => {
  const route = useTransientRoute();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const loadMore = () => {
    const newPage = page + 1;
    updateRoute(route.currentPath, route.searchParams, {
      page: newPage,
    });
    setPage(newPage);
  };

  const isLoaded = useIsLoaded();
  const loadingMatches = !isLoaded;

  return (
    <ProMatchesListContainer>
      <DownloadBlitz
        adTitle={t(
          "lol:ads.pros",
          "Get a build from your favorite pro player imported into your League Client"
        )}
        className={CssDownloadBlitz}
      />
      <Matchlist>
        {loadingMatches
          ? [...Array(12).keys()].map((_, i) => <Match key={i} loader />)
          : (matches || []).map((match) => (
              <Match key={match.id} matchData={match} />
            ))}
      </Matchlist>
      {!loadingMatches && matches && matches.length > 0 && (
        <Button
          block
          text={t("common:loadMore", "Load More")}
          onClick={loadMore}
        />
      )}
    </ProMatchesListContainer>
  );
};

export default ProMatchesList;

const Match = ({ matchData, loader }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const perks = getStaticData("runes");

  if (!matchData && !loader) return null;

  if (loader)
    return (
      <MatchContainer>
        <div className="match-summary loading" />
      </MatchContainer>
    );

  const keystoneID = Number.parseInt(matchData.runes?.[0]?.id || 0);
  const keystone =
    perks && keystoneID && matchData.runePrimaryTree
      ? perks
          .find(
            (tree) => tree.id === Number.parseInt(matchData.runePrimaryTree)
          )
          .slots[0].runes.find(
            (rune) => rune.id === Number.parseInt(keystoneID)
          )
      : null;

  const { role, items, champion, opponentChampion, player } = matchData;
  const team = player.team;

  if (!player) return null;

  const playerImg = player.profileImageUrl || player.portraitImageUrl;
  const region = SERVICES_TO_REGIONS[player.region];

  const roleString = ROLE_SYMBOL_TO_STR[mapRoleToSymbol(role)].key;
  const RoleIcon = getHextechRoleIcon(roleString);

  const itemslist = matchData.boots[0]
    ? [
        ...items.map((e) => Number.parseInt(e.id)),
        Number.parseInt(matchData.boots[0].id),
      ]
    : items.map((e) => Number.parseInt(e.id));

  const toggleIsOpen = () => setIsOpen((prev) => !prev);

  return (
    <MatchContainer className={isOpen ? "is-open" : ""}>
      <div
        className="match-summary"
        data-defeat={!matchData.win}
        onClick={toggleIsOpen}
      >
        <div className="player-info flex align-center gap-sp-2">
          <div className="player-image">
            <img height="36" width="36" src={playerImg} loading="lazy" />
          </div>
          <div>
            <p className="type-caption--bold name">{player.name}</p>
            {team && <p className="type-caption secondary name">{team.name}</p>}
          </div>
        </div>
        <div className="player-region">
          <p className="type-caption--bold">{region}</p>
        </div>
        {RoleIcon && (
          <div className="player-role">
            <RoleIcon />
          </div>
        )}
        <div className="matchups flex align-center gap-sp-1">
          <ChampionImg round disabled size={24} championId={champion} />
          <span className="type-caption secondary">{t("lol:vs", "vs")}</span>
          <ChampionImg round disabled size={24} championId={opponentChampion} />
        </div>
        <div className="kdastats">
          <p className="type-caption--bold">
            {t("lol:matchTile.kda", "{{kda}} KDA", {
              kda: (
                (matchData.kills + matchData.assists) /
                (matchData.deaths || 1)
              ).toLocaleString(getLocale(), {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }),
            })}
          </p>
          <p className="type-caption secondary">
            {t("lol:displayKDA", "{{kills}} / {{deaths}} / {{assists}}", {
              kills: matchData.kills.toLocaleString(getLocale()),
              deaths: matchData.deaths.toLocaleString(getLocale()),
              assists: matchData.assists.toLocaleString(getLocale()),
            })}
          </p>
        </div>
        <div className="scorestats">
          <p className="type-caption--bold">
            {matchData.gold.toLocaleString(getLocale(), {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
          <p className="type-caption secondary">
            {t("common:numPerMin", "{{num}}/min.", {
              num: (
                matchData.gold /
                (matchData.gameDuration / 60)
              ).toLocaleString(getLocale(), {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
            })}
          </p>
        </div>
        {perks && (
          <div className="player-runes">
            {matchData.runes[0] && matchData.runePrimaryTree && (
              <>
                <RuneImg
                  size={2.25}
                  activeRunes={[keystoneID]}
                  currRune={keystone}
                />
                <div className="secondary">
                  <TreeImg
                    isActive
                    noBorder
                    size={1}
                    tree={perks.find(
                      (tree) =>
                        tree.id === Number.parseInt(matchData.runeSecondaryTree)
                    )}
                  />
                </div>
              </>
            )}
          </div>
        )}
        <div className="flex gap-sp-1 player-items">
          {[...Array(6)].map((_, i) => (
            <ItemImg
              key={i}
              borderRadius={5}
              size={1.5}
              itemId={itemslist[i]}
            />
          ))}
        </div>
        <div className="timestats">
          <p className="type-caption--bold ago">
            <TimeAgo date={matchData.timestamp} />
          </p>
          <p className="type-caption secondary patch">
            {t("lol:patchVersion", `Patch {{patch}}`, {
              version: matchData.patch,
            })}
          </p>
        </div>
      </div>
      {isOpen && <ProMatchOverview proAccount={player} matchData={matchData} />}
    </MatchContainer>
  );
};

const Matchlist = styled("ol")`
  --match-bg: var(--shade8);
  --match-summary-height: var(--sp-16);
  --match-radii: var(--br);
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  list-style: none;
`;

const MatchContainer = styled("li")`
  background: var(--match-bg);
  border-radius: var(--match-radii);
  user-select: none;

  .match-summary {
    position: relative;

    align-items: center;
    padding: var(--sp-3) var(--sp-4);
    min-height: var(--match-summary-height);
    background: var(--match-bg);
    text-align: center;
    cursor: pointer;

    display: flex;
    justify-content: space-between;

    ${tabletMedium} {
      padding: var(--sp-2) var(--sp-4);
      display: grid;
      grid-template:
        "profile role runes items items"
        "region matchups kda score time" / auto 1fr 1fr 1fr 1fr;
    }

    ${mobile} {
      padding: var(--sp-2) var(--sp-4);
      display: grid;
      grid-template:
        "profile profile runes items items"
        "role matchups kda score time" / 1fr 1fr 1fr 1fr 2fr;
    }

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      height: 100%;
      width: var(--sp-0_5);
      background: transparent;
      border-radius: var(--br) 0 0 var(--br);
    }

    &.loading {
      pointer-events: none;
      cursor: default;
    }

    &[data-defeat="true"]::before {
      background: var(--red);
    }
    &[data-defeat="false"]::before {
      background: var(--blue);
    }

    > *:first-child {
      text-align: left;
    }
    > *:last-child {
      text-align: right;
    }

    &:hover {
      --match-bg: var(--shade6);
    }
  }

  &.is-open {
    .match-summary {
      --match-bg: var(--shade6);
    }
  }

  .player-image {
    position: relative;
    width: var(--sp-8);
    height: var(--sp-8);
    background: var(--shade10);
    border-radius: 50%;
    overflow: hidden;

    > img {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 150%;
      transform: translate(-50%, -50%);
    }
  }
  .name,
  .ago,
  .patch {
    width: 12ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    ${mobile} {
      width: auto;
    }
  }
  .secondary {
    color: var(--shade1);
  }
  .player-info {
    grid-area: profile;
  }
  .player-region {
    grid-area: region;
    width: 5ch;
    justify-content: center;

    ${mobile} {
      display: none;
    }
  }
  .player-role {
    grid-area: role;
    font-size: 1.5rem;
    & > svg {
      margin-left: auto;
      margin-right: auto;
    }
  }
  .matchups {
    grid-area: matchups;

    justify-content: center;
  }
  .kdastats {
    grid-area: kda;

    justify-content: center;
  }
  .scorestats {
    grid-area: score;

    justify-content: center;
  }
  .player-runes {
    grid-area: runes;
    position: relative;

    .secondary {
      position: absolute;
      bottom: 0;
      right: -0.25rem;
      background: var(--match-bg);
      padding: 0 0.125rem;
      border-radius: 50%;
    }

    ${tabletMedium} {
      margin-left: auto;
      margin-right: auto;
    }
  }
  .player-items {
    grid-area: items;
    flex-wrap: wrap;
  }
  .timestats {
    grid-area: time;
  }
`;
