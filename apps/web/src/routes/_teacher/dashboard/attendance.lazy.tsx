import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_teacher/dashboard/attendance')({
  component: () => <div>Hello /_teacher/dashboard/attendance!</div>,
})
