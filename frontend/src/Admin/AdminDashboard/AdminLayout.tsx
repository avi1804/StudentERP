import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sidebar } from "@/Admin/AdminDashboard/Sidebar";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className={`relative z-10 flex h-screen min-w-0 flex-1 flex-col overflow-hidden transition-all duration-200 ${
        sidebarOpen ? "lg:ml-64" : "ml-0"
      }`}
    >
     
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1a1040] via-[#0c1638] to-[#05070f]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

      <Sidebar open={sidebarOpen}
       onNavigate={() => setSidebarOpen(false)}
         />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-[#0c1638]/80 px-5 py-4 backdrop-blur">
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="rounded-lg p-2 transition-all duration-200 bg-linear-to-b from-purple-400 to-cyan-300 hover:bg-[#a910f0]"
            aria-label="Toggle sidebar"
          >
            <Menu
              className={`h-5 w-5 transition-all duration-300 ease-in-out ${
                sidebarOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"
              }`}
            />
          </button>
          <h1 className="bg-linear-to-r from-purple-400 to-cyan-300 bg-clip-text text-lg font-bold text-transparent sm:text-xl">
            College Management System
          </h1>
        </header>

        <main className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}