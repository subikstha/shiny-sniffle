import { createLazyFileRoute } from "@tanstack/react-router";
import SubjectOffering from "../../../../components/subject/SubjectOffering";

export const Route = createLazyFileRoute(
  "/_teacher/teacher-dashboard/subject-offering/$subjectId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { subjectId } = Route.useParams();
  return <SubjectOffering subjectId={subjectId} />;
}
