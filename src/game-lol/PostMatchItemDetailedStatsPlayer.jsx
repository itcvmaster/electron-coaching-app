import React, { useState } from "react";
import ReactDOMServer from "react-dom/server";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { mobile, mobileSmall } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import ChampionImg from "@/game-lol/ChampionImg.jsx";
import ChampionRuneModalPage from "@/game-lol/ChampionRuneModalPage.jsx";
import {
  Overline,
  TagTooltipDescription,
} from "@/game-lol/CommonComponents.jsx";
import {
  QUEUE_SYMBOL_TO_STR,
  ROLE_SYMBOLS,
  TIER_UNRANKED,
} from "@/game-lol/constants.mjs";
import getHextechRankIcon from "@/game-lol/get-rank-icon.mjs";
import ItemImg from "@/game-lol/ItemImg.jsx";
import KDAText from "@/game-lol/KDAText.jsx";
import RuneImg from "@/game-lol/RuneImg.jsx";
import SpellImg from "@/game-lol/SpellImg.jsx";
import TreeImg from "@/game-lol/TreeImg.jsx";
import {
  convertRankFromRomanToNumber,
  getBorderColor,
  getDerivedId,
  getRankBasedOnQueue,
  getRuneTreeObjectFromParticipant,
  getShardArrayFromParticipant,
  getStaticData,
  mapRoleToSymbol,
  regionsToServices,
  tierToAbbr,
} from "@/game-lol/util.mjs";
import RankNone from "@/inline-assets/rank-none.svg";
import getOrdinal from "@/util/get-ordinal.mjs";
import { getLocale } from "@/util/i18n-helper.mjs";

const StyledChampionImg = styled((p) => <ChampionImg {...p} />)`
  box-sizing: border-box;
  border: 2px solid ${({ isme, isMyTeam }) => getBorderColor(isme, isMyTeam)};
`;
const StyledSpellImg = styled((p) => <SpellImg {...p} />)``;

const PlayerLink = styled("a")`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  padding: var(--sp-2) var(--sp-3);
  position: relative;

  &:nth-child(odd) {
    background: var(--shade8);
  }

  &:hover {
    background: var(--shade6);
  }

  &.isMe {
    background: linear-gradient(
      to left,
      transparent 0%,
      var(--yellow-hsl / 0.25) 100%
    );

    &:hover {
      background: linear-gradient(
        to left,
        transparent 0%,
        var(--yellow-hsl / 0.25) 100%
      );
    }
  }
  .type-overline {
    font-weight: 500;
    font-size: var(--sp-2_5);
    line-height: 1;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgb(130, 135, 144);
  }
`;

const UserAccent = styled("div")`
  position: absolute;
  height: 100%;
  width: 3px;
  left: 0;
  background: var(--yellow);
`;
const PlayerInfo = styled("div")`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;

  ${mobile} {
    align-items: flex-start;
  }

  .player-profile-img {
    max-width: 40px;
  }

  .player-stats {
    width: 55%;

    ${mobileSmall} {
      width: 50%;
    }
    &_head {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
    }
  }

  .player-items {
    width: 25%;
    ${mobileSmall} {
      width: 30%;
    }
  }
`;
const PlayerChampion = styled("div")`
  margin-right: var(--sp-1);
`;
const PlayerSpells = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    border-radius: 4px;
    width: var(--sp-4);
    height: var(--sp-4);

    &:nth-child(1) {
      margin-bottom: var(--sp-1);
    }
  }
`;
const PlayerRunes = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: var(--sp-1);
`;
const PlayerRank = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex: 0.5;
  color: var(--shade3);

  ${mobile} {
    position: relative;
    top: -8px;
    flex-direction: row;
    flex: auto;
    justify-content: flex-start;
  }

  .rank-icon {
    width: 16px;
    height: 16px;
  }
`;
const RankName = styled(Overline)`
  color: var(--shade2);

  ${mobile} {
    margin-left: var(--sp-1);
  }
`;
const PlayerItems = styled("div")`
  display: flex;
  margin: 0 var(--sp-1);

  img,
  div {
    margin: 0 var(--sp-0_5);

    ${mobile} {
      margin: 0 var(--sp-0_5) var(--sp-0_5);
    }
  }

  ${mobile} {
    flex-wrap: wrap;
    margin: 0 0 var(--sp-1_5);
  }
`;
const PlayerKDA = styled("div")`
  flex: 1;
  margin: 0 var(--sp-1);
  text-align: center;

  ${mobile} {
    text-align: start;
    margin: 0;
  }
`;
const PlayerCS = styled("div")`
  flex: 1;
  margin: 0 var(--sp-1);
  text-align: center;

  span {
    color: var(--shade1);
    margin: 0 var(--sp-1);
  }

  ${mobile} {
    text-align: start;
    margin: 0;
  }
