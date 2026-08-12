'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  X,
  Maximize2,
  Calendar,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { dataStore, subscribeToDataChanges } from '@/lib/data-store';
import { GalleryItem, BusinessSettings } from '@/lib/types';
import { createWhatsAppLink } from '@/lib/utils';

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  const galleryCategories = [
    'All',
    'Weddings',
    'Stages',
    'Traditional',
    'Birthdays',
    'Engagements',
    'Baby Events',
    'Flower Decorations',
  ];

  const loadGallery = async () => {
    try {
      const [items, st] = await Promise.all([
        dataStore.getGallery(true),
        dataStore.getBusinessSettings()
      ]);
      setGallery(items);
      setSettings(st);
    } catch (e) {
      console.error('Error fetching gallery:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
    const unsub = subscribeToDataChanges(loadGallery);
    return () => unsub();
  }, []);

  const filteredItems = gallery.filter((item) => {
    if (selectedTag === 'All') return true;
    return (item.category_name || '').toLowerCase() === selectedTag.toLowerCase();
  });

  const waNum = settings?.whatsapp || '+91 98765 43210';

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Real Celebration Portfolio</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-stone-900">
            Our Work & Event Photo Gallery
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Explore authentic photos from recent weddings, grand receptions, traditional haldi ceremonies, and joyous birthdays executed by our team.
          </p>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pt-6 pb-2 scrollbar-thin">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedTag(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedTag === cat
                    ? 'bg-amber-600 text-white font-bold shadow-md'
                    : 'bg-white text-stone-700 hover:bg-amber-100 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative rounded-2xl overflow-hidden bg-stone-100 aspect-[4/3] sm:aspect-square cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-stone-200"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
                <div className="flex justify-end">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 block mb-1">
                    {item.category_name}
                  </span>
                  <h4 className="font-heading text-sm font-bold leading-tight">
                    {item.title}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeItem && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="relative max-w-4xl w-full bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-700 flex flex-col md:flex-row">
              {/* Close button */}
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Photo Area */}
              <div className="md:w-3/5 bg-black flex items-center justify-center aspect-[4/3] md:aspect-auto">
                <img
                  src={activeItem.image_url}
                  alt={activeItem.title}
                  className="max-h-[70vh] w-full object-contain"
                />
              </div>

              {/* Info Column */}
              <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between text-white space-y-6">
                <div>
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                    {activeItem.category_name || 'Event Decor'}
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold mt-1">
                    {activeItem.title}
                  </h3>
                  {activeItem.description && (
                    <p className="text-xs sm:text-sm text-stone-300 mt-3 leading-relaxed">
                      {activeItem.description}
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-stone-800">
                  <Link
                    href="/custom-request"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Enquire for this Look</span>
                  </Link>

                  <a
                    href={createWhatsAppLink(
                      waNum,
                      `Hi! I saw the photo "${activeItem.title}" in your gallery and want to know more about this decoration setup.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WhatsApp Stylist</span>
                  </a>
                </div>
              </div>
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
