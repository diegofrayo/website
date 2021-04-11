import React, { useState, useContext, createContext } from "react";
import { Router } from "next/router";

import useDidMount from "./useDidMount";
import { T_ReactChildrenProp, T_ReactElement } from "~/types";

type T_DefaultValue = {
  VR_Assets: {
    SNIPPETS: string;
    INDEX: string;
  };
};

const DEFAULT_VALUE: T_DefaultValue = {
  VR_Assets: {
    SNIPPETS: "",
    INDEX: "",
  },
};
const AssetsContext = createContext<T_DefaultValue>(DEFAULT_VALUE);
const useAssetsContext = (): T_DefaultValue => useContext<T_DefaultValue>(AssetsContext);

export function AssetsProvider({ children }: { children: T_ReactChildrenProp }): T_ReactElement {
  const [assets, setAssets] = useState<T_DefaultValue>(DEFAULT_VALUE);

  useDidMount(() => {
    updateAssets();

    Router.events.on("routeChangeComplete", function routeChangeComplete() {
      updateAssets();
    });
  });

  function updateAssets() {
    try {
      const assetsElement = document.getElementById("assets") || { innerHTML: "" };
      const data = JSON.parse(assetsElement.innerHTML);

      setAssets({
        VR_Assets: data.vr || {},
      });
    } catch (error) {
      console.error("Error updating assets url");
      console.error(error);
    }
  }

  return <AssetsContext.Provider value={assets}>{children}</AssetsContext.Provider>;
}

export default useAssetsContext;
