import { css, keyframes, styled } from "goober";
import { createGlobalStyles } from "goober/global";

import { HD, mobile, mobileSmall, tablet } from "clutch";

export const ButtonLabel = styled("div")`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.1;
`;

export const DropdownLabel = styled("span")`
  font-size: var(--sp-4);
  font-weight: 500;
  line-height: 1.1;
`;

export const Root = styled("div")`
  height: max-content;
  width: 100%;

  //isolated reset
  ol,
  ul {
    list-style: none;
    padding: 0;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  button,
  ol,
  ul {
    margin-block-start: 0;
    margin-block-end: 0;
    margin-inline-start: 0;
    margin-inline-end: 0;
  }

  h1 {
    font-size: var(--sp-15);
  }

  ${HD} {
    h1 {
      font-size: 80px;
    }
  }
  ${tablet} {
    h1 {
      font-size: var(--sp-12);
    }
  }
  ${mobile} {
    h1 {
      font-size: var(--sp-7);
    }
  }
`;

export const View = styled("div")`
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: ${({ $imgSrc }) =>
    $imgSrc ? `url(${$imgSrc}) no-repeat top/cover` : "none"};
`;

export const Container = styled("div")`
  position: relative;
  width: 83%;
  max-width: 1920px;
  margin: 0 auto;

  &.narrow {
    max-width: var(--sp-container);
  }

  ${tablet} {
    width: 87%;
  }

  ${mobile} {
    width: 90%;
  }
`;
export const AuthContainer = styled("div")`
  position: relative;
  width: ${({ $isSettings }) => ($isSettings ? 100 : 85)}%;
  height: ${({ $isSettings }) => ($isSettings ? "auto" : "100vh")};
  max-width: 1920px;
  margin: 0 auto;

  ${tablet} {
    width: ${(props) => (props.isPro ? 100 : 87)}%;
  }

  ${mobile} {
    width: 90%;
  }

  ol,
  ul {
    list-style: none;
    padding: 0;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  button,
  ol,
  ul {
    margin-block-start: 0;
    margin-block-end: 0;
    margin-inline-start: 0;
    margin-inline-end: 0;
  }
`;
export const LottieBgContainer = styled("div")`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 640px;
  pointer-events: none;
`;

export const ProLogoWrap = styled("div")`
  display: inline-flex;
  box-sizing: border-box;
  width: 70px;
  height: 1.875rem;
  border-radius: var(--br);
  padding: 5px 10px 5px 8px;

  img {
    width: 100%;
    height: 100%;
  }
`;

export const SoonWrap = styled("div")`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  ${({ white }) =>
    white
      ? `
    border: var(--sp-px) solid var(--shade4);
    color: var(--shade4);
  `
      : `
    border: var(--sp-px) solid var(--shade8);
    color: var(--shade8);
  `};
  border-radius: var(--br-sm);
  text-align: center;

  &:after {
    content: "${({ content }) => content}";
    font-size: var(--sp-4);
    line-height: var(--sp-4);
    padding: 5px var(--sp-2_5);
    margin-top: 2px;
  }
`;

