'use client';
import React, { useState, use } from 'react';
import Link from 'next/link';
import PublicNavbar from '../../../public-home-page/components/PublicNavbar';
import PublicFooter from '../../../public-home-page/components/PublicFooter';
import ResourceBreadcrumbs from '../../components/ResourceBreadcrumbs';
import CopyCodeButton from '../../components/CopyCodeButton';
import {
  DOCUMENTATION_ITEMS,
  ResourceDocItem,
} from '@/lib/resourcesData';
import {
  Search,
  BookOpen,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const DOC_CATEGORIES = [
  'Getting Started',
  'Application Development',
  'Frontend',
  'Backend',
  'APIs',
  'Database',
  'Authentication',
  'Deployment',
  'Testing',
];

interface Props {
  params: Promise<{ slug: string }>;
}

export default function DocumentationDetailPage({ params }: Props) {
  const { slug } = use(params);
  const [docSearch, setDocSearch] = useState('');

  const currentDoc = DOCUMENTATION_ITEMS.find(d => d.slug === slug) || DOCUMENTATION_ITEMS[0];

  const prevDoc = DOCUMENTATION_ITEMS.find(d => d.slug === currentDoc.prevSlug);
  const nextDoc = DOCUMENTATION_ITEMS.find(d => d.slug === currentDoc.nextSlug);

  const filteredDocs = DOCUMENTATION_ITEMS.filter(d =>
    !docSearch ||
    d.title.toLowerCase().includes(docSearch.toLowerCase()) ||
    d.description.toLowerCase().includes(docSearch.toLowerCase()) ||
    d.category.toLowerCase().includes(docSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-28 pb-20 max-w-screen-2xl mx-auto px-6 lg:px-10 w-full">
        {/* Breadcrumb & Navigation */}
        <ResourceBreadcrumbs
          backHref="/resources"
          backLabel="Back to Resources"
          items={[
            { label: 'Documentation', href: '/resources/documentation/introduction' },
            { label: currentDoc.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Navigation */}
          <aside className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <div className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest mb-3">
                DOCUMENTATION NAV
              </div>

              {/* Doc Search */}
              <div className="relative mb-4">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  placeholder="Search documentation..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Doc Items by Category */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {DOC_CATEGORIES.map(cat => {
                  const itemsInCat = filteredDocs.filter(d => d.category === cat);
                  if (itemsInCat.length === 0) return null;

                  return (
                    <div key={`cat-nav-${cat}`}>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                        {cat}
                      </h4>
                      <div className="space-y-0.5">
                        {itemsInCat.map(doc => {
                          const isActive = doc.slug === currentDoc.slug;
                          return (
                            <Link
                              key={`doc-link-${doc.slug}`}
                              href={`/resources/documentation/${doc.slug}`}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                isActive
                                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                              }`}
                            >
                              <span>{doc.title}</span>
                              <ChevronRight size={13} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <article className="lg:col-span-9 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold mb-4">
              <BookOpen size={13} />
              <span>{currentDoc.category}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {currentDoc.title}
            </h1>

            <p className="text-slate-600 text-base leading-relaxed mb-8 pb-6 border-b border-slate-100 font-normal">
              {currentDoc.description}
            </p>

            {/* Document Content */}
            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 space-y-6 mb-12">
              {currentDoc.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('```')) {
                  const lines = paragraph.split('\n');
                  const codeContent = lines.slice(1, -1).join('\n');
                  return (
                    <div key={`code-block-${idx}`} className="relative my-4">
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-950 text-slate-400 rounded-t-xl text-xs font-mono border-b border-slate-800">
                        <span>Code Reference</span>
                        <CopyCodeButton code={codeContent} />
                      </div>
                      <pre className="p-4 bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto rounded-b-xl leading-relaxed">
                        <code>{codeContent}</code>
                      </pre>
                    </div>
                  );
                }

                if (paragraph.startsWith('1.') || paragraph.startsWith('-')) {
                  return (
                    <ul key={`list-${idx}`} className="space-y-2 pl-2">
                      {paragraph.split('\n').map((line, lIdx) => (
                        <li key={`li-${lIdx}`} className="flex items-start gap-2 text-slate-700">
                          <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{line.replace(/^[0-9]\. |- /, '')}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p key={`p-${idx}`} className="text-slate-700 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Previous & Next Navigation */}
            <div className="pt-8 border-t border-slate-100 flex items-center justify-between gap-4">
              {prevDoc ? (
                <Link
                  href={`/resources/documentation/${prevDoc.slug}`}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 transition-all text-left group"
                >
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Previous
                  </div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {prevDoc.title}
                  </div>
                </Link>
              ) : <div />}

              {nextDoc ? (
                <Link
                  href={`/resources/documentation/${nextDoc.slug}`}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 transition-all text-right group"
                >
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-end gap-1">
                    Next <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {nextDoc.title}
                  </div>
                </Link>
              ) : <div />}
            </div>
          </article>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
