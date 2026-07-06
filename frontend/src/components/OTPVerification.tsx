import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { authService } from '../services/auth.service';

interface OTPVerificationProps {
  onBack: () => void;
  onSuccess: (reset_token: string) => void;
  email: string;
}

const OTP_LENGTH = 6;
const COUNTDOWN_INITIAL = 119; // 1:59

export const OTPVerification: React.FC<OTPVerificationProps> = ({ onBack, onSuccess, email = "your email" }) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_INITIAL);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the active input
  useEffect(() => {
    if (inputRefs.current[activeIndex]) {
      inputRefs.current[activeIndex]?.focus();
    }
  }, [activeIndex]);

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft > 0 && !isSuccess) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft, isSuccess]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // take the last character typed to handle fast typing
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError(null); // Clear errors on typing

    if (value && index < OTP_LENGTH - 1) {
      setActiveIndex(index + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move back if current is empty
        setActiveIndex(index - 1);
      } else {
        // Clear current
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        setError(null);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      setActiveIndex(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    setActiveIndex(Math.min(pastedData.length, OTP_LENGTH - 1));
    setError(null);
  };

  // Auto-verify when OTP is full
  useEffect(() => {
    const code = otp.join('');
    if (code.length === OTP_LENGTH && !isLoading && !isSuccess && !error) {
      handleVerify();
    }
  }, [otp]);

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.verifyOtp(email, code);
      setIsSuccess(true);
      setTimeout(() => onSuccess(response.reset_token), 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid verification code. Please try again.');
      setIsLoading(false);
      // Optional: Clear the input on error so they can quickly re-type, like the video.
      // But keeping the numbers with a red border is also good UX. Let's keep the red border.
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    
    setError(null);
    setOtp(Array(OTP_LENGTH).fill(''));
    setActiveIndex(0);
    
    try {
      await authService.forgotPassword(email);
      setTimeLeft(COUNTDOWN_INITIAL);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to resend OTP. Try again.');
    }
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <button 
        onClick={onBack}
        style={{ 
          background: 'none', border: 'none', color: '#666', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px',
          alignSelf: 'flex-start', marginBottom: '24px', transition: 'color 0.2s ease'
        }}
        onMouseOver={e => e.currentTarget.style.color = '#fff'}
        onMouseOut={e => e.currentTarget.style.color = '#666'}
      >
        <ArrowLeft size={16} /> Back to login
      </button>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', margin: '0 0 12px 0', letterSpacing: '-0.01em' }}>
          Verify your email
        </h2>
        <p style={{ fontSize: '14px', color: '#888', margin: 0, lineHeight: 1.6 }}>
          We've sent a 6-digit code to your email.<br/>
          It's auto-verify once entered.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}
            >
              <CheckCircle size={40} color="#10B981" strokeWidth={2.5} />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ color: '#fff', marginTop: '24px', fontSize: '20px', fontWeight: 600 }}
            >
              Verified successfully
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ color: '#888', marginTop: '8px', fontSize: '14px' }}
            >
              Your email has been verified.
            </motion.p>
          </motion.div>
        ) : (
          <motion.div 
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%' }}
          >
            
            <motion.div 
              style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}
              animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={el => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  onFocus={() => setActiveIndex(index)}
                  style={{
                    width: '56px',
                    height: '64px',
                    textAlign: 'center',
                    fontSize: '28px',
                    fontWeight: 500,
                    background: 'transparent',
                    border: `1px solid ${error ? '#EF4444' : activeIndex === index ? '#fff' : 'rgba(255,255,255,0.15)'}`,
                    color: '#fff',
                    borderRadius: '12px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    opacity: isLoading ? 0.5 : 1
                  }}
                  whileFocus={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  disabled={isLoading}
                />
              ))}
            </motion.div>

            <AnimatePresence>
              {isLoading && !error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}
                >
                  <Loader2 size={24} color="#888" className="animate-spin" />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ textAlign: 'center', color: '#EF4444', fontSize: '13px', marginBottom: '16px' }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', padding: '0 4px' }}>
              <span style={{ fontSize: '13px', color: '#666', fontVariantNumeric: 'tabular-nums' }}>
                {formatTime(timeLeft)}
              </span>
              
              <button
                type="button"
                onClick={handleResend}
                disabled={timeLeft > 0}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: timeLeft > 0 ? '#444' : '#A78BFA',
                  cursor: timeLeft > 0 ? 'not-allowed' : 'pointer',
                  padding: 0,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                Resend OTP
                {timeLeft === 0 && (
                  <motion.div 
                    layoutId="underline"
                    style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: '1px', background: '#A78BFA' }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />
                )}
              </button>
            </div>

            {/* Removed the manual Verify button since it auto-verifies now */}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
