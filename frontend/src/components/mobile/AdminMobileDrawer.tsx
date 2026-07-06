import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../../pages/admin/AdminDashboard/Sidebar';
import { X } from 'lucide-react';

interface AdminMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminMobileDrawer({ isOpen, onClose }: AdminMobileDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 100,
            }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '85%',
              maxWidth: '320px',
              background: 'var(--bg)',
              zIndex: 101,
              boxShadow: '4px 0 24px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Close Button overlay (optional, but good for accessibility) */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 110,
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            {/* Render the exact same sidebar component inside the drawer container */}
            <div style={{ flex: 1, position: 'relative', height: '100%' }}>
              {/* Note: we override the #sidebar fixed positioning just for the drawer via a wrapper or passing a prop. 
                  Since #sidebar uses fixed, we'll let it render but style it via CSS when inside mobile drawer. */}
              <div className="mobile-drawer-sidebar-wrapper" style={{ height: '100%' }}>
                 <Sidebar onNavigate={onClose} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
