import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSearch, FiCheck, FiGlobe, FiRotateCcw } from 'react-icons/fi';
import { TOP_INDIAN_LANGUAGES, ALL_LANGUAGES } from './languages';
import { getActiveLanguage, setLanguage } from './translateService';

export default function LanguageSelectorModal({ isOpen, onClose }) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('indian'); // 'indian' | 'all'
  const [currentLang, setCurrentLang] = useState('hi');

  useEffect(() => {
    setCurrentLang(getActiveLanguage());

    const handleLangChange = (e) => {
      if (e.detail?.code) setCurrentLang(e.detail.code);
    };
    window.addEventListener('kumbh:lang-changed', handleLangChange);
    return () => window.removeEventListener('kumbh:lang-changed', handleLangChange);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (code) => {
    setLanguage(code);
    setCurrentLang(code);
    onClose();
  };

  const handleReset = () => {
    setLanguage('original');
    setCurrentLang('hi');
    onClose();
  };

  const filteredLanguages = (activeTab === 'indian' ? TOP_INDIAN_LANGUAGES : ALL_LANGUAGES).filter(l => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return l.name.toLowerCase().includes(q) || l.native.toLowerCase().includes(q) || l.code.toLowerCase().includes(q);
  });

  return typeof document !== 'undefined' ? createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
        {/* Fullscreen Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/65 backdrop-blur-sm"
        />

        {/* Modal Window: Bottom sheet on mobile, rounded card on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative w-full sm:max-w-xl bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85dvh] sm:max-h-[80vh] z-10"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 text-xl">
                🌐
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white leading-tight">
                  भाषा चुनें / Select Language
                </h3>
                <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                  100+ भाषाओं में तुरंत अनुवाद करें (Google Translate)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all cursor-pointer"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar & Tabs */}
          <div className="px-4 pt-3 pb-2 flex flex-col gap-2.5 bg-slate-50/50 dark:bg-slate-900/50">
            {/* Search Input */}
            <div className="relative flex items-center">
              <FiSearch className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="भाषा खोजें / Search language (e.g. Bengali, Tamil, French)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80">
              <button
                onClick={() => setActiveTab('indian')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  activeTab === 'indian'
                    ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                🇮🇳 भारतीय भाषाएं ({TOP_INDIAN_LANGUAGES.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                🌍 सभी भाषाएं ({ALL_LANGUAGES.length}+)
              </button>
            </div>
          </div>

          {/* Languages Grid */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredLanguages.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border-amber-500 shadow-md shadow-orange-500/10'
                        : 'bg-white dark:bg-slate-800/80 hover:bg-amber-50/50 dark:hover:bg-slate-700/50 border-slate-200/80 dark:border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl shrink-0">{lang.flag}</span>
                      <div className="min-w-0">
                        <span className={`text-xs font-black block truncate leading-tight ${
                          isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-white'
                        }`}>
                          {lang.native}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 truncate block">
                          {lang.name}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {filteredLanguages.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                कोई भाषा नहीं मिली / No language matched "{search}"
              </div>
            )}
          </div>

          {/* Footer Reset Action */}
          <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <FiRotateCcw className="w-3.5 h-3.5" />
              <span>मूल भाषा (Reset to Original)</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              बंद करें (Close)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  ) : null;
}
