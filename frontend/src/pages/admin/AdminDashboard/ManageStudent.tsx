import { API_BASE_URL } from '../../../config';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Plus, Search, Edit3, Trash2, X, CheckCircle2, AlertCircle, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TextType from '../../../components/TextType';

interface Student {
  id: number;
  enrollment_number: string;
  semester: number;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState({ contact_number: "", batch: "", full_name: "", enrollment_number: "", semester: 1 });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchStudents = async () => {
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch(API_BASE_URL + "/api/v1/students/", {
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
        setErrorMessage("Failed to load students.");
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
      const res = await fetch(`${API_BASE_URL}/api/v1/students/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setStudents(students.filter(s => s.id !== id));
        setSuccessMessage("Student deleted successfully.");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Failed to delete student.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error.");
    }
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setEditForm({ 
      contact_number: student.contact_number || "", 
      batch: student.batch,
      full_name: student.user?.full_name || "",
      enrollment_number: student.enrollment_number || "",
      semester: student.semester ?? 1
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch(`${API_BASE_URL}/api/v1/students/${editingStudent.id}`, {
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
          semester: editForm.semester,
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

  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase();
    const name = s.user?.full_name?.toLowerCase() || '';
    const email = s.user?.email?.toLowerCase() || '';
    const roll = s.enrollment_number?.toLowerCase() || '';
    const batch = s.batch?.toLowerCase() || '';
    return name.includes(q) || email.includes(q) || roll.includes(q) || batch.includes(q);
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
                text={["Students", "Enrollments", "Scholars"]}
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
            View, search, and manage enrolled students across academic branches and semesters
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/dashboard/students/add')}
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
          <Plus size={18} color="#EEEBDA" /> Add Student
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
            placeholder="Search by student name, roll number, email or branch..."
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
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
            No students found matching your search.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid rgba(40, 43, 74, 0.08)' }}>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>STUDENT</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ROLL NO</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEMESTER</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>BRANCH</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PHONE</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>STATUS</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(s => {
                  const name = s.user?.full_name || "Unknown";
                  const email = s.user?.email || "No Email";
                  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

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
                          <div>
                            <div style={{ fontWeight: 700, color: '#09090b', fontSize: '14px' }}>{name}</div>
                            <div style={{ color: '#71717a', fontSize: '12px', marginTop: '1px' }}>{email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#282B4A', fontSize: '13px', fontFamily: 'monospace', fontWeight: 600 }}>
                        {s.enrollment_number}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          fontSize: '11px', fontWeight: 800,
                          color: '#282B4A', background: 'rgba(40, 43, 74, 0.08)',
                          border: '1px solid rgba(40, 43, 74, 0.12)',
                          padding: '4px 10px', borderRadius: '8px', display: 'inline-block'
                        }}>
                          Sem {s.semester ?? 1}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#52525b', fontSize: '13px', fontWeight: 500 }}>
                        {s.batch}
                      </td>
                      <td style={{ padding: '16px 24px', color: '#71717a', fontSize: '13px' }}>
                        {s.contact_number || "-"}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          fontSize: '11px', fontWeight: 800,
                          color: '#059669', background: 'rgba(5, 150, 105, 0.08)',
                          border: '1px solid rgba(5, 150, 105, 0.2)',
                          padding: '4px 10px', borderRadius: '8px', display: 'inline-block'
                        }}>
                          ACTIVE
                        </span>
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

      {/* ── Edit Student Modal ── */}
      <AnimatePresence>
        {editingStudent && (
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
              onClick={() => setEditingStudent(null)}
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
                  Edit Student Details
                </h2>
                <button
                  onClick={() => setEditingStudent(null)}
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
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#282B4A', marginBottom: '6px' }}>Enrollment Number *</label>
                  <input
                    type="text"
                    value={editForm.enrollment_number}
                    onChange={e => setEditForm({...editForm, enrollment_number: e.target.value})}
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
                      onChange={e => setEditForm({...editForm, semester: parseInt(e.target.value) || 1})}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#282B4A', marginBottom: '6px' }}>Branch / Batch</label>
                    <input
                      type="text"
                      value={editForm.batch}
                      onChange={e => setEditForm({...editForm, batch: e.target.value})}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
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
                    onClick={() => setEditingStudent(null)}
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
                    Update Student
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
