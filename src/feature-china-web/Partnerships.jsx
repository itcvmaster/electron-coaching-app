import React from "react";
import { styled } from "goober";

import { HD, mobile, tablet } from "clutch";

import {
  Container,
  ScrollRoot as _Root,
} from "@/feature-china-web/common-styles.mjs";
import ContentHeader from "@/feature-china-web/ContentHeader.jsx";
import Footer from "@/feature-china-web/Footer.jsx";
import Community from "@/feature-china-web/PartnershipsCommunity.jsx";
import Data from "@/feature-china-web/PartnershipsData.jsx";
import Games from "@/feature-china-web/PartnershipsGames.jsx";
import Partners from "@/feature-china-web/PartnershipsPartners.jsx";
import Service from "@/feature-china-web/PartnershipsService.jsx";
import Stats from "@/feature-china-web/PartnershipsStats.jsx";
import { TextWrapper } from "@/feature-china-web/TextBlockComponent.jsx";

const Root = styled(_Root)`
  color: var(--white);

  h1 {
    font-size: var(--sp-15);
    text-align: center;
  }

  h3 {
    font-weight: 300;
  }

  ${TextWrapper} {
    padding: 0;
  }

  ${HD} {
    h1 {
      font-size: var(--sp-50);
    }
  }
  ${tablet} {
    h1 {
      font-size: var(--sp-12);
    }
  }
  ${mobile} {
    h1 {
      font-size: var(--sp-5);
    }

    .block__title {
      padding-bottom: 0.875rem;
    }
  }
`;

const PartnershipPage = () => {
  return (
    <Root>
      <ContentHeader />
      <Games />
      <Stats />
      <Container>
        <Service />
        <Data />
      </Container>
      <Community />
      <Partners />
      <Footer />
    </Root>
  );
};

export function meta() {
  return {
    title: [null, "广告合作伙伴"],
    description: [null, ""],
  };
}

export default PartnershipPage;
