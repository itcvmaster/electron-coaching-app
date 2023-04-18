import React from "react";
import { styled } from "goober";

import { HD, mobile, tablet } from "clutch";

import { Headline, SmallSubtitle } from "@/feature-china-web/common-styles.mjs";

export const TextWrapper = styled("div")`
  padding: ${({ left }) => (left ? "80px 80px 80px 17%" : "80px 0")};
  box-sizing: border-box;
  background-color: ${({ $bgColor }) => ($bgColor ? $bgColor : "transparent")};

  .block {
    &__container {
      max-width: 504px;
      color: var(--white);

      ${HD} {
        max-width: 730px;
      }

      ${tablet} {
        max-width: 400px;
      }

      ${mobile} {
        max-width: unset;
      }
    }

    &__title {
      padding-bottom: var(--sp-6);

      ${mobile} {
        padding-bottom: var(--sp-2);
      }
    }
  }

  ${HD} {
    padding: 120px;
  }

  ${tablet} {
    padding: 70px 50px;
  }

  ${mobile} {
    padding: var(--sp-6);
  }
`;

const TextBlock = (props) => {
  const { title, text, bgColor, left } = props;

  return (
    <TextWrapper $bgColor={bgColor} left={left}>
      <div className="block__container">
        <SmallSubtitle className="block__title">{title}</SmallSubtitle>
        <Headline className="block__text">{text}</Headline>
      </div>
    </TextWrapper>
  );
};

export default TextBlock;
