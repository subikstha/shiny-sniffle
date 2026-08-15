import { Router } from "express";
import { getAllUsers } from "../controllers/userController.ts";

const router = Router();

router.get("/", getAllUsers);

router.get("/:id", (req, res) => {
  res.status(200).json({
    message: `User with id ${req.params.id}`,
  });
});

export default router;
