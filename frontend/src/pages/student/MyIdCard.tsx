import React from "react";
import { 
  Badge, Calendar, Clock, Tag, Download, User, Droplets, Phone, Mail,
  BookOpen, Utensils, FlaskConical, Building, Ticket, CheckCircle2,
  AlertTriangle, Camera, Headset, FileText, ArrowUpRight
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import TextType from "../../components/TextType";

export function MyIdCard() {

  const validityData = [
    { name: 'Elapsed', value: 290, color: '#e5e7eb' },
    { name: 'Remaining', value: 75, color: '#573cfa' }
  ];

  const activities = [
    { date: "28 May 2024, 10:45 AM", location: "Central Library", locIcon: <BookOpen size={14}/>, locColor: "purple", purpose: "Entry", status: "Success" },
    { date: "27 May 2024, 01:20 PM", location: "Cafeteria", locIcon: <Utensils size={14}/>, locColor: "green", purpose: "Payment", status: "Success" },
    { date: "27 May 2024, 09:15 AM", location: "Computer Lab 3", locIcon: <FlaskConical size={14}/>, locColor: "purple", purpose: "Lab Access", status: "Success" },
    { date: "26 May 2024, 04:30 PM", location: "Workshop Hall", locIcon: <FileText size={14}/>, locColor: "purple", purpose: "Event Entry", status: "Success" }
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
                text={["ID Card", "Digital Pass", "Identity"]}
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
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Manage and view your student ID card</div>
        </div>

        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px', background: '#573cfa', color: 'white', borderRadius: '14px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(87, 60, 250, 0.3)' }}>
          <Download size={18} /> Download Digital Pass
        </button>
      </div>

      {/* ── Real-Time Top KPI Cards Row (AutoML Studio design matching Main Dashboard) ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}
      >
        {/* KPI 1 — ID Card Status */}
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
                <Badge size={18} color="#573cfa" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>ID Card Status</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '40px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              Active
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>Valid</span> · Till 30 Jun 2025
            </div>
          </div>
        </motion.div>

        {/* KPI 2 — Date of Issue */}
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
                <Calendar size={18} color="#22c55e" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Date of Issue</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#09090b', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '6px' }}>
              15 Aug 2024
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>2024-25</span> · Academic Year
            </div>
          </div>
        </motion.div>

        {/* KPI 3 — Total Downloads */}
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
                <Clock size={18} color="#f59e0b" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Total Downloads</span>
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
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>5 Downloads</span> · This Semester
            </div>
          </div>
        </motion.div>

        {/* KPI 4 — Card Type */}
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
                <Tag size={18} color="#3b82f6" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Card Type</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#09090b', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '6px' }}>
              Student ID
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#3b82f6', fontWeight: 600 }}>Regular</span> · Full Access
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Layout (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Your ID Card Section */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#573cfa', margin: 0 }}>Your ID Card</h3>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#573cfa', color: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                <Download size={16} /> Download ID Card
              </button>
            </div>

            {/* ID Card Visual */}
            <div style={{ display: 'flex', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: 'white' }}>
              {/* Left Purple Side */}
              <div style={{ width: '40%', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                {/* Wavy bottom effect */}
                <svg viewBox="0 0 1440 320" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', opacity: 0.2 }} preserveAspectRatio="none">
                  <path fill="#ffffff" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', zIndex: 1, width: '100%', justifyContent: 'center' }}>
                  <div style={{ width: '30px', height: '30px', background: 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Badge size={18} color="#573cfa" />
                  </div>
                  <div style={{ color: 'white' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Indus University</div>
                    <div style={{ fontSize: '9px', opacity: 0.9 }}>Ahmedabad, Gujarat</div>
                  </div>
                </div>

                <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.3)', overflow: 'hidden', marginBottom: '16px', zIndex: 1 }}>
                  {/* Placeholder for avatar, simulating with a gradient for now, normally an img tag */}
                  <div style={{ width: '100%', height: '100%', background: '#d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                    <User size={40} />
                  </div>
                </div>

                <div style={{ color: 'white', textAlign: 'center', zIndex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>Student User</div>
                  <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '12px' }}>B.Tech Computer Science</div>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '12px', fontSize: '10px', display: 'inline-block' }}>4th Year</div>
                </div>
              </div>

              {/* Right Details Side */}
              <div style={{ width: '60%', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ color: '#3b82f6', marginTop: '2px' }}><User size={16} /></div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Enrollment No.</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>IU/2021/CS/12345</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ color: '#3b82f6', marginTop: '2px' }}><Calendar size={16} /></div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Date of Birth</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>15 Jan 2003</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ color: '#573cfa', marginTop: '2px' }}><Droplets size={16} /></div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Blood Group</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>B+</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ color: '#573cfa', marginTop: '2px' }}><Phone size={16} /></div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Contact No.</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>+91 98765 43210</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', gridColumn: '1 / -1' }}>
                    <div style={{ color: '#573cfa', marginTop: '2px' }}><Mail size={16} /></div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Email</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>student.user@indusuni.ac.in</div>
                    </div>
                  </div>

                </div>

                {/* Barcode area */}
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Mock Barcode lines using borders */}
                  <div style={{ display: 'flex', height: '40px', gap: '2px', alignItems: 'center', marginBottom: '8px' }}>
                    {[...Array(30)].map((_, i) => (
                      <div key={i} style={{ width: [2,3,1,4,2][i%5] + 'px', height: '100%', background: '#111827' }}></div>
                    ))}
                  </div>
                  <div style={{ fontSize: '10px', color: '#111827', fontWeight: 600, letterSpacing: '2px' }}>IU/2021/CS/12345</div>
                </div>
              </div>
            </div>
          </div>

          {/* ID Card Usage */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>ID Card Usage</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={20} /></div>
                <div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>Library Access</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>12 <span style={{ fontSize: '10px', fontWeight: 'normal', color: '#6b7280' }}>Times</span></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Utensils size={20} /></div>
                <div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>Cafeteria Access</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>28 <span style={{ fontSize: '10px', fontWeight: 'normal', color: '#6b7280' }}>Times</span></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FlaskConical size={20} /></div>
                <div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>Lab Access</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>15 <span style={{ fontSize: '10px', fontWeight: 'normal', color: '#6b7280' }}>Times</span></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building size={20} /></div>
                <div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>Hostel Access</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>8 <span style={{ fontSize: '10px', fontWeight: 'normal', color: '#6b7280' }}>Times</span></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ticket size={20} /></div>
                <div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>Events Access</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>6 <span style={{ fontSize: '10px', fontWeight: 'normal', color: '#6b7280' }}>Times</span></div>
                </div>
              </div>

            </div>
          </div>

          {/* Recent ID Card Activity */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#573cfa', margin: 0 }}>Recent ID Card Activity</h3>
              <span style={{ fontSize: '12px', color: '#573cfa', fontWeight: 600, cursor: 'pointer' }}>View All</span>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <th style={{ padding: '0 0 12px 0', fontSize: '11px', fontWeight: 600, color: '#6b7280', textAlign: 'left' }}>Date & Time</th>
                  <th style={{ padding: '0 0 12px 0', fontSize: '11px', fontWeight: 600, color: '#6b7280', textAlign: 'left' }}>Location / Service</th>
                  <th style={{ padding: '0 0 12px 0', fontSize: '11px', fontWeight: 600, color: '#6b7280', textAlign: 'left' }}>Purpose</th>
                  <th style={{ padding: '0 0 12px 0', fontSize: '11px', fontWeight: 600, color: '#6b7280', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((act, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td style={{ padding: '16px 0', fontSize: '12px', color: '#4b5563', fontWeight: 500 }}>{act.date}</td>
                    <td style={{ padding: '16px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#111827' }}>
                        <span style={{ color: act.locColor === 'purple' ? '#8b5cf6' : '#10b981' }}>{act.locIcon}</span>
                        {act.location}
                      </div>
                    </td>
                    <td style={{ padding: '16px 0', fontSize: '12px', color: '#4b5563' }}>{act.purpose}</td>
                    <td style={{ padding: '16px 0' }}>
                      <span style={{ background: '#e8f5e9', color: '#10b981', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>{act.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* ID Card Actions */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>ID Card Actions</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              
              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Download size={24} />
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#374151', textAlign: 'center', lineHeight: 1.2 }}>Download ID Card</div>
              </div>

              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Badge size={24} />
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#374151', textAlign: 'center', lineHeight: 1.2 }}>Request New Card</div>
              </div>

              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={24} />
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#374151', textAlign: 'center', lineHeight: 1.2 }}>Report Lost Card</div>
              </div>

              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Camera size={24} />
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#374151', textAlign: 'center', lineHeight: 1.2 }}>Update Photo</div>
              </div>

              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={24} />
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#374151', textAlign: 'center', lineHeight: 1.2 }}>Card Guidelines</div>
              </div>

              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Headset size={24} />
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#374151', textAlign: 'center', lineHeight: 1.2 }}>Help & Support</div>
              </div>

            </div>
          </div>

          {/* ID Card Validity */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 24px 0' }}>ID Card Validity</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <div style={{ width: '120px', height: '120px', position: 'relative', flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={validityData} 
                      innerRadius={45} 
                      outerRadius={55} 
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={0} 
                      dataKey="value" 
                      stroke="none"
                    >
                      {validityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>75</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Days Left</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Valid From</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#10b981' }}>15 Aug 2024</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Valid Till</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#573cfa' }}>30 Jun 2025</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#e8f5e9', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, width: 'fit-content' }}>
                  <CheckCircle2 size={14} /> Your ID card is valid
                </div>
              </div>
            </div>
          </div>

          {/* Need Help? */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px', flex: 1, position: 'relative', overflow: 'hidden' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Need Help?</h3>
            
            {/* Illustrative element */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
               <div style={{ width: '160px', height: '140px', background: '#f3f0ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <Headset size={60} color="#573cfa" />
                  {/* Decorative dots */}
                  <div style={{ position: 'absolute', top: '20px', right: '10px', width: '8px', height: '8px', borderRadius: '50%', background: '#573cfa' }}></div>
                  <div style={{ position: 'absolute', bottom: '30px', left: '20px', width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }}></div>
               </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '6px' }}>Facing an issue with your ID card?</div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '20px' }}>Our support team is here to help you.</div>
              <button style={{ padding: '12px 24px', background: '#573cfa', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Headset size={16} /> Contact Support
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
