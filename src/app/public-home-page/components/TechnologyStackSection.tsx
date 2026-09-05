'use client';
import React, { useState } from 'react';
import {
  Globe,
  Server,
  Database,
  Cloud,
  Sparkles,
  CheckCircle2,
  Boxes,
} from 'lucide-react';

interface TechItem {
  name: string;
  category: string;
  desc: string;
  level: string;
  badgeColor: string;
}

const TECH_CATEGORIES = [
  { id: 'all', label: 'All Technologies', icon: Boxes },
  { id: 'frontend', label: 'Frontend', icon: Globe },
  { id: 'backend', label: 'Backend', icon: Server },
  { id: 'database', label: 'Database', icon: Database },
  { id: 'cloud', label: 'Cloud & DevOps', icon: Cloud },
  { id: 'ai', label: 'AI & APIs', icon: Sparkles },
];

const TECH_STACK: TechItem[] = [
  // Frontend
  { name: 'React', category: 'frontend', desc: 'Component-driven UI library for building interactive applications.', level: 'Production Core', badgeColor: 'bg-sky-50 text-sky-700 border-sky-200' },
  { name: 'Next.js 15', category: 'frontend', desc: 'React framework for server-rendered & static production web applications.', level: 'Production Core', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' },
  { name: 'TypeScript', category: 'frontend', desc: 'Typed superset of JavaScript enhancing code safety and refactoring.', level: 'Production Core', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'JavaScript', category: 'frontend', desc: 'Dynamic web programming language powering frontends and runtimes.', level: 'Core Standard', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { name: 'HTML5', category: 'frontend', desc: 'Semantic markup standard for structured document layout and accessibility.', level: 'Standard', badgeColor: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'Tailwind CSS', category: 'frontend', desc: 'Utility-first CSS framework for custom responsive user interfaces.', level: 'Production Core', badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200' },

  // Backend
  { name: 'Node.js', category: 'backend', desc: 'Event-driven asynchronous JavaScript runtime built on Chrome V8.', level: 'Production Core', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'Python', category: 'backend', desc: 'High-level language for backend services, data analysis, and AI.', level: 'Production Core', badgeColor: 'bg-blue-50 text-blue-800 border-blue-200' },
  { name: 'FastAPI', category: 'backend', desc: 'High-performance Python web framework for asynchronous APIs.', level: 'High Speed API', badgeColor: 'bg-teal-50 text-teal-700 border-teal-200' },
  { name: 'Java', category: 'backend', desc: 'Robust object-oriented platform for enterprise-grade backend systems.', level: 'Enterprise', badgeColor: 'bg-rose-50 text-rose-700 border-rose-200' },
  { name: 'PHP', category: 'backend', desc: 'Popular server-side scripting language for web backend applications.', level: 'Legacy & Web', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },

  // Database
  { name: 'PostgreSQL', category: 'database', desc: 'Advanced open-source relational database with strong ACID guarantees.', level: 'Primary DB', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'MySQL', category: 'database', desc: 'Proven relational database management system for web applications.', level: 'Relational', badgeColor: 'bg-sky-50 text-sky-700 border-sky-200' },
  { name: 'MongoDB', category: 'database', desc: 'Document-oriented NoSQL database for flexible JSON data schemas.', level: 'Document DB', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'Redis', category: 'database', desc: 'In-memory data structure store used for caching, queues, and sessions.', level: 'Cache & Pub/Sub', badgeColor: 'bg-red-50 text-red-700 border-red-200' },

  // Cloud & DevOps
  { name: 'AWS', category: 'cloud', desc: 'Comprehensive cloud platform for hosting, computing, and storage.', level: 'Cloud Host', badgeColor: 'bg-amber-50 text-amber-800 border-amber-200' },
  { name: 'Google Cloud', category: 'cloud', desc: 'Enterprise cloud infrastructure for analytics, AI, and containers.', level: 'Cloud Host', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Azure', category: 'cloud', desc: 'Microsoft cloud service for enterprise application deployment.', level: 'Enterprise Cloud', badgeColor: 'bg-sky-50 text-sky-800 border-sky-200' },
  { name: 'Docker', category: 'cloud', desc: 'Containerization technology for lightweight, reproducible app environments.', level: 'Containers', badgeColor: 'bg-blue-50 text-blue-600 border-blue-200' },
  { name: 'GitHub Actions', category: 'cloud', desc: 'Automated CI/CD workflows for building, testing, and deployment.', level: 'CI/CD Pipeline', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },

  // AI & APIs
  { name: 'Gemini AI', category: 'ai', desc: 'Google Multimodal AI model family for reasoning, code, and vision.', level: 'LLM & Agent', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { name: 'Groq', category: 'ai', desc: 'Ultra-fast LPU inference engine for low-latency AI applications.', level: 'Fast Inference', badgeColor: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'OpenAI', category: 'ai', desc: 'Generative AI models powering intelligent chat, embeddings, and code.', level: 'AI Intelligence', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { name: 'REST APIs', category: 'ai', desc: 'Standardized RESTful HTTP endpoints with OpenAPI schemas.', level: 'Integration', badgeColor: 'bg-slate-100 text-slate-700 border-slate-200' },
];

export default function TechnologyStackSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredStack = activeCategory === 'all'
    ? TECH_STACK
    : TECH_STACK.filter(item => item.category === activeCategory);

  return (
    <section id="technologies" className="py-24 bg-white border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 scroll-reveal">
          <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block mb-3">
            TECHNICAL ARCHITECTURE & TOOLING
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Technology Stack
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Curated, industry-standard languages, frameworks, databases, cloud services, and AI platforms used across the Application Development Hub.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 scroll-reveal delay-100">
          {TECH_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={`cat-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tech Grid (Section 15: scale 1.02, icon scale 1.08) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredStack.map((tech, idx) => (
            <div
              key={`tech-${tech.name}-${idx}`}
              className={`scroll-reveal group relative p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:bg-white hover:shadow-card-hover hover:border-blue-300 cursor-pointer flex flex-col justify-between delay-${((idx % 4) + 1) * 100}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {tech.name}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${tech.badgeColor}`}>
                    {tech.level}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {tech.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                <CheckCircle2 size={13} className="text-blue-500 transition-transform duration-300 group-hover:scale-110" />
                <span>Verified in production</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
