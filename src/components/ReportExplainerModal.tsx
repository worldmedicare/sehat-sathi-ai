import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  X, 
  Search, 
  Upload, 
  Sparkles, 
  AlertTriangle, 
  Info, 
  Check, 
  Send, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { LAB_TESTS_DATA } from '../data/healthData';
import { LabTestReference } from '../types';

interface ReportExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat: (query: string, image?: string, imageName?: string) => void;
}

export const ReportExplainerModal: React.FC<ReportExplainerModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
}) => {
  const [selectedTest, setSelectedTest] = useState<LabTestReference | null>(LAB_TESTS_DATA[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customValues, setCustomValues] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredTests = LAB_TESTS_DATA.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Kripya sirf image file (JPG, PNG) upload karein.');
      return;
    }

    setUploadedImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleExplain = async () => {
    setLoading(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/explain-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testName: selectedTest ? selectedTest.name : 'Medical Lab Report',
          reportText: customValues || `Selected Reference Test: ${selectedTest?.name}. Explain key normal ranges and high/low meaning in Hindi.`,
          image: uploadedImage,
        }),
      });

      const data = await res.json();
      if (data.explanation) {
        setAnalysisResult(data.explanation);
      } else {
        setAnalysisResult('Report explain karne me samasya aayi. Kripya punah prayas karein.');
      }
    } catch (err) {
      console.error(err);
      setAnalysisResult('Server connection error. Kripya punah prayas karein.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendToChatAction = () => {
    const query = `Maine Report Explainer tool me yeh test jaanch dekhi hai (${selectedTest?.name || 'Lab Report'}):\n${customValues ? `Values: ${customValues}` : ''}\n\nKripya is report ke bare me vistar se samjhayein aur batayein mujhe doctor se kya poochna chahiye?`;
    onSendToChat(query, uploadedImage || undefined, uploadedImageName || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-emerald-700 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-xs border border-white/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                  WORLDMEDICARE
                </span>
                <span className="text-xs text-teal-200">Diagnostics Guide</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                Lab & Diagnostic Report Explainer
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Privacy Reminder Banner */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="text-[11.5px] leading-relaxed">
              <span className="font-bold">Privacy & Security Notice:</span> Kripya apni personal details (jaise phone number, pura naam, address ya bank details) report se crop/blur kar ke upload karein. Sehat Sathi AI sirf medical parameters samajhne me sahayata karta hai.
            </div>
          </div>

          {/* Two-Column Grid: Test Reference Browser + Analysis Form */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Left: Popular Test Directory */}
            <div className="md:col-span-2 space-y-2 border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search test (CBC, Sugar, Thyroid...)"
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1.5 max-h-56 md:max-h-80 overflow-y-auto pr-1">
                {filteredTests.map((test, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTest(test)}
                    className={`w-full p-2 rounded-xl text-left transition-all border flex items-center justify-between ${
                      selectedTest?.name === test.name
                        ? 'bg-teal-50 border-teal-400 text-teal-950 font-bold'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="truncate">
                      <div className="text-xs truncate">{test.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal truncate">
                        {test.category}
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Selected Test Info & Custom Input / Upload */}
            <div className="md:col-span-3 space-y-3">
              {selectedTest && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {selectedTest.name}
                    </h4>
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded">
                      {selectedTest.category}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                    <p className="font-semibold text-slate-800">
                      📊 Normal Reference Range:
                    </p>
                    <p className="text-teal-800 font-mono text-[11px] mt-0.5">
                      {selectedTest.normalRange}
                    </p>
                  </div>

                  <p className="text-[11.5px] text-slate-600 leading-relaxed">
                    💡 <span className="font-semibold">Samajh:</span> {selectedTest.simpleExplanation}
                  </p>
                  <p className="text-[11.5px] text-rose-700 leading-relaxed">
                    ⚠️ <span className="font-semibold">Agar High/Low ho:</span> {selectedTest.whenHigh}
                  </p>
                </div>
              )}

              {/* Upload Image / Custom Value Box */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Apni Report ki Values ya Image daalein:
                </label>
                <textarea
                  rows={2}
                  value={customValues}
                  onChange={(e) => setCustomValues(e.target.value)}
                  placeholder="e.g. Hemoglobin 10.2, Platelets 1.2 Lakh, Fasting Sugar 135 mg/dL..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-200"
                />
              </div>

              {/* Upload Button */}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-teal-700" />
                  <span>{uploadedImageName ? 'Change Report Photo' : 'Upload Report Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {uploadedImageName && (
                  <span className="text-[11px] text-emerald-700 font-medium truncate">
                    ✓ {uploadedImageName}
                  </span>
                )}
              </div>

              {/* Explain Button */}
              <button
                onClick={handleExplain}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>AI Report Analysis Kar Raha Hai...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Explain Report in Simple Hindi / Hinglish</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Output */}
          {analysisResult && (
            <div className="mt-4 p-4 rounded-2xl bg-teal-50/60 border border-teal-200">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-teal-200">
                <span className="font-bold text-teal-950 text-xs flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-teal-700" /> Sehat Sathi Report Analysis:
                </span>
                <button
                  onClick={handleSendToChatAction}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors shadow-2xs"
                >
                  <Send className="w-3 h-3" /> Chat Me Detail Poochhein
                </button>
              </div>

              <div className="prose prose-xs sm:prose-sm max-w-none text-slate-800 bg-white p-3 rounded-xl border border-teal-100 max-h-72 overflow-y-auto text-xs leading-relaxed">
                <ReactMarkdown>{analysisResult}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
