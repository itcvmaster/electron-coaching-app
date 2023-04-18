import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { Card } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import { updateRoute } from "@/__main__/router.mjs";
import { GAME_SYMBOL_LOL } from "@/app/constants.mjs";
import ChampionLPHistory from "@/game-lol/ChampionLPHistory.jsx";
import ChampionRecentPlayed from "@/game-lol/ChampionRecentPlayed.jsx";
import ChampionStats from "@/game-lol/ChampionStats.jsx";
import {
  QUEUE_SYMBOL_TO_STR as LOL_QUEUE_SYMBOL_TO_STR,
  QUEUE_SYMBOLS as LOL_QUEUE_SYMBOLS,
  regionsList,
} from "@/game-lol/constants.mjs";
import LoLMatchTile from "@/game-lol/MatchTile.jsx";
import MatchTileHeader from "@/game-lol/MatchTileHeader.jsx";
import RankMajor from "@/game-lol/RankMajor.jsx";
import Static from "@/game-lol/static.mjs";
import {
  getDerivedId,
  getStaticData,
  isAbandonedMatch,
  isMatchInQueue,
  sanitizeMatchId,
} from "@/game-lol/util.mjs";
import Container from "@/shared/ContentContainer.jsx";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import GameBadge from "@/shared/GameBadge.jsx";
import PageHeader from "@/shared/PageHeader.jsx";
import SharedProfile, {
  MatchesNotFound,
  MatchList as SharedMatchList,
  MatchTile as SharedMatchTile,
  UnknownPlayerHeader,
} from "@/shared/Profile.jsx";
import { ProfileBox, ProfileColumn } from "@/shared/Profile.style.jsx";
import orderArrayBy from "@/util/order-array-by.mjs";
import { useRoute } from "@/util/router-hooks.mjs";

const PageWrapper = styled("div")`
  height: calc(var(--content-window-height) - var(--content-header-height));
`;

function findQueue(queue, leagues) {
  if (leagues) {
    return leagues.find((l) => l.queue === queue);
  }
}

function Profile() {
  const { t } = useTranslation();
  const {
    parameters: [region, name],
    currentPath,
    searchParams,
  } = useRoute((prev, next) => prev.currentPath === next.currentPath);
  const state = useSnapshot(readState);
  const champions = getStaticData("champions");
  const championsError = champions instanceof Error ? champions : null;

  const [seasonValue, setSeason] = useState(0);
  const [queueName, setQueue] = useState(searchParams.get("queueId") ?? "all");
  const [role, setRole] = useState("SPE");

  const profile = state.lol?.profiles?.[getDerivedId(region, name)];
  const profileError = profile instanceof Error ? profile : null;

  useEffect(() => {
    setRole("SPE");
  }, [profile]);

  const displayName = profile?.summonerName || name;
  const iconURL = Static.getProfileIcon(profile?.profileIconId);

  let leagues = profile?.latestRanks || [];
  if (leagues) {
    leagues = orderArrayBy(leagues, "insertedAt", "desc");
  }

  const soloData = findQueue(LOL_QUEUE_SYMBOLS.rankedSoloDuo, leagues);
  const flexData = findQueue(LOL_QUEUE_SYMBOLS.rankedFlex, leagues);
  const handleChangeQueue = (queueId) => {
    setQueue(queueId);
    // const queueSymbol = Object.getOwnPropertySymbols(
    //   LOL_QUEUE_SYMBOL_TO_STR
    // ).find((key) => {
    //   const e = LOL_QUEUE_SYMBOL_TO_STR[key];
    //   return e.key * 1 === queueId;
    // });
    searchParams.set("queueId", queueId);
    updateRoute(currentPath, searchParams);
  };

  if (profileError) {
    const errorDescription = t(
      "common:error.summonerNotFound",
      "We're unable to find the summoner name in the region specified. Make sure you're not entering your login username, and check the region. Enter the same name you use to look yourself up on op.gg or similar sites."
    );
    return (
      <PageWrapper>
        <ErrorComponent description={errorDescription} />
      </PageWrapper>
    );
  }

  return (
    <>
      {!profileError ? (
        <PageHeader
          title={displayName}
          image={iconURL}
          accentText={profile?.summonerLevel}
          underTitle={<GameBadge game={GAME_SYMBOL_LOL} withName />}
          links={[
            {
              url: `/lol/profile/${region}/${name}`,
              text: t("lol:championsPage.tabs.overview", "Overview"),
            },
            // {
            //   url: `/lol/profile/${region}/${name}/champions`,
            //   text: t("lol:championPool", "Champion Pool"),
            // },
          ]}
        />
      ) : (
        <UnknownPlayerHeader />
      )}
      <Container>
        <SharedProfile>
          <ProfileColumn className="flex column gap-sp-4 sidebar">
            <Card>
              <RankMajor
                name={name}
                region={region}
                seasonValue={seasonValue}
                setSeason={setSeason}
                queueName={queueName}
                queue={
                  queueName === 420 || queueName === 440 || queueName === "all"
                    ? queueName === 440
                      ? flexData
                      : soloData
                    : null
                }
                setQueue={handleChangeQueue}
                supportedQueues={[
                  ...Object.getOwnPropertySymbols(LOL_QUEUE_SYMBOL_TO_STR)
                    .filter((key) => {
                      const e = LOL_QUEUE_SYMBOL_TO_STR[key];
                      if (e.key === 420 && !soloData) return false;
                      if (e.key === 440 && !flexData) return false;
                      if (e.key === 900 || e.key === 1010) return false;
                      return true;
                    })
                    .map((e) => {
                      return {
                        value: LOL_QUEUE_SYMBOL_TO_STR[e].key,
                        text: LOL_QUEUE_SYMBOL_TO_STR[e].t.fallback,
                      };
                    }),
                  { value: "all", text: "ALL" },
                ]}
              />
              <ChampionLPHistory
                name={name}
                account={profile}
                region={region}
                queueId={queueName === "all" ? 420 : queueName}
                leagues={leagues}
              />
            </Card>
            {!championsError ? (
              <ChampionStats
                name={name}
                region={region}
                queue={queueName}
                champions={champions}
              />
            ) : null}
            {!championsError ? (
              <ChampionRecentPlayed
                name={name}
                region={region}
                queue={queueName}
                champions={champions}
              />
            ) : null}
          </ProfileColumn>
          <ProfileColumn className="main">
            <LoLMatchColumn
              role={role}
              name={name}
              region={region}
              queue={queueName}
            />
          </ProfileColumn>
        </SharedProfile>
      </Container>
    </>
  );
}

