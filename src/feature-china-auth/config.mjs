export const WEIXIN_QR_CODE_REDIRECT_URL = "https://blitz.cn/account";

export const WEIXIN_AUTHORIZATION_SCOPES = {
  snsapiBase: {
    key: "snsapiBase",
    scope: "snsapi_base",
    apis: {
      accessToken: "/sns/oauth2/access_token",
      refreshToken: "/sns/oauth2/refresh_token",
    },
  },
  snsapiUserinfo: {
    key: "snsapiUserinfo",
    scope: "snsapi_userinfo",
    apis: {
      auth: "/sns/auth",
    },
  },
  snsapiLogin: {
    key: "snsapiLogin",
    scope: "snsapi_login",
    apis: {
      userinfo: "/sns/userinfo",
    },
  },
};

export const WEIXIN_GRANT_TYPES = {
  accessToken: "authorization_code",
  refreshToken: "refresh_token",
};
