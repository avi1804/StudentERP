import { useState, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '../../../api/axios';
import { Upload, UserPlus, FileSpreadsheet, CheckCircle2, AlertTriangle, Download, X, Users } from 'lucide-react';

export default function AddStudent() {
  // ── Mode Toggle ──
  const [mode, setMode] = useState<'single' | 'bulk'>('single');

  // ── Single Student Form State ──
  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '', enrollment_number: '', branch: 'CSE', semester: '', phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // ── Bulk Import State ──
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkResult, setBulkResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Single Student Handlers ──
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await apiClient.post('/students/enroll', {
        ...formData,
        semester: parseInt(formData.semester, 10)
      });
      setMessage('Student enrolled successfully!');
      setFormData({ full_name: '', email: '', password: '', enrollment_number: '', branch: 'CSE', semester: '', phone: '' });
    } catch (error: any) {
      if (error.response?.data?.detail) {
        setMessage(`Error: ${error.response.data.detail}`);
      } else {
        setMessage('Network error or failed to enroll student.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Bulk Import Handlers ──
  const handleFileSelect = (file: File) => {
    const validExts = ['.csv', '.xlsx', '.xls'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExts.includes(ext)) {
      setBulkResult({ error: 'Invalid file type. Please upload a .csv or .xlsx file.' });
      return;
    }
    setBulkFile(file);
    setBulkResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return;
    setBulkUploading(true);
    setBulkResult(null);

    try {
      const fd = new FormData();
      fd.append('file', bulkFile);

      const token = useAuthStore.getState().accessToken;
      const res = await fetch(`${(apiClient.defaults.baseURL || '')}/students/bulk-import`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();

      if (!res.ok) {
        setBulkResult({ error: data.detail || 'Upload failed.' });
      } else {
        setBulkResult(data);
      }
    } catch (err: any) {
      setBulkResult({ error: 'Network error. Please try again.' });
    } finally {
      setBulkUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = "full_name,email,password,enrollment_number,branch,semester,phone\nAnika Sharma,anika@college.edu,Pass1234,CS2301,CSE,1,9876543210\nRahul Kumar,rahul@college.edu,Pass5678,EC2302,ECE,3,9876543211";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'student_import_template.csv';
    link.click();
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>

      {/* Mode Toggle Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '28px', background: '#f4f4f5', padding: '6px', borderRadius: '16px' }}>
        <button
          type="button"
          onClick={() => { setMode('single'); setBulkResult(null); }}
          style={{
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            background: mode === 'single' ? '#573cfa' : 'transparent',
            color: mode === 'single' ? '#fff' : '#52525b',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <UserPlus size={16} /> Add Single Student
        </button>

        <button
          type="button"
          onClick={() => { setMode('bulk'); setMessage(''); }}
          style={{
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            background: mode === 'bulk' ? '#573cfa' : 'transparent',
            color: mode === 'bulk' ? '#fff' : '#52525b',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <Upload size={16} /> Bulk Import (CSV / Excel)
        </button>
      </div>

      {/* ══════════ MODE 1: SINGLE STUDENT FORM ══════════ */}
      {mode === 'single' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e4e4e7', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#09090b', margin: 0 }}>Enroll New Student</h2>
            <p style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>Fill in student details to create their account and profile.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {message && (
              <div style={{
                marginBottom: '16px', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 600,
                background: message.includes('Error') ? '#fef2f2' : '#f0fdf4',
                color: message.includes('Error') ? '#dc2626' : '#16a34a',
                border: `1px solid ${message.includes('Error') ? '#fecaca' : '#bbf7d0'}`,
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                {message.includes('Error') ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                {message}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Full Name *</label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Anika Sharma" required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '13px', fontWeight: 600, outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="anika@college.edu" required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '13px', fontWeight: 600, outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Password *</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 8 characters" required minLength={8}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '13px', fontWeight: 600, outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Roll Number *</label>
                <input type="text" name="enrollment_number" value={formData.enrollment_number} onChange={handleChange} placeholder="CS2301" required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '13px', fontWeight: 600, outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Branch *</label>
                <select name="branch" value={formData.branch} onChange={handleChange} required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '13px', fontWeight: 600, outline: 'none', background: '#fff' }}
                >
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                  <option value="IT">IT</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Semester *</label>
                <select name="semester" value={formData.semester} onChange={handleChange} required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '13px', fontWeight: 600, outline: 'none', background: '#fff' }}
                >
                  <option value="">Select Semester</option>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Phone (Optional)</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '13px', fontWeight: 600, outline: 'none' }}
              />
            </div>

            <button type="submit" disabled={loading}
              style={{
                width: '100%', marginTop: '24px', padding: '14px', background: '#573cfa', color: '#ffffff', border: 'none', borderRadius: '12px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 14px rgba(87, 60, 250, 0.3)', opacity: loading ? 0.7 : 1
              }}
            >
              <UserPlus size={16} /> {loading ? 'Enrolling...' : 'Enroll Student'}
            </button>
          </form>
        </div>
      )}

      {/* ══════════ MODE 2: BULK CSV / EXCEL IMPORT ══════════ */}
      {mode === 'bulk' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e4e4e7', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#09090b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={22} /> Bulk Student Import
              </h2>
              <p style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>Upload a CSV or Excel file to enroll multiple students at once.</p>
            </div>
            <button onClick={handleDownloadTemplate}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: '#f4f4f5', color: '#374151',
                border: '1px solid #e4e4e7', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              <Download size={14} /> Download Template
            </button>
          </div>

          {/* Expected Columns Info */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Expected CSV/Excel Columns
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['full_name', 'email', 'password', 'enrollment_number', 'branch', 'semester', 'phone (optional)'].map(col => (
                <span key={col} style={{
                  padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, fontFamily: 'monospace',
                  background: col.includes('optional') ? '#fef3c7' : '#e0e7ff', color: col.includes('optional') ? '#92400e' : '#3730a3'
                }}>
                  {col}
                </span>
              ))}
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragActive ? '#573cfa' : '#d4d4d8'}`,
              borderRadius: '16px',
              padding: '40px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragActive ? '#f3f0ff' : '#fafafa',
              transition: 'all 0.2s',
              marginBottom: '20px'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
              style={{ display: 'none' }}
            />

            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <FileSpreadsheet size={28} />
            </div>

            {bulkFile ? (
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#09090b', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#16a34a" /> {bulkFile.name}
                  <button onClick={(e) => { e.stopPropagation(); setBulkFile(null); setBulkResult(null); }}
                    style={{ background: '#fef2f2', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <X size={12} color="#dc2626" />
                  </button>
                </div>
                <div style={{ fontSize: '12px', color: '#71717a' }}>{(bulkFile.size / 1024).toFixed(1)} KB · Ready to import</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  Drop your CSV or Excel file here, or click to browse
                </div>
                <div style={{ fontSize: '12px', color: '#71717a' }}>
                  Supports .csv, .xlsx, .xls files
                </div>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleBulkUpload}
            disabled={!bulkFile || bulkUploading}
            style={{
              width: '100%', padding: '14px', background: bulkFile ? '#573cfa' : '#d4d4d8', color: '#ffffff', border: 'none', borderRadius: '12px',
              fontSize: '14px', fontWeight: 700, cursor: bulkFile ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: bulkFile ? '0 4px 14px rgba(87, 60, 250, 0.3)' : 'none', opacity: bulkUploading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            <Upload size={16} /> {bulkUploading ? 'Importing Students...' : 'Import All Students'}
          </button>

          {/* ── Result Feedback ── */}
          {bulkResult && (
            <div style={{ marginTop: '20px' }}>
              {bulkResult.error ? (
                <div style={{ padding: '14px 18px', borderRadius: '12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} /> {bulkResult.error}
                </div>
              ) : (
                <div>
                  {/* Summary Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '16px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                      <div style={{ fontSize: '28px', fontWeight: 800, color: '#16a34a' }}>{bulkResult.success_count}</div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534' }}>Successfully Enrolled</div>
                    </div>
                    <div style={{ background: bulkResult.error_count > 0 ? '#fef2f2' : '#f4f4f5', borderRadius: '12px', padding: '16px', border: `1px solid ${bulkResult.error_count > 0 ? '#fecaca' : '#e4e4e7'}`, textAlign: 'center' }}>
                      <div style={{ fontSize: '28px', fontWeight: 800, color: bulkResult.error_count > 0 ? '#dc2626' : '#71717a' }}>{bulkResult.error_count}</div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: bulkResult.error_count > 0 ? '#991b1b' : '#71717a' }}>Errors / Skipped</div>
                    </div>
                    <div style={{ background: '#f3f0ff', borderRadius: '12px', padding: '16px', border: '1px solid #ddd6fe', textAlign: 'center' }}>
                      <div style={{ fontSize: '28px', fontWeight: 800, color: '#573cfa' }}>{bulkResult.total_rows}</div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#4c1d95' }}>Total Rows in File</div>
                    </div>
                  </div>

                  {/* Success Message */}
                  <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} /> {bulkResult.message}
                  </div>

                  {/* Error Details Table */}
                  {bulkResult.errors && bulkResult.errors.length > 0 && (
                    <div style={{ marginTop: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #fecaca', overflow: 'hidden' }}>
                      <div style={{ padding: '12px 16px', background: '#fef2f2', fontSize: '12px', fontWeight: 800, color: '#991b1b', borderBottom: '1px solid #fecaca' }}>
                        Import Errors (First {bulkResult.errors.length})
                      </div>
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {bulkResult.errors.map((err: any, i: number) => (
                          <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid #fef2f2', fontSize: '12px', display: 'flex', gap: '12px' }}>
                            <span style={{ fontWeight: 700, color: '#71717a', minWidth: '50px' }}>Row {err.row}</span>
                            <span style={{ fontWeight: 700, color: '#573cfa', minWidth: '90px', fontFamily: 'monospace' }}>{err.enrollment}</span>
                            <span style={{ color: '#dc2626', fontWeight: 600 }}>{err.error}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
