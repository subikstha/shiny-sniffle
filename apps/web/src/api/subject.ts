export async function getSingleSubject(
  subjectId: string,
): Promise<GetSingleSubjectResponse> {
  const response = await fetch(`/api/subjects/${subjectId}`, {
    credentials: "include",
  });
  const data = await response.json();
  return data;
}

export async function getAllSubjects(): Promise<GetAllSubjectsResponse> {
  const response = await fetch("/api/subjects/", { credentials: "include" });
  const data = await response.json();
  return data;
}

export async function createSubject(subjectName: string) {
  const response = await fetch("/api/subjects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // is particularly important when your frontend and backend are on different origins
    body: JSON.stringify({ subjectName }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export async function createSubjectOffering(
  subjectId: string,
  teacherId: string,
  startDate: string,
  endDate: string,
  daysOfWeek: number[],
): Promise<CreateSubjectOfferingResponse> {
  const response = await fetch("/api/subjectOffering", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      subjectId,
      teacherId,
      startDate,
      endDate,
      daysOfWeek,
    }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}
