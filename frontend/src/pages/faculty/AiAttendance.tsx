import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, Upload, FileText, CheckCircle2, AlertTriangle, HelpCircle, 
  ArrowRight, Check, X, RotateCcw, Search, ChevronDown, 
  Calendar, BookOpen, AlertCircle, FileUp, Loader2, ArrowUpRight,
  ShieldCheck, UserCheck, Eye, Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TextType from "../../components/TextType";
import { apiClient as api } from "../../api/axios";

interface SubjectOption {
  id: number;
  name: string;
  code: string;
  semester: number;
  batch: string;
  enrolled_students: number;
}

interface MatchRecord {
  id: number;
  enrollment_number: string;
  student_id: number | null;
  student_name: string;
  student_enrollment: string | null;
  confidence: number;
  status: "AUTO_MATCHED" | "REVIEW_REQUIRED" | "CONFIRMED" | "REJECTED" | "NOT_FOUND";
  match_reason: string;
  source_text?: string;
  marked_present: boolean;
}

interface AvailableStudent {
  id: number;
  name: string;
  enrollment_number: string;
}

interface AnalysisResult {
  session_id: number;
  subject_id: number;
  subject_name: string;
  date: string;
  status: string;
  summary: {
    total_detected: number;
    total_matched: number;
    total_review: number;
    total_unmatched: number;
  };
  existing_attendance: {
    already_exists: boolean;
    existing_count: number;
    warning_message: string | null;
  };
  matches: MatchRecord[];
  available_students: AvailableStudent[];
}

