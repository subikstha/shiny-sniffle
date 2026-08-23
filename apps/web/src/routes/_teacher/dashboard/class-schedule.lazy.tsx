import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_teacher/dashboard/class-schedule')({
  component: () => <div>Hello /_teacher/dashboard/class-schedule!</div>,
})
