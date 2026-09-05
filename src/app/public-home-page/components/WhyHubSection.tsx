'use client';
import React from 'react';
import {
  Layers,
  Cpu,
  ShieldCheck,
  Workflow,
  Sparkles,
  Cloud,
  Lock,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

const WHY_HUB_FEATURES = [
  {
    title: 'Centralized Development Resources',
    desc: 'Access unified documentation, starter templates, component libraries, and API specifications in one platform.',
    icon: Layers,
    accent: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
  },
  {
    title: 'Modern Technology Stack',
    desc: 'Engineered with Next.js 15, React 19, TypeScript, Tailwind CSS, PostgreSQL, and modern cloud primitives.',
    icon: Cpu,
    accent: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  },
  {
    title: 'Scalable Architecture',
    desc: 'Microservices and modular patterns designed to scale from zero to high-throughput production workloads effortlessly.',
    icon: ShieldCheck,
    accent: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
  },
  {
    title: 'Developer-Friendly Workflow',
    desc: 'Pre-configured linting, type safety, automated build pipelines, and instant preview environments.',
    icon: Workflow,
    accent: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  },
  {
    title: 'AI Integration Ready',
    desc: 'Built-in support for Gemini AI, OpenAI, agentic LLM workflows, and intelligent vector search pipelines.',
    icon: Sparkles,
    accent: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  },
  {
    title: 'Cloud Deployment Ready',
    desc: 'Zero-configuration container builds with Docker, GitHub Actions CI/CD pipelines, and AWS / Vercel hosting.',
    icon: Cloud,
    accent: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
  },
  {
    title: 'Security First',
    desc: 'Role-based access control, encrypted API tokens, sanitized database queries, and automated dependency auditing.',
    icon: Lock,
    accent: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    title: 'Continuous Improvement',
    desc: 'Iterative performance analytics, automated health checks, error telemetry, and ongoing platform enhancements.',
    icon: TrendingUp,
    accent: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  },
];

export default function WhyHubSection() {
  return (
    <section id="why-hub" className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Ambient Dark Glows & Lines */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '-2s' }} />

      {/* Grid Mesh Background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none animate-grid-breath"
        style={{
          backgroundImage: 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-screen-2xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest block mb-3">
            ENTERPRISE VALUE PROPOSITION
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Why Build With Application Development Hub?
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Designed to eliminate setup overhead, enforce architectural standards, and empower software teams to build production-grade applications faster.
          </p>
        </div>

        {/* 8 Features Grid with Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_HUB_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={`why-${idx}`}
                className={`scroll-reveal group relative p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/50 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between delay-${((idx % 4) + 1) * 100}`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl border ${feat.accent} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={22} />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-sky-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-mono text-slate-500 group-hover:text-sky-400 transition-colors">
                  <CheckCircle2 size={13} className="text-sky-500" />
                  <span>Enterprise standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
