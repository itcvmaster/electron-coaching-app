const userFragmentStr = `
  birthday
  email
  id
  insertedAt
  isTrial
  location
  name
  updatedAt
  emailUpdatedAt
  roles {
    id
    code
  }
  defaultSummoner {
    id
    isPro
    region
    summonerId
  }
  preferences {
    accountUserId
    config
    id
  }
  summoners {
    id
    isPro
    region
    summonerId
  }
  defaultFortniteUser {
    fortniteAccountId
    id
  }
  fortniteUsers {
    fortniteAccountId
    id
  }
  defaultValorantUser {
    id
    riotAccountId
  }
  riotSideGamesUsers {
    id
    riotAccountId
  }
`;

export const GQLSubSendAuthEmail = `subscription SendAuthEmail($email: String!, $language: String, $securityCode: String!){
    sendAuthEmail(email: $email, languageCode: $language, securityCode: $securityCode) {
      authToken
      authTokenExpiry
      user {
        ${userFragmentStr}
      }
    }
  }`;

export const GQLMutLogout = `mutation{
    logout
  }`;
