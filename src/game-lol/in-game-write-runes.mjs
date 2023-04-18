import i18n from "i18next";

import { RUNE_ROWS } from "@/game-lol/constants.mjs";
import lolClient from "@/game-lol/lol-client.mjs";
import deepEqual from "@/util/deep-equal.mjs";
import { devDebug, devError } from "@/util/dev.mjs";

const MIN_RUNE_LEVEL = 10;

// TODO: i18n
const RUNE_PREFIX = "Blitz:";

export function runePageNameFormatter(data) {
  const {
    selectedChampionName,
    proPlayerName,
    opponentTeam,
    opponentChampionName,
  } = data;

  let title = `${RUNE_PREFIX} ${selectedChampionName}`;

  if (proPlayerName && opponentTeam) {
    title += ` - ${proPlayerName} ${i18n.t("lol:vs", "vs")} ${opponentTeam}`;
  } else if (proPlayerName) {
    title += ` - ${proPlayerName}`;
  } else if (opponentChampionName) {
    title += ` ${i18n.t("lol:vs", "vs")} ${opponentChampionName}`;
  }

  return title;
}

export default async function writeRunes(data) {
  const summoner = await lolClient.request(
    "get",
    "/lol-summoner/v1/current-summoner"
  );

  if (summoner.summonerLevel < MIN_RUNE_LEVEL) {
    // TODO: i18n
    throw new Error(
      `Summoner level is below minimum (${MIN_RUNE_LEVEL}) required for runes.`
    );
  }

  const payload = {
    current: true,
    name: runePageNameFormatter(data),
  };
  for (const key of ["primaryStyleId", "subStyleId", "selectedPerkIds"]) {
    payload[key] = data[key];
  }

  // Try to see if the current rune page is equal to the one we want to write.
  // If this fails, we just continue anyway
  try {
    const currentPage = await lolClient.request(
      "get",
      "/lol-perks/v1/currentpage"
    );

    if (
      ["primaryStyleId", "subStyleId", "selectedPerkIds"].every((key) => {
        return deepEqual(currentPage[key], payload[key]);
      })
    ) {
      devDebug("Same rune page, skipping import.");
      return;
    }
  } catch (error) {
    devError("RUNE CURRENT PAGE FAILED", error);
  }

  await slowWrite(payload);
}

// This function exists for reference, it is not actually used.
export async function fastWrite(payload) {
  const pages = await lolClient.request("get", "/lol-perks/v1/pages");
  const blitzPages = pages.filter((page) => page.name.startsWith(RUNE_PREFIX));

  // Write the rune page.
  if (blitzPages.length) {
    await lolClient.request(
      "put",
      `/lol-perks/v1/pages/${blitzPages[0].id}`,
      payload
    );
  } else {
    await lolClient.request("post", "/lol-perks/v1/pages", payload);
  }
}

export async function slowWrite(payload) {
  const [pages, inventory] = await Promise.all([
    lolClient.request("get", "/lol-perks/v1/pages"),
    lolClient.request("get", "/lol-perks/v1/inventory"),
  ]);

  const maxPages = inventory.ownedPageCount || 0;
  const countPages = pages.filter((page) => page.isDeletable).length;
  const blitzPages = pages.filter((page) => page.name.startsWith(RUNE_PREFIX));

  // WORKAROUND: thanks to the high engineering standards at Riot Games,
  // modifying an existing rune page using PUT doesn't update the editing UI
  // in the game client. We actually need to delete the existing page and
  // then write a new one to update the in-game editing UI.

  // We first delete all blitz pages so that we don't delete a player's rune page if we don't have to

  const removedPages = [];
  try {
    await Promise.all(
      blitzPages.map(async (blitzPage) => {
        await lolClient.request(
          "delete",
          `/lol-perks/v1/pages/${blitzPage.id}`
        );
        removedPages.push(blitzPage.id);
      })
    );
  } catch (error) {
    devError("DELETE RUNE PAGE FAILED", error);
  }

  /*
   *  Remove the rune page that has not been edited for the
   *  longest time if we hit the limit of rune pages.
   *  I am assuming that the current amount of pages MIGHT be higher than the max allowed count.
   */
  if (countPages - removedPages.length >= maxPages) {
    const deletablePages = pages
      .filter((v) => v.isDeletable && !removedPages.includes(v.id))
      .sort((a, b) => new Date(a.lastModified) - new Date(b.lastModified));

    for (const page of deletablePages) {
      try {
        await lolClient.request("delete", `/lol-perks/v1/pages/${page.id}`); // eslint-disable-line no-await-in-loop
        removedPages.push(page.id);
        // If we removed enough pages so that we're now 1 page under the max allowed amount, we can finally import ours
        if (countPages - removedPages.length < maxPages) {
          break;
        }
      } catch (error) {
        devError("DELETE RUNE PAGE FAILED", error);
      }
    }
  }

  return lolClient.request("post", "/lol-perks/v1/pages", payload);
}

