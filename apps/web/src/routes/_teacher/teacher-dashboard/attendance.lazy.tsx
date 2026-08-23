import { createLazyFileRoute } from '@tanstack/react-router'
import Calendar from '../../../components/calendar/Calendar'
import CalendarProvider from '../../../components/calendar/CalendarProvider'

export const Route = createLazyFileRoute(
  '/_teacher/teacher-dashboard/attendance',
)({
  component: () => (
    <div>
      <CalendarProvider>
        <Calendar />
      </CalendarProvider>
    </div>
  ),
})
