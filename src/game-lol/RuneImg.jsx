import React, { useCallback } from "react";
import ReactDOMServer from "react-dom/server";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { shardIdList } from "@/game-lol/constants.mjs";
import { TooltipContent } from "@/game-lol/TooltipStyles.jsx";
import { translateShardInfo } from "@/game-lol/translate-shard.mjs";
import { getRuneImage, getStaticData } from "@/game-lol/util.mjs";

const RuneImage = styled("picture")`
  display: block;
  width: ${(props) => (props.size ? `${props.size}rem` : "var(--sp-8)")};
  height: ${(props) => (props.size ? `${props.size}rem` : "var(--sp-8)")};
  cursor: ${(props) => props.clickable && "pointer"};

  opacity: 0.5;
  filter: saturate(0);
  transition: var(--transition);

  img {
    width: 100%;
    height: 100%;
    cursor: ${(props) => props.clickable === "true" && "pointer"};
  }

  &:not(.rune-active) {
    &:hover {
      opacity: 0.8;
      filter: saturate(1) drop-shadow(0 9px 10px rgba(0, 0, 0, 0.5));
      transform: translateY(-3px);
    }
  }

  &.rune-active {
    opacity: 1;
    filter: saturate(1);
  }
`;

const RuneTooltip = ({ runeName, runeImage, runeDetails, cta }) => (
  <TooltipContent>
    <div className="rune-data">
      <div className="rune-left">
        <img src={runeImage} />
      </div>
      <div className="rune-right">
        <div className="rune-name">{runeName}</div>
        <div
          className="rune-short"
          dangerouslySetInnerHTML={{ __html: runeDetails }}
        />
        {cta && <span className="cta">{cta}</span>}
      </div>
    </div>
  </TooltipContent>
);

const RuneImg = ({
  size = 1.5,
  currRune,
  onClick,
  activeRunes,
  runeTree,
  noTooltip = false,
  className,
  setShow,
}) => {
  const { t } = useTranslation();
  const perksDetails = getStaticData("runeDetails");

  const clickable = !!onClick;

  const handleRuneClick = useCallback(
    (e) => {
      if (onClick) onClick();
      if (runeTree) {
        e.stopPropagation();
        e.preventDefault();
        setShow(true);
      }
    },
    [onClick, runeTree, setShow]
  );

  if (!currRune) return null;

  const active = activeRunes ? activeRunes.includes(currRune.id) : true;
  const runeDetails = perksDetails?.[currRune.id]
    ? perksDetails[currRune.id]
    : currRune.shortDesc;

  // TODO!!!
  // Should replace some patterns with variable.
  // Pattern: @RegenAmount@, to ???

  const src_png = getRuneImage("png", currRune.id);
  const src_webp = getRuneImage("webp", currRune.id);
  let runeHtml = null;
  if (!noTooltip) {
    runeHtml = ReactDOMServer.renderToStaticMarkup(
      <RuneTooltip
        runeImage={src_png}
        runeName={
          shardIdList.includes(currRune.id)
            ? translateShardInfo(t, currRune.id)
            : currRune.name
        }
        runeDetails={runeDetails}
        cta={runeTree && t("lol:clickFullRunes", "Click for full runes")}
      />
    );
  }

  return (
    <>
      <RuneImage
        size={size}
        data-tooltip={runeHtml}
        onClick={handleRuneClick}
        clickable={clickable.toString()}
        active={active.toString()}
        className={`${className} ${active && "rune-active"}`}
      >
        <source srcSet={src_webp} type="image/webp" />
        <source srcSet={src_png} type="image/png" />
        <img src={src_png} alt={currRune.name} />
      </RuneImage>
    </>
  );
};

export default RuneImg;
