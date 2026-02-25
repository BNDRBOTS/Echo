// src/pages/ScenePage.tsx
import { motion } from "framer-motion";

export default function ScenePage() {
  return (
    <div className="w-full relative bg-[#000000] min-h-[240vh] flex flex-col items-center pt-24 overflow-hidden">
      <section className="relative w-full h-[100vh] flex flex-col items-center justify-center overflow-hidden">
        <motion.h1 
          className="font-anton text-[21.5vw] leading-[0.76] tracking-[-0.05em] text-white select-none mix-blend-difference"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.23,1,0.32,1] }}
        >
          SCOTTSDALE
        </motion.h1>
        
        <motion.div 
          className="absolute top-[53%] font-bebas text-[9.4vw] text-[#ff0033] whitespace-nowrap tracking-[0.05em] bg-[#000000] px-14 py-3 border border-[#222] shadow-[0_0_80px_rgba(255,0,51,0.5)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.4 }}
        >
          YARD OWNED
        </motion.div>

        <motion.div className="absolute top-[24%] left-[7%] bg-white text-black font-bold text-xs tracking-[0.28em] px-9 py-4 border-2 border-black shadow-[10px_10px_0_#ff0033]" initial={{ rotate: -14 }} animate={{ rotate: -9 }} transition={{ delay: 0.9 }}>BLOCKS MOVED</motion.div>
        <motion.div className="absolute bottom-[23%] right-[8%] bg-[#ff0033] text-white font-bold text-xs tracking-[0.28em] px-9 py-4 border-2 border-white shadow-[-10px_10px_0_#fff]" initial={{ rotate: 16 }} animate={{ rotate: 11 }} transition={{ delay: 1.2 }}>NO TALK</motion.div>
      </section>

      <section className="relative w-full max-w-7xl mx-auto px-10 py-32 flex flex-col lg:flex-row gap-24 z-10">
        <div className="lg:w-5/12 border-l-4 border-[#ff0033] pl-12">
          <motion.h3 className="font-anton text-[7.4rem] leading-[0.86] tracking-[-0.04em]" initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            THIS IS THE<br/>YARD
          </motion.h3>
          <p className="mt-12 text-[#999] text-[1.18rem] leading-relaxed font-medium tracking-wide">
            We tag the buildings that matter. The rest get passed over.
          </p>
          <motion.div className="mt-16 inline-block border-2 border-white px-16 py-6 text-2xl font-bebas tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            HIT THE YARD
          </motion.div>
        </div>

        <div className="lg:w-7/12 relative h-[70vh] bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#222_0.9px,transparent_1px)] bg-[length:24px_24px] opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[3px] h-[160%] bg-gradient-to-b from-transparent via-[#ff0033] to-transparent -rotate-12" />
          </div>
          <div className="absolute bottom-10 right-10 font-mono text-xs tracking-[0.35em] text-[#444]">BURNED IN</div>
        </div>
      </section>
    </div>
  );
}
