import { appURLs } from "@/app/constants.mjs";
import StreamerPack from "@/inline-assets/streamer-pack.png";
import lottie1Data from "@/vendor/lottie-brand-assets.json";
import lottiePattern0Data from "@/vendor/lottie-pattern-1.json";
import lottiePattern2Data from "@/vendor/lottie-pattern-2.json";
import lottiePattern3Data from "@/vendor/lottie-pattern-3.json";

const logoLight = `${appURLs.CDN_PLAIN}/blitz/brands/logo-light.svg`;
const logoLightPng = `${appURLs.CDN_PLAIN}/blitz/brands/logo-light.png`;
const logoDark = `${appURLs.CDN_PLAIN}/blitz/brands/logo-dark.svg`;
const logoDarkPng = `${appURLs.CDN_PLAIN}/blitz/brands/logo-dark.png`;
const logoMonochromeDark = `${appURLs.CDN_PLAIN}/blitz/brands/logo-monochrome-dark.svg`;
const logoMonochromeDarkPng = `${appURLs.CDN_PLAIN}/blitz/brands/logo-monochrome-dark.png`;
const logoMonochromeLight = `${appURLs.CDN_PLAIN}/blitz/brands/logo-monochrome-light.svg`;
const logoMonochromeLightPng = `${appURLs.CDN_PLAIN}/blitz/brands/logo-monochrome-light.png`;
const logoProLight = `${appURLs.CDN_PLAIN}/blitz/brands/logo-pro-light.svg`;
const logoProLightPng = `${appURLs.CDN_PLAIN}/blitz/brands/logo-pro-light.png`;
const logoProDark = `${appURLs.CDN_PLAIN}/blitz/brands/logo-pro-dark.svg`;
const logoProDarkPng = `${appURLs.CDN_PLAIN}/blitz/brands/logo-pro-dark.png`;
const logoProMonochromeDark = `${appURLs.CDN_PLAIN}/blitz/brands/logo-pro-monochrome-dark.svg`;
const logoProMonochromeDarkPng = `${appURLs.CDN_PLAIN}/blitz/brands/logo-pro-monochrome-dark.png`;
const logoProMonochromeLight = `${appURLs.CDN_PLAIN}/blitz/brands/logo-pro-monochrome-light.svg`;
const logoProMonochromeLightPng = `${appURLs.CDN_PLAIN}/blitz/brands/logo-pro-monochrome-light.png`;
const logoEnterpriseLight = `${appURLs.CDN_PLAIN}/blitz/brands/logo-enterprise-light.svg`;
const logoEnterpriseLightPng = `${appURLs.CDN_PLAIN}/blitz/brands/logo-enterprise-light.png`;
const logoEnterpriseDark = `${appURLs.CDN_PLAIN}/blitz/brands/logo-enterprise-dark.svg`;
const logoEnterpriseDarkPng = `${appURLs.CDN_PLAIN}/blitz/brands/logo-enterprise-dark.png`;
const logoEnterpriseMonochromeDark = `${appURLs.CDN_PLAIN}/blitz/brands/logo-enterprise-monochrome-dark.svg`;
const logoEnterpriseMonochromeDarkPng = `${appURLs.CDN_PLAIN}/blitz/brands/logo-enterprise-monochrome-dark.png`;
const logoEnterpriseMonochromeLight = `${appURLs.CDN_PLAIN}/blitz/brands/logo-enterprise-monochrome-light.svg`;
const logoEnterpriseMonochromeLightPng = `${appURLs.CDN_PLAIN}/blitz/brands/logo-enterprise-monochrome-light.png`;

