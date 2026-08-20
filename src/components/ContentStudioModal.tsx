import React, { useState } from 'react';
import { 
  Video, 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  PlaySquare, 
  Clock, 
  Hash, 
  Layers, 
  Lightbulb, 
  Image as ImageIcon 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SAMPLE_REEL_TOPICS } from '../data/healthData';

interface ContentStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat: (scriptText: string) => void;
}

export const ContentStudioModal: React.FC<ContentStudioModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
}) => {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<'reel_script' | 'shorts_script' | 'caption_hashtags' | 'hooks_ideas' | 'myth_fact' | 'image_prompt'>('reel_script');
  const [duration, setDuration] = useState<'30s' | '60s' | '90s'>('60s');
  const [language, setLanguage] = useState<'Hinglish' | 'Hindi' | 'English'>('Hinglish');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          contentType,
          duration,
          language,
          targetAudience: 'Indian Youth, Families, and Healthcare Seekers',
        }),
      });

      const data = await res.json();
      if (data.result) {
        setResult(data.result);
      } else {
        setResult('Script generation me samasya aayi. Kripya punah prayas karein.');
      }
    } catch (err) {
      console.error(err);
      setResult('Server connect nahi ho saka. Kripya internet ya prompt check karein.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToChatAction = () => {
    if (!result) return;
    onSendToChat(`Maine Worldmedicare Content Studio me yeh script banayi hai:\n\n${result}\n\nIs script par aur detail feedback ya alternate hooks de sakte hain?`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-teal-800 to-teal-700 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-xs border border-white/20">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                  WORLDMEDICARE
                </span>
                <span className="text-xs text-teal-200">Creator Hub</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                Health Reel & Video Script Studio
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
          {/* Preset Suggested Topics */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Popular Health Reel Topics (Click to Select):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_REEL_TOPICS.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setTopic(t)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    topic === t
                      ? 'bg-purple-100 border-purple-400 text-purple-900 font-semibold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Topic Input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Custom Topic / Health Theme:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 5 Morning habits for better digestion / Why your Vitamin D is low"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none text-slate-900 text-xs sm:text-sm"
            />
          </div>

          {/* Select Format & Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Format */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-teal-600" /> Format
              </label>
              <select
                value={contentType}
                onChange={(e: any) => setContentType(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-teal-100"
              >
                <option value="reel_script">🎬 Instagram Reel (with Visual Cues)</option>
                <option value="shorts_script">▶️ YouTube Shorts Script</option>
                <option value="hooks_ideas">🪝 5 Viral Health Video Hooks</option>
                <option value="caption_hashtags">📝 Captions & #Hashtags</option>
                <option value="myth_fact">⚡ Myth vs Fact Script</option>
                <option value="image_prompt">🎨 AI Thumbnail Image Prompt</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-teal-600" /> Length
              </label>
              <select
                value={duration}
                onChange={(e: any) => setDuration(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800"
              >
                <option value="30s">30 Seconds (Quick Tip)</option>
                <option value="60s">60 Seconds (Full Reel)</option>
                <option value="90s">90 Seconds (Deep-Dive)</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <PlaySquare className="w-3 h-3 text-teal-600" /> Voice Tone
              </label>
              <select
                value={language}
                onChange={(e: any) => setLanguage(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800"
              >
                <option value="Hinglish">Conversational Hinglish</option>
                <option value="Hindi">Pure Hindi (हिंदी)</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-700 to-teal-700 hover:from-purple-800 hover:to-teal-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Generating Worldmedicare Reel Script...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Generate Video Script & Hook</span>
              </>
            )}
          </button>

          {/* Generated Result Output */}
          {result && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Ready to Record Script
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors shadow-2xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Script
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSendToChatAction}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors shadow-2xs"
                  >
                    <Send className="w-3 h-3" /> Open in Chat
                  </button>
                </div>
              </div>

              <div className="prose prose-xs sm:prose-sm max-w-none text-slate-800 bg-white p-3 rounded-xl border border-slate-200 max-h-80 overflow-y-auto text-xs leading-relaxed">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
