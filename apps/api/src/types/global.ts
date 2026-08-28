import { z } from "zod";

// Single student record schema
const attendanceRecordSchema = z.object({
  studentId: z.string().uuid({
    message: "Invalid student ID format",
  }),

  date: z.string().min(1, {
    message: "Attendance date is required",
  }),

  status: z.enum(["present", "absent"]),
});

export const bulkAttendanceRecordsSchema = z.object({
  subjectOfferingId: z.string().uuid({
    message: "Invalid subject offering ID format",
  }),

  attendanceRecords: z.array(attendanceRecordSchema).min(1, {
    message: "At least one attendance record is required",
  }),
});

// Bulk payload schema
// export const bulkAttendanceSchema = z.object({
//   subjectId: z.string().uuid("Invalid subject ID format"),
//   date: z
//     .string()
//     .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
//   records: z
//     .array(attendanceRecordSchema)
//     .min(1, "At least one attendance record is required"),
// });

// Type export for controller usage
export type BulkAttendanceInput = z.infer<typeof bulkAttendanceRecordsSchema>;
