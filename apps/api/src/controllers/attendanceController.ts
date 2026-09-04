import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import { attendance } from "../db/schema.ts";
import db from "../db/connection.ts";
import { and, eq, gte, lte } from "drizzle-orm";
import { format, startOfMonth, endOfMonth } from 'date-fns'

type AttendanceBody = {
  subjectOfferingId: string;

  attendanceRecords: {
    studentId: string;
    date: string;
    status: "present" | "absent";
  }[];
};

export const getBulkAttendance = async (req: AuthenticatedRequest, res: Response) => {
  const { year, month, subjectOfferingId } = req.query;

  const date = new Date(Number(year), Number(month) - 1);

  const startDate = format(startOfMonth(date), "yyyy-MM-dd");
  const endDate = format(endOfMonth(date), "yyyy-MM-dd");

  console.log('Start date and end dates in controller', startDate, endDate);

  try {
    const attendanceRecords = await db.query.attendance.findMany({
      where:
        and(
          eq(attendance.subjectOfferingId, subjectOfferingId),
          gte(attendance.date, startDate),
          lte(attendance.date, endDate)
        )
    })

    return res.status(200).json({
      message: "Attendance records retrieved successfully",
      data: attendanceRecords
    })
  } catch (e) {
    console.error('Error getting attendance data', e)
    return res.status(500).json({ message: "Error getting bulk attendance" })
  }

}

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
