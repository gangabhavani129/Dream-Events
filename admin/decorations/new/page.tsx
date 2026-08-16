'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X, Sparkles, Check, Clock } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import ImageUploader from '@/components/ImageUploader';
import { dataStore } from '@/lib/data-store';
import { Category, DecorationImage, PriceDisplayType } from '@/lib/types';

export default function AddDecorationPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [minPrice, setMinPrice] = useState<number | string>(25000);
  const [maxPrice, setMaxPrice] = useState<number | string>(40000);
  const [priceDisplayType, setPriceDisplayType] = useState<PriceDisplayType>('Price Range');
  const [setupDuration, setSetupDuration] = useState('4 to 5 hours');
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);

  // Tag lists
  const [includedItems, setIncludedItems] = useState<string[]>([
    '24ft Floral Backdrop with fresh roses & carnations',
    'Luxury Couple Sofa / Maharaja Chairs',
    'Warm LED Spotlights and Footlights (12 units)',
    'Stage Floor Carpet & Entrance Runner'
  ]);
  const [newIncludedItem, setNewIncludedItem] = useState('');

  const [customizationOptions, setCustomizationOptions] = useState<string[]>([
    'Color theme modification (Pastel / Red & Gold / Marigold)',
    'Fresh flower density upgrade (Orchids & Lilies)',
    'Customized Couple Initial Monogram Board'
  ]);
  const [newCustomOption, setNewCustomOption] = useState('');

  // Photos
  const [images, setImages] = useState<DecorationImage[]>([
    {
      id: 'img-new-1',
      decoration_id: '',
      image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      display_order: 1,
      is_primary: true
    }
  ]);

  useEffect(() => {
    dataStore.getCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0) {
        setCategoryId(cats[0].id);
      }
    });
  }, []);

  const handleAddIncludedItem = () => {
    if (!newIncludedItem.trim()) return;
    setIncludedItems([...includedItems, newIncludedItem.trim()]);
    setNewIncludedItem('');
  };

  const handleRemoveIncludedItem = (index: number) => {
    setIncludedItems(includedItems.filter((_, i) => i !== index));
  };

  const handleAddCustomOption = () => {
    if (!newCustomOption.trim()) return;
    setCustomizationOptions([...customizationOptions, newCustomOption.trim()]);
    setNewCustomOption('');
  };

  const handleRemoveCustomOption = (index: number) => {
    setCustomizationOptions(customizationOptions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter a decoration name.');
      return;
    }
    if (!categoryId) {
      setErrorMsg('Please select a category.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      await dataStore.saveDecoration({
        name: name.trim(),
        category_id: categoryId,
        description: description.trim(),
        min_price: Number(minPrice) || 0,
        max_price: Number(maxPrice) || 0,
        price_display_type: priceDisplayType,
        setup_duration: setupDuration.trim(),
        included_items: includedItems,
        customization_options: customizationOptions,
        active,
        featured,
        images,
      });

      router.push('/admin/decorations');
    } catch (err: any) {
      console.error('Save failed:', err);
      setErrorMsg('Failed to save decoration. Please check the inputs.');
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/decorations"
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-heading text-2xl font-bold text-stone-900">
                Add New Decoration
              </h1>
              <p className="text-xs text-stone-500">
                Publish a new stage, mandap, or birthday decoration to your catalog.
              </p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-8">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-stone-100 pb-2">
              1. Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Decoration Title / Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Rose Floral Wedding Stage"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 text-sm outline-none font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Estimated Setup Duration
                </label>
                <input
                  type="text"
                  value={setupDuration}
                  onChange={(e) => setSetupDuration(e.target.value)}
                  placeholder="e.g. 4 to 5 hours prior to event"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                Description & Aesthetic Details
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the flowers used (Dutch roses, carnations, orchids), backdrop materials, lighting style and recommended event types..."
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Section 2: Pricing */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-stone-100 pb-2">
              2. Price Configuration (INR ₹)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Price Display Format
                </label>
                <select
                  value={priceDisplayType}
                  onChange={(e: any) => setPriceDisplayType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 text-sm outline-none"
                >
                  <option value="Price Range">Price Range (Min – Max)</option>
                  <option value="Starting From">Starting From (Min)</option>
                  <option value="Price on Request">Price on Request</option>
                </select>
              </div>

              {priceDisplayType !== 'Price on Request' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                      Minimum Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm font-semibold outline-none"
                    />
                  </div>

                  {priceDisplayType === 'Price Range' && (
                    <div>
                      <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                        Maximum Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm font-semibold outline-none"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Section 3: Photos */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-stone-100 pb-2">
              3. Photos & Gallery
            </h2>
            <ImageUploader images={images} onChange={setImages} maxImages={12} />
          </div>

          {/* Section 4: Included Items Checklist */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-stone-100 pb-2">
              4. Included Items Checklist
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={newIncludedItem}
                onChange={(e) => setNewIncludedItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIncludedItem();
                  }
                }}
                placeholder="e.g. 24ft Floral Backdrop / Royal Maharaja Sofa / 12 Warm Focus Lights"
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm outline-none"
              />
              <button
                type="button"
                onClick={handleAddIncludedItem}
                className="px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800"
              >
                + Add Item
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {includedItems.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium"
                >
                  <span>✓ {item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIncludedItem(idx)}
                    className="text-stone-400 hover:text-red-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 5: Customization Options */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-stone-100 pb-2">
              5. Customization Options
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={newCustomOption}
                onChange={(e) => setNewCustomOption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomOption();
                  }
                }}
                placeholder="e.g. Pastel rose color palette upgrade / Cold pyro fireworks entry"
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomOption}
                className="px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800"
              >
                + Add Option
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {customizationOptions.map((opt, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-900 border border-rose-200 text-xs font-medium"
                >
                  <span>★ {opt}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomOption(idx)}
                    className="text-stone-400 hover:text-red-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 6: Visibility Settings */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-900 block">Catalog Visibility</span>
                <span className="text-[11px] text-stone-500">Show this decoration on the live customer catalog</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-900 block">Featured on Homepage</span>
                <span className="text-[11px] text-stone-500">Highlight in top 6 designs on website home</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
            <Link
              href="/admin/decorations"
              className="px-5 py-3 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-bold text-sm shadow-lg shadow-amber-600/30 hover:shadow-xl transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Publishing Decoration...' : 'Publish Decoration'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
