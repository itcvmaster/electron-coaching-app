import React from "react";
import { css, styled } from "goober";

import { HD, mobileSmall, tablet, tabletMedium } from "clutch";

import { hardCodeURLs } from "@/app/constants.mjs";
import DownloadButton from "@/feature-china-web/ButtonDownload.jsx";
import TencentButton from "@/feature-china-web/ButtonTencent.jsx";
import { fadeIn } from "@/feature-china-web/common-styles.mjs";
import { CN_MARKETING_URL } from "@/feature-china-web/constants.mjs";
import { ChinaICPLogo, Logo } from "@/feature-china-web/media-assets.mjs";
import { Link } from "@/game-lol/CommonComponents.jsx";
import InternalLangLogo from "@/inline-assets/internal-lang-icon.svg";

const LinkStyles = css`
  color: var(--shade0);
  transition: var(--transition);
  &:hover {
    opacity: 0.6;
  }
  &.inverted {
    opacity: 0.6;
    &:hover {
      opacity: 1;
    }
  }
`;

const str = {
  compliant: "守则",
  downloadPCVersion: "PC版下载",
  madeWithLoveAndTilt: "由热爱和执着构成",
  company: "公司",
  aboutUs: "关于我们",
  adPartnerships: "广告合作",
  brandassets: "品牌材料",
  faq: "问题与回答",
  leagalInfo: "法律信息",
  userRight: "用户权限",
  pp: "隐私政策",
  other: "其他",
  internalLang: "软件版本：  1.16.254",
  icpNumber: "沪ICP备2021006861号",
  companyName: "迅灵（上海）体育文化有限公司",
  companyNamee: "上海市杨浦区长阳路1687号东1248幢(5号楼)2156室",
  connect: "联系邮箱： sudaoshi@163.com",
};

const Footer = () => {
  return (
    <FooterBlock>
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__columns">
            <div className="footer__column_buttons">
              <img src={Logo} className="footer__logo" />
              <div className="footer__buttons-container">
                <div className="footer__button-wrapper">
                  <DownloadButton />
                </div>

                <div className="footer__button-wrapper">
                  <TencentButton />
                </div>
              </div>
            </div>

            <div className="made-love-tilt__container">
              <div className="type-caption">{str.madeWithLoveAndTilt}</div>
            </div>

            <div className="footer__column_menus">
              <div className="footer__column_menu_list">
                <FooterSubtitle className="footer__column-title">
                  {str.company}
                </FooterSubtitle>
                <ul className="footer__column-content-list">
                  <li className="footer__column-content-item">
                    <RouterLinkStyle
                      href={CN_MARKETING_URL.ABOUT_US}
                      className="footer__link"
                    >
                      {str.aboutUs}
                    </RouterLinkStyle>
                  </li>
                  <li className="footer__column-content-item">
                    <RouterLinkStyle
                      href={CN_MARKETING_URL.PARTNERSHIPS}
                      className="footer__link"
                    >
                      {str.adPartnerships}
                    </RouterLinkStyle>
                  </li>

                  <li className="footer__column-content-item">
                    <RouterLinkStyle
                      href={CN_MARKETING_URL.BRAND_ASSETS}
                      className="footer__link"
                    >
                      {str.brandassets}
                    </RouterLinkStyle>
                  </li>

                  <li className="footer__column-content-item">
                    <RouterLinkStyle
                      href={hardCodeURLs.BLITZ_SUPPORT}
                      target="_blank"
                      className="footer__link"
                    >
                      {str.faq}
                    </RouterLinkStyle>
                  </li>
                </ul>
              </div>

              {/*<div className="footer__column_menu_list">
                <FooterSubtitle className="footer__column-title">
                  {str.leagalInfo}
                </FooterSubtitle>
                <ul className="footer__column-content-list">
                  <li className="footer__column-content-item">
                    <RouterLinkStyle
                      href={"/terms-of-service-cn"}
                      className="footer__link"
                    >
                      {str.userRight}
                    </RouterLinkStyle>
                  </li>
                  <li className="footer__column-content-item">
                    <RouterLinkStyle
                      href={"/privacy-policy-cn"}
                      className="footer__link"
                    >
                      {str.pp}
                    </RouterLinkStyle>
                  </li>
                </ul>
              </div>*/}
            </div>

            <div className="footer__column_others">
              <FooterSubtitle className="footer__column-title">
                {str.other}
              </FooterSubtitle>
              <div className="other-info__container">
                <div className="china-lang">
                  <InternalLangLogo />
                  <span className="type-caption">{str.internalLang}</span>
                </div>
                <div className="china-icp">
                  <div className="icp-logo">
                    <img src={ChinaICPLogo} alt="chinaICPLogo" />
                  </div>
                  <span className="icp-number type-caption">
                    {str.icpNumber}
                  </span>
                </div>
                <div className="china-icp">
                  <span className="icp-number type-caption">
                    {str.companyName}
                  </span>
                </div>
                <div className="china-icp">
                  <span className="icp-number type-caption">
                    {str.companyNamee}
                  </span>
                </div>
                <div className="china-icp">
                  <span className="icp-number type-caption">{str.connect}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FooterBlock>
  );
};

export default Footer;

