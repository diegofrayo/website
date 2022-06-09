import http from "~/lib/http";
import type { T_Metadata } from "~/types";

class MetadataService {
  async fetchData(locale): Promise<T_Metadata> {
    const { data: metadata } = await http.get(
      `${process.env["NEXT_PUBLIC_ASSETS_SERVER_URL"]}/metadata.json`,
    );

    return { ...metadata, seo: metadata.seo[locale] } as T_Metadata;
  }
}

export default new MetadataService();
