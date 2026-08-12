'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, Image as ImageIcon, Palette, CalendarCheck } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide bottom nav on admin routes to prevent UI clutter
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Catalog', href: '/decorations', icon: Sparkles },
    { label: 'Gallery', href: '/gallery', icon: ImageIcon },
    { label: 'Custom', href: '/custom-request', icon: Palette },
    { label: 'Book', href: '/booking', icon: CalendarCheck, isPrimary: true },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-amber-200/80 shadow-2xl py-1.5 px-3">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-amber-600/30 group-active:scale-95 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-amber-900 mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
                isActive ? 'text-amber-700 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
