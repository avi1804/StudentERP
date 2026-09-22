import React, { useEffect, useState } from 'react';
import { apiClient as api } from '../../api/axios';
import { Megaphone, Bell, Calendar, Tag, User, Search, PlusCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NoticeItem {
  id: number;
  title: string;
  content: string;
  category: string;
  author_id?: number;
  author_name?: string;
  created_at: string;
  is_active?: boolean;
}

export const FacultyNotices: React.FC = () => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await api.get('/notices/');
      setNotices(response.data);
    } catch (error) {
      console.error('Failed to fetch notices', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = notices.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.category && n.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getCategoryColor = (cat: string) => {
    switch (cat?.toUpperCase()) {
      case 'EXAM': return { bg: '#fee2e2', text: '#b91c1c' };
      case 'URGENT': return { bg: '#ffedd5', text: '#c2410c' };
      case 'EVENT': return { bg: '#e0e7ff', text: '#4338ca' };
      case 'HOLIDAY': return { bg: '#fef3c7', text: '#b45309' };
      default: return { bg: 'rgba(40,43,74,0.08)', text: '#282B4A' };
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px', color: '#71717a', fontSize: '14px', fontWeight: 600 }}>
        Loading official notices...
      </div>
    );
  }

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Megaphone size={28} color="#282B4A" />
            <span>Campus Notices & Circulars</span>
            <span style={{ fontSize: '14px', fontWeight: 700, background: '#282B4A', color: '#EEEBDA', padding: '3px 12px', borderRadius: '12px' }}>
              {notices.length} Live
            </span>
          </h1>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>
            Official academic announcements, exam schedules, events, and university circulars.
          </p>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div style={{
        background: '#f4f4f5',
        borderRadius: '20px',
        padding: '16px 20px',
        border: '1.5px solid rgba(0,0,0,0.06)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', borderRadius: '12px', padding: '8px 14px', border: '1px solid rgba(0,0,0,0.1)' }}>
          <Search size={16} color="#71717a" />
          <input
            type="text"
            placeholder="Search notices by keyword, title, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '13px', color: '#18181b', fontFamily: 'inherit' }}
          />
        </div>
      </div>

      {/* ── Notice Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '18px' }}>
        {filteredNotices.map((n) => {
          const style = getCategoryColor(n.category);
          return (
            <div
              key={n.id}
              onClick={() => setSelectedNotice(n)}
              style={{
                background: '#f4f4f5',
                borderRadius: '22px',
                border: '1.5px solid rgba(0,0,0,0.07)',
                padding: '22px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.18s ease',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#282B4A';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.07)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{
                    background: style.bg,
                    color: style.text,
                    padding: '3px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase'
                  }}>
                    {n.category || 'GENERAL'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#71717a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {new Date(n.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#09090b', margin: '0 0 10px 0', lineHeight: 1.3 }}>
                  {n.title}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#52525b',
                  margin: '0 0 16px 0',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {n.content}
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#282B4A', fontWeight: 700 }}>
                <span>Read Full Circular</span>
                <span>&rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Notice Detail Modal ── */}
      <AnimatePresence>
        {selectedNotice && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setSelectedNotice(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '560px',
                padding: '32px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                border: '1.5px solid rgba(40,43,74,0.15)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{
                  background: getCategoryColor(selectedNotice.category).bg,
                  color: getCategoryColor(selectedNotice.category).text,
                  padding: '4px 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 800
                }}>
                  {selectedNotice.category}
                </span>
                <span style={{ fontSize: '12px', color: '#71717a' }}>
                  {new Date(selectedNotice.created_at).toLocaleString()}
                </span>
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#09090b', margin: '0 0 16px 0' }}>
                {selectedNotice.title}
              </h2>

              <div style={{
                background: '#f4f4f5',
                borderRadius: '16px',
                padding: '20px',
                fontSize: '14px',
                lineHeight: 1.6,
                color: '#27272a',
                marginBottom: '24px',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {selectedNotice.content}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setSelectedNotice(null)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '12px',
                    background: '#282B4A',
                    color: '#EEEBDA',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Close Circular
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default FacultyNotices;
