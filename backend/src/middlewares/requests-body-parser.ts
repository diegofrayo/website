import express from "express";

export default [
	// for parsing application/json
	express.json(),

	// for parsing application/x-www-form-urlencoded
	express.urlencoded({ extended: true }),
];
