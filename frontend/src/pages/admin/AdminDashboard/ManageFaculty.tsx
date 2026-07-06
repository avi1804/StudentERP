import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Faculty {
  id: number;
  employee_id: string;
  designation: string;
  contact_number: string | null;
  department_id: number | null;
  user: {
    full_name: string;
    email: string;
  } | null;
}

export default function ManageFaculty() {
  const { isMobile } = useIsMobile();
  const navigate = useNavigate();
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [editForm, setEditForm] = useState({ 
    contact_number: "", 
    designation: "",
    full_name: "",
    employee_id: "",
    department_id: "" as number | string
  });
  const [departments, setDepartments] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    
    // Fetch departments for the edit form
    const fetchDepartments = async () => {
      try {
        const token = useAuthStore.getState().accessToken;
        const res = await fetch('http://localhost:8000/api/v1/departments/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDepartments(data.items || data);
        }
      } catch (err) {
        console.error('Failed to fetch departments', err);
      }
    };
    fetchDepartments();
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
      designation: faculty.designation,
      full_name: faculty.user?.full_name || "",
      employee_id: faculty.employee_id || "",
      department_id: faculty.department_id || ""
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaculty) return;
    
    try {
      const token = useAuthStore.getState().accessToken;
      const payload = {
        ...editForm,
        department_id: editForm.department_id ? Number(editForm.department_id) : null
      };
      
      const res = await fetch(`http://localhost:8000/api/v1/faculty/${editingFaculty.id}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setFacultyList(facultyList.map(f => f.id === editingFaculty.id ? { 
          ...f, 
          ...editForm,
          user: { ...f.user, full_name: editForm.full_name }
        } : f));
        setEditingFaculty(null);
        setSuccessMessage("Faculty updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Failed to update faculty.");
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
          <span className="card-title">All Faculty</span>
          <button className="card-btn" onClick={() => navigate('/admin/dashboard/faculty/add')}>
            + Add Faculty
          </button>
        </div>
        <div>
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center' }}>Loading...</div>
          ) : facultyList.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center' }}>No faculty found.</div>
          ) : isMobile ? (
            <div className="mobile-list-container" style={{ padding: '0 16px 16px 16px' }}>
              {facultyList.map(f => {
                const name = f.user?.full_name || "Unknown";
                const email = f.user?.email || "No Email";
                const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
                return (
                  <div className="mobile-list-card" key={f.id}>
                    <div className="mobile-list-card-header">
                      <div className="student-info">
                        <div className="student-avatar" style={{ background: 'linear-gradient(135deg, #f74f8e, #ff9a9a)' }}>{initials}</div>
                        <div>
                          <div className="student-name">{name}</div>
                          <div className="student-email">{email}</div>
                        </div>
                      </div>
                      <span className="badge badge-purple">DEP</span>
                    </div>
                    <div className="mobile-list-card-body">
                      <div className="mobile-list-card-row">
                        <span>Designation</span>
                        <span>{f.designation}</span>
                      </div>
                      <div className="mobile-list-card-row">
                        <span>Employee ID</span>
                        <span>{f.employee_id}</span>
                      </div>
                      <div className="mobile-list-card-row">
                        <span>Phone</span>
                        <span>{f.contact_number || "-"}</span>
                      </div>
                    </div>
                    <div className="mobile-list-card-actions">
                      <button className="btn-edit" onClick={() => handleEditClick(f)}>Edit</button>
                      <button className="btn-del" onClick={() => handleDelete(f.id)}>Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
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
              {facultyList.map(f => (
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
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {editingFaculty && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>

            <h3 style={{ marginTop: 0 }}>Edit Faculty</h3>
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
                <label>Employee ID / Qualification</label>
                <input 
                  type="text" 
                  value={editForm.employee_id} 
                  onChange={e => setEditForm({...editForm, employee_id: e.target.value})} 
                  required 
                />
              </div>
              <div className="fg" style={{ marginBottom: '16px' }}>
                <label>Department</label>
                <select 
                  value={editForm.department_id} 
                  onChange={e => setEditForm({...editForm, department_id: e.target.value})}
                >
                  <option value="">-- Select Department --</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>
              <div className="fg" style={{ marginBottom: '16px' }}>
                <label>Designation</label>
                <select 
                  value={editForm.designation} 
                  onChange={e => setEditForm({...editForm, designation: e.target.value})} 
                  required
                >
                  <option>Professor</option>
                  <option>Associate Professor</option>
                  <option>Assistant Professor</option>
                  <option>Lecturer</option>
                  <option>HOD</option>
                </select>
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