`;
const PlayerDamage = styled("div")`
  flex: 1.1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: var(--sp-1);
  text-align: right;

  ${mobile} {
    display: block;
    margin-left: 0;
  }
`;
const DamageBar = styled("div")`
  width: 100%;
  max-width: 68px;
  position: relative;
  border-radius: var(--br-sm);
  background: var(--shade6);
  height: var(--sp-1);
  margin-top: var(--sp-1);
`;
const DamageBarFill = styled("div")`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: ${({ damagepercentage }) => `${damagepercentage}%`};
  background: var(--bar-color);
  border-radius: var(--br-sm);
`;

const Player = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const PlayerName = styled("p")`
  width: var(--sp-20);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

// Match placement ranking tag
const TagFrame = styled("div")`
  position: relative;
  display: inline-block;
  padding-left: 6px;
  padding-right: 6px;

  & > * {
    pointer-events: none;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--tag-color, var(--shade3));
    border-radius: var(--br-sm);
    opacity: 0.15;
  }

  .tag-text {
    position: relative;
    color: var(--tag-color, var(--shade3));
  }
`;

const Tag = ({ text, tagColor, isMVP = false, tiltFree = false, ...props }) => {
  if (!tiltFree || (tiltFree && isMVP)) {
    return (
      <TagFrame style={{ "--tag-color": tagColor }} {...props}>
        <p className="type-caption--bold tag-text">{text}</p>
      </TagFrame>
    );
  }
  return null;
};

