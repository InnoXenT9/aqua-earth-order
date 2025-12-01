import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/cart-provider';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'AquaOrder',
  description: 'Order your favorite cold drinks online.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#F97316" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          'flex flex-col'
        )}
      >
        <FirebaseClientProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
          </CartProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}