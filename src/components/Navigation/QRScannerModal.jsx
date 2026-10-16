import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import { useMapStore } from '../../store/useMapStore';
import { FiX, FiCamera, FiUpload, FiCheck, FiRefreshCw, FiZap } from 'react-icons/fi';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [isStarting, setIsStarting] = useState(true);
  const [scannedNode, setScannedNode] = useState(null);
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);

  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

  const { nodes, setNavigationStart, setFloor, currentFloor, zoomMapTo, addToast } = useMapStore();

  const parseNodeFromText = (qrText) => {
    if (!qrText || !nodes || !nodes.length) return null;
    const cleanText = qrText.trim();

    // 1. Try URL search params (?startNode=XYZ)
    try {
      if (cleanText.includes('?') || cleanText.startsWith('http')) {
        const urlObj = new URL(cleanText.startsWith('http') ? cleanText : 'https://dummy.com/' + cleanText);
        const nodeParam = urlObj.searchParams.get('startNode') || urlObj.searchParams.get('node');
        if (nodeParam) {
          const found = nodes.find(n => n.id === nodeParam);
          if (found) return found;
        }
      }
    } catch (e) {
      // not a full url, continue
    }

    // 2. Try direct ID match
    const byId = nodes.find(n => n.id === cleanText);
    if (byId) return byId;

    // 3. Try name match
    const lower = cleanText.toLowerCase();
    const byName = nodes.find(n => (n.name || '').toLowerCase() === lower);
    if (byName) return byName;

    // 4. Fallback: match any node ID contained in string
    const partialMatch = nodes.find(n => cleanText.includes(n.id));
    if (partialMatch) return partialMatch;

    return null;
  };

  const handleSuccessfulScan = (decodedText) => {
    // Prevent multiple triggers
    if (scannedNode) return;

    // Haptic feedback if supported
    if (navigator.vibrate) {
      try { navigator.vibrate([40, 60, 40]); } catch (e) {}
    }

    const matched = parseNodeFromText(decodedText);
    if (matched) {
      setScannedNode(matched);

      // Stop camera cleanly
      stopScanner();

      // Apply location to store
      setNavigationStart(matched);
      if (matched.floor && matched.floor !== currentFloor) {
        window.__mapSkipNextReset = true;
        setFloor(matched.floor);
      }

      setTimeout(() => {
        zoomMapTo(matched.x, matched.y, 4);
      }, 350);

      if (addToast) {
        addToast(`📍 स्थान सेट हो गया: ${matched.name}`, 'success');
      }

      if (onScanSuccess) {
        onScanSuccess(matched);
      }

      // Auto close after brief success indicator
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setErrorMsg(`QR कोड पढ़ा गया, परंतु कोई मान्य मेला स्थान नहीं मिला: "${decodedText.slice(0, 30)}..."`);
      setTimeout(() => setErrorMsg(null), 4000);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Error stopping QR scanner:', err);
      }
      html5QrCodeRef.current = null;
    }
  };

  const startScanner = async () => {
    setErrorMsg(null);
    setIsStarting(true);
    setScannedNode(null);

    const elementId = 'upmela-qr-reader';
    const readerElement = document.getElementById(elementId);
    if (!readerElement) return;

    try {
      await stopScanner();

      const html5QrCode = new Html5Qrcode(elementId);
      html5QrCodeRef.current = html5QrCode;

      const config = {
        fps: 15,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const edge = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * 0.75);
          return { width: edge, height: edge };
        },
        aspectRatio: 1.0,
      };

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => handleSuccessfulScan(decodedText),
        (errorMessage) => {
          // ignore frame scan errors
        }
      );

      setIsStarting(false);

      // Check for torch capability
      try {
        const capabilities = html5QrCode.getRunningTrackCapabilities();
        if (capabilities && capabilities.torch) {
          setHasTorch(true);
        }
      } catch (e) {}

    } catch (err) {
      console.error('Camera start failed:', err);
      setIsStarting(false);
      setErrorMsg('कैमरा शुरू करने में समस्या आई। कृपया कैमरा परमिशन (Allow) दें या नीचे से फोटो अपलोड करें।');
    }
  };

  const toggleTorch = async () => {
    if (!html5QrCodeRef.current || !hasTorch) return;
    try {
      const nextState = !torchOn;
      await html5QrCodeRef.current.applyVideoConstraints({
        advanced: [{ torch: nextState }]
      });
      setTorchOn(nextState);
    } catch (e) {
      console.warn('Torch toggle failed:', e);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsStarting(true);
      const html5QrCode = html5QrCodeRef.current || new Html5Qrcode('upmela-qr-reader');
      const result = await html5QrCode.scanFile(file, true);
      handleSuccessfulScan(result);
    } catch (err) {
      setErrorMsg('फोटो में QR कोड पहचान में नहीं आया। कृपया साफ फोटो चुनें।');
      setTimeout(() => setErrorMsg(null), 4000);
    } finally {
      setIsStarting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Delay slightly for modal mounting transition
      const timer = setTimeout(() => {
        startScanner();
      }, 250);
      return () => clearTimeout(timer);
    } else {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl select-none">
        
        {/* Background tap to close */}
        <div className="absolute inset-0" onClick={() => { stopScanner(); onClose(); }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative z-10 w-full max-w-sm rounded-[32px] bg-slate-950 border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <FiCamera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white">QR कोड स्कैनर (Location Scanner)</h3>
                <p className="text-[10px] text-slate-400">खंभे या द्वार पर लगे कोड को स्कैन करें</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {hasTorch && (
                <button
                  onClick={toggleTorch}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    torchOn ? 'bg-amber-500 text-white' : 'bg-white/10 text-slate-300 hover:text-white'
                  }`}
                  title="Flashlight"
                >
                  <FiZap className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => { stopScanner(); onClose(); }}
                className="w-8 h-8 rounded-full bg-white/10 text-slate-300 hover:text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scanner Viewport */}
          <div className="relative w-full aspect-square bg-black overflow-hidden flex items-center justify-center">
            
            {/* The element used by html5-qrcode */}
            <div id="upmela-qr-reader" className="w-full h-full" />

            {/* Targeting HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[75%] aspect-square relative border-2 border-amber-500/60 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                {/* 4 Corner Markers */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-xl" />

                {/* Laser animation */}
                {!scannedNode && (
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-bounce opacity-85 mt-[50%]" />
                )}

                {/* Success Overlay Checkmark */}
                {scannedNode && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 bg-emerald-500/90 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2 p-3 text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-white text-emerald-600 flex items-center justify-center text-2xl shadow-lg">
                      <FiCheck className="w-7 h-7 stroke-[3]" />
                    </div>
                    <span className="text-sm font-black">{scannedNode.name}</span>
                    <span className="text-[10px] font-bold opacity-90">स्थान सफलता से सेट हो गया!</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Loading Indicator */}
            {isStarting && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 text-white text-xs font-bold">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span>कैमरा तैयार हो रहा है...</span>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-4 bg-slate-900/80 flex flex-col gap-2.5">
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-bold text-center">
                {errorMsg}
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={startScanner}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer border border-slate-700"
              >
                <FiRefreshCw className="w-3.5 h-3.5" />
                <span>कैमरा रीस्टार्ट</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer border border-amber-500/30"
              >
                <FiUpload className="w-3.5 h-3.5" />
                <span>फोटो से स्कैन करें</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
