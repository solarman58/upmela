// Utility service for Google Translate integration
export function getActiveLanguage() {
  if (typeof document === 'undefined') return 'hi';
  
  // Check googtrans cookie (e.g. googtrans=/auto/bn or googtrans=/hi/en)
  const match = document.cookie.match(/(?:^|;\s*)googtrans=\/[^\/]+\/([^;]+)/);
  if (match && match[1]) {
    return match[1];
  }
  
  const saved = localStorage.getItem('kumbh_selected_lang');
  if (saved) return saved;

  return 'hi';
}

export function setLanguage(langCode) {
  if (typeof window === 'undefined') return;

  if (!langCode || langCode === 'original' || langCode === 'hi') {
    // Clear cookies to restore original
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname + ';';
    localStorage.removeItem('kumbh_selected_lang');

    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = 'hi';
      select.dispatchEvent(new Event('change'));
    }
    window.dispatchEvent(new CustomEvent('kumbh:lang-changed', { detail: { code: 'hi' } }));
    setTimeout(() => {
      window.location.reload();
    }, 200);
    return;
  }

  // Set cookies for Google Translate
  const cookieVal = `/auto/${langCode}`;
  document.cookie = `googtrans=${cookieVal}; path=/;`;
  document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname};`;
  document.cookie = `googtrans=${cookieVal}; path=/; domain=.${window.location.hostname};`;
  localStorage.setItem('kumbh_selected_lang', langCode);

  const select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event('change'));
    window.dispatchEvent(new CustomEvent('kumbh:lang-changed', { detail: { code: langCode } }));
  } else {
    // If widget combo not loaded yet, reload to pick up cookie
    window.location.reload();
  }
}
