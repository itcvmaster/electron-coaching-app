import { styled } from "goober";

export const Backdrop = styled("div")`
  position: absolute;
  width: 100%;
  height: 264px;
  background: linear-gradient(to top, var(--app-bg), var(--shade3));
  opacity: 0.15;
  -webkit-mask-image: linear-gradient(to top, transparent, black);

  &.hide {
    opacity: 0;
  }
`;

export const BGImageContainer = styled("div")`
  position: absolute;
  width: 100%;
  height: 264px;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to top, transparent, black);

  &.hide {
    opacity: 0;
  }

  img {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    filter: blur(40px);
    opacity: 0.15;
  }
`;
