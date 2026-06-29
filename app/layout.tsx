import './globals.css';
import type { Metadata } from 'next';
import StoreHydration from '@/components/StoreHydration';

export const metadata: Metadata = {
  title: 'Empire Lifestyle – Premium Luxury Fashion',
  description: 'Luxury is not about brands. It\'s about the lifestyle you build. Shop premium T-shirts, hoodies, jewellery, accessories and more.',
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
        <StoreHydration />
        {children}
      </body>
    </html>
  );
}
