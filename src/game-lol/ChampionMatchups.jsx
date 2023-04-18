import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { styled } from "goober";

import { Button, ButtonGroup, Card, mobile } from "clutch";

import ChampionMatchupCell from "@/game-lol/ChampionMatchupCell.jsx";
import ChampionSpecificMatchup from "@/game-lol/ChampionSpecificMatchup.jsx";
import DownloadBlitzHorizontal from "@/game-lol/DownloadBlitzHorizontal.jsx";
import useChampionFilter from "@/game-lol/useChampionFilter.jsx";
import {
  commonMatchups,
  losingLaneMatchups,
  losingMatchups,
  winningLaneMatchups,
  winningMatchups,
} from "@/game-lol/util.mjs";
import LoadingSpinner from "@/inline-assets/loading-spinner-red.svg";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import { calcRate } from "@/util/helpers.mjs";

const Cols = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-4);

  ${mobile} {
    grid-template-columns: 1fr;
  }

  .machup-header {
    padding: var(--sp-3);

    .against {
      display: flex;
      gap: 0.5ch;
    }
  }
`;

const BlueHighlightText = styled("span")`
  color: var(--turq);
  margin-left: var(--sp-1);
  margin-right: var(--sp-1);
`;
const RedHighlightText = styled("span")`
  color: var(--red);
  margin-left: var(--sp-1);
  margin-right: var(--sp-1);
`;

const LoadingContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: var(--sp-22);

  svg {
    width: 7rem;
    height: 7rem;
  }
`;

const ResponsiveHeaderContainer = styled("div")`
  display: ${(props) => (props.$mobile ? "none" : "block")};
  ${mobile} {
    display: ${(props) => (props.$mobile ? "block" : "none")};
    button {
      flex: 1;
    }
  }
`;

const ChampionMatchupsLoaderRow = () => {
  return (
    <LoadingContainer>
      <LoadingSpinner />
    </LoadingContainer>
  );
};

const ChampionMatchupsLoader = () => {
  return (
    <div className="flex">
      <div>
        {[...Array(12).keys()].map((v) => (
          <ChampionMatchupsLoaderRow key={v} />
        ))}
      </div>
      <div>
        {[...Array(12).keys()].map((v) => (
          <ChampionMatchupsLoaderRow key={v} />
        ))}
      </div>
    </div>
  );
};

