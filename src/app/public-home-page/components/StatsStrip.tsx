'use client';
import React from 'react';
import { Cpu, Wrench, GitCommit, CheckCircle2 } from 'lucide-react';
import CountUp from './CountUp';

const STATS = [
  {
    icon: Cpu,
    value: 10,
    suffix: '+',
    label: 'Technologies',
    desc: 'Modern web & AI frameworks',
  },
  {
    icon: Wrench,
    value: 20,
    suffix: '+',
    label: 'Development Tools',
    desc: 'Integrated CI/CD & DB tools',
  },
  {
    icon: GitCommit,
    value: 8,
    suffix: '',
    label: 'Development Stages',
    desc: 'End-to-end software lifecycle',
  },
  {
    icon: CheckCircle2,
    value: 100,
    suffix: '%',
    label: 'Responsive',
    desc: 'Mobile & desktop ready',
  },
];

export default function StatsStrip() {
  return (
    <section className="relative z-20 -mt-8 md:-mt-10 lg:-mt-12 w-full max-w-full px-2 sm:px-4 lg:px-6 mb-8">
      <div className="w-full bg-[#0b1638] text-white rounded-2xl lg:rounded-3xl shadow-2xl h-auto md:h-[72px] lg:h-[76px] border border-slate-800/90 flex items-center px-4 sm:px-6 lg:px-8 py-2 md:py-0">
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-0 divide-x-0 md:divide-x divide-slate-800/80 items-center">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={`stat-${stat.label}`}
                className="flex items-center justify-center gap-3 px-2 py-1 md:py-0 transition-all duration-200 hover:bg-slate-800/40 rounded-lg"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-sky-400 flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                  <Icon size={15} />
                </div>
                <div className="text-left">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                      <CountUp end={stat.value} suffix={stat.suffix} />
                    </span>
                    <span className="text-xs font-bold text-slate-200 whitespace-nowrap">
                      {stat.label}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                    {stat.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}