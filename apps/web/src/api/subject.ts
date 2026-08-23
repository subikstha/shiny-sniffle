export async function createSubject(
  subjectName: string,
  daysOfWeek: number[],
  teacherId: string,
) {
  const response = await fetch("/api/subjects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // is particularly important when your frontend and backend are on different origins
    body: JSON.stringify({ subjectName, daysOfWeek, teacherId }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}
