export type PriceDisplayType = 'Price Range' | 'Starting From' | 'Price on Request';

export type BookingStatus =
  | 'New Enquiry'
  | 'Contacted'
  | 'Quotation Sent'
  | 'Awaiting Confirmation'
  | 'Confirmed'
  | 'Advance Paid'
  | 'Fully Paid'
  | 'Completed'
  | 'Cancelled';

export type RequestType = 'STANDARD' | 'CUSTOM';

export interface Category {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DecorationImage {
  id: string;
  decoration_id: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
  created_at?: string;
}

export interface Decoration {
  id: string;
  category_id: string;
  category_name?: string;
  name: string;
  description: string;
  min_price: number;
  max_price: number;
  price_display_type: PriceDisplayType;
  included_items: string[];
  customization_options: string[];
  setup_duration: string;
  active: boolean;
  images: DecorationImage[];
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: string;
  booking_number: string; // e.g. DEC-2026-00001
  decoration_id?: string | null;
  decoration_name?: string;
  request_type?: RequestType;
  customer_name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  event_type: string;
  event_date: string; // YYYY-MM-DD
  event_time?: string;
  guest_count?: number;
  venue_name: string;
  venue_address: string;
  city: string;
  pincode: string;
  indoor_outdoor: 'Indoor' | 'Outdoor' | 'Both' | 'Not Decided';
  venue_contact?: string;
  special_requirements?: string;
  reference_image_urls?: string[];
  estimated_min_price?: number;
  estimated_max_price?: number;
  final_quoted_price?: number;
  status: BookingStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  category_id?: string;
  category_name?: string;
  active: boolean;
  created_at?: string;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  tagline?: string;
  logo_url?: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city?: string;
  pincode?: string;
  instagram_url?: string;
  facebook_url?: string;
  description: string;
  working_hours: string;
  currency_symbol: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: 'admin';
}
