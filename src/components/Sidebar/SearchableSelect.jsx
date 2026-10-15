import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiChevronDown, FiSearch, FiX, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, className }) => {
  if (!name) return null;
  const IconCmp = LucideIcons[name] || LucideIcons.HelpCircle;
  return <IconCmp className={className} />;
};

/**
 * SearchableSelect
 * - Mobile: Full-screen Portal modal with fixed 78dvh sheet so it NEVER collapses
 *   or bounces down when filtering to a single item.
 * - Always resets scroll to top (0) on search input so results are immediately in view.
 * - Desktop: Generous dropdown with proper width & z-index.
 */
export default function SearchableSelect({
  options = [], value, onChange, placeholder = 'Select location...',
  isControlledOpen = false, onOpen, onClose,
}) {
  const [search, setSearch] = useState('');
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto focus input when opened
  useEffect(() => {
    if (isControlledOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
    if (!isControlledOpen) setSearch('');
  }, [isControlledOpen]);

  // When search query changes, ALWAYS immediately reset list scroll to top so results are instantly visible
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [search]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isControlledOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isControlledOpen, onClose]);

  // Click outside to close (Desktop only — mobile uses backdrop)
  useEffect(() => {
    if (isMobile) return;
    const handleClickOutside = (e) => {
      if (isControlledOpen && containerRef.current && !containerRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isControlledOpen, isMobile, onClose]);

  const selectedOption = options.find(o => o.value === value);
  const filteredOptions = options.filter(o =>
    (o.label || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.value || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleTrigger = (e) => {
    e.stopPropagation();
    if (isControlledOpen) {
      onClose?.();
    } else {
      onOpen?.();
    }
  };

  const handleSelect = (val) => {
    onChange(val);
    onClose?.();
  };

  return (
    <div ref={containerRef} className="relative w-full min-w-0">
      {/* Trigger button */}
      <button
        type="button"
        onClick={handleTrigger}
        className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none min-w-0 transition-all shadow-sm hover:border-amber-400 dark:hover:border-amber-500 cursor-pointer active:scale-[0.98]"
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          {selectedOption?.icon && (
            <DynamicIcon name={selectedOption.icon} className="w-4 h-4 text-indigo-500 flex-shrink-0" />
          )}
          <span className="truncate text-slate-800 dark:text-slate-100">
            {selectedOption ? selectedOption.label : <span className="text-slate-400 font-normal">{placeholder}</span>}
          </span>
        </div>
        <FiChevronDown className={`flex-shrink-0 text-slate-400 ml-1.5 transition-transform duration-200 ${isControlledOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* ─────────────────────────────────────────────────────────────────
          MOBILE: Rendered via Portal into document.body
          Fixed stable 78dvh height ensures sheet NEVER collapses to bottom
          when search filters down to 1 item.
      ───────────────────────────────────────────────────────────────── */}
      {isMobile && isControlledOpen && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[9999] flex flex-col justify-end pointer-events-auto font-sans">
            {/* Fullscreen Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => onClose?.()}
            />

            {/* Bottom Sheet Card with STABLE FIXED HEIGHT (78dvh) */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative z-10 mx-auto w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden border-t border-slate-200/80 dark:border-slate-800 h-[78dvh] min-h-[78dvh] max-h-[78dvh]"
              style={{
                paddingBottom: 'max(14px, env(safe-area-inset-bottom, 14px))'
              }}
            >
              {/* Drag Handle */}
              <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-2.5 mb-1 flex-shrink-0" />

              {/* Title & Close Header */}
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 flex-shrink-0">
                <div className="min-w-0 flex-1 pr-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                    {placeholder}
                  </h4>
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate">
                    स्थान चुनें (Select Location)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onClose?.()}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex-shrink-0"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {/* Search Row */}
              <div className="p-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800/80 flex-shrink-0">
                <div className="flex items-center bg-white dark:bg-slate-800 rounded-2xl px-3 py-2.5 gap-2 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <FiSearch className="text-slate-400 w-4 h-4 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="खोजें (Search by name or floor)..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ fontSize: '16px' }}
                    className="w-full bg-transparent text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400 text-sm font-medium"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Options List — fills remaining height so single result stays firmly at the top */}
              <div 
                ref={listRef}
                className="overflow-y-auto flex-1 overscroll-contain p-2.5 space-y-1.5 custom-scrollbar"
              >
                {filteredOptions.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center gap-1.5">
                    <span className="text-2xl">🔍</span>
                    <span>कोई स्थान नहीं मिला (No results found)</span>
                  </div>
                ) : (
                  filteredOptions.map(opt => {
                    const isSelected = value === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelect(opt.value)}
                        className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-400/70 shadow-sm'
                            : 'bg-white dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-100 dark:border-slate-800 hover:border-indigo-200 active:scale-[0.99]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                          {opt.icon ? (
                            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-400 border border-indigo-100 dark:border-slate-700">
                              <DynamicIcon name={opt.icon} className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400 text-xs font-black">
                              📍
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-black text-[13px]">{opt.label}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
                            <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}

      {/* ─────────────────────────────────────────────────────────────────
          DESKTOP: Generous dropdown with proper width & z-index
      ───────────────────────────────────────────────────────────────── */}
      {!isMobile && (
        <AnimatePresence>
          {isControlledOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute z-[999] top-full right-0 min-w-[280px] w-full max-w-sm mt-1.5 bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col origin-top backdrop-blur-xl font-sans"
              style={{ maxHeight: '320px' }}
            >
              <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50 dark:bg-slate-900/70">
                <FiSearch className="text-slate-400 ml-1.5 flex-shrink-0 w-3.5 h-3.5" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="खोजें (Search location)..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400 font-medium py-1"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="p-1 text-slate-400 hover:text-slate-600">
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div 
                ref={listRef}
                className="overflow-y-auto flex-1 overscroll-contain p-1.5 custom-scrollbar space-y-0.5"
              >
                {filteredOptions.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">कोई स्थान नहीं मिला</div>
                ) : (
                  filteredOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        value === opt.value
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/40'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {opt.icon ? (
                          <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center flex-shrink-0 text-indigo-500">
                            <DynamicIcon name={opt.icon} className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center flex-shrink-0 text-slate-400 text-xs">
                            📍
                          </div>
                        )}
                        <span className="truncate">{opt.label}</span>
                      </div>
                      {value === opt.value && <span className="text-indigo-500 text-xs font-black">✓</span>}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
