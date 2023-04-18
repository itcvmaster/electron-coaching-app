import React from "react";
import { styled } from "goober";

import CheckIcon from "@/inline-assets/check.svg";
import CloseIcon from "@/inline-assets/close.svg";
import PillHighlightIcon from "@/inline-assets/pill-highlight.svg";
import PillShadowIcon from "@/inline-assets/pill-shadow.svg";

function PostMatchPlayerCard({ username, hp, status, url }) {
  return (
    <Card>
      <AvatarComponent url={url} hp={hp} status={status} />
      <PlayerName>{username}</PlayerName>
    </Card>
  );
}

function AvatarComponent({ url, hp, status }) {
  const PillOuter = StyledIcon(PillHighlightIcon);
  const PillInner = StyledIcon(PillShadowIcon);
  return (
    <Container>
      <AvatarBorder>
        <AvatarRing>
          <Avatar $url={url} />
        </AvatarRing>
        <Health>
          <HealthPoints>{hp}</HealthPoints>
          <PillOuter />
        </Health>
        <Status>
          <IconContainer $status={status}>
            {status === "win" ? <CheckIcon /> : <CloseIcon />}
          </IconContainer>
          <PillInner />
        </Status>
      </AvatarBorder>
    </Container>
  );
}

export default PostMatchPlayerCard;

function StyledIcon(Svg) {
  return styled(Svg)`
    position: absolute;
    left: 0;
    top: 0;
  `;
}

const Container = styled("div")`
  width: calc(32px + 42px);
  height: 42px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Circle = styled("div")`
  border-radius: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const Avatar = styled("div")`
  background-image: url(${({ $url }) => $url});
  background-size: cover;
  border-radius: 100%;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border: 2px solid var(--shade6);
  box-sizing: border-box;
`;

const AvatarBorder = styled(Circle)`
  width: 42px;
  height: 42px;
  background: var(--shade9);
  position: relative;
`;

const AvatarRing = styled(Circle)`
  width: 38px;
  height: 38px;
  background: var(--blue);
`;

const Status = styled("div")`
  width: 34px;
  height: 24px;
  position: absolute;
  left: -21px;
  top: 15px;
  z-index: 1;
`;

const Health = styled("div")`
  width: 39px;
  height: 24px;
  position: absolute;
  display: flex;
  z-index: 2;
  align-items: center;
  justify-content: center;
  left: -32px;
  top: 5px;
`;

const HealthPoints = styled("div")`
  z-index: 1;
  color: var(--shade0);
  font-size: 12px;
  padding-right: 5px;
`;

const IconContainer = styled("div")`
  position: absolute;
  z-index: 1;
  top: 13px;
  left: 8px;
  font-size: 12px;
  & > svg {
    color: ${({ $status }) =>
      $status === "win" ? "var(--blue)" : "var(--red)"};
  }
`;

const Card = styled("div")`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  justify-content: center;
`;

const PlayerName = styled("div")`
  color: var(--shade2);
  font-size: 12px;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
`;
