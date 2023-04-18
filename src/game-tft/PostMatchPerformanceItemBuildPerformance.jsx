import React from "react";
import { useTranslation } from "react-i18next";
import { css, styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { appURLs } from "@/app/constants.mjs";
import ChampionImage from "@/game-tft/ChampionImage.jsx";
import { CombinedItemImage, Star } from "@/game-tft/CommonComponents.jsx";
import ItemTooltip from "@/game-tft/ItemToolTip.jsx";
import UnitTooltip from "@/game-tft/UnitToolTip.jsx";
import useSetByMatch from "@/game-tft/use-set-by-match.mjs";

function ChampionBuildPerformance({
  unit,
  rating,
  labels,
  recommendedBuild,
  userBuild,
  recommendedDamageDealt,
  recommendedDamageDealtPct,
  userDamageDealt,
  userDamageDealtPct,
  userDamageTaken,
  userDamageTakenPct,
  recommendedDamageTaken,
  recommendedDamageTakenPct,
  damageReceived,
}) {
  // Hooks
  const { t } = useTranslation();
  const state = useSnapshot(readState);
  const champions = state.tft.champions;
  const selectedSet = useSetByMatch();
  const champion = champions[unit?.champion];
  // Render
  return (
    <Grid>
      <div>
        <ChampionContent>
          <ChampionStats>
            <UnitTooltip set={selectedSet} champInfo={champion}>
              <ChampionImage
                champKey={unit?.champion}
                size={32}
                cost={champions?.[unit?.champion]?.[selectedSet]?.cost}
                set={selectedSet}
              />
            </UnitTooltip>
            <ChampionRating>
              <Champion>{unit?.champion}</Champion>
              <Rating>
                {new Array(rating).fill(Star).map((Star, idx) => (
                  <Star
                    key={idx}
                    src={`${appURLs.CDN_PLAIN}/blitz/ui/images/icons/TFT-Star${
                      /[3-9]/.test(rating) ? "Gold" : "Silver"
                    }.svg`}
                  />
                ))}
              </Rating>
            </ChampionRating>
          </ChampionStats>
          <Labels>
            {labels.map(({ label, color, bg }, idx) => (
              <Label bg={bg} color={color} key={idx}>
                {label}
              </Label>
            ))}
          </Labels>
        </ChampionContent>
      </div>
      <div>
        <ChampionRating
          className={css`
            align-items: flex-start;
          `}
        >
          <ContentBuild>
            <Content>
              <Title>
                {t("tft:postmatchInsights.yourUnit", "Your {{champion}}", {
                  champion: unit?.champion,
                })}
              </Title>
              <ChampionRating>
                <UnitTooltip set={selectedSet} champInfo={champion}>
                  <ChampionImage
                    champKey={unit?.champion}
                    size={32}
                    cost={champions?.[unit?.champion]?.[selectedSet]?.cost}
                    set={selectedSet}
                  />
                </UnitTooltip>
                <Items>
                  {userBuild
                    ? userBuild.map((item, idx) => (
                        <ItemTooltip key={idx} item={item.key}>
                          <ItemImage src={item.url} />
                        </ItemTooltip>
                      ))
                    : null}
                </Items>
              </ChampionRating>
            </Content>
            <Content>
              <Title>
                {t(
                  "tft:postmatchInsights.recommendedBuild",
                  "Recommended Build"
                )}
              </Title>
              <ChampionRating>
                <UnitTooltip set={selectedSet} champInfo={champion}>
                  <ChampionImage
                    champKey={unit?.champion}
                    size={32}
                    cost={champions?.[unit?.champion]?.[selectedSet]?.cost}
                    set={selectedSet}
                  />
                </UnitTooltip>
                <Items>
                  {recommendedBuild
                    ? recommendedBuild.map((item, idx) => (
                        <ItemTooltip key={idx} item={item.key}>
                          <ItemImage src={item.url} />
                        </ItemTooltip>
                      ))
                    : null}
                </Items>
              </ChampionRating>
            </Content>
          </ContentBuild>
          <Content
            className={css`
              flex-grow: 1;
            `}
          >
            <Title>
              {damageReceived
                ? t("tft:postmatchInsights.damageTaken", "Damage taken")
                : t("tft:postmatchInsights.dmgDealt", "Damage dealt")}
            </Title>
            <GraphGap>
              <GraphArea>
                <GraphBar
                  value={damageReceived ? userDamageTaken : userDamageDealt}
                  $comparedValue={
                    damageReceived
                      ? recommendedDamageTaken
                      : recommendedDamageDealt
                  }
                  width={
                    damageReceived ? userDamageTakenPct : userDamageDealtPct
                  }
                />
                <GraphText>
                  {damageReceived ? userDamageTaken : userDamageDealt}
                </GraphText>
              </GraphArea>
              <GraphArea>
                <GraphBar
                  value={
                    damageReceived
                      ? recommendedDamageTaken
                      : recommendedDamageDealt
                  }
                  width={
                    damageReceived
                      ? recommendedDamageTakenPct
                      : recommendedDamageDealtPct
                  }
                />
                <GraphText>
                  {damageReceived
                    ? recommendedDamageTaken
                    : recommendedDamageDealt}
                </GraphText>
              </GraphArea>
            </GraphGap>
          </Content>
        </ChampionRating>
      </div>
    </Grid>
  );
}

export default ChampionBuildPerformance;

const Labels = styled("div")({
  display: "flex",
  alignItem: "center",
  gap: "var(--sp-2)",
  flexWrap: "wrap",
});

const Label = styled("div")(({ bg, color }) => ({
  padding: "var(--sp-1) var(--sp-2)",
  color: color || "var(--shade1)",
  background: bg || "var(--shade1-15)",
  fontSize: "var(--sp-3)",
  lineHeight: "var(--sp-3)",
  borderRadius: "var(--sp-1)",
  flexShrink: 0,
  whiteSpace: "nowrap",
}));

const Box = styled("div")`
  display: flex;
  align-items: center;
`;

const ChampionContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "var(--sp-2)",
});

