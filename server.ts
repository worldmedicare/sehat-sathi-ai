import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Lazy initialize GenAI
function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SEHAT_SATHI_SYSTEM_INSTRUCTION = `
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Sehat Sathi AI – Worldmedicare',
    time: new Date().toISOString(),
  });
});

// Main Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, image, languageMode } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const ai = getGenAI();

    // Prepare contents
    const contents: any[] = [];

    // System instruction tweak based on language preference if specified
    let langInstruction = '';
    if (languageMode === 'hindi') {
      langInstruction = ' (Respond primarily in Hindi using Devanagari script with simple medical explanations)';
    } else if (languageMode === 'english') {
      langInstruction = ' (Respond in clear, accessible English with simple healthcare terminology)';
    } else {
      langInstruction = ' (Respond in warm, natural Hinglish / Hindi-English mix commonly spoken in India)';
    }

    // Format chat history
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const isLast = i === messages.length - 1;

      if (isLast && image && image.startsWith('data:image/')) {
        // Multimodal input with image
        const match = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (match) {
          const mimeType = match[1];
          const base64Data = match[2];
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
              {
                text: `${msg.content || 'Please analyze this health report / medicine image and explain its key parameters in simple terms with safety disclaimers.'}${langInstruction}`,
              },
            ],
          });
          continue;
        }
      }

      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [
          {
            text: isLast ? `${msg.content}${langInstruction}` : msg.content,
          },
        ],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction: SEHAT_SATHI_SYSTEM_INSTRUCTION,
        temperature: 0.6,
      },
    });

    const responseText = response.text || 'Maaf kijiye, main abhi iska uttar process nahi kar pa raha hoon. Kripya punah prayas karein.';
    const isEmergency = responseText.includes('[EMERGENCY_ALERT]');

    // Extract potential follow-up suggestions
    const suggestedFollowUps: string[] = [];
    if (isEmergency) {
      suggestedFollowUps.push('Emergency ambulance numbers in India', 'First-aid steps while ambulance arrives', 'Nearest hospital emergency department');
    } else {
      const lower = responseText.toLowerCase();
      if (lower.includes('fever') || lower.includes('bukhar')) {
        suggestedFollowUps.push('Bukhar me kya khana chahiye?', 'Paracetamol dose precautions', 'Kab blood test karwayein?');
      } else if (lower.includes('cough') || lower.includes('khansi') || lower.includes('throat')) {
        suggestedFollowUps.push('Khansi ke liye natural steam & kadha tips', 'Dry cough vs Wet cough me antar', 'Antibiotic kab leni chahiye?');
      } else if (lower.includes('blood pressure') || lower.includes('bp') || lower.includes('hypertension')) {
        suggestedFollowUps.push('High BP me namak kitna kam karein?', 'BP check karne ka sahi samay', 'BP naturally control karne ke yoga/lifestyle');
      } else if (lower.includes('sugar') || lower.includes('diabetes') || lower.includes('hba1c')) {
        suggestedFollowUps.push('HbA1c normal range kya hai?', 'Diabetic diet plan chart', 'Fasting vs Post-prandial sugar me farak');
      } else if (lower.includes('reel') || lower.includes('script') || lower.includes('hook')) {
        suggestedFollowUps.push('Is script ke liye 3 viral hooks banayein', 'Health Reel ke liye YouTube Shorts caption & hashtags', 'Thumbnail text & AI image prompt');
      } else {
        suggestedFollowUps.push('Iske gharelu aur surakshit nuskhe kya hain?', 'Doctor ko kab consult karna zaroori hai?', 'Khoon ki konsi jaanch (tests) karwani chahiye?');
      }
    }

    res.json({
      text: responseText,
      isEmergency,
      suggestedFollowUps,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: 'Failed to generate response from Sehat Sathi AI',
      details: error.message || 'Unknown error',
    });
  }
});

// Specialized Content Studio endpoint for Worldmedicare Creator Mode
app.post('/api/generate-content', async (req, res) => {
  try {
    const { topic, contentType, targetAudience, language, duration } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: SEHAT_SATHI_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({
      result: response.text,
      topic,
      contentType,
    });
  } catch (error: any) {
    console.error('Error in /api/generate-content:', error);
    res.status(500).json({
      error: 'Failed to generate content script',
      details: error.message || 'Unknown error',
    });
  }
});

// Lab Report Explainer Endpoint
app.post('/api/explain-report', async (req, res) => {
  try {
    const { reportText, image, testName } = req.body;
    const ai = getGenAI();

    const parts: any[] = [];

    if (image && image.startsWith('data:image/')) {
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: { parts },
      config: {
        systemInstruction: SEHAT_SATHI_SYSTEM_INSTRUCTION,
        temperature: 0.4,
      },
    });

    res.json({
      explanation: response.text,
    });
  } catch (error: any) {
    console.error('Error in /api/explain-report:', error);
    res.status(500).json({
      error: 'Failed to explain medical report',
      details: error.message || 'Unknown error',
    });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Sehat Sathi AI - Worldmedicare] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
