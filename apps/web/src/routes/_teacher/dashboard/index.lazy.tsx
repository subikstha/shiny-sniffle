import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_teacher/dashboard/')({
  component: () => <div>Hello /_teacher/dashboard/!</div>,
})
