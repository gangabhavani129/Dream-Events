'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ArrowLeft,
  Sparkles,
  Printer,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { dataStore, subscribeToDataChanges } from '@/lib/data-store';
import { Booking, BusinessSettings } from '@/lib/types';
import { formatINR, createWhatsAppLink, createTelLink, formatDate } from '@/lib/utils';

export default function BookingConfirmationPage() {
  const params = useParams();
  const id = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D97706', '#BE123C', '#F59E0B', '#10B981'],
      });
    } catch (e) {
      console.warn('Confetti effect error:', e);
    }
  }, []);

  const loadBooking = async () => {
    try {
      const [b, s] = await Promise.all([
        dataStore.getBookingById(id),
        dataStore.getBusinessSettings()
      ]);
      setBooking(b);
      setSettings(s);
    } catch (e) {
      console.error('Error fetching confirmation:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
    const unsub = subscribeToDataChanges(loadBooking);
    return () => unsub();
  }, [id]);

  const copyBookingId = () => {
    if (!booking) return;
    navigator.clipboard.writeText(booking.booking_number);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const phoneNum = settings?.phone || '+91 98765 43210';
  const waNum = settings?.whatsapp || '+91 98765 43210';

  const waEnquiryText = booking
    ? `Hi! I submitted a decoration enquiry with Booking ID: ${booking.booking_number} for "${booking.decoration_name}" on date ${booking.event_date}. Please share the availability and quotation.`
    : 'Hi! I submitted a decoration booking enquiry.';

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-900/10 shadow-2xl space-y-8 text-center sm:text-left">
          {/* Header check icon & Title */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Enquiry Submitted Successfully</span>
            </div>

            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-stone-900 leading-tight">
              Thank you! Your decoration enquiry has been received.
            </h1>

            {/* Mandatory prompt clarification notice */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm font-medium leading-relaxed max-w-xl mx-auto flex items-start gap-2.5 text-left">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Your request is not confirmed yet.</strong> Our team will contact you to discuss availability, customization and final pricing.
              </span>
            </div>
          </div>

          {/* Booking Summary Card */}
          {booking && (
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-4 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                <div>
                  <span className="text-xs uppercase font-bold text-stone-400">Unique Booking Reference</span>
                  <div className="font-mono text-xl sm:text-2xl font-black text-amber-700 mt-0.5">
                    {booking.booking_number}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={copyBookingId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs font-semibold hover:bg-stone-100 self-start sm:self-auto transition-colors"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
                </button>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-stone-400 font-medium block text-xs">Selected Decoration:</span>
                  <strong className="text-stone-900 font-bold block mt-0.5">
                    {booking.decoration_name}
                  </strong>
                </div>

                <div>
                  <span className="text-stone-400 font-medium block text-xs">Event Date & Type:</span>
                  <strong className="text-stone-900 font-bold block mt-0.5">
                    {booking.event_type} • {formatDate(booking.event_date)} ({booking.event_time || 'Flexible'})
                  </strong>
                </div>

                <div>
                  <span className="text-stone-400 font-medium block text-xs">Venue Location:</span>
                  <strong className="text-stone-900 font-bold block mt-0.5">
                    {booking.venue_name} ({booking.city})
                  </strong>
                </div>

                <div>
                  <span className="text-stone-400 font-medium block text-xs">Customer Name & Phone:</span>
                  <strong className="text-stone-900 font-bold block mt-0.5">
                    {booking.customer_name} ({booking.phone})
                  </strong>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-stone-500 font-medium text-xs">Estimated Price Range:</span>
                  <span className="font-heading font-black text-base sm:text-lg text-amber-700">
                    {booking.estimated_min_price
                      ? `${formatINR(booking.estimated_min_price)} – ${formatINR(booking.estimated_max_price)}`
                      : 'To be quoted'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action CTAs: Call Us, WhatsApp Us, Back to Decorations */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={createWhatsAppLink(waNum, waEnquiryText)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>WhatsApp Us</span>
              </a>

              <a
                href={createTelLink(phoneNum)}
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-lg transition-all"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call Us ({phoneNum})</span>
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-100">
              <Link
                href="/decorations"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 hover:text-amber-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Decorations Catalog</span>
              </Link>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Booking Summary</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
      <WhatsAppFloatingButton />
    </div>
  );
}
