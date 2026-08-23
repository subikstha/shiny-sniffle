import { Router } from "express";
import {
  getAllUsers,
  getAllStudents,
  getAllTeachers,
} from "../controllers/userController.ts";
import { authenticateToken } from "../middleware/auth.ts";

const router = Router();

router.get("/", authenticateToken, getAllUsers);

router.get("/students", authenticateToken, getAllStudents);

router.get("/teachers", authenticateToken, getAllTeachers);

// router.get("/:id", (req, res) => {
//   res.status(200).json({
//     message: `User with id ${req.params.id}`,
//   });
// });

export default router;
