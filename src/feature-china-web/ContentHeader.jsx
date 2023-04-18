import React, { useLayoutEffect, useState } from "react";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { mobile, mobileSmall, tablet } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import DownloadButton from "@/feature-china-web/ButtonDownload.jsx";
import WechatButton from "@/feature-china-web/ButtonWechat.jsx";
import { CNGlobalStyles } from "@/feature-china-web/common-styles.mjs";
import GeneralMobileNav from "@/feature-china-web/MobileNavbar.jsx";
import SettingsButton from "@/feature-china-web/SettingsButton.jsx";
import Logo from "@/inline-assets/logo.png";
import RedLogo from "@/inline-assets/RedLogo.png";
import { fadeIn } from "@/shared/Styles.jsx";
import { CONTAINER_ID } from "@/util/exit-transitions.mjs";
import globals from "@/util/global-whitelist.mjs";

const Container = styled("div")`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: 1920px;
  padding: 0 var(--sp-5);
  margin: auto;

  ${tablet} {
    padding: 0 var(--sp-6);
  }
`;

const Header = styled("header")`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 10;

  & + div {
    margin-top: calc(-1 * var(--cn-content-header-height));
  }

  &.scroll-active {
    .header {
      &__container {
        background-color: var(--shade10);
      }
      &__logo-wrapper {
        display: flex;
        opacity: 1;
        visibility: visible;
      }
      &__search-container {
        opacity: 1;
        visibility: visible;
      }
    }
  }

  &.scroll {
    .header {
      &__container {
        background-color: var(--shade10);
      }
    }
  }

  &.active {
    .header {
      &__logo-wrapper,
      &__search-container {
        opacity: 1;
        visibility: visible;
      }
    }
  }

  .header {
    &__container {
      width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }

    &__content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: var(--cn-content-header-height);

      .pro-access {
        font-size: 0.875rem;
      }

      ${mobile} {
        height: 68px;
      }
    }

    &__logo {
      width: 92px; // due to design
      margin-left: 10px;

      ${mobile} {
        width: 22px;
        margin-left: var(--sp-1);
      }

      &.logo {
        display: none;

        ${mobile} {
          display: block;
        }
      }

      &.logo-pro {
        display: block;

        ${mobile} {
          display: none;
        }
      }
    }

    &__logo-wrapper {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      opacity: 1;
      visibility: 1;
      transition: var(--transition);

      ${mobileSmall} {
        opacity: 1;
        visibility: visible;
      }
    }

    &__logo-link {
      display: flex;
      text-decoration: none;
      transition: var(--transition);
      /* // animation: ${fadeIn} 1s ease; */

      &:hover {
        opacity: 0.7;
      }
    }

    &__links-container {
      display: flex;
      justify-content: space-between;
      align-items: center;

      ${mobile} {
        display: none;
      }
    }

    &__search-container {
      opacity: 0;
      visibility: hidden;
      margin-left: var(--sp-6);
      transition: var(--transition);

      button {
        padding: var(--sp-3) var(--sp-4);

        &:hover {
          background: var(--shade6);
        }
      }

      ${tablet} {
        margin-left: 60px;
      }
    }

    &__button-wrapper {
      &:not(:last-child) {
        margin-right: var(--sp-3);
      }
    }

    &__mobile-button-wrapper {
      display: none;
      cursor: pointer;

      ${mobile} {
        display: block;
      }
    }
  }

  .download-button-label {
    display: inline-flex;
    align-items: center;

    .button-icon {
      margin-right: var(--sp-2);

      svg {
        width: var(--sp-4_5);
        height: auto;
      }
    }
  }

  nav .nav-button {
    margin-right: 14px;
  }
`;

export default function NavbarNewCN() {
  const [scroll, setScroll] = useState(false);
  const state = useSnapshot(readState);
  const isLoggedIn = Boolean(state.user);

  useLayoutEffect(() => {
    function scrollListener(event) {
      setScroll(event.target.scrollTop > 0);
    }
    const element = globals.document.getElementById(CONTAINER_ID);
    if (!element) return;
    element.addEventListener("scroll", scrollListener, { passive: true });
    return () => {
      element.removeEventListener("scroll", scrollListener, { passive: true });
    };
  }, []);

  return (
    <>
      <CNGlobalStyles />
      <Header id="header" className={`header ${scroll ? "scroll-active" : ""}`}>
        <div className="header__container">
          <Container>
            <div className="header__content">
              <div className="header__logo-wrapper">
                <a href="/" className="header__logo-link">
                  <img
                    className="header__logo logo-pro"
                    src={RedLogo}
                    alt="logo"
                  />
                  <img className="header__logo logo" src={Logo} alt="logo" />
                </a>
              </div>

              <div className="header__links-container">
                {isLoggedIn ? (
                  <SettingsButton />
                ) : (
                  <div className="header__button-wrapper">
                    <WechatButton />
                  </div>
                )}

                <div className="header__button-wrapper">
                  <DownloadButton />
                </div>
              </div>
              <GeneralMobileNav />
            </div>
          </Container>
        </div>
      </Header>
    </>
  );
}
