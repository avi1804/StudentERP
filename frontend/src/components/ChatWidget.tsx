import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Send, History, Maximize2, MoreVertical, 
  Paperclip, Sparkles, Mic, RefreshCw, Plus 
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

const ChatWidget: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const [isOpen, setIsOpen] = useState(false);
  
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-6 flex flex-col w-[380px] sm:w-[500px] lg:w-[680px] h-[750px] max-h-[85vh] bg-[#f8f8fc] rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-[#e5e5f0] overflow-hidden relative origin-bottom-right"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 px-6 border-b border-[#e5e5f0] bg-[#f8f8fc] z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-[#e5e5f0] flex-shrink-0 flex items-center justify-center">
                     <img src="/chatbot-mascot.png" alt="Mascot" className="w-[120%] h-[120%] object-cover object-top" style={{ imageRendering: 'pixelated' }} />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#f8f8fc] rounded-full"></div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800 text-[19px] leading-tight">ERP Assistant</h3>
                  </div>
                  <p className="text-[13px] font-medium text-slate-500 flex items-center gap-2">
                    AI Assistant for Student ERP 
                    <span className="bg-[#e0d6ff] text-[#6b21a8] px-2 py-0.5 rounded-full text-[11px] font-bold">v1.0</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-slate-600">
                <button className="hover:text-black transition-colors"><History size={22} strokeWidth={1.5} /></button>
                <button className="hover:text-black transition-colors"><Maximize2 size={22} strokeWidth={1.5} /></button>
                <button className="hover:text-black transition-colors"><MoreVertical size={22} strokeWidth={1.5} /></button>
                <button onClick={() => setIsOpen(false)} className="hover:text-black transition-colors ml-1"><X size={26} strokeWidth={1.5} /></button>
              </div>
            </div>

            {/* Chat Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 relative" style={{
              background: 'linear-gradient(180deg, #f8f8fc 0%, #f4f4fa 100%)'
            }}>
              <div className="flex justify-center mb-4 mt-2">
                <span className="px-5 py-1.5 bg-white border border-[#e5e5f0] rounded-full text-[13px] font-medium text-slate-600">Today</span>
              </div>
              
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-4 ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                  {msg.isBot && (
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-[#e5e5f0] flex-shrink-0 flex items-center justify-center">
                         <img src="/chatbot-mascot.png" alt="Bot" className="w-[120%] h-[120%] object-cover object-top" style={{ imageRendering: 'pixelated' }} />
                      </div>
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#f4f4fa] rounded-full"></div>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 max-w-[80%]">
                    {msg.text && (
                      <div className={`p-4 rounded-3xl text-[16px] leading-relaxed shadow-sm relative ${
                        msg.isBot 
                          ? 'bg-white text-slate-800 rounded-tl-sm border border-[#e5e5f0]' 
                          : 'bg-[#e0d6ff] text-slate-800 rounded-tr-sm border border-[#d1c4f5]'
                      }`}>
                        {msg.text}
                        {/* Time stamp */}
                        <div className={`text-[12px] font-medium mt-2 flex items-center gap-1 ${msg.isBot ? 'text-slate-400' : 'text-[#6b21a8] justify-end'}`}>
                          {msg.time}
                          {!msg.isBot && (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          )}
                        </div>
                      </div>
                    )}
                    {msg.widgetData && msg.widgetData.type === 'attendance_card' && (
                      <AttendanceWidget data={msg.widgetData.data} />
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-[#e5e5f0] flex-shrink-0 flex items-center justify-center">
                       <img src="/chatbot-mascot.png" alt="Bot" className="w-[120%] h-[120%] object-cover object-top" style={{ imageRendering: 'pixelated' }} />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#f4f4fa] rounded-full"></div>
                  </div>
                  <div className="bg-white border border-[#e5e5f0] rounded-3xl rounded-tl-sm p-5 shadow-sm w-[90px]">
                    <div className="flex gap-2 justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Footer (Suggestions + Input) */}
            <div className="p-5 px-6 bg-[#f8f8fc] flex flex-col gap-4 z-10">
               {/* Suggestions */}
               <div className="flex flex-col gap-3 pt-3 border-t border-[#e5e5f0]">
                 <div className="flex items-center justify-between">
                   <span className="text-[14px] font-bold text-slate-700">Suggested for you</span>
                   <button className="flex items-center gap-1.5 text-[14px] font-semibold text-[#6b21a8] hover:text-[#581c87] transition-colors">
                     <RefreshCw size={16} strokeWidth={2.5} /> Refresh
                   </button>
                 </div>
                 <div className="flex flex-wrap gap-2.5 pb-2">
                   {['Show my overall attendance', 'Today\'s timetable', 'My pending assignments', 'Latest notices', 'My exam schedule', 'Help me write leave application'].map((pill) => (
                     <button 
                        key={pill} 
                        onClick={() => handleSend(pill)} 
                        className="px-4 py-2.5 bg-white border border-[#e5e5f0] hover:border-[#d1c4f5] hover:bg-[#faf9ff] text-slate-700 hover:text-[#6b21a8] text-[14px] font-medium rounded-xl transition-all shadow-sm"
                     >
                       {pill}
                     </button>
                   ))}
                 </div>
               </div>
               
               {/* Input */}
               <div className="flex flex-col p-3 border border-[#e5e5f0] rounded-3xl bg-white shadow-sm focus-within:border-[#c4b5fd] focus-within:shadow-[0_0_0_2px_rgba(196,181,253,0.3)] transition-all">
                 <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    className="w-full bg-transparent border-none focus:outline-none text-slate-800 placeholder:text-slate-500 px-3 py-2 pb-6 text-[16px] font-medium"
                    disabled={isLoading}
                 />
                 
                 <div className="flex items-center justify-between px-1">
                   <div className="flex items-center gap-3">
                     <button className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"><Plus size={22} /></button>
                     <button className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"><Paperclip size={20} /></button>
                     <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[#e0d6ff] text-[#6b21a8] bg-[#faf9ff] hover:bg-[#f3f0ff] transition-colors"><Sparkles size={20} /></button>
                   </div>
                   
                   <div className="flex items-center gap-3">
                     <button className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                        <Mic size={20} />
                     </button>
                     <button 
                        onClick={() => handleSend()}
                        disabled={!inputValue.trim() || isLoading}
                        className="w-11 h-11 flex items-center justify-center bg-[#6b21a8] hover:bg-[#581c87] text-white rounded-full transition-all disabled:opacity-50 flex-shrink-0 shadow-md"
                     >
                        <Send size={20} className={inputValue.trim() ? 'translate-x-[2px] -translate-y-[1px]' : ''} />
                     </button>
                   </div>
                 </div>
               </div>
               
               {/* Branding */}
               <div className="flex items-center justify-between text-[12px] font-medium text-slate-500 px-1 pt-2 pb-1">
                 <div className="flex items-center gap-2">
                   <div className="text-[#6b21a8] flex"><Sparkles size={14} fill="currentColor" /></div>
                   <span className="text-slate-600">Powered by Gemini AI</span>
                 </div>
                 <span>AI can make mistakes. Please verify important information.</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center transition-all z-50 overflow-visible outline-none w-32 h-32 bg-transparent border-none shadow-none hover:drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)] drop-shadow-xl"
        >
          <img src={`/chatbot-mascot.png?v=${Date.now()}`} alt="AI Assistant" className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />
        </motion.button>
      )}
    </div>
  );
};

export default ChatWidget;
