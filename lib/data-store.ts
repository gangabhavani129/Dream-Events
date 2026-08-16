import { supabase, isSupabaseConfigured } from './supabase';
import {
  Category,
  Decoration,
  DecorationImage,
  Booking,
  GalleryItem,
  BusinessSettings,
  BookingStatus
} from './types';
import {
  INITIAL_CATEGORIES,
  INITIAL_DECORATIONS,
  INITIAL_GALLERY,
  INITIAL_BUSINESS_SETTINGS,
  INITIAL_BOOKINGS
} from './sample-data';
import { generateBookingNumber, compressImageToBase64 } from './utils';

const STORAGE_KEYS = {
  CATEGORIES: 'dreamevents_categories_v4',
  DECORATIONS: 'dreamevents_decorations_v4',
  GALLERY: 'dreamevents_gallery_v4',
  SETTINGS: 'dreamevents_settings_v4',
  BOOKINGS: 'dreamevents_bookings_v4',
  BOOKING_SEQ: 'dreamevents_booking_sequence_v4',
  SUPABASE_CONFIG_OVERRIDE: 'dreamevents_supabase_override_v4'
};

// Event emitter helper for reactive updates
type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeToDataChanges(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyChange() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Listener error:', e);
    }
  });
}

class DataStore {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // --- Initialize storage on first load ---
  private initLocalStorage() {
    if (!this.isBrowser()) return;

    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DECORATIONS)) {
      localStorage.setItem(STORAGE_KEYS.DECORATIONS, JSON.stringify(INITIAL_DECORATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_BUSINESS_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKING_SEQ)) {
      localStorage.setItem(STORAGE_KEYS.BOOKING_SEQ, '5');
    }
  }

  // Check if live Supabase is active
  public isUsingSupabase(): boolean {
    return isSupabaseConfigured;
  }

  // -------------------------------------------------------------
  // CATEGORIES
  // -------------------------------------------------------------
  async getCategories(activeOnly = false): Promise<Category[]> {
    if (this.isUsingSupabase() && supabase) {
      try {
        let query = supabase.from('categories').select('*').order('display_order', { ascending: true });
        if (activeOnly) query = query.eq('active', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data as Category[];
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local store:', err);
      }
    }

    this.initLocalStorage();
    if (!this.isBrowser()) return INITIAL_CATEGORIES;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      const list: Category[] = raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
      const sorted = list.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      return activeOnly ? sorted.filter((c) => c.active) : sorted;
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const list = await this.getCategories();
    return list.find((c) => c.id === id) || null;
  }

  async saveCategory(category: Partial<Category> & { name: string }): Promise<Category> {
    const now = new Date().toISOString();
    const categories = await this.getCategories();
    let saved: Category;

    if (category.id) {
      // Update
      const index = categories.findIndex((c) => c.id === category.id);
      saved = {
        ...categories[index],
        ...category,
        updated_at: now
      } as Category;
      if (index !== -1) {
        categories[index] = saved;
      } else {
        categories.push(saved);
      }
    } else {
      // Create new
      const newId = `cat-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      saved = {
        id: newId,
        name: category.name,
        description: category.description || '',
        display_order: category.display_order ?? categories.length + 1,
        active: category.active !== undefined ? category.active : true,
        created_at: now,
        updated_at: now
      };
      categories.push(saved);
    }

    if (this.isUsingSupabase() && supabase) {
      try {
        await supabase.from('categories').upsert(saved);
      } catch (e) {
        console.warn('Supabase category upsert error:', e);
      }
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }
    notifyChange();
    return saved;
  }

  async deleteCategory(id: string): Promise<boolean> {
    let list = await this.getCategories();
    list = list.filter((c) => c.id !== id);

    if (this.isUsingSupabase() && supabase) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase category delete error:', e);
      }
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(list));
    }
    notifyChange();
    return true;
  }

  // -------------------------------------------------------------
  // DECORATIONS
  // -------------------------------------------------------------
  async getDecorations(options?: {
    activeOnly?: boolean;
    categoryId?: string;
    search?: string;
    priceMax?: number;
    priceMin?: number;
  }): Promise<Decoration[]> {
    let decorations: Decoration[] = [];

    if (this.isUsingSupabase() && supabase) {
      try {
        let query = supabase
          .from('decorations')
          .select('*, decoration_images(*), categories(name)')
          .order('created_at', { ascending: false });

        if (options?.activeOnly) query = query.eq('active', true);
        if (options?.categoryId && options.categoryId !== 'all') query = query.eq('category_id', options.categoryId);

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          decorations = data.map((item: any) => ({
            ...item,
            category_name: item.categories?.name,
            images: (item.decoration_images || []).sort((a: any, b: any) => a.display_order - b.display_order)
          }));
        }
      } catch (err) {
        console.warn('Supabase decor query fallback:', err);
      }
    }

    if (decorations.length === 0) {
      this.initLocalStorage();
      if (!this.isBrowser()) return INITIAL_DECORATIONS;
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.DECORATIONS);
        decorations = raw ? JSON.parse(raw) : INITIAL_DECORATIONS;
      } catch {
        decorations = INITIAL_DECORATIONS;
      }
    }

    // Populate category_name if missing
    const categories = await this.getCategories();
    decorations = decorations.map((dec) => {
      if (!dec.category_name) {
        const cat = categories.find((c) => c.id === dec.category_id);
        return { ...dec, category_name: cat?.name || 'Special Event' };
      }
      return dec;
    });

    // Apply Filters
    if (options?.activeOnly) {
      decorations = decorations.filter((d) => d.active);
    }
    if (options?.categoryId && options.categoryId !== 'all') {
      decorations = decorations.filter((d) => d.category_id === options.categoryId);
    }
    if (options?.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      decorations = decorations.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.category_name && d.category_name.toLowerCase().includes(q)) ||
          d.description.toLowerCase().includes(q) ||
          (d.included_items && d.included_items.some((i) => i.toLowerCase().includes(q)))
      );
    }
    if (options?.priceMin !== undefined) {
      decorations = decorations.filter((d) => d.min_price >= (options.priceMin || 0));
    }
    if (options?.priceMax !== undefined && options.priceMax > 0) {
      decorations = decorations.filter((d) => d.min_price <= (options.priceMax || 999999));
    }

    return decorations;
  }

  async getDecorationById(id: string): Promise<Decoration | null> {
    const list = await this.getDecorations();
    return list.find((d) => d.id === id) || null;
  }

  async saveDecoration(data: Partial<Decoration> & { name: string; category_id: string }): Promise<Decoration> {
    const now = new Date().toISOString();
    const decorations = await this.getDecorations();
    const categories = await this.getCategories();
    const cat = categories.find((c) => c.id === data.category_id);

    let saved: Decoration;

    if (data.id) {
      // Update
      const index = decorations.findIndex((d) => d.id === data.id);
      saved = {
        ...decorations[index],
        ...data,
        category_name: cat?.name || 'General',
        updated_at: now
      } as Decoration;
      if (index !== -1) {
        decorations[index] = saved;
      } else {
        decorations.unshift(saved);
      }
    } else {
      // Create new
      const newId = `dec-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      saved = {
        id: newId,
        category_id: data.category_id,
        category_name: cat?.name || 'General',
        name: data.name,
        description: data.description || '',
        min_price: Number(data.min_price) || 0,
        max_price: Number(data.max_price) || 0,
        price_display_type: data.price_display_type || 'Price Range',
        included_items: data.included_items || [],
        customization_options: data.customization_options || [],
        setup_duration: data.setup_duration || '4 to 5 hours',
        active: data.active !== undefined ? data.active : true,
        featured: data.featured || false,
        images: data.images || [],
        created_at: now,
        updated_at: now
      };
      decorations.unshift(saved);
    }

    if (this.isUsingSupabase() && supabase) {
      try {
        const { images, category_name, ...dbPayload } = saved;
        await supabase.from('decorations').upsert(dbPayload);

        // sync images
        if (saved.images && saved.images.length > 0) {
          await supabase.from('decoration_images').delete().eq('decoration_id', saved.id);
          const imagesToInsert = saved.images.map((img, idx) => ({
            id: img.id || `img-${saved.id}-${idx}`,
            decoration_id: saved.id,
            image_url: img.image_url,
            display_order: idx + 1,
            is_primary: idx === 0 || img.is_primary
          }));
          await supabase.from('decoration_images').insert(imagesToInsert);
        }
      } catch (e) {
        console.warn('Supabase decoration upsert error:', e);
      }
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.DECORATIONS, JSON.stringify(decorations));
    }
    notifyChange();
    return saved;
  }

  async deleteDecoration(id: string): Promise<boolean> {
    let list = await this.getDecorations();
    list = list.filter((d) => d.id !== id);

    if (this.isUsingSupabase() && supabase) {
      try {
        await supabase.from('decorations').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase decor delete error:', e);
      }
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.DECORATIONS, JSON.stringify(list));
    }
    notifyChange();
    return true;
  }

  async toggleDecorationActive(id: string, active: boolean): Promise<Decoration | null> {
    const list = await this.getDecorations();
    const item = list.find((d) => d.id === id);
    if (!item) return null;
    return this.saveDecoration({ ...item, active });
  }

  // -------------------------------------------------------------
  // BOOKINGS / ENQUIRIES
  // -------------------------------------------------------------
  async getBookings(options?: {
    status?: string;
    eventType?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: 'newest' | 'oldest' | 'event_date_asc' | 'event_date_desc';
  }): Promise<Booking[]> {
    let bookings: Booking[] = [];
    let fetchedFromSupabase = false;

    if (this.isUsingSupabase() && supabase) {
      try {
        let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
        if (options?.status && options.status !== 'All') query = query.eq('status', options.status);
        if (options?.eventType && options.eventType !== 'All') query = query.eq('event_type', options.eventType);
        
        const { data, error } = await query;
        if (!error && Array.isArray(data)) {
          bookings = data as Booking[];
          fetchedFromSupabase = true;
        } else if (error) {
          console.error('Supabase getBookings error:', error);
        }
      } catch (err) {
        console.error('Supabase bookings query exception:', err);
      }
    }

    // If Supabase didn't respond or is local, use local storage
    if (!fetchedFromSupabase) {
      this.initLocalStorage();
      if (this.isBrowser()) {
        try {
          const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
          bookings = raw ? JSON.parse(raw) : [];
        } catch {
          bookings = [];
        }
      }
    }

    // Filter
    if (options?.status && options.status !== 'All') {
      bookings = bookings.filter((b) => b.status === options.status);
    }
    if (options?.eventType && options.eventType !== 'All') {
      bookings = bookings.filter((b) => b.event_type.toLowerCase() === options.eventType!.toLowerCase());
    }
    if (options?.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      bookings = bookings.filter(
        (b) =>
          b.booking_number.toLowerCase().includes(q) ||
          b.customer_name.toLowerCase().includes(q) ||
          b.phone.toLowerCase().includes(q) ||
          (b.whatsapp && b.whatsapp.toLowerCase().includes(q)) ||
          (b.decoration_name && b.decoration_name.toLowerCase().includes(q)) ||
          (b.venue_name && b.venue_name.toLowerCase().includes(q)) ||
          (b.city && b.city.toLowerCase().includes(q))
      );
    }
    if (options?.startDate) {
      bookings = bookings.filter((b) => b.event_date >= options.startDate!);
    }
    if (options?.endDate) {
      bookings = bookings.filter((b) => b.event_date <= options.endDate!);
    }

    // Sort
    const sortBy = options?.sortBy || 'newest';
    bookings.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'event_date_asc') return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
      if (sortBy === 'event_date_desc') return new Date(b.event_date).getTime() - new Date(a.event_date).getTime();
      return 0;
    });

    return bookings;
  }

  async getBookingById(id: string): Promise<Booking | null> {
    if (this.isUsingSupabase() && supabase) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .or(`id.eq.${id},booking_number.eq.${id}`)
          .maybeSingle();
        if (!error && data) return data as Booking;
      } catch (e) {
        console.error('Supabase getBookingById error:', e);
      }
    }

    const list = await this.getBookings();
    return list.find((b) => b.id === id || b.booking_number === id) || null;
  }

  async createBooking(data: Omit<Booking, 'id' | 'booking_number' | 'created_at' | 'updated_at' | 'status'> & { status?: BookingStatus }): Promise<Booking> {
    const now = new Date().toISOString();
    let nextSeq = Math.floor(1000 + Math.random() * 9000);
    if (this.isBrowser()) {
      const currentSeq = parseInt(localStorage.getItem(STORAGE_KEYS.BOOKING_SEQ) || '5', 10);
      nextSeq = currentSeq + 1;
      localStorage.setItem(STORAGE_KEYS.BOOKING_SEQ, nextSeq.toString());
    }

    const bookingNumber = generateBookingNumber(nextSeq);
    const newId = `book-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const newBooking: Booking = {
      ...data,
      id: newId,
      booking_number: bookingNumber,
      decoration_name: data.decoration_name || 'Event Decoration',
      status: data.status || 'New Enquiry',
      created_at: now,
      updated_at: now
    };

    if (this.isUsingSupabase() && supabase) {
      try {
        const payload: any = {
          id: newBooking.id,
          booking_number: newBooking.booking_number,
          decoration_id: newBooking.decoration_id || null,
          decoration_name: newBooking.decoration_name || 'Event Decoration',
          request_type: newBooking.request_type || 'STANDARD',
          customer_name: newBooking.customer_name,
          phone: newBooking.phone,
          whatsapp: newBooking.whatsapp || newBooking.phone,
          email: newBooking.email || null,
          event_type: newBooking.event_type || 'Special Event',
          event_date: newBooking.event_date || new Date().toISOString().split('T')[0],
          event_time: newBooking.event_time || '18:00',
          guest_count: Number(newBooking.guest_count) || 100,
          venue_name: newBooking.venue_name || 'Kharagpur Venue',
          venue_address: newBooking.venue_address || null,
          city: newBooking.city || 'Kharagpur',
          pincode: newBooking.pincode || '721301',
          indoor_outdoor: newBooking.indoor_outdoor || 'Indoor',
          venue_contact: newBooking.venue_contact || null,
          special_requirements: newBooking.special_requirements || null,
          reference_image_urls: Array.isArray(newBooking.reference_image_urls) ? newBooking.reference_image_urls : [],
          estimated_min_price: Number(newBooking.estimated_min_price) || 0,
          estimated_max_price: Number(newBooking.estimated_max_price) || 0,
          final_quoted_price: newBooking.final_quoted_price ? Number(newBooking.final_quoted_price) : null,
          status: newBooking.status || 'New Enquiry',
          admin_notes: newBooking.admin_notes || null,
          created_at: newBooking.created_at,
          updated_at: newBooking.updated_at
        };

        let { error } = await supabase.from('bookings').insert(payload);
        
        // If error is about foreign key constraint on decoration_id, retry with decoration_id = null
        if (error && (error.message?.includes('foreign key') || error.message?.includes('violates') || error.code === '23503')) {
          payload.decoration_id = null;
          const retry = await supabase.from('bookings').insert(payload);
          error = retry.error;
        }

        // If error is about missing column in an older schema, retry safely
        if (error && error.message && error.message.includes('decoration_name')) {
          delete payload.decoration_name;
          const retry = await supabase.from('bookings').insert(payload);
          error = retry.error;
        }

        if (error) {
          console.error('Supabase booking insert error:', error);
        } else {
          console.log('✅ Booking saved to Supabase successfully:', newBooking.booking_number);
        }
      } catch (e) {
        console.error('Supabase booking insert exception:', e);
      }
    }

    if (this.isBrowser()) {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
        const list: Booking[] = raw ? JSON.parse(raw) : [];
        list.unshift(newBooking);
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
      } catch (e) {
        console.error('LocalStorage write error:', e);
      }
    }

    notifyChange();
    return newBooking;
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | null> {
    const list = await this.getBookings();
    const item = list.find((b) => b.id === id);
    if (!item) return null;

    const now = new Date().toISOString();
    item.status = status;
    item.updated_at = now;

    if (this.isUsingSupabase() && supabase) {
      try {
        await supabase.from('bookings').update({ status, updated_at: now }).eq('id', id);
      } catch (e) {
        console.warn('Supabase booking update error:', e);
      }
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
    }
    notifyChange();
    return item;
  }

  async updateBookingNotes(id: string, admin_notes: string): Promise<Booking | null> {
    const list = await this.getBookings();
    const item = list.find((b) => b.id === id);
    if (!item) return null;

    const now = new Date().toISOString();
    item.admin_notes = admin_notes;
    item.updated_at = now;

    if (this.isUsingSupabase() && supabase) {
      try {
        await supabase.from('bookings').update({ admin_notes, updated_at: now }).eq('id', id);
      } catch (e) {
        console.warn('Supabase booking notes error:', e);
      }
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
    }
    notifyChange();
    return item;
  }

  async updateBookingFinalQuote(id: string, final_quoted_price: number): Promise<Booking | null> {
    const list = await this.getBookings();
    const item = list.find((b) => b.id === id);
    if (!item) return null;

    const now = new Date().toISOString();
    item.final_quoted_price = final_quoted_price;
    item.updated_at = now;

    if (this.isUsingSupabase() && supabase) {
      try {
        await supabase.from('bookings').update({ final_quoted_price, updated_at: now }).eq('id', id);
      } catch (e) {
        console.warn('Supabase final quote error:', e);
      }
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
    }
    notifyChange();
    return item;
  }

  async deleteBooking(id: string): Promise<boolean> {
    let list = await this.getBookings();
    list = list.filter((b) => b.id !== id);

    if (this.isUsingSupabase() && supabase) {
      try {
        await supabase.from('bookings').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase booking delete error:', e);
      }
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
    }
    notifyChange();
    return true;
  }

  async clearDemoBookings(): Promise<boolean> {
    if (this.isUsingSupabase() && supabase) {
      try {
        await supabase.from('bookings').delete().neq('id', '');
      } catch (e) {
        console.warn('Supabase clear bookings error:', e);
      }
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
    }
    notifyChange();
    return true;
  }

  // -------------------------------------------------------------
  // GALLERY
  // -------------------------------------------------------------
  async getGallery(activeOnly = false): Promise<GalleryItem[]> {
    if (this.isUsingSupabase() && supabase) {
      try {
        let query = supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (activeOnly) query = query.eq('active', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data as GalleryItem[];
      } catch (e) {
        console.warn('Supabase gallery fetch error:', e);
      }
    }

    this.initLocalStorage();
    if (!this.isBrowser()) return INITIAL_GALLERY;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GALLERY);
      const list: GalleryItem[] = raw ? JSON.parse(raw) : INITIAL_GALLERY;
      return activeOnly ? list.filter((g) => g.active) : list;
    } catch {
      return INITIAL_GALLERY;
    }
  }

  async saveGalleryItem(data: Partial<GalleryItem> & { title: string; image_url: string }): Promise<GalleryItem> {
    const list = await this.getGallery();
    const now = new Date().toISOString();
    let saved: GalleryItem;

    if (data.id) {
      const index = list.findIndex((g) => g.id === data.id);
      saved = {
        ...list[index],
        ...data,
      } as GalleryItem;
      if (index !== -1) list[index] = saved;
      else list.unshift(saved);
    } else {
      const newId = `gal-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      saved = {
        id: newId,
        title: data.title,
        description: data.description || '',
        image_url: data.image_url,
        category_name: data.category_name || 'Decorations',
        active: data.active !== undefined ? data.active : true,
        created_at: now
      };
      list.unshift(saved);
    }

    if (this.isUsingSupabase() && supabase) {
      try {
        await supabase.from('gallery').upsert(saved);
      } catch (e) {
        console.warn('Supabase gallery upsert error:', e);
      }
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(list));
    }
    notifyChange();
    return saved;
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    let list = await this.getGallery();
    list = list.filter((g) => g.id !== id);

    if (this.isUsingSupabase() && supabase) {
      try {
        await supabase.from('gallery').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase gallery delete error:', e);
      }
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(list));
    }
    notifyChange();
    return true;
  }

  // -------------------------------------------------------------
  // BUSINESS SETTINGS
  // -------------------------------------------------------------
  async getBusinessSettings(): Promise<BusinessSettings> {
    if (this.isUsingSupabase() && supabase) {
      try {
        const { data, error } = await supabase.from('business_settings').select('*').limit(1).single();
        if (!error && data) return data as BusinessSettings;
      } catch (e) {
        console.warn('Supabase settings query error:', e);
      }
    }

    this.initLocalStorage();
    if (!this.isBrowser()) return INITIAL_BUSINESS_SETTINGS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return raw ? JSON.parse(raw) : INITIAL_BUSINESS_SETTINGS;
    } catch {
      return INITIAL_BUSINESS_SETTINGS;
    }
  }

  async updateBusinessSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const current = await this.getBusinessSettings();
    const updated: BusinessSettings = {
      ...current,
      ...settings,
      updated_at: new Date().toISOString()
    };

    if (this.isUsingSupabase() && supabase) {
      try {
        await supabase.from('business_settings').upsert(updated);
      } catch (e) {
        console.warn('Supabase settings update error:', e);
      }
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    }
    notifyChange();
    return updated;
  }

  // -------------------------------------------------------------
  // IMAGE STORAGE UPLOAD (Supabase bucket + local compressed Base64)
  // -------------------------------------------------------------
  async uploadImage(file: File, bucket = 'decoration-images'): Promise<string> {
    // 1. If real Supabase storage is configured, upload directly
    if (this.isUsingSupabase() && supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (!uploadError) {
          const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
          if (data?.publicUrl) {
            return data.publicUrl;
          }
        }
      } catch (e) {
        console.warn('Supabase storage upload failed, falling back to compressed base64:', e);
      }
    }

    // 2. High-performance fallback: Compress file to optimized Web Base64 data URI
    return await compressImageToBase64(file);
  }

  // -------------------------------------------------------------
  // RESET / SAMPLE DATA MANAGEMENT
  // -------------------------------------------------------------
  resetToSampleData() {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.DECORATIONS, JSON.stringify(INITIAL_DECORATIONS));
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_BUSINESS_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.BOOKING_SEQ, '5');
    notifyChange();
  }

  clearAllData() {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.DECORATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
    notifyChange();
  }
}

export const dataStore = new DataStore();
