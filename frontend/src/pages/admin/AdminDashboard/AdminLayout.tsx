import { Outlet } from "react-router-dom";
import { Sidebar } from "@/pages/admin/AdminDashboard/Sidebar";

export function AdminLayout() {
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
