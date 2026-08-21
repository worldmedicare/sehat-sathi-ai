import { GoogleGenAI } from '@google/genai';

export function getApiKey(): string {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return apiKey;
}

export function getGenAI(): GoogleGenAI {
  const apiKey = getApiKey();
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Resilient fallback model sequence for high uptime and free-tier quota tolerance
const FALLBACK_MODELS = [
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
];

async function generateContentWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    systemInstruction?: string;
  }
) {
  let lastError: any = null;

  for (const model of FALLBACK_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: {
          systemInstruction: params.systemInstruction,
        },
      });

      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.code;
      const errMsg = err?.message || String(err);
      console.warn(`[Gemini Model ${model} failed] (status: ${status}): ${errMsg.substring(0, 120)}`);
      // If 429 (rate limit/quota), 503 (high demand), 404 (model deprecated), try next model in sequence
      continue;
    }
  }

  throw lastError || new Error('All Gemini fallback models failed to respond.');
}

export const SEHAT_SATHI_SYSTEM_INSTRUCTION = `
You are "Sehat Sathi AI" (सेहत साथी AI) - the official AI health education and assistance companion created by WORLDMEDICARE.
Tagline: "Aapki Sehat, Aapka Saathi" (आपकी सेहत, आपका साथी).

PRIMARY ROLE & TONE:
1. You provide reliable, easy-to-understand health education, symptom understanding, medicine general knowledge, lab report explanations, nutrition guidance, and health awareness content for Worldmedicare.
2. Tone: Warm, empathetic, respectful, professional, reassuring, and culturally attuned to Indian and South Asian audiences.
3. Language: Default to friendly, conversational Hinglish (Hindi written in Roman or Devanagari script based on user style) or clear Hindi/English. Match the user's preferred language seamlessly.
4. Always clarify medical jargon into everyday terms (e.g., explaining "Hypertension" as "High Blood Pressure / उच्च रक्तचाप", "Dyspepsia" as "Badhazmi / Indigestion").

CRITICAL SAFETY & MEDICAL BOUNDARIES:
1. YOU ARE NOT A DOCTOR. Never claim to be a doctor, never guarantee a definitive diagnosis, and never provide custom prescription dosage modifications.
2. DO NOT tell users to start, stop, or alter prescription medications without consulting a licensed physician.
3. For general over-the-counter queries (e.g. Paracetamol, ORS, antacids), explain common use cases, hydration, standard precautions, and contraindications clearly.
4. RED FLAGS & EMERGENCIES:
   If the user reports any of the following emergency red flag symptoms:
   - Severe crushing chest pain or pressure spreading to arm/jaw
   - Sudden severe difficulty breathing or gasping
   - Sudden weakness, numbness, facial drooping, or slurred speech (Stroke / FAST)
   - Heavy uncontrollable bleeding or severe head trauma
   - High fever with stiff neck, confusion, or convulsions (especially in infants/children)
   - Severe allergic reaction (swelling of lips/throat, hives, anaphylaxis)
   - Suspected poisoning or overdose
   - Thoughts of self-harm

   YOU MUST:
   - Start the response with "[EMERGENCY_ALERT]" (the frontend uses this to highlight in red).
   - Strongly urge immediate emergency medical care / calling ambulance (112 or 108 in India / local emergency ER).
   - Provide safe first-aid positioning (e.g., resting position, keeping airway clear) while waiting for emergency help.
   - Do not delay care with lengthy explanations.

RESPONSE STRUCTURE (Use neat Markdown):
When answering symptom or health queries, organize clearly:
- 🩺 **Samajh / Context (Overview):** What the symptom or condition generally means in simple words.
- 🔍 **Sambhavit Karan (Possible Causes):** Common potential causes (without giving a fixed diagnosis).
- 💡 **Prathmik & Gharelu Upay (Safe Primary Care & Lifestyle):** Safe hydration, rest, dietary tips, or non-pharmacological care.
- ⚠️ **Doctor ko kab dikhayein (When to Consult a Doctor):** Warning signs requiring clinic visit.
- ❓ **Follow-up Question:** 1 brief, relevant question to understand their situation better (e.g., "Yeh pareshani kitne din se hai? Kya bukhar bhi hai?").

WORLDMEDICARE CONTENT CREATION MODE:
If the user asks for Reel scripts, Shorts, YouTube ideas, Instagram captions, hooks, or health awareness content for Worldmedicare:
- Create viral, engaging, medically accurate, and easy-to-record scripts.
- Include scene visual cues [Visual Cue], hook (0-3 sec), core tip (3-30 sec), call to action (Follow Worldmedicare & Sehat Sathi AI for daily health tips).

DISCLAIMER:
Keep in mind every advice is for general health literacy and empowerment, not a replacement for in-person consultation with a qualified doctor.
`;

