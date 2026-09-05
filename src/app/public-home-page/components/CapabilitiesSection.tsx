'use client';
import React from 'react';
import {
  Code,
  Globe,
  Smartphone,
  Building2,
  Server,
  Cloud,
  Sparkles,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

const CAPABILITIES = [
  {
    title: 'Custom Application Development',
    desc: 'Tailored applications designed around specific business workflows, performance criteria, and unique user requirements.',
    icon: Code,
    color: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    title: 'Web Application Development',
    desc: 'Modern, scalable, and responsive web applications built with Next.js, React, TypeScript, and server-rendered architectures.',
    icon: Globe,
    color: 'text-sky-600 bg-sky-50 border-sky-100',
  },
  {
    title: 'Mobile Application Development',
    desc: 'High-quality cross-platform and native mobile experiences engineered for fluid iOS and Android performance.',
    icon: Smartphone,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  },
  {
    title: 'Enterprise Applications',
    desc: 'Secure, multi-tenant, and compliant enterprise-grade software systems built for heavy workloads and integrations.',
    icon: Building2,
    color: 'text-purple-600 bg-purple-50 border-purple-100',
  },
  {
    title: 'API & Backend Development',
    desc: 'Robust RESTful and GraphQL APIs, microservices, background job workers, and high-throughput data processing layers.',
    icon: Server,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
  {
    title: 'Cloud & Deployment',
    desc: 'Automated CI/CD pipelines, containerization with Docker, and cloud infrastructure deployment on AWS, Azure, and Vercel.',
    icon: Cloud,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
  },
  {
    title: 'AI-Powered Applications',
    desc: 'Integrate LLMs, Gemini AI, OpenAI, intelligent RAG pipelines, and automated agent workflows directly into products.',
    icon: Sparkles,
    color: 'text-amber-600 bg-amber-50 border-amber-100',
  },
  {
    title: 'Application Modernization',
    desc: 'Refactor legacy codebases, decouple monolithic services into micro-frontends, and upgrade database structures cleanly.',
    icon: RefreshCw,
    color: 'text-teal-600 bg-teal-50 border-teal-100',
  },
];

export default function CapabilitiesSection() {
  return (
    <section id="capabilities" className="py-24 bg-slate-50 border-b border-slate-200/60 relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
        {/* Section Header with Staggered Scroll Reveal (Section 13) */}
        <div className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
          <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block mb-3">
            CORE SERVICES & CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Application Development Capabilities
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            End-to-end software engineering capabilities powering digital transformation across web, mobile, cloud, and artificial intelligence.
          </p>
        </div>

        {/* Capabilities Grid (Section 14 Card Animations) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAPABILITIES.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={`capability-${idx}`}
                className={`scroll-reveal group relative p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-blue-300 hover:bg-gradient-to-b hover:from-white hover:to-blue-50/20 cursor-pointer flex flex-col justify-between delay-${((idx % 4) + 1) * 100}`}
              >
                <div>
                  {/* Icon Header (Section 14: scale 1 -> 1.08) */}
                  <div className={`w-12 h-12 rounded-xl border ${cap.color} flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105 shadow-xs`}>
                    <Icon size={22} className="transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2 transition-colors group-hover:text-blue-600">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {cap.desc}
                  </p>
                </div>

                {/* Bottom Action Link (Section 14: Arrow translateX 0 -> 4px) */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
                  <span>Learn capability</span>
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 text-slate-400 group-hover:text-blue-600" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
