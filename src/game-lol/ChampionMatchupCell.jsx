import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import ChampionImg from "@/game-lol/ChampionImg.jsx";
import ChampionText from "@/game-lol/ChampionText.jsx";
import { Caption, CaptionBold, View } from "@/game-lol/CommonComponents.jsx";
import {
  ROLE_SYMBOL_TO_STR,
  ROLE_SYMBOL_TO_TAB_STRING,
} from "@/game-lol/constants.mjs";
import getRoleIcon from "@/game-lol/get-role-icon.mjs";
import {
  getBgImage,
  getChampionLink,
  getCurrentPatchForStaticData,
  getStaticChampionById,
  getWinRateColor,
  mapRoleToSymbol,
} from "@/game-lol/util.mjs";
import { getLocaleString } from "@/util/i18n-helper.mjs";

const percentOptions = {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  style: "percent",
};

const ChampionMatchupCellContainer = styled("a")`
  position: relative;
  display: flex;
  align-items: center;
  padding: var(--sp-3);
  background-color: var(--shade8);
  border-radius: var(--br-sm);
  transition: background var(--transition);

  &:hover,
  &.active {
    background-color: var(--shade6);
  }

  > * {
    position: relative;
  }
`;

const ChampionBackground = styled("div")`
  position: absolute;
  background-position: bottom left;
  background-size: auto 160px;
  bottom: 0;
  left: 0;
  top: 0;
  width: 60%;
  -webkit-mask-image: linear-gradient(
    to right,
    hsla(0deg 0% 0% / 0.45),
    transparent
  );
  pointer-events: none;
  background-image: ${(props) => (props.image ? `url(${props.image})` : "")};
`;

const GameWinRateText = styled("div")`
  font-weight: 500;
  font-size: var(--sp-3);
  line-height: var(--sp-5);
  letter-spacing: -0.009em;
  margin-right: var(--sp-1);
  text-align: center;
  ${(props) => props.color && `color: ${props.color};`}
  ${(props) => (props.$right ? `text-align: right;` : "")}
  ${(props) => props.width && `width: ${props.width};`}
`;
const PlayrateText = styled(CaptionBold)`
  color: var(--shade1);
  margin-right: var(--sp-1);
  text-align: center;
  ${(props) => props.width && `width: ${props.width};`}
`;

const RenderDetails = (props) => {
  const {
    detailType,
    winRate,
    laneWinRate,
    matchupRate,
    gameWinRateTextColor,
    sortBy,
    tab,
    viewMode,
  } = props;

  const { t } = useTranslation();
  let matchupDetails = "";

  switch (detailType) {
    case "DEFAULT":
    default:
      matchupDetails = (
        <div>
          <p className="type-caption">
            <span style={{ color: gameWinRateTextColor }}>
              {sortBy === "laneWinRate" ? laneWinRate : winRate}
            </span>{" "}
            <span>
              {sortBy === "laneWinRate"
                ? t("lol:inLane", "in Lane")
                : t("lol:inGame", "in Game")}
            </span>
          </p>
          <p className="type-caption">
            <span>{sortBy === "laneWinRate" ? winRate : laneWinRate}</span>{" "}
            <span>
              {sortBy === "laneWinRate"
                ? t("lol:inGame", "in Game")
                : t("lol:inLane", "in Lane")}
            </span>
          </p>
        </div>
      );
      break;
    case "2COLUMNS":
      matchupDetails = (
        <div>
          <View>
            <GameWinRateText color={gameWinRateTextColor} width={"9ch"}>
              {winRate}
            </GameWinRateText>
            {tab === "matchup" &&
            (viewMode === "tablet" || viewMode === "mobile") ? null : (
              <PlayrateText width="9ch">{matchupRate}</PlayrateText>
            )}
          </View>
        </div>
      );
      break;
    case "1COLUMN":
      matchupDetails = (
        <div>
          <View>
            <GameWinRateText color={gameWinRateTextColor} $right={true}>
              {winRate}
            </GameWinRateText>
          </View>
        </div>
      );
      break;
  }

  return matchupDetails;
};

const Container = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  > .left {
    position: relative;
    display: flex;
    align-items: center;

    > .champion {
      position: relative;
      margin-right: var(--sp-3);
    }
  }
`;

const RoleContainer = styled("div")`
  background: var(--shade8);
  border-radius: 50%;
  bottom: 0;
  height: var(--sp-6);
  width: var(--sp-6);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: -8px;

  svg {
    width: var(--sp-5);
    height: var(--sp-5);
  }
`;

const ChampionMatchupCell = (props) => {
  const {
    championId,
    matchupChampionId,
    filters,
    laneWinRate,
    matches,
    detailType,
    winRate,
    matchupRate,
    championImageSize,
    role,
    sortBy,
    tab,
    active,
  } = props;
  const { t } = useTranslation();
  const gameWinRateTextColor =
    sortBy === "laneWinRate"
      ? getWinRateColor(laneWinRate * 100)
      : getWinRateColor(winRate * 100);
  const roleData = ROLE_SYMBOL_TO_STR[role];
  const RoleIcon = getRoleIcon(
    ROLE_SYMBOL_TO_TAB_STRING[mapRoleToSymbol(roleData.key)]
  );
  const patch = filters?.path || getCurrentPatchForStaticData();
  const champion = getStaticChampionById(championId, patch);
  const matchupChampion = getStaticChampionById(matchupChampionId, patch);

  return (
    <ChampionMatchupCellContainer
      className={active ? "active" : ""}
      href={getChampionLink(
        champion?.key,
        "counters",
        matchupChampion?.key,
        filters
      )}
    >
      {matchupChampion && (
        <ChampionBackground image={getBgImage(matchupChampion.key)} />
      )}
      <Container>
        <div className="left">
          <div className="champion">
            <ChampionImg
              size={championImageSize || 48}
              championId={matchupChampion?.id}
              disabled={true}
            />
            <RoleContainer>
              <RoleIcon
                style={{
                  height: "18px",
                  width: "18px",
                  fill: "var(--shade0)",
                }}
              />
            </RoleContainer>
          </div>
          <div>
            <ChampionText disabled champion={matchupChampion} />
            <Caption>
              {t("lol:countMatches", "{{count}} Matches", {
                count: matches,
              })}
            </Caption>
          </div>
        </div>
        <RenderDetails
          detailType={detailType}
          winRate={getLocaleString(winRate, percentOptions)}
          matchupRate={getLocaleString(matchupRate, percentOptions)}
          laneWinRate={getLocaleString(laneWinRate, percentOptions)}
          gameWinRateTextColor={gameWinRateTextColor}
          sortBy={sortBy}
          tab={tab}
        />
      </Container>
    </ChampionMatchupCellContainer>
  );
};

export default ChampionMatchupCell;
