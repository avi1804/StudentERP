import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

interface Subject {
  id: number;
  name: string;
  code: string;
  credits: number;
  department_id: number;
  semester?: number;
  faculty?: any;
}

export default function ManageSubject() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editForm, setEditForm] = useState({ name: "", code: "", credits: 4 });

  const fetchSubjects = async () => {
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch("http://localhost:8000/api/v1/subjects/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubjects(data.items || data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch(`http://localhost:8000/api/v1/subjects/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setSubjects(subjects.filter(s => s.id !== id));
      } else {
        alert("Failed to delete subject.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  const handleEditClick = (subject: Subject) => {
    setEditingSubject(subject);
    setEditForm({ 
      name: subject.name,
      code: subject.code,
      credits: subject.credits
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;
    
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch(`http://localhost:8000/api/v1/subjects/${editingSubject.id}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editForm)
      });
      
      if (res.ok) {
        setSubjects(subjects.map(s => s.id === editingSubject.id ? { ...s, ...editForm } : s));
        setEditingSubject(null);
      } else {
        alert("Failed to update subject.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  return (
    <div className="page-wide">
      <div className="card">
        <div className="card-header">
          <span className="card-title">All Subjects</span>
          <button className="card-btn" onClick={() => navigate('/Admin-Dashboard/subject/add')}>
            + Add Subject
          </button>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>CODE</th>
                <th>NAME</th>
                <th>BRANCH</th>
                <th>SEM</th>
                <th>CREDITS</th>
                <th>FACULTY</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{textAlign: 'center'}}>Loading...</td></tr>
              ) : subjects.length === 0 ? (
                <tr><td colSpan={7} style={{textAlign: 'center'}}>No subjects found.</td></tr>
              ) : (
                subjects.map(s => (
                  <tr key={s.id}>
                    <td className="mono">{s.code}</td>
                    <td style={{ color: 'var(--text)', fontWeight: 500 }}>{s.name}</td>
                    <td><span className="badge badge-teal">DEP {s.department_id}</span></td>
                    <td>{s.semester || '-'}</td>
                    <td>{s.credits}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text2)' }}>{s.faculty?.user?.full_name || '-'}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => handleEditClick(s)}>Edit</button>
                        <button className="btn-del" onClick={() => handleDelete(s.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingSubject && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px', padding: '24px' }}>
            <h3 style={{ marginTop: 0 }}>Edit Subject</h3>
            <form onSubmit={handleUpdate}>
              <div className="fg" style={{ marginBottom: '16px' }}>
                <label>Subject Name</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={e => setEditForm({...editForm, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="fg" style={{ marginBottom: '16px' }}>
                <label>Subject Code</label>
                <input 
                  type="text" 
                  value={editForm.code} 
                  onChange={e => setEditForm({...editForm, code: e.target.value})} 
                  required 
                />
              </div>
              <div className="fg" style={{ marginBottom: '16px' }}>
                <label>Credits</label>
                <input 
                  type="number" 
                  value={editForm.credits} 
                  onChange={e => setEditForm({...editForm, credits: parseInt(e.target.value)})} 
                  required 
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" className="btn" style={{ background: 'var(--surface2)', color: 'var(--text)' }} onClick={() => setEditingSubject(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
