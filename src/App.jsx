// src/App.jsx
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Flame, X } from "lucide-react";

/* -------------------- DATA -------------------- */
const PROJECTS = [
  { id: "lifematrix", title: "LifeMatrix", category: "App", link: "https://bndrbots.github.io/BNDR_LifeMatrix/", tags: ["Biometric", "Web3"] },
  { id: "feed", title: "The Feed", category: "Social", link: "https://bndrbots.github.io/TheFeedUpraded/", tags: ["Real-time", "Social"] },
  { id: "studio", title: "Studio", category: "Agency", link: "https://bndrbots.github.io/Studio/", tags: ["Creative", "UX"] },
  { id: "voss", title: "Voss", category: "Design", link: "https://bndrbots.github.io/Voss/", tags: ["Minimalism", "Brand"] },
  { id: "saguaro", title: "Saguaro Ironline", category: "Industrial", link: "https://bndrbots.github.io/SaguaroIronline/", tags: ["Heavy", "Structural"] },
  { id: "autologistics", title: "Auto Logistics", category: "Logistics", link: "https://bndrbots.github.io/auto_logistics/", tags: ["AI", "Supply"] },
  { id: "sangre", title: "Sangre del Sol", category: "Design", link: "https://bndrbots.github.io/Sangredelsol/", tags: ["Vivid", "Hot"] },
  { id: "biltmore", title: "Biltmore Signal", category: "Finance", link: "https://bndrbots.github.io/Biltmore_Signal_Advisory/", tags: ["Alpha", "Wealth"] },
  { id: "privatewealth", title: "Private Wealth", category: "Finance", link: "https://bndrbots.github.io/PrivateWealth/", tags: ["Asset", "Vault"] },
  { id: "epochaura", title: "Epoch Aura", category: "Design", link: "https://bndrbots.github.io/EpochAura/", tags: ["Future", "Aura"] },
  { id: "obsidian", title: "Obsidian", category: "Security", link: "https://bndrbots.github.io/Obsidian/", tags: ["Dark", "Encrypted"] },
  { id: "venom", title: "Venom Cuts", category: "Retail", link: "https://bndrbots.github.io/VenomCuts/", tags: ["Sharp", "Edge"] }
];

/* -------------------- UTILS -------------------- */
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const isIOS = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const iOS = /iP(ad|hone|od)/.test(ua);
  const iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return iOS || iPadOS;
};
const mq = (q) => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(q).matches : false);

function useOnceInView(ref, margin = "0px 0px -10% 0px") {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin: margin, threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen, margin]);
  return seen;
}

