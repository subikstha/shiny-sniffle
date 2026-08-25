import { eq } from "drizzle-orm";
import db from "../db/connection.ts";
import { classSchedules, subject } from "../db/schema.ts";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import type { Response } from "express";

export const getAllSubjects = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const allSubjects = await db.query.subject.findMany();
    return res.status(200).json({
      message: "All subjects retrieved successfully",
      data: allSubjects,
    });
  } catch (e) {
    console.error("Failed to get subjects", e);
    return res.status(500).json({ message: "Failed to get all subject" });
  }
};

export const getSubject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { subjectId } = req.params;
    if (!subjectId) throw new Error("subjectId is required");
    const result = await db.query.subject.findFirst({
      where: eq(subject.id, subjectId),
    });

    return res.status(200).json({
      message: "Subject found",
      data: result,
    });
  } catch (e) {
    console.error("Failed to get the subject", e);
    return res.status(500).json({ message: "Failed to get the subject" });
  }
};

export const create = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { subjectName } = req.body;
    const [newSubject] = await db
      .insert(subject)
      .values({
        subjectName,
      })
      .returning();

    return res.status(201).json({
      message: "Subject created successfully",
      data: newSubject,
    });
  } catch (e) {
    console.error("Failed to create subject", e);
    return res.status(500).json({ message: "Failed to create subject" });
  }
};

// export const create = async (req: AuthenticatedRequest, res: Response) => {
//   try {
//     const { subjectName, daysOfWeek, teacherId } = req.body;
//     const result = await db.transaction(async (tx) => {
//       const [newSubject] = await tx
//         .insert(subject)
//         .values({
//           subjectName,
//           teacherId,
//         })
//         .returning();
//       // Prepare bulk insert for subject schedules
//       const scheduleRecords = daysOfWeek.map((day: number) => ({
//         subjectId: newSubject.id,
//         dayOfWeek: day,
//       }));

//       //   Bulk insert query
//       const createdClassSchedules = await tx
//         .insert(classSchedules)
//         .values(scheduleRecords)
//         .returning();

//       return {
//         ...newSubject,
//         schedules: createdClassSchedules,
//       };
//     });

//     return res.status(201).json({
//       message: "Subject and schedule created successfully",
//       data: result,
//     });
//   } catch (e) {
//     console.error("Failed to create subject", e);
//     return res.status(500).json({ message: "Failed to create subject" });
//   }
// };
