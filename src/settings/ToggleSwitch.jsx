import React, { useCallback } from "react";
import { styled } from "goober";

const ToggleSwitchContainer = styled("div")`
  position: relative;
  display: flex;
  align-items: center;
  height: var(--sp-5);
  width: var(--sp-9);
  margin: 2px 3px;

  &:not(.disabled) {
    cursor: pointer;
  }

  &::before {
    content: "";
    position: absolute;
    background: var(--blue);
    width: var(--sp-4);
    height: var(--sp-4);
    right: 2px;
    top: 2px;
    border-radius: 50%;
    transition: var(--transition);
    transform: translateX(0%);
  }

  .inner {
    background: var(--blue);
    border-radius: var(--sp-2_5);
    height: 100%;
    width: 100%;
    opacity: 0.4;
    transition: var(--transition);
  }

  &.off {
    .inner {
      background: var(--shade1);
    }

    &::before {
      background: var(--shade1);
      transform: translateX(-100%);
    }
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.38;
  }
`;

export const ToggleSwitch = ({
  onChange = () => {},
  value,
  disabled,
  className,
  name,
}) => {
  const toggleSwitch = useCallback(
    (event) => {
      event.preventDefault();

      if (disabled) return;

      onChange({ name, value: !value });
    },
    [onChange, disabled, name, value]
  );

  const switchClasses = `${className} ${disabled ? "disabled" : ""} ${
    value ? "on" : "off"
  }`;

  return (
    <ToggleSwitchContainer className={switchClasses} onClick={toggleSwitch}>
      <div className="inner" />
    </ToggleSwitchContainer>
  );
};
