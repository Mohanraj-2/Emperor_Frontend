import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomeClient from '@/components/HomeClient';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/lib/types';

async function getData() {
  const [featuredRes, bestsellersRes, newArrivalsRes, categoriesRes] = await Promise.all([
    supabase.from('products').select('*, categories(*)').eq('is_featured', true).limit(6),
    supabase.from('products').select('*, categories(*)').eq('is_bestseller', true).limit(5),
    supabase.from('products').select('*, categories(*)').eq('is_new_arrival', true).limit(4),
    supabase.from('categories').select('*').order('display_order'),
  ]);
  return {
    featured: (featuredRes.data as Product[]) || [],
    bestsellers: (bestsellersRes.data as Product[]) || [],
    newArrivals: (newArrivalsRes.data as Product[]) || [],
    categories: (categoriesRes.data as Category[]) || [],
  };
}

export default async function HomePage() {
  const data = await getData();
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HomeClient {...data} />
      <Footer />
    </main>
  );
}
