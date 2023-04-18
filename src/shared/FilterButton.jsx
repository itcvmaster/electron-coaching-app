import React from "react";
import { styled } from "goober";

import { Button } from "clutch";

import BlitzFilter from "@/inline-assets/blitz-filter.svg";

const ButtonContainer = styled("div")`
  position: relative;
`;

const Btn = styled(Button)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  > span.icon-left {
    margin-right: 0;
  }
`;

const Badge = styled("div")`
  position: absolute;
  top: -2px;
  right: -2px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--blue);
  width: var(--sp-4);
  height: var(--sp-4);
  border-radius: 50%;
  color: var(--shade8);
`;

const FilterButton = ({ itemsLength, handleClick }) => {
  return (
    <ButtonContainer onClick={handleClick}>
      <Btn iconLeft={<BlitzFilter size={16} />} />
      <Badge>
        <span className="type-caption--bold">{itemsLength}</span>
      </Badge>
    </ButtonContainer>
  );
};

export default FilterButton;
