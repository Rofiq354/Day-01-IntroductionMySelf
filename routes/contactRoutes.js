import express from "express";

import * as contactControllers from "../controllers/contactControllers.js";

const router = express.Router();

router.get("/", contactControllers.index);

export default router;
