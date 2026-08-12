# Dream Events — Flower Decorations & Event Booking Application

A full-stack, mobile-first Indian event decoration catalog and booking management platform designed for **Dream Events** (Owner: **Nishant**, Phone / WhatsApp: **+91 90641 77811**, Email: **chnishantpoco123@gmail.com**, Instagram: **@dreamevents2020**).

---

## 🌟 Key Features

1. **Customer Mobile Experience (QR Code First)**:
   - **Homepage**: Hero heading *"Beautiful Decorations for Your Special Moments"*, subtitle, categories bar, featured collections, process steps.
   - **Catalog & Search**: Live search by name, flower type, theme (e.g. *rose*, *haldi*, *pink stage*, *mandap*), category pills, and price sorting.
   - **Decoration Details**: High-resolution gallery, price range in Indian Rupees (₹), included items checklist, customization options, setup duration, and price disclaimer notice.
   - **6-Step Booking Stepper**: Decoration picker, event details, venue info (with "Venue not finalized yet" option), contact details, optional reference photo upload, review, and instant confirmation.
   - **Booking Confirmation**: Confetti celebration, unique Booking ID format (`DEC-2026-XXXXX`), summary card, direct **Call Us** & **WhatsApp Us** links (+91 90641 77811) with pre-filled booking details.
   - **Photo Gallery**: Portfolio of past events with filter categories and lightbox modal.
   - **Custom Decoration Request**: *"Have a Different Decoration Idea?"* flow for bespoke events.
   - **Floating WhatsApp Button**: Dynamic click-to-chat to **+91 90641 77811** on every customer page using business settings.
   - **Social Integration**: Instagram handle `@dreamevents2020` (`https://instagram.com/dreamevents2020`).

2. **Admin Management Portal (`/admin`)**:
   - **Authentication**: Protected `/admin/*` routes with email & password (Owner Login: `chnishantpoco123@gmail.com` or `9064177811` / `admin123`).
   - **Dashboard**: Real-time KPI cards (*New Enquiries*, *Pending Bookings*, *Confirmed Bookings*, *Upcoming Events this Month*, *Completed Events*), quick actions, and recent enquiries with instant status dropdowns.
   - **Decoration CRUD**: Add, edit, delete, activate/hide decorations, upload multiple photos, set primary photo, reorder, change prices and descriptions.
   - **Categories CRUD**: Manage all categories (Weddings, Mandaps, Reception Stages, Haldi, Mehendi, Birthdays, etc.).
   - **Bookings Management**: Table with live search, status filters, date range filters, 1-click WhatsApp message generators, final quotation updater, and private notes.
   - **Booking Calendar**: Monthly event calendar with multiple events warning (*"Multiple events scheduled on this date"*).
   - **CSV Export**: One-click download of all or filtered customer bookings for Excel/Google Sheets.
   - **QR Code Studio**: 100% free, non-expiring QR code pointing to the permanent catalog URL, with printable Table Stand Display and Minimalist card templates.
   - **Business Settings & Supabase Setup**: Manage business name (Dream Events), owner contact (+91 90641 77811), email (`chnishantpoco123@gmail.com`), Instagram (`@dreamevents2020`), address, social links, working hours, and view complete Supabase SQL schema.

---

## 🚀 Easy Non-Technical Guide for Nishant (Owner)

### 1. How do I add a new decoration?
1. Open the **Admin Portal** at `/admin` (Login with `chnishantpoco123@gmail.com` or `9064177811` / `admin123`).
2. Click the **"+ Add Decoration"** button on the top right.
3. Enter the **Decoration Title** (e.g., *Pink Floral Pastel Wedding Stage*).
4. Select the **Category** from the dropdown.
5. Enter the **Price Range** (e.g., Min: `₹35,000`, Max: `₹55,000`).
6. Click **Upload Photos** to pick photos from your phone/computer. Click **"Set Primary"** on the best photo.
7. Add your description and click **"Publish Decoration"**.
👉 *It will immediately appear on the Dream Events catalog!*

### 2. How do I change a price?
1. Go to **Admin → Decorations Catalog** (`/admin/decorations`).
2. Click **"Edit"** next to the decoration.
3. Change the **Minimum Price** or **Maximum Price**.
4. Click **"Save & Update"**.
👉 *The new price is updated across the customer catalog immediately.*

### 3. How do I see a customer's booking?
1. Go to **Admin → Bookings & Enquiries** (`/admin/bookings`).
2. You will see all customer enquiries listed with their name, phone, event date, venue, and status.
3. Click **"Manage"** to view their full requirements and any photos they uploaded.
4. Click the **"WhatsApp Customer"** button to automatically send an availability confirmation or quotation directly to their phone.

### 4. How do I upload photos?
1. When adding or editing any decoration, click the **"Upload Photos"** box.
2. Select one or multiple images from your phone gallery or files.
3. Reorder them using the **← / →** arrow buttons, or click the **Star icon** to set the primary cover photo.

### 5. How do I download or print my QR code?
1. Go to **Admin → QR Code Studio** (`/admin/qr-code`).
2. Click **"Download High-Res QR"** to save the QR image to your phone/computer.
3. Or click **"Print Display Stand"** to print a ready-made **Dream Events** Table Display Stand with your phone number **+91 90641 77811**.
👉 *This QR code points to your permanent catalog link (`/decorations`). You only need to print it once; any future decorations you add will automatically show up when customers scan it!*

---

## 🗄️ Supabase Database & Free Tier Setup

The application features a **dual-layer architecture**:
- Out-of-the-box, it runs seamlessly with persistent browser storage (IndexedDB / LocalStorage) preloaded with 14 rich sample decorations, categories, gallery photos, and business settings.
- To connect your live Supabase database, follow these steps:

### Step 1: Create Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. Select Region: **South Asia (Mumbai)**.

### Step 2: Run SQL Migration Script
1. Open your Supabase Dashboard → **SQL Editor**.
2. Copy and paste the contents of `lib/schema.sql` (also available directly inside Admin Settings → Supabase Connection).
3. Click **"Run"**.

### Step 3: Add Environment Variables
Create a file named `.env.local` in the project root:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
\`\`\`

Restart the server and all data will sync directly to Supabase with full Row Level Security (RLS) protection!

---

## 💰 Free Tier Breakdown

| Component | Free Tier Service | Limit | Upgrade Cost if Exceeded |
|---|---|---|---|
| **Database & Auth** | Supabase Free Tier | 500 MB DB, 50,000 MAU | $25/mo Pro tier |
| **File / Photo Storage** | Supabase Storage | 1 GB Storage, 2 GB egress | Included in Supabase Pro |
| **Hosting** | Vercel / Netlify / Cloudflare | 100 GB Bandwidth/mo | Free for small businesses |
| **QR Codes** | Client-side `qrcode.react` | Unlimited, Permanent | 100% Free forever (No paid QR API) |
| **CSV Exports** | Client-side UTF-8 generator | Unlimited | 100% Free forever |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS with custom Indian royal gold & floral palette
- **Icons**: Lucide React
- **Database & Auth**: Supabase PostgreSQL + Row Level Security (with local persistent fallback)
- **QR Engine**: Canvas-based `qrcode.react`
- **Animations & Effects**: Canvas Confetti & Tailwind Animations
