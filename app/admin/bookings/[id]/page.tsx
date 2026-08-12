'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  MessageCircle,
  Mail,
  Users,
  Save,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Trash2,
  Sparkles,
  DollarSign,
  Copy,
  Check,
  Send
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { dataStore, subscribeToDataChanges } from '@/lib/data-store';
import { Booking, BookingStatus, BusinessSettings } from '@/lib/types';
import { formatDate, formatINR, createWhatsAppLink, createTelLink } from '@/lib/utils';

export default function AdminBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [status, setStatus] = useState<BookingStatus>('New Enquiry');
  const [finalQuote, setFinalQuote] = useState<number | string>('');
  const [adminNotes, setAdminNotes] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [b, st] = await Promise.all([
        dataStore.getBookingById(id),
        dataStore.getBusinessSettings()
      ]);
      if (b) {
        setBooking(b);
        setStatus(b.status);
        setFinalQuote(b.final_quoted_price || '');
        setAdminNotes(b.admin_notes || '');
      }
      setSettings(st);
    } catch (e) {
      console.error('Error loading booking detail:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToDataChanges(loadData);
    return () => unsub();
  }, [id]);

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    await Promise.all([
      dataStore.updateBookingStatus(booking.id, status),
      dataStore.updateBookingNotes(booking.id, adminNotes),
      finalQuote ? dataStore.updateBookingFinalQuote(booking.id, Number(finalQuote)) : Promise.resolve()
    ]);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDelete = async () => {
    if (!booking) return;
    if (window.confirm(`Permanently delete booking ${booking.booking_number}? This cannot be undone.`)) {
      await dataStore.deleteBooking(booking.id);
      router.push('/admin/bookings');
    }
  };

  const copyBookingNumber = () => {
    if (!booking) return;
    navigator.clipboard.writeText(booking.booking_number);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-20 text-center text-stone-500">Loading booking information...</div>
      </AdminLayout>
    );
  }

  if (!booking) {
    return (
      <AdminLayout>
        <div className="py-20 text-center space-y-4">
          <h2 className="text-xl font-bold text-stone-900">Booking Not Found</h2>
          <Link href="/admin/bookings" className="text-xs text-amber-700 font-bold">
            ← Back to All Bookings
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const businessName = settings?.business_name || 'Utsav Flower Decorations';
  const customerPhone = booking.whatsapp || booking.phone;

  // WhatsApp quick response templates
  const waTemplates = [
    {
      title: '1. Quotation & Availability',
      text: `Hi ${booking.customer_name}! Greetings from ${businessName}. Regarding your enquiry for "${booking.decoration_name}" on ${formatDate(booking.event_date)} at ${booking.venue_name}: Our team is available on this date. The estimated quotation for your setup is ${finalQuote ? formatINR(finalQuote) : `${formatINR(booking.estimated_min_price)} - ${formatINR(booking.estimated_max_price)}`}. Let us know if you would like to customize the flower theme!`
    },
    {
      title: '2. Confirmation & Advance Request',
      text: `Hi ${booking.customer_name}! To lock your event date (${formatDate(booking.event_date)}) for the "${booking.decoration_name}" setup, kindly confirm with a token advance. We will send the decorator team allocation receipt immediately.`
    },
    {
      title: '3. Setup Timing Coordination',
      text: `Hi ${booking.customer_name}! Our decoration setup team will arrive at ${booking.venue_name} at ${booking.event_time || '10:00 AM'} on ${formatDate(booking.event_date)} for floral stage installation. Please share the venue manager contact.`
    }
  ];

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Breadcrumb & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/bookings"
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg sm:text-xl font-black text-amber-700">
                  {booking.booking_number}
                </span>
                <button
                  type="button"
                  onClick={copyBookingNumber}
                  className="p-1 text-stone-400 hover:text-stone-700"
                  title="Copy ID"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-stone-500">
                Submitted on {formatDate(booking.created_at)} • Request: {booking.request_type || 'STANDARD'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Booking details and admin notes updated successfully!</span>
          </div>
        )}

        {/* Main Grid: Left Details & Right Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ================= LEFT: CUSTOMER & EVENT DETAILS ================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* Customer Details Card */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-stone-100 pb-2 flex items-center justify-between">
                <span>Customer Information</span>
                <span className="text-[10px] text-stone-400 font-normal">Contact directly</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 block mb-0.5">Full Name</span>
                  <span className="font-bold text-stone-900 text-sm">{booking.customer_name}</span>
                </div>

                <div>
                  <span className="text-stone-400 block mb-0.5">Phone Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-stone-900">{booking.phone}</span>
                    <a
                      href={createTelLink(booking.phone)}
                      className="p-1 rounded bg-amber-50 text-amber-700 hover:bg-amber-100"
                      title="Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-stone-400 block mb-0.5">WhatsApp Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-stone-900">{booking.whatsapp || booking.phone}</span>
                    <a
                      href={createWhatsAppLink(booking.whatsapp || booking.phone, `Hi ${booking.customer_name}!`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-stone-400 block mb-0.5">Email Address</span>
                  <span className="text-stone-800 font-medium">{booking.email || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Event & Venue Card */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-stone-100 pb-2">
                Event & Venue Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 block mb-0.5">Event Type</span>
                  <span className="font-bold text-stone-900 text-sm">{booking.event_type}</span>
                </div>

                <div>
                  <span className="text-stone-400 block mb-0.5">Event Date & Time</span>
                  <span className="font-bold text-stone-900 text-sm">
                    {formatDate(booking.event_date)} ({booking.event_time || 'Full Day'})
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 block mb-0.5">Approx. Guest Count</span>
                  <span className="font-semibold text-stone-900">{booking.guest_count || 'Not specified'} guests</span>
                </div>

                <div>
                  <span className="text-stone-400 block mb-0.5">Setup Location Type</span>
                  <span className="font-semibold text-stone-900">{booking.indoor_outdoor || 'Indoor'}</span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-stone-400 block mb-0.5">Venue Name & Address</span>
                  <div className="font-bold text-stone-900">{booking.venue_name}</div>
                  <div className="text-stone-600 mt-0.5">
                    {booking.venue_address ? `${booking.venue_address}, ` : ''}{booking.city} {booking.pincode ? `(${booking.pincode})` : ''}
                  </div>
                </div>

                {booking.venue_contact && (
                  <div className="sm:col-span-2">
                    <span className="text-stone-400 block mb-0.5">Venue Contact / Manager</span>
                    <span className="font-medium text-stone-800">{booking.venue_contact}</span>
                  </div>
                )}

                {booking.special_requirements && (
                  <div className="sm:col-span-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="font-bold text-amber-900 block mb-1 text-xs">Customer Special Notes:</span>
                    <p className="text-stone-700 leading-relaxed">{booking.special_requirements}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reference Photos if uploaded */}
            {booking.reference_image_urls && booking.reference_image_urls.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Customer Uploaded Reference Images ({booking.reference_image_urls.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {booking.reference_image_urls.map((imgUrl, i) => (
                    <a
                      key={i}
                      href={imgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-[4/3] rounded-xl overflow-hidden border border-stone-200 bg-stone-100 hover:opacity-90 transition-opacity"
                    >
                      <img src={imgUrl} alt={`Reference ${i + 1}`} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT: STATUS, QUOTES & WHATSAPP ================= */}
          <div className="lg:col-span-5 space-y-6">
            {/* Status & Final Quote Form */}
            <form onSubmit={handleSaveDetails} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-stone-100 pb-2">
                Booking Status & Quotation
              </h3>

              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Enquiry Status
                </label>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white font-bold text-xs outline-none"
                >
                  <option value="New Enquiry">New Enquiry</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quotation Sent">Quotation Sent</option>
                  <option value="Awaiting Confirmation">Awaiting Confirmation</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Advance Paid">Advance Paid</option>
                  <option value="Fully Paid">Fully Paid</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Final Quoted Price (₹)
                </label>
                <input
                  type="number"
                  step="500"
                  value={finalQuote}
                  onChange={(e) => setFinalQuote(e.target.value)}
                  placeholder="e.g. 35000"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-bold font-mono outline-none"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  Catalog range: {formatINR(booking.estimated_min_price)} – {formatINR(booking.estimated_max_price)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Private Admin Notes (Internal Only)
                </label>
                <textarea
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Spoke with client on phone. Agreed on pastel rose upgrade. ₹10,000 advance received via UPI."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Status & Notes</span>
              </button>
            </form>

            {/* 1-Click WhatsApp Message Generators */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>1-Click WhatsApp Quick Replies</span>
              </div>

              <div className="space-y-2">
                {waTemplates.map((t, idx) => (
                  <div key={idx} className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs space-y-2">
                    <div className="font-bold text-emerald-950">{t.title}</div>
                    <p className="text-[11px] text-stone-600 line-clamp-2 italic">{t.text}</p>
                    <a
                      href={createWhatsAppLink(customerPhone, t.text)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send to Customer</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
