import { motion, AnimatePresence } from 'framer-motion';
import { FacultySidebar } from '../../pages/faculty/FacultyLayout';
import { X } from 'lucide-react';

interface FacultyMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FacultyMobileDrawer({ isOpen, onClose }: FacultyMobileDrawerProps) {
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
              background: 'rgba(247, 245, 236, 0.96)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              borderRight: '1px solid rgba(40, 43, 74, 0.12)',
              zIndex: 101,
              boxShadow: '4px 0 35px rgba(40, 43, 74, 0.18)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Close Button overlay */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(40, 43, 74, 0.08)',
                border: 'none',
                color: '#282B4A',
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
              <div className="mobile-drawer-sidebar-wrapper" style={{ height: '100%', position: 'relative' }} onClick={onClose}>
                 <FacultySidebar />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
