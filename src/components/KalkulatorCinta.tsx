/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Copy, Check, RotateCcw } from 'lucide-react';

const CUTE_GOMBALAN = [
  "Kalau kamu jadi modem, aku rela jadi kuotanya. Biar bisa menghubungkan kita berdua menuju masa depan.",
  "Kamu itu seperti garam di lautan. Nggak kelihatan sih dari jauh, tapi kalau hilang, hidupku langsung hambar.",
  "Aku nggak sedih kalau besok hujan lebat. Yang aku takutin itu kalau besok aku nggak bisa melihat senyum manis kamu lagi.",
  "Katanya kalau sering bersin ada yang lagi kangen. Berarti kamu seharian ini bersin-bersin ya? Soalnya aku kangen kamu terus.",
  "Mau tahu bedanya kamu sama Monas? Kalau Monas milik pemerintah, kalau kamu sepenuhnya milik aku.",
  "Cinta aku ke kamu itu kayak lingkaran dinamis. Nggak punya titik awal, dan nggak akan pernah ada titik akhir.",
  "Ada 3 hal di dunia ini yang nggak bisa dihitung: bintang di langit, pasir di pantai, dan seberapa bucinnya aku ke kamu.",
  "Kamu tahu kenapa menara Pisa miring? Karena dia minder melihat tegaknya cintaku padamu.",
  "Aku rela ditilang polisi setiap hari, asalkan surat tilangnya bukti tanda kepemilikan hatimu.",
  "Jangan jalan sendirian di malam hari, ya. Soalnya kalau kamu hilang, dunia aku kehilangan cahaya tercantik.",
  "Kamu punya obeng nggak? Buat mengencangkan mur-mur hatiku yang kendor sejak terkena senyuman manis kamu."
];

