import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Layers, DollarSign, BookOpen, 
  Trash2, Edit, CheckCircle, ChevronRight, X, Calculator, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFeeStore } from '../../../store/useFeeStore';
import { apiClient as api } from '../../../api/axios';

export function FeeStructure() {
  const { feeStructures, fetchFeeStructures, isLoading } = useFeeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState<string>('ALL');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStructure, setEditingStructure] = useState<any>(null);

  const [formData, setFormData] = useState({
    academic_year: '2024-2025',
    department_id: 1,
    semester: 1,
    category: 'General',
    tuition_fee: 50000,
    exam_fee: 10000,
    library_fee: 5000,
    development_fee: 15000,
    laboratory_fee: 10000,
    hostel_fee: 0,
    sports_fee: 0,
    miscellaneous_fee: 0,
  });

  useEffect(() => {
    fetchFeeStructures();
  }, [fetchFeeStructures]);

  // Handle Semester dropdown change in form to auto-set Odd (90k) vs Even (100k) defaults!
  const handleSemesterChange = (semNum: number) => {
    const isOdd = semNum % 2 !== 0;
    setFormData(prev => ({
      ...prev,
      semester: semNum,
      tuition_fee: isOdd ? 50000 : 60000,
      exam_fee: 10000,
      library_fee: 5000,
      development_fee: 15000,
      laboratory_fee: 10000,
    }));
  };

  const calculateTotal = (data: any) => {
    return Number(data.tuition_fee || 0) + 
           Number(data.exam_fee || 0) + 
           Number(data.library_fee || 0) + 
           Number(data.development_fee || 0) + 
           Number(data.laboratory_fee || 0) +
           Number(data.hostel_fee || 0) +
           Number(data.sports_fee || 0) +
           Number(data.miscellaneous_fee || 0);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const total_amount = calculateTotal(formData);
      await api.post('/fees/structures', { ...formData, total_amount });
      setShowAddModal(false);
      fetchFeeStructures();
    } catch (err) {
      console.error('Failed to create fee structure', err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStructure) return;
    try {
      const total_amount = calculateTotal(editingStructure);
      await api.put(`/fees/structures/${editingStructure.id}`, { ...editingStructure, total_amount });
      setEditingStructure(null);
      fetchFeeStructures();
    } catch (err) {
      console.error('Failed to update fee structure', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this semester fee structure?")) return;
    try {
      await api.delete(`/fees/structures/${id}`);
      fetchFeeStructures();
    } catch (err) {
      console.error('Failed to delete fee structure', err);
    }
  };

  const openEditModal = (struct: any) => {
    setEditingStructure({ ...struct });
  };

  const filteredStructures = (feeStructures || []).filter(item => {
    const matchesSearch = item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.academic_year?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSem = semesterFilter === 'ALL' || String(item.semester) === semesterFilter;
    return matchesSearch && matchesSem;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.5px' }}>
            8-Semester Fee Structure Manager & CRUD
          </h1>
          <p style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>
            Manage fee structures for Semesters 1 to 8 (Odd Sems: ₹90,000 | Even Sems: ₹1,00,000)
          </p>
        </div>
        <button
          onClick={() => { handleSemesterChange(1); setShowAddModal(true); }}
          style={{
            background: '#573cfa',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '13px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(87, 60, 250, 0.3)',
          }}
        >
          <Plus size={16} /> Add Semester Fee Structure
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#52525b', marginBottom: '8px' }}>Total Configured Semesters</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#09090b' }}>{feeStructures.length} / 8</div>
        </div>

        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#52525b', marginBottom: '8px' }}>Odd Sem Fee (Sem 1, 3, 5, 7)</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#573cfa' }}>₹ 90,000</div>
        </div>

        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#52525b', marginBottom: '8px' }}>Even Sem Fee (Sem 2, 4, 6, 8)</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16a34a' }}>₹ 1,00,000</div>
        </div>

        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#52525b', marginBottom: '8px' }}>Academic Year</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#09090b' }}>2024 - 2025</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e4e4e7', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, background: '#f4f4f5', padding: '8px 14px', borderRadius: '10px' }}>
          <Search size={16} color="#71717a" />
          <input
            type="text"
            placeholder="Search by category or academic year..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%' }}
          />
        </div>

        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #e4e4e7', fontSize: '13px', background: '#fff', cursor: 'pointer', fontWeight: 600 }}
        >
          <option value="ALL">All Semesters (Sem 1 - Sem 8)</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
            <option key={s} value={String(s)}>Semester {s} ({s % 2 !== 0 ? 'Odd - ₹90,000' : 'Even - ₹1,00,000'})</option>
          ))}
        </select>
      </div>

      {/* Fee Structure Table */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e4e4e7', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e4e4e7' }}>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Semester</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Sem Type</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Category</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Tuition Fee</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Exam Fee</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Library / Lab / Dev</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Total Fee</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569', textAlign: 'right' }}>Actions (CRUD)</th>
            </tr>
          </thead>
          <tbody>
            {filteredStructures.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  No fee structures found.
                </td>
              </tr>
            ) : (
              filteredStructures.map((struct) => {
                const isOdd = struct.semester % 2 !== 0;
                return (
                  <tr key={struct.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 800, color: '#0f172a' }}>Semester {struct.semester}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                        background: isOdd ? '#f3f0ff' : '#e0f2fe', color: isOdd ? '#573cfa' : '#0369a1'
                      }}>
                        {isOdd ? 'Odd Semester (₹90k)' : 'Even Semester (₹100k)'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#475569', fontWeight: 600 }}>{struct.category}</td>
                    <td style={{ padding: '16px 20px', color: '#334155', fontWeight: 600 }}>₹ {struct.tuition_fee?.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '16px 20px', color: '#334155', fontWeight: 600 }}>₹ {struct.exam_fee?.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '16px 20px', color: '#334155' }}>
                      ₹ {((struct.library_fee || 0) + (struct.development_fee || 0) + (struct.laboratory_fee || 0)).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 800, color: '#573cfa', fontSize: '14px' }}>
                      ₹ {struct.total_amount?.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => openEditModal(struct)}
                        title="Edit Fee Structure"
                        style={{ border: 'none', background: '#f3f4f6', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', color: '#4b5563', marginRight: '8px', fontWeight: 600 }}
                      >
                        <Edit size={15} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(struct.id)}
                        title="Delete Structure"
                        style={{ border: 'none', background: '#fef2f2', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', color: '#dc2626', fontWeight: 600 }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── MODAL 1: CREATE FEE STRUCTURE ── */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: '#fff', borderRadius: '24px', width: '560px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#09090b' }}>Create Semester Fee Structure</h3>
                <X size={20} color="#71717a" style={{ cursor: 'pointer' }} onClick={() => setShowAddModal(false)} />
              </div>

              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>Semester (1 - 8) *</label>
                    <select
                      value={formData.semester}
                      onChange={(e) => handleSemesterChange(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #573cfa', fontSize: '13px', fontWeight: 700, color: '#573cfa', background: '#f3f0ff' }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={s}>Semester {s} ({s % 2 !== 0 ? 'Odd - ₹90,000' : 'Even - ₹1,00,000'})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px' }}
                    >
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC/ST">SC/ST</option>
                      <option value="Management">Management Quota</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>Tuition Fee (₹)</label>
                    <input
                      type="number"
                      value={formData.tuition_fee}
                      onChange={(e) => setFormData({ ...formData, tuition_fee: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>Exam Fee (₹)</label>
                    <input
                      type="number"
                      value={formData.exam_fee}
                      onChange={(e) => setFormData({ ...formData, exam_fee: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>Library Fee (₹)</label>
                    <input
                      type="number"
                      value={formData.library_fee}
                      onChange={(e) => setFormData({ ...formData, library_fee: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>Development Fee (₹)</label>
                    <input
                      type="number"
                      value={formData.development_fee}
                      onChange={(e) => setFormData({ ...formData, development_fee: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>Laboratory Fee (₹)</label>
                  <input
                    type="number"
                    value={formData.laboratory_fee}
                    onChange={(e) => setFormData({ ...formData, laboratory_fee: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px' }}
                  />
                </div>

                {/* Total Preview */}
                <div style={{ background: '#f3f0ff', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#573cfa' }}>Calculated Total Semester Fee:</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#573cfa' }}>₹ {calculateTotal(formData).toLocaleString('en-IN')}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: '#573cfa', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Save Semester Structure
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: EDIT FEE STRUCTURE ── */}
      <AnimatePresence>
        {editingStructure && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: '#fff', borderRadius: '24px', width: '560px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#09090b' }}>Edit Semester {editingStructure.semester} Fee Structure</h3>
                <X size={20} color="#71717a" style={{ cursor: 'pointer' }} onClick={() => setEditingStructure(null)} />
              </div>

              <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>Semester</label>
                    <input
                      type="number"
                      value={editingStructure.semester}
                      onChange={(e) => setEditingStructure({ ...editingStructure, semester: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px', fontWeight: 700 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>Category</label>
                    <input
                      type="text"
                      value={editingStructure.category}
                      onChange={(e) => setEditingStructure({ ...editingStructure, category: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>Tuition Fee (₹)</label>
                    <input
                      type="number"
                      value={editingStructure.tuition_fee}
                      onChange={(e) => setEditingStructure({ ...editingStructure, tuition_fee: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>Exam Fee (₹)</label>
                    <input
                      type="number"
                      value={editingStructure.exam_fee}
                      onChange={(e) => setEditingStructure({ ...editingStructure, exam_fee: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>Library Fee (₹)</label>
                    <input
                      type="number"
                      value={editingStructure.library_fee}
                      onChange={(e) => setEditingStructure({ ...editingStructure, library_fee: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>Development Fee (₹)</label>
                    <input
                      type="number"
                      value={editingStructure.development_fee}
                      onChange={(e) => setEditingStructure({ ...editingStructure, development_fee: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>Laboratory Fee (₹)</label>
                  <input
                    type="number"
                    value={editingStructure.laboratory_fee}
                    onChange={(e) => setEditingStructure({ ...editingStructure, laboratory_fee: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px' }}
                  />
                </div>

                {/* Total Preview */}
                <div style={{ background: '#f3f0ff', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#573cfa' }}>Updated Total Semester Fee:</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#573cfa' }}>₹ {calculateTotal(editingStructure).toLocaleString('en-IN')}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingStructure(null)}
                    style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: '#573cfa', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Save size={16} /> Save Changes
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
