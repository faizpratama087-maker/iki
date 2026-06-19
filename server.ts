import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini SDK client
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Route for Gemini-powered love letters and date planner
app.post('/api/gemini/bucin', async (req: express.Request, res: express.Response) => {
  try {
    const { partnerName, yourName, tone, favoriteHabit, type } = req.body;
    
    // Use fallback strings if inputs are empty
    const partner = partnerName || 'Kamu';
    const sender = yourName || 'Aku';
    const selectedTone = tone || 'Sangat Bucin';
    const habitInfo = favoriteHabit ? `, hal paling manis dan menggemaskan tentangmu adalah: "${favoriteHabit}"` : '';
    
    let systemInstruction = '';
    let promptText = '';
    
    if (type === 'date_ideas') {
      systemInstruction = 'Kamu adalah seorang perencana kencan romantis legendaris yang sangat kreatif, hangat, ramah, dan penuh dengan ide-ide unik, menggemaskan, puitis, dan menyenangkan khas tren pacaran muda-mudi di Indonesia. Selalu berikan rekomendasi kencan menggunakan bahasa Indonesia yang super manis, manis-gemas, atau puitis.';
      promptText = `Buatlah 4 rekomendasi ide kencan kreatif, lucu, atau puitis untuk pasangan serasi antara ${sender} dan ${partner}. 
      Gaya/Tone kencan: "${selectedTone}". 
      Kebiasaan manis pasangan yang dimasukkan: "${habitInfo}". 
      
      Untuk masing-masing kencan, kamu WAJIB memberikan detail berikut dengan format indah:
      - Judul Kencan yang unik dan estetik (contoh: "Piknik Senja Sambil Baca Buku Bersama", "Kencan Seblak Mewah di Teras Rumah")
      - Lokasi / Setting Tempat
      - Aktivitas utama apa saja yang dilakukan bersama
      - Tips Tambahan ("Tips Bucin") agar kencan makin berkesan.
      Formatlah hasil tulisan dengan rapi menggunakan pembagi paragraf atau poin-poin yang jelas.`;
    } else {
      systemInstruction = 'Kamu adalah seorang pujangga cinta romantis legendaris, "Duta Bucin Terbesar Indonesia", yang pandai mendesain surat cinta modern, puisi puitis syahdu, kata-kata gombalan, dan ungkapan kerinduan terdalam menggunakan bahasa Indonesia yang sangat menyentuh hati, kadang manis-kocak, puitis, atau bombastis tergantung pesanan.';
      promptText = `Tolong tuliskan sebuah Surat Cinta Bucin mendalam dan berkesan dari ${sender} yang ditujukan khusus untuk sang kekasih tercinta, ${partner}.
      Gaya surat/puisi cinta: "${selectedTone}".
      Kebiasaan atau hal termanis tentang dia: "${habitInfo}".
      
      Surat ini harus terasa tulus, mendalam, penuh perasaan, menggunakan diksi yang pas (kamu bisa menggunakan bahasa kasual anak muda yang super romantis, puitis sastra lama, gombal kocak, atau puitis mendalam). 
      Sisipkan juga emoji hati (❤️), kelopak mawar (🌹), bintang (✨), atau pelukan (🤗) di beberapa bagian agar nampak estetik dan menggemaskan. Berikan Judul Surat Cinta yang romantis dan menarik di baris paling awal!`;
    }

    const ai = getGemini();
    const result = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 1.0,
      }
    });

    res.json({ success: true, text: result.text });
  } catch (err: any) {
    console.error('Gemini API Error:', err.message);
    res.status(500).json({ success: false, error: err.message || 'Gagal menghasilkan konten kemesraan bucin.' });
  }
});

// Setup server route
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
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bucin Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
