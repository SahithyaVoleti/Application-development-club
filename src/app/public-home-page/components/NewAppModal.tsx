'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { X, Rocket, FolderGit2, Layers, CheckCircle2, Terminal, Sparkles } from 'lucide-react';
import { APP_TEMPLATES } from '@/lib/workspaceData';

interface Props {
  isOpen: boolean;
  mode?: 'create' | 'import' | 'template';
  initialTemplate?: any;
  onClose: () => void;
  onCreated: (newProj: any) => void;
}

export default function NewAppModal({ isOpen, mode = 'create', initialTemplate, onClose, onCreated }: Props) {
  const [appName, setAppName] = useState(initialTemplate ? `${initialTemplate.name} App` : '');
  const [description, setDescription] = useState(initialTemplate ? initialTemplate.description : '');
  const [selectedTech, setSelectedTech] = useState<string[]>(
    initialTemplate ? initialTemplate.techStack : ['React', 'Next.js', 'FastAPI']
  );
  const [selectedEnv, setSelectedEnv] = useState('Production');
  const [gitUrl, setGitUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const TECH_OPTIONS = ['React', 'Next.js', 'FastAPI', 'Node.js', 'Python', 'Java', 'PostgreSQL', 'MongoDB', 'Docker'];

  const toggleTech = (tech: string) => {
    setSelectedTech(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim()) {
      toast.error('Please enter an application name');
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 900));

    const newProject = {
      id: `proj-${Date.now()}`,
      name: appName,
      description: description || 'New application workspace created in Application Development Hub.',
      techStack: selectedTech.length > 0 ? selectedTech : ['React', 'FastAPI'],
      status: selectedEnv === 'Production' ? 'Production' : 'Development',
      statusColor: selectedEnv === 'Production' ? 'emerald' : 'blue',
      lastUpdated: 'Just now',
      deployUrl: `https://${appName.toLowerCase().replace(/\s+/g, '-')}.vignan.dev`,
      repoUrl: gitUrl || `https://github.com/vignan-cse/${appName.toLowerCase().replace(/\s+/g, '-')}`,
      stars: 1,
      commits: 1,
    };

    onCreated(newProject);
    setIsSubmitting(false);
    onClose();

    toast.success('Application Created Successfully!', {
      description: `${appName} initialized with ${newProject.techStack.join(', ')} stack.`,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay bg-slate-900/40 backdrop-blur-xs"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              {mode === 'import' ? <FolderGit2 size={20} /> : <Rocket size={20} />}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {mode === 'import' ? 'Import Existing Project' : initialTemplate ? `Start with ${initialTemplate.name}` : 'Create New Application'}
              </h3>
              <p className="text-xs text-slate-500">Configure your workspace settings and technical stack</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Application Name *
            </label>
            <input
              type="text"
              value={appName}
              onChange={e => setAppName(e.target.value)}
              placeholder="e.g. AI Interview Simulator 2.0"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              required
            />
          </div>

          {mode === 'import' && (
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Git Repository URL *
              </label>
              <input
                type="text"
                value={gitUrl}
                onChange={e => setGitUrl(e.target.value)}
                placeholder="https://github.com/vignan-cse/my-awesome-app.git"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief overview of application purpose and architectural requirements..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Technology Stack
            </label>
            <div className="flex flex-wrap gap-2">
              {TECH_OPTIONS.map(tech => {
                const isSelected = selectedTech.includes(tech);
                return (
                  <button
                    key={`tech-opt-${tech}`}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-300 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {tech}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Initial Deployment Target
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'Production', title: 'Production Environment', desc: 'Auto-deploy to live cluster' },
                { id: 'Development', title: 'Development Sandbox', desc: 'Staging preview deployment' },
              ].map(env => (
                <button
                  key={`env-${env.id}`}
                  type="button"
                  onClick={() => setSelectedEnv(env.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedEnv === env.id
                      ? 'bg-sky-50/70 border-sky-300 text-sky-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold">{env.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{env.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Initializing Workspace…
                </>
              ) : (
                <>
                  <Rocket size={14} />
                  {mode === 'import' ? 'Import & Build' : 'Create Application'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
