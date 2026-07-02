import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronRight, ChevronDown, Circle, GraduationCap, Users } from "lucide-react";
import { NAV_ITEMS } from "@/Admin/AdminDashboard/DashboardData";

interface SidebarProps {
  open: boolean;
   onNavigate: () => void;
}

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>(() => {
    // auto-expand whichever section the current route belongs to on first load
    const match = NAV_ITEMS.find((item) =>
      item.subItems?.some((sub) => location.pathname.startsWith(sub.path))
    );
    return match?.label ?? null;
  });

  const handleNavigate = () => {
  if (window.innerWidth < 1024) {
    onNavigate();
  }
};
  return (
    <>
      <aside
  className={`fixed inset-y-0 left-0 z-40 w-64
border-r border-white/30
bg-gradient-to-b from-[#37316d] via-[#0e1630] to-[#151825]
transform transition-all duration-500 ease-in-out
${open ? "translate-x-0" : "-translate-x-full"}`}
>
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 shadow-[0_0_12px_rgba(139,92,246,0.5)]">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-semibold text-white">Admin</span>
        </div>

        <div className="flex items-center gap-3 border-b border-white/10 px-5 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
            <Users className="h-4 w-4" />
          </div>
          <span className="text-sm text-white/60">kumar, admin</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map(({ label, icon: Icon, path, subItems }) => {
            const isExpanded = expandedItem === label;

            if (path) {
              return (
                <NavLink
                  key={label}
                  to={path}
                  end={path === "/Admin-Dashboard"}
                   onClick={handleNavigate}
                  className={({ isActive }) =>
                    `flex w-full items-center gap-3 border-l-2 px-5 py-3 text-left text-sm transition-colors ${
                      isActive
                        ? "border-cyan-400 bg-gradient-to-r from-purple-500/80 to-cyan-400/40 text-white"
                        : "border-transparent text-white/60 hover:bg-white/8 hover:text-white"
                    }`
                  }
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {label}
                </NavLink>
              );
            }

            return (
              <div key={label}>
                <button
                  onClick={() => setExpandedItem(isExpanded ? null : label)}
                  className="flex w-full items-center justify-between px-5 py-3 text-left text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {label}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                  )}
                </button>

                {isExpanded && subItems && (
                  <div className="bg-black/30 py-1">
                    {subItems.map((sub) => (
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                         onClick={handleNavigate}
                        className={({ isActive }) =>
                          `flex w-full items-center gap-3 py-2.5 pl-11 pr-5 text-left text-sm transition-colors ${
                            isActive ? "text-cyan-300" : "text-white/50 hover:text-white"
                          }`
                        }
                      >
                        <Circle className="h-2.5 w-2.5 flex-shrink-0" />
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {open && (
        <div className="fixed inset-0 z-20 bg-black/60 lg:hidden"  onClick={onNavigate}/>
         
      )}
    </>
  );
}