import React, { useState } from "react";

interface StaffOption {
  id: string;
  name: string;
}

interface CourseOption {
  id: string;
  name: string;
}

interface AddSubjectProps {
  staffOptions?: StaffOption[];
  courseOptions?: CourseOption[];
  onSubmit?: (data: { name: string; staffId: string; courseId: string }) => void;
}

const defaultStaff: StaffOption[] = [
  { id: "1", name: "John Smith" },
  { id: "2", name: "Jane Doe" },
];

const defaultCourses: CourseOption[] = [
  { id: "1", name: "B.Sc Computer Science" },
  { id: "2", name: "B.Com" },
];

const AddSubject: React.FC<AddSubjectProps> = ({
  staffOptions = defaultStaff,
  courseOptions = defaultCourses,
}) => {
  const [name, setName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [courseId, setCourseId] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit?.({ name, staffId, courseId });
//   };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top navbar */}

      {/* Content */}
      <main className="p-6">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
          {/* Card header */}
          <div className="bg-gray-800 px-6 py-4">
            <h2 className="text-lg font-medium text-white">Add Subject</h2>
          </div>

          {/* Form */}
          <form  className="space-y-5 p-6">
            <div>
              <label htmlFor="subject-name" className="mb-1 block text-sm font-semibold text-gray-800">
                Name:
              </label>
              <input
                id="subject-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Math"
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="subject-staff" className="mb-1 block text-sm font-semibold text-gray-800">
                Staff:
              </label>
              <select
                id="subject-staff"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2.5 text-gray-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">----------</option>
                {staffOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="subject-course" className="mb-1 block text-sm font-semibold text-gray-800">
                Course:
              </label>
              <select
                id="subject-course"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2.5 text-gray-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">----------</option>
                {courseOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-green-600 py-3 font-medium text-white transition-colors hover:bg-green-700"
            >
              Add Subject
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-4 text-sm text-gray-500">
        © 2026 - <span className="font-semibold text-gray-700">College Management System</span> In Python Django
      </footer>
    </div>
  );
};

export default AddSubject;