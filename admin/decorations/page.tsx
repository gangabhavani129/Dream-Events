'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  Search,
  Sparkles,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Check
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { dataStore, subscribeToDataChanges } from '@/lib/data-store';
import { Decoration, Category } from '@/lib/types';
import { formatPriceDisplay, formatINR } from '@/lib/utils';

export default function AdminDecorationsPage() {
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [allDecs, allCats] = await Promise.all([
        dataStore.getDecorations(),
        dataStore.getCategories()
      ]);
      setDecorations(allDecs);
      setCategories(allCats);
    } catch (e) {
      console.error('Error fetching decorations:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToDataChanges(loadData);
    return () => unsub();
  }, []);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    await dataStore.toggleDecorationActive(id, !currentStatus);
  };

  const handleDelete = async (id: string) => {
    await dataStore.deleteDecoration(id);
    setConfirmDeleteId(null);
  };

  const handleResetSampleData = () => {
    if (window.confirm('Reset catalog to initial sample data with 14 rich flower decoration designs?')) {
      dataStore.resetToSampleData();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all decorations so you can add your own real photos and data?')) {
      dataStore.clearAllData();
    }
  };

  const filtered = decorations.filter((d) => {
    if (selectedCat !== 'all' && d.category_id !== selectedCat) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        d.name.toLowerCase().includes(q) ||
        (d.category_name && d.category_name.toLowerCase().includes(q)) ||
        d.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900">
              Decoration Catalog Management
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Add new designs, update price ranges, toggle visibility or replace photos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/decorations/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white text-xs font-bold shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add New Decoration</span>
            </Link>

            <button
              type="button"
              onClick={handleResetSampleData}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-amber-800 text-xs font-semibold shadow-sm transition-colors"
              title="Reload initial demo decorations"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by decoration name, flower type or description..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm outline-none"
            />
          </div>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-700 outline-none"
          >
            <option value="all">All Categories ({decorations.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Decorations Grid / Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dec) => {
            const primaryImg =
              dec.images?.find((img) => img.is_primary)?.image_url ||
              dec.images?.[0]?.image_url ||
              'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80';

            const priceText = formatPriceDisplay(dec.min_price, dec.max_price, dec.price_display_type);

            return (
              <div
                key={dec.id}
                className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-all flex flex-col justify-between ${
                  dec.active ? 'border-stone-200' : 'border-stone-300 opacity-60 bg-stone-50'
                }`}
              >
                <div>
                  {/* Photo area */}
                  <div className="relative aspect-[16/10] bg-stone-100">
                    <img src={primaryImg} alt={dec.name} className="w-full h-full object-cover" />

                    {/* Active toggle button */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(dec.id, dec.active)}
                      className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1 ${
                        dec.active
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-800 text-stone-300'
                      }`}
                      title="Click to toggle visibility on website"
                    >
                      {dec.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{dec.active ? 'Active on Catalog' : 'Hidden'}</span>
                    </button>

                    <span className="absolute top-3 right-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/70 text-amber-300">
                      {dec.category_name}
                    </span>
                  </div>

                  {/* Body info */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-heading text-base font-bold text-stone-900 line-clamp-1">
                      {dec.name}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {dec.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-xs">
                      <span className="text-stone-400 font-medium">Price:</span>
                      <strong className="text-amber-700 font-bold font-heading">{priceText}</strong>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/decorations/${dec.id}`}
                    target="_blank"
                    className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-200 text-xs font-semibold flex items-center gap-1"
                    title="View on Customer Site"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </Link>

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/decorations/${dec.id}/edit`}
                      className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1 border border-amber-200"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    {confirmDeleteId === dec.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDelete(dec.id)}
                          className="px-2 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 rounded-lg bg-stone-200 text-stone-700 text-[11px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(dec.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete Decoration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto space-y-4">
            <h3 className="font-heading text-lg font-bold text-stone-900">No decorations found</h3>
            <p className="text-xs text-stone-500">
              No decoration items match your current search or category filter.
            </p>
            <button
              type="button"
              onClick={handleResetSampleData}
              className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold"
            >
              Reset Sample Catalog
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
