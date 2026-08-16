import { createFileRoute } from '@tanstack/react-router'
import StudentHome from '../components/student/StudentHome'

export const Route = createFileRoute('/student-dashboard')({
  component: StudentHome,
})
