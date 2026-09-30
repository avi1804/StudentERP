import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient as api } from '../../../api/axios';
import { ArrowLeft, Save, Calendar as CalIcon } from 'lucide-react';

export const EventForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Seminar',
    start_date_time: '',
    end_date_time: '',
    venue: '',
    department: '',
    banner_image_url: '',
    contact_name: '',
    contact_info: '',
    eligibility: '',
    registration_link: '',
    status: 'DRAFT'
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/events/${id}`)
        .then(res => {
          const e = res.data;
          setFormData({
            title: e.title || '',
            description: e.description || '',
            category: e.category || 'Seminar',
            start_date_time: e.start_date_time ? e.start_date_time.slice(0, 16) : '',
            end_date_time: e.end_date_time ? e.end_date_time.slice(0, 16) : '',
            venue: e.venue || '',
            department: e.department || '',
            banner_image_url: e.banner_image_url || '',
            contact_name: e.contact_name || '',
            contact_info: e.contact_info || '',
            eligibility: e.eligibility || '',
            registration_link: e.registration_link || '',
            status: e.status || 'DRAFT'
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent, statusOverride?: string) => {
    e.preventDefault();
    setSaving(true);
    
    const submitData = { ...formData };
    if (statusOverride) submitData.status = statusOverride;
    
    if (!submitData.end_date_time) delete (submitData as any).end_date_time;
    if (!submitData.department) delete (submitData as any).department;
    if (!submitData.banner_image_url) delete (submitData as any).banner_image_url;
    if (!submitData.contact_name) delete (submitData as any).contact_name;
    if (!submitData.contact_info) delete (submitData as any).contact_info;
    if (!submitData.eligibility) delete (submitData as any).eligibility;
    if (!submitData.registration_link) delete (submitData as any).registration_link;

    try {
      if (isEdit) {
        await api.put(`/events/${id}`, submitData);
      } else {
        await api.post('/events/', submitData);
      }
      // Trigger real-time update for other tabs
      localStorage.setItem('events_updated', Date.now().toString());
      navigate('/admin/dashboard/events');
    } catch (err) {
      console.error(err);
      alert("Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(0,0,0,0.1)',
    background: '#fafafa',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
    marginTop: '6px'
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 700,
    color: '#3f3f46'
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="premium-dashboard">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={() => navigate('/admin/dashboard/events')}
          style={{
            width: '40px', height: '40px', borderRadius: '12px', background: '#ffffff',
            border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={20} color="#09090b" />
        </button>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#09090b', margin: 0, letterSpacing: '-0.8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>{isEdit ? 'Edit' : 'Create New'}</span>
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
              Event
            </span>
          </h1>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid rgba(0,0,0,0.06)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Event Title *</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} style={inputStyle} placeholder="e.g. Annual Tech Fest 2026" />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Description *</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder="Full event details..." />
          </div>

          <div>
            <label style={labelStyle}>Category *</label>
            <select required name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
              <option value="Seminar">Seminar</option>
              <option value="Workshop">Workshop</option>
              <option value="Fest">Fest</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Guest Lecture">Guest Lecture</option>
              <option value="Sports">Sports</option>
              <option value="Cultural">Cultural</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Venue *</label>
            <input required type="text" name="venue" value={formData.venue} onChange={handleChange} style={inputStyle} placeholder="e.g. Main Auditorium" />
          </div>

          <div>
            <label style={labelStyle}>Start Date & Time *</label>
            <input required type="datetime-local" name="start_date_time" value={formData.start_date_time} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>End Date & Time (Optional)</label>
            <input type="datetime-local" name="end_date_time" value={formData.end_date_time} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Organizing Department (Optional)</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} style={inputStyle} placeholder="e.g. Computer Science" />
          </div>

          <div>
            <label style={labelStyle}>Banner Image URL (Optional)</label>
            <input type="url" name="banner_image_url" value={formData.banner_image_url} onChange={handleChange} style={inputStyle} placeholder="https://example.com/image.png" />
          </div>

          <div>
            <label style={labelStyle}>Contact Person Name (Optional)</label>
            <input type="text" name="contact_name" value={formData.contact_name} onChange={handleChange} style={inputStyle} placeholder="e.g. Prof. Smith" />
          </div>

          <div>
            <label style={labelStyle}>Contact Info (Optional)</label>
            <input type="text" name="contact_info" value={formData.contact_info} onChange={handleChange} style={inputStyle} placeholder="Phone or Email" />
          </div>

          <div>
            <label style={labelStyle}>Eligibility (Optional)</label>
            <input type="text" name="eligibility" value={formData.eligibility} onChange={handleChange} style={inputStyle} placeholder="e.g. 7th Semester CSE Only" />
          </div>

          <div>
            <label style={labelStyle}>Registration Link (Optional)</label>
            <input type="url" name="registration_link" value={formData.registration_link} onChange={handleChange} style={inputStyle} placeholder="Google Form URL, etc." />
          </div>
          
          {isEdit && (
            <div>
              <label style={labelStyle}>Event Status</label>
              <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
                <option value="DRAFT">Draft (Hidden)</option>
                <option value="PUBLISHED">Published (Visible)</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '1px solid #f4f4f5' }}>
          <button 
            type="button" 
            onClick={() => navigate('/admin/dashboard/events')}
            style={{ padding: '12px 24px', borderRadius: '12px', background: '#f4f4f5', color: '#52525b', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            Cancel
          </button>
          
          {!isEdit && (
            <button 
              type="button" 
              onClick={(e) => handleSubmit(e, 'DRAFT')}
              disabled={saving}
              style={{ padding: '12px 24px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              Save as Draft
            </button>
          )}

          <button 
            type="submit" 
            disabled={saving}
            onClick={(e) => { if (!isEdit) handleSubmit(e, 'PUBLISHED') }}
            style={{
              padding: '12px 28px',
              borderRadius: '14px',
              border: '1px solid rgba(238, 235, 218, 0.2)',
              background: '#282B4A',
              color: '#EEEBDA',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(40, 43, 74, 0.25)',
              transition: 'all 0.2s ease',
              opacity: saving ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#373a61'; }}
            onMouseLeave={e => { if (!saving) e.currentTarget.style.background = '#282B4A'; }}
          >
            <Save size={18} color="#EEEBDA" />
            {isEdit ? 'Save Changes' : 'Publish Event'}
          </button>
        </div>
      </form>
    </div>
  );
};
