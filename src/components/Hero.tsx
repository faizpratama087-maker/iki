import React, { useEffect, useState } from 'react';
import { Sparkles, Zap, ShieldAlert, Award, ArrowRight, Activity, CloudLightning, HardDrive } from 'lucide-react';
import { ViewType, VideoStats } from '../types';

interface HeroProps {
  setView: (view: ViewType) => void;
}

export default function Hero({ setView }: HeroProps) {
  const [stats, setStats] = useState<VideoStats>({
    totalProcessedCount: 428,
    totalSavedStorageGB: 14.59,
    averageProcessingTimeSec: 4.8
  });

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.totalProcessedCount === 'number') {
          setStats(data);
        }
      })
      .catch((err) => console.log('Stats fetch error:', err));
  }, []);

  return (
    <div className="relative overflow-hidden bg-black py-12 md:py-24" id="hero-section">
      {/* Background Glowing/Gradient Effects */}
      <div className="absolute top-1/4 left-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-12 right-10 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-5 left-10 h-[250px] w-[250px] rounded-full bg-blue-800/10 blur-[80px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-blue-900/60 bg-blue-950/30 px-3.5 py-1 text-xs font-medium text-blue-400 backdrop-blur-sm animate-bounce">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Fast, Free, & High Definition</span>
          </div>

          {/* Slogan & Heading */}
          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            <span className="block text-gray-200">Cut Your Videos In</span>
            <span className="mt-2 block bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 bg-clip-text text-transparent">
              True HD Quality
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-gray-400 sm:text-lg md:text-xl lg:max-w-3xl">
            “Free video clipping, fast processing, and HD quality without paying!”
          </p>
          <p className="mx-auto mt-2 max-w-xl text-xs text-blue-400 font-mono tracking-widest uppercase">
            ⚡ CLIP IN SECONDS • NO WATERMARK • NO LOGIN REQUIRED
          </p>

          {/* Large Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setView('tools')}
              id="hero-cta-main"
              className="group flex w-full sm:w-auto items-center justify-center space-x-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4.5 text-lg font-bold text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-[1.03] hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40 active:scale-100"
            >
              <span>Launch Editing Room</span>
              <ArrowRight className="h-5 w-5 transition duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => {
                const faqSec = document.getElementById('faq-section');
                if (faqSec) {
                  faqSec.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setView('faq');
                }
              }}
              id="hero-cta-secondary"
              className="flex w-full sm:w-auto items-center justify-center space-x-2 rounded-xl border border-gray-800 bg-gray-950/50 px-8 py-4.5 text-lg font-semibold text-gray-300 transition duration-200 hover:bg-gray-900 hover:text-white"
            >
              <span>How It Works</span>
            </button>
          </div>
        </div>

        {/* Real-time Statistics Section */}
        <div className="mt-20 border-y border-blue-950/60 bg-blue-950/10 py-10 backdrop-blur-sm" id="stats-dashboard">
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            <div className="relative px-4" id="stat-processed">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-950/50 border border-blue-900/40">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <p className="mt-4 text-3xl font-black font-mono tracking-tight text-white sm:text-4xl">
                {stats.totalProcessedCount.toLocaleString()}+
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-blue-400 font-mono">
                Total Processed Clips
              </p>
            </div>

            <div className="relative px-4 border-t border-blue-950/40 sm:border-t-0 sm:border-x sm:border-blue-950/40" id="stat-storage">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-950/50 border border-blue-900/40">
                <HardDrive className="h-5 w-5 text-blue-400" />
              </div>
              <p className="mt-4 text-3xl font-black font-mono tracking-tight text-white sm:text-4xl">
                {stats.totalSavedStorageGB.toFixed(2)} GB
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-blue-400 font-mono">
                Total Rendered Storage
              </p>
            </div>

            <div className="relative px-4 border-t border-blue-950/40 sm:border-t-0" id="stat-speed">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-950/50 border border-blue-900/40">
                <CloudLightning className="h-5 w-5 text-blue-400" />
              </div>
              <p className="mt-4 text-3xl font-black font-mono tracking-tight text-white sm:text-4xl">
                &lt; {stats.averageProcessingTimeSec.toFixed(1)}s
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-blue-400 font-mono">
                Average Export Speed
              </p>
            </div>
          </div>
        </div>

        {/* Features Bento/Grid layout */}
        <div className="mt-24" id="landing-features">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3.5xl">
              Engineered for absolute editing perfection.
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              No compromises on video compression, limits, or security.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-2xl border border-blue-950/40 bg-zinc-950/60 p-6 transition duration-300 hover:border-blue-800 hover:bg-zinc-950/90 hover:shadow-lg hover:shadow-blue-500/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-950/95 text-blue-400 border border-blue-900/45 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Fast Export Speed</h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                Render slices instantly using custom CPU profile optimization on high-speed hardware nodes.
              </p>
            </div>

            <div className="group rounded-2xl border border-blue-950/40 bg-zinc-950/60 p-6 transition duration-300 hover:border-blue-800 hover:bg-zinc-950/90 hover:shadow-lg hover:shadow-blue-500/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-950/95 text-blue-400 border border-blue-900/45 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Pristine 1080p HD</h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                Export files preserving maximum dynamic contrast, clean resolutions, and lossless bitrate levels.
              </p>
            </div>

            <div className="group rounded-2xl border border-blue-950/40 bg-zinc-950/60 p-6 transition duration-300 hover:border-blue-800 hover:bg-zinc-950/90 hover:shadow-lg hover:shadow-blue-500/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-950/95 text-blue-400 border border-blue-900/45 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">No Watermarks</h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                Own your brand entirely. We append zero system watermarks, credits, or hidden logo frames.
              </p>
            </div>

            <div className="group rounded-2xl border border-blue-950/40 bg-zinc-950/60 p-6 transition duration-300 hover:border-blue-800 hover:bg-zinc-950/90 hover:shadow-lg hover:shadow-blue-500/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-950/95 text-blue-400 border border-blue-900/45 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <CloudLightning className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Full Privacy Safe</h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                All uploaded data lives temporarily in secure ram-drives and gets deleted automatically after processing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
