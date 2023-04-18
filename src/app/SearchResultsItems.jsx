// EXEMPT
import React, { useCallback, useEffect, useMemo } from "react";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import {
  SearchIconContainer,
  SearchItemContainer,
} from "@/app/SearchResultsItems.style.jsx";
import { SearchChampionImg } from "@/game-lol/ChampionImg.jsx";
import Search from "@/inline-assets/search.svg";

// Champion item
export function ChampionItem(props) {
  const { cursor, position, champion, passSubmit, setFocusedItem } = props;

  const active = cursor === position;
  const mOverCallback = useCallback(() => {
    setFocusedItem(position);
  }, [position, setFocusedItem]);
  const mDownCallback = useCallback(() => {
    passSubmit({ type: "champion" });
  }, [passSubmit]);

  return (
    <SearchItemContainer
      className={active ? "active" : ""}
      onMouseOver={mOverCallback}
      onMouseDown={mDownCallback}
    >
      <SearchChampionImg championAvatar={champion.avatar} size={24} />
      <p className="type-body2" style={{ paddingLeft: 9 }}>
        {champion.name}
      </p>
    </SearchItemContainer>
  );
}

// Pro item
export function ProItem(props) {
  const { cursor, isEntered, passSubmit, position, pro, setFocusedItem } =
    props;
  const accMapped = useMemo(() => {
    if (!(pro.accounts && pro.accounts.length)) return undefined;
    const region = pro.accounts[0].split("_")[0];
    return { id: pro.accounts[0].substr(region.length + 1), region };
  }, [pro]);

  const state = useSnapshot(readState);
  const allAccounts = state.lol.accounts;

  const acc = useMemo(() => {
    for (const regionKey in allAccounts) {
      const regionAccounts = allAccounts[regionKey];

      for (const accKey in regionAccounts) {
        const account = regionAccounts[accKey];
        const contained = pro.accounts.find((acc) =>
          acc.includes(account?.accountId)
        );
        if (account && account.name && pro) {
          if (
            contained &&
            account.name.toLowerCase() === pro.name.toLowerCase()
          ) {
            return account;
          }
          if (
            contained &&
            account.name.toLowerCase().includes(pro.name.toLowerCase())
          ) {
            return account;
          }
        }
        if (accMapped.id === account?.accountId) {
          return account;
        }
      }
    }
  }, [accMapped.id, allAccounts, pro]);

  useEffect(() => {
    const redirect = () => {
      const account = acc;
      /* ||
        (
          await getSummonerByAccountId(accMapped.id, accMapped.region)
        ); */
      if (account)
        passSubmit({
          type: "pro",
          profileUrl: `/lol/profile/${account?.region}/${account?.name}`,
        });
    };
    if (isEntered) redirect();
  }, [acc, accMapped.id, accMapped.region, isEntered, passSubmit]);

  const active = cursor === position;

  const mOverCallback = useCallback(() => {
    setFocusedItem(position);
  }, [position, setFocusedItem]);

  const mDownCallback = useCallback(() => {
    if (!acc || !acc.region || !acc.name) return;
    passSubmit({
      type: "pro",
      profileUrl: `/lol/profile/${acc?.region}/${acc?.name}`,
    });
  }, [acc, passSubmit]);

  return (
    <SearchItemContainer
      className={active ? "active" : ""}
      onMouseOver={mOverCallback}
      onMouseDown={mDownCallback}
    >
      <img
        src={pro.profile_image_url}
        css={`
          height: var(--sp-6);
          width: auto;
          border-radius: 50%;
        `}
      />
      <p
        className="type-body2"
        css={`
          padding-left: 9px;
        `}
      >
        {pro.name}
      </p>
    </SearchItemContainer>
  );
}

// User item
export function UserItem(props) {
  const { cursor, position, user, passSubmit, setFocusedItem } = props;
  const active = cursor === position;
  const mOverCallback = useCallback(() => {
    setFocusedItem(position);
  }, [position, setFocusedItem]);
  const mDownCallback = useCallback(() => {
    passSubmit(position);
  }, [position, passSubmit]);

  return (
    <SearchItemContainer
      className={active ? "active" : ""}
      onMouseOver={mOverCallback}
      onMouseDown={mDownCallback}
    >
      <SearchIconContainer>
        <Search />
      </SearchIconContainer>

      <p className="type-body2">{user}</p>
    </SearchItemContainer>
  );
}
