import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { Card } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import { formatDuration } from "@/app/util.mjs";
// import { buildMatchTables } from "./utils";
import { GAME_MODES } from "@/game-apex/constants.mjs";
// import { buildAccolades } from "./Accolades/buildAccolades";
import useApexLast20 from "@/game-apex/useApexLast20.jsx";
// import ShareButton from 'client/global/components/ShareButton';
// import { AccoladesGroup } from "client/app/postmatch";
import {
  //   calcWeaponsAccuracy,
  //   getLegendFromModelName,
  //   getMatchResultData,
  getPlayerStatsByMatch,
} from "@/game-apex/utils.mjs";
import WeaponsTable from "@/game-apex/WeaponsTable.jsx";
import Container from "@/shared/ContentContainer.jsx";
import DataAccuracyWarning from "@/shared/DataAccuracyWarning.jsx";
import HitStats from "@/shared/HitStats.jsx";
// import Container from "@/shared/ContentContainer.jsx";
import SharedMatch from "@/shared/Match.jsx";
import PageHeader from "@/shared/PageHeader.jsx";
// import PlayerPostStatsIcon from "@/shared/PlayerPostStatsIcon.jsx";
import { TimeAgo } from "@/shared/Time.jsx";
import getOrdinal from "@/util/get-ordinal.mjs";
import { useRoute } from "@/util/router-hooks.mjs";

// const Share = styled(ShareButton)`
//   background: transparent;
//   color: var(--shade2);
//   &:hover {
//     color: var(--shade1);
//   }
// `;
const Subtitle = styled("p")`
  display: flex;
  gap: var(--sp-3);
  color: var(--shade2);
  white-space: nowrap;
`;

const MainContainer = styled(Container)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-4);

  .span-1 {
    grid-column: span 1;
  }
  .span-2 {
    grid-column: span 2;
  }
  .span-3 {
    grid-column: span 3;
  }
`;

export const Box = styled("div")`
  background: var(--shade7);
  border-radius: var(--br);
  margin-bottom: var(--sp-4);
`;

// const EmptyAccolade = () => {
//   const { t } = useTranslation(["common"]);
//   return (
//     <div
//       css={`
//         text-align: center;
//         margin-top: var(--sp-4);
//       `}
//     >
//       <Body2>{t("common:noAnalysisData", "No analysis data")}</Body2>
//     </div>
//   );
// };

// const LiveAccolade = () => {
//   const { t } = useTranslation(["apex"]);
//   return (
//     <div
//       css={`
//         text-align: center;
//         margin-top: var(--sp-4);
//       `}
//     >
//       <Body2>
//         {t(
//           "apex:match.liveAccoladeDesc",
//           "Insights will be available after the match."
//         )}
//       </Body2>
//     </div>
//   );
// };

