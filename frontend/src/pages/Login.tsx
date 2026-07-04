import { useState } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

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
                navigate("/Admin-Dashboard");
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
                </form>
            </div>
        </div>
    );
};

export default Login;