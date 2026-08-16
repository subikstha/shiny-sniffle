import { createLazyFileRoute } from '@tanstack/react-router'
import TeacherHome from '../components/teacher/TeacherHome'

export const Route = createLazyFileRoute('/_teacher/teacher-dashboard')({
  component: TeacherHome,
})
