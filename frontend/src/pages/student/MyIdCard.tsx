import React, { useEffect, useState } from "react";
import { Download, User, Calendar, Droplets, Phone, Mail, GraduationCap, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { apiClient } from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import TextType from "../../components/TextType";

export function MyIdCard() {
  const currentUser = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    apiClient.get("/students/me")
      .then(res => setProfile(res.data))
      .catch(err => console.error("Failed to fetch student profile:", err));
  }, []);

  const studentName = profile?.user?.full_name || currentUser?.full_name || "Student Name";
  const email = profile?.user?.email || currentUser?.email || "student@college.edu";
  const enrollmentNumber = profile?.enrollment_number || "CS629";
  const semester = profile?.semester || 7;
  const branch = profile?.batch || "Computer Science & Engineering";
  const phone = profile?.contact_number || "+91 98765 43210";
  const initials = studentName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  const handlePrintDownload = () => {
    window.print();
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Printable Styles for Clean PDF Download */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-id-card-wrapper, #printable-id-card-wrapper * {
            visibility: visible !important;
          }
          #printable-id-card-wrapper {
            position: absolute !important;
            left: 50% !important;
            top: 40% !important;
            transform: translate(-50%, -50%) !important;
            width: 100% !important;
            max-width: 680px !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header Row */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>Digital</span>
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
                text={["ID Card", "Digital Pass", "Identity"]}
                typingSpeed={60}
                deletingSpeed={35}
                pauseDuration={2200}
                loop={true}
                showCursor={true}
                cursorCharacter="|"
                style={{ color: '#ffffff' }}
              />
            </span>
            <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', background: '#dcfce7', color: '#15803d', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> Official & Verified
            </span>
          </h1>
          <p style={{ fontSize: '13px', color: '#71717a', marginTop: '6px', margin: 0 }}>
            Official digital identity card for academic access and campus verification
          </p>
        </div>

        <button
          onClick={handlePrintDownload}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: '#573cfa',
            color: '#ffffff',
            borderRadius: '14px',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(87, 60, 250, 0.35)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <Download size={18} /> Download ID Card (PDF)
        </button>
      </div>

      {/* ── CENTERED DIGITAL ID CARD SHOWCASE ── */}
      <div id="printable-id-card-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            width: '100%',
            maxWidth: '720px',
            background: '#ffffff',
            borderRadius: '24px',
            border: '1.5px solid #e4e4e7',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            display: 'flex',
            minHeight: '380px'
          }}
        >
          {/* Left Gradient Banner (Avatar & Basic Info) */}
          <div
            style={{
              width: '38%',
              background: 'linear-gradient(145deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)',
              padding: '32px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              color: '#ffffff',
              textAlign: 'center'
            }}
          >
            {/* Background Wavy Decoration */}
            <svg viewBox="0 0 1440 320" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', opacity: 0.15, pointerEvents: 'none' }} preserveAspectRatio="none">
              <path fill="#ffffff" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>

            {/* Top College Info */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                <GraduationCap size={15} /> Indus University
              </div>
              <div style={{ fontSize: '10px', opacity: 0.85, marginTop: '4px', fontWeight: 600 }}>
                Ahmedabad, Gujarat
              </div>
            </div>

            {/* Avatar Circle with Initials */}
            <div style={{ position: 'relative', zIndex: 1, margin: '20px 0' }}>
              <div
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  color: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '32px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  border: '4px solid rgba(255,255,255,0.4)'
                }}
              >
                {initials}
              </div>
            </div>

            {/* Name & Semester */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '19px', fontWeight: 800, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                {studentName}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '4px', fontWeight: 600 }}>
                {branch}
              </div>
              <div style={{ marginTop: '12px', display: 'inline-block', background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', padding: '4px 14px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                Semester {semester}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Credentials & Barcode */}
          <div style={{ width: '62%', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#ffffff' }}>
            
            {/* Header Badge Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f4f4f5' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  STUDENT CREDENTIAL PASS
                </span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#09090b', marginTop: '2px' }}>
                  Academic Session 2024–2025
                </div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                ACTIVE PASS
              </span>
            </div>

            {/* Grid of Credentials */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px 0' }}>
              
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '3px' }}>
                  Enrollment No
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#4f46e5', fontFamily: 'monospace' }}>
                  {enrollmentNumber}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '3px' }}>
                  Current Semester
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#09090b' }}>
                  Semester {semester}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '3px' }}>
                  Contact Phone
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#09090b' }}>
                  {phone}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '3px' }}>
                  Blood Group
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#dc2626' }}>
                  B+
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '3px' }}>
                  Official Email
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#09090b' }}>
                  {email}
                </div>
              </div>

            </div>

            {/* Bottom Barcode & Security Validity Footer */}
            <div style={{ paddingTop: '16px', borderTop: '1px solid #f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              
              {/* Barcode Lines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', height: '32px', gap: '2px', alignItems: 'center' }}>
                  {[2, 4, 1, 3, 2, 5, 1, 4, 2, 3, 1, 4, 2, 3, 5, 2, 1, 4, 2, 3, 1, 4, 2, 5].map((w, idx) => (
                    <div key={idx} style={{ width: `${w}px`, height: '100%', background: '#09090b' }}></div>
                  ))}
                </div>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#71717a', fontFamily: 'monospace', letterSpacing: '1.5px' }}>
                  *{enrollmentNumber}*
                </span>
              </div>

              {/* Validity Tag */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase' }}>
                  Valid Until
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#16a34a' }}>
                  30 JUNE 2026
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>

    </div>
  );
}
