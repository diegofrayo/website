import { dataLoader } from "~/server";
import { T_MetadataReducer, T_Object } from "~/types";

class MetadataService {
  async fetchData(locale): Promise<T_MetadataReducer> {
    const metadata = (await dataLoader({
      path: `/metadata.json`,
    })) as T_Object;

    return { ...metadata, seo: metadata.seo[locale] } as T_MetadataReducer;
  }
}

export default new MetadataService();
