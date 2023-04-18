import { styled } from "goober";

export const MatchesNotFoundContainer = styled("div")`
  padding: var(--sp-12) 0;
  margin-top: var(--sp-8);
`;

export const MatchTileContainer = styled("div")`
  position: relative;
  border-bottom: 1px var(--shade10) solid;
  height: ${({ $height }) => ($height ? `${$height}px` : "auto")};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--shade6);
  }

  & > * {
    width: 100%;
  }
`;

export const MatchInfoContainer = styled("div")`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const MatchInfoSummary = styled("div")`
  display: flex;
  align-items: center;
  color: var(--shade2);
  flex: 3;
  justify-content: flex-end;

  .role-icon {
    font-size: var(--sp-4_5);
  }

  .role-name {
    margin-left: var(--sp-1);
  }
`;

export const MatchTitle = styled("div")`
  --outcome-color: var(--shade3);
  color: var(--outcome-color);

  &.title_won {
    --outcome-color: var(--turq);
  }
  &.title_lost {
    --outcome-color: var(--red);
  }
  &.title_mvp {
    --outcome-color: var(--yellow, var(--shade3));
  }
  display: flex;
  justify-content: space-between;
`;

export const RankPoints = styled("div")`
  color: ${(props) => props.color};
  display: flex;
  justify-content: center;
  flex: 1;
  align-items: center;
`;

export const MatchStats = styled("div")`
  display: flex;
  justify-content: space-between;
  margin-top: var(--sp-4);

  .match-kda {
    min-width: calc(var(--sp-px) * 108);
  }
  .match-vision,
  .match-cs,
  .match-dmg {
    display: flex;
    flex: 2;
  }

  .match-dmg {
    .match-description {
      min-width: calc(var(--sp-px) * 110);
    }
  }
`;

export const MatchListEmptyContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(var(--sp-22) * 3);

  svg {
    width: 6rem;
    height: 6rem;
  }
`;

export const ProfileContainer = styled("div")`
  display: flex;
  gap: var(--sp-4);
  margin: 0 0 var(--sp-8);
`;

export const ProfileBox = styled("div")`
  border-radius: var(--br-lg);
  background: var(--shade7);
  padding: var(--sp-4);
  display: flex;
  flex-direction: column;
  justify-content: center;

  .placeholder {
    text-align: center;
    color: var(--shade4);
    &:before {
      content: "< ";
    }
    &:after {
      content: " >";
    }
  }

  &.match-list {
    padding: 0;
  }
`;

export const ProfileColumn = styled("div")`
  &.sidebar {
    flex: 1;
    min-width: 0;
  }
  &.main {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
    flex: 2;
  }
`;

export const MatchHeader = styled("div")`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  position: sticky;
  z-index: 3;
  height: 76px;
  top: 96px;

  border-radius: var(--br-lg);
  background: var(--shade7);
  padding: var(--sp-4);
  margin: 0 0 var(--sp-4);
`;

export const CardContainer = styled("div")`
  position: relative;
  background: var(--shade7);
  border-radius: var(--br);
  margin-bottom: var(--sp-4);

  @media screen and (max-width: 1000px) {
    margin-bottom: var(--sp-3);
  }
`;

export const CardHeader = styled("div")`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: inset 0 -1px var(--shade3-15);
  background: var(--shade7)
    linear-gradient(to top, var(--shade5-15) 0%, transparent 100%);
  border-radius: var(--br);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding: 0 var(--sp-6);
  min-height: var(--sp-14);

  .arrow {
    width: 1rem;
    margin: 0 0.75rem;
    fill: var(--shade2);
  }

  > * {
    position: relative;
  }

  .header-contents {
    position: relative;
  }

  @media screen and (max-width: 1024px) {
    padding: 0 var(--sp-4);
  }
`;

export const HeaderLink = styled("a")`
  display: flex;
  align-items: center;
  width: 100%;

  &:hover {
    svg {
      transform: translateX(2px);
    }
  }

  svg {
    height: var(--sp-6);
    width: var(--sp-6);
    margin-left: var(--sp-3);
    color: var(--shade0);
    transition: var(--transition);
  }
`;

export const StatsArea = styled("div")`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sp-4) var(--sp-6);
  padding-bottom: 1rem;
  text-transform: capitalize;
`;

export const StatLine = styled("div")`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  .stat-name {
    color: var(--shade2);
  }
  .hs-stat {
    display: flex;
    color: var(--shade2);
  }
`;
