import { useQuery } from "@tanstack/react-query";
import { days } from "../../constants";
import { getAllTeachers } from "../../api/users";
// TODO: Need to fetch the teacher from the backend
const Subject = () => {
  // TODO: List all the available subjects with their respective teachers
  // Add a modal with form when admin clicks add subject
  const { isLoading: isTeachersLoading, data: teachersData } = useQuery({
    queryKey: ["get-teachers"],
    queryFn: () => getAllTeachers(),
    staleTime: 30000,
  });
  console.log("Teachers data", teachersData);

  const { data: allTeachers } = teachersData || {};

  return (
    <div>
      <h2 className="mb-4 text-2xl">Create Subject</h2>
      <form className="flex flex-col gap-6">
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-2 font-semibold">
            Subject Name
          </label>
          <input
            type="text"
            placeholder="Subject Name"
            name="name"
            id="name"
            className="border p-1.5 rounded-lg"
            required
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2 font-semibold">Subject Active Days</span>
          <div>
            {days.map((day) => (
              <div key={day} className="flex gap-2">
                <input type="checkbox" id={day} />
                <label htmlFor={day}>{day}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="teacher" className="mb-2 font-semibold">
            Select Teacher
          </label>
          {isTeachersLoading ? (
            <div>Loading Teachers...</div>
          ) : allTeachers && allTeachers.length > 0 ? (
            <select
              name="teacher"
              id="teacher"
              className="border p-1.5 rounded-lg"
            >
              {allTeachers.map((teacher) => (
                <option key={teacher.id}>
                  {teacher.firstName
                    ? `${teacher.firstName} ${teacher.lastName}`
                    : teacher.username}
                </option>
              ))}
            </select>
          ) : (
            <>Nothing found</>
          )}
        </div>
      </form>
    </div>
  );
};

export default Subject;
