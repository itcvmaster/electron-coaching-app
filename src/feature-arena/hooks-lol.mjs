import { readState } from "@/__main__/app-state.mjs";
import getData from "@/__main__/get-data.mjs";
import blitzMessage, { EVENTS } from "@/__main__/ipc-core.mjs";
import { GAME_SYMBOL_LOL } from "@/app/constants.mjs";
import LoLSummoner from "@/data-models/lol-summoner.mjs";
import { postChallengeRecord } from "@/feature-arena/m-fetch-events.mjs";
import { leagueGameRecord } from "@/feature-arena/m-graphql-template.mjs";
import { getSummoner } from "@/game-lol/api.mjs";
import inGameState from "@/game-lol/in-game-state.mjs";
import { getDerivedId } from "@/game-lol/util.mjs";

export function onEnterGame(gameId) {
  return sendGameChallengeRecord({ gameId, postMatch: false });
}

export function onExitGame(gameId) {
  return sendGameChallengeRecord({ gameId, postMatch: true });
}

// This should be extracted into a game-agnostic function.
async function sendGameChallengeRecord({ gameId, postMatch }) {
  const {
    user,
    settings: { lastLoggedInAccount, loggedInAccounts },
  } = readState;

  // This may be reset by the time this occurs! This needs to be passed in!!!
  const { lobbyMembersByCellId } = inGameState;

  if (!(lastLoggedInAccount in loggedInAccounts.lol))
    throw new Error(`Failed to find logged in account ${lastLoggedInAccount}`);

  const [region, name] = lastLoggedInAccount.split(":");
  const profile = await getData(getSummoner({ region, name }), LoLSummoner, [
    "lol",
    "profiles",
    getDerivedId(region, name),
  ]);

  const premadePuuids = Object.values(lobbyMembersByCellId).map(
    (member) => member.puuid
  );

  // TODO(dali): I don't think this is correct.
  const bearerToken = await blitzMessage(
    EVENTS.HASH_MESSAGE,
    profile.id + user.id
  );

  return postChallengeRecord({
    gameSymbol: GAME_SYMBOL_LOL,
    query: leagueGameRecord,
    variables: {
      premadePuuids,
      postMatch,
      userAccountId: user.id,
      leagueProfileId: profile.id,
      gameId: `${gameId}`,
      region: region.toUpperCase(),
    },
    bearerToken,
  });
}
