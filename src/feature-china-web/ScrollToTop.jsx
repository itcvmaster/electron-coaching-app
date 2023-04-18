import React, { useLayoutEffect, useState } from "react";
import { styled } from "goober";

import { tablet } from "clutch";

import { appURLs } from "@/app/constants.mjs";
import { CONTAINER_ID } from "@/util/exit-transitions.mjs";
import globals from "@/util/global-whitelist.mjs";

const ScrollTopContainer = styled("div")`
  position: fixed;
  bottom: 65px;
  right: 65px;
  z-index: 10;
  width: 50px;
  height: 50px;
  background-color: var(--primary);
  border: 2px solid #ff425b;
  box-sizing: border-box;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
  border-radius: 1.875rem;
  cursor: pointer;
  background-image: url("${appURLs.CDN}/blitz/dl/thick_carat.png");
  background-size: var(--sp-4);
  background-repeat: no-repeat;
  background-position: center;
  opacity: 1;
  transition: var(--transition);

  ${tablet} {
    bottom: 15px;
    right: 15px;
  }
`;

function handleClick() {
  const element = globals.document.getElementById(CONTAINER_ID);
  if (!element) return;
  element.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

const ScrollToTop = () => {
  const [show, setShow] = useState(false);
  useLayoutEffect(() => {
    function scrollListener(event) {
      setShow(event.target.scrollTop > 0);
    }
    const element = globals.document.getElementById(CONTAINER_ID);
    if (!element) return;
    element.addEventListener("scroll", scrollListener, { passive: true });
    return () => {
      element.removeEventListener("scroll", scrollListener, { passive: true });
    };
  }, []);

  return show ? <ScrollTopContainer onClick={handleClick} /> : null;
};

export default ScrollToTop;
