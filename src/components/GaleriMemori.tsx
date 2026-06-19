/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Plus, Heart, Award, Trash2, Milestone, ChevronDown, Check } from 'lucide-react';
import { LoveMilestone } from '../types';

const INITIAL_MILESTONES: LoveMilestone[] = [
  { id: 'm1', title: 'Pertama Kali Ngobrol / Kenalan', date: '2025-01-14', description: 'Momen berkesan di mana kita pertama kali ngobrol serius, bertukar id sosmed, dan merasa klik satu sama lain.', category: 'lainnya', loveRating: 4 },
  { id: 'm2', title: 'Kencan Pertama Kita (First Date)', date: '2025-02-14', description: 'Jalan bareng berdua ke kafe kopi susu lucu. Masih malu-malu kucing, canggung tapi senyum-senyum sendiri seharian.', category: 'kencan', loveRating: 5 },
  { id: 'm3', title: 'Resmi Berpacaran (Hari Jadian)', date: '2025-03-24', description: 'Detik-detik komitmen bulat untuk saling menyayangi, menjaga batin, dan bersama merajut masa depan indah.', category: 'jadian', loveRating: 5 },
  { id: 'm4', title: 'Kena Hujan Pas Naik Motor / Jalan Malam', date: '2025-05-10', description: 'Kehujanan bareng pas berteduh di teras ruko kosong, kedinginan tapi ketawa-tawa bahagia karena ada pelukan hangat.', category: 'lainnya', loveRating: 5 },
];

