import { keyframes } from "goober";

export default function getKeyframeIncreaseTop(val) {
  return keyframes`
    from {
      top: 90px;
    }
    to {
      top: ${val}px;
    }
  `;
}
