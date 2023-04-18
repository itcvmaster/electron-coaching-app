import React from "react";
import { styled } from "goober";

import useContextMenu from "@/app/useContextMenu.jsx";

const Menu = styled("div")`
  position: fixed;
  width: calc(var(--sp-1) * 58);
  height: var(--sp-24);
  padding: var(--sp-2);
  background-color: var(--shade10);
  border-radius: var(--br-lg);
  z-index: 999;
`;

const Item = styled("div")`
  display: flex;
  gap: var(--sp-3);
  align-items: center;
  font-size: var(--sp-3_5);
  padding: var(--sp-2) var(--sp-3);
  background-color: var(--shade10);
  transition: background var(--transition);
  border-radius: var(--br-lg);
  &.disabled {
    opacity: 0.6;
  }
  &:hover {
    background-color: var(--shade8);
  }

  &.context-menu {
    @media screen and (max-width: 1348px) {
      pointer-events: none;
      color: var(--shade5);
    }
  }
`;
const ContextMenu = ({ parentRef, items = [] }) => {
  const {
    anchorPoint: { x, y },
    shouldShow,
  } = useContextMenu(parentRef);
  if (!shouldShow || !items.length) return null;
  return (
    <Menu style={{ top: y, left: x }}>
      {items.map((entry, index) => {
        const { icon, text, onClick, disabled, href } = entry;
        return (
          <Item
            key={index}
            as={href ? "a" : "div"}
            className={`context-menu ${disabled ? "disabled" : ""}`}
            onClick={disabled ? null : onClick}
            href={href}
          >
            {icon ? icon : null}
            {text ? text : null}
          </Item>
        );
      })}
    </Menu>
  );
};

export default ContextMenu;
