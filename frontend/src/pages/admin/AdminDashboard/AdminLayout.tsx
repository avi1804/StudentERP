import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "@/pages/admin/AdminDashboard/Sidebar";
import { useIsMobile } from "@/hooks/useIsMobile";
import { AdminMobileTopBar } from "@/components/mobile/AdminMobileTopBar";
import { AdminMobileBottomNav } from "@/components/mobile/AdminMobileBottomNav";
import { AdminMobileDrawer } from "@/components/mobile/AdminMobileDrawer";

export function AdminLayout() {
  const { isMobile } = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ── Mobile Layout ──
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
        <AdminMobileTopBar onMenuClick={() => setIsDrawerOpen(true)} />
        
        <main className="m-content">
          <Outlet />
        </main>
        
        <AdminMobileBottomNav onMenuClick={() => setIsDrawerOpen(true)} />
        <AdminMobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      </div>
    );
  }

  // ── Desktop Layout (unchanged) ──
  return (
    <>
      <Sidebar />
      <div id="main">
        <div id="topbar">
          <div id="page-title">Dashboard</div>
        </div>
        <div id="content">
          <Outlet />
        </div>
      </div>
    </>
  );
}
