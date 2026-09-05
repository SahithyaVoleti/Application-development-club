'use client';
import React from 'react';
import { toast } from 'sonner';
import { X, Cpu, Terminal, CheckCircle2, RotateCcw, Play, ArrowUpRight } from 'lucide-react';
import type { DeploymentLog } from '@/lib/workspaceData';

interface Props {
  isOpen: boolean;
  logItem: DeploymentLog | null;
  onClose: () => void;
}

export default function DeploymentLogsModal({ isOpen, logItem, onClose }: Props) {
  if (!isOpen || !logItem) return null;

  const handleRollback = () => {
    toast.success(`Rolled back ${logItem.appName} to previous stable commit!`, {
      description: 'Environment target restored to commit #4e19b',
    });
    onClose();
  };

  const handleReDeploy = () => {
    toast.success(`Triggered fresh build for ${logItem.appName}!`, {
      description: 'Build queued on deployment worker cluster #3',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay bg-slate-900/40 backdrop-blur-xs"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 text-slate-200 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
              <Cpu size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">{logItem.appName}</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {logItem.environment} ● {logItem.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{logItem.version} · {logItem.timestamp}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Live Build Logs Output Container */}
        <div className="p-5 space-y-4">
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 h-64 overflow-y-auto space-y-1.5 shadow-inner">
            <div className="text-slate-500 text-[11px] mb-2">[00:00:01] Initiating build workflow for commit {logItem.version}...</div>
            <div>[00:00:03] Cloning repository branch main from GitHub...</div>
            <div>[00:00:07] Installing dependencies via pnpm (500 packages cached)...</div>
            <div>[00:00:14] Running type-check and linter validation (0 errors)...</div>
            <div>[00:00:22] Compiling Next.js 15 production server bundle...</div>
            <div>[00:00:30] Optimized static pages generated successfully (100% routes).</div>
            <div>[00:00:35] Containerizing Docker image v2.4.0 (size: 142MB)...</div>
            <div>[00:00:38] Pushing image to Vignan Cloud Container Registry...</div>
            <div className="text-emerald-400 font-bold">[00:00:40] ✓ Health check HTTP 200 OK — Deployed successfully!</div>
            <div className="text-sky-300 font-mono">[00:00:41] Live URL: https://ai-interview-hub.vignan.dev</div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handleRollback}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
            >
              <RotateCcw size={13} className="text-amber-400" />
              Rollback to Previous Release
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReDeploy}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-xs"
              >
                <Play size={13} />
                Re-Deploy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
