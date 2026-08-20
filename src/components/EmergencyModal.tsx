import React from 'react';
import { 
  ShieldAlert, 
  X, 
  PhoneCall, 
  AlertOctagon, 
  Heart, 
  Activity, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { EMERGENCY_RED_FLAGS } from '../data/healthData';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-rose-400 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Urgent Header */}
        <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xs border border-white/30 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-900/60 px-2 py-0.5 rounded border border-rose-300/40">
                CRITICAL MEDICAL TRIAGE
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                Aapatkaleen Sahayata (Emergency Red Flags & Helplines)
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

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Quick Dial Helplines Bar */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 text-xs uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" /> Immediate Emergency Numbers (India & Toll-Free):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <a
                href="tel:112"
                className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-center transition-all flex flex-col items-center justify-center shadow-2xs group"
              >
                <span className="text-base font-extrabold text-rose-700 group-hover:scale-105 transition-transform">
                  📞 112
                </span>
                <span className="text-[10px] font-semibold text-slate-600 mt-0.5">
                  National Emergency
                </span>
              </a>

              <a
                href="tel:108"
                className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-center transition-all flex flex-col items-center justify-center shadow-2xs group"
              >
                <span className="text-base font-extrabold text-rose-700 group-hover:scale-105 transition-transform">
                  🚑 108
                </span>
                <span className="text-[10px] font-semibold text-slate-600 mt-0.5">
                  Medical Ambulance
                </span>
              </a>

              <a
                href="tel:102"
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-center transition-all flex flex-col items-center justify-center shadow-2xs group"
              >
                <span className="text-base font-extrabold text-slate-800 group-hover:scale-105 transition-transform">
                  👶 102
                </span>
                <span className="text-[10px] font-semibold text-slate-600 mt-0.5">
                  Maternal & Child
                </span>
              </a>

              <a
                href="tel:1075"
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-center transition-all flex flex-col items-center justify-center shadow-2xs group"
              >
                <span className="text-base font-extrabold text-slate-800 group-hover:scale-105 transition-transform">
                  🏥 1075
                </span>
                <span className="text-[10px] font-semibold text-slate-600 mt-0.5">
                  National Health Line
                </span>
              </a>
            </div>
          </div>

          {/* Red Flag Warning Signs List */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 text-xs flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              In Gambhir Lakshano me Turant Hospital Jayein:
            </h4>
            <div className="space-y-2">
              {EMERGENCY_RED_FLAGS.map((flag, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {flag.title}
                      </span>
                      <span className="text-[10px] font-extrabold bg-rose-600 text-white px-1.5 py-0.2 rounded">
                        {flag.urgency}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-slate-700 font-medium mt-0.5">
                      {flag.hinglish}
                    </p>
                    <p className="text-[11px] text-rose-800 font-semibold mt-0.5">
                      👉 {flag.action}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onSelectPrompt(`Mera emergency question is bare me hai: "${flag.title}". Iske liye turant prathmik first-aid aur hospital pohanchne tak kya karna chahiye?`);
                      onClose();
                    }}
                    className="flex-shrink-0 text-xs px-2.5 py-1 rounded-lg bg-white border border-rose-300 text-rose-800 font-semibold hover:bg-rose-100 transition-colors"
                  >
                    First-Aid Guide
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Golden Rules: DOs and DON'Ts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
              <h5 className="font-bold text-emerald-950 text-xs mb-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ambulance Aane Tak Kya Karein (DOs):
              </h5>
              <ul className="space-y-1 text-[11px] text-emerald-900">
                <li>• Mareez ko aaramdayak sthiti me bitha ya lita dein.</li>
                <li>• Gale aur kamar ke kapde dheele karein taaki hawa mile.</li>
                <li>• Khidkiyan khol dein aur bheed door rakhein.</li>
                <li>• Chot lagne par saaf kapde se dabav bana kar khoon rokein.</li>
              </ul>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
              <h5 className="font-bold text-rose-950 text-xs mb-1.5 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Yeh Galtiyan Bilkul Na Karein (DON'Ts):
              </h5>
              <ul className="space-y-1 text-[11px] text-rose-900">
                <li>• Behoshi me mooh me paani ya koi dawai na daalein.</li>
                <li>• Dil ke daure me mareez ko chalne ya seedhi chadhne na dein.</li>
                <li>• Daura (fits) aane par mooh me chammach ya kapda na thunsein.</li>
                <li>• Bina doctor ke guidance koi random painkiller na dein.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
