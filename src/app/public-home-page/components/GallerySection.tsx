'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import AppImage from '@/components/ui/AppImage';
import galleryItems from '@/lib/galleryData.json';
import { toast } from 'sonner';
import {
  Camera,
  Search,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Grid,
  Tag,
  Calendar,
  Image as ImageIcon,
  Shuffle,
  Play,
  Pause,
  Sparkles,
} from 'lucide-react';

export interface GalleryItem {
  id: string;
  title: string;
  originalName: string;
  fileName: string;
  url: string;
  category: string;
  tag: string;
  date: string;
  description: string;
}

const CATEGORIES = [
  'All',
  'Hackathons',
  'Workshops',
  'Project Demos',
  'Coding Competitions',
  'Ceremonies & Awards',
];

const INITIAL_VISIBLE_COUNT = 16;
const BATCH_SIZE = 16;

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE_COUNT);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Auto Shuffling State
  const [isAutoShuffling, setIsAutoShuffling] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [shuffleVersion, setShuffleVersion] = useState<number>(0);

  // Base filtered images
  const baseFilteredImages = useMemo(() => {
    const raw = (galleryItems as GalleryItem[]).filter(item => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    const map = new Map<string, GalleryItem>();
    for (const item of raw) {
      if (!map.has(item.url)) {
        map.set(item.url, item);
      }
    }
    return Array.from(map.values());
  }, [selectedCategory, searchQuery]);

  // Shuffled images array recalculated when shuffleVersion increments
  const filteredImages = useMemo(() => {
    if (shuffleVersion === 0) return baseFilteredImages;
    return shuffleArray(baseFilteredImages);
  }, [baseFilteredImages, shuffleVersion]);

  // Auto-shuffle timer loop (shuffles every 3.5 seconds)
  useEffect(() => {
    if (!isAutoShuffling || isHovered || activeImageIndex !== null) return;

    const timer = setInterval(() => {
      setShuffleVersion(prev => prev + 1);
    }, 3500);

    return () => clearInterval(timer);
  }, [isAutoShuffling, isHovered, activeImageIndex]);

  // Reset visible count when filter or search changes
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    setShuffleVersion(0);
  }, [selectedCategory, searchQuery]);

  const visibleImages = useMemo(() => {
    return filteredImages.slice(0, visibleCount);
  }, [filteredImages, visibleCount]);

  const handleManualShuffle = () => {
    setShuffleVersion(prev => prev + 1);
    toast.success('Shuffled gallery photos! 🔀');
  };

  // Lightbox keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === 'Escape') {
        setActiveImageIndex(null);
        setIsZoomed(false);
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex(prev =>
          prev !== null ? (prev + 1) % filteredImages.length : 0
        );
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex(prev =>
          prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : 0
        );
      }
    },
    [activeImageIndex, filteredImages.length]
  );

  useEffect(() => {
    if (activeImageIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activeImageIndex, handleKeyDown]);

  const activeImage =
    activeImageIndex !== null ? filteredImages[activeImageIndex] : null;

  const handleNextImage = () => {
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex + 1) % filteredImages.length);
      setIsZoomed(false);
    }
  };

  const handlePrevImage = () => {
    if (activeImageIndex !== null) {
      setActiveImageIndex(
        (activeImageIndex - 1 + filteredImages.length) % filteredImages.length
      );
      setIsZoomed(false);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + BATCH_SIZE, filteredImages.length));
  };

  const handleShowAll = () => {
    setVisibleCount(filteredImages.length);
  };

  return (
    <section
      id="images-gallery"
      className="py-16 sm:py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden border-t border-slate-800"
    >
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-4 backdrop-blur-md">
            <Camera size={14} className="text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
              Campus & Event Gallery
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Application Development Hub <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">Media Gallery</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Explore live photo captures from our campus hackathons, workshops, project expos, and student innovation milestones at the CSE Department.
          </p>
        </div>

        {/* Controls Bar: Filters, Auto-Shuffle & Search */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-8 backdrop-blur-md shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full lg:w-auto pb-2 lg:pb-0">
            {CATEGORIES.map(category => {
              const count =
                category === 'All'
                  ? galleryItems.length
                  : galleryItems.filter(img => img.category === category).length;
              const isActive = selectedCategory === category;
              return (
                <button
                  key={`cat-${category}`}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 border border-blue-400/40'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50'
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Auto-Shuffle Toggle, Manual Shuffle & Search */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end flex-wrap">
            {/* Auto-Shuffle Toggle */}
            <button
              onClick={() => setIsAutoShuffling(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isAutoShuffling
                  ? 'bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-500/25'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={isAutoShuffling ? 'Pause Auto-Shuffle' : 'Play Auto-Shuffle'}
            >
              {isAutoShuffling ? <Pause size={13} /> : <Play size={13} />}
              <span className="hidden sm:inline">{isAutoShuffling ? 'Auto-Shuffling 🔀' : 'Shuffle Paused'}</span>
            </button>

            {/* Manual Shuffle Button */}
            <button
              onClick={handleManualShuffle}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
              title="Shuffle Photo Order"
            >
              <Shuffle size={13} className="text-blue-400" />
              <span>Shuffle 🔀</span>
            </button>

            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial lg:w-56">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
              <ImageIcon size={14} className="text-blue-400" />
              <span>
                {filteredImages.length} Photos
              </span>
            </div>
          </div>
        </div>

        {/* Shuffling Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center my-8">
            <Camera size={40} className="text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">
              No photos found
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              No gallery images matched your current filter or search parameters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {visibleImages.map((image, index) => (
                <div
                  key={`gal-${image.id}-${shuffleVersion}`}
                  onClick={() => setActiveImageIndex(index)}
                  className="group relative bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:border-blue-500/50 transition-all duration-700 ease-in-out hover:-translate-y-1.5 flex flex-col animate-fadeIn"
                >
                  {/* Image Container */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                    <AppImage
                      src={image.url}
                      alt={image.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Category Pill Tag */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900/80 text-blue-300 border border-slate-700/60 backdrop-blur-md shadow-xs flex items-center gap-1">
                        <Sparkles size={10} className="text-sky-400" />
                        {image.category}
                      </span>
                    </div>

                    {/* Zoom Icon on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <div className="w-11 h-11 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 backdrop-blur-xs scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Maximize2 size={18} />
                      </div>
                    </div>

                    {/* Photo Number Counter */}
                    <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-950/80 text-slate-300 border border-slate-800">
                        #{image.id.replace('gal-', '')}
                      </span>
                    </div>
                  </div>

                  {/* Card Metadata Footer */}
                  <div className="p-4 bg-slate-900/90 border-t border-slate-800/80 flex flex-col flex-1 justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1 mb-1">
                        {image.title}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Tag size={11} className="text-indigo-400" />
                          {image.tag}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-slate-500">
                          <Calendar size={11} className="text-slate-500" />
                          {image.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More & Count Footer */}
            <div className="mt-12 flex flex-col items-center gap-4">
              <div className="text-xs font-medium text-slate-400">
                Showing <span className="text-white font-bold">{visibleImages.length}</span> of{' '}
                <span className="text-white font-bold">{filteredImages.length}</span> photos
              </div>

              {visibleImages.length < filteredImages.length && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Grid size={15} />
                    <span>Load More Photos (+{Math.min(BATCH_SIZE, filteredImages.length - visibleImages.length)})</span>
                  </button>

                  <button
                    onClick={handleShowAll}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    View All {filteredImages.length} Photos
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Lightbox Interactive Modal */}
      {activeImage && activeImageIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl animate-fadeIn p-4 sm:p-6 lg:p-10">
          {/* Top Controls Bar */}
          <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between text-white">
            <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 backdrop-blur-md">
              <Camera size={18} className="text-blue-400" />
              <div>
                <span className="text-xs font-bold block text-white">
                  {activeImage.title}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">
                  Photo {activeImageIndex + 1} of {filteredImages.length} · {activeImage.category}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={activeImage.url}
                download={activeImage.fileName}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                title="Download High-Res Photo"
              >
                <Download size={18} />
              </a>

              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isZoomed
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800'
                }`}
                title={isZoomed ? 'Zoom Out' : 'Zoom In'}
              >
                <Maximize2 size={18} />
              </button>

              <button
                onClick={() => {
                  setActiveImageIndex(null);
                  setIsZoomed(false);
                }}
                className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/30 transition-colors cursor-pointer ml-2"
                title="Close Lightbox (Esc)"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Left Arrow Navigation */}
          <button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-blue-600 border border-slate-700/80 text-white flex items-center justify-center shadow-2xl transition-all cursor-pointer hover:scale-110"
            title="Previous Photo (Left Arrow)"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow Navigation */}
          <button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-blue-600 border border-slate-700/80 text-white flex items-center justify-center shadow-2xl transition-all cursor-pointer hover:scale-110"
            title="Next Photo (Right Arrow)"
          >
            <ChevronRight size={24} />
          </button>

          {/* Center Main Preview Stage */}
          <div className="relative max-w-5xl max-h-[75vh] w-full h-full flex flex-col items-center justify-center">
            <div
              className={`relative transition-all duration-300 ${
                isZoomed
                  ? 'w-full h-full scale-125 cursor-zoom-out'
                  : 'max-w-4xl max-h-[65vh] w-full h-full cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <AppImage
                src={activeImage.url}
                alt={activeImage.title}
                fill
                sizes="100vw"
                className="object-contain rounded-2xl shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Bottom Thumbnails Strip & Info */}
          <div className="absolute bottom-4 left-4 right-4 z-50 flex flex-col items-center gap-3">
            {/* Tag & Metadata Bar */}
            <div className="flex items-center gap-3 text-xs bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl text-slate-300 backdrop-blur-md shadow-lg">
              <span className="flex items-center gap-1.5 font-bold text-blue-400">
                <Tag size={13} />
                {activeImage.tag}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">{activeImage.description}</span>
            </div>

            {/* Scrollable Thumbnail Bar */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-2xl px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md no-scrollbar">
              {filteredImages.map((img, i) => (
                <button
                  key={`thumb-${img.id}`}
                  onClick={() => {
                    setActiveImageIndex(i);
                    setIsZoomed(false);
                  }}
                  className={`relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                    i === activeImageIndex
                      ? 'border-blue-500 scale-110 shadow-md shadow-blue-500/50'
                      : 'border-slate-800 opacity-50 hover:opacity-100 hover:border-slate-600'
                  }`}
                >
                  <AppImage
                    src={img.url}
                    alt={img.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
