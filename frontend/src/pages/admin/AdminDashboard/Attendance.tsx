import { useState } from "react";

export default function Attendance() {
  const [subject, setSubject] = useState("");
  const [student, setStudent] = useState("");
  const [date, setDate] = useState("");

  return (
    <div className="page-wide" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      
      {/* Mark Attendance Card */}
      <div className="card" style={{ flex: 1, padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, color: 'var(--text)' }}>Mark Attendance</h3>
          <button className="btn" style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)' }}>
            ⊞ Generate QR
          </button>
        </div>

        <div className="fg" style={{ marginBottom: '16px' }}>
          <label>Subject</label>
          <select value={subject} onChange={e => setSubject(e.target.value)}>
            <option value="">- Select Subject -</option>
            <option value="CS01">Software Group Project</option>
          </select>
        </div>

        <div className="fg" style={{ marginBottom: '16px' }}>
          <label>Student</label>
          <select value={student} onChange={e => setStudent(e.target.value)}>
            <option value="">- Select Subject First -</option>
          </select>
        </div>

        <div className="fg" style={{ marginBottom: '24px' }}>
          <label>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text2)', marginBottom: '8px' }}>Status</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn" style={{ flex: 1, height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--surface2)', border: '1px solid #198754', color: '#198754', borderRadius: '12px' }}>
              <span style={{ fontSize: '24px' }}>✓</span>
              Present
            </button>
            <button className="btn" style={{ flex: 1, height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--surface2)', border: '1px solid #dc3545', color: '#dc3545', borderRadius: '12px' }}>
              <span style={{ fontSize: '24px' }}>✕</span>
              Absent
            </button>
            <button className="btn" style={{ flex: 1, height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--surface2)', border: '1px solid #fd7e14', color: '#fd7e14', borderRadius: '12px' }}>
              <span style={{ fontSize: '24px' }}>⏱</span>
              Late
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Report Card */}
      <div className="card" style={{ width: '380px', padding: '24px' }}>
        <h3 style={{ margin: 0, color: 'var(--text)', marginBottom: '24px' }}>Attendance Report</h3>

        <div className="fg" style={{ marginBottom: '16px' }}>
          <label>Student</label>
          <select>
            <option value="">- Select Student -</option>
          </select>
        </div>

        <div className="fg" style={{ marginBottom: '24px' }}>
          <label>Subject <span style={{ fontSize: '10px', color: 'var(--text3)' }}>(blank = all)</span></label>
          <select>
            <option value="">All subjects</option>
          </select>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', padding: '12px', marginBottom: '16px' }}>
          View Report
        </button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text3)', margin: 0 }}>
          Select a student and click View Report
        </p>
      </div>

    </div>
  );
}
