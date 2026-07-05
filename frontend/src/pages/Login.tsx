import React, { useState } from "react";
import { Eye, EyeOff, User, Lock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedBackground } from "./AnimatedBackground";

const loginSchema = z.object({
  email: z.string().min(1, "Institution ID / Email is required"), // the user wants "Institution ID" visually
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const setTokens = useAuthStore((state) => state.setTokens);
    const [activeTab, setActiveTab] = useState("password");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
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
        <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090B', position: 'relative', overflow: 'hidden', fontFamily: '"Inter", sans-serif' }}>
            <AnimatedBackground />

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '420px',
                background: '#111216', // Dark background exactly like reference
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '40px 32px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
                {/* Logo and Titles */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '12px', 
                        background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', 
                        marginBottom: '20px',
                        boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                    }}>
                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', letterSpacing: '1px' }}>ERP</span>
                    </div>
                    
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>
                        StudentERP
                    </h1>
                    <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>
                        Sign in to your account
                    </p>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '24px' }}>
                    <div 
                        onClick={() => setActiveTab('password')}
                        style={{
                            flex: 1, 
                            textAlign: 'center', 
                            padding: '10px 0', 
                            fontSize: '13px', 
                            cursor: 'pointer',
                            color: activeTab === 'password' ? '#A78BFA' : '#666',
                            borderBottom: activeTab === 'password' ? '2px solid #A78BFA' : '2px solid transparent',
                            background: activeTab === 'password' ? 'rgba(167, 139, 250, 0.05)' : 'transparent',
                            borderRadius: '6px 6px 0 0',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Password Login
                    </div>
                    <div 
                        onClick={() => setActiveTab('forgot')}
                        style={{
                            flex: 1, 
                            textAlign: 'center', 
                            padding: '10px 0', 
                            fontSize: '13px', 
                            cursor: 'pointer',
                            color: activeTab === 'forgot' ? '#A78BFA' : '#666',
                            borderBottom: activeTab === 'forgot' ? '2px solid #A78BFA' : '2px solid transparent',
                            background: activeTab === 'forgot' ? 'rgba(167, 139, 250, 0.05)' : 'transparent',
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
                                <motion.div 
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                    style={{ overflow: 'hidden', marginBottom: '20px' }}
                                >
                                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#FCA5A5', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>
                                        {errorMsg}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '8px' }}>Institution ID</label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#666', pointerEvents: 'none' }} />
                                <input 
                                    type="text" 
                                    placeholder="Enter your institution ID" 
                                    {...register("email")} 
                                    style={{ 
                                        width: '100%', 
                                        background: '#090A0C', 
                                        border: '1px solid rgba(255,255,255,0.08)', 
                                        color: '#fff', 
                                        padding: '12px 14px 12px 40px', 
                                        borderRadius: '8px', 
                                        fontSize: '13px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'rgba(167, 139, 250, 0.5)'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                />
                            </div>
                            {errors.email && <p style={{ fontSize: '11px', color: '#FCA5A5', marginTop: '4px' }}>{errors.email.message}</p>}
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '8px' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#666', pointerEvents: 'none' }} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Enter your password" 
                                    {...register("password")} 
                                    style={{ 
                                        width: '100%', 
                                        background: '#090A0C', 
                                        border: '1px solid rgba(255,255,255,0.08)', 
                                        color: '#fff', 
                                        padding: '12px 40px', 
                                        borderRadius: '8px', 
                                        fontSize: '13px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'rgba(167, 139, 250, 0.5)'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)} 
                                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', padding: 0, display: 'flex' }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p style={{ fontSize: '11px', color: '#FCA5A5', marginTop: '4px' }}>{errors.password.message}</p>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                borderRadius: '8px', 
                                background: '#A78BFA', 
                                color: '#000', 
                                fontWeight: 600, 
                                fontSize: '14px', 
                                border: 'none', 
                                cursor: 'pointer',
                                transition: 'background 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#8B5CF6'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#A78BFA'}
                        >
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Sign In"}
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#888', fontSize: '14px' }}>
                        Contact your administrator to reset your password.
                    </div>
                )}

                {/* Google Sign In Divider */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                    <span style={{ margin: '0 12px', fontSize: '12px', color: '#666' }}>or continue with</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                </div>

                <button 
                    type="button" 
                    style={{ 
                        width: '100%', 
                        padding: '12px', 
                        borderRadius: '8px', 
                        background: 'transparent', 
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#ddd', 
                        fontWeight: 500, 
                        fontSize: '13px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        transition: 'background 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign in with Google
                </button>
            </motion.div>
        </div>
    );
};

export default Login;