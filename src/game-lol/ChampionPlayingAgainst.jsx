import React from "react";
import { Trans, useTranslation } from "react-i18next";

import { Card } from "clutch";

import InsightsList from "@/game-lol/InsightsList.jsx";

const EmptyContent = () => {
  const { t } = useTranslation();
  return (
    <p className="type-body2">
      {t("lol:notFound.insights", "No insights data found for this champion.")}
    </p>
  );
};

const ChampionPlayingAgainst = (props) => {
  const { champion, championStats, matchups } = props;

  return (
    <Card
      title={
        <Trans i18nKey="lol:playingAgainstChampion" champion={champion?.name}>
          Playing against <span>{{ champion: champion?.name }}</span>
        </Trans>
      }
    >
      {!champion ? (
        <EmptyContent />
      ) : (
        <InsightsList
          champion={champion}
          championStats={championStats}
          matchupStats={matchups}
        />
      )}
    </Card>
  );
};

export default ChampionPlayingAgainst;
