import http from "~/lib/http";
import { T_MetadataReducer } from "~/types";

class MetadataService {
  async fetchData(locale): Promise<T_MetadataReducer> {
    const { data: metadata } = await http.get(
      `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/metadata.json`,
    );

    return { ...metadata, seo: metadata.seo[locale] } as T_MetadataReducer;
  }
}

export default new MetadataService();
