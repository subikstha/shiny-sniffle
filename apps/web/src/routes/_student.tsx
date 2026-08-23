import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_student")({
  component: StudentHome,
});

function StudentHome() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-slate-900 text-white p-4">Student Portal</aside>
      {/* Active sub-route renders here */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
