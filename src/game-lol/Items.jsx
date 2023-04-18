import React from "react";
import { styled } from "goober";

import { Overline, View } from "@/game-lol/CommonComponents.jsx";
import ItemImg from "@/game-lol/ItemImg.jsx";
import ChevronRight from "@/inline-assets/chevron-right.svg";
import { formatGameTime } from "@/util/helpers.mjs";

const ListItemContainer = styled("div")`
  display: flex;
  flex-direction: column;
`;

const ItemObjWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--shade9);
  border-radius: var(--br);
  margin-bottom: var(--sp-2);
  padding: 0.25rem;
`;

const ItemObjTimestamp = styled(Overline)`
  letter-spacing: 0;
`;

const SpaceSeparator = styled("div")`
  width: var(--sp-2);
`;

const List = styled("div")`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  row-gap: var(--sp-2);

  svg {
    background: var(--shade10);
  }
`;

export const ItemOrder = ({ items, itemStyle, size = 1.75, patch }) => {
  return (
    <List>
      {items.map((item, i) => (
        <div key={`${item}_${i}`} className="flex align-center">
          <ItemImg
            borderRadius={5}
            size={size}
            style={itemStyle}
            itemId={item}
            patch={patch}
          />
          {i !== items.length - 1 && <ChevronRight />}
        </div>
      ))}
    </List>
  );
};

const Items = ({
  items,
  renderSeparator,
  itemStyle,
  itemContainerStyle,
  size = 1.75,
  hideEmpty = true,
  patch,
  ...restProps
}) => {
  if (!items) return null;
  const first = new Array(...items);

  // we need to fill to 6 items to show empty item box.
  if (first.length < 6 && !hideEmpty) {
    first.push(...new Array(6 - first.length).fill(null));
  }

  const getItem = (item, idx) => {
    if (!item && !hideEmpty) {
      return <ItemImg key={idx} borderRadius={5} size={size} patch={patch} />;
    } else if ((!item || item === "0") && hideEmpty) {
      return null;
    }
    if (Array.isArray(item)) {
      return item.map((subItem, i) => {
        return (
          <div
            key={`${idx}_${i}`}
            className="flex align-center"
            style={itemContainerStyle}
          >
            <ItemImg
              borderRadius={5}
              size={size}
              style={
                itemStyle || {
                  marginTop: "6px",
                  boxShadow: "0 0 0 4px var(--shade8)",
                  marginRight: i === item.length - 1 ? "0" : "-4px",
                }
              }
              itemId={subItem}
              patch={patch}
            />
          </div>
        );
      });
    }
    if (typeof item === "object") {
      return (
        <ItemObjWrapper key={idx}>
          <View>
            {item.ids.map((subItem, i) => {
              return (
                <div
                  key={i}
                  className="flex align-center"
                  style={itemContainerStyle}
                >
                  <ItemImg
                    size={size}
                    style={
                      itemStyle || {
                        marginRight: i === item.ids.length - 1 ? "0" : "4px",
                      }
                    }
                    itemId={subItem}
                    patch={patch}
                  />
                </div>
              );
            })}
          </View>
          <ItemObjTimestamp>{formatGameTime(item.ts / 1000)}</ItemObjTimestamp>
        </ItemObjWrapper>
      );
    }

    return (
      <View key={idx} style={itemContainerStyle}>
        <ItemImg
          size={size}
          borderRadius={5}
          itemId={Number.parseInt(item)}
          patch={patch}
        />
      </View>
    );
  };

  return (
    <View {...restProps}>
      <ListItemContainer style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {first.map((item, idx) => {
          return (
            <>
              {getItem(item, idx)}
              {renderSeparator && idx !== first.length - 1 ? (
                renderSeparator()
              ) : (
                <SpaceSeparator />
              )}
            </>
          );
        })}
      </ListItemContainer>
    </View>
  );
};

export default Items;
