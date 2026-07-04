import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

interface Notice {
  id: number;
  title: string;
  content: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

export default function NotifyFaculty() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", category: "GENERAL", is_active: true });

  const fetchNotices = async () => {
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch("http://localhost:8000/api/v1/notices/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotices(data.items || data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch(`http://localhost:8000/api/v1/notices/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setNotices(notices.filter(n => n.id !== id));
      } else {
        alert("Failed to delete notice.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  const handleEditClick = (notice: Notice) => {
    setEditingNotice(notice);
    setEditForm({ 
      title: notice.title,
      content: notice.content,
      category: notice.category,
      is_active: notice.is_active
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;
    
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch(`http://localhost:8000/api/v1/notices/${editingNotice.id}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editForm)
      });
      
      if (res.ok) {
        setNotices(notices.map(n => n.id === editingNotice.id ? { ...n, ...editForm } : n));
        setEditingNotice(null);
      } else {
        alert("Failed to update notice.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  return (
    <div className="page-wide">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Notice Board</span>
          <button 
            className="card-btn" 
            onClick={() => navigate('/Admin-Dashboard/notify/student')}
          >
            + Post Notice
          </button>
        </div>
        <div id="n-body">
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center' }}>Loading notices...</div>
          ) : notices.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center' }}>No notices posted yet.</div>
          ) : (
            notices.map(n => (
              <div className="notice-item" key={n.id}>
                <span className={`badge badge-${n.category === 'URGENT' ? 'red' : 'purple'}`} style={{ textTransform: 'uppercase' }}>
                  {n.category}
                </span>
                <div className="notice-body">
                  <div className="notice-title">{n.title}</div>
                  <div className="notice-content">{n.content}</div>
                  <div className="notice-date">{new Date(n.created_at).toLocaleString()}</div>
                </div>
                <div className="notice-acts">
                  <button className="btn-edit" onClick={() => handleEditClick(n)} style={{ fontSize: '13px', padding: '4px 10px', borderRadius: '6px', background: 'transparent', border: '1px solid rgba(154,168,255,0.4)', color: 'var(--primary)', cursor: 'pointer' }}>Edit</button>
                  <button className="btn-del" onClick={() => handleDelete(n.id)} style={{ fontSize: '13px', padding: '4px 10px', borderRadius: '6px', background: 'transparent', border: '1px solid rgba(239,68,68,0.4)', color: 'var(--red)', cursor: 'pointer', marginLeft: '8px' }}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {editingNotice && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px', padding: '24px' }}>
            <h3 style={{ marginTop: 0 }}>Edit Notice</h3>
            <form onSubmit={handleUpdate}>
              <div className="fg" style={{ marginBottom: '16px' }}>
                <label>Title</label>
                <input 
                  type="text" 
                  value={editForm.title} 
                  onChange={e => setEditForm({...editForm, title: e.target.value})} 
                  required 
                />
              </div>
              <div className="fg" style={{ marginBottom: '16px' }}>
                <label>Content</label>
                <textarea 
                  rows={4}
                  value={editForm.content} 
                  onChange={e => setEditForm({...editForm, content: e.target.value})} 
                  required 
                ></textarea>
              </div>
              <div className="fg" style={{ marginBottom: '16px' }}>
                <label>Category</label>
                <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                  <option value="GENERAL">General</option>
                  <option value="EXAM">Exam</option>
                  <option value="FEE">Fee</option>
                  <option value="EVENT">Event</option>
                  <option value="HOLIDAY">Holiday</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" className="btn" style={{ background: 'var(--surface2)', color: 'var(--text)' }} onClick={() => setEditingNotice(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
