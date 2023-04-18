export const GQLMutUpdateUserSettings = `mutation UpdateUserPreferences($preferences: Map!) {
    updateUserPreferences(preferences: $preferences, isDeltaUpdate: true) {
      config
      id
      accountUserId
    }
  }
  `;
