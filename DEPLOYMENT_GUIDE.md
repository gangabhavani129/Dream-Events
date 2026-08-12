# 🚀 Dream Events — Step-by-Step Free Deployment Guide

This guide will walk you (**Nishant**) through deploying your **Dream Events** website and admin management system to the internet on **100% Free Tiers** using **Supabase** (Free Database & Storage) and **Vercel** (Free Next.js Hosting).

---

## 📋 What You Need (All Free)
1. **GitHub Account**: To store your project code ([github.com](https://github.com)).
2. **Supabase Account**: Free PostgreSQL database and image storage ([supabase.com](https://supabase.com)).
3. **Vercel Account**: Free high-speed global hosting for your website ([vercel.com](https://vercel.com)).

---

## 🔹 STEP 1: Set Up Free Supabase Database & Storage (5 Minutes)

1. Go to **[https://supabase.com](https://supabase.com)** and click **"Start your project for free"**.
2. Sign in with GitHub or your Google email (**`chnishantpoco123@gmail.com`**).
3. Click **"New Project"**:
   - **Name**: `dream-events-db`
   - **Database Password**: Enter a strong password and save it in a safe place.
   - **Region**: Select **`South Asia (Mumbai) [ap-south-1]`** (Fastest for Indian visitors).
   - **Pricing Plan**: Free ($0/month).
   - Click **"Create new project"** (takes ~1 minute to initialize).

### Run the SQL Database Setup
4. In your Supabase Dashboard, click on **"SQL Editor"** in the left sidebar.
5. Click **"New query"**.
6. Open the file `lib/schema.sql` from your project folder, copy all contents, paste them into the SQL editor, and click **"Run"** (or press Ctrl+Enter).
   - *This will instantly create your `decorations`, `categories`, `bookings`, `gallery`, and `business_settings` tables, plus Row Level Security (RLS) policies and storage buckets!*

### Copy Your API Keys
7. In the left sidebar, click on the ⚙️ **Project Settings** (gear icon) → **API**.
8. Note down these two values:
   - **Project URL**: `https://xxxxxxxxxxxxxxxx.supabase.co`
   - **Project API Keys (`anon` / `public`)**: `eyJhbGciOiJIUzI1NiIsIn...`

---

## 🔹 STEP 2: Upload Your Code to GitHub (3 Minutes)

1. Go to **[https://github.com](https://github.com)** and log in.
2. Click **"New"** (or "+" on top right) to create a new repository:
   - **Repository Name**: `dream-events`
   - **Visibility**: **Private** (recommended) or Public.
   - Click **"Create repository"**.
3. In your local terminal or project folder, initialize git and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Dream Events portal"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/dream-events.git
   git push -u origin main
   ```

---

## 🔹 STEP 3: Deploy to Vercel for Free (2 Minutes)

1. Go to **[https://vercel.com](https://vercel.com)** and click **"Sign Up"** → choose **"Continue with GitHub"**.
2. On your Vercel Dashboard, click **"Add New..."** → **"Project"**.
3. Find your `dream-events` GitHub repository and click **"Import"**.
4. In the configuration screen:
   - **Framework Preset**: `Next.js` (automatically detected).
   - Expand the **"Environment Variables"** dropdown and add these two keys from Step 1:
     - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
       - **Value**: *(Paste your Supabase Project URL)*
     - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
       - **Value**: *(Paste your Supabase anon/public key)*
5. Click **"Deploy"**!

🎉 *In about 60 seconds, Vercel will build and launch your live website with a free HTTPS URL like `dream-events.vercel.app`!*

---

## 🔹 STEP 4: Connect a Custom Domain (Optional)

If you own or want to buy a domain name like `dreamevents.in` or `dreamevents.com`:
1. In Vercel, go to **Project Settings → Domains**.
2. Type your domain name (e.g. `dreamevents.in`) and click **"Add"**.
3. Vercel will give you two DNS records (A record or CNAME). Add them into your domain registrar (GoDaddy, Namecheap, Hostinger, etc.).
4. Vercel will automatically generate a free SSL certificate (HTTPS padlock 🔒) within a few minutes.

---

## 🔹 STEP 5: Verify & Start Operating Your Business

1. **Visit your live URL** on your mobile phone:
   - `https://dream-events.vercel.app/`
2. **Submit a test booking enquiry**:
   - Go through the 6-step booking stepper.
   - Check that you get the booking ID (`DEC-2026-00001`).
3. **Log into the Admin Portal**:
   - Go to `https://dream-events.vercel.app/admin/login`
   - Email: **`chnishantpoco123@gmail.com`** (or `9064177811`)
   - Password: **`admin123`**
4. **Print your QR Code**:
   - Go to **Admin → QR Code Studio** (`/admin/qr-code`).
   - Click **"Print Display Stand"** or **"Download High-Res QR"**.
   - Place this printed stand on your banquet table, exhibition stall, or reception counter.
5. **Manage on the go**:
   - Add new stage photos from your phone.
   - Reply to customers via WhatsApp in 1 click!

---

## 💰 Cost Summary

| Service | Plan | Monthly Cost |
|---|---|---|
| **Next.js Website Hosting (Vercel)** | Hobby Free Tier | **₹0 / month** |
| **PostgreSQL Database (Supabase)** | Free Tier | **₹0 / month** |
| **Image Storage (Supabase Storage)** | Free Tier (1 GB) | **₹0 / month** |
| **QR Code Generation** | Local Canvas | **₹0 / month (Forever)** |
| **SSL Certificate (HTTPS)** | Automatic Vercel SSL | **₹0 / month** |
| **Total Operating Cost** | | **₹0 / month** |
