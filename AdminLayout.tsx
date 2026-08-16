'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  CalendarDays,
  FolderTree,
  Image as ImageIcon,
  QrCode,
  Settings,
  LogOut,
  PlusCircle,
  ExternalLink,
  Menu,
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { isSupabaseConfigured } from '@/lib/supabase';
import { dataStore, subscribeToDataChanges } from '@/lib/data-store';
import { BusinessSettings } from '@/lib/types';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const load = async () => {
      const s = await dataStore.getBusinessSettings();
      setSettings(s);
    };
    load();
    const unsub = subscribeToDataChanges(load);
    return () => unsub();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900 text-amber-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wider text-amber-200">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Bookings & Enquiries', href: '/admin/bookings', icon: ClipboardList },
    { label: 'Decorations Catalog', href: '/admin/decorations', icon: Sparkles },
    { label: 'Event Calendar', href: '/admin/calendar', icon: CalendarDays },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Photo Gallery', href: '/admin/gallery', icon: ImageIcon },
    { label: 'QR Code Studio', href: '/admin/qr-code', icon: QrCode },
    { label: 'Business Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-stone-900 text-stone-200 flex-col justify-between border-r border-stone-800 shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-stone-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white font-bold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-bold text-white leading-tight line-clamp-1">
                {settings?.business_name || 'Utsav Decors'}
              </h2>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
                Admin Management
              </span>
            </div>
          </div>

          {/* Quick Action */}
          <div className="p-4">
            <Link
              href="/admin/decorations/new"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Decoration</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Info & Logout */}
        <div className="p-4 border-t border-stone-800 space-y-3">
          {/* Database status pill */}
          <div className="px-3 py-2 rounded-xl bg-stone-800/80 text-[11px] flex items-center justify-between border border-stone-700">
            <span className="flex items-center gap-1.5 text-stone-300">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Storage:</span>
            </span>
            {isSupabaseConfigured ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Supabase
              </span>
            ) : (
              <span className="text-amber-400 font-medium">Local Live Data</span>
            )}
          </div>

          {/* View live site button */}
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-medium transition-colors"
          >
            <span>View Customer Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-stone-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-stone-800 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-heading text-sm font-bold leading-tight">
              {settings?.business_name || 'Utsav Decors'}
            </h2>
            <span className="text-[9px] text-amber-400 font-bold tracking-wider uppercase">
              Admin Panel
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/decorations/new"
            className="p-1.5 bg-amber-600 text-white rounded-lg text-xs"
            title="Add Decoration"
          >
            <PlusCircle className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-1.5 bg-stone-800 text-stone-200 rounded-lg"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Nav Menu */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-stone-900 border-b border-stone-800 shadow-2xl p-4 z-50 animate-in slide-in-from-top-2">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-amber-600 text-white'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
              <Link
                href="/"
                target="_blank"
                className="text-xs text-amber-400 flex items-center gap-1 font-medium"
              >
                <span>View Customer Website</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <button
                type="button"
                onClick={() => logout()}
                className="text-xs text-rose-400 flex items-center gap-1 font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Admin Content Viewport */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
