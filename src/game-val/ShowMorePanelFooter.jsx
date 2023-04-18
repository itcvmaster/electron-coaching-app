import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { Button } from "clutch";

const Row2 = styled("div")`
  display: flex;
  align-items: center;

  & > div {
    width: 100%;
    padding: 0;
  }
`;

const Footer = ({ hasMore, setShowMore }) => {
  const { t } = useTranslation();

  return (
    hasMore && (
      <Row2>
        <Button block onClick={setShowMore}>
          {t("common:more", "More")}
        </Button>
      </Row2>
    )
  );
};

export default Footer;
