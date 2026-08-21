import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  processChatRequest,
  processGenerateContent,
  processExplainReport,
  getApiKey,
} from './src/server/geminiService';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

function checkKey(): boolean {
  try {
    return Boolean(getApiKey());
  } catch {
    return false;
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Sehat Sathi AI – Worldmedicare',
    runtime: 'Local Express / AI Studio Container',
    geminiKeyConfigured: checkKey(),
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

    if (!checkKey()) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY environment variable is not configured.',
      });
    }

    const result = await processChatRequest({
      messages,
      image,
      languageMode,
    });

    res.json(result);
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

    if (!checkKey()) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY environment variable is not configured.',
      });
    }

    const result = await processGenerateContent({
      topic,
      contentType,
      targetAudience,
      language,
      duration,
    });

    res.json(result);
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

    if (!checkKey()) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY environment variable is not configured.',
      });
    }

    const result = await processExplainReport({
      reportText,
      image,
      testName,
    });

    res.json(result);
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
