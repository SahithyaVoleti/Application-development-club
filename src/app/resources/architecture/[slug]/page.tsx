'use client';
import React, { use } from 'react';
import PublicNavbar from '../../../public-home-page/components/PublicNavbar';
import PublicFooter from '../../../public-home-page/components/PublicFooter';
import ResourceBreadcrumbs from '../../components/ResourceBreadcrumbs';
import { ARCHITECTURE_ITEMS } from '@/lib/resourcesData';
import { Network, Server, Database, Globe, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ArchitectureDetailPage({ params }: Props) {
  const { slug } = use(params);

  const itemIdx = ARCHITECTURE_ITEMS.findIndex(a => a.slug === slug);
  const arch = ARCHITECTURE_ITEMS[itemIdx] || ARCHITECTURE_ITEMS[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-28 pb-20 max-w-screen-2xl mx-auto px-6 lg:px-10 w-full">
        {/* Breadcrumb Navigation */}
        <ResourceBreadcrumbs
          backHref="/resources/architecture"
          backLabel="Back to Architecture Guides"
          items={[
            { label: 'Architecture Guides', href: '/resources/architecture' },
            { label: arch.title },
          ]}
        />

        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-mono font-bold mb-4">
            <Network size={13} />
            <span>SYSTEM DESIGN BLUEPRINT</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {arch.title}
          </h1>

          <p className="text-slate-600 text-base leading-relaxed font-normal mb-8 pb-6 border-b border-slate-100">
            {arch.description}
          </p>

          {/* Section 5: Clean Visual Diagram using HTML/CSS/SVG */}
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 text-white mb-10 overflow-hidden relative shadow-2xl">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-4 mb-6">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ARCHITECTURAL TOPOLOGY MAP</span>
              </span>
              <span>Encrypted TLS 1.3 Protocol</span>
            </div>

            {/* Visual SVG Flow Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center relative z-10 text-center">
              {/* Node 1: Presentation */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/40 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white mx-auto flex items-center justify-center shadow-md">
                  <Globe size={20} />
                </div>
                <div className="text-xs font-bold text-white">Frontend Web App</div>
                <div className="text-[10px] font-mono text-slate-400">Next.js 15 App Router</div>
              </div>

              {/* Arrow 1 */}
              <div className="hidden md:flex flex-col items-center text-sky-400 text-xs font-mono font-bold">
                <span>HTTP / REST</span>
                <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 to-sky-400 my-1 animate-pulse" />
                <span>→</span>
              </div>

              {/* Node 2: Gateway */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-sky-500/40 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white mx-auto flex items-center justify-center shadow-md">
                  <Server size={20} />
                </div>
                <div className="text-xs font-bold text-white">API Gateway & Mesh</div>
                <div className="text-[10px] font-mono text-slate-400">REST & GraphQL</div>
              </div>

              {/* Arrow 2 */}
              <div className="hidden md:flex flex-col items-center text-indigo-400 text-xs font-mono font-bold">
                <span>SQL Query</span>
                <div className="w-full h-0.5 bg-gradient-to-r from-sky-400 to-indigo-500 my-1 animate-pulse" />
                <span>→</span>
              </div>

              {/* Node 3: Database */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-2 md:col-span-1">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white mx-auto flex items-center justify-center shadow-md">
                  <Database size={20} />
                </div>
                <div className="text-xs font-bold text-white">Relational DB</div>
                <div className="text-[10px] font-mono text-slate-400">PostgreSQL + Prisma</div>
              </div>
            </div>
          </div>

          {/* Overview Narrative */}
          <div className="mb-10">
            <h3 className="text-lg font-extrabold text-slate-900 mb-3">System Architecture Overview</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{arch.overview}</p>
          </div>

          {/* Component Breakdown */}
          <div className="mb-10">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4">Core Architectural Components</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {arch.components.map((comp, idx) => (
                <div key={`comp-${idx}`} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-blue-600 font-mono mb-1">{comp.role}</div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{comp.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{comp.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Best Practices */}
          <div className="p-6 rounded-2xl bg-purple-50/70 border border-purple-200/80">
            <h3 className="text-sm font-bold text-purple-900 mb-3 uppercase tracking-wider font-mono">
              ARCHITECTURE BEST PRACTICES
            </h3>
            <ul className="space-y-2">
              {arch.bestPractices.map((bp, idx) => (
                <li key={`bp-arch-${idx}`} className="flex items-start gap-2 text-xs text-purple-900 font-medium">
                  <CheckCircle2 size={15} className="text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>{bp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
