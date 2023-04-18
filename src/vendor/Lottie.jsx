import * as PropTypes from "prop-types";
import useLottie from "@/vendor/useLottie.jsx";
import useLottieVisibility from "@/vendor/useLottieVisibility.jsx";

const Lottie = (props) => {
  const { style, ...lottieProps } = props;

  const lottieObj = useLottie(lottieProps, style);
  const LottieVisibility = useLottieVisibility(lottieObj);

  return LottieVisibility;
};

Lottie.propTypes = {
  animationData: PropTypes.shape().isRequired,
  loop: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  autoplay: PropTypes.bool,
  style: PropTypes.shape(),
};

Lottie.defaultProps = {
  loop: true,
  autoplay: true,
  style: undefined,
};

export default Lottie;
