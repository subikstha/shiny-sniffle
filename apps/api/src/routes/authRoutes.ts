import { Router } from "express";
import { validateBody } from "../middleware/validation.ts";
import { insertUserSchema } from "../db/schema.ts";

const router = Router();

router.post("/register", validateBody(insertUserSchema), (req, res) => {
  res.status(201).json({ message: "User successfully registered" });
});

router.post("/login", (req, res) => {
  res.status(200).json({ message: "User login success" });
});

export default router;
