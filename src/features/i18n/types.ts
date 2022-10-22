// @ts-nocheck

import type { T_ObjectWithPrimitives, T_Object } from "~/types";

export type T_Locale = "en";

export type T_PageContent = {
	seo?: T_ObjectWithPrimitives;
	page?: T_Object & {
		common?: T_ObjectWithPrimitives;
		config?: T_Object;
	};
	layout?: {
		header?: T_ObjectWithPrimitives;
		footer?: T_ObjectWithPrimitives;
	};
};

export type T_TranslationFunction = (key: string, params?: T_Object) => string;
