import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export function useIsMobile() {
  const getIsMobile = () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT;
  const getIsTablet = () => typeof window !== 'undefined' && window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT;

  const [isMobile, setIsMobile] = useState(getIsMobile);
  const [isTablet, setIsTablet] = useState(getIsTablet);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(getIsMobile());
      setIsTablet(getIsTablet());
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const tabletQuery = window.matchMedia(
      `(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`
    );

    const handleMobileChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    const handleTabletChange = (e: MediaQueryListEvent) => setIsTablet(e.matches);

    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener('change', handleMobileChange);
      tabletQuery.addEventListener('change', handleTabletChange);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (mobileQuery.removeEventListener) {
        mobileQuery.removeEventListener('change', handleMobileChange);
        tabletQuery.removeEventListener('change', handleTabletChange);
      }
    };
  }, []);

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
}
