'use client';
import React from 'react';
import Link from 'next/link';
import { Cpu, ArrowUpRight, Globe, Share2, Code } from 'lucide-react';

export default function PublicFooter() {
  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/vignan-logo.png"
                alt="Vignan's Foundation for Science, Technology & Research Logo"
                className="h-10 w-auto object-contain bg-white px-2 py-1 rounded-lg border border-slate-700 shadow-sm"
              />
              <div>
                <span className="font-extrabold text-white text-base block tracking-tight">
                  Application Development Club
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Dept. of CSE · Vignan University
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              The official campus club for designing, engineering, testing, and deploying modern web, mobile, and AI applications.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="https://vignan.ac.in" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors">
                <Globe size={15} />
              </a>
              <a href="https://vignan.ac.in" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors">
                <Code size={15} />
              </a>
              <a href="https://vignan.ac.in" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors">
                <Share2 size={15} />
              </a>
            </div>
          </div>

          {/* Column 2: DEVELOPMENT */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-bold text-white uppercase tracking-wider">
              DEVELOPMENT
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleScrollTo('#capabilities')} className="hover:text-white transition-colors cursor-pointer">Web Development</button></li>
              <li><button onClick={() => handleScrollTo('#capabilities')} className="hover:text-white transition-colors cursor-pointer">Mobile Development</button></li>
              <li><button onClick={() => handleScrollTo('#capabilities')} className="hover:text-white transition-colors cursor-pointer">Backend & APIs</button></li>
              <li><button onClick={() => handleScrollTo('#capabilities')} className="hover:text-white transition-colors cursor-pointer">Cloud & DevOps</button></li>
              <li><button onClick={() => handleScrollTo('#capabilities')} className="hover:text-white transition-colors cursor-pointer">AI & ML Applications</button></li>
            </ul>
          </div>

          {/* Column 3: PLATFORM HIGHLIGHTS */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-bold text-white uppercase tracking-wider">
              PLATFORM HIGHLIGHTS
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleScrollTo('#images-gallery')} className="hover:text-white transition-colors cursor-pointer">Event Gallery</button></li>
              <li><button onClick={() => handleScrollTo('#events')} className="hover:text-white transition-colors cursor-pointer">Upcoming Hackathons</button></li>
              <li><button onClick={() => handleScrollTo('#leaderboard')} className="hover:text-white transition-colors cursor-pointer">Student Leaderboard</button></li>
              <li><button onClick={() => handleScrollTo('#certificates')} className="hover:text-white transition-colors cursor-pointer">Certificates</button></li>
              <li><button onClick={() => handleScrollTo('#capabilities')} className="hover:text-white transition-colors cursor-pointer">Tech Capabilities</button></li>
              <li><button onClick={() => handleScrollTo('#about-hub')} className="hover:text-white transition-colors cursor-pointer">About Department</button></li>
            </ul>
          </div>

          {/* Column 4: QUICK ACCESS & ADMIN */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-bold text-white uppercase tracking-wider">
              QUICK ACCESS
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleScrollTo('#images-gallery')} className="hover:text-white transition-colors cursor-pointer text-blue-400 font-bold">Media Gallery</button></li>
              <li><button onClick={() => handleScrollTo('#home')} className="hover:text-white transition-colors cursor-pointer">About Us</button></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span></li>
              <li className="pt-2">
                <Link href="/admin-dashboard" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold">
                  <span>Admin Dashboard</span>
                  <ArrowUpRight size={12} />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-400 gap-4">
          <p>© 2026 Application Development Club. All rights reserved.</p>
          <p className="font-mono text-[11px]">Dept. of Computer Science & Engineering · Vignan University</p>
        </div>
      </div>
    </footer>
  );
}