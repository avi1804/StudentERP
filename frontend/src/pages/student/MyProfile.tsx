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

  const [formData, setFormData] = useState({ contact_number: '', email: '', full_name: '', date_of_birth: '' });

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
          date_of_birth: res.data.date_of_birth || ''
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

  // ── Desktop (unchanged) ──
  if (loading) return <div className="page-center"><div style={{color:'var(--text3)'}}>Loading profile...</div></div>;

  return (
    <div style={{ padding: '0px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ background: 'rgba(183,142,254,0.1)', padding: '12px', borderRadius: '12px', marginRight: '16px' }}>
          <UserCircle size={28} color="var(--secondary)" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text)', margin: 0 }}>My Profile</h1>
          <div style={{ fontSize: '13px', color: 'var(--text3)' }}>Manage your personal and academic information</div>
        </div>
      </div>

      {msg.text && (
        <div style={{ marginBottom: '24px', padding: '12px', borderRadius: '8px', border: msg.type === 'error' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(34,197,94,0.2)', backgroundColor: msg.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: msg.type === 'error' ? 'var(--red)' : 'var(--green)' }}>
          {msg.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        
        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(183,142,254,0.05) 0%, rgba(0,0,0,0) 70%)', zIndex: 0 }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', marginBottom: '16px' }}>
              <span className="card-title" style={{ fontSize: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} color="var(--primary)" /> Academic Details
              </span>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <GraduationCap size={20} color="var(--secondary)" />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 600 }}>Enrollment Number</div>
                  <div style={{ color: '#fff', fontWeight: 500, fontSize: '15px' }}>{profile.enrollment_number}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Building2 size={20} color="var(--secondary)" />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 600 }}>Course & Department</div>
                  <div style={{ color: '#fff', fontWeight: 500, fontSize: '15px' }}>{profile.course === "Unknown" ? "Not Assigned" : profile.course}</div>
                  <div style={{ color: 'var(--text3)', fontSize: '12px' }}>{profile.department === "Unknown" ? "" : profile.department}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 600 }}>Batch</div>
                  <div style={{ color: '#fff', fontWeight: 500 }}>{profile.batch}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 600 }}>Semester</div>
                  <div style={{ color: '#fff', fontWeight: 500 }}>{profile.semester}</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', marginBottom: '16px' }}>
              <span className="card-title" style={{ fontSize: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCircle size={18} color="var(--primary)" /> Personal Information
              </span>
            </div>
            <div className="panel-body">
              
              <div className="premium-fg" style={{ marginBottom: '16px' }}>
                <label>Full Name</label>
                <input type="text" className="premium-input" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} placeholder="Full Name" />
              </div>
              
              <div className="premium-fg" style={{ marginBottom: '24px' }}>
                <label>Date of Birth</label>
                <input type="date" className="premium-input" value={formData.date_of_birth} onChange={e => setFormData({...formData, date_of_birth: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', flex: 1 }}></div>
                <div style={{ fontSize: '11px', color: 'var(--tertiary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Contact Info</div>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', flex: 1 }}></div>
              </div>
              
              <div className="premium-fg" style={{ marginBottom: '16px' }}>
                <label>Email Address</label>
                <input type="email" className="premium-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="student@example.com" />
              </div>
              
              <div className="premium-fg" style={{ marginBottom: '24px' }}>
                <label>Contact Number</label>
                <input type="text" className="premium-input" value={formData.contact_number} onChange={e => setFormData({...formData, contact_number: e.target.value})} placeholder="+91 XXXXX XXXXX" />
              </div>

              <button className="glass-btn" onClick={handleUpdate} disabled={updating} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Save size={16} /> {updating ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
