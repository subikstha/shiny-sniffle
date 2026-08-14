import { Router } from "express";
import { validateBody } from "../middleware/validation.ts";
import { insertUserSchema } from "../db/schema.ts";
import { login, register } from "../controllers/authController.ts";
import { loginSchema } from "../types/auth.ts";

const router = Router();

router.post("/register", validateBody(insertUserSchema), register);

router.post("/login", validateBody(loginSchema), login);

export default router;
