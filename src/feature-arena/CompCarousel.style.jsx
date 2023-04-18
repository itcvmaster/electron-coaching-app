import { styled } from "goober";

export const Container = styled("div")`
  .carousel-container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .carousel-wrapper {
    display: flex;
    width: 100%;
    position: relative;
  }

  .carousel-content-wrapper {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
`;

export const CarouselContent = styled("div")`
  display: flex;
  transition: ${({ $enabled, duration }) =>
    $enabled ? "all " + duration + "ms ease" : "none"};
  -ms-overflow-style: none; /* hide scrollbar in IE and Edge */
  scrollbar-width: none; /* hide scrollbar in Firefox */
  ::-webkit-scrollbar,
  ::-webkit-scrollbar {
    display: none;
  }
  transform: ${({ index }) =>
    `translateX(calc(-${index} * (var(--sp-container) - var(--sp-20) + var(--sp-4))))`};
  > * {
    width: calc(var(--sp-container) - var(--sp-20));
    flex-shrink: 0;
    flex-grow: 1;
    margin-right: var(--sp-4);
  }
`;

export const Pagination = styled("div")`
  display: flex;
  margin: var(--sp-2) 0;
`;

export const DashContainer = styled("div")`
  padding: var(--sp-4) 0;
  cursor: pointer;
`;

export const Dash = styled("div")`
  position: relative;
  width: var(--sp-14);
  height: var(--sp-1);
  background-color: ${({ $passed }) =>
    $passed ? "var(--shade1)" : "var(--shade5)"};
  border-radius: var(--sp-1);
  margin: 0 var(--sp-1);
`;

export const InnerDash = styled("div")`
  position: absolute;
  width: 0;
  height: 100%;
  background-color: var(--shade1);
  border-radius: var(--sp-1);
  transition: all 0s ease-in;

  &.play {
    width: 100%;
    transition-duration: ${({ duration }) => duration}ms;
  }
`;

export const Gradient = styled("div")`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 80px;
  background: linear-gradient(270deg, #0e10158f 50%, rgba(0, 0, 0, 0) 100%);
  cursor: pointer;
`;
