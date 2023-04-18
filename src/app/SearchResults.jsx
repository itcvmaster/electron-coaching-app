// EXEMPT
import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import ChampionSelectedResult from "@/app/ChampionResult.jsx";
import {
  GAME_ICONS,
  GAME_SYMBOL_LOL,
  GAME_SYMBOL_UNKNOWN,
} from "@/app/constants.mjs";
import ProSelectedResult from "@/app/ProResult.jsx";
import SearchResultListView from "@/app/SearchResultListView.jsx";
import {
  GameHeaderText,
  GameIcon,
  GameSearchResultsHeader,
  Overline,
  SearchHistoryList,
  SearchNoResult,
  SearchResultsLeftSide,
  SearchResultsList,
  SearchResultsRightSide,
  SearchResultsWrapper,
  TextDot,
} from "@/app/SearchResults.style.jsx";
import { ChampionItem, ProItem, UserItem } from "@/app/SearchResultsItems.jsx";
import useLoLSearch from "@/game-lol/use-lol-search.mjs";
// TODO: REMOVE INLINE PNG IMAGE
import NoSearchResult from "@/inline-assets/no_search_result.png";
import Search from "@/inline-assets/search.svg";
import useKeypress from "@/util/use-key-press.mjs";

function SearchResults(props) {
  const {
    searchedText,
    gameSymbol,
    selected,
    onSelectedSearchItem,
    onChangedSearchResult,
    setFocusedItem,
    onClose,
  } = props;

  const [isEntered, setIsEntered] = useState(false);

  const { t } = useTranslation();

  // get search results by inputed text
  const shouldShowLolResults =
    !gameSymbol ||
    gameSymbol === GAME_SYMBOL_UNKNOWN ||
    gameSymbol === GAME_SYMBOL_LOL;

  const {
    filteredChampions: lolFilteredChampions,
    filteredUsers: lolFilteredUsers,
    filteredPros: lolFilteredPros,
  } = useLoLSearch(searchedText, shouldShowLolResults);

  const items = useMemo(() => {
    const filteredAccounts = lolFilteredUsers.map((item) => {
      return { type: "user", data: item.name };
    });

    const usersSelections =
      !searchedText || !shouldShowLolResults
        ? [...filteredAccounts]
        : [...filteredAccounts, { type: "user", data: searchedText }];

    const championsSelections = lolFilteredChampions.map((champion) => {
      return { type: "champion", data: champion };
    });

    const proSelections = lolFilteredPros.map((pro) => {
      return { type: "pro", data: pro };
    });

    return {
      lolChampions: championsSelections.slice(0, 3),
      lolUsers: usersSelections.slice(0, 8),
      lolPros: proSelections.slice(0, 3),
      tftChampions: {},
      tftUsers: {},
      tftItems: {},
      tftTraits: {},
      valAgents: {},
      valUsers: {},
      valWeapons: {},
      valMaps: {},
      valFriends: {},
      lorCards: {},
      lorUsers: {},
    };
  }, [
    lolFilteredUsers,
    searchedText,
    shouldShowLolResults,
    lolFilteredChampions,
    lolFilteredPros,
  ]);

  const totalSearchResults = useMemo(() => {
    let totalResults = [];

    if (shouldShowLolResults) {
      if (!searchedText) {
        totalResults = totalResults.concat(items.lolUsers);
      } else {
        totalResults = totalResults.concat(
          items.lolUsers,
          items.lolChampions,
          items.lolPros
        );
      }
    }

    return totalResults;
  }, [items, searchedText, shouldShowLolResults]);

  useEffect(() => {
    onChangedSearchResult(totalSearchResults.length);
  }, [onChangedSearchResult, totalSearchResults.length]);

  const selectedSearchItemDetail = useMemo(() => {
    const itemData = totalSearchResults[selected]?.data;
    if (!itemData) return null;

    switch (totalSearchResults[selected].type) {
      case "champion":
        return (
          <ChampionSelectedResult
            champId={itemData.champion_id}
            champName={itemData.name}
            champKey={itemData.key}
            onClose={onClose}
          />
        );
      case "pro":
        return <ProSelectedResult pro={itemData} onClose={onClose} />;

      default:
        return null;
    }
  }, [totalSearchResults, selected, onClose]);

  const searchItemRefs = useMemo(() => {
    const refs = [];
    for (let i = 0; i < totalSearchResults.length; i++) {
      refs.push(createRef());
    }

    return refs;
  }, [totalSearchResults.length]);

  // find matched search item
  useEffect(() => {
    for (let i = 0; i < totalSearchResults.length; i++) {
      const item = totalSearchResults[i];

      if (
        !["user", "tft:user", "val:user", "val:friend", "lor:user"].includes(
          item.type
        )
      ) {
        if (item.data.name.toLowerCase() === searchedText.toLowerCase()) {
          setFocusedItem(i);
          break;
        }
      }
    }
  }, [searchedText, setFocusedItem, totalSearchResults]);

  useEffect(() => {
    if (searchItemRefs[selected] && searchItemRefs[selected].current) {
      searchItemRefs[selected].current.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [searchItemRefs, selected]);

  // handle `Enter` key press event
  const onEnter = useCallback(() => {
    if (totalSearchResults[selected]) {
      if (totalSearchResults[selected].type === "pro") {
        setIsEntered(true);
        return;
      }
      onSelectedSearchItem(totalSearchResults[selected]);
      onClose();
    }
  }, [onClose, onSelectedSearchItem, selected, totalSearchResults]);

  useKeypress("Enter", onEnter);

  // handle lol pro item clicked event
  const handleProItemClicked = useCallback(
    (account) => {
      onSelectedSearchItem(account);
      onClose();
    },
    [onClose, onSelectedSearchItem]
  );

  let counter;

  // recent search history
  if (searchedText === "") {
    counter = -1;
    return (
      <SearchResultsWrapper>
        <SearchResultsLeftSide
          className={`${
            selectedSearchItemDetail !== null ? "detail" : "no-detail"
          }`}
        >
          <SearchHistoryList>
            <SearchResultListView
              data={[...items.lolUsers]}
              renderHeaderComponent={() => {
                return (
                  <Overline>
                    {t("common:search.recent", "Recent Searches")}
                  </Overline>
                );
              }}
              renderItem={(item) => {
                counter++;
                switch (item.type) {
                  case "user":
                  case "val:user":
                  case "lor:user":
                    return (
                      <UserItem
                        itemRef={searchItemRefs[counter]}
                        position={counter}
                        user={item.data}
                        cursor={selected}
                        passSubmit={() => onSelectedSearchItem(item)}
                        setFocusedItem={setFocusedItem}
                      />
                    );
                  default:
                    return null;
                }
              }}
            />
          </SearchHistoryList>
        </SearchResultsLeftSide>
        {selectedSearchItemDetail && (
          <SearchResultsRightSide>
            {selectedSearchItemDetail}
          </SearchResultsRightSide>
        )}
      </SearchResultsWrapper>
    );
  }

  // no search result
  if (!totalSearchResults.length) {
    return (
      <SearchNoResult>
        <div
          style={{
            fontSize: 19,
            lineHeight: "30px",
            color: "var(--shade1)",
            marginBottom: 20,
          }}
        >
          {t(
            "common:search.noResult",
            "There are no results for that search term. Check your spelling."
          )}
        </div>
        <div
          style={{
            fontSize: 18,
            lineHeight: "31px",
            color: "var(--shade1)",
            opacity: 0.4,
            marginBottom: 10,
          }}
        >
          {t(
            "common:search.noFinding",
            "Still not finding what you're looking for?"
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 16,
            lineHeight: "26px",
            color: "var(--shade2)",
            marginBottom: 15,
          }}
        >
          <TextDot />
          {t(
            "common:search.checkYourRegion",
            "Check that you're in the correct region (Riot Games)"
          )}
        </div>
        <img
          src={NoSearchResult}
          alt={"No result"}
          style={{
            margin: "-36px 0 15px -15px",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 16,
            lineHeight: "26px",
            color: "var(--shade2)",
            marginBottom: 10,
          }}
        >
          <TextDot />
          {t(
            "common:search.tryBroadeningYourFilters",
            "Try broadening your filters and make sure your game is selected."
          )}
        </div>
        <div
          css={`
            display: flex;
            align-items: center;
            padding-left: var(--sp-6);

            svg {
              width: var(--sp-4);
              height: var(--sp-4);
              margin-right: var(--sp-3);

              path {
                color: var(--shade0);
              }
            }
          `}
        >
          <Search />
          <p className="type-subtitle2" style={{ color: "var(--shade0)" }}>
            {t("common:redoSearch", "Redo search with filters cleared")}
          </p>
        </div>
      </SearchNoResult>
    );
  }

  return (
    <SearchResultsWrapper>
      <SearchResultsLeftSide
        className={`${
          selectedSearchItemDetail !== null ? "detail" : "no-detail"
        }`}
      >
        {/*     League of Legends     */}
        {shouldShowLolResults && (
          <>
            <GameSearchResultsHeader>
              <GameIcon src={GAME_ICONS[GAME_SYMBOL_LOL]} alt={"lol"} />
              <GameHeaderText>
                {t("common:games.lol.long", "League of Legends")}
              </GameHeaderText>
            </GameSearchResultsHeader>

            {/*   LOL Users   */}
            {items.lolUsers.length > 0 && (
              <SearchResultsList
                data={items.lolUsers}
                renderHeaderComponent={() => {
                  counter = -1;
                  return <Overline>{"Players"}</Overline>;
                }}
                renderItem={(item) => {
                  counter++;
                  return (
                    <UserItem
                      itemRef={searchItemRefs[counter]}
                      position={counter}
                      user={item.data}
                      cursor={selected}
                      passSubmit={() => onSelectedSearchItem(item)}
                      setFocusedItem={setFocusedItem}
                    />
                  );
                }}
              />
            )}

            {/*   LOL Champions   */}
            {items.lolChampions.length > 0 && (
              <SearchResultsList
                data={items.lolChampions}
                renderHeaderComponent={() => {
                  counter = items.lolUsers.length - 1;
                  return <Overline>{"Champions"}</Overline>;
                }}
                renderItem={(item) => {
                  counter++;
                  return (
                    <ChampionItem
                      itemRef={searchItemRefs[counter]}
                      position={counter}
                      champion={item.data}
                      cursor={selected}
                      passSubmit={() => onSelectedSearchItem(item)}
                      setFocusedItem={setFocusedItem}
                    />
                  );
                }}
              />
            )}

            {/*   LOL Pros   */}
            {items.lolPros.length > 0 && (
              <SearchResultsList
                data={items.lolPros}
                renderHeaderComponent={() => {
                  counter =
                    items.lolUsers.length + items.lolChampions.length - 1;
                  return <Overline>{"Pro Players"}</Overline>;
                }}
                renderItem={(item) => {
                  counter++;
                  return (
                    <ProItem
                      itemRef={searchItemRefs[counter]}
                      position={counter}
                      pro={item.data}
                      cursor={selected}
                      isEntered={isEntered && counter === selected}
                      passSubmit={handleProItemClicked}
                      setFocusedItem={setFocusedItem}
                    />
                  );
                }}
              />
            )}
          </>
        )}
      </SearchResultsLeftSide>

      {selectedSearchItemDetail && (
        <SearchResultsRightSide>
          {selectedSearchItemDetail}
        </SearchResultsRightSide>
      )}
    </SearchResultsWrapper>
  );
}

export default SearchResults;
