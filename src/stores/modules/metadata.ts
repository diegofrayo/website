// @ts-nocheck

import { createSlice } from "@reduxjs/toolkit";

import { T_Store } from "../types";

const REDUCER_NAME = "metadata";

const slice = createSlice({
	name: REDUCER_NAME,
	initialState: {},
	reducers: {},
});

export default slice.reducer;

export { REDUCER_NAME };

// --- SELECTORS ---

export function selectWebsiteMetadata(store: T_Store): T_WebsiteMetadata {
	return store[REDUCER_NAME].website;
}

export function selectSEOMetadata(store: T_Store): T_SEOMetadata {
	return store[REDUCER_NAME].seo;
}

// --- TYPES ---

export type T_Metadata = {
	website: T_WebsiteMetadata;
	seo: T_SEOMetadata;
};

export type T_WebsiteMetadata = {
	email: string;
	fullName: string;
	shortName: string;
	username: string;
	jobTitle: string;
	birthDate: string;
	age: number;
	url: string;
	nationality: string;
	address: {
		"@type": string;
		addressLocality: string;
		addressRegion: string;
		addressCountry: string;
	};
	social: {
		github: string;
		linkedin: string;
		twitter: string;
		instagram: string;
		spotify: string;
		couchsurfing: string;
	};
};

export type T_SEOMetadata = {
	title: string;
	description: string;
};
