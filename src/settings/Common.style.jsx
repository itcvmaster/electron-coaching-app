import { styled } from "goober";

import { mobile, tablet, tabletSmall } from "clutch";

export const PageContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  z-index: 2;
`;

export const Panel = styled("div")`
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
  background: var(--shade8);
  border-radius: var(--sp-2);
  padding: var(--sp-6);
`;

export const SettingsList = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: var(--sp-15);
  position: relative;
  margin: calc(-1 * var(--sp-6)) 0;
  &:after {
    content: "";
    background: var(--shade8);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
  }
  ${tablet} {
    grid-template-columns: 1fr;
    row-gap: 0;
  }
`;

export const SettingsListItem = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--shade6);
  padding-block: var(--sp-6);
  break-inside: avoid;

  ${mobile} {
    padding: var(--sp-4) 0;
  }
`;

export const SettingsContent = styled("div")`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: var(--sp-4);
`;

export const SettingsLabel = styled("label")`
  display: block;
  max-width: 370px;
  ${mobile} {
    padding-right: var(sp-15);
  }
`;

export const SettingsDescription = styled("p")`
  color: var(--shade2);
  font-weight: 400;
  max-width: 370px;
  ${mobile} {
    margin-top: var(--sp-4);
  }
`;

export const PanelWell = styled("div")`
  display: flex;
  justify-content: space-between;
  background: var(--shade9);
  border-radius: var(--sp-2);
  padding: var(--sp-5) var(--sp-6);
  ${tabletSmall} {
    flex-direction: column;
    gap: var(--sp-4);
  }
`;
