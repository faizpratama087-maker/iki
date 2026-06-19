/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, FileText, CalendarDays, Copy, Check, Info } from 'lucide-react';

const TONES = [
  { id: 'Sangat Bucin', label: 'Bucin Abis 🥵', desc: 'Gaya emosional, bombastis, penuh gombalan tak berujung.' },
  { id: 'Sastrawan Klasik', label: 'Pujangga Klasik Sastra 📜', desc: 'Gaya puitis mendalam layaknya pujangga kuno penuh metafora indah.' },
  { id: 'Humoris Gombal', label: 'Canda Gombal 😂', desc: 'Penuh candaan segar, gombalan kocak, menyenangkan dan menghibur.' },
  { id: 'Melankolis Rindu', label: 'Rindu Syahdu 🥺', desc: 'Melankolis, menyentuh, sangat cocok buat yang LDR atau lagi kangen berat.' }
];

const HOLDING_MESSAGES = [
  "Membisiki pangeran/pujangga cinta digital...",
  "Mengumpulkan kelopak mawar virtual di awan...",
  "Merasakan getaran asmara di server Gemini...",
  "Merangkai kalimat manis anti hambar...",
  "Mengecek kadar gula kata-kata biar romantis..."
];

export default function SuratCintaAI() {
  const [yourName, setYourName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [favoriteHabit, setFavoriteHabit] = useState('');
  const [tone, setTone] = useState('Sangat Bucin');
  const [contentType, setContentType] = useState<'letter' | 'date_ideas'>('letter');
  
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(HOLDING_MESSAGES[0]);
  const [resultText, setResultText] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yourName.trim() || !partnerName.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setResultText(null);

    // Rotate messages to reassure user
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % HOLDING_MESSAGES.length;
      setLoadingMsg(HOLDING_MESSAGES[msgIdx]);
    }, 2500);

    try {
      const response = await fetch('/api/gemini/bucin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          yourName: yourName.trim(),
          partnerName: partnerName.trim(),
          favoriteHabit: favoriteHabit.trim(),
          tone,
          type: contentType
        })
      });

      const data = await response.json();
      if (data.success && data.text) {
        setResultText(data.text);
      } else {
        throw new Error(data.error || 'Server gagal menghasilkan tulisan cinta.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Koneksi gagal atau limit API tercapai. Jangan khawatir, cintamu tetap nyata!');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="surat_cinta_ai">
      <div className="bg-white rounded-[40px] p-8 border border-art-border shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-art-accent-bg/50 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full border border-art-primary flex items-center justify-center text-art-primary bg-art-bg flex-shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <h2 className="font-serif italic text-xl md:text-2xl text-art-primary">Pujangga Bucin AI</h2>
            <p className="text-xs uppercase tracking-widest text-art-muted/70 mt-0.5">Buat Surat Cinta Instan atau Rencana Kencan puitis didonaturi Gemini AI!</p>
          </div>
        </div>

        {/* Toggle Type */}
        <div className="flex bg-art-bg p-1 rounded-[24px] mb-6 border border-art-border">
          <button
            onClick={() => { setContentType('letter'); setResultText(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-[20px] text-xs font-bold transition-all focus:outline-none cursor-pointer ${
              contentType === 'letter'
                ? 'bg-white text-art-primary shadow-sm'
                : 'text-art-muted hover:text-art-primary'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Surat & Puisi Cinta AI</span>
          </button>
          <button
            onClick={() => { setContentType('date_ideas'); setResultText(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-[20px] text-xs font-bold transition-all focus:outline-none cursor-pointer ${
              contentType === 'date_ideas'
                ? 'bg-white text-art-primary shadow-sm'
                : 'text-art-muted hover:text-art-primary'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Rekomendasi Kencan Kreatif</span>
          </button>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-left">
              <label className="block text-[10px] uppercase tracking-widest text-art-muted mb-2 font-medium">Pengirim (Namamu)</label>
              <input
                type="text"
                required
                placeholder="cth. Rangga"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-art-border rounded-[24px] focus:border-art-primary focus:outline-none text-sm transition-colors shadow-sm text-art-text placeholder-art-muted/40"
              />
            </div>
            <div className="text-left">
              <label className="block text-[10px] uppercase tracking-widest text-art-muted mb-2 font-medium">Kekasih (Nama Doi)</label>
              <input
                type="text"
                required
                placeholder="cth. Cinta"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-art-border rounded-[24px] focus:border-art-primary focus:outline-none text-sm transition-colors shadow-sm text-art-text placeholder-art-muted/40"
              />
            </div>
          </div>

          <div className="text-left">
            <label className="block text-xs font-semibold text-art-text mb-1">
              Fakta / Kebiasaan Unik Doi yang Bikin Kangen (Opsional)
            </label>
            <p className="text-[10px] text-art-muted/75 mb-2">Membantu AI menulis detail unik agar surat atau rencana kencan terasa sangat spesial.</p>
            <input
              type="text"
              placeholder="cth. Suka ketawa sampai merem-merem, suka cubit lengan tiba-tiba, hobi minta seblak ceker"
              value={favoriteHabit}
              onChange={(e) => setFavoriteHabit(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-art-border rounded-[24px] focus:border-art-primary focus:outline-none text-sm transition-colors shadow-sm text-art-text placeholder-art-muted/40"
            />
          </div>

          <div className="text-left">
            <label className="block text-[10px] uppercase tracking-widest text-art-muted mb-3 font-medium">Pilih Karakter Diksi (Tone)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {TONES.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`border rounded-[24px] p-4 cursor-pointer transition-all flex flex-col justify-between hover:bg-art-bg/40 text-left ${
                    tone === t.id
                      ? 'border-art-primary bg-art-accent-bg ring-2 ring-art-primary/10'
                      : 'border-art-border bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-art-text mb-1">{t.label}</p>
                  <p className="text-[10px] text-art-muted/80 leading-normal">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-art-primary hover:bg-art-primary/95 text-white rounded-[24px] py-3.5 px-6 font-semibold text-sm transition-all shadow-sm focus:outline-none flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                <span className="font-serif italic text-sm">Membuat Keajaiban: {loadingMsg}</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 fill-white text-white" />
                <span>Mulai Buat Keajaiban AI ✨</span>
              </>
            )}
          </button>
        </form>

        {/* Error State */}
        {errorMsg && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex gap-2 items-start leading-relaxed text-left">
            <Info className="w-5 h-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold mb-0.5">Oops, Pujangga AI Lagi Capek Menyeleksi Kata</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Output Parchment Card */}
        {resultText && (
          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-[10px] uppercase tracking-widest text-art-muted font-bold">Hasil Racikan Pujangga AI</span>
              <button
                onClick={handleCopy}
                className={`text-xs font-bold flex items-center gap-1.5 py-1.5 px-4 rounded-[20px] border focus:outline-none cursor-pointer transition-all ${
                  copied
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : 'bg-white border-art-border text-art-primary hover:bg-art-bg'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Sukses Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Karya</span>
                  </>
                )}
              </button>
            </div>

            {/* Faux Parchment Style Container */}
            <div className="bg-[#fcf8f2] border-2 border-[#eae0d2] rounded-[32px] p-6 md:p-8 shadow-inner relative overflow-hidden text-left font-serif text-gray-850 text-sm md:text-base leading-relaxed tracking-wide space-y-4">
              {/* Retro Paper Texture / Line Styling */}
              <div className="absolute top-0 left-0 w-2 h-full bg-rose-200/40" />
              <div className="absolute top-0 right-0 w-2 h-full bg-orange-100/30" />
              <div className="absolute top-4 right-4 text-3xl opacity-15 pointer-events-none font-sans">🌹</div>
              <div className="absolute bottom-4 left-4 text-3xl opacity-15 pointer-events-none font-sans">💌</div>
              
              <div className="pl-4 whitespace-pre-wrap leading-relaxed select-text font-serif">
                {resultText}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
