var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var aiClient = null;
function getGemini() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
app.post("/api/gemini/bucin", async (req, res) => {
  try {
    const { partnerName, yourName, tone, favoriteHabit, type } = req.body;
    const partner = partnerName || "Kamu";
    const sender = yourName || "Aku";
    const selectedTone = tone || "Sangat Bucin";
    const habitInfo = favoriteHabit ? `, hal paling manis dan menggemaskan tentangmu adalah: "${favoriteHabit}"` : "";
    let systemInstruction = "";
    let promptText = "";
    if (type === "date_ideas") {
      systemInstruction = "Kamu adalah seorang perencana kencan romantis legendaris yang sangat kreatif, hangat, ramah, dan penuh dengan ide-ide unik, menggemaskan, puitis, dan menyenangkan khas tren pacaran muda-mudi di Indonesia. Selalu berikan rekomendasi kencan menggunakan bahasa Indonesia yang super manis, manis-gemas, atau puitis.";
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
      Sisipkan juga emoji hati (\u2764\uFE0F), kelopak mawar (\u{1F339}), bintang (\u2728), atau pelukan (\u{1F917}) di beberapa bagian agar nampak estetik dan menggemaskan. Berikan Judul Surat Cinta yang romantis dan menarik di baris paling awal!`;
    }
    const ai = getGemini();
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 1
      }
    });
    res.json({ success: true, text: result.text });
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    res.status(500).json({ success: false, error: err.message || "Gagal menghasilkan konten kemesraan bucin." });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bucin Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
