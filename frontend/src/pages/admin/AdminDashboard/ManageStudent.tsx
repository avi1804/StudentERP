import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useIsMobile } from "@/hooks/useIsMobile";

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
  const { isMobile } = useIsMobile();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState({ contact_number: "", batch: "", full_name: "", enrollment_number: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      batch: student.batch,
      full_name: student.user?.full_name || "",
      enrollment_number: student.enrollment_number || ""
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
        setStudents(students.map(s => s.id === editingStudent.id ? { 
          ...s, 
          ...editForm,
          user: { ...s.user, full_name: editForm.full_name }
        } : s));
        setEditingStudent(null);
        setSuccessMessage("Student updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Failed to update student.");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (err) {
      setErrorMessage("Network error.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="page-wide">
      {successMessage && (
        <div style={{ padding: '12px', background: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '16px', border: '1px solid #c3e6cb' }}>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div style={{ padding: '12px', background: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '16px', border: '1px solid #f5c6cb' }}>
          {errorMessage}
        </div>
      )}
      <div className="card">
        <div className="card-header">
          <span className="card-title">All Students</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search name / roll no..." 
              style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)', fontSize: '12px', fontFamily: 'inherit', width: '200px' }} 
            />
            <button className="card-btn" onClick={() => navigate('/admin/dashboard/students/add')}>
              + Add Student
            </button>
          </div>
        </div>
        <div>
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center' }}>Loading students...</div>
          ) : students.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center' }}>No students enrolled yet.</div>
          ) : isMobile ? (
            <div className="mobile-list-container" style={{ padding: '0 16px 16px 16px' }}>
              {students.map(s => {
                const name = s.user?.full_name || "Unknown";
                const email = s.user?.email || "No Email";
                const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
                return (
                  <div className="mobile-list-card" key={s.id}>
                    <div className="mobile-list-card-header">
                      <div className="student-info">
                        <div className="student-avatar">{initials}</div>
                        <div>
                          <div className="student-name">{name}</div>
                          <div className="student-email">{email}</div>
                        </div>
                      </div>
                      <span className="badge badge-green">ACTIVE</span>
                    </div>
                    <div className="mobile-list-card-body">
                      <div className="mobile-list-card-row">
                        <span>Roll No</span>
                        <span>{s.enrollment_number}</span>
                      </div>
                      <div className="mobile-list-card-row">
                        <span>Batch/Branch</span>
                        <span>{s.batch}</span>
                      </div>
                      <div className="mobile-list-card-row">
                        <span>Phone</span>
                        <span>{s.contact_number || "-"}</span>
                      </div>
                    </div>
                    <div className="mobile-list-card-actions">
                      <button className="btn-edit" onClick={() => handleEditClick(s)}>Edit</button>
                      <button className="btn-del" onClick={() => handleDelete(s.id)}>Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
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
            </tbody>
          </table>
          )}
        </div>
      </div>

      {editingStudent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>

            <h3 style={{ marginTop: 0 }}>Edit Student</h3>
            <form onSubmit={handleUpdate}>
              <div className="fg" style={{ marginBottom: '16px' }}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={editForm.full_name} 
                  onChange={e => setEditForm({...editForm, full_name: e.target.value})} 
                  required 
                />
              </div>
              <div className="fg" style={{ marginBottom: '16px' }}>
                <label>Roll No</label>
                <input 
                  type="text" 
                  value={editForm.enrollment_number} 
                  onChange={e => setEditForm({...editForm, enrollment_number: e.target.value})} 
                  required 
                />
              </div>
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
