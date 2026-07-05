import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../api/axios";
import { UserCircle, BookOpen, GraduationCap, Building2, Save } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export function MyProfile() {
  const { user } = useAuthStore();
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
    
    // Prepare payload, omit empty date_of_birth to prevent FastAPI validation errors
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
        
        {/* Read Only Academic Info */}
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

        {/* Editable Personal Info */}
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
