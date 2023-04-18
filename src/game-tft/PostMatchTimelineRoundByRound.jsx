import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import StaticLOL from "@/game-lol/static.mjs";
import {
  Container,
  Content,
  Heading,
  SubTitle,
  Title,
} from "@/game-tft/CommonComponents.jsx";
import useMatch from "@/game-tft/use-match.mjs";
import useRoundManager from "@/game-tft/use-round-manager.mjs";
import useScrollSwap from "@/game-tft/use-scroll-swap.mjs";

const ROUND_WIDTH = 67;

function PostMatchTimelineRoundByRound() {
  // Hooks
  const data = useData();
  const { t } = useTranslation();
  const refScrollSwap = useScrollSwap();

  const handleNavigate = () => () => {
    // Todo: Navigate to the Round Breakdown Page (this has not been imported from blitz-web yet)
    // Todo: Also remove function redirects, just replace element with an anchor tag
  };

  // Render
  const wins = data.wins + " " + t("common:stats.wins", "Wins");
  const losses = data.losses + " " + t("common:stats.losses", "Losses");
  return (
    <Container>
      <Heading>
        <Title>{t("tft:headings.roundByRound", "Round by Round")}</Title>
        <SubTitle>{wins + " / " + losses}</SubTitle>
      </Heading>
      <Content>
        <Rounds ref={refScrollSwap} className="scroll-horizontal">
          <DottedLine rounds={data.rounds.length} />
          {data.rounds.map((round, index) => {
            let status = "";
            status += round.isWinner ? "win" : "loss";
            status += data.rounds[index + 1]?.isWinner ? "win" : "loss";
            return (
              <Round
                key={round.round}
                aria-label="button"
                onClick={handleNavigate(index)}
              >
                <RoundContent>
                  <RoundHeading>{round.round}</RoundHeading>
                  <Avatar url={round.allyAvatar} />
                </RoundContent>
                <DotContainer>
                  <Dot $isWin={round.isWinner} $isLoss={!round.isWinner} />
                  {data.rounds.length - 1 !== index ? (
                    <DotConnect $status={status} />
                  ) : null}
                </DotContainer>
                <RoundContent>
                  <RoundHeadingEnemy>{t("common:vs", "vs")}</RoundHeadingEnemy>
                  <Avatar
                    $isWin={round.isWinner}
                    $isLoss={!round.isWinner}
                    url={round.enemyAvatar}
                    data-tip={round.enemy?.name}
                  />
                </RoundContent>
                {index % 2 === 0 ? <RoundGradient /> : null}
              </Round>
            );
          })}
        </Rounds>
      </Content>
    </Container>
  );
}

function useData() {
  // Hooks
  const state = useSnapshot(readState);
  const currentMatch = useMatch();
  const summoners = state.tft.summoners;
  const roundByRound = useMemo(() => {
    if (currentMatch && !(currentMatch instanceof Error))
      return currentMatch.extra.Timeline.roundResultTimeLine;
    return [];
  }, [currentMatch]);
  const queueType = useMemo(() => {
    if (currentMatch && !(currentMatch instanceof Error))
      return currentMatch.data.queueId;
    return "";
  }, [currentMatch]);
  const latestPatch = state.lol_settings?.latestPatch?.patch || "";
  const { getRoundUrlByTarget } = useRoundManager({
    isDefaultPlaceholder: false,
    queueType,
  });
  // Transformations (sum)
  const { wins, losses } = roundByRound.reduce(
    (acc, cur) => {
      if (cur.isWinner) {
        acc.wins += 1;
      } else {
        acc.losses += 1;
      }
      return acc;
    },
    { wins: 0, losses: 0 }
  );
  // Transformations (data structure)
  const rounds = [];
  if (Array.isArray(roundByRound) && roundByRound.length) {
    // If we have round data + summoners
    for (const round of roundByRound) {
      // Assign ally and enemy objects
      let ally = {},
        enemy = {};
      // Use 1 loop to find ally and enemy
      for (const key in summoners) {
        // Prevent the loop
        if (typeof round?.username === "undefined") break;
        if (typeof round?.enemy === "undefined") break;
        const summoner = summoners[key];
        if (new RegExp(round.username, "i").test(summoner?.name)) {
          ally = summoner;
        }
        if (new RegExp(round.enemy, "i").test(summoner?.name)) {
          enemy = summoner;
        }
        // Stop loop after finding both ally and enemy summoners
        if (
          typeof ally?.name !== "undefined" &&
          typeof enemy?.name !== "undefined"
        ) {
          break;
        }
      }
      // The data structure for rounds array
      rounds.push({
        round: round?.round.replace("_", "-") || "-",
        health: round?.currentHealth || 0,
        // ally, enemy currently not being used but I predict we might do tool tip information
        ally, // This references the summoner object from tft.summoners[region:username]
        enemy,
        allyAvatar: StaticLOL.getProfileIcon(
          ally.profileiconid || 29,
          latestPatch
        ),
        enemyAvatar:
          getRoundUrlByTarget(round?.round) ||
          StaticLOL.getProfileIcon(enemy.profileiconid || 29, latestPatch),
        isWinner: round?.isWinner || false,
      });
    }
  }
  return {
    wins,
    losses,
    rounds,
  };
}

