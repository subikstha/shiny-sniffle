import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  unique,
  pgEnum,
  date,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const roleEnum = pgEnum("user_role", ["teacher", "student"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Auth core ()
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: roleEnum("role").default("student"),
  // Profile data
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  // Metadata and timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const subject = pgTable(
  "subject",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subjectName: varchar("subject_name", { length: 255 }).notNull().unique(),
    // Foreign key to teacher
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    // Metadata and timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  // This creates a database index on the teacherId column
  (table) => [index("subjects_teacher_idx").on(table.teacherId)],
);

export const attendanceEnum = pgEnum("attendance_status", [
  "present",
  "absent",
  "late",
]);

export const attendance = pgTable(
  "attendance",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Core foreign ids
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subject.id, { onDelete: "cascade" }),

    // Attendance details
    date: date("date", { mode: "string" }).notNull(), // Stores "YYYY-MM-DD"
    status: attendanceEnum("status").notNull().default("present"),
    remarks: text("remarks"),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    // Prevents double-marking the same student for the same subject on the same day
    unique().on(table.studentId, table.subjectId, table.date),
    index("attendance_student_idx").on(table.studentId),
  ],
);

export const notes = pgTable(
  "notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Foreign keys
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subject.id, { onDelete: "cascade" }),
    // Core metadata
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content"),
    lessonName: varchar("lesson_name", { length: 255 }),
    fileUrl: text("file_url"),
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("notes_subject_idx").on(table.subjectId),
    index("notes_teacher_idx").on(table.teacherId),
  ],
);

// Relations
export const userRelations = relations(users, ({ many }) => ({
  subjectsTaught: many(subject),
  notesCreated: many(notes),
  studentAttendances: many(attendance, { relationName: "student_attendance" }),
  teacherAttendances: many(attendance, { relationName: "teacher_attendance" }),
}));

export const subjectRelations = relations(subject, ({ one, many }) => ({
  teacher: one(users, {
    fields: [subject.teacherId],
    references: [users.id],
  }),
  notes: many(notes),
  attendances: many(attendance),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  teacher: one(users, {
    fields: [notes.teacherId],
    references: [users.id],
  }),
  subject: one(subject, {
    fields: [notes.subjectId],
    references: [subject.id],
  }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(users, {
    fields: [attendance.studentId],
    references: [users.id],
    relationName: "student_attendance",
  }),
  teacher: one(users, {
    fields: [attendance.teacherId],
    references: [users.id],
    relationName: "teacher_attendance",
  }),
  subject: one(subject, {
    fields: [attendance.subjectId],
    references: [subject.id],
  }),
}));
