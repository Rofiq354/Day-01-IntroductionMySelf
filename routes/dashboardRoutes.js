import express from "express";

import * as dashboardControllers from "../controllers/dashboardControllers.js";

const router = express.Router();

router.get("/", dashboardControllers.index);

export default router;
