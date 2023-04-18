import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { FaqItem } from "@/feature-arena/CompEventItems.jsx";
import EventExtraPanel from "@/feature-arena/CompExtraPanel.jsx";
import { Container } from "@/feature-arena/CompGeneral.jsx";

const faqs = [
  {
    title: [
      "events:grubhub.faq.whoCanParticipate",
      "Who can participate in the Challenge?",
    ],

    content: [
      "events:grubhub.faq.whoCanParticipateContent",
      "Anyone! This event is global.",
    ],
  },
  {
    title: ["events:grubhub.faq.howToEarnPoints", "How do I earn points?"],
    content: [
      "events:grubhub.faq.howToEarnPointsContent",
      "Once you register for the event, go to the in-app Objectives page, where you’ll see a list of in-game objectives you can complete to earn points. For example, kills will earn you points, assists will earn you points, etc. As you play matches and complete objectives, you’ll earn points and move up the leaderboard. The user with the most points will be in 1st place. Play as many games as you can during the event to earn as many points as you can. When the event ends, players will receive prizes based on their placement on the leaderboard.",
    ],
  },
  {
    title: [
      "events:grubhub.faq.whatGameModes",
      "What game modes can I play to earn points?",
    ],
    content: [
      "events:grubhub.faq.whatGameModesContent",
      "ARAM Challenge participants can only earn points by playing League of Legends ARAM matches.",
    ],
  },
  {
    title: ["events:grubhub.faq.prizes", "What prizes can I win?"],
    content: [
      "events:grubhub.faq.whatGameModesContent",
      "The top 40 players on the leaderboard at the end of the event will receive RP. Prizes amounts for various placements are as follows:",
    ],
  },
  {
    title: [
      "events:grubhub.faq.howDoesBlitzKnow",
      "How does Blitz know when I’ve earned points?",
    ],
    content: [
      "events:grubhub.faq.howDoesBlitzKnowContent",
      `Through the League of Legends API, Blitz tracks your in-game performance and automatically registers when you’ve completed a point-earning objective. All you have to do is make sure you have the Blitz App open while you’re playing. If Blitz is not open, your in-game actions will not be recorded and can’t be added retroactively.`,
    ],
  },
  {
    title: [
      "events:grubhub.faq.claimPrize",
      "How do I claim my prize if I win one?",
    ],
    content: [
      "events:grubhub.faq.claimPrizeContent",
      "We will send out all prizes via email after the event has ended.",
    ],
  },
  {
    title: [
      "events:grubhub.faq.canIEarnPoints",
      "Can I still earn points if I played a game without Blitz open?",
    ],
    content: [
      "events:grubhub.faq.canIEarnPointsContent",
      `No. Points will only be awarded when the Blitz App is open while you play.`,
    ],
  },
  {
    title: [
      "events:grubhub.faq.multipleAccounts",
      "Can I participate on multiple accounts?",
    ],
    content: [
      "events:grubhub.faq.multipleAccountsContent",
      "No. You may only participate on one Blitz account with one connected League of Legends summoner name. The app will detect if you attempt to participate on multiple accounts. Users who try to cheat the system are subject to having their prizes withheld.",
    ],
  },
  {
    title: ["events:grubhub.faq.smurf", "Can I play on a smurf?"],
    content: [
      "events:grubhub.faq.smurfContent",
      "No. Smurfing, i.e. playing on an alternate account of a lower rank than your main account, is against the rules and is not permitted. Users who try to cheat the system are subject to having their prizes withheld.",
    ],
  },
];

const ArenaEventFaq = () => {
  const { t } = useTranslation();

  return (
    <Container $row>
      <EventExtraPanel />
      <MainPanel>
        <Header>
          <SubTitle className="type-subtitle1">
            {t("arena:event.faq", "Faq and Rules")}
          </SubTitle>
        </Header>
        {faqs.map(({ title, content }, index) => (
          <FaqItem key={index} title={t(...title)} content={t(...content)} />
        ))}
      </MainPanel>
    </Container>
  );
};

export default ArenaEventFaq;

const MainPanel = styled("div")`
  width: 672px;
  margin: var(--sp-7) 0;
  display: flex;
  flex-direction: column;
  > div:last-child {
    border-radius: 0 0 var(--br) var(--br);
  }
`;

const SubTitle = styled("div")`
  color: var(--shade0);
`;

const Header = styled("div")`
  background: var(--shade7);
  box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.05);
  border-radius: var(--br) var(--br) 0 0;
  padding: var(--sp-4_5) var(--sp-6);
  margin-bottom: var(--sp-0_5);
`;