export default function GaleriMemori() {
  const [milestones, setMilestones] = useState<LoveMilestone[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New Milestone Form States
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<'kencan' | 'jadian' | 'pencapaian' | 'lainnya'>('kencan');
  const [hearts, setHearts] = useState(5);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('bucin_milestones');
    if (saved) {
      try {
        setMilestones(JSON.parse(saved));
      } catch (err) {
        setMilestones(INITIAL_MILESTONES);
      }
    } else {
      setMilestones(INITIAL_MILESTONES);
      localStorage.setItem('bucin_milestones', JSON.stringify(INITIAL_MILESTONES));
    }
  }, []);

  const saveMilestones = (updated: LoveMilestone[]) => {
    // Sort milestones by date chronologically
    const sorted = [...updated].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setMilestones(sorted);
    localStorage.setItem('bucin_milestones', JSON.stringify(sorted));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !desc.trim()) return;

    const created: LoveMilestone = {
      id: `milestone_${Date.now()}`,
      title: title.trim(),
      date,
      description: desc.trim(),
      category,
      loveRating: hearts
    };

    saveMilestones([...milestones, created]);
    
    // Reset Form
    setTitle('');
    setDate('');
    setDesc('');
    setCategory('kencan');
    setHearts(5);
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = milestones.filter(m => m.id !== id);
    saveMilestones(updated);
  };

  const handleReset = () => {
    if (window.confirm('Ingin mereset milestonemu kembali ke data bawaan?')) {
      saveMilestones(INITIAL_MILESTONES);
    }
  };

  return (
    <div className="space-y-6 text-left" id="galeri_memori">
      <div className="bg-white rounded-[40px] p-8 border border-art-border shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-art-accent-bg/50 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-art-primary flex items-center justify-center text-art-primary bg-art-bg flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2 className="font-serif italic text-xl md:text-2xl text-art-primary">Timeline Kenangan Indah</h2>
              <p className="text-xs uppercase tracking-widest text-art-muted/70 mt-0.5">Log kronologi pencapaian, kencan manis, dan memori tak terlupakan berdua.</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-art-primary hover:bg-art-primary/95 text-white rounded-[24px] py-2.5 px-5 font-semibold text-xs transition-all focus:outline-none flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan Memori Baru</span>
            </button>
            <button
              onClick={handleReset}
              className="bg-white hover:bg-art-bg border border-art-border text-art-primary rounded-[24px] py-2.5 px-4 font-semibold text-xs transition-all focus:outline-none cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Milestone Creator Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-6"
            >
              <form onSubmit={handleCreate} className="p-6 bg-art-bg/50 border border-art-border rounded-[32px] space-y-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-art-muted mb-1.5 font-medium">Judul Kenangan</label>
                    <input
                      type="text"
                      required
                      placeholder="cth. Gantungan Kunci Kado Pertama"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-art-border rounded-[20px] focus:border-art-primary focus:outline-none text-xs text-art-text transition-colors shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-art-muted mb-1.5 font-medium">Tanggal Memori</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-art-border rounded-[20px] focus:border-art-primary focus:outline-none text-xs text-art-text transition-colors shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-art-muted mb-1.5 font-medium">Kategori</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-4 py-3 bg-white border border-art-border rounded-[20px] focus:border-art-primary focus:outline-none text-xs text-art-text transition-colors shadow-sm cursor-pointer"
                    >
                      <option value="kencan">🛵 Kencan Jalan-jalan</option>
                      <option value="jadian">❤️ Hari Jadian / Komitmen</option>
                      <option value="pencapaian">🏆 Pencapaian Bersama</option>
                      <option value="lainnya">✨ Kenangan Unik Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-art-muted mb-1.5 font-medium">Tingkat Kemesraan ({hearts}/5 Hati)</label>
                    <div className="flex gap-2 py-0.5">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setHearts(num)}
                          className="focus:outline-none cursor-pointer p-0.5 transition-transform hover:scale-110"
                        >
                          <Heart
                            className={`w-6 h-6 transition-all ${
                              num <= hearts ? 'fill-art-primary text-art-primary' : 'text-art-border hover:text-art-primary/60'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-art-muted mb-1.5 font-medium">Uraian / Cerita Kenangan Singkat</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Uraikan betapa manis atau konyolnya momen saat itu..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-art-border rounded-[20px] focus:border-art-primary focus:outline-none text-xs text-art-text transition-colors shadow-sm"
                  />
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="submit"
                    className="flex-1 bg-art-primary hover:bg-art-primary/95 text-white rounded-[20px] py-2.5 px-4 font-semibold text-xs transition-colors focus:outline-none cursor-pointer"
                  >
                    Simpan Kenangan Indah
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-white hover:bg-art-bg border border-art-border text-art-muted rounded-[20px] py-2.5 px-4 font-semibold text-xs focus:outline-none cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timeline rendering tree */}
      <div className="relative border-l border-art-border ml-4 md:ml-6 py-4 space-y-10 text-left">
        {milestones.length === 0 ? (
          <div className="pl-6 text-art-muted italic text-sm">
            Belum ada memori yang dicatat. Klik "Simpan Memori Baru" di atas untuk melengkapi sejarah asmaramu!
          </div>
        ) : (
          milestones.map((m, idx) => {
            const dateObj = new Date(m.date);
            const opt: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
            const prettyDate = dateObj.toLocaleDateString('id-ID', opt);

            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-8 md:pl-10"
              >
                {/* Timeline Dot Marker */}
                <span className="absolute -left-[13px] top-1.5 w-6 h-6 rounded-full border border-art-border bg-art-primary shadow-sm flex items-center justify-center z-10 text-white">
                  <span className="text-[9px] font-bold">♥</span>
                </span>

                {/* Polaroid-inspired memory post */}
                <div className="bg-white rounded-[32px] p-6 border border-art-border shadow-sm hover:shadow-md transition-shadow relative max-w-2xl group">
                  {/* Category Pill Tag */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    {m.category === 'jadian' && (
                      <span className="bg-art-accent-bg text-art-primary font-sans font-bold text-[9px] py-1 px-2.5 rounded-full uppercase leading-none border border-art-primary/10">
                        👑 Jadian
                      </span>
                    )}
                    {m.category === 'kencan' && (
                      <span className="bg-art-bg text-art-text font-sans font-bold text-[9px] py-1 px-2.5 rounded-full uppercase leading-none border border-art-border">
                        🛵 Kencan
                      </span>
                    )}
                    {m.category === 'pencapaian' && (
                      <span className="bg-[#e0f2fe] text-[#0369a1] font-sans font-bold text-[9px] py-1 px-2.5 rounded-full uppercase leading-none border border-[#bae6fd]">
                        🏆 Prestasi
                      </span>
                    )}
                    {m.category === 'lainnya' && (
                      <span className="bg-art-accent-bg text-art-primary font-sans font-bold text-[9px] py-1 px-2.5 rounded-full uppercase leading-none border border-art-border">
                        ✨ Unik
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="opacity-0 group-hover:opacity-100 text-art-muted hover:text-rose-500 transition-all p-1.5 rounded-full hover:bg-art-bg focus:outline-none cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Date & Title */}
                  <div className="space-y-1 text-left">
                    <p className="text-[10px] font-sans font-semibold text-art-primary flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{prettyDate}</span>
                    </p>
                    <h3 className="font-serif italic text-base md:text-lg text-art-primary tracking-tight pr-14">
                      {m.title}
                    </h3>
                  </div>

                  {/* Hearts rating rating */}
                  <div className="flex gap-0.5 my-2">
                    {Array.from({ length: m.loveRating }).map((_, i) => (
                      <Heart key={i} className="w-3.5 h-3.5 fill-art-primary text-art-primary" />
                    ))}
                  </div>

                  {/* Description content */}
                  <p className="text-xs md:text-sm text-art-text/95 leading-relaxed font-sans bg-art-bg/40 p-4 rounded-[20px] border border-art-border/50">
                    {m.description}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
