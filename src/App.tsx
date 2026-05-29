import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Tools from './components/Tools';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { ViewType } from './types';

export default function App() {
  const [currentView, setView] = useState<ViewType>('home');

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white" id="main-app-shell">
      
      {/* Dynamic Background Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#09090b_1px,transparent_1px),linear-gradient(to_bottom,#09090b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div>
        {/* Navigation Bar */}
        <Navbar currentView={currentView} setView={setView} />

        {/* Dynamic Route Content Panel */}
        <main className="transition-all duration-300" id="route-contents">
          {currentView === 'home' && <Hero setView={setView} />}
          {currentView === 'tools' && <Tools />}
          {currentView === 'faq' && <FAQ />}
        </main>
      </div>

      {/* Structured Footer */}
      <Footer setView={setView} />
    </div>
  );
}
