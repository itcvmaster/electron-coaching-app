import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { appURLs } from "@/app/constants.mjs";
import BlitzLogoIcon from "@/inline-assets/blitz-logo.svg";
import ChevronRightIcon from "@/inline-assets/chevron-right.svg";
import { useRoute } from "@/util/router-hooks.mjs";

export default function PostMatchProNoData() {
  const { t } = useTranslation();

  const {
    parameters: [region, name, matchId],
  } = useRoute();
  const items = [
    {
      icon: BlitzLogoIcon,
      color: "var(--primary)",
      title: t("common:openBlitz", "Open Blitz"),
    },
    {
      icon: () => null, // Todo: Import TFT SVG icon
      color: "var(--yellow)",
      title: t("tft:playTFTWithBlitzOpen", "Play TFT with Blitz Open"),
    },
    {
      icon: function BarGraphIcon() {
        return (
          <img
            src={`${appURLs.CDN_WEB}/TFTPostmatchPlaceholderBarGraph.svg`}
            alt={t("common:navigation.overview", "Overview")}
          />
        );
      },
      title: t("common:seeAdvancedStats", "See Advanced Stats"),
    },
  ];

  return (
    <Container>
      <Items>
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={idx}>
              <CircleCard>
                <NumericCard>{idx + 1}</NumericCard>
                <Icon />
                <p>{item.title}</p>
              </CircleCard>
              {idx !== items.length - 1 ? <ChevronRightIcon /> : null}
            </React.Fragment>
          );
        })}
      </Items>
      <Content>
        <section>
          <div>
            <BlitzLogoIcon />
          </div>
          <h1>
            {t(
              "tft:postmatchInsights.advancedStats",
              "Advanced TFT Statistics"
            )}
          </h1>
          <p>
            {t(
              "tft:postmatchInsights.advancedStatisticsOverlays",
              "Play TFT with Blitz for advanced TFT statistics and overlays!"
            )}
          </p>
          <div>
            <a href={`/tft/match/${region}/${name}/${matchId}/scoreboard`}>
              {t("common:seeScoreboard", "See Scoreboard")}
            </a>
          </div>
        </section>
        <section>
          <img
            src={`${appURLs.CDN_WEB}/tftnopostmatch.png`}
            alt={t("common:noData", "No data")}
          />
        </section>
      </Content>
    </Container>
  );
}

// Styles
const Container = styled("div")`
  font-family: "Inter", Arial, Helvetica, sans-serif;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: var(--sp-12);
  padding-top: var(--sp-12);
  box-sizing: border-box;
  width: 100%;
`;

const Items = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 42px;
  box-sizing: border-box;
  width: 100%;
  & > svg {
    font-size: 45px;
    color: var(--shade5);
  }
`;

const CircleCard = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: var(--sp-2);
  background-color: var(--shade7);
  color: var(--shade0);
  border-radius: 100%;
  flex-shrink: 0;
  width: 180px;
  height: 180px;
  text-align: center;
  gap: 6px;
  position: relative;
  & > p {
    font-size: 12px;
    padding: 0;
    margin: 0;
    line-height: 12px;
  }
  & > svg,
  & > img {
    width: 40px;
    height: 40px;
  }
`;

const NumericCard = styled("div")`
  position: absolute;
  top: -18px;
  left: calc(50% - 18px);
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 100%;
  background-color: var(--shade5);
  font-size: 16px;
  line-height: 16px;
  color: var(--shade0);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled("div")`
  background-color: var(--shade6);
  border-radius: 12px;
  display: flex;
  gap: 24px;
  align-items: flex-end;
  padding-top: var(--sp-12);
  padding-right: var(--sp-6);
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  h1 {
    font-size: 70px;
    line-height: 70px;
    text-transform: uppercase;
    color: var(--shade0);
    padding: 0;
    margin: 0;
    font-family: "Druk Condensed", serif;
  }
  p {
    font-size: 17px;
    line-height: 26px;
    color: var(--shade2);
  }
  button {
    background-color: #e03f54;
    padding: 6px 12px;
    border-radius: 5px;
    font-weight: 600;
    font-size: 14px;
    color: var(--shade0);
    text-shadow: 0 1px 0 rgba(54, 0, 0, 0.25);
    letter-spacing: -0.009em;
  }
  section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  section:first-child {
    padding: var(--sp-10);
  }
  section:last-child {
    img {
      width: 522px;
    }
  }
  div:first-child {
    align-self: flex-start;
    box-shadow: 0 1.88148px 14.1111px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding: 12px;
    background-color: var(--shade7);
    svg {
      width: 60px;
      height: 16px;
      font-size: 80px;
      line-height: 60px;
    }
  }
`;
