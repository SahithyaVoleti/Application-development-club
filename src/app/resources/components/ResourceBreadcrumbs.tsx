'use client';
import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowLeft, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
}

export default function ResourceBreadcrumbs({ items, backHref = '/resources', backLabel = 'Back to Resources' }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      {/* Home & Back Buttons */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs transition-colors shadow-2xs cursor-pointer"
          title="Return to Public Home Page"
        >
          <Home size={14} />
          <span>Home</span>
        </Link>

        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors group px-2 py-1"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>{backLabel}</span>
        </Link>
      </div>

      {/* Breadcrumb Trail */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-blue-600 transition-colors font-bold text-slate-700 flex items-center gap-1">
          <Home size={12} />
          <span>Home</span>
        </Link>
        <ChevronRight size={13} className="text-slate-400" />
        <Link href="/resources" className="hover:text-blue-600 transition-colors">
          Resources
        </Link>
        {items.map((item, idx) => (
          <React.Fragment key={`bc-${idx}`}>
            <ChevronRight size={13} className="text-slate-400" />
            {item.href ? (
              <Link href={item.href} className="hover:text-blue-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
}
