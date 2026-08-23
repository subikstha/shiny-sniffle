import express from "express";
import authRoutes from "./routes/authRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import subjectRoutes from "./routes/subjectRoutes.ts";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json()); // Without this the server cannot accept JSON payload
app.use(cookieParser()); // Used to read cookies

app.get("/health", (req, res) => {
  res.json({ message: "You reached the API" }).status(200);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subjects", subjectRoutes);

export { app };

export default app;
