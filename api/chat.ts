export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages are required" });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing in Vercel Production environment",
      });
    }

    const conversation = messages
      .map((m: any) => {
        const role = m?.role || "user";
        const content =
          typeof m?.content === "string"
            ? m.content
            : JSON.stringify(m?.content ?? "");

        return `${role}: ${content}`;
      })
      .join("\n");

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: conversation,
                },
              ],
            },
          ],
          systemInstruction: {
            parts: [
              {
                text:
                  "You are Sehat Sathi AI, a friendly Indian healthcare education assistant. Give clear, simple and safe health information in Hindi, Hinglish or English according to the user's language. Do not claim to be a doctor. Do not provide unsafe prescription changes or guaranteed diagnoses. For emergencies, advise appropriate medical care.",
              },
            ],
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);

      return res.status(500).json({
        error: "Gemini API request failed",
        details:
          data?.error?.message ||
          data?.error?.status ||
          "Unknown Gemini API error",
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: any) => part?.text || "")
        .join("")
        .trim() || "";

    if (!text) {
      return res.status(500).json({
        error: "Gemini returned an empty response",
      });
    }

    return res.status(200).json({
      response: text,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);

    return res.status(500).json({
      error: "AI response failed",
      details: error?.message || "Unknown server error",
    });
  }
}
