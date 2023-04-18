import { refs } from "@/__main__/App.jsx";
import AdWrapper from "@/feature-ads/AdWrapper.jsx";
import HeaderWrapper from "@/feature-ads/HeaderWrapper.jsx";

const originals = {};

export function setup() {
  originals.ContentWrapper = refs.ContentWrapper;
  originals.HeaderWrapper = refs.HeaderWrapper;
  refs.ContentWrapper = AdWrapper;
  refs.HeaderWrapper = HeaderWrapper;
  refs.forceRender();
}

export function teardown() {
  refs.ContentWrapper = originals.ContentWrapper;
  refs.HeaderWrapper = originals.HeaderWrapper;
  refs.forceRender();
}
