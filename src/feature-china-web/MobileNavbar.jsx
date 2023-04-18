import React, { useEffect, useState } from "react";
import { keyframes, styled } from "goober";

import { mobile } from "clutch";

import { hardCodeURLs } from "@/app/constants.mjs";
import { CN_MARKETING_URL } from "@/feature-china-web/constants.mjs";
import BlitzCloseIcon from "@/inline-assets/close-icon.svg";
import MenuIcon from "@/inline-assets/menu-icon.svg";
import globals from "@/util/global-whitelist.mjs";

const stringData = {
  home: "主页",
  leagueOfLegends: "英雄联盟",
  aboutUs: "关于我们",
  faq: "问题与回答",
};

const DropdownEntrance = keyframes`
  from { opacity: 0; transform: scale(0.9); }
`;

const MobileNav = styled("nav")`
  display: none;
  ul {
    list-style: none;
    padding: 0;
    position: static;
    margin-bottom: 68px;
  }
  ${mobile} {
    display: block;
  }
  .nav-content {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    display: none;
    position: fixed;
    animation: ${DropdownEntrance} 0.15s ease-out forwards;
    background: rgba(14, 16, 21, 0.95);
    backdrop-filter: blur(10px);

    &.open {
      display: block;
    }
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: none;

    &.open {
      display: block;
    }
  }

  .nav-button {
    background: transparent;
    border: none;
  }

  p {
    font-size: 0.875rem;
    line-height: var(--sp-5);
  }

  .nav-menu-wapper {
    padding: 30px;
    min-height: 471px; // due to design
    padding: var(--sp-15) var(--sp-9);
    background: var(--shade10);
    position: relative;

    .close-icon {
      position: absolute;
      top: var(--sp-2);
      right: var(--sp-4);
      color: white;
      font-size: 30px;
      padding-top: 10px;
      padding-right: 10px;
    }

    .nav-menu-header {
      font-weight: bold;
      font-size: var(--sp-7);
      line-height: var(--sp-11);
      color: white;
      .home-subtitle {
        margin-top: var(--sp-4);
      }
    }

    .nav-menu-items {
      margin-top: var(--sp-8);
      font-weight: 500;
      font-size: var(--sp-4);
      line-height: var(--sp-7);
      color: var(--shade2);

      .nav-menu-item {
        cursor: pointer;

        &:not(:last-child) {
          margin-bottom: var(--sp-2);
        }
      }
    }
  }
`;

const MobileNavigation = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (mobileNavOpen) {
      globals.document.body.style.maxHeight = "100vh";
      globals.document.body.style.overflow = "hidden";
    } else {
      globals.document.body.style.maxHeight = "unset";
      globals.document.body.style.overflow = "visible";
    }
  }, [mobileNavOpen]);

  return (
    <MobileNav>
      <button
        className="nav-button"
        onClick={() =>
          setMobileNavOpen((setMobileNavOpen) => !setMobileNavOpen)
        }
      >
        <MenuIcon />
      </button>
      <div className={`nav-content${mobileNavOpen ? " open" : ""}`}>
        <div className="nav-menu-wapper">
          <div
            className="close-icon"
            onClick={() =>
              setMobileNavOpen((setMobileNavOpen) => !setMobileNavOpen)
            }
          >
            <BlitzCloseIcon />
          </div>
          <div className="nav-menu-header">
            <div className="home-title">{stringData.home}</div>
            <div className="home-subtitle">{stringData.leagueOfLegends}</div>
          </div>
          <div className="nav-menu-items">
            <div>
              <a
                href={CN_MARKETING_URL.ABOUT_US}
                className="nav-menu-item"
                onClick={() => setMobileNavOpen(false)}
              >
                {stringData.aboutUs}
              </a>
            </div>
            <div>
              <a href={hardCodeURLs.BLITZ_SUPPORT} className="nav-menu-item">
                {stringData.faq}
              </a>
            </div>
          </div>
        </div>
      </div>
    </MobileNav>
  );
};

export default MobileNavigation;
