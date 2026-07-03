import { useState } from "react";

interface Course {
  id: number;
  name: string;
}

const INITIAL_COURSES: Course[] = [
  { id: 1, name: "Btech" },
  { id: 2, name: "Bcom" },
  { id: 3, name: "Bsc" },
  { id: 4, name: "Mcom" },
  { id: 5, name: "Mtech" },
];

export function ManageCourse() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftName, setDraftName] = useState("");

  const startEdit = (course: Course) => {
    setEditingId(course.id);
    setDraftName(course.name);
  };

  const saveEdit = (id: number) => {
    if (!draftName.trim()) return;
    // TODO: replace with a real API call once the backend is wired up
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, name: draftName.trim() } : c)));
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    // TODO: replace with a real API call once the backend is wired up
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="overflow-hidden rounded-md bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-base text-gray-700">Manage Courses</h2>
      </div>

      <div className="overflow-x-auto p-6 pt-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-900 text-left text-white">
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">Course</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr
                key={course.id}
                className={`border-b border-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="px-4 py-3 text-gray-600">{course.id}</td>
                <td className="px-4 py-3 text-gray-800">
                  {editingId === course.id ? (
                    <input
                      autoFocus
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(course.id)}
                      className="w-full max-w-[200px] rounded border border-blue-400 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  ) : (
                    course.name
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === course.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => saveEdit(course.id)}
                        className="rounded bg-green-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded bg-gray-300 px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(course)}
                        className="rounded bg-teal-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
                      >
                        Edit
                      </button>
                      <span className="text-gray-300">-</span>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="rounded bg-red-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {courses.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                  No courses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}