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
  smallint,
  time,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const roleEnum = pgEnum("user_role", ["teacher", "student", "admin"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Auth core ()
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  roles: roleEnum("roles").array().notNull().default(["student"]),
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

export const subject = pgTable("subject", {
  id: uuid("id").primaryKey().defaultRandom(),
  subjectName: varchar("subject_name", { length: 255 }).notNull().unique(),
  // Metadata and timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const subjectOfferings = pgTable("subject_offerings", {
  id: uuid("id").primaryKey().defaultRandom(),
  subjectId: uuid("subject_id")
    .notNull()
    .references(() => subject.id, {
      onDelete: "cascade",
    }),
  teacherId: uuid("teacher_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  // Metadata and timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const classSchedules = pgTable(
  "class_schedules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subjectOfferingId: uuid("subject_offering_id")
      .notNull()
      .references(() => subjectOfferings.id, { onDelete: "cascade" }),

    // Single integer day (0 = Sun, 1 = Mon, ..., 6 = Sat)
    dayOfWeek: integer("day_of_week").notNull(),

    // Specific time for THIS day
    startTime: time("start_time"),
    endTime: time("end_time"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("schedules_subject_idx").on(table.subjectOfferingId),
    // Ensures a subject can't have duplicate schedule entries for the same day
    unique().on(table.subjectOfferingId, table.dayOfWeek),
  ],
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
    subjectOfferingId: uuid("subject_offering_id")
      .notNull()
      .references(() => subjectOfferings.id, { onDelete: "cascade" }),

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
    unique().on(table.studentId, table.subjectOfferingId, table.date),

    index("attendance_student_idx").on(table.studentId),

    index("attendance_offering_idx").on(table.subjectOfferingId),
  ],
);

export const notes = pgTable(
  "notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subjectOfferingId: uuid("subject_offering_id")
      .notNull()
      .references(() => subjectOfferings.id, { onDelete: "cascade" }),
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
  (table) => [index("notes_offering_idx").on(table.subjectOfferingId)],
);

// Relations
export const userRelations = relations(users, ({ many }) => ({
  subjectOfferingsTaught: many(subjectOfferings),
  studentAttendances: many(attendance, { relationName: "student_attendance" }),
}));

export const subjectRelations = relations(subject, ({ many }) => ({
  offerings: many(subjectOfferings),
}));

export const subjectOfferingsRelations = relations(
  subjectOfferings,
  ({ one, many }) => ({
    subject: one(subject, {
      fields: [subjectOfferings.subjectId],
      references: [subject.id],
    }),
    teacher: one(users, {
      fields: [subjectOfferings.teacherId],
      references: [users.id],
    }),
    notes: many(notes),
    attendances: many(attendance),
    schedules: many(classSchedules),
  }),
);

export const notesRelations = relations(notes, ({ one }) => ({
  subjectOffering: one(subjectOfferings, {
    fields: [notes.subjectOfferingId],
    references: [subjectOfferings.id],
  }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(users, {
    fields: [attendance.studentId],
    references: [users.id],
    relationName: "student_attendance",
  }),
  subjectOffering: one(subjectOfferings, {
    fields: [attendance.subjectOfferingId],
    references: [subjectOfferings.id],
  }),
}));

// Add schedule relations
export const subjectSchedulesRelations = relations(
  classSchedules,
  ({ one }) => ({
    subjectOffering: one(subjectOfferings, {
      fields: [classSchedules.subjectOfferingId],
      references: [subjectOfferings.id],
    }),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Subject = typeof subject.$inferSelect;
export type NewSubject = typeof subject.$inferInsert;
export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;

// ZOD schemas for runtime
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertSubjectSchema = createInsertSchema(subject);
export const selectSubjectSchema = createSelectSchema(subject);
export const insertAttendanceSchema = createInsertSchema(attendance);
export const selectAttendanceSchema = createSelectSchema(attendance);
export const insertNotesSchema = createInsertSchema(notes);
export const selectNotesSchema = createSelectSchema(notes);
