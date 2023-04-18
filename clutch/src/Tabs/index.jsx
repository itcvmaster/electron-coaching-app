import React from "react";
import { css } from "goober";

const containerClass = css`
  display: flex;
  flex-direction: "column";
  > * {
    display: flex;
  }
`;

const tabContainerClass = (props) => css`
  margin: auto 0;
  padding: 0 var(--sp-3);
  height: var(--sp-13);
  align-items: center;
  width: fit-content;
  ${props.active &&
  `
        border-bottom: 2px solid var(--primary);
        font-weight: 700;
        > label {
            color: var(--shade0);
        };
    `}
`;

const tabInputClass = css({
  display: "none",
});

const tabLabelClass = css({
  color: "var(--shade2)",
});

export const Tabs = ({ tabOptions, onChange, activeTab, classes }) => {
  const {
    containerClass: containerClassOverride,
    tabContainerClass: tabContainerClassOverride = () => null,
    tabInputClass: tabInputClassOverride,
    tabLabelClass: tabLabelClassOverride,
  } = classes || {};

  const tabs = tabOptions.map((option, index) => {
    return (
      <div
        key={option.name}
        className={
          tabContainerClassOverride({ active: activeTab === index }) ||
          tabContainerClass({ active: activeTab === index })
        }
      >
        <input
          className={tabInputClassOverride || tabInputClass}
          type="radio"
          id={option.name}
          name="tab_option"
          value={index}
          checked={activeTab === index}
          onChange={() => onChange(index)}
        />
        <label
          className={tabLabelClassOverride || tabLabelClass}
          htmlFor={option.name}
        >
          {option.content || option.name}
        </label>
      </div>
    );
  });

  return <div className={containerClassOverride || containerClass}>{tabs}</div>;
};
