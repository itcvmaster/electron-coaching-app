import React from "react";
import { styled } from "goober";

import { mobile, mobileSmall } from "clutch";

const Container = styled("div")`
  display: flex;
  padding: 0 var(--sp-4);

  .info-tag {
    width: 0.63rem;
    margin-left: 4px;
  }

  .profile_match-image {
    margin-right: var(--sp-1);
    width: var(--sp-14);
    height: var(--sp-14);
    background-position: center;
    background-repeat: no-repeat;
    border-radius: var(--sp-1_5);

    @media screen and (max-width: 650px) {
      margin: 0;
    }
  }

  .profile_match-icon {
    box-sizing: border-box;
    position: absolute;
    display: flex;
    right: calc(var(--sp-3) * -1);
    top: var(--sp-3);
    align-items: center;
    justify-content: center;
    width: var(--sp-6);
    height: var(--sp-6);
    max-width: 100%;
    padding: 3px;
    background-color: var(--shade8);
    border-radius: var(--br-sm);

    svg {
      display: flex;
      height: auto;
    }
  }

  .gap-dot {
    height: var(--sp-1);
    width: var(--sp-1);
    margin: 0 var(--sp-2);
    background: var(--shade3);
    border-radius: 50%;
  }

  .profile_match-stats {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    padding: 0 0 0 var(--sp-5);

    .role-icon {
      display: block;
      width: 1em;
      height: 1em;
      stroke-width: 0;
      stroke: var(--shade2);
      fill: var(--shade2);
    }

    .type-subtitle2 {
      font-weight: 700;
      font-size: var(--sp-3_5);
      line-height: var(--sp-6);
    }

    .type-form--button {
      font-weight: 600;
      font-size: var(--sp-3_5);
      line-height: var(--sp-5);
      letter-spacing: -0.009em;
    }

    ${mobile} {
      flex-wrap: wrap;

      .match-title-wrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: var(--sp-2);
      }
    }

    @media screen and (max-width: 410px) {
      .match-title-wrapper {
        padding-bottom: var(--sp-4);
      }
    }

    ${mobileSmall} {
      padding-right: var(--sp-2);
    }
  }

  .match-sub-stat {
    color: var(--shade2);
    text-transform: capitalize;
  }

  .time-ago {
    color: var(--shade2);
  }

  .tooltip-text {
    padding: 0.25rem;
    font-weight: 500;
    font-size: var(--sp-3);
  }

  .match-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    @media screen and (max-width: 650px) {
      margin-bottom: var(--sp-1);
    }
  }

  .match-1 {
    flex: 1;
  }
  .match-2 {
    flex: 1.5;
  }

  .match-kda {
    min-width: calc(var(--sp-px) * 108);
  }
`;

export const ProfileMatch = ({ image, children }) => {
  const imageStyle = {
    backgroundImage: `url(${image})`,
    backgroundSize: "100%",
  };

  return (
    <Container>
      <img
        className="profile_match-image"
        src={image || ""}
        style={imageStyle}
      />
      <div className="profile_match-stats">{children}</div>
    </Container>
  );
};
