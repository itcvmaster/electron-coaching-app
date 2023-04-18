/*eslint-disable no-unused-vars*/
import React, { useMemo } from "react";
import ReactDOMServer from "react-dom/server";
import { useTranslation } from "react-i18next";
import { css, styled } from "goober";
import striptags from "striptags";

import { mobile, mobileSmall, tablet, tabletLarge } from "clutch";

import { TOOLTIP_MAX_WIDTH } from "@/app/constants.mjs";
import { SKILL_HOTKEYS } from "@/game-lol/constants.mjs";
import Static from "@/game-lol/static.mjs";
import { getAbilityVideo, getCorrectAbilityImg } from "@/game-lol/util.mjs";

const CssSpellImg = css`
  height: var(--sp-8);
  display: block;
  width: var(--sp-8);
  border-radius: var(--br);
  background: var(--shade9);
`;

const CssInline = css`
  position: relative;
  display: inline;
`;

const SpellVidContainer = styled("div")`
  display: block;
  margin: calc(var(--sp-2) * -1) calc(var(--sp-4) * -1);
  max-width: ${TOOLTIP_MAX_WIDTH}px;
  background: var(--shade10);
  border-radius: var(--br);
  overflow: hidden;
  position: relative;
  z-index: 2;
  box-shadow: 0 9px 25px rgba(0, 0, 0, 0.4);
`;

const SpellLeftVid = styled("div")`
  box-sizing: border-box;
  max-width: 48px;
  max-height: 48px;
  position: absolute;
  top: var(--sp-6);
  left: var(--sp-6);
  border-radius: var(--br-sm);
  overflow: hidden;
  border: 2px solid var(--shade10);

  img {
    max-width: 100%;
  }

  span {
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    right: 0;
    background: var(--shade10);
    color: var(--shade0);
    display: block;
    line-height: 1;
    font-weight: 700;
    text-align: center;
    width: 50%;
    padding: 4px 4px 2px;
    border-radius: 4px 0 0 0;
  }

  ${mobile} {
    top: var(--sp-4);
    left: var(--sp-4);
  }
`;

const SpellVid = styled("div")`
  position: relative;
  overflow: hidden;
  display: block;

  &:after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 45%;
    background: linear-gradient(to top, var(--shade10) 0%, rgba(7, 14, 29, 0));
  }
  video {
    max-width: 100%;
    display: block;
    height: auto;
    transform: scale(1.5) translateY(-20px);
    transform-origin: 25% 25%;
  }
`;

const SpellInfo = styled("div")`
  display: block;
  padding: 0 24px 24px var(--sp-6);
  color: var(--shade1);
  font-size: var(--sp-3);
  margin-top: -4.5em;
  position: relative;
  z-index: 1;

  h4 {
    font-weight: 500;
    font-size: 0.875rem;
    line-height: var(--sp-5);
    color: var(--shade0);
  }
  p {
    font-size: 0.75em;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

const SpellResources = styled("div")`
  margin-bottom: var(--sp-3);
`;

const SpellResource = styled("div")`
  display: block;
  font-weight: 500;
  font-size: var(--sp-3);
  line-height: 1.5;
`;

const SpellResourceTitle = styled("span")`
  color: var(--shade3);
`;

const SpellResourceText = styled("span")`
  color: #49b4ff;
`;

const SpellMissing = styled("div")`
  display: block;
  font-size: var(--sp-3);
  line-height: 1.33;
  margin-top: 0.75em;
  text-align: left;
`;

const SpellDamage = styled("span")`
  color: var(--blue);
`;

const SpellCoeff = styled("span")`
  color: var(--shade4);
