'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Sparkles,
  X,
  Send,
  Code2,
  Cpu,
  CheckCircle2,
  Copy,
  Zap,
  Wand2,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistantModal({ isOpen, onClose }: Props) {
  const [prompt, setPrompt] = useState('');
  const [activeAction, setActiveAction] = useState('Generate Component');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const AI_ACTIONS = [
    'Generate Application',
    'Generate Component',
    'Fix Code',
    'Explain Code',
    'Optimize Code',
    'Generate API',
    'Generate Tests',
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setGeneratedResult(null);

    await new Promise(r => setTimeout(r, 1200));
    setIsGenerating(false);

    let result = '';
    if (activeAction === 'Generate Component') {
      result = `// AI-Generated React Component for Application Development Hub
import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function AIStatsWidget() {
  const [count, setCount] = useState(42);

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-2">
        <Sparkles size={16} /> AI Real-time Analytics
      </div>
      <div className="text-3xl font-extrabold text-slate-900">{count} Active Models</div>
      <p className="text-xs text-slate-500 mt-1">Automated optimization engine running.</p>
    </div>
  );
}`;
    } else if (activeAction === 'Generate API') {
      result = `# AI-Generated FastAPI Endpoint
from fastapi import FastAPI, Depends
from pydantic import BaseModel

app = FastAPI()

class CodeAnalysisRequest(BaseModel):
    source_code: str
    target_lang: str = "python"

@app.post("/api/v2/ai/analyze-code")
async def analyze_code(req: CodeAnalysisRequest):
    return {
        "status": "success",
        "quality_score": 98.4,
        "recommendations": [
            "Use async/await for I/O bound database queries",
            "Added response type hinting for static analysis"
        ]
    }`;
    } else if (activeAction === 'Fix Code') {
      result = `// AI Code Fix Applied
- const data = fetch('/api/projects'); // Error: Unhandled promise rejection
+ const response = await fetch('/api/projects');
+ if (!response.ok) throw new Error('API fetch failed');
+ const data = await response.json();`;
    } else {
      result = `// AI Assistant Output for [${activeAction}]
/**
 * Generated production-ready implementation
 * Tech Stack: React 19, FastAPI, TypeScript 5.0
 * Security Audit: Passed 100% (No OWASP vulnerabilities)
 */
export async function executeAIWorkflow() {
  return { status: "OK", timestamp: Date.now() };
}`;
    }

    setGeneratedResult(result);
    toast.success(`AI Response generated for ${activeAction}!`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay bg-slate-900/40 backdrop-blur-xs"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-gradient-to-b from-white via-slate-50 to-indigo-50/30 rounded-2xl shadow-2xl border border-indigo-100 w-full max-w-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-indigo-100/80 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">AI Development Assistant</h3>
              <p className="text-xs text-slate-500">Build faster with intelligent assistance throughout your workflow</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Action Chips */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Select AI Capability
            </label>
            <div className="flex flex-wrap gap-2">
              {AI_ACTIONS.map(action => (
                <button
                  key={`ai-act-${action}`}
                  onClick={() => {
                    setActiveAction(action);
                    setGeneratedResult(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    activeAction === action
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <form onSubmit={handleGenerate} className="space-y-3">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={3}
                placeholder={`Describe what you want to ${activeAction.toLowerCase()} (e.g. "Create a high-performance React table with sorting & filtering")...`}
                className="w-full bg-white border border-slate-200 rounded-xl p-3.5 pr-12 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all resize-none shadow-2xs font-medium"
              />
              <button
                type="submit"
                disabled={isGenerating}
                className="absolute right-3 bottom-4 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-xs"
              >
                <Send size={15} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white font-bold text-xs shadow-md hover:from-indigo-500 hover:to-blue-500 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Intelligence…
                </>
              ) : (
                <>
                  <Wand2 size={15} />
                  Run AI {activeAction}
                </>
              )}
            </button>
          </form>

          {/* AI Result View */}
          {generatedResult && (
            <div className="bg-slate-900 text-slate-200 rounded-xl p-4 border border-slate-800 font-mono text-xs overflow-x-auto relative group">
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-2 mb-2">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> AI Output ({activeAction})
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedResult);
                    toast.success('AI code copied to clipboard!');
                  }}
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded"
                >
                  <Copy size={10} /> Copy Code
                </button>
              </div>
              <pre className="text-slate-200 whitespace-pre-wrap">{generatedResult}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
