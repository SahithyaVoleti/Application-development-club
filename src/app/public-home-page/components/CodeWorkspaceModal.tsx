'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  X,
  Play,
  Bug,
  CheckSquare,
  GitCommit,
  Rocket,
  FileCode,
  Folder,
  Terminal,
  Copy,
  Sparkles,
} from 'lucide-react';
import { INITIAL_CODE_FILES } from '@/lib/workspaceData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CodeWorkspaceModal({ isOpen, onClose }: Props) {
  const [files, setFiles] = useState(INITIAL_CODE_FILES);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '$ appdevhub dev-server --port 4028',
    '✓ AppDevHub OS runtime ready [Next.js 15.0]',
    '✓ FastAPI backend connected on http://localhost:8000',
    '✓ Live HMR active and watching files...',
  ]);
  const [isRunning, setIsRunning] = useState(false);

  if (!isOpen) return null;

  const activeFile = files[selectedFileIndex];

  const handleRun = async () => {
    setIsRunning(true);
    setTerminalOutput(prev => [
      ...prev,
      `$ python ${activeFile.name}`,
      `Executing ${activeFile.path}...`,
    ]);

    await new Promise(r => setTimeout(r, 800));
    setIsRunning(false);
    setTerminalOutput(prev => [
      ...prev,
      `✓ Execution completed successfully (0 errors, exit code 0)`,
      `HTTP 200 OK — Process finished in 184ms`,
    ]);
    toast.success(`Executed ${activeFile.name} cleanly!`);
  };

  const handleTest = async () => {
    setTerminalOutput(prev => [
      ...prev,
      `$ vitest run src/tests/`,
      `✓ 14 unit tests passed (100% coverage)`,
    ]);
    toast.success('All 14 unit tests passed!');
  };

  const handleCommit = () => {
    setTerminalOutput(prev => [
      ...prev,
      `$ git commit -m "feat: update ${activeFile.name} execution logic"`,
      `[main 8f32a04] feat: update ${activeFile.name} execution logic`,
      `1 file changed, 12 insertions(+)`,
    ]);
    toast.success('Changes committed to Git repository!');
  };

  const handleDeploy = () => {
    setTerminalOutput(prev => [
      ...prev,
      `$ appdevhub deploy --env production`,
      `✓ Build #483 completed in 32s`,
      `✓ Deployed to https://ai-interview-hub.vignan.dev`,
    ]);
    toast.success('Deployed to Production environment!');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 modal-overlay bg-slate-900/50 backdrop-blur-xs"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-scaleIn text-slate-200">
        {/* Top IDE Toolbar Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-2">
              <FileCode size={14} className="text-sky-400" />
              {activeFile.path} — Application Development Hub Code Workspace
            </span>
          </div>

          {/* IDE Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-xs"
            >
              <Play size={12} />
              Run
            </button>
            <button
              onClick={handleTest}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors border border-slate-700"
            >
              <CheckSquare size={12} className="text-sky-400" />
              Test
            </button>
            <button
              onClick={handleCommit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors border border-slate-700"
            >
              <GitCommit size={12} className="text-purple-400" />
              Commit
            </button>
            <button
              onClick={handleDeploy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-xs"
            >
              <Rocket size={12} />
              Deploy
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Workspace Center Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-56 border-r border-slate-800 bg-slate-950 p-3 overflow-y-auto hidden sm:block flex-shrink-0">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Folder size={13} className="text-sky-400" /> Explorer
            </div>
            <div className="space-y-1">
              {files.map((file, idx) => (
                <button
                  key={`file-${file.name}`}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-left ${
                    selectedFileIndex === idx
                      ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <FileCode size={14} className={selectedFileIndex === idx ? 'text-sky-400' : 'text-slate-500'} />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Code Editor Panel */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            {/* Editor Code Area */}
            <div className="flex-1 p-4 font-mono text-xs sm:text-sm leading-relaxed overflow-auto bg-[#0b1329] text-slate-200 select-text">
              <pre className="text-slate-200">
                {activeFile.code.split('\n').map((line, i) => (
                  <div key={`line-${i}`} className="table-row">
                    <span className="table-cell text-right pr-4 text-slate-600 select-none text-[11px] w-8">
                      {i + 1}
                    </span>
                    <span className="table-cell font-mono">{line}</span>
                  </div>
                ))}
              </pre>
            </div>

            {/* Bottom Terminal Output Panel */}
            <div className="h-44 border-t border-slate-800 bg-slate-950 p-3 flex flex-col">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-b border-slate-900 pb-1.5 mb-2">
                <span className="flex items-center gap-1.5 font-mono">
                  <Terminal size={12} className="text-emerald-400" /> Output Terminal
                </span>
                <button
                  onClick={() => setTerminalOutput(['$ appdevhub dev-server --port 4028', 'Terminal cleared.'])}
                  className="text-[10px] text-slate-500 hover:text-slate-300"
                >
                  Clear Terminal
                </button>
              </div>
              <div className="flex-1 font-mono text-[11px] text-emerald-400/90 overflow-y-auto space-y-1">
                {terminalOutput.map((out, idx) => (
                  <div key={`term-${idx}`}>{out}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