const ChampionMatchupsList = ({
  champion,
  championStats,
  filterKey,
  matchups,
  sort,
  setSort,
  filters,
}) => {
  const { t } = useTranslation();
  const matchupsAvailable = matchups?.length > 0;
  const failed = matchups instanceof Error ? matchups : null;
  const loading = !matchups;
  const winsAgainst =
    sort === "laneWins"
      ? winningLaneMatchups(matchups)
      : winningMatchups(matchups);
  const losesAgainst =
    sort === "laneWins"
      ? losingLaneMatchups(matchups)
      : losingMatchups(matchups);

  return (
    <Card
      title={t(
        "lol:championsChampionMatchups",
        "{{champion}}'s Champion Matchups",
        { champion: champion?.name }
      )}
      headerControls={
        <ResponsiveHeaderContainer>
          <ButtonGroup>
            <Button
              onClick={() => setSort("laneWins")}
              active={sort === "laneWins"}
              text={t("lol:viewByLane", "View By Lane")}
            />
            <Button
              onClick={() => setSort("wins")}
              active={sort === "wins"}
              text={t("lol:viewByGame", "View By Game")}
            />
          </ButtonGroup>
        </ResponsiveHeaderContainer>
      }
    >
      {loading && !failed ? (
        <ChampionMatchupsLoader />
      ) : failed ? (
        <ErrorComponent
          description={t(
            "common:errror.matchupsNotFound",
            "We're unable to find matchups."
          )}
        />
      ) : !matchupsAvailable ? (
        <ErrorComponent
          description={t("lol:noMatchupsFound", "No matchups found")}
        />
      ) : (
        <Cols>
          <ResponsiveHeaderContainer $mobile={true}>
            <ButtonGroup>
              <Button
                onClick={() => setSort("laneWins")}
                active={sort === "laneWins"}
                text={t("lol:viewByLane", "View By Lane")}
              />
              <Button
                onClick={() => setSort("wins")}
                active={sort === "wins"}
                text={t("lol:viewByGame", "View By Game")}
              />
            </ButtonGroup>
          </ResponsiveHeaderContainer>
          <div>
            <div className="flex align-center between matchup-header">
              <p className="type-body2 against">
                {sort === "laneWins" ? (
                  <Trans i18nKey="lol:winsLaneAgainst">
                    {{ champion: champion?.name }}
                    <BlueHighlightText>wins</BlueHighlightText>
                    lane against...
                  </Trans>
                ) : (
                  <Trans i18nKey="lol:winsGameAgainst">
                    {{ champion: champion?.name }}
                    <BlueHighlightText>wins</BlueHighlightText>
                    game against...
                  </Trans>
                )}
              </p>
              <div className="flex gap-sp-6">
                <p className="type-caption">{t("lol:winRate", "Win Rate")}</p>
                <p className="type-caption">
                  {t("lol:matchupRate", "Matchup Rate")}
                </p>
              </div>
            </div>
            <div>
              <div className="flex column gap-sp-2">
                {winsAgainst.map((m) => (
                  <ChampionMatchupCell
                    key={m.opponentChampionId}
                    championId={champion?.id}
                    matchupChampionId={`${m.opponentChampionId}`}
                    winRate={calcRate(m[filterKey], m.games)}
                    matchupRate={calcRate(m.games, championStats?.games)}
                    matches={parseInt(m.games)}
                    detailType="2COLUMNS"
                    role={championStats?.role}
                    filters={filters}
                    tab={"matchup"}
                  />
                ))}

                <DownloadBlitzHorizontal isHorizontal={false} />
              </div>
            </div>
          </div>
          <div>
            <div className="flex align-center between matchup-header">
              <p className="type-body2 against">
                {sort === "laneWins" ? (
                  <Trans i18nKey="lol:losesLaneAgainst">
                    {{ champion: champion?.name }}
                    <RedHighlightText>loses</RedHighlightText>
                    lane against...
                  </Trans>
                ) : (
                  <Trans i18nKey="lol:losesGameAgainst">
                    {{ champion: champion?.name }}
                    <RedHighlightText>loses</RedHighlightText>
                    game against...
                  </Trans>
                )}
              </p>
              <div className="flex gap-sp-6">
                <p className="type-caption">{t("lol:winRate", "Win Rate")}</p>
                <p className="type-caption">
                  {t("lol:matchupRate", "Matchup Rate")}
                </p>
              </div>
            </div>
            <div className="flex column gap-sp-2">
              {losesAgainst.map((m) => (
                <ChampionMatchupCell
                  key={m.opponentChampionId}
                  championId={champion?.id}
                  matchupChampionId={`${m.opponentChampionId}`}
                  winRate={calcRate(m[filterKey], m.games)}
                  matchupRate={calcRate(m.games, championStats?.games)}
                  matches={parseInt(m.games)}
                  detailType="2COLUMNS"
                  role={championStats?.role}
                  filters={filters}
                  tab={"matchup"}
                />
              ))}
              <DownloadBlitzHorizontal isHorizontal={false} />
            </div>
          </div>
        </Cols>
      )}
    </Card>
  );
};

const ChampionMatchupsTab = ({
  champion,
  championStats,
  matchupChampion,
  specificMatchupStats,
  matchups,
}) => {
  const [sort, setSort] = useState("laneWins");
  const filterKey = sort;
  const viableMatchups = commonMatchups(championStats, matchups);

  const { FilterBar, ...filters } = useChampionFilter(
    "counters",
    champion,
    matchupChampion
  );

  return (
    <>
      {FilterBar}
      {matchupChampion ? (
        <ChampionSpecificMatchup
          champion={champion}
          championStats={championStats}
          matchupChampion={matchupChampion}
          matchups={viableMatchups}
          specificMatchupStats={specificMatchupStats}
          filterKey={filterKey}
          sort={sort}
          setSort={setSort}
        />
      ) : (
        <ChampionMatchupsList
          champion={champion}
          championStats={championStats}
          matchupChampion={matchupChampion}
          matchups={viableMatchups}
          filterKey={filterKey}
          sort={sort}
          setSort={setSort}
          filters={filters}
        />
      )}
    </>
  );
};

export default ChampionMatchupsTab;
