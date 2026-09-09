'use client';
import React from 'react';
import { Award, Lightbulb, Code2, Users, Sparkles, Terminal, BookOpen, Layers } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200 relative" id="about-hub">
      <div id="about" className="absolute -top-24 pointer-events-none" />
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Narrative Content */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 dark:bg-sky-950/70 border border-sky-300/50 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-bold uppercase tracking-widest mb-5">
              <Award size={14} className="text-sky-600 dark:text-sky-400" />
              <span>About Application Development Hub</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              Where CSE Students<br />
              <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                Build the Future of Technology
              </span>
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-5">
              The Application Development Hub (ADHub) is a premier technical initiative of the Department of Computer Science and Engineering at Vignan University. We host intensive hackathons, coding competitions, workshops, seminars, and developer sessions designed to turn academic concepts into real-world software solutions.
            </p>

            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-8">
              Since inception, ADHub has engaged over 2,500+ students across 25+ events, instilling a culture of innovation, teamwork, and continuous engineering excellence within the university ecosystem.
            </p>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-sky-50/60 dark:bg-slate-900/80 border border-sky-100 dark:border-slate-800">
              <div className="text-center">
                <div className="text-2xl font-black text-slate-900 dark:text-white font-tabular">25+</div>
                <div className="text-xs font-bold text-sky-600 dark:text-sky-400 mt-0.5">Events Hosted</div>
              </div>
              <div className="text-center border-x border-sky-200/60 dark:border-slate-800">
                <div className="text-2xl font-black text-slate-900 dark:text-white font-tabular">2,500+</div>
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">Students Trained</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-slate-900 dark:text-white font-tabular">15+</div>
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">Tech Domains</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Bento Visual Layout */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-5">
            {/* Main Featured Card */}
            <div className="col-span-2 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 rounded-3xl p-7 text-white shadow-xl shadow-sky-500/20 relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                <Lightbulb size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-extrabold mb-2 tracking-tight">Department Innovation Hub</h3>
              <p className="text-sky-100 text-sm leading-relaxed max-w-md">
                Empowering students to solve real campus and societal challenges through Agentic AI, Full Stack Development, and MLOps workflows.
              </p>
            </div>

            {/* Floating Bento Badge 1 */}
            <div className="bg-slate-900 dark:bg-slate-900/90 rounded-3xl p-6 text-white shadow-md border border-slate-800 transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3 text-cyan-400">
                <Terminal size={20} />
              </div>
              <h4 className="font-extrabold text-base mb-1">Hackathons</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                48H & 72H continuous building challenges with live mentors.
              </p>
            </div>

            {/* Floating Bento Badge 2 */}
            <div className="bg-sky-50 dark:bg-slate-900/80 border border-sky-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-sky-200/60 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 flex items-center justify-center mb-3">
                <BookOpen size={20} />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base mb-1">Workshops</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Hands-on sessions on modern tech stacks & cloud architectures.
              </p>
            </div>

            {/* Floating Bento Badge 3 */}
            <div className="bg-indigo-50 dark:bg-slate-900/80 border border-indigo-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-indigo-200/60 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-3">
                <Code2 size={20} />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base mb-1">Coding Contests</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Competitive programming storms & data structure challenges.
              </p>
            </div>

            {/* Floating Bento Badge 4 */}
            <div className="bg-emerald-50 dark:bg-slate-900/80 border border-emerald-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-200/60 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3">
                <Users size={20} />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base mb-1">Seminars & FDPs</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                National seminars co-sponsored by ANRF, IEEE & byteXL.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}