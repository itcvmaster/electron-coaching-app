import { refs } from "@/__main__/App.jsx";
import {
  HeaderWrapper,
  NavigationWrapper,
} from "@/feature-reskin/Components.jsx";

const originals = {};

export function setup() {
  originals.HeaderWrapper = refs.HeaderWrapper;
  originals.NavigationWrapper = refs.NavigationWrapper;
  refs.HeaderWrapper = HeaderWrapper;
  refs.NavigationWrapper = NavigationWrapper;
  refs.forceRender();
}

export function teardown() {
  refs.HeaderWrapper = originals.HeaderWrapper;
  refs.NavigationWrapper = originals.NavigationWrapper;
  refs.forceRender();
}
