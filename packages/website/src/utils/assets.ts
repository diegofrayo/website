import Data from "~/data/assets.json";
import { T_GetAssetsParam } from "~/types";

export function getAssetsURL(assets: T_GetAssetsParam): string {
  return JSON.stringify(
    assets.reduce((acum: Record<string, Record<string, string>>, assetKey: string) => {
      acum[assetKey] = Data[assetKey];
      return acum;
    }, {}),
  );
}
