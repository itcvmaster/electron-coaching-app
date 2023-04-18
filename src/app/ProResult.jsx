import React, { memo } from "react";
import { styled } from "goober";

import { mobile } from "clutch";

const ProSelectedResultWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80%;

  & > div:last-child {
    overflow: auto;

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

    & > div:nth-child(1) {
      margin-top: 0;
    }
  }

  ${mobile} {
    height: 85%;

    & > div:last-child {
      & > div:nth-child(1) {
        padding: 10px var(--sp-2_5);
        margin-top: 0;

        a {
          & > div {
            height: 38px;
            margin: 3px 0;

            img {
              width: var(--sp-6);
              margin-right: var(--sp-3);
            }

            p {
              font-size: 0.875rem;
              margin: 8px 0 6px;
            }

            div {
              padding: 4px 5px 2px;
              margin-right: 0;
            }
          }
        }
      }
    }
  }
`;

const ResultTitle = styled("span")`
  margin: var(--sp-4) 0;

  ${mobile} {
    margin: var(--sp-2) 0;
  }
`;

const Header = styled("div")`
  position: relative;
`;

const ProSelectedResult = ({ pro /*, onClose*/ }) => {
  // TODO: missing functionality?
  // const handleLinkClick = useCallback(() => {
  //   onClose();
  // }, [onClose]);

  if (!pro) return null;

  return (
    <ProSelectedResultWrapper>
      <Header>
        <img
          src={pro.profile_image_url}
          css={`
            height: 60px;
            width: auto;
            borderradiusborder-radius: 50%;
          `}
        />
      </Header>
      <ResultTitle>{pro.name}</ResultTitle>
    </ProSelectedResultWrapper>
  );
};

export default memo(ProSelectedResult);
