import React from "react";

import AccountWechatForm from "@/feature-china-auth/AccountWechatForm.jsx";
import ContentHeader from "@/feature-china-web/ContentHeader.jsx";
import Footer from "@/feature-china-web/Footer.jsx";

function Auth() {
  /* eslint-disable i18next/no-literal-string */
  return (
    <>
      <ContentHeader />
      <AccountWechatForm />
      <Footer />
    </>
  );
  /* eslint-enable i18next/no-literal-string */
}

export default Auth;
