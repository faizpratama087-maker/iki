/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PenTool, ShieldCheck, CheckSquare, Square, Download, FileCheck, Share2 } from 'lucide-react';

const PRESET_RULES = [
  { id: 'rule_1', text: 'Dilarang keras mematikan centang biru atau status terakhir dilihat di WhatsApp tanpa izin tertulis dari pasangan.', category: 'komunikasi' },
  { id: 'rule_2', text: 'Wajib mengabari minimal 5 menit setelah sampai di tempat tujuan (bukan 2 jam kemudian baru bilang lupa).', category: 'komunikasi' },
  { id: 'rule_3', text: 'Bila ditanya "mau makan apa?", dilarang keras menjawab "terserah". Wajib menyodorkan minimal 3 nama menu/tempat fiktif atau riil.', category: 'kuliner' },
  { id: 'rule_4', text: 'Saat pasangan mengalami badmood, pihak yang sehat pikiran wajib menyuplai asupan Seblak, Boba, es krim, atau Martabak tanpa protes.', category: 'kuliner' },
  { id: 'rule_5', text: 'Kalapun merasa kesal, waktu marahan maksimal hanya boleh berlangsung dari fajar terbit sampai matahari terbenam. Sebelum tidur wajib baikan!', category: 'emosi' },
  { id: 'rule_6', text: 'Pura-pura paling terpesona setiap kali pasangan memakai pakaian baru atau bergaya rambut baru walaupun kelihatannya mirip sebelumnya.', category: 'emosi' },
  { id: 'rule_7', text: 'Dilarang ngeliatin mantan di sosial media. Ketahuan nge-like foto mantan denda membelikan tiket nonton bioskop bioskop premier.', category: 'emosi' },
];

