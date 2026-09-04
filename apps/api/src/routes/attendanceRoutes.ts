import { Router } from "express";
import { getBulkAttendance, recordBulkAttendance } from "../controllers/attendanceController.ts";
import { authenticateToken } from "../middleware/auth.ts";
import { requireRole } from "../middleware/requireRole.ts";
import { validateBody } from "../middleware/validation.ts";
import { bulkAttendanceRecordsSchema } from "../types/global.ts";

const router = Router();

router.get("/bulk", authenticateToken, requireRole(["teacher"]), getBulkAttendance)

router.post(
  "/bulk",
  authenticateToken,
  requireRole(["teacher"]),
  validateBody(bulkAttendanceRecordsSchema),
  recordBulkAttendance,
);

export default router;
