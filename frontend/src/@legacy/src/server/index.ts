import http from "~/@legacy/src/lib/http";
import { ENV_VARS } from "~/@legacy/src/constants";

type T_DataLoaderParams = { path: string };

export default async function dataLoader({ path }: T_DataLoaderParams): Promise<unknown> {
	const { data } = await http.get(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}${path}`);

	return data;
}