export default function PerjanjianBucin() {
  const [pihak1, setPihak1] = useState('');
  const [pihak2, setPihak2] = useState('');
  const [selectedRules, setSelectedRules] = useState<string[]>(PRESET_RULES.map(r => r.id));
  const [signed, setSigned] = useState(false);
  const [signDate, setSignDate] = useState('');
  const [documentNo, setDocumentNo] = useState('');

  const toggleRule = (id: string) => {
    setSelectedRules(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pihak1.trim() || !pihak2.trim() || selectedRules.length === 0) return;

    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    setSignDate(today.toLocaleDateString('id-ID', options));
    
    // Generate lovely mock document number
    const rand = Math.floor(1000 + Math.random() * 9000);
    setDocumentNo(`SK-BUCIN/${today.getFullYear()}/${rand}`);
    setSigned(true);
  };

  const handleReset = () => {
    setSigned(false);
    setPihak1('');
    setPihak2('');
  };

  return (
    <div className="space-y-6" id="perjanjian_bucin">
      <div className="bg-white rounded-[40px] p-8 border border-art-border shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-art-accent-bg/50 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full border border-art-primary flex items-center justify-center text-art-primary bg-art-bg flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h2 className="font-serif italic text-xl md:text-2xl text-art-primary">Dokumen Komitmen Bucin</h2>
            <p className="text-xs uppercase tracking-widest text-art-muted/70 mt-0.5">Buat perjanjian pacaran tertulis bermeterai cinta virtual agar hubungan makin harmonis!</p>
          </div>
        </div>

        {!signed ? (
          <form onSubmit={handleSign} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-left">
                <label className="block text-[10px] uppercase tracking-widest text-art-muted mb-2 font-medium">Nama Pihak Pertama (Kamu)</label>
                <input
                  type="text"
                  required
                  placeholder="cth. Rangga"
                  value={pihak1}
                  onChange={(e) => setPihak1(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-art-border rounded-[24px] focus:border-art-primary focus:outline-none text-sm transition-colors shadow-sm text-art-text placeholder-art-muted/40"
                />
              </div>
              <div className="text-left">
                <label className="block text-[10px] uppercase tracking-widest text-art-muted mb-2 font-medium">Nama Pihak Kedua (Pasangan)</label>
                <input
                  type="text"
                  required
                  placeholder="cth. Cinta"
                  value={pihak2}
                  onChange={(e) => setPihak2(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-art-border rounded-[24px] focus:border-art-primary focus:outline-none text-sm transition-colors shadow-sm text-art-text placeholder-art-muted/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-art-muted mb-3 font-medium text-left">Pilih Pasal-Pasal Perjanjian</label>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {PRESET_RULES.map((rule) => {
                  const isChecked = selectedRules.includes(rule.id);
                  return (
                    <div
                      key={rule.id}
                      onClick={() => toggleRule(rule.id)}
                      className={`flex gap-3 items-start p-4 border rounded-[20px] cursor-pointer transition-all ${
                        isChecked
                          ? 'border-art-primary bg-art-accent-bg/60 text-art-text'
                          : 'border-art-border bg-white text-art-muted/70'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-art-primary flex-shrink-0 focus:outline-none cursor-pointer"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 fill-art-accent-bg" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                      <div className="text-left text-xs leading-relaxed font-sans select-none">
                        <span className="font-sans font-bold text-[9px] uppercase text-art-primary mr-1 bg-art-bg/80 px-2 py-0.5 rounded-full border border-art-border">
                          {rule.category}
                        </span>{' '}
                        {rule.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={selectedRules.length === 0}
              className="w-full bg-art-primary hover:bg-art-primary/95 text-white rounded-[24px] py-3.5 px-6 font-semibold text-sm transition-all shadow-sm focus:outline-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <PenTool className="w-4 h-4" />
              <span>Sahkan Perjanjian & Tandatangani 🖋️</span>
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-6"
          >
            {/* Certificate Render */}
            <div className="bg-[#fdfcf7] border-4 border-double border-art-primary/30 rounded-[32px] p-6 md:p-10 shadow-lg relative text-center text-art-text select-text overflow-hidden font-serif">
              {/* Floral background decoration */}
              <div className="absolute inset-2 border border-art-primary/10 rounded-[24px] pointer-events-none" />
              <div className="absolute top-2 left-2 text-xl opacity-20">📜</div>
              <div className="absolute top-2 right-2 text-xl opacity-20">📜</div>
              <div className="absolute bottom-2 left-2 text-xl opacity-20">✒️</div>
              <div className="absolute bottom-2 right-2 text-xl opacity-20">✒️</div>

              {/* Certificate Header */}
              <div className="space-y-1 block">
                <h3 className="text-art-primary font-sans tracking-widest text-xs font-bold uppercase">Surat Keputusan Komitmen Cinta</h3>
                <h4 className="text-art-text text-lg md:text-xl font-bold font-serif italic mb-1">DEKRIT PERJANJIAN BUCIN ABADI</h4>
                <p className="text-[10px] text-art-muted font-sans tracking-wide">Nomor Surat: {documentNo}</p>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-art-primary/30 to-transparent my-3 w-4/5 mx-auto" />
              </div>

              {/* Preamble */}
              <p className="text-xs leading-relaxed text-art-muted max-w-lg mx-auto mb-6">
                Bahwa pada hari ini, <span className="font-bold">{signDate}</span>, telah dicapai kesepakatan asmara batin yang mengikat antara <span className="font-bold underline text-art-primary">{pihak1}</span> (Pihak Pertama) dan <span className="font-bold underline text-art-primary">{pihak2}</span> (Pihak Kedua) dengan kesadaran asmara penuh dan tanpa paksaan dari mantan mana pun.
              </p>

              {/* Rules List inside Certificate */}
              <div className="text-left max-w-md mx-auto space-y-3 bg-[#faf9f3] p-6 rounded-[24px] border border-art-primary/10 mb-6">
                <p className="text-[10px] font-sans font-bold text-art-primary uppercase tracking-widest mb-2 border-b border-art-primary/10 pb-1">
                  BUTIR PERJANJIAN YANG DISEPAKATI:
                </p>
                <ol className="list-decimal list-inside space-y-2.5 text-[11px] text-art-text/90 leading-normal pl-1">
                  {PRESET_RULES.filter((r) => selectedRules.includes(r.id)).map((rule) => (
                    <li key={rule.id} className="alignment-hanging">
                      <span className="font-sans font-medium">{rule.text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Footer Closure */}
              <p className="text-[11px] text-art-muted italic leading-relaxed max-w-sm mx-auto mb-8">
                "Demikian perjanjian ini dibuat dengan penuh takzim. Bila ada perselisihan di kemudian hari, diselesaikan secara musyawarah mufakat, pelukan erat, atau traktir makan malam."
              </p>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-center pt-2 relative mt-4">
                {/* Meterai / Stamp */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-4 scale-75 w-16 h-16 bg-art-primary text-white flex flex-col items-center justify-center shadow-md transform rotate-6 select-none pointer-events-none font-sans rounded-full">
                  <span className="text-[7px] font-bold tracking-wider leading-none">METERAI</span>
                  <span className="text-[9px] font-extrabold leading-none my-0.5">CINTA</span>
                  <span className="text-[7px] leading-none">100000%</span>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-sans font-semibold text-art-muted uppercase">Pihak Pertama,</p>
                  <div className="h-10 flex items-end justify-center select-none">
                    <p className="font-serif italic text-art-primary text-lg md:text-xl font-bold tracking-wider opacity-95">
                      {pihak1}
                    </p>
                  </div>
                  <div className="h-px bg-art-primary/25 w-4/5 mx-auto" />
                  <p className="text-[10px] text-art-text font-bold">{pihak1}</p>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-sans font-semibold text-art-muted uppercase">Pihak Kedua,</p>
                  <div className="h-10 flex items-end justify-center select-none">
                    <p className="font-serif italic text-art-primary text-lg md:text-xl font-bold tracking-wider opacity-95">
                      {pihak2}
                    </p>
                  </div>
                  <div className="h-px bg-art-primary/25 w-4/5 mx-auto" />
                  <p className="text-[10px] text-art-text font-bold">{pihak2}</p>
                </div>
              </div>
            </div>

            {/* Certificate Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleReset}
                className="bg-white hover:bg-art-bg border border-art-border text-art-primary font-bold text-xs py-3 px-6 rounded-[24px] transition-all focus:outline-none cursor-pointer flex items-center gap-2"
              >
                Buat Perjanjian Baru 📜
              </button>
              <button
                onClick={() => window.print()}
                className="bg-art-primary hover:opacity-95 text-white font-bold text-xs py-3 px-6 rounded-[24px] transition-all shadow-sm focus:outline-none cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Cetak / Simpan PDF (Kirim Doi)</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
