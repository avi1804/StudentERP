import React, { useState } from "react";
import { 
  Settings, Shield, Bell, Lock, Palette, User, Globe, Link as LinkIcon, 
  Monitor, Database, HelpCircle, Edit3, Phone, Mail, BadgeCent,
  Building2, BookOpen, Sun, Moon, Laptop, Check
} from "lucide-react";

const CustomToggle = ({ checked = true }: { checked?: boolean }) => (
  <div style={{ 
    width: '36px', height: '20px', 
    background: checked ? '#573cfa' : '#e5e7eb', 
    borderRadius: '20px', 
    position: 'relative', 
    cursor: 'pointer',
    transition: 'background 0.3s'
  }}>
    <div style={{ 
      width: '16px', height: '16px', 
      background: 'white', 
      borderRadius: '50%', 
      position: 'absolute', 
      top: '2px', 
      left: checked ? '18px' : '2px', 
      transition: 'left 0.3s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}></div>
  </div>
);

export function MySettings() {

  const [activeMenu, setActiveMenu] = useState("Account Settings");

  const menuItems = [
    { name: "Account Settings", icon: <User size={18} /> },
    { name: "Security & Password", icon: <Lock size={18} /> },
    { name: "Notifications", icon: <Bell size={18} /> },
    { name: "Privacy", icon: <Shield size={18} /> },
    { name: "Appearance", icon: <Palette size={18} /> },
    { name: "Language & Region", icon: <Globe size={18} /> },
    { name: "Connected Accounts", icon: <LinkIcon size={18} /> },
    { name: "Session Management", icon: <Monitor size={18} /> },
    { name: "Data & Storage", icon: <Database size={18} /> },
    { name: "Help & Support", icon: <HelpCircle size={18} /> },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ width: '48px', height: '48px', background: '#f3f0ff', borderRadius: '12px', marginRight: '16px', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Settings size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>Settings</h1>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>Manage your account, preferences and system settings</div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        
        {/* Account Security */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Account Security</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981', lineHeight: 1.2 }}>Strong</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Last changed 15 May 2024</div>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Bell size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Notifications</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981', lineHeight: 1.2 }}>Active</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Email, Push, SMS</div>
          </div>
        </div>

        {/* Privacy */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Lock size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Privacy</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f59e0b', lineHeight: 1.2 }}>Standard</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Manage your data</div>
          </div>
        </div>

        {/* Theme */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Palette size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Theme</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#3b82f6', lineHeight: 1.2 }}>Light</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Current theme</div>
          </div>
        </div>

      </div>

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
        
        {/* Left Sidebar Menu */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Settings Menu
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {menuItems.map((item, i) => {
              const isActive = activeMenu === item.name;
              return (
                <div 
                  key={i}
                  onClick={() => setActiveMenu(item.name)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', 
                    padding: '12px 16px', borderRadius: '10px', 
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: isActive ? '#f3f0ff' : 'transparent',
                    color: isActive ? '#573cfa' : '#4b5563',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '13px'
                  }}
                >
                  <div style={{ color: isActive ? '#573cfa' : '#6b7280' }}>
                    {item.icon}
                  </div>
                  {item.name}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Account Settings */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>Account Settings</h3>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Update your personal information and account details.</div>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#f8fafc', color: '#573cfa', borderRadius: '8px', fontSize: '12px', fontWeight: 600, border: '1px solid #f1f5f9', cursor: 'pointer' }}>
                <Edit3 size={14} /> Edit Profile
              </button>
            </div>

            <div style={{ display: 'flex', gap: '32px' }}>
              {/* Avatar */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: '90px', height: '90px', background: '#fbcfe8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: '#ec4899', position: 'relative' }}>
                  ST
                  <div style={{ position: 'absolute', bottom: '0', right: '0', width: '28px', height: '28px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb', color: '#573cfa', cursor: 'pointer' }}>
                    <Edit3 size={14} />
                  </div>
                </div>
              </div>
              
              {/* Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flex: 1 }}>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><User size={16} /></div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Full Name</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Student User</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Phone size={16} /></div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Phone Number</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>+91 98765 43210</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><BadgeCent size={16} /></div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Enrollment No.</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>IU/2021/CS/12345</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Building2 size={16} /></div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Department</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Computer Science Engineering</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Mail size={16} /></div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Email Address</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>student.user@indusuniv.ac.in</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><BookOpen size={16} /></div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Year / Semester</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>4th Year / 8th Semester</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Preferences Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
            
            {/* Notification Preferences */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>Notification Preferences</h3>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Choose how you want to receive notifications</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', marginBottom: '16px', paddingRight: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', width: '36px', textAlign: 'center' }}>Email</span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', width: '36px', textAlign: 'center' }}>Push</span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', width: '36px', textAlign: 'center' }}>SMS</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><BookOpen size={14} /></div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>Academic Updates</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>Notices, announcements, exam schedules</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <CustomToggle checked={true} />
                    <CustomToggle checked={true} />
                    <CustomToggle checked={false} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fdf2f8', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><BookOpen size={14} /></div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>Attendance Alerts</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>Attendance marked, low attendance alerts</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <CustomToggle checked={true} />
                    <CustomToggle checked={true} />
                    <CustomToggle checked={false} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><BookOpen size={14} /></div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>Assignment Updates</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>New assignments, deadlines, submissions</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <CustomToggle checked={true} />
                    <CustomToggle checked={true} />
                    <CustomToggle checked={true} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><BookOpen size={14} /></div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>Fee & Payment Alerts</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>Fee due reminders, payment confirmations</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <CustomToggle checked={true} />
                    <CustomToggle checked={true} />
                    <CustomToggle checked={true} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Shield size={14} /></div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>System & Security</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>Login alerts, password changes, etc.</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <CustomToggle checked={true} />
                    <CustomToggle checked={true} />
                    <CustomToggle checked={false} />
                  </div>
                </div>

              </div>
            </div>

            {/* Appearance Settings */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>Appearance Settings</h3>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Customize your experience</div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Theme</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div style={{ padding: '12px', border: '2px solid #573cfa', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: '#f3f0ff', cursor: 'pointer' }}>
                    <Sun size={20} color="#573cfa" />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#573cfa' }}>Light</span>
                  </div>
                  <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <Moon size={20} color="#6b7280" />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563' }}>Dark</span>
                  </div>
                  <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <Laptop size={20} color="#6b7280" />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563' }}>System</span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Primary Color</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', outline: '2px solid #f3f0ff', outlineOffset: '2px' }}>
                    <Check size={16} />
                  </div>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#3b82f6', cursor: 'pointer' }}></div>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', cursor: 'pointer' }}></div>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f59e0b', cursor: 'pointer' }}></div>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ec4899', cursor: 'pointer' }}></div>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#14b8a6', cursor: 'pointer' }}></div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Font Size</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'center', fontSize: '12px', color: '#4b5563', cursor: 'pointer' }}>A-</div>
                  <div style={{ padding: '8px', border: '1px solid #573cfa', borderRadius: '8px', textAlign: 'center', fontSize: '14px', color: '#573cfa', background: '#f3f0ff', fontWeight: 600, cursor: 'pointer' }}>A</div>
                  <div style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'center', fontSize: '16px', color: '#4b5563', cursor: 'pointer' }}>A+</div>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Grid Row (3 columns) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            
            {/* Security & Password */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>Security & Password</h3>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Keep your account secure</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Lock size={14} /></div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>Password</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>Last changed 15 May 2024</div>
                    </div>
                  </div>
                  <button style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: '#573cfa', cursor: 'pointer' }}>Change</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Shield size={14} /></div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>Two-Factor Authentication</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>Add an extra layer of security</div>
                    </div>
                  </div>
                  <CustomToggle checked={true} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bell size={14} /></div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>Login Alerts</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>Get notified about new login attempts</div>
                    </div>
                  </div>
                  <CustomToggle checked={true} />
                </div>
              </div>
            </div>

            {/* Connected Accounts */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>Connected Accounts</h3>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Manage your connected services</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold', color: '#ea4335' }}>G</div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>Google</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>student.user@gmail.com</div>
                    </div>
                  </div>
                  <button style={{ padding: '4px 10px', background: '#e8f5e9', border: 'none', borderRadius: '12px', fontSize: '10px', fontWeight: 600, color: '#10b981' }}>Connected</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold', color: '#00a4ef' }}>M</div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>Microsoft</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>Not connected</div>
                    </div>
                  </div>
                  <button style={{ padding: '4px 10px', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '10px', fontWeight: 600, color: '#573cfa', cursor: 'pointer' }}>Connect</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold', color: '#0077b5', fontSize: '14px' }}>in</div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>LinkedIn</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>Not connected</div>
                    </div>
                  </div>
                  <button style={{ padding: '4px 10px', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '10px', fontWeight: 600, color: '#573cfa', cursor: 'pointer' }}>Connect</button>
                </div>

              </div>

              <div style={{ marginTop: 'auto', paddingTop: '20px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#573cfa', cursor: 'pointer' }}>
                Manage All Connections &rarr;
              </div>
            </div>

            {/* Session Management */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>Session Management</h3>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Manage your active sessions</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Laptop size={14} /></div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>Current Session</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>Windows • Chrome • Ahmedabad, India</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                     <span style={{ fontSize: '9px', fontWeight: 600, color: '#10b981', background: '#e8f5e9', padding: '2px 6px', borderRadius: '4px' }}>This Device</span>
                     <span style={{ fontSize: '9px', color: '#10b981', fontWeight: 500 }}>Active now</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Other Active Sessions</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Phone size={14} /></div>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 600, color: '#111827' }}>Android • Mobile • Ahmedabad, India</div>
                          <div style={{ fontSize: '9px', color: '#6b7280' }}>Last active 2 hours ago</div>
                        </div>
                      </div>
                      <button style={{ padding: '4px 10px', background: '#fef2f2', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 600, color: '#ef4444', cursor: 'pointer' }}>Logout</button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Phone size={14} /></div>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 600, color: '#111827' }}>iOS • Mobile • Surat, India</div>
                          <div style={{ fontSize: '9px', color: '#6b7280' }}>Last active 1 day ago</div>
                        </div>
                      </div>
                      <button style={{ padding: '4px 10px', background: '#fef2f2', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 600, color: '#ef4444', cursor: 'pointer' }}>Logout</button>
                    </div>
                  </div>
                </div>

              </div>

              <div style={{ marginTop: 'auto', paddingTop: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#573cfa', cursor: 'pointer' }}>
                View All Sessions &rarr;
              </div>
            </div>

          </div>

          {/* Banner Promo */}
          <div style={{ background: '#f3f0ff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '80px', height: '80px' }}>
                {/* Mock illustration */}
                <div style={{ width: '48px', height: '48px', background: '#573cfa', borderRadius: '50%', opacity: 0.1, position: 'absolute' }}></div>
                <Shield size={40} color="#573cfa" />
                <div style={{ position: 'absolute', top: 10, right: 10, width: '16px', height: '16px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <Check size={12} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Your security is our priority</div>
                <div style={{ fontSize: '12px', color: '#4b5563', maxWidth: '400px', lineHeight: 1.5 }}>We use advanced security measures to protect your data and keep your account safe.</div>
              </div>
            </div>
            
            <button style={{ padding: '12px 24px', background: '#573cfa', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} /> Review Security Settings
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
