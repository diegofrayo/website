import { ENV_VARS } from "~/constants";
import { T_Locale } from "~/features/i18n";
import http from "~/lib/http";
import { T_Metadata } from "~/stores/modules/metadata";

class MetadataService {
	static async fetchData(locale: T_Locale): Promise<T_Metadata> {
		const { data: metadata } = await http.get(
			`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/metadata.json`,
		);

		return { ...metadata, seo: metadata.seo[locale] } as T_Metadata;
	}
}

export default MetadataService;