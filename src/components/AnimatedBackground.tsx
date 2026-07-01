import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#4164c6]">

      {/* Base Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-black" />

      {/* Aurora Layer */}
      <motion.div
        animate={{
          x: [0, 120, -80, 0],
          y: [0, -80, 80, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-60 left-[-50] h-[175] w-[175] rounded-full bg-violet-600/25 blur-[150px]"
      />

      <motion.div
        animate={{
          x: [0, -100, 80, 0],
          y: [0, 80, -60, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-62.5] top-20 h-[162.5] w-[162.5] rounded-full bg-cyan-500/20 blur-[170px]"
      />

      <motion.div
        animate={{
          x: [0, 100, -100, 0],
          y: [0, 40, -40, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-62.5] left-1/3 h-[137.5] w-[137.5] rounded-full bg-indigo-600/20 blur-[150px]"
      />

      {/* Grid */}
      <div
        className="
          absolute inset-0
          opacity-[0.05]
          bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)]
          bg-size:[60px_60px]
        "
      />

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />

      {/* Floating Particles */}
      {Array.from({ length: 100 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.4 + 0.2,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      <div
        className="
          absolute
          -top-48
          -left-40
          h-125
          w-125
          rounded-full
          bg-violet-600/30
          blur-[140px]
          animate-float-slow
        "
      />

      {/* Cyan Blob */}
      <div
        className="
          absolute
          top-1/3
          -right-48
          h-112.5
          w-112.5
          rounded-full
          bg-cyan-500/25
          blur-[140px]
          animate-float-medium
        "
      />

      {/* Blue Blob */}
      <div
        className="
          absolute
          bottom-[-45]
          left-1/4
          h-137.5
          w-137.5
          rounded-full
          bg-indigo-600/25
          blur-[150px]
          animate-float-fast
        "
      />

      {/* Small Purple Glow */}
      <div
        className="
          absolute
          top-20
          right-1/4
          h-44
          w-44
          rounded-full
          bg-fuchsia-500/20
          blur-[100px]
          animate-float-medium
        "
      />

      {/* Small Cyan Glow */}
      <div
        className="
          absolute
          bottom-24
          left-12
          h-36
          w-36
          rounded-full
          bg-sky-400/20
          blur-[90px]
          animate-float-slow
        "
      />

    </div>
    
  );
}