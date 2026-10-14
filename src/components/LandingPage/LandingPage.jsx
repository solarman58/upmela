import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiMap, FiWifiOff, FiShield, FiSmartphone, 
  FiArrowRight, FiMenu, FiX, FiCheckCircle, FiLayers,
  FiCpu, FiZap, FiTrendingUp, FiSearch, FiMapPin, FiNavigation,
  FiBriefcase, FiShoppingBag, FiCamera, FiPackage, FiFlag, FiSend, FiHeart, FiGrid, FiBook,
  FiTarget, FiClock, FiActivity, FiLock, FiChevronRight, FiUsers, FiMoon, FiSun, FiHome, FiSettings, FiAlertTriangle, FiTag
} from 'react-icons/fi';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import RequestDemoModal from './RequestDemoModal';
import { useMapStore } from '../../store/useMapStore';
import LegalPage from './LegalPage';
import LanguageSelector from './LanguageSelector';
import './LandingPage.css';
import departureMap from '../../assets/maps/departure.svg';
import qrDemo from '../../assets/demo-qr.svg';
import realMan from '../../assets/real_man_alpha.png';
import realGirl from '../../assets/real_girl_alpha.png';
import isoHospital from '../../assets/iso_hospital_alpha.png';
import isoApparel from '../../assets/iso_apparel_alpha.png';
import isoFood from '../../assets/iso_food_alpha.png';
import isoRestroom from '../../assets/iso_restroom_alpha.png';
import isoGate from '../../assets/iso_gate_alpha.png';
import isoStage from '../../assets/iso_stage_alpha.png';
import isoExpo from '../../assets/iso_expo_alpha.png';
import isoFloorPlan from '../../assets/custom_map_dashboard.png';
import isoPharmacy from '../../assets/iso_pharmacy_alpha.png';
import travelerWheelchair from '../../assets/traveler_wheelchair_alpha.png';
import isoElevator from '../../assets/iso_elevator_alpha.png';
import JourneyMap from './JourneyMap';

const NAV_LINKS = ['Home', 'Features', 'Solutions', 'Pricing'];

const JourneyMapHospital = () => (
  <JourneyMap 
    id="map-hospital"
    title="The Healing Route"
    subtitle="Navigate complex hospital corridors without the stress."
    titleGradient="from-blue-500 via-indigo-500 to-purple-500"
    pathD="M 80 260 L 350 260 C 500 260, 600 240, 750 240 C 900 240, 950 320, 1100 320"
    characterImg={realMan}
    duration="20s"
    startNode={{ x: 120, y: 260, baseColor: "#10b981", label: "Reception" }}
    nodes={[
      { x: 420, y: 260, nodeColor: "#ec4899", icon: "💊", title: "Pharmacy", level: "Level 1", iconBgColor: "bg-[#ec4899]", levelColor: "text-[#ec4899]", img: isoPharmacy },
      { x: 720, y: 242, nodeColor: "#3b82f6", icon: "🩺", title: "OPD Wing", level: "Level 1", iconBgColor: "bg-[#3b82f6]", levelColor: "text-[#3b82f6]", img: isoHospital }
    ]}
    endNode={{ x: 1050, y: 320, baseColor: "#ef4444", icon: "🚪", title: "Emergency Exit", level: "Ground", iconBgColor: "bg-[#ef4444]", levelColor: "text-[#ef4444]", img: isoHospital }}
    etas={[
      { x: 250, y: 280, time: "2 min", dist: "120 m", icon: "🚶‍♂️", iconColor: "text-emerald-500" },
      { x: 550, y: 270, time: "3 min", dist: "180 m", icon: "🚶‍♂️", iconColor: "text-blue-500" },
      { x: 820, y: 340, time: "2 min", dist: "100 m", icon: "🚶‍♂️", iconColor: "text-purple-500" }
    ]}
    gradientColors={["#2dd4bf", "#3b82f6", "#a855f7", "#ec4899"]}
  />
);

const JourneyMapMall = () => (
  <JourneyMap 
    id="map-mall"
    title="The Retail Road"
    subtitle="Find your favorite brands and food courts instantly."
    titleGradient="from-amber-500 via-orange-500 to-rose-500"
    pathD="M 80 320 C 200 320, 300 260, 450 260 C 600 260, 600 320, 750 320 C 900 320, 950 280, 1100 280"
    characterImg={realGirl}
    flipCharacter={true}
    duration="22s"
    startNode={{ x: 120, y: 320, baseColor: "#10b981", label: "Main Entrance" }}
    nodes={[
      { x: 450, y: 260, nodeColor: "#a855f7", icon: "🛍️", title: "Apparel Store", level: "Level 1", iconBgColor: "bg-[#a855f7]", levelColor: "text-[#a855f7]", img: isoApparel },
      { x: 750, y: 320, nodeColor: "#f59e0b", icon: "☕", title: "Food Court", level: "Level 1", iconBgColor: "bg-[#f59e0b]", levelColor: "text-[#f59e0b]", img: isoFood }
    ]}
    endNode={{ x: 1050, y: 280, baseColor: "#3b82f6", icon: "🛒", title: "Mall Exit", level: "Level 1", iconBgColor: "bg-[#3b82f6]", levelColor: "text-[#3b82f6]", img: isoGate }}
    etas={[
      { x: 280, y: 260, time: "2 min", dist: "130 m", icon: "🚶‍♀️", iconColor: "text-emerald-500" },
      { x: 550, y: 250, time: "3 min", dist: "200 m", icon: "🚶‍♀️", iconColor: "text-blue-500" },
      { x: 880, y: 250, time: "1 min", dist: "60 m", icon: "🚶‍♀️", iconColor: "text-purple-500" }
    ]}
    gradientColors={["#2dd4bf", "#3b82f6", "#a855f7", "#ec4899"]}
  />
);

const JourneyMapEvent = () => (
  <JourneyMap 
    id="map-event"
    title="The Event Expressway"
    subtitle="Never miss a keynote. Your direct path to the main stage."
    titleGradient="from-emerald-500 via-teal-500 to-cyan-500"
    pathD="M 80 240 C 200 240, 300 320, 450 320 C 600 320, 600 260, 750 260 L 1100 260"
    characterImg={realMan}
    duration="18s"
    startNode={{ x: 120, y: 240, baseColor: "#10b981", label: "Event Check-in" }}
    nodes={[
      { x: 450, y: 320, nodeColor: "#14b8a6", icon: "🎟️", title: "Registration Desk", level: "Hall A", iconBgColor: "bg-[#14b8a6]", levelColor: "text-[#14b8a6]", img: isoExpo },
      { x: 750, y: 260, nodeColor: "#ec4899", icon: "🎤", title: "Main Stage", level: "Hall B", iconBgColor: "bg-[#ec4899]", levelColor: "text-[#ec4899]", img: isoStage }
    ]}
    endNode={{ x: 1050, y: 260, baseColor: "#eab308", icon: "👑", title: "VIP Lounge", level: "Access Only", iconBgColor: "bg-[#eab308]", levelColor: "text-[#eab308]", img: isoGate }}
    etas={[
      { x: 280, y: 290, time: "1 min", dist: "80 m", icon: "🚶‍♂️", iconColor: "text-emerald-500" },
      { x: 580, y: 270, time: "4 min", dist: "250 m", icon: "🚶‍♂️", iconColor: "text-blue-500" },
      { x: 900, y: 280, time: "2 min", dist: "150 m", icon: "🚶‍♂️", iconColor: "text-purple-500" }
    ]}
    gradientColors={["#2dd4bf", "#3b82f6", "#a855f7", "#ec4899"]}
  />
);

