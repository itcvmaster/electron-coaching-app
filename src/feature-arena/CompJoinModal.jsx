import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { Button } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import { GAME_SHORT_NAMES } from "@/app/constants.mjs";
import { hideModal, subscribe } from "@/feature-arena/m-actions.mjs";
import { useGameAccount } from "@/feature-arena/m-hooks.mjs";
import { joinEvent } from "@/feature-arena/m-join-event.mjs";
import Close from "@/inline-assets/close.svg";
import Square from "@/inline-assets/Square.svg";
import SquareCheck from "@/inline-assets/SquareCheck.svg";

const CompJoinModal = ({ title, eventId, gameSymbol }) => {
  const { t } = useTranslation();
  const state = useSnapshot(readState);
  const subscribed = state.settings.optedInToArenaMarketingEmails;

  const [agreeTerm, setAgreeTerm] = useState(false);
  const [receiveEmail, setReceiveEmail] = useState(false);
  const gameUrl = `/${GAME_SHORT_NAMES[gameSymbol]}`;
  const gameAccount = useGameAccount(gameSymbol);

  const onAccept = () => {
    hideModal();
    if (gameAccount) {
      // Missing user feedback! This should do something after joining...
      joinEvent(eventId, gameSymbol, gameAccount.id);
      if (receiveEmail) subscribe(true);
    }
  };

  return (
    <Container>
      <Header>
        <Title>{title}</Title>
        <CloseButton onClick={hideModal}>
          <Close />
        </CloseButton>
      </Header>
      <Content>
        <OptionContainer>
          <Option>
            <CheckBox onClick={() => setAgreeTerm(!agreeTerm)}>
              {agreeTerm ? (
                <SquareCheck color={"var(--shade1)"} />
              ) : (
                <Square color={"var(--shade1)"} />
              )}
            </CheckBox>
            <Trans i18nKey="arena:alert.agreeTerm">
              <OptionText className="type-caption">
                I agree to the &nbsp;
                <LinkText
                  href={`${gameUrl}/arena/${eventId}/faq`}
                  onClick={hideModal}
                >
                  Terms & Conditions
                </LinkText>
                &nbsp;*
              </OptionText>
            </Trans>
          </Option>
          {!subscribed && (
            <Option onClick={() => setReceiveEmail(!receiveEmail)}>
              {receiveEmail ? (
                <SquareCheck color={"var(--shade1)"} />
              ) : (
                <Square color={"var(--shade1)"} />
              )}
              <OptionText className="type-caption">
                {t(
                  "arena:alert.receiveEmail",
                  "I’d like to receive marketing emails"
                )}
              </OptionText>
            </Option>
          )}
        </OptionContainer>

        <Button
          disabled={!agreeTerm}
          text={t("arena:accept", "Accept")}
          bgColor={agreeTerm ? "var(--primary)" : "var(--shade6)"}
          onClick={onAccept}
        />
        <Description>
          <Trans i18nKey="arena:alert.eligibility">
            <Bold>Please note:</Bold>
            You are only eligible to participate in this Challenge on one
            Summoner. Any additional accounts will be unable to join.
          </Trans>
        </Description>
      </Content>
    </Container>
  );
};

export default CompJoinModal;

const OptionContainer = styled("div")`
  margin-bottom: var(--sp-2);
`;

const Option = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: var(--sp-4);
`;

const OptionText = styled("div")`
  color: var(--shade1);
  margin-left: var(--sp-3_5);
`;

const Description = styled("div")`
  font-style: italic;
  font-weight: 500;
  font-size: 11px;
  line-height: var(--sp-5);
  letter-spacing: -0.009em;
  color: var(--shade1);
  margin-top: var(--sp-6);
`;
const Bold = styled("span")`
  font-weight: 700;
`;

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  width: 420px;
  border-radius: var(--sp-2);
  overflow: hidden;
`;

const Header = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: var(--sp-4) var(--sp-6);
  background: var(--shade7);
  box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.05);
`;

const Title = styled("div")`
  font-family: Inter;
  font-style: normal;
  font-weight: 700;
  font-size: var(--sp-3_5);
  line-height: var(--sp-6);
  display: flex;
  align-items: center;
  color: var(--shade1);
`;

const CloseButton = styled("div")`
  width: var(--sp-6);
  height: var(--sp-6);
  background: var(--shade6);
  box-shadow: 0px 1px 4px rgba(7, 8, 12, 0.25),
    inset 0px 1px 0px rgba(227, 229, 234, 0.05);
  border-radius: var(--sp-3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Content = styled("div")`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: var(--sp-6);
  background: var(--shade7);
  box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.05);
  margin-top: 1px;
`;

const LinkText = styled("a")`
  color: var(--primary);
  text-decoration: underline;
  text-decoration-style: dotted;
  cursor: pointer;
`;

const CheckBox = styled("div")`
  cursor: pointer;
`;
