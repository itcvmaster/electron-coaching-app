import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { Button } from "clutch";

import Static from "@/game-lol/static.mjs";
import Add from "@/inline-assets/add.svg";
import Remove from "@/inline-assets/remove.svg";
import SearchInput from "@/shared/SearchInput.jsx";
import globals from "@/util/global-whitelist.mjs";

const ChampionContainer = styled("span")`
  display: flex;
  align-items: center;

  .champion-image {
    border-radius: 50%;
    width: 24px;
    height: 24px;
    margin-right: 8px;
    background: var(--shade7);
  }
`;

function MatchupFilter(props) {
  const { matchupChampion, onChange } = props;
  const [toggle, setToggle] = useState(false);
  const containerRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    globals.document.addEventListener("mousedown", handleClickOutside);

    return () => {
      globals.document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleClickOutside = useCallback(
    (evt) => {
      if (containerRef.current && !containerRef.current.contains(evt.target)) {
        setToggle(false);
      }
    },
    [containerRef]
  );

  const handleClick = useCallback(() => {
    if (matchupChampion && onChange) {
      onChange();
    } else {
      setToggle(true);
    }
  }, [matchupChampion, onChange]);

  return (
    <div ref={containerRef}>
      {(matchupChampion || !toggle) && (
        <Button
          text={
            matchupChampion ? (
              <ChampionContainer>
                <img
                  className="champion-image"
                  src={Static.getChampionImage(matchupChampion?.key)}
                />
                {matchupChampion.name}
              </ChampionContainer>
            ) : (
              t("lol:championsPage.addMatchup", "Add a Matchup")
            )
          }
          bgColor="var(--shade6)"
          textColor="var(--white)"
          bgColorHover="var(--shade5)"
          textColorHover="var(--white)"
          iconLeft={matchupChampion ? <Remove /> : <Add />}
          onClick={handleClick}
        />
      )}
      {!matchupChampion && toggle && (
        <SearchInput
          text={matchupChampion?.name || ""}
          placeholder={t("lol:searchChampions", "Search Champions")}
          onChange={onChange}
        />
      )}
    </div>
  );
}

export default memo(MatchupFilter);
