import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import { attendance } from "../db/schema.ts";
import db from "../db/connection.ts";
import { sql } from "drizzle-orm";

export const recordBulkAttendance = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { subjectId, date, records } = req.body;
  const teacherId = req.user!.id;

  try {
    const payload = records.map(
      (rec: {
        studentId: string;
        status: "present" | "absent" | "late";
        remarks?: string;
      }) => ({
        studentId: rec.studentId,
        teacherId,
        subjectId,
        date,
        status: rec.status,
        remarks: rec.remarks || null,
      }),
    );

    await db
      .insert(attendance)
      .values(payload)
      .onConflictDoUpdate({
        target: [attendance.studentId, attendance.subjectId, attendance.date],
        set: {
          status: sql`EXCLUDED.status`,
          remarks: sql`EXCLUDED.remarks`,
          updatedAt: new Date(),
        },
      });
    return res
      .status(201)
      .json({ message: "Attendance recorded successfully" });
  } catch (e) {
    console.error("Bulk Attendance upload error", e);
    return res.status(500).json({ error: "Failed to record attendance" });
  }
};
