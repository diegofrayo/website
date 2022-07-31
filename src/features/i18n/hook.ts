// @ts-nocheck

import { useTranslation as useTranslationLibrary } from "react-i18next";

import { T_Locale, T_TranslationFunction } from "./types";

function useTranslation(): {
	t: T_TranslationFunction;
	currentLocale: T_Locale;
} {
	const { t, i18n } = useTranslationLibrary();

	return { t, currentLocale: i18n.language as T_Locale };
}

export default useTranslation;
