import { styled } from "goober";

import { Card, tablet, tabletMedium } from "clutch";

export const Container = styled(Card)`
  display: flex;
  flex-direction: row;

  ${tabletMedium} {
    flex-direction: column;
  }
`;

export const Sidebar = styled("div")`
  box-sizing: border-box;
  flex-shrink: 0;
  max-height: 44rem;
  width: calc(var(--sp-1) * 89);
  padding: var(--sp-6) 0;
  padding-top: 0;
  background: var(--shade8);
  border-top-left-radius: var(--br);
  border-bottom-left-radius: var(--br);
  overflow-x: hidden;
  overflow-y: scroll;

  ${tabletMedium} {
    height: auto;
    width: auto;
  }

  &::-webkit-scrollbar-thumb {
    border-color: var(--shade8) !important;
  }

  & > ol {
    list-style: none;
  }
  & > div {
    display: flex;
    align-items: center;
    color: var(--shade3);
    padding: var(--sp-6) var(--sp-4) var(--sp-1) var(--sp-5);
  }

  & > div > svg {
    width: var(--sp-4);
    height: var(--sp-4);
    margin-right: var(--sp-1);
  }

  /* Toggle button css */
  .toggleButtons .proBtn {
    color: var(--pro-solid) !important;
  }

  .promoCopy {
    display: block !important;
    padding: var(--sp-2) var(--sp-6) var(--sp-4);
    text-align: center;
  }

  .promoCopy .title {
    margin-bottom: var(--sp-1);
    color: var(--shade0);
  }

  .promoCopy .caption {
    color: var(--shade1);
  }

  .promoCopy .caption span {
    color: var(--pro-solid);
    font-weight: 700;
  }

  /* Loader css */
  .toggleButtonsLoader {
    padding: 0 var(--sp-6) var(--sp-4);
  }

  .loader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--sp-4) var(--sp-6);
  }
  [data-active="true"] {
    background: var(--shade7);
  }

  .left {
    display: flex;
    align-items: center;
  }

  .title,
  .subtitle,
  .meta,
  .circle {
    background: var(--shade6);
    border-radius: var(--br);
  }
  .title,
  .subtitle {
    height: var(--sp-3);
  }
  .title {
    width: var(--sp-18);
    margin-bottom: var(--sp-2);
  }
  .subtitle {
    width: var(--sp-9);
  }
  .meta {
    height: var(--sp-6);
    width: var(--sp-12);
  }
  .circle {
    height: var(--sp-7);
    width: var(--sp-7);
    margin-right: var(--sp-3);
    border-radius: 50%;
  }

  /* BuildListItem css */
  .itemContainer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--sp-3) var(--sp-4) var(--sp-3) var(--sp-5);
    transition: background var(--transition), box-shadow var(--transition);
    cursor: pointer;
  }
  .itemContainer:hover {
    background: var(--shade7);
  }

  .itemContainer.selected {
    background: var(--shade7);
    box-shadow: inset 2px 0 var(--turq);
  }
  .itemContainer[data-selectable="false"]:hover {
    background: linear-gradient(
      to right,
      hsla(var(--pro-solid-hsl) / 0.025),
      hsla(var(--pro-solid-hsl) / 0.075)
    );
  }

  .left span {
    color: var(--shade3);
    margin: 0 var(--sp-0_5);
    display: inline-block;
  }
  .matchupChampion,
  .competitiveRegion {
    width: var(--sp-7);
    height: var(--sp-7);
    margin-right: var(--sp-2);
  }
  .matchupChampion {
    background: var(--shade10);
    border-radius: 50%;
  }

  .itemTitle {
    display: flex;
    align-items: center;
  }
  .itemTitle[data-selectable="false"] {
    color: var(--pro-solid);
  }
  .itemTitle svg {
    font-size: var(--sp-3);
    color: var(--pro-solid);
    margin-left: var(--sp-1);
  }
  .itemSubtitle {
    color: var(--shade1);
  }

  .buildInfo {
    display: flex;
    align-items: center;
  }

  .runes {
    position: relative;
    display: flex;
    align-items: center;
    margin-right: var(--sp-2);
  }
  .secondary {
    position: absolute;
    bottom: calc(var(--sp-1) * -1);
    right: calc(var(--sp-2) * -1);
    padding: var(--sp-1);
    background: var(--shade8);
    border-radius: 50%;
  }
  .secondary img {
    display: block;
  }
  .selected .secondary {
    background: var(--shade7);
  }
  .mythic {
    margin-right: var(--sp-2);
  }

  .winrateBadge {
    position: relative;
    padding: var(--sp-0_5) var(--sp-1_5);
    color: var(--shade1);
    color: var(--winrate-color);
  }
  .winrateBadge::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: var(--br-sm);
    background: var(--winrate-color);
    opacity: 0.15;
  }
  .winrateBadge p {
    position: relative;
  }

  .opponentChampion {
    display: flex;
    align-items: center;
  }
  .opponentChampion p {
    margin-right: var(--sp-1);
  }

  .unlockContainer {
    position: relative;
  }
  .lockedBtn {
    color: var(--pro-solid) !important;
    background: hsla(var(--pro-solid-hsl) / 0.15) !important;
  }
  .unlockBtn {
    display: none !important;
    color: var(--white) !important;
    background: var(--pro-gradient) !important;
  }
  .itemContainer[data-selectable="false"]:hover .lockedBtn {
    display: none !important;
  }
  .itemContainer[data-selectable="false"]:hover .unlockBtn {
    display: inline-flex !important;
  }
  .playerTeamImage {
    position: relative;
    margin-right: var(--sp-4);
  }
  .teamImg {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--shade7);
    width: var(--sp-5);
    height: var(--sp-5);
    border-radius: 50%;
  }
`;

export const BuildDetails = styled("div")`
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
  padding: var(--sp-6);

  .build-title {
    margin-bottom: var(--sp-2);
  }

  .build-container {
    display: flex;
    gap: var(--sp-6);

    > * {
      flex: 1;
    }

    ${tablet} {
      flex-direction: column;
    }
  }

  .mobile {
    display: none;
  }
  .desktop {
    display: block;
  }

  ${tabletMedium} {
    padding: var(--sp-2);

    .mobile {
      display: block;
    }
    .desktop {
      display: none;
    }
  }

  ${tablet} {
    padding: var(--sp-4);

    .mobile {
      display: block;
    }
    .desktop {
      display: none;
    }
  }
`;

export const ItemSeparatorContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--shade9);
  height: var(--sp-5);
  width: var(--sp-6);
`;