export function AiAttendance() {
  const navigate = useNavigate();

  // State: Subjects & Configuration
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | "">("");
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loadingSubjects, setLoadingSubjects] = useState<boolean>(true);

  // State: Input Mode ("file" | "text")
  const [inputMode, setInputMode] = useState<"file" | "text">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State: Processing Pipeline
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<number>(0);

  // State: Review & Results
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "AUTO_MATCHED" | "REVIEW_REQUIRED" | "NOT_FOUND">("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // State: Confirmation Modal & Final Submission
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<{
    message: string;
    total: number;
    subjectName: string;
    date: string;
  } | null>(null);

  // Toast notification
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" | "warning" } | null>(null);

  // 1. Fetch assigned subjects for the faculty
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const res = await api.get("/faculty-dash/my-subjects");
        setSubjects(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedSubjectId(res.data[0].id);
        }
      } catch (err: any) {
        console.error("Failed to load faculty subjects:", err);
        setToastMsg({
          text: err.response?.data?.detail || "Failed to load assigned subjects.",
          type: "error"
        });
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMsg) {
      const t = setTimeout(() => setToastMsg(null), 4500);
      return () => clearTimeout(t);
    }
  }, [toastMsg]);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "png", "jpg", "jpeg", "txt"].includes(ext || "")) {
      setToastMsg({ text: "Please select a supported file (.pdf, .png, .jpg, .jpeg, .txt).", type: "warning" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setToastMsg({ text: "File size exceeds 10 MB limit.", type: "warning" });
      return;
    }
    setSelectedFile(file);
  };

  // Run AI Analysis Pipeline
  const handleAnalyze = async () => {
    if (!selectedSubjectId) {
      setToastMsg({ text: "Please select an assigned subject first.", type: "warning" });
      return;
    }
    if (inputMode === "file" && !selectedFile) {
      setToastMsg({ text: "Please upload an attendance sheet file.", type: "warning" });
      return;
    }
    if (inputMode === "text" && !pastedText.trim()) {
      setToastMsg({ text: "Please paste text containing enrollment numbers.", type: "warning" });
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingStep(1); // Document uploaded

      // Simulated pipeline progress steps for visual feedback
      const timer1 = setTimeout(() => setProcessingStep(2), 700);  // Reading document
      const timer2 = setTimeout(() => setProcessingStep(3), 1500); // Extracting enrollments
      const timer3 = setTimeout(() => setProcessingStep(4), 2200); // Matching against DB

      let res;
      if (inputMode === "file" && selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("subject_id", String(selectedSubjectId));
        formData.append("date", attendanceDate);

        res = await api.post("/attendance/ai/analyze", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        res = await api.post("/attendance/ai/analyze-text", {
          text: pastedText,
          subject_id: Number(selectedSubjectId),
          date: attendanceDate
        });
      }

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      setProcessingStep(5);
      setTimeout(() => {
        setAnalysisResult(res.data);
        setIsProcessing(false);
        setProcessingStep(0);
      }, 500);

    } catch (err: any) {
      setIsProcessing(false);
      setProcessingStep(0);
      const detail = err.response?.data?.detail || "Failed to analyze attendance document. Please check the file and try again.";
      setToastMsg({ text: detail, type: "error" });
    }
  };

  // Toggle present status for a row
  const handleTogglePresent = (matchId: number) => {
    if (!analysisResult) return;
    setAnalysisResult(prev => {
      if (!prev) return null;
      return {
        ...prev,
        matches: prev.matches.map(m => m.id === matchId ? { ...m, marked_present: !m.marked_present } : m)
      };
    });
  };

  // Manual resolution: assign real student to an unmatched or review row
  const handleAssignStudent = async (matchId: number, studentId: number) => {
    if (!analysisResult) return;
    const selectedStu = analysisResult.available_students.find(s => s.id === studentId);
    if (!selectedStu) return;

    // Optimistically update UI
    setAnalysisResult(prev => {
      if (!prev) return null;
      return {
        ...prev,
        matches: prev.matches.map(m => {
          if (m.id === matchId) {
            return {
              ...m,
              student_id: selectedStu.id,
              student_name: selectedStu.name,
              student_enrollment: selectedStu.enrollment_number,
              status: "CONFIRMED",
              confidence: 1.0,
              match_reason: `Manually assigned to ${selectedStu.enrollment_number}`,
              marked_present: true
            };
          }
          return m;
        })
      };
    });

    setOpenDropdownId(null);

    // Sync with backend
    try {
      await api.patch(`/attendance/ai/${analysisResult.session_id}/matches/${matchId}`, {
        student_id: studentId,
        marked_present: true,
        status: "CONFIRMED"
      });
    } catch (err) {
      console.error("Failed to patch match record:", err);
    }
  };

  // Dismiss / Reject an unmatched row
  const handleDismissMatch = async (matchId: number) => {
    if (!analysisResult) return;
    setAnalysisResult(prev => {
      if (!prev) return null;
      return {
        ...prev,
        matches: prev.matches.map(m => m.id === matchId ? { ...m, status: "REJECTED", marked_present: false } : m)
      };
    });

    try {
      await api.patch(`/attendance/ai/${analysisResult.session_id}/matches/${matchId}`, {
        marked_present: false,
        status: "REJECTED"
      });
    } catch (err) {
      console.error("Failed to reject match:", err);
    }
  };

  // Confirm Attendance Submission
  const handleConfirmSubmission = async () => {
    if (!analysisResult) return;
    try {
      setIsSubmitting(true);
      const res = await api.post(`/attendance/ai/${analysisResult.session_id}/confirm`);
      setShowConfirmModal(false);
      setSubmitSuccess({
        message: res.data.message || "Attendance successfully recorded.",
        total: res.data.total_marked_present || 0,
        subjectName: res.data.subject_name || analysisResult.subject_name,
        date: res.data.date || analysisResult.date
      });
    } catch (err: any) {
      setShowConfirmModal(false);
      const detail = err.response?.data?.detail || "Failed to commit attendance. Please try again.";
      setToastMsg({ text: detail, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter matches based on active tab and search query
  const filteredMatches = analysisResult?.matches.filter(m => {
    if (activeFilter === "AUTO_MATCHED" && m.status !== "AUTO_MATCHED") return false;
    if (activeFilter === "REVIEW_REQUIRED" && m.status !== "REVIEW_REQUIRED") return false;
    if (activeFilter === "NOT_FOUND" && (m.status !== "NOT_FOUND" && m.status !== "REJECTED")) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchEnr = m.enrollment_number.toLowerCase().includes(q);
      const matchName = m.student_name.toLowerCase().includes(q);
      const matchRealEnr = (m.student_enrollment || "").toLowerCase().includes(q);
      return matchEnr || matchName || matchRealEnr;
    }
    return true;
  }) || [];

  const presentCount = analysisResult?.matches.filter(m => m.marked_present && m.student_id !== null).length || 0;
  const unmarkedCount = (analysisResult?.matches.length || 0) - presentCount;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 8px 48px", fontFamily: "Space Grotesk, sans-serif" }}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed",
              top: "24px",
              right: "24px",
              zIndex: 9999,
              background: toastMsg.type === "success" ? "#10b981" : toastMsg.type === "warning" ? "#f59e0b" : "#ef4444",
              color: "white",
              padding: "12px 20px",
              borderRadius: "14px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "14px",
              fontWeight: 600
            }}
          >
            {toastMsg.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
            <span>{toastMsg.text}</span>
            <X size={16} style={{ cursor: "pointer", marginLeft: "8px" }} onClick={() => setToastMsg(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#282B4A", letterSpacing: "-0.8px", margin: 0, display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span>AI</span>
            <span style={{
              background: "linear-gradient(135deg, #282B4A 0%, #3a3e68 100%)",
              color: "#EEEBDA",
              padding: "4px 18px",
              borderRadius: "14px",
              boxShadow: "0 4px 20px rgba(40, 43, 74, 0.25)",
              display: "inline-flex",
              alignItems: "center",
              lineHeight: 1.2,
              border: "1px solid rgba(238, 235, 218, 0.2)",
            }}>
              <TextType
                text={["Attendance", "Extraction", "Document OCR"]}
                typingSpeed={60}
                deletingSpeed={35}
                pauseDuration={2400}
                loop={true}
                showCursor={true}
                cursorCharacter="|"
                style={{ color: "#EEEBDA" }}
              />
            </span>
          </h1>
          <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>
            Upload an attendance sheet or paste roll numbers. Review AI extractions before submitting.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => navigate("/faculty/attendance")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 18px",
              background: "white",
              border: "1px solid rgba(40, 43, 74, 0.15)",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#282B4A",
              cursor: "pointer",
              transition: "all 0.18s ease"
            }}
          >
            Mark Manually
          </button>
        </div>
      </div>

      {/* ── Success Screen ── */}
      {submitSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: "white",
            borderRadius: "24px",
            border: "1.5px solid rgba(40, 43, 74, 0.1)",
            padding: "48px 32px",
            textAlign: "center",
            maxWidth: "600px",
            margin: "40px auto",
            boxShadow: "0 10px 40px rgba(40, 43, 74, 0.08)"
          }}
        >
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#ecfdf5", border: "2px solid #a7f3d0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle2 size={36} color="#059669" />
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#282B4A", marginBottom: "8px" }}>
            Attendance Successfully Recorded!
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280", maxWidth: "420px", margin: "0 auto 28px", lineHeight: 1.6 }}>
            {submitSuccess.total} students marked present for <strong style={{ color: "#282B4A" }}>{submitSuccess.subjectName}</strong> on {submitSuccess.date}.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/faculty/attendance")}
              style={{
                padding: "11px 24px",
                background: "#282B4A",
                color: "#EEEBDA",
                border: "none",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(40, 43, 74, 0.25)"
              }}
            >
              View Attendance Table <ArrowRight size={16} />
            </button>
            <button
              onClick={() => {
                setSubmitSuccess(null);
                setAnalysisResult(null);
                setSelectedFile(null);
                setPastedText("");
              }}
              style={{
                padding: "11px 22px",
                background: "#f4f4f5",
                color: "#282B4A",
                border: "1px solid rgba(40, 43, 74, 0.1)",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <RotateCcw size={15} /> Process Another Sheet
            </button>
          </div>
        </motion.div>
      ) : analysisResult ? (

        /* ── Review Interface Screen ── */
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          
          {/* Top Session Header Banner */}
          <div style={{
            background: "white",
            borderRadius: "20px",
            border: "1.5px solid rgba(40, 43, 74, 0.1)",
            padding: "22px 26px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            boxShadow: "0 2px 10px rgba(40, 43, 74, 0.04)"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6b7280" }}>
                  AI Review Proposal
                </span>
                <span style={{ background: "rgba(40, 43, 74, 0.08)", color: "#282B4A", padding: "3px 10px", borderRadius: "10px", fontSize: "11px", fontWeight: 700 }}>
                  Subject #{analysisResult.subject_id}
                </span>
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#282B4A", margin: 0 }}>
                {analysisResult.subject_name}
              </h2>
              <div style={{ fontSize: "13px", color: "#52525b", marginTop: "4px", display: "flex", alignItems: "center", gap: "16px" }}>
                <span>📅 Date: <strong>{new Date(analysisResult.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</strong></span>
                <span>•</span>
                <span>📋 Enrolled Pool: <strong>{analysisResult.available_students.length} students</strong></span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() => setAnalysisResult(null)}
                style={{
                  padding: "9px 18px",
                  background: "#f4f4f5",
                  border: "1px solid rgba(40, 43, 74, 0.1)",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#282B4A",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <RotateCcw size={15} /> Re-upload
              </button>
            </div>
          </div>

          {/* Existing Attendance Warning Banner if already marked */}
          {analysisResult.existing_attendance?.already_exists && (
            <div style={{
              background: "#fffbeb",
              border: "1.5px solid #fde68a",
              borderRadius: "16px",
              padding: "16px 20px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "14px"
            }}>
              <AlertTriangle size={22} color="#d97706" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#92400e" }}>
                  Existing Attendance Records Found
                </div>
                <div style={{ fontSize: "12px", color: "#b45309", marginTop: "2px" }}>
                  {analysisResult.existing_attendance.warning_message}
                </div>
              </div>
            </div>
          )}

          {/* Summary KPI Cards Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
            
            {/* Total Detected */}
            <div style={{ background: "white", border: "1.5px solid rgba(40, 43, 74, 0.08)", borderRadius: "18px", padding: "18px 20px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>Total Detected</div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#282B4A", marginTop: "4px" }}>
                {analysisResult.summary.total_detected}
              </div>
              <div style={{ fontSize: "11px", color: "#71717a", marginTop: "2px" }}>Identified student tokens</div>
            </div>

            {/* Auto Matched */}
            <div style={{ background: "white", border: "1.5px solid rgba(16, 185, 129, 0.2)", borderRadius: "18px", padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#059669", textTransform: "uppercase" }}>Auto Matched</span>
                <CheckCircle2 size={16} color="#059669" />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#059669", marginTop: "4px" }}>
                {analysisResult.summary.total_matched}
              </div>
              <div style={{ fontSize: "11px", color: "#71717a", marginTop: "2px" }}>≥90% High Confidence</div>
            </div>

            {/* Review Required */}
            <div style={{ background: "white", border: "1.5px solid rgba(245, 158, 11, 0.25)", borderRadius: "18px", padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#d97706", textTransform: "uppercase" }}>Review Required</span>
                <AlertTriangle size={16} color="#d97706" />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#d97706", marginTop: "4px" }}>
                {analysisResult.summary.total_review}
              </div>
              <div style={{ fontSize: "11px", color: "#71717a", marginTop: "2px" }}>OCR correction / Ambiguous</div>
            </div>

            {/* Not Found */}
            <div style={{ background: "white", border: "1.5px solid rgba(239, 68, 68, 0.2)", borderRadius: "18px", padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#dc2626", textTransform: "uppercase" }}>Not Found</span>
                <HelpCircle size={16} color="#dc2626" />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#dc2626", marginTop: "4px" }}>
                {analysisResult.summary.total_unmatched}
              </div>
              <div style={{ fontSize: "11px", color: "#71717a", marginTop: "2px" }}>Unregistered numbers</div>
            </div>

          </div>

          {/* Table Controls (Search & Filter Tabs) */}
          <div style={{
            background: "white",
            borderRadius: "20px",
            border: "1.5px solid rgba(40, 43, 74, 0.08)",
            padding: "20px",
            marginBottom: "20px"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
              
              {/* Filter Tabs */}
              <div style={{ display: "flex", background: "#f4f4f5", borderRadius: "12px", padding: "4px", gap: "4px" }}>
                {(["ALL", "AUTO_MATCHED", "REVIEW_REQUIRED", "NOT_FOUND"] as const).map(tab => {
                  const isActive = activeFilter === tab;
                  const labelMap = {
                    ALL: `All (${analysisResult.matches.length})`,
                    AUTO_MATCHED: `Auto Matched (${analysisResult.summary.total_matched})`,
                    REVIEW_REQUIRED: `Review Required (${analysisResult.summary.total_review})`,
                    NOT_FOUND: `Not Found (${analysisResult.summary.total_unmatched})`
                  };
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveFilter(tab)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "8px",
                        border: "none",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        background: isActive ? "#282B4A" : "transparent",
                        color: isActive ? "#EEEBDA" : "#52525b",
                        transition: "all 0.15s ease"
                      }}
                    >
                      {labelMap[tab]}
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div style={{ position: "relative", minWidth: "240px" }}>
                <Search size={16} color="#9ca3af" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  placeholder="Filter by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 14px 8px 36px",
                    borderRadius: "10px",
                    border: "1px solid rgba(40, 43, 74, 0.12)",
                    fontSize: "12px",
                    outline: "none",
                    fontFamily: "Space Grotesk, sans-serif"
                  }}
                />
              </div>

            </div>

            {/* Attendance Review Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1.5px solid rgba(40, 43, 74, 0.08)", fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>
                    <th style={{ padding: "12px 14px" }}>Extracted Token</th>
                    <th style={{ padding: "12px 14px" }}>Matched Student</th>
                    <th style={{ padding: "12px 14px" }}>AI Confidence</th>
                    <th style={{ padding: "12px 14px" }}>Status</th>
                    <th style={{ padding: "12px 14px" }}>Attendance</th>
                    <th style={{ padding: "12px 14px", textAlign: "right" }}>Action / Resolve</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMatches.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "36px 0", color: "#9ca3af", fontSize: "13px" }}>
                        No records match the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredMatches.map((m) => {
                      const isAuto = m.status === "AUTO_MATCHED";
                      const isReview = m.status === "REVIEW_REQUIRED";
                      const isNotFound = m.status === "NOT_FOUND";
                      const isConfirmed = m.status === "CONFIRMED";
                      const isRejected = m.status === "REJECTED";

                      return (
                        <tr key={m.id} style={{ borderBottom: "1px solid #f4f4f5", fontSize: "13px", transition: "background 0.15s" }}>
                          
                          {/* Extracted Token */}
                          <td style={{ padding: "14px" }}>
                            <div style={{ fontWeight: 700, color: "#282B4A" }}>{m.enrollment_number}</div>
                            {m.source_text && (
                              <div style={{ fontSize: "10px", color: "#9ca3af", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {m.source_text}
                              </div>
                            )}
                          </td>

                          {/* Matched Student */}
                          <td style={{ padding: "14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: m.student_id ? "rgba(40, 43, 74, 0.08)" : "#fee2e2",
                                color: m.student_id ? "#282B4A" : "#ef4444",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: 700,
                                flexShrink: 0
                              }}>
                                {m.student_name ? m.student_name.charAt(0) : "?"}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: m.student_id ? "#111827" : "#ef4444" }}>
                                  {m.student_name}
                                </div>
                                <div style={{ fontSize: "11px", color: "#6b7280" }}>
                                  {m.student_enrollment || "No Student Linked"}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Confidence */}
                          <td style={{ padding: "14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ width: "45px", height: "5px", background: "#f3f4f6", borderRadius: "3px", overflow: "hidden" }}>
                                <div style={{
                                  width: `${Math.round(m.confidence * 100)}%`,
                                  height: "100%",
                                  background: m.confidence >= 0.90 ? "#10b981" : m.confidence >= 0.70 ? "#f59e0b" : "#ef4444",
                                  borderRadius: "3px"
                                }} />
                              </div>
                              <span style={{ fontSize: "12px", fontWeight: 700, color: "#282B4A" }}>
                                {Math.round(m.confidence * 100)}%
                              </span>
                            </div>
                            <div style={{ fontSize: "10px", color: "#71717a", marginTop: "2px" }}>
                              {m.match_reason}
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td style={{ padding: "14px" }}>
                            {isAuto && (
                              <span style={{ background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0", padding: "3px 9px", borderRadius: "8px", fontSize: "11px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <Check size={12} /> Auto Matched
                              </span>
                            )}
                            {isConfirmed && (
                              <span style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "3px 9px", borderRadius: "8px", fontSize: "11px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <ShieldCheck size={12} /> Verified
                              </span>
                            )}
                            {isReview && (
                              <span style={{ background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a", padding: "3px 9px", borderRadius: "8px", fontSize: "11px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <AlertTriangle size={12} /> Review Req.
                              </span>
                            )}
                            {isNotFound && (
                              <span style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "3px 9px", borderRadius: "8px", fontSize: "11px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <HelpCircle size={12} /> Not Found
                              </span>
                            )}
                            {isRejected && (
                              <span style={{ background: "#f4f4f5", color: "#71717a", border: "1px solid #e4e4e7", padding: "3px 9px", borderRadius: "8px", fontSize: "11px", fontWeight: 600 }}>
                                Dismissed
                              </span>
                            )}
                          </td>

                          {/* Present / Absent Toggle */}
                          <td style={{ padding: "14px" }}>
                            <button
                              disabled={!m.student_id}
                              onClick={() => handleTogglePresent(m.id)}
                              style={{
                                padding: "4px 12px",
                                borderRadius: "8px",
                                border: m.marked_present && m.student_id ? "1px solid #a7f3d0" : "1px solid #e5e7eb",
                                background: m.marked_present && m.student_id ? "#ecfdf5" : "#f9fafb",
                                color: m.marked_present && m.student_id ? "#059669" : "#9ca3af",
                                fontSize: "11px",
                                fontWeight: 700,
                                cursor: m.student_id ? "pointer" : "not-allowed",
                                opacity: m.student_id ? 1 : 0.5,
                                transition: "all 0.15s ease"
                              }}
                            >
                              {m.marked_present && m.student_id ? "✓ Present" : "— Absent"}
                            </button>
                          </td>

                          {/* Resolve Actions */}
                          <td style={{ padding: "14px", textAlign: "right", position: "relative" }}>
                            {(!isAuto || !m.student_id) ? (
                              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <div style={{ position: "relative" }}>
                                  <button
                                    onClick={() => setOpenDropdownId(openDropdownId === m.id ? null : m.id)}
                                    style={{
                                      padding: "5px 10px",
                                      background: "white",
                                      border: "1px solid rgba(40, 43, 74, 0.2)",
                                      color: "#282B4A",
                                      borderRadius: "8px",
                                      fontSize: "11px",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px"
                                    }}
                                  >
                                    Assign Student <ChevronDown size={12} />
                                  </button>

                                  {/* Student Selection Dropdown Popover */}
                                  {openDropdownId === m.id && (
                                    <div style={{
                                      position: "absolute",
                                      right: 0,
                                      top: "100%",
                                      marginTop: "4px",
                                      zIndex: 100,
                                      background: "white",
                                      borderRadius: "14px",
                                      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                                      border: "1px solid rgba(40, 43, 74, 0.12)",
                                      width: "260px",
                                      maxHeight: "220px",
                                      overflowY: "auto",
                                      padding: "6px"
                                    }}>
                                      <div style={{ padding: "6px 8px", fontSize: "10px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>
                                        Pick from Subject Roster:
                                      </div>
                                      {analysisResult.available_students.map(stu => (
                                        <div
                                          key={stu.id}
                                          onClick={() => handleAssignStudent(m.id, stu.id)}
                                          style={{
                                            padding: "8px 10px",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            fontSize: "12px",
                                            transition: "background 0.1s"
                                          }}
                                          onMouseEnter={(e) => e.currentTarget.style.background = "#f4f4f5"}
                                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                        >
                                          <span style={{ fontWeight: 600, color: "#111827" }}>{stu.name}</span>
                                          <span style={{ fontSize: "11px", color: "#6b7280" }}>{stu.enrollment_number}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {m.status !== "REJECTED" && (
                                  <button
                                    onClick={() => handleDismissMatch(m.id)}
                                    title="Dismiss this token"
                                    style={{
                                      padding: "5px 8px",
                                      background: "transparent",
                                      border: "1px solid #e5e7eb",
                                      borderRadius: "8px",
                                      color: "#9ca3af",
                                      cursor: "pointer"
                                    }}
                                  >
                                    <X size={12} />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 600 }}>Ready</span>
                            )}
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* Bottom Confirmation Bar */}
          <div style={{
            background: "white",
            borderRadius: "20px",
            border: "1.5px solid rgba(40, 43, 74, 0.1)",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            boxShadow: "0 4px 20px rgba(40, 43, 74, 0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>Present to Mark: </span>
                <strong style={{ fontSize: "16px", color: "#059669" }}>{presentCount}</strong>
              </div>
              <div style={{ height: "20px", width: "1px", background: "#e5e7eb" }} />
              <div>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>Absent / Unmarked: </span>
                <strong style={{ fontSize: "16px", color: "#6b7280" }}>{unmarkedCount}</strong>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                onClick={() => setAnalysisResult(null)}
                style={{
                  padding: "10px 20px",
                  background: "#f4f4f5",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#4b5563",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                disabled={presentCount === 0}
                onClick={() => setShowConfirmModal(true)}
                style={{
                  padding: "10px 26px",
                  background: "#282B4A",
                  color: "#EEEBDA",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: presentCount === 0 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 16px rgba(40, 43, 74, 0.25)",
                  opacity: presentCount === 0 ? 0.5 : 1
                }}
              >
                Confirm Attendance <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </motion.div>
      ) : (

        /* ── Upload & Setup Interface Screen ── */
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px", alignItems: "start" }}>
          
          {/* Left Column: Upload Area */}
          <div style={{
            background: "white",
            borderRadius: "24px",
            border: "1.5px solid rgba(40, 43, 74, 0.08)",
            padding: "28px",
            boxShadow: "0 2px 12px rgba(40, 43, 74, 0.03)"
          }}>
            
            {/* Input Mode Tabs */}
            <div style={{ display: "flex", background: "#f4f4f5", borderRadius: "12px", padding: "4px", marginBottom: "24px" }}>
              <button
                onClick={() => setInputMode("file")}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: inputMode === "file" ? "#282B4A" : "transparent",
                  color: inputMode === "file" ? "#EEEBDA" : "#52525b",
                  transition: "all 0.18s ease"
                }}
              >
                📁 Upload Document / Image
              </button>
              <button
                onClick={() => setInputMode("text")}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: inputMode === "text" ? "#282B4A" : "transparent",
                  color: inputMode === "text" ? "#EEEBDA" : "#52525b",
                  transition: "all 0.18s ease"
                }}
              >
                📝 Paste Raw Text
              </button>
            </div>

            {inputMode === "file" ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
                  accept=".pdf,.png,.jpg,.jpeg,.txt"
                  style={{ display: "none" }}
                />

                {selectedFile ? (
                  <div style={{
                    border: "2px solid rgba(40, 43, 74, 0.2)",
                    borderRadius: "18px",
                    padding: "24px",
                    background: "rgba(40, 43, 74, 0.02)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(40, 43, 74, 0.08)", color: "#282B4A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FileText size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#282B4A" }}>{selectedFile.name}</div>
                        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                          {(selectedFile.size / 1024).toFixed(1)} KB · Ready to analyze
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      style={{
                        padding: "6px 12px",
                        background: "#fee2e2",
                        color: "#dc2626",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: isDragging ? "2px dashed #282B4A" : "2px dashed rgba(40, 43, 74, 0.2)",
                      borderRadius: "18px",
                      padding: "48px 24px",
                      textAlign: "center",
                      cursor: "pointer",
                      background: isDragging ? "rgba(40, 43, 74, 0.04)" : "#fafafa",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(40, 43, 74, 0.08)", color: "#282B4A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                      <Upload size={24} />
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#282B4A" }}>
                      Drag & Drop Attendance Document
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                      Supports PDF, PNG, JPG, JPEG, and scanned sheets up to 10 MB
                    </div>
                    <button
                      type="button"
                      style={{
                        marginTop: "16px",
                        padding: "8px 20px",
                        background: "#282B4A",
                        color: "#EEEBDA",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      Browse Files
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <textarea
                  rows={8}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste student enrollment numbers or roster text here...&#10;&#10;Example:&#10;24CSE001&#10;24CSE002&#10;CS629&#10;STU-0001"
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "14px",
                    border: "1.5px solid rgba(40, 43, 74, 0.15)",
                    fontSize: "13px",
                    fontFamily: "monospace",
                    outline: "none",
                    resize: "vertical"
                  }}
                />
              </div>
            )}

            {/* Processing Loading Animation */}
            {isProcessing && (
              <div style={{ marginTop: "24px", padding: "20px", background: "rgba(40, 43, 74, 0.03)", borderRadius: "16px", border: "1px solid rgba(40, 43, 74, 0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <Sparkles size={18} color="#282B4A" className="animate-spin" />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#282B4A" }}>AI Attendance Agent is processing...</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", color: processingStep >= 1 ? "#059669" : "#9ca3af" }}>
                    {processingStep >= 1 ? <Check size={14} color="#059669" /> : <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: "2px solid #d1d5db" }} />}
                    <span>File uploaded and validated</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", color: processingStep >= 2 ? "#059669" : processingStep === 1 ? "#282B4A" : "#9ca3af" }}>
                    {processingStep >= 2 ? <Check size={14} color="#059669" /> : processingStep === 1 ? <Loader2 size={14} className="animate-spin" color="#282B4A" /> : <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: "2px solid #d1d5db" }} />}
                    <span>Reading document content & OCR</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", color: processingStep >= 3 ? "#059669" : processingStep === 2 ? "#282B4A" : "#9ca3af" }}>
                    {processingStep >= 3 ? <Check size={14} color="#059669" /> : processingStep === 2 ? <Loader2 size={14} className="animate-spin" color="#282B4A" /> : <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: "2px solid #d1d5db" }} />}
                    <span>Extracting candidate enrollment numbers</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", color: processingStep >= 4 ? "#059669" : processingStep === 3 ? "#282B4A" : "#9ca3af" }}>
                    {processingStep >= 4 ? <Check size={14} color="#059669" /> : processingStep === 3 ? <Loader2 size={14} className="animate-spin" color="#282B4A" /> : <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: "2px solid #d1d5db" }} />}
                    <span>Matching against enrolled students database</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Configuration & Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div style={{
              background: "white",
              borderRadius: "24px",
              border: "1.5px solid rgba(40, 43, 74, 0.08)",
              padding: "24px",
              boxShadow: "0 2px 12px rgba(40, 43, 74, 0.03)"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#282B4A", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <BookOpen size={18} color="#282B4A" /> Class Selection
              </h3>

              {/* Subject Selection */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
                  Assigned Subject <span style={{ color: "#ef4444" }}>*</span>
                </label>
                {loadingSubjects ? (
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>Loading assigned subjects...</div>
                ) : (
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      border: "1.5px solid rgba(40, 43, 74, 0.15)",
                      fontSize: "13px",
                      outline: "none",
                      background: "white",
                      fontFamily: "Space Grotesk, sans-serif",
                      fontWeight: 600,
                      color: "#282B4A"
                    }}
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code}) — {s.batch}
                      </option>
                    ))}
                  </select>
                )}
                <div style={{ fontSize: "11px", color: "#71717a", marginTop: "4px" }}>
                  * Only subjects you are formally assigned to can be selected.
                </div>
              </div>

              {/* Date Selection */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
                  Attendance Date <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      border: "1.5px solid rgba(40, 43, 74, 0.15)",
                      fontSize: "13px",
                      outline: "none",
                      fontFamily: "Space Grotesk, sans-serif",
                      color: "#282B4A",
                      fontWeight: 600
                    }}
                  />
                </div>
              </div>

              {/* Analyze Button */}
              <button
                disabled={isProcessing || !selectedSubjectId || (inputMode === "file" && !selectedFile) || (inputMode === "text" && !pastedText.trim())}
                onClick={handleAnalyze}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: "#282B4A",
                  color: "#EEEBDA",
                  border: "none",
                  borderRadius: "14px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  boxShadow: "0 6px 20px rgba(40, 43, 74, 0.25)",
                  opacity: (isProcessing || !selectedSubjectId || (inputMode === "file" && !selectedFile) || (inputMode === "text" && !pastedText.trim())) ? 0.6 : 1,
                  transition: "all 0.18s ease"
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Processing Sheet...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Analyze Attendance
                  </>
                )}
              </button>
            </div>

            {/* How It Works Explainer Card */}
            <div style={{
              background: "rgba(40, 43, 74, 0.03)",
              borderRadius: "20px",
              border: "1px solid rgba(40, 43, 74, 0.08)",
              padding: "20px"
            }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#282B4A", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={15} color="#282B4A" /> Safety & Accuracy Guarantee
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "11px", color: "#52525b", lineHeight: 1.6 }}>
                <li>AI produces a structured review proposal only.</li>
                <li>Ambiguous OCR entries are flagged for your manual review.</li>
                <li>No attendance record is committed without your final confirmation.</li>
                <li>Duplicate records for the same lecture are automatically guarded.</li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* ── Confirmation Modal Dialog ── */}
      <AnimatePresence>
        {showConfirmModal && analysisResult && (
          <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px"
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: "white",
                borderRadius: "24px",
                width: "100%",
                maxWidth: "480px",
                padding: "28px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
              }}
            >
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(40, 43, 74, 0.08)", color: "#282B4A", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <UserCheck size={24} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#282B4A", margin: "0 0 8px 0" }}>
                Confirm Attendance Submission
              </h3>
              <p style={{ fontSize: "13px", color: "#52525b", lineHeight: 1.6, margin: "0 0 20px 0" }}>
                You are about to mark <strong style={{ color: "#059669" }}>{presentCount} students present</strong> for <strong>{analysisResult.subject_name}</strong> on {analysisResult.date}.
              </p>

              <div style={{ background: "#f9fafb", borderRadius: "14px", padding: "14px", fontSize: "12px", color: "#4b5563", marginBottom: "24px" }}>
                <div>• Students present: <strong>{presentCount}</strong></div>
                <div>• Unmarked / Absent: <strong>{unmarkedCount}</strong></div>
                <div>• Attendance Mode: <strong>AI Document Extraction</strong></div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  disabled={isSubmitting}
                  onClick={() => setShowConfirmModal(false)}
                  style={{
                    padding: "9px 18px",
                    background: "#f4f4f5",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#4b5563",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={handleConfirmSubmission}
                  style={{
                    padding: "9px 24px",
                    background: "#282B4A",
                    color: "#EEEBDA",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={15} />}
                  Confirm & Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default AiAttendance;