export default function KalkulatorCinta() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [calculating, setCalculating] = useState(false);
  const [percent, setPercent] = useState<number | null>(null);
  const [resultMsg, setResultMsg] = useState('');
  const [quote, setQuote] = useState(CUTE_GOMBALAN[0]);
  const [copied, setCopied] = useState(false);
  const [copiedGombal, setCopiedGombal] = useState(false);

  // Compute love score based on names
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name1.trim() || !name2.trim()) return;

    setCalculating(true);
    setPercent(null);

    // Cute simulation timeout
    setTimeout(() => {
      // Calculate a stable score from both names so they always get the same score for the same input
      const combined = (name1.trim() + name2.trim()).toLowerCase();
      let sum = 0;
      for (let i = 0; i < combined.length; i++) {
        sum += combined.charCodeAt(i);
      }
      
      // Score will be between 75 and 100 to keep the vibe super romantic and encouraging!
      const finalScore = 75 + (sum % 26);
      setPercent(finalScore);
      setCalculating(false);

      if (finalScore >= 95) {
        setResultMsg(`🎉 ${finalScore}% - JODOH ABADI SEHIDUP SEMATI! Kalian adalah definisi pasangan yang ditakdirkan oleh alam semesta. Kurangi berdebat soal mau makan di mana ya!`);
      } else if (finalScore >= 88) {
        setResultMsg(`💖 ${finalScore}% - BUCIN STADIUM ULTRA! Tiada hari berlalu tanpa memikirkan doi. Hati-hati kecanduan senyumannya yang manis tiada tanding!`);
      } else if (finalScore >= 80) {
        setResultMsg(`🥰 ${finalScore}% - ROMANTIS DAN HARMONIS! Hubungan kalian sangat stabil, penuh pengertian, dan manis bagaikan susu kental manis campur es boba.`);
      } else {
        setResultMsg(`✨ ${finalScore}% - CINTA PENUH PETUALANGAN! Kadang ngambek tapi selalu kangen. Solusi terbaik kalau lagi ngambek adalah wajib ngasih seblak tingkat kepedasan level 5!`);
      }
    }, 1800);
  };

  const handleRandomGombal = () => {
    let nextQuote = quote;
    while (nextQuote === quote) {
      nextQuote = CUTE_GOMBALAN[Math.floor(Math.random() * CUTE_GOMBALAN.length)];
    }
    setQuote(nextQuote);
    setCopiedGombal(false);
  };

  const handleCopyGombal = () => {
    navigator.clipboard.writeText(quote);
    setCopiedGombal(true);
    setTimeout(() => setCopiedGombal(false), 2000);
  };

  const handleReset = () => {
    setName1('');
    setName2('');
    setPercent(null);
    setResultMsg('');
  };

  return (
    <div className="space-y-8" id="love_calculator">
      {/* Love Calculator Board */}
      <div className="bg-white rounded-[40px] p-8 border border-art-border shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-art-accent-bg/50 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full border border-art-primary flex items-center justify-center text-art-primary bg-art-bg flex-shrink-0">
            <Heart className="w-5 h-5 fill-art-primary text-art-primary animate-pulse" />
          </div>
          <div className="text-left">
            <h2 className="font-serif italic text-xl md:text-2xl text-art-primary">Kalkulator Chemistry Bucin</h2>
            <p className="text-xs uppercase tracking-widest text-art-muted/70 mt-0.5">Ketahui kecocokan batinmu dengan si dia secara akurat</p>
          </div>
        </div>

        {percent === null ? (
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-left">
                <label className="block text-[10px] uppercase tracking-widest text-art-muted mb-2 font-medium">Nama Kamu</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan namamu..."
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-art-border rounded-[24px] focus:border-art-primary focus:outline-none text-sm transition-colors shadow-sm text-art-text placeholder-art-muted/40"
                />
              </div>

              <div className="text-left">
                <label className="block text-[10px] uppercase tracking-widest text-art-muted mb-2 font-medium">Nama Pacar / Crush</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama doi..."
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-art-border rounded-[24px] focus:border-art-primary focus:outline-none text-sm transition-colors shadow-sm text-art-text placeholder-art-muted/40"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={calculating}
              className="w-full bg-art-primary hover:bg-art-primary/95 text-white rounded-[24px] py-3.5 px-6 font-semibold text-sm transition-all shadow-sm focus:outline-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {calculating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span className="font-serif italic text-sm">Sedang Menyelaraskan Getaran Hati...</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-white text-white" />
                  <span>Hitung Persentase Cinta</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-center space-y-5 py-4"
          >
            {/* Animated percentage container */}
            <div className="relative flex items-center justify-center w-36 h-36">
              {/* Outer pulsing ring */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 border-4 border-art-border rounded-full"
              />
              {/* Inner color ring */}
              <div className="absolute inset-2 border-4 border-dashed border-art-primary/40 rounded-full animate-spin-slow" />
              {/* Heart and Score */}
              <div className="z-10 flex flex-col items-center">
                <Heart className="w-8 h-8 text-art-primary fill-art-primary animate-bounce mb-1" />
                <span className="font-serif text-4xl font-extrabold text-art-text tracking-tight">{percent}%</span>
                <span className="text-[10px] font-bold text-art-primary tracking-wider">MATCH</span>
              </div>
            </div>

            <div className="space-y-3 max-w-lg">
              <h3 className="font-serif text-lg font-bold text-art-text">
                Hubungan Antara <span className="text-art-primary">{name1}</span> & <span className="text-art-primary">{name2}</span>
              </h3>
              <p className="text-sm italic font-serif text-art-muted leading-relaxed bg-art-accent-bg/60 p-4 rounded-[24px] border border-art-accent-border">
                {resultMsg}
              </p>
            </div>

            <button
              onClick={handleReset}
              className="mt-2 text-xs font-bold text-art-primary hover:opacity-85 flex items-center gap-1.5 focus:outline-none cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Hitung Ulang Pasangan Lain</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Flirty Generator Card */}
      <div className="bg-white rounded-[40px] p-8 border border-art-border shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-20 h-20 bg-art-accent-bg/50 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full border border-art-primary flex items-center justify-center text-art-primary bg-art-bg flex-shrink-0">
            <Sparkles className="w-5 h-5 font-bold" />
          </div>
          <div className="text-left">
            <h2 className="font-serif italic text-lg text-art-primary">Gombalan Maut Instant</h2>
            <p className="text-xs uppercase tracking-widest text-art-muted/70 mt-0.5">Salin racun cinta ini dan kirim ke WhatsApp / DM doi</p>
          </div>
        </div>

        <div className="bg-art-accent-bg/40 border border-art-accent-border/60 p-6 rounded-[32px] min-h-[5.5rem] flex items-center justify-center text-center relative group">
          <p className="font-serif italic text-sm md:text-base text-art-text leading-relaxed px-6">
            "{quote}"
          </p>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleRandomGombal}
            className="flex-1 bg-art-bg hover:bg-art-accent-bg/50 text-[#D48166] font-bold text-xs py-3.5 px-6 rounded-[24px] transition-all border border-art-border focus:outline-none cursor-pointer text-center"
          >
            Ganti Gombalan Lain 💖
          </button>
          <button
            onClick={handleCopyGombal}
            className={`px-6 py-3.5 rounded-[24px] border font-bold text-xs flex items-center gap-1.5 transition-all focus:outline-none cursor-pointer ${
              copiedGombal 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
              : 'bg-white border-art-border text-art-primary hover:bg-art-bg'
            }`}
          >
            {copiedGombal ? (
              <>
                <Check className="w-4 h-4" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
