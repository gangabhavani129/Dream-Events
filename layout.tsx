import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Dream Events | Premium Flower Decorations & Event Styling',
  description: 'Dream Events by Nishant - Explore elegant flower decorations, wedding stages, traditional mandaps, birthday setups and customized event decorations.',
  keywords: 'Dream Events, flower decoration, wedding stage, mandap decoration, haldi decor, mehendi setup, birthday balloons, baby shower decor, event management',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FAF6F0] text-stone-800 antialiased selection:bg-amber-200 selection:text-amber-900 pb-16 md:pb-0">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
