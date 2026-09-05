'use client';
import React, { use } from 'react';
import Link from 'next/link';
import PublicNavbar from '../../../public-home-page/components/PublicNavbar';
import PublicFooter from '../../../public-home-page/components/PublicFooter';
import ResourceBreadcrumbs from '../../components/ResourceBreadcrumbs';
import CopyCodeButton from '../../components/CopyCodeButton';
import { TUTORIAL_ITEMS } from '@/lib/resourcesData';
import {
  Clock,
  Code2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Terminal,
  Rocket,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function TutorialDetailPage({ params }: Props) {
  const { slug } = use(params);

  const tutorialIdx = TUTORIAL_ITEMS.findIndex(t => t.slug === slug);
  const tutorial = TUTORIAL_ITEMS[tutorialIdx] || TUTORIAL_ITEMS[0];

  const prevTutorial = tutorialIdx > 0 ? TUTORIAL_ITEMS[tutorialIdx - 1] : null;
  const nextTutorial = tutorialIdx < TUTORIAL_ITEMS.length - 1 ? TUTORIAL_ITEMS[tutorialIdx + 1] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-28 pb-20 max-w-screen-xl mx-auto px-6 lg:px-10 w-full">
        {/* Breadcrumb Navigation */}
        <ResourceBreadcrumbs
          backHref="/resources/tutorials"
          backLabel="Back to Tutorials"
          items={[
            { label: 'Tutorials', href: '/resources/tutorials' },
            { label: tutorial.title },
          ]}
        />

        {/* Tutorial Header */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
              tutorial.difficulty === 'Beginner'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : tutorial.difficulty === 'Intermediate'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-purple-50 text-purple-700 border-purple-200'
            }`}>
              {tutorial.difficulty}
            </span>

            <span className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold bg-slate-100 px-3 py-1 rounded-full">
              <Clock size={13} /> {tutorial.time}
            </span>

            <span className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold bg-slate-100 px-3 py-1 rounded-full font-mono">
              <Code2 size={13} className="text-blue-600" /> {tutorial.technology}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {tutorial.title}
          </h1>

          <p className="text-slate-600 text-base leading-relaxed font-normal">
            {tutorial.description}
          </p>
        </div>

        {/* Overview & Prerequisites */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Prerequisites */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest mb-4">
              PREREQUISITES
            </h3>
            <ul className="space-y-3">
              {tutorial.prerequisites.map((req, idx) => (
                <li key={`req-${idx}`} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Table of Contents */}
          <div className="lg:col-span-8 bg-blue-50/60 p-6 rounded-3xl border border-blue-100">
            <h3 className="text-xs font-mono font-bold text-blue-800 uppercase tracking-widest mb-3">
              TUTORIAL STEPS
            </h3>
            <ol className="space-y-2 text-xs font-semibold text-blue-900">
              {tutorial.steps.map((step, idx) => (
                <li key={`step-toc-${idx}`} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span>{step.title}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Tutorial Steps */}
        <div className="space-y-8 mb-12">
          {tutorial.steps.map((step, idx) => (
            <div key={`step-card-${idx}`} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="text-xl font-extrabold text-slate-900 mb-3 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center shadow-xs">
                  0{idx + 1}
                </span>
                <span>{step.title}</span>
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {step.content}
              </p>

              {step.code && (
                <div className="relative mt-4">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-950 text-slate-400 rounded-t-xl text-xs font-mono border-b border-slate-800">
                    <span>Terminal / Code Script</span>
                    <CopyCodeButton code={step.code} />
                  </div>
                  <pre className="p-4 bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto rounded-b-xl leading-relaxed">
                    <code>{step.code}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Testing & Deployment Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Terminal size={18} className="text-indigo-600" /> Testing Strategy
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">{tutorial.testing}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Rocket size={18} className="text-emerald-600" /> Deployment Strategy
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">{tutorial.deployment}</p>
          </div>
        </div>

        {/* Previous Tutorial & Next Tutorial Controls */}
        <div className="pt-8 border-t border-slate-200 flex items-center justify-between gap-4">
          {prevTutorial ? (
            <Link
              href={`/resources/tutorials/${prevTutorial.slug}`}
              className="p-4 rounded-2xl bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 transition-all text-left group flex items-center gap-3"
            >
              <ArrowLeft size={16} className="text-slate-400 group-hover:-translate-x-1 transition-transform" />
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">← Previous Tutorial</div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">{prevTutorial.title}</div>
              </div>
            </Link>
          ) : <div />}

          {nextTutorial ? (
            <Link
              href={`/resources/tutorials/${nextTutorial.slug}`}
              className="p-4 rounded-2xl bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 transition-all text-right group flex items-center gap-3"
            >
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Next Tutorial →</div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">{nextTutorial.title}</div>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : <div />}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
