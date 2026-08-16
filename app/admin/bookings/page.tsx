'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Search,
  Filter,
  FileSpreadsheet,
  Phone,
  MessageCircle,
  ArrowUpRight,
  Sparkles,
  Calendar,
  RefreshCw,
  Trash2,
  SlidersHorizontal,
  MapPin,
  Clock
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { dataStore, subscribeToDataChanges } from '@/lib/data-store';
import { Booking, BookingStatus } from '@/lib/types';
import { formatDate, formatINR, exportBookingsToCSV, createWhatsAppLink, createTelLink } from '@/lib/utils';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedEventType, setSelectedEventType] = useState<string>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'event_date_asc' | 'event_date_desc'>('newest');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const list = await dataStore.getBookings({
        status: selectedStatus,
        eventType: selectedEventType,
        search: searchQuery,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sortBy,
      });
      setBookings(list);
    } catch (e) {
      console.error('Error fetching bookings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToDataChanges(loadData);
    return () => unsub();
  }, [searchQuery, selectedStatus, selectedEventType, startDate, endDate, sortBy]);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    await dataStore.updateBookingStatus(id, newStatus);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setSelectedEventType('All');
    setStartDate('');
    setEndDate('');
    setSortBy('newest');
  };

  const handleExportCSV = () => {
    const filename = `dreamevents-bookings-${selectedStatus.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
    exportBookingsToCSV(bookings, filename);
  };

  const handleClearDemoBookings = async () => {
    if (window.confirm('Delete all bookings? Real customer bookings you receive later will start with a fresh list.')) {
      if (typeof (dataStore as any).clearDemoBookings === 'function') {
        await (dataStore as any).clearDemoBookings();
      } else {
        const all = await dataStore.getBookings();
        for (const b of all) {
          await dataStore.deleteBooking(b.id);
        }
      }
    }
  };

  const handleCreateTestBooking = async () => {
    try {
      const test = await dataStore.createBooking({
        decoration_name: 'Royal Rose Floral Wedding Stage',
        request_type: 'STANDARD',
        customer_name: 'Nishant Test Client',
        phone: '+91 90641 77811',
        whatsapp: '+91 90641 77811',
        email: 'chnishantpoco123@gmail.com',
        event_type: 'Wedding',
        event_date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
        event_time: '18:30',
        guest_count: 350,
        venue_name: 'Grand Celebration Hall',
        venue_address: 'Aam Bagan, Malancha',
        city: 'Kharagpur',
        pincode: '721301',
        indoor_outdoor: 'Indoor',
        special_requirements: 'Test booking to verify live cloud synchronization across phone & laptop.',
        estimated_min_price: 25000,
        estimated_max_price: 40000,
        status: 'New Enquiry',
      });
      await loadData();
    } catch (e: any) {
      console.error('Test booking error:', e);
    }
  };

  const handleDeleteSingle = async (id: string, name: string) => {
    if (window.confirm(`Delete booking enquiry for ${name}?`)) {
      await dataStore.deleteBooking(id);
    }
  };

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

  const statuses = [
    'All',
    'New Enquiry',
    'Contacted',
    'Quotation Sent',
    'Awaiting Confirmation',
    'Confirmed',
    'Advance Paid',
    'Fully Paid',
    'Completed',
    'Cancelled',
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900">
              Customer Bookings & Enquiries
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Search, filter by status or date range, update quotes, and export to CSV.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCreateTestBooking}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>+ Create Test Booking</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            {bookings.length > 0 && (
              <button
                type="button"
                onClick={handleClearDemoBookings}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-sm"
                title="Delete all demo/sample enquiries"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Clear All Bookings</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          {/* Top Search Bar */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name, phone, Booking ID (e.g. DEC-2026-00001), venue..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full md:w-auto px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-700 outline-none"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="event_date_asc">Sort: Event Date (Soonest)</option>
                <option value="event_date_desc">Sort: Event Date (Latest)</option>
              </select>

              <button
                type="button"
                onClick={resetFilters}
                className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-semibold"
                title="Reset filters"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Bar: Status & Dates */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-stone-100 text-xs">
            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin flex-1">
              {statuses.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedStatus === st
                      ? 'bg-amber-600 text-white font-bold shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-amber-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Date Range Picker */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-stone-400 font-medium">Event Date:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1 rounded-lg border border-stone-200 text-xs bg-stone-50 outline-none"
                placeholder="From"
              />
              <span className="text-stone-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1 rounded-lg border border-stone-200 text-xs bg-stone-50 outline-none"
                placeholder="To"
              />
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          {bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase font-bold border-b border-stone-200">
                  <tr>
                    <th className="py-3.5 px-4">Booking ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Phone / WhatsApp</th>
                    <th className="py-3.5 px-4">Decoration Concept</th>
                    <th className="py-3.5 px-4">Event Date & Time</th>
                    <th className="py-3.5 px-4">Venue</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Created Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-700">
                        <Link href={`/admin/bookings/${b.id}`} className="hover:underline flex items-center gap-1">
                          <span>{b.booking_number}</span>
                        </Link>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-stone-900">
                        <div>{b.customer_name}</div>
                        {b.guest_count && (
                          <div className="text-[10px] text-stone-400 font-normal">
                            {b.guest_count} guests
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-stone-700">{b.phone}</span>
                          <a
                            href={createWhatsAppLink(b.whatsapp || b.phone, `Hi ${b.customer_name}! This is Dream Events regarding your booking ${b.booking_number}...`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700"
                            title="Open WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-stone-800 font-medium">
                        <div className="line-clamp-1">{b.decoration_name || 'Custom Concept'}</div>
                        {b.request_type === 'CUSTOM' && (
                          <span className="inline-block px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[9px] font-bold">
                            CUSTOM REQUEST
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-stone-700">
                        <div className="font-semibold">{formatDate(b.event_date)}</div>
                        <div className="text-[10px] text-stone-400 font-medium">
                          {b.event_type} ({b.event_time || 'Day'})
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-stone-600 max-w-[140px] truncate">
                        <div>{b.venue_name}</div>
                        <div className="text-[10px] text-stone-400">{b.city}</div>
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

                      <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                        {formatDate(b.created_at)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/bookings/${b.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-200"
                          >
                            <span>Manage</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteSingle(b.id, b.customer_name)}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Delete this booking"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-stone-900">
                No Bookings Yet — List is Fresh & Ready!
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                Your booking list is clean. When a customer scans your QR code or submits an enquiry on your website, it will immediately appear here.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCreateTestBooking}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create a Test Booking to Verify Sync</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
