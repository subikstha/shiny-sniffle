import express from "express";
import authRoutes from "./routes/authRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";

const app = express();

app.get("/health", (req, res) => {
  res.json({ message: "You reached the API" }).status(200);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export { app };

export default app;