export function formatRunes(build) {
  // Rune indexes:
  // primaryRune is external to runes array
  // secondary tree is only determined by which secondary runes are used
  //
  // primary tree | 2nd tree   | stat shards
  // =============|============|=============
  // primaryRune  |            |
  // 0            | 3          | 5
  // 1            | 4          | 6
  // 2            |            | 7
  //
  // Rito expects this format however:
  // - primaryStyleId: primary rune tree ID
  // - subStyleId: secondary rune tree ID
  // - selectedPerkIds: the actual rune choices indexed like above, but
  //   shifted by 1 due to primaryRune being the first one.
  const selectedPerkIds = [build.primaryRune];
  const optimalOptions = [];
  const runningStats = new Array(8).fill(-1);

  for (const { games, index, runeId, treeId, wins } of build.runes) {
    const currentWinRate = wins / games;
    if (currentWinRate > runningStats[index]) {
      runningStats[index] = currentWinRate;
      optimalOptions[index] = { runeId, treeId, row: RUNE_ROWS[runeId] };
    }
  }

  // Incidental complexity: secondary runes need special consideration
  // for being on the same tree and different row. We will try to match index 4
  // with the optimal option from index 3.
  if (
    optimalOptions[3].row === optimalOptions[4].row ||
    optimalOptions[3].treeId !== optimalOptions[4].treeId
  ) {
    let alternateOption;
    for (const { index, runeId, treeId } of build.runes) {
      if (index !== 4) continue;
      if (
        treeId === optimalOptions[3].treeId &&
        RUNE_ROWS[runeId] !== optimalOptions[3].row
      ) {
        alternateOption = { runeId, isAlternate: true };
      }
    }
    optimalOptions[4] = alternateOption;
  }

  const primaryTreeId = optimalOptions[0].treeId;
  const secondaryTreeId = optimalOptions[3].treeId;

  selectedPerkIds.push(...optimalOptions.map(({ runeId }) => runeId));

  return {
    primaryStyleId: primaryTreeId,
    subStyleId: secondaryTreeId,
    selectedPerkIds,
  };
}

// TODO: failing case of rune import
// ---
// primaryRune: 8124
// runes: [{"games":681,"index":7,"runeId":5002,"treeId":null,"wins":355},{"games":2142,"index":5,"runeId":5008,"treeId":null,"wins":1127},{"games":1499,"index":2,"runeId":8134,"treeId":8100,"wins":783},{"games":2025,"index":1,"runeId":8138,"treeId":8100,"wins":1080},{"games":1792,"index":0,"runeId":8139,"treeId":8100,"wins":937},{"games":1646,"index":7,"runeId":5003,"treeId":null,"wins":862},{"games":2272,"index":6,"runeId":5008,"treeId":null,"wins":1194},{"games":139,"index":2,"runeId":8135,"treeId":8100,"wins":74},{"games":126,"index":4,"runeId":8275,"treeId":8200,"wins":65},{"games":293,"index":2,"runeId":8106,"treeId":8100,"wins":157},{"games":325,"index":4,"runeId":8234,"treeId":8200,"wins":178},{"games":585,"index":3,"runeId":8275,"treeId":8200,"wins":323},{"games":457,"index":2,"runeId":8105,"treeId":8100,"wins":238},{"games":180,"index":3,"runeId":8242,"treeId":8400,"wins":111},{"games":721,"index":4,"runeId":8242,"treeId":8400,"wins":346},{"games":577,"index":3,"runeId":8444,"treeId":8400,"wins":279},{"games":419,"index":0,"runeId":8126,"treeId":8100,"wins":221},{"games":151,"index":4,"runeId":8451,"treeId":8400,"wins":82},{"games":321,"index":3,"runeId":8473,"treeId":8400,"wins":156},{"games":176,"index":1,"runeId":8120,"treeId":8100,"wins":81},{"games":154,"index":5,"runeId":5005,"treeId":null,"wins":76},{"games":177,"index":0,"runeId":8143,"treeId":8100,"wins":94},{"games":187,"index":1,"runeId":8136,"treeId":8100,"wins":91},{"games":225,"index":4,"runeId":8210,"treeId":8200,"wins":120}]
