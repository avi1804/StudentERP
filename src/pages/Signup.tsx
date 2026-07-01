import { useState } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const Navigate = useNavigate();

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Center Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="relative w-full max-w-md">
          {/* Card */}
          <div className="relative">

            {/* Animated Glow */}
            <div className="absolute -inset-1 rounded-[28px] bg-linear-to-r from-violet-600 via-fuchsia-500 to-cyan-500 opacity-40 blur-3xl animate-pulse" />

            {/* Second Glow */}
            <div className="absolute -inset-3 rounded-4xl bg-violet-600/20 blur-[90px]" />

            {/* Card */}
            <div
              className="
      relative
      rounded-3xl
      border
      border-violet-500/30
      bg-slate-900/70
      backdrop-blur-2xl
      p-8
      shadow-[0_0_40px_rgba(139,92,246,.25),0_0_80px_rgba(6,182,212,.12)]
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
                  Create Account
                </h1>

                <p className="mt-2 text-center text-sm text-slate-400">
                  Welcome! Create your student account to manage attendance.
                </p>
              </div>

              {/* Form */}
              <form className="mt-8 space-y-5">

                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                  />
                </div>

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

                {/* Student ID */}
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Student ID
                  </label>

                  <input
                    type="text"
                    placeholder="STU2025001"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
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
                      placeholder="Enter password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 pr-12 text-white outline-none transition-all placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-violet-400"
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 pr-12 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Checkbox */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-600 accent-violet-600"
                  />

                  <p className="text-sm text-slate-400">
                    I agree to the{" "}
                    <span className="cursor-pointer text-violet-400 hover:text-violet-300">
                      Terms & Conditions
                    </span>
                  </p>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-linear-to-r from-violet-600 to-cyan-500 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-600/40 active:scale-95 cursor-pointer"
                >
                  Create Account
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
                {/* Continue with Google */}
<button
  type="button"
  className="
    flex
    w-full
    items-center
    justify-center
    gap-3
    rounded-xl
    border
    border-slate-700
    bg-slate-800/60
    py-3
    font-medium
    text-white
    backdrop-blur-md
    transition-all
    duration-300
    hover:border-violet-500
    hover:bg-slate-800
    hover:shadow-[0_0_25px_rgba(139,92,246,.25)]
    active:scale-95
  "
>
  <FcGoogle size={22} />
  Continue with Google
</button>

{/* Footer */}
<p className="text-center text-sm text-slate-400">
  Already have an account?{" "}
  <button
    type="button"
    onClick={() => Navigate("/login")}
    className="font-semibold text-cyan-400 transition hover:text-cyan-300"
  >
    Sign In
  </button>
</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;