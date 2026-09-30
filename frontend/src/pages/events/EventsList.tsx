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

import { useIsMobile } from '../../hooks/useIsMobile';

export const EventsList: React.FC = () => {
  const [events, setEvents] = useState<CollegeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileTab, setMobileTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const navigate = useNavigate();
  const { isMobile, isTablet } = useIsMobile();
  const isSmallScreen = isMobile || isTablet;

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
            <CalendarDays size={14} color="#282B4A" />
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

  // ── Mobile Responsive Layout (< 1024px) ──
  if (isSmallScreen) {
    const displayedEvents = 
      mobileTab === 'upcoming' ? upcomingEvents :
      mobileTab === 'past' ? pastEvents :
      filteredEvents;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '20px' }}>
        {/* Title */}
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Campus</span>
            <span style={{
              background: '#282B4A',
              color: '#EEEBDA',
              padding: '2px 12px',
              borderRadius: '10px',
              fontSize: '18px',
            }}>
              Events
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Discover and participate in college activities
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search events or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 14px 11px 40px',
              borderRadius: '14px',
              border: '1.5px solid #e2e8f0',
              background: '#ffffff',
              fontSize: '14px',
              color: '#09090b',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Tab Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'upcoming', label: `Upcoming (${upcomingEvents.length})` },
            { id: 'past', label: `Past (${pastEvents.length})` },
            { id: 'all', label: `All (${filteredEvents.length})` },
          ].map(tab => {
            const active = mobileTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setMobileTab(tab.id as any)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: active ? 700 : 500,
                  border: active ? '1.5px solid #282B4A' : '1px solid #e2e8f0',
                  background: active ? '#282B4A' : '#ffffff',
                  color: active ? '#ffffff' : '#64748b',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Event Cards List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontSize: '14px' }}>Loading events...</div>
        ) : displayedEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', background: '#ffffff', borderRadius: '18px', border: '1px dashed #e2e8f0' }}>
            <CalendarDays size={40} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#334155' }}>No events found</div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Check back later for new college activities</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {displayedEvents.map(event => {
              const isCancelled = event.status === 'CANCELLED';
              return (
                <div
                  key={event.id}
                  onClick={() => navigate(`detail/${event.id}`)}
                  style={{
                    background: '#ffffff',
                    borderRadius: '18px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    opacity: isCancelled ? 0.6 : 1,
                  }}
                >
                  {event.banner_image_url && (
                    <div style={{ height: '130px', width: '100%', overflow: 'hidden' }}>
                      <img src={event.banner_image_url} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', background: '#f1f5f9', padding: '3px 10px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Tag size={11} /> {event.category}
                      </span>
                      {isCancelled && (
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', background: '#fee2e2', padding: '2px 8px', borderRadius: '6px' }}>
                          CANCELLED
                        </span>
                      )}
                    </div>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 700, color: '#09090b', lineHeight: 1.35 }}>
                      {event.title}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CalendarDays size={13} color="#282B4A" />
                        <span>{new Date(event.start_date_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={13} color="#f59e0b" />
                        <span>{new Date(event.start_date_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={13} color="#10b981" />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="premium-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>Campus</span>
            <span style={{
              background: '#282B4A',
              color: '#EEEBDA',
              padding: '4px 18px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(40, 43, 74, 0.25)',
              border: '1px solid rgba(238, 235, 218, 0.2)',
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
                <Calendar size={20} color="#282B4A" />
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
