// EXEMPT
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { mobile } from "clutch";

import ChampionImg from "@/game-lol/ChampionImg.jsx";

const ResultTitle = styled("span")`
  margin-top: var(--sp-4);
  font-size: var(--sp-4);
`;
const ChampHeader = styled("div")`
  position: relative;
`;
const Buttons = styled("div")`
  display: flex;
  margin-top: var(--sp-3);

  ${mobile} {
    display: block;
  }
`;
const ChampionEntryLabel = styled("a")`
  display: flex;
  align-items: center;
  padding: var(--sp-1) var(--sp-2);
  margin: 0 2px;
  background: var(--shade8);
  color: var(--shade3);
  border-radius: var(--br-sm);
  cursor: pointer;

  &:hover {
    background: var(--shade7);
    color: var(--shade2);
  }

  ${mobile} {
    margin: 4px 0;
  }
`;

const ChampionSelectedResult = ({ champId, champName, champKey, onClose }) => {
  const { t } = useTranslation();
  const handleLinkClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!champId) return null;

  return (
    <>
      <ChampHeader>
        <ChampionImg championId={champId} size={60} />
      </ChampHeader>
      <ResultTitle>{champName}</ResultTitle>
      <Buttons>
        <ChampionEntryLabel
          href={`/lol/champions/${champKey}/probuilds`}
          onClick={handleLinkClick}
        >
          <p className="type-caption">
            {t("lol:search.proBuilds", "ProBuilds")}
          </p>
        </ChampionEntryLabel>
        <ChampionEntryLabel
          href={`/lol/champions/${champKey}/counters`}
          onClick={handleLinkClick}
        >
          <p className="type-caption">{t("lol:search.counters", "Counters")}</p>
        </ChampionEntryLabel>
        <ChampionEntryLabel
          href={`/lol/champions/${champKey}/trends`}
          onClick={handleLinkClick}
        >
          <p className="type-caption">
            {t("lol:search.statistics", "Statistics")}
          </p>
        </ChampionEntryLabel>
      </Buttons>
    </>
  );
};

export default ChampionSelectedResult;
