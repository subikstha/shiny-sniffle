import { Link } from "@tanstack/react-router";

function TeacherSidebar() {
  return (
    <aside className="w-64 p-4 flex flex-col gap-4">
      <Link to="/teacher-dashboard/subject">Create Subject</Link>
      <Link to="/teacher-dashboard/attendance" className="">
        Class Attendance
      </Link>
      <Link to="/teacher-dashboard/class-schedule">Set Class Schedule</Link>
    </aside>
  );
}

export default TeacherSidebar;
