import { styled } from "goober";

export const Toolbar = styled("div")`
  display: flex;
  position: absolute;
  padding: var(--sp-2);
  bottom: 0;
  right: 0;
  z-index: 1001;
`;

export const Form = styled("form")`
  display: flex;
  position: relative;
  padding: 0;
  margin-right: var(--sp-2);
`;

export const sharedInput = `
  border-radius: var(--br);
  background-color: var(--shade7);
  box-shadow: 0 var(--sp-1) var(--sp-2) var(--shade10);
  font-family: inherit;
  font-size: 0.75rem;
  color: var(--shade0);
  padding: 0 var(--sp-2);
  border: none;
  height: var(--sp-8);
  margin-right: var(--sp-2);
  cursor: pointer;
  opacity: 0.8;

  &:last-child {
    margin-right: 0;
  }

  &:focus {
    outline: none;
    background-color: var(--shade6);
  }
`;

export const Select = styled("select")`
  ${sharedInput}
`;

export const Input = styled("input")`
  ${sharedInput}
`;

export const Textarea = styled("textarea")`
  ${sharedInput}
  height: 20rem;
  width: 30rem;
  padding: var(--sp-2);
  cursor: text;
`;

export const TextContainer = styled("div")`
  margin-right: var(--sp-2);
  & > input {
    ${sharedInput}
  }
`;

export const Steps = styled("span")`
  display: flex;
  height: var(--sp-8);
  align-items: center;
  padding: 0 var(--sp-2);

  i {
    width: 1px;
    height: 20px;
    transform: rotate(30deg);
    background-color: rgba(255, 255, 255, 0.2);
    margin: 0 8px 0 10px;
  }
`;

export const Modal = styled("div")`
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;
