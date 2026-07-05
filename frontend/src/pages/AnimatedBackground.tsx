import React, { useEffect, useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const doodleIcons = [
  `<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5zM20 2v20" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
   <path d="M8 7h8M8 11h6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
  `<rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
   <rect x="7" y="5" width="10" height="5" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
   <circle cx="8.5" cy="14" r="0.8" fill="currentColor"/><circle cx="12" cy="14" r="0.8" fill="currentColor"/>
   <circle cx="15.5" cy="14" r="0.8" fill="currentColor"/><circle cx="8.5" cy="18" r="0.8" fill="currentColor"/>
   <circle cx="12" cy="18" r="0.8" fill="currentColor"/><circle cx="15.5" cy="18" r="0.8" fill="currentColor"/>`,
  `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
   <ellipse cx="12" cy="12" rx="4" ry="10" stroke="currentColor" stroke-width="1" fill="none"/>
   <path d="M2 12h20" stroke="currentColor" stroke-width="1" fill="none"/>
   <path d="M5 6.5h14M5 17.5h14" stroke="currentColor" stroke-width="0.8" fill="none" stroke-dasharray="2 2"/>`,
  `<path d="M2 10l10-5 10 5-10 5z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
   <path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5" stroke="currentColor" stroke-width="1.5" fill="none"/>
   <path d="M22 10v6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
  `<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
   <path d="M15 5l4 4" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  `<path d="M9 3h6M10 3v7.4L4.2 19.2A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.3-1.8L14 10.4V3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
   <path d="M7 15h10" stroke="currentColor" stroke-width="1" fill="none" stroke-dasharray="2 2"/>`,
  `<rect x="1" y="7" width="22" height="10" rx="1" stroke="currentColor" stroke-width="1.5" fill="none" transform="rotate(-45 12 12)"/>
   <path d="M7.3 11.7l2 2M10.5 8.5l1 1M13.7 5.3l2 2" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/>`,
  `<path d="M6 20V8h12v0M10 8v12M6 8c0-3 2-5 5-5h3c3 0 4 1 4 3" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
  `<path d="M9 18h6M10 22h4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
   <path d="M15 14c1.3-1.5 2-3 2-5a5 5 0 0 0-10 0c0 2 .7 3.5 2 5z" stroke="currentColor" stroke-width="1.5" fill="none"/>
   <path d="M12 2v1M4.2 4.2l.7.7M2 12h1M19.8 4.2l-.7.7M22 12h-1" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/>`,
  `<path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
   <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
   <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  `<path d="M8 21h8M12 17v4M6 3h12v4a6 6 0 0 1-12 0V3z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
   <path d="M6 5H3v2a3 3 0 0 0 3 3M18 5h3v2a3 3 0 0 1-3 3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
  `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
   <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
  `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>`,
  `<circle cx="13.5" cy="6.5" r="1.2" fill="currentColor"/>
   <circle cx="17" cy="10" r="1.2" fill="currentColor"/>
   <circle cx="8" cy="8" r="1.2" fill="currentColor"/>
   <circle cx="6.5" cy="12" r="1.2" fill="currentColor"/>
   <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.5 0 2-.7 2-1.5 0-.4-.1-.7-.4-1-.3-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H17c2.8 0 5-2.2 5-5 0-4.4-4.5-10-10-10z" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  `<circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/>
   <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
  `<path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
  `<text x="3" y="18" font-size="16" font-weight="bold" font-family="monospace" fill="currentColor">2+2</text>`,
  `<text x="2" y="17" font-size="14" font-weight="bold" font-family="serif" fill="currentColor">ABC</text>`,
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateDoodlePositions() {
  const positions: { id: number; x: number; y: number; rotation: number; iconIdx: number; scale: number; opacity: number }[] = [];
  const count = 75; // More stickers
  for (let i = 0; i < count; i++) {
    const seed = i * 127 + 42;
    positions.push({
      id: i,
      x: seededRandom(seed) * 100,
      y: seededRandom(seed + 1) * 100,
      rotation: seededRandom(seed + 2) * 360 - 180,
      iconIdx: Math.floor(seededRandom(seed + 3) * doodleIcons.length),
      scale: 0.7 + seededRandom(seed + 4) * 0.8,
      opacity: 0.03 + seededRandom(seed + 5) * 0.05,
    });
  }
  return positions;
}

// Parallax Doodle Component
const ParallaxDoodle = ({ d, mouseX, mouseY }: { d: any, mouseX: any, mouseY: any }) => {
  // 3D Depth effect: larger stickers move more than smaller ones
  const depthFactor = d.scale * 30; // Max movement in pixels

  // Map mouse position (-1 to 1) to translation
  const translateX = useTransform(mouseX, [-1, 1], [-depthFactor, depthFactor]);
  const translateY = useTransform(mouseY, [-1, 1], [-depthFactor, depthFactor]);

  return (
    <motion.div
      initial={{ 
        x: `${d.x}vw`, 
        y: `${d.y}vh`, 
        rotate: d.rotation, 
        scale: d.scale,
        opacity: d.opacity 
      }}
      animate={{
        y: [`${d.y}vh`, `${d.y - 2}vh`, `${d.y}vh`], // Slight breathing ambient animation
        rotate: [d.rotation, d.rotation + 5, d.rotation],
      }}
      transition={{
        duration: 10 + Math.random() * 10,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        position: 'absolute',
        width: '40px',
        height: '40px',
        color: '#fff',
        // Apply the mouse-driven translation on top of the base position
        translateX,
        translateY,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="100%"
        height="100%"
        dangerouslySetInnerHTML={{ __html: doodleIcons[d.iconIdx] }}
      />
    </motion.div>
  );
};

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Track mouse in normalized coordinates (-1 to 1) for DOM parallax
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  
  // Smooth out the mouse movement using springs (this creates the Antigravity feel)
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(rawMouseX, springConfig);
  const smoothMouseY = useSpring(rawMouseY, springConfig);

  // Track absolute mouse coords for the Canvas glow
  const canvasMouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: window.innerWidth / 2, targetY: window.innerHeight / 2 });

  const doodles = useMemo(() => generateDoodlePositions(), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvasMouseRef.current.x = canvas.width / 2;
      canvasMouseRef.current.y = canvas.height / 2;
      canvasMouseRef.current.targetX = canvas.width / 2;
      canvasMouseRef.current.targetY = canvas.height / 2;
    };

    const drawBackground = () => {
      ctx.fillStyle = '#09090B';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      canvasMouseRef.current.x += (canvasMouseRef.current.targetX - canvasMouseRef.current.x) * 0.05;
      canvasMouseRef.current.y += (canvasMouseRef.current.targetY - canvasMouseRef.current.y) * 0.05;

      const drawGlow = (xOffset: number, yOffset: number, radius: number, color1: string, color2: string) => {
        const x = canvas.width / 2 + (canvasMouseRef.current.x - canvas.width / 2) * xOffset;
        const y = canvas.height / 2 + (canvasMouseRef.current.y - canvas.height / 2) * yOffset;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };

      // Top right cyan glow
      drawGlow(0.02, 0.02, canvas.width * 0.8, 'rgba(34, 211, 238, 0.03)', 'rgba(34, 211, 238, 0)');
      
      // Bottom left purple glow
      drawGlow(-0.02, -0.02, canvas.width * 0.8, 'rgba(168, 85, 247, 0.03)', 'rgba(168, 85, 247, 0)');
      
      // Mouse follow subtle blue glow
      const mouseGradient = ctx.createRadialGradient(
        canvasMouseRef.current.x, canvasMouseRef.current.y, 0, 
        canvasMouseRef.current.x, canvasMouseRef.current.y, 400
      );
      mouseGradient.addColorStop(0, 'rgba(59, 130, 246, 0.04)');
      mouseGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = mouseGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
      drawBackground();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Update canvas mouse
      canvasMouseRef.current.targetX = e.clientX;
      canvasMouseRef.current.targetY = e.clientY;
      
      // Update normalized mouse (-1 to 1) for DOM framer motion stickers
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;
      rawMouseX.set(normalizedX);
      rawMouseY.set(normalizedY);
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
        {doodles.map((d) => (
          <ParallaxDoodle key={d.id} d={d} mouseX={smoothMouseX} mouseY={smoothMouseY} />
        ))}
      </div>
    </>
  );
};
