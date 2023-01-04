import express from "express";

const requestBodyParserMiddleware = [
	// for parsing application/json
	express.json(),

	// for parsing application/x-www-form-urlencoded
	express.urlencoded({ extended: true }),
];

export default requestBodyParserMiddleware;