const lottie1Options = {
  loop: false,
  autoplay: true,
  animationData: lottie1Data,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const lottiePattern0Options = {
  loop: false,
  autoplay: true,
  animationData: lottiePattern0Data,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const lottiePattern3Options = {
  loop: false,
  autoplay: true,
  animationData: lottiePattern3Data,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const lottiePattern2Options = {
  loop: false,
  autoplay: true,
  animationData: lottiePattern2Data,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

// all icons (png and svg) in assets/icons/brandAssets
const logotypes = [
  {
    type: "blitz",
    title: ["common:logotypes.logoLight", "logo in color light"],
    background: "var(--shade7)",
    logo: logoLight,
    download: {
      svg: logoLight, // link for downloading icon in svg
      png: logoLightPng, // link for downloading icon in png
    },
  },
  {
    type: "blitz",
    title: ["common:logotypes.logoDark", "logo in color dark"],
    background: "var(--shade0)",
    logo: logoDark,
    download: {
      svg: logoDark,
      png: logoDarkPng,
    },
  },
  {
    type: "blitz",
    title: ["common:logotypes.logoMonochromeDark", "logo monochrome dark"],
    background: "var(--shade0)",
    logo: logoMonochromeDark,
    download: {
      svg: logoMonochromeDark,
      png: logoMonochromeDarkPng,
    },
  },
  {
    type: "blitz",
    title: ["common:logotypes.logoMonochromeLight", "logo monochrome light"],
    background: "var(--primary)",
    logo: logoMonochromeLight,
    download: {
      svg: logoMonochromeLight,
      png: logoMonochromeLightPng,
    },
  },
  {
    type: "blitzPro",
    title: ["common:logotypes.logoLight", "logo in color light"],
    background: "var(--shade9)",
    logo: logoProLight,
    download: {
      svg: logoProLight,
      png: logoProLightPng,
    },
  },
  {
    type: "blitzPro",
    title: ["common:logotypes.logoDark", "logo in color dark"],
    background: "var(--shade0)",
    logo: logoProDark,
    download: {
      svg: logoProDark,
      png: logoProDarkPng,
    },
  },
  {
    type: "blitzPro",
    title: ["common:logotypes.logoMonochromeDark", "logo monochrome dark"],
    background: "var(--shade0)",
    logo: logoProMonochromeDark,
    download: {
      svg: logoProMonochromeDark,
      png: logoProMonochromeDarkPng,
    },
  },
  {
    type: "blitzPro",
    title: ["common:logotypes.logoMonochromeLight", "logo monochrome light"],
    background:
      "linear-gradient(195deg, #F1DFB4 -90%, #C79E57 -30%, #94743A 100%)",
    logo: logoProMonochromeLight,
    download: {
      svg: logoProMonochromeLight,
      png: logoProMonochromeLightPng,
    },
  },
  {
    type: "blitzEnterprise",
    title: ["common:logotypes.logoLight", "logo in color light"],
    background: "var(--shade9)",
    logo: logoEnterpriseLight,
    download: {
      svg: logoEnterpriseLight,
      png: logoEnterpriseLightPng,
    },
  },
  {
    type: "blitzEnterprise",
    title: ["common:logotypes.logoDark", "logo in color dark"],
    background: "var(--shade0)",
    logo: logoEnterpriseDark,
    download: {
      svg: logoEnterpriseDark,
      png: logoEnterpriseDarkPng,
    },
  },
  {
    type: "blitzEnterprise",
    title: ["common:logotypes.logoMonochromeDark", "logo monochrome dark"],
    background: "var(--shade0)",
    logo: logoEnterpriseMonochromeDark,
    download: {
      svg: logoEnterpriseMonochromeDark,
      png: logoEnterpriseMonochromeDarkPng,
    },
  },
  {
    type: "blitzEnterprise",
    title: ["common:logotypes.logoMonochromeLight", "logo monochrome light"],
    background: "var(--primary)",
    logo: logoEnterpriseMonochromeLight,
    download: {
      svg: logoEnterpriseMonochromeLight,
      png: logoEnterpriseMonochromeLightPng,
    },
  },
];

const brandColors = [
  {
    type: "blitz",
    color: "var(--primary)",
    hsl: "hsl(38,80,68)",
    title: ["common:brandAssets.colors.softRed", "Soft Red"],
  },
  {
    type: "blitz",
    color: "var(--shade0)",
    hsl: "hsl(222,14,90)",
    title: ["common:brandAssets.colors.clearWhite", "Clear White"],
  },
  {
    type: "blitz",
    color: "var(--shade7)",
    hsl: "hsl(222,18,10)",
    title: ["common:brandAssets.colors.softBlue", "Soft Blue"],
  },
  {
    type: "blitz",
    color: "var(--shade9)",
    hsl: "hsl(222,24,6,1)",
    title: ["common:brandAssets.colors.deepTwilightBlue", "Deep twilight Blue"],
  },
];

const tabs = [
  {
    value: "blitz",
    label: "BLITZ",
  },
  // {
  //   value: 'blitzPro',
  //   label: 'BLITZ PRO',
  // },
];

const streamerPacks = [
  {
    title: "Streamer Pack for Twitch 1",
    image: StreamerPack,
  },
];

export {
  brandColors,
  logotypes,
  lottie1Options,
  lottiePattern0Options,
  lottiePattern2Options,
  lottiePattern3Options,
  streamerPacks,
  tabs,
};