const JourneyMapWheelchair = () => (
  <JourneyMap 
    id="map-wheelchair"
    title="The Barrier-Free Path"
    subtitle="Smooth, accessible, and inclusive routing for everyone."
    titleGradient="from-pink-500 via-rose-500 to-orange-500"
    pathD="M 80 280 C 200 280, 250 220, 400 220 C 550 220, 650 340, 800 340 C 950 340, 1000 280, 1100 280"
    characterImg={travelerWheelchair}
    duration="24s"
    startNode={{ x: 120, y: 280, baseColor: "#3b82f6", label: "Accessible Entrance" }}
    nodes={[
      { x: 400, y: 220, nodeColor: "#14b8a6", icon: "🛗", title: "Elevator Bank", level: "Level 1", iconBgColor: "bg-[#14b8a6]", levelColor: "text-[#14b8a6]", img: isoElevator },
      { x: 800, y: 340, nodeColor: "#a855f7", icon: "♿", title: "Accessible Washroom", level: "Level 2", iconBgColor: "bg-[#a855f7]", levelColor: "text-[#a855f7]", img: isoRestroom }
    ]}
    endNode={{ x: 1050, y: 280, baseColor: "#10b981", icon: "🚪", title: "Ramp Exit", level: "Ground", iconBgColor: "bg-[#10b981]", levelColor: "text-[#10b981]", img: isoGate }}
    etas={[
      { x: 260, y: 220, time: "3 min", dist: "150 m", icon: "🧑‍🦽", iconColor: "text-blue-500" },
      { x: 600, y: 290, time: "4 min", dist: "200 m", icon: "🧑‍🦽", iconColor: "text-teal-500" },
      { x: 920, y: 270, time: "2 min", dist: "90 m", icon: "🧑‍🦽", iconColor: "text-purple-500" }
    ]}
    gradientColors={["#3b82f6", "#14b8a6", "#8b5cf6", "#10b981"]}
  />
);

