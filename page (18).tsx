'use client';

import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  X,
  Sparkles,
  Save
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { dataStore, subscribeToDataChanges } from '@/lib/data-store';
import { GalleryItem } from '@/lib/types';

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [categoryName, setCategoryName] = useState('Weddings');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const loadGallery = async () => {
    const list = await dataStore.getGallery();
    setGallery(list);
  };

  useEffect(() => {
    loadGallery();
    const unsub = subscribeToDataChanges(loadGallery);
    return () => unsub();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await dataStore.uploadImage(file, 'decoration-images');
      setImageUrl(url);
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl) return;

    await dataStore.saveGalleryItem({
      title: title.trim(),
      category_name: categoryName,
      description: description.trim(),
      image_url: imageUrl,
      active: true,
    });

    setTitle('');
    setDescription('');
    setImageUrl('');
    setShowAddModal(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this photo from the gallery?')) {
      await dataStore.deleteGalleryItem(id);
    }
  };

  const handleToggleActive = async (item: GalleryItem) => {
    await dataStore.saveGalleryItem({
      ...item,
      active: !item.active,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900">
              Gallery Photo Manager
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Upload high-resolution event photos to showcase your real decoration projects.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Upload Photo to Gallery</span>
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl overflow-hidden border shadow-sm flex flex-col justify-between ${
                item.active ? 'border-stone-200' : 'border-stone-300 opacity-60 bg-stone-100'
              }`}
            >
              <div>
                <div className="relative aspect-[4/3] bg-stone-100">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/70 text-amber-300">
                    {item.category_name}
                  </span>
                </div>

                <div className="p-3.5 space-y-1">
                  <h4 className="font-bold text-stone-900 text-xs line-clamp-1">{item.title}</h4>
                  {item.description && (
                    <p className="text-[11px] text-stone-500 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>

              <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleActive(item)}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    item.active ? 'text-emerald-700 bg-emerald-50' : 'text-stone-600 bg-stone-200'
                  }`}
                >
                  {item.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{item.active ? 'Visible' : 'Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-heading text-lg font-bold text-stone-900">Upload Gallery Photo</h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                    Photo Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Royal South Indian Marigold Mandap"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                    Category Tag *
                  </label>
                  <select
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm outline-none"
                  >
                    <option value="Weddings">Weddings</option>
                    <option value="Stages">Stages</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Birthdays">Birthdays</option>
                    <option value="Engagements">Engagements</option>
                    <option value="Baby Events">Baby Events</option>
                    <option value="Flower Decorations">Flower Decorations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Executed at Hitex Convention Hall with 3,000 fresh marigolds..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                    Photo Image *
                  </label>
                  {imageUrl ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-stone-200">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="aspect-video rounded-xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                      <Upload className="w-6 h-6 text-amber-600 mb-1" />
                      <span className="text-xs font-bold text-stone-800">
                        {uploading ? 'Processing Image...' : 'Click to Upload Image'}
                      </span>
                      <span className="text-[10px] text-stone-500">JPG, PNG, WebP</span>
                    </label>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!title || !imageUrl}
                    className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md disabled:opacity-50"
                  >
                    Save Photo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
