import React from "react";
import { styled } from "goober";

const CardContainer = styled("section")`
  background: var(--shade7);
  border-radius: var(--br, 5px);

  > .card-header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: inset 0 -1px var(--shade3-15);
    min-height: var(--sp-14, 3.5rem);
    padding: 0 var(--sp-5, 1.25rem);
    color: var(--shade0, white);
    background: linear-gradient(to bottom, transparent, var(--shade6-25));
    border-top-left-radius: var(--br, 5px);
    border-bottom-right-radius: var(--br, 5px);

    .card-header--controls {
      display: flex;
      gap: var(--sp-2);

      svg {
        font-size: var(--sp-5);
        color: var(--shade3);
      }
    }
  }

  > .card-body,
  &.card-body {
    padding: ${(props) =>
      props.$padding ? props.$padding : "var(--sp-6, 1.5rem)"};
  }
`;

export const Card = ({
  title,
  titleLink,
  headerControls,
  padding,
  children,
  className,
  style,
}) => {
  if (!title && !headerControls) {
    return (
      <CardContainer
        $padding={padding}
        className={className ? `${className} card-body` : "card-body"}
        style={style}
      >
        {children}
      </CardContainer>
    );
  }

  return (
    <CardContainer $padding={padding}>
      {(title || headerControls) && (
        <header className="card-header">
          {title && titleLink ? (
            <h3 className="type-body2">
              <a href={titleLink}>{title}</a>
            </h3>
          ) : title ? (
            <h3 className="type-body2">{title}</h3>
          ) : null}
          {headerControls && (
            <div className="card-header--controls">{headerControls}</div>
          )}
        </header>
      )}
      <div
        className={className ? `${className} card-body` : "card-body"}
        style={style}
      >
        {children}
      </div>
    </CardContainer>
  );
};
