/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Award, CheckCircle2, RefreshCw, ChevronRight, Heart } from 'lucide-react';
import { QuizQuestion } from '../types';

const BUCIN_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Doi tiba-tiba balas chat kamu singkat padat: 'Y'. Tanggapan kamu?",
    options: [
      { text: "Bales singkat juga 'Y' biar adil dan impas.", score: 2, feedback: "Awas memicu perang dingin tingkat benua!" },
      { text: "Langsung panik, scroll chat dari setahun lalu buat nyari kesalahan diri.", score: 10, feedback: "Wah, kadar sensitifitas bucinmu sangat tinggi!" },
      { text: "Telepon langsung berkali-kali sampai diangkat takut doi kesurupan.", score: 8, feedback: "Posesif tapi menandakan kamu cinta berat!" },
      { text: "Tanya dengan lembut: 'Sayang capek ya? Mau aku belikan cemilan?'", score: 7, feedback: "Bijak dan peka, menenangkan ketegangan!" }
    ]
  },
  {
    id: 2,
    question: "Doi tiba-tiba pengen seblak ceker pedas jam 11 malam. Sikap kamu?",
    options: [
      { text: "Minta doi tidur aja, makan lewat mimpi gratis.", score: 1, feedback: "Kurang romantis! Peluang dapet seblak pagi pun sirna." },
      { text: "Nyari keliling kota pakai motor sampai dapet demi senyuman doi.", score: 10, feedback: "Ksatria seblak sejati! Penghargaan tertinggi pacar idaman." },
      { text: "Pesenin lewat ojek online sambil bilang: 'Aku temenin makan lewat video call ya.'", score: 8, feedback: "Praktis dan manis, tetap peduli di tengah malam." },
      { text: "Janjiin besok pagi-pagi sekali langsung dibelikan porsi paling jumbo.", score: 6, feedback: "Logis, tapi seblak tengah malam itu kepuasan batin." }
    ]
  },
  {
    id: 3,
    question: "Berapa kali kamu mengecek ponsel/HP hanya untuk memeriksa apakah doi sudah balas chat?",
    options: [
      { text: "HP selalu menempel di genggaman, 5 detik sekali wajib swipe-refresh!", score: 10, feedback: "Kamu sudah bersatu secara seluler dengan doi!" },
      { text: "Tiap 10-15 menit sekali pas lagi nggak sibuk.", score: 7, feedback: "Wajar dan sehat untuk hubungan yang stabil." },
      { text: "Nunggu notif bunyi aja baru dibuka.", score: 3, feedback: "Sangat tenang, tapi awas dibilang cuek!" },
      { text: "Dua jam sekali karena lagi mabar atau ngerjain tugas.", score: 4, feedback: "Doi bisa berasa dikesampingkan lho, hati-hati." }
    ]
  },
  {
    id: 4,
    question: "Doi ngedrop story lagu sedih di IG/TikTok tanpa penjelasan. Hal pertama yang kamu rasakan?",
    options: [
      { text: "Biasa aja, paling menyukai lagunya.", score: 2, feedback: "Positif thinking level dewa atau emang tidak peka?" },
      { text: "Langsung overthink, nanya: 'Sayang, lagu ini buat aku ya? Aku salah apa lagi?'", score: 10, feedback: "Bucin overthiking akut! Dunia langsung mendung seketika." },
      { text: "Langsung bales storynya dengan lagu tandingan yang romantis nempel.", score: 8, feedback: "Kreatif sekali menyembuhkan luka dengan kode lagu." },
      { text: "Langsung kirim VN (Voice Note) nanya kondisi sambil nyanyiin lagu penghibur.", score: 7, feedback: "Sangat menenangkan! Doi pasti tersenyum membaca ini." }
    ]
  },
  {
    id: 5,
    question: "Bagaimana kamu memanggil pasangan di tempat umum atau chat pribadi?",
    options: [
      { text: "Panggil nama panggung/aslinya langsung biar sopan.", score: 3, feedback: "Formal banget, berasa kayak lagi rapat komite sekolah." },
      { text: "Panggilan gemes custom (cth. cil, gembul, bay, ndut, mentega).", score: 10, feedback: "Bucin murni! Dunia serasa milik berdua, yang lain ngontrak." },
      { text: "Panggilan standar (cth. beb, sayang, honey).", score: 7, feedback: "Manis, romantis, dan aman didengar orang sekitar." },
      { text: "Memanggil panggilan aneh sarkas (cth. hey bro, bos, masbro).", score: 4, feedback: "Hubungan berasa seperti bestie/mabar tandingan." }
    ]
  }
];