export const Section = styled("section")`
  position: relative;

  ${Container} {
    z-index: 1;
    display: flex;
    flex-direction: ${({ textRight }) => (textRight ? "row-reverse" : "row")};
    justify-content: space-between;
    align-items: flex-start;

    ${tablet} {
      flex-direction: column;
    }
  }
  .text-block {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    max-width: ${({ textRight }) => (textRight ? "calc(50% + 100px)" : "50%")};
    width: 50%;
    padding: 90px 0;
    padding-right: 40px;
    ${({ textRight }) => textRight && "padding-left: 20px"};
    ${({ textRight }) =>
      textRight ? "margin-left: 100px" : "margin-right: 20px"};
    flex-shrink: 0;

    ${HD} {
      ${({ textRight }) =>
        textRight ? "margin-left: 170px" : "margin-right: 20px"};
    }
    ${tablet} {
      max-width: 75%;
      width: 75%;
      padding-left: 0;
      margin-right: 0;
      ${({ textRight }) => textRight && "margin-left: 25%"};
    }
    ${mobile} {
      max-width: 500px;
      width: 100%;
      padding-left: 0;
      margin-left: 0;
    }

    &__title {
      font-size: var(--sp-11);
      line-height: var(--sp-13);
      margin: 15px 0;

      ${HD} {
        font-size: var(--sp-16);
        line-height: var(--sp-50);
      }
      ${tablet} {
        font-size: var(--sp-9);
        line-height: 46px;
        margin: 10px 0;
      }
      ${mobile} {
        font-size: var(--sp-6);
        line-height: var(--sp-8);
      }
    }
    &__sub-title {
      font-size: var(--sp-4);

      ${HD} {
        font-size: var(--sp-5);
      }
      ${mobile} {
        font-size: var(--sp-3);
      }
    }
    &__description {
      font-size: var(--sp-5);
      margin-top: var(--sp-2_5);

      ${HD} {
        font-size: var(--sp-5);
      }
      ${mobile} {
        margin-top: 0;
        font-size: var(--sp-4);
      }
    }

    > * {
      position: relative;
      z-index: 1;
    }
    &:before {
      content: "";
      display: ${({ $noBackground }) => ($noBackground ? "none" : "block")};
      width: ${({ blockBackground }) =>
        blockBackground ? "150vw" : "calc(50vw + 100px)"};
      left: ${({ blockBackground }) => (blockBackground ? "-50vw" : "-9vw")};
      height: 100%;
      position: absolute;
      top: 0;
      background-color: var(--primary);

      ${HD} {
        width: ${({ blockBackground }) =>
          blockBackground ? "150vw" : "calc(50vw + 280px)"};
      }
      ${tablet} {
        width: ${({ blockBackground }) =>
          blockBackground ? "150vw" : "calc(100% + 9vw)"};
      }
      ${mobile} {
        width: ${({ blockBackground }) =>
          blockBackground ? "150vw" : "calc(100% + 5vw)"};
        left: -5vw;
      }
    }
  }
  .images-container {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: ${({ textRight }) => (textRight ? "flex-end" : "flex-start")};
    align-self: ${({ textRight }) => (textRight ? "flex-start" : "flex-end")};
    text-align: ${({ textRight }) => (textRight ? "end" : "start")};
  }
  .parallax_small {
    z-index: 2;
    margin-top: -40px;
  }
  .main-image {
    position: relative;
    z-index: 1;
  }
`;

export const Tabs = styled("div")`
  box-sizing: border-box;
  display: flex;
  justify-content: ${({ $left }) => ($left ? "flex-start" : "flex-end")};
  border-bottom: var(--sp-px) solid var(--shade3);
  flex-grow: 2;
  ${tablet} {
    width: 100%;
    margin-left: 0;
    padding-right: 0;
    justify-content: flex-start;
  }
  ${mobileSmall} {
    justify-content: space-between;
    transform: translate(-5vw);
    width: 100vw;
    padding: 0 5vw;
  }
  .tab-button {
    cursor: pointer;
    border: none;
    background: transparent;
    font-size: var(--sp-4);
    color: var(--shade3);
    text-align: center;
    padding: 8px 4px 4px;
    margin: 0 var(--sp-6);
    transition: var(--transition-long);
    border-bottom: 4px solid transparent;
    ${HD} {
      font-size: var(--sp-5);
    }
    ${mobile} {
      margin: 0 var(--sp-3);
      font-size: 0.875rem;
      line-height: var(--sp-5);
    }
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
    &:hover {
      color: var(--shade1);
    }
    &.active {
      border-color: var(--primary);
      color: var(--shade0);
    }
  }
`;

// sign in/up
export const StepContainer = styled("div")`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const StepContentWrapper = styled("div")`
  position: relative;
  min-height: 700px;
  width: 100%;

  ${tablet} {
    min-height: 730px;
  }

  ${mobile} {
    min-height: 560px;
  }

  .step-enter {
    opacity: 0;
    transform: translateX(100%);
  }
  .step-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: var(--transition);
  }
  .step-exit {
    opacity: 1;
    transform: translateX(0);
  }
  .step-exit-active {
    opacity: 0;
    transform: translateX(-100%);
    transition: var(--transition);
  }
`;

export const StepContent = styled("div")`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: auto;
  box-sizing: border-box;
  z-index: 6;

  ${tablet} {
    justify-content: flex-start;
  }

  ${({ isCurrent }) =>
    !isCurrent &&
    css`
      pointer-events: none;
    `}
