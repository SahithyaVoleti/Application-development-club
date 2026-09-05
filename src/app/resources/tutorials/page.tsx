'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import PublicNavbar from '../../public-home-page/components/PublicNavbar';
import PublicFooter from '../../public-home-page/components/PublicFooter';
import ResourceBreadcrumbs from '../components/ResourceBreadcrumbs';
import { TUTORIAL_ITEMS } from '@/lib/resourcesData';
import {
  GraduationCap,
  Clock,
  Code2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function TutorialsHubPage() {
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  const filteredTutorials = TUTORIAL_ITEMS.filter(tut =>
    filterDifficulty === 'All' || tut.difficulty === filterDifficulty
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-28 pb-20 max-w-screen-2xl mx-auto px-6 lg:px-10 w-full">
        {/* Breadcrumbs */}
        <ResourceBreadcrumbs
          items={[{ label: 'Tutorials' }]}
        />

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-mono font-bold mb-4">
              <GraduationCap size={14} />
              <span>HANDS-ON STEP-BY-STEP GUIDES</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Developer Tutorials
            </h1>
            <p className="text-blue-100 text-base leading-relaxed mb-6 font-normal">
              Practical, step-by-step technical guides for constructing full-stack applications, writing REST APIs, setting up PostgreSQL databases, and building AI agent workflows.
            </p>

            {/* Difficulty Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-blue-200 mr-2">Filter Difficulty:</span>
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
                <button
                  key={`diff-${diff}`}
                  onClick={() => setFilterDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterDifficulty === diff
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tutorial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tut) => (
            <div
              key={`tut-card-${tut.id}`}
              className="group bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-card-hover hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Meta Badges */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                    tut.difficulty === 'Beginner'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : tut.difficulty === 'Intermediate'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-purple-50 text-purple-700 border-purple-200'
                  }`}>
                    {tut.difficulty}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Clock size={13} />
                    <span>{tut.time}</span>
                  </div>
                </div>

                {/* Tech Badge */}
                <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-500 mb-3 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  <Code2 size={12} className="text-blue-600" />
                  <span>{tut.technology}</span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-extrabold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {tut.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {tut.description}
                </p>
              </div>

              {/* Action Link */}
              <Link
                href={`/resources/tutorials/${tut.slug}`}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-all shadow-xs cursor-pointer"
              >
                <span>Start Tutorial</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
