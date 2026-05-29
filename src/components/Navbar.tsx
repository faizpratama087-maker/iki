import React, { useState } from 'react';
import { Video, Menu, X, HelpCircle, Flame, Sparkles } from 'lucide-react';
import { ViewType } from '../types';

interface NavbarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

export default function Navbar({ currentView, setView }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home' as ViewType, label: 'Home Studio', icon: Flame },
    { id: 'tools' as ViewType, label: 'Editing Room', icon: Sparkles },
    { id: 'faq' as ViewType, label: 'FAQ Support', icon: HelpCircle },
  ];

  const handleNav = (view: ViewType) => {
    setView(view);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-blue-950 bg-black/80 backdrop-blur-md" id="main-nav">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div 
            className="flex cursor-pointer items-center space-x-2.5 transition duration-200 hover:opacity-90"
            onClick={() => handleNav('home')}
            id="brand-logo"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20">
              <Video className="h-5 w-5 text-white animate-pulse" />
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-400 opacity-30 blur-sm -z-10" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-lg font-bold tracking-tight text-transparent">
                HD CLIPPER
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-widest text-blue-400 font-mono font-medium leading-none">
                No-Watermark Engine
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1" id="desktop-links">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-950/40 text-blue-400 border border-blue-800/60 shadow-inner'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900/40'
                  }`}
                >
                  <IconComp className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => handleNav('tools')}
              id="cta-start-clipping"
              className="ml-4 flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4.5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition duration-300 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Clip Video Now</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden" id="mobile-menu-trigger">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-900 hover:text-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-blue-950/60 bg-black" id="mobile-dropdown">
          <div className="space-y-1.5 px-3 pb-4 pt-3">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium transition duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-950/50 to-black text-blue-400 border-l-4 border-blue-500'
                      : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  <IconComp className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => handleNav('tools')}
              id="mobile-nav-cta"
              className="mt-4 flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/20"
            >
              <Sparkles className="h-5 w-5" />
              <span>Trim Free HD Clip</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
