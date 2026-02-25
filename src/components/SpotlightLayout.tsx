// src/components/SpotlightLayout.tsx   ← THIS WAS THE ONLY BROKEN FILE
import { useEffect, useState, useRef, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useMotionValue, useSpring, useMotionValueEvent } from "framer-motion";

export default function SpotlightLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const cursorX = useMotionValue(-2000);
  const cursorY = useMotionValue(-2000);
  
  const springX = useSpring(cursorX, { stiffness: 280, damping: 32 });
  const springY = useSpring(cursorY, { stiffness: 280, damping: 32 });

  const [currentTime, setCurrentTime] = useState("");
  const ringRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  // LIVE CSS VAR UPDATES FOR THE MASK (this was the bug causing "only in corners")
  useMotionValueEvent(springX, "change", (v) => {
    maskRef.current?.style.setProperty("--cursor-x", `${v}px`);
  });
  useMotionValueEvent(springY, "change", (v) => {
    maskRef.current?.style.setProperty("--cursor-y", `${v}px`);
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString('en-US', { 
        month: '2-digit', day: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false 
      }).replace(',', ' •') + ' MST';
      setCurrentTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      const isLink = (e.target as HTMLElement).closest('a');
      if (ringRef.current) {
        ringRef.current.style.width = isLink ? '66px' : '42px';
        ringRef.current.style.height = isLink ? '66px' : '42px';
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        cursorX.set(e.touches[0].clientX);
        cursorY.set(e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [cursorX, cursorY]);

  return (
    <div className="min-h-screen w-full bg-[#000000] text-[#ffffff] font-sans selection:bg-[#ff0033] selection:text-[#000000] overflow-hidden">
      <div className="relative w-full z-10">
        {children}
      </div>

      <motion.div ref={ringRef} className="cursor-ring" style={{ left: springX, top: springY }} />
      <motion.div className="cursor-dot" style={{ left: springX, top: springY }} />
      <motion.div className="lacquer-lens" style={{ left: springX, top: springY }} />

      <div ref={maskRef} className="spotlight-mask" />

      <nav className="fixed top-0 left-0 w-full z-70 bg-gradient-to-b from-black/95 to-black/95 backdrop-blur-3xl border-b border-[#111] shadow-[0_40px_80px_rgba(0,0,0,0.98)] px-8 lg:px-16 py-7 flex justify-between items-center pointer-events-auto">
        <motion.div className="font-bebas text-4xl tracking-[0.06em] hover:text-[#ff0033] transition-all" whileHover={{ scale: 1.015 }}>
          <Link to="/">PX // SCOTTSDALE</Link>
        </motion.div>
        
        <div className="flex items-center gap-12 text-[11px] font-bold tracking-[0.14em] uppercase">
          <Link to="/" className={`hover:text-white transition-colors ${location.pathname === '/' ? 'text-white' : 'text-[#555]'}`}>SCENE</Link>
          <Link to="/yard" className={`hover:text-white transition-colors ${location.pathname === '/yard' ? 'text-white' : 'text-[#555]'}`}>YARD</Link>
          <Link to="/directives" className={`hover:text-white transition-colors ${location.pathname === '/directives' ? 'text-white' : 'text-[#555]'}`}>DIRECTIVES</Link>
          <div className="pl-8 border-l border-[#111] text-[#ff0033] font-mono text-xs tracking-normal">{currentTime || "02.25.26 • 14:43 MST"}</div>
        </div>
      </nav>
    </div>
  );
}
