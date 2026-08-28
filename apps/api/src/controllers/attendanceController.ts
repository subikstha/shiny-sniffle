import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import { attendance } from "../db/schema.ts";
import db from "../db/connection.ts";
import { sql } from "drizzle-orm";

type AttendanceBody = {
  subjectOfferingId: string;
  studentId: string;
  attendanceRecords: {
    studentId: string;
    attendances: {
      date: string;
      status: "present" | "absent";
    }[];
  }[];
};

export const recordBulkAttendance = async (
  req: AuthenticatedRequest<AttendanceBody>,
  res: Response,
) => {
  const { subjectOfferingId, attendanceRecords } = req.body;
  const teacherId = req.user!.id;

  try {
    const payload = attendanceRecords.flatMap((rec) =>
      rec.attendances.map((att) => ({
        studentId: rec.studentId,
        date: att.date,
        status: att.status,
      })),
    );

    console.log(
      "This is the payload in bulk attendance controller",
      payload,
      payload.length,
    );

    return res
      .status(201)
      .json({ message: "Attendance recorded successfully" });
  } catch (e) {
    console.error("Bulk Attendance upload error", e);
    return res.status(500).json({ error: "Failed to record attendance" });
  }
};
