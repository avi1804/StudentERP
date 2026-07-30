import React, { useState } from "react";
import { 
  Bell, Filter, Megaphone, Send, Pin, Calendar, 
  BookOpen, ClipboardList, Users, Library, FlaskConical, Bookmark,
  ChevronDown, MailCheck, Download, Settings, Volume2, ArrowUpRight
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import TextType from "../../components/TextType";

export function MyNotices() {

  const [activeTab, setActiveTab] = useState("All");

  const categories = [
    { name: 'Academic', value: 8, color: '#8b5cf6', pct: '33%' },
    { name: 'Examination', value: 5, color: '#f59e0b', pct: '21%' },
    { name: 'Event', value: 6, color: '#10b981', pct: '25%' },
    { name: 'General', value: 3, color: '#3b82f6', pct: '13%' },
    { name: 'Other', value: 2, color: '#ec4899', pct: '8%' }
  ];

  const noticesList = [
    { 
      unread: true, 
      icon: <Megaphone size={20} />, iconBg: '#f3f0ff', iconColor: '#8b5cf6',
      title: 'Mid Semester Examination Schedule Released', isImportant: true,
      desc: 'The mid semester examination schedule for all departments has been published.',
      author: 'Admin', date: '26 May 2024',
      category: 'Examination', catStyle: { bg: '#f3f0ff', text: '#8b5cf6' },
      time: 'Today, 10:30 AM'
    },
    { 
      unread: true, 
      icon: <BookOpen size={20} />, iconBg: '#e8f5e9', iconColor: '#10b981',
      title: 'Guest Lecture on AI & Machine Learning', isImportant: false,
      desc: 'Expert talk by Dr. Priya Sharma on "Future of AI in Tech Industry".',
      author: 'Department of CSE', date: '25 May 2024',
      category: 'Event', catStyle: { bg: '#e8f5e9', text: '#10b981' },
      time: 'Yesterday, 03:15 PM'
    },
    { 
      unread: false, 
      icon: <ClipboardList size={20} />, iconBg: '#fffbeb', iconColor: '#f59e0b',
      title: 'Project Submission Deadline Extended', isImportant: false,
      desc: 'The final year project submission deadline has been extended to 5th June 2024.',
      author: 'Admin', date: '24 May 2024',
      category: 'Academic', catStyle: { bg: '#fffbeb', text: '#f59e0b' },
      time: '24 May, 11:45 AM'
    },
    { 
      unread: false, 
      icon: <Users size={20} />, iconBg: '#fdf2f8', iconColor: '#ec4899',
      title: 'Sports Meet 2024 - Registrations Open', isImportant: false,
      desc: 'Registrations for Annual Sports Meet are now open. Last date to register: 2nd June.',
      author: 'Sports Committee', date: '23 May 2024',
      category: 'Event', catStyle: { bg: '#fdf2f8', text: '#ec4899' },
      time: '23 May, 09:20 AM'
    },
    { 
      unread: false, 
      icon: <Library size={20} />, iconBg: '#eff6ff', iconColor: '#3b82f6',
      title: 'Library Book Issue Policy Updated', isImportant: false,
      desc: 'New library book issue policy is effective from 1st June 2024.',
      author: 'Library', date: '22 May 2024',
      category: 'General', catStyle: { bg: '#eff6ff', text: '#3b82f6' },
      time: '22 May, 04:10 PM'
    },
    { 
      unread: false, 
      icon: <FlaskConical size={20} />, iconBg: '#f3f0ff', iconColor: '#8b5cf6',
      title: 'Lab Maintenance - Computer Lab 2', isImportant: false,
      desc: 'Computer Lab 2 will remain closed on 28th May due to system maintenance.',
      author: 'IT Support', date: '21 May 2024',
      category: 'Other', catStyle: { bg: '#f3f0ff', text: '#8b5cf6' },
      time: '21 May, 02:30 PM'
    }
  ];

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      
      {/* ── Header with Animated Highlighted Text Badge (Matching Main Dashboard & Attendance) ── */}
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
                text={["Notices", "Circulars", "Announcements"]}
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
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Stay updated with important announcements and notifications</div>
        </div>

        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px', background: '#573cfa', color: 'white', borderRadius: '14px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(87, 60, 250, 0.3)' }}>
          <Filter size={18} /> Filter & Sort
        </button>
      </div>

      {/* ── Real-Time Top KPI Cards Row (AutoML Studio design matching Main Dashboard) ── */}
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
            minHeight: '185px',
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
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              24
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#573cfa', fontWeight: 600 }}>100%</span> · Issued This Semester
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
            minHeight: '185px',
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
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              7
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>7 New</span> · Unread Updates
            </div>
          </div>
        </motion.div>

        {/* KPI 3 — Important Notices */}
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
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,158,11,0.08)' }}>
                <Pin size={18} color="#f59e0b" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Important Notices</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              5
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>Pinned</span> · High Priority
            </div>
          </div>
        </motion.div>

        {/* KPI 4 — This Week */}
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
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,0.08)' }}>
                <Calendar size={18} color="#3b82f6" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>This Week</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              8
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#3b82f6', fontWeight: 600 }}>+33%</span> · New Notices
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Layout (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* All Notices List */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: 0 }}>All Notices</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['All', 'General', 'Academic', 'Examination', 'Event', 'Other'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{ 
                      padding: '8px 16px', 
                      borderRadius: '8px', 
                      fontSize: '12px', 
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      background: activeTab === tab ? '#f3f0ff' : 'transparent',
                      color: activeTab === tab ? '#573cfa' : '#6b7280',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                  >
                    {tab === 'All' && <Bell size={14} />} {tab}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {noticesList.map((notice, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', padding: '16px 0', borderBottom: i === noticesList.length - 1 ? 'none' : '1px solid #f9fafb', position: 'relative' }}>
                  
                  {/* Read/Unread dot */}
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: notice.unread ? '#573cfa' : 'transparent', border: notice.unread ? 'none' : '2px solid #e5e7eb', marginTop: '16px', marginRight: '16px', flexShrink: 0 }}></div>
                  
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: notice.iconBg, color: notice.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: '16px' }}>
                    {notice.icon}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>{notice.title}</div>
                      {notice.isImportant && (
                        <span style={{ background: '#fffbeb', color: '#f59e0b', fontSize: '10px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px' }}>Important</span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '8px', lineHeight: 1.5 }}>
                      {notice.desc}
                    </div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>
                      By {notice.author} &bull; {notice.date}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', minHeight: '64px', marginLeft: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ background: notice.catStyle.bg, color: notice.catStyle.text, fontSize: '10px', fontWeight: 600, padding: '4px 10px', borderRadius: '12px' }}>
                        {notice.category}
                      </span>
                      <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500 }}>
                        {notice.time}
                      </div>
                      <Bookmark size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button style={{ width: '100%', background: '#f8fafc', border: 'none', color: '#573cfa', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, marginTop: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Load More Notices <ChevronDown size={16} />
            </button>
          </div>

          {/* Banner Promo */}
          <div style={{ background: '#f3f0ff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 1 }}>
              <div style={{ width: '64px', height: '64px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#573cfa', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <Bell size={28} />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Never miss an important update!</div>
                <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '16px' }}>Enable notifications to get real-time alerts for new notices.</div>
                <button style={{ padding: '10px 20px', background: '#573cfa', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={16} /> Enable Notifications
                </button>
              </div>
            </div>
            {/* Illustration mock using icons */}
            <div style={{ zIndex: 1, paddingRight: '20px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100px', height: '100px' }}>
                 <div style={{ position: 'absolute', top: '-10px', left: '-20px', color: '#8b5cf6', transform: 'rotate(-20deg)' }}><Volume2 size={32} /></div>
                 <div style={{ position: 'absolute', top: '10px', right: '-10px', color: '#3b82f6', transform: 'rotate(15deg)' }}><Send size={24} /></div>
                 <div style={{ position: 'absolute', bottom: '0px', right: '30px', color: '#ec4899', transform: 'rotate(-10deg)' }}><MailCheck size={28} /></div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Notice Categories */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 24px 0' }}>Notice Categories</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ width: '130px', height: '130px', position: 'relative', flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categories} innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="value" stroke="none">
                      {categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>24</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Total</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {categories.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563', fontWeight: 500 }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }}></div>
                      {d.name}
                    </div>
                    <div style={{ color: '#111827', fontWeight: 600 }}>{d.value} <span style={{ color: '#9ca3af', fontWeight: 'normal', marginLeft: '4px' }}>({d.pct})</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pinned Notices */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Pinned Notices</h3>
              <span style={{ fontSize: '12px', color: '#573cfa', fontWeight: 600, cursor: 'pointer' }}>View all</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                <div style={{ color: '#573cfa', marginTop: '2px' }}><Pin size={16} fill="#573cfa" /></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Academic Calendar 2024-25</div>
                  <div style={{ fontSize: '11px', color: '#4b5563', marginBottom: '8px' }}>Important academic dates and deadlines.</div>
                  <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 500 }}>Pinned on 10 May 2024</div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                <div style={{ color: '#573cfa', marginTop: '2px' }}><Pin size={16} fill="#573cfa" /></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Semester Fee Payment Notice</div>
                  <div style={{ fontSize: '11px', color: '#4b5563', marginBottom: '8px' }}>Last date for semester fee payment.</div>
                  <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 500 }}>Pinned on 08 May 2024</div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                <div style={{ color: '#573cfa', marginTop: '2px' }}><Pin size={16} fill="#573cfa" /></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>College Annual Fest - Technovate 2K24</div>
                  <div style={{ fontSize: '11px', color: '#4b5563', marginBottom: '8px' }}>Join us for the grand fest on 15th June!</div>
                  <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 500 }}>Pinned on 05 May 2024</div>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>Quick Actions</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              
              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MailCheck size={24} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', textAlign: 'center' }}>Mark All as Read</div>
              </div>

              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Download size={24} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', textAlign: 'center' }}>Download Notices</div>
              </div>

              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={24} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', textAlign: 'center' }}>Subscribe to Updates</div>
              </div>

              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Settings size={24} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', textAlign: 'center' }}>Notice Preferences</div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
