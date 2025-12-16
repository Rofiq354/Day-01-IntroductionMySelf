import express from "express";
import * as authControllers from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", authControllers.handleRegister);
router.post("/login", authControllers.handleLogin);
router.post("/logout", authControllers.logout);

export default router;
