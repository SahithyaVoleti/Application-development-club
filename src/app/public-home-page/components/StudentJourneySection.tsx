'use client';
import React, { useState, useEffect } from 'react';
import { Compass, Users, Code2, Trophy, Rocket, Award, CheckCircle2, Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react';

const JOURNEY_STAGES = [
  {
    id: 'discover',
    title: 'Discover',
    icon: Compass,
    emoji: '🔍',
    tagline: 'Explore Campus Challenges & Problem Statements',
    detail: 'Students browse departmental problem statements, upcoming hackathons, tech workshops, and student community projects.',
    action: 'Browse All Events',
  },
  {
    id: 'participate',
    title: 'Participate',
    icon: Users,
    emoji: '🤝',
    tagline: 'Form Teams & Register For Hackathons',
    detail: 'Students form interdisciplinary teams, align skill sets, and register for 24h/48h hackathons and ideathons.',
    action: 'Register With Team',
  },
  {
    id: 'build',
    title: 'Build',
    icon: Code2,
    emoji: '💻',
    tagline: 'Engineer Functional Prototypes & MVPs',
    detail: 'Teams build full-stack web and mobile apps using modern tech stacks like React, Next.js, FastAPI, and Docker.',
    action: 'Access Dev Sandbox',
  },
  {
    id: 'compete',
    title: 'Compete',
    icon: Trophy,
    emoji: '⚡',
    tagline: 'Pitch To Industry & Faculty Jury',
    detail: 'Teams present live demonstrations to expert judges from top tech companies and compete for podium prizes.',
    action: 'View Hackathons',
  },
  {
    id: 'deploy',
    title: 'Deploy',
    icon: Rocket,
    emoji: '🚀',
    tagline: 'Release Production Apps For Campus Use',
    detail: 'Shortlisted student projects are deployed onto production servers to solve real campus and community problems.',
    action: 'Explore Live Apps',
  },
  {
    id: 'get-recognized',
    title: 'Get Recognized',
    icon: Award,
    emoji: '🎓',
    tagline: 'Earn Digital Certificates & Career Perks',
    detail: 'Students receive verified certificates, cash prizes, resume credentials, and direct internship opportunities.',
    action: 'Download Credentials',
  },
];

export default function StudentJourneySection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % JOURNEY_STAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const activeStage = JOURNEY_STAGES[activeIdx];
  const ActiveIcon = activeStage.icon;

  const handleManualSelect = (idx: number) => {
    setActiveIdx(idx);
    setIsAutoPlaying(false);
  };

  return (
    <section id="student-journey" className="py-20 bg-white border-b border-slate-200/60 overflow-hidden relative">
      <style>{`
        @keyframes journeyFade {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
        }
        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(3deg);
          }
        }
        @keyframes activeGlowPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
          }
          50% {
            box-shadow: 0 0 35px rgba(14, 165, 233, 0.65);
          }
        }
        .animate-journey-fade {
          animation: journeyFade 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-icon-float {
          animation: iconFloat 4s ease-in-out infinite;
        }
        .animate-active-glow {
          animation: activeGlowPulse 2.5s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            The Interactive Student Journey
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Click or hover over any stage below to explore how students evolve from problem discoverers to recognized builders.
          </p>
        </div>

        {/* Stepper Progress Bar & Navigation Bar */}
        <div className="space-y-4">
          {/* Animated Connecting Line */}
          <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 transition-all duration-500 ease-out rounded-full shadow-sm"
              style={{ width: `${((activeIdx + 1) / JOURNEY_STAGES.length) * 100}%` }}
            />
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {JOURNEY_STAGES.map((stage, idx) => {
              const isCurrent = activeIdx === idx;
              return (
                <button
                  key={`stg-nav-${stage.id}`}
                  onClick={() => handleManualSelect(idx)}
                  onMouseEnter={() => handleManualSelect(idx)}
                  className={`p-4 rounded-2xl border text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-between gap-2 relative overflow-hidden group ${
                    isCurrent
                      ? 'bg-slate-900 text-white border-sky-400 shadow-xl scale-[1.04] animate-active-glow z-10'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300 hover:scale-[1.02]'
                  }`}
                >
                  <div className={`text-2xl transition-transform duration-300 ${isCurrent ? 'scale-125' : 'group-hover:scale-110'}`}>
                    {stage.emoji}
                  </div>
                  <div>
                    <div className={`text-[10px] font-mono font-bold uppercase transition-colors ${isCurrent ? 'text-sky-400' : 'text-slate-400'}`}>
                      Step 0{idx + 1}
                    </div>
                    <div className={`text-xs font-extrabold ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                      {stage.title}
                    </div>
                  </div>

                  {/* Active Indicator bar */}
                  {isCurrent && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-400 rounded-b-2xl animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detailed Spotlight Display */}
        <div
          key={activeStage.id}
          className="animate-journey-fade bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 lg:p-10 shadow-2xl border border-indigo-500/30 flex flex-col lg:flex-row items-center justify-between gap-8 relative"
        >
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-mono font-bold">
                <span>Stage 0{activeIdx + 1} of 6</span>
              </div>

              {/* Auto Play Controls */}
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors"
                title={isAutoPlaying ? "Pause Auto-play" : "Start Auto-play"}
              >
                {isAutoPlaying ? <Pause size={12} className="text-sky-300" /> : <Play size={12} className="text-emerald-400" />}
                <span className="text-[11px] font-bold">{isAutoPlaying ? 'Auto' : 'Paused'}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleManualSelect((activeIdx - 1 + JOURNEY_STAGES.length) % JOURNEY_STAGES.length)}
                  className="p-1 rounded-full hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                  title="Previous Step"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => handleManualSelect((activeIdx + 1) % JOURNEY_STAGES.length)}
                  className="p-1 rounded-full hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                  title="Next Step"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span className="text-3xl">{activeStage.emoji}</span>
              <span>{activeStage.title}: {activeStage.tagline}</span>
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {activeStage.detail}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-bold">
              <CheckCircle2 size={16} /> Key Student Outcome Secured
            </div>
          </div>

          <div className="animate-icon-float w-40 h-40 rounded-3xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 text-white flex flex-col items-center justify-center shadow-2xl flex-shrink-0 relative border border-white/20">
            <ActiveIcon size={48} className="drop-shadow-lg" />
            <span className="text-xs font-mono font-bold mt-2 uppercase tracking-widest text-sky-100">{activeStage.title}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
