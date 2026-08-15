import { createLazyFileRoute } from '@tanstack/react-router'
import StudentHome from '../components/student/StudentHome'

export const Route = createLazyFileRoute('/student-dashboard')({
  component: StudentHome,
})
