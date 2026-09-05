'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Event } from '@/lib/mockData';
import {
  ArrowRight,
  ExternalLink,
  FolderGit2,
  Sparkles,
  Code2,
  Users,
  Trophy,
  CheckCircle2,
} from 'lucide-react';
import { WORKSPACE_PROJECTS, type WorkspaceProject } from '@/lib/workspaceData';

interface Props {
  events: Event[];
  onRegisterClick: (event: Event) => void;
  onViewDetails: (event: Event) => void;
}

export default function FeaturedApplicationsSection({ events, onRegisterClick, onViewDetails }: Props) {
  const [selectedTech, setSelectedTech] = useState('All');

  const filteredProjects = WORKSPACE_PROJECTS.filter(p => {
    if (selectedTech === 'All') return true;
    return p.techStack.includes(selectedTech);
  });

  return (
    <section id="projects-showcase" className="py-24 bg-white border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 space-y-12">
        
        {/* SECTION 7: Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold uppercase tracking-widest mb-3">
              <Sparkles size={14} className="text-blue-600" /> STUDENT TALENT SHOWCASE
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Talent That Builds
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Explore real applications designed, engineered, and deployed by our student teams through campus hackathons and innovation challenges.
            </p>
          </div>

          {/* Tech Stack Filter */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
            {['All', 'React', 'FastAPI', 'Next.js', 'Python', 'Node.js'].map(tech => (
              <button
                key={`proj-filter-${tech}`}
                onClick={() => setSelectedTech(tech)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  selectedTech === tech
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {/* Student Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project, idx) => (
            <div
              key={`showcase-card-${project.id}`}
              className="bg-slate-50/80 rounded-3xl border border-slate-200/90 overflow-hidden hover:bg-white hover:border-sky-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Project Header Banner */}
                <div className="relative w-full h-48 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-2 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-sky-300 text-[10px] font-mono font-bold border border-white/15 backdrop-blur-xs">
                      🏆 Hackathon Winner
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      ● {project.status}
                    </span>
                  </div>

                  <div className="z-10">
                    <div className="text-[10px] text-slate-400 font-mono">Student Author & Team</div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Users size={13} className="text-sky-400" />
                      <span>{project.authorName || 'Developer Team'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-extrabold text-slate-900 leading-snug group-hover:text-sky-600 transition-colors">
                    {project.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-700">
                    <div className="font-bold text-slate-900 mb-0.5 flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-500" /> Problem Solved:
                    </div>
                    <div className="line-clamp-2 text-slate-600">
                      {project.summary || 'Created custom digital solution streamlining workflow & departmental metrics.'}
                    </div>
                  </div>

                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.map(t => (
                      <span
                        key={`stack-${project.id}-${t}`}
                        className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: GitHub & Live Demo */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <FolderGit2 size={13} /> GitHub
                </a>

                <a
                  href={project.deployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ExternalLink size={13} /> Live Demo
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
