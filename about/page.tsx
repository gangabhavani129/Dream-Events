'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Award,
  HeartHandshake,
  Clock,
  Flower2,
  Users,
  ShieldCheck,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { dataStore } from '@/lib/data-store';
import { BusinessSettings } from '@/lib/types';

export default function AboutPage() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    dataStore.getBusinessSettings().then(setSettings);
  }, []);

  const businessName = settings?.business_name || 'Utsav Flower Decorations';

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full space-y-16">
        {/* Story Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Our Legacy of Celebrations</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-stone-900 leading-tight">
              Crafting Sacred & Grand Floral Memories
            </h1>

            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              At <strong>{businessName}</strong>, we believe every Indian celebration deserves to be adorned with grace, fragrance, and sacred artistry. From intimate Haldi rituals to majestic 40-foot wedding mandaps, we combine centuries-old Vedic floral traditions with chic modern aesthetics.
            </p>

            <p className="text-sm text-stone-600 leading-relaxed">
              Our team of master florists, stage carpenters, and lighting artisans work tirelessly to bring your dream event vision to life on time, every time.
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80"
                alt="Flower Decorators at Work"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Guarantees Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Flower2,
              title: 'Daily Fresh Blooms',
              desc: 'Direct farm-sourced Dutch roses, Bangalore carnations, and fragrant Madurai jasmines.',
            },
            {
              icon: Clock,
              title: 'Punctual Setup Guarantee',
              desc: 'Stage is ready 2 hours prior to Muhurtham/guest arrival with a dedicated supervisor.',
            },
            {
              icon: ShieldCheck,
              title: 'Transparent Pricing',
              desc: 'No hidden surprise charges. Clear itemized quotations with realistic price ranges.',
            },
            {
              icon: HeartHandshake,
              title: 'Personal Stylist',
              desc: 'Direct WhatsApp communication with our head floral designer from planning to execution.',
            },
          ].map((g, idx) => {
            const Icon = g.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-base font-bold text-stone-900">{g.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{g.desc}</p>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
      <WhatsAppFloatingButton />
    </div>
  );
}
