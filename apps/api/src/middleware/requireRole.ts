import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./auth.ts";

export const requireRole = (
  allowedRoles: Array<"teacher" | "student" | "admin">,
) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Sort the arrays
    const sortedAllowedRoles = allowedRoles.sort();
    const sortedUserRoles = req.user.roles.sort();

    if (
      !sortedAllowedRoles.every(
        (role, index) => role === sortedUserRoles[index],
      )
    ) {
      return res
        .status(403)
        .json({ error: "Forbidden! Insufficient permissions" });
    }

    next();
  };
};
