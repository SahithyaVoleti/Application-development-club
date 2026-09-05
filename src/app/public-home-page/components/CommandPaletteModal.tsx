'use client';
import React, { useState, useEffect } from 'react';
import {
  Search,
  FolderGit2,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Rocket,
  Settings,
  X,
  ArrowRight,
  Terminal,
  Calendar,
} from 'lucide-react';
import { WORKSPACE_PROJECTS, APP_TEMPLATES } from '@/lib/workspaceData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string, payload?: any) => void;
}

export default function CommandPaletteModal({ isOpen, onClose, onSelectAction }: Props) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProjects = WORKSPACE_PROJECTS.filter(
    p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.techStack.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredTemplates = APP_TEMPLATES.filter(
    t =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 modal-overlay bg-slate-900/40 backdrop-blur-xs"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-scaleIn">
        {/* Search Input Field */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <Search size={18} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search projects, files, APIs, deployments, settings... (Ctrl + K)"
            className="w-full bg-transparent text-slate-900 text-sm focus:outline-none placeholder-slate-400 font-medium"
            autoFocus
          />
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <kbd className="hidden sm:inline-block text-[10px] font-mono bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-500 shadow-2xs">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Quick Commands & Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {!query && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
                Quick Actions
              </div>
              <div className="space-y-1">
                {[
                  { id: 'create-app', label: 'Create New Application', icon: Rocket, color: 'text-indigo-600 bg-indigo-50' },
                  { id: 'use-template', label: 'Start from Production Template', icon: Layers, color: 'text-sky-600 bg-sky-50' },
                  { id: 'open-ide', label: 'Launch Code Workspace IDE', icon: Code2, color: 'text-emerald-600 bg-emerald-50' },
                  { id: 'ai-assistant', label: 'Ask AI Development Assistant', icon: Sparkles, color: 'text-purple-600 bg-purple-50' },
                  { id: 'deploy-center', label: 'Open Deployment Center', icon: Cpu, color: 'text-blue-600 bg-blue-50' },
                  { id: 'public-events', label: 'Go to CSE Events Portal', icon: Calendar, color: 'text-amber-600 bg-amber-50' },
                ].map(cmd => (
                  <button
                    key={`cmd-${cmd.id}`}
                    onClick={() => {
                      onSelectAction(cmd.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${cmd.color} flex items-center justify-center flex-shrink-0`}>
                        <cmd.icon size={15} />
                      </div>
                      <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {cmd.label}
                      </span>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Applications / Projects Search Results */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
                Applications ({filteredProjects.length})
              </div>
              <div className="space-y-1">
                {filteredProjects.map(proj => (
                  <button
                    key={`search-proj-${proj.id}`}
                    onClick={() => {
                      onSelectAction('view-proj', proj);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
                        <FolderGit2 size={15} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                          {proj.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {proj.techStack.join(' • ')}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                      {proj.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Templates Search Results */}
          {filteredTemplates.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
                Templates ({filteredTemplates.length})
              </div>
              <div className="space-y-1">
                {filteredTemplates.map(tpl => (
                  <button
                    key={`search-tpl-${tpl.id}`}
                    onClick={() => {
                      onSelectAction('use-tpl', tpl);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Layers size={15} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {tpl.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {tpl.category}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-indigo-600 font-bold group-hover:underline">
                      Use Template →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with ↑ ↓ arrows</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
}
