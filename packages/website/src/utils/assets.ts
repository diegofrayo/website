import Data from "~/data/assets.json";
import { T_GetAssetsParam, T_Object } from "~/types";

export function getAssetsURL(assets: T_GetAssetsParam): string {
  return JSON.stringify(
    assets.reduce((result: T_Object<T_Object<string>>, assetKey: string) => {
      result[assetKey] = Data[assetKey];
      return result;
    }, {}),
  );
}
