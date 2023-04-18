import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import PostMatchBans from "@/game-lol/PostMatchBans.jsx";

const PostMatchBansContainer = styled("div")`
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin-right: var(--sp-6);
  flex-shrink: 0;
  justify-content: space-between;
`;

function PostmatchBansView(props) {
  const { t1, t2, isMyTeam, patch, champions } = props;
  const { t } = useTranslation();

  let hasBans = false;
  if (t1.bans.length > 0 || t2.bans.length > 0) {
    hasBans = true;
  }

  return (
    <PostMatchBansContainer>
      <PostMatchBans
        bans={t1.bans}
        myTeam={isMyTeam}
        patch={patch}
        champions={champions}
      />
      {hasBans && <span className="type-caption">{t("lol:bans", "BANS")}</span>}
      <PostMatchBans
        bans={t2.bans}
        myTeam={!isMyTeam}
        patch={patch}
        champions={champions}
      />
    </PostMatchBansContainer>
  );
}
export default PostmatchBansView;
