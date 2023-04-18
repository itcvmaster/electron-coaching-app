import React, { useMemo } from "react";
import { css, styled } from "goober";

import AbilityImg from "@/game-lol/AbilityImg.jsx";
import LolColor from "@/game-lol/colors.mjs";
import { Overline } from "@/game-lol/CommonComponents.jsx";
import { SKILL_HOTKEYS } from "@/game-lol/constants.mjs";
import ItemImg from "@/game-lol/ItemImg.jsx";

const StyledAbilityImg = styled(AbilityImg)`
  display: inline-block;
  margin-left: var(--sp-1);
  margin-right: var(--sp-1);
  margin-bottom: calc(var(--sp-1) * -1);
  width: var(--sp-5);
  height: var(--sp-5);
  border-radius: var(--br-sm);
`;

const StyledItemImg = styled(ItemImg)`
  display: inline-block;
  margin-left: var(--sp-1);
  margin-right: var(--sp-1);
  margin-bottom: calc(var(--sp-1) * -1);
  width: var(--sp-5);
  height: var(--sp-5);
  border-radius: var(--br-sm);
`;

const AbilityBox = styled("div")`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.875rem;
  height: 0.875rem;
  background: var(--shade10);
  right: 0.25rem;
  bottom: 0;
  border-bottom-right-radius: 3px;

  &.box-skill--1 {
    color: ${LolColor.abilities[1]};
  }
  &.box-skill--2 {
    color: ${LolColor.abilities[2]};
  }
  &.box-skill--3 {
    color: ${LolColor.abilities[3]};
  }
  &.box-skill--4 {
    color: ${LolColor.abilities[4]};
  }

  .ability-text {
    font-weight: 700;
  }
`;

const ItemContainer = css`
  padding: var(--sp-1) 0;
`;
const CssInline = css`
  display: inline;
`;
const CssRelativeInline = css`
  display: inline;
  position: relative;
`;

const InsightItem = (props) => {
  const { champion, item, ...restProps } = props;

  const renderData = useMemo(() => {
    if (!item || !item.value) return [];

    const text = item.localizedInsights?.[0]?.translation
      ? item.localizedInsights[0].translation
      : item.value;
    const values = text.split("@");
    const re = item.value.match(/@(.*?)@/g);
    const symbols = re ? re.map((s) => s.replace(/@/g, "")) : [];

    return values.map((value) => {
      if (symbols.includes(value)) {
        const splitValue = value.split("_");
        const [type] = splitValue;
        const id = splitValue[1];
        switch (type) {
          case "spell":
            if (id === "P") {
              return (
                <StyledAbilityImg champion={champion}>
                  <AbilityBox
                    className={`box-skill--${SKILL_HOTKEYS.indexOf(id) + 1}`}
                  >
                    {/* eslint-disable-next-line */}
                    <Overline className="ability-text">P</Overline>
                  </AbilityBox>
                </StyledAbilityImg>
              );
            }
            return (
              <div className={CssRelativeInline}>
                <StyledAbilityImg
                  abilityIndex={SKILL_HOTKEYS.indexOf(id)}
                  champion={champion}
                >
                  <AbilityBox
                    className={`box-skill--${SKILL_HOTKEYS.indexOf(id) + 1}`}
                  >
                    <Overline className="ability-text">{id}</Overline>
                  </AbilityBox>
                </StyledAbilityImg>
              </div>
            );
          case "item":
            return <StyledItemImg itemId={id} />;
          default:
            return null;
        }
      }
      return value;
    });
  }, [champion, item]);

  return (
    <div className={ItemContainer} {...restProps}>
      <div className="type-body2">
        {renderData.map((data, index) => (
          <div key={index} className={CssInline}>
            {data}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightItem;
