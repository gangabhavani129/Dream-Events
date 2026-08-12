'use client';

import React, { useState } from 'react';
import { Upload, X, Star, ArrowLeft, ArrowRight, ImagePlus, Loader2, Sparkles } from 'lucide-react';
import { DecorationImage } from '@/lib/types';
import { dataStore } from '@/lib/data-store';

interface ImageUploaderProps {
  images: DecorationImage[];
  onChange: (images: DecorationImage[]) => void;
  maxImages?: number;
}

const CURATED_DEMO_PHOTOS = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
];

export default function ImageUploader({
  images,
  onChange,
  maxImages = 10
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMessage('');

    try {
      const newImageList: DecorationImage[] = [...images];

      for (let i = 0; i < files.length; i++) {
        if (newImageList.length >= maxImages) break;
        const file = files[i];
        const uploadedUrl = await dataStore.uploadImage(file, 'decoration-images');

        newImageList.push({
          id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          decoration_id: '',
          image_url: uploadedUrl,
          display_order: newImageList.length + 1,
          is_primary: newImageList.length === 0, // First uploaded is primary by default
        });
      }

      onChange(newImageList);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setErrorMessage('Image upload failed. Please try again or select smaller images.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const setPrimary = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    onChange(updated);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    // If the removed image was primary, make the first remaining primary
    if (updated.length > 0 && !updated.some((img) => img.is_primary)) {
      updated[0].is_primary = true;
    }
    onChange(updated);
  };

  const moveLeft = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const moveRight = (index: number) => {
    if (index === images.length - 1) return;
    const updated = [...images];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const addStockPhoto = (url: string) => {
    if (images.length >= maxImages) return;
    const newImg: DecorationImage = {
      id: `img-stock-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      decoration_id: '',
      image_url: url,
      display_order: images.length + 1,
      is_primary: images.length === 0,
    };
    onChange([...images, newImg]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-sm font-semibold text-stone-800">
          Decoration Photos ({images.length}/{maxImages})
        </label>

        <button
          type="button"
          onClick={() => setShowStockModal(!showStockModal)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{showStockModal ? 'Hide Stock Photos' : 'Choose from Curated Floral Library'}</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
          {errorMessage}
        </div>
      )}

      {/* Stock photo picker */}
      {showStockModal && (
        <div className="p-4 bg-stone-50 border border-amber-200 rounded-2xl space-y-3">
          <p className="text-xs text-stone-600 font-medium">
            Click any demo image below to instantly add it to this decoration:
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {CURATED_DEMO_PHOTOS.map((url, i) => (
              <div
                key={i}
                onClick={() => addStockPhoto(url)}
                className="relative aspect-video rounded-lg overflow-hidden border-2 border-stone-200 hover:border-amber-500 cursor-pointer group transition-all"
              >
                <img src={url} alt="Stock Demo" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                  + Add
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
        {images.map((img, idx) => (
          <div
            key={img.id || idx}
            className={`relative group rounded-xl overflow-hidden border-2 bg-stone-100 transition-all ${
              img.is_primary ? 'border-amber-500 shadow-md ring-2 ring-amber-400/30' : 'border-stone-200'
            }`}
          >
            <div className="aspect-[4/3] w-full">
              <img
                src={img.image_url}
                alt={`Photo ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Primary badge */}
            {img.is_primary ? (
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                <Star className="w-3 h-3 fill-white" />
                <span>Primary</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPrimary(idx)}
                className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 hover:bg-amber-600 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Set Primary
              </button>
            )}

            {/* Delete button */}
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 shadow transition-colors"
              title="Delete Photo"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Reorder controls */}
            <div className="absolute bottom-2 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-white">
              <button
                type="button"
                onClick={() => moveLeft(idx)}
                disabled={idx === 0}
                className="p-1 disabled:opacity-30 hover:text-amber-400"
                title="Move Left"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-medium">#{idx + 1}</span>
              <button
                type="button"
                onClick={() => moveRight(idx)}
                disabled={idx === images.length - 1}
                className="p-1 disabled:opacity-30 hover:text-amber-400"
                title="Move Right"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Upload Slot */}
        {images.length < maxImages && (
          <label className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/80 flex flex-col items-center justify-center cursor-pointer transition-all p-4 text-center group">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-amber-700">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs font-semibold">Processing...</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-stone-800">
                  Upload Photos
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5">
                  JPG, PNG, WebP (Multiple)
                </span>
              </>
            )}
          </label>
        )}
      </div>

      <p className="text-[11px] text-stone-500">
        Tip: The primary photo will be displayed on the catalog card and hero headers. You can click &quot;Set Primary&quot; on any photo.
      </p>
    </div>
  );
}
