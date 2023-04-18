import lolClient from "@/game-lol/lol-client.mjs";

export default function writeSpells(spells) {
  return lolClient.request(
    "patch",
    "/lol-champ-select/v1/session/my-selection",
    {
      spell1Id: spells[0],
      spell2Id: spells[1],
    }
  );
}
