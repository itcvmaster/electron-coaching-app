import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { css } from "goober";

import Abilities from "@/game-lol/Abilities.jsx";
import InsightItem from "@/game-lol/InsightItem.jsx";
import MatchupWinRate from "@/game-lol/MatchupWinRate.jsx";
import { findChampionMainRole, getChampionTips } from "@/game-lol/util.mjs";

const CssTitle = (color) => css`
  color: ${color};
  font-size: 0.875rem;
  line-height: 0;
  margin-left: var(--sp-1);
`;

const InsightsList = ({
  champion,
  matchupChampion,
  matchupChampionStats,
  matchupStats,
  liveGame,
}) => {
  const { t } = useTranslation();
  const championId = champion?.id;
  const matchupChampionId = matchupChampion?.id;
  const championTips = getChampionTips();

  const currentChampionTip = useMemo(() => {
    return (
      championTips &&
      championTips.find((data) => data.championId === parseInt(championId))
    );
  }, [championTips, championId]);

  // When possible (only live game) we proceed to find the champion main role
  const mainRole = useMemo(
    () => matchupChampionId && findChampionMainRole(matchupChampionStats),
    [matchupChampionStats, matchupChampionId]
  );

  // We then use the role to find the matchup stats
  const matchupStat = useMemo(() => {
    if (matchupChampionId && mainRole && matchupStats[matchupChampionId]) {
      return matchupStats[matchupChampionId].find((matchup) => {
        return (
          matchup.opponent_champion_id === championId &&
          matchup.role === mainRole
        );
      });
    }
    return null;
  }, [matchupChampionId, mainRole, matchupStats, championId]);

  return (
    <div className="flex column gap-sp-4">
      {!currentChampionTip && (
        <p className="type-body2">
          {t(
            "lol:tips.noTips24Hours",
            'No tips for this champ yet. We"ll have it added within 24 hours.'
          )}
        </p>
      )}
      {matchupChampion && (
        <MatchupWinRate
          matchupStat={matchupStat}
          enemyChampion={champion}
          champion={matchupChampion}
        />
      )}
      {liveGame ? <Abilities championId={championId} /> : null}
      {currentChampionTip &&
        currentChampionTip.tips.insights &&
        currentChampionTip.tips.insights.length > 0 && (
          <div>
            <div className="flex align-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.173 7.25026C19.5967 6.27385 18.445 5.74596 16.796 5.74596C16.4029 5.74596 15.9848 5.77216 15.5399 5.82533C14.7019 3.79237 13.4458 2.5 12.0057 2.5C10.5656 2.5 9.30948 3.79237 8.47147 5.82431C8.02661 5.77113 7.60747 5.74493 7.21535 5.74493C5.56634 5.74493 4.38793 6.27282 3.83834 7.24923C3.13181 8.48945 3.60266 10.2314 4.93828 11.9995C3.60343 13.7676 3.10582 15.5095 3.83834 16.7497C4.41468 17.7262 5.56634 18.254 7.21535 18.254C7.60849 18.254 8.02661 18.2278 8.47147 18.1747C9.30948 20.2338 10.5656 21.5 12.0057 21.5C13.4458 21.5 14.7019 20.2066 15.5399 18.1747C15.9848 18.2278 16.4039 18.254 16.796 18.254C18.445 18.254 19.6234 17.7262 20.173 16.7497C20.8796 15.5095 20.4087 13.7676 19.0731 11.9995C20.4087 10.2324 20.8796 8.49048 20.173 7.25026ZM16.77 6.80174C18.0002 6.80174 18.8901 7.14494 19.2573 7.77789C19.7022 8.54366 19.3888 9.81008 18.3676 11.1826C17.818 10.5756 17.1632 9.99452 16.4306 9.41474C16.3252 8.49048 16.142 7.6456 15.8803 6.85389C16.1939 6.82769 16.5084 6.80174 16.77 6.80174ZM13.7851 15.1152C13.1831 15.4584 12.6067 15.7754 12.0057 16.0395C11.4036 15.7754 10.8273 15.4584 10.2262 15.1152C9.62389 14.772 9.07456 14.4029 8.55097 14.0335C8.47249 13.4003 8.4465 12.7401 8.4465 12.0275C8.4465 11.3152 8.47249 10.655 8.55097 10.0218C9.07456 9.65236 9.62389 9.28322 10.2262 8.94002C10.8283 8.59683 11.4046 8.27984 12.0057 8.01576C12.6078 8.27984 13.1841 8.59683 13.7851 8.94002C14.3875 9.28322 14.9368 9.65236 15.4604 10.0218C15.5389 10.655 15.5649 11.3152 15.5649 12.0275C15.5649 12.7401 15.5389 13.4003 15.4604 14.0335C14.9378 14.3756 14.3875 14.745 13.7851 15.1152ZM15.2512 15.4312C15.1468 15.9853 15.0153 16.487 14.8581 16.9614C14.3605 16.8561 13.8639 16.6976 13.3403 16.5391C13.6549 16.3806 13.9953 16.1959 14.3087 16.0112C14.6232 15.8275 14.9378 15.6431 15.2512 15.4312ZM10.6711 16.5401C10.1475 16.7248 9.64988 16.8571 9.15329 16.9624C8.99609 16.488 8.86563 15.9863 8.76015 15.4322C9.07456 15.6431 9.38821 15.8286 9.70262 16.0133C10.016 16.1969 10.3564 16.3816 10.6711 16.5401ZM7.42453 13.1092C7.0054 12.7401 6.61328 12.3707 6.29886 12.0005C6.63927 11.6311 7.0054 11.262 7.42453 10.8918C7.39854 11.261 7.39854 11.6303 7.39854 12.0005C7.39854 12.3699 7.42453 12.739 7.42453 13.1092ZM8.76015 8.56986C8.86461 8.01576 8.99609 7.51407 9.15329 7.03961C9.6509 7.14494 10.1475 7.30343 10.6711 7.46193C10.3564 7.62042 10.016 7.80512 9.70262 7.98982C9.38821 8.17349 9.07354 8.35793 8.76015 8.56986ZM13.3403 7.4609C13.8639 7.2762 14.3615 7.14391 14.8581 7.03859C15.0153 7.51305 15.1457 8.01474 15.2512 8.56883C14.9368 8.35793 14.6232 8.17246 14.3087 7.98776C13.9953 7.80409 13.6549 7.6194 13.3403 7.4609ZM16.5868 10.8918C17.006 11.261 17.3981 11.6303 17.7125 12.0005C17.3721 12.3699 17.006 12.739 16.5868 13.1092C16.6128 12.7401 16.6128 12.3707 16.6128 12.0005C16.6128 11.6311 16.5868 11.262 16.5868 10.8918ZM12.0057 3.55553C12.8954 3.55553 13.8122 4.45256 14.493 6.03598C13.6817 6.22068 12.8437 6.48449 12.0057 6.85389C11.1677 6.51069 10.3307 6.22068 9.51841 6.03598C10.1992 4.45256 11.116 3.55553 12.0057 3.55553ZM4.75508 7.77789C5.12122 7.14494 5.98522 6.80174 7.24236 6.80174C7.53002 6.80174 7.81844 6.82769 8.13209 6.85492C7.89615 7.64663 7.71296 8.49151 7.58276 9.41474C6.85023 9.99555 6.19517 10.5756 5.64583 11.1826C4.62361 9.81008 4.3092 8.54366 4.75508 7.77789ZM7.24134 17.1993C6.01121 17.1993 5.12122 16.8561 4.75406 16.2231C4.3092 15.4574 4.62259 14.1909 5.6438 12.8184C6.19338 13.4254 6.8482 14.0065 7.58072 14.5863C7.71194 15.5105 7.89513 16.3806 8.13005 17.1461C7.81742 17.1733 7.50301 17.1993 7.24134 17.1993ZM12.0057 20.4455C11.116 20.4455 10.1992 19.5485 9.51841 17.965C10.3297 17.7804 11.1677 17.5165 12.0057 17.1471C12.8437 17.4903 13.6807 17.7804 14.493 17.965C13.8122 19.5485 12.8954 20.4455 12.0057 20.4455ZM19.2563 16.2231C18.8901 16.8561 18.0261 17.1993 16.769 17.1993C16.4813 17.1993 16.1929 17.1733 15.8793 17.1461C16.1152 16.3544 16.2984 15.5095 16.4286 14.5863C17.1611 14.0055 17.8162 13.4254 18.3655 12.8184C19.3878 14.1909 19.7022 15.4574 19.2563 16.2231Z"
                  fill="#24E8CC"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.0057 10.2324C11.0372 10.2324 10.252 11.0241 10.252 12.0005C10.252 12.9769 11.0372 13.7687 12.0057 13.7687C12.9741 13.7687 13.7594 12.9769 13.7594 12.0005C13.7594 11.0241 12.9741 10.2324 12.0057 10.2324ZM12.0057 12.7129C11.6125 12.7129 11.2991 12.3959 11.2991 12.0005C11.2991 11.6042 11.6136 11.2882 12.0057 11.2882C12.3988 11.2882 12.7122 11.6052 12.7122 12.0005C12.7122 12.3969 12.3988 12.7129 12.0057 12.7129Z"
                  fill="#24E8CC"
                />
              </svg>
              <span className={CssTitle("#24e8cc")}>
                {t("lol:tips.keyInsights", "Key Insights")}
              </span>
            </div>
            {currentChampionTip.tips.insights.map((item, i) => (
              <InsightItem key={i} champion={champion} item={item} />
            ))}
          </div>
        )}
      {currentChampionTip &&
        currentChampionTip.tips.strengths &&
        currentChampionTip.tips.strengths.length > 0 && (
          <div>
            <div className="flex align-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.8165 6.73315C16.2469 6.12195 15.6304 5.53487 15.0373 4.97322C14.3022 4.28836 13.5668 3.58035 12.9022 2.82148C12.7118 2.60113 12.4278 2.47889 12.1188 2.50301C11.8347 2.52713 11.5491 2.69924 11.4071 2.94372C10.3629 4.60651 10.3395 6.9535 11.3356 9.0557C11.4305 9.25161 11.5257 9.42241 11.6196 9.61832C11.7382 9.8628 11.8569 10.1073 11.9755 10.3276C12.2598 10.9874 12.2361 11.6964 11.904 12.2593C11.5481 12.8705 10.3833 13.1887 9.64817 13.0665C9.0551 12.9687 8.32001 12.5534 8.12959 11.6977C8.10618 11.5755 8.10618 11.405 8.10618 11.2087C8.153 10.4512 8.2248 9.61963 8.29628 8.96019C8.32001 8.5449 8.36808 8.17818 8.39149 7.90828C8.43862 7.3952 8.46329 7.07672 8.10745 6.83224C7.89363 6.68588 7.60927 6.66176 7.39576 6.784C6.94471 7.02848 6.58887 7.3952 6.2811 7.71367L6.23429 7.76191C3.81487 10.2807 3.29234 14.3628 5.00102 17.443C6.2577 19.9109 9.46242 21.5 12.214 21.5C12.3092 21.5 12.4278 21.5 12.523 21.5C15.3697 21.3778 18.0741 19.4956 19.284 16.8549C19.9486 15.388 20.1611 13.7249 19.8771 12.1854C19.5681 10.3505 18.5473 8.59086 16.8165 6.73315ZM18.0027 16.218C17.0054 18.3941 14.7767 19.935 12.4512 20.0331C10.1257 20.1309 7.27841 18.8107 6.13908 16.7327C4.85773 14.4101 5.14335 11.3056 6.77897 9.22748C6.73215 9.81456 6.68408 10.474 6.63695 11.1096C6.61354 11.4519 6.63695 11.745 6.68408 12.0136C6.96812 13.31 8.01224 14.2879 9.36508 14.5066C10.6932 14.727 12.4278 14.1399 13.0677 13.0156C13.6139 12.0618 13.6841 10.8394 13.2097 9.76371C13.0911 9.49478 12.9491 9.22618 12.8304 8.95628C12.7352 8.78579 12.665 8.61368 12.5698 8.4432C11.9049 7.04999 11.8113 5.50945 12.2858 4.3353C12.8551 4.94649 13.4719 5.50945 14.065 6.0711C14.6343 6.6083 15.2274 7.17125 15.7971 7.758C17.3391 9.39569 18.2165 10.9121 18.5018 12.4276C18.7144 13.6767 18.5473 15.0213 18.0027 16.218Z"
                  fill="#FF5859"
                />
              </svg>
              <span className={CssTitle("#ff5859")}>
                {t("lol:tips.strengths", "Strengths")}
              </span>
            </div>
            {(currentChampionTip.tips.strengths || []).map((item, i) => (
              <InsightItem key={i} champion={champion} item={item} />
            ))}
          </div>
        )}
      {currentChampionTip &&
        currentChampionTip.tips.weaknesses &&
        currentChampionTip.tips.weaknesses.length > 0 && (
          <div>
            <div className="flex align-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 19.9167C16.3708 19.9167 19.9167 16.3708 19.9167 12C19.9167 7.62916 16.3708 4.08333 12 4.08333C7.62916 4.08333 4.08333 7.62916 4.08333 12C4.08333 16.3708 7.62916 19.9167 12 19.9167ZM12 21.5C6.74376 21.5 2.5 17.2562 2.5 12C2.5 6.74376 6.74376 2.5 12 2.5C17.2562 2.5 21.5 6.74376 21.5 12C21.5 17.2562 17.2562 21.5 12 21.5ZM15.8794 16.75C15.531 15.0708 14.1542 13.5833 12 13.5833C9.84582 13.5833 8.46896 15.0708 8.12062 16.75H15.8794ZM16.2915 7.39187L17.3998 8.5002L16.2832 9.61677L17.3998 10.7333L16.275 11.8581L15.1584 10.7416L14.0436 11.8564L12.9352 10.7481L14.0501 9.63323L12.9335 8.51667L14.0583 7.39187L15.1749 8.50843L16.2915 7.39187ZM9.9499 9.63323L11.0648 10.7481L9.95644 11.8564L8.84157 10.7416L7.725 11.8581L6.6002 10.7333L7.71677 9.61677L6.6002 8.5002L7.70853 7.39187L8.8251 8.50843L9.94167 7.39187L11.0665 8.51667L9.9499 9.63323Z"
                  fill="#EFBF6C"
                />
              </svg>
              <span className={CssTitle("#f3ca4e")}>
                {t("lol:tips.weaknesses", "Weaknesses")}
              </span>
            </div>
            {(currentChampionTip.tips.weaknesses || []).map((item, i) => (
              <InsightItem key={i} champion={champion} item={item} />
            ))}
          </div>
        )}
    </div>
  );
};

export default InsightsList;
