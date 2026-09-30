import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient as api } from '../../api/axios';
import type { CollegeEvent } from './EventsList';
import { CalendarDays, MapPin, Clock, Tag, ArrowLeft, Building2, ExternalLink, User, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../../hooks/useIsMobile';

export const EventDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<CollegeEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const { isMobile, isTablet } = useIsMobile();
  const isSmallScreen = isMobile || isTablet;

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

  // ── Mobile Responsive Layout (< 1024px) ──
  if (isSmallScreen) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '24px' }}>
        {/* Top Back bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              width: '36px', height: '36px', borderRadius: '10px', background: '#ffffff',
              border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}
          >
            <ArrowLeft size={18} color="#09090b" />
          </button>
          <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#09090b', margin: 0 }}>
            Event Details
          </h1>
        </div>

        {/* Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #f1f5f9',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          opacity: isCancelled ? 0.7 : 1,
        }}>
          {event.banner_image_url && (
            <div style={{ width: '100%', height: '180px', background: '#f8fafc' }}>
              <img src={event.banner_image_url} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#282B4A', background: 'rgba(40, 43, 74, 0.08)', padding: '4px 10px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Tag size={12} /> {event.category}
              </span>
              {isCancelled && (
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444', background: '#fee2e2', padding: '3px 8px', borderRadius: '6px' }}>
                  CANCELLED
                </span>
              )}
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#09090b', margin: '0 0 16px 0', lineHeight: 1.3 }}>
              {event.title}
            </h2>

            {/* Quick Meta Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#f8fafc', borderRadius: '12px' }}>
                <CalendarDays size={18} color="#282B4A" />
                <div>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>DATE</div>
                  <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: 700 }}>
                    {new Date(event.start_date_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#f8fafc', borderRadius: '12px' }}>
                <Clock size={18} color="#d97706" />
                <div>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>TIME</div>
                  <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: 700 }}>
                    {new Date(event.start_date_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    {event.end_date_time && ` - ${new Date(event.end_date_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#f8fafc', borderRadius: '12px' }}>
                <MapPin size={18} color="#15803d" />
                <div>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>VENUE</div>
                  <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: 700 }}>{event.venue}</div>
                </div>
              </div>

              {event.department && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#f8fafc', borderRadius: '12px' }}>
                  <Building2 size={18} color="#7e22ce" />
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>DEPARTMENT</div>
                    <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: 700 }}>{event.department}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#09090b', marginBottom: '6px' }}>About Event</div>
              <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {event.description}
              </div>
            </div>

            {/* Contact / Eligibility */}
            {(event.contact_name || event.contact_info) && (
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px', marginBottom: '14px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '8px' }}>Contact Person</div>
                {event.contact_name && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: 600, marginBottom: '4px' }}>
                    <User size={14} color="#64748b" /> {event.contact_name}
                  </div>
                )}
                {event.contact_info && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                    <Phone size={14} color="#64748b" /> {event.contact_info}
                  </div>
                )}
              </div>
            )}

            {event.eligibility && (
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px', marginBottom: '16px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>Eligibility</div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>{event.eligibility}</div>
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
                  padding: '13px',
                  background: '#282B4A',
                  color: '#EEEBDA',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                Register Now
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(40, 43, 74, 0.08)', color: '#282B4A', padding: '6px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>
            <Tag size={14} /> {event.category}
          </div>
          
          <h2 style={{ margin: '0 0 24px 0', fontSize: '36px', fontWeight: 800, color: '#09090b', letterSpacing: '-1px', lineHeight: 1.2 }}>
            {event.title}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#f8fafc', borderRadius: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(40, 43, 74, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarDays size={20} color="#282B4A" />
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
                    background: '#282B4A',
                    color: '#EEEBDA',
                    borderRadius: '16px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '15px',
                    border: '1px solid rgba(238, 235, 218, 0.2)',
                    boxShadow: '0 4px 14px rgba(40, 43, 74, 0.25)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#373a61')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#282B4A')}
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
