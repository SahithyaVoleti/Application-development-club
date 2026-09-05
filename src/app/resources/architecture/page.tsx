'use client';
import React from 'react';
import Link from 'next/link';
import PublicNavbar from '../../public-home-page/components/PublicNavbar';
import PublicFooter from '../../public-home-page/components/PublicFooter';
import ResourceBreadcrumbs from '../components/ResourceBreadcrumbs';
import { ARCHITECTURE_ITEMS } from '@/lib/resourcesData';
import { Network, ArrowRight, Layers, Server, Database, ShieldCheck } from 'lucide-react';

export default function ArchitectureHubPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-28 pb-20 max-w-screen-2xl mx-auto px-6 lg:px-10 w-full">
        {/* Breadcrumb Navigation */}
        <ResourceBreadcrumbs items={[{ label: 'Architecture Guides' }]} />

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-mono font-bold text-purple-300 mb-4">
              <Network size={14} />
              <span>SYSTEM DESIGN & BLUEPRINTS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Architecture Guides
            </h1>
            <p className="text-purple-100 text-base leading-relaxed font-normal">
              System architecture blueprints, microservice topologies, database schema normalization patterns, and high-availability enterprise designs.
            </p>
          </div>
        </div>

        {/* Architecture Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARCHITECTURE_ITEMS.map((item) => (
            <Link
              key={`arch-${item.id}`}
              href={`/resources/architecture/${item.slug}`}
              className="group bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-card-hover hover:border-purple-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* SVG Visual Diagram Mini Preview */}
                <div className="bg-slate-900 rounded-2xl p-4 mb-5 border border-slate-800 text-slate-300 text-xs font-mono">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2">
                    <span>SYSTEM BLUEPRINT</span>
                    <span className="text-purple-400">SVG Flow</span>
                  </div>
                  <div className="flex items-center justify-between gap-1 text-[11px] font-bold">
                    <span className="px-2 py-1 bg-blue-600 text-white rounded">Frontend</span>
                    <span className="text-slate-500">→</span>
                    <span className="px-2 py-1 bg-sky-500 text-white rounded">API Gateway</span>
                    <span className="text-slate-500">→</span>
                    <span className="px-2 py-1 bg-indigo-600 text-white rounded">DB</span>
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 mb-2 leading-snug group-hover:text-purple-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600 group-hover:text-purple-700">
                <span>View Blueprint</span>
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
