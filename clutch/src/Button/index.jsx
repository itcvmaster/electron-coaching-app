import React from "react";
import { css, styled } from "goober";

const BtnStyle = (props) => css`
  --radius: var(--br);

  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--white);
  font-family: "Inter", sans-serif;
  white-space: nowrap;
  border-radius: var(--radius);
  overflow: hidden;
  user-select: none;
  cursor: pointer;

  height: var(--btn-height, 2.25rem);
  padding: 0px var(--sp-4);

  opacity: 1;
  cursor: pointer;
  pointer-events: all;
  text-decoration: none;

  transition: color var(--transition), background var(--transition);

  > * {
    position: relative;
  }

  .icon-left {
    margin-right: var(--sp-2);
  }
  .icon-right {
    margin-left: var(--sp-2);
  }

  span {
    white-space: nowrap;
  }

  svg,
  img {
    height: var(--sp-4_5);
    width: var(--sp-4_5);
    display: block;
  }

  &:focus {
    outline: 0;
  }

  /* Emphasis props */
  &[data-emphasis="high"] {
    background: ${props.bgColor};
    color: ${props.textColor};
    box-shadow: var(--highlight);
    text-shadow: var(--btn-txt-shadow);

    &[data-no-highlight="true"] {
      box-shadow: none;
    }

    &:hover {
      background: ${props.bgColorHover};
      color: ${props.textColorHover};
    }
  }

  &[data-emphasis^="med"],
  &[data-emphasis="low"] {
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: var(--radius);
      transition: opacity var(--transition);
    }
  }

  &[data-emphasis^="med"] {
    color: ${props.textColor};

    &::before {
      background: ${props.textColor};
      opacity: 0.15;
    }

    &:hover {
      &::before {
        opacity: 0.25;
      }
    }
  }

  &[data-emphasis="low"] {
    color: ${props.textColor};
    background: transparent;

    &::before {
      background: ${props.textColor};
      opacity: 0;
    }

    &:hover {
      &::before {
        opacity: 0.15;
      }
    }
  }

  /* Size props */
  &[data-size="large"],
  &[data-size="lg"] {
    height: var(--sp-11);
    padding: 0px var(--sp-6);

    svg,
    img {
      height: var(--sp-6);
      width: var(--sp-6);
      display: block;
    }

    .icon-left {
      margin-right: var(--sp-2);
    }
  }

  &[data-size^="sm"] {
    height: var(--sp-7);
    padding: var(--sp-3);

    svg,
    img {
      height: var(--sp-3);
      width: var(--sp-3);
      display: block;
    }
  }

  &[disabled] {
    opacity: 0.38;
    cursor: auto;
    pointer-events: none;
  }

  &[data-block="true"] {
    display: flex;
    width: 100%;
  }

  .button-group & {
    --radius: 0;
    border-radius: 0;
  }
  .button-group &:first-child,
  .button-group &:last-child {
    --radius: var(--br);
  }
  .button-group &:first-child {
    border-top-left-radius: var(--radius);
    border-bottom-left-radius: var(--radius);
  }
  .button-group &:last-child {
    border-top-right-radius: var(--radius);
    border-bottom-right-radius: var(--radius);
  }
  .button-group &[data-active="true"] {
    color: var(--shade0);
    background: var(--shade5);
  }
  .button-group[data-block-group="true"] & {
    flex: 1;
  }
`;

export const Button = ({
  href,
  onClick,
  bgColor = "var(--shade6)",
  bgColorHover = "var(--shade5)",
  textColor = "var(--shade1)",
  textColorHover = "var(--shade0)",
  size = "medium",
  emphasis = "high",
  disabled = false,
  block = false,
  iconLeft,
  iconRight,
  text,
  to,
  active,
  noHighlight,
  className,
  children,
}) => {
  const buttonTextClass =
    size === "large" ? "type-body1-form--active" : "type-form--button";

  const buttonProps = {
    "data-emphasis": emphasis.toLowerCase(),
    "data-block": block,
    "data-size": size,
    href,
    disabled,
    "data-active": active,
    "data-no-highlight": noHighlight,
    onClick,
    to,
  };

  const vars = {
    high: {
      bgColor,
      bgColorHover,
      textColor,
      textColorHover,
      noHighlight,
    },
    medium: {
      textColor,
    },
    low: {
      textColor,
    },
  };

  const emphasisVars = vars[emphasis.toLowerCase()];

  const ButtonElem = href ? "a" : "button";

  const classNames = !className
    ? BtnStyle(emphasisVars)
    : `${BtnStyle(emphasisVars)} ${className}`;

  return (
    <ButtonElem className={classNames} {...buttonProps}>
      {iconLeft && <span className="icon-left">{iconLeft}</span>}
      <span className={buttonTextClass}>{text || children}</span>
      {iconRight && <span className="icon-right">{iconRight}</span>}
    </ButtonElem>
  );
};

// Button group
const Group = styled("div")`
  display: flex;
  align-items: center;
  gap: var(--sp-px, 1px);

  &[data-block-group="true"] {
    width: 100%;
  }

  .active {
    color: var(--shade0) !important;
    background: var(--shade5) !important;
  }
`;

export const ButtonGroup = ({ className, block, children }) => {
  return (
    <Group
      className={className ? `${className} button-group` : "button-group"}
      data-block-group={block ? "true" : "false"}
    >
      {children}
    </Group>
  );
};
