import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { Caption, CaptionBold } from "@/game-lol/CommonComponents.jsx";

const SectionHeader = styled("div")`
  padding: var(--sp-3);
  padding-left: var(--sp-4);
  background: var(--shade9);
  position: sticky;
  top: 0;
`;
const Row = styled("div")`
  display: flex;
  padding: 0 var(--sp-4);
  background: ${(props) =>
    props.index % 2 === 0 ? "var(--shade9)" : "var(--shade8)"};

  &:hover {
    background: var(--shade6);
  }

  .row-title {
    width: 130px;
    padding: var(--sp-3) 0;
    justify-content: center;
  }
`;

const StatBlock = styled("div")`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;

  .fb-dot {
    background: ${({ $dotColor }) => $dotColor};
    height: 6px;
    width: 6px;
    border-radius: var(--br);
  }

  .stat {
    color: ${({ $statColor }) => $statColor};
  }
`;

function PostMatchAdvancedStatsList({
  data,
  header,
  yourIndex,
  numberOfTeamMembers,
  memoizedMouseEnter,
  memoizedMouseLeave,
}) {
  const { t } = useTranslation();

  return (
    <>
      <SectionHeader>
        <CaptionBold>{header}</CaptionBold>
      </SectionHeader>
      <div>
        {data.map((row, i) => {
          return (
            <Row key={`{postmatch-advanced-row-${header}-${i}}`} index={i}>
              <div className="row-title">
                <Caption>{row.header}</Caption>
              </div>

              {row.data.map((value, i) => {
                const isUser = yourIndex === i;
                const dotColor = isUser
                  ? "var(--yellow)"
                  : i < numberOfTeamMembers
                  ? "var(--blue)"
                  : "var(--red)";
                const statColor = isUser ? "var(--yellow)" : "var(--shade2)";

                const isFB =
                  row.header ===
                  `${t(
                    "lol:postmatch.advancedStatsSubHeaders.firstBloodKill"
                  )}`;

                if (isFB) {
                  return (
                    <StatBlock
                      key={`${i}-${value}`}
                      $dotColor={dotColor}
                      $statColor={statColor}
                      onMouseEnter={() =>
                        memoizedMouseEnter ? memoizedMouseEnter(i) : null
                      }
                      onMouseLeave={memoizedMouseLeave}
                    >
                      {value && <div className="fb-dot" />}
                    </StatBlock>
                  );
                }
                return (
                  <StatBlock
                    key={`${i}-${value}`}
                    $dotColor={dotColor}
                    $statColor={statColor}
                    onMouseEnter={() =>
                      memoizedMouseEnter ? memoizedMouseEnter(i) : null
                    }
                    onMouseLeave={memoizedMouseLeave}
                  >
                    {isUser ? (
                      <CaptionBold className="stat">{value}</CaptionBold>
                    ) : (
                      <Caption className="stat">{value}</Caption>
                    )}
                  </StatBlock>
                );
              })}
            </Row>
          );
        })}
      </div>
    </>
  );
}

export default PostMatchAdvancedStatsList;
