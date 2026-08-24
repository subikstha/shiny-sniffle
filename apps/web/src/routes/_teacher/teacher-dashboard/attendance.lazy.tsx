import { createLazyFileRoute } from "@tanstack/react-router";
import AttendanceHome from "../../../components/calendar/AttendanceHome";

export const Route = createLazyFileRoute(
  "/_teacher/teacher-dashboard/attendance",
)({
  component: AttendanceHome,
});
