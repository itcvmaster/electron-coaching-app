import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { css } from "goober";
import { useSnapshot } from "valtio";

import { Button, ButtonGroup, Card, Select, ToggleSwitch } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import { setRoute } from "@/__main__/router.mjs";
import {
  REGION_LIST,
  ROLE_SYMBOL_TO_STR,
  ROLE_SYMBOLS,
} from "@/game-lol/constants.mjs";
import getRegionIcon from "@/game-lol/get-region-icon.mjs";
import getTranslatedTraits from "@/game-tft/get-translated-traits.mjs";
import StaticTFT from "@/game-tft/static.mjs";
import parseSearchParams from "@/util/parse-search-params.mjs";
import { useRoute } from "@/util/router-hooks.mjs";

const all = ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.all].key;

export default function useProBuildsFilter() {
  const defaultFilters = useDefaultProBuildsFilters();
  const filter = useMemo(
    () => ({
      classes: defaultFilters.classes,
      champions: defaultFilters.champion,
      origins: defaultFilters.origin,
      region: defaultFilters.region,
      top4Only: defaultFilters.top4Only,
    }),
    [defaultFilters]
  );
  const View = useMemo(() => <ProBuildsFilter {...filter} />, [filter]);
  return {
    FilterBar: View,
    ...filter,
  };
}

// UI
function ProBuildsFilter() {
  // Hooks
  const state = useSnapshot(readState);
  const { t } = useTranslation();
  const set = StaticTFT.getMatchSetByDate(new Date().toString());
  const { searchParams } = useRoute();

  // Methods
  const transformForSelect = useCallback((obj, set, initial) => {
    const result = [];
    if (initial) result.push(initial);
    const currentSet = (obj || {})[set] || obj || {};
    for (const key in currentSet) {
      result.push({
        value: currentSet[key].key,
        text: currentSet[key].name,
      });
    }
    return result;
  }, []);

  // Select options
  const regions = REGION_LIST.filter((v) => v.key !== "id1").map((v) => {
    const RegionIcon = getRegionIcon(v.key);
    return {
      value: v.key,
      text: t(v.t.name, v.t.fallback),
      icon: RegionIcon && <RegionIcon />,
    };
  });
  const classes = useMemo(
    () =>
      transformForSelect(state.tft.classes, set, {
        value: all,
        text: getTranslatedTraits(t, "allclasses"),
      }),
    [set, state.tft.classes, t, transformForSelect]
  );
  const origins = useMemo(
    () =>
      transformForSelect(state.tft.origins, set, {
        value: all,
        text: getTranslatedTraits(t, "allorigins"),
      }),
    [set, state.tft.origins, t, transformForSelect]
  );
  const champions = useMemo(
    () =>
      transformForSelect(state.tft.champions, undefined, {
        value: all,
        text: t("common.allChampions", "All Champions"),
      }),
    [state.tft.champions, t, transformForSelect]
  );

  // Selected options
  const region = useMemo(() => {
    const regionParam = searchParams.get("region");
    if (regionParam) {
      const result = REGION_LIST.find((i) =>
        new RegExp(i.key, "i").test(regionParam)
      );
      if (typeof result !== "undefined") return result.key;
    }
    return REGION_LIST[0].key;
  }, [searchParams]);
  const currentClass = useMemo(() => {
    const classParam = searchParams.get("class");
    if (classParam) {
      const result = classes.find((i) =>
        new RegExp(i.value, "i").test(classParam)
      );
      if (typeof result !== "undefined") return result.value;
    }
    return all;
  }, [classes, searchParams]);
  const origin = useMemo(() => {
    const originParam = searchParams.get("origin");
    if (originParam) {
      const result = origins.find((i) =>
        new RegExp(i.value, "i").test(originParam)
      );
      if (typeof result !== "undefined") return result.value;
    }
    return all;
  }, [origins, searchParams]);
  const champion = useMemo(() => {
    const championParam = searchParams.get("champion");
    if (championParam) {
      const result = champions.find((i) =>
        new RegExp(i.value, "i").test(championParam)
      );
      if (typeof result !== "undefined") return result.value;
    }
    return all;
  }, [champions, searchParams]);
  const top4Only = useMemo(
    () => /true/i.test(searchParams.get("top4Only")),
    [searchParams]
  );

  // Callbacks
  const handleOnFilterChange = useCallback(
    (key) => (value) => {
      const result = {
        class: currentClass,
        region,
        champion,
        origin,
        top4Only,
      };
      result[key] = value;
      return setRoute("/tft/probuilds", parseSearchParams(result));
    },
    [champion, currentClass, origin, region, top4Only]
  );

  const handleReset = () => {
    return setRoute("/tft/probuilds");
  };

  // Render
  return (
    <Card padding="var(--sp-3)" className="flex align-center gap-sp-3">
      {classes.length ? (
        <Select
          selected={currentClass}
          options={classes}
          onChange={handleOnFilterChange("class")}
        />
      ) : null}
      {origins.length ? (
        <Select
          selected={origin}
          options={origins}
          onChange={handleOnFilterChange("origin")}
        />
      ) : null}
      {champions.length ? (
        <Select
          selected={champion}
          options={champions}
          onChange={handleOnFilterChange("champion")}
        />
      ) : null}
      <Select
        selected={region}
        options={regions}
        onChange={handleOnFilterChange("region")}
      />
      <ButtonGroup>
        <Button onClick={handleReset}>{t("common:reset", "Reset")}</Button>
      </ButtonGroup>
      <div
        className={css`
          width: 100%;
          display: flex;
          justify-content: flex-end;
        `}
      >
        <ToggleSwitch
          value={searchParams.get("top4Only") === "true"}
          labelText={t("tft:top4Only", "Top 4 Only")}
          onChange={handleOnFilterChange("top4Only")}
        />
      </div>
    </Card>
  );
}

// Utility
const useDefaultProBuildsFilters = () => {
  const { searchParams } = useRoute();
  const classes = searchParams.get("class") || all;
  const champion = searchParams.get("champion") || all;
  const origin = searchParams.get("origin") || all;
  const region = searchParams.get("region") || REGION_LIST[0].key;
  const top4Only = searchParams.get("top4Only") || false;
  return {
    classes,
    champion,
    origin,
    region,
    top4Only,
  };
};
