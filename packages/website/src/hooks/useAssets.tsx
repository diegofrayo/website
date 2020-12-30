import React, { useState, useContext, createContext } from "react";
import Router from "next/router";

import useDidMount from "./useDidMount";

const DEFAULT_VALUE: Record<string, any> = {
  HeaderAssets: {},
  BlogPostAssets: {},
  FooterAssets: {},
  VR_Assets: {},
};
const AssetsContext = createContext(DEFAULT_VALUE);
const useAssetsContext = () => useContext(AssetsContext);

export function AssetsProvider({ children }: Record<string, any>): any {
  const [assets, setAssets] = useState(DEFAULT_VALUE);

  useDidMount(() => {
    updateAssets();

    Router.events.on("routeChangeComplete", function routeChangeComplete() {
      updateAssets();
    });
  });

  function updateAssets() {
    try {
      const data = JSON.parse(document.getElementById("assets").innerHTML);

      setAssets({
        HeaderAssets: data.header || {},
        BlogPostAssets: data.blog_post || {},
        FooterAssets: data.footer || {},
        VR_Assets: data.vr || {},
      });
    } catch (e) {
      console.error(e);
    }
  }

  return <AssetsContext.Provider value={assets}>{children}</AssetsContext.Provider>;
}

export default useAssetsContext;
