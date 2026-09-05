'use client';
import React from 'react';
import { ArrowRight, Rocket, Sparkles, ChevronRight } from 'lucide-react';

interface Props {
  onSwitchToWorkspace?: () => void;
}

export default function HeroSection({ onSwitchToWorkspace }: Props) {
  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative w-full min-h-[720px] md:h-[780px] lg:h-[840px] xl:h-[880px] flex items-center bg-slate-950 text-white overflow-hidden border-b border-slate-800">
      
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/hero-girl-bg.png"
          alt="College Innovation Platform Student Developer"
          className="w-full h-full object-cover object-right-top filter contrast-[1.08] saturate-[1.05] brightness-[0.95]"
        />
        {/* Dark Gradient Overlay for text readability on top of background image */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />
      </div>

      {/* Text Overlay directly on top of Background Image */}
      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-start text-left max-w-2xl lg:max-w-3xl py-8 sm:py-12">
            {/* Main Headline on Background */}
            <h1 className="animate-hero-fade delay-heading font-black text-white tracking-tight leading-[1.05] mb-6 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">
              Imagine Build <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300">Innovate</span>
            </h1>

            {/* Subtitle */}
            <p className="animate-hero-fade delay-desc text-slate-100 text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed mb-10 max-w-xl">
              Empowering students to turn ideas into real-world solutions through innovation, collaboration, and code.
            </p>

            {/* Action CTA Buttons */}
            <div className="animate-hero-fade delay-buttons flex flex-wrap items-center gap-5">
              <button
                onClick={() => handleScrollTo('#events')}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-base px-9 py-4.5 rounded-full shadow-2xl shadow-sky-500/30 transition-all cursor-pointer group"
              >
                <Sparkles size={18} />
                <span>Explore Events</span>
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  if (onSwitchToWorkspace) onSwitchToWorkspace();
                  else handleScrollTo('#process');
                }}
                className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base px-9 py-4.5 rounded-full backdrop-blur-md transition-all cursor-pointer group"
              >
                <Rocket size={18} className="text-sky-400" />
                <span>Start Building</span>
                <ChevronRight size={18} className="text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>

          </div>

          {/* Right column reserved for background image visibility */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6" />

        </div>
      </div>
    </section>
  );
}