import React from "react";
import { styled } from "goober";

import { Container } from "@/app/Missing.jsx";
import { devError } from "@/util/dev.mjs";

const StackTrace = styled("pre")`
  margin: var(--sp-8) !important;
  text-align: left;
  max-height: 15rem;
  overflow: auto;
  padding: var(--sp-2) var(--sp-4);
  background: var(--shade7);
  border-radius: var(--br-lg);
  resize: none;
`;

export function DisplayError({ error }) {
  return (
    <Container>
      <div>
        <div>{error.name}</div>
        <div>{error.message}</div>
        <StackTrace>{error.stack}</StackTrace>
      </div>
    </Container>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  // Reset error state when the route changes.
  static getDerivedStateFromProps(props, state) {
    const { routeComponent } = props;
    const { routeComponent: previousRouteComponent } = state;
    const derivedState = { ...state, routeComponent };
    if (routeComponent !== previousRouteComponent) {
      derivedState.error = null;
    }
    return derivedState;
  }

  static getDerivedStateFromError(error) {
    devError("ERROR BOUNDARY", error);
    return { error };
  }

  componentDidCatch(/*error, errorInfo*/) {
    // maybe log the error or something later.
  }

  render() {
    const {
      state: { error },
    } = this;

    if (error) {
      return <DisplayError error={error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
