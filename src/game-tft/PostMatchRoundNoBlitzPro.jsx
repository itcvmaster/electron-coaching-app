import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { styled } from "goober";

import { appURLs } from "@/app/constants.mjs";
import useMatch from "@/game-tft/use-match.mjs";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import { MatchLoading } from "@/shared/Match.jsx";
import { TimeAgo } from "@/shared/Time.jsx";

export default function PostMatchRoundNoBlitzPro() {
  const { t } = useTranslation();
  return (
    <Content>
      <section
        style={{ display: "flex", gap: "24px", flexDirection: "column" }}
      >
        <h1>{t("common:sorryExclamationPoint", "Sorry!")}</h1>
        <Article
          remaining={t("common:twentyFourHours", "24 hours")}
          date={Date.now() - 1000 * 60 * 60 * 24}
        />
        <Button />
      </section>
      <section>
        <img
          src={`${appURLs.CDN_WEB}/tftnoblitzpro.png`}
          alt={t("common:noData", "No data")}
        />
      </section>
    </Content>
  );
}

function PostMatchRoundNoBlitzProMini() {
  const currentMatch = useMatch();
  if (!currentMatch) return <MatchLoading />;
  if (currentMatch instanceof Error) return <ErrorComponent />;
  return (
    <Mini id="RoundBreakdown_SubscribeToPro">
      <Article date={new Date(currentMatch.data.createdAt || Date.now())} />
      <Button />
    </Mini>
  );
}

function Article({ date, remaining }) {
  return (
    <article>
      <Para>
        <Trans i18nKey="tft:para.keepDataForXTime">
          We&apos;re only able to keep this data for{" "}
          <span>{remaining ? remaining : <TimeAgo date={date} />}</span>.
        </Trans>
      </Para>
      <Para className="subscribe">
        <Trans i18nKey="tft:para.subscribeUnlimited">
          Get <span>Blitz PRO</span> for unlimited access.
        </Trans>
      </Para>
    </article>
  );
}

function Button() {
  const { t } = useTranslation();
  const handleNavigate = () => {
    return "/pro/subscription/landing-page"; // Todo: Navigate to this urls
  };
  return (
    <ButtonStyled onClick={handleNavigate}>
      {t("common:subscribeToBlitzPro", "Subscribe to Blitz Pro")}
    </ButtonStyled>
  );
}

function PostMatchNotification() {
  const currentMatch = useMatch();
  if (!currentMatch) return <MatchLoading />;
  if (currentMatch instanceof Error) return <ErrorComponent />;
  return (
    <a href="#">
      <BlitzProNotification>
        <Trans i18nKey="tft:postmatchInsights.availableForTimeLeft">
          Available for{" "}
          <TimeAgo date={new Date(currentMatch.data.createdAt || Date.now())} />
        </Trans>
      </BlitzProNotification>
    </a>
  );
}

export const refs = {
  PostMatchRoundNoBlitzProMini,
  PostMatchNotification,
};

const Mini = styled("div")`
  border-radius: 6px;
  background-color: var(--shade7);
  padding: 18px 34px;
  color: #fff;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  a {
    align-self: center;
  }
`;
const Content = styled("div")`
  background-color: var(--shade7);
  border-radius: 12px;
  display: flex;
  gap: 24px;
  align-items: center;
  padding-top: var(--sp-12);
  padding-right: var(--sp-6);
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  color: #fff;
  section:first-child {
    padding: 0 var(--sp-10);
    display: flex;
    justify-content: center;
    height: 100%;
  }
  section:last-child {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    img {
      width: 522px;
    }
  }
  h1 {
    font-size: 32px;
    font-style: normal;
    font-weight: bold;
    text-transform: uppercase;
  }
  a {
    align-self: flex-start;
  }
`;
const Para = styled("p")`
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  line-height: 28px;
  &.subscribe {
    font-size: 16px;
    line-height: 32px;
  }
  &:first-child span {
    color: var(--red);
  }
  &:last-child span {
    color: var(--yellow);
  }
`;
const ButtonStyled = styled("button")`
  background: linear-gradient(60.48deg, #92713c 0%, #dbb063 100%);
  box-shadow: 0 0 4px rgba(7, 8, 12, 0.25),
    inset 0 1px 0 rgba(227, 229, 234, 0.25);
  border-radius: 5px;
  font-weight: 600;
  font-size: 14px;
  padding: 12px 42px;
  align-self: center;
`;
const BlitzProNotification = styled("div")`
  background: linear-gradient(60.48deg, #92713c 0%, #dbb063 100%);
  box-shadow: 0 0 4px rgba(7, 8, 12, 0.25),
    inset 0 1px 0 rgba(227, 229, 234, 0.25);
  border-radius: 5px;
  padding: 6px 10px;
  color: var(--shade0);
  font-size: 13px;
`;
