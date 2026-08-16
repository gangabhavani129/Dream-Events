'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  Instagram,
  Facebook
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { dataStore, subscribeToDataChanges } from '@/lib/data-store';
import { BusinessSettings } from '@/lib/types';
import { createWhatsAppLink, createTelLink } from '@/lib/utils';

export default function ContactPage() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });

  const loadData = async () => {
    const s = await dataStore.getBusinessSettings();
    setSettings(s);
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToDataChanges(loadData);
    return () => unsub();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    // Create enquiry
    dataStore.createBooking({
      decoration_name: 'Direct Contact Message',
      request_type: 'CUSTOM',
      customer_name: formData.name,
      phone: formData.phone,
      whatsapp: formData.phone,
      event_type: 'General Enquiry',
      event_date: new Date().toISOString().split('T')[0],
      venue_name: 'To be discussed',
      venue_address: '',
      city: 'Hyderabad',
      pincode: '',
      indoor_outdoor: 'Indoor',
      special_requirements: formData.message,
      status: 'New Enquiry',
    });
    setFormSent(true);
  };

  const phoneNum = settings?.phone || '+91 90641 77811';
  const waNum = settings?.whatsapp || '+91 90641 77811';
  const emailAddr = settings?.email || 'chnishantpoco123@gmail.com';
  const addressStr = settings?.address || 'Door No. 664/5, Khudiram Palli, Aam Bagan, Malancha, Kharagpur';
  const workingHours = settings?.working_hours || 'Mon – Sun: 8:00 AM – 9:30 PM';

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Connect with Our Stylists</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-stone-900">
            Contact & Consultation
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Have questions about venue sizes, flower customizations or pricing? We’re just a call or WhatsApp message away.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-5">
              <h3 className="font-heading text-lg font-bold text-stone-900">
                Direct Contact Information
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">Studio & Office Address</span>
                    <span className="text-stone-600">{addressStr}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">Call Helpline</span>
                    <a href={createTelLink(phoneNum)} className="text-amber-800 font-semibold hover:underline">
                      {phoneNum}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">WhatsApp Chat</span>
                    <a
                      href={createWhatsAppLink(waNum, 'Hi! I want to enquiry about decoration packages.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-semibold hover:underline"
                    >
                      {waNum} (Instant Chat)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">Email Support</span>
                    <a href={`mailto:${emailAddr}`} className="text-stone-600 hover:text-amber-800">
                      {emailAddr}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">Working Hours</span>
                    <span className="text-stone-600">{workingHours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Message Box */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-lg">
            {formSent ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-stone-900">Message Received!</h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  Thank you for reaching out. Our event stylist will call or message you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSent(false)}
                  className="px-6 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-heading text-xl font-bold text-stone-900">
                  Send a Quick Callback Request
                </h3>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98490 12345"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Event Details or Questions
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your event date, venue, or decoration requirements..."
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Instant Callback</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
      <WhatsAppFloatingButton />
    </div>
  );
}
