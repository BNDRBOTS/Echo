import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function GraffitiWall() {
  const [hovered, setHovered] = useState<number | null>(null);

  const seed = 666;
  const random = () => {
    let t = seed + 0x6D2B79F5;
    return () => {
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const { tags, decals } = useMemo(() => {
    const rng = random();
    const arr: any[] = [];
    const d1: any[] = [];
    
    const colors = ["#ff0033", "#ffffff", "#cccccc", "#ff0033", "#111111"];
    const fonts = ["font-anton", "font-bebas", "font-sans font-black tracking-[-0.02em]"];
    const words = [
      "PX BURN", "SCOTTSDALE KING", "ARIZONA FREIGHT", "COMMERCIAL BOMB", 
      "NO COMPROMISE", "LITERAL", "GLOSS", "LACQUER", "TOP TO BOTTOM", 
      "YARD BURNER", "PHOENIX THROW", "EQUITY TAG", "HEAVY ROLL", "ZONE", 
      "RESTRICTED", "2026", "CAPITAL DRIP", "STRUCTURAL", "DOMINANCE"
    ];

    for (let i = 0; i < 460; i++) {
      arr.push({
        text: words[Math.floor(rng() * words.length)],
        top: `${rng() * 460}%`,
        left: `${(rng() * 135) - 18}%`,
        color: colors[Math.floor(rng() * colors.length)],
        font: fonts[Math.floor(rng() * fonts.length)],
        size: `${Math.floor(rng() * 21) + 6}vw`,
        rotate: `${(rng() * 240) - 120}deg`,
        z: Math.floor(rng() * 180) + 20,
      });
    }

    for (let i = 0; i < 34; i++) {
      d1.push({
        top: `${rng() * 440}%`,
        left: `${rng() * 98}%`,
        rotate: `${rng() * 68 - 34}deg`,
        type: Math.floor(rng() * 3)
      });
    }
    
    return { tags: arr, decals: d1 };
  }, []);

  return (
    <div className="w-full min-h-[480vh] relative overflow-hidden bg-[#000000]">
      {/* TRAIN CAR BASE */}
      <div className="absolute inset-0 z-0 pointer-events-none flex flex-col gap-[28vh] pt-12">
        {[...Array(18)].map((_, i) => (
          <div key={i} className="w-full h-[36vh] border-y-[4px] border-[#111] bg-[#0a0a0a] relative overflow-hidden">
            <div className="absolute left-[4%] font-mono font-black text-[#111] text-[15vw] tracking-[-0.08em] whitespace-nowrap opacity-30">
              PX FREIGHT {1998 + i} • SCOTTSDALE YARD
            </div>
          </div>
        ))}
      </div>

      {/* CROWDED NEON GRAFFITI LAYER */}
      <div className="absolute inset-0 z-20 pointer-events-auto">
        {tags.map((tag, i) => (
          <motion.div
            key={i}
            className={`absolute uppercase neon-graffiti ${tag.font}`}
            style={{
              top: tag.top,
              left: tag.left,
              color: tag.color,
              fontSize: tag.size,
              transform: `rotate(${tag.rotate})`,
              zIndex: tag.z,
              lineHeight: 0.78,
            }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ 
              opacity: 1, 
              scale: hovered === i ? 1.22 : 1 
            }}
            whileHover={{ scale: 1.28 }}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
            transition={{ duration: 1.8, delay: i * 0.004 }}
          >
            {tag.text}
          </motion.div>
        ))}
      </div>

      {/* STICKER DECALS */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {decals.map((d, i) => (
          <motion.div 
            key={`d-${i}`}
            className={`absolute p-8 shadow-[0_0_50px_rgba(0,0,0,0.95)] text-sm font-black tracking-[0.22em] border-4 ${
              d.type === 0 ? "bg-[#ff0033] text-white border-white" : 
              d.type === 1 ? "bg-white text-black border-black" : 
              "bg-black text-white border-[#ff0033]"
            }`}
            style={{
              top: d.top,
              left: d.left,
              transform: `rotate(${d.rotate})`,
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.018 }}
          >
            <div>INSPECTED PX</div>
            <div className="text-6xl leading-none mt-1 -tracking-[0.02em]">DO NOT BUFF</div>
            <div className="text-xs mt-4 opacity-70">BURNED 02.25.26</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
