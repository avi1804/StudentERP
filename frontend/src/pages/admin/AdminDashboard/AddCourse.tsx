import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AddCourse() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    navigate("/Admin-Dashboard/course/manage");
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card-header">
        <div className="card-title">Add Course</div>
      </div>
      <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
        <div className="fg">
          <label htmlFor="courseName">Course Name</label>
          <input
            id="courseName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter course name"
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Add Course
        </button>
      </form>
    </div>
  );
}
