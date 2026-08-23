import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_teacher/teacher-dashboard/')({
  component: () => <div>Hello /_teacher/dashboard/!</div>,
})
