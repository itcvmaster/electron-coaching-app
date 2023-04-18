import { readState } from "@/__main__/app-state.mjs";
import { authTokenHandler } from "@/feature-auth/auth-token-handler.mjs";

async function getBearerToken() {
  const { user } = readState;
  if (!user) return null;

  const authToken = await authTokenHandler.getToken();
  if (!authToken) return null;

  return `Bearer ${authToken}`;
}

export default getBearerToken;
