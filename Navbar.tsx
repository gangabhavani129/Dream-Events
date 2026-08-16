'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Phone,
  MessageCircle,
  Menu,
  X,
  Search,
  Calendar,
  Layers,
  Image as ImageIcon,
  Palette,
  Info,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { dataStore, subscribeToDataChanges } from '@/lib/data-store';
import { BusinessSettings } from '@/lib/types';
import { createWhatsAppLink, createTelLink } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const load = async () => {
      const s = await dataStore.getBusinessSettings();
      setSettings(s);
    };
    load();
    const unsub = subscribeToDataChanges(load);
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Decorations', href: '/decorations' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Custom Request', href: '/custom-request' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const phoneNum = settings?.phone || '+91 98765 43210';
  const waNum = settings?.whatsapp || '+91 98765 43210';
  const brandName = settings?.business_name || 'Utsav Flower Decorations';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-amber-100 py-2.5'
          : 'bg-[#FAF6F0]/95 backdrop-blur-sm border-b border-amber-900/10 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo / Brand Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-stone-900 block leading-tight group-hover:text-amber-700 transition-colors">
                {brandName}
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-700 block">
                {settings?.tagline || 'Flower & Event Designers'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm font-semibold'
                      : 'text-stone-700 hover:text-amber-800 hover:bg-amber-100/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions: Call, WhatsApp & Book Now CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href={createTelLink(phoneNum)}
              className="p-2 text-stone-700 hover:text-amber-700 hover:bg-amber-100/60 rounded-full transition-colors"
              title="Call Us"
            >
              <Phone className="w-4 h-4" />
            </a>

            <a
              href={createWhatsAppLink(waNum, 'Hi! I am exploring flower decorations on your website and would like more details.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-amber-600 via-amber-500 to-rose-600 hover:from-amber-700 hover:to-rose-700 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Now</span>
            </Link>
          </div>

          {/* Mobile Right Bar: Search + Book CTA + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/booking"
              className="px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-rose-600 shadow-sm"
            >
              Book Now
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-700 hover:bg-amber-100/70 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bg-white border-b border-amber-200 shadow-xl px-4 py-6 z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1 pb-4 border-b border-stone-100">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 font-bold border-l-4 border-amber-600'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </Link>
              );
            })}
          </div>

          <div className="pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={createTelLink(phoneNum)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-stone-200 text-stone-800 font-medium text-sm hover:bg-stone-50"
              >
                <Phone className="w-4 h-4 text-amber-700" />
                <span>Call Business</span>
              </a>
              <a
                href={createWhatsAppLink(waNum, 'Hi! I am interested in decoration services.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="flex items-center justify-between px-2 pt-2 text-xs text-stone-500">
              <span>Looking for Admin?</span>
              <Link href="/admin" className="text-amber-700 font-semibold flex items-center gap-1 hover:underline">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