function LoLMatchColumn({ region, name, role, queue }) {
  const state = useSnapshot(readState);
  const profile = state.lol.profiles[getDerivedId(region, name)];
  const champions = getStaticData("champions");
  const matchLinkPrefix = `/lol/match/${region}/${name}`;

  const getMatchDetail = (id) => {
    const match = state.lol?.matches[id];
    return {
      match,
    };
  };

  const matchList = state.lol?.matchlists?.[getDerivedId(region, name)];
  const sanitizedMatchList =
    matchList && !(matchList instanceof Error) ? matchList : [];

  const filteredMatches = sanitizedMatchList.filter((matchlistItem) => {
    const { match } = getMatchDetail(matchlistItem.id);
    return isMatchInQueue(match, queue) && !isAbandonedMatch(match);
  });

  // In-place operation
  orderArrayBy(filteredMatches, "gameCreation", "desc");
  const loadedMatches = filteredMatches.map((m) => ({
    ...getMatchDetail(m.id).match,
    deltaLp: m.playerMatch.playerMatchStats.deltaLp,
  }));

  return (
    <>
      <MatchTileHeader
        champions={champions}
        role={role}
        currentAccount={profile}
        matches={loadedMatches}
      />
      <ProfileBox className="match-list">
        <SharedMatchList matchList={matchList}>
          {!filteredMatches.length ? <MatchesNotFound /> : null}
          {filteredMatches.map((matchlistItem) => {
            const { match } = getMatchDetail(matchlistItem.id);
            const matchId = sanitizeMatchId(matchlistItem.id);

            return (
              <SharedMatchTile
                id={matchlistItem.id}
                key={matchlistItem.id}
                height={128}
                match={match}
                matchRoute={`${matchLinkPrefix}/${matchId}`}
              >
                <LoLMatchTile
                  height={128}
                  match={match}
                  lp={matchlistItem?.playerMatch?.playerMatchStats?.deltaLp}
                  champions={champions}
                  profile={profile}
                />
              </SharedMatchTile>
            );
          })}
        </SharedMatchList>
      </ProfileBox>
    </>
  );
}

export function meta(info) {
  const userName = info[1];
  const region = regionsList.find((region) => region.id === info[0]);
  return {
    title: [
      `lol:profile`,
      `{{userName}}'s Champion Stats {{regionName}} – League of Legends – Blitz LoL`,
      { userName: userName, regionName: region.name },
    ],
    description: [
      `lol:profile`,
      `profile for {{userName}}, {{regionName}}`,
      { userName: userName, regionName: region.name },
    ],
  };
}

export default Profile;
