import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { Button } from "clutch";

import { ArrowIcons } from "@/feature-arena/m-assets.mjs";

const EmptySection = ({
  type, //NoEvents, NoPastEvents, NotLoggedIn
}) => {
  const { t } = useTranslation();

  const EmptySectionInfo = {
    NoEvents: {
      title: t(
        "arena:empty.noEvents.title",
        "You're not signed up for any events :'("
      ),
      description: t(
        "arena:empty.noEvents.description",
        `Click "discover" to register for events and join the fun!`
      ),
      buttons: [
        {
          title: t("arena:empty.noEvents.button", "Discover Events"),
          icon: <ArrowIcons.RIGHT_WITH_DASH className="arrow" />,
          href: "/arena/discover",
        },
      ],
    },
    NoPastEvents: {
      description: t(
        "arena:empty.NoPastEvents.description",
        "You haven’t completed any events yet."
      ),
    },
    NotLoggedIn: {
      title: t(
        "arena:empty.NotLoggedIn.title",
        "You must be logged in to view this."
      ),
      description: t(
        "arena:empty.NotLoggedIn.description",
        `In order for us to track your joined events, you must log into your Blitz account. If you do not have an account and would like to create one click “Create Account” below.`
      ),
      buttons: [
        {
          title: t("arena:empty.NotLoggedIn.login", "Login"),
          href: "/account",
        },
        {
          title: t("arena:empty.NotLoggedIn.signup", "Create Account"),
          href: "/account",
        },
      ],
    },
  };

  const item = EmptySectionInfo[type];

  return (
    <Container>
      {item?.title !== undefined ? (
        <Title className="type-h5">{item?.title}</Title>
      ) : null}
      <Description className="type-body1">{item?.description}</Description>
      {item?.buttons?.map((button, index) => (
        <Button
          key={index}
          text={button.title}
          href={button.href}
          iconRight={button.icon}
          bgColor={"var(--primary)"}
          textColor={"white"}
          className="button"
        />
      ))}
    </Container>
  );
};

export default EmptySection;

const Container = styled("div")`
  width: 100%;
  background-color: var(--shade7);
  padding: var(--sp-12);
  margin-top: var(--sp-7);
  border-radius: var(--br);
  .arrow {
    width: 13px;
    height: 13px;
  }
  .button {
    margin-top: var(--sp-10);
    margin-right: var(--sp-2_5);
  }
`;

const Title = styled("div")`
  color: var(--shade0);
  margin-bottom: var(--sp-10);
`;

const Description = styled("div")`
  color: var(--shade2);
`;
