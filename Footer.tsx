'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Shield,
  QrCode,
  Heart
} from 'lucide-react';
import { dataStore, subscribeToDataChanges } from '@/lib/data-store';
import { BusinessSettings, Category } from '@/lib/types';
import { createWhatsAppLink, createTelLink } from '@/lib/utils';

export default function Footer() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      const s = await dataStore.getBusinessSettings();
      const cats = await dataStore.getCategories(true);
      setSettings(s);
      setCategories(cats.slice(0, 8));
    };
    load();
    const unsub = subscribeToDataChanges(load);
    return () => unsub();
  }, []);

  const phoneNum = settings?.phone || '+91 90641 77811';
  const waNum = settings?.whatsapp || '+91 90641 77811';
  const emailAddr = settings?.email || 'chnishantpoco123@gmail.com';
  const addressStr = settings?.address || 'Door No. 664/5, Khudiram Palli, Aam Bagan, Malancha, Kharagpur';
  const workingHours = settings?.working_hours || 'Mon – Sun: 8:00 AM – 9:30 PM';
  const brandName = settings?.business_name || 'Dream Events';

  return (
    <footer className="bg-[#1C1917] text-stone-300 border-t border-amber-900/30 pt-14 pb-20 md:pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                {brandName}
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              {settings?.description ||
                'Crafting timeless floral wedding stages, authentic Vedic mandaps, luxury reception backdrops, vibrant Haldi setups and customized celebration decors.'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-amber-400 hover:bg-amber-600 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-amber-400 hover:bg-amber-600 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              <a
                href={createWhatsAppLink(waNum, 'Hi! I want to enquiry about your floral decoration packages.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-700/50 flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>Explore Services</span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/decorations" className="hover:text-amber-400 transition-colors">
                  All Decoration Catalog
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-400 transition-colors">
                  Photo Gallery & Past Work
                </Link>
              </li>
              <li>
                <Link href="/custom-request" className="hover:text-amber-400 transition-colors">
                  Custom Decoration Request
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-amber-400 transition-colors">
                  Book an Event Online
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  Why Choose Pushpam Decors
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  Contact & Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="font-heading text-lg font-bold text-white mb-4">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/decorations?category=${cat.id}`}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-heading text-lg font-bold text-white mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-stone-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{addressStr}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={createTelLink(phoneNum)} className="hover:text-amber-400">
                  {phoneNum}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={createWhatsAppLink(waNum, 'Hi! I need decoration for my upcoming event.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400"
                >
                  {waNum} (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`mailto:${emailAddr}`} className="hover:text-amber-400">
                  {emailAddr}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-stone-400">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & admin portal shortcut */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} {brandName}. All rights reserved. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Indian celebrations.</span>
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/qr-code"
              className="text-stone-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Catalog</span>
            </Link>
            <span>•</span>
            <Link
              href="/admin/login"
              className="text-stone-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
