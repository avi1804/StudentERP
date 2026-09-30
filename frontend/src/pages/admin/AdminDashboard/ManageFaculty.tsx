import { API_BASE_URL } from '../../../config';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Plus, Search, Edit3, Trash2, X, CheckCircle2, AlertCircle, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TextType from '../../../components/TextType';

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
  const [searchQuery, setSearchQuery] = useState('');
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
      const res = await fetch(API_BASE_URL + "/api/v1/faculty/", {
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
        setErrorMessage("Failed to load faculty.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
    
    const fetchDepartments = async () => {
      try {
        const token = useAuthStore.getState().accessToken;
        const res = await fetch(API_BASE_URL + '/api/v1/departments/', {
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
      const res = await fetch(`${API_BASE_URL}/api/v1/faculty/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setFacultyList(facultyList.filter(f => f.id !== id));
        setSuccessMessage("Faculty deleted successfully.");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Failed to delete faculty.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error.");
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
      
      const res = await fetch(`${API_BASE_URL}/api/v1/faculty/${editingFaculty.id}`, {
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
          department_id: payload.department_id !== null ? payload.department_id : f.department_id,
          user: f.user ? { ...f.user, full_name: editForm.full_name } : null
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

  const filteredFaculty = facultyList.filter(f => {
    const q = searchQuery.toLowerCase();
    const name = f.user?.full_name?.toLowerCase() || '';
    const email = f.user?.email?.toLowerCase() || '';
    const empId = f.employee_id?.toLowerCase() || '';
    const des = f.designation?.toLowerCase() || '';
    return name.includes(q) || email.includes(q) || empId.includes(q) || des.includes(q);
  });

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>Manage</span>
            <span style={{
              background: '#282B4A',
              color: '#EEEBDA',
              padding: '4px 18px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(40, 43, 74, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1.2,
              border: '1px solid rgba(238, 235, 218, 0.2)',
            }}>
              <TextType
                text={["Faculty", "Professors", "Instructors"]}
                typingSpeed={60}
                deletingSpeed={35}
                pauseDuration={2200}
                loop={true}
                showCursor={true}
                cursorCharacter="|"
                style={{ color: '#EEEBDA' }}
              />
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
            Add, edit, view, and organize academic faculty members across departments
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/dashboard/faculty/add')}
          style={{
            background: '#282B4A',
            color: '#EEEBDA',
            border: '1px solid rgba(238, 235, 218, 0.2)',
            padding: '12px 22px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(40, 43, 74, 0.25)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#373a61')}
          onMouseLeave={e => (e.currentTarget.style.background = '#282B4A')}
        >
          <Plus size={18} color="#EEEBDA" /> Add Faculty
        </button>
      </div>

      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: '20px', padding: '14px 20px', borderRadius: '14px',
            backgroundColor: 'rgba(5, 150, 105, 0.1)', color: '#059669',
            border: '1px solid rgba(5, 150, 105, 0.2)', fontWeight: 600, fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <CheckCircle2 size={16} /> {successMessage}
        </motion.div>
      )}

      {errorMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: '20px', padding: '14px 20px', borderRadius: '14px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: 600, fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <AlertCircle size={16} /> {errorMessage}
        </motion.div>
      )}

      {/* ── Search Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          position: 'relative',
          flex: 1,
          maxWidth: '520px',
        }}>
          <Search size={18} color="#71717a" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by faculty name, email, employee ID or designation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 18px 12px 46px',
              borderRadius: '16px',
              border: '1.5px solid rgba(40, 43, 74, 0.12)',
              background: '#ffffff',
              fontSize: '14px',
              color: '#09090b',
              boxShadow: '0 2px 8px rgba(40, 43, 74, 0.02)',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#282B4A')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(40, 43, 74, 0.12)')}
          />
        </div>
      </div>

      {/* ── Table Container ── */}
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        border: '1.5px solid rgba(40, 43, 74, 0.08)',
        boxShadow: '0 4px 24px rgba(40, 43, 74, 0.03)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Loading faculty members...</div>
        ) : filteredFaculty.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
            No faculty found matching your search.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid rgba(40, 43, 74, 0.08)' }}>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NAME</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>EMAIL</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DEPARTMENT</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DESIGNATION</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>EMP ID</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PHONE</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaculty.map(f => {
                  const name = f.user?.full_name || "Unknown";
                  const email = f.user?.email || "No Email";
                  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
                  const deptObj = departments.find(d => d.id === f.department_id);
                  const deptLabel = deptObj?.code || (deptObj ? deptObj.name : `DEP ${f.department_id || '-'}`);

                  return (
                    <tr 
                      key={f.id} 
                      style={{ 
                        borderBottom: '1px solid rgba(40, 43, 74, 0.05)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '38px', height: '38px', borderRadius: '12px',
                            background: '#282B4A', color: '#EEEBDA',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '13px', flexShrink: 0
                          }}>
                            {initials}
                          </div>
                          <div style={{ fontWeight: 700, color: '#09090b', fontSize: '14px' }}>{name}</div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#52525b', fontSize: '13px' }}>{email}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          fontSize: '11px', fontWeight: 800,
                          color: '#282B4A', background: 'rgba(40, 43, 74, 0.08)',
                          border: '1px solid rgba(40, 43, 74, 0.12)',
                          padding: '4px 10px', borderRadius: '8px', display: 'inline-block'
                        }}>
                          {deptLabel}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#09090b', fontSize: '13px', fontWeight: 600 }}>{f.designation}</td>
                      <td style={{ padding: '16px 24px', color: '#71717a', fontSize: '12px', fontFamily: 'monospace', fontWeight: 600 }}>{f.employee_id}</td>
                      <td style={{ padding: '16px 24px', color: '#71717a', fontSize: '13px' }}>{f.contact_number || "-"}</td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEditClick(f)}
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '10px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: 700,
                              color: '#282B4A',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(40, 43, 74, 0.06)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; }}
                          >
                            <Edit3 size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(f.id)}
                            style={{
                              background: 'rgba(239,68,68,0.08)',
                              border: '1px solid rgba(239,68,68,0.2)',
                              borderRadius: '10px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: 700,
                              color: '#ef4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.14)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Edit Faculty Modal ── */}
      <AnimatePresence>
        {editingFaculty && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingFaculty(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(9, 9, 11, 0.6)',
                backdropFilter: 'blur(8px)'
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '520px',
                background: '#ffffff',
                borderRadius: '28px',
                padding: '32px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                zIndex: 100000,
                border: '1.5px solid rgba(40, 43, 74, 0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#282B4A', margin: 0 }}>
                  Edit Faculty Details
                </h2>
                <button
                  onClick={() => setEditingFaculty(null)}
                  style={{
                    background: '#f4f4f5',
                    border: 'none',
                    borderRadius: '50%',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={18} color="#71717a" />
                </button>
              </div>

              <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#282B4A', marginBottom: '6px' }}>Full Name *</label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={e => setEditForm({...editForm, full_name: e.target.value})}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#282B4A', marginBottom: '6px' }}>Designation *</label>
                  <select
                    value={editForm.designation}
                    onChange={e => setEditForm({...editForm, designation: e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option>Professor</option>
                    <option>Associate Professor</option>
                    <option>Assistant Professor</option>
                    <option>Lecturer</option>
                    <option>HOD</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#282B4A', marginBottom: '6px' }}>Department *</label>
                  <select
                    value={editForm.department_id}
                    onChange={e => setEditForm({...editForm, department_id: e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.code || `ID: ${d.id}`})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#282B4A', marginBottom: '6px' }}>Employee ID *</label>
                  <input
                    type="text"
                    value={editForm.employee_id}
                    onChange={e => setEditForm({...editForm, employee_id: e.target.value})}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#282B4A', marginBottom: '6px' }}>Contact Phone</label>
                  <input
                    type="text"
                    value={editForm.contact_number}
                    onChange={e => setEditForm({...editForm, contact_number: e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingFaculty(null)}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '14px',
                      border: '1px solid #cbd5e1', background: '#ffffff',
                      color: '#475569', fontSize: '14px', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1, padding: '12px', borderRadius: '14px',
                      border: '1px solid rgba(238, 235, 218, 0.2)',
                      background: '#282B4A',
                      color: '#EEEBDA', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(40, 43, 74, 0.25)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#373a61')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#282B4A')}
                  >
                    Update Faculty
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
