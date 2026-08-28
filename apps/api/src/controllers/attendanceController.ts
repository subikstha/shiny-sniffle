import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import { attendance } from "../db/schema.ts";
import db from "../db/connection.ts";

type AttendanceBody = {
  subjectOfferingId: string;

  attendanceRecords: {
    studentId: string;
    date: string;
    status: "present" | "absent";
  }[];
};

export const recordBulkAttendance = async (
  req: AuthenticatedRequest<AttendanceBody>,
  res: Response,
) => {
  const { subjectOfferingId, attendanceRecords } = req.body;

  try {
    const payload = attendanceRecords.map((a) => ({
      studentId: a.studentId,
      subjectOfferingId,
      date: a.date,
      status: a.status,
    }));

    const bulkInsertResult = await db
      .insert(attendance)
      .values(payload)
      .onConflictDoUpdate({
        target: [
          attendance.studentId,
          attendance.date,
          attendance.subjectOfferingId,
        ],
        set: {
          status: attendance.status,
          updatedAt: new Date(),
        },
      })
      .returning();

    return res.status(201).json({
      message: "Attendance recorded successfully",
      data: bulkInsertResult,
    });
  } catch (e) {
    console.error("Bulk Attendance upload error", e);
    return res.status(500).json({ error: "Failed to record attendance" });
  }
};
