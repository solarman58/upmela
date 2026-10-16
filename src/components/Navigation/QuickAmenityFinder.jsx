import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMapStore } from '../../store/useMapStore';
import { FiClock, FiMapPin, FiX, FiCheck, FiArrowRight, FiCamera, FiRefreshCw, FiChevronLeft } from 'react-icons/fi';
import QRScannerModal from './QRScannerModal';

import { MELA_AMENITIES } from '../../utils/melaAmenities';

export default function QuickAmenityFinder({ onSelectStartPrompt, onNavigateSuccess, fullView = false }) {
  const {
    nodes,
    navigationStart,
    setNavigationStart,
    quickAmenityResults,
    quickAmenityCategory,
    quickAmenityLoading,
    findNearestAmenity,
    navigateToAmenity,
    clearQuickAmenity,
    floors,
    currentFloor
  } = useMapStore();

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [searchLocationQuery, setSearchLocationQuery] = useState('');
  const [pendingAmenityId, setPendingAmenityId] = useState(null);

  const handleAmenityClick = (amenityId) => {
    if (!navigationStart) {
      setPendingAmenityId(amenityId);
      setShowLocationPicker(true);
      return;
    }
    findNearestAmenity(navigationStart.id, amenityId);
  };

  const handleNavigateClick = (res) => {
    navigateToAmenity(res);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('map:close-sidebar'));
    }
    if (onNavigateSuccess) onNavigateSuccess();
  };

  const onQRScanSuccess = (node) => {
    if (pendingAmenityId) {
      setTimeout(() => {
        findNearestAmenity(node.id, pendingAmenityId);
        setPendingAmenityId(null);
      }, 300);
    }
  };

  const activeAmenity = MELA_AMENITIES.find(a => a.id === quickAmenityCategory);
  const bestResult = quickAmenityResults && quickAmenityResults.length > 0 ? quickAmenityResults[0] : null;
  const alternatives = quickAmenityResults && quickAmenityResults.length > 1 ? quickAmenityResults.slice(1, 4) : [];

  const getFloorName = (floorId) => {
    if (!floors || !floors.length) return '';
    const f = floors.find(fl => fl.id === floorId);
    return f ? f.name : '';
  };

  const candidateStartNodes = (nodes || []).filter(n => n.category !== 'waypoint');
  const filteredCandidates = candidateStartNodes.filter(n => {
    if (!searchLocationQuery.trim()) return true;
    return (n.name || '').toLowerCase().includes(searchLocationQuery.toLowerCase());
  }).slice(0, 10);

  // ══════════════════════════════════════════════════════════════════════════════
  // VIEW 2: RESULT FOUND (User selected amenity -> RESULT IS FRONT & CENTER)
  // ══════════════════════════════════════════════════════════════════════════════
  if (quickAmenityResults && bestResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full flex flex-col gap-3 my-1"
      >
        {/* Step Indicator & Back Button */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={clearQuickAmenity}
            className="flex items-center gap-1 text-xs font-black text-amber-600 dark:text-amber-400 hover:text-amber-700 active:scale-95 transition-all cursor-pointer"
          >
            <FiChevronLeft className="w-4 h-4" />
            <span>अन्य सुविधाएं (Change Amenity)</span>
          </button>
          
          <button
            onClick={clearQuickAmenity}
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 cursor-pointer"
            title="बंद करें"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* ── THE HERO RESULT CARD (Front & Center - Zero Scrolling) ── */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border-2 border-amber-500/40 dark:border-amber-500/30 shadow-xl flex flex-col gap-3">
          
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-xs flex items-center gap-1.5">
              <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
              सबसे नज़दीक मिला (Closest Found)
            </span>

            <span className="text-xs font-black text-amber-700 dark:text-amber-300 flex items-center gap-1">
              <FiClock className="w-3.5 h-3.5" />
              ~{bestResult.estimatedTime} मिनट पैदल
            </span>
          </div>

          {/* Place Name and Sector */}
          <div className="flex items-center gap-3 py-1">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-3xl shrink-0 border border-amber-500/30">
              {activeAmenity?.icon || '📍'}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                {bestResult.node.name}
              </h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <FiMapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{getFloorName(bestResult.node.floor) || bestResult.node.floor}</span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-black">
                  {bestResult.distance} मीटर दूर
                </strong>
              </p>
            </div>
          </div>

          {/* 🌟 BIG IMPOSSIBLE-TO-MISS ACTION BUTTON 🌟 */}
          <button
            onClick={() => handleNavigateClick(bestResult)}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm shadow-xl shadow-orange-500/35 flex items-center justify-center gap-2.5 active:scale-95 transition-all cursor-pointer ring-4 ring-amber-500/20"
          >
            <span className="text-base">🧭</span>
            <span>यहाँ का रास्ता दिखाएं (Start Walking Now)</span>
            <FiArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* ── Alternatives List (If any other nearby spots) ─────────── */}
        {alternatives.length > 0 && (
          <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/60">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">
              अन्य विकल्प (Other Nearby Options):
            </span>
            {alternatives.map((alt, idx) => (
              <button
                key={alt.node.id}
                onClick={() => handleNavigateClick(alt)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/50 text-left transition-all active:scale-98 group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xs font-black text-slate-400">#{idx + 2}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 transition-colors truncate">
                    {alt.node.name}
                  </span>
                </div>
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 shrink-0 ml-2">
                  {alt.distance}m (~{alt.estimatedTime}m) ➔
                </span>
              </button>
            ))}
          </div>
        )}

        {/* ── Quick Switcher: Tap another amenity without going back ─ */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">
            अन्य सुविधा देखें (Quick Switch):
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 scroll-smooth">
            {MELA_AMENITIES.filter(a => a.id !== quickAmenityCategory).map(item => (
              <button
                key={item.id}
                onClick={() => handleAmenityClick(item.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95 shrink-0 cursor-pointer"
              >
                <span>{item.icon}</span>
                <span>{item.nameHi}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // VIEW 1: SELECTION PHASE (Choose Location & Choose Amenity)
  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="w-full flex flex-col gap-3 my-1">
      
      {/* ── Start Location Status Pill with QR Scanner Button ──── */}
      <div className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <FiMapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block leading-none">
                आपकी स्थिति (Start Location)
              </span>
              <span className="text-xs font-black text-slate-800 dark:text-white truncate block mt-0.5">
                {navigationStart ? navigationStart.name : 'कोई स्थान सेट नहीं (Not Set)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Camera QR Button */}
            <button
              onClick={() => setShowQRScanner(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-black shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
              title="कैमरे से खंभे का QR कोड स्कैन करें"
            >
              <FiCamera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">QR</span> स्कैन
            </button>

            {/* Select Dropdown Trigger */}
            <button
              onClick={() => {
                if (onSelectStartPrompt) {
                  onSelectStartPrompt();
                } else {
                  setShowLocationPicker(!showLocationPicker);
                }
              }}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-black border border-slate-200 dark:border-slate-600 transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              {navigationStart ? 'बदलें' : 'सूची से चुनें'}
            </button>
          </div>
        </div>

        {/* Quick Help Tip */}
        {!navigationStart && (
          <div className="flex items-center justify-between text-[10.5px] text-amber-700 dark:text-amber-300 font-bold bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
            <span>📷 पास के किसी खंभे या गेट का QR स्कैन करें:</span>
            <button
              onClick={() => setShowQRScanner(true)}
              className="underline font-black cursor-pointer ml-1"
            >
              कैमरा खोलें ➔
            </button>
          </div>
        )}
      </div>

      {/* Location Picker Inline Modal */}
      <AnimatePresence>
        {showLocationPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md flex flex-col gap-2 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 dark:text-white">
                📍 अपना वर्तमान स्थान चुनें:
              </span>
              <button
                onClick={() => setShowLocationPicker(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            {/* QR Scan Action Card */}
            <button
              onClick={() => { setShowLocationPicker(false); setShowQRScanner(true); }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <FiCamera className="w-4 h-4 text-amber-500" />
              <span>कैमरे से QR कोड स्कैन करें (Auto-Detect)</span>
            </button>

            <input
              type="text"
              placeholder="या नाम खोजें (जैसे Gate, Sector, Camp)..."
              value={searchLocationQuery}
              onChange={(e) => setSearchLocationQuery(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <div className="max-h-36 overflow-y-auto flex flex-col gap-1 pr-1 custom-scrollbar">
              {filteredCandidates.map(node => (
                <button
                  key={node.id}
                  onClick={() => {
                    setNavigationStart(node);
                    setShowLocationPicker(false);
                    if (pendingAmenityId) {
                      findNearestAmenity(node.id, pendingAmenityId);
                      setPendingAmenityId(null);
                    }
                  }}
                  className="w-full text-left p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-amber-500 hover:text-white text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center justify-between cursor-pointer"
                >
                  <span className="truncate">{node.name}</span>
                  <span className="text-[9px] opacity-75 shrink-0 ml-2">{getFloorName(node.floor)}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Amenities Grid ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10.5px] font-black uppercase tracking-widest text-slate-400">
          आपको क्या सुविधा चाहिए? (Choose Amenity):
        </span>
      </div>

      <div className={fullView ? "grid grid-cols-2 gap-2.5" : "grid grid-cols-4 gap-1.5"}>
        {MELA_AMENITIES.map((item) => {
          return (
            <button
              key={item.id}
              onClick={() => handleAmenityClick(item.id)}
              className={`flex ${
                fullView ? 'flex-row items-center gap-3 p-3.5' : 'flex-col items-center justify-center py-2.5 px-1'
              } rounded-2xl border transition-all duration-200 active:scale-95 group text-left relative overflow-hidden cursor-pointer bg-gradient-to-br ${item.gradient} bg-white dark:bg-slate-900/90 ${item.border} shadow-xs hover:shadow-md hover:border-amber-500/50`}
              title={`${item.nameHi} (${item.nameEn})`}
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-110 bg-white dark:bg-slate-800 shadow-xs">
                {item.icon}
              </div>

              <div className="min-w-0 flex-1">
                <span className={`font-black leading-tight block truncate ${
                  fullView ? 'text-xs' : 'text-[10px] text-center'
                } text-slate-800 dark:text-white`}>
                  {item.nameHi}
                </span>
                <span className={`font-bold leading-none block truncate mt-0.5 ${
                  fullView ? 'text-[10px]' : 'text-[8px] text-center'
                } text-slate-400`}>
                  {item.nameEn}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Loading state */}
      {quickAmenityLoading && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center gap-2.5 text-xs font-black text-amber-600 dark:text-amber-400">
          <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>निकटतम सुविधा खोजी जा रही है...</span>
        </div>
      )}

      {/* ── QR Scanner Modal Component ─────────────────────────── */}
      <QRScannerModal
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={onQRScanSuccess}
      />
    </div>
  );
}
