import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { Button } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import { RewardItem, ScoringItem } from "@/feature-arena/CompEventItems.jsx";
import { Board, Spring } from "@/feature-arena/CompGeneral.jsx";
import { getFullAssetsUrl } from "@/feature-arena/m-constants.mjs";
import { extractTopRewards } from "@/feature-arena/m-utils.mjs";
import { useRoute } from "@/util/router-hooks.mjs";

const Block = ({ title, data, renderItem, link, visible }) => {
  const { t } = useTranslation();
  if (!visible) return null;
  return (
    <>
      <BlockHeader>
        <LightText className="type-subtitle1">{title}</LightText>
        <Spring />
        <SmallButton className="type-form--button" href={link}>
          {t("common:seeAll", "See All")}
        </SmallButton>
      </BlockHeader>
      <BlockContent>
        <Body>{data?.map((item, index) => renderItem(item, index))}</Body>
        <GradientCover />
      </BlockContent>
    </>
  );
};

const EventExtraPanel = () => {
  const {
    parameters: [id, tab],
    currentPath,
  } = useRoute();
  const { t } = useTranslation();
  const state = useSnapshot(readState);
  const { eventDetails } = state.arena;
  const event = eventDetails?.[id];
  const TOP_RANK = 10;
  const isValid =
    Boolean(event?.nativeAdUnit) &&
    Object.values(event.nativeAdUnit).indexOf(null) < 0;

  return (
    <Container>
      <Block
        title={t("arena:rewards", "Rewards")}
        data={extractTopRewards(event?.rewards, TOP_RANK)}
        renderItem={(item, index) => <RewardItem small key={index} {...item} />}
        link={currentPath.replace(`/${tab}`, "/rewards")}
        visible={
          ["overview", "scoring", "faq"].indexOf(tab) >= 0 &&
          event?.rewards?.length !== 0
        }
      />
      <Block
        title={t("arena:scoring", "Scoring")}
        data={event?.missions || []}
        renderItem={(item, index) => (
          <ScoringItem small key={index} {...item} />
        )}
        link={currentPath.replace(`/${tab}`, "/scoring")}
        visible={
          ["overview", "rewards", "faq"].indexOf(tab) >= 0 &&
          event?.missions?.length !== 0
        }
      />
      {isValid && (
        <AdContainer>
          <AdImage src={getFullAssetsUrl(event?.nativeAdUnit?.adImg)} />
          <AdContent>
            <LightText className="type-body2">
              {event?.nativeAdUnit?.adText}
            </LightText>
            <Partner>
              <Logo src={getFullAssetsUrl(event?.nativeAdUnit?.logoImg)}></Logo>
              <DarkText className="type-caption">
                {event?.nativeAdUnit?.brandName || ""}
              </DarkText>
            </Partner>
            <Button
              href={event?.nativeAdUnit?.callToActionUrl}
              text={t("common:learnMore", "Learn More")}
            />
          </AdContent>
        </AdContainer>
      )}
    </Container>
  );
};

export default EventExtraPanel;

const Container = styled("div")`
  width: 328px;
  margin: var(--sp-7) var(--sp-4) var(--sp-7) 0;
  display: flex;
  flex-direction: column;
`;

const SmallButton = styled("a")`
  background-color: var(--shade6);
  padding: var(--sp-1_5) var(--sp-3);
  border-radius: var(--br);
  box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.05);
  cursor: pointer;
  color: var(--shade1);
`;

const AdContainer = styled("div")`
  width: 100%;
  overflow: hidden;
  background: var(--shade7);
  box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.05);
  border-radius: var(--br);
`;

const AdImage = styled("img")`
  width: 100%;
  height: 224px;
  object-fit: cover;
  border-radius: var(--br);
`;

const AdContent = styled("div")`
  padding: var(--sp-6);
`;

const Partner = styled("div")`
  display: flex;
  align-items: center;
  margin: var(--sp-2) 0 var(--sp-4) 0;
`;

const Logo = styled("img")`
  width: var(--sp-5);
  height: var(--sp-5);
  border-radius: var(--br);
`;

const GradientCover = styled("div")`
  position: absolute;
  left: 0;
  right: var(--sp-2);
  bottom: 0;
  height: calc(var(--sp-20) + var(--sp-0_5));
  background: linear-gradient(
    180deg,
    rgba(24, 27, 33, 0) 0%,
    var(--shade7) 100%
  );
  box-sizing: border-box;
  border-radius: var(--br);
`;

const BlockContent = styled("div")`
  background: var(--shade7);
  box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.05);
  border-radius: 0 0 var(--br) var(--br);
  position: relative;
  margin-bottom: var(--sp-4);
`;

const Body = styled("div")`
  overflow: auto;
  padding: var(--sp-6);
  height: 200px;
`;

const BlockHeader = styled(Board)`
  border-radius: var(--br) var(--br) 0 0;
  padding: var(--sp-4_5) var(--sp-6);
  margin-bottom: var(--sp-0_5);
`;

const LightText = styled("div")`
  color: var(--shade0);
`;

const DarkText = styled("div")`
  color: var(--shade1);
  margin-left: var(--sp-2);
`;
