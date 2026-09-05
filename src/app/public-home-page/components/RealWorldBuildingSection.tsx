'use client';
import React from 'react';
import Image from 'next/image';
import { Sparkles, Rocket } from 'lucide-react';

const PIPELINE_NODES = [
  { label: 'IDEA', desc: 'Real Problem Spotting', color: 'bg-amber-500' },
  { label: 'PROBLEM', desc: 'User Need Definition', color: 'bg-orange-500' },
  { label: 'TEAM', desc: 'Skill Match & Roles', color: 'bg-indigo-600' },
  { label: 'HACKATHON', desc: 'Sprint Challenge', color: 'bg-sky-500' },
  { label: 'PROTOTYPE', desc: 'Figma & MVP Model', color: 'bg-purple-600' },
  { label: 'DEVELOPMENT', desc: 'Full Stack Coding', color: 'bg-blue-600' },
  { label: 'TESTING', desc: 'QA & AST Analysis', color: 'bg-cyan-600' },
  { label: 'LIVE APPLICATION', desc: 'Production Release', color: 'bg-emerald-600' },
  { label: 'IMPACT', desc: 'Real World Utility', color: 'bg-emerald-700' },
];

export default function RealWorldBuildingSection() {
  return (
    <section id="real-building" className="py-16 bg-white border-b border-slate-200/60 overflow-hidden">
      <div className="w-full px-4 sm:px-8 lg:px-12 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 border border-sky-200 rounded-full px-4 py-1 text-xs font-mono font-bold uppercase tracking-widest">
            <Sparkles size={14} className="text-sky-600" /> REAL-WORLD UTILITY
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
            Don't Just Learn. Build Something Real.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed">
            Students get the opportunity to move beyond classroom assignments and build applications that solve real problems on campus and in industry.
          </p>
        </div>

        {/* Expo UI Image Showcase Banner */}
        <div className="relative w-full h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
          <Image
            src="/images/ui/student_builder_expo.jpg"
            alt="University Student App Expo Presentation"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/90 text-white text-xs font-extrabold mb-2">
                <Rocket size={14} /> Annual Student Application Showcase
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">Student App Expo & Innovation Challenge</h3>
            </div>
            <span className="text-xs font-mono font-bold text-sky-300 bg-white/10 px-4 py-2 rounded-xl border border-white/15">
              100% Student Engineered Projects
            </span>
          </div>
        </div>

        {/* SECTION: Application Development Pipeline Visual */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 space-y-6 relative overflow-hidden">
          <style>{`
            @keyframes pipelineWave {
              0%, 100% {
                transform: translateY(0px);
                border-color: #e2e8f0;
                box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
              }
              50% {
                transform: translateY(-14px);
                border-color: #38bdf8;
                box-shadow: 0 16px 28px -6px rgba(14, 165, 233, 0.28), 0 4px 10px -2px rgba(14, 165, 233, 0.15);
              }
            }
            .animate-wave-card {
              animation: pipelineWave 3s ease-in-out infinite;
            }
            .animate-wave-card:hover {
              animation-play-state: paused;
              transform: translateY(-16px) scale(1.04);
              border-color: #0284c7;
              box-shadow: 0 20px 32px -8px rgba(14, 165, 233, 0.38);
              z-index: 10;
            }
          `}</style>

          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              The Application Development Pipeline
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              From the initial spark of an idea to real-world campus impact.
            </p>
          </div>

          {/* Pipeline Horizontal Flow */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3 pt-5 pb-3">
            {PIPELINE_NODES.map((node, idx) => (
              <div
                key={`pipe-${node.label}`}
                style={{ animationDelay: `${idx * 0.25}s` }}
                className="animate-wave-card bg-white p-3.5 rounded-2xl border border-slate-200 transition-all duration-300 text-center flex flex-col justify-between group cursor-pointer relative"
              >
                <div>
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold text-[10px] flex items-center justify-center mx-auto mb-2 group-hover:bg-sky-600 transition-colors shadow-xs">
                    0{idx + 1}
                  </div>
                  <div className="font-extrabold text-slate-900 text-xs tracking-tight group-hover:text-sky-600 transition-colors">
                    {node.label}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 leading-tight mt-2 pt-2 border-t border-slate-100 font-medium">
                  {node.desc}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
