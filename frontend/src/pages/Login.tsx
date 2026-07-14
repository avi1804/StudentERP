import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, User, Lock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { useGoogleLogin } from '@react-oauth/google';
import { OTPVerification } from "@/components/OTPVerification";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLiquidGlass } from "@/hooks/useLiquidGlass";

const loginSchema = z.object({
  email: z.string().min(1, "Institution ID / Email is required"), 
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
    const isLight = false;
    // Theme variables (dark mode fixed)
    const bgBase = '#0a0a12';
    const cardBg = 'linear-gradient(180deg, rgba(14, 14, 22, 0.18), rgba(14, 14, 22, 0.32))';
    const cardShadow = '0 24px 60px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.5), inset 0 -8px 20px rgba(255, 255, 255, 0.06), inset 0 0 0 1px rgba(255, 255, 255, 0.13)';
    const cardBorder = 'none';
    const titleColor = '#fff';
    const subColor = 'rgba(245,245,247,0.65)';
    const activeTabColor = '#fff';
    const inactiveTabColor = 'rgba(255,255,255,0.4)';
    const activeTabBg = 'rgba(255,255,255,0.09)';
    const inputBg = 'rgba(255,255,255,0.09)';
    const inputBorder = 'rgba(255,255,255,0.18)';
    const inputText = '#fff';
    const primaryBtnBg = '#f5f5f7';
    const primaryBtnHover = '#ffffff';
    const primaryBtnText = '#0a0a12';
    const dividerColor = 'rgba(255,255,255,0.1)';

    const { isMobile } = useIsMobile();
    const glassRef = useRef<HTMLDivElement>(null);
    useLiquidGlass(glassRef as React.RefObject<any>, { disabled: isMobile });

    const passwordInputRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const setTokens = useAuthStore((state) => state.setTokens);
    const [activeTab, setActiveTab] = useState("password");
    
    // Password Login Flow State
    const [loginStep, setLoginStep] = useState<'email' | 'password'>('email');
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    useEffect(() => {
        if (loginStep === 'password' && passwordInputRef.current) {
            setTimeout(() => {
                passwordInputRef.current?.focus();
            }, 100);
        }
    }, [loginStep]);

    const handleNext = async (e: React.MouseEvent) => {
        e.preventDefault();
        const isValid = await trigger("email");
        if (isValid) {
            const email = getValues("email");
            try {
                setErrorMsg("");
                setIsCheckingEmail(true);
                await authService.checkEmail(email);
                setLoginStep('password');
            } catch (error: any) {
                setErrorMsg(error.response?.data?.detail || "Invalid email. Please try again.");
            } finally {
                setIsCheckingEmail(false);
            }
        }
    };
    
    // Forgot Password Flow State
    const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'reset'>('email');
    const [forgotEmail, setForgotEmail] = useState("");
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [forgotError, setForgotError] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isResetting, setIsResetting] = useState(false);
    
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!forgotEmail) {
            setForgotError("Please enter your email");
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(forgotEmail)) {
            setForgotError("Please enter a valid email address");
            return;
        }
        setForgotError("");
        setIsSendingOtp(true);
        try {
            await authService.forgotPassword(forgotEmail);
            setIsSendingOtp(false);
            setForgotStep('otp');
        } catch (error: any) {
            setForgotError(error.response?.data?.detail || "Failed to send OTP.");
            setIsSendingOtp(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            setForgotError("Password must be at least 6 characters.");
            return;
        }
        setForgotError("");
        setIsResetting(true);
        try {
            await authService.resetPassword(forgotEmail, resetToken, newPassword);
            setIsResetting(false);
            setActiveTab('password');
            setForgotStep('email');
            setForgotEmail("");
            setResetToken("");
            setNewPassword("");
        } catch (error: any) {
            setForgotError(error.response?.data?.detail || "Failed to reset password.");
            setIsResetting(false);
        }
    };

    const {
        register,
        handleSubmit,
        trigger,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setErrorMsg("");
                const response = await authService.googleLogin(tokenResponse.access_token);
                setTokens(response.access_token, response.refresh_token);
                const user = useAuthStore.getState().user;
                
                if (user?.role === "admin") {
                    navigate("/admin/dashboard");
                } else if (user?.role === "faculty") {
                    navigate("/faculty/dashboard");
                } else {
                    navigate("/dashboard");
                }
            } catch (error: any) {
                setErrorMsg(error.response?.data?.detail || "Google login failed. Please try again.");
            }
        },
        onError: () => {
            setErrorMsg("Google login failed. Please try again.");
        }
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setErrorMsg("");
            const response = await authService.login({ email: data.email, password: data.password });
            setTokens(response.access_token, response.refresh_token);
            const user = useAuthStore.getState().user;
            
            if (user?.role === "admin") {
                navigate("/admin/dashboard");
            } else if (user?.role === "faculty") {
                navigate("/faculty/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (error: any) {
            setErrorMsg(error.response?.data?.detail || "Invalid credentials. Please try again.");
        }
    };

    return (
        <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: bgBase, backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden', fontFamily: '"Inter", sans-serif', padding: isMobile ? '24px' : '0', transition: 'background-color 0.5s ease' }}>
            {/* Overlay for readability */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10, 10, 18, 0.85)', zIndex: 0, backdropFilter: 'blur(4px)' }} />

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '420px' }}
            >
                <div 
                  ref={glassRef}
                  style={{
                    padding: isMobile ? '32px 24px' : '40px 32px',
                    display: 'flex', flexDirection: 'column',
                    borderRadius: '24px',
                    background: cardBg,
                    border: cardBorder,
                    backdropFilter: 'none',
                    boxShadow: cardShadow,
                    transition: 'all 0.5s ease'
                  }}
                >
                {/* Logo and Titles */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                        <img src="/indus-logo.png" alt="Indus University" style={{ height: '64px', objectFit: 'contain' }} />
                    </div>
                    
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: titleColor, margin: '0 0 8px 0', letterSpacing: '-0.01em', transition: 'color 0.3s ease' }}>
                        IndusERP
                    </h1>
                    <p style={{ fontSize: '13px', color: subColor, margin: 0, transition: 'color 0.3s ease' }}>
                        Sign in to your account
                    </p>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: `1px solid ${dividerColor}`, marginBottom: '24px', transition: 'border-color 0.3s ease' }}>
                    <div 
                        onClick={() => setActiveTab('password')}
                        style={{
                            flex: 1, textAlign: 'center', padding: '10px 0', fontSize: '13px', cursor: 'pointer',
                            color: activeTab === 'password' ? activeTabColor : inactiveTabColor,
                            borderBottom: activeTab === 'password' ? `2px solid ${activeTabColor}` : '2px solid transparent',
                            background: activeTab === 'password' ? activeTabBg : 'transparent',
                            borderRadius: '6px 6px 0 0',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Password Login
                    </div>
                    <div 
                        onClick={() => { setActiveTab('forgot'); setForgotStep('email'); setForgotError(""); }}
                        style={{
                            flex: 1, textAlign: 'center', padding: '10px 0', fontSize: '13px', cursor: 'pointer',
                            color: activeTab === 'forgot' ? activeTabColor : inactiveTabColor,
                            borderBottom: activeTab === 'forgot' ? `2px solid ${activeTabColor}` : '2px solid transparent',
                            background: activeTab === 'forgot' ? activeTabBg : 'transparent',
                            borderRadius: '6px 6px 0 0',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Forgot Password
                    </div>
                </div>

                {activeTab === 'password' ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <AnimatePresence>
                            {errorMsg && (
                                <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -10 }} style={{ overflow: 'hidden', marginBottom: '20px' }}>
                                    <div style={{ background: isLight ? 'rgba(239, 68, 68, 0.05)' : 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>
                                        {errorMsg}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: subColor, marginBottom: '8px', fontWeight: 500, transition: 'color 0.3s ease' }}>Institution ID</label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: inactiveTabColor, pointerEvents: 'none' }} />
                                <input 
                                    type="text" 
                                    placeholder="Enter your institution ID" 
                                    {...register("email")} 
                                    style={{ 
                                        width: '100%', background: inputBg, border: `1px solid ${inputBorder}`, color: inputText, 
                                        padding: '12px 14px 12px 40px', borderRadius: '8px', fontSize: '13px', outline: 'none', transition: 'all 0.2s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = activeTabColor;
                                        e.target.style.boxShadow = `0 0 0 3px ${isLight ? 'rgba(139, 92, 246, 0.15)' : 'rgba(167, 139, 250, 0.15)'}`;
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = inputBorder;
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                            {errors.email && <p style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>{errors.email.message}</p>}
                        </div>

                        <AnimatePresence>
                            {loginStep === 'password' && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginBottom: '24px' }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                                    style={{ overflow: 'hidden', willChange: 'height, opacity, margin-bottom', transformOrigin: 'top' }}
                                >
                                    <label style={{ display: 'block', fontSize: '12px', color: subColor, marginBottom: '8px', fontWeight: 500, transition: 'color 0.3s ease' }}>Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: inactiveTabColor, pointerEvents: 'none' }} />
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            placeholder="Enter your password" 
                                            {...register("password")} 
                                            ref={(e) => { register("password").ref(e); passwordInputRef.current = e; }}
                                            style={{ 
                                                width: '100%', background: inputBg, border: `1px solid ${inputBorder}`, color: inputText, 
                                                padding: '12px 40px', borderRadius: '8px', fontSize: '13px', outline: 'none', transition: 'all 0.2s ease'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = activeTabColor;
                                                e.target.style.boxShadow = `0 0 0 3px ${isLight ? 'rgba(139, 92, 246, 0.15)' : 'rgba(167, 139, 250, 0.15)'}`;
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = inputBorder;
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowPassword(!showPassword)} 
                                            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: inactiveTabColor, cursor: 'pointer', padding: 0, display: 'flex' }}
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.password && <p style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>{errors.password.message}</p>}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button 
                            type={loginStep === 'email' ? "button" : "submit"} 
                            onClick={loginStep === 'email' ? handleNext : undefined}
                            disabled={loginStep === 'email' ? isCheckingEmail : isSubmitting}
                            style={{ 
                                width: '100%', padding: '12px', borderRadius: '8px', 
                                background: (loginStep === 'email' ? isCheckingEmail : isSubmitting) ? primaryBtnHover : primaryBtnBg, 
                                color: primaryBtnText, fontWeight: 600, fontSize: '14px', border: 'none', 
                                cursor: (loginStep === 'email' ? isCheckingEmail : isSubmitting) ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: isLight ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none'
                            }}
                            onMouseOver={(e) => { if(!(loginStep === 'email' ? isCheckingEmail : isSubmitting)) e.currentTarget.style.background = primaryBtnHover }}
                            onMouseOut={(e) => { if(!(loginStep === 'email' ? isCheckingEmail : isSubmitting)) e.currentTarget.style.background = primaryBtnBg }}
                        >
                            {loginStep === 'email' ? (isCheckingEmail ? <Loader2 size={18} className="animate-spin" /> : "Next") : (isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Sign In")}
                        </button>
                    </form>
                ) : (
                    forgotStep === 'email' ? (
                        <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSendOtp}>
                            <AnimatePresence>
                                {forgotError && (
                                    <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -10 }} style={{ overflow: 'hidden', marginBottom: '20px' }}>
                                        <div style={{ background: isLight ? 'rgba(239, 68, 68, 0.05)' : 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>
                                            {forgotError}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: 600, color: titleColor, margin: '0 0 8px 0', letterSpacing: '-0.01em', transition: 'color 0.3s ease' }}>
                                    Reset Password
                                </h2>
                                <p style={{ fontSize: '13px', color: subColor, margin: 0, lineHeight: 1.5, transition: 'color 0.3s ease' }}>
                                    Enter your registered email address and we'll send you a verification code.
                                </p>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: subColor, marginBottom: '8px', fontWeight: 500, transition: 'color 0.3s ease' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: inactiveTabColor, pointerEvents: 'none' }} />
                                    <input 
                                        type="email" placeholder="Enter your email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)}
                                        style={{ 
                                            width: '100%', background: inputBg, border: `1px solid ${inputBorder}`, color: inputText, 
                                            padding: '12px 14px 12px 40px', borderRadius: '8px', fontSize: '13px', outline: 'none', transition: 'all 0.2s ease'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = activeTabColor;
                                            e.target.style.boxShadow = `0 0 0 3px ${isLight ? 'rgba(139, 92, 246, 0.15)' : 'rgba(167, 139, 250, 0.15)'}`;
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = inputBorder;
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" disabled={isSendingOtp} 
                                style={{ 
                                    width: '100%', padding: '12px', borderRadius: '8px', 
                                    background: isSendingOtp ? primaryBtnHover : primaryBtnBg, 
                                    color: primaryBtnText, fontWeight: 600, fontSize: '14px', border: 'none', 
                                    cursor: isSendingOtp ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: isLight ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none'
                                }}
                                onMouseOver={(e) => { if(!isSendingOtp) e.currentTarget.style.background = primaryBtnHover }}
                                onMouseOut={(e) => { if(!isSendingOtp) e.currentTarget.style.background = primaryBtnBg }}
                            >
                                {isSendingOtp ? <Loader2 size={18} className="animate-spin" /> : "Send OTP"}
                            </button>
                        </motion.form>
                    ) : forgotStep === 'otp' ? (
                        <OTPVerification email={forgotEmail} onBack={() => setForgotStep('email')} onSuccess={(token) => { setResetToken(token); setForgotStep('reset'); }} />
                    ) : (
                        <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleResetPassword}>
                            <AnimatePresence>
                                {forgotError && (
                                    <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -10 }} style={{ overflow: 'hidden', marginBottom: '20px' }}>
                                        <div style={{ background: isLight ? 'rgba(239, 68, 68, 0.05)' : 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>
                                            {forgotError}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: 600, color: titleColor, margin: '0 0 8px 0', letterSpacing: '-0.01em', transition: 'color 0.3s ease' }}>
                                    Create New Password
                                </h2>
                                <p style={{ fontSize: '13px', color: subColor, margin: 0, lineHeight: 1.5, transition: 'color 0.3s ease' }}>
                                    Your OTP was verified. Please enter your new password below.
                                </p>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: subColor, marginBottom: '8px', fontWeight: 500, transition: 'color 0.3s ease' }}>New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: inactiveTabColor, pointerEvents: 'none' }} />
                                    <input 
                                        type={showPassword ? "text" : "password"} placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                        style={{ 
                                            width: '100%', background: inputBg, border: `1px solid ${inputBorder}`, color: inputText, 
                                            padding: '12px 40px', borderRadius: '8px', fontSize: '13px', outline: 'none', transition: 'all 0.2s ease'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = activeTabColor;
                                            e.target.style.boxShadow = `0 0 0 3px ${isLight ? 'rgba(139, 92, 246, 0.15)' : 'rgba(167, 139, 250, 0.15)'}`;
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = inputBorder;
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                    <button 
                                        type="button" onClick={() => setShowPassword(!showPassword)} 
                                        style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: inactiveTabColor, cursor: 'pointer', padding: 0, display: 'flex' }}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button 
                                type="submit" disabled={isResetting} 
                                style={{ 
                                    width: '100%', padding: '12px', borderRadius: '8px', 
                                    background: isResetting ? primaryBtnHover : primaryBtnBg, color: primaryBtnText, fontWeight: 600, fontSize: '14px', border: 'none', 
                                    cursor: isResetting ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: isLight ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none'
                                }}
                                onMouseOver={(e) => { if(!isResetting) e.currentTarget.style.background = primaryBtnHover }}
                                onMouseOut={(e) => { if(!isResetting) e.currentTarget.style.background = primaryBtnBg }}
                            >
                                {isResetting ? <Loader2 size={18} className="animate-spin" /> : "Reset Password"}
                            </button>
                        </motion.form>
                    )
                )}

                {/* Google Sign In Divider */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: dividerColor, transition: 'background 0.3s ease' }}></div>
                    <span style={{ margin: '0 12px', fontSize: '12px', color: inactiveTabColor, transition: 'color 0.3s ease' }}>or continue with</span>
                    <div style={{ flex: 1, height: '1px', background: dividerColor, transition: 'background 0.3s ease' }}></div>
                </div>

                <button 
                    type="button" onClick={() => googleLogin()}
                    style={{ 
                        width: '100%', padding: '12px', borderRadius: '8px', background: isLight ? '#FFFFFF' : 'transparent', 
                        border: `1px solid ${inputBorder}`, color: isLight ? '#4B5563' : '#ddd', fontWeight: 500, fontSize: '13px', 
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s ease',
                        boxShadow: isLight ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = isLight ? '#F9FAFB' : 'rgba(255,255,255,0.02)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = isLight ? '#FFFFFF' : 'transparent';
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign in with Google
                </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;