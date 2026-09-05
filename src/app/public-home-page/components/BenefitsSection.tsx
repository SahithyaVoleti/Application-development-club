'use client';
import React from 'react';
import { Lightbulb, Code2, Trophy, Users2, ArrowUpRight } from 'lucide-react';

const BENEFITS = [
  {
    icon: Lightbulb,
    title: 'LEARN',
    description: 'Build practical technical skills through workshops, hands-on seminars, and faculty guidance.',
    badge: 'Skill Acquisition',
    color: 'from-sky-500 to-blue-500',
    bgLight: 'bg-sky-50',
    borderColor: 'hover:border-sky-300',
  },
  {
    icon: Code2,
    title: 'BUILD',
    description: 'Work on real-world full stack and AI projects to create portfolio-ready applications.',
    badge: 'Practical Exposure',
    color: 'from-blue-500 to-indigo-500',
    bgLight: 'bg-blue-50',
    borderColor: 'hover:border-blue-300',
  },
  {
    icon: Trophy,
    title: 'COMPETE',
    description: 'Challenge yourself through hackathons and coding competitions with exciting cash prizes.',
    badge: 'Prizes & Recognition',
    color: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-50',
    borderColor: 'hover:border-amber-300',
  },
  {
    icon: Users2,
    title: 'CONNECT',
    description: 'Meet motivated CSE peers, alumni mentors, and industry experts to expand your network.',
    badge: 'Networking',
    color: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50',
    borderColor: 'hover:border-emerald-300',
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-sky-50/40 to-white">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-300/50 text-sky-700 text-xs font-bold uppercase tracking-widest mb-4">
            ● Student Growth Initiative
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-3">
            Why Participate in AppDevHub?
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Empowering Computer Science & Engineering students with the tools, mentorship, and opportunities to excel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={`benefit-${item.title}`}
                className={`relative bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-500/10 ${item.borderColor} group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-md shadow-sky-500/15 transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-stone-900 tracking-tight mb-2 flex items-center justify-between">
                    <span>{item.title}</span>
                    <ArrowUpRight
                      size={18}
                      className="text-stone-300 opacity-0 group-hover:opacity-100 group-hover:text-sky-500 transition-all duration-200"
                    />
                  </h3>

                  <p className="text-stone-600 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} w-0 group-hover:w-full transition-all duration-500 ease-out`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
