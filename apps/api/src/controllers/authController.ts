import type { Request, Response } from "express";
import { db } from "../db/connection.ts";
import { users, type NewUser } from "../db/schema.ts";
import { generateToken } from "../utils/jwt.ts";
import { comparePassword, hashPassword } from "../utils/password.ts";
import { eq } from "drizzle-orm";

export const register = async (req: Request, res: Response) => {
  try {
    const hashedPassword = hashPassword(req.body.password);

    const [user] = await db
      .insert(users)
      .values({ ...req.body, password: hashedPassword })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
        role: users.role,
      });
    // Now sign in the user using JWT token
    const token = await generateToken({
      id: user.id,
      role: user.role || "student",
      email: user.email,
    });

    res.status(201).json({
      message: "User created",
      user,
      token,
    });
  } catch (e) {
    console.error("Registration Error", e);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = await generateToken({
      role: user.role || "student",
      email: user.email,
      id: user.id,
    });

    return res.status(201).json({
      message: "Login Succesful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (e) {
    console.error("Login Error", e);
    res.status(500).json({ error: "Failed to login" });
  }
};
