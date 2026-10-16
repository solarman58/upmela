import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMapStore } from '../../store/useMapStore';
import { FiClock, FiMapPin, FiX, FiArrowRight, FiCamera } from 'react-icons/fi';
import { MELA_AMENITIES } from '../../utils/melaAmenities';
import QRScannerModal from './QRScannerModal';

export default function FloatingQuickAmenity({ onOpenDirections }) {
  const {
    navigationStart,
    navigationMode,
    navigationPath,
    quickAmenityResults,
    quickAmenityCategory,
    quickAmenityLoading,
    findNearestAmenity,
    navigateToAmenity,
    clearQuickAmenity,
    floors,
    isSectorModalOpen,
    isSidebarOpen,
    isAdminMode,
    taggingMode
  } = useMapStore();

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [promptNeedStart, setPromptNeedStart] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [pendingAmenityId, setPendingAmenityId] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Do not show floating bar if in admin editing mode, when sector modal is open, or during active route
  if (isAdminMode && taggingMode) return null;
  if (isSectorModalOpen) return null;
  if (navigationPath && navigationPath.length > 0) return null;
  // On mobile, if bottom sheet is open, hide floating bar to avoid clashing
  if (isMobile && isSidebarOpen) return null;

  const handleAmenityTap = (amenityId) => {
    if (!navigationStart) {
      setPendingAmenityId(amenityId);
      setPromptNeedStart(true);
      return;
    }
    setPromptNeedStart(false);
    findNearestAmenity(navigationStart.id, amenityId);
  };

  const onQRScanSuccess = (node) => {
    setPromptNeedStart(false);
    if (pendingAmenityId) {
      setTimeout(() => {
        findNearestAmenity(node.id, pendingAmenityId);
        setPendingAmenityId(null);
      }, 300);
    }
  };

  const activeAmenity = MELA_AMENITIES.find(a => a.id === quickAmenityCategory);
  const bestResult = quickAmenityResults && quickAmenityResults.length > 0 ? quickAmenityResults[0] : null;

  const getFloorName = (floorId) => {
    if (!floors || !floors.length) return '';
    const f = floors.find(fl => fl.id === floorId);
    return f ? f.name : '';
  };

  return (
    <>
      <div
        className="absolute left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex flex-col items-center gap-2 w-full px-3 max-w-lg select-none transition-all duration-300"
        style={{
          bottom: isMobile ? 'calc(66px + env(safe-area-inset-bottom, 4px))' : '20px'
        }}
      >
        {/* ── Prompt: Missing Start Location ──────────────────────── */}
        <AnimatePresence>
          {promptNeedStart && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="w-full p-3.5 rounded-3xl bg-slate-950/95 dark:bg-black/95 text-white border border-amber-500/40 shadow-2xl backdrop-blur-2xl flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  <div>
                    <h4 className="text-xs font-black text-amber-400">आप अभी कहाँ पर हैं? (Location)</h4>
                    <p className="text-[10.5px] text-slate-300 mt-0.5 leading-snug">
                      निकटतम सुविधा खोजने के लिए पहले अपना स्थान चुनें या खंभे पर लगा <strong>QR कोड</strong> स्कैन करें।
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPromptNeedStart(false)}
                  className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white shrink-0 cursor-pointer"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Direct Camera QR Scan Action */}
                <button
                  onClick={() => setShowQRScanner(true)}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs shadow-lg shadow-orange-500/30 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <FiCamera className="w-4 h-4" />
                  <span>📷 QR स्कैन करें</span>
                </button>

                {/* Open Directions Action */}
                <button
                  onClick={() => {
                    setPromptNeedStart(false);
                    if (onOpenDirections) onOpenDirections();
                  }}
                  className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer border border-slate-700"
                >
                  <span>सूची से चुनें ➔</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Result Card Overlay (When Amenity is searched) ──────── */}
        <AnimatePresence>
          {quickAmenityResults && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="w-full p-3.5 rounded-3xl bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white border border-amber-500/30 shadow-2xl backdrop-blur-2xl flex flex-col gap-2"
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{activeAmenity?.icon || '📍'}</span>
                  <span className="text-xs font-black text-slate-800 dark:text-white">
                    निकटतम {activeAmenity?.nameHi} ({activeAmenity?.nameEn})
                  </span>
                </div>
                <button
                  onClick={clearQuickAmenity}
                  className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 shrink-0 cursor-pointer"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </div>

              {bestResult ? (
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h5 className="text-sm font-black text-slate-900 dark:text-white truncate">
                        {bestResult.node.name}
                      </h5>
                      {bestResult.node.floor && (
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <FiMapPin className="w-2.5 h-2.5 text-slate-400" />
                          {getFloorName(bestResult.node.floor) || bestResult.node.floor}
                        </span>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                        {bestResult.distance} मीटर
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 flex items-center justify-end gap-0.5">
                        <FiClock className="w-2.5 h-2.5" /> ~{bestResult.estimatedTime} min पैदल
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => { navigateToAmenity(bestResult); if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('map:close-sidebar')); }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>🧭</span> यहाँ का रास्ता दिखाएं (Navigate Now) ➔
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-500 text-center py-2">
                  वर्तमान में इस श्रेणी की सुविधा उपलब्ध नहीं है।
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Primary Floating Bar (Horizontal Scrollable Chips) ──── */}
        {!quickAmenityResults && (
          <div className="w-full flex items-center p-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl backdrop-blur-2xl overflow-hidden">
            
            {/* Quick QR Camera Button directly on Map Bar */}
            <button
              onClick={() => setShowQRScanner(true)}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-md active:scale-90 transition-all cursor-pointer"
              title="खंभे या गेट का QR कोड स्कैन करें"
            >
              <FiCamera className="w-4 h-4" />
            </button>

            <div className="pl-2 pr-1.5 text-[10.5px] font-black tracking-wider uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1 shrink-0">
              <span>निकटतम</span>
            </div>

            {/* Scrollable list of amenities */}
            <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-1 scroll-smooth">
              {MELA_AMENITIES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAmenityTap(item.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-black shadow-xs active:scale-95 transition-all duration-200 shrink-0 cursor-pointer"
                  title={`${item.nameHi} (${item.nameEn})`}
                >
                  <span className="text-sm leading-none">{item.icon}</span>
                  <span className="text-[11px] whitespace-nowrap">{item.nameHi}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Camera QR Scanner Modal ─────────────────────────────── */}
      <QRScannerModal
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={onQRScanSuccess}
      />
    </>
  );
}
