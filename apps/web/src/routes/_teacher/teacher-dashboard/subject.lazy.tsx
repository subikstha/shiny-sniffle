import { createLazyFileRoute } from "@tanstack/react-router";
import Subject from "../../../components/subject/Subject";

export const Route = createLazyFileRoute("/_teacher/teacher-dashboard/subject")(
  {
    component: Subject,
  },
);
