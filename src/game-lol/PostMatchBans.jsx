import React from "react";
import { styled } from "goober";

import ChampionImg from "@/game-lol/ChampionImg.jsx";
import { getBorderColor, getChampionKeyById } from "@/game-lol/util.mjs";

const IconContainer = styled(ChampionImg)`
  height: var(--sp-7);
  width: var(--sp-7);
  margin-left: -3px;
  margin-right: -3px;
  box-shadow: 0 0 0 3px var(--shade7);

  box-sizing: border-box;
  border: 2px solid ${({ isMe, isMyTeam }) => getBorderColor(isMe, isMyTeam)};
`;

export default function PostMatchBans(props) {
  const { bans, myTeam, patch, champions, ...restProps } = props;

  return (
    <div {...restProps} style={{ display: "flex", zIndex: 1 }}>
      {bans.map((ban, i) => {
        if (ban.championId === -1) return null;
        const championKey = getChampionKeyById(ban.championId, patch);
        if (!championKey) return null;
        const champion = champions[championKey];

        return (
          <IconContainer
            key={i}
            disabled
            size={25}
            round
            championId={ban.championId}
            championKey={championKey}
            isMyTeam={myTeam}
            border={true}
            patch={patch}
            champion={champion}
          />
        );
      })}
    </div>
  );
}
