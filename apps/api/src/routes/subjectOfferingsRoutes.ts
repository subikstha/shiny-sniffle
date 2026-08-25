import { Router } from "express";
import { authenticateToken } from "../middleware/auth.ts";
import { validateBody } from "../middleware/validation.ts";
import { create } from "../controllers/subjectOfferingController.ts";
import z from "zod";

const router = Router();

const createSubjectOfferingSchema = z.object({
  subjectId: z.string().min(1, { message: "subject id is required" }),
  startDate: z.string().min(1, { message: "subject start date is required" }),
  teacherId: z.string().min(1, { message: "Teacher id is required" }),
  endDate: z.string().min(1, { message: "subject end date is required" }),
  daysOfWeek: z.array(z.number()),
});

router.post(
  "/",
  authenticateToken,
  validateBody(createSubjectOfferingSchema),
  create,
);

export default router;
