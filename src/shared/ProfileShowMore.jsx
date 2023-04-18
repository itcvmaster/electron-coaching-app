import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { Button } from "clutch";

const Row2 = styled("div")`
  display: flex;
  align-items: center;
`;

const Footer = ({ showAll, setShowMore }) => {
  const { t } = useTranslation();

  return (
    <Row2>
      <Button block onClick={setShowMore}>
        {showAll
          ? t("common:showLess", "Show less")
          : t("common:showMore", "Show more")}
      </Button>
    </Row2>
  );
};

export default Footer;
