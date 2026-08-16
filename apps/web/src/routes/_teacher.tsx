import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { getMe } from '../api/auth'

export const Route = createFileRoute('/_teacher')({
  beforeLoad: async ({ context }) => {
    // Fetch or read cached user state from React Query/API
    const userResponse = await context.queryClient.ensureQueryData({
      queryKey: ['me'],
      queryFn: getMe
    })
    const user = userResponse?.user
    if (!user) {
      throw redirect({ to: '/login' })
    }
    if (user.role !== 'teacher') {
      throw redirect({ to: '/student-dashboard' })
    }
  },
  component: TeacherHome,
})

function TeacherHome() {
  return (
    <div className="flex h-screen">
      {/* Teacher Sidebar / Header */}
      <aside className="w-64 bg-slate-900 text-white p-4">Teacher Portal</aside>

      {/* Active sub-route renders here */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
