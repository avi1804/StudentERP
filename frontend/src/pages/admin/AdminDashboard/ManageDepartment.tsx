import React, { useState, useEffect } from 'react';
import { apiClient as api } from '../../../api/axios';
import { 
  Building2, Plus, Search, Edit3, Trash2, CheckCircle2, AlertCircle, X, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TextType from '../../../components/TextType';

interface Department {
  id: number;
  name: string;
  code?: string;
  description?: string;
}

export function ManageDepartment() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/departments/');
      const items = res.data?.items || res.data || [];
      
      // Fallback fallback seeding check in UI if needed
      if (!items || items.length === 0) {
        // Try creating default "Computer Science and Engineering" if empty
        try {
          await api.post('/departments/', {
            name: "Computer Science and Engineering",
            code: "CSE",
            description: "Department of Computer Science & Engineering"
          });
          const reFetch = await api.get('/departments/');
          setDepartments(reFetch.data?.items || reFetch.data || []);
        } catch (err) {
          setDepartments([]);
        }
      } else {
        setDepartments(items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingDepartment(null);
    setFormName('');
    setFormCode('');
    setFormDescription('');
    setShowModal(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setEditingDepartment(dept);
    setFormName(dept.name);
    setFormCode(dept.code || '');
    setFormDescription(dept.description || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setMessage({ text: 'Department Name is required.', type: 'error' });
      return;
    }

    try {
      const payload = {
        name: formName.trim(),
        code: formCode.trim() || undefined,
        description: formDescription.trim() || undefined,
      };

      if (editingDepartment) {
        await api.put(`/departments/${editingDepartment.id}`, payload);
        setMessage({ text: 'Department updated successfully!', type: 'success' });
      } else {
        await api.post('/departments/', payload);
        setMessage({ text: 'Department created successfully!', type: 'success' });
      }

      setShowModal(false);
      fetchDepartments();
    } catch (err: any) {
      const detail = err?.response?.data?.detail || 'Failed to save department';
      setMessage({ text: detail, type: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await api.delete(`/departments/${id}`);
      setMessage({ text: 'Department deleted successfully', type: 'success' });
      fetchDepartments();
    } catch (err: any) {
      const detail = err?.response?.data?.detail || 'Failed to delete department';
      setMessage({ text: detail, type: 'error' });
    }
  };

  const filteredDepartments = departments.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      (d.code && d.code.toLowerCase().includes(q)) ||
      (d.description && d.description.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>Manage</span>
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              padding: '4px 18px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1.2,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <TextType
                text={["Departments", "Faculties", "Branches"]}
                typingSpeed={60}
                deletingSpeed={35}
                pauseDuration={2200}
                loop={true}
                showCursor={true}
                cursorCharacter="|"
                style={{ color: '#ffffff' }}
              />
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Add, edit, view, and organize academic departments across campus</div>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '12px 22px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
          }}
        >
          <Plus size={18} /> Add Department
        </button>
      </div>

      {message.text && (
        <div style={{
          marginBottom: '24px', padding: '14px 20px', borderRadius: '12px',
          backgroundColor: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
          color: message.type === 'error' ? '#ef4444' : '#22c55e',
          border: message.type === 'error' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(34,197,94,0.2)',
          fontWeight: 600, fontSize: '13px'
        }}>
          {message.text}
        </div>
      )}

      {/* ── Search Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by department name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              background: '#ffffff',
              border: '1.5px solid rgba(0,0,0,0.08)',
              borderRadius: '16px',
              fontSize: '14px',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* ── Department List Grid ── */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading departments...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((dept) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid rgba(0,0,0,0.07)',
                  borderRadius: '24px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={22} color="#6366f1" />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#6366f1', background: 'rgba(99,102,241,0.1)', padding: '4px 12px', borderRadius: '10px' }}>
                      {dept.code || `ID: ${dept.id}`}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#09090b', margin: '0 0 8px 0', letterSpacing: '-0.3px' }}>
                    {dept.name}
                  </h3>

                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                    {dept.description || 'Academic department offering core engineering and technology courses.'}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  <button
                    onClick={() => handleOpenEdit(dept)}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#475569',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dept.id)}
                    style={{
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: '12px',
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1.5px solid rgba(0,0,0,0.07)', color: '#64748b' }}>
              No departments found. Click <strong>Add Department</strong> above to create one.
            </div>
          )}
        </div>
      )}

      {/* ── CREATE / EDIT MODAL ── */}
      <AnimatePresence>
        {showModal && (
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(9, 9, 11, 0.6)',
                backdropFilter: 'blur(8px)'
              }}
            />

            {/* Modal Content */}
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
                border: '1px solid rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#09090b', margin: 0 }}>
                  {editingDepartment ? 'Edit Department' : 'Create New Department'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: '#f4f4f5', border: 'none', borderRadius: '50%',
                    width: '36px', height: '36px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', color: '#71717a'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    Department Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science and Engineering"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    Department Code (Abbreviation)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CSE, ME, EE"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about the department..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
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
                      border: 'none', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      color: '#ffffff', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(99,102,241,0.3)'
                    }}
                  >
                    {editingDepartment ? 'Update Department' : 'Create Department'}
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
