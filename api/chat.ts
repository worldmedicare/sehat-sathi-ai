import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages are required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is missing" });
    }

    const ai = new GoogleGenAI({ apiKey });

    const conversation = messages
      .map((m: any) => `${m.role}: ${m.content}`)
      .join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: conversation,
      config: {
        systemInstruction:
          "You are Sehat Sathi AI, a friendly Indian healthcare education assistant. Give clear, simple and safe health information in Hindi, Hinglish or English according to the user's language. Do not claim to be a doctor. Do not provide unsafe prescription changes or guaranteed diagnoses. For emergencies, advise appropriate medical care.",
      },
    });

    return res.status(200).json({
      response: response.text || "Sorry, mujhe abhi response nahi mila.",
    });
  } catch (error: any) {
    console.error("Chat API error:", error);

    return res.status(500).json({
      error: "AI response failed",
      details: error?.message || "Unknown error",
    });
  }
}
