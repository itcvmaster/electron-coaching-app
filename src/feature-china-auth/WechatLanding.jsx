import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { mobile, tablet } from "clutch";

import * as GlobalActions from "@/app/actions.mjs";
import { appURLs } from "@/app/constants.mjs";
import * as AuthActions from "@/feature-auth/auth-actions.mjs";
import { authTokenHandler } from "@/feature-auth/auth-token-handler.mjs";
import {
  WEIXIN_AUTHORIZATION_SCOPES,
  WEIXIN_GRANT_TYPES,
  WEIXIN_QR_CODE_REDIRECT_URL,
} from "@/feature-china-auth/config.mjs";
import {
  generatorBase64ID,
  getWechatAccessToken,
  getWechatQRCode,
  getWechatQRState,
  getWechatUserInfo,
  QR_STATES,
  saveWechatUserInfo,
} from "@/feature-china-auth/utils.mjs";
import { FormWrapper } from "@/feature-china-web/common-styles.mjs";
import Reload from "@/inline-assets/reload.svg";
import WechatFailIcon from "@/inline-assets/wechat-fail-icon.svg";
import WechatSuccessIcon from "@/inline-assets/wechat-success-icon.svg";
import { setRoute } from "@/root.mjs";

const STATE_LENGTH = 32;

/**
 * Component for Wechat Landing
 */
