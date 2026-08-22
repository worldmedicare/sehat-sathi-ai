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

    const contents = messages
      .map((message: any) => {
        const role =
          message?.role === "assistant" || message?.role === "model"
            ? "model"
            : "user";

        const text =
          typeof message?.content === "string"
            ? message.content.trim()
            : String(message?.content ?? "").trim();

        return {
          role,
          parts: [{ text }],
        };
      })
      .filter((message: any) => message.parts[0].text.length > 0);

    // Gemini conversation must start with user
    while (contents.length > 0 && contents[0].role === "model") {
      contents.shift();
    }

    if (contents.length === 0) {
      return res.status(400).json({
        error: "No valid user message found",
      });
    }

    const googleResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [
              {
                text: `
You are Sehat Sathi AI, the healthcare education assistant of Worldmedicare.

PERSONALITY:
- Friendly
- Helpful
- Professional
- Easy to understand
- Natural Indian conversational style

LANGUAGE:
- Reply in the same language as the user.
- Hindi -> Hindi.
- Hinglish -> natural Hinglish.
- English -> English.

HEALTH SAFETY:
- Give general health education and guidance.
- Do not claim to be a doctor.
- Do not give guaranteed diagnoses.
- Do not tell users to start, stop, or change prescription medicines without medical supervision.
- For emergency symptoms, recommend immediate medical care.
- Explain possible causes, precautions and sensible next steps.

CONVERSATION:
- For hi, hello, hyy etc., reply naturally and warmly.
- Answer the user's actual question directly.
- Keep simple questions concise.
- Give detailed answers when the user asks for details.
                `.trim(),
              },
            ],
          },
          generationConfig: {
            thinkingConfig: {
              thinkingLevel: "low",
            },
          },
        }),
      }
    );

    const data = await googleResponse.json();

    if (!googleResponse.ok) {
      console.error("GEMINI ERROR:", data);

      return res.status(500).json({
        error: "Gemini API request failed",
        status: googleResponse.status,
        details:
          data?.error?.message ||
          data?.error?.status ||
          JSON.stringify(data),
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: any) => part?.text || "")
        .join("")
        .trim();

    if (!text) {
      console.error("EMPTY GEMINI RESPONSE:", data);

      return res.status(502).json({
        error: "Gemini returned an empty response",
        details: JSON.stringify(data),
      });
    }

    return res.status(200).json({
      response: text,
      text: text,
    });
  } catch (error: any) {
    console.error("SEHAT SATHI API ERROR:", error);

    return res.status(500).json({
      error: "AI response failed",
      details: error?.message || String(error),
    });
  }
}
