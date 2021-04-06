import Data from "~/data/assets.json";
import { TypeGetAssetsParam } from "~/types";

export function getAssetsURL(assets: TypeGetAssetsParam): string {
  return JSON.stringify(
    assets.reduce((acum: Record<string, Record<string, string>>, assetKey: string) => {
      acum[assetKey] = Data[assetKey];
      return acum;
    }, {}),
  );
}
