import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import AgentAbilityIcon from "@/game-val/AgentAbilityIcon.jsx";
import { AGENT_ABILITY_CASTS } from "@/game-val/constants.mjs";
import orderBy from "@/util/order-array-by.mjs";

const CardContainer = styled("div")`
  position: relative;
  background: var(--shade7);
  border-radius: var(--br);

  @media screen and (max-width: 1000px) {
    margin-bottom: var(--sp-3);
  }
`;

const ListWrapper = styled("div")`
  border-radius: var(--br);
  padding: 0 0 var(--sp-2_5) 0;
`;

const RowContainer = styled("div")`
  display: flex;
  justify-content: space-around;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: var(--sp-11);
  padding: 0 var(--sp-3);
  border-radius: var(--br);

  &:nth-child(even) {
    background: var(--shade8);
  }

  .icon-container {
    margin-right: var(--sp-1_5);
  }

  .title-shade1 {
    color: var(--shade1);
  }

  .col-rank {
    flex: 0.4 1 0%;
  }
  .col-ability {
    margin-left: var(--sp-10);
    display: flex;
    align-items: center;
    flex: 3 1 0%;
  }
  .col-kills {
    flex: 0.6 1 0%;
  }
  .col-casts {
    flex: 0.6 1 0%;
  }
  .ability-name {
    text-transform: capitalize;
    display: flex;
    svg {
      width: var(--sp-8);
    }
  }
`;

export default function AbilityBreakdown({ abilityKillData, agentName }) {
  const { t } = useTranslation();
  const abilities = orderBy(Object.entries(abilityKillData), "kills", "asc");

  const getAbilityName = (abilityCast) =>
    AGENT_ABILITY_CASTS?.[agentName.replace("/", "").toLowerCase()]?.[
      abilityCast
    ];

  const StatsRow = ({ rank, ability, kills, casts }) => {
    return (
      <RowContainer>
        <div className="col-rank">
          <p className="title-shade1">{rank}</p>
        </div>
        <div className="col-ability">
          <div className="ability-name">
            <div className="icon-container">
              <AgentAbilityIcon ability={ability} />
            </div>
            <p className="type-subtitle2">{ability}</p>
          </div>
        </div>
        <div className="col-kills">
          <p className="type-body2 title-shade1">{kills}</p>
        </div>
        <div className="col-casts">
          <p className="type-body2 title-shade1">{casts}</p>
        </div>
      </RowContainer>
    );
  };

  return (
    <CardContainer>
      <ListWrapper>
        <RowContainer>
          <div className="col-rank">
            <p className="type-caption title-shade1">
              {t("common:rank", "rank")}
            </p>
          </div>
          <div className="col-ability">
            <p className="type-caption title-shade1">
              {t("common:ability", "ability")}
            </p>
          </div>
          <div className="col-kills">
            <p className="type-caption title-shade1">
              {t("common:kills", "kills")}
            </p>
          </div>
          <div className="col-casts">
            <p className="type-caption title-shade1">
              {t("common:casts", "casts")}
            </p>
          </div>
        </RowContainer>

        {abilities.map(([abilityId, abilityObj], ind) => {
          const abilityName = t("ability.name", "{{name}}", {
            name: getAbilityName(abilityId),
          });
          return (
            <StatsRow
              rank={ind + 1}
              ability={abilityName}
              kills={abilityObj?.kills || "-"}
              casts={abilityObj?.casts || 0}
              key={abilityId}
            />
          );
        })}
      </ListWrapper>
    </CardContainer>
  );
}
