import React, { useState, useRef, useEffect } from 'react';
import {
  X, Send, History, Maximize2, MoreVertical,
  Paperclip, Sparkles, Mic, RefreshCw, Plus,
  Copy, ThumbsUp, ThumbsDown, RotateCcw, Check, Bot
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { useAuthStore } from '../store/authStore';
import AttendanceWidget from './AttendanceWidget';

export const RobotIcon: React.FC<{ className?: string; size?: number }> = ({ className = "w-full h-full", size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      {/* Head & Body Gradient */}
      <linearGradient id="robotBodyGrad" x1="50" y1="12" x2="50" y2="88" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      {/* Antenna Ball Gradient */}
      <radialGradient id="robotBallGrad" cx="38%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#BAE6FD" />
        <stop offset="55%" stopColor="#0EA5E9" />
        <stop offset="100%" stopColor="#0369A1" />
      </radialGradient>
      {/* Ear Left Gradient */}
      <linearGradient id="robotEarLeftGrad" x1="10" y1="42" x2="19" y2="68" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
      {/* Ear Right Gradient */}
      <linearGradient id="robotEarRightGrad" x1="81" y1="42" x2="90" y2="68" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
      {/* Face Screen Gradient */}
      <linearGradient id="robotScreenGrad" x1="50" y1="33" x2="50" y2="75" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#252F3F" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
    </defs>

    {/* Antenna Stem */}
    <rect x="47" y="19" width="6" height="9" rx="3" fill="#0284C7" />
    
    {/* Antenna Ball */}
    <circle cx="50" cy="14.5" r="7.5" fill="url(#robotBallGrad)" />

    {/* Left Ear */}
    <rect x="10" y="42" width="9" height="26" rx="4.5" fill="url(#robotEarLeftGrad)" />
    
    {/* Right Ear */}
    <rect x="81" y="42" width="9" height="26" rx="4.5" fill="url(#robotEarRightGrad)" />

    {/* Main Head Body */}
    <rect x="16" y="24" width="68" height="60" rx="22" fill="url(#robotBodyGrad)" />
    
    {/* Head Top Subtle Highlight */}
    <path d="M 28 27 Q 50 24 72 27" stroke="#BAE6FD" strokeWidth="2.2" strokeLinecap="round" opacity="0.65" />

    {/* Dark Inner Screen */}
    <rect x="23.5" y="33" width="53" height="42" rx="14" fill="url(#robotScreenGrad)" />

    {/* Eyes */}
    <ellipse cx="38" cy="50" rx="4.5" ry="5.5" fill="#FFFFFF" />
    <ellipse cx="62" cy="50" rx="4.5" ry="5.5" fill="#FFFFFF" />

    {/* Smile */}
    <path
      d="M 43 61.5 Q 50 67.5 57 61.5"
      stroke="#FFFFFF"
      strokeWidth="3.2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  widgetData?: any;
  time?: string;
}

const processBotResponse = (rawText: string): { text: string; widgetData?: any } => {
  const widgetRegex = /```widget\n([\s\S]*?)\n```/;
  const match = rawText.match(widgetRegex);

  if (match) {
    try {
      const widgetData = JSON.parse(match[1]);
      const cleanText = rawText.replace(widgetRegex, '').trim();
      return { text: cleanText, widgetData };
    } catch (e) {
      console.error("Failed to parse widget JSON", e);
    }
  }
  return { text: rawText };
};

const renderStructuredMessage = (rawText: string) => {
  if (!rawText) return null;

  const lines = rawText.split('\n');

  return (
    <div className="space-y-2 font-sans">
      {lines.map((line, idx) => {
        let clean = line.trim();
        if (!clean) return <div key={idx} className="h-1" />;

        // Strip any horizontal rule stars/dashes (e.g. *** or --- or * * *)
        clean = clean.replace(/\*\s*\*\s*\*/g, '').replace(/[\*\-]{3,}/g, '').trim();
        if (!clean) return null;

        // Check if line starts with bullet marker (* or -)
        let isBullet = false;
        let emojiPrefix = '🔹';

        if (/^[\*\-•]\s+/.test(clean)) {
          isBullet = true;
          const lower = clean.toLowerCase();
          if (lower.includes('present') || lower.includes('attended') || lower.includes('pass') || lower.includes('completed')) {
            emojiPrefix = '✅';
          } else if (lower.includes('absent') || lower.includes('missed') || lower.includes('fail') || lower.includes('pending')) {
            emojiPrefix = '❌';
          } else if (lower.includes('total') || lower.includes('summary') || lower.includes('score') || lower.includes('marks')) {
            emojiPrefix = '📊';
          } else if (lower.includes('important') || lower.includes('note') || lower.includes('notice')) {
            emojiPrefix = '📌';
          } else if (lower.includes('time') || lower.includes('schedule') || lower.includes('date') || lower.includes('day')) {
            emojiPrefix = '📅';
          } else {
            emojiPrefix = '➡️';
          }
          clean = clean.replace(/^[\*\-•]\s+/, '');
        }

        // If line already starts with an emoji, don't add duplicate emoji prefix
        if (isBullet && /^\p{Extended_Pictographic}/u.test(clean)) {
          emojiPrefix = '';
        }

        // Parse **bold text** into bold spans and remove any residual asterisks or hyphens
        const segments: React.ReactNode[] = [];
        const boldRegex = /\*\*(.*?)\*\*/g;
        let lastIdx = 0;
        let match: RegExpExecArray | null;

        while ((match = boldRegex.exec(clean)) !== null) {
          if (match.index > lastIdx) {
            const normal = clean.substring(lastIdx, match.index).replace(/[\*]/g, '');
            if (normal) segments.push(normal);
          }
          const boldPart = match[1].replace(/[\*]/g, '');
          segments.push(
            <strong key={`b-${idx}-${lastIdx}`} className="font-semibold text-slate-900">
              {boldPart}
            </strong>
          );
          lastIdx = boldRegex.lastIndex;
        }

        if (lastIdx < clean.length) {
          const remaining = clean.substring(lastIdx).replace(/[\*]/g, '');
          if (remaining) segments.push(remaining);
        }

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2.5 py-0.5 pl-0.5">
              {emojiPrefix && <span className="text-base leading-tight flex-shrink-0">{emojiPrefix}</span>}
              <div className="text-slate-800 leading-relaxed flex-1">{segments}</div>
            </div>
          );
        }

        return (
          <p key={idx} className="text-slate-800 leading-relaxed">
            {segments}
          </p>
        );
      })}
    </div>
  );
};

