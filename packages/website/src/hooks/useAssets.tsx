import React, { useState, useContext, createContext } from "react";
import Router from "next/router";

import useDidMount from "./useDidMount";

type TypeDefaultValue = {
  HeaderAssets?: {
    SUN: string;
    MOON: string;
  };
  BlogPostAssets?: {
    CALENDAR: string;
    UPDATED: string;
    PERSON: string;
    TWITTER: string;
    LINK: string;
    SOURCE_CODE: string;
    GITHUB: string;
  };
  FooterAssets?: {
    "500_PX": string;
    EMAIL: string;
    GITHUB: string;
    LINKEDIN: string;
    SPOTIFY: string;
    TWITTER: string;
    TWITTER_COLORFUL: string;
  };
  VR_Assets?: {
    SNIPPETS: string;
    INDEX: string;
  };
};

const DEFAULT_VALUE: TypeDefaultValue = {
  HeaderAssets: {
    SUN: "",
    MOON: "",
  },
  BlogPostAssets: {
    CALENDAR: "",
    UPDATED: "",
    PERSON: "",
    TWITTER: "",
    LINK: "",
    SOURCE_CODE: "",
    GITHUB: "",
  },
  FooterAssets: {
    "500_PX": "",
    EMAIL: "",
    GITHUB: "",
    LINKEDIN: "",
    SPOTIFY: "",
    TWITTER: "",
    TWITTER_COLORFUL: "",
  },
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
    (param: TypeDefaultValue) => void,
  ] = useState(DEFAULT_VALUE);

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
