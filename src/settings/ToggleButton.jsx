import React from "react";
import { css, styled } from "goober";
import { Tab } from "@headlessui/react";

const ToggleWrapper = styled("div")`
  .toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--sp-2) var(--sp-4);
    background: var(--shade6);
    box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.25);
    color: var(--shade1);
    cursor: pointer;
  }
  .toggle.selected {
    background: var(--shade5);
    box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.25);
    color: var(--shade0);
  }
  .toggle.left {
    border-radius: 5px 0px 0px 5px;
  }
  .toggle.right {
    border-radius: 0px 5px 5px 0px;
  }
`;

const CSSTabList = css`
  display: flex;
  gap: 0 1px;
`;

const CSSTab = css`
  background: transparent;
`;

function ToggleButton({
  value = 0,
  options = [
    { name: "On", value: 0 },
    { name: "Off", value: 1 },
  ],
  onChange = () => {},
  className,
}) {
  const index = options.findIndex((o) => o.value === value);

  return (
    <ToggleWrapper className={className}>
      <Tab.Group
        manual
        selectedIndex={index}
        onChange={(index) => onChange(options[index].value)}
      >
        <Tab.List className={CSSTabList}>
          <Tab
            className={({ selected }) =>
              `type-form--button toggle left ${CSSTab} ${
                selected ? "selected" : ""
              }`
            }
          >
            {options[0].name}
          </Tab>
          <Tab
            className={({ selected }) =>
              `type-form--button toggle right ${CSSTab} ${
                selected ? "selected" : ""
              }`
            }
          >
            {options[1].name}
          </Tab>
        </Tab.List>
      </Tab.Group>
    </ToggleWrapper>
  );
}

export default ToggleButton;
