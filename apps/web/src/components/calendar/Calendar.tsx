import { useQuery } from "@tanstack/react-query"
import { getAllStudents } from '../../api/users'

interface AllStudents {
    data: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }[]
}

function Calendar() {
    // Fetch all the students
    const { isLoading, data } = useQuery<AllStudents>({
        queryKey: ['allStudents'],
        queryFn: () => getAllStudents(),
        staleTime: 30000
    })

    const allStudents = data?.data ?? []

    if (isLoading) return <div>Loading Data...</div>

    return <table>
        <tbody>
            {allStudents.map((student) => <tr key={student.id}><td>{student.firstName}</td></tr>)}
        </tbody>
    </table>
}

export default Calendar