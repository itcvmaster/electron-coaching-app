import { keyframes, styled } from "goober";

export const ButtonLabel = styled("span")`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.1;
`;

//animations
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
    visibility: visible;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
`;

export const showProgress = ({ progress }) => keyframes`
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(${progress / 100});
  }
`;
