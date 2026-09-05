'use client';
import React from 'react';
import Link from 'next/link';
import PublicNavbar from '../../public-home-page/components/PublicNavbar';
import PublicFooter from '../../public-home-page/components/PublicFooter';
import ResourceBreadcrumbs from '../components/ResourceBreadcrumbs';
import { DEPLOYMENT_ITEMS } from '@/lib/resourcesData';
import { Cloud, ArrowRight, Server, Terminal, CheckCircle2 } from 'lucide-react';

export default function DeploymentHubPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-28 pb-20 max-w-screen-2xl mx-auto px-6 lg:px-10 w-full">
        {/* Breadcrumb Navigation */}
        <ResourceBreadcrumbs items={[{ label: 'Deployment Guides' }]} />

        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-mono font-bold mb-4">
              <Cloud size={14} />
              <span>CLOUD & DEVOPS PIPELINES</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Deployment Guides
            </h1>
            <p className="text-sky-100 text-base leading-relaxed font-normal">
              Production deployment guides for Docker containers, Vercel edge networks, AWS infrastructure, and GitHub Actions CI/CD pipelines.
            </p>
          </div>
        </div>

        {/* Deployment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEPLOYMENT_ITEMS.map((item) => (
            <Link
              key={`dep-card-${item.id}`}
              href={`/resources/deployment/${item.slug}`}
              className="group bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-card-hover hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Cloud size={20} />
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                <span>View Deployment Steps</span>
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
