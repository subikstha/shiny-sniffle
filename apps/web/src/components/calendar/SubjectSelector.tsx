import { useContext, useEffect } from "react";
import { calendarContext } from "./CalendarProvider";
import { useQuery } from "@tanstack/react-query";
import { getAllSubjectOfferings } from "../../api/subject";

const SubjectSelector = () => {
  const { isLoading, data: subjectsData } = useQuery({
    queryKey: ["get-subjects"],
    queryFn: () => getAllSubjectOfferings(),
  });
  const { data: allSubjects } = subjectsData || {};
  const { state, dispatch } = useContext(calendarContext);

  useEffect(() => {
    if (allSubjects && allSubjects.length > 0) {
      dispatch({ type: "setAllSubjects", payload: allSubjects });
      // 2. Set default initial selection if none is currently selected
      if (!state.selectedSubject) {
        dispatch({ type: "setSubject", payload: allSubjects[0].id });
      }
    }
  }, [allSubjects, dispatch, state.selectedSubject]);

  return isLoading ? (
    <div>Loading Subjects...</div>
  ) : allSubjects ? (
    <select
      onChange={(e) =>
        dispatch({ type: "setSubject", payload: e.target.value })
      }
      value={state.selectedSubject}
    >
      {allSubjects.map((subject) => (
        <option key={subject.id} value={subject.id}>
          {subject.subjectName}
        </option>
      ))}
    </select>
  ) : (
    <div>No subjects found</div>
  );
};

export default SubjectSelector;