export default function LandingPage({ page = 'home' }) {
  const navigate = useNavigate();
  const { isAdminMode } = useMapStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null); // 'demo' | 'trial'
  const [scrolled, setScrolled] = useState(false);

  const observerRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const navbarRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (navbarRef.current) {
        if (window.scrollY > 40) {
          navbarRef.current.classList.add('scrolled');
        } else {
          navbarRef.current.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Wait a tick for conditional DOM elements to render before observing
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observerRef.current.observe(el));
    }, 50);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [page]);

  return (
    <div className="lp-ultimate theme-light">
      {/* ─── DESKTOP NAVBAR ────────────────────────────────────────────── */}
      <nav ref={navbarRef} className="lp-navbar desktop-only-nav">
        <div className="lp-nav-container">
          <Link to="/" className="lp-nav-logo" onClick={() => window.scrollTo(0,0)} style={{ textDecoration: 'none' }}>
            <img src="/margyaan-icon.png" alt="Margyaan" className="lp-logo-img" />
            <div className="lp-logo-text">
              <div className="lp-logo-title">
                <span className="lp-mar">MAR</span>
                <span className="lp-g">G</span>
                <span className="lp-yaan">YAAN</span>
              </div>
              <span className="lp-logo-sub">INDOOR NAVIGATION SYSTEM</span>
            </div>
          </Link>
          
          <div className="lp-nav-links">
            {NAV_LINKS.map(link => (
              <Link key={link} to={link === 'Home' ? '/' : `/${link.toLowerCase()}`} className="lp-nav-link" onClick={() => window.scrollTo(0,0)}>
                {link}
              </Link>
            ))}
          </div>

          <div className="lp-nav-actions">
            {isAdminMode ? (
              <button className="lp-btn-primary" onClick={() => navigate('/app')}>Go to Dashboard</button>
            ) : (
              <>
                <button className="lp-btn-ghost" onClick={() => navigate('/login')}>Login</button>
                <button className="lp-btn-primary" onClick={() => setModalMode('trial')}>Try for Free</button>
              </>
            )}
            <button className="lp-btn-outline" onClick={() => setModalMode('demo')} style={{borderColor: 'rgba(255,255,255,0.2)', color: '#fff', display: 'none'}} >Demo</button>

            <LanguageSelector />

            <button className="lp-nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (For Tablets / Resized Desktop) */}
      <div className={`lp-mobile-menu ${menuOpen ? 'open' : ''}`}>
        {NAV_LINKS.map(link => (
          <Link key={link} to={link === 'Home' ? '/' : `/${link.toLowerCase()}`} onClick={() => { setMenuOpen(false); window.scrollTo(0,0); }}>
            {link}
          </Link>
        ))}
        {isAdminMode ? (
          <button className="lp-btn-primary" onClick={() => navigate('/app')}>Go to Dashboard</button>
        ) : (
          <button className="lp-btn-primary" onClick={() => navigate('/login')}>Admin Login</button>
        )}
      </div>

      {/* ─── MOBILE APP BAR (TOP) ──────────────────────────────────────── */}
      <div className="lp-mobile-topbar mobile-app-element">
        <Link to="/" className="lp-nav-logo" onClick={() => window.scrollTo(0,0)} style={{ textDecoration: 'none' }}>
          <img src="/margyaan-icon.png" alt="Margyaan" className="lp-logo-img" />
          <div className="lp-logo-text ml-2">
            <div className="lp-logo-title" style={{ fontSize: '1.25rem' }}>
              <span className="lp-mar dark:text-slate-100">MAR</span>
              <span className="lp-g">G</span>
              <span className="lp-yaan">YAAN</span>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          {isAdminMode ? (
            <button className="lp-btn-primary lp-btn-sm" onClick={() => navigate('/app')}>Dashboard</button>
          ) : (
            <button className="lp-btn-primary lp-btn-sm" onClick={() => setModalMode('trial')}>Try Free</button>
          )}

        </div>
      </div>

      {/* ─── MOBILE BOTTOM NAV (APP STYLE) ─── */}
      <div className="lp-mobile-bottom-nav mobile-app-element">
        <Link to="/" className={`lp-bot-nav-item ${page === 'home' ? 'active' : ''}`} onClick={() => window.scrollTo(0,0)}>
          <FiHome />
          <span>Home</span>
        </Link>
        <Link to="/features" className={`lp-bot-nav-item ${page === 'features' ? 'active' : ''}`} onClick={() => window.scrollTo(0,0)}>
          <FiZap />
          <span>Features</span>
        </Link>
        <Link to="/solutions" className={`lp-bot-nav-item ${page === 'solutions' ? 'active' : ''}`} onClick={() => window.scrollTo(0,0)}>
          <FiGrid />
          <span>Solutions</span>
        </Link>
        <Link to="/pricing" className={`lp-bot-nav-item ${page === 'pricing' ? 'active' : ''}`} onClick={() => window.scrollTo(0,0)}>
          <FiTag />
          <span>Pricing</span>
        </Link>
      </div>

      {/* ─── HERO SECTION ──────────────────────────────────────── */}
      {page === 'home' && (
      <header className="lp-hero" id="home">
        <div className="lp-hero-bg-shapes">
          <div className="lp-shape lp-shape-1"></div>
          <div className="lp-shape lp-shape-2"></div>
          <div className="lp-shape lp-shape-3"></div>
        </div>

        <div className="lp-container lp-hero-grid">
          <div className="lp-hero-content reveal">
            
            <h1 className="lp-hero-title">
              Navigate Complex Spaces <br/>
              <span className="lp-text-gradient">With Zero Friction.</span>
            </h1>
            
            <p className="lp-hero-desc hidden sm:block">
              Margyaan is the world’s fastest, offline-first indoor navigation engine for Airports, Malls, and Hospitals. Seamless routing right from your browser.
            </p>
            <p className="lp-hero-desc sm:hidden text-[15px] leading-snug text-slate-500 dark:text-slate-400">
              The world’s fastest indoor navigation engine.
            </p>
            
            <div className="lp-hero-cta">
              {isAdminMode ? (
                <button className="lp-btn-primary lp-btn-large" onClick={() => navigate('/app')}>
                  Go to Dashboard <FiArrowRight className="lp-icon-right"/>
                </button>
              ) : (
                <button className="lp-btn-primary lp-btn-large" onClick={() => setModalMode('trial')}>
                  Start for Free <FiArrowRight className="lp-icon-right"/>
                </button>
              )}
              <button className="lp-btn-outline lp-btn-large" onClick={() => setModalMode('demo')}>
                Request a Demo
              </button>
            </div>
          </div>

          <div className="lp-hero-visual reveal reveal-delay-1">
            
            {/* Premium iPad Mockup */}
            <div className="lp-ipad-frame">
              <div className="lp-ipad-camera"></div>
              <div className="lp-ipad-screen">
                 {/* Live Demo iframe */}
                 <iframe
                  className="lp-demo-iframe"
                  src="/app?theme=light&demo=public"
                  title="Margyaan Live Demo"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
                  loading="lazy"
                />
              </div>
            </div>
            
          </div>
        </div>
      </header>
      )}


      {/* ─── SCAN & GO SECTION ─── */}
      {(page === 'home' || page === 'features') && (
      <>
      {page === 'home' && <JourneyMapWheelchair />}
      <section className="lp-scan-go-isometric bg-[#fafbfc] dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800/50 py-24 overflow-hidden relative" id="scan-and-go">
        
        {/* Soft Background Grid / Dotted Pattern */}
        <div className="absolute inset-0 z-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-100/50 via-purple-50/30 to-transparent rounded-full blur-[100px] pointer-events-none -translate-y-1/4 translate-x-1/4"></div>



        <div className="lp-container relative z-10">
          {/* TOP ROW: Text + 3D Visual in Unified Layout */}
          <div className="flex flex-col xl:flex-row items-center gap-16 xl:gap-8 mb-16">
            
            {/* LEFT COLUMN: Text & Steps */}
            <div className="reveal flex-1 xl:max-w-[500px] relative z-20">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500 text-white text-[10px] font-bold tracking-wider uppercase mb-8 shadow-sm">
                <span className="mr-2 text-[14px]">✦</span> NEW FEATURE
              </div>
              <h2 className="text-[3.5rem] md:text-[4.5rem] font-extrabold leading-[1.05] text-slate-900 dark:text-white mb-6 tracking-tight">
                Scan. Locate.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400">Navigate.</span>
              </h2>
              <p className="text-[17px] text-slate-500 font-medium mb-12 leading-relaxed">
                No apps to download. No confusing directories. Simply scan the QR code on the wall with your smartphone's camera, and our intelligent routing engine will instantly pinpoint your exact location on the interactive indoor map. 
              </p>
              
              <ul className="flex flex-col gap-4">
                <li className="group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/50 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <FiTarget className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-white block text-[15px] mb-1 font-bold">Instant Location</strong>
                      <span className="text-slate-500 dark:text-slate-400 text-[13px] font-medium">Browser-based mapping. Works instantly.</span>
                    </div>
                  </div>
                  <FiChevronRight className="text-slate-300 w-5 h-5 group-hover:text-blue-500 transition-colors" />
                </li>
                
                <li className="group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.08)] transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm border border-purple-100 dark:border-purple-800/50 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <FiSearch className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-white block text-[15px] mb-1 font-bold">Smart Zoom</strong>
                      <span className="text-slate-500 dark:text-slate-400 text-[13px] font-medium">Auto-zooms to your exact position.</span>
                    </div>
                  </div>
                  <FiChevronRight className="text-slate-300 w-5 h-5 group-hover:text-purple-500 transition-colors" />
                </li>
                
                <li className="group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)] transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-800/50 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <FiShield className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-white block text-[15px] mb-1 font-bold">Zero Friction</strong>
                      <span className="text-slate-500 dark:text-slate-400 text-[13px] font-medium">No sign-up. No download. Just scan & go.</span>
                    </div>
                  </div>
                  <FiChevronRight className="text-slate-300 w-5 h-5 group-hover:text-emerald-500 transition-colors" />
                </li>
              </ul>
            </div>
            
            {/* RIGHT COLUMN: 3D Visual Container */}
            <div className="reveal flex-1 w-full flex justify-center items-center relative min-h-[320px] md:min-h-[500px] xl:min-h-[600px] pointer-events-none overflow-hidden xl:overflow-visible">
              
              {/* Mobile: simplified stacked layout */}
              <div className="hidden sm:block w-full h-full">
                {/* Desktop scaling wrapper */}
                <div className="relative w-full max-w-[500px] xl:max-w-[850px] aspect-square flex justify-center items-center mx-auto">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[600px] scale-[0.45] sm:scale-[0.55] md:scale-[0.65] lg:scale-[0.75] xl:scale-[0.8] 2xl:scale-[0.95] origin-center transition-transform duration-300">
                    
                    {/* Base Map */}
                    <div className="iso-map-base absolute bottom-0 right-0 w-[800px] h-[550px]">
                      <img src={isoFloorPlan} loading="lazy" alt="Floor Plan Dashboard" className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.08)]" />
                      {/* Blue origin ping: Main Entrance */}
                      <div className="absolute left-[200px] top-[400px] w-20 h-20 -ml-10 -mt-10 rounded-full border-[3px] border-blue-500/50 animate-ping" style={{ animationDuration: '2s' }}></div>
                      <div className="absolute left-[200px] top-[400px] w-4 h-4 -ml-2 -mt-2 bg-blue-600 rounded-full shadow-[0_0_15px_#2563eb]"></div>
                      {/* Orange destination ping: Food Court */}
                      <div className="absolute right-[150px] top-[150px] w-20 h-20 -ml-10 -mt-10 rounded-full border-[3px] border-orange-500/50 animate-ping" style={{ animationDuration: '2.5s' }}></div>

                      {/* ═══ WALKING MAN — INSIDE map div so coordinates are exact ═══ */}
                      {/*
                        Map: 800x550px
                        Start (blue dot):  left=200px, top=400px
                        End   (Food Court): left=650px, top=150px  (right-150 = 800-150=650)
                        Path delta: +450px right, -250px up
                        Character is offset by half its width/height so center aligns: -26px, -52px
                      */}
                      <div
                        className="absolute z-30 pointer-events-none"
                        style={{
                          left: '200px',
                          top: '400px',
                          marginLeft: '-26px',
                          marginTop: '-52px',
                          animation: 'walkOnPath 10s linear infinite',
                        }}
                      >
                        <div className="relative">
                          {/* LIVE badge */}
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/95 border border-blue-200 shadow-[0_2px_10px_rgba(37,99,235,0.25)] rounded-full px-2 py-0.5 whitespace-nowrap">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-[8px] font-black text-slate-700 tracking-wide">LIVE</span>
                            <span className="text-[8px] font-bold text-blue-600">Tracking</span>
                          </div>
                          {/* Character image */}
                          <img
                            src={realMan}
                            alt="Walking Man"
                            className="w-[48px] h-[48px] object-contain mix-blend-multiply"
                            style={{ animation: 'walkBob 0.5s ease-in-out infinite' }}
                          />
                          {/* GPS dot under feet */}
                          <div
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full"
                            style={{ animation: 'liveTrackerPulse 1s ease-out infinite' }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* ════ POI RAIN — floating badges around the map ════ */}

                    {/* 1. Food Court — top-center-right */}
                    <div className="absolute top-[-30px] right-[200px] z-30" style={{ animation: 'floatCard 5s ease-in-out infinite', animationDelay: '0s' }}>
                      <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-orange-100 dark:border-orange-900/50 shadow-[0_8px_24px_rgba(249,115,22,0.15)] rounded-2xl px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-base flex-shrink-0">🍔</div>
                        <div>
                          <span className="block text-[12px] font-black text-slate-800 dark:text-white leading-tight">Food Court</span>
                          <span className="block text-[10px] font-semibold text-orange-500 dark:text-orange-400">2 min · L1</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse ml-1"></div>
                      </div>
                    </div>

                    {/* 2. Restroom — top-left */}
                    <div className="absolute top-[30px] left-[300px] z-30" style={{ animation: 'floatCard 6s ease-in-out infinite', animationDelay: '0.8s' }}>
                      <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-blue-100 dark:border-blue-900/50 shadow-[0_8px_24px_rgba(59,130,246,0.12)] rounded-2xl px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-base flex-shrink-0">🚻</div>
                        <div>
                          <span className="block text-[12px] font-black text-slate-800 dark:text-white leading-tight">Restroom</span>
                          <span className="block text-[10px] font-semibold text-blue-500 dark:text-blue-400">50m · L1</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Gate A — far right of map */}
                    <div className="absolute top-[80px] right-[120px] z-30" style={{ animation: 'floatCard 7s ease-in-out infinite', animationDelay: '1.5s' }}>
                      <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-indigo-100 dark:border-indigo-900/50 shadow-[0_8px_24px_rgba(99,102,241,0.12)] rounded-2xl px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-base flex-shrink-0">✈️</div>
                        <div>
                          <span className="block text-[12px] font-black text-slate-800 dark:text-white leading-tight">Gate A3</span>
                          <span className="block text-[10px] font-semibold text-indigo-500 dark:text-indigo-400">Boarding</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse ml-1"></div>
                      </div>
                    </div>

                    {/* 4. Pharmacy — mid-right */}
                    <div className="absolute top-[220px] right-[80px] z-30" style={{ animation: 'floatCard 5.5s ease-in-out infinite', animationDelay: '2.2s' }}>
                      <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-emerald-100 dark:border-emerald-900/50 shadow-[0_8px_24px_rgba(16,185,129,0.12)] rounded-2xl px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-base flex-shrink-0">💊</div>
                        <div>
                          <span className="block text-[12px] font-black text-slate-800 dark:text-white leading-tight">Pharmacy</span>
                          <span className="block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Open · L2</span>
                        </div>
                      </div>
                    </div>

                    {/* 5. Elevator — bottom-left of map */}
                    <div className="absolute bottom-[80px] left-[290px] z-30" style={{ animation: 'floatCard 8s ease-in-out infinite', animationDelay: '0.4s' }}>
                      <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-purple-100 dark:border-purple-900/50 shadow-[0_8px_24px_rgba(168,85,247,0.12)] rounded-2xl px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-base flex-shrink-0">🛗</div>
                        <div>
                          <span className="block text-[12px] font-black text-slate-800 dark:text-white leading-tight">Elevator</span>
                          <span className="block text-[10px] font-semibold text-purple-600 dark:text-purple-400">Available</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse ml-1"></div>
                      </div>
                    </div>

                    {/* 6. Cinema — bottom-right */}
                    <div className="absolute bottom-[40px] right-[160px] z-30" style={{ animation: 'floatCard 6.5s ease-in-out infinite', animationDelay: '3s' }}>
                      <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-pink-100 dark:border-pink-900/50 shadow-[0_8px_24px_rgba(236,72,153,0.12)] rounded-2xl px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center text-base flex-shrink-0">🎬</div>
                        <div>
                          <span className="block text-[12px] font-black text-slate-800 dark:text-white leading-tight">Cinema</span>
                          <span className="block text-[10px] font-semibold text-pink-500 dark:text-pink-400">3rd Floor</span>
                        </div>
                      </div>
                    </div>

                    {/* 7. Electronics — top far left */}
                    <div className="absolute top-[160px] left-[290px] z-30" style={{ animation: 'floatCard 7.5s ease-in-out infinite', animationDelay: '1.1s' }}>
                      <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-cyan-100 dark:border-cyan-900/50 shadow-[0_8px_24px_rgba(6,182,212,0.12)] rounded-2xl px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center text-base flex-shrink-0">📱</div>
                        <div>
                          <span className="block text-[12px] font-black text-slate-800 dark:text-white leading-tight">Electronics</span>
                          <span className="block text-[10px] font-semibold text-cyan-600 dark:text-cyan-400">Wing B</span>
                        </div>
                      </div>
                    </div>

                    {/* 8. Info Desk — bottom-center */}
                    <div className="absolute bottom-[-15px] right-[380px] z-30" style={{ animation: 'floatCard 9s ease-in-out infinite', animationDelay: '2.5s' }}>
                      <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-amber-100 dark:border-amber-900/50 shadow-[0_8px_24px_rgba(245,158,11,0.12)] rounded-2xl px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-base flex-shrink-0">ℹ️</div>
                        <div>
                          <span className="block text-[12px] font-black text-slate-800 dark:text-white leading-tight">Info Desk</span>
                          <span className="block text-[10px] font-semibold text-amber-600 dark:text-amber-400">Main Hall</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-1"></div>
                      </div>
                    </div>

                    {/* Hovering 3D Phone */}
                    <div className="absolute left-0 top-[5%] z-40" style={{ animation: 'floatPhoneIso 6s ease-in-out infinite' }}>
                      <div className="w-[280px] h-[580px] bg-white dark:bg-slate-800 rounded-[3rem] border-[8px] border-slate-100 dark:border-slate-700 shadow-[30px_40px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden relative">
                        <div className="w-full h-16 bg-white dark:bg-slate-800 flex items-center justify-between px-6 relative z-10 border-b border-slate-50 dark:border-slate-700">
                           <FiChevronRight className="w-6 h-6 text-slate-800 dark:text-slate-200 rotate-180" />
                           <span className="text-slate-800 dark:text-white font-extrabold text-[15px] tracking-tight">Scan QR Code</span>
                           <FiZap className="w-5 h-5 text-slate-800 dark:text-slate-200" />
                        </div>
                        <div className="flex-1 flex flex-col items-center pt-8 px-6 relative bg-slate-50/50 dark:bg-slate-900/50">
                           <div className="w-full aspect-square bg-white dark:bg-slate-800 border-2 border-blue-500/30 rounded-3xl p-6 relative shadow-[0_10px_30px_rgba(59,130,246,0.08)]">
                              <img src={qrDemo} alt="QR" className="w-full h-full opacity-70 mix-blend-multiply dark:mix-blend-normal" />
                              <div className="absolute -top-[2px] -left-[2px] w-8 h-8 border-t-[3px] border-l-[3px] border-blue-500 rounded-tl-3xl"></div>
                              <div className="absolute -top-[2px] -right-[2px] w-8 h-8 border-t-[3px] border-r-[3px] border-blue-500 rounded-tr-3xl"></div>
                              <div className="absolute -bottom-[2px] -left-[2px] w-8 h-8 border-b-[3px] border-l-[3px] border-blue-500 rounded-bl-3xl"></div>
                              <div className="absolute -bottom-[2px] -right-[2px] w-8 h-8 border-b-[3px] border-r-[3px] border-blue-500 rounded-br-3xl"></div>
                              <div className="absolute left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-laserScanIso"></div>
                           </div>
                           <p className="text-slate-800 dark:text-slate-200 text-[12px] mt-6 font-bold tracking-wide">Align QR within the frame</p>
                           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-[0_15px_30px_rgba(0,0,0,0.1)] border border-slate-50 dark:border-slate-700 flex items-center justify-between">
                             <div>
                               <div className="flex items-center gap-1.5 mb-1 text-emerald-500 font-bold text-[11px] uppercase tracking-wider">
                                 <FiCheckCircle /> Location Found!
                               </div>
                               <strong className="text-slate-800 dark:text-white text-[14px] block leading-tight">Reception Area</strong>
                               <span className="text-slate-500 dark:text-slate-400 text-[10px]">Floor L1</span>
                             </div>
                             <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shadow-inner shrink-0">
                               <FiMapPin className="w-5 h-5" />
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile-only: clean card version (no scaling needed) */}
              <div className="sm:hidden w-full flex flex-col items-center gap-6 py-6">
                {/* Phone mockup */}
                <div className="w-[200px] h-[360px] bg-white dark:bg-slate-800 rounded-[2.5rem] border-[6px] border-slate-100 dark:border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden">
                  <div className="w-full h-12 bg-white dark:bg-slate-800 flex items-center justify-center border-b border-slate-50 dark:border-slate-700">
                    <span className="text-slate-800 dark:text-white font-extrabold text-[13px] tracking-tight">Scan QR Code</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center pt-5 px-5 relative bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="w-full aspect-square bg-white dark:bg-slate-800 border-2 border-blue-500/30 rounded-2xl p-4 relative shadow-[0_6px_20px_rgba(59,130,246,0.08)]">
                      <img src={qrDemo} alt="QR" className="w-full h-full opacity-70 mix-blend-multiply dark:mix-blend-normal" />
                      <div className="absolute -top-[2px] -left-[2px] w-6 h-6 border-t-[3px] border-l-[3px] border-blue-500 rounded-tl-2xl"></div>
                      <div className="absolute -top-[2px] -right-[2px] w-6 h-6 border-t-[3px] border-r-[3px] border-blue-500 rounded-tr-2xl"></div>
                      <div className="absolute -bottom-[2px] -left-[2px] w-6 h-6 border-b-[3px] border-l-[3px] border-blue-500 rounded-bl-2xl"></div>
                      <div className="absolute -bottom-[2px] -right-[2px] w-6 h-6 border-b-[3px] border-r-[3px] border-blue-500 rounded-br-2xl"></div>
                      <div className="absolute left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-laserScanIso"></div>
                    </div>
                    <div className="mt-4 w-full bg-white dark:bg-slate-800 rounded-xl p-3 shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-slate-50 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1 mb-0.5 text-emerald-500 font-bold text-[10px] uppercase tracking-wider"><FiCheckCircle /> Found!</div>
                        <strong className="text-slate-800 dark:text-white text-[12px] block">Reception Area</strong>
                      </div>
                      <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400"><FiMapPin className="w-4 h-4" /></div>
                    </div>
                  </div>
                </div>
                {/* Map preview on mobile */}
                <div className="w-full relative rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100">
                  <img src={isoFloorPlan} loading="lazy" alt="Floor Plan" className="w-full h-auto object-cover" />
                  
                  {/* Blue origin ping */}
                  <div className="absolute left-[30%] top-[60%] w-10 h-10 -ml-5 -mt-5 rounded-full border-[2px] border-blue-500/60 animate-ping" style={{ animationDuration: '2s' }}></div>
                  <div className="absolute left-[30%] top-[60%] w-3 h-3 -ml-1.5 -mt-1.5 bg-blue-600 rounded-full shadow-[0_0_10px_#2563eb]"></div>
                  
                  {/* Orange destination ping */}
                  <div className="absolute left-[80%] top-[25%] w-10 h-10 -ml-5 -mt-5 rounded-full border-[2px] border-orange-500/60 animate-ping" style={{ animationDuration: '2.5s' }}></div>

                  {/* ═══ WALKING MAN (MOBILE) ═══ */}
                  <div
                    className="absolute z-30 pointer-events-none"
                    style={{
                      animation: 'walkOnPathMobile 10s linear infinite',
                    }}
                  >
                    <div className="relative">
                      {/* LIVE badge */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/95 border border-blue-200 shadow-[0_2px_10px_rgba(37,99,235,0.25)] rounded-full px-1.5 py-0.5 whitespace-nowrap">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-[7px] font-black text-slate-700 tracking-wide">LIVE</span>
                      </div>
                      
                      {/* Character image */}
                      <img
                        src={realMan}
                        alt="Walking Man"
                        className="w-[36px] h-[36px] object-contain mix-blend-multiply"
                        style={{ animation: 'walkBob 0.5s ease-in-out infinite' }}
                      />
                      
                      {/* GPS dot under feet */}
                      <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-600 rounded-full"
                        style={{ animation: 'liveTrackerPulse 1s ease-out infinite' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: How It Works & Benefits Container */}
          <div className="reveal w-full bg-white dark:bg-slate-800 rounded-[2rem] shadow-[0_10px_50px_rgba(15,23,42,0.04)] border border-slate-100 dark:border-slate-700 p-8 md:p-10 flex flex-col gap-10">
            
            {/* Top Half: How It Works */}
            <div>
              <div className="flex flex-col lg:flex-row lg:items-center gap-10">
                <div className="flex-shrink-0">
                  <h3 className="text-[20px] font-bold text-slate-800 dark:text-white mb-1">How It Works</h3>
                  <div className="w-10 h-1 bg-blue-600 rounded-full"></div>
                </div>
                
                <div className="flex-1 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                  <div className="flex items-start lg:items-center min-w-[800px] lg:min-w-0 justify-between gap-4">
                    {/* Step 1 */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/40 flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-900/50">
                        <FiSmartphone className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col max-w-[120px]">
                        <span className="text-[13px] font-bold text-slate-800 dark:text-white">1. Scan</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Scan the QR code on the wall.</span>
                      </div>
                    </div>
                    <span className="text-slate-300 dark:text-slate-600 font-bold tracking-[3px]">---&gt;</span>
                    
                    {/* Step 2 */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/40 flex flex-col items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm border border-purple-100 dark:border-purple-900/50">
                        <FiMapPin className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col max-w-[120px]">
                        <span className="text-[13px] font-bold text-slate-800 dark:text-white">2. Locate</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">We locate you instantly.</span>
                      </div>
                    </div>
                    <span className="text-slate-300 dark:text-slate-600 font-bold tracking-[3px]">---&gt;</span>

                    {/* Step 3 */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/40 flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-900/50">
                        <FiMap className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col max-w-[120px]">
                        <span className="text-[13px] font-bold text-slate-800 dark:text-white">3. Map View</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Get your position on indoor map.</span>
                      </div>
                    </div>
                    <span className="text-slate-300 dark:text-slate-600 font-bold tracking-[3px]">---&gt;</span>

                    {/* Step 4 */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/40 flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-900/50">
                        <FiNavigation className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col max-w-[130px]">
                        <span className="text-[13px] font-bold text-slate-800 dark:text-white">4. Navigate</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Follow shortest & easiest route.</span>
                      </div>
                    </div>
                    <span className="text-slate-300 dark:text-slate-600 font-bold tracking-[3px]">---&gt;</span>

                    {/* Step 5 */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-900/40 flex flex-col items-center justify-center text-rose-500 dark:text-rose-400 shadow-sm border border-rose-100 dark:border-rose-900/50">
                        <FiFlag className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col max-w-[120px]">
                        <span className="text-[13px] font-bold text-slate-800 dark:text-white">5. Arrive</span>
                        <span className="text-[11px] text-slate-500 leading-snug">Reach destination effortlessly.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Half: Benefits */}
            <div className="pt-8 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-6 md:gap-0 mt-4 md:mt-0">
              <div className="flex items-center gap-4 md:border-r border-slate-200 dark:border-slate-700 md:pr-8 flex-1">
                <div className="w-10 h-10 rounded-lg bg-blue-100/50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400"><FiGrid className="w-5 h-5"/></div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-800 dark:text-white">Works Everywhere</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Airports, Malls, Hospitals & more.</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 md:border-r border-slate-200 dark:border-slate-700 md:px-8 flex-1">
                <div className="w-10 h-10 rounded-lg bg-purple-100/50 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400"><FiShield className="w-5 h-5"/></div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-800 dark:text-white">Highly Accurate</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Precision positioning you can trust.</span>
                </div>
              </div>

              <div className="flex items-center gap-4 md:border-r border-slate-200 dark:border-slate-700 md:px-8 flex-1">
                <div className="w-10 h-10 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><FiLock className="w-5 h-5"/></div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-800 dark:text-white">Secure & Private</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Enterprise-grade security.</span>
                </div>
              </div>

              <div className="flex items-center gap-4 md:pl-8 flex-1">
                <div className="w-10 h-10 rounded-lg bg-orange-100/50 dark:bg-orange-900/40 flex items-center justify-center text-orange-500 dark:text-orange-400"><FiZap className="w-5 h-5"/></div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-800 dark:text-white">Lightning Fast</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Real-time routing in milliseconds.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      </>
      )}

      {/* ─── DYNAMIC REROUTING SHOWCASE (INFOGRAPHIC / CHART STYLE) ─── */}
      {(page === 'home' || page === 'features') && (
      <section className="pt-20 pb-10 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden" id="dynamic-rerouting">
        <div className="lp-container relative z-10 text-center max-w-5xl mx-auto">
          
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-blue-100 dark:border-slate-700 bg-blue-50/50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 text-sm font-bold tracking-wide uppercase reveal">
            🚦 Intelligent Traffic Control
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900 dark:text-white reveal reveal-delay-1">
            Manage flow with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500 dark:from-blue-400 dark:to-purple-400">Zero Lag.</span>
          </h2>
          
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-16 leading-relaxed reveal reveal-delay-2">
            Need to close a corridor for cleaning? Block paths instantly from your dashboard, set automated reopening timers, and Margyaan seamlessly reroutes all visitors in real-time.
          </p>

          {/* Flowchart / Infographic */}
          <div className="relative reveal reveal-delay-3">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-700">
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative">
                
                {/* Connecting Line (Background) */}
                <div className="absolute top-1/2 left-[10%] right-[10%] h-1 bg-slate-100 dark:bg-slate-700 -translate-y-1/2 hidden md:block z-0">
                   <div className="h-full bg-gradient-to-r from-red-500 via-blue-500 to-emerald-500 opacity-50"></div>
                </div>

                {/* Step 1: Admin Block */}
                <div className="bg-white dark:bg-slate-900 w-full md:w-1/3 p-6 rounded-2xl border-2 border-red-100 dark:border-red-900/50 shadow-sm relative z-10 flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/40 text-red-500 flex items-center justify-center text-2xl mb-4 border border-red-100 dark:border-red-800/50">
                    <FiLock />
                  </div>
                  <h4 className="font-black text-slate-800 dark:text-white mb-2">1. Block & Timer</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Admin selects path, adds reason & sets a precise reopening timer.</p>
                </div>

                {/* Arrow (Mobile Only) */}
                <div className="md:hidden text-slate-300 dark:text-slate-600"><FiArrowRight className="rotate-90 text-3xl"/></div>

                {/* Step 2: Engine Recalculates */}
                <div className="bg-white dark:bg-slate-900 w-full md:w-1/3 p-6 rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 shadow-sm relative z-10 flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-500 flex items-center justify-center text-2xl mb-4 border border-blue-100 dark:border-blue-800/50">
                    <FiCpu />
                  </div>
                  <h4 className="font-black text-slate-800 dark:text-white mb-2">2. Routing Engine</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Our smart algorithm instantly recalculates alternate routes avoiding the blocked area.</p>
                </div>

                {/* Arrow (Mobile Only) */}
                <div className="md:hidden text-slate-300 dark:text-slate-600"><FiArrowRight className="rotate-90 text-3xl"/></div>

                {/* Step 3: Live Sync */}
                <div className="bg-white dark:bg-slate-900 w-full md:w-1/3 p-6 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/50 shadow-sm relative z-10 flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-500 flex items-center justify-center text-2xl mb-4 border border-emerald-100 dark:border-emerald-800/50">
                    <FiSmartphone />
                  </div>
                  <h4 className="font-black text-slate-800 dark:text-white mb-2">3. Live Sync</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">All visitors get dynamically redirected without reloading the app.</p>
                </div>

              </div>

            </div>
          </div>
          
        </div>
      </section>
      )}

      {/* ─── NO APP DOWNLOAD USP BANNER ─── */}
      {(page === 'home' || page === 'features') && (
      <section className="pt-8 pb-4 bg-white dark:bg-slate-950 relative border-t border-slate-200 dark:border-slate-800" id="app-free-usp">
        <div className="lp-container max-w-5xl mx-auto">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col md:flex-row reveal">
            
            {/* The Old Way - App Stores */}
            <div className="flex-1 p-8 md:p-12 relative overflow-hidden bg-white/50 dark:bg-slate-900/50">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs mb-6 uppercase tracking-wider">
                The Old Way
              </div>
              
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-200 mb-2 leading-tight">
                No forced 100MB <br/>app downloads.
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
                Don't force your visitors to search the store, wait for large downloads, and create accounts just to find a restroom.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 relative mt-auto">
                {/* Giant Red Cross Overlay */}
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-1 bg-red-500/80 -rotate-12 absolute scale-110 shadow-sm"></div>
                  <div className="w-full h-1 bg-red-500/80 rotate-12 absolute scale-110 shadow-sm"></div>
                </div>

                <div className="flex-1 bg-slate-900 text-white rounded-xl p-3 flex items-center gap-3 opacity-60 grayscale filter">
                  <FaApple className="text-3xl" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider opacity-80">Download on the</div>
                    <div className="font-semibold text-lg leading-tight">App Store</div>
                  </div>
                </div>
                
                <div className="flex-1 bg-slate-900 text-white rounded-xl p-3 flex items-center gap-3 opacity-60 grayscale filter">
                  <FaGooglePlay className="text-2xl ml-1" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider opacity-80">GET IT ON</div>
                    <div className="font-semibold text-lg leading-tight">Google Play</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full md:w-px h-px md:h-auto bg-slate-200 dark:bg-slate-700 relative flex items-center justify-center">
              <div className="absolute bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 text-xs font-bold px-3 py-1 rounded-full z-10">VS</div>
            </div>

            {/* The Margyaan Way - Web App */}
            <div className="flex-1 p-8 md:p-12 relative overflow-hidden bg-emerald-50/30 dark:bg-emerald-900/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs mb-6 uppercase tracking-wider border border-emerald-200 dark:border-emerald-500/30">
                <FiZap className="inline" /> The Margyaan Way
              </div>
              
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                Instant Access. <br/>Zero Friction.
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-sm">
                Visitors simply scan a QR code at the entrance or click a web link to instantly start interactive navigation in their browser.
              </p>
              
              <div className="flex items-center gap-6 mt-auto">
                <div className="w-24 h-24 bg-white rounded-2xl p-2 shadow-lg border border-slate-200 dark:border-slate-700 relative group overflow-hidden">
                  <img src={qrDemo} alt="QR Code" className="w-full h-full object-contain" />
                  {/* Scan line animation */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_8px_#10b981] animate-[bounce_2s_infinite] z-10 opacity-70"></div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                    <FiCheckCircle className="text-emerald-500 text-lg" /> No Downloads
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                    <FiCheckCircle className="text-emerald-500 text-lg" /> No Accounts
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                    <FiCheckCircle className="text-emerald-500 text-lg" /> Works on any OS
                  </div>
                </div>
              </div>
              
            </div>

          </div>
        </div>
      </section>
      )}

      
      {page === 'home' && <JourneyMapHospital />}

      {/* ─── PREMIUM TRANSPARENT FEATURES ────────────────────────── */}
      {(page === 'home' || page === 'features') && (
      <section className="lp-features-clean" id="features" style={{ paddingTop: page !== 'home' ? '140px' : '' }}>
        <div className="lp-container">
          <div className="lp-section-header reveal">
            <div className="lp-features-badge">Core Capabilities</div>
            <h2 className="lp-section-title">Built for Scale & Performance.</h2>
            <p className="lp-section-subtitle">Everything you need to map, manage, and deploy world-class indoor navigation seamlessly.</p>
          </div>

          <div className="lp-features-grid-clean">
            
            {/* Feature 1 */}
            <div className="lp-feature-card-clean reveal">
              <div className="lp-fc-icon-wrapper blue">
                <FiCpu className="lp-fc-icon-large" />
              </div>
              <h3 className="lp-fc-title">AI Multi-Floor Routing</h3>
              <p className="lp-fc-desc">
                Calculates absolute shortest paths across massive venues instantly, connecting floors via elevators & escalators.
              </p>
              <ul className="lp-fc-list">
                <li><FiZap /> Real-time Routing</li>
                <li><FiLayers /> Multi-Floor Support</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="lp-feature-card-clean reveal reveal-delay-1">
              <div className="lp-fc-icon-wrapper purple">
                <FiSearch className="lp-fc-icon-large" />
              </div>
              <h3 className="lp-fc-title">Smart POI Discovery</h3>
              <p className="lp-fc-desc">
                Instantly search for gates, restrooms, shops, or brands. Get turn-by-turn directions from your current location.
              </p>
              <ul className="lp-fc-list">
                <li><FiMapPin /> Live Location</li>
                <li><FiNavigation /> Turn-by-Turn</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="lp-feature-card-clean reveal reveal-delay-2">
              <div className="lp-fc-icon-wrapper emerald">
                <FiMap className="lp-fc-icon-large" />
              </div>
              <h3 className="lp-fc-title">Enterprise Map Editor</h3>
              <p className="lp-fc-desc">
                Draw routes, add points of interest, and manage multiple floors in real-time without writing a single line of code.
              </p>
              <ul className="lp-fc-list">
                <li><FiMapPin /> Visual Editing</li>
                <li><FiLayers /> Node Placement</li>
              </ul>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* ─── HIGHLIGHTS SECTION ─── */}
      {(page === 'home' || page === 'features') && (
      <>
      {page === 'home' && <JourneyMapMall />}
      <section className="lp-usp-section">
        <div className="lp-container">
          <div className="lp-usp-grid">
            <div className="lp-usp-card reveal reveal-delay-1">
              <div className="lp-usp-icon" style={{background: '#e0f2fe', color: '#0ea5e9'}}>
                <FiMap />
              </div>
              <h3 className="lp-usp-title">50+ Venues Mapped</h3>
              <p className="lp-usp-desc hidden sm:block">
                Trusted by top airports and massive shopping malls. We provide highly accurate, scalable indoor mapping that visitors rely on daily.
              </p>
            </div>
            
            <div className="lp-usp-card reveal reveal-delay-2">
              <div className="lp-usp-icon" style={{background: '#dcfce7', color: '#10b981'}}>
                <FiWifiOff />
              </div>
              <h3 className="lp-usp-title">100% Offline Ready</h3>
              <p className="lp-usp-desc hidden sm:block">
                No signal? No problem. Once opened, our maps cache instantly and provide full turn-by-turn navigation even in dead zones.
              </p>
            </div>
            
            <div className="lp-usp-card reveal reveal-delay-3">
              <div className="lp-usp-icon" style={{background: '#fae8ff', color: '#d946ef'}}>
                <FiSmartphone />
              </div>
              <h3 className="lp-usp-title">Zero App Installs</h3>
              <p className="lp-usp-desc hidden sm:block">
                A truly frictionless experience. Users just scan a QR code and start navigating immediately via their default web browser.
              </p>
            </div>
          </div>
        </div>
      </section>
      </>
      )}

      {/* ─── SOLUTIONS / INDUSTRIES SECTION ─── */}
      {(page === 'home' || page === 'solutions') && (
      <>
      {page === 'home' && <JourneyMapEvent />}
      <section className="lp-industries-section" id="solutions" style={{ paddingTop: page !== 'home' ? '140px' : '' }}>
        <div className="lp-container">
          <div className="lp-section-header reveal">
            <h2 className="lp-section-title">Built for Every <span className="lp-text-gradient">Industry</span>.</h2>
            <p className="lp-section-subtitle">Margyaan is highly flexible and scalable, making it the perfect navigation engine for complex infrastructures.</p>
          </div>
          
          <div className="lp-industries-grid">
            {[
              { name: 'Airports', icon: <FiSend />, desc: 'Terminals, gates & lounges' },
              { name: 'Hospitals', icon: <FiHeart />, desc: 'OPDs, wards & emergency' },
              { name: 'Shopping Malls', icon: <FiShoppingBag />, desc: 'Stores, food courts & parking' },
              { name: 'Corporate Parks', icon: <FiBriefcase />, desc: 'Meeting rooms & specific desks' },
              { name: 'Universities', icon: <FiBook />, desc: 'Lecture halls & library zones' },
              { name: 'Metro Stations', icon: <FiNavigation />, desc: 'Platforms & ticket counters' },
              { name: 'Museums', icon: <FiCamera />, desc: 'Exhibits & specific artifacts' },
              { name: 'Warehouses', icon: <FiPackage />, desc: 'Inventory zones & loading docks' },
              { name: 'Govt Buildings', icon: <FiShield />, desc: 'Courtrooms & departments' },
              { name: 'Stadiums', icon: <FiFlag />, desc: 'Seating zones & food stalls' },
            ].map((ind, i) => (
              <div key={i} className="lp-ind-card reveal" style={{ transitionDelay: `${i * 0.05}s` }}>
                <div className="lp-ind-icon">{ind.icon}</div>
                <div className="lp-ind-content">
                  <h4>{ind.name}</h4>
                  <p className="hidden sm:block">{ind.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </>
      )}

      {/* ─── PRICING ─────────────────────────────────────────── */}
      {page === 'pricing' && (
      <section className="lp-pricing-section" id="pricing" style={{ paddingTop: '140px', paddingBottom: '100px', textAlign: 'center' }}>
        <div className="lp-container">
          <h2 className="lp-section-title">Transparent <span className="lp-text-gradient">Pricing</span></h2>
          <p className="lp-section-subtitle" style={{marginBottom: '40px'}}>Enterprise-grade indoor navigation tailored for your scale.</p>
          <button className="lp-btn-primary lp-btn-large" onClick={() => setModalMode('trial')}>
            Request Custom Quote
          </button>
        </div>
      </section>
      )}

      {/* ─── LEGAL PAGES ──────────────────────────────────────── */}
      {['privacy', 'terms', 'support'].includes(page) && (
        <LegalPage page={page} />
      )}

      {/* ─── CTA & FOOTER ──────────────────────────────────────── */}
      <footer className="lp-footer desktop-only-footer">
        <div className="lp-container">
          
          <div className="lp-footer-cta reveal">
            <h2>Ready to transform your venue?</h2>
            <p>Join world-class spaces already using Margyaan.</p>
            <button className="lp-btn-primary lp-btn-large" onClick={() => setModalMode('trial')}>
              Start your Free Trial
            </button>
          </div>

          <div className="lp-footer-bottom reveal">
            <div className="lp-fb-left">
              <img src="/margyaan-icon.png" alt="Margyaan" className="lp-logo-img lp-logo-img--footer" />
              <p>© {new Date().getFullYear()} Margyaan Technologies.</p>
            </div>
            <div className="lp-fb-links">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/support">Support</Link>
            </div>
          </div>

        </div>
      </footer>
      
      {/* Mobile App Compact Footer */}
      <div className="mobile-app-element flex flex-col items-center gap-3 pt-10 mt-10 pb-[120px] w-full bg-slate-100 dark:bg-[#0B1120] text-slate-500 dark:text-slate-400 rounded-t-[32px] border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] relative z-0">
         <div className="flex items-center gap-2 font-black text-[18px] text-slate-800 dark:text-white tracking-tight">
            <img src="/margyaan-icon.png" alt="Margyaan" className="w-6 h-6 mix-blend-multiply dark:mix-blend-normal" /> Margyaan
         </div>
         <p className="text-[12px] text-slate-500 dark:text-slate-400 max-w-[240px] text-center font-medium leading-relaxed mb-1">
            Next-generation enterprise indoor navigation.
         </p>
         <div className="flex gap-5 text-[13px] font-bold opacity-90 mt-1">
            <Link to="/privacy" className="hover:text-indigo-500 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-indigo-500 transition-colors">Terms</Link>
            <Link to="/support" className="hover:text-indigo-500 transition-colors">Support</Link>
         </div>
      </div>

      {/* Demo Modal */}
      <RequestDemoModal isOpen={!!modalMode} mode={modalMode} onClose={() => setModalMode(null)} />

      {/* ─── MOBILE BOTTOM NAVIGATION BAR ──────────────────────────────────────── */}
      <div className="lp-mobile-bottom-nav mobile-app-element">
        <Link to="/" onClick={() => window.scrollTo(0,0)} className={`lp-bot-nav-item ${page === 'home' ? 'active' : ''}`}>
          <FiHome />
          <span>Home</span>
        </Link>
        <Link to="/features" onClick={() => window.scrollTo(0,0)} className={`lp-bot-nav-item ${page === 'features' ? 'active' : ''}`}>
          <FiLayers />
          <span>Features</span>
        </Link>
        <Link to="/solutions" onClick={() => window.scrollTo(0,0)} className={`lp-bot-nav-item ${page === 'solutions' ? 'active' : ''}`}>
          <FiGrid />
          <span>Solutions</span>
        </Link>
        <Link to="/login" className="lp-bot-nav-item">
          <FiUsers />
          <span>Login</span>
        </Link>
      </div>
    </div>
  );
}
