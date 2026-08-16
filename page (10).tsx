'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  ClipboardList,
  Image as ImageIcon,
  QrCode,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  Phone,
  MessageCircle,
  FileSpreadsheet,
  Layers,
  ChevronRight
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { dataStore, subscribeToDataChanges } from '@/lib/data-store';
import { Booking, Decoration, BookingStatus } from '@/lib/types';
import { formatINR, formatDate, exportBookingsToCSV, createWhatsAppLink, createTelLink } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [allBookings, allDecs] = await Promise.all([
        dataStore.getBookings(),
        dataStore.getDecorations()
      ]);
      setBookings(allBookings);
      setDecorations(allDecs);
    } catch (e) {
      console.error('Admin dashboard load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToDataChanges(loadData);
    const interval = setInterval(loadData, 4000);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  // Compute KPI cards
  const newEnquiriesCount = bookings.filter((b) => b.status === 'New Enquiry').length;
  const pendingBookingsCount = bookings.filter(
    (b) => b.status === 'Contacted' || b.status === 'Quotation Sent' || b.status === 'Awaiting Confirmation'
  ).length;
  const confirmedBookingsCount = bookings.filter(
    (b) => b.status === 'Confirmed' || b.status === 'Advance Paid' || b.status === 'Fully Paid'
  ).length;

  // Upcoming events this month
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const upcomingThisMonthCount = bookings.filter(
    (b) => b.event_date.startsWith(currentMonthStr) && b.status !== 'Cancelled'
  ).length;

  const completedCount = bookings.filter((b) => b.status === 'Completed').length;

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    await dataStore.updateBookingStatus(id, newStatus);
  };

  const recentEnquiries = bookings.slice(0, 6);

  const statusColors: Record<string, string> = {
    'New Enquiry': 'bg-rose-100 text-rose-800 border-rose-200',
    'Contacted': 'bg-blue-100 text-blue-800 border-blue-200',
    'Quotation Sent': 'bg-purple-100 text-purple-800 border-purple-200',
    'Awaiting Confirmation': 'bg-amber-100 text-amber-800 border-amber-200',
    'Confirmed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Advance Paid': 'bg-teal-100 text-teal-800 border-teal-200',
    'Fully Paid': 'bg-emerald-200 text-emerald-900 border-emerald-300',
    'Completed': 'bg-stone-200 text-stone-800 border-stone-300',
    'Cancelled': 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Header & Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900">
              Business Overview Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Live tracking of customer enquiries, upcoming dates, and decoration bookings.
            </p>
          </div>

          {/* Quick Actions Row */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/decorations/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Decoration</span>
            </Link>

            <button
              type="button"
              onClick={() => exportBookingsToCSV(bookings)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* KPI METRIC CARDS (Section 15) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {/* Card 1: New Enquiries */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-200/80 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-rose-700 tracking-wider">
                New Enquiries
              </span>
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-2 font-mono">
              {newEnquiriesCount}
            </div>
            <span className="text-[10px] text-rose-600 font-medium block mt-1">
              Requires initial callback
            </span>
          </div>

          {/* Card 2: Pending Bookings */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-amber-700 tracking-wider">
                Pending Bookings
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-2 font-mono">
              {pendingBookingsCount}
            </div>
            <span className="text-[10px] text-amber-700 font-medium block mt-1">
              Quote sent / discussing
            </span>
          </div>

          {/* Card 3: Confirmed Bookings */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-emerald-700 tracking-wider">
                Confirmed
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-2 font-mono">
              {confirmedBookingsCount}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium block mt-1">
              Locked on schedule
            </span>
          </div>

          {/* Card 4: Upcoming Events (This Month) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-purple-200/80 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-purple-700 tracking-wider">
                This Month
              </span>
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-2 font-mono">
              {upcomingThisMonthCount}
            </div>
            <span className="text-[10px] text-purple-600 font-medium block mt-1">
              Upcoming setups
            </span>
          </div>

          {/* Card 5: Completed Events */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-stone-600 tracking-wider">
                Completed
              </span>
              <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-2 font-mono">
              {completedCount}
            </div>
            <span className="text-[10px] text-stone-500 font-medium block mt-1">
              Successfully executed
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* QUICK ACTION BUTTON BAR (Section 15) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <Link
            href="/admin/decorations/new"
            className="p-4 bg-white hover:bg-amber-50/50 rounded-2xl border border-stone-200 hover:border-amber-400 transition-all flex items-center gap-3 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block group-hover:text-amber-700">
                + Add Decoration
              </span>
              <span className="text-[10px] text-stone-500">Publish new design</span>
            </div>
          </Link>

          <Link
            href="/admin/bookings"
            className="p-4 bg-white hover:bg-amber-50/50 rounded-2xl border border-stone-200 hover:border-amber-400 transition-all flex items-center gap-3 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block group-hover:text-blue-700">
                View Bookings
              </span>
              <span className="text-[10px] text-stone-500">All {bookings.length} enquiries</span>
            </div>
          </Link>

          <Link
            href="/admin/gallery"
            className="p-4 bg-white hover:bg-amber-50/50 rounded-2xl border border-stone-200 hover:border-amber-400 transition-all flex items-center gap-3 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block group-hover:text-rose-700">
                Upload Gallery
              </span>
              <span className="text-[10px] text-stone-500">Add past event photos</span>
            </div>
          </Link>

          <Link
            href="/admin/qr-code"
            className="p-4 bg-white hover:bg-amber-50/50 rounded-2xl border border-stone-200 hover:border-amber-400 transition-all flex items-center gap-3 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block group-hover:text-emerald-700">
                Download QR Code
              </span>
              <span className="text-[10px] text-stone-500">Printable counter stand</span>
            </div>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* RECENT ENQUIRIES TABLE */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-bold text-stone-900">
                Recent Customer Enquiries
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Click any enquiry to review requirements or update quotation.
              </p>
            </div>

            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View All Enquiries</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase font-bold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Decoration</th>
                  <th className="py-3 px-4">Event Date</th>
                  <th className="py-3 px-4">Venue</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentEnquiries.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-700">
                      <Link href={`/admin/bookings/${b.id}`} className="hover:underline">
                        {b.booking_number}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      <div>{b.customer_name}</div>
                      <div className="text-[11px] text-stone-400 font-normal">{b.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-700 font-medium">
                      {b.decoration_name || 'Custom Concept'}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 font-medium">
                      <div>{formatDate(b.event_date)}</div>
                      <div className="text-[10px] text-stone-400">{b.event_type}</div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 max-w-[150px] truncate">
                      {b.venue_name}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={b.status}
                        onChange={(e: any) => handleStatusChange(b.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${
                          statusColors[b.status] || 'bg-stone-100 text-stone-800'
                        }`}
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
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={createWhatsAppLink(b.whatsapp || b.phone, `Hi ${b.customer_name}! Regarding your enquiry for ${b.decoration_name}...`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          title="WhatsApp Customer"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg font-bold"
                          title="View Details"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
