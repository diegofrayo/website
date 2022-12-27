export const MODELS = [
	{ private: true, name: "contacts" },
	{ private: true, name: "timeline" },
	{ private: true, name: "films" },
	{ private: true, name: "books" },
	{ private: false, name: "about-me" },
	{ private: false, name: "resume" },
];

export function isPrivateModel(model: string): boolean {
	return MODELS.find((item) => item.name === model)?.private === true;
}