/* -------------------- MICRO-MESH FIELD (OPTIMIZED, MERGED) -------------------- */
function MicroMeshField({ pointerRef }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const S = useRef({
    w: 0, h: 0, dpr: 1, res: 28,
    cols: 0, rows: 0, grid: [], particles: [],
    lastTs: 0, lastFrameTs: 0, fps: 60,
    reduced: false, ios: false, coarse: false, meshTicker: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    const st = S.current;
    st.ios = isIOS();
    st.coarse = mq("(pointer: coarse)");
    st.reduced = mq("(prefers-reduced-motion: reduce)");
    st.fps = st.reduced || st.coarse || st.ios ? 36 : 60;

    const setup = () => {
      const maxDpr = st.ios ? 1.2 : 1.6;
      const dpr = clamp(window.devicePixelRatio || 1, 1, maxDpr);
      const w = Math.max(320, window.innerWidth);
      const h = Math.max(320, window.innerHeight);
      st.w = w; st.h = h; st.dpr = dpr;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      st.res = clamp(Math.round(Math.min(w, h) / (st.coarse ? 26 : 30)), 22, 34);
      st.cols = Math.floor(w / st.res) + 2;
      st.rows = Math.floor(h / st.res) + 2;
      const grid = new Array(st.cols * st.rows);
      let k = 0;
      for (let y = 0; y < st.rows; y++)
        for (let x = 0; x < st.cols; x++)
          grid[k++] = { x: x * st.res, y: y * st.res, vx: 0, vy: 0 };
      st.grid = grid;
      const area = (w * h) / (1000 * 1000);
      const base = st.reduced || st.coarse ? 560 : 980;
      const count = clamp(Math.floor(base * area), st.coarse ? 260 : 520, st.coarse ? 900 : 1400);
      const parts = new Array(count);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        parts[i] = { x, y, px: x, py: y, vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6, ink: Math.random() > 0.58 ? 0 : 1, life: Math.random() * 900 };
      }
      st.particles = parts;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    };

    const drawMesh = () => {
      const { w, h, res } = st;
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(0,0,0,0.035)";
      for (let x = 0; x <= w; x += res) { ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); ctx.stroke(); }
      for (let y = 0; y <= h; y += res) { ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); ctx.stroke(); }
      ctx.strokeStyle = "rgba(126,43,255,0.06)";
      for (let x = 0; x <= w; x += res * 6) { ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); ctx.stroke(); }
      for (let y = 0; y <= h; y += res * 6) { ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); ctx.stroke(); }
      ctx.restore();
    };

    const gridAt = (x, y) => {
      const cx = clamp(Math.floor(x / st.res), 0, st.cols - 1);
      const cy = clamp(Math.floor(y / st.res), 0, st.rows - 1);
      return st.grid[cy * st.cols + cx];
    };

    const tick = (ts) => {
      rafRef.current = requestAnimationFrame(tick);
      const frameMin = 1000 / st.fps;
      if (st.lastFrameTs && ts - st.lastFrameTs < frameMin) return;
      st.lastFrameTs = ts;
      const dt = st.lastTs ? clamp((ts - st.lastTs) / 16.6667, 0.5, 1.8) : 1;
      st.lastTs = ts;
      const { w, h } = st;
      const ptr = pointerRef.current || { x: w * 0.5, y: h * 0.5, active: false };
      const mx = clamp(ptr.x ?? w * 0.5, 0, w);
      const my = clamp(ptr.y ?? h * 0.5, 0, h);
      ctx.fillStyle = st.reduced || st.coarse ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.13)";
      ctx.fillRect(0, 0, w, h);
      st.meshTicker += dt;
      if (st.meshTicker > (st.reduced || st.coarse ? 10 : 6)) { st.meshTicker = 0; drawMesh(); }
      const influence = st.reduced || st.coarse ? 150 : 210;
      const inv = 1 / influence;
      for (let i = 0; i < st.grid.length; i++) {
        const g = st.grid[i];
        const dx = mx - g.x; const dy = my - g.y;
        const dist = Math.hypot(dx, dy);
        if (dist < influence) {
          const force = (influence - dist) * inv;
          const ang = Math.atan2(dy, dx);
          const swirl = st.reduced || st.coarse ? 1.1 : 1.9;
          g.vx += Math.cos(ang + Math.PI / 2) * force * swirl * dt;
          g.vy += Math.sin(ang + Math.PI / 2) * force * swirl * dt;
          g.vx += Math.cos(ang) * force * 0.16 * dt;
          g.vy += Math.sin(ang) * force * 0.16 * dt;
        }
        g.vx *= st.reduced || st.coarse ? 0.93 : 0.945;
        g.vy *= st.reduced || st.coarse ? 0.93 : 0.945;
      }
      const parts = st.particles;
      ctx.lineWidth = st.reduced || st.coarse ? 0.8 : 0.6;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.px = p.x; p.py = p.y;
        const g = gridAt(p.x, p.y);
        if (g) { p.vx += g.vx * (st.reduced || st.coarse ? 0.07 : 0.09) * dt; p.vy += g.vy * (st.reduced || st.coarse ? 0.07 : 0.09) * dt; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.vx *= st.reduced || st.coarse ? 0.965 : 0.955;
        p.vy *= st.reduced || st.coarse ? 0.965 : 0.955;
        p.life += dt;
        if (p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20 || p.life > 2600) {
          p.x = Math.random() * w; p.y = Math.random() * h;
          p.px = p.x; p.py = p.y;
          p.vx = (Math.random() - 0.5) * 0.6; p.vy = (Math.random() - 0.5) * 0.6;
          p.ink = Math.random() > 0.58 ? 0 : 1; p.life = 0;
          continue;
        }
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = p.ink === 0 ? "rgba(126,43,255,0.20)" : "rgba(10,10,16,0.12)";
        ctx.stroke();
      }
    };

    const onResize = () => setup();
    const onVis = () => {
      cancelAnimationFrame(rafRef.current);
      st.lastTs = 0; st.lastFrameTs = 0;
      if (!document.hidden) rafRef.current = requestAnimationFrame(tick);
    };

    setup();
    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      cancelAnimationFrame(rafRef.current);
    };
  }, [pointerRef]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />;
}

