import React, { useState } from 'react';
import { 
  Calculator, 
  X, 
  Droplet, 
  Flame, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Send,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { MYTH_FACTS_DATA } from '../data/healthData';

interface HealthToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat: (prompt: string) => void;
}

export const HealthToolsModal: React.FC<HealthToolsModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
}) => {
  const [activeTab, setActiveTab] = useState<'bmi' | 'water' | 'myths'>('bmi');

  // BMI State
  const [weightKg, setWeightKg] = useState<string>('68');
  const [heightCm, setHeightCm] = useState<string>('170');
  const [bmiResult, setBmiResult] = useState<{
    bmi: number;
    category: string;
    color: string;
    idealWeightMin: number;
    idealWeightMax: number;
  } | null>(null);

  // Water State
  const [userWeightWater, setUserWeightWater] = useState<string>('65');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'active'>('moderate');
  const [waterResult, setWaterResult] = useState<number | null>(null);

  // Myth Card index
  const [currentMythIdx, setCurrentMythIdx] = useState(0);
  const [showFact, setShowFact] = useState(false);

  if (!isOpen) return null;

  const calculateBMI = () => {
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm) / 100;
    if (!w || !h || h <= 0) return;

    const bmiVal = parseFloat((w / (h * h)).toFixed(1));
    let cat = 'Normal Weight';
    let col = 'text-emerald-700 bg-emerald-100 border-emerald-300';

    if (bmiVal < 18.5) {
      cat = 'Underweight (Vajan Kam Hai)';
      col = 'text-amber-700 bg-amber-100 border-amber-300';
    } else if (bmiVal >= 18.5 && bmiVal <= 24.9) {
      cat = 'Healthy / Normal (Sahi Vajan)';
      col = 'text-emerald-700 bg-emerald-100 border-emerald-300';
    } else if (bmiVal >= 25 && bmiVal <= 29.9) {
      cat = 'Overweight (Thoda Zyada Vajan)';
      col = 'text-orange-700 bg-orange-100 border-orange-300';
    } else {
      cat = 'Obese (Adhik Motapa)';
      col = 'text-rose-700 bg-rose-100 border-rose-300';
    }

    const idealMin = parseFloat((18.5 * h * h).toFixed(1));
    const idealMax = parseFloat((24.9 * h * h).toFixed(1));

    setBmiResult({
      bmi: bmiVal,
      category: cat,
      color: col,
      idealWeightMin: idealMin,
      idealWeightMax: idealMax,
    });
  };

  const calculateWater = () => {
    const w = parseFloat(userWeightWater);
    if (!w) return;

    let baseLitres = w * 0.033; // 33ml per kg
    if (activityLevel === 'moderate') baseLitres += 0.4;
    if (activityLevel === 'active') baseLitres += 0.8;

    setWaterResult(parseFloat(baseLitres.toFixed(1)));
  };

  const currentMyth = MYTH_FACTS_DATA[currentMythIdx];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-blue-700 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-xs border border-white/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                WORLDMEDICARE
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                Health Tools & Myth Buster
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

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('bmi')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'bmi'
                ? 'bg-white text-teal-900 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>BMI & Ideal Weight</span>
          </button>

          <button
            onClick={() => setActiveTab('water')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'water'
                ? 'bg-white text-teal-900 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplet className="w-3.5 h-3.5 text-blue-500" />
            <span>Water Hydration Calc</span>
          </button>

          <button
            onClick={() => setActiveTab('myths')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'myths'
                ? 'bg-white text-teal-900 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
            <span>Myth vs Fact Cards</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* TAB 1: BMI CALCULATOR */}
          {activeTab === 'bmi' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vajan (Weight in kg):
                  </label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kadh (Height in cm):
                  </label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="e.g. 170"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold"
                  />
                  <span className="text-[10px] text-slate-400">
                    5'7" = ~170 cm, 5'4" = ~163 cm
                  </span>
                </div>
              </div>

              <button
                onClick={calculateBMI}
                className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Calculator className="w-4 h-4" /> Calculate My BMI
              </button>

              {bmiResult && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 font-medium">Aapka BMI Score:</span>
                      <div className="text-2xl font-black text-slate-900 leading-tight">
                        {bmiResult.bmi}{' '}
                        <span className="text-xs font-normal text-slate-400">kg/m²</span>
                      </div>
                    </div>

                    <div className={`px-3 py-1.5 rounded-xl border font-bold text-xs ${bmiResult.color}`}>
                      {bmiResult.category}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-700">
                      🎯 <span className="font-semibold">Ideal Normal Weight Range:</span>{' '}
                      <span className="font-bold text-teal-800">
                        {bmiResult.idealWeightMin} kg - {bmiResult.idealWeightMax} kg
                      </span>
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      (Standard Asian Body Mass Index reference category)
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onSendToChat(
                        `Mera BMI ${bmiResult.bmi} (${bmiResult.category}) aaya hai aur meri height ${heightCm} cm, weight ${weightKg} kg hai. Mujhe vajan santulit rakhne ke liye ek practical Indian diet aur workout plan batayein.`
                      );
                      onClose();
                    }}
                    className="w-full py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-semibold text-xs border border-teal-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> Is BMI ke hisaab se Diet Plan poochhein
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WATER INTAKE CALCULATOR */}
          {activeTab === 'water' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Aapka Vajan (Body Weight in kg):
                </label>
                <input
                  type="number"
                  value={userWeightWater}
                  onChange={(e) => setUserWeightWater(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Daily Physical Activity Level:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => setActivityLevel('sedentary')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      activityLevel === 'sedentary'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Desk Job / Kam Motion
                  </button>
                  <button
                    onClick={() => setActivityLevel('moderate')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      activityLevel === 'moderate'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Moderate Walk / Chahal
                  </button>
                  <button
                    onClick={() => setActivityLevel('active')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      activityLevel === 'active'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Workout / Gym / Run
                  </button>
                </div>
              </div>

              <button
                onClick={calculateWater}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Droplet className="w-4 h-4" /> Calculate Daily Water Target
              </button>

              {waterResult && (
                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-blue-800 font-semibold">
                        Aapka Rozana Paani Target:
                      </span>
                      <div className="text-2xl font-black text-blue-950">
                        {waterResult} Litres{' '}
                        <span className="text-xs font-normal text-blue-700">
                          (~{Math.round(waterResult * 4)} standard glasses)
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11.5px] text-blue-900 leading-relaxed">
                    💡 <span className="font-semibold">Healthy Tip:</span> Paani hamesha thoda-thoda karke baith kar peeyein. Ek baar me bohot zyada paani peene ke bajaye din bhar hydrated rahein.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MYTH VS FACT CARDS */}
          {activeTab === 'myths' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Card {currentMythIdx + 1} of {MYTH_FACTS_DATA.length}</span>
                <span className="bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded">
                  {currentMyth.category}
                </span>
              </div>

              {/* Card */}
              <div className="p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-3 shadow-sm min-h-[160px] flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase font-extrabold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    ❌ Aam Bhranti (Common Myth)
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-2">
                    "{currentMyth.myth}"
                  </h4>
                </div>

                {showFact ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 animate-fadeIn">
                    <span className="text-xs uppercase font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mb-1">
                      ✓ Sachai (Medical Fact)
                    </span>
                    <p className="text-xs text-emerald-950 leading-relaxed font-medium mt-1">
                      {currentMyth.fact}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowFact(true)}
                    className="py-2 px-3 rounded-xl bg-teal-700 text-white font-semibold text-xs hover:bg-teal-800 transition-colors shadow-2xs self-start"
                  >
                    🔍 Sachai Dekhein (Reveal Fact)
                  </button>
                )}
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setShowFact(false);
                    setCurrentMythIdx((prev) => (prev > 0 ? prev - 1 : MYTH_FACTS_DATA.length - 1));
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
                >
                  ← Previous Myth
                </button>

                <button
                  onClick={() => {
                    setShowFact(false);
                    setCurrentMythIdx((prev) => (prev < MYTH_FACTS_DATA.length - 1 ? prev + 1 : 0));
                  }}
                  className="px-4 py-1.5 rounded-xl bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800 shadow-2xs flex items-center gap-1"
                >
                  Next Myth <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
