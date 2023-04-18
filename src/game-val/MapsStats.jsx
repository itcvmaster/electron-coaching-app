import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { AgentImage } from "@/game-val/CommonComponent.jsx";
import { MAP_ARTWORK_IMGS } from "@/game-val/constants.mjs";
import TooltipContainer from "@/game-val/TooltipContainer.jsx";
import {
  getMapDisplayName,
  getMapImage,
  getWinRateColor,
} from "@/game-val/utils.mjs";
import ProfileShowMore from "@/shared/ProfileShowMore.jsx";

const MapTooltip = styled("div")`
  min-width: calc(var(--sp-1) * 40);
  text-transform: capitalize;
  .stat-line {
    display: flex;
    justify-content: space-between;
  }
  .stat-line-label {
    color: var(--shade2);
  }
  .round-result {
    font-size: var(--sp-3);
    font-weight: 700;
  }
  .percent-stat {
    color: var(--shade3);
  }
`;

const RowContainer = styled("div")`
  display: flex;
  align-items: center;
  background: var(--shade7);
  .map-win-loss {
    text-transform: capitalize;
    color: var(--shade2);
  }
  .map-name {
    text-transform: capitalize;
  }
  & > a {
    width: 100%;
    min-height: var(--sp-16);
    box-sizing: border-box;
  }
`;
const StatLeft = styled("div")`
  display: block;
  margin-left: var(--sp-3);
`;
const StatRight = styled("div")`
  display: block;
  margin-left: auto;
  text-align: right;
`;

const Row = styled("div")`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  user-select: none;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: background-color var(--transition);
  padding: var(--sp-2) 0;

  .map-image {
    width: var(--sp-9);
    height: var(--sp-9);
  }
`;

const MapStatsLoader = () => "";
const DEFAULT_SHOWN = 3;