/* -------------------- LIVE SURFACE (SINGLE IFRAME, PREVIEW + MODAL) -------------------- */
function LiveSurface({ project, mode, targetEl, onClose, reduced, coarse }) {
  const hostRef = useRef(null);
  const iframeRef = useRef(null);
  const closeBtnRef = useRef(null);
  const rafRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mode) setMounted(true);
    if (!mode) {
      const t = setTimeout(() => setMounted(false), 240);
      return () => clearTimeout(t);
    }
  }, [mode]);

  useLayoutEffect(() => {
    if (!mounted) return;
    if (!hostRef.current) return;
    const el = hostRef.current;
    const placePreview = () => {
      if (!targetEl) return;
      const r = targetEl.getBoundingClientRect();
      const pad = 10;
      el.style.left = `${Math.round(r.left + pad)}px`;
      el.style.top = `${Math.round(r.top + pad)}px`;
      el.style.width = `${Math.max(1, Math.round(r.width - pad * 2))}px`;
      el.style.height = `${Math.max(1, Math.round(r.height - pad * 2))}px`;
      el.style.borderRadius = `32px`;
      el.style.opacity = "1";
      el.style.transform = "translateZ(0)";
    };
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      if (mode !== "preview") return;
      placePreview();
    };
    if (mode === "preview") {
      loop();
      return () => cancelAnimationFrame(rafRef.current);
    }
  }, [mounted, mode, targetEl]);

  useEffect(() => {
    if (!mounted) return;
    if (!iframeRef.current) return;
    if (!project?.link) return;
    iframeRef.current.src = project.link;
  }, [mounted, project?.link]);

  useEffect(() => {
    if (mode === "modal" && mounted && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [mode, mounted]);

  if (!mounted) return null;

  if (mode === "modal") {
    return (
      <div
        className="fixed inset-0 z-[220]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="live-surface-title"
      >
        <div
          className="absolute inset-0 bg-white/90 backdrop-blur-xl"
          onMouseDown={() => !coarse && onClose?.()}
        />
        <div className="absolute inset-0 p-3 md:p-10">
          <div className="w-full h-full rounded-[2.5rem] border border-black/10 bg-white shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 md:p-6 border-b border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                  <span className="text-[10px] font-black tracking-[0.4em]">BN</span>
                </div>
                <div className="min-w-0">
                  <div id="live-surface-title" className="text-xl md:text-2xl font-black tracking-tight truncate">{project?.title}</div>
                  <div className="text-[10px] font-mono tracking-[0.35em] uppercase text-zinc-400 truncate">
                    {project?.category} // {project?.tags?.join(" · ")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={project?.link}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden md:inline-flex items-center gap-2 px-5 py-3 rounded-full bg-black text-white font-black tracking-[0.18em] uppercase text-[11px] hover:bg-[var(--violet)] transition-colors"
                >
                  View Live <ExternalLink size={14} />
                </a>
                <button
                  ref={closeBtnRef}
                  onClick={onClose}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full hover:bg-zinc-100 transition-colors"
                  aria-label="Close preview"
                >
                  <X size={22} />
                </button>
              </div>
            </div>
            <div className="relative flex-1 bg-zinc-50">
              <iframe
                ref={iframeRef}
                title={project?.title || "Live"}
                className="absolute inset-0 w-full h-full border-0"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 flex items-end justify-between pointer-events-none">
                <div className="pointer-events-auto max-w-md p-5 md:p-7 rounded-2xl bg-white/80 backdrop-blur-md border border-black/5 shadow-xl">
                  <div className="text-[10px] font-mono tracking-[0.35em] uppercase text-zinc-400">Core Objective</div>
                  <div className="mt-2 text-[15px] md:text-[16px] font-semibold leading-tight text-zinc-700">
                    Merged micro-mesh + typographic dominance. One live surface. Zero browser death.
                  </div>
                  <a
                    href={project?.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-black text-white font-black tracking-[0.16em] uppercase text-[11px] hover:bg-[var(--violet)] transition-colors"
                  >
                    Open Live <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
            <div className="p-4 text-center text-[9px] font-mono tracking-[0.5em] uppercase text-zinc-400 border-t border-black/5">
              System Stable // Single Surface // Reduced-Churn
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "preview" && !reduced && !coarse) {
    return (
      <div
        ref={hostRef}
        className="fixed z-[60] pointer-events-none overflow-hidden border border-black/10 shadow-2xl"
        style={{ left: 0, top: 0, width: 1, height: 1, borderRadius: 32, background: "white" }}
        aria-hidden="true"
      >
        <iframe
          ref={iframeRef}
          title="Preview"
          className="absolute inset-0 w-[400%] h-[400%] origin-top-left scale-[0.25] border-0"
          style={{ filter: "grayscale(1) contrast(1.05)", opacity: 0.20 }}
          loading="eager"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(560px 360px at 50% 70%, rgba(126,43,255,0.18), rgba(126,43,255,0) 60%)" }}
        />
      </div>
    );
  }

  return null;
}

/* -------------------- NAV -------------------- */
function Nav() {
  return (
    <nav className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-[100] mix-blend-difference text-white">
      <div className="flex items-center gap-2 group cursor-pointer select-none">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:bg-[var(--violet)] transition-colors duration-500">
          <Flame size={16} className="text-black group-hover:text-white" />
        </div>
        <span className="font-black text-xl tracking-tighter uppercase">BNDR LLC</span>
      </div>
      <div className="flex gap-8 font-mono text-[10px] tracking-[0.3em] uppercase hidden md:flex">
        <a href="#work" className="hover:text-[var(--violet)] transition-colors">Work</a>
        <a href="#vision" className="hover:text-[var(--violet)] transition-colors">Vision</a>
        <a href="#contact" className="hover:text-[var(--violet)] transition-colors">Ignite</a>
      </div>
    </nav>
  );
}

/* -------------------- TILE -------------------- */
function Tile({ project, index, onOpen, onPreviewIntent, onPreviewExit, enableLayout }) {
  const ref = useRef(null);
  const seen = useOnceInView(ref);

  const spans = [
    "md:col-span-7 md:row-span-2",
    "md:col-span-5 md:row-span-1",
    "md:col-span-5 md:row-span-2",
    "md:col-span-7 md:row-span-1",
    "md:col-span-12 md:row-span-1",
    "md:col-span-4 md:row-span-1",
    "md:col-span-4 md:row-span-1",
    "md:col-span-4 md:row-span-1"
  ];

  const skin = useMemo(() => {
    const seed = (index * 73) % 100;
    const ax = 18 + (seed % 62); const ay = 16 + (seed % 34);
    const bx = 78 - (seed % 40); const by = 22 + (seed % 28);
    return {
      backgroundImage: `
        radial-gradient(900px 520px at ${ax}% ${ay}%, rgba(126,43,255,0.22), rgba(126,43,255,0) 60%),
        radial-gradient(780px 520px at ${bx}% ${by}%, rgba(0,0,0,0.10), rgba(0,0,0,0) 62%),
        linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)
      `,
      backgroundSize: "auto, auto, 28px 28px, 28px 28px"
    };
  }, [index]);

  return (
    <m.div
      ref={ref}
      {...(enableLayout ? { layoutId: `card-${project.id}` } : {})}
      initial={{ opacity: 0, y: 26, scale: 0.97 }}
      animate={seen ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`${spans[index % spans.length]} group relative rounded-[2rem] overflow-hidden bg-white border border-zinc-200 cursor-pointer hover:shadow-2xl hover:shadow-[var(--violet)]/20 transition-all duration-700`}
      data-beam
      onPointerEnter={(e) => onPreviewIntent?.(project, e.currentTarget)}
      onPointerLeave={() => onPreviewExit?.()}
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(project); }
      }}
    >
      <div className="absolute inset-0 z-0" style={skin} />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-white via-white/40 to-transparent group-hover:opacity-0 transition-opacity duration-700" />
      <div className="absolute inset-0 p-7 md:p-8 flex flex-col justify-between z-10">
        <div className="flex justify-between items-start gap-3">
          <div className="flex gap-2 flex-wrap">
            {project.tags.map((t) => (
              <span key={t} className="px-3 py-1 bg-black text-white text-[8px] font-mono tracking-widest uppercase rounded-full">
                {t}
              </span>
            ))}
          </div>
          <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-[var(--violet)] group-hover:text-white transition-all duration-500">
            <ArrowUpRight size={20} />
          </div>
        </div>
        <div>
          <div className="text-[10px] font-mono tracking-[0.35em] uppercase text-zinc-400">
            {project.category}
          </div>
          <h3 className="mt-2 text-4xl md:text-6xl font-black tracking-tighter text-black leading-[0.9] italic group-hover:not-italic transition-all duration-500">
            {project.title}
          </h3>
        </div>
      </div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div
          className="absolute -inset-24"
          style={{ background: "radial-gradient(520px 320px at var(--px,50%) var(--py,40%), rgba(126,43,255,0.16), rgba(126,43,255,0) 60%)" }}
        />
      </div>
    </m.div>
  );
}

