/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, Plus, Check, Trash2, Gift, Sparkles } from 'lucide-react';
import { Coupon } from '../types';

const INITIAL_COUPONS: Coupon[] = [
  { id: 'c1', title: 'Voucher Seblak Pedas', description: 'Ditraktir porsi Seblak lengkap pakai sosis dan ceker tanpa syarat.', emoji: '🍲', isUsed: false, costDescription: 'Bayar pakai: 3 kali cubitan pipi gemas' },
  { id: 'c2', title: 'Voucher Pijat Bahu Manja', description: 'Pijatan rileks gratis di pundak, punggung, atau pelipis selama 30 menit penuh durasi.', emoji: '💆‍♀️', isUsed: false, costDescription: 'Bayar pakai: 1 bungkus susu hangat' },
  { id: 'c3', title: 'Voucher Bebas Ngambek / Melayang', description: 'Klaim dimaafin langsung saat berdebat kecil. Langsung baikan tanpa tersendat.', emoji: '🕊️', isUsed: false, costDescription: 'Bayar pakai: Pelukan erat 10 detik' },
  { id: 'c4', title: 'Voucher Nurut Seharian', description: 'Bebas menentukan pilihan film bioskop, tempat makan, atau destinasi motoran seharian tanpa boleh ada bantahan.', emoji: '🛵', isUsed: false, costDescription: 'Bayar pakai: Senyuman tulus tercantik' },
  { id: 'c5', title: 'Voucher Bebas Marah 1 Jam', description: 'Hak istimewa berbuat iseng, ngelucu garing, atau telat balas chat tanpa kena semprot selama 60 menit.', emoji: '⏳', isUsed: false, costDescription: 'Bayar pakai: 5 pujian berturut-turut' },
];

interface KuponManjaProps {
  onTriggerBurst: () => void;
}

