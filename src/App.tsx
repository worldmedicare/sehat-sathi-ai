import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Image as ImageIcon, 
  Mic, 
  MicOff, 
  X, 
  Sparkles, 
  ShieldAlert, 
  RotateCcw, 
  AlertCircle,
  HelpCircle,
  FileText,
  Heart,
  Info,
  PhoneCall,
  Video,
  FileSpreadsheet
} from 'lucide-react';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { QuickActions } from './components/QuickActions';
import { ContentStudioModal } from './components/ContentStudioModal';
import { ReportExplainerModal } from './components/ReportExplainerModal';
import { EmergencyModal } from './components/EmergencyModal';
import { HealthToolsModal } from './components/HealthToolsModal';
import { AboutSafetyModal } from './components/AboutSafetyModal';
import { ChatMessage as ChatMessageType, LanguageMode } from './types';

const INITIAL_GREETING: ChatMessageType = {
  id: 'msg-welcome-01',
  role: 'assistant',
  content: `Namaste! 🙏 Main hoon **Sehat Sathi AI**, **Worldmedicare** ka swasthya margdarshak (Health Education Companion).

> *"Aapki Sehat, Aapka Saathi"* ✨

Aap mujhse pooch sakte hain:
* 🩺 **Lakshan & Bemari Ki Samajh:** Bukhar, sardi, BP, sugar, digestion, thyroid
* 💊 **Dawaiyon Ki Jankari:** Generic uses, safe precautions aur schedule rules
* 🧪 **Lab Test Reports:** CBC, HbA1c, Lipid Profile, LFT, KFT report analysis
* 🥗 **Poshan & Lifestyle:** Immunity, Indian diet tips aur motapa control
* 🎬 **Worldmedicare Content Mode:** Instagram Reels scripts, YouTube Shorts & hooks
* 🚨 **Aapatkaleen Guidance:** Emergency red flags aur 108 helpline guide

*Aap Hindi, Hinglish ya English kisi bhi bhasha me likh sakte hain. Aaj aap kis vishay par janna chahte hain?*`,
  timestamp: Date.now(),
  suggestedFollowUps: [
    'Bukhar aur sir-dard ke prathmik gharelu upay',
    'HbA1c test report kaise samjhein?',
    'High Blood Pressure control karne ke tips',
    'Worldmedicare ke liye Health Reel Script banayein',
  ],
};

