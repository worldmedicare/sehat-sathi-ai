import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  Video, 
  FileSpreadsheet, 
  Calculator, 
  Info, 
  Share2, 
  Activity, 
  Check, 
  HeartHandshake,
  RotateCcw,
  Languages
} from 'lucide-react';
import { LanguageMode } from '../types';

interface HeaderProps {
  languageMode: LanguageMode;
  onLanguageChange: (lang: LanguageMode) => void;
  onOpenContentStudio: () => void;
  onOpenEmergency: () => void;
  onOpenReportExplainer: () => void;
  onOpenHealthTools: () => void;
  onOpenAbout: () => void;
  onClearChat: () => void;
  hasMessages: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  languageMode,
  onLanguageChange,
  onOpenContentStudio,
  onOpenEmergency,
  onOpenReportExplainer,
  onOpenHealthTools,
  onOpenAbout,
  onClearChat,
  hasMessages,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShareApp = async () => {
    const shareData = {
      title: 'Sehat Sathi AI – Worldmedicare',
      text: 'Aapki Sehat, Aapka Saathi - AI Health Assistant & Report Explainer in Hindi/Hinglish by Worldmedicare!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        copyFallback();
      }
    } else {
      copyFallback();
    }
  };

  const copyFallback = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Brand Bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          {/* Logo Mark: Medical Cross + Green Leaf + Chat Bulb */}
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 text-white shadow-md shadow-teal-700/20 ring-2 ring-teal-500/20">
            {/* Medical Cross */}
            <div className="relative flex items-center justify-center">
              <div className="w-5 h-1.5 bg-white rounded-full"></div>
              <div className="w-1.5 h-5 bg-white rounded-full absolute"></div>
            </div>
            {/* Green Leaf Accent */}
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-tr-full rounded-bl-full border border-white shadow-xs"></div>
            {/* AI Sparkle */}
            <div className="absolute -bottom-1 -right-0.5 bg-amber-400 text-slate-900 rounded-full p-0.5 shadow-xs">
              <Sparkles className="w-2.5 h-2.5 fill-amber-300" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs tracking-wider uppercase font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                WORLDMEDICARE
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                AI Live
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight tracking-tight flex items-center gap-1.5">
              Sehat Sathi AI
              <span className="text-xs font-normal text-slate-500 hidden md:inline">
                • Aapki Sehat, Aapka Saathi
              </span>
            </h1>
          </div>
        </div>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Selector */}
          <div className="relative flex items-center bg-slate-100/90 rounded-xl p-0.5 border border-slate-200 text-xs font-medium">
            <Languages className="w-3.5 h-3.5 ml-1.5 text-slate-500 hidden sm:inline" />
            <button
              id="lang-hinglish-btn"
              onClick={() => onLanguageChange('hinglish')}
              className={`px-2 py-1 rounded-lg transition-all text-[11px] sm:text-xs ${
                languageMode === 'hinglish'
                  ? 'bg-teal-700 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Hinglish (Conversational)"
            >
              Hinglish
            </button>
            <button
              id="lang-hindi-btn"
              onClick={() => onLanguageChange('hindi')}
              className={`px-2 py-1 rounded-lg transition-all text-[11px] sm:text-xs ${
                languageMode === 'hindi'
                  ? 'bg-teal-700 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Hindi (हिंदी)"
            >
              हिंदी
            </button>
            <button
              id="lang-english-btn"
              onClick={() => onLanguageChange('english')}
              className={`px-2 py-1 rounded-lg transition-all text-[11px] sm:text-xs ${
                languageMode === 'english'
                  ? 'bg-teal-700 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Emergency SOS Button */}
          <button
            id="emergency-header-btn"
            onClick={onOpenEmergency}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-semibold transition-colors shadow-xs active:scale-95"
            title="Emergency Red Flags & Helplines (112/108)"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-600 animate-bounce" />
            <span className="hidden sm:inline">SOS</span> 108
          </button>

          {/* Share App Button (for Instagram bio / YouTube) */}
          <button
            id="share-app-btn"
            onClick={handleShareApp}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 transition-colors border border-slate-200"
            title="Share app link for Instagram / YouTube Bio"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          {/* Reset / New Chat */}
          {hasMessages && (
            <button
              id="clear-chat-btn"
              onClick={onClearChat}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs transition-colors border border-slate-200"
              title="New Conversation (Chat Saaf Karein)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Navigation Strip for Health Tools & Modes */}
      <div className="bg-slate-50/90 border-t border-slate-200/60 px-3 sm:px-6 py-1.5 overflow-x-auto no-scrollbar">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 min-w-max text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Features:
            </span>

            <button
              id="nav-reel-maker-btn"
              onClick={onOpenContentStudio}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200/80 shadow-2xs font-medium transition-all"
            >
              <Video className="w-3.5 h-3.5 text-teal-600" />
              <span>🎬 Health Reel Studio</span>
            </button>

            <button
              id="nav-report-explainer-btn"
              onClick={onOpenReportExplainer}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200/80 shadow-2xs font-medium transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>🧪 Lab Report Guide</span>
            </button>

            <button
              id="nav-health-tools-btn"
              onClick={onOpenHealthTools}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200/80 shadow-2xs font-medium transition-all"
            >
              <Calculator className="w-3.5 h-3.5 text-blue-600" />
              <span>⚖️ BMI & Myth Buster</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="nav-about-btn"
              onClick={onOpenAbout}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 hover:underline px-2 py-0.5"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-teal-700" />
              <span>Worldmedicare Safety & Privacy</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
