import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization for Gemini client
let genAI: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      genAI = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return genAI;
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Gemini AI Chat Proxy for Meta AI / WhatsApp AI assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemInstruction, image } = req.body;

    const aiClient = getGenAI();
    if (!aiClient) {
      // Friendly fallback if key is not configured
      return res.json({
        reply: "أهلاً بك! أنا المساعد الذكي في واتساب. يبدو أن مفتاح API الخاص بـ Gemini غير مهيأ حالياً في الإعدادات، ولكن يمكنني مساعدتك في الإجابة عن الأسئلة المباشرة!",
      });
    }

    const contents: any[] = [];

    if (Array.isArray(messages)) {
      for (const msg of messages) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        });
      }
    }

    if (image) {
      // Base64 image payload
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      contents.push({
        role: 'user',
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg',
            },
          },
          { text: 'صف هذه الصورة أو أجب بناءً عليها بالعربية.' },
        ],
      });
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents.length > 0 ? contents : 'مرحباً بك!',
      config: {
        systemInstruction:
          systemInstruction ||
          'أنت المساعد الذكي Meta AI / Gemini في تطبيق واتساب. أجب بلباقة ولغة عربية سليمة وواضحة، بصياغة وتنسيق جميل مناسب لتطبيق المحادثات. استخدم الإيموجي أحياناً لجعل المحادثة لطيفة وتفاعلية.',
      },
    });

    res.json({ reply: response.text || 'لم أتمكن من الحصول على رد.' });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: 'حدث خطأ أثناء الاتصال بالمساعد الذكي.',
      details: error.message,
    });
  }
});

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
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WhatsApp Web Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
