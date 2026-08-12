'use client';

import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import {
  Download,
  Copy,
  Check,
  Printer,
  Sparkles,
  Phone,
  MessageCircle,
  ExternalLink,
  Share2,
  Image as ImageIcon
} from 'lucide-react';
import { BusinessSettings } from '@/lib/types';

interface QrCodeGeneratorProps {
  settings: BusinessSettings | null;
}

export default function QrCodeGenerator({ settings }: QrCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [catalogUrl, setCatalogUrl] = useState('');
  const [template, setTemplate] = useState<'stand' | 'minimal' | 'badge'>('stand');
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      setCatalogUrl(`${origin}/decorations`);
    }
  }, []);

  const handleCopyLink = () => {
    if (!catalogUrl) return;
    navigator.clipboard.writeText(catalogUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPNG = () => {
    const canvas = qrCanvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'dream-events-catalog-qr.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handlePrint = () => {
    window.print();
  };

  const businessName = settings?.business_name || 'Dream Events';
  const phone = settings?.phone || '+91 90641 77811';
  const tagline = settings?.tagline || 'Crafting Royal & Timeless Celebrations';

  return (
    <div className="space-y-8">
      {/* Top action header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-700 tracking-wider">
            Permanent Customer Catalog Link
          </span>
          <h2 className="font-heading text-xl font-bold text-stone-900 mt-0.5">
            Scan to View Our Decoration Catalog
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            This QR code points to your permanent catalog. You can print it on table stands, visiting cards, or banners.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Copy Catalog Link'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPNG}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res QR</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Display Stand</span>
          </button>
        </div>
      </div>

      {/* Template Selector & Printable Flyer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Settings / Preview config */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-900 text-sm">Flyer Display Templates</h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setTemplate('stand')}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  template === 'stand'
                    ? 'border-amber-600 bg-amber-50/70 shadow-sm font-semibold text-stone-900'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="text-xs font-bold text-amber-800">Template 1: Royal Table Display Stand</div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Best for banquet table counters, expo stalls & office reception desks.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTemplate('minimal')}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  template === 'minimal'
                    ? 'border-amber-600 bg-amber-50/70 shadow-sm font-semibold text-stone-900'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="text-xs font-bold text-amber-800">Template 2: Minimalist Clean QR Card</div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Compact design with high-contrast QR for visiting cards and stickers.
                </div>
              </button>
            </div>

            {/* Permanent URL input box */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Target URL
              </label>
              <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono text-stone-700 break-all select-all">
                {catalogUrl || 'https://yourdomain.com/decorations'}
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                100% Free & No Expiration
              </p>
              <p className="text-[11px] text-emerald-800">
                This QR code is generated client-side and points directly to your permanent web address. You will never be asked to pay any monthly QR subscription fee.
              </p>
            </div>
          </div>
        </div>

        {/* Right Printable Flyer Canvas */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            id="printable-qr-flyer"
            className="w-full max-w-md bg-white rounded-3xl p-8 border-4 border-amber-500/40 shadow-2xl relative overflow-hidden text-center flex flex-col items-center justify-between"
          >
            {/* Background floral accents */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-100 rounded-full blur-2xl pointer-events-none opacity-60" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-rose-100 rounded-full blur-2xl pointer-events-none opacity-60" />

            {/* Top decorative header */}
            <div className="space-y-2 relative z-10 w-full">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Instant Mobile Catalog</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                {businessName}
              </h2>

              <p className="text-xs text-amber-800 font-serif italic">
                &ldquo;{tagline}&rdquo;
              </p>

              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-2" />
            </div>

            {/* QR Code Canvas */}
            <div className="my-6 relative z-10 p-5 bg-gradient-to-b from-amber-50 to-white rounded-2xl border-2 border-amber-300 shadow-inner flex flex-col items-center">
              <div ref={qrCanvasRef} className="p-3 bg-white rounded-xl shadow-md">
                <QRCodeCanvas
                  value={catalogUrl || 'https://utsavdecor.com/decorations'}
                  size={210}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=80&q=80',
                    x: undefined,
                    y: undefined,
                    height: 38,
                    width: 38,
                    excavate: true,
                  }}
                />
              </div>

              <div className="mt-3 text-stone-900 font-bold text-sm tracking-wide flex items-center gap-1">
                <span>📱 Scan with any Phone Camera</span>
              </div>
              <span className="text-[11px] text-stone-500 mt-0.5">
                No app installation required
              </span>
            </div>

            {/* Services List Tagline */}
            <div className="text-[11px] text-stone-600 leading-relaxed font-medium mb-4 relative z-10">
              Weddings • Mandaps • Stages • Haldi & Mehendi • Birthdays • Baby Showers
            </div>

            {/* Footer Phone & WhatsApp Contact */}
            <div className="w-full pt-4 border-t border-amber-200 flex items-center justify-around text-xs font-bold text-stone-800 relative z-10">
              <div className="flex items-center gap-1.5 text-stone-900">
                <Phone className="w-4 h-4 text-amber-600" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                <span>WhatsApp Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
