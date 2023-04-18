import React, { useCallback, useEffect, useState } from "react";
import { styled } from "goober";

export const ToggleSwitch = ({ onChange, value, disabled, labelText }) => {
  const [toggled, setToggle] = useState(value);

  const toggleSwitch = useCallback(
    (evt) => {
      evt.persist();
      evt.preventDefault();

      if (!disabled)
        setToggle((toggle) => {
          if (onChange) {
            requestAnimationFrame(() => {
              onChange(!toggle);
            });
          }

          return !toggle;
        });
    },
    [onChange, disabled]
  );

  useEffect(() => {
    setToggle(value);
  }, [value]);

  const switchClasses = `${disabled ? "disabled" : ""} ${
    toggled ? "on" : "off"
  }`;

  if (labelText) {
    return (
      <div className="flex between align-center gap-sp-2">
        <span className="type-body2">{labelText}</span>
        <ToggleSwitchContainer className={switchClasses} onClick={toggleSwitch}>
          <div className="inner" />
        </ToggleSwitchContainer>
      </div>
    );
  }

  return (
    <ToggleSwitchContainer className={switchClasses} onClick={toggleSwitch}>
      <div className="inner" />
    </ToggleSwitchContainer>
  );
};

const ToggleSwitchContainer = styled("div")`
  position: relative;
  display: flex;
  align-items: center;
  height: var(--sp-5);
  width: var(--sp-9);
  cursor: pointer;

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
