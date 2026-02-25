import { motion } from "framer-motion";

export default function Directives() {
  const list = [
    { n: "01", title: "ZERO COMPROMISE", txt: "Templates get buried. We build what actually owns the market. Custom from the first line." },
    { n: "02", title: "STRUCTURAL INTEGRITY", txt: "60fps under maximum load. No bloat. Code that hits like freight train at full speed." },
    { n: "03", title: "PHOENIX / SCOTTSDALE ONLY", txt: "We only move for the real players in this valley. We know the heat. We know the money." },
    { n: "04", title: "THE LITERAL APPROACH", txt: "What you see is exactly what ships. No promises. No filler. Raw commercial power." }
  ];

  return (
    <div className="w-full min-h-screen relative bg-[#000000] flex flex-col justify-center px-8 lg:px-24 py-40">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row justify-between border-b border-[#111] pb-12 mb-20">
          <motion.h1 className="font-anton text-[8.8rem] leading-[0.8] tracking-[-0.05em]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            EXECUTIVE<br/><span className="text-[#ff0033]">DIRECTIVES</span>
          </motion.h1>
          <div className="max-w-xs mt-8 lg:mt-0 text-[#666] font-medium text-sm tracking-widest">For the ones who already run the desert.</div>
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
          <div className="font-bebas text-5xl tracking-widest hover:text-[#ff0033] transition-colors cursor-pointer">INITIATE CONTACT</div>
          <div className="text-[#444] text-xs tracking-[0.45em] font-bold">PX • SCOTTSDALE • 2026</div>
        </motion.div>
      </div>
    </div>
  );
}
