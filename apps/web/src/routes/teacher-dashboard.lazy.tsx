import { createLazyFileRoute } from "@tanstack/react-router";
import TeacherHome from "../components/teacher/TeacherHome";

export const Route = createLazyFileRoute("/teacher-dashboard")({
  component: TeacherHome,
});
