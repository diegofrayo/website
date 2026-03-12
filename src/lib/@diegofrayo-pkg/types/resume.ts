export type ResumeDBModel = {
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

export type ResumeEnhancementsDBModel = {
	profilePhoto: string;
	shortName: string;
	location: Location;
	websites: Website[];
	education: Education[];
	experience: {
		company: Omit<Experience["company"], "name">;
		mode: string;
	}[];
	skills: {
		strong: string[];
		intermediate: string[];
		others: string[];
	};
	languages: ResumeDBModel["languages"];
};

export type Resume = {
	profilePhoto: string;
	fullName: string;
	shortName: string;
	headline: string;
	location: Location;
	contactInfo: ContactInfo;
	summary: string;
	education: Education[];
	experience: Experience[];
	skills: ResumeEnhancementsDBModel["skills"];
	languages: ResumeDBModel["languages"];
};

type Location = {
	from: { country: string; city: string };
	currently: { country: string; city: string };
};

type ContactInfo = {
	linkedin: string;
	websites: Website[];
	email: string;
};

type Website = {
	name: string;
	value: string;
};

type Education = {
	id: string;
	school: string;
	schoolWebsite: string;
	schoolLogo: string;
	degree: string;
	startDate: string;
	endDate: string;
};

type Experience = {
	id: string;
	role: string;
	company: {
		name: string;
		logo: string;
		website: string;
	};
	startDate: string;
	endDate: string;
	mode: string;
	description: ResumeExperienceDescription;
};

export type ResumeExperienceDescription = {
	summary: string;
	achievements?: string[];
	skills: string[];
};
