import React from "react";
import { useTranslation } from "react-i18next";

import { Card, getTierColor } from "clutch";

import { winRatecolorRange } from "@/app/util.mjs";
import ChampionImg from "@/game-lol/ChampionImg.jsx";
import { ROLE_SYMBOL_TO_STR } from "@/game-lol/constants.mjs";
import getRoleIcon from "@/game-lol/get-role-icon.mjs";
import { getTierIcon } from "@/game-lol/get-tier-icon.mjs";
import {
  ChampionBlock,
  LoadingContainer,
  Row,
  Tier,
  TierGroup,
} from "@/game-lol/TierList.style.jsx";
import useChampionsTierList from "@/game-lol/use-champions-tier-list.mjs";
import useTransientLoader from "@/game-lol/use-transient-loader.mjs";
import useChampionsFilter from "@/game-lol/useChampionsFilter.jsx";
import LoadingSpinner from "@/inline-assets/loading-spinner-red.svg";
import Icon from "@/inline-assets/nav-game-guide.svg";
import Container from "@/shared/ContentContainer.jsx";
import PageHeader from "@/shared/PageHeader.jsx";
import { getLocale } from "@/util/i18n-helper.mjs";

const TierList = () => {
  const { t } = useTranslation();
  const { FilterBar, ...filterParams } = useChampionsFilter({
    isSynergiesFilter: false,
  });
  const { isLoaded, searchParams } = useTransientLoader(filterParams, false);
  const data = useChampionsTierList({ filterParams, searchParams });

  return (
    <>
      <PageHeader
        icon={<Icon />}
        title={t("common:navigation.tierList", "Tier List")}
      />
      <Container>
        <Card>
          {FilterBar}
          {!isLoaded ? (
            <LoadingContainer>
              <LoadingSpinner />
            </LoadingContainer>
          ) : (
            <ol>
              {data.map((group, index) => {
                const TierIcon = getTierIcon(index + 1);
                return (
                  <Row
                    key={index}
                    style={{ "--tier-color": getTierColor(index + 1) }}
                  >
                    <Tier>{TierIcon && <TierIcon />}</Tier>
                    <TierGroup>
                      {group
                        .sort((a, b) => b.winRate - a.winRate)
                        .map((c, i) => (
                          <Champion
                            key={`${c.championKey}_${i}`}
                            champKey={c.championKey}
                            champName={c.championName}
                            winRate={c.winRate}
                            role={ROLE_SYMBOL_TO_STR[c.role].gql}
                            params={filterParams}
                          />
                        ))}
                    </TierGroup>
                  </Row>
                );
              })}
            </ol>
          )}
        </Card>
      </Container>
    </>
  );
};

export default TierList;

const Champ = ({ champKey, champName, winRate, role, params }) => {
  const linkParams = new URLSearchParams({ ...params, role }).toString();
  const link = params
    ? `/lol/champions/${champKey}?${linkParams}`
    : `/lol/champions/${champKey}`;
  const RoleIcon = getRoleIcon(role);

  return (
    <ChampionBlock href={link}>
      <ChampionImg
        size={56}
        championKey={champKey}
        className="champion-image"
        disabled
      />
      {RoleIcon && (
        <div className="champion-role">
          <RoleIcon />
        </div>
      )}
      <p className="type-body2">{champName}</p>
      <span
        className="type-caption--bold"
        style={{ color: winRatecolorRange(winRate * 100) }}
      >
        {winRate.toLocaleString(getLocale(), {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
          style: "percent",
        })}
      </span>
    </ChampionBlock>
  );
};

const Champion = React.memo(Champ);

export function meta() {
  return {
    title: [`lol:tierlistTitle`, `League of Legends Tier List – Blitz LoL`],
    description: [
      `lol:tierlistDescription`,
      `League of Legends Meta Tier List. Check here every patch for the best champions for Solo Queue, ARAM, 3v3, & more.`,
    ],
  };
}
