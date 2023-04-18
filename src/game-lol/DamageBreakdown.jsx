import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import LolColor from "@/game-lol/colors.mjs";
import { Caption } from "@/game-lol/CommonComponents.jsx";
import { calcTeamDamages } from "@/game-lol/util.mjs";

const DamageFrame = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const DamageTypeFrame = styled("div")`
  z-index: 1;
  ${({ width }) => width && `width: ${width}%`};
  ${({ type }) =>
    type === "ap"
      ? `margin-right: 2px;`
      : type === "ad"
      ? `margin: 0 2px;`
      : `margin-left: 2px;`};
`;

// const TooltipList = styled("ul")`
//   list-style: none;
//   margin: 0;
//   padding: 0;
// `;

// const TooltipItem = styled("li")`
//   align-items: center;
//   display: flex;
//   font-size: var(--sp-3);
// `;

// const TooltipDot = styled("span")`
//   border-radius: 50%;
//   display: inline-block;
//   height: var(--sp-3);
//   margin-right: 8px;
//   position: relative;
//   width: var(--sp-3);
// `;

const DamageBar = styled("div")`
  width: 100%;
  height: 4px;
  border-radius: var(--br-sm);

  ${({ dmgtype }) =>
    dmgtype === "ap"
      ? `background: ${LolColor.damageType.ap};`
      : dmgtype === "ad"
      ? `background: ${LolColor.damageType.ad}`
      : `background: ${LolColor.damageType.tr}`};
`;

const EmptyBarFrame = styled("div")`
  position: absolute;
  top: 0;
  z-index: 0;
`;

const EmptyBar = styled(DamageBar)`
  background: var(--shade6);
`;

const DamageText = styled(Caption)`
  font-weight: 700;
  height: var(--sp-4);
  ${({ dmgtype }) =>
    dmgtype === "ap"
      ? `color: ${LolColor.damageType.ap};`
      : dmgtype === "ad"
      ? `color: ${LolColor.damageType.ad}`
      : `color: ${LolColor.damageType.tr}`};
`;

const DamageBreakdown = ({
  teamStats,
  hiddenThreshold = 3,
  showTitle = false,
  ...restProps
}) => {
  const { t } = useTranslation();

  const { apDamageShare, adDamageShare, trueDamageShare } =
    calcTeamDamages(teamStats);

  const title = t("lol:abilities.damageBreakdown", "Damage Breakdown");

  const getTextPercentage = (perc, type) => {
    if (perc <= hiddenThreshold) return "";
    else if (perc <= hiddenThreshold + 8 && perc > hiddenThreshold)
      return `${perc}%`;
    return `${perc}% ${type}`;
  };

  // let tooltipHtml = (
  //   <TooltipList>
  //     <TooltipItem>
  //       <TooltipDot
  //         css={`
  //           background: ${LolColor.damageType.ap};
  //         `}
  //       />
  //       <span>
  //         {t("lol:damage.abilityDmg", `${apDamageShare}% Ability Power`, {
  //           damage: apDamageShare,
  //         })}
  //       </span>
  //     </TooltipItem>
  //     <TooltipItem
  //       css={`
  //         margin: 4px 0;
  //       `}
  //     >
  //       <TooltipDot
  //         css={`
  //           background: ${LolColor.damageType.ad};
  //         `}
  //       />
  //       <span>
  //         {t("lol:damage.attackDmg", `${adDamageShare}% Attack Damage`, {
  //           damage: adDamageShare,
  //         })}
  //       </span>
  //     </TooltipItem>
  //     <TooltipItem>
  //       <TooltipDot
  //         css={`
  //           background: ${LolColor.damageType.tr};
  //         `}
  //       />
  //       <span>
  //         {t("lol:damage.trueDmg", `${adDamageShare}% True Damage`, {
  //           damage: trueDamageShare,
  //         })}
  //       </span>
  //     </TooltipItem>
  //   </TooltipList>
  // );

  // tooltipHtml = ReactDOMServer.renderToStaticMarkup(tooltipHtml);

  return (
    <div {...restProps}>
      {showTitle && (
        <div
          style={{
            color: "var(--shade2)",
            fontSize: "var(--sp-3)",
          }}
        >
          {title}
        </div>
      )}
      <DamageFrame
      // data-tip={tooltipHtml}
      >
        {apDamageShare && (
          <DamageTypeFrame type={"ap"} width={apDamageShare}>
            <DamageBar dmgtype={"ap"} />
            <DamageText dmgtype={"ap"}>
              {getTextPercentage(apDamageShare, "AP")}
            </DamageText>
          </DamageTypeFrame>
        )}
        {adDamageShare && (
          <DamageTypeFrame type={"ad"} width={adDamageShare}>
            <DamageBar dmgtype={"ad"} />
            <DamageText dmgtype={"ad"}>
              {getTextPercentage(adDamageShare, "AD")}
            </DamageText>
          </DamageTypeFrame>
        )}
        {trueDamageShare && (
          <DamageTypeFrame type={"tr"} width={trueDamageShare}>
            <DamageBar dmgtype={"tr"} />
            <DamageText dmgtype={"tr"}>
              {getTextPercentage(trueDamageShare, "True")}
            </DamageText>
          </DamageTypeFrame>
        )}
        <EmptyBarFrame>
          <EmptyBar />
        </EmptyBarFrame>
      </DamageFrame>
    </div>
  );
};

export default memo(DamageBreakdown);
