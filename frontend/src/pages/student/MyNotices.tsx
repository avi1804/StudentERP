import React, { useEffect, useState } from "react";
import { 
  Bell, Filter, Megaphone, Send, Pin, Calendar, 
  BookOpen, ClipboardList, Users, Library, FlaskConical, Bookmark,
  ChevronDown, MailCheck, Download, Settings, Volume2, ArrowUpRight, Search, Eye, X, AlertTriangle
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import TextType from "../../components/TextType";
import { apiClient as api } from "../../api/axios";

interface NoticeItem {
  id: number;
  title: string;
  content: string;
  category: string;
  is_active: boolean;
  author_id: number;
  author_name?: string;
  created_at: string;
}

export function MyNotices() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [readIds, setReadIds] = useState<number[]>([]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await api.get<NoticeItem[]>('/notices/');
      setNotices(res.data);
    } catch (err) {
      console.error("Failed to load notices", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const markAsRead = (id: number) => {
    if (!readIds.includes(id)) {
      setReadIds([...readIds, id]);
    }
  };

  const handleOpenNotice = (n: NoticeItem) => {
    setSelectedNotice(n);
    markAsRead(n.id);
  };

  const filteredNotices = notices.filter(n => {
    const matchesTab = activeTab === "ALL" || n.category.toUpperCase() === activeTab;
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalNotices = notices.length;
  const unreadCount = notices.filter(n => !readIds.includes(n.id)).length;
  const urgentCount = notices.filter(n => n.category === "URGENT" || n.category === "EXAM").length;

  const categoryCounts: Record<string, number> = {};
  notices.forEach(n => {
    const cat = n.category || "GENERAL";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryColors = ['#8b5cf6', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#ef4444'];
  const pieData = Object.keys(categoryCounts).length > 0
    ? Object.keys(categoryCounts).map((cat, i) => ({
        name: cat,
        value: categoryCounts[cat],
        color: categoryColors[i % categoryColors.length]
      }))
    : [{ name: 'GENERAL', value: 1, color: '#8b5cf6' }];

  const getCategoryBadgeStyle = (category: string) => {
    switch (category.toUpperCase()) {
      case "URGENT": return { bg: "#fef2f2", text: "#dc2626" };
      case "EXAM": return { bg: "#fffbeb", text: "#d97706" };
      case "FEE": return { bg: "#eff6ff", text: "#2563eb" };
      case "EVENT": return { bg: "#f0fdf4", text: "#16a34a" };
      case "HOLIDAY": return { bg: "#fdf2f8", text: "#db2777" };
      default: return { bg: "#f3f0ff", text: "#573cfa" };
    }
  };

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      
      {/* ── Header with Animated Highlighted Text Badge ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>My</span>
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              padding: '4px 18px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1.2,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <TextType
                text={["Notices", "Announcements", "Circulars"]}
                typingSpeed={60}
                deletingSpeed={35}
                pauseDuration={2200}
                loop={true}
                showCursor={true}
                cursorCharacter="|"
                style={{ color: '#ffffff' }}
              />
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Real-time announcements posted by college administration</div>
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '14px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none', background: 'white' }}
          />
        </div>
      </div>

      {/* ── Real-Time Top KPI Cards Row ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}
      >
        {/* KPI 1 — Total Notices */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '165px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(87,60,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(87,60,250,0.08)' }}>
                <Megaphone size={18} color="#573cfa" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Total Notices</span>
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <div style={{ fontSize: '42px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {totalNotices}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#573cfa', fontWeight: 600 }}>Live Feed</span> · Real-time Database
            </div>
          </div>
        </motion.div>

        {/* KPI 2 — Unread Notices */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '165px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.08)' }}>
                <Send size={18} color="#22c55e" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Unread Notices</span>
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <div style={{ fontSize: '42px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {unreadCount}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>{unreadCount} New</span> · Unread Updates
            </div>
          </div>
        </motion.div>

        {/* KPI 3 — Urgent & Exam */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '165px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,158,11,0.08)' }}>
                <Pin size={18} color="#f59e0b" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Urgent & Exam</span>
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <div style={{ fontSize: '42px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {urgentCount}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>High Priority</span> · Requires Attention
            </div>
          </div>
        </motion.div>

        {/* KPI 4 — Categories */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '165px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,0.08)' }}>
                <Calendar size={18} color="#3b82f6" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Active Categories</span>
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <div style={{ fontSize: '42px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {Object.keys(categoryCounts).length}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#3b82f6', fontWeight: 600 }}>Structured</span> · Categorized Notice Stream
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Layout (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '32px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* All Notices List */}
          <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f3f4f6', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>All Announcements</h3>
              
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['ALL', 'GENERAL', 'EXAM', 'FEE', 'EVENT', 'HOLIDAY', 'URGENT'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{ 
                      padding: '6px 12px', 
                      borderRadius: '8px', 
                      fontSize: '11px', 
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: activeTab === tab ? '#573cfa' : '#f4f4f5',
                      color: activeTab === tab ? '#ffffff' : '#6b7280',
                      transition: 'all 0.15s'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px', color: '#9ca3af' }}>Loading real-time notices from database...</div>
            ) : filteredNotices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px' }}>
                <Megaphone size={40} color="#d1d5db" style={{ marginBottom: '12px' }} />
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#374151' }}>No notices found</div>
                <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>When Admin posts an announcement, it will appear here instantly in real-time.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredNotices.map((notice) => {
                  const isUnread = !readIds.includes(notice.id);
                  const badgeStyle = getCategoryBadgeStyle(notice.category);

                  return (
                    <div
                      key={notice.id}
                      onClick={() => handleOpenNotice(notice)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        padding: '18px',
                        borderRadius: '16px',
                        background: isUnread ? '#fafafa' : '#ffffff',
                        border: isUnread ? '1.5px solid rgba(87,60,250,0.15)' : '1px solid #f3f4f6',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        boxShadow: isUnread ? '0 2px 10px rgba(87,60,250,0.03)' : 'none'
                      }}
                    >
                      {/* Unread indicator dot */}
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isUnread ? '#573cfa' : 'transparent', border: isUnread ? 'none' : '2px solid #e5e7eb', marginTop: '6px', marginRight: '14px', flexShrink: 0 }} />

                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: badgeStyle.bg, color: badgeStyle.text, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: '16px' }}>
                        <Megaphone size={20} />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: '#09090b' }}>{notice.title}</span>
                          <span style={{ background: badgeStyle.bg, color: badgeStyle.text, fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '8px' }}>
                            {notice.category}
                          </span>
                        </div>

                        <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '8px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {notice.content}
                        </div>

                        <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span>Posted by <strong style={{ color: '#374151' }}>{notice.author_name || 'Admin'}</strong></span>
                          <span>•</span>
                          <span>{new Date(notice.created_at).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      <button style={{ background: '#f3f4f6', border: 'none', color: '#374151', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '12px' }}>
                        <Eye size={13} /> View
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Category Breakdown & Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Category Breakdown */}
          <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>Notice Categories</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '110px', height: '110px', position: 'relative', flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={36} outerRadius={52} paddingAngle={2} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>{totalNotices}</div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>Total</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                {pieData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4b5563', fontWeight: 500 }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }}></div>
                      {d.name}
                    </div>
                    <div style={{ color: '#111827', fontWeight: 600 }}>{d.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Status Card */}
          <div style={{ background: 'linear-gradient(135deg, #573cfa 0%, #432bb3 100%)', borderRadius: '24px', padding: '24px', color: 'white' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} /> Real-Time Notice Broadcast
            </h3>
            <p style={{ fontSize: '12px', opacity: 0.85, margin: 0, lineHeight: 1.5 }}>
              All official notices published by institute administrators are synchronized directly from the database to your dashboard.
            </p>
          </div>

        </div>
      </div>

      {/* ── NOTICE DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedNotice && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '580px', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ background: getCategoryBadgeStyle(selectedNotice.category).bg, color: getCategoryBadgeStyle(selectedNotice.category).text, padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}>
                  {selectedNotice.category}
                </span>
                <button onClick={() => setSelectedNotice(null)} style={{ background: '#f4f4f5', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} color="#71717a" />
                </button>
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#09090b', margin: '0 0 12px 0', lineHeight: 1.3 }}>
                {selectedNotice.title}
              </h2>

              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>Issued by <strong style={{ color: '#111827' }}>{selectedNotice.author_name || 'Admin'}</strong></span>
                <span>•</span>
                <span>{new Date(selectedNotice.created_at).toLocaleString()}</span>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '18px', fontSize: '14px', color: '#1e293b', lineHeight: 1.6, border: '1px solid #e2e8f0', whiteSpace: 'pre-wrap' }}>
                {selectedNotice.content}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button onClick={() => setSelectedNotice(null)} style={{ padding: '10px 24px', background: '#573cfa', color: 'white', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
