import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { getMe } from "../api/auth";
import TeacherSidebar from "../components/teacher/TeacherSidebar";

export const Route = createFileRoute("/_teacher")({
  beforeLoad: async ({ context }) => {
    // Fetch or read cached user state from React Query/API
    const userResponse = await context.queryClient.ensureQueryData({
      queryKey: ["me"],
      queryFn: getMe,
    });
    const user = userResponse?.user;
    if (!user) {
      throw redirect({ to: "/login" });
    }
    if (user.role !== "teacher") {
      throw redirect({ to: "/student-dashboard" });
    }
  },
  component: TeacherHome,
});

function TeacherHome() {
  return (
    <div className="flex h-screen">
      {/* Teacher Sidebar / Header */}
      <TeacherSidebar />
      {/* Active sub-route renders here */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
