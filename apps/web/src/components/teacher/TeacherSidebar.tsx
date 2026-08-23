import { Link } from "@tanstack/react-router";

function TeacherSidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white p-4">
      <Link to="/dashboard/attendance">Class Attendance</Link>
      <Link to="/dashboard/class-schedule">Set Class Schedule</Link>
    </aside>
  );
}

export default TeacherSidebar;
