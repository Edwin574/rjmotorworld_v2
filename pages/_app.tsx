import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from '../components/ui/toaster';
import { AuthProvider } from '../contexts/AdminAuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles.css';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}