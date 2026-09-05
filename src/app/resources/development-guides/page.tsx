'use client';
import React from 'react';
import Link from 'next/link';
import PublicNavbar from '../../public-home-page/components/PublicNavbar';
import PublicFooter from '../../public-home-page/components/PublicFooter';
import ResourceBreadcrumbs from '../components/ResourceBreadcrumbs';
import { DEV_GUIDE_ITEMS } from '@/lib/resourcesData';
import { FileCode, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function DevGuidesHubPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-28 pb-20 max-w-screen-2xl mx-auto px-6 lg:px-10 w-full">
        {/* Breadcrumbs */}
        <ResourceBreadcrumbs items={[{ label: 'Development Guides' }]} />

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-mono font-bold text-sky-400 mb-4">
              <FileCode size={14} />
              <span>BEST PRACTICES & STANDARDS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Development Guides
            </h1>
            <p className="text-slate-300 text-base leading-relaxed font-normal">
              Industry standards, architectural patterns, coding rules, component design systems, and optimization strategies for enterprise software codebases.
            </p>
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEV_GUIDE_ITEMS.map((guide) => (
            <Link
              key={`guide-${guide.id}`}
              href={`/resources/development-guides/${guide.slug}`}
              className="group bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-card-hover hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileCode size={20} />
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {guide.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                <span>View Guide</span>
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
