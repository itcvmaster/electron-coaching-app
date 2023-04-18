import React from "react";

import WechatLanding from "@/feature-china-auth/WechatLanding.jsx";
import {
  Container,
  StepContainer,
} from "@/feature-china-web/common-styles.mjs";

const AccountWechatForm = (props) => {
  const { isSettings } = props;

  return (
    <Container $isSettings={isSettings}>
      <StepContainer $isSettings={isSettings}>
        <WechatLanding $isSettings={isSettings} />
      </StepContainer>
    </Container>
  );
};

export default AccountWechatForm;
