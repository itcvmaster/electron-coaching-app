import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { Card } from "clutch";

import ChampionOverallStats from "@/game-lol/ChampionOverallStats.jsx";
import { correctRoleName } from "@/game-lol/util.mjs";

const Container = styled(Card)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: sticky;
  z-index: 2;
  top: var(--page-tabs-height);
  border-radius: var(--br-lg);
`;

const findMe = (match, summonerName) =>
  match?.participants?.find((p) => p.summonerName === summonerName);

const findMyRole = (match, summonerName) => findMe(match, summonerName)?.role;

const roleMismatches = (role1, role2) =>
  role1 !== "SPE" && correctRoleName(role1) !== correctRoleName(role2); // TODO: Change to use symbol

const computeAggregatedMatchStats = ({ role, matches, currentAccount }) => {
  if (!matches || !currentAccount) return { top3ChampionStats: [] };
  const { summonerName } = currentAccount;

  const isIneligibleMatch = (match) =>
    !findMe(match, summonerName) ||
    match?.gameDuration <= 300 ||
    roleMismatches(role, findMyRole(match, currentAccount));

  const last20Matches = matches
    .filter((m) => !isIneligibleMatch(m))
    .filter((_, index) => index < 20);
  const objectAttributesSumOp = (obj, addendum) =>
    Object.keys(addendum).reduce((res, attr) => {
      res[attr] = (res[attr] || 0) + addendum[attr];
      return res;
    }, obj || {});

  const playerChampions = {};
  const result = last20Matches.reduce((total, match) => {
    const { championId, win, assists, deaths, kills } = findMe(
      match,
      summonerName
    );
    const addendum = {
      wins: win ? 1 : 0,
      assists,
      deaths,
      kills,
      plays: 1,
      lp: match.deltaLp,
    };
    playerChampions[championId] = objectAttributesSumOp(
      playerChampions[championId] || { championId },
      addendum
    );
    return objectAttributesSumOp(total, addendum);
  }, {});
  result.top3ChampionStats = Object.values(playerChampions)
    .sort((a, b) => b.plays - a.plays)
    .filter((_, index) => index < 3);
  return result;
};

function MatchTileHeader({ role, matches, currentAccount, champions }) {
  const { t } = useTranslation();
  const { lp, plays, wins, top3ChampionStats } = useMemo(
    () =>
      computeAggregatedMatchStats({
        role,
        matches,
        currentAccount,
      }),
    [matches, role, currentAccount]
  );

  return (
    <Container padding="var(--sp-4)">
      <div className="flex gap-sp-2">
        <div>
          <p className="type-caption--bold match-info-title">
            {t("lol:lastGames", "Last {{totalGames}}", {
              totalGames: plays ? plays : "",
            })}
          </p>
          <p className="type-caption match-info-content">
            {t(
              "lol:matchHistory.winsAndLossesWithHypen",
              "{{wins}}W-{{losses}}L",
              {
                wins: matches ? (wins ? wins : 0) : " ",
                losses: matches ? (plays - wins ? plays - wins : 0) : " ",
              }
            )}
          </p>
        </div>
        {lp ? (
          <p
            className="type-caption--bold match-info-content"
            style={{
              color:
                lp > 0
                  ? "var(--turq)"
                  : lp < 0
                  ? "var(--red)"
                  : "var(--shade3)",
            }}
          >
            {lp > 0 ? "+" : ""}
            {t("lol:leaguePoints", "{{points}} LP", {
              points: lp !== null ? lp : "-",
            })}
          </p>
        ) : null}
      </div>
      <div className="flex align-center gap-sp-4">
        {top3ChampionStats.map((champStat, index) => (
          <ChampionOverallStats
            key={index}
            data={champStat}
            t={t}
            champions={champions}
          />
        ))}
      </div>
    </Container>
  );
}
export default MatchTileHeader;
