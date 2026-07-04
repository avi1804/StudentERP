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
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, name: draftName.trim() } : c)));
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Manage Courses</div>
      </div>

      <div style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', color: 'var(--text2)' }}>#</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', color: 'var(--text2)' }}>Course</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', color: 'var(--text2)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px' }}>{course.id}</td>
                <td style={{ padding: '12px 16px' }}>
                  {editingId === course.id ? (
                    <div className="fg" style={{ marginBottom: 0 }}>
                      <input
                        autoFocus
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(course.id)}
                        style={{ padding: '4px 8px', fontSize: '14px' }}
                      />
                    </div>
                  ) : (
                    course.name
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {editingId === course.id ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => saveEdit(course.id)} className="btn btn-primary" style={{ padding: '4px 12px', minWidth: 'auto', minHeight: '32px' }}>Save</button>
                      <button onClick={() => setEditingId(null)} className="btn" style={{ padding: '4px 12px', minWidth: 'auto', minHeight: '32px', background: 'transparent', border: '1px solid var(--border)' }}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => startEdit(course)} className="btn btn-primary" style={{ padding: '4px 12px', minWidth: 'auto', minHeight: '32px' }}>Edit</button>
                      <button onClick={() => handleDelete(course.id)} className="btn" style={{ padding: '4px 12px', minWidth: 'auto', minHeight: '32px', background: 'rgba(239,68,68,0.2)', color: '#f87171' }}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: '24px', textAlign: 'center', color: 'var(--text3)' }}>
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
