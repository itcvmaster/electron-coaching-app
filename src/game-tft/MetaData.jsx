import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { css } from "goober";

import { Caption } from "@/game-lol/CommonComponents.jsx";
import { MetaDataContainer } from "@/game-tft/CommonComponents.jsx";
import { TimeAgo } from "@/shared/Time.jsx";

function MetaData({ patch, createdAt }) {
  const { t } = useTranslation();
  return (
    <MetaDataContainer>
      <Caption
        className={css`
          color: var(--shade3);
        `}
      >
        <TimeAgo date={new Date(createdAt)} />
      </Caption>
      {patch && (
        <Caption>
          {t("lol:patchVersion", "Patch {{version}}", {
            version: patch,
          })}
        </Caption>
      )}
    </MetaDataContainer>
  );
}

export default memo(MetaData);
