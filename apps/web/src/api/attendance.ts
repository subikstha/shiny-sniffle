export async function bulkAttendance(
  subjectOfferingId: string,
  attendanceRecords: FlattenedAttendanceRecords,
) {
  const response = await fetch("/api/attendance/bulk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subjectOfferingId,
      attendanceRecords,
    }),
    credentials: "include",
  });

  const data = await response.json();

  return data;
}
