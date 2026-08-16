'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Database,
  Code,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { dataStore, subscribeToDataChanges } from '@/lib/data-store';
import { BusinessSettings } from '@/lib/types';
import { isSupabaseConfigured } from '@/lib/supabase';

const SUPABASE_SCHEMA_SQL = `-- ==============================================================================
-- PUSHPAM & UTSAV FLOWER DECORATIONS DATABASE SCHEMA FOR SUPABASE
-- Run this in your Supabase SQL Editor:
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT ('cat-' || uuid_generate_v4()),
    name TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Decorations Table
CREATE TABLE IF NOT EXISTS public.decorations (
    id TEXT PRIMARY KEY DEFAULT ('dec-' || uuid_generate_v4()),
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    min_price NUMERIC(10, 2) DEFAULT 0,
    max_price NUMERIC(10, 2) DEFAULT 0,
    price_display_type TEXT DEFAULT 'Price Range',
    included_items JSONB DEFAULT '[]'::jsonb,
    customization_options JSONB DEFAULT '[]'::jsonb,
    setup_duration TEXT,
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Decoration Images Table
CREATE TABLE IF NOT EXISTS public.decoration_images (
    id TEXT PRIMARY KEY DEFAULT ('img-' || uuid_generate_v4()),
    decoration_id TEXT REFERENCES public.decorations(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY DEFAULT ('book-' || uuid_generate_v4()),
    booking_number TEXT UNIQUE NOT NULL,
    decoration_id TEXT REFERENCES public.decorations(id) ON DELETE SET NULL,
    request_type TEXT DEFAULT 'STANDARD',
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT,
    event_type TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TEXT,
    guest_count INTEGER,
    venue_name TEXT NOT NULL,
    venue_address TEXT,
    city TEXT DEFAULT 'Hyderabad',
    pincode TEXT,
    indoor_outdoor TEXT DEFAULT 'Indoor',
    venue_contact TEXT,
    special_requirements TEXT,
    reference_image_urls JSONB DEFAULT '[]'::jsonb,
    estimated_min_price NUMERIC(10, 2) DEFAULT 0,
    estimated_max_price NUMERIC(10, 2) DEFAULT 0,
    final_quoted_price NUMERIC(10, 2),
    status TEXT DEFAULT 'New Enquiry',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY DEFAULT ('gal-' || uuid_generate_v4()),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Business Settings Table
CREATE TABLE IF NOT EXISTS public.business_settings (
    id TEXT PRIMARY KEY DEFAULT 'settings-01',
    business_name TEXT NOT NULL DEFAULT 'Dream Events',
    tagline TEXT DEFAULT 'Crafting Royal & Timeless Celebrations',
    logo_url TEXT,
    phone TEXT NOT NULL DEFAULT '+91 90641 77811',
    whatsapp TEXT NOT NULL DEFAULT '+91 90641 77811',
    email TEXT NOT NULL DEFAULT 'chnishantpoco123@gmail.com',
    address TEXT NOT NULL DEFAULT 'Door No. 664/5, Khudiram Palli, Aam Bagan, Malancha',
    city TEXT DEFAULT 'Kharagpur',
    pincode TEXT DEFAULT '721301',
    instagram_url TEXT DEFAULT 'https://instagram.com/dreamevents2020',
    facebook_url TEXT DEFAULT 'https://facebook.com/dreamevents2020',
    description TEXT,
    working_hours TEXT DEFAULT 'Mon – Sun: 8:00 AM – 9:30 PM',
    currency_symbol TEXT DEFAULT '₹',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decorations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public select categories" ON public.categories FOR SELECT USING (active = TRUE OR auth.role() = 'authenticated');
CREATE POLICY "Public select decorations" ON public.decorations FOR SELECT USING (active = TRUE OR auth.role() = 'authenticated');
CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public select gallery" ON public.gallery FOR SELECT USING (active = TRUE OR auth.role() = 'authenticated');
CREATE POLICY "Public select settings" ON public.business_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admin all categories" ON public.categories FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admin all decorations" ON public.decorations FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admin all bookings" ON public.bookings FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admin all gallery" ON public.gallery FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admin all settings" ON public.business_settings FOR ALL TO authenticated USING (TRUE);
`;

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<'general' | 'supabase'>('general');
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [description, setDescription] = useState('');
  const [workingHours, setWorkingHours] = useState('');

  useEffect(() => {
    dataStore.getBusinessSettings().then((s) => {
      setSettings(s);
      if (s) {
        setBusinessName(s.business_name || '');
        setTagline(s.tagline || '');
        setPhone(s.phone || '');
        setWhatsapp(s.whatsapp || '');
        setEmail(s.email || '');
        setAddress(s.address || '');
        setCity(s.city || '');
        setPincode(s.pincode || '');
        setInstagram(s.instagram_url || '');
        setFacebook(s.facebook_url || '');
        setDescription(s.description || '');
        setWorkingHours(s.working_hours || '');
      }
    });
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dataStore.updateBusinessSettings({
        business_name: businessName.trim(),
        tagline: tagline.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        instagram_url: instagram.trim(),
        facebook_url: facebook.trim(),
        description: description.trim(),
        working_hours: workingHours.trim(),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Settings save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const envSampleText = `NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;

  const copyEnv = () => {
    navigator.clipboard.writeText(envSampleText);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900">
              Business & System Settings
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Configure your business contact numbers, working hours, and Supabase database.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-stone-200/80 rounded-2xl">
            <button
              type="button"
              onClick={() => setTab('general')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'general' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Business Profile
            </button>
            <button
              type="button"
              onClick={() => setTab('supabase')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                tab === 'supabase' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-600" />
              <span>Supabase Connection</span>
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Business settings updated! Changes are now live across your customer website.</span>
          </div>
        )}

        {/* TAB 1: BUSINESS PROFILE */}
        {tab === 'general' && (
          <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Business / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 font-bold text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Primary Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 font-mono text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  WhatsApp Contact Number *
                </label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 font-mono text-sm outline-none"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  All &quot;Chat on WhatsApp&quot; buttons link directly to this number.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Business Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Working Hours
                </label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="Mon – Sun: 8:00 AM – 9:30 PM"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Studio / Store Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot No. 42, Road No. 36, Jubilee Hills"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/utsav_decorations"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/utsavdecorations"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  About the Business / Bio
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-stone-100">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Business Profile'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SUPABASE SETUP GUIDE */}
        {tab === 'supabase' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">
                    Supabase Dual-Driver Architecture
                  </h3>
                  <p className="text-xs text-stone-600">
                    Status: {isSupabaseConfigured ? '🟢 Connected to Live Supabase' : '🟡 Active (Integrated Local Persistence Mode)'}
                  </p>
                </div>
              </div>

              <div className="text-xs font-bold px-3 py-1.5 rounded-full bg-white text-stone-800 border border-amber-300">
                Free Tier 100% Compatible
              </div>
            </div>

            {/* Step-by-step connection instructions */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-stone-900">
                How to Connect your own Free Supabase Project in 2 Minutes:
              </h3>

              <ol className="space-y-3 text-xs sm:text-sm text-stone-700 list-decimal list-inside leading-relaxed">
                <li>
                  Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-amber-700 font-bold underline inline-flex items-center gap-0.5">Supabase.com <ExternalLink className="w-3 h-3 inline" /></a> and click <strong>&quot;Start your project for free&quot;</strong>.
                </li>
                <li>
                  Create a new free database (select Region: <em>South Asia / Mumbai</em> for fastest India performance).
                </li>
                <li>
                  Click on <strong>SQL Editor</strong> in the left sidebar, paste the SQL schema below, and click <strong>&quot;Run&quot;</strong>.
                </li>
                <li>
                  Go to <strong>Project Settings → API</strong>, copy your <strong>Project URL</strong> and <strong>anon/public key</strong>.
                </li>
                <li>
                  Add them to your environment variables file (<code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-amber-900">.env.local</code>):
                </li>
              </ol>

              {/* Env block */}
              <div className="relative bg-stone-950 text-stone-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto">
                <pre>{envSampleText}</pre>
                <button
                  type="button"
                  onClick={copyEnv}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-white text-[11px] flex items-center gap-1"
                >
                  {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEnv ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Complete SQL Schema */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Complete PostgreSQL Migration Script:
                  </span>
                  <button
                    type="button"
                    onClick={copySql}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'SQL Script Copied!' : 'Copy SQL Schema Script'}</span>
                  </button>
                </div>

                <div className="bg-stone-950 text-stone-300 p-4 rounded-2xl font-mono text-[11px] max-h-72 overflow-y-auto leading-relaxed border border-stone-800">
                  <pre>{SUPABASE_SCHEMA_SQL}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
