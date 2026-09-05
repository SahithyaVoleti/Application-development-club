'use client';
import React, { useState } from 'react';
import {
  Lightbulb,
  Users,
  Zap,
  Code2,
  Rocket,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const PROCESS_STEPS = [
  {
    num: '01',
    emoji: '💡',
    title: '01 — IDEATE',
    shortTitle: 'IDEATE',
    desc: 'Students identify real-world problems and come up with innovative, impactful ideas across campus and industry domains.',
    icon: Lightbulb,
    color: 'from-amber-500 to-orange-500',
    deliverables: ['Problem Identification', 'Ideathon Submissions', 'Concept Wireframes'],
    tag: 'Stage 1 · Ideation',
  },
  {
    num: '02',
    emoji: '🤝',
    title: '02 — COLLABORATE',
    shortTitle: 'COLLABORATE',
    desc: 'Students form cross-functional teams, share technical skills, assign roles, and work together seamlessly.',
    icon: Users,
    color: 'from-indigo-600 to-blue-600',
    deliverables: ['Team Formation', 'Skill Alignment', 'Peer Mentorship'],
    tag: 'Stage 2 · Teamwork',
  },
  {
    num: '03',
    emoji: '⚡',
    title: '03 — HACK',
    shortTitle: 'HACK',
    desc: 'Students participate in intensive hackathons, sprint challenges, and innovation competitions.',
    icon: Zap,
    color: 'from-sky-500 to-cyan-600',
    deliverables: ['24h/48h Hackathons', 'Rapid Prototyping', 'Live Coding Sprints'],
    tag: 'Stage 3 · Hackathons',
  },
  {
    num: '04',
    emoji: '💻',
    title: '04 — BUILD',
    shortTitle: 'BUILD',
    desc: 'Teams develop functional prototypes, write clean production code, and engineer real applications.',
    icon: Code2,
    color: 'from-purple-600 to-pink-600',
    deliverables: ['Full Stack Web Apps', 'Mobile & AI Solutions', 'Automated Testing'],
    tag: 'Stage 4 · Engineering',
  },
  {
    num: '05',
    emoji: '🚀',
    title: '05 — DEPLOY',
    shortTitle: 'DEPLOY',
    desc: 'Selected projects are deployed to production servers and transformed into usable, live applications.',
    icon: Rocket,
    color: 'from-emerald-500 to-teal-600',
    deliverables: ['Cloud Deployment', 'Live Campus Usage', 'Production Telemetry'],
    tag: 'Stage 5 · Deployment',
  },
  {
    num: '06',
    emoji: '🏆',
    title: '06 — SHOWCASE',
    shortTitle: 'SHOWCASE',
    desc: 'Students present their work to industry leaders, receive recognition, earn certificates, and unlock career opportunities.',
    icon: Trophy,
    color: 'from-yellow-500 to-amber-600',
    deliverables: ['Demo Day Presentations', 'Certificates & Awards', 'Industry Mentorship'],
    tag: 'Stage 6 · Recognition',
  },
];

export default function DevelopmentProcessSection() {
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const currentStep = PROCESS_STEPS[activeStepIdx];
  const CurrentIcon = currentStep.icon;

  return (
    <section id="process" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 filter blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-400/20 rounded-full px-4 py-1.5 mb-4">
            <Sparkles size={14} className="text-sky-400" />
            <span className="text-sky-300 text-xs font-mono font-bold uppercase tracking-widest">
              HOW OUR COLLEGE BUILDS INNOVATORS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Where Student Ideas Become Real Applications
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Our structured 6-step innovation journey empowers every student to move from ideation to hackathons, building, deployment, and industry showcase.
          </p>
        </div>

        {/* Interactive 6-Stage Timeline Flow Bar */}
        <div className="mb-12 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/80 p-3 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {PROCESS_STEPS.map((step, idx) => {
              const isSelected = activeStepIdx === idx;
              return (
                <button
                  key={`flow-btn-${step.shortTitle}`}
                  onClick={() => setActiveStepIdx(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600/40 to-indigo-600/40 border-blue-400 text-white shadow-lg ring-1 ring-blue-400/40 scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg leading-none">{step.emoji}</span>
                    <div>
                      <span className="text-[10px] font-mono font-bold block text-slate-500">
                        0{idx + 1}
                      </span>
                      <span className={`text-xs font-extrabold ${isSelected ? 'text-blue-300' : 'text-slate-300'}`}>
                        {step.shortTitle}
                      </span>
                    </div>
                  </div>
                  {idx < PROCESS_STEPS.length - 1 && (
                    <ChevronRight size={14} className="hidden lg:block text-slate-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Active Stage Spotlight Card */}
        <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 p-8 lg:p-10 shadow-2xl mb-12 relative overflow-hidden transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Active Stage Info */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-blue-500/20 text-sky-300 text-xs font-mono font-bold border border-blue-400/30">
                  {currentStep.tag}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  Step {activeStepIdx + 1} of 6
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight flex items-center gap-3">
                <span>{currentStep.emoji}</span>
                <span>{currentStep.title}</span>
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                {currentStep.desc}
              </p>

              {/* Deliverables List */}
              <div className="pt-4 border-t border-slate-700/60">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">
                  STAGE HIGHLIGHTS & OUTCOMES
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentStep.deliverables.map((item, idx) => (
                    <div key={`deliv-${idx}`} className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Stage Icon Banner */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <div className={`w-32 h-32 rounded-3xl bg-gradient-to-tr ${currentStep.color} text-white flex flex-col items-center justify-center shadow-2xl mb-4 transition-transform duration-300 hover:scale-105`}>
                <span className="text-3xl mb-1">{currentStep.emoji}</span>
                <CurrentIcon size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* 6 Timeline Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROCESS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStepIdx === idx;
            return (
              <div
                key={`proc-card-${step.num}`}
                onClick={() => setActiveStepIdx(idx)}
                className={`group p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-blue-400 shadow-xl ring-1 ring-blue-400/50 -translate-y-1'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600 hover:-translate-y-1'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl leading-none">{step.emoji}</span>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110`}>
                      <Icon size={20} />
                    </div>
                  </div>

                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">
                    STEP {step.num}
                  </div>

                  <h4 className={`text-lg font-bold mb-2 leading-snug transition-colors ${isSelected ? 'text-sky-300' : 'text-white'}`}>
                    {step.shortTitle}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-700/60 mt-5 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-sky-300">
                  <span>Explore Step {idx + 1}</span>
                  <ArrowRight size={14} className={`transition-transform ${isSelected ? 'translate-x-1 text-sky-400' : 'group-hover:translate-x-1'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
