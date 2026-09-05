'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import PublicNavbar from '../public-home-page/components/PublicNavbar';
import PublicFooter from '../public-home-page/components/PublicFooter';
import {
  Search,
  BookOpen,
  GraduationCap,
  FileCode,
  Server,
  Network,
  Cloud,
  ArrowRight,
  X,
  Filter,
} from 'lucide-react';
import {
  RESOURCE_CATEGORIES,
  DOCUMENTATION_ITEMS,
  TUTORIAL_ITEMS,
  DEV_GUIDE_ITEMS,
  API_RESOURCE_ITEMS,
  ARCHITECTURE_ITEMS,
  DEPLOYMENT_ITEMS,
} from '@/lib/resourcesData';

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  GraduationCap,
  FileCode,
  Server,
  Network,
  Cloud,
};

const CATEGORIES_FILTER = [
  'All',
  'Documentation',
  'Tutorials',
  'Development',
  'API',
  'Architecture',
  'Deployment',
];

export default function ResourcesIndexPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter items across all categories
  const allResourceCards = [
    ...DOCUMENTATION_ITEMS.map(doc => ({
      title: doc.title,
      desc: doc.description,
      category: 'Documentation',
      href: `/resources/documentation/${doc.slug}`,
      icon: BookOpen,
      tag: doc.category,
    })),
    ...TUTORIAL_ITEMS.map(tut => ({
      title: tut.title,
      desc: tut.description,
      category: 'Tutorials',
      href: `/resources/tutorials/${tut.slug}`,
      icon: GraduationCap,
      tag: `${tut.difficulty} · ${tut.time}`,
    })),
    ...DEV_GUIDE_ITEMS.map(guide => ({
      title: guide.title,
      desc: guide.description,
      category: 'Development',
      href: `/resources/development-guides/${guide.slug}`,
      icon: FileCode,
      tag: 'Best Practices',
    })),
    ...API_RESOURCE_ITEMS.map(api => ({
      title: `${api.method} ${api.endpoint}`,
      desc: api.description,
      category: 'API',
      href: `/resources/api/${api.slug}`,
      icon: Server,
      tag: api.title,
    })),
    ...ARCHITECTURE_ITEMS.map(arch => ({
      title: arch.title,
      desc: arch.description,
      category: 'Architecture',
      href: `/resources/architecture/${arch.slug}`,
      icon: Network,
      tag: 'System Design',
    })),
    ...DEPLOYMENT_ITEMS.map(dep => ({
      title: dep.title,
      desc: dep.description,
      category: 'Deployment',
      href: `/resources/deployment/${dep.slug}`,
      icon: Cloud,
      tag: 'DevOps',
    })),
  ];

  const filteredCards = allResourceCards.filter(item => {
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-28 pb-20">
        {/* Hero Header */}
        <div className="bg-gradient-to-b from-white to-slate-100/60 border-b border-slate-200/80 py-12 px-6 lg:px-10 mb-12">
          <div className="max-w-screen-xl mx-auto text-center">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block mb-3">
              APPLICATION DEVELOPMENT HUB
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Developer Resources & Documentation
            </h1>
            <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed mb-8">
              Explore guides, step-by-step tutorials, interactive API references, architecture blueprints, and production deployment workflows.
            </p>

            {/* Section 9: Instant Search Input */}
            <div className="max-w-2xl mx-auto relative mb-6">
              <div className="relative flex items-center">
                <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources, tutorials, APIs, architecture guides..."
                  className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-md transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Section 10: Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
                <Filter size={13} /> Categories:
              </span>
              {CATEGORIES_FILTER.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={`cat-${cat}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Categories Section Grid */}
        {!searchQuery && selectedCategory === 'All' && (
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 mb-16">
            <h2 className="text-xl font-extrabold text-slate-900 mb-6">Resource Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RESOURCE_CATEGORIES.map((cat) => {
                const Icon = ICON_MAP[cat.iconName] || BookOpen;
                return (
                  <Link
                    key={`main-cat-${cat.id}`}
                    href={cat.href}
                    className="group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-card-hover hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon size={20} />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {cat.itemCount} Items
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-6">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                      <span>Explore Category</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Filtered Resources List */}
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              {selectedCategory === 'All' && !searchQuery ? 'All Resources' : `Results (${filteredCards.length})`}
            </h2>
            {searchQuery && (
              <span className="text-xs font-semibold text-slate-500">
                Showing results for &quot;{searchQuery}&quot;
              </span>
            )}
          </div>

          {filteredCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={`res-card-${idx}`}
                    href={item.href}
                    className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-card-hover hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Icon size={16} />
                          </div>
                          <span className="text-xs font-mono font-bold text-blue-600">
                            {item.category}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {item.tag}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                      <span>Read Guide</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* No Results Found State */
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <Search size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No resources found</h3>
              <p className="text-xs text-slate-500 mb-6">
                We couldn&apos;t find any resources matching &quot;{searchQuery}&quot; in {selectedCategory}. Try clearing your search or category filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
