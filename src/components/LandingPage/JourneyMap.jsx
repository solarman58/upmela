import React, { useEffect, useRef, useState } from 'react';

// Helper: measure approximate text width so we can size pills correctly
const approxTextWidth = (text, fontSize) => text.length * fontSize * 0.65;

const JourneyMap = ({
  id, pathD, pathWidth = 14, dashWidth = 4,
  startNode, endNode, nodes, etas,
  title, subtitle, titleGradient = "from-blue-600 via-indigo-500 to-purple-500",
  duration = "16s", characterImg, flipCharacter = false,
  gradientColors = ["#14b8a6", "#3b82f6", "#a855f7", "#ec4899"]
}) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeNodeIdx, setActiveNodeIdx] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Sync floating card with character animation based on exact X-coordinates
  useEffect(() => {
    if (!isVisible) return;
    
    // Parse duration string like "16s" or "20s"
    const durationMs = (parseFloat(duration) || 16) * 1000;
    
    const allNodesArr = [startNode, ...(nodes || []), endNode];
    const minX = startNode.x;
    const maxX = endNode.x;
    const rangeX = maxX - minX || 1;
    
    // Estimate exact timestamp for each node based on X-coordinate progression
    const nodeTimes = allNodesArr.map(n => {
      const pct = (n.x - minX) / rangeX;
      return pct * durationMs;
    });
    
    const startTime = Date.now();
    let raf;
    
    const checkTime = () => {
      // Modulo duration to perfectly sync with infinite repeat of animateMotion
      const elapsed = (Date.now() - startTime) % durationMs;
      
      let currentIdx = 0;
      for (let i = 0; i < nodeTimes.length; i++) {
        // Trigger status change slightly before (300ms) reaching the actual point for better UX
        if (elapsed >= Math.max(0, nodeTimes[i] - 300)) {
          currentIdx = i;
        }
      }
      
      setActiveNodeIdx(prev => (prev !== currentIdx ? currentIdx : prev));
      raf = requestAnimationFrame(checkTime);
    };
    
    raf = requestAnimationFrame(checkTime);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, nodes, startNode, endNode, duration]);

  const charH  = isMobile ? 110 : 150;
  const charW  = isMobile ?  75 : 110;
  // Center the character horizontally on the path point
  const charX  = -charW / 2;
  const charY  = -charH;

  // Font sizes — balanced for readability without being massive
  const fsLabel = isMobile ? 11 : 12;
  const fsEta   = isMobile ? 10 : 11;
  const padding = 18; // horizontal pill padding each side

  // Get current active node for the live status card
  const allNodes = [
    { title: `Start: ${startNode.label}`, icon: '📍', color: startNode.baseColor },
    ...nodes.map(n => ({ title: n.title, icon: n.icon, color: n.nodeColor })),
    { title: `Arrived: ${endNode.title}`, icon: endNode.icon, color: endNode.baseColor }
  ];
  const currentNode = allNodes[activeNodeIdx];

  return (
    <div className="w-full max-w-7xl mx-auto mt-10 md:mt-16 mb-0 px-0 md:px-6">

      {title && (
        <div className="text-center mb-4 md:mb-8 px-4">
          <h3 className="text-xl md:text-[2.5rem] leading-[1.1] font-extrabold mb-2 tracking-tight">
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${titleGradient}`}>{title}</span>
          </h3>
          {subtitle && (
            <p className="text-slate-500 font-medium text-[13px] md:text-[16px] max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full relative z-10 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-[20px] md:rounded-[40px] shadow-sm border border-slate-100/60 dark:border-slate-700/60"
        style={{
          height: isMobile ? '320px' : '460px',
          overflowX: isMobile ? 'auto' : 'hidden',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <style>{`
          .pd-${id}  { stroke-dasharray:4000;stroke-dashoffset:4000;
            animation:${isVisible?`dr-${id} 2.5s cubic-bezier(0.2,0.8,0.2,1) forwards`:'none'}; }
          @keyframes dr-${id} { to { stroke-dashoffset: 0; } }
          .fd-${id}  { animation:${isVisible?`fd-${id}a 35s linear infinite`:'none'}; }
          @keyframes fd-${id}a { to { stroke-dashoffset: -1000; } }
          .pr-${id}  { animation: rp-${id} 2s cubic-bezier(0.4,0,0.6,1) infinite; }
          @keyframes rp-${id}  { 0%{r:10;opacity:.8} 100%{r:50;opacity:0} }
          .br-${id}  { animation: br-${id}a 3s cubic-bezier(0.1,0.8,0.3,1) infinite; }
          @keyframes br-${id}a { 0%{r:20;opacity:1;stroke-width:10} 100%{r:80;opacity:0;stroke-width:0} }
          .cb-${id}  { animation:${isVisible?`cb-${id}a 0.5s ease-in-out infinite alternate`:'none'}; }
          @keyframes cb-${id}a { 0%{transform:translateY(0px)} 100%{transform:translateY(-6px)} }
          .glass-card{background:rgba(255,255,255,.5);backdrop-filter:blur(20px);
            -webkit-backdrop-filter:blur(20px);
            border:1px solid rgba(255,255,255,.85);
            box-shadow:0 12px 40px rgba(15,23,42,.08),inset 0 1px 0 rgba(255,255,255,1);
            transition:all .4s cubic-bezier(.175,.885,.32,1.275);}
          .glass-card:hover{transform:translateY(-8px) scale(1.06);}
          .theme-dark .glass-card { background: rgba(30,41,59,.7); border: 1px solid rgba(255,255,255,.1); box-shadow: 0 12px 40px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.05); }
        `}</style>

        <svg
          width={isMobile ? 1220 : undefined}
          height={isMobile ? 320  : undefined}
          viewBox={isMobile ? "0 100 1220 280" : "0 0 1200 460"}
          preserveAspectRatio={isMobile ? "none" : "xMidYMid meet"}
          className="absolute inset-0"
          style={{ display:'block', overflow:'visible',
            minWidth: isMobile ? '1220px' : undefined }}
        >
          <defs>
            <linearGradient id={`g-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              {gradientColors.map((c,i) => (
                <stop key={i} offset={`${(i/(gradientColors.length-1))*100}%`} stopColor={c}/>
              ))}
            </linearGradient>
            {/* Removed expensive feGaussianBlur filter */}
          </defs>

          {/* Glow path - using simple stroke opacity instead of expensive SVG filter */}
          <path d={pathD} fill="none" stroke={`url(#g-${id})`}
            strokeWidth={pathWidth} strokeLinecap="round" strokeLinejoin="round"
            className={`pd-${id}`} opacity="0.3"/>
          {/* Solid path */}
          <path d={pathD} fill="none" stroke={`url(#g-${id})`}
            strokeWidth={pathWidth} strokeLinecap="round" strokeLinejoin="round"
            className={`pd-${id}`}/>
          {/* Flow dashes */}
          <path d={pathD} fill="none" stroke="#fff"
            strokeWidth={dashWidth} strokeLinecap="round" strokeDasharray="12 16"
            className={`pd-${id} fd-${id}`} opacity="0.9"/>

          {/* ══ CHARACTER ══
              Strategy: place image centered at x=0,y=0 relative to animateMotion origin.
              To flip: use transform="translate(charW/2,0) scale(-1,1) translate(-charW/2,0)"
              which flips horizontally around the CENTER of the image (x=charW/2 when image starts at x=0).
              But our image is at x=charX=-charW/2, so center is at x=0.
              Flip around x=0: translate(0,0) scale(-1,1) = works because charX = -charW/2 → mirrored to charW/2-charW = -charW/2 ... 
              Actually: image left edge at charX=-charW/2, right edge at charX+charW=charW/2.
              After scale(-1,1): left edge at -(-charW/2)=charW/2, right edge at -(charW/2)=-charW/2.
              So image still occupies -charW/2 to charW/2 — just mirrored. ✓
          */}
          {isVisible && (
            <g>
              <animateMotion dur={duration} repeatCount="indefinite" path={pathD}/>
              {/* Bob animation wrapper */}
              <g className={`cb-${id}`}>
                <image
                  href={characterImg}
                  x={charX}
                  y={charY}
                  width={charW}
                  height={charH}
                  preserveAspectRatio="xMidYMid meet"
                  transform={flipCharacter
                    /* flip around image center (x=0 since charX=-charW/2) */
                    ? `translate(${charX + charW}, ${charY}) scale(-1, 1) translate(${-(charX)}, ${-(charY)})`
                    : undefined
                  }
                  loading="lazy"
                  style={{ filter:'drop-shadow(0 4px 16px rgba(0,0,0,0.2))' }}
                />
              </g>
            </g>
          )}

          {/* ══ START NODE ══ */}
          <g transform={`translate(${startNode.x},${startNode.y})`}>
            {isVisible && (
              <>
                <circle cx="0" cy="5" r="10" fill="none" stroke={startNode.baseColor} strokeWidth="2" className={`pr-${id}`}/>
                <circle cx="0" cy="5" r="10" fill="none" stroke={startNode.baseColor} strokeWidth="1" className={`pr-${id}`} style={{animationDelay:'1s'}}/>
              </>
            )}
            <ellipse cx="0" cy="15" rx="55" ry="18" fill={startNode.baseColor} opacity="0.15"/>
            <ellipse cx="0" cy="5"  rx="45" ry="14" fill="none" stroke={startNode.baseColor} strokeWidth="3" opacity="0.6"/>
            <ellipse cx="0" cy="0"  rx="38" ry="11" fill={startNode.baseColor} opacity="0.3"/>
            {/* Map Pin */}
            <circle cx="0" cy="-28" r="14" fill="white" stroke={startNode.baseColor} strokeWidth="2" style={{ filter:'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }} />
            <text x="0" y="-23" textAnchor="middle" fontSize="16">📍</text>
          </g>

          {/* ══ END NODE ══ */}
          <g transform={`translate(${endNode.x},${endNode.y})`}>
            {isVisible && (
              <>
                <circle cx="0" cy="5" r="20" fill="none" stroke={endNode.baseColor} strokeWidth="10" className={`br-${id}`}/>
                <circle cx="0" cy="5" r="20" fill="none" stroke={endNode.baseColor} strokeWidth="5"  className={`br-${id}`} style={{animationDelay:'1.5s'}}/>
              </>
            )}
            <ellipse cx="0" cy="15" rx="50" ry="18" fill={endNode.baseColor} opacity="0.15"/>
            <ellipse cx="0" cy="5"  rx="40" ry="14" fill={endNode.baseColor} opacity="0.8"/>
            <ellipse cx="0" cy="0"  rx="35" ry="11" fill="#fff" opacity="0.9"/>
            <circle  cx="0" cy="0"  r="5"           fill={endNode.baseColor}/>
            <line x1="0" y1="-15" x2="0" y2="-38" stroke={endNode.baseColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.6"/>
            {/* Premium Map Pin */}
            <circle cx="0" cy="-48" r="16" fill="white" stroke={endNode.baseColor} strokeWidth="2" style={{ filter:'drop-shadow(0 6px 10px rgba(0,0,0,0.15))' }} />
            <text x="0" y="-42" textAnchor="middle" fontSize={isMobile ? 18 : 20}>{endNode.icon}</text>
          </g>

          {/* ══ INTERMEDIATE NODES — stagger labels above/below alternately ══ */}
          {nodes.map((node, idx) => {
            const above = idx % 2 === 0; // even nodes: label above; odd: below path
            const labelY = above ? -62 : 60;
            const lineY2 = above ? -38 : 36;
            return (
              <g key={idx} transform={`translate(${node.x},${node.y})`}>
                <line x1="0" y1="0" x2="0" y2={lineY2} stroke={node.nodeColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.6"/>
                <circle cx="0" cy="0" r={isMobile ? 9 : 12} fill="white" stroke={node.nodeColor} strokeWidth="4"/>
                <circle cx="0" cy="0" r={isMobile ? 4 : 5}  fill={node.nodeColor}/>
                {/* Map Pin */}
                <circle cx="0" cy={above ? -48 : 44} r="14" fill="white" stroke={node.nodeColor} strokeWidth="2" style={{ filter:'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }} />
                <text x="0" y={above ? -42 : 50} textAnchor="middle" fontSize={isMobile ? 18 : 20}>{node.icon}</text>
              </g>
            );
          })}

          {/* ══ ETA PILLS — auto-sized ══ */}
          {etas.map((eta, idx) => {
            const etaText = `${eta.time}  ${eta.dist}`;
            const w = approxTextWidth(etaText, fsEta) + padding * 2;
            const h = isMobile ? 22 : 18;
            return (
              <g key={idx} transform={`translate(${eta.x},${eta.y})`}
                opacity={isVisible ? 1 : 0}
                style={{ transition: `opacity .8s ease ${1 + idx * 0.3}s` }}>
                <rect x={-w/2} y={-h} width={w} height={h} rx={h/2}
                  fill="white" opacity="0.92"
                  style={{ filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }}/>
                <text x={0} y={-h/2+1} fill="#1e293b" fontSize={fsEta} fontWeight="bold"
                  textAnchor="middle" fontFamily="system-ui,sans-serif" dominantBaseline="middle">
                  {etaText}
                </text>
              </g>
            );
          })}

        </svg>

        {/* HTML glass cards — desktop only, they need space above container */}
        {!isMobile && isVisible && (
          <>
            <div className="absolute flex flex-col items-center transition-all duration-700 delay-[1200ms]"
              style={{left:`calc(${(endNode.x/1200)*100}% - 75px)`,top:`calc(${(endNode.y/460)*100}% - 200px)`}}>
              <div className="glass-card rounded-[24px] p-4 flex flex-col items-center w-[150px] cursor-pointer">
                <div className={`absolute -top-4 ${endNode.iconBgColor} text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg text-xl z-30 ring-4 ring-white/50`}>{endNode.icon}</div>
                <img src={endNode.img} alt={endNode.title} loading="lazy" className="w-24 h-auto object-contain mt-3 mb-2 drop-shadow-xl"/>
                <span className="text-[14px] font-bold text-slate-800 text-center leading-tight">{endNode.title}</span>
                <span className={`text-[10px] font-black uppercase tracking-wider ${endNode.levelColor} mt-1`}>{endNode.level}</span>
              </div>
            </div>
            {nodes.map((node,idx)=>(
              <div key={idx} className="absolute flex flex-col items-center transition-all duration-700"
                style={{left:`calc(${(node.x/1200)*100}% - 75px)`,top:`calc(${(node.y/460)*100}% - 200px)`,transitionDelay:`${800+idx*200}ms`}}>
                <div className="glass-card rounded-[24px] p-4 flex flex-col items-center w-[150px] cursor-pointer">
                  <div className={`absolute -top-4 ${node.iconBgColor} text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg text-xl z-30 ring-4 ring-white/50`}>{node.icon}</div>
                  <img src={node.img} alt={node.title} loading="lazy" className="w-24 h-auto object-contain mt-3 mb-2 drop-shadow-xl"/>
                  <span className="text-[14px] font-bold text-slate-800 text-center leading-tight">{node.title}</span>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${node.levelColor} mt-1`}>{node.level}</span>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ─── LIVE FLOATING STATUS CARD ─── */}
        {isVisible && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 md:translate-x-0 md:top-6 md:left-6 z-50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl p-3 shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 transition-all duration-500 hover:scale-105 min-w-[240px]">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 transition-colors duration-500 shadow-inner" style={{ backgroundColor: `${currentNode.color}20` }}>
              <span className="drop-shadow-sm">{currentNode.icon}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: currentNode.color }}></span>
                Live Navigation
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5 animate-fade-in-up" key={currentNode.title}>
                {currentNode.title}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Mobile swipe hint */}
      {isMobile && (
        <div className="flex items-center justify-center gap-2 mt-2 text-slate-400 text-[11px] font-medium select-none">
          <span>←</span><span>Swipe to follow the journey</span><span>→</span>
        </div>
      )}
    </div>
  );
};

export default JourneyMap;
