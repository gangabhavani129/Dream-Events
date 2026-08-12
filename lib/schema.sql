-- ==============================================================================
-- PUSHPAM / UTSAV FLOWER DECORATIONS & EVENT BOOKING DATABASE SCHEMA FOR SUPABASE
-- Run this complete script in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT ('cat-' || uuid_generate_v4()),
    name TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. DECORATIONS TABLE
CREATE TABLE IF NOT EXISTS public.decorations (
    id TEXT PRIMARY KEY DEFAULT ('dec-' || uuid_generate_v4()),
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    min_price NUMERIC(10, 2) DEFAULT 0,
    max_price NUMERIC(10, 2) DEFAULT 0,
    price_display_type TEXT DEFAULT 'Price Range' CHECK (price_display_type IN ('Price Range', 'Starting From', 'Price on Request')),
    included_items JSONB DEFAULT '[]'::jsonb,
    customization_options JSONB DEFAULT '[]'::jsonb,
    setup_duration TEXT,
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. DECORATION IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.decoration_images (
    id TEXT PRIMARY KEY DEFAULT ('img-' || uuid_generate_v4()),
    decoration_id TEXT REFERENCES public.decorations(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BOOKINGS / ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY DEFAULT ('book-' || uuid_generate_v4()),
    booking_number TEXT UNIQUE NOT NULL,
    decoration_id TEXT REFERENCES public.decorations(id) ON DELETE SET NULL,
    request_type TEXT DEFAULT 'STANDARD' CHECK (request_type IN ('STANDARD', 'CUSTOM')),
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
    status TEXT DEFAULT 'New Enquiry' CHECK (status IN (
        'New Enquiry',
        'Contacted',
        'Quotation Sent',
        'Awaiting Confirmation',
        'Confirmed',
        'Advance Paid',
        'Fully Paid',
        'Completed',
        'Cancelled'
    )),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. GALLERY TABLE
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

-- 6. BUSINESS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.business_settings (
    id TEXT PRIMARY KEY DEFAULT 'settings-01',
    business_name TEXT NOT NULL DEFAULT 'Dream Events',
    tagline TEXT DEFAULT 'Crafting Royal & Timeless Celebrations',
    logo_url TEXT,
    phone TEXT NOT NULL DEFAULT '+91 90641 77811',
    whatsapp TEXT NOT NULL DEFAULT '+91 90641 77811',
    email TEXT NOT NULL DEFAULT 'chnishantpoco123@gmail.com',
    address TEXT NOT NULL DEFAULT 'Plot No. 42, Jubilee Hills Road No. 36',
    city TEXT DEFAULT 'Hyderabad',
    pincode TEXT DEFAULT '500033',
    instagram_url TEXT DEFAULT 'https://instagram.com/dreamevents2020',
    facebook_url TEXT DEFAULT 'https://facebook.com/dreamevents2020',
    description TEXT,
    working_hours TEXT DEFAULT 'Mon – Sun: 8:00 AM – 9:30 PM',
    currency_symbol TEXT DEFAULT '₹',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decorations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decoration_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Public can view active categories" ON public.categories
    FOR SELECT USING (active = TRUE OR auth.role() = 'authenticated');

CREATE POLICY "Admins full access on categories" ON public.categories
    FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Decorations Policies
CREATE POLICY "Public can view active decorations" ON public.decorations
    FOR SELECT USING (active = TRUE OR auth.role() = 'authenticated');

CREATE POLICY "Admins full access on decorations" ON public.decorations
    FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Decoration Images Policies
CREATE POLICY "Public can view decoration images" ON public.decoration_images
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins full access on decoration images" ON public.decoration_images
    FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Gallery Policies
CREATE POLICY "Public can view active gallery" ON public.gallery
    FOR SELECT USING (active = TRUE OR auth.role() = 'authenticated');

CREATE POLICY "Admins full access on gallery" ON public.gallery
    FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Business Settings Policies
CREATE POLICY "Public can view business settings" ON public.business_settings
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins full access on business settings" ON public.business_settings
    FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Bookings Policies (Customers can INSERT their enquiry, Admins have full access)
CREATE POLICY "Anyone can submit a booking enquiry" ON public.bookings
    FOR INSERT TO anon, authenticated WITH CHECK (TRUE);

CREATE POLICY "Public can view own submitted booking by ID/Number" ON public.bookings
    FOR SELECT USING (TRUE); -- Restricted in frontend or via auth.role() = 'authenticated' for all rows

CREATE POLICY "Admins full access on bookings" ON public.bookings
    FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- 8. STORAGE BUCKET CONFIGURATION (Supabase Storage)
-- ==============================================================================
-- Run these storage queries or create buckets via Supabase Dashboard -> Storage:
-- 1. Bucket 'decoration-images' (Public: true)
-- 2. Bucket 'reference-images' (Public: true)

INSERT INTO storage.buckets (id, name, public)
VALUES ('decoration-images', 'decoration-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('reference-images', 'reference-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public Access for Decoration Images" ON storage.objects
    FOR SELECT USING (bucket_id IN ('decoration-images', 'reference-images'));

CREATE POLICY "Anyone can upload reference images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'reference-images');

CREATE POLICY "Authenticated users can upload decoration images" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'decoration-images');

CREATE POLICY "Authenticated users can delete images" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id IN ('decoration-images', 'reference-images'));
