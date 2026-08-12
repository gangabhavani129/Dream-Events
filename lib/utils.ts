import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price in Indian Rupee format (e.g. ₹25,000)
export function formatINR(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) return '₹0';
  const num = Number(amount);
  return '₹' + num.toLocaleString('en-IN');
}

// Format price display based on type
export function formatPriceDisplay(
  minPrice: number,
  maxPrice: number,
  displayType: 'Price Range' | 'Starting From' | 'Price on Request'
): string {
  if (displayType === 'Price on Request') {
    return 'Price on Request';
  }
  if (displayType === 'Starting From') {
    return `Starting from ${formatINR(minPrice)}`;
  }
  if (minPrice === maxPrice || !maxPrice) {
    return formatINR(minPrice);
  }
  return `${formatINR(minPrice)} – ${formatINR(maxPrice)}`;
}

// Format date nicely (e.g., "18 Sep 2026")
export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

// Generate unique Booking ID (Format: DEC-2026-00001)
export function generateBookingNumber(sequenceNumber: number): string {
  const currentYear = new Date().getFullYear();
  const padded = String(sequenceNumber).padStart(5, '0');
  return `DEC-${currentYear}-${padded}`;
}

// WhatsApp direct click-to-chat URL generator with encoded message
export function createWhatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

// Direct phone call URL
export function createTelLink(phone: string): string {
  const cleaned = phone.replace(/[^0-9+]/g, '');
  return `tel:${cleaned}`;
}

// Export bookings to CSV file download
export function exportBookingsToCSV(bookings: any[], filename = 'decor-bookings.csv') {
  const headers = [
    'Booking ID',
    'Customer Name',
    'Phone',
    'WhatsApp',
    'Email',
    'Decoration Name',
    'Request Type',
    'Event Type',
    'Event Date',
    'Event Time',
    'Guest Count',
    'Venue Name',
    'Venue Address',
    'City',
    'Pincode',
    'Indoor/Outdoor',
    'Venue Contact',
    'Special Requirements',
    'Estimated Min Price',
    'Estimated Max Price',
    'Final Quoted Price',
    'Status',
    'Admin Notes',
    'Created Date'
  ];

  const escapeCSV = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = bookings.map((b) => [
    escapeCSV(b.booking_number),
    escapeCSV(b.customer_name),
    escapeCSV(b.phone),
    escapeCSV(b.whatsapp),
    escapeCSV(b.email || ''),
    escapeCSV(b.decoration_name || ''),
    escapeCSV(b.request_type || 'STANDARD'),
    escapeCSV(b.event_type),
    escapeCSV(b.event_date),
    escapeCSV(b.event_time || ''),
    escapeCSV(b.guest_count || ''),
    escapeCSV(b.venue_name),
    escapeCSV(b.venue_address || ''),
    escapeCSV(b.city || ''),
    escapeCSV(b.pincode || ''),
    escapeCSV(b.indoor_outdoor || ''),
    escapeCSV(b.venue_contact || ''),
    escapeCSV(b.special_requirements || ''),
    escapeCSV(b.estimated_min_price || 0),
    escapeCSV(b.estimated_max_price || 0),
    escapeCSV(b.final_quoted_price || ''),
    escapeCSV(b.status),
    escapeCSV(b.admin_notes || ''),
    escapeCSV(b.created_at)
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Convert image file to base64 with compression
export function compressImageToBase64(file: File, maxWidth = 1400, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
