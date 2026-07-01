import { useState } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const Navigate = useNavigate();
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
                        <form className="mt-8 space-y-5">

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                                />
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
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 pr-12 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
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
                                className="w-full rounded-xl bg-linear-to-r from-violet-600 to-cyan-500 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-600/40 active:scale-95 cursor-pointer"
                            >
                                Sign In
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
                                    onClick={()=>Navigate('../')}
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