// EXEMPT
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  GAME_ICONS,
  GAME_SHORT_NAMES,
  GAME_SYMBOL_LOL,
  GAME_SYMBOL_LOR,
  GAME_SYMBOL_UNKNOWN,
  GAME_SYMBOL_VAL,
} from "@/app/constants.mjs";
import {
  DropdownButton,
  DropdownContent,
  DropdownItem,
  DropdownList,
  DropdownListHeader,
  DropdownListNoHeader,
  EmptyIcon,
  GameDropdownWrapper,
  GameIcon,
  RegionBigBox,
  RegionBox,
  RegionListItem,
  RegionListView,
} from "@/app/SearchGameDropdown.style.jsx";
import SearchResultListView from "@/app/SearchResultListView.jsx";
import { translateGameNames } from "@/app/translate-game-names.mjs";
import { regionsList, SERVICES_TO_REGIONS } from "@/game-lol/constants.mjs";
import ChevronDown from "@/inline-assets/chevron-down.svg";
import ChevronRight from "@/inline-assets/chevron-right.svg";
import Globe from "@/inline-assets/globe.svg";

const SearchGameDropdown = (props) => {
  const { gameSymbol, region, updateGameAndRegion } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedRegion, setIsExpandedRegion] = useState(false);

  const { t } = useTranslation();

  const hasRegion = useMemo(() => {
    if (gameSymbol === GAME_SYMBOL_LOR || gameSymbol === GAME_SYMBOL_VAL)
      return false;
    return true;
  }, [gameSymbol]);

  const handleGameDropdownMenuClicked = useCallback(() => {
    if (isExpandedRegion) {
      setIsExpandedRegion(false);

      if (isExpanded) setIsExpanded(false);
    } else {
      setIsExpanded(!isExpanded);
    }
  }, [isExpanded, isExpandedRegion]);

  const handleRegionBoxClicked = useCallback(
    (event) => {
      event.stopPropagation();

      if (isExpanded) {
        setIsExpanded(false);

        if (isExpandedRegion) setIsExpandedRegion(false);
      } else {
        setIsExpandedRegion(!isExpandedRegion);
      }
    },
    [isExpanded, isExpandedRegion]
  );

  return (
    <GameDropdownWrapper>
      <DropdownButton onClick={handleGameDropdownMenuClicked}>
        {gameSymbol === GAME_SYMBOL_UNKNOWN ? (
          <>{translateGameNames(t, gameSymbol)}</>
        ) : (
          <GameIcon src={GAME_ICONS[gameSymbol]} alt={gameSymbol.description} />
        )}
        {hasRegion && (
          <RegionBox onClick={handleRegionBoxClicked}>
            <p className="type-caption--bold">{SERVICES_TO_REGIONS[region]}</p>
          </RegionBox>
        )}
        <ChevronDown />
      </DropdownButton>

      <DropdownContent>
        {isExpanded && (
          <DropdownList>
            <SearchResultListView
              data={[
                GAME_SYMBOL_UNKNOWN,
                GAME_SYMBOL_LOL,
                GAME_SYMBOL_LOR,
                GAME_SYMBOL_VAL,
              ]}
              renderHeaderComponent={() => {
                if (!hasRegion) return <DropdownListNoHeader />;
                return (
                  <DropdownListHeader>
                    <Globe />
                    {t("common:riotRegion", "Riot Games Region:")}
                    <RegionBigBox
                      onClick={() => setIsExpandedRegion(!isExpandedRegion)}
                    >
                      {SERVICES_TO_REGIONS[region]}
                      <ChevronRight />
                    </RegionBigBox>
                  </DropdownListHeader>
                );
              }}
              renderItem={(itemSymbol) => {
                return (
                  <DropdownItem
                    className={itemSymbol === gameSymbol ? "active" : ""}
                    onClick={() => {
                      setIsExpandedRegion(false);
                      setIsExpanded(false);
                      updateGameAndRegion(itemSymbol, null);
                    }}
                  >
                    {itemSymbol === GAME_SYMBOL_UNKNOWN ? (
                      <EmptyIcon />
                    ) : (
                      <GameIcon
                        src={GAME_ICONS[itemSymbol]}
                        alt={GAME_SHORT_NAMES[itemSymbol]}
                      />
                    )}
                    {translateGameNames(t, itemSymbol)}
                  </DropdownItem>
                );
              }}
            />
          </DropdownList>
        )}

        {isExpandedRegion && (
          <RegionListView>
            <SearchResultListView
              data={regionsList}
              renderItem={(item) => {
                return (
                  <RegionListItem
                    className={item.id === region ? "active" : ""}
                    onClick={() => {
                      setIsExpandedRegion(false);
                      updateGameAndRegion(null, item.id);
                    }}
                  >
                    {item.name}
                  </RegionListItem>
                );
              }}
            />
          </RegionListView>
        )}
      </DropdownContent>
    </GameDropdownWrapper>
  );
};

export default SearchGameDropdown;
