export default function Attendance() {
  return (
    <div className="page-center">
      <div className="att-grid">
        {/* Mark panel */}
        <div className="mark-panel" id="att-mark-panel">
          <div className="card-header">
            <span className="card-title">Mark Attendance</span>
            <button className="btn-qr-gen">
              <span>&#x25A6;</span> Generate QR
            </button>
          </div>
          <div className="panel-body">
            <div className="fg">
              <label>Subject</label>
              <select>
                <option value="">- Select Subject -</option>
                <option value="cs01">CS01 - Advance Java</option>
                <option value="cs02">CS02 - Data Prepration & Analysis</option>
              </select>
            </div>
            <div className="fg">
              <label>Student</label>
              <select>
                <option value="">- Select Subject First -</option>
                <option value="1">Mit Bulsari (CS631)</option>
              </select>
            </div>
            <div className="fg">
              <label>Date</label>
              <input type="date" />
            </div>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label>Status</label>
              <div className="att-status-btns">
                <button className="att-btn present">
                  <span className="icon">✓</span><span>Present</span>
                </button>
                <button className="att-btn absent">
                  <span className="icon">✕</span><span>Absent</span>
                </button>
                <button className="att-btn late">
                  <span className="icon">⏱</span><span>Late</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Report panel */}
        <div className="mark-panel">
          <div className="card-header">
            <span className="card-title" id="att-report-title">Attendance Report</span>
          </div>
          <div className="panel-body">
            <div className="fg" id="rpt-student-field">
              <label id="rpt-student-label">Student</label>
              <select>
                <option value="">- Select Student -</option>
                <option value="1">Mit Bulsari (CS631)</option>
              </select>
            </div>
            <div className="fg">
              <label>Subject <span style={{ fontSize: '10px', color: 'var(--text3)' }}>(blank = all)</span></label>
              <select>
                <option value="">All subjects</option>
                <option value="cs01">CS01 - Advance Java</option>
              </select>
            </div>
            <button className="btn btn-primary" style={{ marginBottom: '16px' }}>View Report</button>
            <div id="att-report-result">
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)', fontSize: '13px' }}>
                Select a student and click View Report
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
