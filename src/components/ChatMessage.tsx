import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  RotateCw, 
  ShieldAlert, 
  Sparkles, 
  User, 
  PhoneCall, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
  onFollowUpClick?: (query: string) => void;
  onRegenerate?: () => void;
  isLast?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onFollowUpClick,
  onRegenerate,
  isLast,
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const cleanText = message.content.replace(/\[EMERGENCY_ALERT\]/g, '').trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Try to pick a Hindi or Indian English voice if available
    const voices = window.speechSynthesis.getVoices();
    const hiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
    if (hiVoice) {
      utterance.voice = hiVoice;
    }
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div
      className={`py-3.5 sm:py-4 px-3 sm:px-4 rounded-2xl transition-all ${
        isUser
          ? 'bg-gradient-to-r from-teal-50 to-emerald-50/70 border border-teal-100/80 ml-4 sm:ml-12'
          : message.isEmergencyAlert
          ? 'bg-rose-50/90 border-2 border-rose-300 shadow-sm mr-2 sm:mr-10'
          : 'bg-white border border-slate-200/90 shadow-xs mr-2 sm:mr-10'
      }`}
    >
      <div className="flex items-start gap-2.5 sm:gap-3.5">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-8 h-8 rounded-xl bg-teal-800 text-white flex items-center justify-center shadow-xs">
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-xs text-white ${
                message.isEmergencyAlert
                  ? 'bg-rose-600 ring-2 ring-rose-300 animate-pulse'
                  : 'bg-gradient-to-br from-teal-700 to-emerald-600'
              }`}
            >
              {message.isEmergencyAlert ? (
                <ShieldAlert className="w-4 h-4 text-white" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              )}
            </div>
          )}
        </div>

        {/* Message Content Body */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-900">
                {isUser ? 'Aap (You)' : 'Sehat Sathi AI'}
              </span>
              {!isUser && (
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-teal-800 bg-teal-100/70 px-1.5 py-0.2 rounded border border-teal-200">
                  Worldmedicare
                </span>
              )}
              {message.isEmergencyAlert && (
                <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300 flex items-center gap-1 animate-pulse">
                  <AlertCircle className="w-3 h-3" /> Urgent Care Needed
                </span>
              )}
            </div>

            {/* Time & Action Toolbar */}
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <span>
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>

              {!isUser && (
                <div className="flex items-center gap-0.5 ml-1">
                  {/* TTS Voice Read Button */}
                  <button
                    onClick={handleToggleSpeech}
                    className={`p-1 rounded-lg transition-colors ${
                      isSpeaking
                        ? 'bg-teal-100 text-teal-800'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                    title={isSpeaking ? 'Awaaz rokein (Stop)' : 'Awaaz me sunein (Listen Audio)'}
                  >
                    {isSpeaking ? (
                      <VolumeX className="w-3.5 h-3.5 text-teal-700 animate-pulse" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="Copy Answer"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Regenerate Button on last assistant message */}
                  {isLast && onRegenerate && (
                    <button
                      onClick={onRegenerate}
                      className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      title="Regenerate Response"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Uploaded Image Preview if attached */}
          {message.image && (
            <div className="mb-2.5 max-w-xs rounded-xl overflow-hidden border border-slate-200 shadow-2xs bg-slate-50">
              <img
                src={message.image}
                alt={message.imageName || 'Attached Health Report / Image'}
                className="w-full h-auto object-cover max-h-48 rounded-t-xl"
                referrerPolicy="no-referrer"
              />
              <div className="p-1.5 text-[11px] text-slate-600 flex items-center gap-1 bg-white border-t border-slate-100">
                <FileText className="w-3 h-3 text-teal-600" />
                <span className="truncate">{message.imageName || 'Uploaded Medical Document/Image'}</span>
              </div>
            </div>
          )}

          {/* Emergency Alert Banner */}
          {message.isEmergencyAlert && (
            <div className="my-2.5 p-3 rounded-xl bg-rose-600 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-300 animate-bounce" />
                <div className="text-xs leading-snug">
                  <p className="font-bold text-white">Emergency Warning (Aapatkaleen Sanket):</p>
                  <p className="text-rose-100 text-[11px]">
                    Yeh lakshan gambhir ho sakte hain. Turant nazdeeki emergency hospital jayein ya ambulance call karein.
                  </p>
                </div>
              </div>
              <a
                href="tel:108"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-rose-700 font-extrabold text-xs shadow-xs hover:bg-rose-50 transition-colors flex-shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                Call 108 / 112
              </a>
            </div>
          )}

          {/* Text Content / Markdown */}
          <div className="prose prose-sm prose-slate max-w-none text-slate-800 text-[13.5px] sm:text-[14.5px] leading-relaxed break-words">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h2 className="text-base font-bold text-teal-950 mt-3 mb-1.5 border-b border-teal-100 pb-1">
                    {children}
                  </h2>
                ),
                h2: ({ children }) => (
                  <h3 className="text-sm font-bold text-teal-900 mt-2.5 mb-1 flex items-center gap-1">
                    {children}
                  </h3>
                ),
                h3: ({ children }) => (
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-800 mt-2 mb-1">
                    {children}
                  </h4>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-4 space-y-1 my-1.5 text-slate-700">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-4 space-y-1 my-1.5 text-slate-700">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="leading-snug">{children}</li>,
                p: ({ children }) => <p className="my-1.5 leading-relaxed">{children}</p>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-teal-500 bg-teal-50/50 pl-3 py-1 my-2 rounded-r-lg text-xs sm:text-sm text-teal-950 not-italic">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-2 rounded-lg border border-slate-200">
                    <table className="min-w-full text-xs text-left divide-y divide-slate-200">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="bg-slate-100 px-2.5 py-1.5 font-bold text-slate-800">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-2.5 py-1.5 border-t border-slate-100 text-slate-700">
                    {children}
                  </td>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-teal-950">{children}</strong>
                ),
              }}
            >
              {cleanText}
            </ReactMarkdown>
          </div>

          {/* Follow-up Suggested Prompts */}
          {!isUser && message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && onFollowUpClick && (
            <div className="mt-3 pt-2.5 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-600" />
                Agla Sawaal Poochhein (Quick Follow-ups):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {message.suggestedFollowUps.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => onFollowUpClick(chip)}
                    className="text-xs bg-teal-50/80 hover:bg-teal-100/90 text-teal-900 px-2.5 py-1 rounded-lg border border-teal-200/80 transition-colors font-medium text-left shadow-2xs active:scale-98"
                  >
                    👉 {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