export interface ChatRequestPayload {
  messages: Array<{ role: string; content: string }>;
  image?: string | null;
  languageMode?: 'hinglish' | 'hindi' | 'english';
}

export interface ChatResponsePayload {
  text: string;
  isEmergency: boolean;
  suggestedFollowUps: string[];
}

export async function processChatRequest(payload: ChatRequestPayload): Promise<ChatResponsePayload> {
  const { messages, image, languageMode } = payload;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new Error('Messages array is required');
  }

  const ai = getGenAI();

  let langInstruction = '';
  if (languageMode === 'hindi') {
    langInstruction = ' (Respond primarily in Hindi using Devanagari script with simple medical explanations)';
  } else if (languageMode === 'english') {
    langInstruction = ' (Respond in clear, accessible English with simple healthcare terminology)';
  } else {
    langInstruction = ' (Respond in warm, natural Hinglish / Hindi-English mix commonly spoken in India)';
  }

  // Filter and sanitize conversation history for Gemini multi-turn format:
  // 1. Gemini contents MUST start with 'user' role. Strip leading assistant/model greetings.
  // 2. Normalize roles: 'user' -> 'user', 'assistant'/'model' -> 'model'.
  // 3. Merge consecutive turns of identical roles so turns strictly alternate user -> model -> user.
  const rawCleaned: Array<{ role: 'user' | 'model'; text: string; image?: string }> = [];

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    const role: 'user' | 'model' = m.role === 'assistant' || m.role === 'model' ? 'model' : 'user';
    const isLast = i === messages.length - 1;
    const textContent = (m.content || '').trim();

    if (!textContent && !(isLast && image)) continue;

    rawCleaned.push({
      role,
      text: isLast && langInstruction ? `${textContent}${langInstruction}` : textContent,
      image: isLast && image ? image : undefined,
    });
  }

  // Find first user index so multi-turn starts with 'user'
  const firstUserIdx = rawCleaned.findIndex((m) => m.role === 'user');
  const validTurns = firstUserIdx >= 0 ? rawCleaned.slice(firstUserIdx) : rawCleaned;

  // Build Gemini contents with alternating turns
  const contents: any[] = [];

  for (let i = 0; i < validTurns.length; i++) {
    const turn = validTurns[i];
    const parts: any[] = [];

    if (turn.image && typeof turn.image === 'string' && turn.image.startsWith('data:image/')) {
      const match = turn.image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      }
    }

    if (turn.text) {
      parts.push({ text: turn.text });
    } else if (parts.length > 0) {
      parts.push({ text: 'Please analyze this medical report/image and explain in simple terms.' });
    }

    if (parts.length === 0) continue;

    // Check if consecutive with previous turn
    if (contents.length > 0 && contents[contents.length - 1].role === turn.role) {
      contents[contents.length - 1].parts.push(...parts);
    } else {
      contents.push({
        role: turn.role,
        parts,
      });
    }
  }

  // Fallback if contents is empty
  if (contents.length === 0) {
    contents.push({
      role: 'user',
      parts: [{ text: `Namaste! Please introduce Sehat Sathi AI.${langInstruction}` }],
    });
  }

  const response = await generateContentWithFallback(ai, {
    contents,
    systemInstruction: SEHAT_SATHI_SYSTEM_INSTRUCTION,
  });

  const responseText =
    response.text ||
    'Namaste! Main hoon Sehat Sathi AI. Aap apni sehat se judi koi bhi jankari ya sawaal pooch sakte hain.';
  const isEmergency = responseText.includes('[EMERGENCY_ALERT]');

  const suggestedFollowUps: string[] = [];
  if (isEmergency) {
    suggestedFollowUps.push(
      'Emergency ambulance numbers in India',
      'First-aid steps while ambulance arrives',
      'Nearest hospital emergency department'
    );
  } else {
    const lower = responseText.toLowerCase();
    if (lower.includes('fever') || lower.includes('bukhar')) {
      suggestedFollowUps.push(
        'Bukhar me kya khana chahiye?',
        'Paracetamol dose precautions',
        'Kab blood test karwayein?'
      );
    } else if (lower.includes('cough') || lower.includes('khansi') || lower.includes('throat')) {
      suggestedFollowUps.push(
        'Khansi ke liye natural steam & kadha tips',
        'Dry cough vs Wet cough me antar',
        'Antibiotic kab leni chahiye?'
      );
    } else if (lower.includes('blood pressure') || lower.includes('bp') || lower.includes('hypertension')) {
      suggestedFollowUps.push(
        'High BP me namak kitna kam karein?',
        'BP check karne ka sahi samay',
        'BP naturally control karne ke yoga/lifestyle'
      );
    } else if (lower.includes('sugar') || lower.includes('diabetes') || lower.includes('hba1c')) {
      suggestedFollowUps.push(
        'HbA1c normal range kya hai?',
        'Diabetic diet plan chart',
        'Fasting vs Post-prandial sugar me farak'
      );
    } else if (lower.includes('reel') || lower.includes('script') || lower.includes('hook')) {
      suggestedFollowUps.push(
        'Is script ke liye 3 viral hooks banayein',
        'Health Reel ke liye YouTube Shorts caption & hashtags',
        'Thumbnail text & AI image prompt'
      );
    } else {
      suggestedFollowUps.push(
        'Iske gharelu aur surakshit nuskhe kya hain?',
        'Doctor ko kab consult karna zaroori hai?',
        'Khoon ki konsi jaanch (tests) karwani chahiye?'
      );
    }
  }

  return {
    text: responseText,
    isEmergency,
    suggestedFollowUps,
  };
}

