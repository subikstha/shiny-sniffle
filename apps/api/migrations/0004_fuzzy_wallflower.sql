ALTER TYPE "public"."user_role" ADD VALUE 'admin';--> statement-breakpoint
CREATE TABLE "subject_offerings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" uuid NOT NULL,
	"teacher_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "role" TO "roles";--> statement-breakpoint
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_student_id_subject_id_date_unique";--> statement-breakpoint
ALTER TABLE "class_schedules" DROP CONSTRAINT "class_schedules_subject_id_day_of_week_unique";--> statement-breakpoint
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_teacher_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_subject_id_subject_id_fk";
--> statement-breakpoint
ALTER TABLE "class_schedules" DROP CONSTRAINT "class_schedules_subject_id_subject_id_fk";
--> statement-breakpoint
ALTER TABLE "notes" DROP CONSTRAINT "notes_teacher_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "notes" DROP CONSTRAINT "notes_subject_id_subject_id_fk";
--> statement-breakpoint
ALTER TABLE "subject" DROP CONSTRAINT "subject_teacher_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "notes_subject_idx";--> statement-breakpoint
DROP INDEX "notes_teacher_idx";--> statement-breakpoint
DROP INDEX "subjects_teacher_idx";--> statement-breakpoint
DROP INDEX "schedules_subject_idx";--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "subject_offering_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "class_schedules" ADD COLUMN "subject_offering_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "subject_offering_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "subject_offerings" ADD CONSTRAINT "subject_offerings_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subject_offerings" ADD CONSTRAINT "subject_offerings_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_subject_offering_id_subject_offerings_id_fk" FOREIGN KEY ("subject_offering_id") REFERENCES "public"."subject_offerings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_schedules" ADD CONSTRAINT "class_schedules_subject_offering_id_subject_offerings_id_fk" FOREIGN KEY ("subject_offering_id") REFERENCES "public"."subject_offerings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_subject_offering_id_subject_offerings_id_fk" FOREIGN KEY ("subject_offering_id") REFERENCES "public"."subject_offerings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attendance_offering_idx" ON "attendance" USING btree ("subject_offering_id");--> statement-breakpoint
CREATE INDEX "notes_offering_idx" ON "notes" USING btree ("subject_offering_id");--> statement-breakpoint
CREATE INDEX "schedules_subject_idx" ON "class_schedules" USING btree ("subject_offering_id");--> statement-breakpoint
ALTER TABLE "attendance" DROP COLUMN "teacher_id";--> statement-breakpoint
ALTER TABLE "attendance" DROP COLUMN "subject_id";--> statement-breakpoint
ALTER TABLE "class_schedules" DROP COLUMN "subject_id";--> statement-breakpoint
ALTER TABLE "notes" DROP COLUMN "teacher_id";--> statement-breakpoint
ALTER TABLE "notes" DROP COLUMN "subject_id";--> statement-breakpoint
ALTER TABLE "subject" DROP COLUMN "teacher_id";--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_subject_offering_id_date_unique" UNIQUE("student_id","subject_offering_id","date");--> statement-breakpoint
ALTER TABLE "class_schedules" ADD CONSTRAINT "class_schedules_subject_offering_id_day_of_week_unique" UNIQUE("subject_offering_id","day_of_week");