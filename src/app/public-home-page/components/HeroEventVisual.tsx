'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Code, Sparkles, Terminal, Cpu, Users } from 'lucide-react';

export default function HeroEventVisual() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleScrollToUpcoming = () => {
    const el = document.querySelector('#upcoming-events');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="relative w-full max-w-lg mx-auto lg:max-w-none h-[420px] sm:h-[460px] flex items-center justify-center select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Soft Glow & Grid Pattern */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/15 via-blue-500/10 to-indigo-500/10 rounded-3xl filter blur-2xl animate-pulse-glow" />

      <div
        className="absolute w-72 h-72 rounded-full bg-sky-200/40 filter blur-3xl -top-10 -right-10 pointer-events-none"
        style={{
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      />

      <div
        className="absolute w-64 h-64 rounded-full bg-blue-300/30 filter blur-3xl -bottom-10 -left-10 pointer-events-none"
        style={{
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      />

      {/* Decorative Dot Matrix Grid */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Floating Card 1 (Top Left Background Card) */}
      <div
        className="absolute top-4 left-2 sm:left-6 w-52 sm:w-60 bg-white/90 backdrop-blur-md rounded-2xl border border-sky-200/80 p-3.5 shadow-xl shadow-sky-950/5 animate-float-reverse pointer-events-auto transition-transform duration-300 hover:scale-105 hover:z-30 cursor-pointer"
        style={{
          transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px) rotate(-3deg)`,
        }}
        onClick={handleScrollToUpcoming}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
            <Code size={14} />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 block">WORKSHOP</span>
            <h4 className="text-xs font-bold text-stone-800 leading-tight">Full Stack Development</h4>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium pt-1 border-t border-stone-100">
          <span>Hands-on React & Node</span>
          <span className="text-sky-600 font-semibold">150+ seats</span>
        </div>
      </div>

      {/* Floating Card 2 (Bottom Right Background Card) */}
      <div
        className="absolute bottom-6 right-2 sm:right-6 w-56 sm:w-64 bg-white/90 backdrop-blur-md rounded-2xl border border-blue-200/80 p-3.5 shadow-xl shadow-sky-950/5 animate-float-slow pointer-events-auto transition-transform duration-300 hover:scale-105 hover:z-30 cursor-pointer"
        style={{
          transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px) rotate(2deg)`,
        }}
        onClick={handleScrollToUpcoming}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <Terminal size={14} />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 block">CODING CONTEST</span>
            <h4 className="text-xs font-bold text-stone-800 leading-tight">Competitive Programming</h4>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium pt-1 border-t border-stone-100">
          <span>DSA & Algorithmic Storm</span>
          <span className="text-emerald-600 font-semibold">Live Now</span>
        </div>
      </div>

      {/* Main Center Featured Event Card */}
      <div
        className="relative z-20 w-[310px] sm:w-[360px] bg-white/95 backdrop-blur-xl rounded-3xl border border-sky-300/80 p-6 shadow-2xl shadow-sky-500/15 transition-all duration-300 hover:shadow-sky-500/25 hover:border-sky-400 cursor-pointer"
        style={{
          transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`,
        }}
        onClick={handleScrollToUpcoming}
      >
        {/* Card Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-400/30">
            <Sparkles size={12} className="text-sky-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-[11px] font-extrabold text-sky-700 tracking-wider uppercase">FEATURED EVENT</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            OPEN
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-xl font-extrabold text-stone-900 leading-snug tracking-tight mb-2">
          AI Smart Campus Hackathon
        </h3>
        <p className="text-xs text-stone-500 leading-relaxed mb-4">
          Build. Innovate. Compete. Develop AI-driven agentic applications for smart campus functionality.
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 mb-5 p-3 rounded-xl bg-sky-50/70 border border-sky-100">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-sky-600 flex-shrink-0" />
            <div>
              <div className="text-[10px] text-stone-400 font-bold uppercase">DATE</div>
              <div className="text-xs font-bold text-stone-800">14-15 MAR 2026</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-blue-600 flex-shrink-0" />
            <div>
              <div className="text-[10px] text-stone-400 font-bold uppercase">ELIGIBILITY</div>
              <div className="text-xs font-bold text-stone-800">CSE III Year</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleScrollToUpcoming}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-sky-400/30 hover:shadow-sky-500/50 hover:from-sky-400 hover:to-blue-500 group"
        >
          <span>Register Now</span>
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Floating Badge (Top Right) */}
      <div
        className="absolute top-12 right-0 sm:right-4 z-30 bg-slate-900 text-white px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg flex items-center gap-1.5 border border-slate-700 animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <Cpu size={12} className="text-cyan-400" />
        <span>Vignan CSE Hub</span>
      </div>
    </div>
  );
}
