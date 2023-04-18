import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

const Container = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`;

const InnerContainer = styled("div")`
  display: flex;
  align-items: center;
  flex-direction: column;
  max-width: 42rem;
  padding-bottom: var(--sp-8);
`;

const ErrorCode = styled("span")`
  font-size: var(--sp-2_5);
  line-height: var(--sp-2_5);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: var(--sp-2_5);
  color: var(--shade1);
  margin-top: 30px;
  font-weight: bold;
`;

const ErrorDescription = styled("p")`
  margin-bottom: 8px;
  font-size: var(--sp-4);
  line-height: var(--sp-6);
  color: var(--shade0);
`;

const DescriptionContainer = styled("div")`
  display: flex;
  justify-content: start;
  flex-direction: column;
  margin-top: 15px;
`;

export default function ErrorComponent({ description }) {
  const { t } = useTranslation();
  return (
    <Container>
      <InnerContainer>
        <img
          src="data:image/png;base64,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"
          style={{ width: 115, height: 115 }}
        />
        <DescriptionContainer>
          <ErrorCode>
            {t("common:error.generalAppError.title", "Oops")}
          </ErrorCode>
          <ErrorDescription>{description}</ErrorDescription>
        </DescriptionContainer>
      </InnerContainer>
    </Container>
  );
}
