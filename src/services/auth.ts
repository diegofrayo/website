import http from "~/lib/http";
import { isBrowser, isDevelopmentEnvironment } from "~/utils/misc";

class AuthService {
  private LOCAL_STORAGE_KEY = "AUTH";

  constructor() {
    if (isBrowser()) window.localStorage.removeItem("login");
  }

  async signIn(values) {
    return http
      .post(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/auth`, values)
      .then(({ data }) => {
        window.localStorage.setItem(this.LOCAL_STORAGE_KEY, data.token);
      })
      .catch((error) => {
        throw error.response || error;
      });
  }

  isUserLoggedIn(): boolean {
    return !!this.getToken() || isDevelopmentEnvironment();
  }

  getToken() {
    return isBrowser() ? window.localStorage.getItem(this.LOCAL_STORAGE_KEY) || "" : "";
  }

  configureHttpHeaders() {
    http.interceptors.request.use((config) => {
      return {
        ...config,
        headers: {
          ...config.headers,
          ...(config.method === "post" &&
            this.isUserLoggedIn() && {
              Authorization: `Bearer ${this.getToken()}`,
            }),
        },
      };
    });
  }
}

export default new AuthService();
