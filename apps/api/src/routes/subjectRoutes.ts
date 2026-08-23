import { Router } from "express";
import { validateBody } from "../middleware/validation.ts";
import { create, getAllSubjects } from "../controllers/subjectController.ts";
import z from "zod";
import { authenticateToken } from "../middleware/auth.ts";
import { requireRole } from "../middleware/requireRole.ts";

const router = Router();

const createSubjectSchema = z.object({
  subjectName: z.string().min(1, { message: "Subject name is required" }),
  teacherId: z.string().min(1, { message: "Subject must have a teacher" }),
  daysOfWeek: z.array(z.number()),
});

router.get("/", authenticateToken, requireRole(["teacher"]), getAllSubjects);

router.post(
  "/",
  authenticateToken,
  requireRole(["teacher"]),
  validateBody(createSubjectSchema),
  create,
);

export default router;
