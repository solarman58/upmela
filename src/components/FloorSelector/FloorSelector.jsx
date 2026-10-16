import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMapStore } from '../../store/useMapStore';
import { FiX, FiCheck, FiChevronDown, FiSearch, FiLayers, FiArrowRight } from 'react-icons/fi';

/* ─────────────────────────────────────────────────────────────────────────────
   22 SECTOR THEME COLORS & HINDI NAMES
───────────────────────────────────────────────────────────────────────────── */
const SECTOR_COLORS = {
  1:  '#F58220', 2:  '#E91E63', 3:  '#4CAF50', 4:  '#7E57C2', 5:  '#E65100',
  6:  '#00BCD4', 7:  '#009688', 8:  '#E53935', 9:  '#FFB300', 10: '#43A047',
  11: '#FB8C00', 12: '#039BE5', 13: '#D81B60', 14: '#F4511E', 15: '#5E35B1',
  16: '#00897B', 17: '#FFB300', 18: '#1E88E5', 19: '#AD1457', 20: '#6A1B9A',
  21: '#2E7D32', 22: '#C62828'
};

const SECTOR_TITLES = {
  1: 'संगम', 2: 'अखाड़ा', 3: 'महावीर', 4: 'दारागंज', 5: 'झूंसी',
  6: 'त्रिवेणी', 7: 'अरैल घाट', 8: 'नाग वासुकी', 9: 'शास्त्री ब्रिज', 10: 'गंगा मार्ग',
  11: 'यमुना मार्ग', 12: 'किला घाट', 13: 'फाफामऊ', 14: 'नैनी', 15: 'कार्यालय',
  16: 'तपोवन', 17: 'दंडी', 18: 'अन्नपूर्णा', 19: 'कल्याण', 20: 'कल्पवासी',
  21: 'प्रयाग', 22: 'राम घाट'
};

