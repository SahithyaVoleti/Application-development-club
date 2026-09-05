'use client';
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface Props {
  code: string;
}

export default function CopyCodeButton({ code }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono font-semibold transition-all border border-slate-700 cursor-pointer"
      title="Copy Code to Clipboard"
    >
      {copied ? (
        <>
          <Check size={13} className="text-emerald-400" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={13} />
          <span>Copy Code</span>
        </>
      )}
    </button>
  );
}
