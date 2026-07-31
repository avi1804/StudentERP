import React, { useState, useEffect } from 'react';
import { Search, Filter, UserCheck, Clock, CheckCircle, AlertTriangle, Eye, Plus, X, Send, Calculator, Layers, Users, User } from 'lucide-react';
import { useFeeStore } from '../../../store/useFeeStore';

import { apiClient } from '../../../api/axios';

export function StudentFees() {
  const { studentFees, fetchStudentFees, assignFee, isLoading } = useFeeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<'INDIVIDUAL' | 'BULK_SEM'>('BULK_SEM');
  
  // Bulk Semester State
  const [bulkSem, setBulkSem] = useState<number>(1);

  // Individual Fee State
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [individualCategory, setIndividualCategory] = useState('Library Fee');
  const [singleAmount, setSingleAmount] = useState<number>(5000);
  
  const [dueDate, setDueDate] = useState('2026-08-31');

  // Real-time Student Search State
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchStudentFees();
    apiClient.get('/students/?limit=500')
      .then(res => {
        const items = res.data?.items || res.data || [];
        setAllStudents(items);
      })
      .catch(err => console.error("Failed to load students for real-time search:", err));
  }, [fetchStudentFees]);

  const handleAssignFee = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    setFormSuccess('');

    try {
      if (assignTarget === 'BULK_SEM') {
        const isOdd = bulkSem % 2 !== 0;
        const total_fee = isOdd ? 90000 : 100000;
        await assignFee({
          bulk_semester: bulkSem,
          semester: bulkSem,
          category: `Semester ${bulkSem} Package`,
          tuition_fee: isOdd ? 50000 : 60000,
          exam_fee: 10000,
          library_fee: 5000,
          development_fee: 15000,
          laboratory_fee: 10000,
          due_date: dueDate
        });
        setFormSuccess(`Fixed Semester ${bulkSem} Package Fee (₹${total_fee.toLocaleString('en-IN')}) successfully assigned to ALL Semester ${bulkSem} students!`);
      } else {
        if (!enrollmentNumber.trim()) {
          setFormError("Please enter student enrollment number.");
          setSubmitting(false);
          return;
        }
        if (singleAmount <= 0) {
          setFormError("Please enter a valid fee amount.");
          setSubmitting(false);
          return;
        }

        // Map individual category to payload
        let payload: any = {
          enrollment_number: enrollmentNumber.trim(),
          category: individualCategory,
          due_date: dueDate
        };

        if (individualCategory === 'Library Fee') payload.library_fee = singleAmount;
        else if (individualCategory === 'Exam Fee') payload.exam_fee = singleAmount;
        else if (individualCategory === 'Hostel Fee') payload.hostel_fee = singleAmount;
        else if (individualCategory === 'Late Fine' || individualCategory === 'Penalty Fine') payload.late_fine = singleAmount;
        else payload.miscellaneous_fee = singleAmount;

        await assignFee(payload);
        setFormSuccess(`Successfully assigned ${individualCategory} (₹${singleAmount.toLocaleString('en-IN')}) to student ${enrollmentNumber}!`);
        setEnrollmentNumber('');
      }

      setTimeout(() => {
        setIsAssignModalOpen(false);
        setFormSuccess('');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.detail || "Failed to assign fee. Please check enrollment number.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudentSuggestions = (allStudents || []).filter(st => {
    if (!enrollmentNumber.trim()) return false;
    const q = enrollmentNumber.toLowerCase().trim();
    const nameMatch = (st.user?.full_name || '').toLowerCase().includes(q);
    const rollMatch = (st.enrollment_number || '').toLowerCase().includes(q);
    return nameMatch || rollMatch;
  });

  const filteredFees = (studentFees || []).filter(item => {
    const matchesSearch = (item.student_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.enrollment_number || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.5px' }}>
            Semester & Individual Student Fee Allocator
          </h1>
          <p style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>
            Fixed semester package fee for all students + Clean individual category fee assignment
          </p>
        </div>

        <button
          onClick={() => { setFormError(''); setFormSuccess(''); setIsAssignModalOpen(true); }}
          style={{
            background: '#573cfa',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(87, 60, 250, 0.3)'
          }}
        >
          <Plus size={16} /> Assign Fee Bill
        </button>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#52525b', marginBottom: '8px' }}>Total Assigned Bills</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#09090b' }}>{studentFees.length}</div>
        </div>

        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#52525b', marginBottom: '8px' }}>Fully Paid Students</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16a34a' }}>
            {studentFees.filter(s => s.status === 'PAID').length}
          </div>
        </div>

        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#52525b', marginBottom: '8px' }}>Partial Payments</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#ca8a04' }}>
            {studentFees.filter(s => s.status === 'PARTIAL').length}
          </div>
        </div>

        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#52525b', marginBottom: '8px' }}>Pending / Overdue</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#dc2626' }}>
            {studentFees.filter(s => s.status === 'PENDING' || s.status === 'OVERDUE').length}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e4e4e7', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, background: '#f4f4f5', padding: '8px 14px', borderRadius: '10px' }}>
          <Search size={16} color="#71717a" />
          <input
            type="text"
            placeholder="Search by student name or enrollment number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #e4e4e7', fontSize: '13px', background: '#fff', cursor: 'pointer' }}
        >
          <option value="ALL">All Statuses</option>
          <option value="PAID">Paid</option>
          <option value="PARTIAL">Partial</option>
          <option value="PENDING">Pending</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e4e4e7', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e4e4e7' }}>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Student Info</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Total Fee Bill</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Paid Amount</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Pending Amount</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Due Date</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  Loading real-time student fees...
                </td>
              </tr>
            ) : filteredFees.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  No fee bills assigned yet. Click "+ Assign Fee Bill" to send fees to students.
                </td>
              </tr>
            ) : (
              filteredFees.map((sf) => (
                <tr key={sf.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{sf.student_name || 'Student'}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{sf.enrollment_number || `ID: ${sf.student_id}`}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#334155' }}>₹ {sf.total_fee?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '16px 20px', color: '#16a34a', fontWeight: 700 }}>₹ {sf.paid_amount?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '16px 20px', color: sf.pending_amount > 0 ? '#dc2626' : '#64748b', fontWeight: 700 }}>
                    ₹ {sf.pending_amount?.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '16px 20px', color: '#64748b' }}>{sf.due_date ? new Date(sf.due_date).toLocaleDateString() : '-'}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                      background: sf.status === 'PAID' ? '#dcfce7' : sf.status === 'PARTIAL' ? '#fef3c7' : '#fee2e2',
                      color: sf.status === 'PAID' ? '#15803d' : sf.status === 'PARTIAL' ? '#b45309' : '#b91c1c'
                    }}>
                      {sf.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── CLEAN MODAL: NO CLUTTER OF MANY BOXES ── */}
      {isAssignModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '520px', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#09090b', margin: 0 }}>Fee Allocation Gateway</h3>
                <span style={{ fontSize: '11px', color: '#573cfa', fontWeight: 700 }}>Clean & Simple Fee Assignment</span>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} style={{ background: '#f4f4f5', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} color="#71717a" />
              </button>
            </div>

            {formError && (
              <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '13px', fontWeight: 600 }}>
                {formError}
              </div>
            )}

            {formSuccess && (
              <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '12px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', fontSize: '13px', fontWeight: 600 }}>
                {formSuccess}
              </div>
            )}

            {/* ASSIGNMENT MODE TOGGLE TABS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px', background: '#f4f4f5', padding: '6px', borderRadius: '14px' }}>
              <button
                type="button"
                onClick={() => setAssignTarget('BULK_SEM')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  background: assignTarget === 'BULK_SEM' ? '#573cfa' : 'transparent',
                  color: assignTarget === 'BULK_SEM' ? '#fff' : '#52525b',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Users size={16} /> All Students (Fixed Sem Package)
              </button>

              <button
                type="button"
                onClick={() => setAssignTarget('INDIVIDUAL')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  background: assignTarget === 'INDIVIDUAL' ? '#573cfa' : 'transparent',
                  color: assignTarget === 'INDIVIDUAL' ? '#fff' : '#52525b',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <User size={16} /> Individual Student Fee
              </button>
            </div>

            <form onSubmit={handleAssignFee} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* MODE 1: BULK FIXED SEMESTER PACKAGE */}
              {assignTarget === 'BULK_SEM' ? (
                <>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Select Semester for Fixed Package (Assigned to ALL Students) *
                    </label>
                    <select
                      value={bulkSem}
                      onChange={e => setBulkSem(Number(e.target.value))}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #573cfa', fontSize: '14px', fontWeight: 700, background: '#f3f0ff', color: '#573cfa', outline: 'none' }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={s}>
                          Semester {s} Package - ₹ {s % 2 !== 0 ? '90,000 (Odd Sem)' : '1,00,000 (Even Sem)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#166534', fontWeight: 700 }}>Fixed Package Price:</span>
                    <span style={{ fontSize: '18px', color: '#16a34a', fontWeight: 800 }}>
                      ₹ {(bulkSem % 2 !== 0 ? 90000 : 100000).toLocaleString('en-IN')}
                    </span>
                  </div>
                </>
              ) : (
                /* MODE 2: INDIVIDUAL STUDENT FEE (NO CLUTTER, SINGLE AMOUNT BOX) */
                <>
                  {/* 1. REAL-TIME SEARCH ENROLLMENT BOX */}
                  <div style={{ position: 'relative' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Enrollment Number Box (Type to Search) *
                    </label>
                    <input
                      type="text"
                      placeholder="Type name or roll no (e.g. CS629, STU-0001, Yash)..."
                      value={enrollmentNumber}
                      onChange={e => {
                        setEnrollmentNumber(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      required
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #573cfa', fontSize: '14px', outline: 'none', fontWeight: 600, background: '#ffffff' }}
                    />

                    {/* Floating Search Suggestions Dropdown */}
                    {showSuggestions && enrollmentNumber.trim().length > 0 && (
                      <div 
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 4px)',
                          left: 0,
                          right: 0,
                          zIndex: 99999,
                          background: '#ffffff',
                          borderRadius: '14px',
                          border: '1px solid #e4e4e7',
                          boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                          maxHeight: '220px',
                          overflowY: 'auto',
                          padding: '6px'
                        }}
                      >
                        {filteredStudentSuggestions.length === 0 ? (
                          <div style={{ padding: '12px', textAlign: 'center', color: '#71717a', fontSize: '12px' }}>
                            No matching student found for "{enrollmentNumber}"
                          </div>
                        ) : (
                          filteredStudentSuggestions.map(st => {
                            const name = st.user?.full_name || 'Student';
                            const roll = st.enrollment_number;
                            const sem = st.semester || 1;
                            const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

                            return (
                              <div
                                key={st.id}
                                onMouseDown={() => {
                                  setEnrollmentNumber(roll);
                                  setShowSuggestions(false);
                                }}
                                style={{
                                  padding: '10px 12px',
                                  borderRadius: '10px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  marginBottom: '4px',
                                  background: enrollmentNumber === roll ? '#f3f0ff' : '#ffffff'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#f4f4f5')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = enrollmentNumber === roll ? '#f3f0ff' : '#ffffff')}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: '#573cfa',
                                    color: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '11px'
                                  }}>
                                    {initials}
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#09090b' }}>{name}</div>
                                    <div style={{ fontSize: '11px', color: '#71717a' }}>Roll: <span style={{ fontWeight: 700, color: '#573cfa' }}>{roll}</span></div>
                                  </div>
                                </div>

                                <span style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  padding: '4px 10px',
                                  borderRadius: '8px',
                                  background: '#e0e7ff',
                                  color: '#3730a3'
                                }}>
                                  Sem {sem}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>

                  {/* 2. SELECT CATEGORY DROPDOWN */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Select Category Dropdown *
                    </label>
                    <select
                      value={individualCategory}
                      onChange={e => setIndividualCategory(e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #573cfa', fontSize: '14px', fontWeight: 700, background: '#f3f0ff', color: '#573cfa', outline: 'none' }}
                    >
                      <option value="Library Fee">📖 Library Fee</option>
                      <option value="Exam Fee">📝 Exam Fee</option>
                      <option value="Hostel Fee">🏠 Hostel Fee</option>
                      <option value="Late Fine">⚠️ Late Fine</option>
                      <option value="Penalty Fine">🚨 Penalty Fine</option>
                      <option value="Miscellaneous Fee">⚙️ Other Miscellaneous Fee</option>
                    </select>
                  </div>

                  {/* 3. ONE SINGLE FEE AMOUNT BOX */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Fee Amount (₹) *
                    </label>
                    <input
                      type="number"
                      placeholder="Enter amount to charge..."
                      value={singleAmount}
                      onChange={e => setSingleAmount(Number(e.target.value))}
                      required
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '16px', fontWeight: 800, color: '#09090b', outline: 'none' }}
                    />
                  </div>
                </>
              )}

              {/* DUE DATE BOX */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Due Date *
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none', background: 'white' }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{ width: '100%', padding: '14px', background: '#573cfa', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(87, 60, 250, 0.3)', marginTop: '8px' }}
              >
                <Send size={16} /> {submitting ? "Assigning..." : assignTarget === 'BULK_SEM' ? `Assign Fixed Semester ${bulkSem} Fee to ALL Students` : `Assign ${individualCategory} to Student`}
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
