import React from "react";
import { styled } from "goober";

import EmojiMagnifyingGlassIcon from "@/inline-assets/emoji-magnifying-glass.svg";

export const EmptyListProxy = ({ text, subtext }) => (
  <Center>
    <EmojiMagnifyingGlassIcon />
    <Text>{text}</Text>
    <SubText>{subtext}</SubText>
  </Center>
);

const Text = styled("div")`
  color: var(--shade0);
  font-weight: 700;
  font-size: var(--sp-5);
  line-height: var(--sp-8);
  letter-spacing: 0var (--sp-6);
  margin-top: var(--sp-6);
`;
const SubText = styled("span")`
  color: var(--shade2);
  font-size: 0.875rem;
  margin-top: 8px;
`;
const minHeightOfTable = 600;
const heightOfTableHeader = 60;
const Center = styled("div")`
  height: ${minHeightOfTable - heightOfTableHeader}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
