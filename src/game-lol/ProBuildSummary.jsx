import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { css, styled } from "goober";

import { mobile, tablet } from "clutch";

import { H6, Overline, View } from "@/game-lol/CommonComponents.jsx";
import Items from "@/game-lol/Items.jsx";
import RuneImg from "@/game-lol/RuneImg.jsx";
import SkillOrder from "@/game-lol/SkillOrder.jsx";
import SummonerSpells from "@/game-lol/SummonerSpells.jsx";
import {
  aggregateMatches,
  getCurrentPatchForStaticData,
  getStaticData,
  getWinRateColor,
} from "@/game-lol/util.mjs";
import { getLocaleString } from "@/util/i18n-helper.mjs";

const CssStaringItem = css`
  justify-content: center;
  ${mobile} {
    justify-content: flex-start;
    margin-bottom: var(--sp-4);
  }
`;

const CssCommonItem = css`
  justify-content: center;
`;

const SummaryCaption = styled(Overline)`
  color: var(--shade2);
  margin-bottom: var(--sp-2);
`;

const InfoContainer = styled("div")`
  display: flex;
  justify-content: flex-start;

  ${tablet} {
    width: 100%;
    margin-bottom: var(--sp-6);
  }

  ${mobile} {
    flex-wrap: wrap;

    .rate-info {
      position: relative;
      top: calc(var(--sp-2) * -1);
      width: 100%;
      display: flex;
      justify-content: stretch;
      align-items: flex-start;
      border-bottom: var(--sp-px) solid var(--shade6);
      margin-bottom: var(--sp-2);

      & > div {
        flex: 1;
        width: 50%;
        padding: var(--sp-4) 0;
      }
      & > div:first-child {
        margin-right: var(--sp-4);
        border-right: var(--sp-px) solid var(--shade6);
      }
    }
  }
`;

const Keystones = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SummaryContainer = styled(View)`
  justify-content: space-between;
  ${tablet} {
    flex-wrap: wrap;
  }
`;

const WinRateContainer = styled(View)`
  flex-direction: column;
  margin-right: var(--sp-6);
`;

const KeystonesContainer = styled(View)`
  flex-direction: column;
  margin-right: var(--sp-6);
  text-align: center;
  ${mobile} {
    text-align: start;
  }
`;

const KeystonesContent = styled("div")`
  font-size: var(--sp-3);
  color: var(--shade3);
  letter-spacing: 1.5px;
  margin-bottom: var(--sp-2);
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
`;

const SummonersContainer = styled(View)`
  flex-direction: column;
  margin-right: var(--sp-6);
  text-align: center;
`;

const SkillOrderContainer = styled(View)`
  flex-direction: column;
  margin-right: var(--sp-6);
  text-align: center;
  ${mobile} {
    text-align: start;
  }
`;

const StartingContainer = styled(View)`
  flex-direction: column;
  margin-right: var(--sp-7);
  text-align: center;
  ${mobile} {
    width: 100%;
    text-align: start;
  }
`;
const MythicsContainer = styled(View)`
  flex-direction: column;
  margin-right: var(--sp-7);
  text-align: center;
  ${mobile} {
    text-align: start;
  }
`;
const ItemsContainer = styled(View)`
  flex-direction: column;
  text-align: center;
  ${mobile} {
    text-align: start;
  }
`;

const percentOptions = {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
};

function getKeystoneTree(keytone = "", perks = []) {
  const treeName = "";

  // Loop through trees
  for (const tree of perks) {
    // Loop through rows
    for (const runeRow of tree.slots) {
      // Loop through runes in row
      for (const rune of runeRow.runes) {
        if (rune.id === Number(keytone)) {
          return tree.key;
        }
      }
    }
  }

  return treeName;
}

