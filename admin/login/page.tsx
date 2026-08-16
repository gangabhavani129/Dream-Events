'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, KeyRound, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState('chnishantpoco123@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/admin');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const res = await login(email, password);
    if (res.success) {
      router.push('/admin');
    } else {
      setErrorMsg(res.error || 'Invalid login credentials.');
      setSubmitting(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('chnishantpoco123@gmail.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2.5 mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-rose-600 flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
        </Link>
        <h2 className="font-heading text-3xl font-extrabold text-white tracking-tight">
          Admin Portal Sign In
        </h2>
        <p className="text-xs sm:text-sm text-stone-400">
          Manage decoration catalog, customer bookings, calendar & settings
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-stone-900 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-stone-800 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@utsavdecor.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-950 border border-stone-700 text-white placeholder:text-stone-600 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-950 border border-stone-700 text-white placeholder:text-stone-600 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-bold text-sm shadow-lg shadow-amber-600/30 hover:shadow-xl transition-all disabled:opacity-50 mt-2"
            >
              <span>{submitting ? 'Signing in...' : 'Sign In to Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-click Demo helper */}
          <div className="pt-4 border-t border-stone-800 text-center space-y-2">
            <div className="text-[11px] text-stone-400 flex items-center justify-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Owner credentials:</span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-mono font-semibold transition-colors"
            >
              chnishantpoco123@gmail.com (or 9064177811) / admin123
            </button>
          </div>

          <div className="text-center">
            <Link href="/" className="text-xs text-stone-500 hover:text-stone-400">
              ← Back to Customer Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
