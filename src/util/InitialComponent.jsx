import React from "react";

import { DisplayError } from "@/app/ErrorBoundary.jsx";

function InitialComponent() {
  const error = new Error("Failed to load initial data.");
  return <DisplayError error={error} />;
}

export default InitialComponent;
