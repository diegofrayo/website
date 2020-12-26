import ASSETS from "~/data/assets.json";

export function getAssets(assets): string {
  return JSON.stringify(
    assets.reduce((acum, assetKey) => {
      acum[assetKey] = ASSETS[assetKey];
      return acum;
    }, {}),
  );
}
