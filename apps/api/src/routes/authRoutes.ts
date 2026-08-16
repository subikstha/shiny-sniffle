import { Router } from "express";
import { validateBody } from "../middleware/validation.ts";
import { insertUserSchema } from "../db/schema.ts";
import {
  login,
  register,
  getMe,
  logout,
} from "../controllers/authController.ts";
import { loginSchema } from "../types/auth.ts";
import { authenticateToken } from "../middleware/auth.ts";

const router = Router();

router.post("/register", validateBody(insertUserSchema), register);

router.post("/login", validateBody(loginSchema), login);

router.post("/logout", authenticateToken, logout);

router.get("/me", authenticateToken, getMe);

export default router;
