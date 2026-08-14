import React, { useState, useRef, useEffect } from 'react';
import {
  X, Send, History, Maximize2, MoreVertical,
  Paperclip, Sparkles, Mic, RefreshCw, Plus,
  Copy, ThumbsUp, ThumbsDown, RotateCcw, Check
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { useAuthStore } from '../store/authStore';
import AttendanceWidget from './AttendanceWidget';

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
            className="mb-6 flex flex-col origin-bottom-right"
            style={{
              width: isMaximized ? 'calc(100vw - 48px)' : '520px',
              height: isMaximized ? 'calc(100vh - 48px)' : '740px',
              maxHeight: isMaximized ? 'calc(100vh - 48px)' : '85vh',
              borderRadius: isMaximized ? '16px' : '28px',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              overflow: 'hidden'
            }}
          >
            {/* ========== HEADER ========== */}
            <div
              className="flex items-center justify-between border-b"
              style={{
                height: '80px',
                padding: '0 24px',
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderColor: 'rgba(0, 0, 0, 0.06)'
              }}
            >
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div
                    className="flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200/50"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%'
                    }}
                  >
                    <img
                      src="/chatbot-mascot.png"
                      alt="Yuna"
                      className="w-[120%] h-[120%] object-cover object-top"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                  <div
                    className="absolute"
                    style={{
                      bottom: '0',
                      right: '0',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#10b981',
                      border: '2px solid rgba(255, 255, 255, 0.98)',
                      borderRadius: '50%'
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      className="font-bold text-slate-900"
                      style={{
                        fontSize: '17px',
                        lineHeight: '1.2',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      Yuna
                    </h3>
                    <span
                      className="font-bold px-2 py-0.5 rounded-full"
                      style={{
                        fontSize: '10px',
                        backgroundColor: '#f3e8ff',
                        color: '#7c3aed',
                        letterSpacing: '0.02em'
                      }}
                    >
                      v1.0
                    </span>
                  </div>
                  <p
                    className="text-slate-500 font-medium flex items-center gap-1.5"
                    style={{
                      fontSize: '13px',
                      marginTop: '2px',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    Yuna (AI Assistant)
                    <span
                      className="inline-flex items-center gap-1"
                      style={{ fontSize: '12px', color: '#10b981' }}
                    >
                      <span
                        style={{
                          width: '4px',
                          height: '4px',
                          backgroundColor: '#10b981',
                          borderRadius: '50%',
                          display: 'inline-block'
                        }}
                      />
                      Online
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearHistory}
                  className="flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 transition-all rounded-xl"
                  style={{ width: '36px', height: '36px' }}
                  title="History"
                >
                  <History size={18} strokeWidth={2} />
                </button>
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 transition-all rounded-xl"
                  style={{ width: '36px', height: '36px' }}
                  title={isMaximized ? "Minimize" : "Maximize"}
                >
                  <Maximize2 size={18} strokeWidth={2} />
                </button>
                <button
                  onClick={() => alert("Settings coming soon!")}
                  className="flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 transition-all rounded-xl"
                  style={{ width: '36px', height: '36px' }}
                  title="Settings"
                >
                  <MoreVertical size={18} strokeWidth={2} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 transition-all rounded-xl ml-1"
                  style={{ width: '36px', height: '36px' }}
                  title="Close"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* ========== CHAT AREA ========== */}
            <div
              className="flex-1 overflow-y-auto relative"
              style={{
                padding: '24px',
                background: 'linear-gradient(180deg, rgba(249, 250, 251, 0.5) 0%, rgba(243, 244, 246, 0.8) 100%)'
              }}
            >
              {!hasMessages ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center h-full"
                  style={{ paddingBottom: '40px' }}
                >
                  <div
                    className="mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-blue-50 border-4 border-white"
                    style={{
                      width: '140px',
                      height: '140px',
                      boxShadow: '0 8px 24px rgba(139, 92, 246, 0.15)'
                    }}
                  >
                    <img
                      src="/chatbot-mascot.png"
                      alt="Yuna"
                      className="w-[140%] h-[140%] object-cover object-top"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                  <h2
                    className="font-bold text-slate-900 mb-2"
                    style={{
                      fontSize: '28px',
                      letterSpacing: '-0.03em',
                      lineHeight: '1.2'
                    }}
                  >
                    Hi {user?.full_name?.split(' ')[0] || 'Harsh'}! 👋
                  </h2>
                  <p
                    className="text-slate-600 text-center mb-8 font-medium"
                    style={{
                      fontSize: '15px',
                      maxWidth: '380px',
                      lineHeight: '1.5'
                    }}
                  >
                    I'm Yuna, your StudentERP AI Assistant.<br />
                    I can help with:
                  </p>
                  <div
                    className="grid grid-cols-2 gap-3 mb-8"
                    style={{ width: '100%', maxWidth: '400px' }}
                  >
                    {[
                      { icon: '📊', label: 'Attendance', prompt: 'Show my overall attendance' },
                      { icon: '📝', label: 'Results', prompt: 'Show my results' },
                      { icon: '📚', label: 'Assignments', prompt: 'My pending assignments' },
                      { icon: '📅', label: 'Timetable', prompt: "Today's timetable" },
                      { icon: '📢', label: 'Notices', prompt: 'Latest notices' },
                      { icon: '✍️', label: 'Leave Applications', prompt: 'Help me write leave application' }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(item.prompt)}
                        className="flex items-center gap-3 p-3 bg-white hover:bg-purple-50 rounded-2xl border border-slate-200/60 hover:border-purple-200 transition-all cursor-pointer text-left w-full"
                        style={{
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>{item.icon}</span>
                        <span
                          className="font-semibold text-slate-700"
                          style={{ fontSize: '14px' }}
                        >
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <>
                  <div className="flex justify-center mb-6">
                    <span
                      className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-600 font-semibold border border-slate-200/60"
                      style={{
                        fontSize: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                      }}
                    >
                      Today
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {messages.map((msg, index) => {
                      if (index === 0) return null;

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
                            className="flex items-start gap-3"
                            style={{ maxWidth: msg.isBot ? '75%' : '70%' }}
                          >
                            {msg.isBot && (
                              <div className="relative flex-shrink-0">
                                <div
                                  className="flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200/50"
                                  style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%'
                                  }}
                                >
                                  <img
                                    src="/chatbot-mascot.png"
                                    alt="Yuna"
                                    className="w-[120%] h-[120%] object-cover object-top"
                                    style={{ imageRendering: 'pixelated' }}
                                  />
                                </div>
                                <div
                                  className="absolute"
                                  style={{
                                    bottom: '0',
                                    right: '0',
                                    width: '10px',
                                    height: '10px',
                                    backgroundColor: '#10b981',
                                    border: '2px solid rgba(243, 244, 246, 0.8)',
                                    borderRadius: '50%'
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex flex-col gap-2 w-full">
                              {msg.text && (
                                <div
                                  className={`relative ${msg.isBot
                                      ? 'bg-white border border-slate-200/60 text-slate-800'
                                      : 'bg-gradient-to-br from-purple-600 to-purple-500 text-white border border-purple-400/30'
                                    }`}
                                  style={{
                                    padding: '16px 18px',
                                    borderRadius: '20px',
                                    fontSize: '15px',
                                    lineHeight: '1.6',
                                    letterSpacing: '-0.01em',
                                    boxShadow: msg.isBot
                                      ? '0 2px 12px rgba(0, 0, 0, 0.06)'
                                      : '0 4px 16px rgba(139, 92, 246, 0.3)',
                                    wordBreak: 'break-word'
                                  }}
                                >
                                  {msg.isBot ? renderStructuredMessage(msg.text) : msg.text}
                                  <div
                                    className={`flex items-center gap-1 mt-2 ${msg.isBot ? 'text-slate-400' : 'text-purple-200 justify-end'
                                      }`}
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 500
                                    }}
                                  >
                                    {msg.time}
                                    {!msg.isBot && (
                                      <svg
                                        width="14"
                                        height="14"
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
                                <div className="flex items-center gap-1 mt-1 pl-1">
                                  <div
                                    className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/60 p-1"
                                    style={{
                                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                                    }}
                                  >
                                    <button
                                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                                      className="flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all rounded-lg"
                                      style={{ width: '28px', height: '28px' }}
                                      title="Copy"
                                    >
                                      {copiedMessageId === msg.id ? (
                                        <Check size={13} className="text-green-600" />
                                      ) : (
                                        <Copy size={13} strokeWidth={2} />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => handleRegenerateMessage(msg.id)}
                                      className="flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all rounded-lg"
                                      style={{ width: '28px', height: '28px' }}
                                      title="Regenerate"
                                    >
                                      <RotateCcw size={13} strokeWidth={2} />
                                    </button>
                                    <button
                                      onClick={() => toggleLike(msg.id)}
                                      className={`flex items-center justify-center transition-all rounded-lg ${likedMessages[msg.id] === 'like'
                                          ? 'text-green-600 bg-green-50'
                                          : 'text-slate-600 hover:text-green-600 hover:bg-green-50'
                                        }`}
                                      style={{ width: '28px', height: '28px' }}
                                      title="Like"
                                    >
                                      <ThumbsUp size={13} strokeWidth={2} />
                                    </button>
                                    <button
                                      onClick={() => toggleDislike(msg.id)}
                                      className={`flex items-center justify-center transition-all rounded-lg ${likedMessages[msg.id] === 'dislike'
                                          ? 'text-red-600 bg-red-50'
                                          : 'text-slate-600 hover:text-red-600 hover:bg-red-50'
                                        }`}
                                      style={{ width: '28px', height: '28px' }}
                                      title="Dislike"
                                    >
                                      <ThumbsDown size={13} strokeWidth={2} />
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
                        className="flex items-start gap-3"
                      >
                        <div className="relative flex-shrink-0">
                          <div
                            className="flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200/50"
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%'
                            }}
                          >
                            <img
                              src="/chatbot-mascot.png"
                              alt="Yuna"
                              className="w-[120%] h-[120%] object-cover object-top"
                              style={{ imageRendering: 'pixelated' }}
                            />
                          </div>
                          <div
                            className="absolute"
                            style={{
                              bottom: '0',
                              right: '0',
                              width: '10px',
                              height: '10px',
                              backgroundColor: '#10b981',
                              border: '2px solid rgba(243, 244, 246, 0.8)',
                              borderRadius: '50%'
                            }}
                          />
                        </div>
                        <div
                          className="bg-white border border-slate-200/60 flex items-center justify-center"
                          style={{
                            padding: '16px 24px',
                            borderRadius: '20px',
                            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
                          }}
                        >
                          <div className="flex gap-1.5">
                            <div
                              className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                              style={{ animationDelay: '0ms', animationDuration: '1s' }}
                            />
                            <div
                              className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                              style={{ animationDelay: '150ms', animationDuration: '1s' }}
                            />
                            <div
                              className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                              style={{ animationDelay: '300ms', animationDuration: '1s' }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* ========== INPUT AREA ========== */}
            <div
              className="flex flex-col gap-4 border-t"
              style={{
                padding: '20px 24px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderColor: 'rgba(0, 0, 0, 0.06)'
              }}
            >
              <div
                className="relative bg-white border border-slate-200/80 focus-within:border-purple-300 transition-all"
                style={{
                  borderRadius: '20px',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                  minHeight: '72px'
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
                    padding: '16px 16px 60px 16px',
                    fontSize: '15px',
                    lineHeight: '1.5',
                    outline: 'none',
                    maxHeight: '160px',
                    minHeight: '72px'
                  }}
                  rows={1}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 flex items-center justify-between"
                  style={{ padding: '12px 16px' }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all rounded-xl"
                      style={{ width: '36px', height: '36px' }}
                      title="Attach file"
                    >
                      <Plus size={18} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all rounded-xl"
                      style={{ width: '36px', height: '36px' }}
                      title="Paperclip"
                    >
                      <Paperclip size={18} strokeWidth={2} />
                    </button>
                    <button
                      className="flex items-center justify-center text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all rounded-xl"
                      style={{ width: '36px', height: '36px' }}
                      title="AI features"
                    >
                      <Sparkles size={18} strokeWidth={2} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleMicClick}
                      className={`flex items-center justify-center transition-all rounded-full ${isRecording ? 'text-red-500 bg-red-50 animate-pulse' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                      style={{ width: '40px', height: '40px' }}
                      title="Voice input"
                    >
                      <Mic size={18} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => handleSend()}
                      disabled={!inputValue.trim() || isLoading}
                      className="flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white transition-all rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        width: '44px',
                        height: '44px',
                        boxShadow: inputValue.trim() && !isLoading
                          ? '0 4px 16px rgba(139, 92, 246, 0.4)'
                          : 'none'
                      }}
                      title="Send message"
                    >
                      <Send
                        size={18}
                        strokeWidth={2}
                        className={inputValue.trim() ? 'translate-x-[1px] -translate-y-[0.5px]' : ''}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="flex items-center justify-between text-slate-500 font-medium"
                style={{
                  fontSize: '11px',
                  paddingTop: '4px'
                }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={12} className="text-purple-600" fill="currentColor" />
                  <span className="text-slate-600">Powered by Gemini AI</span>
                </div>
                <span>AI can make mistakes. Verify important information.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{
            scale: 1.08
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center transition-all outline-none border-none cursor-pointer translate-x-6 translate-y-6"
          style={{
            background: 'transparent',
            boxShadow: 'none',
            border: 'none'
          }}
        >
          <video
            src="/chatbot.webm"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] lg:w-[250px] lg:h-[250px] object-contain"
            style={{
              background: 'transparent',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              boxShadow: 'none'
            }}
            onError={(e) => {
              (e.target as HTMLVideoElement).style.display = 'none';
              const img = (e.target as HTMLVideoElement).nextElementSibling as HTMLImageElement;
              if (img) img.style.display = 'block';
            }}
          />
          <img
            src="/chatbot-mascot.png"
            alt="Yuna"
            className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] lg:w-[250px] lg:h-[250px] object-contain hidden"
            style={{ imageRendering: 'pixelated' }}
          />
        </motion.button>
      )}
    </div>
  );
};

export default ChatWidget;
