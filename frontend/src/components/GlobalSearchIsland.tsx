import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, X, CornerDownLeft, ArrowRight, BookOpen, Calendar, 
  Users, User, FileText, Megaphone, Wallet, Briefcase, Building2, 
  CheckCircle, Plus, Layers, IdCard, ClipboardList, Shield, GraduationCap,
  Clock, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient as api } from '../api/axios';

export interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Students' | 'Faculty' | 'Subjects' | 'Events' | 'Notices' | 'Fees' | 'Placement';
  path: string;
  icon: any;
}

interface GlobalSearchIslandProps {
  role: 'student' | 'admin' | 'faculty' | 'placement';
  onClose: () => void;
  placeholder?: string;
}

export const GlobalSearchIsland: React.FC<GlobalSearchIslandProps> = ({ role, onClose, placeholder }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [remoteResults, setRemoteResults] = useState<SearchItem[]>([]);
  const [isSearchingRemote, setIsSearchingRemote] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Pre-configured role-based static navigation catalog
  const roleCatalog = useMemo<SearchItem[]>(() => {
    switch (role) {
      case 'student':
        return [
          { id: 'st-dash', title: 'Dashboard', subtitle: 'Overview & daily summary', category: 'Navigation', path: '/dashboard', icon: Layers },
          { id: 'st-att', title: 'Attendance', subtitle: 'View subject-wise attendance', category: 'Navigation', path: '/dashboard/attendance', icon: CheckCircle },
          { id: 'st-sub', title: 'Academic Subjects', subtitle: 'Syllabus, faculty & modules', category: 'Navigation', path: '/dashboard/subjects', icon: BookOpen },
          { id: 'st-tt', title: 'Timetable', subtitle: 'Weekly lecture schedule', category: 'Navigation', path: '/dashboard/timetable', icon: Calendar },
          { id: 'st-res', title: 'Exams & Marks', subtitle: 'Grade sheets & results', category: 'Navigation', path: '/dashboard/results', icon: FileText },
          { id: 'st-asg', title: 'Assignments', subtitle: 'Class tasks & submissions', category: 'Navigation', path: '/dashboard/assignments', icon: ClipboardList },
          { id: 'st-fee', title: 'Fee Management', subtitle: 'Invoices, dues & payments', category: 'Navigation', path: '/dashboard/fees', icon: Wallet },
          { id: 'st-plc', title: 'Placement Cell', subtitle: 'Job drives, internships & alerts', category: 'Navigation', path: '/dashboard/placement', icon: Briefcase },
          { id: 'st-evt', title: 'Campus Events', subtitle: 'Workshops, hackathons & fests', category: 'Navigation', path: '/dashboard/events', icon: Calendar },
          { id: 'st-not', title: 'Notices', subtitle: 'Official college bulletins', category: 'Navigation', path: '/dashboard/notices', icon: Megaphone },
          { id: 'st-cmp', title: 'Complaints', subtitle: 'Register & track grievances', category: 'Navigation', path: '/dashboard/complaints', icon: Megaphone },
          { id: 'st-idc', title: 'Digital ID Card', subtitle: 'Student identity badge', category: 'Navigation', path: '/dashboard/idcard', icon: IdCard },
          { id: 'st-prf', title: 'My Profile', subtitle: 'Personal & academic info', category: 'Navigation', path: '/dashboard/profile', icon: User },
        ];

      case 'admin':
        return [
          { id: 'ad-dash', title: 'Admin Overview', subtitle: 'System-wide metrics & telemetry', category: 'Navigation', path: '/admin/dashboard', icon: Layers },
          { id: 'ad-dept', title: 'Departments', subtitle: 'Manage academic departments', category: 'Navigation', path: '/admin/dashboard/department/manage', icon: Building2 },
          { id: 'ad-fac', title: 'Faculty Registry', subtitle: 'Manage professors & HODs', category: 'Navigation', path: '/admin/dashboard/faculty/manage', icon: Users },
          { id: 'ad-fac-add', title: 'Add Faculty', subtitle: 'Enroll new faculty member', category: 'Navigation', path: '/admin/dashboard/faculty/add', icon: Plus },
          { id: 'ad-stu', title: 'Students Directory', subtitle: 'Manage all enrolled students', category: 'Navigation', path: '/admin/dashboard/students/manage', icon: GraduationCap },
          { id: 'ad-stu-add', title: 'Add Student', subtitle: 'Enroll new student account', category: 'Navigation', path: '/admin/dashboard/students/add', icon: Plus },
          { id: 'ad-sub', title: 'Subjects & Courses', subtitle: 'Configure curriculum courses', category: 'Navigation', path: '/admin/dashboard/subject/manage', icon: BookOpen },
          { id: 'ad-sub-add', title: 'Add Subject', subtitle: 'Create new academic subject', category: 'Navigation', path: '/admin/dashboard/subject/add', icon: Plus },
          { id: 'ad-not-fac', title: 'Notice Board', subtitle: 'View & manage campus notices', category: 'Navigation', path: '/admin/dashboard/notify/faculty', icon: Megaphone },
          { id: 'ad-not-stu', title: 'Post Notice', subtitle: 'Broadcast announcement to students', category: 'Navigation', path: '/admin/dashboard/notify/student', icon: Plus },
          { id: 'ad-evt', title: 'College Events', subtitle: 'Manage college activities & fests', category: 'Navigation', path: '/admin/dashboard/events', icon: Calendar },
          { id: 'ad-evt-add', title: 'Create Event', subtitle: 'Publish new campus event', category: 'Navigation', path: '/admin/dashboard/events/add', icon: Plus },
          { id: 'ad-fee-dash', title: 'Fee Dashboard', subtitle: 'Collections & pending ledger', category: 'Navigation', path: '/admin/dashboard/fees', icon: Wallet },
          { id: 'ad-fee-rep', title: 'Finance Reports', subtitle: 'Revenue audit & analytics', category: 'Navigation', path: '/admin/dashboard/fees/reports', icon: FileText },
          { id: 'ad-fee-str', title: 'Fee Structures', subtitle: '8-Semester fee packages', category: 'Navigation', path: '/admin/dashboard/fees/structures', icon: Layers },
          { id: 'ad-fee-stu', title: 'Assign Student Fees', subtitle: 'Bill allocation & tracking', category: 'Navigation', path: '/admin/dashboard/fees/students', icon: Wallet },
          { id: 'ad-fee-pmt', title: 'Payment Audit', subtitle: 'Verify student transactions', category: 'Navigation', path: '/admin/dashboard/fees/payments', icon: Shield },
          { id: 'ad-cmp', title: 'Student Complaints', subtitle: 'Review & resolve grievances', category: 'Navigation', path: '/admin/dashboard/complaints', icon: Megaphone },
          { id: 'ad-prf', title: 'Admin Profile', subtitle: 'Admin credentials & settings', category: 'Navigation', path: '/admin/dashboard/AdminProfile', icon: User },
        ];

      case 'faculty':
        return [
          { id: 'fa-dash', title: 'Faculty Dashboard', subtitle: 'Teaching schedule & summary', category: 'Navigation', path: '/faculty/dashboard', icon: Layers },
          { id: 'fa-att', title: 'Mark Attendance', subtitle: 'Live lecture roll-call', category: 'Navigation', path: '/faculty/dashboard/attendance', icon: CheckCircle },
          { id: 'fa-att-h', title: 'Attendance History', subtitle: 'Past lectures & attendance logs', category: 'Navigation', path: '/faculty/dashboard/attendance-history', icon: Clock },
          { id: 'fa-mrk', title: 'Internal Marks', subtitle: 'Grade exams & class tests', category: 'Navigation', path: '/faculty/dashboard/marks', icon: FileText },
          { id: 'fa-sub', title: 'My Subjects', subtitle: 'Assigned courses & syllabus', category: 'Navigation', path: '/faculty/dashboard/subjects', icon: BookOpen },
          { id: 'fa-tt', title: 'Faculty Timetable', subtitle: 'Weekly teaching timetable', category: 'Navigation', path: '/faculty/dashboard/timetable', icon: Calendar },
          { id: 'fa-asg', title: 'Assignments', subtitle: 'Review student homework', category: 'Navigation', path: '/faculty/dashboard/assignments', icon: ClipboardList },
          { id: 'fa-not', title: 'Notices', subtitle: 'Faculty circulars & bulletins', category: 'Navigation', path: '/faculty/dashboard/notices', icon: Megaphone },
          { id: 'fa-prf', title: 'Faculty Profile', subtitle: 'Designation & contact info', category: 'Navigation', path: '/faculty/dashboard/profile', icon: User },
        ];

      case 'placement':
        return [
          { id: 'pl-dash', title: 'Placement Overview', subtitle: 'Drives, stats & hiring overview', category: 'Navigation', path: '/placement-admin/dashboard', icon: Layers },
          { id: 'pl-drv', title: 'Recruitment Drives', subtitle: 'All ongoing & upcoming drives', category: 'Navigation', path: '/placement-admin/drives', icon: Briefcase },
          { id: 'pl-drv-new', title: 'Create Job Drive', subtitle: 'Post new recruitment drive', category: 'Navigation', path: '/placement-admin/drives/new', icon: Plus },
          { id: 'pl-cmp', title: 'Partner Companies', subtitle: 'Corporate directory & recruiters', category: 'Navigation', path: '/placement-admin/companies', icon: Building2 },
          { id: 'pl-app', title: 'Student Applications', subtitle: 'Review candidate resumes & status', category: 'Navigation', path: '/placement-admin/applications', icon: Users },
          { id: 'pl-shl', title: 'Shortlisted Candidates', subtitle: 'Hired & interview rounds', category: 'Navigation', path: '/placement-admin/shortlisted', icon: CheckCircle },
          { id: 'pl-anl', title: 'Placement Analytics', subtitle: 'CTC trends, packages & ratios', category: 'Navigation', path: '/placement-admin/analytics', icon: FileText },
          { id: 'pl-prf', title: 'Placement Profile', subtitle: 'TPO account details', category: 'Navigation', path: '/placement-admin/profile', icon: User },
        ];

      default:
        return [];
    }
  }, [role]);

  // Debounced live backend search for entities
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setRemoteResults([]);
      setIsSearchingRemote(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingRemote(true);
      const results: SearchItem[] = [];

      try {
        if (role === 'admin' || role === 'faculty') {
          // Search students
          const stuRes = await api.get(`/students/?search=${encodeURIComponent(trimmed)}&limit=4`).catch(() => null);
          if (stuRes?.data) {
            const items = stuRes.data.items || stuRes.data || [];
            items.slice(0, 3).forEach((s: any) => {
              results.push({
                id: `stu-${s.id}`,
                title: s.full_name || s.name || `Student #${s.id}`,
                subtitle: `${s.roll_no || s.enrollment_number || 'STU'} • ${s.branch || 'Sem ' + (s.current_semester || 1)}`,
                category: 'Students',
                path: role === 'admin' ? '/admin/dashboard/students/manage' : '/faculty/dashboard/attendance',
                icon: GraduationCap,
              });
            });
          }

          // Search faculty
          if (role === 'admin') {
            const facRes = await api.get(`/faculty/?search=${encodeURIComponent(trimmed)}`).catch(() => null);
            if (facRes?.data) {
              const items = facRes.data.items || facRes.data || [];
              items.slice(0, 3).forEach((f: any) => {
                results.push({
                  id: `fac-${f.id}`,
                  title: f.user?.full_name || f.full_name || `Faculty #${f.id}`,
                  subtitle: `${f.designation || 'Professor'} • ${f.employee_id || ''}`,
                  category: 'Faculty',
                  path: '/admin/dashboard/faculty/manage',
                  icon: Users,
                });
              });
            }
          }
        }

        // Search notices for all roles
        const notRes = await api.get(`/notices/?limit=10`).catch(() => null);
        if (notRes?.data) {
          const items = notRes.data.items || notRes.data || [];
          items
            .filter((n: any) => n.title?.toLowerCase().includes(trimmed.toLowerCase()))
            .slice(0, 2)
            .forEach((n: any) => {
              results.push({
                id: `not-${n.id}`,
                title: n.title,
                subtitle: `Notice [${n.category}] • ${new Date(n.created_at).toLocaleDateString()}`,
                category: 'Notices',
                path: role === 'admin' ? '/admin/dashboard/notify/faculty' : role === 'student' ? '/dashboard/notices' : '/faculty/dashboard/notices',
                icon: Megaphone,
              });
            });
        }
      } catch (err) {
        console.error('Remote search error', err);
      } finally {
        setRemoteResults(results);
        setIsSearchingRemote(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, role]);

  // Combine static navigation with live matches
  const combinedResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return roleCatalog.slice(0, 8); // Default quick navigation shortcuts
    }

    const matchedNav = roleCatalog.filter(
      item => item.title.toLowerCase().includes(q) || (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );

    return [...matchedNav, ...remoteResults];
  }, [query, roleCatalog, remoteResults]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [combinedResults]);

  // Handle navigation
  const handleSelect = (item: SearchItem) => {
    onClose();
    navigate(item.path);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, combinedResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + combinedResults.length) % Math.max(1, combinedResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (combinedResults[selectedIndex]) {
        handleSelect(combinedResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const defaultPlaceholder = 
    role === 'admin' ? 'Search students, faculty, pages, fees...' :
    role === 'faculty' ? 'Search subjects, marks, students...' :
    role === 'placement' ? 'Search drives, companies, applicants...' :
    'Search anything (pages, events, notices, fees)...';

  return (
    <div style={{ position: 'relative' }}>
      {/* ── Input bar inside Dynamic Island pill ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: 420,
          height: 60,
          padding: '0 18px',
          gap: 12,
        }}
      >
        <Search size={19} color="#282B4A" strokeWidth={2} style={{ flexShrink: 0 }} />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || defaultPlaceholder}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '15px',
            fontWeight: 500,
            color: '#282B4A',
            fontFamily: 'Space Grotesk, sans-serif',
            caretColor: '#282B4A',
          }}
        />

        {query ? (
          <button
            onClick={() => setQuery('')}
            style={{
              background: 'rgba(40, 43, 74, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#282B4A',
            }}
          >
            <X size={14} />
          </button>
        ) : (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.5px',
              background: 'rgba(40, 43, 74, 0.08)',
              color: '#282B4A',
              padding: '3px 8px',
              borderRadius: '8px',
            }}
          >
            ESC
          </span>
        )}
      </div>

      {/* ── Floating Dropdown Results Popover ── */}
      <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'absolute',
          top: 'calc(100% + 14px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 460,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '24px',
          border: '1.5px solid rgba(40, 43, 74, 0.12)',
          boxShadow: '0 20px 50px rgba(40, 43, 74, 0.18)',
          overflow: 'hidden',
          zIndex: 10001,
          fontFamily: 'Space Grotesk, sans-serif',
        }}
      >
        {/* Results Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          background: 'rgba(247, 245, 236, 0.85)',
          borderBottom: '1px solid rgba(40, 43, 74, 0.08)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
          color: '#282B4A',
        }}
        >
          <span>{query.trim() ? `Search Results (${combinedResults.length})` : 'Quick Navigation Shortcuts'}</span>
          {isSearchingRemote && <span style={{ color: '#71717a' }}>Searching...</span>}
        </div>

        {/* Results List */}
        <div style={{ maxHeight: 360, overflowY: 'auto', padding: '8px' }}>
          {combinedResults.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: '#71717a' }}>
              <Search size={32} color="#282B4A" style={{ margin: '0 auto 10px', opacity: 0.4 }} />
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#282B4A' }}>No results found</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>Try searching with a different term</div>
            </div>
          ) : (
            combinedResults.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(40, 43, 74, 0.08)' : 'transparent',
                    border: isSelected ? '1px solid rgba(40, 43, 74, 0.12)' : '1px solid transparent',
                    transition: 'all 0.12s ease',
                    marginBottom: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '12px',
                        background: isSelected ? '#282B4A' : 'rgba(40, 43, 74, 0.06)',
                        color: isSelected ? '#EEEBDA' : '#282B4A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.12s ease',
                      }}
                    >
                      <Icon size={18} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#09090b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 12 }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        letterSpacing: '0.4px',
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '8px',
                        background: 'rgba(40, 43, 74, 0.06)',
                        color: '#282B4A',
                      }}
                    >
                      {item.category}
                    </span>
                    {isSelected && (
                      <CornerDownLeft size={14} color="#282B4A" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div style={{
          padding: '10px 18px',
          background: 'rgba(247, 245, 236, 0.94)',
          borderTop: '1px solid rgba(40, 43, 74, 0.08)',
          fontSize: '11px',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        >
          <span>Use <strong style={{ color: '#282B4A' }}>↑↓</strong> to navigate</span>
          <span>Press <strong style={{ color: '#282B4A' }}>Enter ↵</strong> to open</span>
          <span>Press <strong style={{ color: '#282B4A' }}>ESC</strong> to close</span>
        </div>
      </motion.div>
    </div>
  );
};
