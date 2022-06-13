import http from "~/lib/http";
import { isBrowser } from "~/utils/app";
import { ENV_VARS } from "~/utils/constants";
import { isNotEmptyString, isObject } from "~/utils/validations";
import type { T_UnknownObject } from "~/types";

class AuthService {
  private LOCAL_STORAGE_KEY = "DFR_AUTH";

  async signIn(values: T_UnknownObject): Promise<void> {
    return http
      .post(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
        path: "/auth",
        payload: values,
      })
      .then(({ data }: { data: { token: string } }) => {
        window.localStorage.setItem(this.LOCAL_STORAGE_KEY, data.token);
      })
      .catch((error) => {
        throw error.response || error;
      });
  }

  isUserLoggedIn(): boolean {
    return isNotEmptyString(this.getToken());
  }

  getToken(): string {
    return isBrowser() ? window.localStorage.getItem(this.LOCAL_STORAGE_KEY) || "" : "";
  }

  isSignInError(error: unknown): error is T_SignInError {
    if (isObject(error)) {
      return isNotEmptyString((error as T_SignInError).data?.code);
    }

    return false;
  }

  configureHttpHeaders(): void {
    http.interceptors.request.use((config) => ({
      ...config,
      headers: {
        ...config.headers,
        ...(config.method === "post" && this.isUserLoggedIn()
          ? {
              Authorization: `Bearer ${this.getToken()}`,
            }
          : {}),
      },
    }));
  }
}

export default new AuthService();

// --- Types ---

type T_SignInError = {
  data: {
    code: "AUTH_WRONG_PASSWORD";
  };
};
