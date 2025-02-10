import express from "express";
import { login, authCallback } from "../controllers/authController.js";

const router = express.Router();

router.get("/login", login);
router.get("/callback", authCallback);

export default router;
