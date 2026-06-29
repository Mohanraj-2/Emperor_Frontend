'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Crown, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (err) {
      setError(err.message === 'Invalid login credentials' ? 'Invalid email or password.' : err.message);
      setLoading(false);
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 justify-center">
            <div className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-navy-800" />
            </div>
            <div className="text-left">
              <div className="font-playfair font-bold text-white text-2xl">EMPIRE</div>
              <div className="font-poppins text-[10px] text-pink-300 tracking-[0.3em] uppercase">— LIFESTYLE —</div>
            </div>
          </Link>
          <p className="font-poppins text-navy-200 text-sm mt-4">Welcome back to the Empire</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="font-playfair text-2xl font-bold text-navy-800 mb-6 text-center">Sign In</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
              <p className="font-poppins text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm font-poppins outline-none transition-colors ${errors.email ? 'border-red-300' : 'border-gray-200 focus:border-navy-400'}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs font-poppins mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 border rounded-xl text-sm font-poppins outline-none transition-colors ${errors.password ? 'border-red-300' : 'border-gray-200 focus:border-navy-400'}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPass ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs font-poppins mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="font-poppins text-xs text-pink-500 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-navy justify-center py-4 rounded-xl text-sm"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-poppins text-xs text-gray-500">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-navy-800 font-semibold hover:text-pink-500 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center font-poppins text-xs text-navy-400 mt-6">
          &copy; 2025 Empire Lifestyle
        </p>
      </div>
    </div>
  );
}
