import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Layers, DollarSign, BookOpen, 
  Trash2, Edit, CheckCircle, ChevronRight, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFeeStore } from '../../../store/useFeeStore';
import { apiClient as api } from '../../../api/axios';

export function FeeStructure() {
  const { feeStructures, fetchFeeStructures, isLoading } = useFeeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    academic_year: '2024-2025',
    department_id: 1,
    semester: 1,
    category: 'General',
    tuition_fee: 60000,
    exam_fee: 10000,
    library_fee: 5000,
    development_fee: 15000,
    laboratory_fee: 10000,
  });

  useEffect(() => {
    fetchFeeStructures();
  }, [fetchFeeStructures]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const total_amount = Number(formData.tuition_fee) + 
        Number(formData.exam_fee) + 
        Number(formData.library_fee) + 
        Number(formData.development_fee) + 
        Number(formData.laboratory_fee);
      
      await api.post('/fees/structures', { ...formData, total_amount });
      setShowAddModal(false);
      fetchFeeStructures();
    } catch (err) {
      console.error('Failed to create fee structure', err);
    }
  };

  const filteredStructures = (feeStructures || []).filter(item => 
    item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.academic_year?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.5px' }}>
            Fee Structure Builder
          </h1>
          <p style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>
            Configure and manage department-wise fee structures for academic years
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '13px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
          }}
        >
          <Plus size={16} /> Create Fee Structure
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={20} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#52525b' }}>Total Active Structures</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#09090b' }}>{feeStructures.length}</div>
        </div>

        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#52525b' }}>Avg. Total Fee</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#09090b' }}>
            ₹ {feeStructures.length > 0 
              ? Math.round(feeStructures.reduce((a, b) => a + (b.total_amount || 0), 0) / feeStructures.length).toLocaleString('en-IN')
              : 0}
          </div>
        </div>

        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#52525b' }}>Academic Year</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#09090b' }}>2024 - 2025</div>
        </div>
      </div>

      {/* Filter & Search */}
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
      </div>

      {/* Fee Structure Table */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e4e4e7', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e4e4e7' }}>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Academic Year</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Category</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Semester</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Tuition Fee</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Exam Fee</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Other Fees</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Total Amount</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569', textAlign: 'right' }}>Actions</th>
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
              filteredStructures.map((struct) => (
                <tr key={struct.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0f172a' }}>{struct.academic_year}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                      {struct.category}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#334155' }}>Sem {struct.semester}</td>
                  <td style={{ padding: '16px 20px', color: '#334155' }}>₹ {struct.tuition_fee?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '16px 20px', color: '#334155' }}>₹ {struct.exam_fee?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '16px 20px', color: '#334155' }}>
                    ₹ {((struct.library_fee || 0) + (struct.development_fee || 0) + (struct.laboratory_fee || 0)).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#0f172a' }}>
                    ₹ {struct.total_amount?.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', marginRight: '8px' }}>
                      <Edit size={16} />
                    </button>
                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: '#fff', borderRadius: '24px', width: '540px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#09090b' }}>Create Fee Structure</h3>
                <X size={20} color="#71717a" style={{ cursor: 'pointer' }} onClick={() => setShowAddModal(false)} />
              </div>

              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>Academic Year</label>
                    <input
                      type="text"
                      value={formData.academic_year}
                      onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px' }}
                      required
                    />
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
                      <option value="TFWS">TFWS</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>Semester</label>
                    <input
                      type="number"
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px' }}
                      required
                    />
                  </div>
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
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>Exam Fee (₹)</label>
                    <input
                      type="number"
                      value={formData.exam_fee}
                      onChange={(e) => setFormData({ ...formData, exam_fee: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>Library Fee (₹)</label>
                    <input
                      type="number"
                      value={formData.library_fee}
                      onChange={(e) => setFormData({ ...formData, library_fee: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px' }}
                    />
                  </div>
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
                    style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: '#6366f1', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Save Structure
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
