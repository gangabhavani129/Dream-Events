'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  MapPin,
  Clock,
  User,
  ArrowUpRight
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { dataStore, subscribeToDataChanges } from '@/lib/data-store';
import { Booking } from '@/lib/types';
import { formatDate, formatINR } from '@/lib/utils';

export default function AdminCalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // Default Sep 2026 for sample data or current date
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const loadBookings = async () => {
    const list = await dataStore.getBookings();
    setBookings(list);
  };

  useEffect(() => {
    loadBookings();
    const unsub = subscribeToDataChanges(loadBookings);
    return () => unsub();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map bookings to day strings "YYYY-MM-DD"
  const bookingsByDate: Record<string, Booking[]> = {};
  bookings.forEach((b) => {
    if (b.status !== 'Cancelled') {
      if (!bookingsByDate[b.event_date]) {
        bookingsByDate[b.event_date] = [];
      }
      bookingsByDate[b.event_date].push(b);
    }
  });

  // Check for dates with multiple events
  const datesWithMultiple = Object.keys(bookingsByDate).filter(
    (d) => bookingsByDate[d].length > 1 && d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)
  );

  const activeSelectedBookings = selectedDay ? bookingsByDate[selectedDay] || [] : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900">
              Event Schedule Calendar
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Visual monthly calendar view of flower setups, wedding stages, and event dates.
            </p>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-stone-200 shadow-sm self-start sm:self-auto">
            <button
              type="button"
              onClick={prevMonth}
              className="p-2 rounded-xl hover:bg-stone-100 text-stone-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-heading font-bold text-sm text-stone-900 px-2 min-w-[140px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-2 rounded-xl hover:bg-stone-100 text-stone-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Warning Banner for Multiple Events on Same Date (Section 18) */}
        {datesWithMultiple.length > 0 && (
          <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">
                ⚠️ Multiple events scheduled on {datesWithMultiple.map((d) => formatDate(d)).join(', ')}
              </strong>
              <p className="text-stone-600 text-xs mt-0.5">
                Ensure you have adequate florist teams and vehicle logistics allocated for these simultaneous dates.
              </p>
            </div>
          </div>
        )}

        {/* Calendar Grid */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-stone-400 uppercase tracking-wider pb-2 border-b border-stone-100">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Blank leading days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[80px] sm:min-h-[100px] bg-stone-50/50 rounded-2xl p-2 border border-transparent" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayEvents = bookingsByDate[dateStr] || [];
              const isSelected = selectedDay === dateStr;
              const hasMultiple = dayEvents.length > 1;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDay(dateStr)}
                  className={`min-h-[80px] sm:min-h-[105px] rounded-2xl p-2 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-400 shadow-md'
                      : dayEvents.length > 0
                      ? 'border-amber-200 bg-white hover:bg-amber-50/30'
                      : 'border-stone-100 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                        dayEvents.length > 0 ? 'bg-amber-600 text-white' : 'text-stone-700'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {hasMultiple && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800" title="Multiple events on this day">
                        {dayEvents.length} events
                      </span>
                    )}
                  </div>

                  {/* Event pills */}
                  <div className="space-y-1 mt-1.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className="text-[10px] font-bold p-1 rounded-lg bg-stone-100 text-stone-800 truncate border border-stone-200"
                      >
                        {ev.event_type}: {ev.customer_name}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] text-amber-700 font-bold text-center">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Event Drawer */}
        {selectedDay && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-xs uppercase font-bold text-amber-700">Events for Date</span>
                <h3 className="font-heading text-lg font-bold text-stone-900">
                  {formatDate(selectedDay)}
                </h3>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-stone-100 text-stone-700">
                {activeSelectedBookings.length} booking(s)
              </span>
            </div>

            {activeSelectedBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSelectedBookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-700">{b.booking_number}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {b.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{b.decoration_name}</h4>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Client: <strong>{b.customer_name}</strong> ({b.phone})
                      </p>
                    </div>

                    <div className="text-xs text-stone-500 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Setup Time: {b.event_time || 'Full day'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>Venue: {b.venue_name}, {b.city}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200 flex justify-end">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800"
                      >
                        <span>Open Full Booking</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 py-4 text-center">
                No events currently scheduled on this day.
              </p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
