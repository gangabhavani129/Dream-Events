'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Sparkles, X, SlidersHorizontal, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import DecorationCard from '@/components/DecorationCard';
import { dataStore, subscribeToDataChanges } from '@/lib/data-store';
import { Decoration, Category, BusinessSettings } from '@/lib/types';

function DecorationsContent() {
  const searchParams = useSearchParams();
  const initialCatParam = searchParams.get('category') || 'all';

  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCatParam);
  const [sortBy, setSortBy] = useState<'default' | 'price_low' | 'price_high'>('default');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [allDecs, allCats, st] = await Promise.all([
        dataStore.getDecorations({ activeOnly: true }),
        dataStore.getCategories(true),
        dataStore.getBusinessSettings()
      ]);
      setDecorations(allDecs);
      setCategories(allCats);
      setSettings(st);
    } catch (e) {
      console.error('Error fetching catalog:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToDataChanges(loadData);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (initialCatParam) {
      setSelectedCategory(initialCatParam);
    }
  }, [initialCatParam]);

  // Client-side filtering & sorting
  const filteredDecorations = decorations.filter((dec) => {
    if (selectedCategory !== 'all' && dec.category_id !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const inName = dec.name.toLowerCase().includes(q);
      const inCat = (dec.category_name || '').toLowerCase().includes(q);
      const inDesc = dec.description.toLowerCase().includes(q);
      const inItems = (dec.included_items || []).some((item) => item.toLowerCase().includes(q));
      if (!inName && !inCat && !inDesc && !inItems) return false;
    }
    return true;
  });

  const sortedDecorations = [...filteredDecorations].sort((a, b) => {
    if (sortBy === 'price_low') return a.min_price - b.min_price;
    if (sortBy === 'price_high') return b.min_price - a.min_price;
    return 0;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('default');
  };

  const waNum = settings?.whatsapp || '+91 98765 43210';

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Page Header */}
        <div className="mb-8 space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Complete Event Catalog</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-stone-900">
            Explore Decoration Designs & Prices
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-2xl">
            Browse through our authentic wedding stages, floral mandaps, Haldi & Mehendi backdrops, and birthday themes with transparent price ranges.
          </p>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Box */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search designs: "rose", "pink stage", "haldi", "mandap", "birthday"...'
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm outline-none placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full md:w-auto px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-700 outline-none"
              >
                <option value="default">Featured / Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>

              {(searchQuery || selectedCategory !== 'all' || sortBy !== 'default') && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-rose-600 hover:bg-stone-50 text-xs font-semibold shrink-0"
                  title="Reset all filters"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-amber-100 hover:text-amber-900'
              }`}
            >
              All Designs ({decorations.length})
            </button>

            {categories.map((cat) => {
              const count = decorations.filter((d) => d.category_id === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-amber-600 text-white font-bold shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-amber-100 hover:text-amber-900'
                  }`}
                >
                  {cat.name} {count > 0 && <span className="opacity-75 font-mono text-[10px]">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Count Bar */}
        <div className="flex items-center justify-between mb-6 text-xs text-stone-500">
          <span>
            Showing <strong className="text-stone-800 font-bold">{sortedDecorations.length}</strong> decoration designs
          </span>
          {selectedCategory !== 'all' && (
            <span className="text-amber-700 font-semibold">
              Filtered by: {categories.find((c) => c.id === selectedCategory)?.name}
            </span>
          )}
        </div>

        {/* Decoration Grid */}
        {sortedDecorations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sortedDecorations.map((dec) => (
              <DecorationCard
                key={dec.id}
                decoration={dec}
                whatsappNumber={waNum}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm space-y-4 max-w-lg mx-auto my-12">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-stone-900">
              No matching decorations found
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              We couldn&apos;t find any decorations matching your search. Try resetting filters or request a custom setup tailored for you.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold"
              >
                Reset Filters
              </button>
              <a
                href="/custom-request"
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold hover:bg-stone-200"
              >
                Request Custom Design
              </a>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileBottomNav />
      <WhatsAppFloatingButton />
    </div>
  );
}

export default function DecorationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">Loading decorations catalog...</div>}>
      <DecorationsContent />
    </Suspense>
  );
}
