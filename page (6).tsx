'use client';

import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import BookingModalOrStepper from '@/components/BookingModalOrStepper';
import { Palette, Sparkles } from 'lucide-react';

function CustomRequestContent() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Header Content matching prompt */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5 text-amber-600" />
            <span>Bespoke Design Studio</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-stone-900 leading-tight">
            Have a Different Decoration Idea?
          </h1>

          <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
            Send us your idea and reference photos. We&apos;ll create a customized decoration proposal for your event.
          </p>
        </div>

        {/* Custom Booking Stepper */}
        <BookingModalOrStepper isCustomRequest={true} />
      </main>

      <Footer />
      <MobileBottomNav />
      <WhatsAppFloatingButton />
    </div>
  );
}

export default function CustomRequestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">Loading custom request studio...</div>}>
      <CustomRequestContent />
    </Suspense>
  );
}
