import React, { useState } from "react";

interface Subject {
  id: number;
  name: string;
  staff: string;
  course: string;
}

interface ManageSubjectsProps {
  subjects?: Subject[];
  onEdit?: (subject: Subject) => void;
  onDelete?: (subject: Subject) => void;
}

const defaultSubjects: Subject[] = [
  { id: 1, name: "math", staff: "kumar, sumit", course: "Btech" },
  { id: 2, name: "science", staff: "kumar, sumit", course: "Btech" },
  { id: 3, name: "Java", staff: "kumar, sumit", course: "Btech" },
  { id: 4, name: "Python", staff: "kumar, sumit", course: "Btech" },
  { id: 5, name: "Math", staff: "kumar, sumit", course: "Mtech" },
];

const ManageSubjects: React.FC<ManageSubjectsProps> = ({
  subjects = defaultSubjects,
  onEdit,
  onDelete,
}) => {
  const [list, setList] = useState<Subject[]>(subjects);

  const handleDelete = (subject: Subject) => {
    if (onDelete) {
      onDelete(subject);
    } else {
      setList((prev) => prev.filter((s) => s.id !== subject.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Content */}
      <main className="p-6">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
          <div className="px-6 py-5">
            <h2 className="text-lg text-gray-700">Manage Subjects</h2>
          </div>

          <div className="overflow-x-auto border-t border-gray-100">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-6 py-3 font-semibold">#</th>
                  <th className="px-6 py-3 font-semibold">Subject</th>
                  <th className="px-6 py-3 font-semibold">Staff</th>
                  <th className="px-6 py-3 font-semibold">Course</th>
                  <th className="px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((subject, idx) => (
                  <tr
                    key={subject.id}
                    className="border-b border-gray-100 text-gray-700 last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">{idx + 1}</td>
                    <td className="px-6 py-4">{subject.name}</td>
                    <td className="px-6 py-4">{subject.staff}</td>
                    <td className="px-6 py-4">{subject.course}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit?.(subject)}
                          className="rounded bg-teal-500 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-teal-600"
                        >
                          Edit
                        </button>
                        <span className="text-gray-400">-</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(subject)}
                          className="rounded bg-red-500 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      No subjects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4 text-sm text-gray-500">
        <span>
          © 2023 - <span className="font-semibold text-gray-700">College Management System</span> In Python Django
        </span>
        <span>Ver.1.0</span>
      </footer>
    </div>
  );
};

export default ManageSubjects;