'use client';
import React, { use } from 'react';
import Link from 'next/link';
import PublicNavbar from '../../../public-home-page/components/PublicNavbar';
import PublicFooter from '../../../public-home-page/components/PublicFooter';
import ResourceBreadcrumbs from '../../components/ResourceBreadcrumbs';
import CopyCodeButton from '../../components/CopyCodeButton';
import { DEV_GUIDE_ITEMS } from '@/lib/resourcesData';
import { FileCode, CheckCircle2, List, ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function DevGuideDetailPage({ params }: Props) {
  const { slug } = use(params);

  const guideIdx = DEV_GUIDE_ITEMS.findIndex(g => g.slug === slug);
  const guide = DEV_GUIDE_ITEMS[guideIdx] || DEV_GUIDE_ITEMS[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-28 pb-20 max-w-screen-2xl mx-auto px-6 lg:px-10 w-full">
        {/* Breadcrumb Navigation */}
        <ResourceBreadcrumbs
          backHref="/resources/development-guides"
          backLabel="Back to Development Guides"
          items={[
            { label: 'Development Guides', href: '/resources/development-guides' },
            { label: guide.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Content (8 cols) */}
          <article className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-mono font-bold mb-4">
              <FileCode size={13} />
              <span>DEVELOPMENT GUIDE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {guide.title}
            </h1>

            <p className="text-slate-600 text-base leading-relaxed mb-8 pb-6 border-b border-slate-100">
              {guide.description}
            </p>

            {/* Guide Text */}
            <div className="prose prose-slate max-w-none text-sm text-slate-700 space-y-6 mb-10">
              {guide.content.split('\n\n').map((paragraph, idx) => (
                <p key={`p-guide-${idx}`} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Code Examples with Copy Button */}
            {guide.codeExamples && guide.codeExamples.length > 0 && (
              <div className="space-y-6 mb-10">
                <h3 className="text-lg font-extrabold text-slate-900">Code Reference & Implementation</h3>
                {guide.codeExamples.map((ex, idx) => (
                  <div key={`ex-${idx}`} className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 text-slate-400 text-xs font-mono border-b border-slate-800">
                      <span>{ex.title} ({ex.language})</span>
                      <CopyCodeButton code={ex.code} />
                    </div>
                    <pre className="p-4 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed">
                      <code>{ex.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}

            {/* Best Practices */}
            {guide.bestPractices && guide.bestPractices.length > 0 && (
              <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200/80">
                <h3 className="text-sm font-bold text-emerald-900 mb-3 uppercase tracking-wider font-mono">
                  KEY BEST PRACTICES
                </h3>
                <ul className="space-y-2">
                  {guide.bestPractices.map((bp, idx) => (
                    <li key={`bp-${idx}`} className="flex items-start gap-2 text-xs text-emerald-900 font-medium">
                      <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          {/* Section 8: Right Side Table of Contents ("ON THIS PAGE") (4 cols) */}
          <aside className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs sticky top-28 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                <List size={14} className="text-blue-600" />
                <span>ON THIS PAGE</span>
              </div>

              <ul className="space-y-2">
                {guide.toc.map((item, idx) => (
                  <li key={`toc-${idx}`} className="text-xs font-semibold text-slate-700 hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
