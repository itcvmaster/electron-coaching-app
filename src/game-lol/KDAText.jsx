import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { css } from "goober";
import PropTypes from "prop-types";

const KDA_COLORS = {
  kda1less: "#828790",
  kda1to2: "#978D87",
  kda2to4: "#C4A889",
  kda4to6: "#DEAF78",
  kda6to10: "#E6A85F",
  kda10plus: "#FF9417",
  perfect: "#ffbe05",
};

const customColor = (props) => {
  let _color = "";
  const { kda } = props;
  if (kda < 1) {
    _color = KDA_COLORS.kda1less;
  } else if (kda <= 2) {
    _color = KDA_COLORS.kda1to2;
  } else if (kda <= 4) {
    _color = KDA_COLORS.kda2to4;
  } else if (kda <= 6) {
    _color = KDA_COLORS.kda4to6;
  } else if (kda <= 10) {
    _color = KDA_COLORS.kda6to10;
  } else {
    _color = KDA_COLORS.kda10plus;
  }
  return css`
    color: ${_color}!important;
    font-size: var(--sp-2_5);
    font-weight: 500;
    line-height: 1;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  `;
};
class KDA extends Component {
  render() {
    const {
      tag_style,
      kills,
      deaths,
      assists,
      normalColorOverride,
      hideKDACaption,
      parentheses,
      t,
    } = this.props;
    const kda = (kills + assists) / (deaths || 1);
    return (
      <p kda={kda} className={customColor({ kda })}>
        {parentheses && "("}
        {kda.toFixed(1)}
        {parentheses && ")"}
        {!hideKDACaption && (
          <span kda={kda} style={{ ...tag_style, color: normalColorOverride }}>
            {` ${t("common:stats.kda", "KDA")}`}
          </span>
        )}
      </p>
    );
  }
}

KDA.propTypes = {
  kills: PropTypes.number,
  deaths: PropTypes.number,
  assists: PropTypes.number,
};

const TranslatedKDA = withTranslation(["common", "lol"])(KDA);

export default TranslatedKDA;
