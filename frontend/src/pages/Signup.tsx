import { useState } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../services/auth.service";

const signupSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  student_id: z.string().optional(),
  password: z.string().min(6, "At least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setErrorMsg("");
      // Call register API, role defaults to student for now since this is the student signup
      await authService.register({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        role: "student",
      });
      // Registration success, redirect to login
      navigate("/login");
    } catch (error: any) {
      setErrorMsg(error.response?.data?.detail || "Registration failed.");
    }
  };

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
              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                {errorMsg && (
                    <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-400 border border-red-500/50">
                        {errorMsg}
                    </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    {...register("full_name")}
                    className={`w-full rounded-xl border bg-slate-800/70 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:ring-2 ${errors.full_name ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-slate-700 focus:border-violet-500 focus:ring-violet-500/30"}`}
                  />
                  {errors.full_name && <p className="mt-1 text-xs text-red-400">{errors.full_name.message}</p>}
                </div>

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
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                </div>

                {/* Student ID */}
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Student ID
                  </label>
                  <input
                    type="text"
                    placeholder="STU2025001"
                    {...register("student_id")}
                    className={`w-full rounded-xl border bg-slate-800/70 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:ring-2 ${errors.student_id ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/30"}`}
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
                      {...register("password")}
                      className={`w-full rounded-xl border bg-slate-800/70 px-4 py-3 pr-12 text-white outline-none transition-all placeholder:text-slate-500 focus:ring-2 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-slate-700 focus:border-violet-500 focus:ring-violet-500/30"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-violet-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
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
                      {...register("confirmPassword")}
                      className={`w-full rounded-xl border bg-slate-800/70 px-4 py-3 pr-12 text-white outline-none transition-all placeholder:text-slate-500 focus:ring-2 ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/30"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-400"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
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
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-linear-to-r from-violet-600 to-cyan-500 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-600/40 active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
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
    onClick={() => navigate("/login")}
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