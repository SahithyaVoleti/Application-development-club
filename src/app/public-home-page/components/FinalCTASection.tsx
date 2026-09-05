'use client';
import React from 'react';
import { ArrowRight, Terminal, Layers } from 'lucide-react';

interface Props {
  onSwitchToWorkspace?: () => void;
}

export default function FinalCTASection({ onSwitchToWorkspace }: Props) {
  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Section 20: Sophisticated moving ambient blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-sky-500/20 rounded-full filter blur-[120px] pointer-events-none animate-pulse-glow" />

      <div className="relative max-w-screen-xl mx-auto px-6 lg:px-10 text-center">
        <div className="scroll-reveal p-10 sm:p-16 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Background Image overlay */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <img src="/images/hero-girl-bg.png" alt="Developer Background" className="w-full h-full object-cover object-center filter saturate-110" />
            <div className="absolute inset-0 bg-slate-950/70" />
          </div>

          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest block mb-4 relative z-10">
            START BUILDING TODAY
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-white max-w-3xl mx-auto leading-tight">
            Ready to Build Your Next Application?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl mx-auto font-normal">
            Bring your ideas, technologies and development workflow together in one powerful application development hub.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {onSwitchToWorkspace ? (
              <button
                onClick={onSwitchToWorkspace}
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm px-8 py-4 rounded-xl btn-hover-premium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 cursor-pointer group"
              >
                <Terminal size={18} className="text-sky-300" />
                <span>Get Started</span>
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                onClick={() => handleScrollTo('#applications')}
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm px-8 py-4 rounded-xl btn-hover-premium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 cursor-pointer group"
              >
                <span>Get Started</span>
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            )}

            <button
              onClick={() => handleScrollTo('#capabilities')}
              className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm px-7 py-4 rounded-xl btn-hover-premium hover:bg-slate-700 hover:text-white shadow-xs cursor-pointer group"
            >
              <Layers size={16} className="text-sky-400" />
              <span>Explore Platform</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
