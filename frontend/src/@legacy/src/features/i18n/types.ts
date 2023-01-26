// @ts-nocheck

import type { T_JSON, T_Object } from "~/@legacy/src/types";

export type T_Locale = "en";

export type T_PageContent = {
	seo?: T_JSON;
	page?: T_Object & {
		common?: T_JSON;
		config?: T_JSON;
	};
	layout?: {
		header?: T_JSON;
		footer?: T_JSON;
	};
};

export type T_TranslationFunction = (key: string, params?: T_Object) => string;