export default function FloorSelector() {
  const {
    floors, currentFloor, setFloor,
    buildings, currentBuilding, setBuilding,
    appSettings, setIsSectorModalOpen
  } = useMapStore();

  const isMela = appSettings?.project_type === 'Mela' || appSettings?.project_type === 'Kumbh Mela' || floors?.some(f => f.level === 'MAIN' || (f.level && f.level.startsWith('S')));

  const [showSectorModal, setShowSectorModal] = useState(false);
  const [sectorSearch, setSectorSearch] = useState('');
  const [showBuildings, setShowBuildings] = useState(false);
  const sectorListRef = useRef(null);

  // When searching, always reset scroll to top so filtered sectors are immediately visible at the top
  useEffect(() => {
    if (sectorListRef.current) {
      sectorListRef.current.scrollTop = 0;
    }
  }, [sectorSearch]);

  // Sync modal state with map store to control map overlay visibility
  const openModal = () => {
    setShowSectorModal(true);
    if (setIsSectorModalOpen) setIsSectorModalOpen(true);
  };

  const closeModal = () => {
    setShowSectorModal(false);
    if (setIsSectorModalOpen) setIsSectorModalOpen(false);
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!floors || floors.length === 0) return null;

  // Identify Main Mela Floor
  const mainFloor = floors.find(f => f.level === 'MAIN' || (f.name || '').toLowerCase().includes('main') || (f.name || '').toLowerCase().includes('overview')) || floors[0];
  const currentFloorObj = floors.find(f => f.id === currentFloor) || mainFloor;
  const isMainMelaFloor = currentFloorObj?.level === 'MAIN' || currentFloorObj?.id === mainFloor?.id;

  // Extract sector number if inside a sector
  const currentSectorNumMatch = (currentFloorObj?.name || '').match(/(\d+)/) || (currentFloorObj?.level || '').match(/(\d+)/);
  const currentSectorNum = currentSectorNumMatch ? parseInt(currentSectorNumMatch[1], 10) : null;
  const currentColor = currentSectorNum ? SECTOR_COLORS[currentSectorNum] : '#F58220';

  const handleSelectFloor = (floorId) => {
    const cleanUrl = new URL(window.location);
    cleanUrl.searchParams.delete('sector');
    cleanUrl.searchParams.delete('floor');
    window.history.replaceState({}, '', cleanUrl);

    setFloor(floorId);
    closeModal();
  };

  const handleGoToMain = () => {
    if (mainFloor) {
      handleSelectFloor(mainFloor.id);
      useMapStore.getState().addToast('🌐 मुख्य मेला ग्राउंड (Master Overview) लोड हो गया', 'info');
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────────
     MELA MODE: FULLY RESPONSIVE SECTOR & MAP SWITCHER
  ───────────────────────────────────────────────────────────────────────────── */
  if (isMela || floors.length > 5) {
    const sectorFloors = floors.filter(f => f.id !== mainFloor?.id);
    const filteredFloors = sectorFloors.filter(f => {
      if (!sectorSearch.trim()) return true;
      const q = sectorSearch.toLowerCase();
      const numMatch = (f.name || '').match(/(\d+)/);
      const num = numMatch ? numMatch[1] : '';
      const title = num ? SECTOR_TITLES[num] : '';
      return f.name.toLowerCase().includes(q) || num === q || (title && title.toLowerCase().includes(q));
    });

    return (
      <>
        {/* Floating Top Control Bar (Never overlaps on mobile or desktop) */}
        <div className="absolute top-3 inset-x-3 z-[60] pointer-events-none flex items-center justify-between gap-2 font-sans select-none">
          {/* LEFT BUTTON: Visible only inside a sector (Back to Main Map) */}
          {!isMainMelaFloor ? (
            <button
              type="button"
              onClick={handleGoToMain}
              className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs shadow-lg hover:from-amber-600 hover:to-orange-700 active:scale-95 transition-all cursor-pointer border border-amber-300/40"
              title="मुख्य मेला ग्राउंड (मास्टर मैप) पर वापस जाएं"
            >
              <span className="text-sm font-bold">←</span>
              <span>मुख्य मेला मैप</span>
            </button>
          ) : (
            <div className="w-0" />
          )}

          {/* RIGHT BUTTON: Sector / Map Selector */}
          <button
            type="button"
            onClick={openModal}
            className={`pointer-events-auto flex items-center gap-2 px-3.5 py-2 rounded-xl backdrop-blur-xl text-xs font-black shadow-xl border active:scale-95 transition-all cursor-pointer ${
              isMainMelaFloor
                ? 'bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white border-amber-300/40 shadow-orange-500/20'
                : 'bg-slate-900/90 dark:bg-black/90 text-white border-slate-700/80 hover:border-amber-400'
            }`}
            title="सभी 22 सेक्टर देखें (Filter / Change Sector)"
          >
            <div className="flex items-center gap-1.5">
              {isMainMelaFloor ? (
                <>
                  <span className="text-sm">🌐</span>
                  <span>मुख्य मेला ग्राउंड</span>
                </>
              ) : (
                <>
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse"
                    style={{ backgroundColor: currentColor }}
                  />
                  <span>{currentFloorObj?.name}</span>
                </>
              )}
            </div>
            <FiChevronDown className="w-3.5 h-3.5 text-white/80" />
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            PORTAL MODAL: Centered on Desktop, Bottom Sheet on Mobile
            Completely isolates from parent stacking context & map controls
        ───────────────────────────────────────────────────────────────── */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {showSectorModal && (
              <div className="fixed inset-0 z-[9990] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
                {/* Full-screen Backdrop: covers map, bottom nav, and floating controls */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={closeModal}
                  className="fixed inset-0 bg-black/65 backdrop-blur-sm pointer-events-auto"
                />

                {/* Modal Container: Bottom sheet on mobile (w-full rounded-t-3xl), Centered card on desktop (sm:max-w-xl sm:rounded-3xl) */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.98 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                  className="relative z-10 pointer-events-auto w-full sm:max-w-xl md:max-w-2xl h-[80dvh] min-h-[80dvh] max-h-[80dvh] sm:h-auto sm:min-h-[480px] sm:max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/80 dark:border-slate-800 font-sans"
                >
                  {/* Drag Handle on Mobile */}
                  <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-2.5 sm:hidden flex-shrink-0" />

                  {/* Header */}
                  <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between flex-shrink-0">
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span>⛺ मेला सेक्टर चयन (Sectors)</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300/40">
                          22 Sectors
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        नक्शा देखने के लिए किसी भी सेक्टर या मुख्य ग्राउंड को चुनें
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={closeModal}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 transition-colors cursor-pointer"
                      aria-label="Close"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Master Overview Card */}
                  <div className="p-3 sm:px-5 sm:py-3 flex-shrink-0">
                    <button
                      type="button"
                      onClick={handleGoToMain}
                      className={`w-full p-2.5 sm:p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer border ${
                        isMainMelaFloor
                          ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-200 shadow-sm ring-1 ring-amber-500/30'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:border-amber-400 hover:bg-amber-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl flex-shrink-0 border border-amber-400/30">
                          🌐
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                              मुख्य मेला ग्राउंड (Master Overview)
                            </span>
                            {isMainMelaFloor && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black">
                                सक्रिय
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            संगम क्षेत्र, अखाड़ा, झूंसी, अरैल सहित सभी 22 सेक्टरों का मुख्य ओवरव्यू
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-black text-amber-600 dark:text-amber-400 flex-shrink-0 pl-2">
                        <span>देखें</span>
                        <FiArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  </div>

                  {/* Search Filter */}
                  <div className="px-3 sm:px-5 py-2 bg-slate-50 dark:bg-slate-850 border-y border-slate-100 dark:border-slate-800 flex-shrink-0">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <FiSearch className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="सेक्टर खोजें (उदा. 1, 4, संगम, अखाड़ा)..."
                        value={sectorSearch}
                        onChange={(e) => setSectorSearch(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400"
                      />
                      {sectorSearch && (
                        <button onClick={() => setSectorSearch('')} className="text-xs text-slate-400 hover:text-slate-600">
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 22 Sectors Grid — 4 Columns on Mobile, 6 on Desktop */}
                  <div ref={sectorListRef} className="p-3 sm:p-5 overflow-y-auto flex-1 grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-2.5">
                    {filteredFloors.map((floor) => {
                      const isActive = currentFloor === floor.id;
                      const numMatch = (floor.name || '').match(/(\d+)/);
                      const num = numMatch ? parseInt(numMatch[1], 10) : null;
                      const color = num ? SECTOR_COLORS[num] : '#F58220';
                      const title = num ? SECTOR_TITLES[num] : '';

                      return (
                        <button
                          key={floor.id}
                          type="button"
                          onClick={() => handleSelectFloor(floor.id)}
                          className={`p-2 sm:p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border relative group active:scale-95 ${
                            isActive
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md border-2'
                              : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/60 hover:border-amber-400 hover:bg-amber-50/40'
                          }`}
                          style={{ borderColor: isActive ? color : undefined }}
                        >
                          {/* Number Badge */}
                          <div
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-black text-white mb-1 shadow-sm flex-shrink-0"
                            style={{ backgroundColor: color }}
                          >
                            {num || floor.level}
                          </div>

                          <span className="text-[10px] sm:text-[11px] font-black line-clamp-1">
                            {floor.name}
                          </span>
                          {title && (
                            <span className="text-[9px] text-slate-400 truncate max-w-full">
                              {title}
                            </span>
                          )}
                          {isActive && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          )}
                        </button>
                      );
                    })}

                    {filteredFloors.length === 0 && (
                      <div className="col-span-full py-8 text-center text-xs text-slate-400">
                        कोई सेक्टर नहीं मिला
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────────────
     STANDARD AIRPORT / BUILDING MODE (1-4 FLOORS)
  ───────────────────────────────────────────────────────────────────────────── */
  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-center gap-2 pointer-events-auto">
      <div className="relative group">
        <button 
          onClick={() => setShowBuildings(!showBuildings)}
          className="w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center mb-1 shadow-lg bg-white/70 dark:bg-slate-900/60 border-slate-200/50 text-slate-400 hover:text-sky-500"
          title={isMela ? "Switch Sector" : "Switch Building"}
        >
          <FiLayers className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 p-1.5 rounded-3xl shadow-2xl flex flex-col gap-1.5">
        {[...floors].reverse().map((floor) => {
          const isActive = currentFloor === floor.id;
          return (
            <button
              key={floor.id}
              onClick={() => setFloor(floor.id)}
              className={`w-10 h-10 flex items-center justify-center rounded-2xl outline-none transition-all ${
                isActive ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'
              }`}
              title={floor.name}
            >
              <span className="font-black text-xs">
                {floor.level}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
