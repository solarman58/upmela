import React, { useState, useEffect } from 'react';
import { FiGlobe } from 'react-icons/fi';
import { getActiveLanguage } from './translateService';
import { ALL_LANGUAGES } from './languages';
import LanguageSelectorModal from './LanguageSelectorModal';

export default function LanguageButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState('hi');

  useEffect(() => {
    setCurrentCode(getActiveLanguage());

    const handleLangChange = (e) => {
      if (e.detail?.code) setCurrentCode(e.detail.code);
    };
    window.addEventListener('kumbh:lang-changed', handleLangChange);
    return () => window.removeEventListener('kumbh:lang-changed', handleLangChange);
  }, []);

  const activeLangObj = ALL_LANGUAGES.find(l => l.code === currentCode) || {
    code: currentCode || 'hi',
    name: 'Hindi',
    native: 'हिन्दी',
    flag: '🇮🇳'
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="h-9 px-2.5 sm:px-3 rounded-xl flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100/80 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 border border-amber-200/60 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 active:scale-92 transition-all cursor-pointer shadow-xs"
        title="भाषा बदलें / Select Language (Google Translate)"
      >
        <span className="text-sm">🌐</span>
        <span className="text-[11px] font-black uppercase tracking-wider">
          {activeLangObj.code.slice(0, 2)}
        </span>
        <span className="hidden lg:inline text-xs font-bold text-slate-700 dark:text-slate-200">
          {activeLangObj.native}
        </span>
      </button>

      <LanguageSelectorModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
