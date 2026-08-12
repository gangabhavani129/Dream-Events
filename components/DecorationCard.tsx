'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, Sparkles, MessageCircle, Clock } from 'lucide-react';
import { Decoration } from '@/lib/types';
import { formatPriceDisplay, createWhatsAppLink } from '@/lib/utils';

interface DecorationCardProps {
  decoration: Decoration;
  whatsappNumber?: string;
}

export default function DecorationCard({
  decoration,
  whatsappNumber = '+91 98765 43210'
}: DecorationCardProps) {
  const primaryImage =
    decoration.images?.find((img) => img.is_primary)?.image_url ||
    decoration.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';

  const priceText = formatPriceDisplay(
    decoration.min_price,
    decoration.max_price,
    decoration.price_display_type
  );

  const waEnquiryMsg = `Hi! I saw the "${decoration.name}" (${priceText}) on your catalog and would like to check availability for my event.`;
  const waLink = createWhatsAppLink(whatsappNumber, waEnquiryMsg);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-amber-900/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Card Image Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={primaryImage}
          alt={decoration.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-xs font-bold tracking-wide uppercase rounded-full bg-stone-900/80 text-amber-300 backdrop-blur-md border border-amber-400/30 shadow-sm">
            {decoration.category_name || 'Decoration'}
          </span>
        </div>

        {/* Setup Duration Tag if present */}
        {decoration.setup_duration && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-medium text-white/90 bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>Setup: {decoration.setup_duration}</span>
          </div>
        )}

        {/* Quick WhatsApp button on image */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-md hover:bg-emerald-600 transition-colors"
          title="Enquire on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
        </a>
      </div>

      {/* Card Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-stone-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
            {decoration.name}
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 mt-2 leading-relaxed">
            {decoration.description}
          </p>

          {/* Included Items preview pills */}
          {decoration.included_items && decoration.included_items.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {decoration.included_items.slice(0, 2).map((item, idx) => (
                <span
                  key={idx}
                  className="inline-block text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200/60 font-medium"
                >
                  ✓ {item.length > 25 ? item.slice(0, 23) + '…' : item}
                </span>
              ))}
              {decoration.included_items.length > 2 && (
                <span className="text-[10px] px-1.5 py-0.5 text-stone-400 font-medium">
                  +{decoration.included_items.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
              Price Range
            </span>
            <span className="text-base sm:text-lg font-bold text-amber-700 font-heading">
              {priceText}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/decorations/${decoration.id}`}
              className="w-full inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 transition-colors"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href={`/booking?decorationId=${decoration.id}`}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 shadow-sm hover:shadow transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
