import React from 'react';
import { 
  Stethoscope, 
  Pill, 
  FileSpreadsheet, 
  Salad, 
  ShieldAlert, 
  Video, 
  Sparkles, 
  ChevronRight 
} from 'lucide-react';

interface QuickActionsProps {
  onSelectAction: (prompt: string, category?: string) => void;
  onOpenReelModal: () => void;
  onOpenReportModal: () => void;
  onOpenEmergencyModal: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onSelectAction,
  onOpenReelModal,
  onOpenReportModal,
  onOpenEmergencyModal,
}) => {
  const actions = [
    {
      id: 'health-question',
      title: '🩺 Health Question',
      subtitle: 'Lakshan & Rog Jankari',
      bg: 'hover:border-teal-400 hover:bg-teal-50/50',
      iconBg: 'bg-teal-100 text-teal-700',
      icon: Stethoscope,
      onClick: () =>
        onSelectAction(
          'Mujhe pichle 2 din se thakan, halka bukhar aur sir-dard hai. Iska kya karan ho sakta hai aur mujhe kya prathmik dekhbhal karni chahiye?',
          'symptom'
        ),
    },
    {
      id: 'medicine-info',
      title: '💊 Medicine Info',
      subtitle: 'Uses, Precautions & Rules',
      bg: 'hover:border-blue-400 hover:bg-blue-50/50',
      iconBg: 'bg-blue-100 text-blue-700',
      icon: Pill,
      onClick: () =>
        onSelectAction(
          'Paracetamol, Antacid aur ORS lene ka sahi tareeqa, timing aur jaruri precautions kya hote hain? Aasan bhasha me samjhayein.',
          'medicine'
        ),
    },
    {
      id: 'report-explain',
      title: '🧪 Report Explain',
      subtitle: 'CBC, Sugar, Thyroid Guide',
      bg: 'hover:border-emerald-400 hover:bg-emerald-50/50',
      iconBg: 'bg-emerald-100 text-emerald-700',
      icon: FileSpreadsheet,
      onClick: onOpenReportModal,
    },
    {
      id: 'nutrition',
      title: '🥗 Nutrition & Diet',
      subtitle: 'Immunity, Gut & Weight',
      bg: 'hover:border-amber-400 hover:bg-amber-50/50',
      iconBg: 'bg-amber-100 text-amber-700',
      icon: Salad,
      onClick: () =>
        onSelectAction(
          'Fatty liver, acidity aur high uric acid ke liye ek healthy Indian vegetarian daily diet chart aur foods to avoid batayein.',
          'nutrition'
        ),
    },
    {
      id: 'emergency-guidance',
      title: '🚨 Emergency Guide',
      subtitle: 'Red Flags & 108 Helpline',
      bg: 'hover:border-red-400 hover:bg-red-50/50',
      iconBg: 'bg-red-100 text-red-700',
      icon: ShieldAlert,
      onClick: onOpenEmergencyModal,
    },
    {
      id: 'make-health-reel',
      title: '🎬 Make Health Reel',
      subtitle: 'Worldmedicare Creator Studio',
      bg: 'hover:border-purple-400 hover:bg-purple-50/50',
      iconBg: 'bg-purple-100 text-purple-700',
      icon: Video,
      onClick: onOpenReelModal,
    },
  ];

  const quickChips = [
    {
      label: '🌡️ Viral Bukhar Gharelu Upay',
      prompt: 'Viral fever hone par hydration, sponge bath aur aaram ke sahi nuskhe batayein. Paracetamol kab lein?',
    },
    {
      label: '📊 HbA1c Sugar Normal Range',
      prompt: 'HbA1c test kya hota hai? 6.2% ya 7.5% aane par iska kya matlab hota hai aur ise naturally kaise control karein?',
    },
    {
      label: '🫀 High BP Shanti Upay',
      prompt: 'High blood pressure ko achanak badhne se rokne ke liye quick lifestyle tips aur breathing exercise kya hain?',
    },
    {
      label: '🔥 Acidity & Gas se Chutkara',
      prompt: 'Khane ke baad seene me jalan aur badhazmi kyu hoti hai? Turant aaram ke liye safe remedies kya hain?',
    },
    {
      label: '⚡ Vitamin D & B12 Deficiency',
      prompt: 'Sharir me Vitamin D aur B12 ki kami ke 5 main lakshan kya hain aur ise natural food se kaise poora karein?',
    },
    {
      label: '🎬 Viral Health Reel Script (Gut Health)',
      prompt: 'Worldmedicare ke liye "Subah khali pet 5 sabse badi galtiyan" par ek viral 45-second Instagram Reel script with Visual Cues banayein.',
    },
  ];

  return (
    <div className="w-full space-y-4">
      {/* 6 Primary Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              id={`quick-action-${act.id}`}
              onClick={act.onClick}
              className={`p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-left transition-all duration-200 flex flex-col justify-between group active:scale-98 ${act.bg}`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${act.iconBg}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  {act.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                  {act.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Popular Trending Topics Chips */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Aam Swasthya Sawaal (Trending Health Questions):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickChips.map((chip, i) => (
            <button
              key={i}
              id={`trending-chip-${i}`}
              onClick={() => onSelectAction(chip.prompt)}
              className="text-xs font-medium text-slate-700 bg-white hover:bg-teal-50 hover:text-teal-900 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-teal-300 shadow-2xs transition-all active:scale-98"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
