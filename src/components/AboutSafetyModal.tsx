import React, { useState } from 'react';
import { 
  HeartHandshake, 
  X, 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  Share2,
  Globe
} from 'lucide-react';

interface AboutSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutSafetyModal: React.FC<AboutSafetyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedBio, setCopiedBio] = useState(false);

  if (!isOpen) return null;

  const appUrl = window.location.href;
  const instagramBioText = `🩺 Sehat Sathi AI by Worldmedicare\n✨ Aapki Sehat, Aapka Saathi\n🤖 Free 24/7 AI Health Guide, Lab Report Explainer & Reel Scripts:\n👉 ${appUrl}`;

  const handleCopyBio = () => {
    navigator.clipboard.writeText(instagramBioText);
    setCopiedBio(true);
    setTimeout(() => setCopiedBio(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-xs border border-white/20">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                WORLDMEDICARE INITIATIVE
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                About Sehat Sathi AI & Safety Protocols
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
          {/* Mission Statement */}
          <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-extrabold text-teal-900 text-xs sm:text-sm">
                About Worldmedicare
              </span>
              <span className="text-[10px] bg-teal-200/80 text-teal-900 px-1.5 py-0.2 rounded font-bold">
                Official Mission
              </span>
            </div>
            <p className="text-slate-800 font-medium leading-relaxed text-xs sm:text-sm">
              “<strong>Sehat Sathi AI</strong> is a <strong>Worldmedicare</strong> initiative designed to make reliable health education easier to understand and access.”
            </p>
            <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
              Tagline: <em>"Aapki Sehat, Aapka Saathi"</em> – Empowering individuals, families, and creators across India with accessible, multilingual medical awareness in simple Hindi, Hinglish, and English.
            </p>
          </div>

          {/* Safety Protocols (Crucial Guidelines) */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider text-teal-800">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Safety & Medical Guardrails (Hamari Suraksha Neetiyan):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  🚫 Not a Licensed Doctor
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Sehat Sathi AI does not replace clinical consultation, physical examination, or diagnostic doctor appointments.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  💊 No Direct Prescription Changes
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Never start, alter, or discontinue prescribed medications without your treating physician's direct approval.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  🚨 Immediate Emergency Redirection
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  For severe chest pain, stroke signs, breathing collapse, or severe trauma, we promptly advise calling 112/108 or ER.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  🧪 Educational Report Guidance
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Lab interpretations explain medical terminology and standard ranges, guiding what questions to ask your doctor.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Statement */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
            <h4 className="font-bold text-amber-950 text-xs mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-700" /> Privacy & Data Protection Notice:
            </h4>
            <p className="text-amber-900 text-xs leading-relaxed">
              “Sehat Sathi AI provides general health information and is not a substitute for professional medical advice. Avoid sharing unnecessary personal or sensitive information.”
            </p>
            <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
              We do not sell medical records or ask for financial details. Always crop/blur names and contact numbers when uploading test photos.
            </p>
          </div>

          {/* Instagram Bio & YouTube Link Sharing Kit */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1 text-teal-300">
                <Share2 className="w-3.5 h-3.5" /> Instagram Bio & YouTube Link Generator:
              </span>
              <button
                onClick={handleCopyBio}
                className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                {copiedBio ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-300" /> Copied Bio!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy Bio Text
                  </>
                )}
              </button>
            </div>
            <pre className="text-[11px] font-mono bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-slate-300 whitespace-pre-wrap">
              {instagramBioText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