const ProBuildSummary = ({ champData, itemsStaticData, matches, viewMode }) => {
  const { t } = useTranslation();

  const summaries = champData?.aggregateSummaries;
  const patch = getCurrentPatchForStaticData();
  const perks = getStaticData("runes");

  const aggregateData = useMemo(() => {
    if (champData && itemsStaticData) {
      return aggregateMatches(matches, itemsStaticData);
    }
  }, [matches, champData, itemsStaticData]);

  if (!champData || !perks || !itemsStaticData) return null;

  return (
    <SummaryContainer>
      <InfoContainer>
        {viewMode === "mobile" ? (
          <div className={"rate-info"}>
            <View>
              <SummaryCaption>{t("lol:winRate", "Win Rate")}</SummaryCaption>
              <H6
                color={getWinRateColor(aggregateData.winRate)}
                style={{ textAlign: "center" }}
              >
                {getLocaleString(aggregateData.winRate, percentOptions)}%
              </H6>
            </View>
          </div>
        ) : (
          <>
            <WinRateContainer>
              <SummaryCaption>{t("lol:winRate", "Win Rate")}</SummaryCaption>
              <H6
                style={{
                  color: getWinRateColor(aggregateData.winRate),
                  textAlign: "center",
                }}
              >
                {getLocaleString(aggregateData.winRate, percentOptions)}%
              </H6>
            </WinRateContainer>
          </>
        )}

        <KeystonesContainer>
          <KeystonesContent>
            <SummaryCaption>
              {t("lol:runes.keystones", "Keystones")}
            </SummaryCaption>
            <Keystones>
              {aggregateData.keystones.slice(0, 3).map((rune) => (
                <RuneImg
                  key={rune}
                  size={2}
                  currRune={{ id: rune }}
                  treeKey={getKeystoneTree(rune, perks).toLowerCase()}
                />
              ))}
            </Keystones>
          </KeystonesContent>
        </KeystonesContainer>
        <SummonersContainer>
          <SummaryCaption>
            {t("lol:championData.summoners", "Summoners")}
          </SummaryCaption>
          <SummonerSpells
            spells={aggregateData.summoners
              .slice(0, 2)
              .map((spellID) => Number.parseInt(spellID))}
            patch={patch}
          />
        </SummonersContainer>
        {viewMode === "mobile" && (
          <SkillOrderContainer>
            <SummaryCaption>
              {t("lol:builds.skillOrder", "Skill Order")}
            </SummaryCaption>
            <SkillOrder order={summaries?.skillOrder?.[0]?.ids || []} />
          </SkillOrderContainer>
        )}
      </InfoContainer>

      {viewMode !== "mobile" && (
        <SkillOrderContainer>
          <SummaryCaption>
            {t("lol:builds.skillOrder", "Skill Order")}
          </SummaryCaption>
          <SkillOrder order={summaries?.skillOrder?.[0]?.ids || []} />
        </SkillOrderContainer>
      )}
      <StartingContainer>
        <SummaryCaption>
          {t("lol:championData.starting", "Starting")}
        </SummaryCaption>
        <Items
          items={aggregateData.starters.slice(0, 3)}
          renderSeparator={() => {
            return <div style={{ marginRight: "var(--sp-1)" }} />;
          }}
          className={CssStaringItem}
        />
      </StartingContainer>
      <MythicsContainer>
        <SummaryCaption>
          {t("lol:championData.commonMythics", "Common Mythics")}
        </SummaryCaption>
        <Items
          items={aggregateData.mythics.slice(0, 3)}
          renderSeparator={null}
          className={CssCommonItem}
        />
      </MythicsContainer>
      <ItemsContainer>
        <SummaryCaption>
          {t("lol:championData.commonItems", "Common Items")}
        </SummaryCaption>
        <Items
          items={aggregateData.items.slice(0, 6)}
          renderSeparator={null}
          className={CssCommonItem}
          patch={patch}
        />
      </ItemsContainer>
    </SummaryContainer>
  );
};

// const Loader = () => (
//   <ContentLoader
//     height={71}
//     width={952}
//     style={{
//       background: "var(--shade7)",
//       marginBottom: -4,
//     }}
//   >
//     <rect x="10" y="20" rx="0" ry="0" width="50" height="10" />
//     <rect x="10" y="35" rx="0" ry="0" width="65" height="15" />
//     <rect x="10" y="55" rx="0" ry="0" width="50" height="10" />
//     <rect x="100" y="20" rx="0" ry="0" width="50" height="10" />
//     <rect x="100" y="35" rx="0" ry="0" width="65" height="15" />
//     <rect x="185" y="20" rx="0" ry="0" width="50" height="10" />
//     <circle cx="210" cy="50" r="15" />
//     <rect x="255" y="20" rx="0" ry="0" width="100" height="10" />
//     <rect x="270" y="35" rx="0" ry="0" width="30" height="30" />
//     <rect x="305" y="35" rx="0" ry="0" width="30" height="30" />
//     <rect x="410" y="20" rx="0" ry="0" width="100" height="10" />
//     <rect x="420" y="35" rx="0" ry="0" width="25" height="25" />
//     <rect x="450" y="35" rx="0" ry="0" width="25" height="25" />
//     <rect x="480" y="35" rx="0" ry="0" width="25" height="25" />
//     <rect x="530" y="20" rx="0" ry="0" width="100" height="10" />
//     <rect x="545" y="35" rx="0" ry="0" width="30" height="30" />
//     <rect x="580" y="35" rx="0" ry="0" width="30" height="30" />
//     <rect x="700" y="20" rx="0" ry="0" width="75" height="10" />
//     <rect x="655" y="35" rx="0" ry="0" width="30" height="30" />
//     <rect x="690" y="35" rx="0" ry="0" width="30" height="30" />
//     <rect x="725" y="35" rx="0" ry="0" width="30" height="30" />
//     <rect x="760" y="35" rx="0" ry="0" width="30" height="30" />
//     <rect x="795" y="35" rx="0" ry="0" width="30" height="30" />
//   </ContentLoader>
// );

export default ProBuildSummary;