`;

export const FormWrapper = styled("div")`
  position: relative;
  width: 50%;
  padding: 16% 0 100px;
  z-index: 1;

  .info {
    color: var(--shade0);
    padding-right: var(--sp-3);

    &__wrapper {
      display: inline-flex;
      align-items: center;
      padding-bottom: 0.875rem;
      flex-wrap: wrap;
    }

    &__controller {
      color: var(--primary);
      font-weight: 700;
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .subtitle {
    padding-bottom: var(--sp-4);
  }

  .region {
    background-color: var(--shade0);
    color: var(--shade10);
    height: var(--sp-13);
    width: 52px;
    border-radius: var(--br);

    &__wrapper {
      display: table;
    }
  }

  .link-game {
    display: inline-flex;
    align-items: center;
    padding-bottom: var(--sp-5);

    .input {
      &__wrapper {
        margin-right: var(--sp-4);
      }
    }
  }

  ${tablet} {
    width: 70%;
    padding-top: 20%;
  }

  ${mobile} {
    width: 100%;
    padding: 108px 0 70px;

    .title {
      font-size: var(--sp-7);
    }

    .subtitle {
      padding-top: var(--sp-2);
      padding-bottom: 0;
      max-width: 80%;

      ${mobile} {
        max-width: unset;
      }
    }

    .info {
      &__wrapper {
        padding-bottom: var(--sp-6);
      }
    }
  }
`;

export const AnimationWrapper = styled("div")`
  position: relative;
  width: 50%;

  ${tablet} {
    position: absolute;
    right: -28%;
    top: 0;
    width: 80%;
    flex: auto;
  }

  ${mobile} {
    display: none;
  }
`;

export const FormContainer = styled("form")`
  position: relative;
  padding-bottom: var(--sp-9);

  .input {
    &__wrapper {
      &:not(:last-child) {
        margin-bottom: var(--sp-5);
      }
    }

    &__group {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: var(--sp-5);

      ${tablet} {
        flex-wrap: wrap-reverse;
      }
      &_wrapper {
        width: 50%;
        margin-right: var(--sp-4);
        margin-bottom: 0;

        ${tablet} {
          width: 100%;
          margin-right: 0;
          margin-bottom: var(--sp-5);
        }
      }
    }

    &__select {
      &_fluid {
        width: 50%;

        ${tablet} {
          width: 100%;
          margin-bottom: var(--sp-5);
        }
      }
      &:not(:last-child) {
        margin-right: var(--sp-3);
      }
    }
  }
`;

export const SignupHeader = styled("div")`
  padding-bottom: var(--sp-7);
`;

export const SecurityLabel = styled("div")`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
  background-color: var(--shade0);
  border-radius: var(--br);
  padding: var(--sp-4) var(--sp-7);
  box-sizing: border-box;
  color: var(--shade10);
  font-size: var(--sp-6);
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: var(--sp-5);

  ${mobile} {
    justify-content: center;
  }
`;

export const ButtonsWrapper = styled("div")`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  ${({ fluidButtons }) =>
    fluidButtons &&
    css`
      .button {
        &__wrapper {
          width: 48%;

          ${mobile} {
            width: 100%;
          }
        }
      }
    `}

  .button {
    &__wrapper {
      &:not(:last-child) {
        margin-right: var(--sp-4);

        ${mobile} {
          margin-right: 0;
          margin-bottom: var(--sp-5);
        }
      }
    }
  }

  ${mobile} {
    display: block;
  }
`;

export const ButtonSeparator = styled(ButtonLabel)`
  color: var(--shade2);
  margin-right: var(--sp-4);

  ${mobile} {
    display: block;
    text-align: center;
    margin-right: 0;
    margin-bottom: var(--sp-5);
  }
`;

export const InvertedButton = styled("div")`
  background: var(--shade4);

  &:hover {
    background: var(--shade0);
  }
`;

export const CaptionContainer = styled("div")`
  max-width: 75%;

  ${tablet} {
    max-width: 84%;
  }

  ${mobile} {
    max-width: unset;
  }
`;

export const Caption = styled(DropdownLabel)`
  color: var(--shade2);

  .link {
    text-decoration: underline;
  }
`;

export const AccountsList = styled("div")`
  position: relative;
  background: var(--shade8);
  border-radius: var(--br);
  padding: 8px;
  margin-bottom: var(--sp-5);

  .account {
    display: flex;
    color: var(--shade3);
    padding: var(--sp-4);
    background: transparent;
    box-sizing: border-box;
    cursor: pointer;

    &::placeholder {
      color: var(--shade3);
    }

    &__wrapper {
      display: flex;
      align-items: center;
      position: relative;
      padding: 9px 8px 9px var(--sp-4);
      cursor: pointer;

      &:hover {
        background-color: var(--shade7);
        border-radius: var(--br);
      }
    }

    &__icon {
      position: relative;
      width: 1.875rem;
      min-width: 1.875rem;
      height: 1.875rem;
      min-height: 1.875rem;
      border-radius: 50%;
      overflow: hidden;

      &_default {
        background-color: #4e9996;
        color: var(--shade0);

        .account__avatar {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      img {
        object-fit: contain;
      }
    }

    &__avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      margin-top: var(--sp-px);
    }

    &__info {
      display: flex;
      flex-direction: column;
      margin-left: var(--sp-4);

      &-name {
        font-size: var(--sp-4);
        line-height: var(--sp-6);
        color: var(--shade0);
        margin-bottom: var(--sp-px);
      }

      &-email {
        font-size: var(--sp-4);
        line-height: var(--sp-6);
        color: var(--shade1);
      }
    }
  }
`;

export const GamesTabsWrap = styled("div")`
  display: flex;
  justify-content: center;
  position: relative;

  &:after {
    content: "";
    display: block;
    width: 100vw;
    height: var(--sp-px);
    background: ${({ lineColor }) =>
      `radial-gradient(at 50% 50%, ${
        lineColor || "var(--shade0)"
      }, var(--shade9))`};
    position: absolute;
    top: 44px;

    ${mobile} {
      top: var(--sp-5);
    }
  }
`;

export const GameTab = styled("button")`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: var(--sp-4);
  color: ${({ isActive, isColorfull, mainColor }) =>
    !isActive ? "var(--shade1)" : isColorfull ? mainColor : "var(--white)"};

  transition: var(--transition);

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 80px 18px 80px;
    position: relative;
    z-index: 1;
    width: 88px;
    height: 88px;
    background-color: var(--shade9);
    border-radius: 50%;
    border: var(--sp-px) solid var(--shade0);
    transition: var(--transition);
  }

  svg {
    path {
      opacity: ${({ isActive }) => (isActive ? 1 : 0.25)};
      fill: ${({ isActive, isColorfull, mainColor }) =>
        isColorfull && isActive ? mainColor : "var(--shade0)"};
    }
  }
  &:hover {
    > div {
      border-color: ${({ isActive, mainColor }) =>
        isActive ? mainColor || "var(--shade0)" : "var(--shade1)"};
    }
    svg {
      path {
        opacity: ${({ isActive }) => (isActive ? 1 : 0.5)};
      }
    }
  }

  ${tablet} {
    font-size: var(--sp-4);
  }
  ${mobile} {
    && {
      min-width: 74px;
      font-size: var(--sp-3);
      margin: 0 var(--sp-5);
      padding: 0;

      > div {
        width: 40px;
        height: 40px;
        margin: 0 0 var(--sp-3);
      }
      svg {
        width: var(--sp-5);
      }
    }
  }
`;

// search scroll
export const searchScrollStyles = css`
  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-track {
    background: var(--shade0);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--primary);
  }

  &::-webkit-scrollbar-corner,
  &::-webkit-resizer,
  &::-webkit-scrollbar-track-piece,
  &::-webkit-scrollbar-button {
    display: none;
  }
`;

//animations
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
    visibility: visible;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
`;

export const ScrollRoot = styled("div")`
  //isolated reset
  ol,
  ul {
    list-style: none;
    padding: 0;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  button,
  ol,
  ul {
    margin-block-start: 0;
    margin-block-end: 0;
    margin-inline-start: 0;
    margin-inline-end: 0;
  }
`;

export const Headline = styled("h3")`
  font-size: var(--sp-7);
  font-weight: 500;
  line-height: 1.3;

  ${HD} {
    font-size: var(--sp-11);
  }

  ${tablet} {
    font-size: var(--sp-6);
  }

  ${mobile} {
    font-size: var(--sp-4);
  }
`;

export const SmallSubtitle = styled("p")`
  font-size: var(--sp-3_5);
  font-weight: 500;
  line-height: 1.5;

  ${HD} {
    font-size: var(--sp-5);
  }

  ${mobile} {
    font-size: var(--sp-3);
  }
`;

const cnGlobalStyles = `
:root {
  --cn-content-header-height: var(--sp-21);
}
`;
export const CNGlobalStyles = createGlobalStyles(`${cnGlobalStyles}`);
