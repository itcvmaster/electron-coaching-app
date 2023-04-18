import React, { memo } from "react";
import { styled } from "goober";

import SearchIcon from "@/inline-assets/search-icon.svg";
import debounce from "@/util/debounce.mjs";

// TODO: Move to Clutch

const InputWrapper = styled("div")`
  --bg: var(--shade6);

  position: relative;
  display: flex;
  align-items: center;
  height: var(--sp-9);
  font-size: var(--sp-3_5);
  color: var(--white);
  background-color: var(--bg);
  box-shadow: none;
  border-radius: var(--br);
  overflow: hidden;

  svg {
    width: var(--sp-6);
    height: var(--sp-6);
    margin: 0 0 0 var(--sp-3);
  }

  input {
    background-color: var(--bg);
    color: var(--shade0);
    font-size: var(--sp-3_5);
    box-shadow: none;
    border: 0;
    padding-left: var(--sp-3);
    padding-right: var(--sp-5);
    box-sizing: border-box;
    width: calc(100% - var(--sp-9));

    &::placeholder {
      color: var(--shade2-75);
    }

    &:focus {
      box-shadow: none;
      border: 0;
      outline: none;
    }
  }
`;

function SearchInput(props) {
  const { text, placeholder, onChange } = props;
  const debouncedChange = debounce((v) => onChange(v));
  return (
    <InputWrapper>
      <SearchIcon />
      <input
        type="text"
        defaultValue={text}
        placeholder={placeholder}
        onChange={(e) => {
          e.preventDefault();
          debouncedChange(e.target.value);
        }}
      />
    </InputWrapper>
  );
}

export default memo(SearchInput);