export interface GenerateContentPayload {
  topic: string;
  contentType?: string;
  targetAudience?: string;
  language?: string;
  duration?: string;
}

export async function processGenerateContent(payload: GenerateContentPayload) {
  const { topic, contentType, targetAudience, language, duration } = payload;

  if (!topic) {
    throw new Error('Topic is required');
  }

  const ai = getGenAI();

  const prompt = `
Create high-performing, medically verified, engaging healthcare creator content for WORLDMEDICARE.
Brand: WORLDMEDICARE - Sehat Sathi AI (Aapki Sehat, Aapka Saathi)

PARAMETERS:
- Topic: ${topic}
- Content Type: ${contentType || 'reel_script'} (Instagram Reel / YouTube Shorts / Caption / Hooks / Myth-Buster / Image Prompt)
- Target Audience: ${targetAudience || 'General public / Youth & Families in India'}
- Language: ${language || 'Hinglish'}
- Target Duration: ${duration || '45-60 seconds'}

FORMAT REQUIREMENT:
Provide a structured output with:
1. 🎬 **Catchy Title & Hook** (0-3 sec: Stops the scroll with curiosity/surprising health fact)
2. 📱 **Full Video Script with Timestamps & [Visual Cues]** (Scene by scene directions on what to show on screen + speech in conversational Hinglish)
3. 💡 **B-Roll & On-Screen Text Suggestions**
4. 📝 **Instagram & YouTube Caption** with emojis
5. 🏷️ **High-reach Relevant Hashtags** (including #Worldmedicare #SehatSathiAI #HealthTipsHindi #DoctorAdvice)
6. 🎨 **AI Image Generation Prompt** (to create an eye-catching thumbnail illustration)
7. ⚠️ **Medical Disclaimer** (Always added in caption)
`;

  const response = await generateContentWithFallback(ai, {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: SEHAT_SATHI_SYSTEM_INSTRUCTION,
  });

  return {
    result: response.text || '',
    topic,
    contentType: contentType || 'reel_script',
  };
}

export interface ExplainReportPayload {
  reportText?: string;
  image?: string | null;
  testName?: string;
}

export async function processExplainReport(payload: ExplainReportPayload) {
  const { reportText, image, testName } = payload;
  const ai = getGenAI();

  const parts: any[] = [];

  if (image && typeof image === 'string' && image.startsWith('data:image/')) {
    const match = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (match) {
      parts.push({
        inlineData: {
          mimeType: match[1],
          data: match[2],
        },
      });
    }
  }

  parts.push({
    text: `
Please analyze and explain this medical diagnostic laboratory report or test name: "${testName || 'Lab Report'}".
User provided notes/values: ${reportText || 'See attached image if available.'}

Break it down in easy-to-understand Hinglish / Hindi:
1. 🧪 **Test Ka Purpose (Yeh test kyu hota hai)**
2. 📊 **Key Parameters & Normal Reference Ranges (Important values)**
3. 🔍 **High ya Low hone ka aam matlab (General interpretations without definitive diagnosis)**
4. 🥗 **Lifestyle & Nutrition suggestions based on these parameters**
5. 👨‍⚕️ **Doctor se poochne layak mahatvapurna sawaal (Questions to ask your doctor)**
6. ⚠️ **Standard Laboratory Disclaimer (Reports must always be correlated clinically by your doctor)**
`,
  });

  const response = await generateContentWithFallback(ai, {
    contents: [{ role: 'user', parts }],
    systemInstruction: SEHAT_SATHI_SYSTEM_INSTRUCTION,
  });

  return {
    explanation: response.text || '',
  };
}
