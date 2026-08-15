import { createLazyFileRoute } from '@tanstack/react-router'
import HomePage from '../components/shared/HomePage'

export const Route = createLazyFileRoute('/')({
  component: HomePage,
})
