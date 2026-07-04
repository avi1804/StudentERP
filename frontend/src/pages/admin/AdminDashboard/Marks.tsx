export default function Marks() {
  return (
    <div className="page-center">
      <div className="marks-grid">
        {/* Enter marks panel */}
        <div className="marks-input-panel" id="marks-entry-panel">
          <div className="card-header">
            <span className="card-title">Enter Marks</span>
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
              <label>Exam Type</label>
              <select>
                <option value="MID_SEM">Mid Semester</option>
                <option value="END_SEM">End Semester</option>
                <option value="INTERNAL">Internal</option>
                <option value="PRACTICAL">Practical</option>
              </select>
            </div>
            <div className="two-input-row">
              <div className="fg">
                <label>Marks Obtained</label>
                <input type="number" placeholder="42" step="0.5" />
              </div>
              <div className="fg">
                <label>Total Marks</label>
                <input type="number" placeholder="50" />
              </div>
            </div>
            <button className="btn btn-primary">Save Marks</button>
          </div>
        </div>

        {/* Result card lookup */}
        <div className="marks-input-panel" id="result-lookup-panel">
          <div className="card-header">
            <span className="card-title" id="rc-panel-title">View Result Card</span>
          </div>
          <div className="panel-body">
            <div className="fg" id="rc-student-field">
              <label>Student</label>
              <select>
                <option value="">- Select Student -</option>
                <option value="1">Mit Bulsari (CS631)</option>
              </select>
            </div>
            <div className="fg">
              <label>Exam Type</label>
              <select>
                <option value="MID_SEM">Mid Semester</option>
                <option value="END_SEM">End Semester</option>
                <option value="INTERNAL">Internal</option>
                <option value="PRACTICAL">Practical</option>
              </select>
            </div>
            <button className="btn btn-primary" id="rc-get-btn">Get Result Card</button>
            <div style={{ marginTop: '16px', color: 'var(--text3)', fontSize: '12px', textAlign: 'center' }} id="rc-hint">
              Select a student and click Get Result Card
            </div>
          </div>
        </div>
      </div>
      
      {/* Result card output */}
      <div id="result-card-output"></div>
    </div>
  );
}
