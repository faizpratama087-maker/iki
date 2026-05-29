import React from 'react';
import { Film, Zap, Shield, Heart } from 'lucide-react';
import { ViewType } from '../types';

interface FooterProps {
  setView: (view: ViewType) => void;
}

export default function Footer({ setView }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-blue-950/60 bg-black py-12 text-gray-400" id="main-footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-white text-sm">
                HD
              </div>
              <span className="text-sm font-black tracking-tight text-white uppercase font-sans">
                HD Video Clipper
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Automatic high-definition, watermark-free video trimming engine running on static ffmpeg cores.
            </p>
          </div>

          {/* Slices Links */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#7c9aff] font-mono">
              Quick Links
            </span>
            <ul className="mt-3.5 space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => setView('home')} 
                  className="hover:text-white transition duration-200"
                  id="footer-lnk-home"
                >
                  Landing Page
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setView('tools')} 
                  className="hover:text-white transition duration-200"
                  id="footer-lnk-tools"
                >
                  Editing Room
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setView('faq')} 
                  className="hover:text-white transition duration-200"
                  id="footer-lnk-faq"
                >
                  FAQ Helpdesk
                </button>
              </li>
            </ul>
          </div>

          {/* Capabilities */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#7c9aff] font-mono">
              Render Capabilities
            </span>
            <ul className="mt-3.5 space-y-2 text-xs text-gray-500">
              <li>1-Pass H.264 Lossless Bitrates</li>
              <li>Dynamic Quality: 720p / 1080p</li>
              <li>MP4, WebM & MKV Containers</li>
              <li>Dual audio channel volume decibels</li>
            </ul>
          </div>

          {/* Slogan Statement */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#7c9aff] font-mono">
              Slogan Guarantee
            </span>
            <p className="mt-3.5 text-xs text-gray-500 leading-relaxed italic">
              “Free video clipping, fast processing, and HD quality without paying!”
            </p>
            <div className="mt-4 flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider text-blue-400">
              <Zap className="h-3 w-3 inline text-blue-500" />
              <span>Ultrafast Processing Node</span>
            </div>
          </div>

        </div>

        {/* Copy Line */}
        <div className="mt-12 border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <div>
            &copy; {currentYear} HD Clipper Studio. All rights reserved. Built for creators.
          </div>
          <div className="flex items-center gap-1">
            <span>Made securely with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>&</span>
            <span className="text-gray-400">FFmpeg static cores</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
