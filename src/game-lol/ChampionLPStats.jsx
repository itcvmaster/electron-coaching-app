import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { kdaColorStyle } from "@/app/util.mjs";
import { ARAM_QUEUE_TYPES } from "@/game-lol/constants.mjs";
import getHextechRoleIcon from "@/game-lol/lol-icons.mjs";
import Static from "@/game-lol/static.mjs";
import ARAM from "@/inline-assets/lol-role-aram.svg";
import {
  ListContainer,
  Row,
  RowContainer,
  StatLeft,
  StatRight,
} from "@/shared/ProfileStats.style.jsx";
import { getLocale } from "@/util/i18n-helper.mjs";

const ChampStats = styled(RowContainer)`
  .role-icon {
    display: block;
    stroke-width: 0;
    stroke: currentColor;
    fill: currentColor;
  }
`;

const LeaguePoints = styled("div")`
  position: relative;
  display: flex;
  box-sizing: border-box;
  justify-content: flex-end;

  & > p {
    text-align: right;
  }
`;

const ChampionIcon = styled("div")`
  display: flex;
  position: relative;

  .champion-icon {
    border-radius: var(--br);
  }
`;

const RoleIconWrapper = styled("div")`
  position: absolute;
  bottom: calc(var(--sp-1) * -1);
  right: calc(var(--sp-1) * -1);
  padding: var(--sp-1);
  background: var(--shade7);
  font-size: var(--sp-3);
  border-radius: var(--br);
  transition: background var(--transition);
`;
const WinRateInfo = styled("div")`
  display: flex;
  flex-direction: row;

  p {
    padding: 0;
    line-height: var(--sp-5);
  }
`;

const ChampionLPStats = ({ queue, champions, allchamps }) => {
  const { t } = useTranslation();
  // const gotoChampionPool = (_role, _champName) => {};

  return (
    <>
      <ListContainer>
        {champions.map((entry, index) => {
          const { kda, games, wins, lp, winrate, role, id } = entry;
          const champ = Object.values(allchamps).find(
            ({ key }) => key === String(id)
          );
          const champName = champ?.name;
          const _role =
            ARAM_QUEUE_TYPES.includes(queue) || (queue === "all" && role === "")
              ? "aram"
              : role?.toLowerCase();

          const winRate = Math.floor(winrate || 0);
          const lpColor = lp > 0 ? "rgb(36, 232, 204)" : "rgb(255, 88, 89)";
          const hidelp = false;
          const RoleIcon = getHextechRoleIcon(_role);
          const tileImage = Static.getChampionImageById(allchamps, id);

          const imageStyle = {
            width: "var(--sp-12)",
            height: "var(--sp-12)",
            backgroundImage: `url(${tileImage})`,
            backgroundSize: "112%",
            backgroundPosition: "50%",
            borderRadius: 5,
          };
          return (
            <ChampStats key={"champ_stats_" + index}>
              <Row
                onClick={() => {
                  // gotoChampionPool(role, champkey);
                }}
              >
                <ChampionIcon>
                  <div
                    className="profile_match-image"
                    style={imageStyle}
                    css={``}
                  />
                  <RoleIconWrapper className="role-icon">
                    {_role === "aram" ? (
                      <ARAM className="role-icon" />
                    ) : (
                      <RoleIcon />
                    )}
                  </RoleIconWrapper>
                </ChampionIcon>
                <StatLeft>
                  <p className="type-subtitle2">{champName}</p>
                  <p
                    className="type-caption--bold"
                    style={{ color: kdaColorStyle(kda) }}
                  >
                    {isNaN(kda)
                      ? (0).toLocaleString(getLocale(), {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : kda.toFixed(2)}
                    &nbsp;
                    <span>{t("common:kda", "KDA")}</span>
                  </p>
                </StatLeft>
                <StatRight>
                  {!hidelp && _role !== "aram" && lp !== 0 ? (
                    lp !== undefined ? (
                      <LeaguePoints>
                        <p
                          className="type-caption--bold"
                          style={{ color: lpColor }}
                        >
                          {lp > 0 ? "+" : ""}
                          {t("lol:leaguePoints", "{{points}} LP", {
                            points: lp !== null && lp !== undefined ? lp : "-",
                          })}
                        </p>
                      </LeaguePoints>
                    ) : (
                      <p className="type-caption">
                        {t("lol:countGame", { count: games })}
                      </p>
                    )
                  ) : null}
                  <WinRateInfo>
                    <p
                      className="type-caption--bold"
                      style={{
                        color: "var(--shade1)",
                      }}
                    >
                      {t("lol:matchHistory.winRate", "{{winRate}}%", {
                        winRate: winRate,
                      })}
                      &nbsp;&nbsp;
                    </p>
                    <p
                      className="type-caption"
                      style={{ color: "var(--shade2)" }}
                    >
                      {t(
                        "lol:matchHistory.winsAndLossesWithHypen",
                        "{{wins}}W-{{losses}}L",
                        {
                          wins: wins ?? 0,
                          losses: (games ?? 0) - (wins ?? 0),
                        }
                      )}
                    </p>
                  </WinRateInfo>
                </StatRight>
              </Row>
            </ChampStats>
          );
        })}
      </ListContainer>
    </>
  );
};
export default ChampionLPStats;
