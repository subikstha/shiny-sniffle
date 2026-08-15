import type { Request, Response } from "express";
import { db } from "../db/connection.ts";
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
