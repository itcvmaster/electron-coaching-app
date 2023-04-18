import { styled } from "goober";

import SearchResultListView from "@/app/SearchResultListView.jsx";

export const SearchHistoryList = styled("div")`
  width: 100%;
  padding: 25px 0;
`;

export const Overline = styled("div")`
  font-size: var(--sp-2_5);
  line-height: var(--sp-2_5);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--shade3);
  padding: 0 0 8px var(--sp-7);
`;

export const SearchResultsWrapper = styled("div")`
  display: flex;
  width: 100%;
`;

export const SearchResultsLeftSide = styled("div")`
  width: 100%;
  overflow: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: var(--shade8);
    border-radius: var(--br-sm);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--shade5);
    border-radius: var(--br-sm);
  }

  &::-webkit-scrollbar-corner,
  &::-webkit-resizer,
  &::-webkit-scrollbar-track-piece,
  &::-webkit-scrollbar-button {
    display: none;
  }

  & > div:nth-child(1) > div:nth-child(1) {
    .detail {
      border-radius: var(--br) 0px 0 0;
    }
    .no-detail {
      border-radius: var(--br) 5px 0 0;
    }
  }
`;

export const SearchResultsRightSide = styled("div")`
  min-width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40%;
  height: 100%;
  background: var(--shade9);
  padding: 0 var(--sp-6);
  border-radius: 0 5px 0 0;
  box-sizing: border-box;

  @media (max-width: 1440px) {
    width: 50%;
    min-width: 50%;
  }
`;

export const GameSearchResultsHeader = styled("div")`
  display: flex;
  align-items: center;
  padding: 12px 0 12px var(--sp-6);
  background: var(--shade7);
`;

export const GameIcon = styled("img")`
  width: var(--sp-5);
  height: var(--sp-5);
`;

export const GameHeaderText = styled("div")`
  font-size: var(--sp-4);
  line-height: var(--sp-5);
  color: var(--shade1);
  padding: 3px 0 0 var(--sp-2_5);
`;

export const SearchResultsList = styled(SearchResultListView)`
  padding: var(--sp-3) 0;
  border-bottom: var(--sp-px) solid var(--shade6);

  & > div:nth-child(1) {
    padding: var(--sp-2_5) 0 var(--sp-2_5) var(--sp-7);
  }
`;

export const SearchNoResult = styled("div")`
  padding: 25px 20px 0 1.875rem;
  overflow: auto;

  p {
    margin: 0;
  }
`;

export const TextDot = styled("div")`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--shade4);
  margin-right: 19px;
`;

export const ValTag = styled("div")`
  display: flex;
  margin-left: 8px;
  background: var(--shade7);
  color: var(--shade1);
  border-radius: var(--br);
  padding-left: 5px;
  padding-right: 5px;
`;