export default function KuponManja({ onTriggerBurst }: KuponManjaProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Custom coupon builder states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newEmoji, setNewEmoji] = useState('🎁');
  const [newCost, setNewCost] = useState('');

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('bucin_coupons');
    if (saved) {
      try {
        setCoupons(JSON.parse(saved));
      } catch (err) {
        setCoupons(INITIAL_COUPONS);
      }
    } else {
      setCoupons(INITIAL_COUPONS);
      localStorage.setItem('bucin_coupons', JSON.stringify(INITIAL_COUPONS));
    }
  }, []);

  const saveCoupons = (updated: Coupon[]) => {
    setCoupons(updated);
    localStorage.setItem('bucin_coupons', JSON.stringify(updated));
  };

  const handleClaim = (id: string) => {
    const updated = coupons.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          isUsed: true,
          usedAt: new Date().toLocaleDateString('id-ID', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      }
      return c;
    });
    saveCoupons(updated);
    onTriggerBurst(); // Fire romantic falling hearts explosion in App!
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const created: Coupon = {
      id: `custom_${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      emoji: newEmoji,
      isUsed: false,
      costDescription: newCost.trim() ? `Bayar pakai: ${newCost.trim()}` : 'Bayar pakai: Ciuman virtual',
    };

    const updated = [...coupons, created];
    saveCoupons(updated);

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewEmoji('🎁');
    setNewCost('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = coupons.filter(c => c.id !== id);
    saveCoupons(updated);
  };

  const handleResetCoupons = () => {
    if (window.confirm('Reset semua kupon kembali ke kupon bawaan?')) {
      saveCoupons(INITIAL_COUPONS);
    }
  };

  return (
    <div className="space-y-6 text-left" id="kupon_manja">
      {/* Upper header action */}
      <div className="bg-white rounded-[40px] p-8 border border-art-border shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-art-accent-bg/50 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-art-primary flex items-center justify-center text-art-primary bg-art-bg flex-shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2 className="font-serif italic text-xl md:text-2xl text-art-primary">Kupon Manja Pasangan</h2>
              <p className="text-xs uppercase tracking-widest text-art-muted/70 mt-0.5 font-medium">Klaim kupon gratisan romantis bersama pasangan tercinta.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-art-primary hover:bg-art-primary/95 text-white rounded-[24px] py-2.5 px-5 font-semibold text-xs transition-all shadow-sm focus:outline-none flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Kupon Custom</span>
            </button>
            <button
              onClick={handleResetCoupons}
              className="bg-white hover:bg-art-bg border border-art-border text-art-primary rounded-[24px] py-2.5 px-4 font-semibold text-xs transition-all focus:outline-none cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Custom Coupon Creator Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-6"
            >
              <form onSubmit={handleCreateCoupon} className="p-6 bg-art-bg/50 border border-art-border rounded-[32px] space-y-4 text-left">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-[10px] uppercase tracking-widest text-art-muted mb-1.5 font-medium">Emoji Kupon</label>
                    <select
                      value={newEmoji}
                      onChange={(e) => setNewEmoji(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-art-border rounded-[20px] focus:border-art-primary focus:outline-none text-xs text-art-text cursor-pointer transition-colors shadow-sm"
                    >
                      <option value="🎁">🎁 Box</option>
                      <option value="❤️">❤️ Hati</option>
                      <option value="🍲">🍲 Makan</option>
                      <option value="🛵">🛵 Jalan</option>
                      <option value="☕">☕ Kopi</option>
                      <option value="🎮">🎮 Game</option>
                      <option value="🎦">🎦 Nonton</option>
                      <option value="💆‍♂️">💆‍♀️ Pijat</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-art-muted mb-1.5 font-medium">Nama Voucher</label>
                    <input
                      type="text"
                      required
                      placeholder="cth. Voucher Nemenin Main Game"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-art-border rounded-[20px] focus:border-art-primary focus:outline-none text-xs text-art-text transition-colors shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-art-muted mb-1.5 font-medium">Deskripsi & Syarat Penggunaan</label>
                  <input
                    type="text"
                    required
                    placeholder="cth. Nemenin mabar selama 2 jam tanpa mengeluh terserah main game apa."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-art-border rounded-[20px] focus:border-art-primary focus:outline-none text-xs text-art-text transition-colors shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-art-muted mb-1.5 font-medium">Harga / Imbalan Menukar (Opsional)</label>
                  <input
                    type="text"
                    placeholder="cth. Nyanyiin satu lagu kesukaan sebelum tidur"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-art-border rounded-[20px] focus:border-art-primary focus:outline-none text-xs text-art-text transition-colors shadow-sm"
                  />
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="submit"
                    className="flex-1 bg-art-primary hover:bg-art-primary/95 text-white rounded-[20px] py-2.5 px-4 font-semibold text-xs transition-colors focus:outline-none cursor-pointer"
                  >
                    Simpan Kupon
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

      {/* Coupons grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map((coupon) => (
          <motion.div
            key={coupon.id}
            layout
            className={`bg-white rounded-[32px] relative overflow-hidden border shadow-sm flex flex-col justify-between transition-all ${
              coupon.isUsed
                ? 'border-art-border opacity-60 bg-art-bg/30'
                : 'border-art-border hover:border-art-primary hover:-translate-y-0.5'
            }`}
          >
            {/* Scissor tickets border effect */}
            <div className="absolute top-1/2 -left-3 w-6 h-6 bg-art-bg rounded-full border-r border-art-border transform -translate-y-1/2 z-10" />
            <div className="absolute top-1/2 -right-3 w-6 h-6 bg-art-bg rounded-full border-l border-art-border transform -translate-y-1/2 z-10" />
            
            {/* Stamp used badge */}
            <AnimatePresence>
              {coupon.isUsed && (
                <motion.div
                  initial={{ scale: 2, opacity: 0, rotate: 12 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 m-auto w-32 h-32 flex items-center justify-center pointer-events-none z-20"
                >
                  <div className="border-4 border-double border-art-primary/35 rounded-full p-2 text-center transform -rotate-12 bg-white/80 backdrop-blur-[1px] shadow-sm">
                    <p className="text-[10px] font-extrabold text-art-primary tracking-wider uppercase font-sans leading-none">VOUCHER</p>
                    <p className="text-sm font-black text-art-primary leading-normal my-0.5">TERPAKAI</p>
                    <p className="text-[8px] font-bold text-art-muted capitalize">{coupon.usedAt}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content box upper */}
            <div className="p-6 text-left flex gap-4">
              <div className="text-4xl bg-art-bg w-14 h-14 rounded-[20px] flex items-center justify-center flex-shrink-0 border border-art-border">
                {coupon.emoji}
              </div>
              <div className="space-y-1.5 flex-1 select-none">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif italic text-sm md:text-base font-bold text-art-primary leading-tight">
                    {coupon.title}
                  </h3>
                  {coupon.id.startsWith('custom_') && (
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="text-art-muted hover:text-rose-500 transition-colors p-1.5 rounded-full hover:bg-art-bg focus:outline-none cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-art-muted leading-relaxed font-sans">{coupon.description}</p>
              </div>
            </div>

            {/* Separator dashed rule */}
            <div className="border-t border-dashed border-art-border mx-6 my-0.5" />

            {/* Redeem status footer */}
            <div className="p-4 px-6 bg-art-bg/30 flex flex-wrap items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-art-primary flex-shrink-0" />
                <span className="text-[11px] font-bold font-sans italic text-art-primary leading-tight">
                  {coupon.costDescription}
                </span>
              </div>

              {!coupon.isUsed ? (
                <button
                  onClick={() => handleClaim(coupon.id)}
                  className="bg-art-primary hover:bg-art-primary/95 text-white rounded-[20px] py-1.5 px-4 font-bold text-xs transition-colors shadow-sm focus:outline-none flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 fill-white" />
                  <span>Klaim Kupon</span>
                </button>
              ) : (
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 py-1.5 px-4 border border-emerald-100 rounded-full">
                  <Check className="w-3.5 h-3.5" />
                  <span>Selesai ditukar</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
