'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  User,
  Phone,
  MessageCircle,
  Mail,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Building,
  Check
} from 'lucide-react';
import { Decoration, BookingStatus, RequestType } from '@/lib/types';
import { dataStore } from '@/lib/data-store';
import { formatINR, formatPriceDisplay } from '@/lib/utils';

interface BookingFormProps {
  initialDecorationId?: string;
  isCustomRequest?: boolean;
}

export default function BookingModalOrStepper({
  initialDecorationId,
  isCustomRequest = false,
}: BookingFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedId = initialDecorationId || searchParams.get('decorationId') || '';

  const [currentStep, setCurrentStep] = useState(1);
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [selectedDecoration, setSelectedDecoration] = useState<Decoration | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Decoration
    decoration_id: preselectedId || '',
    decoration_name: '',
    request_type: (isCustomRequest ? 'CUSTOM' : 'STANDARD') as RequestType,

    // Step 2: Event Details
    event_type: 'Wedding',
    event_date: '',
    event_time: '18:00',
    guest_count: 200,
    special_requirements: '',

    // Step 3: Venue
    venue_name: '',
    venue_address: '',
    city: 'Kharagpur',
    pincode: '721301',
    indoor_outdoor: 'Indoor' as 'Indoor' | 'Outdoor' | 'Both' | 'Not Decided',
    venue_contact: '',
    venue_not_finalized: false,

    // Step 4: Customer Details
    customer_name: '',
    phone: '',
    whatsapp: '',
    email: '',

    // Step 5: Reference Images
    reference_images: [] as string[],
  });

  const [sameAsPhone, setSameAsPhone] = useState(true);

  // Load all active decorations
  useEffect(() => {
    const load = async () => {
      const list = await dataStore.getDecorations({ activeOnly: true });
      setDecorations(list);

      if (preselectedId) {
        const found = list.find((d) => d.id === preselectedId);
        if (found) {
          setSelectedDecoration(found);
          setFormData((prev) => ({
            ...prev,
            decoration_id: found.id,
            decoration_name: found.name,
          }));
        }
      } else if (list.length > 0 && !isCustomRequest) {
        setSelectedDecoration(list[0]);
        setFormData((prev) => ({
          ...prev,
          decoration_id: list[0].id,
          decoration_name: list[0].name,
        }));
      }
    };
    load();
  }, [preselectedId, isCustomRequest]);

  const handleDecorationChange = (decId: string) => {
    const found = decorations.find((d) => d.id === decId);
    if (found) {
      setSelectedDecoration(found);
      setFormData((prev) => ({
        ...prev,
        decoration_id: found.id,
        decoration_name: found.name,
      }));
    }
  };

  const handleReferenceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploaded: string[] = [...formData.reference_images];
      for (let i = 0; i < files.length; i++) {
        if (uploaded.length >= 5) break;
        const base64 = await dataStore.uploadImage(files[i], 'reference-images');
        uploaded.push(base64);
      }
      setFormData((prev) => ({ ...prev, reference_images: uploaded }));
    } catch (err) {
      setErrorMsg('Failed to process image. Please choose a smaller file.');
    }
  };

  const removeReferenceImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      reference_images: prev.reference_images.filter((_, i) => i !== index),
    }));
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    setErrorMsg('');

    if (step === 1) {
      if (!isCustomRequest && !formData.decoration_id) {
        setErrorMsg('Please select a decoration theme.');
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!formData.event_type) {
        setErrorMsg('Please select an event type.');
        return false;
      }
      if (!formData.event_date) {
        setErrorMsg('Please select the date of your celebration.');
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (!formData.venue_not_finalized && !formData.venue_name.trim()) {
        setErrorMsg('Please enter your venue or banquet hall name (or check "Venue not finalized yet").');
        return false;
      }
      return true;
    }

    if (step === 4) {
      if (!formData.customer_name.trim()) {
        setErrorMsg('Please enter your full name.');
        return false;
      }
      const cleanedPhone = formData.phone.replace(/[^0-9]/g, '');
      if (cleanedPhone.length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number.');
        return false;
      }
      return true;
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setErrorMsg('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) {
      setCurrentStep(4);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const minPrice = selectedDecoration?.min_price || (isCustomRequest ? 15000 : 0);
      const maxPrice = selectedDecoration?.max_price || (isCustomRequest ? 40000 : 0);

      const booking = await dataStore.createBooking({
        decoration_id: isCustomRequest ? null : formData.decoration_id,
        decoration_name: isCustomRequest
          ? (formData.decoration_name || 'Custom Floral Concept')
          : (selectedDecoration?.name || 'Selected Decoration'),
        request_type: formData.request_type,
        customer_name: formData.customer_name.trim(),
        phone: formData.phone.trim(),
        whatsapp: sameAsPhone ? formData.phone.trim() : formData.whatsapp.trim(),
        email: formData.email.trim() || undefined,
        event_type: formData.event_type,
        event_date: formData.event_date,
        event_time: formData.event_time,
        guest_count: Number(formData.guest_count) || 100,
        venue_name: formData.venue_not_finalized
          ? 'Venue not finalized yet'
          : formData.venue_name.trim(),
        venue_address: formData.venue_address.trim(),
        city: formData.city.trim() || 'Kharagpur',
        pincode: formData.pincode.trim() || '721301',
        indoor_outdoor: formData.indoor_outdoor,
        venue_contact: formData.venue_contact.trim(),
        special_requirements: formData.special_requirements.trim(),
        reference_image_urls: formData.reference_images,
        estimated_min_price: minPrice,
        estimated_max_price: maxPrice,
        status: 'New Enquiry',
      });

      router.push(`/booking-confirmation/${booking.id}`);
    } catch (err: any) {
      console.error('Booking submission error:', err);
      setErrorMsg('Something went wrong. Please try again or contact us directly on WhatsApp.');
      setLoading(false);
    }
  };

  const eventTypeOptions = [
    'Wedding',
    'Engagement',
    'Reception',
    'Birthday',
    'Baby Shower',
    'Naming Ceremony',
    'Haldi',
    'Mehendi',
    'Housewarming (Gruhapravesam)',
    'Anniversary',
    'Cradle Ceremony',
    'Custom Event',
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-amber-900/10 overflow-hidden">
      {/* Header Stepper Bar */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-rose-700 p-6 text-white text-center relative">
        <span className="text-xs uppercase font-bold tracking-widest text-amber-200 block mb-1">
          {isCustomRequest ? 'Custom Proposal Request' : 'Event Decoration Enquiry'}
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold">
          {currentStep === 1 && 'Step 1: Select Decoration'}
          {currentStep === 2 && 'Step 2: Event Details'}
          {currentStep === 3 && 'Step 3: Venue Information'}
          {currentStep === 4 && 'Step 4: Contact Details'}
          {currentStep === 5 && 'Step 5: Reference Images'}
          {currentStep === 6 && 'Step 6: Review & Submit'}
        </h2>
        <p className="text-amber-100/90 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
          {currentStep === 6
            ? 'Review your details and submit. No payment is required right now.'
            : 'Fill in your requirements below. Our decoration stylists will contact you with availability and final quotation.'}
        </p>

        {/* Step Indicator Pills */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-5">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentStep === step
                  ? 'w-8 sm:w-10 bg-white'
                  : currentStep > step
                  ? 'w-3 sm:w-4 bg-amber-300'
                  : 'w-2 bg-amber-900/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8">
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ---------------- STEP 1: DECORATION ---------------- */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {isCustomRequest ? (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                  <h4 className="font-bold text-stone-900 text-sm">Custom Decoration Request</h4>
                  <p className="text-xs text-stone-600 mt-1">
                    Have your own design or Pinterest inspiration? You can describe your concept here and upload reference images in Step 5.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-800 mb-1">
                    Custom Concept Title / Theme Name
                  </label>
                  <input
                    type="text"
                    value={formData.decoration_name}
                    onChange={(e) => setFormData({ ...formData, decoration_name: e.target.value })}
                    placeholder="e.g. Royal Lotus Mandap with Pastel Orchid Ceiling"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-stone-800">
                  Choose Decoration Design
                </label>

                {selectedDecoration && (
                  <div className="p-4 rounded-2xl border-2 border-amber-500 bg-amber-50/40 flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={
                        selectedDecoration.images?.find((i) => i.is_primary)?.image_url ||
                        selectedDecoration.images?.[0]?.image_url ||
                        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80'
                      }
                      alt={selectedDecoration.name}
                      className="w-24 h-20 rounded-xl object-cover shadow"
                    />
                    <div className="flex-1 text-center sm:text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                        {selectedDecoration.category_name}
                      </span>
                      <h4 className="font-heading font-bold text-base sm:text-lg text-stone-900 mt-1">
                        {selectedDecoration.name}
                      </h4>
                      <p className="text-amber-800 font-bold text-sm">
                        {formatPriceDisplay(
                          selectedDecoration.min_price,
                          selectedDecoration.max_price,
                          selectedDecoration.price_display_type
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    Or switch to another decoration from catalog:
                  </label>
                  <select
                    value={formData.decoration_id}
                    onChange={(e) => handleDecorationChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm outline-none"
                  >
                    {decorations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({formatINR(d.min_price)} - {formatINR(d.max_price)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- STEP 2: EVENT DETAILS ---------------- */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Event Type *
                </label>
                <select
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 text-sm outline-none font-medium"
                >
                  {eventTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Event Start Time
                </label>
                <input
                  type="time"
                  value={formData.event_time}
                  onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Approx. Guest Count
                </label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={formData.guest_count}
                  onChange={(e) => setFormData({ ...formData, guest_count: parseInt(e.target.value) || 0 })}
                  placeholder="e.g. 250"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Special Requirements or Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.special_requirements}
                onChange={(e) => setFormData({ ...formData, special_requirements: e.target.value })}
                placeholder="e.g. Prefer yellow and white jasmine theme, stage width approx 28ft, require name board addition..."
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none"
              />
            </div>
          </div>
        )}

        {/* ---------------- STEP 3: VENUE ---------------- */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-stone-800">
                <input
                  type="checkbox"
                  checked={formData.venue_not_finalized}
                  onChange={(e) => setFormData({ ...formData, venue_not_finalized: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Venue not finalized yet</span>
              </label>
              {formData.venue_not_finalized && (
                <span className="text-xs text-amber-700 font-medium">We will discuss venue details later</span>
              )}
            </div>

            {!formData.venue_not_finalized && (
              <>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Venue / Function Hall Name *
                  </label>
                  <input
                    type="text"
                    value={formData.venue_name}
                    onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                    placeholder="e.g. Royal Palace Convention Centre / Home / Farmhouse"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Hyderabad"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="e.g. 500034"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Full Venue Address
                  </label>
                  <input
                    type="text"
                    value={formData.venue_address}
                    onChange={(e) => setFormData({ ...formData, venue_address: e.target.value })}
                    placeholder="e.g. Road No. 12, Banjara Hills, Near Metro Station"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Indoor or Outdoor Setup
                    </label>
                    <select
                      value={formData.indoor_outdoor}
                      onChange={(e: any) => setFormData({ ...formData, indoor_outdoor: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                    >
                      <option value="Indoor">Indoor (AC Hall / Banquet)</option>
                      <option value="Outdoor">Outdoor (Lawn / Poolside / Garden)</option>
                      <option value="Both">Both (Indoor Stage + Outdoor Entrance)</option>
                      <option value="Not Decided">Not Decided Yet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Venue Manager / Caretaker Contact
                    </label>
                    <input
                      type="text"
                      value={formData.venue_contact}
                      onChange={(e) => setFormData({ ...formData, venue_contact: e.target.value })}
                      placeholder="e.g. Manager Rajesh (+91 9988776655)"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ---------------- STEP 4: CUSTOMER ---------------- */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Your Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Phone Number (10 digits) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        phone: val,
                        whatsapp: sameAsPhone ? val : formData.whatsapp,
                      });
                    }}
                    placeholder="+91 98490 12345"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    WhatsApp Number
                  </label>
                  <label className="flex items-center gap-1 text-[11px] font-medium text-amber-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsPhone}
                      onChange={(e) => {
                        setSameAsPhone(e.target.checked);
                        if (e.target.checked) {
                          setFormData({ ...formData, whatsapp: formData.phone });
                        }
                      }}
                      className="w-3.5 h-3.5 rounded text-amber-600"
                    />
                    <span>Same as phone</span>
                  </label>
                </div>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    disabled={sameAsPhone}
                    value={sameAsPhone ? formData.phone : formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+91 98490 12345"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 disabled:bg-stone-100 focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Email Address (Optional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ---------------- STEP 5: REFERENCE IMAGES ---------------- */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-xs text-stone-600">
              Upload any photos or Pinterest ideas that inspire you (Optional, max 5 images).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {formData.reference_images.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                  <img src={img} alt="Reference" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeReferenceImage(idx)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {formData.reference_images.length < 5 && (
                <label className="aspect-[4/3] rounded-xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50 flex flex-col items-center justify-center cursor-pointer transition-colors p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleReferenceImageUpload}
                    className="hidden"
                  />
                  <Upload className="w-6 h-6 text-amber-600 mb-1" />
                  <span className="text-xs font-bold text-stone-800">Add Reference Photo</span>
                  <span className="text-[10px] text-stone-500">JPG, PNG</span>
                </label>
              )}
            </div>
          </div>
        )}

        {/* ---------------- STEP 6: REVIEW ---------------- */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 divide-y divide-stone-200/80 text-sm space-y-3">
              <div className="flex items-center justify-between pb-3">
                <span className="text-stone-500">Decoration Concept:</span>
                <span className="font-bold text-stone-900">
                  {isCustomRequest ? formData.decoration_name || 'Custom Concept' : selectedDecoration?.name}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-stone-500">Event & Date:</span>
                <span className="font-semibold text-stone-900">
                  {formData.event_type} • {formData.event_date} ({formData.event_time})
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-stone-500">Venue:</span>
                <span className="font-semibold text-stone-900 text-right">
                  {formData.venue_not_finalized ? 'Venue not finalized' : `${formData.venue_name}, ${formData.city}`}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-stone-500">Customer:</span>
                <span className="font-semibold text-stone-900">
                  {formData.customer_name} ({formData.phone})
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-stone-500">Estimated Price Range:</span>
                <span className="font-heading font-bold text-base text-amber-700">
                  {selectedDecoration
                    ? formatPriceDisplay(
                        selectedDecoration.min_price,
                        selectedDecoration.max_price,
                        selectedDecoration.price_display_type
                      )
                    : '₹15,000 – ₹40,000 (To be finalized)'}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
              ℹ️ <strong>Note:</strong> Submitting this enquiry does not charge you anything. Our team will review availability for your event date and contact you directly via phone / WhatsApp.
            </div>
          </div>
        )}

        {/* Navigation / Action Buttons */}
        <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-sm font-semibold hover:bg-stone-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-md hover:shadow transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white text-base font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              <Check className="w-5 h-5" />
              <span>{loading ? 'Submitting Enquiry...' : 'Submit Booking Request'}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
