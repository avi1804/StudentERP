import { API_BASE_URL } from '../../../config';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Plus, Search, Edit3, Trash2, X, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TextType from '../../../components/TextType';

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
  const { isMobile } = useIsMobile();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editForm, setEditForm] = useState({ 
    name: "", 
    code: "", 
    credits: 4,
    department_id: "" as number | string,
    semester: 1 as number | string,
    faculty_id: "" as number | string
  });
  const [departments, setDepartments] = useState<any[]>([]);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchSubjects = async () => {
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch(API_BASE_URL + "/api/v1/subjects/", {
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

    const fetchDepsAndFacs = async () => {
      try {
        const token = useAuthStore.getState().accessToken;
        const [depRes, facRes] = await Promise.all([
          fetch(API_BASE_URL + '/api/v1/departments/', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(API_BASE_URL + '/api/v1/faculty/', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        if (depRes.ok) {
          const data = await depRes.json();
          setDepartments(data.items || data);
        }
        if (facRes.ok) {
          const data = await facRes.json();
          setFaculties(data.items || data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDepsAndFacs();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch(`${API_BASE_URL}/api/v1/subjects/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setSubjects(subjects.filter(s => s.id !== id));
        setSuccessMessage("Subject deleted successfully.");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Failed to delete subject.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error.");
    }
  };

  const handleEditClick = (subject: Subject) => {
    setEditingSubject(subject);
    setEditForm({ 
      name: subject.name,
      code: subject.code,
      credits: subject.credits,
      department_id: subject.department_id || "",
      semester: subject.semester || "",
      faculty_id: subject.faculty?.id || ""
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;
    
    try {
      const token = useAuthStore.getState().accessToken;
      
      const payload = {
        ...editForm,
        department_id: editForm.department_id ? Number(editForm.department_id) : null,
        semester: editForm.semester ? Number(editForm.semester) : null,
        faculty_id: editForm.faculty_id ? Number(editForm.faculty_id) : null
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/subjects/${editingSubject.id}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setSubjects(subjects.map(s => s.id === editingSubject.id ? { 
          ...s, 
          ...payload, 
          department_id: payload.department_id || s.department_id,
          semester: payload.semester || s.semester,
          faculty: payload.faculty_id ? (faculties.find(f => f.id === payload.faculty_id) || null) : null
        } : s));
        setEditingSubject(null);
        setSuccessMessage("Subject updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Failed to update subject.");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (err) {
      setErrorMessage("Network error.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const filteredSubjects = subjects.filter(s => {
    const q = searchQuery.toLowerCase();
    const name = s.name?.toLowerCase() || '';
    const code = s.code?.toLowerCase() || '';
    const facName = s.faculty?.user?.full_name?.toLowerCase() || '';
    return name.includes(q) || code.includes(q) || facName.includes(q);
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
                text={["Subjects", "Courses", "Curriculum"]}
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
            Add, edit, view, and organize academic course subjects across departments
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/dashboard/subject/add')}
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
          <Plus size={18} color="#EEEBDA" /> Add Subject
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
            placeholder="Search by subject name, code or assigned faculty..."
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
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Loading subjects...</div>
        ) : filteredSubjects.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
            No subjects found matching your search.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid rgba(40, 43, 74, 0.08)' }}>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CODE</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NAME</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>BRANCH</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEM</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CREDITS</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>FACULTY</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map(s => {
                  const deptObj = departments.find(d => d.id === s.department_id);
                  const branchLabel = deptObj?.code || (deptObj ? deptObj.name : `DEP ${s.department_id}`);

                  return (
                    <tr 
                      key={s.id} 
                      style={{ 
                        borderBottom: '1px solid rgba(40, 43, 74, 0.05)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '16px 24px', color: '#282B4A', fontSize: '13px', fontFamily: 'monospace', fontWeight: 700 }}>
                        {s.code}
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: 700, color: '#09090b', fontSize: '14px' }}>
                        {s.name}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          fontSize: '11px', fontWeight: 800,
                          color: '#282B4A', background: 'rgba(40, 43, 74, 0.08)',
                          border: '1px solid rgba(40, 43, 74, 0.12)',
                          padding: '4px 10px', borderRadius: '8px', display: 'inline-block'
                        }}>
                          {branchLabel}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#52525b', fontSize: '13px', fontWeight: 600 }}>
                        Sem {s.semester || '-'}
                      </td>
                      <td style={{ padding: '16px 24px', color: '#52525b', fontSize: '13px', fontWeight: 600 }}>
                        {s.credits} CR
                      </td>
                      <td style={{ padding: '16px 24px', color: '#52525b', fontSize: '13px' }}>
                        {s.faculty?.user?.full_name || (
                          <span style={{ color: '#a1a1aa', fontStyle: 'italic' }}>Not Assigned</span>
                        )}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEditClick(s)}
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
                            onClick={() => handleDelete(s.id)}
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

      {/* ── Edit Subject Modal ── */}
      <AnimatePresence>
        {editingSubject && (
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
              onClick={() => setEditingSubject(null)}
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
                  Edit Subject Details
                </h2>
                <button
                  onClick={() => setEditingSubject(null)}
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
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#282B4A', marginBottom: '6px' }}>Subject Name *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#282B4A', marginBottom: '6px' }}>Subject Code *</label>
                  <input
                    type="text"
                    value={editForm.code}
                    onChange={e => setEditForm({...editForm, code: e.target.value})}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#282B4A', marginBottom: '6px' }}>Semester</label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={editForm.semester}
                      onChange={e => setEditForm({...editForm, semester: e.target.value})}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#282B4A', marginBottom: '6px' }}>Credits</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editForm.credits}
                      onChange={e => setEditForm({...editForm, credits: parseInt(e.target.value) || 4})}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#282B4A', marginBottom: '6px' }}>Department</label>
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
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#282B4A', marginBottom: '6px' }}>Assigned Faculty</label>
                  <select
                    value={editForm.faculty_id}
                    onChange={e => setEditForm({...editForm, faculty_id: e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="">-- Select Faculty --</option>
                    {faculties.map(f => (
                      <option key={f.id} value={f.id}>{f.user?.full_name || f.employee_id}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingSubject(null)}
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
                    Update Subject
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
