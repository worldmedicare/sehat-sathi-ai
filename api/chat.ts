import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Messages are required",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing in Vercel",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const contents = messages
      .map((message: any) => {
        const role =
          message?.role === "assistant" || message?.role === "model"
            ? "model"
            : "user";

        const text =
          typeof message?.content === "string"
            ? message.content
            : JSON.stringify(message?.content ?? "");

        return {
          role,
          parts: [{ text }],
        };
      })
      .filter((message: any) => message.parts[0].text.trim());

    if (contents.length === 0) {
      return res.status(400).json({
        error: "No valid message content found",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents,
      config: {
        systemInstruction: `
You are Sehat Sathi AI, the official AI health education assistant of Worldmedicare.

Your job:
- Give clear, useful and practical health information.
- Reply naturally in Hindi, Hinglish or English according to the user's language.
- Keep answers easy to understand.
- Be friendly, professional and concise.
- If the user asks a medical question, explain possible causes, basic precautions and when to see a doctor.
- Never claim to be a doctor.
- Never give dangerous or guaranteed diagnoses.
- Never tell users to stop, start or change prescription medicines without medical supervision.
- For serious emergency symptoms, advise immediate emergency medical care.
- Do not unnecessarily repeat disclaimers in every answer.
- Answer the user's actual question directly.

For casual messages like "hi", "hello", "hyy", respond naturally and warmly.
        `,
      },
    });

    const text = response.text?.trim();

    if (!text) {
      return res.status(502).json({
        error: "Gemini returned an empty response",
      });
    }

    return res.status(200).json({
      response: text,
    });
  } catch (error: any) {
    console.error("Sehat Sathi Gemini error:", error);

    return res.status(500).json({
      error: "AI response failed",
      details:
        error?.message ||
        error?.error?.message ||
        "Unknown Gemini error",
    });
  }
}
