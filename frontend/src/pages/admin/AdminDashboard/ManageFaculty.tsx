import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

interface Faculty {
  id: number;
  employee_id: string;
  designation: string;
  contact_number: string | null;
  user: {
    full_name: string;
    email: string;
  } | null;
}

export default function ManageFaculty() {
  const navigate = useNavigate();
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [editForm, setEditForm] = useState({ contact_number: "", designation: "" });

  const fetchFaculty = async () => {
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch("http://localhost:8000/api/v1/faculty/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        useAuthStore.getState().logout();
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setFacultyList(data.items || data);
      } else {
        alert("Failed to load faculty.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this faculty member?")) return;
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch(`http://localhost:8000/api/v1/faculty/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setFacultyList(facultyList.filter(f => f.id !== id));
      } else {
        alert("Failed to delete faculty.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  const handleEditClick = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setEditForm({ 
      contact_number: faculty.contact_number || "", 
      designation: faculty.designation 
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaculty) return;
    
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch(`http://localhost:8000/api/v1/faculty/${editingFaculty.id}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editForm)
      });
      
      if (res.ok) {
        setFacultyList(facultyList.map(f => f.id === editingFaculty.id ? { ...f, ...editForm } : f));
        setEditingFaculty(null);
      } else {
        alert("Failed to update faculty.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  return (
    <div className="page-wide">
      <div className="card">
        <div className="card-header">
          <span className="card-title">All Faculty</span>
          <button className="card-btn" onClick={() => navigate('/admin/dashboard/faculty/add')}>
            + Add Faculty
          </button>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>DEPARTMENT</th>
                <th>DESIGNATION</th>
                <th>QUALIFICATION</th>
                <th>PHONE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{textAlign: 'center'}}>Loading...</td></tr>
              ) : facultyList.length === 0 ? (
                <tr><td colSpan={7} style={{textAlign: 'center'}}>No faculty found.</td></tr>
              ) : (
                facultyList.map(f => (
                  <tr key={f.id}>
                    <td style={{ color: 'var(--text)', fontWeight: 500 }}>{f.user?.full_name || 'Unknown'}</td>
                    <td style={{ color: 'var(--accent)', fontSize: '12px' }}>{f.user?.email || 'No Email'}</td>
                    <td><span className="badge badge-purple">DEP</span></td>
                    <td>{f.designation}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text3)' }}>{f.employee_id}</td>
                    <td className="mono">{f.contact_number || '-'}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => handleEditClick(f)}>Edit</button>
                        <button className="btn-del" onClick={() => handleDelete(f.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingFaculty && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px', padding: '24px' }}>
            <h3 style={{ marginTop: 0 }}>Edit Faculty</h3>
            <form onSubmit={handleUpdate}>
              <div className="fg" style={{ marginBottom: '16px' }}>
                <label>Designation</label>
                <input 
                  type="text" 
                  value={editForm.designation} 
                  onChange={e => setEditForm({...editForm, designation: e.target.value})} 
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
                <button type="button" className="btn" style={{ background: 'var(--surface2)', color: 'var(--text)' }} onClick={() => setEditingFaculty(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