const ChatWidget: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi ${user?.full_name?.split(' ')[0] || 'Harsh'}! 👋\nHow can I help you today?`,
      isBot: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputValue(prev => prev + (prev ? '\n' : '') + `[Attachment: ${file.name}] `);
    }
  };

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    if (isRecording) return;

    setIsRecording(true);
    // Snapshot the current input text before the mic session starts
    const textBeforeMic = inputRef.current?.value || '';

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true; // allow continuous within the single session
    recognition.interimResults = true; // allow interim results for live feedback

    recognition.onresult = (event: any) => {
      let sessionTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        sessionTranscript += event.results[i][0].transcript;
      }

      const prefix = textBeforeMic + (textBeforeMic && !textBeforeMic.endsWith(' ') && sessionTranscript ? ' ' : '');
      setInputValue(prefix + sessionTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear chat history?")) {
      setMessages([{
        id: '1',
        text: `Hi ${user?.full_name?.split(' ')[0] || 'Harsh'}! 👋\nHow can I help you today?`,
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [likedMessages, setLikedMessages] = useState<Record<string, 'like' | 'dislike'>>({});

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const toggleLike = (id: string) => {
    setLikedMessages(prev => ({
      ...prev,
      [id]: prev[id] === 'like' ? undefined as any : 'like'
    }));
  };

  const toggleDislike = (id: string) => {
    setLikedMessages(prev => ({
      ...prev,
      [id]: prev[id] === 'dislike' ? undefined as any : 'dislike'
    }));
  };

  const handleRegenerateMessage = (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex > 0) {
      const previousUserMessage = messages[messageIndex - 1];
      if (!previousUserMessage.isBot) {
        handleSend(previousUserMessage.text);
      }
    }
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || inputValue;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: textToSend.trim(),
      isBot: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const token = useAuthStore.getState().accessToken;

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/chatbot/chat`,
        { query: userMsg.text },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
        }
      );

      const parsed = processBotResponse(response.data.response);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        isBot: true,
        text: parsed.text,
        widgetData: parsed.widgetData,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error: any) {
      console.error('Chat API Error:', error);
      let errorText = "Sorry, I couldn't process that request. Please try again later.";

      if (error.response?.status === 401) {
        errorText = "Please log in to use the AI Assistant for personalized queries.";
      }

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedPrompts = [
    'Show my overall attendance',
    'Today\'s timetable',
    'My pending assignments',
    'Latest notices',
    'My exam schedule',
    'Help me write leave application'
  ];

  const hasMessages = messages.length > 1;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="mb-6 flex flex-col origin-bottom-right overflow-hidden"
            style={{
              width: isMaximized ? 'calc(100vw - 48px)' : '480px',
              height: isMaximized ? 'calc(100vh - 48px)' : '700px',
              maxHeight: isMaximized ? 'calc(100vh - 48px)' : '85vh',
              borderRadius: isMaximized ? '20px' : '28px',
              background: 'linear-gradient(180deg, #EDE9FE 0%, #F5F3FF 40%, #FFFFFF 100%)',
              boxShadow: '0 30px 70px rgba(88, 28, 235, 0.18), 0 10px 28px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(139, 92, 246, 0.12)'
            }}
          >
            {/* ========== HEADER ========== */}
            <div
              className="flex items-center justify-between flex-shrink-0"
              style={{
                height: '84px',
                padding: '0 20px',
                background: 'rgba(255, 255, 255, 0.55)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(139, 92, 246, 0.12)'
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div
                    className="flex items-center justify-center overflow-hidden p-1.5"
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '18px',
                      background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                      boxShadow: '0 6px 16px rgba(2, 132, 199, 0.35)'
                    }}
                  >
                    <RobotIcon className="w-full h-full" />
                  </div>
                  <div
                    className="absolute"
                    style={{
                      bottom: '-2px',
                      right: '-2px',
                      width: '14px',
                      height: '14px',
                      backgroundColor: '#22c55e',
                      border: '3px solid #F5F3FF',
                      borderRadius: '50%'
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      className="font-extrabold text-slate-900"
                      style={{
                        fontSize: '18px',
                        lineHeight: '1.2',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      ERP Assistant
                    </h3>
                    <span
                      className="font-bold px-2 py-0.5 rounded-full"
                      style={{
                        fontSize: '10px',
                        backgroundColor: '#EDE4FF',
                        color: '#7c3aed',
                        letterSpacing: '0.02em'
                      }}
                    >
                      v1.0
                    </span>
                  </div>
                  <p
                    className="text-slate-500 font-medium"
                    style={{
                      fontSize: '13px',
                      marginTop: '2px',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    AI Assistant for Student ERP
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleClearHistory}
                  className="flex items-center justify-center text-slate-500 hover:text-purple-700 hover:bg-white/70 transition-all rounded-full"
                  style={{ width: '38px', height: '38px' }}
                  title="History"
                >
                  <History size={18} strokeWidth={2} />
                </button>
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="flex items-center justify-center text-slate-500 hover:text-purple-700 hover:bg-white/70 transition-all rounded-full"
                  style={{ width: '38px', height: '38px' }}
                  title={isMaximized ? "Minimize" : "Maximize"}
                >
                  <Maximize2 size={17} strokeWidth={2} />
                </button>
                <button
                  onClick={() => alert("Settings coming soon!")}
                  className="flex items-center justify-center text-slate-500 hover:text-purple-700 hover:bg-white/70 transition-all rounded-full"
                  style={{ width: '38px', height: '38px' }}
                  title="Settings"
                >
                  <MoreVertical size={18} strokeWidth={2} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-white/70 transition-all rounded-full ml-0.5"
                  style={{ width: '38px', height: '38px' }}
                  title="Close"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* ========== CHAT AREA ========== */}
            <div
              className="flex-1 overflow-y-auto relative"
              style={{ padding: '20px 20px 8px 20px' }}
            >
              {hasMessages && (
                <div className="flex justify-center mb-5">
                  <span
                    className="px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-slate-500 font-semibold border border-purple-100"
                    style={{ fontSize: '11.5px' }}
                  >
                    Today
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {messages.map((msg, index) => {
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                      className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                      onMouseEnter={() => msg.isBot && setHoveredMessageId(msg.id)}
                      onMouseLeave={() => msg.isBot && setHoveredMessageId(null)}
                    >
                      <div
                        className="flex items-start gap-2.5"
                        style={{ maxWidth: msg.isBot ? '80%' : '78%' }}
                      >
                        {msg.isBot && (
                          <div className="relative flex-shrink-0">
                            <div
                              className="flex items-center justify-center overflow-hidden p-1"
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '13px',
                                background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                                boxShadow: '0 3px 10px rgba(2, 132, 199, 0.3)'
                              }}
                            >
                              <RobotIcon className="w-full h-full" />
                            </div>
                            <div
                              className="absolute"
                              style={{
                                bottom: '-1px',
                                right: '-1px',
                                width: '10px',
                                height: '10px',
                                backgroundColor: '#22c55e',
                                border: '2px solid #F5F3FF',
                                borderRadius: '50%'
                              }}
                            />
                          </div>
                        )}
                        <div className="flex flex-col gap-1.5 w-full">
                          {msg.text && (
                            <div
                              className={`relative ${msg.isBot
                                ? 'bg-white text-slate-800'
                                : 'text-white'
                                }`}
                              style={{
                                padding: '14px 16px',
                                borderRadius: msg.isBot ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                                fontSize: '14.5px',
                                lineHeight: '1.55',
                                letterSpacing: '-0.01em',
                                background: msg.isBot
                                  ? '#FFFFFF'
                                  : 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                                boxShadow: msg.isBot
                                  ? '0 2px 10px rgba(88, 28, 135, 0.08)'
                                  : '0 4px 14px rgba(124, 58, 237, 0.35)',
                                border: msg.isBot ? '1px solid rgba(139, 92, 246, 0.08)' : 'none',
                                wordBreak: 'break-word'
                              }}
                            >
                              {msg.isBot ? renderStructuredMessage(msg.text) : msg.text}
                              <div
                                className={`flex items-center gap-1 mt-1.5 ${msg.isBot ? 'text-slate-400' : 'text-purple-200 justify-end'
                                  }`}
                                style={{
                                  fontSize: '10.5px',
                                  fontWeight: 500
                                }}
                              >
                                {msg.time}
                                {!msg.isBot && (
                                  <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="9 11 12 14 22 4" />
                                    <polyline points="5 11 8 14 18 4" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          )}
                          {msg.widgetData && msg.widgetData.type === 'attendance_card' && (
                            <AttendanceWidget data={msg.widgetData.data} />
                          )}
                          {msg.isBot && (
                            <div className="flex items-center gap-1 pl-1">
                              <div
                                className="flex items-center gap-0.5 bg-white/90 backdrop-blur-sm rounded-lg border border-purple-100 p-0.5"
                                style={{ boxShadow: '0 2px 6px rgba(88, 28, 135, 0.06)' }}
                              >
                                <button
                                  onClick={() => handleCopyMessage(msg.id, msg.text)}
                                  className="flex items-center justify-center text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-all rounded-md"
                                  style={{ width: '26px', height: '26px' }}
                                  title="Copy"
                                >
                                  {copiedMessageId === msg.id ? (
                                    <Check size={12} className="text-green-600" />
                                  ) : (
                                    <Copy size={12} strokeWidth={2} />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleRegenerateMessage(msg.id)}
                                  className="flex items-center justify-center text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-all rounded-md"
                                  style={{ width: '26px', height: '26px' }}
                                  title="Regenerate"
                                >
                                  <RotateCcw size={12} strokeWidth={2} />
                                </button>
                                <button
                                  onClick={() => toggleLike(msg.id)}
                                  className={`flex items-center justify-center transition-all rounded-md ${likedMessages[msg.id] === 'like'
                                    ? 'text-green-600 bg-green-50'
                                    : 'text-slate-500 hover:text-green-600 hover:bg-green-50'
                                    }`}
                                  style={{ width: '26px', height: '26px' }}
                                  title="Like"
                                >
                                  <ThumbsUp size={12} strokeWidth={2} />
                                </button>
                                <button
                                  onClick={() => toggleDislike(msg.id)}
                                  className={`flex items-center justify-center transition-all rounded-md ${likedMessages[msg.id] === 'dislike'
                                    ? 'text-red-600 bg-red-50'
                                    : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                                    }`}
                                  style={{ width: '26px', height: '26px' }}
                                  title="Dislike"
                                >
                                  <ThumbsDown size={12} strokeWidth={2} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2.5"
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className="flex items-center justify-center p-1"
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '13px',
                          background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                          boxShadow: '0 3px 10px rgba(2, 132, 199, 0.3)'
                        }}
                      >
                        <RobotIcon className="w-full h-full" />
                      </div>
                      <div
                        className="absolute"
                        style={{
                          bottom: '-1px',
                          right: '-1px',
                          width: '10px',
                          height: '10px',
                          backgroundColor: '#22c55e',
                          border: '2px solid #F5F3FF',
                          borderRadius: '50%'
                        }}
                      />
                    </div>
                    <div
                      className="bg-white flex items-center justify-center"
                      style={{
                        padding: '14px 20px',
                        borderRadius: '18px 18px 18px 4px',
                        boxShadow: '0 2px 10px rgba(88, 28, 135, 0.08)',
                        border: '1px solid rgba(139, 92, 246, 0.08)'
                      }}
                    >
                      <div className="flex gap-1.5">
                        <div
                          className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                          style={{ animationDelay: '0ms', animationDuration: '1s' }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                          style={{ animationDelay: '150ms', animationDuration: '1s' }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                          style={{ animationDelay: '300ms', animationDuration: '1s' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>

            {/* ========== SUGGESTED PROMPTS ========== */}
            <div
              className="flex-shrink-0"
              style={{
                padding: '14px 20px 0 20px',
                borderTop: '1px solid rgba(139, 92, 246, 0.10)'
              }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <span
                  className="font-bold text-slate-700"
                  style={{ fontSize: '12.5px' }}
                >
                  Suggested for you
                </span>
                <button
                  onClick={() => setMessages(prev => [...prev])}
                  className="flex items-center gap-1 text-purple-600 hover:text-purple-800 font-semibold transition-colors"
                  style={{ fontSize: '12px' }}
                  title="Refresh suggestions"
                >
                  <RefreshCw size={12} strokeWidth={2.5} />
                  Refresh
                </button>
              </div>
              <div className="flex flex-wrap gap-2" style={{ paddingBottom: '14px' }}>
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                    className="bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-800 font-semibold border border-purple-100 hover:border-purple-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      fontSize: '12.5px',
                      padding: '9px 14px',
                      borderRadius: '999px',
                      boxShadow: '0 1px 4px rgba(88, 28, 135, 0.05)'
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* ========== INPUT AREA ========== */}
            <div
              className="flex flex-col gap-2.5 flex-shrink-0"
              style={{
                padding: '0 20px 18px 20px',
                background: 'transparent'
              }}
            >
              <div
                className="relative bg-white border border-purple-100 focus-within:border-purple-300 transition-all"
                style={{
                  borderRadius: '22px',
                  boxShadow: '0 4px 16px rgba(88, 28, 135, 0.08)'
                }}
              >
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  disabled={isLoading}
                  className="w-full bg-transparent border-none resize-none text-slate-800 placeholder:text-slate-400 font-medium"
                  style={{
                    padding: '14px 16px 52px 16px',
                    fontSize: '14.5px',
                    lineHeight: '1.5',
                    outline: 'none',
                    maxHeight: '140px',
                    minHeight: '64px'
                  }}
                  rows={1}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 flex items-center justify-between"
                  style={{ padding: '10px 12px' }}
                >
                  <div className="flex items-center gap-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-all rounded-full"
                      style={{ width: '34px', height: '34px' }}
                      title="Attach file"
                    >
                      <Plus size={17} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-all rounded-full"
                      style={{ width: '34px', height: '34px' }}
                      title="Paperclip"
                    >
                      <Paperclip size={16} strokeWidth={2} />
                    </button>
                    <button
                      className="flex items-center justify-center text-purple-500 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all rounded-full"
                      style={{ width: '34px', height: '34px' }}
                      title="AI features"
                    >
                      <Sparkles size={16} strokeWidth={2} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleMicClick}
                      className={`flex items-center justify-center border transition-all rounded-full ${isRecording ? 'text-red-500 bg-red-50 border-red-200 animate-pulse' : 'text-slate-500 border-slate-200 hover:text-purple-700 hover:bg-purple-50'}`}
                      style={{ width: '38px', height: '38px' }}
                      title="Voice input"
                    >
                      <Mic size={17} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => handleSend()}
                      disabled={!inputValue.trim() || isLoading}
                      className="flex items-center justify-center text-white transition-all rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        width: '42px',
                        height: '42px',
                        background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                        boxShadow: inputValue.trim() && !isLoading
                          ? '0 4px 14px rgba(124, 58, 237, 0.4)'
                          : 'none'
                      }}
                      title="Send message"
                    >
                      <Send
                        size={17}
                        strokeWidth={2}
                        className={inputValue.trim() ? 'translate-x-[1px] -translate-y-[0.5px]' : ''}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="flex items-center justify-between text-slate-500 font-medium px-1"
                style={{ fontSize: '10.5px' }}
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles size={11} className="text-purple-500" fill="currentColor" />
                  <span className="text-slate-500">Powered by Puter AI</span>
                </div>
                <span>AI can make mistakes. Verify important information.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center cursor-pointer transition-all outline-none rounded-full"
          style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 60%, #0369A1 100%)',
            boxShadow: '0 10px 25px -3px rgba(2, 132, 199, 0.45), 0 4px 10px -2px rgba(0, 0, 0, 0.1)',
            border: '2.5px solid rgba(255, 255, 255, 0.9)',
            padding: '8px'
          }}
          title="ERP AI Assistant"
        >
          <RobotIcon className="w-full h-full drop-shadow-sm select-none pointer-events-none" />
          <span
            className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"
            style={{
              boxShadow: '0 0 6px rgba(34, 197, 94, 0.6)'
            }}
          />
        </motion.button>
      )}
    </div>
  );
};

export default ChatWidget;
