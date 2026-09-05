'use client';
import React from 'react';
import {
  X,
  ExternalLink,
  FolderGit2,
  Calendar,
  User,
  Star,
  GitCommit,
  CheckCircle,
  Layers,
  Code,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { type WorkspaceProject } from '@/lib/workspaceData';

interface Props {
  project: WorkspaceProject | null;
  onClose: () => void;
}

export default function ProjectDetailsModal({ project, onClose }: Props) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative flex items-start justify-between">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30">
                Project Showcase
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  project.status === 'Production'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                ● {project.status}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              {project.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs">
          
          {/* Creator & Author Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                {project.authorName ? project.authorName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'DV'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {project.authorName || 'Developer'}
                  </span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.2 rounded-full font-bold border border-indigo-100">
                    Author / Creator
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {project.authorRole || 'Lead Engineer'} · {project.authorEmail || 'developer@vignan.ac.in'}
                </div>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Last Activity</div>
              <div className="text-xs font-semibold text-slate-700 font-mono mt-0.5">{project.lastUpdated}</div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-sky-700 font-bold mb-0.5">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="text-base font-extrabold text-slate-900">{project.stars}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium uppercase">GitHub Stars</div>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-indigo-700 font-bold mb-0.5">
                <GitCommit size={14} className="text-indigo-600" />
                <span className="text-base font-extrabold text-slate-900">{project.commits}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium uppercase">Total Commits</div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-700 font-bold mb-0.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span className="text-base font-extrabold text-slate-900">Verified</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium uppercase">Build Status</div>
            </div>
          </div>

          {/* Summary Overview */}
          {project.summary && (
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles size={14} className="text-sky-600" /> Project Purpose & Overview
              </h4>
              <p className="text-slate-600 leading-relaxed text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70">
                {project.summary}
              </p>
            </div>
          )}

          {/* Key Features Implemented ("What I Did") */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-600" /> Key Technical Accomplishments
            </h4>
            <div className="space-y-2">
              {(project.features || [
                'Full responsive design built with Tailwind CSS & Next.js',
                'RESTful API integration with error handling & validation',
                'State management and local persistence optimization',
                'Production environment deployment pipeline setup'
              ]).map((feat, idx) => (
                <div
                  key={`feat-${idx}`}
                  className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs text-slate-700 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-normal">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Badges */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers size={14} className="text-indigo-600" /> Technology Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map(tech => (
                <span
                  key={`tech-badge-${tech}`}
                  className="px-2.5 py-1 rounded-lg font-mono font-bold text-[11px] bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <FolderGit2 size={14} /> Repository
              </a>
            )}

            {project.deployUrl && (
              <a
                href={project.deployUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <ExternalLink size={14} /> Live Demo
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
