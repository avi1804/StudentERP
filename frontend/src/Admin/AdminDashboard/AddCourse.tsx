import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { PanelHeader } from "@/components/PanelHeader";

export function AddCourse() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    // TODO: replace with a real API call once the backend is wired up
    navigate("/course/manage");
  };

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-md bg-white shadow-sm">
      {/* <PanelHeader title="Add Course" /> */}

      <form onSubmit={handleSubmit} className="p-6">
        <label htmlFor="courseName" className="mb-2 block text-sm font-semibold text-gray-700">
          Name:
        </label>
        <input
          id="courseName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="submit"
          className="mt-6 w-full rounded bg-green-600 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          Add Course
        </button>
      </form>
    </div>
  );
}