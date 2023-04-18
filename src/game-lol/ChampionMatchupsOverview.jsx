import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { styled } from "goober";

import { Button, ButtonGroup, Card, mobile } from "clutch";

import ChampionMatchupCell from "@/game-lol/ChampionMatchupCell.jsx";
import { EmptyContentContainer } from "@/game-lol/CommonComponents.jsx";
import DownloadBlitzHorizontal from "@/game-lol/DownloadBlitzHorizontal.jsx";
import {
  commonMatchups,
  losingLaneMatchups,
  losingMatchups,
  winningLaneMatchups,
  winningMatchups,
} from "@/game-lol/util.mjs";

const Loader = styled("div")``;
const LoaderRow = () => {
  return (
    <Loader height={64} width={302} inverted>
      <circle cx="40" cy="32" r="24" />
      <rect x="80" y="10" width="104" height="24" />
      <rect x="80" y="38" width="104" height="16" />
      <rect x="206" y="10" width="80" height="24" />
      <rect x="206" y="38" width="80" height="16" />
    </Loader>
  );
};

const ContentLoader = () => {
  return (
    <div style={{ display: "flex" }}>
      <div>
        {[...Array(7).keys()].map((v) => (
          <LoaderRow key={v} />
        ))}
      </div>
      <div>
        {[...Array(7).keys()].map((v) => (
          <LoaderRow key={v} />
        ))}
      </div>
    </div>
  );
};

const EmptyContent = () => {
  const { t } = useTranslation();
  return (
    <EmptyContentContainer>
      {t("lol:notFound.matchups", "No matchups data found for this champion.")}
    </EmptyContentContainer>
  );
};

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
const MatchupsHeader = styled("p")`
  &.align-right {
    text-align: right;
    ${mobile} {
      text-align: left;
    }
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

const ChampionMatchupsOverview = (props) => {
  const { t } = useTranslation();
  const [sort, setSort] = useState("laneWins");
  const { champion, championStats, filters, matchups } = props;
  const loading = false;
  const matchupsAvailable = matchups?.length > 0;

  const viableMatchups = commonMatchups(championStats, matchups);
  const weak =
    sort === "laneWins"
      ? losingLaneMatchups(viableMatchups)
      : losingMatchups(viableMatchups);
  const strong =
    sort === "laneWins"
      ? winningLaneMatchups(viableMatchups)
      : winningMatchups(viableMatchups);

  return (
    <Card
      title={t("lol:championsMatchups", `${champion?.name}'s Matchups`, {
        champion: champion?.name,
      })}
      headerControls={
        <ResponsiveHeaderContainer>
          <ButtonGroup>
            <Button
              onClick={() => setSort("laneWins")}
              active={sort === "laneWins"}
              text={t("lol:stats.laneWinRate", "Lane Win Rate")}
            />
            <Button
              onClick={() => setSort("wins")}
              active={sort === "wins"}
              text={t("lol:stats.gameWinRate", "Game Win Rate")}
            />
          </ButtonGroup>
        </ResponsiveHeaderContainer>
      }
    >
      {loading ? (
        <ContentLoader />
      ) : !matchupsAvailable ? (
        <EmptyContent />
      ) : (
        <MatchupsContainer>
          <ResponsiveHeaderContainer $mobile={true}>
            <ButtonGroup>
              <Button
                onClick={() => setSort("wins")}
                active={sort === "laneWins"}
                text={t("lol:stats.laneWinRate", "Lane Win Rate")}
              />
              <Button
                onClick={() => setSort("laneWins")}
                active={sort === "wins"}
                text={t("lol:stats.gameWinRate", "Game Win Rate")}
              />
            </ButtonGroup>
          </ResponsiveHeaderContainer>
          <MatchupsList>
            <MatchupsHeader className="type-body2">
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
            </MatchupsHeader>
            <MatchupsList>
              {strong.map((m) => (
                <ChampionMatchupCell
                  key={m.opponentChampionId}
                  role={championStats.role}
                  filters={filters}
                  matchupChampionId={m.opponentChampionId}
                  championId={m.championId}
                  winRate={m.wins / m.games}
                  laneWinRate={m.laneWins / m.games}
                  matches={m.games}
                  detailType="DEFAULT"
                  sortBy={sort === "laneWins" ? "laneWinRate" : "gameWinRate"}
                />
              ))}
            </MatchupsList>
            <DownloadBlitzHorizontal isHorizontal={false} />
          </MatchupsList>
          <MatchupsList>
            <MatchupsHeader className="align-right type-body2">
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
            </MatchupsHeader>
            <MatchupsList>
              {weak.map((m) => (
                <ChampionMatchupCell
                  key={m.opponentChampionId}
                  role={championStats.role}
                  filters={filters}
                  matchupChampionId={m.opponentChampionId}
                  championId={m.championId}
                  winRate={m.wins / m.games}
                  laneWinRate={m.laneWins / m.games}
                  matches={m.games}
                  detailType="DEFAULT"
                  sortBy={sort === "laneWins" ? "laneWinRate" : "gameWinRate"}
                />
              ))}
            </MatchupsList>
          </MatchupsList>
        </MatchupsContainer>
      )}
    </Card>
  );
};

const MatchupsContainer = styled("div")`
  display: flex;
  gap: var(--sp-2);

  ${mobile} {
    flex-direction: column;
  }
`;
const MatchupsList = styled("div")`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);

  ${mobile} {
    width: 100%;
  }
`;

export default ChampionMatchupsOverview;
