import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "All users here" });
});

router.get("/:id", (req, res) => {
  res.status(200).json({
    message: `User with id ${req.params.id}`,
  });
});

export default router;
