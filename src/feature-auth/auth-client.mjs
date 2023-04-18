import * as withAbsintheSocket from "@absinthe/socket";
import { Socket as PhoenixSocket } from "phoenix";

import { postData } from "@/__main__/get-data.mjs";
import noopModel from "@/data-models/no-op.mjs";
import {
  GQLMutLogout,
  GQLSubSendAuthEmail,
} from "@/feature-auth/auth-client-gql.mjs";
import { AUTH_GRAPHQL, AUTH_WS_URL } from "@/feature-auth/config.mjs";
import getBearerToken from "@/feature-auth/get-auth-request-header.mjs";

const AUTH_ABSINTHE_SOCKET_ENDPOINT = `${AUTH_WS_URL}/socket`;

export class AuthClient {
  #runningAuthProcesses = 0;
  #phoenixSocket = new PhoenixSocket(AUTH_ABSINTHE_SOCKET_ENDPOINT, {
    params: { UA: navigator.userAgent },
  });

  startAuthProcess(email, language, securityCode) {
    return new Promise((res, rej) => {
      if (!this.#phoenixSocket.isConnected()) {
        this.#phoenixSocket.connect();
      }
      this.#runningAuthProcesses++;

      const absintheSocket = withAbsintheSocket.create(this.#phoenixSocket);
      const requestOptions = { email, language, securityCode };

      const notifier = withAbsintheSocket.send(absintheSocket, {
        operation: GQLSubSendAuthEmail,
        variables: requestOptions,
      });

      const onProcessEnd = () => {
        withAbsintheSocket.cancel(absintheSocket, notifier);
        this.#runningAuthProcesses--;
        if (this.#runningAuthProcesses <= 0) {
          this.#phoenixSocket.disconnect();
        }
      };

      const observer = {
        onAbort: (error) => {
          onProcessEnd();
          rej(error);
        },
        onError: (error) => {
          onProcessEnd();
          rej(error);
        },
        onResult: (result) => {
          onProcessEnd();
          res(result);
        },
      };
      withAbsintheSocket.observe(absintheSocket, notifier, observer);
    });
  }

  static async invalidateToken(token) {
    const bearerToken = await getBearerToken();
    await postData(
      {
        url: AUTH_GRAPHQL,
        body: {
          query: GQLMutLogout,
          token,
        },
      },
      noopModel,
      ["volatile.logoutResponse"],
      { headers: { Authorization: bearerToken } }
    );
  }
}
