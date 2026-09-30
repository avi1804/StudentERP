import { API_BASE_URL } from '../../../config';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { 
  Bell, Plus, Search, Edit2, Trash2, Calendar, Tag, CheckCircle2, 
  AlertCircle, X, Megaphone, Clock, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TextType from "../../../components/TextType";

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
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", category: "GENERAL", is_active: true });
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchNotices = async () => {
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch(API_BASE_URL + "/api/v1/notices/", {
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

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch(`${API_BASE_URL}/api/v1/notices/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setNotices(prev => prev.filter(n => n.id !== id));
        showToast("Notice deleted successfully.");
      } else {
        showToast("Failed to delete notice.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error occurred.", "error");
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
      const res = await fetch(`${API_BASE_URL}/api/v1/notices/${editingNotice.id}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editForm)
      });
      
      if (res.ok) {
        setNotices(prev => prev.map(n => n.id === editingNotice.id ? { ...n, ...editForm } : n));
        setEditingNotice(null);
        showToast("Notice updated successfully!");
      } else {
        showToast("Failed to update notice.", "error");
      }
    } catch (err) {
      showToast("Network error occurred.", "error");
    }
  };

  const filteredNotices = notices.filter(n => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'ALL' || n.category.toUpperCase() === categoryFilter.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadgeStyle = (category: string) => {
    switch (category.toUpperCase()) {
      case 'URGENT':
        return { bg: '#fef2f2', color: '#dc2626', border: '1px solid rgba(220, 38, 38, 0.2)' };
      case 'EXAM':
        return { bg: '#fffbeb', color: '#d97706', border: '1px solid rgba(217, 119, 6, 0.2)' };
      case 'FEE':
        return { bg: 'rgba(40, 43, 74, 0.08)', color: '#282B4A', border: '1px solid rgba(40, 43, 74, 0.16)' };
      case 'EVENT':
        return { bg: '#f0fdf4', color: '#16a34a', border: '1px solid rgba(22, 163, 74, 0.2)' };
      case 'HOLIDAY':
        return { bg: '#fdf2f8', color: '#db2777', border: '1px solid rgba(219, 39, 119, 0.2)' };
      default:
        return { bg: 'rgba(40, 43, 74, 0.08)', color: '#282B4A', border: '1px solid rgba(40, 43, 74, 0.14)' };
    }
  };

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>Notice</span>
            <span style={{
              background: '#282B4A',
              color: '#EEEBDA',
              padding: '4px 18px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(40, 43, 74, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1.2,
              border: '1px solid rgba(238, 235, 218, 0.2)',
            }}>
              <TextType
                text={["Board", "Bulletins", "Announcements"]}
                typingSpeed={60}
                deletingSpeed={35}
                pauseDuration={2200}
                loop={true}
                showCursor={true}
                cursorCharacter="|"
                style={{ color: '#EEEBDA' }}
              />
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
            View, edit, broadcast, and manage official notices and alerts across campus
          </div>
        </div>

        <button 
          onClick={() => navigate('/admin/dashboard/notify/student')}
          style={{
            background: '#282B4A',
            color: '#EEEBDA',
            padding: '12px 24px',
            borderRadius: '16px',
            fontWeight: 700,
            fontSize: '14px',
            border: '1px solid rgba(238, 235, 218, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(40, 43, 74, 0.25)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#373a61')}
          onMouseLeave={e => (e.currentTarget.style.background = '#282B4A')}
        >
          <Plus size={18} color="#EEEBDA" />
          Post Notice
        </button>
      </div>

      {/* ── Toast Notifications ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              padding: '14px 20px',
              borderRadius: '14px',
              marginBottom: '24px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: toastMessage.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(5, 150, 105, 0.1)',
              color: toastMessage.type === 'error' ? '#ef4444' : '#059669',
              border: `1px solid ${toastMessage.type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(5, 150, 105, 0.2)'}`,
            }}
          >
            {toastMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            {toastMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Container Card ── */}
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        border: '1.5px solid rgba(40, 43, 74, 0.08)',
        boxShadow: '0 4px 24px rgba(40, 43, 74, 0.03)',
        padding: '24px',
      }}>
        {/* ── Search & Filter Controls ── */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} color="#71717a" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search notices by title or content..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 18px 12px 46px',
                borderRadius: '16px',
                border: '1.5px solid rgba(40, 43, 74, 0.12)',
                background: '#ffffff',
                fontSize: '14px',
                color: '#09090b',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#282B4A')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(40, 43, 74, 0.12)')}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="#282B4A" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '16px',
                border: '1.5px solid rgba(40, 43, 74, 0.12)',
                fontSize: '13px',
                fontWeight: 600,
                color: '#282B4A',
                background: '#ffffff',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Categories</option>
              <option value="GENERAL">General</option>
              <option value="EVENT">Event</option>
              <option value="HOLIDAY">Holiday</option>
              <option value="EXAM">Exam</option>
              <option value="FEE">Fee</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        {/* ── Notice List ── */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            Loading notice feed...
          </div>
        ) : filteredNotices.length === 0 ? (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: '#71717a',
            borderRadius: '20px',
            border: '1.5px dashed rgba(40, 43, 74, 0.14)',
            background: 'rgba(238, 235, 218, 0.15)',
          }}>
            <Bell size={40} color="#282B4A" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#282B4A' }}>No notices found</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              {searchQuery ? 'Try changing your search terms or filter criteria.' : 'Click "+ Post Notice" to publish your first campus announcement.'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredNotices.map((n, idx) => {
              const catBadge = getCategoryBadgeStyle(n.category);
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    background: '#ffffff',
                    borderRadius: '18px',
                    border: '1px solid rgba(40, 43, 74, 0.08)',
                    boxShadow: '0 2px 10px rgba(40, 43, 74, 0.02)',
                    transition: 'all 0.18s ease',
                    gap: '20px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#282B4A';
                    e.currentTarget.style.background = '#fafafa';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(40, 43, 74, 0.08)';
                    e.currentTarget.style.background = '#ffffff';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 }}>
                    <span style={{
                      ...catBadge,
                      padding: '5px 12px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}>
                      {n.category}
                    </span>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#09090b', lineHeight: 1.3 }}>
                        {n.title}
                      </div>
                      
                      <div style={{ fontSize: '13px', color: '#52525b', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {n.content}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#71717a', marginTop: '4px' }}>
                        <Clock size={13} color="#282B4A" />
                        <span>{new Date(n.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <button
                      onClick={() => handleEditClick(n)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '10px',
                        background: 'rgba(40, 43, 74, 0.06)',
                        border: '1px solid rgba(40, 43, 74, 0.12)',
                        color: '#282B4A',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#282B4A';
                        e.currentTarget.style.color = '#EEEBDA';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(40, 43, 74, 0.06)';
                        e.currentTarget.style.color = '#282B4A';
                      }}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(n.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '10px',
                        background: 'rgba(239, 68, 68, 0.06)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#ef4444';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)';
                        e.currentTarget.style.color = '#ef4444';
                      }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      <AnimatePresence>
        {editingNotice && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(40, 43, 74, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '480px',
                padding: '28px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                border: '1px solid rgba(40, 43, 74, 0.1)',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.4px' }}>
                  Edit Notice
                </h3>
                <button
                  onClick={() => setEditingNotice(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#71717a',
                    padding: '4px'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#282B4A', marginBottom: '6px' }}>
                    Title *
                  </label>
                  <input 
                    type="text" 
                    value={editForm.title} 
                    onChange={e => setEditForm({...editForm, title: e.target.value})} 
                    required 
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#282B4A')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#282B4A', marginBottom: '6px' }}>
                    Content *
                  </label>
                  <textarea 
                    rows={4}
                    value={editForm.content} 
                    onChange={e => setEditForm({...editForm, content: e.target.value})} 
                    required 
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#282B4A')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#282B4A', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select 
                    value={editForm.category} 
                    onChange={e => setEditForm({...editForm, category: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: '#ffffff',
                      fontWeight: 600,
                      color: '#282B4A',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="GENERAL">General</option>
                    <option value="EXAM">Exam</option>
                    <option value="FEE">Fee</option>
                    <option value="EVENT">Event</option>
                    <option value="HOLIDAY">Holiday</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => setEditingNotice(null)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#475569',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    style={{
                      padding: '10px 24px',
                      borderRadius: '12px',
                      border: '1px solid rgba(238, 235, 218, 0.2)',
                      background: '#282B4A',
                      color: '#EEEBDA',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(40, 43, 74, 0.25)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#373a61')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#282B4A')}
                  >
                    Save Changes
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
