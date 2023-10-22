import http from "~/lib/http";

const ServerAPI = http.create({
	baseURL: "/api/server",
});

ServerAPI.interceptors.request.use((config) => {
	return {
		...config,
		data: {
			...config.data,
			$_ACTION: config.url,
		},
		url: "",
	};
});

export default ServerAPI;
