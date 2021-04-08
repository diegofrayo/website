import React, { useState, useContext, createContext, SetStateAction } from "react";
import Router from "next/router";

import useDidMount from "./useDidMount";

type TypeDefaultValue = {
  VR_Assets: {
    SNIPPETS: string;
    INDEX: string;
  };
};

const DEFAULT_VALUE: TypeDefaultValue = {
  VR_Assets: {
    SNIPPETS: "",
    INDEX: "",
  },
};
const AssetsContext = createContext(DEFAULT_VALUE);
const useAssetsContext = () => useContext(AssetsContext);

export function AssetsProvider({ children }: any): any {
  const [assets, setAssets]: [
    TypeDefaultValue,
    React.Dispatch<SetStateAction<TypeDefaultValue>>,
  ] = useState(DEFAULT_VALUE);

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
