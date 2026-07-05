import { useState } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/* ── Education doodle SVG icons ── */
const doodleIcons = [
  // Book open
  `<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5zM20 2v20" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
   <path d="M8 7h8M8 11h6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
  // Calculator
  `<rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
   <rect x="7" y="5" width="10" height="5" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
   <circle cx="8.5" cy="14" r="0.8" fill="currentColor"/><circle cx="12" cy="14" r="0.8" fill="currentColor"/>
   <circle cx="15.5" cy="14" r="0.8" fill="currentColor"/><circle cx="8.5" cy="18" r="0.8" fill="currentColor"/>
   <circle cx="12" cy="18" r="0.8" fill="currentColor"/><circle cx="15.5" cy="18" r="0.8" fill="currentColor"/>`,
  // Globe / Atom
  `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
   <ellipse cx="12" cy="12" rx="4" ry="10" stroke="currentColor" stroke-width="1" fill="none"/>
   <path d="M2 12h20" stroke="currentColor" stroke-width="1" fill="none"/>
   <path d="M5 6.5h14M5 17.5h14" stroke="currentColor" stroke-width="0.8" fill="none" stroke-dasharray="2 2"/>`,
  // Graduation cap
  `<path d="M2 10l10-5 10 5-10 5z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
   <path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5" stroke="currentColor" stroke-width="1.5" fill="none"/>
   <path d="M22 10v6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
  // Pencil
  `<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
   <path d="M15 5l4 4" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  // Flask / beaker
  `<path d="M9 3h6M10 3v7.4L4.2 19.2A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.3-1.8L14 10.4V3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
   <path d="M7 15h10" stroke="currentColor" stroke-width="1" fill="none" stroke-dasharray="2 2"/>`,
  // Ruler
  `<rect x="1" y="7" width="22" height="10" rx="1" stroke="currentColor" stroke-width="1.5" fill="none" transform="rotate(-45 12 12)"/>
   <path d="M7.3 11.7l2 2M10.5 8.5l1 1M13.7 5.3l2 2" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/>`,
  // Pi / Math
  `<path d="M6 20V8h12v0M10 8v12M6 8c0-3 2-5 5-5h3c3 0 4 1 4 3" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
  // Lightbulb
  `<path d="M9 18h6M10 22h4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
   <path d="M15 14c1.3-1.5 2-3 2-5a5 5 0 0 0-10 0c0 2 .7 3.5 2 5z" stroke="currentColor" stroke-width="1.5" fill="none"/>
   <path d="M12 2v1M4.2 4.2l.7.7M2 12h1M19.8 4.2l-.7.7M22 12h-1" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/>`,
  // Music note
  `<path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
   <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
   <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  // Trophy
  `<path d="M8 21h8M12 17v4M6 3h12v4a6 6 0 0 1-12 0V3z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
   <path d="M6 5H3v2a3 3 0 0 0 3 3M18 5h3v2a3 3 0 0 1-3 3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
  // Clock
  `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
   <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
  // Star
  `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>`,
  // Palette
  `<circle cx="13.5" cy="6.5" r="1.2" fill="currentColor"/>
   <circle cx="17" cy="10" r="1.2" fill="currentColor"/>
   <circle cx="8" cy="8" r="1.2" fill="currentColor"/>
   <circle cx="6.5" cy="12" r="1.2" fill="currentColor"/>
   <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.5 0 2-.7 2-1.5 0-.4-.1-.7-.4-1-.3-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H17c2.8 0 5-2.2 5-5 0-4.4-4.5-10-10-10z" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  // Magnifying glass
  `<circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/>
   <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
  // WiFi / Signal
  `<path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
  // 2+2 Math
  `<text x="3" y="18" font-size="16" font-weight="bold" font-family="monospace" fill="currentColor">2+2</text>`,
  // ABC
  `<text x="2" y="17" font-size="14" font-weight="bold" font-family="serif" fill="currentColor">ABC</text>`,
];

/* Seeded random for consistent layout */
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateDoodlePositions() {
  const positions: { x: number; y: number; rotation: number; iconIdx: number; scale: number; opacity: number }[] = [];
  const count = 60;
  for (let i = 0; i < count; i++) {
    const seed = i * 127 + 42;
    positions.push({
      x: seededRandom(seed) * 100,
      y: seededRandom(seed + 1) * 100,
      rotation: seededRandom(seed + 2) * 360 - 180,
      iconIdx: Math.floor(seededRandom(seed + 3) * doodleIcons.length),
      scale: 0.7 + seededRandom(seed + 4) * 0.8,
      opacity: 0.04 + seededRandom(seed + 5) * 0.08,
    });
  }
  return positions;
}

const doodlePositions = generateDoodlePositions();

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const setTokens = useAuthStore((state) => state.setTokens);

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
            const response = await authService.login(data);
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
            setErrorMsg(error.response?.data?.detail || "Login failed. Please try again.");
        }
    };

    return (
        <div id="login-screen">
            {/* Education doodle background layer */}
            <div className="login-doodles" aria-hidden="true">
                {doodlePositions.map((d, i) => (
                    <svg
                        key={i}
                        className="login-doodle-icon"
                        viewBox="0 0 24 24"
                        style={{
                            left: `${d.x}%`,
                            top: `${d.y}%`,
                            transform: `rotate(${d.rotation}deg) scale(${d.scale})`,
                            opacity: d.opacity,
                        }}
                        dangerouslySetInnerHTML={{ __html: doodleIcons[d.iconIdx] }}
                    />
                ))}
            </div>

            {/* Subtle radial glow behind center */}
            <div className="login-center-glow" />

            <div className="login-box">
                <div className="login-logo">
                    <div className="logo-icon">
                        <GraduationCap size={24} />
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue to your Attendance Dashboard.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {errorMsg && <div className="login-error" style={{ display: 'block' }}>{errorMsg}</div>}

                    <div className="fg">
                        <label>Email Address</label>
                        <input type="email" placeholder="john@example.com" {...register("email")} />
                        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                    </div>

                    <div className="fg">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input type={showPassword ? "text" : "password"} placeholder="Enter your password" {...register("password")} style={{ paddingRight: '40px' }} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text2)', cursor: 'pointer' }}>
                            <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                            Remember Me
                        </label>
                        <a style={{ fontSize: '13px', color: 'var(--primary)', cursor: 'pointer' }}>
                            Forgot Password?
                        </a>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ marginTop: '24px' }}>
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </button>
                    
                    <div className="login-divider">
                        <span>or continue with</span>
                    </div>

                    <button type="button" className="btn-google">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Sign in with Google
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;