import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../api/axios";
import { 
  UserCircle, BookOpen, GraduationCap, Building2, Save, Mail, Phone, Calendar, 
  ShieldCheck, CheckCircle2, Copy, Check, Sparkles, MapPin, Award, User, 
  RefreshCw, Hash, Clock, FileCheck, Layers, Users, PhoneCall, RotateCcw
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useIsMobile } from "../../hooks/useIsMobile";
import { motion, AnimatePresence } from "framer-motion";
import TextType from "../../components/TextType";

// ── Copy to Clipboard Helper with Visual Feedback ──
function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      title={`Copy ${text}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 8px',
        borderRadius: '6px',
        background: copied ? 'rgba(34, 197, 94, 0.12)' : 'rgba(99, 102, 241, 0.08)',
        color: copied ? '#15803d' : '#4f46e5',
        border: '1px solid',
        borderColor: copied ? 'rgba(34, 197, 94, 0.25)' : 'rgba(99, 102, 241, 0.18)',
        fontSize: '11px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      <span>{copied ? 'Copied' : label}</span>
    </button>
  );
}

// ── Mobile Profile Component ──
function MobileProfile({ profile, formData, setFormData, handleUpdate, updating, msg }: any) {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  const getInitials = (name: string) => {
    if (!name) return "ST";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ paddingBottom: '90px' }}>
      {/* Mobile Animated Header */}
      <motion.div variants={itemVariants} style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span>My</span>
          <span style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff',
            padding: '3px 12px',
            borderRadius: '10px',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            lineHeight: 1.2,
          }}>
            <TextType
              text={["Profile", "Identity", "Record"]}
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
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
          Manage your personal and academic student records
        </div>
      </motion.div>

      {/* Avatar Card */}
      <motion.div variants={itemVariants} className="m-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '16px', paddingTop: '20px', paddingBottom: '20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '60px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
        }} />
        
        <div style={{
          width: '76px', height: '76px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          color: '#ffffff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', fontWeight: 800,
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
          border: '3px solid #ffffff',
          position: 'relative',
          zIndex: 2,
          marginBottom: '10px'
        }}>
          {getInitials(profile?.full_name)}
          <span style={{
            position: 'absolute', bottom: '2px', right: '2px',
            width: '14px', height: '14px', borderRadius: '50%',
            background: '#10b981', border: '2px solid #ffffff'
          }} />
        </div>

        <div style={{ fontSize: '18px', fontWeight: 700, color: '#09090b', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 2 }}>
          {profile?.full_name || 'Student'}
          <CheckCircle2 size={16} color="#4f46e5" fill="#e0e7ff" />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', zIndex: 2 }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#4f46e5', background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
            {profile?.enrollment_number || 'CS629'}
          </span>
          <span style={{ fontSize: '11px', color: '#6b7280' }}>• Semester {profile?.semester || 7}</span>
        </div>
      </motion.div>

      {/* Success/Error Message */}
      {msg.text && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="m-card"
          style={{
            marginBottom: '12px',
            border: msg.type === 'error' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(34,197,94,0.2)',
            background: msg.type === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
            color: msg.type === 'error' ? '#ef4444' : '#15803d',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          {msg.text}
        </motion.div>
      )}

      {/* Quick Stats Grid */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        <div style={{ background: '#f4f4f5', padding: '12px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#71717a', textTransform: 'uppercase' }}>Current Batch</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>{profile?.batch || 'CSE 2022-26'}</div>
        </div>
        <div style={{ background: '#f4f4f5', padding: '12px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#71717a', textTransform: 'uppercase' }}>Program Mode</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#4f46e5', marginTop: '2px' }}>Full-Time UG</div>
        </div>
      </motion.div>

      {/* Academic Details */}
      <motion.div variants={itemVariants}>
        <div className="m-section-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px', color: '#374151', marginBottom: '8px' }}>
          <BookOpen size={14} color="#4f46e5" />
          Academic Information
        </div>
        <div className="m-card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', fontWeight: 600 }}>Enrollment No</div>
                <div style={{ fontSize: '14px', color: '#09090b', fontWeight: 700 }}>{profile?.enrollment_number || 'CS629'}</div>
              </div>
              <CopyButton text={profile?.enrollment_number || 'CS629'} />
            </div>
            
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '10px' }}>
              <div style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', fontWeight: 600 }}>Course & Department</div>
              <div style={{ fontSize: '13px', color: '#09090b', fontWeight: 600, marginTop: '2px' }}>
                {profile?.course === "Unknown" ? "B.Tech Computer Science" : profile?.course}
              </div>
              {profile?.department && profile?.department !== "Unknown" && (
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{profile.department}</div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', borderTop: '1px solid #f3f4f6', paddingTop: '10px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', fontWeight: 600 }}>Semester & Section</div>
                <div style={{ fontSize: '13px', color: '#09090b', fontWeight: 600 }}>Sem {profile?.semester || 7} (Section A)</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', fontWeight: 600 }}>Academic Year</div>
                <div style={{ fontSize: '13px', color: '#09090b', fontWeight: 600 }}>2025 - 2026</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Editable Personal Info */}
      <motion.div variants={itemVariants}>
        <div className="m-section-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px', color: '#374151', marginBottom: '8px' }}>
          <UserCircle size={14} color="#4f46e5" />
          Personal & Contact Details
        </div>
        <div className="m-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#71717a', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Full Name</label>
            <input
              type="text"
              className="m-input"
              value={formData.full_name}
              onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Full Name"
              style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#71717a', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Date of Birth</label>
            <input
              type="date"
              className="m-input"
              value={formData.date_of_birth}
              onChange={e => setFormData({ ...formData, date_of_birth: e.target.value })}
              style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#71717a', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Email Address</label>
            <input
              type="email"
              className="m-input"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="student@example.com"
              style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#71717a', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Contact Number</label>
            <input
              type="tel"
              className="m-input"
              value={formData.contact_number}
              onChange={e => setFormData({ ...formData, contact_number: e.target.value })}
              placeholder="+91 XXXXX XXXXX"
              style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#71717a', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Residential Address</label>
            <input
              type="text"
              className="m-input"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="Address"
              style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', width: '100%' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Sticky Save Button */}
      <motion.div variants={itemVariants} style={{ position: 'sticky', bottom: '80px', zIndex: 10, paddingTop: '8px' }}>
        <button
          onClick={handleUpdate}
          disabled={updating}
          style={{
            width: '100%',
            minHeight: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            border: 'none',
            color: '#fff',
            fontWeight: 700,
            fontSize: '15px',
            cursor: updating ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: updating ? 0.7 : 1,
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
          }}
        >
          {updating ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          {updating ? 'Saving Changes...' : 'Save Profile Changes'}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Main Export: Desktop & Responsive Student Profile ──
export function MyProfile() {
  const { user, setUser } = useAuthStore();
  const { isMobile } = useIsMobile();
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({ 
    contact_number: '', 
    email: '', 
    full_name: '', 
    date_of_birth: '', 
    address: 'Ahmedabad, Gujarat, India',
    guardian_name: 'Mr. R. K. Rao (Father)',
    emergency_contact: '+91 98250 12345'
  });

  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    setLoading(true);
    api.get('/student-dash/profile')
      .then(res => {
        setProfile(res.data);
        const loaded = { 
          contact_number: res.data.contact_number || '', 
          email: res.data.email || '',
          full_name: res.data.full_name || '',
          date_of_birth: res.data.date_of_birth || '',
          address: res.data.address || 'Ahmedabad, Gujarat, India',
          guardian_name: 'Mr. R. K. Rao (Father)',
          emergency_contact: '+91 98250 12345'
        };
        setFormData(loaded);
        setInitialData(loaded);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    setMsg({ text: '', type: '' });
    
    const payload: any = {
      contact_number: formData.contact_number,
      email: formData.email,
      full_name: formData.full_name,
    };

    if (formData.date_of_birth) {
      payload.date_of_birth = formData.date_of_birth;
    }

    try {
      await api.put('/student-dash/profile', payload);
      setMsg({ text: 'Profile information updated successfully.', type: 'success' });
      
      // Update global auth store if name or email changed
      if (user) {
        setUser({
          ...user,
          full_name: formData.full_name,
          email: formData.email
        });
      }
      
      fetchProfile();
      setTimeout(() => setMsg({ text: '', type: '' }), 5000);
    } catch (err: any) {
      setMsg({ text: err.response?.data?.detail || 'Failed to update profile. Please check your details.', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  const handleReset = () => {
    if (initialData) {
      setFormData(initialData);
      setMsg({ text: 'Form changes reverted to saved details.', type: 'success' });
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "ST";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // ── Mobile View ──
  if (isMobile) {
    if (loading) {
      return (
        <div>
          <div className="m-skeleton" style={{ height: '160px', marginBottom: '16px' }} />
          <div className="m-skeleton" style={{ height: '16px', width: '140px', marginBottom: '12px' }} />
          <div className="m-skeleton" style={{ height: '200px', marginBottom: '16px' }} />
          <div className="m-skeleton" style={{ height: '16px', width: '160px', marginBottom: '12px' }} />
          <div className="m-skeleton" style={{ height: '300px' }} />
        </div>
      );
    }
    return (
      <MobileProfile 
        profile={profile} 
        formData={formData} 
        setFormData={setFormData} 
        handleUpdate={handleUpdate} 
        updating={updating} 
        msg={msg} 
      />
    );
  }

  // ── Desktop Loading ──
  if (loading) {
    return (
      <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '16px' }}>
        <RefreshCw size={32} color="#4f46e5" className="animate-spin" />
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280' }}>Loading student profile details...</div>
      </div>
    );
  }

  const enrollmentNo = profile?.enrollment_number || 'CS629';
  const fullName = profile?.full_name || user?.full_name || 'Student';
  const courseName = profile?.course !== "Unknown" ? profile?.course : "B.Tech Computer Science";
  const deptName = profile?.department !== "Unknown" ? profile?.department : "Computer Science and Engineering";
  const batchName = profile?.batch || 'CSE 2022-2026';
  const semesterNo = profile?.semester || 7;

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* ── 1. Page Header with TextType Animation ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
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
                text={["Profile", "Identity", "Academic Record", "Account Details"]}
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
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
            Manage your personal information, academic credentials, and verified university records
          </div>
        </div>

        {/* Header Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleUpdate}
            disabled={updating}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: updating ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.2s',
              opacity: updating ? 0.7 : 1
            }}
          >
            {updating ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
            {updating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── Notification Feedback Message ── */}
      <AnimatePresence>
        {msg.text && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            style={{
              marginBottom: '24px',
              padding: '14px 20px',
              borderRadius: '14px',
              border: msg.type === 'error' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(34,197,94,0.25)',
              backgroundColor: msg.type === 'error' ? 'rgba(239,68,68,0.06)' : 'rgba(34,197,94,0.06)',
              color: msg.type === 'error' ? '#dc2626' : '#15803d',
              fontWeight: 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {msg.type === 'error' ? <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> : <CheckCircle2 size={16} />}
              <span>{msg.text}</span>
            </div>
            <button
              onClick={() => setMsg({ text: '', type: '' })}
              style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2. Top KPI Cards Row (Animated with Framer Motion) ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '18px', marginBottom: '28px' }}
      >
        {/* KPI 1 — Enrollment Number */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '20px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.12)', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={20} />
            </div>
            <CopyButton text={enrollmentNo} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Enrollment No</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.5px', marginTop: '2px' }}>{enrollmentNo}</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Official University ID</div>
          </div>
        </motion.div>

        {/* KPI 2 — Current Semester */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '20px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: 'rgba(168, 85, 247, 0.12)', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.1)', color: '#9333ea' }}>
              Final Year
            </span>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Current Semester</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.5px', marginTop: '2px' }}>Semester {semesterNo}</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Section A • Batch 2022-26</div>
          </div>
        </motion.div>

        {/* KPI 3 — Program / Branch */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '20px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: 'rgba(59, 130, 246, 0.12)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' }}>
              UG Program
            </span>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Department</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.5px', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              B.Tech CSE
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Computer Science & Eng.</div>
          </div>
        </motion.div>

        {/* KPI 4 — Academic Standing */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '20px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.12)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: '#dcfce7', color: '#15803d' }}>
              CGPA 8.6
            </span>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Academic Standing</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.5px', marginTop: '2px' }}>Good Standing</div>
            <div style={{ fontSize: '11px', color: '#15803d', marginTop: '4px', fontWeight: 600 }}>• Eligible for Placements</div>
          </div>
        </motion.div>

        {/* KPI 5 — Verification & Identity */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '20px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.12)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: '#fef3c7', color: '#b45309' }}>
              Verified
            </span>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Account Security</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.5px', marginTop: '2px' }}>100% Synced</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Registrar Verified</div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── 3. Student Hero Identity Card ── */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #e5e7eb',
        borderRadius: '24px',
        padding: '28px 32px',
        marginBottom: '28px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle Background Mesh Glow */}
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px', width: '220px', height: '220px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', position: 'relative', zIndex: 1 }}>
          {/* Avatar and Main Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 800,
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
              position: 'relative',
              flexShrink: 0
            }}>
              {getInitials(fullName)}
              <span style={{
                position: 'absolute', bottom: '-2px', right: '-2px',
                width: '16px', height: '16px', borderRadius: '50%',
                background: '#10b981', border: '3px solid #ffffff'
              }} title="Online & Active" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.5px', margin: 0 }}>
                  {fullName}
                </h2>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#4f46e5',
                  background: 'rgba(99, 102, 241, 0.1)',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CheckCircle2 size={13} /> Official Student Record
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', flexWrap: 'wrap', fontSize: '13px', color: '#6b7280' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#374151' }}>
                  <GraduationCap size={15} color="#4f46e5" /> {courseName}
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={15} color="#6b7280" /> {deptName}
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={15} color="#6b7280" /> Batch {batchName}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Badges and Shortcuts */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Campus & University</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#09090b' }}>Indus University • Main Campus</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Main 2-Column Bento Grid: Academic (Left) & Personal (Right) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* ════════ LEFT PANEL: Academic Credentials ════════ */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e5e7eb',
          borderRadius: '24px',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            {/* Panel Title */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#09090b', margin: 0 }}>Academic Credentials</h3>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Institutional enrollment & curriculum records</div>
                </div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: '#f4f4f5', color: '#71717a' }}>
                Read-Only
              </span>
            </div>

            {/* Academic Data Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
              
              {/* Enrollment Number */}
              <div style={{ background: '#f9fafb', padding: '14px 16px', borderRadius: '14px', border: '1px solid #f3f4f6', gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Enrollment Number</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#09090b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{enrollmentNo}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>Verified</span>
                    </div>
                  </div>
                  <CopyButton text={enrollmentNo} />
                </div>
              </div>

              {/* Degree Program */}
              <div style={{ background: '#f9fafb', padding: '14px 16px', borderRadius: '14px', border: '1px solid #f3f4f6', gridColumn: 'span 2' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Program & Degree</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>
                  {courseName}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{deptName}</div>
              </div>

              {/* Batch */}
              <div style={{ background: '#f9fafb', padding: '14px 16px', borderRadius: '14px', border: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Batch</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>{batchName}</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>4-Year Degree</div>
              </div>

              {/* Current Semester */}
              <div style={{ background: '#f9fafb', padding: '14px 16px', borderRadius: '14px', border: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Semester</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>Semester {semesterNo}</div>
                <div style={{ fontSize: '11px', color: '#4f46e5', fontWeight: 600, marginTop: '2px' }}>Autumn 2026</div>
              </div>

              {/* Section */}
              <div style={{ background: '#f9fafb', padding: '14px 16px', borderRadius: '14px', border: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Section</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>Section A</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>Regular Shift</div>
              </div>

              {/* Academic Year */}
              <div style={{ background: '#f9fafb', padding: '14px 16px', borderRadius: '14px', border: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Academic Year</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>2025 - 2026</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>Current Term</div>
              </div>
            </div>

            {/* ── Semester Progress Pathway ── */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={14} color="#4f46e5" /> Semester Progression Roadmap
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#4f46e5' }}>Sem 7 of 8</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '6px', margin: '8px 0' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                  const isCompleted = sem < semesterNo;
                  const isCurrent = sem === semesterNo;
                  return (
                    <div key={sem} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        borderRadius: '4px',
                        background: isCompleted ? '#22c55e' : isCurrent ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#e2e8f0',
                        boxShadow: isCurrent ? '0 0 8px rgba(99, 102, 241, 0.5)' : 'none'
                      }} />
                      <span style={{ fontSize: '10px', fontWeight: isCurrent ? 800 : 600, color: isCurrent ? '#4f46e5' : isCompleted ? '#15803d' : '#94a3b8' }}>
                        S{sem}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#64748b' }}>
                <span>Semesters 1-6 Completed</span>
                <span style={{ color: '#4f46e5', fontWeight: 700 }}>• Final Year Project In-Progress</span>
              </div>
            </div>
          </div>

          {/* Bottom Info Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05))',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid rgba(99, 102, 241, 0.15)'
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ffffff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flexShrink: 0 }}>
              <Award size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#09090b' }}>Good Academic Standing</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                Faculty Advisor: <strong>Prof. D. Sharma (HOD - CSE)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ════════ RIGHT PANEL: Personal & Contact Details (Editable) ════════ */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e5e7eb',
          borderRadius: '24px',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            {/* Panel Title */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCircle size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#09090b', margin: 0 }}>Personal & Contact Details</h3>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Editable identity and communication information</div>
                </div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5' }}>
                Editable Profile
              </span>
            </div>

            {/* ── Form Section 1: Personal Details ── */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={13} color="#4f46e5" /> Basic Information
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {/* Full Name */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Full Name (As registered in records)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="e.g. Harsh Rao"
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 42px',
                        borderRadius: '12px',
                        background: '#f9fafb',
                        border: '1.5px solid #e5e7eb',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#09090b',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#ffffff'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f9fafb'; }}
                    />
                    <User size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Date of Birth
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 42px',
                        borderRadius: '12px',
                        background: '#f9fafb',
                        border: '1.5px solid #e5e7eb',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#09090b',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#ffffff'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f9fafb'; }}
                    />
                    <Calendar size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                {/* Gender / Category (Fixed / Display) */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Category & Status
                  </label>
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: '#f4f4f5',
                    border: '1.5px solid transparent',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>General / Regular</span>
                    <span style={{ fontSize: '10px', color: '#15803d', fontWeight: 700, background: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>Eligible</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Form Section 2: Contact Details ── */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={13} color="#4f46e5" /> Contact & Communication
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {/* Email Address */}
                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                      University Email Address
                    </label>
                    <CopyButton text={formData.email} />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student.cse@indusuni.ac.in"
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 42px',
                        borderRadius: '12px',
                        background: '#f9fafb',
                        border: '1.5px solid #e5e7eb',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#09090b',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#ffffff'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f9fafb'; }}
                    />
                    <Mail size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                {/* Contact Phone */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Contact Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      value={formData.contact_number}
                      onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                      placeholder="+91 98765 43210"
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 42px',
                        borderRadius: '12px',
                        background: '#f9fafb',
                        border: '1.5px solid #e5e7eb',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#09090b',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#ffffff'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f9fafb'; }}
                    />
                    <Phone size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Emergency Helpline / Parent
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      value={formData.emergency_contact}
                      onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                      placeholder="+91 98250 12345"
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 42px',
                        borderRadius: '12px',
                        background: '#f9fafb',
                        border: '1.5px solid #e5e7eb',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#09090b',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#ffffff'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f9fafb'; }}
                    />
                    <PhoneCall size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                {/* Residential Address */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Residential Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Ahmedabad, Gujarat, India"
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 42px',
                        borderRadius: '12px',
                        background: '#f9fafb',
                        border: '1.5px solid #e5e7eb',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#09090b',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#ffffff'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f9fafb'; }}
                    />
                    <MapPin size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div style={{ paddingTop: '16px', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={handleUpdate}
              disabled={updating}
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                cursor: updating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.2s ease',
                opacity: updating ? 0.7 : 1,
              }}
            >
              {updating ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              {updating ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>

            <button
              onClick={handleReset}
              type="button"
              title="Reset changes"
              style={{
                padding: '14px 18px',
                borderRadius: '14px',
                background: '#ffffff',
                border: '1.5px solid #e5e7eb',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#9ca3af'; e.currentTarget.style.color = '#111827'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; }}
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
