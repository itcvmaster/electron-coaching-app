import { postData } from "@/__main__/get-data.mjs";
import noopModel from "@/data-models/no-op.mjs";
import { AUTH_GRAPHQL } from "@/feature-auth/config.mjs";
import getBearerToken from "@/feature-auth/get-auth-request-header.mjs";
import { GQLMutUpdateUserSettings } from "@/feature-auth/user-settings-client-gql.mjs";

export default async function updateUserSettings(userSettings) {
  const bearerToken = await getBearerToken();
  if (bearerToken) {
    await postData(
      {
        url: AUTH_GRAPHQL,
        body: {
          query: GQLMutUpdateUserSettings,
          variables: {
            preferences: JSON.stringify(userSettings),
          },
        },
      },
      noopModel,
      ["volatile.updateSettingsResponse"],
      { headers: { Authorization: bearerToken } }
    );
  }
}
