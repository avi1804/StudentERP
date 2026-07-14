import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../api/axios";
import { UserCircle, BookOpen, GraduationCap, Building2, Save, Mail, Phone, Calendar } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useIsMobile } from "../../hooks/useIsMobile";
import { motion } from "framer-motion";

// ── Mobile Profile ──
function MobileProfile({ profile, formData, setFormData, handleUpdate, updating, msg }: any) {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Avatar Header */}
      <motion.div variants={itemVariants} className="m-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '16px', paddingTop: '24px', paddingBottom: '24px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(183, 142, 254, 0.3), rgba(87, 46, 153, 0.5))',
          border: '2px solid rgba(183, 142, 254, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(183, 142, 254, 0.2)',
          marginBottom: '12px'
        }}>
          <UserCircle size={40} color="#b78efe" />
        </div>
        <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>{profile.full_name || 'Student'}</div>
        <div style={{ fontSize: '12px', color: '#7a80a1', marginTop: '4px' }}>
          {profile.enrollment_number || '—'}
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
            color: msg.type === 'error' ? '#ef4444' : '#22c55e',
            fontSize: '13px'
          }}
        >
          {msg.text}
        </motion.div>
      )}

      {/* Academic Details */}
      <motion.div variants={itemVariants}>
        <div className="m-section-label">
          <BookOpen size={13} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Academic Details
        </div>
        <div className="m-card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '10px', color: '#7a80a1', textTransform: 'uppercase', fontWeight: 600, marginBottom: '3px' }}>Enrollment</div>
              <div style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>{profile.enrollment_number || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#7a80a1', textTransform: 'uppercase', fontWeight: 600, marginBottom: '3px' }}>Course & Department</div>
              <div style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>{profile.course === "Unknown" ? "Not Assigned" : profile.course}</div>
              {profile.department !== "Unknown" && <div style={{ fontSize: '12px', color: '#7a80a1' }}>{profile.department}</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '10px' }}>
                <div style={{ fontSize: '10px', color: '#7a80a1', textTransform: 'uppercase', fontWeight: 600, marginBottom: '3px' }}>Batch</div>
                <div style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>{profile.batch || '—'}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '10px' }}>
                <div style={{ fontSize: '10px', color: '#7a80a1', textTransform: 'uppercase', fontWeight: 600, marginBottom: '3px' }}>Semester</div>
                <div style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>{profile.semester || '—'}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Editable Personal Info */}
      <motion.div variants={itemVariants}>
        <div className="m-section-label">
          <UserCircle size={13} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Personal Information
        </div>
        <div className="m-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#7a80a1', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Full Name</label>
            <input
              type="text"
              className="m-input"
              value={formData.full_name}
              onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Full Name"
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#7a80a1', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Date of Birth</label>
            <input
              type="date"
              className="m-input"
              value={formData.date_of_birth}
              onChange={e => setFormData({ ...formData, date_of_birth: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#7a80a1', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Email Address</label>
            <input
              type="email"
              className="m-input"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="student@example.com"
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#7a80a1', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Contact Number</label>
            <input
              type="tel"
              className="m-input"
              value={formData.contact_number}
              onChange={e => setFormData({ ...formData, contact_number: e.target.value })}
              placeholder="+91 XXXXX XXXXX"
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
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(183, 142, 254, 0.3), rgba(87, 46, 153, 0.5))',
            border: '1px solid rgba(183, 142, 254, 0.3)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '15px',
            cursor: updating ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: updating ? 0.6 : 1,
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Save size={16} /> {updating ? 'Saving...' : 'Save Changes'}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Main Export ──
export function MyProfile() {
  const { user } = useAuthStore();
  const { isMobile } = useIsMobile();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({ contact_number: '', email: '', full_name: '', date_of_birth: '', address: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    setLoading(true);
    api.get('/student-dash/profile')
      .then(res => {
        setProfile(res.data);
        setFormData({ 
          contact_number: res.data.contact_number || '', 
          email: res.data.email || '',
          full_name: res.data.full_name || '',
          date_of_birth: res.data.date_of_birth || '',
          address: res.data.address || 'Ahmedabad, Gujarat, India' // default placeholder to match design
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    setMsg({ text: '', type: '' });
    
    const payload = { ...formData };
    if (!payload.date_of_birth) {
      delete (payload as any).date_of_birth;
    }

    try {
      await api.put('/student-dash/profile', payload);
      setMsg({ text: 'Profile updated successfully.', type: 'success' });
      fetchProfile();
    } catch (err: any) {
      setMsg({ text: err.response?.data?.detail || 'Failed to update profile', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  // ── Mobile ──
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
    return <MobileProfile profile={profile} formData={formData} setFormData={setFormData} handleUpdate={handleUpdate} updating={updating} msg={msg} />;
  }

  // ── Desktop ──
  if (loading) return <div className="page-center"><div style={{color:'var(--text3)'}}>Loading profile...</div></div>;

  const InputField = ({ label, icon: Icon, value, onChange, type = "text", readOnly = false, placeholder = "" }: any) => (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500, marginBottom: '6px', display: 'block' }}>{label}</label>
        {readOnly ? (
          <div style={{ background: '#f9fafb', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#111827', border: '1px solid transparent' }}>
            {value}
          </div>
        ) : (
          <input 
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={{ width: '100%', background: '#f9fafb', padding: '12px 16px', borderRadius: '10px', border: '1px solid transparent', fontSize: '14px', fontWeight: 600, color: '#111827', outline: 'none', transition: 'all 0.2s' }}
            onFocus={(e) => e.target.style.border = '1px solid #573cfa'}
            onBlur={(e) => e.target.style.border = '1px solid transparent'}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="premium-dashboard" style={{ padding: '0' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ background: '#f3f0ff', padding: '14px', borderRadius: '16px', marginRight: '20px' }}>
          <UserCircle size={28} color="#573cfa" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '4px' }}>My Profile</h1>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Manage your personal and academic information</div>
        </div>
      </div>

      {msg.text && (
        <div style={{ marginBottom: '24px', padding: '16px', borderRadius: '12px', border: msg.type === 'error' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(34,197,94,0.2)', backgroundColor: msg.type === 'error' ? 'rgba(239,68,68,0.05)' : 'rgba(34,197,94,0.05)', color: msg.type === 'error' ? '#ef4444' : '#10b981', fontWeight: 500, fontSize: '14px' }}>
          {msg.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Left Panel: Academic Details */}
        <div className="dash-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
             <BookOpen size={20} color="#573cfa" strokeWidth={2.5} />
             <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#573cfa', margin: 0 }}>Academic Details</h2>
          </div>

          <InputField label="Enrollment Number" icon={GraduationCap} value={profile.enrollment_number || 'C5629'} readOnly={true} />
          <InputField label="Course & Department" icon={Building2} value={profile.course !== "Unknown" ? `${profile.course} ${profile.department !== "Unknown" ? profile.department : ''}` : 'B.Tech Computer Science Engineering'} readOnly={true} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
             <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={18} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Batch</label>
                  <div style={{ background: '#f9fafb', padding: '10px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#111827' }}>{profile.batch || 'CSE - 2022'}</div>
                </div>
             </div>
             <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BookOpen size={18} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Semester</label>
                  <div style={{ background: '#f9fafb', padding: '10px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#111827' }}>{profile.semester || '7'}</div>
                </div>
             </div>
          </div>

          <InputField label="Section" icon={UserCircle} value={'A'} readOnly={true} />
          <InputField label="Academic Year" icon={Calendar} value={'2025 - 2026'} readOnly={true} />

          {/* Bottom Banner */}
          <div style={{ background: '#f8f7ff', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
             <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
               <span style={{ fontSize: '20px' }}>🏅</span>
             </div>
             <div style={{ flex: 1 }}>
               <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#573cfa', margin: 0, marginBottom: '4px' }}>Keep up the great work!</h4>
               <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>You're doing excellent this semester.</p>
             </div>
             <div style={{ fontSize: '40px', opacity: 0.1 }}>🏆</div>
          </div>
        </div>

        {/* Right Panel: Personal Information */}
        <div className="dash-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
             <UserCircle size={20} color="#573cfa" strokeWidth={2.5} />
             <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#573cfa', margin: 0 }}>Personal Information</h2>
          </div>

          <InputField label="Full Name" icon={UserCircle} value={formData.full_name} onChange={(e: any) => setFormData({...formData, full_name: e.target.value})} />
          <InputField label="Date of Birth" icon={Calendar} value={formData.date_of_birth} onChange={(e: any) => setFormData({...formData, date_of_birth: e.target.value})} type="date" />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '32px 0' }}>
             <div style={{ height: '1px', background: '#f3f4f6', flex: 1 }}></div>
             <div style={{ fontSize: '11px', color: '#573cfa', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>CONTACT INFO</div>
             <div style={{ height: '1px', background: '#f3f4f6', flex: 1 }}></div>
          </div>

          <InputField label="Email Address" icon={Mail} value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} type="email" />
          <InputField label="Contact Number" icon={Phone} value={formData.contact_number} onChange={(e: any) => setFormData({...formData, contact_number: e.target.value})} />
          
          {/* Using building icon for address as map pin is not imported */}
          <InputField label="Address" icon={Building2} value={formData.address} onChange={(e: any) => setFormData({...formData, address: e.target.value})} />

          <div style={{ flex: 1 }}></div>
          
          <button onClick={handleUpdate} disabled={updating} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: '#573cfa', color: '#fff', fontSize: '15px', fontWeight: 600, border: 'none', cursor: updating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '32px', transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(87,60,250,0.3)' }} onMouseOver={e => e.currentTarget.style.background='#462dd1'} onMouseOut={e => e.currentTarget.style.background='#573cfa'}>
            <Save size={18} /> {updating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
