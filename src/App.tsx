/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Sparkles,
  Award,
  ShieldCheck,
  Ticket,
  CalendarDays,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Flame,
  User,
  Music,
  Share2
} from 'lucide-react';

// Components
import FallingHearts from './components/FallingHearts';
import KalkulatorCinta from './components/KalkulatorCinta';
import SuratCintaAI from './components/SuratCintaAI';
import PerjanjianBucin from './components/PerjanjianBucin';
import KuponManja from './components/KuponManja';
import KuisBucin from './components/KuisBucin';
import GaleriMemori from './components/GaleriMemori';

// Types and Tracks
import { ActiveSong } from './types';

const PLAYLIST: ActiveSong[] = [
  { id: 'track_1', title: 'Sempurna', artist: 'Acoustic Lofi Cover', duration: '03:14' },
  { id: 'track_2', title: 'Untungnya, Bumiku Masih Berputar', artist: 'Sore Melodies', duration: '02:45' },
  { id: 'track_3', title: 'Gombalan Singkat di Ujung Senja', artist: 'Hujan Akustik', duration: '03:20' },
  { id: 'track_4', title: 'Melodi Kasih Sayang', artist: 'Lofi Romantic Piano', duration: '03:56' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'ai_letter' | 'agreement' | 'coupons' | 'quiz' | 'memories'>('calculator');
  const [particleType, setParticleType] = useState<'heart' | 'rose' | 'star' | 'chocolate' | 'off'>('heart');
  const [burstTrigger, setBurstTrigger] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Music Player States
  const [musicPlaying, setMusicPlaying] = useState(true);
  const [currentSongIdx, setCurrentSongIdx] = useState(0);
  const [songProgress, setSongProgress] = useState(25); // percentage
  const [muted, setMuted] = useState(false);
  const songIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger brief hearts/flowers burst explosion
  const triggerBurst = () => {
    setBurstTrigger(true);
    setTimeout(() => setBurstTrigger(false), 200);
  };

  // Simulate music player progress increment ticking
  useEffect(() => {
    if (musicPlaying) {
      songIntervalRef.current = setInterval(() => {
        setSongProgress((prev) => {
          if (prev >= 100) {
            // Next song automatically
            setCurrentSongIdx((idx) => (idx + 1) % PLAYLIST.length);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (songIntervalRef.current) clearInterval(songIntervalRef.current);
    }

    return () => {
      if (songIntervalRef.current) clearInterval(songIntervalRef.current);
    };
  }, [musicPlaying]);

  const handleNextSong = () => {
    setCurrentSongIdx((prev) => (prev + 1) % PLAYLIST.length);
    setSongProgress(0);
  };

  const handlePrevSong = () => {
    setCurrentSongIdx((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setSongProgress(0);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    triggerBurst();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const currentSong = PLAYLIST[currentSongIdx];

  return (
    <div className="min-h-screen bg-art-bg font-sans text-art-text relative pb-32">
      {/* Floating interactive particles */}
      {particleType !== 'off' && (
        <FallingHearts type={particleType} burst={burstTrigger} />
      )}

      {/* Main Top Header Block */}
      <header className="max-w-4xl mx-auto px-4 pt-10 pb-6 text-center select-none relative z-20">
        <div className="flex justify-center mb-4">
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border border-art-border"
          >
            <Heart className="w-8 h-8 text-art-primary fill-art-primary" />
          </motion.div>
        </div>

        <h1 className="font-serif italic text-3xl md:text-4xl font-bold text-art-primary tracking-tight">
          just <span className="font-sans not-italic font-extrabold text-art-text">frend</span> ✨
        </h1>
        <p className="text-xs md:text-sm text-art-muted mt-1.5 max-w-md mx-auto leading-relaxed">
          Satu wadah cinta digital untuk menghangatkan asmara bersama si dia. Pilih fitur romantis di bawah!
        </p>

        {/* Floating Controls Row (Share, Particles chooser) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          {/* Share Button */}
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-1.5 py-2 px-4 rounded-[20px] text-xs font-semibold shadow-sm transition-all focus:outline-none cursor-pointer border ${
              copiedLink
                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                : 'bg-white hover:bg-art-bg border-art-border text-art-primary'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Tersalin!' : 'Bagikan Web ke Doi'}</span>
          </button>

          {/* Particle Selector */}
          <div className="flex bg-white border border-art-border p-1 rounded-[24px] items-center gap-1 shadow-sm">
            <span className="text-[10px] font-bold text-art-primary pl-2.5 pr-1 uppercase tracking-wider">Efek:</span>
            {['heart', 'rose', 'star', 'off'].map((type) => (
              <button
                key={type}
                onClick={() => setParticleType(type as any)}
                className={`py-1 px-3 rounded-[20px] text-[10px] font-bold transition-all focus:outline-none capitalize cursor-pointer ${
                  particleType === type
                    ? 'bg-art-primary text-white shadow-sm'
                    : 'text-art-muted hover:bg-art-bg'
                }`}
              >
                {type === 'heart' ? '❤️ Hati' : type === 'rose' ? '🌹 Mawar' : type === 'star' ? '✨ Bintang' : 'Mati'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Primary Dashboard Container */}
      <main className="max-w-4xl mx-auto px-4 relative z-20">
        {/* Navigation grid tabs */}
        <nav className="grid grid-cols-3 md:grid-cols-6 gap-2.5 mb-8">
          <button
            onClick={() => { setActiveTab('calculator'); triggerBurst(); }}
            className={`flex flex-col items-center justify-center p-3 rounded-[24px] border transition-all cursor-pointer focus:outline-none ${
              activeTab === 'calculator'
                ? 'bg-art-primary text-white border-transparent shadow-sm'
                : 'bg-white border-art-border hover:border-art-primary hover:bg-art-bg/40 text-art-text'
            }`}
          >
            <Heart className={`w-5 h-5 mb-1.5 ${activeTab === 'calculator' ? 'fill-white' : 'text-art-primary'}`} />
            <span className="text-[10px] md:text-xs font-semibold leading-tight">Love Meter</span>
          </button>

          <button
            onClick={() => { setActiveTab('ai_letter'); triggerBurst(); }}
            className={`flex flex-col items-center justify-center p-3 rounded-[24px] border transition-all cursor-pointer focus:outline-none ${
              activeTab === 'ai_letter'
                ? 'bg-art-primary text-white border-transparent shadow-sm'
                : 'bg-white border-art-border hover:border-art-primary hover:bg-art-bg/40 text-art-text'
            }`}
          >
            <Sparkles className={`w-5 h-5 mb-1.5 ${activeTab === 'ai_letter' ? 'text-white fill-white' : 'text-art-primary'}`} />
            <span className="text-[10px] md:text-xs font-semibold leading-tight">Pujangga AI</span>
          </button>

          <button
            onClick={() => { setActiveTab('agreement'); triggerBurst(); }}
            className={`flex flex-col items-center justify-center p-3 rounded-[24px] border transition-all cursor-pointer focus:outline-none ${
              activeTab === 'agreement'
                ? 'bg-art-primary text-white border-transparent shadow-sm'
                : 'bg-white border-art-border hover:border-art-primary hover:bg-art-bg/40 text-art-text'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 mb-1.5 ${activeTab === 'agreement' ? 'text-white' : 'text-art-primary'}`} />
            <span className="text-[10px] md:text-xs font-semibold leading-tight">Prasasti Bucin</span>
          </button>

          <button
            onClick={() => { setActiveTab('coupons'); triggerBurst(); }}
            className={`flex flex-col items-center justify-center p-3 rounded-[24px] border transition-all cursor-pointer focus:outline-none ${
              activeTab === 'coupons'
                ? 'bg-art-primary text-white border-transparent shadow-sm'
                : 'bg-white border-art-border hover:border-art-primary hover:bg-art-bg/40 text-art-text'
            }`}
          >
            <Ticket className={`w-5 h-5 mb-1.5 ${activeTab === 'coupons' ? 'text-white' : 'text-art-primary'}`} />
            <span className="text-[10px] md:text-xs font-semibold leading-tight">Kupon Manja</span>
          </button>

          <button
            onClick={() => { setActiveTab('quiz'); triggerBurst(); }}
            className={`flex flex-col items-center justify-center p-3 rounded-[24px] border transition-all cursor-pointer focus:outline-none ${
              activeTab === 'quiz'
                ? 'bg-art-primary text-white border-transparent shadow-sm'
                : 'bg-white border-art-border hover:border-art-primary hover:bg-art-bg/40 text-art-text'
            }`}
          >
            <Award className={`w-5 h-5 mb-1.5 ${activeTab === 'quiz' ? 'text-white' : 'text-art-primary'}`} />
            <span className="text-[10px] md:text-xs font-semibold leading-tight">Kuis Bucin</span>
          </button>

          <button
            onClick={() => { setActiveTab('memories'); triggerBurst(); }}
            className={`flex flex-col items-center justify-center p-3 rounded-[24px] border transition-all cursor-pointer focus:outline-none ${
              activeTab === 'memories'
                ? 'bg-art-primary text-white border-transparent shadow-sm'
                : 'bg-white border-art-border hover:border-art-primary hover:bg-art-bg/40 text-art-text'
            }`}
          >
            <CalendarDays className={`w-5 h-5 mb-1.5 ${activeTab === 'memories' ? 'text-white' : 'text-art-primary'}`} />
            <span className="text-[10px] md:text-xs font-semibold leading-tight">Line Memori</span>
          </button>
        </nav>

        {/* Dynamic active view injection */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'calculator' && <KalkulatorCinta />}
              {activeTab === 'ai_letter' && <SuratCintaAI />}
              {activeTab === 'agreement' && <PerjanjianBucin />}
              {activeTab === 'coupons' && <KuponManja onTriggerBurst={triggerBurst} />}
              {activeTab === 'quiz' && <KuisBucin />}
              {activeTab === 'memories' && <GaleriMemori />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating sticky media/cozy piano player widget at the bottom right */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 max-w-xs w-72 bg-white border border-art-border rounded-[24px] shadow-sm p-3.5 z-40 relative overflow-hidden transition-all select-none">
        {/* Subtle glowing color pulse behind player */}
        <div className={`absolute top-0 right-0 w-16 h-16 bg-art-accent-bg/40 rounded-full blur-xl pointer-events-none ${musicPlaying ? 'animate-pulse' : ''}`} />
        
        <div className="flex gap-3 items-center">
          {/* Animated disk illustration */}
          <motion.div
            animate={musicPlaying ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
            className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
              musicPlaying ? 'bg-art-primary text-white' : 'bg-art-bg text-art-muted'
            }`}
          >
            <Music className="w-5 h-5" />
          </motion.div>

          <div className="flex-1 text-left min-w-0 font-sans">
            <p className="text-[10px] font-bold text-art-primary tracking-wider flex items-center gap-1 leading-none uppercase mb-1">
              {musicPlaying ? (
                <>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span>Koleksi Cinta Akustik</span>
                </>
              ) : (
                <span>Player Dipause</span>
              )}
            </p>
            <h4 className="text-xs font-bold text-art-text tracking-tight truncate leading-tight">
              {currentSong.title}
            </h4>
            <p className="text-[10px] text-art-muted truncate leading-normal">
              {currentSong.artist}
            </p>
          </div>
        </div>

        {/* Music Player Bar and Controls */}
        <div className="mt-3 space-y-2 font-mono">
          {/* Faux timeline progress bar */}
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-medium text-art-muted">
              0:{Math.floor((3.14 * (songProgress / 100)) * 60).toString().padStart(2, '0')}
            </span>
            <div className="flex-1 h-1 bg-art-bg border border-art-border rounded-full overflow-hidden relative">
              <div
                className="h-full bg-art-primary transition-all duration-300"
                style={{ width: `${songProgress}%` }}
              />
            </div>
            <span className="text-[8px] font-medium text-art-muted">
              {currentSong.duration}
            </span>
          </div>

          {/* Button actions controller */}
          <div className="flex items-center justify-between pt-0.5">
            <button
              onClick={() => setMuted(!muted)}
              className="text-art-muted hover:text-art-primary transition-colors focus:outline-none cursor-pointer"
            >
              {muted ? <VolumeX className="w-4 h-4 text-art-primary" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handlePrevSong}
                className="text-art-muted hover:text-art-primary transition-colors focus:outline-none cursor-pointer"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setMusicPlaying(!musicPlaying)}
                className="w-7 h-7 rounded-full bg-art-primary hover:bg-art-primary/95 text-white flex items-center justify-center transition-all focus:outline-none shadow-sm cursor-pointer"
              >
                {musicPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              </button>

              <button
                onClick={handleNextSong}
                className="text-art-muted hover:text-art-primary transition-colors focus:outline-none cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="w-4 h-4 flex items-center justify-center text-[10px] opacity-70">
              {musicPlaying ? '🎵' : '💤'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
