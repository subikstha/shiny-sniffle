import { Router } from "express";
import { recordBulkAttendance } from "../controllers/attendanceController.ts";
import { authenticateToken } from "../middleware/auth.ts";
import { requireRole } from "../middleware/requireRole.ts";
import { validateBody } from "../middleware/validation.ts";
import { bulkAttendanceRecordsSchema } from "../types/global.ts";

const router = Router();

router.post(
  "/bulk",
  authenticateToken,
  requireRole(["teacher"]),
  validateBody(bulkAttendanceRecordsSchema),
  recordBulkAttendance,
);

export default router;