`;

const getSurroundingText = (text, symbol, str, tag) => {
  const styledTextRegex = new RegExp(symbol, "g");
  if (!text.match(styledTextRegex))
    return text.replace(symbol, `<split>${tag}~~${str}<split>`);
  const regexedSymbol = text.match(styledTextRegex)[0];
  if (regexedSymbol.includes("(") !== regexedSymbol.includes(")"))
    return text.replace(symbol, `<split>${tag}~~${str}<split>`);
  return text.replace(
    regexedSymbol,
    `<split>${tag}~~${regexedSymbol.replace(symbol, str)}<split>`
  );
};

const AbilityImg = ({ champion, children, abilityIndex, ...restProps }) => {
  const { t } = useTranslation();
  const championKey = champion?.key;
  const championId = champion?.id;
  const ability = champion?.spells?.[abilityIndex + 1];
  const passive =
    (abilityIndex === null || abilityIndex === undefined) &&
    champion?.spells?.[0];
  const hotkey = SKILL_HOTKEYS[abilityIndex] || "P";
  const videoSrc = getAbilityVideo(championKey, hotkey);

  const { abilityName, spellName, displayImg, missingData, styledText } =
    useMemo(() => {
      let abilityName,
        displayImg,
        parsedTooltip,
        spellName,
        missingData,
        abilityTooltip;

      if (ability) {
        abilityTooltip = ability.tooltip || ability.description || "";
        displayImg = Static.getChampionSpellImageById(ability.id);

        spellName = t("lol:spells.hotkey", "{{abilityName}} ({{hotkey}})", {
          abilityName: ability.name,
          hotkey: hotkey,
        });
        abilityName = ability.name;

        parsedTooltip = striptags(
          abilityTooltip.replace(/&nbsp;/g, " ").replace(/<br \/>/g, "\n")
        );
        const re = abilityTooltip.match(/{{(.*?)}}/g) || [];

        re.forEach((symbol) => {
          const key = symbol[3];
          const index = parseInt(symbol[4]);
          const combined = `${key}${index}`;
          let variable = null;
          let text = "",
            ftext = "";
          let parsedCoeff, fParsedCoeff;

          switch (key) {
            case "e":
              if (!ability.effectBurn[index]) {
                parsedTooltip = parsedTooltip.replace(symbol, "?");
                missingData = true;
                break;
              }
              parsedTooltip = getSurroundingText(
                parsedTooltip,
                symbol,
                ability.effectBurn[index],
                "spelldmg"
              );
              break;
            case "a":
              variable = ability.vars.find((data) => data.key === combined);
              if (!variable) {
                parsedTooltip = parsedTooltip.replace(symbol, "?");
                missingData = true;
                break;
              }
              parsedCoeff = Array.isArray(variable.coeff)
                ? variable.coeff.map((c) => parseInt(c * 100)).join("/")
                : parseInt(variable.coeff * 100);
              switch (variable.link) {
                case "spelldamage":
                  text = t(
                    "lol:amountSpellDamage",
                    "{{amount}}% Spell Damage",
                    {
                      amount: parsedCoeff,
                    }
                  );
                  break;
                case "attackdamage":
                  text = t(
                    "lol:amountAttackDamage",
                    "{{amount}}% Attack Damage",
                    { amount: parsedCoeff }
                  );
                  break;
                case "bonusspelldamage":
                  text = t(
                    "lol:amountBonusSpellDamage",
                    "{{amount}}% bonus Spell Damage",
                    { amount: parsedCoeff }
                  );
                  break;
                case "bonusattackdamage":
                  text = t(
                    "lol:amountBonusAttackDamage",
                    "{{amount}}% bonus Attack Damage",
                    {
                      amount: parsedCoeff,
                    }
                  );
                  break;
                default:
                  text = t(
                    "lol:amountOtherDamage",
                    "{{amount}}% {{otherDamage}}",
                    {
                      amount: parsedCoeff,
                      otherDamage: variable.link,
                    }
                  );
                  break;
              }
              parsedTooltip = getSurroundingText(
                parsedTooltip,
                symbol,
                text,
                "spellcoeff"
              );
              break;
            case "f":
              variable = ability.vars.find((data) => data.key === combined);
              if (!variable) {
                parsedTooltip = parsedTooltip.replace(symbol, "?");
                missingData = true;
                break;
              }
              ftext = "";
              fParsedCoeff = Array.isArray(variable.coeff)
                ? variable.coeff.map((c) => parseInt(c * 100)).join("/")
                : parseInt(variable.coeff * 100);
              switch (variable.link) {
                case "spelldamage":
                  ftext = t(
                    "lol:amountSpellDamage",
                    "{{amount}}% Spell Damage",
                    {
                      amount: fParsedCoeff,
                    }
                  );
                  break;
                case "attackdamage":
                  ftext = t(
                    "lol:amountAttackDamage",
                    "{{amount}}% Attack Damage",
                    { amount: fParsedCoeff }
                  );
                  break;
                case "bonusspelldamage":
                  ftext = t(
                    "lol:amountBonusSpellDamage",
                    "{{amount}}% bonus Spell Damage",
                    {
                      amount: fParsedCoeff,
                    }
                  );
                  break;
                case "bonusattackdamage":
                  ftext = t(
                    "lol:amountBonusAttackDamage",
                    "{{amount}}% bonus Attack Damage",
                    {
                      amount: fParsedCoeff,
                    }
                  );
                  break;
                default:
                  ftext = `${parsedCoeff}%`;
                  break;
              }
              parsedTooltip = getSurroundingText(
                parsedTooltip,
                symbol,
                ftext,
                "spellcoeff"
              );
              break;
            default:
              parsedTooltip = parsedTooltip.replace(symbol, "?");
              missingData = true;
              break;
          }
        });
      } else if (passive) {
        displayImg = Static.getChampionPassiveImageById(passive.image.full);
        parsedTooltip = striptags(
          passive.description.replace(/&nbsp;/g, " ").replace(/<br \/>/g, "\n")
        );
        spellName = `${passive.name} (${t("lol:passive", "Passive")})`;
        abilityName = passive.name;
      }

      const styledText =
        parsedTooltip &&
        parsedTooltip.split("<split>").map((item, i) => {
          if (i % 2 === 0) {
            return item;
          }
          const split = item.split("~~");
          return split[0] === "spelldmg" ? (
            <SpellDamage key={`${hotkey}${i}`}>{split[1]}</SpellDamage>
          ) : (
            <SpellCoeff key={`${hotkey}${i}`}>{split[1]}</SpellCoeff>
          );
        });

      displayImg = getCorrectAbilityImg(championKey, hotkey) || displayImg;

      return {
        abilityName,
        spellName,
        displayImg,
        styledText,
        missingData,
      };
    }, [ability, championKey, hotkey, passive, t]);

  if (!champion) return null;

  const displayHtml = ReactDOMServer.renderToStaticMarkup(
    <SpellVidContainer>
      <SpellVid>
        <video loop autoPlay muted src={videoSrc} />
      </SpellVid>
      <SpellLeftVid>
        <span>{hotkey}</span>
        <img src={displayImg} />
      </SpellLeftVid>
      <SpellInfo>
        <h4>{spellName}</h4>
        {ability && (
          <SpellResources>
            <SpellResource>
              {ability.rangeBurn || ability.rangeBurn === 0 ? (
                <>
                  <SpellResourceTitle>
                    {t("lol:spell.range", "Range:")}
                  </SpellResourceTitle>{" "}
                  <SpellResourceText>{ability.rangeBurn}</SpellResourceText>
                </>
              ) : null}
            </SpellResource>
            <SpellResource>
              {ability.cooldownBurn ? (
                <>
                  <SpellResourceTitle>
                    {t("lol:spell.cooldown", "Cooldown:")}
                  </SpellResourceTitle>{" "}
                  <SpellResourceText>
                    {ability.cooldownBurn.split("/").join(" / ")}
                  </SpellResourceText>
                </>
              ) : null}
            </SpellResource>
            <SpellResource>
              {ability.costBurn ? (
                <>
                  <SpellResourceTitle>
                    {t("lol:spell.cost", "Cost:")}
                  </SpellResourceTitle>{" "}
                  <SpellResourceText>{ability.costBurn}</SpellResourceText>
                </>
              ) : null}
            </SpellResource>
          </SpellResources>
        )}
        {styledText}
        {missingData && (
          <SpellMissing>
            {t(
              "common:error.missingSpellData",
              "'?' indicates that the data isn't available via the Riot Games API. Check the LoL client for the latest values."
            )}
          </SpellMissing>
        )}
      </SpellInfo>
    </SpellVidContainer>
  );

  if (children) {
    return (
      <div data-tooltip={displayHtml} className={CssInline}>
        <img className={CssSpellImg} src={displayImg} alt="" {...restProps} />
        {children}
      </div>
    );
  }
  return (
    <img
      data-tooltip={displayHtml}
      className={CssSpellImg}
      src={displayImg}
      alt={abilityName}
      {...restProps}
    />
  );
};

export default React.memo(AbilityImg);
