import React from "react";
import { Trans } from "react-i18next";
import { styled } from "goober";

import { RankTrend, ScoreTrend } from "@/game-lol/CommonComponents.jsx";
import IconBorderClose from "@/inline-assets/close_border.svg";
import HextechRoleSupport from "@/inline-assets/hextech-role-support.svg";
import LoadingSpinner from "@/inline-assets/loading-spinner-red.svg";

const PlayerStatWrapper = styled("div")`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;

  // Need to set minimal height of Empty Stat Tile
  min-height: 323px;

  background: var(--shade7);
  border-radius: var(--sp-2_5);
  padding: var(--sp-6);
  justify-content: center;

  ${ScoreTrend} {
    margin: 26px 0 44px;
    .label {
      font-size: var(--sp-4);
      display: flex;
    }
  }

  .rank-icon {
    fill: var(--shade3);
  }

  .sub-icon {
    position: absolute;
    margin-top: var(--sp-4);
    margin-left: var(--sp-5);
  }

  .coming-soon {
    position: absolute;
    bottom: var(--sp-9);
    font-size: var(--sp-2_5);
    line-height: var(--sp-2_5);
    margin-top: auto;
    color: var(--shade3);

    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }
`;

const BackgroundCircle = styled("div")`
  display: flex;
  position: absolute;
  width: 64px;
  height: 64px;
  background-color: var(--shade8);
  border-radius: 50%;
`;

const PlayerEmptyStatTile = (props) => {
  const { isLoading, comingSoon, hasAd } = props;

  return (
    <PlayerStatWrapper $hasAd={hasAd}>
      <RankTrend>
        {isLoading ? null : (
          <>
            <BackgroundCircle />
            <HextechRoleSupport className="rank-icon" />
            <IconBorderClose className="sub-icon" />
          </>
        )}
      </RankTrend>
      <ScoreTrend>
        <span className="label">
          {isLoading ? (
            <span className="sub-content">
              <LoadingSpinner />
            </span>
          ) : comingSoon ? (
            <span className="sub-content">
              <Trans i18nKey="lol:postmatch.emptyStat.moreFeatures">
                More Features
              </Trans>
            </span>
          ) : (
            <Trans i18nKey="lol:postmatch.emptyStat.notAvailable">
              Not Available
            </Trans>
          )}
        </span>
      </ScoreTrend>
      {comingSoon && (
        <span className="coming-soon">
          <Trans i18nKey="common:comingSoonNormal">Coming Soon</Trans>
        </span>
      )}
    </PlayerStatWrapper>
  );
};

export default PlayerEmptyStatTile;