export default function KuisBucin() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = BUCIN_QUIZ[currentIdx];

  const handleSelectOption = (idx: number, optScore: number) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    setScore((prev) => prev + optScore);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    if (currentIdx < BUCIN_QUIZ.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setQuizFinished(false);
  };

  // Get dynamic result rating
  const getBucinRank = () => {
    if (score >= 42) {
      return {
        badge: "Bucin Stadium Akhir (Grandmaster)",
        color: "from-rose-500 to-red-500 text-rose-600",
        desc: "Luar biasa! Kadar cintamu melebihi batas atmosfer bumi. Kamu rela mengorbankan waktu tidur, kuota, bahkan rasa malu demi kebahagiaan sang kekasih. Ingat ya, bucin boleh tapi dompet dan kesehatan batin juga harus dijaga masbro/mbaksis! ❤️",
        emoji: "👑❤️"
      };
    } else if (score >= 32) {
      return {
        badge: "Pejuang Cinta Senior (Gold Medal)",
        color: "from-amber-450 to-pink-500 text-amber-600",
        desc: "Kamu berada di zona romantis sejati yang manis namun berakal sehat. Kamu tahu kapan harus ngasih seblak dan kapan harus bersabar. Pasanganmu beruntung memilikimu karena kamu sangat peka dan selalu berusaha membahagiakannya tanpa kehilangan akal rasional. ✨",
        emoji: "🥇💖"
      };
    } else if (score >= 20) {
      return {
        badge: "Bucin Santai (Bronze Medal)",
        color: "from-blue-400 to-indigo-500 text-blue-600",
        desc: "Status asmaramu terbilang damai dan kasual. Kadang kamu romantis, kadang cuek asyik mabar kelereng atau rebahan. Cobalah sesekali untuk memberikan kejutan kecil atau pangilan mesra baru agar percikan asmara pacaran makin panas menyala! 🔥",
        emoji: "🥉☕"
      };
    } else {
      return {
        badge: "Ksatria Dingin (Independent Love)",
        color: "from-gray-400 to-slate-500 text-gray-600",
        desc: "Kadar bucinmu minim sekali. Kamu sangat mandiri dan logis. Hubungan bagimu adalah kesepakatan rasional. Awas, pacar kamu bisa sering merajuk karena dikira cuek dan kaku kayak balok es di kutub utara. Cobalah sebut nama panggilannya pakai nada manja! 😉",
        emoji: "🥶❄️"
      };
    }
  };

  const rank = getBucinRank();

  return (
    <div className="space-y-6 text-left" id="kuis_bucin">
      <div className="bg-white rounded-[40px] p-8 border border-art-border shadow-sm relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-24 h-24 bg-art-accent-bg/40 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full border border-art-primary flex items-center justify-center text-art-primary bg-art-bg flex-shrink-0 animate-bounce">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h2 className="font-serif italic text-xl md:text-2xl text-art-primary">Kuis Seberapa Bucin Kamu?</h2>
            <p className="text-xs uppercase tracking-widest text-art-muted/70 mt-0.5">Uji level cinta dan kepedulian tersembunyimu lewat skenario kocak ini!</p>
          </div>
        </div>

        {!quizFinished ? (
          <div className="space-y-6">
            {/* Pregress bar */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between text-[10px] font-bold text-art-muted uppercase tracking-widest">
                <span>Pertanyaan {currentIdx + 1} dari {BUCIN_QUIZ.length}</span>
                <span>Skor Akumulatif: {score}</span>
              </div>
              <div className="w-full bg-art-bg h-2.5 rounded-full overflow-hidden border border-art-border">
                <div
                  className="bg-art-primary h-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / BUCIN_QUIZ.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question card */}
            <div className="bg-art-accent-bg/40 p-6 rounded-[24px] border border-art-border/80 min-h-[5rem] flex items-center justify-center text-left">
              <p className="font-serif italic text-sm md:text-base font-bold text-art-text leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            {/* Options list */}
            <div className="space-y-3.5">
              {currentQuestion.options.map((opt, oIdx) => {
                const isSelected = selectedOption === oIdx;
                return (
                  <button
                    key={oIdx}
                    disabled={showFeedback}
                    onClick={() => handleSelectOption(oIdx, opt.score)}
                    className={`w-full text-left p-4 rounded-[20px] border text-xs md:text-sm transition-all focus:outline-none flex justify-between items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-art-primary bg-art-accent-bg font-bold text-art-primary ring-2 ring-art-primary/10'
                        : showFeedback
                        ? 'border-art-border bg-white text-art-muted/40'
                        : 'border-art-border bg-white text-art-text hover:border-art-primary hover:bg-art-bg/40'
                    }`}
                  >
                    <span>{opt.text}</span>
                    {isSelected && <Heart className="w-4 h-4 fill-art-primary text-art-primary flex-shrink-0 animate-pulse" />}
                  </button>
                );
              })}
            </div>

            {/* Selected feedback */}
            <AnimatePresence>
              {showFeedback && selectedOption !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-art-bg/50 rounded-[20px] border border-art-border text-xs text-art-text text-left font-sans italic"
                >
                  💡 <span className="font-bold">Analisis Singkat:</span> {currentQuestion.options[selectedOption].feedback}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action button */}
            {showFeedback && (
              <button
                onClick={handleNext}
                className="w-full bg-art-primary hover:bg-art-primary/95 text-white rounded-[24px] py-3.5 px-6 font-semibold text-sm transition-all shadow-sm focus:outline-none flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>{currentIdx < BUCIN_QUIZ.length - 1 ? 'Pertanyaan Selanjutnya' : 'Lihat Peringkat Bucin Kamu!'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-6 py-6 flex flex-col items-center"
          >
            {/* Award badge */}
            <div className="relative flex items-center justify-center w-24 h-24 bg-art-bg rounded-full border border-art-border shadow-sm mb-2">
              <span className="text-4xl">{rank.emoji}</span>
              <div className="absolute inset-0 bg-art-primary/10 rounded-full animate-ping pointer-events-none" />
            </div>

            <div className="space-y-3 max-w-lg">
              <span className="bg-art-accent-bg text-art-primary font-sans font-bold text-[10px] tracking-widest uppercase py-1 px-3.5 rounded-full border border-art-primary/10">
                HASIL EVALUASI ASMARA
              </span>
              <h3 className="font-serif italic text-lg md:text-xl font-bold text-art-primary">
                Peringkatmu: <span className="font-bold underline text-art-text">{rank.badge}</span>
              </h3>
              <p className="text-xs md:text-sm text-art-text/90 leading-relaxed bg-art-bg/30 p-6 rounded-[28px] border border-art-border shadow-inner font-sans text-left">
                {rank.desc}
              </p>
            </div>

            {/* Reset actions */}
            <button
              onClick={resetQuiz}
              className="mt-2 bg-art-primary hover:bg-art-primary/95 text-white rounded-[24px] py-3.5 px-6 font-semibold text-xs transition-all shadow-sm focus:outline-none flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ulang Kuis Cinta</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
