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

export async function getBulkAttendance(subjectOfferingId: string, year: number, month: number) {
  console.log('subjectOfferingId in get bulk attendance', subjectOfferingId)
  const response = await fetch(`/api/attendance/bulk?subjectOfferingId=${subjectOfferingId}&year=${year}&month=${month}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })

  const data = await response.json();

  return data;
}
