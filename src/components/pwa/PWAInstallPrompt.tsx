import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2, WifiOff } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallPrompt: React.FC = () => {
  const { canInstall, isInstalled, isIOS, isOnline, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // If already running standalone or user closed banner
  if (isInstalled || isDismissed) {
    if (!isOnline) {
      return (
        <div className="bg-amber-950/80 border-b border-amber-800/80 px-4 py-1.5 text-xs text-amber-200 flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          <span>Offline Mode Active: Your saved trips and Schengen calculations work 100% offline.</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
    } else {
      const success = await install();
      if (!success) {
        // Fallback for browsers that don't support beforeinstallprompt
        setShowIOSModal(true);
      }
    }
  };

  return (
    <>
      {/* Offline status indicator */}
      {!isOnline && (
        <div className="bg-amber-950/90 border-b border-amber-800 px-4 py-1.5 text-xs text-amber-200 flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          <span>Offline Mode: Calculating without internet connection using client-side cache.</span>
        </div>
      )}

      {/* Header Install Button (Mobile & Desktop) */}
      <button
        onClick={handleInstallClick}
        className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-500/10"
        title="Install app to your home screen for offline travel access"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>

      {/* iOS Safari Guided Install Sheet */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative animate-in fade-in slide-in-from-bottom-4">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Install NomadTax on Mobile</h4>
                <p className="text-xs text-slate-400">Works 100% offline at border checkpoints</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold shrink-0 text-[11px]">
                  1
                </span>
                <span>
                  Tap the <strong className="text-white">Share</strong> button <Share className="w-3.5 h-3.5 inline mx-1 text-indigo-400" /> in your Safari or Chrome toolbar.
                </span>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold shrink-0 text-[11px]">
                  2
                </span>
                <span>
                  Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" />.
                </span>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold shrink-0 text-[11px]">
                  3
                </span>
                <span>
                  Launch anytime with zero cell service or roaming needed.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