export default function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([INITIAL_GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [languageMode, setLanguageMode] = useState<LanguageMode>('hinglish');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Multimodal Attachment State
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedImageName, setAttachedImageName] = useState<string | null>(null);

  // Voice Input Speech Recognition
  const [isListening, setIsListening] = useState(false);

  // Modals
  const [isContentStudioOpen, setIsContentStudioOpen] = useState(false);
  const [isReportExplainerOpen, setIsReportExplainerOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isHealthToolsOpen, setIsHealthToolsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Voice Speech Recognition Setup
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Aapke browser me Voice Recognition support uplabdh nahi hai. Kripya type karein.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = languageMode === 'hindi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Kripya valid image file (JPG, PNG) chunein.');
      return;
    }

    setAttachedImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (customPrompt?: string, customImage?: string, customImageName?: string) => {
    const textToSend = customPrompt || input.trim();
    const imageToSend = customImage || attachedImage;
    const imageNameToSend = customImageName || attachedImageName;

    if (!textToSend && !imageToSend) return;

    const userMessage: ChatMessageType = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: textToSend || 'Please analyze this attached medical report / image.',
      timestamp: Date.now(),
      image: imageToSend || undefined,
      imageName: imageNameToSend || undefined,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setAttachedImage(null);
    setAttachedImageName(null);
    setErrorMessage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          image: imageToSend || undefined,
          languageMode,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: ChatMessageType = {
        id: `msg-assistant-${Date.now()}`,
        role: 'assistant',
        content: data.text || 'Kripya apna sawaal punah poochein.',
        timestamp: Date.now(),
        isEmergencyAlert: data.isEmergency,
        suggestedFollowUps: data.suggestedFollowUps || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setErrorMessage(
        'Sehat Sathi AI se judne me dikkat aayi. Kripya apna internet connection check karein aur punah prayas karein.'
      );
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleRegenerateLast = () => {
    if (messages.length < 2) return;
    const lastUserIndex = messages.map((m) => m.role).lastIndexOf('user');
    if (lastUserIndex === -1) return;

    const userMessage = messages[lastUserIndex];
    // Slice up to user message
    const trimmed = messages.slice(0, lastUserIndex + 1);
    setMessages(trimmed);
    setLoading(true);

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: trimmed.map((m) => ({ role: m.role, content: m.content })),
        languageMode,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const assistantMessage: ChatMessageType = {
          id: `msg-assistant-${Date.now()}`,
          role: 'assistant',
          content: data.text || 'Uttar prapt hua.',
          timestamp: Date.now(),
          isEmergencyAlert: data.isEmergency,
          suggestedFollowUps: data.suggestedFollowUps || [],
        };
        setMessages([...trimmed, assistantMessage]);
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage('Regenerate nahi ho saka. Kripya punah prayas karein.');
      })
      .finally(() => setLoading(false));
  };

  const handleClearChat = () => {
    if (window.confirm('Kya aap nayi conversation shuru karna chahte hain?')) {
      setMessages([INITIAL_GREETING]);
      setAttachedImage(null);
      setAttachedImageName(null);
      setInput('');
      setErrorMessage(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900">
      {/* Top Header */}
      <Header
        languageMode={languageMode}
        onLanguageChange={setLanguageMode}
        onOpenContentStudio={() => setIsContentStudioOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenReportExplainer={() => setIsReportExplainerOpen(true)}
        onOpenHealthTools={() => setIsHealthToolsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onClearChat={handleClearChat}
        hasMessages={messages.length > 1}
      />

      {/* Main Conversation Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 py-4 flex flex-col justify-between">
        <div className="space-y-3.5 pb-28 sm:pb-32">
          {/* Permanent Disclaimer Bar */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-[11px] sm:text-xs text-teal-950 flex items-start justify-between gap-2 shadow-2xs">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-teal-900">Worldmedicare Safety Notice:</span>{' '}
                Sehat Sathi AI swasthya jankari aur shiksha ke liye hai. Yeh doctor ka vikalp nahi hai. Gambhir sthiti me turant doctor ko dikhayein.
              </div>
            </div>
            <button
              onClick={() => setIsAboutOpen(true)}
              className="text-teal-800 font-bold hover:underline whitespace-nowrap text-[11px] self-center"
            >
              Details →
            </button>
          </div>

          {/* Messages Feed */}
          {messages.map((msg, index) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onFollowUpClick={(query) => handleSendMessage(query)}
              onRegenerate={handleRegenerateLast}
              isLast={index === messages.length - 1}
            />
          ))}

          {/* Typing Animation State */}
          {loading && (
            <div className="py-3 px-4 rounded-2xl bg-white border border-slate-200 shadow-xs mr-10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-700 to-emerald-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300 animate-spin" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-600">
                  Sehat Sathi AI soch raha hai...
                </span>
                <div className="flex items-center gap-1 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={handleRegenerateLast}
                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 transition-colors flex-shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* Quick Actions Component when minimal messages */}
          {messages.length <= 2 && (
            <div className="pt-2">
              <QuickActions
                onSelectAction={(prompt) => handleSendMessage(prompt)}
                onOpenReelModal={() => setIsContentStudioOpen(true)}
                onOpenReportModal={() => setIsReportExplainerOpen(true)}
                onOpenEmergencyModal={() => setIsEmergencyOpen(true)}
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Floating Bottom Composer Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2.5 sm:py-3 px-3 sm:px-6 shadow-lg">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Image Attachment Preview Tag */}
          {attachedImage && (
            <div className="flex items-center gap-2 p-1.5 px-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 w-max shadow-2xs animate-fadeIn">
              <img
                src={attachedImage}
                alt="Preview"
                className="w-7 h-7 object-cover rounded-lg border border-teal-300"
                referrerPolicy="no-referrer"
              />
              <span className="font-medium truncate max-w-xs">
                {attachedImageName || 'Attached Medical Image/Report'}
              </span>
              <button
                onClick={() => {
                  setAttachedImage(null);
                  setAttachedImageName(null);
                }}
                className="p-1 hover:bg-teal-200/60 rounded-full text-teal-800"
                title="Remove Image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Main Input Box & Toolbar */}
          <div className="flex items-end gap-1.5 sm:gap-2 bg-slate-50 border border-slate-300/80 rounded-2xl p-1.5 sm:p-2 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100 focus-within:bg-white transition-all shadow-inner">
            {/* Attachment Button */}
            <button
              id="attach-image-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-slate-500 hover:text-teal-800 hover:bg-teal-50 transition-colors flex-shrink-0"
              title="Upload Report or Prescription Image (Photo upload karein)"
            >
              <ImageIcon className="w-5 h-5" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
            </button>

            {/* Voice Input Mic Button */}
            <button
              id="voice-mic-btn"
              type="button"
              onClick={handleToggleVoice}
              className={`p-2 rounded-xl transition-all flex-shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-md'
                  : 'text-slate-500 hover:text-teal-800 hover:bg-teal-50'
              }`}
              title={isListening ? 'Sun raha hai (Listening... Click to Stop)' : 'Bolkar sawaal poochein (Voice Mic)'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Textarea Field */}
            <textarea
              ref={textareaRef}
              id="chat-input-textarea"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isListening
                  ? '🎤 Bol rahe hain... (Listening...)'
                  : languageMode === 'hindi'
                  ? 'अपना स्वास्थ्य प्रश्न यहाँ लिखें...'
                  : languageMode === 'english'
                  ? 'Ask any health question, symptom, or medicine info...'
                  : 'Apna sehat ka sawaal ya report yahan likhein (Hindi/Hinglish)...'
              }
              className="flex-1 max-h-32 min-h-[40px] bg-transparent border-0 resize-none outline-none text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm py-2 px-1 leading-relaxed"
            />

            {/* Send Button */}
            <button
              id="send-message-btn"
              type="button"
              onClick={() => handleSendMessage()}
              disabled={loading || (!input.trim() && !attachedImage)}
              className="p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center justify-center flex-shrink-0 active:scale-95"
              title="Send Message (Sawaal Bhejein)"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Micro Footer Status Bar */}
          <div className="flex items-center justify-between text-[10.5px] text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Worldmedicare • AI Powered Healthcare Assistant
            </span>
            <span className="hidden sm:inline">
              Press Enter ↵ to send • Shift+Enter for new line
            </span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <ContentStudioModal
        isOpen={isContentStudioOpen}
        onClose={() => setIsContentStudioOpen(false)}
        onSendToChat={(script) => handleSendMessage(script)}
      />

      <ReportExplainerModal
        isOpen={isReportExplainerOpen}
        onClose={() => setIsReportExplainerOpen(false)}
        onSendToChat={(query, img, imgName) => handleSendMessage(query, img, imgName)}
      />

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onSelectPrompt={(p) => handleSendMessage(p)}
      />

      <HealthToolsModal
        isOpen={isHealthToolsOpen}
        onClose={() => setIsHealthToolsOpen(false)}
        onSendToChat={(prompt) => handleSendMessage(prompt)}
      />

      <AboutSafetyModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