const WechatLanding = (props) => {
  const { isSettings } = props;

  const { t } = useTranslation();

  const qrUuid = useRef("");

  const [qrState, setQRState] = useState({
    uuid: null,
    errCode: "",
    code: "",
    lastState: "",
    timeout: 0,
    state: QR_STATES.wait.key,
    loggedin: false,
    name: "",
  });
  const [disabledRefresh, setDisableRefresh] = useState(false);

  const getUuid = (data) => {
    const reg = new RegExp(/(uuid=([\w]*)")/g);
    const parseData = reg.exec(data);
    const uuid = parseData?.[2];

    return uuid;
  };

  const getQRImage = () => {
    const params = {
      redirect_uri: encodeURIComponent(WEIXIN_QR_CODE_REDIRECT_URL),
      response_type: "code",
      scope: WEIXIN_AUTHORIZATION_SCOPES.snsapiLogin.scope,
      state: generatorBase64ID(STATE_LENGTH),
      connect_redirect: 1,
    };

    qrUuid.current = "";
    setDisableRefresh(true);
    getWechatQRCode(params)
      .then((res) => {
        if (res !== null) {
          const uuid = getUuid(res);

          qrUuid.current = uuid;
          setQRState({
            ...qrState,
            uuid,
            state: QR_STATES.wait.key,
            lastState: "",
            code: "",
            timeout: 0,
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        setDisableRefresh(false);
      });
  };

  const getUserInfo = (accessToken, openId) => {
    return new Promise((resolve, reject) => {
      if (!accessToken || !openId) {
        reject(new Error("don't have access token or open id"));
      }

      const params = {
        access_token: accessToken,
        openid: openId,
        lang: "en",
      };

      getWechatUserInfo(params)
        .then((data) => {
          if (!data?.errcode) {
            resolve({
              error: 0,
              data: data,
            });
          } else {
            reject(new Error(data.errmsg));
          }
        })
        .catch((err) => {
          reject(new Error(err));
        });
    });
  };

  const onSuccessfulAuth = ({ authToken, authTokenExpiry, user }) => {
    // set settings based on the user specific settings
    if (user.persistence) {
      GlobalActions.replaceSettingsAction(user.persistence);
    }

    AuthActions.setUserAction(user);
    authTokenHandler.setToken(authToken, authTokenExpiry);

    setRoute("/");
  };

  const processLoginUserInfo = (user) => {
    saveWechatUserInfo(user).then((data) => {
      localStorage.setItem("is_wechat_user", true);
      onSuccessfulAuth(data);
      setQRState({
        ...qrState,
        loggedin: true,
        name: data.user.name,
      });
    });
  };

  const getToken = (code) => {
    if (!code) {
      return;
    }

    const params = {
      code: code,
      grant_type: WEIXIN_GRANT_TYPES.accessToken,
    };
    getWechatAccessToken(params)
      .then((data) => {
        if (!data?.errcode) {
          const { access_token, openid } = data;

          getUserInfo(access_token, openid)
            .then((res) => {
              const user_info = res.data;
              const user = {
                ...data,
                ...user_info,
              };
              processLoginUserInfo(user);
            })
            .catch(() => {
              // console.log("error for getting user information", err);
            });
        }
      })
      .catch(() => {
        // console.log("error for getting access token: ", err);
      });
  };

  const getQRState = (qrState) => {
    const lastState = qrState.lastState;
    const params = {
      uuid: qrState.uuid,
      ...(lastState ? { last: lastState } : {}),
      _: new Date().getTime().toString(),
    };

    return new Promise((resolve) => {
      getWechatQRState(params)
        .then((res) => {
          // Read errcode and code
          // res - "window.wx_errcode='';window.wx_code=='';"
          const reg = new RegExp(
            /(window.wx_errcode=([\w]*);window.wx_code='([\w]*)';)/g
          );
          const parseData = reg.exec(res);
          const strErrCode = parseData?.[2] ?? "";
          const errCode = parseInt(strErrCode, 10);
          const code = parseData?.[3];
          let state = qrState.state;
          let timeout = -1;
          let newLastCode = "";
          const isUpdatedUuid = qrUuid.current !== qrState.uuid; // check if uuid is updated

          switch (errCode) {
            case 405:
              // User clicked "Agree" after user scanned QR code
              // So reading user information data is ready for now.
              if (!isUpdatedUuid) {
                state = QR_STATES.agreed.key;
                getToken(code);
              }
              break;
            case 404:
              // User scanned QR code.
              // So we should wait until user click "Agree"
              // At this time, we should read qr state every 100ms.
              state = QR_STATES.scanned.key;
              timeout = 100;
              newLastCode = errCode;
              break;
            case 403:
              // User clicked "Cancal" after user scanned QR code
              // So we should wait until user scan QR code again.
              state = QR_STATES.cancelled.key;
              timeout = 2e3;
              newLastCode = errCode;
              break;
            case 402:
            case 500:
              // Has errors, like timeout of QR code, internet connnection.
              // So browser should be reloaded.
              // window.location.reload();
              getQRImage();
              break;
            case 408:
              // We are waiting until user scan QR code after the code is generated.
              // We should get QR state every 2s.
              timeout = 2e3;
          }

          resolve({
            ...qrState,
            errCode,
            code,
            state,
            timeout,
            lastState: newLastCode,
          });
        })
        .catch((err) => {
          // Read errcode
          // err - "window.wx_errcode='';window.wx_code=='';"
          const reg = new RegExp(
            /(window.wx_errcode=([\w]*);window.wx_code='([\w]*)';)/g
          );
          const parseData = reg.exec(err?.data);
          const strErrCode = parseData?.[2] ?? "";
          const errCode = parseInt(strErrCode, 10);
          let newLastCode = "";
          let timeout = -1;

          if (408 === errCode) {
            timeout = 5e3;
          } else {
            timeout = 5e3;
            newLastCode = errCode;
          }

          resolve({
            ...qrState,
            errCode,
            code: "",
            state: QR_STATES.wait.key,
            timeout,
            lastState: newLastCode,
          });
        });
    });
  };

  const saveCurrentState = useCallback(
    (newState) => {
      if (qrUuid.current === newState.uuid) {
        setQRState(newState);
      }
    },
    [qrUuid]
  );

  useEffect(() => {
    let timer = null;
    if (qrState.uuid) {
      if (qrState.timeout >= 0) {
        timer = setTimeout(
          (_qrState) => {
            getQRState(_qrState).then((res) => {
              saveCurrentState(res);
            });
          },
          qrState.timeout,
          qrState
        );
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [qrState]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getQRImage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Wrapper $isSettings={isSettings}>
      <FormWrapper $isSettings={isSettings}>
        <div className="header__container">
          <div className="title type-h3">
            {t("common:weixin.loginToWeChat", "微信登录")}
          </div>
          <div className="refresh-button">
            <button
              className="clickable"
              onClick={getQRImage}
              disabled={disabledRefresh}
            >
              <Reload width={32} height={32} />
            </button>
          </div>
        </div>
        {qrState.uuid ? (
          <div className="panelContent">
            {qrState.state === QR_STATES.wait.key ? (
              <div className="info">
                <div className="type-body1 scan-now" id="wx_default_tip">
                  <p>
                    {t(
                      "common:weixin.scanQRCodeInWeChatToLogin",
                      "请使用微信扫描二维码登录"
                    )}
                  </p>
                </div>
              </div>
            ) : null}
            <div className="wrp_code">
              <img
                className="qrcode"
                src={`${appURLs.BLITZ_CN_AUTHURL}/api/wechat/wechat_qrcode_image/${qrState.uuid}`}
              />
            </div>
            <div className="info">
              {qrState.state === QR_STATES.scanned.key ? (
                <div className="status" id="wx_after_scan">
                  <WechatSuccessIcon className="status_icon" />
                  <div className="status_txt">
                    <p className="type-subtitle1">
                      {t("common:weixin.scannedSuccessfully", "扫描成功")}
                    </p>
                    <p className="type-body2 status_subtxt">
                      {t(
                        "common:weixin.confirmYourLoginInWeChat",
                        "请在微信中点击确认即可登录"
                      )}
                    </p>
                  </div>
                </div>
              ) : null}
              {qrState.state === QR_STATES.cancelled.key ? (
                <div className="status" id="wx_after_cancel">
                  <WechatFailIcon className="status_icon" />
                  <div className="status_txt">
                    <p className="type-subtitle1">
                      {t("common:weixin.loginCanceled", "您已取消此次登录")}
                    </p>
                    <p className="type-body2 status_subtxt">
                      {t(
                        "common:weixin.loginAgainOrCloseThePage",
                        "您可再次扫描登录，或关闭窗口"
                      )}
                    </p>
                  </div>
                </div>
              ) : null}
              {qrState.loggedin === true ? (
                <div className="status" id="wx_after_agree">
                  <WechatSuccessIcon className="status_icon" />
                  <div className="status_txt">
                    <p className="type-subtitle1">{qrState.name}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </FormWrapper>
      {!isSettings && (
        <CharacterImg
          src={`${appURLs.CDN_PLAIN}/blitz/cn-login/login-page-characters.webp`}
        />
      )}
    </Wrapper>
  );
};

export default WechatLanding;

const Wrapper = styled("div")`
  display: flex;
  align-items: center;
  width: ${({ $isSettings }) => ($isSettings ? 100 : 85)}%;
  margin-top: var(--sp-32);

  .header__container {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .title {
      text-align: center;
    }

    .refresh-button {
      margin-left: var(--sp-2_5);

      button {
        color: var(--shade2);
        background: transparent;
        font-size: var(--sp-9);
        border: none;
        padding: var(--sp-1);
        border-radius: 50%;
        cursor: pointer;
        transition: background var(--transition), color var(--transition);

        &:hover {
          background: var(--shade7);
          color: var(--shade0);
        }
      }
    }
  }

  .wrp_code {
    width: 292px;
    margin-top: calc(var(--sp-px) * 26);

    .qrcode {
      width: 100%;
      height: auto;
    }
  }

  .scan-now {
    margin-top: var(--sp-2);
    color: var(--shade1);
  }

  .status {
    display: inline-flex;
    align-items: center;
    margin-top: var(--sp-4_5);

    .status_icon {
      margin-right: var(--sp-2);
    }

    .status_txt {
      .status_subtxt {
        color: var(--shade1);
      }
    }
  }
`;

const CharacterImg = styled("img")`
  width: 50%;

  ${tablet} {
    display: none;
  }

  ${mobile} {
    display: none;
  }
`;
