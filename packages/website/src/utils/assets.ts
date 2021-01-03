import ASSETS from "~/data/assets.json";

type Assets = Array<"header" | "blog_post" | "footer" | "vr">;

export function getAssets(assets: Assets): string {
  return JSON.stringify(
    assets.reduce((acum: Record<string, Record<string, string>>, assetKey: string) => {
      acum[assetKey] = ASSETS[assetKey];
      return acum;
    }, {}),
  );
}
