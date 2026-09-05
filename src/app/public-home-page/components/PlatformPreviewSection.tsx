'use client';
import React, { useState } from 'react';
import {
  Terminal,
  FolderGit2,
} from 'lucide-react';

interface Props {
  onSwitchToWorkspace?: () => void;
}

export default function PlatformPreviewSection({ onSwitchToWorkspace }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'deployments' | 'api' | 'metrics'>('overview');

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200/60 relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
          <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block mb-3">
            INTEGRATED DEVELOPER PLATFORM
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Everything in One Development Workspace
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Monitor deployments, manage project repositories, run API tests, and track code analytics in a unified real-time dashboard.
          </p>
        </div>

        {/* Section 19: Realistic Dashboard Mockup with Entrance & Floating Motion */}
        <div className="scroll-reveal relative max-w-5xl mx-auto bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 transition-all duration-500 hover:shadow-blue-500/10">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500" />
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500" />
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-mono text-slate-400 font-bold ml-2">appdevhub-workspace.v2.4</span>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'overview' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('deployments')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'deployments' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Deployments
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'api' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                API Mesh
              </button>
            </div>
          </div>

          {/* Tab 1: Overview Dashboard Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 transition-all hover:bg-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 font-bold mb-1">ACTIVE PROJECTS</div>
                  <div className="text-2xl font-extrabold text-white">12 Applications</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">● All repositories healthy</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 transition-all hover:bg-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 font-bold mb-1">DEPLOYMENT STATUS</div>
                  <div className="text-2xl font-extrabold text-white">Vercel & AWS</div>
                  <div className="text-[10px] text-sky-400 font-semibold mt-1">● 99.98% Uptime</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 transition-all hover:bg-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 font-bold mb-1">API REQUESTS</div>
                  <div className="text-2xl font-extrabold text-white">1.4M / month</div>
                  <div className="text-[10px] text-indigo-400 font-semibold mt-1">Avg latency: 18ms</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 transition-all hover:bg-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 font-bold mb-1">AI WORKFLOWS</div>
                  <div className="text-2xl font-extrabold text-white">Gemini & OpenAI</div>
                  <div className="text-[10px] text-amber-400 font-semibold mt-1">● RAG Pipeline Live</div>
                </div>
              </div>

              {/* Recent Applications Table */}
              <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <FolderGit2 size={16} className="text-blue-400" />
                    <span>Recent Platform Applications</span>
                  </h4>

                  {onSwitchToWorkspace && (
                    <button
                      onClick={onSwitchToWorkspace}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors btn-hover-premium"
                    >
                      <Terminal size={13} />
                      <span>Launch Workspace</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <div>
                        <div className="font-bold text-white">AI Smart Campus Hackathon Portal</div>
                        <div className="text-[10px] font-mono text-slate-400">Next.js 15 · PostgreSQL · Gemini AI</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">Production</span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                      <div>
                        <div className="font-bold text-white">Sustainability Ideathon Hub</div>
                        <div className="text-[10px] font-mono text-slate-400">React 19 · FastAPI · Docker</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-mono font-bold">Staging</span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                      <div>
                        <div className="font-bold text-white">Code Storm Algorithmic Judge</div>
                        <div className="text-[10px] font-mono text-slate-400">Node.js · Redis · WebSocket</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-[10px] font-mono font-bold">Active Contest</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Deployments Content */}
          {activeTab === 'deployments' && (
            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3 font-mono text-xs text-slate-300 animate-fadeIn">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-emerald-400 font-bold">✓ Deployment #4028 succeeded</div>
                  <div className="text-[10px] text-slate-500">commit 8f2a91 — update next.config.mjs and prisma client</div>
                </div>
                <span className="text-[10px] text-slate-400">2 mins ago</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-emerald-400 font-bold">✓ Database Migration Applied</div>
                  <div className="text-[10px] text-slate-500">npx prisma db push --accept-data-loss</div>
                </div>
                <span className="text-[10px] text-slate-400">14 mins ago</span>
              </div>
            </div>
          )}

          {/* Tab 3: API Mesh Content */}
          {activeTab === 'api' && (
            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3 animate-fadeIn">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">GET</span>
                  <span className="text-white">/api/events</span>
                </div>
                <span className="text-emerald-400 font-bold">200 OK (12ms)</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">POST</span>
                  <span className="text-white">/api/registrations</span>
                </div>
                <span className="text-emerald-400 font-bold">201 Created (24ms)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