/* -------------------- APP -------------------- */
export default function App() {
  const reduced = useReducedMotion();
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const coarse = useMemo(() => mq("(pointer: coarse)"), []);
  const fine = !coarse;

  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [hoverEl, setHoverEl] = useState(null);
  const hoverTimer = useRef(0);

  useEffect(() => {
    const onMove = (e) => { pointerRef.current.x = e.clientX; pointerRef.current.y = e.clientY; pointerRef.current.active = true; };
    const onLeave = () => (pointerRef.current.active = false);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      const t = e.target?.closest?.("[data-beam]");
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty("--px", `${((e.clientX - r.left) / r.width) * 100}%`);
      t.style.setProperty("--py", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const onPreviewIntent = (project, el) => {
    if (!fine || reduced || selected) return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => { setHovered(project); setHoverEl(el); }, 160);
  };

  const onPreviewExit = () => {
    window.clearTimeout(hoverTimer.current);
    setHovered(null);
    setHoverEl(null);
  };

  const openModal = (project) => {
    window.clearTimeout(hoverTimer.current);
    setHovered(null);
    setHoverEl(null);
    setSelected(project);
  };

  const closeModal = () => setSelected(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const liveMode = selected ? "modal" : hovered ? "preview" : null;
  const liveProject = selected || hovered;
  const enableLayout = fine && !reduced;

  return (
    <LazyMotion features={domAnimation}>
      <div className="bg-white text-black min-h-screen overflow-x-hidden">
        <MicroMeshField pointerRef={pointerRef} />
        <Nav />

        <LiveSurface
          project={liveProject}
          mode={liveMode}
          targetEl={hoverEl}
          onClose={closeModal}
          reduced={reduced}
          coarse={coarse}
        />

        <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
          <m.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full border border-black/5 bg-white/70 backdrop-blur-md font-mono text-[10px] tracking-[0.4em] uppercase text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-[var(--violet)] shadow-[0_0_0_8px_rgba(126,43,255,0.10)]" />
              MICRO-MESH ACTIVE // SINGLE SURFACE
            </div>
            <h1 className="text-[15vw] md:text-[12vw] font-[950] leading-[0.78] tracking-[-0.06em] uppercase italic select-none">
              Stand<br />
              <span className="text-[var(--violet)] not-italic">Out.</span>
            </h1>
            <p className="mt-10 max-w-2xl mx-auto font-semibold text-lg md:text-xl text-zinc-500 leading-tight">
              A living interface: typography is the UI. Motion is causality.
              The mesh is the atmosphere. Nothing runs unless it earns its keep.
            </p>
          </m.div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
            <div className="flex whitespace-nowrap bndr-marquee">
              <div className="text-[15vw] font-black uppercase tracking-tighter px-4">Phoenix / Scottsdale / Sedona /&nbsp;</div>
              <div className="text-[15vw] font-black uppercase tracking-tighter px-4">Phoenix / Scottsdale / Sedona /&nbsp;</div>
            </div>
          </div>
        </section>

        <main id="work" className="relative z-10 px-4 md:px-10 pb-40 max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[340px] md:auto-rows-[450px] gap-6">
            {PROJECTS.map((p, i) => (
              <Tile
                key={p.id}
                project={p}
                index={i}
                onOpen={openModal}
                onPreviewIntent={onPreviewIntent}
                onPreviewExit={onPreviewExit}
                enableLayout={enableLayout}
              />
            ))}
          </div>
        </main>

        <section id="vision" className="relative z-10 px-6 pb-40">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-[2.5rem] border border-black/5 bg-white/70 backdrop-blur-xl p-8 md:p-12 shadow-[0_30px_120px_rgba(7,7,10,0.06)]">
              <div className="font-mono text-[10px] tracking-[0.5em] uppercase text-zinc-400">VISION</div>
              <div className="mt-5 text-3xl md:text-6xl font-black tracking-[-0.05em] leading-[0.95]">
                The web is a physics problem.
                <span className="text-[var(--violet)]"> Your interface should behave like matter.</span>
              </div>
              <div className="mt-6 text-zinc-500 font-semibold text-base md:text-lg leading-relaxed max-w-3xl">
                One governing metaphor. One accent. One surface of truth. The rest is silence.
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="relative z-10 py-40 px-6 text-center bg-black text-white overflow-hidden">
          <div className="absolute inset-0 opacity-35 pointer-events-none">
            <div className="absolute -inset-40" style={{ background: "radial-gradient(900px 520px at 50% 60%, rgba(126,43,255,0.75), rgba(126,43,255,0) 60%)" }} />
          </div>
          <div className="relative max-w-4xl mx-auto">
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 italic leading-[0.85]">
              TURN IT<br />
              <span className="not-italic text-[var(--violet)]">UP.</span>
            </h2>
            <p className="font-mono text-xs tracking-[0.5em] text-white/40 mb-12 uppercase">
              SYSTEMS ONLY // NO TEMPLATES // NO DRAG
            </p>
            <a
              href="mailto:hello@bndr.llc?subject=IGNITE%20PROJECT&body=What%20are%20we%20building%3F%0A%0ABudget%3A%0ATimeline%3A%0AOutcome%3A"
              className="group relative inline-flex items-center justify-center px-12 py-6 bg-white text-black font-black text-2xl rounded-full overflow-hidden transition-transform duration-500 hover:scale-[1.03]"
            >
              <span className="relative z-10">IGNITE PROJECT</span>
              <div className="absolute inset-0 bg-[var(--violet)] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute -inset-24 bg-[radial-gradient(520px_260px_at_50%_120%,rgba(255,255,255,0.30),transparent_60%)]" />
              </div>
            </a>
          </div>
        </section>

        <footer className="relative z-10 p-10 text-center border-t border-black/5 font-mono text-[9px] tracking-[0.5em] text-zinc-400 uppercase">
          ©2026 BNDR LLC // ALL RIGHTS RESERVED // SERVING PHOENIX/SCOTTSDALE/SEDONA
        </footer>
      </div>
    </LazyMotion>
  );
}
