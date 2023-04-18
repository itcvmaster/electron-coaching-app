import { container } from "@/game-lol/in-game-view.mjs";

export default container;

export function meta() {
  return {
    title: ["lol:liveData.inGame", "In Game"],
    description: [
      "lol:builds.autoImport.content",
      "Enable auto-importing of Items, Runes, and Summoners when you enter champion select. Set it and forget it.",
    ],
  };
}
