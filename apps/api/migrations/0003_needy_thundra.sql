CREATE TABLE "class_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" uuid NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" time,
	"end_time" time,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "class_schedules_subject_id_day_of_week_unique" UNIQUE("subject_id","day_of_week")
);
--> statement-breakpoint
ALTER TABLE "class_schedules" ADD CONSTRAINT "class_schedules_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "schedules_subject_idx" ON "class_schedules" USING btree ("subject_id");