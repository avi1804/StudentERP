import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient as api } from '../../api/axios';
import type { CollegeEvent } from './EventsList';
import { CalendarDays, MapPin, Clock, Tag, ArrowLeft, Building2, ExternalLink, User, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export const EventDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<CollegeEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#71717a' }}>Loading event details...</div>;
  }

  if (!event) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#ef4444' }}>Event not found.</div>;
  }

  const isCancelled = event.status === 'CANCELLED';

  return (
    <div className="premium-dashboard">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            width: '40px', height: '40px', borderRadius: '12px', background: '#ffffff',
            border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <ArrowLeft size={20} color="#09090b" />
        </button>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#09090b', margin: 0, letterSpacing: '-0.5px' }}>
            Event Details
          </h1>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#ffffff',
          borderRadius: '32px',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.06)',
          position: 'relative',
          opacity: isCancelled ? 0.7 : 1,
        }}
      >
        {isCancelled && (
          <div style={{ position: 'absolute', top: 24, right: 24, background: '#fee2e2', color: '#ef4444', padding: '6px 16px', borderRadius: '16px', fontSize: '13px', fontWeight: 800, letterSpacing: '0.5px', zIndex: 10 }}>
            CANCELLED
          </div>
        )}

        {event.banner_image_url && (
          <div style={{ width: '100%', height: '320px', background: '#f4f4f5' }}>
            <img src={event.banner_image_url} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ padding: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#e0e7ff', color: '#4f46e5', padding: '6px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>
            <Tag size={14} /> {event.category}
          </div>
          
          <h2 style={{ margin: '0 0 24px 0', fontSize: '36px', fontWeight: 800, color: '#09090b', letterSpacing: '-1px', lineHeight: 1.2 }}>
            {event.title}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#f8fafc', borderRadius: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarDays size={20} color="#4f46e5" />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Date</div>
                <div style={{ fontSize: '15px', color: '#0f172a', fontWeight: 700 }}>
                  {new Date(event.start_date_time).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#f8fafc', borderRadius: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} color="#d97706" />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Time</div>
                <div style={{ fontSize: '15px', color: '#0f172a', fontWeight: 700 }}>
                  {new Date(event.start_date_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  {event.end_date_time && ` - ${new Date(event.end_date_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#f8fafc', borderRadius: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={20} color="#15803d" />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Venue</div>
                <div style={{ fontSize: '15px', color: '#0f172a', fontWeight: 700 }}>{event.venue}</div>
              </div>
            </div>

            {event.department && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#f8fafc', borderRadius: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={20} color="#7e22ce" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Organizing Dept</div>
                  <div style={{ fontSize: '15px', color: '#0f172a', fontWeight: 700 }}>{event.department}</div>
                </div>
              </div>
            )}
          </div>

          <div style={{ background: '#f4f4f5', height: '1px', width: '100%', marginBottom: '32px' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#09090b', marginBottom: '16px' }}>About Event</h3>
              <div style={{ fontSize: '15px', color: '#52525b', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {event.description}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {(event.contact_name || event.contact_info) && (
                <div style={{ padding: '24px', background: '#fafafa', borderRadius: '20px', border: '1px solid #f4f4f5' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#09090b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Contact Person</h4>
                  {event.contact_name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <User size={16} color="#71717a" />
                      <span style={{ fontSize: '14px', color: '#3f3f46', fontWeight: 600 }}>{event.contact_name}</span>
                    </div>
                  )}
                  {event.contact_info && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Phone size={16} color="#71717a" />
                      <span style={{ fontSize: '14px', color: '#3f3f46', fontWeight: 500 }}>{event.contact_info}</span>
                    </div>
                  )}
                </div>
              )}

              {event.eligibility && (
                <div style={{ padding: '24px', background: '#fafafa', borderRadius: '20px', border: '1px solid #f4f4f5' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#09090b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Eligibility</h4>
                  <div style={{ fontSize: '14px', color: '#3f3f46', fontWeight: 500, lineHeight: 1.5 }}>
                    {event.eligibility}
                  </div>
                </div>
              )}

              {event.registration_link && !isCancelled && (
                <a 
                  href={event.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '16px',
                    background: '#09090b',
                    color: '#ffffff',
                    borderRadius: '16px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '15px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  Register Now
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