const ChampionStats = styled(Box)({
  gap: "var(--sp-2)",
});

const ChampionRating = styled(Box)({
  gap: "var(--sp-2)",
});

const Champion = styled("div")({
  fontSize: "var(--sp-4)",
  fontWeight: "bold",
  color: "var(--shade0)",
});

const Rating = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 0,
  flexShrink: 0,
});

const Title = styled("div")({
  letterSpacing: "1.5px",
  fontSize: "var(--sp-2_5)",
  color: "var(--shade0-75)",
  textTransform: "uppercase",
});

const Items = styled(Box)({
  gap: "var(--sp-1)",
});

const ItemImage = styled(CombinedItemImage)({
  width: "var(--sp-6) !important",
  height: "var(--sp-6) !important",
});

const ContentBuild = styled("div")({
  display: "flex",
  flexFlow: "column",
  gap: "var(--sp-2)",
});

const GraphGap = styled("div")({
  display: "flex",
  flexFlow: "column",
  gap: "38px",
  borderLeft: "1px solid var(--shade3-25)",
});

const GraphArea = styled("div")({
  height: "32px",
  width: "100%",
  display: "flex",
  gap: "var(--sp-2)",
  alignItems: "center",
});

const GraphText = styled("div")({
  fontSize: "var(--sp-3)",
  color: "var(--shade0)",
  flexShrink: 0,
});

const GraphBar = styled("div")(({ value, width, $comparedValue }) => {
  const colors = {
    red: "hsla(var(--red-hsl) / 0.25)",
    green: "hsla(var(--turq-hsl) / 0.25)",
    default: "var(--shade5)",
  };
  const highlightColors = {
    red: "var(--red)",
    green: "var(--turq)",
    default: "var(--shade3)",
  };
  let color = colors.default;
  let highlight = highlightColors.default;
  if (typeof $comparedValue === "number" && typeof value === "number") {
    if (value > $comparedValue) {
      color = colors.green;
      highlight = highlightColors.green;
    }
    if (value < $comparedValue) {
      color = colors.red;
      highlight = highlightColors.red;
    }
  }
  return {
    width: width || 0,
    height: "22px",
    background: color,
    borderRight: `2px solid ${highlight}`,
  };
});

const Content = styled("div")`
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);

  &:hover {
    filter: brightness(1.2);
  }
`;

const Grid = styled("div")`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
`;
