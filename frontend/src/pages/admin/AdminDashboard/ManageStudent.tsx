import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

interface Student {
  id: number;
  enrollment_number: string;
  batch: string;
  contact_number: string | null;
  user: {
    full_name: string;
    email: string;
  };
}

export default function ManageStudent() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState({ contact_number: "", batch: "" });

  const fetchStudents = async () => {
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch("http://localhost:8000/api/v1/students/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        useAuthStore.getState().logout();
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setStudents(data.items || data);
      } else {
        alert("Failed to load students.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch(`http://localhost:8000/api/v1/students/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setStudents(students.filter(s => s.id !== id));
      } else {
        alert("Failed to delete student.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setEditForm({ 
      contact_number: student.contact_number || "", 
      batch: student.batch 
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch(`http://localhost:8000/api/v1/students/${editingStudent.id}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editForm)
      });
      
      if (res.ok) {
        setStudents(students.map(s => s.id === editingStudent.id ? { ...s, ...editForm } : s));
        setEditingStudent(null);
      } else {
        alert("Failed to update student.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  return (
    <div className="page-wide">
      <div className="card">
        <div className="card-header">
          <span className="card-title">All Students</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search name / roll no..." 
              style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)', fontSize: '12px', fontFamily: 'inherit', width: '200px' }} 
            />
            <button className="card-btn" onClick={() => navigate('/Admin-Dashboard/students/add')}>
              + Add Student
            </button>
          </div>
        </div>
        <div>
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center' }}>Loading students...</div>
          ) : (
          <table>
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>ROLL NO</th>
                <th>BATCH / BRANCH</th>
                <th>PHONE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => {
                const name = s.user?.full_name || "Unknown";
                const email = s.user?.email || "No Email";
                const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
                return (
                  <tr key={s.id}>
                    <td>
                      <div className="student-info">
                        <div className="student-avatar">{initials}</div>
                        <div>
                          <div className="student-name">{name}</div>
                          <div className="student-email">{email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="mono">{s.enrollment_number}</td>
                    <td>{s.batch}</td>
                    <td className="mono">{s.contact_number || "-"}</td>
                    <td><span className="badge badge-green">ACTIVE</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => handleEditClick(s)}>Edit</button>
                        <button className="btn-del" onClick={() => handleDelete(s.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {students.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px' }}>No students enrolled yet.</td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {editingStudent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px', padding: '24px' }}>
            <h3 style={{ marginTop: 0 }}>Edit Student</h3>
            <form onSubmit={handleUpdate}>
              <div className="fg" style={{ marginBottom: '16px' }}>
                <label>Batch / Branch</label>
                <input 
                  type="text" 
                  value={editForm.batch} 
                  onChange={e => setEditForm({...editForm, batch: e.target.value})} 
                  required 
                />
              </div>
              <div className="fg" style={{ marginBottom: '16px' }}>
                <label>Phone Number</label>
                <input 
                  type="text" 
                  value={editForm.contact_number} 
                  onChange={e => setEditForm({...editForm, contact_number: e.target.value})} 
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" className="btn" style={{ background: 'var(--surface2)', color: 'var(--text)' }} onClick={() => setEditingStudent(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
