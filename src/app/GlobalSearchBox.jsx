// EXEMPT
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { setRoute } from "@/__main__/router.mjs";
import {
  toggleGlobalSearchAction,
  updateRiotRegionAction,
} from "@/app/actions.mjs";
import {
  GAME_SYMBOL_LOL,
  GAME_SYMBOL_LOR,
  GAME_SYMBOL_VAL,
} from "@/app/constants.mjs";
import {
  ClearBtn,
  CloseBtn,
  Container,
  InputItem,
  InputPad,
  InputValTagItem,
  InputValTagItemContainer,
  InputWrapper,
  SearchContentBackground,
  SearchInputBox,
  SearchInputBoxContainer,
  SearchResultBoxContainer,
  SearchResultContent,
  TagPrefix,
} from "@/app/GlobalSearchBox.style.jsx";
import SearchGameDropdown from "@/app/SearchGameDropdown.jsx";
import SearchNav from "@/app/SearchNavigation.jsx";
import SearchResults from "@/app/SearchResults.jsx";
import Close from "@/inline-assets/close.svg";
import Search from "@/inline-assets/search.svg";
import { Center } from "@/shared/Layout.style.jsx";
import { useGameSymbol } from "@/util/game-route.mjs";
import useKeypress from "@/util/use-key-press.mjs";

function GlobalSearchBox() {
  const state = useSnapshot(readState);
  const { riotRegion } = state.settings;
  const { shouldShowGlobalSearch } = state.volatile;
  const gSymbol = useGameSymbol() || GAME_SYMBOL_LOL;

  const [searchVal, setSearchVal] = useState("");
  const [valTagText, setValTagText] = useState("");
  const [isValTagFocused, setIsValTagFocused] = useState(false);
  const [gameSymbol, setGameSymbol] = useState(gSymbol);
  const [selected, setSelected] = useState(0);
  const [searchItemsCount, setSearchItemsCount] = useState(0);
  const { t } = useTranslation();

  const searchInputElemRef = useRef();
  const valTagInputRef = useRef();

  const updateGameAndRegion = useCallback((newSymbol, newRegion) => {
    if (newSymbol) {
      setGameSymbol(newSymbol);
    }
    if (newRegion) {
      updateRiotRegionAction(newRegion);
    }
    searchInputElemRef.current.focus();
  }, []);

  useEffect(() => {
    if (shouldShowGlobalSearch) searchInputElemRef.current.focus();
  }, [shouldShowGlobalSearch]);

  const updateSearchVal = useCallback((event) => {
    setSearchVal(event.target.value);
    setSelected(0);
  }, []);

  const updateValorantTagText = useCallback((event) => {
    setValTagText(event.target.value.toUpperCase());
  }, []);

  const setFocusedItem = useCallback((index) => setSelected(index), []);

  const handleFocusInputEl = useCallback(() => {
    searchInputElemRef.current.focus();
  }, []);

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowUp" && selected > 0) {
        event.preventDefault();
        setSelected(selected - 1);
      } else if (event.key === "ArrowDown" && selected < searchItemsCount - 1) {
        event.preventDefault();
        setSelected(selected + 1);
      } else if (event.key === "#" && valTagInputRef.current) {
        event.preventDefault();
        valTagInputRef.current.focus();
      } else if (
        event.key === "Backspace" &&
        isValTagFocused &&
        !valTagText.length
      ) {
        event.preventDefault();
        handleFocusInputEl();
      }
    },
    [
      handleFocusInputEl,
      isValTagFocused,
      searchItemsCount,
      selected,
      valTagText.length,
    ]
  );

  const handleClearGlobalSearch = useCallback(() => {
    setSearchVal("");
    setValTagText("");
  }, []);

  const handleCloseGlobalSearch = useCallback(() => {
    handleClearGlobalSearch();
    toggleGlobalSearchAction(false);
  }, [handleClearGlobalSearch]);

  const handleFormSubmit = useCallback(
    (item) => {
      handleCloseGlobalSearch();
      switch (item.type) {
        case "recent":
        case "user":
          setRoute(`/lol/profile/${riotRegion}/${item?.data}`);
          break;
        case "champion":
          setRoute(`/lol/champions/${item?.data?.key ?? "unknown"}`);
          break;
        default:
          break;
      }
    },
    [handleCloseGlobalSearch, riotRegion]
  );

  const handleValTagFocus = useCallback((ev) => {
    setIsValTagFocused(ev.type === "focus");
  }, []);

  useKeypress("Escape", () => {
    handleCloseGlobalSearch();
  });

  const searchContent = (
    <>
      <SearchInputBoxContainer>
        <SearchGameDropdown
          gameSymbol={gameSymbol}
          region={riotRegion}
          updateGameAndRegion={updateGameAndRegion}
        />

        <SearchInputBox onClick={handleFocusInputEl}>
          <Center>
            <Search />
          </Center>
          <Center $onlyVertically style={{ overflow: "hidden" }}>
            <InputWrapper $pr="3">
              <InputItem
                ref={searchInputElemRef}
                value={searchVal}
                length={searchVal.length}
                onChange={updateSearchVal}
                onKeyDown={onKeyDown}
                autoFocus
              />
              <InputPad>{searchVal}</InputPad>
            </InputWrapper>

            <InputValTagItemContainer
              $visible={
                gameSymbol === GAME_SYMBOL_VAL || gameSymbol === GAME_SYMBOL_LOR
              }
              onClick={(e) => e.stopPropagation()}
            >
              <TagPrefix>#</TagPrefix>
              <InputWrapper $w="30px">
                <InputValTagItem
                  ref={valTagInputRef}
                  value={valTagText}
                  onChange={updateValorantTagText}
                  onKeyDown={onKeyDown}
                  placeholder={"TAB"}
                  onFocus={handleValTagFocus}
                  onBlur={handleValTagFocus}
                />
                <InputPad>{valTagText}</InputPad>
              </InputWrapper>
            </InputValTagItemContainer>
          </Center>
          <Center>
            <ClearBtn onClick={handleClearGlobalSearch}>
              {t("common:search.clear", "Clear")}
            </ClearBtn>
          </Center>
          <Center>
            <CloseBtn onClick={handleCloseGlobalSearch}>
              <Close />
            </CloseBtn>
          </Center>
        </SearchInputBox>
      </SearchInputBoxContainer>

      <SearchResultBoxContainer>
        <SearchResultContent>
          <SearchResults
            searchedText={searchVal}
            valTagText={valTagText}
            gameSymbol={gameSymbol}
            region={riotRegion}
            selected={selected}
            onSelectedSearchItem={handleFormSubmit}
            onChangedSearchResult={setSearchItemsCount}
            setFocusedItem={setFocusedItem}
            onClose={handleCloseGlobalSearch}
          />
        </SearchResultContent>
        <SearchNav />
      </SearchResultBoxContainer>
    </>
  );

  return (
    <Container
      className={[
        gameSymbol ? "" : "full-screen",
        shouldShowGlobalSearch ? "" : "inert",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <SearchContentBackground onClick={handleCloseGlobalSearch} />
      {shouldShowGlobalSearch ? searchContent : null}
    </Container>
  );
}

export default GlobalSearchBox;
