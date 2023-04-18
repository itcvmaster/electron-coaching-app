import { readState } from "@/__main__/app-state.mjs";
import getData from "@/__main__/get-data.mjs";
import TftMatchList from "@/data-models/tft-match-list.mjs";
import TftPlayer from "@/data-models/tft-player.mjs";
import TftPostMatchExtra from "@/data-models/tft-postmatch-extra.mjs";
import { getDerivedId } from "@/game-lol/util.mjs";
import * as API from "@/game-tft/api.mjs";

async function fetchData([region, name, matchId]) {
  await Promise.all([
    getData(API.getMatchList([matchId]), TftMatchList, [
      "tft",
      "matches",
      matchId,
      "data",
    ]),
    getData(API.getPlayer(region, name), TftPlayer, [
      "tft",
      "summoners",
      getDerivedId(region, name),
    ]),
    getData(
      API.getPostMatchExtra({
        region,
        name,
        matchId: matchId.match(/_(.*?)$/)[1],
      }),
      TftPostMatchExtra,
      ["tft", "matches", matchId, "extra"]
    ),
  ]);

  const summoner = readState.tft.summoners[getDerivedId(region, name)] || {};

  const match = readState.tft.matches[matchId];
  if (match) {
    const games = match.data;
    const promises = [];
    if (!(games instanceof Error)) {
      const game = games.find((i) => i.matchid === matchId);
      if (game)
        game.players.forEach((player) => {
          promises.push(
            getData(
              API.getPlayer(region, player.summonerName),
              TftPlayer,
              ["tft", "summoners", getDerivedId(region, player.summonerName)],
              { shouldFetchIfPathExists: true }
            )
          );
        });
    }
    const matches = summoner.matchids || [];
    for (let i = 0; i < Math.min(20, matches.length); i += 1) {
      if (matches[i] === matchId) continue;
      promises.push(
        getData(API.getMatchList([matches[i]]), TftMatchList, [
          "tft",
          "games",
          matches[i],
        ])
      );
    }
    if (promises.length) await Promise.all(promises);
  }
}

export default fetchData;