const Match = () => {
  const route = useRoute();
  const {
    parameters: [profileId, matchId],
    searchParams,
  } = route;

  const { t } = useTranslation();
  const type = searchParams.get("type") || "kills";

  const state = useSnapshot(readState);
  const profile = state.apex?.profiles?.[profileId];

  const isLivePage = false;
  const liveGame = state.apex.liveGame;
  const weapons = state.apex.meta?.weapons;
  const legends = state.apex.meta?.legends;
  const match = state.apex.matches[matchId];
  const currentAccountId = profileId;

  const isLive = isLivePage && liveGame;
  //   const isAlive = isLive;
  const { gameStartedAt, season, mode } = match || {};

  const { last20Stats } = useApexLast20({
    profileId: currentAccountId,
    season,
    mode,
  });

  const {
    myPlayer,
    placement,
    minutesplayed,
    iconUrl,
    gameMode,
    hasHitStats,
    modeObj,
  } = useMemo(() => {
    const myPlayer = getPlayerStatsByMatch(match, currentAccountId);
    const legendIconInfo = legends?.[myPlayer?.champion_id];
    const modeObj = GAME_MODES[match?.mode || "all"];
    const gameMode = modeObj ? t(modeObj.t, modeObj.label) : "";
    const hasHitStats = !!myPlayer?.hits;

    return {
      myPlayer,
      minutesplayed: (myPlayer?.survivaltime || 0) * 1000,
      iconUrl: legendIconInfo?.imageUrl || "",
      modeObj,
      gameMode: gameMode,
      placement: myPlayer?.team?.placement,
      hasHitStats,
    };
  }, [match, currentAccountId, legends, t]);

  const gameAlert = useMemo(() => {
    if (
      [GAME_MODES.arenas.key, GAME_MODES.rankedArenas.key].includes(
        modeObj?.key
      )
    ) {
      return t(
        "apex:postmatch.statsUnavailableForMode",
        "Stats related to Accuracy and Headshot are unavailable in this mode."
      );
    }
  }, [modeObj, t]);

  //   const [now, setNow] = useState(Date.now());

  const myWeapons = useMemo(() => {
    const result = Object.entries(myPlayer?.weapons || {}).map(
      ([weaponId, weapon]) => {
        const headshots = weapon?.headshots || 0;
        const bodyshots = weapon?.hits ? weapon?.hits - headshots : 0;
        return {
          ...weapon,
          weaponId,
          weapon: weapons[weaponId],
          headshotPercentage: weapon?.hits
            ? weapon?.headshots / (weapon?.hits || 1)
            : null,
          headshots,
          allShots: {
            bodyshots: bodyshots,
            headshots,
          },
        };
      }
    );

    result.sort((a, b) => {
      return b[type] - a[type];
    });

    return result;
  }, [weapons, myPlayer, type]);

  //   const timeElapsed = useMemo(() => {
  //     if (isLive) return formatDuration(now - 0, "h:mm:ss");
  //   }, [now, isLive]);

  //   const { color } = useMemo(() => {
  //     return myPlayer ? getMatchResultData(t, match, myPlayer, isLive) : {};
  //   }, [match, isLive, myPlayer, t]);

  const title =
    isLive || !placement
      ? profile?.displayName
      : placement === 1
      ? t("lol:postmatch.victory", "Victory!")
      : t("apex:place", `{{place}} Place`, {
          place: getOrdinal(placement),
        });

  //   const hasStats = !isAlive && myPlayer && minutesplayed > 0;

  const matchHitStats = useMemo(() => {
    const hitStats = {
      kills: myPlayer?.kills || 0,
      weaponHits: {
        headshots: myPlayer?.headshots || 0,
        bodyshots: myPlayer?.hits
          ? myPlayer?.hits - (myPlayer?.headshots || 0)
          : 0,
      },
    };

    return hitStats;
  }, [myPlayer]);

  const lastMatchesHitStats = useMemo(() => {
    const {
      headshotPercentage: headshots = 0,
      matchesWithHits = 0,
      hits,
    } = last20Stats;
    const lastHitStats = {
      matches: matchesWithHits,
      weaponHits: {
        headshots: headshots * hits,
        bodyshots: (1 - headshots) * hits,
      },
    };
    return lastHitStats;
  }, [last20Stats]);

  //   const { accolades, genStats } = useMemo(() => {
  //     const accolades = {};
  //     //   hasStats &&
  //     //   buildAccolades({
  //     //     t,
  //     //     matchStats: myPlayer || {},
  //     //     last20MatchStats: last20Stats || {},
  //     //   });
  //     const genStats = {};
  //     // const genStats = buildMatchTables({
  //     //   t,
  //     //   matchStats: myPlayer || {},
  //     //   comparisonStats: last20Stats || {},
  //     //   weapons,
  //     // });

  //     return {
  //       accolades,
  //       genStats,
  //     };
  //   }, [hasStats, t, myPlayer, last20Stats, weapons]);

  //   useEffect(() => {
  //     if (!isLive) return;
  //     const interval = setInterval(() => {
  //       setNow(Date.now());
  //     }, 1000);
  //     return () => clearInterval(interval);
  //   }, [isLive]);

  return (
    <>
      <SharedMatch match={match}>
        <PageHeader
          title={title}
          image={iconUrl}
          className="span-3"
          underTitle={
            <Subtitle className="type-body2">
              <span>{gameMode}</span>
              <span>{formatDuration(minutesplayed, "m:ss")}</span>
              <TimeAgo date={gameStartedAt * 1000} />
              {/* <Share
                    size="small"
                    emphasis="low"
                    popupTitle={t(
                      'common:share.copied',
                      'Web link copied to clipboard!'
                    )}
                    popupSubtitle={t(
                      'common:share.match',
                      'Share this match via a browser accessible link.'
                    )}
                    shareText={t('common:share.share', 'Share')}
                    hideCopy={true}
                    data-analytics-component="Post match - share match"
                    data-analytics-type="Button:Share"
                    data-analytics-path={pathname}
                  /> */}
            </Subtitle>
          }
        />
        <MainContainer>
          <div>
            <Box>
              {/* <AccoladesGroup
                title={t("common:analysis", "Analysis")}
                titleIcon={FnKills}
                accolades={accolades}
                name={myPlayer?.name}
                tag={""}
                gameId={gameId}
              >
                {isAlive && <LiveAccolade />}
                {!isAlive &&
                  (!hasStats ||
                    (accolades.bad.length === 0 &&
                      accolades.good.length === 0)) && <EmptyAccolade />}
              </AccoladesGroup> */}
            </Box>
          </div>
          <div className="span-2">
            {gameAlert && (
              <DataAccuracyWarning type="alert" content={gameAlert} />
            )}
            {hasHitStats && (
              <HitStats
                comparisonStats={lastMatchesHitStats}
                matchStats={matchHitStats}
              />
            )}
            {/* {hasStats && (
              <CardContainer>
                <CardInner>
                  <div>
                    <ComparisonTable table={genStats} />
                  </div>
                </CardInner>
              </CardContainer>
            )} */}

            {myWeapons.length ? (
              <Container>
                <Card>
                  <WeaponsTable
                    matchWeapons={myWeapons}
                    hiddenFilters={true}
                    hiddenMatches={true}
                    hideAccuracy
                  />
                </Card>
              </Container>
            ) : null}
          </div>
        </MainContainer>
      </SharedMatch>
    </>
  );
};

export default Match;
