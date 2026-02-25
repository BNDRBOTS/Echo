// src/pages/Directives.tsx
import { motion } from "framer-motion";

export default function Directives() {
  const list = [
    { n: "01", title: "ZERO COMPROMISE", txt: "No stock shit. Your site hits different or it dont hit at all." },
    { n: "02", title: "STRUCTURAL INTEGRITY", txt: "60fps or nothing. The yard dont slow down for weak code." },
    { n: "03", title: "PHOENIX / SCOTTSDALE ONLY", txt: "We only tag the blocks that matter here. Everywhere else can keep scrolling." },
    { n: "04", title: "THE LITERAL APPROACH", txt: "What you see is what ships. No talk. Just the tag." }
  ];

  return (
    <div className="w-full min-h-screen relative bg-[#000000] flex flex-col justify-center px-8 lg:px-24 py-40">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row justify-between border-b border-[#111] pb-12 mb-20">
          <motion.h1 className="font-anton text-[8.8rem] leading-[0.8] tracking-[-0.05em]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            DIRECTIVES
          </motion.h1>
          <div className="max-w-xs mt-8 lg:mt-0 text-[#666] font-medium text-sm tracking-widest">For the ones who already own the blocks.</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-28 gap-y-28">
          {list.map((d, i) => (
            <motion.div 
              key={i}
              className="group border-t-4 border-white pt-9"
              initial={{ opacity: 0, y: 90 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="font-bebas text-[5.4rem] tracking-wider mb-6 group-hover:text-[#ff0033] transition-colors">{d.n}. {d.title}</div>
              <p className="text-[#999] leading-relaxed text-[15px] font-medium tracking-[0.05em] uppercase">{d.txt}</p>
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-44 flex justify-between items-end border-t border-[#111] pt-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          <div className="font-bebas text-5xl tracking-widest hover:text-[#ff0033] transition-colors cursor-pointer">HIT US</div>
          <div className="text-[#444] text-xs tracking-[0.45em] font-bold">PX • SCOTTSDALE</div>
        </motion.div>
      </div>
    </div>
  );
}
