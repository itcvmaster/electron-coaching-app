import React, { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { mobile, mobileSmall, tablet } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import LolColor from "@/game-lol/colors.mjs";
import { Body2FormActive } from "@/game-lol/CommonComponents.jsx";
import { shardInfo, shardMap } from "@/game-lol/constants.mjs";
import RuneImg from "@/game-lol/RuneImg.jsx";
import TreeImg from "@/game-lol/TreeImg.jsx";
import { getStaticData } from "@/game-lol/util.mjs";

const Container = styled("div")`
  display: flex;

  > .primary-tree {
    padding-right: var(--sp-2);
  }
  > .secondary-tree {
    padding-left: var(--sp-2);
  }

  ${mobile} {
    width: 100%;
  }

  ${mobileSmall} {
    flex-wrap: wrap;
    align-items: flex-start;
  }
`;
const Header = styled("div")`
  display: flex;
  align-items: baseline;
  margin-bottom: var(--sp-1);

  .header-title {
    ${tablet} {
      align-self: flex-start;
    }
    ${mobile} {
      align-self: center;
    }
  }
`;

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn"t an integer) and no greater than max (or the next integer
 * lower than max if max isn"t an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const Row = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;

  &:not(:last-child) {
    margin-bottom: ${(props) => props.size * 0.4}rem;
  }

  &.row-shards {
    &:not(:last-child) {
      margin-bottom: ${(props) => props.size / 4}rem;
    }
  }

  &.row-trees {
    &:not(:last-child) {
      margin-bottom: ${(props) => props.size / 4}rem;
    }
  }
`;

const StyledRuneImg = styled(RuneImg)`
  margin-left: ${(props) => props.size * 0.125}rem;
  margin-right: ${(props) => props.size * 0.125}rem;
  border-radius: 50%;
  border: ${(props) =>
    props.activeRunes.includes(props.currRune.id)
      ? `2px solid ${LolColor.runes[props.treekey]}`
      : `2px solid var(--shade6)`};

  &.is-keystone {
    margin-left: 0;
    margin-right: 0;
    border: none;
  }

  &.is-shard {
    margin-left: var(--sp-1);
    margin-right: var(--sp-1);
    border-radius: 50%;
    border: 2px solid
      ${(props) =>
        props.activeRunes.includes(props.currRune.id)
          ? LolColor.ranks.challenger.fill
          : "var(--shade6)"};
  }
`;

const StyledTreeImg = styled(TreeImg)`
  box-sizing: border-box;
  margin: 0;
`;

function RuneTrees({
  runesList,
  shardsList,
  keystoneSize = 2.75,
  showActiveRunes,
  runesDirect,
  hideCaption,
}) {
  const { t } = useTranslation();
  const [altDirection, setAltDirection] = useState(false);
  const state = useSnapshot(readState);
  const perks = getStaticData("runes");
  const activeRunes = state.lol.live.activeRunes;

  let runeStats;
  let shardStats;

  if (showActiveRunes) {
    if (activeRunes?.runes?.length && activeRunes?.runeStatShards?.length) {
      runesDirect = [...activeRunes.runes, ...activeRunes.runeStatShards];
    }
  } else if (runesList) {
    runeStats = runesDirect || runesList;
    shardStats = runesDirect || shardsList;
  }

  const runes = runesDirect || runeStats;

  const mainTree = useMemo(
    () =>
      Array.isArray(perks) &&
      runes &&
      perks.find((tree) => tree.id === runes[0]),
    [perks, runes]
  );
  const secondTree = useMemo(
    () =>
      Array.isArray(perks) &&
      runes &&
      perks.find((tree) => tree.id === runes[5]),
    [perks, runes]
  );

  if (!perks || !runes || !mainTree || !secondTree) return null;

  if (!runesDirect && !(runeStats && shardStats && perks)) {
    return (
      <Body2FormActive>
        {t("lol:championData.runes.noData", "Not enough data for runes.")}
      </Body2FormActive>
    );
  }

  const shards = runesDirect
    ? [runesDirect[8], runesDirect[9], runesDirect[10]]
    : shardStats;
  const mainTreeKey = mainTree.key.toLowerCase();
  const secondTreeKey = secondTree.key.toLowerCase();

  const updateMainTree = (perk) => {
    // PRIMARY TREE
    const clickedTreeId = perk.id;

    const newRunes = runes.slice(0, 8);
    newRunes[0] = clickedTreeId;
    const newMainTree = perks.find((tree) => tree.id === clickedTreeId);
    [1, 2, 3, 4].forEach((v, i) => {
      const availableRunes = newMainTree.slots[i].runes;
      const randomInt = getRandomInt(0, availableRunes.length - 1);
      newRunes[v] = availableRunes[randomInt].id;
    });

    // If we select the same tree as the second tree, we need to reset the second tree to something else
    if (clickedTreeId === secondTree.id) {
      const clickedTreeIndex = perks.findIndex(
        (tree) => tree.id === clickedTreeId
      );
      const newIndex =
        clickedTreeIndex + 1 === perks.length ? 0 : clickedTreeIndex + 1;
      newRunes[5] = perks[newIndex].id;
      const newSecondTree = perks.find(
        (tree) => tree.id === perks[newIndex].id
      );
      [6, 7].forEach((v, i) => {
        const availableRunes = newSecondTree.slots[i + 1].runes;
        const randomInt = getRandomInt(0, availableRunes.length - 1);
        newRunes[v] = availableRunes[randomInt].id;
      });
    }
    // championSelect.setActiveRunes(newRunes, shards);
  };

  const updateSecondTree = (perk) => {
    // SECONDARY TREE
    const clickedTreeId = perk.id;

    const newRunes = runes.slice(0, 8);
    newRunes[5] = clickedTreeId;
    const newSecondTree = perks.find((tree) => tree.id === clickedTreeId);
    [6, 7].forEach((v, i) => {
      const availableRunes = newSecondTree.slots[i + 1].runes;
      const randomInt = getRandomInt(0, availableRunes.length - 1);
      newRunes[v] = availableRunes[randomInt].id;
    });
    // championSelect.setActiveRunes(newRunes, shards);
  };

  return (
    <div className="flex column align-center">
      {!hideCaption && (
        <Header>
          <Body2FormActive className="header-title ">
            {t("lol:runes.runes", "Runes")}
          </Body2FormActive>
        </Header>
      )}
      <Container>
        <div className="primary-tree">
          <Row className="row-trees" size={keystoneSize}>
            {perks
              .sort((a, b) => a.id - b.id)
              .map((perk, i) => (
                <StyledTreeImg
                  key={`${perk.id}-${i}`}
                  size={keystoneSize * 0.6}
                  tree={perk}
                  isActive={perk.id === mainTree.id}
                  onClick={() => {
                    updateMainTree(perk);
                  }}
                />
              ))}
          </Row>
          {[0, 1, 2, 3].map((rowIndex) => {
            const updateRune = (index) => {
              if (showActiveRunes) {
                const rowIds = mainTree.slots[rowIndex].runes.map((_) => _.id);
                const newId = rowIds[index];
                const matchIndex = runes.findIndex((id) => rowIds.includes(id));
                const newRunes = runes.slice(0, 8);
                newRunes[matchIndex] = newId;
                // championSelect.setActiveRunes(newRunes, shards);
              }
            };

            const isKeystone = rowIndex === 0;
            const runeSize = isKeystone ? keystoneSize : keystoneSize * 0.6;

            return (
              <Row key={rowIndex} size={keystoneSize}>
                {[0, 1, 2, 3].map((runeIndex) => {
                  if (mainTree.slots[rowIndex].runes.length <= runeIndex)
                    return null;
                  return (
                    <StyledRuneImg
                      size={runeSize}
                      key={runeIndex}
                      className={isKeystone && "is-keystone"}
                      treekey={mainTreeKey}
                      currRune={mainTree.slots[rowIndex].runes[runeIndex]}
                      activeRunes={[runes[1], runes[2], runes[3], runes[4]]}
                      onClick={() => updateRune(runeIndex)}
                    />
                  );
                })}
              </Row>
            );
          })}
        </div>
        <div className="secondary-tree">
          <Row className="row-trees" size={keystoneSize}>
            {perks
              .sort((a, b) => a.id - b.id)
              .filter((perk) => mainTree.id !== perk.id)
              .map((perk, i) => (
                <StyledTreeImg
                  key={`${perk.id}-${i}`}
                  tree={perk}
                  size={keystoneSize * 0.6}
                  isActive={perk.id === secondTree.id}
                  onClick={() => updateSecondTree(perk)}
                />
              ))}
          </Row>
          {[1, 2, 3].map((rowIndex) => {
            const updateRune = (index) => {
              if (showActiveRunes) {
                let rowIds = secondTree.slots[rowIndex].runes.map((_) => _.id);
                const newId = rowIds[index];
                let matchIndex = runes.findIndex((id) => rowIds.includes(id));
                const newRunes = runes.slice(0, 8);

                // Logic for handling missing rune row.
                if (!~matchIndex) {
                  const altIndex = altDirection
                    ? rowIndex === 1
                      ? 2
                      : rowIndex - 1
                    : rowIndex === 3
                    ? 2
                    : rowIndex + 1;
                  rowIds = secondTree.slots[altIndex].runes.map((_) => _.id);
                  matchIndex = runes.findIndex((id) => rowIds.includes(id));

                  // Handle alternating the direction when the empty row
                  // in question is the middle row.
                  if (
                    (matchIndex === 7 && !altDirection) ||
                    (matchIndex === 6 && altDirection)
                  )
                    setAltDirection(!altDirection);
                }

                newRunes[matchIndex] = newId;
                // championSelect.setActiveRunes(newRunes, shards);
              }
            };

            const runeSize = keystoneSize * 0.6;

            return (
              <Row key={rowIndex} size={keystoneSize}>
                {[0, 1, 2, 3].map((runeIndex) => {
                  if (secondTree.slots[rowIndex].runes.length <= runeIndex)
                    return null;
                  return (
                    <StyledRuneImg
                      size={runeSize}
                      key={runeIndex}
                      treekey={secondTreeKey}
                      currRune={secondTree.slots[rowIndex].runes[runeIndex]}
                      activeRunes={[runes[6], runes[7]]}
                      onClick={() => updateRune(runeIndex)}
                    />
                  );
                })}
              </Row>
            );
          })}
          {/* Shards */}
          {shards
            ? shardMap.map((map1, firstIndex) => {
                const updateShard = (id) => {
                  if (showActiveRunes) {
                    const newShards = shards.slice();
                    newShards[firstIndex] = Number.parseInt(id, 10);
                    // const newRunes = runes.slice(0, 8);
                    // championSelect.setActiveRunes(newRunes, newShards);
                  }
                };

                const runeSize = keystoneSize / 2.25;

                return (
                  <Row
                    key={firstIndex}
                    size={keystoneSize}
                    className="row-shards"
                  >
                    {map1.map((map2) => {
                      return (
                        <StyledRuneImg
                          size={runeSize}
                          className="is-shard"
                          key={map2}
                          treekey={"shards"}
                          currRune={shardInfo[map2].currRune}
                          activeRunes={[shards[firstIndex]]}
                          onClick={() => updateShard(map2)}
                        />
                      );
                    })}
                  </Row>
                );
              })
            : null}
        </div>
      </Container>
    </div>
  );
}

export default memo(RuneTrees);
