'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Star,
  QrCode,
  Layers,
  Palette,
  Phone,
  MessageCircle,
  Flower2,
  Crown,
  ChevronRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import DecorationCard from '@/components/DecorationCard';
import { dataStore, subscribeToDataChanges } from '@/lib/data-store';
import { Decoration, Category, BusinessSettings } from '@/lib/types';
import { createWhatsAppLink } from '@/lib/utils';

export default function HomePage() {
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [decs, cats, st] = await Promise.all([
        dataStore.getDecorations({ activeOnly: true }),
        dataStore.getCategories(true),
        dataStore.getBusinessSettings()
      ]);
      setDecorations(decs);
      setCategories(cats);
      setSettings(st);
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToDataChanges(loadData);
    return () => unsub();
  }, []);

  const featuredDecorations = decorations.filter((d) => d.featured).slice(0, 6);
  const displayDecorations = featuredDecorations.length > 0 ? featuredDecorations : decorations.slice(0, 6);

  const services = [
    {
      title: 'Flower Decorations',
      desc: 'Fresh carnations, exotic orchids, traditional marigolds and fragrant jasmine strings.',
      icon: Flower2,
      tag: 'Fresh Blooms'
    },
    {
      title: 'Wedding Stages & Mandaps',
      desc: 'Grand royal backdrops, traditional Vedic mandaps, and elegant couple seating.',
      icon: Crown,
      tag: 'Royal Themes'
    },
    {
      title: 'Aesthetic Floral Backdrops',
      desc: 'Modern fairy-tale archways, neon light boards, and curated photo booth walls.',
      icon: Sparkles,
      tag: 'Modern & Chic'
    },
    {
      title: 'Haldi & Mehendi Vibes',
      desc: 'Vibrant yellow Urli seating, colorful bohemian jhulas, and traditional flower rangolis.',
      icon: Palette,
      tag: 'Vibrant Festive'
    },
    {
      title: 'Birthday & Balloon Stages',
      desc: 'Whimsical organic balloon garlands, pastel clouds, and milestone 1st birthday setups.',
      icon: Layers,
      tag: 'Playful & Fun'
    },
    {
      title: 'Customized Event Themes',
      desc: 'Bespoke designs crafted precisely according to your venue, theme, and color palette.',
      icon: Heart,
      tag: 'Tailor-Made'
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Scan QR / Browse Catalog',
      desc: 'Scan our venue QR code or browse hundreds of genuine stage & flower designs online from any smartphone.',
    },
    {
      num: '02',
      title: 'Select Design & Price Range',
      desc: 'Explore high-resolution photos, included decor elements, setup duration, and transparent price ranges.',
    },
    {
      num: '03',
      title: 'Submit Booking Enquiry',
      desc: 'Fill your event date, venue details, and requirements. Zero upfront online payment required.',
    },
    {
      num: '04',
      title: 'Expert Consultation & Confirmation',
      desc: 'Our team connects on WhatsApp to confirm availability, customize flower shades, and finalize your quotation.',
    },
  ];

  const waNum = settings?.whatsapp || '+91 98765 43210';

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-mandala-glow border-b border-amber-900/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Heading & CTAs */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-300/50 shadow-sm">
                  <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>Premium Indian Floral & Event Styling</span>
                </div>

                <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-950 tracking-tight leading-[1.15]">
                  Beautiful Decorations for Your{' '}
                  <span className="text-royal-gradient">Special Moments</span>
                </h1>

                <p className="text-stone-700 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Explore elegant flower decorations, wedding stages, birthday setups and customized event decorations for every celebration.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link
                    href="/decorations"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-amber-600 via-amber-500 to-rose-600 hover:from-amber-700 hover:to-rose-700 shadow-xl shadow-amber-600/25 hover:shadow-2xl transition-all duration-200 active:scale-95"
                  >
                    <span>Explore Decorations</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    href="/custom-request"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base font-bold text-stone-800 bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-amber-400 shadow-sm transition-all duration-200"
                  >
                    <Palette className="w-4 h-4 text-amber-600" />
                    <span>Request Custom Decoration</span>
                  </Link>
                </div>

                {/* Value Props Row */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-amber-900/10 text-stone-700 text-left">
                  <div>
                    <div className="font-heading text-lg sm:text-2xl font-bold text-stone-900">500+</div>
                    <div className="text-[11px] sm:text-xs text-stone-500 font-medium">Events Decorated</div>
                  </div>
                  <div>
                    <div className="font-heading text-lg sm:text-2xl font-bold text-stone-900">100%</div>
                    <div className="text-[11px] sm:text-xs text-stone-500 font-medium">Fresh Flower Guarantee</div>
                  </div>
                  <div>
                    <div className="font-heading text-lg sm:text-2xl font-bold text-stone-900">0 Online Fee</div>
                    <div className="text-[11px] sm:text-xs text-stone-500 font-medium">Free Initial Enquiry</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Collage */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Decorative Frame */}
                  <div className="absolute -inset-3 bg-gradient-to-tr from-amber-400/30 to-rose-400/30 rounded-3xl blur-xl" />

                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100 aspect-[4/3]">
                    <img
                      src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                      alt="Grand Wedding Stage Floral Decor"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-amber-600 text-white inline-block mb-1">
                        Featured Design
                      </span>
                      <h3 className="font-heading text-lg font-bold">
                        Royal Rose Wedding Stage
                      </h3>
                      <p className="text-xs text-amber-200 font-medium">
                        ₹25,000 – ₹40,000 • Custom flower shades available
                      </p>
                    </div>
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -bottom-6 -left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-amber-200 hidden sm:flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">QR Catalog Ready</div>
                      <div className="text-[10px] text-stone-500">Scan & browse on any mobile</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* QUICK CATEGORY SELECTOR STRIP */}
        {/* ========================================================================= */}
        <section className="py-8 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-stone-900">
                  Browse by Event & Celebration
                </h2>
                <p className="text-xs text-stone-500">
                  Select your occasion to view tailored decoration concepts
                </p>
              </div>

              <Link
                href="/decorations"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 shrink-0"
              >
                <span>View All Categories</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Category Pills Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <Link
                href="/decorations"
                className="shrink-0 px-4 py-2 rounded-full text-xs font-bold bg-amber-600 text-white shadow-sm"
              >
                ✨ All Decorations
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/decorations?category=${cat.id}`}
                  className="shrink-0 px-4 py-2 rounded-full text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FEATURED DECORATIONS CATALOG PREVIEW */}
        {/* ========================================================================= */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Handpicked Collections
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-stone-900">
              Popular Decoration Designs
            </h2>
            <p className="text-sm text-stone-600">
              From majestic South Indian mandaps to sleek modern reception arches and fairytale birthday stages.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayDecorations.map((dec) => (
              <DecorationCard
                key={dec.id}
                decoration={dec}
                whatsappNumber={waNum}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/decorations"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-all shadow-sm"
            >
              <span>Explore Complete Catalog ({decorations.length} Designs)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW IT WORKS / CUSTOMER JOURNEY */}
        {/* ========================================================================= */}
        <section className="py-16 bg-[#F5EFEB] border-y border-amber-900/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                Simple 4-Step Process
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-stone-900">
                How Our Booking Process Works
              </h2>
              <p className="text-sm text-stone-600">
                No complicated logins or online credit cards needed. Transparent pricing with instant WhatsApp coordination.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s, idx) => (
                <div
                  key={s.num}
                  className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm relative flex flex-col justify-between"
                >
                  <div>
                    <div className="font-mono text-3xl font-black text-amber-500/40 mb-3">
                      {s.num}
                    </div>
                    <h3 className="font-heading text-base font-bold text-stone-900 mb-2">
                      {s.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SERVICES OVERVIEW */}
        {/* ========================================================================= */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Our Expertise
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-stone-900">
              Comprehensive Event Decoration Services
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 bg-white rounded-2xl border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CUSTOM REQUEST CALLOUT BANNER */}
        {/* ========================================================================= */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-amber-600/30">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                  Bespoke Decor Concepts
                </span>
                <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white">
                  Have a Different Decoration Idea in Mind?
                </h2>
                <p className="text-sm text-stone-300 leading-relaxed max-w-2xl">
                  Send us your dream theme, color palette or Pinterest reference photos. We’ll curate a personalized 3D proposal and custom price estimate for your big day.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                <Link
                  href="/custom-request"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-lg transition-all"
                >
                  <Palette className="w-4 h-4" />
                  <span>Send Reference Photos</span>
                </Link>

                <a
                  href={createWhatsAppLink(waNum, 'Hi! I have a custom decoration idea for my upcoming event. Can I share the photos?')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
      <WhatsAppFloatingButton />
    </div>
  );
}
