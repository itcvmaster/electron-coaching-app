import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { styled } from "goober";

import { appURLs } from "@/app/constants.mjs";
import BlitzLogo from "@/inline-assets/blitz-logo-bolt.svg";
import Step1 from "@/inline-assets/Step_lol-1.png";
import Step2 from "@/inline-assets/Step_lol-2.png";
import Step3 from "@/inline-assets/Step_lol-3.png";

const Container = styled("div")`
  max-width: var(--sp-container);
  margin: var(--sp-6) auto;
  display: flex;
  align-items: stretch;
  min-height: 680px;
`;

const Aside = styled("div")`
  flex: 2;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Content = styled("div")`
  padding: var(--sp-10) var(--sp-6);
  background: var(--shade7);
  border-radius: var(--br-lg);

  .wrapper {
    margin: 0 auto var(--sp-8);
    background: var(--primary);
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
  }
  svg {
    display: block;
    margin: auto;
    width: 2rem;
    height: 3rem;
  }
  p {
    margin-bottom: 1rem;
    color: var(--shade1);
    &:first-of-type,
    b {
      color: var(--shade0);
    }
  }
`;

const OnboardingBgWaves = styled("div")`
  background-image: url("${appURLs.CDN}/blitz/guest-account/Waves3.png");
  background-repeat: no-repeat;
  background-position: top right -250px;
  opacity: 0.2;
  height: 60%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;

const StepDescription = styled("div")`
  color: var(--shade1);
`;

const StepImg = styled("div")`
  display: flex;
  justify-content: center;
  width: 270px;
  padding-left: 40px;

  .lol_img1 {
    margin-left: -1.875rem;
  }

  .lol_img2 {
    margin-left: var(--sp-2_5);
  }
`;

const StepRightSide = styled("div")`
  display: flex;
  flex-direction: column;
  padding-left: var(--sp-5);

  &.lol_step1 {
    margin-top: calc(var(--sp-5) * -1);
  }

  &.lol_step2 {
    margin-top: calc(var(--sp-9) * -1);
  }

  &.lol_step3 {
    margin-top: -15px;
  }
`;

const StepTitle = styled("div")`
  color: var(--shade3);
  margin-bottom: 4px;
  text-align: left;
`;

const StepSubtitle = styled("div")`
  max-width: 244px;
  text-align: left;
`;

const Boxes = styled("div")`
  flex: 3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  box-sizing: border-box;
  padding-left: var(--sp-8);
  z-index: 1;

  > div {
    flex: 1;
    display: flex;
    align-items: center;
  }
`;

const Bold = styled("strong")`
  &.color-white {
    color: var(--shade0);
  }

  &.color-blue {
    color: var(--blue);
  }

  &.color-red {
    color: var(--red);
  }
`;

function DashboardLoL() {
  const { t } = useTranslation();

  const steps = [
    {
      title: t("lol:onboarding.stepOne", "Step 1"),
      description: (
        <StepDescription>
          <Trans i18nKey="lol:onboarding.stepOneDescription">
            <Bold className="color-white">Auto Import</Bold> your Runes and
            Summoners
          </Trans>
        </StepDescription>
      ),
      image: Step1,
    },
    {
      title: t("lol:onboarding.stepTwo", "Step 2"),
      description: (
        <StepDescription>
          <Trans i18nKey="lol:onboarding.stepTwoDescription">
            Keep track of your last hits in game with the{" "}
            <Bold className="color-white">CS Tracker Overlay</Bold>
          </Trans>
        </StepDescription>
      ),
      image: Step2,
    },
    {
      title: t("lol:onboarding.stepThree", "Step 3"),
      description: (
        <StepDescription>
          <Trans i18nKey="lol:onboarding.stepThreeDescription">
            See what you did <Bold className="color-blue">Good</Bold> and{" "}
            <Bold className="color-red">Bad</Bold> after each game in Post Match
          </Trans>
        </StepDescription>
      ),
      image: Step3,
    },
  ];

  /* eslint-disable i18next/no-literal-string */
  return (
    <>
      <OnboardingBgWaves />
      <Container>
        <Aside>
          <Content className="type-body2">
            <div className="wrapper">
              <BlitzLogo />
            </div>
            <p>Hi, thanks for trying this special test build of Blitz.</p>
            <p>
              This build contains our League of Legends app only. Login to LoL
              and you should see your profile right away.
            </p>
            <p>
              A few things have been disabled (accounts, ads), but the main use
              cases of <b>LoL profile</b>, <b>champion select</b>,{" "}
              <b>live game</b>, and <b>post-match</b> have been dramatically
              improved in terms of performance and reliability.
            </p>
            <p>
              <br />
              &mdash; Blitz.gg staff
            </p>{" "}
          </Content>
        </Aside>
        <Boxes>
          {(steps || []).map((step, index) => {
            return (
              <div key={index}>
                <StepImg>
                  <img src={step.image} className={`lol_img${index + 1}`} />
                </StepImg>

                <StepRightSide className={`lol_step${index + 1}`}>
                  <StepTitle>{step.title + ":"}</StepTitle>
                  <StepSubtitle>{step.description}</StepSubtitle>
                </StepRightSide>
              </div>
            );
          })}
        </Boxes>
      </Container>
    </>
  );
  /* eslint-enable i18next/no-literal-string */
}

export default DashboardLoL;
