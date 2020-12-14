class HTTP {
  static get(route, headers) {
    return this.xhr(route, null, "GET", headers);
  }

  static put(route, params, headers) {
    return this.xhr(route, params, "PUT", headers);
  }

  static post(route, params, headers) {
    return this.xhr(route, params, "POST", headers);
  }

  static delete(route, params, headers) {
    return this.xhr(route, params, "DELETE", headers);
  }

  static xhr(route, params, verb, headers) {
    const url = route;
    const options = {
      method: verb,
      headers,
      ...(params ? { body: JSON.stringify(params) } : {}),
    };

    return fetch(url, options)
      .then((response) => {
        let body;
        let contentType = "";

        if (
          response &&
          response.headers &&
          response.headers._headers && // eslint-disable-line
          Array.isArray(response.headers._headers["content-type"]) // eslint-disable-line
        ) {
          // eslint-disable-next-line
          contentType = response.headers._headers["content-type"].join(";");
        } else if (options.headers && options.headers["content-type"]) {
          contentType = options.headers["content-type"];
        }

        if (contentType.indexOf("json") !== -1) {
          body = response.json();
        } else {
          body = response.text();
        }

        return body.then((content) => {
          if (response.status >= 200 && response.status < 300 && response.ok)
            return content;
          throw content || response.statusText;
        });
      })
      .catch(Promise.reject.bind(Promise));
  }
}

export default HTTP;
