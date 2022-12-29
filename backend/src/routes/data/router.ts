import express from "express";

import { injectControllers } from "~/modules/mvc";

import DataController from "./controller";
import dataControllerMiddleware from "./middleware";

const router = express.Router();
router.use(dataControllerMiddleware);
injectControllers([DataController], router);

export default router;
