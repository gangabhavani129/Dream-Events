'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { dataStore, subscribeToDataChanges } from '@/lib/data-store';
import { BusinessSettings } from '@/lib/types';
import { createWhatsAppLink } from '@/lib/utils';

export default function WhatsAppFloatingButton() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    const load = async () => {
      const s = await dataStore.getBusinessSettings();
      setSettings(s);
    };
    load();
    const unsub = subscribeToDataChanges(load);
    return () => unsub();
  }, []);

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const waNum = settings?.whatsapp || '+91 98765 43210';
  const defaultMsg = 'Hi, I am interested in your flower decoration services.';
  const link = createWhatsAppLink(waNum, defaultMsg);

  return (
    <aside
      aria-label="WhatsApp Quick Contact"
      className="fixed bottom-20 md:bottom-8 right-4 md:right-6 z-40 flex items-center group"
    >
      <div className="hidden sm:block mr-2 px-3 py-1.5 bg-stone-900/90 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 pointer-events-none">
        Chat with Event Expert
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-white text-emerald-500" />
      </a>
    </aside>
  );
}
