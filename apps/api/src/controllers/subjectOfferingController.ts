import db from "../db/connection.ts";
import { classSchedules, subjectOfferings } from "../db/schema.ts";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import type { Response } from "express";

export const getAll = async function (
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const allSubjectOfferings = await db.query.subjectOfferings.findMany({
      with: {
        schedules: true,
        subject: {
          columns: {
            subjectName: true,
          },
        },
      },
    });
    console.log("Subject offerings in node", allSubjectOfferings);

    return res.status(200).json({
      message: "Subject offerings got successfully",
      data: allSubjectOfferings,
    });
  } catch (e) {
    console.error("Failed to get all subject offerings", e);
    return res.status(500).json({ message: "Failed to get subject offerings" });
  }
};

export const create = async function (
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { subjectId, startDate, endDate, daysOfWeek, teacherId } = req.body;
    const result = await db.transaction(async (tx) => {
      const [subjectOffering] = await tx
        .insert(subjectOfferings)
        .values({
          subjectId,
          teacherId,
          startDate,
          endDate,
        })
        .returning();

      // Prepare for bulk class schedule insert
      const scheduleRecords = daysOfWeek.map((day: number) => ({
        subjectOfferingId: subjectOffering.id,
        dayOfWeek: day,
      }));

      const createdClassSchedules = await tx
        .insert(classSchedules)
        .values(scheduleRecords)
        .returning();

      return {
        ...subjectOffering,
        classSchedules: createdClassSchedules,
      };
    });

    console.log("Subject offering created'", result);

    return res
      .status(201)
      .json({ message: "Subject offering created successfully", data: result });
  } catch (e) {
    console.error("Failed to create subject offering", e);
    return res
      .status(500)
      .json({ message: "Failed to create subject offering" });
  }
};
