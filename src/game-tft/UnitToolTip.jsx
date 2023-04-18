import React from "react";
import ReactDOMServer from "react-dom/server";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { appURLs } from "@/app/constants.mjs";
import fixTraitNames from "@/game-tft/get-trait-names.mjs";
import getTranslatedTraits from "@/game-tft/get-translated-traits.mjs";
import HextechMatchGoldIcon from "@/inline-assets/hextech-match-gold.svg";
import TypeHexIcon from "@/inline-assets/type-hex.svg";

const UnitToolTip = ({ children, champInfo, skinSetting = true, set }) => {
  const { t } = useTranslation();
  if (!champInfo || !set || !champInfo[set]) return children;
  const traits = champInfo[set]?.class.concat(champInfo[set].origin);
  const champKey = champInfo.key;
  const champName = champInfo.name;
  const cost = champInfo[set].cost;
  const set_image_url = `${appURLs.CDN}/blitz/centered-tft/${set}/${champKey}_Splash_Centered_0.png`;
  const default_image_url = `${appURLs.CDN}/blitz/centered-tft/set1/${champKey}_Splash_Centered_0.jpg`;
  const img_url = skinSetting ? set_image_url : default_image_url;
  const htmlTooltip = ReactDOMServer.renderToStaticMarkup(
    <TooltipContainer>
      <div
        className="unit-tooltip"
        style={{
          opacity: 1,
        }}
      >
        <div>
          <div className="imgOverlay" />
          <img src={img_url} alt={champKey} />
          <div className="unit-traits">
            {traits?.map((trait, i) => (
              <div className="unit-trait" key={i}>
                <TypeHexIcon name={fixTraitNames(trait)} />
                <span>{getTranslatedTraits(t, trait)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hover-bottom">
          <div className="unit-name">
            <span>{champName}</span>
          </div>
          <div className={["unit-cost", "cost-" + cost].join(" ")}>
            <HextechMatchGoldIcon />
            {cost}
          </div>
        </div>
      </div>
    </TooltipContainer>
  );

  return <ToolTipBox data-tip={htmlTooltip}>{children}</ToolTipBox>;
};

export default UnitToolTip;

const ToolTipBox = styled("div")`
  > * {
    pointer-events: none;
  }
`;

const TooltipContainer = styled("div")`
  width: 173px;
  height: 141px;
  font-size: 12px !important;
  color: var(--shade1);
  background: var(--shade10);
  border-radius: var(--br);
  position: absolute;
  left: -76px;
  top: -2px;
  filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.25));

  .unit-tooltip {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--white);
    font-size: var(--sp-3);
    font-weight: 700;
    opacity: 0;
    border-radius: var(--br);
    padding: 5px;
  }

  .imgOverlay {
    background: linear-gradient(
      66.84deg,
      rgba(7, 14, 29, 0.8) 11.77%,
      rgba(7, 14, 29, 0.51) 44.28%,
      rgba(7, 14, 29, 0) 67.49%
    );
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 2;
    border-radius: var(--br);
    height: 107px;
  }

  img {
    object-fit: cover;
    object-position: right top;
    height: 97px;
    width: 100%;
  }

  .unit-traits {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    position: absolute;
    bottom: 43px;
    left: var(--sp-2_5);
    filter: drop-shadow(0px 2px 20px #000000);
    z-index: 5;
  }

  .unit-trait {
    display: flex;
    align-items: center;
    margin-top: 4px;
    color: var(--white);
  }

  .unit-trait svg,
  .unit-trait div {
    width: var(--sp-5);
    height: var(--sp-5);
  }

  .unit-trait .trait_icon {
    width: 70%;
  }

  .hover-bottom {
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 6px 6px 0 6px;
  }

  .unit-traits span {
    margin-left: 4px;
  }

  .unit-cost {
    display: flex;
    align-items: center;
  }

  .unit-cost svg {
    margin-right: 2px;
    color: #efbf6c;
    margin-top: 2px;
  }
`;
