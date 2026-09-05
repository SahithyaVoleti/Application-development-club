'use client';
import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Users,
  Code2,
  Rocket,
  Globe,
  Award,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

const PROCESS_STAGES = [
  { id: 'idea', label: '1. IDEA', icon: Lightbulb, color: 'text-amber-500 bg-amber-50 border-amber-200', desc: 'Student Problem Identification' },
  { id: 'team', label: '2. TEAM', icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', desc: 'Collaborative Group Formation' },
  { id: 'code', label: '3. CODE', icon: Code2, color: 'text-sky-600 bg-sky-50 border-sky-200', desc: 'Hackathon Rapid Prototyping' },
  { id: 'app', label: '4. APPLICATION', icon: Rocket, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', desc: 'Full Stack Build & Test' },
  { id: 'impact', label: '5. IMPACT', icon: Globe, color: 'text-purple-600 bg-purple-50 border-purple-200', desc: 'Real Deployment & Usage' },
];

export default function HeroAbstractVisual() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStageIndex(prev => (prev + 1) % PROCESS_STAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const activeStage = PROCESS_STAGES[activeStageIndex];

  return (
    <div className="relative w-full max-w-xl mx-auto h-[480px] sm:h-[520px] flex items-center justify-center select-none">
      {/* Background Soft Glows */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-sky-400/15 to-indigo-500/10 rounded-3xl filter blur-3xl animate-pulse-glow pointer-events-none" />



      {/* Main Interactive Stage Card */}
      <div className="relative z-20 w-full bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-2xl shadow-slate-900/10 p-6 flex flex-col justify-between h-[420px]">
        
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-600 ml-2">
              innovation.pipeline.v2
            </span>
          </div>

          <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-emerald-700 text-[10px] font-extrabold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Flow Active
          </div>
        </div>

        {/* Process Stage Stepper Bar */}
        <div className="grid grid-cols-5 gap-1 my-2">
          {PROCESS_STAGES.map((stg, idx) => (
            <button
              key={`stg-btn-${stg.id}`}
              onClick={() => setActiveStageIndex(idx)}
              className={`py-2 px-1 rounded-xl text-[10px] font-extrabold transition-all border flex flex-col items-center gap-1 ${
                activeStageIndex === idx
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <stg.icon size={14} className={activeStageIndex === idx ? 'text-sky-400' : 'text-slate-400'} />
              <span className="hidden sm:inline">{stg.id.toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Active Stage Display Panel */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex-1 flex flex-col justify-between relative overflow-hidden my-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <activeStage.icon size={20} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-sky-400 font-extrabold uppercase tracking-wider block">
                  Stage {activeStageIndex + 1} of 5
                </span>
                <h4 className="text-base font-extrabold text-white">
                  {activeStage.label}
                </h4>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-white/10 text-slate-300 border border-white/15">
              {activeStage.desc}
            </span>
          </div>

          {/* Interactive Visual Animation inside active stage */}
          <div className="my-3 bg-[#0b1329] p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[10px] border-b border-slate-800 pb-1">
              <span>stage_executor.ts</span>
              <span className="text-emerald-400">● Executing</span>
            </div>
            {activeStageIndex === 0 && (
              <p className="text-amber-300">💡 Problem Identified: Student event discovery platform proposal</p>
            )}
            {activeStageIndex === 1 && (
              <p className="text-indigo-300">🤝 Team Assembled: Alex (Frontend), Priya (AI/ML), Rahul (Backend)</p>
            )}
            {activeStageIndex === 2 && (
              <p className="text-sky-300">⚡ Hackathon Coding: 24h sprint building API & React frontend</p>
            )}
            {activeStageIndex === 3 && (
              <p className="text-emerald-300">🚀 Build Complete: Dockerized container test passed 100%</p>
            )}
            {activeStageIndex === 4 && (
              <p className="text-purple-300">🌍 Live Impact: 1,200+ campus students actively using application</p>
            )}
          </div>

          {/* Connective Process Arrow Indicator */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 size={13} /> Stage Verified
            </span>
            <span className="flex items-center gap-1 text-sky-400 font-bold">
              Next Stage <ArrowRight size={12} />
            </span>
          </div>
        </div>

        {/* Footer Pipeline Summary Bar */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-sky-600" /> College Innovation Pipeline
          </span>
          <span className="font-mono text-[10px] font-bold text-slate-400">
            Idea → Impact Flow
          </span>
        </div>

      </div>
    </div>
  );
}
