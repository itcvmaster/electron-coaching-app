import { useMemo } from "react";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { MIN_STRING_DISTANCE } from "@/app/constants.mjs";
import Static from "@/game-lol/static.mjs";
import { getDerivedId, getStaticData } from "@/game-lol/util.mjs";
import stringCompare from "@/util/string-compare.mjs";

function useLoLSearch(searchedText, isEnabled) {
  const state = useSnapshot(readState);
  const champions = getStaticData("champions");
  const recentlySearchedAccounts =
    state.settings?.recentlySearchedAccounts?.lol;

  const filteredChampions = useMemo(() => {
    if (!champions || !isEnabled || !searchedText) return [];
    const { keys } = champions;
    const championsIds = Object.keys(keys);
    const lolChampionsArray = championsIds.map((id) => {
      const key = keys[id];
      const { name } = champions[key];
      return {
        name,
        key,
        champion_id: id,
        avatar: Static.getChampionImage(key),
      };
    });

    // Filter the name of the champion
    return lolChampionsArray
      .filter(
        (champion) =>
          stringCompare(searchedText, champion.name) > MIN_STRING_DISTANCE
      )
      .slice(0, 5);
  }, [searchedText, champions, isEnabled]);

  // filter user from profiles
  const filteredUsers = useMemo(() => {
    if (!isEnabled || !recentlySearchedAccounts) {
      return [];
    }

    const profileKeys = Object.keys(recentlySearchedAccounts);

    return (
      profileKeys
        .map((p) => p.split(":"))
        .map(([region, key]) => {
          const { summonerName, profileIconId } =
            recentlySearchedAccounts[getDerivedId(region, key)];
          return {
            name: summonerName,
            region,
            key,
            profileIconId,
          };
        })
        .filter(
          (user) =>
            user.region === readState.settings.riotRegion &&
            user.key.toLowerCase().startsWith(searchedText?.toLowerCase())
        ) ?? []
    );
  }, [isEnabled, recentlySearchedAccounts, searchedText]);

  const players = state.lol.pros?.teams?.players;

  const filteredPros = useMemo(() => {
    if (!isEnabled || !players) {
      return [];
    }
    const pros = Object.keys(players).map((key) => players[key]);
    return pros.filter((e) =>
      e.name.toLowerCase().includes(searchedText.toLowerCase())
    );
  }, [players, searchedText, isEnabled]);
  // return data
  return {
    filteredChampions,
    recentlySearchedAccounts,
    filteredUsers,
    filteredPros,
  };
}

export default useLoLSearch;
