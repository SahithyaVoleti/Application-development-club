'use client';
import React, { use } from 'react';
import PublicNavbar from '../../../public-home-page/components/PublicNavbar';
import PublicFooter from '../../../public-home-page/components/PublicFooter';
import ResourceBreadcrumbs from '../../components/ResourceBreadcrumbs';
import CopyCodeButton from '../../components/CopyCodeButton';
import { DEPLOYMENT_ITEMS } from '@/lib/resourcesData';
import { Cloud, CheckCircle2, AlertTriangle, Terminal, Key } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function DeploymentDetailPage({ params }: Props) {
  const { slug } = use(params);

  const itemIdx = DEPLOYMENT_ITEMS.findIndex(d => d.slug === slug);
  const dep = DEPLOYMENT_ITEMS[itemIdx] || DEPLOYMENT_ITEMS[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-28 pb-20 max-w-screen-2xl mx-auto px-6 lg:px-10 w-full">
        {/* Breadcrumb Navigation */}
        <ResourceBreadcrumbs
          backHref="/resources/deployment"
          backLabel="Back to Deployment Guides"
          items={[
            { label: 'Deployment Guides', href: '/resources/deployment' },
            { label: dep.title },
          ]}
        />

        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs mb-8 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-mono font-bold mb-4">
              <Cloud size={13} />
              <span>DEPLOYMENT GUIDE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {dep.title}
            </h1>

            <p className="text-slate-600 text-base leading-relaxed font-normal pb-6 border-b border-slate-100">
              {dep.description}
            </p>
          </div>

          {/* Prerequisites */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">
              PREREQUISITES
            </h3>
            <div className="flex flex-wrap gap-2">
              {dep.prerequisites.map((p, idx) => (
                <span key={`prereq-${idx}`} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Dockerfile if applicable */}
          {dep.dockerfile && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                  PRODUCTION DOCKERFILE
                </h3>
                <CopyCodeButton code={dep.dockerfile} />
              </div>
              <pre className="p-4 bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto rounded-2xl border border-slate-800">
                <code>{dep.dockerfile}</code>
              </pre>
            </div>
          )}

          {/* Environment Variables */}
          {dep.envVariables.length > 0 && (
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Key size={14} className="text-blue-600" /> ENVIRONMENT VARIABLES
              </h3>
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2">
                {dep.envVariables.map((env, idx) => (
                  <div key={`env-${idx}`} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-1">
                    <span className="font-bold text-blue-600">{env.key}</span>
                    <span className="text-[11px] text-slate-500">{env.description}</span>
                    <span className="text-[10px] bg-slate-200/80 px-2 py-0.5 rounded text-slate-700 font-bold">{env.example}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step-by-step instructions */}
          <div className="space-y-6">
            <h3 className="text-lg font-extrabold text-slate-900">Deployment Procedure Steps</h3>
            {dep.steps.map((step, idx) => (
              <div key={`step-dep-${idx}`} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{step.instructions}</p>
                {step.code && (
                  <div className="relative">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 text-slate-400 rounded-t-xl text-[11px] font-mono border-b border-slate-800">
                      <span>Command</span>
                      <CopyCodeButton code={step.code} />
                    </div>
                    <pre className="p-3 bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto rounded-b-xl">
                      <code>{step.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Troubleshooting */}
          {dep.troubleshooting.length > 0 && (
            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-widest font-mono mb-3 flex items-center gap-2">
                <AlertTriangle size={15} className="text-amber-600" /> TROUBLESHOOTING COMMON ISSUES
              </h3>
              <ul className="space-y-2">
                {dep.troubleshooting.map((tb, idx) => (
                  <li key={`tb-${idx}`} className="text-xs text-amber-900 font-medium">
                    • {tb}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
