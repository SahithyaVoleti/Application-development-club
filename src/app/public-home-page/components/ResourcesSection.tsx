'use client';
import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  FileCode,
  Server,
  Network,
  Cloud,
  ArrowRight,
} from 'lucide-react';
import { RESOURCE_CATEGORIES } from '@/lib/resourcesData';

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  GraduationCap,
  FileCode,
  Server,
  Network,
  Cloud,
};

export default function ResourcesSection() {
  return (
    <section id="resources" className="py-24 bg-white border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
          <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block mb-3">
            KNOWLEDGE & LEARNING HUB
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Developer Resources
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Everything software engineers need to design, build, test, and release modern software products efficiently.
          </p>
        </div>

        {/* Resources Grid - Every card is fully clickable */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESOURCE_CATEGORIES.map((res, idx) => {
            const Icon = ICON_MAP[res.iconName] || BookOpen;
            return (
              <Link
                key={`res-card-${res.id}`}
                href={res.href}
                className={`scroll-reveal group p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-card-hover hover:border-blue-300 flex flex-col justify-between cursor-pointer delay-${((idx % 3) + 1) * 100}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {res.itemCount} Guides
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {res.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {res.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                  <span>Explore</span>
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
