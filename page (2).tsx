'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Sliders,
  MessageCircle,
  Phone,
  ArrowLeft,
  Share2,
  Check,
  ChevronRight,
  Info,
  ShieldCheck,
  Layers,
  Maximize2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import DecorationCard from '@/components/DecorationCard';
import { dataStore, subscribeToDataChanges } from '@/lib/data-store';
import { Decoration, BusinessSettings } from '@/lib/types';
import { formatPriceDisplay, createWhatsAppLink, createTelLink } from '@/lib/utils';

export default function DecorationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [decoration, setDecoration] = useState<Decoration | null>(null);
  const [relatedDecorations, setRelatedDecorations] = useState<Decoration[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [dec, allDecs, st] = await Promise.all([
        dataStore.getDecorationById(id),
        dataStore.getDecorations({ activeOnly: true }),
        dataStore.getBusinessSettings()
      ]);

      if (dec) {
        setDecoration(dec);
        const related = allDecs
          .filter((d) => d.id !== dec.id && (d.category_id === dec.category_id || d.featured))
          .slice(0, 3);
        setRelatedDecorations(related);
      }
      setSettings(st);
    } catch (e) {
      console.error('Error fetching details:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToDataChanges(loadData);
    return () => unsub();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-stone-600">Loading decoration details...</span>
        </div>
      </div>
    );
  }

  if (!decoration) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-md mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-stone-900">Decoration Not Found</h2>
          <p className="text-xs text-stone-600">
            This decoration concept may have been moved or updated.
          </p>
          <Link
            href="/decorations"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-600 text-white text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Decorations</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = decoration.images && decoration.images.length > 0
    ? decoration.images
    : [{ id: '1', decoration_id: decoration.id, image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', display_order: 1, is_primary: true }];

  const activeImageUrl = images[selectedImageIndex]?.image_url || images[0].image_url;

  const priceText = formatPriceDisplay(
    decoration.min_price,
    decoration.max_price,
    decoration.price_display_type
  );

  const waNum = settings?.whatsapp || '+91 98765 43210';
  const phoneNum = settings?.phone || '+91 98765 43210';
  const waMsg = `Hi! I am interested in booking the "${decoration.name}" (${priceText}). Please let me know the availability.`;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link href="/" className="hover:text-amber-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/decorations" className="hover:text-amber-700">Decorations</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-bold line-clamp-1">{decoration.name}</span>
        </nav>

        {/* Top Split Layout: Gallery & Key Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ================= LEFT: PHOTO GALLERY ================= */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Image */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl bg-stone-900 border-2 border-stone-200">
              <img
                src={activeImageUrl}
                alt={decoration.name}
                className="w-full h-full object-cover"
              />

              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1 text-xs font-bold tracking-wide uppercase rounded-full bg-stone-900/80 text-amber-300 backdrop-blur-md border border-amber-400/30 shadow-md">
                  {decoration.category_name || 'Decoration Theme'}
                </span>
              </div>

              {/* Share & Copy button */}
              <button
                type="button"
                onClick={handleShare}
                className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-stone-800 text-xs font-semibold shadow flex items-center gap-1.5 hover:bg-white transition-all"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-16 sm:w-24 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-amber-600 ring-2 ring-amber-400 shadow-md scale-105'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= RIGHT: SPECIFICATIONS & ACTIONS ================= */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-lg space-y-6">
              <div>
                <span className="text-xs uppercase font-bold text-amber-700 tracking-wider">
                  {decoration.category_name}
                </span>
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-950 mt-1 leading-tight">
                  {decoration.name}
                </h1>
              </div>

              {/* Price Display */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Estimated Price Range
                </div>
                <div className="font-heading text-2xl sm:text-3xl font-black text-amber-700 mt-0.5">
                  {priceText}
                </div>
                {/* Mandatory Disclaimer Note from Prompt */}
                <p className="text-[11px] text-stone-600 mt-2 leading-relaxed italic border-t border-amber-200/60 pt-2 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Final pricing may vary depending on venue, event size, flower selection and customization. Our team will confirm the final quotation.
                  </span>
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  Concept Description
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {decoration.description}
                </p>
              </div>

              {/* Setup Duration Tag */}
              {decoration.setup_duration && (
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 bg-stone-50 px-3.5 py-2.5 rounded-xl border border-stone-200">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Setup Duration: {decoration.setup_duration}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Link
                  href={`/booking?decorationId=${decoration.id}`}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-bold text-base shadow-xl shadow-amber-600/25 hover:shadow-2xl transition-all duration-200 active:scale-95"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book This Decoration</span>
                </Link>

                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={createWhatsAppLink(waNum, waMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                    <span>WhatsApp Us</span>
                  </a>

                  <a
                    href={createTelLink(phoneNum)}
                    className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
                  >
                    <Phone className="w-4 h-4 text-amber-700" />
                    <span>Call Stylist</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Full-Width Specifications: Included Items & Customization Options */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Included Items */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-heading text-lg font-bold text-stone-900">
                What&apos;s Included in this Setup
              </h3>
            </div>

            {decoration.included_items && decoration.included_items.length > 0 ? (
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                {decoration.included_items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-stone-500">
                Standard setup includes full floral backdrop, focus lighting, couple seating and floor runner.
              </p>
            )}
          </div>

          {/* Customization Options */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <h3 className="font-heading text-lg font-bold text-stone-900">
                Available Customization Options
              </h3>
            </div>

            {decoration.customization_options && decoration.customization_options.length > 0 ? (
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                {decoration.customization_options.map((opt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-stone-500">
                Colors, flowers, backdrop size and lighting can be personalized according to your venue.
              </p>
            )}
          </div>
        </div>

        {/* Related Decorations Section */}
        {relatedDecorations.length > 0 && (
          <div className="mt-16 pt-10 border-t border-amber-900/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-heading text-2xl font-bold text-stone-900">
                  Similar Decoration Concepts
                </h3>
                <p className="text-xs text-stone-500">
                  More designs from the {decoration.category_name} collection
                </p>
              </div>
              <Link
                href="/decorations"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <span>View Full Catalog</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedDecorations.map((rel) => (
                <DecorationCard key={rel.id} decoration={rel} whatsappNumber={waNum} />
              ))}
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
