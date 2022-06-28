import http from "~/lib/http";
import { ENV_VARS } from "~/utils/constants";

type T_DataLoaderParams = { path: string };

export default async function dataLoader({ path }: T_DataLoaderParams): Promise<unknown> {
	const { data } = await http.get(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}${path}`);

	return data;
}
