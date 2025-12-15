import express from "express";
import * as ProjectControllers from "../controllers/projectsControllers.js";

const router = express.Router();

router.get("/", ProjectControllers.getProjects);
router.get("/:id", ProjectControllers.getDetailProject);
router.post("/", ProjectControllers.addProject);

export default router;
