export interface RawResume {
	contactInfo: ContactInfo;
	summary: string;
	experience: RawExperience[];
	education: Education[];
	languages: Language[];
	skills: Skill[];
}

export interface Resume {
	contactInfo: ContactInfo;
	summary: string;
	experience: Experience[];
	education: Education[];
	languages: Language[];
	skills: Skill[];
}

export interface ContactInfo {
	name: string;
	label: string;
	email: string;
	phone: string;
	image: string;
	website: string;
	location: Location;
	profiles: Profile[];
}

export interface Location {
	countryCode: string;
	address: string;
}

export interface Profile {
	network: string;
	username: string;
	url: string;
}

export type RawExperience = {
	id: string;
	name: string;
	role: string;
	startDate: string;
	endDate: string;
	mode: string;
	location: string;
	shortContent: {
		summary: string;
		achievements: string;
	};
	fullContent: {
		summary: string;
		achievements: string;
	};
	skills: string;
	company: Company;
};

export type Experience = Omit<RawExperience, "shortContent" | "fullContent" | "skills"> & {
	shortContent: {
		summary: string;
		achievements: string[];
	};
	fullContent: {
		summary: string;
		achievements: string[];
	};
	skills: string[];
};

export interface Company {
	logo: string;
	website: string;
	linkedin: string;
}

export interface Education {
	institution: string;
	institutionLogo: string;
	institutionWebsite: string;
	area: string;
	studyType: string;
	startDate: string;
	endDate: string;
}

export interface Language {
	language: string;
	fluency: string;
}

export interface Skill {
	category: string;
	items: string[];
}
