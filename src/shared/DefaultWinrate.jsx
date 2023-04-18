import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { winRatecolorRange } from "@/app/util.mjs";
import RadialProgress from "@/shared/RadialProgress.jsx";
import { getLocaleRate } from "@/util/i18n-helper.mjs";

const Caption = styled("p")`
  font-weight: 500;
  font-size: var(--sp-3);
  line-height: var(--sp-5);
  letter-spacing: -0.009em;
`;

const CaptionBold = styled("p")`
  font-weight: bold;
  font-size: var(--sp-3);
  line-height: var(--sp-5);
  letter-spacing: -0.009em;
`;

const DefaultWinrate = ({ wins, games }) => {
  const { t } = useTranslation();

  const winRate = getLocaleRate(wins, games);

  const winRateColor =
    games !== 0 && winRatecolorRange((wins / (games || 1)) * 100);

  return (
    <Container>
      <RadialProgress
        size={108}
        background={"var(--shade6)"}
        data={[wins / games]}
        colors={[winRateColor]}
        strokeWidth={4}
      />
      <Center>
        <Caption>{t("common:stats.wr", "Winrate")}</Caption>
        <CaptionBold style={{ color: winRateColor }}>
          {t("common:percent", "{{percent, percent}}", {
            percent: winRate,
          })}
        </CaptionBold>
      </Center>
    </Container>
  );
};
export default memo(DefaultWinrate);

const Container = styled("div")`
  position: relative;
`;
const Center = styled("div")`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;
