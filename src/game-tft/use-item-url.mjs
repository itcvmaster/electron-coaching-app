import { useCallback, useEffect } from "react";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import Static from "@/game-tft/static.mjs";
import useSetByMatch from "@/game-tft/use-set-by-match.mjs";
import isEmpty from "@/util/is-empty.mjs";

const __useItemUrlTemp = {
  current: undefined,
  count: 0,
  map: Object.create(null),
  timeoutId: undefined,
};

/**
 * * Team Fight Tactic's hook that retrieves an item URL by using the provided API
 * - Maintains a reusable/shared array after being transformed once
 * - Items that have been indexed will have faster retrievals
 * - After all instances of this hook has been retired it clears shared memory
 * @returns {{
 * getItemByKey: ((function(*=): (null))|*),
 * getItemById: ((function(*=): (null))|*),
 * getItemUrlById: ((function(*=): (string|string))|*),
 * getItemUrlByKey: ((function(*=): (string|string))|*)
 * }}
 */
export default function useItemUrl() {
  // Ref
  const ref = __useItemUrlTemp; // Don't watch as a dependency
  // Constants
  const state = useSnapshot(readState);
  const currentSet = useSetByMatch();
  const allItems = state.tft.items;
  // Effects
  useEffect(() => {
    return () => {
      if (ref.count > 0) ref.count -= 1;
      if (ref.count >= 1) return;
      if (typeof ref.timeoutId !== "undefined") {
        clearTimeout(ref.timeoutId);
      }
      setTimeout(unmount, 1e3);
    };
    /* eslint-disable-next-line */
  }, []);
  ref.count += 1;
  // Private
  const init = useCallback(() => {
    if (Array.isArray(ref.current)) return;
    if (
      typeof ref.current === "undefined" &&
      typeof allItems[currentSet] !== "undefined" &&
      typeof allItems[currentSet] === "object" &&
      !isEmpty(allItems[currentSet])
    ) {
      ref.current = Object.values(allItems[currentSet]);
    } else {
      ref.current = [];
    }
    /* eslint-disable-next-line */
  }, [allItems, currentSet]);

  function unmount() {
    if (typeof ref.current !== "undefined") {
      ref.current = undefined;
      ref.map = Object.create(null);
      ref.timeoutId = undefined;
    }
  }

  // Public
  const getItemById = useCallback(
    (itemId) => {
      init();
      const def = Object.create(null);
      if (typeof ref.current === "undefined" || typeof itemId !== "number") {
        return def;
      }
      if (typeof ref.map[itemId] !== "undefined") {
        return ref.current[ref.map[itemId]];
      }
      const currentItem = ref.current.find((item) => item.id === itemId);
      if (typeof currentItem === "undefined") {
        return def;
      }
      return currentItem;
    },
    /* eslint-disable-next-line */
    [currentSet, init]
  );

  const getItemUrlById = useCallback(
    (itemId) => {
      init();
      if (typeof ref.current === "undefined") return "";
      if (typeof itemId !== "number") return "";
      if (typeof ref.map[itemId] !== "undefined") {
        return Static.getItemImage(
          ref.current[ref.map[itemId]].key,
          currentSet
        );
      }
      const currentItem = ref.current.find((item) => item.id === itemId);
      if (typeof currentItem === "undefined") return "";
      return (
        currentItem.key && Static.getItemImage(currentItem.key, currentSet)
      );
    },
    /* eslint-disable-next-line */
    [currentSet, init]
  );

  const getItemByKey = useCallback(
    (itemKey) => {
      init();
      const def = Object.create(null);
      if (
        typeof ref.current === "undefined" ||
        typeof itemKey !== "string" ||
        itemKey === ""
      ) {
        return def;
      }
      const lower = itemKey.toLowerCase();
      if (typeof ref.map[lower] !== "undefined") {
        return ref.current[ref.map[ref.map[lower]]];
      }
      const currentItem = ref.current.find((item, idx) => {
        const result = new RegExp(item.key, "i").test(lower);
        if (result) {
          if (typeof item?.id !== "undefined") {
            ref.map[item.id] = idx;
            ref.map[lower] = item.id;
          }
          return true;
        }
        return false;
      });
      if (typeof currentItem === "undefined") return def;
      return currentItem;
    },
    /* eslint-disable-next-line */
    [init]
  );

  const getItemUrlByKey = useCallback(
    (itemKey) => {
      init();
      if (
        typeof ref.current === "undefined" ||
        typeof itemKey !== "string" ||
        itemKey === ""
      ) {
        return "";
      }
      const lower = itemKey.toLowerCase();
      if (typeof ref.map[lower] !== "undefined") {
        return Static.getItemImage(
          ref.current[ref.map[ref.map[lower]]].key,
          currentSet
        );
      }
      const currentItem = ref.current.find((item, idx) => {
        const result = new RegExp(item.key, "i").test(lower);
        if (result) {
          if (typeof item?.id !== "undefined") {
            ref.map[item.id] = idx;
            ref.map[lower] = item.id;
          }
          return true;
        }
        return false;
      });
      if (typeof currentItem === "undefined") return "";
      return Static.getItemImage(currentItem.key, currentSet);
    },
    /* eslint-disable-next-line */
    [currentSet, init]
  );

  // API
  return {
    getItemById,
    getItemUrlById,
    getItemByKey,
    getItemUrlByKey,
  };
}
