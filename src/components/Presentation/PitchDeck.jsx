import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiMap, FiSmartphone, FiCpu, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import './PitchDeck.css';

// Import existing assets to make it look like part of the main product
import isoHospital from '../../assets/iso_hospital_alpha.png';
import qrDemo from '../../assets/demo-qr.svg';

const slidesData = [
  {
    id: 1,
    title: "Margyaan.",
    subtitle: "The Future of Indoor Navigation for Enterprises.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            A frictionless, zero-download web platform that guides your visitors through complex venues effortlessly.
          </p>
          <div className="flex gap-4">
            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold border border-blue-500/30">Hospitals</span>
            <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-bold border border-purple-500/30">Malls</span>
            <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold border border-emerald-500/30">Airports</span>
          </div>
        </div>
        <div className="relative">
          <img src={isoHospital} alt="Margyaan Map" className="w-full h-auto drop-shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-[bounce_4s_infinite_alternate]" />
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "The Problem.",
    subtitle: "Getting lost is bad for business. App downloads are worse.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-md hover:-translate-y-2 transition-transform">
          <div className="text-4xl mb-6">😫</div>
          <h3 className="text-2xl font-bold text-white mb-4">Visitor Frustration</h3>
          <p className="text-slate-400">Complex venues lead to lost visitors, missed appointments, and poor reviews.</p>
        </div>
        <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-md hover:-translate-y-2 transition-transform delay-100">
          <div className="text-4xl mb-6">📉</div>
          <h3 className="text-2xl font-bold text-white mb-4">App Fatigue</h3>
          <p className="text-slate-400">90% of visitors refuse to download a 100MB+ app just to find a restroom or a specific store.</p>
        </div>
        <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-md hover:-translate-y-2 transition-transform delay-200">
          <div className="text-4xl mb-6">💸</div>
          <h3 className="text-2xl font-bold text-white mb-4">Missed Revenue</h3>
          <p className="text-slate-400">If they can't find the food court or premium stores, they can't spend money there.</p>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "The Margyaan Solution.",
    subtitle: "Zero Downloads. Instant Access via QR Code.",
    content: (
      <div className="flex flex-col md:flex-row items-center gap-16 mt-8">
        <div className="flex-1">
          <ul className="space-y-6">
            <li className="flex items-center gap-4 text-xl text-slate-300">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0"><FiCheckCircle size={24}/></div>
              No forced app installations
            </li>
            <li className="flex items-center gap-4 text-xl text-slate-300">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0"><FiCheckCircle size={24}/></div>
              No account creation required
            </li>
            <li className="flex items-center gap-4 text-xl text-slate-300">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0"><FiCheckCircle size={24}/></div>
              Works instantly on iOS & Android browsers
            </li>
          </ul>
        </div>
        <div className="flex-1 flex justify-center relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full"></div>
          <div className="w-64 h-64 bg-white rounded-[2rem] p-4 shadow-2xl relative z-10 border-4 border-slate-700">
            <img src={qrDemo} alt="QR Code" className="w-full h-full object-contain" />
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500 shadow-[0_0_15px_#10b981] animate-[bounce_2s_infinite]"></div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "The Technology.",
    subtitle: "Beautiful 2D Isometric Mapping & Smart Routing.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
        <div className="bg-slate-800/80 rounded-3xl p-8 border border-slate-700 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center"><FiMap size={24}/></div>
            <h3 className="text-2xl font-bold">Immersive Design</h3>
          </div>
          <p className="text-slate-400 leading-relaxed mb-6">
            We convert your boring 2D floor plans into beautiful, easy-to-understand isometric maps that look like high-end 3D graphics, but run flawlessly on any low-end smartphone.
          </p>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center"><FiCpu size={24}/></div>
            <h3 className="text-2xl font-bold">Smart Routing Engine</h3>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Multi-floor navigation seamlessly routes visitors through elevators and escalators using advanced graph algorithms.
          </p>
        </div>
        <div className="relative h-96 flex items-center justify-center">
           <img src={isoHospital} alt="Tech Map" className="absolute w-full max-w-lg object-contain drop-shadow-2xl" />
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Enterprise Admin Controls.",
    subtitle: "Manage your venue's traffic in real-time.",
    content: (
      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
           <div className="bg-slate-800 px-4 py-3 flex gap-2 border-b border-slate-700">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
           </div>
           <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-2">
                 <h4 className="text-xl font-bold text-white mb-4">Dynamic Path Rerouting</h4>
                 <div className="flex gap-4 items-center">
                   <div className="flex-1 h-2 bg-blue-500 rounded-full relative">
                     <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
                   </div>
                   <div className="flex-1 h-2 bg-emerald-500 rounded-full border-t-2 border-dashed border-white"></div>
                 </div>
                 <p className="text-slate-400 mt-6">Instantly block paths for cleaning or maintenance. Set an automated timer, and all live visitors are dynamically rerouted without reloading.</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                 <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Auto-Unlock Timer</div>
                 <div className="text-3xl font-mono text-emerald-400">02:00:00</div>
              </div>
           </div>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "The ROI.",
    subtitle: "Why venues choose Margyaan.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="flex gap-6 items-start bg-slate-800/30 p-6 rounded-2xl">
          <div className="w-14 h-14 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0"><FiTrendingUp size={28}/></div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Increased Footfall</h3>
            <p className="text-slate-400">Visitors easily find stores and food courts, directly leading to increased sales.</p>
          </div>
        </div>
        <div className="flex gap-6 items-start bg-slate-800/30 p-6 rounded-2xl">
          <div className="w-14 h-14 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0"><FiSmartphone size={28}/></div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Digital Ad Space</h3>
            <p className="text-slate-400">Monetize the map by allowing brands to highlight their stores or run targeted promotions.</p>
          </div>
        </div>
        <div className="flex gap-6 items-start bg-slate-800/30 p-6 rounded-2xl md:col-span-2">
          <div className="w-14 h-14 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">🤝</div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">World-Class Visitor Experience</h3>
            <p className="text-slate-400">Position your venue as a modern, tech-forward destination. Reduce staff interruptions and improve overall customer satisfaction scores.</p>
          </div>
        </div>
      </div>
    )
  }
];

const PitchDeck = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slidesData.length - 1) {
      setCurrentSlide(curr => curr + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(curr => curr - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <div className="pitch-deck-container">
      {/* Ambient Backgrounds */}
      <div className="slide-bg-blob blob-1"></div>
      <div className="slide-bg-blob blob-2"></div>

      {/* Progress Bar */}
      <div 
        className="pitch-progress" 
        style={{ width: `${((currentSlide + 1) / slidesData.length) * 100}%` }}
      ></div>

      {/* Close button to go back to website */}
      <a href="/" className="absolute top-8 left-8 z-50 text-slate-400 hover:text-white transition-colors font-bold text-sm tracking-widest uppercase flex items-center gap-2">
        <FiChevronLeft size={20}/> Back to Site
      </a>

      {/* Slides Wrapper */}
      <div 
        className="slides-wrapper"
        style={{ transform: `translateX(-${currentSlide * 100}vw)` }}
      >
        {slidesData.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="slide-content">
              <h1 className="slide-title text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                {slide.title}
              </h1>
              <p className="slide-subtitle">
                {slide.subtitle}
              </p>
              <div className="slide-body">
                {slide.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="pitch-controls">
        <button 
          className="pitch-btn" 
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          <FiChevronLeft size={24} />
        </button>
        <button 
          className="pitch-btn" 
          onClick={nextSlide}
          disabled={currentSlide === slidesData.length - 1}
        >
          <FiChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default PitchDeck;
