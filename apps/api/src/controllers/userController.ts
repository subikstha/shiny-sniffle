import type { Request, Response } from "express";
import { db } from "../db/connection.ts";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import { users } from "../db/schema.ts";
import { asc, eq } from "drizzle-orm";
export async function getAllUsers(req: Request, res: Response) {
  try {
    const allUsers = await db.query.users.findMany();
    return res.status(200).json({
      message: "All users retrieved successfully",
      data: allUsers,
    });
  } catch (e) {
    console.error("Error getting users", e);
    return res
      .status(500)
      .json({ message: "Something went wrong when getting all users" });
  }
}

export async function getAllStudents(req: AuthenticatedRequest, res: Response) {
  try {
    const allStudents = await db.query.users.findMany({
      where: eq(users.role, 'student'),
      orderBy: asc(users.firstName),
      columns: {
        password: false // Exclude the password field
      }
    })
    return res.status(200).json({ data: allStudents })
  } catch (e) {
    console.error("Error getting all students", e);
    return res.status(500).json({ message: "Something went wrong when getting all the students" })
  }
}
