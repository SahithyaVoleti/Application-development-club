'use client';
import React from 'react';
import Image from 'next/image';
import CountUp from './CountUp';
import { Cpu, Code2, ShieldCheck, Workflow, Sparkles } from 'lucide-react';

const HIGHLIGHT_METRICS = [
  { value: 10, suffix: '+', label: '10+ Technologies', desc: 'Modern stacks supported across web, mobile & cloud', icon: Cpu },
  { value: 8, suffix: '+', label: 'Multiple Application Types', desc: 'Custom web, enterprise, AI & mobile platforms', icon: Code2 },
  { value: 100, suffix: '%', label: 'End-to-End Workflow', desc: 'From initial ideation to continuous deployment', icon: Workflow },
  { value: 100, suffix: '%', label: 'Developer Ready', desc: 'Pre-configured templates & API integrations', icon: ShieldCheck },
];

export default function IntroSection() {
  return (
    <section className="py-20 bg-white border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 space-y-16">
        
        {/* Two-Column Intro Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Large Heading & Paragraph */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block">
              COLLEGE INNOVATION ENVIRONMENT
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Where College Coders Turn Ideas Into Real Software
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              The Application Development Hub brings software development processes, modern technology frameworks, architectural standards, and developer productivity tools into a unified platform.
            </p>
            <p className="text-slate-500 text-sm leading-relaxed">
              Designed for student developers, engineers, and innovation teams to design, prototype, test, and release robust digital products with high reliability, security, and velocity.
            </p>
          </div>

          {/* Right: High Resolution UI Image Banner */}
          <div className="lg:col-span-6">
            <div className="relative w-full h-[340px] sm:h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
              <Image
                src="/images/ui/campus_hackathon_hero.jpg"
                alt="College Innovation Hub Hackathon Lab"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 text-white flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-bold mb-1">
                    <Sparkles size={13} /> Campus Innovation Lab
                  </div>
                  <div className="text-sm font-extrabold text-white">Student Hackathon & Coding Sprint</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Highlight Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HIGHLIGHT_METRICS.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={`intro-metric-${idx}`}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-card-hover hover:border-blue-200 group cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={20} />
                </div>

                <div className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
                  <CountUp end={metric.value} suffix={metric.suffix} />
                </div>

                <h3 className="text-sm font-bold text-slate-800 mb-1">{metric.label}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{metric.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
