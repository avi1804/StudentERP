import React, { useEffect, useState } from "react";
import { 
  Briefcase, BarChart2, Users, Target, Award,
  ChevronRight, Megaphone, FileText, MonitorPlay, Brain, Building2,
  Circle, ChevronDown, Check, ArrowUpRight, Loader2, Sparkles, AlertCircle, X, ExternalLink
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import TextType from "../../components/TextType";
import { apiClient as api } from "../../api/axios";

interface Drive {
  id: number;
  title: string;
  description: string;
  company_id: number;
  company_name: string;
  company_industry: string;
  company_website?: string;
  drive_date: string;
  registration_deadline: string;
  package_offered: string;
  package_lpa: number;
  eligibility_cgpa: number;
  has_applied: boolean;
  application_status?: string | null;
  applied_on?: string | null;
  is_eligible: boolean;
}

interface StudentPlacementDashboardData {
  kpis: {
    dream_offers: number;
    active_drives: number;
    placed_students: number;
    highest_package: string;
    average_package: string;
    total_applications: number;
    my_applications_count: number;
  };
  upcoming_drives: Drive[];
  statistics: {
    role_distribution: Array<{ name: string; value: number; color: string }>;
    package_distribution: Array<{ label: string; count: number; percent: number; color: string }>;
    total_drives_analyzed: number;
  };
  journey: {
    profile_completed: boolean;
    skills_assessed: boolean;
    resume_submitted: boolean;
    applications_count: number;
    highest_status: string;
  };
  announcements: Array<{
    id: number;
    title: string;
    description: string;
    date: string;
    is_new: boolean;
  }>;
  companies: Array<{
    id: number;
    name: string;
    industry: string;
    website?: string;
  }>;
}

export function PlacementCell() {
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<StudentPlacementDashboardData | null>(null);
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [selectedDrive, setSelectedDrive] = useState<Drive | null>(null);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/placements/student-dashboard");
      setDashboardData(res.data);
    } catch (err: any) {
      console.error("Failed to fetch placement dashboard data:", err);
      setToastMsg({
        text: err.response?.data?.detail || "Failed to load real-time placement data.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApply = async (driveId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      setApplyingId(driveId);
      const res = await api.post(`/placements/drives/${driveId}/apply`);
      setToastMsg({
        text: res.data?.message || "Successfully applied for placement drive!",
        type: "success"
      });
      // Refresh real-time dashboard state
      await fetchDashboardData();
      if (selectedDrive?.id === driveId) {
        setSelectedDrive(prev => prev ? { ...prev, has_applied: true, application_status: "APPLIED" } : null);
      }
    } catch (err: any) {
      setToastMsg({
        text: err.response?.data?.detail || "Failed to submit application. Please try again.",
        type: "error"
      });
    } finally {
      setApplyingId(null);
    }
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  if (loading && !dashboardData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '16px', fontFamily: 'Space Grotesk, sans-serif' }}>
        <Loader2 size={36} className="animate-spin" color="#573cfa" />
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#4b5563' }}>Loading Placement Opportunities...</div>
      </div>
    );
  }

  const kpis = dashboardData?.kpis || {
    dream_offers: 0,
    active_drives: 0,
    placed_students: 0,
    highest_package: "0 LPA",
    average_package: "0 LPA",
    total_applications: 0,
    my_applications_count: 0
  };

  const pieData = dashboardData?.statistics?.role_distribution || [];
  const totalPiePlaced = pieData.reduce((acc, curr) => acc + curr.value, 0) || 1;
  const packageDistribution = dashboardData?.statistics?.package_distribution || [];
  const upcomingDrives = dashboardData?.upcoming_drives || [];
  const journey = dashboardData?.journey || {
    profile_completed: true,
    skills_assessed: true,
    resume_submitted: true,
    applications_count: 0,
    highest_status: "NOT_APPLIED"
  };
  const announcements = dashboardData?.announcements || [];
  const companies = dashboardData?.companies || [];

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      
      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '24px',
              right: '24px',
              zIndex: 9999,
              background: toastMsg.type === 'success' ? '#10b981' : '#ef4444',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '12px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            {toastMsg.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span>{toastMsg.text}</span>
            <X size={16} style={{ cursor: 'pointer', marginLeft: '8px' }} onClick={() => setToastMsg(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header with Animated Highlighted Text Badge ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>Placement</span>
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              padding: '4px 18px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1.2,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <TextType
                text={["Cell", "Portal", "Opportunities"]}
                typingSpeed={60}
                deletingSpeed={35}
                pauseDuration={2200}
                loop={true}
                showCursor={true}
                cursorCharacter="|"
                style={{ color: '#ffffff' }}
              />
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Real-time drives, applications, and placement metrics</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>
            <Sparkles size={14} color="#573cfa" /> Real-Time Live Feed
          </div>
        </div>
      </div>

      {/* ── Real-Time Top KPI Cards Row ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '18px', marginBottom: '32px' }}
      >
        {/* KPI 1 — Dream Offers */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(87,60,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(87,60,250,0.08)' }}>
                <BarChart2 size={18} color="#573cfa" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#52525b' }}>Dream Offers</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '42px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {kpis.dream_offers}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#573cfa', fontWeight: 600 }}>≥10 LPA</span> · High Value Drives
            </div>
          </div>
        </motion.div>

        {/* KPI 2 — Active Drives */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.08)' }}>
                <Briefcase size={18} color="#22c55e" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#52525b' }}>Active Drives</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '42px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {kpis.active_drives}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>Active</span> · Open Registrations
            </div>
          </div>
        </motion.div>

        {/* KPI 3 — Students Placed */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,0.08)' }}>
                <Users size={18} color="#3b82f6" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#52525b' }}>Students Placed</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '42px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {kpis.placed_students}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#3b82f6', fontWeight: 600 }}>Secured</span> · Selected Candidates
            </div>
          </div>
        </motion.div>

        {/* KPI 4 — Highest Package */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,158,11,0.08)' }}>
                <Target size={18} color="#f59e0b" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#52525b' }}>Highest Package</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {kpis.highest_package}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>Record</span> · Maximum CTC
            </div>
          </div>
        </motion.div>

        {/* KPI 5 — Avg Package */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(236,72,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(236,72,153,0.08)' }}>
                <Award size={18} color="#ec4899" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#52525b' }}>Avg Package</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {kpis.average_package}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#ec4899', fontWeight: 600 }}>Average</span> · Campus CTC
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Middle Section (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Left Column: Upcoming Placement Drives (Real Backend Data & 1-Click Apply) */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f3f4f6', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Upcoming Placement Drives</h3>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Real-time database drives open for student application</div>
            </div>
            <span style={{ fontSize: '12px', color: '#573cfa', fontWeight: 600, background: '#f3f0ff', padding: '4px 10px', borderRadius: '8px' }}>
              {upcomingDrives.length} Drives Available
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            {upcomingDrives.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af', fontSize: '13px' }}>
                No active placement drives at the moment.
              </div>
            ) : (
              upcomingDrives.map((drive, idx) => {
                const isApplying = applyingId === drive.id;
                const formattedDate = new Date(drive.registration_deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

                return (
                  <React.Fragment key={drive.id}>
                    <div 
                      onClick={() => setSelectedDrive(drive)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '12px', 
                        borderRadius: '14px', 
                        border: '1px solid #f3f4f6', 
                        transition: 'all 0.2s ease', 
                        cursor: 'pointer',
                        background: selectedDrive?.id === drive.id ? '#f9fafb' : 'transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ 
                          width: '44px', 
                          height: '44px', 
                          borderRadius: '12px', 
                          background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '18px', 
                          fontWeight: 700, 
                          color: '#4f46e5' 
                        }}>
                          {drive.company_name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {drive.company_name}
                            <span style={{ fontSize: '11px', fontWeight: 500, color: '#6b7280' }}>· {drive.title}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ background: '#f3f0ff', color: '#573cfa', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600 }}>
                              {drive.package_offered}
                            </span>
                            <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600 }}>
                              Min CGPA: {drive.eligibility_cgpa}
                            </span>
                            <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600 }}>
                              {drive.company_industry}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '11px', color: '#6b7280' }}>Apply By</div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444' }}>{formattedDate}</div>
                        </div>

                        {drive.has_applied ? (
                          <div style={{ 
                            padding: '8px 16px', 
                            background: '#ecfdf5', 
                            border: '1px solid #a7f3d0', 
                            color: '#059669', 
                            borderRadius: '10px', 
                            fontSize: '12px', 
                            fontWeight: 700, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px' 
                          }}>
                            <Check size={14} /> Applied
                          </div>
                        ) : (
                          <button
                            disabled={isApplying}
                            onClick={(e) => handleApply(drive.id, e)}
                            style={{ 
                              padding: '8px 18px', 
                              background: '#573cfa', 
                              border: 'none', 
                              color: 'white', 
                              borderRadius: '10px', 
                              fontSize: '12px', 
                              fontWeight: 700, 
                              cursor: isApplying ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 4px 12px rgba(87, 60, 250, 0.25)',
                              opacity: isApplying ? 0.7 : 1
                            }}
                          >
                            {isApplying ? <Loader2 size={14} className="animate-spin" /> : "Apply Now"}
                          </button>
                        )}
                      </div>
                    </div>
                    {idx < upcomingDrives.length - 1 && <div style={{ height: '1px', background: '#f3f4f6' }}></div>}
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Statistics & Preparation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Placement Statistics (Pie & Bar Chart fed with real backend analytics) */}
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Placement Statistics</h3>
              <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600 }}>Live DB Aggregation</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '20px' }}>
              {/* Pie Chart */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '110px', height: '110px', position: 'relative', flexShrink: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} innerRadius={35} outerRadius={52} paddingAngle={3} dataKey="value" stroke="none">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>{totalPiePlaced}</div>
                    <div style={{ fontSize: '9px', color: '#6b7280' }}>Industries</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                  {pieData.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4b5563' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: d.color }}></div>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80px' }}>{d.name}</span>
                      </div>
                      <div style={{ color: '#111827', fontWeight: 600 }}>{d.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Package Distribution Bar Charts */}
              <div style={{ borderLeft: '1px solid #f3f4f6', paddingLeft: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>CTC Range Breakdown</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {packageDistribution.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '64px', fontSize: '10px', color: '#4b5563', fontWeight: 500 }}>{item.label}</div>
                      <div style={{ flex: 1, height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.percent}%`, height: '100%', background: item.color, borderRadius: '3px' }}></div>
                      </div>
                      <div style={{ width: '26px', fontSize: '10px', fontWeight: 700, color: '#111827', textAlign: 'right' }}>{item.percent}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preparation Progress */}
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Preparation Progress</h3>
              <span style={{ fontSize: '12px', color: '#573cfa', fontWeight: 600 }}>82% Average Score</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              
              <div style={{ padding: '14px', border: '1px solid #f3f4f6', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#f3f0ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Brain size={14} /></div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>85%</div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563' }}>Aptitude</div>
              </div>

              <div style={{ padding: '14px', border: '1px solid #f3f4f6', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MonitorPlay size={14} /></div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>78%</div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563' }}>DSA</div>
              </div>

              <div style={{ padding: '14px', border: '1px solid #f3f4f6', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={14} /></div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>90%</div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563' }}>HR Prep</div>
              </div>

              <div style={{ padding: '14px', border: '1px solid #f3f4f6', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={14} /></div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>88%</div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563' }}>Resume</div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section (3 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        
        {/* Placement Resources */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f3f4f6', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>Placement Resources</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', border: '1px solid #f3f4f6', borderRadius: '12px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={18} /></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>Resume Builder</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Create & optimize ATS resume</div>
                </div>
              </div>
              <ChevronRight size={16} color="#9ca3af" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', border: '1px solid #f3f4f6', borderRadius: '12px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MonitorPlay size={18} /></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>Mock Interviews</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Practice AI tech & HR interviews</div>
                </div>
              </div>
              <ChevronRight size={16} color="#9ca3af" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', border: '1px solid #f3f4f6', borderRadius: '12px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Brain size={18} /></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>Aptitude Tests</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Quant, Reasoning & Verbal</div>
                </div>
              </div>
              <ChevronRight size={16} color="#9ca3af" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', border: '1px solid #f3f4f6', borderRadius: '12px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={18} /></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>Company Insights</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Explore tech stacks & packages</div>
                </div>
              </div>
              <ChevronRight size={16} color="#9ca3af" />
            </div>

          </div>
        </div>

        {/* Recent Announcements */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f3f4f6', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Placement Announcements</h3>
            <span style={{ fontSize: '11px', color: '#573cfa', fontWeight: 600 }}>Live Feed</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {announcements.length === 0 ? (
              <div style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>No announcements available.</div>
            ) : (
              announcements.map((item, i) => (
                <React.Fragment key={item.id}>
                  <div style={{ display: 'flex', gap: '14px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      <Megaphone size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '3px' }}>{item.title}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>{item.description}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ fontSize: '10px', color: '#9ca3af' }}>{item.date}</div>
                        {item.is_new && (
                          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 700 }}>New</div>
                        )}
                      </div>
                    </div>
                  </div>
                  {i < announcements.length - 1 && <div style={{ height: '1px', background: '#f3f4f6' }}></div>}
                </React.Fragment>
              ))
            )}
          </div>
        </div>

        {/* Real-Time Placement Journey */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f3f4f6', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>Your Placement Journey</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
            
            {/* Timeline Line */}
            <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '24px', width: '2px', background: '#e5e7eb' }}></div>
            <div style={{ position: 'absolute', left: '11px', top: '24px', height: journey.applications_count > 0 ? '75%' : '40%', width: '2px', background: '#10b981' }}></div>

            {/* Step 1 */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={14} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>Profile Completion</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Student Profile verified</div>
              </div>
              <span style={{ background: '#e8f5e9', color: '#10b981', padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700, height: 'fit-content' }}>
                Completed
              </span>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={14} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>Skills & CGPA</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Eligibility status active</div>
              </div>
              <span style={{ background: '#e8f5e9', color: '#10b981', padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700, height: 'fit-content' }}>
                Completed
              </span>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={14} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>Resume Ready</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Default resume attached</div>
              </div>
              <span style={{ background: '#e8f5e9', color: '#10b981', padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700, height: 'fit-content' }}>
                Completed
              </span>
            </div>

            {/* Step 4 */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: journey.applications_count > 0 ? '#3b82f6' : 'white', border: journey.applications_count > 0 ? 'none' : '2px solid #3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {journey.applications_count > 0 ? <Check size={14} /> : <Circle size={10} fill="#3b82f6" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>Drive Applications</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                  {journey.applications_count > 0 
                    ? `Applied to ${journey.applications_count} placement drive${journey.applications_count > 1 ? 's' : ''}`
                    : "No applications submitted yet"}
                </div>
              </div>
              <span style={{ 
                background: journey.applications_count > 0 ? '#eff6ff' : '#f3f4f6', 
                color: journey.applications_count > 0 ? '#3b82f6' : '#6b7280', 
                padding: '3px 8px', 
                borderRadius: '10px', 
                fontSize: '10px', 
                fontWeight: 700, 
                height: 'fit-content' 
              }}>
                {journey.applications_count > 0 ? 'Active' : 'Pending'}
              </span>
            </div>

            {/* Step 5 */}
            <div style={{ display: 'flex', gap: '14px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                background: journey.highest_status === 'SELECTED' ? '#10b981' : 'white', 
                border: journey.highest_status === 'SELECTED' ? 'none' : '2px solid #d1d5db', 
                color: 'white',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexShrink: 0 
              }}>
                {journey.highest_status === 'SELECTED' && <Check size={14} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>Selection / Offer</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                  {journey.highest_status === 'SELECTED' ? 'Dream offer secured!' : 'Awaiting interview outcomes'}
                </div>
              </div>
              <span style={{ background: '#f3f4f6', color: '#6b7280', padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700, height: 'fit-content' }}>
                {journey.highest_status === 'SELECTED' ? 'Selected' : 'In Progress'}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* ── Partner Companies / Top Recruiters ── */}
      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f3f4f6', padding: '24px', marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={20} color="#573cfa" />
              Our Partner Companies
            </h3>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Explore top organizations hiring from our campus</div>
          </div>
          <span style={{ fontSize: '12px', color: '#573cfa', fontWeight: 600, background: '#f3f0ff', padding: '4px 10px', borderRadius: '8px' }}>
            {companies.length} Registered Partners
          </span>
        </div>

        {companies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af', fontSize: '13px' }}>
            No partner companies registered yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            {companies.map(company => (
              <a 
                key={company.id}
                href={company.website || '#'}
                target={company.website ? '_blank' : '_self'}
                rel="noreferrer"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '14px', 
                  padding: '16px', 
                  borderRadius: '16px', 
                  border: '1px solid #f3f4f6', 
                  transition: 'all 0.2s ease', 
                  cursor: company.website ? 'pointer' : 'default',
                  textDecoration: 'none',
                  background: 'white'
                }}
                onMouseEnter={e => {
                  if (company.website) {
                    e.currentTarget.style.borderColor = '#c7d2fe';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05)';
                  }
                }}
                onMouseLeave={e => {
                  if (company.website) {
                    e.currentTarget.style.borderColor = '#f3f4f6';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div style={{ 
                  width: '46px', 
                  height: '46px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '18px', 
                  fontWeight: 700, 
                  color: '#4f46e5',
                  flexShrink: 0
                }}>
                  {company.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {company.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {company.industry}
                  </div>
                </div>
                {company.website && (
                  <ExternalLink size={14} color="#9ca3af" />
                )}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ── Drive Detail Modal ── */}
      <AnimatePresence>
        {selectedDrive && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: 'white',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '560px',
                padding: '28px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                position: 'relative'
              }}
            >
              <button 
                onClick={() => setSelectedDrive(null)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} color="#4b5563" />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700 }}>
                  {selectedDrive.company_name.charAt(0)}
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>{selectedDrive.company_name}</h2>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{selectedDrive.title} · {selectedDrive.company_industry}</div>
                </div>
              </div>

              <div style={{ background: '#f9fafb', borderRadius: '16px', padding: '16px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Package Offered</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#573cfa' }}>{selectedDrive.package_offered}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Eligibility CGPA</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>{selectedDrive.eligibility_cgpa} Cutoff</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Drive Date</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{new Date(selectedDrive.drive_date).toLocaleDateString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Application Deadline</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#ef4444' }}>{new Date(selectedDrive.registration_deadline).toLocaleDateString()}</div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>Job Description</h4>
                <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>{selectedDrive.description}</p>
              </div>

              {selectedDrive.company_website && (
                <a 
                  href={selectedDrive.company_website} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#573cfa', textDecoration: 'none', fontWeight: 600, marginBottom: '24px' }}
                >
                  Visit Company Career Portal <ExternalLink size={14} />
                </a>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setSelectedDrive(null)}
                  style={{ padding: '10px 20px', background: '#f3f4f6', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}
                >
                  Close
                </button>
                {selectedDrive.has_applied ? (
                  <div style={{ padding: '10px 24px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', borderRadius: '10px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={16} /> Application Submitted
                  </div>
                ) : (
                  <button
                    disabled={applyingId === selectedDrive.id}
                    onClick={() => handleApply(selectedDrive.id)}
                    style={{ padding: '10px 24px', background: '#573cfa', border: 'none', color: 'white', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {applyingId === selectedDrive.id ? <Loader2 size={16} className="animate-spin" /> : "Confirm Application"}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
