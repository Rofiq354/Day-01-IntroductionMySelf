import express from "express";
import upload from "../helper/multerStorage.js";
import * as ProjectControllers from "../controllers/projectsControllers.js";

const router = express.Router();

router.get("/", ProjectControllers.getProjects);
router.get("/:id", ProjectControllers.getDetailProject);
router.post("/", upload.single("image"), ProjectControllers.addProject);
router.get("/:id/edit", ProjectControllers.editProject);
router.put("/:id", upload.single("image"), ProjectControllers.updateProject);
router.delete("/:id", ProjectControllers.deleteProject);

export default router;