export default PostMatchTimelineRoundByRound;

const Rounds = styled("div", React.forwardRef)`
  width: 100%;
  height: 308px;
  position: relative;
  overflow-x: auto;
  display: flex;
`;
const Round = styled("div")`
  display: flex;
  gap: 30px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  min-width: 68px;
  &:hover {
    background: linear-gradient(180deg, rgba(18, 20, 24, 0.1) 0%, #262b35 100%);
  }
`;
const RoundGradient = styled("div")`
  width: ${ROUND_WIDTH}px;
  height: 100%;
  position: absolute;
  top: 0;
  background: linear-gradient(180deg, rgba(7, 14, 29, 0.05) 0%, #070e1d 100%);
  opacity: 0.15;
`;
const RoundContent = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const RoundHeading = styled("div")`
  color: var(--shade0);
  font-size: 10px;
  letter-spacing: 1.5px;
  line-height: 10px;
`;
const RoundHeadingEnemy = styled("div")`
  color: var(--shade3);
  font-size: 14px;
  line-height: 14px;
  text-transform: uppercase;
`;
const DottedLine = styled("div")`
  position: absolute;
  top: calc(50% - 2px);
  width: ${(props) => props.rounds * ROUND_WIDTH - ROUND_WIDTH}px;
  left: ${ROUND_WIDTH / 2}px;
  height: 1px;
  box-sizing: border-box;
  border-bottom: 1px dashed var(--shade3);
  opacity: 0.2;
`;
const DotContainer = styled("div")`
  position: relative;
  height: 70px;
  width: 12px;
`;
const DotConnect = styled("div")(({ $status }) => {
  const types = {
    winloss: `
      transform: rotate(45deg);
      top: 34px;
      left: 0;
      width: 80px;
    `,
    losswin: `
      transform: rotate(-45deg);
      bottom: 34px;
      left: 0;
      width: 80px;
    `,
    winwin: `
      top: 5px;
      left: 0;
      width: 68px;
    `,
    lossloss: `
      bottom: 5px;
      left: 0;
      width: 68px;
    `,
  };
  return `
  position: absolute;
  height: 2px;
  background-color: var(--shade6);
  ${types[$status] || types.lossToWin}
`;
});
const Dot = styled("div")`
  position: absolute;
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border-radius: 50%;
  flex-shrink: 0;
  z-index: 2;
  ${(props) => (props.$isWin ? "top: 0;" : "bottom: 0;")}
  background: ${(props) =>
    props.$isWin
      ? "var(--blue)"
      : props.$isLoss
      ? "var(--red)"
      : "var(--shade3)"};
`;
const Avatar = styled("div")`
  width: 39px;
  height: 39px;
  background-color: var(--shade3);
  background-image: url(${(props) => props.url});
  background-size: contain;
  background-repeat: no-repeat;
  border-radius: 50%;
  flex-shrink: 0;
  box-sizing: border-box;
  border: 2px solid
    ${(props) =>
      props.$isWin
        ? "var(--blue)"
        : props.$isLoss
        ? "var(--red)"
        : "var(--shade7)"};
`;
