import React, { memo } from "react";
import ReactDOMServer from "react-dom/server";
import { styled } from "goober";
import striptags from "striptags";

import Static from "@/game-lol/static.mjs";
import { TooltipContent } from "@/game-lol/TooltipStyles.jsx";
import { getStaticData } from "@/game-lol/util.mjs";

const SpellTooltip = ({ spells, spellId, spellData, description }) => (
  <TooltipContent>
    <div className="spell-data">
      <div className="spell-left">
        <img src={Static.getSpellImageById(spells, spellId)} />
      </div>
      <div className="spell-right">
        <div className="spell-name">{spellData.name}</div>
        <div className="spell-description">{description}</div>
      </div>
    </div>
  </TooltipContent>
);

const SpellImg = ({
  spellId,
  size = 1.5,
  noTooltip = false,
  block = false,
}) => {
  const spells = getStaticData("spells");

  const spellKey = Object.keys(spells).find(
    (key) => parseInt(spells[key].key) === spellId
  );
  const spellData = spells[spellKey];

  if (spellData) {
    const description = striptags(spellData.description);
    const spellHtml = ReactDOMServer.renderToStaticMarkup(
      <SpellTooltip
        spells={spells}
        spellId={spellId}
        spellData={spellData}
        description={description}
      />
    );

    return (
      <Image
        data-tooltip={!noTooltip && spellHtml}
        src={Static.getSpellImageById(spells, spellId)}
        alt={spellData.name}
        size={size}
        block={block?.toString()}
      />
    );
  }

  return (
    <div
      style={{
        background: "var(--shade9)",
      }}
    />
  );
};

export default memo(SpellImg);

const Image = styled("img")`
  display: ${(props) => (props.block ? "block" : "inline")};
  width: ${(props) => props.size}rem;
  height: ${(props) => props.size}rem;
  max-width: ${(props) => props.size};
  max-height: ${(props) => props.size};
  background: var(--shade8);
  border-radius: var(--br-sm);
`;
