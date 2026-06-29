'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Crown, Mail, Lock, Eye, EyeOff, User, Loader2, ArrowRight, Check } from 'lucide-react';

const schema = z.object({
  full_name: z.string().min(2, 'Full name required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name } },
    });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push('/dashboard'), 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">Welcome to the Empire!</h2>
          <p className="font-poppins text-gray-500 text-sm">Your account has been created. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 justify-center">
            <div className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-gray-900" />
            </div>
            <div className="text-left">
              <div className="font-playfair font-bold text-white text-2xl">EMPIRE</div>
              <div className="font-poppins text-[10px] text-pink-300 tracking-[0.3em] uppercase">— LIFESTYLE —</div>
            </div>
          </Link>
          <p className="font-poppins text-gray-300 text-sm mt-4">Join the Empire today</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
              <p className="font-poppins text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register('full_name')}
                  placeholder="Rahul Sharma"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm font-poppins outline-none transition-colors ${errors.full_name ? 'border-red-300' : 'border-gray-200 focus:border-pink-400'}`}
                />
              </div>
              {errors.full_name && <p className="text-red-500 text-xs font-poppins mt-1">{errors.full_name.message}</p>}
            </div>

            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm font-poppins outline-none transition-colors ${errors.email ? 'border-red-300' : 'border-gray-200 focus:border-pink-400'}`}
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
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  className={`w-full pl-10 pr-10 py-3 border rounded-xl text-sm font-poppins outline-none transition-colors ${errors.password ? 'border-red-300' : 'border-gray-200 focus:border-pink-400'}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPass ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs font-poppins mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register('confirm_password')}
                  type="password"
                  placeholder="Repeat your password"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm font-poppins outline-none transition-colors ${errors.confirm_password ? 'border-red-300' : 'border-gray-200 focus:border-pink-400'}`}
                />
              </div>
              {errors.confirm_password && <p className="text-red-500 text-xs font-poppins mt-1">{errors.confirm_password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-navy justify-center py-4 rounded-xl text-sm mt-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-poppins text-xs text-gray-500">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-gray-900 font-semibold hover:text-pink-500 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center font-poppins text-xs text-gray-500 mt-6">
          &copy; 2025 Empire Lifestyle
        </p>
      </div>
    </div>
  );
}
