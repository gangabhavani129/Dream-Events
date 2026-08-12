'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import QrCodeGenerator from '@/components/QrCodeGenerator';
import { dataStore, subscribeToDataChanges } from '@/lib/data-store';
import { BusinessSettings } from '@/lib/types';

export default function AdminQrCodePage() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    dataStore.getBusinessSettings().then(setSettings);
    const unsub = subscribeToDataChanges(() => {
      dataStore.getBusinessSettings().then(setSettings);
    });
    return () => unsub();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900">
            QR Code Generator & Display Studio
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Generate 100% free permanent QR codes for your table stands, event banners, and client cards.
          </p>
        </div>

        <QrCodeGenerator settings={settings} />
      </div>
    </AdminLayout>
  );
}
