import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_student/dashboard/')({
  component: () => <div>Hello /_student/dashboard/!</div>,
})
