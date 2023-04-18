import React, { memo } from "react";
import { styled } from "goober";

import { CaptionBold, Link } from "@/game-lol/CommonComponents.jsx";

const ChampionTitle = styled(CaptionBold)`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ChampionTextOuter = (props) => {
  const { isFromLivePage, ...restProps } = props;
  function handleClick(e) {
    if (isFromLivePage) {
      e.preventDefault();
    }
  }
  return <ChampionText {...restProps} onClick={handleClick} />;
};

const ChampionText = (props) => {
  const { champion, disabled, onClick, ...restProps } = props;

  if (!champion) return "";

  const championContent = (
    <ChampionTitle {...restProps}>
      {champion.name}
      {/* {tooltip && <HelpTooltip />} */}
    </ChampionTitle>
  );

  return disabled ? (
    <div onClick={onClick}>{championContent}</div>
  ) : (
    <Link
      href={`/lol/champions/${champion.key}`}
      onClick={onClick}
      disabled={disabled}
    >
      {championContent}
    </Link>
  );
};

export default memo(ChampionTextOuter);
