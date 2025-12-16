import express from "express";
import * as ProjectControllers from "../controllers/projectsControllers.js";

const router = express.Router();

router.get("/", ProjectControllers.getProjects);
router.get("/:id", ProjectControllers.getDetailProject);
router.post("/", ProjectControllers.addProject);
router.get("/:id/edit", ProjectControllers.editProject);
router.put("/:id", ProjectControllers.updateProject);

export default router;
