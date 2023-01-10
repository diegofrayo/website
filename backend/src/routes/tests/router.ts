import express from "express";

import environmentProtection from "~/middlewares/environment-protection";
import { injectControllers } from "~/modules/mvc";

import TestsController from "./controller";

const router = express.Router();
router.use(environmentProtection("dev"));
injectControllers([TestsController], router);

export default router;
