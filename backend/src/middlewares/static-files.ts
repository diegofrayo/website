import express from "express";

const staticFilesMiddleware = [express.static("public")];

export default staticFilesMiddleware;
