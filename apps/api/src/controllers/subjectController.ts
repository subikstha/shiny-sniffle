import db from "../db/connection.ts";
import { classSchedules, subject } from "../db/schema.ts";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import type { Response } from "express";

export const create = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { subjectName, daysOfWeek, teacherId } = req.body;
    const result = await db.transaction(async (tx) => {
      const [newSubject] = await tx
        .insert(subject)
        .values({
          subjectName,
          teacherId,
        })
        .returning();
      // Prepare bulk insert for subject schedules
      const scheduleRecords = daysOfWeek.map((day: number) => ({
        subjectId: newSubject.id,
        dayOfWeek: day,
      }));

      //   Bulk insert query
      const createdClassSchedules = await tx
        .insert(classSchedules)
        .values(scheduleRecords)
        .returning();

      return {
        ...newSubject,
        schedules: createdClassSchedules,
      };
    });

    return res.status(201).json({
      message: "Subject and schedule created successfully",
      data: result,
    });
  } catch (e) {
    console.error("Failed to create subject", e);
    return res.status(500).json({ message: "Failed to create subject" });
  }
};
