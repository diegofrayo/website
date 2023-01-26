import { ENV_VARS } from "~/@legacy/src/constants";
import { T_Locale } from "~/@legacy/src/features/i18n";
import http from "~/@legacy/src/lib/http";
import { T_Metadata } from "~/@legacy/src/stores/modules/metadata";

class MetadataService {
	static async fetchData(locale: T_Locale): Promise<T_Metadata> {
		const { data: metadata } = await http.get(
			`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/metadata.json`,
		);

		return { ...metadata, seo: metadata.seo[locale] } as T_Metadata;
	}
}

export default MetadataService;
