import './globals.css';
import type { Metadata } from 'next';
import { CartProvider } from '@/lib/cartContext';
import { WishlistProvider } from '@/lib/wishlistContext';
import { AuthProvider } from '@/lib/authContext';

export const metadata: Metadata = {
  title: 'Empire Lifestyle – Premium Luxury Fashion',
  description: "Luxury is not about brands. It's about the lifestyle you build. Shop premium T-shirts, hoodies, jewellery, accessories and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-poppins antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
