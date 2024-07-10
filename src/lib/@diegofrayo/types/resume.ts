export type T_RawResume = {
	$schema: string;
	basics: {
		name: string;
		label: string;
		image: string;
		email: string;
		phone: string;
		url: string;
		summary: string;
		location: {
			countryCode: string;
			address: string;
		};
		profiles: Array<{
			network: string;
			username: string;
			url: string;
		}>;
	};
	work: Array<{
		name: string;
		position: string;
		startDate: string;
		endDate: string;
		highlights: Array<[]>;
		summary: string;
		url: string;
		location?: string;
	}>;
	volunteer: Array<[]>;
	education: Array<{
		institution: string;
		area: string;
		studyType: string;
		startDate: string;
		endDate: string;
		score: string;
		courses: Array<[]>;
	}>;
	awards: Array<[]>;
	certificates: Array<[]>;
	publications: Array<[]>;
	skills: Array<{
		name: string;
		level: string;
		keywords: Array<[]>;
	}>;
	languages: Array<{
		fluency: string;
		language: string;
	}>;
	interests: Array<[]>;
	references: Array<[]>;
	projects: Array<[]>;
	meta: {
		version: string;
		canonical: string;
	};
};

export type T_RawResumeEnhancements = {
	profilePhoto: string;
	shortName: string;
	location: T_Location;
	websites: T_Website[];
	education: T_Education[];
	experience: Pick<T_Experience, "id" | "companyLogo" | "companyWebsite">[];
	skills: {
		strong: string[];
		intermediate: string[];
		others: string[];
	};
	languages: T_RawResume["languages"];
};

export type T_Resume = {
	profilePhoto: string;
	fullName: string;
	shortName: string;
	headline: string;
	location: T_Location;
	contactInfo: T_ContactInfo;
	summary: string;
	education: T_Education[];
	experience: T_Experience[];
	skills: T_RawResumeEnhancements["skills"];
	languages: T_RawResume["languages"];
};

type T_Location = {
	from: { country: string; city: string };
	currently: { country: string; city: string };
};

type T_ContactInfo = {
	linkedin: string;
	websites: T_Website[];
	email: string;
};

type T_Website = {
	name: string;
	value: string;
};

type T_Education = {
	id: string;
	school: string;
	schoolWebsite: string;
	schoolLogo: string;
	degree: string;
	startDate: string;
	endDate: string;
};

type T_Experience = {
	id: string;
	role: string;
	company: string;
	companyLogo: string;
	companyWebsite: string;
	startDate: string;
	endDate: string;
	description: string;
};
