import { getAllChampionsStats } from "@/game-lol/lol-fetch-champions-data.mjs";

async function fetchData(params, searchParams) {
  await getAllChampionsStats(searchParams);
}

export default fetchData;
