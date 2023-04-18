import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { Card } from "clutch";

import PostMatchTimeline from "@/game-lol/PostmatchTimeline.jsx";
import COMBAT from "@/inline-assets/hextech-combat.svg";
import INCOME from "@/inline-assets/hextech-income.svg";
import ROLE_SUPPORT from "@/inline-assets/hextech-role-support.svg";

const AccoladeFrame = styled("div")`
  --compare-color: ${(props) => props.typecolor};
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--sp-3);
  user-select: none;

  .accolade-icon,
  .accolade-info {
    position: relative;
    z-index: 1;
  }
  .accolade-info {
    flex: 1;
  }
  .accolade-header {
    display: flex;
    align-items: flex-start;
  }

  .accolade-icon {
    box-sizing: border-box;
    padding: 6px;
    border-radius: 50%;
    background: var(--shade9);
    font-size: var(--sp-7);
    color: var(--compare-color);
    transition: var(--transition);

    svg {
      width: 28px;
    }
  }

  .accolade-caret {
    font-size: var(--sp-6);
    transition: var(--transition);
    color: var(--shade1);
    opacity: 0;
  }

  .accolade-title {
    span {
      color: var(--compare-color);
    }
  }
  .accolade-desc {
    color: var(--shade1);

    span {
      color: var(--compare-color);
      font-weight: 700;
    }
  }

  .accolade-expand-component {
    margin-top: var(--sp-6);
    margin-bottom: var(--sp-4);
  }

  .component-swap-text {
    text-decoration: underline;
    color: var(--shade1);
    padding: 0.25rem 0;
    cursor: pointer;

    &:hover {
      color: var(--shade0);
    }
  }
`;

const AccoladeItem = (props) => {
  const { title, description, svg, type } = props;
  const SvgIcon = svg;
  const typeColor = type === "good" ? "var(--blue)" : "var(--yellow)";

  return (
    <AccoladeFrame typecolor={typeColor}>
      <div className="accolade-icon">
        <SvgIcon />
      </div>
      <div className="accolade-info">
        <span className="type-caption--bold">{title}</span>
        <p className="type-caption accolade-desc">{description}</p>
      </div>
    </AccoladeFrame>
  );
};

function PostMatchAccolades(props) {
  const { t } = useTranslation();
  const {
    positivePlaystyleTags,
    negativePlaystyleTags,
    isARAM,
    timeline,
    matchData,
    account,
    currParticipant,
  } = props;
  const damageTags = ["AccoladeDmgKing", "AccoladeDmgMia"];

  const combatGood =
    positivePlaystyleTags?.filter((a) => a.category === "combat") || [];
  const combatBad =
    negativePlaystyleTags?.filter((a) => a.category === "combat") || [];
  const incomeGood =
    positivePlaystyleTags?.filter((a) => a.category === "income") || [];
  const incomeBad =
    negativePlaystyleTags?.filter((a) => a.category === "income") || [];
  const visionGood =
    positivePlaystyleTags?.filter((a) => a.category === "vision") || [];
  const visionBad =
    negativePlaystyleTags?.filter((a) => a.category === "vision") || [];

  const aramGood =
    positivePlaystyleTags?.filter((a) => !damageTags.includes(a.accolade)) ||
    [];
  const aramBad =
    negativePlaystyleTags?.filter((a) => !damageTags.includes(a.accolade)) ||
    [];

  const hasFrames = timeline?.frames?.length;
  return (
    <div className="flex column gap-sp-4">
      {(combatGood.length > 0 || combatBad.length > 0) && (
        <Card
          title={t("common:combat", "Combat")}
          headerControls={<COMBAT width={20} />}
          className="flex column gap-sp-4"
        >
          {combatGood.map((item, index) => (
            <AccoladeItem
              key={"combat_good_" + index}
              title={item.title}
              description={item.description[0]}
              svg={item.icon}
              type="good"
            />
          ))}
          {combatBad.map((item, index) => (
            <AccoladeItem
              key={"combat_bad_" + index}
              title={item.title}
              description={item.description[0]}
              svg={item.icon}
              type="bad"
            />
          ))}
        </Card>
      )}
      {(incomeGood.length > 0 || incomeBad.length > 0) && (
        <Card
          title={t("common:income", "Income")}
          headerControls={<INCOME width={20} />}
          className="flex column gap-sp-4"
        >
          {incomeGood.map((item, index) => (
            <AccoladeItem
              key={"income_good_" + index}
              title={item.title}
              description={item.description[0]}
              svg={item.icon}
              type="good"
            />
          ))}
          {incomeBad.map((item, index) => (
            <AccoladeItem
              key={"income_bad_" + index}
              title={item.title}
              description={item.description[0]}
              svg={item.icon}
              type="bad"
            />
          ))}
        </Card>
      )}
      {(visionGood.length > 0 || visionBad.length > 0) && (
        <Card
          title={t("lol:vision", "Vision")}
          headerControls={<ROLE_SUPPORT width={22} />}
          className="flex column gap-sp-4"
        >
          {visionGood.map((item, index) => (
            <AccoladeItem
              key={"vision_good_" + index}
              title={item.title}
              description={item.description[0]}
              svg={item.icon}
              type="good"
            />
          ))}
          {visionBad.map((item, index) => (
            <AccoladeItem
              key={"vision_bad_" + index}
              title={item.title}
              description={item.description[0]}
              svg={item.icon}
              type="bad"
            />
          ))}
        </Card>
      )}
      {isARAM && (aramGood.length || aramBad.length) ? (
        <Card title={t("lol:queueTypes.aram", "ARAM")}>
          {aramGood.map((item, index) => (
            <AccoladeItem
              key={"aram_good_" + index}
              title={item.title}
              description={item.description[0]}
              svg={item.icon}
              type="good"
            />
          ))}
          {aramBad.map((item, index) => (
            <AccoladeItem
              key={"aram_bad_" + index}
              title={item.title}
              description={item.description[0]}
              svg={item.icon}
              type="bad"
            />
          ))}
        </Card>
      ) : null}
      {hasFrames ? (
        <PostMatchTimeline
          timeline={timeline}
          match={matchData}
          account={account}
          currParticipant={currParticipant}
        />
      ) : null}
    </div>
  );
}

export default PostMatchAccolades;
