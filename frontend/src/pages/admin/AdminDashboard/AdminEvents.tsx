import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient as api } from '../../../api/axios';
import type { CollegeEvent } from '../../events/EventsList';
import { Plus, Edit2, Trash2, CalendarDays, MapPin, Tag, Search, Calendar } from 'lucide-react';

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
      case 'PUBLISHED': return { bg: '#dcfce7', color: '#16a34a' };
      case 'DRAFT': return { bg: '#fef3c7', color: '#d97706' };
      case 'CANCELLED': return { bg: '#fee2e2', color: '#ef4444' };
      default: return { bg: '#f4f4f5', color: '#52525b' };
    }
  };

  return (
    <div className="premium-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            College Events
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
            Manage campus activities and announcements
          </div>
        </div>
        <button 
          onClick={() => navigate('add')}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '16px',
            fontWeight: 700,
            fontSize: '14px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
          }}
        >
          <Plus size={18} />
          Create Event
        </button>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 42px',
                borderRadius: '12px',
                border: '1.5px solid rgba(0,0,0,0.06)',
                background: '#fafafa',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#71717a' }}>Loading events...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredEvents.map(event => (
              <div 
                key={event.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px',
                  background: '#fafafa',
                  borderRadius: '16px',
                  border: '1px solid #f4f4f5'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {event.banner_image_url ? (
                    <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden' }}>
                      <img src={event.banner_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Calendar size={24} color="#a1a1aa" />
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#09090b' }}>{event.title}</h3>
                      <div style={{ 
                        ...getStatusColor(event.status),
                        padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' 
                      }}>
                        {event.status}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#71717a', fontSize: '13px', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CalendarDays size={14} /> {new Date(event.start_date_time).toLocaleDateString()}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {event.venue}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Tag size={14} /> {event.category}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => navigate(`edit/${event.id}`)} style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ffffff', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#3f3f46' }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => deleteEvent(event.id)} style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fee2e2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            
            {filteredEvents.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#71717a' }}>No events found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
