import React, { useCallback, useMemo, useState } from "react";
import { css, styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { PostMatchContent } from "@/game-tft/CommonComponents.jsx";
import ItemTooltip from "@/game-tft/ItemToolTip.jsx";
import StaticTFT from "@/game-tft/static.mjs";
import UnitAvatarTier from "@/game-tft/UnitAvatarTier.jsx";
import UnitToolTip from "@/game-tft/UnitToolTip.jsx";
import useSetByMatch from "@/game-tft/use-set-by-match.mjs";

function PostMatchRoundPlayerBoard({
  username,
  avatarUrl,
  traits = [],
  units = [],
  benchedUnits = [],
  benchedItems = [],
  isAlly = false,
  isEnemy = false,
  isWinner = false,
}) {
  // Hooks
  const [fieldHeight, setFieldHeight] = useState(0);
  const state = useSnapshot(readState);
  const selectedSet = useSetByMatch();
  const fieldUnitsRef = useCallback((node) => {
    if (node) {
      const { height: h } = node.getBoundingClientRect();
      setFieldHeight(h);
    }
  }, []);
  // Constants
  const type = isAlly ? "ally" : isEnemy ? "enemy" : "ally";
  const champions = state.tft.champions;
  // Memos
  const BenchedUnits = useMemo(() => {
    return (
      <PostMatchContent style={{ padding: 0, marginLeft: `${150 + 8}px` }}>
        <PlayerContent $type={type}>
          <PlayerCharacters>
            {benchedUnits.map(({ key, tier, url }, idx) => {
              const champion = champions[key];
              return (
                <UnitToolTip key={idx} set={selectedSet} champInfo={champion}>
                  <PlayerCharacter $url={url}>
                    <UnitAvatarTier tier={tier} isAvatar />
                  </PlayerCharacter>
                </UnitToolTip>
              );
            })}
          </PlayerCharacters>
          <Player>
            <PlayerAvatar $isWinner={isWinner} $url={avatarUrl} />
            <PlayerName>{username}</PlayerName>
          </Player>
        </PlayerContent>
      </PostMatchContent>
    );
  }, [
    avatarUrl,
    benchedUnits,
    champions,
    isWinner,
    selectedSet,
    type,
    username,
  ]);
  return (
    <Container>
      {isEnemy ? BenchedUnits : null}
      <Landmark>
        {fieldHeight === 0 ? null : (
          <PostMatchContent
            className={css`
              width: 150px;
              height: fit-content;
            `}
            style={!traits.length ? { opacity: 0 } : {}}
          >
            <Traits>
              {traits.map(
                (
                  {
                    // Todo: We require a full import of all Traits from blitz-web still
                    // id, type, trait,
                    title,
                    score,
                  },
                  idx
                ) => (
                  <TraitContainer key={idx}>
                    {/*<PostMatchScoreboardTrait*/}
                    {/*  type={type}*/}
                    {/*  trait={trait}*/}
                    {/*  size="medium"*/}
                    {/*/>*/}
                    <TraitContent>
                      <TraitTitle>{title}</TraitTitle>
                      {score ? <TraitScore>{score}</TraitScore> : null}
                    </TraitContent>
                  </TraitContainer>
                )
              )}
            </Traits>
          </PostMatchContent>
        )}
        <PostMatchContent
          ref={fieldUnitsRef}
          style={{ padding: 0, flex: "auto" }}
        >
          <FieldStats>
            <PlayerBorder $type={type} />
            <Stats $type={type}>
              <Tiles $type={type}>
                {units.map((row, rowIdx) => (
                  <Row key={rowIdx} $type={type}>
                    {row.map(({ id, key, url, tier, items }, idx) => {
                      if (key && champions[key]) {
                        const champion = champions[key];
                        return (
                          <UnitContainer key={idx}>
                            <UnitItems>
                              {items.map((item, idx) =>
                                item ? (
                                  <ItemTooltip item={item} key={idx}>
                                    <img
                                      src={StaticTFT.getItemImage(item)}
                                      alt={item}
                                    />
                                  </ItemTooltip>
                                ) : null
                              )}
                            </UnitItems>
                            <UnitToolTip
                              key={id}
                              set={selectedSet}
                              champInfo={champion}
                            >
                              <HexagonTileOut>
                                <HexagonTileBorder>
                                  <HexagonTile $url={url} />
                                </HexagonTileBorder>
                              </HexagonTileOut>
                            </UnitToolTip>
                            <UnitAvatarTier tier={tier} isAvatar />
                          </UnitContainer>
                        );
                      }
                      return (
                        <HexagonTileOut
                          key={idx}
                          style={{
                            background: "var(--shade7)",
                          }}
                        >
                          <HexagonTileBorder />
                        </HexagonTileOut>
                      );
                    })}
                  </Row>
                ))}
              </Tiles>
              <Items>
                {benchedItems.map(({ key, url }, idx) => (
                  <ItemTooltip item={StaticTFT.getItemImage(key)} key={idx}>
                    <Item url={url} />
                  </ItemTooltip>
                ))}
              </Items>
            </Stats>
          </FieldStats>
        </PostMatchContent>
      </Landmark>
      {isAlly ? BenchedUnits : null}
    </Container>
  );
}

export default PostMatchRoundPlayerBoard;

const Traits = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 32px;
  * {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
const TraitContainer = styled("div")`
  font-size: 12px;
  font-weight: bold;
  display: flex;
  gap: 8px;
`;
const TraitTitle = styled("div")`
  color: var(--shade0);
`;
const TraitScore = styled("div")`
  color: var(--shade3);
`;
const TraitContent = styled("div")`
  display: flex;
  flex-direction: column;
`;
const FieldStats = styled("div")`
  position: relative;
  width: 100%;
  height: 100%;
`;
const types = {
  ally: `
    background-color: var(--blue);
  `,
  enemy: `
    background-color: var(--red);
  `,
};
const PlayerBorder = styled("div")`
  position: absolute;
  z-index: 1;
  height: 100%;
  left: 0;
  top: 0;
  width: 5px;
  ${({ $type }) => types[$type]};
`;
const Stats = styled("div")`
  padding: 24px 24px 24px 29px;
  display: flex;
  overflow: auto;
  gap: 16px;
  justify-content: flex-end;
  ${({ $type }) =>
    ({
      enemy: `
        flex-flow: row;
        align-items: flex-start;
      `,
      ally: `
        flex-flow: row-reverse;
        align-items: flex-end;
      `,
    }[$type])}
`;
const Items = styled("div")`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 8px;
  flex-basis: ${28 * 3 + 8 * 2}px;
  width: ${28 * 3 + 8 * 2}px;
  height: ${28 * 4 + 8 * 3}px;
`;
const Item = styled("div")`
  width: 28px;
  height: 28px;
  border: 2px solid var(--shade5);
  background-color: var(--shade8);
  box-sizing: border-box;
  border-radius: 100%;
`;
const Row = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-direction: ${({ $type }) => ($type === "enemy" ? "row-reverse" : "row")};
  margin-top: -16px;
  &:nth-child(${({ $type }) => ($type === "enemy" ? "odd" : "even")}) {
    padding-left: 33px;
  }
`;
const Hexagon = styled("div")`
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Tiles = styled("div")`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: ${({ $type }) =>
    $type === "enemy" ? "column-reverse" : "column"};
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 16px;
`;
const HexagonTile = styled(Hexagon)`
  position: relative;
  background: var(--shade6);
  width: 40px;
  height: 40px;
  background-image: url(${({ $url }) => $url});
  background-repeat: no-repeat;
  background-size: contain;
  filter: brightness(1.2);

  &:hover {
    filter: brightness(1.4);
  }
`;
const HexagonTileBorder = styled(Hexagon)`
  background: var(--shade7);
  width: 46px;
  height: 48px;
`;
const HexagonTileOut = styled(Hexagon)`
  background: rgba(73, 180, 255, 0.1);
  width: 54px;
  height: 58px;
`;
const PlayerCharacters = styled("div")`
  display: flex;
  gap: 12px;
`;
const PlayerCharacter = styled("div")`
  width: 42px;
  height: 42px;
  background-color: var(--shade7);
  background-image: url(${({ $url }) => $url});
  background-size: cover;
  border: 2px solid var(--shade8);
  outline: 2px solid var(--shade5);
  border-radius: 5px;
  position: relative;
  box-sizing: border-box;

  &:hover {
    filter: brightness(1.4);
  }
`;
const PlayerContent = styled("div")`
  display: flex;
  align-items: center;
  overflow-x: auto;
  gap: 14px;
  padding: 6px 12px;
  height: 70px;
  ${({ $type }) =>
    $type === "ally"
      ? `
          flex-direction: row-reverse;
          justify-content: flex-end;
        `
      : `
          flex-direction: row;
          justify-content: flex-start;
        `}
`;
const PlayerAvatar = styled("div")`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: 3px solid
    ${(props) => (props.$isWinner ? "var(--shade5)" : "var(--yellow)")};
  border-radius: 100%;
  background-image: url(${({ $url }) => $url});
  background-size: cover;
`;
const PlayerName = styled("div")`
  color: var(--shade0);
  font-size: 16px;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 125px;
`;
const Player = styled("div")`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Container = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Landmark = styled("div")`
  display: flex;
  gap: 8px;
`;
const UnitContainer = styled("div")`
  position: relative;
  &:hover {
    z-index: 10;
  }
`;
const UnitItems = styled("div")`
  display: flex;
  position: absolute;
  z-index: 3;
  width: 100%;
  justify-content: center;
  top: 0;

  img {
    width: 18px;
    height: 18px;
    border: 2px solid var(--shade3);
    border-radius: var(--br);
    background: var(--shade10);
    box-sizing: border-box;

    &:hover {
      border: 2px solid var(--shade0);
    }
  }
`;
