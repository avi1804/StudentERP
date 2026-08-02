import React, { useEffect, useState, useMemo } from 'react';
import { 
  UserCircle, GraduationCap, Building2, Library, CheckCircle2, 
  Search, ChevronRight, Filter, BookOpen, XCircle, Clock, Plus, X, Check,
  Send, Inbox, Calendar, RefreshCw, UserCheck
} from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { substituteService, type MySubstituteAssignment } from '../../services/substituteService';
import { resolveTeacherIdByName, TimetableAttendanceService, type LectureInstance } from '../../services/timetableAttendanceService';

export const AssignSubstitute: React.FC = () => {
  const { isMobile } = useIsMobile();
  const { user } = useAuthStore();
  const myFacultyId = resolveTeacherIdByName(user?.full_name || '') || 102;

  // Requests state
  const [incomingReqs, setIncomingReqs] = useState<MySubstituteAssignment[]>([]);
  const [outgoingReqs, setOutgoingReqs] = useState<MySubstituteAssignment[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

  // Tabs & Search & Filters
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal & Form State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableLectures, setAvailableLectures] = useState<LectureInstance[]>([]);
  const [formData, setFormData] = useState({
    lecture_instance_id: '',
    substitute_faculty_id: 101,
  });

  const demoFaculty = [
    { id: 101, name: 'Parth Nirmal', subject: 'Software Group Project' },
    { id: 102, name: 'Babita Patel', subject: 'Machine Learning' },
    { id: 103, name: 'Ashwin Patni', subject: 'NLP' },
    { id: 104, name: 'Vrushali', subject: 'Cloud Computing' },
    { id: 105, name: 'Dipali Jeetya', subject: 'Flat' },
  ].filter(f => f.id !== myFacultyId);

  const fetchRequests = async () => {
    try {
      const incoming = await substituteService.getIncomingRequests();
      setIncomingReqs(incoming || []);
      const outgoing = await substituteService.getOutgoingRequests();
      setOutgoingReqs(outgoing || []);
      
      // Auto select first item if available
      if (activeTab === 'incoming' && incoming && incoming.length > 0) {
        setSelectedRequestId(incoming[0].id);
      } else if (activeTab === 'outgoing' && outgoing && outgoing.length > 0) {
        setSelectedRequestId(outgoing[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const lectures = TimetableAttendanceService.getLectureInstancesForDateByTeacher(selectedDate, myFacultyId);
    setAvailableLectures(lectures);
    if (lectures.length > 0) {
      setFormData(prev => ({ ...prev, lecture_instance_id: lectures[0].id }));
    } else {
      setFormData(prev => ({ ...prev, lecture_instance_id: '' }));
    }
  }, [selectedDate, myFacultyId]);

  // Tab switch resets selected request ID
  useEffect(() => {
    const list = activeTab === 'incoming' ? incomingReqs : outgoingReqs;
    if (list.length > 0) {
      setSelectedRequestId(list[0].id);
    } else {
      setSelectedRequestId(null);
    }
  }, [activeTab, incomingReqs, outgoingReqs]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lecture_instance_id) {
      setMessage({ text: 'Please select a lecture.', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      // Resolve the selected substitute faculty name to send to backend
      const selectedFaculty = demoFaculty.find(f => f.id === formData.substitute_faculty_id);
      await substituteService.assignSubstitute({
        lecture_instance_id: formData.lecture_instance_id,
        original_faculty_id: myFacultyId,
        substitute_faculty_id: formData.substitute_faculty_id,
        substitute_faculty_name: selectedFaculty?.name || '',
        start_date: selectedDate,
        end_date: selectedDate,
      });
      setMessage({ text: 'Substitute request sent successfully!', type: 'success' });
      fetchRequests();
      setTimeout(() => {
        setShowAssignModal(false);
        setMessage({ text: '', type: '' });
      }, 1500);
    } catch (error: any) {
      setMessage({ text: error.response?.data?.detail || 'Failed to send substitute request', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id: number, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await substituteService.respondRequest(id, status);
      fetchRequests();
    } catch (error) {
      console.error("Failed to respond to request", error);
    }
  };

  // Filtered requests based on search and status
  const currentList = activeTab === 'incoming' ? incomingReqs : outgoingReqs;
  const filteredRequests = useMemo(() => {
    return currentList.filter(req => {
      const name = (req.original_faculty_name || '').toLowerCase();
      const lectureId = (req.lecture_instance_id || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      
      const matchesSearch = !query || name.includes(query) || lectureId.includes(query);
      const matchesStatus = filterStatus === 'All' || req.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [currentList, searchQuery, filterStatus]);

  const selectedRequestObj = currentList.find(r => r.id === selectedRequestId);

  // Overall Stats
  const totalPending = incomingReqs.filter(r => r.status === 'PENDING').length;
  const totalAccepted = outgoingReqs.filter(r => r.status === 'ACCEPTED').length;
  const totalRejected = outgoingReqs.filter(r => r.status === 'REJECTED').length;

  return (
    <div style={{ padding: '0px', fontFamily: 'Space Grotesk, sans-serif' }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>Substitute</span>
            <span style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              color: '#ffffff',
              padding: '4px 18px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1.2,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              Assignment
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
            Request substitute faculty for your lectures or manage incoming substitute requests.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => {
              setMessage({ text: '', type: '' });
              setShowAssignModal(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              color: '#ffffff',
              padding: '12px 22px',
              borderRadius: '16px',
              border: 'none',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <Plus size={18} />
            <span>Request Substitute</span>
          </button>
        </div>
      </div>

      {message.text && (
        <div style={{
          marginBottom: '24px', padding: '14px 20px', borderRadius: '12px',
          backgroundColor: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
          color: message.type === 'error' ? '#ef4444' : '#22c55e',
          border: message.type === 'error' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(34,197,94,0.2)',
          fontWeight: 600, fontSize: '13px'
        }}>
          {message.text}
        </div>
      )}

      {/* ── Toolbar & Filters ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="#a1a1aa" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by faculty name or lecture..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                borderRadius: '16px',
                border: '1.5px solid rgba(0,0,0,0.08)',
                background: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            />
          </div>
        </div>

        {/* Tab Toggle & Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Tab buttons */}
          <div style={{ display: 'flex', background: '#f4f4f5', borderRadius: '16px', padding: '4px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <button
              onClick={() => setActiveTab('incoming')}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'incoming' ? '#ffffff' : 'transparent',
                color: activeTab === 'incoming' ? '#6d28d9' : '#71717a',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: activeTab === 'incoming' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Inbox size={15} />
              <span>Incoming ({incomingReqs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('outgoing')}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'outgoing' ? '#ffffff' : 'transparent',
                color: activeTab === 'outgoing' ? '#6d28d9' : '#71717a',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: activeTab === 'outgoing' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={15} />
              <span>Outgoing ({outgoingReqs.length})</span>
            </button>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '6px 12px' }}>
            <Filter size={16} color="#71717a" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '13px', fontWeight: 600, color: '#3f3f46', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

        </div>
      </div>

      {/* ── Two Column Layout (Same as Attendance Report) ── */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px' }}>
        
        {/* Left Column: Requests List */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1.5px solid rgba(0,0,0,0.07)', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#09090b', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCircle size={18} color="#8b5cf6" />
              {activeTab === 'incoming' ? 'Incoming Requests' : 'Outgoing Requests'} ({filteredRequests.length})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
              {filteredRequests.length === 0 ? (
                <div style={{ color: '#71717a', textAlign: 'center', padding: '32px', fontSize: '13px' }}>
                  No substitute requests found.
                </div>
              ) : filteredRequests.map(r => (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  key={r.id}
                  onClick={() => setSelectedRequestId(r.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: selectedRequestId === r.id ? 'rgba(139, 92, 246, 0.08)' : '#f8fafc',
                    border: selectedRequestId === r.id ? '1.5px solid #8b5cf6' : '1px solid rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eedeff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserCircle size={20} color="#6d28d9" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#09090b', fontSize: '14px', marginBottom: '2px' }}>
                      {r.original_faculty_name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
                      {r.start_date} • <span style={{
                        color: r.status === 'ACCEPTED' ? '#16a34a' : r.status === 'PENDING' ? '#d97706' : '#dc2626',
                        fontWeight: 700
                      }}>{r.status}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} color={selectedRequestId === r.id ? '#8b5cf6' : '#d4d4d8'} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Request View */}
        <div style={{ flex: '2', display: 'flex', flexDirection: 'column' }}>
          {!selectedRequestId || !selectedRequestObj ? (
             <div style={{ background: '#ffffff', borderRadius: '24px', border: '1.5px solid rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', minHeight: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <UserCheck size={36} color="#a1a1aa" />
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#09090b' }}>No Request Selected</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#71717a', textAlign: 'center', maxWidth: '300px' }}>
                  Select a request from the list on the left to view details or perform actions.
                </p>
             </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: '#ffffff', borderRadius: '24px', border: '1.5px solid rgba(0,0,0,0.07)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
            >
              {/* Report/Request Header */}
              <div style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', padding: '32px', borderBottom: '1px solid rgba(139, 92, 246, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(139, 92, 246, 0.15)' }}>
                      <UserCircle size={40} color="#8b5cf6" />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#09090b', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
                        {selectedRequestObj.original_faculty_name}
                      </h2>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: '#52525b', fontSize: '13px', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={16} color="#8b5cf6" /> {selectedRequestObj.start_date}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <BookOpen size={16} color="#8b5cf6" /> {selectedRequestObj.lecture_instance_id}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', background: '#ffffff', padding: '16px 20px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Request Status</div>
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: 800, 
                      color: selectedRequestObj.status === 'ACCEPTED' ? '#22c55e' : selectedRequestObj.status === 'PENDING' ? '#f59e0b' : '#ef4444', 
                      lineHeight: 1.2 
                    }}>
                      {selectedRequestObj.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Body Content */}
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#09090b', margin: '0 0 24px 0' }}>Request Overview</h3>

                {/* Overall Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 600, marginBottom: '8px' }}>Total Pending</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#09090b' }}>{totalPending}</div>
                  </div>
                  <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '16px', border: '1px solid rgba(34,197,94,0.1)' }}>
                    <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={16} color="#22c55e"/> Accepted</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#15803d' }}>{totalAccepted}</div>
                  </div>
                  <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '16px', border: '1px solid rgba(239,68,68,0.1)' }}>
                    <div style={{ fontSize: '12px', color: '#991b1b', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><XCircle size={16} color="#ef4444"/> Declined</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#b91c1c' }}>{totalRejected}</div>
                  </div>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#09090b', margin: '0 0 16px 0' }}>Lecture Slot Details</h3>

                <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid rgba(0,0,0,0.04)', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#09090b' }}>
                      {selectedRequestObj.lecture_instance_id}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#6d28d9', background: '#eedeff', padding: '4px 12px', borderRadius: '8px' }}>
                      {selectedRequestObj.start_date}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#71717a', fontWeight: 500 }}>
                    Faculty <strong>{selectedRequestObj.original_faculty_name}</strong> has requested substitute coverage for this lecture.
                  </div>
                </div>

                {/* Accept / Decline Action Buttons for Incoming Pending Requests */}
                {activeTab === 'incoming' && selectedRequestObj.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                      onClick={() => handleRespond(selectedRequestObj.id, 'REJECTED')}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '16px',
                        border: '1.5px solid rgba(239,68,68,0.3)',
                        background: '#ffffff',
                        color: '#ef4444',
                        fontWeight: 700,
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <XCircle size={18} />
                      Decline Request
                    </button>
                    <button
                      onClick={() => handleRespond(selectedRequestObj.id, 'ACCEPTED')}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '16px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <CheckCircle2 size={18} />
                      Accept Request
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Request Substitute Modal ── */}
      <AnimatePresence>
        {showAssignModal && (
          <div style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(9, 9, 11, 0.5)',
            backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: '#ffffff', borderRadius: '24px', maxWidth: '480px',
                width: '100%', overflow: 'hidden', border: '1.5px solid rgba(0,0,0,0.08)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
              }}
            >
              {/* Header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#09090b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserCheck size={20} color="#8b5cf6" />
                  Request Substitute
                </h3>
                <button
                  onClick={() => setShowAssignModal(false)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', borderRadius: '50%', color: '#71717a' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: '24px' }}>
                {message.text && (
                  <div style={{
                    marginBottom: '16px', padding: '12px 16px', borderRadius: '12px',
                    backgroundColor: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                    color: message.type === 'error' ? '#ef4444' : '#22c55e',
                    fontSize: '13px', fontWeight: 600
                  }}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      style={{
                        width: '100%', padding: '12px', borderRadius: '14px',
                        border: '1.5px solid rgba(0,0,0,0.08)', background: '#f8fafc',
                        fontSize: '14px', outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#3f3f46', marginBottom: '6px' }}>
                      Select Scheduled Lecture
                    </label>
                    {availableLectures.length === 0 ? (
                      <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '14px', color: '#92400e', fontSize: '13px', fontWeight: 600 }}>
                        No lectures scheduled on this date.
                      </div>
                    ) : (
                      <select
                        value={formData.lecture_instance_id}
                        onChange={e => setFormData({ ...formData, lecture_instance_id: e.target.value })}
                        style={{
                          width: '100%', padding: '12px', borderRadius: '14px',
                          border: '1.5px solid rgba(0,0,0,0.08)', background: '#f8fafc',
                          fontSize: '14px', outline: 'none', cursor: 'pointer'
                        }}
                      >
                        {availableLectures.map(l => (
                          <option key={l.id} value={l.id}>
                            {l.startTime} - {l.endTime} | {l.subjectName} ({l.room})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#3f3f46', marginBottom: '6px' }}>
                      Assign Substitute Faculty
                    </label>
                    <select
                      value={formData.substitute_faculty_id}
                      onChange={e => setFormData({ ...formData, substitute_faculty_id: Number(e.target.value) })}
                      style={{
                        width: '100%', padding: '12px', borderRadius: '14px',
                        border: '1.5px solid rgba(0,0,0,0.08)', background: '#f8fafc',
                        fontSize: '14px', outline: 'none', cursor: 'pointer'
                      }}
                    >
                      {demoFaculty.map(f => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.subject})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || availableLectures.length === 0}
                    style={{
                      marginTop: '12px', padding: '14px', borderRadius: '16px',
                      border: 'none', background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                      color: '#ffffff', fontWeight: 700, fontSize: '14px',
                      cursor: 'pointer', boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
                      opacity: (loading || availableLectures.length === 0) ? 0.6 : 1
                    }}
                  >
                    {loading ? 'Sending Request...' : 'Send Substitute Request'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
