import { Router } from "express";
import { updateBulkAttendance } from "../controllers/attendanceController";

const router = Router();

router.post("/bulk", updateBulkAttendance);