const MatchDetailedStatsPlayer = ({
  // account,
  isMyTeam,
  participant,
  currParticipant,
  highestDamage,
  totalKills,
  duration,
  platformId,
  queueType,
  winningTeamId,
  playersRankings,
  patch,
  region,
}) => {
  const { t } = useTranslation();
  const state = useSnapshot(readState);
  const [isShow, setShow] = useState(false);

  const playerDerivedId = getDerivedId(region, participant?.summonerName);
  const currentProfile = state?.lol?.profiles?.[playerDerivedId];
  const leagues = currentProfile?.latestRanks || [];
  const seasons = state?.lol?.seasons;
  const perks = getStaticData("runes", patch);
  const tiltFree = false;
  if (!participant) return null;
  const actualRank = getRankBasedOnQueue(
    QUEUE_SYMBOL_TO_STR[queueType]?.gql || "RANKED_SOLO_5X5",
    seasons,
    leagues
  );
  const damagePercentage =
    participant.totalDamageDealtToChampions / highestDamage;
  const isUnranked = leagues && !actualRank;

  const isMe = currParticipant?.participantId === participant?.participantId;

  const isSupport =
    mapRoleToSymbol(participant.individualPosition) === ROLE_SYMBOLS.support;
  const isWinner = participant.teamId === winningTeamId;

  const playerRegion = regionsToServices(platformId);
  const runeTrees = getRuneTreeObjectFromParticipant(participant, perks);
  const { secondTree, keystone } = runeTrees;
  const selectedShards = getShardArrayFromParticipant(participant);

  const playerScores =
    playersRankings &&
    participant &&
    playersRankings.find(
      (p) =>
        p.teamId === participant.teamId &&
        p.championId === participant.championId
    );

  const playerRanking =
    playerScores &&
    playersRankings.findIndex(
      (p) =>
        p.teamId === participant.teamId &&
        p.championId === participant.championId
    ) + 1;

  const bestWinner = playersRankings?.find((p) => p.teamId === winningTeamId);
  const isMVP =
    participant?.teamId === bestWinner?.teamId &&
    participant?.championId === bestWinner?.championId;
  const showRankTag =
    tiltFree && playerRanking === 1
      ? true
      : !!(tiltFree === false && playerRanking);

  const tagText = isMVP ? "MVP" : getOrdinal(playerRanking);
  const tagColor = isMVP ? "var(--yellow)" : "var(--shade1)";

  const tagTooltipHTML = ReactDOMServer.renderToStaticMarkup(
    <TagTooltipDescription
      points={playerScores}
      isSupport={isSupport}
      isWinner={isWinner}
    />
  );
  const RankIcon = actualRank && getHextechRankIcon(actualRank.tier);

  return (
    <>
      <PlayerLink
        href={`/lol/profile/${playerRegion}/${participant.summonerName.toLowerCase()}`}
        className={isMe && "isMe"}
      >
        {isMe && <UserAccent />}
        <PlayerInfo>
          <PlayerChampion>
            <StyledChampionImg
              disableDataTip
              championId={participant.championId}
              championKey={participant.championName}
              level={participant.champLevel}
              size={32}
              isme={isMe}
              isMyTeam={isMyTeam}
              patch={patch}
              border={true}
            />
          </PlayerChampion>
          <PlayerSpells>
            <StyledSpellImg spellId={participant.summoner1Id} patch={patch} />
            <StyledSpellImg spellId={participant.summoner2Id} patch={patch} />
          </PlayerSpells>
          <PlayerRunes>
            <RuneImg
              size={1}
              runeTree={runeTrees}
              selectedShards={selectedShards}
              perks={perks}
              currRune={keystone}
              setShow={setShow}
            />
            <TreeImg size={1} tree={secondTree} isActive noBorder />
          </PlayerRunes>
          <Player>
            <PlayerName className="type-caption--bold">
              {participant.summonerName}
            </PlayerName>
            {showRankTag && playerRanking && (
              <Tag
                text={tagText}
                tagColor={tagColor}
                tiltFree={tiltFree}
                isMVP={isMVP}
                data-tip={tagTooltipHTML}
                // eslint-disable-next-line i18next/no-literal-string
                data-place="left"
              />
            )}
          </Player>
          <PlayerRank>
            {leagues && actualRank && (
              <>
                <RankIcon className={"rank-icon"} />
                <RankName>
                  {actualRank &&
                    `${tierToAbbr(actualRank)}${
                      TIER_UNRANKED.includes(actualRank.tier)
                        ? ""
                        : convertRankFromRomanToNumber(actualRank.rank)
                    }`}
                </RankName>
              </>
            )}
            {/* eslint-disable-next-line */}
            {isUnranked && <RankNone className={"rank-icon"} />}
          </PlayerRank>
          <PlayerItems>
            <ItemImg
              itemId={participant.item0}
              size={1.625}
              patch={patch}
              bgColor={participant.item0 ? "var(--shade8)" : null}
            />
            <ItemImg
              itemId={participant.item1}
              size={1.625}
              patch={patch}
              bgColor={participant.item1 ? "var(--shade8)" : null}
            />
            <ItemImg
              itemId={participant.item2}
              size={1.625}
              patch={patch}
              bgColor={participant.item2 ? "var(--shade8)" : null}
            />
            <ItemImg
              itemId={participant.item3}
              size={1.625}
              patch={patch}
              bgColor={participant.item3 ? "var(--shade8)" : null}
            />
            <ItemImg
              itemId={participant.item4}
              size={1.625}
              patch={patch}
              bgColor={participant.item4 ? "var(--shade8)" : null}
            />
            <ItemImg
              itemId={participant.item5}
              size={1.625}
              patch={patch}
              bgColor={participant.item5 ? "var(--shade8)" : null}
            />
            <ItemImg
              itemId={participant.item6}
              size={1.625}
              patch={patch}
              bgColor={participant.item6 ? "var(--shade8)" : null}
            />
          </PlayerItems>
          <PlayerKDA>
            <p className="type-caption">
              {t("lol:displayKDA", "{{kills}} / {{deaths}} / {{assists}}", {
                kills: participant.kills,
                deaths: participant.deaths,
                assists: participant.assists,
              })}
            </p>
            <KDAText
              kills={participant.kills}
              deaths={participant.deaths}
              assists={participant.assists}
            />
          </PlayerKDA>
          <PlayerCS>
            <p className="type-caption">
              {participant.totalMinionsKilled +
                participant.neutralMinionsKilled}
              <span>
                (
                {parseFloat(
                  (participant.totalMinionsKilled +
                    participant.neutralMinionsKilled) /
                    (duration / 60)
                ).toLocaleString(getLocale(), {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
                )
              </span>
              <span>{t("lol:cs", "CS")}</span>
            </p>
            <div>
              <p
                className="type-overline"
                css={`
                  color: var(--shade2);
                `}
              >
                {t("lol:percentKillParticipation", "{{kp}}% KP", {
                  kp: (
                    ((participant.kills + participant.assists) /
                      (totalKills > 0 ? totalKills : 1)) *
                    100
                  ).toFixed(0),
                })}
              </p>
            </div>
          </PlayerCS>
          <PlayerDamage>
            <p
              className="type-caption"
              data-tip={`<div style="padding:var(--sp-1) var(--sp-2)">${t(
                "lol:damageDealtToChampions",
                "Damage Dealt To Champions"
              )}</div>`}
            >
              {participant.totalDamageDealtToChampions &&
                participant.totalDamageDealtToChampions.toLocaleString(
                  getLocale()
                )}{" "}
              {t("common:stats.dmg", "Dmg")}
            </p>
            <DamageBar>
              <DamageBarFill
                damagepercentage={damagePercentage * 100}
                style={{
                  "--bar-color": isMe
                    ? "var(--yellow)"
                    : isMyTeam
                    ? "var(--blue)"
                    : "var(--red)",
                }}
              />
            </DamageBar>
          </PlayerDamage>
        </PlayerInfo>
      </PlayerLink>
      {isShow && (
        <ChampionRuneModalPage
          selectedShards={selectedShards}
          runeTree={runeTrees}
          perks={perks}
          setShow={setShow}
        />
      )}
    </>
  );
};

export default MatchDetailedStatsPlayer;
