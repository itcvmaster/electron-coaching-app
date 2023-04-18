import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

export const Container = styled("div")`
  height: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  > * {
    max-width: var(--sp-container);
    text-align: center;
    padding: 0 var(--sp-4) var(--content-header-height);
    > :first-child {
      font-size: 3em;
    }
    > :not(:first-child) {
      margin: var(--sp-4) 0;
      color: var(--shade2);
    }
  }
`;

function Missing() {
  const { t } = useTranslation();
  const headline = t("common:404", "404");
  const subtitle = t("common:notFound", "Not found");

  return (
    <Container>
      <div>
        <div>{headline}</div>
        <div>{subtitle}</div>
      </div>
    </Container>
  );
}

export default Missing;
