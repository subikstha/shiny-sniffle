import { Router } from "express";

const router = Router();

router.post("/register", (req, res) => {
  res.status(201).json({ message: "User successfully registered" });
});

router.post("/login", (req, res) => {
  res.status(200).json({ message: "User login success" });
});

export default router;
