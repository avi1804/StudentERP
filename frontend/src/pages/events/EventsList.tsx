import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient as api } from '../../api/axios';
import { CalendarDays, MapPin, Clock, Tag, Search, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export interface CollegeEvent {
  id: number;
  title: string;
  description: string;
  category: string;
  start_date_time: string;
  end_date_time?: string;
  venue: string;
  department?: string;
  banner_image_url?: string;
  contact_name?: string;
  contact_info?: string;
  eligibility?: string;
  registration_link?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
}

export const EventsList: React.FC = () => {
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

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingEvents = filteredEvents.filter(e => new Date(e.start_date_time) >= new Date());
  const pastEvents = filteredEvents.filter(e => new Date(e.start_date_time) < new Date());

  const renderEventCard = (event: CollegeEvent) => {
    const isCancelled = event.status === 'CANCELLED';
    return (
      <motion.div
        whileHover={{ y: -4 }}
        key={event.id}
        onClick={() => navigate(`detail/${event.id}`)}
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          border: '1px solid rgba(0,0,0,0.06)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          opacity: isCancelled ? 0.6 : 1,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {isCancelled && (
          <div style={{ position: 'absolute', top: 16, right: 16, background: '#fee2e2', color: '#ef4444', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>
            CANCELLED
          </div>
        )}
        {event.banner_image_url && (
          <div style={{ height: '160px', borderRadius: '16px', overflow: 'hidden', marginBottom: '8px' }}>
            <img src={event.banner_image_url} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f4f4f5', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, color: '#52525b', marginBottom: '12px' }}>
            <Tag size={12} /> {event.category}
          </div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.3px', lineHeight: 1.3 }}>
            {event.title}
          </h3>
        </div>
        
        <div style={{ display: 'grid', gap: '8px', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#71717a', fontSize: '13px', fontWeight: 500 }}>
            <CalendarDays size={14} color="#6366f1" />
            {new Date(event.start_date_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#71717a', fontSize: '13px', fontWeight: 500 }}>
            <Clock size={14} color="#f59e0b" />
            {new Date(event.start_date_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#71717a', fontSize: '13px', fontWeight: 500 }}>
            <MapPin size={14} color="#10b981" />
            {event.venue}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="premium-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>Campus</span>
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              padding: '4px 18px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
            }}>
              Events
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
            Discover and participate in upcoming college activities
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                borderRadius: '16px',
                border: '1.5px solid rgba(0,0,0,0.06)',
                background: '#ffffff',
                fontSize: '14px',
                color: '#09090b',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', color: '#71717a' }}>Loading events...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {upcomingEvents.length > 0 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#09090b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} color="#6366f1" />
                Upcoming Events
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {upcomingEvents.map(renderEventCard)}
              </div>
            </div>
          )}

          {pastEvents.length > 0 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#09090b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}>
                <Clock size={20} color="#71717a" />
                Past Events
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {pastEvents.map(renderEventCard)}
              </div>
            </div>
          )}

          {filteredEvents.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#71717a', background: '#ffffff', borderRadius: '24px', border: '1px dashed #e4e4e7' }}>
              <CalendarDays size={48} color="#d4d4d8" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontSize: '16px', fontWeight: 600 }}>No events found</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>Check back later for new activities</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
