import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMapStore } from '../../store/useMapStore';

/* ─────────────────────────────────────────────────────────────────────────────
   KUMBH MELA SPIRITUAL LOADING PHASES
───────────────────────────────────────────────────────────────────────────── */
const PHASES = [
  'महाकुंभ प्रयागराज से जुड़ रहे हैं...',
  'मेला ग्राउंड व पावन संगम तट लोड हो रहा है...',
  '22 सेक्टर और घाटों का नक्शा तैयार हो रहा है...',
  'अखाड़े, शिविर और सुविधाएं मैप की जा रही हैं...',
  'मार्ग और नेविगेशन ग्रिड तैयार किया जा रहा है...',
  'हर हर गंगे! पावन दर्शन के लिए तैयार!',
];

const STEPS = [
  { label: 'संगम क्षेत्र', icon: '🌊' },
  { label: '22 सेक्टर', icon: '⛺' },
  { label: 'अखाड़े व घाट', icon: '🚩' },
  { label: 'मार्ग दर्शन', icon: '🧭' },
];

export default function LoadingScreen() {
  const dataLoaded = useMapStore(s => s.dataLoaded);
  const appSettings = useMapStore(s => s.appSettings);
  const [progress, setProgress] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [apiDone, setApiDone] = useState(false);

  // Simulate progress up to 85% while waiting for API
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const ceiling = apiDone ? 100 : 85;
        if (prev >= ceiling) {
          clearInterval(timer);
          return prev;
        }
        const next = Math.min(prev + Math.floor(Math.random() * 8) + 4, ceiling);
        setPhaseIdx(Math.min(Math.floor(next / 20), PHASES.length - 2));
        return next;
      });
    }, 120);
    return () => clearInterval(timer);
  }, [apiDone]);

  // When API data arrives, smoothly jump to 100%
  useEffect(() => {
    if (dataLoaded) {
      setApiDone(true);
      setProgress(100);
      setPhaseIdx(PHASES.length - 1);
      const hideTimer = setTimeout(() => setVisible(false), 800);
      return () => clearTimeout(hideTimer);
    }
  }, [dataLoaded]);

  const logoUrl = appSettings?.logo_url || '/maps/logo_1792058121026.png';
  const rawName = (appSettings?.name || '').replace(/202[0-9]/g, '').trim();
  const isAirportDefault = !rawName || rawName.toLowerCase().includes('airport') || rawName.toLowerCase().includes('indoor');
  const melaTitle = isAirportDefault ? 'महाकुंभ मेला प्रयागराज' : rawName;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden font-sans select-none"
          style={{
            background: 'radial-gradient(circle at 50% 35%, #2a1100 0%, #150601 50%, #0a030d 100%)'
          }}
        >
          {/* Ambient Spiritual Aura Glows */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-orange-600/20 via-amber-500/15 to-transparent blur-[120px] pointer-events-none" />
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-orange-600/10 blur-[100px] pointer-events-none" />

          {/* Sacred Concentric Rotating Rings (Mandala effect) */}
          <div className="relative mb-8 flex items-center justify-center">
            {/* Outer Slow Rotating Dashed Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
              className="absolute w-44 h-44 rounded-full border-2 border-dashed border-amber-500/25"
            />
            {/* Middle Rotating Counter-Ring with Dots */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
              className="absolute w-36 h-36 rounded-full border border-amber-400/30"
              style={{
                boxShadow: '0 0 25px rgba(245, 130, 32, 0.2)'
              }}
            />
            {/* Sacred Pulsing Aura Ring */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute w-28 h-28 rounded-full border-2 border-amber-500/50 shadow-[0_0_30px_rgba(245,130,32,0.4)]"
            />
            {/* Inner Golden Radial Glow */}
            <motion.div
              animate={{ opacity: [0.25, 0.5, 0.25] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute w-24 h-24 rounded-full bg-amber-500/25 blur-md"
            />

            {/* Emblem / Logo Container */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 via-orange-600/20 to-black/60 border-2 border-amber-400/60 flex items-center justify-center shadow-[0_0_40px_rgba(245,130,32,0.5)] overflow-hidden p-2 backdrop-blur-md"
            >
              <img
                src={logoUrl}
                alt="Kumbh Mela"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<span class="text-3xl text-amber-300">🕉️</span>';
                }}
              />
            </motion.div>
          </div>

          {/* Spiritual Header & Kumbh Mela Titles */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8 px-4 max-w-md mx-auto"
          >
            {/* Top Sacred Banner Pill */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500/60" />
              <span className="text-[10px] md:text-[11px] font-black tracking-[0.25em] text-amber-400 uppercase">
                ✦ महाकुंभ प्रयागराज ✦
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500/60" />
            </div>

            {/* Main Mela Title */}
            <h1 className="text-2xl md:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-orange-300 to-amber-200 mb-1.5 leading-tight drop-shadow-sm">
              {melaTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-xs font-bold text-amber-300/80 tracking-widest uppercase">
              22 सेक्टर • संगम • अखाड़ा • घाट डिजिटल मैप
            </p>
          </motion.div>

          {/* Sacred Saffron Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.85 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.3 }}
            className="w-72 max-w-[85vw]"
          >
            <div className="w-full h-2 rounded-full bg-slate-900/90 overflow-hidden border border-amber-500/30 p-[1px] mb-2.5 shadow-inner">
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${progress}%` }}
                style={{
                  background: 'linear-gradient(90deg, #F58220 0%, #FF9933 50%, #FFD700 100%)',
                  boxShadow: '0 0 14px rgba(245, 130, 32, 0.75)',
                }}
                transition={{ ease: 'easeOut', duration: 0.35 }}
              />
            </div>

            {/* Dynamic Status Phrase & Percentage */}
            <div className="flex items-center justify-between min-h-[22px]">
              <motion.span
                key={phaseIdx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[12px] text-amber-200/90 font-bold truncate pr-2"
              >
                {PHASES[phaseIdx]}
              </motion.span>
              <span className="text-[12px] font-black text-amber-400 font-mono tabular-nums flex-shrink-0">
                {progress}%
              </span>
            </div>
          </motion.div>

          {/* 4 Mela Milestones Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-4 gap-3 md:gap-4 mt-8 px-2 max-w-sm w-full"
          >
            {STEPS.map((step, i) => {
              const isPassed = progress > (i + 1) * 22;
              return (
                <motion.div
                  key={step.label}
                  animate={{ opacity: isPassed ? 1 : 0.35 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs mb-1 transition-all ${
                      isPassed
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-400/50 shadow-[0_0_10px_rgba(245,130,32,0.4)]'
                        : 'bg-slate-900/60 text-slate-500 border border-slate-800'
                    }`}
                  >
                    <span>{step.icon}</span>
                  </div>
                  <p className="text-[10px] font-bold text-amber-200/80 tracking-tight whitespace-nowrap">
                    {step.label}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Translucent Background Watermark */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-6 text-[70px] md:text-[110px] font-black text-amber-500 tracking-widest select-none pointer-events-none uppercase font-serif"
          >
            महाकुंभ
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
