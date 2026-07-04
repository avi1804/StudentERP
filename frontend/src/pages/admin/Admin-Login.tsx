import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const setTokens = useAuthStore((state) => state.setTokens);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginFormValues) => {
    try {
      setErrorMsg("");
      const response = await authService.login(data);
      setTokens(response.access_token, response.refresh_token);
      const user = useAuthStore.getState().user;
      if (user?.role !== 'admin') {
         setErrorMsg("Unauthorized. Admin access only.");
         useAuthStore.getState().logout();
         return;
      }
      navigate("/Admin-Dashboard"); 
    } catch (error: any) {
      setErrorMsg(error.response?.data?.detail || "Login failed.");
    }
  };

  return (
    <div id="login-screen">
      <div id="login-box">
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand), var(--accent))', marginBottom: '16px', boxShadow: '0 0 24px rgba(108,92,231,0.5)' }}>
            <ShieldCheck size={32} color="#fff" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Admin Portal</div>
          <div style={{ color: "var(--text3)", fontSize: "14px" }}>
            Sign in to manage attendance, students, faculty and reports.
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {errorMsg && (
            <div style={{ padding: "12px", background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.2)", borderRadius: "var(--radius)", color: "#ff3b30", marginBottom: "24px", fontSize: "14px" }}>
              {errorMsg}
            </div>
          )}

          <div className="fg">
            <label>Admin Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              {...register("email")}
            />
            {errors.email && <p style={{ color: "#ff3b30", fontSize: "12px", margin: "4px 0 0 0" }}>{errors.email.message}</p>}
          </div>

          <div className="fg">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                style={{ paddingRight: "40px", width: "100%", margin: 0 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text3)", cursor: "pointer" }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p style={{ color: "#ff3b30", fontSize: "12px", margin: "4px 0 0 0" }}>{errors.password.message}</p>}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", fontSize: "13px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "var(--text2)", margin: 0 }}>
              <input type="checkbox" style={{ width: "auto", margin: 0 }} /> Remember me
            </label>
            <span style={{ color: "var(--brand)", cursor: "pointer" }}>Forgot Password?</span>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Admin Sign In"}
          </button>
          
          <div style={{ textAlign: "center", margin: "24px 0", fontSize: "13px", color: "var(--text3)", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
            <span>OR</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          </div>

          <button type="button" className="btn" onClick={() => navigate("/login")}>
            Continue as Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;