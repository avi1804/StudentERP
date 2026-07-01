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
            navigate("/dashboard"); // Redirect to student dashboard after login
        } catch (error: any) {
            setErrorMsg(error.response?.data?.detail || "Login failed. Please try again.");
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden">
            {/* Animated Background */}
            <AnimatedBackground />

            {/* Center Content */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
                <div className="relative w-full max-w-md">

                    {/* Glow Effect */}
                    <div className="absolute -inset-1 rounded-[28px] bg-linear-to-r from-violet-600 via-fuchsia-500 to-cyan-500 opacity-40 blur-3xl animate-pulse" />

                    <div className="absolute -inset-3 rounded-4xl bg-violet-600/20 blur-[90px]" />

                    {/* Login Card */}
                    <div
                        className="
              relative
              rounded-3xl
              border
              border-violet-500/30
              bg-slate-900/70
              backdrop-blur-2xl
              p-8
              transition-all
              duration-500
              hover:border-cyan-400/60
              hover:shadow-[0_0_60px_rgba(139,92,246,.45),0_0_120px_rgba(6,182,212,.25)]
            "
                    >
                        {/* Logo */}
                        <div className="flex flex-col items-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-r from-violet-600 to-cyan-500 shadow-lg shadow-violet-700/40">
                                <GraduationCap className="h-10 w-10 text-white" />
                            </div>

                            <h1 className="mt-6 text-3xl font-bold text-white">
                                Welcome Back
                            </h1>

                            <p className="mt-2 text-center text-sm text-slate-400">
                                Sign in to continue to your Attendance Dashboard.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                            {errorMsg && (
                                <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-400 border border-red-500/50">
                                    {errorMsg}
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    {...register("email")}
                                    className={`w-full rounded-xl border bg-slate-800/70 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:ring-2 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-slate-700 focus:border-violet-500 focus:ring-violet-500/30"}`}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        {...register("password")}
                                        className={`w-full rounded-xl border bg-slate-800/70 px-4 py-3 pr-12 text-white outline-none transition-all placeholder:text-slate-500 focus:ring-2 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/30"}`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-400"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 accent-violet-600"
                                    />
                                    Remember Me
                                </label>

                                <button
                                    type="button"
                                    className="text-sm font-medium text-cyan-400 transition hover:text-cyan-300 cursor-pointer"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-xl bg-linear-to-r from-violet-600 to-cyan-500 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-600/40 active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Signing in..." : "Sign In"}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-slate-700" />
                                <span className="text-xs uppercase tracking-widest text-slate-500">
                                    OR
                                </span>
                                <div className="h-px flex-1 bg-slate-700" />
                            </div>

                            {/* Footer */}
                            <p className="text-center text-sm text-slate-400">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    className="font-semibold text-violet-400 transition hover:text-violet-300 cursor-pointer"
                                    onClick={()=>navigate('/')}
                                >
                                    Create Account
                                </button>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Login;