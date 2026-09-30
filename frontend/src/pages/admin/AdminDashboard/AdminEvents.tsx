import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient as api } from '../../../api/axios';
import type { CollegeEvent } from '../../events/EventsList';
import { Plus, Edit2, Trash2, CalendarDays, MapPin, Tag, Search, Calendar } from 'lucide-react';
import TextType from '../../../components/TextType';
import { motion } from 'framer-motion';

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<CollegeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'events_updated') {
        fetchEvents();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events/');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(e => e.id !== id));
      localStorage.setItem('events_updated', Date.now().toString());
    } catch (err) {
      console.error(err);
      alert("Failed to delete event.");
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PUBLISHED': return { bg: 'rgba(5, 150, 105, 0.08)', color: '#059669', border: '1px solid rgba(5, 150, 105, 0.2)' };
      case 'DRAFT': return { bg: 'rgba(217, 119, 6, 0.08)', color: '#d97706', border: '1px solid rgba(217, 119, 6, 0.2)' };
      case 'CANCELLED': return { bg: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' };
      default: return { bg: 'rgba(40, 43, 74, 0.08)', color: '#282B4A', border: '1px solid rgba(40, 43, 74, 0.15)' };
    }
  };

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>College</span>
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
              <TextType
                text={["Events", "Workshops", "Seminars", "Fests"]}
                typingSpeed={60}
                deletingSpeed={35}
                pauseDuration={2200}
                loop={true}
                showCursor={true}
                cursorCharacter="|"
                style={{ color: '#EEEBDA' }}
              />
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
            Manage campus activities, workshops, hackathons, and announcements
          </div>
        </div>
        <button 
          onClick={() => navigate('add')}
          style={{
            background: '#282B4A',
            color: '#EEEBDA',
            padding: '12px 24px',
            borderRadius: '16px',
            fontWeight: 700,
            fontSize: '14px',
            border: '1px solid rgba(238, 235, 218, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(40, 43, 74, 0.25)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#373a61')}
          onMouseLeave={e => (e.currentTarget.style.background = '#282B4A')}
        >
          <Plus size={18} color="#EEEBDA" />
          Create Event
        </button>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '24px', border: '1.5px solid rgba(40, 43, 74, 0.08)', overflow: 'hidden', padding: '24px', boxShadow: '0 4px 24px rgba(40, 43, 74, 0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} color="#71717a" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search events by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 18px 12px 44px',
                borderRadius: '16px',
                border: '1.5px solid rgba(40, 43, 74, 0.12)',
                background: '#ffffff',
                fontSize: '14px',
                color: '#09090b',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#282B4A')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(40, 43, 74, 0.12)')}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>Loading campus events...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredEvents.map(event => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 24px',
                  background: '#ffffff',
                  borderRadius: '18px',
                  border: '1px solid rgba(40, 43, 74, 0.08)',
                  boxShadow: '0 2px 8px rgba(40, 43, 74, 0.02)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#282B4A'; e.currentTarget.style.background = '#fafafa'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(40, 43, 74, 0.08)'; e.currentTarget.style.background = '#ffffff'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {event.banner_image_url ? (
                    <div style={{ width: '84px', height: '84px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={event.banner_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '84px', height: '84px', borderRadius: '14px', background: 'rgba(40, 43, 74, 0.06)', border: '1px solid rgba(40, 43, 74, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Calendar size={28} color="#282B4A" />
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#09090b' }}>{event.title}</h3>
                      <div style={{ 
                        ...getStatusColor(event.status),
                        padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' 
                      }}>
                        {event.status}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748b', fontSize: '13px', fontWeight: 500, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CalendarDays size={14} color="#282B4A" /> {new Date(event.start_date_time).toLocaleDateString()}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} color="#282B4A" /> {event.venue}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Tag size={14} color="#282B4A" /> 
                        <span style={{ color: '#282B4A', fontWeight: 700 }}>{event.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button 
                    onClick={() => navigate(`edit/${event.id}`)} 
                    style={{ 
                      width: '38px', height: '38px', borderRadius: '12px', background: '#f8fafc', 
                      border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      cursor: 'pointer', color: '#282B4A', transition: 'all 0.15s ease' 
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(40, 43, 74, 0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#f8fafc')}
                  >
                    <Edit2 size={15} />
                  </button>
                  <button 
                    onClick={() => deleteEvent(event.id)} 
                    style={{ 
                      width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.08)', 
                      border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      cursor: 'pointer', color: '#ef4444', transition: 'all 0.15s ease' 
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.16)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)')}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
            
            {filteredEvents.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>No events found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