const MapRow = ({ map, isDeathmatch }) => {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);
  const mapName = map[0];
  const mapData = map[1];
  const {
    attackingPlayed,
    attackingWon,
    defendingPlayed,
    defendingWon,
    matches,
    // roundsPlayed,
    // roundsWon,
    ties,
    wins,
  } = mapData;

  const losses = matches - ties - wins;
  const mapFileName = MAP_ARTWORK_IMGS[mapName];
  const map_image = getMapImage(mapFileName);
  if (!matches) return null;
  const winPercent = Math.floor((wins / matches) * 100);
  const lossPercent = Math.floor((losses / matches) * 100);
  const defenseWinPercent = Math.floor((defendingWon / defendingPlayed) * 100);
  const attackWinPercent = Math.floor((attackingWon / attackingPlayed) * 100);
  return (
    <RowContainer
      onMouseOut={() => {
        setShowTooltip(false);
      }}
      onMouseOver={() => {
        setShowTooltip(true);
      }}
    >
      {showTooltip && (
        <TooltipContainer transformX="50" transformY="-70">
          <MapTooltip>
            <p className="type-h6">
              {t("val:mapName", "{{mapName}}", {
                mapName: getMapDisplayName(mapName),
              })}
            </p>

            <div className="stat-line">
              <p className="type-caption">{t("val:wins", "wins:")}</p>
              <div>
                <span
                  className="round-result"
                  style={{
                    color: "#47b3ff",
                  }}
                >
                  {t("val:wins", "{{wins}}", { wins: wins })}
                </span>
                &nbsp;
                <span className="type-caption--bold percent-stat">
                  {t("val:winPercent", "({{winPercent}}%)", {
                    winPercent: winPercent,
                  })}
                </span>
              </div>
            </div>

            <div className="stat-line">
              <p className="type-caption">{t("val:losses", "losses:")}</p>
              <div>
                <span
                  className="round-result"
                  style={{
                    color: "#ff5757",
                  }}
                >
                  {t("val:losses", "{{losses}}", { losses: losses })}
                </span>
                &nbsp;
                <span className="type-caption--bold percent-stat">
                  {t("val:lossPercent", "({{lossPercent}}%)", {
                    lossPercent: lossPercent,
                  })}
                </span>
              </div>
            </div>

            <p
              className="type-body2-form--active"
              style={{ paddingTop: "var(--sp-2)" }}
            >
              {t("val:attackingRounds", "Attacking Rounds:")}
            </p>
            <div className="stat-line">
              <p className="type-caption">{t("val:wins", "wins:")}</p>
              <div>
                <span
                  className="round-result"
                  style={{
                    color: "#47b3ff",
                  }}
                >
                  {t("val:wins", "{{wins}}", { wins: attackingWon })}
                </span>
                &nbsp;
                <span className="type-caption--bold percent-stat">
                  {t("val:winPercent", "({{winPercent}}%)", {
                    winPercent: attackWinPercent,
                  })}
                </span>
              </div>
            </div>

            <div className="stat-line">
              <p className="type-caption">{t("val:losses", "losses:")}</p>
              <div>
                <span
                  className="round-result"
                  style={{
                    color: "#ff5757",
                  }}
                >
                  {t("val:losses", "{{losses}}", {
                    losses: attackingPlayed - attackingWon,
                  })}
                </span>
                &nbsp;
                <span className="type-caption--bold percent-stat">
                  {t("val:lossPercent", "({{lossPercent}}%)", {
                    lossPercent: 100 - attackWinPercent,
                  })}
                </span>
              </div>
            </div>

            <p
              className="type-body2-form--active"
              style={{ paddingTop: "var(--sp-2)" }}
            >
              {t("val:defendingRounds", "Defending Rounds:")}
            </p>
            <div className="stat-line">
              <p className="type-caption">{t("val:wins", "wins:")}</p>
              <div>
                <span
                  className="round-result"
                  style={{
                    color: "#47b3ff",
                  }}
                >
                  {t("val:wins", "{{wins}}", { wins: defendingWon })}
                </span>
                &nbsp;
                <span className="type-caption--bold percent-stat">
                  {t("val:winPercent", "({{winPercent}}%)", {
                    winPercent: defenseWinPercent,
                  })}
                </span>
              </div>
            </div>
            <div className="stat-line">
              <p className="type-caption">{t("val:losses", "losses:")}</p>
              <div>
                <span
                  className="round-result"
                  style={{
                    color: "#ff5757",
                  }}
                >
                  {t("val:losses", "{{losses}}", {
                    losses: defendingPlayed - defendingWon,
                  })}
                </span>
                &nbsp;
                <span className="type-caption--bold percent-stat">
                  {t("val:lossPercent", "({{lossPercent}}%)", {
                    lossPercent: defenseWinPercent,
                  })}
                </span>
              </div>
            </div>
          </MapTooltip>
        </TooltipContainer>
      )}
      <Row>
        <AgentImage className="map-image" src={map_image}></AgentImage>
        <StatLeft>
          <p className="type-caption map-name">
            {t("val:mapName", "{{mapName}}", {
              mapName: getMapDisplayName(mapName),
            })}
          </p>
          <span
            className="type-caption match-sub-stat"
            style={{ color: getWinRateColor(winPercent) }}
          >
            {t("val:winPercent", "{{winPercent}}%", {
              winPercent: winPercent,
            })}
            &nbsp;
          </span>
          <span className="type-caption map-win-loss">
            {t("val:nWinsAndnLosses", `{{wins}}W - {{losses}}L`, {
              wins: wins,
              losses: losses,
            })}
          </span>
        </StatLeft>
        {!isDeathmatch && (
          <StatRight>
            <p
              className="type-caption--bold"
              style={{ color: getWinRateColor(attackWinPercent) }}
            >
              <span className="map-win-loss">{t("val:atk", "Atk")}</span>&nbsp;
              <span>
                {t("val:winPercent", "{{percent}}%", {
                  percent: attackWinPercent,
                })}
              </span>
            </p>
            <p
              className="type-caption--bold"
              style={{ color: getWinRateColor(defenseWinPercent) }}
            >
              <span className="map-win-loss">{t("val:def", "Def")}</span>&nbsp;
              <span>
                {t("val:winPercent", "{{percent}}%", {
                  percent: defenseWinPercent,
                })}
              </span>
            </p>
          </StatRight>
        )}
      </Row>
    </RowContainer>
  );
};

const MapStats = ({ mapStats, isDeathmatch }) => {
  const [showAll, setShowAll] = useState(false);

  const setShowMore = useCallback(() => {
    setShowAll(!showAll);
  }, [showAll]);

  const Footer = () =>
    mapStats && <ProfileShowMore showAll={showAll} setShowMore={setShowMore} />;

  let renderedList = mapStats ? Object.entries(mapStats) : null;

  if (!showAll) {
    renderedList = renderedList?.slice(0, DEFAULT_SHOWN);
  }

  return (
    <>
      {!mapStats ? (
        <>
          {[...Array(5)].map((_, i) => (
            <MapStatsLoader key={i} />
          ))}
        </>
      ) : (
        <>
          {renderedList.map((mapData) => {
            return (
              <MapRow
                key={mapData[0]}
                map={mapData}
                isDeathmatch={isDeathmatch}
              />
            );
          })}
          <Footer />
        </>
      )}
    </>
  );
};

export default MapStats;