const RouterLinkStyle = styled(Link)`
  font-weight: 500;
  font-size: var(--sp-4); // due to design
  line-height: var(--sp-7);
  text-decoration: none;
`;

export const FooterSubtitle = styled("p")`
  font-size: var(--sp-2_5);
  font-weight: 500;
  line-height: 1;
`;

const FooterBlock = styled("footer")`
  position: relative;
  width: 100%;

  .footer {
    &__container {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      max-width: 1920px;
      padding: 64px 136px; // due to design

      ${tablet} {
        padding: 64px 48px; // due to design
      }

      ${tabletMedium} {
        padding: 24px 24px; // due to design
      }

      ${tablet} {
        padding: 64px 48px; // due to design
      }

      ${mobileSmall} {
        padding: 32px; // due to design
      }
    }

    &__columns {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;

      ${tablet} {
        flex-wrap: wrap;
      }

      ${tabletMedium} {
        flex-direction: column;
        padding-bottom: 0;
      }
    }

    &__logo {
      width: 115px;

      ${tabletMedium} {
        width: 120px;
      }
    }

    &__buttons-container {
      padding-top: var(--sp-10);

      ${tablet} {
        display: block;
      }

      ${tabletMedium} {
        padding-top: var(--sp-4);
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        flex-direction: column;
        gap: var(--sp-4);
      }
    }

    &__button-wrapper {
      background: "#dd364d";
      min-width: 253px;
      width: fit-content;

      font-size: var(--sp-3_5);
      line-height: var(--sp-5);

      &:not(:last-child) {
        margin-bottom: var(--sp-4);
      }

      ${tablet} {
        max-width: 253px;
        min-width: unset;
        width: 90%;

        &:not(:last-child) {
          margin-right: var(--sp-3);
        }
      }

      ${tabletMedium} {
        max-width: 253px;
        width: 100%;

        &:not(:last-child) {
          margin-bottom: 0;
          margin-right: 0;
        }
      }
    }

    &__column-title {
      color: var(--shade1);
    }

    &__column-content-list {
      padding-top: var(--sp-4);

      ${mobileSmall} {
        padding-top: var(--sp-4);
      }
    }

    &__column-content-item {
      display: flex;
      align-items: center;

      &:not(:last-child) {
        margin-bottom: var(--sp-2);
      }
    }

    &__link {
      ${LinkStyles}
      &_legal {
        font-size: var(--sp-4);
        font-weight: 700;

        ${HD} {
          font-size: var(--sp-3);
        }
      }

      ${tabletMedium} {
        font-size: var(--sp-3);
        line-height: var(--sp-5);
      }
    }

    &__legal-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      ${mobileSmall} {
        flex-wrap: wrap-reverse;

        > .footer {
          &__column {
            &_big {
              margin-bottom: 0;
              padding-top: var(--sp-6);
            }
          }
        }
      }
      ${tabletMedium} {
        > .footer {
          &__column {
            &_big {
              padding-top: 0;
            }
          }
        }
      }
    }

    &__flag {
      margin-right: var(--sp-3);
      vertical-align: middle;
    }
  }

  .location {
    &__link {
      animation: ${fadeIn} 0.7s ease;
      cursor: pointer;
    }

    &__text {
      animation: ${fadeIn} 0.7s ease;
    }
  }

  .footer__column_buttons {
    flex: 1;
    max-width: 421px;

    ${tablet} {
      flex: 2;
      max-width: 302px;
    }

    ${tabletMedium} {
      flex: 1;
      max-width: 100%;
      width: 100%;
      margin-bottom: var(--sp-6);
    }
  }

  .footer__column_menus {
    flex: 1;
    display: inline-flex;
    margin-right: auto;

    ${tablet} {
      margin-right: 0;
      margin-left: auto;
    }

    ${tabletMedium} {
      flex: 1;
      max-width: 100%;
      width: 100%;
      margin-bottom: var(--sp-6);
    }

    .footer__column_menu_list {
      flex: 1;
      max-width: 153px;

      ${tablet} {
        max-width: 129px;
      }

      ${tabletMedium} {
        max-width: 100%;
        width: 100%;
      }
    }
  }

  .footer__column_others {
    flex: 1;
    max-width: 180px;

    .other-info-divider {
      display: flex;
      margin-top: var(--sp-6);
      margin-bottom: var(--sp-6);
      background: var(--shade0-15);
      height: var(--sp-px);
      width: 84.5px; // due to design
    }

    .china-lang,
    .china-icp {
      display: inline-flex;
      align-items: center;
      width: 100%;

      svg {
        margin-right: var(--sp-2);
      }
    }

    .china-icp {
      margin-top: var(--sp-2);
      .icp-logo {
        width: auto;
        height: var(--sp-5);
        padding-right: var(--sp-1);

        img {
          width: var(--sp-4);
          height: var(--sp-4);
        }
      }
    }

    ${tabletMedium} {
      .made-love-tilt,
      .other-info-divider {
        display: none;
      }
    }
  }

  .made-love-tilt__container {
    display: none;
    ${tabletMedium} {
      display: flex;
      align-items: center;
      height: var(--sp-6);
      margin-bottom: var(--sp-6);
    }
  }

  .other-info__container {
    margin-top: 16px;
  }
`;
