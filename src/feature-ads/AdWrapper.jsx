import React, { useLayoutEffect, useState } from "react";

import {
  AdsColumn,
  Container,
  DisplayAdContainer,
  InnerContainer,
} from "@/feature-ads/AdWrapper.style.jsx";
import { CONTAINER_ID, OBSERVE_CLASS } from "@/util/exit-transitions.mjs";
import globals from "@/util/global-whitelist.mjs";

function DisplayAd({ placeholder }) {
  return <DisplayAdContainer>{placeholder}</DisplayAdContainer>;
}

function AdWrapper({ children }) {
  const [yOffset, setYOffset] = useState(0);

  useLayoutEffect(() => {
    const content = globals.document.querySelector(`#${CONTAINER_ID}`);
    const findAdAlignElement = (node) =>
      node.querySelector(`.${OBSERVE_CLASS} .sidebar-align`);
    const adAlignElement = findAdAlignElement(content);
    const getOffset = (node, direction = "bottom") =>
      node.getBoundingClientRect()[direction];

    if (adAlignElement) {
      setYOffset(getOffset(adAlignElement));
    } else {
      const wrapperElement = content.querySelector(`.${OBSERVE_CLASS}`);
      if (wrapperElement) {
        setYOffset(getOffset(wrapperElement, "top"));
      }
    }

    const obs = new MutationObserver((mutations) => {
      for (const { addedNodes, removedNodes } of mutations) {
        for (const node of addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          const adAlignElement = findAdAlignElement(node);
          if (!adAlignElement) continue;
          setYOffset(getOffset(adAlignElement));
        }
        for (const node of removedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          const adAlignElement = findAdAlignElement(node);
          if (!adAlignElement) continue;
          setYOffset(0);
        }
      }
    });
    obs.observe(content, {
      childList: true,
      subtree: true,
    });
    return () => {
      obs.disconnect();
    };
  }, []);

  return (
    <Container>
      <InnerContainer>{children}</InnerContainer>
      <AdsColumn $yOffset={yOffset}>
        <DisplayAd placeholder={"Ad 1"} />
        <DisplayAd placeholder={"Ad 2"} />
        <DisplayAd placeholder={"Ad 3"} />
      </AdsColumn>
    </Container>
  );
}

export default AdWrapper;
