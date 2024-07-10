import * as React from "react";

const IntlProviderValue = {
	EN: {
		EXPERIENCE: "Experience",
		EDUCATION: "Education",
		OTHER: "Other",
		LANGUAGES: "Languages",
		SKILLS: "Skills",
		SKILLS_L1: "I usually work with",
		SKILLS_L2: "I have an considerable experience with",
		SKILLS_L3: "I once worked with",
	},
	ES: {
		EXPERIENCE: "Experiencia",
		EDUCATION: "Educación",
		OTHER: "Otros",
		LANGUAGES: "Idiomas",
		SKILLS: "Habilidades",
		SKILLS_L1: "Usualmente trabajo con",
		SKILLS_L2: "Tengo considerable experiencia con",
		SKILLS_L3: "Alguna vez trabajé con",
	},
};

const IntlContext = React.createContext(
	{} as (typeof IntlProviderValue)[keyof typeof IntlProviderValue],
);

function useIntl() {
	return React.useContext(IntlContext);
}

export { IntlContext, IntlProviderValue, useIntl };
